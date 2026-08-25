#!/bin/bash

# We will completely replace Register.tsx with a new version that includes Firebase Auth and Firestore logic
cat << 'INNER_EOF' > src/pages/Register.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { EventData } from '../types';
import { Seal } from '../components/Seal';
import { ArrowLeft, Plus, Trash2, LogIn } from 'lucide-react';
import { db, auth } from '../firebase';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';

export default function Register() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventData | null>(null);
  
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (u) {
        setFormData(prev => ({
          ...prev,
          full_name: u.displayName || '',
          email: u.email || ''
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    institute: '',
  });

  const [teamMembers, setTeamMembers] = useState<{ name: string, reg_number: string }[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{ reg_id: string, name: string, date: string, event: string } | null>(null);

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then(res => res.json())
      .then(data => setEvent(data))
      .catch(err => setServerError("Failed to load event details."));
  }, [id]);

  const handleBaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleTeamChange = (index: number, field: string, value: string) => {
    const newMembers = [...teamMembers];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setTeamMembers(newMembers);
  };

  const addTeamMember = () => {
    if (event?.max_team_size && teamMembers.length + 1 < event.max_team_size) {
      setTeamMembers([...teamMembers, { name: '', reg_number: '' }]);
    }
  };

  const removeTeamMember = (index: number) => {
    const newMembers = teamMembers.filter((_, i) => i !== index);
    setTeamMembers(newMembers);
  };

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
      setServerError("Failed to sign in. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);
    setIsSubmitting(true);
    
    if (!user) {
      setServerError("You must be logged in to register.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Validate
      const newErrors: Record<string, string> = {};
      if (formData.phone.length !== 10) newErrors.phone = "Phone number must be 10 digits";
      
      if (event?.type === 'group') {
        if (event.min_team_size && teamMembers.length + 1 < event.min_team_size) {
          newErrors.team_members = `Need at least ${event.min_team_size} members`;
        }
        const hasEmpty = teamMembers.some(m => !m.name.trim() || !m.reg_number.trim());
        if (hasEmpty) newErrors.team_members = "All team member details are required";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsSubmitting(false);
        return;
      }

      // Generate a unique registration ID (using user ID and event ID to prevent duplicates if needed, or random)
      const regId = `${user.uid}_${id}_${Date.now()}`;
      
      const payload: any = {
        event_id: id,
        user_id: user.uid,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        institute: formData.institute,
        createdAt: serverTimestamp()
      };

      if (event?.type === 'group') {
        payload.team_members = teamMembers;
      }

      await setDoc(doc(db, 'registrations', regId), payload);

      setConfirmation({
        reg_id: regId,
        name: formData.full_name,
        date: new Date().toLocaleDateString(),
        event: event?.name || 'Event'
      });
    } catch (error: any) {
      console.error(error);
      setServerError(error.message || "Failed to submit registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!event) return <div className="p-8 text-center font-black">Loading...</div>;

  if (confirmation) {
    return (
      <div className="max-w-xl mx-auto w-full px-4 py-16 text-center">
        <div className="brutal-card bg-[#22c55e] p-8 relative overflow-hidden">
          <div className="absolute top-4 right-4 w-16 h-16 bg-white border-4 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] flex items-center justify-center">
            <Seal category={event.category} size="md" />
          </div>
          <h2 className="text-4xl font-display font-black mb-2 text-black">You're registered!</h2>
          
          <div className="bg-[#ffea00] border-4 border-black rounded-xl p-6 my-8 text-left space-y-4 font-bold text-black shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
            <div className="flex justify-between border-b-2 border-black pb-2">
              <span className="text-black uppercase tracking-widest text-xs font-black">Event</span>
              <span className="font-black">{confirmation.event}</span>
            </div>
            <div className="flex justify-between border-b-2 border-black pb-2">
              <span className="text-black uppercase tracking-widest text-xs font-black">Name</span>
              <span>{confirmation.name}</span>
            </div>
            <div className="flex justify-between border-b-2 border-black pb-2">
              <span className="text-black uppercase tracking-widest text-xs font-black">Date</span>
              <span>{confirmation.date}</span>
            </div>
            <div className="flex justify-between pb-2">
              <span className="text-black uppercase tracking-widest text-xs font-black">Ref ID</span>
              <span className="font-mono text-sm">{confirmation.reg_id.split('_').pop()}</span>
            </div>
          </div>
          <div className="space-y-3">
            <Link to="/events" className="brutal-btn w-full py-4 text-xs bg-white text-black">
              Register for another event
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full px-4 py-6 md:py-8 pb-32">
      <Link to={`/events/${id}`} className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider text-black bg-white hover:bg-black hover:text-white border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:-translate-y-1 transition-colors mb-6 md:mb-8">
        <ArrowLeft size={16} /> Back
      </Link>

      <div className="mb-8 md:mb-10">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Seal category={event.category} size="sm" />
          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-black bg-white px-3 py-1 border-4 border-black shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
            {event.type}
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-black break-words">Register: {event.name}</h1>
      </div>

      {!user && (
        <div className="brutal-card bg-[#00e5ff] p-8 mb-8 text-center flex flex-col items-center">
          <h2 className="text-2xl font-black mb-4">Authentication Required</h2>
          <p className="font-bold mb-6 max-w-sm">You must log in with your Google account to register for DOC Blossoms 2026.</p>
          <button 
            onClick={handleLogin}
            className="brutal-btn bg-white text-black px-8 py-4 w-full md:w-auto text-lg gap-3"
          >
            <LogIn size={20} />
            Sign in with Google
          </button>
        </div>
      )}

      {user && (
        <>
          {serverError && (
            <div className="bg-red-500 text-white p-4 font-black mb-6 md:mb-8 border-4 border-black shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            <div className="brutal-card bg-[#a855f7] p-5 md:p-8 space-y-6">
              <div className="border-b-4 border-black pb-3 md:pb-4 flex justify-between items-center">
                <h3 className="font-display font-black text-2xl md:text-3xl text-black">Personal Details</h3>
                <span className="bg-white border-2 border-black px-2 py-1 text-xs font-black hidden md:block">
                  Logged in as {user.email}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-black uppercase tracking-widest text-black mb-2">Full Name *</label>
                <input 
                  name="full_name" type="text" required
                  value={formData.full_name} onChange={handleBaseChange}
                  className={`brutal-input w-full ${errors.full_name ? 'border-red-500 bg-red-100' : ''}`} 
                />
                {errors.full_name && <p className="text-black font-black text-sm mt-2 bg-white border-2 border-black inline-block px-2 py-1 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">{errors.full_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-black uppercase tracking-widest text-black mb-2">Email *</label>
                <input 
                  name="email" type="email" required
                  value={formData.email} onChange={handleBaseChange}
                  className={`brutal-input w-full ${errors.email ? 'border-red-500 bg-red-100' : ''}`} 
                />
                {errors.email && <p className="text-black font-black text-sm mt-2 bg-white border-2 border-black inline-block px-2 py-1 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-black mb-2">Phone (10 digits) *</label>
                  <input 
                    name="phone" type="tel" required
                    value={formData.phone} onChange={handleBaseChange}
                    className={`brutal-input w-full ${errors.phone ? 'border-red-500 bg-red-100' : ''}`} 
                  />
                  {errors.phone && <p className="text-black font-black text-sm mt-2 bg-white border-2 border-black inline-block px-2 py-1 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-black mb-2">Institute / Deanery *</label>
                  <input 
                    name="institute" type="text" required
                    value={formData.institute} onChange={handleBaseChange}
                    className={`brutal-input w-full ${errors.institute ? 'border-red-500 bg-red-100' : ''}`} 
                  />
                  {errors.institute && <p className="text-black font-black text-sm mt-2 bg-white border-2 border-black inline-block px-2 py-1 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">{errors.institute}</p>}
                </div>
              </div>
            </div>

            {event.type === 'group' && (
              <div className="brutal-card bg-[#22c55e] p-6 md:p-8 space-y-6">
                <div className="border-b-4 border-black pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h3 className="font-display font-black text-3xl text-black">Team Members</h3>
                  <span className="text-sm font-black text-black bg-marigold px-4 py-2 border-4 border-black shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">
                    Min {event.min_team_size} · Max {event.max_team_size}
                  </span>
                </div>

                <p className="text-sm font-bold text-black bg-white border-4 border-black p-3 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">You are Member 1. Add details for the rest of your team.</p>

                <div className="space-y-6">
                  {teamMembers.map((member, idx) => (
                    <div key={idx} className="bg-[#ffea00] p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] relative">
                      <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
                        <h4 className="font-black text-sm uppercase tracking-widest text-black">Member {idx + 2}</h4>
                        {event.min_team_size && teamMembers.length + 1 > event.min_team_size && (
                          <button 
                            type="button" 
                            onClick={() => removeTeamMember(idx)}
                            className="bg-black text-white hover:bg-red-500 p-2 border-4 border-black transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <input 
                          placeholder="Full Name" required
                          value={member.name} onChange={(e) => handleTeamChange(idx, 'name', e.target.value)}
                          className="brutal-input w-full" 
                        />
                        <input 
                          placeholder="Registration Number" required
                          value={member.reg_number} onChange={(e) => handleTeamChange(idx, 'reg_number', e.target.value)}
                          className="brutal-input w-full" 
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {event.max_team_size && teamMembers.length + 1 < event.max_team_size && (
                  <button 
                    type="button" onClick={addTeamMember}
                    className="brutal-btn bg-white text-black w-full py-4 text-xs gap-2"
                  >
                    <Plus size={20} /> Add Member
                  </button>
                )}
                {errors.team_members && <p className="text-black font-black text-sm mt-2 bg-white border-2 border-black inline-block px-2 py-1 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]">{errors.team_members}</p>}
              </div>
            )}

            {/* Sticky Submit Button */}
            <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t-4 border-black z-40 md:relative md:bg-transparent md:border-0 md:p-0 pb-safe">
              <div className="max-w-2xl mx-auto">
                <button 
                  type="submit" disabled={isSubmitting}
                  className="brutal-btn bg-[#ff3366] text-white w-full py-4 md:py-5 text-lg md:text-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Submit Registration'
                  )}
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
INNER_EOF
./update_register.sh

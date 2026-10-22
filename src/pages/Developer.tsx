import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Download, LogOut, ArrowLeft, Search, Building2, User, Phone, CheckCircle2, Loader2, DownloadCloud } from 'lucide-react';
import * as xlsx from 'xlsx';

export default function Developer() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        checkDevAuth(user);
      } else {
        setAuthenticated(false);
      }
    });
    return unsubscribe;
  }, []);

  const checkDevAuth = async (user: any) => {
    try {
      setLoadingData(true);
      const token = await user.getIdToken();
      const res = await fetch('/api/developer/events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events);
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
        if (res.status === 403) {
          setError('Access denied: You do not have developer authorization.');
        } else {
          setError('Authentication failed.');
        }
        await signOut(getAuth());
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during authentication.');
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await checkDevAuth(userCredential.user);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      setAuthenticated(false);
      setEvents([]);
      setSelectedEvent(null);
      setRegistrations([]);
    } catch (err) {
      console.error(err);
    }
  };

  const loadEventRegistrations = async (eventId: string) => {
    try {
      setLoadingData(true);
      const token = await getAuth().currentUser?.getIdToken();
      const res = await fetch(`/api/developer/events/${eventId}/registrations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data.registrations);
        setSelectedEvent(events.find(e => e.id === eventId));
      } else {
        alert('Failed to load registrations');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred loading registrations');
    } finally {
      setLoadingData(false);
    }
  };

  const downloadEventData = async (eventId: string) => {
    try {
      const token = await getAuth().currentUser?.getIdToken();
      const res = await fetch(`/api/developer/export/event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        const eventInfo = events.find(e => e.id === eventId);
        const safeName = eventInfo?.name.replace(/\\s+/g, '_') || 'Event';
        a.download = `Blossoms_${safeName}_Registrations.xlsx`;
        
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        alert('Failed to download data');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred downloading data');
    }
  };

  const downloadAllData = async () => {
    try {
      const token = await getAuth().currentUser?.getIdToken();
      const res = await fetch('/api/developer/export/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Blossoms_All_Registrations.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        alert('Failed to download all data');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred downloading data');
    }
  };

  const filteredEvents = events.filter(event => 
    categoryFilter === 'ALL' ? true : event.category.toLowerCase() === categoryFilter.toLowerCase()
  );

  const filteredRegistrations = registrations.filter(reg => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (reg.full_name && reg.full_name.toLowerCase().includes(query)) ||
      (reg.email && reg.email.toLowerCase().includes(query)) ||
      (reg.roll_number && reg.roll_number.toLowerCase().includes(query))
    );
  });

  const totalRegistrations = events.reduce((acc, event) => acc + event.registration_count, 0);

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF0F4] p-4">
        <div className="bg-white border border-[#242323]/25 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xs">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-['Cormorant_Garamond'] font-semibold italic text-[#242323] mb-2">
              Blossoms Developer
            </h1>
            <p className="text-sm font-['Inter'] text-stone-500">
              Internal utility for registration management.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#242323] font-['Inter'] mb-1">
                Developer Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-[#242323]/25 focus:border-[#242323] rounded-xl px-3 py-2 text-sm font-['Inter'] text-[#242323] focus:outline-none h-[42px]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#242323] font-['Inter'] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-[#242323]/25 focus:border-[#242323] rounded-xl px-3 py-2 text-sm font-['Inter'] text-[#242323] focus:outline-none h-[42px]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c33a3a] hover:bg-[#a82e2e] text-white rounded-xl py-3 text-xs font-bold uppercase tracking-widest font-['Inter'] transition-colors disabled:opacity-50 mt-2 cursor-pointer shadow-xs"
            >
              {loading ? 'Authenticating...' : 'Sign In as Developer'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF0F4] text-[#242323] font-['Inter'] flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-[#242323]/15 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <h1 className="font-['Cormorant_Garamond'] font-semibold italic text-2xl text-[#242323]">
            Blossoms<span className="text-[#c33a3a] not-italic font-['Inter'] text-sm ml-2 font-bold uppercase tracking-widest">Dev</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={downloadAllData}
            className="hidden sm:flex items-center gap-1.5 bg-[#F3EFEA] border border-[#242323]/20 hover:bg-[#e8e2da] px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
          >
            <DownloadCloud className="w-3.5 h-3.5" /> Download All
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-stone-500 hover:text-red-600 text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {selectedEvent ? (
          /* EVENT REGISTRATIONS VIEW */
          <div className="space-y-4">
            <button
              onClick={() => setSelectedEvent(null)}
              className="flex items-center gap-1.5 text-stone-500 hover:text-[#242323] text-xs font-bold uppercase tracking-widest transition-colors mb-4 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Events
            </button>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-['Barlow_Condensed'] uppercase tracking-wide text-[#242323]">
                  {selectedEvent.name}
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">
                  {selectedEvent.category} • {registrations.length} Registrations
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search name, email, roll no..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-2 bg-white border border-[#242323]/20 rounded-xl text-xs w-full sm:w-64 focus:outline-none focus:border-[#242323]"
                  />
                </div>
                <button
                  onClick={() => downloadEventData(selectedEvent.id)}
                  className="flex items-center justify-center gap-1.5 bg-[#242323] hover:bg-black text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" /> Export XLSX
                </button>
              </div>
            </div>

            <div className="bg-white border border-[#242323]/20 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#FDF0F4] border-b border-[#242323]/10">
                    <tr>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-500">Participant</th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-500">Roll No. / Prog</th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-500">Contact</th>
                      {selectedEvent.type === 'group' && (
                        <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-500">Team Members</th>
                      )}
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#242323]/10">
                    {filteredRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-stone-500 text-xs">
                          No registrations found.
                        </td>
                      </tr>
                    ) : (
                      filteredRegistrations.map((reg) => (
                        <tr key={reg.id} className="hover:bg-stone-50">
                          <td className="px-4 py-3 align-top">
                            <div className="font-medium text-[#242323]">{reg.full_name}</div>
                            <div className="text-xs text-stone-500">{reg.email}</div>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <div className="font-mono text-xs">{reg.roll_number}</div>
                            <div className="text-xs text-stone-500 truncate max-w-[150px]">{reg.programme}</div>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <div className="text-xs font-mono">{reg.phone}</div>
                          </td>
                          {selectedEvent.type === 'group' && (
                            <td className="px-4 py-3 align-top">
                              {Array.isArray(reg.team_members) && reg.team_members.length > 0 ? (
                                <ul className="space-y-1 text-xs">
                                  {reg.team_members.map((m: any, i: number) => (
                                    <li key={i} className="text-stone-600">
                                      <span className="font-medium text-[#242323]">{m.name}</span> <span className="font-mono text-[10px]">({m.reg_number})</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-xs text-stone-400">None provided</span>
                              )}
                            </td>
                          )}
                          <td className="px-4 py-3 align-top">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                              {reg.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* DASHBOARD & EVENTS LIST */
          <div className="space-y-6">
            
            {/* Dashboard Summary Widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-[#242323]/20 rounded-2xl p-5 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block mb-1">Total Events</span>
                  <span className="text-3xl font-['Barlow_Condensed']">{events.length}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#FDF0F4] flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#242323]" />
                </div>
              </div>
              <div className="bg-white border border-[#242323]/20 rounded-2xl p-5 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 block mb-1">Total Registrations</span>
                  <span className="text-3xl font-['Barlow_Condensed']">{totalRegistrations}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#FDF0F4] flex items-center justify-center">
                  <User className="w-5 h-5 text-[#242323]" />
                </div>
              </div>
            </div>

            {/* Events List */}
            <div className="bg-white border border-[#242323]/20 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-[#242323]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg font-bold uppercase tracking-wider font-['Inter'] text-[#242323]">Event Management</h2>
                
                <div className="flex flex-wrap gap-2">
                  {['ALL', 'MUSIC', 'THEATRE', 'DANCE', 'LITERARY', 'ART'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer ${
                        categoryFilter === cat 
                          ? 'bg-[#242323] text-white' 
                          : 'bg-[#FDF0F4] text-stone-600 hover:bg-[#e8e2da]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#FDF0F4] border-b border-[#242323]/10">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-500">Event Name</th>
                      <th className="px-4 sm:px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-500">Category</th>
                      <th className="px-4 sm:px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-500">Registrations</th>
                      <th className="px-4 sm:px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-stone-500 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#242323]/10">
                    {loadingData && events.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-stone-500">
                          <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                          <span className="text-xs">Loading events...</span>
                        </td>
                      </tr>
                    ) : filteredEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-stone-50 transition-colors group">
                        <td className="px-4 sm:px-6 py-4">
                          <div className="font-bold text-[#242323] uppercase text-xs">{event.name}</div>
                          <div className="text-[10px] text-stone-500 font-mono mt-0.5">{event.type}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <span className="inline-block px-2 py-0.5 bg-[#FDF0F4] rounded text-[10px] font-bold uppercase tracking-widest text-stone-600">
                            {event.category}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 font-mono text-[#242323]">
                          {event.registration_count}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-right">
                          <button
                            onClick={() => loadEventRegistrations(event.id)}
                            className="inline-flex items-center justify-center bg-white border border-[#242323]/20 hover:border-[#242323] hover:bg-[#FDF0F4] px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#242323] transition-all cursor-pointer shadow-xs"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

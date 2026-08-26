import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User as UserIcon, 
  Mail, 
  Hash, 
  Building2, 
  Calendar, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  LogOut, 
  Edit3, 
  X, 
  Users, 
  Sparkles,
  RefreshCw,
  ArrowLeft,
  Lock,
  Phone,
  ShieldCheck,
  ShieldAlert,
  Send,
  BookOpen,
  Eye,
  EyeOff
} from 'lucide-react';
import { auth } from '../firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut, 
  User 
} from 'firebase/auth';
import { AccountResponseData, UserRegistrationItem, UserProfile } from '../types';
import ProgressiveSignup from '../components/auth/ProgressiveSignup';

// Helper to test if email is a valid Christ University student email
function isChristUniversityEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim().toLowerCase();
  const regex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)+christuniversity\.in$/;
  return regex.test(trimmed);
}

export default function Account() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  
  // Account data states
  const [accountData, setAccountData] = useState<AccountResponseData | null>(null);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Interaction states
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [profileSaving, setProfileSaving] = useState<boolean>(false);
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    rollNumber: '',
    department: '',
    institute: 'Christ University',
    phone: ''
  });

  // Verification state feedback
  const [resendingVerification, setResendingVerification] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);
  const [refreshingAuth, setRefreshingAuth] = useState(false);

  // Password reset state
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);
  const [resetSubmitting, setResetSubmitting] = useState(false);

  // Auth Form States (for unauthenticated users)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authFullName, setAuthFullName] = useState('');
  const [authRollNumber, setAuthRollNumber] = useState('');
  const [authProgramme, setAuthProgramme] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMessage, setAuthSuccessMessage] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // 1. Listen for Firebase Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      if (user) {
        fetchAccountData(user);
      } else {
        setAccountData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch Account Data from Backend
  const fetchAccountData = useCallback(async (user: User) => {
    setLoadingData(true);
    setApiError(null);
    try {
      const token = await user.getIdToken().catch(() => '');
      const userEmail = user.email || '';

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-user-email': userEmail,
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`/api/account?email=${encodeURIComponent(userEmail)}`, {
        headers
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || 'Failed to retrieve account records.');
      }

      const data: AccountResponseData = await res.json();
      setAccountData(data);
      setProfileForm({
        fullName: data.user.fullName || data.user.name || user.displayName || '',
        rollNumber: data.user.rollNumber || data.user.roll_number || '',
        department: data.user.department || '',
        institute: data.user.institute || 'Christ University',
        phone: data.user.phone || data.user.contactNumber || ''
      });
    } catch (err: any) {
      console.error('Account fetch failure:', err);
      setApiError(err.message || 'Could not load account details. Please try again.');
    } finally {
      setLoadingData(false);
    }
  }, []);

  // 3. Handle Profile Update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const cleanRoll = profileForm.rollNumber.trim();
    if (!/^[0-9]{7}$/.test(cleanRoll)) {
      alert('Roll number must be exactly 7 digits.');
      return;
    }
    setProfileSaving(true);
    try {
      const token = await currentUser.getIdToken().catch(() => '');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-user-email': currentUser.email || '',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/account/profile', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email: currentUser.email,
          fullName: profileForm.fullName.trim(),
          rollNumber: profileForm.rollNumber.trim(),
          department: profileForm.department.trim(),
          institute: profileForm.institute.trim(),
          phone: profileForm.phone.trim()
        })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || 'Failed to update profile.');
      }

      // Refresh account data
      await fetchAccountData(currentUser);
      setIsEditingProfile(false);
    } catch (err: any) {
      console.error('Profile update error:', err);
      alert(err.message || 'Failed to save changes.');
    } finally {
      setProfileSaving(false);
    }
  };

  // 4. Handle Email Verification Check & Resend
  const handleResendVerification = async () => {
    if (!currentUser) return;
    setResendingVerification(true);
    setVerificationFeedback(null);
    try {
      await sendEmailVerification(currentUser);
      setVerificationFeedback('Verification link sent! Please check your university inbox.');
    } catch (err: any) {
      console.error('Resend verification error:', err);
      setVerificationFeedback(err.message || 'Failed to send verification email. Please try again later.');
    } finally {
      setResendingVerification(false);
    }
  };

  const handleRefreshVerificationStatus = async () => {
    if (!currentUser) return;
    setRefreshingAuth(true);
    try {
      await currentUser.reload();
      if (currentUser.emailVerified) {
        // Sync verified state to backend
        const token = await currentUser.getIdToken(true);
        await fetch('/api/account/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-email': currentUser.email || '',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            email: currentUser.email,
            emailVerified: true
          })
        }).catch(() => {});
        
        await fetchAccountData(currentUser);
        setVerificationFeedback('Email successfully verified! Welcome to Blossoms 2026.');
      } else {
        setVerificationFeedback('Email not verified yet. Please click the link in your university inbox.');
      }
    } catch (err: any) {
      console.error('Refresh status error:', err);
    } finally {
      setRefreshingAuth(false);
    }
  };

  // 5. Handle Password Reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setResetFeedback('PLEASE ENTER YOUR COLLEGE EMAIL.');
      return;
    }
    if (!isChristUniversityEmail(resetEmail)) {
      setResetFeedback('INVALID COLLEGE EMAIL.');
      return;
    }
    setResetSubmitting(true);
    setResetFeedback(null);
    try {
      await sendPasswordResetEmail(auth, resetEmail.trim().toLowerCase());
      setResetFeedback('PASSWORD RESET LINK SENT. PLEASE CHECK YOUR INBOX AND SPAM / JUNK FOLDER.');
    } catch (err: any) {
      console.error('Password reset error:', err);
      if (err.code === 'auth/user-not-found') {
        setResetFeedback('NO ACCOUNT FOUND FOR THIS EMAIL.');
      } else {
        setResetFeedback('COULD NOT SEND RESET LINK. PLEASE VERIFY YOUR EMAIL OR TRY AGAIN LATER.');
      }
    } finally {
      setResetSubmitting(false);
    }
  };

  // 7. Handle Email/Password Student Authentication
  const handleStudentAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthSubmitting(true);
    setAuthError(null);
    setAuthSuccessMessage(null);

    const email = authEmail.trim().toLowerCase();

    // Domain validation check
    if (!isChristUniversityEmail(email)) {
      setAuthError('INVALID COLLEGE EMAIL');
      setAuthSubmitting(false);
      return;
    }

    try {
      // ==========================================
      // LOGIN FLOW
      // ==========================================
      if (!authPassword) {
        setAuthError('PASSWORD REQUIRED');
        setAuthSubmitting(false);
        return;
      }

      const userCred = await signInWithEmailAndPassword(auth, email, authPassword);
      if (userCred.user) {
        // Sync with backend
        const token = await userCred.user.getIdToken();
        await fetch('/api/account/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-email': userCred.user.email || '',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            email: userCred.user.email,
            emailVerified: userCred.user.emailVerified
          })
        }).catch(() => {});
      }
    } catch (err: any) {
      console.error('Student Auth failure:', err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setAuthError('INCORRECT EMAIL OR PASSWORD. PLEASE CHECK OR RESET PASSWORD.');
      } else if (err.code === 'auth/too-many-requests') {
        setAuthError('TOO MANY ATTEMPTS. PLEASE WAIT OR RESET YOUR PASSWORD.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setAuthError('EMAIL/PASSWORD AUTHENTICATION IS NOT ENABLED.');
      } else {
        setAuthError('AUTHENTICATION FAILED. PLEASE TRY AGAIN.');
      }
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setAccountData(null);
    } catch (e) {
      console.error('Sign out error:', e);
    }
  };

  // Helper date formatter
  const formatEventDate = (d?: string) => {
    if (!d || d === 'TBA') return 'TBA';
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) 
      ? d 
      : parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
  };

  // -------------------------------------------------------------
  // VIEW: AUTHENTICATION LOADING
  // -------------------------------------------------------------
  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 text-[#242323]">
        <div className="w-8 h-8 border-2 border-[#242323] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold tracking-[0.25em] uppercase font-['Inter'] text-gray-600">
          Verifying Identity...
        </p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: UNAUTHENTICATED STATE (Login / Create Account Gateway)
  // -------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="w-full min-h-[calc(100vh-85px)] bg-[#FAF6F0] text-[#242323] px-4 sm:px-8 md:px-12 lg:px-16 pt-2 sm:pt-4 pb-8 md:pb-12 flex flex-col justify-start relative">
        
        {/* Main Spread Layout */}
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start py-2 sm:py-4">
          
          {/* Left Column: Editorial Display & Branding (Desktop / Tablet) */}
          <div className="lg:col-span-5 flex flex-col justify-between relative z-10 pt-1 sm:pt-2">
            <div>
              {/* Main Editorial Headline */}
              <h1 className="font-['Barlow_Condensed'] font-light uppercase tracking-tight text-5xl sm:text-6xl md:text-7xl lg:text-[84px] leading-[0.88] text-[#1C1A1A]">
                {authMode === 'login' ? (
                  <>
                    WELCOME<br />
                    <span className="font-normal">BACK</span>
                  </>
                ) : (
                  <>
                    CREATE<br />
                    <span className="font-normal">ACCOUNT</span>
                  </>
                )}
              </h1>

              {/* Coral Accent Line */}
              <div className="w-10 h-[2.5px] bg-[#c33a3a] my-5 sm:my-6" />
            </div>

            {/* Botanical Line Art & Side Meta Details */}
            <div className="hidden lg:flex items-end justify-between pt-12 mt-8 relative">
              {/* Soft Watercolor Blush & SVG Botanical Flower Art */}
              <div className="relative w-48 h-48 pointer-events-none select-none opacity-85">
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#c33a3a]/25 via-[#c33a3a]/15 to-transparent rounded-full blur-2xl pointer-events-none" />
                <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-[#9C8277]/70">
                  {/* Stem & Leaves */}
                  <path d="M70 190 C70 140 85 100 100 70" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M80 145 C60 135 50 115 55 100 C68 112 75 130 80 145" stroke="currentColor" strokeWidth="1" fill="#E8DDD3" fillOpacity="0.3" />
                  <path d="M92 120 C110 110 120 90 115 75 C102 88 95 105 92 120" stroke="currentColor" strokeWidth="1" fill="#E8DDD3" fillOpacity="0.3" />
                  {/* Flower Petals */}
                  <path d="M100 70 C85 45 95 20 115 25 C125 45 110 65 100 70 Z" stroke="currentColor" strokeWidth="1.2" fill="#FAF6F0" fillOpacity="0.7" />
                  <path d="M100 70 C75 60 65 35 80 22 C98 32 100 55 100 70 Z" stroke="currentColor" strokeWidth="1.2" fill="#FAF6F0" fillOpacity="0.7" />
                  <path d="M100 70 C115 55 140 50 142 70 C128 80 110 75 100 70 Z" stroke="currentColor" strokeWidth="1.2" fill="#FAF6F0" fillOpacity="0.7" />
                  <path d="M100 70 C90 85 85 105 105 108 C115 95 108 80 100 70 Z" stroke="currentColor" strokeWidth="1.2" fill="#FAF6F0" fillOpacity="0.7" />
                  <path d="M100 70 C68 80 60 98 75 106 C88 95 95 82 100 70 Z" stroke="currentColor" strokeWidth="1.2" fill="#FAF6F0" fillOpacity="0.7" />
                  {/* Flower Core */}
                  <circle cx="100" cy="70" r="3.5" fill="#c33a3a" />
                </svg>
              </div>

              {/* Side Meta Label */}
              <div className="flex items-center gap-2 text-[#737373] font-mono text-[9px] tracking-[0.25em] uppercase pb-2">
                <span>— BLOSSOMS 26</span>
                <span className="text-[#c33a3a] text-xs">✻</span>
              </div>
            </div>
          </div>

          {/* Right Column: Softly Curved Authentication Container */}
          <div className="lg:col-span-7 w-full max-w-[540px] mx-auto lg:ml-auto">
            <div className="bg-[#FAF7F2]/90 sm:bg-white/80 backdrop-blur-sm border border-[#242323]/10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] rounded-[28px] sm:rounded-[36px] px-6 sm:px-10 lg:px-12 py-7 sm:py-8 relative transition-all">
              
              {/* Rounded Segmented Toggle (Sign In / Create Account) */}
              <div className="rounded-full border border-[#242323]/20 p-1 bg-[#FAF7F2]/70 flex items-center mb-7 sm:mb-9">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setAuthError(null);
                    setAuthSuccessMessage(null);
                  }}
                  className={`flex-1 py-2.5 sm:py-3 px-4 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] font-['Inter'] transition-all cursor-pointer text-center ${
                    authMode === 'login'
                      ? 'bg-[#1C1A1A] text-[#FAF7F2] shadow-sm'
                      : 'text-[#242323]/70 hover:text-[#242323]'
                  }`}
                >
                  SIGN IN
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setAuthError(null);
                    setAuthSuccessMessage(null);
                  }}
                  className={`flex-1 py-2.5 sm:py-3 px-4 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] font-['Inter'] transition-all cursor-pointer text-center ${
                    authMode === 'signup'
                      ? 'bg-[#1C1A1A] text-[#FAF7F2] shadow-sm'
                      : 'text-[#242323]/70 hover:text-[#242323]'
                  }`}
                >
                  CREATE ACCOUNT
                </button>
              </div>

              {authMode === 'signup' ? (
                <ProgressiveSignup
                  onSuccess={(msg) => {
                    setAuthSuccessMessage(msg);
                    setAuthMode('login');
                  }}
                  onSwitchToLogin={(prefillEmail?: string) => {
                    if (prefillEmail) {
                      setAuthEmail(prefillEmail);
                    }
                    setAuthMode('login');
                    setAuthError(null);
                    setAuthSuccessMessage(null);
                  }}
                  isChristUniversityEmail={isChristUniversityEmail}
                />
              ) : (
                <>
                  {/* Inner Card Heading */}
                  <div className="mb-6">
                    <h2 className="font-['Barlow_Condensed'] text-3xl sm:text-4xl font-light uppercase tracking-wide text-[#1C1A1A]">
                      SIGN IN
                    </h2>
                    <div className="w-8 h-[2px] bg-[#c33a3a] mt-2" />
                  </div>

                  {/* Success Feedback Banner */}
                  {authSuccessMessage && (
                    <div className="mb-5 p-3.5 bg-white border border-[#242323]/20 rounded-2xl flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                      <p className="text-xs font-semibold tracking-wider uppercase font-['Inter'] text-[#242323]">
                        {authSuccessMessage}
                      </p>
                    </div>
                  )}

                  {/* Error Feedback Banner */}
                  {authError && (
                    <div className="mb-5 p-3.5 bg-white border border-[#c33a3a]/60 rounded-2xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-[#c33a3a] shrink-0" />
                        <p className="text-xs font-semibold tracking-wider uppercase font-['Inter'] text-[#242323]">
                          {authError}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAuthError(null)}
                        className="text-stone-400 hover:text-black cursor-pointer p-1"
                        aria-label="Dismiss error"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Login Form with Curved Inputs */}
                  <form onSubmit={handleStudentAuth} className="space-y-4 sm:space-y-4.5">
                    {/* College Email */}
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#242323]/80 font-['Inter'] mb-1.5">
                        COLLEGE EMAIL
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="email"
                          required
                          placeholder="yourname@programme.christuniversity.in"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          className="w-full bg-[#FAF7F2]/60 hover:bg-white focus:bg-white border border-[#242323]/25 focus:border-[#242323] rounded-2xl px-4.5 pr-11 h-[52px] text-sm font-['Inter'] text-[#242323] placeholder:text-stone-400 focus:outline-none transition-all"
                        />
                        <UserIcon className="w-4 h-4 text-stone-400 absolute right-4 pointer-events-none" />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#242323]/80 font-['Inter'] mb-1.5">
                        PASSWORD
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="Enter your password"
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          className="w-full bg-[#FAF7F2]/60 hover:bg-white focus:bg-white border border-[#242323]/25 focus:border-[#242323] rounded-2xl px-4.5 pr-11 h-[52px] text-sm font-['Inter'] text-[#242323] placeholder:text-stone-400 focus:outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 text-stone-400 hover:text-black cursor-pointer p-1 transition-colors"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="flex justify-end mt-2">
                        <button
                          type="button"
                          onClick={() => setShowPasswordReset(true)}
                          className="text-xs font-['Inter'] font-medium text-[#c33a3a] hover:underline transition-colors cursor-pointer"
                        >
                          Forgot password?
                        </button>
                      </div>
                    </div>

                    {/* Primary Curved CTA Button */}
                    <div className="pt-2 sm:pt-3">
                      <button
                        type="submit"
                        disabled={authSubmitting}
                        className="w-full bg-[#c33a3a] hover:bg-[#a82e2e] active:scale-[0.99] rounded-full text-white sm:text-[#FAF7F2] h-[52px] px-8 text-xs sm:text-sm font-bold uppercase tracking-[0.22em] transition-all disabled:opacity-50 font-['Inter'] cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                      >
                        <span>
                          {authSubmitting ? 'AUTHENTICATING...' : 'SIGN IN →'}
                        </span>
                      </button>
                    </div>
                  </form>

                  {/* Star Divider & Secondary Switcher */}
                  <div className="flex items-center justify-center gap-3 my-6">
                    <span className="h-[1px] bg-[#242323]/10 flex-1" />
                    <span className="text-[#c33a3a] text-xs">✻</span>
                    <span className="h-[1px] bg-[#242323]/10 flex-1" />
                  </div>

                  <div className="text-center text-xs sm:text-sm font-['Inter'] text-stone-600">
                    <p>
                      New here?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('signup');
                          setAuthError(null);
                          setAuthSuccessMessage(null);
                        }}
                        className="text-[#c33a3a] font-semibold hover:underline cursor-pointer transition-colors"
                      >
                        Create your account
                      </button>
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Password Reset Modal (Curved) */}
            {showPasswordReset && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[120] flex items-center justify-center p-4">
                <div className="bg-[#FAF7F2] border border-[#242323]/15 rounded-[28px] p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
                  <div className="flex items-center justify-between border-b border-[#242323]/10 pb-3 mb-4">
                    <span className="text-[11px] font-semibold tracking-[0.2em] uppercase font-['Inter'] text-[#242323]">
                      RESET PASSWORD
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordReset(false);
                        setResetFeedback(null);
                      }}
                      className="text-stone-400 hover:text-black cursor-pointer p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs font-['Inter'] text-stone-600 mb-4 leading-relaxed">
                    Enter your verified Christ University email address to receive password recovery instructions.
                  </p>

                  {resetFeedback && (
                    <div className="mb-4 p-3 bg-white border border-[#242323]/20 rounded-xl text-xs font-semibold uppercase tracking-wider font-['Inter'] text-[#242323]">
                      {resetFeedback}
                    </div>
                  )}

                  <form onSubmit={handlePasswordReset} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#242323]/80 font-['Inter'] mb-1.5">
                        COLLEGE EMAIL
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="email"
                          required
                          placeholder="yourname@programme.christuniversity.in"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          className="w-full bg-white hover:bg-white focus:bg-white border border-[#242323]/25 focus:border-[#242323] rounded-2xl px-4.5 pr-11 h-[52px] text-sm font-['Inter'] text-[#242323] focus:outline-none transition-all"
                        />
                        <Mail className="w-4 h-4 text-stone-400 absolute right-4 pointer-events-none" />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowPasswordReset(false)}
                        className="rounded-full border border-[#242323]/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider font-['Inter'] text-[#242323] hover:bg-black/5 cursor-pointer"
                      >
                        CLOSE
                      </button>
                      <button
                        type="submit"
                        disabled={resetSubmitting}
                        className="rounded-full bg-[#c33a3a] hover:bg-[#a82e2e] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider font-['Inter'] disabled:opacity-50 cursor-pointer shadow-sm"
                      >
                        {resetSubmitting ? 'SENDING...' : 'SEND RESET LINK →'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Editorial Sub-Footer Metadata */}
        <div className="max-w-7xl mx-auto w-full pt-8 mt-8 border-t border-[#242323]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase">
          <span>CHRIST (DEEMED TO BE UNIVERSITY)</span>
          <span>CAMPUS REGISTRATION PORTAL • 2026 EDITION</span>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: LOADING ACCOUNT DATA
  // -------------------------------------------------------------
  if (loadingData && !accountData) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 text-[#242323]">
        <div className="w-8 h-8 border-2 border-[#242323] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold tracking-[0.25em] uppercase font-['Inter'] text-gray-600">
          Retrieving Account Records...
        </p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: API ERROR STATE
  // -------------------------------------------------------------
  if (apiError && !accountData) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 text-center max-w-md mx-auto">
        <AlertCircle className="w-12 h-12 text-[#c33a3a] mb-6 stroke-[1.5]" />
        <h2 className="text-3xl font-normal uppercase font-['Barlow_Condensed'] text-[#242323] mb-2 tracking-wide">
          Account Information Could Not Be Loaded
        </h2>
        <p className="text-xs sm:text-sm font-['Inter'] text-gray-600 mb-8">
          {apiError || 'Please try again in a moment.'}
        </p>
        <button
          onClick={() => currentUser && fetchAccountData(currentUser)}
          className="inline-flex items-center gap-2 border border-[#242323] bg-[#FAF7F2] text-[#242323] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#242323] hover:text-[#FAF7F2] transition-colors font-['Inter']"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  const user = accountData?.user || {
    id: currentUser.uid,
    name: currentUser.displayName || '',
    fullName: currentUser.displayName || '',
    email: currentUser.email || '',
    rollNumber: '',
    department: '',
    phone: '',
    institute: 'Christ University',
    emailVerified: currentUser.emailVerified
  };

  const registrations = accountData?.registrations || [];
  const isVerified = currentUser.emailVerified || accountData?.user?.emailVerified;

  // Toggle registered event expansion
  const toggleEventExpansion = (regId: string) => {
    setExpandedEventId(prev => prev === regId ? null : regId);
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] text-[#242323]">
      {/* ========================================================
          EDIT PROFILE MODAL
          ======================================================== */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[100] flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] border border-[#242323]/25 rounded-2xl p-5 sm:p-6 max-w-md w-full relative shadow-xl">
            <div className="flex items-center justify-between border-b border-[#242323]/15 pb-2.5 mb-4">
              <span className="text-[10px] font-bold tracking-[0.22em] uppercase font-['Inter'] text-[#242323]">
                Edit Student Profile
              </span>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="text-stone-400 hover:text-black p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#242323] font-['Inter'] mb-1">
                  Full Name <span className="text-[#c33a3a]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  className="w-full bg-white border border-[#242323]/25 focus:border-[#242323] rounded-xl px-3 py-2 text-sm font-['Barlow_Condensed'] uppercase tracking-wider text-[#242323] focus:outline-none h-[40px]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#242323] font-['Inter'] mb-1">
                  Roll Number / Student ID <span className="text-[#c33a3a]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2147101"
                  value={profileForm.rollNumber}
                  onChange={(e) => setProfileForm({ ...profileForm, rollNumber: e.target.value })}
                  className="w-full bg-white border border-[#242323]/25 focus:border-[#242323] rounded-xl px-3 py-2 text-sm font-mono uppercase tracking-wider text-[#242323] focus:outline-none h-[40px]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#242323] font-['Inter'] mb-1">
                  Programme <span className="text-[#c33a3a]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BCom AFH / BCA / English"
                  value={profileForm.department}
                  onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                  className="w-full bg-white border border-[#242323]/25 focus:border-[#242323] rounded-xl px-3 py-2 text-sm font-['Barlow_Condensed'] uppercase tracking-wider text-[#242323] focus:outline-none h-[40px]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#242323] font-['Inter'] mb-1">
                  Contact Number <span className="text-[#c33a3a]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full bg-white border border-[#242323]/25 focus:border-[#242323] rounded-xl px-3 py-2 text-sm font-mono tracking-wider text-[#242323] focus:outline-none h-[40px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#242323]/15 mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="rounded-full border border-[#242323]/30 px-4 py-2 text-[11px] font-bold uppercase tracking-wider font-['Inter'] hover:bg-black/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="rounded-full bg-[#c33a3a] hover:bg-[#a82e2e] text-white px-5 py-2 text-[11px] font-bold uppercase tracking-wider font-['Inter'] disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {profileSaving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MAIN EDITORIAL CONTAINER
          ======================================================== */}
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 md:px-10 lg:px-12 py-4 sm:py-6 lg:py-6 xl:py-8">
        
        {/* Top Header Breadcrumb / Navigation */}
        <div className="flex items-center justify-between border-b border-[#242323]/15 pb-3 mb-4 sm:mb-5">
          <div className="flex items-center gap-3">
            <Link
              to="/events"
              className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold tracking-[0.2em] text-stone-500 hover:text-[#c33a3a] uppercase font-['Inter'] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Events
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase hidden sm:inline">
              STUDENT DOSSIER • BLOSSOMS 2026
            </span>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold tracking-[0.18em] uppercase text-stone-500 hover:text-red-700 font-['Inter'] transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Email Verification Banner (if unverified) */}
        {!isVerified && (
          <div className="mb-4 p-3.5 bg-amber-50 border border-amber-500/40 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider font-['Inter'] text-amber-900">
                  Email Verification Pending
                </h3>
                <p className="text-[11px] font-['Inter'] text-amber-800 mt-0.5">
                  A verification link was sent to <strong className="font-mono">{currentUser.email}</strong>. Please verify university email ownership.
                </p>
                {verificationFeedback && (
                  <p className="text-[10.5px] font-bold font-['Inter'] text-amber-900 mt-1.5 bg-amber-100/80 px-2 py-0.5 rounded inline-block">
                    {verificationFeedback}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button
                onClick={handleResendVerification}
                disabled={resendingVerification}
                className="bg-white border border-amber-800/40 text-amber-900 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-['Inter'] hover:bg-amber-100 disabled:opacity-50 flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3 h-3" /> {resendingVerification ? 'Sending...' : 'Resend Email'}
              </button>
              <button
                onClick={handleRefreshVerificationStatus}
                disabled={refreshingAuth}
                className="bg-amber-600 text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-['Inter'] hover:bg-amber-700 disabled:opacity-50 flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <RefreshCw className={`w-3 h-3 ${refreshingAuth ? 'animate-spin' : ''}`} /> Check Status
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            DESKTOP ASYMMETRIC GRID
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 xl:gap-8 items-start">
          
          {/* ========================================================
              LEFT COLUMN: USER IDENTITY DOSSIER (Sticky on Desktop)
              ======================================================== */}
          <div className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-20">
            
            {/* Identity Card */}
            <div className="bg-[#FAF7F2] border border-[#242323]/25 rounded-2xl p-4 sm:p-5 lg:p-5 xl:p-6 relative shadow-xs">
              <div className="flex items-center justify-between border-b border-[#242323]/15 pb-2.5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-[0.22em] text-[#c33a3a] uppercase font-['Inter']">
                    Student Profile
                  </span>
                  {isVerified ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-700/30 rounded-full text-[8.5px] font-bold uppercase tracking-wider font-['Inter']">
                      <ShieldCheck className="w-2.5 h-2.5 text-emerald-700" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-600/30 rounded-full text-[8.5px] font-bold uppercase tracking-wider font-['Inter']">
                      <ShieldAlert className="w-2.5 h-2.5 text-amber-700" /> Unverified
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-[#242323] hover:text-[#c33a3a] transition-colors font-['Inter'] cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
              </div>

              {/* Full Name */}
              <div className="mb-3">
                <span className="text-[8.5px] font-bold tracking-[0.18em] text-stone-500 uppercase font-['Inter'] block mb-0.5">
                  Full Name
                </span>
                <h2 className="text-2xl sm:text-3xl font-normal font-['Barlow_Condensed'] uppercase text-[#242323] tracking-tight leading-none">
                  {user.fullName || user.name || 'Student Participant'}
                </h2>
              </div>

              {/* Matrix of Identity Details */}
              <div className="space-y-2.5 border-t border-[#242323]/15 pt-3 text-left">
                {/* Roll Number */}
                <div className="flex items-start gap-2">
                  <Hash className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-[8.5px] font-bold tracking-[0.18em] text-stone-500 uppercase font-['Inter'] block">
                      Roll Number / Reg ID
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-[#242323] uppercase">
                      {user.rollNumber || user.roll_number || (
                        <button
                          onClick={() => setIsEditingProfile(true)}
                          className="text-[#c33a3a] underline text-[11px] font-['Inter'] tracking-wider uppercase font-semibold cursor-pointer"
                        >
                          + Set Roll Number
                        </button>
                      )}
                    </span>
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex items-start gap-2">
                  <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <div className="flex-1 overflow-hidden">
                    <span className="text-[8.5px] font-bold tracking-[0.18em] text-stone-500 uppercase font-['Inter'] block">
                      University Email
                    </span>
                    <span className="text-xs font-['Inter'] text-[#242323] font-medium break-all">
                      {user.email}
                    </span>
                  </div>
                </div>

                {/* Programme */}
                <div className="flex items-start gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-[8.5px] font-bold tracking-[0.18em] text-stone-500 uppercase font-['Inter'] block">
                      Programme
                    </span>
                    <span className="text-xs font-['Inter'] text-[#242323] uppercase">
                      {user.programme || user.department || (
                        <button
                          onClick={() => setIsEditingProfile(true)}
                          className="text-[#c33a3a] underline text-[11px] font-['Inter'] tracking-wider uppercase font-semibold cursor-pointer"
                        >
                          + Set Programme
                        </button>
                      )}
                    </span>
                  </div>
                </div>

                {/* Contact Phone */}
                <div className="flex items-start gap-2">
                  <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-[8.5px] font-bold tracking-[0.18em] text-stone-500 uppercase font-['Inter'] block">
                      Contact Mobile
                    </span>
                    <span className="text-xs font-mono text-[#242323]">
                      {user.phone || user.contactNumber || (
                        <button
                          onClick={() => setIsEditingProfile(true)}
                          className="text-[#c33a3a] underline text-[11px] font-['Inter'] tracking-wider uppercase font-semibold cursor-pointer"
                        >
                          + Set Contact Number
                        </button>
                      )}
                    </span>
                  </div>
                </div>

                {/* Organization / Institute */}
                <div className="flex items-start gap-2">
                  <Building2 className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="text-[8.5px] font-bold tracking-[0.18em] text-stone-500 uppercase font-['Inter'] block">
                      Institution
                    </span>
                    <span className="text-xs font-['Inter'] text-[#242323] uppercase">
                      {user.institute || 'Christ University'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Summary Pill */}
              <div className="mt-4 pt-3 border-t border-[#242323]/15 flex items-center justify-between">
                <span className="text-[9.5px] font-bold tracking-[0.18em] text-stone-500 uppercase font-['Inter']">
                  Registered Events
                </span>
                <span className="font-mono text-[11px] font-bold text-[#242323] bg-white border border-[#242323]/20 rounded-full px-2.5 py-0.5">
                  {registrations.length} {registrations.length === 1 ? 'EVENT' : 'EVENTS'}
                </span>
              </div>
            </div>

            {/* Editorial Fast Link to Explore */}
            <div className="bg-[#FAF7F2] border border-[#242323]/25 rounded-2xl p-4 hidden lg:block shadow-xs">
              <span className="text-[8.5px] font-bold tracking-[0.18em] text-stone-500 uppercase font-['Inter'] block mb-1">
                Explore The Festival
              </span>
              <p className="text-xs font-['Inter'] text-stone-600 mb-3 leading-snug">
                Discover all 17 flagship competitions across Music, Theatre, Dance, Art, and Literary categories.
              </p>
              <Link
                to="/events"
                className="w-full bg-white border border-[#242323]/25 rounded-full py-2 px-3.5 text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#242323] hover:bg-[#242323] hover:text-[#FAF7F2] transition-colors flex items-center justify-center gap-1.5 font-['Inter']"
              >
                Browse All 17 Events <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: REGISTERED EVENTS LISTING
              ======================================================== */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Header of Section */}
            <div className="border-b border-[#242323]/15 pb-2.5 flex flex-col sm:flex-row sm:items-end justify-between gap-1">
              <div>
                <span className="text-[9px] font-bold tracking-[0.22em] text-stone-500 uppercase font-['Inter'] block mb-0.5">
                  Festival Registration Ledger
                </span>
                <h1 className="text-2xl sm:text-3xl font-normal font-['Barlow_Condensed'] uppercase text-[#242323] tracking-tight leading-none">
                  My Registered Events
                </h1>
              </div>
              <span className="text-[10px] font-mono text-stone-500 uppercase">
                {registrations.length} Total {registrations.length === 1 ? 'Entry' : 'Entries'}
              </span>
            </div>

            {/* Empty State: No Registrations Yet */}
            {registrations.length === 0 ? (
              <div className="bg-[#FAF7F2] border border-[#242323]/25 rounded-2xl p-6 sm:p-10 text-center shadow-xs">
                <div className="w-10 h-10 rounded-full bg-white border border-[#242323]/20 flex items-center justify-center mx-auto mb-3 text-[#242323]">
                  <Sparkles className="w-4 h-4 text-[#c33a3a]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-normal font-['Barlow_Condensed'] uppercase text-[#242323] mb-1.5 tracking-wide">
                  No Active Registrations Found
                </h3>
                <p className="text-xs font-['Inter'] text-stone-600 max-w-md mx-auto mb-5 leading-relaxed">
                  You have not registered for any Blossoms 2026 events yet. Explore the 17 festival competitions and sign up for individual or team categories.
                </p>
                <Link
                  to="/events"
                  className="inline-flex items-center gap-2 bg-[#c33a3a] hover:bg-[#a82e2e] rounded-full text-white px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em] active:scale-[0.99] transition-all font-['Inter'] shadow-xs"
                >
                  Explore Events Registry <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              /* Populated State: Editorial Cards for Each Registration */
              <div className="space-y-3">
                {registrations.map((reg) => {
                  const isExpanded = expandedEventId === reg.id;
                  const isGroup = reg.event.type === 'group';
                  const teamCount = reg.teamMembers?.length || 0;

                  return (
                    <div 
                      key={reg.id}
                      className="bg-[#FAF7F2] border border-[#242323]/25 rounded-2xl overflow-hidden shadow-xs transition-all"
                    >
                      {/* Top Bar / Card Header */}
                      <div className="p-4 sm:p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#242323]/10 pb-2.5 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold tracking-[0.2em] text-[#c33a3a] uppercase font-['Inter']">
                              {reg.event.category}
                            </span>
                            <span className="text-stone-300">•</span>
                            <span className="text-[9.5px] font-mono tracking-wider text-stone-500 uppercase">
                              {isGroup ? `Group Event (${teamCount + 1} Members)` : 'Solo Event'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-600/30 rounded-full text-[9px] font-bold uppercase tracking-wider font-['Inter']">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> {reg.status}
                            </span>
                          </div>
                        </div>

                        {/* Title & Action Link */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                          <div>
                            <h3 className="text-xl sm:text-2xl font-normal font-['Barlow_Condensed'] uppercase text-[#242323] tracking-tight leading-none mb-1.5">
                              {reg.event.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-xs font-['Inter'] text-stone-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-stone-400" /> {formatEventDate(reg.event.date)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-stone-400" /> {reg.event.time_start || 'TBA'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <Link
                              to={`/events/${reg.eventId}`}
                              className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-[#242323] hover:text-[#c33a3a] border-b border-[#242323] font-['Inter']"
                            >
                              View Event Details
                            </Link>
                          </div>
                        </div>

                        {/* Summary Bar with Reference ID */}
                        <div className="bg-white/80 border border-[#242323]/15 rounded-xl px-3.5 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div>
                            <span className="text-[8.5px] font-bold tracking-[0.18em] text-stone-500 uppercase font-['Inter'] mr-1.5">
                              Registration ID:
                            </span>
                            <span className="font-mono font-bold text-[#242323] text-[11px]">
                              {reg.id.slice(0, 18)}
                            </span>
                          </div>

                          {isGroup && (
                            <button
                              onClick={() => toggleEventExpansion(reg.id)}
                              className="inline-flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-wider text-[#242323] hover:text-[#c33a3a] font-['Inter'] cursor-pointer"
                            >
                              <Users className="w-3 h-3" />
                              <span>{isExpanded ? 'Hide Roster' : `View Roster (${teamCount + 1})`}</span>
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Group Event: Team Members Accordion */}
                      {isGroup && isExpanded && (
                        <div className="border-t border-[#242323]/15 bg-[#FAF7F2] p-4 sm:p-5">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[9.5px] font-bold tracking-[0.18em] text-stone-500 uppercase font-['Inter']">
                              Registered Team Roster
                            </span>
                            <span className="text-[9.5px] font-mono text-stone-500 uppercase">
                              {teamCount + 1} Total Delegates
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {/* Team Lead */}
                            <div className="bg-white border border-[#242323]/20 rounded-xl p-3 relative">
                              <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-[#FAF7F2] text-[8px] font-bold uppercase tracking-wider font-['Inter'] text-[#242323] rounded">
                                Team Lead
                              </span>
                              <span className="text-[8.5px] font-bold tracking-[0.18em] text-stone-400 uppercase font-['Inter'] block mb-0.5">
                                Member 1 (Lead)
                              </span>
                              <h4 className="text-sm font-bold font-['Barlow_Condensed'] uppercase text-[#242323] leading-none mb-1">
                                {user.fullName || user.name}
                              </h4>
                              <p className="text-[11px] font-mono text-stone-600">
                                Reg: {user.rollNumber || user.roll_number || 'Lead Participant'}
                              </p>
                            </div>

                            {/* Additional Team Members */}
                            {reg.teamMembers?.map((member, idx) => (
                              <div key={idx} className="bg-white border border-[#242323]/20 rounded-xl p-3">
                                <span className="text-[8.5px] font-bold tracking-[0.18em] text-stone-400 uppercase font-['Inter'] block mb-0.5">
                                  Member {idx + 2}
                                </span>
                                <h4 className="text-sm font-bold font-['Barlow_Condensed'] uppercase text-[#242323] leading-none mb-1">
                                  {member.name || `Delegate #${idx + 2}`}
                                </h4>
                                <p className="text-[11px] font-mono text-stone-600">
                                  Reg: {member.reg_number || 'N/A'}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

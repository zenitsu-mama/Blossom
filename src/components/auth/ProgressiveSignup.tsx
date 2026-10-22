import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

interface ProgressiveSignupProps {
  onSuccess: (message: string) => void;
  onSwitchToLogin: (email?: string) => void;
  isChristUniversityEmail: (email: string) => boolean;
}

export default function ProgressiveSignup({
  onSuccess,
  onSwitchToLogin,
  isChristUniversityEmail
}: ProgressiveSignupProps) {
  // Current stage: 1 to 7
  const [stage, setStage] = useState<number>(1);

  // Form State
  const [fullName, setFullName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [programme, setProgramme] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Step-level Error State
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isEmailInUse, setIsEmailInUse] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Input references for auto-focus
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus current input on stage change
  useEffect(() => {
    setErrorMsg(null);
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [stage]);

  // Stage validation handler
  const validateCurrentStage = (): boolean => {
    setErrorMsg(null);
    setIsEmailInUse(false);
    if (stage === 1) {
      if (!fullName.trim() || fullName.trim().length < 2) {
        setErrorMsg('PLEASE ENTER YOUR NAME.');
        return false;
      }
    } else if (stage === 2) {
      const cleanRoll = rollNumber.trim();
      if (!cleanRoll || !/^[0-9]{7}$/.test(cleanRoll)) {
        setErrorMsg('ROLL NUMBER MUST BE EXACTLY 7 DIGITS.');
        return false;
      }
    } else if (stage === 3) {
      const phoneDigits = contactNumber.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        setErrorMsg('ENTER A VALID CONTACT NUMBER.');
        return false;
      }
    } else if (stage === 4) {
      if (!programme.trim()) {
        setErrorMsg('ENTER YOUR PROGRAMME.');
        return false;
      }
    } else if (stage === 5) {
      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail || !isChristUniversityEmail(normalizedEmail)) {
        setErrorMsg('USE YOUR CHRIST UNIVERSITY EMAIL.');
        return false;
      }
    } else if (stage === 6) {
      if (!password || password.length < 6) {
        setErrorMsg('PASSWORD MUST BE AT LEAST 6 CHARACTERS.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStage()) {
      if (stage < 7) {
        setStage((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setErrorMsg(null);
    setIsEmailInUse(false);
    if (stage > 1) {
      setStage((prev) => prev - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (stage === 7) {
        handleFinalSubmit();
      } else {
        handleNext();
      }
    }
  };

  // Final Registration Action at Stage 7
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);
    setIsEmailInUse(false);

    const cleanEmail = email.trim().toLowerCase();
    const phoneDigits = contactNumber.replace(/\D/g, '');

    try {
      // Step 1: Create Firebase Auth credentials first (Single Source of Identity)
      const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, password);

      // Step 2: Extract ID token from authenticated Firebase user
      if (userCred.user) {
        const token = await userCred.user.getIdToken();
        
        // Step 3: Call backend to verify token and persist student profile in SQLite
        const signupRes = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            fullName: fullName.trim(),
            collegeEmail: cleanEmail,
            rollNumber: rollNumber.trim(),
            programme: programme.trim(),
            department: programme.trim(),
            contactNumber: phoneDigits
          })
        });

        if (!signupRes.ok) {
          const errData = await signupRes.json().catch(() => ({}));
          throw new Error(errData.message || 'Failed to save student profile in database.');
        }

        // Step 4: Dispatch verification email to student's college inbox
        await sendEmailVerification(userCred.user).catch((e) => console.warn('Verification email dispatch warning:', e));
      }

      onSuccess('ACCOUNT CREATED. PLEASE CHECK YOUR INBOX/SPAM TO VERIFY YOUR COLLEGE EMAIL.');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        console.warn('Progressive signup notice: Email already in use', cleanEmail);
        setIsEmailInUse(true);
        setErrorMsg('EMAIL ALREADY REGISTERED. PLEASE SIGN IN.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('PASSWORD MUST BE AT LEAST 6 CHARACTERS.');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMsg('USE YOUR CHRIST UNIVERSITY EMAIL.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setErrorMsg('EMAIL/PASSWORD AUTHENTICATION IS NOT ENABLED.');
      } else {
        console.error('Progressive signup error:', err);
        setErrorMsg('COULD NOT CREATE ACCOUNT. PLEASE TRY AGAIN.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Progress width calculation (1/7 to 7/7)
  const progressPercent = (stage / 7) * 100;

  return (
    <div className="w-full">
      {/* 1. Subtle Stage Indicator & Ultra-Thin Progress Line */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between text-[#737373] font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase mb-2.5">
          <span>0{stage} / 07</span>
          <span className="text-[9px] tracking-[0.2em] opacity-70">
            {stage === 7 ? 'FINAL STEP' : 'SIGN UP'}
          </span>
        </div>
        
        {/* Ultra-thin progress line */}
        <div className="w-full h-[1.5px] bg-[#242323]/10 overflow-hidden rounded-full relative">
          <motion.div
            className="h-full bg-[#c33a3a]"
            initial={{ width: '14.28%' }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* 2. Compact Completed Answers (Subtle Editorial Metadata) */}
      {stage > 1 && (
        <div className="mb-6 space-y-1.5 pb-4 border-b border-[#242323]/8">
          {stage > 1 && fullName && (
            <div className="flex items-center justify-between text-xs font-['Inter']">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#737373]">
                01 NAME
              </span>
              <span className="font-medium text-[#242323] flex items-center gap-1">
                {fullName} <Check className="w-3 h-3 text-[#c33a3a]" />
              </span>
            </div>
          )}
          {stage > 2 && rollNumber && (
            <div className="flex items-center justify-between text-xs font-['Inter']">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#737373]">
                02 ROLL NUMBER
              </span>
              <span className="font-mono text-xs font-medium text-[#242323] flex items-center gap-1">
                {rollNumber.toUpperCase()} <Check className="w-3 h-3 text-[#c33a3a]" />
              </span>
            </div>
          )}
          {stage > 3 && contactNumber && (
            <div className="flex items-center justify-between text-xs font-['Inter']">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#737373]">
                03 CONTACT
              </span>
              <span className="font-mono text-xs font-medium text-[#242323] flex items-center gap-1">
                {contactNumber} <Check className="w-3 h-3 text-[#c33a3a]" />
              </span>
            </div>
          )}
          {stage > 4 && programme && (
            <div className="flex items-center justify-between text-xs font-['Inter']">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#737373]">
                04 PROGRAMME
              </span>
              <span className="font-medium text-[#242323] flex items-center gap-1">
                {programme} <Check className="w-3 h-3 text-[#c33a3a]" />
              </span>
            </div>
          )}
          {stage > 5 && email && (
            <div className="flex items-center justify-between text-xs font-['Inter']">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#737373]">
                05 EMAIL
              </span>
              <span className="font-mono text-xs font-medium text-[#242323] flex items-center gap-1 max-w-[220px] sm:max-w-xs truncate">
                {email.toLowerCase()} <Check className="w-3 h-3 text-[#c33a3a] shrink-0" />
              </span>
            </div>
          )}
          {stage > 6 && password && (
            <div className="flex items-center justify-between text-xs font-['Inter']">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#737373]">
                06 PASSWORD
              </span>
              <span className="text-xs font-medium text-[#242323] flex items-center gap-1">
                •••••••• <Check className="w-3 h-3 text-[#c33a3a]" />
              </span>
            </div>
          )}
        </div>
      )}

      {/* 3. Progressive Question Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="space-y-5"
        >
          {/* STAGE 01: FULL NAME */}
          {stage === 1 && (
            <div>
              <label
                htmlFor="signup-name"
                className="block font-['Barlow_Condensed'] text-2xl sm:text-3xl font-light uppercase tracking-wide text-[#1C1A1A] mb-3 sm:mb-4"
              >
                WHAT'S YOUR NAME?
              </label>
              <input
                id="signup-name"
                ref={inputRef}
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Your full name"
                className="w-full bg-[#FDF0F4]/60 hover:bg-white focus:bg-white border border-[#242323]/25 focus:border-[#242323] rounded-2xl px-5 h-[54px] text-sm font-['Inter'] text-[#242323] placeholder:text-stone-400 focus:outline-none transition-all"
              />
            </div>
          )}

          {/* STAGE 02: ROLL NUMBER */}
          {stage === 2 && (
            <div>
              <label
                htmlFor="signup-roll"
                className="block font-['Barlow_Condensed'] text-2xl sm:text-3xl font-light uppercase tracking-wide text-[#1C1A1A] mb-3 sm:mb-4"
              >
                WHAT'S YOUR ROLL NUMBER?
              </label>
              <input
                id="signup-roll"
                ref={inputRef}
                type="text"
                value={rollNumber}
                onChange={(e) => {
                  setRollNumber(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Your roll number"
                className="w-full bg-[#FDF0F4]/60 hover:bg-white focus:bg-white border border-[#242323]/25 focus:border-[#242323] rounded-2xl px-5 h-[54px] text-sm font-mono uppercase tracking-wider text-[#242323] placeholder:text-stone-400 focus:outline-none transition-all"
              />
            </div>
          )}

          {/* STAGE 03: CONTACT NUMBER */}
          {stage === 3 && (
            <div>
              <label
                htmlFor="signup-contact"
                className="block font-['Barlow_Condensed'] text-2xl sm:text-3xl font-light uppercase tracking-wide text-[#1C1A1A] mb-3 sm:mb-4"
              >
                WHAT'S YOUR CONTACT NUMBER?
              </label>
              <input
                id="signup-contact"
                ref={inputRef}
                type="tel"
                value={contactNumber}
                onChange={(e) => {
                  setContactNumber(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Your contact number"
                className="w-full bg-[#FDF0F4]/60 hover:bg-white focus:bg-white border border-[#242323]/25 focus:border-[#242323] rounded-2xl px-5 h-[54px] text-sm font-mono tracking-wider text-[#242323] placeholder:text-stone-400 focus:outline-none transition-all"
              />
            </div>
          )}

          {/* STAGE 04: PROGRAMME */}
          {stage === 4 && (
            <div>
              <label
                htmlFor="signup-programme"
                className="block font-['Barlow_Condensed'] text-2xl sm:text-3xl font-light uppercase tracking-wide text-[#1C1A1A] mb-3 sm:mb-4"
              >
                WHAT'S YOUR PROGRAMME?
              </label>
              <input
                id="signup-programme"
                ref={inputRef}
                type="text"
                value={programme}
                onChange={(e) => {
                  setProgramme(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Your programme"
                className="w-full bg-[#FDF0F4]/60 hover:bg-white focus:bg-white border border-[#242323]/25 focus:border-[#242323] rounded-2xl px-5 h-[54px] text-sm font-['Inter'] text-[#242323] placeholder:text-stone-400 focus:outline-none transition-all"
              />
            </div>
          )}

          {/* STAGE 05: COLLEGE EMAIL */}
          {stage === 5 && (
            <div>
              <label
                htmlFor="signup-email"
                className="block font-['Barlow_Condensed'] text-2xl sm:text-3xl font-light uppercase tracking-wide text-[#1C1A1A] mb-3 sm:mb-4"
              >
                WHAT'S YOUR COLLEGE EMAIL?
              </label>
              <input
                id="signup-email"
                ref={inputRef}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                onKeyDown={handleKeyDown}
                placeholder="yourname@programme.christuniversity.in"
                className="w-full bg-[#FDF0F4]/60 hover:bg-white focus:bg-white border border-[#242323]/25 focus:border-[#242323] rounded-2xl px-5 h-[54px] text-sm font-['Inter'] text-[#242323] placeholder:text-stone-400 focus:outline-none transition-all"
              />
            </div>
          )}

          {/* STAGE 06: PASSWORD */}
          {stage === 6 && (
            <div>
              <label
                htmlFor="signup-password"
                className="block font-['Barlow_Condensed'] text-2xl sm:text-3xl font-light uppercase tracking-wide text-[#1C1A1A] mb-3 sm:mb-4"
              >
                CREATE A PASSWORD
              </label>
              <div className="relative flex items-center">
                <input
                  id="signup-password"
                  ref={inputRef}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your password"
                  className="w-full bg-[#FDF0F4]/60 hover:bg-white focus:bg-white border border-[#242323]/25 focus:border-[#242323] rounded-2xl px-5 pr-12 h-[54px] text-sm font-['Inter'] text-[#242323] placeholder:text-stone-400 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-stone-400 hover:text-black cursor-pointer p-1 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* STAGE 07: FINAL CONFIRMATION STATE */}
          {stage === 7 && (
            <div>
              <h3 className="font-['Barlow_Condensed'] text-2xl sm:text-3xl font-light uppercase tracking-wide text-[#1C1A1A] mb-4">
                YOUR ACCOUNT IS READY
              </h3>

              {/* Concise Summary Metadata */}
              <div className="bg-[#FDF0F4]/60 border border-[#242323]/10 rounded-2xl p-4 sm:p-5 space-y-2.5 mb-6 text-xs font-['Inter']">
                <div className="flex items-center justify-between border-b border-[#242323]/6 pb-2">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#737373]">
                    NAME
                  </span>
                  <span className="font-medium text-[#242323]">{fullName}</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#242323]/6 pb-2">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#737373]">
                    ROLL NUMBER
                  </span>
                  <span className="font-mono text-xs font-medium text-[#242323]">{rollNumber.toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#242323]/6 pb-2">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#737373]">
                    CONTACT
                  </span>
                  <span className="font-mono text-xs font-medium text-[#242323]">{contactNumber}</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#242323]/6 pb-2">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#737373]">
                    PROGRAMME
                  </span>
                  <span className="font-medium text-[#242323]">{programme}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#737373]">
                    EMAIL
                  </span>
                  <span className="font-mono text-xs font-medium text-[#242323] truncate max-w-[190px] sm:max-w-xs">
                    {email.toLowerCase()}
                  </span>
                </div>
              </div>

              {/* Final Submit Button */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinalSubmit}
                className="w-full bg-[#c33a3a] hover:bg-[#a82e2e] active:scale-[0.99] rounded-full text-white sm:text-[#FDF0F4] h-[52px] px-8 text-xs sm:text-sm font-bold uppercase tracking-[0.22em] transition-all disabled:opacity-50 font-['Inter'] cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                <span>{isSubmitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT →'}</span>
              </button>
            </div>
          )}

          {/* Smooth Error Message Feedback */}
          <AnimatePresence>
            {isEmailInUse ? (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="mt-3 p-4 bg-white border border-[#c33a3a]/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#c33a3a] shrink-0" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider font-['Inter'] text-[#242323]">
                      This email is already registered.
                    </p>
                    <p className="text-[11px] font-['Inter'] text-stone-500">
                      Sign in directly to access your Blossoms account.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onSwitchToLogin(email.trim().toLowerCase())}
                  className="w-full sm:w-auto bg-[#c33a3a] hover:bg-[#a82e2e] text-white rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider font-['Inter'] cursor-pointer transition-colors shrink-0 shadow-xs text-center"
                >
                  Sign in →
                </button>
              </motion.div>
            ) : errorMsg ? (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider font-['Inter'] text-[#c33a3a] pt-1"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#c33a3a] shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* 4. Action Controls (Back / Continue) */}
          {stage < 7 && (
            <div className="flex items-center justify-between pt-3">
              {stage > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-1.5 text-xs font-mono tracking-[0.2em] uppercase text-[#737373] hover:text-[#242323] cursor-pointer transition-colors py-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>BACK</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 bg-[#c33a3a] hover:bg-[#a82e2e] text-white rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-[0.2em] font-['Inter'] cursor-pointer transition-all active:scale-[0.98] shadow-sm ml-auto"
              >
                <span>CONTINUE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {stage === 7 && (
            <div className="flex items-center pt-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleBack}
                className="flex items-center gap-1.5 text-xs font-mono tracking-[0.2em] uppercase text-[#737373] hover:text-[#242323] cursor-pointer transition-colors py-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>BACK</span>
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* 5. Star Divider & Switch to Sign In */}
      <div className="flex items-center justify-center gap-3 my-6">
        <span className="h-[1px] bg-[#242323]/10 flex-1" />
        <span className="text-[#c33a3a] text-xs">✻</span>
        <span className="h-[1px] bg-[#242323]/10 flex-1" />
      </div>

      <div className="text-center text-xs sm:text-sm font-['Inter'] text-stone-600">
        <p>
          Already registered?{' '}
          <button
            type="button"
            onClick={() => onSwitchToLogin(email.trim().toLowerCase() || undefined)}
            className="text-[#c33a3a] font-semibold hover:underline cursor-pointer transition-colors"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

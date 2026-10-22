import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRegistration } from '../hooks/useRegistration';
import { ArrowLeft, CheckCircle, AlertCircle, Users, Plus, Trash2, Calendar, Clock, Sparkles, RefreshCw } from 'lucide-react';

export default function Register() {
  const { id } = useParams<{ id: string }>();
  const {
    event,
    loadingEvent,
    eventError,
    state,
    formData,
    touched,
    errors,
    serverError,
    registrationResult,
    isSubmitting,
    handleFieldChange,
    handleFieldBlur,
    handleTeamMemberChange,
    addTeamMember,
    removeTeamMember,
    handleEventSpecificChange,
    submitRegistration,
    retrySubmission,
    resetForm,
  } = useRegistration(id);

  // Format date helper
  const formatEventDate = (d?: string) => {
    if (!d || d === 'TBA') return 'TBA (TO BE ANNOUNCED)';
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? d : parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
  };

  // 1. Loading State
  if (loadingEvent) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 text-[#242323]">
        <div className="w-8 h-8 border-2 border-[#242323] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold tracking-[0.25em] uppercase font-['Inter'] text-gray-600">
          Retrieving Event Dossier...
        </p>
      </div>
    );
  }

  // 2. Event Not Found State
  if (eventError || !event) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 text-center max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-[#F87A71] mb-6 stroke-[1.5]" />
        <h2 className="text-3xl font-normal uppercase font-['Barlow_Condensed'] text-[#242323] mb-2 tracking-wide">
          Event Not Found
        </h2>
        <p className="text-sm font-['Inter'] text-gray-600 mb-8">
          {eventError || 'The event you requested could not be located in the Blossoms 2026 registry.'}
        </p>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 border border-[#242323] text-[#242323] px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#242323] hover:text-[#FDF0F4] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Events
        </Link>
      </div>
    );
  }

  // 3. Success State
  if (state === 'SUCCESS' && registrationResult) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center px-4 sm:px-6 md:px-12 py-8 md:py-12">
        <div className="w-full max-w-2xl bg-[#FDF0F4] border border-[#242323]/25 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xs">
          {/* Top Stamp */}
          <div className="flex items-center justify-between border-b border-[#242323]/15 pb-3 mb-6">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle className="w-4 h-4 stroke-[2.5]" />
              <span className="text-[10px] font-bold tracking-[0.22em] uppercase font-['Inter']">
                Registration Confirmed
              </span>
            </div>
            <span className="text-[9px] font-mono tracking-widest text-stone-500 uppercase">
              BLOSSOMS 2026 OFFICIAL ENTRY
            </span>
          </div>

          {/* Main Title */}
          <div className="mb-6">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#c33a3a] uppercase font-['Inter'] block mb-1">
              {event.category} • {event.type === 'group' ? 'Group Event' : 'Solo Event'}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal text-[#242323] font-['Barlow_Condensed'] uppercase tracking-tight leading-[0.95] mb-2">
              {event.name}
            </h1>
            <p className="text-xs font-['Inter'] text-stone-600 uppercase tracking-wide">
              You are officially registered for this festival event. Please preserve your reference ID for check-in.
            </p>
          </div>

          {/* Dossier Ticket Details */}
          <div className="bg-white/80 border border-[#242323]/20 rounded-xl p-4 sm:p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
            <div>
              <span className="text-[8.5px] font-bold tracking-[0.18em] text-stone-500 uppercase font-['Inter'] block mb-0.5">
                Participant Lead
              </span>
              <span className="text-xs sm:text-sm font-bold font-['Inter'] text-[#242323] uppercase">
                {registrationResult.full_name || formData.fullName}
              </span>
            </div>

            <div>
              <span className="text-[8.5px] font-bold tracking-[0.18em] text-stone-500 uppercase font-['Inter'] block mb-0.5">
                Registration Ref ID
              </span>
              <span className="text-xs sm:text-sm font-mono font-bold text-[#242323] uppercase">
                {registrationResult.registration_id.slice(0, 18)}
              </span>
            </div>

            <div>
              <span className="text-[8.5px] font-bold tracking-[0.18em] text-stone-500 uppercase font-['Inter'] block mb-0.5">
                Organization / Institute
              </span>
              <span className="text-xs sm:text-sm font-['Inter'] text-[#242323] uppercase">
                {formData.organizationInstitute || 'Christ University'}
              </span>
            </div>

            <div>
              <span className="text-[8.5px] font-bold tracking-[0.18em] text-stone-500 uppercase font-['Inter'] block mb-0.5">
                Schedule & Time
              </span>
              <span className="text-xs sm:text-sm font-['Inter'] text-[#242323] uppercase">
                {event.time_start || 'TBA'}
              </span>
            </div>

            {event.type === 'group' && formData.teamMembers.length > 0 && (
              <div className="sm:col-span-2 pt-2.5 border-t border-stone-200">
                <span className="text-[8.5px] font-bold tracking-[0.18em] text-stone-500 uppercase font-['Inter'] block mb-1.5">
                  Team Members ({formData.teamMembers.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs font-['Inter'] text-stone-700">
                  {formData.teamMembers.map((tm, idx) => (
                    <div key={idx} className="flex justify-between border-b border-stone-100 py-0.5">
                      <span>{idx + 2}. {tm.name}</span>
                      <span className="font-mono text-stone-500">{tm.reg_number}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-[#242323]/15">
            <Link
              to="/events"
              className="text-center border border-[#242323]/30 rounded-full text-[#242323] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em] hover:bg-[#242323] hover:text-[#FDF0F4] transition-colors font-['Inter']"
            >
              Explore More Events
            </Link>
            <button
              onClick={resetForm}
              className="text-center bg-[#c33a3a] hover:bg-[#a82e2e] rounded-full text-white px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em] transition-colors font-['Inter'] shadow-xs"
            >
              Register Another Entry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Already Registered State
  if (state === 'ALREADY_REGISTERED') {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center px-4 sm:px-6 py-8 md:py-12">
        <div className="w-full max-w-xl bg-[#FDF0F4] border border-[#242323]/25 rounded-2xl p-6 sm:p-8 text-center shadow-xs">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-800 mb-4">
            <AlertCircle className="w-5 h-5 stroke-[2]" />
          </div>
          <span className="text-[9px] font-bold tracking-[0.22em] text-stone-500 uppercase font-['Inter'] block mb-1">
            Status Check
          </span>
          <h2 className="text-3xl sm:text-4xl font-normal font-['Barlow_Condensed'] uppercase text-[#242323] mb-3">
            Already Registered
          </h2>
          <p className="text-xs sm:text-sm font-['Inter'] text-stone-700 leading-relaxed mb-6 max-w-md mx-auto">
            The email <strong className="text-[#242323]">{formData.email}</strong> is already registered for{' '}
            <strong className="text-[#242323]">{event.name}</strong>. Each participant or team lead can only submit one registration per event.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/events"
              className="w-full sm:w-auto border border-[#242323]/30 rounded-full text-[#242323] px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em] hover:bg-[#242323] hover:text-[#FDF0F4] transition-colors font-['Inter']"
            >
              Back to Events
            </Link>
            <button
              onClick={retrySubmission}
              className="w-full sm:w-auto bg-[#c33a3a] hover:bg-[#a82e2e] rounded-full text-white px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em] transition-colors font-['Inter'] shadow-xs"
            >
              Change Email / Edit
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. Registration Form Page (Shared data, Responsive presentation)
  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 md:px-10 lg:px-12 py-4 sm:py-6 lg:py-6 xl:py-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <Link
          to={`/events/${event.id}`}
          className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold tracking-[0.2em] text-stone-500 hover:text-[#c33a3a] uppercase font-['Inter'] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Event Overview
        </Link>
        <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase hidden sm:inline">
          ENTRY FORM • {event.id}
        </span>
      </div>

      {/* Main Grid: Responsive Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 xl:gap-8 items-start">
        {/* ========================================================
            LEFT COLUMN (Desktop: Sticky Dossier / Mobile: Top Accordion)
            ======================================================== */}
        <div className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-20">
          <div className="bg-[#FDF0F4] border border-[#242323]/25 rounded-2xl p-4 sm:p-5 lg:p-5 xl:p-6 relative shadow-xs">
            <div className="flex items-center justify-between border-b border-[#242323]/15 pb-2.5 mb-3">
              <span className="text-[10px] font-bold tracking-[0.22em] text-[#c33a3a] uppercase font-['Inter']">
                {event.category}
              </span>
              <span className="text-[9px] font-mono tracking-widest text-stone-500 uppercase px-2 py-0.5 bg-black/5 rounded-full">
                {event.type === 'group' ? `GROUP (${event.min_team_size}-${event.max_team_size} PAX)` : 'INDIVIDUAL'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#242323] font-['Barlow_Condensed'] uppercase leading-[0.95] tracking-tight mb-2.5">
              {event.name}
            </h1>

            <p className="text-xs sm:text-[13px] font-['Inter'] text-stone-700 leading-relaxed mb-3 line-clamp-3">
              {event.description}
            </p>

            {/* Quick Metadata Matrix */}
            <div className="grid grid-cols-3 gap-2 py-2.5 border-t border-b border-[#242323]/15 mb-3 text-left">
              <div className="flex items-start gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[8.5px] font-bold tracking-[0.18em] text-stone-500 uppercase font-['Inter'] block">Date</span>
                  <span className="text-[11px] font-['Inter'] text-[#242323] uppercase font-semibold">{formatEventDate(event.date)}</span>
                </div>
              </div>

              <div className="flex items-start gap-1.5">
                <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[8.5px] font-bold tracking-[0.18em] text-stone-500 uppercase font-['Inter'] block">Time</span>
                  <span className="text-[11px] font-['Inter'] text-[#242323] uppercase font-semibold">{event.time_start || 'TBA'}</span>
                </div>
              </div>

              <div className="flex items-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[8.5px] font-bold tracking-[0.18em] text-stone-500 uppercase font-['Inter'] block">Format</span>
                  <span className="text-[11px] font-['Inter'] text-[#242323] uppercase font-semibold">{event.submission_type || 'Live'}</span>
                </div>
              </div>
            </div>

            {/* Event Key Rules */}
            {event.rules && event.rules.length > 0 && (
              <div>
                <span className="text-[9.5px] font-bold tracking-[0.18em] text-[#242323] uppercase font-['Inter'] block mb-1.5">
                  Essential Guidelines
                </span>
                <ul className="flex flex-col gap-1.5">
                  {event.rules.slice(0, 3).map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[11px] font-['Inter'] text-stone-600 leading-snug">
                      <span className="text-[#c33a3a] font-bold select-none">•</span>
                      <span className="line-clamp-2">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN: EDITORIAL REGISTRATION LEDGER FORM
            ======================================================== */}
        <div className="lg:col-span-7 -mt-2 lg:mt-0">
          <div className="bg-[#FDF0F4] border border-[#242323]/25 rounded-2xl p-4 sm:p-5 lg:p-5 xl:p-6 relative shadow-xs">
            <div className="border-b border-[#242323]/15 pb-2.5 mb-3.5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-normal font-['Barlow_Condensed'] uppercase text-[#242323] tracking-wide leading-tight">
                  Participant Details
                </h2>
              </div>
              <span className="text-[9px] font-mono tracking-widest text-stone-400 uppercase">
                REQUIRED *
              </span>
            </div>

            {/* Server / Network Error Alert Banner */}
            {serverError && (
              <div className="mb-3.5 p-3 bg-red-50 border border-[#c33a3a]/40 rounded-xl flex items-start gap-2.5 text-[#242323]">
                <AlertCircle className="w-4 h-4 text-[#c33a3a] shrink-0 mt-0.5" />
                <div className="flex-1 text-[11px] font-['Inter']">
                  <p className="font-bold uppercase tracking-wider mb-0.5">Submission Interrupted</p>
                  <p className="text-stone-700">{serverError}</p>
                </div>
                {state === 'ERROR' && (
                  <button
                    onClick={retrySubmission}
                    className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#242323] hover:text-[#c33a3a] border-b border-[#242323]"
                  >
                    <RefreshCw className="w-3 h-3" /> Retry
                  </button>
                )}
              </div>
            )}

            <form onSubmit={submitRegistration} noValidate className="space-y-3 sm:space-y-3.5">
              {/* 2-Column Grid: Full Name & Official Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Field 1: Full Name */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="reg-fullname" className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-[#242323] font-['Inter']">
                      Full Name <span className="text-[#c33a3a]">*</span>
                    </label>
                    {touched.fullName && errors.fullName && (
                      <span className="text-[9.5px] font-semibold text-[#c33a3a] uppercase tracking-wider font-['Inter']">
                        {errors.fullName}
                      </span>
                    )}
                  </div>
                  <input
                    id="reg-fullname"
                    name="fullName"
                    type="text"
                    required
                    placeholder="e.g. AARAV SHARMA"
                    value={formData.fullName}
                    onChange={(e) => handleFieldChange('fullName', e.target.value)}
                    onBlur={() => handleFieldBlur('fullName')}
                    disabled={isSubmitting}
                    className={`w-full bg-white border ${
                      touched.fullName && errors.fullName ? 'border-[#c33a3a] ring-1 ring-[#c33a3a]' : 'border-[#242323]/25 focus:border-[#242323]'
                    } rounded-xl px-3.5 py-2 text-sm sm:text-base font-['Barlow_Condensed'] uppercase tracking-wider text-[#242323] placeholder:text-stone-400 focus:outline-none transition-all disabled:opacity-50 h-[42px]`}
                  />
                </div>

                {/* Field 2: Email */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="reg-email" className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-[#242323] font-['Inter']">
                      Official Email <span className="text-[#c33a3a]">*</span>
                    </label>
                    {touched.email && errors.email && (
                      <span className="text-[9.5px] font-semibold text-[#c33a3a] uppercase tracking-wider font-['Inter']">
                        {errors.email}
                      </span>
                    )}
                  </div>
                  <input
                    id="reg-email"
                    name="email"
                    type="email"
                    required
                    placeholder="e.g. AARAV.S@CHRISTUNIVERSITY.IN"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    onBlur={() => handleFieldBlur('email')}
                    disabled={isSubmitting}
                    className={`w-full bg-white border ${
                      touched.email && errors.email ? 'border-[#c33a3a] ring-1 ring-[#c33a3a]' : 'border-[#242323]/25 focus:border-[#242323]'
                    } rounded-xl px-3.5 py-2 text-sm sm:text-base font-['Barlow_Condensed'] uppercase tracking-wider text-[#242323] placeholder:text-stone-400 focus:outline-none transition-all disabled:opacity-50 h-[42px]`}
                  />
                </div>
              </div>

              {/* Grid: Contact Number & Organization / Institute */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Field 3: Contact Number */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="reg-phone" className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-[#242323] font-['Inter']">
                      Contact Number <span className="text-[#c33a3a]">*</span>
                    </label>
                    {touched.contactNumber && errors.contactNumber && (
                      <span className="text-[9.5px] font-semibold text-[#c33a3a] uppercase tracking-wider font-['Inter']">
                        {errors.contactNumber}
                      </span>
                    )}
                  </div>
                  <input
                    id="reg-phone"
                    name="contactNumber"
                    type="tel"
                    required
                    placeholder="10 DIGIT MOBILE"
                    value={formData.contactNumber}
                    onChange={(e) => handleFieldChange('contactNumber', e.target.value)}
                    onBlur={() => handleFieldBlur('contactNumber')}
                    disabled={isSubmitting}
                    className={`w-full bg-white border ${
                      touched.contactNumber && errors.contactNumber ? 'border-[#c33a3a] ring-1 ring-[#c33a3a]' : 'border-[#242323]/25 focus:border-[#242323]'
                    } rounded-xl px-3.5 py-2 text-sm sm:text-base font-['Barlow_Condensed'] uppercase tracking-wider text-[#242323] placeholder:text-stone-400 focus:outline-none transition-all disabled:opacity-50 h-[42px]`}
                  />
                </div>

                {/* Field 4: Organization / Institute */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="reg-org" className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-[#242323] font-['Inter']">
                      Programme / Institute <span className="text-[#c33a3a]">*</span>
                    </label>
                    {touched.organizationInstitute && errors.organizationInstitute && (
                      <span className="text-[9.5px] font-semibold text-[#c33a3a] uppercase tracking-wider font-['Inter']">
                        {errors.organizationInstitute}
                      </span>
                    )}
                  </div>
                  <input
                    id="reg-org"
                    name="organizationInstitute"
                    type="text"
                    required
                    placeholder="e.g. BSC CS / CHRIST UNIVERSITY"
                    value={formData.organizationInstitute}
                    onChange={(e) => handleFieldChange('organizationInstitute', e.target.value)}
                    onBlur={() => handleFieldBlur('organizationInstitute')}
                    disabled={isSubmitting}
                    className={`w-full bg-white border ${
                      touched.organizationInstitute && errors.organizationInstitute ? 'border-[#c33a3a] ring-1 ring-[#c33a3a]' : 'border-[#242323]/25 focus:border-[#242323]'
                    } rounded-xl px-3.5 py-2 text-sm sm:text-base font-['Barlow_Condensed'] uppercase tracking-wider text-[#242323] placeholder:text-stone-400 focus:outline-none transition-all disabled:opacity-50 h-[42px]`}
                  />
                </div>
              </div>

              {/* Group Event Team Members Matrix */}
              {event.type === 'group' && (
                <div className="pt-3 border-t border-[#242323]/15">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#c33a3a]" />
                      <span className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-[#242323] font-['Inter']">
                        Team Roster ({formData.teamMembers.length + 1} of {event.min_team_size}-{event.max_team_size || 20})
                      </span>
                    </div>
                    {errors.teamMembers && (
                      <span className="text-[9.5px] font-semibold text-[#c33a3a] uppercase tracking-wider font-['Inter']">
                        {errors.teamMembers}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 mb-2">
                    {formData.teamMembers.map((member, index) => (
                      <div key={index} className="p-2.5 bg-white border border-[#242323]/20 rounded-xl flex items-center gap-2.5">
                        <span className="text-[11px] font-mono font-bold text-stone-400 w-6 shrink-0">
                          #{index + 2}
                        </span>
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="MEMBER FULL NAME"
                            value={member.name}
                            onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                            disabled={isSubmitting}
                            className="bg-[#FDF0F4]/70 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs font-['Barlow_Condensed'] uppercase tracking-wider text-[#242323] focus:outline-none focus:border-[#242323]"
                          />
                          <input
                            type="text"
                            placeholder="REG / ID NUMBER"
                            value={member.reg_number}
                            onChange={(e) => handleTeamMemberChange(index, 'reg_number', e.target.value)}
                            disabled={isSubmitting}
                            className="bg-[#FDF0F4]/70 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs font-mono uppercase tracking-wider text-[#242323] focus:outline-none focus:border-[#242323]"
                          />
                        </div>
                        {formData.teamMembers.length > (Math.max(1, (event.min_team_size || 2) - 1)) && (
                          <button
                            type="button"
                            onClick={() => removeTeamMember(index)}
                            disabled={isSubmitting}
                            className="p-1 text-stone-400 hover:text-[#c33a3a] transition-colors shrink-0"
                            title="Remove Member"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {formData.teamMembers.length + 1 < (event.max_team_size || 20) && (
                    <button
                      type="button"
                      onClick={addTeamMember}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-1.5 border border-dashed border-[#242323]/40 rounded-xl px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#242323] hover:bg-white transition-colors font-['Inter']"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Team Member Slot
                    </button>
                  )}
                </div>
              )}

              {/* Dynamic Event-Specific Fields if defined on event */}
              {event.specific_fields && event.specific_fields.length > 0 && (
                <div className="pt-3 border-t border-[#242323]/15">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#242323] font-['Inter'] block mb-2">
                    Event Configuration
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {event.specific_fields.map((field) => (
                      <div key={field.id} className="flex flex-col">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#242323] font-['Inter']">
                            {field.label} {field.required && <span className="text-[#c33a3a]">*</span>}
                          </label>
                          {errors[field.id] && (
                            <span className="text-[9.5px] font-semibold text-[#c33a3a] uppercase tracking-wider font-['Inter']">
                              {errors[field.id]}
                            </span>
                          )}
                        </div>
                        <input
                          type={field.type === 'number' ? 'number' : 'text'}
                          placeholder={field.placeholder || ''}
                          value={formData.eventSpecificResponses[field.id] || ''}
                          onChange={(e) => handleEventSpecificChange(field.id, e.target.value)}
                          onBlur={() => handleFieldBlur(field.id)}
                          disabled={isSubmitting}
                          className="w-full bg-white border border-[#242323]/25 focus:border-[#242323] rounded-xl px-3.5 py-2 text-sm font-['Barlow_Condensed'] uppercase tracking-wider text-[#242323] focus:outline-none transition-all disabled:opacity-50 h-[42px]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submission Action CTA */}
              <div className="pt-3 border-t border-[#242323]/15 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#c33a3a] hover:bg-[#a82e2e] active:scale-[0.99] rounded-full text-white py-3.5 px-6 text-xs sm:text-sm font-bold uppercase tracking-[0.22em] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-['Inter'] shadow-xs cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>REGISTERING...</span>
                    </>
                  ) : (
                    <span>CONFIRM REGISTRATION →</span>
                  )}
                </button>

                <p className="text-[9px] text-center text-stone-500 uppercase tracking-widest font-['Inter']">
                  By submitting, you agree to adhere to all Blossoms 2026 festival guidelines.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

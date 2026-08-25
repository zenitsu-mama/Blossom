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
        <AlertCircle className="w-12 h-12 text-[#ef9797] mb-6 stroke-[1.5]" />
        <h2 className="text-3xl font-normal uppercase font-['Barlow_Condensed'] text-[#242323] mb-2 tracking-wide">
          Event Not Found
        </h2>
        <p className="text-sm font-['Inter'] text-gray-600 mb-8">
          {eventError || 'The event you requested could not be located in the Blossoms 2026 registry.'}
        </p>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 border border-[#242323] text-[#242323] px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#242323] hover:text-[#FAF7F2] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Events
        </Link>
      </div>
    );
  }

  // 3. Success State
  if (state === 'SUCCESS' && registrationResult) {
    return (
      <div className="w-full min-h-[80vh] flex items-center justify-center px-4 sm:px-6 md:px-12 py-12 md:py-20">
        <div className="w-full max-w-2xl bg-[#FAF7F2] border border-[#242323] p-6 sm:p-10 md:p-12 relative overflow-hidden shadow-sm">
          {/* Top Stamp */}
          <div className="flex items-center justify-between border-b border-[#242323] pb-4 mb-8">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle className="w-5 h-5 stroke-[2]" />
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase font-['Inter']">
                Registration Confirmed
              </span>
            </div>
            <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">
              BLOSSOMS 2026 OFFICIAL ENTRY
            </span>
          </div>

          {/* Main Title */}
          <div className="mb-8">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#ef9797] uppercase font-['Inter'] block mb-1">
              {event.category} • {event.type === 'group' ? 'Group Event' : 'Solo Event'}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal text-[#242323] font-['Barlow_Condensed'] uppercase tracking-tight leading-[0.95] mb-4">
              {event.name}
            </h1>
            <p className="text-xs sm:text-sm font-['Inter'] text-gray-600 uppercase tracking-wide">
              You are officially registered for this festival event. Please preserve your reference ID for check-in.
            </p>
          </div>

          {/* Dossier Ticket Details */}
          <div className="bg-[#F3EFEA] border border-[#242323] p-5 sm:p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div>
              <span className="text-[9px] font-bold tracking-[0.2em] text-gray-500 uppercase font-['Inter'] block mb-1">
                Participant Lead
              </span>
              <span className="text-sm font-bold font-['Inter'] text-[#242323] uppercase">
                {registrationResult.full_name || formData.fullName}
              </span>
            </div>

            <div>
              <span className="text-[9px] font-bold tracking-[0.2em] text-gray-500 uppercase font-['Inter'] block mb-1">
                Registration Ref ID
              </span>
              <span className="text-sm font-mono font-bold text-[#242323] uppercase">
                {registrationResult.registration_id.slice(0, 18)}
              </span>
            </div>

            <div>
              <span className="text-[9px] font-bold tracking-[0.2em] text-gray-500 uppercase font-['Inter'] block mb-1">
                Organization / Institute
              </span>
              <span className="text-sm font-['Inter'] text-[#242323] uppercase">
                {formData.organizationInstitute || 'Christ University'}
              </span>
            </div>

            <div>
              <span className="text-[9px] font-bold tracking-[0.2em] text-gray-500 uppercase font-['Inter'] block mb-1">
                Schedule & Time
              </span>
              <span className="text-sm font-['Inter'] text-[#242323] uppercase">
                {event.time_start || 'TBA'}
              </span>
            </div>

            {event.type === 'group' && formData.teamMembers.length > 0 && (
              <div className="sm:col-span-2 pt-3 border-t border-gray-300">
                <span className="text-[9px] font-bold tracking-[0.2em] text-gray-500 uppercase font-['Inter'] block mb-2">
                  Team Members ({formData.teamMembers.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-['Inter'] text-gray-700">
                  {formData.teamMembers.map((tm, idx) => (
                    <div key={idx} className="flex justify-between border-b border-gray-200 py-1">
                      <span>{idx + 2}. {tm.name}</span>
                      <span className="font-mono text-gray-500">{tm.reg_number}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-[#242323]">
            <Link
              to="/events"
              className="text-center border border-[#242323] text-[#242323] px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#242323] hover:text-[#FAF7F2] transition-colors font-['Inter']"
            >
              Explore More Events
            </Link>
            <button
              onClick={resetForm}
              className="text-center bg-[#ef9797] border border-[#242323] text-[#242323] px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#f85c5c] transition-colors font-['Inter']"
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
      <div className="w-full min-h-[70vh] flex items-center justify-center px-4 sm:px-6 py-12 md:py-20">
        <div className="w-full max-w-xl bg-[#FAF7F2] border border-[#242323] p-8 md:p-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-800 mb-6">
            <AlertCircle className="w-6 h-6 stroke-[2]" />
          </div>
          <span className="text-[10px] font-bold tracking-[0.25em] text-gray-500 uppercase font-['Inter'] block mb-2">
            Status Check
          </span>
          <h2 className="text-4xl md:text-5xl font-normal font-['Barlow_Condensed'] uppercase text-[#242323] mb-4">
            Already Registered
          </h2>
          <p className="text-sm font-['Inter'] text-gray-700 leading-relaxed mb-8 max-w-md mx-auto">
            The email <strong className="text-[#242323]">{formData.email}</strong> is already registered for{' '}
            <strong className="text-[#242323]">{event.name}</strong>. Each participant or team lead can only submit one registration per event.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/events"
              className="w-full sm:w-auto border border-[#242323] text-[#242323] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#242323] hover:text-[#FAF7F2] transition-colors font-['Inter']"
            >
              Back to Events
            </Link>
            <button
              onClick={retrySubmission}
              className="w-full sm:w-auto bg-[#ef9797] border border-[#242323] text-[#242323] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#f85c5c] transition-colors font-['Inter']"
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
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 md:px-12 py-8 md:py-16">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-8 md:mb-12">
        <Link
          to={`/events/${event.id}`}
          className="inline-flex items-center gap-2 text-[10px] md:text-xs font-bold tracking-[0.2em] text-gray-500 hover:text-[#ef9797] uppercase font-['Inter'] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Event Overview
        </Link>
        <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase hidden sm:inline">
          ENTRY FORM • {event.id}
        </span>
      </div>

      {/* Main Grid: Responsive Presentation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        {/* ========================================================
            LEFT COLUMN (Desktop: Sticky Dossier / Mobile: Top Accordion)
            ======================================================== */}
        <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-24">
          <div className="bg-[#FAF7F2] border border-[#242323] p-6 md:p-8 relative">
            <div className="flex items-center justify-between border-b border-[#242323] pb-3 mb-6">
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#ef9797] uppercase font-['Inter']">
                {event.category}
              </span>
              <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">
                {event.type === 'group' ? `GROUP (${event.min_team_size}-${event.max_team_size} PAX)` : 'INDIVIDUAL'}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-[#242323] font-['Barlow_Condensed'] uppercase leading-[0.9] tracking-tight mb-6">
              {event.name}
            </h1>

            <p className="text-xs sm:text-sm font-['Inter'] text-gray-700 leading-relaxed mb-6">
              {event.description}
            </p>

            {/* Quick Metadata Matrix */}
            <div className="grid grid-cols-3 gap-3 py-4 border-t border-b border-[#242323] mb-6 text-left">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[9px] font-bold tracking-[0.2em] text-gray-500 uppercase font-['Inter'] block">Date</span>
                  <span className="text-xs font-['Inter'] text-[#242323] uppercase font-medium">{formatEventDate(event.date)}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[9px] font-bold tracking-[0.2em] text-gray-500 uppercase font-['Inter'] block">Time</span>
                  <span className="text-xs font-['Inter'] text-[#242323] uppercase font-medium">{event.time_start || 'TBA'}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[9px] font-bold tracking-[0.2em] text-gray-500 uppercase font-['Inter'] block">Format</span>
                  <span className="text-xs font-['Inter'] text-[#242323] uppercase font-medium">{event.submission_type || 'Live'}</span>
                </div>
              </div>
            </div>

            {/* Event Key Rules */}
            {event.rules && event.rules.length > 0 && (
              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#242323] uppercase font-['Inter'] block mb-3">
                  Essential Guidelines
                </span>
                <ul className="flex flex-col gap-2">
                  {event.rules.slice(0, 4).map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs font-['Inter'] text-gray-600 leading-snug">
                      <span className="text-[#ef9797] font-bold select-none">—</span>
                      <span>{rule}</span>
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
        <div className="lg:col-span-7">
          <div className="bg-[#FAF7F2] border border-[#242323] p-6 sm:p-8 md:p-10 relative">
            <div className="border-b border-[#242323] pb-4 mb-8">
              <span className="text-[10px] font-bold tracking-[0.25em] text-gray-500 uppercase font-['Inter'] block mb-1">
                Candidate Entry Ledger
              </span>
              <h2 className="text-3xl sm:text-4xl font-normal font-['Barlow_Condensed'] uppercase text-[#242323] tracking-wide">
                Participant Details
              </h2>
            </div>

            {/* Server / Network Error Alert Banner */}
            {serverError && (
              <div className="mb-8 p-4 bg-red-50 border border-[#ef9797] flex items-start gap-3 text-[#242323]">
                <AlertCircle className="w-5 h-5 text-[#ef9797] shrink-0 mt-0.5" />
                <div className="flex-1 text-xs font-['Inter']">
                  <p className="font-bold uppercase tracking-wider mb-1">Submission Interrupted</p>
                  <p className="text-gray-700">{serverError}</p>
                </div>
                {state === 'ERROR' && (
                  <button
                    onClick={retrySubmission}
                    className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#242323] hover:text-[#ef9797] border-b border-[#242323]"
                  >
                    <RefreshCw className="w-3 h-3" /> Retry
                  </button>
                )}
              </div>
            )}

            <form onSubmit={submitRegistration} noValidate className="space-y-8">
              {/* Field 1: Full Name */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="reg-fullname" className="text-xs font-bold uppercase tracking-[0.18em] text-[#242323] font-['Inter']">
                    Full Name <span className="text-[#ef9797]">*</span>
                  </label>
                  {touched.fullName && errors.fullName && (
                    <span className="text-[11px] font-semibold text-[#ef9797] uppercase tracking-wider font-['Inter']">
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
                    touched.fullName && errors.fullName ? 'border-[#ef9797] ring-1 ring-[#ef9797]' : 'border-[#242323]'
                  } px-4 py-3.5 text-base sm:text-lg font-['Barlow_Condensed'] uppercase tracking-wider text-[#242323] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#242323] transition-all disabled:opacity-50`}
                />
              </div>

              {/* Field 2: Email */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="reg-email" className="text-xs font-bold uppercase tracking-[0.18em] text-[#242323] font-['Inter']">
                    Official Email <span className="text-[#ef9797]">*</span>
                  </label>
                  {touched.email && errors.email && (
                    <span className="text-[11px] font-semibold text-[#ef9797] uppercase tracking-wider font-['Inter']">
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
                    touched.email && errors.email ? 'border-[#ef9797] ring-1 ring-[#ef9797]' : 'border-[#242323]'
                  } px-4 py-3.5 text-base sm:text-lg font-['Barlow_Condensed'] uppercase tracking-wider text-[#242323] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#242323] transition-all disabled:opacity-50`}
                />
              </div>

              {/* Grid: Contact Number & Organization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Field 3: Contact Number */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="reg-phone" className="text-xs font-bold uppercase tracking-[0.18em] text-[#242323] font-['Inter']">
                      Contact Number <span className="text-[#ef9797]">*</span>
                    </label>
                    {touched.contactNumber && errors.contactNumber && (
                      <span className="text-[10px] font-semibold text-[#ef9797] uppercase tracking-wider font-['Inter']">
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
                      touched.contactNumber && errors.contactNumber ? 'border-[#ef9797] ring-1 ring-[#ef9797]' : 'border-[#242323]'
                    } px-4 py-3.5 text-base sm:text-lg font-['Barlow_Condensed'] uppercase tracking-wider text-[#242323] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#242323] transition-all disabled:opacity-50`}
                  />
                </div>

                {/* Field 4: Organization / Institute */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="reg-org" className="text-xs font-bold uppercase tracking-[0.18em] text-[#242323] font-['Inter']">
                      Department / Institute <span className="text-[#ef9797]">*</span>
                    </label>
                    {touched.organizationInstitute && errors.organizationInstitute && (
                      <span className="text-[10px] font-semibold text-[#ef9797] uppercase tracking-wider font-['Inter']">
                        {errors.organizationInstitute}
                      </span>
                    )}
                  </div>
                  <input
                    id="reg-org"
                    name="organizationInstitute"
                    type="text"
                    required
                    placeholder="e.g. BSC CS 3RD YEAR"
                    value={formData.organizationInstitute}
                    onChange={(e) => handleFieldChange('organizationInstitute', e.target.value)}
                    onBlur={() => handleFieldBlur('organizationInstitute')}
                    disabled={isSubmitting}
                    className={`w-full bg-white border ${
                      touched.organizationInstitute && errors.organizationInstitute ? 'border-[#ef9797] ring-1 ring-[#ef9797]' : 'border-[#242323]'
                    } px-4 py-3.5 text-base sm:text-lg font-['Barlow_Condensed'] uppercase tracking-wider text-[#242323] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#242323] transition-all disabled:opacity-50`}
                  />
                </div>
              </div>

              {/* Group Event Team Members Matrix */}
              {event.type === 'group' && (
                <div className="pt-6 border-t border-[#242323]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#ef9797]" />
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#242323] font-['Inter']">
                        Team Roster ({formData.teamMembers.length + 1} of {event.min_team_size}-{event.max_team_size || 20})
                      </span>
                    </div>
                    {errors.teamMembers && (
                      <span className="text-[11px] font-semibold text-[#ef9797] uppercase tracking-wider font-['Inter']">
                        {errors.teamMembers}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] font-['Inter'] text-gray-500 uppercase tracking-wide mb-4">
                    You (the applicant above) are Team Member #1 (Leader). Please specify your team members below:
                  </p>

                  <div className="space-y-4 mb-4">
                    {formData.teamMembers.map((member, index) => (
                      <div key={index} className="p-4 bg-white border border-[#242323] flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <span className="text-xs font-mono font-bold text-gray-400 sm:w-8">
                          #{index + 2}
                        </span>
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                          <input
                            type="text"
                            placeholder="MEMBER FULL NAME"
                            value={member.name}
                            onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                            disabled={isSubmitting}
                            className="bg-[#FAF7F2] border border-gray-300 px-3 py-2 text-sm font-['Barlow_Condensed'] uppercase tracking-wider text-[#242323] focus:outline-none focus:border-[#242323]"
                          />
                          <input
                            type="text"
                            placeholder="REGISTER / ID NUMBER"
                            value={member.reg_number}
                            onChange={(e) => handleTeamMemberChange(index, 'reg_number', e.target.value)}
                            disabled={isSubmitting}
                            className="bg-[#FAF7F2] border border-gray-300 px-3 py-2 text-sm font-mono uppercase tracking-wider text-[#242323] focus:outline-none focus:border-[#242323]"
                          />
                        </div>
                        {formData.teamMembers.length > (Math.max(1, (event.min_team_size || 2) - 1)) && (
                          <button
                            type="button"
                            onClick={() => removeTeamMember(index)}
                            disabled={isSubmitting}
                            className="p-2 text-gray-400 hover:text-[#ef9797] transition-colors self-end sm:self-center"
                            title="Remove Member"
                          >
                            <Trash2 className="w-4 h-4" />
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
                      className="inline-flex items-center gap-2 border border-dashed border-[#242323] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#242323] hover:bg-white transition-colors font-['Inter']"
                    >
                      <Plus className="w-4 h-4" /> Add Team Member Slot
                    </button>
                  )}
                </div>
              )}

              {/* Dynamic Event-Specific Fields if defined on event */}
              {event.specific_fields && event.specific_fields.length > 0 && (
                <div className="pt-6 border-t border-[#242323] space-y-6">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#242323] font-['Inter'] block">
                    Event-Specific Configuration
                  </span>
                  {event.specific_fields.map((field) => (
                    <div key={field.id} className="flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold uppercase tracking-[0.18em] text-[#242323] font-['Inter']">
                          {field.label} {field.required && <span className="text-[#ef9797]">*</span>}
                        </label>
                        {errors[field.id] && (
                          <span className="text-[10px] font-semibold text-[#ef9797] uppercase tracking-wider font-['Inter']">
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
                        className="w-full bg-white border border-[#242323] px-4 py-3 text-sm font-['Barlow_Condensed'] uppercase tracking-wider text-[#242323] focus:outline-none focus:ring-1 focus:ring-[#242323]"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Submission Action CTA */}
              <div className="pt-8 border-t border-[#242323] flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#ef9797] border-[2px] border-[#242323] text-[#242323] py-5 px-8 text-xs sm:text-sm font-bold uppercase tracking-[0.25em] hover:bg-[#f85c5c] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-['Inter']"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#242323] border-t-transparent rounded-full animate-spin" />
                      <span>REGISTERING...</span>
                    </>
                  ) : (
                    <span>CONFIRM REGISTRATION</span>
                  )}
                </button>

                <p className="text-[10px] text-center text-gray-500 uppercase tracking-widest font-['Inter']">
                  By submitting, you agree to adhere to all Blossoms 2026 festival rules and university guidelines.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

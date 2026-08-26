import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, User, ArrowLeft, Clock, Plus, Minus } from 'lucide-react';
import { EventData } from '../types';
import {
  SidebarLotusArt,
  FlowerWatermarkIcon,
  getCategoryVisual,
  CategoryVisualMeta
} from '../components/BotanicalArt';

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  // Rules are collapsed by default on mobile for fast, low-friction access to Register CTA
  const [rulesExpanded, setRulesExpanded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch(`/api/events/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Event not found');
        return res.json();
      })
      .then((data) => {
        setEvent(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  // Format date cleanly in editorial style (e.g. 02 OCT 2026)
  const formatEventDate = (d?: string) => {
    if (!d || d === 'TBA') return 'TBA';
    const parsed = new Date(d);
    if (isNaN(parsed.getTime())) return d;
    return parsed.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#FAF7F2] text-[#1a1a1a] p-8">
        <div className="w-9 h-9 border-2 border-[#1a1a1a]/20 border-t-[#F87A71] rounded-full animate-spin mb-4" />
        <p className="font-['Geist_Mono'] text-xs tracking-[0.25em] uppercase text-[#1a1a1a]/60">
          Loading Event...
        </p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#FAF7F2] text-[#1a1a1a] p-8 text-center">
        <span className="font-['Barlow_Condensed'] text-5xl sm:text-6xl font-black text-[#1a1a1a] uppercase mb-3">
          Event Not Found
        </span>
        <p className="font-['Geist'] text-sm text-[#1a1a1a]/70 max-w-md mb-8">
          The requested event may have been updated or moved in the festival catalogue.
        </p>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#F07A6E] text-[#1a1a1a] font-['Geist_Mono'] text-xs font-bold uppercase tracking-widest hover:bg-[#EE7163] transition-colors"
        >
          <ArrowLeft size={14} /> Back to Events
        </Link>
      </div>
    );
  }

  const categoryVisual: CategoryVisualMeta = getCategoryVisual(event.category);
  const ArtComponent = categoryVisual.artComponent;
  const isArtCategory = event.category.toLowerCase() === 'art';

  return (
    <div className="min-h-screen w-full bg-[#FAF7F2] text-[#1a1a1a] selection:bg-[#F87A71] selection:text-white flex flex-col lg:flex-row overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* 1. DESKTOP EDITORIAL SIDEBAR (lg:flex only - matches Events page)         */}
      {/* ========================================================================= */}
      <aside className="hidden lg:flex w-60 xl:w-68 h-screen shrink-0 sticky top-0 border-r border-black/10 bg-[#FAF7F2] p-8 flex-col justify-between select-none z-30">
        <div>
          {/* Festival Brand Header */}
          <Link to="/" className="block group">
            <h2 className="font-['Cormorant_Garamond'] text-3xl xl:text-4xl font-semibold tracking-normal text-[#1a1a1a] leading-none">
              BLOSSOMS
            </h2>
            <p className="font-['Geist_Mono'] text-[0.62rem] tracking-[0.26em] text-[#1a1a1a]/60 uppercase mt-1.5 font-medium">
              CULTURAL FEST
            </p>
          </Link>

          {/* Floral Watermark Icon */}
          <div className="mt-6 mb-8">
            <FlowerWatermarkIcon className="w-5 h-5 text-[#F87A71]/80" />
          </div>

          {/* Navigation Menu */}
          <nav className="flex flex-col gap-2.5">
            <Link
              to="/events"
              id="desktop-sidebar-events-link"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#FADBD4] text-[#1a1a1a] font-['Geist_Mono'] text-[0.72rem] tracking-[0.16em] uppercase font-bold shadow-[0_2px_8px_rgba(240,122,110,0.12)] transition-all cursor-pointer text-left"
            >
              <Calendar size={16} className="text-[#F87A71]" strokeWidth={2.2} />
              <span>EVENTS</span>
            </Link>

            <Link
              to="/account"
              id="desktop-sidebar-account-link"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[#1a1a1a]/65 hover:text-[#1a1a1a] hover:bg-black/5 font-['Geist_Mono'] text-[0.72rem] tracking-[0.16em] uppercase font-medium transition-all"
            >
              <User size={16} className="opacity-60" strokeWidth={2.2} />
              <span>ACCOUNT</span>
            </Link>
          </nav>
        </div>

        {/* Bottom-left Watercolor Lotus Blossom Illustration */}
        <div className="w-48 h-48 pointer-events-none opacity-85 -ml-4 -mb-4">
          <SidebarLotusArt />
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN EDITORIAL EVENT SHEET (Responsive Desktop & Mobile)              */}
      {/* ========================================================================= */}
      <main className="flex-1 min-h-screen flex flex-col p-6 sm:p-8 md:p-12 xl:p-14 max-w-[1340px] mx-auto w-full relative pb-28 sm:pb-32 lg:pb-14">
        
        {/* TOP EDITORIAL BREADCRUMB & BACK NAVIGATION */}
        <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-6 sm:mb-8">
          <button
            onClick={() => navigate('/events')}
            id="event-detail-back-btn"
            className="inline-flex items-center gap-2 font-['Geist_Mono'] text-[0.72rem] sm:text-xs font-bold tracking-[0.22em] text-[#1a1a1a]/70 hover:text-[#F87A71] uppercase transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" strokeWidth={2.5} />
            <span>← {event.category} EVENTS</span>
          </button>

          {/* Minimal Brand Tag */}
          <span className="font-['Geist_Mono'] text-[0.68rem] tracking-[0.22em] text-[#1a1a1a]/45 uppercase">
            BLOSSOMS 2026
          </span>
        </div>

        {/* ASYMMETRIC TWO-COLUMN EDITORIAL COMPOSITION (Desktop: Asymmetric / Mobile: Single Flow) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] xl:grid-cols-[1.6fr_1fr] gap-8 xl:gap-14 items-start">
          
          {/* ========================================================
              LEFT / PRIMARY EDITORIAL CONTENT
              ======================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col space-y-6 sm:space-y-7"
          >
            {/* SUBTLE CATEGORY LABEL (No numbers, no internal IDs) */}
            <div className="flex items-center gap-3">
              <span className="font-['Geist_Mono'] text-[0.72rem] font-bold tracking-[0.26em] uppercase text-[#F87A71]">
                {event.category}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-black/20" />
              <span className="font-['Geist_Mono'] text-[0.68rem] tracking-[0.2em] uppercase text-[#1a1a1a]/60 font-medium">
                {event.type === 'group'
                  ? `GROUP (${event.min_team_size || 2}–${event.max_team_size || 'N'} MEMBERS)`
                  : 'SOLO / INDIVIDUAL'}
              </span>
            </div>

            {/* DOMINANT CONDENSED DISPLAY EVENT TITLE */}
            <div>
              <h1 className="font-['Barlow_Condensed'] text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black uppercase text-[#1a1a1a] leading-[0.92] tracking-tight break-words">
                {event.name}
              </h1>
              <div
                className="w-16 sm:w-20 h-[3px] mt-4 sm:mt-5"
                style={{ backgroundColor: categoryVisual.accentColor }}
              />
            </div>

            {/* COMPACT EDITORIAL METADATA ROW (DATE & TIME ONLY — NO VENUE) */}
            <div className="py-4 border-y border-black/10 flex items-center justify-between sm:justify-start gap-8 sm:gap-14">
              <div>
                <span className="font-['Geist_Mono'] text-[0.62rem] font-bold tracking-[0.24em] text-[#1a1a1a]/55 uppercase flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3 h-3 text-[#F87A71]" /> DATE
                </span>
                <span className="font-['Barlow_Condensed'] text-xl sm:text-2xl font-bold uppercase text-[#1a1a1a] tracking-wide">
                  {formatEventDate(event.date)}
                </span>
              </div>

              <div>
                <span className="font-['Geist_Mono'] text-[0.62rem] font-bold tracking-[0.24em] text-[#1a1a1a]/55 uppercase flex items-center gap-1.5 mb-1">
                  <Clock className="w-3 h-3 text-[#F87A71]" /> TIME
                </span>
                <span className="font-['Barlow_Condensed'] text-xl sm:text-2xl font-bold uppercase text-[#1a1a1a] tracking-wide">
                  {event.time_start || '10:00 AM'}
                </span>
              </div>
            </div>

            {/* CONCISE SYNOPSIS */}
            {event.description && event.description.trim().length > 0 && (
              <div className="space-y-1.5">
                <span className="font-['Geist_Mono'] text-[0.65rem] font-bold tracking-[0.24em] text-[#1a1a1a]/55 uppercase block">
                  SYNOPSIS
                </span>
                <p className="font-['Geist'] text-sm sm:text-base text-[#1a1a1a]/85 leading-relaxed font-normal max-w-2xl">
                  {event.description}
                </p>
              </div>
            )}

            {/* RULES & GUIDELINES (COLLAPSIBLE ACCORDION — COLLAPSED BY DEFAULT ON MOBILE) */}
            {event.rules && event.rules.length > 0 && (
              <div className="pt-2 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setRulesExpanded((prev) => !prev)}
                  id="rules-accordion-toggle"
                  className="w-full flex items-center justify-between py-3 group cursor-pointer text-left select-none"
                  aria-expanded={rulesExpanded}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-['Geist_Mono'] text-[0.72rem] font-bold tracking-[0.24em] text-[#1a1a1a] uppercase group-hover:text-[#F87A71] transition-colors">
                      RULES & GUIDELINES
                    </span>
                    <span className="font-['Geist_Mono'] text-[0.65rem] px-2 py-0.5 rounded-full bg-black/5 text-[#1a1a1a]/60">
                      {event.rules.length}
                    </span>
                  </div>

                  <div className="w-6 h-6 rounded-full border border-black/15 flex items-center justify-center text-[#1a1a1a]/70 group-hover:border-[#F87A71] group-hover:text-[#F87A71] transition-colors">
                    {rulesExpanded ? <Minus size={13} strokeWidth={2.5} /> : <Plus size={13} strokeWidth={2.5} />}
                  </div>
                </button>

                {/* Collapsible Rules List */}
                <AnimatePresence initial={false}>
                  {rulesExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3 pt-2 pb-4">
                        {event.rules.map((rule, idx) => {
                          const ruleNum = (idx + 1).toString().padStart(2, '0');
                          return (
                            <div
                              key={idx}
                              className="grid grid-cols-[32px_1fr] sm:grid-cols-[38px_1fr] gap-3 items-baseline py-2.5 border-b border-black/[0.06]"
                            >
                              <span
                                className="font-['Barlow_Condensed'] text-xl sm:text-2xl font-black select-none leading-none"
                                style={{ color: categoryVisual.accentColor }}
                              >
                                {ruleNum}
                              </span>
                              <p className="font-['Geist'] text-xs sm:text-sm text-[#1a1a1a]/90 leading-relaxed font-normal">
                                {rule}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          {/* ========================================================
              RIGHT / SECONDARY EDITORIAL PANEL & DESKTOP CTA
              ======================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex flex-col space-y-6 sticky top-8"
          >
            {/* Themed Editorial Category Canvas with Botanical Linework */}
            <div
              className={`w-full aspect-[4/4.2] rounded-[28px] border p-8 flex flex-col justify-between relative overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.03)] ${
                isArtCategory
                  ? 'bg-[#22201F] text-white border-[#383433]'
                  : `${categoryVisual.bgWash} text-[#1a1a1a] ${categoryVisual.borderColor}`
              }`}
            >
              {/* Botanical SVG Art Component */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <ArtComponent className="w-full h-full opacity-60" />
              </div>

              {/* Top Header in Card */}
              <div className="z-10 flex items-start justify-between">
                <div>
                  <span className="font-['Geist_Mono'] text-[0.64rem] font-bold tracking-[0.28em] uppercase opacity-75 block">
                    BLOSSOMS 2026
                  </span>
                  <span className="font-['Barlow_Condensed'] text-3xl font-black uppercase tracking-tight block mt-0.5">
                    {event.category}
                  </span>
                </div>
                <div className="p-2 rounded-full border border-current/20 bg-current/5">
                  <FlowerWatermarkIcon className="w-4 h-4 text-current opacity-80" />
                </div>
              </div>

              {/* Middle Floral Statement */}
              <div className="z-10 my-auto py-4">
                <p className="font-['Cormorant_Garamond'] text-2xl xl:text-3xl italic leading-snug opacity-85 max-w-[240px]">
                  "Where cultural traditions blossom into stagecraft."
                </p>
                <div className="w-10 h-0.5 bg-current/30 mt-3" />
              </div>

              {/* Bottom Card Format Tag */}
              <div className="z-10 flex items-center justify-between border-t border-current/15 pt-3.5">
                <span className="font-['Geist_Mono'] text-[0.65rem] tracking-[0.2em] uppercase opacity-75">
                  FESTIVAL ENTRY
                </span>
                <span className="font-['Geist_Mono'] text-[0.65rem] font-bold tracking-wider uppercase opacity-90">
                  {event.type === 'group' ? 'GROUP ENSEMBLE' : 'SOLO PERFORMANCE'}
                </span>
              </div>
            </div>

            {/* Prominent Desktop Register CTA */}
            <Link
              to={`/events/${event.id}/register`}
              id="desktop-register-now-cta"
              className="w-full flex items-center justify-center py-4.5 px-8 rounded-2xl bg-[#F07A6E] hover:bg-[#EE7163] active:scale-[0.99] text-[#1a1a1a] font-['Geist_Mono'] text-[0.82rem] font-bold tracking-[0.24em] uppercase border border-[#E46B5F] shadow-[0_6px_20px_rgba(240,122,110,0.25)] transition-all cursor-pointer group"
            >
              <span>REGISTER NOW</span>
              <span className="ml-2 font-light group-hover:translate-x-1.5 transition-transform">→</span>
            </Link>
          </motion.div>

        </div>
      </main>

      {/* ========================================================================= */}
      {/* 3. MOBILE STICKY BOTTOM REGISTRATION CTA BAR (Pinned, thumb-friendly)     */}
      {/* ========================================================================= */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden p-4 bg-[#FAF7F2]/92 backdrop-blur-md border-t border-black/10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto">
          <Link
            to={`/events/${event.id}/register`}
            id="mobile-sticky-register-now-cta"
            className="w-full flex items-center justify-center py-3.5 px-6 rounded-2xl bg-[#F07A6E] hover:bg-[#EE7163] active:scale-[0.99] text-[#1a1a1a] font-['Geist_Mono'] text-xs font-bold tracking-[0.22em] uppercase border border-[#E46B5F] shadow-[0_4px_16px_rgba(240,122,110,0.25)] transition-all"
          >
            <span>REGISTER NOW</span>
            <span className="ml-2">→</span>
          </Link>
        </div>
      </div>

    </div>
  );
}

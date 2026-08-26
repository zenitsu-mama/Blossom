import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { ArrowLeft, X, Calendar, User, Music2, Palette, BookOpen } from 'lucide-react';
import { EventData } from '../types';

/* ========================================================================= */
/* BOTANICAL SVG GRAPHIC ELEMENTS (High fidelity editorial art assets)       */
/* ========================================================================= */

// Delicate peony line art for Music (Coral tile)
function MusicBotanicalArt({ expanded = false, isDesktop = false }: { expanded?: boolean; isDesktop?: boolean }) {
  return (
    <svg
      className={`absolute pointer-events-none text-[#1a1a1a] transition-all duration-500 ${
        isDesktop
          ? expanded
            ? 'right-6 -bottom-8 w-72 h-72 opacity-20'
            : 'right-3 -bottom-6 w-56 xl:w-64 h-56 xl:h-64 opacity-35'
          : expanded
          ? 'right-2 -bottom-6 w-48 h-48 opacity-25'
          : '-right-3 -bottom-4 w-36 h-36 opacity-35'
      }`}
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
    >
      {/* Center stamen */}
      <circle cx="100" cy="100" r="10" strokeWidth="1.2" strokeDasharray="2 2" />
      <path d="M96 95 L92 85 M100 93 L100 82 M105 95 L110 86 M104 105 L114 112 M96 104 L88 110" strokeWidth="1.2" />
      {/* Inner Petals */}
      <path d="M85 85 C75 65 110 50 120 75 C130 90 115 110 95 105 Z" strokeWidth="1.2" />
      <path d="M115 80 C135 65 155 90 140 110 C125 125 105 115 110 95 Z" strokeWidth="1.2" />
      <path d="M80 110 C60 115 65 145 90 145 C110 145 115 125 95 115 Z" strokeWidth="1.2" />
      {/* Outer Petals */}
      <path d="M60 70 C40 40 100 20 130 50 C145 65 135 90 115 85" strokeWidth="1" opacity="0.8" />
      <path d="M140 60 C175 50 190 95 170 125 C155 145 125 135 120 115" strokeWidth="1" opacity="0.8" />
      <path d="M145 130 C165 160 120 185 90 170 C70 155 80 130 95 130" strokeWidth="1" opacity="0.8" />
      <path d="M75 145 C45 160 25 120 45 95 C60 80 80 95 75 115" strokeWidth="1" opacity="0.8" />
      {/* Petal Veins & Texture */}
      <path d="M90 70 Q95 85 92 95 M130 75 Q120 88 115 95 M145 105 Q130 110 115 108 M85 130 Q92 120 95 110" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
    </svg>
  );
}

// Delicate blossoming branch for Theatre (Blush tile)
function TheatreBotanicalArt({ expanded = false, isDesktop = false }: { expanded?: boolean; isDesktop?: boolean }) {
  return (
    <svg
      className={`absolute pointer-events-none text-[#1a1a1a] transition-all duration-500 ${
        isDesktop
          ? expanded
            ? 'top-4 right-4 w-48 h-48 opacity-25'
            : 'top-1 right-2 w-36 xl:w-44 h-36 xl:h-44 opacity-40'
          : expanded
          ? 'top-4 right-4 w-36 h-36 opacity-30'
          : 'top-2 right-2 w-24 h-24 opacity-40'
      }`}
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
    >
      <defs>
        <radialGradient id="theatreWashGrad" cx="70%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#F09B8E" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#F8DDD7" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Soft watercolor wash under branches */}
      <ellipse cx="80" cy="55" rx="35" ry="30" fill="url(#theatreWashGrad)" stroke="none" />
      <path d="M110 10 Q70 35 40 70 Q25 90 10 110" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M80 30 Q65 15 50 20" strokeWidth="1" strokeLinecap="round" />
      <path d="M55 55 Q35 45 25 55" strokeWidth="1" strokeLinecap="round" />
      {/* Buds and blossoms */}
      <ellipse cx="48" cy="18" rx="6" ry="4" transform="rotate(-20 48 18)" strokeWidth="1" />
      <ellipse cx="23" cy="53" rx="5" ry="3.5" transform="rotate(15 23 53)" strokeWidth="1" />
      <circle cx="85" cy="22" r="3.5" strokeWidth="0.9" />
      <circle cx="35" cy="75" r="3" strokeWidth="0.9" />
      <circle cx="68" cy="42" r="2.5" strokeWidth="0.8" />
    </svg>
  );
}

// Flowing watercolor wash & splash for Dance (Peach tile)
function DanceBotanicalArt({ expanded = false, isDesktop = false }: { expanded?: boolean; isDesktop?: boolean }) {
  return (
    <svg
      className={`absolute pointer-events-none transition-all duration-500 ${
        isDesktop
          ? expanded
            ? 'right-0 bottom-0 w-64 h-64 opacity-40'
            : 'right-1 bottom-1 w-48 xl:w-56 h-48 xl:h-56 opacity-55'
          : expanded
          ? '-left-6 -bottom-6 w-44 h-44 opacity-35'
          : '-left-4 -bottom-4 w-32 h-32 opacity-45'
      }`}
      viewBox="0 0 150 150"
      fill="none"
    >
      <path
        d="M20 130 C10 80 50 50 80 70 C110 90 130 50 140 100 C150 140 90 150 50 145 Z"
        fill="#EE8B7C"
        opacity="0.3"
      />
      <path
        d="M40 120 C30 90 60 70 85 85 C110 100 125 120 90 140 C65 150 50 135 40 120 Z"
        fill="#E57364"
        opacity="0.35"
      />
      {/* Flower Petal Outline In Dance Wash */}
      <circle cx="105" cy="95" r="25" stroke="#E57364" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.5" fill="none" />
      <circle cx="115" cy="85" r="18" stroke="#E57364" strokeWidth="0.7" opacity="0.4" fill="none" />
      {/* Stipples/Splatter */}
      <circle cx="35" cy="65" r="2" fill="#E57364" opacity="0.5" />
      <circle cx="50" cy="50" r="1.5" fill="#E57364" opacity="0.4" />
      <circle cx="115" cy="75" r="2.5" fill="#E57364" opacity="0.5" />
      <circle cx="125" cy="60" r="1.5" fill="#E57364" opacity="0.4" />
      <circle cx="65" cy="35" r="1.2" fill="#E57364" opacity="0.5" />
    </svg>
  );
}

// Lush blooming coral-pink botanical flower & ink splatter for Art (Dark tile)
function ArtBotanicalArt({ expanded = false, isDesktop = false }: { expanded?: boolean; isDesktop?: boolean }) {
  return (
    <svg
      className={`absolute pointer-events-none transition-all duration-500 ${
        isDesktop
          ? expanded
            ? 'right-0 bottom-0 w-80 h-80 opacity-90'
            : '-right-2 -bottom-4 w-60 xl:w-72 h-60 xl:h-72 opacity-95'
          : expanded
          ? 'right-0 bottom-0 w-60 h-60 opacity-90'
          : '-right-4 -bottom-6 w-44 h-44 opacity-95'
      }`}
      viewBox="0 0 200 200"
      fill="none"
    >
      <defs>
        <radialGradient id="artPetalGrad" cx="60%" cy="60%" r="65%">
          <stop offset="0%" stopColor="#F9A492" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#EE7767" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#BA4132" stopOpacity="0.7" />
        </radialGradient>
        <radialGradient id="artGlowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F08075" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#22201F" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Atmospheric Glow */}
      <circle cx="140" cy="140" r="70" fill="url(#artGlowGrad)" />

      {/* Organic Watercolor Ink Splatter */}
      <g opacity="0.7" fill="#EE7767">
        <circle cx="75" cy="105" r="3.5" />
        <circle cx="88" cy="92" r="2" />
        <circle cx="60" cy="120" r="2.5" />
        <circle cx="95" cy="70" r="3" />
        <circle cx="108" cy="60" r="1.5" />
        <circle cx="115" cy="80" r="2.2" />
        <path d="M80 110 Q85 100 90 108 Q88 115 80 110 Z" />
        <path d="M100 85 Q108 78 112 85 Q105 92 100 85 Z" />
      </g>

      {/* Outer Large Petals */}
      <path
        d="M100 130 C75 105 95 65 130 80 C160 95 175 135 145 160 C120 180 90 155 100 130 Z"
        fill="url(#artPetalGrad)"
        opacity="0.85"
      />
      <path
        d="M130 110 C155 85 190 110 185 145 C180 175 140 185 125 155 C115 135 120 120 130 110 Z"
        fill="url(#artPetalGrad)"
        opacity="0.9"
      />
      {/* Center Blossom Bloom */}
      <path
        d="M115 145 C100 125 120 105 140 115 C160 125 155 155 135 160 C125 162 118 155 115 145 Z"
        fill="#FDC1B5"
        opacity="0.95"
      />

      {/* Detailed Fine Flower Outlines */}
      <path
        d="M100 130 C75 105 95 65 130 80 C160 95 175 135 145 160"
        stroke="#FFFFFF"
        strokeWidth="0.8"
        strokeOpacity="0.4"
      />
      <path
        d="M130 110 C155 85 190 110 185 145"
        stroke="#FFFFFF"
        strokeWidth="0.8"
        strokeOpacity="0.4"
      />
      <path
        d="M115 145 C100 125 120 105 140 115"
        stroke="#FFFFFF"
        strokeWidth="0.9"
        strokeOpacity="0.6"
      />
    </svg>
  );
}

// Pencil sketched botanical lotus/flower for Literacy (Parchment/Olive tile)
function LiteracyBotanicalArt({ expanded = false, isDesktop = false }: { expanded?: boolean; isDesktop?: boolean }) {
  return (
    <svg
      className={`absolute pointer-events-none text-[#1a1a1a] transition-all duration-500 ${
        isDesktop
          ? expanded
            ? 'right-12 top-1/2 -translate-y-1/2 w-64 h-64 opacity-25'
            : 'right-12 xl:right-16 top-1/2 -translate-y-1/2 w-48 xl:w-56 h-48 xl:h-56 opacity-45'
          : expanded
          ? 'right-4 top-1/2 -translate-y-1/2 w-40 h-40 opacity-30'
          : 'right-12 top-1/2 -translate-y-1/2 w-28 h-28 opacity-40'
      }`}
      viewBox="0 0 160 160"
      fill="none"
      stroke="currentColor"
    >
      {/* Stem */}
      <path d="M125 150 C118 130 100 110 90 90" strokeWidth="1.6" strokeLinecap="round" />
      {/* Center core */}
      <ellipse cx="80" cy="80" rx="8" ry="6" strokeWidth="1.2" />
      {/* Center petals */}
      <path d="M72 75 C60 55 90 45 95 65 C100 80 85 90 75 82 Z" strokeWidth="1.2" />
      <path d="M88 72 C105 58 120 78 110 95 C100 105 85 95 88 80 Z" strokeWidth="1.2" />
      <path d="M68 85 C50 88 55 112 75 115 C90 115 95 98 80 90 Z" strokeWidth="1.2" />
      {/* Outer blooming petals */}
      <path d="M50 65 C30 40 80 20 105 45 C120 60 110 80 95 75" strokeWidth="1" opacity="0.8" />
      <path d="M110 50 C140 40 155 80 135 105 C125 120 100 110 95 95" strokeWidth="1" opacity="0.8" />
      <path d="M115 105 C130 130 95 150 70 135 C55 125 65 105 75 105" strokeWidth="1" opacity="0.8" />
      <path d="M60 115 C35 130 20 95 38 75 C50 62 65 75 62 92" strokeWidth="1" opacity="0.8" />
      {/* Terracotta splatter dots */}
      <circle cx="135" cy="65" r="1.5" fill="#EE7767" stroke="none" opacity="0.6" />
      <circle cx="145" cy="80" r="2" fill="#EE7767" stroke="none" opacity="0.5" />
      <circle cx="30" cy="110" r="1.5" fill="#EE7767" stroke="none" opacity="0.5" />
      <circle cx="22" cy="125" r="2.2" fill="#EE7767" stroke="none" opacity="0.5" />
    </svg>
  );
}

// Corner Watercolor Lotus for Desktop Sidebar
function SidebarLotusArt() {
  return (
    <svg
      className="w-full h-full pointer-events-none"
      viewBox="0 0 200 200"
      fill="none"
    >
      <defs>
        <radialGradient id="lotusSoftGrad" cx="30%" cy="70%" r="70%">
          <stop offset="0%" stopColor="#F9A492" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#EE7767" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#FAF7F2" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Stem */}
      <path d="M20 190 Q50 150 70 130" stroke="#4A6548" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      {/* Watercolor Wash Splash */}
      <circle cx="50" cy="140" r="45" fill="url(#lotusSoftGrad)" />
      {/* Layered Lotus Petals */}
      <path d="M30 170 C20 130 60 100 85 115 C110 130 80 175 40 180 Z" fill="#F8DDD7" opacity="0.85" stroke="#E57364" strokeWidth="0.8" />
      <path d="M55 160 C50 120 90 90 115 110 C135 130 105 170 65 170 Z" fill="#FBD1B7" opacity="0.9" stroke="#E57364" strokeWidth="0.8" />
      <path d="M75 150 C80 110 120 85 140 115 C155 140 120 170 85 160 Z" fill="#F07A6E" opacity="0.8" stroke="#E57364" strokeWidth="0.8" />
      <path d="M40 150 C30 115 70 80 100 95 C120 115 90 155 50 160 Z" fill="#FDC1B5" opacity="0.85" stroke="#BA4132" strokeWidth="0.8" />
      {/* Stipples */}
      <circle cx="70" cy="120" r="1.5" fill="#E57364" opacity="0.6" />
      <circle cx="95" cy="105" r="2" fill="#E57364" opacity="0.5" />
      <circle cx="110" cy="130" r="1.8" fill="#E57364" opacity="0.5" />
    </svg>
  );
}

// Stage curtains icon for Theatre
function TheatreCurtainsIcon({ className = "w-4 h-4 text-current" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4h20M2 4v16M22 4v16" />
      <path d="M2 4c4 4 4 12 0 16M22 4c-4 4-4 12 0 16" />
      <path d="M7 4c2 3 2 9 0 16M17 4c-2 3-2 9 0 16" />
      <path d="M12 4v16" strokeDasharray="2 2" />
    </svg>
  );
}

// Dance shoes / footsteps icon for Dance
function DanceShoesIcon({ className = "w-4 h-4 text-current" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3c-1.5 2-2 5-2 8 0 4 2 8 4 9 1 0 2-2 2-4 0-4-1-8-3-13z" />
      <path d="M16 3c-1.5 2-2 5-2 8 0 4 2 8 4 9 1 0 2-2 2-4 0-4-1-8-3-13z" />
      <path d="M6 11c1-1 3-1 4 0M14 11c1-1 3-1 4 0" />
    </svg>
  );
}

// Eight-petal botanical flower glyph for logo watermark
function FlowerWatermarkIcon({ className = "w-4 h-4 text-[#F87A71]" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 2a3 3 0 0 0 0 6 3 3 0 0 0 0-6z" />
      <path d="M12 16a3 3 0 0 0 0 6 3 3 0 0 0 0-6z" />
      <path d="M2 12a3 3 0 0 0 6 0 3 3 0 0 0-6 0z" />
      <path d="M16 12a3 3 0 0 0 6 0 3 3 0 0 0-6 0z" />
      <path d="M4.93 4.93a3 3 0 0 0 4.24 4.24 3 3 0 0 0-4.24-4.24z" />
      <path d="M14.83 14.83a3 3 0 0 0 4.24 4.24 3 3 0 0 0-4.24-4.24z" />
      <path d="M4.93 19.07a3 3 0 0 0 4.24-4.24 3 3 0 0 0-4.24 4.24z" />
      <path d="M14.83 9.17a3 3 0 0 0 4.24-4.24 3 3 0 0 0-4.24 4.24z" />
    </svg>
  );
}

/* ========================================================================= */
/* CATEGORY DATA MODEL                                                       */
/* ========================================================================= */

interface CategoryConfig {
  key: string;
  name: string;
  number: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  numberClass: string;
  pillBgClass: string;
  pillTextClass: string;
  iconComponent: React.ComponentType<{ className?: string }>;
  artComponent: React.ComponentType<{ expanded?: boolean; isDesktop?: boolean }>;
}

const CATEGORIES: CategoryConfig[] = [
  {
    key: 'music',
    name: 'MUSIC',
    number: '01',
    bgClass: 'bg-[#F07A6E]', // Coral / Salmon
    textClass: 'text-[#1C1917]',
    borderClass: 'border-[#E46B5F]',
    numberClass: 'border-b border-[#1C1917]/70 text-[#1C1917]',
    pillBgClass: 'bg-black/10 border-black/15',
    pillTextClass: 'text-[#1C1917]',
    iconComponent: Music2,
    artComponent: MusicBotanicalArt,
  },
  {
    key: 'theatre',
    name: 'THEATRE',
    number: '02',
    bgClass: 'bg-[#F8DDD7]', // Soft Blush / Warm Porcelain Pink
    textClass: 'text-[#1C1917]',
    borderClass: 'border-[#EED0C8]',
    numberClass: 'border-b border-[#1C1917]/70 text-[#1C1917]',
    pillBgClass: 'bg-black/10 border-black/15',
    pillTextClass: 'text-[#1C1917]',
    iconComponent: TheatreCurtainsIcon,
    artComponent: TheatreBotanicalArt,
  },
  {
    key: 'dance',
    name: 'DANCE',
    number: '03',
    bgClass: 'bg-[#FBD1B7]', // Warm Pale Apricot / Peach
    textClass: 'text-[#1C1917]',
    borderClass: 'border-[#EEC3A7]',
    numberClass: 'border-b border-[#1C1917]/70 text-[#1C1917]',
    pillBgClass: 'bg-black/10 border-black/15',
    pillTextClass: 'text-[#1C1917]',
    iconComponent: DanceShoesIcon,
    artComponent: DanceBotanicalArt,
  },
  {
    key: 'art',
    name: 'ART',
    number: '04',
    bgClass: 'bg-[#22201F]', // Velvety Charcoal / Deep Ink Black
    textClass: 'text-[#FFFFFF]',
    borderClass: 'border-[#383433]',
    numberClass: 'border-b border-white/70 text-white',
    pillBgClass: 'bg-white/10 border-white/20',
    pillTextClass: 'text-white',
    iconComponent: Palette,
    artComponent: ArtBotanicalArt,
  },
  {
    key: 'literary',
    name: 'LITERACY',
    number: '05',
    bgClass: 'bg-[#E2E7DB]', // Muted Olive / Sage Linen Parchment
    textClass: 'text-[#1C1917]',
    borderClass: 'border-[#CCD2C4]',
    numberClass: 'border-b border-[#1C1917]/70 text-[#1C1917]',
    pillBgClass: 'bg-black/10 border-black/15',
    pillTextClass: 'text-[#1C1917]',
    iconComponent: BookOpen,
    artComponent: LiteracyBotanicalArt,
  },
];

export default function Events() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data.events || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const activeCategoryObj = CATEGORIES.find(c => c.key === selectedCategory);
  const filteredEvents = selectedCategory
    ? events.filter(e => e.category.toLowerCase() === selectedCategory.toLowerCase())
    : [];

  return (
    <div className="w-full h-full min-h-full bg-[#FAF7F2]">
      {/* ========================================================================= */}
      {/* 1. MOBILE EXPERIENCE: EXPANDING BENTO COMPOSITION (lg:hidden)             */}
      {/* ========================================================================= */}
      <div className="block lg:hidden w-full min-h-full px-4 sm:px-6 pt-5 pb-24 bg-[#FAF7F2] relative">
        <LayoutGroup id="mobile-bento-layout">
          {/* Editorial Header */}
          <motion.div
            layout
            animate={{ opacity: selectedCategory ? 0.35 : 1 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-6"
          >
            <h1 className="font-['Barlow_Condensed'] text-4xl sm:text-5xl font-black uppercase tracking-wider text-[#1a1a1a] leading-none">
              EVENTS
            </h1>
            <p className="font-['Geist_Mono'] text-[0.68rem] tracking-[0.28em] text-[#1a1a1a]/60 uppercase mt-1.5 font-medium">
              CHOOSE A CATEGORY
            </p>
          </motion.div>

          {/* Bento Grid Initial Placement */}
          <div className="flex flex-col gap-3.5 w-full max-w-[420px] mx-auto relative">
            {/* ROW 1: MUSIC (58%) + THEATRE (42%) */}
            <div className="grid grid-cols-[1.35fr_1fr] gap-3.5 h-[190px]">
              {/* MUSIC TILE */}
              {(() => {
                const cat = CATEGORIES[0];
                const count = events.filter(e => e.category.toLowerCase() === cat.key).length;
                const Art = cat.artComponent;
                const isSelected = selectedCategory === cat.key;
                return (
                  <motion.div
                    layoutId={`mobile-bento-tile-${cat.key}`}
                    key={cat.key}
                    id={`mobile-bento-tile-${cat.key}`}
                    onClick={() => setSelectedCategory(isSelected ? null : cat.key)}
                    whileTap={{ scale: 0.97 }}
                    animate={{
                      opacity: selectedCategory && !isSelected ? 0.25 : 1,
                      scale: selectedCategory && !isSelected ? 0.96 : 1,
                    }}
                    transition={{
                      layout: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.3 },
                      scale: { duration: 0.3 },
                    }}
                    className={`relative flex flex-col justify-between p-4 rounded-2xl border text-left overflow-hidden cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.04)] ${cat.bgClass} ${cat.textClass} ${cat.borderClass} ${isSelected ? 'invisible pointer-events-none' : ''}`}
                  >
                    <Art />
                    <div>
                      <h2 className="font-['Barlow_Condensed'] text-5xl font-black uppercase tracking-tight leading-none z-10">
                        {cat.name}
                      </h2>
                      <span className="font-['Geist_Mono'] text-[0.62rem] font-semibold tracking-wider opacity-60 uppercase block mt-1">
                        {count.toString().padStart(2, '0')} EVENTS
                      </span>
                    </div>
                    <div className="z-10 self-end mt-auto">
                      <span className={`font-['Barlow_Condensed'] text-lg font-bold tracking-wider pb-0.5 ${cat.numberClass}`}>
                        {cat.number}
                      </span>
                    </div>
                  </motion.div>
                );
              })()}

              {/* THEATRE TILE */}
              {(() => {
                const cat = CATEGORIES[1];
                const count = events.filter(e => e.category.toLowerCase() === cat.key).length;
                const Art = cat.artComponent;
                const isSelected = selectedCategory === cat.key;
                return (
                  <motion.div
                    layoutId={`mobile-bento-tile-${cat.key}`}
                    key={cat.key}
                    id={`mobile-bento-tile-${cat.key}`}
                    onClick={() => setSelectedCategory(isSelected ? null : cat.key)}
                    whileTap={{ scale: 0.97 }}
                    animate={{
                      opacity: selectedCategory && !isSelected ? 0.25 : 1,
                      scale: selectedCategory && !isSelected ? 0.96 : 1,
                    }}
                    transition={{
                      layout: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.3 },
                      scale: { duration: 0.3 },
                    }}
                    className={`relative flex flex-col justify-between p-4 rounded-2xl border text-left overflow-hidden cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.04)] ${cat.bgClass} ${cat.textClass} ${cat.borderClass} ${isSelected ? 'invisible pointer-events-none' : ''}`}
                  >
                    <Art />
                    <div>
                      <h2 className="font-['Barlow_Condensed'] text-3xl font-extrabold uppercase tracking-tight leading-none z-10">
                        {cat.name}
                      </h2>
                      <span className="font-['Geist_Mono'] text-[0.6rem] font-semibold tracking-wider opacity-60 uppercase block mt-1">
                        {count.toString().padStart(2, '0')} EVENTS
                      </span>
                    </div>
                    <div className="z-10 self-end mt-auto">
                      <span className={`font-['Barlow_Condensed'] text-lg font-bold tracking-wider pb-0.5 ${cat.numberClass}`}>
                        {cat.number}
                      </span>
                    </div>
                  </motion.div>
                );
              })()}
            </div>

            {/* ROW 2: DANCE (42%) + ART (58%) */}
            <div className="grid grid-cols-[1fr_1.35fr] gap-3.5 h-[190px]">
              {/* DANCE TILE */}
              {(() => {
                const cat = CATEGORIES[2];
                const count = events.filter(e => e.category.toLowerCase() === cat.key).length;
                const Art = cat.artComponent;
                const isSelected = selectedCategory === cat.key;
                return (
                  <motion.div
                    layoutId={`mobile-bento-tile-${cat.key}`}
                    key={cat.key}
                    id={`mobile-bento-tile-${cat.key}`}
                    onClick={() => setSelectedCategory(isSelected ? null : cat.key)}
                    whileTap={{ scale: 0.97 }}
                    animate={{
                      opacity: selectedCategory && !isSelected ? 0.25 : 1,
                      scale: selectedCategory && !isSelected ? 0.96 : 1,
                    }}
                    transition={{
                      layout: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.3 },
                      scale: { duration: 0.3 },
                    }}
                    className={`relative flex flex-col justify-between p-4 rounded-2xl border text-left overflow-hidden cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.04)] ${cat.bgClass} ${cat.textClass} ${cat.borderClass} ${isSelected ? 'invisible pointer-events-none' : ''}`}
                  >
                    <Art />
                    <div>
                      <h2 className="font-['Barlow_Condensed'] text-4xl font-black uppercase tracking-tight leading-none z-10">
                        {cat.name}
                      </h2>
                      <span className="font-['Geist_Mono'] text-[0.6rem] font-semibold tracking-wider opacity-60 uppercase block mt-1">
                        {count.toString().padStart(2, '0')} EVENTS
                      </span>
                    </div>
                    <div className="z-10 self-end mt-auto">
                      <span className={`font-['Barlow_Condensed'] text-lg font-bold tracking-wider pb-0.5 ${cat.numberClass}`}>
                        {cat.number}
                      </span>
                    </div>
                  </motion.div>
                );
              })()}

              {/* ART TILE */}
              {(() => {
                const cat = CATEGORIES[3];
                const count = events.filter(e => e.category.toLowerCase() === cat.key).length;
                const Art = cat.artComponent;
                const isSelected = selectedCategory === cat.key;
                return (
                  <motion.div
                    layoutId={`mobile-bento-tile-${cat.key}`}
                    key={cat.key}
                    id={`mobile-bento-tile-${cat.key}`}
                    onClick={() => setSelectedCategory(isSelected ? null : cat.key)}
                    whileTap={{ scale: 0.97 }}
                    animate={{
                      opacity: selectedCategory && !isSelected ? 0.25 : 1,
                      scale: selectedCategory && !isSelected ? 0.96 : 1,
                    }}
                    transition={{
                      layout: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.3 },
                      scale: { duration: 0.3 },
                    }}
                    className={`relative flex flex-col justify-between p-4 rounded-2xl border text-left overflow-hidden cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.04)] ${cat.bgClass} ${cat.textClass} ${cat.borderClass} ${isSelected ? 'invisible pointer-events-none' : ''}`}
                  >
                    <Art />
                    <div>
                      <h2 className="font-['Barlow_Condensed'] text-5xl font-black uppercase tracking-tight leading-none z-10">
                        {cat.name}
                      </h2>
                      <span className="font-['Geist_Mono'] text-[0.62rem] font-semibold tracking-wider opacity-60 uppercase block mt-1">
                        {count.toString().padStart(2, '0')} EVENTS
                      </span>
                    </div>
                    <div className="z-10 self-start mt-auto">
                      <span className={`font-['Barlow_Condensed'] text-lg font-bold tracking-wider pb-0.5 ${cat.numberClass}`}>
                        {cat.number}
                      </span>
                    </div>
                  </motion.div>
                );
              })()}
            </div>

            {/* ROW 3: LITERACY (100%) */}
            {(() => {
              const cat = CATEGORIES[4];
              const count = events.filter(e => e.category.toLowerCase() === cat.key).length;
              const Art = cat.artComponent;
              const isSelected = selectedCategory === cat.key;
              return (
                <motion.div
                  layoutId={`mobile-bento-tile-${cat.key}`}
                  key={cat.key}
                  id={`mobile-bento-tile-${cat.key}`}
                  onClick={() => setSelectedCategory(isSelected ? null : cat.key)}
                  whileTap={{ scale: 0.98 }}
                  animate={{
                    opacity: selectedCategory && !isSelected ? 0.25 : 1,
                    scale: selectedCategory && !isSelected ? 0.96 : 1,
                  }}
                  transition={{
                    layout: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 0.3 },
                    scale: { duration: 0.3 },
                  }}
                  className={`relative flex items-center justify-between p-5 rounded-2xl border text-left overflow-hidden cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.04)] h-[115px] ${cat.bgClass} ${cat.textClass} ${cat.borderClass} ${isSelected ? 'invisible pointer-events-none' : ''}`}
                >
                  <Art />
                  <div>
                    <h2 className="font-['Barlow_Condensed'] text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none z-10">
                      {cat.name}
                    </h2>
                    <span className="font-['Geist_Mono'] text-[0.62rem] font-semibold tracking-wider opacity-60 uppercase block mt-1">
                      {count.toString().padStart(2, '0')} EVENTS
                    </span>
                  </div>
                  <div className="z-10 self-end">
                    <span className={`font-['Barlow_Condensed'] text-lg font-bold tracking-wider pb-0.5 ${cat.numberClass}`}>
                      {cat.number}
                    </span>
                  </div>
                </motion.div>
              );
            })()}
          </div>

          {/* MOBILE EXPANDED TILE OVERLAY WITH CONTINUOUS FLIP LAYOUT ANIMATION */}
          <AnimatePresence>
            {selectedCategory && activeCategoryObj && (
              <div className="fixed inset-0 z-50 flex flex-col justify-start p-4 sm:p-6 overflow-y-auto bg-black/40 backdrop-blur-xs">
                <motion.div
                  layoutId={`mobile-bento-tile-${activeCategoryObj.key}`}
                  key={`mobile-expanded-${activeCategoryObj.key}`}
                  transition={{
                    duration: 0.55,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`relative w-full max-w-[420px] mx-auto rounded-3xl border shadow-2xl overflow-hidden my-auto flex flex-col p-6 min-h-[580px] max-h-[85vh] ${activeCategoryObj.bgClass} ${activeCategoryObj.textClass} ${activeCategoryObj.borderClass}`}
                >
                  {/* Botanical Graphic in Expanded Form */}
                  <activeCategoryObj.artComponent expanded={true} />

                  {/* Top Bar with Return Navigation & Close Button */}
                  <div className="flex items-center justify-between z-20 mb-6">
                    <button
                      id="mobile-close-category-back-btn"
                      onClick={() => setSelectedCategory(null)}
                      className="inline-flex items-center gap-1.5 font-['Barlow_Condensed'] text-sm font-bold uppercase tracking-[0.2em] py-1 cursor-pointer active:translate-x-[-2px] transition-transform text-[#F87A71]"
                    >
                      <ArrowLeft size={16} strokeWidth={2.5} />
                      <span>CATEGORIES</span>
                    </button>

                    <button
                      id="mobile-close-category-icon-btn"
                      onClick={() => setSelectedCategory(null)}
                      className={`p-1.5 rounded-full border cursor-pointer active:scale-95 transition-transform ${
                        activeCategoryObj.key === 'art'
                          ? 'border-white/20 text-white bg-white/10 hover:bg-white/20'
                          : 'border-black/15 text-black bg-black/5 hover:bg-black/10'
                      }`}
                      aria-label="Close category"
                    >
                      <X size={16} strokeWidth={2.2} />
                    </button>
                  </div>

                  {/* Interactive Header (Tapping collapses it back) */}
                  <div
                    onClick={() => setSelectedCategory(null)}
                    className="z-20 mb-6 cursor-pointer group"
                    title="Tap to collapse category"
                  >
                    <div className="flex items-baseline justify-between">
                      <h1 className="font-['Barlow_Condensed'] text-6xl sm:text-7xl font-black uppercase tracking-tight leading-[0.88] transition-transform group-hover:scale-[0.99]">
                        {activeCategoryObj.name}
                      </h1>
                      <span className={`font-['Barlow_Condensed'] text-2xl font-bold tracking-wider pb-1 ${activeCategoryObj.numberClass}`}>
                        {activeCategoryObj.number}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 font-['Geist_Mono'] text-xs font-semibold uppercase tracking-[0.28em] opacity-75">
                      <span>EVENTS</span>
                      <span>·</span>
                      <span>{filteredEvents.length.toString().padStart(2, '0')} LISTED</span>
                    </div>
                    <div className={`w-14 h-[2px] mt-3 ${activeCategoryObj.key === 'art' ? 'bg-[#F9A492]' : 'bg-[#F07A6E]'}`}></div>
                  </div>

                  {/* Filtered Event Catalogue Listing */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.15, duration: 0.35 }}
                    className="z-20 flex-1 overflow-y-auto pr-1 space-y-3"
                  >
                    {loading ? (
                      <div className="py-8 space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="animate-pulse flex items-center gap-4 py-3 border-b border-black/10">
                            <div className="w-8 h-8 bg-black/10 rounded"></div>
                            <div className="w-full h-8 bg-black/10 rounded"></div>
                          </div>
                        ))}
                      </div>
                    ) : filteredEvents.length === 0 ? (
                      <div className="py-12 text-center">
                        <p className="font-['Geist'] text-sm opacity-60">
                          No events currently scheduled under this category.
                        </p>
                      </div>
                    ) : (
                      filteredEvents.map((event, index) => {
                        const num = (index + 1).toString().padStart(2, '0');
                        return (
                          <Link
                            key={event.id}
                            id={`mobile-expanded-event-link-${event.id}`}
                            to={`/events/${event.id}`}
                            className={`grid grid-cols-[40px_1fr_auto] items-center py-3.5 px-3 rounded-xl border transition-colors group cursor-pointer ${
                              activeCategoryObj.key === 'art'
                                ? 'border-white/10 bg-white/5 hover:bg-white/10 active:bg-white/15'
                                : 'border-black/10 bg-black/5 hover:bg-black/10 active:bg-black/15'
                            }`}
                          >
                            {/* Numeral */}
                            <span className="font-['Barlow_Condensed'] text-2xl font-black leading-none text-[#F87A71]">
                              {num}
                            </span>

                            {/* Event Details */}
                            <div className="flex flex-col pr-2">
                              <h3 className="font-['Barlow_Condensed'] text-lg font-bold uppercase tracking-tight leading-tight">
                                {event.name}
                              </h3>
                              <div className="mt-0.5 flex flex-wrap items-center gap-1.5 font-['Geist_Mono'] text-[0.62rem] uppercase opacity-70">
                                <span>{event.venue_or_platform}</span>
                                <span>•</span>
                                <span>{event.type}</span>
                                <span>•</span>
                                <span>{event.submission_type}</span>
                              </div>
                            </div>

                            {/* Coral Arrow */}
                            <span className="text-lg font-light group-hover:translate-x-1 transition-transform ml-1 text-[#F87A71]">
                              →
                            </span>
                          </Link>
                        );
                      })
                    )}
                  </motion.div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP EXPERIENCE: EDITORIAL SIDEBAR + BENTO GRID (hidden lg:flex)    */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex h-screen w-full bg-[#FAF7F2] overflow-hidden">
        {/* LEFT EDITORIAL SIDEBAR */}
        <aside className="w-60 xl:w-68 h-full shrink-0 border-r border-black/10 bg-[#FAF7F2] p-8 flex flex-col justify-between relative select-none">
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

            {/* Small Floral Watermark Icon */}
            <div className="mt-6 mb-8">
              <FlowerWatermarkIcon className="w-5 h-5 text-[#F87A71]/80" />
            </div>

            {/* Navigation Menu */}
            <nav className="flex flex-col gap-2.5">
              <button
                id="desktop-sidebar-events-btn"
                onClick={() => setSelectedCategory(null)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#FADBD4] text-[#1a1a1a] font-['Geist_Mono'] text-[0.72rem] tracking-[0.16em] uppercase font-bold shadow-[0_2px_8px_rgba(240,122,110,0.12)] transition-all cursor-pointer text-left"
              >
                <Calendar size={16} className="text-[#F87A71]" strokeWidth={2.2} />
                <span>EVENTS</span>
              </button>

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
          <div className="absolute -bottom-4 -left-4 w-48 h-48 pointer-events-none opacity-85">
            <SidebarLotusArt />
          </div>
        </aside>

        {/* MAIN EDITORIAL CONTENT AREA */}
        <main className="flex-1 h-full overflow-y-auto p-8 xl:p-10 flex flex-col justify-between relative hide-scrollbar">
          <LayoutGroup id="desktop-bento-layout">
            {/* Top Main Content Header */}
            <div className="flex items-start justify-between mb-6 xl:mb-8 shrink-0">
              <div>
                <h1 className="font-['Barlow_Condensed'] text-7xl xl:text-8xl font-black uppercase tracking-wider text-[#1a1a1a] leading-[0.88]">
                  EVENTS
                </h1>
                <p className="font-['Geist_Mono'] text-[0.68rem] tracking-[0.28em] text-[#1a1a1a]/70 uppercase mt-2 font-semibold pb-0.5 inline-block border-b border-[#1a1a1a]/30">
                  CHOOSE A CATEGORY
                </p>
              </div>

              {/* Editorial Tagline with Blossom Icon */}
              <div className="hidden xl:flex items-center gap-2 font-['Geist_Mono'] text-[0.68rem] tracking-[0.22em] text-[#1a1a1a]/60 uppercase pt-2">
                <span>CULTIVATE. CELEBRATE. CREATE.</span>
                <FlowerWatermarkIcon className="w-4 h-4 text-[#F87A71]" />
              </div>
            </div>

            {/* Bento Grid Composition / Expanded Mode */}
            <div className="flex-1 flex flex-col justify-between max-w-[1360px] w-full gap-4 xl:gap-5 relative min-h-[580px]">
              {/* ROW 1: MUSIC (62% wide) + THEATRE (38% wide) */}
              <div className="grid grid-cols-[1.62fr_1fr] gap-4 xl:gap-5 min-h-[200px] xl:min-h-[225px]">
                {/* MUSIC TILE (01) */}
                {(() => {
                  const cat = CATEGORIES[0];
                  const count = events.filter(e => e.category.toLowerCase() === cat.key).length;
                  const Icon = cat.iconComponent;
                  const Art = cat.artComponent;
                  const isSelected = selectedCategory === cat.key;
                  return (
                    <motion.div
                      layoutId={`desktop-bento-tile-${cat.key}`}
                      key={cat.key}
                      id={`desktop-bento-tile-${cat.key}`}
                      onClick={() => setSelectedCategory(isSelected ? null : cat.key)}
                      whileHover={{ scale: 1.008 }}
                      whileTap={{ scale: 0.985 }}
                      animate={{
                        opacity: selectedCategory && !isSelected ? 0.2 : 1,
                        scale: selectedCategory && !isSelected ? 0.98 : 1,
                      }}
                      transition={{
                        layout: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
                        opacity: { duration: 0.35 },
                        scale: { duration: 0.35 },
                      }}
                      className={`relative flex flex-col justify-between p-6 xl:p-7 rounded-[28px] border text-left overflow-hidden cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-shadow hover:shadow-[0_8px_30px_rgba(240,122,110,0.15)] ${cat.bgClass} ${cat.textClass} ${cat.borderClass} ${isSelected ? 'invisible pointer-events-none' : ''}`}
                    >
                      <Art isDesktop={true} />
                      
                      {/* Top Numeral with Underline */}
                      <div className="z-10">
                        <span className={`font-['Barlow_Condensed'] text-2xl font-bold tracking-wider pb-0.5 ${cat.numberClass}`}>
                          {cat.number}
                        </span>
                      </div>

                      {/* Main Category Display Title */}
                      <h2 className="font-['Barlow_Condensed'] text-7xl xl:text-8xl font-black uppercase tracking-tight leading-none z-10 my-auto">
                        {cat.name}
                      </h2>

                      {/* Bottom Dynamic Event Count Pill & Icon */}
                      <div className="z-10 flex items-center gap-3 mt-auto">
                        <div className={`rounded-full px-3.5 py-1.5 border font-['Geist_Mono'] text-[0.68rem] font-bold tracking-wider uppercase ${cat.pillBgClass} ${cat.pillTextClass}`}>
                          {count.toString().padStart(2, '0')} EVENTS
                        </div>
                        <Icon className="w-4 h-4 opacity-75" />
                      </div>
                    </motion.div>
                  );
                })()}

                {/* THEATRE TILE (02) */}
                {(() => {
                  const cat = CATEGORIES[1];
                  const count = events.filter(e => e.category.toLowerCase() === cat.key).length;
                  const Icon = cat.iconComponent;
                  const Art = cat.artComponent;
                  const isSelected = selectedCategory === cat.key;
                  return (
                    <motion.div
                      layoutId={`desktop-bento-tile-${cat.key}`}
                      key={cat.key}
                      id={`desktop-bento-tile-${cat.key}`}
                      onClick={() => setSelectedCategory(isSelected ? null : cat.key)}
                      whileHover={{ scale: 1.008 }}
                      whileTap={{ scale: 0.985 }}
                      animate={{
                        opacity: selectedCategory && !isSelected ? 0.2 : 1,
                        scale: selectedCategory && !isSelected ? 0.98 : 1,
                      }}
                      transition={{
                        layout: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
                        opacity: { duration: 0.35 },
                        scale: { duration: 0.35 },
                      }}
                      className={`relative flex flex-col justify-between p-6 xl:p-7 rounded-[28px] border text-left overflow-hidden cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-shadow hover:shadow-[0_8px_30px_rgba(248,221,215,0.3)] ${cat.bgClass} ${cat.textClass} ${cat.borderClass} ${isSelected ? 'invisible pointer-events-none' : ''}`}
                    >
                      <Art isDesktop={true} />

                      {/* Top Numeral */}
                      <div className="z-10">
                        <span className={`font-['Barlow_Condensed'] text-2xl font-bold tracking-wider pb-0.5 ${cat.numberClass}`}>
                          {cat.number}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="font-['Barlow_Condensed'] text-5xl xl:text-6xl font-black uppercase tracking-tight leading-none z-10 my-auto">
                        {cat.name}
                      </h2>

                      {/* Bottom Pill & Icon */}
                      <div className="z-10 flex items-center gap-3 mt-auto">
                        <div className={`rounded-full px-3.5 py-1.5 border font-['Geist_Mono'] text-[0.68rem] font-bold tracking-wider uppercase ${cat.pillBgClass} ${cat.pillTextClass}`}>
                          {count.toString().padStart(2, '0')} EVENTS
                        </div>
                        <Icon className="w-4 h-4 opacity-75" />
                      </div>
                    </motion.div>
                  );
                })()}
              </div>

              {/* ROW 2: DANCE (42% wide) + ART (58% wide dark tile) */}
              <div className="grid grid-cols-[1fr_1.38fr] gap-4 xl:gap-5 min-h-[200px] xl:min-h-[225px]">
                {/* DANCE TILE (03) */}
                {(() => {
                  const cat = CATEGORIES[2];
                  const count = events.filter(e => e.category.toLowerCase() === cat.key).length;
                  const Icon = cat.iconComponent;
                  const Art = cat.artComponent;
                  const isSelected = selectedCategory === cat.key;
                  return (
                    <motion.div
                      layoutId={`desktop-bento-tile-${cat.key}`}
                      key={cat.key}
                      id={`desktop-bento-tile-${cat.key}`}
                      onClick={() => setSelectedCategory(isSelected ? null : cat.key)}
                      whileHover={{ scale: 1.008 }}
                      whileTap={{ scale: 0.985 }}
                      animate={{
                        opacity: selectedCategory && !isSelected ? 0.2 : 1,
                        scale: selectedCategory && !isSelected ? 0.98 : 1,
                      }}
                      transition={{
                        layout: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
                        opacity: { duration: 0.35 },
                        scale: { duration: 0.35 },
                      }}
                      className={`relative flex flex-col justify-between p-6 xl:p-7 rounded-[28px] border text-left overflow-hidden cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-shadow hover:shadow-[0_8px_30px_rgba(251,209,183,0.3)] ${cat.bgClass} ${cat.textClass} ${cat.borderClass} ${isSelected ? 'invisible pointer-events-none' : ''}`}
                    >
                      <Art isDesktop={true} />

                      {/* Top Numeral */}
                      <div className="z-10">
                        <span className={`font-['Barlow_Condensed'] text-2xl font-bold tracking-wider pb-0.5 ${cat.numberClass}`}>
                          {cat.number}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="font-['Barlow_Condensed'] text-6xl xl:text-7xl font-black uppercase tracking-tight leading-none z-10 my-auto">
                        {cat.name}
                      </h2>

                      {/* Bottom Pill & Icon */}
                      <div className="z-10 flex items-center gap-3 mt-auto">
                        <div className={`rounded-full px-3.5 py-1.5 border font-['Geist_Mono'] text-[0.68rem] font-bold tracking-wider uppercase ${cat.pillBgClass} ${cat.pillTextClass}`}>
                          {count.toString().padStart(2, '0')} EVENTS
                        </div>
                        <Icon className="w-4 h-4 opacity-75" />
                      </div>
                    </motion.div>
                  );
                })()}

                {/* ART TILE (04 - Dominant Deep Velvet Charcoal) */}
                {(() => {
                  const cat = CATEGORIES[3];
                  const count = events.filter(e => e.category.toLowerCase() === cat.key).length;
                  const Icon = cat.iconComponent;
                  const Art = cat.artComponent;
                  const isSelected = selectedCategory === cat.key;
                  return (
                    <motion.div
                      layoutId={`desktop-bento-tile-${cat.key}`}
                      key={cat.key}
                      id={`desktop-bento-tile-${cat.key}`}
                      onClick={() => setSelectedCategory(isSelected ? null : cat.key)}
                      whileHover={{ scale: 1.008 }}
                      whileTap={{ scale: 0.985 }}
                      animate={{
                        opacity: selectedCategory && !isSelected ? 0.2 : 1,
                        scale: selectedCategory && !isSelected ? 0.98 : 1,
                      }}
                      transition={{
                        layout: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
                        opacity: { duration: 0.35 },
                        scale: { duration: 0.35 },
                      }}
                      className={`relative flex flex-col justify-between p-6 xl:p-7 rounded-[28px] border text-left overflow-hidden cursor-pointer shadow-[0_4px_24px_rgba(0,0,0,0.15)] transition-shadow hover:shadow-[0_10px_35px_rgba(34,32,31,0.35)] ${cat.bgClass} ${cat.textClass} ${cat.borderClass} ${isSelected ? 'invisible pointer-events-none' : ''}`}
                    >
                      <Art isDesktop={true} />

                      {/* Top Numeral */}
                      <div className="z-10">
                        <span className={`font-['Barlow_Condensed'] text-2xl font-bold tracking-wider pb-0.5 ${cat.numberClass}`}>
                          {cat.number}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="font-['Barlow_Condensed'] text-7xl xl:text-8xl font-black uppercase tracking-tight leading-none z-10 my-auto text-[#FDF8F5]">
                        {cat.name}
                      </h2>

                      {/* Bottom Pill & Icon */}
                      <div className="z-10 flex items-center gap-3 mt-auto">
                        <div className={`rounded-full px-3.5 py-1.5 border font-['Geist_Mono'] text-[0.68rem] font-bold tracking-wider uppercase ${cat.pillBgClass} ${cat.pillTextClass}`}>
                          {count.toString().padStart(2, '0')} EVENTS
                        </div>
                        <Icon className="w-4 h-4 opacity-80 text-white" />
                      </div>
                    </motion.div>
                  );
                })()}
              </div>

              {/* ROW 3: LITERACY (05 - Full Width Muted Linen Parchment) */}
              {(() => {
                const cat = CATEGORIES[4];
                const count = events.filter(e => e.category.toLowerCase() === cat.key).length;
                const Icon = cat.iconComponent;
                const Art = cat.artComponent;
                const isSelected = selectedCategory === cat.key;
                return (
                  <motion.div
                    layoutId={`desktop-bento-tile-${cat.key}`}
                    key={cat.key}
                    id={`desktop-bento-tile-${cat.key}`}
                    onClick={() => setSelectedCategory(isSelected ? null : cat.key)}
                    whileHover={{ scale: 1.006 }}
                    whileTap={{ scale: 0.99 }}
                    animate={{
                      opacity: selectedCategory && !isSelected ? 0.2 : 1,
                      scale: selectedCategory && !isSelected ? 0.98 : 1,
                    }}
                    transition={{
                      layout: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.35 },
                      scale: { duration: 0.35 },
                    }}
                    className={`relative flex items-center justify-between p-6 xl:p-8 rounded-[28px] border text-left overflow-hidden cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.03)] min-h-[160px] xl:min-h-[180px] transition-shadow hover:shadow-[0_8px_30px_rgba(226,231,219,0.5)] ${cat.bgClass} ${cat.textClass} ${cat.borderClass} ${isSelected ? 'invisible pointer-events-none' : ''}`}
                  >
                    <Art isDesktop={true} />

                    <div className="z-10 flex flex-col justify-between h-full py-1">
                      {/* Top Numeral */}
                      <div>
                        <span className={`font-['Barlow_Condensed'] text-2xl font-bold tracking-wider pb-0.5 ${cat.numberClass}`}>
                          {cat.number}
                        </span>
                      </div>

                      {/* Main Title */}
                      <h2 className="font-['Barlow_Condensed'] text-6xl xl:text-7xl font-black uppercase tracking-tight leading-none my-2">
                        {cat.name}
                      </h2>

                      {/* Bottom Pill & Icon */}
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full px-3.5 py-1.5 border font-['Geist_Mono'] text-[0.68rem] font-bold tracking-wider uppercase ${cat.pillBgClass} ${cat.pillTextClass}`}>
                          {count.toString().padStart(2, '0')} EVENTS
                        </div>
                        <Icon className="w-4 h-4 opacity-75" />
                      </div>
                    </div>
                  </motion.div>
                );
              })()}
            </div>

            {/* DESKTOP EXPANDED CATEGORY PANEL WITH FLIP LAYOUT CONTINUITY */}
            <AnimatePresence>
              {selectedCategory && activeCategoryObj && (
                <div className="absolute inset-0 z-40 flex items-center justify-center p-2 xl:p-4">
                  <motion.div
                    layoutId={`desktop-bento-tile-${activeCategoryObj.key}`}
                    key={`desktop-expanded-${activeCategoryObj.key}`}
                    transition={{
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`relative w-full h-full rounded-[32px] border shadow-2xl overflow-hidden flex flex-col p-8 xl:p-10 ${activeCategoryObj.bgClass} ${activeCategoryObj.textClass} ${activeCategoryObj.borderClass}`}
                  >
                    {/* Background Botanical Illustration */}
                    <activeCategoryObj.artComponent expanded={true} isDesktop={true} />

                    {/* Top Control Bar */}
                    <div className="flex items-center justify-between z-20 mb-8 shrink-0">
                      <button
                        id="desktop-close-category-back-btn"
                        onClick={() => setSelectedCategory(null)}
                        className="inline-flex items-center gap-2 font-['Barlow_Condensed'] text-lg font-bold uppercase tracking-[0.2em] py-1 cursor-pointer active:translate-x-[-3px] transition-transform text-[#F87A71]"
                      >
                        <ArrowLeft size={18} strokeWidth={2.5} />
                        <span>CATEGORIES</span>
                      </button>

                      <button
                        id="desktop-close-category-icon-btn"
                        onClick={() => setSelectedCategory(null)}
                        className={`p-2 rounded-full border cursor-pointer active:scale-95 transition-transform ${
                          activeCategoryObj.key === 'art'
                            ? 'border-white/20 text-white bg-white/10 hover:bg-white/20'
                            : 'border-black/15 text-black bg-black/5 hover:bg-black/10'
                        }`}
                        aria-label="Close category panel"
                      >
                        <X size={18} strokeWidth={2.2} />
                      </button>
                    </div>

                    {/* Interactive Category Header */}
                    <div
                      onClick={() => setSelectedCategory(null)}
                      className="z-20 mb-8 cursor-pointer group shrink-0"
                      title="Click to collapse category back into bento grid"
                    >
                      <div className="flex items-baseline justify-between">
                        <h1 className="font-['Barlow_Condensed'] text-7xl xl:text-8xl font-black uppercase tracking-tight leading-[0.88] transition-transform group-hover:scale-[0.995]">
                          {activeCategoryObj.name}
                        </h1>
                        <span className={`font-['Barlow_Condensed'] text-4xl font-bold tracking-wider pb-1 ${activeCategoryObj.numberClass}`}>
                          {activeCategoryObj.number}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-3 font-['Geist_Mono'] text-xs font-semibold uppercase tracking-[0.26em] opacity-75">
                        <span>EVENTS</span>
                        <span>·</span>
                        <span>{filteredEvents.length.toString().padStart(2, '0')} LISTED</span>
                      </div>
                      <div className={`w-20 h-[3px] mt-4 ${activeCategoryObj.key === 'art' ? 'bg-[#F9A492]' : 'bg-[#EE7163]'}`}></div>
                    </div>

                    {/* Editorial Event Catalogue List */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ delay: 0.18, duration: 0.35 }}
                      className="z-20 flex-1 overflow-y-auto pr-2 space-y-3.5 hide-scrollbar"
                    >
                      {loading ? (
                        <div className="py-12 space-y-6">
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className="animate-pulse flex items-center gap-6 py-4 border-b border-black/10">
                              <div className="w-12 h-10 bg-black/10 rounded-lg"></div>
                              <div className="w-full h-10 bg-black/10 rounded-lg"></div>
                            </div>
                          ))}
                        </div>
                      ) : filteredEvents.length === 0 ? (
                        <div className="py-20 text-center">
                          <p className="font-['Geist'] text-base opacity-60">
                            No events currently scheduled under this category.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3.5">
                          {filteredEvents.map((event, index) => {
                            const num = (index + 1).toString().padStart(2, '0');
                            return (
                              <Link
                                key={event.id}
                                id={`desktop-expanded-event-link-${event.id}`}
                                to={`/events/${event.id}`}
                                className={`grid grid-cols-[50px_1fr_auto] items-center p-4 xl:p-5 rounded-2xl border transition-all duration-200 group cursor-pointer ${
                                  activeCategoryObj.key === 'art'
                                    ? 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 active:bg-white/15'
                                    : 'border-black/10 bg-black/5 hover:bg-black/10 hover:border-black/20 active:bg-black/15'
                                }`}
                              >
                                {/* Numeral */}
                                <span className="font-['Barlow_Condensed'] text-3xl xl:text-4xl font-black leading-none text-[#F87A71]">
                                  {num}
                                </span>

                                {/* Event Info */}
                                <div className="flex flex-col pr-3">
                                  <h3 className="font-['Barlow_Condensed'] text-2xl xl:text-[1.7rem] font-bold uppercase tracking-tight leading-tight group-hover:translate-x-1 transition-transform">
                                    {event.name}
                                  </h3>
                                  <div className="mt-1 flex flex-wrap items-center gap-2 font-['Geist_Mono'] text-[0.68rem] uppercase opacity-70">
                                    <span>{event.date && event.date !== 'TBA' && !isNaN(new Date(event.date).getTime()) ? new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBA'}</span>
                                    <span>•</span>
                                    <span>{event.venue_or_platform}</span>
                                    <span>•</span>
                                    <span>{event.type}</span>
                                  </div>
                                </div>

                                {/* Arrow Indicator */}
                                <span className="text-2xl font-light group-hover:translate-x-2 transition-transform ml-2 text-[#F87A71]">
                                  →
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </LayoutGroup>
        </main>
      </div>
    </div>
  );
}

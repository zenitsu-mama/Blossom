import React from 'react';

// Delicate peony line art for Music (Coral tile)
export function MusicBotanicalArt({ expanded = false, isDesktop = false, className }: { expanded?: boolean; isDesktop?: boolean; className?: string }) {
  return (
    <svg
      className={className || `absolute pointer-events-none text-[#1a1a1a] transition-all duration-500 ${
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
export function TheatreBotanicalArt({ expanded = false, isDesktop = false, className }: { expanded?: boolean; isDesktop?: boolean; className?: string }) {
  return (
    <svg
      className={className || `absolute pointer-events-none text-[#1a1a1a] transition-all duration-500 ${
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
export function DanceBotanicalArt({ expanded = false, isDesktop = false, className }: { expanded?: boolean; isDesktop?: boolean; className?: string }) {
  return (
    <svg
      className={className || `absolute pointer-events-none transition-all duration-500 ${
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
export function ArtBotanicalArt({ expanded = false, isDesktop = false, className }: { expanded?: boolean; isDesktop?: boolean; className?: string }) {
  return (
    <svg
      className={className || `absolute pointer-events-none transition-all duration-500 ${
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
        <circle cx="120" cy="45" r="1" />
      </g>

      {/* Large Lush Back Petals */}
      <path
        d="M90 120 C60 90 80 50 120 60 C150 70 170 110 150 145 C130 180 90 175 90 120 Z"
        fill="url(#artPetalGrad)"
        opacity="0.85"
      />
      <path
        d="M130 100 C160 80 190 115 175 155 C160 190 115 180 120 140 Z"
        fill="url(#artPetalGrad)"
        opacity="0.9"
      />
      <path
        d="M70 140 C50 110 80 80 110 100 C125 115 115 160 85 165 Z"
        fill="#F8DDD7"
        opacity="0.9"
      />

      {/* Foreground Petal Layer with fine linework */}
      <path
        d="M100 135 C90 110 120 95 135 115 C145 130 130 160 110 155 Z"
        fill="#FBD1B7"
        opacity="0.95"
      />
      <path
        d="M125 125 C145 110 160 130 150 150 C140 165 125 155 125 125 Z"
        fill="#F9A492"
        opacity="0.95"
      />

      {/* Intricate Botanical Linework overlay */}
      <path
        d="M95 130 C75 100 95 70 125 75 C145 80 160 110 145 140"
        stroke="#FFFFFF"
        strokeWidth="1"
        strokeLinecap="round"
        strokeOpacity="0.75"
      />
      <path
        d="M115 110 C130 95 150 110 142 135"
        stroke="#FFFFFF"
        strokeWidth="0.8"
        strokeOpacity="0.6"
      />
      <path
        d="M80 145 C65 125 90 100 110 115"
        stroke="#FFFFFF"
        strokeWidth="0.9"
        strokeOpacity="0.6"
      />
    </svg>
  );
}

// Pencil sketched botanical lotus/flower for Literacy (Parchment/Olive tile)
export function LiteracyBotanicalArt({ expanded = false, isDesktop = false, className }: { expanded?: boolean; isDesktop?: boolean; className?: string }) {
  return (
    <svg
      className={className || `absolute pointer-events-none text-[#1a1a1a] transition-all duration-500 ${
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
export function SidebarLotusArt() {
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

// Eight-petal botanical flower glyph for logo watermark
export function FlowerWatermarkIcon({ className = "w-4 h-4 text-[#F07A6E]" }: { className?: string }) {
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

// Stage curtains icon for Theatre
export function TheatreCurtainsIcon({ className = "w-4 h-4 text-current" }: { className?: string }) {
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
export function DanceShoesIcon({ className = "w-4 h-4 text-current" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3c-1.5 2-2 5-2 8 0 4 2 8 4 9 1 0 2-2 2-4 0-4-1-8-3-13z" />
      <path d="M16 3c-1.5 2-2 5-2 8 0 4 2 8 4 9 1 0 2-2 2-4 0-4-1-8-3-13z" />
      <path d="M6 11c1-1 3-1 4 0M14 11c1-1 3-1 4 0" />
    </svg>
  );
}

// Category visual helper mapping
export interface CategoryVisualMeta {
  key: string;
  name: string;
  number: string;
  accentColor: string;
  bgWash: string;
  textColor: string;
  borderColor: string;
  artComponent: React.ComponentType<{ className?: string }>;
}

export const CATEGORY_VISUALS: Record<string, CategoryVisualMeta> = {
  music: {
    key: 'music',
    name: 'MUSIC',
    number: '01',
    accentColor: '#F07A6E',
    bgWash: 'bg-[#F07A6E]/10',
    textColor: 'text-[#1C1917]',
    borderColor: 'border-[#F07A6E]',
    artComponent: ({ className }) => <MusicBotanicalArt className={className || "w-full h-full text-[#F07A6E]"} />,
  },
  theatre: {
    key: 'theatre',
    name: 'THEATRE',
    number: '02',
    accentColor: '#EE9689',
    bgWash: 'bg-[#F8DDD7]',
    textColor: 'text-[#1C1917]',
    borderColor: 'border-[#EE9689]',
    artComponent: ({ className }) => <TheatreBotanicalArt className={className || "w-full h-full text-[#EE9689]"} />,
  },
  dance: {
    key: 'dance',
    name: 'DANCE',
    number: '03',
    accentColor: '#EE8B7C',
    bgWash: 'bg-[#FBD1B7]',
    textColor: 'text-[#1C1917]',
    borderColor: 'border-[#EE8B7C]',
    artComponent: ({ className }) => <DanceBotanicalArt className={className || "w-full h-full"} />,
  },
  art: {
    key: 'art',
    name: 'ART',
    number: '04',
    accentColor: '#EE7767',
    bgWash: 'bg-[#22201F]',
    textColor: 'text-[#FFFFFF]',
    borderColor: 'border-[#EE7767]',
    artComponent: ({ className }) => <ArtBotanicalArt className={className || "w-full h-full"} />,
  },
  literary: {
    key: 'literary',
    name: 'LITERACY',
    number: '05',
    accentColor: '#5C7154',
    bgWash: 'bg-[#E2E7DB]',
    textColor: 'text-[#1C1917]',
    borderColor: 'border-[#5C7154]',
    artComponent: ({ className }) => <LiteracyBotanicalArt className={className || "w-full h-full text-[#5C7154]"} />,
  },
  stage: {
    key: 'stage',
    name: 'STAGE',
    number: '06',
    accentColor: '#F07A6E',
    bgWash: 'bg-[#FDF8F5]',
    textColor: 'text-[#1C1917]',
    borderColor: 'border-[#F07A6E]',
    artComponent: ({ className }) => <TheatreBotanicalArt className={className || "w-full h-full text-[#F07A6E]"} />,
  },
};

export function getCategoryVisual(catKey?: string): CategoryVisualMeta {
  if (!catKey) return CATEGORY_VISUALS['music'];
  const key = catKey.toLowerCase().trim();
  return CATEGORY_VISUALS[key] || CATEGORY_VISUALS['music'];
}

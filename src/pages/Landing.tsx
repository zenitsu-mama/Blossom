import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function FlowerBloomHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    // Phase 0 (0-1.8s): Video blooms from bud to open flower
    // Phase 1 (at 1.8s): "BLOSSOMS" text appears smoothly
    // Phase 2 (at 2.8s): "Login / Sign Up" button and supporting info appear
    const t1 = setTimeout(() => setAnimationPhase(1), 1800);
    const t2 = setTimeout(() => setAnimationPhase(2), 2800);
    
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = false;

    const startPlay = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay fallback: retry muted
          video.muted = true;
          video.play().catch(() => {});
        });
      }
    };

    startPlay();
  }, []);

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-between overflow-hidden bg-[#FDF8F5] text-[#000000]">
      {/* Background/Video Layer */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
        <video 
          ref={videoRef}
          src="/blossoms-bloom.mp4"
          autoPlay 
          muted 
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          style={{ transform: 'translateZ(0)' }}
        >
          <source src="/blossoms-bloom.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Top Editorial Header */}
      <div className={`relative w-full flex flex-col items-center text-center z-10 pt-12 px-6 transition-all duration-1000 ease-out ${animationPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <h2 className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-black mb-1 uppercase font-['Inter']">
          Christ University
        </h2>
        <h3 className="text-[9px] sm:text-[10px] font-medium tracking-[0.2em] text-gray-500 uppercase font-['Inter']">
          Student Welfare Office
        </h3>
      </div>

      {/* Bottom Title and CTA */}
      <div className="relative w-full flex flex-col items-center text-center z-10 pb-16 px-6">
        <div 
          className={`text-[10px] font-bold tracking-[0.3em] text-black/60 mb-2 transition-all duration-1000 ease-out ${animationPhase >= 2 ? 'opacity-100' : 'opacity-0'}`}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          2026
        </div>
        
        <h1 
          className={`text-[90px] font-normal text-[#242323] ml-0 mt-0 pt-0 mb-[19.5px] leading-none transition-all duration-1000 ease-out ${animationPhase >= 1 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}
          style={{ fontFamily: "'Barlow Condensed', sans-serif", transform: 'scaleY(1.1)' }}
        >
          BLOSSOMS
        </h1>
        
        <div className={`transition-all duration-1000 ease-out ${animationPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Link 
            to="/account" 
            className="inline-block bg-[#c33a3a] rounded-[33px] border-[2px] border-black text-white px-12 pb-4 pt-[17px] mt-[2px] mr-0 -mb-[20px] text-xs font-bold uppercase tracking-[0.2em] shadow-[4px_4px_0px_0px_rgba(17,17,17,1)] hover:bg-[#a82e2e] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-200"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Login / Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  return <FlowerBloomHero />;
}

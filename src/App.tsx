import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Landing from './pages/Landing';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Register from './pages/Register';
import Account from './pages/Account';
import Developer from './pages/Developer';

function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const isEvents = location.pathname.startsWith('/events');
  const isAccount = location.pathname.startsWith('/account');
  const isDeveloper = location.pathname.startsWith('/developer');

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  if (isLanding) {
    return <div className="bg-[#FDF8F5] min-h-screen text-[#242323] font-['Geist']">{children}</div>;
  }

  if (isDeveloper) {
    return <>{children}</>; // Developer page has its own layout
  }

  return (
    <div className="h-screen flex flex-col bg-[#FAF7F2] text-[#1a1a1a] font-['Geist'] antialiased selection:bg-[#c33a3a] selection:text-white overflow-hidden">
      {/* Global Header (Hidden on Desktop on /events because /events provides its own dedicated editorial sidebar) */}
      <header className={`shrink-0 h-[70px] md:h-[85px] flex items-center justify-between px-[4vw] border-b border-black/10 bg-[#FAF7F2] ${isEvents ? 'lg:hidden' : ''}`}>
        <Link to="/" className="font-['Cormorant_Garamond'] font-semibold italic text-3xl text-[#1a1a1a]">
          Blossoms.
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-12 items-center">
          <Link to="/" className="font-['Geist_Mono'] text-[0.7rem] tracking-[0.15em] uppercase text-[#1a1a1a] hover:text-[#c33a3a] transition-colors">Home</Link>
          <Link to="/events" className={`font-['Geist_Mono'] text-[0.7rem] tracking-[0.15em] uppercase transition-colors ${isEvents ? 'font-bold text-[#c33a3a]' : 'text-[#1a1a1a] hover:text-[#c33a3a]'}`}>Events</Link>
          <Link to="/account" className={`font-['Geist_Mono'] text-[0.7rem] tracking-[0.15em] uppercase transition-colors ${isAccount ? 'font-bold text-[#c33a3a]' : 'text-[#1a1a1a] hover:text-[#c33a3a]'}`}>Account</Link>
        </nav>

        {/* Mobile Nav Toggle */}
        <button 
          className="md:hidden flex items-center gap-2 text-[#1a1a1a] z-[60] cursor-pointer" 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className="font-['Geist_Mono'] text-[0.7rem] tracking-[0.15em] uppercase font-bold">
            {menuOpen ? 'Close' : 'Menu'}
          </span>
        </button>
      </header>

      {/* Full-screen Mobile Menu */}
      <div 
        className={`fixed inset-0 bg-[#FAF7F2] z-[55] flex flex-col items-center justify-center transition-all duration-500 ease-in-out md:hidden ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <nav className="flex flex-col items-center gap-10">
          <Link to="/" className="font-['Cormorant_Garamond'] text-5xl font-semibold italic text-[#1a1a1a]">Home</Link>
          <Link to="/events" className="font-['Cormorant_Garamond'] text-5xl font-semibold italic text-[#1a1a1a]">Events</Link>
          <Link to="/account" className="font-['Cormorant_Garamond'] text-5xl font-semibold italic text-[#1a1a1a]">Account</Link>
        </nav>
      </div>

      <main className="flex-1 overflow-y-auto flex flex-col relative">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/events/:id/register" element={<Register />} />
          <Route path="/account" element={<Account />} />
          <Route path="/developer" element={<Developer />} />
        </Routes>
      </Layout>
    </Router>
  );
}

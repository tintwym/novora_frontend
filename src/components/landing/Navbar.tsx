import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onOpenDemo: () => void;
  onOpenTrial: () => void;
}

export default function Navbar({ onOpenDemo, onOpenTrial }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Jump to document section with offset
  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="logoCyanTeal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00a7e1" />
                    <stop offset="60%" stopColor="#00b2a9" />
                    <stop offset="100%" stopColor="#7cb342" />
                  </linearGradient>
                  <linearGradient id="logoOrangeYellow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff9800" />
                    <stop offset="100%" stopColor="#f57c00" />
                  </linearGradient>
                  <linearGradient id="logoBlue" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0a58a4" />
                    <stop offset="100%" stopColor="#00a7e1" />
                  </linearGradient>
                </defs>
                
                {/* Gray back person */}
                <circle cx="42" cy="23" r="8" fill="#e2e8f0" />
                <path d="M 42 35 C 33 39, 36 50, 48 53 C 48 53, 49 43, 42 35 Z" fill="#cbd5e1" />

                {/* Left Cyan-Teal-Green Person */}
                <circle cx="24" cy="28" r="8" fill="#00a7e1" />
                <path d="M 12 70 C 14 55, 18 40, 28 38 C 38 36, 42 50, 48 58 C 55 67, 60 70, 68 62 C 60 74, 45 74, 38 66 C 30 57, 24 45, 18 56 C 14 62, 13 67, 12 70 Z" fill="url(#logoCyanTeal)" />

                {/* Right Orange Person looping down with blue */}
                <circle cx="68" cy="27" r="8" fill="url(#logoOrangeYellow)" />
                {/* Orange swoosh down */}
                <path d="M 68 35 C 58 45, 52 58, 52 68 C 52 75, 58 78, 64 70 C 70 60, 78 45, 88 25 C 80 23, 72 28, 68 35 Z" fill="url(#logoOrangeYellow)" />
                {/* Blue swoosh underneath */}
                <path d="M 52 68 C 52 75, 58 84, 68 84 C 78 84, 82 72, 88 50 C 85 64, 78 74, 68 74 C 62 74, 56 71, 52 68 Z" fill="url(#logoBlue)" />
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-base tracking-wider text-slate-900 block leading-none">NOVORA</span>
              <span className="text-[9px] font-bold text-[#0a58a4] tracking-widest block mt-0.5 uppercase leading-none">HRMS SOFTWARE</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <button type="button" onClick={() => handleScrollTo('features')} className="hover:text-slate-900 transition-colors cursor-pointer">Features</button>
            <button type="button" onClick={() => handleScrollTo('benefits')} className="hover:text-slate-900 transition-colors cursor-pointer">Benefits</button>
            <button type="button" onClick={() => handleScrollTo('how-it-works')} className="hover:text-slate-900 transition-colors cursor-pointer">How It Works</button>
            <button type="button" onClick={() => handleScrollTo('pricing')} className="hover:text-slate-900 transition-colors cursor-pointer">Pricing</button>
            <button type="button" onClick={() => handleScrollTo('testimonials')} className="hover:text-slate-900 transition-colors cursor-pointer">Reviews</button>
            <button type="button" onClick={() => handleScrollTo('faq')} className="hover:text-slate-900 transition-colors cursor-pointer">FAQ</button>
          </nav>

          {/* Call-to-Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <button 
              type="button"
              onClick={onOpenDemo}
              className="text-xs font-bold text-slate-700 hover:text-slate-900 px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Book a Demo
            </button>
            <button 
              type="button"
              onClick={onOpenTrial}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-4.5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer hover:shadow-blue-100"
            >
              Start Free Trial <ArrowUpRight className="w-3.5 h-3.5 text-blue-300" />
            </button>
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="md:hidden flex items-center">
            <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-600 hover:text-slate-950 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-6 space-y-3 shadow-lg flex flex-col text-sm font-semibold text-slate-600">
          <button type="button" onClick={() => handleScrollTo('features')} className="py-2 text-left hover:text-slate-950 border-b border-slate-50 cursor-pointer">Features</button>
          <button type="button" onClick={() => handleScrollTo('benefits')} className="py-2 text-left hover:text-slate-950 border-b border-slate-50 cursor-pointer">Benefits</button>
          <button type="button" onClick={() => handleScrollTo('how-it-works')} className="py-2 text-left hover:text-slate-950 border-b border-slate-50 cursor-pointer">How It Works</button>
          <button type="button" onClick={() => handleScrollTo('pricing')} className="py-2 text-left hover:text-slate-950 border-b border-slate-50 cursor-pointer">Pricing</button>
          <button type="button" onClick={() => handleScrollTo('testimonials')} className="py-2 text-left hover:text-slate-950 border-b border-slate-50 cursor-pointer">Reviews</button>
          <button type="button" onClick={() => handleScrollTo('faq')} className="py-2 text-left hover:text-slate-950 border-b border-slate-50 cursor-pointer">FAQ</button>
          
          <div className="pt-4 flex flex-col gap-2.5">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center text-slate-600 hover:text-slate-900 font-semibold py-2"
            >
              Sign In
            </Link>
            <button 
              type="button"
              onClick={() => { setMobileMenuOpen(false); onOpenDemo(); }}
              className="w-full text-center bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold py-2.5 rounded-xl cursor-pointer"
            >
              Book a Demo
            </button>
            <button 
              type="button"
              onClick={() => { setMobileMenuOpen(false); onOpenTrial(); }}
              className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-1 cursor-pointer"
            >
              Start Free Trial <ArrowUpRight className="w-3.5 h-3.5 text-blue-300" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

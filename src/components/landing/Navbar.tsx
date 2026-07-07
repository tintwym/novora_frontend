import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { NovoraBrand } from '../brand/NovoraLogo';

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
          
          <NovoraBrand
            size="md"
            className="cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />

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

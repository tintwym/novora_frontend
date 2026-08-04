import { useState } from 'react';
import { 
  ArrowUpRight, Sparkles, Fingerprint, Calendar, CreditCard, 
  Clock, ShieldCheck, Heart, LayoutDashboard, Globe, Shield, 
  ArrowRight, Users, CheckCircle2, ChevronRight, HelpCircle
} from 'lucide-react';

import Navbar from './components/Navbar';
import InteractiveDashboard from './components/InteractiveDashboard';
import ROICalculator from './components/ROICalculator';
import FeatureGrid from './components/FeatureGrid';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Testimonials from './components/Testimonials';
import BookingModal from './components/BookingModal';

interface LandingPageProps {
  onSignIn: () => void;
  onStartTrial: () => void;
}

export default function LandingPage({ onSignIn, onStartTrial }: LandingPageProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased overflow-x-clip selection:bg-blue-600 selection:text-white">
      
      <Navbar 
        onOpenDemo={() => setIsBookingOpen(true)} 
        onOpenTrial={onStartTrial}
        onSignIn={onSignIn}
      />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-24 overflow-hidden bg-white">
        
        {/* Subtle decorative background circles representing Novora brand palette */}
        <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-lime-500/5 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-[450px] h-[450px] bg-[#0a58a4]/5 rounded-full blur-[110px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Copy & CTAs */}
            <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
              
              {/* Micro badge indicator - styled with Novora multi-color brand gradient */}
              <div className="inline-flex items-center gap-2 bg-slate-50 text-slate-800 text-xs font-bold px-3.5 py-1.5 rounded-full border border-slate-100 uppercase tracking-wider mx-auto lg:mx-0 shadow-sm">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="bg-gradient-to-r from-cyan-500 via-lime-600 to-orange-500 bg-clip-text text-transparent font-extrabold">All-in-One HR Operating System</span>
              </div>

              {/* Majestic Headline */}
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-5xl text-slate-900 leading-tight tracking-tight">
                The Workforce OS for Forward-Thinking Teams.
              </h1>

              {/* Short Description */}
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                Sync hardware biometric readers directly to automated payroll logs, leave management pools, and custom performance reviews. Created for businesses of all sizes looking to unlock administrative speed.
              </p>


            </div>

            {/* Right Column: Live Interactive Dashboard Sandbox Mockup */}
            <div className="lg:col-span-7 w-full">
              <InteractiveDashboard />
            </div>

          </div>
        </div>
      </section>

      {/* BENEFITS SECTION & ROI CALCULATOR */}
      <section id="benefits" className="py-20 bg-white font-sans border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100 uppercase tracking-wider">
              Tangible Impact
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight font-sans">
              Drive accuracy and reclaim manual hours spent on operations.
            </h2>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">
              Novora replaces disparate silos. By creating a direct, continuous sync from physical hardware check-ins to automated wage calculations, we optimize core key operational indices.
            </p>
          </div>

          {/* Benefits Grid list */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            
            {/* Benefit 1: Save HR time */}
            <div className="bg-slate-50 border border-slate-100/80 rounded-2xl p-5 space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-700 border border-blue-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase text-slate-900 tracking-wider">Save HR Admin Time</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Automate leave requests, document updates, and timesheet approvals. Saves managers an average of 45 hours every month.</p>
              </div>
            </div>

            {/* Benefit 2: Reduce payroll errors */}
            <div className="bg-slate-50 border border-slate-100/80 rounded-2xl p-5 space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-700 border border-blue-500/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase text-slate-900 tracking-wider">Reduce Payroll Errors</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Tying biometric terminal check-ins directly to automated tax & deductions calculators ensures error-free disbursements every cycle.</p>
              </div>
            </div>

            {/* Benefit 3: Improve employee experience */}
            <div className="bg-slate-50 border border-slate-100/80 rounded-2xl p-5 space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-700 border border-blue-500/20 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase text-slate-900 tracking-wider">Elevate Staff Experience</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Empower employees with high-security iOS & Android portals. Request leaves, clock-in, and check compensation in seconds.</p>
              </div>
            </div>

            {/* Benefit 4: Real-time reporting */}
            <div className="bg-slate-50 border border-slate-100/80 rounded-2xl p-5 space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-700 border border-blue-500/20 flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase text-slate-900 tracking-wider">Real-Time Auditing</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Continuous visibility of active leave logs, headcount overhead indicators, tax ledgers, and department attendance averages.</p>
              </div>
            </div>

          </div>

          {/* Interactive ROI Widget Slider */}
          <ROICalculator />

        </div>
      </section>

      {/* FEATURES SECTION (Bento grid) */}
      <FeatureGrid />

      {/* HOW IT WORKS SECTION (Interactive Timeline Sandbox) */}
      <HowItWorks />

      {/* PRICING SECTION */}
      <Pricing 
        onOpenTrial={() => onStartTrial()} 
        onOpenDemo={() => setIsBookingOpen(true)} 
      />

      {/* TESTIMONIALS SECTION */}
      <Testimonials />

      {/* FAQ SECTION */}
      <FAQ />

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 bg-slate-950 text-slate-100 relative overflow-hidden font-sans border-t border-slate-900">
        <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 relative">
          <span className="bg-blue-500/10 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/20 uppercase tracking-wider">
            Upgrade Your Internal Operations
          </span>
          
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight max-w-2xl mx-auto">
            Ready to streamline employee, payroll, & biometric attendance?
          </h2>
          
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Join thousands of compliant operational teams running secure, automated workforce operations. Setup your workspace in under ten minutes.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-3.5 justify-center max-w-md mx-auto">
            <button
              onClick={() => onStartTrial()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="bg-slate-900 hover:bg-slate-850 text-slate-100 border border-slate-800 hover:border-slate-700 font-bold text-xs px-6 py-3.5 rounded-xl transition-colors cursor-pointer"
            >
              Book a Live Demo
            </button>
          </div>

          <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider pt-2">
            Fully Compliant • No Credit Card Setup • 14-Day Free License
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-100 py-12 text-slate-500 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Brand Logo info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                  <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="footerLogoCyanTeal" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00a7e1" />
                        <stop offset="60%" stopColor="#00b2a9" />
                        <stop offset="100%" stopColor="#7cb342" />
                      </linearGradient>
                      <linearGradient id="footerLogoOrangeYellow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ff9800" />
                        <stop offset="100%" stopColor="#f57c00" />
                      </linearGradient>
                      <linearGradient id="footerLogoBlue" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0a58a4" />
                        <stop offset="100%" stopColor="#00a7e1" />
                      </linearGradient>
                    </defs>
                    
                    <circle cx="42" cy="23" r="8" fill="#e2e8f0" />
                    <path d="M 42 35 C 33 39, 36 50, 48 53 C 48 53, 49 43, 42 35 Z" fill="#cbd5e1" />

                    <circle cx="24" cy="28" r="8" fill="#00a7e1" />
                    <path d="M 12 70 C 14 55, 18 40, 28 38 C 38 36, 42 50, 48 58 C 55 67, 60 70, 68 62 C 60 74, 45 74, 38 66 C 30 57, 24 45, 18 56 C 14 62, 13 67, 12 70 Z" fill="url(#footerLogoCyanTeal)" />

                    <circle cx="68" cy="27" r="8" fill="url(#footerLogoOrangeYellow)" />
                    <path d="M 68 35 C 58 45, 52 58, 52 68 C 52 75, 58 78, 64 70 C 70 60, 78 45, 88 25 C 80 23, 72 28, 68 35 Z" fill="url(#footerLogoOrangeYellow)" />
                    <path d="M 52 68 C 52 75, 58 84, 68 84 C 78 84, 82 72, 88 50 C 85 64, 78 74, 68 74 C 62 74, 56 71, 52 68 Z" fill="url(#footerLogoBlue)" />
                  </svg>
                </div>
                <div>
                  <span className="font-extrabold text-sm tracking-wider text-slate-900 block leading-none">NOVORA</span>
                  <span className="text-[8px] font-bold text-[#0a58a4] tracking-widest block mt-0.5 uppercase leading-none">HRMS SOFTWARE</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                The modern, unified human resources operating system. Bridging physical biometric hardware terminals with secure, automated cloud payroll algorithms.
              </p>
            </div>

            {/* Link group 1 */}
            <div className="space-y-3.5">
              <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-800">HR Product Modules</h5>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => { const el = document.getElementById('features'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-slate-900 transition-colors cursor-pointer">Biometric Hardware Sync</button></li>
                <li><button onClick={() => { const el = document.getElementById('features'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-slate-900 transition-colors cursor-pointer">Compliance Payroll runs</button></li>
                <li><button onClick={() => { const el = document.getElementById('features'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-slate-900 transition-colors cursor-pointer">Absence & Leave Manager</button></li>
                <li><button onClick={() => { const el = document.getElementById('features'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-slate-900 transition-colors cursor-pointer">Performance Evaluator</button></li>
              </ul>
            </div>

            {/* Link group 2 */}
            <div className="space-y-3.5">
              <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-800">Business Benefits</h5>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => { const el = document.getElementById('roi-calculator'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-slate-900 transition-colors cursor-pointer">Administrative ROI Estimator</button></li>
                <li><button onClick={() => { const el = document.getElementById('benefits'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-slate-900 transition-colors cursor-pointer">Save HR Admin Hours</button></li>
                <li><button onClick={() => { const el = document.getElementById('benefits'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-slate-900 transition-colors cursor-pointer">Eliminate payroll calculations mistakes</button></li>
                <li><button onClick={() => { const el = document.getElementById('benefits'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-slate-900 transition-colors cursor-pointer">Secure corporate data encryption</button></li>
              </ul>
            </div>

            {/* Link group 3 */}
            <div className="space-y-3.5">
              <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-800">Company Operations</h5>
              <ul className="space-y-2 text-xs font-semibold text-slate-700">
                <li><button onClick={() => setIsBookingOpen(true)} className="hover:text-slate-950 transition-colors cursor-pointer flex items-center gap-1">Request Operational Check <ChevronRight className="w-3.5 h-3.5 text-blue-600" /></button></li>
                <li><button onClick={() => onStartTrial()} className="hover:text-slate-950 transition-colors cursor-pointer flex items-center gap-1">Initialize free sandbox <ChevronRight className="w-3.5 h-3.5 text-blue-600" /></button></li>
                <li><span className="text-slate-400 font-normal">Contact support: support@novora.app</span></li>
              </ul>
            </div>

          </div>

          {/* Sub footer */}
          <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-400">
            <p>© 2026 Novora Technologies Inc. All rights reserved. Built for scaling operational teams globally.</p>
            <div className="flex gap-4 mt-3 sm:mt-0 font-medium">
              <span className="hover:text-slate-700 cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-slate-700 cursor-pointer">Terms of Service</span>
              <span>•</span>
              <span className="hover:text-slate-700 cursor-pointer">System Status</span>
            </div>
          </div>
        </div>
      </footer>

      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </div>
  );
}

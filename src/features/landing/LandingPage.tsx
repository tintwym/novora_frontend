'use client'

import { useState } from 'react';
import { 
  ArrowUpRight, Sparkles, Fingerprint, Calendar, CreditCard, 
  Clock, ShieldCheck, Heart, LayoutDashboard, Globe, Shield, 
  ArrowRight, Users, CheckCircle2, ChevronRight, HelpCircle
} from 'lucide-react';

import BrandLockup from '@/components/brand/BrandLockup';
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
    <div className="min-h-screen bg-[var(--color-novora-surface)] text-slate-900 font-sans antialiased overflow-x-clip">
      
      <Navbar 
        onOpenDemo={() => setIsBookingOpen(true)} 
        onOpenTrial={onStartTrial}
        onSignIn={onSignIn}
      />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-200/70">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(37,99,235,0.12),transparent)]" />
        <div className="absolute top-20 -left-24 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl animate-mesh-drift" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl animate-mesh-drift" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-20 md:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
            <div className="lg:col-span-5 space-y-7 text-center lg:text-left animate-soft-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500" />
                </span>
                Workforce OS for modern teams
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-[1.08] tracking-tight text-slate-950">
                Run HR, payroll, and people ops from one calm workspace.
              </h1>

              <p className="max-w-xl mx-auto lg:mx-0 text-base text-slate-600 leading-relaxed">
                Novora connects attendance, leave, payroll, recruitment, and employee self-service —
                with role-based portals for admins, HR, and staff.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-1">
                <button onClick={onStartTrial} className="nv-btn-primary px-6 py-3.5">
                  Start free trial <ArrowRight className="h-4 w-4" />
                </button>
                <button onClick={() => setIsBookingOpen(true)} className="nv-btn-secondary px-6 py-3.5">
                  Book a demo
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs font-semibold text-slate-500">
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> 14-day trial</span>
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> No credit card</span>
                <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Setup in minutes</span>
              </div>
            </div>

            <div className="lg:col-span-7 w-full animate-soft-fade-up">
              <div className="relative rounded-[1.75rem] border border-slate-200/80 bg-white p-2 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.25)]">
                <div className="rounded-[1.35rem] overflow-hidden border border-slate-100 bg-slate-50">
                  <InteractiveDashboard />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION & ROI CALCULATOR */}
      <section id="benefits" className="py-20 bg-white border-t border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="nv-section-label">Tangible impact</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-950 mt-4 tracking-tight">
              Reclaim hours and reduce payroll mistakes.
            </h2>
            <p className="text-slate-600 text-base mt-3 leading-relaxed">
              Novora replaces disconnected HR silos with one continuous workflow from attendance to payroll.
            </p>
          </div>

          {/* Benefits Grid list */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            
            {/* Benefit 1: Save HR time */}
            <div className="nv-card p-5 space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-700 border border-blue-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase text-slate-900 tracking-wider">Save HR Admin Time</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Automate leave requests, document updates, and timesheet approvals. Saves managers an average of 45 hours every month.</p>
              </div>
            </div>

            {/* Benefit 2: Reduce payroll errors */}
            <div className="nv-card p-5 space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-700 border border-blue-500/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase text-slate-900 tracking-wider">Reduce Payroll Errors</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Tying biometric terminal check-ins directly to automated tax & deductions calculators ensures error-free disbursements every cycle.</p>
              </div>
            </div>

            {/* Benefit 3: Improve employee experience */}
            <div className="nv-card p-5 space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-700 border border-blue-500/20 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase text-slate-900 tracking-wider">Elevate Staff Experience</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Empower employees with high-security iOS & Android portals. Request leaves, clock-in, and check compensation in seconds.</p>
              </div>
            </div>

            {/* Benefit 4: Real-time reporting */}
            <div className="nv-card p-5 space-y-3.5">
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
      <section className="py-20 bg-slate-950 text-slate-100 relative overflow-hidden border-t border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(37,99,235,0.18),transparent)]" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 relative">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-200">
            Upgrade your operations
          </span>

          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight max-w-2xl mx-auto">
            Ready to streamline HR, payroll, and attendance?
          </h2>

          <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            Join teams running secure, automated workforce operations. Set up your workspace in under ten minutes.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <button onClick={() => onStartTrial()} className="nv-btn-primary px-6 py-3.5">
              Start free trial <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-6 py-3.5 text-sm font-semibold text-slate-100 hover:border-slate-600 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Book a live demo
            </button>
          </div>

          <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider pt-2">
            Fully compliant · No credit card · 14-day free license
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200/70 py-12 text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <BrandLockup size="sm" />
              <p className="text-sm text-slate-500 leading-relaxed">
                The modern HR operating system for attendance, leave, payroll, and people operations.
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

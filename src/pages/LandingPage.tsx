import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import {
  ArrowRight,
  Clock,
  ShieldCheck,
  Heart,
  LayoutDashboard,
  ChevronRight,
} from 'lucide-react'
import Navbar from '../components/landing/Navbar'
import InteractiveDashboard from '../components/landing/InteractiveDashboard'
import ROICalculator from '../components/landing/ROICalculator'
import FeatureGrid from '../components/landing/FeatureGrid'
import HowItWorks from '../components/landing/HowItWorks'
import Pricing from '../components/landing/Pricing'
import FAQ from '../components/landing/FAQ'
import Testimonials from '../components/landing/Testimonials'
import BookingModal from '../components/landing/BookingModal'
import TrialModal from '../components/landing/TrialModal'
import { NovoraBrand } from '../components/brand/NovoraLogo'
import { Reveal, Stagger, StaggerItem } from '../components/motion/Reveal'
import '../styles/landing.css'

export function LandingPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isTrialOpen, setIsTrialOpen] = useState(false)
  const reduceMotion = useReducedMotion()

  const heroEase = [0.22, 1, 0.36, 1] as const
  const hero = (delay: number) =>
    reduceMotion
      ? undefined
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, ease: heroEase, delay },
        }

  return (
    <div className="landing-page min-h-screen bg-slate-50 text-slate-900 font-sans antialiased overflow-x-hidden selection:bg-blue-600 selection:text-white">
      <Navbar onOpenDemo={() => setIsBookingOpen(true)} onOpenTrial={() => setIsTrialOpen(true)} />

      <section className="relative pt-12 pb-20 md:pt-16 md:pb-24 overflow-hidden bg-white">
        <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-lime-500/5 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-[450px] h-[450px] bg-[#0a58a4]/5 rounded-full blur-[110px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
              <motion.div
                className="inline-flex items-center gap-2 bg-slate-50 text-slate-800 text-xs font-bold px-3.5 py-1.5 rounded-full border border-slate-100 uppercase tracking-wider mx-auto lg:mx-0 shadow-sm"
                {...hero(0)}
              >
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                </span>
                <span className="bg-linear-to-r from-cyan-500 via-lime-600 to-orange-500 bg-clip-text text-transparent font-extrabold">
                  All-in-One HR Operating System
                </span>
              </motion.div>

              <motion.h1
                className="font-display font-extrabold text-4xl sm:text-5xl lg:text-5xl text-slate-900 leading-tight tracking-tight"
                {...hero(0.08)}
              >
                The Workforce OS for Forward-Thinking Teams.
              </motion.h1>

              <motion.p
                className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium"
                {...hero(0.16)}
              >
                Sync hardware biometric readers directly to automated payroll logs, leave management pools, and custom performance reviews. Created for businesses of all sizes looking to unlock administrative speed.
              </motion.p>
            </div>

            <motion.div className="lg:col-span-7 w-full" {...hero(0.2)}>
              <InteractiveDashboard />
            </motion.div>
          </div>
        </div>
      </section>

      <section id="benefits" className="py-20 bg-white font-sans border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-3xl mx-auto mb-16">
            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100 uppercase tracking-wider">
              Tangible Impact
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight font-sans">
              Drive accuracy and reclaim manual hours spent on operations.
            </h2>
            <p className="text-slate-500 text-sm mt-3 leading-relaxed">
              Novora replaces disparate silos. By creating a direct, continuous sync from physical hardware check-ins to automated wage calculations, we optimize core key operational indices.
            </p>
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <StaggerItem className="bg-slate-50 border border-slate-100/80 rounded-2xl p-5 space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-700 border border-blue-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase text-slate-900 tracking-wider">Save HR Admin Time</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Automate leave requests, document updates, and timesheet approvals. Saves managers an average of 45 hours every month.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem className="bg-slate-50 border border-slate-100/80 rounded-2xl p-5 space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-700 border border-blue-500/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase text-slate-900 tracking-wider">Reduce Payroll Errors</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Tying biometric terminal check-ins directly to automated tax & deductions calculators ensures error-free disbursements every cycle.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem className="bg-slate-50 border border-slate-100/80 rounded-2xl p-5 space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-700 border border-blue-500/20 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase text-slate-900 tracking-wider">Elevate Staff Experience</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Empower employees with high-security iOS & Android portals. Request leaves, clock-in, and check compensation in seconds.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem className="bg-slate-50 border border-slate-100/80 rounded-2xl p-5 space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-700 border border-blue-500/20 flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase text-slate-900 tracking-wider">Real-Time Auditing</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Continuous visibility of active leave logs, headcount overhead indicators, tax ledgers, and department attendance averages.
                </p>
              </div>
            </StaggerItem>
          </Stagger>

          <Reveal>
            <ROICalculator />
          </Reveal>
        </div>
      </section>

      <Reveal>
        <FeatureGrid />
      </Reveal>
      <Reveal>
        <HowItWorks />
      </Reveal>
      <Reveal>
        <Pricing onOpenTrial={() => setIsTrialOpen(true)} onOpenDemo={() => setIsBookingOpen(true)} />
      </Reveal>
      <Reveal>
        <Testimonials />
      </Reveal>
      <Reveal>
        <FAQ />
      </Reveal>

      <section className="py-20 bg-slate-950 text-slate-100 relative overflow-hidden font-sans border-t border-slate-900">
        <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />

        <Reveal className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 relative">
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
              type="button"
              onClick={() => setIsTrialOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 hover:-translate-y-0.5"
            >
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsBookingOpen(true)}
              className="bg-slate-900 hover:bg-slate-850 text-slate-100 border border-slate-800 hover:border-slate-700 font-bold text-xs px-6 py-3.5 rounded-xl transition-colors cursor-pointer"
            >
              Book a Live Demo
            </button>
          </div>

          <p className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider pt-2">
            Fully Compliant • No Credit Card Setup • 14-Day Free License
          </p>
        </Reveal>
      </section>

      <footer className="bg-white border-t border-slate-100 py-12 text-slate-500 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <NovoraBrand size="sm" />
              <p className="text-xs text-slate-400 leading-relaxed">
                The modern, unified human resources operating system. Bridging physical biometric hardware terminals with secure, automated cloud payroll algorithms.
              </p>
            </div>

            <div className="space-y-3.5">
              <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-800">HR Product Modules</h5>
              <ul className="space-y-2 text-xs">
                <li>
                  <button type="button" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-slate-900 transition-colors cursor-pointer">
                    Biometric Hardware Sync
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-slate-900 transition-colors cursor-pointer">
                    Compliance Payroll runs
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-slate-900 transition-colors cursor-pointer">
                    Absence & Leave Manager
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-slate-900 transition-colors cursor-pointer">
                    Performance Evaluator
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-3.5">
              <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-800">Business Benefits</h5>
              <ul className="space-y-2 text-xs">
                <li>
                  <button type="button" onClick={() => document.getElementById('roi-calculator')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-slate-900 transition-colors cursor-pointer">
                    Administrative ROI Estimator
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-slate-900 transition-colors cursor-pointer">
                    Save HR Admin Hours
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-slate-900 transition-colors cursor-pointer">
                    Eliminate payroll calculations mistakes
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-slate-900 transition-colors cursor-pointer">
                    Secure corporate data encryption
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-3.5">
              <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-800">Company Operations</h5>
              <ul className="space-y-2 text-xs font-semibold text-slate-700">
                <li>
                  <button type="button" onClick={() => setIsBookingOpen(true)} className="hover:text-slate-950 transition-colors cursor-pointer flex items-center gap-1">
                    Request Operational Check <ChevronRight className="w-3.5 h-3.5 text-blue-600" />
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setIsTrialOpen(true)} className="hover:text-slate-950 transition-colors cursor-pointer flex items-center gap-1">
                    Initialize free sandbox <ChevronRight className="w-3.5 h-3.5 text-blue-600" />
                  </button>
                </li>
                <li>
                  <span className="text-slate-400 font-normal">Contact support: support@novora.app</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-400">
            <p>© 2026 Novora Technologies Inc. All rights reserved. Built for scaling operational teams globally.</p>
            <div className="flex gap-4 mt-3 sm:mt-0 font-medium">
              <a href="mailto:support@novora.app" className="hover:text-slate-700">Privacy &amp; Support</a>
              <span>•</span>
              <Link to="/register" className="hover:text-slate-700">Create Account</Link>
              <span>•</span>
              <Link to="/login" className="hover:text-slate-700">Sign In</Link>
            </div>
          </div>
        </div>
      </footer>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <TrialModal isOpen={isTrialOpen} onClose={() => setIsTrialOpen(false)} />
    </div>
  )
}

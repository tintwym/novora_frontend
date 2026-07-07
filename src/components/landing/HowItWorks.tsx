import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, UserPlus, Zap, ArrowRight, ShieldCheck, CheckCircle2, CloudLightning } from 'lucide-react';

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: 'Initialize Workspace & Policies',
      subtitle: 'Setup',
      description: 'Define your organizational structure, input custom leave policy rules, establish biometric terminal networks, and configure shift parameters in our onboarding wizard.',
      icon: Settings,
      checklist: [
        'Define departments, supervisors, & operational units',
        'Configure custom sick, annual, and bereavement leave pools',
        'Register secure hardware biometric terminal nodes',
        'Draft custom shift timelines & overtime parameters'
      ],
      visualMock: (
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 font-mono text-[10px] text-slate-400 space-y-2.5">
          <div className="flex justify-between border-b border-slate-800 pb-1.5">
            <span className="text-slate-200 font-bold">Policy Onboarding Wizard</span>
            <span className="text-cyan-400">Step 1 of 3</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-slate-300">Set Sick Leave Cap</span>
              <span className="text-cyan-400 font-bold">14 Days / Year</span>
            </div>
            <div className="flex items-center justify-between bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-slate-300">Sync Biometrics Node</span>
              <span className="text-cyan-400 font-bold">Active (1 Terminal Connected)</span>
            </div>
            <div className="flex items-center justify-between bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-slate-300">Set Overtime Multiplier</span>
              <span className="text-cyan-400 font-bold">1.5x Hourly Wage</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Import Employees with 1-Click',
      subtitle: 'Import employees',
      description: 'Easily upload your entire workforce. Drop any CSV, excel ledger, or automatically sync directory databases from Google Workspace, Slack, or Microsoft Azure Active Directory.',
      icon: UserPlus,
      checklist: [
        'Secure 1-click drag-and-drop CSV parser',
        'Slack & Google Workspace directories native sync integrations',
        'Automatic email welcome sequence and profile setups',
        'Auto-allocation of initial leave balances based on tenure'
      ],
      visualMock: (
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 font-mono text-[10px] text-slate-400 space-y-2.5">
          <div className="flex justify-between border-b border-slate-800 pb-1.5">
            <span className="text-slate-200 font-bold">CSV Import Parser</span>
            <span className="text-lime-400">Ready</span>
          </div>
          <div className="border border-dashed border-slate-700 rounded-lg p-3 text-center text-slate-500 bg-slate-950 flex flex-col items-center justify-center">
            <CloudLightning className="w-5 h-5 text-lime-400 animate-bounce mb-1" />
            <span className="text-[10px] text-slate-300">Drag & Drop employee list (.csv, .xlsx)</span>
            <span className="text-[9px] text-slate-500 mt-1">Processed: Sarah_Jenkins_ID.csv (142 employees matched)</span>
          </div>
        </div>
      )
    },
    {
      title: 'Automate HR & Run Payroll',
      subtitle: 'Automate HR processes',
      description: 'With all policies configured and employees mapped, Novora automates attendance logs, leave balances, performance scores, and initiates direct-bank payroll runs in seconds.',
      icon: Zap,
      checklist: [
        'Direct biometric terminal payload logs matching',
        'Calculates real-time attendance deductions & taxes',
        'Auto-disburses digital payslips via mobile companion app',
        'Real-time automated payroll reporting and general ledgers'
      ],
      visualMock: (
        <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 font-mono text-[10px] text-slate-400 space-y-2.5">
          <div className="flex justify-between border-b border-slate-800 pb-1.5">
            <span className="text-slate-200 font-bold">Automated payroll engine</span>
            <span className="text-orange-400">100% Verified</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2 bg-orange-950/20 border border-orange-500/20 p-2 rounded">
              <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
              <span className="text-orange-400">Payroll compiled for 142 employees</span>
            </div>
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>Taxes calculated</span>
              <span>-$3,150.22</span>
            </div>
            <div className="flex items-center justify-between text-slate-200 text-xs font-bold pt-1 border-t border-slate-850">
              <span>Disbursed via API</span>
              <span className="text-orange-400">$45,089.78</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  const getStepColors = (index: number, isActive: boolean) => {
    switch (index) {
      case 0:
        return {
          text: isActive ? 'text-cyan-400' : 'text-cyan-600',
          bg: isActive ? 'bg-cyan-500/10' : 'bg-cyan-50',
          border: isActive ? 'border-cyan-500/20' : 'border-cyan-100',
          raw: 'cyan',
        };
      case 1:
        return {
          text: isActive ? 'text-lime-400' : 'text-lime-600',
          bg: isActive ? 'bg-lime-500/10' : 'bg-lime-50',
          border: isActive ? 'border-lime-500/20' : 'border-lime-100',
          raw: 'lime',
        };
      case 2:
      default:
        return {
          text: isActive ? 'text-orange-400' : 'text-orange-600',
          bg: isActive ? 'bg-orange-500/10' : 'bg-orange-50',
          border: isActive ? 'border-orange-500/20' : 'border-orange-100',
          raw: 'orange',
        };
    }
  };

  return (
    <div id="how-it-works" className="py-20 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1 rounded-full border border-slate-200 uppercase tracking-wider">
            Operational Blueprint
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Transition to modern automated HR in 3 simple phases.
          </h2>
          <p className="text-slate-500 text-sm mt-3 leading-relaxed">
            Our specialized onboarding architecture is built to migrate businesses of all sizes from scattered spreadsheets or physical logbooks to digital automation with zero team downtime.
          </p>
        </div>

        {/* Phase Navigator */}
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          
          {/* Left Column: Interactive Switcher Accordion */}
          <div className="flex-1 space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === activeStep;
              const colors = getStepColors(index, isActive);
              return (
                <div
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`p-5 rounded-xl border text-left cursor-pointer transition-all ${
                    isActive 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                      : 'bg-slate-50 hover:bg-slate-100/75 border-slate-200/60 text-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-lg border shrink-0 ${
                      isActive ? `bg-slate-800 border-slate-700 ${colors.text}` : 'bg-white border-slate-200 text-slate-600'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? colors.text : 'text-slate-500'}`}>
                        Phase 0{index + 1} • {step.subtitle}
                      </span>
                      <h4 className="text-base font-bold tracking-tight mt-0.5">{step.title}</h4>
                      
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3 text-xs space-y-3 border-t border-slate-800 pt-3"
                        >
                          <p className="text-slate-400 leading-relaxed">{step.description}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                            {step.checklist.map((item, i) => (
                              <div key={i} className="flex items-center gap-1.5 text-[11px]">
                                <ShieldCheck className={`w-3.5 h-3.5 ${colors.text} shrink-0`} />
                                <span className="truncate">{item}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: High Fidelity Graphic Sandbox */}
          <div className="lg:w-[420px] w-full bg-slate-950 rounded-2xl border border-slate-800 p-6 text-slate-100 space-y-6 shadow-xl shrink-0 flex flex-col justify-between self-stretch">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${getStepColors(activeStep, true).text} bg-current`} />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live System Sandbox</span>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">Sync Configured</span>
              </div>

              <div>
                <span className={`text-[10px] font-bold uppercase font-mono tracking-wide ${getStepColors(activeStep, true).text}`}>Onboarding Flow v1.2</span>
                <h5 className="font-extrabold text-sm text-slate-100 mt-1">
                  {steps[activeStep].title}
                </h5>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  See how Novora simplifies human resource operations with pristine automated flows.
                </p>
              </div>

              {/* Dynamic visual box */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4"
                >
                  {steps[activeStep].visualMock}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Quick toggle controls */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
              <button
                disabled={activeStep === 0}
                onClick={() => setActiveStep(prev => prev - 1)}
                className="text-slate-400 hover:text-slate-200 disabled:text-slate-700 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Previous
              </button>
              
              <div className="flex gap-1.5">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStep(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${i === activeStep ? `w-4 ${getStepColors(i, true).text} bg-current` : 'bg-slate-800'}`}
                  />
                ))}
              </div>

              {activeStep < steps.length - 1 ? (
                <button
                  onClick={() => setActiveStep(prev => prev + 1)}
                  className={`${getStepColors(activeStep, true).text} hover:opacity-80 font-bold transition-all cursor-pointer flex items-center gap-0.5`}
                >
                  Next Phase <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => setActiveStep(0)}
                  className="text-slate-400 hover:text-slate-200 font-bold transition-colors cursor-pointer"
                >
                  Restart Tour
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

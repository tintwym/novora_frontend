import { useState, useEffect, useRef, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Server, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { useModalA11y } from './useModalA11y';

interface TrialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TrialModal({ isOpen, onClose }: TrialModalProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  
  // Custom Modules config
  const [modules, setModules] = useState({
    biometrics: true,
    payroll: true,
    leaves: true,
    performance: false
  });

  const [loadingStep, setLoadingStep] = useState(0);
  const [isDeploying, setIsDeploying] = useState(false);
  const deployTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  useModalA11y(isOpen, onClose, panelRef);

  const clearDeployTimers = () => {
    deployTimersRef.current.forEach(clearTimeout);
    deployTimersRef.current = [];
  };

  const resetModal = () => {
    setStep(1);
    setEmail('');
    setWorkspaceName('');
    setModules({ biometrics: true, payroll: true, leaves: true, performance: false });
    setLoadingStep(0);
    setIsDeploying(false);
    clearDeployTimers();
  };

  useEffect(() => {
    if (!isOpen) {
      resetModal();
    }
  }, [isOpen]);

  useEffect(() => {
    return () => clearDeployTimers();
  }, []);

  const handleNextStep = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !workspaceName) return;
    setStep(2);
  };

  const hasSelectedModule = Object.values(modules).some(Boolean);

  const handleDeployWorkspace = () => {
    if (!hasSelectedModule) return;
    clearDeployTimers();
    setIsDeploying(true);
    setStep(3);
    setLoadingStep(0);

    deployTimersRef.current = [
      setTimeout(() => setLoadingStep(1), 500),
      setTimeout(() => setLoadingStep(2), 1200),
      setTimeout(() => setLoadingStep(3), 2000),
      setTimeout(() => {
        setIsDeploying(false);
        setLoadingStep(4);
      }, 2800),
    ];
  };

  return (
    <AnimatePresence>
      {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Modal content */}
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="trial-modal-title"
          tabIndex={-1}
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="relative bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 max-w-md w-full overflow-hidden font-sans z-10 text-slate-100"
        >
          {/* Header */}
          <div className="bg-slate-950/80 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping" />
              <h3 id="trial-modal-title" className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-400" /> Start 14-Day Trial
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 p-1 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6">

            {/* STEP 1: LOGIN & WORKSPACE SUBDOMAIN */}
            {step === 1 && (
              <form onSubmit={handleNextStep} className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Initialize Your Workspace</h4>
                  <p className="text-xs text-slate-400 mt-1">Configure your primary login credentials and secure subdomain. No credit card required. <span className="text-slate-500">(Demo flow — register to provision a real workspace.)</span></p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">Work Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">Workspace Name</label>
                    <input
                      type="text"
                      required
                      placeholder="acme-corp"
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  {/* Subdomain Visualizer */}
                  {workspaceName && (
                    <div className="bg-blue-950/20 border border-blue-500/20 p-2.5 rounded-lg text-blue-400 text-xs font-mono text-center">
                      https://{workspaceName}.novora.app
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md mt-6 cursor-pointer"
                >
                  Configure HR Modules <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: MODULES CONFIG */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Pick Modules to Pre-Install</h4>
                  <p className="text-xs text-slate-400 mt-1">Select which features to configure inside your temporary trial databases.</p>
                </div>

                <div className="space-y-2.5">
                  {[
                    { key: 'biometrics', label: 'Biometric & Attendance Hub', desc: 'Sync attendance hardware terminals' },
                    { key: 'payroll', label: 'Smart Payroll Calculations', desc: 'Automatic local taxes & disbursements' },
                    { key: 'leaves', label: 'Absence & Leave Manager', desc: 'Pre-config custom accrual pools' },
                    { key: 'performance', label: 'Performance Reviews & feedback', desc: 'Competency frameworks & milestones' },
                  ].map((mod) => (
                    <button
                      type="button"
                      key={mod.key}
                      onClick={() => {
                        const key = mod.key as keyof typeof modules;
                        const next = { ...modules, [key]: !modules[key] };
                        if (!Object.values(next).some(Boolean)) return;
                        setModules(next);
                      }}
                      className={`w-full p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                        modules[mod.key as keyof typeof modules]
                          ? 'border-blue-500/50 bg-blue-950/10 text-slate-100 shadow-sm'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                        modules[mod.key as keyof typeof modules] ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-700 text-transparent'
                      }`}>
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${modules[mod.key as keyof typeof modules] ? 'text-blue-400' : 'text-slate-300'}`}>{mod.label}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{mod.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleDeployWorkspace}
                    disabled={!hasSelectedModule}
                    className="flex-[2] bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md cursor-pointer"
                  >
                    Deploy Workspace <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: WORKSPACE DEPLOYER & SIMULATOR */}
            {step === 3 && (
              <div className="space-y-6 text-center py-4">
                {isDeploying ? (
                  <div className="space-y-5">
                    {/* Pulsing Server Graphic */}
                    <div className="relative w-16 h-16 mx-auto bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center shadow-lg">
                      <Server className="w-8 h-8 text-blue-400 animate-pulse" />
                      <div className="absolute -inset-1 border border-blue-500/20 rounded-2xl animate-ping opacity-60" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Deploying Novora Sandbox</h4>
                      <p className="text-xs text-slate-400">Deploying instances inside cloud container networks...</p>
                    </div>

                    {/* Progress Checklist */}
                    <div className="max-w-xs mx-auto text-left space-y-2 text-xs bg-slate-950 border border-slate-800/80 p-4 rounded-xl font-mono text-slate-400">
                      <div className="flex items-center gap-2">
                        {loadingStep >= 1 ? <Check className="w-4 h-4 text-blue-400" /> : <div className="w-3.5 h-3.5 border-2 border-slate-800 border-t-blue-400 rounded-full animate-spin" />}
                        <span className={loadingStep >= 1 ? 'text-slate-300' : ''}>Provisioning secure RDS database</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {loadingStep >= 2 ? <Check className="w-4 h-4 text-blue-400" /> : loadingStep === 1 ? <div className="w-3.5 h-3.5 border-2 border-slate-800 border-t-blue-400 rounded-full animate-spin" /> : <div className="w-3 h-3 bg-slate-900 rounded-full" />}
                        <span className={loadingStep >= 2 ? 'text-slate-300' : 'text-slate-600'}>Registering SSL certificates</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {loadingStep >= 3 ? <Check className="w-4 h-4 text-blue-400" /> : loadingStep === 2 ? <div className="w-3.5 h-3.5 border-2 border-slate-800 border-t-blue-400 rounded-full animate-spin" /> : <div className="w-3 h-3 bg-slate-900 rounded-full" />}
                        <span className={loadingStep >= 3 ? 'text-slate-300' : 'text-slate-600'}>Seeding prebuilt templates</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-5"
                  >
                    <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto text-blue-400 shadow-md">
                      <Shield className="w-8 h-8" />
                    </div>

                    <div>
                      <span className="bg-blue-500/10 text-blue-400 text-[9px] font-bold px-2 py-0.5 rounded-full border border-blue-500/20 uppercase font-mono">
                        Deploy Successful
                      </span>
                      <h4 className="text-base font-black text-white mt-2">Your trial is live!</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                        Demo preview only — register to create a real workspace.
                      </p>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 max-w-xs mx-auto text-left space-y-2 text-xs font-mono">
                      <div className="flex justify-between border-b border-slate-900 pb-1 text-slate-500">
                        <span>WORKSPACE INFO</span>
                        <span className="text-[10px] text-blue-400">READY</span>
                      </div>
                      <p className="text-slate-300">URL: <span className="text-blue-400 select-all">https://{workspaceName || 'your-corp'}.novora.app</span></p>
                      <p className="text-slate-300">Login ID: <span className="text-blue-400 select-all">{email}</span></p>
                      <p className="text-slate-300">Password: <span className="text-slate-500">(set during registration)</span></p>
                    </div>

                    {/* Fake action to enter dashboard */}
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        navigate('/register');
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors shadow-md w-full max-w-xs mx-auto cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      Enter Your Workspace Cockpit <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </div>
            )}

          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}

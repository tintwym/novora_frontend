import { useState, useEffect, useRef, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar as CalIcon, Clock, CheckCircle, Mail, User, Building2, ChevronRight, Video, Sparkles } from 'lucide-react';
import { formatLocalDateKey, useModalA11y } from './useModalA11y';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    size: '20-99',
    challenge: 'Payroll errors & time tracking'
  });
  
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useModalA11y(isOpen, onClose, panelRef);

  const resetModal = () => {
    setStep(1);
    setFormData({
      name: '',
      email: '',
      company: '',
      size: '20-99',
      challenge: 'Payroll errors & time tracking',
    });
    setSelectedDate('');
    setSelectedTime('');
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (!isOpen) {
      if (submitTimerRef.current) {
        clearTimeout(submitTimerRef.current);
        submitTimerRef.current = null;
      }
      resetModal();
    }
  }, [isOpen]);

  // Generate 3 upcoming business days starting from current date
  const getUpcomingDates = () => {
    const dates = [];
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    let count = 0;
    let daysToAdd = 1;
    
    while (count < 3) {
      const d = new Date();
      d.setDate(d.getDate() + daysToAdd);
      // Skip weekends
      if (d.getDay() !== 0 && d.getDay() !== 6) {
        dates.push({
          raw: formatLocalDateKey(d),
          formatted: d.toLocaleDateString('en-US', options)
        });
        count++;
      }
      daysToAdd++;
    }
    return dates;
  };

  const upcomingDates = getUpcomingDates();
  const timeSlots = ['09:30 AM', '11:00 AM', '02:00 PM', '04:00 PM'];

  const handleNextStep = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.company) return;
    setStep(2);
  };

  const handleBookDemo = () => {
    if (!selectedDate || !selectedTime) return;
    setIsSubmitting(true);

    submitTimerRef.current = setTimeout(() => {
      setIsSubmitting(false);
      setStep(3);
      submitTimerRef.current = null;
    }, 1800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
          tabIndex={-1}
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden font-sans z-10 text-slate-900"
        >
          {/* Header */}
          <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <h3 id="booking-modal-title" className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" /> Book a Live Demo
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Progress */}
          {step < 3 && (
            <div className="flex bg-slate-50 border-b border-slate-100 h-1">
              <div className={`bg-blue-600 h-full transition-all duration-300 ${step === 1 ? 'w-1/2' : 'w-full'}`} />
            </div>
          )}

          {/* Content Body */}
          <div className="p-6">
            
            {/* STEP 1: BUSINESS DETAILS */}
            {step === 1 && (
              <form onSubmit={handleNextStep} className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-slate-900">Tell us about your team</h4>
                  <p className="text-xs text-slate-500 mt-1">We'll customize your live walkthrough based on your exact company size and system challenges. <span className="text-slate-400">(Interactive demo — no calendar invite is sent.)</span></p>
                </div>

                <div className="space-y-3">
                  {/* Name */}
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="Work Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                    />
                  </div>

                  {/* Company Name */}
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Company Name"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                    />
                  </div>

                  {/* Dropdowns */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-500 font-semibold mb-1 uppercase tracking-wide">Company Size</label>
                      <select
                        value={formData.size}
                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                      >
                        <option value="1-19">1 - 19 employees</option>
                        <option value="20-99">20 - 99 employees</option>
                        <option value="100-499">100 - 499 employees</option>
                        <option value="500+">500+ employees</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 font-semibold mb-1 uppercase tracking-wide">Primary Focus</label>
                      <select
                        value={formData.challenge}
                        onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                      >
                        <option value="Payroll errors & time tracking">Payroll & Biometrics</option>
                        <option value="Leave & Absence management">Absence & Leave</option>
                        <option value="Performance & onboarding">Employee Directory</option>
                        <option value="All-in-one general upgrade">All-in-one Upgrade</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md mt-6 cursor-pointer"
                >
                  Continue to Scheduler <ChevronRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: CALENDAR SELECTOR */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-slate-900">Select Date & Time</h4>
                  <p className="text-xs text-slate-500 mt-1">Pick an upcoming time slot to connect with our HR automation specialist.</p>
                </div>

                <div className="space-y-4">
                  {/* Select Date */}
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1.5 uppercase tracking-wide">Available Dates</label>
                    <div className="grid grid-cols-3 gap-2">
                      {upcomingDates.map((dateObj) => (
                        <button
                          type="button"
                          key={dateObj.raw}
                          onClick={() => { setSelectedDate(dateObj.raw); }}
                          className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                            selectedDate === dateObj.raw 
                              ? 'border-blue-500 bg-blue-50/50 text-blue-900 font-semibold shadow-sm'
                              : 'border-slate-200 hover:border-slate-400 text-slate-700 bg-slate-50'
                          }`}
                        >
                          <CalIcon className={`w-4 h-4 mx-auto mb-1 ${selectedDate === dateObj.raw ? 'text-blue-600' : 'text-slate-400'}`} />
                          <span className="text-xs block">{dateObj.formatted}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Select Time */}
                  <div>
                    <label className="block text-[10px] text-slate-500 font-bold mb-1.5 uppercase tracking-wide">Available Times (Your Local Time)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          type="button"
                          key={time}
                          onClick={() => { setSelectedTime(time); }}
                          className={`p-2.5 rounded-lg border text-center text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                            selectedTime === time 
                              ? 'border-blue-500 bg-blue-50/50 text-blue-900 font-semibold shadow-sm'
                              : 'border-slate-200 hover:border-slate-400 text-slate-700 bg-slate-50'
                          }`}
                        >
                          <Clock className={`w-3.5 h-3.5 ${selectedTime === time ? 'text-blue-600' : 'text-slate-400'}`} />
                          <span>{time}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submit action */}
                <div className="flex gap-3 mt-6 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleBookDemo}
                    disabled={!selectedDate || !selectedTime || isSubmitting}
                    className="flex-[2] bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Scheduling Live Demo...
                      </>
                    ) : (
                      <>
                        Confirm Booking <CheckCircle className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: SUCCESS BLOCK */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-4"
              >
                <div className="w-14 h-14 bg-blue-100 border border-blue-200 rounded-full flex items-center justify-center mx-auto text-blue-600 shadow-md">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-100">
                    CALENDAR EVENT CONFIRMED
                  </span>
                  <h4 className="text-lg font-black text-slate-900 mt-2">Demo Scheduled with Novora Expert!</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    This is an interactive demo preview. To schedule a real consultation, contact{' '}
                    <a href="mailto:support@novora.app" className="font-semibold text-blue-700 hover:underline">support@novora.app</a>.
                    {' '}A sample confirmation is shown below for <span className="font-semibold text-slate-800">{formData.email}</span>.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 max-w-sm mx-auto text-left space-y-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CalIcon className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Date: <span className="font-semibold text-slate-900">{upcomingDates.find(d => d.raw === selectedDate)?.formatted || selectedDate}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Time: <span className="font-semibold text-slate-900">{selectedTime} (Your Local Time)</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Link: <span className="text-blue-700 font-semibold hover:underline cursor-pointer">meet.google.com/nvr-hrms-demo</span></span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
                >
                  Close & Go Back
                </button>
              </motion.div>
            )}

          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 mb-3">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex justify-between items-center px-5 py-4 text-left font-sans text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2.5">
          <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          {question}
        </span>
        <span className="p-1 bg-slate-50 border rounded text-slate-400">
          {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 text-xs text-slate-500 leading-relaxed font-sans font-medium border-t border-slate-50">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'How does the biometric & attendance terminal sync work?',
      answer: 'Novora features native API listeners compatible with ZKTeco, Suprema, Hikvision, and other standard hardware. When a terminal is registered in Step 1, it pipes clock-in logs securely to our cloud sandbox. Deductions for late arrivals, half-days, or unapproved absences are then auto-deducted directly from the active payroll cycle without any manual calculation needed.'
    },
    {
      question: 'Is Novora compliant with regional payroll tax structures?',
      answer: 'Absolutely. Novora automatically maintains localized tax formulas, social security deductions, and regulatory reporting matrices. When you declare your operational region in your workspace settings, Novora updates compliance rules weekly, handles automatic tax withholding ledger calculations, and formats bank clearing files for swift, hassle-free disbursements.'
    },
    {
      question: 'Can we import our existing employee directory files?',
      answer: 'Yes. Novora includes an advanced Excel and CSV parser. You can drop any existing headcount roster or salary grid. Our onboarding wizard automatically maps columns, detects duplicate entries, allocates baseline leave pools, and triggers welcoming emails with secure login instructions in seconds.'
    },
    {
      question: 'Do you have fully functional mobile companion apps?',
      answer: 'Yes! We host native iOS and Android apps. Employees can securely log in via FaceID or fingerprint check, download encrypted payslips, request sick or annual leaves, and log geofenced mobile clock-ins if working on remote field sites.'
    },
    {
      question: 'Are there hidden setup fees or onboarding assistance rates?',
      answer: 'No. Growth and Pro plans are entirely self-serve with comprehensive guides and priority Slack support included at no additional cost. Enterprise contracts are assigned a dedicated Onboarding Integration Engineer who designs legacy database migrations and maps customized biometric configurations.'
    }
  ];

  return (
    <div id="faq" className="py-20 bg-white font-sans border-y border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1 rounded-full border border-slate-200 uppercase tracking-wider">
            Clear Answers
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 text-sm mt-3">
            Everything you need to know about setting up Novora HRMS to run your company operations.
          </p>
        </div>

        {/* FAQs list Accordion */}
        <div className="max-w-2xl mx-auto">
          {faqs.map((faq, idx) => (
            <FAQItem
              key={idx}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === idx}
              onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
            />
          ))}
        </div>



      </div>
    </div>
  );
}

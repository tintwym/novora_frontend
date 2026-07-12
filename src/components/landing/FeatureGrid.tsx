import { useState } from 'react';
import type { ComponentType } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Fingerprint, Calendar, CreditCard, 
  TrendingUp, Award, Smartphone, Check
} from 'lucide-react';

interface FeatureCardProps {
  id: string;
  title: string;
  desc: string;
  badge?: string;
  bullets: string[];
  icon: ComponentType<{ className?: string }>;
  isLarge?: boolean;
  selectedId: string;
  onSelect: (id: string) => void;
}

const getAccentColor = (id: string, isSelected: boolean) => {
  switch (id) {
    case 'biometrics':
      return {
        text: isSelected ? 'text-cyan-400' : 'text-cyan-600',
        bg: isSelected ? 'bg-cyan-500/10' : 'bg-cyan-50',
        border: isSelected ? 'border-cyan-500/20' : 'border-cyan-100',
      };
    case 'payroll':
      return {
        text: isSelected ? 'text-blue-400' : 'text-blue-600',
        bg: isSelected ? 'bg-blue-500/10' : 'bg-blue-50',
        border: isSelected ? 'border-blue-500/20' : 'border-blue-100',
      };
    case 'employees':
      return {
        text: isSelected ? 'text-lime-400' : 'text-lime-600',
        bg: isSelected ? 'bg-lime-500/10' : 'bg-lime-50',
        border: isSelected ? 'border-lime-500/20' : 'border-lime-100',
      };
    case 'leaves':
      return {
        text: isSelected ? 'text-orange-400' : 'text-orange-600',
        bg: isSelected ? 'bg-orange-500/10' : 'bg-orange-50',
        border: isSelected ? 'border-orange-500/20' : 'border-orange-100',
      };
    case 'reviews':
      return {
        text: isSelected ? 'text-emerald-400' : 'text-emerald-600',
        bg: isSelected ? 'bg-emerald-500/10' : 'bg-emerald-50',
        border: isSelected ? 'border-emerald-500/20' : 'border-emerald-100',
      };
    case 'recruitment':
      return {
        text: isSelected ? 'text-teal-400' : 'text-teal-600',
        bg: isSelected ? 'bg-teal-500/10' : 'bg-teal-50',
        border: isSelected ? 'border-teal-500/20' : 'border-teal-100',
      };
    case 'mobile':
    default:
      return {
        text: isSelected ? 'text-cyan-400' : 'text-slate-600',
        bg: isSelected ? 'bg-linear-to-r from-cyan-500/15 via-lime-500/15 to-orange-500/15' : 'bg-slate-50',
        border: isSelected ? 'border-slate-800' : 'border-slate-100',
      };
  }
};

function FeatureCard({ id, title, desc, badge, bullets, icon: Icon, isLarge = false, selectedId, onSelect }: FeatureCardProps) {
  const isSelected = selectedId === id;
  const accent = getAccentColor(id, isSelected);

  return (
    <motion.div
      onClick={() => onSelect(id)}
      layoutId={`card-container-${id}`}
      className={`relative rounded-2xl border p-6 flex flex-col justify-between cursor-pointer transition-all ${
        isSelected 
          ? 'bg-slate-900 text-white border-slate-900 shadow-xl' 
          : 'bg-white hover:bg-slate-50 border-slate-100 hover:border-slate-200 text-slate-800 hover:shadow-md'
      } ${isLarge ? 'md:col-span-2' : ''}`}
    >
      <div className="space-y-4">
        {/* Header line */}
        <div className="flex items-start justify-between">
          <div className={`p-3 rounded-xl border ${
            isSelected 
              ? `bg-slate-800 ${accent.text} border-slate-700` 
              : `${accent.bg} ${accent.text} ${accent.border}`
          }`}>
            <Icon className="w-5 h-5" />
          </div>
          {badge && (
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
              isSelected ? `${accent.bg} ${accent.text} border ${accent.border}` : 'bg-slate-100 text-slate-600'
            }`}>
              {badge}
            </span>
          )}
        </div>

        {/* Text */}
        <div>
          <h4 className="font-bold text-sm tracking-tight">{title}</h4>
          <p className={`text-xs mt-1.5 leading-relaxed ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>{desc}</p>
        </div>

        {/* Expandable detail list */}
        <AnimatePresence>
          {isSelected && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-300"
            >
              <p className={`font-bold text-[10px] uppercase ${accent.text} tracking-wider`}>Capabilities Included:</p>
              {bullets.map((bullet, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className={`w-3.5 h-3.5 ${accent.text} shrink-0`} />
                  <span>{bullet}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100/50 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
        <span className={isSelected ? accent.text : 'text-slate-400'}>
          {isSelected ? 'Active Details' : 'Click to inspect features'}
        </span>
        <span className={isSelected ? 'text-slate-500' : 'text-slate-300'}>→</span>
      </div>
    </motion.div>
  );
}

export default function FeatureGrid() {
  const [selectedFeature, setSelectedFeature] = useState<string>('biometrics');

  const features = [
    {
      id: 'biometrics',
      title: 'Biometric & Attendance Integration',
      desc: 'Connect physical biometric fingerprint & facial scanners directly to Novora. Sync clock-ins in real-time, eliminating manual timesheet entry.',
      badge: 'Hardware Sync',
      bullets: [
        'ZKTeco, Suprema, & Hikvision native API support',
        'Auto-deductions for late arrivals or early check-outs',
        'Offline caching - terminal logs sync as soon as online',
        'Geo-fenced mobile clock-ins for remote field staff'
      ],
      icon: Fingerprint,
      isLarge: true
    },
    {
      id: 'payroll',
      title: 'Automated Compliance Payroll',
      desc: 'One-click payroll run that computes gross wages, taxes, social benefit deductions, and instantly initiates bank transfers with 99.9% accuracy.',
      badge: 'Financial automation',
      bullets: [
        'Dynamic tax calculations customized to local jurisdictions',
        'Prebuilt custom bonuses, commission payouts, and overtime sync',
        'Direct disbursement API links with top clearing banks',
        'Automatic payslip distribution on scheduled dates'
      ],
      icon: CreditCard,
      isLarge: true
    },
    {
      id: 'employees',
      title: 'Unified Employee Management',
      desc: 'The central directory for all digital employee records, assets allocated, compensation logs, secure contracts, and reporting organizational chart.',
      badge: 'Core Directory',
      bullets: [
        'Organized digital profiles with document vaults',
        'Org chart visualization with reporting line maps',
        'Hardware & SaaS access permissions controller',
        'Structured digital onboarding workflows'
      ],
      icon: Users,
      isLarge: false
    },
    {
      id: 'leaves',
      title: 'Absence & Leave Manager',
      desc: 'Empower employees to submit requests, view custom balance pools, and configure automatic shift swaps when team members take time off.',
      badge: 'Automated Accruals',
      bullets: [
        'Define custom leave policies (Maternity, Sick, Annual)',
        'Automatic accruals based on calendar milestone years',
        'One-click supervisor reviews with Slack notification sync',
        'Shared departmental team absence calendars'
      ],
      icon: Calendar,
      isLarge: false
    },
    {
      id: 'reviews',
      title: 'Dynamic Performance Reviews',
      desc: 'Set goals, log 360-degree peer feedback reviews, and track employee performance curves inside automated periodic evaluation workflows.',
      badge: 'Growth Track',
      bullets: [
        'Competency matrices customized by professional role',
        'Continuous feedback and micro-recognition tags',
        'Prebuilt 360-degree review question templates',
        'Objective and key results (OKR) dashboard tracking'
      ],
      icon: Award,
      isLarge: false
    },
    {
      id: 'recruitment',
      title: 'Recruitment & Job Pipeline',
      desc: 'Post job slots across primary job boards, manage candidate pipelines, schedule virtual meets, and draft compliance offers instantly.',
      badge: 'Talent Acquisition',
      bullets: [
        'Publish openings directly to major job networks with one click',
        'Intuitive drag-and-drop applicant pipeline boards',
        'Shared candidate scorecard evaluations and reviews',
        'Custom pre-boarding and legal contract drafts generator'
      ],
      icon: TrendingUp,
      isLarge: false
    },
    {
      id: 'mobile',
      title: 'Universal Mobile Companion App',
      desc: 'Fully native iOS & Android companion portal. Employees can request leaves, download payslips, clock-in with GPS, and chat with team members.',
      badge: 'iOS & Android',
      bullets: [
        'High-security biometric FaceID/TouchID app lock',
        'GPS geofencing bounds check for remote site check-ins',
        'Instant mobile notifications for pending tasks or schedules',
        'Encrypted payslip vault with secure offline PDF viewing'
      ],
      icon: Smartphone,
      isLarge: true
    }
  ];

  return (
    <div id="features" className="py-20 bg-slate-50 font-sans border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="bg-slate-50 text-slate-800 text-xs font-bold px-3.5 py-1.5 rounded-full border border-slate-150 uppercase tracking-wider shadow-sm inline-block">
            <span className="bg-linear-to-r from-cyan-600 via-lime-600 to-orange-500 bg-clip-text text-transparent font-extrabold">All-In-One HR Command</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Comprehensive suite of modules to run your entire workforce.
          </h2>
          <p className="text-slate-500 text-sm mt-3 leading-relaxed">
            Replace fragmented systems. Novora bridges physical biometric readers with automated payroll algorithms, leave managers, and continuous talent evaluations in a single unified workspace.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              id={feature.id}
              title={feature.title}
              desc={feature.desc}
              badge={feature.badge}
              bullets={feature.bullets}
              icon={feature.icon}
              isLarge={feature.isLarge}
              selectedId={selectedFeature}
              onSelect={setSelectedFeature}
            />
          ))}
        </div>



      </div>
    </div>
  );
}

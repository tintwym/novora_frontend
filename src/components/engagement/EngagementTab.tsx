import { useState, useMemo, type FormEvent } from 'react'
import {
  Smile,
  MessageSquare,
  Heart,
  Sparkles,
  Award,
  Plus,
  Send,
  Flame,
  ShieldAlert,
  Target,
  Shield,
  Activity,
  ClipboardList,
  UserCheck2,
  Zap,
  Lightbulb,
  CheckSquare,
  Clock,
} from 'lucide-react'
import { showActionToast } from '../../utils/actionToast'
import type { ModuleEmployee } from '../../types/moduleEmployee'
import { nextSeq } from '../../utils/nextSeq';

type EngagementTabProps = {
  employees: ModuleEmployee[]
}

type EngagementSubTab = 
  | 'Pulse & eNPS Surveys'
  | 'AI Sentiment & suggestions'
  | 'Peer Shout-Out Wall'
  | 'Manager Sentiment Desk'
  | 'Engagement Reports & Analytics';

interface PulsePoll {
  id: string;
  question: string;
  category: string;
  options: { key: string; label: string; votes: number }[];
  isLocked: boolean;
  totalVoted: number;
}

interface SuggestionItem {
  id: string;
  category: string;
  text: string;
  timestamp: string;
  vibe: 'Positive' | 'Burnout Alert' | 'Constructive' | 'Neutral';
  safetyVerified: boolean;
  engagementHearts: number;
  aiInsights: string;
  topics: string[];
}

interface ShoutOut {
  id: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  receiverPosition: string;
  receiverDept: string;
  badge: { icon: string; text: string; colorClass: string; bgClass: string };
  message: string;
  timestamp: string;
  clapsCount: number;
}

interface ActionPlan {
  id: string;
  title: string;
  targetDepartment: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Normal';
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  notes: string;
  owner: string;
}

export function EngagementTab({ employees }: EngagementTabProps) {
  const addToast = (text: string, type?: 'success' | 'loading' | 'error' | 'info') => {
    showActionToast(text, type)
  }

  const [activeSubTab, setActiveSubTab] = useState<EngagementSubTab>('Pulse & eNPS Surveys');

  // -------------------------------------------------------------
  // STATE 1: eNPS & PULSE SURVEYS WORKFLOWS
  // -------------------------------------------------------------
  const [_userEnpsVote, setUserEnpsVote] = useState<number>(8);
  const [hasVotedEnps, setHasVotedEnps] = useState<boolean>(false);
  const [enpsTallies, setEnpsTallies] = useState({
    detractors: 6,  // 0-6 score (needs improvement)
    passives: 15,   // 7-8 score
    promoters: 38   // 9-10 score
  });

  const [polls, setPolls] = useState<PulsePoll[]>([
    {
      id: 'poll-01',
      question: 'How do you rate the physical comfort and design setup of your designated workstation space?',
      category: 'Workplace Environment',
      options: [
        { key: 'A', label: 'Highly Ergonomic & Premium', votes: 24 },
        { key: 'B', label: 'Decent, but lacks sit-stand assets', votes: 14 },
        { key: 'C', label: 'Inadequate comfort features', votes: 5 }
      ],
      isLocked: false,
      totalVoted: 43
    },
    {
      id: 'poll-02',
      question: 'Do you feel our wellness program matches your mental resilience or family coverage requirements?',
      category: 'Wellness & Benefits',
      options: [
        { key: 'A', label: 'Exceeds expectation completely', votes: 18 },
        { key: 'B', label: 'Decent support, but dental cover is thin', votes: 22 },
        { key: 'C', label: 'No significant benefit was perceived', votes: 4 }
      ],
      isLocked: false,
      totalVoted: 44
    },
    {
      id: 'poll-03',
      question: 'Are quiet-cohesion hour intervals (2:00 PM to 4:00 PM) helpful for distraction-free coding?',
      category: 'Focus & Cohesion',
      options: [
        { key: 'A', label: 'Extremely helpful, absolute concentration', votes: 31 },
        { key: 'B', label: 'Neutral, still receive Slack ping notifications', votes: 9 },
        { key: 'C', label: 'Disrupts general collaborative calls', votes: 6 }
      ],
      isLocked: false,
      totalVoted: 46
    }
  ]);

  const [hasVotedPollIds, setHasVotedPollIds] = useState<Record<string, boolean>>({});

  // -------------------------------------------------------------
  // STATE 2: ANONYMITY & SUGGESTIONS WITH SIMULATED AI SENTIMENT
  // -------------------------------------------------------------
  const [newOpinionText, setNewOpinionText] = useState('');
  const [newOpinionCategory, setNewOpinionCategory] = useState('Office Amenities');
  
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([
    { 
      id: 'SUG-651', 
      category: 'Workload & Pace', 
      text: 'Our team is putting in late night deployments consistently due to overlapping milestones. We need better buffer estimates on sprint planning to avoid cumulative exhaustion.', 
      timestamp: '2026-06-14',
      vibe: 'Burnout Alert',
      safetyVerified: true,
      engagementHearts: 18,
      aiInsights: 'Detected high fatigue pattern. Overlap noted in Engineering metrics.',
      topics: ['Sprint Buffer', 'Overtime Weary', 'Planning Guardrails']
    },
    { 
      id: 'SUG-652', 
      category: 'In-office Perks', 
      text: 'Can we install free premium single-origin coffee beans in the kitchen? This is a very minor adjustment that would instantly lift morning team bonding sessions!', 
      timestamp: '2026-06-12',
      vibe: 'Positive',
      safetyVerified: true,
      engagementHearts: 35,
      aiInsights: 'High affinity cultural item. Positive enhancement request.',
      topics: ['Pantry Perks', 'Morning Routine', 'Morale Boost']
    },
    { 
      id: 'SUG-653', 
      category: 'Policy Clarity', 
      text: 'We require a formal policy framework covering electric vehicle (EV) charging reimbursements under commuting budgets. Several colleagues own EVs now.', 
      timestamp: '2026-06-10',
      vibe: 'Constructive',
      safetyVerified: true,
      engagementHearts: 11,
      aiInsights: 'Proactive policy feedback. High alignment with sustainability goals.',
      topics: ['Car Commuting', 'Green Initiatives', 'Deduction Guidelines']
    }
  ]);

  // Real-time AI Sentiment Analyzer computed variable
  const simulatedAiVibe = useMemo(() => {
    const text = newOpinionText.toLowerCase();
    if (text.length < 5) return { category: 'Neutral' as const, color: 'text-slate-400 bg-slate-100', text: 'Type copy to begin real-time analysis' };
    
    // Check keyword flags for Burnout Alert
    if (
      text.includes('tired') || text.includes('burnout') || text.includes('stressed') || 
      text.includes('overworked') || text.includes('exhausted') || text.includes('deadline') || 
      text.includes('overtime') || text.includes('stuck') || text.includes('stress')
    ) {
      return { 
        category: 'Burnout Alert' as const, 
        color: 'text-rose-700 bg-rose-50 border border-rose-200/50', 
        text: '⚠️ Stress detected. Mentions of pacing guidelines or workload buffers analyzed.' 
      };
    }
    
    // Check keyword flags for highly positive
    if (
      text.includes('great') || text.includes('awesome') || text.includes('excellent') || 
      text.includes('love') || text.includes('wonderful') || text.includes('kudos') || 
      text.includes('happy') || text.includes('thanks') || text.includes('praise')
    ) {
      return { 
        category: 'Positive' as const, 
        color: 'text-emerald-700 bg-emerald-50 border border-emerald-200/50', 
        text: '💖 High affinity identified. Constructive expression of engagement.' 
      };
    }

    // Check keyword flags for active ideas
    if (
      text.includes('should') || text.includes('could') || text.includes('suggest') || 
      text.includes('can we') || text.includes('improve') || text.includes('maybe') || 
      text.includes('idea') || text.includes('proposal')
    ) {
      return { 
        category: 'Constructive' as const, 
        color: 'text-blue-700 bg-blue-50 border border-blue-200/50', 
        text: '💡 Proactive proposal. Contains concrete ideas to enhance operations.' 
      };
    }

    // Fallback default
    return { 
      category: 'Neutral' as const, 
      color: 'text-amber-700 bg-amber-50 border border-amber-200/50', 
      text: '📘 Objective stance. Feedback categorized as standard informational entry.' 
    };
  }, [newOpinionText]);

  // -------------------------------------------------------------
  // STATE 3: SHOUT-OUTS / PEER EXPERIENCE CELEBRATIONS
  // -------------------------------------------------------------
  const badgePresets = [
    { text: 'Collaborative Hero', icon: '🤝', colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-100', description: 'Excellent assistance across project verticals' },
    { text: 'Innovation Spark', icon: '💡', colorClass: 'text-blue-600 bg-blue-50 border-blue-100', description: 'Invented or customized clever workflow operations' },
    { text: 'Super Speed Deliverer', icon: '🚀', colorClass: 'text-purple-600 bg-purple-50 border-purple-100', description: 'Demonstrated rapid execution in times of crunch' },
    { text: 'Welfare Champion', icon: '💖', colorClass: 'text-rose-600 bg-rose-50 border-rose-100', description: 'Showed empathy, guidance, or extreme support' },
    { text: 'Pristine Deliverer', icon: '🌟', colorClass: 'text-amber-600 bg-amber-50 border-amber-100', description: 'Demonstrated deep expertise and faultless design' }
  ];

  const [shoutOutReceiverId, setShoutOutReceiverId] = useState(employees[0]?.id || '');
  const [selectedBadgeIndex, setSelectedBadgeIndex] = useState(0);
  const [shoutOutMessage, setShoutOutMessage] = useState('');

  const [shoutOuts, setShoutOuts] = useState<ShoutOut[]>([
    {
      id: 'SO-001',
      senderName: 'Anonymous • Product Lead',
      receiverId: 'EMP-001',
      receiverName: 'Sarah Lim',
      receiverPosition: 'Lead Software Architect',
      receiverDept: 'Engineering',
      badge: { icon: '🌟', text: 'Pristine Deliverer', colorClass: 'text-amber-600', bgClass: 'bg-amber-50 border-amber-150' },
      message: 'Massive high-fives to Sarah for single-handedly managing the continuous integration server database upgrades. Everything ran with perfect uptime on deployment!',
      timestamp: '2 hours ago',
      clapsCount: 14
    },
    {
      id: 'SO-002',
      senderName: 'Pinky Sharma',
      receiverId: 'EMP-0285',
      receiverName: 'Raj Kumar',
      receiverPosition: 'Senior Operations Executive',
      receiverDept: 'Operations',
      badge: { icon: '🤝', text: 'Collaborative Hero', colorClass: 'text-emerald-600', bgClass: 'bg-emerald-50 border-emerald-150' },
      message: 'Raj helped me clear several pending transit insurance claims with alliance representatives under tight time boxes. Truly cooperative teammate!',
      timestamp: 'Yesterday',
      clapsCount: 9
    }
  ]);

  // -------------------------------------------------------------
  // STATE 4: MANAGER SENTIMENT DESK & ACTIONS PLANS
  // -------------------------------------------------------------
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([
    { id: 'ACT-201', title: 'Workload & Buffer reallocation audits', targetDepartment: 'Engineering', priority: 'Critical', dueDate: '2026-06-25', status: 'In Progress', notes: 'HR to sit in Sprint Estimation rounds and ensure developers are not double-booked on projects.', owner: 'HR Operations Group' },
    { id: 'ACT-202', title: 'Equip ergonomic workstation sit-stand accessories', targetDepartment: 'Operations', priority: 'High', dueDate: '2026-07-02', status: 'Pending', notes: 'Procurement team preparing sample units for third floor testing groups.', owner: 'Facilities Admin' },
    { id: 'ACT-203', title: 'Publish clean mental resilience app program link', targetDepartment: 'All Departments', priority: 'Normal', dueDate: '2026-06-20', status: 'Completed', notes: 'Calm app enterprise invitations delivered to corporate email accounts.', owner: 'Welfare benefits team' }
  ]);

  const [newActTitle, setNewActTitle] = useState('');
  const [newActDept, setNewActDept] = useState('Engineering');
  const [newActPriority, setNewActPriority] = useState<'Critical' | 'High' | 'Medium' | 'Normal'>('High');
  const [newActDueDate, setNewActDueDate] = useState('25/06/2026');
  const [newActNotes, setNewActNotes] = useState('');

  // -------------------------------------------------------------
  // CALCULATED ENPS FORMULAS
  // -------------------------------------------------------------
  // eNPS = % Promoters - % Detractors
  const totalEnpsVotes = enpsTallies.promoters + enpsTallies.passives + enpsTallies.detractors;
  const promoterPct = Math.round((enpsTallies.promoters / totalEnpsVotes) * 100);
  const detractorPct = Math.round((enpsTallies.detractors / totalEnpsVotes) * 100);
  const passivePct = Math.round((enpsTallies.passives / totalEnpsVotes) * 100);
  const calculatedEnps = promoterPct - detractorPct;

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------

  const handleEnpsSubmit = (score: number) => {
    if (hasVotedEnps) {
      addToast('You have already cast an anonymous score in this quarter’s eNPS audit.', 'error');
      return;
    }

    setUserEnpsVote(score);
    setEnpsTallies(prev => {
      if (score >= 9) {
        return { ...prev, promoters: prev.promoters + 1 };
      } else if (score >= 7) {
        return { ...prev, passives: prev.passives + 1 };
      } else {
        return { ...prev, detractors: prev.detractors + 1 };
      }
    });

    setHasVotedEnps(true);
    addToast(`Thank you! Anonymous score of ${score}/10 recorded under secure security hashes.`, 'success');
  };

  const handlePollVoteSubmit = (pollId: string, optionKey: string) => {
    if (hasVotedPollIds[pollId]) {
      addToast('You have already logged your response to this weekly survey micro-poll.', 'error');
      return;
    }

    setPolls(prev => prev.map(p => {
      if (p.id === pollId) {
        const nextOptions = p.options.map(opt => {
          if (opt.key === optionKey) {
            return { ...opt, votes: opt.votes + 1 };
          }
          return opt;
        });
        return {
          ...p,
          options: nextOptions,
          totalVoted: p.totalVoted + 1
        };
      }
      return p;
    }));

    setHasVotedPollIds(prev => ({ ...prev, [pollId]: true }));
    addToast('Secret ballot recorded. Results updated in your corporate pulse dashboards.', 'success');
  };

  const handleSuggestionSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newOpinionText.trim() || newOpinionText.length < 10) {
      addToast('Please write a detailed feedback post of at least 10 letters first to unlock AI rating analysis.', 'error');
      return;
    }

    const identifiedVibe = simulatedAiVibe.category;
    
    // Auto abstract tags
    const mockTags = [
      newOpinionCategory,
      identifiedVibe === 'Burnout Alert' ? 'Pacing Check' : 'Culture Enhancement'
    ];

    const newItem: SuggestionItem = {
      id: `SUG-${Math.floor(654 + Math.random() * 300)}`,
      category: newOpinionCategory,
      text: newOpinionText,
      timestamp: new Date().toISOString().split('T')[0],
      vibe: identifiedVibe,
      safetyVerified: true,
      engagementHearts: 1,
      aiInsights: `Processed via NLP checks. Identified concern: "${newOpinionCategory}".`,
      topics: mockTags
    };

    setSuggestions([newItem, ...suggestions]);
    setNewOpinionText('');
    addToast(`Secret suggestion transmitted to database channels under ID ${newItem.id}.`, 'success');
  };

  const handleHeartSuggestion = (id: string, currentHearts: number) => {
    setSuggestions(prev => prev.map(item => {
      if (item.id === id) {
        addToast('Feedback heart upvoted', 'success');
        return { ...item, engagementHearts: currentHearts + 1 };
      }
      return item;
    }));
  };

  const handleShoutOutSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!shoutOutMessage.trim() || shoutOutMessage.length < 15) {
      addToast('Please type an authentic appreciation token containing real context.', 'error');
      return;
    }

    const selectedEmployee = employees.find(emp => emp.id === shoutOutReceiverId);
    if (!selectedEmployee) {
      addToast('Please select a valid colleague recipient.', 'error');
      return;
    }

    const badgePreset = badgePresets[selectedBadgeIndex];

    const newShoutOut: ShoutOut = {
      id: `SO-${String(nextSeq(shoutOuts.map(s => s.id))).padStart(2, '0')}`,
      senderName: 'You (Authenticated)',
      receiverId: selectedEmployee.id,
      receiverName: selectedEmployee.name,
      receiverPosition: selectedEmployee.position,
      receiverDept: selectedEmployee.department,
      badge: {
        icon: badgePreset.icon,
        text: badgePreset.text,
        colorClass: badgePreset.colorClass.split(' ')[0],
        bgClass: badgePreset.colorClass.split(' ').slice(1).join(' ') + ' border border-slate-100'
      },
      message: shoutOutMessage,
      timestamp: 'Just now',
      clapsCount: 1
    };

    setShoutOuts([newShoutOut, ...shoutOuts]);
    setShoutOutMessage('');
    addToast(`Welfare High-Five published! Recipient notified at ${selectedEmployee.email}`, 'success');
  };

  const handleClapShoutOut = (id: string) => {
    setShoutOuts(prev => prev.map(so => {
      if (so.id === id) {
        addToast(`Applauded ${so.receiverName}! 👏`, 'success');
        return { ...so, clapsCount: so.clapsCount + 1 };
      }
      return so;
    }));
  };

  const handleCreateActionPlan = (e: FormEvent) => {
    e.preventDefault();
    if (!newActTitle.trim()) {
      addToast('Please specify a title for the HR Action Planning docket.', 'error');
      return;
    }

    const newAct: ActionPlan = {
      id: `ACT-${Math.floor(250 + Math.random() * 200)}`,
      title: newActTitle,
      targetDepartment: newActDept,
      priority: newActPriority,
      dueDate: newActDueDate,
      status: 'Pending',
      notes: newActNotes || 'Under continuous review with HR team and division managers.',
      owner: 'Administrative Office Group'
    };

    setActionPlans([...actionPlans, newAct]);
    setNewActTitle('');
    setNewActNotes('');
    addToast(`Assigned objective "${newAct.title}" to standard action index.`, 'success');
  };

  const toggleActionStatus = (id: string, current: 'Pending' | 'In Progress' | 'Completed') => {
    const nextStatusMap: Record<'Pending' | 'In Progress' | 'Completed', 'Pending' | 'In Progress' | 'Completed'> = {
      'Pending': 'In Progress',
      'In Progress': 'Completed',
      'Completed': 'Pending'
    };
    const nextStatus = nextStatusMap[current];
    setActionPlans(prev => prev.map(ap => {
      if (ap.id === id) {
        addToast(`Progress tracked: ${ap.title} is now ${nextStatus}!`, 'info');
        return { ...ap, status: nextStatus };
      }
      return ap;
    }));
  };

  return (
    <div id="engagement-management-component-root" className="space-y-6">
      
      {/* Upper Module Navigation Bar */}
      <div id="engagement-navigator-row" className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div id="engagement-nav-tabs" className="flex items-center gap-1.5 select-none overflow-x-auto w-full lg:w-auto scrollbar-none pb-1 lg:pb-0">
          {(
            [
              'Pulse & eNPS Surveys',
              'AI Sentiment & suggestions',
              'Peer Shout-Out Wall',
              'Manager Sentiment Desk',
              'Engagement Reports & Analytics'
            ] as EngagementSubTab[]
          ).map((tab) => {
            const isActive = activeSubTab === tab;
            return (
              <button
                id={`engagement-tab-${tab.toLowerCase().replace(/\s+/g, '-').replace('&', 'and')}`}
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all shrink-0 relative cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'text-[#2f66e0] bg-[#2f66e0]/10 border border-[#2f66e0]/15 font-extrabold shadow-3xs'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
                }`}
              >
                <span>{tab}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-[#2f66e0] rounded-sm" />
                )}
              </button>
            );
          })}
        </div>

        {/* Global Action Banner */}
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[10.5px] font-black text-slate-400 uppercase tracking-wider">Live sentiment index sync active</span>
        </div>
      </div>


      {/* TAB 1: PULSE & eNPS SURVEYS */}
      {activeSubTab === 'Pulse & eNPS Surveys' && (
        <div id="subview-pulse-enps" className="space-y-6">


          {/* eNPS Gauge & Voting Card Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Real-time calculated score indicator */}
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Computed eNPS Score</span>
                    <h5 className="text-2xl font-black text-slate-800 mt-1">
                      {calculatedEnps > 0 ? `+${calculatedEnps}` : calculatedEnps}
                    </h5>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-black bg-emerald-50 text-emerald-700 rounded-lg">
                    Healthy (50+)
                  </span>
                </div>

                {/* Vertical slider scale representation */}
                <div className="mt-6 flex items-center justify-between gap-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-center w-1/3">
                    <span className="text-xs font-black text-rose-600 block">{detractorPct}%</span>
                    <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider block">Detractors (0-6)</span>
                  </div>
                  <div className="h-6 w-px bg-slate-200" />
                  <div className="text-center w-1/3">
                    <span className="text-xs font-black text-slate-500 block">{passivePct}%</span>
                    <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider block">Passives (7-8)</span>
                  </div>
                  <div className="h-6 w-px bg-slate-200" />
                  <div className="text-center w-1/3">
                    <span className="text-xs font-black text-emerald-600 block">{promoterPct}%</span>
                    <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider block">Promoters (9-10)</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[10.5px] font-semibold text-slate-400">
                <span>Total active participants:</span>
                <span className="font-bold text-slate-700">{totalEnpsVotes} members</span>
              </div>
            </div>

            {/* Interactive Ballot cast box */}
            <div className="lg:col-span-2 bg-white border border-slate-100 p-6 rounded-2xl shadow-xs flex flex-col justify-between relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-[#2f66e0]/5 rounded-full blur-2xl pointer-events-none" />
              <div>
                <h5 className="text-[12.5px] font-black text-slate-800 uppercase tracking-wide">Cast Your Anonymous eNPS Vote</h5>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  "How likely is it that you would recommend our organization as a high-performing workplace to colleagues?"
                </p>

                {hasVotedEnps ? (
                  <div className="bg-emerald-50/55 border border-emerald-200/50 p-5 rounded-xl text-center mt-5">
                    <CheckSquare className="h-8 w-8 text-emerald-600 mx-auto" />
                    <h6 className="text-xs font-black text-slate-800 mt-2">Ballot Successfully Digitized!</h6>
                    <p className="text-[11px] text-white/0 select-none hidden">Safety block certified.</p>
                    <p className="text-[11.5px] text-slate-500 mt-0.5 leading-relaxed">
                      Your answer was securely shuffled and combined with the Q2 organizational pool. Individual responses cannot be traced to protect workspace confidentiality.
                    </p>
                  </div>
                ) : (
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-[10px] text-rose-500 font-black uppercase tracking-wider">0 - Not likely</span>
                      <span className="text-[10px] text-emerald-500 font-black uppercase tracking-wider">10 - Extremely likely</span>
                    </div>

                    {/* Numeric buttons 0 to 10 */}
                    <div className="grid grid-cols-11 gap-1.5">
                      {Array.from({ length: 11 }).map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleEnpsSubmit(idx)}
                          className={`py-3 text-xs font-extrabold border rounded-xl cursor-pointer transition-all ${
                            idx <= 6 ? 'hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 bg-slate-50/50 border-slate-100 text-slate-700' :
                            idx <= 8 ? 'hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 bg-slate-50/50 border-slate-100 text-slate-700' :
                            'hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 bg-slate-50/50 border-slate-100 text-slate-700'
                          }`}
                        >
                          {idx}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-1.5 text-[10.5px] text-slate-400 font-medium">
                <Shield className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                <span>Encrypted with SHA-256 peer-shuffling algorithms</span>
              </div>
            </div>

          </div>

          {/* Micro Pulse Polls Section */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6.5 shadow-xs">
            <div className="flex justify-between items-center mb-5 border-b border-slate-50 pb-4">
              <div>
                <h5 className="text-[12.5px] font-black text-slate-800 uppercase tracking-wide">Weekly Pulse Micro-Surveys</h5>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Automated brief check-ins to monitor team friction points</p>
              </div>

              <span className="text-[11px] font-black text-[#2f66e0] bg-[#2f66e0]/10 px-3 py-1 rounded-full">
                {polls.length} Live surveys
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {polls.map((poll) => {
                const isVoted = hasVotedPollIds[poll.id];
                return (
                  <div key={poll.id} className="p-4 rounded-xl border border-slate-100 flex flex-col justify-between hover:border-slate-205 transition-all">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-blue-50 text-[#2f66e0]">
                          {poll.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">{poll.totalVoted} votes cast</span>
                      </div>

                      <h6 className="text-[11.5px] font-extrabold text-slate-800 leading-snug">
                        "{poll.question}"
                      </h6>

                      <div className="space-y-2.5 mt-5">
                        {poll.options.map(opt => {
                          const optPct = poll.totalVoted > 0 ? Math.round((opt.votes / poll.totalVoted) * 100) : 0;
                          return (
                            <button
                              key={opt.key}
                              disabled={isVoted}
                              onClick={() => handlePollVoteSubmit(poll.id, opt.key)}
                              className={`w-full text-left p-2.5 border rounded-xl flex flex-col transition-all cursor-pointer ${
                                isVoted
                                  ? 'bg-slate-50/50 border-slate-100'
                                  : 'bg-white border-slate-100 hover:bg-slate-50/50 hover:border-slate-205'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                                <span>{opt.label}</span>
                                <span className="font-extrabold text-[#2f66e0] shrink-0">{optPct}%</span>
                              </div>

                              <div className="w-full bg-slate-100 mt-1.5 h-1 rounded-full overflow-hidden">
                                <div className="bg-[#2f66e0] h-full" style={{ width: `${optPct}%` }} />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {isVoted && (
                      <div className="mt-4 p-2 text-center bg-emerald-50 text-emerald-800 text-[9.5px] font-black rounded-lg uppercase tracking-wide">
                        ✓ Vote cast anonymously
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}


      {/* TAB 2: SUGGESTION BOX & AI SENTIMENT ANALYSIS */}
      {activeSubTab === 'AI Sentiment & suggestions' && (
        <div id="subview-ai-sentiment" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Suggestion submission with AI precheck */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-[#2f66e0]" />
                  <h5 className="text-[12.5px] font-black text-slate-800 uppercase tracking-wide">Anonymity Suggestion Box</h5>
                </div>

                <form onSubmit={handleSuggestionSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Target Area Category</label>
                    <select
                      value={newOpinionCategory}
                      onChange={(e) => setNewOpinionCategory(e.target.value)}
                      className="w-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 outline-none cursor-pointer focus:bg-white focus:border-slate-200 transition-all"
                    >
                      <option value="Office Amenities">Office Amenities & Comfort</option>
                      <option value="Workload & Pace">Workload & Burnout Buffer Zone</option>
                      <option value="Policy Clarity">Policy Transparency & HR Admin</option>
                      <option value="Perks & Reimbursements">Benefits & Claim Reimbursements</option>
                      <option value="Continuous Training">Continuous Training Programs</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Constructive Post Text</label>
                    <textarea
                      placeholder="e.g. Type 'Our team is feeling stressed by tight deployment milestones. Could we negotiate additional project buffer estimates?'"
                      rows={5}
                      value={newOpinionText}
                      onChange={(e) => setNewOpinionText(e.target.value)}
                      className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl p-3 outline-none focus:bg-white focus:border-slate-200 resize-none leading-relaxed transition-all"
                    />
                  </div>

                  {/* AI Sentiment Analysis Live Preview */}
                  <div className={`p-4 rounded-xl transition-all ${simulatedAiVibe.color}`}>
                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider mb-1.5">
                      <span>⚡ AI Text Sentiment Pre-Check</span>
                      <span className="bg-white px-2 py-0.5 rounded shadow-3xs">{simulatedAiVibe.category}</span>
                    </div>
                    <p className="text-[10.5px] font-semibold leading-relaxed">
                      {simulatedAiVibe.text}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[10.5px] text-slate-400 text-center font-medium">
                    🔏 Automated secure proxy strips author email, identity ID, and terminal logs.
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#2f66e0] hover:bg-opacity-95 text-white text-xs font-extrabold py-2.5 rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>File Safe Suggestion</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Public suggestions board */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-none p-1 flex justify-between items-center">
                <span className="text-[11px] font-black text-slate-440 uppercase tracking-widest">Public suggestions Ledger</span>
                <span className="text-xs text-slate-400 font-bold">{suggestions.length} submitted entries</span>
              </div>

              <div className="space-y-4">
                {suggestions.map((entry) => (
                  <div key={entry.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs hover:shadow-xs hover:border-slate-205 transition-all flex flex-col md:flex-row gap-5 justify-between">
                    <div className="space-y-3.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-[9.5px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-50 text-[#2f66e0] border border-blue-100/50">
                          {entry.category}
                        </span>

                        {/* Tone Ribbon Badge */}
                        <span className={`text-[9.5px] font-black uppercase px-2 py-0.5 rounded-md ${
                          entry.vibe === 'Burnout Alert' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                          entry.vibe === 'Positive' ? 'bg-emerald-50 text-emerald-705 border border-emerald-100' :
                          entry.vibe === 'Constructive' ? 'bg-indigo-50 text-indigo-705 border border-indigo-150' :
                          'bg-slate-50 text-slate-700 border border-slate-100'
                        }`}>
                          🎭 {entry.vibe}
                        </span>

                        <span className="text-[10px] text-slate-400 font-bold font-mono">
                          ID: {entry.id}
                        </span>
                        
                        <span className="text-[10px] text-slate-400">
                          {entry.timestamp}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                        "{entry.text}"
                      </p>

                      {/* Display tags extracted by NLP analysis */}
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-[9px] text-slate-400 font-black tracking-widest uppercase">AI tags:</span>
                        {entry.topics.map((tag, idx) => (
                          <span key={idx} className="text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-100/50 px-2 py-0.5 rounded-lg">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* AI summary diagnostic */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[10.5px] text-slate-500 flex items-center gap-2">
                        <Activity className="h-3.5 w-3.5 text-[#2f66e0] shrink-0" />
                        <span><strong>NLP Diagnostic:</strong> {entry.aiInsights}</span>
                      </div>
                    </div>

                    {/* Upvote score action */}
                    <div className="shrink-0 flex md:flex-col justify-center items-center p-3.5 md:p-0 bg-slate-50 md:bg-transparent rounded-xl md:rounded-none gap-3">
                      <button
                        onClick={() => handleHeartSuggestion(entry.id, entry.engagementHearts)}
                        className="p-3 bg-white border border-slate-100 hover:border-rose-200 text-slate-500 hover:text-rose-600 rounded-xl transition-all cursor-pointer shadow-3xs flex items-center gap-2"
                        title="Vouch / Agree with this issue"
                      >
                        <Heart className="h-4.5 w-4.5 text-rose-500 fill-rose-500" />
                        <span className="text-xs font-black text-slate-800">{entry.engagementHearts}</span>
                      </button>
                      <span className="text-[9px] text-slate-400 font-black tracking-wider uppercase text-center hidden md:block">
                        Vouch & Upvote
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}


      {/* TAB 3: PEER RECOGNITION WALL (Virtual High-Fives / Shoutouts) */}
      {activeSubTab === 'Peer Shout-Out Wall' && (
        <div id="subview-shoutouts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Creation column */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  <h5 className="text-[12.5px] font-black text-slate-805 uppercase tracking-wide">Send a Virtual High-Five</h5>
                </div>

                <form onSubmit={handleShoutOutSubmit} className="space-y-4">
                  {/* Receiver selection */}
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Pick Recipient Colleague</label>
                    <select
                      value={shoutOutReceiverId}
                      onChange={(e) => setShoutOutReceiverId(e.target.value)}
                      className="w-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 outline-none cursor-pointer focus:bg-white focus:border-slate-200 transition-all"
                    >
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} ({emp.position} &bull; {emp.department})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Badge selection */}
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Choose Appreciation Ribbon Medal</label>
                    <div className="grid grid-cols-1 gap-2">
                      {badgePresets.map((preset, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setSelectedBadgeIndex(index)}
                          className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                            selectedBadgeIndex === index
                              ? 'bg-blue-50/50 border-[#2f66e0]/40 shadow-3xs text-[#2f66e0]'
                              : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50/50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base shrink-0">{preset.icon}</span>
                            <div className="leading-tight">
                              <span className="text-[11px] font-black block">{preset.text}</span>
                              <span className="text-[9.5px] text-slate-400 font-semibold">{preset.description}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message input */}
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Appreciation Message Note</label>
                    <textarea
                      placeholder="Say thank you or highlight an exceptional job done contextually..."
                      rows={3}
                      value={shoutOutMessage}
                      onChange={(e) => setShoutOutMessage(e.target.value)}
                      className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl p-3 outline-none focus:bg-white focus:border-slate-200 resize-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#2f66e0] hover:bg-opacity-95 text-white text-xs font-extrabold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Publish High-Five Shoutout</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Dashboard stream column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center bg-blue-50/10 border border-[#2f66e0]/15 p-4 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="h-4 w-4 text-[#2f66e0] animate-pulse" />
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wide">Public Peer Recognition Stream</span>
                </div>
                <span className="text-[9.5px] font-extrabold text-slate-400">Values in Action</span>
              </div>

              {/* Feed lists */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {shoutOuts.map((card) => (
                  <div key={card.id} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs hover:shadow-xs transition-all flex flex-col justify-between">
                    <div>
                      {/* Card Header information */}
                      <div className="flex justify-between items-start gap-2 mb-3.5">
                        <div className="flex items-start gap-2.5">
                          <div className="h-8.5 w-8.5 rounded-xl bg-gradient-to-tr from-[#2f66e0]/10 to-indigo-100/30 text-[#2f66e0] flex items-center justify-center font-extrabold text-[12.5px] border border-[#2f66e0]/10 shrink-0">
                            {card.receiverName.slice(0, 2)}
                          </div>
                          <div>
                            <h6 className="text-[11.5px] font-black text-slate-800 leading-tight">{card.receiverName}</h6>
                            <span className="text-[9.5px] text-slate-400 block font-semibold">
                              {card.receiverPosition} &bull; {card.receiverDept}
                            </span>
                          </div>
                        </div>

                        {/* Custom visual badge */}
                        <span className={`text-[9.5px] font-black uppercase px-2 py-1 rounded-lg shrink-0 flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-100`}>
                          <span>{card.badge.icon}</span>
                          <span>{card.badge.text}</span>
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-semibold italic">
                        "{card.message}"
                      </p>
                    </div>

                    {/* Footer claps bar */}
                    <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-[9.5px] text-slate-400 font-bold block">
                        via {card.senderName} &bull; {card.timestamp}
                      </span>

                      <button
                        onClick={() => handleClapShoutOut(card.id)}
                        className="p-1.5 px-3 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-[#2f66e0] rounded-lg border border-slate-100 transition-colors cursor-pointer text-[10.5px] font-black flex items-center gap-1.5 shadow-3xs"
                        title="Cheer for this peer!"
                      >
                        <span>👏 Applause</span>
                        <span className="font-extrabold text-slate-800">{card.clapsCount}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}


      {/* TAB 4: MANAGER SENTIMENT DESK & ACTION PLANNING */}
      {activeSubTab === 'Manager Sentiment Desk' && (
        <div id="subview-managerial-desk" className="space-y-6">
          {/* Org Wellness Telemetry */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs flex items-center gap-4.5">
              <span className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                <Flame className="h-5.5 w-5.5" />
              </span>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Operational Burnout Index</span>
                <span className="text-xl font-black text-rose-600">High Risk (64%)</span>
                <p className="text-[10.5px] text-slate-400 font-semibold mt-0.5">Flagged: Operations & QA</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs flex items-center gap-4.5">
              <span className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <UserCheck2 className="h-5.5 w-5.5" />
              </span>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Team Participation Rate</span>
                <span className="text-xl font-black text-slate-800">88.5% casted</span>
                <p className="text-[10.5px] text-emerald-500 font-bold mt-0.5">Exceeds compliance targets</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs flex items-center gap-4.5">
              <span className="p-3 bg-indigo-50 text-[#2f66e0] rounded-xl">
                <Smile className="h-5.5 w-5.5" />
              </span>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Wellness budget affinity</span>
                <span className="text-xl font-black text-slate-800">92% score</span>
                <p className="text-[10.5px] text-slate-400 font-semibold mt-0.5">HSA programs approved</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs flex items-center gap-4.5">
              <span className="p-3 bg-purple-50 text-purple-650 rounded-xl">
                <ClipboardList className="h-5.5 w-5.5" />
              </span>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Action Docket Count</span>
                <span className="text-xl font-black text-slate-800">
                  {actionPlans.filter(p => p.status !== 'Completed').length} Pending
                </span>
                <p className="text-[10.5px] text-[#2f66e0] font-bold mt-0.5">1 completed objective today</p>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Action creation form */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#2f66e0]" />
                  <h5 className="text-[12.5px] font-black text-slate-800 uppercase tracking-wide font-mono">Create Engagement Action Plan</h5>
                </div>

                <form onSubmit={handleCreateActionPlan} className="space-y-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Action Docket Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Workload audit sprint planning buffers"
                      value={newActTitle}
                      onChange={(e) => setNewActTitle(e.target.value)}
                      className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 outline-none focus:bg-white focus:border-slate-200 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block mb-1">Target Department</label>
                      <select
                        value={newActDept}
                        onChange={(e) => setNewActDept(e.target.value)}
                        className="w-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-2.5 py-2 outline-none cursor-pointer focus:bg-white focus:border-slate-200"
                      >
                        <option value="All Departments">All Departments</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Operations">Operations</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Finance">Finance</option>
                        <option value="HR">HR Division</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block mb-1">Critical Priority</label>
                      <select
                        value={newActPriority}
                        onChange={(e) => setNewActPriority(e.target.value as any)}
                        className="w-full text-xs font-bold text-slate-750 bg-slate-50 border border-slate-100 rounded-xl px-2.5 py-2 outline-none cursor-pointer focus:bg-white focus:border-slate-200"
                      >
                        <option value="Critical">🚨 Critical</option>
                        <option value="High">🔴 High</option>
                        <option value="Medium font-bold">🟡 Medium</option>
                        <option value="Normal">🟢 Normal</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Due Date</label>
                    <input
                      type="date"
                      value={newActDueDate}
                      onChange={(e) => setNewActDueDate(e.target.value)}
                      className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2 outline-none cursor-pointer focus:bg-white focus:border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Execution notes</label>
                    <textarea
                      placeholder="Specify deliverables, milestones, or HR feedback channels..."
                      rows={3}
                      value={newActNotes}
                      onChange={(e) => setNewActNotes(e.target.value)}
                      className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl p-3 outline-none focus:bg-white focus:border-slate-200 resize-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#2f66e0] hover:bg-opacity-95 text-white text-xs font-extrabold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Deploy Action Objective</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Live active Action dockets */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-slate-100 rounded-2xl p-6.5 shadow-xs">
                <h5 className="text-[12.5px] font-black text-slate-800 uppercase tracking-wide mb-4">Organizational Wellness & Action Planning logs</h5>
                
                <div className="space-y-3">
                  {actionPlans.map((plan) => (
                    <div 
                      key={plan.id}
                      className="p-4 rounded-xl bg-slate-50/50 border border-slate-105 hover:border-slate-205 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                            plan.priority === 'Critical' ? 'bg-red-50 text-rose-700 border border-red-100/50' :
                            plan.priority === 'High' ? 'bg-amber-50 text-amber-700 border border-amber-100/50' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {plan.priority} Priority
                          </span>
                          <span className="text-[10px] text-[#2f66e0] bg-blue-50 px-2 py-0.5 rounded font-black uppercase">
                            {plan.targetDepartment}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            Reference: {plan.id}
                          </span>
                        </div>

                        <h6 className="text-xs font-bold text-slate-800 leading-tight">
                          {plan.title}
                        </h6>

                        <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                          {plan.notes}
                        </p>

                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                          <Clock className="h-3 w-3" />
                          <span>Owner: {plan.owner} &bull; Target end: {plan.dueDate}</span>
                        </div>
                      </div>

                      {/* Interactive toggle block */}
                      <div className="shrink-0 flex items-center gap-3 self-end sm:self-auto browser-safari-override">
                        <button
                          onClick={() => toggleActionStatus(plan.id, plan.status)}
                          className={`text-[10.5px] font-black px-3 py-1.5 rounded-xl border cursor-pointer select-none transition-all active:scale-95 ${
                            plan.status === 'Completed' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                            plan.status === 'In Progress' ? 'bg-blue-50 text-[#2f66e0] border-blue-200' :
                            'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {plan.status === 'Completed' ? '✓ Completed' :
                           plan.status === 'In Progress' ? '⚡ Ongoing' :
                           '✕ Pending Entry'}
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* Stress radar disengagement points alert */}
              <div className="bg-rose-50/40 border border-rose-100 p-5 rounded-2xl">
                <div className="flex gap-3">
                  <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0" />
                  <div>
                    <h6 className="text-xs font-black text-rose-800">Operational Friction Alerts Under Alarm</h6>
                    <p className="text-[11px] text-slate-560 leading-relaxed mt-1">
                      Text analysis matching on the Anonymous feedback ledger signals recurring overtime indicators within our <strong>Operations & QA</strong> divisions. Buffer renegotiation policies are recommended to HR advisors coordinates to preempt potential resignations.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* TAB 5: ENGAGEMENT REPORTS & ANALYTICS */}
      {activeSubTab === 'Engagement Reports & Analytics' && (
        <div id="subview-engagement-reports" className="space-y-6 animate-in fade-in duration-200">
          
          {/* Key Engagement KPI grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-3xs">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-black uppercase tracking-wider block">Unified eNPS Rating</span>
                <Smile className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="mt-2.5">
                {(() => {
                  const total = enpsTallies.promoters + enpsTallies.passives + enpsTallies.detractors;
                  const score = Math.round(((enpsTallies.promoters - enpsTallies.detractors) / (total || 1)) * 100);
                  return (
                    <>
                      <span className="text-2xl font-black text-slate-800">+{score} eNPS</span>
                      <span className="text-[10px] text-slate-450 block font-semibold mt-0.5">
                        {enpsTallies.promoters} Promoters &bull; {enpsTallies.detractors} Detractors
                      </span>
                    </>
                  );
                })()}
              </div>
              <div className="flex items-center gap-1 mt-3">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[9.5px] text-emerald-600 font-extrabold uppercase">High Morale Tier</span>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-3xs">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-black uppercase tracking-wider block">Pulse Polls Casted</span>
                <ClipboardList className="h-4 w-4 text-[#2f66e0]" />
              </div>
              <div className="mt-2.5">
                <span className="text-2xl font-black text-slate-800">
                  {polls.reduce((sum, p) => sum + p.totalVoted, 0)} votes
                </span>
                <span className="text-[10px] text-slate-450 block font-semibold mt-0.5">
                  Across {polls.length} micro-topic survey polls
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-3.5">
                <div className="bg-[#2f66e0] h-full w-[85%]" />
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-3xs">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-black uppercase tracking-wider block">Peer Appreciation</span>
                <MessageSquare className="h-4 w-4 text-purple-500" />
              </div>
              <div className="mt-2.5">
                <span className="text-2xl font-black text-slate-800">
                  {shoutOuts.length} Shout-Outs
                </span>
                <span className="text-[10px] text-slate-450 block font-semibold mt-0.5">
                  {shoutOuts.reduce((sum, s) => sum + s.clapsCount, 0)} claps and badges shared
                </span>
              </div>
              <div className="flex items-center gap-1 mt-3">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-[9.5px] text-amber-600 font-extrabold uppercase">Highly Engaged Peer Culture</span>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-3xs">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-black uppercase tracking-wider block">Action Plan Progress</span>
                <Target className="h-4 w-4 text-pink-500" />
              </div>
              <div className="mt-2.5">
                <span className="text-2xl font-black text-slate-800">
                  {actionPlans.filter(p => p.status === 'Completed').length} / {actionPlans.length} Done
                </span>
                <span className="text-[10px] text-slate-450 block font-semibold mt-0.5">
                  Mitigation items completed in 48-hour SLAs
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-3">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${Math.round((actionPlans.filter(p => p.status === 'Completed').length / (actionPlans.length || 1)) * 100)}%` }}
                />
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Aspect: AI Sentiment Analyser Matrix (7 Cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs space-y-5">
              <div className="border-b border-slate-50 pb-3 flex justify-between items-center">
                <div>
                  <h5 className="text-[12.5px] font-black text-slate-800 uppercase tracking-wide">Real-time Vibe & Sentiment Feed</h5>
                  <p className="text-[10px] text-slate-400 font-medium italic mt-0.5">Analyzing anonymous submissions against cognitive burnout alarm limits</p>
                </div>
                <button 
                  onClick={() => {
                    addToast('Anonymous sentiment diagnostics blueprint compiled for management council review.', 'success');
                  }}
                  className="bg-slate-50 border border-slate-200 hover:border-[#2f66e0] rounded-xl px-2.5 py-1 text-[9.5px] font-black uppercase text-slate-500 hover:text-[#2f66e0] cursor-pointer transition-colors"
                >
                  Export Sentiment Metrics
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] font-semibold text-slate-600 border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 uppercase text-[9.5px] font-black text-slate-400">
                      <th className="py-2.5 px-3">Suggestion Topic</th>
                      <th className="py-2.5 px-3">Vibe Classification</th>
                      <th className="py-2.5 px-3 font-bold">Safety Pass</th>
                      <th className="py-2.5 px-3 text-center font-bold">Claps Shared</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-[11px]">
                    {suggestions.map((sg) => (
                      <tr key={sg.id} className="hover:bg-slate-50/20">
                        <td className="py-3 px-3 max-w-xs font-semibold">
                          <span className="text-slate-800 font-bold block truncate">{sg.text}</span>
                          <span className="text-[9.5px] text-slate-400 font-normal">{sg.category} &bull; {sg.timestamp}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                            sg.vibe === 'Positive' 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : sg.vibe === 'Burnout Alert'
                              ? 'bg-rose-50 text-rose-700 animate-pulse'
                              : sg.vibe === 'Constructive'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-slate-50 text-slate-700'
                          }`}>
                            {sg.vibe}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-[9.5px] text-slate-400 font-black tracking-wider uppercase">
                            {sg.safetyVerified ? '✓ Encrypted Safe' : 'In-Review'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-mono">
                          ♥ {sg.engagementHearts}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Aspect: eNPS Metrics Spread and Badges list (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs space-y-4">
                <h5 className="text-[12.5px] font-black text-slate-800 uppercase tracking-wide">eNPS Group Tally Weights</h5>
                
                <div className="space-y-3.5">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-slate-600">
                      <span>Promoters (9-10 rating score)</span>
                      <span className="font-bold text-slate-800">{enpsTallies.promoters} (64%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '64%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-slate-600">
                      <span>Passives (7-8 rating score)</span>
                      <span className="font-bold text-slate-800">{enpsTallies.passives} (25%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '25%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-slate-600">
                      <span>Detractors (0-6 rating score)</span>
                      <span className="font-bold text-rose-700">{enpsTallies.detractors} (11%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: '11%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Badges Distribution Stats */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs space-y-4">
                <h5 className="text-[12.5px] font-black text-slate-805 uppercase tracking-wide">Shared Badges Distribution</h5>
                
                <div className="space-y-3">
                  {[
                    { badge: '🌸 Zen Master of Mindfulness', share: 45, color: 'bg-pink-500', count: 12 },
                    { badge: '🚀 Speed Demon Excellence', share: 30, color: 'bg-amber-500', count: 8 },
                    { badge: '🤝 Peerless Cohesion Architect', share: 25, color: 'bg-emerald-500', count: 7 }
                  ].map((bg, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-[10.5px]">
                        <span className="font-bold text-slate-655 block text-ellipsis truncate max-w-[200px]">{bg.badge}</span>
                        <span className="font-bold text-slate-800">{bg.count} shared ({bg.share}%)</span>
                      </div>
                      <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`${bg.color} h-full rounded-full transition-all`} 
                          style={{ width: `${bg.share}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

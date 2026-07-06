import type {
  ActionLogEntry,
  PulseSurvey,
  RatioBar,
  SentimentFeedRow,
  ShoutOutCard,
  ShoutOutMedal,
  SuggestionEntry,
} from '../types/engagement'

export const PULSE_SURVEYS: PulseSurvey[] = [
  {
    title: 'WORKPLACE ENVIRONMENT',
    votes: '43 votes cast',
    question: 'How do you rate the physical comfort and design setup of your designated workstation space?',
    options: [
      { label: 'Highly Ergonomic & Premium', pct: 56 },
      { label: 'Decent, but lacks sit-stand assets', pct: 33 },
      { label: 'Inadequate comfort features', pct: 12 },
    ],
  },
  {
    title: 'WELLNESS & BENEFITS',
    votes: '44 votes cast',
    question: 'Do you feel our wellness program matches your mental resilience or family coverage requirements?',
    options: [
      { label: 'Exceeds expectation completely', pct: 41 },
      { label: 'Decent support, but dental cover is thin', pct: 50 },
      { label: 'No significant benefit was perceived', pct: 9 },
    ],
  },
  {
    title: 'FOCUS & COHESION',
    votes: '46 votes cast',
    question: 'Are quiet-cohesion hour intervals (2:00 PM to 4:00 PM) helpful for distraction-free coding?',
    options: [
      { label: 'Extremely helpful, absolute concentration', pct: 67 },
      { label: 'Neutral, still receive Slack ping notifications', pct: 20 },
      { label: 'Disrupts general collaborative calls', pct: 13 },
    ],
  },
]

export const SUGGESTIONS: SuggestionEntry[] = [
  {
    category: 'WORKLOAD & PACE',
    vibe: 'BURNOUT ALERT',
    vibeTone: 'danger',
    id: 'SUG-651',
    date: '2026-06-14',
    text: 'Our team is putting in late night deployments consistently during overlapping milestone windows.',
    tag: '#Sprint Buffer',
    nlp: 'Detected high fatigue pattern. Overlap noted in Engineering metrics.',
    upvotes: 18,
  },
  {
    category: 'IN-OFFICE PERKS',
    vibe: 'POSITIVE',
    vibeTone: 'success',
    id: 'SUG-648',
    date: '2026-06-12',
    text: 'Can we install free premium single-origin coffee beans in the pantry?',
    tag: '#Culture Perks',
    nlp: 'High affinity cultural item. Positive enhancement request.',
    upvotes: 35,
  },
  {
    category: 'POLICY CLARITY',
    vibe: 'CONSTRUCTIVE',
    vibeTone: 'info',
    id: 'SUG-642',
    date: '2026-06-10',
    text: 'We require a formal policy framework covering electric vehicle charging reimbursements.',
    tag: '#Sustainability',
    nlp: 'Proactive policy feedback. High alignment with sustainability goals.',
    upvotes: 11,
  },
]

export const SHOUT_OUT_MEDALS: ShoutOutMedal[] = [
  { name: 'Collaborative Hero', icon: '💎', description: 'Excellent assistance across project verticals' },
  { name: 'Innovation Spark', icon: '💡', description: 'Invented or customized clever workflow operations' },
  { name: 'Super Speed Deliverer', icon: '🚀', description: 'Demonstrated rapid execution in times of crunch' },
  { name: 'Welfare Champion', icon: '💗', description: 'Showed empathy, guidance, or extreme support' },
  { name: 'Pristine Deliverer', icon: '✨', description: 'Demonstrated deep expertise and faultless design' },
]

export const SHOUT_OUTS: ShoutOutCard[] = [
  {
    initials: 'Sa',
    name: 'Sarah Lim',
    role: 'Lead Software Architect • Engineering',
    badge: 'PRISTINE DELIVERER',
    message: 'Massive high-fives to Sarah for single-handedly managing the continuous integration server database upgrades. Everything ran with perfect uptime on deployment!',
    meta: 'Anonymous • Product Lead • 2 hours ago',
    applause: 14,
  },
  {
    initials: 'Ra',
    name: 'Raj Kumar',
    role: 'Senior Backend Engineer • Engineering',
    badge: 'COLLABORATIVE HERO',
    message: 'Raj helped me clear several pending transit insurance claims with alliance representatives under tight time boxes. Truly cooperative teammate!',
    meta: 'Pinky Sharma • Yesterday',
    applause: 9,
  },
]

export const ACTION_LOGS: ActionLogEntry[] = [
  {
    priority: 'CRITICAL PRIORITY',
    priorityTone: 'danger',
    department: 'ENGINEERING',
    ref: 'ACT-201',
    title: 'Workload & Buffer reallocation audits',
    body: 'HR to sit in Sprint Estimation rounds and ensure developers are not double-booked on projects.',
    footer: 'Owner: HR Operations Group • Target end: 2026-06-25',
    status: 'Ongoing',
    statusTone: 'warning',
  },
  {
    priority: 'HIGH PRIORITY',
    priorityTone: 'warning',
    department: 'OPERATIONS',
    ref: 'ACT-202',
    title: 'Equip ergonomic workstation sit-stand accessories',
    body: 'Procurement team preparing sample units for third floor testing groups.',
    footer: 'Owner: Facilities Admin • Target end: 2026-07-02',
    status: 'Pending Entry',
    statusTone: 'neutral',
  },
  {
    priority: 'NORMAL PRIORITY',
    priorityTone: 'neutral',
    department: 'ALL DEPARTMENTS',
    ref: 'ACT-203',
    title: 'Publish clean mental resilience app program link',
    body: 'Calm app enterprise invitations delivered to corporate email accounts.',
    footer: 'Owner: Welfare benefits team • Target end: 2026-06-20',
    status: 'Completed',
    statusTone: 'success',
  },
]

export const SENTIMENT_FEED: SentimentFeedRow[] = [
  {
    topic: 'Our team is putting in late night deployments consistently d…',
    sub: 'Workload & Pace • 2026-06-14',
    vibe: 'BURNOUT ALERT',
    vibeTone: 'danger',
    claps: 18,
  },
  {
    topic: 'Can we install free premium single-origin coffee beans in th…',
    sub: 'In-office Perks • 2026-06-12',
    vibe: 'POSITIVE',
    vibeTone: 'success',
    claps: 35,
  },
  {
    topic: 'We require a formal policy framework covering electric vehi…',
    sub: 'Policy Clarity • 2026-06-10',
    vibe: 'CONSTRUCTIVE',
    vibeTone: 'info',
    claps: 11,
  },
]

export const ENPS_GROUP_RATIOS: RatioBar[] = [
  { label: 'Promoters (9-10 rating score)', pct: 64, color: '#059669', trailing: '38 (64%)' },
  { label: 'Passives (7-8 rating score)', pct: 25, color: '#ea580c', trailing: '15 (25%)' },
  { label: 'Detractors (0-6 rating score)', pct: 11, color: '#dc2626', trailing: '6 (11%)' },
]

export const BADGE_DISTRIBUTION: RatioBar[] = [
  { label: '🌸 Zen Master of Mindfulness', pct: 45, color: '#db2777', trailing: '12 shared (45%)' },
  { label: '🚀 Speed Demon Excellence', pct: 30, color: '#ea580c', trailing: '8 shared (30%)' },
  { label: '🤝 Peerless Cohesion Architect', pct: 25, color: '#059669', trailing: '7 shared (25%)' },
]

import { useState, type FormEvent } from 'react'
import {
  LayoutGrid,
  Download,
  Trash2,
  Edit2,
  Plus,
  RotateCcw,
  Save,
  CheckCircle,
  FileSpreadsheet,
  FileText,
  CalendarDays,
  Award,
  Users,
  Briefcase,
  Mail,
  ShieldAlert,
  CheckSquare,
  Square,
  Sparkles,
  UserPlus,
  CreditCard,
  Receipt,
  HeartHandshake,
  Smile,
  GraduationCap,
  BookOpen,
  Package,
  LifeBuoy,
  Search,
} from 'lucide-react'
import { showActionToast } from '../../utils/actionToast'
import type { ModuleEmployee } from '../../types/moduleEmployee'

type ReportsTabProps = {
  employees: ModuleEmployee[]
  activeSubTab?: 'centre' | 'scheduled' | 'builder'
  setActiveSubTab?: (tab: 'centre' | 'scheduled' | 'builder') => void
}

interface ReportSchedule {
  id: string;
  name: string;
  frequency: string;
  nextRun: string;
  type: string;
  format: string;
  time: string;
  recipients: string;
}

const MODULE_METADATA = [
  { name: 'All Overview', icon: LayoutGrid, category: 'Overview', desc: 'Main consolidated stats & charts' },
  { name: 'Employee', icon: Users, category: 'Core HR', desc: 'Staff lists, demographics & reports' },
  { name: 'Recruitment', icon: Briefcase, category: 'Talent & Growth', desc: 'Hiring funnel & candidate logs' },
  { name: 'On/Off-boarding', icon: UserPlus, category: 'Core HR', desc: 'Incoming joins & exits trackers' },
  { name: 'Attendance', icon: CalendarDays, category: 'Core HR', desc: 'Check-in histories & overtimes' },
  { name: 'Leave', icon: FileText, category: 'Core HR', desc: 'Leave approvals & day balances' },
  { name: 'Disciplinary', icon: ShieldAlert, category: 'Core HR', desc: 'Case violations & active warnings' },
  { name: 'Payroll', icon: CreditCard, category: 'Financials & Benefits', desc: 'Salary ledger & payout registers' },
  { name: 'Claims', icon: Receipt, category: 'Financials & Benefits', desc: 'Operational expense request logs' },
  { name: 'Benefits', icon: HeartHandshake, category: 'Financials & Benefits', desc: 'Health benefits & perks summaries' },
  { name: 'Helpdesk & Inquiries', icon: LifeBuoy, category: 'Support & Engagement', desc: 'Ticketing queues & resolution rates' },
  { name: 'Performance', icon: Award, category: 'Talent & Growth', desc: 'Appraisal ratings & target KPIs' },
  { name: 'Engagement', icon: Smile, category: 'Support & Engagement', desc: 'Pulse checks & anonymous feedback' },
  { name: 'Training', icon: GraduationCap, category: 'Talent & Growth', desc: 'Schedules & registration states' },
  { name: 'Learning', icon: BookOpen, category: 'Talent & Growth', desc: 'Training materials & completions' },
  { name: 'Assets', icon: Package, category: 'Core HR', desc: 'Devices & asset logs' },
];

const MODULE_REPORTS_DATA: Record<string, {
  totalRecords: string;
  lastUpdated: string;
  autoRun: string;
  stats: { label: string; value: string; trend: string; positive: boolean }[];
  reports: { title: string; description: string; tag: string }[];
  distribution: { title: string; items: { label: string; value: string; percent: number; colorClass: string }[] };
  managementBrief: {
    strategicFocus: string;
    riskIndex: 'Low' | 'Medium' | 'High' | 'Critical';
    costImpact: string;
    actionableDirectives: string[];
  }
}> = {
  Employee: {
    totalRecords: '154 Active profiles',
    lastUpdated: 'Today 18:30',
    autoRun: 'Active (Daily)',
    stats: [
      { label: 'Active Headcount', value: '154 Staff', trend: '+4% from last month', positive: true },
      { label: 'Avg Tenure', value: '3.8 Years', trend: '+0.2y YoY growth', positive: true },
      { label: 'Monthly Turnover', value: '1.2%', trend: '-0.3% improvement', positive: true }
    ],
    reports: [
      { title: 'Global Staff Census & Registry', description: 'Comprehensive directory including active status, join dates, and roles.', tag: 'CENSUS' },
      { title: 'Workforce Diversity & Demographics Audit', description: 'Breakdown of gender balance, origin statistics, and age demographics.', tag: 'DIVERSITY' },
      { title: 'Tenure & Contract Allocation Profile', description: 'Detailed view of staff contract classifications and average historical retention.', tag: 'TENURE' }
    ],
    distribution: {
      title: 'Employment Type Distribution',
      items: [
        { label: 'Full-Time Employees', value: '131', percent: 85, colorClass: 'bg-[#2f66e0]' },
        { label: 'Part-Time & Flex-Staff', value: '15', percent: 10, colorClass: 'bg-emerald-500' },
        { label: 'Contractors / External', value: '8', percent: 5, colorClass: 'bg-indigo-500' }
      ]
    },
    managementBrief: {
      strategicFocus: 'Workforce distribution alignment & tenure stability tracking.',
      riskIndex: 'Low',
      costImpact: 'Optimized headcount allocation limiting turnover leakage.',
      actionableDirectives: [
        'Review potential department succession pipelines for technical roles nearing 5 years avg tenure.',
        'Track contract staff conversion metrics to control high-fee contractor budgets.',
        'Verify remote work ratios relative to local physical seat booking configurations.'
      ]
    }
  },
  Recruitment: {
    totalRecords: '342 Candidate applications',
    lastUpdated: 'Just now',
    autoRun: 'Active (Realtime)',
    stats: [
      { label: 'Open Requisitions', value: '12 Positions', trend: '2 filled this week', positive: true },
      { label: 'Active Pipeline', value: '84 Applicants', trend: '+15 new this week', positive: true },
      { label: 'Average Time-to-Hire', value: '24 Days', trend: '-3 days optimized', positive: true }
    ],
    reports: [
      { title: 'Recruitment Funnel Conversion Flow', description: 'Detailed funnel metrics from sourcing, technical screen to final offers.', tag: 'FUNNEL' },
      { title: 'Cost-Per-Hire & Agency Allocation List', description: 'Tracks referral payouts, job board advertisements, and external fees.', tag: 'FINANCE' },
      { title: 'Interviewer Score Card & Feedback Matrix', description: 'Average interview scores, timelines, and panel feedback notes.', tag: 'INTERVIEW' }
    ],
    distribution: {
      title: 'Active Recruitment Stages',
      items: [
        { label: 'Sourcing & Resume Screen', value: '45 Candidates', percent: 54, colorClass: 'bg-[#2f66e0]' },
        { label: 'Tech Tests & Panel Rounds', value: '31 Candidates', percent: 37, colorClass: 'bg-emerald-500' },
        { label: 'Offer Issuance & Negotiation', value: '8 Candidates', percent: 9, colorClass: 'bg-indigo-500' }
      ]
    },
    managementBrief: {
      strategicFocus: 'Conversion metrics & sourcing agency expenditure.',
      riskIndex: 'High',
      costImpact: 'High operational spend ($4,200 avg cost-per-hire) on external recruiters.',
      actionableDirectives: [
        'Establish targeted organic hiring campaigns to minimize dependent recruiter commission costs.',
        'Integrate technical screening checkpoints earlier to decrease average panel selection cycle time.',
        'Formulate active internal candidate databases for high-frequency hiring roles to decrease time-to-hire.'
      ]
    }
  },
  'On/Off-boarding': {
    totalRecords: '11 Scheduled transfers',
    lastUpdated: 'Yesterday 14:00',
    autoRun: 'Active (Daily)',
    stats: [
      { label: 'New Joins (This Mo.)', value: '8 Personnel', trend: '100% hardware pre-shipped', positive: true },
      { label: 'Exits Scheduled', value: '3 Accounts', trend: 'Non-disclosure signed', positive: true },
      { label: 'SLA Checklist Pass Rate', value: '98.5%', trend: 'Excellent compliance', positive: true }
    ],
    reports: [
      { title: 'New Hire Ramp-Up Status Booklet', description: 'Activity completion log across training, culture, and security settings.', tag: 'ONBOARDING' },
      { title: 'Consolidated Exit Interview Summary', description: 'Anonymized termination reasons, manager notes, and general comments.', tag: 'OFFBOARDING' },
      { title: 'Interactive Handover Checklist Audit', description: 'Device returns, authorization invalidations, and direct transitions tracker.', tag: 'COMPLIANCE' }
    ],
    distribution: {
      title: 'Tasks Completion By Core Items',
      items: [
        { label: 'Hardware & SSO Configured', value: '11 Completed', percent: 100, colorClass: 'bg-[#2f66e0]' },
        { label: 'Security & Policy Sign-up', value: '10 Completed', percent: 90, colorClass: 'bg-emerald-500' },
        { label: 'First Team Intro Chat', value: '8 Completed', percent: 72, colorClass: 'bg-indigo-500' }
      ]
    },
    managementBrief: {
      strategicFocus: 'Security credentials clearance & asset recovery rates.',
      riskIndex: 'Medium',
      costImpact: 'IT infrastructure setup overhead & unrecovered laptop replacement costs.',
      actionableDirectives: [
        'Mandate all directory and SSO credentials terminate within 2 hours of departure timestamps.',
        'Configure automated notification triggers to verify company laptop recovery within 7 workdays.',
        'Standardize onboarding templates to guarantee key cyber-awareness briefing is cleared on week 1.'
      ]
    }
  },
  Attendance: {
    totalRecords: '3,109 Log records',
    lastUpdated: 'Today 18:00',
    autoRun: 'Active (Daily)',
    stats: [
      { label: 'Attendance Ratio', value: '96.2%', trend: '+0.8% peak improvement', positive: true },
      { label: 'Average Clock-In Time', value: '08:44 AM', trend: 'Stable vs target 09:00', positive: true },
      { label: 'Active Overtime Hours', value: '142.5 hrs', trend: '+12.4% seasonal peak', positive: false }
    ],
    reports: [
      { title: 'Employee Attendance Detail Log', description: 'Exact time recordings, remote IP geolocation info, and day statuses.', tag: 'LOGS' },
      { title: 'Overtime and Shift Premium Register', description: 'Approved overtime pay credits, night shifts, and multiplier schedules.', tag: 'OVERTIME' },
      { title: 'Absence & Late Arrivals Analysis Sheet', description: 'Pinpoints late trends, excuse approvals, and absenteeism benchmarks.', tag: 'ABSENCE' }
    ],
    distribution: {
      title: 'Current Week Check-In Types',
      items: [
        { label: 'On-Time Office Work', value: '112 Staff', percent: 73, colorClass: 'bg-[#2f66e0]' },
        { label: 'Remote / Home Login Checked', value: '34 Staff', percent: 22, colorClass: 'bg-emerald-500' },
        { label: 'Late Clock-in / Grace Period', value: '8 Staff', percent: 5, colorClass: 'bg-indigo-500' }
      ]
    },
    managementBrief: {
      strategicFocus: 'Overtime wage leakages & digital shift punctuality trends.',
      riskIndex: 'Medium',
      costImpact: 'Overtime payroll premium payouts ($14.5k variance above corporate projection).',
      actionableDirectives: [
        'Enforce secondary tier supervisor approvals for overtime work exceeding 10 hours monthly.',
        'Study rotating flex hours for key divisions facing seasonal customer ticket peaks.',
        'In corporate locations, match key card logs against manual portal clock-ins to reduce check-in errors.'
      ]
    }
  },
  Leave: {
    totalRecords: '412 Bookings total',
    lastUpdated: 'Yesterday 17:30',
    autoRun: 'Active (Realtime)',
    stats: [
      { label: 'Active Leaves Today', value: '4 Staff', trend: '-2 versus last Friday', positive: true },
      { label: 'Pending Approvals', value: '9 Requests', trend: 'Average turn: 2.2 hours', positive: true },
      { label: 'Avg Taken Balance', value: '12.4 Days', trend: '6.2 days available left', positive: true }
    ],
    reports: [
      { title: 'Department Wise Absence Schedule', description: 'Comprehensive heat map tracking overlapping holidays and team coverage.', tag: 'COVERAGE' },
      { title: 'Accrued Leave Financial Liability Report', description: 'Calculates unpaid leave payouts, accumulated days, and carried margins.', tag: 'FINANCE' },
      { title: 'Holiday and Sickness Incident Sheet', description: 'Distributes parental, compassionate, annual, and medical leave data.', tag: 'HOLIDAYS' }
    ],
    distribution: {
      title: 'Utilized Leave Categories',
      items: [
        { label: 'Paid Annual Leave', value: '280 Days', percent: 68, colorClass: 'bg-[#2f66e0]' },
        { label: 'Validated Medical Leaves', value: '92 Days', percent: 22, colorClass: 'bg-emerald-500' },
        { label: 'Maternity/Paternity/Other Leaves', value: '40 Days', percent: 10, colorClass: 'bg-indigo-500' }
      ]
    },
    managementBrief: {
      strategicFocus: 'Unfunded book liabilities & year-end resource bottleneck mapping.',
      riskIndex: 'Medium',
      costImpact: 'Accrued annual leave cash payout reserves ($42k aggregate exposure).',
      actionableDirectives: [
        'Guide supervisors to prompt team annual leave bookings before major product deliverables sprints.',
        'Stagger critical tech roles leaves to secure minimum 80% coverage limits in Q4.',
        'Review recurring sick-leave clusters adjacent to weekends to optimize resource coverage plans.'
      ]
    }
  },
  Disciplinary: {
    totalRecords: '18 Case tickets',
    lastUpdated: '12 Jun 10:15',
    autoRun: 'Active (Ad-hoc)',
    stats: [
      { label: 'Active grievances', value: '2 Cases', trend: '1 currently in arbitration', positive: false },
      { label: 'Warning Notices Issued', value: '4 Letters', trend: '0 escalations in last 90d', positive: true },
      { label: 'Resolved Inquiries', value: '12 Closed', trend: 'Mediation rate 94%', positive: true }
    ],
    reports: [
      { title: 'Policy Breach Incident Tracker', description: 'Incidents categorized by severity, department code, and policy chapter.', tag: 'BREACHES' },
      { title: 'Warning Process Progression Ledger', description: 'History of verbal, written warnings, PIP actions, and resolution steps.', tag: 'WARNINGS' },
      { title: 'Grievance Resolution and Conflict Audit', description: 'Tracks mediation timelines, feedback surveys, and arbitration results.', tag: 'MEDIATION' }
    ],
    distribution: {
      title: 'Current Infraction Clusters',
      items: [
        { label: 'Punctuality & Shift Breaches', value: '11 Cases', percent: 61, colorClass: 'bg-[#2f66e0]' },
        { label: 'Safety / Conduct Incidents', value: '5 Cases', percent: 28, colorClass: 'bg-emerald-500' },
        { label: 'Workplace Dispute Inquiries', value: '2 Cases', percent: 11, colorClass: 'bg-indigo-500' }
      ]
    },
    managementBrief: {
      strategicFocus: 'Interpersonal disputes & litigation exposure mitigation.',
      riskIndex: 'High',
      costImpact: 'Extremely high potential direct litigation & external mediation services fees.',
      actionableDirectives: [
        'Mandate formal compliance code-of-conduct e-refresher courses across field managers.',
        'Ensure HR representation is present in PIP (Performance Improvement Plan) reviews to prevent future claims.',
        'Standardize all incident written files in structured secure servers to compile clean evidence trails.'
      ]
    }
  },
  Payroll: {
    totalRecords: '154 Active slip sheets',
    lastUpdated: 'Today 15:45',
    autoRun: 'Active (Monthly)',
    stats: [
      { label: 'Gross Monthly Value', value: '$642,800', trend: '+1.4% change (new hires)', positive: false },
      { label: 'Deductions & Benefits Match', value: '$98,400', trend: 'Tax withholdings optimal', positive: true },
      { label: 'Slip Distribution Accuracy', value: '100% Sent', trend: 'No correction tickets raised', positive: true }
    ],
    reports: [
      { title: 'Global Base Earnings Breakdown', description: 'Wages ledger with base pay, overtime, adjustments, and shift differentials.', tag: 'PAYROLL' },
      { title: 'Withholding Taxes & Social Security Roll', description: 'State, Federal, and municipal taxes, medical premiums, and allocations.', tag: 'TAXES' },
      { title: 'Corporate Cost Center Ledger', description: 'Organizes direct salary expenses by department and custom budget strings.', tag: 'BUDGETS' }
    ],
    distribution: {
      title: 'Company Payroll Allocations',
      items: [
        { label: 'Core Base Salaries', value: '$482,100', percent: 75, colorClass: 'bg-[#2f66e0]' },
        { label: 'Bonus & Overtime Payouts', value: '$96,420', percent: 15, colorClass: 'bg-emerald-500' },
        { label: 'Fringe Taxes & Benefit Matches', value: '$64,280', percent: 10, colorClass: 'bg-indigo-500' }
      ]
    },
    managementBrief: {
      strategicFocus: 'Labor market matching index & scale management cost controls.',
      riskIndex: 'Low',
      costImpact: 'Represents 64% of total company monthly operating expenditure ($642.8k).',
      actionableDirectives: [
        'Run localized compensation reviews against competitor job listings to pre-empt top-performer attrition.',
        'Verify withholding formulas with external general tax guidelines prior to Q3 adjustments.',
        'Enforce dual-authorization triggers on manual off-cycle wage releases to eliminate payment errors.'
      ]
    }
  },
  Claims: {
    totalRecords: '412 Processed expense lines',
    lastUpdated: 'Today 11:20',
    autoRun: 'Active (Daily)',
    stats: [
      { label: 'Pending Claim Funds', value: '$4,120 USD', trend: '8 claims waiting manager sign', positive: true },
      { label: 'Total Retained Claims', value: '$14,520 USD', trend: 'Approved this billing cycle', positive: true },
      { label: 'Avg Payout Cycle Time', value: '3.4 Days', trend: '-1.1 days faster resolution', positive: true }
    ],
    reports: [
      { title: 'Travel and Operational Mileage Log', description: 'Travel ticket receipts, hotel stays, conference seats, and mileage logs.', tag: 'TRAVEL' },
      { title: 'Reimbursements and Operational Bills', description: 'Hardware items, client hosting business meals, and office supplies.', tag: 'OPERATIONS' },
      { title: 'Audited Claim Deviations & Flags', description: 'Lists policy violation attempts, unverified items, or warning flags.', tag: 'AUDITING' }
    ],
    distribution: {
      title: 'Current Claim Categories',
      items: [
        { label: 'Sourced Travel & Logistics', value: '$7,260', percent: 50, colorClass: 'bg-[#2f66e0]' },
        { label: 'Business Client Entertainment', value: '$4,356', percent: 30, colorClass: 'bg-emerald-500' },
        { label: 'Office Supplies & Miscellaneous', value: '$2,904', percent: 20, colorClass: 'bg-indigo-500' }
      ]
    },
    managementBrief: {
      strategicFocus: 'Operational spending compliance audits & expense policy enforcement.',
      riskIndex: 'Medium',
      costImpact: 'High client entertainment spend ratio (30% of total outbound claims).',
      actionableDirectives: [
        'Set strict caps on business dining hospitality allowances based on localized regional indexes.',
        'Audit mileage claims with coordinate validation checks to prevent inaccurate expense declarations.',
        'Establish standard 30-day deadlines for receipt submissions to ensure accurate operational balance tallies.'
      ]
    }
  },
  Benefits: {
    totalRecords: '382 Allocation policies',
    lastUpdated: 'Today 10:11',
    autoRun: 'Active (Daily)',
    stats: [
      { label: 'Benefit Users Registered', value: '142 Staff', trend: '92% overall selection rate', positive: true },
      { label: 'Wellness Grant Used', value: '71% Used', trend: 'Budget remaining: $12k', positive: true },
      { label: 'Total Benefits Cost', value: '$34,100 Mo.', trend: '+0.4% from last quarter', positive: true }
    ],
    reports: [
      { title: 'Insurance Premium Distribution Audit', description: 'PPO, HMO selections, premiums paid, and active dependents tracker.', tag: 'INSURANCE' },
      { title: 'Wellness Grant Usage Registry', description: 'Reimbursables for athletic equipment, coaching, gyms and lifestyle.', tag: 'WELLNESS' },
      { title: 'Pension Matching Fund Report', description: 'Employer contributions, match percentages, and aggregate retirement assets.', tag: 'PENSION' }
    ],
    distribution: {
      title: 'Benefit Choices Selected',
      items: [
        { label: 'Standard Medical & Premium PPO', value: '85 Employees', percent: 60, colorClass: 'bg-[#2f66e0]' },
        { label: 'Flexible Wellness Credits', value: '43 Employees', percent: 30, colorClass: 'bg-emerald-55' },
        { label: 'Dental & Vision Supplemental Only', value: '14 Employees', percent: 10, colorClass: 'bg-indigo-500' }
      ]
    },
    managementBrief: {
      strategicFocus: 'Benefit program selection yields & medical premium allocations.',
      riskIndex: 'Low',
      costImpact: 'Average flat cost matching totals $34.1k/mo healthcare premium expenses.',
      actionableDirectives: [
        'Renegotiate wholesale medical plans by leveraging larger group scales in Q3 vendor negotiations.',
        'Promote gym wellness credits usage to lower long-term chronic clinical claims and sick leave frequency.',
        'Benchmark company pension standard brackets with localized peers to maintain competitive hiring terms.'
      ]
    }
  },
  'Helpdesk & Inquiries': {
    totalRecords: '118 Customer support tickets',
    lastUpdated: 'Just now',
    autoRun: 'Active (Realtime)',
    stats: [
      { label: 'Open Inquiries', value: '5 Tickets', trend: '1 designated urgent priority', positive: true },
      { label: 'Avg Resolution Time', value: '1.2 Hours', trend: '-25 minutes since upgrades', positive: true },
      { label: 'Logged SLA Compliance', value: '98.4%', trend: 'Goal metric benchmark list: 95%', positive: true }
    ],
    reports: [
      { title: 'Support Ticket SLA Performance', description: 'Tracks reaction logs, manager triggers, and resolution periods.', tag: 'SLA' },
      { title: 'Top Inquiries Theme Analysis', description: 'Categorized queries highlighting system outages, payroll errors, or leaves.', tag: 'THEMES' },
      { title: 'Staff CSAT Satisfaction Record', description: 'Anonymized agent scores, thank-you messages, and response feedback.', tag: 'CSAT' }
    ],
    distribution: {
      title: 'Current Tickets by Topic',
      items: [
        { label: 'Admin Portal & Tech Support', value: '100 Completed', percent: 85, colorClass: 'bg-[#2f66e0]' },
        { label: 'Correction of Payroll Info', value: '14 Completed', percent: 12, colorClass: 'bg-emerald-55' },
        { label: 'Leave Policy Inquiries', value: '4 Completed', percent: 3, colorClass: 'bg-indigo-500' }
      ]
    },
    managementBrief: {
      strategicFocus: 'Administrative bottle-necks & internal satisfaction SLA checks.',
      riskIndex: 'Low',
      costImpact: 'SLA lags reduce corporate work productivity and onboarding satisfaction scores.',
      actionableDirectives: [
        'Release self-service answers for high-frequency topics like overtime and benefits coverage.',
        'Address recurring login portal and SSO issues with IT to reduce redundant support load.',
        'Maintain the response speed under the 1.5-hour threshold to preserve excellent 98.4% CSAT ratios.'
      ]
    }
  },
  Performance: {
    totalRecords: '154 Active appraisals',
    lastUpdated: '18 Jun 11:30',
    autoRun: 'Active (Quarterly)',
    stats: [
      { label: 'Average Corporate Rating', value: '4.2 / 5.0', trend: 'High performance metrics overall', positive: true },
      { label: 'Target KPI Achievement', value: '88.5% Done', trend: '+1.5% since review period', positive: true },
      { label: 'Evaluation Complete Ratio', value: '100% Score', trend: 'Perfect manager feedback logs', positive: true }
    ],
    reports: [
      { title: 'Annual Appraisal Level Sheet', description: 'Final rating distributions, review notes, and performance bands.', tag: 'APPRAISAL' },
      { title: 'Key Performance Indicators Ledger', description: 'Metric results, targeted goals, and percentage achievements by team.', tag: 'KPIS' },
      { title: 'Top Talent Promotion Forecast Model', description: 'Potential successors index representing leadership suitability scores.', tag: 'SUCCESSION' }
    ],
    distribution: {
      title: 'Review Grade Distributions',
      items: [
        { label: 'Exceeds Performance Target', value: '46 Staff', percent: 30, colorClass: 'bg-[#2f66e0]' },
        { label: 'Solidly Achieved Base Targets', value: '92 Staff', percent: 60, colorClass: 'bg-emerald-500' },
        { label: 'Development / PIP Category', value: '16 Staff', percent: 10, colorClass: 'bg-indigo-500' }
      ]
    },
    managementBrief: {
      strategicFocus: 'Alignment of individual key results with board objectives & merit distribution.',
      riskIndex: 'Medium',
      costImpact: 'Directly influences key performance bonus matches ($96k variable payout pools).',
      actionableDirectives: [
        'Rebalance grading scales across departments to eliminate grade inflation by lenient managers.',
        'Establish direct succession paths mapping high-performing staff to critical leadership gaps.',
        'Review development milestones for the 10% PIP cluster to ensure equitable training access.'
      ]
    }
  },
  Engagement: {
    totalRecords: '612 Survey entries',
    lastUpdated: '15 Jun 17:00',
    autoRun: 'Active (Monthly)',
    stats: [
      { label: 'Overall Engagement Index', value: '84%', trend: 'Top tier index level', positive: true },
      { label: 'Survey Response Rate', value: '92.4%', trend: '+3.2% high confidence level', positive: true },
      { label: 'Anonymized Open Cards', value: '48 Messages', trend: 'Action items dispatched to staff', positive: true }
    ],
    reports: [
      { title: 'Overall Pulse Survey Breakdown', description: 'Category ratings for environment, peers, management, and training.', tag: 'PULSE' },
      { title: 'Anonymized Sentiment Word Analysis', description: 'Categorized suggestions focusing on benefits, physical office, or software.', tag: 'SENTIMENT' },
      { title: 'Retention Risk Early Warning Roll', description: 'Identifies departments with high levels of workplace dissatisfaction.', tag: 'RETENTION' }
    ],
    distribution: {
      title: 'Drivers of Corporate Engagement',
      items: [
        { label: 'Culture & Workspace Flexibility', value: 'Average 4.6 / 5', percent: 92, colorClass: 'bg-[#2f66e0]' },
        { label: 'Leadership Vision & Strategy', value: 'Average 4.2 / 5', percent: 84, colorClass: 'bg-emerald-55' },
        { label: 'Career Growth Opportunities', value: 'Average 3.9 / 5', percent: 78, colorClass: 'bg-indigo-500' }
      ]
    },
    managementBrief: {
      strategicFocus: 'Workforce sentiment indicators & mitigation of key resignation risks.',
      riskIndex: 'Medium',
      costImpact: 'Pre-emptive engagement checks prevent costly localized talent walkouts.',
      actionableDirectives: [
        'Schedule priority team discussions for business units reporting flexibility scores below 75%.',
        'Send standard executive answers addressing common trends raised in open suggestions.',
        'Map engagement trends against attrition data to track direct managerial health patterns.'
      ]
    }
  },
  Training: {
    totalRecords: '38 Active schedules',
    lastUpdated: 'Today 13:00',
    autoRun: 'Active (Daily)',
    stats: [
      { label: 'Coaching Sessions Scheduled', value: '4 Programs', trend: '2 occurring this current week', positive: true },
      { label: 'Active Enrolled Users', value: '54 Employees', trend: '+14 new joins enrolled', positive: true },
      { label: 'Schedule Completion Rate', value: '94.2%', trend: 'Minimal cancellation rates', positive: true }
    ],
    reports: [
      { title: 'Safety and Regulatory Attendance List', description: 'Shows completed courses required for company compliance guidelines.', tag: 'COMPLIANCE' },
      { title: 'Workforce Core Skills Gap Analysis', description: 'Tracks missing skills, requested themes, and available coach hours.', tag: 'SKILLS' },
      { title: 'Training Budget and Vendor Invoices', description: 'Invoices for instructors, classroom rentals, and purchased logs.', tag: 'BUDGETS' }
    ],
    distribution: {
      title: 'Active Program Formats',
      items: [
        { label: 'In-person Practical Labs', value: '19 Sessions', percent: 50, colorClass: 'bg-[#2f66e0]' },
        { label: 'Self-Paced Training Videos', value: '11 Sessions', percent: 30, colorClass: 'bg-emerald-500' },
        { label: 'Expert Panel Webinars', value: '8 Sessions', percent: 20, colorClass: 'bg-indigo-500' }
      ]
    },
    managementBrief: {
      strategicFocus: 'Skills catalog expansions & vendor expenditure checks.',
      riskIndex: 'Low',
      costImpact: 'External specialized tutors and training facility booking fees.',
      actionableDirectives: [
        'Convert costly custom external seminars into reusable on-demand digital modules inside the LMS.',
        'Implement standard seat verification procedures to reduce pay-per-head empty-seat fees.',
        'Link certification milestones to standard division-level performance review systems.'
      ]
    }
  },
  Learning: {
    totalRecords: '211 Certification logs',
    lastUpdated: '14 Jun 09:30',
    autoRun: 'Active (Daily)',
    stats: [
      { label: 'Core Course Materials', value: '12 Curriculums', trend: '2 updated this month', positive: true },
      { label: 'Total LMS Engagement', value: '412 Hours', trend: 'Average 2.6 hours per employee', positive: true },
      { label: 'Certifications Issued', value: '22 Badges', trend: 'High compliance certification rate', positive: true }
    ],
    reports: [
      { title: 'Compliance Completions Progress Ledger', description: 'Lists employees who have cleared ethical and secure code updates.', tag: 'COMPLIANCE' },
      { title: 'User LMS Hours & Activity Sheets', description: 'Tracks video minutes, quiz counts, and lessons completed.', tag: 'ACTIVITY' },
      { title: 'Certification Expiration Warning List', description: 'Signals certificates expiring within the next sixty days.', tag: 'EXPIRY' }
    ],
    distribution: {
      title: 'Current Course Theme Allocations',
      items: [
        { label: 'Engineering and Technical Tracks', value: '106 Completed', percent: 50, colorClass: 'bg-[#2f66e0]' },
        { label: 'Manager Leadership Program', value: '63 Completed', percent: 30, colorClass: 'bg-emerald-500' },
        { label: 'Ethical Workplace Regulations', value: '42 Completed', percent: 20, colorClass: 'bg-indigo-500' }
      ]
    },
    managementBrief: {
      strategicFocus: 'Corporate regulatory compliance checks & critical skill matrices.',
      riskIndex: 'Low',
      costImpact: 'Mitigates regulatory fine exposures for non-compliant industry deployments.',
      actionableDirectives: [
        'Deliver automatic system alerts for staff whose regulatory security clearances expire soon.',
        'Examine learning engagement scores to find effective, popular internal curriculum creators.',
        'Enforce ethical workplace learning completions as a required hurdle for annual bonus eligibility.'
      ]
    }
  },
  Assets: {
    totalRecords: '184 Company hardware logs',
    lastUpdated: '11 Jun 16:30',
    autoRun: 'Active (Daily)',
    stats: [
      { label: 'Laptops in Service', value: '144 Units', trend: '100% active and tracked', positive: true },
      { label: 'Hardware Stock Remaining', value: '20 Units', trend: 'Re-order point target: 10', positive: true },
      { label: 'Repair & RMA Tickets', value: '4 Tickets', trend: 'Average swap period: 24h', positive: true }
    ],
    reports: [
      { title: 'Master Hardware Assigned Ledger', description: 'Exact serial numbers, staff custodian records, and purchase values.', tag: 'HARDWARE' },
      { title: 'Software Licenses and Accrued Keys', description: 'Tracks registered SaaS seats, expired logins, and pricing packages.', tag: 'SOFTWARE' },
      { title: 'Asset Depreciation Schedule Report', description: 'Establishes remaining book values and estimated replacement dates.', tag: 'FINANCE' }
    ],
    distribution: {
      title: 'Registered Hardware Split',
      items: [
        { label: 'Developer Laptops (Core OS)', value: '110 Units', percent: 60, colorClass: 'bg-[#2f66e0]' },
        { label: 'Office Desktop Terminals', value: '55 Units', percent: 30, colorClass: 'bg-emerald-500' },
        { label: 'Infrastructure Accessories', value: '19 Units', percent: 10, colorClass: 'bg-indigo-500' }
      ]
    },
    managementBrief: {
      strategicFocus: 'Capital hardware lifecycle tracking & unused SaaS subscription retrieval.',
      riskIndex: 'Medium',
      costImpact: 'Active laptop shrinkage and idle tooling licenses expenditures ($184k value).',
      actionableDirectives: [
        'Automate license key reclamation for high-tier apps (such as Figma or Salesforce) with 45+ days of inactivity.',
        'Repurpose three-year-old laptops into secondary dev-test terminals to avoid immediate replacement buys.',
        'Consolidate equipment inventory entries from branch offices to check for regional surplus devices.'
      ]
    }
  }
};

export function ReportsTab({ employees, activeSubTab, setActiveSubTab }: ReportsTabProps) {
  const addToast = (text: string, type?: 'success' | 'loading' | 'error' | 'info') => {
    showActionToast(text, type)
  }

  // Navigation State
  const [localActiveSidebarTab, setLocalActiveSidebarTab] = useState<'centre' | 'scheduled' | 'builder'>('centre');
  const activeSidebarTab = activeSubTab !== undefined ? activeSubTab : localActiveSidebarTab;
  const setActiveSidebarTab = setActiveSubTab !== undefined ? setActiveSubTab : setLocalActiveSidebarTab;
  const [selectedModule, setSelectedModule] = useState<string>('All Overview');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [moduleSearch, setModuleSearch] = useState<string>('');

  // Stats Counters
  const [totalCustomSaved, setTotalCustomSaved] = useState<number>(7);

  // Scheduled Reports List State
  const [schedules, setSchedules] = useState<ReportSchedule[]>([
    {
      id: 'sch-1',
      name: 'Monthly payroll summary',
      frequency: 'Monthly',
      nextRun: '1 Jun 06:00',
      type: 'Monthly payroll summary',
      format: 'Excel (.xlsx)',
      time: '06:00 AM',
      recipients: 'hr@novora.com, cfo@novora.com'
    },
    {
      id: 'sch-2',
      name: 'Attendance summary',
      frequency: 'Monthly',
      nextRun: '1 Jun 06:00',
      type: 'Attendance summary — Apr',
      format: 'Excel (.xlsx)',
      time: '06:00 AM',
      recipients: 'hr@novora.com, cfo@novora.com'
    },
    {
      id: 'sch-3',
      name: 'Leave balance report',
      frequency: 'Monthly',
      nextRun: '1 Jun 06:00',
      type: 'Leave balance summary',
      format: 'Excel (.xlsx)',
      time: '06:00 AM',
      recipients: 'hr@novora.com, cfo@novora.com'
    }
  ]);

  // Scheduled Report Editor State
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  const [scheduleForm, setScheduleForm] = useState({
    type: 'Monthly payroll summary',
    frequency: 'Monthly',
    time: '06:00 AM',
    format: 'Excel (.xlsx)',
    recipients: 'hr@novora.com, cfo@novora.com'
  });

  // Recent Action Activity Stack
  const [recentActivities, setRecentActivities] = useState([
    { id: 'act-1', name: 'Monthly payroll summary', user: 'HR Admin', timestamp: '6 May 10:30', success: true },
    { id: 'act-2', name: 'Leave balance report', user: 'Auto-scheduled', timestamp: '1 May 06:00', success: true },
    { id: 'act-3', name: 'Attendance summary — Apr', user: 'Nina Reza', timestamp: '30 Apr 18:00', success: true }
  ]);

  // Custom Builder Form Configuration State
  const [builderModule, setBuilderModule] = useState<string>('Employee management');
  const [builderCombine, setBuilderCombine] = useState({
    attendance: true,
    leave: false,
    payroll: false,
    performance: false
  });

  // Dynamically populated checklist depending on primary module
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>({
    'Employee No.': true,
    'Full Name': true,
    'Department': true,
    'Position': true,
    'Employment Type': false,
    'Status': false
  });

  const [filterFromDate, setFilterFromDate] = useState('2026-01-01');
  const [filterToDate, setFilterToDate] = useState('2026-05-31');
  const [filterDept, setFilterDept] = useState('All departments');
  const [filterStatus, setFilterStatus] = useState('Active only');
  const [sortBy, setSortBy] = useState('Employee No.');
  const [builderFormat, setBuilderFormat] = useState('Excel (.xlsx)');

  // Module filter options

  // Helper trigger action on form change when builderModule swaps
  const handleBuilderModuleChange = (newModule: string) => {
    setBuilderModule(newModule);
    if (newModule.toLowerCase().includes('employee')) {
      setSelectedFields({
        'Employee No.': true,
        'Full Name': true,
        'Department': true,
        'Position': true,
        'Join Date': false,
        'NRIC Pass': false
      });
    } else if (newModule.toLowerCase().includes('attendance')) {
      setSelectedFields({
        'Staff ID': true,
        'Clock-in Time': true,
        'Clock-out Time': true,
        'Overtime Hours': true,
        'Absence Days': false,
        'Grace Deviation': false
      });
    } else if (newModule.toLowerCase().includes('leave')) {
      setSelectedFields({
        'Staff No.': true,
        'Employee Name': true,
        'Leaves Entitled': true,
        'Leaves Taken': true,
        'Unpaid Leaves': false,
        'Pending Requests': false
      });
    } else if (newModule.toLowerCase().includes('payroll')) {
      setSelectedFields({
        'Employee No.': true,
        'Basic Salary': true,
        'Allowances': true,
        'Employee Provident Fund': true,
        'Deductions': false,
        'Net Salary Pay': true
      });
    } else if (newModule.toLowerCase().includes('performance')) {
      setSelectedFields({
        'Staff Name': true,
        'KPI Completion %': true,
        'Appraisal Score': true,
        'Rating Category': true,
        'Evaluator Agent': false,
        'Development Gap': false
      });
    } else {
      setSelectedFields({
        'Record ID': true,
        'Staff Candidate': true,
        'Module Metrics': true,
        'Status Flag': true,
        'Audited Version': false
      });
    }
  };

  // Trigger download actions
  const triggerDownloadLog = (reportName: string) => {
    addToast(`Compiling server-side dataset for: ${reportName}...`, 'loading');
    setTimeout(() => {
      // 1. Build actual file content based on reportName and selectedModule
      let fileContent = '';
      let fileType = 'text/csv;charset=utf-8;';
      let fileNameExtension = '.csv';

      const isPdfReport = reportName.toLowerCase().includes('pdf') || reportName.toLowerCase().includes('booklet') || reportName.toLowerCase().includes('summary report') || reportName.toLowerCase().includes('trend outlook');

      if (isPdfReport) {
        fileType = 'text/plain;charset=utf-8;';
        fileNameExtension = '.txt'; // Download a beautifully formatted management briefing text file

        // Generate high-grade management board-level report markup
        fileContent = `========================================================================
NOVORA ENTERPRISES - EXECUTIVE BRIEFING & STRATEGIC BOARD REPORT
Generated: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString()}
Classification: CONFIDENTIAL & HIGHLY SENSITIVE - MANAGEMENT LEVEL
Scope: Consolidated Operational Ledger & Department Analyses
========================================================================

1. Q2 EXECUTIVE SUMMARY DESK
------------------------------------------------------------------------
Compliance & Management Index: 94.8% (EXCELLENT STATUS)
Current Workforce Capacity: ${employees.length} Active Personnel Profiles
Audit Evaluation: Standardized corporate alignment across all divisions.
Risk Assessment: Low to Medium (Key operational targets resolved)

Strategic Health Overview:
The organization maintains structural integrity across all performance criteria,
recruitment cycles, and fiscal expenditure pipelines. Turnover variance is
strictly contained, and departmental resource yields match standard project boundaries.

------------------------------------------------------------------------
2. DIVISION PARTICIPATION BREAKDOWN
------------------------------------------------------------------------
Total Active Employees: ${employees.length}

Department Breakdown:`;

        const depts = ['Engineering', 'Operations', 'Finance', 'HR', 'Marketing'];
        depts.forEach(dept => {
          const count = employees.filter(e => e.department === dept).length;
          const percent = Math.round((count / employees.length) * 100) || 0;
          fileContent += `\n  - ${dept} Division: ${count} Members (${percent}% of total)`;
        });

        fileContent += `\n\n------------------------------------------------------------------------\n3. ACTIVE MANAGEMENT INTERFACE - MODULE METRICS & ACTIONABLE DIRECTIVES\n------------------------------------------------------------------------\nBelow are strategic briefing summaries and risk mitigation directives for \noperational modules currently tracked by Novora core HR platform:\n`;

        Object.keys(MODULE_REPORTS_DATA).forEach((mod) => {
          const brief = MODULE_REPORTS_DATA[mod];
          if (brief && brief.managementBrief) {
            fileContent += `\n[${mod.toUpperCase()}]
- Strategic Focus: ${brief.managementBrief.strategicFocus}
- Safety/Risk Index: ${brief.managementBrief.riskIndex}
- Financial Impact: ${brief.managementBrief.costImpact}
- Immediate Board Directives:
${brief.managementBrief.actionableDirectives.map((d, idx) => `  ${idx + 1}. ${d}`).join('\n')}
------------------------------------------------------------------------`;
          }
        });

        fileContent += `\n\n========================================================================\nEND OF BRIEFING - CONFIDENTIAL NOVORA MANAGEMENT RECORD\nAuthorized Signature: NOVORA OPERATIONS BOARD\n========================================================================`;
      } else {
        // Generate CSV file content
        const lowerName = reportName.toLowerCase();
        let headers: string[] = [];
        let rows: string[][] = [];

        if (lowerName.includes('payroll') || selectedModule === 'Payroll') {
          headers = ['Employee ID', 'Name', 'Department', 'Position', 'Join Date', 'Base Salary ($)', 'Allowances ($)', 'Tax Deductions ($)', 'Net Take-Home Pay ($)'];
          rows = employees.map(emp => {
            const numId = parseInt(emp.id.replace(/\D/g, '')) || 100;
            const base = 4000 + (numId % 10) * 500;
            const allowance = 250 + (numId % 5) * 100;
            const deduction = Math.round(base * 0.12);
            const net = base + allowance - deduction;
            return [
              emp.id,
              emp.name,
              emp.department,
              emp.position,
              emp.joinDate,
              String(base),
              String(allowance),
              String(deduction),
              String(net)
            ];
          });
        } else if (lowerName.includes('attendance') || selectedModule === 'Attendance') {
          headers = ['Employee ID', 'Name', 'Department', 'Position', 'Check-In Date', 'Assigned Work Shift', 'Status', 'Overtime Hours Worked'];
          rows = employees.map(emp => {
            const numId = parseInt(emp.id.replace(/\D/g, '')) || 100;
            const ot = (numId % 3 === 0) ? (numId % 6) : 0;
            const status = (numId % 11 === 0) ? 'Late Clock-in' : (numId % 20 === 0 ? 'On Leave' : 'On-Time Office');
            return [
              emp.id,
              emp.name,
              emp.department,
              emp.position,
              '2026-06-19',
              '09:00 - 18:00 (Standard Desk)',
              status,
              String(ot)
            ];
          });
        } else if (lowerName.includes('leave') || selectedModule === 'Leave') {
          headers = ['Employee ID', 'Name', 'Department', 'Position', 'Annual Allowance (Days)', 'Sick Leave Balance', 'Approved Leaves Taken', 'Pending Review'];
          rows = employees.map(emp => {
            const numId = parseInt(emp.id.replace(/\D/g, '')) || 100;
            const taken = 2 + (numId % 12);
            const accum = 20;
            return [
              emp.id,
              emp.name,
              emp.department,
              emp.position,
              String(accum),
              '14 Days Available',
              String(taken),
              (numId % 7 === 0) ? '1 Day (Medical)' : 'None'
            ];
          });
        } else if (lowerName.includes('performance') || selectedModule === 'Performance') {
          headers = ['Employee ID', 'Name', 'Department', 'Position', 'KPI Target Completion %', 'Evaluation Average', 'Manager Assessment Category', 'Last Review Date'];
          rows = employees.map(emp => {
            const numId = parseInt(emp.id.replace(/\D/g, '')) || 100;
            const kpi = 70 + (numId % 31);
            const score = (5.5 + (numId % 5) * 1.1).toFixed(1);
            const category = kpi >= 95 ? 'Exceeds High Targets' : (kpi >= 80 ? 'Solid Core Achieved' : 'Development Pipeline (PIP)');
            return [
              emp.id,
              emp.name,
              emp.department,
              emp.position,
              `${kpi}%`,
              `${score} / 10`,
              category,
              '2026-05-15'
            ];
          });
        } else if (lowerName.includes('asset') || selectedModule === 'Assets') {
          headers = ['Hardware Serial Code', 'Assigned Staff Custodian', 'Department', 'Item Description', 'Asset Category', 'SaaS Licensing', 'Approx. Value ($)', 'Deployment Status'];
          rows = employees.map((emp, i) => {
            const numId = parseInt(emp.id.replace(/\D/g, '')) || 100;
            const deviceType = (numId % 3 === 0) ? 'MacBook Pro M3 Max' : ((numId % 3 === 1) ? 'Dell Latitude 7440' : 'Lenovo ThinkPad T14');
            const assetCategory = 'Client Endpoint Hardware';
            const cost = (numId % 3 === 0) ? '3200' : '1850';
            const serial = `SN-NV-${10000 + numId}-${i}`;
            return [
              serial,
              emp.name,
              emp.department,
              deviceType,
              assetCategory,
              'Enterprise Managed',
              cost,
              emp.status === 'Active' ? 'In Use' : 'Stored'
            ];
          });
        } else if (lowerName.includes('recruitment') || selectedModule === 'Recruitment') {
          headers = ['Candidate Profile ID', 'Applicant Name', 'Selected Division', 'Job Designation', 'Core Sourcing Channel', 'Panel Score', 'Current Progress Phase'];
          const channels = ['LinkedIn Premium Sourcing', 'Direct Organic Application', 'External Specialized Agency', 'Internal Referrals Network'];
          const stages = ['Final Interview Round', 'Case Assessment Check', 'Offer Issuance & Review', 'Screening Review Queue'];
          rows = employees.map((emp, i) => {
            const numId = parseInt(emp.id.replace(/\D/g, '')) || 100;
            const candName = `Candidate ${emp.name.split(' ')[0]} ${String.fromCharCode(65 + (i % 26))}.`;
            return [
              `CAND-912${i}`,
              candName,
              emp.department,
              emp.position,
              channels[numId % channels.length],
              `${7.5 + (numId % 3) * 0.8} / 10`,
              stages[numId % stages.length]
            ];
          });
        } else if (lowerName.includes('on/off') || selectedModule === 'On/Off-boarding') {
          headers = ['Staff Profile ID', 'Designated Employee', 'Department', 'Position', 'IT Provision Status', 'ID Tag Verification', 'Access Status', 'Checkpoint Progress'];
          rows = employees.map((emp) => {
            const numId = parseInt(emp.id.replace(/\D/g, '')) || 100;
            return [
              emp.id,
              emp.name,
              emp.department,
              emp.position,
              (numId % 2 === 0) ? 'Clear (SSO Activated)' : 'Pending Device Ship',
              'Verified Profile',
              (numId % 7 === 0) ? 'Exit / Revoked Transmit' : 'Onboard Completed',
              (numId % 5 === 0) ? '90% Completed' : '100% Fully Cleared'
            ];
          });
        } else if (lowerName.includes('claim') || selectedModule === 'Claims') {
          headers = ['Expense Receipt Code', 'Submitting Employee', 'Department', 'Expense Statement Title', 'Incurred Amount ($)', 'Validated Date', 'Status Flag'];
          const statements = ['Regional Client Dinner Networking', 'SaaS Operational Subscriptions', 'Branch Office Supplies Refill', 'Travel Mileage Allowance'];
          rows = employees.map((emp, i) => {
            const numId = parseInt(emp.id.replace(/\D/g, '')) || 100;
            const amt = 45 + (numId % 15) * 45;
            return [
              `EXP-NV-${3000 + i}`,
              emp.name,
              emp.department,
              statements[numId % statements.length],
              String(amt),
              '2026-06-15',
              (numId % 9 === 0) ? 'Pending Audit Approval' : 'Fully Disbursed'
            ];
          });
        } else if (lowerName.includes('disciplinary') || selectedModule === 'Disciplinary') {
          headers = ['Case ID', 'Employee Name', 'Department', 'Infraction Subtype', 'Grievance Description', 'Date Reported', 'Action Taken', 'Current Status'];
          const infractions = ['Unexcused Absence Streak', 'Corporate Conduct Incident', 'Information Policy Violation', 'SLA Target Overage'];
          const statuses = ['Active Inquiry', 'Written Warning Issued', 'Resolved / Mentorship Assigned', 'Escalated to HR Board'];
          rows = employees.map((emp, i) => {
            const numId = parseInt(emp.id.replace(/\D/g, '')) || 100;
            return [
              `DISC-NV-${5000 + i}`,
              emp.name,
              emp.department,
              infractions[numId % infractions.length],
              'Detailed compliance reviews initiated by HOD.',
              '2026-06-10',
              (numId % 4 === 0) ? 'Suspension Checklist' : 'Counselling Milestone',
              statuses[numId % statuses.length]
            ];
          });
        } else if (lowerName.includes('benefit') || selectedModule === 'Benefits') {
          headers = ['Employee ID', 'Name', 'Department', 'Benefits Plan Selected', 'Coverage Category', 'Premium Reimbursement ($)', 'Flexible Points Earned', 'Enrollment Status'];
          const plans = ['Platinum Medical & Dental', 'Global Health & Wellness Plus', 'Base Executive Medical Care', 'Ad-hoc Family Shield'];
          rows = employees.map((emp) => {
            const numId = parseInt(emp.id.replace(/\D/g, '')) || 100;
            const pts = 1200 + (numId % 9) * 150;
            const prem = 250 + (numId % 4) * 80;
            return [
              emp.id,
              emp.name,
              emp.department,
              plans[numId % plans.length],
              'Comprehensive Enterprise Umbrella',
              String(prem),
              String(pts),
              (numId % 8 === 0) ? 'Pending Document Verification' : 'Officially Enrolled'
            ];
          });
        } else if (lowerName.includes('helpdesk') || lowerName.includes('inquir') || selectedModule === 'Helpdesk & Inquiries' || selectedModule === 'Helpdesk') {
          headers = ['Ticket ID', 'Requestor Name', 'Department', 'Inquiry Classification', 'SLA Response Time (Hours)', 'Resolution Status', 'Satisfactory Rating (1-5)'];
          const classes = ['Salary Dispute Verification', 'EP Pass Renewal Assistance', 'Flexible Benefit Claim Reject', 'Health Portal Account Lock'];
          rows = employees.map((emp, i) => {
            const numId = parseInt(emp.id.replace(/\D/g, '')) || 100;
            return [
              `REQ-TKT-${1000 + i}`,
              emp.name,
              emp.department,
              classes[numId % classes.length],
              String(1 + (numId % 4) * 2),
              (numId % 3 === 0) ? 'In Review Queue' : 'Resolved & Closed',
              String(4 + (numId % 2))
            ];
          });
        } else if (lowerName.includes('engage') || selectedModule === 'Engagement') {
          headers = ['Survey ID', 'Team Division', 'Engagement Score (1-5)', 'Work-Life Balance Key', 'Primary Sentiment Pillar', 'Anonymized Suggestions Quote'];
          const sentiments = ['Optimistic of Q3 Strategy', 'Desires More Remote Days', 'Pleased with Learning Budgets', 'Asks for Workstation Upgrades'];
          rows = employees.map((emp, i) => {
            const numId = parseInt(emp.id.replace(/\D/g, '')) || 100;
            const score = (3.8 + (numId % 13) * 0.1).toFixed(1);
            return [
              `SURV-${200 + i}`,
              emp.department,
              score,
              (numId % 2 === 0) ? 'Highly Balanced (Flexible)' : 'Slight Work Overload',
              sentiments[numId % sentiments.length],
              'We should retain collaborative workspace sessions once a week while preserving offline focuses.'
            ];
          });
        } else if (lowerName.includes('train') || selectedModule === 'Training') {
          headers = ['Employee ID', 'Name', 'Department', 'Enrolled Program', 'Education Format', 'Scheduled Date', 'Progress Status'];
          const courses = ['Executive Leadership Core Mastery', 'Information Security Policy 2026', 'Conflict Mitigation & HR Guidelines', 'Vite & TS Fullstack Development'];
          rows = employees.map((emp) => {
            const numId = parseInt(emp.id.replace(/\D/g, '')) || 100;
            return [
              emp.id,
              emp.name,
              emp.department,
              courses[numId % courses.length],
              (numId % 2 === 0) ? 'Self-Paced LMS Video' : 'HQ Interactive Seminar',
              '2026-07-01',
              (numId % 3 === 0) ? '50% Halfway Completed' : '100% Fully Completed & Audited'
            ];
          });
        } else if (lowerName.includes('learn') || selectedModule === 'Learning') {
          headers = ['Employee ID', 'Name', 'Department', 'SaaS Certificate Course', 'Assigned Priority', 'Modules Completed Count', 'Status Validity'];
          const certifications = ['AWS DevOps Solutions Architect', 'HRCI Senior Professional (SPHR)', 'Scrum Master Agile Operations', 'ISO9001 ISO Auditing'];
          rows = employees.map((emp) => {
            const numId = parseInt(emp.id.replace(/\D/g, '')) || 100;
            return [
              emp.id,
              emp.name,
              emp.department,
              certifications[numId % certifications.length],
              (numId % 3 === 0) ? 'Critical Priority' : 'Elective / Optional Support',
              `${numId % 5} of 5 modules`,
              'Valid and Audited Program'
            ];
          });
        } else {
          // General Consolidated Ledger or raw database tables
          headers = ['Employee ID', 'Name', 'Department', 'Position', 'Employment Status', 'Status', 'Join Date', 'NRIC/Passport', 'Mobile Number', 'Company Email', 'Home Address', 'Emergency Call'];
          rows = employees.map(emp => [
            emp.id,
            emp.name,
            emp.department,
            emp.position,
            emp.employmentStatus,
            emp.status,
            emp.joinDate,
            emp.nric,
            emp.mobile,
            emp.email,
            emp.address.replace(/,/g, ' '),
            emp.emergencyContact
          ]);
        }

        // Build elegant CSV formatted block
        const csvRows = [
          headers.join(','),
          ...rows.map(row => row.map(val => `"${(val || '').replace(/"/g, '""')}"`).join(','))
        ];
        fileContent = csvRows.join('\n');
      }

      // Safe trigger of browser file-download handler
      try {
        const cleanedNameForFile = reportName
          .replace(/[^a-zA-Z0-9_\-\s]/g, '')
          .replace(/\s+/g, '_');
        const finalFileName = `${cleanedNameForFile}${fileNameExtension}`;

        const blob = new Blob([fileContent], { type: fileType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', finalFileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        addToast(`Successfully downloaded "${reportName}" to localized office storage.`, 'success');

        // Append dynamically to top of recent activities list
        const timestamp = new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short'
        }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        
        setRecentActivities(prev => {
          const itemExists = prev.some(act => act.name === reportName);
          const newAct = {
            id: Math.random().toString(),
            name: reportName,
            user: 'HR Admin',
            timestamp: timestamp,
            success: true
          };
          if (itemExists) {
            return [newAct, ...prev.filter(act => act.name !== reportName)].slice(0, 6);
          }
          return [newAct, ...prev].slice(0, 6);
        });
      } catch (err) {
        console.error('File generation failure:', err);
        addToast('File download encountered standard sandboxing limitations.', 'error');
      }
    }, 1300);
  };

  // Schedule handles
  const handleSaveSchedule = (e: FormEvent) => {
    e.preventDefault();
    if (!scheduleForm.recipients.trim()) {
      addToast('Recipients email must contain at least one valid address.', 'error');
      return;
    }

    if (editingScheduleId) {
      setSchedules(prev => prev.map(s => {
        if (s.id === editingScheduleId) {
          return {
            ...s,
            name: scheduleForm.type,
            type: scheduleForm.type,
            frequency: scheduleForm.frequency,
            format: scheduleForm.format,
            time: scheduleForm.time,
            recipients: scheduleForm.recipients
          };
        }
        return s;
      }));
      addToast('Recurrent scheduled report adjusted successfully!', 'success');
      setEditingScheduleId(null);
    } else {
      const isDuplicated = schedules.some(s => s.type === scheduleForm.type && s.frequency === scheduleForm.frequency);
      if (isDuplicated) {
        addToast(`A schedule of "${scheduleForm.type}" on frequency "${scheduleForm.frequency}" already exists.`, 'info');
      }

      const nextDayStr = scheduleForm.frequency === 'Daily' ? 'Tomorrow' : '1 Jun';
      setSchedules(prev => [
        ...prev,
        {
          id: 'sch-' + Math.random().toString().substring(2, 6),
          name: scheduleForm.type,
          type: scheduleForm.type,
          frequency: scheduleForm.frequency,
          time: scheduleForm.time,
          format: scheduleForm.format,
          recipients: scheduleForm.recipients,
          nextRun: `${nextDayStr} ${scheduleForm.time.split(' ')[0]}`
        }
      ]);
      addToast(`Recurrent scheduled report established for ${scheduleForm.type}!`, 'success');
    }

    // Reset Form type
    setScheduleForm({
      type: 'Monthly payroll summary',
      frequency: 'Monthly',
      time: '06:00 AM',
      format: 'Excel (.xlsx)',
      recipients: 'hr@novora.com, cfo@novora.com'
    });
  };

  const handleEditScheduleClick = (sch: ReportSchedule) => {
    setEditingScheduleId(sch.id);
    setScheduleForm({
      type: sch.type,
      frequency: sch.frequency,
      time: sch.time,
      format: sch.format,
      recipients: sch.recipients
    });
    addToast(`Loaded schedule for "${sch.name}" into editor`, 'info');
  };

  const handleDeleteSchedule = (id: string, name: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
    addToast(`Deleted run schedule for "${name}"`, 'success');
  };

  const handleCustomBuilderRun = () => {
    const fieldsSelected = Object.entries(selectedFields).filter(([_, val]) => val).map(([key]) => key);
    if (fieldsSelected.length === 0) {
      addToast('Select at least one field to export in section 2.', 'error');
      return;
    }
    
    addToast(`Assembling custom structured database schema for ${builderModule}...`, 'loading');
    setTimeout(() => {
      addToast(`Generated ${builderModule} dataset with ${fieldsSelected.length} parameters into system output.`, 'success');
      triggerDownloadLog(`Manual Custom: ${builderModule} (${sortBy})`);
    }, 1500);
  };

  // Count employees in departments for dashboard visualization representation
  const financeCount = employees.filter(e => e.department === 'Finance').length;
  const engineeringCount = employees.filter(e => e.department === 'Engineering').length;
  const operationsCount = employees.filter(e => e.department === 'Operations').length;

  return (
    <div id="reports-hub-main-frame" className="w-full animate-in fade-in duration-150">
      
      {/* ==================== RIGHT PANEL: MAIN REPORTS BOARD ==================== */}
      <section id="reports-hub-main-board" className="w-full space-y-6">
        
        {/* Novora Reports Center Header Banner */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-xs">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Novora Reports Center</h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Insights, analytics, and auto-generated data exports across all modules.
            </p>
          </div>

          {/* Grouped Category Filters & Module Search Directory (No clunky scrollbar!) */}
          <div className="mt-5 pt-5 border-t border-slate-100/60 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Category Segment Selector Pills */}
              <div className="flex flex-wrap gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                {['All', 'Core HR', 'Financials & Benefits', 'Talent & Growth', 'Support & Engagement'].map((cat) => {
                  const isCatActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-[11px] font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                        isCatActive
                          ? 'bg-[#2f66e0] text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-white/80'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Module Search Input */}
              <div className="relative w-full md:max-w-[240px]">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter modules..."
                  value={moduleSearch}
                  onChange={(e) => setModuleSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-100 focus:border-[#2f66e0] focus:bg-white rounded-xl outline-none transition-all"
                />
              </div>
            </div>

            {/* Grid of Interactive Modules with Custom Icons */}
            <div className="flex flex-wrap gap-2 pb-1">
              {MODULE_METADATA.filter(mod => {
                const matchesCategory = selectedCategory === 'All' || mod.category === selectedCategory;
                const matchesSearch = mod.name.toLowerCase().includes(moduleSearch.toLowerCase()) || 
                                     mod.desc.toLowerCase().includes(moduleSearch.toLowerCase());
                return matchesCategory && matchesSearch;
              }).map((mod) => {
                const IconComponent = mod.icon;
                const isActive = selectedModule === mod.name;
                return (
                  <button
                    key={mod.name}
                    onClick={() => {
                      setSelectedModule(mod.name);
                      if (activeSidebarTab !== 'centre') {
                        setActiveSidebarTab('centre');
                      }
                      addToast(`Swapped view module scope to: ${mod.name}`, 'info');
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-[11.5px] font-bold border transition-all cursor-pointer select-none group duration-150 ${
                      isActive
                        ? 'bg-[#2f66e0] text-white border-[#2f66e0] shadow-xs transform scale-[1.02]'
                        : 'bg-white text-slate-700 border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                    title={mod.desc}
                  >
                    <IconComponent className={`h-4 w-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-[#2f66e0]'}`} />
                    <span>{mod.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ==================== VIEW 1: REPORT CENTRE VIEW ==================== */}
        {activeSidebarTab === 'centre' && selectedModule === 'All Overview' && (
          <div id="report-centre-overview" className="space-y-6 animate-in fade-in duration-200">
            
            {/* Horizontal Metrc Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-xs relative">
                <span className="text-5xl font-black text-slate-800 tracking-tight block">48</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-2">Total Reports</span>
                <span className="text-[11px] text-slate-400 font-semibold block mt-1">10 modules activated</span>
              </div>

              <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-xs relative">
                <span className="text-5xl font-black text-[#2f66e0] tracking-tight block">{schedules.length + 9}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-2">Scheduled Reports</span>
                <span className="text-[11px] text-slate-400 font-semibold block mt-1">Next: tomorrow 06:00</span>
              </div>

              <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-xs relative">
                <span className="text-5xl font-black text-slate-800 tracking-tight block">{totalCustomSaved}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-2">Custom Reports Saved</span>
                <span className="text-[11px] text-emerald-500 font-semibold block mt-1">By HR operations team</span>
              </div>

            </div>

            {/* Layout Grid Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Aspect: MOST USED REPORTS */}
              <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Most Used Reports</h3>
                  <p className="text-[10px] text-slate-400 italic">Highly optimized for operational audits & payroll reconciliation</p>
                </div>

                <div className="space-y-3">
                  
                  {/* Monthly payroll summary */}
                  <div 
                    onClick={() => triggerDownloadLog('Monthly payroll summary')}
                    className="p-4 border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 rounded-2xl flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">Monthly payroll summary</span>
                        <span className="bg-blue-50 text-[9px] font-bold text-blue-600 px-2 py-0.5 rounded-md">PAYROLL</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">Earnings, deductions, net pay by department</p>
                    </div>
                    <Download className="h-4 w-4 text-slate-400" />
                  </div>

                  {/* Attendance detail report */}
                  <div 
                    onClick={() => triggerDownloadLog('Attendance detail report')}
                    className="p-4 border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 rounded-2xl flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">Attendance detail report</span>
                        <span className="bg-slate-100 text-[9px] font-bold text-slate-600 px-2 py-0.5 rounded-md">ATTENDANCE</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">Clock-in, clock-out, OT, absent per employee</p>
                    </div>
                    <Download className="h-4 w-4 text-slate-400" />
                  </div>

                  {/* Leave balance summary */}
                  <div 
                    onClick={() => triggerDownloadLog('Leave balance summary')}
                    className="p-4 border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 rounded-2xl flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">Leave balance summary</span>
                        <span className="bg-amber-55 text-[9px] font-bold text-amber-700 px-2 py-0.5 rounded-md">LEAVE</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">Entitlement, used, balance per leave type</p>
                    </div>
                    <Download className="h-4 w-4 text-slate-400" />
                  </div>

                  {/* Performance appraisal results */}
                  <div 
                    onClick={() => triggerDownloadLog('Performance appraisal results')}
                    className="p-4 border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 rounded-2xl flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">Performance appraisal results</span>
                        <span className="bg-[#2f66e0]/10 text-[9px] font-bold text-[#2f66e0] px-2 py-0.5 rounded-md">PERFORMANCE</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">Scores, grades, CEP ratings</p>
                    </div>
                    <Download className="h-4 w-4 text-slate-400" />
                  </div>

                </div>
              </div>

              {/* Right Aspect: BOARD BRIEFING, RECENT ACTIVITY & EXPORT FORMATS */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* BOARD-LEVEL EXECUTIVE BRIEFING QUICK SUMMARY */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-800/85 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-[#2f66e0]/15 p-1.5 rounded-xl">
                        <Sparkles className="h-4 w-4 text-[#2f66e0]" />
                      </div>
                      <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider block font-sans">Q2 Executive Summary Desk</h3>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                      Low Risk
                    </span>
                  </div>

                  <div className="space-y-4 font-sans">
                    <div className="space-y-1">
                      <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest block">strategic health index</span>
                      <p className="text-[11.5px] font-medium text-slate-300 leading-relaxed">
                        The overall organizational compliance and operations score is currently at <strong className="text-white">94.8% Excellent</strong> status. Critical human capital KPIs are balanced, and budget trajectories align with general fiscal board plans.
                      </p>
                    </div>

                    <div className="border-t border-slate-800 pt-4 space-y-3">
                      <span className="text-[9px] font-extrabold text-[#2f66e0] uppercase tracking-widest block">Core Executive Targets</span>
                      <ul className="space-y-2.5">
                        <li className="flex gap-2.5 items-start text-[11px] text-slate-350 leading-normal font-medium">
                          <span className="bg-emerald-500/10 text-emerald-450 text-[10px] font-black h-4.5 w-4.5 shrink-0 rounded-full flex items-center justify-center font-mono border border-emerald-500/10">
                            ✓
                          </span>
                          <span className="flex-1">
                            <strong className="text-slate-200 font-bold">Talent Retention Outperforms:</strong> Core personnel turnover is mitigated at 3.6% annual variance, with recruitment onboarding times optimized by 3.2 days.
                          </span>
                        </li>
                        <li className="flex gap-2.5 items-start text-[11px] text-slate-350 leading-normal font-medium">
                          <span className="bg-emerald-500/10 text-emerald-450 text-[10px] font-black h-4.5 w-4.5 shrink-0 rounded-full flex items-center justify-center font-mono border border-emerald-500/10">
                            ✓
                          </span>
                          <span className="flex-1">
                            <strong className="text-slate-200 font-bold">Payroll & Claims Accuracy:</strong> Strict ±0.85% variance maintained across global ledger allocations with 100% active internal audits.
                          </span>
                        </li>
                        <li className="flex gap-2.5 items-start text-[11px] text-slate-350 leading-normal font-medium">
                          <span className="bg-emerald-500/10 text-emerald-450 text-[10px] font-black h-4.5 w-4.5 shrink-0 rounded-full flex items-center justify-center font-mono border border-emerald-500/10">
                            ✓
                          </span>
                          <span className="flex-1">
                            <strong className="text-slate-200 font-bold">Support Optimization:</strong> Attendance records and general legal compliance requirements are audited, and inquiries have decreased by 14.5% MoM due to structured service desks.
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* RECENT ACTIVITY */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Activity</h3>
                  </div>

                  <div className="divide-y divide-slate-50">
                    {recentActivities.map((act) => (
                      <div key={act.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                        <div className="space-y-0.5">
                          <span className="text-xs font-semibold text-slate-800 block">{act.name}</span>
                          <span className="text-[10.5px] text-slate-400 font-bold shrink-0 block">
                            {act.user} &bull; {act.timestamp}
                          </span>
                        </div>
                        <button 
                          onClick={() => triggerDownloadLog(act.name)}
                          className="text-[#2f66e0] hover:text-blue-700 text-xs font-extrabold cursor-pointer"
                        >
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* EXPORT FORMATS */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Export Formats</h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => triggerDownloadLog('Consolidated HR Ledger File (Excel)')}
                      className="flex-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-800 py-3.5 px-4 rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <span className="bg-white p-1 rounded-lg">
                        <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                      </span>
                      <span>EXCEL</span>
                    </button>

                    <button
                      onClick={() => triggerDownloadLog('Master Executive HRM Booklet (PDF)')}
                      className="flex-1 bg-red-50 hover:bg-red-100 border border-red-100 text-red-800 py-3.5 px-4 rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <span className="bg-white p-1 rounded-lg">
                        <FileText className="h-4 w-4 text-red-600" />
                      </span>
                      <span>PDF</span>
                    </button>

                    <button
                      onClick={() => triggerDownloadLog('HRM Raw Ledger Database (CSV)')}
                      className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-700 py-3.5 px-4 rounded-2xl font-bold text-xs flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <span className="bg-white p-1 rounded-lg">
                        <FileText className="h-4 w-4 text-teal-600" />
                      </span>
                      <span>CSV</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ==================== VIEW 2: INDIVIDUAL MODULE REPORTS ==================== */}
        {activeSidebarTab === 'centre' && selectedModule !== 'All Overview' && (() => {
          const moduleInfo = MODULE_REPORTS_DATA[selectedModule] || {
            totalRecords: '1,284 Records',
            lastUpdated: 'Today 12:00',
            autoRun: 'Active',
            stats: [
              { label: 'Total Records', value: '1,284', trend: 'Stable', positive: true },
              { label: 'Completeness', value: '99.2%', trend: 'Matches targets', positive: true },
              { label: 'Status', value: 'Operational', trend: 'Healthy audit checks', positive: true }
            ],
            reports: [
              { title: `${selectedModule} Summary Report`, description: `Aggregated data visualization and summaries for ${selectedModule.toLowerCase()}.`, tag: 'SUMMARY' },
              { title: `${selectedModule} Detail Log Register`, description: `Detailed transactions and activity listings for auditing ${selectedModule.toLowerCase()}.`, tag: 'DETAIL' },
              { title: `${selectedModule} Annual Trend Outlook`, description: `Year-on-year growth curves, milestones, and statistical trend comparison logs.`, tag: 'TREND' }
            ],
            distribution: {
              title: 'Department Wise Participation',
              items: [
                { label: 'Engineering Team', value: String(engineeringCount), percent: Math.round((engineeringCount / employees.length) * 100), colorClass: 'bg-[#2f66e0]' },
                { label: 'Operations Team', value: String(operationsCount), percent: Math.round((operationsCount / employees.length) * 100), colorClass: 'bg-emerald-500' },
                { label: 'Finance Team', value: String(financeCount), percent: Math.round((financeCount / employees.length) * 100), colorClass: 'bg-[#2f66e0]' }
              ]
            },
            managementBrief: {
              strategicFocus: 'Performance tracking & operational alignment.',
              riskIndex: 'Low' as const,
              costImpact: 'Resource utilization matches standard target variance.',
              actionableDirectives: [
                'Review departmental KPIs quarterly to detect performance bottlenecks early.',
                'Compare team metrics against baseline goals to maintain consistent delivery standards.'
              ]
            }
          };

          return (
            <div id="report-individual-module" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-250 font-sans">
              
              {/* Left side: AVAILABLE REPORTS LIST */}
              <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6">
                
                {/* Dynamic Stats Grid */}
                <div>
                  <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">Live Insights Snapshot</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {moduleInfo.stats.map((stat, i) => (
                      <div key={i} className="bg-slate-50/55 p-3.5 rounded-2xl border border-slate-100">
                        <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">{stat.label}</span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-[15px] font-black text-slate-800 tracking-tight">{stat.value}</span>
                        </div>
                        <span className={`text-[9px] font-bold block mt-1 ${stat.positive ? 'text-emerald-600' : 'text-slate-500'}`}>
                          {stat.trend}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-50">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    {selectedModule.toUpperCase()} Reports Available
                  </h3>
                  
                  <div className="space-y-3">
                    {moduleInfo.reports.map((report, i) => (
                      <div 
                        key={i}
                        onClick={() => triggerDownloadLog(report.title)}
                        className="p-4 border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 rounded-2xl flex items-center justify-between cursor-pointer transition-all group"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800 group-hover:text-[#2f66e0] transition-colors">{report.title}</span>
                            <span className="bg-slate-105 text-[8.5px] font-black text-slate-600 px-1.5 py-0.5 rounded uppercase font-mono">
                              {report.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-medium">{report.description}</p>
                        </div>
                        <div className="bg-slate-50 group-hover:bg-blue-50 p-2 rounded-xl transition-all border border-slate-100 group-hover:border-blue-100">
                          <Download className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#2f66e0] transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right side: QUICK SNAPSHOT & EXECUTIVE BRIEFING */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* QUICK SNAPSHOT */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-5">
                  <div className="border-b border-slate-50 pb-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Quick Snapshot</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-semibold">Total Records</span>
                      <span className="text-slate-800 font-extrabold text-sm">{moduleInfo.totalRecords}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-semibold">Last Updated</span>
                      <span className="text-emerald-600 font-extrabold">{moduleInfo.lastUpdated}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-semibold">Auto-Run Status</span>
                      <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-100/50">
                        {moduleInfo.autoRun}
                      </span>
                    </div>

                    <div className="border-t border-slate-50 pt-4 space-y-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {moduleInfo.distribution.title}
                      </span>
                      
                      {/* Progress bars for Departments representation */}
                      <div className="space-y-2.5 text-xs">
                        {moduleInfo.distribution.items.map((item, idx) => (
                          <div key={idx}>
                            <div className="flex justify-between text-slate-600 font-semibold text-[11px] mb-1">
                              <span>{item.label}</span>
                              <span className="font-extrabold text-slate-800">{item.value} ({item.percent}%)</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div className={`${item.colorClass} h-full`} style={{ width: `${item.percent}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* EXECUTIVE BRIEFING CARD */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-800/85 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-[#2f66e0]/15 p-1.5 rounded-xl">
                        <Sparkles className="h-4 w-4 text-[#2f66e0]" />
                      </div>
                      <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider block">Executive Briefing</h3>
                    </div>
                    
                    {/* Risk Badge with adaptive styles */}
                    <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                      moduleInfo.managementBrief.riskIndex === 'Critical'
                        ? 'bg-red-500/15 text-red-400 border-red-500/30'
                        : moduleInfo.managementBrief.riskIndex === 'High'
                        ? 'bg-orange-500/15 text-orange-400 border-orange-500/30'
                        : moduleInfo.managementBrief.riskIndex === 'Medium'
                        ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                        : 'bg-emerald-500/15 text-emerald-450 border-emerald-500/30'
                    }`}>
                      {moduleInfo.managementBrief.riskIndex} Risk
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest block">strategic focus desk</span>
                      <p className="text-[11.5px] font-medium text-slate-300 leading-relaxed">
                        {moduleInfo.managementBrief.strategicFocus}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest block">financial budget impact</span>
                      <p className="text-[11.5px] font-medium text-slate-300 leading-relaxed">
                        {moduleInfo.managementBrief.costImpact}
                      </p>
                    </div>

                    <div className="border-t border-slate-800 pt-4 space-y-3">
                      <span className="text-[9px] font-extrabold text-[#2f66e0] uppercase tracking-widest block">board-level core directives</span>
                      <ul className="space-y-2.5">
                        {moduleInfo.managementBrief.actionableDirectives.map((action, ai) => (
                          <li key={ai} className="flex gap-2.5 items-start text-[11px] text-slate-350 leading-normal font-medium">
                            <span className="bg-[#2f66e0]/20 text-[#3b82f6] text-[10px] font-black h-4.5 w-4.5 shrink-0 rounded-full flex items-center justify-center font-mono border border-blue-500/10">
                              {ai + 1}
                            </span>
                            <span className="flex-1 mt-0.5">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          );
        })()}

        {/* ==================== VIEW 3: SCHEDULED REPORTS VIEW ==================== */}
        {activeSidebarTab === 'scheduled' && (
          <div id="scheduled-reports-view" className="space-y-6 animate-in fade-in duration-200">
            
            {/* SCHEDULE NEW REPORT form block */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Schedule New Report</h3>
              
              <form onSubmit={handleSaveSchedule} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Report Type */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Report type</label>
                    <select
                      value={scheduleForm.type}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, type: e.target.value }))}
                      className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-700 font-bold outline-none cursor-pointer"
                    >
                      <option value="Monthly payroll summary">Monthly payroll summary (Consolidated)</option>
                      <option value="Attendance summary — Apr">Attendance summary (Total list)</option>
                      <option value="Leave balance summary">Leave balance report (By leave type)</option>
                      <option value="Performance appraisal results">Performance metrics summary (Executive)</option>
                      <option value="Recruitment funnel state">Recruitment funnel status report</option>
                    </select>
                  </div>

                  {/* Frequency */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Frequency</label>
                    <select
                      value={scheduleForm.frequency}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, frequency: e.target.value }))}
                      className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-700 font-bold outline-none cursor-pointer"
                    >
                      <option value="Daily">Daily automatic run</option>
                      <option value="Weekly">Weekly consolidated runs</option>
                      <option value="Monthly">Monthly ledger generation</option>
                      <option value="Quarterly">Quarterly business reviews</option>
                    </select>
                  </div>

                  {/* Delivery Time */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Delivery time</label>
                    <select
                      value={scheduleForm.time}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, time: e.target.value }))}
                      className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-700 font-bold outline-none cursor-pointer"
                    >
                      <option value="06:00 AM">06:00 AM (Early operational review)</option>
                      <option value="09:00 AM">09:00 AM (Standard morning dispatch)</option>
                      <option value="12:00 PM">12:00 PM (Mid-day sync run)</option>
                      <option value="05:00 PM">05:00 PM (Operational wrap-up)</option>
                    </select>
                  </div>

                  {/* Format */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Format</label>
                    <select
                      value={scheduleForm.format}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, format: e.target.value }))}
                      className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-700 font-bold outline-none cursor-pointer"
                    >
                      <option value="Excel (.xlsx)">Excel Spreadsheet (.xlsx)</option>
                      <option value="CSV (.csv)">Raw Comma Separated Table (.csv)</option>
                      <option value="PDF (.pdf)">Formatted Executive Booklet (.pdf)</option>
                    </select>
                  </div>

                </div>

                {/* Recipients Emails inputs */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recipients (Email)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={scheduleForm.recipients}
                      onChange={(e) => setScheduleForm(prev => ({ ...prev, recipients: e.target.value }))}
                      placeholder="e.g. hr@novora.com, cfo@novora.com"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] transition-colors rounded-2xl pl-11 pr-4 py-3 text-xs font-bold text-slate-700 outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium pl-1">Separate multiple email addresses with a comma</p>
                </div>

                {/* Submit button bar */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-[#2f66e0] hover:bg-opacity-95 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {editingScheduleId ? <CheckCircle className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    <span>{editingScheduleId ? 'Update Run Schedule' : 'Schedule Automatic Dispatch'}</span>
                  </button>
                </div>
              </form>

            </div>

            {/* ACTIVE SCHEDULES LIST */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Active Schedules</h3>
              
              <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4.5">Report Name</th>
                      <th className="py-3 px-4.5">Frequency</th>
                      <th className="py-3 px-4.5">Executive Focus</th>
                      <th className="py-3 px-4.5">Target Audience</th>
                      <th className="py-3 px-4.5">Next Run</th>
                      <th className="py-3 px-4.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-600">
                    {schedules.map((sch) => {
                      // Determine management-level intelligence fields based on schedule name/type
                      let execFocus = 'Risk & Compliance';
                      let targetAudience = 'HR Committee';
                      const lowerType = sch.name.toLowerCase();
                      
                      if (lowerType.includes('payroll')) {
                        execFocus = 'Cost Analysis & Allocations';
                        targetAudience = 'CFO & Executive Board';
                      } else if (lowerType.includes('attendance')) {
                        execFocus = 'Workplace Velocity & SLA';
                        targetAudience = 'Operations Directors';
                      } else if (lowerType.includes('leave')) {
                        execFocus = 'Workforce Capacity & Burnout';
                        targetAudience = 'Executive Committee';
                      } else if (lowerType.includes('performance')) {
                        execFocus = 'Productivity Index & Growth';
                        targetAudience = 'CEO & Managing Directors';
                      } else if (lowerType.includes('recruitment')) {
                        execFocus = 'Growth Capital Pipeline';
                        targetAudience = 'Board of Directors';
                      }

                      return (
                        <tr key={sch.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 px-4.5 font-bold text-slate-800">{sch.name}</td>
                          <td className="py-3.5 px-4.5 text-slate-655">{sch.frequency}</td>
                          <td className="py-3.5 px-4.5">
                            <span className="bg-blue-50 text-[#2f66e0] text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {execFocus}
                            </span>
                          </td>
                          <td className="py-3.5 px-4.5 text-slate-500 text-[11px]">{targetAudience}</td>
                          <td className="py-3.5 px-4.5 text-slate-400 font-medium">{sch.nextRun}</td>
                          <td className="py-3.5 px-4.5 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => triggerDownloadLog(sch.name)}
                              className="bg-emerald-50 hover:bg-emerald-100 p-1.5 rounded-lg text-emerald-600 hover:text-emerald-800 transition-colors inline-flex cursor-pointer mr-1"
                              title="Run and Download Now (Management Copy)"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleEditScheduleClick(sch)}
                              className="bg-slate-50 hover:bg-slate-100 p-1.5 rounded-lg text-blue-600 hover:text-blue-800 transition-colors inline-flex cursor-pointer"
                              title="Edit Schedule"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSchedule(sch.id, sch.name)}
                              className="bg-slate-50 hover:bg-red-50 p-1.5 rounded-lg text-red-600 hover:text-red-800 transition-colors inline-flex cursor-pointer"
                              title="Delete Schedule"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        )}

        {/* ==================== VIEW 4: CUSTOM BUILDER VIEW ==================== */}
        {activeSidebarTab === 'builder' && (
          <div id="custom-builder-stages" className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
            
            {/* STAGE 1: DATA SOURCE */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-extrabold text-sm font-mono">1.</span>
                <span className="text-[10px] font-bold text-slate-405 uppercase tracking-widest">Data Source</span>
              </div>

              <div className="space-y-4.5">
                {/* Primary selection */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary module</label>
                  <select
                    value={builderModule}
                    onChange={(e) => handleBuilderModuleChange(e.target.value)}
                    className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-700 font-bold outline-none cursor-pointer"
                  >
                    <option value="Employee management">Employee management</option>
                    <option value="Attendance log module">Attendance data records</option>
                    <option value="Leave tracking module">Leave tracker systems</option>
                    <option value="Payroll processing">Payroll ledger systems</option>
                    <option value="Performance scorecard">Performance appraisals</option>
                  </select>
                </div>

                {/* Combine with check values */}
                <div className="flex flex-col space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Combine with</label>
                  <div className="space-y-2 text-xs font-semibold text-slate-600 select-none pl-1">
                    
                    <div 
                      onClick={() => setBuilderCombine(prev => ({ ...prev, attendance: !prev.attendance }))}
                      className="flex items-center gap-2 cursor-pointer py-0.5"
                    >
                      {builderCombine.attendance ? (
                        <CheckSquare className="h-4.5 w-4.5 text-[#2f66e0]" />
                      ) : (
                        <Square className="h-4.5 w-4.5 text-slate-300" />
                      )}
                      <span>Attendance data</span>
                    </div>

                    <div 
                      onClick={() => setBuilderCombine(prev => ({ ...prev, leave: !prev.leave }))}
                      className="flex items-center gap-2 cursor-pointer py-0.5"
                    >
                      {builderCombine.leave ? (
                        <CheckSquare className="h-4.5 w-4.5 text-[#2f66e0]" />
                      ) : (
                        <Square className="h-4.5 w-4.5 text-slate-300" />
                      )}
                      <span>Leave data</span>
                    </div>

                    <div 
                      onClick={() => setBuilderCombine(prev => ({ ...prev, payroll: !prev.payroll }))}
                      className="flex items-center gap-2 cursor-pointer py-0.5"
                    >
                      {builderCombine.payroll ? (
                        <CheckSquare className="h-4.5 w-4.5 text-[#2f66e0]" />
                      ) : (
                        <Square className="h-4.5 w-4.5 text-slate-300" />
                      )}
                      <span>Payroll information</span>
                    </div>

                    <div 
                      onClick={() => setBuilderCombine(prev => ({ ...prev, performance: !prev.performance }))}
                      className="flex items-center gap-2 cursor-pointer py-0.5"
                    >
                      {builderCombine.performance ? (
                        <CheckSquare className="h-4.5 w-4.5 text-[#2f66e0]" />
                      ) : (
                        <Square className="h-4.5 w-4.5 text-slate-300" />
                      )}
                      <span>Performance rankings</span>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* STAGE 2: SELECT FIELDS */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-extrabold text-sm font-mono">2.</span>
                <span className="text-[10px] font-bold text-slate-405 uppercase tracking-widest flex items-center gap-1.5">
                  <span>Select Fields</span>
                  <span className="bg-blue-50 text-[8px] px-1.5 py-0.5 text-blue-600 rounded">
                    {builderModule.substring(0, 8).toUpperCase()}
                  </span>
                </span>
              </div>

              <div className="space-y-2.5 text-xs font-semibold text-slate-655 max-h-48 overflow-y-auto pr-1">
                {Object.entries(selectedFields).map(([fieldName, isChecked]) => (
                  <div
                    key={fieldName}
                    onClick={() => setSelectedFields(prev => ({ ...prev, [fieldName]: !prev[fieldName] }))}
                    className="flex items-center justify-between p-2.5 border border-slate-50/75 hover:border-slate-100 hover:bg-slate-50/30 rounded-xl cursor-pointer select-none"
                  >
                    <span>{fieldName}</span>
                    {isChecked ? (
                      <CheckCircle className="h-4.5 w-4.5 text-[#2f66e0]" />
                    ) : (
                      <div className="h-4.5 w-4.5 rounded-full border-2 border-slate-200" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* STAGE 3: FILTERS */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-extrabold text-sm font-mono">3.</span>
                <span className="text-[10px] font-bold text-slate-405 uppercase tracking-widest">Filters</span>
              </div>

              <div className="space-y-3.5">
                {/* Date Fields Group */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">From date</label>
                    <input
                      type="date"
                      value={filterFromDate}
                      onChange={(e) => setFilterFromDate(e.target.value)}
                      className="bg-slate-50 border border-slate-200 focus:border-[#2f66e0] rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none w-full"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">To date</label>
                    <input
                      type="date"
                      value={filterToDate}
                      onChange={(e) => setFilterToDate(e.target.value)}
                      className="bg-slate-50 border border-slate-200 focus:border-[#2f66e0] rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none w-full"
                    />
                  </div>
                </div>

                {/* Filters Dropdowns */}
                <div className="flex flex-col space-y-1">
                  <label className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">Department</label>
                  <select
                    value={filterDept}
                    onChange={(e) => setFilterDept(e.target.value)}
                    className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-700 font-bold outline-none cursor-pointer"
                  >
                    <option value="All departments">All departments &bull; Global Roster</option>
                    <option value="Engineering">Engineering Sector</option>
                    <option value="Finance">Finance Team</option>
                    <option value="HR">Human Resources</option>
                    <option value="Marketing">Marketing Operations</option>
                    <option value="Operations">Operations Support</option>
                  </select>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">Employment Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-700 font-bold outline-none cursor-pointer"
                  >
                    <option value="All statuses">All personnel records</option>
                    <option value="Active only">Active rosters only</option>
                    <option value="On Leave">On leaves list</option>
                    <option value="Inactive">Terminated or retired</option>
                  </select>
                </div>
              </div>
            </div>

            {/* STAGE 4: OUTPUT */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-extrabold text-sm font-mono">4.</span>
                <span className="text-[10px] font-bold text-slate-405 uppercase tracking-widest">Output</span>
              </div>

              <div className="space-y-4">
                {/* Sort fields */}
                <div className="flex flex-col space-y-1">
                  <label className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">Sort by</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-700 font-bold outline-none cursor-pointer"
                  >
                    <option value="Employee No.">Employee No. Sequence</option>
                    <option value="Full Name">Full Name alphabetically</option>
                    <option value="Join Date">Hire Joining Chronology</option>
                    <option value="Department">Department Sectors group</option>
                  </select>
                </div>

                {/* Format selection */}
                <div className="flex flex-col space-y-1">
                  <label className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">Format</label>
                  <select
                    value={builderFormat}
                    onChange={(e) => setBuilderFormat(e.target.value)}
                    className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-700 font-bold outline-none cursor-pointer"
                  >
                    <option value="Excel (.xlsx)">Excel Spreadsheet (.xlsx)</option>
                    <option value="CSV (.csv)">Raw Comma Separated (.csv)</option>
                    <option value="PDF (.pdf)">Printable Executive Layout (.pdf)</option>
                  </select>
                </div>

                {/* Submitting custom construction request */}
                <div className="pt-2">
                  <button
                    onClick={handleCustomBuilderRun}
                    className="w-full bg-[#2f66e0] hover:bg-opacity-95 text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs"
                  >
                    <Sparkles className="h-4.5 w-4.5" />
                    <span>Run &amp; Export Report</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom floating bar containing resets and save presets */}
            <div className="col-span-1 md:col-span-2 bg-slate-50 border border-slate-100 p-4.5 rounded-3xl flex items-center justify-between select-none">
              <button
                onClick={() => {
                  setBuilderModule('Employee management');
                  setBuilderCombine({ attendance: true, leave: false, payroll: false, performance: false });
                  setFilterFromDate('2026-01-01');
                  setFilterToDate('2026-05-31');
                  setFilterDept('All departments');
                  setFilterStatus('Active only');
                  setSortBy('Employee No.');
                  setBuilderFormat('Excel (.xlsx)');
                  addToast('Builder configs restored to system baseline.', 'info');
                }}
                className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-extrabold text-xs cursor-pointer transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset to Default</span>
              </button>

              <button
                onClick={() => {
                  setTotalCustomSaved(prev => prev + 1);
                  addToast(`Configuration presets for "${builderModule}" saved successfully!`, 'success');
                }}
                className="bg-slate-900 border border-slate-850 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>

          </div>
        )}

      </section>

    </div>
  );
}

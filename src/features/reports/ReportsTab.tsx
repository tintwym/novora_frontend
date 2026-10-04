import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createLocalId } from '@/lib/createLocalId'
import {
  FileBarChart,
  LayoutGrid,
  Clock,
  SlidersHorizontal,
  ChevronDown,
  Download,
  Trash2,
  Edit2,
  Plus,
  RotateCcw,
  Save,
  CheckCircle,
  FileSpreadsheet,
  FileText,
  Building,
  UserCheck,
  CalendarDays,
  Activity,
  Award,
  Users,
  Briefcase,
  AlertCircle,
  Settings,
  Mail,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
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
  Filter
} from 'lucide-react';
import type { Employee } from '@/types';
import { SelectMenu } from '@/components/ui';
import ModuleHeader from '@/components/ui/ModuleHeader';
import {
  ApiError,
  fetchAdminClaims,
  fetchAdminHelpdeskTickets,
  fetchAdminLeaveOverview,
  fetchAdminOnboardingTasks,
  fetchAdminPayroll,
  fetchAdminPendingLeave,
  fetchAssets,
  fetchAttendanceRoster,
  fetchBenefitEnrollments,
  fetchDisciplinaryCases,
  fetchPerformanceReviews,
  fetchRecruitmentCandidates,
  fetchRecruitmentJobs,
  fetchReportSummary,
  fetchTrainings,
  type AssetRow,
  type AttendanceRosterLog,
  type BenefitEnrollmentRow,
  type ClaimRow,
  type DisciplinaryCaseRow,
  type HelpdeskTicketRow,
  type LeaveOverviewRow,
  type LeaveRequest,
  type OnboardingTaskRow,
  type PayrollRow,
  type PerformanceReviewRow,
  type RecruitmentCandidateRow,
  type RecruitmentJobRow,
  type ReportSummary,
  type TrainingRow,
} from '@/services';
import { useCurrency } from '@/hooks/useCurrency';
import { formatAmount, formatMoney } from '@/lib/currency';

interface ReportsTabProps {
  employees: Employee[];
  addToast: (text: string, type: 'success' | 'loading' | 'error' | 'info') => void;
  activeSubTab?: 'centre' | 'scheduled' | 'builder';
  setActiveSubTab?: (tab: 'centre' | 'scheduled' | 'builder') => void;
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

interface RecentActivity {
  id: string;
  name: string;
  user: string;
  timestamp: string;
  success: boolean;
  fileName: string;
  fileType: string;
  content: string;
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

const MODULE_BRIEFS: Record<string, { strategicFocus: string; actionableDirectives: string[] }> = {
  Employee: {
    strategicFocus: 'Workforce distribution alignment & tenure stability tracking.',
    actionableDirectives: [
      'Review department succession pipelines for long-tenured technical roles.',
      'Track contract staff conversion to control contractor budgets.',
      'Keep employment status and department data current in employee profiles.'
    ]
  },
  Recruitment: {
    strategicFocus: 'Pipeline conversion & sourcing channel effectiveness.',
    actionableDirectives: [
      'Favour organic and referral sourcing where it converts well.',
      'Move technical screening earlier to shorten panel selection cycles.',
      'Maintain an internal candidate pool for frequently hired roles.'
    ]
  },
  'On/Off-boarding': {
    strategicFocus: 'Access provisioning, credential clearance & asset recovery.',
    actionableDirectives: [
      'Revoke directory and SSO credentials promptly on departure.',
      'Confirm company equipment is recovered from leavers.',
      'Standardise onboarding checklists so security briefings happen in the first week.'
    ]
  },
  Attendance: {
    strategicFocus: 'Punctuality trends & overtime control.',
    actionableDirectives: [
      'Require supervisor approval for extended overtime.',
      'Consider flexible hours for teams with seasonal peaks.',
      'Reconcile manual clock-ins against other attendance records.'
    ]
  },
  Leave: {
    strategicFocus: 'Leave liability & year-end coverage planning.',
    actionableDirectives: [
      'Encourage teams to book annual leave ahead of major deliverables.',
      'Stagger leave for critical roles to keep coverage.',
      'Clear pending leave requests before payroll cut-off.'
    ]
  },
  Disciplinary: {
    strategicFocus: 'Case resolution & conduct policy compliance.',
    actionableDirectives: [
      'Run code-of-conduct refreshers for people managers.',
      'Ensure HR is present in performance improvement plan reviews.',
      'Keep incident records complete and stored securely.'
    ]
  },
  Payroll: {
    strategicFocus: 'Payroll accuracy & compensation cost control.',
    actionableDirectives: [
      'Benchmark compensation against the market to reduce attrition risk.',
      'Verify statutory deduction settings before each run.',
      'Require dual authorisation for off-cycle payments.'
    ]
  },
  Claims: {
    strategicFocus: 'Expense policy compliance & timely reimbursement.',
    actionableDirectives: [
      'Set clear caps for hospitality and entertainment claims.',
      'Validate mileage claims against trip details.',
      'Set a receipt submission deadline to keep balances accurate.'
    ]
  },
  Benefits: {
    strategicFocus: 'Benefit plan uptake & premium allocation.',
    actionableDirectives: [
      'Review plan terms with providers at renewal.',
      'Promote wellness benefits to support long-term health.',
      'Benchmark retirement contributions against peers.'
    ]
  },
  'Helpdesk & Inquiries': {
    strategicFocus: 'Ticket resolution speed & recurring inquiry themes.',
    actionableDirectives: [
      'Publish self-service answers for frequent questions.',
      'Work with IT on recurring login and access issues.',
      'Keep urgent tickets assigned and moving.'
    ]
  },
  Performance: {
    strategicFocus: 'Goal alignment & fair rating distribution.',
    actionableDirectives: [
      'Calibrate ratings across departments to avoid grade inflation.',
      'Map high performers to critical leadership gaps.',
      'Give staff on development plans equitable training access.'
    ]
  },
  Engagement: {
    strategicFocus: 'Workforce sentiment & retention risk.',
    actionableDirectives: [
      'Follow up with teams reporting low flexibility or morale.',
      'Respond to common themes raised in open feedback.',
      'Compare engagement trends with attrition by team.'
    ]
  },
  Training: {
    strategicFocus: 'Programme coverage & training spend.',
    actionableDirectives: [
      'Convert repeated external seminars into reusable internal modules.',
      'Confirm attendance to reduce unused paid seats.',
      'Link certification milestones to performance reviews.'
    ]
  },
  Learning: {
    strategicFocus: 'Compliance learning completion & skills coverage.',
    actionableDirectives: [
      'Alert staff whose required certifications are due to expire.',
      'Identify effective internal course authors from learner feedback.',
      'Make required compliance courses part of annual objectives.'
    ]
  },
  Assets: {
    strategicFocus: 'Hardware lifecycle tracking & unused licence recovery.',
    actionableDirectives: [
      'Reclaim licences that have been inactive for a long period.',
      'Repurpose older laptops before buying replacements.',
      'Consolidate branch inventories to find surplus devices.'
    ]
  }
};

type ReportData = {
  claims: ClaimRow[] | null;
  payroll: PayrollRow[] | null;
  jobs: RecruitmentJobRow[] | null;
  candidates: RecruitmentCandidateRow[] | null;
  attendance: AttendanceRosterLog[] | null;
  pendingLeave: LeaveRequest[] | null;
  leaveOverview: LeaveOverviewRow[] | null;
  disciplinary: DisciplinaryCaseRow[] | null;
  benefits: BenefitEnrollmentRow[] | null;
  helpdesk: HelpdeskTicketRow[] | null;
  reviews: PerformanceReviewRow[] | null;
  trainings: TrainingRow[] | null;
  assets: AssetRow[] | null;
  onboarding: OnboardingTaskRow[] | null;
};

type DataKey = keyof ReportData;
type LoadedData = Partial<ReportData>;

const DATA_LOADERS: { [K in DataKey]: () => Promise<NonNullable<ReportData[K]>> } = {
  claims: () => fetchAdminClaims(),
  payroll: () => {
    const now = new Date();
    return fetchAdminPayroll(now.getFullYear(), now.getMonth() + 1);
  },
  jobs: () => fetchRecruitmentJobs(),
  candidates: () => fetchRecruitmentCandidates(),
  attendance: () => fetchAttendanceRoster(),
  pendingLeave: () => fetchAdminPendingLeave(),
  leaveOverview: () => fetchAdminLeaveOverview(),
  disciplinary: () => fetchDisciplinaryCases(),
  benefits: () => fetchBenefitEnrollments(),
  helpdesk: () => fetchAdminHelpdeskTickets(),
  reviews: () => fetchPerformanceReviews(),
  trainings: () => fetchTrainings(),
  assets: () => fetchAssets(),
  onboarding: () => fetchAdminOnboardingTasks(),
};

const ALL_DATA_KEYS = Object.keys(DATA_LOADERS) as DataKey[];

const MODULE_SOURCES: Record<string, DataKey[]> = {
  Employee: [],
  Recruitment: ['jobs', 'candidates'],
  'On/Off-boarding': ['onboarding'],
  Attendance: ['attendance'],
  Leave: ['pendingLeave', 'leaveOverview'],
  Disciplinary: ['disciplinary'],
  Payroll: ['payroll'],
  Claims: ['claims'],
  Benefits: ['benefits'],
  'Helpdesk & Inquiries': ['helpdesk'],
  Performance: ['reviews'],
  Engagement: [],
  Training: ['trainings'],
  Learning: [],
  Assets: ['assets'],
};

const NO_SOURCE_MODULES: Record<string, string> = {
  Engagement: 'No engagement survey data source is connected yet.',
  Learning: 'No learning or certification data source is connected yet.',
};

type ModuleStat = { label: string; value: string; hint: string };
type ModuleDistribution = { title: string; items: { label: string; value: string; percent: number; colorClass: string }[] };
type ModuleView = { stats: ModuleStat[]; distribution: ModuleDistribution | null; distributionTitle: string; emptyMessage: string | null };
type CsvTable = { headers: string[]; rows: string[][] };

const BAR_COLORS = ['bg-novora', 'bg-emerald-500', 'bg-indigo-500', 'bg-amber-500', 'bg-rose-500'];
const CLOSED_STATUSES = ['CLOSED', 'RESOLVED', 'COMPLETED', 'DONE', 'CANCELLED', 'CANCELED', 'FILLED', 'ARCHIVED', 'DISMISSED', 'WITHDRAWN'];

const todayIso = () => new Date().toLocaleDateString('en-CA');
const yearStartIso = () => `${new Date().getFullYear()}-01-01`;
const nowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;
const titleCase = (s: string) => s.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
const statusIs = (s: string | null | undefined, values: string[]) => values.includes((s ?? '').trim().toUpperCase().replace(/[\s-]+/g, '_'));
const isClosed = (s: string | null | undefined) => statusIs(s, CLOSED_STATUSES);
const dateOnly = (s: string | null | undefined) => (s ? s.slice(0, 10) : '');
const str = (v: string | number | null | undefined) => (v === null || v === undefined ? '' : String(v));

function countBy<T>(rows: T[], key: (row: T) => string | null | undefined): [string, number][] {
  const map = new Map<string, number>();
  rows.forEach((row) => {
    const raw = (key(row) ?? '').trim();
    const label = raw ? titleCase(raw) : 'Unspecified';
    map.set(label, (map.get(label) ?? 0) + 1);
  });
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

function toDistribution(title: string, entries: [string, number][], format: (n: number) => string, limit = 5): ModuleDistribution | null {
  const total = entries.reduce((sum, [, n]) => sum + n, 0);
  if (!total) return null;
  return {
    title,
    items: entries.slice(0, limit).map(([label, n], i) => ({
      label,
      value: format(n),
      percent: Math.round((n / total) * 100),
      colorClass: BAR_COLORS[i % BAR_COLORS.length]
    }))
  };
}

function moneyByCurrency<T>(rows: T[], value: (row: T) => number, rowCurrency: (row: T) => string | null | undefined, fallback: string): string {
  if (rows.length === 0) return formatMoney(0, fallback);
  const totals = new Map<string, number>();
  rows.forEach((row) => {
    const code = rowCurrency(row) || fallback;
    totals.set(code, (totals.get(code) ?? 0) + (Number(value(row)) || 0));
  });
  return [...totals.entries()].map(([code, total]) => formatMoney(total, code)).join(' · ');
}

function employeeIndex(employees: Employee[]): Map<string, Employee> {
  const index = new Map<string, Employee>();
  employees.forEach((emp) => {
    index.set(emp.id, emp);
    if (emp.apiId) index.set(emp.apiId, emp);
  });
  return index;
}

function departmentNames(employees: Employee[]): string[] {
  return [...new Set(employees.map((e) => e.department).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function grossPay(row: PayrollRow): number {
  return (row.basicSalary || 0) + (row.allowances || 0) + (row.overtimePay || 0) + (row.bonus || 0);
}

function yearsSince(date: string): number | null {
  const start = new Date(date);
  if (Number.isNaN(start.getTime())) return null;
  return (Date.now() - start.getTime()) / (365.25 * 24 * 3600 * 1000);
}

function buildModuleView(module: string, employees: Employee[], data: LoadedData, currency: string): ModuleView {
  const view = (stats: ModuleStat[], distribution: ModuleDistribution | null, distributionTitle: string): ModuleView => ({
    stats,
    distribution,
    distributionTitle,
    emptyMessage: null
  });
  const failed = (keys: DataKey[]) => keys.every((k) => data[k] === null);
  const loading = (keys: DataKey[]) => keys.some((k) => data[k] === undefined);

  if (NO_SOURCE_MODULES[module]) {
    return { stats: [], distribution: null, distributionTitle: '', emptyMessage: NO_SOURCE_MODULES[module] };
  }
  const sources = MODULE_SOURCES[module] ?? [];
  if (sources.length > 0 && loading(sources)) {
    return { stats: [], distribution: null, distributionTitle: '', emptyMessage: `Loading ${module.toLowerCase()} data…` };
  }
  if (sources.length > 0 && failed(sources)) {
    return { stats: [], distribution: null, distributionTitle: '', emptyMessage: `Could not load ${module.toLowerCase()} data.` };
  }

  const today = todayIso();

  switch (module) {
    case 'Employee': {
      if (employees.length === 0) {
        return { stats: [], distribution: null, distributionTitle: '', emptyMessage: 'No employee records yet.' };
      }
      const active = employees.filter((e) => e.status === 'Active');
      const tenures = active.map((e) => yearsSince(e.joinDate)).filter((y): y is number => y !== null && y >= 0);
      const avgTenure = tenures.length ? `${(tenures.reduce((s, y) => s + y, 0) / tenures.length).toFixed(1)} yrs` : '—';
      return view(
        [
          { label: 'Active headcount', value: String(active.length), hint: `${plural(employees.length, 'profile')} in total` },
          { label: 'On leave', value: String(employees.filter((e) => e.status === 'On Leave').length), hint: 'Employee status' },
          { label: 'Avg tenure', value: avgTenure, hint: 'Active staff, from join dates' }
        ],
        toDistribution('Employment type', countBy(employees, (e) => e.employmentStatus), (n) => plural(n, 'employee')),
        'Employment type'
      );
    }
    case 'Recruitment': {
      const jobs = data.jobs ?? [];
      const candidates = data.candidates ?? [];
      const openJobs = jobs.filter((j) => !isClosed(j.status));
      const openings = openJobs.reduce((s, j) => s + (j.openings ?? 0), 0);
      return view(
        [
          { label: 'Open jobs', value: data.jobs ? String(openJobs.length) : '—', hint: data.jobs ? `${plural(jobs.length, 'posting')} in total` : 'Jobs unavailable' },
          { label: 'Open headcount', value: data.jobs ? String(openings) : '—', hint: 'Openings on open jobs' },
          { label: 'Candidates', value: data.candidates ? String(candidates.length) : '—', hint: 'All applications' }
        ],
        toDistribution('Candidates by stage', countBy(candidates, (c) => c.stage), (n) => plural(n, 'candidate')),
        'Candidates by stage'
      );
    }
    case 'On/Off-boarding': {
      const tasks = data.onboarding ?? [];
      const done = tasks.filter((t) => isClosed(t.status) || !!t.completedAt);
      const overdue = tasks.filter((t) => !isClosed(t.status) && !t.completedAt && t.dueDate && dateOnly(t.dueDate) < today);
      const monthPrefix = today.slice(0, 7);
      const joinsThisMonth = employees.filter((e) => (e.joinDate ?? '').startsWith(monthPrefix)).length;
      return view(
        [
          { label: 'New joins (this month)', value: String(joinsThisMonth), hint: 'From employee join dates' },
          { label: 'Open tasks', value: String(tasks.length - done.length), hint: `${plural(done.length, 'task')} completed` },
          { label: 'Overdue tasks', value: String(overdue.length), hint: 'Past due date' }
        ],
        toDistribution('Onboarding tasks by status', countBy(tasks, (t) => t.status), (n) => plural(n, 'task')),
        'Onboarding tasks by status'
      );
    }
    case 'Attendance': {
      const logs = data.attendance ?? [];
      const checkedIn = logs.filter((l) => !!l.checkInTime);
      const hours = logs.map((l) => l.workHours).filter((h): h is number => typeof h === 'number');
      return view(
        [
          { label: 'Logs today', value: String(logs.length), hint: 'Attendance roster' },
          { label: 'Checked in', value: String(checkedIn.length), hint: employees.length ? `of ${plural(employees.length, 'employee')}` : 'Today' },
          { label: 'Avg work hours', value: hours.length ? `${(hours.reduce((s, h) => s + h, 0) / hours.length).toFixed(1)} hrs` : '—', hint: 'Completed logs today' }
        ],
        toDistribution("Today's attendance status", countBy(logs, (l) => l.status), (n) => plural(n, 'employee')),
        "Today's attendance status"
      );
    }
    case 'Leave': {
      const pending = data.pendingLeave ?? [];
      const overview = (data.leaveOverview ?? []).filter((r) => r.total > 0);
      const totalUsed = overview.reduce((s, r) => s + r.used, 0);
      const totalDays = overview.reduce((s, r) => s + r.total, 0);
      return view(
        [
          { label: 'Pending requests', value: data.pendingLeave ? String(pending.length) : '—', hint: 'Awaiting approval' },
          { label: 'On leave', value: String(employees.filter((e) => e.status === 'On Leave').length), hint: 'Employee status' },
          { label: 'Days used', value: data.leaveOverview && totalDays ? `${totalUsed} / ${totalDays}` : '—', hint: 'Across leave types' }
        ],
        overview.length
          ? {
              title: 'Leave used by type',
              items: overview.slice(0, 5).map((r, i) => ({
                label: r.label,
                value: `${r.used} / ${r.total} days`,
                percent: Math.min(100, Math.round((r.used / r.total) * 100)),
                colorClass: BAR_COLORS[i % BAR_COLORS.length]
              }))
            }
          : null,
        'Leave used by type'
      );
    }
    case 'Disciplinary': {
      const cases = data.disciplinary ?? [];
      const open = cases.filter((c) => !isClosed(c.status));
      return view(
        [
          { label: 'Open cases', value: String(open.length), hint: `${plural(cases.length, 'case')} in total` },
          { label: 'High severity', value: String(cases.filter((c) => statusIs(c.severity, ['HIGH', 'CRITICAL', 'SEVERE'])).length), hint: 'All cases' },
          { label: 'Closed cases', value: String(cases.length - open.length), hint: 'Resolved or closed' }
        ],
        toDistribution('Cases by action', countBy(cases, (c) => c.actionType), (n) => plural(n, 'case')),
        'Cases by action'
      );
    }
    case 'Payroll': {
      const rows = data.payroll ?? [];
      const sum = (fn: (r: PayrollRow) => number) => rows.reduce((s, r) => s + (Number(fn(r)) || 0), 0);
      const gross = sum(grossPay);
      const parts: [string, number][] = [
        ['Basic salaries', sum((r) => r.basicSalary)],
        ['Allowances', sum((r) => r.allowances)],
        ['Overtime', sum((r) => r.overtimePay)],
        ['Bonuses', sum((r) => r.bonus)]
      ];
      return view(
        [
          { label: 'Payslips this month', value: String(rows.length), hint: `${rows.filter((r) => statusIs(r.status, ['PAID'])).length} paid` },
          { label: 'Gross pay', value: rows.length ? formatMoney(gross, currency) : '—', hint: 'Basic, allowances, OT & bonus' },
          { label: 'Net pay', value: rows.length ? formatMoney(sum((r) => r.netPay), currency) : '—', hint: 'After deductions & tax' }
        ],
        toDistribution('Gross pay composition', parts.filter(([, n]) => n > 0), (n) => formatMoney(n, currency)),
        'Gross pay composition'
      );
    }
    case 'Claims': {
      const claims = data.claims ?? [];
      const pending = claims.filter((c) => statusIs(c.status, ['PENDING', 'SUBMITTED']));
      const approved = claims.filter((c) => statusIs(c.status, ['APPROVED', 'PAID']));
      return view(
        [
          { label: 'Pending claims', value: String(pending.length), hint: `${plural(claims.length, 'claim')} in total` },
          { label: 'Pending value', value: moneyByCurrency(pending, (c) => c.amount, (c) => c.currency, currency), hint: 'Awaiting decision' },
          { label: 'Approved value', value: moneyByCurrency(approved, (c) => c.amount, (c) => c.currency, currency), hint: 'Approved or paid' }
        ],
        toDistribution('Claims by category', countBy(claims, (c) => c.category), (n) => plural(n, 'claim')),
        'Claims by category'
      );
    }
    case 'Benefits': {
      const enrollments = data.benefits ?? [];
      const active = enrollments.filter((e) => statusIs(e.status, ['ACTIVE', 'ENROLLED', 'APPROVED']));
      return view(
        [
          { label: 'Enrollments', value: String(enrollments.length), hint: `${active.length} active` },
          { label: 'Employees enrolled', value: String(new Set(enrollments.map((e) => e.employeeId)).size), hint: employees.length ? `of ${plural(employees.length, 'employee')}` : 'Unique staff' },
          { label: 'Plans in use', value: String(new Set(enrollments.map((e) => e.planId)).size), hint: 'With at least one enrollment' }
        ],
        toDistribution('Enrollments by plan', countBy(enrollments, (e) => e.planName), (n) => plural(n, 'enrollment')),
        'Enrollments by plan'
      );
    }
    case 'Helpdesk & Inquiries': {
      const tickets = data.helpdesk ?? [];
      const open = tickets.filter((t) => !isClosed(t.status));
      return view(
        [
          { label: 'Open tickets', value: String(open.length), hint: `${plural(tickets.length, 'ticket')} in total` },
          { label: 'Urgent / high', value: String(open.filter((t) => statusIs(t.priority, ['URGENT', 'HIGH', 'CRITICAL'])).length), hint: 'Open tickets' },
          { label: 'Unassigned', value: String(open.filter((t) => !t.assigneeEmployeeId).length), hint: 'Open tickets' }
        ],
        toDistribution('Tickets by category', countBy(tickets, (t) => t.category), (n) => plural(n, 'ticket')),
        'Tickets by category'
      );
    }
    case 'Performance': {
      const reviews = data.reviews ?? [];
      const scores = reviews.map((r) => r.score).filter((s): s is number => typeof s === 'number');
      return view(
        [
          { label: 'Reviews', value: String(reviews.length), hint: `${new Set(reviews.map((r) => r.employeeId)).size} employees reviewed` },
          { label: 'Average score', value: scores.length ? (scores.reduce((s, n) => s + n, 0) / scores.length).toFixed(1) : '—', hint: 'Scored reviews' },
          { label: 'Completed', value: String(reviews.filter((r) => isClosed(r.status) || statusIs(r.status, ['SUBMITTED', 'FINALIZED', 'APPROVED'])).length), hint: 'Review status' }
        ],
        toDistribution('Reviews by rating', countBy(reviews, (r) => r.rating), (n) => plural(n, 'review')),
        'Reviews by rating'
      );
    }
    case 'Training': {
      const trainings = data.trainings ?? [];
      const upcoming = trainings.filter((t) => t.startDate && dateOnly(t.startDate) >= today);
      const hours = trainings.reduce((s, t) => s + (t.durationHours ?? 0), 0);
      return view(
        [
          { label: 'Programmes', value: String(trainings.length), hint: 'All trainings' },
          { label: 'Upcoming', value: String(upcoming.length), hint: 'Starting today or later' },
          { label: 'Scheduled hours', value: hours ? `${hours} hrs` : '—', hint: 'Sum of programme durations' }
        ],
        toDistribution('Programmes by format', countBy(trainings, (t) => t.mode), (n) => plural(n, 'programme')),
        'Programmes by format'
      );
    }
    case 'Assets': {
      const assets = data.assets ?? [];
      const assigned = assets.filter((a) => !!a.assignedToId);
      const priced = assets.filter((a) => typeof a.purchasePrice === 'number');
      return view(
        [
          { label: 'Assets', value: String(assets.length), hint: 'Registered items' },
          { label: 'Assigned', value: String(assigned.length), hint: `${assets.length - assigned.length} unassigned` },
          { label: 'Purchase value', value: priced.length ? formatMoney(priced.reduce((s, a) => s + (a.purchasePrice ?? 0), 0), currency) : '—', hint: 'Recorded purchase prices' }
        ],
        toDistribution('Assets by category', countBy(assets, (a) => a.category), (n) => plural(n, 'item')),
        'Assets by category'
      );
    }
    default:
      return { stats: [], distribution: null, distributionTitle: '', emptyMessage: 'No data yet.' };
  }
}

function resolveReportKind(reportName: string, selectedModule: string): string {
  const lower = reportName.toLowerCase();
  if (lower.includes('pdf') || lower.includes('booklet') || lower.includes('summary report') || lower.includes('trend outlook')) return 'Briefing';
  const checks: [string, string[]][] = [
    ['Payroll', ['payroll']],
    ['Attendance', ['attendance']],
    ['Leave', ['leave']],
    ['Performance', ['performance', 'appraisal']],
    ['Assets', ['asset']],
    ['Recruitment', ['recruitment', 'candidate']],
    ['On/Off-boarding', ['on/off', 'onboarding']],
    ['Claims', ['claim']],
    ['Disciplinary', ['disciplinary']],
    ['Benefits', ['benefit']],
    ['Helpdesk & Inquiries', ['helpdesk', 'inquir']],
    ['Engagement', ['engage']],
    ['Training', ['train']],
    ['Learning', ['learn']]
  ];
  const match = checks.find(([, words]) => words.some((w) => lower.includes(w)));
  if (match) return match[0];
  if (MODULE_SOURCES[selectedModule] !== undefined && selectedModule !== 'Employee') return selectedModule;
  return 'Employee';
}

function buildModuleCsv(kind: string, employees: Employee[], data: LoadedData, currency: string): CsvTable | string {
  if (NO_SOURCE_MODULES[kind]) return `${NO_SOURCE_MODULES[kind]} Nothing to export.`;
  const sources = MODULE_SOURCES[kind] ?? [];
  if (sources.length > 0 && sources.every((k) => data[k] === null)) return `Could not load ${kind.toLowerCase()} data.`;

  const index = employeeIndex(employees);
  const empOf = (...keys: (string | null | undefined)[]) => keys.map((k) => (k ? index.get(k) : undefined)).find(Boolean);
  const amt = (n: number | null | undefined) => (n === null || n === undefined ? '' : formatAmount(n, currency));

  switch (kind) {
    case 'Payroll':
      return {
        headers: ['Employee ID', 'Name', 'Department', 'Pay Period', `Basic Salary (${currency})`, `Allowances (${currency})`, `Overtime Pay (${currency})`, `Bonus (${currency})`, `Deductions (${currency})`, `Tax (${currency})`, `Net Pay (${currency})`, 'Status'],
        rows: (data.payroll ?? []).map((r) => [
          r.employeeCode,
          r.employeeName,
          str(empOf(r.employeeId, r.employeeCode)?.department),
          `${r.payYear}-${String(r.payMonth).padStart(2, '0')}`,
          amt(r.basicSalary),
          amt(r.allowances),
          amt(r.overtimePay),
          amt(r.bonus),
          amt(r.deductions),
          amt(r.tax),
          amt(r.netPay),
          titleCase(r.status)
        ])
      };
    case 'Attendance':
      return {
        headers: ['Employee ID', 'Name', 'Department', 'Work Date', 'Status', 'Clock-in', 'Clock-out', 'Work Hours', 'Notes'],
        rows: (data.attendance ?? []).map((l) => {
          const emp = empOf(l.employeeId);
          return [str(emp?.id), str(emp?.name), str(emp?.department), l.workDate, titleCase(l.status), str(l.checkInTime), str(l.checkOutTime), str(l.workHours), str(l.notes)];
        })
      };
    case 'Leave':
      return {
        headers: ['Employee ID', 'Name', 'Department', 'Leave Type', 'Start Date', 'End Date', 'Status', 'Reason', 'Submitted'],
        rows: (data.pendingLeave ?? []).map((l) => {
          const emp = empOf(l.employeeId);
          return [str(emp?.id), l.employeeName, str(emp?.department), l.leaveType, l.startDate, l.endDate, titleCase(l.status), str(l.reason), dateOnly(l.createdAt)];
        })
      };
    case 'Performance':
      return {
        headers: ['Employee ID', 'Name', 'Department', 'Review Year', 'Quarter', 'Review Type', 'Score', 'Rating', 'Reviewer', 'Status'],
        rows: (data.reviews ?? []).map((r) => {
          const emp = empOf(r.employeeId);
          return [str(emp?.id), r.employeeName, str(emp?.department), str(r.reviewYear), r.reviewQuarter ? `Q${r.reviewQuarter}` : '', str(r.reviewType), str(r.score), str(r.rating), str(r.reviewerName), titleCase(r.status)];
        })
      };
    case 'Assets':
      return {
        headers: ['Asset Code', 'Name', 'Category', 'Brand', 'Model', 'Serial Number', 'Assigned To', 'Department', 'Condition', 'Location', 'Purchase Date', `Purchase Price (${currency})`],
        rows: (data.assets ?? []).map((a) => [
          a.assetCode,
          a.name,
          str(a.category),
          str(a.brand),
          str(a.model),
          str(a.serialNumber),
          str(a.assignedToName),
          str(empOf(a.assignedToId)?.department),
          str(a.assetCondition),
          str(a.location),
          dateOnly(a.purchaseDate),
          amt(a.purchasePrice)
        ])
      };
    case 'Recruitment':
      return {
        headers: ['Candidate', 'Email', 'Job', 'Source', 'Stage', 'Status', 'Rating', 'Applied'],
        rows: (data.candidates ?? []).map((c) => [c.fullName, c.email, str(c.jobTitle), str(c.source), titleCase(c.stage), titleCase(c.status), str(c.rating), dateOnly(c.appliedAt)])
      };
    case 'On/Off-boarding':
      return {
        headers: ['Employee ID', 'Name', 'Department', 'Task', 'Due Date', 'Status', 'Completed'],
        rows: (data.onboarding ?? []).map((t) => {
          const emp = empOf(t.employeeId);
          return [str(emp?.id), t.employeeName, str(emp?.department), t.title, dateOnly(t.dueDate), titleCase(t.status), dateOnly(t.completedAt)];
        })
      };
    case 'Claims':
      return {
        headers: ['Employee ID', 'Name', 'Department', 'Category', 'Claim Date', 'Amount', 'Currency', 'Vendor', 'Description', 'Status'],
        rows: (data.claims ?? []).map((c) => {
          const emp = empOf(c.employeeId);
          return [str(emp?.id), c.employeeName, str(c.departmentName ?? emp?.department), c.category, dateOnly(c.claimDate), formatAmount(c.amount, c.currency || currency), c.currency || currency, str(c.vendor), str(c.description), titleCase(c.status)];
        })
      };
    case 'Disciplinary':
      return {
        headers: ['Employee ID', 'Name', 'Department', 'Reason', 'Action', 'Severity', 'Incident Date', 'Status'],
        rows: (data.disciplinary ?? []).map((c) => {
          const emp = empOf(c.employeeId);
          return [str(emp?.id), c.employeeName, str(emp?.department), c.reason, str(c.actionType), str(c.severity), dateOnly(c.incidentDate), titleCase(c.status)];
        })
      };
    case 'Benefits':
      return {
        headers: ['Employee ID', 'Name', 'Department', 'Plan', 'Status', 'Enrolled', 'Notes'],
        rows: (data.benefits ?? []).map((e) => {
          const emp = empOf(e.employeeId);
          return [str(emp?.id), e.employeeName, str(emp?.department), e.planName, titleCase(e.status), dateOnly(e.enrolledAt), str(e.notes)];
        })
      };
    case 'Helpdesk & Inquiries':
      return {
        headers: ['Subject', 'Requester', 'Category', 'Priority', 'Status', 'Assignee', 'Created', 'Updated', 'Replies'],
        rows: (data.helpdesk ?? []).map((t) => [t.subject, str(t.requesterName), str(t.category), str(t.priority), titleCase(t.status), str(t.assigneeName), dateOnly(t.createdAt), dateOnly(t.updatedAt), String(t.replies?.length ?? 0)])
      };
    case 'Training':
      return {
        headers: ['Programme', 'Category', 'Trainer', 'Format', 'Location', 'Start Date', 'End Date', 'Duration (hrs)', 'Max Participants', `Cost (${currency})`, 'Status'],
        rows: (data.trainings ?? []).map((t) => [t.title, str(t.category), str(t.trainer), str(t.mode), str(t.location), dateOnly(t.startDate), dateOnly(t.endDate), str(t.durationHours), str(t.maxParticipants), amt(t.cost), titleCase(t.status)])
      };
    default:
      return {
        headers: ['Employee ID', 'Name', 'Department', 'Position', 'Employment Status', 'Status', 'Join Date', 'NRIC/Passport', 'Mobile Number', 'Company Email', 'Home Address', 'Emergency Contact'],
        rows: employees.map((emp) => [
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
          emp.address,
          emp.emergencyContact
        ])
      };
  }
}

function buildBriefing(employees: Employee[], data: LoadedData, summary: ReportSummary | null, currency: string): string {
  const now = new Date();
  const rule = '------------------------------------------------------------------------';
  let text = `========================================================================
NOVORA - MANAGEMENT BRIEFING
Generated: ${now.toLocaleDateString('en-GB')} ${now.toLocaleTimeString()}
Classification: CONFIDENTIAL - MANAGEMENT LEVEL
Currency: ${currency}
========================================================================

1. ORGANISATION SUMMARY
${rule}
Employees on record: ${employees.length}
Active employees: ${employees.filter((e) => e.status === 'Active').length}`;

  if (summary) {
    text += `
Pending leave requests: ${summary.pendingLeave}
Open jobs: ${summary.openJobs}
Candidates in pipeline: ${summary.candidates}
Claims pending: ${summary.claimsPending}
Payroll headcount this month: ${summary.payrollHeadcountThisMonth}`;
  }

  text += `\n\n${rule}\n2. DEPARTMENT BREAKDOWN\n${rule}`;
  const depts = countBy(employees, (e) => e.department);
  if (depts.length === 0) {
    text += '\n  No employee records yet.';
  } else {
    depts.forEach(([dept, count]) => {
      const percent = Math.round((count / employees.length) * 100);
      text += `\n  - ${dept}: ${count} (${percent}% of total)`;
    });
  }

  text += `\n\n${rule}\n3. MODULE METRICS & FOCUS AREAS\n${rule}`;
  Object.keys(MODULE_BRIEFS).forEach((mod) => {
    const brief = MODULE_BRIEFS[mod];
    const moduleView = buildModuleView(mod, employees, data, currency);
    const metrics = moduleView.emptyMessage
      ? `  ${moduleView.emptyMessage}`
      : moduleView.stats.map((s) => `  - ${s.label}: ${s.value}`).join('\n');
    text += `\n[${mod.toUpperCase()}]
- Strategic Focus: ${brief.strategicFocus}
- Current Metrics:
${metrics}
- Suggested Directives:
${brief.actionableDirectives.map((d, idx) => `  ${idx + 1}. ${d}`).join('\n')}
${rule}`;
  });

  text += `\n\n========================================================================\nEND OF BRIEFING\n========================================================================`;
  return text;
}

type BuilderKind = 'employee' | 'attendance' | 'leave' | 'payroll' | 'performance';

const BUILDER_FIELDS: Record<BuilderKind, [string, boolean][]> = {
  employee: [['Employee No.', true], ['Full Name', true], ['Department', true], ['Position', true], ['Employment Type', false], ['Status', false], ['Join Date', false], ['Email', false]],
  attendance: [['Employee No.', true], ['Full Name', true], ['Work Date', true], ['Clock-in Time', true], ['Clock-out Time', true], ['Work Hours', false], ['Status', false]],
  leave: [['Employee No.', true], ['Employee Name', true], ['Leave Type', true], ['Start Date', true], ['End Date', true], ['Status', false], ['Reason', false]],
  payroll: [['Employee No.', true], ['Full Name', true], ['Pay Period', false], ['Basic Salary', true], ['Allowances', true], ['Overtime Pay', false], ['Deductions', false], ['Tax', false], ['Net Pay', true]],
  performance: [['Staff Name', true], ['Review Period', true], ['Review Type', false], ['Score', true], ['Rating', true], ['Reviewer', false], ['Status', false]]
};

const BUILDER_MONEY_FIELDS = ['Basic Salary', 'Allowances', 'Overtime Pay', 'Deductions', 'Tax', 'Net Pay'];

const BUILDER_SOURCES: Record<BuilderKind, DataKey[]> = {
  employee: [],
  attendance: ['attendance'],
  leave: ['pendingLeave'],
  payroll: ['payroll'],
  performance: ['reviews']
};

function builderKindOf(module: string): BuilderKind {
  const lower = module.toLowerCase();
  if (lower.includes('attendance')) return 'attendance';
  if (lower.includes('leave')) return 'leave';
  if (lower.includes('payroll')) return 'payroll';
  if (lower.includes('performance')) return 'performance';
  return 'employee';
}

const fieldsFor = (kind: BuilderKind) => Object.fromEntries(BUILDER_FIELDS[kind]) as Record<string, boolean>;

function nextRunLabel(frequency: string, time: string): string {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  let hour = match ? Number(match[1]) % 12 : 0;
  if (match && match[3].toUpperCase() === 'PM') hour += 12;
  const minute = match ? Number(match[2]) : 0;
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
  if (frequency === 'Monthly') {
    next.setMonth(now.getMonth() + 1, 1);
  } else if (frequency === 'Quarterly') {
    next.setMonth(Math.floor(now.getMonth() / 3) * 3 + 3, 1);
  } else if (next <= now) {
    next.setDate(next.getDate() + (frequency === 'Weekly' ? 7 : 1));
  }
  return `${next.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} ${time.split(' ')[0]}`;
}

const DEFAULT_SCHEDULE_FORM = {
  type: 'Monthly payroll summary',
  frequency: 'Monthly',
  time: '06:00 AM',
  format: 'CSV (.csv)',
  recipients: ''
};

export default function ReportsTab({
  employees,
  addToast,
  activeSubTab,
  setActiveSubTab,
}: ReportsTabProps) {
  const { currency } = useCurrency();

  // Navigation State
  const [localActiveSidebarTab, setLocalActiveSidebarTab] = useState<'centre' | 'scheduled' | 'builder'>('centre');
  const activeSidebarTab = activeSubTab !== undefined ? activeSubTab : localActiveSidebarTab;
  const setActiveSidebarTab = setActiveSubTab !== undefined ? setActiveSubTab : setLocalActiveSidebarTab;
  const [selectedModule, setSelectedModule] = useState<string>('All Overview');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [moduleSearch, setModuleSearch] = useState<string>('');

  // Stats Counters
  const [totalCustomSaved, setTotalCustomSaved] = useState<number>(0);
  const [reportSummary, setReportSummary] = useState<ReportSummary | null>(null);
  const [summaryLoadedAt, setSummaryLoadedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const summary = await fetchReportSummary()
        if (!cancelled) {
          setReportSummary(summary)
          setSummaryLoadedAt(nowTime())
        }
      } catch (err) {
        if (!(err instanceof ApiError) || (err.status !== 401 && err.status !== 403)) {
          addToast('Could not load report summary.', 'error')
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [addToast])

  const dataRef = useRef<LoadedData>({});
  const inflightRef = useRef<Partial<Record<DataKey, Promise<void>>>>({});
  const [reportData, setReportData] = useState<LoadedData>({});
  const [moduleLoadedAt, setModuleLoadedAt] = useState<Record<string, string>>({});

  const ensureData = useCallback(async (keys: DataKey[]): Promise<LoadedData> => {
    const pending = keys.map((key) => {
      if (key in dataRef.current) return null;
      if (!inflightRef.current[key]) {
        inflightRef.current[key] = (DATA_LOADERS[key] as () => Promise<unknown>)()
          .catch(() => null)
          .then((result) => {
            dataRef.current = { ...dataRef.current, [key]: result };
            delete inflightRef.current[key];
            setReportData(dataRef.current);
          });
      }
      return inflightRef.current[key];
    });
    await Promise.all(pending);
    return dataRef.current;
  }, []);

  useEffect(() => {
    if (selectedModule === 'All Overview') return;
    let cancelled = false;
    ensureData(MODULE_SOURCES[selectedModule] ?? []).then(() => {
      if (!cancelled) setModuleLoadedAt((prev) => ({ ...prev, [selectedModule]: nowTime() }));
    });
    return () => {
      cancelled = true;
    };
  }, [selectedModule, ensureData]);

  const moduleView = useMemo(
    () => (selectedModule === 'All Overview' ? null : buildModuleView(selectedModule, employees, reportData, currency)),
    [selectedModule, employees, reportData, currency]
  );

  const departmentOptions = useMemo(() => departmentNames(employees), [employees]);

  // Scheduled Reports List State
  const [schedules, setSchedules] = useState<ReportSchedule[]>([]);

  // Scheduled Report Editor State
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  const [scheduleForm, setScheduleForm] = useState(DEFAULT_SCHEDULE_FORM);

  // Recent Action Activity Stack
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  // Custom Builder Form Configuration State
  const [builderModule, setBuilderModule] = useState<string>('Employee management');
  const [builderCombine, setBuilderCombine] = useState({
    attendance: false,
    leave: false,
    payroll: false,
    performance: false
  });

  // Dynamically populated checklist depending on primary module
  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>(() => fieldsFor('employee'));

  const [filterFromDate, setFilterFromDate] = useState(yearStartIso);
  const [filterToDate, setFilterToDate] = useState(todayIso);
  const [filterDept, setFilterDept] = useState('All departments');
  const [filterStatus, setFilterStatus] = useState('Active only');
  const [sortBy, setSortBy] = useState('Employee No.');
  const [builderFormat, setBuilderFormat] = useState('CSV (.csv)');

  // Module filter options
  const horizontalModules = [
    'All Overview',
    'Employee',
    'Recruitment',
    'On/Off-boarding',
    'Attendance',
    'Leave',
    'Disciplinary',
    'Payroll',
    'Claims',
    'Benefits',
    'Helpdesk & Inquiries',
    'Performance',
    'Engagement',
    'Training',
    'Learning',
    'Assets'
  ];

  // Helper trigger action on form change when builderModule swaps
  const handleBuilderModuleChange = (newModule: string) => {
    setBuilderModule(newModule);
    setSelectedFields(fieldsFor(builderKindOf(newModule)));
  };

  const saveFile = (reportName: string, fileName: string, content: string, fileType: string, successText: string) => {
    try {
      const blob = new Blob([content], { type: fileType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addToast(successText, 'success');

      const timestamp = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short'
      }) + ' ' + nowTime();

      setRecentActivities(prev => {
        const newAct: RecentActivity = {
          id: createLocalId('rpt'),
          name: reportName,
          user: 'You',
          timestamp,
          success: true,
          fileName,
          fileType,
          content
        };
        return [newAct, ...prev.filter(act => act.name !== reportName)].slice(0, 6);
      });
    } catch (err) {
      console.error('File generation failure:', err);
      addToast('The browser blocked the file download.', 'error');
    }
  };

  const toCsv = (table: CsvTable) =>
    [
      table.headers.join(','),
      ...table.rows.map(row => row.map(val => `"${(val ?? '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

  const fileBaseName = (reportName: string) =>
    reportName
      .replace(/[^a-zA-Z0-9_\-\s]/g, '')
      .trim()
      .replace(/\s+/g, '_');

  // Trigger download actions
  const triggerDownloadLog = async (reportName: string) => {
    const kind = resolveReportKind(reportName, selectedModule);
    const keys = kind === 'Briefing' ? ALL_DATA_KEYS : (MODULE_SOURCES[kind] ?? []);
    if (keys.some(k => !(k in dataRef.current))) {
      addToast(`Loading data for ${reportName}…`, 'loading');
    }
    const data = await ensureData(keys);

    if (kind === 'Briefing') {
      saveFile(
        reportName,
        `${fileBaseName(reportName)}.txt`,
        buildBriefing(employees, data, reportSummary, currency),
        'text/plain;charset=utf-8;',
        `Downloaded "${reportName}" as a text briefing.`
      );
      return;
    }

    const table = buildModuleCsv(kind, employees, data, currency);
    if (typeof table === 'string') {
      addToast(table, 'info');
      return;
    }
    if (table.rows.length === 0) {
      addToast(`No ${kind.toLowerCase()} records to export yet.`, 'info');
      return;
    }
    saveFile(
      reportName,
      `${fileBaseName(reportName)}.csv`,
      toCsv(table),
      'text/csv;charset=utf-8;',
      `Downloaded "${reportName}" (${plural(table.rows.length, 'row')}).`
    );
  };

  const redownloadActivity = (act: RecentActivity) => {
    saveFile(act.name, act.fileName, act.content, act.fileType, `Downloaded "${act.name}" again.`);
  };

  // Schedule handles
  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();

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
            recipients: scheduleForm.recipients,
            nextRun: nextRunLabel(scheduleForm.frequency, scheduleForm.time)
          };
        }
        return s;
      }));
      addToast('Schedule updated for this session only. Automatic delivery is not connected yet.', 'success');
      setEditingScheduleId(null);
    } else {
      const isDuplicated = schedules.some(s => s.type === scheduleForm.type && s.frequency === scheduleForm.frequency);
      if (isDuplicated) {
        addToast(`A schedule of "${scheduleForm.type}" on frequency "${scheduleForm.frequency}" already exists.`, 'info');
      }

      setSchedules(prev => [
        ...prev,
        {
          id: createLocalId('sch'),
          name: scheduleForm.type,
          type: scheduleForm.type,
          frequency: scheduleForm.frequency,
          time: scheduleForm.time,
          format: scheduleForm.format,
          recipients: scheduleForm.recipients,
          nextRun: nextRunLabel(scheduleForm.frequency, scheduleForm.time)
        }
      ]);
      addToast(`Schedule for "${scheduleForm.type}" kept for this session only. Reports are not sent automatically yet; use the download button to run it now.`, 'success');
    }

    setScheduleForm(DEFAULT_SCHEDULE_FORM);
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

  const handleCustomBuilderRun = async () => {
    const fieldsSelected = Object.entries(selectedFields).filter(([_, val]) => val).map(([key]) => key);
    if (fieldsSelected.length === 0) {
      addToast('Select at least one field to export in section 2.', 'error');
      return;
    }

    const kind = builderKindOf(builderModule);
    const combineKeys: DataKey[] = [
      ...(builderCombine.attendance && kind !== 'attendance' ? ['attendance' as const] : []),
      ...(builderCombine.leave && kind !== 'leave' ? ['pendingLeave' as const] : []),
      ...(builderCombine.payroll && kind !== 'payroll' ? ['payroll' as const] : []),
      ...(builderCombine.performance && kind !== 'performance' ? ['reviews' as const] : [])
    ];
    const keys = [...BUILDER_SOURCES[kind], ...combineKeys];
    if (keys.some(k => !(k in dataRef.current))) {
      addToast(`Loading data for ${builderModule}…`, 'loading');
    }
    const data = await ensureData(keys);
    if (BUILDER_SOURCES[kind].some(k => data[k] === null)) {
      addToast(`Could not load ${builderModule.toLowerCase()} data.`, 'error');
      return;
    }

    const index = employeeIndex(employees);
    const amt = (n: number | null | undefined) => (n === null || n === undefined ? '' : formatAmount(n, currency));
    type BuilderRow = { employee: Employee | undefined; date: string | null; values: Record<string, string> };
    let rows: BuilderRow[] = [];

    if (kind === 'employee') {
      rows = employees.map(emp => ({
        employee: emp,
        date: emp.joinDate || null,
        values: {
          'Employee No.': emp.id,
          'Full Name': emp.name,
          'Department': emp.department,
          'Position': emp.position,
          'Employment Type': emp.employmentStatus,
          'Status': emp.status,
          'Join Date': emp.joinDate,
          'Email': emp.email
        }
      }));
    } else if (kind === 'attendance') {
      rows = (data.attendance ?? []).map(l => {
        const emp = index.get(l.employeeId);
        return {
          employee: emp,
          date: l.workDate,
          values: {
            'Employee No.': str(emp?.id),
            'Full Name': str(emp?.name),
            'Work Date': l.workDate,
            'Clock-in Time': str(l.checkInTime),
            'Clock-out Time': str(l.checkOutTime),
            'Work Hours': str(l.workHours),
            'Status': titleCase(l.status)
          }
        };
      });
    } else if (kind === 'leave') {
      rows = (data.pendingLeave ?? []).map(l => {
        const emp = index.get(l.employeeId);
        return {
          employee: emp,
          date: l.startDate,
          values: {
            'Employee No.': str(emp?.id),
            'Employee Name': l.employeeName,
            'Leave Type': l.leaveType,
            'Start Date': l.startDate,
            'End Date': l.endDate,
            'Status': titleCase(l.status),
            'Reason': str(l.reason)
          }
        };
      });
    } else if (kind === 'payroll') {
      rows = (data.payroll ?? []).map(r => {
        const emp = index.get(r.employeeId) ?? index.get(r.employeeCode);
        const period = `${r.payYear}-${String(r.payMonth).padStart(2, '0')}`;
        return {
          employee: emp,
          date: `${period}-01`,
          values: {
            'Employee No.': r.employeeCode,
            'Full Name': r.employeeName,
            'Pay Period': period,
            'Basic Salary': amt(r.basicSalary),
            'Allowances': amt(r.allowances),
            'Overtime Pay': amt(r.overtimePay),
            'Deductions': amt(r.deductions),
            'Tax': amt(r.tax),
            'Net Pay': amt(r.netPay)
          }
        };
      });
    } else {
      rows = (data.reviews ?? []).map(r => ({
        employee: index.get(r.employeeId),
        date: r.createdAt ? dateOnly(r.createdAt) : null,
        values: {
          'Staff Name': r.employeeName,
          'Review Period': r.reviewQuarter ? `${r.reviewYear} Q${r.reviewQuarter}` : String(r.reviewYear),
          'Review Type': str(r.reviewType),
          'Score': str(r.score),
          'Rating': str(r.rating),
          'Reviewer': str(r.reviewerName),
          'Status': titleCase(r.status)
        }
      }));
    }

    const statusFilter: Record<string, Employee['status']> = { 'Active only': 'Active', 'On Leave': 'On Leave', 'Inactive': 'Inactive' };
    rows = rows.filter(row => {
      if (row.date && filterFromDate && row.date < filterFromDate) return false;
      if (row.date && filterToDate && row.date > filterToDate) return false;
      if (filterDept !== 'All departments' && row.employee?.department !== filterDept) return false;
      const wantedStatus = statusFilter[filterStatus];
      if (wantedStatus && row.employee?.status !== wantedStatus) return false;
      return true;
    });

    const sortKey = (row: BuilderRow) => {
      if (sortBy === 'Full Name') return row.employee?.name ?? row.values['Full Name'] ?? row.values['Employee Name'] ?? row.values['Staff Name'] ?? '';
      if (sortBy === 'Join Date') return row.employee?.joinDate ?? '';
      if (sortBy === 'Department') return row.employee?.department ?? '';
      return row.employee?.id ?? row.values['Employee No.'] ?? '';
    };
    rows.sort((a, b) => sortKey(a).localeCompare(sortKey(b)));

    const headers = fieldsSelected.map(f => (BUILDER_MONEY_FIELDS.includes(f) ? `${f} (${currency})` : f));
    const combineHeaders: string[] = [];
    const combineValues: ((emp: Employee | undefined) => string)[] = [];
    if (combineKeys.includes('attendance')) {
      combineHeaders.push('Attendance Today');
      combineValues.push(emp => {
        const log = emp?.apiId ? (data.attendance ?? []).find(l => l.employeeId === emp.apiId) : undefined;
        return log ? titleCase(log.status) : '';
      });
    }
    if (combineKeys.includes('pendingLeave')) {
      combineHeaders.push('Pending Leave Requests');
      combineValues.push(emp => (emp?.apiId && data.pendingLeave ? String(data.pendingLeave.filter(l => l.employeeId === emp.apiId).length) : ''));
    }
    if (combineKeys.includes('payroll')) {
      combineHeaders.push(`Net Pay This Month (${currency})`);
      combineValues.push(emp => {
        const slip = emp ? (data.payroll ?? []).find(r => r.employeeId === emp.apiId || r.employeeCode === emp.id) : undefined;
        return slip ? amt(slip.netPay) : '';
      });
    }
    if (combineKeys.includes('reviews')) {
      combineHeaders.push('Latest Review Score');
      combineValues.push(emp => {
        const latest = (data.reviews ?? [])
          .filter(r => emp?.apiId && r.employeeId === emp.apiId)
          .sort((a, b) => (b.reviewYear - a.reviewYear) || ((b.reviewQuarter ?? 0) - (a.reviewQuarter ?? 0)))[0];
        return latest ? str(latest.score) : '';
      });
    }

    if (rows.length === 0) {
      addToast(`No ${builderModule.toLowerCase()} records match the selected filters.`, 'info');
      return;
    }

    const table: CsvTable = {
      headers: [...headers, ...combineHeaders],
      rows: rows.map(row => [
        ...fieldsSelected.map(f => row.values[f] ?? ''),
        ...combineValues.map(fn => fn(row.employee))
      ])
    };
    const reportName = `Custom: ${builderModule} (${sortBy})`;
    const formatNote = builderFormat.startsWith('CSV') ? '' : ` ${builderFormat.split(' ')[0]} export is not available yet, so it was saved as CSV.`;
    saveFile(
      reportName,
      `${fileBaseName(reportName)}.csv`,
      toCsv(table),
      'text/csv;charset=utf-8;',
      `Exported ${plural(table.rows.length, 'row')} with ${plural(table.headers.length, 'column')}.${formatNote}`
    );
  };

  return (
    <div id="reports-hub-main-frame" className="w-full animate-in fade-in duration-150">
      <ModuleHeader
        title="Reports"
        description="Insights and exports across all modules."
      />
      <div className="nv-card p-1.5 mb-5 flex flex-wrap gap-1">
        {(
          [
            { id: 'centre' as const, label: 'Report centre' },
          ] as const
        ).map((tab) => {
          const isActive = activeSidebarTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSidebarTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-novora text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* ==================== RIGHT PANEL: MAIN REPORTS BOARD ==================== */}
      <section id="reports-hub-main-board" className="w-full space-y-6">
        
        {/* Novora Reports Center Header Banner */}
        <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-xs">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Report catalogue</h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Browse templates by module and schedule deliveries.
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
                          ? 'bg-novora text-white shadow-xs'
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
                  className="w-full pl-9 pr-3 py-2 text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-100 focus:border-novora focus:bg-white rounded-xl outline-none transition-all"
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
                        ? 'bg-novora text-white border-novora shadow-xs transform scale-[1.02]'
                        : 'bg-white text-slate-700 border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                    title={mod.desc}
                  >
                    <IconComponent className={`h-4 w-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-novora'}`} />
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
            
            {/* Horizontal Metric Cards — live report summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'Employees', value: reportSummary?.employees ?? employees.length, hint: 'Active headcount' },
                { label: 'Pending leave', value: reportSummary?.pendingLeave ?? '—', hint: 'Awaiting approval' },
                { label: 'Open jobs', value: reportSummary?.openJobs ?? '—', hint: 'Live postings' },
                { label: 'Candidates', value: reportSummary?.candidates ?? '—', hint: 'In pipeline' },
                { label: 'Claims pending', value: reportSummary?.claimsPending ?? '—', hint: 'Finance queue' },
                { label: 'Payroll HC', value: reportSummary?.payrollHeadcountThisMonth ?? '—', hint: 'This month' },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-white border border-slate-100 p-5 rounded-3xl shadow-xs relative">
                  <span className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight block">{kpi.value}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-2">{kpi.label}</span>
                  <span className="text-[11px] text-slate-400 font-semibold block mt-1">{kpi.hint}</span>
                </div>
              ))}
            </div>

            {/* Layout Grid Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Aspect: MOST USED REPORTS */}
              <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Most Used Reports</h3>
                  <p className="text-[10px] text-slate-400 italic">CSV exports built from live records</p>
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
                      <p className="text-[11px] text-slate-500 font-medium">This month&apos;s earnings, deductions and net pay per employee</p>
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
                      <p className="text-[11px] text-slate-500 font-medium">Today&apos;s clock-in, clock-out, hours and status per employee</p>
                    </div>
                    <Download className="h-4 w-4 text-slate-400" />
                  </div>

                  {/* Leave requests summary */}
                  <div 
                    onClick={() => triggerDownloadLog('Leave requests summary')}
                    className="p-4 border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 rounded-2xl flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800">Leave requests summary</span>
                        <span className="bg-amber-55 text-[9px] font-bold text-amber-700 px-2 py-0.5 rounded-md">LEAVE</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">Leave requests awaiting approval, by employee and type</p>
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
                        <span className="bg-novora/10 text-[9px] font-bold text-novora px-2 py-0.5 rounded-md">PERFORMANCE</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">Review scores, ratings and status</p>
                    </div>
                    <Download className="h-4 w-4 text-slate-400" />
                  </div>

                </div>
              </div>

              {/* Right Aspect: BOARD BRIEFING, RECENT ACTIVITY & EXPORT FORMATS */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* LIVE SUMMARY FROM API */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-800/85 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-novora/15 p-1.5 rounded-xl">
                        <Sparkles className="h-4 w-4 text-novora" />
                      </div>
                      <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider block font-sans">Live summary</h3>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase px-2 py-0.5 rounded-full inline-flex items-center whitespace-nowrap shrink-0">
                      {summaryLoadedAt ? `Loaded ${summaryLoadedAt}` : 'API'}
                    </span>
                  </div>

                  <div className="space-y-4 font-sans">
                    <div className="space-y-1">
                      <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest block">organisation pulse</span>
                      <p className="text-[11.5px] font-medium text-slate-300 leading-relaxed">
                        {reportSummary
                          ? `${reportSummary.employees} employees · ${reportSummary.pendingLeave} pending leave · ${reportSummary.claimsPending} claims pending · ${reportSummary.payrollHeadcountThisMonth} on this month’s payroll.`
                          : 'Loading live report counters from the server…'}
                      </p>
                    </div>

                    <div className="border-t border-slate-800 pt-4 space-y-3">
                      <span className="text-[9px] font-extrabold text-novora uppercase tracking-widest block">Focus areas</span>
                      <ul className="space-y-2.5">
                        <li className="flex gap-2.5 items-start text-[11px] text-slate-300 leading-normal font-medium">
                          <span className="bg-novora/20 text-[#3b82f6] text-[10px] font-black h-4.5 w-4.5 shrink-0 rounded-full flex items-center justify-center font-mono border border-blue-500/10">1</span>
                          <span className="flex-1 mt-0.5">Clear pending leave and claims queues before month close.</span>
                        </li>
                        <li className="flex gap-2.5 items-start text-[11px] text-slate-300 leading-normal font-medium">
                          <span className="bg-novora/20 text-[#3b82f6] text-[10px] font-black h-4.5 w-4.5 shrink-0 rounded-full flex items-center justify-center font-mono border border-blue-500/10">2</span>
                          <span className="flex-1 mt-0.5">Review open jobs ({reportSummary?.openJobs ?? '—'}) and candidates ({reportSummary?.candidates ?? '—'}) in Recruitment.</span>
                        </li>
                        <li className="flex gap-2.5 items-start text-[11px] text-slate-300 leading-normal font-medium">
                          <span className="bg-novora/20 text-[#3b82f6] text-[10px] font-black h-4.5 w-4.5 shrink-0 rounded-full flex items-center justify-center font-mono border border-blue-500/10">3</span>
                          <span className="flex-1 mt-0.5">Confirm payroll headcount matches active employee roster.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* RECENT ACTIVITY */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4 overflow-visible">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Activity</h3>
                  </div>

                  <div className="divide-y divide-slate-50">
                    {recentActivities.length === 0 && (
                      <p className="text-[11px] text-slate-400 font-semibold">No downloads yet this session.</p>
                    )}
                    {recentActivities.map((act) => (
                      <div key={act.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                        <div className="space-y-0.5">
                          <span className="text-xs font-semibold text-slate-800 block">{act.name}</span>
                          <span className="text-[10.5px] text-slate-400 font-bold shrink-0 block">
                            {act.user} &bull; {act.timestamp}
                          </span>
                        </div>
                        <button 
                          onClick={() => redownloadActivity(act)}
                          className="text-novora hover:text-blue-700 text-xs font-extrabold cursor-pointer"
                        >
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* EXPORT FORMATS */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4 overflow-visible">
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
        {activeSidebarTab === 'centre' && selectedModule !== 'All Overview' && (
          <div
            id="report-individual-module"
            className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xs animate-in fade-in duration-250"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800">{selectedModule} reports</h3>
                {MODULE_BRIEFS[selectedModule] && (
                  <p className="mt-2 max-w-xl text-sm text-slate-500">{MODULE_BRIEFS[selectedModule].strategicFocus}</p>
                )}
              </div>
              {moduleLoadedAt[selectedModule] && !moduleView?.emptyMessage && (
                <span className="rounded-full bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-500">
                  Loaded {moduleLoadedAt[selectedModule]}
                </span>
              )}
            </div>

            {moduleView?.emptyMessage ? (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
                <AlertCircle className="mx-auto h-5 w-5 text-slate-300" />
                <p className="mt-2 text-xs font-semibold text-slate-500">{moduleView.emptyMessage}</p>
              </div>
            ) : (
              moduleView && (
                <div className="mt-5 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {moduleView.stats.map((stat) => (
                      <div key={stat.label} className="bg-white border border-slate-100 p-5 rounded-3xl shadow-xs relative">
                        <span className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight block break-words">{stat.value}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-2">{stat.label}</span>
                        <span className="text-[11px] text-slate-400 font-semibold block mt-1">{stat.hint}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border border-slate-100 rounded-3xl p-6 space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{moduleView.distribution?.title ?? moduleView.distributionTitle}</h4>
                    {moduleView.distribution ? (
                      <div className="space-y-3">
                        {moduleView.distribution.items.map((item) => (
                          <div key={item.label} className="space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] font-semibold">
                              <span className="text-slate-700">{item.label}</span>
                              <span className="text-slate-500">{item.value} · {item.percent}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                              <div className={`h-full rounded-full ${item.colorClass}`} style={{ width: `${item.percent}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 font-semibold">No data yet.</p>
                    )}
                  </div>
                </div>
              )
            )}

            {MODULE_BRIEFS[selectedModule] && (
              <div className="mt-6 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Focus areas</span>
                <ul className="space-y-1.5">
                  {MODULE_BRIEFS[selectedModule].actionableDirectives.map((d) => (
                    <li key={d} className="text-[11.5px] text-slate-600 font-medium leading-relaxed">• {d}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              {!NO_SOURCE_MODULES[selectedModule] && (
                <button
                  type="button"
                  onClick={() => triggerDownloadLog(`${selectedModule} report`)}
                  className="inline-flex items-center gap-2 rounded-xl bg-novora px-3 py-2 text-xs font-semibold text-white hover:bg-opacity-95 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download CSV
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedModule('All Overview')}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-novora/30 hover:text-novora cursor-pointer"
              >
                Back to overview
              </button>
            </div>
          </div>
        )}

        {/* ==================== VIEW 3: SCHEDULED REPORTS VIEW ==================== */}
        {activeSidebarTab === 'scheduled' && (
          <div id="scheduled-reports-view" className="space-y-6 animate-in fade-in duration-200">
            
            {/* SCHEDULE NEW REPORT form block */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4 overflow-visible">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Schedule New Report</h3>
              
              <form onSubmit={handleSaveSchedule} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Report Type */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Report type</label>
                    <SelectMenu
                      value={scheduleForm.type}
                      onChange={(v) => setScheduleForm(prev => ({ ...prev, type: v }))}
                      triggerClassName="bg-slate-50 border-slate-200 rounded-2xl py-3 text-xs font-bold"
                      options={[
                        { value: 'Monthly payroll summary', label: 'Monthly payroll summary (Consolidated)' },
                        { value: 'Attendance summary', label: 'Attendance summary (Today)' },
                        { value: 'Leave requests summary', label: 'Leave requests (Pending approval)' },
                        { value: 'Performance appraisal results', label: 'Performance metrics summary (Executive)' },
                        { value: 'Recruitment funnel state', label: 'Recruitment funnel status report' },
                      ]}
                    />
                  </div>

                  {/* Frequency */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Frequency</label>
                    <SelectMenu
                      value={scheduleForm.frequency}
                      onChange={(v) => setScheduleForm(prev => ({ ...prev, frequency: v }))}
                      triggerClassName="bg-slate-50 border-slate-200 rounded-2xl py-3 text-xs font-bold"
                      options={[
                        { value: 'Daily', label: 'Daily automatic run' },
                        { value: 'Weekly', label: 'Weekly consolidated runs' },
                        { value: 'Monthly', label: 'Monthly ledger generation' },
                        { value: 'Quarterly', label: 'Quarterly business reviews' },
                      ]}
                    />
                  </div>

                  {/* Delivery Time */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Delivery time</label>
                    <SelectMenu
                      value={scheduleForm.time}
                      onChange={(v) => setScheduleForm(prev => ({ ...prev, time: v }))}
                      triggerClassName="bg-slate-50 border-slate-200 rounded-2xl py-3 text-xs font-bold"
                      options={[
                        { value: '06:00 AM', label: '06:00 AM (Early operational review)' },
                        { value: '09:00 AM', label: '09:00 AM (Standard morning dispatch)' },
                        { value: '12:00 PM', label: '12:00 PM (Mid-day sync run)' },
                        { value: '05:00 PM', label: '05:00 PM (Operational wrap-up)' },
                      ]}
                    />
                  </div>

                  {/* Format */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Format</label>
                    <SelectMenu
                      value={scheduleForm.format}
                      onChange={(v) => setScheduleForm(prev => ({ ...prev, format: v }))}
                      triggerClassName="bg-slate-50 border-slate-200 rounded-2xl py-3 text-xs font-bold"
                      options={[
                        { value: 'Excel (.xlsx)', label: 'Excel Spreadsheet (.xlsx)' },
                        { value: 'CSV (.csv)', label: 'Raw Comma Separated Table (.csv)' },
                        { value: 'PDF (.pdf)', label: 'Formatted Executive Booklet (.pdf)' },
                      ]}
                    />
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
                      className="w-full bg-slate-50 border border-slate-200 focus:border-novora transition-colors rounded-2xl pl-11 pr-4 py-3 text-xs font-bold text-slate-700 outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium pl-1">Separate multiple email addresses with a comma. Schedules are kept for this session only and are not emailed automatically yet.</p>
                </div>

                {/* Submit button bar */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-novora hover:bg-opacity-95 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {editingScheduleId ? <CheckCircle className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    <span>{editingScheduleId ? 'Update Run Schedule' : 'Save Schedule'}</span>
                  </button>
                </div>
              </form>

            </div>

            {/* ACTIVE SCHEDULES LIST */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4 overflow-visible">
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
                          <td className="py-3.5 px-4.5 text-slate-700">{sch.frequency}</td>
                          <td className="py-3.5 px-4.5">
                            <span className="bg-blue-50 text-novora text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center whitespace-nowrap shrink-0">
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
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4 overflow-visible">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-extrabold text-sm font-mono">1.</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data Source</span>
              </div>

              <div className="space-y-4.5">
                {/* Primary selection */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary module</label>
                  <SelectMenu
                    value={builderModule}
                    onChange={handleBuilderModuleChange}
                    triggerClassName="bg-slate-50 border-slate-200 rounded-2xl py-3"
                    options={[
                      { value: 'Employee management', label: 'Employee management' },
                      { value: 'Attendance log module', label: 'Attendance data records' },
                      { value: 'Leave tracking module', label: 'Leave tracker systems' },
                      { value: 'Payroll processing', label: 'Payroll ledger systems' },
                      { value: 'Performance scorecard', label: 'Performance appraisals' },
                    ]}
                  />
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
                        <CheckSquare className="h-4.5 w-4.5 text-novora" />
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
                        <CheckSquare className="h-4.5 w-4.5 text-novora" />
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
                        <CheckSquare className="h-4.5 w-4.5 text-novora" />
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
                        <CheckSquare className="h-4.5 w-4.5 text-novora" />
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
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4 overflow-visible">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-extrabold text-sm font-mono">2.</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span>Select Fields</span>
                  <span className="bg-blue-50 text-[8px] px-1.5 py-0.5 text-blue-600 rounded">
                    {builderModule.substring(0, 8).toUpperCase()}
                  </span>
                </span>
              </div>

              <div className="space-y-2.5 text-xs font-semibold text-slate-700 max-h-48 overflow-y-auto pr-1">
                {Object.entries(selectedFields).map(([fieldName, isChecked]) => (
                  <div
                    key={fieldName}
                    onClick={() => setSelectedFields(prev => ({ ...prev, [fieldName]: !prev[fieldName] }))}
                    className="flex items-center justify-between p-2.5 border border-slate-50/75 hover:border-slate-100 hover:bg-slate-50/30 rounded-xl cursor-pointer select-none"
                  >
                    <span>{fieldName}</span>
                    {isChecked ? (
                      <CheckCircle className="h-4.5 w-4.5 text-novora" />
                    ) : (
                      <div className="h-4.5 w-4.5 rounded-full border-2 border-slate-200 inline-flex items-center shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* STAGE 3: FILTERS */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4 overflow-visible">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-extrabold text-sm font-mono">3.</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filters</span>
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
                      className="bg-slate-50 border border-slate-200 focus:border-novora rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none w-full"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">To date</label>
                    <input
                      type="date"
                      value={filterToDate}
                      onChange={(e) => setFilterToDate(e.target.value)}
                      className="bg-slate-50 border border-slate-200 focus:border-novora rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none w-full"
                    />
                  </div>
                </div>

                {/* Filters Dropdowns */}
                <div className="flex flex-col space-y-1">
                  <label className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">Department</label>
                  <SelectMenu
                    value={filterDept}
                    onChange={setFilterDept}
                    triggerClassName="bg-slate-50 border-slate-200 rounded-xl py-2 text-xs font-bold"
                    options={[
                      { value: 'All departments', label: 'All departments' },
                      ...departmentOptions.map((dept) => ({ value: dept, label: dept })),
                    ]}
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">Employment Status</label>
                  <SelectMenu
                    value={filterStatus}
                    onChange={setFilterStatus}
                    triggerClassName="bg-slate-50 border-slate-200 rounded-xl py-2 text-xs font-bold"
                    options={[
                      { value: 'All statuses', label: 'All personnel records' },
                      { value: 'Active only', label: 'Active rosters only' },
                      { value: 'On Leave', label: 'On leaves list' },
                      { value: 'Inactive', label: 'Terminated or retired' },
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* STAGE 4: OUTPUT */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4 overflow-visible">
              <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-extrabold text-sm font-mono">4.</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Output</span>
              </div>

              <div className="space-y-4">
                {/* Sort fields */}
                <div className="flex flex-col space-y-1">
                  <label className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">Sort by</label>
                  <SelectMenu
                    value={sortBy}
                    onChange={setSortBy}
                    triggerClassName="bg-slate-50 border-slate-200 rounded-xl py-2 text-xs font-bold"
                    options={[
                      { value: 'Employee No.', label: 'Employee No. Sequence' },
                      { value: 'Full Name', label: 'Full Name alphabetically' },
                      { value: 'Join Date', label: 'Hire Joining Chronology' },
                      { value: 'Department', label: 'Department Sectors group' },
                    ]}
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">Format</label>
                  <SelectMenu
                    value={builderFormat}
                    onChange={setBuilderFormat}
                    triggerClassName="bg-slate-50 border-slate-200 rounded-xl py-2 text-xs font-bold"
                    options={[
                      { value: 'Excel (.xlsx)', label: 'Excel Spreadsheet (.xlsx)' },
                      { value: 'CSV (.csv)', label: 'Raw Comma Separated (.csv)' },
                      { value: 'PDF (.pdf)', label: 'Printable Executive Layout (.pdf)' },
                    ]}
                  />
                </div>

                {/* Submitting custom construction request */}
                <div className="pt-2">
                  <button
                    onClick={handleCustomBuilderRun}
                    className="w-full bg-novora hover:bg-opacity-95 text-white font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs"
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
                  setSelectedFields(fieldsFor('employee'));
                  setBuilderCombine({ attendance: false, leave: false, payroll: false, performance: false });
                  setFilterFromDate(yearStartIso());
                  setFilterToDate(todayIso());
                  setFilterDept('All departments');
                  setFilterStatus('Active only');
                  setSortBy('Employee No.');
                  setBuilderFormat('CSV (.csv)');
                  addToast('Builder reset to defaults.', 'info');
                }}
                className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-extrabold text-xs cursor-pointer transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset to Default</span>
              </button>

              <button
                onClick={() => {
                  setTotalCustomSaved(prev => prev + 1);
                  addToast(`Builder settings for "${builderModule}" kept for this session only.`, 'success');
                }}
                className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
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

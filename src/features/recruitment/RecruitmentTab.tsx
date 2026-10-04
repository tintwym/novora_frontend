import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createLocalId } from '@/lib/createLocalId'
import {
  Briefcase,
  Users,
  CalendarDays,
  Coins,
  ShieldCheck,
  FileBarChart,
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
  Search,
  Plus,
  Eye,
  Check,
  CheckSquare,
  AlertCircle,
  FileCheck,
  Send,
  UserPlus,
  ArrowRight,
  TrendingUp,
  Percent,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Award,
  Upload,
  Video,
  Phone,
  MapPin,
  User,
  Mail,
  Printer,
  Calendar,
} from 'lucide-react';
import type {
  JobRequisition,
  JobPosting,
  Candidate,
  Interview,
  Offer,
  PreOnboarding,
} from '@/mocks/mockRecruitment'
import {
  ApiError,
  createRecruitmentCandidate,
  createRecruitmentInterview,
  createRecruitmentJob,
  createRecruitmentOffer,
  fetchCandidateAiSummary,
  fetchRecruitmentCandidates,
  fetchRecruitmentInterviews,
  fetchRecruitmentJdDraft,
  fetchRecruitmentJobs,
  fetchRecruitmentOffers,
  type CandidateSummaryResponse,
  type RecruitmentCandidateRow,
  type RecruitmentInterviewRow,
  type RecruitmentJobRow,
  type RecruitmentOfferRow,
} from '@/services'
import ModuleHeader from '@/components/ui/ModuleHeader'
import { DropdownAnchor, SelectMenu} from '@/components/ui'
import { dateStamp, downloadCsv, downloadNearestTableCsv } from '@/lib/csv';
import type { Employee } from '@/types'
import { useCurrency } from '@/hooks/useCurrency'

function mapJobStatus(status: string): JobPosting['status'] {
  const s = status.toLowerCase()
  if (s === 'closed' || s === 'filled') return 'Closed'
  if (s === 'on_hold') return 'On hold'
  return 'Live'
}

function mapJobRow(j: RecruitmentJobRow): JobPosting {
  return {
    id: j.id,
    position: j.title,
    channel: j.published ? 'Careers portal' : 'Draft',
    views: 0,
    applicants: Number(j.applicantCount || 0),
    status: mapJobStatus(j.status),
    department: j.departmentName || '—',
  }
}

function mapCandidateStage(stage: string): Candidate['stage'] {
  const s = stage.toLowerCase()
  if (s === 'screening') return 'Screening'
  if (s === 'interview') return 'Phone interview'
  if (s === 'technical' || s === 'hr_interview') return 'Panel interview'
  if (s === 'offer') return 'Offer'
  if (s === 'hired') return 'Hired'
  return 'Applied'
}

function mapCandidateRow(c: RecruitmentCandidateRow): Candidate {
  const applied = c.appliedAt ? new Date(c.appliedAt).toLocaleDateString() : '—'
  return {
    id: c.id,
    name: c.fullName,
    experience: '—',
    education: '—',
    source: c.source || 'other',
    matchScore: '—',
    stage: mapCandidateStage(c.stage),
    appliedDate: applied,
    positionApplied: c.jobTitle || '—',
  }
}

function mapInterviewMode(mode: string | null): Interview['format'] {
  const m = (mode || '').toLowerCase()
  if (m === 'phone') return 'Phone'
  if (m === 'in_person' || m === 'in-person' || m === 'in person') return 'In person'
  return 'Video'
}

function mapInterviewStatus(status: string): Interview['status'] {
  const s = status.toLowerCase()
  if (s === 'completed') return 'Completed'
  if (s === 'pending' || s === 'scheduled') return 'Pending'
  if (s === 'no_show' || s === 'no-show') return 'No show'
  return 'Confirmed'
}

function mapInterviewRow(
  row: RecruitmentInterviewRow,
  candidatesById: Map<string, Candidate>,
): Interview {
  const scheduled = row.scheduledAt ? new Date(row.scheduledAt) : null
  const candidate = candidatesById.get(row.candidateId)
  return {
    id: row.id,
    candidateName: row.candidateName || candidate?.name || '—',
    position: candidate?.positionApplied || '—',
    stage: row.round || 'Interview',
    date: scheduled ? scheduled.toLocaleDateString() : '—',
    time: scheduled
      ? scheduled.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '—',
    format: mapInterviewMode(row.mode),
    status: mapInterviewStatus(row.status),
  }
}

function mapOfferStatus(status: string): Offer['status'] {
  const s = status.toLowerCase()
  if (s === 'accepted') return 'Accepted'
  if (s === 'declined') return 'Declined'
  if (s === 'draft') return 'Draft'
  return 'Sent'
}

type OfferItem = Offer & { currency: string | null }

function mapOfferRow(row: RecruitmentOfferRow): OfferItem {
  return {
    id: row.id,
    candidateName: row.candidateName || '—',
    position: '—',
    salary: row.salary != null ? Number(row.salary).toLocaleString() : '—',
    sentDate: row.sentAt ? new Date(row.sentAt).toLocaleDateString() : '—',
    expiryDate: row.expiryDate ? new Date(row.expiryDate).toLocaleDateString() : '—',
    status: mapOfferStatus(row.status),
    allowance: row.allowance != null ? String(row.allowance) : '—',
    grade: row.grade || '—',
    probation: row.probation || '—',
    currency: row.currency,
  }
}

function formatToApiMode(format: Interview['format']): string {
  if (format === 'Phone') return 'phone'
  if (format === 'In person') return 'in_person'
  return 'video'
}

function buildScheduledAtIso(date: string, time: string): string {
  const datePart = date?.trim() || dateStamp()
  const raw = (time || '09:00').trim()
  const ampm = raw.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
  let hours = 9
  let minutes = 0
  if (ampm) {
    hours = Number(ampm[1]) % 12
    if (/pm/i.test(ampm[3])) hours += 12
    minutes = Number(ampm[2])
  } else {
    const parts = raw.match(/(\d{1,2}):(\d{2})/)
    if (parts) {
      hours = Number(parts[1])
      minutes = Number(parts[2])
    }
  }
  const hh = String(hours).padStart(2, '0')
  const mm = String(minutes).padStart(2, '0')
  const local = new Date(`${datePart}T${hh}:${mm}:00`)
  if (Number.isNaN(local.getTime())) return new Date().toISOString()
  return local.toISOString()
}

function parseSalary(raw: string): number | undefined {
  const n = Number(String(raw).replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) && n > 0 ? n : undefined
}

function sourceToApi(source: string): string {
  const s = source.toLowerCase()
  if (s.includes('linkedin')) return 'linkedin'
  if (s.includes('refer')) return 'referral'
  if (s.includes('agency')) return 'agency'
  if (s.includes('walk')) return 'walk_in'
  if (s.includes('web') || s.includes('career') || s.includes('jobstreet') || s.includes('indeed')) {
    return 'website'
  }
  return 'other'
}

const PIPELINE_STAGES = ['Applied', 'Screening', 'Phone interview', 'Panel interview', 'Offer', 'Hired'] as const

const ALL_PERIODS = 'All periods'

const QUARTER_RANGES = ['1 Jan - 31 Mar', '1 Apr - 30 Jun', '1 Jul - 30 Sep', '1 Oct - 31 Dec']

function formatSourceLabel(source: string | null | undefined): string {
  const raw = (source || 'other').replace(/_/g, ' ').trim()
  return raw.charAt(0).toUpperCase() + raw.slice(1)
}

function quarterKey(date: Date): string {
  return `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`
}

function quarterLabel(key: string): string {
  const q = Number(key.slice(1, 2))
  return `${key} (${QUARTER_RANGES[q - 1] ?? ''})`
}

function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

function inPeriod(value: string | null | undefined, period: string): boolean {
  if (period === ALL_PERIODS) return true
  const d = parseDate(value)
  return d ? quarterKey(d) === period : false
}

function isJobClosed(job: RecruitmentJobRow): boolean {
  const s = job.status.toLowerCase()
  return s === 'closed' || s === 'filled'
}

function jobCycleDays(job: RecruitmentJobRow): number | null {
  const start = parseDate(job.openDate || job.createdAt)
  const end = parseDate(job.closeDate)
  if (!start || !end) return null
  const days = Math.round((end.getTime() - start.getTime()) / 86400000)
  return days >= 0 ? days : null
}

function stageIndex(stage: string): number {
  return PIPELINE_STAGES.indexOf(mapCandidateStage(stage))
}

function pct(part: number, whole: number): number {
  return whole > 0 ? Math.round((part / whole) * 100) : 0
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}

function createEmptyReqForm() {
  return {
    positionTitle: '',
    department: 'HR',
    sectionTeam: '',
    reportsTo: '',
    employmentType: 'Permanent',
    workArrangement: 'On-site',
    jobGrade: 'G-5 / Sub B',
    vacancies: '1',
    targetFillDate: '',
    urgency: 'Normal',
    salaryMin: '',
    salaryMax: '',
    reason: 'New headcount',
    justification: '',
    minEducation: "Bachelor's degree",
    fieldOfStudy: '',
    minExperience: 'Fresh graduate (0 yrs)',
    languageRequirement: 'English only',
    skills: [] as string[],
    newSkillInput: '',
    responsibilities: '',
    niceToHave: '',
    channels: {
      internal: true,
      jobstreet: true,
      linkedin: true,
      indeed: false,
      agency: false,
    },
    notifySubmit: true,
    notifyAction: true,
    autoPublish: true,
    notifyHrTeam: false,
    primaryRecruiter: '',
    hiringManager: '',
  }
}

interface RecruitmentTabProps {
  addToast: (text: string, type: 'success' | 'loading' | 'error' | 'info') => void;
  onAddEmployeeAsRecord: (newEmp: any) => void;
  employees?: Employee[];
}

export default function RecruitmentTab({ addToast, onAddEmployeeAsRecord, employees }: RecruitmentTabProps) {
  const { currency } = useCurrency();
  const [activeSubTab, setActiveSubTab] = useState<string>('Job Requisition');
  const [searchValue, setSearchValue] = useState<string>('');
  const [deptFilter, setDeptFilter] = useState<string>('All departments');
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [pipelinePosition, setPipelinePosition] = useState('All positions');
  const [pipelineSource, setPipelineSource] = useState('All sources');
  const [pipelinePositionOpen, setPipelinePositionOpen] = useState(false);
  const [pipelineSourceOpen, setPipelineSourceOpen] = useState(false);

  // Interactive Reports Tab filters
  const [reportFilterDept, setReportFilterDept] = useState<string>('All departments');
  const [reportFilterPeriod, setReportFilterPeriod] = useState<string>(ALL_PERIODS);
  const [reportSearchQuery, setReportSearchQuery] = useState<string>('');

  // Core Data states
  const [requisitions, setRequisitions] = useState<JobRequisition[]>([]);
  const [postings, setPostings] = useState<JobPosting[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [preOnboardings, setPreOnboardings] = useState<PreOnboarding[]>([]);
  const [recruitmentLoading, setRecruitmentLoading] = useState(true);

  // Selection states
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('');
  const [selectedInterviewId, setSelectedInterviewId] = useState<string>('');
  const [selectedOfferId, setSelectedOfferId] = useState<string>('');
  const [selectedPreOnboardId, setSelectedPreOnboardId] = useState<string>('');
  const [candidateRows, setCandidateRows] = useState<RecruitmentCandidateRow[]>([]);
  const [jobRows, setJobRows] = useState<RecruitmentJobRow[]>([]);
  const [interviewRows, setInterviewRows] = useState<RecruitmentInterviewRow[]>([]);
  const [offerRows, setOfferRows] = useState<RecruitmentOfferRow[]>([]);
  const [aiJdBusy, setAiJdBusy] = useState(false);
  const [aiPostJdBusy, setAiPostJdBusy] = useState(false);
  const [aiCandBusy, setAiCandBusy] = useState(false);
  const [candidateAiSummary, setCandidateAiSummary] = useState<CandidateSummaryResponse | null>(null);

  const upcomingInterviewCount = useMemo(
    () => interviews.filter((i) => i.status === 'Pending' || i.status === 'Confirmed').length,
    [interviews],
  );

  const sourceBreakdown = useMemo(() => {
    const colors = ['bg-blue-600', 'bg-novora', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-slate-400'];
    const counts = new Map<string, number>();
    for (const c of candidates) {
      const label = formatSourceLabel(c.source);
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }
    const total = candidates.length;
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([label, count], idx) => ({
        label,
        count,
        pct: total > 0 ? Math.round((count / total) * 100) : 0,
        color: colors[Math.min(idx, colors.length - 1)],
      }));
  }, [candidates]);

  const departmentOptions = useMemo(() => {
    const set = new Set<string>();
    for (const r of requisitions) if (r.department && r.department !== '—') set.add(r.department);
    for (const p of postings) if (p.department && p.department !== '—') set.add(p.department);
    for (const j of jobRows) if (j.departmentName) set.add(j.departmentName);
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [requisitions, postings, jobRows]);

  const pipelinePositionOptions = useMemo(() => {
    const set = new Set<string>();
    for (const c of candidates) if (c.positionApplied && c.positionApplied !== '—') set.add(c.positionApplied);
    for (const p of postings) if (p.position) set.add(p.position);
    return ['All positions', ...[...set].sort((a, b) => a.localeCompare(b))];
  }, [candidates, postings]);

  const pipelineSourceOptions = useMemo(
    () => ['All sources', ...sourceBreakdown.map((s) => s.label)],
    [sourceBreakdown],
  );

  const peopleOptions = useMemo(() => {
    if (employees && employees.length > 0) {
      const seen = new Set<string>();
      return employees
        .filter((e) => e.name && e.status !== 'Inactive')
        .map((e) => (e.position ? `${e.name} (${e.position})` : e.name))
        .filter((label) => (seen.has(label) ? false : (seen.add(label), true)))
        .sort((a, b) => a.localeCompare(b));
    }
    const set = new Set<string>();
    for (const r of requisitions) if (r.requestedBy && r.requestedBy !== '—') set.add(r.requestedBy);
    for (const i of interviewRows) if (i.interviewerName) set.add(i.interviewerName);
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [employees, requisitions, interviewRows]);

  const personSelectOptions = useMemo(
    () => [{ value: '', label: '-- Not assigned --' }, ...peopleOptions.map((p) => ({ value: p, label: p }))],
    [peopleOptions],
  );

  const reportPeriodOptions = useMemo(() => {
    const keys = new Set<string>([quarterKey(new Date())]);
    const add = (value: string | null | undefined) => {
      const d = parseDate(value);
      if (d) keys.add(quarterKey(d));
    };
    jobRows.forEach((j) => add(j.openDate || j.createdAt));
    candidateRows.forEach((c) => add(c.appliedAt));
    interviewRows.forEach((i) => add(i.scheduledAt));
    offerRows.forEach((o) => add(o.sentAt || o.createdAt));
    const sorted = [...keys].sort((a, b) => {
      const [qa, ya] = [Number(a.slice(1, 2)), Number(a.slice(3))];
      const [qb, yb] = [Number(b.slice(1, 2)), Number(b.slice(3))];
      return yb - ya || qb - qa;
    });
    return [
      { value: ALL_PERIODS, label: 'All periods' },
      ...sorted.map((k) => ({ value: k, label: quarterLabel(k) })),
    ];
  }, [jobRows, candidateRows, interviewRows, offerRows]);

  const reportData = useMemo(() => {
    const deptMatch = (dept: string | null | undefined) =>
      reportFilterDept === 'All departments' || (dept || '') === reportFilterDept;
    const jobById = new Map(jobRows.map((j) => [j.id, j]));
    const candDept = new Map(
      candidateRows.map((c) => [c.id, jobById.get(c.jobPostingId)?.departmentName ?? null]),
    );

    const jobs = jobRows.filter(
      (j) => deptMatch(j.departmentName) && inPeriod(j.openDate || j.createdAt, reportFilterPeriod),
    );
    const cands = candidateRows.filter(
      (c) => deptMatch(candDept.get(c.id)) && inPeriod(c.appliedAt, reportFilterPeriod),
    );
    const ints = interviewRows.filter(
      (i) => deptMatch(candDept.get(i.candidateId)) && inPeriod(i.scheduledAt, reportFilterPeriod),
    );
    const offs = offerRows.filter(
      (o) => deptMatch(candDept.get(o.candidateId)) && inPeriod(o.sentAt || o.createdAt, reportFilterPeriod),
    );

    const closedJobs = jobs.filter(isJobClosed);
    const cycleDays = closedJobs.map(jobCycleDays).filter((d): d is number => d != null);
    const avgDays = cycleDays.length
      ? Math.round(cycleDays.reduce((s, d) => s + d, 0) / cycleDays.length)
      : null;

    const accepted = offs.filter((o) => o.status.toLowerCase() === 'accepted').length;
    const decided = offs.filter((o) => o.status.toLowerCase() !== 'draft').length;
    const acceptPct = pct(accepted, decided);

    const reached = PIPELINE_STAGES.map((_, idx) => cands.filter((c) => stageIndex(c.stage) >= idx).length);
    const funnelSteps = [
      { label: 'Applied → Screen Match', suffix: 'matched', from: reached[0], to: reached[1], bar: 'bg-novora', text: 'text-novora' },
      { label: 'Screened → Phone Scheduled', suffix: 'advanced', from: reached[1], to: reached[2], bar: 'bg-indigo-500', text: 'text-indigo-600' },
      { label: 'Phone scheduled → Board Panel Interview', suffix: 'approved', from: reached[2], to: reached[3], bar: 'bg-sky-500', text: 'text-sky-600' },
      { label: 'Panel approved → Extended Contract Offer', suffix: 'recommended', from: reached[3], to: reached[4], bar: 'bg-amber-500', text: 'text-amber-600' },
      { label: 'Contract Offer → Ultimate Hired / Starter', suffix: 'hired', from: reached[4], to: reached[5], bar: 'bg-emerald-500', text: 'text-emerald-600' },
    ].map((s) => ({ ...s, pct: pct(s.to, s.from) }));

    const deptDays = new Map<string, number[]>();
    for (const j of closedJobs) {
      const d = jobCycleDays(j);
      if (d == null) continue;
      const key = j.departmentName || '—';
      deptDays.set(key, [...(deptDays.get(key) ?? []), d]);
    }
    const deptSpeed = [...deptDays.entries()]
      .map(([dept, list]) => ({ dept, days: Math.round(list.reduce((s, d) => s + d, 0) / list.length) }))
      .sort((a, b) => b.days - a.days);
    const maxDeptDays = deptSpeed.reduce((m, d) => Math.max(m, d.days), 0);

    const rows = jobs.map((job) => {
      const jobCands = candidateRows.filter((c) => c.jobPostingId === job.id);
      const candIds = new Set(jobCands.map((c) => c.id));
      const jobInts = interviewRows.filter((i) => candIds.has(i.candidateId));
      const offerCandIds = new Set(offerRows.filter((o) => candIds.has(o.candidateId)).map((o) => o.candidateId));
      const recruiters = [...new Set(jobInts.map((i) => i.interviewerName).filter((n): n is string => !!n))];
      const done = isJobClosed(job);
      const days = jobCycleDays(job);
      return {
        reqId: job.id,
        position: job.title,
        dept: job.departmentName || '—',
        recruiter: recruiters.join(', ') || '—',
        spent: '—',
        timeToClose: done && days != null ? `${days} days` : 'Pending',
        funnel: {
          applied: jobCands.length,
          screened: jobCands.filter((c) => stageIndex(c.stage) >= 1).length,
          interview: jobCands.filter((c) => stageIndex(c.stage) >= 2 || jobInts.some((i) => i.candidateId === c.id)).length,
          offer: jobCands.filter((c) => stageIndex(c.stage) >= 4 || offerCandIds.has(c.id)).length,
          hired: jobCands.filter((c) => stageIndex(c.stage) === 5).length,
        },
        status: done ? 'Completed' : 'In Progress',
      };
    });

    const statusCount = (status: string) => jobs.filter((j) => j.status.toLowerCase() === status).length;

    return {
      timeToHire: avgDays != null ? `${avgDays} days` : '—',
      timeShift: closedJobs.length ? `${closedJobs.length} closed` : 'No closed roles',
      acceptRate: decided > 0 ? `${acceptPct}%` : '—',
      acceptPct,
      acceptDetail: decided > 0 ? `${accepted}/${decided} accepted` : 'No offers yet',
      totalApplicants: `${cands.length} ${cands.length === 1 ? 'applicant' : 'applicants'}`,
      open: jobs.filter((j) => !isJobClosed(j) && j.status.toLowerCase() !== 'on_hold' && j.status.toLowerCase() !== 'cancelled').length,
      filled: closedJobs.length,
      hold: statusCount('on_hold'),
      cancelled: statusCount('cancelled'),
      interviews: `${ints.length} ${ints.length === 1 ? 'loop' : 'loops'}`,
      offers: `${offs.length} extended`,
      signed: `${accepted} signed`,
      text: `${jobs.length} ${jobs.length === 1 ? 'requisition' : 'requisitions'} in scope`,
      funnelSteps,
      deptSpeed,
      maxDeptDays,
      rows,
    };
  }, [jobRows, candidateRows, interviewRows, offerRows, reportFilterDept, reportFilterPeriod]);

  const loadRecruitment = useCallback(async () => {
    setRecruitmentLoading(true)
    try {
      const [jobs, cands, ints, offs] = await Promise.all([
        fetchRecruitmentJobs(),
        fetchRecruitmentCandidates(),
        fetchRecruitmentInterviews(),
        fetchRecruitmentOffers(),
      ])
      const mappedCandidates = cands.map(mapCandidateRow)
      const byId = new Map(mappedCandidates.map((c) => [c.id, c]))
      setCandidateRows(cands)
      setJobRows(jobs)
      setInterviewRows(ints)
      setOfferRows(offs)
      setPostings(jobs.map(mapJobRow))
      setCandidates(mappedCandidates)
      setInterviews(ints.map((row) => mapInterviewRow(row, byId)))
      setOffers(offs.map(mapOfferRow))
      if (cands.length > 0) {
        setSelectedCandidateId(cands[0].id)
      }
      if (ints.length > 0) {
        setSelectedInterviewId(ints[0].id)
      }
      if (offs.length > 0) {
        setSelectedOfferId(offs[0].id)
      }
      // Map open jobs into requisitions when API data is present
      if (jobs.length > 0) {
        setRequisitions(
          jobs.map((j) => ({
            id: j.id,
            positionTitle: j.title,
            department: j.departmentName || '—',
            type: j.employmentType || 'Permanent',
            requestedBy: '—',
            openDate: j.openDate ? new Date(j.openDate).toLocaleDateString() : '—',
            targetFill: j.closeDate ? new Date(j.closeDate).toLocaleDateString() : '—',
            applicants: Number(j.applicantCount || 0),
            status:
              j.status.toLowerCase() === 'closed' || j.status.toLowerCase() === 'filled'
                ? 'Filled'
                : j.status.toLowerCase() === 'on_hold'
                  ? 'On hold'
                  : 'Open',
          })),
        )
      }
    } catch (err) {
      if (!(err instanceof ApiError) || (err.status !== 401 && err.status !== 403)) {
        addToast('Could not load recruitment data.', 'error')
      }
    } finally {
      setRecruitmentLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    void loadRecruitment()
  }, [loadRecruitment])

  const handleAiJdDraft = async () => {
    if (aiJdBusy) return
    if (!reqForm.positionTitle.trim()) {
      addToast('Enter a position title before drafting the JD.', 'error')
      return
    }
    setAiJdBusy(true)
    addToast('Drafting job description with Gemini…', 'loading')
    try {
      const result = await fetchRecruitmentJdDraft({
        title: reqForm.positionTitle.trim(),
        department: reqForm.department,
        employmentType: reqForm.employmentType,
        location: reqForm.workArrangement || 'On-site',
        experience: reqForm.minExperience,
        education: reqForm.minEducation,
        skills: reqForm.skills.join(', '),
        existingResponsibilities: reqForm.responsibilities,
        niceToHave: reqForm.niceToHave,
        salaryMin: reqForm.salaryMin,
        salaryMax: reqForm.salaryMax,
      })
      setReqForm((prev) => ({ ...prev, responsibilities: result.draft }))
      addToast(
        result.source === 'gemini'
          ? 'JD draft ready — review before publishing.'
          : 'Smart JD draft ready — review before publishing.',
        'success',
      )
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Could not draft JD.', 'error')
    } finally {
      setAiJdBusy(false)
    }
  }

  const handleAiPostJdDraft = async () => {
    if (aiPostJdBusy) return
    if (!newPost.position.trim()) {
      addToast('Enter a position title before drafting the posting.', 'error')
      return
    }
    setAiPostJdBusy(true)
    addToast('Drafting posting summary with Gemini…', 'loading')
    try {
      const result = await fetchRecruitmentJdDraft({
        title: newPost.position.trim(),
        employmentType: newPost.employmentType,
        location: newPost.arrangement,
        skills: newPost.skills,
        existingResponsibilities: newPost.description,
        salaryMin: newPost.salaryMin,
        salaryMax: newPost.salaryMax,
      })
      setNewPost((prev) => ({ ...prev, description: result.draft }))
      addToast(
        result.source === 'gemini'
          ? 'Posting draft ready — review before publish.'
          : 'Smart posting draft ready — review before publish.',
        'success',
      )
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Could not draft posting.', 'error')
    } finally {
      setAiPostJdBusy(false)
    }
  }

  const handleAiCandidateSummary = async () => {
    if (aiCandBusy) return
    const row = candidateRows.find((c) => c.id === selectedCandidateId)
    if (!row) {
      addToast('Select a candidate first.', 'error')
      return
    }
    setAiCandBusy(true)
    addToast(`Summarising ${row.fullName} with Gemini…`, 'loading')
    try {
      const result = await fetchCandidateAiSummary({
        fullName: row.fullName,
        jobTitle: row.jobTitle || undefined,
        stage: row.stage,
        source: row.source || undefined,
        notes: row.notes || undefined,
        rating: row.rating != null ? String(row.rating) : undefined,
        email: row.email,
        phone: row.phone || undefined,
      })
      setCandidateAiSummary(result)
      addToast(
        result.source === 'gemini'
          ? 'Candidate AI summary ready — review before deciding.'
          : 'Smart candidate summary ready — review before deciding.',
        'success',
      )
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Could not summarise candidate.', 'error')
    } finally {
      setAiCandBusy(false)
    }
  }

  // Modal open states
  const [requisitionModalOpen, setRequisitionModalOpen] = useState(false);
  const [postingModalOpen, setPostingModalOpen] = useState(false);
  const [candidateModalOpen, setCandidateModalOpen] = useState(false);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [offerModalOpen, setOfferModalOpen] = useState(false);

  // New Form states
  const [requisitionStep, setRequisitionStep] = useState<1 | 2 | 3>(1);
  const [reqForm, setReqForm] = useState(createEmptyReqForm);

  const [newPost, setNewPost] = useState({
    linkedReqId: '',
    position: '',
    channel: 'LinkedIn',
    employmentType: 'Full-time',
    arrangement: 'On-site',
    salaryMin: '',
    salaryMax: '',
    showSalary: 'Yes — show range',
    description: '',
    skills: '',
    start: dateStamp(),
    end: '',
    channels: {
      internal: true,
      jobstreet: true,
      linkedin: true,
      indeed: false,
      agency: false,
    },
  });

  const [newCand, setNewCand] = useState({
    name: '',
    experience: '',
    education: '',
    source: 'LinkedIn',
    matchScore: '',
    stage: 'Applied' as const,
    positionApplied: '',
  });
  const [candNoticePeriod, setCandNoticePeriod] = useState('Immediate / Available immediately');

  const [newInt, setNewInt] = useState({
    candidateId: '',
    stage: 'Phone screening',
    date: dateStamp(),
    time: '11:00 AM',
    duration: '30 minutes',
    format: 'Video' as 'Video' | 'Phone' | 'In person',
    location: '',
    interviewers: '',
    notes: '',
    sendInvite: true,
    sendReminder: true,
  });

  const [newOffer, setNewOffer] = useState({
    candidateName: '',
    position: '',
    salary: '',
    allowance: '',
    probation: '3 months',
    grade: 'G-5 / Sub B',
    expiryDays: '14',
  });

  const nextReqId = `REQ-${new Date().getFullYear()}-${String(requisitions.length + 1).padStart(3, '0')}`;

  const interviewsOnSelectedDate = useMemo(
    () =>
      interviewRows
        .filter((i) => {
          const d = parseDate(i.scheduledAt);
          return d ? dateStamp(d) === newInt.date : false;
        })
        .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt)),
    [interviewRows, newInt.date],
  );

  // Handle addition callbacks
  const handleCreateRequisition = async (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedTitle = reqForm.positionTitle.trim() || 'Untitled position';
    const reqId = nextReqId;

    // Create the new Job Requisition record (local until requisition API exists)
    const req: JobRequisition = {
      id: reqId,
      positionTitle: resolvedTitle,
      department: reqForm.department,
      type: reqForm.employmentType,
      requestedBy: reqForm.hiringManager.split(' (')[0] || '—',
      openDate: new Date().toLocaleDateString(),
      targetFill: reqForm.targetFillDate,
      applicants: 0,
      status: 'Open',
    };

    setRequisitions([req, ...requisitions]);

    if (reqForm.autoPublish) {
      try {
        const created = await createRecruitmentJob({
          title: resolvedTitle,
          departmentName: reqForm.department,
          employmentType: reqForm.employmentType,
          salaryMin: parseSalary(reqForm.salaryMin),
          salaryMax: parseSalary(reqForm.salaryMax),
          description: reqForm.responsibilities || undefined,
          openings: Number(reqForm.vacancies) || 1,
          publish: true,
        })
        setJobRows((prev) => [created, ...prev])
        setPostings((prev) => [mapJobRow(created), ...prev])
        addToast(`Requisition logged and job posting published for ${resolvedTitle}.`, 'success')
      } catch (err) {
        addToast(
          err instanceof ApiError
            ? `Requisition saved locally, but publish failed: ${err.message}`
            : 'Requisition saved locally, but publish failed.',
          'error',
        )
      }
    } else {
      addToast(
        `Requisition saved for ${resolvedTitle} in this session. Publish it from Job Postings.`,
        'success'
      );
    }

    setRequisitionModalOpen(false);
    // Reset wizard
    setRequisitionStep(1);
    setReqForm(createEmptyReqForm());
  };

  const handleCreatePosting = async (e: React.FormEvent) => {
    e.preventDefault();
    const posTitle = newPost.position || 'New Position';
    const linkedDept = requisitions.find((r) => r.id === newPost.linkedReqId)?.department;
    try {
      const created = await createRecruitmentJob({
        title: posTitle,
        departmentName: linkedDept && linkedDept !== '—' ? linkedDept : 'HR',
        employmentType: newPost.employmentType || 'Full-time',
        salaryMin: parseSalary(newPost.salaryMin),
        salaryMax: parseSalary(newPost.salaryMax),
        description: newPost.description || undefined,
        publish: true,
      })
      setJobRows((prev) => [created, ...prev])
      setPostings((prev) => [mapJobRow(created), ...prev])
      setPostingModalOpen(false)
      addToast(`Job posting active for ${posTitle}.`, 'success')
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Could not create job posting.', 'error')
    }
  };

  const handleCreateCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCand.name) return;

    const openJob =
      postings.find((p) => p.position === newCand.positionApplied) ||
      postings.find((p) => p.status === 'Live') ||
      postings[0]
    if (!openJob) {
      addToast('Create a job posting first, then add candidates.', 'error')
      return
    }

    const emailLocal = newCand.name.toLowerCase().replace(/[^a-z0-9]+/g, '.') || 'candidate'
    try {
      const created = await createRecruitmentCandidate({
        jobPostingId: openJob.id,
        fullName: newCand.name,
        email: `${emailLocal}@applicant.novora.local`,
        source: sourceToApi(newCand.source),
        notes: [newCand.experience.trim(), newCand.education.trim()].filter(Boolean).join('; ') || undefined,
      })
      setCandidateRows((prev) => [created, ...prev])
      setCandidates((prev) => [mapCandidateRow(created), ...prev])
      setCandidateModalOpen(false)
      addToast(`${created.fullName} entered as applicant for ${created.jobTitle || openJob.position}`, 'success')
      setNewCand({
        name: '',
        experience: '',
        education: '',
        source: 'LinkedIn',
        matchScore: '',
        stage: 'Applied',
        positionApplied: openJob.position,
      })
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Could not add candidate.', 'error')
    }
  };

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    const cand = candidates.find(c => c.id === newInt.candidateId) || candidates[0];
    if (!cand?.id) {
      addToast('Select a candidate before scheduling.', 'error')
      return
    }
    try {
      const durationMatch = newInt.duration.match(/(\d+)/)
      const created = await createRecruitmentInterview({
        candidateId: cand.id,
        scheduledAt: buildScheduledAtIso(newInt.date, newInt.time),
        durationMins: durationMatch ? Number(durationMatch[1]) : 30,
        mode: formatToApiMode(newInt.format),
        location: newInt.location || undefined,
        round: newInt.stage.replace(' interview', '').replace(' screening', '') || undefined,
      })
      const byId = new Map(candidates.map((c) => [c.id, c]))
      const item = mapInterviewRow(created, byId)
      setInterviewRows((prev) => [created, ...prev])
      setInterviews((prev) => [item, ...prev])
      setSelectedInterviewId(item.id)
      setInterviewModalOpen(false)
      addToast(`Interview booked for ${cand.name} (${item.time})`, 'success')
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Could not schedule interview.', 'error')
    }
  };

  const handleSendOfferForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOffer.candidateName) return;

    const cand = candidates.find(
      (c) => c.name.toLowerCase() === newOffer.candidateName.trim().toLowerCase(),
    )
    if (!cand?.id) {
      addToast('Could not find that candidate. Pick a name from the list.', 'error')
      return
    }

    const expiryDays = Number(newOffer.expiryDays || '14')
    const expiry = new Date()
    expiry.setDate(expiry.getDate() + (Number.isFinite(expiryDays) ? expiryDays : 14))

    try {
      const created = await createRecruitmentOffer({
        candidateId: cand.id,
        salary: parseSalary(newOffer.salary),
        allowance: parseSalary(newOffer.allowance),
        grade: newOffer.grade || undefined,
        probation: newOffer.probation || undefined,
        status: 'sent',
        expiryDate: dateStamp(expiry),
      })
      const item = mapOfferRow(created)
      // Prefer form position when API does not return one
      if (newOffer.position) item.position = newOffer.position
      setOfferRows((prev) => [created, ...prev])
      setOffers((prev) => [item, ...prev])
      setSelectedOfferId(item.id)
      setOfferModalOpen(false)
      addToast(`Offer recorded as sent for ${newOffer.candidateName}`, 'success')
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Could not send offer.', 'error')
    }
  };

  const handleChecklistToggle = (itemId: string, field: string) => {
    setPreOnboardings(prev => prev.map(item => {
      if (item.id === itemId) {
        const nextChecklist = {
          ...item.checklist,
          [field]: !((item.checklist as any)[field])
        };
        const docsCount = Object.values(nextChecklist).filter(Boolean).length;
        return {
          ...item,
          checklist: nextChecklist,
          docsReceived: docsCount,
          status: docsCount === 8 ? 'Ready to onboard' : 'Docs pending' as any,
        } as PreOnboarding;
      }
      return item;
    }));
    addToast('Updated pre-onboarding document receipt state', 'info');
  };

  const handleConversionToStaff = (item: PreOnboarding | undefined) => {
    if (!item) return;
    const matchedDept = requisitions.find((r) => r.positionTitle === item.position)?.department;
    onAddEmployeeAsRecord({
      id: createLocalId('EMP'),
      name: item.candidateName,
      department: matchedDept && matchedDept !== '—' ? matchedDept : 'HR',
      position: item.position,
      employmentStatus: 'Permanent',
      status: 'Active',
      joinDate: item.startDate === 'TBD' || !item.startDate ? dateStamp() : item.startDate,
      nric: '',
      mobile: '',
      email: '',
      address: '',
      avatarColor: 'bg-emerald-500',
      dependents: '0',
      emergencyContact: '',
    });

    setPreOnboardings(prev => prev.filter(p => p.id !== item.id));
    addToast(`Added ${item.candidateName} to the employee list.`, 'success');
  };

  const triggerRecruitmentExport = (format: 'Excel' | 'CSV' | 'PDF') => {
    setExportDropdownOpen(false);
    if (format === 'PDF') {
      addToast('PDF export is not available yet. Use CSV or Excel instead.', 'info');
      return;
    }
    const filename = `recruitment_${activeSubTab.replace(/\s+/g, '_').toLowerCase()}_${dateStamp()}`;
    let ok = false;
    let count = 0;
    if (activeSubTab === 'Job Requisition') {
      count = filteredRequisitions.length;
      ok = downloadCsv(
        filename,
        ['ID', 'Position title', 'Department', 'Type', 'Requested by', 'Open date', 'Target fill', 'Applicants', 'Status'],
        filteredRequisitions.map((r) => [r.id, r.positionTitle, r.department, r.type, r.requestedBy, r.openDate, r.targetFill, r.applicants, r.status]),
      );
    } else if (activeSubTab === 'Job Posting') {
      count = postings.length;
      ok = downloadCsv(
        filename,
        ['ID', 'Position', 'Department', 'Channel', 'Applicants', 'Status'],
        postings.map((p) => [p.id, p.position, p.department, p.channel, p.applicants, p.status]),
      );
    } else if (activeSubTab === 'Candidate Pipeline') {
      count = candidates.length;
      ok = downloadCsv(
        filename,
        ['ID', 'Name', 'Position applied', 'Source', 'Stage', 'Applied date'],
        candidates.map((c) => [c.id, c.name, c.positionApplied, formatSourceLabel(c.source), c.stage, c.appliedDate]),
      );
    } else if (activeSubTab === 'Interviews') {
      count = interviews.length;
      ok = downloadCsv(
        filename,
        ['ID', 'Candidate', 'Position', 'Stage', 'Date', 'Time', 'Format', 'Status'],
        interviews.map((i) => [i.id, i.candidateName, i.position, i.stage, i.date, i.time, i.format, i.status]),
      );
    } else if (activeSubTab === 'Offer Management') {
      count = offers.length;
      ok = downloadCsv(
        filename,
        ['ID', 'Candidate', 'Position', 'Currency', 'Salary', 'Allowance', 'Grade', 'Sent date', 'Expiry', 'Status'],
        offers.map((o) => [o.id, o.candidateName, o.position, o.currency || currency, o.salary, o.allowance, o.grade, o.sentDate, o.expiryDate, o.status]),
      );
    }
    addToast(ok ? `Exported ${count} rows as CSV.` : 'Nothing to export yet.', ok ? 'success' : 'info');
  };

  // State filtering logic
  const filteredRequisitions = requisitions.filter(item => {
    const matchSearch = item.positionTitle.toLowerCase().includes(searchValue.toLowerCase()) || item.requestedBy.toLowerCase().includes(searchValue.toLowerCase());
    const matchDept = deptFilter === 'All departments' || item.department === deptFilter;
    return matchSearch && matchDept;
  });

  const activePreOnboard = preOnboardings.find(p => p.id === selectedPreOnboardId) || preOnboardings[0];
  const activeOffer = offers.find(o => o.id === selectedOfferId) || offers[0];
  const activeInterview = interviews.find(i => i.id === selectedInterviewId) || interviews[0];
  const activeInterviewRow = interviewRows.find(i => i.id === activeInterview?.id);

  const filteredPipelineCandidates = candidates.filter(c =>
    c.name.toLowerCase().includes(searchValue.toLowerCase()) &&
    (pipelinePosition === 'All positions' || c.positionApplied === pipelinePosition) &&
    (pipelineSource === 'All sources' || formatSourceLabel(c.source) === pipelineSource)
  );

  const offerWorkflowSteps = ['Applied', 'Screened', 'Phone', 'Panel', 'Offer sent', 'Accepted', 'Hired'];
  const offerWorkflowIndex = !activeOffer
    ? -1
    : activeOffer.status === 'Accepted'
      ? 5
      : activeOffer.status === 'Draft'
        ? 3
        : 4;

  const onboardingAuditEntries = offerRows
    .filter(o => o.status.toLowerCase() === 'accepted' || o.status.toLowerCase() === 'sent')
    .map(o => ({
      id: o.id,
      date: parseDate(o.sentAt || o.createdAt),
      accepted: o.status.toLowerCase() === 'accepted',
      candidateName: o.candidateName || '—',
      expiry: o.expiryDate ? new Date(o.expiryDate).toLocaleDateString() : null,
    }))
    .sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0))
    .slice(0, 5);

  const openCandidatesForPosition = (position: string) => {
    setPipelinePosition(pipelinePositionOptions.includes(position) ? position : 'All positions');
    setSearchValue('');
    setActiveSubTab('Candidate Pipeline');
  };

  const subTabs = [
    'Job Requisition',
    'Job Posting',
    'Candidate Pipeline',
    'Interviews',
    'Offer Management',
  ];

  return (
    <div id="recruitment-module-stage" className="space-y-6">
      <ModuleHeader
        title="Recruitment"
        description="Requisitions, candidates, interviews, and offers."
      />

      {/* 2nd Navigation menu - tabs scroll; action buttons stay fixed */}
      <div id="recruitment-unified-navigator" className="flex items-center gap-3 border-b border-slate-200 pb-4 min-w-0">
        
        {/* Concise Sub-navigation Items — single row, horizontally scrollable */}
        <div
          id="recruitment-navigation-tabs"
          className="flex flex-nowrap items-center gap-1.5 select-none overflow-x-auto min-w-0 flex-1 scrollbar-none"
        >
          {subTabs.map((tab) => {
            const isActive = activeSubTab === tab;
            const isInterviewWithBadge = tab === 'Interviews';
            return (
              <button
                id={`tab-${tab.replace(/\s+/g, '-').toLowerCase()}`}
                key={tab}
                onClick={() => {
                  setActiveSubTab(tab);
                  setSearchValue('');
                }}
                className={`text-xs font-semibold px-4 py-2.5 rounded-xl transition-all relative flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-50 text-novora'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                }`}
              >
                <span>{tab}</span>
                {isInterviewWithBadge && upcomingInterviewCount > 0 && (
                  <span className="bg-novora text-white text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-full inline-flex items-center whitespace-nowrap shrink-0">
                    {upcomingInterviewCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Professional filters / export actions — fixed, never wrap */}
        <div id="recruitment-top-controls" className="flex items-center gap-2.5 shrink-0 relative select-none">
          
          {/* Department filter selection */}
          <DropdownAnchor
            open={deptDropdownOpen}
            onClose={() => setDeptDropdownOpen(false)}
            align="right"
          >
            <button
              id="dept-filter-btn"
              type="button" aria-expanded={deptDropdownOpen}
              onClick={() => {
                setExportDropdownOpen(false)
                setDeptDropdownOpen(!deptDropdownOpen)
              }}
              className="nv-dd-trigger"
            >
              <span>{deptFilter}</span>
              <ChevronDown className="nv-chevron-down nv-chevron-down--md" />
            </button>

            {deptDropdownOpen && (
              <div id="dept-dropdown-menu" className="nv-dropdown-menu w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5">
                {['All departments', ...departmentOptions].map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => {
                      setDeptFilter(dept);
                      setDeptDropdownOpen(false);
                      addToast(dept === 'All departments' ? 'Showing requisitions for all departments' : `Showing ${dept} requisitions`, 'info');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-novora transition-colors"
                  >
                    {dept}
                  </button>
                ))}
              </div>
            )}
          </DropdownAnchor>

          {/* Highly Professional, Slick Export Button */}
          <DropdownAnchor
            open={exportDropdownOpen}
            onClose={() => setExportDropdownOpen(false)}
            align="right"
          >
            <button
              id="export-options-btn"
              type="button" aria-expanded={exportDropdownOpen}
              onClick={() => {
                setDeptDropdownOpen(false)
                setExportDropdownOpen(!exportDropdownOpen)
              }}
              className="h-9 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 font-bold text-xs text-slate-700 px-3.5 rounded-xl transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Export</span>
              <ChevronDown className="nv-chevron-down nv-chevron-down--sm" />
            </button>

            {exportDropdownOpen && (
              <div id="export-dropdown-items" className="nv-dropdown-menu w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5">
                <div className="px-3.5 py-1 text-[9.5px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Export Settings
                </div>
                <button
                  id="export-excel-item"
                  type="button"
                  onClick={() => triggerRecruitmentExport('Excel')}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                >
                  <FileSpreadsheet className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Excel Worksheet (.xlsx)</span>
                </button>
                <button
                  id="export-csv-item"
                  type="button"
                  onClick={() => triggerRecruitmentExport('CSV')}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                >
                  <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                  <span>CSV Spreadsheet Table</span>
                </button>
                <button
                  id="export-pdf-item"
                  type="button"
                  onClick={() => triggerRecruitmentExport('PDF')}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                >
                  <FileText className="h-4 w-4 text-red-500 shrink-0" />
                  <span>PDF Document Portfolio</span>
                </button>
              </div>
            )}
          </DropdownAnchor>

          {/* Contextual primary trigger action button */}
          {activeSubTab === 'Job Requisition' && (
            <button
              onClick={() => setRequisitionModalOpen(true)}
              className="h-9 bg-novora hover:bg-opacity-95 text-white font-bold text-xs px-3.5 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap shrink-0"
            >
              <Plus className="h-3.5 w-3.5 shrink-0" />
              <span>New Requisition</span>
            </button>
          )}
          {activeSubTab === 'Candidate Pipeline' && (
            <button
              onClick={() => setCandidateModalOpen(true)}
              className="h-9 bg-novora hover:bg-opacity-95 text-white font-bold text-xs px-3.5 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap shrink-0"
            >
              <UserPlus className="h-3.5 w-3.5 shrink-0" />
              <span>Add Candidate</span>
            </button>
          )}
          {activeSubTab === 'Interviews' && (
            <button
              onClick={() => setInterviewModalOpen(true)}
              className="h-9 bg-novora hover:bg-opacity-95 text-white font-bold text-xs px-3.5 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap shrink-0"
            >
              <CalendarDays className="h-3.5 w-3.5 shrink-0" />
              <span>Schedule Interview</span>
            </button>
          )}
          {activeSubTab === 'Offer Management' && (
            <button
              onClick={() => setOfferModalOpen(true)}
              className="h-9 bg-novora hover:bg-opacity-95 text-white font-bold text-xs px-3.5 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap shrink-0"
            >
              <Send className="h-3.5 w-3.5 shrink-0" />
              <span>Create Offer</span>
            </button>
          )}
          {activeSubTab === 'Job Posting' && (
            <button
              onClick={() => setPostingModalOpen(true)}
              className="h-9 bg-novora hover:bg-opacity-95 text-white font-bold text-xs px-3.5 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap shrink-0"
            >
              <Plus className="h-3.5 w-3.5 shrink-0" />
              <span>New Job Posting</span>
            </button>
          )}
        </div>
      </div>

      {/* Main dynamic stage render panel */}
      <div id="recruitment-active-tab-board" className="min-h-115">

        {/* 1. JOB REQUISITION TAB */}
        {activeSubTab === 'Job Requisition' && (
          <div className="space-y-6">
            {/* Real Stats Metrics for Requisition screen */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4.5">
              <div className="nv-card p-5 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Total Requisitions</span>
                  <p className="text-2xl font-extrabold text-slate-800 mt-1">{requisitions.length}</p>
                </div>
                <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Briefcase className="h-5 w-5" />
                </div>
              </div>
              <div className="nv-card p-5 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Active Open Status</span>
                  <p className="text-2xl font-extrabold text-slate-800 mt-1">
                    {requisitions.filter(r => r.status === 'Open' || r.status === 'In review').length}
                  </p>
                </div>
                <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Check className="h-5 w-5" />
                </div>
              </div>
              <div className="nv-card p-5 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Filled Positions</span>
                  <p className="text-2xl font-extrabold text-slate-800 mt-1">
                    {requisitions.filter(r => r.status === 'Filled').length}
                  </p>
                </div>
                <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <div className="nv-card p-5 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Total Applicants Listed</span>
                  <p className="text-2xl font-extrabold text-novora mt-1">{candidates.length}</p>
                </div>
                <div className="h-10 w-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Requisition Table Search Filter Box */}
            <div className="nv-card p-4 shadow-xs flex items-center justify-between">
              <div className="relative w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search position titles, requesters..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-700 outline-none focus:border-slate-300 focus:bg-white transition-all"
                />
              </div>
              <p className="text-[11px] font-bold text-slate-400">
                Found {filteredRequisitions.length} requisition {filteredRequisitions.length === 1 ? 'record' : 'records'}
              </p>
            </div>

            {/* Clean, High-Contrast Table of Job Requisitions (Records) */}
            <div className="nv-card overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-5">ID</th>
                      <th className="py-3 px-5">Position title</th>
                      <th className="py-3 px-5">Department</th>
                      <th className="py-3 px-5">Type</th>
                      <th className="py-3 px-5">Requested by</th>
                      <th className="py-3 px-5">Open date</th>
                      <th className="py-3 px-5">Target fill</th>
                      <th className="py-3 px-5">Applicants</th>
                      <th className="py-3 px-5 whitespace-nowrap">Status</th>
                      <th className="py-3 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-700">
                    {filteredRequisitions.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-5 font-mono text-[10.5px] text-slate-400">{req.id}</td>
                        <td className="py-3.5 px-5 font-bold text-slate-900">{req.positionTitle}</td>
                        <td className="py-3.5 px-5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 ${
                            req.department === 'Engineering' ? 'bg-blue-50 text-blue-600' :
                            req.department === 'HR' ? 'bg-pink-50 text-pink-600' :
                            req.department === 'Finance' ? 'bg-emerald-50 text-emerald-600' :
                            req.department === 'Marketing' ? 'bg-sky-50 text-sky-600' :
                            'bg-orange-50 text-orange-600'
                          }`}>
                            {req.department}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-slate-500">{req.type}</td>
                        <td className="py-3.5 px-5 font-medium">{req.requestedBy}</td>
                        <td className="py-3.5 px-5 text-slate-500">{req.openDate}</td>
                        <td className="py-3.5 px-5 text-rose-500 font-bold">{req.targetFill}</td>
                        <td className="py-3.5 px-5">
                          <span className="text-blue-600 underline font-bold cursor-pointer" onClick={() => openCandidatesForPosition(req.positionTitle)}>
                            {req.applicants}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 ${
                            req.status === 'Open' ? 'bg-emerald-50 text-emerald-600' :
                            req.status === 'In review' ? 'bg-blue-50 text-blue-600' :
                            req.status === 'Filled' ? 'bg-slate-100 text-slate-400 line-through' :
                            req.status === 'On hold' ? 'bg-amber-50 text-amber-600' :
                            'bg-rose-50 text-rose-600'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <button
                            onClick={() => openCandidatesForPosition(req.positionTitle)}
                            className="bg-slate-50 hover:bg-novora/10 hover:text-novora transition-colors border border-slate-100 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 ml-auto text-slate-600 cursor-pointer"
                          >
                            <Eye className="h-3 w-3 shrink-0" />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredRequisitions.length === 0 && (
                      <tr>
                        <td colSpan={10} className="py-10 text-center text-slate-400 font-medium italic">
                          No requisitions match your filter criteria or search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. JOB POSTING TAB */}
        {activeSubTab === 'Job Posting' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left side 7cols: Active Job Postings (Records) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Active postings template records</h3>
                    <p className="text-[11px] text-slate-400 font-semibold mt-1">
                      Published channels linked to applicant counts
                    </p>
                  </div>
                  <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap shrink-0">
                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse items-center shrink-0" />
                    <span>
                      {recruitmentLoading
                        ? 'Loading…'
                        : `${postings.filter((p) => p.status === 'Live').length} Live`}
                    </span>
                  </span>
                </div>

                <div className="space-y-3.5">
                  {!recruitmentLoading && postings.length === 0 && (
                    <p className="text-xs text-slate-400 py-4 text-center">
                      No job postings yet. Publish from a requisition or create one here.
                    </p>
                  )}
                  {postings.map(post => (
                    <div key={post.id} className="flex items-center justify-between bg-slate-50/60 hover:bg-slate-50 border border-slate-100 rounded-2xl p-4 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-xs select-none">
                          {post.channel[0]}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">{post.position}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{post.channel} portal</span>
                            <span className="text-[10px] font-bold text-slate-600">&bull;</span>
                            <span className="text-[10px] font-semibold text-slate-500">{post.views.toLocaleString()} impressions</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-5">
                        <div className="text-right">
                          <div className="text-xs font-bold text-novora">{post.applicants} applicants</div>
                          <span className="text-[9.5px] font-bold text-slate-400">YTD volume</span>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 ${
                          post.status === 'Live' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {post.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side 5cols: Breakdown metrics */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
                <div className="border-b border-slate-50 pb-3 mb-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Applicant source breakdown %</h3>
                </div>

                {sourceBreakdown.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-400">No applicants yet.</p>
                ) : (
                  <div className="space-y-4">
                    {sourceBreakdown.map((s) => (
                      <div key={s.label}>
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                          <span>{s.label}</span>
                          <span className="text-slate-900">
                            {s.count} {s.count === 1 ? 'applicant' : 'applicants'} ({s.pct}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className={`${s.color} h-full rounded-full`} style={{ width: `${s.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* 3. CANDIDATE PIPELINE TAB */}
        {activeSubTab === 'Candidate Pipeline' && (
          <div className="space-y-5">
            {/* Filter controls bar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <DropdownAnchor
                  open={pipelinePositionOpen}
                  onClose={() => setPipelinePositionOpen(false)}
                  align="left"
                >
                  <button
                    type="button"
                    aria-expanded={pipelinePositionOpen}
                    onClick={() => {
                      setPipelineSourceOpen(false)
                      setPipelinePositionOpen(!pipelinePositionOpen)
                    }}
                    className={`nv-dd-trigger ${pipelinePositionOpen ? 'nv-dd-trigger--open' : ''}`}
                  >
                    <span>Position: {pipelinePosition}</span>
                    <ChevronDown className="nv-chevron-down nv-chevron-down--md" />
                  </button>
                  {pipelinePositionOpen ? (
                    <div className="nv-dropdown-menu w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5">
                      {pipelinePositionOptions.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => {
                            setPipelinePosition(p)
                            setPipelinePositionOpen(false)
                            addToast(`Pipeline filtered by ${p}`, 'info')
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-novora transition-colors"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </DropdownAnchor>
                <DropdownAnchor
                  open={pipelineSourceOpen}
                  onClose={() => setPipelineSourceOpen(false)}
                  align="left"
                >
                  <button
                    type="button"
                    aria-expanded={pipelineSourceOpen}
                    onClick={() => {
                      setPipelinePositionOpen(false)
                      setPipelineSourceOpen(!pipelineSourceOpen)
                    }}
                    className={`nv-dd-trigger ${pipelineSourceOpen ? 'nv-dd-trigger--open' : ''}`}
                  >
                    <span>{pipelineSource}</span>
                    <ChevronDown className="nv-chevron-down nv-chevron-down--md" />
                  </button>
                  {pipelineSourceOpen ? (
                    <div className="nv-dropdown-menu w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5">
                      {pipelineSourceOptions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            setPipelineSource(s)
                            setPipelineSourceOpen(false)
                            addToast(`Source filter: ${s}`, 'info')
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-novora transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </DropdownAnchor>
                <button
                  type="button"
                  disabled={aiCandBusy || !selectedCandidateId}
                  onClick={() => void handleAiCandidateSummary()}
                  className="h-9 inline-flex items-center gap-1.5 px-3.5 text-xs font-bold text-novora bg-novora/5 border border-novora/25 rounded-xl cursor-pointer whitespace-nowrap shrink-0 hover:bg-novora/10 disabled:opacity-60"
                  title="Summarise selected candidate with Gemini"
                >
                  <Sparkles className={`h-3.5 w-3.5 ${aiCandBusy ? 'animate-spin' : ''}`} />
                  {aiCandBusy ? 'Summarising…' : 'AI Screen'}
                </button>
              </div>

              <div className="relative w-64">
                <Search className="absolute left-3 top-2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search candidate name..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-700 outline-none focus:border-slate-300 focus:bg-white transition-all"
                />
              </div>
            </div>

            {candidateAiSummary && (
              <div className="rounded-2xl border border-novora/20 bg-novora/5 p-4 space-y-3 animate-in fade-in duration-300">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 inline-flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-novora" />
                      AI screening summary
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">{candidateAiSummary.disclaimer}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCandidateAiSummary(null)}
                    className="text-[10px] font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{candidateAiSummary.summary}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1.5">Strengths</p>
                    <ul className="space-y-1">
                      {candidateAiSummary.strengths.map((s) => (
                        <li key={s} className="text-[11px] text-slate-600 flex gap-1.5">
                          <span className="text-emerald-500 mt-0.5">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-1.5">Watch-outs</p>
                    <ul className="space-y-1">
                      {candidateAiSummary.risks.map((s) => (
                        <li key={s} className="text-[11px] text-slate-600 flex gap-1.5">
                          <span className="text-amber-500 mt-0.5">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-novora mb-1.5">Interview questions</p>
                    <ul className="space-y-1">
                      {candidateAiSummary.interviewQuestions.map((s) => (
                        <li key={s} className="text-[11px] text-slate-600 flex gap-1.5">
                          <span className="text-novora mt-0.5">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Kanban layout stage structure */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
              {PIPELINE_STAGES.map(stage => {
                const stageList = filteredPipelineCandidates.filter(c => c.stage === stage);
                return (
                  <div key={stage} className="min-w-52.5 bg-white hover:bg-slate-50/40 border border-slate-100 rounded-2xl p-3.5 space-y-3.5 transition-colors">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                      <span className="text-xs font-bold text-slate-600">{stage}</span>
                      <span className="bg-slate-100 text-slate-600 rounded-full h-5 w-5 flex items-center justify-center text-[10px] font-bold shrink-0">
                        {stageList.length}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {stageList.map(item => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedCandidateId(item.id);
                            setCandidateAiSummary(null);
                            addToast(`Inspecting application file: ${item.name}`, 'info');
                          }}
                          className={`border rounded-xl p-3 cursor-pointer transition-all ${
                            selectedCandidateId === item.id
                              ? 'border-novora bg-novora/5 shadow-xs'
                              : 'border-slate-100 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="font-bold text-xs text-slate-800">{item.name}</div>
                          <div className="text-[10px] font-medium text-slate-400 mt-0.5">
                            {item.experience} &bull; {item.education}
                          </div>

                          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100/70">
                            <span className="bg-slate-100 text-slate-500 font-bold text-[9px] px-2 py-0.5 rounded-full inline-flex items-center whitespace-nowrap shrink-0">
                              {item.source}
                            </span>
                            <span className="text-[10.5px] font-extrabold text-emerald-600">
                              {item.matchScore}
                            </span>
                          </div>
                        </div>
                      ))}
                      {stageList.length === 0 && (
                        <div className="py-8 text-center text-slate-400 font-medium text-[10.5px] italic">
                          No candidates
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. INTERVIEWS TAB */}
        {activeSubTab === 'Interviews' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* Left Box 7cols - Upcoming records */}
            <div className="xl:col-span-7 space-y-5">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 font-sans">Upcoming interviews list</h3>
                    <p className="text-[11px] text-slate-400 font-semibold mt-1">Confirmed slots pending logs</p>
                  </div>
                  <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center whitespace-nowrap shrink-0">
                    {upcomingInterviewCount} upcoming
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="pb-3.5 font-bold">Candidate</th>
                        <th className="pb-3.5 font-bold">Stage</th>
                        <th className="pb-3.5 font-bold">Date / Time</th>
                        <th className="pb-3.5 font-bold">Format</th>
                        <th className="pb-3.5 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-700">
                      {interviews.map(item => (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedInterviewId(item.id)}
                          className={`hover:bg-slate-50/70 transition-colors cursor-pointer ${
                            selectedInterviewId === item.id ? 'bg-indigo-50/20 font-bold' : ''
                          }`}
                        >
                          <td className="py-3 px-1">
                            <span className="font-bold text-slate-900 block">{item.candidateName}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{item.position}</span>
                          </td>
                          <td className="py-3 px-1">{item.stage}</td>
                          <td className="py-3 px-1">
                            <span className="block">{item.date}</span>
                            <span className="text-[10px] text-slate-400 block font-normal">{item.time}</span>
                          </td>
                          <td className="py-3 px-1">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.format === 'In person' ? 'bg-orange-50 text-orange-600' :
                              item.format === 'Phone' ? 'bg-blue-50 text-blue-600' : 'bg-sky-50 text-sky-600'
                            }`}>
                              {item.format}
                            </span>
                          </td>
                          <td className="py-3 px-1">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 ${
                              item.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' :
                              item.status === 'No show' ? 'bg-red-50 text-red-650' : 'bg-amber-50 text-amber-600'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {interviews.length === 0 && (
                        <tr><td colSpan={5} className="p-6 text-center text-xs text-slate-400">No records yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Box 5cols - Core Scorecard Review */}
            <div className="xl:col-span-5 space-y-6">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Interview scorecard review</h3>
                  <span className="text-[11.5px] font-bold text-novora">Panel rating</span>
                </div>

                {activeInterview ? (
                  <>
                    <div className="mb-4">
                      <div className="text-sm font-extrabold text-slate-800">{activeInterview.candidateName}</div>
                      <div className="text-xs font-bold text-slate-400 mt-1">{activeInterview.position}</div>
                    </div>

                    <div className="space-y-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 text-xs font-semibold mb-5">
                      <div className="flex justify-between items-center border-b border-white pb-2.5">
                        <span className="text-slate-400">Stage</span>
                        <span className="text-slate-800 font-bold">{activeInterview.stage}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white pb-2.5">
                        <span className="text-slate-400">Date / Time</span>
                        <span className="text-slate-800 font-bold">{activeInterview.date} &bull; {activeInterview.time}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white pb-2.5">
                        <span className="text-slate-400">Format</span>
                        <span className="text-slate-800 font-bold">{activeInterview.format}</span>
                      </div>
                      <div className="flex justify-between items-center pb-1">
                        <span className="text-slate-400">Interviewer</span>
                        <span className="text-slate-800 font-bold">{activeInterviewRow?.interviewerName || '—'}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Panel recommendation</span>
                        <span className="text-xs font-bold text-slate-500 block mt-0.5">No scorecard submitted yet.</span>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 ${
                        activeInterview.status === 'Confirmed' || activeInterview.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                        activeInterview.status === 'No show' ? 'bg-red-50 text-red-650' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {activeInterview.status}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="py-6 text-center text-xs text-slate-400">No interviews scheduled yet.</p>
                )}
              </div>
            </div>

          </div>
        )}

        {/* 5. OFFER MANAGEMENT TAB */}
        {activeSubTab === 'Offer Management' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* Left box 7cols: Offer list tracking */}
            <div className="xl:col-span-7 space-y-5">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
                <div className="border-b border-slate-50 pb-4 mb-4">
                  <h3 className="text-sm font-bold text-slate-800 font-sans">Corporate offer tracker</h3>
                  <p className="text-[11px] text-slate-400 font-semibold mt-1">Pending approval feedback loops</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="pb-3.5">Candidate</th>
                        <th className="pb-3.5">Salary</th>
                        <th className="pb-3.5">Sent date</th>
                        <th className="pb-3.5">Expiry</th>
                        <th className="pb-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-700">
                      {offers.map(item => (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedOfferId(item.id)}
                          className={`hover:bg-slate-50/70 transition-colors cursor-pointer ${
                            selectedOfferId === item.id ? 'bg-indigo-50/20 font-bold' : ''
                          }`}
                        >
                          <td className="py-3 px-1">
                            <span className="font-bold text-slate-900 block">{item.candidateName}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{item.position}</span>
                          </td>
                          <td className="py-3 px-1 font-mono text-slate-600">{item.currency || currency} {item.salary}</td>
                          <td className="py-3 px-1 text-slate-500">{item.sentDate}</td>
                          <td className="py-3 px-1 text-rose-500">{item.expiryDate}</td>
                          <td className="py-3 px-1">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 ${
                              item.status === 'Sent' ? 'bg-blue-50 text-blue-600' :
                              item.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600' :
                              item.status === 'Declined' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {offers.length === 0 && (
                        <tr><td colSpan={5} className="p-6 text-center text-xs text-slate-400">No records yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right box 5cols: Stage Progress and Terms Overview */}
            <div className="xl:col-span-5 space-y-6">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Offer workflow status</h3>
                  <span className="bg-amber-50 text-amber-700 text-[10.5px] font-bold px-2 py-0.5 rounded-full inline-flex items-center whitespace-nowrap shrink-0">
                    {!activeOffer
                      ? 'No offer selected'
                      : activeOffer.status === 'Sent'
                        ? 'Awaiting accept'
                        : activeOffer.status}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-extrabold text-slate-800">{activeOffer?.candidateName || '—'}</div>
                  <div className="text-xs font-bold text-slate-400 mt-1">{activeOffer?.position || '—'}</div>
                </div>

                {/* Progress flow map */}
                <div className="mb-5 py-2.5 border-t border-b border-dashed border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-3">Workflow state</span>
                  <div className="grid grid-cols-7 gap-1 text-[9.5px] font-extrabold text-center text-slate-400">
                    {offerWorkflowSteps.map((step, idx) => (
                      <span
                        key={step}
                        className={
                          idx === offerWorkflowIndex
                            ? 'text-blue-500 bg-blue-50 border border-blue-100 rounded-sm py-0.5'
                            : idx < offerWorkflowIndex
                              ? 'text-novora'
                              : ''
                        }
                      >
                        {step}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Terms Details */}
                <div className="space-y-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 text-xs font-semibold">
                  <div className="flex justify-between items-center border-b border-white pb-2.5">
                    <span className="text-slate-400">Salary Package</span>
                    <span className="text-slate-800 font-bold">{activeOffer && activeOffer.salary !== '—' ? `${activeOffer.currency || currency} ${activeOffer.salary}/mth` : '—'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white pb-2.5">
                    <span className="text-slate-400">Fixed Allowance</span>
                    <span className="text-slate-800 font-bold">{activeOffer && activeOffer.allowance !== '—' ? `${activeOffer.currency || currency} ${activeOffer.allowance}/mth` : '—'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white pb-2.5">
                    <span className="text-slate-400">Grade Level</span>
                    <span className="text-slate-800 font-mono font-bold text-[11px]">{activeOffer?.grade || '—'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-slate-400">Probation duration</span>
                    <span className="text-slate-800 font-bold">{activeOffer?.probation || '—'}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between">
                  <button
                    disabled={!activeOffer}
                    onClick={() => addToast('PDF offer letters are not generated yet.', 'info')}
                    className="flex-1 mr-2 px-3.5 py-2 hover:bg-slate-50 text-xs border border-slate-200 text-slate-600 rounded-xl transition-all font-bold cursor-pointer text-center disabled:opacity-60"
                  >
                    Preview PDF letter
                  </button>
                  <button
                    disabled={!activeOffer}
                    onClick={() => addToast('Reminder emails are not connected yet.', 'info')}
                    className="flex-1 bg-novora hover:bg-opacity-95 text-white text-xs px-3.5 py-2 rounded-xl transition-all font-bold cursor-pointer text-center disabled:opacity-60"
                  >
                    Send reminder
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 6. PRE-ONBOARDING TAB */}
        {activeSubTab === 'Pre-Onboarding' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* Left box 7cols: Candidate queue and activity log records */}
            <div className="xl:col-span-7 space-y-6">
              {/* Onboarding queue */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
                <div className="border-b border-slate-50 pb-4 mb-4">
                  <h3 className="text-sm font-bold text-slate-800">Pre-onboarding queue list</h3>
                  <p className="text-[11px] text-slate-400 font-semibold mt-1">Checklist progress logs for verified candidates</p>
                </div>

                <div className="space-y-3.5">
                  {preOnboardings.length === 0 && (
                    <p className="py-6 text-center text-xs text-slate-400">No records yet.</p>
                  )}
                  {preOnboardings.map(item => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedPreOnboardId(item.id)}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                        selectedPreOnboardId === item.id
                          ? 'border-novora bg-novora/5 shadow-xs'
                          : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0">
                          {item.avatar}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">{item.candidateName}</div>
                          <div className="text-[10px] font-semibold text-slate-500 mt-0.5">
                            {item.position} &bull; Start Date: <span className="text-slate-800">{item.startDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-xs font-bold text-novora block">{item.docsReceived}/8 checklist</span>
                          <span className="text-[10px] font-bold text-slate-400 block mt-0.5">docs received</span>
                        </div>
                        
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10.5px] font-bold whitespace-nowrap shrink-0 ${
                          item.status === 'Ready to onboard' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Onboarding Activity log list */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
                <div className="border-b border-slate-50 pb-3 mb-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Onboarding audit logs</h3>
                </div>

                <div className="space-y-4">
                  {onboardingAuditEntries.length === 0 && (
                    <p className="py-4 text-center text-xs text-slate-400">No records yet.</p>
                  )}
                  {onboardingAuditEntries.map(entry => (
                    <div key={entry.id} className="flex gap-4 items-start">
                      <span className="text-xs font-semibold text-slate-400 w-16 pt-0.5">
                        {entry.date ? entry.date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : '—'}
                      </span>
                      <span className={`h-2 w-2 rounded-full shrink-0 mt-2 items-center ${entry.accepted ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                      <div>
                        <div className="text-xs font-bold text-slate-800">{entry.accepted ? 'Employment offer accepted' : 'Employment offer sent'}</div>
                        <p className="text-[11px] text-slate-400 font-semibold mt-1">
                          {entry.candidateName}
                          {entry.expiry && !entry.accepted ? <> &bull; Expires {entry.expiry}</> : null}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right box 5cols: Document verification list */}
            <div className="xl:col-span-5 space-y-6">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verification check</h3>
                  <span className="text-[11px] font-bold text-indigo-650">{activePreOnboard?.candidateName || 'Candidate'}</span>
                </div>

                {/* Subchecklist with manual toggles */}
                <div className="mb-5 space-y-3.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Document repository</span>
                  
                  {activePreOnboard ? (
                    Object.entries(activePreOnboard.checklist).map(([key, isChecked]) => {
                      const readableName = key
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, str => str.toUpperCase());
                      return (
                        <div
                          key={key}
                          onClick={() => handleChecklistToggle(activePreOnboard.id, key)}
                          className="flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 p-3 rounded-xl border border-slate-100 cursor-pointer select-none"
                        >
                          <span className="text-xs font-semibold text-slate-700">{readableName}</span>
                          <span className={`h-5 w-5 rounded-md flex items-center justify-center border transition-all ${
                            isChecked ? 'bg-emerald-500 border-transparent text-white' : 'border-slate-300'
                          }`}>
                            {isChecked && <Check className="h-3.5 w-3.5 font-bold" />}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs italic text-slate-400">Select candidate to review checklist</p>
                  )}
                </div>

                {/* System provisioning options checkboxes */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 space-y-3.5">
                  <span className="text-[10px] font-bold text-novora uppercase tracking-wider block">IT & Payroll provisioning triggers</span>
                  
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>Create permanent HRMS employee account</span>
                    <span className="h-5 w-5 rounded bg-emerald-100 border border-emerald-250 text-emerald-600 flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 font-bold" />
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>Provision GSuite email accounts</span>
                    <span className="h-5 w-5 rounded bg-emerald-100 border border-emerald-250 text-emerald-600 flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 font-bold" />
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>Register biometric scans and keycards</span>
                    <span className="h-5 w-5 rounded border border-slate-300 bg-white" />
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>Assign pre-configured laptop asset</span>
                    <span className="h-5 w-5 rounded bg-emerald-100 border border-emerald-250 text-emerald-600 flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 font-bold" />
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>Enrol in monthly banking payroll roster</span>
                    <span className="h-5 w-5 rounded border border-slate-300 bg-white" />
                  </div>
                </div>

                {/* Active Convert Trigger */}
                <button
                  disabled={!activePreOnboard}
                  onClick={() => handleConversionToStaff(activePreOnboard)}
                  className="disabled:opacity-60 w-full bg-novora hover:bg-opacity-95 text-white font-bold text-xs py-3 rounded-2xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="h-4.5 w-4.5 text-white" />
                  <span>Convert to actual employee staff record</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* 7. REPORTS TAB */}
        {activeSubTab === 'Reports' && (() => {
          const stats = reportData;

          const filteredDetailedRows = stats.rows.filter(row => {
            const matchesSearch = reportSearchQuery.trim() === '' || 
              row.position.toLowerCase().includes(reportSearchQuery.toLowerCase()) ||
              row.reqId.toLowerCase().includes(reportSearchQuery.toLowerCase()) ||
              row.recruiter.toLowerCase().includes(reportSearchQuery.toLowerCase()) ||
              row.dept.toLowerCase().includes(reportSearchQuery.toLowerCase());
            return matchesSearch;
          });

          return (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Reports interactive filtering bar */}
              <div className="bg-slate-50 border border-slate-100 p-4.5 rounded-3xl flex flex-col sm:flex-row gap-4 items-center justify-between shadow-xs">
                
                {/* Left controls */}
                <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
                  
                  {/* Select Department filter */}
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Analytical sector</span>
                    <SelectMenu
                      value={reportFilterDept}
                      onChange={(v) => { setReportFilterDept(v); addToast(`Refocused recruitment reports for: ${v}`, 'info'); }}
                      className="w-auto shrink-0"
                      triggerClassName="nv-select-trigger--toolbar min-w-[8rem]"
                      options={[
                        { value: 'All departments', label: 'All Departments · Consolidated' },
                        ...departmentOptions.map((d) => ({ value: d, label: d })),
                      ]}
                    />
                  </div>

                  {/* Select Period filter */}
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reporting Period</span>
                    <SelectMenu
                      value={reportFilterPeriod}
                      onChange={(v) => { setReportFilterPeriod(v); addToast(`Report timeframe adjusted to: ${v}`, 'info'); }}
                      className="w-auto shrink-0"
                      triggerClassName="nv-select-trigger--toolbar min-w-[8rem]"
                      options={reportPeriodOptions}
                    />
                  </div>

                </div>

                {/* Right controls: Print and CSV Download */}
                <div className="flex items-center gap-2.5 w-full sm:w-auto sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200">
                  <button
                    onClick={(e) => {
                      const n = downloadNearestTableCsv(e.currentTarget, `recruitment_report_${dateStamp()}`);
                      addToast(n ? `Exported ${n} rows as CSV.` : 'Nothing to export yet.', n ? 'success' : 'info');
                    }}
                    className="flex-1 sm:flex-initial bg-white hover:bg-slate-50 text-[11px] font-bold text-slate-600 px-3.5 py-2 rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5 text-slate-500" />
                    <span>Download Excel</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex-1 sm:flex-initial bg-novora hover:bg-opacity-95 text-[11px] font-extrabold text-white px-3.5 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Print Executive Summary</span>
                  </button>
                </div>

              </div>
              
              {/* Upper Metric Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-10 w-10 bg-blue-50/40 rounded-bl-3xl flex items-center justify-center">
                    <Clock className="h-4 w-4 text-blue-500" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">Avg. Time to Close</span>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="text-3xl font-black text-slate-800">{stats.timeToHire}</span>
                    <span className="text-[11px] font-bold text-emerald-500">{stats.timeShift}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1.5 italic">Duration from approved REQ to candidate signed contract</p>
                </div>

                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-10 w-10 bg-indigo-50/40 rounded-bl-3xl flex items-center justify-center">
                    <Percent className="h-4 w-4 text-indigo-500" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">Offer Acceptance Rate</span>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="text-3xl font-black text-slate-800">{stats.acceptRate}</span>
                    <span className="text-[11px] font-bold text-emerald-500">{stats.acceptDetail}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1.5 italic">Percent of extended contract offer packets signed by talent</p>
                </div>

                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-10 w-10 bg-emerald-50/40 rounded-bl-3xl flex items-center justify-center">
                    <Coins className="h-4 w-4 text-emerald-500" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">Recruitment Cost YTD</span>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="text-3xl font-black text-novora">—</span>
                    <span className="text-xs font-semibold text-slate-400">Not tracked yet</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1.5 italic">Jobboard credits + external recruitment agency payouts</p>
                </div>

              </div>

              {/* Split visuals */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                
                {/* Left Column 6cols: Conversion rate & Cost split */}
                <div className="xl:col-span-6 space-y-6">
                  
                  {/* Pipeline conversion rate */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
                    <div className="border-b border-slate-50 pb-3 mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Candidate conversion waterfall %</h3>
                        <span className="text-[10px] text-slate-400 font-bold italic mt-0.5 block">{stats.text}</span>
                      </div>
                      <span className="text-[11px] font-bold text-novora bg-blue-50 px-2.5 py-1 rounded-full inline-flex items-center whitespace-nowrap shrink-0">{stats.totalApplicants}</span>
                    </div>

                    {stats.funnelSteps[0].from === 0 ? (
                      <p className="py-6 text-center text-xs text-slate-400">No applicants in this period yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {stats.funnelSteps.map((step) => (
                          <div key={step.label}>
                            <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                              <span>{step.label}</span>
                              <span className={`${step.text} font-bold`}>{step.pct}% {step.suffix}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className={`${step.bar} h-full`} style={{ width: `${step.pct}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recruitment Cost by source */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
                    <div className="border-b border-slate-50 pb-3 mb-4">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Recruitment cost distribution by channel</h3>
                    </div>

                    <p className="py-6 text-center text-xs text-slate-400">No channel spend recorded yet.</p>
                  </div>

                </div>

                {/* Right Column 6cols: Requisition status summary & Time to hire by dept */}
                <div className="xl:col-span-6 space-y-6">
                  
                  {/* Requisition status summary table list */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs font-semibold">
                    <div className="border-b border-slate-50 pb-3 mb-4 flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans">Requisition pipeline activity snapshot</h3>
                      <span className="text-[10px] font-bold text-slate-400">Sector: {reportFilterDept}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Open requisitions</span>
                        <span className="text-xl font-extrabold text-blue-600 mt-0.5 block">{stats.open}</span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Filled in period</span>
                        <span className="text-xl font-extrabold text-emerald-600 mt-0.5 block">{stats.filled}</span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">On hold status</span>
                        <span className="text-xl font-extrabold text-amber-600 mt-0.5 block">{stats.hold}</span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Cancelled requirements</span>
                        <span className="text-xl font-extrabold text-rose-600 mt-0.5 block">{stats.cancelled}</span>
                      </div>
                    </div>

                    <div className="mt-4.5 pt-4.5 border-t border-slate-100 space-y-3 font-semibold text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>Total applicants mapped</span>
                        <span className="text-slate-800 font-bold">{stats.totalApplicants}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Panel evaluations conducted</span>
                        <span className="text-slate-800 font-bold">{stats.interviews}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Contract offer envelopes extended</span>
                        <span className="text-slate-800 font-bold">{stats.offers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Employment offers signed &amp; closed</span>
                        <span className="text-emerald-600 font-extrabold">{stats.signed}</span>
                      </div>
                    </div>
                  </div>

                  {/* Avg time to hire by department */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
                    <div className="border-b border-slate-50 pb-3 mb-4">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Average position filling speed by department (days)</h3>
                    </div>

                    {stats.deptSpeed.length === 0 ? (
                      <p className="py-6 text-center text-xs text-slate-400">No filled positions yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {stats.deptSpeed.map((row) => (
                          <div key={row.dept}>
                            <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                              <span>{row.dept}</span>
                              <span className="text-slate-800 font-bold">{row.days} {row.days === 1 ? 'day' : 'days'}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className={`h-full ${reportFilterDept === row.dept ? 'bg-novora' : 'bg-slate-450'}`} style={{ width: `${stats.maxDeptDays > 0 ? Math.max(4, Math.round((row.days / stats.maxDeptDays) * 100)) : 0}%`, backgroundColor: reportFilterDept === row.dept ? '#2563eb' : '#94a3b8' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

              </div>

              {/* ---------------- DEEPLY DETAILED RECRUITMENT AUDITING TABLE ---------------- */}
              <div id="recruitment-detailed-report-card" className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Analytical Record-Level Recruitment Log</h3>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                      Granular requisition funnel metrics, marketing channel budgets, and precise closure times
                    </p>
                  </div>
                  
                  {/* Local report search query term */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={reportSearchQuery}
                        onChange={(e) => setReportSearchQuery(e.target.value)}
                        placeholder="Search role, REQ, recruiter..."
                        className="bg-slate-50 border border-slate-200 focus:border-novora rounded-xl pl-8.5 pr-7 py-1.5 text-xs font-semibold text-slate-700 outline-none w-56"
                      />
                      {reportSearchQuery && (
                        <button
                          onClick={() => setReportSearchQuery('')}
                          className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 font-bold text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        const n = downloadNearestTableCsv(e.currentTarget, `recruitment_requisitions_${dateStamp()}`);
                        addToast(n ? `Exported ${n} rows as CSV.` : 'Nothing to export yet.', n ? 'success' : 'info');
                      }}
                      className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="h-3 w-3" />
                      <span>Export Ledger</span>
                    </button>
                  </div>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4.5">Req Code</th>
                        <th className="py-3 px-4.5">Job Position &amp; Sector</th>
                        <th className="py-3 px-4.5">Lead Recruiter</th>
                        <th className="py-3 px-4.5 text-center">Conversion Funnel Stages (A &rarr; S &rarr; I &rarr; O &rarr; H)</th>
                        <th className="py-3 px-4.5 text-right">Channel Spend</th>
                        <th className="py-3 px-4.5 text-right flex justify-end gap-1 items-center"><Clock className="w-3 h-3 text-slate-400" /> <span>Cycle Time</span></th>
                        <th className="py-3 px-4.5 text-center">Auditing Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-600">
                      {filteredDetailedRows.map((row) => (
                        <tr key={row.reqId} className="hover:bg-slate-50/30 transition-colors">
                          <td className="py-3.5 px-4.5 text-slate-450 font-mono text-[11px]">{row.reqId}</td>
                          <td className="py-3.5 px-4.5">
                            <span className="text-slate-800 font-bold block">{row.position}</span>
                            <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">{row.dept} department</span>
                          </td>
                          <td className="py-3.5 px-4.5 text-slate-700 font-bold">{row.recruiter}</td>
                          <td className="py-3.5 px-4.5">
                            <div className="flex items-center justify-center">
                              {/* Modular stages path sequence with interactive details */}
                              <div className="flex items-center gap-1 text-[10.5px]">
                                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-extrabold" title="Total applicants who applied">
                                  {row.funnel.applied} <span className="text-[9px] font-medium text-slate-400">A</span>
                                </span>
                                <span className="text-slate-200 font-normal">&rarr;</span>
                                <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-extrabold" title="Applicants selected on profile review screening matching">
                                  {row.funnel.screened} <span className="text-[9px] font-medium text-blue-300">S</span>
                                </span>
                                <span className="text-slate-200 font-normal">&rarr;</span>
                                <span className="bg-sky-50 text-sky-600 px-2 py-0.5 rounded-md font-extrabold" title="Interview panels or cognitive sessions run">
                                  {row.funnel.interview} <span className="text-[9px] font-medium text-sky-300">I</span>
                                </span>
                                <span className="text-slate-200 font-normal">&rarr;</span>
                                <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md font-extrabold" title="Formal contract packets extended">
                                  {row.funnel.offer} <span className="text-[9px] font-medium text-amber-400">O</span>
                                </span>
                                <span className="text-slate-200 font-normal">&rarr;</span>
                                <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md font-extrabold" title="Ultimate candidate signed status starters">
                                  {row.funnel.hired} <span className="text-[9px] font-medium text-emerald-400">H</span>
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4.5 text-right text-slate-800 font-bold">{row.spent}</td>
                          <td className="py-3.5 px-4.5 text-right font-extrabold text-slate-700">{row.timeToClose}</td>
                          <td className="py-3.5 px-4.5 text-center">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9.5px] font-bold whitespace-nowrap shrink-0 ${
                              row.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600 animate-pulse'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {filteredDetailedRows.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-6 text-center text-xs text-slate-400">No records yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Footnote details validation integrity */}
                <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 font-semibold pt-1">
                  <span>
                    Displaying {filteredDetailedRows.length} validated recruitment channels breakdown rows.
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 bg-emerald-500 rounded-full inline-block animate-pulse items-center shrink-0" />
                    <span>Derived from live recruitment records</span>
                  </div>
                </div>
              </div>

            </div>
          );
        })()}

      </div>

      {/* ----------------- MODAL DIALOGS OVERWRITING "EMPTY INITIAL ADD" COMPLAINTS ----------------- */}

      {/* 1. NEW REQUISITION MODAL (3-STEP GRAPHICAL WORKFLOW AS DESIGNED) */}
      {requisitionModalOpen && (
        <div id="new-req-modal-backdrop" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div id="new-req-modal-panel" className="bg-white text-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden transform animate-in fade-in duration-200 max-h-[calc(100vh-2rem)] flex flex-col">
            
            {/* Modal Title Banner & Header */}
            <div className="border-b border-slate-100 px-5 sm:px-6 py-4 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">New job requisition</h2>
                <p className="text-xs text-slate-400 font-semibold mt-1">
                  {nextReqId} &bull; Novora HRMS PTE Ltd
                </p>
              </div>
              <button
                onClick={() => {
                  setRequisitionModalOpen(false);
                  setRequisitionStep(1);
                }}
                className="h-9 w-9 border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="text-lg font-bold">✕</span>
              </button>
            </div>

            {/* Step Indicators Ribbon */}
            <div className="px-5 sm:px-6 py-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between select-none text-xs font-bold shrink-0">
              <div className="flex items-center gap-2.5">
                <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  requisitionStep === 1 
                    ? 'bg-novora text-white' 
                    : 'bg-novora/20 text-novora border border-novora/30'
                }`}>
                  {requisitionStep > 1 ? '✓' : '1'}
                </span>
                <span className={requisitionStep === 1 ? 'text-novora font-semibold' : 'text-slate-400'}>
                  Position details
                </span>
              </div>

              <div className="h-0.5 flex-1 mx-4 bg-slate-200 rounded-full" />

              <div className="flex items-center gap-2.5">
                <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  requisitionStep === 2 
                    ? 'bg-novora text-white' 
                    : requisitionStep > 2 
                    ? 'bg-novora/20 text-novora border border-novora/30' 
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  {requisitionStep > 2 ? '✓' : '2'}
                </span>
                <span className={requisitionStep === 2 ? 'text-novora font-semibold' : 'text-slate-400'}>
                  Requirements &amp; JD
                </span>
              </div>

              <div className="h-0.5 flex-1 mx-4 bg-slate-200 rounded-full" />

              <div className="flex items-center gap-2.5">
                <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  requisitionStep === 3 
                    ? 'bg-novora text-white' 
                    : 'bg-slate-100 text-slate-400'
                }`}>
                  3
                </span>
                <span className={requisitionStep === 3 ? 'text-novora font-semibold' : 'text-slate-400'}>
                  Approval &amp; routing
                </span>
              </div>
            </div>

            {/* Form Fields Dynamic Wrapper */}
            <form onSubmit={(e) => e.preventDefault()} className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6">

              {/* STEP 1: POSITION DETAILS SCREEN */}
              {requisitionStep === 1 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  
                  {/* Position Info Heading */}
                  <div>
                    <h3 className="text-xs font-bold text-novora uppercase tracking-wider mb-4">
                      Position Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                      <div>
                        <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Position title *</label>
                        <input
                          type="text"
                          placeholder="e.g. HR Business Partner"
                          value={reqForm.positionTitle}
                          onChange={(e) => setReqForm({ ...reqForm, positionTitle: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 outline-none focus:border-novora focus:ring-1 focus:ring-novora/50 font-semibold"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Department *</label>
                        <SelectMenu
                          value={reqForm.department}
                          onChange={(v) => setReqForm({ ...reqForm, department: v })}
                          triggerClassName="text-xs font-semibold bg-slate-50 border-slate-200"
                          options={[
                            { value: 'HR', label: 'Human Resources' },
                            { value: 'Engineering', label: 'Engineering' },
                            { value: 'Finance', label: 'Finance' },
                            { value: 'Marketing', label: 'Marketing' },
                            { value: 'Operations', label: 'Operations' },
                          ]}
                        />
                      </div>
                      <div>
                        <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Section / team</label>
                        <SelectMenu
                          value={reqForm.sectionTeam}
                          onChange={(v) => setReqForm({ ...reqForm, sectionTeam: v })}
                          triggerClassName="text-xs font-semibold bg-slate-50 border-slate-200"
                          options={[
                            { value: '', label: '-- Select section (optional) --' },
                            { value: 'Recruitment', label: 'Recruitment & Talent' },
                            { value: 'Operations', label: 'HR Operations' },
                            { value: 'CompBen', label: 'Compensation & Benefits' },
                          ]}
                        />
                      </div>
                      <div>
                        <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Reports to *</label>
                        <SelectMenu
                          value={reqForm.reportsTo}
                          onChange={(v) => setReqForm({ ...reqForm, reportsTo: v })}
                          triggerClassName="text-xs font-semibold bg-slate-50 border-slate-200"
                          options={personSelectOptions}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Employment Details Section */}
                  <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-xs font-bold text-novora uppercase tracking-wider mb-4">
                      Employment Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                      <div>
                        <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Employment type *</label>
                        <SelectMenu
                          value={reqForm.employmentType}
                          onChange={(v) => setReqForm({ ...reqForm, employmentType: v })}
                          triggerClassName="text-xs font-semibold bg-slate-50 border-slate-200"
                          options={[
                            { value: 'Permanent', label: 'Permanent' },
                            { value: 'Contract', label: 'Contract' },
                            { value: 'Temporary', label: 'Temporary' },
                          ]}
                        />
                      </div>
                      <div>
                        <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Work arrangement</label>
                        <SelectMenu
                          value={reqForm.workArrangement}
                          onChange={(v) => setReqForm({ ...reqForm, workArrangement: v })}
                          triggerClassName="text-xs font-semibold bg-slate-50 border-slate-200"
                          options={[
                            { value: 'On-site', label: 'On-site' },
                            { value: 'Hybrid', label: 'Hybrid' },
                            { value: 'Remote', label: 'Remote' },
                          ]}
                        />
                      </div>
                      <div>
                        <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Job grade</label>
                        <SelectMenu
                          value={reqForm.jobGrade}
                          onChange={(v) => setReqForm({ ...reqForm, jobGrade: v })}
                          triggerClassName="text-xs font-semibold bg-slate-50 border-slate-200"
                          options={[
                            { value: 'G-5 / Sub B', label: 'G-5 / Sub B' },
                            { value: 'G-4 / Senior Executive', label: 'G-4 / Senior Executive' },
                            { value: 'G-6 / Director Level', label: 'G-6 / Director Level' },
                          ]}
                        />
                      </div>
                      <div>
                        <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">No. of vacancies *</label>
                        <input
                          type="number"
                          value={reqForm.vacancies}
                          onChange={(e) => setReqForm({ ...reqForm, vacancies: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 outline-none focus:border-novora font-semibold"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Target fill date *</label>
                        <input
                          type="text"
                          placeholder="e.g. 13 May 2026"
                          value={reqForm.targetFillDate}
                          onChange={(e) => setReqForm({ ...reqForm, targetFillDate: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 outline-none focus:border-novora font-semibold"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Urgency</label>
                        <SelectMenu
                          value={reqForm.urgency}
                          onChange={(v) => setReqForm({ ...reqForm, urgency: v })}
                          triggerClassName="text-xs font-semibold bg-slate-50 border-slate-200"
                          options={[
                            { value: 'Normal', label: 'Normal' },
                            { value: 'Urgent', label: 'Urgent' },
                            { value: 'Critical', label: 'Immediate / Critical' },
                          ]}
                        />
                      </div>
                      <div>
                        <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Salary range &mdash; min ({currency})</label>
                        <input
                          type="text"
                          placeholder="e.g. 5500"
                          value={reqForm.salaryMin}
                          onChange={(e) => setReqForm({ ...reqForm, salaryMin: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 outline-none focus:border-novora font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Salary range &mdash; max ({currency})</label>
                        <input
                          type="text"
                          placeholder="e.g. 7000"
                          value={reqForm.salaryMax}
                          onChange={(e) => setReqForm({ ...reqForm, salaryMax: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 outline-none focus:border-novora font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Reason for requisition *</label>
                        <SelectMenu
                          value={reqForm.reason}
                          onChange={(v) => setReqForm({ ...reqForm, reason: v })}
                          triggerClassName="text-xs font-semibold bg-slate-50 border-slate-200"
                          options={[
                            { value: 'New headcount', label: 'New headcount' },
                            { value: 'Replacement', label: 'Replacement vacancy' },
                            { value: 'Budget expansion', label: 'Special budget expansion' },
                          ]}
                        />
                      </div>
                    </div>

                    <div className="mt-5 text-xs">
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Justification / notes</label>
                      <textarea
                        rows={3}
                        placeholder="Briefly justify the need for this position..."
                        value={reqForm.justification}
                        onChange={(e) => setReqForm({ ...reqForm, justification: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:border-novora font-semibold"
                      />
                    </div>
                  </div>

                  {/* Step Footer navigation */}
                  <div className="sticky bottom-0 z-10 -mx-5 sm:-mx-6 px-5 sm:px-6 py-3.5 mt-4 border-t border-slate-100 bg-white/95 backdrop-blur-xs flex items-center justify-between gap-3">
                    <span className="text-slate-500 font-bold text-xs min-w-0 truncate">
                      Step 1 of 3 &mdash; Position details
                    </span>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setRequisitionModalOpen(false);
                          setRequisitionStep(1);
                        }}
                        className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-all border border-slate-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!reqForm.positionTitle.trim()) {
                            addToast('Please input a valid Position title', 'error');
                            return;
                          }
                          setRequisitionStep(2);
                        }}
                        className="px-4 py-2 text-xs font-bold rounded-xl bg-novora hover:bg-opacity-95 text-white cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        <span>Next</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* STEP 2: REQUIREMENTS & JD */}
              {requisitionStep === 2 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  
                  {/* Qualifications Section */}
                  <div>
                    <h3 className="text-xs font-bold text-novora uppercase tracking-wider mb-4">
                      Qualifications
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                      <div>
                        <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Minimum education *</label>
                        <SelectMenu
                          value={reqForm.minEducation}
                          onChange={(v) => setReqForm({ ...reqForm, minEducation: v })}
                          triggerClassName="text-xs font-semibold bg-slate-50 border-slate-200"
                          options={[
                            { value: 'Bachelor\'s degree', label: 'Bachelor\'s degree' },
                            { value: 'Diploma', label: 'Diploma / Associate\'s' },
                            { value: 'Master\'s degree', label: 'Master\'s degree' },
                            { value: 'PhD', label: 'PhD / Doctorate' },
                          ]}
                        />
                      </div>
                      <div>
                        <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Field of study</label>
                        <input
                          type="text"
                          placeholder="e.g. Human Resource Management, Business"
                          value={reqForm.fieldOfStudy}
                          onChange={(e) => setReqForm({ ...reqForm, fieldOfStudy: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 outline-none focus:border-novora font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Minimum experience (years) *</label>
                        <SelectMenu
                          value={reqForm.minExperience}
                          onChange={(v) => setReqForm({ ...reqForm, minExperience: v })}
                          triggerClassName="text-xs font-semibold bg-slate-50 border-slate-200"
                          options={[
                            { value: 'Fresh graduate (0 yrs)', label: 'Fresh graduate (0 yrs)' },
                            { value: '1-2 yrs', label: '1 &mdash; 2 yrs experience' },
                            { value: '3-5 yrs', label: '3 &mdash; 5 yrs experience' },
                            { value: '5+ yrs', label: '5+ yrs senior experience' },
                          ]}
                        />
                      </div>
                      <div>
                        <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Language requirement</label>
                        <SelectMenu
                          value={reqForm.languageRequirement}
                          onChange={(v) => setReqForm({ ...reqForm, languageRequirement: v })}
                          triggerClassName="text-xs font-semibold bg-slate-50 border-slate-200"
                          options={[
                            { value: 'English only', label: 'English only' },
                            { value: 'Bilingual English &amp; Malay', label: 'Bilingual (English & Malay)' },
                            { value: 'Mandarin highly preferred', label: 'Mandarin highly preferred' },
                            { value: 'English, Malay, Mandarin', label: 'Trilingual proficient' },
                          ]}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Skills Required (badges list + interactive entry) */}
                  <div className="border-t border-slate-100 pt-6">
                    <label className="block text-xs font-bold text-novora uppercase tracking-wider mb-3">
                      Skills Required
                    </label>
                    
                    {/* Active skill tags display */}
                    <div className="flex flex-wrap gap-2 mb-3.5">
                      {reqForm.skills.map((skill) => (
                        <div
                          key={skill}
                          className="bg-novora/15 text-novora border border-novora/25 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-2"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setReqForm({
                                ...reqForm,
                                skills: reqForm.skills.filter((sk) => sk !== skill),
                              });
                            }}
                            className="hover:bg-novora/20 text-blue-400 hover:text-slate-800 rounded-md px-1 select-none font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      {reqForm.skills.length === 0 && (
                        <span className="text-slate-500 font-bold italic text-xs">
                          No skill tags associated with this job specifications yet.
                        </span>
                      )}
                    </div>

                    {/* Quick input bar trigger */}
                    <div className="flex items-center gap-3 max-w-lg">
                      <input
                        type="text"
                        placeholder="Type a skill and press Add..."
                        value={reqForm.newSkillInput}
                        onChange={(e) => setReqForm({ ...reqForm, newSkillInput: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (!reqForm.newSkillInput.trim()) return;
                            if (reqForm.skills.includes(reqForm.newSkillInput.trim())) return;
                            setReqForm({
                              ...reqForm,
                              skills: [...reqForm.skills, reqForm.newSkillInput.trim()],
                              newSkillInput: '',
                            });
                          }
                        }}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-800 outline-none focus:border-novora font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!reqForm.newSkillInput.trim()) return;
                          if (reqForm.skills.includes(reqForm.newSkillInput.trim())) return;
                          setReqForm({
                            ...reqForm,
                            skills: [...reqForm.skills, reqForm.newSkillInput.trim()],
                            newSkillInput: '',
                          });
                        }}
                        className="bg-novora/10 border border-novora/25 text-novora hover:bg-novora hover:text-white transition-all font-bold text-xs px-3.5 py-2 rounded-xl cursor-pointer"
                      >
                        + Add skill
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <h3 className="text-xs font-bold text-novora uppercase tracking-wider">
                        Job Description
                      </h3>
                      <button
                        type="button"
                        disabled={aiJdBusy}
                        onClick={() => void handleAiJdDraft()}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-novora/25 bg-novora/5 px-3 py-1.5 text-[11px] font-bold text-novora hover:bg-novora/10 disabled:opacity-60 cursor-pointer transition-all"
                        title="Draft JD with Gemini (review before publishing)"
                      >
                        <Sparkles className={`h-3.5 w-3.5 ${aiJdBusy ? 'animate-spin' : ''}`} />
                        {aiJdBusy ? 'Drafting…' : 'AI Draft JD'}
                      </button>
                    </div>
                    <div className="space-y-4 text-xs">
                      <div>
                        <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Key responsibilities *</label>
                        <textarea
                          rows={4}
                          value={reqForm.responsibilities}
                          onChange={(e) => setReqForm({ ...reqForm, responsibilities: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:border-novora font-mono leading-relaxed font-semibold"
                          required
                        />
                        <p className="mt-1.5 text-[10px] text-slate-400">AI suggests a draft only — you review before submitting.</p>
                      </div>
                      <div>
                        <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nice-to-have / preferred</label>
                        <textarea
                          rows={2}
                          placeholder="Optional additional requirements or preferences..."
                          value={reqForm.niceToHave}
                          onChange={(e) => setReqForm({ ...reqForm, niceToHave: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:border-novora font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Publishing Channels Block */}
                  <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-xs font-bold text-novora uppercase tracking-wider mb-4">
                      Publishing Channels
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-slate-600 font-semibold select-none">
                      <label className="flex items-center gap-3 cursor-pointer bg-slate-50 p-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                        <input
                          type="checkbox"
                          checked={reqForm.channels.internal}
                          onChange={(e) => setReqForm({
                            ...reqForm,
                            channels: { ...reqForm.channels, internal: e.target.checked }
                          })}
                          className="h-4.5 w-4.5 text-novora rounded bg-white border-slate-300 focus:ring-novora"
                        />
                        <span>Internal careers portal</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer bg-slate-50 p-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                        <input
                          type="checkbox"
                          checked={reqForm.channels.jobstreet}
                          onChange={(e) => setReqForm({
                            ...reqForm,
                            channels: { ...reqForm.channels, jobstreet: e.target.checked }
                          })}
                          className="h-4.5 w-4.5 text-novora rounded bg-white border-slate-300 focus:ring-novora"
                        />
                        <span>JobStreet.com</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer bg-slate-50 p-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                        <input
                          type="checkbox"
                          checked={reqForm.channels.linkedin}
                          onChange={(e) => setReqForm({
                            ...reqForm,
                            channels: { ...reqForm.channels, linkedin: e.target.checked }
                          })}
                          className="h-4.5 w-4.5 text-novora rounded bg-white border-slate-300 focus:ring-novora"
                        />
                        <span>LinkedIn Jobs</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer bg-slate-50 p-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                        <input
                          type="checkbox"
                          checked={reqForm.channels.indeed}
                          onChange={(e) => setReqForm({
                            ...reqForm,
                            channels: { ...reqForm.channels, indeed: e.target.checked }
                          })}
                          className="h-4.5 w-4.5 text-novora rounded bg-white border-slate-300 focus:ring-novora"
                        />
                        <span>Indeed</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer bg-slate-50 p-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors col-span-1 sm:col-span-2">
                        <input
                          type="checkbox"
                          checked={reqForm.channels.agency}
                          onChange={(e) => setReqForm({
                            ...reqForm,
                            channels: { ...reqForm.channels, agency: e.target.checked }
                          })}
                          className="h-4.5 w-4.5 text-novora rounded bg-white border-slate-300 focus:ring-novora"
                        />
                        <span>Recruitment agency (Consultant dispatch partners)</span>
                      </label>
                    </div>
                  </div>

                  {/* Step Footer navigation */}
                  <div className="sticky bottom-0 z-10 -mx-5 sm:-mx-6 px-5 sm:px-6 py-3.5 mt-4 border-t border-slate-100 bg-white/95 backdrop-blur-xs flex items-center justify-between gap-3">
                    <span className="text-slate-500 font-bold text-xs flex items-center gap-1.5">
                      Step 2 of 3 &mdash; Requirements &amp; JD
                    </span>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => setRequisitionStep(1)}
                        className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-all border border-slate-200"
                      >
                        &larr; Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setRequisitionStep(3)}
                        className="px-4 py-2 text-xs font-bold rounded-xl bg-novora hover:bg-opacity-95 text-white cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        <span>Next</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* STEP 3: APPROVAL & ROUTING */}
              {requisitionStep === 3 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  
                  {/* Approval chain flowchart visualization */}
                  <div>
                    <h3 className="text-xs font-bold text-novora uppercase tracking-wider mb-2">
                      Approval Chain
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 mb-4 select-none">
                      Based on the department and job grade selected, the following approval chain has been auto-configured. You may adjust if needed.
                    </p>

                    <div className="space-y-3 font-semibold text-xs text-slate-500 select-none">
                      
                      {/* Approver 1 */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="h-7 w-7 rounded-lg bg-novora/20 text-novora flex items-center justify-center font-bold text-xs border border-novora/40">
                            1
                          </span>
                          <div>
                            <span className="font-extrabold text-slate-800 block">{reqForm.hiringManager || 'Not assigned'}</span>
                            <span className="text-[10.5px] text-slate-400 font-bold mt-0.5 block">
                              Hiring manager &bull; Direct manager approval
                            </span>
                          </div>
                        </div>
                        <span className="bg-amber-500/10 border border-amber-500/25 text-amber-500 text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
                          Pending
                        </span>
                      </div>

                      {/* Direction flow Arrow index indicator */}
                      <div className="flex justify-center py-0.5">
                        <ChevronRight className="h-4 w-4 text-slate-600 transform rotate-90" />
                      </div>

                      {/* Approver 2 */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="h-7 w-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs border border-slate-200">
                            2
                          </span>
                          <div>
                            <span className="font-extrabold text-slate-800 block">{reqForm.reportsTo || 'Not assigned'}</span>
                            <span className="text-[10.5px] text-slate-400 font-bold mt-0.5 block">
                              Reports to &bull; Final approval
                            </span>
                          </div>
                        </div>
                        <span className="bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
                          Waiting
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-xs font-bold text-novora uppercase tracking-wider mb-4">
                      Notification Settings
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 font-semibold select-none">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={reqForm.notifySubmit}
                          onChange={(e) => setReqForm({ ...reqForm, notifySubmit: e.target.checked })}
                          className="h-4.5 w-4.5 text-novora rounded bg-white border-slate-300 focus:ring-novora"
                        />
                        <span>Email approvers when requisition is submitted</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={reqForm.notifyAction}
                          onChange={(e) => setReqForm({ ...reqForm, notifyAction: e.target.checked })}
                          className="h-4.5 w-4.5 text-novora rounded bg-white border-slate-300 focus:ring-novora"
                        />
                        <span>Notify me when each approver acts</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={reqForm.autoPublish}
                          onChange={(e) => setReqForm({ ...reqForm, autoPublish: e.target.checked })}
                          className="h-4.5 w-4.5 text-novora rounded bg-white border-slate-300 focus:ring-novora"
                        />
                        <span className="text-slate-800 font-extrabold">
                          Auto-publish job posting when fully approved *
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={reqForm.notifyHrTeam}
                          onChange={(e) => setReqForm({ ...reqForm, notifyHrTeam: e.target.checked })}
                          className="h-4.5 w-4.5 text-novora rounded bg-white border-slate-300 focus:ring-novora"
                        />
                        <span>Notify HR team on approval</span>
                      </label>
                    </div>
                  </div>

                  {/* Assign Recruiter */}
                  <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-xs font-bold text-novora uppercase tracking-wider mb-4">
                      Assign Recruiter
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                      <div>
                        <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Primary recruiter *</label>
                        <SelectMenu
                          value={reqForm.primaryRecruiter}
                          onChange={(v) => setReqForm({ ...reqForm, primaryRecruiter: v })}
                          triggerClassName="text-xs font-semibold bg-slate-50 border-slate-200"
                          options={personSelectOptions}
                        />
                      </div>
                      <div>
                        <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Hiring manager</label>
                        <SelectMenu
                          value={reqForm.hiringManager}
                          onChange={(v) => setReqForm({ ...reqForm, hiringManager: v })}
                          triggerClassName="text-xs font-semibold bg-slate-50 border-slate-200"
                          options={personSelectOptions}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preview Requisition Summary Card */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs">
                    <h4 className="font-extrabold text-novora border-b border-slate-100 pb-2 mb-3 tracking-wide">
                      Requisition summary
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 font-semibold">
                      <div className="flex justify-between md:border-r border-slate-100 pr-4">
                        <span className="text-slate-400">Ref. no.</span>
                        <span className="text-slate-200 font-mono">{nextReqId}</span>
                      </div>
                      <div className="flex justify-between pl-0 md:pl-4">
                        <span className="text-slate-400">Position</span>
                        <span className="text-slate-800 font-bold">
                          {reqForm.positionTitle || '—'}
                        </span>
                      </div>
                      <div className="flex justify-between md:border-r border-slate-100 pr-4">
                        <span className="text-slate-400">Department</span>
                        <span className="text-slate-200">{reqForm.department}</span>
                      </div>
                      <div className="flex justify-between pl-0 md:pl-4">
                        <span className="text-slate-400">Employment type</span>
                        <span className="text-slate-200">
                          {reqForm.employmentType} &bull; {reqForm.workArrangement}
                        </span>
                      </div>
                      <div className="flex justify-between md:border-r border-slate-100 pr-4">
                        <span className="text-slate-400">Salary range</span>
                        <span className="text-slate-800 font-bold">
                          {reqForm.salaryMin || reqForm.salaryMax
                            ? `${currency} ${parseSalary(reqForm.salaryMin)?.toLocaleString() ?? '—'} — ${parseSalary(reqForm.salaryMax)?.toLocaleString() ?? '—'}`
                            : '—'}
                        </span>
                      </div>
                      <div className="flex justify-between pl-0 md:pl-4">
                        <span className="text-slate-400">Target fill</span>
                        <span className="text-rose-400 font-bold">{reqForm.targetFillDate || '—'}</span>
                      </div>
                      <div className="flex justify-between col-span-1 md:col-span-2 border-t border-slate-100 pt-2.5 mt-1">
                        <span className="text-slate-400">Route map routing</span>
                        <span className="text-slate-500 font-semibold">
                          {reqForm.hiringManager.split(' (')[0] || 'Hiring manager'} (Hiring Mgr) &rarr; {reqForm.reportsTo.split(' (')[0] || 'Final approver'} (Final Approval)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Step Footer navigation */}
                  <div className="sticky bottom-0 z-10 -mx-5 sm:-mx-6 px-5 sm:px-6 py-3.5 mt-4 border-t border-slate-100 bg-white/95 backdrop-blur-xs flex items-center justify-between gap-3">
                    <span className="text-slate-500 font-bold text-xs">
                      Step 3 of 3 &mdash; Approval &amp; routing
                    </span>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => setRequisitionStep(2)}
                        className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-all border border-slate-200"
                      >
                        &larr; Back
                      </button>
                      <button
                        type="button"
                        onClick={handleCreateRequisition}
                        className="px-4 py-2 text-xs font-bold rounded-xl bg-novora hover:bg-opacity-95 text-white cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        <span>✓ Submit requisition</span>
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </form>
          </div>
        </div>
      )}

      {/* 2. CREATE JOB POSTING MODAL */}
      {postingModalOpen && (
        <div id="new-posting-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-100 overflow-hidden transform animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Publish New Job Posting</h3>
              <button onClick={() => setPostingModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-xs select-none">✕</button>
            </div>
            <form onSubmit={handleCreatePosting} className="p-6 space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Linked Requisition</label>
                  <SelectMenu
                    value={newPost.linkedReqId}
                    onChange={(v) => {
                      const reqObj = requisitions.find((r) => r.id === v)
                      setNewPost({
                        ...newPost,
                        linkedReqId: v,
                        position: reqObj ? reqObj.positionTitle : '',
                      })
                    }}
                    placeholder="Select open requisition record"
                    triggerClassName="w-full bg-slate-50 border-slate-200 rounded-xl text-xs text-slate-700"
                    options={[
                      { value: '', label: 'Select open requisition record' },
                      ...requisitions.map((r) => ({
                        value: r.id,
                        label: `${r.id} — ${r.positionTitle}`,
                      })),
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Publish Channel</label>
                  <SelectMenu
                    value={newPost.channel}
                    onChange={(v) => setNewPost({ ...newPost, channel: v })}
                    triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                    options={[
                      { value: 'LinkedIn', label: 'LinkedIn Jobs' },
                      { value: 'JobStreet', label: 'JobStreet.com' },
                      { value: 'Indeed', label: 'Indeed' },
                      { value: 'Internal', label: 'Internal Careers page' },
                    ]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Job Title on Ads *</label>
                <input
                  type="text"
                  placeholder="e.g. HR Business Partner"
                  value={newPost.position}
                  onChange={(e) => setNewPost({ ...newPost, position: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Salary Range Min *</label>
                  <input
                    type="text"
                    value={newPost.salaryMin}
                    onChange={(e) => setNewPost({ ...newPost, salaryMin: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Salary Range Max *</label>
                  <input
                    type="text"
                    value={newPost.salaryMax}
                    onChange={(e) => setNewPost({ ...newPost, salaryMax: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Job Description Summary</label>
                  <button
                    type="button"
                    disabled={aiPostJdBusy}
                    onClick={() => void handleAiPostJdDraft()}
                    className="inline-flex items-center gap-1 rounded-lg border border-novora/25 bg-novora/5 px-2.5 py-1 text-[10px] font-bold text-novora hover:bg-novora/10 disabled:opacity-60 cursor-pointer"
                  >
                    <Sparkles className={`h-3 w-3 ${aiPostJdBusy ? 'animate-spin' : ''}`} />
                    {aiPostJdBusy ? 'Drafting…' : 'AI Draft'}
                  </button>
                </div>
                <textarea
                  rows={4}
                  placeholder="Key responsibilities, benefits, requirements..."
                  value={newPost.description}
                  onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
                />
              </div>

              <div className="border-t border-slate-50 pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setPostingModalOpen(false)}
                  className="flex-1 px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-all border border-slate-200 text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-xs font-bold rounded-xl bg-novora hover:bg-opacity-95 text-white cursor-pointer transition-all text-center"
                >
                  Publish ad posting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. ADD CANDIDATE MODAL (High Fidelity, Dark-Themed) */}
      {candidateModalOpen && (
        <div id="new-cand-modal-backdrop" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div id="new-cand-modal-panel" className="bg-white text-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden transform animate-in fade-in duration-200 max-h-[calc(100vh-2rem)] flex flex-col">
            
            {/* Header */}
            <div className="border-b border-slate-100 px-5 sm:px-6 py-4 flex items-center justify-between shrink-0 bg-slate-50">
              <div>
                <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-novora" />
                  <span>Add New Candidate Profile</span>
                </h2>
                <p className="text-[10.5px] text-slate-400 font-semibold mt-1">
                  Create a manual candidate record &amp; submit to screenings pipeline
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCandidateModalOpen(false)}
                className="h-8 w-8 border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="text-base font-bold">✕</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateCandidate} className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 space-y-6">
              
              {/* Block 1: Basic Info */}
              <div>
                <h3 className="text-xs font-bold text-novora uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  <span>Candidate Core Identity</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                  <div className="sm:col-span-2">
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Jasmine Kaur"
                      value={newCand.name}
                      onChange={(e) => setNewCand({ ...newCand, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 outline-none focus:border-novora transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Contact Email</label>
                    <input
                      type="email"
                      placeholder="e.g. jasmine.kaur@gmail.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 outline-none focus:border-novora transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                    <input
                      type="text"
                      placeholder="e.g. +65 9123 4567"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 outline-none focus:border-novora transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Block 2: Experience & Qualifications */}
              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-xs font-bold text-novora uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 animate-pulse" />
                  <span>Professional Credentials</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Total Relevant Experience</label>
                    <input
                      type="text"
                      placeholder="e.g. 3 yrs"
                      value={newCand.experience}
                      onChange={(e) => setNewCand({ ...newCand, experience: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 outline-none focus:border-novora transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Highest Educational Qualification</label>
                    <input
                      type="text"
                      placeholder="e.g. Bachelor Degree"
                      value={newCand.education}
                      onChange={(e) => setNewCand({ ...newCand, education: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 outline-none focus:border-novora transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Block 3: Applied Specification */}
              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-xs font-bold text-novora uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>Target Specifications</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Source Channel</label>
                    <SelectMenu
                      value={newCand.source}
                      onChange={(v) => setNewCand({ ...newCand, source: v })}
                      triggerClassName="text-xs font-semibold bg-slate-50 border-slate-200"
                      options={[
                        { value: 'LinkedIn', label: 'LinkedIn Job Ads' },
                        { value: 'JobStreet', label: 'JobStreet Portal' },
                        { value: 'Referral', label: 'Internal Employee Referral' },
                        { value: 'Direct', label: 'Direct Careers Portal' },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Target Job Requisition *</label>
                    <SelectMenu
                      value={newCand.positionApplied}
                      onChange={(v) => setNewCand({ ...newCand, positionApplied: v })}
                      placeholder="Select requisition"
                      triggerClassName="w-full bg-slate-50 border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold"
                      options={requisitions.map((r) => ({
                        value: r.positionTitle,
                        label: `${r.positionTitle} (${r.id})`,
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Expected Monthly Salary ({currency})</label>
                    <input
                      type="text"
                      placeholder="e.g. 6,500"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 outline-none focus:border-novora transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Notice Period</label>
                    <SelectMenu
                      value={candNoticePeriod}
                      onChange={setCandNoticePeriod}
                      triggerClassName="w-full bg-slate-50 border-slate-200 rounded-xl text-slate-800 font-semibold"
                      options={[
                        { value: 'Immediate / Available immediately', label: 'Immediate / Available immediately' },
                        { value: '1 month notice', label: '1 month notice' },
                        { value: '2 months notice', label: '2 months notice' },
                        { value: '3 months / buyout requirement', label: '3 months / buyout requirement' },
                      ]}
                    />
                  </div>
                </div>
              </div>

              {/* Block 4: Resume CV Dropzone */}
              <div className="border-t border-slate-100 pt-6">
                <label className="block text-xs font-bold text-novora uppercase tracking-wider mb-2.5">
                  Document Attachments
                </label>
                <div className="border border-dashed border-slate-200 hover:border-novora/40 bg-slate-50 rounded-2xl p-6 text-center cursor-pointer transition-all group">
                  <Upload className="h-8 w-8 text-slate-500 group-hover:text-novora mx-auto mb-2 transition-colors" />
                  <p className="text-xs font-bold text-slate-600">Drag &amp; drop Candidate CV/Resume PDF</p>
                  <p className="text-[10px] text-slate-500 mt-1">or click to browse local folders (Max size: 10MB)</p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="sticky bottom-0 z-10 -mx-5 sm:-mx-6 px-5 sm:px-6 py-3.5 mt-4 border-t border-slate-100 bg-white/95 backdrop-blur-xs flex items-center justify-between gap-3">
                <span className="text-slate-500 font-bold text-[11px] italic">
                  * Marked fields are mandatory for screening analysis
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCandidateModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-all border border-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-novora hover:bg-opacity-95 text-white cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <span>Import and screen</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 4. SCHEDULE INTERVIEW MODAL (High Fidelity, Dark-Themed) */}
      {interviewModalOpen && (
        <div id="new-interview-modal-backdrop" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div id="new-interview-modal-panel" className="bg-white text-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden transform animate-in fade-in duration-200 max-h-[calc(100vh-2rem)] flex flex-col">
            
            {/* Header */}
            <div className="border-b border-slate-100 px-5 sm:px-6 py-4 flex items-center justify-between shrink-0 bg-slate-50">
              <div>
                <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2.5">
                  <Calendar className="h-5 w-5 text-novora" />
                  <span>Schedule Candidate Meeting / Interview</span>
                </h2>
                <p className="text-[10.5px] text-slate-400 font-semibold mt-1">
                  Connect email addresses, allocate calendar events &amp; assign panel evaluators
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInterviewModalOpen(false)}
                className="h-8 w-8 border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="text-base font-bold">✕</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleScheduleInterview} className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Panel: Basic schedules (8 columns) */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Select candidate */}
                  <div>
                    <label className="block text-xs font-bold text-novora uppercase tracking-wider mb-2.5">
                      Target Candidate Profile
                    </label>
                    <SelectMenu
                      value={newInt.candidateId}
                      onChange={(v) => setNewInt({ ...newInt, candidateId: v })}
                      placeholder="-- Choose active candidate record --"
                      triggerClassName="w-full bg-slate-50 border-slate-200 rounded-xl text-slate-800 font-semibold text-xs"
                      options={[
                        { value: '', label: '-- Choose active candidate record --' },
                        ...candidates.map((c) => ({
                          value: c.id,
                          label: `${c.name} — Applied for ${c.positionApplied} [${c.stage}]`,
                        })),
                      ]}
                    />
                  </div>

                  {/* Date, Time, Stage */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs font-semibold">
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-sans">Interview Stage</label>
                      <SelectMenu
                        value={newInt.stage}
                        onChange={(v) => setNewInt({ ...newInt, stage: v })}
                        triggerClassName="text-xs font-semibold bg-slate-50 border-slate-200"
                        options={[
                          { value: 'Phone screening', label: 'Phone screening' },
                          { value: 'Panel interview', label: 'Panel interview' },
                          { value: 'Technical test', label: 'Technical assessment' },
                          { value: 'Director round', label: 'Director round' },
                        ]}
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Meeting format</label>
                      <div className="grid grid-cols-3 gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
                        {(['Video', 'Phone', 'In person'] as const).map((fmt) => (
                          <button
                            key={fmt}
                            type="button"
                            onClick={() => setNewInt({ ...newInt, format: fmt })}
                            className={`py-1.5 rounded-lg font-bold text-[10px] text-center transition-all cursor-pointer ${
                              newInt.format === fmt
                                ? 'bg-novora text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                            }`}
                          >
                            {fmt === 'Video' && 'Video'}
                            {fmt === 'Phone' && 'Call'}
                            {fmt === 'In person' && 'Physical'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Expected duration</label>
                      <SelectMenu
                        value={newInt.duration}
                        onChange={(v) => setNewInt({ ...newInt, duration: v })}
                        triggerClassName="text-xs font-semibold bg-slate-50 border-slate-200"
                        options={[
                          { value: '30 minutes', label: '30 mins screening' },
                          { value: '45 minutes', label: '45 mins tech talk' },
                          { value: '1 hour', label: '1 hour system panel' },
                          { value: '2 hours', label: '2 hours deep-dive session' },
                        ]}
                      />
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Schedule date</label>
                      <input
                        type="date"
                        value={newInt.date}
                        onChange={(e) => setNewInt({ ...newInt, date: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 outline-none focus:border-novora font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Time slotted</label>
                      <input
                        type="text"
                        value={newInt.time}
                        onChange={(e) => setNewInt({ ...newInt, time: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 outline-none focus:border-novora font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Meeting address / URL</label>
                      <input
                        type="text"
                        value={newInt.location}
                        placeholder="e.g. Zoom link or office address"
                        onChange={(e) => setNewInt({ ...newInt, location: e.target.value })}
                        className="w-full bg-slate-50 border border-novora/40 rounded-xl px-4 py-2.5 text-novora font-mono font-bold outline-none focus:border-novora"
                      />
                    </div>
                  </div>

                  {/* Panel assignees */}
                  <div className="border-t border-slate-100 pt-6">
                    <label className="block text-xs font-bold text-novora uppercase tracking-wider mb-2.5">
                      Assigned Panel Interviewers &bull; Users
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                      <div>
                        <input
                          type="text"
                          list="recruitment-people-options"
                          placeholder="Interviewer names, comma-separated"
                          value={newInt.interviewers}
                          onChange={(e) => setNewInt({ ...newInt, interviewers: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 outline-none focus:border-novora font-semibold"
                        />
                        <datalist id="recruitment-people-options">
                          {peopleOptions.map((p) => (
                            <option key={p} value={p.split(' (')[0]} />
                          ))}
                        </datalist>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 select-none">
                        {newInt.interviewers
                          .split(/[,+]/)
                          .map((n) => n.trim())
                          .filter(Boolean)
                          .slice(0, 4)
                          .map((n, idx) => (
                            <span
                              key={`${n}-${idx}`}
                              className={`h-6 w-6 rounded-full flex items-center justify-center font-bold shrink-0 ${idx % 2 === 0 ? 'bg-novora/10 text-novora' : 'bg-emerald-500/10 text-emerald-400'}`}
                            >
                              {initials(n)}
                            </span>
                          ))}
                        <span>{newInt.interviewers.trim() ? 'Panel members for this interview' : 'No interviewers added yet'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Invitation notes */}
                  <div className="border-t border-slate-100 pt-6">
                    <label className="block text-xs font-bold text-novora uppercase tracking-wider mb-2">
                      Custom Instructions / Notes to Candidate
                    </label>
                    <textarea
                      rows={3}
                      value={newInt.notes}
                      onChange={(e) => setNewInt({ ...newInt, notes: e.target.value })}
                      placeholder="e.g. Please bring a copy of your project portfolio and ensure reliable internet connectivity with your camera online..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 outline-none focus:border-novora text-xs font-semibold"
                    />
                  </div>

                  {/* Direct calendar sync toggles */}
                  <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl flex flex-col sm:flex-row gap-4 select-none text-[11px] font-bold text-slate-600">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newInt.sendInvite}
                        onChange={(e) => setNewInt({ ...newInt, sendInvite: e.target.checked })}
                        className="h-4 w-4 text-novora bg-white border-slate-300 rounded focus:ring-blue-500"
                      />
                      <span>Email direct calendar RSVP request sheet</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newInt.sendReminder}
                        onChange={(e) => setNewInt({ ...newInt, sendReminder: e.target.checked })}
                        className="h-4 w-4 text-novora bg-white border-slate-300 rounded focus:ring-blue-500"
                      />
                      <span>Send SMS / WhatsApp checklist reminders (24h before)</span>
                    </label>
                  </div>

                </div>

                {/* Right Panel: Calendar availability mockup (4 columns) */}
                <div className="lg:col-span-4 bg-slate-50 border border-slate-100 p-6 rounded-2xl text-xs space-y-5 select-none font-semibold">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">
                    Evaluator Core Calendars
                  </h4>

                  {/* Visual Timeline Mockup */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Booked interviews</span>
                      <span className="text-novora font-mono">
                        {parseDate(`${newInt.date}T00:00:00`)?.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) ?? '—'}
                      </span>
                    </div>

                    <div className="space-y-2 font-mono text-[10.5px]">
                      {interviewsOnSelectedDate.map((row) => (
                        <div key={row.id} className="p-2 border-l-2 border-slate-300 bg-slate-50 rounded flex justify-between items-center text-slate-500">
                          <span>{new Date(row.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <span>{row.candidateName || 'Interview'}</span>
                        </div>
                      ))}
                      <div className="p-2 border-l-2 border-novora bg-novora/15 rounded flex justify-between items-center text-novora font-bold">
                        <span>{newInt.time || '—'} (Proposed)</span>
                        <span>Candidate Interview Slot</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3.5 space-y-2 text-[11px] text-slate-400">
                    {interviewsOnSelectedDate.some((row) => row.interviewerName) ? (
                      [...new Set(interviewsOnSelectedDate.map((row) => row.interviewerName).filter((n): n is string => !!n))].map((name) => (
                        <div key={name} className="flex justify-between">
                          <span>{name}</span>
                          <span className="text-amber-500">● Booked</span>
                        </div>
                      ))
                    ) : (
                      <p>No other interviews booked on this date.</p>
                    )}
                  </div>
                </div>

              </div>

              {/* Form submit indicators */}
              <div className="sticky bottom-0 z-10 -mx-5 sm:-mx-6 px-5 sm:px-6 py-3.5 mt-4 border-t border-slate-100 bg-white/95 backdrop-blur-xs flex items-center justify-between gap-3">
                <span className="text-[11px] font-bold text-slate-500 italic">
                  Evaluators will run automated match score comparison inside the interview panel applet
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setInterviewModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-all border border-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-novora hover:bg-opacity-95 text-white cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <span>Schedule &amp; Book Calendar</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 5. CREATE OFFER MODAL (High Fidelity, Dark-Themed & LIVE INTERACTIVE PRINT PREVIEW!) */}
      {offerModalOpen && (
        <div id="new-offer-modal-backdrop" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div id="new-offer-modal-panel" className="bg-white text-slate-800 rounded-3xl w-full max-w-5xl shadow-2xl border border-slate-200 overflow-hidden transform animate-in fade-in duration-200 max-h-[calc(100vh-2rem)] flex flex-col">
            
            {/* Header */}
            <div className="border-b border-slate-100 px-5 sm:px-6 py-4 flex items-center justify-between shrink-0 bg-slate-50">
              <div>
                <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2.5">
                  <FileCheck className="h-5 w-5 text-emerald-400" />
                  <span>Draft Terms of Contract Offer &amp; Employment Package</span>
                </h2>
                <p className="text-[10.5px] text-slate-400 font-semibold mt-1">
                  Approve final package, define allowance &amp; review real-time live preview contract papers
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOfferModalOpen(false)}
                className="h-8 w-8 border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="text-base font-bold">✕</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSendOfferForm} className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left side: Inputs (6 Columns) */}
                <div className="lg:col-span-6 space-y-6">
                  
                  {/* Select candidate */}
                  <div>
                    <label className="block text-xs font-bold text-novora uppercase tracking-wider mb-2.5">
                      Approved Candidate Selection
                    </label>
                    <SelectMenu
                      value={newOffer.candidateName}
                      onChange={(v) => {
                        const cand = candidates.find((c) => c.name === v)
                        setNewOffer({
                          ...newOffer,
                          candidateName: v,
                          position: cand && cand.positionApplied !== '—' ? cand.positionApplied : '',
                        })
                      }}
                      placeholder="-- Select screen passed candidate records --"
                      triggerClassName="w-full bg-slate-50 border-slate-200 rounded-xl text-slate-800 font-bold text-xs"
                      options={[
                        { value: '', label: '-- Select screen passed candidate records --' },
                        ...candidates.map((c) => ({
                          value: c.name,
                          label: `${c.name} — ${c.positionApplied} (Score: ${c.matchScore})`,
                        })),
                      ]}
                    />
                  </div>

                  {/* Salary, Allowance, Grade */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Starting Basic Salary &mdash; {currency} *</label>
                      <input
                        type="text"
                        value={newOffer.salary}
                        onChange={(e) => setNewOffer({ ...newOffer, salary: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 outline-none focus:border-novora"
                        placeholder="e.g. 6,000"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 font-sans">Special Position Allowance ({currency})</label>
                      <input
                        type="text"
                        value={newOffer.allowance}
                        onChange={(e) => setNewOffer({ ...newOffer, allowance: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 outline-none focus:border-novora"
                        placeholder="e.g. 600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Employment Grade</label>
                      <SelectMenu
                        value={newOffer.grade}
                        onChange={(v) => setNewOffer({ ...newOffer, grade: v })}
                        triggerClassName="text-xs font-semibold bg-slate-50 border-slate-200"
                        options={[
                          { value: 'G-1 (Associate / Entry)', label: 'G-1 (Associate / Entry)' },
                          { value: 'G-2 (Senior Associate)', label: 'G-2 (Senior Associate)' },
                          { value: 'G-3 (Specialist / Lead)', label: 'G-3 (Specialist / Lead)' },
                          { value: 'G-4 (Manager / Consultant)', label: 'G-4 (Manager / Consultant)' },
                          { value: 'G-5 / Sub B', label: 'G-5 / Sub B (Senior Manager)' },
                          { value: 'G-6 / Sub A', label: 'G-6 / Sub A (Director)' },
                          { value: 'G-7 (Vice President / Executive)', label: 'G-7 (Vice President / Executive)' },
                        ]}
                      />
                    </div>
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Probation Period Duration</label>
                      <SelectMenu
                        value={newOffer.probation}
                        onChange={(v) => setNewOffer({ ...newOffer, probation: v })}
                        triggerClassName="text-xs font-semibold bg-slate-50 border-slate-200"
                        options={[
                          { value: 'No Probation', label: 'No Probation (Immediate Permanent)' },
                          { value: '1 month', label: '1 month' },
                          { value: '2 months', label: '2 months' },
                          { value: '3 months', label: '3 months' },
                          { value: '6 months', label: '6 months' },
                          { value: '9 months', label: '9 months' },
                        ]}
                      />
                    </div>
                  </div>

                  {/* Offer validity range slider visual */}
                  <div className="border-t border-slate-100 pt-5 space-y-2">
                    <div className="flex justify-between text-xs text-slate-600 font-semibold font-sans">
                      <span>Offer validity period</span>
                      <span className="text-emerald-400 font-extrabold">{newOffer.expiryDays || '14'} calendar days</span>
                    </div>
                    <input
                      type="range"
                      min="3"
                      max="30"
                      value={newOffer.expiryDays || '14'}
                      onChange={(e) => setNewOffer({ ...newOffer, expiryDays: e.target.value })}
                      className="w-full accent-novora cursor-pointer bg-slate-200 h-1.5 rounded-lg"
                    />
                  </div>

                  {/* Perks checks */}
                  <div className="border-t border-slate-100 pt-5">
                    <label className="block text-xs font-bold text-novora uppercase tracking-wider mb-3">
                      Core Benefits Included
                    </label>
                    <div className="grid grid-cols-2 gap-2.5 text-[11px] font-bold text-slate-600 select-none">
                      <label className="flex items-center gap-2 cursor-pointer bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <input type="checkbox" defaultChecked className="h-3.5 w-3.5 text-[#2f66e5]" />
                        <span>Comprehensive Medical Cover</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <input type="checkbox" defaultChecked className="h-3.5 w-3.5 text-[#2f66e5]" />
                        <span>16 Days Annual Paid Leave</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <input type="checkbox" defaultChecked className="h-3.5 w-3.5 text-[#2f66e5]" />
                        <span>CPF / SDL Employer Caps</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <input type="checkbox" className="h-3.5 w-3.5 text-[#2f66e5]" />
                        <span>Executive Relocation Package</span>
                      </label>
                    </div>
                  </div>

                </div>

                {/* Right side: Beautiful Document Preview Box (6 Columns) */}
                <div className="lg:col-span-6 bg-white text-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-200 text-xs flex flex-col justify-between font-serif relative">
                  
                  {/* Subtle watermark overlay */}
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-slate-800 font-extrabold text-[44px] tracking-[4px] rotate-12 uppercase opacity-45 pointer-events-none select-none font-sans">
                    Novora HRMS Private Limited
                  </span>

                  {/* Contract Header */}
                  <div className="border-b-2 border-slate-200 pb-3 mb-4 select-none">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-extrabold text-xs uppercase tracking-widest font-sans">NOVORA HRMS PTE LTD</span>
                        <p className="text-[9px] font-sans font-semibold text-slate-500 mt-0.5">Level 25, Marina Bay Financial Centre, Singapore</p>
                      </div>
                      <span className="border border-slate-200 font-mono text-[9px] px-2 py-0.5 font-bold rounded">
                        CONFIDENTIAL // RECORD
                      </span>
                    </div>
                    <div className="text-[9px] font-sans font-semibold text-slate-500 mt-2 text-right">
                      Date: {new Date().toLocaleDateString('en-MY', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                  </div>

                  {/* Content body */}
                  <div className="space-y-4 leading-relaxed relative z-10 text-slate-600">
                    <h3 className="text-center font-extrabold text-sm uppercase font-sans tracking-wide text-slate-900 border-b border-dashed border-slate-200 pb-1 max-w-xs mx-auto mb-2">
                      Letter of Employment Offer
                    </h3>

                    <p className="font-sans font-bold text-slate-900">
                      Dear <span className="bg-yellow-50 px-1 py-0.5 rounded border border-yellow-200">{newOffer.candidateName || "[Select Approved Candidate]"}</span>,
                    </p>

                    <p>
                      On behalf of Novora HRMS Pte Ltd, we are extremely pleased to offer you the position of <span className="font-bold underline text-slate-900">{newOffer.position || "[Target Role]"}</span>. This employment will start on standard company orientation schemes at Singapore standard timezones.
                    </p>

                    <p>
                      The specific legal terms of your employment offer packages are as follows:
                    </p>

                    <ul className="list-disc pl-5 font-sans text-[10px] space-y-1 text-slate-800 font-semibold bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <li><strong>Basic Salary:</strong> {parseSalary(newOffer.salary) ? `${currency} ${parseSalary(newOffer.salary)!.toLocaleString()}/month` : '—'}</li>
                      <li><strong>Allowances:</strong> {parseSalary(newOffer.allowance) ? `${currency} ${parseSalary(newOffer.allowance)!.toLocaleString()}/month` : '—'}</li>
                      <li><strong>Internal Grade:</strong> {newOffer.grade || '—'}</li>
                      <li><strong>Probation Range:</strong> {newOffer.probation || '—'}</li>
                      <li><strong>Expiry Period:</strong> This package must be signed within {newOffer.expiryDays || "14"} calendar days.</li>
                    </ul>

                    <p className="text-[9.5px]">
                      To accept this offer, please sign below and return the executed documents packet. We look forward to welcome you into our community!
                    </p>
                  </div>

                  {/* Signatures */}
                  <div className="border-t border-slate-200 pt-4 mt-4 flex justify-between items-end font-sans select-none text-[9.5px] font-semibold">
                    <div>
                      <div className="h-6 border-b border-dashed border-slate-300 w-28" />
                      <span className="text-slate-500 block text-[8px] tracking-wide uppercase pt-1 font-bold">Authorised Signatory &bull; Human Resources</span>
                    </div>
                    <div className="text-right">
                      <div className="h-6 border-b border-dashed border-slate-300 w-28 ml-auto" />
                      <span className="text-slate-500 block text-[8px] tracking-wide uppercase pt-1 font-bold">Candidate Signature &bull; Accept</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Form submit actions */}
              <div className="sticky bottom-0 z-10 -mx-5 sm:-mx-6 px-5 sm:px-6 py-3.5 mt-4 border-t border-slate-100 bg-white/95 backdrop-blur-xs flex items-center justify-between gap-3">
                <span className="text-[11px] font-bold text-slate-500 italic">
                  * Offers will be dispatched via secure DocuSign envelope to the candidate
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setOfferModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-all border border-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-novora hover:bg-opacity-95 text-white cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Approve &amp; Dispatch Package</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

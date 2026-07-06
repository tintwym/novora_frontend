import { apiRequest } from './client'
import { Endpoints } from './endpoints'
import type {
  AttendanceSlice,
  DashboardData,
  DashboardStatItem,
  GrowthPoint,
  LeaveRequest,
  PayrollTotals,
  RecentHire,
  StatIcon,
} from '../types/dashboard'

const COLORS = {
  primary: '#1e40af',
  purple: '#0d9488',
  accent: '#2563eb',
  success: '#059669',
  warning: '#d97706',
  danger: '#ef4444',
  purple3: '#818cf8',
  purple4: '#a5b4fc',
  muted: '#cbd5e1',
}

const HIRE_PALETTE = [COLORS.primary, COLORS.purple, COLORS.success, COLORS.warning, COLORS.danger]

const DEFAULT_GROWTH: GrowthPoint[] = [
  { x: 0, y: 680 },
  { x: 1, y: 720 },
  { x: 2, y: 760 },
  { x: 3, y: 810 },
  { x: 4, y: 870 },
  { x: 5, y: 910 },
  { x: 6, y: 950 },
  { x: 7, y: 1010 },
  { x: 8, y: 1080 },
  { x: 9, y: 1140 },
  { x: 10, y: 1190 },
  { x: 11, y: 1248 },
]

const DEFAULT_LABELS = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May']

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) {
    const s = parts[0]
    return s.length >= 2 ? s.slice(0, 2).toUpperCase() : s.toUpperCase()
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

function asString(v: unknown, fallback = ''): string {
  if (v == null) return fallback
  return String(v)
}

function iconFromHint(icon: string, label: string): StatIcon {
  const hint = `${icon} ${label}`.toLowerCase()
  if (hint.includes('group') || hint.includes('employee')) return 'groups'
  if (hint.includes('hire') || hint.includes('person')) return 'personAdd'
  if (hint.includes('leave') || hint.includes('beach')) return 'leave'
  if (hint.includes('attend') || hint.includes('check')) return 'check'
  if (hint.includes('position') || hint.includes('work') || hint.includes('brief')) return 'briefcase'
  if (hint.includes('turn') || hint.includes('sync')) return 'sync'
  if (hint.includes('balance') || hint.includes('event')) return 'event'
  if (hint.includes('train') || hint.includes('streak')) return 'trend'
  if (hint.includes('expense') || hint.includes('pay')) return 'payments'
  if (hint.includes('task')) return 'task'
  return 'groups'
}

function parseKpis(summary: unknown): DashboardStatItem[] | null {
  if (!summary || typeof summary !== 'object') return null
  const raw = (summary as Record<string, unknown>).kpis
  if (!Array.isArray(raw)) return null
  const out: DashboardStatItem[] = []
  for (const e of raw) {
    if (!e || typeof e !== 'object') continue
    const row = e as Record<string, unknown>
    const label = asString(row.label)
    const value = asString(row.value)
    const delta = asString(row.delta)
    const accent = asString(row.accent, '#1e40af')
    out.push({
      label,
      value,
      change: delta,
      isPositive: !delta.trim().startsWith('-'),
      showTrend: delta.length > 0,
      icon: iconFromHint(asString(row.icon), label),
      color: accent,
    })
  }
  return out.length ? out : null
}

function parseHires(data: unknown): RecentHire[] | null {
  if (!Array.isArray(data)) return null
  const out: RecentHire[] = []
  data.forEach((e, i) => {
    if (!e || typeof e !== 'object') return
    const row = e as Record<string, unknown>
    const name = asString(row.name)
    out.push({
      name,
      role: asString(row.role),
      date: asString(row.date),
      initials: initials(name),
      color: HIRE_PALETTE[i % HIRE_PALETTE.length],
    })
  })
  return out.length ? out : null
}

function parseLeaves(data: unknown): LeaveRequest[] | null {
  if (!Array.isArray(data)) return null
  const out: LeaveRequest[] = []
  data.forEach((e, i) => {
    if (!e || typeof e !== 'object') return
    const row = e as Record<string, unknown>
    const name = asString(row.name)
    const status = asString(row.status)
    out.push({
      name,
      type: asString(row.leaveType),
      dates: asString(row.dateRange),
      status: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(),
      initials: initials(name),
      color: HIRE_PALETTE[i % HIRE_PALETTE.length],
    })
  })
  return out.length ? out : null
}

function payrollPercents(net: number, deductions: number, taxes: number) {
  const total = net + deductions + taxes
  if (total <= 0) return { net: 0, deductions: 0, taxes: 0 }
  return {
    net: Math.round((net / total) * 100),
    deductions: Math.round((deductions / total) * 100),
    taxes: Math.round((taxes / total) * 100),
  }
}

function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

function parsePayroll(data: unknown): PayrollTotals | null {
  if (!Array.isArray(data)) return null
  let basic = 0
  let allowances = 0
  let deductions = 0
  let overtime = 0
  for (const e of data) {
    if (!e || typeof e !== 'object') continue
    const row = e as Record<string, unknown>
    const n = asString(row.name).toLowerCase()
    const v = typeof row.value === 'number' ? row.value : 0
    if (n.includes('basic') || n.includes('salary')) basic += v
    else if (n.includes('allow')) allowances += v
    else if (n.includes('deduct')) deductions += v
    else if (n.includes('overtime') || n.includes('ot')) overtime += v
  }
  const gross = basic + allowances + overtime
  const total = gross + deductions
  const net = gross
  const taxes = total > 0 && gross > 0 ? Math.min(Math.round(gross * 0.12), total - deductions) : 0
  const pct = payrollPercents(net, deductions, taxes)
  return {
    totalPayroll: formatUsd(total > 0 ? total : gross + taxes),
    netPay: formatUsd(net),
    deductions: formatUsd(deductions),
    taxes: formatUsd(taxes),
    periodLabel: 'May 2025 ▾',
    netPayPercent: pct.net,
    deductionsPercent: pct.deductions,
    taxesPercent: pct.taxes,
  }
}

function parseGrowth(data: unknown): GrowthPoint[] | null {
  if (!Array.isArray(data)) return null
  const out: GrowthPoint[] = []
  data.forEach((e, i) => {
    if (!e || typeof e !== 'object') return
    const row = e as Record<string, unknown>
    const y = typeof row.employees === 'number' ? row.employees : 0
    out.push({ x: i, y })
  })
  return out.length ? out : null
}

function parseGrowthLabels(data: unknown): string[] | null {
  if (!Array.isArray(data)) return null
  const out = data.map((e) => {
    if (!e || typeof e !== 'object') return ''
    return asString((e as Record<string, unknown>).month)
  })
  return out.some(Boolean) ? out : null
}

function parseAttendance(data: unknown): { slices: AttendanceSlice[]; rate: number } | null {
  if (!data || typeof data !== 'object') return null
  const row = data as Record<string, unknown>
  const rate = typeof row.attendanceRate === 'number' ? row.attendanceRate : 0
  const buckets = row.buckets
  if (!Array.isArray(buckets)) return null
  const palette: Record<string, string> = {
    present: COLORS.primary,
    absent: COLORS.muted,
    late: '#f59e0b',
    'on leave': COLORS.purple4,
  }
  const slices: AttendanceSlice[] = []
  let total = 0
  for (const b of buckets) {
    if (!b || typeof b !== 'object') continue
    const br = b as Record<string, unknown>
    const count = typeof br.count === 'number' ? br.count : 0
    total += count
  }
  for (const b of buckets) {
    if (!b || typeof b !== 'object') continue
    const br = b as Record<string, unknown>
    const label = asString(br.label)
    const count = typeof br.count === 'number' ? br.count : 0
    const pct = total > 0 ? (count / total) * 100 : 0
    const key = label.toLowerCase()
    const color =
      Object.entries(palette).find(([k]) => key.includes(k))?.[1] ?? COLORS.primary
    slices.push({
      label,
      value: pct,
      displayPercent: `${pct.toFixed(1)}%`,
      color,
    })
  }
  return slices.length ? { slices, rate } : null
}

function mockGrowthSlice(months: number): { points: GrowthPoint[]; labels: string[] } {
  const n = Math.min(Math.max(months, 1), DEFAULT_GROWTH.length)
  const start = DEFAULT_GROWTH.length - n
  const points = DEFAULT_GROWTH.slice(start).map((p, i) => ({ x: i, y: p.y }))
  const labels = DEFAULT_LABELS.slice(start)
  return { points, labels }
}

function mockStatItems(): DashboardStatItem[] {
  return [
    { label: 'Total Employees', value: '1,284', change: '+8.5%', isPositive: true, showTrend: true, icon: 'groups', color: COLORS.primary },
    { label: 'New Hires', value: '42', change: '+16.7%', isPositive: true, showTrend: true, icon: 'personAdd', color: COLORS.purple },
    { label: 'On Leave', value: '87', change: '-3.2%', isPositive: false, showTrend: true, icon: 'leave', color: COLORS.accent },
    { label: 'Attendance Rate', value: '96.8%', change: '+2.4%', isPositive: true, showTrend: true, icon: 'check', color: COLORS.success },
    { label: 'Open Positions', value: '23', change: '-8.0%', isPositive: false, showTrend: true, icon: 'briefcase', color: COLORS.warning },
    { label: 'Turnover Rate', value: '6.2%', change: '+1.1%', isPositive: true, showTrend: true, icon: 'sync', color: COLORS.purple },
  ]
}

function mockHires(): RecentHire[] {
  const rows = [
    ['Sarah Johnson', 'UI/UX Designer', 'May 28, 2026'],
    ['Michael Chen', 'Backend Developer', 'May 27, 2026'],
    ['Priya Sharma', 'HR Executive', 'May 26, 2026'],
    ['David Wilson', 'Sales Manager', 'May 24, 2026'],
    ['Emma Brown', 'Marketing Specialist', 'May 23, 2026'],
  ] as const
  return rows.map(([name, role, date], i) => ({
    name,
    role,
    date,
    initials: initials(name),
    color: HIRE_PALETTE[i % HIRE_PALETTE.length],
  }))
}

function mockLeaves(): LeaveRequest[] {
  const rows = [
    ['John Doe', 'Annual Leave', 'May 30 – Jun 03', 'Pending'],
    ['Emily Davis', 'Sick Leave', 'May 29 – May 30', 'Approved'],
    ['Robert Smith', 'Personal Leave', 'May 31 – Jun 02', 'Pending'],
    ['Lisa Wilson', 'Annual Leave', 'Jun 02 – Jun 06', 'Approved'],
    ['James Taylor', 'Sick Leave', 'May 30 – May 31', 'Rejected'],
  ] as const
  return rows.map(([name, type, dates, status], i) => ({
    name,
    type,
    dates,
    status,
    initials: initials(name),
    color: HIRE_PALETTE[i % HIRE_PALETTE.length],
  }))
}

function mockPayroll(): PayrollTotals {
  const pct = payrollPercents(896450, 195870, 156000)
  return {
    totalPayroll: '$1,248,320',
    netPay: '$896,450',
    deductions: '$195,870',
    taxes: '$156,000',
    periodLabel: 'May 2025 ▾',
    netPayPercent: pct.net || 71,
    deductionsPercent: pct.deductions || 16,
    taxesPercent: pct.taxes || 12,
  }
}

function mockAttendance(): AttendanceSlice[] {
  return [
    { label: 'Present', value: 89.4, displayPercent: '89.4%', color: COLORS.primary },
    { label: 'Absent', value: 2.3, displayPercent: '2.3%', color: COLORS.muted },
    { label: 'Late', value: 1.0, displayPercent: '1.0%', color: '#f59e0b' },
    { label: 'On Leave', value: 7.3, displayPercent: '7.3%', color: COLORS.purple4 },
  ]
}

function buildDashboard(partial: Partial<DashboardData> & { employeeView: boolean }): DashboardData {
  const months = partial.growthMonths ?? 12
  const growth = mockGrowthSlice(months)
  return {
    employeeView: partial.employeeView,
    statItems: partial.statItems ?? mockStatItems(),
    recentHires: partial.recentHires ?? (partial.employeeView ? [] : mockHires()),
    leaveRequests: partial.leaveRequests ?? (partial.employeeView ? [] : mockLeaves()),
    payroll: partial.payroll ?? mockPayroll(),
    attendanceSlices: partial.attendanceSlices ?? mockAttendance(),
    attendanceRatePercent: partial.attendanceRatePercent ?? 89.4,
    growthPoints: partial.growthPoints ?? growth.points,
    monthLabels: partial.monthLabels ?? growth.labels,
    growthMonths: months,
  }
}

async function getJson<T>(path: string): Promise<T | null> {
  try {
    return await apiRequest<T>(path)
  } catch {
    return null
  }
}

export async function fetchAdminDashboard(growthMonths = 12): Promise<DashboardData> {
  const [summary, growth, hires, leaves, payroll, att] = await Promise.all([
    getJson<unknown>(Endpoints.dashboardSummary),
    getJson<unknown>(`${Endpoints.dashboardGrowth}?months=${growthMonths}`),
    getJson<unknown>(Endpoints.dashboardRecentHires),
    getJson<unknown>(Endpoints.dashboardLeaveRequests),
    getJson<unknown>(Endpoints.dashboardPayrollSummary),
    getJson<unknown>(Endpoints.dashboardAttendanceOverview),
  ])

  const attParsed = parseAttendance(att)
  const growthSlice = mockGrowthSlice(growthMonths)

  return buildDashboard({
    employeeView: false,
    statItems: parseKpis(summary) ?? undefined,
    recentHires: parseHires(hires) ?? undefined,
    leaveRequests: parseLeaves(leaves) ?? undefined,
    payroll: parsePayroll(payroll) ?? undefined,
    attendanceSlices: attParsed?.slices,
    attendanceRatePercent: attParsed?.rate,
    growthPoints: parseGrowth(growth) ?? growthSlice.points,
    monthLabels: parseGrowthLabels(growth) ?? growthSlice.labels,
    growthMonths,
  })
}

export async function fetchEmployeeDashboard(growthMonths = 12): Promise<DashboardData> {
  const data = await getJson<Record<string, unknown>>(Endpoints.myDashboard)
  if (!data) {
    return buildDashboard({ employeeView: true, growthMonths })
  }

  const attParsed = parseAttendance(data.attendanceOverview)
  const growthSlice = mockGrowthSlice(growthMonths)

  return buildDashboard({
    employeeView: true,
    statItems: parseKpis({ kpis: data.kpis }) ?? undefined,
    leaveRequests: parseLeaves(data.leaveRequests) ?? [],
    payroll: parsePayroll(data.payrollSummary) ?? undefined,
    attendanceSlices: attParsed?.slices,
    attendanceRatePercent: attParsed?.rate,
    growthPoints: parseGrowth(data.growth) ?? growthSlice.points,
    monthLabels: parseGrowthLabels(data.growth) ?? growthSlice.labels,
    growthMonths,
  })
}

export async function fetchGrowthOnly(
  employeeView: boolean,
  growthMonths: number,
): Promise<{ growthPoints: GrowthPoint[]; monthLabels: string[] }> {
  if (employeeView) {
    const data = await fetchEmployeeDashboard(growthMonths)
    return { growthPoints: data.growthPoints, monthLabels: data.monthLabels }
  }
  const growth = await getJson<unknown>(`${Endpoints.dashboardGrowth}?months=${growthMonths}`)
  const slice = mockGrowthSlice(growthMonths)
  return {
    growthPoints: parseGrowth(growth) ?? slice.points,
    monthLabels: parseGrowthLabels(growth) ?? slice.labels,
  }
}

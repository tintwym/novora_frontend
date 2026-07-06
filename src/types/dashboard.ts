export type DashboardStatItem = {
  label: string
  value: string
  change: string
  isPositive: boolean
  showTrend: boolean
  icon: StatIcon
  color: string
}

export type StatIcon =
  | 'groups'
  | 'personAdd'
  | 'leave'
  | 'check'
  | 'briefcase'
  | 'sync'
  | 'event'
  | 'trend'
  | 'payments'
  | 'task'

export type RecentHire = {
  name: string
  role: string
  date: string
  initials: string
  color: string
}

export type LeaveRequest = {
  name: string
  type: string
  dates: string
  status: string
  initials: string
  color: string
}

export type AttendanceSlice = {
  label: string
  value: number
  displayPercent: string
  color: string
}

export type PayrollTotals = {
  totalPayroll: string
  netPay: string
  deductions: string
  taxes: string
  periodLabel: string
  netPayPercent: number
  deductionsPercent: number
  taxesPercent: number
}

export type GrowthPoint = {
  x: number
  y: number
}

export type GrowthPeriod = {
  months: number
  label: string
}

export const GROWTH_PERIODS: GrowthPeriod[] = [
  { months: 12, label: 'Last 12 months' },
  { months: 6, label: 'Last 6 months' },
  { months: 3, label: 'Last 3 months' },
  { months: 1, label: 'Last 30 days' },
]

export type DashboardData = {
  employeeView: boolean
  statItems: DashboardStatItem[]
  recentHires: RecentHire[]
  leaveRequests: LeaveRequest[]
  payroll: PayrollTotals
  attendanceSlices: AttendanceSlice[]
  attendanceRatePercent: number
  growthPoints: GrowthPoint[]
  monthLabels: string[]
  growthMonths: number
}

export type AttendanceLog = {
  id: string
  workDate: string
  checkInTime: string | null
  checkOutTime: string | null
  workHours: number | null
}

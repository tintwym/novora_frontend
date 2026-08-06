import { apiRequest } from './apiClient'

export type DashboardKpi = {
  label: string
  value: string
  delta: string
  icon: string
  accent: string
  series: { x: string; y: number }[]
}

export type DashboardEmployeeRow = {
  id: string
  name: string
  role: string
  date: string
  tag: string
}

export type DashboardLeaveRequestRow = {
  id: string
  name: string
  leaveType: string
  dateRange: string
  status: string
}

export type DashboardAttendanceOverview = {
  attendanceRate: number
  buckets: { label: string; count: number }[]
}

export type MyDashboardResponse = {
  kpis: DashboardKpi[]
  growth: { month: string; employees: number }[]
  departments: { name: string; count: number; percent: number }[]
  attendanceOverview: DashboardAttendanceOverview
  recentHires: DashboardEmployeeRow[]
  leaveRequests: DashboardLeaveRequestRow[]
  payrollSummary: { name: string; value: number; fill: string }[]
}

export type DashboardSummary = {
  kpis: DashboardKpi[]
}

export async function fetchMyDashboard(): Promise<MyDashboardResponse> {
  return apiRequest<MyDashboardResponse>('/api/my/dashboard', { method: 'GET', skipCsrf: true })
}

export async function fetchAdminDashboardSummary(): Promise<DashboardSummary> {
  return apiRequest<DashboardSummary>('/api/admin/dashboard/summary', {
    method: 'GET',
    skipCsrf: true,
  })
}

export async function fetchAdminRecentHires(limit = 5): Promise<DashboardEmployeeRow[]> {
  return apiRequest<DashboardEmployeeRow[]>(`/api/admin/dashboard/recent-hires?limit=${limit}`, {
    method: 'GET',
    skipCsrf: true,
  })
}

export async function fetchAdminLeaveRequests(limit = 6): Promise<DashboardLeaveRequestRow[]> {
  return apiRequest<DashboardLeaveRequestRow[]>(`/api/admin/dashboard/leave-requests?limit=${limit}`, {
    method: 'GET',
    skipCsrf: true,
  })
}

export async function fetchAdminAttendanceOverview(): Promise<DashboardAttendanceOverview> {
  return apiRequest<DashboardAttendanceOverview>('/api/admin/dashboard/attendance-overview', {
    method: 'GET',
    skipCsrf: true,
  })
}

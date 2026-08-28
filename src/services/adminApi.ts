import { apiRequest } from './apiClient'

export type DepartmentRow = {
  id: string
  name: string
  code: string
  description: string | null
  active: boolean
}

export type AdminUserRow = {
  userId: string
  email: string
  roles: string[]
  active: boolean
}

export type OrgChartNode = {
  employeeId: string
  name: string
  jobTitle: string | null
  departmentName: string | null
  managerEmployeeId: string | null
}

export type OrgChartResponse = {
  nodes: OrgChartNode[]
}

export type PayrollSlice = {
  name: string
  value: number
  fill: string
}

export type LeaveOverviewRow = {
  label: string
  used: number
  total: number
  color: string
}

export async function fetchDepartments(): Promise<DepartmentRow[]> {
  return apiRequest<DepartmentRow[]>('/api/admin/departments', { method: 'GET', skipCsrf: true })
}

export async function createDepartment(payload: {
  name: string
  code: string
  description?: string
}): Promise<DepartmentRow> {
  return apiRequest<DepartmentRow>('/api/admin/departments', {
    method: 'POST',
    body: payload,
  })
}

export async function fetchAdminUsers(): Promise<AdminUserRow[]> {
  return apiRequest<AdminUserRow[]>('/api/admin/users', { method: 'GET', skipCsrf: true })
}

export async function fetchAdminRoles(): Promise<string[]> {
  return apiRequest<string[]>('/api/admin/roles', { method: 'GET', skipCsrf: true })
}

export async function updateUserRoles(userId: string, roles: string[]): Promise<AdminUserRow> {
  return apiRequest<AdminUserRow>(`/api/admin/users/${userId}/roles`, {
    method: 'PUT',
    body: { roles },
  })
}

export async function fetchOrgChart(): Promise<OrgChartResponse> {
  return apiRequest<OrgChartResponse>('/api/org-chart', { method: 'GET', skipCsrf: true })
}

export async function fetchAdminPayrollSummary(): Promise<PayrollSlice[]> {
  return apiRequest<PayrollSlice[]>('/api/admin/dashboard/payroll-summary', {
    method: 'GET',
    skipCsrf: true,
  })
}

export async function fetchAdminLeaveOverview(): Promise<LeaveOverviewRow[]> {
  return apiRequest<LeaveOverviewRow[]>('/api/admin/dashboard/leave-overview', {
    method: 'GET',
    skipCsrf: true,
  })
}

export async function fetchAdminEmployeeAttendance(employeeId: string) {
  return apiRequest(`/api/admin/employees/${employeeId}/attendance`, {
    method: 'GET',
    skipCsrf: true,
  })
}

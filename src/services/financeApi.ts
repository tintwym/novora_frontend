import { apiRequest } from './apiClient'

export type ClaimRow = {
  id: string
  employeeId: string
  employeeName: string
  departmentName: string | null
  category: string
  claimDate: string
  amount: number
  currency: string
  vendor: string | null
  description: string | null
  status: string
  decisionNote: string | null
  decidedBy: string | null
  decidedAt: string | null
  createdAt: string
}

export type CreateClaimPayload = {
  category: string
  claimDate: string
  amount: number
  currency?: string
  vendor?: string
  description?: string
}

export type PayrollRow = {
  id: string
  employeeId: string
  employeeName: string
  employeeCode: string
  payMonth: number
  payYear: number
  basicSalary: number
  allowances: number
  overtimePay: number
  bonus: number
  deductions: number
  tax: number
  netPay: number
  status: string
  processedAt: string | null
  paidAt: string | null
}

export type PayrollRunSummary = {
  payMonth: number
  payYear: number
  headcount: number
  totalNetPay: number
  draftCount: number
  processedCount: number
  paidCount: number
}

export async function fetchMyClaims(): Promise<ClaimRow[]> {
  return apiRequest<ClaimRow[]>('/api/my/claims', { method: 'GET', skipCsrf: true })
}

export async function createMyClaim(payload: CreateClaimPayload): Promise<ClaimRow> {
  return apiRequest<ClaimRow>('/api/my/claims', { method: 'POST', body: payload })
}

export async function fetchAdminClaims(status?: 'pending'): Promise<ClaimRow[]> {
  const q = status ? `?status=${status}` : ''
  return apiRequest<ClaimRow[]>(`/api/admin/claims${q}`, { method: 'GET', skipCsrf: true })
}

export async function decideClaim(
  claimId: string,
  payload: { decision: 'APPROVE' | 'REJECT'; note?: string },
): Promise<ClaimRow> {
  return apiRequest<ClaimRow>(`/api/admin/claims/${claimId}/decide`, {
    method: 'POST',
    body: payload,
  })
}

export async function fetchAdminPayroll(year?: number, month?: number): Promise<PayrollRow[]> {
  const params = new URLSearchParams()
  if (year != null) params.set('year', String(year))
  if (month != null) params.set('month', String(month))
  const q = params.toString() ? `?${params}` : ''
  return apiRequest<PayrollRow[]>(`/api/admin/payroll${q}`, { method: 'GET', skipCsrf: true })
}

export async function fetchPayrollRunSummary(
  year?: number,
  month?: number,
): Promise<PayrollRunSummary> {
  const params = new URLSearchParams()
  if (year != null) params.set('year', String(year))
  if (month != null) params.set('month', String(month))
  const q = params.toString() ? `?${params}` : ''
  return apiRequest<PayrollRunSummary>(`/api/admin/payroll/summary${q}`, {
    method: 'GET',
    skipCsrf: true,
  })
}

export async function generateAdminPayroll(payMonth: number, payYear: number): Promise<PayrollRow[]> {
  return apiRequest<PayrollRow[]>('/api/admin/payroll/generate', {
    method: 'POST',
    body: { payMonth, payYear },
  })
}

export async function processAdminPayrollMonth(year: number, month: number): Promise<PayrollRunSummary> {
  return apiRequest<PayrollRunSummary>(`/api/admin/payroll/process?year=${year}&month=${month}`, {
    method: 'POST',
  })
}

export async function fetchMyPayslips(): Promise<PayrollRow[]> {
  return apiRequest<PayrollRow[]>('/api/my/payslips', { method: 'GET', skipCsrf: true })
}

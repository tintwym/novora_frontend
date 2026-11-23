import { apiRequest } from './apiClient'

export type ApprovalTask = {
  id: string
  kind: 'LEAVE' | 'CLAIM' | 'OVERTIME' | string
  entityId: string
  status: string
  requestedByEmployeeId: string
  requestedByName: string
  title: string | null
  detail: string | null
  amount: number | null
  currency: string | null
  createdAt: string | null
}

export type ApprovalsResponse = {
  tasks: ApprovalTask[]
  totalPending: number
}

export async function fetchPendingApprovals(): Promise<ApprovalsResponse> {
  return apiRequest<ApprovalsResponse>('/api/admin/approvals', { method: 'GET', skipCsrf: true })
}

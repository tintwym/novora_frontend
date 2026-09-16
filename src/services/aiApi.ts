import { apiRequest } from './apiClient'

export type AiKpiHint = {
  label: string
  value: string
  delta?: string
}

export type DashboardInsightRequest = {
  kpis?: AiKpiHint[]
  attendanceRate?: number | null
  openRoles?: number | null
  pendingLeave?: number | null
  upcomingInterviews?: number | null
  onboardingIncomplete?: number | null
}

export type DashboardInsightResponse = {
  insights: string[]
  source: string
  disclaimer: string
}

export type HelpdeskDraftRequest = {
  subject: string
  description?: string
  category?: string
  priority?: string
  requesterName?: string
  recentReplies?: string[]
}

export type HelpdeskDraftResponse = {
  draft: string
  source: string
  disclaimer: string
}

export async function fetchDashboardAiInsights(
  payload: DashboardInsightRequest,
): Promise<DashboardInsightResponse> {
  return apiRequest<DashboardInsightResponse>('/api/admin/ai/dashboard-insights', {
    method: 'POST',
    body: payload,
  })
}

export async function fetchHelpdeskAiDraft(
  payload: HelpdeskDraftRequest,
): Promise<HelpdeskDraftResponse> {
  return apiRequest<HelpdeskDraftResponse>('/api/admin/ai/helpdesk-draft', {
    method: 'POST',
    body: payload,
  })
}

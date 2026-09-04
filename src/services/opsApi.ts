import { apiRequest } from './apiClient'

export type NotificationRow = {
  id: string
  title: string
  message: string
  type: string | null
  read: boolean
  readAt: string | null
  createdAt: string | null
}

export type HelpdeskTicketRow = {
  id: string
  subject: string
  description: string | null
  category: string | null
  priority: string | null
  status: string
  requesterEmployeeId: string | null
  requesterName: string | null
  assigneeEmployeeId: string | null
  assigneeName: string | null
  createdAt: string | null
  updatedAt: string | null
  replies: {
    id: string
    authorEmployeeId: string | null
    authorName: string | null
    body: string
    createdAt: string | null
  }[]
}

export type DisciplinaryCaseRow = {
  id: string
  employeeId: string
  employeeName: string
  reason: string
  actionType: string | null
  severity: string | null
  status: string
  notes: string | null
  incidentDate: string | null
  createdAt: string | null
}

export type BenefitPlanRow = {
  id: string
  name: string
  category: string | null
  provider: string | null
  coverageSummary: string | null
  employeeCost: number | null
  employerCost: number | null
  status: string
  createdAt: string | null
}

export type BenefitEnrollmentRow = {
  id: string
  planId: string
  planName: string
  employeeId: string
  employeeName: string
  status: string
  enrolledAt: string | null
  notes: string | null
}

export type OnboardingTaskRow = {
  id: string
  employeeId: string
  employeeName: string
  title: string
  description: string | null
  dueDate: string | null
  status: string
  sortOrder: number
  completedAt: string | null
  createdAt: string | null
}

export type TrainingEnrollmentRow = {
  id: string
  trainingId: string
  trainingTitle: string
  employeeId: string
  employeeName: string
  status: string
  enrolledAt: string | null
  completedAt: string | null
  score: number | null
}

export async function fetchMyNotifications(): Promise<NotificationRow[]> {
  return apiRequest<NotificationRow[]>('/api/my/notifications', { method: 'GET', skipCsrf: true })
}

export async function markNotificationRead(id: string): Promise<NotificationRow> {
  return apiRequest<NotificationRow>(`/api/my/notifications/${id}/read`, { method: 'POST' })
}

export async function fetchAdminHelpdeskTickets(): Promise<HelpdeskTicketRow[]> {
  return apiRequest<HelpdeskTicketRow[]>('/api/admin/helpdesk/tickets', {
    method: 'GET',
    skipCsrf: true,
  })
}

export async function fetchMyHelpdeskTickets(): Promise<HelpdeskTicketRow[]> {
  return apiRequest<HelpdeskTicketRow[]>('/api/my/helpdesk/tickets', {
    method: 'GET',
    skipCsrf: true,
  })
}

export async function createHelpdeskTicket(payload: {
  subject: string
  description?: string
  category?: string
  priority?: string
  requesterEmployeeId?: string
  assigneeEmployeeId?: string
  status?: string
}): Promise<HelpdeskTicketRow> {
  return apiRequest<HelpdeskTicketRow>('/api/admin/helpdesk/tickets', {
    method: 'POST',
    body: payload,
  })
}

export async function createMyHelpdeskTicket(payload: {
  subject: string
  description?: string
  category?: string
  priority?: string
}): Promise<HelpdeskTicketRow> {
  return apiRequest<HelpdeskTicketRow>('/api/my/helpdesk/tickets', {
    method: 'POST',
    body: payload,
  })
}

export async function replyHelpdeskTicket(
  ticketId: string,
  body: string,
): Promise<HelpdeskTicketRow> {
  return apiRequest<HelpdeskTicketRow>(`/api/admin/helpdesk/tickets/${ticketId}/replies`, {
    method: 'POST',
    body: { body },
  })
}

export async function fetchDisciplinaryCases(): Promise<DisciplinaryCaseRow[]> {
  return apiRequest<DisciplinaryCaseRow[]>('/api/admin/disciplinary/cases', {
    method: 'GET',
    skipCsrf: true,
  })
}

export async function createDisciplinaryCase(payload: {
  employeeId: string
  reason: string
  actionType?: string
  severity?: string
  status?: string
  notes?: string
  incidentDate?: string
}): Promise<DisciplinaryCaseRow> {
  return apiRequest<DisciplinaryCaseRow>('/api/admin/disciplinary/cases', {
    method: 'POST',
    body: payload,
  })
}

export async function fetchBenefitPlans(): Promise<BenefitPlanRow[]> {
  return apiRequest<BenefitPlanRow[]>('/api/admin/benefit-plans', { method: 'GET', skipCsrf: true })
}

export async function createBenefitPlan(payload: {
  name: string
  category?: string
  provider?: string
  coverageSummary?: string
  employeeCost?: number
  employerCost?: number
  status?: string
}): Promise<BenefitPlanRow> {
  return apiRequest<BenefitPlanRow>('/api/admin/benefit-plans', { method: 'POST', body: payload })
}

export async function fetchBenefitEnrollments(): Promise<BenefitEnrollmentRow[]> {
  return apiRequest<BenefitEnrollmentRow[]>('/api/admin/benefit-enrollments', {
    method: 'GET',
    skipCsrf: true,
  })
}

export async function createBenefitEnrollment(payload: {
  planId: string
  employeeId: string
  status?: string
  notes?: string
}): Promise<BenefitEnrollmentRow> {
  return apiRequest<BenefitEnrollmentRow>('/api/admin/benefit-enrollments', {
    method: 'POST',
    body: payload,
  })
}

export async function fetchMyBenefitEnrollments(): Promise<BenefitEnrollmentRow[]> {
  return apiRequest<BenefitEnrollmentRow[]>('/api/my/benefit-enrollments', {
    method: 'GET',
    skipCsrf: true,
  })
}

export async function fetchAdminOnboardingTasks(): Promise<OnboardingTaskRow[]> {
  return apiRequest<OnboardingTaskRow[]>('/api/admin/onboarding/tasks', {
    method: 'GET',
    skipCsrf: true,
  })
}

export async function createOnboardingTask(payload: {
  employeeId: string
  title: string
  description?: string
  dueDate?: string
  sortOrder?: number
}): Promise<OnboardingTaskRow> {
  return apiRequest<OnboardingTaskRow>('/api/admin/onboarding/tasks', {
    method: 'POST',
    body: payload,
  })
}

export async function fetchTrainingEnrollments(
  trainingId: string,
): Promise<TrainingEnrollmentRow[]> {
  return apiRequest<TrainingEnrollmentRow[]>(`/api/admin/trainings/${trainingId}/enrollments`, {
    method: 'GET',
    skipCsrf: true,
  })
}

export async function enrollInTraining(
  trainingId: string,
  employeeId: string,
): Promise<TrainingEnrollmentRow> {
  return apiRequest<TrainingEnrollmentRow>(`/api/admin/trainings/${trainingId}/enrollments`, {
    method: 'POST',
    body: { employeeId },
  })
}

export async function completeTrainingEnrollment(
  trainingId: string,
  enrollmentId: string,
  payload?: { score?: number; feedback?: string },
): Promise<TrainingEnrollmentRow> {
  return apiRequest<TrainingEnrollmentRow>(
    `/api/admin/trainings/${trainingId}/enrollments/${enrollmentId}/complete`,
    { method: 'POST', body: payload || {} },
  )
}

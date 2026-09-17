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

export type RecruitmentJdDraftRequest = {
  title: string
  department?: string
  employmentType?: string
  location?: string
  experience?: string
  education?: string
  skills?: string
  existingResponsibilities?: string
  niceToHave?: string
  salaryMin?: string
  salaryMax?: string
}

export type RecruitmentJdDraftResponse = {
  draft: string
  source: string
  disclaimer: string
}

export type CandidateSummaryRequest = {
  fullName: string
  jobTitle?: string
  stage?: string
  source?: string
  notes?: string
  rating?: string
  email?: string
  phone?: string
}

export type CandidateSummaryResponse = {
  summary: string
  strengths: string[]
  risks: string[]
  interviewQuestions: string[]
  source: string
  disclaimer: string
}

export type PerformanceReviewDraftRequest = {
  employeeName: string
  reviewType?: string
  reviewPeriod?: string
  reviewDate?: string
  codeQuality?: string
  problemSolving?: string
  systemDesign?: string
  sprintsCompleted?: string
  bugsSla?: string
  attendance?: string
  existingNote?: string
}

export type PerformanceReviewDraftResponse = {
  draft: string
  source: string
  disclaimer: string
}

export type CourseRecommendationRequest = {
  department?: string
  roleOrFocus?: string
  skillsGap?: string
  catalogTitles?: string[]
  categories?: string[]
}

export type CourseRecommendationResponse = {
  recommendations: string[]
  rationale: string
  source: string
  disclaimer: string
}

export type EngagementThemeRequest = {
  comments: Array<{
    category?: string
    text: string
    vibe?: string
  }>
}

export type EngagementThemeResponse = {
  themes: string[]
  summary: string
  suggestedActions: string[]
  source: string
  disclaimer: string
}

export type DisciplinaryLetterRequest = {
  employeeName: string
  department?: string
  reason?: string
  warningLevel?: string
  incidentDate?: string
  location?: string
  description?: string
  existingExpectation?: string
  issuedBy?: string
}

export type DisciplinaryLetterResponse = {
  letter: string
  chronology: string
  source: string
  disclaimer: string
}

export type PayrollAnomalyRequest = {
  payMonth?: number | null
  payYear?: number | null
  headcount?: number | null
  totalNetPay?: string | null
  draftCount?: number | null
  processedCount?: number | null
  paidCount?: number | null
  rowCount?: number | null
  sampleRows?: string[]
}

export type PayrollAnomalyResponse = {
  findings: string[]
  summary: string
  source: string
  disclaimer: string
}

export type BenefitsTipRequest = {
  employeeName: string
  department?: string
  availablePlans?: string[]
  enrolledPlans?: string[]
}

export type BenefitsTipResponse = {
  tip: string
  suggestions: string[]
  source: string
  disclaimer: string
}

export type AssetsInsightRequest = {
  totalAssets?: number | null
  availableCount?: number | null
  inUseCount?: number | null
  maintenanceCount?: number | null
  flaggedItems?: string[]
}

export type AssetsInsightResponse = {
  insights: string[]
  summary: string
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

export async function fetchRecruitmentJdDraft(
  payload: RecruitmentJdDraftRequest,
): Promise<RecruitmentJdDraftResponse> {
  return apiRequest<RecruitmentJdDraftResponse>('/api/admin/ai/recruitment-jd-draft', {
    method: 'POST',
    body: payload,
  })
}

export async function fetchCandidateAiSummary(
  payload: CandidateSummaryRequest,
): Promise<CandidateSummaryResponse> {
  return apiRequest<CandidateSummaryResponse>('/api/admin/ai/candidate-summary', {
    method: 'POST',
    body: payload,
  })
}

export async function fetchPerformanceReviewAiDraft(
  payload: PerformanceReviewDraftRequest,
): Promise<PerformanceReviewDraftResponse> {
  return apiRequest<PerformanceReviewDraftResponse>('/api/admin/ai/performance-review-draft', {
    method: 'POST',
    body: payload,
  })
}

export async function fetchCourseAiRecommendations(
  payload: CourseRecommendationRequest,
): Promise<CourseRecommendationResponse> {
  return apiRequest<CourseRecommendationResponse>('/api/admin/ai/course-recommendations', {
    method: 'POST',
    body: payload,
  })
}

export async function fetchEngagementAiThemes(
  payload: EngagementThemeRequest,
): Promise<EngagementThemeResponse> {
  return apiRequest<EngagementThemeResponse>('/api/admin/ai/engagement-themes', {
    method: 'POST',
    body: payload,
  })
}

export async function fetchDisciplinaryAiLetter(
  payload: DisciplinaryLetterRequest,
): Promise<DisciplinaryLetterResponse> {
  return apiRequest<DisciplinaryLetterResponse>('/api/admin/ai/disciplinary-letter', {
    method: 'POST',
    body: payload,
  })
}

export async function fetchPayrollAiAnomalies(
  payload: PayrollAnomalyRequest,
): Promise<PayrollAnomalyResponse> {
  return apiRequest<PayrollAnomalyResponse>('/api/admin/ai/payroll-anomalies', {
    method: 'POST',
    body: payload,
  })
}

export async function fetchBenefitsAiTip(
  payload: BenefitsTipRequest,
): Promise<BenefitsTipResponse> {
  return apiRequest<BenefitsTipResponse>('/api/admin/ai/benefits-tip', {
    method: 'POST',
    body: payload,
  })
}

export async function fetchAssetsAiInsights(
  payload: AssetsInsightRequest,
): Promise<AssetsInsightResponse> {
  return apiRequest<AssetsInsightResponse>('/api/admin/ai/assets-insights', {
    method: 'POST',
    body: payload,
  })
}

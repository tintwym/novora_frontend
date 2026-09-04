import { apiRequest } from './apiClient'

export type RecruitmentJobRow = {
  id: string
  title: string
  departmentName: string | null
  location: string | null
  employmentType: string | null
  salaryMin: number | null
  salaryMax: number | null
  openDate: string | null
  closeDate: string | null
  openings: number | null
  published: boolean
  status: string
  applicantCount: number
  createdAt: string | null
}

export type CreateRecruitmentJobPayload = {
  title: string
  departmentName?: string
  location?: string
  employmentType?: string
  salaryMin?: number
  salaryMax?: number
  openDate?: string
  closeDate?: string
  openings?: number
  description?: string
  publish?: boolean
}

export type RecruitmentCandidateRow = {
  id: string
  jobPostingId: string
  jobTitle: string | null
  fullName: string
  email: string
  phone: string | null
  source: string | null
  stage: string
  status: string
  rating: number | null
  notes: string | null
  appliedAt: string | null
}

export type CreateRecruitmentCandidatePayload = {
  jobPostingId: string
  fullName: string
  email: string
  phone?: string
  source?: string
  notes?: string
}

export async function fetchRecruitmentJobs(): Promise<RecruitmentJobRow[]> {
  return apiRequest<RecruitmentJobRow[]>('/api/admin/recruitment/jobs', {
    method: 'GET',
    skipCsrf: true,
  })
}

export async function createRecruitmentJob(
  payload: CreateRecruitmentJobPayload,
): Promise<RecruitmentJobRow> {
  return apiRequest<RecruitmentJobRow>('/api/admin/recruitment/jobs', {
    method: 'POST',
    body: payload,
  })
}

export async function updateRecruitmentJobStatus(
  jobId: string,
  status: string,
): Promise<RecruitmentJobRow> {
  return apiRequest<RecruitmentJobRow>(`/api/admin/recruitment/jobs/${jobId}/status`, {
    method: 'POST',
    body: { status },
  })
}

export async function fetchRecruitmentCandidates(
  jobId?: string,
): Promise<RecruitmentCandidateRow[]> {
  const q = jobId ? `?jobId=${encodeURIComponent(jobId)}` : ''
  return apiRequest<RecruitmentCandidateRow[]>(`/api/admin/recruitment/candidates${q}`, {
    method: 'GET',
    skipCsrf: true,
  })
}

export async function createRecruitmentCandidate(
  payload: CreateRecruitmentCandidatePayload,
): Promise<RecruitmentCandidateRow> {
  return apiRequest<RecruitmentCandidateRow>('/api/admin/recruitment/candidates', {
    method: 'POST',
    body: payload,
  })
}

export async function updateRecruitmentCandidateStage(
  candidateId: string,
  stage: string,
  status?: string,
): Promise<RecruitmentCandidateRow> {
  return apiRequest<RecruitmentCandidateRow>(
    `/api/admin/recruitment/candidates/${candidateId}/stage`,
    {
      method: 'POST',
      body: { stage, status },
    },
  )
}

export type RecruitmentInterviewRow = {
  id: string
  candidateId: string
  candidateName: string
  interviewerEmployeeId: string | null
  interviewerName: string | null
  scheduledAt: string
  durationMins: number | null
  mode: string | null
  location: string | null
  round: string | null
  status: string
  createdAt: string | null
}

export type RecruitmentOfferRow = {
  id: string
  candidateId: string
  candidateName: string
  salary: number | null
  currency: string | null
  allowance: number | null
  grade: string | null
  probation: string | null
  status: string
  sentAt: string | null
  expiryDate: string | null
  notes: string | null
  createdAt: string | null
}

export async function fetchRecruitmentInterviews(): Promise<RecruitmentInterviewRow[]> {
  return apiRequest<RecruitmentInterviewRow[]>('/api/admin/recruitment/interviews', {
    method: 'GET',
    skipCsrf: true,
  })
}

export async function createRecruitmentInterview(payload: {
  candidateId: string
  interviewerEmployeeId?: string
  scheduledAt: string
  durationMins?: number
  mode?: string
  location?: string
  round?: string
}): Promise<RecruitmentInterviewRow> {
  return apiRequest<RecruitmentInterviewRow>('/api/admin/recruitment/interviews', {
    method: 'POST',
    body: payload,
  })
}

export async function fetchRecruitmentOffers(): Promise<RecruitmentOfferRow[]> {
  return apiRequest<RecruitmentOfferRow[]>('/api/admin/recruitment/offers', {
    method: 'GET',
    skipCsrf: true,
  })
}

export async function createRecruitmentOffer(payload: {
  candidateId: string
  salary?: number
  allowance?: number
  grade?: string
  probation?: string
  status?: string
  expiryDate?: string
  notes?: string
}): Promise<RecruitmentOfferRow> {
  return apiRequest<RecruitmentOfferRow>('/api/admin/recruitment/offers', {
    method: 'POST',
    body: payload,
  })
}

export async function updateRecruitmentOfferStatus(
  offerId: string,
  status: string,
): Promise<RecruitmentOfferRow> {
  return apiRequest<RecruitmentOfferRow>(`/api/admin/recruitment/offers/${offerId}/status`, {
    method: 'POST',
    body: { status },
  })
}

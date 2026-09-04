import { apiRequest } from './apiClient'

export type DocumentRow = {
  id: string
  name: string
  docType: string | null
  url: string
  uploadedAt: string
}

export type MyProfile = {
  employeeId: string
  firstName: string
  lastName: string
  email: string
  departmentName: string | null
  jobTitle: string | null
  managerEmployeeId: string | null
  managerName: string | null
  dateOfBirth: string | null
  personal: {
    phone: string | null
    addressLine1: string | null
    addressLine2: string | null
    city: string | null
    state: string | null
    postalCode: string | null
    country: string | null
    emergencyContactName: string | null
    emergencyContactPhone: string | null
  } | null
}

export async function fetchMyProfile(): Promise<MyProfile> {
  return apiRequest<MyProfile>('/api/my/profile', { method: 'GET', skipCsrf: true })
}

export async function fetchEmployeeDocuments(employeeId: string): Promise<DocumentRow[]> {
  return apiRequest<DocumentRow[]>(`/api/admin/employees/${employeeId}/documents`, {
    method: 'GET',
    skipCsrf: true,
  })
}

export async function fetchMyDocuments(): Promise<DocumentRow[]> {
  return apiRequest<DocumentRow[]>('/api/my/documents', { method: 'GET', skipCsrf: true })
}

export async function addMyDocument(payload: {
  name: string
  docType?: string
  url?: string
  contentBase64?: string
}): Promise<DocumentRow> {
  return apiRequest<DocumentRow>('/api/my/documents', {
    method: 'POST',
    body: payload,
  })
}

export async function fetchDocumentContent(docId: string): Promise<{
  name: string
  docType: string | null
  contentBase64: string | null
}> {
  return apiRequest(`/api/my/documents/${docId}/content`, { method: 'GET', skipCsrf: true })
}

export async function deleteMyDocument(docId: string): Promise<void> {
  await apiRequest<void>(`/api/my/documents/${docId}`, { method: 'DELETE' })
}

export type FamilyMemberRow = {
  id: string
  name: string
  relationship: string | null
  dateOfBirth: string | null
  phone: string | null
}

export type EducationRow = {
  id: string
  institution: string
  degree: string | null
  fieldOfStudy: string | null
  startDate: string | null
  endDate: string | null
  grade: string | null
}

export async function fetchMyFamily(): Promise<FamilyMemberRow[]> {
  return apiRequest<FamilyMemberRow[]>('/api/my/family', { method: 'GET', skipCsrf: true })
}

export async function createMyFamily(payload: {
  name: string
  relationship?: string
  dateOfBirth?: string
  phone?: string
}): Promise<FamilyMemberRow> {
  return apiRequest<FamilyMemberRow>('/api/my/family', { method: 'POST', body: payload })
}

export async function deleteMyFamily(familyId: string): Promise<void> {
  await apiRequest<void>(`/api/my/family/${familyId}`, { method: 'DELETE' })
}

export async function fetchMyEducation(): Promise<EducationRow[]> {
  return apiRequest<EducationRow[]>('/api/my/education', { method: 'GET', skipCsrf: true })
}

export async function createMyEducation(payload: {
  institution: string
  degree?: string
  fieldOfStudy?: string
  startYear?: number
  endYear?: number
}): Promise<EducationRow> {
  // Backend may expect startDate/endDate — send years as Jan 1 strings if needed via startDate
  return apiRequest<EducationRow>('/api/my/education', {
    method: 'POST',
    body: {
      institution: payload.institution,
      degree: payload.degree,
      fieldOfStudy: payload.fieldOfStudy,
      startDate: payload.startYear ? `${payload.startYear}-01-01` : undefined,
      endDate: payload.endYear ? `${payload.endYear}-01-01` : undefined,
    },
  })
}

export async function deleteMyEducation(educationId: string): Promise<void> {
  await apiRequest<void>(`/api/my/education/${educationId}`, { method: 'DELETE' })
}

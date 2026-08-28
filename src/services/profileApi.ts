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
  url: string
}): Promise<DocumentRow> {
  return apiRequest<DocumentRow>('/api/my/documents', {
    method: 'POST',
    body: payload,
  })
}

export async function deleteMyDocument(docId: string): Promise<void> {
  await apiRequest<void>(`/api/my/documents/${docId}`, { method: 'DELETE' })
}

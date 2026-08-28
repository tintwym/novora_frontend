import { apiRequest } from './apiClient'

export type AttendanceLog = {
  id: string
  employeeId: string
  workDate: string
  status: string
  checkInTime: string | null
  checkOutTime: string | null
  workHours: number | null
  notes: string | null
}

export type LeaveRequest = {
  id: string
  employeeId: string
  employeeName: string
  leaveType: string
  startDate: string
  endDate: string
  reason: string | null
  status: string
  decisionNote: string | null
  decidedBy: string | null
  decidedAt: string | null
  createdAt: string
}

export type CreateLeavePayload = {
  leaveType: string
  startDate: string
  endDate: string
  reason?: string
}

export type DecideLeavePayload = {
  decision: 'APPROVE' | 'REJECT'
  note?: string
}

export async function fetchMyAttendance(): Promise<AttendanceLog[]> {
  return apiRequest<AttendanceLog[]>('/api/my/attendance', { method: 'GET', skipCsrf: true })
}

export async function checkInAttendance(): Promise<AttendanceLog> {
  return apiRequest<AttendanceLog>('/api/my/attendance/check-in', { method: 'POST' })
}

export async function checkOutAttendance(): Promise<AttendanceLog> {
  return apiRequest<AttendanceLog>('/api/my/attendance/check-out', { method: 'POST' })
}

export async function fetchMyLeave(): Promise<LeaveRequest[]> {
  return apiRequest<LeaveRequest[]>('/api/my/leave', { method: 'GET', skipCsrf: true })
}

export async function createMyLeave(payload: CreateLeavePayload): Promise<LeaveRequest> {
  return apiRequest<LeaveRequest>('/api/my/leave', {
    method: 'POST',
    body: payload,
  })
}

export async function cancelMyLeave(leaveId: string): Promise<void> {
  await apiRequest<void>(`/api/my/leave/${leaveId}`, { method: 'DELETE' })
}

export async function fetchAdminPendingLeave(): Promise<LeaveRequest[]> {
  return apiRequest<LeaveRequest[]>('/api/admin/leave/pending', { method: 'GET', skipCsrf: true })
}

export async function decideLeave(
  leaveId: string,
  payload: DecideLeavePayload,
): Promise<LeaveRequest> {
  return apiRequest<LeaveRequest>(`/api/admin/leave/${leaveId}/decide`, {
    method: 'POST',
    body: payload,
  })
}

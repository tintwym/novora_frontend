import { apiRequest, ApiError } from './client'
import { Endpoints } from './endpoints'
import type { AttendanceLog } from '../types/dashboard'

function parseLog(row: Record<string, unknown>): AttendanceLog {
  return {
    id: String(row.id ?? ''),
    workDate: String(row.workDate ?? ''),
    checkInTime: row.checkInTime != null ? String(row.checkInTime) : null,
    checkOutTime: row.checkOutTime != null ? String(row.checkOutTime) : null,
    workHours: typeof row.workHours === 'number' ? row.workHours : null,
  }
}

export type AttendanceFetchResult =
  | { ok: true; logs: AttendanceLog[] }
  | { ok: false; error: string }

export async function fetchMyAttendance(): Promise<AttendanceFetchResult> {
  try {
    const data = await apiRequest<Record<string, unknown>[]>(Endpoints.myAttendance)
    if (!Array.isArray(data)) return { ok: true, logs: [] }
    return { ok: true, logs: data.map((e) => parseLog(e)) }
  } catch (e) {
    if (e instanceof ApiError && e.status !== null && (e.status === 401 || e.status === 403)) {
      throw e
    }
    const message = e instanceof ApiError ? e.message : 'Failed to load attendance'
    return { ok: false, error: message }
  }
}

export async function checkIn(): Promise<void> {
  await apiRequest(Endpoints.myCheckIn, { method: 'POST' })
}

export async function checkOut(): Promise<void> {
  await apiRequest(Endpoints.myCheckOut, { method: 'POST' })
}

export function shortTime(raw: string | null): string {
  if (!raw) return '--:--'
  const timeOnly = raw.match(/^(\d{2}):(\d{2})/)
  if (timeOnly) return `${timeOnly[1]}:${timeOnly[2]}`
  const d = new Date(raw)
  if (!Number.isNaN(d.getTime())) {
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
  }
  return '--:--'
}

export function todayIso(): string {
  const n = new Date()
  const y = n.getFullYear()
  const m = String(n.getMonth() + 1).padStart(2, '0')
  const d = String(n.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

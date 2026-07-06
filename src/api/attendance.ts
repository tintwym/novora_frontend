import { apiRequest } from './client'
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

export async function fetchMyAttendance(): Promise<AttendanceLog[]> {
  try {
    const data = await apiRequest<Record<string, unknown>[]>(Endpoints.myAttendance)
    if (!Array.isArray(data)) return []
    return data.map((e) => parseLog(e))
  } catch {
    return []
  }
}

export async function checkIn(): Promise<void> {
  await apiRequest(Endpoints.myCheckIn, { method: 'POST' })
}

export async function checkOut(): Promise<void> {
  await apiRequest(Endpoints.myCheckOut, { method: 'POST' })
}

export function shortTime(iso: string | null): string {
  if (!iso) return '--:--'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) {
    const m = iso.match(/(\d{2}):(\d{2})/)
    return m ? `${m[1]}:${m[2]}` : '--:--'
  }
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export function todayIso(): string {
  const n = new Date()
  const y = n.getFullYear()
  const m = String(n.getMonth() + 1).padStart(2, '0')
  const d = String(n.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

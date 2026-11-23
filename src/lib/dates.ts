/** Company attendance timezone — keep in sync with backend WorkService ZONE. */
export const COMPANY_TZ = 'Asia/Singapore'
export const COMPANY_UTC_OFFSET = '+08:00'

/** Calendar date as YYYY-MM-DD in the company timezone (not browser-local / not UTC). */
export function localTodayIso(date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: COMPANY_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export function formatClockTime(date = new Date()): string {
  return date.toLocaleTimeString('en-GB', {
    timeZone: COMPANY_TZ,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

export function formatClockDate(date = new Date()): string {
  return date.toLocaleDateString('en-GB', {
    timeZone: COMPANY_TZ,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

/** Elapsed HH:MM:SS from a LocalTime-like "HH:MM:SS" or "HH:MM" on today's company date. */
export function elapsedSinceLocalTime(time: string | null | undefined, now = new Date()): string | null {
  if (!time) return null
  const parts = time.split(':').map((p) => Number(p))
  if (parts.length < 2 || parts.some((n) => Number.isNaN(n))) return null
  const day = localTodayIso(now)
  const hh = String(parts[0] ?? 0).padStart(2, '0')
  const mm = String(parts[1] ?? 0).padStart(2, '0')
  const ss = String(parts[2] ?? 0).padStart(2, '0')
  const start = new Date(`${day}T${hh}:${mm}:${ss}${COMPANY_UTC_OFFSET}`)
  if (Number.isNaN(start.getTime())) return null
  let ms = now.getTime() - start.getTime()
  if (ms < 0) ms = 0
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

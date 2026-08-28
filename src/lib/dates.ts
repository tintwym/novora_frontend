/** Local calendar date as YYYY-MM-DD (not UTC). */
export function localTodayIso(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function formatClockTime(date = new Date()): string {
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function formatClockDate(date = new Date()): string {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

/** Elapsed HH:MM:SS from a LocalTime-like "HH:MM:SS" or "HH:MM" on today's date. */
export function elapsedSinceLocalTime(time: string | null | undefined, now = new Date()): string | null {
  if (!time) return null
  const parts = time.split(':').map((p) => Number(p))
  if (parts.length < 2 || parts.some((n) => Number.isNaN(n))) return null
  const start = new Date(now)
  start.setHours(parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0, 0)
  let ms = now.getTime() - start.getTime()
  if (ms < 0) ms = 0
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

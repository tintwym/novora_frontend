/** Client-side companion to the backend 1-hour session policy. */
export const SESSION_TTL_MS = 60 * 60 * 1000
const SESSION_STARTED_KEY = 'novora.session.startedAt'

export function markSessionStarted(at = Date.now()) {
  try {
    sessionStorage.setItem(SESSION_STARTED_KEY, String(at))
  } catch {
    // private mode / blocked storage
  }
}

export function clearSessionStarted() {
  try {
    sessionStorage.removeItem(SESSION_STARTED_KEY)
  } catch {
    // ignore
  }
}

export function readSessionStartedAt(): number | null {
  try {
    const raw = sessionStorage.getItem(SESSION_STARTED_KEY)
    if (!raw) return null
    const n = Number(raw)
    return Number.isFinite(n) ? n : null
  } catch {
    return null
  }
}

/** True when the local session clock has passed the 1h mark. */
export function isLocalSessionExpired(now = Date.now()): boolean {
  const started = readSessionStartedAt()
  if (started == null) return false
  return now - started >= SESSION_TTL_MS
}

export function sessionRemainingMs(now = Date.now()): number | null {
  const started = readSessionStartedAt()
  if (started == null) return null
  return Math.max(0, SESSION_TTL_MS - (now - started))
}

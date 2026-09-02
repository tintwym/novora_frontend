const STORAGE_KEY = 'novora.auth.loginAttempts'

interface LoginAttemptState {
  failures: number
  lockUntil: number | null
}

const MAX_FAILURES = 5
const LOCKOUT_MS = 5 * 60 * 1000

function readState(): LoginAttemptState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return { failures: 0, lockUntil: null }
    const parsed = JSON.parse(raw) as LoginAttemptState
    return {
      failures: typeof parsed.failures === 'number' ? parsed.failures : 0,
      lockUntil: typeof parsed.lockUntil === 'number' ? parsed.lockUntil : null,
    }
  } catch {
    return { failures: 0, lockUntil: null }
  }
}

function writeState(state: LoginAttemptState) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore quota errors
  }
}

export function getLoginLockout(): { locked: boolean; retryAfterSeconds: number } {
  const state = readState()
  if (!state.lockUntil) return { locked: false, retryAfterSeconds: 0 }

  const remaining = state.lockUntil - Date.now()
  if (remaining <= 0) {
    writeState({ failures: 0, lockUntil: null })
    return { locked: false, retryAfterSeconds: 0 }
  }

  return { locked: true, retryAfterSeconds: Math.ceil(remaining / 1000) }
}

export function recordLoginFailure(): { locked: boolean; retryAfterSeconds: number } {
  const state = readState()
  const failures = state.failures + 1

  if (failures >= MAX_FAILURES) {
    const lockUntil = Date.now() + LOCKOUT_MS
    writeState({ failures, lockUntil })
    return { locked: true, retryAfterSeconds: Math.ceil(LOCKOUT_MS / 1000) }
  }

  writeState({ failures, lockUntil: null })
  return { locked: false, retryAfterSeconds: 0 }
}

export function clearLoginFailures() {
  writeState({ failures: 0, lockUntil: null })
}

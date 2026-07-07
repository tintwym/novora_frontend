import { apiRequest, clearCsrfToken, ensureCsrfToken, ApiError } from './client'
import { Endpoints } from './endpoints'
import { parseUser, type User } from '../types/user'
import {
  clearSessionStorage,
  saveCachedUser,
  saveRememberMe,
} from '../auth/sessionStorage'

export function shouldProbeServerSession(): boolean {
  return true
}

export async function fetchMe(): Promise<User | null> {
  try {
    const data = await apiRequest<Record<string, unknown>>(Endpoints.me)
    const user = parseUser(data)
    saveCachedUser(user)
    return user
  } catch (e) {
    if (e && typeof e === 'object' && 'status' in e && (e as { status: number }).status === 401) {
      clearSessionStorage()
      return null
    }
    throw e
  }
}

export async function tryRestoreSession(): Promise<User | null> {
  if (!shouldProbeServerSession()) return null
  return fetchMe()
}

function sessionNotSavedMessage(): string {
  return (
    'Login succeeded but the session cookie was not saved. On Vercel, remove VITE_API_BASE_URL, ' +
    'redeploy, and use same-origin /api rewrites (not the Render URL in the browser).'
  )
}

/**
 * After login/register POST, confirm JSESSIONID via GET /me (no CSRF needed).
 * Refresh CSRF in the background for the next mutating request — do not block sign-in on it.
 */
async function confirmSessionUser(authBody: Record<string, unknown>): Promise<User> {
  const snapshot = parseUser(authBody)
  try {
    const user = await fetchMe()
    if (user) {
      void ensureCsrfToken().catch(() => {})
      return user
    }
  } catch (e) {
    if (snapshot.id && snapshot.email && e instanceof ApiError && e.status === null) {
      void ensureCsrfToken().catch(() => {})
      return snapshot
    }
    throw e
  }
  if (snapshot.id && snapshot.email) {
    throw new ApiError(sessionNotSavedMessage(), null)
  }
  throw new ApiError('Not authenticated', 401)
}

export async function login(email: string, password: string, rememberMe: boolean): Promise<User> {
  await ensureCsrfToken()
  const authBody = await apiRequest<Record<string, unknown>>(Endpoints.authLogin, {
    method: 'POST',
    body: { email: email.trim(), password },
  })
  const user = await confirmSessionUser(authBody)
  saveCachedUser(user)
  saveRememberMe(rememberMe)
  if (rememberMe) {
    localStorage.setItem('novora_remembered_email', email.trim())
  } else {
    localStorage.removeItem('novora_remembered_email')
  }
  return user
}

export async function register(
  email: string,
  password: string,
  companyName: string,
  fullName: string,
): Promise<User> {
  await ensureCsrfToken()
  const authBody = await apiRequest<Record<string, unknown>>(Endpoints.authRegister, {
    method: 'POST',
    body: {
      email: email.trim(),
      password,
      companyName: companyName.trim(),
      fullName: fullName.trim(),
    },
  })
  const user = await confirmSessionUser(authBody)
  saveCachedUser(user)
  saveRememberMe(true)
  return user
}

export async function logout(): Promise<void> {
  try {
    await ensureCsrfToken()
    await apiRequest(Endpoints.authLogout, { method: 'POST' })
  } catch {
    // Ignore network errors during logout.
  }
  clearCsrfToken()
  clearSessionStorage()
  localStorage.removeItem('novora_remember_me')
}

export function getRememberedEmail(): string {
  return localStorage.getItem('novora_remembered_email') ?? ''
}

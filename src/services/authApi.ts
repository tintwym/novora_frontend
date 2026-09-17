import { apiRequest, clearCsrfCache, ensureCsrfToken, syncCsrfFromCookie } from './apiClient'
import type { AuthResponse, LoginRequest, RegisterRequest } from './types'

export async function fetchCsrf(): Promise<void> {
  await ensureCsrfToken(true)
}

/**
 * After login/register Spring rotates the session and refreshes the XSRF cookie.
 * Prefer the cookie from the auth response; only hit /csrf if the cookie is missing.
 */
async function refreshCsrfAfterAuth(): Promise<void> {
  clearCsrfCache()
  if (syncCsrfFromCookie()) return
  await ensureCsrfToken(true)
}

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  // Reuse cached/cookie CSRF when warm (LoginPage prefetches). Avoid forced double CSRF + /me.
  await ensureCsrfToken()
  const auth = await apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: payload,
  })
  await refreshCsrfAfterAuth()
  return auth
}

export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  await ensureCsrfToken()
  const auth = await apiRequest<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: payload,
  })
  await refreshCsrfAfterAuth()
  return auth
}

export async function fetchMe(signal?: AbortSignal): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/api/me', { method: 'GET', skipCsrf: true, signal })
}

export async function logout(): Promise<void> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), 8000)
  try {
    await apiRequest<void>('/api/auth/logout', {
      method: 'POST',
      signal: controller.signal,
    })
  } catch {
    // Session is cleared client-side regardless (network / CSRF / cold start).
  } finally {
    window.clearTimeout(timer)
    clearCsrfCache()
  }
}

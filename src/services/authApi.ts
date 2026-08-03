import { apiRequest, clearCsrfCache, ensureCsrfToken } from './apiClient'
import { ApiError, type AuthResponse, type LoginRequest, type RegisterRequest } from './types'

export async function fetchCsrf(): Promise<void> {
  await ensureCsrfToken(true)
}

async function confirmSession(): Promise<AuthResponse> {
  try {
    return await fetchMe()
  } catch (err) {
    if (err instanceof ApiError) {
      throw new ApiError(
        'Signed in on the server, but the browser did not keep the session cookie. ' +
          'Use same-origin /api (empty VITE_API_BASE_URL + Vercel rewrites) instead of a cross-site API URL.',
        err.status,
      )
    }
    throw err
  }
}

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  clearCsrfCache()
  await ensureCsrfToken(true)
  await apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: payload,
  })
  // Session fixation protection rotates JSESSIONID — force a fresh CSRF token.
  clearCsrfCache()
  await ensureCsrfToken(true)
  return confirmSession()
}

export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  clearCsrfCache()
  await ensureCsrfToken(true)
  await apiRequest<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: payload,
  })
  clearCsrfCache()
  await ensureCsrfToken(true)
  return confirmSession()
}

export async function fetchMe(): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/api/me', { method: 'GET', skipCsrf: true })
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

import { apiRequest, clearCsrfCache, ensureCsrfToken } from './apiClient'
import type { AuthResponse, LoginRequest, RegisterRequest } from './types'

export async function fetchCsrf(): Promise<void> {
  await ensureCsrfToken(true)
}

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  clearCsrfCache()
  await ensureCsrfToken(true)
  const response = await apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: payload,
  })
  // Session fixation protection rotates JSESSIONID — force a fresh CSRF token.
  clearCsrfCache()
  await ensureCsrfToken(true)
  return response
}

export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  clearCsrfCache()
  await ensureCsrfToken(true)
  const response = await apiRequest<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: payload,
  })
  clearCsrfCache()
  await ensureCsrfToken(true)
  return response
}

export async function fetchMe(): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/api/me', { method: 'GET', skipCsrf: true })
}

export async function logout(): Promise<void> {
  try {
    await apiRequest<void>('/api/auth/logout', { method: 'POST' })
  } finally {
    clearCsrfCache()
  }
}

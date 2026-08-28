import { ApiError } from './types'

/**
 * Base URL for API calls.
 * - Local / Vercel: leave empty and use same-origin `/api` (vercel.json + next.config rewrites)
 *   so session cookies + CSRF stay same-site.
 * - Only set `NEXT_PUBLIC_API_BASE_URL` if you intentionally call the API origin directly.
 */
export const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? ''

let cachedCsrfToken: string | null = null
let csrfHeaderName = 'X-XSRF-TOKEN'

type SessionExpiredHandler = () => void
let onSessionExpired: SessionExpiredHandler | null = null

/** Register once from App — called when an authenticated API returns 401. */
export function setSessionExpiredHandler(handler: SessionExpiredHandler | null) {
  onSessionExpired = handler
}

function notifySessionExpired(path: string, status: number) {
  if (status !== 401) return
  if (path.includes('/api/auth/login') || path.includes('/api/auth/register') || path.includes('/api/auth/csrf')) {
    return
  }
  onSessionExpired?.()
}
function readCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1')}=([^;]*)`),
  )
  return match ? decodeURIComponent(match[1]) : null
}

export async function ensureCsrfToken(forceRefresh = false): Promise<string> {
  if (!forceRefresh) {
    if (cachedCsrfToken) return cachedCsrfToken
    const fromCookie = readCookie('XSRF-TOKEN')
    if (fromCookie) {
      cachedCsrfToken = fromCookie
      return fromCookie
    }
  }

  // Render free tier can 502 while waking; retry a couple times.
  let lastStatus = 0
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(`${API_BASE_URL}/api/auth/csrf`, {
      method: 'GET',
      credentials: 'include',
      headers: { Accept: 'application/json' },
    })
    lastStatus = res.status

    if (res.ok) {
      const data = (await res.json()) as { token?: string; headerName?: string }
      if (!data.token) {
        throw new ApiError('CSRF token missing from server response', res.status)
      }
      cachedCsrfToken = data.token
      if (data.headerName) csrfHeaderName = data.headerName
      return data.token
    }

    if (res.status !== 502 && res.status !== 503 && res.status !== 504) {
      break
    }
    await new Promise((r) => setTimeout(r, 800 * (attempt + 1)))
  }

  throw new ApiError('Could not initialize security token. Is the API running?', lastStatus)
}

export function clearCsrfCache() {
  cachedCsrfToken = null
}

async function parseError(res: Response): Promise<ApiError> {
  let message = res.statusText || `Request failed (${res.status})`
  let errors: Record<string, string> | undefined

  try {
    const body = (await res.json()) as {
      message?: string
      error?: string
      errors?: Record<string, string>
    }
    if (body.message) message = body.message
    else if (body.error) message = body.error
    if (body.errors) errors = body.errors
  } catch {
    // non-JSON body
  }

  return new ApiError(message, res.status, errors)
}

export type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  /** Skip CSRF header (safe for GET). */
  skipCsrf?: boolean
  /** Internal: already retried after CSRF refresh. */
  _csrfRetried?: boolean
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const method = (options.method ?? 'GET').toUpperCase()
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  const needsCsrf = !options.skipCsrf && method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS'
  if (needsCsrf) {
    const token = await ensureCsrfToken()
    headers.set(csrfHeaderName, token)
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    method,
    headers,
    credentials: 'include',
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  if (res.status === 204) {
    return undefined as T
  }

  if (!res.ok) {
    if (res.status === 403 && needsCsrf && !options._csrfRetried) {
      clearCsrfCache()
      await ensureCsrfToken(true)
      return apiRequest<T>(path, { ...options, _csrfRetried: true })
    }
    if (res.status === 403) {
      clearCsrfCache()
    }
    if (res.status === 401) {
      clearCsrfCache()
      notifySessionExpired(path, res.status)
    }
    throw await parseError(res)
  }

  const contentType = res.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    return undefined as T
  }

  return (await res.json()) as T
}

import { Endpoints } from './endpoints'

let csrfHeaderName = 'X-XSRF-TOKEN'
let csrfToken: string | null = null

export function apiBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_API_BASE_URL?.trim()
  if (fromEnv === '/' || fromEnv === 'same-origin') return ''
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  return ''
}

function crossOriginApiMisconfig(): string | null {
  if (typeof window === 'undefined') return null
  const base = apiBaseUrl()
  if (!base) return null
  try {
    const apiHost = new URL(base, window.location.origin).host
    if (apiHost !== window.location.host) {
      return (
        'API is set to a different origin than this site. On Vercel, remove VITE_API_BASE_URL ' +
        'from Environment Variables and redeploy so /api is proxied on the same domain.'
      )
    }
  } catch {
    return 'VITE_API_BASE_URL is invalid.'
  }
  return null
}

function readCsrfFromDocumentCookie(): boolean {
  if (typeof document === 'undefined') return false
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/)
  if (!match?.[1]) return false
  try {
    csrfToken = decodeURIComponent(match[1].trim())
  } catch {
    csrfToken = match[1].trim()
  }
  return Boolean(csrfToken)
}

function resolveUrl(path: string): string {
  const base = apiBaseUrl()
  const p = path.startsWith('/') ? path : `/${path}`
  return base ? `${base}${p}` : p
}

function applyCsrfFromBody(data: unknown) {
  if (!data || typeof data !== 'object') return
  const map = data as Record<string, unknown>
  if (typeof map.headerName === 'string' && map.headerName) {
    csrfHeaderName = map.headerName
  }
  if (typeof map.token === 'string' && map.token) {
    csrfToken = map.token
  }
}

function applyCsrfFromSetCookie(setCookie: string | null) {
  if (csrfToken || !setCookie) return
  const match = setCookie.match(/\bXSRF-TOKEN=([^;]+)/i)
  if (!match?.[1]) return
  try {
    csrfToken = decodeURIComponent(match[1].trim())
  } catch {
    csrfToken = match[1].trim()
  }
}

function isLocalDev(): boolean {
  return import.meta.env.DEV
}

/** Render free tier can take ~60s to wake; avoid hanging the UI indefinitely. */
const API_TIMEOUT_MS = 90_000

async function fetchWithTimeout(url: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw new ApiError(
        'Request timed out. The API may still be waking on Render free tier — wait about a minute and try again.',
        null,
      )
    }
    throw new ApiError(apiUnreachableMessage(), null)
  } finally {
    clearTimeout(timer)
  }
}

/** Fire-and-forget ping so the first user action is not blocked by cold start. */
export function warmApi(): void {
  void fetchWithTimeout(resolveUrl('/actuator/health'), {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  }).catch(() => {
    /* ignore — login will surface errors */
  })
}

function apiUnreachableMessage(): string {
  if (isLocalDev()) {
    return 'API server is not reachable. Start novora_backend on port 8081 (./scripts/run-backend-local.sh), or use your deployed Vercel URL instead.'
  }
  return (
    'API server is not reachable. On Render free tier the API may be waking up — wait ~1 minute and retry. ' +
    'Also confirm Render is Live, vercel.json rewrites point at your Render URL, and VITE_API_BASE_URL is empty on Vercel.'
  )
}

function csrfBootstrapError(status: number): string {
  if (status === 502 || status === 503 || status === 504) {
    return apiUnreachableMessage()
  }
  if (status === 404) {
    return 'Auth API not found. Ensure novora_backend is running (not another app on the proxy port).'
  }
  return `CSRF bootstrap failed (${status})`
}

export async function ensureCsrfToken(): Promise<void> {
  const misconfig = crossOriginApiMisconfig()
  if (misconfig) {
    throw new ApiError(misconfig, null)
  }
  clearCsrfToken()
  const res = await fetchWithTimeout(resolveUrl(Endpoints.authCsrf), {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })
  const data = await res.json().catch(() => null)
  applyCsrfFromBody(data)
  applyCsrfFromSetCookie(res.headers.get('set-cookie'))
  readCsrfFromDocumentCookie()
  if (!res.ok) {
    throw new ApiError(csrfBootstrapError(res.status), res.status)
  }
  if (!csrfToken) {
    throw new ApiError(
      isLocalDev()
        ? 'CSRF token missing from API response. Check that novora_backend is running on port 8081.'
        : 'CSRF token missing from API response. Check Vercel rewrites to Render and that the API is awake.',
      res.status,
    )
  }
}

export function clearCsrfToken() {
  csrfToken = null
}

export class ApiError extends Error {
  readonly status: number | null

  constructor(message: string, status: number | null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

type RequestOptions = {
  method?: string
  body?: unknown
  skipCsrf?: boolean
  _csrfRetried?: boolean
}

function parseJsonBody<T>(text: string): T | undefined {
  if (!text) return undefined
  try {
    return JSON.parse(text) as T
  } catch {
    return undefined
  }
}

export async function apiRequest<T>(
  path: string,
  { method = 'GET', body, skipCsrf = false, _csrfRetried = false }: RequestOptions = {},
): Promise<T> {
  const upper = method.toUpperCase()
  const mutating = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(upper)
  if (mutating && !skipCsrf && !csrfToken) {
    await ensureCsrfToken()
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
  }
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }
  if (mutating && csrfToken) {
    headers[csrfHeaderName] = csrfToken
  }

  const res = await fetchWithTimeout(resolveUrl(path), {
    method: upper,
    credentials: 'include',
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (path.endsWith('/auth/csrf')) {
    const data = parseJsonBody<Record<string, unknown>>(await res.clone().text())
    applyCsrfFromBody(data)
    applyCsrfFromSetCookie(res.headers.get('set-cookie'))
    readCsrfFromDocumentCookie()
  }

  if (res.status === 403 && mutating && !skipCsrf && !_csrfRetried) {
    await ensureCsrfToken()
    return apiRequest<T>(path, { method, body, skipCsrf, _csrfRetried: true })
  }

  if (res.status === 204) {
    return undefined as T
  }

  const text = await res.text()
  const data = parseJsonBody<T>(text)

  if (!res.ok) {
    const serverMsg =
      data && typeof data === 'object' && 'message' in data
        ? String((data as { message: unknown }).message)
        : null
    const msg =
      serverMsg ??
      (res.status === 403
        ? crossOriginApiMisconfig() ??
          'Login blocked (403). Remove VITE_API_BASE_URL on Vercel, redeploy, and use same-origin /api rewrites.'
        : res.status === 502 || res.status === 503
          ? apiUnreachableMessage()
          : `Request failed (${res.status})`)
    throw new ApiError(msg, res.status)
  }

  return data as T
}

export interface OrganizationSnapshot {
  id: string
  name: string
  slug: string
  plan: string
  status: string
  trialExpiresAt: string | null
}

export interface AuthResponse {
  accessToken: string | null
  tokenType: string
  userId: string
  email: string
  /** Display name from linked employee profile when available. */
  fullName?: string | null
  roles: string[]
  organization: OrganizationSnapshot | null
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  companyName: string
  fullName?: string
}

export class ApiError extends Error {
  status: number
  errors?: Record<string, string>

  constructor(message: string, status: number, errors?: Record<string, string>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }
}

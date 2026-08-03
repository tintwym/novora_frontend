import type { AuthResponse } from '@/services'
import type { AuthSession } from '@/types'

export function toAuthSession(response: AuthResponse, fallbackName?: string): AuthSession {
  const emailLocal = response.email.split('@')[0] || 'User'
  const fromApi = response.fullName?.trim()
  return {
    userId: response.userId,
    email: response.email,
    fullName: fallbackName?.trim() || fromApi || emailLocal,
    roles: response.roles ?? [],
    companyName: response.organization?.name ?? 'Workspace',
    organization: response.organization
      ? {
          id: response.organization.id,
          name: response.organization.name,
          slug: response.organization.slug,
          plan: response.organization.plan,
          status: response.organization.status,
          trialExpiresAt: response.organization.trialExpiresAt,
        }
      : null,
  }
}

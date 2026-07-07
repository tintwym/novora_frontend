const HR_ADMIN_ROLES = new Set(['SUPER_ADMIN', 'HR_ADMIN', 'HR_MANAGER'])

export function normalizeRole(raw: string): string {
  const r = raw.trim().toUpperCase()
  if (r === 'ADMIN' || r === 'ADMINISTRATOR') return 'HR_ADMIN'
  return r
}

export type User = {
  id: string
  email: string
  displayName: string
  roles: string[]
  primaryRole: string | null
  isEmployee: boolean
  canAccessHrAdmin: boolean
}

export function parseUser(json: Record<string, unknown>): User {
  const rawId = json.userId
  const id = rawId == null ? '' : String(rawId)
  const email = typeof json.email === 'string' ? json.email : ''
  const roles = Array.isArray(json.roles)
    ? json.roles.map((r) => normalizeRole(String(r)))
    : []
  const primaryRole = roles[0] ?? null
  const local = email.split('@')[0] ?? ''
  const displayName = local || email

  return {
    id,
    email,
    displayName,
    roles,
    primaryRole,
    isEmployee: primaryRole === 'EMPLOYEE' || primaryRole === 'MANAGER',
    canAccessHrAdmin: primaryRole != null && HR_ADMIN_ROLES.has(primaryRole),
  }
}

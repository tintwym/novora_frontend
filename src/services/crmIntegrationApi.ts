import { apiRequest } from './apiClient'

export type CrmConnectionStatus = {
  /** False until CRM_INTEGRATION_ENABLED, CRM_BASE_URL and CRM_INTEGRATION_SECRET are set on the API. */
  available: boolean
  connected: boolean
  crmCompanyId: string | null
  connectedAt: string | null
  /** Employee changes not yet confirmed by Novora CRM. */
  pendingEvents: number
}

export type CrmLinkCode = {
  code: string
  expiresAt: string
}

export async function fetchCrmConnection(): Promise<CrmConnectionStatus> {
  return apiRequest<CrmConnectionStatus>('/api/admin/integrations/crm', { method: 'GET', skipCsrf: true })
}

export async function createCrmLinkCode(): Promise<CrmLinkCode> {
  return apiRequest<CrmLinkCode>('/api/admin/integrations/crm/link-code', { method: 'POST' })
}

export async function disconnectCrm(): Promise<void> {
  return apiRequest<void>('/api/admin/integrations/crm', { method: 'DELETE' })
}

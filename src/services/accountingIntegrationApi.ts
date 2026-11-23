import { apiRequest } from './apiClient'

export type AccountingConnectionStatus = {
  serverReady: boolean
  connected: boolean
  accountingCompanyId: string | null
  lastPayrollRunId: string | null
  lastSyncedAt: string | null
  lastError: string | null
}

export async function fetchAccountingConnection(): Promise<AccountingConnectionStatus> {
  return apiRequest<AccountingConnectionStatus>('/api/admin/integrations/accounting', {
    method: 'GET',
    skipCsrf: true,
  })
}

export async function connectAccounting(accountingCompanyId: string): Promise<AccountingConnectionStatus> {
  return apiRequest<AccountingConnectionStatus>('/api/admin/integrations/accounting', {
    method: 'PUT',
    body: { accountingCompanyId },
  })
}

export async function disconnectAccounting(): Promise<void> {
  await apiRequest<void>('/api/admin/integrations/accounting', { method: 'DELETE' })
}

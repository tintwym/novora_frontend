'use client'

import { useCallback, useEffect, useState } from 'react'
import { CheckCircle2, Link2, Power, RefreshCw, Unplug } from 'lucide-react'
import {
  ApiError,
  connectAccounting,
  disconnectAccounting,
  fetchAccountingConnection,
  type AccountingConnectionStatus,
} from '@/services'

type Props = {
  addToast: (text: string, type: 'success' | 'loading' | 'error' | 'info') => void
}

function errorText(err: unknown, fallback: string) {
  if (err instanceof ApiError) {
    if (err.status === 403) return 'Only super admins and HR admins can manage the Novora Accounting connection.'
    return err.message || fallback
  }
  return fallback
}

export default function AccountingIntegrationPanel({ addToast }: Props) {
  const [status, setStatus] = useState<AccountingConnectionStatus | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [companyId, setCompanyId] = useState('')
  const [busy, setBusy] = useState<'save' | 'refresh' | 'disconnect' | null>(null)
  const [confirmDisconnect, setConfirmDisconnect] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const next = await fetchAccountingConnection()
      setStatus(next)
      setLoadError(null)
      if (next.accountingCompanyId) setCompanyId(next.accountingCompanyId)
      return next
    } catch (err) {
      setLoadError(errorText(err, 'Could not check the Novora Accounting connection.'))
      return null
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  async function save() {
    const id = companyId.trim()
    if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
      addToast('Enter a valid Accounting company UUID.', 'error')
      return
    }
    setBusy('save')
    try {
      const next = await connectAccounting(id)
      setStatus(next)
      addToast('Connected to Novora Accounting. Processed payroll will post salary journals.', 'success')
    } catch (err) {
      addToast(errorText(err, 'Could not connect Accounting.'), 'error')
    } finally {
      setBusy(null)
    }
  }

  async function checkNow() {
    setBusy('refresh')
    const next = await refresh()
    setBusy(null)
    if (next?.connected) addToast('Novora Accounting is connected.', 'success')
  }

  async function disconnect() {
    setBusy('disconnect')
    try {
      await disconnectAccounting()
      setConfirmDisconnect(false)
      setCompanyId('')
      await refresh()
      addToast('Disconnected from Novora Accounting. Payroll will no longer post journals.', 'success')
    } catch (err) {
      addToast(errorText(err, 'Could not disconnect.'), 'error')
    } finally {
      setBusy(null)
    }
  }

  const connected = Boolean(status?.connected)

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h2 className="text-base font-extrabold text-slate-800 tracking-tight">Novora Accounting</h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Sync processed payroll into Accounting as salary journals (expense, tax, net pay, deductions).
        </p>
      </div>

      {loadError ? (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
          {loadError}
        </div>
      ) : null}

      {status && !status.serverReady ? (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
          <p className="text-xs font-bold text-slate-800">Server integration is off</p>
          <p className="text-[11px] text-slate-600 mt-1">
            Ask your admin to enable <code className="font-mono">ACCOUNTING_INTEGRATION_ENABLED</code> and set{' '}
            <code className="font-mono">ACCOUNTING_BASE_URL</code> on the HRMS API.
          </p>
        </div>
      ) : null}

      <div className="nv-panel overflow-hidden">
        <div className="flex items-start gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm">
            {connected ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            ) : (
              <Unplug className="h-5 w-5 text-slate-400" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-bold text-slate-800">Accounting connection</p>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  connected
                    ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
                    : 'bg-slate-100 text-slate-500 ring-1 ring-slate-200'
                }`}
              >
                {connected ? 'Active' : 'Not connected'}
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-slate-500">
              {connected
                ? 'Payroll marked processed posts to this Accounting company.'
                : 'Paste the Accounting company UUID from your finance workspace.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void checkNow()}
            disabled={busy !== null}
            className="nv-btn-secondary inline-flex items-center gap-1.5 text-xs shrink-0"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${busy === 'refresh' ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400" htmlFor="acct-company-id">
              Accounting company ID
            </label>
            <input
              id="acct-company-id"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              autoComplete="off"
              spellCheck={false}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-mono font-semibold text-slate-800 outline-none focus:border-novora"
            />
            <p className="text-[11px] text-slate-500">
              Sent as <code className="font-mono">X-Company-Id</code> when payroll posts.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy !== null || !status?.serverReady}
              onClick={() => void save()}
              className="nv-btn-primary text-xs disabled:opacity-50"
            >
              {busy === 'save' ? 'Saving…' : connected ? 'Update connection' : 'Connect'}
            </button>
            {connected ? (
              confirmDisconnect ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void disconnect()}
                    className="nv-btn-primary bg-rose-600 hover:bg-rose-700 text-xs"
                  >
                    Confirm disconnect
                  </button>
                  <button type="button" onClick={() => setConfirmDisconnect(false)} className="nv-btn-secondary text-xs">
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDisconnect(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-700"
                >
                  <Power className="h-3.5 w-3.5" />
                  Disconnect
                </button>
              )
            ) : null}
          </div>

          {connected ? (
            <div className="grid gap-2 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5 text-[11px] text-slate-600 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Last payroll run</p>
                <p className="mt-0.5 font-semibold text-slate-800 font-mono">{status?.lastPayrollRunId || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Last synced</p>
                <p className="mt-0.5 font-semibold text-slate-800">
                  {status?.lastSyncedAt ? new Date(status.lastSyncedAt).toLocaleString() : '—'}
                </p>
              </div>
              {status?.lastError ? (
                <p className="sm:col-span-2 text-rose-700 font-semibold">Last error: {status.lastError}</p>
              ) : null}
            </div>
          ) : (
            <div className="flex items-start gap-2 rounded-xl border border-dashed border-slate-200 px-3 py-2.5 text-[11px] text-slate-500">
              <Link2 className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <p>No events will leave HRMS until this connection is active.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

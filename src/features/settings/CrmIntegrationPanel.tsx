'use client'

import { useCallback, useEffect, useState } from 'react'
import { CheckCircle2, Copy, KeyRound, Power, RefreshCw } from 'lucide-react'
import {
  ApiError,
  createCrmLinkCode,
  disconnectCrm,
  fetchCrmConnection,
  type CrmConnectionStatus,
} from '@/services'

type Props = {
  addToast: (text: string, type: 'success' | 'loading' | 'error' | 'info') => void
}

const CODE_VALID_MINUTES = 15

function errorText(err: unknown, fallback: string) {
  if (err instanceof ApiError) {
    if (err.status === 403) return 'Only super admins and HR admins can manage the Novora CRM connection.'
    return err.message || fallback
  }
  return fallback
}

export default function CrmIntegrationPanel({ addToast }: Props) {
  const [status, setStatus] = useState<CrmConnectionStatus | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [code, setCode] = useState<{ value: string; expiresAt: number } | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const [busy, setBusy] = useState<'code' | 'refresh' | 'disconnect' | null>(null)
  const [confirmDisconnect, setConfirmDisconnect] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const next = await fetchCrmConnection()
      setStatus(next)
      setLoadError(null)
      if (next.connected) setCode(null)
      return next
    } catch (err) {
      setLoadError(errorText(err, 'Could not check the Novora CRM connection.'))
      return null
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  // While a code is on screen, tick the countdown and notice when the CRM admin has used it.
  useEffect(() => {
    if (!code) return
    const tick = setInterval(() => setNow(Date.now()), 1000)
    const poll = setInterval(() => void refresh(), 5000)
    return () => {
      clearInterval(tick)
      clearInterval(poll)
    }
  }, [code, refresh])

  async function generateCode() {
    setBusy('code')
    try {
      const res = await createCrmLinkCode()
      // Count down from the browser clock; the server's timestamp has no time zone.
      setCode({ value: res.code, expiresAt: Date.now() + CODE_VALID_MINUTES * 60_000 })
      setNow(Date.now())
    } catch (err) {
      addToast(errorText(err, 'Could not create a connection code.'), 'error')
    } finally {
      setBusy(null)
    }
  }

  async function checkNow() {
    setBusy('refresh')
    const next = await refresh()
    setBusy(null)
    if (next?.connected) addToast('Novora CRM is connected.', 'success')
  }

  async function disconnect() {
    setBusy('disconnect')
    try {
      await disconnectCrm()
      setConfirmDisconnect(false)
      await refresh()
      addToast('Disconnected from Novora CRM. Employee changes will no longer be sent.', 'success')
    } catch (err) {
      addToast(errorText(err, 'Could not disconnect.'), 'error')
    } finally {
      setBusy(null)
    }
  }

  function copyCode() {
    if (!code) return
    void navigator.clipboard?.writeText(code.value)
    addToast('Code copied.', 'success')
  }

  const secondsLeft = code ? Math.max(0, Math.round((code.expiresAt - now) / 1000)) : 0
  const expired = code !== null && secondsLeft === 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-extrabold text-slate-800 tracking-tight">Novora CRM</h2>
        <p className="text-[11px] font-semibold text-slate-400 mt-1">
          Send hires, changes and leavers to Novora CRM, so sales and support staff get CRM accounts automatically and
          lose access when they leave.
        </p>
      </div>

      {loadError && (
        <div role="alert" className="p-4 rounded-xl border border-rose-100 bg-rose-50 text-[11px] font-semibold text-rose-700">
          {loadError}
        </div>
      )}

      {status === null && !loadError && <p className="text-[11px] font-semibold text-slate-400">Checking…</p>}

      {status && !status.available && (
        <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/60 space-y-2">
          <p className="text-xs font-bold text-slate-800">The Novora CRM connection isn&apos;t turned on for this server</p>
          <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
            Your Novora administrator needs to set <code className="font-mono">CRM_INTEGRATION_ENABLED</code>,{' '}
            <code className="font-mono">CRM_BASE_URL</code> and <code className="font-mono">CRM_INTEGRATION_SECRET</code>{' '}
            on the API, then restart it.
          </p>
        </div>
      )}

      {status?.available && !status.connected && (
        <div className="p-5 rounded-2xl border border-slate-100 bg-white space-y-4">
          <ol className="list-decimal pl-5 space-y-1 text-[11px] font-semibold text-slate-500 leading-relaxed">
            <li>Create a connection code here.</li>
            <li>
              Give it to an admin of your Novora CRM workspace. They enter it in CRM under{' '}
              <span className="font-bold text-slate-700">Settings → Novora HRMS</span>.
            </li>
            <li>The code works once and expires after {CODE_VALID_MINUTES} minutes. Nothing is shared until it is used.</li>
          </ol>

          {code && !expired ? (
            <div className="bg-slate-50/50 p-4 border border-slate-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Connection code</div>
                <div className="font-mono text-2xl font-extrabold tracking-[0.2em] text-novora select-all">{code.value}</div>
                <div className="text-[10.5px] font-bold text-slate-400">
                  Expires in {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')} · waiting for the
                  CRM admin…
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyCode}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </button>
                <button
                  type="button"
                  onClick={() => void checkNow()}
                  disabled={busy !== null}
                  className="px-3.5 py-2 bg-white border border-slate-100 font-bold text-xs rounded-xl hover:bg-slate-50 cursor-pointer flex items-center gap-1 disabled:opacity-60"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${busy === 'refresh' ? 'animate-spin' : ''}`} />
                  <span>Check now</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => void generateCode()}
                disabled={busy !== null}
                className="px-4 py-2 bg-novora text-white font-bold text-xs rounded-xl hover:bg-opacity-95 cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
              >
                <KeyRound className="h-3.5 w-3.5" />
                <span>{busy === 'code' ? 'Creating…' : expired ? 'Create a new code' : 'Create connection code'}</span>
              </button>
              {expired && (
                <span className="text-[11px] font-semibold text-amber-700">That code expired before it was used.</span>
              )}
            </div>
          )}
        </div>
      )}

      {status?.available && status.connected && (
        <div className="p-5 rounded-2xl border border-slate-100 bg-white space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Connected to Novora CRM</span>
              </div>
              {status.connectedAt && (
                <p className="text-[11px] font-semibold text-slate-400">
                  Since {new Date(status.connectedAt).toLocaleDateString()}
                </p>
              )}
            </div>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wide uppercase">
              Active
            </span>
          </div>

          <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
            {status.pendingEvents === 0
              ? 'All employee changes have been delivered.'
              : `${status.pendingEvents} employee change${status.pendingEvents === 1 ? ' is' : 's are'} waiting to be delivered. Novora CRM may be starting up; delivery is retried automatically.`}
          </p>

          {confirmDisconnect ? (
            <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/60 space-y-3">
              <p className="text-[11px] font-semibold text-slate-700 leading-relaxed">
                Disconnect Novora CRM? Employee changes will stop being sent and undelivered changes are discarded. CRM
                accounts stay as they are. You can reconnect later with a new code.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => void disconnect()}
                  disabled={busy !== null}
                  className="px-3.5 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-700 cursor-pointer disabled:opacity-60"
                >
                  {busy === 'disconnect' ? 'Disconnecting…' : 'Disconnect'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDisconnect(false)}
                  disabled={busy !== null}
                  className="px-3.5 py-2 bg-white border border-slate-100 font-bold text-xs rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => void checkNow()}
                disabled={busy !== null}
                className="px-3.5 py-2 bg-white border border-slate-100 font-bold text-xs rounded-xl hover:bg-slate-50 cursor-pointer flex items-center gap-1 disabled:opacity-60"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${busy === 'refresh' ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                type="button"
                onClick={() => setConfirmDisconnect(true)}
                className="px-3.5 py-2 bg-white border border-rose-100 text-rose-600 font-bold text-xs rounded-xl hover:bg-rose-50 cursor-pointer flex items-center gap-1"
              >
                <Power className="h-3.5 w-3.5" />
                <span>Disconnect</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

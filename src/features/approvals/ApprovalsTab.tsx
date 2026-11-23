'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Check, ClipboardCheck, RefreshCw, X } from 'lucide-react'
import {
  ApiError,
  decideClaim,
  decideLeave,
  decideOvertimeRecord,
  fetchPendingApprovals,
  type ApprovalTask,
} from '@/services'

type Toast = (text: string, type: 'success' | 'info' | 'error' | 'loading') => void

interface ApprovalsTabProps {
  addToast: Toast
}

const KIND_STYLE: Record<string, string> = {
  LEAVE: 'bg-sky-50 text-sky-700 border-sky-100',
  CLAIM: 'bg-amber-50 text-amber-700 border-amber-100',
  OVERTIME: 'bg-violet-50 text-violet-700 border-violet-100',
}

function formatWhen(iso: string | null) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function ApprovalsTab({ addToast }: ApprovalsTabProps) {
  const [tasks, setTasks] = useState<ApprovalTask[]>([])
  const [totalPending, setTotalPending] = useState(0)
  const [busy, setBusy] = useState(false)
  const [kindFilter, setKindFilter] = useState<'ALL' | 'LEAVE' | 'CLAIM' | 'OVERTIME'>('ALL')
  const [decidingId, setDecidingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setBusy(true)
    try {
      const res = await fetchPendingApprovals()
      setTasks(res.tasks ?? [])
      setTotalPending(res.totalPending ?? res.tasks?.length ?? 0)
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Could not load approvals.', 'error')
    } finally {
      setBusy(false)
    }
  }, [addToast])

  useEffect(() => {
    void load()
  }, [load])

  const filtered = useMemo(
    () => (kindFilter === 'ALL' ? tasks : tasks.filter((t) => t.kind === kindFilter)),
    [tasks, kindFilter],
  )

  const counts = useMemo(() => {
    const base = { LEAVE: 0, CLAIM: 0, OVERTIME: 0 }
    for (const t of tasks) {
      if (t.kind in base) base[t.kind as keyof typeof base] += 1
    }
    return base
  }, [tasks])

  const decide = async (task: ApprovalTask, decision: 'APPROVE' | 'REJECT') => {
    setDecidingId(task.id)
    try {
      if (task.kind === 'LEAVE') {
        await decideLeave(task.entityId, {
          decision,
          note: decision === 'REJECT' ? 'Rejected from approvals inbox' : undefined,
        })
      } else if (task.kind === 'CLAIM') {
        await decideClaim(task.entityId, {
          decision,
          note: decision === 'REJECT' ? 'Rejected from approvals inbox' : undefined,
        })
      } else if (task.kind === 'OVERTIME') {
        await decideOvertimeRecord(task.entityId, { decision })
      } else {
        addToast(`Unknown approval kind: ${task.kind}`, 'error')
        return
      }
      setTasks((prev) => prev.filter((t) => t.id !== task.id))
      setTotalPending((n) => Math.max(0, n - 1))
      addToast(
        decision === 'APPROVE'
          ? `Approved ${task.title ?? task.kind.toLowerCase()} for ${task.requestedByName}.`
          : `Rejected ${task.title ?? task.kind.toLowerCase()} for ${task.requestedByName}.`,
        decision === 'APPROVE' ? 'success' : 'info',
      )
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Could not decide approval.', 'error')
    } finally {
      setDecidingId(null)
    }
  }

  return (
    <div className="space-y-5 p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="nv-page-title text-xl">Approvals</h1>
          <p className="text-sm text-slate-500 mt-1">
            Pending leave, claims, and overtime in one inbox.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={busy}
          className="nv-btn-secondary inline-flex items-center gap-2"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${busy ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { key: 'ALL' as const, label: 'All pending', value: totalPending },
          { key: 'LEAVE' as const, label: 'Leave', value: counts.LEAVE },
          { key: 'CLAIM' as const, label: 'Claims', value: counts.CLAIM },
          { key: 'OVERTIME' as const, label: 'Overtime', value: counts.OVERTIME },
        ].map((card) => (
          <button
            key={card.key}
            type="button"
            onClick={() => setKindFilter(card.key)}
            className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
              kindFilter === card.key
                ? 'border-novora/40 bg-novora/5'
                : 'border-slate-200/80 bg-white hover:bg-slate-50'
            }`}
          >
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{card.label}</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1 tabular-nums">{card.value}</p>
          </button>
        ))}
      </div>

      <div className="nv-panel overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <ClipboardCheck className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">Inbox clear</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              No pending {kindFilter === 'ALL' ? 'approvals' : kindFilter.toLowerCase()} right now.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filtered.map((task) => (
              <li
                key={task.id}
                className="flex flex-col lg:flex-row lg:items-center gap-3 px-4 sm:px-5 py-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-md border ${
                        KIND_STYLE[task.kind] ?? 'bg-slate-50 text-slate-600 border-slate-100'
                      }`}
                    >
                      {task.kind}
                    </span>
                    <span className="text-xs text-slate-400">{formatWhen(task.createdAt)}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {task.title ?? task.kind} · {task.requestedByName}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{task.detail ?? '—'}</p>
                  {task.amount != null && task.currency && task.currency !== 'HRS' ? (
                    <p className="text-xs font-semibold text-slate-700 mt-1 tabular-nums">
                      {task.currency} {Number(task.amount).toFixed(2)}
                    </p>
                  ) : null}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={decidingId === task.id}
                    onClick={() => void decide(task, 'REJECT')}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 disabled:opacity-50"
                  >
                    <X className="h-3.5 w-3.5" />
                    Reject
                  </button>
                  <button
                    type="button"
                    disabled={decidingId === task.id}
                    onClick={() => void decide(task, 'APPROVE')}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-novora px-3 py-2 text-xs font-bold text-white hover:bg-novora/90 disabled:opacity-50"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Approve
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  ArrowRight,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  LogIn,
  LogOut,
  RefreshCw,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Umbrella,
  UserPlus,
  Users,
  Zap,
} from 'lucide-react'
import type { Employee, SidebarTab } from '@/types'
import { canManageFullSystem } from '@/lib/roles'
import { DropdownAnchor } from '@/components/ui'
import {
  ApiError,
  checkInAttendance,
  checkOutAttendance,
  fetchAdminAttendanceOverview,
  fetchAdminDashboardSummary,
  fetchAdminDepartments,
  fetchAdminGrowth,
  fetchAdminLeaveRequests,
  fetchAdminOnboardingTasks,
  fetchAdminRecentHires,
  fetchDashboardAiInsights,
  fetchMyAttendance,
  fetchRecruitmentCandidates,
  fetchRecruitmentInterviews,
  fetchRecruitmentJobs,
  fetchRecruitmentOffers,
  fetchMyDashboard,
  type DashboardAttendanceOverview,
  type DashboardDepartmentSlice,
  type DashboardEmployeeRow,
  type DashboardGrowthPoint,
  type OnboardingTaskRow,
  type RecruitmentCandidateRow,
  type RecruitmentInterviewRow,
  type RecruitmentJobRow,
  type RecruitmentOfferRow,
} from '@/services'

interface DashboardTabProps {
  employees: Employee[]
  setActiveSidebarTab: (tab: SidebarTab) => void
  addToast: (text: string, type: 'success' | 'info' | 'error' | 'loading') => void
  roles?: string[]
  userName?: string
}

type TimelineFilter = 'Last 12 months' | 'Last 6 months' | 'Last 3 months' | 'Last 30 days'

const DEPT_COLORS = [
  '#1a6cff',
  '#0ea5e9',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#f43f5e',
  '#14b8a6',
  '#94a3b8',
]

function getGreeting(hour: number) {
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

function formatHeaderDate(d: Date) {
  return d.toLocaleDateString('en-SG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatMonthRange(d: Date) {
  const start = new Date(d.getFullYear(), d.getMonth(), 1)
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0)
  const fmt = (x: Date) =>
    x.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return `${fmt(start)} - ${fmt(end)}`
}

function firstName(name: string) {
  const trimmed = name.trim()
  if (!trimmed) return 'there'
  return trimmed.split(/\s+/)[0]
}

function todayLocalIso() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Backend returns LocalTime as "HH:mm:ss" (not a full ISO datetime). */
function formatPunchClock(value: string | null | undefined) {
  if (!value) return '—'
  const raw = String(value).trim()
  const timeOnly = raw.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/)
  if (timeOnly) {
    const hh = Number(timeOnly[1])
    const mm = Number(timeOnly[2])
    const d = new Date()
    d.setHours(hh, mm, 0, 0)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  const parsed = new Date(raw)
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  return raw
}

function normalizeWorkDate(value: unknown): string {
  if (typeof value === 'string') return value.slice(0, 10)
  if (Array.isArray(value) && value.length >= 3) {
    const [y, m, d] = value
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  }
  return ''
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function growthToTrend(points: DashboardGrowthPoint[]) {
  if (points.length === 0) {
    return { values: [] as number[], labels: [] as string[], minY: 0, maxY: 1 }
  }
  const values = points.map((p) => p.employees)
  const labels = points.map((p) => p.month)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const pad = Math.max(1, Math.round((max - min) * 0.1))
  return {
    values,
    labels,
    minY: Math.max(0, min - pad),
    maxY: max + pad,
  }
}

function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length === 0) return ''
  let d = `M ${pts[0].x},${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i]
    const p1 = pts[i + 1]
    const cp1x = p0.x + (p1.x - p0.x) / 3
    const cp1y = p0.y
    const cp2x = p0.x + (2 * (p1.x - p0.x)) / 3
    const cp2y = p1.y
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y}`
  }
  return d
}

function stageBucket(stage: string): 'applications' | 'screened' | 'interviews' | 'offers' | 'hired' {
  const s = stage.toLowerCase()
  if (/hir|joined|accepted|onboard/.test(s)) return 'hired'
  if (/offer/.test(s)) return 'offers'
  if (/interview|final|tech|culture/.test(s)) return 'interviews'
  if (/screen|review|phone|shortlist/.test(s)) return 'screened'
  return 'applications'
}

function Panel({
  title,
  action,
  children,
  className = '',
}: {
  title: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`nv-card flex flex-col p-5 shadow-sm ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  )
}

function EmptyState({
  message,
  cta,
  onClick,
}: {
  message: string
  cta?: string
  onClick?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
      <p className="max-w-[220px] text-xs leading-relaxed text-slate-400">{message}</p>
      {cta && onClick && (
        <button
          type="button"
          onClick={onClick}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-novora/30 hover:text-novora cursor-pointer"
        >
          {cta}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}

function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-100 ${className}`} />
}

type PunchPhase = 'loading' | 'unavailable' | 'not_started' | 'in' | 'done'

function TodayPunchCard({
  addToast,
  onOpenAttendance,
}: {
  addToast: (text: string, type: 'success' | 'info' | 'error' | 'loading') => void
  onOpenAttendance?: () => void
}) {
  const [phase, setPhase] = useState<PunchPhase>('loading')
  const [checkInTime, setCheckInTime] = useState<string | null>(null)
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [clock, setClock] = useState(() => new Date())
  const [errorHint, setErrorHint] = useState<string | null>(null)

  const applyLog = useCallback((checkIn: string | null | undefined, checkOut: string | null | undefined) => {
    if (checkIn && checkOut) {
      setPhase('done')
      setCheckInTime(formatPunchClock(checkIn))
      setCheckOutTime(formatPunchClock(checkOut))
    } else if (checkIn) {
      setPhase('in')
      setCheckInTime(formatPunchClock(checkIn))
      setCheckOutTime(null)
    } else {
      setPhase('not_started')
      setCheckInTime(null)
      setCheckOutTime(null)
    }
  }, [])

  const refresh = useCallback(async () => {
    try {
      setErrorHint(null)
      const rows = await fetchMyAttendance()
      const today = todayLocalIso()
      const todayUtc = new Date().toISOString().slice(0, 10)
      const openSession = rows.find((r) => r.checkInTime && !r.checkOutTime)
      const todayLog =
        rows.find((r) => {
          const wd = normalizeWorkDate(r.workDate)
          return wd === today || wd === todayUtc
        }) || openSession

      if (todayLog) {
        applyLog(todayLog.checkInTime, todayLog.checkOutTime)
      } else {
        applyLog(null, null)
      }
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Could not load attendance. Is the API running?'
      setErrorHint(message)
      setPhase('unavailable')
    }
  }, [applyLog])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    const id = window.setInterval(() => setClock(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const punchIn = async () => {
    if (busy) return
    setBusy(true)
    addToast('Punching in…', 'loading')
    try {
      const log = await checkInAttendance()
      applyLog(log.checkInTime, log.checkOutTime)
      setErrorHint(null)
      addToast(`Punched in at ${formatPunchClock(log.checkInTime)}.`, 'success')
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Punch in failed.'
      addToast(message, 'error')
      setErrorHint(message)
      await refresh()
    } finally {
      setBusy(false)
    }
  }

  const punchOut = async () => {
    if (busy) return
    setBusy(true)
    addToast('Punching out…', 'loading')
    try {
      const log = await checkOutAttendance()
      applyLog(log.checkInTime, log.checkOutTime)
      setErrorHint(null)
      addToast(`Punched out at ${formatPunchClock(log.checkOutTime)}.`, 'success')
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Punch out failed.'
      addToast(message, 'error')
      setErrorHint(message)
      await refresh()
    } finally {
      setBusy(false)
    }
  }

  const statusLabel =
    phase === 'done'
      ? 'Completed today'
      : phase === 'in'
        ? 'On the clock'
        : phase === 'unavailable'
          ? 'Unavailable'
          : phase === 'loading'
            ? 'Loading…'
            : 'Not punched in'

  const statusClass =
    phase === 'done'
      ? 'bg-slate-100 text-slate-600'
      : phase === 'in'
        ? 'bg-emerald-50 text-emerald-700'
        : 'bg-amber-50 text-amber-700'

  if (phase === 'unavailable') {
    return (
      <section className="nv-card p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
              <Clock className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-800">Punch In / Out</p>
              <p className="text-xs text-slate-500">
                {errorHint || 'Could not load your attendance session.'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void refresh()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-novora/30 hover:text-novora cursor-pointer"
            >
              Retry
            </button>
            {onOpenAttendance && (
              <button
                type="button"
                onClick={onOpenAttendance}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-novora/30 hover:text-novora cursor-pointer"
              >
                Open attendance
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="nv-card p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <span
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
              phase === 'in' ? 'bg-emerald-50 text-emerald-600' : 'bg-novora/10 text-novora'
            }`}
          >
            <Clock className="h-5 w-5" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-800">Today&apos;s attendance</h3>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusClass}`}>
                {statusLabel}
              </span>
            </div>
            <p className="mt-1 font-mono text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
              {clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
            <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
              <span>
                In{' '}
                <strong className="font-semibold text-slate-800">{checkInTime || '—'}</strong>
              </span>
              <span>
                Out{' '}
                <strong className="font-semibold text-slate-800">{checkOutTime || '—'}</strong>
              </span>
            </div>
            {errorHint && <p className="mt-2 text-[11px] font-medium text-rose-600">{errorHint}</p>}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {phase === 'loading' ? (
            <SkeletonBlock className="h-11 w-36" />
          ) : phase === 'not_started' ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => void punchIn()}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-novora px-5 text-xs font-bold text-white shadow-sm hover:opacity-95 disabled:opacity-60 cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              Punch In
            </button>
          ) : phase === 'in' ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => void punchOut()}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-5 text-xs font-bold text-rose-600 hover:bg-rose-100 disabled:opacity-60 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Punch Out
            </button>
          ) : (
            <span className="inline-flex h-11 items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Day complete
            </span>
          )}
          {onOpenAttendance && (
            <button
              type="button"
              onClick={onOpenAttendance}
              className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 hover:border-novora/30 hover:text-novora cursor-pointer"
            >
              Details
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

function KpiCard({
  label,
  value,
  trend,
  trendUp,
  icon: Icon,
  iconClass,
}: {
  label: string
  value: string
  trend?: string
  trendUp?: boolean
  icon: typeof Users
  iconClass: string
}) {
  return (
    <div className="nv-stat-card flex items-start gap-4">
      <span className={`nv-stat-icon shrink-0 ${iconClass}`}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
        {trend && (
          <p
            className={`mt-1.5 inline-flex items-center gap-0.5 text-[11px] font-semibold ${
              trendUp ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend}
            {!/vs/i.test(trend) && <span className="font-medium text-slate-400"> vs last month</span>}
          </p>
        )}
      </div>
    </div>
  )
}

function HiringFunnel({
  stages,
}: {
  stages: { label: string; count: number }[]
}) {
  const max = Math.max(...stages.map((s) => s.count), 1)
  return (
    <div className="flex flex-col justify-center gap-3 py-1">
      {stages.map((stage, idx) => {
        const width = Math.max(28, Math.round((stage.count / max) * 100))
        const opacity = 1 - idx * 0.12
        return (
          <div key={stage.label} className="flex items-center gap-3">
            <div className="relative h-9 flex-1 overflow-hidden rounded-xl bg-slate-50">
              <div
                className="flex h-full items-center rounded-xl px-3 transition-all duration-500"
                style={{
                  width: `${width}%`,
                  background: `linear-gradient(90deg, color-mix(in srgb, var(--color-novora) ${Math.round(opacity * 100)}%, white), color-mix(in srgb, #0ea5e9 ${Math.round(opacity * 70)}%, white))`,
                }}
              >
                <span className="truncate text-xs font-semibold text-white drop-shadow-sm">
                  {stage.label}
                </span>
              </div>
            </div>
            <span className="w-12 shrink-0 text-right text-sm font-bold tabular-nums text-slate-800">
              {stage.count.toLocaleString()}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function MultiDonut({
  segments,
  centerLabel,
  centerValue,
  size = 140,
}: {
  segments: { label: string; value: number; color: string }[]
  centerLabel: string
  centerValue: string
  size?: number
}) {
  const total = segments.reduce((s, x) => s + Math.max(0, x.value), 0)
  const radius = 42
  const circumference = 2 * Math.PI * radius
  let offset = 0

  if (total <= 0) {
    return (
      <div className="relative mx-auto flex items-center justify-center" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="10" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-lg font-bold text-slate-800">—</span>
          <span className="text-[10px] font-medium text-slate-400">{centerLabel}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative mx-auto flex items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="10" />
        {segments.map((seg) => {
          const len = (Math.max(0, seg.value) / total) * circumference
          const dash = `${len} ${circumference - len}`
          const el = (
            <circle
              key={seg.label}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth="10"
              strokeDasharray={dash}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          )
          offset += len
          return el
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xl font-bold tracking-tight text-slate-900">{centerValue}</span>
        <span className="text-[10px] font-medium text-slate-400">{centerLabel}</span>
      </div>
    </div>
  )
}

function WorkforceTrendChart({
  growth,
  filter,
  onFilterChange,
}: {
  growth: DashboardGrowthPoint[]
  filter: TimelineFilter
  onFilterChange: (f: TimelineFilter) => void
}) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState<{ x: number; y: number; value: number; label: string } | null>(
    null,
  )

  const trendData = useMemo(() => {
    const months =
      filter === 'Last 3 months' ? 3 : filter === 'Last 6 months' ? 6 : filter === 'Last 30 days' ? 1 : 12
    const sliced = growth.length > 0 ? growth.slice(-Math.max(months, 1)) : []
    return growthToTrend(sliced)
  }, [filter, growth])

  const growthPct = useMemo(() => {
    if (trendData.values.length < 2) return null
    const first = trendData.values[0]
    const last = trendData.values[trendData.values.length - 1]
    if (first <= 0) return null
    return Math.round(((last - first) / first) * 1000) / 10
  }, [trendData.values])

  const chartWidth = 720
  const chartHeight = 200
  const padL = 36
  const padR = 16
  const padT = 16
  const padB = 28
  const w = chartWidth - padL - padR
  const h = chartHeight - padT - padB

  const points = trendData.values.map((v, idx) => {
    const x = padL + (w / Math.max(trendData.values.length - 1, 1)) * idx
    const fraction = (v - trendData.minY) / Math.max(trendData.maxY - trendData.minY, 1)
    const y = padT + h * (1 - fraction)
    return { x, y, value: v, label: trendData.labels[idx] }
  })

  const line = smoothPath(points)
  const area =
    points.length > 0
      ? `${line} L ${points[points.length - 1].x},${padT + h} L ${points[0].x},${padT + h} Z`
      : ''

  return (
    <Panel
      title="Workforce Analytics"
      action={
        <DropdownAnchor open={open} onClose={() => setOpen(false)} align="right">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            {filter}
            <ChevronDown className="nv-chevron-down nv-chevron-down--sm" />
          </button>
          {open && (
            <div className="nv-dropdown-menu w-40 overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-lg">
              {(['Last 12 months', 'Last 6 months', 'Last 3 months', 'Last 30 days'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onFilterChange(opt)
                    setOpen(false)
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-novora cursor-pointer"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </DropdownAnchor>
      }
    >
      {growthPct != null && (
        <p className="-mt-2 mb-3 text-xs font-semibold text-emerald-600">
          {growthPct >= 0 ? '+' : ''}
          {growthPct}% Employee Growth vs previous period
        </p>
      )}
      {points.length === 0 ? (
        <p className="py-12 text-center text-xs text-slate-400">No growth data from the API yet.</p>
      ) : (
        <div className="relative h-52">
          {hovered && (
            <div
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg bg-slate-900 px-2.5 py-1.5 text-[10px] font-medium text-white shadow-lg"
              style={{ left: hovered.x, top: hovered.y - 8 }}
            >
              <div className="font-bold">{hovered.value.toLocaleString()}</div>
              <div className="text-blue-200">{hovered.label}</div>
            </div>
          )}
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-full w-full">
            <defs>
              <linearGradient id="dash-area-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1a6cff" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#1a6cff" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 0.5, 1].map((ratio) => {
              const y = padT + h * ratio
              return (
                <line
                  key={ratio}
                  x1={padL}
                  y1={y}
                  x2={chartWidth - padR}
                  y2={y}
                  className="stroke-slate-100"
                  strokeDasharray="4 4"
                />
              )
            })}
            {area && <path d={area} fill="url(#dash-area-fill)" />}
            {line && (
              <path d={line} fill="none" stroke="#1a6cff" strokeWidth="2.5" strokeLinecap="round" />
            )}
            {points.map((p, idx) => (
              <g key={idx}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={12}
                  className="fill-transparent cursor-pointer"
                  onMouseEnter={() => setHovered(p)}
                  onMouseLeave={() => setHovered(null)}
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hovered?.value === p.value && hovered?.label === p.label ? 5 : 3}
                  className="fill-white stroke-[#1a6cff] stroke-2"
                />
                <text
                  x={p.x}
                  y={chartHeight - 6}
                  textAnchor="middle"
                  className="fill-slate-400 text-[9px] font-medium"
                >
                  {p.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      )}
    </Panel>
  )
}

export default function DashboardTab({
  employees,
  setActiveSidebarTab,
  addToast,
  roles = [],
  userName = '',
}: DashboardTabProps) {
  const [now, setNow] = useState(() => new Date())
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>('Last 6 months')
  const isAdmin = canManageFullSystem(roles)
  const headcount = employees.length > 0 ? employees.length.toLocaleString() : '—'

  const [loading, setLoading] = useState(true)
  const [kpiMap, setKpiMap] = useState<Record<string, { value: string; delta: string }>>({})
  const [liveHires, setLiveHires] = useState<DashboardEmployeeRow[] | null>(null)
  const [liveAttendance, setLiveAttendance] = useState<DashboardAttendanceOverview | null>(null)
  const [liveGrowth, setLiveGrowth] = useState<DashboardGrowthPoint[]>([])
  const [departments, setDepartments] = useState<DashboardDepartmentSlice[]>([])
  const [candidates, setCandidates] = useState<RecruitmentCandidateRow[]>([])
  const [interviews, setInterviews] = useState<RecruitmentInterviewRow[]>([])
  const [jobs, setJobs] = useState<RecruitmentJobRow[]>([])
  const [offers, setOffers] = useState<RecruitmentOfferRow[]>([])
  const [onboardingTasks, setOnboardingTasks] = useState<OnboardingTaskRow[]>([])
  const [pendingLeaveCount, setPendingLeaveCount] = useState(0)
  const [aiInsights, setAiInsights] = useState<string[]>([])
  const [aiDisclaimer, setAiDisclaimer] = useState('')
  const [aiSource, setAiSource] = useState('')
  const [aiBusy, setAiBusy] = useState(false)

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    ;(async () => {
      try {
        if (isAdmin) {
          const [
            summary,
            hires,
            attendance,
            growth,
            depts,
            cand,
            ints,
            jobRows,
            offerRows,
            onboard,
            leaveRows,
          ] = await Promise.all([
            fetchAdminDashboardSummary(),
            fetchAdminRecentHires(5),
            fetchAdminAttendanceOverview(),
            fetchAdminGrowth(12).catch(() => [] as DashboardGrowthPoint[]),
            fetchAdminDepartments().catch(() => [] as DashboardDepartmentSlice[]),
            fetchRecruitmentCandidates().catch(() => [] as RecruitmentCandidateRow[]),
            fetchRecruitmentInterviews().catch(() => [] as RecruitmentInterviewRow[]),
            fetchRecruitmentJobs().catch(() => [] as RecruitmentJobRow[]),
            fetchRecruitmentOffers().catch(() => [] as RecruitmentOfferRow[]),
            fetchAdminOnboardingTasks().catch(() => [] as OnboardingTaskRow[]),
            fetchAdminLeaveRequests(20).catch(() => []),
          ])
          if (cancelled) return
          const next: Record<string, { value: string; delta: string }> = {}
          for (const k of summary.kpis ?? []) {
            next[k.label.toLowerCase()] = { value: k.value, delta: k.delta }
          }
          setKpiMap(next)
          setLiveHires(hires)
          setLiveAttendance(attendance)
          setLiveGrowth(growth)
          setDepartments(depts)
          setCandidates(cand)
          setInterviews(ints)
          setJobs(jobRows)
          setOffers(offerRows)
          setOnboardingTasks(onboard)
          setPendingLeaveCount(leaveRows.filter((r) => /pending/i.test(r.status)).length)
        } else {
          const mine = await fetchMyDashboard()
          if (cancelled) return
          const next: Record<string, { value: string; delta: string }> = {}
          for (const k of mine.kpis ?? []) {
            next[k.label.toLowerCase()] = { value: k.value, delta: k.delta }
          }
          setKpiMap(next)
          setLiveAttendance(mine.attendanceOverview ?? null)
          setLiveGrowth(mine.growth ?? [])
          setDepartments(mine.departments ?? [])
        }
      } catch {
        // Leave panels empty when APIs fail — never seed demo people.
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [isAdmin])

  const findKpi = (needle: string) => {
    const key = Object.keys(kpiMap).find((k) => k.includes(needle))
    return key ? kpiMap[key] : undefined
  }

  const goTo = (tab: SidebarTab, message?: string) => {
    setActiveSidebarTab(tab)
    if (message) addToast(message, 'info')
  }

  const openRolesCount = useMemo(() => {
    // Prefer summary KPI (now computed from open job openings server-side).
    const fromKpi = findKpi('position')?.value || findKpi('open positions')?.value
    if (fromKpi && fromKpi !== '—') return fromKpi
    const openJobs = jobs.filter((j) => /^open$/i.test(j.status) || j.published)
    if (openJobs.length === 0) return '0'
    return String(openJobs.reduce((sum, j) => sum + (j.openings ?? 1), 0))
  }, [jobs, kpiMap])

  const funnelStages = useMemo(() => {
    const counts = { applications: 0, screened: 0, interviews: 0, offers: 0, hired: 0 }
    for (const c of candidates) {
      counts[stageBucket(c.stage)] += 1
    }
    // Cumulative-style funnel: each stage includes people who reached at least that stage
    const hired = counts.hired
    const offerN = counts.offers + hired + offers.length
    const interviewN = counts.interviews + offerN
    const screenedN = counts.screened + interviewN
    const apps = Math.max(candidates.length, screenedN)
    return [
      { label: 'Applications', count: apps },
      { label: 'Screened', count: screenedN },
      { label: 'Interviews', count: interviewN },
      { label: 'Offers', count: offerN },
      { label: 'Hired', count: hired || (liveHires?.length ?? 0) },
    ]
  }, [candidates, offers, liveHires])

  const attendanceRateValue = liveAttendance?.attendanceRate ?? 0
  const attendanceRate = liveAttendance ? `${attendanceRateValue.toFixed(0)}%` : '—'
  const attendanceBuckets = liveAttendance?.buckets?.length
    ? liveAttendance.buckets
    : [
        { label: 'Present', count: 0 },
        { label: 'Late', count: 0 },
        { label: 'Absent', count: 0 },
      ]

  const attendanceSegments = useMemo(() => {
    const colorFor = (label: string) => {
      if (/present/i.test(label)) return '#10b981'
      if (/late/i.test(label)) return '#f59e0b'
      if (/absent/i.test(label)) return '#f43f5e'
      return '#94a3b8'
    }
    const preferred = ['Present', 'Late', 'Absent']
    const byLabel = new Map(attendanceBuckets.map((b) => [b.label.toLowerCase(), b.count]))
    const rows = preferred.map((label) => ({
      label,
      value: byLabel.get(label.toLowerCase()) ?? 0,
      color: colorFor(label),
    }))
    const total = rows.reduce((s, b) => s + b.value, 0)
    // When logs exist, show real % split. When only a rate exists, show present vs remainder.
    if (total <= 0 && liveAttendance && attendanceRateValue > 0) {
      const present = Math.round(attendanceRateValue)
      return [
        { label: 'Present', value: present, color: '#10b981', pct: present },
        { label: 'Other', value: Math.max(0, 100 - present), color: '#94a3b8', pct: Math.max(0, 100 - present) },
      ]
    }
    return rows.map((b) => ({
      ...b,
      pct: total > 0 ? Math.round((b.value / total) * 100) : 0,
    }))
  }, [attendanceBuckets, attendanceRateValue, liveAttendance])

  const engagementScore = useMemo(() => {
    if (!liveAttendance) return findKpi('engagement')?.value || '—'
    return (Math.max(0, Math.min(100, attendanceRateValue)) / 10).toFixed(1)
  }, [liveAttendance, attendanceRateValue, kpiMap])

  const upcomingInterviews = useMemo(() => {
    const nowTs = Date.now()
    return [...interviews]
      .filter((i) => {
        const t = Date.parse(i.scheduledAt)
        return Number.isFinite(t) ? t >= nowTs - 86400000 : true
      })
      .sort((a, b) => Date.parse(a.scheduledAt) - Date.parse(b.scheduledAt))
      .slice(0, 4)
      .map((i) => {
        const when = (() => {
          const t = Date.parse(i.scheduledAt)
          if (!Number.isFinite(t)) return i.scheduledAt
          return new Date(t).toLocaleString('en-SG', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })
        })()
        const cand = candidates.find((c) => c.id === i.candidateId)
        const statusLabel = /screen/i.test(i.round || i.status) ? 'Screening' : 'Interview'
        return {
          id: i.id,
          name: i.candidateName,
          role: cand?.jobTitle || i.round || 'Candidate',
          when,
          status: statusLabel as 'Interview' | 'Screening',
        }
      })
  }, [interviews, candidates])

  const onboardingRows = useMemo(() => {
    const byEmp = new Map<
      string,
      { name: string; role: string; done: number; total: number }
    >()
    for (const t of onboardingTasks) {
      const cur = byEmp.get(t.employeeId) || {
        name: t.employeeName,
        role: t.title,
        done: 0,
        total: 0,
      }
      cur.total += 1
      if (/complete|done|closed/i.test(t.status) || t.completedAt) cur.done += 1
      byEmp.set(t.employeeId, cur)
    }
    return [...byEmp.values()]
      .map((r) => ({
        name: r.name,
        role: r.role,
        pct: r.total > 0 ? Math.round((r.done / r.total) * 100) : 0,
      }))
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 4)
  }, [onboardingTasks])

  const deptSegments = useMemo(() => {
    const top = departments.slice(0, 7)
    const rest = departments.slice(7)
    const slices = top.map((d, i) => ({
      label: d.name,
      value: d.count,
      percent: d.percent,
      color: DEPT_COLORS[i % DEPT_COLORS.length],
    }))
    if (rest.length > 0) {
      slices.push({
        label: 'Others',
        value: rest.reduce((s, d) => s + d.count, 0),
        percent: rest.reduce((s, d) => s + d.percent, 0),
        color: DEPT_COLORS[7],
      })
    }
    return slices
  }, [departments])

  const deptTotal = deptSegments.reduce((s, d) => s + d.value, 0)

  const loadAiInsights = useCallback(
    async (opts?: { notify?: boolean }) => {
      if (!isAdmin) return
      setAiBusy(true)
      try {
        const openRolesNum = Number(String(openRolesCount).replace(/,/g, ''))
        const result = await fetchDashboardAiInsights({
          kpis: Object.entries(kpiMap).slice(0, 6).map(([label, v]) => ({
            label,
            value: v.value,
            delta: v.delta,
          })),
          attendanceRate: liveAttendance?.attendanceRate ?? null,
          openRoles: Number.isFinite(openRolesNum) ? openRolesNum : null,
          pendingLeave: pendingLeaveCount,
          upcomingInterviews: upcomingInterviews.length,
          onboardingIncomplete: onboardingRows.filter((r) => r.pct < 100).length,
        })
        setAiInsights(result.insights ?? [])
        setAiDisclaimer(result.disclaimer ?? '')
        setAiSource(result.source ?? '')
      } catch (err) {
        setAiInsights([])
        setAiDisclaimer('')
        setAiSource('')
        if (opts?.notify) {
          addToast(err instanceof ApiError ? err.message : 'Could not load AI insights.', 'error')
        }
      } finally {
        setAiBusy(false)
      }
    },
    [
      isAdmin,
      kpiMap,
      liveAttendance,
      openRolesCount,
      pendingLeaveCount,
      upcomingInterviews.length,
      onboardingRows,
      addToast,
    ],
  )

  useEffect(() => {
    if (!isAdmin || loading) return
    // Defer Gemini so the dashboard shell paints before AI round-trip.
    const timer = window.setTimeout(() => {
      void loadAiInsights()
    }, 400)
    return () => window.clearTimeout(timer)
    // One-shot after initial dashboard load; use Refresh for updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, loading])

  if (!isAdmin) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <header className="nv-dash-hero flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">
              {formatHeaderDate(now)}
            </p>
            <h1 className="mt-2 font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
              {getGreeting(now.getHours())}, {firstName(userName)}
            </h1>
            <p className="mt-1.5 text-sm text-white/60">Here&apos;s your workspace at a glance.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => goTo('Attendance Management')}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-900 shadow-sm hover:bg-white/95 cursor-pointer"
            >
              <LogIn className="h-3.5 w-3.5" />
              Go to attendance
            </button>
            <button
              type="button"
              onClick={() => goTo('Leave Management')}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/15 cursor-pointer"
            >
              Apply for leave
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 nv-stagger">
          <KpiCard
            label="Leave balance"
            value={findKpi('leave')?.value || '—'}
            icon={Umbrella}
            iconClass="!bg-sky-50 !text-sky-600"
          />
          <KpiCard
            label="Attendance this month"
            value={
              findKpi('attendance')?.value ||
              (liveAttendance ? `${liveAttendance.attendanceRate.toFixed(0)}%` : '—')
            }
            icon={CheckCircle2}
            iconClass=""
          />
          <KpiCard
            label="Pending claims"
            value={findKpi('claim')?.value || '—'}
            icon={FileText}
            iconClass="!bg-amber-50 !text-amber-600"
          />
        </div>

        <TodayPunchCard
          addToast={addToast}
          onOpenAttendance={() => goTo('Attendance Management', 'Opening attendance…')}
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Panel title="Upcoming" className="lg:col-span-12">
            <ul className="grid gap-3 sm:grid-cols-3">
              {[
                { title: 'Public holiday — National Day', date: '9 Aug', icon: Calendar },
                { title: 'Team stand-up', date: 'Tomorrow, 10:00', icon: Users },
                { title: 'Performance review window opens', date: '15 Jun', icon: CheckCircle2 },
              ].map((item) => (
                <li
                  key={item.title}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-3 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                      <item.icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium text-slate-700">{item.title}</span>
                  </div>
                  <span className="shrink-0 text-xs font-medium text-slate-400">{item.date}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel
          title="Quick links"
          action={
            <button
              type="button"
              onClick={() => goTo('Helpdesk & Inquiries Management')}
              className="text-xs font-semibold text-novora hover:underline cursor-pointer"
            >
              Helpdesk
            </button>
          }
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Claims', tab: 'Claims Management' as SidebarTab },
              { label: 'Benefits', tab: 'Benefits Management' as SidebarTab },
              { label: 'Learning', tab: 'Learning Management' as SidebarTab },
              { label: 'Assets', tab: 'Assets Management' as SidebarTab },
            ].map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => goTo(link.tab)}
                className="rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-3 text-left text-sm font-semibold text-slate-700 hover:border-novora/20 hover:bg-white cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>
        </Panel>
      </div>
    )
  }

  if (isAdmin && loading) {
    return (
      <div className="space-y-5 animate-in fade-in duration-300">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <SkeletonBlock className="h-8 w-72" />
            <SkeletonBlock className="h-4 w-56" />
          </div>
          <SkeletonBlock className="h-10 w-52" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <SkeletonBlock key={i} className="h-28" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <SkeletonBlock key={i} className="h-56" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SkeletonBlock className="h-52" />
          <SkeletonBlock className="h-52" />
        </div>
        <SkeletonBlock className="h-64" />
      </div>
    )
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Light welcome header — matches TikTok overview composition */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 md:text-[1.75rem]">
            {getGreeting(now.getHours())}, Here&apos;s your HR overview
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Live snapshot for {firstName(userName)} · {formatHeaderDate(now)}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 cursor-pointer"
        >
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          {formatMonthRange(now)}
          <ChevronDown className="nv-chevron-down nv-chevron-down--sm" />
        </button>
      </header>

      <TodayPunchCard
        addToast={addToast}
        onOpenAttendance={() => goTo('Attendance Management')}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 nv-stagger">
        <KpiCard
          label="Total Employees"
          value={findKpi('employee')?.value || headcount}
          trend={findKpi('employee')?.delta || undefined}
          trendUp={!findKpi('employee')?.delta?.trim().startsWith('-')}
          icon={Users}
          iconClass=""
        />
        <KpiCard
          label="Open Roles"
          value={openRolesCount}
          trend={
            findKpi('position')?.delta && findKpi('position')?.delta !== '—'
              ? findKpi('position')?.delta
              : undefined
          }
          trendUp={!(findKpi('position')?.delta || '').trim().startsWith('-')}
          icon={Briefcase}
          iconClass="!bg-orange-50 !text-orange-600"
        />
        <KpiCard
          label="New Hires"
          value={findKpi('hire')?.value || findKpi('new')?.value || String(liveHires?.length ?? '—')}
          trend={findKpi('hire')?.delta || findKpi('new')?.delta || undefined}
          trendUp={!(findKpi('hire')?.delta || findKpi('new')?.delta || '').trim().startsWith('-')}
          icon={UserPlus}
          iconClass="!bg-sky-50 !text-sky-600"
        />
        <KpiCard
          label="Engagement Score"
          value={engagementScore}
          trend={
            liveAttendance && engagementScore !== '—'
              ? `Based on ${attendanceRate} present`
              : undefined
          }
          trendUp
          icon={Zap}
          iconClass="!bg-violet-50 !text-violet-600"
        />
      </div>

      <Panel
        title="AI insights"
        action={
          <button
            type="button"
            disabled={aiBusy}
            onClick={() => void loadAiInsights({ notify: true })}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-novora hover:underline cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${aiBusy ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        }
        className="nv-ai-panel"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-novora/10 text-novora">
            <Sparkles className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            {aiBusy && aiInsights.length === 0 ? (
              <p className="text-xs text-slate-400">Generating insights from live HR metrics…</p>
            ) : aiInsights.length === 0 ? (
              <p className="text-xs text-slate-400">No insights yet — refresh after data loads.</p>
            ) : (
              <ul className="space-y-2.5">
                {aiInsights.map((line, idx) => (
                  <li
                    key={`${idx}-${line.slice(0, 24)}`}
                    className="flex gap-2 text-sm text-slate-700 animate-soft-fade-up"
                    style={{ animationDelay: `${idx * 80}ms` }}
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-novora" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            )}
            {(aiDisclaimer || aiSource) && (
              <p className="mt-3 text-[10px] font-medium text-slate-400">
                {aiDisclaimer}
                {aiSource ? ` · Source: ${aiSource}` : ''}
              </p>
            )}
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel
          title="Hiring Funnel"
          action={
            <button
              type="button"
              onClick={() => goTo('Recruitment Management')}
              className="text-xs font-semibold text-novora hover:underline cursor-pointer"
            >
              View all
            </button>
          }
        >
          {candidates.length === 0 && offers.length === 0 ? (
            <EmptyState
              message="No candidates in the pipeline yet. Post a role to start hiring."
              cta="Post a job"
              onClick={() => goTo('Recruitment Management', 'Opening recruitment…')}
            />
          ) : (
            <HiringFunnel stages={funnelStages} />
          )}
        </Panel>

        <Panel
          title="Attendance Summary"
          action={
            <button
              type="button"
              onClick={() => goTo('Attendance Management')}
              className="text-xs font-semibold text-novora hover:underline cursor-pointer"
            >
              Details
            </button>
          }
        >
          {!liveAttendance ||
          (attendanceSegments.every((s) => s.value === 0) && attendanceRateValue <= 0) ? (
            <EmptyState
              message="No attendance logs this month yet."
              cta="Open attendance"
              onClick={() => goTo('Attendance Management')}
            />
          ) : (
            <div className="flex flex-col items-center gap-4">
              <MultiDonut
                segments={attendanceSegments.map((s) => ({
                  label: s.label,
                  value: s.value,
                  color: s.color,
                }))}
                centerValue={attendanceRate}
                centerLabel="Present Rate"
              />
              <div className="flex flex-wrap justify-center gap-2">
                {attendanceSegments.map((s) => (
                  <span
                    key={s.label}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                  >
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.pct}% {s.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Panel>

        <Panel
          title="Employees by Department"
          action={
            <button
              type="button"
              onClick={() => goTo('Employees Management')}
              className="text-xs font-semibold text-novora hover:underline cursor-pointer"
            >
              Directory
            </button>
          }
        >
          {deptSegments.length === 0 ? (
            <EmptyState
              message="Assign departments to employees to see this breakdown."
              cta="Open directory"
              onClick={() => goTo('Employees Management')}
            />
          ) : (
            <div className="flex items-center gap-4">
              <MultiDonut
                segments={deptSegments}
                centerValue={String(deptTotal || findKpi('employee')?.value || '—')}
                centerLabel="Total"
                size={120}
              />
              <ul className="min-w-0 flex-1 space-y-1.5">
                {deptSegments.map((d) => (
                  <li key={d.label} className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="flex min-w-0 items-center gap-1.5 text-slate-600">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: d.color }}
                      />
                      <span className="truncate">{d.label}</span>
                    </span>
                    <span className="shrink-0 font-semibold tabular-nums text-slate-800">
                      {Math.round(d.percent)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel
          title="Upcoming Interviews"
          action={
            <button
              type="button"
              onClick={() => goTo('Recruitment Management')}
              className="text-xs font-semibold text-novora hover:underline cursor-pointer"
            >
              Schedule
            </button>
          }
        >
          {upcomingInterviews.length === 0 ? (
            <EmptyState
              message="No interviews scheduled. Add candidates and book a round."
              cta="Schedule interview"
              onClick={() => goTo('Recruitment Management', 'Opening recruitment…')}
            />
          ) : (
            <ul className="divide-y divide-slate-100">
              {upcomingInterviews.map((row) => (
                <li key={row.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-novora/10 text-[11px] font-bold text-novora">
                    {initials(row.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">{row.name}</p>
                    <p className="truncate text-xs text-slate-500">
                      {row.role} · {row.when}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${
                      row.status === 'Interview'
                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
                        : 'bg-sky-50 text-sky-700 ring-sky-100'
                    }`}
                  >
                    {row.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Onboarding Tracker"
          action={
            <button
              type="button"
              onClick={() => goTo('On/Off-boarding Management')}
              className="text-xs font-semibold text-novora hover:underline cursor-pointer"
            >
              Open
            </button>
          }
        >
          {onboardingRows.length === 0 ? (
            <EmptyState
              message="No onboarding checklists yet. Create tasks for new hires."
              cta="Set up onboarding"
              onClick={() => goTo('On/Off-boarding Management')}
            />
          ) : (
            <ul className="space-y-4">
              {onboardingRows.map((row) => {
                const barColor =
                  row.pct >= 70 ? '#10b981' : row.pct >= 40 ? '#f59e0b' : '#f43f5e'
                return (
                  <li key={row.name}>
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">{row.name}</p>
                        <p className="truncate text-xs text-slate-500">{row.role}</p>
                      </div>
                      <span className="shrink-0 text-xs font-bold tabular-nums text-slate-700">
                        {row.pct}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(row.pct, 4)}%`, backgroundColor: barColor }}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </Panel>
      </div>

      <WorkforceTrendChart
        growth={liveGrowth}
        filter={timelineFilter}
        onFilterChange={setTimelineFilter}
      />
    </div>
  )
}

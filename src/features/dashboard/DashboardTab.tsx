import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  ArrowRightLeft,
  Briefcase,
  CalendarCheck,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Coins,
  LogIn,
  LogOut,
  RefreshCw,
  Sparkles,
  Umbrella,
  UserPlus,
  Users,
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
  fetchAdminGrowth,
  fetchAdminLeaveRequests,
  fetchAdminPayrollSummary,
  fetchAdminRecentHires,
  fetchDashboardAiInsights,
  fetchMyAttendance,
  fetchMyDashboard,
  type DashboardAttendanceOverview,
  type DashboardEmployeeRow,
  type DashboardGrowthPoint,
  type DashboardLeaveRequestRow,
  type PayrollSlice,
} from '@/services'

interface DashboardTabProps {
  employees: Employee[]
  setActiveSidebarTab: (tab: SidebarTab) => void
  addToast: (text: string, type: 'success' | 'info' | 'error' | 'loading') => void
  roles?: string[]
  userName?: string
}

type TimelineFilter = 'Last 12 months' | 'Last 6 months' | 'Last 3 months'
type Toast = DashboardTabProps['addToast']
type KpiEntry = { value: string; delta: string }

const AVATAR_COLORS = [
  'bg-indigo-100/80 text-indigo-700',
  'bg-emerald-100/80 text-emerald-700',
  'bg-teal-100/80 text-teal-700',
  'bg-orange-100/80 text-orange-700',
  'bg-pink-100/80 text-pink-700',
]

const PAYROLL_COLORS = ['#2f66e0', '#0d9488', '#818cf8', '#f59e0b', '#94a3b8']

const ATTENDANCE_COLORS: Record<string, string> = {
  present: '#2f66e0',
  absent: '#cbd5e1',
  late: '#f59e0b',
  'on leave': '#818cf8',
}

function todayLocalIso() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Backend returns LocalTime as "HH:mm:ss" (not a full ISO datetime). */
function parsePunch(value: string | null | undefined): Date | null {
  if (!value) return null
  const raw = String(value).trim()
  const timeOnly = raw.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/)
  if (timeOnly) {
    const d = new Date()
    d.setHours(Number(timeOnly[1]), Number(timeOnly[2]), Number(timeOnly[3] ?? 0), 0)
    return d
  }
  const parsed = new Date(raw)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function formatPunch(value: string | null | undefined) {
  const d = parsePunch(value)
  if (!d) return '--:--'
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
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

function digitalTime(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function calendarDate(d: Date) {
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length === 0) return ''
  let d = `M ${pts[0].x},${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i]
    const p1 = pts[i + 1]
    d += ` C ${p0.x + (p1.x - p0.x) / 3},${p0.y} ${p0.x + (2 * (p1.x - p0.x)) / 3},${p1.y} ${p1.x},${p1.y}`
  }
  return d
}

function isPercentDelta(delta: string | undefined) {
  return !!delta && /^[+-]?\d/.test(delta.trim())
}

function statusBadge(status: string) {
  if (/approv/i.test(status)) return 'bg-[#dcfce7] text-[#15803d]'
  if (/reject|cancel/i.test(status)) return 'bg-[#fee2e2] text-[#b91c1c]'
  return 'bg-[#fef3c7] text-[#d97706]'
}

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`nv-card rounded-3xl p-6 flex flex-col justify-between ${className}`}>{children}</div>
  )
}

function CardHeader({
  title,
  live,
  action,
}: {
  title: string
  live?: boolean
  action?: { label: string; onClick: () => void }
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-50 pb-3">
      <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">{title}</h3>
      {live && (
        <span className="flex items-center gap-1 rounded-full border border-emerald-100/30 bg-emerald-50 px-2 py-0.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600">Live</span>
        </span>
      )}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="flex cursor-pointer items-center gap-0.5 text-[9.5px] font-black uppercase text-novora hover:underline"
        >
          <span>{action.label}</span>
          <ChevronRight className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}

function EmptyNote({ children }: { children: ReactNode }) {
  return <p className="flex flex-1 items-center justify-center py-8 text-center text-[11px] font-medium text-slate-400">{children}</p>
}

function StatCard({
  title,
  value,
  delta,
  icon: Icon,
  colorClass,
}: {
  title: string
  value: string
  delta?: string
  icon: typeof Users
  colorClass: string
}) {
  const pct = isPercentDelta(delta)
  const up = pct && !delta!.trim().startsWith('-')
  return (
    <div className="nv-stat-card !rounded-2xl !p-5 flex flex-col justify-between">
      <span className={`flex w-fit items-center justify-center rounded-xl p-2.5 ${colorClass}`}>
        <Icon className="h-5 w-5 shrink-0" />
      </span>
      <div className="mt-4">
        <span className="block text-[26px] font-black leading-none tracking-tight text-slate-800">{value}</span>
        <span className="mt-1.5 block text-[9.5px] font-black uppercase tracking-wider text-slate-400">{title}</span>
        {delta && delta !== '—' && (
          <div className="mt-1.5 flex items-center gap-1.5 text-[10.5px] font-bold">
            {pct ? (
              <>
                <span className={`font-extrabold ${up ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {up ? '↑' : '↓'} {delta.replace(/^[+-]/, '')}
                </span>
                <span className="font-medium text-slate-400">vs last month</span>
              </>
            ) : (
              <span className="font-medium text-slate-400">{delta}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function WorkforceTrendsCard({ growth, className = '' }: { growth: DashboardGrowthPoint[]; className?: string }) {
  const [filter, setFilter] = useState<TimelineFilter>('Last 12 months')
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState<{ x: number; y: number; value: number; label: string } | null>(null)

  const months = filter === 'Last 3 months' ? 3 : filter === 'Last 6 months' ? 6 : 12
  const data = growth.slice(-months)
  const values = data.map((p) => p.employees)
  const min = values.length ? Math.min(...values) : 0
  const max = values.length ? Math.max(...values) : 1
  const pad = Math.max(1, Math.round((max - min) * 0.1))
  const minY = Math.max(0, min - pad)
  const maxY = max + pad

  const chartWidth = 550
  const chartHeight = 155
  const padL = 45
  const padR = 15
  const padT = 15
  const padB = 25
  const w = chartWidth - padL - padR
  const h = chartHeight - padT - padB

  const points = data.map((p, idx) => ({
    x: padL + (w / Math.max(data.length - 1, 1)) * idx,
    y: padT + h * (1 - (p.employees - minY) / Math.max(maxY - minY, 1)),
    value: p.employees,
    label: p.month,
  }))
  const line = smoothPath(points)
  const area = points.length
    ? `${line} L ${points[points.length - 1].x},${padT + h} L ${points[0].x},${padT + h} Z`
    : ''
  const yTicks = [maxY, Math.round((maxY + minY) / 2), minY]

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Workforce Trends</h3>
          <p className="mt-0.5 text-[10px] font-medium text-slate-400">Company headcount progression</p>
        </div>
        <DropdownAnchor open={open} onClose={() => setOpen(false)} align="right">
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-[11px] font-black text-slate-600 hover:bg-slate-100/80"
          >
            <span>{filter}</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>
          {open && (
            <div className="nv-dropdown-menu w-40 divide-y divide-slate-50 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg">
              {(['Last 12 months', 'Last 6 months', 'Last 3 months'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setFilter(opt)
                    setOpen(false)
                  }}
                  className="w-full cursor-pointer px-3.5 py-2 text-left text-[10.5px] font-bold text-slate-600 hover:bg-slate-50 hover:text-novora"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </DropdownAnchor>
      </div>

      {points.length === 0 ? (
        <EmptyNote>No headcount history yet.</EmptyNote>
      ) : (
        <div className="relative mt-2 h-[145px] flex-1 select-none">
          {hovered && (
            <div
              className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-12 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-[10px] font-medium text-white shadow-md"
              style={{ left: `${(hovered.x / chartWidth) * 100}%`, top: `${(hovered.y / chartHeight) * 100}%` }}
            >
              <div className="font-black">{hovered.label}</div>
              <div className="mt-0.5 font-bold text-blue-400">{hovered.value.toLocaleString()} Employees</div>
            </div>
          )}
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height="100%">
            <defs>
              <linearGradient id="nv-trend-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-novora)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--color-novora)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {yTicks.map((tick, idx) => {
              const y = padT + h * (idx / (yTicks.length - 1))
              return (
                <g key={idx}>
                  <text x={padL - 12} y={y + 3} textAnchor="end" className="fill-slate-400 font-mono text-[9px] font-bold">
                    {tick}
                  </text>
                  <line x1={padL} y1={y} x2={chartWidth - padR} y2={y} className="stroke-slate-100" strokeDasharray="4 4" />
                </g>
              )
            })}
            {points.map((p, idx) => (
              <text
                key={`x-${idx}`}
                x={p.x}
                y={chartHeight - 4}
                textAnchor="middle"
                className="fill-slate-400 text-[8.5px] font-bold uppercase tracking-wide"
              >
                {p.label}
              </text>
            ))}
            {area && <path d={area} fill="url(#nv-trend-area)" />}
            {line && (
              <path d={line} fill="none" stroke="var(--color-novora)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            )}
            {points.map((p, idx) => {
              const active = hovered?.label === p.label
              return (
                <g key={`pt-${idx}`}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={14}
                    className="cursor-pointer fill-transparent"
                    onMouseEnter={() => setHovered(p)}
                    onMouseLeave={() => setHovered(null)}
                  />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={active ? 5.5 : 3}
                    strokeWidth={2}
                    stroke={active ? '#fff' : 'var(--color-novora)'}
                    fill={active ? 'var(--color-novora)' : '#fff'}
                    className="pointer-events-none transition-all duration-150"
                  />
                </g>
              )
            })}
          </svg>
        </div>
      )}
    </Card>
  )
}

function AttendanceCard({
  overview,
  className = '',
}: {
  overview: DashboardAttendanceOverview | null
  className?: string
}) {
  const rows = useMemo(() => {
    const order = ['Present', 'Absent', 'Late', 'On Leave']
    const byLabel = new Map((overview?.buckets ?? []).map((b) => [b.label.toLowerCase(), b.count]))
    const total = [...byLabel.values()].reduce((s, n) => s + n, 0)
    return order.map((label) => {
      const count = byLabel.get(label.toLowerCase()) ?? 0
      return {
        label,
        color: ATTENDANCE_COLORS[label.toLowerCase()],
        pct: total > 0 ? (count / total) * 100 : 0,
      }
    })
  }, [overview])

  const rate = overview?.attendanceRate ?? 0
  const circumference = 2 * Math.PI * 38
  let offset = 0

  return (
    <Card className={className}>
      <CardHeader title="Attendance" live />
      <div className="relative flex items-center justify-center py-4">
        <div className="absolute z-10 mt-0.5 max-w-[80px] text-center">
          <span className="block text-xl font-black leading-tight tracking-tight text-slate-800">
            {overview ? `${rate.toFixed(1)}%` : '—'}
          </span>
          <span className="block text-[8px] font-extrabold uppercase leading-tight tracking-wide text-slate-400">Attendance rate</span>
        </div>
        <svg width="125" height="125" viewBox="0 0 100 100" className="-rotate-90">
          <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f1f5f9" strokeWidth="7" />
          {rows.map((r) => {
            const len = (r.pct / 100) * circumference
            if (len <= 0) return null
            const el = (
              <circle
                key={r.label}
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke={r.color}
                strokeWidth="7"
                strokeDasharray={`${len} ${circumference}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
              />
            )
            offset += len
            return el
          })}
        </svg>
      </div>
      <div className="mt-2 space-y-1.5 text-[11px] font-bold text-slate-600">
        {rows.map((r, idx) => (
          <div
            key={r.label}
            className={`flex items-center justify-between px-1 py-1 ${idx < rows.length - 1 ? 'border-b border-slate-50/50' : ''}`}
          >
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: r.color }} />
              <span className="font-bold text-slate-500">{r.label}</span>
            </span>
            <span className="font-mono font-black text-slate-800">{r.pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

type PunchPhase = 'loading' | 'unavailable' | 'not_started' | 'in' | 'done'

function TimeTrackingCard({ addToast, className = '' }: { addToast: Toast; className?: string }) {
  const [phase, setPhase] = useState<PunchPhase>('loading')
  const [checkIn, setCheckIn] = useState<string | null>(null)
  const [checkOut, setCheckOut] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [clock, setClock] = useState(() => new Date())
  const [errorHint, setErrorHint] = useState<string | null>(null)

  const applyLog = useCallback((inTime: string | null | undefined, outTime: string | null | undefined) => {
    setCheckIn(inTime ?? null)
    setCheckOut(outTime ?? null)
    setPhase(inTime && outTime ? 'done' : inTime ? 'in' : 'not_started')
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
      applyLog(todayLog?.checkInTime, todayLog?.checkOutTime)
    } catch (err) {
      setErrorHint(err instanceof ApiError ? err.message : 'Could not load attendance.')
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

  const punch = async (kind: 'in' | 'out') => {
    if (busy) return
    setBusy(true)
    try {
      const log = kind === 'in' ? await checkInAttendance() : await checkOutAttendance()
      applyLog(log.checkInTime, log.checkOutTime)
      addToast(
        kind === 'in'
          ? `Punched in at ${formatPunch(log.checkInTime)}.`
          : `Punched out at ${formatPunch(log.checkOutTime)}.`,
        'success',
      )
    } catch (err) {
      const message = err instanceof ApiError ? err.message : `Punch ${kind} failed.`
      addToast(message, 'error')
      setErrorHint(message)
      await refresh()
    } finally {
      setBusy(false)
    }
  }

  const sessionLabel = (() => {
    const start = parsePunch(checkIn)
    if (!start) return '0h 0m'
    const end = phase === 'done' ? parsePunch(checkOut) ?? clock : clock
    const mins = Math.max(0, Math.floor((end.getTime() - start.getTime()) / 60000))
    return `${Math.floor(mins / 60)}h ${mins % 60}m`
  })()

  const canIn = phase === 'not_started'
  const canOut = phase === 'in'
  const btn = (enabled: boolean, hover: string) =>
    `flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-black transition-all ${
      enabled && !busy
        ? `cursor-pointer border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 ${hover} active:scale-[0.98]`
        : 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400'
    }`

  return (
    <Card className={className}>
      <CardHeader title="Time Tracking" live />
      <div className="relative py-2 text-center">
        <span className="block font-mono text-[32px] font-black leading-none tracking-tighter text-slate-800">
          {digitalTime(clock)}
        </span>
        <span className="mt-2 block text-center text-[9px] font-black uppercase tracking-wider text-slate-500">
          {calendarDate(clock)}
        </span>
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/85 p-4">
        <div className="flex justify-end">
          <span
            className={`rounded-md px-2 py-0.5 text-[8.5px] font-black uppercase tracking-widest ${
              phase === 'in' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
            }`}
          >
            {phase === 'in' ? 'Working' : phase === 'done' ? 'Done' : 'Standby'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-xl border border-slate-100/80 bg-white p-3">
            <span className="block text-[8.5px] font-extrabold uppercase tracking-wider text-slate-400">Clock In</span>
            <span className="mt-1 block font-mono text-xs font-black text-slate-700">{formatPunch(checkIn)}</span>
          </div>
          <div className="rounded-xl border border-slate-100/80 bg-white p-3">
            <span className="block text-[8.5px] font-extrabold uppercase tracking-wider text-slate-400">Clock Out</span>
            <span className="mt-1 block font-mono text-xs font-black text-slate-700">{formatPunch(checkOut)}</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-white">
          <span className="truncate text-[9.5px] font-bold uppercase tracking-wider text-slate-400">Session time</span>
          <span className="shrink-0 whitespace-nowrap font-mono text-[11px] font-black text-emerald-400">{sessionLabel}</span>
        </div>
      </div>

      {errorHint && <p className="mt-2 text-[10.5px] font-medium text-rose-600">{errorHint}</p>}

      <div className="mt-3 grid grid-cols-2 gap-3">
        {phase === 'unavailable' ? (
          <button type="button" onClick={() => void refresh()} className={`col-span-2 ${btn(true, 'hover:text-novora')}`}>
            <RefreshCw className="h-3.5 w-3.5 shrink-0" />
            <span className="text-[9.5px] uppercase tracking-wide">Retry</span>
          </button>
        ) : (
          <>
            <button type="button" disabled={!canIn || busy} onClick={() => void punch('in')} className={btn(canIn, 'hover:text-novora')}>
              <LogIn className="h-3.5 w-3.5 shrink-0" />
              <span className="text-[9.5px] uppercase tracking-wide">Punch In</span>
            </button>
            <button type="button" disabled={!canOut || busy} onClick={() => void punch('out')} className={btn(canOut, 'hover:text-rose-600')}>
              <LogOut className="h-3.5 w-3.5 shrink-0" />
              <span className="text-[9.5px] uppercase tracking-wide">Punch Out</span>
            </button>
          </>
        )}
      </div>
    </Card>
  )
}

function FinancialOverviewCard({
  slices,
  onOpen,
  className = '',
}: {
  slices: PayrollSlice[]
  onOpen: () => void
  className?: string
}) {
  const total = slices.reduce((s, x) => s + (x.value || 0), 0)
  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 0 })
  return (
    <Card className={className}>
      <div className="flex items-center justify-between border-b border-slate-50 pb-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Financial Overview</h3>
        <Coins className="h-4 w-4 text-emerald-600" />
      </div>
      <div className="mt-4 flex flex-1 flex-col justify-between space-y-4">
        <div>
          <span className="block text-[32px] font-black tracking-tight text-slate-800">{total > 0 ? fmt(total) : '—'}</span>
          <span className="mt-1 block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Total Operational Payroll
          </span>
        </div>
        {total > 0 ? (
          <>
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
              {slices.map((s, i) => (
                <div
                  key={s.name}
                  className="h-full transition-all"
                  style={{ width: `${(s.value / total) * 100}%`, backgroundColor: PAYROLL_COLORS[i % PAYROLL_COLORS.length] }}
                />
              ))}
            </div>
            <div className="space-y-2.5 text-[11.5px] font-bold text-slate-600">
              {slices.map((s, i) => (
                <div key={s.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PAYROLL_COLORS[i % PAYROLL_COLORS.length] }} />
                    <span className="font-bold text-slate-500">{s.name}</span>
                  </span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="font-black text-slate-800">{fmt(s.value)}</span>
                    <span className="text-[10px] font-bold text-slate-400">({Math.round((s.value / total) * 100)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <EmptyNote>No payroll processed this period yet.</EmptyNote>
        )}
        <button
          type="button"
          onClick={onOpen}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0f172a] py-3 text-[10.5px] font-black uppercase tracking-widest text-white shadow-sm transition-all hover:bg-slate-800 active:scale-[0.98]"
        >
          Open Payroll
        </button>
      </div>
    </Card>
  )
}

function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-100 ${className}`} />
}

export default function DashboardTab({ employees, setActiveSidebarTab, addToast, roles = [] }: DashboardTabProps) {
  const isAdmin = canManageFullSystem(roles)

  const [loading, setLoading] = useState(true)
  const [kpiMap, setKpiMap] = useState<Record<string, KpiEntry>>({})
  const [hires, setHires] = useState<DashboardEmployeeRow[]>([])
  const [attendance, setAttendance] = useState<DashboardAttendanceOverview | null>(null)
  const [growth, setGrowth] = useState<DashboardGrowthPoint[]>([])
  const [leaveRows, setLeaveRows] = useState<DashboardLeaveRequestRow[]>([])
  const [payroll, setPayroll] = useState<PayrollSlice[]>([])
  const [aiInsights, setAiInsights] = useState<string[]>([])
  const [aiNote, setAiNote] = useState('')
  const [aiBusy, setAiBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    ;(async () => {
      const toMap = (kpis: { label: string; value: string; delta: string }[] | undefined) => {
        const next: Record<string, KpiEntry> = {}
        for (const k of kpis ?? []) next[k.label.toLowerCase()] = { value: k.value, delta: k.delta }
        return next
      }
      try {
        if (isAdmin) {
          const [summary, hireRows, att, grow, leaves, pay] = await Promise.all([
            fetchAdminDashboardSummary().catch(() => ({ kpis: [] })),
            fetchAdminRecentHires(5).catch(() => [] as DashboardEmployeeRow[]),
            fetchAdminAttendanceOverview().catch(() => null),
            fetchAdminGrowth(12).catch(() => [] as DashboardGrowthPoint[]),
            fetchAdminLeaveRequests(5).catch(() => [] as DashboardLeaveRequestRow[]),
            fetchAdminPayrollSummary().catch(() => [] as PayrollSlice[]),
          ])
          if (cancelled) return
          setKpiMap(toMap(summary.kpis))
          setHires(hireRows)
          setAttendance(att)
          setGrowth(grow)
          setLeaveRows(leaves)
          setPayroll(pay)
        } else {
          const mine = await fetchMyDashboard()
          if (cancelled) return
          setKpiMap(toMap(mine.kpis))
          setAttendance(mine.attendanceOverview ?? null)
          setLeaveRows(mine.leaveRequests ?? [])
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

  const kpi = (label: string) => kpiMap[label.toLowerCase()]
  const goTo = (tab: SidebarTab) => setActiveSidebarTab(tab)

  const loadAiInsights = useCallback(
    async (notify = false) => {
      if (!isAdmin) return
      setAiBusy(true)
      try {
        const openRoles = Number(String(kpiMap['open positions']?.value ?? '').replace(/,/g, ''))
        const result = await fetchDashboardAiInsights({
          kpis: Object.entries(kpiMap)
            .slice(0, 6)
            .map(([label, v]) => ({ label, value: v.value, delta: v.delta })),
          attendanceRate: attendance?.attendanceRate ?? null,
          openRoles: Number.isFinite(openRoles) ? openRoles : null,
          pendingLeave: leaveRows.filter((r) => /pending/i.test(r.status)).length,
          upcomingInterviews: 0,
          onboardingIncomplete: 0,
        })
        setAiInsights(result.insights ?? [])
        setAiNote([result.disclaimer, result.source ? `Source: ${result.source}` : ''].filter(Boolean).join(' · '))
      } catch (err) {
        setAiInsights([])
        setAiNote('')
        if (notify) addToast(err instanceof ApiError ? err.message : 'Could not load AI insights.', 'error')
      } finally {
        setAiBusy(false)
      }
    },
    [isAdmin, kpiMap, attendance, leaveRows, addToast],
  )

  useEffect(() => {
    if (!isAdmin || loading) return
    const timer = window.setTimeout(() => void loadAiInsights(), 400)
    return () => window.clearTimeout(timer)
    // One-shot after initial dashboard load; use Refresh for updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, loading])

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <SkeletonBlock key={i} className="h-36" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <SkeletonBlock className="h-80 lg:col-span-6" />
          <SkeletonBlock className="h-80 lg:col-span-3" />
          <SkeletonBlock className="h-80 lg:col-span-3" />
        </div>
      </div>
    )
  }

  const absenceQueue = (
    <Card className="lg:col-span-4">
      <CardHeader title="Absence Queue" action={{ label: 'Action List', onClick: () => goTo('Leave Management') }} />
      {leaveRows.length === 0 ? (
        <EmptyNote>No leave requests right now.</EmptyNote>
      ) : (
        <div className="mt-3 flex flex-1 flex-col divide-y divide-slate-100/60">
          {leaveRows.slice(0, 5).map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-2 py-2.5 text-xs font-semibold">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-extrabold text-slate-600">
                  {initials(item.name)}
                </span>
                <div className="min-w-0">
                  <span className="block truncate font-bold leading-tight text-slate-800">{item.name}</span>
                  <span className="mt-0.5 block truncate text-[10px] font-medium text-slate-400">
                    {item.leaveType} &bull; {item.dateRange}
                  </span>
                </div>
              </div>
              <span className={`shrink-0 rounded-md px-2 py-0.5 text-[8.5px] font-black uppercase tracking-wider ${statusBadge(item.status)}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  )

  if (!isAdmin) {
    return (
      <div id="dynamic-combined-dashboard-root" className="space-y-6 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            title="Attendance Rate"
            value={kpi('attendance rate')?.value ?? '—'}
            delta={kpi('attendance rate')?.delta}
            icon={CheckCircle}
            colorClass="bg-[#ecfdf5] text-[#059669] border border-emerald-100/20"
          />
          <StatCard
            title="Leave Requests"
            value={kpi('leave requests')?.value ?? '—'}
            delta={kpi('leave requests')?.delta}
            icon={CalendarCheck}
            colorClass="bg-indigo-50 text-[#5473e8] border border-indigo-100/30"
          />
          <StatCard
            title="Onboarding Tasks"
            value={kpi('onboarding tasks')?.value ?? '—'}
            delta={kpi('onboarding tasks')?.delta}
            icon={ClipboardList}
            colorClass="bg-orange-50 text-orange-600 border border-orange-100/30"
          />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <TimeTrackingCard addToast={addToast} className="lg:col-span-4" />
          <AttendanceCard overview={attendance} className="lg:col-span-4" />
          {absenceQueue}
        </div>
      </div>
    )
  }

  const headcount = employees.length > 0 ? employees.length.toLocaleString() : '—'

  return (
    <div id="dynamic-combined-dashboard-root" className="space-y-6 animate-in fade-in duration-300">
      <div id="strategic-indicators-grid" className="grid grid-cols-2 gap-4 lg:grid-cols-6">
        <StatCard
          title="Total Employees"
          value={kpi('total employees')?.value ?? headcount}
          delta={kpi('total employees')?.delta}
          icon={Users}
          colorClass="bg-blue-50 text-novora border border-blue-100/30"
        />
        <StatCard
          title="New Hires"
          value={kpi('new hires')?.value ?? String(hires.length)}
          delta={kpi('new hires')?.delta}
          icon={UserPlus}
          colorClass="bg-emerald-50 text-emerald-600 border border-emerald-100/30"
        />
        <StatCard
          title="On Leave"
          value={kpi('on leave')?.value ?? '—'}
          delta={kpi('on leave')?.delta}
          icon={Umbrella}
          colorClass="bg-indigo-50 text-[#5473e8] border border-indigo-100/30"
        />
        <StatCard
          title="Attendance Rate"
          value={kpi('attendance rate')?.value ?? '—'}
          delta={kpi('attendance rate')?.delta}
          icon={CheckCircle}
          colorClass="bg-[#ecfdf5] text-[#059669] border border-emerald-100/20"
        />
        <StatCard
          title="Open Positions"
          value={kpi('open positions')?.value ?? '—'}
          delta={kpi('open positions')?.delta}
          icon={Briefcase}
          colorClass="bg-orange-50 text-orange-600 border border-orange-100/30"
        />
        <StatCard
          title="Turnover Rate"
          value={kpi('turnover rate')?.value ?? '—'}
          delta={kpi('turnover rate')?.delta}
          icon={ArrowRightLeft}
          colorClass="bg-teal-50 text-teal-600 border border-teal-100/30"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <WorkforceTrendsCard growth={growth} className="lg:col-span-6" />
        <AttendanceCard overview={attendance} className="lg:col-span-3" />
        <TimeTrackingCard addToast={addToast} className="lg:col-span-3" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-4">
          <CardHeader title="New Talent" action={{ label: 'Explorer', onClick: () => goTo('Employees Management') }} />
          {hires.length === 0 ? (
            <EmptyNote>No new joiners in the last 30 days.</EmptyNote>
          ) : (
            <div className="mt-3 flex flex-1 flex-col divide-y divide-slate-100/60">
              {hires.slice(0, 5).map((talent, idx) => (
                <div key={talent.id} className="flex items-center justify-between gap-2 py-2.5 text-xs font-semibold">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}
                    >
                      {initials(talent.name)}
                    </span>
                    <div className="min-w-0">
                      <span className="block truncate font-bold leading-tight text-slate-800">{talent.name}</span>
                      <span className="mt-0.5 block truncate text-[10px] font-medium text-slate-400">{talent.role}</span>
                    </div>
                  </div>
                  <span className="shrink-0 text-[9.5px] font-bold text-slate-400">{talent.date}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {absenceQueue}

        <FinancialOverviewCard slices={payroll} onOpen={() => goTo('Payroll Management')} className="lg:col-span-4" />
      </div>

      <Card className="!flex-row items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-novora/10 text-novora">
          <Sparkles className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">AI Insights</h3>
            <button
              type="button"
              disabled={aiBusy}
              onClick={() => void loadAiInsights(true)}
              className="inline-flex cursor-pointer items-center gap-1.5 text-[9.5px] font-black uppercase text-novora hover:underline disabled:opacity-60"
            >
              <RefreshCw className={`h-3 w-3 ${aiBusy ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          {aiInsights.length === 0 ? (
            <p className="mt-2 text-[11px] text-slate-400">
              {aiBusy ? 'Generating insights from live HR metrics…' : 'No insights yet — refresh after data loads.'}
            </p>
          ) : (
            <ul className="mt-2 space-y-2">
              {aiInsights.map((line, idx) => (
                <li key={`${idx}-${line.slice(0, 24)}`} className="flex gap-2 text-xs font-medium text-slate-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-novora" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          )}
          {aiNote && <p className="mt-3 text-[10px] font-medium text-slate-400">{aiNote}</p>}
        </div>
      </Card>
    </div>
  )
}

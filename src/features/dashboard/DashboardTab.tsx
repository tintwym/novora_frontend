import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  ArrowRight,
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  DollarSign,
  FileText,
  LogIn,
  TrendingDown,
  TrendingUp,
  Umbrella,
  UserPlus,
  Users,
} from 'lucide-react'
import type { Employee, SidebarTab } from '@/types'
import { canManageFullSystem } from '@/lib/roles'
import {
  fetchAdminAttendanceOverview,
  fetchAdminDashboardSummary,
  fetchAdminGrowth,
  fetchAdminLeaveRequests,
  fetchAdminPayrollSummary,
  fetchAdminRecentHires,
  fetchAdminTasks,
  fetchMyDashboard,
  fetchPayrollRunSummary,
  type DashboardAttendanceOverview,
  type DashboardEmployeeRow,
  type DashboardGrowthPoint,
  type DashboardLeaveRequestRow,
  type DashboardTaskRow,
  type PayrollRunSummary,
  type PayrollSlice,
} from '@/services'

interface DashboardTabProps {
  employees: Employee[]
  setActiveSidebarTab: (tab: SidebarTab) => void
  addToast: (text: string, type: 'success' | 'info' | 'error' | 'loading') => void
  roles?: string[]
  userName?: string
}

type TimelineFilter = 'Last 12 months' | 'Last 6 months' | 'Last 3 months' | 'Last 30 days'

function getGreeting(hour: number) {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatHeaderDate(d: Date) {
  return d.toLocaleDateString('en-SG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function firstName(name: string) {
  const trimmed = name.trim()
  if (!trimmed) return 'there'
  return trimmed.split(/\s+/)[0]
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
    <div className="nv-stat-card">
      <div className="flex items-start justify-between gap-3">
        <span className={`nv-stat-icon ${iconClass}`}>
          <Icon className="h-4 w-4" />
        </span>
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              trendUp ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'
            }`}
          >
            {trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend}
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-xs font-medium text-slate-500">{label}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: 'Pending' | 'Approved' | 'Rejected' }) {
  const styles = {
    Pending: 'bg-amber-50 text-amber-700 ring-amber-100',
    Approved: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    Rejected: 'bg-rose-50 text-rose-700 ring-rose-100',
  }
  return (
    <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${styles[status]}`}>
      {status}
    </span>
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
  const [hovered, setHovered] = useState<{ x: number; y: number; value: number; label: string } | null>(null)

  const trendData = useMemo(() => {
    const months =
      filter === 'Last 3 months' ? 3 : filter === 'Last 6 months' ? 6 : filter === 'Last 30 days' ? 1 : 12
    const sliced = growth.length > 0 ? growth.slice(-Math.max(months, 1)) : []
    return growthToTrend(sliced)
  }, [filter, growth])
  const chartWidth = 560
  const chartHeight = 180
  const padL = 40
  const padR = 12
  const padT = 12
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
      title="Workforce growth"
      action={
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            {filter}
            <ChevronDown className="nv-chevron-down nv-chevron-down--sm" />
          </button>
          {open && (
            <div className="nv-dropdown-menu absolute right-0 z-20 w-40 overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-lg">
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
        </div>
      }
      className="lg:col-span-8"
    >
      <p className="-mt-2 mb-4 text-xs text-slate-500">Headcount trend across your organisation</p>
      {points.length === 0 ? (
        <p className="py-12 text-center text-xs text-slate-400">No growth data from the API yet.</p>
      ) : (
      <div className="relative h-48">
        {hovered && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg bg-slate-900 px-2.5 py-1.5 text-[10px] font-medium text-white shadow-lg"
            style={{ left: hovered.x, top: hovered.y - 8 }}
          >
            <div>{hovered.label}</div>
            <div className="text-blue-300">{hovered.value.toLocaleString()} people</div>
          </div>
        )}
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-full w-full">
          <defs>
            <linearGradient id="dash-area-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
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
            <path d={line} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
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
                r={hovered?.value === p.value ? 5 : 3}
                className="fill-white stroke-[#2563eb] stroke-2"
              />
              <text x={p.x} y={chartHeight - 6} textAnchor="middle" className="fill-slate-400 text-[9px] font-medium">
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
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>('Last 12 months')
  const isAdmin = canManageFullSystem(roles)
  const headcount = employees.length > 0 ? employees.length.toLocaleString() : '—'

  const [kpiMap, setKpiMap] = useState<Record<string, { value: string; delta: string }>>({})
  const [liveHires, setLiveHires] = useState<DashboardEmployeeRow[] | null>(null)
  const [liveLeave, setLiveLeave] = useState<DashboardLeaveRequestRow[] | null>(null)
  const [liveAttendance, setLiveAttendance] = useState<DashboardAttendanceOverview | null>(null)
  const [liveGrowth, setLiveGrowth] = useState<DashboardGrowthPoint[]>([])
  const [liveTasks, setLiveTasks] = useState<DashboardTaskRow[]>([])
  const [pendingLeaveCount, setPendingLeaveCount] = useState(0)
  const [payrollRun, setPayrollRun] = useState<PayrollRunSummary | null>(null)
  const [payrollSlices, setPayrollSlices] = useState<PayrollSlice[]>([])

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        if (isAdmin) {
          const [summary, hires, leave, attendance, growth, tasks, run, slices] = await Promise.all([
            fetchAdminDashboardSummary(),
            fetchAdminRecentHires(5),
            fetchAdminLeaveRequests(6),
            fetchAdminAttendanceOverview(),
            fetchAdminGrowth(12).catch(() => [] as DashboardGrowthPoint[]),
            fetchAdminTasks(12).catch(() => [] as DashboardTaskRow[]),
            fetchPayrollRunSummary().catch(() => null),
            fetchAdminPayrollSummary().catch(() => [] as PayrollSlice[]),
          ])
          if (cancelled) return
          const next: Record<string, { value: string; delta: string }> = {}
          for (const k of summary.kpis ?? []) {
            next[k.label.toLowerCase()] = { value: k.value, delta: k.delta }
          }
          setKpiMap(next)
          setLiveHires(hires)
          setLiveLeave(leave)
          setLiveAttendance(attendance)
          setLiveGrowth(growth)
          setLiveTasks(tasks)
          setPendingLeaveCount(leave.filter((r) => /pending/i.test(r.status)).length)
          setPayrollRun(run)
          setPayrollSlices(slices)
        } else {
          const mine = await fetchMyDashboard()
          if (cancelled) return
          const next: Record<string, { value: string; delta: string }> = {}
          for (const k of mine.kpis ?? []) {
            next[k.label.toLowerCase()] = { value: k.value, delta: k.delta }
          }
          setKpiMap(next)
          setLiveAttendance(mine.attendanceOverview ?? null)
          setLiveLeave(mine.leaveRequests ?? null)
          setLiveGrowth(mine.growth ?? [])
          setPendingLeaveCount(
            (mine.leaveRequests ?? []).filter((r) => /pending/i.test(r.status)).length,
          )
          setPayrollRun(null)
          setPayrollSlices([])
        }
      } catch {
        // Leave panels empty when APIs fail — never seed demo people.
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

  const attentionItems = useMemo(() => {
    const items: {
      id: string
      title: string
      detail: string
      tab: SidebarTab
      tone: 'amber' | 'blue' | 'slate'
    }[] = []
    if (pendingLeaveCount > 0) {
      items.push({
        id: 'leave-live',
        title: `${pendingLeaveCount} leave request${pendingLeaveCount === 1 ? '' : 's'} pending`,
        detail: 'Review and approve in Leave Management',
        tab: 'Leave Management',
        tone: 'amber',
      })
    }
    if (liveHires && liveHires.length > 0) {
      items.push({
        id: 'hire-live',
        title: `${liveHires.length} recent hire${liveHires.length === 1 ? '' : 's'}`,
        detail: liveHires[0]?.name ? `${liveHires[0].name} and team updates` : 'Open On/Off-boarding',
        tab: 'On/Off-boarding Management',
        tone: 'blue',
      })
    }
    liveTasks.slice(0, 3).forEach((task, idx) => {
      items.push({
        id: `task-${idx}`,
        title: task.text,
        detail: task.status || 'Open task',
        tab: 'Employees Management',
        tone: 'slate',
      })
    })
    return items
  }, [pendingLeaveCount, liveHires, liveTasks])

  const hireRows =
    liveHires && liveHires.length > 0
      ? liveHires.slice(0, 3).map((h, i) => ({
          name: h.name,
          role: h.role,
          date: h.date,
          initials: h.name
            .split(/\s+/)
            .map((p) => p[0])
            .join('')
            .slice(0, 2)
            .toUpperCase(),
          color: ['bg-indigo-100 text-indigo-700', 'bg-emerald-100 text-emerald-700', 'bg-sky-100 text-sky-700'][
            i % 3
          ],
        }))
      : []

  const leaveRows =
    liveLeave && liveLeave.length > 0
      ? liveLeave.slice(0, 3).map((r) => ({
          name: r.name,
          type: r.leaveType,
          dates: r.dateRange,
          status: (/approv/i.test(r.status)
            ? 'Approved'
            : /reject|den/i.test(r.status)
              ? 'Rejected'
              : 'Pending') as 'Pending' | 'Approved' | 'Rejected',
        }))
      : []

  const attendanceRateValue = liveAttendance?.attendanceRate ?? 0
  const attendanceRate = liveAttendance ? `${attendanceRateValue.toFixed(0)}%` : '—'
  const attendanceBuckets = liveAttendance?.buckets?.length
    ? liveAttendance.buckets
    : [
        { label: 'Present', count: 0 },
        { label: 'Absent', count: 0 },
        { label: 'Late', count: 0 },
      ]
  const attendanceDonut = (() => {
    const radius = 38
    const circumference = 2 * Math.PI * radius
    const pct = Math.max(0, Math.min(100, attendanceRateValue)) / 100
    return {
      radius,
      circumference,
      dash: `${circumference * pct} ${circumference}`,
    }
  })()

  const monthNames = [
    '',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const payrollPeriodLabel = payrollRun
    ? `${monthNames[payrollRun.payMonth] || payrollRun.payMonth} ${payrollRun.payYear}`
    : 'Current cycle'
  const payrollSliceTotal = payrollSlices.reduce((sum, s) => sum + Math.max(0, s.value), 0)
  const money = (n: number) =>
    n.toLocaleString(undefined, { style: 'currency', currency: 'SGD', maximumFractionDigits: 0 })
  const sliceDollars = (cents: number) => cents / 100
  const deductionsSlice = payrollSlices.find((s) => /deduct/i.test(s.name))
  const deductionsDisplay = deductionsSlice ? money(sliceDollars(deductionsSlice.value)) : null

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
          <KpiCard label="Pending claims" value={findKpi('claim')?.value || '—'} icon={FileText} iconClass="!bg-amber-50 !text-amber-600" />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <Panel title="Today" className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-novora shadow-sm">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Not clocked in yet</p>
                  <p className="text-xs text-slate-500">Use Attendance to punch in for today</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => goTo('Attendance Management', 'Opening attendance…')}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:border-novora/30 hover:text-novora cursor-pointer"
              >
                Open attendance
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </Panel>

          <Panel title="Upcoming" className="lg:col-span-7">
            <ul className="space-y-3">
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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <header className="nv-dash-hero flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">
            {formatHeaderDate(now)}
          </p>
          <h1 className="mt-2 font-display text-2xl md:text-3xl font-bold tracking-tight text-white">
            {getGreeting(now.getHours())}, {firstName(userName)}
          </h1>
          <p className="mt-1.5 text-sm text-white/60">
            {attentionItems.length} items need your attention today.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => goTo('Employees Management', 'Opening employee directory…')}
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/15 cursor-pointer"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Add employee
          </button>
          <button
            type="button"
            onClick={() => goTo('Leave Management')}
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/15 cursor-pointer"
          >
            Review leave
          </button>
          <button
            type="button"
            onClick={() => goTo('Payroll Management')}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-900 shadow-sm hover:bg-white/95 cursor-pointer"
          >
            <DollarSign className="h-3.5 w-3.5" />
            Payroll
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 nv-stagger">
        <KpiCard
          label="Total employees"
          value={findKpi('employee')?.value || headcount}
          trend={findKpi('employee')?.delta || undefined}
          trendUp={!findKpi('employee')?.delta?.trim().startsWith('-')}
          icon={Users}
          iconClass=""
        />
        <KpiCard
          label="On leave today"
          value={findKpi('leave')?.value || String(pendingLeaveCount || '—')}
          trend={findKpi('leave')?.delta || undefined}
          trendUp={!findKpi('leave')?.delta?.trim().startsWith('-')}
          icon={Umbrella}
          iconClass="!bg-sky-50 !text-sky-600"
        />
        <KpiCard
          label="Attendance rate"
          value={findKpi('attendance')?.value || attendanceRate}
          trend={findKpi('attendance')?.delta || undefined}
          trendUp={!findKpi('attendance')?.delta?.trim().startsWith('-')}
          icon={CheckCircle2}
          iconClass="!bg-emerald-50 !text-emerald-600"
        />
        <KpiCard
          label="Open positions"
          value={findKpi('position')?.value || findKpi('open')?.value || '—'}
          trend={findKpi('position')?.delta || findKpi('open')?.delta || undefined}
          trendUp={!(findKpi('position')?.delta || findKpi('open')?.delta || '').trim().startsWith('-')}
          icon={Briefcase}
          iconClass="!bg-orange-50 !text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <WorkforceTrendChart
          growth={liveGrowth}
          filter={timelineFilter}
          onFilterChange={setTimelineFilter}
        />

        <Panel
          title="Needs attention"
          action={
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
              {attentionItems.length} open
            </span>
          }
          className="lg:col-span-4"
        >
          <ul className="space-y-2">
            {attentionItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => goTo(item.tab)}
                  className="group flex w-full items-start gap-3 rounded-xl border border-slate-100 p-3 text-left hover:border-novora/20 hover:bg-slate-50/80 cursor-pointer"
                >
                  <span
                    className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                      item.tone === 'amber'
                        ? 'bg-amber-400'
                        : item.tone === 'blue'
                          ? 'bg-novora'
                          : 'bg-slate-400'
                    }`}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-800 group-hover:text-novora">
                      {item.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500">{item.detail}</span>
                  </span>
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-300 group-hover:text-novora" />
                </button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel
          title="Attendance this month"
          action={
            <button
              type="button"
              onClick={() => goTo('Attendance Management')}
              className="text-xs font-semibold text-novora hover:underline cursor-pointer"
            >
              View all
            </button>
          }
        >
          <div className="flex items-center gap-5">
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r={attendanceDonut.radius} fill="none" stroke="#f1f5f9" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r={attendanceDonut.radius}
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="8"
                  strokeDasharray={attendanceDonut.dash}
                  strokeLinecap="round"
                  className="transition-[stroke-dasharray] duration-500"
                />
              </svg>
              <span className="absolute text-lg font-bold text-slate-800">{attendanceRate}</span>
            </div>
            <ul className="flex-1 space-y-2 text-xs">
              {attendanceBuckets.slice(0, 3).map((row) => (
                <li key={row.label} className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="h-2 w-2 rounded-full bg-novora" />
                    {row.label}
                  </span>
                  <span className="font-semibold text-slate-800">{row.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>

        <Panel
          title="New hires"
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
          <ul className="divide-y divide-slate-100">
            {hireRows.length === 0 ? (
              <li className="py-6 text-center text-xs text-slate-400">No recent hires from the API yet.</li>
            ) : (
              hireRows.map((person) => (
              <li key={person.name} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold ${person.color}`}>
                    {person.initials}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{person.name}</p>
                    <p className="text-xs text-slate-500">{person.role}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-400">{person.date}</span>
              </li>
              ))
            )}
          </ul>
        </Panel>

        <Panel
          title="Payroll snapshot"
          action={
            <button
              type="button"
              onClick={() => goTo('Payroll Management')}
              className="text-xs font-semibold text-novora hover:underline cursor-pointer"
            >
              Open payroll
            </button>
          }
        >
          {payrollRun && payrollRun.headcount > 0 ? (
            <>
              <p className="text-2xl font-bold tracking-tight text-slate-900">
                {money(payrollRun.totalNetPay)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Net pay · {payrollPeriodLabel} · {payrollRun.headcount} employee
                {payrollRun.headcount === 1 ? '' : 's'}
              </p>
              {payrollSliceTotal > 0 && (
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="flex h-full">
                    {payrollSlices.map((slice) => {
                      const width = Math.max(2, Math.round((slice.value / payrollSliceTotal) * 100))
                      return (
                        <div
                          key={slice.name}
                          className="h-full"
                          style={{
                            width: `${width}%`,
                            backgroundColor: slice.fill || '#4F46E5',
                          }}
                          title={slice.name}
                        />
                      )
                    })}
                  </div>
                </div>
              )}
              <ul className="mt-3 space-y-1.5 text-xs">
                <li className="flex justify-between text-slate-600">
                  <span>Net pay</span>
                  <span className="font-semibold text-slate-800">{money(payrollRun.totalNetPay)}</span>
                </li>
                {deductionsDisplay && (
                  <li className="flex justify-between text-slate-600">
                    <span>Deductions</span>
                    <span className="font-semibold text-slate-800">{deductionsDisplay}</span>
                  </li>
                )}
                <li className="flex justify-between text-slate-600">
                  <span>Status</span>
                  <span className="font-semibold text-slate-800">
                    {payrollRun.paidCount} paid · {payrollRun.processedCount} processed ·{' '}
                    {payrollRun.draftCount} draft
                  </span>
                </li>
              </ul>
            </>
          ) : (
            <>
              <p className="text-sm text-slate-500">
                No payroll run for this month yet. Generate or process payslips in Pay management.
              </p>
              <button
                type="button"
                onClick={() => goTo('Payroll Management')}
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:border-novora/30 hover:text-novora cursor-pointer"
              >
                Go to payroll
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </Panel>
      </div>

      <Panel
        title="Leave queue"
        action={
          <button
            type="button"
            onClick={() => goTo('Leave Management')}
            className="text-xs font-semibold text-novora hover:underline cursor-pointer"
          >
            Manage all
          </button>
        }
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {leaveRows.length === 0 ? (
            <p className="col-span-full py-6 text-center text-xs text-slate-400">
              No leave requests in the queue.
            </p>
          ) : (
            leaveRows.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-3 py-3"
            >
              <div>
                <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                <p className="text-xs text-slate-500">
                  {item.type} · {item.dates}
                </p>
              </div>
              <StatusBadge status={item.status} />
            </div>
            ))
          )}
        </div>
      </Panel>
    </div>
  )
}

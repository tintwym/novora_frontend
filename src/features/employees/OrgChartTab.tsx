import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Search, Users } from 'lucide-react'
import type { Employee, Department } from '@/types'
import { ApiError, fetchOrgChart, type OrgChartNode } from '@/services'

interface OrgChartTabProps {
  employees: Employee[]
  onSelectEmployee: (emp: Employee) => void
  addToast: (text: string, type: 'success' | 'info' | 'error' | 'loading') => void
}

type TreeNode = OrgChartNode & { children: TreeNode[]; descendants: number }
type ChartDensity = 'concise' | 'small' | 'standard'

const STACK_PREVIEW = 3

const DEPT_THEMES = [
  { card: 'bg-blue-50/70 border-blue-200 hover:border-blue-400', avatar: 'bg-blue-100 text-blue-700', text: 'text-blue-900', badge: 'bg-blue-100 text-blue-800', bar: 'bg-[#2f66e0]', value: 'text-[#2f66e0]', ring: 'border-[#2f66e0] ring-1 ring-[#2f66e0]', swatch: '#2f66e0' },
  { card: 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-300', avatar: 'bg-emerald-100 text-emerald-700', text: 'text-emerald-900', badge: 'bg-emerald-100 text-emerald-800', bar: 'bg-emerald-500', value: 'text-[#10b981]', ring: 'border-emerald-500 ring-1 ring-emerald-500', swatch: '#10b981' },
  { card: 'bg-purple-50/70 border-purple-200 hover:border-purple-300', avatar: 'bg-purple-100 text-purple-700', text: 'text-purple-900', badge: 'bg-purple-100 text-purple-800', bar: 'bg-purple-500', value: 'text-[#8b5cf6]', ring: 'border-purple-500 ring-1 ring-purple-500', swatch: '#8b5cf6' },
  { card: 'bg-rose-50/70 border-rose-200 hover:border-rose-300', avatar: 'bg-rose-100 text-rose-700', text: 'text-rose-900', badge: 'bg-rose-100 text-rose-800', bar: 'bg-rose-500', value: 'text-[#f43f5e]', ring: 'border-rose-500 ring-1 ring-rose-500', swatch: '#f43f5e' },
  { card: 'bg-amber-50/70 border-amber-200 hover:border-amber-300', avatar: 'bg-amber-100 text-amber-700', text: 'text-amber-900', badge: 'bg-amber-100 text-amber-800', bar: 'bg-amber-500', value: 'text-[#d97706]', ring: 'border-amber-500 ring-1 ring-amber-500', swatch: '#d97706' },
  { card: 'bg-teal-50/70 border-teal-200 hover:border-teal-300', avatar: 'bg-teal-100 text-teal-700', text: 'text-teal-900', badge: 'bg-teal-100 text-teal-800', bar: 'bg-teal-500', value: 'text-[#0d9488]', ring: 'border-teal-500 ring-1 ring-teal-500', swatch: '#0d9488' },
  { card: 'bg-sky-50/70 border-sky-200 hover:border-sky-300', avatar: 'bg-sky-100 text-sky-700', text: 'text-sky-900', badge: 'bg-sky-100 text-sky-800', bar: 'bg-sky-500', value: 'text-[#0284c7]', ring: 'border-sky-500 ring-1 ring-sky-500', swatch: '#0284c7' },
]
const NEUTRAL_THEME = { card: 'bg-slate-50 border-slate-200 hover:border-slate-300', avatar: 'bg-slate-100 text-slate-700', text: 'text-slate-900', badge: 'bg-slate-100 text-slate-800', bar: 'bg-slate-500', value: 'text-slate-700', ring: 'border-slate-500 ring-1 ring-slate-500', swatch: '#64748b' }

const DENSITY = {
  concise: { gap: 'px-1.5 sm:px-2', node: 'w-40 p-2 gap-2 rounded-xl', sub: 'w-36 p-1.5 gap-2 rounded-xl', stack: 'w-32 p-1.5 gap-2 rounded-lg', avatar: 'h-7 w-7 text-[10px]', title: 'text-[11px]', desc: 'text-[9px]', ceo: 'w-52 p-3', ceoAvatar: 'h-9 w-9 text-xs' },
  small: { gap: 'px-2.5 sm:px-3', node: 'w-48 p-3 gap-2 rounded-2xl', sub: 'w-40 p-2 gap-2 rounded-2xl', stack: 'w-36 p-2 gap-2 rounded-xl', avatar: 'h-8 w-8 text-xs', title: 'text-xs', desc: 'text-[10px]', ceo: 'w-60 p-4', ceoAvatar: 'h-10 w-10 text-xs' },
  standard: { gap: 'px-4 sm:px-5', node: 'w-56 p-3.5 gap-2.5 rounded-2xl', sub: 'w-44 p-2.5 gap-2 rounded-2xl', stack: 'w-40 p-2 gap-2 rounded-xl', avatar: 'h-8.5 w-8.5 text-xs', title: 'text-xs', desc: 'text-[10px]', ceo: 'w-64 p-4.5', ceoAvatar: 'h-11 w-11 text-sm' },
} as const

function mapDept(name: string | null | undefined): Department {
  const raw = (name ?? '').toLowerCase()
  if (raw.includes('eng')) return 'Engineering'
  if (raw.includes('fin')) return 'Finance'
  if (raw.includes('hr') || raw.includes('human')) return 'HR'
  if (raw.includes('market')) return 'Marketing'
  return 'Operations'
}

function getInitials(fullName: string) {
  return fullName
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function buildTree(nodes: OrgChartNode[]): TreeNode[] {
  const byId = new Map<string, TreeNode>()
  for (const n of nodes) byId.set(n.employeeId, { ...n, children: [], descendants: 0 })
  const roots: TreeNode[] = []
  for (const n of byId.values()) {
    const mgr = n.managerEmployeeId
    if (mgr && mgr !== n.employeeId && byId.has(mgr)) byId.get(mgr)!.children.push(n)
    else roots.push(n)
  }
  const visiting = new Set<string>()
  const count = (n: TreeNode): number => {
    if (visiting.has(n.employeeId)) return 0
    visiting.add(n.employeeId)
    n.children.sort((a, b) => a.name.localeCompare(b.name))
    n.descendants = n.children.reduce((s, c) => s + 1 + count(c), 0)
    visiting.delete(n.employeeId)
    return n.descendants
  }
  roots.forEach(count)
  return roots.sort((a, b) => b.descendants - a.descendants || a.name.localeCompare(b.name))
}

/** Horizontal connector segment so siblings join into one bar without gaps. */
function SiblingConnector({ index, total }: { index: number; total: number }) {
  if (total <= 1) return null
  const cls = index === 0 ? 'left-1/2 right-0' : index === total - 1 ? 'left-0 right-1/2' : 'left-0 right-0'
  return <div className={`absolute top-0 h-0.5 bg-slate-200 ${cls}`} />
}

export default function OrgChartTab({ employees, onSelectEmployee, addToast }: OrgChartTabProps) {
  const [chartSearch, setChartSearch] = useState('')
  const [nodes, setNodes] = useState<OrgChartNode[]>([])
  const [loading, setLoading] = useState(true)
  const [activeDept, setActiveDept] = useState('All')
  const [viewMode, setViewMode] = useState<'org' | 'list'>('org')
  const [chartDensity, setChartDensity] = useState<ChartDensity>('concise')
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set())

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchOrgChart()
      setNodes(res.nodes ?? [])
    } catch (err) {
      setNodes([])
      if (!(err instanceof ApiError) || (err.status !== 401 && err.status !== 403)) {
        addToast('Could not load organisation chart.', 'error')
      }
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    void load()
  }, [load])

  const departments = useMemo(() => {
    const counts = new Map<string, number>()
    for (const n of nodes) {
      const d = n.departmentName?.trim() || 'Unassigned'
      counts.set(d, (counts.get(d) ?? 0) + 1)
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  }, [nodes])

  const themeFor = useCallback(
    (dept: string | null | undefined) => {
      const name = dept?.trim() || 'Unassigned'
      const idx = departments.findIndex(([d]) => d === name)
      return idx < 0 || name === 'Unassigned' ? NEUTRAL_THEME : DEPT_THEMES[idx % DEPT_THEMES.length]
    },
    [departments],
  )

  const visibleNodes = useMemo(
    () =>
      activeDept === 'All'
        ? nodes
        : nodes.filter((n) => (n.departmentName?.trim() || 'Unassigned') === activeDept),
    [nodes, activeDept],
  )

  const roots = useMemo(() => buildTree(visibleNodes), [visibleNodes])
  const treeRoots = roots.filter((r) => r.children.length > 0)
  const unattached = roots.filter((r) => r.children.length === 0)
  const singleTop = treeRoots.length === 1 ? treeRoots[0] : null

  const query = chartSearch.trim().toLowerCase()
  const isHighlighted = (n: OrgChartNode) =>
    !!query &&
    (n.name.toLowerCase().includes(query) ||
      (n.jobTitle ?? '').toLowerCase().includes(query) ||
      (n.departmentName ?? '').toLowerCase().includes(query))

  const openEmployee = (node: OrgChartNode) => {
    const existing = employees.find(
      (e) => e.apiId === node.employeeId || e.name.toLowerCase() === node.name.toLowerCase(),
    )
    if (existing) {
      onSelectEmployee(existing)
      return
    }
    onSelectEmployee({
      id: node.employeeId.slice(0, 8),
      apiId: node.employeeId,
      name: node.name,
      department: mapDept(node.departmentName),
      position: node.jobTitle || '—',
      employmentStatus: 'Permanent',
      status: 'Active',
      joinDate: '—',
      nric: '—',
      mobile: '—',
      email: '—',
      address: '—',
      avatarColor: 'bg-slate-800 text-white',
      dependents: '—',
      emergencyContact: '—',
    })
  }

  const toggleExpanded = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const d = DENSITY[chartDensity]

  const PersonCard = ({ node, variant }: { node: TreeNode; variant: 'head' | 'sub' | 'stack' }) => {
    const theme = themeFor(node.departmentName)
    const width = variant === 'head' ? d.node : variant === 'sub' ? d.sub : d.stack
    return (
      <button
        type="button"
        onClick={() => openEmployee(node)}
        className={`relative flex cursor-pointer items-center border bg-white text-left shadow-xs transition-all hover:shadow-md ${width} ${theme.card} ${
          isHighlighted(node) ? 'ring-4 ring-novora' : ''
        }`}
      >
        <span className={`flex shrink-0 items-center justify-center rounded-full font-black ${d.avatar} ${theme.avatar}`}>
          {getInitials(node.name)}
        </span>
        <span className="min-w-0">
          <span className={`block truncate font-extrabold leading-normal tracking-tight ${d.title} ${theme.text}`}>
            {node.name}
          </span>
          <span className={`mt-0.5 block truncate font-semibold leading-none text-slate-400 ${d.desc}`}>
            {node.jobTitle || node.departmentName || '—'}
          </span>
          {variant === 'head' && node.descendants > 0 && (
            <span className={`mt-1 block text-[9px] font-bold leading-none ${theme.text}`}>
              {node.descendants} {node.descendants === 1 ? 'member' : 'members'}
            </span>
          )}
        </span>
      </button>
    )
  }

  const renderStack = (node: TreeNode): React.ReactNode => {
    if (node.children.length === 0) return null
    const open = expanded.has(node.employeeId)
    const shown = open ? node.children : node.children.slice(0, STACK_PREVIEW)
    const hidden = node.children.length - shown.length
    return (
      <>
        <div className="h-6 w-0.5 border-l-2 border-dashed border-slate-300" />
        <div className="flex flex-col items-center space-y-2">
          {shown.map((c) => (
            <div key={c.employeeId} className="flex flex-col items-center">
              <PersonCard node={c} variant="stack" />
              {open && renderStack(c)}
            </div>
          ))}
          {(hidden > 0 || (open && node.children.length > STACK_PREVIEW)) && (
            <button
              type="button"
              onClick={() => toggleExpanded(node.employeeId)}
              className="cursor-pointer select-none rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[9px] font-bold text-slate-600 transition-colors hover:bg-slate-100"
            >
              {hidden > 0 ? `+${hidden} more` : 'Show less'}
            </button>
          )}
        </div>
      </>
    )
  }

  const renderRow = (children: TreeNode[], depth: number, connected = true): React.ReactNode => (
    <div className="flex items-start justify-center">
      {children.map((c, idx) => (
        <div key={c.employeeId} className={`relative flex flex-col items-center ${connected ? 'pt-6' : ''} ${d.gap}`}>
          {connected && (
            <>
              <SiblingConnector index={idx} total={children.length} />
              <div className="absolute left-1/2 top-0 h-6 w-0.5 -translate-x-1/2 bg-slate-200" />
            </>
          )}
          <PersonCard node={c} variant={depth <= 1 ? 'head' : 'sub'} />
          {c.children.length > 0 &&
            (depth <= 1 ? (
              <>
                <div className="h-6 w-0.5 bg-slate-200" />
                {renderRow(c.children, depth + 1)}
              </>
            ) : (
              renderStack(c)
            ))}
        </div>
      ))}
    </div>
  )

  const managers = useMemo(() => {
    const all: TreeNode[] = []
    const walk = (n: TreeNode) => {
      if (n.children.length > 0) all.push(n)
      n.children.forEach(walk)
    }
    roots.forEach(walk)
    return all
  }, [roots])

  const filterChip = (dept: string) => {
    const active = activeDept === dept
    return (
      <button
        key={dept}
        type="button"
        onClick={() => setActiveDept(dept)}
        className={`cursor-pointer rounded-xl border px-3 py-1.5 font-extrabold transition-colors ${
          active
            ? 'border-slate-800 bg-white font-black text-slate-800 shadow-xs'
            : 'border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800'
        }`}
      >
        {dept}
      </button>
    )
  }

  return (
    <div id="org-chart-tab-outer" className="space-y-6 animate-in fade-in duration-300">
      <div className="w-full space-y-5 border-b border-slate-200/85 pb-5">
        <div className="flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <Search className="h-4 w-4 text-slate-400" />
            </span>
            <input
              id="org-chart-person-search"
              type="text"
              placeholder="Find person..."
              value={chartSearch}
              onChange={(e) => setChartSearch(e.target.value)}
              className="w-56 rounded-xl border border-slate-200/80 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-700 transition-all focus:border-slate-400 focus:bg-white focus:outline-none"
            />
          </div>
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
            {(['org', 'list'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`cursor-pointer rounded-lg px-4 py-1.5 text-xs transition-all ${
                  viewMode === mode
                    ? 'border border-slate-200/50 bg-white font-bold text-slate-800 shadow-xs'
                    : 'font-black text-slate-500 hover:text-slate-800'
                }`}
              >
                {mode === 'org' ? 'Org view' : 'List view'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col items-center justify-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Department:</span>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {filterChip('All')}
              {departments.map(([dept]) => filterChip(dept))}
            </div>
          </div>
          <div className="select-none text-xs font-bold text-slate-400">
            {nodes.length.toLocaleString()} employees &bull; {departments.length}{' '}
            {departments.length === 1 ? 'department' : 'departments'}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-[420px] animate-pulse rounded-3xl bg-slate-100" />
      ) : nodes.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
          <Users className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm font-semibold text-slate-600">No employees in the chart yet</p>
          <p className="mt-1 text-xs text-slate-400">Add employees and set their managers to build the reporting hierarchy.</p>
        </div>
      ) : viewMode === 'org' ? (
        <div
          id="visual-chart-stage-canvas"
          className="nv-card relative flex min-h-[500px] flex-col items-center justify-start overflow-hidden !rounded-3xl p-6"
        >
          <div className="mb-6 flex w-full items-center justify-between border-b border-slate-100 pb-3.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Chart Layout Sizing:</span>
              <div className="flex items-center rounded-lg bg-slate-100 p-0.5">
                {(['concise', 'small', 'standard'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setChartDensity(opt)}
                    className={`cursor-pointer rounded-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${
                      chartDensity === opt ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full overflow-x-auto py-4">
            <div className="mx-auto flex w-fit min-w-full flex-col items-center px-4">
              {singleTop ? (
                <>
                  <button
                    type="button"
                    onClick={() => openEmployee(singleTop)}
                    className={`relative flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-[#163b82] bg-[#1e469a] text-left text-white shadow-md transition-all duration-200 hover:scale-[1.02] ${d.ceo} ${
                      isHighlighted(singleTop) ? 'ring-4 ring-blue-500 ring-offset-2' : ''
                    }`}
                  >
                    <span className={`flex shrink-0 items-center justify-center rounded-full bg-blue-500/80 font-bold text-white shadow-sm ${d.ceoAvatar}`}>
                      {getInitials(singleTop.name)}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[11px] font-extrabold leading-normal tracking-tight text-white">
                        {singleTop.name}
                      </span>
                      <span className="mt-0.5 block truncate text-[9.5px] font-medium leading-normal text-blue-100">
                        {singleTop.jobTitle || singleTop.departmentName || '—'}
                      </span>
                      <span className="mt-1 inline-block rounded-md bg-[#133775] px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-[#60a5fa]">
                        {singleTop.descendants} reporting
                      </span>
                    </span>
                  </button>
                  <div className="h-6 w-0.5 bg-slate-200" />
                  {renderRow(singleTop.children, 1)}
                </>
              ) : treeRoots.length > 0 ? (
                renderRow(treeRoots, 1, false)
              ) : null}

              {unattached.length > 0 && (
                <div className={`w-full max-w-4xl ${treeRoots.length > 0 ? 'mt-10 border-t border-dashed border-slate-200 pt-6' : ''}`}>
                  <p className="mb-3 text-center text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                    No manager assigned &bull; {unattached.length}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2.5">
                    {unattached.map((n) => (
                      <PersonCard key={n.employeeId} node={n} variant="sub" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div id="org-list-view-stage" className="nv-card !rounded-3xl p-6">
          <h4 className="mb-5 text-xs font-black uppercase tracking-wider text-slate-800">Reporting Lines</h4>
          <div className="space-y-4">
            {managers.map((m) => {
              const theme = themeFor(m.departmentName)
              return (
                <div key={m.employeeId} className="ml-4 space-y-3 border-l-2 border-slate-100 pl-4 pt-2">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <button type="button" onClick={() => openEmployee(m)} className="flex cursor-pointer items-center gap-2.5 text-left">
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black ${theme.avatar}`}>
                        {getInitials(m.name)}
                      </span>
                      <span>
                        <span className="block text-xs font-bold leading-none text-slate-800">{m.name}</span>
                        <span className={`mt-1 block text-[10px] font-bold ${theme.text}`}>
                          {m.jobTitle || '—'} &bull; {m.departmentName || 'Unassigned'}
                        </span>
                      </span>
                    </button>
                    <span className={`rounded-xl px-2.5 py-1 text-[10px] font-black tracking-wide ${theme.badge}`}>
                      {m.children.length} direct {m.children.length === 1 ? 'report' : 'reports'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-3 pl-6 sm:grid-cols-2 md:grid-cols-3">
                    {m.children.map((c) => {
                      const cTheme = themeFor(c.departmentName)
                      return (
                        <button
                          key={c.employeeId}
                          type="button"
                          onClick={() => openEmployee(c)}
                          className={`flex cursor-pointer items-center gap-2 rounded-xl border border-slate-100 bg-white p-2.5 text-left shadow-xs transition-all hover:border-slate-200 hover:bg-slate-50 ${
                            isHighlighted(c) ? 'ring-2 ring-novora' : ''
                          }`}
                        >
                          <span className={`flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${cTheme.avatar}`}>
                            {getInitials(c.name)}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-[11px] font-extrabold text-slate-700">{c.name}</span>
                            <span className="block truncate text-[9.5px] font-semibold text-slate-400">{c.jobTitle || '—'}</span>
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
            {unattached.length > 0 && (
              <div className="ml-4 space-y-3 border-l-2 border-dashed border-slate-200 pl-4 pt-2">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">No manager assigned</p>
                <div className="grid grid-cols-1 gap-3 pl-6 sm:grid-cols-2 md:grid-cols-3">
                  {unattached.map((n) => (
                    <button
                      key={n.employeeId}
                      type="button"
                      onClick={() => openEmployee(n)}
                      className={`flex cursor-pointer items-center gap-2 rounded-xl border border-slate-100 bg-white p-2.5 text-left shadow-xs hover:border-slate-200 hover:bg-slate-50 ${
                        isHighlighted(n) ? 'ring-2 ring-novora' : ''
                      }`}
                    >
                      <span className={`flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${themeFor(n.departmentName).avatar}`}>
                        {getInitials(n.name)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[11px] font-extrabold text-slate-700">{n.name}</span>
                        <span className="block truncate text-[9.5px] font-semibold text-slate-400">{n.jobTitle || '—'}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {nodes.length > 0 && (
        <div id="replicated-chart-stats-footer" className="nv-card space-y-5 !rounded-3xl p-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {departments.slice(0, 5).map(([dept, count]) => {
              const theme = themeFor(dept)
              return (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setActiveDept(dept)}
                  className={`relative cursor-pointer overflow-hidden rounded-2xl border bg-white p-4 text-left shadow-xs transition-all duration-200 hover:-translate-y-0.5 ${
                    activeDept === dept ? theme.ring : 'border-slate-200/50 hover:border-slate-300'
                  }`}
                >
                  <div className={`absolute left-0 right-0 top-0 h-1 ${theme.bar}`} />
                  <p className="truncate text-[10px] font-black uppercase leading-none tracking-widest text-slate-400">{dept}</p>
                  <p className={`mt-2.5 text-2xl font-black leading-none ${theme.value}`}>{count}</p>
                </button>
              )
            })}
            <button
              type="button"
              onClick={() => setActiveDept('All')}
              className={`relative cursor-pointer overflow-hidden rounded-2xl border bg-[#f8fafc] p-4 text-left shadow-xs transition-all duration-200 hover:-translate-y-0.5 ${
                activeDept === 'All' ? 'border-slate-700 ring-1 ring-slate-700' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="absolute left-0 right-0 top-0 h-1 bg-slate-700" />
              <p className="text-[10px] font-black uppercase leading-none tracking-widest text-slate-500">Total</p>
              <p className="mt-2.5 text-2xl font-black leading-none text-slate-800">{nodes.length.toLocaleString()}</p>
            </button>
          </div>
          <div className="flex flex-col justify-between gap-4 border-t border-slate-100 pt-3 text-[11px] font-bold text-slate-400 sm:flex-row sm:items-center">
            <p className="leading-snug">Click any node to view details &bull; Dashed lines = direct reports</p>
            <div className="flex flex-wrap items-center gap-4">
              {departments.slice(0, 7).map(([dept]) => (
                <div key={dept} className="flex select-none items-center gap-1.5">
                  <span className="h-3 w-3 rounded" style={{ backgroundColor: themeFor(dept).swatch }} />
                  <span className="text-slate-700">{dept}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

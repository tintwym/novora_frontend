import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Search, Users, Building } from 'lucide-react'
import type { Employee, Department } from '@/types'
import { ApiError, fetchOrgChart, type OrgChartNode } from '@/services'
import ModuleHeader from '@/components/ui/ModuleHeader'

interface OrgChartTabProps {
  employees: Employee[]
  onSelectEmployee: (emp: Employee) => void
  addToast: (text: string, type: 'success' | 'info' | 'error' | 'loading') => void
}

type TreeNode = OrgChartNode & { children: TreeNode[] }

function mapDept(name: string | null | undefined): Department {
  const raw = (name ?? '').toLowerCase()
  if (raw.includes('eng')) return 'Engineering'
  if (raw.includes('fin')) return 'Finance'
  if (raw.includes('hr') || raw.includes('human')) return 'HR'
  if (raw.includes('market')) return 'Marketing'
  return 'Operations'
}

function buildTree(nodes: OrgChartNode[]): TreeNode[] {
  const byId = new Map<string, TreeNode>()
  for (const n of nodes) {
    byId.set(n.employeeId, { ...n, children: [] })
  }
  const roots: TreeNode[] = []
  for (const n of byId.values()) {
    const mgr = n.managerEmployeeId
    if (mgr && byId.has(mgr)) {
      byId.get(mgr)!.children.push(n)
    } else {
      roots.push(n)
    }
  }
  return roots
}

export default function OrgChartTab({ employees, onSelectEmployee, addToast }: OrgChartTabProps) {
  const [chartSearch, setChartSearch] = useState('')
  const [nodes, setNodes] = useState<OrgChartNode[]>([])
  const [loading, setLoading] = useState(true)

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

  const tree = useMemo(() => buildTree(nodes), [nodes])

  const filtered = useMemo(() => {
    const q = chartSearch.trim().toLowerCase()
    if (!q) return nodes
    return nodes.filter(
      (n) =>
        n.name.toLowerCase().includes(q) ||
        (n.jobTitle ?? '').toLowerCase().includes(q) ||
        (n.departmentName ?? '').toLowerCase().includes(q),
    )
  }, [chartSearch, nodes])

  const deptCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const n of nodes) {
      const d = n.departmentName || 'Other'
      counts[d] = (counts[d] || 0) + 1
    }
    return counts
  }, [nodes])

  const openEmployee = (node: OrgChartNode) => {
    const existing = employees.find(
      (e) => e.apiId === node.employeeId || e.name.toLowerCase() === node.name.toLowerCase(),
    )
    if (existing) {
      onSelectEmployee(existing)
      addToast(`Opening ${existing.name}`, 'success')
      return
    }
    const virtual: Employee = {
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
    }
    onSelectEmployee(virtual)
    addToast(`Opening ${node.name}`, 'info')
  }

  const getInitials = (fullName: string) =>
    fullName
      .split(/\s+/)
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()

  const renderNode = (node: TreeNode, depth = 0): React.ReactNode => (
    <li key={node.employeeId} className="list-none">
      <button
        type="button"
        onClick={() => openEmployee(node)}
        className={`mb-2 flex w-full max-w-sm items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2.5 text-left shadow-sm hover:border-novora/30 cursor-pointer ${
          depth > 0 ? 'ml-6' : ''
        }`}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[11px] font-bold text-white">
          {getInitials(node.name)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-slate-800">{node.name}</span>
          <span className="block truncate text-xs text-slate-500">
            {node.jobTitle || '—'} · {node.departmentName || '—'}
          </span>
        </span>
      </button>
      {node.children.length > 0 && (
        <ul className="border-l border-slate-100 pl-2">{node.children.map((c) => renderNode(c, depth + 1))}</ul>
      )}
    </li>
  )

    return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <ModuleHeader
        title="Organisation chart"
        description="Live reporting lines from your employee directory."
        actions={
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={chartSearch}
              onChange={(e) => setChartSearch(e.target.value)}
              placeholder="Search people or roles"
              className="nv-input w-full pl-9 text-xs"
            />
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 nv-stagger">
        <div className="nv-stat-card">
          <p className="text-xs text-slate-500">People</p>
          <p className="mt-1 text-xl font-bold text-slate-900">{loading ? '…' : nodes.length}</p>
        </div>
        {Object.entries(deptCounts)
          .slice(0, 3)
          .map(([name, count]) => (
            <div key={name} className="nv-stat-card">
              <p className="flex items-center gap-1 text-xs text-slate-500">
                <Building className="h-3 w-3" />
            {name}
          </p>
              <p className="mt-1 text-xl font-bold text-slate-900">{count}</p>
        </div>
          ))}
      </div>

      {loading ? (
        <p className="text-xs text-slate-400">Loading organisation chart…</p>
      ) : nodes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-10 text-center">
          <Users className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm font-semibold text-slate-600">No employees in the chart yet</p>
          <p className="mt-1 text-xs text-slate-400">Add employees to build the reporting hierarchy.</p>
          </div>
      ) : chartSearch ? (
        <ul className="space-y-2">
          {filtered.map((n) => (
            <li key={n.employeeId}>
              <button
                type="button"
                onClick={() => openEmployee(n)}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2.5 text-left hover:border-novora/30 cursor-pointer"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-novora text-[11px] font-bold text-white">
                  {getInitials(n.name)}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-800">{n.name}</span>
                  <span className="block text-xs text-slate-500">
                    {n.jobTitle || '—'} · {n.departmentName || '—'}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="space-y-1">{tree.map((n) => renderNode(n))}</ul>
      )}
    </div>
  )
}

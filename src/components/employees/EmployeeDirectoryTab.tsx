import { useMemo, useState } from 'react'
import { mockEmployeeDirectory } from '../../data/mockEmployeeDirectory'
import type { EmployeeDirectoryRow } from '../../types/employeeDirectory'
import {
  avatarColor,
  employeeFullName,
  employeeInitials,
} from '../../types/employeeDirectory'

type EmployeeDirectoryTabProps = {
  departmentFilter: string
  onOpenProfile: (employeeId: string | null) => void
  onAddEmployee: () => void
}

export function EmployeeDirectoryTab({
  departmentFilter,
  onOpenProfile,
  onAddEmployee,
}: EmployeeDirectoryTabProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const employees = useMemo(() => mockEmployeeDirectory(), [])

  const visible = employees.filter((e) => {
    if (departmentFilter !== 'All departments' && e.departmentName !== departmentFilter) return false
    if (statusFilter !== 'All' && e.status !== statusFilter.toLowerCase()) return false
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      employeeFullName(e).toLowerCase().includes(q) ||
      e.employeeCode.toLowerCase().includes(q) ||
      e.positionTitle.toLowerCase().includes(q)
    )
  })

  return (
    <div className="emp-directory">
      <div className="emp-directory-toolbar">
        <div className="emp-directory-search">
          <svg viewBox="0 0 24 24" aria-hidden>
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" />
          </svg>
          <input
            type="search"
            placeholder="Search employees by name, ID or position..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button type="button" className="emp-filter-icon" aria-label="Filters">
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M4 6h16M7 12h10M10 18h4" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
        <select
          className="emp-status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Status filter"
        >
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <button type="button" className="emp-add-employee-btn" onClick={onAddEmployee}>
          + Add Employee
        </button>
      </div>

      <div className="emp-directory-table-wrap">
        <table className="emp-directory-table">
          <thead>
            <tr>
              <th>EMPLOYEE NO.</th>
              <th>NAME</th>
              <th>DEPARTMENT</th>
              <th>POSITION</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <DirectoryRow key={row.id} row={row} onOpen={() => onOpenProfile(row.id.startsWith('mock-') ? null : row.id)} />
            ))}
          </tbody>
        </table>
        {visible.length === 0 ? (
          <p className="emp-directory-empty">No employees match your filters.</p>
        ) : null}
      </div>
    </div>
  )
}

function DirectoryRow({ row, onOpen }: { row: EmployeeDirectoryRow; onOpen: () => void }) {
  const name = employeeFullName(row)
  const color = avatarColor(name)
  const active = row.status === 'active'

  return (
    <tr>
      <td className="emp-code">{row.employeeCode}</td>
      <td>
        <div className="emp-directory-name">
          <span className="emp-directory-avatar" style={{ color, background: `${color}26` }}>
            {employeeInitials(row)}
          </span>
          <div>
            <strong>{name}</strong>
            <span>Joined {row.hireDate}</span>
          </div>
        </div>
      </td>
      <td>{row.departmentName}</td>
      <td>{row.positionTitle}</td>
      <td>
        <span className={`emp-status-dot${active ? '' : ' inactive'}`}>
          <span aria-hidden />
          {active ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td>
        <button type="button" className="emp-open-link" onClick={onOpen}>
          Open ›
        </button>
      </td>
    </tr>
  )
}

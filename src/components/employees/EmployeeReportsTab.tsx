import { useMemo, useState } from 'react'
import { mockStaffingRegister } from '../../data/mockStaffingRegister'
import {
  CONTRACT_MIX,
  DEPT_DISTRIBUTION,
  REPORT_EMPLOYMENT_TYPES,
  REPORT_SECTORS,
  TENURE_BREAKDOWN,
  formatHireDate,
  staffingFullName,
  staffingInitials,
  type ContractSlice,
  type DeptDistribution,
  type StaffingRegisterEntry,
  type TenureBar,
} from '../../types/employeeReports'

const KPI_CARDS = [
  {
    title: 'TOTAL ROSTER CHECKED',
    value: '13',
    subtext: 'of 13 corporate staff',
    footer: '13 Currently Active in operations',
    footerColor: 'success',
    icon: 'people',
    iconColor: '#3b82f6',
  },
  {
    title: 'PERMANENT CORE STABILITY',
    value: '92%',
    subtext: '↑ 2.1% YoY gain',
    subtextTone: 'success',
    footer: '12 permanent positions securely staffed',
    footerColor: 'primary',
    icon: 'building',
    iconColor: '#8b5cf6',
  },
  {
    title: 'ACTIVE OUT-OF-OFFICE STATE',
    value: '0',
    subtext: 'On approved leaves',
    subtextTone: 'warning',
    footer: 'No staff currently out-of-office',
    footerColor: 'warning',
    icon: 'clock',
    iconColor: '#ef4444',
  },
  {
    title: 'FAMILY INSURED DEPENDENTS',
    value: '8',
    valueTone: 'primary',
    subtext: 'insured units',
    footer: '100% full panel insurance coverage',
    footerColor: 'success',
    icon: 'heart',
    iconColor: '#10b981',
  },
] as const

export function EmployeeReportsTab() {
  const [sector, setSector] = useState<string>(REPORT_SECTORS[0])
  const [employmentType, setEmploymentType] = useState<string>(REPORT_EMPLOYMENT_TYPES[0])
  const [registerSearch, setRegisterSearch] = useState('')

  const allRows = useMemo(() => mockStaffingRegister(), [])

  const registerRows = useMemo(() => {
    const q = registerSearch.trim().toLowerCase()
    return allRows.filter((e) => {
      if (sector !== REPORT_SECTORS[0] && e.sector !== sector) return false
      if (employmentType !== REPORT_EMPLOYMENT_TYPES[0] && e.employmentType !== employmentType) return false
      if (!q) return true
      return (
        staffingFullName(e).toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.employeeCode.toLowerCase().includes(q) ||
        e.position.toLowerCase().includes(q) ||
        e.identityDoc.toLowerCase().includes(q)
      )
    })
  }, [allRows, sector, employmentType, registerSearch])

  return (
    <div className="emp-reports-tab">
      <div className="emp-reports-filter-bar">
        <div className="emp-reports-filters">
          <FilterDropdown
            label="TARGET SECTOR"
            value={sector}
            options={[...REPORT_SECTORS]}
            onChange={setSector}
          />
          <FilterDropdown
            label="EMPLOYMENT TYPE"
            value={employmentType}
            options={[...REPORT_EMPLOYMENT_TYPES]}
            onChange={setEmploymentType}
          />
        </div>
        <div className="emp-reports-actions">
          <button type="button" className="emp-reports-export-demo">
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" strokeWidth="2" />
              <polyline points="14 2 14 8 20 8" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            Export Demographics
          </button>
          <button type="button" className="emp-reports-print-btn">
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" fill="none" stroke="currentColor" strokeWidth="2" />
              <rect x="6" y="14" width="12" height="8" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            Print Executive Staff Audit
          </button>
        </div>
      </div>

      <div className="emp-reports-kpi-row">
        {KPI_CARDS.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </div>

      <div className="emp-reports-analytics">
        <section className="emp-reports-card emp-reports-dept-card">
          <h3>INTERNAL ROSTER DISTRIBUTION BY DEPARTMENT</h3>
          <p>Calculated percent of total database staff mapped to sectors.</p>
          <div className="emp-reports-dept-list">
            {DEPT_DISTRIBUTION.map((d) => (
              <DeptDistributionRow key={d.label} data={d} />
            ))}
          </div>
        </section>

        <div className="emp-reports-analytics-right">
          <section className="emp-reports-card">
            <h3>INTERNAL SERVICE LONGEVITY / TENURE BREAKDOWN</h3>
            <p>Years of service calculated from historical joining rosters.</p>
            <div className="emp-reports-tenure-list">
              {TENURE_BREAKDOWN.map((t) => (
                <TenureBarRow key={t.label} data={t} />
              ))}
            </div>
          </section>

          <section className="emp-reports-card">
            <h3>CONTRACT TYPOLOGY RATIO</h3>
            <ContractRatioBar slices={CONTRACT_MIX} />
            <div className="emp-reports-contract-legend">
              {CONTRACT_MIX.map((s) => (
                <span key={s.label}>
                  <i style={{ background: s.color }} aria-hidden />
                  {s.label} ({s.count})
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>

      <section className="emp-reports-card emp-reports-register">
        <div className="emp-reports-register-head">
          <div>
            <h2>Dynamic Granular Staffing Register • Audit Trail</h2>
            <p>
              Refined with NRIC codes, private mobile numbers, emergency contacts, and active insurance
              dependents.
            </p>
          </div>
          <div className="emp-reports-register-tools">
            <div className="emp-reports-register-search">
              <svg viewBox="0 0 24 24" aria-hidden>
                <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" />
              </svg>
              <input
                type="search"
                placeholder="Find name, position, ID..."
                value={registerSearch}
                onChange={(e) => setRegisterSearch(e.target.value)}
              />
            </div>
            <button type="button" className="emp-reports-export-records">
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d="M12 3v12M7 10l5 5 5-5M5 21h14" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
              Export Records
            </button>
          </div>
        </div>

        <div className="emp-reports-table-wrap">
          <table className="emp-reports-table">
            <thead>
              <tr>
                <th>STAFF NO.</th>
                <th>EMPLOYEE NAME</th>
                <th>SECTOR &amp; POSITION</th>
                <th>TYPE • HIRE DATE</th>
                <th>IDENTITIES (NRIC / PASS)</th>
                <th>EMERGENCY CONTACT &amp; DEPENDENTS</th>
                <th>OPERATION STATUS</th>
              </tr>
            </thead>
            <tbody>
              {registerRows.map((row) => (
                <RegisterRow key={row.employeeCode} row={row} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="emp-reports-register-foot">
          <span>
            Displaying {registerRows.length} qualified logs — Cross-checked with Novora HRM ledger keys
          </span>
          <span className="emp-reports-verified">
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            ENCRYPTED LEDGER VERIFIED
          </span>
        </div>
      </section>
    </div>
  )
}

function FilterDropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <label className="emp-reports-filter">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}

function KpiCard({
  title,
  value,
  subtext,
  subtextTone,
  valueTone,
  footer,
  footerColor,
  icon,
  iconColor,
}: {
  title: string
  value: string
  subtext: string
  subtextTone?: string
  valueTone?: string
  footer: string
  footerColor: string
  icon: string
  iconColor: string
}) {
  return (
    <article className="emp-reports-kpi-card">
      <div className="emp-reports-kpi-top">
        <div>
          <span className="emp-reports-kpi-title">{title}</span>
          <strong className={valueTone ? `tone-${valueTone}` : ''}>{value}</strong>
          <span className={subtextTone ? `tone-${subtextTone}` : 'muted'}>{subtext}</span>
        </div>
        <span className="emp-reports-kpi-icon" style={{ background: `${iconColor}1f`, color: iconColor }}>
          <KpiIcon name={icon} />
        </span>
      </div>
      <p className={`emp-reports-kpi-footer footer-${footerColor}`}>
        <span aria-hidden />
        {footer}
      </p>
    </article>
  )
}

function KpiIcon({ name }: { name: string }) {
  if (name === 'people') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'building') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <rect x="4" y="2" width="16" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'clock') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 6v6l4 2" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function DeptDistributionRow({ data }: { data: DeptDistribution }) {
  const pct = Math.round(data.fraction * 100)
  return (
    <div className="emp-reports-dept-row">
      <div className="emp-reports-dept-row-head">
        <i style={{ background: data.color }} aria-hidden />
        <span>{data.label}</span>
        <em>
          {data.count} Members • {pct}%
        </em>
      </div>
      <div className="emp-reports-bar-track">
        <span style={{ width: `${pct}%`, background: data.color }} />
      </div>
    </div>
  )
}

function TenureBarRow({ data }: { data: TenureBar }) {
  const pct = Math.round(data.fraction * 100)
  return (
    <div className="emp-reports-tenure-row">
      <div className="emp-reports-tenure-head">
        <span>{data.label}</span>
        <em>
          {data.count} ({pct}%)
        </em>
      </div>
      <div className="emp-reports-bar-track tall">
        <span style={{ width: `${pct}%`, background: data.color }} />
      </div>
    </div>
  )
}

function ContractRatioBar({ slices }: { slices: ContractSlice[] }) {
  const total = slices.reduce((s, e) => s + e.count, 0)
  if (total === 0) return <div className="emp-reports-contract-bar empty" />

  return (
    <div className="emp-reports-contract-bar">
      {slices
        .filter((s) => s.count > 0)
        .map((s) => (
          <span key={s.label} style={{ flex: s.count, background: s.color }} title={`${s.label} (${s.count})`} />
        ))}
    </div>
  )
}

function RegisterRow({ row }: { row: StaffingRegisterEntry }) {
  const name = staffingFullName(row)
  const sectorColor =
    {
      Engineering: '#2563eb',
      Finance: '#059669',
      HR: '#9333ea',
      Marketing: '#db2777',
      Operations: '#d97706',
    }[row.sector] ?? '#64748b'

  return (
    <tr>
      <td className="emp-reports-code">{row.employeeCode}</td>
      <td>
        <div className="emp-reports-person">
          <span className="emp-reports-avatar" style={{ background: row.avatarColor }}>
            {staffingInitials(row)}
          </span>
          <div>
            <strong>{name}</strong>
            <span>{row.email}</span>
          </div>
        </div>
      </td>
      <td>
        <strong>{row.position}</strong>
        <span className="emp-reports-sector-text" style={{ color: sectorColor }}>
          {row.sector}
        </span>
      </td>
      <td>
        <strong>{row.employmentType}</strong>
        <span>Joined {formatHireDate(row.hireDate)}</span>
      </td>
      <td>
        <strong>{row.identityDoc}</strong>
        <span>{row.phone}</span>
      </td>
      <td className="emp-reports-emergency">
        <strong>{row.emergencyContact}</strong>
        <span>{row.dependents}</span>
      </td>
      <td>
        <span className="emp-reports-status">
          <span aria-hidden />
          {row.status}
        </span>
      </td>
    </tr>
  )
}

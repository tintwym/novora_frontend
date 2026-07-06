import type { ProfileHeader } from '../../types/employeeProfile'
import { HrPill } from '../hr/HrPrimitives'

export function ProfileHeaderCard({ header }: { header: ProfileHeader }) {
  const metrics = [
    ['Tenure', header.tenureLabel],
    ['Pay Grade', header.payGradeLabel],
    ['Leave Left', header.leaveLeftLabel],
    ['Performance', header.performanceLabel],
  ] as const

  return (
    <section className="emp-profile-header">
      <div className="emp-profile-identity">
        <span className="emp-avatar">{header.initials}</span>
        <div>
          <div className="emp-name-row">
            <h2>{header.fullName}</h2>
            <HrPill tone="success">● {header.statusLabel}</HrPill>
          </div>
          <p className="emp-meta">
            <span>🪪 {header.employeeCode}</span>
            <span>📍 {header.location}</span>
          </p>
          <p className="emp-role">{header.departmentTitle}</p>
          <p className="emp-reports">Reports to: {header.reportsTo}</p>
        </div>
      </div>
      <div className="emp-profile-metrics">
        {metrics.map(([label, value], i) => (
          <div key={label} className="emp-metric">
            {i > 0 ? <span className="emp-metric-divider" aria-hidden /> : null}
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

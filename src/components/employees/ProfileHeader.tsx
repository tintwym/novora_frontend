import type { ProfileHeader } from '../../types/employeeProfile'
import { HrPill } from '../hr/HrPrimitives'

function MetaIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="emp-meta-icon" aria-hidden>
      {children}
    </span>
  )
}

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
            <HrPill tone="success">{header.statusLabel}</HrPill>
          </div>
          <p className="emp-meta">
            <span>
              <MetaIcon>
                <svg viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M7 9h10M7 13h6" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </MetaIcon>
              {header.employeeCode}
            </span>
            <span>
              <MetaIcon>
                <svg viewBox="0 0 24 24">
                  <path d="M12 21s7-5.2 7-11a7 7 0 10-14 0c0 5.8 7 11 7 11z" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="10" r="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </MetaIcon>
              {header.location}
            </span>
          </p>
          <p className="emp-role">{header.departmentTitle}</p>
          <p className="emp-reports">Reports to: {header.reportsTo}</p>
        </div>
      </div>
      <div className="emp-profile-metrics">
        {metrics.map(([label, value]) => (
          <div key={label} className="emp-metric">
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

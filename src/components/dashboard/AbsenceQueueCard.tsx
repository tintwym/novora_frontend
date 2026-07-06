import { useNavigate } from 'react-router-dom'
import type { LeaveRequest } from '../../types/dashboard'
import { CardHeader, DashboardCard, SectionLink } from './DashboardCard'
import { StatusBadge } from './StatusBadge'

export function AbsenceQueueCard({ requests }: { requests: LeaveRequest[] }) {
  const navigate = useNavigate()

  return (
    <DashboardCard>
      <CardHeader
        title="ABSENCE QUEUE"
        action={<SectionLink label="ACTION LIST" onClick={() => navigate('/leave')} />}
      />
      {requests.length === 0 ? (
        <p className="dash-empty">No leave requests yet.</p>
      ) : (
        <ul className="dash-list">
          {requests.map((r, i) => (
            <li key={r.name + r.dates} className={i < requests.length - 1 ? 'with-divider' : ''}>
              <span className="dash-avatar" style={{ color: r.color, background: `${r.color}26` }}>
                {r.initials}
              </span>
              <div className="dash-list-body">
                <strong>{r.name}</strong>
                <span>
                  {r.type} · {r.dates}
                </span>
              </div>
              <StatusBadge label={r.status} />
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  )
}

import { useNavigate } from 'react-router-dom'
import type { RecentHire } from '../../types/dashboard'
import { CardHeader, DashboardCard, SectionLink } from './DashboardCard'

export function RecentHiresCard({ hires }: { hires: RecentHire[] }) {
  const navigate = useNavigate()

  return (
    <DashboardCard>
      <CardHeader
        title="NEW TALENT"
        action={<SectionLink label="EXPLORER" onClick={() => navigate('/recruitment')} />}
      />
      <ul className="dash-list">
        {hires.map((h, i) => (
          <li key={h.name} className={i < hires.length - 1 ? 'with-divider' : ''}>
            <span className="dash-avatar" style={{ color: h.color, background: `${h.color}26` }}>
              {h.initials}
            </span>
            <div className="dash-list-body">
              <strong>{h.name}</strong>
              <span>{h.role}</span>
            </div>
            <time className="dash-list-meta">{h.date}</time>
          </li>
        ))}
      </ul>
    </DashboardCard>
  )
}

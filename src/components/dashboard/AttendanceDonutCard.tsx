import type { AttendanceSlice } from '../../types/dashboard'
import { CardHeader, DashboardCard, LiveBadge } from './DashboardCard'

type AttendanceDonutCardProps = {
  slices: AttendanceSlice[]
  ratePercent: number
}

export function AttendanceDonutCard({ slices, ratePercent }: AttendanceDonutCardProps) {
  const positive = slices.filter((s) => s.value > 0)
  const total = positive.reduce((sum, s) => sum + s.value, 0) || 1
  const radius = 52
  const circumference = 2 * Math.PI * radius
  let offset = 0

  const segments = positive.map((slice) => {
    const len = (slice.value / total) * circumference
    const seg = { ...slice, dash: len, offset }
    offset += len
    return seg
  })

  return (
    <DashboardCard>
      <CardHeader title="ATTENDANCE" action={<LiveBadge />} />
      <div className="dash-donut-wrap">
        <svg viewBox="0 0 150 150" className="dash-donut" role="img" aria-label="Attendance breakdown">
          <g transform="rotate(-90 75 75)">
            <circle cx="75" cy="75" r={radius} className="dash-donut-track" />
            {segments.map((seg) => (
              <circle
                key={seg.label}
                cx="75"
                cy="75"
                r={radius}
                className="dash-donut-segment"
                stroke={seg.color}
                strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
                strokeDashoffset={-seg.offset}
              />
            ))}
          </g>
        </svg>
        <div className="dash-donut-center">
          <strong>{ratePercent.toFixed(1)}%</strong>
          <span>Attendance rate</span>
        </div>
      </div>
      <div className="dash-donut-legend">
        {slices.map((slice) => (
          <div key={slice.label} className="dash-legend-row">
            <span className="dash-legend-dot" style={{ background: slice.color }} />
            <span className="dash-legend-label">{slice.label}</span>
            <span className="dash-legend-value">{slice.displayPercent}</span>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}

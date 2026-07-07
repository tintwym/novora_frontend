import { useEffect, useMemo, useRef, useState } from 'react'
import type { GrowthPoint } from '../../types/dashboard'
import { GROWTH_PERIODS } from '../../types/dashboard'
import { CardHeader, DashboardCard } from './DashboardCard'

type WorkforceTrendsCardProps = {
  points: GrowthPoint[]
  labels: string[]
  growthMonths: number
  loading?: boolean
  onPeriodChange: (months: number) => void
}

function axisBounds(points: GrowthPoint[]) {
  if (!points.length) return { minY: 600, maxY: 1400 }
  const ys = points.map((p) => p.y)
  const dataMin = Math.min(...ys)
  const dataMax = Math.max(...ys)
  const range = Math.max(dataMax - dataMin, 1)
  const padding = range * 0.15
  let minY = dataMin - padding
  let maxY = dataMax + padding
  const interval = range <= 120 ? 100 : 200
  minY = Math.floor(minY / interval) * interval
  maxY = Math.ceil(maxY / interval) * interval
  if (maxY <= minY) maxY = minY + interval
  return { minY, maxY, interval }
}

export function WorkforceTrendsCard({
  points,
  labels,
  growthMonths,
  loading,
  onPeriodChange,
}: WorkforceTrendsCardProps) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const period = GROWTH_PERIODS.find((p) => p.months === growthMonths) ?? GROWTH_PERIODS[0]

  useEffect(() => {
    if (!open) return
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [open])

  const chart = useMemo(() => {
    const width = 560
    const height = 200
    const padL = 44
    const padR = 12
    const padT = 8
    const padB = 28
    const { minY, maxY } = axisBounds(points)
    const innerW = width - padL - padR
    const innerH = height - padT - padB
    const maxX = Math.max(points.length - 1, 1)

    const toX = (x: number) => padL + (x / maxX) * innerW
    const toY = (y: number) => padT + innerH - ((y - minY) / (maxY - minY)) * innerH

    const line = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.x)} ${toY(p.y)}`)
      .join(' ')

    const area = `${line} L ${toX(points[points.length - 1]?.x ?? 0)} ${toY(minY)} L ${toX(points[0]?.x ?? 0)} ${toY(minY)} Z`

    const yTicks = []
    const step = maxY - minY <= 300 ? 50 : 100
    for (let v = minY; v <= maxY; v += step) {
      yTicks.push({ v, y: toY(v) })
    }

    return { width, height, line, area, yTicks, toX, toY, minY, maxY, padL, padB, innerH }
  }, [points])

  return (
    <DashboardCard className="dash-card-wide">
      <CardHeader
        title="WORKFORCE TRENDS"
        action={
          <div className="dash-period-wrap" ref={wrapRef}>
            <button
              type="button"
              className="dash-period-chip"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
            >
              {period.label} ▾
              {loading ? <span className="dash-period-spinner" aria-hidden /> : null}
            </button>
            {open ? (
              <ul className="dash-period-menu" role="menu">
                {GROWTH_PERIODS.map((p) => (
                  <li key={p.months}>
                    <button
                      type="button"
                      role="menuitem"
                      className={p.months === growthMonths ? 'active' : ''}
                      onClick={() => {
                        setOpen(false)
                        if (p.months !== growthMonths) onPeriodChange(p.months)
                      }}
                    >
                      {p.label}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        }
      />
      <p className="dash-card-subtitle">
        Dynamic personnel volume over continuous evaluation periods
      </p>
      <div className="dash-chart-wrap">
        <svg
          viewBox={`0 0 ${chart.width} ${chart.height}`}
          className="dash-line-chart"
          role="img"
          aria-label="Workforce trends line chart"
        >
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
              <stop offset="55%" stopColor="#93c5fd" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
            </linearGradient>
          </defs>
          {chart.yTicks.map((t) => (
            <g key={t.v}>
              <line
                x1={chart.padL}
                x2={chart.width - 12}
                y1={t.y}
                y2={t.y}
                className="dash-chart-grid"
              />
              <text x={chart.padL - 6} y={t.y + 4} textAnchor="end" className="dash-chart-axis">
                {Math.round(t.v)}
              </text>
            </g>
          ))}
          <path d={chart.area} fill="url(#trendFill)" />
          <path d={chart.line} className="dash-chart-line" />
          {points.map((p) => (
            <circle key={p.x} cx={chart.toX(p.x)} cy={chart.toY(p.y)} r="3" className="dash-chart-dot" />
          ))}
          {labels.map((label, i) => (
            <text
              key={label + i}
              x={chart.toX(i)}
              y={chart.height - 6}
              textAnchor="middle"
              className="dash-chart-axis"
            >
              {label}
            </text>
          ))}
        </svg>
      </div>
    </DashboardCard>
  )
}

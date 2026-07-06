import type { ReactNode } from 'react'
import type { RecruitPillTone } from '../../types/recruitment'

const PILL_STYLES: Record<RecruitPillTone, { bg: string; fg: string }> = {
  success: { bg: '#d1fae5', fg: '#065f46' },
  info: { bg: '#dbeafe', fg: '#2563eb' },
  warning: { bg: '#ffedd5', fg: '#c2410c' },
  danger: { bg: '#fee2e2', fg: '#991b1b' },
  purple: { bg: '#ede9fe', fg: '#5b21b6' },
  pink: { bg: '#fce7f3', fg: '#9d174d' },
  neutral: { bg: '#f1f5f9', fg: '#475569' },
}

export function RecruitPill({ label, tone = 'neutral' }: { label: string; tone?: RecruitPillTone }) {
  const s = PILL_STYLES[tone]
  return (
    <span className="recruit-pill" style={{ background: s.bg, color: s.fg }}>
      {label}
    </span>
  )
}

export function RecruitIconKpi({
  title,
  value,
  subtext,
  icon,
  iconColor,
  valueTone,
  trend,
}: {
  title: string
  value: string
  subtext: string
  icon: ReactNode
  iconColor: string
  valueTone?: string
  trend?: string
}) {
  return (
    <article className="recruit-kpi-card">
      <div className="recruit-kpi-top">
        <div>
          <span className="recruit-kpi-title">{title}</span>
          <strong className={valueTone ? `tone-${valueTone}` : ''}>{value}</strong>
          {trend ? <em className="tone-success">{trend}</em> : null}
          <span className="muted">{subtext}</span>
        </div>
        <span className="recruit-kpi-icon" style={{ background: `${iconColor}1f`, color: iconColor }}>
          {icon}
        </span>
      </div>
    </article>
  )
}

export function RecruitHBar({
  label,
  value,
  max,
  color,
  trailing,
}: {
  label: string
  value: number
  max: number
  color: string
  trailing: string
}) {
  const pct = Math.round((value / max) * 100)
  return (
    <div className="recruit-hbar">
      <div className="recruit-hbar-head">
        <span>{label}</span>
        <em>{trailing}</em>
      </div>
      <div className="recruit-hbar-track">
        <span style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

export function RecruitScoreBar({ label, percent, color }: { label: string; percent: number; color: string }) {
  return (
    <div className="recruit-score-bar">
      <span>{label}</span>
      <div className="recruit-score-track">
        <span style={{ width: `${percent}%`, background: color }} />
      </div>
      <em>{percent}%</em>
    </div>
  )
}

export function RecruitCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`recruit-card${className ? ` ${className}` : ''}`}>{children}</section>
}

export function FunnelPills({ counts }: { counts: number[] }) {
  const labels = ['A', 'S', 'I', 'O', 'H']
  const colors = ['#2563eb', '#60a5fa', '#8b5cf6', '#f59e0b', '#10b981']
  return (
    <div className="recruit-funnel-pills">
      {counts.map((c, i) => (
        <span key={labels[i]} style={{ background: `${colors[i]}26`, color: colors[i], borderColor: `${colors[i]}66` }}>
          {c} {labels[i]}
        </span>
      ))}
    </div>
  )
}

type StatusBadgeProps = {
  label: string
}

export function StatusBadge({ label }: StatusBadgeProps) {
  const key = label.toLowerCase()
  const tone = key.includes('approve')
    ? 'approved'
    : key.includes('reject')
      ? 'rejected'
      : 'pending'
  return <span className={`dash-status-badge ${tone}`}>{label.toUpperCase()}</span>
}

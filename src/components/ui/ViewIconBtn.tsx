import { ViewIcon } from './ViewIcon'

export function ViewIconBtn({
  onClick,
  className = 'hr-icon-btn',
  label = 'View',
}: {
  onClick?: () => void
  className?: string
  label?: string
}) {
  return (
    <button type="button" className={className} aria-label={label} onClick={onClick}>
      <ViewIcon />
    </button>
  )
}

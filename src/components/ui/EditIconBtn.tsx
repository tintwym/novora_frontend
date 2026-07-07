import { EditIcon } from './EditIcon'

export function EditIconBtn({
  onClick,
  className = 'hr-icon-btn',
  label = 'Edit',
}: {
  onClick?: () => void
  className?: string
  label?: string
}) {
  return (
    <button type="button" className={className} aria-label={label} onClick={onClick}>
      <EditIcon />
    </button>
  )
}

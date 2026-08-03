import { useId } from 'react'

type NovoraMarkProps = {
  className?: string
  title?: string
}

/** App-shell mark: tilted blue frame + orange dot. */
export default function NovoraMark({
  className = 'h-7 w-7',
  title = 'Novora',
}: NovoraMarkProps) {
  const uid = useId().replace(/:/g, '')
  const gradientId = `novora-mark-blue-${uid}`

  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <defs>
        <linearGradient id={gradientId} x1="2" y1="30" x2="30" y2="2" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="0.45" stopColor="#0a9cf5" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <g transform="rotate(14 16 16)">
        <rect x="3.5" y="3.5" width="25" height="25" rx="6" fill={`url(#${gradientId})`} />
        <rect x="9" y="9" width="14" height="14" rx="3" fill="#ffffff" />
      </g>
      <circle cx="10.5" cy="9.5" r="4.25" fill="#f59e0b" />
      <circle cx="10.5" cy="9.5" r="4.25" fill="#fb923c" fillOpacity="0.35" />
    </svg>
  )
}

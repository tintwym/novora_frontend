import type { SVGProps } from 'react'
import { useId } from 'react'

export type NovoraProduct = 'hrms' | 'crm' | 'accounting'

type NovoraLogoProps = {
  className?: string
  title?: string
  /** Tints the shared mark toward the product chrome accent. */
  product?: NovoraProduct
} & Omit<SVGProps<SVGSVGElement>, 'viewBox'>

const PALETTE: Record<
  NovoraProduct,
  { cyan: [string, string, string]; orange: [string, string]; blue: [string, string]; figure: string }
> = {
  hrms: {
    cyan: ['#00a7e1', '#00b2a9', '#7cb342'],
    orange: ['#ff9800', '#f57c00'],
    blue: ['#0a58a4', '#00a7e1'],
    figure: '#00a7e1',
  },
  crm: {
    cyan: ['#0d9488', '#10b981', '#34d399'],
    orange: ['#f59e0b', '#d97706'],
    blue: ['#047857', '#10b981'],
    figure: '#10b981',
  },
  accounting: {
    cyan: ['#2d6a4f', '#40916c', '#52b788'],
    orange: ['#c9a227', '#a67c00'],
    blue: ['#1b4332', '#2d6a4f'],
    figure: '#40916c',
  },
}

/** Official Novora people / swoosh mark (matches landing + favicon). */
export default function NovoraLogo({
  className = 'h-10 w-10',
  title = 'Novora',
  product = 'hrms',
  ...props
}: NovoraLogoProps) {
  const uid = useId().replace(/:/g, '')
  const cyanTeal = `novora-cyan-${uid}`
  const orangeYellow = `novora-orange-${uid}`
  const blue = `novora-blue-${uid}`
  const p = PALETTE[product]

  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      {...props}
    >
      <title>{title}</title>
      <defs>
        <linearGradient id={cyanTeal} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={p.cyan[0]} />
          <stop offset="60%" stopColor={p.cyan[1]} />
          <stop offset="100%" stopColor={p.cyan[2]} />
        </linearGradient>
        <linearGradient id={orangeYellow} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={p.orange[0]} />
          <stop offset="100%" stopColor={p.orange[1]} />
        </linearGradient>
        <linearGradient id={blue} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={p.blue[0]} />
          <stop offset="100%" stopColor={p.blue[1]} />
        </linearGradient>
      </defs>

      <circle cx="42" cy="23" r="8" fill="#e2e8f0" />
      <path d="M 42 35 C 33 39, 36 50, 48 53 C 48 53, 49 43, 42 35 Z" fill="#cbd5e1" />

      <circle cx="24" cy="28" r="8" fill={p.figure} />
      <path
        d="M 12 70 C 14 55, 18 40, 28 38 C 38 36, 42 50, 48 58 C 55 67, 60 70, 68 62 C 60 74, 45 74, 38 66 C 30 57, 24 45, 18 56 C 14 62, 13 67, 12 70 Z"
        fill={`url(#${cyanTeal})`}
      />

      <circle cx="68" cy="27" r="8" fill={`url(#${orangeYellow})`} />
      <path
        d="M 68 35 C 58 45, 52 58, 52 68 C 52 75, 58 78, 64 70 C 70 60, 78 45, 88 25 C 80 23, 72 28, 68 35 Z"
        fill={`url(#${orangeYellow})`}
      />
      <path
        d="M 52 68 C 52 75, 58 84, 68 84 C 78 84, 82 72, 88 50 C 85 64, 78 74, 68 74 C 62 74, 56 71, 52 68 Z"
        fill={`url(#${blue})`}
      />
    </svg>
  )
}

import { useId, type HTMLAttributes } from 'react'

type NovoraBrandSize = 'xs' | 'sm' | 'md' | 'lg'
type NovoraBrandTone = 'light' | 'dark'

const MARK_SIZE: Record<NovoraBrandSize, string> = {
  xs: 'w-7 h-7',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
}

const NAME_SIZE: Record<NovoraBrandSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}

const TAG_SIZE: Record<NovoraBrandSize, string> = {
  xs: 'text-[7px]',
  sm: 'text-[8px]',
  md: 'text-[9px]',
  lg: 'text-[10px]',
}

type NovoraLogoMarkProps = HTMLAttributes<SVGSVGElement> & {
  idPrefix?: string
}

export function NovoraLogoMark({ className, idPrefix, ...props }: NovoraLogoMarkProps) {
  const autoId = useId().replace(/:/g, '')
  const prefix = idPrefix ?? autoId

  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...props}
    >
      <defs>
        <linearGradient id={`${prefix}CyanTeal`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00a7e1" />
          <stop offset="60%" stopColor="#00b2a9" />
          <stop offset="100%" stopColor="#7cb342" />
        </linearGradient>
        <linearGradient id={`${prefix}OrangeYellow`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff9800" />
          <stop offset="100%" stopColor="#f57c00" />
        </linearGradient>
        <linearGradient id={`${prefix}Blue`} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0a58a4" />
          <stop offset="100%" stopColor="#00a7e1" />
        </linearGradient>
      </defs>
      <circle cx="42" cy="23" r="8" fill="#e2e8f0" />
      <path d="M 42 35 C 33 39, 36 50, 48 53 C 48 53, 49 43, 42 35 Z" fill="#cbd5e1" />
      <circle cx="24" cy="28" r="8" fill="#00a7e1" />
      <path
        d="M 12 70 C 14 55, 18 40, 28 38 C 38 36, 42 50, 48 58 C 55 67, 60 70, 68 62 C 60 74, 45 74, 38 66 C 30 57, 24 45, 18 56 C 14 62, 13 67, 12 70 Z"
        fill={`url(#${prefix}CyanTeal)`}
      />
      <circle cx="68" cy="27" r="8" fill={`url(#${prefix}OrangeYellow)`} />
      <path
        d="M 68 35 C 58 45, 52 58, 52 68 C 52 75, 58 78, 64 70 C 70 60, 78 45, 88 25 C 80 23, 72 28, 68 35 Z"
        fill={`url(#${prefix}OrangeYellow)`}
      />
      <path
        d="M 52 68 C 52 75, 58 84, 68 84 C 78 84, 82 72, 88 50 C 85 64, 78 74, 68 74 C 62 74, 56 71, 52 68 Z"
        fill={`url(#${prefix}Blue)`}
      />
    </svg>
  )
}

type NovoraBrandProps = HTMLAttributes<HTMLDivElement> & {
  size?: NovoraBrandSize
  tone?: NovoraBrandTone
  showTagline?: boolean
  tagline?: string
  markClassName?: string
}

export function NovoraBrand({
  size = 'md',
  tone = 'light',
  showTagline = true,
  tagline = 'HRMS SOFTWARE',
  className = '',
  markClassName = '',
  ...props
}: NovoraBrandProps) {
  const nameTone = tone === 'dark' ? 'text-white' : 'text-slate-900'
  const tagTone = tone === 'dark' ? 'text-[#00a7e1]' : 'text-[#0a58a4]'

  return (
    <div className={`flex items-center gap-2 min-w-0 ${className}`} {...props}>
      <div className={`${MARK_SIZE[size]} flex items-center justify-center shrink-0`}>
        <NovoraLogoMark className={`${MARK_SIZE[size]} ${markClassName}`} />
      </div>
      <div className="min-w-0">
        <span
          className={`font-extrabold ${NAME_SIZE[size]} tracking-wider ${nameTone} block leading-none`}
        >
          NOVORA
        </span>
        {showTagline ? (
          <span
            className={`${TAG_SIZE[size]} font-bold ${tagTone} tracking-widest block mt-0.5 uppercase leading-none`}
          >
            {tagline}
          </span>
        ) : null}
      </div>
    </div>
  )
}

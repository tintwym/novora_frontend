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
        <linearGradient id={`${prefix}Badge`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0a58a4" />
          <stop offset="55%" stopColor="#00a7e1" />
          <stop offset="100%" stopColor="#00b2a9" />
        </linearGradient>
        <linearGradient id={`${prefix}Spark`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffb74d" />
          <stop offset="100%" stopColor="#f57c00" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="88" height="88" rx="24" fill={`url(#${prefix}Badge)`} />
      <path
        d="M34 71 V33 L66 67 V29"
        fill="none"
        stroke="#ffffff"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="69" cy="27" r="6.5" fill={`url(#${prefix}Spark)`} />
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

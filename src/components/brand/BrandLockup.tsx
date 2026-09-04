import NovoraLogo from '@/components/brand/NovoraLogo'

type BrandLockupProps = {
  variant?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: { mark: 'h-7 w-7', word: 'text-sm', sub: 'text-[8px] mt-0.5' },
  md: { mark: 'h-8 w-8', word: 'text-base', sub: 'text-[9px] mt-1' },
  lg: { mark: 'h-12 w-12', word: 'text-xl', sub: 'text-[11px] mt-1.5' },
} as const

/** Shared Novora wordmark — official people mark (landing + favicon). */
export default function BrandLockup({
  variant = 'light',
  size = 'md',
  className = '',
}: BrandLockupProps) {
  const s = sizes[size]
  const wordColor = variant === 'dark' ? 'text-white' : 'text-slate-900'
  const subColor = variant === 'dark' ? 'text-white/55' : 'text-[#0a58a4]'

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <NovoraLogo className={`${s.mark} shrink-0`} />
      <div className="min-w-0">
        <div className={`${s.word} font-display font-extrabold tracking-tight leading-none ${wordColor}`}>
          Novora
        </div>
        <div
          className={`${s.sub} font-bold tracking-[0.14em] uppercase leading-none ${subColor}`}
        >
          HRMS SOFTWARE
        </div>
      </div>
    </div>
  )
}

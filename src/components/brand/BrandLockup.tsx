import NovoraMark from '@/components/brand/NovoraMark'

type BrandLockupProps = {
  variant?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: { mark: 'h-6 w-6', word: 'text-sm', sub: 'text-[8px] mt-0.5' },
  md: { mark: 'h-7 w-7', word: 'text-base', sub: 'text-[9px] mt-1' },
  lg: { mark: 'h-11 w-11', word: 'text-xl', sub: 'text-[11px] mt-1.5' },
} as const

/** Shared Novora wordmark used in sidebar, auth, and loading states. */
export default function BrandLockup({
  variant = 'light',
  size = 'md',
  className = '',
}: BrandLockupProps) {
  const s = sizes[size]
  const wordColor = variant === 'dark' ? 'text-white' : 'text-slate-900'
  const subColor = variant === 'dark' ? 'text-white/55' : 'text-[#2563eb]'

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <NovoraMark className={`${s.mark} shrink-0`} />
      <div className="min-w-0">
        <div className={`${s.word} font-bold tracking-tight leading-none ${wordColor}`}>
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

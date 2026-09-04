import type { ReactNode } from 'react'
import BrandLockup from '@/components/brand/BrandLockup'

interface AuthShellProps {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}

export default function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="min-h-screen flex bg-[var(--color-novora-surface)] font-sans select-none">
      <aside className="hidden lg:flex w-[46%] relative overflow-hidden bg-[#070d1a] text-white flex-col justify-between p-12 xl:p-14">
        <div
          className="absolute inset-0 animate-mesh-drift"
          style={{
            background:
              'radial-gradient(ellipse 85% 65% at 12% 12%, rgba(26,108,255,0.42) 0%, transparent 55%), radial-gradient(ellipse 70% 55% at 88% 78%, rgba(14,165,233,0.28) 0%, transparent 48%), radial-gradient(ellipse 50% 40% at 60% 40%, rgba(255,255,255,0.05) 0%, transparent 60%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />

        <div className="relative z-10 animate-sidebar-brand-in">
          <BrandLockup variant="dark" size="lg" />
          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">
            HR operating system
          </p>
        </div>

        <div className="relative z-10 max-w-lg space-y-5 animate-soft-fade-up">
          <h2 className="font-display text-4xl font-bold tracking-tight leading-[1.1]">
            Novora
          </h2>
          <p className="text-lg font-semibold text-white/90 leading-snug">
            People operations, built for growing teams.
          </p>
          <p className="text-sm font-medium text-white/60 leading-relaxed max-w-md">
            Attendance, leave, payroll, recruitment, and performance — one workspace with clear
            roles for Admin, HR, and every employee.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {['Attendance', 'Leave', 'Payroll', 'Recruitment'].map((label) => (
              <span
                key={label}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/70"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-[11px] font-semibold text-white/35">
          © {new Date().getFullYear()} Novora Business Systems
        </p>
      </aside>

      <main className="flex-1 flex items-center justify-center px-6 py-10 relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-80"
          style={{
            background:
              'radial-gradient(ellipse 50% 40% at 80% 10%, color-mix(in srgb, var(--color-novora) 12%, transparent), transparent 60%)',
          }}
        />
        <div className="w-full max-w-md relative z-10 animate-soft-fade-up">
          <div className="mb-8 lg:hidden">
            <BrandLockup size="md" />
          </div>

          <div className="mb-8">
            <h1 className="font-display text-2xl md:text-[1.75rem] font-bold text-slate-900 tracking-tight">
              {title}
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-500 leading-relaxed">{subtitle}</p>
          </div>

          <div className="nv-card p-6 md:p-7 shadow-sm">{children}</div>

          <div className="mt-8 text-center text-sm font-medium text-slate-500">{footer}</div>
        </div>
      </main>
    </div>
  )
}

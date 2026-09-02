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
      <aside className="hidden lg:flex w-[44%] relative overflow-hidden bg-slate-950 text-white flex-col justify-between p-12">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 18% 18%, rgba(37,99,235,0.35) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 92% 82%, rgba(14,165,233,0.25) 0%, transparent 48%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative z-10">
          <BrandLockup variant="dark" size="lg" />
        </div>

        <div className="relative z-10 max-w-md space-y-4 animate-soft-fade-up">
          <h2 className="font-display text-3xl font-bold tracking-tight leading-tight">
            People operations, built for growing teams.
          </h2>
          <p className="text-sm font-medium text-white/65 leading-relaxed">
            Manage employees, attendance, leave, payroll, and performance from one workspace —
            with Admin assigning roles after performance review.
          </p>
        </div>

        <p className="relative z-10 text-[11px] font-semibold text-white/40">
          © {new Date().getFullYear()} Novora Business Systems
        </p>
      </aside>

      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md animate-soft-fade-up">
          <div className="mb-8 lg:hidden">
            <BrandLockup size="md" />
          </div>

          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
            <p className="mt-2 text-sm font-medium text-slate-500 leading-relaxed">{subtitle}</p>
          </div>

          <div className="nv-card p-6 shadow-sm">
            {children}
          </div>

          <div className="mt-8 text-center text-sm font-medium text-slate-500">{footer}</div>
        </div>
      </main>
    </div>
  )
}

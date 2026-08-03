import type { ReactNode } from 'react'
import NovoraLogo from '@/components/brand/NovoraLogo'

interface AuthShellProps {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}

function BrandLockup({
  wordmarkClassName,
  subClassName,
  logoClassName,
}: {
  wordmarkClassName: string
  subClassName: string
  logoClassName: string
}) {
  return (
    <div className="flex items-center gap-3">
      <NovoraLogo className={logoClassName} />
      <div>
        <p className={wordmarkClassName}>Novora</p>
        <p className={subClassName}>HRMS</p>
      </div>
    </div>
  )
}

export default function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="min-h-screen flex bg-slate-50 font-sans select-none">
      {/* Brand panel */}
      <aside className="hidden lg:flex w-[44%] relative overflow-hidden bg-[#1a2b4a] text-white flex-col justify-between p-12">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 20% 20%, #2f66e0 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 90% 80%, #1e4db7 0%, transparent 50%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative z-10">
          <BrandLockup
            logoClassName="h-12 w-12 shrink-0"
            wordmarkClassName="text-xl font-extrabold tracking-tight"
            subClassName="text-[11px] font-semibold text-white/55 uppercase tracking-[0.14em]"
          />
        </div>

        <div className="relative z-10 max-w-md space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
            People operations, built for growing teams.
          </h2>
          <p className="text-sm font-medium text-white/65 leading-relaxed">
            Manage employees, attendance, leave, payroll, and performance from one workspace —
            with trial provisioning ready for your company.
          </p>
        </div>

        <p className="relative z-10 text-[11px] font-semibold text-white/40">
          © {new Date().getFullYear()} Novora Business Systems
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-[420px]">
          <div className="mb-8">
            <BrandLockup
              logoClassName="h-11 w-11 shrink-0"
              wordmarkClassName="text-lg font-extrabold text-slate-900 tracking-tight leading-none"
              subClassName="text-[10px] font-bold text-[#0a58a4] uppercase tracking-[0.14em] mt-1"
            />
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
            <p className="mt-2 text-sm font-medium text-slate-500 leading-relaxed">{subtitle}</p>
          </div>

          {children}

          <div className="mt-8 text-center text-sm font-medium text-slate-500">{footer}</div>
        </div>
      </main>
    </div>
  )
}

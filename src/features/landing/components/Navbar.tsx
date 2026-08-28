'use client'

import { useState } from 'react'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import BrandLockup from '@/components/brand/BrandLockup'

interface NavbarProps {
  onOpenDemo: () => void
  onOpenTrial: () => void
  onSignIn?: () => void
}

export default function Navbar({ onOpenDemo, onOpenTrial, onSignIn }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const navLinkClass =
    'text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors cursor-pointer'

  return (
    <header className="sticky top-0 z-40 w-full nv-glass border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <BrandLockup size="md" />
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {[
              ['features', 'Features'],
              ['benefits', 'Benefits'],
              ['how-it-works', 'How it works'],
              ['pricing', 'Pricing'],
              ['faq', 'FAQ'],
            ].map(([id, label]) => (
              <button key={id} type="button" onClick={() => handleScrollTo(id)} className={navLinkClass}>
                {label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2.5">
            <button type="button" onClick={onSignIn} className="nv-btn-secondary px-4 py-2 text-sm">
              Sign in
            </button>
            <button type="button" onClick={onOpenDemo} className="nv-btn-secondary px-4 py-2 text-sm">
              Book demo
            </button>
            <button type="button" onClick={onOpenTrial} className="nv-btn-primary px-4 py-2.5 text-sm">
              Start free trial <ArrowUpRight className="h-4 w-4 opacity-80" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/70 bg-white/95 backdrop-blur-md px-4 py-4 space-y-1">
          {[
            ['features', 'Features'],
            ['benefits', 'Benefits'],
            ['how-it-works', 'How it works'],
            ['pricing', 'Pricing'],
            ['faq', 'FAQ'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => handleScrollTo(id)}
              className="block w-full text-left py-2.5 text-sm font-medium text-slate-700 hover:text-slate-950 cursor-pointer"
            >
              {label}
            </button>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false)
                onSignIn?.()
              }}
              className="nv-btn-secondary w-full py-2.5"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false)
                onOpenDemo()
              }}
              className="nv-btn-secondary w-full py-2.5"
            >
              Book demo
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false)
                onOpenTrial()
              }}
              className="nv-btn-primary w-full py-2.5"
            >
              Start free trial
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { NovoraBrand } from '../brand/NovoraLogo'

type AuthShellProps = {
  title: string
  subtitle: string
  children: ReactNode
  secureLabel?: string
}

export function AuthShell({ title, subtitle, children, secureLabel }: AuthShellProps) {
  const reduceMotion = useReducedMotion()
  const formMotion = reduceMotion
    ? undefined
    : {
        initial: { opacity: 0, x: -16 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
      }
  const heroMotion = reduceMotion
    ? undefined
    : {
        initial: { opacity: 0, x: 24 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const, delay: 0.08 },
      }

  return (
    <div className="auth-split">
      <motion.section className="auth-split-form" aria-label="Authentication form" {...formMotion}>
        <header className="auth-split-header">
          <NovoraBrand size="md" />
        </header>

        <div className="auth-split-body">
          <h1 className="auth-split-title">{title}</h1>
          <p className="auth-split-subtitle">{subtitle}</p>
          {children}
        </div>

        <footer className="auth-split-secure">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 3 5 6v6c0 4.4 3 8.5 7 9 4-.5 7-4.6 7-9V6l-7-3Z"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinejoin="round"
            />
          </svg>
          <span>{secureLabel ?? 'Secure access powered by Novora HRMS'}</span>
        </footer>
      </motion.section>

      <motion.aside className="auth-split-hero" aria-hidden {...heroMotion}>
        <h2 className="auth-hero-title">
          Manage Your <span>Workforce</span> with Precision.
        </h2>
        <p className="auth-hero-copy">
          Novora HRMS empowers organizations to streamline processes, enhance productivity, and
          drive growth.
        </p>
        <ul className="auth-hero-features">
          <li>
            <span className="auth-hero-feature-icon" aria-hidden>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3 5 6v6c0 4.4 3 8.5 7 9 4-.5 7-4.6 7-9V6l-7-3Z"
                  stroke="currentColor"
                  strokeWidth="1.75"
                />
              </svg>
            </span>
            Secure &amp; Reliable
          </li>
          <li>
            <span className="auth-hero-feature-icon" aria-hidden>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M4 20V4M4 20h16M8 16l3-4 3 2 4-6" stroke="currentColor" strokeWidth="1.75" />
              </svg>
            </span>
            Data-Driven Insights
          </li>
          <li>
            <span className="auth-hero-feature-icon" aria-hidden>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.75" />
                <circle cx="16" cy="10" r="2" stroke="currentColor" strokeWidth="1.75" />
                <path
                  d="M3 20c0-3 2.5-5 6-5s6 2 6 5M13 15c2.5 0 5 1.5 6 4"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            Workforce Excellence
          </li>
        </ul>
      </motion.aside>
    </div>
  )
}

export function AuthDivider() {
  return (
    <div className="auth-divider" role="separator">
      <span>or</span>
    </div>
  )
}

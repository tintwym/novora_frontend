import { useEffect, useState, type FormEvent } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import AuthShell from './AuthShell'
import AuthField from './AuthField'
import { normalizeEmail, PASSWORD_MAX_LENGTH, validateLogin, type LoginValues } from './validation'
import { toAuthSession } from './mapSession'
import {
  clearLoginFailures,
  getLoginLockout,
  recordLoginFailure,
} from './loginRateLimit'
import { login, ApiError } from '@/services'
import type { AuthSession } from '@/types'

const REMEMBER_EMAIL_KEY = 'novora.auth.rememberedEmail'

interface LoginPageProps {
  onSuccess: (session: AuthSession) => void
  onGoRegister: () => void
  onGoLanding?: () => void
}

function readRememberedEmail(): string {
  try {
    return localStorage.getItem(REMEMBER_EMAIL_KEY) ?? ''
  } catch {
    return ''
  }
}

export default function LoginPage({ onSuccess, onGoRegister, onGoLanding }: LoginPageProps) {
  const [values, setValues] = useState<LoginValues>(() => ({
    email: readRememberedEmail(),
    password: '',
  }))
  const [errors, setErrors] = useState<Partial<Record<keyof LoginValues, string>>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState(() => Boolean(readRememberedEmail()))
  const [lockoutSeconds, setLockoutSeconds] = useState(0)

  useEffect(() => {
    const tick = () => {
      const next = getLoginLockout()
      setLockoutSeconds(next.retryAfterSeconds)
      return next.locked
    }

    if (!tick()) return

    const id = window.setInterval(() => {
      if (!tick()) window.clearInterval(id)
    }, 1000)

    return () => window.clearInterval(id)
  }, [])

  const update = (field: keyof LoginValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setFormError(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const lockout = getLoginLockout()
    if (lockout.locked) {
      setFormError(
        `Too many failed attempts. Try again in ${lockout.retryAfterSeconds} seconds.`,
      )
      setLockoutSeconds(lockout.retryAfterSeconds)
      return
    }

    const nextErrors = validateLogin(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    setFormError(null)

    try {
      const email = normalizeEmail(values.email)
      const response = await login({
        email,
        password: values.password,
      })

      clearLoginFailures()

      try {
        if (rememberMe) {
          localStorage.setItem(REMEMBER_EMAIL_KEY, email)
        } else {
          localStorage.removeItem(REMEMBER_EMAIL_KEY)
        }
      } catch {
        // ignore storage errors
      }

      onSuccess(toAuthSession(response))
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401 || err.status === 403) {
          const lock = recordLoginFailure()
          if (lock.locked) {
            setLockoutSeconds(lock.retryAfterSeconds)
            setFormError(
              `Too many failed attempts. Try again in ${lock.retryAfterSeconds} seconds.`,
            )
          } else {
            setFormError('Invalid email or password.')
          }
        } else {
          if (err.errors?.email) setErrors((prev) => ({ ...prev, email: err.errors!.email }))
          if (err.errors?.password) setErrors((prev) => ({ ...prev, password: err.errors!.password }))
          setFormError(err.message)
        }
      } else {
        setFormError('Unable to reach the server. Check that the API is running.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const isLocked = lockoutSeconds > 0

  return (
    <AuthShell
      title="Sign in"
      subtitle="Welcome back. Enter your work email to access your Novora workspace."
      footer={
        <>
          {onGoLanding && (
            <>
              <button
                type="button"
                onClick={onGoLanding}
                className="text-slate-500 font-semibold hover:text-slate-800 hover:underline cursor-pointer"
              >
                ← Back to home
              </button>
              <span className="mx-2 text-slate-300">·</span>
            </>
          )}
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={onGoRegister}
            className="text-novora font-semibold hover:underline cursor-pointer"
          >
            Create workspace
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4" autoComplete="on">
        {formError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-600"
          >
            {formError}
          </div>
        )}

        <AuthField
          id="login-email"
          label="Work email"
          type="email"
          inputMode="email"
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder="you@company.com"
          value={values.email}
          onChange={(e) => update('email', e.target.value)}
          error={errors.email}
        />

        <AuthField
          id="login-password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          maxLength={PASSWORD_MAX_LENGTH}
          placeholder="Enter your password"
          value={values.password}
          onChange={(e) => update('password', e.target.value)}
          error={errors.password}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-slate-300 text-novora focus:ring-novora"
            />
            Remember email
          </label>
          <button
            type="button"
            className="text-xs font-semibold text-novora hover:underline cursor-pointer"
            onClick={() => setFormError('Password reset is not available yet.')}
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={submitting || isLocked}
          className="nv-btn-primary w-full mt-2 py-3 disabled:opacity-70 cursor-pointer"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in…
            </>
          ) : isLocked ? (
            `Try again in ${lockoutSeconds}s`
          ) : (
            'Sign in'
          )}
        </button>
      </form>
    </AuthShell>
  )
}

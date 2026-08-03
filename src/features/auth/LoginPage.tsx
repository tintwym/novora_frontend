import { useState, type FormEvent } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import AuthShell from './AuthShell'
import AuthField from './AuthField'
import { validateLogin, type LoginValues } from './validation'
import { toAuthSession } from './mapSession'
import { login, ApiError } from '@/services'
import type { AuthSession } from '@/types'

interface LoginPageProps {
  onSuccess: (session: AuthSession) => void
  onGoRegister: () => void
  onGoLanding?: () => void
}

export default function LoginPage({ onSuccess, onGoRegister, onGoLanding }: LoginPageProps) {
  const [values, setValues] = useState<LoginValues>({ email: '', password: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof LoginValues, string>>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const update = (field: keyof LoginValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setFormError(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const nextErrors = validateLogin(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    setFormError(null)

    try {
      const response = await login({
        email: values.email.trim(),
        password: values.password,
      })
      onSuccess(toAuthSession(response))
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errors?.email) setErrors((prev) => ({ ...prev, email: err.errors!.email }))
        if (err.errors?.password) setErrors((prev) => ({ ...prev, password: err.errors!.password }))
        setFormError(err.message)
      } else {
        setFormError('Unable to reach the server. Check that the API is running.')
      }
    } finally {
      setSubmitting(false)
    }
  }

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
            className="text-[#2f66e0] font-bold hover:underline cursor-pointer"
          >
            Create workspace
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {formError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-600">
            {formError}
          </div>
        )}

        <AuthField
          id="login-email"
          label="Work email"
          type="email"
          autoComplete="email"
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
              className="h-3.5 w-3.5 rounded border-slate-300 text-[#2f66e0] focus:ring-[#2f66e0]"
            />
            Remember me
          </label>
          <button
            type="button"
            className="text-xs font-bold text-[#2f66e0] hover:underline cursor-pointer"
            onClick={() => setFormError('Password reset is not available yet.')}
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-2 rounded-xl bg-[#2f66e0] hover:bg-[#2758c4] disabled:opacity-70 text-white text-sm font-bold py-3 transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in…
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </form>
    </AuthShell>
  )
}

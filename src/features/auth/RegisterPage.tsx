import { useState, type FormEvent } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import AuthShell from './AuthShell'
import AuthField from './AuthField'
import {
  passwordStrength,
  validateRegister,
  type RegisterValues,
} from './validation'
import { toAuthSession } from './mapSession'
import { register, ApiError } from '@/services'
import type { AuthSession } from '@/types'

interface RegisterPageProps {
  onSuccess: (session: AuthSession) => void
  onGoLogin: () => void
  onGoLanding?: () => void
}

const strengthColors = ['bg-slate-200', 'bg-red-400', 'bg-amber-400', 'bg-sky-400', 'bg-emerald-500']

export default function RegisterPage({ onSuccess, onGoLogin, onGoLanding }: RegisterPageProps) {
  const [values, setValues] = useState<RegisterValues>({
    fullName: '',
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterValues, string>>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [termsError, setTermsError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const strength = passwordStrength(values.password)

  const update = (field: keyof RegisterValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setFormError(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const nextErrors = validateRegister(values)
    setErrors(nextErrors)

    if (!acceptedTerms) {
      setTermsError('Please accept the terms to continue')
    } else {
      setTermsError(null)
    }

    if (Object.keys(nextErrors).length > 0 || !acceptedTerms) return

    setSubmitting(true)
    setFormError(null)

    try {
      const fullName = values.fullName.trim()
      const response = await register({
        email: values.email.trim(),
        password: values.password,
        companyName: values.companyName.trim(),
        ...(fullName ? { fullName } : {}),
      })
      onSuccess(toAuthSession(response, fullName || undefined))
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errors) {
          setErrors((prev) => ({
            ...prev,
            ...(err.errors!.email ? { email: err.errors!.email } : {}),
            ...(err.errors!.password ? { password: err.errors!.password } : {}),
            ...(err.errors!.companyName ? { companyName: err.errors!.companyName } : {}),
            ...(err.errors!.fullName ? { fullName: err.errors!.fullName } : {}),
          }))
        }
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
      title="Create your account"
      subtitle="You’ll join as an Employee. An Admin assigns your position after reviewing performance."
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
          Already have an account?{' '}
          <button
            type="button"
            onClick={onGoLogin}
            className="text-[#2f66e0] font-bold hover:underline cursor-pointer"
          >
            Sign in
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
          id="register-fullname"
          label="Full name"
          type="text"
          autoComplete="name"
          placeholder="Sarah Lim"
          value={values.fullName}
          onChange={(e) => update('fullName', e.target.value)}
          error={errors.fullName}
          hint="Optional"
        />

        <AuthField
          id="register-company"
          label="Company name"
          type="text"
          autoComplete="organization"
          placeholder="Acme Sdn Bhd"
          value={values.companyName}
          onChange={(e) => update('companyName', e.target.value)}
          error={errors.companyName}
        />

        <AuthField
          id="register-email"
          label="Work email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={values.email}
          onChange={(e) => update('email', e.target.value)}
          error={errors.email}
        />

        <div className="space-y-2">
          <AuthField
            id="register-password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Create a strong password"
            value={values.password}
            onChange={(e) => update('password', e.target.value)}
            error={errors.password}
            hint={
              errors.password
                ? undefined
                : '8–72 chars, with upper, lower, number, and symbol'
            }
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

          {values.password && !errors.password && (
            <div className="space-y-1.5 px-0.5">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      strength.score >= step ? strengthColors[strength.score] : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Strength: {strength.label}
              </p>
            </div>
          )}
        </div>

        <AuthField
          id="register-confirm"
          label="Confirm password"
          type={showConfirm ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={values.confirmPassword}
          onChange={(e) => update('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer"
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />

        <div className="pt-1 space-y-1.5">
          <label className="flex items-start gap-2.5 text-xs font-medium text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => {
                setAcceptedTerms(e.target.checked)
                setTermsError(null)
              }}
              className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-[#2f66e0] focus:ring-[#2f66e0]"
            />
            <span>
              I agree to the{' '}
              <span className="font-bold text-[#2f66e0]">Terms of Service</span> and{' '}
              <span className="font-bold text-[#2f66e0]">Privacy Policy</span>
            </span>
          </label>
          {termsError && <p className="text-[11px] font-semibold text-red-500 pl-6">{termsError}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-2 rounded-xl bg-[#2f66e0] hover:bg-[#2758c4] disabled:opacity-70 text-white text-sm font-bold py-3 transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account…
            </>
          ) : (
            'Create account'
          )}
        </button>
      </form>
    </AuthShell>
  )
}

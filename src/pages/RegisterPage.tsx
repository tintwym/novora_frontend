import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { AuthField } from '../components/auth/AuthField'
import { AuthDivider, AuthShell } from '../components/auth/AuthShell'
import '../styles/auth.css'

const PASSWORD_HINT = '8–72 characters with uppercase, lowercase, a number, and a symbol'

function passwordError(password: string): string | null {
  if (password.length < 8 || password.length > 72) return PASSWORD_HINT
  if (!/[a-z]/.test(password)) return PASSWORD_HINT
  if (!/[A-Z]/.test(password)) return PASSWORD_HINT
  if (!/\d/.test(password)) return PASSWORD_HINT
  if (!/[^A-Za-z0-9]/.test(password)) return PASSWORD_HINT
  return null
}

export function RegisterPage() {
  const { register } = useAuth()
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (loading) return
    setError(null)

    if (!fullName.trim()) {
      setError('Please enter your full name.')
      return
    }
    if (companyName.trim().length < 2) {
      setError('Please enter your company name (at least 2 characters).')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    const pwdErr = passwordError(password)
    if (pwdErr) {
      setError(pwdErr)
      return
    }

    setLoading(true)
    try {
      await register(email, password, companyName, fullName)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Create account"
      subtitle="Enter your work email and a password to get started. You will receive the default employee role."
      secureLabel="Secure registration powered by Novora HRMS"
    >
      <form className="auth-form-stack" onSubmit={(e) => void onSubmit(e)}>
        <AuthField
          label="Full name"
          icon="user"
          type="text"
          autoComplete="name"
          placeholder="Jane Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <AuthField
          label="Company name"
          icon="building"
          type="text"
          autoComplete="organization"
          placeholder="Acme Corp"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />
        <AuthField
          label="Work Email"
          icon="mail"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <AuthField
          label="Password"
          icon="lock"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          revealToggle
          required
        />
        <AuthField
          label="Confirm password"
          icon="lock"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          revealToggle
          required
        />
        {error ? <p className="auth-form-error">{error}</p> : null}
        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <AuthDivider />
      <p className="auth-switch">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </AuthShell>
  )
}

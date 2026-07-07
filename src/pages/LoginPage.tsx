import { type FormEvent, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ApiError, warmApi } from '../api/client'
import { getRememberedEmail } from '../api/auth'
import { useAuth } from '../auth/AuthContext'
import { AuthField } from '../components/auth/AuthField'
import { AuthDivider, AuthShell } from '../components/auth/AuthShell'
import '../styles/auth.css'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    typeof location.state === 'object' &&
    location.state !== null &&
    'from' in location.state &&
    typeof (location.state as { from?: unknown }).from === 'string'
      ? (location.state as { from: string }).from
      : '/dashboard'
  const [email, setEmail] = useState(getRememberedEmail)
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem('novora_remember_me') === 'true')
  const [loading, setLoading] = useState(false)
  const [slowConnect, setSlowConnect] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    warmApi()
  }, [])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (loading) return
    setError(null)
    setSlowConnect(false)
    setLoading(true)
    const slowTimer = window.setTimeout(() => setSlowConnect(true), 4000)
    try {
      await login(email, password, rememberMe)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Sign in failed')
    } finally {
      window.clearTimeout(slowTimer)
      setSlowConnect(false)
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Welcome back. Enter your work email and password to access your workspace."
      secureLabel="Secure sign-in powered by Novora HRMS"
    >
      <form className="auth-form-stack" onSubmit={(e) => void onSubmit(e)}>
        <AuthField
          label="Work Email"
          icon="mail"
          type="email"
          autoComplete="username"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <AuthField
          label="Password"
          icon="lock"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          revealToggle
          required
        />
        <label className="auth-remember">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          Remember me
        </label>
        {error ? <p className="auth-form-error">{error}</p> : null}
        {slowConnect && !error ? (
          <p className="auth-form-hint">Connecting to API — first request may take up to a minute while the server wakes up.</p>
        ) : null}
        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <AuthDivider />
      <p className="auth-switch">
        New to Novora? <Link to="/register">Create account</Link>
      </p>
    </AuthShell>
  )
}

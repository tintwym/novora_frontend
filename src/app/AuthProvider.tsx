import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import Toast, { type ToastMessage } from '@/components/ui/Toast'
import BrandLockup from '@/components/brand/BrandLockup'
import { toAuthSession } from '@/features/auth/mapSession'
import {
  clearSessionBiometricUnlocked,
  isSessionBiometricUnlocked,
  markSessionBiometricUnlocked,
} from '@/features/auth/biometricGate'
import {
  ApiError,
  fetchMe,
  listEmployees,
  logout,
  setSessionExpiredHandler,
} from '@/services'
import type { AuthSession, Employee } from '@/types'
import { canManageFullSystem, portalHomePath } from '@/lib/roles'
import {
  clearSessionStarted,
  isLocalSessionExpired,
  markSessionStarted,
  readSessionStartedAt,
} from '@/lib/sessionTTL'
import { Loader2 } from 'lucide-react'

type AddToast = (text: string, type: 'success' | 'loading' | 'error' | 'info') => void

type AuthContextValue = {
  session: AuthSession | null
  biometricUnlocked: boolean
  unlockBiometric: () => void
  employees: Employee[]
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>
  selectedEmployee: Employee | null
  setSelectedEmployee: React.Dispatch<React.SetStateAction<Employee | null>>
  addToast: AddToast
  handleAuthSuccess: (next: AuthSession) => void
  handleLogout: () => Promise<void>
  loadEmployees: (roles: string[]) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [session, setSession] = useState<AuthSession | null>(null)
  const [biometricUnlocked, setBiometricUnlocked] = useState(false)
  const [authBootstrapping, setAuthBootstrapping] = useState(true)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const toastIdRef = useRef(0)
  const sessionExpiryLock = useRef(false)
  const sessionRef = useRef<AuthSession | null>(null)
  sessionRef.current = session

  const addToast: AddToast = useCallback((text, type) => {
    toastIdRef.current += 1
    setToast({ id: String(toastIdRef.current), text, type })
  }, [])

  const removeToast = () => setToast(null)

  const unlockBiometric = useCallback(() => {
    const userId = sessionRef.current?.userId
    if (userId) markSessionBiometricUnlocked(userId)
    setBiometricUnlocked(true)
  }, [])

  const lockBiometric = useCallback(() => {
    clearSessionBiometricUnlocked()
    setBiometricUnlocked(false)
  }, [])

  const expireSession = useCallback(
    async (reason: 'timeout' | 'server' = 'timeout') => {
      if (sessionExpiryLock.current) return
      sessionExpiryLock.current = true
      clearSessionStarted()
      clearSessionBiometricUnlocked()
      setSession(null)
      setBiometricUnlocked(false)
      setEmployees([])
      setSelectedEmployee(null)
      navigate('/login', { replace: true })
      addToast(
        reason === 'server'
          ? 'Your session ended. Please sign in again.'
          : 'Session expired after 1 hour. Please sign in again.',
        'info',
      )
      try {
        await logout()
      } catch {
        // local clear is enough
      } finally {
        window.setTimeout(() => {
          sessionExpiryLock.current = false
        }, 1500)
      }
    },
    [addToast, navigate],
  )

  const loadEmployees = useCallback(
    async (roles: string[]) => {
      if (!canManageFullSystem(roles)) {
        setEmployees([])
        setSelectedEmployee(null)
        return
      }
      try {
        const rows = await listEmployees()
        setEmployees(rows)
        setSelectedEmployee((prev) => {
          if (prev && rows.some((e) => e.id === prev.id)) {
            return rows.find((e) => e.id === prev.id) ?? rows[0] ?? null
          }
          return rows[0] ?? null
        })
      } catch (err) {
        setEmployees([])
        setSelectedEmployee(null)
        if (!(err instanceof ApiError) || (err.status !== 401 && err.status !== 403)) {
          addToast('Could not load employees from the server.', 'error')
        }
      }
    },
    [addToast],
  )

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const me = await fetchMe()
        if (!cancelled) {
          if (isLocalSessionExpired()) {
            clearSessionStarted()
            setSession(null)
            navigate('/login', { replace: true })
            try {
              await logout()
            } catch {
              // ignore
            }
          } else {
            const next = toAuthSession(me)
            if (readSessionStartedAt() == null) {
              markSessionStarted()
            }
            setSession(next)
            setBiometricUnlocked(isSessionBiometricUnlocked(next.userId))
            void loadEmployees(next.roles)
          }
        }
      } catch {
        if (!cancelled) {
          setSession(null)
          clearSessionStarted()
        }
      } finally {
        if (!cancelled) setAuthBootstrapping(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [loadEmployees, navigate])

  useEffect(() => {
    setSessionExpiredHandler(() => {
      void expireSession('server')
    })
    return () => setSessionExpiredHandler(null)
  }, [expireSession])

  useEffect(() => {
    if (!session) return
    const tick = () => {
      if (isLocalSessionExpired()) void expireSession('timeout')
    }
    tick()
    const id = window.setInterval(tick, 30_000)
    const onFocus = () => {
      if (isLocalSessionExpired()) {
        void expireSession('timeout')
        return
      }
      void fetchMe().catch((err) => {
        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
          void expireSession('server')
        }
      })
    }
    const onVisibility = () => {
      if (document.visibilityState === 'visible') onFocus()
    }
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.clearInterval(id)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [session, expireSession])

  const handleAuthSuccess = useCallback(
    (next: AuthSession) => {
      markSessionStarted()
      clearSessionBiometricUnlocked()
      setSession(next)
      setBiometricUnlocked(false)
      addToast(`Welcome to Novora, ${next.fullName}`, 'success')
      void loadEmployees(next.roles)
      navigate(portalHomePath(next.roles), { replace: true })
    },
    [addToast, loadEmployees, navigate],
  )

  const handleLogout = useCallback(async () => {
    clearSessionStarted()
    lockBiometric()
    setSession(null)
    setEmployees([])
    setSelectedEmployee(null)
    navigate('/', { replace: true })
    addToast('Signed out successfully', 'success')
    try {
      await logout()
    } catch {
      // Still signed out locally
    }
  }, [addToast, lockBiometric, navigate])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      biometricUnlocked,
      unlockBiometric,
      employees,
      setEmployees,
      selectedEmployee,
      setSelectedEmployee,
      addToast,
      handleAuthSuccess,
      handleLogout,
      loadEmployees,
    }),
    [
      session,
      biometricUnlocked,
      unlockBiometric,
      employees,
      selectedEmployee,
      addToast,
      handleAuthSuccess,
      handleLogout,
      loadEmployees,
    ],
  )

  if (authBootstrapping) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
        <div className="flex flex-col items-center gap-4 text-slate-500 animate-soft-fade-up">
          <BrandLockup size="lg" />
          <div className="flex items-center gap-2 text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin text-[#2f66e0]" />
            <p className="text-xs font-semibold tracking-wide uppercase">Loading workspace…</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
      <Toast toast={toast} onClose={removeToast} />
    </AuthContext.Provider>
  )
}

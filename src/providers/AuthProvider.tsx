'use client'

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
import { useRouter } from 'next/navigation'
import Toast, { type ToastMessage } from '@/components/ui/Toast'
import { toAuthSession } from '@/features/auth/mapSession'
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

type AddToast = (text: string, type: 'success' | 'loading' | 'error' | 'info') => void

type AuthContextValue = {
  authReady: boolean
  session: AuthSession | null
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
  const router = useRouter()
  const [session, setSession] = useState<AuthSession | null>(null)
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

  const expireSession = useCallback(
    async (reason: 'timeout' | 'server' = 'timeout') => {
      if (sessionExpiryLock.current) return
      sessionExpiryLock.current = true
      clearSessionStarted()
      setSession(null)
      setEmployees([])
      setSelectedEmployee(null)
      router.replace('/login')
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
    [addToast, router],
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
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), 8000)
    ;(async () => {
      try {
        const me = await fetchMe(controller.signal)
        if (!cancelled) {
          if (isLocalSessionExpired()) {
            clearSessionStarted()
            setSession(null)
            router.replace('/login')
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
            void loadEmployees(next.roles)
          }
        }
      } catch {
        if (!cancelled) {
          setSession(null)
          clearSessionStarted()
        }
      } finally {
        window.clearTimeout(timer)
        if (!cancelled) setAuthBootstrapping(false)
      }
    })()
    return () => {
      cancelled = true
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [loadEmployees, router])

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
      setSession(next)
      addToast(`Welcome to Novora, ${next.fullName}`, 'success')
      void loadEmployees(next.roles)
      router.replace(portalHomePath(next.roles))
    },
    [addToast, loadEmployees, router],
  )

  const handleLogout = useCallback(async () => {
    clearSessionStarted()
    setSession(null)
    setEmployees([])
    setSelectedEmployee(null)
    router.replace('/')
    addToast('Signed out successfully', 'success')
    try {
      await logout()
    } catch {
      // Still signed out locally
    }
  }, [addToast, router])

  const value = useMemo<AuthContextValue>(
    () => ({
      authReady: !authBootstrapping,
      session,
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
      authBootstrapping,
      session,
      employees,
      selectedEmployee,
      addToast,
      handleAuthSuccess,
      handleLogout,
      loadEmployees,
    ],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
      <Toast toast={toast} onClose={removeToast} />
    </AuthContext.Provider>
  )
}

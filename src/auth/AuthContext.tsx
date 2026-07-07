import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { fetchMe, login as apiLogin, logout as apiLogout, register as apiRegister, tryRestoreSession } from '../api/auth'
import type { User } from '../types/user'

type AuthContextValue = {
  user: User | null
  booting: boolean
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>
  register: (email: string, password: string, companyName: string, fullName: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const restored = await tryRestoreSession()
        if (!cancelled) setUser(restored)
      } catch {
        if (!cancelled) setUser(null)
      } finally {
        if (!cancelled) setBooting(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email: string, password: string, rememberMe: boolean) => {
    const next = await apiLogin(email, password, rememberMe)
    setUser(next)
  }, [])

  const register = useCallback(async (email: string, password: string, companyName: string, fullName: string) => {
    const next = await apiRegister(email, password, companyName, fullName)
    setUser(next)
  }, [])

  const logout = useCallback(async () => {
    await apiLogout()
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    const next = await fetchMe()
    setUser(next)
  }, [])

  const value = useMemo(
    () => ({ user, booting, login, register, logout, refreshUser }),
    [user, booting, login, register, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

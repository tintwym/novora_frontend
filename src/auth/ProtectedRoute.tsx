import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { NovoraBrand } from '../components/brand/NovoraLogo'

export function ProtectedRoute({ hrAdminOnly = false }: { hrAdminOnly?: boolean }) {
  const { user, booting } = useAuth()
  const location = useLocation()

  if (booting) {
    return (
      <div className="boot-screen">
        <NovoraBrand size="sm" showTagline={false} />
        <div className="boot-spinner" aria-hidden />
        <p>Loading Novora…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (hrAdminOnly && !user.canAccessHrAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export function PublicOnlyRoute() {
  const { user, booting } = useAuth()

  if (booting) {
    return (
      <div className="boot-screen">
        <NovoraBrand size="sm" showTagline={false} />
        <div className="boot-spinner" aria-hidden />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

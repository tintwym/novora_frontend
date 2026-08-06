import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/app/AuthProvider'
import PortalShell from '@/app/PortalShell'
import LandingPage from '@/features/landing/LandingPage'
import { LoginPage, RegisterPage } from '@/features/auth'
import { portalHomePath } from '@/lib/roles'

function PublicLanding() {
  const { session } = useAuth()
  const navigate = useNavigate()
  if (session) return <Navigate to={portalHomePath(session.roles)} replace />
  return (
    <LandingPage
      onSignIn={() => navigate('/login')}
      onStartTrial={() => navigate('/register')}
    />
  )
}

function PublicLogin() {
  const { session, handleAuthSuccess } = useAuth()
  const navigate = useNavigate()
  if (session) return <Navigate to={portalHomePath(session.roles)} replace />
  return (
    <LoginPage
      onSuccess={handleAuthSuccess}
      onGoRegister={() => navigate('/register')}
      onGoLanding={() => navigate('/')}
    />
  )
}

function PublicRegister() {
  const { session, handleAuthSuccess } = useAuth()
  const navigate = useNavigate()
  if (session) return <Navigate to={portalHomePath(session.roles)} replace />
  return (
    <RegisterPage
      onSuccess={handleAuthSuccess}
      onGoLogin={() => navigate('/login')}
      onGoLanding={() => navigate('/')}
    />
  )
}

function HomeRedirect() {
  const { session } = useAuth()
  if (session) return <Navigate to={portalHomePath(session.roles)} replace />
  return <Navigate to="/" replace />
}

function PortalIndexRedirect() {
  const { portal } = useParams<{ portal: string }>()
  const { session } = useAuth()
  if (!session) return <Navigate to="/login" replace />
  if (portal === 'admin' || portal === 'hr' || portal === 'employee') {
    return <Navigate to={`/${portal}/dashboard`} replace />
  }
  return <Navigate to={portalHomePath(session.roles)} replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicLanding />} />
      <Route path="/login" element={<PublicLogin />} />
      <Route path="/register" element={<PublicRegister />} />
      <Route path="/:portal/:module" element={<PortalShell />} />
      <Route path="/:portal" element={<PortalIndexRedirect />} />
      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

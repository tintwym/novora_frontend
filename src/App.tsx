import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { ProtectedRoute, PublicOnlyRoute } from './auth/ProtectedRoute'
import { AppShell } from './components/layout/AppShell'
import { AttendancePage } from './pages/AttendancePage'
import { ClaimsPage } from './pages/ClaimsPage'
import { DashboardPage } from './pages/DashboardPage'
import { EmployeesPage } from './pages/EmployeesPage'
import { DisciplinaryPage } from './pages/DisciplinaryPage'
import { LeavePage } from './pages/LeavePage'
import { LoginPage } from './pages/LoginPage'
import { LandingPage } from './pages/LandingPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { PerformancePage } from './pages/PerformancePage'
import { HelpdeskPage } from './pages/HelpdeskPage'
import { BenefitsPage } from './pages/BenefitsPage'
import { PayrollPage } from './pages/PayrollPage'
import { EngagementPage } from './pages/EngagementPage'
import { LearningPage } from './pages/LearningPage'
import { TrainingPage } from './pages/TrainingPage'
import { AssetsPage } from './pages/AssetsPage'
import { ReportsPage } from './pages/ReportsPage'
import { SettingsPage } from './pages/SettingsPage'
import { RecruitmentPage } from './pages/RecruitmentPage'
import { RegisterPage } from './pages/RegisterPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/leave" element={<LeavePage />} />
              <Route path="/claims" element={<ClaimsPage />} />
              <Route path="/settings" element={<SettingsPage />} />

              <Route element={<ProtectedRoute hrAdminOnly />}>
                <Route path="/employees" element={<EmployeesPage />} />
                <Route path="/recruitment" element={<RecruitmentPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/disciplinary" element={<DisciplinaryPage />} />
                <Route path="/payroll" element={<PayrollPage />} />
                <Route path="/benefits" element={<BenefitsPage />} />
                <Route path="/helpdesk" element={<HelpdeskPage />} />
                <Route path="/performance" element={<PerformancePage />} />
                <Route path="/engagement" element={<EngagementPage />} />
                <Route path="/training" element={<TrainingPage />} />
                <Route path="/learning" element={<LearningPage />} />
                <Route path="/assets" element={<AssetsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

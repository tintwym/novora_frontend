/** REST paths — shared contract with the Spring API. */
export const Endpoints = {
  authCsrf: '/api/auth/csrf',
  authLogin: '/api/auth/login',
  authRegister: '/api/auth/register',
  authLogout: '/api/auth/logout',
  me: '/api/me',
  myDashboard: '/api/my/dashboard',
  myAttendance: '/api/my/attendance',
  myCheckIn: '/api/my/attendance/check-in',
  myCheckOut: '/api/my/attendance/check-out',
  dashboardSummary: '/api/admin/dashboard/summary',
  dashboardGrowth: '/api/admin/dashboard/growth',
  dashboardRecentHires: '/api/admin/dashboard/recent-hires',
  dashboardLeaveRequests: '/api/admin/dashboard/leave-requests',
  dashboardPayrollSummary: '/api/admin/dashboard/payroll-summary',
  dashboardAttendanceOverview: '/api/admin/dashboard/attendance-overview',
} as const

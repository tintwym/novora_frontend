/** REST paths — shared contract with the Spring API. */
export const Endpoints = {
  authCsrf: '/api/v1/auth/csrf',
  authLogin: '/api/v1/auth/login',
  authRegister: '/api/v1/auth/register',
  authLogout: '/auth/logout',
  me: '/api/v1/me',
  myDashboard: '/api/v1/my/dashboard',
  myAttendance: '/api/v1/my/attendance',
  myCheckIn: '/api/v1/my/attendance/check-in',
  myCheckOut: '/api/v1/my/attendance/check-out',
  dashboardSummary: '/api/v1/admin/dashboard/summary',
  dashboardGrowth: '/api/v1/admin/dashboard/growth',
  dashboardRecentHires: '/api/v1/admin/dashboard/recent-hires',
  dashboardLeaveRequests: '/api/v1/admin/dashboard/leave-requests',
  dashboardPayrollSummary: '/api/v1/admin/dashboard/payroll-summary',
  dashboardAttendanceOverview: '/api/v1/admin/dashboard/attendance-overview',
} as const

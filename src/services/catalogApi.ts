import { apiRequest } from './apiClient'

export type LeaveTypeRow = {
  id: string
  name: string
  code: string
  daysAllowed: number
  paid: boolean
  carryForward: boolean
  maxCarryDays: number
  description: string | null
  active: boolean
  createdAt: string | null
}

export type HolidayRow = {
  id: string
  name: string
  holidayDate: string
  type: string | null
  description: string | null
  createdAt: string | null
}

export type AllowanceTypeRow = {
  id: string
  name: string
  code: string
  amount: number
  frequency: string
  taxable: boolean
  active: boolean
  description: string | null
  createdAt: string | null
}

export type ShiftPatternRow = {
  id: string
  name: string
  startTime: string
  endTime: string
  breakMins: number
  color: string | null
  active: boolean
  createdAt: string | null
}

export type RosterEntryRow = {
  id: string
  employeeId: string
  employeeName: string
  workDate: string
  shiftPatternId: string | null
  shiftPatternName: string | null
  status: string
  notes: string | null
  createdAt: string | null
}

export type PositionRow = {
  id: string
  title: string
  departmentId: string | null
  departmentName: string | null
  level: string | null
  minSalary: number | null
  maxSalary: number | null
  active: boolean
  createdAt: string | null
}

export type OrganizationProfile = {
  id: string
  name: string
  slug: string
  legalName: string | null
  registrationNo: string | null
  addressLine1: string | null
  city: string | null
  country: string | null
  phone: string | null
  website: string | null
}

export type BranchRow = {
  id: string
  name: string
  city: string | null
  address: string | null
  headcount: number
  active: boolean
  createdAt: string | null
}

export type AssetRow = {
  id: string
  name: string
  assetCode: string
  category: string | null
  brand: string | null
  model: string | null
  serialNumber: string | null
  purchaseDate: string | null
  purchasePrice: number | null
  assignedToId: string | null
  assignedToName: string | null
  assetCondition: string | null
  location: string | null
  notes: string | null
  createdAt: string | null
}

export type TrainingRow = {
  id: string
  title: string
  description: string | null
  category: string | null
  trainer: string | null
  location: string | null
  mode: string | null
  startDate: string | null
  endDate: string | null
  durationHours: number | null
  maxParticipants: number | null
  cost: number | null
  status: string
  createdAt: string | null
}

export type PerformanceReviewRow = {
  id: string
  employeeId: string
  employeeName: string
  reviewerId: string | null
  reviewerName: string | null
  reviewYear: number
  reviewQuarter: number | null
  reviewType: string | null
  score: number | null
  rating: string | null
  status: string
  createdAt: string | null
}

export type AuditLogRow = {
  id: string
  action: string
  tableName: string | null
  recordId: string | null
  userEmail: string | null
  createdAt: string | null
}

export type ReportSummary = {
  employees: number
  pendingLeave: number
  openJobs: number
  candidates: number
  claimsPending: number
  payrollHeadcountThisMonth: number
}

export type FeedPost = {
  id: string
  title: string
  body: string
  authorEmployeeId: string | null
  authorName: string | null
  createdAt: string | null
}

export type AttendanceRosterLog = {
  id: string
  employeeId: string
  workDate: string
  status: string
  checkInTime: string | null
  checkOutTime: string | null
  workHours: number | null
  notes: string | null
}

export async function fetchLeaveTypes(admin = false): Promise<LeaveTypeRow[]> {
  const path = admin ? '/api/admin/leave-types' : '/api/leave-types'
  return apiRequest<LeaveTypeRow[]>(path, { method: 'GET', skipCsrf: true })
}

export async function createLeaveType(payload: {
  name: string
  code: string
  daysAllowed?: number
  paid?: boolean
  carryForward?: boolean
  maxCarryDays?: number
  description?: string
  active?: boolean
}): Promise<LeaveTypeRow> {
  return apiRequest<LeaveTypeRow>('/api/admin/leave-types', { method: 'POST', body: payload })
}

export async function updateLeaveType(
  id: string,
  payload: {
    name: string
    code: string
    daysAllowed?: number
    paid?: boolean
    carryForward?: boolean
    maxCarryDays?: number
    description?: string
    active?: boolean
  },
): Promise<LeaveTypeRow> {
  return apiRequest<LeaveTypeRow>(`/api/admin/leave-types/${id}`, { method: 'PUT', body: payload })
}

export async function fetchHolidays(admin = false): Promise<HolidayRow[]> {
  const path = admin ? '/api/admin/holidays' : '/api/holidays'
  return apiRequest<HolidayRow[]>(path, { method: 'GET', skipCsrf: true })
}

export async function createHoliday(payload: {
  name: string
  holidayDate: string
  type?: string
  description?: string
}): Promise<HolidayRow> {
  return apiRequest<HolidayRow>('/api/admin/holidays', { method: 'POST', body: payload })
}

export async function fetchAllowanceTypes(): Promise<AllowanceTypeRow[]> {
  return apiRequest<AllowanceTypeRow[]>('/api/admin/allowance-types', { method: 'GET', skipCsrf: true })
}

export async function createAllowanceType(payload: {
  name: string
  code: string
  amount: number
  frequency?: string
  taxable?: boolean
  active?: boolean
  description?: string
}): Promise<AllowanceTypeRow> {
  return apiRequest<AllowanceTypeRow>('/api/admin/allowance-types', { method: 'POST', body: payload })
}

export async function fetchShiftPatterns(): Promise<ShiftPatternRow[]> {
  return apiRequest<ShiftPatternRow[]>('/api/admin/shift-patterns', { method: 'GET', skipCsrf: true })
}

export async function createShiftPattern(payload: {
  name: string
  startTime: string
  endTime: string
  breakMins?: number
  color?: string
  active?: boolean
}): Promise<ShiftPatternRow> {
  return apiRequest<ShiftPatternRow>('/api/admin/shift-patterns', { method: 'POST', body: payload })
}

export async function fetchRoster(from?: string, to?: string): Promise<RosterEntryRow[]> {
  const q = new URLSearchParams()
  if (from) q.set('from', from)
  if (to) q.set('to', to)
  const qs = q.toString()
  return apiRequest<RosterEntryRow[]>(`/api/admin/roster${qs ? `?${qs}` : ''}`, {
    method: 'GET',
    skipCsrf: true,
  })
}

export async function createRosterEntry(payload: {
  employeeId: string
  workDate: string
  shiftPatternId?: string
  status?: string
  notes?: string
}): Promise<RosterEntryRow> {
  return apiRequest<RosterEntryRow>('/api/admin/roster', { method: 'POST', body: payload })
}

export async function fetchAttendanceRoster(): Promise<AttendanceRosterLog[]> {
  return apiRequest<AttendanceRosterLog[]>('/api/admin/attendance/roster', {
    method: 'GET',
    skipCsrf: true,
  })
}

export async function fetchPositions(): Promise<PositionRow[]> {
  return apiRequest<PositionRow[]>('/api/admin/positions', { method: 'GET', skipCsrf: true })
}

export async function createPosition(payload: {
  title: string
  departmentId?: string
  departmentName?: string
  level?: string
  minSalary?: number
  maxSalary?: number
  active?: boolean
}): Promise<PositionRow> {
  return apiRequest<PositionRow>('/api/admin/positions', { method: 'POST', body: payload })
}

export async function fetchOrganization(): Promise<OrganizationProfile> {
  return apiRequest<OrganizationProfile>('/api/admin/organization', { method: 'GET', skipCsrf: true })
}

export async function updateOrganization(payload: Partial<{
  name: string
  legalName: string
  registrationNo: string
  addressLine1: string
  city: string
  country: string
  phone: string
  website: string
}>): Promise<OrganizationProfile> {
  return apiRequest<OrganizationProfile>('/api/admin/organization', { method: 'PUT', body: payload })
}

export async function fetchBranches(): Promise<BranchRow[]> {
  return apiRequest<BranchRow[]>('/api/admin/branches', { method: 'GET', skipCsrf: true })
}

export async function createBranch(payload: {
  name: string
  city?: string
  address?: string
  headcount?: number
  active?: boolean
}): Promise<BranchRow> {
  return apiRequest<BranchRow>('/api/admin/branches', { method: 'POST', body: payload })
}

export async function updateBranch(
  branchId: string,
  payload: { name?: string; city?: string; address?: string; headcount?: number; active?: boolean },
): Promise<BranchRow> {
  return apiRequest<BranchRow>(`/api/admin/branches/${branchId}`, {
    method: 'PUT',
    body: payload,
  })
}

export async function fetchAssets(): Promise<AssetRow[]> {
  return apiRequest<AssetRow[]>('/api/admin/assets', { method: 'GET', skipCsrf: true })
}

export async function createAsset(payload: {
  name: string
  assetCode: string
  category?: string
  brand?: string
  model?: string
  serialNumber?: string
  purchaseDate?: string
  purchasePrice?: number
  assignedToId?: string
  assetCondition?: string
  location?: string
  notes?: string
}): Promise<AssetRow> {
  return apiRequest<AssetRow>('/api/admin/assets', { method: 'POST', body: payload })
}

export async function fetchTrainings(): Promise<TrainingRow[]> {
  return apiRequest<TrainingRow[]>('/api/admin/trainings', { method: 'GET', skipCsrf: true })
}

export async function createTraining(payload: {
  title: string
  description?: string
  category?: string
  trainer?: string
  location?: string
  mode?: string
  startDate?: string
  endDate?: string
  durationHours?: number
  maxParticipants?: number
  cost?: number
  status?: string
}): Promise<TrainingRow> {
  return apiRequest<TrainingRow>('/api/admin/trainings', { method: 'POST', body: payload })
}

export async function fetchPerformanceReviews(): Promise<PerformanceReviewRow[]> {
  return apiRequest<PerformanceReviewRow[]>('/api/admin/performance-reviews', {
    method: 'GET',
    skipCsrf: true,
  })
}

export async function createPerformanceReview(payload: {
  employeeId: string
  reviewerId?: string
  reviewYear: number
  reviewQuarter?: number
  reviewType?: string
  score?: number
  rating?: string
  goals?: string
  comments?: string
  status?: string
}): Promise<PerformanceReviewRow> {
  return apiRequest<PerformanceReviewRow>('/api/admin/performance-reviews', {
    method: 'POST',
    body: payload,
  })
}

export async function fetchAuditLogs(): Promise<AuditLogRow[]> {
  return apiRequest<AuditLogRow[]>('/api/admin/audit-logs', { method: 'GET', skipCsrf: true })
}

export async function fetchReportSummary(): Promise<ReportSummary> {
  return apiRequest<ReportSummary>('/api/admin/reports/summary', { method: 'GET', skipCsrf: true })
}

export async function fetchFeed(): Promise<FeedPost[]> {
  return apiRequest<FeedPost[]>('/api/feeds', { method: 'GET', skipCsrf: true })
}

export async function createFeedPost(payload: { title: string; body: string }): Promise<FeedPost> {
  return apiRequest<FeedPost>('/api/admin/feeds', { method: 'POST', body: payload })
}

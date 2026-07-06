import type {
  AppearancePrefs,
  AuditLogRecord,
  BackupConfig,
  BranchRecord,
  CompanyProfileData,
  DepartmentRecord,
  EmailTemplateRecord,
  GradeRecord,
  IntegrationRecord,
  LocalizationConfig,
  ModuleConfig,
  NotificationConfig,
  OperatorRecord,
  RoleRecord,
  SecurityConfig,
  SettingsNavSection,
  SettingsPanelId,
  SettingsStoreState,
  WorkflowRecord,
} from '../types/settings'

export const SETTINGS_NAV_SECTIONS: SettingsNavSection[] = [
  {
    title: 'ORGANISATION',
    items: [
      { id: 'company_profile', label: 'Company profile', icon: '🏢' },
      { id: 'modules', label: 'Modules', icon: '▦' },
      { id: 'branch_location', label: 'Branch & location', icon: '🌳' },
      { id: 'department_position', label: 'Department & position', icon: '🔗' },
    ],
  },
  {
    title: 'ACCESS CONTROL',
    items: [
      { id: 'users_accounts', label: 'Users & accounts', icon: '👥' },
      { id: 'roles_permissions', label: 'Roles & permissions', icon: '🛡' },
      { id: 'approval_workflow', label: 'Approval workflow', icon: '✓' },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { id: 'notifications', label: 'Notifications', icon: '🔔' },
      { id: 'integrations', label: 'Integrations', icon: '🧩' },
      { id: 'security', label: 'Security', icon: '🔒' },
      { id: 'audit_log', label: 'Audit log', icon: '📄' },
    ],
  },
  {
    title: 'PREFERENCES',
    items: [
      { id: 'appearance', label: 'Appearance', icon: '◐' },
      { id: 'language', label: 'Language', icon: '🌐' },
      { id: 'email_templates', label: 'Email templates', icon: '✉' },
      { id: 'backup_data', label: 'Backup & data', icon: '💾' },
    ],
  },
]

export const EMPLOYEE_SETTINGS_SECTIONS: SettingsNavSection[] = [
  {
    title: 'PREFERENCES',
    items: [
      { id: 'appearance', label: 'Appearance', icon: '◐' },
      { id: 'language', label: 'Language', icon: '🌐' },
    ],
  },
]

export function settingsSectionsFor(isHrAdmin: boolean): SettingsNavSection[] {
  return isHrAdmin ? SETTINGS_NAV_SECTIONS : EMPLOYEE_SETTINGS_SECTIONS
}

export function defaultSettingsPanel(isHrAdmin: boolean): SettingsPanelId {
  return isHrAdmin ? 'company_profile' : 'appearance'
}

export function allPanelIds(sections: SettingsNavSection[]): SettingsPanelId[] {
  return sections.flatMap((s) => s.items.map((i) => i.id))
}

const seedCompanyProfile = (): CompanyProfileData => ({
  name: 'Novora Pte Ltd',
  registrationNo: '202609312-W',
  industry: 'Technology & Software',
  companySize: '1,001 - 5,000 employees',
  foundedYear: '2016',
  website: 'www.novora.com',
  addressLine1: 'Level 18, Menara Novora, Jalan Sultan Ismail',
  city: 'Kuala Lumpur',
  state: 'Wilayah Persekutuan Kuala Lumpur',
  postcode: '50250',
  phone: '+60 3-2100 0000',
  hrEmail: 'hr@novora.com',
  payrollEmail: 'payroll@novora.com',
  epfId: 'EPF-12345678',
  socsoId: 'SSB-12345678',
  taxId: 'PCB-12345678',
  logoInitials: 'NV',
})

const seedModules = (): Record<string, ModuleConfig> => ({
  'Employee Management': { description: 'Profile registry, org charts, document dossiers', enabled: true },
  'Recruitment Management': { description: 'Candidate pools, vacancy pipeline, interview evaluations', enabled: true },
  'On/Off-boarding': { description: 'SSO auto-provisioning, hardware checklists, exit clears', enabled: true },
  'Leave Management': { description: 'Balances, requests, multi-tier approvals', enabled: true },
  'Attendance & Rostering': { description: 'Clock-ins, smart location geo-fences, shifts', enabled: true },
  'Payroll Engine': { description: 'Pay runs, bank e-files, regulatory files', enabled: true },
  'Performance Review': { description: 'KPI scorecards, 360 review, evaluations', enabled: true },
  'Disciplinary Cases': { description: 'Warning letters, hearings, actions tracker', enabled: true },
  'Claim Management': { description: 'Receipt parsing, OCR scanning, limits', enabled: true },
  'Benefits Administration': { description: 'Medical plans, insurance coverage, wellness grants', enabled: true },
  'Helpdesk & Inquiries': { description: 'SLA priority tickets, inquiry categories, CSAT surveys', enabled: true },
  'Workspace Engagement': { description: 'Sentiment surveys, feedback quotes, flexibility ratings', enabled: true },
  'Training Programs': { description: 'HQ seminars, course catalogs, enrollment sheets', enabled: true },
  'Learning & LMS': { description: 'Compliance certifications, verification hashes, modules', enabled: true },
  'Hardware & Assets': { description: 'Item depreciation tracker, serial serial, custodian logs', enabled: true },
})

const seedBranches = (): BranchRecord[] => [
  { id: 'br-1', name: 'Kuala Lumpur HQ office', city: 'Kuala Lumpur', staffLabel: '1024 staff members', statusBadge: 'MAIN BRANCH HQ', statusTone: 'success' },
  { id: 'br-2', name: 'Penang Innovation hub', city: 'Georgetown', staffLabel: '142 staff members', statusBadge: 'ACTIVE OFFICE', statusTone: 'info' },
  { id: 'br-3', name: 'Johor Fulfillment center', city: 'Johor Bahru', staffLabel: '118 staff members', statusBadge: 'ACTIVE OFFICE', statusTone: 'info' },
]

const seedDepartments = (): DepartmentRecord[] => [
  { name: 'Engineering', head: 'DAVID NG', employeeLabel: '342 employees' },
  { name: 'Finance', head: 'RACHEL TAN', employeeLabel: '180 employees' },
  { name: 'HR', head: 'NINA REZA', employeeLabel: '88 employees' },
  { name: 'Marketing', head: 'KEVIN LIM', employeeLabel: '142 employees' },
  { name: 'Operations', head: 'MALIK SAID', employeeLabel: '261 employees' },
]

const seedGrades = (): GradeRecord[] => [
  { code: 'G-3', rangeLabel: 'MYR 2,500 — MYR 4,000' },
  { code: 'G-5', rangeLabel: 'MYR 4,500 — MYR 7,500' },
  { code: 'G-7', rangeLabel: 'MYR 8,000 — MYR 12,000' },
  { code: 'G-9', rangeLabel: 'MYR 13,000 — MYR 18,000' },
]

const seedOperators = (): OperatorRecord[] => [
  { id: 'op-1', name: 'HR Admin', email: 'hr@novora.com', role: 'SUPER ADMIN', lastActive: 'Just now', active: true },
  { id: 'op-2', name: 'Nina Reza', email: 'nina@novora.com', role: 'HR MANAGER', lastActive: '6 May 09:15', active: true },
  { id: 'op-3', name: 'David Ng', email: 'david@novora.com', role: 'DEPARTMENT HEAD', lastActive: '5 May 18:42', active: true },
]

const seedRoles = (): RoleRecord[] => [
  { name: 'SUPER ADMIN', tag: 'System default', description: 'Unrestricted read/write credentials across every module', isSystemDefault: true },
  { name: 'HR MANAGER', tag: 'Custom role', description: 'Can administer files, rosters, run payroll and claims approval' },
  { name: 'DEPARTMENT HEAD', tag: 'Custom role', description: 'Can view department cards, request approvals, review schedules' },
]

const seedWorkflows = (): WorkflowRecord[] => [
  { name: 'Leave Approval Routing', description: 'Requires 2-level supervisor signoff for long leaves', routing: 'Direct Manager → HOD', active: true },
  { name: 'Claims Reimbursements', description: 'Routed dynamically according to claims tier amount', routing: 'Manager → Finance Team', active: true },
  { name: 'Overtime Dispatch Trigger', description: 'Requires direct managers verification on additional clock cycles', routing: 'Direct Manager', active: false },
]

const seedNotifications = (): NotificationConfig => ({
  channels: {
    'In-app notifications': true,
    'Email alerts': true,
    'Mobile smart push': false,
    'SMS / WhatsApp alerts': false,
  },
  triggers: {
    'Leave request submitted': true,
    'Leave approved / denied status': true,
    'Attendance - missing wipe logs': true,
    'Claims submitted / processed': true,
    'Contract renewal upcoming (30d)': true,
  },
})

const seedSecurity = (): SecurityConfig => ({
  twoFa: true,
  sso: false,
  forceReset: true,
  minLength: '8 characters',
  expiration: '90 days',
  requireUpperLower: true,
  requireNumbers: true,
  requireSpecial: true,
})

const seedLocalization = (): LocalizationConfig => ({
  language: 'English (US)',
  timezone: 'Asia/Kuala_Lumpur (UTC+8)',
  dateFormat: 'DD/MM/YYYY',
  currency: 'MYR — Malaysian Ringgit',
})

const seedEmailTemplates = (): EmailTemplateRecord[] => [
  {
    id: 'tpl-1',
    name: 'Leave request submitted',
    trigger: 'On leave request',
    lastEdited: '2 Mar 2026',
    subject: 'New Leave Approval Requested',
    body: 'Dear Team,\n\nEmployee {name} has requested {days} days of leave.\n\nPlease review and action accordingly.\n\nBest regards,\nNovora HR Automated Engine',
  },
  { id: 'tpl-2', name: 'Payslip available', trigger: 'On payroll confirm', lastEdited: '1 Jan 2026', subject: 'Your payslip is ready', body: '' },
  { id: 'tpl-3', name: 'Claim approved', trigger: 'On claim approval', lastEdited: '15 Feb 2026', subject: 'Claim approved', body: '' },
  { id: 'tpl-4', name: 'Welcome - new employee', trigger: 'On employee creation', lastEdited: '10 Jan 2026', subject: 'Welcome to Novora', body: '' },
]

const seedBackup = (): BackupConfig => ({
  frequency: 'Daily',
  captureTime: '02:00 AM',
  retention: '90 days',
  lastSuccess: '6 May 02:00 AM',
  snapshotGb: 4.2,
})

const seedAuditLogs = (): AuditLogRecord[] => [
  { timestamp: '6 May 10:42', user: 'David Ng', details: 'Approved claim MYR 120.00', module: 'Claims', moduleTone: 'warning', ip: '192.168.1.24' },
  { timestamp: '6 May 09:15', user: 'HR Admin', details: 'Updated payroll – May 2026', module: 'Payroll', moduleTone: 'success', ip: '192.168.1.10' },
  { timestamp: '5 May 18:30', user: 'Nina Reza', details: 'Added disciplinary case EMP-0187', module: 'Disciplinary', moduleTone: 'warning', ip: '192.168.1.14' },
  { timestamp: '5 May 16:00', user: 'HR Admin', details: 'Deleted user account (EMP-0199)', module: 'Users', moduleTone: 'info', ip: '192.168.1.10' },
  { timestamp: '4 May 11:00', user: 'HR Admin', details: 'Exported payroll report Apr 2026', module: 'Payroll', moduleTone: 'success', ip: '192.168.1.10' },
]

const seedAppearance = (): AppearancePrefs => ({
  themeSchedule: 'light',
  preset: 'slate',
  density: 'cozy',
  accent: 'blue',
})

export function createSettingsStore(): SettingsStoreState {
  return {
    companyProfile: seedCompanyProfile(),
    modules: seedModules(),
    branches: seedBranches(),
    departments: seedDepartments(),
    grades: seedGrades(),
    operators: seedOperators(),
    roles: seedRoles(),
    workflows: seedWorkflows(),
    notifications: seedNotifications(),
    security: seedSecurity(),
    localization: seedLocalization(),
    emailTemplates: seedEmailTemplates(),
    backup: seedBackup(),
    auditLogs: seedAuditLogs(),
    apiKeyMasked: 'sk-aperio-••••••••••••••••4f21',
    apiKeyFull: 'sk-novora-live-4f21a8c3d9e2',
    apiKeyRevealed: false,
    appearance: seedAppearance(),
  }
}

export const INTEGRATIONS: IntegrationRecord[] = [
  { title: 'Payroll — Bank file exporter', description: 'Secure bank API exporter for salaries', status: 'ACTIVE CONNECTION', statusTone: 'success' },
  { title: 'Biometric Access logs terminal', description: 'Sync swipe schedules via hardware biometric endpoints', status: 'ACTIVE CONNECTION', statusTone: 'success' },
  { title: 'Currency exchange API engine', description: 'Live FX conversion metrics for corporate claims', status: 'ACTIVE CONNECTION', statusTone: 'success' },
  { title: 'SMTP — Custom mail server', description: 'smtp.aperiooccasio.com on TLS port 587', status: 'ACTIVE CONNECTION', statusTone: 'success' },
  { title: 'KWSP EPF e-filing sync portal', description: 'Immediate direct submission to retirement funds', status: 'SETUP PENDING', statusTone: 'warning' },
  { title: 'OCR Document translation sync', description: 'Tesseract AI engine receipt translation', status: 'ACTIVE CONNECTION', statusTone: 'success' },
]

export const PUBLIC_HOLIDAYS: { name: string; date: string }[] = [
  { name: 'Hari Raya Aidilfitri', date: '31 March' },
  { name: 'Labour Day', date: '1 May' },
  { name: 'Wesak Day', date: '12 May' },
  { name: 'National Day (Hari Kebangsaan)', date: '31 August' },
]

export const OPERATOR_ROLES = ['Super Admin', 'HR Manager', 'Department head'] as const

export const EMAIL_TRIGGERS = ['On employee creation', 'On leave request', 'On payroll confirm', 'On claim approval'] as const

export const WORKFLOW_ROUTING_OPTIONS = ['Direct Manager', 'Direct Manager → HOD', 'Manager → Finance Team'] as const

export function nextSequentialId(ids: string[], prefix: string): number {
  let max = 0
  for (const id of ids) {
    if (!id.startsWith(prefix)) continue
    const n = Number.parseInt(id.slice(prefix.length), 10)
    if (!Number.isNaN(n) && n > max) max = n
  }
  return max + 1
}

export function normalizeOperatorRole(role: string): string {
  const map: Record<string, string> = {
    'Super Admin': 'SUPER ADMIN',
    'HR Manager': 'HR MANAGER',
    'Department head': 'DEPARTMENT HEAD',
  }
  return map[role] ?? role.toUpperCase()
}

export function operatorRoleTone(role: string): import('../types/settings').SettingsPillTone {
  switch (role.toUpperCase()) {
    case 'SUPER ADMIN':
      return 'info'
    case 'HR MANAGER':
      return 'purple'
    case 'DEPARTMENT HEAD':
      return 'warning'
    default:
      return 'neutral'
  }
}

export function formatNow(): string {
  const n = new Date()
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const h = String(n.getHours()).padStart(2, '0')
  const m = String(n.getMinutes()).padStart(2, '0')
  return `${n.getDate()} ${months[n.getMonth()]} ${h}:${m}`
}

export function renderEmailPreview(body: string): string {
  return body
    .replace(/\{name\}/g, 'Jane Doe')
    .replace(/\{days\}/g, '3')
    .replace(/\{id\}/g, 'EMP-0042')
    .replace(/\{email\}/g, 'jane.doe@novora.com')
}

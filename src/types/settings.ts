import type { RecruitPillTone } from './recruitment'

export type SettingsPillTone = RecruitPillTone

export type SettingsPanelId =
  | 'company_profile'
  | 'modules'
  | 'branch_location'
  | 'department_position'
  | 'users_accounts'
  | 'roles_permissions'
  | 'approval_workflow'
  | 'notifications'
  | 'integrations'
  | 'security'
  | 'audit_log'
  | 'appearance'
  | 'language'
  | 'email_templates'
  | 'backup_data'

export type CompanyProfileData = {
  name: string
  registrationNo: string
  industry: string
  companySize: string
  foundedYear: string
  website: string
  addressLine1: string
  city: string
  state: string
  postcode: string
  phone: string
  hrEmail: string
  payrollEmail: string
  epfId: string
  socsoId: string
  taxId: string
  logoInitials: string
}

export type ModuleConfig = {
  description: string
  enabled: boolean
}

export type BranchRecord = {
  id: string
  name: string
  city: string
  staffLabel: string
  statusBadge: string
  statusTone: SettingsPillTone
}

export type DepartmentRecord = {
  name: string
  head: string
  employeeLabel: string
}

export type GradeRecord = {
  code: string
  rangeLabel: string
}

export type OperatorRecord = {
  id: string
  name: string
  email: string
  role: string
  lastActive: string
  active: boolean
}

export type RoleRecord = {
  name: string
  tag: string
  description: string
  isSystemDefault?: boolean
}

export type WorkflowRecord = {
  name: string
  description: string
  routing: string
  active: boolean
}

export type NotificationConfig = {
  channels: Record<string, boolean>
  triggers: Record<string, boolean>
}

export type SecurityConfig = {
  twoFa: boolean
  sso: boolean
  forceReset: boolean
  minLength: string
  expiration: string
  requireUpperLower: boolean
  requireNumbers: boolean
  requireSpecial: boolean
}

export type LocalizationConfig = {
  language: string
  timezone: string
  dateFormat: string
  currency: string
}

export type EmailTemplateRecord = {
  id: string
  name: string
  trigger: string
  lastEdited: string
  subject: string
  body: string
}

export type BackupConfig = {
  frequency: string
  captureTime: string
  retention: string
  lastSuccess: string
  snapshotGb: number
}

export type AuditLogRecord = {
  timestamp: string
  user: string
  details: string
  module: string
  moduleTone: SettingsPillTone
  ip: string
}

export type IntegrationRecord = {
  title: string
  description: string
  status: string
  statusTone: SettingsPillTone
}

export type SettingsNavItem = {
  id: SettingsPanelId
  label: string
  icon: string
}

export type SettingsNavSection = {
  title: string
  items: SettingsNavItem[]
}

export type AppearancePrefs = {
  themeSchedule: 'auto' | 'light' | 'dark'
  preset: 'slate' | 'minimal' | 'cyber' | 'emerald'
  density: 'compact' | 'cozy' | 'spacious'
  accent: 'blue' | 'pink' | 'green' | 'orange'
}

export type SettingsStoreState = {
  companyProfile: CompanyProfileData
  modules: Record<string, ModuleConfig>
  branches: BranchRecord[]
  departments: DepartmentRecord[]
  grades: GradeRecord[]
  operators: OperatorRecord[]
  roles: RoleRecord[]
  workflows: WorkflowRecord[]
  notifications: NotificationConfig
  security: SecurityConfig
  localization: LocalizationConfig
  emailTemplates: EmailTemplateRecord[]
  backup: BackupConfig
  auditLogs: AuditLogRecord[]
  apiKeyMasked: string
  apiKeyFull: string
  apiKeyRevealed: boolean
  appearance: AppearancePrefs
}

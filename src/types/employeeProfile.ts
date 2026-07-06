export type ProfileHeader = {
  fullName: string
  initials: string
  statusLabel: string
  employeeCode: string
  location: string
  departmentTitle: string
  reportsTo: string
  tenureLabel: string
  payGradeLabel: string
  leaveLeftLabel: string
  performanceLabel: string
}

export type LeaveBalanceRow = {
  label: string
  used: number
  total: number
  colorKey: 'blue' | 'green' | 'orange'
}

export type PerformanceSkillRow = {
  label: string
  percent: number
  colorKey: 'blue' | 'green' | 'purple'
}

export type ProfileSummary = {
  employment: { key: string; value: string }[]
  leaveBalances: LeaveBalanceRow[]
  performanceSkills: PerformanceSkillRow[]
  lastAppraisal: string
  nextReview: string
  hrNotes: string
  blacklisted: boolean
  autoClockIn: boolean
}

export type ProfilePersonal = {
  fullName: string
  dateOfBirth: string
  gender: string
  nationality: string
  nric: string
  religion: string
  maritalStatus: string
  personalEmail: string
  mobile: string
  race: string
  passportEnabled: boolean
  passportNo: string
  passportCountry: string
  passportIssue: string
  passportExpiry: string
  addr1: string
  addr2: string
  city: string
  state: string
  postcode: string
  country: string
  sameAsPermanent: boolean
}

export type FamilyMemberRow = {
  name: string
  relationship: string
  dob: string
  nric: string
  taxExempt: boolean
  passport: string
}

export type EmergencyContactRow = {
  name: string
  relationship: string
  phone: string
  address: string
}

export type ProfileFamily = {
  members: FamilyMemberRow[]
  emergencyContacts: EmergencyContactRow[]
}

export type BiometricDeviceRow = {
  taNumber: string
  terminal: string
  deviceType: string
  location: string
  active: boolean
}

export type ProfileBiometric = {
  enabled: boolean
  devices: BiometricDeviceRow[]
  autoClock: boolean
  ignoreMissingSwipe: boolean
  ignoreRotaDeduction: boolean
  assignedShift: string
}

export type PayLineRow = {
  label: string
  amount: string
  frequency: string
  taxable?: boolean
  ref?: string
  active: boolean
}

export type ProfilePayRate = {
  payGrade: string
  payType: string
  currency: string
  basicSalary: string
  effectiveDate: string
  bankMasked: string
  allowances: PayLineRow[]
  deductions: PayLineRow[]
  estimatedNetMonthly: string
}

export type CareerRow = {
  company: string
  position: string
  fromLabel: string
  toLabel: string
  reason: string
}

export type ProfileCareer = { rows: CareerRow[] }

export type EducationRow = {
  institution: string
  qualification: string
  field: string
  year: string
  gradeLabel: string
}

export type ProfileEducation = { rows: EducationRow[] }

export type DocumentRow = {
  name: string
  type: string
  uploaded: string
  expiry: string
}

export type ProfileDocuments = { rows: DocumentRow[] }

export type EmployeeProfileDetail = {
  header: ProfileHeader
  summary: ProfileSummary
  personal: ProfilePersonal
  family: ProfileFamily
  biometric: ProfileBiometric
  payRate: ProfilePayRate
  career: ProfileCareer
  education: ProfileEducation
  documents: ProfileDocuments
}

export type ProfileTabId =
  | 'summary'
  | 'personal'
  | 'family'
  | 'biometric'
  | 'payRate'
  | 'career'
  | 'education'
  | 'documents'

export const PROFILE_TABS: { id: ProfileTabId; label: string }[] = [
  { id: 'summary', label: 'Summary' },
  { id: 'personal', label: 'Personal' },
  { id: 'family', label: 'Family' },
  { id: 'biometric', label: 'Biometric' },
  { id: 'payRate', label: 'Pay Rate' },
  { id: 'career', label: 'Career' },
  { id: 'education', label: 'Education' },
  { id: 'documents', label: 'Documents' },
]

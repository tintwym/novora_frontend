import type { RecruitPillTone } from './recruitment'

export type BenefitPlan = {
  badge: string
  tone: RecruitPillTone
  title: string
  provider: string
  price: string
  description: string
  inclusions: string[]
}

export type FsaClaimRow = {
  id: string
  employee: string
  classification: string
  classTone: RecruitPillTone
  amount: string
  status: string
  statusTone: RecruitPillTone
  dateFiled: string
}

export type PayrollBenefitRow = {
  refId: string
  employee: string
  benefitItem: string
  deductionType: string
  typeTone: RecruitPillTone
  periodicImpact: string
  positive: boolean
  syncStatus: string
  syncTone: RecruitPillTone
  lastSync: string
}

export type VendorRow = {
  name: string
  category: string
  site: string
  employees: number
  premium: string
  renewal: string
}

export type ReportClaimRow = {
  name: string
  empId: string
  category: string
  amount: string
  status: string
  statusTone: RecruitPillTone
}

export type RatioBar = {
  label: string
  pct: number
  color: string
  trailing: string
}

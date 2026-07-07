import type { RecruitPillTone } from './recruitment'

export type AllowanceTypeRow = {
  name: string
  policyType: string
  policyTone: RecruitPillTone
  amount: string
  deduction: string
  taxable: boolean
  attachEmp: boolean
}

export type TravelClaimRow = {
  name: string
  purpose: string
  date: string
  amount: string
  status: string
  tone: RecruitPillTone
}

export type AllowancePaymentRow = {
  name: string
  department: string
  transport: string
  meals: string
  bonus: string
  total: string
}

export type BonusTypeRow = {
  name: string
  policyType: string
  payMonth: string
  basedOn: string
  status: string
}

export type BonusPaymentRow = {
  name: string
  department: string
  bonusType: string
  amount: string
  status: string
}

export type OtApprovalRow = {
  name: string
  date: string
  reason: string
  hours: string
}

export type OtHistoryRow = {
  name: string
  date: string
  hours: string
  reason: string
  status: string
  tone: RecruitPillTone
}

export type DepositTypeRow = {
  name: string
  code: string
  employment: string
  frequency: string
  amount: string
  status: string
}

export type DeductionTypeRow = {
  name: string
  type: string
  rule: string
  amount: string
  onPayslip: boolean
  status: string
}

export type TaxCategoryRow = {
  name: string
  code: string
  calculateOn: string
  overallIncome: boolean
  status: string
}

export type EmolumentRow = {
  name: string
  code: string
  exemptLimit: string
  taxable: boolean
}

export type PayrollPrepRow = {
  name: string
  compliance: string
  banking: string
  claims: string
  claimsNone?: boolean
  status: string
  tone: RecruitPillTone
}

export type PayrollHistoryRow = {
  period: string
  headcount: string
  amount: string
  released: string
}

export type DeptPayrollRow = {
  department: string
  staff: string
  avgBasic: string
  withholdings: string
  gross: string
  net: string
  healthy: boolean
}

export type PayrollLedgerRow = {
  name: string
  meta: string
  basic: string
  allowance: string
  ot: string
  gross: string
  epf: string
  socsoTax: string
  deductions: string
  net: string
}

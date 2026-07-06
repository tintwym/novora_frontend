import type {
  AllowancePaymentRow,
  AllowanceTypeRow,
  BonusPaymentRow,
  BonusTypeRow,
  DeductionTypeRow,
  DepositTypeRow,
  DeptPayrollRow,
  EmolumentRow,
  OtApprovalRow,
  OtHistoryRow,
  PayrollHistoryRow,
  PayrollLedgerRow,
  PayrollPrepRow,
  TaxCategoryRow,
  TravelClaimRow,
} from '../types/payroll'

export const ALLOWANCE_TYPES: AllowanceTypeRow[] = [
  { name: 'Transport allowance', policyType: 'Transport', policyTone: 'info', amount: '300.00', deduction: '—', taxable: false, attachEmp: false },
  { name: 'Meal allowance', policyType: 'Meal', policyTone: 'warning', amount: '200.00', deduction: '10.00/day', taxable: false, attachEmp: false },
  { name: 'Phone allowance', policyType: 'Normal', policyTone: 'purple', amount: '150.00', deduction: '—', taxable: true, attachEmp: true },
  { name: 'On time allowance', policyType: 'Shift', policyTone: 'info', amount: '100.00', deduction: '—', taxable: false, attachEmp: false },
  { name: 'Shift allowance', policyType: 'Shift', policyTone: 'warning', amount: '250.00', deduction: '—', taxable: false, attachEmp: false },
  { name: 'Grade allowance', policyType: 'Grade', policyTone: 'purple', amount: '500.00', deduction: '—', taxable: false, attachEmp: true },
]

export const TRAVEL_CLAIMS: TravelClaimRow[] = [
  { name: 'Sarah Lim', purpose: 'Client Onsite Support', date: '2026-05-12', amount: '120.00', status: 'Approved', tone: 'success' },
  { name: 'Raj Kumar', purpose: 'Hardware Procurement Run', date: '2026-05-14', amount: '85.50', status: 'Approved', tone: 'success' },
  { name: 'Ahmad L', purpose: 'Regional Offsite Meeting', date: '2026-05-21', amount: '210.00', status: 'Pending', tone: 'warning' },
]

export const ALLOWANCE_PAYMENTS: AllowancePaymentRow[] = [
  { name: 'Ahmad Wahid', department: 'Operations', transport: '300.00', meals: '200.00', bonus: '—', total: '500.00' },
  { name: 'David Ng', department: 'Engineering', transport: '—', meals: '200.00', bonus: '150.00', total: '350.00' },
  { name: 'Sarah Lim', department: 'Engineering', transport: '300.00', meals: '200.00', bonus: '—', total: '500.00' },
]

export const BONUS_TYPES: BonusTypeRow[] = [
  { name: 'Annual performance bonus', policyType: 'Normal', payMonth: 'December', basedOn: 'Performance eval', status: 'Active' },
  { name: 'Service bonus (3 yrs)', policyType: 'Working service', payMonth: 'On anniversary', basedOn: 'Fixed amount', status: 'Active' },
  { name: 'Long-term incentive (LTIP)', policyType: 'LTIP', payMonth: 'March (FY end)', basedOn: 'Salary x factor', status: 'Active' },
]

export const BONUS_PAYMENTS: BonusPaymentRow[] = [
  { name: 'David Ng', department: 'Engineering', bonusType: 'Annual performance bonus', amount: '2,500.00', status: 'Approved' },
  { name: 'Sarah Lim', department: 'Engineering', bonusType: 'Service bonus (3 yrs)', amount: '1,200.00', status: 'Approved' },
]

export const OT_APPROVAL_QUEUE: OtApprovalRow[] = [
  { name: 'Raj Kumar', date: '2026-05-13', reason: 'Emergency database patch', hours: '4' },
  { name: 'Ahmad L', date: '2026-05-14', reason: 'Warehouse stock auditing', hours: '2' },
  { name: 'Emily Tan', date: '2026-05-15', reason: 'E-commerce launch support', hours: '6' },
]

export const OT_HISTORY: OtHistoryRow[] = [
  { name: 'Sarah Lim', date: '2026-05-12', hours: '3.5', reason: 'Production server release', status: 'Approved', tone: 'success' },
  { name: 'Raj Kumar', date: '2026-05-13', hours: '4', reason: 'Emergency database patch', status: 'Pending', tone: 'warning' },
  { name: 'Ahmad L', date: '2026-05-14', hours: '2', reason: 'Warehouse stock auditing', status: 'Pending', tone: 'warning' },
  { name: 'Emily Tan', date: '2026-05-15', hours: '6', reason: 'E-commerce launch support', status: 'Pending', tone: 'warning' },
]

export const OT_ATTACHED_EMPLOYEES = ['Sarah Lim', 'Raj Kumar', 'Ahmad L']

export const DEPOSIT_TYPES: DepositTypeRow[] = [
  { name: 'Uniform deposit', code: 'UNI', employment: 'All staff', frequency: 'One-time', amount: 'MYR 100', status: 'Active' },
  { name: 'Saving deposit', code: 'SAV', employment: 'Permanent', frequency: 'Monthly', amount: 'MYR 200', status: 'Active' },
  { name: 'Laptop deposit', code: 'LAP', employment: 'Engineering', frequency: 'One-time', amount: 'MYR 500', status: 'Active' },
]

export const DEDUCTION_TYPES: DeductionTypeRow[] = [
  { name: 'EPF (employee)', type: 'Statutory', rule: 'Based on salary', amount: '11%', onPayslip: true, status: 'Active' },
  { name: 'SOCSO', type: 'Statutory', rule: 'Statutory table', amount: '0.5%', onPayslip: true, status: 'Active' },
  { name: 'Income tax (PCB)', type: 'Tax', rule: 'PCB schedule', amount: 'Varied', onPayslip: true, status: 'Active' },
  { name: 'Late deduction', type: 'Rota rule', rule: 'Per minute late', amount: 'MYR 0.50/min', onPayslip: true, status: 'Active' },
  { name: 'Missing swipe', type: 'Attendance', rule: 'Per occurrence', amount: 'MYR 20.00', onPayslip: true, status: 'Active' },
  { name: 'Unpaid leave', type: 'Leave', rule: 'Normal rate/day', amount: 'Salary ÷ work days', onPayslip: true, status: 'Active' },
]

export const TAX_CATEGORIES: TaxCategoryRow[] = [
  { name: 'Personal income tax', code: 'PCB', calculateOn: 'Monthly salary', overallIncome: true, status: 'Active' },
  { name: 'Social security (SOCSO)', code: 'SSB', calculateOn: 'Basic salary', overallIncome: false, status: 'Active' },
]

export const EMOLUMENTS: EmolumentRow[] = [
  { name: 'Basic Salary', code: 'EMOL-01', exemptLimit: 'Fully Taxable', taxable: true },
  { name: 'Transport Allowance', code: 'EMOL-02', exemptLimit: 'Exempt up to MYR 6,000 / year', taxable: false },
  { name: 'Meal Allowance', code: 'EMOL-03', exemptLimit: 'Exempt if under MYR 30 / day', taxable: false },
  { name: 'Phone Allowance', code: 'EMOL-04', exemptLimit: 'Exempt up to MYR 300 / year', taxable: true },
  { name: 'Performance Bonus', code: 'EMOL-05', exemptLimit: 'Fully Taxable', taxable: true },
  { name: 'Overtime Payment', code: 'EMOL-06', exemptLimit: 'Fully Taxable', taxable: true },
]

export const PAYROLL_PREP: PayrollPrepRow[] = [
  { name: 'Ahmad L', department: 'Operations', basic: 'MYR 4,200', allowances: 'MYR 500', deductions: 'MYR 612', status: 'Ready', tone: 'success' },
  { name: 'Fatimah H', department: 'HR', basic: 'MYR 5,025', allowances: 'MYR 350', deductions: 'MYR 804', status: 'Ready', tone: 'success' },
  { name: 'Johnathan D', department: 'Finance', basic: 'MYR 3,900', allowances: 'MYR 200', deductions: 'MYR 623', status: 'Needs Audit', tone: 'warning' },
]

export const PAYROLL_HISTORY: PayrollHistoryRow[] = [
  { period: 'April 2026 Period', headcount: '428 Staff', amount: 'MYR 1,184,330.12', released: '2026-04-28' },
  { period: 'March 2026 Period', headcount: '427 Staff', amount: 'MYR 1,172,890.00', released: '2026-03-28' },
]

export const DEPT_PAYROLL: DeptPayrollRow[] = [
  { department: 'Engineering', staff: '3 staff', avgBasic: 'MYR 3,900', withholdings: 'MYR 1,868', gross: 'MYR 12,710', net: 'MYR 10,842', healthy: true },
  { department: 'Finance', staff: '2 staff', avgBasic: 'MYR 3,900', withholdings: 'MYR 1,245', gross: 'MYR 8,660', net: 'MYR 7,415', healthy: true },
  { department: 'HR', staff: '2 staff', avgBasic: 'MYR 5,025', withholdings: 'MYR 1,604', gross: 'MYR 11,030', net: 'MYR 9,426', healthy: true },
  { department: 'Marketing', staff: '2 staff', avgBasic: 'MYR 3,450', withholdings: 'MYR 1,102', gross: 'MYR 7,840', net: 'MYR 6,738', healthy: true },
  { department: 'Operations', staff: '4 staff', avgBasic: 'MYR 4,688', withholdings: 'MYR 2,993', gross: 'MYR 20,350', net: 'MYR 17,357', healthy: false },
]

export const PAYROLL_LEDGER: PayrollLedgerRow[] = [
  { name: 'Ahmad Wahid', meta: 'EMP-0001 • Operations', basic: 'MYR 3,450', allowance: '+MYR 230', ot: '+MYR 120', gross: 'MYR 3,800', epf: '-MYR 380', socsoTax: '-MYR 171', deductions: 'MYR 551', net: 'MYR 3,249' },
  { name: 'David Ng', meta: 'EMP-0012 • Engineering', basic: 'MYR 3,900', allowance: '+MYR 350', ot: '+MYR 0', gross: 'MYR 4,250', epf: '-MYR 425', socsoTax: '-MYR 192', deductions: 'MYR 617', net: 'MYR 3,633' },
  { name: 'Sarah Lim', meta: 'EMP-0285 • Engineering', basic: 'MYR 3,900', allowance: '+MYR 500', ot: '+MYR 210', gross: 'MYR 4,610', epf: '-MYR 461', socsoTax: '-MYR 208', deductions: 'MYR 669', net: 'MYR 3,941' },
]

export const OT_APPROVAL_BADGE = 4

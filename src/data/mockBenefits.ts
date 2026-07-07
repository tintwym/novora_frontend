import type { BenefitPlan, FsaClaimRow, PayrollBenefitRow, RatioBar, ReportClaimRow, VendorRow } from '../types/benefits'

export const BENEFIT_EMPLOYEES = [
  'Ahmad Wahid (EMP-0001)',
  'Sarah Lim (EMP-0003)',
  'Raj Kumar (EMP-0285)',
  'Pinky Sharma (EMP-002)',
] as const

export const ENROLLMENT_PLANS: BenefitPlan[] = [
  {
    badge: 'MEDICAL PLAN',
    tone: 'info',
    title: 'Gold Premium Care Plus',
    provider: 'Alliance Insurance Group',
    price: 'RM 450 / month',
    description: 'Highest available tier with direct billing access, 10% co-pay, and private suite rooms.',
    inclusions: ['Direct Clinic Billing', 'Overseas Emergencies', 'Maternity Cover included'],
  },
  {
    badge: 'DENTAL PLAN',
    tone: 'warning',
    title: 'Comprehensive Dental Core',
    provider: 'SmileCare Dental',
    price: 'RM 75 / month',
    description: 'Full preventive and restorative dental coverage for employees and registered dependents.',
    inclusions: ['Prophylaxis 2x/year', 'Crowns & Bridges subsidized', 'Zero wait window for emergencies'],
  },
  {
    badge: 'WELLNESS PLAN',
    tone: 'success',
    title: 'Active Mental Rest & Fit Wallet',
    provider: 'MindBody Global',
    price: 'RM 45 / month',
    description: 'Holistic wellness support including mental health apps and fitness subsidies.',
    inclusions: ['Unlimited Calm premium log', 'Anytime Fitness discounts', '2x counseling sessions/quarter'],
  },
  {
    badge: 'LIFESTYLE PLAN',
    tone: 'purple',
    title: 'Lifestyle Transit & Carbon Credit',
    provider: 'Novora Green Fleet',
    price: 'RM 120 / month',
    description: 'Green commute incentives and carbon-offset perks for sustainable travel.',
    inclusions: ['RM100 monthly Touch n Go pass', 'Commute tax deductions synced', 'EV charging rebates'],
  },
]

export const FSA_CLAIMS: FsaClaimRow[] = [
  { id: 'BEN-8012', employee: 'Pinky Sharma', classification: 'Dental', classTone: 'warning', amount: 'RM 150.00', status: 'Disbursed', statusTone: 'success', dateFiled: '2026-06-02' },
  { id: 'BEN-8055', employee: 'Sarah Lim', classification: 'Optical', classTone: 'purple', amount: 'RM 320.00', status: 'Approved', statusTone: 'info', dateFiled: '2026-06-10' },
  { id: 'BEN-8091', employee: 'Raj Kumar', classification: 'Medical', classTone: 'info', amount: 'RM 45.50', status: 'Reviewing', statusTone: 'warning', dateFiled: '2026-06-14' },
  { id: 'BEN-8110', employee: 'Pinky Sharma', classification: 'Wellness', classTone: 'success', amount: 'RM 90.00', status: 'Reviewing', statusTone: 'warning', dateFiled: '2026-06-15' },
]

export const PAYROLL_BENEFIT_ROWS: PayrollBenefitRow[] = [
  { refId: 'PSC-101', employee: 'Sarah Lim', benefitItem: 'Gold Premium Care Co-Pay', deductionType: 'Co-Pay Deductible', typeTone: 'warning', periodicImpact: '- RM 45.00', positive: false, syncStatus: 'Synced', syncTone: 'success', lastSync: '2026-06-15 09:30' },
  { refId: 'PSC-102', employee: 'Sarah Lim', benefitItem: 'Dental core deductible offset', deductionType: 'Co-Pay Deductible', typeTone: 'warning', periodicImpact: '- RM 15.00', positive: false, syncStatus: 'Synced', syncTone: 'success', lastSync: '2026-06-15 09:30' },
  { refId: 'PSC-103', employee: 'Raj Kumar', benefitItem: 'Health Wallet HSA Pre-tax', deductionType: 'Pre-tax HSA Contribution', typeTone: 'info', periodicImpact: '- RM 200.00', positive: false, syncStatus: 'Synced', syncTone: 'success', lastSync: '2026-06-15 09:30' },
  { refId: 'PSC-104', employee: 'Pinky Sharma', benefitItem: 'Lifestyle green transit subsidy allowance', deductionType: 'Taxable Perk', typeTone: 'pink', periodicImpact: '+ RM 120.00', positive: true, syncStatus: 'Stale - Out of Sync', syncTone: 'danger', lastSync: '2026-06-01 10:15' },
]

export const VENDORS: VendorRow[] = [
  { name: 'Alliance Insurance Group', category: 'PRIMARY HEALTHCARE', site: 'alliance-benefits.com', employees: 142, premium: '58,400', renewal: '2026-12-31' },
  { name: 'SmileCare Dental Services', category: 'DENTAL SPECIALIST', site: 'smilecare-dental.my', employees: 110, premium: '8,250', renewal: '2026-09-30' },
  { name: 'MindBody Global App Inc', category: 'EAP / WELLNESS PORTALS', site: 'mindbody-global.io', employees: 88, premium: '3,960', renewal: '2026-08-15' },
]

export const REPORT_CLAIMS: ReportClaimRow[] = [
  { name: 'Pinky Sharma', empId: 'EMP-882', category: 'Dental', amount: 'RM 150.00', status: 'DISBURSED', statusTone: 'success' },
  { name: 'Sarah Lim', empId: 'EMP-001', category: 'Optical', amount: 'RM 320.00', status: 'APPROVED', statusTone: 'info' },
  { name: 'Raj Kumar', empId: 'EMP-0285', category: 'Medical', amount: 'RM 45.50', status: 'REVIEWING', statusTone: 'warning' },
  { name: 'Pinky Sharma', empId: 'EMP-882', category: 'Wellness', amount: 'RM 90.00', status: 'REVIEWING', statusTone: 'warning' },
]

export const CLAIM_CATEGORY_RATIOS: RatioBar[] = [
  { label: 'Medical Treatment', pct: 40, color: '#2563eb', trailing: 'RM 45.50 (40%)' },
  { label: 'Dental & Crowns', pct: 30, color: '#059669', trailing: 'RM 150.00 (30%)' },
  { label: 'Optical & Contact Lenses', pct: 20, color: '#60a5fa', trailing: 'RM 320.00 (20%)' },
  { label: 'Wellness & Gym Reimbursements', pct: 10, color: '#7c3aed', trailing: 'RM 90.00 (10%)' },
]

export const VENDOR_ALLOCATION: RatioBar[] = [
  { label: 'Alliance Insurance Group', pct: 65, color: '#7c3aed', trailing: '65%' },
  { label: 'SmileCare Dental Services', pct: 20, color: '#059669', trailing: '20%' },
  { label: 'MindBody Global Health', pct: 15, color: '#a78bfa', trailing: '15%' },
]

export const WELLNESS_CATEGORIES = ['Medical', 'Dental', 'Optical', 'Wellness'] as const

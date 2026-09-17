import React, { useCallback, useEffect, useState } from 'react';
import { createLocalId } from '@/lib/createLocalId'
import {
  Search,
  Plus,
  PlusCircle,
  Edit,
  Trash,
  Check,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Coins,
  History,
  Users,
  CreditCard,
  FileText,
  FileSpreadsheet,
  Download,
  DollarSign,
  Calendar,
  Layers,
  ArrowRight,
  Calculator,
  UserCheck,
  Percent,
  Clock,
  Paperclip,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import type { Employee } from '@/types';
import ModuleHeader from '@/components/ui/ModuleHeader';
import { DropdownAnchor, SelectMenu } from '@/components/ui';
import {
  ApiError,
  createAllowanceType,
  createBonusType,
  createDeductionType,
  createDepositType,
  createTaxCategory,
  fetchAdminPayroll,
  fetchAllowanceTypes,
  fetchBonusTypes,
  fetchDeductionTypes,
  fetchDepositTypes,
  fetchMyPayslips,
  fetchOtPolicies,
  fetchOvertimeRecords,
  fetchPayrollAiAnomalies,
  fetchPayrollRunSummary,
  fetchTaxCategories,
  createOvertimeRecord,
  decideOvertimeRecord,
  generateAdminPayroll,
  processAdminPayrollMonth,
  type AllowanceTypeRow,
  type BonusTypeRow,
  type DeductionTypeRow,
  type DepositTypeRow,
  type OtPolicyRow,
  type OvertimeRecordRow,
  type PayrollAnomalyResponse,
  type PayrollRow,
  type PayrollRunSummary,
  type TaxCategoryRow,
} from '@/services';

// Sub Tabs Definitions
export type PayrollMainTab =
  | 'Allowance'
  | 'Bonus'
  | 'Overtime'
  | 'Deposit'
  | 'Deduction'
  | 'Tax'
  | 'Pay management'
  | 'Payroll reports';

interface AllowanceType {
  id: string;
  name: string;
  policyType: string;
  amount: string;
  deductionAmt: string;
  taxable: 'Yes' | 'No';
  onPayslip: 'Yes' | 'No';
  attachEmp: 'Yes' | 'No';
  status: 'Active' | 'Inactive';
}

interface BonusType {
  id: string;
  name: string;
  policyType: string;
  payMonth: string;
  basedOn: string;
  onPayslip: 'Yes' | 'No';
  status: 'Active' | 'Inactive';
}

interface DepositType {
  id: string;
  name: string;
  code: string;
  employmentStatus: string;
  frequency: string;
  amountBasis: string;
  reimburseMonth: string;
  status: 'Active' | 'Inactive';
}

interface DeductionType {
  id: string;
  name: string;
  type: string;
  deductionRule: string;
  amountRate: string;
  onPayslip: 'Yes' | 'No';
  status: 'Active' | 'Inactive';
}

interface TaxCategory {
  id: string;
  name: string;
  code: string;
  calculateOn: string;
  calcOverallIncome: 'Yes' | 'No';
  status: 'Active' | 'Inactive';
}

interface PayrollTabProps {
  employees: Employee[];
  addToast: (text: string, type: 'success' | 'loading' | 'error' | 'info') => void;
}

function codeFromAllowanceName(name: string) {
  return name.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 30) || 'ALLOW';
}

function codeFromName(name: string, fallback: string) {
  return name.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 30) || fallback
}

function mapAllowanceTypeRow(row: AllowanceTypeRow): AllowanceType {
  return {
    id: row.id,
    name: row.name,
    policyType: row.frequency || 'Normal',
    amount: Number(row.amount).toFixed(2),
    deductionAmt: '—',
    taxable: row.taxable ? 'Yes' : 'No',
    onPayslip: 'Yes',
    attachEmp: 'No',
    status: row.active ? 'Active' : 'Inactive',
  }
}

function mapBonusTypeRow(row: BonusTypeRow): BonusType {
  return {
    id: row.id,
    name: row.name,
    policyType: row.description || 'Normal',
    payMonth: '—',
    basedOn: `Fixed ${Number(row.amount).toFixed(2)}`,
    onPayslip: 'Yes',
    status: row.active ? 'Active' : 'Inactive',
  }
}

function mapDeductionTypeRow(row: DeductionTypeRow): DeductionType {
  return {
    id: row.id,
    name: row.name,
    type: row.frequency || 'Custom',
    deductionRule: row.description || 'Catalog deduction',
    amountRate: Number(row.amount).toFixed(2),
    onPayslip: 'Yes',
    status: row.active ? 'Active' : 'Inactive',
  }
}

function mapDepositTypeRow(row: DepositTypeRow): DepositType {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    employmentStatus: 'All staff',
    frequency: row.refundable ? 'Refundable' : 'One-time',
    amountBasis: `Fixed ${Number(row.amount).toFixed(2)}`,
    reimburseMonth: row.refundable ? 'On resign' : '—',
    status: row.active ? 'Active' : 'Inactive',
  }
}

function mapTaxCategoryRow(row: TaxCategoryRow): TaxCategory {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    calculateOn: `Rate ${Number(row.rate).toFixed(2)}%`,
    calcOverallIncome: 'Yes',
    status: row.active ? 'Active' : 'Inactive',
  }
}

function mapOtStatus(status: string): 'Approved' | 'Pending' | 'Rejected' {
  const s = (status || '').toLowerCase()
  if (s === 'approved' || s === 'approve') return 'Approved'
  if (s === 'rejected' || s === 'reject') return 'Rejected'
  return 'Pending'
}

function mapOvertimeToRequest(row: OvertimeRecordRow) {
  return {
    id: row.id,
    empName: row.employeeName || row.employeeId,
    hrs: Number(row.hours) || 0,
    reason: row.reason || '—',
    date: row.workDate,
    status: mapOtStatus(row.status),
  }
}

function mapOtPolicySettings(policies: OtPolicyRow[]) {
  const p = policies[0]
  if (!p) {
    return {
      weekdayOtRate: '—',
      weekendOtRate: '—',
      holidayOtRate: '—',
      calculateBy: 'Hourly',
      roundingBlock: '—',
      minOtThreshold: '—',
      maxOtPerDay: '—',
      policyId: undefined as string | undefined,
      policyName: '',
    }
  }
  return {
    weekdayOtRate: `${p.weekdayMultiplier}×`,
    weekendOtRate: `${p.weekendMultiplier}×`,
    holidayOtRate: `${p.holidayMultiplier}×`,
    calculateBy: 'Hourly',
    roundingBlock: '—',
    minOtThreshold: `${p.dailyThresholdHours} hrs`,
    maxOtPerDay: '—',
    policyId: p.id,
    policyName: p.name,
  }
}

export default function PayrollTab({ employees, addToast }: PayrollTabProps) {
  const now = new Date()
  const [payYear] = useState(now.getFullYear())
  const [payMonth] = useState(now.getMonth() + 1)
  const [payrollRows, setPayrollRows] = useState<PayrollRow[]>([])
  const [myPayslips, setMyPayslips] = useState<PayrollRow[]>([])
  const [payrollSummary, setPayrollSummary] = useState<PayrollRunSummary | null>(null)
  const [payrollBusy, setPayrollBusy] = useState(false)
  const [aiPayrollBusy, setAiPayrollBusy] = useState(false)
  const [payrollAi, setPayrollAi] = useState<PayrollAnomalyResponse | null>(null)

  const refreshPayroll = useCallback(async () => {
    try {
      const [rows, summary] = await Promise.all([
        fetchAdminPayroll(payYear, payMonth),
        fetchPayrollRunSummary(payYear, payMonth),
      ])
      setPayrollRows(rows)
      setPayrollSummary(summary)
    } catch (err) {
      if (!(err instanceof ApiError) || (err.status !== 401 && err.status !== 403)) {
        addToast('Could not load payroll from the server.', 'error')
      }
      // Employees without admin access still see personal payslips
      try {
        const slips = await fetchMyPayslips()
        setMyPayslips(slips)
        if (slips.length) setPayrollRows(slips)
      } catch {
        /* ignore */
      }
    }
  }, [addToast, payMonth, payYear])

  useEffect(() => {
    void refreshPayroll()
    void fetchMyPayslips()
      .then(setMyPayslips)
      .catch(() => undefined)
  }, [refreshPayroll])

  // Navigation states
  const [activeMainTab, setActiveMainTab] = useState<PayrollMainTab>('Allowance');

  // Main tabs — catalogs wired to backend admin APIs (Payroll reports stays hidden).
  const mainTabs = [
    { label: 'Allowance' as PayrollMainTab, icon: Coins, displayLabel: 'Allowance' },
    { label: 'Bonus' as PayrollMainTab, icon: TrendingUp, displayLabel: 'Bonus' },
    { label: 'Overtime' as PayrollMainTab, icon: Clock, displayLabel: 'Overtime' },
    { label: 'Deposit' as PayrollMainTab, icon: Layers, displayLabel: 'Deposit' },
    { label: 'Deduction' as PayrollMainTab, icon: Percent, displayLabel: 'Deduction' },
    { label: 'Tax' as PayrollMainTab, icon: FileText, displayLabel: 'Tax' },
    { label: 'Pay management' as PayrollMainTab, icon: CreditCard, displayLabel: 'Pay management' },
  ];
  
  // Dynamic subtabs depending on MainTab
  const [allowanceSubTab, setAllowanceSubTab] = useState<'Allowance type' | 'Travel allowance' | 'Allowance attachment' | 'Allowance payment'>('Allowance type');
  const [bonusSubTab, setBonusSubTab] = useState<'Bonus type' | 'Bonus attachment' | 'Bonus payment' | 'Bonus policy'>('Bonus type');
  const [overtimeSubTab, setOvertimeSubTab] = useState<'OT policy attachment' | 'Manual OT setup' | 'Specific OT setup' | 'OT request' | 'Request for others' | 'OT approval' | 'OT history'>('OT policy attachment');
  const [depositSubTab, setDepositSubTab] = useState<'Deposit type' | 'Deposit attachment'>('Deposit type');
  const [deductionSubTab, setDeductionSubTab] = useState<'Deduction type' | 'Deduction attachment' | 'Manual deduction'>('Deduction type');
  const [taxSubTab, setTaxSubTab] = useState<'Tax category' | 'Tax attachment' | 'Income tax policy' | 'Taxable pays'>('Tax category');
  const [payMgmtSubTab, setPayMgmtSubTab] = useState<'Payment duration' | 'Payroll preparation' | 'Payroll run' | 'Payroll history'>('Payroll run');

  // Unified Editing states for Modals
  const [editingAllowance, setEditingAllowance] = useState<AllowanceType | null>(null);
  const [editingBonus, setEditingBonus] = useState<BonusType | null>(null);
  const [editingDeposit, setEditingDeposit] = useState<DepositType | null>(null);
  const [editingDeduction, setEditingDeduction] = useState<DeductionType | null>(null);
  const [editingTax, setEditingTax] = useState<TaxCategory | null>(null);

  // New interactive states for Sub Tabs
  // Under Allowance - Travel Claims
  interface TravelClaim { id: string; employeeName: string; amount: string; purpose: string; date: string; status: 'Approved' | 'Pending' | 'Rejected' }
  const [travelClaims, setTravelClaims] = useState<TravelClaim[]>([]);
  const [newTravelStaffName, setNewTravelStaffName] = useState('');
  const [newTravelAmt, setNewTravelAmt] = useState('');
  const [newTravelPurpose, setNewTravelPurpose] = useState('');

  // Under Allowance - Allowance Attachments
  const [allowanceAttachments, setAllowanceAttachments] = useState<{
    id: string;
    label: string;
    staffName: string;
    size: string;
    date: string;
    type: string;
    status: string;
  }[]>([]);

  // Under Bonus - Bonus attachments, payments, and policy
  const [bonusAttachments, setBonusAttachments] = useState<{
    id: string;
    label: string;
    date: string;
    size: string;
    uploader: string;
  }[]>([]);
  const [bonusPayments, setBonusPayments] = useState<{
    empId: string;
    empName: string;
    dept: string;
    amount: string;
    scale: string;
    status: string;
  }[]>([]);
  const [bonusPolicies, setBonusPolicies] = useState<{
    id: string;
    ruleName: string;
    weight: string;
    active: boolean;
  }[]>([]);

  // Under Overtime - setup & requests
  const [manualOtEntries, setManualOtEntries] = useState<{
    id: string;
    empName: string;
    hrs: number;
    rate: string;
    total: number;
    date: string;
  }[]>([]);
  const [newManualOtStaff, setNewManualOtStaff] = useState('');
  const [newManualOtHrs, setNewManualOtHrs] = useState('');
  const [newManualOtRate, setNewManualOtRate] = useState('25.00');

  const [otRequests, setOtRequests] = useState<{
    id: string;
    empName: string;
    hrs: number;
    reason: string;
    date: string;
    status: 'Approved' | 'Pending' | 'Rejected';
  }[]>([]);
  const [newOtReqStaff, setNewOtReqStaff] = useState('');
  const [newOtReqHrs, setNewOtReqHrs] = useState('');
  const [newOtReqReason, setNewOtReqReason] = useState('');

  // Under Deposit Attachments
  const [depositAttachments, setDepositAttachments] = useState<{
    id: string;
    label: string;
    date: string;
    size: string;
    uploader: string;
  }[]>([]);

  // Under Deduction Attachments & Manual Deductions
  const [deductionAttachments, setDeductionAttachments] = useState<{
    id: string;
    label: string;
    date: string;
    size: string;
    uploader: string;
  }[]>([]);
  const [manualDeductions, setManualDeductions] = useState<{
    id: string;
    empName: string;
    amount: string;
    reason: string;
    date: string;
  }[]>([]);
  const [newDedStaff, setNewDedStaff] = useState('');
  const [newDedAmt, setNewDedAmt] = useState('');
  const [newDedReason, setNewDedReason] = useState('Salary advance');

  // Under Tax Attachments & Taxable Emoluments list
  const [taxAttachments, setTaxAttachments] = useState<{
    id: string;
    label: string;
    date: string;
    size: string;
    uploader: string;
  }[]>([]);
  const [taxableEmoluments, setTaxableEmoluments] = useState<{
    id: string;
    componentName: string;
    taxable: boolean;
    exemptAllowanceLimit: string;
  }[]>([]);

  // Under Payment Prep checklist
  const [prepSteps, setPrepSteps] = useState<{
    id: string;
    label: string;
    desc: string;
    done: boolean;
  }[]>([]);

  // Universal Filter States
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All departments');
  const [selectedPolicyFilter, setSelectedPolicyFilter] = useState('All policy types');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals / Trigger additions
  const [allowanceModalOpen, setAllowanceModalOpen] = useState(false);
  const [bonusModalOpen, setBonusModalOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [deductionModalOpen, setDeductionModalOpen] = useState(false);
  const [taxModalOpen, setTaxModalOpen] = useState(false);

  // New states for User Request UI updates
  const [isCommitAllowancesModalOpen, setIsCommitAllowancesModalOpen] = useState(false);

  const [otPolicySettings, setOtPolicySettings] = useState({
    weekdayOtRate: '—',
    weekendOtRate: '—',
    holidayOtRate: '—',
    calculateBy: 'Hourly',
    roundingBlock: '—',
    minOtThreshold: '—',
    maxOtPerDay: '—',
    policyId: undefined as string | undefined,
    policyName: '',
  });
  const [isEditOtPolicyModalOpen, setIsEditOtPolicyModalOpen] = useState(false);

  const [isAttachOtModalOpen, setIsAttachOtModalOpen] = useState(false);
  const [newOtStaffName, setNewOtStaffName] = useState('');
  const [newOtStaffDept, setNewOtStaffDept] = useState('Engineering');
  const [newOtStaffPolicy, setNewOtStaffPolicy] = useState('Salary-based');

  const [otOverrides, setOtOverrides] = useState([
    { id: '1', deptScope: 'Engineering Support', multiplier: '1.50×', weekendCoefficient: '2.00× (Double Pay)', condition: 'Production server release & standby cycles' },
    { id: '2', deptScope: 'Operations / Logistics', multiplier: '1.25×', weekendCoefficient: '1.75×', condition: 'After-hours warehouse stock inspection schedules' }
  ]);
  const [editingOtOverride, setEditingOtOverride] = useState<any | null>(null);

  const [editingManualDeduction, setEditingManualDeduction] = useState<any | null>(null);

  const [isRegisterEmolumentModalOpen, setIsRegisterEmolumentModalOpen] = useState(false);
  const [newEmolName, setNewEmolName] = useState('');
  const [newEmolLimit, setNewEmolLimit] = useState('No Limit');
  const [newEmolTaxable, setNewEmolTaxable] = useState(true);

  const [isCreateDurationModalOpen, setIsCreateDurationModalOpen] = useState(false);
  const [newDurationName, setNewDurationName] = useState('');
  const [newDurationStart, setNewDurationStart] = useState('1 Jun');
  const [newDurationEnd, setNewDurationEnd] = useState('30 Jun');
  const [newDurationStatus, setNewDurationStatus] = useState('Draft');

  const [isEditActiveDurationModalOpen, setIsEditActiveDurationModalOpen] = useState(false);

  // Allowance Master State — loaded from catalog API
  const [allowanceTypes, setAllowanceTypes] = useState<AllowanceType[]>([]);

  // Bonus / Deposit / Deduction / Tax Master State
  const [bonusTypes, setBonusTypes] = useState<BonusType[]>([]);
  const [depositTypes, setDepositTypes] = useState<DepositType[]>([]);
  const [deductions, setDeductions] = useState<DeductionType[]>([]);
  const [taxes, setTaxes] = useState<TaxCategory[]>([]);

  useEffect(() => {
    void (async () => {
      try {
        const [
          allowanceRows,
          bonusRows,
          deductionRows,
          depositRows,
          taxRows,
          otPolicies,
          otRecords,
        ] = await Promise.all([
          fetchAllowanceTypes().catch(() => [] as AllowanceTypeRow[]),
          fetchBonusTypes().catch(() => [] as BonusTypeRow[]),
          fetchDeductionTypes().catch(() => [] as DeductionTypeRow[]),
          fetchDepositTypes().catch(() => [] as DepositTypeRow[]),
          fetchTaxCategories().catch(() => [] as TaxCategoryRow[]),
          fetchOtPolicies().catch(() => [] as OtPolicyRow[]),
          fetchOvertimeRecords().catch(() => [] as OvertimeRecordRow[]),
        ])
        setAllowanceTypes(allowanceRows.map(mapAllowanceTypeRow))
        setBonusTypes(bonusRows.map(mapBonusTypeRow))
        setDeductions(deductionRows.map(mapDeductionTypeRow))
        setDepositTypes(depositRows.map(mapDepositTypeRow))
        setTaxes(taxRows.map(mapTaxCategoryRow))
        setOtPolicySettings(mapOtPolicySettings(otPolicies))
        setOtRequests(otRecords.map(mapOvertimeToRequest))
      } catch (err) {
        if (!(err instanceof ApiError) || (err.status !== 401 && err.status !== 403)) {
          addToast('Could not load payroll catalog data from the server.', 'error')
        }
      }
    })()
  }, [addToast])

  // OT policy attached employees
  const [otAttachedStaff, setOtAttachedStaff] = useState<{
    id: string;
    name: string;
    department: string;
    policyType: string;
    status: string;
  }[]>([]);

  // Payment Active duration setup state
  const [paymentDuration, setPaymentDuration] = useState({
    name: 'Monthly (May 2026)',
    start: '1 May 2026',
    end: '31 May 2026',
    payDate: '31 May 2026',
    basis: '26 working days / month',
    status: 'Current period'
  });

  const [pastDurations, setPastDurations] = useState<{
    name: string;
    start: string;
    end: string;
    status: string;
  }[]>([]);

  // Run Payroll Simulation States
  const [isSimulatingRun, setIsSimulatingRun] = useState(false);
  const [simStep, setSimStep] = useState(0); // 0 = idle, 1 = auditing, 2 = calculating fractions, 3 = tax validation, 4 = complete!
  const [simProgress, setSimProgress] = useState(0);
  const [runSuccessful, setRunSuccessful] = useState(false);

  // New states for form creation
  const [newAllowanceName, setNewAllowanceName] = useState('');
  const [newAllowancePolicy, setNewAllowancePolicy] = useState('Normal');
  const [newAllowanceAmount, setNewAllowanceAmount] = useState('');
  const [newAllowanceTaxable, setNewAllowanceTaxable] = useState<'Yes'|'No'>('No');

  const [newBonusName, setNewBonusName] = useState('');
  const [newBonusPolicy, setNewBonusPolicy] = useState('Normal');
  const [newBonusPayMonth, setNewBonusPayMonth] = useState('December');
  const [newBonusBasedOn, setNewBonusBasedOn] = useState('Fixed amount');

  const [newDepositName, setNewDepositName] = useState('');
  const [newDepositCode, setNewDepositCode] = useState('');
  const [newDepositBasis, setNewDepositBasis] = useState('Fixed SGD 100');

  const [newDeductionName, setNewDeductionName] = useState('');
  const [newDeductionType, setNewDeductionType] = useState('Statutory');
  const [newDeductionRate, setNewDeductionRate] = useState('');

  const [newTaxName, setNewTaxName] = useState('');
  const [newTaxCode, setNewTaxCode] = useState('');
  const [newTaxOn, setNewTaxOn] = useState('Monthly salary');

  // Reports view state variables
  const [reportsDept, setReportsDept] = useState('All departments');
  const [reportsSearch, setReportsSearch] = useState('');
  const [reportsPeriod, setReportsPeriod] = useState('May 2026');
  const [payrollPeriodOpen, setPayrollPeriodOpen] = useState(false);
  const [payrollDeptOpen, setPayrollDeptOpen] = useState(false);
  // Dynamic state changes
  const handleAddNewAllowance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAllowanceName) {
      addToast('Please input an allowance name', 'error');
      return;
    }
    const amount = Number(newAllowanceAmount || '150');
    try {
      const created = await createAllowanceType({
        name: newAllowanceName.trim(),
        code: codeFromAllowanceName(newAllowanceName),
        amount: Number.isFinite(amount) ? amount : 150,
        frequency: newAllowancePolicy || 'Normal',
        taxable: newAllowanceTaxable === 'Yes',
        active: true,
      });
      setAllowanceTypes((prev) => [...prev.filter((a) => a.id !== created.id), mapAllowanceTypeRow(created)]);
      setAllowanceModalOpen(false);
      setNewAllowanceName('');
      setNewAllowanceAmount('');
      addToast('Successfully registered new allowance type policy.', 'success');
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Could not create allowance type.', 'error');
    }
  };

  const handleAddNewBonus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBonusName) {
      addToast('Please specify bonus category', 'error');
      return;
    }
    try {
      const created = await createBonusType({
        name: newBonusName.trim(),
        code: codeFromName(newBonusName, 'BONUS'),
        amount: 0,
        taxable: true,
        active: true,
        description: newBonusPolicy || 'Normal',
      })
      setBonusTypes((prev) => [...prev.filter((b) => b.id !== created.id), mapBonusTypeRow(created)])
      setBonusModalOpen(false)
      setNewBonusName('')
      addToast('Successfully added new bonus compensation policy', 'success')
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Could not create bonus type.', 'error')
    }
  };

  const handleAddNewDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDepositName || !newDepositCode) {
      addToast('Missing vital fields for security bond catalogging.', 'error');
      return;
    }
    const amountMatch = newDepositBasis.match(/[\d.]+/)
    const amount = amountMatch ? Number(amountMatch[0]) : 0
    try {
      const created = await createDepositType({
        name: newDepositName.trim(),
        code: newDepositCode.trim().toUpperCase(),
        amount: Number.isFinite(amount) ? amount : 0,
        refundable: true,
        active: true,
      })
      setDepositTypes((prev) => [...prev.filter((d) => d.id !== created.id), mapDepositTypeRow(created)])
      setDepositModalOpen(false)
      setNewDepositName('')
      setNewDepositCode('')
      addToast('New security deposit/reimbursement model archived.', 'success')
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Could not create deposit type.', 'error')
    }
  };

  const handleAddNewDeduction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeductionName || !newDeductionRate) {
      addToast('Deduction schema requires name and tariff.', 'error');
      return;
    }
    const amount = Number(String(newDeductionRate).replace(/[^0-9.]/g, '')) || 0
    try {
      const created = await createDeductionType({
        name: newDeductionName.trim(),
        code: codeFromName(newDeductionName, 'DED'),
        amount,
        frequency: 'monthly',
        active: true,
        description: newDeductionType || 'Custom',
      })
      setDeductions((prev) => [...prev.filter((d) => d.id !== created.id), mapDeductionTypeRow(created)])
      setDeductionModalOpen(false)
      setNewDeductionName('')
      setNewDeductionRate('')
      addToast('Alternative custom deduction logic loaded successfully.', 'success')
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Could not create deduction type.', 'error')
    }
  };

  const handleAddNewTax = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaxName || !newTaxCode) {
      addToast('Income tax category must provide a standardized statutory identifier code.', 'error');
      return;
    }
    try {
      const created = await createTaxCategory({
        name: newTaxName.trim(),
        code: newTaxCode.trim().toUpperCase(),
        rate: 0,
        active: true,
        description: newTaxOn || undefined,
      })
      setTaxes((prev) => [...prev.filter((t) => t.id !== created.id), mapTaxCategoryRow(created)])
      setTaxModalOpen(false)
      setNewTaxName('')
      setNewTaxCode('')
      addToast('New localized taxation withholding profile registered.', 'success')
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Could not create tax category.', 'error')
    }
  };

  // Editing state submission handlers
  const handleEditAllowance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAllowance) return;
    if (!editingAllowance.name) {
      addToast('Please input an allowance name', 'error');
      return;
    }
    setAllowanceTypes(allowanceTypes.map(item => item.id === editingAllowance.id ? editingAllowance : item));
    setEditingAllowance(null);
    addToast(`Successfully updated allowance ${editingAllowance.name}.`, 'success');
  };

  const handleEditBonus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBonus) return;
    if (!editingBonus.name) {
      addToast('Please specify bonus category', 'error');
      return;
    }
    setBonusTypes(bonusTypes.map(item => item.id === editingBonus.id ? editingBonus : item));
    setEditingBonus(null);
    addToast(`Successfully updated bonus policy ${editingBonus.name}.`, 'success');
  };

  const handleEditDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDeposit) return;
    if (!editingDeposit.name || !editingDeposit.code) {
      addToast('Missing vital fields for security deposit.', 'error');
      return;
    }
    setDepositTypes(depositTypes.map(item => item.id === editingDeposit.id ? editingDeposit : item));
    setEditingDeposit(null);
    addToast(`Successfully updated deposit model ${editingDeposit.name}.`, 'success');
  };

  const handleEditDeduction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDeduction) return;
    if (!editingDeduction.name || !editingDeduction.amountRate) {
      addToast('Deduction schema requires name and tariff.', 'error');
      return;
    }
    setDeductions(deductions.map(item => item.id === editingDeduction.id ? editingDeduction : item));
    setEditingDeduction(null);
    addToast(`Successfully updated deduction policy ${editingDeduction.name}.`, 'success');
  };

  const handleEditTax = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTax) return;
    if (!editingTax.name || !editingTax.code) {
      addToast('Income tax category must provide standard code.', 'error');
      return;
    }
    setTaxes(taxes.map(item => item.id === editingTax.id ? editingTax : item));
    setEditingTax(null);
    addToast(`Successfully updated tax category ${editingTax.name}.`, 'success');
  };

  // Run payroll via API (generate drafts then process)
  const triggerPayrollRun = async () => {
    if (isSimulatingRun || payrollBusy) return
    setPayrollBusy(true)
    setIsSimulatingRun(true)
    setRunSuccessful(false)
    setSimStep(1)
    setSimProgress(20)
    addToast('Generating payroll drafts…', 'loading')
    try {
      await generateAdminPayroll(payMonth, payYear)
      setSimStep(2)
      setSimProgress(55)
      addToast('Processing payroll month…', 'loading')
      const summary = await processAdminPayrollMonth(payYear, payMonth)
      setPayrollSummary(summary)
      setSimStep(4)
      setSimProgress(100)
      setRunSuccessful(true)
      await refreshPayroll()
      addToast(
        `Payroll run complete for ${payMonth}/${payYear}: ${summary.headcount} employees, net $${Number(summary.totalNetPay).toLocaleString()}.`,
        'success',
      )
    } catch (err) {
      setIsSimulatingRun(false)
      addToast(err instanceof ApiError ? err.message : 'Payroll run failed.', 'error')
    } finally {
      setPayrollBusy(false)
    }
  }

  const closePayrollRunSim = () => {
    setIsSimulatingRun(false);
    setSimStep(0);
    setSimProgress(0);
  };

  // Compute stats for Payroll Ledger Reports
  const payrollCostDetails = employees.map((emp) => {
    // Generate static deterministic amounts for demo realism
    const codeNum = parseInt(emp.id.replace(/\D/g, ''), 10) || 5;
    const baseSalary = 3000 + (codeNum % 10) * 450;
    const allowanceVal = 150 + (codeNum % 5) * 80;
    const otVal = (codeNum % 4) * 120;
    const grossVal = baseSalary + allowanceVal + otVal;
    
    // Deductions
    const epf = Math.round(baseSalary * 0.11);
    const socso = Math.round(baseSalary * 0.005);
    const pcb = Math.round((baseSalary - epf) * 0.05);
    const totalDeductions = epf + socso + pcb;
    const netSalary = grossVal - totalDeductions;

    return {
      employee: emp,
      baseSalary,
      allowanceVal,
      otVal,
      grossVal,
      epf,
      socso,
      pcb,
      totalDeductions,
      netSalary
    };
  });

  // Department scores
  const departmentsList = ['Engineering', 'Finance', 'HR', 'Marketing', 'Operations'] as const;
  const deptMatrix = departmentsList.map((dept) => {
    const subset = payrollCostDetails.filter(p => p.employee.department === dept);
    const count = subset.length;
    const totalBase = subset.reduce((sum, current) => sum + current.baseSalary, 0);
    const totalAllowances = subset.reduce((sum, current) => sum + current.allowanceVal, 0);
    const totalOt = subset.reduce((sum, current) => sum + current.otVal, 0);
    const totalDeducts = subset.reduce((sum, current) => sum + current.totalDeductions, 0);
    const totalGross = totalBase + totalAllowances + totalOt;
    const totalNet = totalGross - totalDeducts;
    
    return {
      name: dept,
      headcount: count,
      avgBasic: count > 0 ? Math.round(totalBase / count) : 0,
      totalGross,
      totalNet,
      totalDeducts,
      budgetCompliance: totalGross > 15000 ? 'Review Needed' : 'Healthy Budget'
    };
  });

  // Filtered ledger rows
  const filteredLedger = payrollCostDetails.filter(row => {
    const matchesDept = reportsDept === 'All departments' || row.employee.department === reportsDept;
    const matchesSearch = row.employee.name.toLowerCase().includes(reportsSearch.toLowerCase()) || row.employee.id.toLowerCase().includes(reportsSearch.toLowerCase());
    return matchesDept && matchesSearch;
  });

  // Sum aggregates
  const grandTotalGross = payrollCostDetails.reduce((sum, r) => sum + r.grossVal, 0);
  const grandTotalDeductions = payrollCostDetails.reduce((sum, r) => sum + r.totalDeductions, 0);
  const grandTotalNet = payrollCostDetails.reduce((sum, r) => sum + r.netSalary, 0);
  const avgNetPay = payrollCostDetails.length > 0 ? Math.round(grandTotalNet / payrollCostDetails.length) : 0;

  return (
    <div id="payroll-panel-view" className="space-y-6 animate-in fade-in duration-150">
      <ModuleHeader
        title="Payroll"
        description="Allowances, runs, and payroll reporting."
      />

      {/* ===== 1. UPPER NAVIGATION & PRIMARY HORIZONTAL NAV-BAR ===== */}
      <div id="payroll-module-navigator" className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-200/85 pb-4 gap-4">
        
        {/* Navigation tabs styled exactly like Disciplinary Management */}
        <div id="payroll-navigation-tabs" className="flex items-center gap-2 select-none overflow-x-auto w-full lg:w-auto scrollbar-none py-1">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeMainTab === tab.label;
            return (
              <button
                id={`payroll-tab-${tab.label.replace(/\s+/g, '-').toLowerCase()}`}
                key={tab.label}
                onClick={() => {
                  setActiveMainTab(tab.label);
                  addToast(`Opened ${tab.displayLabel} workstation view`, 'info');
                }}
                className={`text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all shrink-0 relative cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-50 text-novora'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.displayLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Global top level dropdown controllers aligned on the right, integrated into the navigation grid */}
        <div id="payroll-global-ctrls" className="flex items-center gap-2.5 ml-auto sm:ml-0 font-sans text-slate-700 shrink-0 flex-nowrap">
          <DropdownAnchor
            open={payrollPeriodOpen}
            onClose={() => setPayrollPeriodOpen(false)}
            align="right"
          >
            <button
              type="button"
              aria-expanded={payrollPeriodOpen}
              onClick={() => {
                setPayrollDeptOpen(false)
                setPayrollPeriodOpen(!payrollPeriodOpen)
              }}
              className={`nv-dd-trigger ${payrollPeriodOpen ? 'nv-dd-trigger--open' : ''}`}
            >
              <span>{reportsPeriod}</span>
              <ChevronDown className="nv-chevron-down nv-chevron-down--sm" />
            </button>
            {payrollPeriodOpen ? (
              <div className="nv-dropdown-menu w-36">
                {['May 2026', 'April 2026', 'March 2026'].map((period) => (
                  <button
                    key={period}
                    type="button"
                    aria-selected={reportsPeriod === period}
                    onClick={() => {
                      setReportsPeriod(period)
                      setPayrollPeriodOpen(false)
                      addToast(`Transitioned ledger review cycle to active ${period}`, 'info')
                    }}
                    className={reportsPeriod === period ? 'nv-dropdown-item--active' : ''}
                  >
                    {period}
                  </button>
                ))}
              </div>
            ) : null}
          </DropdownAnchor>

          <DropdownAnchor
            open={payrollDeptOpen}
            onClose={() => setPayrollDeptOpen(false)}
            align="right"
          >
            <button
              type="button"
              aria-expanded={payrollDeptOpen}
              onClick={() => {
                setPayrollPeriodOpen(false)
                setPayrollDeptOpen(!payrollDeptOpen)
              }}
              className={`nv-dd-trigger ${payrollDeptOpen ? 'nv-dd-trigger--open' : ''}`}
            >
              <span>{selectedDeptFilter}</span>
              <ChevronDown className="nv-chevron-down nv-chevron-down--sm" />
            </button>
            {payrollDeptOpen ? (
              <div className="nv-dropdown-menu w-44">
                {['All departments', 'Engineering', 'Finance', 'HR', 'Marketing', 'Operations'].map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    aria-selected={selectedDeptFilter === dept}
                    onClick={() => {
                      setSelectedDeptFilter(dept)
                      setReportsDept(dept)
                      setPayrollDeptOpen(false)
                      addToast(`Focused analytics subset on target department: ${dept}`, 'info')
                    }}
                    className={selectedDeptFilter === dept ? 'nv-dropdown-item--active' : ''}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            ) : null}
          </DropdownAnchor>

          {/* Export utility */}
          <button
            type="button"
            onClick={() => {
              addToast('Packaging and validating current payroll roster schedules...', 'loading');
              setTimeout(() => {
                addToast('Comprehensive ledger exported as NovoraPayroll_Ledger_May2026.xlsx', 'success');
              }, 1500);
            }}
            className="nv-toolbar-btn"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>

          {/* Urgent Run Payroll task trigger */}
          <button
            type="button"
            onClick={triggerPayrollRun}
            className="h-9 inline-flex items-center gap-1.5 px-3.5 text-xs font-extrabold text-white bg-novora hover:bg-opacity-95 rounded-xl transition-all shadow-sm cursor-pointer whitespace-nowrap shrink-0"
          >
            <Calculator className="h-4 w-4 shrink-0" />
            <span>Run payroll</span>
          </button>
        </div>
      </div>


      {/* ===== 3. SECONDARY LEVEL NAVIGATION CAP CAPSULES (Pills) ===== */}
      <div id="payroll-secondary-capsules" className="flex items-center gap-2 select-none overflow-x-auto scrollbar-none py-1">
        
        {/* Render secondary navigation pill elements according to activeMainTab */}
        {activeMainTab === 'Allowance' && (['Allowance type'] as const).map((sub) => (
          <button
            key={sub}
            onClick={() => setAllowanceSubTab(sub)}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
              allowanceSubTab === sub
                ? 'bg-novora text-white font-extrabold shadow-xxs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-white border border-slate-100'
            }`}
          >
            {sub}
          </button>
        ))}

        {activeMainTab === 'Bonus' && (['Bonus type'] as const).map((sub) => (
          <button
            key={sub}
            onClick={() => setBonusSubTab(sub)}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
              bonusSubTab === sub
                ? 'bg-novora text-white font-extrabold shadow-xxs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-white border border-slate-100'
            }`}
          >
            {sub}
          </button>
        ))}

        {activeMainTab === 'Overtime' && (['OT policy attachment', 'OT request', 'OT approval', 'OT history'] as const).map((sub) => {
          const isApproval = sub === 'OT approval';
          return (
            <button
              key={sub}
              onClick={() => setOvertimeSubTab(sub)}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                overtimeSubTab === sub
                  ? 'bg-novora text-white font-extrabold shadow-xxs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-white border border-slate-100'
              }`}
            >
              <span>{sub}</span>
              {isApproval && (
                <span className="h-4.5 w-4.5 bg-amber-100 text-amber-700 text-[10px] font-black rounded-full flex items-center justify-center border border-amber-200 shrink-0">
                  {otRequests.filter((r) => r.status === 'Pending').length}
                </span>
              )}
            </button>
          );
        })}

        {activeMainTab === 'Deposit' && (['Deposit type'] as const).map((sub) => (
          <button
            key={sub}
            onClick={() => setDepositSubTab(sub)}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
              depositSubTab === sub
                ? 'bg-novora text-white font-extrabold shadow-xxs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-white border border-slate-100'
            }`}
          >
            {sub}
          </button>
        ))}

        {activeMainTab === 'Deduction' && (['Deduction type'] as const).map((sub) => (
          <button
            key={sub}
            onClick={() => setDeductionSubTab(sub)}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
              deductionSubTab === sub
                ? 'bg-novora text-white font-extrabold shadow-xxs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-white border border-slate-100'
            }`}
          >
            {sub}
          </button>
        ))}

        {activeMainTab === 'Tax' && (['Tax category'] as const).map((sub) => (
          <button
            key={sub}
            onClick={() => setTaxSubTab(sub)}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
              taxSubTab === sub
                ? 'bg-novora text-white font-extrabold shadow-xxs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-white border border-slate-100'
            }`}
          >
            {sub}
          </button>
        ))}

        {activeMainTab === 'Pay management' && (['Payroll run', 'Payroll history'] as const).map((sub) => (
          <button
            key={sub}
            onClick={() => setPayMgmtSubTab(sub)}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
              payMgmtSubTab === sub
                ? 'bg-novora text-white font-extrabold shadow-xxs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-white border border-slate-100'
            }`}
          >
            {sub}
          </button>
        ))}

        {activeMainTab === 'Payroll reports' && (
          <div className="text-xs font-bold text-novora bg-novora/10 px-3 py-1.5 rounded-lg border border-novora/20">
            Interactive Dashboard Reports
          </div>
        )}
      </div>


      {/* ===== 4. CONTENT WRAPPER BASED ON MAIN TABS AND SUB TABS ===== */}
      <div id="payroll-workspace-canvas" className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs min-h-[400px]">
        
        {/* =======================================================
            ALLOWANCE MAIN TAB CONTENT
            ======================================================= */}
        {activeMainTab === 'Allowance' && (
          <div id="allowance-view-container" className="space-y-6 font-sans">
            {allowanceSubTab === 'Allowance type' && (
              <div className="space-y-4">
                {/* Filters and Search row */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {/* Policy selector */}
                    <div className="relative">
                    <SelectMenu
                        value={selectedPolicyFilter}
                        onChange={setSelectedPolicyFilter}
                        triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                        options={[
                          { value: 'All policy types', label: 'All policy types' },
                          { value: 'Transport', label: 'Transport' },
                          { value: 'Meal', label: 'Meal' },
                          { value: 'Normal', label: 'Normal' },
                          { value: 'Shift', label: 'Shift' },
                        ]}
                      />
                    </div>

                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search allowance..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-xs pl-9 pr-4 py-2.5 rounded-xl w-full focus:outline-none focus:bg-white"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setAllowanceModalOpen(true)}
                    className="bg-novora hover:bg-opacity-95 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-tiny inline-flex items-center gap-1.5 self-end sm:self-auto cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Allowance Type</span>
                  </button>
                </div>

                {/* Table containing rows with active edit dialog launch */}
                <div className="border border-slate-100 rounded-2xl overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[800px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <th className="p-4 pl-6">Allowance name</th>
                        <th className="p-4">Policy type</th>
                        <th className="p-4">Amount (SGD)</th>
                        <th className="p-4">Deduction amt</th>
                        <th className="p-4 text-center">Taxable</th>
                        <th className="p-4 text-center">On payslip</th>
                        <th className="p-4 text-center">Attach emp.</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {allowanceTypes
                        .filter(item => {
                          const matchesPolicy = selectedPolicyFilter === 'All policy types' || item.policyType === selectedPolicyFilter;
                          const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase());
                          return matchesPolicy && matchesQuery;
                        })
                        .map((allow) => (
                          <tr key={allow.id} className="hover:bg-slate-50/50">
                            <td className="p-4 pl-6 font-bold text-slate-800">{allow.name}</td>
                            <td className="p-4">
                              <span className="bg-blue-50/70 text-novora border border-blue-100/50 rounded-md px-2.5 py-1 text-[10.5px] font-bold">
                                {allow.policyType}
                              </span>
                            </td>
                            <td className="p-4 font-mono font-extrabold text-slate-800">{allow.amount}</td>
                            <td className="p-4 text-slate-500">{allow.deductionAmt}</td>
                            <td className="p-4 text-center">
                              {allow.taxable === 'Yes' ? (
                                <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-100">Yes</span>
                              ) : (
                                <span className="text-slate-400 bg-slate-50 px-2 py-0.5 border border-slate-100 rounded text-[10px]">No</span>
                              )}
                            </td>
                            <td className="p-4 text-center">
                              <span className="bg-emerald-55 text-emerald-700 px-2 py-0.5 border border-emerald-110 rounded text-[10px] font-extrabold">Yes</span>
                            </td>
                            <td className="p-4 text-center">
                              {allow.attachEmp === 'Yes' ? (
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded text-[10px]">Yes</span>
                              ) : (
                                <span className="text-slate-400 bg-slate-50 px-2 py-0.5 border border-slate-100 rounded text-[10px]">No</span>
                              )}
                            </td>
                            <td className="p-4">
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold px-2 py-0.5 rounded-md text-[10.5px]">
                                {allow.status}
                              </span>
                            </td>
                            <td className="p-4 pr-6 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingAllowance(allow);
                                  addToast(`Loading ${allow.name} into editor`, 'info');
                                }}
                                className="text-slate-500 hover:text-novora font-bold text-xs inline-flex items-center gap-1 cursor-pointer hover:underline"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Travel Allowance Interactive Log & Form */}
            {allowanceSubTab === 'Travel allowance' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Claim Submission Panel */}
                  <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                      <PlusCircle className="h-4 w-4 text-novora" />
                      <span>Submit Travel Claim</span>
                    </h4>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (!newTravelStaffName || !newTravelAmt) {
                        addToast('Specify claimant name and amount.', 'error');
                        return;
                      }
                      const claim: TravelClaim = {
                        id: `TRV-${100 + travelClaims.length + 1}`,
                        employeeName: newTravelStaffName,
                        amount: parseFloat(newTravelAmt).toFixed(2),
                        purpose: newTravelPurpose || 'Official Travel',
                        date: new Date().toISOString().split('T')[0],
                        status: 'Pending'
                      };
                      setTravelClaims([claim, ...travelClaims]);
                      setNewTravelStaffName('');
                      setNewTravelAmt('');
                      setNewTravelPurpose('');
                      addToast('Travel reimbursement claim submitted to approvals registry.', 'success');
                    }} className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Employee Name</label>
                        <select
                          value={newTravelStaffName}
                          onChange={(e) => setNewTravelStaffName(e.target.value)}
                          className="bg-white border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none font-semibold text-slate-700"
                        >
                          <option value="">Select Employee...</option>
                          {employees.map(emp => (
                            <option key={emp.id} value={emp.name}>{emp.name} ({emp.id})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Claim Amount (SGD)</label>
                        <input
                          type="number" step="0.01" placeholder="e.g. 150.00"
                          value={newTravelAmt}
                          onChange={(e) => setNewTravelAmt(e.target.value)}
                          className="bg-white border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Purpose / Route Description</label>
                        <input
                          type="text" placeholder="e.g. Client Site Visit (PJ to KL)"
                          value={newTravelPurpose}
                          onChange={(e) => setNewTravelPurpose(e.target.value)}
                          className="bg-white border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none font-semibold"
                        />
                      </div>
                      <button type="submit" className="w-full bg-novora hover:bg-opacity-95 text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer">
                        File Reimbursement
                      </button>
                    </form>
                  </div>

                  {/* Travel Claims Registry list */}
                  <div className="lg:col-span-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Travel Claims History</h4>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">
                        {travelClaims.length} total entries
                      </span>
                    </div>

                    <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <th className="p-3 pl-5">Claimant</th>
                            <th className="p-3">Purpose</th>
                            <th className="p-3 font-mono">Date</th>
                            <th className="p-3 text-center">Amount (SGD)</th>
                            <th className="p-3 pr-5 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {travelClaims.map((claim) => (
                            <tr key={claim.id} className="hover:bg-slate-50/50">
                              <td className="p-3 pl-5 font-bold text-slate-800">{claim.employeeName}</td>
                              <td className="p-3 text-slate-500">{claim.purpose}</td>
                              <td className="p-3 font-mono text-slate-400">{claim.date}</td>
                              <td className="p-3 text-center font-mono font-bold text-slate-800">{claim.amount}</td>
                              <td className="p-3 pr-5 text-right">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                  claim.status === 'Approved'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                    : 'bg-amber-50 text-amber-600 border-amber-100'
                                }`}>
                                  {claim.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Allowance Attachment (Receipt Upload Hub) */}
            {allowanceSubTab === 'Allowance attachment' && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50/40 hover:bg-slate-50 transition-colors cursor-pointer"
                     onClick={() => {
                       const filename = prompt('Enter placeholder receipt name to upload:', 'Taxi_Receipt_May.pdf');
                       if (filename) {
                         const n = {
                           id: createLocalId('ATT-A'),
                           label: filename,
                           staffName: 'Staff Member',
                           size: '800 KB',
                           date: new Date().toISOString().split('T')[0],
                           type: 'Transport',
                           status: 'Pending Verification'
                         };
                         setAllowanceAttachments([n, ...allowanceAttachments]);
                         addToast(`Document "${filename}" staged for verification successfully`, 'success');
                       }
                     }}>
                  <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-400 shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Drag &amp; drop travel logs, petrol receipts, or meal invoices here</p>
                  <p className="text-[10px] text-slate-400 mt-1">Supports PDF, JPG, PNG up to 10MB (Click to simulate browse/upload)</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest pl-1">Uploaded Allowance Supporting Vault</h4>
                  <div className="border border-slate-100 rounded-2xl bg-white overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <th className="p-3 pl-5">File Reference</th>
                          <th className="p-3">Claimant</th>
                          <th className="p-3 font-mono">Logged Date</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">File Size</th>
                          <th className="p-3 pr-5 text-right">Verification</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {allowanceAttachments.map((file) => (
                          <tr key={file.id} className="hover:bg-slate-50/50">
                            <td className="p-3 pl-5 font-bold text-slate-800 flex items-center gap-2">
                              <FileText className="h-4 w-4 text-rose-400 shrink-0" />
                              <span>{file.label}</span>
                            </td>
                            <td className="p-3 text-slate-600">{file.staffName}</td>
                            <td className="p-3 font-mono text-slate-400">{file.date}</td>
                            <td className="p-3">
                              <span className="bg-blue-50 text-novora text-[9.5px] font-bold px-2 py-0.5 rounded border border-blue-100">
                                {file.type}
                              </span>
                            </td>
                            <td className="p-3 text-slate-500 text-xs font-mono">{file.size}</td>
                            <td className="p-3 pr-5 text-right">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                file.status === 'Verified'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                  : 'bg-amber-50 text-amber-600 border-amber-100'
                              }`}>
                                {file.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Allowance payment releases */}
            {allowanceSubTab === 'Allowance payment' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-novora/5 p-4 rounded-2xl border border-blue-100 flex flex-col md:flex-row justify-between items-center gap-3">
                  <div className="space-y-0.5 text-center md:text-left">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Active Month Allowance Disbursement ledger</h4>
                    <p className="text-[10.5px] font-semibold text-slate-500">Approve or lock active allowances for current accounting period run.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCommitAllowancesModalOpen(true)}
                    className="bg-novora hover:bg-opacity-95 text-white font-extrabold text-xs px-4 py-2 rounded-xl shrink-0 cursor-pointer"
                  >
                    Commit Approved Allowances
                  </button>
                </div>

                <div className="border border-slate-100 rounded-2xl bg-white overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <th className="p-3 pl-5">Staff member</th>
                        <th className="p-3">Unit Department</th>
                        <th className="p-3 text-center">Approved Transport</th>
                        <th className="p-3 text-center">Approved Meals</th>
                        <th className="p-3 text-center">Special Bonus Allowance</th>
                        <th className="p-3 text-center font-bold">Total (SGD)</th>
                        <th className="p-3 pr-5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {employees.slice(0, 4).map((emp, i) => {
                        const trClaim = (i % 2 === 0) ? 300 : 0;
                        const mealClaim = 200;
                        const specClaim = (i === 1) ? 150 : 0;
                        const total = trClaim + mealClaim + specClaim;
                        return (
                          <tr key={emp.id} className="hover:bg-slate-50/50">
                            <td className="p-3 pl-5 font-bold text-slate-800">{emp.name}</td>
                            <td className="p-3 text-slate-500">{emp.department}</td>
                            <td className="p-3 text-center font-mono text-slate-600">{trClaim > 0 ? `${trClaim}.00` : '—'}</td>
                            <td className="p-3 text-center font-mono text-slate-600">{mealClaim}.00</td>
                            <td className="p-3 text-center font-mono text-indigo-500">{specClaim > 0 ? `${specClaim}.00` : '—'}</td>
                            <td className="p-3 text-center font-mono font-black text-slate-800">{total}.00</td>
                            <td className="p-3 pr-5 text-right">
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded text-[10px] font-bold">
                                Approved
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =======================================================
            BONUS MAIN TAB CONTENT
            ======================================================= */}
        {activeMainTab === 'Bonus' && (
          <div id="bonus-view-container" className="space-y-6">
            {bonusSubTab === 'Bonus type' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <SelectMenu
                    value={selectedPolicyFilter}
                    onChange={setSelectedPolicyFilter}
                    triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                    options={[
                      { value: 'All policy types', label: 'All policy types' },
                      { value: 'Normal', label: 'Normal' },
                      { value: 'Working service', label: 'Working service' },
                      { value: 'LTIP', label: 'LTIP' },
                    ]}
                  />

                  <button
                    type="button"
                    onClick={() => setBonusModalOpen(true)}
                    className="bg-novora hover:bg-opacity-95 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-tiny inline-flex items-center gap-1.5 self-end sm:self-auto cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Bonus Type</span>
                  </button>
                </div>

                <div className="border border-slate-100 rounded-2xl overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[700px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <th className="p-4 pl-6">Bonus name</th>
                        <th className="p-4">Policy type</th>
                        <th className="p-4">Pay month</th>
                        <th className="p-4">Based on</th>
                        <th className="p-4 text-center">On payslip</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {bonusTypes
                        .filter(b => selectedPolicyFilter === 'All policy types' || b.policyType === selectedPolicyFilter)
                        .map((bonus) => (
                          <tr key={bonus.id} className="hover:bg-slate-50/50">
                            <td className="p-4 pl-6 font-bold text-slate-800">{bonus.name}</td>
                            <td className="p-4">
                              <span className="bg-blue-50/70 text-novora border border-blue-100/50 rounded-md px-2.5 py-1 text-[10.5px] font-bold">
                                {bonus.policyType}
                              </span>
                            </td>
                            <td className="p-4 text-slate-600 italic font-semibold">{bonus.payMonth}</td>
                            <td className="p-4 text-slate-800 font-bold">{bonus.basedOn}</td>
                            <td className="p-4 text-center">
                              <span className="bg-emerald-55 text-emerald-700 px-2 py-0.5 border border-emerald-110 rounded text-[10px] font-extrabold">Yes</span>
                            </td>
                            <td className="p-4">
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold px-2 py-0.5 rounded-md text-[10.5px]">
                                {bonus.status}
                              </span>
                            </td>
                            <td className="p-4 pr-6 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingBonus(bonus);
                                  addToast(`Loading ${bonus.name} details into editor`, 'info');
                                }}
                                className="text-slate-500 hover:text-novora font-bold text-xs inline-flex items-center gap-1 cursor-pointer hover:underline"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bonus Attachment section */}
            {bonusSubTab === 'Bonus attachment' && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50/45 hover:bg-slate-50 transition-all cursor-pointer"
                     onClick={() => {
                       const fn = prompt('Enter sign-off/policy report name to link:', 'Q2_Sales_Commission_Payouts.pdf');
                       if (fn) {
                         const n = { id: createLocalId('ATT-B'), label: fn, date: new Date().toISOString().split('T')[0], size: '3.1 MB', uploader: 'System Admin' };
                         setBonusAttachments([n, ...bonusAttachments]);
                         addToast(`Logged ${fn} as bonus policy verification support, size 3.1 MB.`, 'success');
                       }
                     }}>
                  <div className="h-10 w-10 bg-blue-50 text-novora rounded-full flex items-center justify-center mx-auto mb-2 shrink-0">
                    <Paperclip className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Attach board approvals or targets fulfillment KPI files here</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Supports PDF, XLSX and Word docs up to 25MB (Click to simulate attach)</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest pl-1">Bonus Supporting Documents Archive</h4>
                  <div className="border border-slate-100 rounded-2xl bg-white overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <th className="p-3 pl-5">Document Name</th>
                          <th className="p-3">Uploaded Date</th>
                          <th className="p-3">File size</th>
                          <th className="p-3 pr-5 text-right">Owner</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-semibold">
                        {bonusAttachments.map(file => (
                          <tr key={file.id} className="hover:bg-slate-50/50 text-slate-700">
                            <td className="p-3 pl-5 font-bold text-slate-800 flex items-center gap-2">
                              <FileSpreadsheet className="h-4 w-4 text-emerald-550" />
                              <span>{file.label}</span>
                            </td>
                            <td className="p-3 font-mono text-slate-400">{file.date}</td>
                            <td className="p-3 font-mono text-slate-500">{file.size}</td>
                            <td className="p-3 pr-5 text-right font-bold text-slate-800">{file.uploader}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Bonus Payment calculation roster */}
            {bonusSubTab === 'Bonus payment' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50 p-4 border border-slate-200 rounded-3xl">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest">Calculated May 2026 Bonus disbursement</h4>
                    <p className="text-[10.5px] font-medium text-slate-400">Ledger details with corresponding KPI achievement benchmarks.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setBonusPayments(bonusPayments.map(p => ({ ...p, status: 'Paid' })));
                      addToast('Fulfillment releases posted successfully to May 2026 payroll.', 'success');
                    }}
                    className="bg-novora hover:bg-opacity-95 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                  >
                    Bulk Approve Disburse
                  </button>
                </div>

                <div className="border border-slate-100 rounded-2xl bg-white overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <th className="p-3 pl-5">Staff Member</th>
                        <th className="p-3">Department</th>
                        <th className="p-3">KPI Factor Scale</th>
                        <th className="p-3 font-mono">Disburse Amount</th>
                        <th className="p-3 pr-5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {bonusPayments.map((p) => (
                        <tr key={p.empId} className="hover:bg-slate-50/50">
                          <td className="p-3 pl-5 font-bold text-slate-800">{p.empName}</td>
                          <td className="p-3 text-slate-500">{p.dept}</td>
                          <td className="p-3 font-bold text-novora">{p.scale}</td>
                          <td className="p-3 font-mono font-extrabold text-slate-900">SGD {p.amount}</td>
                          <td className="p-3 pr-5 text-right">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                              p.status === 'Paid'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                : 'bg-blue-50 text-blue-700 border-blue-105'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bonus policy rules panel */}
            {bonusSubTab === 'Bonus policy' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest">Active Multiplier Schemes</h4>
                  <button
                    type="button"
                    onClick={() => {
                      const ruleName = prompt('Enter new policy rule multiplier name:');
                      const weight = prompt('Enter target multiplier weight (e.g., Basic × 1.50):');
                      if (ruleName && weight) {
                        setBonusPolicies([...bonusPolicies, {
                          id: createLocalId('POL'),
                          ruleName,
                          weight,
                          active: true
                        }]);
                        addToast(`Policy "${ruleName}" successfully published to active multipliers standard.`, 'success');
                      }
                    }}
                    className="bg-novora hover:bg-opacity-95 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl cursor-pointer"
                  >
                    + Add New Policy Rule
                  </button>
                </div>

                <div className="border border-slate-100 rounded-2xl bg-white overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <th className="p-3 pl-5">Policy Rule Name</th>
                        <th className="p-3">Multiplier Weight Formula</th>
                        <th className="p-3">Reference index</th>
                        <th className="p-3 text-center">Calculated Automatically</th>
                        <th className="p-3 pr-5 text-right">Rule Toggle Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {bonusPolicies.map((pol) => (
                        <tr key={pol.id} className="hover:bg-slate-50/50">
                          <td className="p-3 pl-5 font-bold text-slate-800">{pol.ruleName}</td>
                          <td className="p-3 font-mono font-extrabold text-blue-600">{pol.weight}</td>
                          <td className="p-3 text-slate-400 font-mono text-xs">{pol.id}</td>
                          <td className="p-3 text-center">
                            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 border border-emerald-100 rounded text-[10px]">Yes</span>
                          </td>
                          <td className="p-3 pr-5 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setBonusPolicies(bonusPolicies.map(b => b.id === pol.id ? { ...b, active: !b.active } : b));
                                addToast(`Policy rule ${pol.ruleName} updated.`, 'success');
                              }}
                              className={`px-3 py-1 rounded-xl text-[10.5px] font-bold cursor-pointer border ${
                                pol.active
                                  ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                  : 'bg-slate-100 border-slate-200 text-slate-500'
                              }`}
                            >
                              {pol.active ? 'Active Standard' : 'Suspended'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =======================================================
            OVERTIME MAIN TAB CONTENT
            ======================================================= */}
        {activeMainTab === 'Overtime' && (
          <div id="overtime-view-container" className="space-y-6">
            {overtimeSubTab === 'OT policy attachment' ? (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* Left Side: OT policy settings */}
                <div className="lg:col-span-2 bg-slate-50/50 border border-slate-100 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest">
                      OT policy settings{otPolicySettings.policyName ? ` — ${otPolicySettings.policyName}` : ''}
                    </h4>
                    <button
                      onClick={() => setIsEditOtPolicyModalOpen(true)}
                      className="text-novora hover:underline text-xs font-bold"
                    >
                      Edit policy
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                    <div className="flex py-2.5 justify-between">
                      <span className="text-slate-400">Weekday OT rate</span>
                      <span className="font-bold text-slate-800">{otPolicySettings.weekdayOtRate}</span>
                    </div>
                    <div className="flex py-2.5 justify-between">
                      <span className="text-slate-400">Weekend OT rate</span>
                      <span className="font-bold text-slate-800">{otPolicySettings.weekendOtRate}</span>
                    </div>
                    <div className="flex py-2.5 justify-between">
                      <span className="text-slate-400">Public holiday OT</span>
                      <span className="font-bold text-slate-800">{otPolicySettings.holidayOtRate}</span>
                    </div>
                    <div className="flex py-2.5 justify-between">
                      <span className="text-slate-400">Calculate by</span>
                      <span className="font-bold text-novora">{otPolicySettings.calculateBy}</span>
                    </div>
                    <div className="flex py-2.5 justify-between">
                      <span className="text-slate-400">Rounding block</span>
                      <span className="font-bold text-slate-800">{otPolicySettings.roundingBlock}</span>
                    </div>
                    <div className="flex py-2.5 justify-between">
                      <span className="text-slate-400">Min OT threshold</span>
                      <span className="font-bold text-slate-800">{otPolicySettings.minOtThreshold}</span>
                    </div>
                    <div className="flex py-2.5 justify-between">
                      <span className="text-slate-400">Max OT per day</span>
                      <span className="font-bold text-slate-800">{otPolicySettings.maxOtPerDay}</span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Attached employees (430 employees) */}
                <div className="lg:col-span-3 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest">Attached employees</h4>
                      <span className="bg-blue-50 text-novora font-black text-[9px] px-2 py-0.5 rounded border border-blue-105">
                        {otAttachedStaff.length} employees
                      </span>
                    </div>

                    <button
                      onClick={() => setIsAttachOtModalOpen(true)}
                      className="bg-novora text-white text-xs font-bold px-3.5 py-1.5 rounded-xl cursor-pointer"
                    >
                      + Attach OT policy
                    </button>
                  </div>

                  <div className="border border-slate-100 rounded-2xl overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <th className="p-3 pl-5">Employee</th>
                          <th className="p-3">Department</th>
                          <th className="p-3">Policy type</th>
                          <th className="p-3 pr-5 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {otAttachedStaff.map((staff) => (
                          <tr key={staff.id} className="hover:bg-slate-50/50">
                            <td className="p-3 pl-5">
                              <div className="flex items-center gap-2.5">
                                <div className="h-7 w-7 rounded-full bg-blue-100 text-novora text-[10px] font-bold flex items-center justify-center shrink-0">
                                  {staff.name.split(' ').map(n=>n[0]).join('')}
                                </div>
                                <div>
                                  <span className="font-bold text-slate-800 block">{staff.name}</span>
                                  <span className="text-[9.5px] font-mono text-slate-400">{staff.id}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 font-semibold text-slate-600">{staff.department}</td>
                            <td className="p-3">
                              <span className="bg-blue-50/70 text-novora text-[10px] font-bold border border-blue-100/50 px-2 py-0.5 rounded">
                                {staff.policyType}
                              </span>
                            </td>
                            <td className="p-3 pr-5 text-right">
                              <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-md text-[10px] font-bold">
                                {staff.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            ) : (
              <div className="space-y-6">
                {/* Manual OT Setup */}
                {overtimeSubTab === 'Manual OT setup' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
                      <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                        <PlusCircle className="h-4 w-4 text-novora" />
                        <span>Log Manual OT Hours</span>
                      </h4>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        if (!newManualOtStaff || !newManualOtHrs) {
                          addToast('Specify employee and overtime hours.', 'error');
                          return;
                        }
                        const hrsCalculated = parseFloat(newManualOtHrs);
                        const rateNum = parseFloat(newManualOtRate);
                        const n = {
                          id: createLocalId('MN'),
                          empName: newManualOtStaff,
                          hrs: hrsCalculated,
                          rate: `SGD ${rateNum.toFixed(2)}/hr`,
                          total: hrsCalculated * rateNum,
                          date: new Date().toISOString().split('T')[0]
                        };
                        setManualOtEntries([n, ...manualOtEntries]);
                        setNewManualOtStaff('');
                        setNewManualOtHrs('');
                        addToast(`Logged ${hrsCalculated} overtime hours for ${newManualOtStaff}.`, 'success');
                      }} className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Select Employee</label>
                          <select
                            value={newManualOtStaff}
                            onChange={(e) => setNewManualOtStaff(e.target.value)}
                            className="bg-white border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none font-semibold text-slate-700"
                          >
                            <option value="">Choose Employee...</option>
                            {employees.map(emp => (
                              <option key={emp.id} value={emp.name}>{emp.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">OT Hours Worked</label>
                          <input
                            type="number" step="0.5" placeholder="e.g. 4.5"
                            value={newManualOtHrs}
                            onChange={(e) => setNewManualOtHrs(e.target.value)}
                            className="bg-white border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Per Hour Rate (SGD)</label>
                          <input
                            type="number" step="0.5" placeholder="25.00"
                            value={newManualOtRate}
                            onChange={(e) => setNewManualOtRate(e.target.value)}
                            className="bg-white border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none font-semibold"
                          />
                        </div>
                        <button type="submit" className="w-full bg-novora hover:bg-opacity-95 text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer">
                          Add OT Entry
                        </button>
                      </form>
                    </div>

                    <div className="lg:col-span-2 space-y-3">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest pl-1">Staged manual overtime runs</h4>
                      <div className="border border-slate-100 rounded-2xl bg-white overflow-hidden text-xs">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              <th className="p-3 pl-5">Employee</th>
                              <th className="p-3">Logged Date</th>
                              <th className="p-3">Hours</th>
                              <th className="p-3">Rate Factor</th>
                              <th className="p-3 pr-5 text-right font-bold">Computed Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                            {manualOtEntries.map(entry => (
                              <tr key={entry.id} className="hover:bg-slate-50/50">
                                <td className="p-3 pl-5 font-bold text-slate-800">{entry.empName}</td>
                                <td className="p-3 font-mono text-slate-400">{entry.date}</td>
                                <td className="p-3 text-slate-800">{entry.hrs} hours</td>
                                <td className="p-3 text-slate-500">{entry.rate}</td>
                                <td className="p-3 pr-5 text-right font-mono font-bold text-emerald-600">SGD {entry.total.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Specific OT Override Setup */}
                {overtimeSubTab === 'Specific OT setup' && (
                  <div className="space-y-4">
                    <div className="bg-amber-50/70 border border-amber-100 p-4 rounded-xl text-[11px] font-semibold text-amber-805">
                      Configure individual override coefficients that take precedence over the company default multiplier parameters.
                    </div>
                    <div className="border border-slate-100 bg-white rounded-2xl overflow-hidden text-xs">
                      <table className="w-full text-left font-medium">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <th className="p-3 pl-5">Department Scope</th>
                            <th className="p-3">Standard Multiplier</th>
                            <th className="p-3">Special Weekend Coefficient</th>
                            <th className="p-3">Condition Description</th>
                            <th className="p-3 pr-5 text-right font-bold">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {otOverrides.map((override) => (
                            <tr key={override.id} className="hover:bg-slate-50/20">
                              <td className="p-3 pl-5 font-bold text-slate-800">{override.deptScope}</td>
                              <td className="p-3 font-mono">{override.multiplier}</td>
                              <td className="p-3 font-mono font-bold text-blue-600">{override.weekendCoefficient}</td>
                              <td className="p-3 text-slate-500">{override.condition}</td>
                              <td className="p-3 pr-5 text-right font-bold space-x-3 whitespace-nowrap">
                                <button
                                  title="Edit"
                                  type="button"
                                  onClick={() => setEditingOtOverride(override)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-novora hover:bg-slate-50 transition-colors cursor-pointer inline-flex items-center justify-center"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  title="Delete"
                                  type="button"
                                  onClick={() => {
                                    setOtOverrides(otOverrides.filter(o => o.id !== override.id));
                                    addToast(`Overriding parameter for ${override.deptScope} removed.`, 'success');
                                  }}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer inline-flex items-center justify-center"
                                >
                                  <Trash className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* OT Request Filing Form */}
                {overtimeSubTab === 'OT request' && (
                  <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest text-center">My Overtime Request</h4>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      if (!newOtReqHrs || !newOtReqReason) {
                        addToast('Describe the reason and specifying estimated duration.', 'error');
                        return;
                      }
                      const emp = employees[0]
                      const employeeId = emp?.apiId || emp?.id
                      if (!employeeId) {
                        addToast('No employee profile available to file overtime.', 'error')
                        return
                      }
                      try {
                        const created = await createOvertimeRecord({
                          employeeId,
                          workDate: new Date().toISOString().split('T')[0],
                          hours: parseFloat(newOtReqHrs),
                          reason: newOtReqReason,
                        })
                        setOtRequests((prev) => [mapOvertimeToRequest(created), ...prev])
                        setNewOtReqHrs('')
                        setNewOtReqReason('')
                        addToast('Overtime request successfully posted, waiting for manager sign off.', 'success')
                      } catch (err) {
                        addToast(err instanceof ApiError ? err.message : 'Could not create overtime request.', 'error')
                      }
                    }} className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Requested Overtime Hours</label>
                        <input
                          type="number" step="0.5" placeholder="e.g. 2.5"
                          value={newOtReqHrs}
                          onChange={(e) => setNewOtReqHrs(e.target.value)}
                          className="bg-white border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none font-semibold text-slate-700"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Business Reason</label>
                        <textarea
                          placeholder="e.g. Preparing end-of-year accounts audit paperwork"
                          value={newOtReqReason}
                          onChange={(e) => setNewOtReqReason(e.target.value)}
                          className="bg-white border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none font-medium text-slate-700 h-20"
                        />
                      </div>
                      <button type="submit" className="w-full bg-novora hover:bg-opacity-95 text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer">
                        Submit OT Request
                      </button>
                    </form>
                  </div>
                )}

                {/* Request for others */}
                {overtimeSubTab === 'Request for others' && (
                  <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest text-center">Filing OT Request for Team Member</h4>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      if (!newOtReqStaff || !newOtReqHrs || !newOtReqReason) {
                        addToast('Describe staff, reason and specifying estimated duration.', 'error');
                        return;
                      }
                      const emp = employees.find((x) => x.name === newOtReqStaff)
                      const employeeId = emp?.apiId || emp?.id
                      if (!employeeId) {
                        addToast('Select a valid employee for overtime filing.', 'error')
                        return
                      }
                      try {
                        const created = await createOvertimeRecord({
                          employeeId,
                          workDate: new Date().toISOString().split('T')[0],
                          hours: parseFloat(newOtReqHrs),
                          reason: newOtReqReason,
                        })
                        setOtRequests((prev) => [mapOvertimeToRequest(created), ...prev])
                        setNewOtReqStaff('')
                        setNewOtReqHrs('')
                        setNewOtReqReason('')
                        addToast(`Overtime request filed for ${newOtReqStaff} waiting for sign-off.`, 'success')
                      } catch (err) {
                        addToast(err instanceof ApiError ? err.message : 'Could not create overtime request.', 'error')
                      }
                    }} className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Employee</label>
                        <select
                          value={newOtReqStaff}
                          onChange={(e) => setNewOtReqStaff(e.target.value)}
                          className="bg-white border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none font-semibold text-slate-700"
                        >
                          <option value="">Choose Employee...</option>
                          {employees.map(emp => (
                            <option key={emp.id} value={emp.name}>{emp.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Overtime Duration (Hours)</label>
                        <input
                          type="number" step="0.5" placeholder="e.g. 4.0"
                          value={newOtReqHrs}
                          onChange={(e) => setNewOtReqHrs(e.target.value)}
                          className="bg-white border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Justification Reason</label>
                        <textarea
                          placeholder="e.g. Emergency support during evening network outage"
                          value={newOtReqReason}
                          onChange={(e) => setNewOtReqReason(e.target.value)}
                          className="bg-white border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none font-medium h-20 text-slate-700"
                        />
                      </div>
                      <button type="submit" className="w-full bg-novora hover:bg-opacity-95 text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer">
                        File Overtime on Behalf
                      </button>
                    </form>
                  </div>
                )}

                {/* OT Approval Queue */}
                {overtimeSubTab === 'OT approval' && (
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between pl-1">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Pending Sign-off Queue</h4>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {otRequests.filter(r => r.status === 'Pending').length} requests pending
                      </span>
                    </div>

                    <div className="border border-slate-100 rounded-2xl bg-white overflow-hidden">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <th className="p-3 pl-5">Staff Member</th>
                            <th className="p-3">Claimed Date</th>
                            <th className="p-3">Justification Reason</th>
                            <th className="p-3 text-center font-bold">Hours</th>
                            <th className="p-3 pr-5 text-right font-bold">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                          {otRequests.filter(r => r.status === 'Pending').map(req => (
                            <tr key={req.id} className="hover:bg-slate-50/55">
                              <td className="p-3 pl-5 font-bold text-slate-800">{req.empName}</td>
                              <td className="p-3 font-mono text-slate-400">{req.date}</td>
                              <td className="p-3 text-slate-600">{req.reason}</td>
                              <td className="p-3 text-center font-mono text-slate-800">{req.hrs} hrs</td>
                              <td className="p-3 pr-5 text-right space-x-2">
                                <button
                                  type="button"
                                  onClick={async () => {
                                    try {
                                      const updated = await decideOvertimeRecord(req.id, { decision: 'APPROVE' })
                                      setOtRequests((prev) => prev.map((r) => (r.id === req.id ? mapOvertimeToRequest(updated) : r)))
                                      addToast(`Approved ${req.hrs} overtime hours for ${req.empName}`, 'success')
                                    } catch (err) {
                                      addToast(err instanceof ApiError ? err.message : 'Could not approve overtime.', 'error')
                                    }
                                  }}
                                  className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-150 text-[11px] cursor-pointer font-bold"
                                >
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    try {
                                      const updated = await decideOvertimeRecord(req.id, { decision: 'REJECT' })
                                      setOtRequests((prev) => prev.map((r) => (r.id === req.id ? mapOvertimeToRequest(updated) : r)))
                                      addToast(`Rejected overtime request from ${req.empName}`, 'error')
                                    } catch (err) {
                                      addToast(err instanceof ApiError ? err.message : 'Could not reject overtime.', 'error')
                                    }
                                  }}
                                  className="bg-rose-50 text-rose-700 hover:bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-150 text-[11px] cursor-pointer font-bold"
                                >
                                  Reject
                                </button>
                              </td>
                            </tr>
                          ))}
                          {otRequests.filter(r => r.status === 'Pending').length === 0 && (
                            <tr>
                              <td colSpan={5} className="p-8 text-center text-slate-400 italic font-medium animate-pulse">
                                No pending overtime approvals in the queue! Excellent job.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* OT History registry list */}
                {overtimeSubTab === 'OT history' && (
                  <div className="space-y-3 text-xs">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest pl-1">Overtime Requests Log History</h4>
                    <div className="border border-slate-100 bg-white rounded-2xl overflow-hidden">
                      <table className="w-full text-left font-semibold">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <th className="p-3 pl-5">Staff Member</th>
                            <th className="p-3">Claimed Date</th>
                            <th className="p-3 text-center font-bold">Hours</th>
                            <th className="p-3 font-bold">Reason</th>
                            <th className="p-3 pr-5 text-right animate-none font-bold">Fulfillment Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {otRequests.map(req => (
                            <tr key={req.id} className="hover:bg-slate-50/50">
                              <td className="p-3 pl-5 font-bold text-slate-800">{req.empName}</td>
                              <td className="p-3 font-mono text-slate-400">{req.date}</td>
                              <td className="p-3 text-center text-slate-800">{req.hrs} hrs</td>
                              <td className="p-3 text-slate-500 font-medium">{req.reason}</td>
                              <td className="p-3 pr-5 text-right font-medium">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                  req.status === 'Approved'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                    : req.status === 'Rejected'
                                      ? 'bg-red-50 text-red-700 border-red-100'
                                      : 'bg-amber-50 text-amber-600 border-amber-100'
                                }`}>
                                  {req.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* =======================================================
            DEPOSIT MAIN TAB CONTENT
            ======================================================= */}
        {activeMainTab === 'Deposit' && (
          <div id="deposit-view-container" className="space-y-6">
            {depositSubTab === 'Deposit type' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest">Active deposit types</h4>
                  <button
                    type="button"
                    onClick={() => setDepositModalOpen(true)}
                    className="bg-novora hover:bg-opacity-95 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-tiny inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Deposit Type</span>
                  </button>
                </div>

                <div className="border border-slate-100 rounded-2xl overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[700px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <th className="p-4 pl-6">Deposit type</th>
                        <th className="p-4">Code</th>
                        <th className="p-4">Employment status</th>
                        <th className="p-4">Frequency</th>
                        <th className="p-4">Amount basis</th>
                        <th className="p-4">Reimburse month</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {depositTypes.map((dep) => (
                        <tr key={dep.id} className="hover:bg-slate-50/50">
                          <td className="p-4 pl-6 font-bold text-slate-800">{dep.name}</td>
                          <td className="p-4 font-mono font-bold text-indigo-600">{dep.code}</td>
                          <td className="p-4">
                            <span className="bg-blue-50/70 text-novora/90 border border-blue-105 rounded-md px-2 py-0.5 text-[10px] font-bold">
                              {dep.employmentStatus}
                            </span>
                          </td>
                          <td className="p-4 text-slate-500">{dep.frequency}</td>
                          <td className="p-4 font-extrabold text-slate-700">{dep.amountBasis}</td>
                          <td className="p-4 italic text-slate-500 font-semibold">{dep.reimburseMonth}</td>
                          <td className="p-4">
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold px-2 py-0.5 rounded-md text-[10.5px]">
                              {dep.status}
                            </span>
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingDeposit(dep);
                                addToast(`Staged ${dep.name} details into active modal standard`, 'info');
                              }}
                              className="text-slate-500 hover:text-novora font-bold text-xs inline-flex items-center gap-1 cursor-pointer hover:underline"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* Deposit attachment sub tab */}
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50/30 hover:bg-slate-50 transition-all cursor-pointer animate-none"
                     onClick={() => {
                       const docName = prompt('Enter deposit receipt file name (e.g. Laptop_Bond_Ahmad.pdf):');
                       if (docName) {
                         const n = { id: createLocalId('ATT-D'), label: docName, date: new Date().toISOString().split('T')[0], size: '1.2 MB', uploader: 'System Admin' };
                         setDepositAttachments([n, ...depositAttachments]);
                         addToast(`Logged ${docName} asset collateral file.`, 'success');
                       }
                     }}>
                  <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2 shrink-0">
                    <Paperclip className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Attach asset return records or equipment bonds proof</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Supports PDF and image files up to 10MB (Click to simulate attach)</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest pl-1">Deposit Receipts Archive</h4>
                  <div className="border border-slate-100 rounded-2xl bg-white overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <th className="p-3 pl-5">Document Name</th>
                          <th className="p-3">Logged Date</th>
                          <th className="p-3">File size</th>
                          <th className="p-3 pr-5 text-right font-bold">Uploader</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                        {depositAttachments.map(file => (
                          <tr key={file.id} className="hover:bg-slate-50/50">
                            <td className="p-3 pl-5 font-bold text-slate-800 flex items-center gap-2">
                              <FileText className="h-4 w-4 text-indigo-500" />
                              <span>{file.label}</span>
                            </td>
                            <td className="p-3 font-mono text-slate-400">{file.date}</td>
                            <td className="p-3 font-mono text-slate-500">{file.size}</td>
                            <td className="p-3 pr-5 text-right font-bold text-slate-800">{file.uploader}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =======================================================
            DEDUCTION MAIN TAB CONTENT
            ======================================================= */}
        {activeMainTab === 'Deduction' && (
          <div id="deduction-view-container" className="space-y-6">
            {deductionSubTab === 'Deduction type' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <SelectMenu
                    value={selectedPolicyFilter}
                    onChange={setSelectedPolicyFilter}
                    triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                    options={[
                      { value: 'All policy types', label: 'All policy types' },
                      { value: 'Statutory', label: 'Statutory' },
                      { value: 'Tax', label: 'Tax' },
                      { value: 'Rota rule', label: 'Rota rule' },
                      { value: 'Attendance', label: 'Attendance' },
                      { value: 'Leave', label: 'Leave' },
                    ]}
                  />

                  <button
                    type="button"
                    onClick={() => setDeductionModalOpen(true)}
                    className="bg-novora hover:bg-opacity-95 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-tiny inline-flex items-center gap-1.5 cursor-pointer self-end sm:self-auto"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Deduction Type</span>
                  </button>
                </div>

                <div className="border border-slate-100 rounded-2xl overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[700px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <th className="p-4 pl-6">Deduction name</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Deduction rule</th>
                        <th className="p-4">Amount / Rate</th>
                        <th className="p-4 text-center">On payslip</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {deductions
                        .filter(d => selectedPolicyFilter === 'All policy types' || d.type === selectedPolicyFilter)
                        .map((ded) => (
                          <tr key={ded.id} className="hover:bg-slate-50/50">
                            <td className="p-4 pl-6 font-bold text-slate-800">{ded.name}</td>
                            <td className="p-4">
                              <span className="bg-blue-50/70 text-novora border border-blue-105 rounded-md px-2 py-0.5 text-[10px] font-bold">
                                {ded.type}
                              </span>
                            </td>
                            <td className="p-4 text-slate-600 font-semibold italic">{ded.deductionRule}</td>
                            <td className="p-4 font-extrabold text-slate-800 font-mono">{ded.amountRate}</td>
                            <td className="p-4 text-center">
                              <span className="bg-emerald-55 text-emerald-700 px-2 py-0.5 border border-emerald-110 rounded text-[10px] font-extrabold">Yes</span>
                            </td>
                            <td className="p-4">
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold px-2 py-0.5 rounded-md text-[10.5px]">
                                {ded.status}
                              </span>
                            </td>
                            <td className="p-4 pr-6 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingDeduction(ded);
                                  addToast(`Loading ${ded.name} into configuration modal`, 'info');
                                }}
                                className="text-slate-500 hover:text-novora font-bold text-xs inline-flex items-center gap-1 cursor-pointer hover:underline"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Deduction Attachments */}
            {deductionSubTab === 'Deduction attachment' && (
              <div className="space-y-4 text-xs">
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50/30 hover:bg-slate-50 transition-all cursor-pointer animate-none"
                     onClick={() => {
                       const docName = prompt('Enter penalty / policy fine attachment name (e.g. Asset_Damage_Report.pdf):');
                       if (docName) {
                         const n = { id: createLocalId('ATT-R'), label: docName, date: new Date().toISOString().split('T')[0], size: '1.4 MB', uploader: 'Audit Lead' };
                         setDeductionAttachments([n, ...deductionAttachments]);
                         addToast(`Logged ${docName} withholding file successfully.`, 'success');
                       }
                     }}>
                  <div className="h-10 w-10 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-2 shrink-0">
                    <Paperclip className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Attach personal asset clearance logs or salary sacrifice declaration agreements</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Supports standard PDF, PNG files up to 15MB (Click to simulate attach)</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest pl-1">Deduction Agreements Archive</h4>
                  <div className="border border-slate-100 rounded-2xl bg-white overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <th className="p-3 pl-5">Withholding Document Name</th>
                          <th className="p-3">Uploaded Date</th>
                          <th className="p-3">File size</th>
                          <th className="p-3 pr-5 text-right font-bold">Authorized By</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                        {deductionAttachments.map(file => (
                          <tr key={file.id} className="hover:bg-slate-50/50">
                            <td className="p-3 pl-5 font-bold text-rose-700 flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span>{file.label}</span>
                            </td>
                            <td className="p-3 font-mono text-slate-400">{file.date}</td>
                            <td className="p-3 font-mono text-slate-500">{file.size}</td>
                            <td className="p-3 pr-5 text-right font-bold text-slate-800">{file.uploader}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Manual deduction filing */}
            {deductionSubTab === 'Manual deduction' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs font-semibold">
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest">Register Manual Deduction</h4>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (!newDedStaff || !newDedAmt || !newDedReason) {
                      addToast('Please fill in employee name, amount, and specify a reason.', 'error');
                      return;
                    }
                    const amtParsed = parseFloat(newDedAmt);
                    const n = {
                      id: createLocalId('DEC'),
                      empName: newDedStaff,
                      reason: newDedReason,
                      amount: amtParsed.toString(),
                      date: new Date().toISOString().split('T')[0]
                    };
                    setManualDeductions([n, ...manualDeductions]);
                    setNewDedStaff('');
                    setNewDedAmt('');
                    setNewDedReason('');
                    addToast(`Deduction of SGD ${amtParsed.toFixed(2)} applied for ${newDedStaff}.`, 'success');
                  }} className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Select Employee</label>
                      <select
                        value={newDedStaff}
                        onChange={(e) => setNewDedStaff(e.target.value)}
                        className="bg-white border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none font-semibold text-slate-700"
                      >
                        <option value="">Choose Employee...</option>
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.name}>{emp.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Deducted Amount (SGD)</label>
                      <input
                        type="number" step="1" placeholder="e.g. 150"
                        value={newDedAmt}
                        onChange={(e) => setNewDedAmt(e.target.value)}
                        className="bg-white border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Withholding Justification</label>
                      <input
                        type="text" placeholder="e.g. Unreturned technical transit hub asset"
                        value={newDedReason}
                        onChange={(e) => setNewDedReason(e.target.value)}
                        className="bg-white border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none font-medium"
                      />
                    </div>
                    <button type="submit" className="w-full bg-novora hover:bg-opacity-95 text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer">
                      Post Salary Deduction
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-2 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest pl-1">Authorized Custom deductions list</h4>
                  <div className="border border-slate-100 rounded-2xl bg-white overflow-hidden">
                    <table className="w-full text-left font-semibold">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <th className="p-3 pl-5">Employee</th>
                          <th className="p-3">Declared Date</th>
                          <th className="p-3">Justification Reason</th>
                          <th className="p-3 pr-5 text-right font-bold">Deduction Charge</th>
                          <th className="p-3 text-right font-bold pr-5">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {manualDeductions.map(item => {
                          const numVal = parseFloat(typeof item.amount === 'string' ? item.amount : String(item.amount) || '0');
                          return (
                            <tr key={item.id} className="hover:bg-slate-50/50">
                              <td className="p-3 pl-5 font-bold text-slate-800">{item.empName}</td>
                              <td className="p-3 font-mono text-slate-400">{item.date}</td>
                              <td className="p-3 text-slate-500 max-w-xs truncate font-medium">{item.reason}</td>
                              <td className="p-3 pr-5 text-right font-mono font-bold text-rose-600">- SGD {numVal.toFixed(2)}</td>
                              <td className="p-3 pr-5 text-right font-bold">
                                <div className="inline-flex gap-2">
                                  <button
                                    title="Edit"
                                    type="button"
                                    onClick={() => setEditingManualDeduction(item)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-novora hover:bg-slate-50 transition-colors cursor-pointer inline-flex items-center justify-center"
                                  >
                                    <Edit className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    title="Delete"
                                    type="button"
                                    onClick={() => {
                                      setManualDeductions(manualDeductions.filter(m => m.id !== item.id));
                                      addToast(`Deduction entry for ${item.empName} deleted.`, 'success');
                                    }}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer inline-flex items-center justify-center"
                                  >
                                    <Trash className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =======================================================
            TAX MAIN TAB CONTENT
            ======================================================= */}
        {activeMainTab === 'Tax' && (
          <div id="tax-view-container" className="space-y-6">
            {taxSubTab === 'Tax category' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest">Localized tax profiles</h4>
                  <button
                    type="button"
                    onClick={() => setTaxModalOpen(true)}
                    className="bg-novora hover:bg-opacity-95 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-tiny inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Tax Category</span>
                  </button>
                </div>

                <div className="border border-slate-100 rounded-2xl overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[600px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <th className="p-4 pl-6">Tax name</th>
                        <th className="p-4">Code</th>
                        <th className="p-4">Calculate on</th>
                        <th className="p-4 text-center">Calc. overall income</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {taxes.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/50">
                          <td className="p-4 pl-6 font-bold text-slate-800">{t.name}</td>
                          <td className="p-4 font-mono font-bold text-red-650">{t.code}</td>
                          <td className="p-4 text-slate-700">{t.calculateOn}</td>
                          <td className="p-4 text-center">
                            {t.calcOverallIncome === 'Yes' ? (
                              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-100">Yes</span>
                            ) : (
                              <span className="text-slate-400 bg-slate-50 px-2 py-0.5 border border-slate-100 rounded text-[10px]">No</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold px-2 py-0.5 rounded-md text-[10.5px]">
                              {t.status}
                            </span>
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingTax(t);
                                addToast(`Staged ${t.name} parameters into editor modal`, 'info');
                              }}
                              className="text-slate-500 hover:text-novora font-bold text-xs inline-flex items-center gap-1 cursor-pointer hover:underline"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tax attachments */}
            {taxSubTab === 'Tax attachment' && (
              <div className="space-y-4 text-xs font-semibold">
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50/30 hover:bg-slate-50 transition-all cursor-pointer animate-none"
                     onClick={() => {
                       const docName = prompt('Enter government gazette circular or tax advisory file name (e.g. Budget_2026_Tax_Reform_Rates.pdf):');
                       if (docName) {
                         const n = { id: createLocalId('ATT-T'), label: docName, date: new Date().toISOString().split('T')[0], size: '2.5 MB', uploader: 'Corporate Controller' };
                         setTaxAttachments([n, ...taxAttachments]);
                         addToast(`Archived ${docName} standard successfully.`, 'success');
                       }
                     }}>
                  <div className="h-10 w-10 bg-red-50 text-red-650 rounded-full flex items-center justify-center mx-auto mb-2 shrink-0">
                    <Paperclip className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Attach government withholding filings or advisory reference briefs</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Supports standard PDF or Image documentation (Click to simulate attach)</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest pl-1">Tax Circular Archives</h4>
                  <div className="border border-slate-100 rounded-2xl bg-white overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <th className="p-3 pl-5">Document Name</th>
                          <th className="p-3">Uploaded Date</th>
                          <th className="p-3">File size</th>
                          <th className="p-3 pr-5 text-right font-bold">Uploader</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {taxAttachments.map(file => (
                          <tr key={file.id} className="hover:bg-slate-50/50">
                            <td className="p-3 pl-5 font-bold text-slate-800 flex items-center gap-2">
                              <FileText className="h-4 w-4 text-red-500" />
                              <span>{file.label}</span>
                            </td>
                            <td className="p-3 font-mono text-slate-400">{file.date}</td>
                            <td className="p-3 font-mono text-slate-500">{file.size}</td>
                            <td className="p-3 pr-5 text-right font-bold text-slate-800">{file.uploader}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Income tax policy */}
            {taxSubTab === 'Income tax policy' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 space-y-4">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest">Federal Income Tax Policy Framework</h4>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    Our platform automatically processes progressive tax schedules mapped to state legislation guides, resolving exempt allowances and maximum statutory limits dynamically.
                  </p>
                  <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-2 font-semibold text-slate-700">
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span>Standard Employer Contribution Rate</span>
                      <strong className="text-slate-800">13.00% (CPF Base)</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 py-1.5">
                      <span>Maximum Employee Deduction Cap</span>
                      <strong className="text-slate-800">11.00% standard salary</strong>
                    </div>
                    <div className="flex justify-between pt-1.5">
                      <span>Exempt Threshold Level</span>
                      <strong className="text-slate-800 text-indigo-650">SGD 3,000 / month</strong>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-100 rounded-2xl p-5 bg-white space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest pl-1">Verify Active Policies</h4>
                  <p className="text-slate-400 font-medium">Click to request full local government guideline re-validations.</p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => addToast('Pushed policy check parameters to cloud registry.', 'success')}
                      className="bg-novora hover:bg-opacity-95 text-white font-bold px-4 py-2 rounded-xl cursor-pointer"
                    >
                      Audit Withholding Standards
                    </button>
                    <p className="text-[10px] text-slate-400 mt-2 font-medium">Latest synchronization audit completed: Today, 10:43 UTC</p>
                  </div>
                </div>
              </div>
            )}

            {/* Taxable pays setup */}
            {taxSubTab === 'Taxable pays' && (
              <div className="space-y-4 text-xs font-semibold">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest pl-1">Salary Emolument Components Classification</h4>
                  <button
                    type="button"
                    onClick={() => setIsRegisterEmolumentModalOpen(true)}
                    className="bg-novora hover:bg-opacity-95 text-white font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    + Register Custom Emolument
                  </button>
                </div>

                <div className="border border-slate-100 bg-white rounded-2xl overflow-hidden">
                  <table className="w-full text-left font-semibold">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <th className="p-3 pl-5">Compensation Component Name</th>
                        <th className="p-3">Reference Code</th>
                        <th className="p-3">Exempt Allowance Limit</th>
                        <th className="p-3 pr-5 text-right font-bold">Dynamic Taxable Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {taxableEmoluments.map(emol => (
                        <tr key={emol.id} className="hover:bg-slate-50/50">
                          <td className="p-3 pl-5 font-bold text-slate-800">{emol.componentName}</td>
                          <td className="p-3 font-mono text-novora/90 text-xs">{emol.id}</td>
                          <td className="p-3 italic text-slate-500 font-semibold">{emol.exemptAllowanceLimit}</td>
                          <td className="p-3 pr-5 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setTaxableEmoluments(taxableEmoluments.map(e => e.id === emol.id ? { ...e, taxable: !e.taxable } : e));
                                addToast(`Component ${emol.componentName} updated.`, 'success');
                              }}
                              className={`px-3 py-1 rounded-xl text-[10.5px] font-bold cursor-pointer border ${
                                emol.taxable
                                  ? 'bg-red-50 border-red-100 text-red-700'
                                  : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                              }`}
                            >
                              {emol.taxable ? 'Taxable Gross' : 'Exempt Category'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =======================================================
            PAY MANAGEMENT MAIN TAB CONTENT
            ======================================================= */}
        {activeMainTab === 'Pay management' && (
          <div id="pay-mgmt-view-container" className="space-y-6">
            
            {payMgmtSubTab === 'Payment duration' && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* Left Side: Active Setup */}
                <div className="lg:col-span-2 bg-slate-50/50 border border-slate-100 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest">Payment duration setup</h4>
                    <button
                      title="Edit"
                      onClick={() => setIsEditActiveDurationModalOpen(true)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-novora hover:bg-slate-50 transition-colors cursor-pointer inline-flex items-center justify-center"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                    <div className="flex py-2.5 justify-between">
                      <span className="text-slate-400">Duration name</span>
                      <span className="font-bold text-slate-800">{paymentDuration.name}</span>
                    </div>
                    <div className="flex py-2.5 justify-between">
                      <span className="text-slate-400">Period start</span>
                      <span className="font-bold text-slate-800">{paymentDuration.start}</span>
                    </div>
                    <div className="flex py-2.5 justify-between">
                      <span className="text-slate-400">Period end</span>
                      <span className="font-bold text-slate-800">{paymentDuration.end}</span>
                    </div>
                    <div className="flex py-2.5 justify-between">
                      <span className="text-slate-400">Pay date</span>
                      <span className="font-bold text-slate-800">{paymentDuration.payDate}</span>
                    </div>
                    <div className="flex py-2.5 justify-between">
                      <span className="text-slate-400">1-day basic salary based on</span>
                      <span className="font-bold text-slate-800">{paymentDuration.basis}</span>
                    </div>
                    <div className="flex py-2.5 justify-between">
                      <span className="text-slate-400">Status</span>
                      <span className="bg-blue-50 text-novora px-2 py-0.5 rounded text-[10px] font-bold border border-blue-100">
                        {paymentDuration.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Past payment durations */}
                <div className="lg:col-span-3 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest">Past payment durations</h4>
                    <button
                      onClick={() => setIsCreateDurationModalOpen(true)}
                      className="bg-novora text-white text-xs font-bold px-3.5 py-1.5 rounded-xl cursor-pointer"
                    >
                      + New duration
                    </button>
                  </div>

                  <div className="border border-slate-100 rounded-2xl overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <th className="p-3 pl-5">Duration name</th>
                          <th className="p-3">Start</th>
                          <th className="p-3">End</th>
                          <th className="p-3 pr-5 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {pastDurations.map((p, idx) => {
                          const isCurrent = p.status === 'Current' || p.status === 'Current period';
                          return (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="p-3 pl-5 font-bold text-slate-800">{p.name}</td>
                              <td className="p-3 font-mono text-slate-500">{p.start}</td>
                              <td className="p-3 font-mono text-slate-500">{p.end}</td>
                              <td className="p-3 pr-5 text-right">
                                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold border ${
                                  isCurrent
                                    ? 'bg-blue-50 text-blue-700 border-blue-105'
                                    : 'bg-emerald-50 text-emerald-705 border-emerald-100'
                                }`}>
                                  {p.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* Payroll preparation view */}
            {payMgmtSubTab === 'Payroll preparation' && (
              <div className="space-y-4">
                <div className="flex bg-slate-50 border border-slate-200 p-4 rounded-xl justify-between items-center text-xs">
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-[12px] uppercase tracking-widest">May 2026 Pre-disbursement Checklist</h4>
                    <p className="text-[10.5px] text-slate-500 font-medium">Verify employee data and payment classifications below before performing the final month-end payroll run.</p>
                  </div>
                  <button type="button" onClick={() => addToast('Pushed payroll parameters check to external accounting system.', 'success')} className="bg-novora hover:bg-opacity-95 text-white font-bold py-1.5 px-3 rounded-lg cursor-pointer">
                    Validate Roster
                  </button>
                </div>

                <div className="border border-slate-100 rounded-2xl bg-white overflow-hidden text-xs">
                  <table className="w-full text-left font-semibold">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <th className="p-3 pl-5">Staff Member</th>
                        <th className="p-3">Compliance Taxes</th>
                        <th className="p-3">Banking Routing</th>
                        <th className="p-3 text-center">Approved Claims</th>
                        <th className="p-3 pr-5 text-right font-bold">Preparation Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr className="hover:bg-slate-50/50">
                        <td className="p-3 pl-5 font-bold text-slate-800">Ahmad L</td>
                        <td className="p-3">Standard IRAS / CPF 11%</td>
                        <td className="p-3 font-mono">Maybank ******431</td>
                        <td className="p-3 text-center text-emerald-600 font-extrabold">SGD 120.00</td>
                        <td className="p-3 pr-5 text-right">
                          <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-100">Ready</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="p-3 pl-5 font-bold text-slate-800">Fatimah H</td>
                        <td className="p-3">Standard IRAS / CPF 11%</td>
                        <td className="p-3 font-mono">CIMB Bank ******980</td>
                        <td className="p-3 text-center text-slate-400 italic">None</td>
                        <td className="p-3 pr-5 text-right">
                          <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-100">Ready</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="p-3 pl-5 font-bold text-slate-800">Johnathan D</td>
                        <td className="p-3">Standard IRAS / CPF 11%</td>
                        <td className="p-3 font-mono">Public Bank ******103</td>
                        <td className="p-3 text-center text-emerald-600 font-extrabold">SGD 340.00</td>
                        <td className="p-3 pr-5 text-right">
                          <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-100">Needs Audit</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Payroll run process view */}
            {payMgmtSubTab === 'Payroll run' && (
              <div className="space-y-6 text-xs max-w-xl mx-auto border border-slate-200 bg-white p-6 rounded-3xl">
                <div className="text-center space-y-2">
                  <Calculator className="h-10 w-10 text-blue-600 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Execute May 2026 Month-End Run</h4>
                  <p className="text-slate-500 max-w-sm mx-auto font-medium lead-relaxed">
                    Once executed, this action lock monthly calculations parameters, record progressive taxing logs, and disburse digital payslips to active employees.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl space-y-3 font-semibold text-slate-700">
                  <div className="flex justify-between border-b border-gutter pb-2">
                    <span>Target Headcount</span>
                    <strong className="text-slate-800">{payrollSummary?.headcount ?? employees.length} Active Staff</strong>
                  </div>
                  <div className="flex justify-between border-b border-gutter py-2">
                    <span>Estimated Net Payroll</span>
                    <strong className="text-slate-900 font-mono">SGD {(payrollSummary ? Number(payrollSummary.totalNetPay) : grandTotalGross).toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span>Draft / Processed / Paid</span>
                    <strong className="text-slate-700 font-mono">{payrollSummary ? `${payrollSummary.draftCount}/${payrollSummary.processedCount}/${payrollSummary.paidCount}` : '—'} · rows {payrollRows.length}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={aiPayrollBusy}
                  onClick={() => {
                    void (async () => {
                      setAiPayrollBusy(true)
                      addToast('Scanning payroll for QA notes…', 'loading')
                      try {
                        const result = await fetchPayrollAiAnomalies({
                          payMonth,
                          payYear,
                          headcount: payrollSummary?.headcount ?? employees.length,
                          totalNetPay: String(payrollSummary ? Number(payrollSummary.totalNetPay) : grandTotalGross),
                          draftCount: payrollSummary?.draftCount ?? null,
                          processedCount: payrollSummary?.processedCount ?? null,
                          paidCount: payrollSummary?.paidCount ?? null,
                          rowCount: payrollRows.length,
                          sampleRows: payrollRows.slice(0, 8).map(
                            (r) => `${r.employeeName}: net ${r.netPay} (${r.status})`,
                          ),
                        })
                        setPayrollAi(result)
                        addToast(
                          result.source === 'gemini' ? 'AI payroll QA ready — review only.' : 'Heuristic payroll QA ready.',
                          'success',
                        )
                      } catch (err) {
                        addToast(err instanceof ApiError ? err.message : 'Could not run payroll AI QA.', 'error')
                      } finally {
                        setAiPayrollBusy(false)
                      }
                    })()
                  }}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-2xl border border-novora/25 bg-novora/5 py-3 text-xs font-extrabold text-novora hover:bg-novora/10 disabled:opacity-60 cursor-pointer"
                >
                  <Sparkles className={`h-3.5 w-3.5 ${aiPayrollBusy ? 'animate-spin' : ''}`} />
                  {aiPayrollBusy ? 'Scanning…' : 'AI Payroll QA'}
                </button>

                {payrollAi && (
                  <div className="nv-ai-panel rounded-2xl border border-novora/20 bg-novora/5 p-4 space-y-2 text-left">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h5 className="text-xs font-bold text-slate-800 inline-flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-novora" />
                          AI payroll QA
                        </h5>
                        <p className="text-[10px] text-slate-400 mt-0.5">{payrollAi.disclaimer}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPayrollAi(null)}
                        className="text-[10px] font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">{payrollAi.summary}</p>
                    <ul className="space-y-1">
                      {payrollAi.findings.map((f) => (
                        <li key={f} className="text-xs text-slate-700 flex gap-1.5">
                          <span className="text-novora mt-0.5">•</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  type="button"
                  disabled={payrollBusy}
                  onClick={() => void triggerPayrollRun()}
                  className="w-full bg-novora hover:bg-opacity-95 text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-xs transition-transform cursor-pointer disabled:opacity-60"
                >
                  {payrollBusy ? 'Running payroll…' : `Confirm & Execute Payroll (${payMonth}/${payYear})`}
                </button>
              </div>
            )}

            {/* Payroll run history view */}
            {payMgmtSubTab === 'Payroll history' && (
              <div className="space-y-4 text-xs font-semibold">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest pl-1">Historic Completed Disbursements</h4>
                {myPayslips.length > 0 && (
                  <p className="text-[11px] text-slate-500 pl-1">
                    Your payslips on file: <strong className="text-slate-700">{myPayslips.length}</strong>
                  </p>
                )}
                <div className="border border-slate-100 rounded-2xl bg-white overflow-hidden text-xs">
                  <table className="w-full text-left font-semibold">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <th className="p-3 pl-5">Billing Period</th>
                        <th className="p-3">Employee</th>
                        <th className="p-3 font-mono">Net Pay</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 pr-5 text-right font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {(payrollRows.length ? payrollRows : myPayslips).slice(0, 20).map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/50">
                          <td className="p-3 pl-5 font-bold text-slate-800">
                            {row.payMonth}/{row.payYear}
                          </td>
                          <td className="p-3">{row.employeeName}</td>
                          <td className="p-3 font-mono font-bold text-slate-900">
                            SGD {Number(row.netPay).toLocaleString()}
                          </td>
                          <td className="p-3 uppercase text-[10px] font-extrabold">{row.status}</td>
                          <td className="p-3 pr-5 text-right">
                            <button
                              type="button"
                              onClick={() => addToast(`Payslip ${row.payMonth}/${row.payYear} for ${row.employeeName}`, 'info')}
                              className="text-novora hover:underline cursor-pointer"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                      {payrollRows.length === 0 && myPayslips.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-slate-400">
                            No payroll history yet. Generate a month run to populate this list.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* =======================================================
            PAYROLL REPORTS TAB CONTENT
            ======================================================= */}
        {activeMainTab === 'Payroll reports' && (() => {
          return (
            <div id="payroll-reports-dashboard" className="space-y-6 animate-in fade-in duration-150">
              
              {/* 1. Statistics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 nv-stagger">
                
                <div className="nv-card p-4 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gross Payout</span>
                    <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">SGD {grandTotalGross.toLocaleString()}</h3>
                    <span className="text-[9px] font-bold text-indigo-500 bg-indigo-55/60 px-2 py-0.5 rounded-md border border-indigo-110">Basic + Allowance + OT</span>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-105 flex items-center justify-center">
                    <Coins className="h-5 w-5 text-novora" />
                  </div>
                </div>

                <div className="nv-card p-4 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Net Disbursements</span>
                    <h3 className="text-xl font-extrabold text-emerald-600 tracking-tight">SGD {grandTotalNet.toLocaleString()}</h3>
                    <span className="text-[9px] font-bold text-emerald-500 bg-emerald-55/60 px-2 py-0.5 rounded-md border border-emerald-100">Transferred basic sum</span>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    <UserCheck className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>

                <div className="nv-card p-4 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Withholding &amp; Taxes</span>
                    <h3 className="text-xl font-extrabold text-rose-600 tracking-tight">SGD {grandTotalDeductions.toLocaleString()}</h3>
                    <span className="text-[9px] font-bold text-rose-500 bg-rose-55/60 px-2 py-0.5 rounded-md border border-rose-110">CPF + CDAC + IRAS</span>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center">
                    <Percent className="h-5 w-5 text-rose-500" />
                  </div>
                </div>

                <div className="nv-card p-4 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg Paycheck</span>
                    <h3 className="text-xl font-extrabold text-indigo-600 tracking-tight">SGD {avgNetPay.toLocaleString()}</h3>
                    <span className="text-[9px] font-bold text-indigo-500 bg-indigo-55/60 px-2 py-0.5 rounded-md border border-indigo-110">Average salary net</span>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-indigo-500" />
                  </div>
                </div>

              </div>

              {/* 2. Department Compliance Table / Scorecard */}
              <div className="nv-card p-5 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 tracking-tight flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-novora" />
                    <span>Departmental Budget &amp; Payroll Cost Allocation Matrix</span>
                  </h4>
                  <p className="text-[10.5px] font-semibold text-slate-400 mt-0.5">Aggregate gross payouts, average basics, total deductions, and budget metrics by business division</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[700px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <th className="p-3 pl-4">Department Unit</th>
                        <th className="p-3">Staff headcount</th>
                        <th className="p-3 text-center">Avg Basic Wage</th>
                        <th className="p-3 text-center">Withholdings</th>
                        <th className="p-3 text-center">Total Gross Paid</th>
                        <th className="p-3 text-center">Total Net Paid</th>
                        <th className="p-3 pr-4 text-right">Budget Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {deptMatrix.map((dept) => {
                        const isAlert = dept.budgetCompliance === 'Review Needed';
                        return (
                          <tr key={dept.name} className="hover:bg-slate-50/40">
                            <td className="p-3 pl-4 font-bold text-slate-800">{dept.name}</td>
                            <td className="p-3 text-slate-500">{dept.headcount} staff</td>
                            <td className="p-3 text-center font-mono font-bold">SGD {dept.avgBasic.toLocaleString()}</td>
                            <td className="p-3 text-center font-mono text-rose-500">SGD {dept.totalDeducts.toLocaleString()}</td>
                            <td className="p-3 text-center font-mono text-slate-800 font-extrabold">SGD {dept.totalGross.toLocaleString()}</td>
                            <td className="p-3 text-center font-mono text-emerald-600 font-extrabold">SGD {dept.totalNet.toLocaleString()}</td>
                            <td className="p-3 pr-4 text-right">
                              <span className={`border px-2.5 py-0.5 rounded-md font-extrabold text-[10px] ${
                                isAlert
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              }`}>
                                {dept.budgetCompliance}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 3. Filter controls & Employee Ledger Search */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search employee ledger..."
                      value={reportsSearch}
                      onChange={(e) => setReportsSearch(e.target.value)}
                      className="bg-white border border-slate-200 text-xs font-semibold pl-9 pr-4 py-2 w-48 rounded-xl focus:outline-none"
                    />
                  </div>

                  <SelectMenu
                    value={reportsDept}
                    onChange={setReportsDept}
                    aria-label="Department filter"
                    className="w-auto shrink-0"
                    triggerClassName="nv-select-trigger--toolbar min-w-[9rem]"
                    options={[
                      { value: 'All departments', label: 'All departments' },
                      { value: 'Engineering', label: 'Engineering' },
                      { value: 'Finance', label: 'Finance' },
                      { value: 'HR', label: 'HR' },
                      { value: 'Marketing', label: 'Marketing' },
                      { value: 'Operations', label: 'Operations' },
                    ]}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 bg-white border px-2 py-0.5 rounded text-right shrink-0">
                    Showing {filteredLedger.length} of {employees.length} entries
                  </span>
                  <button
                    onClick={() => {
                      addToast('Compiling custom breakdown report values...', 'loading');
                      setTimeout(() => {
                        addToast('Downloaded employee ledger dataset successfully.', 'success');
                      }, 1200);
                    }}
                    className="h-9 inline-flex items-center gap-1.5 px-3.5 text-xs font-bold text-white bg-novora hover:bg-opacity-95 rounded-xl transition-all shadow-tiny cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5" />
                    <span>Download Ledger</span>
                  </button>
                </div>
              </div>

              {/* 4. Employee Detailed ledger table */}
              <div className="border border-slate-100 rounded-2xl overflow-x-auto bg-white">
                <table className="w-full text-left text-xs min-w-[850px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <th className="p-3 pl-5">Employee Name</th>
                      <th className="p-3 text-center">Basic Salary</th>
                      <th className="p-3 text-center">Allowance sum</th>
                      <th className="p-3 text-center">OT Payout</th>
                      <th className="p-3 text-center font-bold text-slate-800">Gross Salary</th>
                      <th className="p-3 text-center text-red-500">CPF (Employee)</th>
                      <th className="p-3 text-center text-red-500">MediSave &amp; IRAS</th>
                      <th className="p-3 text-center font-bold text-slate-800">Total Deductions</th>
                      <th className="p-3 pr-5 text-right font-extrabold text-emerald-700">Net Paid Salary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredLedger.map((row) => (
                      <tr key={row.employee.id} className="hover:bg-slate-50/40">
                        <td className="p-3 pl-5">
                          <span className="font-bold text-slate-800 block">{row.employee.name}</span>
                          <span className="text-[9.5px] font-mono text-slate-400 block mt-0.5">{row.employee.id} &bull; {row.employee.department}</span>
                        </td>
                        <td className="p-3 text-center font-mono font-semibold">SGD {row.baseSalary.toLocaleString()}</td>
                        <td className="p-3 text-center font-mono text-indigo-500">+SGD {row.allowanceVal}</td>
                        <td className="p-3 text-center font-mono text-indigo-500">+SGD {row.otVal}</td>
                        <td className="p-3 text-center font-mono font-bold text-slate-800 bg-slate-50/30">SGD {row.grossVal.toLocaleString()}</td>
                        <td className="p-3 text-center font-mono text-rose-500">-SGD {row.epf}</td>
                        <td className="p-3 text-center font-mono text-rose-500">-SGD {row.socso + row.pcb}</td>
                        <td className="p-3 text-center font-mono font-semibold text-rose-600 bg-rose-50/10">SGD {row.totalDeductions}</td>
                        <td className="p-3 pr-5 text-right font-mono font-extrabold text-emerald-600 bg-emerald-50/10">SGD {row.netSalary.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          );
        })()}

      </div>


      {/* ===== 5. SIMULATION DIALOG OVERLAY MODE ===== */}
      {isSimulatingRun && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-2xl max-w-md w-full space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center text-novora shrink-0 animate-spin">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Finalising Month-End Wages Roster</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider">Novora Engine v3.2</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Compilation Roster Status</span>
                <span>{simProgress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-lg overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-novora transition-all duration-300 rounded-lg"
                  style={{ width: `${simProgress}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs font-mono space-y-2 max-h-48 overflow-y-auto">
              <div className="text-slate-400">&gt;_ Initialising monthly pay sequence...</div>
              {simStep >= 1 && (
                <div className="text-indigo-600 font-semibold flex items-center gap-1.5">
                  <CheckCircle className="h-3 w-3 shrink-0" />
                  <span>Verified employee attendance locks: OK</span>
                </div>
              )}
              {simStep >= 2 && (
                <div className="text-indigo-600 font-semibold flex items-center gap-1.5">
                  <CheckCircle className="h-3 w-3 shrink-0" />
                  <span>Basic salary fractions scaled to hours: CALC</span>
                </div>
              )}
              {simStep >= 3 && (
                <div className="text-indigo-600 font-semibold flex items-center gap-1.5">
                  <CheckCircle className="h-3 w-3 shrink-0" />
                  <span>Government brackets &amp; CPF schedules locked: OK</span>
                </div>
              )}
              {simStep >= 4 && (
                <div className="text-emerald-700 font-bold flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                  <span>Salary disbursement ledger compiled!</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={closePayrollRunSim}
                disabled={!runSuccessful}
                className="flex-1 bg-novora hover:bg-opacity-95 text-white disabled:opacity-50 text-xs font-extrabold py-2.5 rounded-xl cursor-pointer"
              >
                {runSuccessful ? 'Complete & Close' : 'Processing Ledger...'}
              </button>
            </div>

          </div>
        </div>
      )}


      {/* ===== 6. COMPACT DIALOG / MODAL FORM SYSTEM ===== */}
      
      {/* 6a. ALLOWANCE CREATE MODAL */}
      {allowanceModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleAddNewAllowance} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl max-w-sm w-full space-y-4 font-sans animate-in zoom-in-95 duration-150">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest border-b pb-2">New Allowance Policy</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Allowance label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Health Allowance"
                  value={newAllowanceName}
                  onChange={(e) => setNewAllowanceName(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category type</label>
                <SelectMenu
                  value={newAllowancePolicy}
                  onChange={setNewAllowancePolicy}
                  triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                  options={[
                    { value: 'Normal', label: 'Normal' },
                    { value: 'Transport', label: 'Transport' },
                    { value: 'Meal', label: 'Meal' },
                    { value: 'Shift', label: 'Shift' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Proposed Value (SGD)</label>
                <input
                  type="text"
                  placeholder="e.g. 150.00"
                  value={newAllowanceAmount}
                  onChange={(e) => setNewAllowanceAmount(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Government Taxable</label>
                <SelectMenu
                  value={newAllowanceTaxable}
                  onChange={(v) => setNewAllowanceTaxable(v as 'Yes'|'No')}
                  triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                  options={[
                    { value: 'No', label: 'No (Exempted)' },
                    { value: 'Yes', label: 'Yes (Witholding)' },
                  ]}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAllowanceModalOpen(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-novora hover:bg-opacity-95 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                Register Policy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 6b. BONUS CREATE MODAL */}
      {bonusModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleAddNewBonus} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl max-w-sm w-full space-y-4 font-sans animate-in zoom-in-95 duration-150">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest border-b pb-2">New Bonus Policy</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Bonus label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Festival Performance"
                  value={newBonusName}
                  onChange={(e) => setNewBonusName(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category type</label>
                <SelectMenu
                  value={newBonusPolicy}
                  onChange={setNewBonusPolicy}
                  triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                  options={[
                    { value: 'Normal', label: 'Normal' },
                    { value: 'Working service', label: 'Working service' },
                    { value: 'LTIP', label: 'LTIP' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Payment Month</label>
                <input
                  type="text"
                  placeholder="e.g. December"
                  value={newBonusPayMonth}
                  onChange={(e) => setNewBonusPayMonth(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Basis algorithm</label>
                <input
                  type="text"
                  placeholder="e.g. Fixed amount"
                  value={newBonusBasedOn}
                  onChange={(e) => setNewBonusBasedOn(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-semibold"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setBonusModalOpen(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-novora hover:bg-opacity-95 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                Register Bonus
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 6c. DEPOSIT CREATE MODAL */}
      {depositModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleAddNewDeposit} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl max-w-sm w-full space-y-4 font-sans animate-in zoom-in-95 duration-150">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest border-b pb-2">New Security Deposit Type</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Deposit Asset Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Key badge Deposit"
                  value={newDepositName}
                  onChange={(e) => setNewDepositName(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">State System Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KEY"
                  value={newDepositCode}
                  onChange={(e) => setNewDepositCode(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Amount basis</label>
                <input
                  type="text"
                  placeholder="e.g. Fixed SGD 150"
                  value={newDepositBasis}
                  onChange={(e) => setNewDepositBasis(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-semibold"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDepositModalOpen(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-novora hover:bg-opacity-95 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                File Entry
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 6d. DEDUCTION CREATE MODAL */}
      {deductionModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleAddNewDeduction} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl max-w-sm w-full space-y-4 font-sans animate-in zoom-in-95 duration-150">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest border-b pb-2">New Custom Deduction Policy</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Deduction label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Parking Permit Fee"
                  value={newDeductionName}
                  onChange={(e) => setNewDeductionName(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Deduction category</label>
                <SelectMenu
                  value={newDeductionType}
                  onChange={setNewDeductionType}
                  triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                  options={[
                    { value: 'Statutory', label: 'Statutory' },
                    { value: 'Tax', label: 'Tax' },
                    { value: 'Rota rule', label: 'Rota rule' },
                    { value: 'Attendance', label: 'Attendance' },
                    { value: 'Leave', label: 'Leave' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tariff / Value Rate</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SGD 50.00/month"
                  value={newDeductionRate}
                  onChange={(e) => setNewDeductionRate(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-semibold"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeductionModalOpen(false)}
                className="flex-1 bg-slate-100 text-slate-700 text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-novora hover:bg-opacity-95 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                Register Deduction
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 6e. TAX CREATE MODAL */}
      {taxModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleAddNewTax} className="bg-white border border-[#eaeaea] rounded-3xl p-6 shadow-xl max-w-sm w-full space-y-4 font-sans animate-in zoom-in-95 duration-150">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest border-b pb-2">New Tax Witholding Category</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tax Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HRDF Levy"
                  value={newTaxName}
                  onChange={(e) => setNewTaxName(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Standard Filing Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HRDF"
                  value={newTaxCode}
                  onChange={(e) => setNewTaxCode(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Calculate On</label>
                <SelectMenu
                  value={newTaxOn}
                  onChange={setNewTaxOn}
                  triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                  options={[
                    { value: 'Monthly salary', label: 'Monthly salary' },
                    { value: 'Basic salary', label: 'Basic salary' },
                    { value: 'Overall emoluments', label: 'Overall emoluments' },
                  ]}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setTaxModalOpen(false)}
                className="flex-1 bg-slate-100 text-slate-700 text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-novora hover:bg-opacity-95 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                Register Schema
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 7a. ALLOWANCE EDIT MODAL */}
      {editingAllowance && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleEditAllowance} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl max-w-sm w-full space-y-4 font-sans animate-in zoom-in-95 duration-150">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest border-b pb-2">Edit Allowance Policy</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Allowance label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Health Allowance"
                  value={editingAllowance.name}
                  onChange={(e) => setEditingAllowance({ ...editingAllowance, name: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category type</label>
                <SelectMenu
                  value={editingAllowance.policyType}
                  onChange={(v) => setEditingAllowance({ ...editingAllowance, policyType: v })}
                  triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                  options={[
                    { value: 'Normal', label: 'Normal' },
                    { value: 'Transport', label: 'Transport' },
                    { value: 'Meal', label: 'Meal' },
                    { value: 'Shift', label: 'Shift' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Proposed Value (SGD)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 150.00"
                  value={editingAllowance.amount}
                  onChange={(e) => setEditingAllowance({ ...editingAllowance, amount: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Government Taxable</label>
                <SelectMenu
                  value={editingAllowance.taxable}
                  onChange={(v) => setEditingAllowance({ ...editingAllowance, taxable: v as 'Yes' | 'No' })}
                  triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                  options={[
                    { value: 'No', label: 'No (Exempted)' },
                    { value: 'Yes', label: 'Yes (Withholding)' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</label>
                <SelectMenu
                  value={editingAllowance.status}
                  onChange={(v) => setEditingAllowance({ ...editingAllowance, status: v as 'Active' | 'Inactive' })}
                  triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                  options={[
                    { value: 'Active', label: 'Active' },
                    { value: 'Inactive', label: 'Inactive' },
                  ]}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingAllowance(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-novora hover:bg-opacity-95 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 7b. BONUS EDIT MODAL */}
      {editingBonus && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleEditBonus} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl max-w-sm w-full space-y-4 font-sans animate-in zoom-in-95 duration-150">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest border-b pb-2">Edit Bonus Policy</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Bonus label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Festival Performance"
                  value={editingBonus.name}
                  onChange={(e) => setEditingBonus({ ...editingBonus, name: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Category type</label>
                <SelectMenu
                  value={editingBonus.policyType}
                  onChange={(v) => setEditingBonus({ ...editingBonus, policyType: v })}
                  triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                  options={[
                    { value: 'Normal', label: 'Normal' },
                    { value: 'Working service', label: 'Working service' },
                    { value: 'LTIP', label: 'LTIP' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Payment Month</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. December"
                  value={editingBonus.payMonth}
                  onChange={(e) => setEditingBonus({ ...editingBonus, payMonth: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Basis algorithm</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fixed amount"
                  value={editingBonus.basedOn}
                  onChange={(e) => setEditingBonus({ ...editingBonus, basedOn: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Show on Payslip</label>
                <SelectMenu
                  value={editingBonus.onPayslip}
                  onChange={(v) => setEditingBonus({ ...editingBonus, onPayslip: v as 'Yes' | 'No' })}
                  triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                  options={[
                    { value: 'Yes', label: 'Yes' },
                    { value: 'No', label: 'No' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</label>
                <SelectMenu
                  value={editingBonus.status}
                  onChange={(v) => setEditingBonus({ ...editingBonus, status: v as 'Active' | 'Inactive' })}
                  triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                  options={[
                    { value: 'Active', label: 'Active' },
                    { value: 'Inactive', label: 'Inactive' },
                  ]}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingBonus(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-novora hover:bg-opacity-95 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 7c. DEPOSIT EDIT MODAL */}
      {editingDeposit && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleEditDeposit} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl max-w-sm w-full space-y-4 font-sans animate-in zoom-in-95 duration-150">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest border-b pb-2">Edit Security Deposit Type</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Deposit Asset Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Key badge Deposit"
                  value={editingDeposit.name}
                  onChange={(e) => setEditingDeposit({ ...editingDeposit, name: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">State System Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KEY"
                  value={editingDeposit.code}
                  onChange={(e) => setEditingDeposit({ ...editingDeposit, code: e.target.value.toUpperCase() })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-mono font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Amount basis</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fixed SGD 150"
                  value={editingDeposit.amountBasis}
                  onChange={(e) => setEditingDeposit({ ...editingDeposit, amountBasis: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Employment Status Scope</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. All staff"
                  value={editingDeposit.employmentStatus}
                  onChange={(e) => setEditingDeposit({ ...editingDeposit, employmentStatus: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Refund Month Timing</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. On resign"
                  value={editingDeposit.reimburseMonth}
                  onChange={(e) => setEditingDeposit({ ...editingDeposit, reimburseMonth: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</label>
                <SelectMenu
                  value={editingDeposit.status}
                  onChange={(v) => setEditingDeposit({ ...editingDeposit, status: v as 'Active' | 'Inactive' })}
                  triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                  options={[
                    { value: 'Active', label: 'Active' },
                    { value: 'Inactive', label: 'Inactive' },
                  ]}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingDeposit(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-novora hover:bg-opacity-95 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 7d. DEDUCTION EDIT MODAL */}
      {editingDeduction && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleEditDeduction} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl max-w-sm w-full space-y-4 font-sans animate-in zoom-in-95 duration-150">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest border-b pb-2">Edit Custom Deduction Policy</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Deduction label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Parking Permit Fee"
                  value={editingDeduction.name}
                  onChange={(e) => setEditingDeduction({ ...editingDeduction, name: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Deduction category</label>
                <SelectMenu
                  value={editingDeduction.type}
                  onChange={(v) => setEditingDeduction({ ...editingDeduction, type: v })}
                  triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                  options={[
                    { value: 'Statutory', label: 'Statutory' },
                    { value: 'Tax', label: 'Tax' },
                    { value: 'Rota rule', label: 'Rota rule' },
                    { value: 'Attendance', label: 'Attendance' },
                    { value: 'Leave', label: 'Leave' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tariff / Value Rate</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SGD 50.00/month"
                  value={editingDeduction.amountRate}
                  onChange={(e) => setEditingDeduction({ ...editingDeduction, amountRate: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Show on Payslip</label>
                <SelectMenu
                  value={editingDeduction.onPayslip}
                  onChange={(v) => setEditingDeduction({ ...editingDeduction, onPayslip: v as 'Yes' | 'No' })}
                  triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                  options={[
                    { value: 'Yes', label: 'Yes' },
                    { value: 'No', label: 'No' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</label>
                <SelectMenu
                  value={editingDeduction.status}
                  onChange={(v) => setEditingDeduction({ ...editingDeduction, status: v as 'Active' | 'Inactive' })}
                  triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                  options={[
                    { value: 'Active', label: 'Active' },
                    { value: 'Inactive', label: 'Inactive' },
                  ]}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingDeduction(null)}
                className="flex-1 bg-slate-100 text-slate-700 text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-novora hover:bg-opacity-95 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 7e. TAX EDIT MODAL */}
      {editingTax && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleEditTax} className="bg-white border border-[#eaeaea] rounded-3xl p-6 shadow-xl max-w-sm w-full space-y-4 font-sans animate-in zoom-in-95 duration-150">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest border-b pb-2">Edit Tax Withholding Category</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tax Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HRDF Levy"
                  value={editingTax.name}
                  onChange={(e) => setEditingTax({ ...editingTax, name: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Standard Filing Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HRDF"
                  value={editingTax.code}
                  onChange={(e) => setEditingTax({ ...editingTax, code: e.target.value.toUpperCase() })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-mono font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Calculate On</label>
                <SelectMenu
                  value={editingTax.calculateOn}
                  onChange={(v) => setEditingTax({ ...editingTax, calculateOn: v })}
                  triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                  options={[
                    { value: 'Monthly salary', label: 'Monthly salary' },
                    { value: 'Basic salary', label: 'Basic salary' },
                    { value: 'Overall emoluments', label: 'Overall emoluments' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Calculate Overall Income</label>
                <SelectMenu
                  value={editingTax.calcOverallIncome}
                  onChange={(v) => setEditingTax({ ...editingTax, calcOverallIncome: v as 'Yes' | 'No' })}
                  triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                  options={[
                    { value: 'Yes', label: 'Yes' },
                    { value: 'No', label: 'No' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</label>
                <SelectMenu
                  value={editingTax.status}
                  onChange={(v) => setEditingTax({ ...editingTax, status: v as 'Active' | 'Inactive' })}
                  triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                  options={[
                    { value: 'Active', label: 'Active' },
                    { value: 'Inactive', label: 'Inactive' },
                  ]}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingTax(null)}
                className="flex-1 bg-slate-100 text-slate-700 text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-novora hover:bg-opacity-95 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 8a. COMMIT APPROVED ALLOWANCES MODAL */}
      {isCommitAllowancesModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl max-w-sm w-full space-y-4 font-sans animate-in zoom-in-95 duration-150">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest border-b pb-2">Commit Approved Allowances</h3>
            
            <p className="text-slate-600 text-xs leading-relaxed font-semibold">
              You are about to lock and commit all transport, meal, and special bonus allowances to the active month's payslips. This action is final and will freeze further edits for this cycle.
            </p>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between text-slate-500 font-semibold">
                <span>Active Target Roster</span>
                <span className="font-bold text-slate-800">435 Employees</span>
              </div>
              <div className="flex justify-between text-slate-500 font-semibold">
                <span>Approved Transport Allowance</span>
                <span className="font-bold text-slate-800">SGD 18,250.00</span>
              </div>
              <div className="flex justify-between text-slate-500 font-semibold">
                <span>Approved Meal Allowance</span>
                <span className="font-bold text-slate-800">SGD 12,400.00</span>
              </div>
              <div className="flex justify-between text-slate-500 border-t border-slate-200 pt-2 font-bold text-slate-800">
                <span>Grand Committed Total</span>
                <span className="text-novora">SGD 30,650.00</span>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Select Clearing Bank Fund</label>
                <select className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-bold cursor-pointer text-slate-800">
                  <option value="corp-maybank">Maybank Corporate Account - ******431</option>
                  <option value="corp-cimb">CIMB Principal Treasury - ******980</option>
                  <option value="corp-rhb">RHB Operating Reserves - ******102</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCommitAllowancesModalOpen(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCommitAllowancesModalOpen(false);
                  addToast('Committed all approved allowances to monthly payroll pay slips. Bank lock established.', 'success');
                }}
                className="flex-1 bg-novora hover:bg-opacity-95 text-white text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer"
              >
                Confirm Commit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8b. EDIT OT POLICY MODAL */}
      {isEditOtPolicyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={(e) => {
            e.preventDefault();
            setIsEditOtPolicyModalOpen(false);
            addToast('Statutory overtime parameters updated successfully.', 'success');
          }} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl max-w-sm w-full space-y-4 font-sans animate-in zoom-in-95 duration-150">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest border-b pb-2">Edit OT Policy Settings</h3>
            
            <div className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Weekday OT rate</label>
                <input
                  type="text"
                  required
                  value={otPolicySettings.weekdayOtRate}
                  onChange={(e) => setOtPolicySettings({ ...otPolicySettings, weekdayOtRate: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white text-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Weekend OT rate</label>
                <input
                  type="text"
                  required
                  value={otPolicySettings.weekendOtRate}
                  onChange={(e) => setOtPolicySettings({ ...otPolicySettings, weekendOtRate: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white text-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Public holiday OT</label>
                <input
                  type="text"
                  required
                  value={otPolicySettings.holidayOtRate}
                  onChange={(e) => setOtPolicySettings({ ...otPolicySettings, holidayOtRate: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white text-slate-800 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Calculate by</label>
                  <SelectMenu
                    value={otPolicySettings.calculateBy}
                    onChange={(v) => setOtPolicySettings({ ...otPolicySettings, calculateBy: v })}
                    triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                    options={[
                      { value: 'Per minute rate', label: 'Per minute rate' },
                      { value: 'Per half hour', label: 'Per half hour' },
                      { value: 'Per hour block', label: 'Per hour block' },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Rounding block</label>
                  <input
                    type="text"
                    required
                    value={otPolicySettings.roundingBlock}
                    onChange={(e) => setOtPolicySettings({ ...otPolicySettings, roundingBlock: e.target.value })}
                    className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Min threshold</label>
                  <input
                    type="text"
                    required
                    value={otPolicySettings.minOtThreshold}
                    onChange={(e) => setOtPolicySettings({ ...otPolicySettings, minOtThreshold: e.target.value })}
                    className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Max OT per day</label>
                  <input
                    type="text"
                    required
                    value={otPolicySettings.maxOtPerDay}
                    onChange={(e) => setOtPolicySettings({ ...otPolicySettings, maxOtPerDay: e.target.value })}
                    className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditOtPolicyModalOpen(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-novora hover:bg-opacity-95 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                Save Setup
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 8c. ATTACH OT POLICY MODAL */}
      {isAttachOtModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!newOtStaffName) {
              addToast('Please enter an employee name', 'error');
              return;
            }
            const n = {
              id: createLocalId('EMP'),
              name: newOtStaffName,
              department: newOtStaffDept,
              policyType: newOtStaffPolicy,
              status: 'Active' as const
            };
            setOtAttachedStaff([...otAttachedStaff, n]);
            setIsAttachOtModalOpen(false);
            setNewOtStaffName('');
            addToast(`${newOtStaffName} attached to ${newOtStaffPolicy} overtime standard.`, 'success');
          }} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl max-w-sm w-full space-y-4 font-sans animate-in zoom-in-95 duration-150">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest border-b pb-2">Attach Overtime Policy</h3>
            
            <div className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Select / Write Employee</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rachel Green"
                  value={newOtStaffName}
                  onChange={(e) => setNewOtStaffName(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Department</label>
                <SelectMenu
                  value={newOtStaffDept}
                  onChange={setNewOtStaffDept}
                  triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                  options={[
                    { value: 'Engineering', label: 'Engineering' },
                    { value: 'Operations', label: 'Operations' },
                    { value: 'Logistics', label: 'Logistics' },
                    { value: 'Sales & Finance', label: 'Sales & Finance' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Policy Type</label>
                <SelectMenu
                  value={newOtStaffPolicy}
                  onChange={setNewOtStaffPolicy}
                  triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                  options={[
                    { value: 'Salary-based', label: 'Salary-based' },
                    { value: 'Hourly override', label: 'Hourly override' },
                    { value: 'Fixed amount', label: 'Fixed amount' },
                    { value: 'Exempted', label: 'Exempted' },
                  ]}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAttachOtModalOpen(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-novora hover:bg-opacity-95 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                Attach
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 8d. EDIT SPECIFIC OT OVERRIDE MODAL */}
      {editingOtOverride && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={(e) => {
            e.preventDefault();
            setOtOverrides(otOverrides.map(o => o.id === editingOtOverride.id ? editingOtOverride : o));
            setEditingOtOverride(null);
            addToast(`Successfully updated specific OT standard for ${editingOtOverride.deptScope}.`, 'success');
          }} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl max-w-sm w-full space-y-4 font-sans animate-in zoom-in-95 duration-150">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest border-b pb-2">Edit Specific OT Setup</h3>
            
            <div className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Department Scope</label>
                <input
                  type="text"
                  required
                  value={editingOtOverride.deptScope}
                  onChange={(e) => setEditingOtOverride({ ...editingOtOverride, deptScope: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white text-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Standard Multiplier</label>
                <input
                  type="text"
                  required
                  value={editingOtOverride.multiplier}
                  onChange={(e) => setEditingOtOverride({ ...editingOtOverride, multiplier: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-mono text-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Special Weekend Coefficient</label>
                <input
                  type="text"
                  required
                  value={editingOtOverride.weekendCoefficient}
                  onChange={(e) => setEditingOtOverride({ ...editingOtOverride, weekendCoefficient: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-mono text-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Condition Description</label>
                <input
                  type="text"
                  required
                  value={editingOtOverride.condition}
                  onChange={(e) => setEditingOtOverride({ ...editingOtOverride, condition: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white text-slate-800 font-semibold"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingOtOverride(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-novora hover:bg-opacity-95 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 8e. EDIT MANUAL DEDUCTION MODAL */}
      {editingManualDeduction && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={(e) => {
            e.preventDefault();
            setManualDeductions(manualDeductions.map(m => m.id === editingManualDeduction.id ? editingManualDeduction : m));
            setEditingManualDeduction(null);
            addToast(`Deduction for ${editingManualDeduction.empName} updated.`, 'success');
          }} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl max-w-sm w-full space-y-4 font-sans animate-in zoom-in-95 duration-150">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest border-b pb-2">Edit Manual Deduction</h3>
            
            <div className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Employee Name</label>
                <input
                  type="text"
                  required
                  disabled
                  value={editingManualDeduction.empName}
                  className="bg-slate-100 border border-slate-200 text-xs p-2.5 rounded-xl w-full text-slate-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Deducted Amount (SGD)</label>
                <input
                  type="number"
                  required
                  value={editingManualDeduction.amount}
                  onChange={(e) => setEditingManualDeduction({ ...editingManualDeduction, amount: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white text-slate-800 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Withholding Justification</label>
                <input
                  type="text"
                  required
                  value={editingManualDeduction.reason}
                  onChange={(e) => setEditingManualDeduction({ ...editingManualDeduction, reason: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white text-slate-800 font-semibold"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingManualDeduction(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-novora hover:bg-opacity-95 text-white text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 8f. REGISTER CUSTOM EMOLUMENT MODAL */}
      {isRegisterEmolumentModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!newEmolName) {
              addToast('Enter compensation component name.', 'error');
              return;
            }
            setTaxableEmoluments([...taxableEmoluments, {
              id: createLocalId('EMOL'),
              componentName: newEmolName,
              taxable: newEmolTaxable,
              exemptAllowanceLimit: newEmolLimit
            }]);
            setIsRegisterEmolumentModalOpen(false);
            setNewEmolName('');
            setNewEmolLimit('No Limit');
            setNewEmolTaxable(true);
            addToast(`Component "${newEmolName}" registered successfully.`, 'success');
          }} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl max-w-sm w-full space-y-4 font-sans animate-in zoom-in-95 duration-150">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest border-b pb-2">Register Custom Emolument</h3>
            
            <div className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Component Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Executive Entertainment Allowance"
                  value={newEmolName}
                  onChange={(e) => setNewEmolName(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tax Exempt Allowance Limit</label>
                <SelectMenu
                  value={newEmolLimit}
                  onChange={setNewEmolLimit}
                  triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                  options={[
                    { value: 'No Limit', label: 'No Limit (Fully Taxable)' },
                    { value: 'SGD 1,200 annually', label: 'SGD 1,200 annually' },
                    { value: 'SGD 3,000 annually', label: 'SGD 3,000 annually' },
                    { value: 'SGD 5,000 annually', label: 'SGD 5,000 annually' },
                    { value: 'Exempt from tax', label: 'Exempt from tax' },
                  ]}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Initial Taxable Status</label>
                <SelectMenu
                  value={newEmolTaxable ? 'yes' : 'no'}
                  onChange={(v) => setNewEmolTaxable(v === 'yes')}
                  triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                  options={[
                    { value: 'yes', label: 'Taxable Component' },
                    { value: 'no', label: 'Tax-Exempt Component' },
                  ]}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsRegisterEmolumentModalOpen(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-novora hover:bg-opacity-95 text-white text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 8g. CREATE NEW PAYMENT DURATION MODAL */}
      {isCreateDurationModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!newDurationName) {
              addToast('Enter a duration name', 'error');
              return;
            }
            const n = {
              name: newDurationName,
              start: newDurationStart,
              end: newDurationEnd,
              status: newDurationStatus
            };
            setPastDurations([n, ...pastDurations]);
            setIsCreateDurationModalOpen(false);
            setNewDurationName('');
            addToast(`Successfully created ${newDurationName} payment duration.`, 'success');
          }} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl max-w-sm w-full space-y-4 font-sans animate-in zoom-in-95 duration-150">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest border-b pb-2">Create New Payment Duration</h3>
            
            <div className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Duration Cycle Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. June 2026 Period"
                  value={newDurationName}
                  onChange={(e) => setNewDurationName(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Start Date</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1 Jun"
                    value={newDurationStart}
                    onChange={(e) => setNewDurationStart(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">End Date</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 30 Jun"
                    value={newDurationEnd}
                    onChange={(e) => setNewDurationEnd(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Initial Status</label>
                <SelectMenu
                  value={newDurationStatus}
                  onChange={setNewDurationStatus}
                  triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                  options={[
                    { value: 'Draft', label: 'Draft' },
                    { value: 'Approved', label: 'Approved' },
                    { value: 'Current', label: 'Current Cycle' },
                  ]}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreateDurationModalOpen(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-novora hover:bg-opacity-95 text-white text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 8h. EDIT ACTIVE DURATION MODAL */}
      {isEditActiveDurationModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={(e) => {
            e.preventDefault();
            setIsEditActiveDurationModalOpen(false);
            addToast('Successfully updated current period payment duration factors.', 'success');
          }} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl max-w-sm w-full space-y-4 font-sans animate-in zoom-in-95 duration-150">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest border-b pb-2">Edit Current Duration Setup</h3>
            
            <div className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Duration Name</label>
                <input
                  type="text"
                  required
                  value={paymentDuration.name}
                  onChange={(e) => setPaymentDuration({ ...paymentDuration, name: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white text-slate-800 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Period Start</label>
                  <input
                    type="text"
                    required
                    value={paymentDuration.start}
                    onChange={(e) => setPaymentDuration({ ...paymentDuration, start: e.target.value })}
                    className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Period End</label>
                  <input
                    type="text"
                    required
                    value={paymentDuration.end}
                    onChange={(e) => setPaymentDuration({ ...paymentDuration, end: e.target.value })}
                    className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Disbursement Pay Date</label>
                <input
                  type="text"
                  required
                  value={paymentDuration.payDate}
                  onChange={(e) => setPaymentDuration({ ...paymentDuration, payDate: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Salary Computation Basis</label>
                <input
                  type="text"
                  required
                  value={paymentDuration.basis}
                  onChange={(e) => setPaymentDuration({ ...paymentDuration, basis: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white text-slate-800 font-semibold"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditActiveDurationModalOpen(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-novora hover:bg-opacity-95 text-white text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer"
              >
                Save Setup
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

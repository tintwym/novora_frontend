import { useState, type FormEvent } from 'react'
import {
  Search,
  Plus,
  PlusCircle,
  Edit,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Coins,
  CreditCard,
  FileText,
  FileSpreadsheet,
  Download,
  Layers,
  Calculator,
  UserCheck,
  Percent,
  Clock,
  Paperclip,
  ChevronDown,
} from 'lucide-react'
import { showActionToast } from '../../utils/actionToast'
import type { ModuleEmployee } from '../../types/moduleEmployee'
import { nextSeq } from '../../utils/nextSeq';

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

type PayrollTabProps = {
  employees: ModuleEmployee[]
}

export function PayrollTab({ employees }: PayrollTabProps) {
  const addToast = (text: string, type?: 'success' | 'loading' | 'error' | 'info') => {
    showActionToast(text, type)
  }

  // Navigation states
  const [activeMainTab, setActiveMainTab] = useState<PayrollMainTab>('Allowance');

  // Main tabs configuration styled with icons matching Disciplinary Management subtabs
  const mainTabs = [
    { label: 'Allowance' as PayrollMainTab, icon: Coins, displayLabel: 'Allowance' },
    { label: 'Bonus' as PayrollMainTab, icon: TrendingUp, displayLabel: 'Bonus' },
    { label: 'Overtime' as PayrollMainTab, icon: Clock, displayLabel: 'Overtime' },
    { label: 'Deposit' as PayrollMainTab, icon: Layers, displayLabel: 'Deposit' },
    { label: 'Deduction' as PayrollMainTab, icon: Percent, displayLabel: 'Deduction' },
    { label: 'Tax' as PayrollMainTab, icon: FileText, displayLabel: 'Tax' },
    { label: 'Pay management' as PayrollMainTab, icon: CreditCard, displayLabel: 'Pay management' },
    { label: 'Payroll reports' as PayrollMainTab, icon: BarChart3, displayLabel: 'Payroll Reports' },
  ];
  
  // Dynamic subtabs depending on MainTab
  const [allowanceSubTab, setAllowanceSubTab] = useState<'Allowance type' | 'Travel allowance' | 'Allowance attachment' | 'Allowance payment'>('Allowance type');
  const [bonusSubTab, setBonusSubTab] = useState<'Bonus type' | 'Bonus attachment' | 'Bonus payment' | 'Bonus policy'>('Bonus type');
  const [overtimeSubTab, setOvertimeSubTab] = useState<'OT policy attachment' | 'Manual OT setup' | 'Specific OT setup' | 'OT request' | 'Request for others' | 'OT approval' | 'OT history'>('OT policy attachment');
  const [depositSubTab, setDepositSubTab] = useState<'Deposit type' | 'Deposit attachment'>('Deposit type');
  const [deductionSubTab, setDeductionSubTab] = useState<'Deduction type' | 'Deduction attachment' | 'Manual deduction'>('Deduction type');
  const [taxSubTab, setTaxSubTab] = useState<'Tax category' | 'Tax attachment' | 'Income tax policy' | 'Taxable pays'>('Tax category');
  const [payMgmtSubTab, setPayMgmtSubTab] = useState<'Payment duration' | 'Payroll preparation' | 'Payroll run' | 'Payroll history'>('Payment duration');

  // Unified Editing states for Modals
  const [editingAllowance, setEditingAllowance] = useState<AllowanceType | null>(null);
  const [editingBonus, setEditingBonus] = useState<BonusType | null>(null);
  const [editingDeposit, setEditingDeposit] = useState<DepositType | null>(null);
  const [editingDeduction, setEditingDeduction] = useState<DeductionType | null>(null);
  const [editingTax, setEditingTax] = useState<TaxCategory | null>(null);

  // New interactive states for Sub Tabs
  // Under Allowance - Travel Claims
  interface TravelClaim { id: string; employeeName: string; amount: string; purpose: string; date: string; status: 'Approved' | 'Pending' | 'Rejected' }
  const [travelClaims, setTravelClaims] = useState<TravelClaim[]>([
    { id: 'TRV-101', employeeName: 'Sarah Lim', amount: '120.00', purpose: 'Client Onsite Support', date: '2026-05-12', status: 'Approved' },
    { id: 'TRV-102', employeeName: 'Raj Kumar', amount: '85.50', purpose: 'Hardware Procurement Run', date: '2026-05-14', status: 'Approved' },
    { id: 'TRV-103', employeeName: 'Ahmad L', amount: '210.00', purpose: 'Regional Offsite Meeting', date: '2026-05-21', status: 'Pending' }
  ]);
  const [newTravelStaffName, setNewTravelStaffName] = useState('');
  const [newTravelAmt, setNewTravelAmt] = useState('');
  const [newTravelPurpose, setNewTravelPurpose] = useState('');

  // Under Allowance - Allowance Attachments
  const [allowanceAttachments, setAllowanceAttachments] = useState([
    { id: 'ATT-A01', label: 'Fuel_Receipt_May.pdf', staffName: 'Sarah Lim', size: '1.4 MB', date: '2026-05-14', type: 'Transport', status: 'Verified' },
    { id: 'ATT-A02', label: 'Dinner_With_Client.jpg', staffName: 'Ahmad L', size: '2.1 MB', date: '2026-05-20', type: 'Meal', status: 'Pending Verification' },
  ]);

  // Under Bonus - Bonus attachments, payments, and policy
  const [bonusAttachments, setBonusAttachments] = useState([
    { id: 'ATT-B01', label: 'Q1_KPI_Board_Signoff.pdf', date: '2026-04-12', size: '4.8 MB', uploader: 'Grace Chen' }
  ]);
  const [bonusPayments, setBonusPayments] = useState([
    { empId: 'SL-001', empName: 'Sarah Lim', dept: 'Engineering', amount: '2500.00', scale: '100% target met', status: 'Paid' },
    { empId: 'RK-002', empName: 'Raj Kumar', dept: 'Engineering', amount: '3100.00', scale: '120% target met', status: 'Pending Cycle' },
    { empId: 'AL-003', empName: 'Ahmad L', dept: 'Operations', amount: '1500.00', scale: '90% target met', status: 'Paid' }
  ]);
  const [bonusPolicies, setBonusPolicies] = useState([
    { id: 'POL-10', ruleName: 'Performance Multiplier G7', weight: 'Basic × 1.25', active: true },
    { id: 'POL-11', ruleName: 'Tenure loyalty (3+ Years)', weight: 'One-time bonus of 1,000', active: true },
    { id: 'POL-12', ruleName: 'Referral bounty program', weight: 'Fixed MYR 500 per head', active: false }
  ]);

  // Under Overtime - setup & requests
  const [manualOtEntries, setManualOtEntries] = useState([
    { id: 'MN-01', empName: 'Sarah Lim', hrs: 4.5, rate: 'MYR 25.00/hr', total: 112.50, date: '2026-05-15' }
  ]);
  const [newManualOtStaff, setNewManualOtStaff] = useState('');
  const [newManualOtHrs, setNewManualOtHrs] = useState('');
  const [newManualOtRate, setNewManualOtRate] = useState('25.00');

  const [otRequests, setOtRequests] = useState([
    { id: 'REQ-301', empName: 'Sarah Lim', hrs: 3.5, reason: 'Production server release', date: '2026-05-12', status: 'Approved' },
    { id: 'REQ-302', empName: 'Raj Kumar', hrs: 4.0, reason: 'Emergency database patch', date: '2026-05-13', status: 'Pending' },
    { id: 'REQ-303', empName: 'Ahmad L', hrs: 2.0, reason: 'Warehouse stock auditing', date: '2026-05-14', status: 'Pending' },
    { id: 'REQ-304', empName: 'Emily Tan', hrs: 6.0, reason: 'E-commerce launch support', date: '2026-05-15', status: 'Pending' }
  ]);
  const [newOtReqStaff, setNewOtReqStaff] = useState('');
  const [newOtReqHrs, setNewOtReqHrs] = useState('');
  const [newOtReqReason, setNewOtReqReason] = useState('');

  // Under Deposit Attachments
  const [depositAttachments, setDepositAttachments] = useState([
    { id: 'DEP-ATT-01', label: 'Laptop_Custody_Agreement.pdf', date: '2026-03-01', size: '820 KB', uploader: 'Sarah Lim' }
  ]);

  // Under Deduction Attachments & Manual Deductions
  const [deductionAttachments, setDeductionAttachments] = useState([
    { id: 'DED-ATT-01', label: 'Court_Order_Garnishment.pdf', date: '2026-05-10', size: '1.1 MB', uploader: 'Raj Kumar' }
  ]);
  const [manualDeductions, setManualDeductions] = useState([
    { id: 'MD-01', empName: 'Raj Kumar', amount: '50.00', reason: 'Office access card replace', date: '2026-05-18' }
  ]);
  const [newDedStaff, setNewDedStaff] = useState('');
  const [newDedAmt, setNewDedAmt] = useState('');
  const [newDedReason, setNewDedReason] = useState('Salary advance');

  // Under Tax Attachments & Taxable Emoluments list
  const [taxAttachments, setTaxAttachments] = useState([
    { id: 'TAX-ATT-01', label: 'Monthly_PCB_Return_CP39.pdf', date: '2026-05-10', size: '1.4 MB', uploader: 'Corporate HR' }
  ]);
  const [taxableEmoluments, setTaxableEmoluments] = useState([
    { id: 'EMOL-01', componentName: 'Basic Salary', taxable: true, exemptAllowanceLimit: 'Fully Taxable' },
    { id: 'EMOL-02', componentName: 'Transport Allowance', taxable: false, exemptAllowanceLimit: 'Exempt up to MYR 6,000 / year' },
    { id: 'EMOL-03', componentName: 'Meal Allowance', taxable: false, exemptAllowanceLimit: 'Exempt if under MYR 30 / day' },
    { id: 'EMOL-04', componentName: 'Phone Allowance', taxable: true, exemptAllowanceLimit: 'Exempt up to MYR 300 / year' },
    { id: 'EMOL-05', componentName: 'Performance Bonus', taxable: true, exemptAllowanceLimit: 'Fully Taxable' },
    { id: 'EMOL-06', componentName: 'Overtime Payment', taxable: true, exemptAllowanceLimit: 'Fully Taxable' }
  ]);

  // Under Payment Prep checklist
  const [_prepSteps, _setPrepSteps] = useState([
    { id: 'STEP1', label: 'Synchronise Employee Shifts & Rotas', desc: 'Lock roster profiles for May 2026', done: true },
    { id: 'STEP2', label: 'Verify Approved Attendances & Timecards', desc: 'Sync biometric punch timestamps', done: true },
    { id: 'STEP3', label: 'Approve Pending Overtime claims', desc: 'Ensure active sign-offs for OT rosters', done: false },
    { id: 'STEP4', label: 'Apply Custom Mid-month Salary Deductions', desc: 'Calculate advances or card replaces', done: false },
    { id: 'STEP5', label: 'Validate Government Statutory Schedules', desc: 'Check EPF, SOCSO and PCB scales', done: false }
  ]);

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
    weekdayOtRate: 'Based on salary (per hour)',
    weekendOtRate: '1.5× per hour',
    holidayOtRate: '2.0× per hour',
    calculateBy: 'Per minute rate',
    roundingBlock: '30 minutes',
    minOtThreshold: '30 minutes',
    maxOtPerDay: '4 hours'
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

  // Allowance Master State
  const [allowanceTypes, setAllowanceTypes] = useState<AllowanceType[]>([
    { id: '1', name: 'Transport allowance', policyType: 'Transport', amount: '300.00', deductionAmt: '—', taxable: 'No', onPayslip: 'Yes', attachEmp: 'No', status: 'Active' },
    { id: '2', name: 'Meal allowance', policyType: 'Meal', amount: '200.00', deductionAmt: '10.00/day', taxable: 'No', onPayslip: 'Yes', attachEmp: 'No', status: 'Active' },
    { id: '3', name: 'Phone allowance', policyType: 'Normal', amount: '150.00', deductionAmt: '—', taxable: 'Yes', onPayslip: 'Yes', attachEmp: 'Yes', status: 'Active' },
    { id: '4', name: 'On-time allowance', policyType: 'On time', amount: '100.00', deductionAmt: '—', taxable: 'No', onPayslip: 'Yes', attachEmp: 'No', status: 'Active' },
    { id: '5', name: 'Night shift allowance', policyType: 'Shift', amount: '250.00', deductionAmt: '—', taxable: 'No', onPayslip: 'Yes', attachEmp: 'Yes', status: 'Active' },
    { id: '6', name: 'Grade G7 allowance', policyType: 'Grade', amount: '400.00', deductionAmt: '—', taxable: 'No', onPayslip: 'Yes', attachEmp: 'Yes', status: 'Active' }
  ]);

  // Bonus Master State
  const [bonusTypes, setBonusTypes] = useState<BonusType[]>([
    { id: '1', name: 'Annual performance bonus', policyType: 'Normal', payMonth: 'December', basedOn: 'Fixed amount', onPayslip: 'Yes', status: 'Active' },
    { id: '2', name: 'Service bonus (3 yrs)', policyType: 'Working service', payMonth: 'On anniversary', basedOn: 'Salary × factor', onPayslip: 'Yes', status: 'Active' },
    { id: '3', name: 'LTIP — Grade G7+', policyType: 'LTIP', payMonth: 'March (FY end)', basedOn: 'Performance eval', onPayslip: 'Yes', status: 'Active' }
  ]);

  // Deposit Master State
  const [depositTypes, setDepositTypes] = useState<DepositType[]>([
    { id: '1', name: 'Uniform deposit', code: 'UNI', employmentStatus: 'All staff', frequency: 'One-time', amountBasis: 'Fixed MYR 100', reimburseMonth: 'On resign', status: 'Active' },
    { id: '2', name: 'Saving deposit', code: 'SAV', employmentStatus: 'Permanent', frequency: 'Monthly', amountBasis: '2% of basic', reimburseMonth: 'On resign', status: 'Active' },
    { id: '3', name: 'Laptop deposit', code: 'LAP', employmentStatus: 'Engineering', frequency: 'One-time', amountBasis: 'Fixed MYR 500', reimburseMonth: 'On resign', status: 'Active' }
  ]);

  // Deduction Master State
  const [deductions, setDeductions] = useState<DeductionType[]>([
    { id: '1', name: 'EPF (employee)', type: 'Statutory', deductionRule: 'Based on salary', amountRate: '11%', onPayslip: 'Yes', status: 'Active' },
    { id: '2', name: 'SOCSO', type: 'Statutory', deductionRule: 'Statutory table', amountRate: '0.5%', onPayslip: 'Yes', status: 'Active' },
    { id: '3', name: 'Income tax (PCB)', type: 'Tax', deductionRule: 'PCB schedule', amountRate: 'Varied', onPayslip: 'Yes', status: 'Active' },
    { id: '4', name: 'Late deduction', type: 'Rota rule', deductionRule: 'Per minute late', amountRate: 'MYR 0.50/min', onPayslip: 'Yes', status: 'Active' },
    { id: '5', name: 'Missing swipe', type: 'Attendance', deductionRule: 'Per occurrence', amountRate: 'MYR 20.00', onPayslip: 'Yes', status: 'Active' },
    { id: '6', name: 'Unpaid leave', type: 'Leave', deductionRule: 'Normal rate/day', amountRate: 'Salary ÷ work days', onPayslip: 'Yes', status: 'Active' }
  ]);

  // Tax Master State
  const [taxes, setTaxes] = useState<TaxCategory[]>([
    { id: '1', name: 'Personal income tax', code: 'PCB', calculateOn: 'Monthly salary', calcOverallIncome: 'Yes', status: 'Active' },
    { id: '2', name: 'Social security (SOCSO)', code: 'SSB', calculateOn: 'Basic salary', calcOverallIncome: 'No', status: 'Active' }
  ]);

  // OT policy attached employees mock
  const [otAttachedStaff, setOtAttachedStaff] = useState([
    { id: 'SL-001', name: 'Sarah Lim', department: 'Engineering', policyType: 'Salary-based', status: 'Active' },
    { id: 'RK-002', name: 'Raj Kumar', department: 'Engineering', policyType: 'Salary-based', status: 'Active' },
    { id: 'AL-003', name: 'Ahmad L', department: 'Operations', policyType: 'Fixed amt', status: 'Active' },
  ]);

  // Payment Active duration setup state
  const [paymentDuration, setPaymentDuration] = useState({
    name: 'Monthly (May 2026)',
    start: '1 May 2026',
    end: '31 May 2026',
    payDate: '31 May 2026',
    basis: '26 working days / month',
    status: 'Current period'
  });

  const [pastDurations, setPastDurations] = useState([
    { name: 'May 2026', start: '1 May', end: '31 May', status: 'Current' },
    { name: 'Apr 2026', start: '1 Apr', end: '30 Apr', status: 'Confirmed' },
    { name: 'Mar 2026', start: '1 Mar', end: '31 Mar', status: 'Confirmed' }
  ]);

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
  const [newDepositBasis, setNewDepositBasis] = useState('Fixed MYR 100');

  const [newDeductionName, setNewDeductionName] = useState('');
  const [newDeductionType, setNewDeductionType] = useState('Statutory');
  const [newDeductionRate, setNewDeductionRate] = useState('');

  const [newTaxName, setNewTaxName] = useState('');
  const [newTaxCode, setNewTaxCode] = useState('');
  const [newTaxOn, setNewTaxOn] = useState('Monthly salary');

  // Reports view state variables
  const [reportsDept, setReportsDept] = useState('All departments');
  const [reportsSearch, setReportsSearch] = useState('');
  const [reportsPeriod, setReportsPeriod] = useState('All times');

  // Dynamic state changes
  const handleAddNewAllowance = (e: FormEvent) => {
    e.preventDefault();
    if (!newAllowanceName) {
      addToast('Please input an allowance name', 'error');
      return;
    }
    const n: AllowanceType = {
      id: String(nextSeq(allowanceTypes.map(a => a.id))),
      name: newAllowanceName,
      policyType: newAllowancePolicy,
      amount: newAllowanceAmount || '150.00',
      deductionAmt: '—',
      taxable: newAllowanceTaxable,
      onPayslip: 'Yes',
      attachEmp: 'Yes',
      status: 'Active'
    };
    setAllowanceTypes([...allowanceTypes, n]);
    setAllowanceModalOpen(false);
    setNewAllowanceName('');
    setNewAllowanceAmount('');
    addToast('Successfully registered new allowance type policy.', 'success');
  };

  const handleAddNewBonus = (e: FormEvent) => {
    e.preventDefault();
    if (!newBonusName) {
      addToast('Please specify bonus category', 'error');
      return;
    }
    const n: BonusType = {
      id: String(nextSeq(bonusTypes.map(b => b.id))),
      name: newBonusName,
      policyType: newBonusPolicy,
      payMonth: newBonusPayMonth,
      basedOn: newBonusBasedOn,
      onPayslip: 'Yes',
      status: 'Active'
    };
    setBonusTypes([...bonusTypes, n]);
    setBonusModalOpen(false);
    setNewBonusName('');
    addToast('Successfully added new bonus compensation policy', 'success');
  };

  const handleAddNewDeposit = (e: FormEvent) => {
    e.preventDefault();
    if (!newDepositName || !newDepositCode) {
      addToast('Missing vital fields for security bond catalogging.', 'error');
      return;
    }
    const n: DepositType = {
      id: String(nextSeq(depositTypes.map(d => d.id))),
      name: newDepositName,
      code: newDepositCode.toUpperCase(),
      employmentStatus: 'All staff',
      frequency: 'One-time',
      amountBasis: newDepositBasis,
      reimburseMonth: 'On resign',
      status: 'Active'
    };
    setDepositTypes([...depositTypes, n]);
    setDepositModalOpen(false);
    setNewDepositName('');
    setNewDepositCode('');
    addToast('New security deposit/reimbursement model archived.', 'success');
  };

  const handleAddNewDeduction = (e: FormEvent) => {
    e.preventDefault();
    if (!newDeductionName || !newDeductionRate) {
      addToast('Deduction schema requires name and tariff.', 'error');
      return;
    }
    const n: DeductionType = {
      id: String(nextSeq(deductions.map(d => d.id))),
      name: newDeductionName,
      type: newDeductionType,
      deductionRule: 'Custom formula policy',
      amountRate: newDeductionRate,
      onPayslip: 'Yes',
      status: 'Active'
    };
    setDeductions([...deductions, n]);
    setDeductionModalOpen(false);
    setNewDeductionName('');
    setNewDeductionRate('');
    addToast('Alternative custom deduction logic loaded successfully.', 'success');
  };

  const handleAddNewTax = (e: FormEvent) => {
    e.preventDefault();
    if (!newTaxName || !newTaxCode) {
      addToast('Income tax category must provide a standardized statutory identifier code.', 'error');
      return;
    }
    const n: TaxCategory = {
      id: String(nextSeq(taxes.map(t => t.id))),
      name: newTaxName,
      code: newTaxCode.toUpperCase(),
      calculateOn: newTaxOn,
      calcOverallIncome: 'Yes',
      status: 'Active'
    };
    setTaxes([...taxes, n]);
    setTaxModalOpen(false);
    setNewTaxName('');
    setNewTaxCode('');
    addToast('New localized taxation withholding profile registered.', 'success');
  };

  // Editing state submission handlers
  const handleEditAllowance = (e: FormEvent) => {
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

  const handleEditBonus = (e: FormEvent) => {
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

  const handleEditDeposit = (e: FormEvent) => {
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

  const handleEditDeduction = (e: FormEvent) => {
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

  const handleEditTax = (e: FormEvent) => {
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

  // Run payroll simulation runner
  const triggerPayrollRun = () => {
    if (isSimulatingRun) return;
    setIsSimulatingRun(true);
    setRunSuccessful(false);
    setSimStep(1);
    setSimProgress(15);
    addToast('Verifying timecard locks and audit stamps...', 'loading');

    // Run progressive steps for beautiful immersive simulation
    setTimeout(() => {
      setSimStep(2);
      setSimProgress(45);
      addToast('Calculating fractional wage segments, allowances and overtime tallies...', 'loading');
    }, 1500);

    setTimeout(() => {
      setSimStep(3);
      setSimProgress(75);
      addToast('Applying statutory EPF, SOCSO, and income tax (PCB) schedules...', 'loading');
    }, 3000);

    setTimeout(() => {
      setSimStep(4);
      setSimProgress(100);
      setRunSuccessful(true);
      addToast('Month-end Payroll run compiled successfully! Roster balanced.', 'success');
    }, 4500);
  };

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
      
      {/* ===== 1. UPPER NAVIGATION & PRIMARY HORIZONTAL NAV-BAR ===== */}
      <div id="payroll-module-navigator" className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-200/85 pb-4 gap-4 min-w-0">
        
        {/* Navigation tabs styled exactly like Disciplinary Management */}
        <div id="payroll-navigation-tabs" className="flex items-center gap-2 select-none overflow-x-auto flex-1 min-w-0 scrollbar-none pb-1">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeMainTab === tab.label;
            return (
              <button
                id={`payroll-tab-${tab.label.replace(/\s+/g, '-').toLowerCase()}`}
                key={tab.label}
                type="button"
                onClick={() => {
                  setActiveMainTab(tab.label);
                  addToast(`Opened ${tab.displayLabel} workstation view`, 'info');
                }}
                className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all shrink-0 relative cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'text-[#2f66e0] bg-[#2f66e0]/10 border border-[#2f66e0]/15 font-extrabold'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="whitespace-nowrap">{tab.displayLabel}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#2f66e0] rounded-sm" />
                )}
              </button>
            );
          })}
        </div>

        {/* Global top level dropdown controllers aligned on the right, integrated into the navigation grid */}
        <div id="payroll-global-ctrls" className="flex items-center gap-2.5 shrink-0 font-sans text-slate-700">
          {/* Period selector */}
          <div className="relative">
            <select
              value={reportsPeriod}
              onChange={(e) => {
                setReportsPeriod(e.target.value);
                addToast(`Transitioned ledger review cycle to active ${e.target.value}`, 'info');
              }}
              aria-label="Payroll period"
              className="h-9 appearance-none bg-white border border-slate-200 hover:border-slate-300 text-xs font-bold pl-3.5 pr-8 rounded-xl focus:outline-none transition-colors cursor-pointer whitespace-nowrap"
            >
              <option value="May 2026">May 2026</option>
              <option value="April 2026">April 2026</option>
              <option value="March 2026">March 2026</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          </div>

          {/* Department global selector */}
          <div className="relative">
            <select
              value={selectedDeptFilter}
              onChange={(e) => {
                setSelectedDeptFilter(e.target.value);
                setReportsDept(e.target.value);
                addToast(`Focused analytics subset on target department: ${e.target.value}`, 'info');
              }}
              aria-label="Department filter"
              className="h-9 appearance-none bg-white border border-slate-200 hover:border-slate-300 text-xs font-bold pl-3.5 pr-8 rounded-xl focus:outline-none transition-colors cursor-pointer whitespace-nowrap min-w-38"
            >
              <option value="All departments">All departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Finance">Finance</option>
              <option value="HR">HR</option>
              <option value="Marketing">Marketing</option>
              <option value="Operations">Operations</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          </div>

          {/* Export utility */}
          <button
            type="button"
            onClick={() => {
              addToast('Packaging and validating current payroll roster schedules...', 'loading');
              setTimeout(() => {
                addToast('Comprehensive ledger exported as NovoraPayroll_Ledger_May2026.xlsx', 'success');
              }, 1500);
            }}
            className="h-9 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3.5 rounded-xl inline-flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
          >
            <Download className="h-4 w-4 text-slate-400 shrink-0" />
            <span>Export</span>
          </button>

          {/* Urgent Run Payroll task trigger */}
          <button
            type="button"
            onClick={triggerPayrollRun}
            className="h-9 bg-[#2f66e0] hover:opacity-95 text-white text-xs font-extrabold px-3.5 rounded-xl transition-all shadow-sm inline-flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap"
          >
            <Calculator className="h-4 w-4 shrink-0" />
            <span>Run payroll</span>
          </button>
        </div>
      </div>


      {/* ===== 3. SECONDARY LEVEL NAVIGATION CAP CAPSULES (Pills) ===== */}
      <div id="payroll-secondary-capsules" className="flex items-center gap-2 select-none overflow-x-auto scrollbar-none py-1">
        
        {/* Render secondary navigation pill elements according to activeMainTab */}
        {activeMainTab === 'Allowance' && (['Allowance type', 'Travel allowance', 'Allowance attachment', 'Allowance payment'] as const).map((sub) => (
          <button
            key={sub}
            onClick={() => setAllowanceSubTab(sub)}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
              allowanceSubTab === sub
                ? 'bg-[#2f66e0] text-white font-extrabold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-white border border-slate-100'
            }`}
          >
            {sub}
          </button>
        ))}

        {activeMainTab === 'Bonus' && (['Bonus type', 'Bonus attachment', 'Bonus payment'] as const).map((sub) => (
          <button
            key={sub}
            onClick={() => setBonusSubTab(sub)}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
              bonusSubTab === sub
                ? 'bg-[#2f66e0] text-white font-extrabold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-white border border-slate-100'
            }`}
          >
            {sub}
          </button>
        ))}

        {activeMainTab === 'Overtime' && (['OT policy attachment', 'Manual OT setup', 'Specific OT setup', 'OT request', 'Request for others', 'OT approval', 'OT history'] as const).map((sub) => {
          const isApproval = sub === 'OT approval';
          return (
            <button
              key={sub}
              onClick={() => setOvertimeSubTab(sub)}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                overtimeSubTab === sub
                  ? 'bg-[#2f66e0] text-white font-extrabold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-white border border-slate-100'
              }`}
            >
              <span>{sub}</span>
              {isApproval && (
                <span className="h-4.5 w-4.5 bg-amber-100 text-amber-700 text-[10px] font-black rounded-full flex items-center justify-center border border-amber-200">
                  4
                </span>
              )}
            </button>
          );
        })}

        {activeMainTab === 'Deposit' && (['Deposit type', 'Deposit attachment'] as const).map((sub) => (
          <button
            key={sub}
            onClick={() => setDepositSubTab(sub)}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
              depositSubTab === sub
                ? 'bg-[#2f66e0] text-white font-extrabold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-white border border-slate-100'
            }`}
          >
            {sub}
          </button>
        ))}

        {activeMainTab === 'Deduction' && (['Deduction type', 'Deduction attachment', 'Manual deduction'] as const).map((sub) => (
          <button
            key={sub}
            onClick={() => setDeductionSubTab(sub)}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
              deductionSubTab === sub
                ? 'bg-[#2f66e0] text-white font-extrabold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-white border border-slate-100'
            }`}
          >
            {sub}
          </button>
        ))}

        {activeMainTab === 'Tax' && (['Tax category', 'Tax attachment', 'Income tax policy', 'Taxable pays'] as const).map((sub) => (
          <button
            key={sub}
            onClick={() => setTaxSubTab(sub)}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
              taxSubTab === sub
                ? 'bg-[#2f66e0] text-white font-extrabold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-white border border-slate-100'
            }`}
          >
            {sub}
          </button>
        ))}

        {activeMainTab === 'Pay management' && (['Payment duration', 'Payroll preparation', 'Payroll run', 'Payroll history'] as const).map((sub) => (
          <button
            key={sub}
            onClick={() => setPayMgmtSubTab(sub)}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all shrink-0 cursor-pointer ${
              payMgmtSubTab === sub
                ? 'bg-[#2f66e0] text-white font-extrabold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-white border border-slate-100'
            }`}
          >
            {sub}
          </button>
        ))}

        {activeMainTab === 'Payroll reports' && (
          <div className="text-xs font-bold text-[#2f66e0] bg-[#2f66e0]/10 px-3 py-1.5 rounded-lg border border-[#2f66e0]/20">
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
                      <select
                        value={selectedPolicyFilter}
                        onChange={(e) => setSelectedPolicyFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-xs font-bold p-2.5 rounded-xl focus:outline-none cursor-pointer"
                      >
                        <option value="All policy types">All policy types</option>
                        <option value="Transport">Transport</option>
                        <option value="Meal">Meal</option>
                        <option value="Normal">Normal</option>
                        <option value="Shift">Shift</option>
                      </select>
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
                    className="bg-[#2f66e0] hover:opacity-95 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-sm inline-flex items-center gap-1.5 self-end sm:self-auto cursor-pointer"
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
                        <th className="p-4">Amount (MYR)</th>
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
                              <span className="bg-blue-50/70 text-[#2f66e0] border border-blue-100/50 rounded-md px-2.5 py-1 text-[10.5px] font-bold">
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
                              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 border border-emerald-100 rounded text-[10px] font-extrabold">Yes</span>
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
                                className="text-slate-500 hover:text-[#2f66e0] font-bold text-xs inline-flex items-center gap-1 cursor-pointer hover:underline"
                              >
                                <Edit className="h-3.5 w-3.5" />
                                <span>Edit</span>
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
                      <PlusCircle className="h-4 w-4 text-[#2f66e0]" />
                      <span>Submit Travel Claim</span>
                    </h4>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (!newTravelStaffName || !newTravelAmt) {
                        addToast('Specify claimant name and amount.', 'error');
                        return;
                      }
                      const claim: TravelClaim = {
                        id: `TRV-${nextSeq(travelClaims.map(t => t.id), 100)}`,
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
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Claim Amount (MYR)</label>
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
                      <button type="submit" className="w-full bg-[#2f66e0] hover:opacity-95 text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer">
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
                            <th className="p-3 text-center">Amount (MYR)</th>
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
                           id: `ATT-A-${Math.floor(Math.random() * 900) + 100}`,
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
                  <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-400">
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
                              <span className="bg-blue-50 text-[#2f66e0] text-[9.5px] font-bold px-2 py-0.5 rounded border border-blue-100">
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
                <div className="bg-linear-to-r from-blue-50 to-[#2f66e0]/5 p-4 rounded-2xl border border-blue-100 flex flex-col md:flex-row justify-between items-center gap-3">
                  <div className="space-y-0.5 text-center md:text-left">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Active Month Allowance Disbursement ledger</h4>
                    <p className="text-[10.5px] font-semibold text-slate-500">Approve or lock active allowances for current accounting period run.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => addToast('Committed all approved allowances to monthly payroll pay slips.', 'success')}
                    className="bg-[#2f66e0] hover:opacity-95 text-white font-extrabold text-xs px-4 py-2 rounded-xl shrink-0"
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
                        <th className="p-3 text-center font-bold">Total (MYR)</th>
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
                  <select
                    value={selectedPolicyFilter}
                    onChange={(e) => setSelectedPolicyFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-xs font-bold p-2.5 rounded-xl focus:outline-none cursor-pointer self-start sm:self-auto"
                  >
                    <option value="All policy types">All policy types</option>
                    <option value="Normal">Normal</option>
                    <option value="Working service">Working service</option>
                    <option value="LTIP">LTIP</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => setBonusModalOpen(true)}
                    className="bg-[#2f66e0] hover:opacity-95 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-sm inline-flex items-center gap-1.5 self-end sm:self-auto cursor-pointer"
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
                              <span className="bg-blue-50/70 text-[#2f66e0] border border-blue-100/50 rounded-md px-2.5 py-1 text-[10.5px] font-bold">
                                {bonus.policyType}
                              </span>
                            </td>
                            <td className="p-4 text-slate-600 italic font-semibold">{bonus.payMonth}</td>
                            <td className="p-4 text-slate-800 font-bold">{bonus.basedOn}</td>
                            <td className="p-4 text-center">
                              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 border border-emerald-100 rounded text-[10px] font-extrabold">Yes</span>
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
                                className="text-slate-500 hover:text-[#2f66e0] font-bold text-xs inline-flex items-center gap-1 cursor-pointer hover:underline"
                              >
                                <Edit className="h-3.5 w-3.5" />
                                <span>Edit</span>
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
                         const n = { id: `ATT-B-${Date.now()}`, label: fn, date: new Date().toISOString().split('T')[0], size: '3.1 MB', uploader: 'System Admin' };
                         setBonusAttachments([n, ...bonusAttachments]);
                         addToast(`Logged ${fn} as bonus policy verification support, size 3.1 MB.`, 'success');
                       }
                     }}>
                  <div className="h-10 w-10 bg-blue-50 text-[#2f66e0] rounded-full flex items-center justify-center mx-auto mb-2">
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
                              <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
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
                    className="bg-[#2f66e0] hover:opacity-95 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
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
                          <td className="p-3 font-bold text-[#2f66e0]">{p.scale}</td>
                          <td className="p-3 font-mono font-extrabold text-slate-900">MYR {p.amount}</td>
                          <td className="p-3 pr-5 text-right">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                              p.status === 'Paid'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                : 'bg-blue-50 text-blue-700 border-blue-100'
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
                          id: `POL-${Date.now().toString().slice(-2)}`,
                          ruleName,
                          weight,
                          active: true
                        }]);
                        addToast(`Policy "${ruleName}" successfully published to active multipliers standard.`, 'success');
                      }
                    }}
                    className="bg-[#2f66e0] hover:opacity-95 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl cursor-pointer"
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
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest">OT policy settings</h4>
                    <button
                      onClick={() => setIsEditOtPolicyModalOpen(true)}
                      className="text-[#2f66e0] hover:underline text-xs font-bold"
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
                      <span className="font-bold text-[#2f66e0]">{otPolicySettings.calculateBy}</span>
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
                      <span className="bg-blue-50 text-[#2f66e0] font-black text-[9px] px-2 py-0.5 rounded border border-blue-100">
                        {otAttachedStaff.length} employees
                      </span>
                    </div>

                    <button
                      onClick={() => setIsAttachOtModalOpen(true)}
                      className="bg-[#2f66e0] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl cursor-pointer"
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
                                <div className="h-7 w-7 rounded-full bg-blue-100 text-[#2f66e0] text-[10px] font-bold flex items-center justify-center">
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
                              <span className="bg-blue-50/70 text-[#2f66e0] text-[10px] font-bold border border-blue-100/50 px-2 py-0.5 rounded">
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
                        <PlusCircle className="h-4 w-4 text-[#2f66e0]" />
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
                          id: `MN-${Date.now().toString().slice(-2)}`,
                          empName: newManualOtStaff,
                          hrs: hrsCalculated,
                          rate: `MYR ${rateNum.toFixed(2)}/hr`,
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
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Per Hour Rate (MYR)</label>
                          <input
                            type="number" step="0.5" placeholder="25.00"
                            value={newManualOtRate}
                            onChange={(e) => setNewManualOtRate(e.target.value)}
                            className="bg-white border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none font-semibold"
                          />
                        </div>
                        <button type="submit" className="w-full bg-[#2f66e0] hover:opacity-95 text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer">
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
                                <td className="p-3 pr-5 text-right font-mono font-bold text-emerald-600">MYR {entry.total.toFixed(2)}</td>
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
                    <div className="bg-amber-50/70 border border-amber-100 p-4 rounded-xl text-[11px] font-semibold text-amber-800">
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
                                  type="button"
                                  onClick={() => setEditingOtOverride(override)}
                                  className="text-[#2f66e0] font-bold hover:underline cursor-pointer"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOtOverrides(otOverrides.filter(o => o.id !== override.id));
                                    addToast(`Overriding parameter for ${override.deptScope} removed.`, 'success');
                                  }}
                                  className="text-red-500 font-bold hover:underline cursor-pointer"
                                >
                                  Delete
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
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (!newOtReqHrs || !newOtReqReason) {
                        addToast('Describe the reason and specifying estimated duration.', 'error');
                        return;
                      }
                      const req = {
                        id: `REQ-${Date.now().toString().slice(-3)}`,
                        empName: 'Ahmad L', // Current active user role mockup
                        hrs: parseFloat(newOtReqHrs),
                        reason: newOtReqReason,
                        date: new Date().toISOString().split('T')[0],
                        status: 'Pending'
                      };
                      setOtRequests([req, ...otRequests]);
                      setNewOtReqHrs('');
                      setNewOtReqReason('');
                      addToast('Overtime request successfully posted, waiting for manager sign off.', 'success');
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
                      <button type="submit" className="w-full bg-[#2f66e0] hover:opacity-95 text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer">
                        Submit OT Request
                      </button>
                    </form>
                  </div>
                )}

                {/* Request for others */}
                {overtimeSubTab === 'Request for others' && (
                  <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest text-center">Filing OT Request for Team Member</h4>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (!newOtReqStaff || !newOtReqHrs || !newOtReqReason) {
                        addToast('Describe staff, reason and specifying estimated duration.', 'error');
                        return;
                      }
                      const req = {
                        id: `REQ-${Date.now().toString().slice(-3)}`,
                        empName: newOtReqStaff,
                        hrs: parseFloat(newOtReqHrs),
                        reason: newOtReqReason,
                        date: new Date().toISOString().split('T')[0],
                        status: 'Pending'
                      };
                      setOtRequests([req, ...otRequests]);
                      setNewOtReqStaff('');
                      setNewOtReqHrs('');
                      setNewOtReqReason('');
                      addToast(`Overtime request filed for ${newOtReqStaff} waiting for sign-off.`, 'success');
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
                      <button type="submit" className="w-full bg-[#2f66e0] hover:opacity-95 text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer">
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
                                  onClick={() => {
                                    setOtRequests(otRequests.map(r => r.id === req.id ? { ...r, status: 'Approved' } : r));
                                    addToast(`Approved ${req.hrs} overtime hours for ${req.empName}`, 'success');
                                  }}
                                  className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 text-[11px] cursor-pointer font-bold"
                                >
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOtRequests(otRequests.map(r => r.id === req.id ? { ...r, status: 'Rejected' } : r));
                                    addToast(`Rejected overtime request from ${req.empName}`, 'error');
                                  }}
                                  className="bg-rose-50 text-rose-700 hover:bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200 text-[11px] cursor-pointer font-bold"
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
                    className="bg-[#2f66e0] hover:opacity-95 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
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
                            <span className="bg-blue-50/70 text-[#2f66e0]/90 border border-blue-100 rounded-md px-2 py-0.5 text-[10px] font-bold">
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
                              className="text-slate-500 hover:text-[#2f66e0] font-bold text-xs inline-flex items-center gap-1 cursor-pointer hover:underline"
                            >
                              <Edit className="h-3.5 w-3.5" />
                              <span>Edit</span>
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
                         const n = { id: `ATT-D-${Date.now()}`, label: docName, date: new Date().toISOString().split('T')[0], size: '1.2 MB', uploader: 'System Admin' };
                         setDepositAttachments([n, ...depositAttachments]);
                         addToast(`Logged ${docName} asset collateral file.`, 'success');
                       }
                     }}>
                  <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2">
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
                  <select
                    value={selectedPolicyFilter}
                    onChange={(e) => setSelectedPolicyFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-xs font-bold p-2.5 rounded-xl focus:outline-none cursor-pointer self-start sm:self-auto"
                  >
                    <option value="All policy types">All policy types</option>
                    <option value="Statutory">Statutory</option>
                    <option value="Tax">Tax</option>
                    <option value="Rota rule">Rota rule</option>
                    <option value="Attendance">Attendance</option>
                    <option value="Leave">Leave</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => setDeductionModalOpen(true)}
                    className="bg-[#2f66e0] hover:opacity-95 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-sm inline-flex items-center gap-1.5 cursor-pointer self-end sm:self-auto"
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
                              <span className="bg-blue-50/70 text-[#2f66e0] border border-blue-100 rounded-md px-2 py-0.5 text-[10px] font-bold">
                                {ded.type}
                              </span>
                            </td>
                            <td className="p-4 text-slate-600 font-semibold italic">{ded.deductionRule}</td>
                            <td className="p-4 font-extrabold text-slate-800 font-mono">{ded.amountRate}</td>
                            <td className="p-4 text-center">
                              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 border border-emerald-100 rounded text-[10px] font-extrabold">Yes</span>
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
                                className="text-slate-500 hover:text-[#2f66e0] font-bold text-xs inline-flex items-center gap-1 cursor-pointer hover:underline"
                              >
                                <Edit className="h-3.5 w-3.5" />
                                <span>Edit</span>
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
                         const n = { id: `ATT-R-${Date.now()}`, label: docName, date: new Date().toISOString().split('T')[0], size: '1.4 MB', uploader: 'Audit Lead' };
                         setDeductionAttachments([n, ...deductionAttachments]);
                         addToast(`Logged ${docName} withholding file successfully.`, 'success');
                       }
                     }}>
                  <div className="h-10 w-10 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Paperclip className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Attach personal asset clearance logs or salary sacrifice declaration agreements</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Supports standard PDF, PNG files up to 15MB (Click to simulate attach)</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest pl-1">Deduction Agreements Archive</h4>
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
                      id: `DEC-${Date.now().toString().slice(-2)}`,
                      empName: newDedStaff,
                      reason: newDedReason,
                      amount: amtParsed.toString(),
                      date: new Date().toISOString().split('T')[0]
                    };
                    setManualDeductions([n, ...manualDeductions]);
                    setNewDedStaff('');
                    setNewDedAmt('');
                    setNewDedReason('');
                    addToast(`Deduction of MYR ${amtParsed.toFixed(2)} applied for ${newDedStaff}.`, 'success');
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
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Deducted Amount (MYR)</label>
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
                    <button type="submit" className="w-full bg-[#2f66e0] hover:opacity-95 text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer">
                      Post Salary Deduction
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-2 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest pl-1">Authorized Custom deductions list</h4>
                  <div className="border border-slate-100 rounded-2xl bg-white overflow-hidden whitespace-nowrap">
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
                              <td className="p-3 pr-5 text-right font-mono font-bold text-rose-600">- MYR {numVal.toFixed(2)}</td>
                              <td className="p-3 pr-5 text-right font-bold">
                                <div className="inline-flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setEditingManualDeduction(item)}
                                    className="text-[#2f66e0] font-bold hover:underline cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setManualDeductions(manualDeductions.filter(m => m.id !== item.id));
                                      addToast(`Deduction entry for ${item.empName} deleted.`, 'success');
                                    }}
                                    className="text-red-500 font-bold hover:underline cursor-pointer"
                                  >
                                    Delete
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
                    className="bg-[#2f66e0] hover:opacity-95 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
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
                          <td className="p-4 font-mono font-bold text-red-600">{t.code}</td>
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
                              className="text-slate-500 hover:text-[#2f66e0] font-bold text-xs inline-flex items-center gap-1 cursor-pointer hover:underline"
                            >
                              <Edit className="h-3.5 w-3.5" />
                              <span>Edit</span>
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
                         const n = { id: `ATT-T-${Date.now()}`, label: docName, date: new Date().toISOString().split('T')[0], size: '2.5 MB', uploader: 'Corporate Controller' };
                         setTaxAttachments([n, ...taxAttachments]);
                         addToast(`Archived ${docName} standard successfully.`, 'success');
                       }
                     }}>
                  <div className="h-10 w-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
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
                      <strong className="text-slate-800">13.00% (EPF Base)</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 py-1.5">
                      <span>Maximum Employee Deduction Cap</span>
                      <strong className="text-slate-800">11.00% standard salary</strong>
                    </div>
                    <div className="flex justify-between pt-1.5">
                      <span>Exempt Threshold Level</span>
                      <strong className="text-indigo-600">MYR 3,000 / month</strong>
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
                      className="bg-[#2f66e0] hover:opacity-95 text-white font-bold px-4 py-2 rounded-xl cursor-pointer"
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
                    className="bg-[#2f66e0] hover:opacity-95 text-white font-bold px-3 py-1.5 rounded-xl cursor-pointer"
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
                          <td className="p-3 font-mono text-[#2f66e0]/90 text-xs">{emol.id}</td>
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
                      onClick={() => setIsEditActiveDurationModalOpen(true)}
                      className="text-[#2f66e0] hover:underline text-xs font-bold"
                    >
                      Edit
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
                      <span className="bg-blue-50 text-[#2f66e0] px-2 py-0.5 rounded text-[10px] font-bold border border-blue-100">
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
                      className="bg-[#2f66e0] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl cursor-pointer"
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
                                    ? 'bg-blue-50 text-blue-700 border-blue-100'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-100'
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
                  <button type="button" onClick={() => addToast('Pushed payroll parameters check to external accounting system.', 'success')} className="bg-[#2f66e0] hover:opacity-95 text-white font-bold py-1.5 px-3 rounded-lg cursor-pointer">
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
                        <td className="p-3">Standard PCB / EPF 11%</td>
                        <td className="p-3 font-mono">Maybank ******431</td>
                        <td className="p-3 text-center text-emerald-600 font-extrabold">MYR 120.00</td>
                        <td className="p-3 pr-5 text-right">
                          <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-100">Ready</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="p-3 pl-5 font-bold text-slate-800">Fatimah H</td>
                        <td className="p-3">Standard PCB / EPF 11%</td>
                        <td className="p-3 font-mono">CIMB Bank ******980</td>
                        <td className="p-3 text-center text-slate-400 italic">None</td>
                        <td className="p-3 pr-5 text-right">
                          <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-100">Ready</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="p-3 pl-5 font-bold text-slate-800">Johnathan D</td>
                        <td className="p-3">Standard PCB / EPF 11%</td>
                        <td className="p-3 font-mono">Public Bank ******103</td>
                        <td className="p-3 text-center text-emerald-600 font-extrabold">MYR 340.00</td>
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
                    <strong className="text-slate-800">430 Active Staff</strong>
                  </div>
                  <div className="flex justify-between border-b border-gutter py-2">
                    <span>Estimated Gross Payroll Release</span>
                    <strong className="text-slate-900 font-mono">MYR {grandTotalGross.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span>Tax & EPF Withholdings</span>
                    <strong className="text-red-600 font-mono">- MYR 42,912.44</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    triggerPayrollRun();
                    addToast('Month-end payroll calculated. Bank ledger posted successfully.', 'success');
                  }}
                  className="w-full bg-[#2f66e0] hover:opacity-95 text-white font-extrabold text-xs py-3.5 rounded-2xl shadow-xs transition-transform cursor-pointer"
                >
                  Confirm &amp; Execute Payroll Disbursement
                </button>
              </div>
            )}

            {/* Payroll run history view */}
            {payMgmtSubTab === 'Payroll history' && (
              <div className="space-y-4 text-xs font-semibold">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest pl-1">Historic Completed Disbursements</h4>
                <div className="border border-slate-100 rounded-2xl bg-white overflow-hidden text-xs">
                  <table className="w-full text-left font-semibold">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <th className="p-3 pl-5">Billing Period</th>
                        <th className="p-3">Disbursed Headcount</th>
                        <th className="p-3 font-mono">Total Paid Amount</th>
                        <th className="p-3">Released Date</th>
                        <th className="p-3 pr-5 text-right font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr className="hover:bg-slate-50/50">
                        <td className="p-3 pl-5 font-bold text-slate-800">April 2026 Period</td>
                        <td className="p-3">428 Staff</td>
                        <td className="p-3 font-mono font-bold text-slate-900">MYR 1,184,330.12</td>
                        <td className="p-3 font-mono text-slate-400">2026-04-28</td>
                        <td className="p-3 pr-5 text-right">
                          <button type="button" onClick={() => addToast('Downloading April payslip bundle...', 'success')} className="text-[#2f66e0] hover:underline cursor-pointer">Download Ledger XLS</button>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="p-3 pl-5 font-bold text-slate-800">March 2026 Period</td>
                        <td className="p-3">425 Staff</td>
                        <td className="p-3 font-mono font-bold text-slate-900">MYR 1,162,109.90</td>
                        <td className="p-3 font-mono text-slate-400">2026-03-27</td>
                        <td className="p-3 pr-5 text-right">
                          <button type="button" onClick={() => addToast('Downloading March payslip bundle...', 'success')} className="text-[#2f66e0] hover:underline cursor-pointer">Download Ledger XLS</button>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <td className="p-3 pl-5 font-bold text-slate-800">February 2026 Period</td>
                        <td className="p-3">422 Staff</td>
                        <td className="p-3 font-mono font-bold text-slate-900">MYR 1,151,902.12</td>
                        <td className="p-3 font-mono text-slate-400">2026-02-27</td>
                        <td className="p-3 pr-5 text-right">
                          <button type="button" onClick={() => addToast('Downloading February payslip bundle...', 'success')} className="text-[#2f66e0] hover:underline cursor-pointer">Download Ledger XLS</button>
                        </td>
                      </tr>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gross Payout</span>
                    <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">MYR {grandTotalGross.toLocaleString()}</h3>
                    <span className="text-[9px] font-bold text-indigo-500 bg-indigo-50/60 px-2 py-0.5 rounded-md border border-indigo-100">Basic + Allowance + OT</span>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <Coins className="h-5 w-5 text-[#2f66e0]" />
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Net Disbursements</span>
                    <h3 className="text-xl font-extrabold text-emerald-600 tracking-tight">MYR {grandTotalNet.toLocaleString()}</h3>
                    <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50/60 px-2 py-0.5 rounded-md border border-emerald-100">Transferred basic sum</span>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    <UserCheck className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Withholding &amp; Taxes</span>
                    <h3 className="text-xl font-extrabold text-rose-600 tracking-tight">MYR {grandTotalDeductions.toLocaleString()}</h3>
                    <span className="text-[9px] font-bold text-rose-500 bg-rose-50/60 px-2 py-0.5 rounded-md border border-rose-100">EPF + SOCSO + PCB</span>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center">
                    <Percent className="h-5 w-5 text-rose-500" />
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg Paycheck</span>
                    <h3 className="text-xl font-extrabold text-indigo-600 tracking-tight">MYR {avgNetPay.toLocaleString()}</h3>
                    <span className="text-[9px] font-bold text-indigo-500 bg-indigo-50/60 px-2 py-0.5 rounded-md border border-indigo-100">Average salary net</span>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-indigo-500" />
                  </div>
                </div>

              </div>

              {/* 2. Department Compliance Table / Scorecard */}
              <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 tracking-tight flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#2f66e0]" />
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
                            <td className="p-3 text-center font-mono font-bold">MYR {dept.avgBasic.toLocaleString()}</td>
                            <td className="p-3 text-center font-mono text-rose-500">MYR {dept.totalDeducts.toLocaleString()}</td>
                            <td className="p-3 text-center font-mono text-slate-800 font-extrabold">MYR {dept.totalGross.toLocaleString()}</td>
                            <td className="p-3 text-center font-mono text-emerald-600 font-extrabold">MYR {dept.totalNet.toLocaleString()}</td>
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

                  <select
                    value={reportsDept}
                    onChange={(e) => setReportsDept(e.target.value)}
                    className="bg-white border border-slate-200 text-xs font-bold p-2 rounded-xl focus:outline-none"
                  >
                    <option value="All departments">All departments</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Finance">Finance</option>
                    <option value="HR">HR</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                  </select>
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
                    className="bg-[#2f66e0] hover:opacity-95 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
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
                      <th className="p-3 text-center text-red-500">EPF (11%)</th>
                      <th className="p-3 text-center text-red-500">SOCSO &amp; tax</th>
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
                        <td className="p-3 text-center font-mono font-semibold">MYR {row.baseSalary.toLocaleString()}</td>
                        <td className="p-3 text-center font-mono text-indigo-500">+MYR {row.allowanceVal}</td>
                        <td className="p-3 text-center font-mono text-indigo-500">+MYR {row.otVal}</td>
                        <td className="p-3 text-center font-mono font-bold text-slate-800 bg-slate-50/30">MYR {row.grossVal.toLocaleString()}</td>
                        <td className="p-3 text-center font-mono text-rose-500">-MYR {row.epf}</td>
                        <td className="p-3 text-center font-mono text-rose-500">-MYR {row.socso + row.pcb}</td>
                        <td className="p-3 text-center font-mono font-semibold text-rose-600 bg-rose-50/10">MYR {row.totalDeductions}</td>
                        <td className="p-3 pr-5 text-right font-mono font-extrabold text-emerald-600 bg-emerald-50/10">MYR {row.netSalary.toLocaleString()}</td>
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
              <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center text-[#2f66e0] shrink-0 animate-spin">
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
                  className="h-full bg-linear-to-r from-blue-500 to-[#2f66e0] transition-all duration-300 rounded-lg"
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
                  <span>Government brackets &amp; EPF schedules locked: OK</span>
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
                className="flex-1 bg-[#2f66e0] hover:opacity-95 text-white disabled:opacity-50 text-xs font-extrabold py-2.5 rounded-xl cursor-pointer"
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
                <select
                  value={newAllowancePolicy}
                  onChange={(e) => setNewAllowancePolicy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-bold cursor-pointer"
                >
                  <option value="Normal">Normal</option>
                  <option value="Transport">Transport</option>
                  <option value="Meal">Meal</option>
                  <option value="Shift">Shift</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Proposed Value (MYR)</label>
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
                <select
                  value={newAllowanceTaxable}
                  onChange={(e) => setNewAllowanceTaxable(e.target.value as 'Yes'|'No')}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-bold cursor-pointer"
                >
                  <option value="No">No (Exempted)</option>
                  <option value="Yes">Yes (Witholding)</option>
                </select>
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
                className="flex-1 bg-[#2f66e0] hover:opacity-95 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer whitespace-nowrap shrink-0"
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
                <select
                  value={newBonusPolicy}
                  onChange={(e) => setNewBonusPolicy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-bold cursor-pointer"
                >
                  <option value="Normal">Normal</option>
                  <option value="Working service">Working service</option>
                  <option value="LTIP">LTIP</option>
                </select>
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
                className="flex-1 bg-[#2f66e0] hover:opacity-95 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer whitespace-nowrap shrink-0"
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
                  placeholder="e.g. Fixed MYR 150"
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
                className="flex-1 bg-[#2f66e0] hover:opacity-95 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer whitespace-nowrap shrink-0"
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
                <select
                  value={newDeductionType}
                  onChange={(e) => setNewDeductionType(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-bold cursor-pointer"
                >
                  <option value="Statutory">Statutory</option>
                  <option value="Tax">Tax</option>
                  <option value="Rota rule">Rota rule</option>
                  <option value="Attendance">Attendance</option>
                  <option value="Leave">Leave</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tariff / Value Rate</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MYR 50.00/month"
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
                className="flex-1 bg-[#2f66e0] hover:opacity-95 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer whitespace-nowrap shrink-0"
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
                <select
                  value={newTaxOn}
                  onChange={(e) => setNewTaxOn(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-bold cursor-pointer"
                >
                  <option value="Monthly salary">Monthly salary</option>
                  <option value="Basic salary">Basic salary</option>
                  <option value="Overall emoluments">Overall emoluments</option>
                </select>
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
                className="flex-1 bg-[#2f66e0] hover:opacity-95 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer whitespace-nowrap shrink-0"
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
                <select
                  value={editingAllowance.policyType}
                  onChange={(e) => setEditingAllowance({ ...editingAllowance, policyType: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-bold cursor-pointer text-slate-800"
                >
                  <option value="Normal">Normal</option>
                  <option value="Transport">Transport</option>
                  <option value="Meal">Meal</option>
                  <option value="Shift">Shift</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Proposed Value (MYR)</label>
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
                <select
                  value={editingAllowance.taxable}
                  onChange={(e) => setEditingAllowance({ ...editingAllowance, taxable: e.target.value as 'Yes' | 'No' })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-bold cursor-pointer text-slate-800"
                >
                  <option value="No">No (Exempted)</option>
                  <option value="Yes">Yes (Withholding)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</label>
                <select
                  value={editingAllowance.status}
                  onChange={(e) => setEditingAllowance({ ...editingAllowance, status: e.target.value as 'Active' | 'Inactive' })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-bold cursor-pointer text-slate-800"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
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
                className="flex-1 bg-[#2f66e0] hover:opacity-95 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer whitespace-nowrap shrink-0"
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
                <select
                  value={editingBonus.policyType}
                  onChange={(e) => setEditingBonus({ ...editingBonus, policyType: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-bold cursor-pointer text-slate-800"
                >
                  <option value="Normal">Normal</option>
                  <option value="Working service">Working service</option>
                  <option value="LTIP">LTIP</option>
                </select>
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
                <select
                  value={editingBonus.onPayslip}
                  onChange={(e) => setEditingBonus({ ...editingBonus, onPayslip: e.target.value as 'Yes' | 'No' })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-bold cursor-pointer text-slate-800"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</label>
                <select
                  value={editingBonus.status}
                  onChange={(e) => setEditingBonus({ ...editingBonus, status: e.target.value as 'Active' | 'Inactive' })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-bold cursor-pointer text-slate-800"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
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
                className="flex-1 bg-[#2f66e0] hover:opacity-95 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer whitespace-nowrap shrink-0"
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
                  placeholder="e.g. Fixed MYR 150"
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
                <select
                  value={editingDeposit.status}
                  onChange={(e) => setEditingDeposit({ ...editingDeposit, status: e.target.value as 'Active' | 'Inactive' })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-bold cursor-pointer text-slate-800"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
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
                className="flex-1 bg-[#2f66e0] hover:opacity-95 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer whitespace-nowrap shrink-0"
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
                <select
                  value={editingDeduction.type}
                  onChange={(e) => setEditingDeduction({ ...editingDeduction, type: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-bold cursor-pointer text-slate-800"
                >
                  <option value="Statutory">Statutory</option>
                  <option value="Tax">Tax</option>
                  <option value="Rota rule">Rota rule</option>
                  <option value="Attendance">Attendance</option>
                  <option value="Leave">Leave</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tariff / Value Rate</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MYR 50.00/month"
                  value={editingDeduction.amountRate}
                  onChange={(e) => setEditingDeduction({ ...editingDeduction, amountRate: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Show on Payslip</label>
                <select
                  value={editingDeduction.onPayslip}
                  onChange={(e) => setEditingDeduction({ ...editingDeduction, onPayslip: e.target.value as 'Yes' | 'No' })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-bold cursor-pointer text-slate-800"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</label>
                <select
                  value={editingDeduction.status}
                  onChange={(e) => setEditingDeduction({ ...editingDeduction, status: e.target.value as 'Active' | 'Inactive' })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-bold cursor-pointer text-slate-800"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
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
                className="flex-1 bg-[#2f66e0] hover:opacity-95 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer whitespace-nowrap shrink-0"
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
                <select
                  value={editingTax.calculateOn}
                  onChange={(e) => setEditingTax({ ...editingTax, calculateOn: e.target.value })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-bold cursor-pointer text-slate-800"
                >
                  <option value="Monthly salary">Monthly salary</option>
                  <option value="Basic salary">Basic salary</option>
                  <option value="Overall emoluments">Overall emoluments</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Calculate Overall Income</label>
                <select
                  value={editingTax.calcOverallIncome}
                  onChange={(e) => setEditingTax({ ...editingTax, calcOverallIncome: e.target.value as 'Yes' | 'No' })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-bold cursor-pointer text-slate-800"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</label>
                <select
                  value={editingTax.status}
                  onChange={(e) => setEditingTax({ ...editingTax, status: e.target.value as 'Active' | 'Inactive' })}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-bold cursor-pointer text-slate-800"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
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
                className="flex-1 bg-[#2f66e0] hover:opacity-95 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer whitespace-nowrap shrink-0"
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
                <span className="font-bold text-slate-800">MYR 18,250.00</span>
              </div>
              <div className="flex justify-between text-slate-500 font-semibold">
                <span>Approved Meal Allowance</span>
                <span className="font-bold text-slate-800">MYR 12,400.00</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-800">
                <span>Grand Committed Total</span>
                <span className="text-[#2f66e0]">MYR 30,650.00</span>
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
                className="flex-1 bg-[#2f66e0] hover:opacity-95 text-white text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer"
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
                  <select
                    value={otPolicySettings.calculateBy}
                    onChange={(e) => setOtPolicySettings({ ...otPolicySettings, calculateBy: e.target.value })}
                    className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-bold text-slate-800 cursor-pointer"
                  >
                    <option value="Per minute rate">Per minute rate</option>
                    <option value="Per half hour">Per half hour</option>
                    <option value="Per hour block">Per hour block</option>
                  </select>
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
                className="flex-1 bg-[#2f66e0] hover:opacity-95 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer whitespace-nowrap shrink-0"
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
              id: `EMP-${Math.floor(Math.random() * 900) + 100}`,
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
                <select
                  value={newOtStaffDept}
                  onChange={(e) => setNewOtStaffDept(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-bold cursor-pointer text-slate-800"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Operations">Operations</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Sales & Finance">Sales & Finance</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Policy Type</label>
                <select
                  value={newOtStaffPolicy}
                  onChange={(e) => setNewOtStaffPolicy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-bold cursor-pointer text-slate-800"
                >
                  <option value="Salary-based">Salary-based</option>
                  <option value="Hourly override">Hourly override</option>
                  <option value="Fixed amount">Fixed amount</option>
                  <option value="Exempted">Exempted</option>
                </select>
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
                className="flex-1 bg-[#2f66e0] hover:opacity-95 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer whitespace-nowrap shrink-0"
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
                className="flex-1 bg-[#2f66e0] hover:opacity-95 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer whitespace-nowrap shrink-0"
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
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Deducted Amount (MYR)</label>
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
                className="flex-1 bg-[#2f66e0] hover:opacity-95 text-white text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer whitespace-nowrap shrink-0"
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
              id: `EMOL-${Date.now().toString().slice(-2)}`,
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
                <select
                  value={newEmolLimit}
                  onChange={(e) => setNewEmolLimit(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-bold cursor-pointer text-slate-800"
                >
                  <option value="No Limit">No Limit (Fully Taxable)</option>
                  <option value="MYR 1,200 annually">MYR 1,200 annually</option>
                  <option value="MYR 3,000 annually">MYR 3,000 annually</option>
                  <option value="MYR 5,000 annually">MYR 5,000 annually</option>
                  <option value="Exempt from tax">Exempt from tax</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Initial Taxable Status</label>
                <select
                  value={newEmolTaxable ? 'yes' : 'no'}
                  onChange={(e) => setNewEmolTaxable(e.target.value === 'yes')}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-bold cursor-pointer text-slate-800"
                >
                  <option value="yes">Taxable Component</option>
                  <option value="no">Tax-Exempt Component</option>
                </select>
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
                className="flex-1 bg-[#2f66e0] hover:opacity-95 text-white text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer whitespace-nowrap shrink-0"
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
                <select
                  value={newDurationStatus}
                  onChange={(e) => setNewDurationStatus(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs p-2.5 rounded-xl w-full focus:outline-none focus:bg-white font-bold cursor-pointer text-slate-800"
                >
                  <option value="Draft">Draft</option>
                  <option value="Approved">Approved</option>
                  <option value="Current">Current Cycle</option>
                </select>
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
                className="flex-1 bg-[#2f66e0] hover:opacity-95 text-white text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer whitespace-nowrap shrink-0"
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
                className="flex-1 bg-[#2f66e0] hover:opacity-95 text-white text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer whitespace-nowrap shrink-0"
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

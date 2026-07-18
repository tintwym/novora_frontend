import { useState, type FormEvent } from 'react'
import {
  Receipt,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Search,
  Settings,
  PlusCircle,
  RotateCcw,
  Download,
  Check,
  X,
  Paperclip,
  ShieldAlert,
  PieChart,
  FileSpreadsheet,
  ChevronDown,
  Printer,
} from 'lucide-react'
import { showActionToast } from '../../utils/actionToast'
import { nextSeq } from '../../utils/nextSeq';

export type ModuleEmployeeOption = {
  id: string
  name: string
  department?: string
}

type ClaimsTabProps = {
  employees: ModuleEmployeeOption[]
}

interface Claim {
  id: string;
  empId: string;
  empName: string;
  department: string;
  category: string;
  date: string;
  amount: number;
  currency: string;
  myrEquivalent: number;
  vendor: string;
  approvalChain: string;
  policyFlag: 'Clear' | 'Flagged' | 'Over limit' | 'Duplicate' | 'Late';
  status: 'Pending' | 'Approved' | 'Rejected';
  payrollMonth: string;
  pushStatus: 'Pushed' | 'Queued' | '—';
  description: string;
  hasAttachment: boolean;
}

export function ClaimsTab({ employees }: ClaimsTabProps) {
  const addToast = (text: string, type?: 'success' | 'loading' | 'error' | 'info') => {
    showActionToast(text, type)
  }

  // Navigation sub-tabs
  const [activeSubTab, setActiveSubTab] = useState<'Submit Claim' | 'Approval' | 'Policy & Compliance' | 'Payroll Integration' | 'Analytics & Reports' | 'Claim History'>('Submit Claim');

  // Interactive filters (global / header scoped)
  const [headerMonth, setHeaderMonth] = useState<string>('May 2026');
  const [headerDept, setHeaderDept] = useState<string>('All departments');
  
  // Controls dropdown states
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);

  // Core Database of Claims
  const [claims, setClaims] = useState<Claim[]>([
    {
      id: 'CLM-001',
      empId: 'EMP-001',
      empName: 'Sarah Lim',
      department: 'Engineering',
      category: 'Meal allowance',
      date: '2026-05-05',
      amount: 38.50,
      currency: 'MYR',
      myrEquivalent: 38.50,
      vendor: 'Nando\'s',
      approvalChain: 'David Ng',
      policyFlag: 'Clear',
      status: 'Pending',
      payrollMonth: 'May 2026',
      pushStatus: '—',
      description: 'Project wrap-up dinner with front-end development lead.',
      hasAttachment: true
    },
    {
      id: 'CLM-002',
      empId: 'EMP-002',
      empName: 'Raj Kumar',
      department: 'Operations',
      category: 'Hotel / stay',
      date: '2026-04-28',
      amount: 450.00,
      currency: 'MYR',
      myrEquivalent: 450.00,
      vendor: 'Marriott KL',
      approvalChain: 'David \u2192 Ahmad W',
      policyFlag: 'Clear',
      status: 'Pending',
      payrollMonth: 'May 2026',
      pushStatus: '—',
      description: 'Stakeholder workshop overnight accommodation.',
      hasAttachment: true
    },
    {
      id: 'CLM-003',
      empId: 'EMP-003',
      empName: 'Maya Tan',
      department: 'Finance',
      category: 'Air ticket',
      date: '2026-04-25',
      amount: 280.00,
      currency: 'USD',
      myrEquivalent: 1310.40, // 280 * 4.68
      vendor: 'AirAsia',
      approvalChain: 'Nina \u2192 Ahmad W | Finance',
      policyFlag: 'Flagged',
      status: 'Pending',
      payrollMonth: 'May 2026',
      pushStatus: '—',
      description: 'SaaS audit assembly flights to head office.',
      hasAttachment: true
    },
    {
      id: 'CLM-004',
      empId: 'EMP-004',
      empName: 'Ahmad L',
      department: 'HR',
      category: 'Meal allowance',
      date: '2026-05-06',
      amount: 42.00,
      currency: 'MYR',
      myrEquivalent: 42.00,
      vendor: 'Subway Sdn Bhd',
      approvalChain: 'Malik Said',
      policyFlag: 'Over limit',
      status: 'Pending',
      payrollMonth: 'May 2026',
      pushStatus: '—',
      description: 'Candidate screening lunches.',
      hasAttachment: false
    },
    {
      id: 'CLM-005',
      empId: 'EMP-005',
      empName: 'Nadia Chen',
      department: 'Marketing',
      category: 'Transport',
      date: '2026-05-03',
      amount: 120.00,
      currency: 'MYR',
      myrEquivalent: 120.00,
      vendor: 'Grab',
      approvalChain: 'Kevin Lim',
      policyFlag: 'Clear',
      status: 'Approved',
      payrollMonth: 'May 2026',
      pushStatus: 'Pushed',
      description: 'Client roadshow transport.',
      hasAttachment: true
    },
    {
      id: 'CLM-006',
      empId: 'EMP-001',
      empName: 'Sarah Lim',
      department: 'Engineering',
      category: 'Wellness',
      date: '2026-05-01',
      amount: 180.00,
      currency: 'MYR',
      myrEquivalent: 180.00,
      vendor: 'Fitness First',
      approvalChain: 'David Ng',
      policyFlag: 'Clear',
      status: 'Approved',
      payrollMonth: 'May 2026',
      pushStatus: 'Pushed',
      description: 'Corporate gym membership monthly reimbursement.',
      hasAttachment: true
    },
    {
      id: 'CLM-007',
      empId: 'EMP-005',
      empName: 'Nadia Chen',
      department: 'Marketing',
      category: 'Mileage',
      date: '2026-04-15',
      amount: 78.40,
      currency: 'MYR',
      myrEquivalent: 78.40,
      vendor: '—',
      approvalChain: 'Kevin Lim',
      policyFlag: 'Clear',
      status: 'Approved',
      payrollMonth: 'Apr 2026',
      pushStatus: 'Pushed',
      description: 'Travel to warehouse support operations (142km).',
      hasAttachment: false
    },
    {
      id: 'CLM-008',
      empId: 'EMP-001',
      empName: 'Sarah Lim',
      department: 'Engineering',
      category: 'Meal allowance',
      date: '2026-04-20',
      amount: 55.00,
      currency: 'MYR',
      myrEquivalent: 55.00,
      vendor: 'Nando\'s',
      approvalChain: 'Kevin Lim',
      policyFlag: 'Clear',
      status: 'Rejected',
      payrollMonth: 'May 2026',
      pushStatus: '—',
      description: 'Late submission claim without receipt proof.',
      hasAttachment: false
    }
  ]);

  // Submit Claim tab states
  const [claimCategory, setClaimCategory] = useState<string>('-- Select category --');
  const [claimDate, setClaimDate] = useState<string>('2026-05-06');
  const [claimVendor, setClaimVendor] = useState<string>('');
  const [claimCurrency, setClaimCurrency] = useState<string>('MYR');
  const [claimAmount, setClaimAmount] = useState<string>('0.00');
  const [claimProject, setClaimProject] = useState<string>('-- Select (optional) --');
  const [claimDesc, setClaimDesc] = useState<string>('');
  const [selectedStaffName, setSelectedStaffName] = useState<string>('');
  const [hasReceiptFile, setHasReceiptFile] = useState<boolean>(false);
  const [sendEmailNotification, setSendEmailNotification] = useState<boolean>(true);
  
  // Scanning OCR animation states
  const [isOcrScanning, setIsOcrScanning] = useState<boolean>(false);
  const [ocrProgress, setOcrProgress] = useState<number>(0);

  // Approval filters
  const [approvalStatusFilter, setApprovalStatusFilter] = useState<string>('All status');
  const [approvalCategoryFilter, setApprovalCategoryFilter] = useState<string>('All categories');
  const [approvalDeptFilter, setApprovalDeptFilter] = useState<string>('All departments');
  const [approvalDateFilter, setApprovalDateFilter] = useState<string>('');

  // History filters
  const [historyStatusFilter, setHistoryStatusFilter] = useState<string>('All status');
  const [historyCategoryFilter, setHistoryCategoryFilter] = useState<string>('All categories');
  const [historyDeptFilter, setHistoryDeptFilter] = useState<string>('All departments');
  const [historySearchQuery, setHistorySearchQuery] = useState<string>('');

  // Custom Report Generator states (The "Employee Reports" counterpart under claims)
  const [repDept, setRepDept] = useState<string>('All');
  const [repCategory, setRepCategory] = useState<string>('All');
  const [repStatus, setRepStatus] = useState<string>('All');
  const [repQuery, setRepQuery] = useState<string>('');
  const [_isReportGenerated, setIsReportGenerated] = useState<boolean>(false);

  // State calculations
  const pendingCount = claims.filter(c => c.status === 'Pending').length;

  // Meal daily limit threshold check
  const calculatedMyrEquivalent = () => {
    const amt = parseFloat(claimAmount) || 0;
    if (claimCurrency === 'USD') return parseFloat((amt * 4.68).toFixed(2));
    if (claimCurrency === 'SGD') return parseFloat((amt * 3.47).toFixed(2));
    if (claimCurrency === 'EUR') return parseFloat((amt * 5.12).toFixed(2));
    return amt;
  };

  const myrEquiv = calculatedMyrEquivalent();
  const mealLimitAlert = claimCategory === 'Meal allowance' && myrEquiv > 30.00;
  const transportLimitAlert = claimCategory === 'Transport' && myrEquiv > 200.00;

  // Handle OCR receipt simulation
  const handleScanReceipt = () => {
    setIsOcrScanning(true);
    setOcrProgress(0);
    addToast('Initializing neural OCR engine...', 'info');

    const interval = setInterval(() => {
      setOcrProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsOcrScanning(false);
            setClaimCategory('Meal allowance');
            setClaimDate('2026-05-06');
            setClaimVendor('Nando\'s Cafe Sdn Bhd');
            setClaimCurrency('MYR');
            setClaimAmount('42.00');
            setClaimDesc('Project wrap-up lunch assessment with product partners.');
            setHasReceiptFile(true);
            setSelectedStaffName('Ahmad L');
            addToast('Receipt scanned! Extracted MYR 42.00 from Nando\'s on 06/05/2026.', 'success');
          }, 300);
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  // Interactive UI Modal States
  const [selectedClaimDetail, setSelectedClaimDetail] = useState<Claim | null>(null);

  // Approval rules state
  const [approvalRules, setApprovalRules] = useState([
    { id: 1, range: 'Claims ≤ MYR 200', desc: 'Direct manager only — single approval', type: 'Sequential' },
    { id: 2, range: 'Claims MYR 201 – MYR 1,000', desc: 'Manager → Department Head', type: 'Sequential' },
    { id: 3, range: 'Claims > MYR 1,000', desc: 'Manager → Dept Head → Finance Director', type: 'Parallel with Dept Head' }
  ]);
  const [isEditApprovalRulesModalOpen, setIsEditApprovalRulesModalOpen] = useState(false);

  // Spend limits state
  const [spendLimits, setSpendLimits] = useState([
    { category: 'Meal allowance', daily: 'MYR 30', monthly: 'MYR 600', receiptReq: '> MYR 15' },
    { category: 'Transport', daily: 'MYR 200', monthly: 'MYR 2,000', receiptReq: '> MYR 50' },
    { category: 'Hotel / stay', daily: 'MYR 350/night', monthly: '—', receiptReq: 'Always' },
    { category: 'Air ticket', daily: '—', monthly: 'MYR 5,000', receiptReq: 'Always' },
    { category: 'Mileage', daily: '—', monthly: 'MYR 500', receiptReq: 'MYR 0.55/km' },
    { category: 'Entertainment', daily: 'MYR 150', monthly: 'MYR 1,000', receiptReq: 'Always' },
    { category: 'Wellness', daily: '—', monthly: 'MYR 300/yr', receiptReq: '> MYR 50' }
  ]);
  const [isEditSpendLimitsModalOpen, setIsEditSpendLimitsModalOpen] = useState(false);
  const [selectedSpendLimitIdx, setSelectedSpendLimitIdx] = useState<number | null>(null);

  // Validation rules checklist state
  const [validationRules, setValidationRules] = useState([
    { id: 1, label: 'Flag claims exceeding daily / monthly category limits', enabled: true },
    { id: 2, label: 'Detect duplicate submissions (same vendor + date + amount)', enabled: true },
    { id: 3, label: 'Block claims submitted more than 30 days after receipt date', enabled: true },
    { id: 4, label: 'Require receipt attachment for claims above threshold', enabled: true },
    { id: 5, label: 'Auto-convert foreign currency at live exchange rate', enabled: true },
    { id: 6, label: 'Hold claims from employees on notice period', enabled: true },
    { id: 7, label: 'Notify HR on claims exceeding MYR 1,000', enabled: true }
  ]);
  const [isEditValidationRulesModalOpen, setIsEditValidationRulesModalOpen] = useState(false);
  const [newRuleInput, setNewRuleInput] = useState('');

  // Payroll integration push state
  const [isPayrollPushModalOpen, setIsPayrollPushModalOpen] = useState(false);
  const [payrollIntegrationChannel, setPayrollIntegrationChannel] = useState('Workday ERP Connector v2.4');
  const [isPushingInProgress, setIsPushingInProgress] = useState(false);
  const [pushProgressPct, setPushProgressPct] = useState(0);

  // Handle submit claim
  const handleSubmitClaim = (e: FormEvent) => {
    e.preventDefault();
    if (claimCategory.includes('--Select') || claimCategory === '') {
      addToast('Please select a valid claim category.', 'error');
      return;
    }
    const parsedAmount = parseFloat(claimAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      addToast('Please input an amount greater than 0.', 'error');
      return;
    }

    const matchedStaff = employees[Math.floor(Math.random() * employees.length)] || { name: 'Ahmad L', department: 'HR' };
    const nameToUse = selectedStaffName || matchedStaff.name;
    const deptToUse = employees.find(e => e.name === nameToUse)?.department || 'Finance';

    let badgeFlg: 'Clear' | 'Over limit' = 'Clear';
    if (claimCategory === 'Meal allowance' && myrEquiv > 30.00) badgeFlg = 'Over limit';
    if (claimCategory === 'Transport' && myrEquiv > 200.00) badgeFlg = 'Over limit';

    const claimSeq = nextSeq(claims.map(c => c.id), 300);
    const newClaimObj: Claim = {
      id: `CLM-${claimSeq}`,
      empId: `EMP-${claimSeq - 200}`,
      empName: nameToUse,
      department: deptToUse,
      category: claimCategory,
      date: claimDate,
      amount: parsedAmount,
      currency: claimCurrency,
      myrEquivalent: myrEquiv,
      vendor: claimVendor || 'Direct Submission',
      approvalChain: claimCategory === 'Air ticket' || myrEquiv > 1000 
        ? 'David \u2192 Ahmad W \u2192 Finance' 
        : myrEquiv > 200 
          ? 'David \u2192 Ahmad W' 
          : 'David Ng',
      policyFlag: badgeFlg,
      status: 'Pending',
      payrollMonth: 'May 2026',
      pushStatus: '—',
      description: claimDesc || 'Business reimbursement submission.',
      hasAttachment: hasReceiptFile
    };

    setClaims([newClaimObj, ...claims]);
    addToast(`Claim for MYR ${myrEquiv} submitted to approval workflow.`, 'success');

    // Reset Form
    setClaimCategory('-- Select category --');
    setClaimVendor('');
    setClaimAmount('0.00');
    setClaimDesc('');
    setHasReceiptFile(false);
  };

  // Action: Approve claim
  const handleApprove = (id: string) => {
    setClaims(claims.map(c => {
      if (c.id === id) {
        return { ...c, status: 'Approved', pushStatus: 'Queued' };
      }
      return c;
    }));
    addToast('Claim approved successfully. Added to next payroll queue.', 'success');
  };

  // Action: Reject claim
  const handleReject = (id: string) => {
    setClaims(claims.map(c => {
      if (c.id === id) {
        return { ...c, status: 'Rejected' };
      }
      return c;
    }));
    addToast('Claim rejected.', 'error');
  };

  // Action: Push queued to payroll
  const handlePushToPayroll = () => {
    const queuedCount = claims.filter(c => c.status === 'Approved' && c.pushStatus === 'Queued').length;
    if (queuedCount === 0) {
      addToast('No queued approved claims selected for payroll transfer.', 'info');
      return;
    }
    setIsPayrollPushModalOpen(true);
    setPushProgressPct(0);
    setIsPushingInProgress(false);
  };

  const executePayrollPush = () => {
    setIsPushingInProgress(true);
    setPushProgressPct(15);
    
    const interval = setInterval(() => {
      setPushProgressPct((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setClaims(prevClaims => prevClaims.map(c => {
              if (c.status === 'Approved' && c.pushStatus === 'Queued') {
                return { ...c, pushStatus: 'Pushed' };
              }
              return c;
            }));
            setIsPushingInProgress(false);
            setIsPayrollPushModalOpen(false);
            addToast('Synchronized claim reimbursements with bank credit files successfully.', 'success');
          }, 350);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  return (
    <div id="claims-tab-stage" className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. UPPER NAVIGATION & PRIMARY HORIZONTAL NAV-BAR - styled exactly like Payroll and Disciplinary */}
      <div id="claims-module-navigator" className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-200/85 pb-4 gap-4">
        
        {/* Navigation tabs styled as pills with active background */}
        <div id="claims-navigation-tabs" className="flex items-center gap-2 select-none overflow-x-auto w-full lg:w-auto scrollbar-none pb-1 lg:pb-0">
          {[
            { id: 'Submit Claim', label: 'Submit Claim', icon: PlusCircle },
            { id: 'Approval', label: 'Approval', icon: CheckCircle, badge: pendingCount, badgeColor: 'bg-amber-100 text-amber-700 border-amber-200' },
            { id: 'Policy & Compliance', label: 'Policy & Compliance', icon: ShieldAlert },
            { id: 'Payroll Integration', label: 'Payroll Integration', icon: FileSpreadsheet },
            { id: 'Analytics & Reports', label: 'Analytics & Reports', icon: PieChart },
            { id: 'Claim History', label: 'Claim History', icon: RotateCcw }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                id={`claims-tab-${tab.id.replace(/\s+/g, '-').replace(/&/g, 'and').toLowerCase()}`}
                key={tab.id}
                onClick={() => {
                  setActiveSubTab(tab.id as any);
                  addToast(`Opened ${tab.label} workstation view`, 'info');
                }}
                className={`text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all shrink-0 relative cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'text-[#2f66e0] bg-[#2f66e0]/10 border border-[#2f66e0]/15 font-extrabold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`font-bold text-[10px] h-4.5 min-w-4.5 px-1 rounded-full flex items-center justify-center border ${tab.badgeColor}`}>
                    {tab.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#2f66e0] rounded-sm" />
                )}
              </button>
            );
          })}
        </div>

        {/* Global top level controllers aligned on the right, integrated into the navigation grid */}
        <div id="claims-upper-actions" className="flex items-center gap-2.5 shrink-0 font-sans text-slate-700">
          
          {/* May 2026 / period selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
              className="h-9 inline-flex items-center gap-1.5 px-3.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl cursor-pointer whitespace-nowrap shrink-0"
            >
              <span className="whitespace-nowrap">{headerMonth}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            </button>
            {monthDropdownOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 animate-in slide-in-from-top-1">
                {['May 2026', 'Apr 2026', 'Mar 2026'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { setHeaderMonth(m); setMonthDropdownOpen(false); }}
                    className="w-full text-left px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold"
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Department dropdown filter */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDeptDropdownOpen(!deptDropdownOpen)}
              className="h-9 inline-flex items-center gap-1.5 px-3.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl cursor-pointer whitespace-nowrap shrink-0"
            >
              <span className="whitespace-nowrap">{headerDept}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            </button>
            {deptDropdownOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 animate-in slide-in-from-top-1">
                {['All departments', 'Engineering', 'Finance', 'HR', 'Marketing', 'Operations'].map((d) => (
                  <button
                    key={d}
                    onClick={() => { setHeaderDept(d); setDeptDropdownOpen(false); }}
                    className="w-full text-left px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold"
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export utility */}
          <button
            type="button"
            onClick={() => addToast('Exporting active claims ledger...', 'loading')}
            className="h-9 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3.5 rounded-xl inline-flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
          >
            <Download className="h-4 w-4 text-slate-400 shrink-0" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE STAGE FRAME */}
      <div id="claims-tab-inner-view">

        {/* ======================================================== */}
        {/* SUB-TAB 1: SUBMIT CLAIM */}
        {/* ======================================================== */}
        {activeSubTab === 'Submit Claim' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-100">
            
            {/* Left Box: Receipt upload & Recent claim states (cols-5) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Receipt Capture Box */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Receipt capture & OCR</h3>
                  <div className="flex gap-1">
                    <span className="bg-slate-50 text-[10px] font-semibold text-slate-500 px-2 py-0.5 rounded-md">Mobile upload</span>
                    <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-md">OCR scan</span>
                  </div>
                </div>

                <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50/50 flex flex-col items-center justify-center min-h-48 relative overflow-hidden group">
                  {isOcrScanning ? (
                    <div className="space-y-3 w-full max-w-xs">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                      <p className="text-xs font-bold text-slate-700">Extracting transaction meta...</p>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-1.5 transition-all duration-300" style={{ width: `${ocrProgress}%` }}></div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="h-10 w-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform shadow-xs mb-3">
                        <Paperclip className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-800">Snap or upload receipt</p>
                      <p className="text-[10px] font-medium text-slate-400 mt-1">JPG, PNG, PDF &bull; max 10MB</p>
                      <button
                        onClick={handleScanReceipt}
                        className="mt-4 bg-[#2f66e0] hover:bg-blue-600 text-white text-[11px] font-black tracking-wide px-4 py-1.5 rounded-lg transition-colors cursor-pointer uppercase"
                      >
                        Scan receipt
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* My Recent Claims Widget */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">My recent claims</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-medium text-slate-600">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 text-[10px] tracking-wider uppercase font-bold">
                        <th className="pb-2.5">Date</th>
                        <th className="pb-2.5">Category</th>
                        <th className="pb-2.5">Amount</th>
                        <th className="pb-2.5 text-center">Status</th>
                        <th className="pb-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {claims.slice(0, 5).map((claim) => (
                        <tr key={claim.id} className="hover:bg-slate-50/20">
                          <td className="py-3 font-semibold text-slate-800">
                            {new Date(claim.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </td>
                          <td className="py-3 text-slate-600">{claim.category}</td>
                          <td className="py-3 font-bold text-slate-700">
                            {claim.currency} {claim.amount.toFixed(2)}
                          </td>
                          <td className="py-3 text-center">
                            <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              claim.status === 'Approved'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : claim.status === 'Rejected'
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {claim.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedClaimDetail(claim);
                                addToast(`Opened full database transaction file for claim ${claim.id}`, 'success');
                              }}
                              className="bg-slate-50 hover:bg-[#2f66e0]/10 hover:text-[#2f66e0] text-slate-600 border border-slate-200 hover:border-[#2f66e0]/20 font-bold px-2.5 py-1 rounded-lg text-xs cursor-pointer transition-all"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Right Box: Form inputs (cols-7) */}
            <form onSubmit={handleSubmitClaim} className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Claim entry form</h3>
                <span className="bg-slate-50 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-lg">Claim details</span>
              </div>

              {/* Employee Selection Mapping (Real links support) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Claimant Employee Name *</label>
                  <select
                    value={selectedStaffName}
                    onChange={(e) => setSelectedStaffName(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#2f66e0] rounded-xl px-3 py-2 outline-none cursor-pointer"
                  >
                    <option value="">Consolidated Selection (Choose employee)</option>
                    {[
                      { name: 'Sarah Lim' },
                      { name: 'Raj Kumar' },
                      { name: 'Maya Tan' },
                      { name: 'Ahmad L' },
                      { name: 'Nadia Chen' }
                    ].map((em) => (
                      <option key={em.name} value={em.name}>{em.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Claim category *</label>
                  <select
                    value={claimCategory}
                    onChange={(e) => setClaimCategory(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#2f66e0] rounded-xl px-3 py-2 outline-none cursor-pointer"
                  >
                    <option>-- Select category --</option>
                    <option value="Meal allowance">Meal allowance</option>
                    <option value="Transport">Transport</option>
                    <option value="Hotel / stay">Hotel / stay</option>
                    <option value="Air ticket">Air ticket</option>
                    <option value="Mileage">Mileage</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Wellness">Wellness</option>
                  </select>
                </div>
              </div>

              {/* Date & Vendor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Claim date *</label>
                  <input
                    type="date"
                    value={claimDate}
                    onChange={(e) => setClaimDate(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#2f66e0] rounded-xl px-3 py-1.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Vendor / merchant</label>
                  <input
                    type="text"
                    placeholder="e.g. Subway Sdn Bhd"
                    value={claimVendor}
                    onChange={(e) => setClaimVendor(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#2f66e0] rounded-xl px-3 py-2 outline-none"
                  />
                </div>
              </div>

              {/* Currency & Amount calculations */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Currency *</label>
                  <select
                    value={claimCurrency}
                    onChange={(e) => setClaimCurrency(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#2f66e0] rounded-xl px-3 py-2 outline-none cursor-pointer"
                  >
                    <option value="MYR">MYR</option>
                    <option value="USD">USD</option>
                    <option value="SGD">SGD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(e.target.value)}
                    className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#2f66e0] rounded-xl px-3 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">MYR equiv.</label>
                  <div className="w-full text-xs font-black text-slate-500 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                    {claimCurrency === 'MYR' ? 'Auto-converted' : `MYR ${myrEquiv.toFixed(2)}`}
                  </div>
                </div>
              </div>

              {/* Exchange rate info badge */}
              <div className="bg-blue-50 border border-blue-100/50 rounded-xl p-3 text-[11px] font-semibold text-[#2f66e0] flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-[#2f66e0] rounded-full animate-ping"></span>
                <span>Live exchange rate: 1 USD = 4.68 MYR &bull; 1 SGD = 3.47 MYR &bull; 1 EUR = 5.12 MYR (updated 1 min ago)</span>
              </div>

              {/* Project / cost centre */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Project / cost centre</label>
                <select
                  value={claimProject}
                  onChange={(e) => setClaimProject(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#2f66e0] rounded-xl px-3 py-2 outline-none cursor-pointer"
                >
                  <option>-- Select (optional) --</option>
                  <option value="Dept General Operations">Corporate Overhead &bull; General</option>
                  <option value="SaaS Integration Audit">Internal Audit Tech Team</option>
                  <option value="Sales Campaign Q2">Marketing Acquisition Launch 2026</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Claim description</label>
                <textarea
                  rows={3}
                  placeholder="Brief description of the business purpose of the expense..."
                  value={claimDesc}
                  onChange={(e) => setClaimDesc(e.target.value)}
                  className="w-full text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:border-slate-300 focus:border-[#2f66e0] rounded-xl px-3.5 py-2.5 outline-none resize-none"
                />
              </div>

              {/* Receipt attachment status indicator */}
              <div id="receipt-attachment-row" className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded uppercase">Receipt attachment</span>
                  <span className="text-[10px] font-bold text-slate-500">
                    {hasReceiptFile ? '✓ Receipt attached' : 'Upload receipt (required for claims > MYR 50)'}
                  </span>
                </div>
                {hasReceiptFile && (
                  <button
                    type="button"
                    onClick={() => { setHasReceiptFile(false); addToast('Receipt detached.', 'info'); }}
                    className="text-red-500 hover:text-red-600 font-bold text-xs"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Dynamic Policy Alert Section */}
              {mealLimitAlert && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs font-medium text-amber-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>Policy alert: Meal allowance daily limit exceeded</span>
                  </div>
                  <p className="leading-relaxed text-amber-700">
                    Meal allowance daily limit is MYR 30.00. Your claim of MYR {myrEquiv.toFixed(2)} exceeds the limit by MYR {(myrEquiv - 30).toFixed(2)}. Additional approval required.
                  </p>
                </div>
              )}

              {transportLimitAlert && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs font-medium text-amber-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>Policy alert: Transport daily limit exceeded</span>
                  </div>
                  <p className="leading-relaxed text-amber-700">
                    Transport daily limit is MYR 200.00. Your claim of MYR {myrEquiv.toFixed(2)} exceeds the limit by MYR {(myrEquiv - 200).toFixed(2)}. Additional approval required.
                  </p>
                </div>
              )}

              {/* Send email notification */}
              <div className="flex items-center gap-2">
                <input
                  id="notif-approver-cb"
                  type="checkbox"
                  checked={sendEmailNotification}
                  onChange={(e) => setSendEmailNotification(e.target.checked)}
                  className="h-4 w-4 text-[#2f66e0] border-slate-200 rounded-sm focus:ring-[#2f66e0]"
                />
                <label htmlFor="notif-approver-cb" className="text-xs font-semibold text-slate-600 cursor-pointer">
                  Send email notification to approver
                </label>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3.5 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    addToast('Draft claims are saved temporarily in memory.', 'info');
                  }}
                  className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 transition-colors rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Save draft
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#2f66e0] hover:bg-blue-700 transition-colors rounded-xl text-xs font-black text-white shadow-xs cursor-pointer"
                >
                  Submit claim
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-TAB 2: APPROVAL (Real interactions & custom layout) */}
        {/* ======================================================== */}
        {activeSubTab === 'Approval' && (
          <div className="space-y-6 animate-in fade-in duration-100">
            {/* Horizontal Filter Bar */}
            <div className="bg-slate-50/50 border border-slate-100 p-4.5 rounded-2xl flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={approvalStatusFilter}
                  onChange={(e) => setApprovalStatusFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs text-slate-600 font-bold outline-none cursor-pointer"
                >
                  <option value="All status">All status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <select
                  value={approvalCategoryFilter}
                  onChange={(e) => setApprovalCategoryFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs text-slate-600 font-bold outline-none cursor-pointer"
                >
                  <option value="All categories">All categories</option>
                  <option value="Meal allowance">Meal allowance</option>
                  <option value="Transport">Transport</option>
                  <option value="Hotel / stay">Hotel / stay</option>
                  <option value="Air ticket">Air ticket</option>
                  <option value="Mileage">Mileage</option>
                  <option value="Wellness">Wellness</option>
                </select>

                <select
                  value={approvalDeptFilter}
                  onChange={(e) => setApprovalDeptFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs text-slate-600 font-bold outline-none cursor-pointer"
                >
                  <option value="All departments">All departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Finance">Finance</option>
                  <option value="HR">HR</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                </select>

                <input
                  type="date"
                  value={approvalDateFilter}
                  onChange={(e) => setApprovalDateFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3.5 py-1 text-xs text-slate-600 font-semibold outline-none"
                />

                <span className="bg-amber-50 text-amber-700 font-extrabold text-xs px-3 py-1 rounded-full border border-amber-200">
                  {claims.filter(c => c.status === 'Pending').length} pending approval
                </span>
              </div>

              <button
                onClick={() => {
                  setApprovalStatusFilter('All status');
                  setApprovalCategoryFilter('All categories');
                  setApprovalDeptFilter('All departments');
                  setApprovalDateFilter('');
                  addToast('Reset filters', 'info');
                }}
                className="text-slate-500 hover:text-slate-800 text-xs font-bold px-3 py-1 bg-white border border-slate-100 rounded-xl"
              >
                Reset
              </button>
            </div>

            {/* Approval Routing Rules Checklist Widget */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[13px] font-black text-slate-700 uppercase tracking-wider">Approval routing rules</h3>
                <button
                  onClick={() => setIsEditApprovalRulesModalOpen(true)}
                  className="text-[#2f66e0] hover:underline text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Settings className="h-3 w-3" />
                  <span>Edit rules</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-600">
                {approvalRules.map((rule, idx) => (
                  <div key={rule.id} className="border border-slate-100 rounded-xl p-4 space-y-2 flex items-start gap-3 bg-slate-50/20 hover:border-blue-200 transition-all">
                    <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0">{idx + 1}</div>
                    <div>
                      <h4 className="font-bold text-slate-800">{rule.range}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-normal">{rule.desc}</p>
                      <span className={`inline-block mt-2 text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${
                        rule.type.includes('Parallel') ? 'bg-purple-50 text-purple-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>{rule.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Approval Datatable */}
            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold text-[10px] tracking-wider uppercase">
                    <th className="p-4 pl-6">Employee</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Approval chain</th>
                    <th className="p-4 text-center">Policy flag</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right pr-6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {claims
                    .filter(c => {
                      const matchesStatus = approvalStatusFilter === 'All status' || c.status === approvalStatusFilter;
                      const matchesCategory = approvalCategoryFilter === 'All categories' || c.category === approvalCategoryFilter;
                      const matchesDept = approvalDeptFilter === 'All departments' || c.department === approvalDeptFilter;
                      const matchesDate = approvalDateFilter === '' || c.date === approvalDateFilter;
                      return matchesStatus && matchesCategory && matchesDept && matchesDate;
                    })
                    .map((claim) => (
                      <tr key={claim.id} className="hover:bg-slate-50/30">
                        <td className="p-4 pl-6 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-full bg-[#2f66e0]/10 text-[#2f66e0] font-black text-[10px] flex items-center justify-center">
                              {claim.empName.split(' ').map(n=>n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-bold text-slate-800">{claim.empName}</div>
                              <div className="text-[10px] text-slate-400">{claim.department}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className={`inline-block px-2.5 py-1 rounded-md font-bold text-[10px] ${
                            claim.category === 'Meal allowance' ? 'bg-amber-50 text-amber-700' :
                            claim.category === 'Transport' ? 'bg-indigo-50 text-indigo-700' :
                            claim.category === 'Hotel / stay' ? 'bg-blue-50 text-blue-700' :
                            claim.category === 'Air ticket' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {claim.category}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap text-slate-500">
                          {new Date(claim.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </td>
                        <td className="p-4 whitespace-nowrap font-bold text-slate-800">
                          MYR {claim.myrEquivalent.toFixed(2)}
                          {claim.currency !== 'MYR' && (
                            <span className="block text-[9px] text-slate-400 font-semibold">{claim.currency} {claim.amount.toFixed(2)}</span>
                          )}
                        </td>
                        <td className="p-4 text-slate-500 font-mono text-[10.5px]">
                          {claim.approvalChain}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            claim.policyFlag === 'Clear' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                            {claim.policyFlag}
                          </span>
                        </td>
                        <td className="p-4 text-center whitespace-nowrap">
                          <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            claim.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                            claim.status === 'Rejected' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {claim.status}
                          </span>
                        </td>
                        <td className="p-4 text-right pr-6 whitespace-nowrap">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedClaimDetail(claim);
                                addToast(`Opened full database transaction file for claim ${claim.id}`, 'success');
                              }}
                              className="bg-slate-50 hover:bg-[#2f66e0]/10 hover:text-[#2f66e0] text-slate-600 border border-slate-200 hover:border-[#2f66e0]/20 font-bold px-2.5 py-1 rounded-lg text-xs cursor-pointer transition-all"
                            >
                              View
                            </button>
                            {claim.status === 'Pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(claim.id)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10.5px] px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(claim.id)}
                                  className="border border-red-200 hover:bg-red-50 text-red-600 font-bold text-[10.5px] px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-TAB 3: POLICY & COMPLIANCE */}
        {/* ======================================================== */}
        {activeSubTab === 'Policy & Compliance' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-100">
            {/* Category Spend limits & compliance checkboxes (cols-7) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Spend limits table */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Category spend limits</h3>
                  <button
                    onClick={() => {
                      setSelectedSpendLimitIdx(0);
                      setIsEditSpendLimitsModalOpen(true);
                      addToast('Select a category row to modify specific spending caps.', 'info');
                    }}
                    className="text-[#2f66e0] hover:underline text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Settings className="h-3 w-3" />
                    <span>Edit limits</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-medium text-slate-600">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold text-[10px] tracking-wider uppercase">
                        <th className="pb-2.5">Category</th>
                        <th className="pb-2.5">Daily limit</th>
                        <th className="pb-2.5">Monthly cap</th>
                        <th className="pb-2.5">Receipt req.</th>
                        <th className="pb-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {spendLimits.map((limit, idx) => (
                        <tr key={limit.category} className="hover:bg-slate-50/40">
                          <td className="py-3 font-bold text-slate-800">{limit.category}</td>
                          <td className="py-3 text-slate-600">{limit.daily}</td>
                          <td className="py-3 text-slate-600">{limit.monthly}</td>
                          <td className="py-3">
                            <span className={`text-[9px] px-2 py-0.5 rounded border font-black ${
                              limit.receiptReq.includes('Always') 
                                ? 'bg-red-50 text-red-700 border-red-100' 
                                : limit.receiptReq === '—' 
                                  ? 'bg-slate-100 text-slate-500' 
                                  : 'bg-amber-50 text-amber-700 border-amber-100'
                            }`}>
                              {limit.receiptReq}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button 
                              onClick={() => {
                                setSelectedSpendLimitIdx(idx);
                                setIsEditSpendLimitsModalOpen(true);
                              }} 
                              className="text-[#2f66e0] hover:underline hover:text-blue-800 text-xs font-bold cursor-pointer"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Auto validation rules */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Auto-validation rules</h3>
                  <button 
                    onClick={() => setIsEditValidationRulesModalOpen(true)} 
                    className="text-[#2f66e0] hover:underline text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Settings className="h-3 w-3" />
                    <span>Edit rules</span>
                  </button>
                </div>

                <div className="space-y-3.5">
                  {validationRules.map((rule) => (
                    <div key={rule.id} className="flex items-start gap-2.5 text-xs font-semibold text-slate-700">
                      <input 
                        type="checkbox" 
                        checked={rule.enabled} 
                        onChange={() => {
                          setValidationRules(validationRules.map(r => r.id === rule.id ? { ...r, enabled: !r.enabled } : r));
                          addToast(`${rule.enabled ? 'Disabled' : 'Enabled'} validation check rule.`, 'info');
                        }}
                        className="h-4 w-4 text-[#2f66e0] border-slate-300 rounded mt-0.5 focus:ring-[#2f66e0] cursor-pointer" 
                      />
                      <span className={rule.enabled ? 'text-slate-800' : 'text-slate-400 line-through font-normal'}>{rule.label}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Side: Flags Feed & Recent Audit actions (cols-5) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Policy flags sidebar */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Policy flags &mdash; this month</h3>
                  <span className="bg-red-100 text-red-700 text-[10px] font-black px-2 py-0.5 rounded-md">8 flags</span>
                </div>

                <div className="space-y-4 text-xs font-semibold">
                  <div className="flex items-start gap-3 p-3 bg-red-50/20 border border-red-100 rounded-xl">
                    <div className="h-2 w-2 rounded-full bg-amber-500 mt-1 shrink-0" />
                    <div className="flex-1">
                      <p className="text-slate-800 font-bold">Meal limit exceeded</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Ahmad L &bull; MYR 42.00 vs MYR 30 limit</p>
                    </div>
                    <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-2 py-0.5 rounded uppercase">Pending</span>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-red-50/20 border border-red-100 rounded-xl">
                    <div className="h-2 w-2 rounded-full bg-red-600 mt-1 shrink-0" />
                    <div className="flex-1">
                      <p className="text-slate-800 font-bold">Duplicate submission</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Zara N &bull; Same vendor + date as 28 Apr</p>
                    </div>
                    <span className="bg-red-100 text-red-800 text-[9px] font-black px-2 py-0.5 rounded uppercase">Blocked</span>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-red-50/20 border border-red-100 rounded-xl">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-1 shrink-0" />
                    <div className="flex-1">
                      <p className="text-slate-800 font-bold">Late submission</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Raj K &bull; Receipt dated 28 Feb, submitted 5 May</p>
                    </div>
                    <span className="bg-indigo-100 text-indigo-800 text-[9px] font-black px-2 py-0.5 rounded uppercase">Review</span>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-indigo-50/10 border border-indigo-100 rounded-xl">
                    <div className="h-2 w-2 rounded-full bg-purple-500 mt-1 shrink-0" />
                    <div className="flex-1">
                      <p className="text-slate-800 font-bold">Over category cap</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Maya T &bull; Air ticket MYR 1,280 needs Finance review</p>
                    </div>
                    <span className="bg-purple-100 text-purple-800 text-[9px] font-black px-2 py-0.5 rounded uppercase">Escalated</span>
                  </div>
                </div>
              </div>

              {/* Audit trail */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Audit trail &mdash; recent actions</h3>
                  <button onClick={() => addToast('Opening full systems audit ledger...', 'info')} className="text-slate-500 hover:text-slate-700 text-xs font-bold">Full log</button>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex gap-3">
                    <div className="h-2.5 w-2.5 bg-emerald-500 rounded-full mt-1 shrink-0" />
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold">6 May 10:42</span>
                      <p className="font-semibold text-slate-700 mt-0.5">
                        <strong className="text-slate-900 font-bold">David Ng</strong> approved MYR 120.00 transport &mdash; Nadia Chen
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="h-2.5 w-2.5 bg-red-500 rounded-full mt-1 shrink-0" />
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold">6 May 09:15</span>
                      <p className="font-semibold text-slate-700 mt-0.5">
                        <strong className="text-slate-900 font-bold">Kevin Lim</strong> rejected MYR 55.00 meal &mdash; Sarah Lim (over limit)
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="h-2.5 w-2.5 bg-amber-500 rounded-full mt-1 shrink-0" />
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold">5 May 16:30</span>
                      <p className="font-semibold text-slate-700 mt-0.5">
                        <strong className="text-slate-900 font-bold">System</strong> flagged duplicate &mdash; Zara Nor meal submission blocked
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="h-2.5 w-2.5 bg-emerald-500 rounded-full mt-1 shrink-0" />
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold">4 May 11:00</span>
                      <p className="font-semibold text-slate-700 mt-0.5">
                        <strong className="text-slate-900 font-bold">Nina Reza</strong> approved MYR 450.00 hotel &mdash; Raj Kumar (step 1/2)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-TAB 4: PAYROLL INTEGRATION */}
        {/* ======================================================== */}
        {activeSubTab === 'Payroll Integration' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-100">
            {/* Left side panel: Push status numbers (cols-4) */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-5">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-50 pb-3.5">Payroll push status &mdash; May 2026</h3>
                
                <div className="space-y-4 text-xs font-semibold">
                  <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                    <span className="text-slate-500">Total approved claims</span>
                    <span className="font-extrabold text-[#2f66e0]">
                      MYR {claims.filter(c => c.status === 'Approved').reduce((acc, curr) => acc + curr.myrEquivalent, 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                    <span className="text-slate-500">Pushed to payroll</span>
                    <span className="font-extrabold text-emerald-600">
                      MYR {claims.filter(c => c.status === 'Approved' && c.pushStatus === 'Pushed').reduce((acc, curr) => acc + curr.myrEquivalent, 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                    <span className="text-slate-500">Awaiting push</span>
                    <span className="font-extrabold text-amber-600">
                      MYR {claims.filter(c => c.status === 'Approved' && c.pushStatus === 'Queued').reduce((acc, curr) => acc + curr.myrEquivalent, 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                    <span className="text-slate-500">Payroll cut-off</span>
                    <span className="text-slate-800 font-bold">25 May 2026</span>
                  </div>

                  <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                    <span className="text-slate-500">Next payroll date</span>
                    <span className="text-slate-800 font-bold">31 May 2026</span>
                  </div>

                  <div className="flex justify-between items-center pt-2.5">
                    <span className="text-slate-500">Integration status</span>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] px-2.5 py-0.5 font-bold">Connected</span>
                  </div>
                </div>
              </div>

              {/* Currency conversion log bottom left */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Currency conversion log</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-semibold text-slate-600">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold text-[10px] tracking-wider uppercase">
                        <th className="pb-2">Employee</th>
                        <th className="pb-2">Orig.</th>
                        <th className="pb-2">Orig. amt</th>
                        <th className="pb-2">Rate</th>
                        <th className="pb-2 text-right">MYR equiv.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px] text-slate-700">
                      <tr>
                        <td className="py-2.5 font-bold text-slate-800">Maya T</td>
                        <td className="py-2.5">USD</td>
                        <td className="py-2.5">$280.00</td>
                        <td className="py-2.5">4.68</td>
                        <td className="py-2.5 text-right font-black text-slate-900">MYR 1,310.40</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold text-slate-800">Raj K</td>
                        <td className="py-2.5">SGD</td>
                        <td className="py-2.5">$130.00</td>
                        <td className="py-2.5">3.47</td>
                        <td className="py-2.5 text-right font-black text-slate-900">MYR 451.10</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold text-slate-800">Sarah L</td>
                        <td className="py-2.5">EUR</td>
                        <td className="py-2.5">&euro;45.00</td>
                        <td className="py-2.5">5.12</td>
                        <td className="py-2.5 text-right font-black text-slate-900">MYR 230.40</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Right side: Claims batching process (cols-8) */}
            <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Claims ready for payroll batch</h3>
                  <span className="bg-amber-100 text-amber-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                    {claims.filter(c => c.status === 'Approved' && c.pushStatus === 'Queued').length} claims
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => addToast('Fetching pending ledger sheets...', 'info')}
                    className="px-3.5 py-1.5 border border-slate-100 text-xs font-bold rounded-lg text-slate-600 bg-white"
                  >
                    Preview batch
                  </button>
                  <button
                    onClick={handlePushToPayroll}
                    className="bg-[#2f66e0] hover:bg-blue-700 text-white font-black text-xs px-4 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <span>+ Push to payroll</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 font-bold text-[10px] tracking-wider uppercase border-b border-slate-100 pb-2">
                      <th className="pb-3">Employee</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Amount (MYR)</th>
                      <th className="pb-3">Approved by</th>
                      <th className="pb-3 text-right">Push status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {claims
                      .filter(c => c.status === 'Approved')
                      .map((claim) => (
                        <tr key={claim.id} className="hover:bg-slate-50/20">
                          <td className="py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full bg-slate-100 text-slate-700 font-black text-[9px] flex items-center justify-center">
                                {claim.empName.split(' ').map(n=>n[0]).join('')}
                              </div>
                              <span className="font-bold text-slate-800">{claim.empName}</span>
                            </div>
                          </td>
                          <td className="py-3.5 text-slate-500">{claim.category}</td>
                          <td className="py-3.5 font-bold text-slate-900">{claim.myrEquivalent.toFixed(2)}</td>
                          <td className="py-3.5 text-slate-400 font-mono text-[10.5px]">
                            {claim.approvalChain.split(' \u2192 ').pop()}
                          </td>
                          <td className="py-3.5 text-right">
                            <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              claim.pushStatus === 'Pushed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {claim.pushStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Total queued banner */}
              <div className="bg-blue-50/50 border border-blue-50 rounded-xl p-4 flex justify-between items-center text-sm font-black text-slate-700 mt-5">
                <span className="text-slate-500 text-xs">Total queued for May 2026 payroll</span>
                <span className="text-xl text-[#2f66e0] font-black">
                  MYR {claims.filter(c => c.status === 'Approved' && c.pushStatus === 'Queued').reduce((acc, curr) => acc + curr.myrEquivalent, 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-TAB 5: ANALYTICS & REPORTS (Includes full Generator!) */}
        {/* ======================================================== */}
        {activeSubTab === 'Analytics & Reports' && (
          <div className="space-y-6 animate-in fade-in duration-100">
            {/* Top Three Cards metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total claimed &mdash; YTD</span>
                  <span className="text-emerald-500 text-xs font-bold inline-flex items-center gap-0.5">
                    <TrendingUp className="h-3 w-3" /> +12% vs last year
                  </span>
                </div>
                <p className="text-2xl font-black text-slate-800 mt-2">MYR 48,230</p>
              </div>

              <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Claimed &mdash; May 2026</span>
                  <span className="text-amber-600 text-xs font-semibold">94% of monthly budget</span>
                </div>
                <p className="text-2xl font-black text-slate-800 mt-2">MYR 14,820</p>
              </div>

              <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Policy flags &mdash; May</span>
                  <span className="text-red-500 text-[10px] font-bold">4 blocked &bull; 4 escalated</span>
                </div>
                <p className="text-2xl font-black text-red-600 mt-2">8</p>
              </div>
            </div>

            {/* Dashboard Graphics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Spend by category */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-50 pb-2">Spend by category &mdash; May 2026</h3>
                
                <div className="space-y-3.5">
                  {[
                    { label: 'Air ticket', amount: 'MYR 5,840', pct: 85, color: 'bg-blue-600' },
                    { label: 'Hotel / stay', amount: 'MYR 4,320', pct: 65, color: 'bg-purple-500' },
                    { label: 'Transport', amount: 'MYR 2,240', pct: 40, color: 'bg-emerald-500' },
                    { label: 'Meal', amount: 'MYR 1,820', pct: 30, color: 'bg-amber-500' },
                    { label: 'Mileage', amount: 'MYR 720', pct: 15, color: 'bg-pink-500' },
                    { label: 'Others', amount: 'MYR 480', pct: 10, color: 'bg-slate-400' }
                  ].map((cat, i) => (
                    <div key={i} className="text-xs font-bold text-slate-700">
                      <div className="flex justify-between mb-1">
                        <span>{cat.label}</span>
                        <span className="font-black text-slate-900">{cat.amount}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className={`${cat.color} h-2.5 rounded-full`} style={{ width: `${cat.pct}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spend by department */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-50 pb-2">Spend by department</h3>
                
                <div className="space-y-3.5 text-xs font-bold text-slate-700">
                  {[
                    { label: 'Engineering', amount: 'MYR 6,480', pct: 90, color: 'bg-blue-600' },
                    { label: 'Operations', amount: 'MYR 4,950', pct: 75, color: 'bg-emerald-500' },
                    { label: 'Finance', amount: 'MYR 2,700', pct: 45, color: 'bg-purple-500' },
                    { label: 'Marketing', amount: 'MYR 1,800', pct: 30, color: 'bg-amber-500' },
                    { label: 'HR', amount: 'MYR 890', pct: 15, color: 'bg-pink-500' }
                  ].map((dept, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-1">
                        <span>{dept.label}</span>
                        <span className="text-slate-900 font-black">{dept.amount}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className={`${dept.color} h-2.5 rounded-full`} style={{ width: `${dept.pct}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Budget tracking progress bars */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-50 pb-2">Budget tracking &mdash; travel &amp; entertainment</h3>
                
                <div className="space-y-4 text-xs font-semibold text-slate-700">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-slate-800">Engineering travel budget</span>
                      <span className="font-extrabold">MYR 6,480 / MYR 10,000</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <span className="block text-[10px] text-slate-400 mt-1">65% used &bull; MYR 3,520 remaining</span>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-slate-800">Operations travel budget</span>
                      <span className="font-extrabold">MYR 4,950 / MYR 6,000</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '83%' }}></div>
                    </div>
                    <span className="block text-[10px] text-slate-400 mt-1">83% used &bull; MYR 1,050 remaining</span>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-bold text-slate-800">Finance travel budget</span>
                      <span className="font-extrabold">MYR 2,700 / MYR 4,000</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                    <span className="block text-[10px] text-slate-400 mt-1">68% used &bull; MYR 1,300 remaining</span>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 flex-wrap gap-1">
                      <span className="font-bold text-slate-800">Marketing entertainment budget</span>
                      <span className="font-extrabold text-red-600">MYR 1,800 / MYR 2,000 &bull; alert!</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-red-50 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                    <span className="block text-[10px] text-red-500 mt-1">90% used &bull; MYR 200 remaining &mdash; alert!</span>
                  </div>
                </div>
              </div>

              {/* Top claimants */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-50 pb-2">Top claimants &mdash; May 2026</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 font-bold text-[10px] tracking-wider uppercase border-b border-slate-100 pb-2">
                        <th className="pb-2.5">Employee</th>
                        <th className="pb-2.5">No. claims</th>
                        <th className="pb-2.5">Total (MYR)</th>
                        <th className="pb-2.5 text-right">Flags</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      <tr>
                        <td className="py-2.5">
                          <div className="flex items-center gap-2">
                            <span className="bg-amber-100 text-amber-700 h-6 w-6 rounded-full font-black text-[9px] flex items-center justify-center">MT</span>
                            <span className="font-bold text-slate-800">Maya Tan</span>
                          </div>
                        </td>
                        <td className="py-2.5 text-slate-500">6 claims</td>
                        <td className="py-2.5 font-bold text-[#2f66e0]">3,820.00</td>
                        <td className="py-2.5 text-right"><span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded font-black">1</span></td>
                      </tr>
                      <tr>
                        <td className="py-2.5">
                          <div className="flex items-center gap-2">
                            <span className="bg-[#2f66e0]/10 text-[#2f66e0] h-6 w-6 rounded-full font-black text-[9px] flex items-center justify-center">RK</span>
                            <span className="font-bold text-slate-800">Raj Kumar</span>
                          </div>
                        </td>
                        <td className="py-2.5 text-slate-500">5 claims</td>
                        <td className="py-2.5 font-bold text-[#2f66e0]">2,410.00</td>
                        <td className="py-2.5 text-right"><span className="bg-slate-100 text-slate-400 text-[10px] px-2 py-0.5 rounded font-bold">0</span></td>
                      </tr>
                      <tr>
                        <td className="py-2.5">
                          <div className="flex items-center gap-2">
                            <span className="bg-emerald-100 text-emerald-800 h-6 w-6 rounded-full font-black text-[9px] flex items-center justify-center">SL</span>
                            <span className="font-bold text-slate-800">Sarah Lim</span>
                          </div>
                        </td>
                        <td className="py-2.5 text-slate-500">4 claims</td>
                        <td className="py-2.5 font-bold text-[#2f66e0]">1,650.00</td>
                        <td className="py-2.5 text-right"><span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded font-black">1</span></td>
                      </tr>
                      <tr>
                        <td className="py-2.5">
                          <div className="flex items-center gap-2">
                            <span className="bg-purple-100 text-purple-700 h-6 w-6 rounded-full font-black text-[9px] flex items-center justify-center">NC</span>
                            <span className="font-bold text-slate-800">Nadia Chen</span>
                          </div>
                        </td>
                        <td className="py-2.5 text-slate-500">3 claims</td>
                        <td className="py-2.5 font-bold text-[#2f66e0]">980.00</td>
                        <td className="py-2.5 text-right"><span className="bg-slate-100 text-slate-400 text-[10px] px-2 py-0.5 rounded font-bold">0</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* THE USER REQUESTED EXTRA PANEL: Claims Tab Reports (Same level structure as Employee Reports tab!) */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="border-b border-indigo-50 pb-3 flex flex-wrap justify-between items-center gap-3">
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">CLAIMS REPORT GENERATOR</h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">Filter records and compile audit sheets similar to Employee Management directory dossiers</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      addToast('Compiling print-ready document catalog...', 'loading');
                      setTimeout(() => addToast('PDF Claims Register generated. Download started.', 'success'), 1200);
                    }}
                    className="px-3 py-1.5 border border-slate-100 rounded-lg text-slate-600 bg-white hover:bg-slate-50 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Print PDF Ledger</span>
                  </button>
                  <button
                    onClick={() => {
                      addToast('Generating XLS spreadsheets database...', 'loading');
                      setTimeout(() => addToast('Completed! Claims Workbook.xlsx downloaded.', 'success'), 1200);
                    }}
                    className="px-3 py-1.5 border border-slate-100 rounded-lg text-slate-600 bg-white hover:bg-slate-50 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Download Excel</span>
                  </button>
                </div>
              </div>

              {/* Filters list */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4.5 bg-slate-50 rounded-xl">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sector Division</span>
                  <select
                    value={repDept}
                    onChange={(e) => { setRepDept(e.target.value); setIsReportGenerated(true); }}
                    className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-bold outline-none cursor-pointer w-full"
                  >
                    <option value="All">All Departments</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Finance">Finance</option>
                    <option value="HR">HR</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>

                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Expense category</span>
                  <select
                    value={repCategory}
                    onChange={(e) => { setRepCategory(e.target.value); setIsReportGenerated(true); }}
                    className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-bold outline-none cursor-pointer w-full"
                  >
                    <option value="All">All Categories</option>
                    <option value="Meal allowance">Meal allowance</option>
                    <option value="Transport">Transport</option>
                    <option value="Hotel / stay">Hotel / stay</option>
                    <option value="Air ticket">Air ticket</option>
                    <option value="Wellness">Wellness</option>
                  </select>
                </div>

                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sanction state</span>
                  <select
                    value={repStatus}
                    onChange={(e) => { setRepStatus(e.target.value); setIsReportGenerated(true); }}
                    className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-bold outline-none cursor-pointer w-full"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Approval Pending</option>
                    <option value="Approved">Approved and Queued</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Search claimant</span>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Sarah"
                      value={repQuery}
                      onChange={(e) => { setRepQuery(e.target.value); setIsReportGenerated(true); }}
                      className="bg-white border border-slate-200 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-700 font-medium outline-none w-full"
                    />
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Stats calculations strictly generated */}
              {(() => {
                const results = claims.filter(c => {
                  const matchesDept = repDept === 'All' || c.department === repDept;
                  const matchesCat = repCategory === 'All' || c.category === repCategory;
                  const matchesStatus = repStatus === 'All' || c.status === repStatus;
                  const matchesQuery = repQuery.trim() === '' || c.empName.toLowerCase().includes(repQuery.toLowerCase());
                  return matchesDept && matchesCat && matchesStatus && matchesQuery;
                });

                const totalSum = results.reduce((acc, curr) => acc + curr.myrEquivalent, 0);
                const averageClaim = results.length > 0 ? (totalSum / results.length) : 0;
                const flaggedSum = results.filter(c => c.policyFlag !== 'Clear').length;

                return (
                  <div className="space-y-4">
                    {/* Tiny stats cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <span className="block text-[9px] font-bold text-slate-400 uppercase">Compiled Records</span>
                        <span className="text-base font-black text-slate-800 mt-1 block">{results.length} entries</span>
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <span className="block text-[9px] font-bold text-slate-400 uppercase">Sum Ledger</span>
                        <span className="text-base font-black text-[#2f66e0] mt-1 block">MYR {totalSum.toFixed(2)}</span>
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <span className="block text-[9px] font-bold text-slate-400 uppercase">Average Ticket</span>
                        <span className="text-base font-black text-slate-800 mt-1 block">MYR {averageClaim.toFixed(2)}</span>
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <span className="block text-[9px] font-bold text-slate-400 uppercase">Policy Violations</span>
                        <span className="text-base font-black text-red-600 mt-1 block">{flaggedSum} infractions</span>
                      </div>
                    </div>

                    {/* Results table */}
                    <div className="border border-slate-100 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-xs font-medium text-slate-600">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            <th className="p-3 pl-4">ID</th>
                            <th className="p-3">Employee</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Date</th>
                            <th className="p-3">Vendor / Merchant</th>
                            <th className="p-3">Amount (MYR)</th>
                            <th className="p-3 text-center">Flag</th>
                            <th className="p-3 text-right pr-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                          {results.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="p-8 text-center text-slate-400">
                                No claims match the filter settings inside this active register session.
                              </td>
                            </tr>
                          ) : (
                            results.map(c => (
                              <tr key={c.id} className="hover:bg-slate-50/10">
                                <td className="p-3 pl-4 font-mono text-[10px] text-[#2f66e0]">{c.id}</td>
                                <td className="p-3">
                                  <div className="font-bold text-slate-800">{c.empName}</div>
                                  <div className="text-[10px] text-slate-400 font-medium">{c.department}</div>
                                </td>
                                <td className="p-3 text-[11px]">{c.category}</td>
                                <td className="p-3 text-slate-500">{c.date}</td>
                                <td className="p-3 text-slate-500 font-sans">{c.vendor}</td>
                                <td className="p-3 font-bold text-slate-900">MYR {c.myrEquivalent.toFixed(2)}</td>
                                <td className="p-3 text-center">
                                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                                    c.policyFlag === 'Clear' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                                  }`}>
                                    {c.policyFlag}
                                  </span>
                                </td>
                                <td className="p-3 text-right pr-4">
                                  <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded ${
                                    c.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                                    c.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    {c.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-TAB 6: CLAIM HISTORY */}
        {/* ======================================================== */}
        {activeSubTab === 'Claim History' && (
          <div className="space-y-6 animate-in fade-in duration-100">
            {/* Filter Log Bar */}
            <div className="bg-slate-50/50 border border-slate-100 p-4.5 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <select
                  value={historyStatusFilter}
                  onChange={(e) => setHistoryStatusFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs text-slate-600 font-bold outline-none cursor-pointer"
                >
                  <option value="All status">All status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <select
                  value={historyCategoryFilter}
                  onChange={(e) => setHistoryCategoryFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs text-slate-600 font-bold outline-none cursor-pointer"
                >
                  <option value="All categories">All categories</option>
                  <option value="Meal allowance">Meal allowance</option>
                  <option value="Transport">Transport</option>
                  <option value="Hotel / stay">Hotel / stay</option>
                  <option value="Air ticket">Air ticket</option>
                  <option value="Mileage">Mileage</option>
                  <option value="Wellness">Wellness</option>
                </select>

                <select
                  value={historyDeptFilter}
                  onChange={(e) => setHistoryDeptFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs text-slate-600 font-bold outline-none cursor-pointer font-sans"
                >
                  <option value="All departments">All departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Finance">Finance</option>
                  <option value="HR">HR</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                </select>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search employee..."
                    value={historySearchQuery}
                    onChange={(e) => setHistorySearchQuery(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl pl-8 pr-3.5 py-1.5 text-xs text-slate-700 font-semibold outline-none w-52"
                  />
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    addToast('Generating complete ledger document...', 'loading');
                    setTimeout(() => addToast('PDF exported successfully.', 'success'), 1200);
                  }}
                  className="text-slate-600 hover:text-slate-800 text-xs font-bold px-3 py-1.5 bg-white border border-slate-100 rounded-xl"
                >
                  Generate PDF
                </button>
                <button
                  onClick={() => addToast('Exporting to XLSX formats...', 'info')}
                  className="bg-[#2f66e0] text-white hover:bg-blue-700 text-xs font-black px-4 py-1.5 rounded-xl cursor-pointer"
                >
                  Export
                </button>
              </div>
            </div>

            {/* Complete Claims Table */}
            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold text-[10px] tracking-wider uppercase">
                    <th className="p-4 pl-6">Employee</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Claim date</th>
                    <th className="p-4">Vendor</th>
                    <th className="p-4">Amount (MYR)</th>
                    <th className="p-4">Approved by</th>
                    <th className="p-4">Payroll month</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right pr-6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {claims
                    .filter(c => {
                      const matchesStatus = historyStatusFilter === 'All status' || c.status === historyStatusFilter;
                      const matchesCategory = historyCategoryFilter === 'All categories' || c.category === historyCategoryFilter;
                      const matchesDept = historyDeptFilter === 'All departments' || c.department === historyDeptFilter;
                      const matchesSearch = c.empName.toLowerCase().includes(historySearchQuery.toLowerCase());
                      return matchesStatus && matchesCategory && matchesDept && matchesSearch;
                    })
                    .map((claim) => (
                      <tr key={claim.id} className="hover:bg-slate-50/20">
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-2.5">
                            <span className="bg-indigo-50 text-indigo-700 h-7 w-7 rounded-full font-black text-[10px] flex items-center justify-center border border-indigo-100">
                              {claim.empName.split(' ').map(n=>n[0]).join('')}
                            </span>
                            <div>
                              <div className="font-bold text-slate-800">{claim.empName}</div>
                              <div className="text-[10px] text-slate-400 font-medium">{claim.department}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-block px-2.5 py-0.5 rounded bg-slate-50 text-slate-700 font-bold text-[10.5px]">
                            {claim.category}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500">
                          {new Date(claim.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </td>
                        <td className="p-4 text-slate-500 font-normal">
                          {claim.vendor}
                        </td>
                        <td className="p-4 font-bold text-slate-900">
                          {claim.myrEquivalent.toFixed(2)}
                        </td>
                        <td className="p-4 text-slate-400 font-mono text-[10.5px]">
                          {claim.status === 'Approved' ? (
                            <span className="flex items-center gap-0.5 text-slate-500">
                              {claim.approvalChain.split(' \u2192 ').pop()} <strong className="text-emerald-600 font-black font-sans">&bull; &#10003;</strong>
                            </span>
                          ) : claim.status === 'Rejected' ? (
                            <span className="flex items-center gap-0.5 text-red-600 font-bold">
                              {claim.approvalChain.split(' \u2192 ').pop()} <strong className="font-sans font-black">&bull; &#10007;</strong>
                            </span>
                          ) : (
                            <span className="text-slate-400">Under review</span>
                          )}
                        </td>
                        <td className="p-4 text-slate-500 whitespace-nowrap">
                          {claim.status === 'Approved' ? claim.payrollMonth : '—'}
                        </td>
                        <td className="p-4">
                          <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-full ${
                            claim.pushStatus === 'Pushed' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                            claim.pushStatus === 'Queued' ? 'bg-amber-50 text-amber-700 border border-[#fef3c7]' :
                            claim.status === 'Rejected' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-slate-50 text-slate-400 border border-slate-100'
                          }`}>
                            {claim.pushStatus === 'Pushed' ? 'Pushed' : claim.pushStatus === 'Queued' ? 'Queued' : claim.status}
                          </span>
                        </td>
                        <td className="p-4 text-right pr-6">
                          <button
                            onClick={() => {
                              setSelectedClaimDetail(claim);
                              addToast(`Opened full database transaction file for claim ${claim.id}`, 'success');
                            }}
                            className="bg-slate-50 hover:bg-[#2f66e0]/10 hover:text-[#2f66e0] text-slate-600 border border-slate-200 hover:border-[#2f66e0]/20 font-bold px-2.5 py-1 rounded-lg text-xs cursor-pointer transition-all"
                          >
                            View
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

      {/* ======================================================== */}
      {/* 2. SYSTEM MODAL LAYERS FOR INTERACTIVE EDIT WORKFLOWS */}
      {/* ======================================================== */}

      {/* MODAL 1: EDIT APPROVAL ROUTING RULES */}
      {isEditApprovalRulesModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-slate-50 px-6 py-4.5 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-[#2f66e0]" />
                <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Tiered Approval routing matrix</h3>
              </div>
              <button 
                onClick={() => setIsEditApprovalRulesModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs text-slate-700">
              <p className="text-slate-500 font-semibold leading-relaxed">
                Configure tier boundaries and approval workflows based on the total claim value (MYR equivalent). Changes will affect any claim submitted from this point onward.
              </p>

              <div className="space-y-4">
                {approvalRules.map((rule, idx) => (
                  <div key={rule.id} className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-[#2f66e0] bg-[#2f66e0]/10 px-2 py-0.5 rounded text-[10.5px]">Rule Range {idx+1}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-bold">Route Type:</span>
                        <select
                          value={rule.type}
                          onChange={(e) => {
                            const updated = [...approvalRules];
                            updated[idx].type = e.target.value;
                            setApprovalRules(updated);
                          }}
                          className="bg-white border border-slate-200 rounded px-2 py-0.5 font-bold text-slate-700"
                        >
                          <option value="Sequential">Sequential</option>
                          <option value="Parallel with Dept Head">Parallel with Dept Head</option>
                          <option value="Direct Approval">Direct Approval</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[10.5px] font-bold text-slate-500 mb-1">Claim limits range label</label>
                        <input
                          type="text"
                          value={rule.range}
                          onChange={(e) => {
                            const updated = [...approvalRules];
                            updated[idx].range = e.target.value;
                            setApprovalRules(updated);
                          }}
                          className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:border-[#2f66e0] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10.5px] font-bold text-slate-500 mb-1">Assigned approval chain logic description</label>
                        <input
                          type="text"
                          value={rule.desc}
                          onChange={(e) => {
                            const updated = [...approvalRules];
                            updated[idx].desc = e.target.value;
                            setApprovalRules(updated);
                          }}
                          className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:border-[#2f66e0] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <button
                onClick={() => {
                  setApprovalRules([
                    { id: 1, range: 'Claims ≤ MYR 200', desc: 'Direct manager only — single approval', type: 'Sequential' },
                    { id: 2, range: 'Claims MYR 201 – MYR 1,000', desc: 'Manager → Department Head', type: 'Sequential' },
                    { id: 3, range: 'Claims > MYR 1,000', desc: 'Manager → Dept Head → Finance Director', type: 'Parallel with Dept Head' }
                  ]);
                  addToast('Reset rules matrix to factory defaults.', 'info');
                }}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                Reset Default
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditApprovalRulesModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-100/60 rounded-xl text-slate-600 font-bold transition-all text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsEditApprovalRulesModalOpen(false);
                    addToast('Tiered approval routing policy rules saved.', 'success');
                  }}
                  className="px-4.5 py-2 bg-[#2f66e0] hover:opacity-95 text-white font-extrabold rounded-xl transition-all text-xs"
                >
                  Save matrix
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT SPEND LIMITS */}
      {isEditSpendLimitsModalOpen && selectedSpendLimitIdx !== null && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-slate-50 px-6 py-4.5 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-[#2f66e0]" />
                <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Edit Limit: {spendLimits[selectedSpendLimitIdx].category}</h3>
              </div>
              <button 
                onClick={() => setIsEditSpendLimitsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <p className="text-slate-500 font-semibold leading-relaxed">
                Update daily allowances and overall monthly thresholds for the selected expense division code. Submissions crossing these boundaries will trigger a flagged warning in manager feeds.
              </p>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-[10.5px] font-bold text-slate-500 mb-1">Expense category label</label>
                  <input
                    type="text"
                    disabled
                    value={spendLimits[selectedSpendLimitIdx].category}
                    className="w-full text-xs font-bold text-slate-400 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-500 mb-1">Daily spent threshold (limit)</label>
                    <input
                      type="text"
                      value={spendLimits[selectedSpendLimitIdx].daily}
                      onChange={(e) => {
                        const updated = [...spendLimits];
                        updated[selectedSpendLimitIdx].daily = e.target.value;
                        setSpendLimits(updated);
                      }}
                      placeholder="e.g. MYR 200"
                      className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:border-[#2f66e0] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-bold text-slate-500 mb-1">Monthly allowance cap</label>
                    <input
                      type="text"
                      value={spendLimits[selectedSpendLimitIdx].monthly}
                      onChange={(e) => {
                        const updated = [...spendLimits];
                        updated[selectedSpendLimitIdx].monthly = e.target.value;
                        setSpendLimits(updated);
                      }}
                      placeholder="e.g. MYR 2,000"
                      className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:border-[#2f66e0] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-slate-500 mb-1">Receipt requirement rule</label>
                  <input
                    type="text"
                    value={spendLimits[selectedSpendLimitIdx].receiptReq}
                    onChange={(e) => {
                      const updated = [...spendLimits];
                      updated[selectedSpendLimitIdx].receiptReq = e.target.value;
                      setSpendLimits(updated);
                    }}
                    placeholder="e.g. Always, or > MYR 50"
                    className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:border-[#2f66e0] outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setIsEditSpendLimitsModalOpen(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 font-bold transition-all text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsEditSpendLimitsModalOpen(false);
                  addToast(`Compliance limit updated for category: ${spendLimits[selectedSpendLimitIdx].category}`, 'success');
                }}
                className="px-4.5 py-2 bg-[#2f66e0] hover:opacity-95 text-white font-extrabold rounded-xl transition-all text-xs cursor-pointer"
              >
                Save limits
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT AUTO-VALIDATION CHECKS */}
      {isEditValidationRulesModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-slate-50 px-6 py-4.5 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#2f66e0]" />
                <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Auto-validation checks</h3>
              </div>
              <button 
                onClick={() => setIsEditValidationRulesModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4.5 text-xs text-slate-700">
              <p className="text-slate-500 font-semibold leading-relaxed">
                Management scripts run in real-time immediately when an employee records any receipt item. Toggle or define validation rules below:
              </p>

              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {validationRules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200">
                    <span className="font-semibold text-slate-700 flex-1 leading-normal pr-3">{rule.label}</span>
                    <button
                      onClick={() => {
                        setValidationRules(validationRules.map(r => r.id === rule.id ? { ...r, enabled: !r.enabled } : r));
                      }}
                      className={`text-[10px] font-black px-2.5 py-1 rounded ${
                        rule.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {rule.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-3.5 space-y-2">
                <label className="block text-[10.5px] font-bold text-slate-500">Append custom check criteria</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newRuleInput}
                    onChange={(e) => setNewRuleInput(e.target.value)}
                    placeholder="e.g. Flag claims with weekend transactions..."
                    className="flex-1 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-[#2f66e0]"
                  />
                  <button
                    onClick={() => {
                      if (!newRuleInput.trim()) return;
                      const newRule = {
                        id: nextSeq(validationRules.map(r => r.id)),
                        label: newRuleInput,
                        enabled: true
                      };
                      setValidationRules([...validationRules, newRule]);
                      setNewRuleInput('');
                      addToast('New compliance check script added to core stack.', 'success');
                    }}
                    className="bg-[#2f66e0] hover:bg-blue-700 text-white font-extrabold text-xs px-3.5 rounded-xl flex items-center justify-center cursor-pointer"
                  >
                    + Add Rule
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <button
                onClick={() => {
                  setValidationRules([
                    { id: 1, label: 'Flag claims exceeding daily / monthly category limits', enabled: true },
                    { id: 2, label: 'Detect duplicate submissions (same vendor + date + amount)', enabled: true },
                    { id: 3, label: 'Block claims submitted more than 30 days after receipt date', enabled: true },
                    { id: 4, label: 'Require receipt attachment for claims above threshold', enabled: true },
                    { id: 5, label: 'Auto-convert foreign currency at live exchange rate', enabled: true },
                    { id: 6, label: 'Hold claims from employees on notice period', enabled: true },
                    { id: 7, label: 'Notify HR on claims exceeding MYR 1,000', enabled: true }
                  ]);
                  addToast('Reset to default system validator settings.', 'info');
                }}
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
              >
                Reset Default
              </button>
              <button
                onClick={() => {
                  setIsEditValidationRulesModalOpen(false);
                  addToast('Auto-validation scripts configured successfully.', 'success');
                }}
                className="px-5 py-2 bg-slate-800 hover:opacity-90 text-white font-black rounded-xl text-xs"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: DEEP VIEW CLAIM DETAIL TRANSACTION (with invoice preview replica) */}
      {selectedClaimDetail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[92vh]">
            
            {/* Left Box: Full ledger text & audit stepper metadata */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
              
              {/* Header section with status */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-[#2f66e0]/10 text-[#2f66e0] rounded-2xl flex items-center justify-center">
                    <Receipt className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">TRANSACTION: {selectedClaimDetail.id}</span>
                    <h3 className="font-extrabold text-slate-800 text-base leading-snug">{selectedClaimDetail.empName}</h3>
                    <p className="text-xs text-slate-500 font-semibold">{selectedClaimDetail.department} department</p>
                  </div>
                </div>

                <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${
                  selectedClaimDetail.status === 'Approved' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 
                  selectedClaimDetail.status === 'Rejected' ? 'bg-red-50 text-red-800 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-100'
                }`}>
                  {selectedClaimDetail.status}
                </span>
              </div>

              {/* Grid values */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-5 gap-x-4 border-y border-slate-100 py-5 text-xs">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Claim date</span>
                  <p className="font-semibold text-slate-800 text-[12px]">
                    {new Date(selectedClaimDetail.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Expense category</span>
                  <p className="font-semibold text-slate-800 text-[12px]">{selectedClaimDetail.category}</p>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Supplier / Merchant</span>
                  <p className="font-semibold text-slate-800 text-[12px]">{selectedClaimDetail.vendor || 'Direct Submission'}</p>
                </div>

                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Original Expense</span>
                  <p className="font-mono font-bold text-slate-700 text-[12px]">{selectedClaimDetail.currency} {selectedClaimDetail.amount.toFixed(2)}</p>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">MYR rate equivalent</span>
                  <p className="font-extrabold text-slate-900 text-[13px]">MYR {selectedClaimDetail.myrEquivalent.toFixed(2)}</p>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Compliance rating</span>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black mt-1 ${
                    selectedClaimDetail.policyFlag === 'Clear' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                  }`}>
                    {selectedClaimDetail.policyFlag} ({selectedClaimDetail.policyFlag === 'Clear' ? 'Compliant' : 'Flagged Audit'})
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5 text-xs">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Business registration intent</span>
                <p className="text-slate-700 leading-relaxed font-semibold bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedClaimDetail.description}
                </p>
              </div>

              {/* Audit timelines step stepper */}
              <div className="space-y-4">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Audit timeline & approval route</span>
                
                <div className="space-y-3 pl-2.5">
                  <div className="flex items-start gap-3 relative border-l-2 border-emerald-500 pb-3 pl-3.5">
                    <div className="absolute left-[-5px] top-1.5 h-2 w-2 rounded-full bg-emerald-500" />
                    <div>
                      <p className="font-bold text-slate-800 text-[11.5px]">Claim Entry Registered</p>
                      <p className="text-[10px] text-slate-400 font-medium">{selectedClaimDetail.date} 09:00 &bull; Initiated by claimant</p>
                    </div>
                  </div>

                  <div className={`flex items-start gap-3 relative pb-3 pl-3.5 ${
                    selectedClaimDetail.status === 'Approved' || selectedClaimDetail.status === 'Rejected' 
                      ? 'border-l-2 border-emerald-500' 
                      : 'border-l-2 border-slate-200'
                  }`}>
                    <div className={`absolute left-[-5px] top-1.5 h-2 w-2 rounded-full ${
                      selectedClaimDetail.status === 'Approved' || selectedClaimDetail.status === 'Rejected' ? 'bg-emerald-500' : 'bg-amber-400'
                    }`} />
                    <div>
                      <p className="font-bold text-slate-800 text-[11.5px]">Manager Level Assessment</p>
                      <p className="text-[10px] text-slate-400 font-medium">Assigned Route: {selectedClaimDetail.approvalChain.split(' → ')[0]}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 relative pl-3.5">
                    <div className={`absolute left-[-5px] top-1.5 h-2 w-2 rounded-full ${
                      selectedClaimDetail.status === 'Approved' ? 'bg-emerald-500' : selectedClaimDetail.status === 'Rejected' ? 'bg-red-500' : 'bg-slate-300'
                    }`} />
                    <div>
                      <p className="font-bold text-slate-800 text-[11.5px]">Final Ledger Audit & Completion</p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {selectedClaimDetail.status === 'Approved' ? `Approved \u2014 Queued for month ${selectedClaimDetail.payrollMonth}` : 
                         selectedClaimDetail.status === 'Rejected' ? 'Rejected and archived' : 'Awaiting general finance verify'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Box: Receipt Voucher Replica preview */}
            <div className="w-full md:w-[350px] bg-slate-100 border-t md:border-t-0 md:border-l border-slate-200 p-6 flex flex-col justify-between">
              
              {/* Receipt Visual Body */}
              <div className="bg-white border text-center border-slate-200 p-5 rounded-2xl shadow-md rotate-1 hover:rotate-0 transition-all font-mono text-slate-700 text-xs space-y-4">
                <div className="border-b border-dashed border-slate-300 pb-3">
                  <h4 className="font-black tracking-widest text-[#2f66e0]/90 text-[12px] uppercase">★★★ RECEIPT PROOF ★★★</h4>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide mt-1">{selectedClaimDetail.vendor || 'RETAIL SUPP'}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">KUALA LUMPUR, MALAYSIA</p>
                </div>

                <div className="space-y-1.5 text-left text-[11px]">
                  <div className="flex justify-between">
                    <span>DATE:</span>
                    <span>{selectedClaimDetail.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TX ID:</span>
                    <span>TXN-{selectedClaimDetail.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CATEGORY:</span>
                    <span className="uppercase text-[10px] font-bold">{selectedClaimDetail.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CURRENCY:</span>
                    <span>{selectedClaimDetail.currency}</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-slate-300 pt-3 space-y-2">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span>SUB-TOTAL:</span>
                    <span>{selectedClaimDetail.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span>SALES TAX (6%):</span>
                    <span>{(selectedClaimDetail.amount * 0.06).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-black text-slate-900 border-t border-slate-200 pt-1.5 text-[13px]">
                    <span>TOTAL AMT:</span>
                    <span>{selectedClaimDetail.currency} {(selectedClaimDetail.amount).toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md py-1 px-2.5 text-[9px] font-black flex items-center justify-center gap-1">
                  <span>● RECEIPT SECURELY ATTACHED</span>
                </div>
              </div>

              {/* Utility buttons */}
              <div className="mt-6 md:mt-0 space-y-2.5">
                <button
                  onClick={() => {
                    addToast(`Preparing printing spool for transaction ${selectedClaimDetail.id}...`, 'loading');
                    setTimeout(() => addToast('Document triggered to standard spool queue.', 'success'), 1000);
                  }}
                  className="w-full text-xs font-bold py-2 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Printer className="h-4 w-4 text-slate-400" />
                  <span>Print Receipt</span>
                </button>

                <button
                  onClick={() => setSelectedClaimDetail(null)}
                  className="w-full text-xs font-black py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  Dismiss Record
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* MODAL 5: CONFIRM & EXECUTE PAYROLL TRANSFER */}
      {isPayrollPushModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            
            <div className="bg-slate-50 px-6 py-5 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="h-5 w-5 text-indigo-600" />
                <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider text-[13px]">Authorize Payroll sync batch</h3>
              </div>
              <button 
                onClick={() => !isPushingInProgress && setIsPayrollPushModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                disabled={isPushingInProgress}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs text-slate-700">
              
              {isPushingInProgress ? (
                /* Loading progress states */
                <div className="space-y-6 py-4 flex flex-col items-center justify-center text-center">
                  <div className="relative flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin" />
                    <span className="absolute text-xs font-black text-indigo-700">{pushProgressPct}%</span>
                  </div>
                  <div className="space-y-1.5 max-w-xs">
                    <h4 className="font-extrabold text-slate-800 text-sm">Transmuting receipts ledger ...</h4>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest leading-none block">
                      {pushProgressPct < 40 ? 'Verifying merchant VAT logs...' : 
                       pushProgressPct < 80 ? 'Injecting wage supplemental database...' : 'Signing General Ledger entries...'}
                    </span>
                  </div>
                </div>
              ) : (
                /* Regular review content */
                <>
                  <div className="bg-orange-50 text-orange-800 border border-orange-200 p-4 rounded-xl font-semibold flex items-start gap-2.5 leading-normal">
                    <AlertCircle className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-orange-900">Irreversible Action Warning</p>
                      <p className="text-[11px] text-orange-800 mt-0.5">
                        Closing this batch will permanently tag these items status as <strong>Pushed</strong>. These records will be committed to the employee payslips for the next pay cycle.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target ERP integration gateway</label>
                    <select
                      value={payrollIntegrationChannel}
                      onChange={(e) => setPayrollIntegrationChannel(e.target.value)}
                      className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 py-2 px-3 rounded-xl outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      <option value="Workday ERP Connector v2.4">Workday Core HR API Integrator</option>
                      <option value="SAP SuccessFactors Web API">SAP SuccessFactors Gateway</option>
                      <option value="HRLearn Bank Auto-File Export">Direct Bank GIRO GIRO text format</option>
                      <option value="Manual spreadsheet ledger batch">General Ledger Excel spreadsheet</option>
                    </select>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4.5 border border-slate-100 space-y-2.5">
                    <div className="flex justify-between items-center text-slate-500 mb-2 border-b border-slate-200 pb-2">
                      <span className="font-bold">Total approved reimbursements:</span>
                      <span className="font-black text-slate-900 bg-slate-200 px-2 py-0.5 rounded text-[11px]">
                        {claims.filter(c => c.status === 'Approved' && c.pushStatus === 'Queued').length} claims
                      </span>
                    </div>

                    <div className="max-h-28 overflow-y-auto space-y-1.5 font-semibold text-slate-600 pr-1 select-none">
                      {claims
                        .filter(c => c.status === 'Approved' && c.pushStatus === 'Queued')
                        .map(c => (
                          <div key={c.id} className="flex justify-between items-center text-[11.5px]">
                            <span>{c.empName} &bull; <span className="text-slate-400 font-normal">{c.category}</span></span>
                            <span className="font-bold text-slate-800 font-mono">MYR {c.myrEquivalent.toFixed(2)}</span>
                          </div>
                        ))}
                    </div>

                    <div className="border-t border-slate-200 pt-2 flex justify-between items-center font-black text-slate-900 text-[13px]">
                      <span>AGGREGATED WAGES VALUE</span>
                      <span className="text-[#2f66e0]">
                        MYR {claims.filter(c => c.status === 'Approved' && c.pushStatus === 'Queued').reduce((acc, curr) => acc + curr.myrEquivalent, 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </>
              )}

            </div>

            <div className="px-6 py-4.5 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setIsPayrollPushModalOpen(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 font-bold text-xs"
                disabled={isPushingInProgress}
              >
                Cancel
              </button>
              {!isPushingInProgress && (
                <button
                  onClick={executePayrollPush}
                  className="px-5 py-2 bg-[#2f66e0] hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" />
                  <span>Authorize & Transfer</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

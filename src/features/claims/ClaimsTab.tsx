import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Receipt,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  FileText,
  Search,
  Building,
  Filter,
  ArrowUpRight,
  Settings,
  PlusCircle,
  Plus,
  RotateCcw,
  Download,
  Check,
  X,
  User,
  Paperclip,
  ShieldAlert,
  PieChart,
  CalendarDays,
  FileSpreadsheet,
  ChevronDown,
  Printer,
  Edit2,
} from 'lucide-react';
import { DropdownAnchor, SelectMenu } from '@/components/ui';
import ModuleHeader from '@/components/ui/ModuleHeader';
import { canManageFullSystem } from '@/lib/roles';
import {
  ApiError,
  createMyClaim,
  decideClaim,
  fetchAdminClaims,
  fetchMyClaims,
  type ClaimRow,
} from '@/services';
import { dateStamp, downloadCsv, downloadNearestTableCsv } from '@/lib/csv';
import { useCurrency } from '@/hooks/useCurrency';
import { CURRENCY_OPTIONS } from '@/lib/currency';

interface ClaimsTabProps {
  employees: any[];
  addToast: (text: string, type: 'success' | 'loading' | 'error' | 'info') => void;
  roles?: string[];
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
  decidedBy: string | null;
  decidedAt: string | null;
  createdAt: string | null;
}


const BAR_COLORS = ['bg-blue-600', 'bg-sky-500', 'bg-emerald-500', 'bg-amber-500', 'bg-pink-500', 'bg-slate-400'];

const DEPARTMENT_BUDGETS: { label: string; department: string; cap: number; category?: string }[] = [
  { label: 'Engineering travel budget', department: 'Engineering', cap: 10000 },
  { label: 'Operations travel budget', department: 'Operations', cap: 6000 },
  { label: 'Finance travel budget', department: 'Finance', cap: 4000 },
  { label: 'Marketing entertainment budget', department: 'Marketing', cap: 2000, category: 'Entertainment' },
];

function claimPolicyFlag(category: string, amount: number): Claim['policyFlag'] {
  if (category === 'Meal allowance' && amount > 30) return 'Over limit';
  if (category === 'Transport' && amount > 200) return 'Over limit';
  return 'Clear';
}

function monthKeyOf(d: Date): string {
  return d.toLocaleDateString('en-CA').slice(0, 7);
}

function monthLabelOf(key: string): string {
  const [y, m] = key.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function recentMonthKeys(count: number): string[] {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => monthKeyOf(new Date(now.getFullYear(), now.getMonth() - i, 1)));
}

function groupClaimTotals(rows: Claim[], keyOf: (c: Claim) => string) {
  const map = new Map<string, { label: string; amount: number; count: number; flags: number }>();
  for (const c of rows) {
    const label = keyOf(c) || '—';
    const entry = map.get(label) || { label, amount: 0, count: 0, flags: 0 };
    entry.amount += c.myrEquivalent;
    entry.count += 1;
    if (c.policyFlag !== 'Clear') entry.flags += 1;
    map.set(label, entry);
  }
  return Array.from(map.values()).sort((a, b) => b.amount - a.amount);
}

function initialsOf(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

export default function ClaimsTab({ employees, addToast, roles = [] }: ClaimsTabProps) {
  const isAdmin = canManageFullSystem(roles)
  const { currency, money, amount: fmtAmount } = useCurrency()
  // Navigation sub-tabs
  const [activeSubTab, setActiveSubTab] = useState<'Submit Claim' | 'Approval' | 'Policy & Compliance' | 'Payroll Integration' | 'Analytics & Reports' | 'Claim History'>('Submit Claim');
  const [claimsBusy, setClaimsBusy] = useState(false);

  // Interactive filters (global / header scoped)
  const [headerMonth, setHeaderMonth] = useState<string>(() => monthKeyOf(new Date()));
  const [headerDept, setHeaderDept] = useState<string>('All departments');
  
  // Controls dropdown states
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);

  const mapClaim = (row: ClaimRow): Claim => {
    const status = /approv/i.test(row.status)
      ? 'Approved'
      : /reject/i.test(row.status)
        ? 'Rejected'
        : 'Pending'
    return {
      id: row.id,
      empId: row.employeeId,
      empName: row.employeeName,
      department: row.departmentName || '—',
      category: row.category,
      date: row.claimDate,
      amount: Number(row.amount),
      currency: row.currency || currency,
      myrEquivalent: (row.currency || currency) === currency ? Number(row.amount) : 0,
      vendor: row.vendor || '—',
      approvalChain: row.decidedBy || 'Manager',
      policyFlag: claimPolicyFlag(row.category, Number(row.amount)),
      status,
      payrollMonth: '—',
      pushStatus: status === 'Approved' ? 'Queued' : '—',
      description: row.description || '—',
      hasAttachment: false,
      decidedBy: row.decidedBy,
      decidedAt: row.decidedAt,
      createdAt: row.createdAt,
    }
  }

  // Core Database of Claims — loaded from API
  const [claims, setClaims] = useState<Claim[]>([]);

  const loadClaims = useCallback(async () => {
    try {
      const rows = isAdmin ? await fetchAdminClaims() : await fetchMyClaims()
      setClaims(rows.map(mapClaim))
    } catch (err) {
      setClaims([])
      if (!(err instanceof ApiError) || (err.status !== 401 && err.status !== 403)) {
        addToast('Could not load claims from the server.', 'error')
      }
    }
  }, [addToast, isAdmin])

  useEffect(() => {
    void loadClaims()
  }, [loadClaims])

  // Submit Claim tab states
  const [claimCategory, setClaimCategory] = useState<string>('-- Select category --');
  const [claimDate, setClaimDate] = useState<string>(() => new Date().toLocaleDateString('en-CA'));
  const [claimVendor, setClaimVendor] = useState<string>('');
  const [claimCurrency, setClaimCurrency] = useState<string>(currency);
  const [claimAmount, setClaimAmount] = useState<string>('0.00');
  const [claimProject, setClaimProject] = useState<string>('');
  const [claimDesc, setClaimDesc] = useState<string>('');
  const [selectedStaffName, setSelectedStaffName] = useState<string>('');
  const [hasReceiptFile, setHasReceiptFile] = useState<boolean>(false);
  const [sendEmailNotification, setSendEmailNotification] = useState<boolean>(true);

  useEffect(() => {
    setClaimCurrency(currency);
  }, [currency]);
  
  const receiptInputRef = useRef<HTMLInputElement>(null);

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
  const [isReportGenerated, setIsReportGenerated] = useState<boolean>(false);

  // State calculations
  const pendingCount = claims.filter(c => c.status === 'Pending').length;

  // Meal daily limit threshold check
  const calculatedMyrEquivalent = () => {
    const amt = parseFloat(claimAmount) || 0;
    return claimCurrency === currency ? amt : 0;
  };

  const myrEquiv = calculatedMyrEquivalent();
  const equivalentText = (c: { currency: string; myrEquivalent: number }) =>
    c.currency === currency ? money(c.myrEquivalent, 2) : '—';
  const mealLimitAlert = claimCategory === 'Meal allowance' && myrEquiv > 30.00;
  const transportLimitAlert = claimCategory === 'Transport' && myrEquiv > 200.00;

  const handleReceiptSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      addToast('Receipt file is larger than 10MB.', 'error');
      return;
    }
    setHasReceiptFile(true);
    addToast('Receipt attached. Please enter the claim details.', 'info');
  };

  // Interactive UI Modal States
  const [selectedClaimDetail, setSelectedClaimDetail] = useState<Claim | null>(null);

  // Approval rules state
  const [approvalRules, setApprovalRules] = useState<{
    id: number;
    range: string;
    desc: string;
    type: string;
  }[]>([]);
  const [isEditApprovalRulesModalOpen, setIsEditApprovalRulesModalOpen] = useState(false);

  // Spend limits state
  const [spendLimits, setSpendLimits] = useState<{
    category: string;
    daily: string;
    monthly: string;
    receiptReq: string;
  }[]>([]);
  const [isEditSpendLimitsModalOpen, setIsEditSpendLimitsModalOpen] = useState(false);
  const [selectedSpendLimitIdx, setSelectedSpendLimitIdx] = useState<number | null>(null);

  // Validation rules checklist state
  const [validationRules, setValidationRules] = useState<{
    id: number;
    label: string;
    enabled: boolean;
  }[]>([]);
  const [isEditValidationRulesModalOpen, setIsEditValidationRulesModalOpen] = useState(false);
  const [newRuleInput, setNewRuleInput] = useState('');

  // Payroll integration push state
  const [isPayrollPushModalOpen, setIsPayrollPushModalOpen] = useState(false);
  const [payrollIntegrationChannel, setPayrollIntegrationChannel] = useState('Workday ERP Connector v2.4');
  const [isPushingInProgress, setIsPushingInProgress] = useState(false);
  const [pushProgressPct, setPushProgressPct] = useState(0);

  // Handle submit claim
  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStaffName) {
      addToast('Please select a claimant employee.', 'error')
      return
    }
    if (claimCategory.includes('--Select') || claimCategory === '-- Select category --' || !claimCategory) {
      addToast('Please select a valid claim category.', 'error')
      return
    }
    const amount = parseFloat(claimAmount)
    if (!(amount > 0)) {
      addToast('Please input an amount greater than 0.', 'error')
      return
    }
    setClaimsBusy(true)
    try {
      const created = await createMyClaim({
        category: claimCategory,
        claimDate,
        amount,
        currency: claimCurrency || currency,
        vendor: claimVendor || undefined,
        description: claimDesc || undefined,
        employeeId: employees.find((emp) => emp.id === selectedStaffName)?.apiId || undefined,
      })
      setClaims((prev) => [mapClaim(created), ...prev.filter((c) => c.id !== created.id)])
      addToast(`Claim for ${claimCurrency} ${fmtAmount(amount, 2)} submitted.`, 'success')
      setClaimCategory('-- Select category --')
      setClaimVendor('')
      setClaimAmount('0.00')
      setClaimDesc('')
      setHasReceiptFile(false)
      setSelectedStaffName('')
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Could not submit claim.', 'error')
    } finally {
      setClaimsBusy(false)
    }
  }

  const handleApprove = async (id: string) => {
    setClaimsBusy(true)
    try {
      const updated = await decideClaim(id, { decision: 'APPROVE' })
      setClaims((prev) => prev.map((c) => (c.id === id ? mapClaim(updated) : c)))
      addToast('Claim approved.', 'success')
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Could not approve claim.', 'error')
    } finally {
      setClaimsBusy(false)
    }
  }

  const handleReject = async (id: string) => {
    setClaimsBusy(true)
    try {
      const updated = await decideClaim(id, { decision: 'REJECT', note: 'Rejected by admin' })
      setClaims((prev) => prev.map((c) => (c.id === id ? mapClaim(updated) : c)))
      addToast('Claim rejected.', 'info')
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Could not reject claim.', 'error')
    } finally {
      setClaimsBusy(false)
    }
  }

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
    setIsPayrollPushModalOpen(false);
    addToast('Payroll integration is not connected yet. Approved claims remain queued.', 'info');
  };

  const handleExportClaims = () => {
    const ok = downloadCsv(
      `claims_${dateStamp()}`,
      ['ID', 'Employee', 'Department', 'Category', 'Date', 'Vendor', 'Currency', 'Amount', 'Policy flag', 'Status'],
      claims.map((c) => [c.id, c.empName, c.department, c.category, c.date, c.vendor, c.currency, c.amount.toFixed(2), c.policyFlag, c.status]),
    );
    addToast(ok ? `Exported ${claims.length} claims as CSV.` : 'Nothing to export yet.', ok ? 'success' : 'info');
  };

  const approvalRows = claims.filter(c => {
    const matchesStatus = approvalStatusFilter === 'All status' || c.status === approvalStatusFilter;
    const matchesCategory = approvalCategoryFilter === 'All categories' || c.category === approvalCategoryFilter;
    const matchesDept = approvalDeptFilter === 'All departments' || c.department === approvalDeptFilter;
    const matchesDate = approvalDateFilter === '' || c.date === approvalDateFilter;
    return matchesStatus && matchesCategory && matchesDept && matchesDate;
  });

  const historyRows = claims.filter(c => {
    const matchesStatus = historyStatusFilter === 'All status' || c.status === historyStatusFilter;
    const matchesCategory = historyCategoryFilter === 'All categories' || c.category === historyCategoryFilter;
    const matchesDept = historyDeptFilter === 'All departments' || c.department === historyDeptFilter;
    const matchesSearch = c.empName.toLowerCase().includes(historySearchQuery.toLowerCase());
    return matchesStatus && matchesCategory && matchesDept && matchesSearch;
  });

  const headerMonthLabel = monthLabelOf(headerMonth);
  const monthClaims = claims.filter(c => (c.date || '').slice(0, 7) === headerMonth);
  const monthTotal = monthClaims.reduce((acc, c) => acc + c.myrEquivalent, 0);
  const thisYear = new Date().getFullYear();
  const ytdTotal = claims.filter(c => (c.date || '').startsWith(String(thisYear))).reduce((acc, c) => acc + c.myrEquivalent, 0);
  const lastYtdCutoff = `${thisYear - 1}-${new Date().toLocaleDateString('en-CA').slice(5)}`;
  const lastYtdTotal = claims
    .filter(c => (c.date || '').startsWith(String(thisYear - 1)) && c.date <= lastYtdCutoff)
    .reduce((acc, c) => acc + c.myrEquivalent, 0);
  const ytdChangePct = lastYtdTotal > 0 ? Math.round(((ytdTotal - lastYtdTotal) / lastYtdTotal) * 100) : null;
  const monthFlagged = monthClaims.filter(c => c.policyFlag !== 'Clear');
  const categorySpend = groupClaimTotals(monthClaims, c => c.category);
  const departmentSpend = groupClaimTotals(monthClaims, c => c.department);
  const topClaimants = groupClaimTotals(monthClaims, c => c.empName).slice(0, 5);
  const maxCategorySpend = Math.max(1, ...categorySpend.map(c => c.amount));
  const maxDepartmentSpend = Math.max(1, ...departmentSpend.map(d => d.amount));
  const auditTrail = claims
    .filter(c => c.status !== 'Pending')
    .sort((a, b) => (b.decidedAt || b.date).localeCompare(a.decidedAt || a.date))
    .slice(0, 4);
  const fxClaims = claims.filter(c => c.currency !== currency).slice(0, 5);
  const [headerYear, headerMonthNum] = headerMonth.split('-').map(Number);
  const formatLongDate = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const payrollCutoffLabel = formatLongDate(new Date(headerYear, headerMonthNum - 1, 25));
  const nextPayrollLabel = formatLongDate(new Date(headerYear, headerMonthNum, 0));
  const formatDateTime = (value: string | null, fallback: string) => {
    if (!value) return fallback;
    const d = new Date(value);
    return Number.isNaN(d.getTime())
      ? fallback
      : d.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div id="claims-tab-stage" className="space-y-6 animate-in fade-in duration-200">
      <ModuleHeader
        title="Claims"
        description="Submit, approve, and reconcile expense claims."
      />

      {/* 1. UPPER NAVIGATION & PRIMARY HORIZONTAL NAV-BAR - styled exactly like Payroll and Disciplinary */}
      <div id="claims-module-navigator" className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-200/85 pb-4 gap-4">
        
        {/* Navigation tabs styled as pills with active background */}
        <div id="claims-navigation-tabs" className="flex items-center gap-2 select-none overflow-x-auto w-full lg:w-auto scrollbar-none py-1">
          {[
            { id: 'Submit Claim', label: 'Submit Claim', icon: PlusCircle },
            { id: 'Approval', label: 'Approval', icon: CheckCircle, badge: pendingCount, badgeColor: 'bg-amber-100 text-amber-700 border-amber-200' },
            { id: 'Claim History', label: 'Claim History', icon: RotateCcw },
            // Hidden until APIs exist: Policy & Compliance, Payroll Integration, Analytics & Reports
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
                    ? 'bg-blue-50 text-novora'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`font-bold text-[10px] h-4.5 min-w-4.5 px-1 rounded-full flex items-center justify-center border ${tab.badgeColor}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Global top level controllers aligned on the right, integrated into the navigation grid */}
        <div id="claims-upper-actions" className="flex items-center gap-2.5 ml-auto sm:ml-0 font-sans text-slate-700 shrink-0 flex-nowrap">
          
          {/* Period selector */}
          <DropdownAnchor
            open={monthDropdownOpen}
            onClose={() => setMonthDropdownOpen(false)}
            align="right"
          >
            <button
              type="button" aria-expanded={monthDropdownOpen}
              onClick={() => {
                setDeptDropdownOpen(false)
                setMonthDropdownOpen(!monthDropdownOpen)
              }}
              className={`nv-dd-trigger ${monthDropdownOpen ? 'nv-dd-trigger--open' : ''}`}
            >
              <span className="whitespace-nowrap">{headerMonthLabel}</span>
              <ChevronDown className="nv-chevron-down nv-chevron-down--sm" />
            </button>
            {monthDropdownOpen && (
              <div className="nv-dropdown-menu w-32">
                {recentMonthKeys(3).map((m) => (
                  <button
                    key={m}
                    type="button"
                    aria-selected={headerMonth === m}
                    onClick={() => { setHeaderMonth(m); setMonthDropdownOpen(false); }}
                    className={headerMonth === m ? 'nv-dropdown-item--active' : ''}
                  >
                    {monthLabelOf(m)}
                  </button>
                ))}
              </div>
            )}
          </DropdownAnchor>

          {/* Department dropdown filter */}
          <DropdownAnchor
            open={deptDropdownOpen}
            onClose={() => setDeptDropdownOpen(false)}
            align="right"
          >
            <button
              type="button" aria-expanded={deptDropdownOpen}
              onClick={() => {
                setMonthDropdownOpen(false)
                setDeptDropdownOpen(!deptDropdownOpen)
              }}
              className={`nv-dd-trigger ${deptDropdownOpen ? 'nv-dd-trigger--open' : ''}`}
            >
              <span className="whitespace-nowrap">{headerDept}</span>
              <ChevronDown className="nv-chevron-down nv-chevron-down--sm" />
            </button>
            {deptDropdownOpen && (
              <div className="nv-dropdown-menu w-44">
                {['All departments', 'Engineering', 'Finance', 'HR', 'Marketing', 'Operations'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    aria-selected={headerDept === d}
                    onClick={() => { setHeaderDept(d); setDeptDropdownOpen(false); }}
                    className={headerDept === d ? 'nv-dropdown-item--active' : ''}
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </DropdownAnchor>

          {/* Export utility */}
          <button
            type="button"
            onClick={handleExportClaims}
            className="nv-toolbar-btn"
          >
            <Download className="h-4 w-4" />
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
              <div className="nv-card p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Receipt capture</h3>
                  <div className="flex gap-1">
                    <span className="bg-slate-50 text-[10px] font-semibold text-slate-500 px-2 py-0.5 rounded-md">Mobile upload</span>
                  </div>
                </div>

                <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50/50 flex flex-col items-center justify-center min-h-48 relative overflow-hidden group">
                  <div className="h-10 w-10 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform shadow-xs mb-3 shrink-0">
                    <Paperclip className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">{hasReceiptFile ? 'Receipt attached' : 'Snap or upload receipt'}</p>
                  <p className="text-[10px] font-medium text-slate-400 mt-1">JPG, PNG, PDF &bull; max 10MB</p>
                  <input
                    ref={receiptInputRef}
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    className="hidden"
                    onChange={handleReceiptSelected}
                  />
                  <button
                    type="button"
                    onClick={() => receiptInputRef.current?.click()}
                    className="mt-4 bg-novora hover:bg-blue-600 text-white text-[11px] font-black tracking-wide px-4 py-1.5 rounded-lg transition-colors cursor-pointer uppercase"
                  >
                    {hasReceiptFile ? 'Replace receipt' : 'Attach receipt'}
                  </button>
                </div>
              </div>

              {/* My Recent Claims Widget */}
              <div className="nv-card p-6 shadow-xs">
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
                      {claims.length === 0 && (
                        <tr><td colSpan={5} className="p-6 text-center text-xs text-slate-400">No records yet.</td></tr>
                      )}
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
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-150'
                                : claim.status === 'Rejected'
                                  ? 'bg-red-50 text-red-700 border border-red-150'
                                  : 'bg-amber-50 text-amber-700 border border-amber-100'
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
                              className="bg-slate-50 hover:bg-novora/10 hover:text-novora text-slate-600 border border-slate-200 hover:border-novora/20 font-bold px-2.5 py-1 rounded-lg text-xs cursor-pointer transition-all"
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
            <form onSubmit={handleSubmitClaim} className="lg:col-span-7 nv-card p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Claim entry form</h3>
                <span className="bg-slate-50 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-lg">Claim details</span>
              </div>

              {/* Employee Selection Mapping (Real links support) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Claimant Employee Name *</label>
                  <SelectMenu
                    value={selectedStaffName}
                    onChange={setSelectedStaffName}
                    placeholder="Consolidated Selection (Choose employee)"
                    triggerClassName="text-xs font-semibold text-slate-700"
                    options={[
                      { value: '', label: 'Consolidated Selection (Choose employee)' },
                      ...employees.map((emp) => ({
                        value: emp.id,
                        label: emp.name,
                      })),
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Claim category *</label>
                  <SelectMenu
                    value={claimCategory}
                    onChange={setClaimCategory}
                    triggerClassName="text-xs font-semibold text-slate-700"
                    options={[
                      { value: '-- Select category --', label: '-- Select category --' },
                      { value: 'Meal allowance', label: 'Meal allowance' },
                      { value: 'Transport', label: 'Transport' },
                      { value: 'Hotel / stay', label: 'Hotel / stay' },
                      { value: 'Air ticket', label: 'Air ticket' },
                      { value: 'Mileage', label: 'Mileage' },
                      { value: 'Entertainment', label: 'Entertainment' },
                      { value: 'Wellness', label: 'Wellness' },
                    ]}
                  />
                </div>
              </div>

              {/* Date & Vendor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Claim date *</label>
                  <input
                    type="date"
                    aria-label="Claim date"
                    value={claimDate}
                    onChange={(e) => setClaimDate(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 focus:border-novora rounded-xl px-3 py-1.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Vendor / merchant</label>
                  <input
                    type="text"
                    placeholder="e.g. Subway Pte. Ltd."
                    value={claimVendor}
                    onChange={(e) => setClaimVendor(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 focus:border-novora rounded-xl px-3 py-2 outline-none"
                  />
                </div>
              </div>

              {/* Currency & Amount calculations */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Currency *</label>
                  <SelectMenu
                    value={claimCurrency}
                    onChange={setClaimCurrency}
                    aria-label="Currency"
                    triggerClassName="text-xs font-semibold"
                    options={
                      CURRENCY_OPTIONS.some((o) => o.value === currency)
                        ? CURRENCY_OPTIONS
                        : [{ value: currency, label: currency }, ...CURRENCY_OPTIONS]
                    }
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(e.target.value)}
                    className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 hover:border-slate-300 focus:border-novora rounded-xl px-3 py-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{currency} equiv.</label>
                  <div className="w-full text-xs font-black text-slate-500 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                    {claimCurrency === currency ? money(myrEquiv, 2) : 'Converted by finance on approval'}
                  </div>
                </div>
              </div>

              {/* Exchange rate info badge */}
              <div className="bg-blue-50 border border-blue-100/50 rounded-xl p-3 text-[11px] font-semibold text-novora flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-novora rounded-full animate-ping items-center shrink-0"></span>
                <span>
                  {claimCurrency === currency
                    ? `Claim is in the company currency (${currency}).`
                    : `Foreign-currency claim: no live exchange rate is connected, so limits and totals in ${currency} exclude it until finance converts it.`}
                </span>
              </div>

              {/* Project / cost centre */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Project / cost centre</label>
                <SelectMenu
                  value={claimProject}
                  onChange={setClaimProject}
                  aria-label="Project cost centre"
                  placeholder="-- Select (optional) --"
                  triggerClassName="text-xs font-semibold"
                  options={[
                    { value: '', label: '-- Select (optional) --' },
                    { value: 'Dept General Operations', label: 'Corporate Overhead · General' },
                    { value: 'SaaS Integration Audit', label: 'Internal Audit Tech Team' },
                    { value: 'Sales Campaign Q2', label: 'Marketing Acquisition Launch 2026' },
                  ]}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Claim description</label>
                <textarea
                  rows={3}
                  placeholder="Brief description of the business purpose of the expense..."
                  value={claimDesc}
                  onChange={(e) => setClaimDesc(e.target.value)}
                  className="w-full text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:border-slate-300 focus:border-novora rounded-xl px-3.5 py-2.5 outline-none resize-none"
                />
              </div>

              {/* Receipt attachment status indicator */}
              <div id="receipt-attachment-row" className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded uppercase">Receipt attachment</span>
                  <span className="text-[10px] font-bold text-slate-500">
                    {hasReceiptFile ? '✓ Receipt attached' : `Upload receipt (required for claims > ${currency} 50)`}
                  </span>
                </div>
                {hasReceiptFile && (
                  <button
                    type="button"
                    onClick={() => { setHasReceiptFile(false); addToast('Receipt detached.', 'info'); }}
                    className="text-red-500 hover:text-red-650 font-bold text-xs"
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
                    Meal allowance daily limit is {money(30, 2)}. Your claim of {money(myrEquiv, 2)} exceeds the limit by {money(myrEquiv - 30, 2)}. Additional approval required.
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
                    Transport daily limit is {money(200, 2)}. Your claim of {money(myrEquiv, 2)} exceeds the limit by {money(myrEquiv - 200, 2)}. Additional approval required.
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
                  className="h-4 w-4 text-novora border-slate-200 rounded-sm focus:ring-novora"
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
                    addToast('Drafts are not saved yet. Your entries stay in this form until you submit.', 'info');
                  }}
                  className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 transition-colors rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Save draft
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-novora hover:bg-blue-700 transition-colors rounded-xl text-xs font-black text-white shadow-xs cursor-pointer"
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
                <SelectMenu
                  value={approvalStatusFilter}
                  onChange={setApprovalStatusFilter}
                  aria-label="Approval status filter"
                  className="w-auto shrink-0"
                  triggerClassName="nv-select-trigger--toolbar min-w-[8rem]"
                  options={[
                    { value: 'All status', label: 'All status' },
                    { value: 'Pending', label: 'Pending' },
                    { value: 'Approved', label: 'Approved' },
                    { value: 'Rejected', label: 'Rejected' },
                  ]}
                />

                <SelectMenu
                  value={approvalCategoryFilter}
                  onChange={setApprovalCategoryFilter}
                  aria-label="Approval category filter"
                  className="w-auto shrink-0"
                  triggerClassName="nv-select-trigger--toolbar min-w-[9rem]"
                  options={[
                    { value: 'All categories', label: 'All categories' },
                    { value: 'Meal allowance', label: 'Meal allowance' },
                    { value: 'Transport', label: 'Transport' },
                    { value: 'Hotel / stay', label: 'Hotel / stay' },
                    { value: 'Air ticket', label: 'Air ticket' },
                    { value: 'Mileage', label: 'Mileage' },
                    { value: 'Wellness', label: 'Wellness' },
                  ]}
                />

                <SelectMenu
                  value={approvalDeptFilter}
                  onChange={setApprovalDeptFilter}
                  aria-label="Approval department filter"
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

                <input
                  type="date"
                  value={approvalDateFilter}
                  onChange={(e) => setApprovalDateFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3.5 py-1 text-xs text-slate-600 font-semibold outline-none"
                />

                <span className="bg-amber-50 text-amber-700 font-extrabold text-xs px-3 py-1 rounded-full border border-amber-100 inline-flex items-center whitespace-nowrap shrink-0">
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
            <div className="nv-card p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[13px] font-black text-slate-700 uppercase tracking-wider">Approval routing rules</h3>
                <button
                  onClick={() => setIsEditApprovalRulesModalOpen(true)}
                  className="text-novora hover:underline text-xs font-bold flex items-center gap-1 cursor-pointer"
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
                        rule.type.includes('Parallel') ? 'bg-sky-50 text-sky-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>{rule.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Approval Datatable */}
            <div className="nv-card overflow-hidden shadow-xs">
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
                  {approvalRows.length === 0 && (
                    <tr><td colSpan={8} className="p-6 text-center text-xs text-slate-400">No records yet.</td></tr>
                  )}
                  {approvalRows
                    .map((claim) => (
                      <tr key={claim.id} className="hover:bg-slate-50/30">
                        <td className="p-4 pl-6 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-full bg-novora/10 text-novora font-black text-[10px] flex items-center justify-center shrink-0">
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
                            claim.category === 'Air ticket' ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {claim.category}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap text-slate-500">
                          {new Date(claim.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </td>
                        <td className="p-4 whitespace-nowrap font-bold text-slate-800">
                          {equivalentText(claim)}
                          {claim.currency !== currency && (
                            <span className="block text-[9px] text-slate-400 font-semibold">{claim.currency} {claim.amount.toFixed(2)}</span>
                          )}
                        </td>
                        <td className="p-4 text-slate-500 font-mono text-[10.5px]">
                          {claim.approvalChain}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            claim.policyFlag === 'Clear' ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' : 'bg-red-50 text-red-700 border border-red-150'
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
                              className="bg-slate-50 hover:bg-novora/10 hover:text-novora text-slate-600 border border-slate-200 hover:border-novora/20 font-bold px-2.5 py-1 rounded-lg text-xs cursor-pointer transition-all"
                            >
                              View
                            </button>
                            {claim.status === 'Pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(claim.id)}
                                  className="bg-emerald-600 hover:bg-emerald-750 text-white font-bold text-[10.5px] px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
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
              <div className="nv-card p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Category spend limits</h3>
                  <button
                    onClick={() => {
                      if (spendLimits.length === 0) {
                        addToast('No category spend limits are configured yet.', 'info');
                        return;
                      }
                      setSelectedSpendLimitIdx(0);
                      setIsEditSpendLimitsModalOpen(true);
                      addToast('Select a category row to modify specific spending caps.', 'info');
                    }}
                    className="text-novora hover:underline text-xs font-bold flex items-center gap-1 cursor-pointer"
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
                              className="p-1.5 rounded-lg text-slate-400 hover:text-novora hover:bg-slate-50 transition-colors cursor-pointer inline-flex items-center justify-center"
                              title="Edit"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Auto validation rules */}
              <div className="nv-card p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Auto-validation rules</h3>
                  <button 
                    onClick={() => setIsEditValidationRulesModalOpen(true)} 
                    className="text-novora hover:underline text-xs font-bold flex items-center gap-1 cursor-pointer"
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
                        className="h-4 w-4 text-novora border-slate-300 rounded mt-0.5 focus:ring-novora cursor-pointer" 
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
              <div className="nv-card p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Policy flags &mdash; this month</h3>
                  <span className="bg-red-100 text-red-700 text-[10px] font-black px-2 py-0.5 rounded-md">{monthFlagged.length} flags</span>
                </div>

                <div className="space-y-4 text-xs font-semibold">
                  {monthFlagged.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No policy flags this month.</p>
                  ) : (
                    monthFlagged.slice(0, 6).map((c) => (
                      <div key={c.id} className="flex items-start gap-3 p-3 bg-red-50/20 border border-red-100 rounded-xl">
                        <div className="h-2 w-2 rounded-full bg-amber-500 mt-1 shrink-0 items-center" />
                        <div className="flex-1">
                          <p className="text-slate-800 font-bold">{c.category === 'Meal allowance' ? 'Meal limit exceeded' : 'Transport limit exceeded'}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {c.empName} &bull; {c.currency} {c.amount.toFixed(2)} vs {currency} {c.category === 'Meal allowance' ? '30' : '200'} limit
                          </p>
                        </div>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${
                          c.status === 'Pending' ? 'bg-amber-100 text-amber-800' : c.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>{c.status}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Audit trail */}
              <div className="nv-card p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Audit trail &mdash; recent actions</h3>
                  <button onClick={() => setActiveSubTab('Claim History')} className="text-slate-500 hover:text-slate-700 text-xs font-bold">Full log</button>
                </div>

                <div className="space-y-4 text-xs">
                  {auditTrail.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No approval decisions recorded yet.</p>
                  ) : (
                    auditTrail.map((c) => (
                      <div key={c.id} className="flex gap-3">
                        <div className={`h-2.5 w-2.5 rounded-full mt-1 shrink-0 items-center ${c.status === 'Approved' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <div>
                          <span className="block text-[10px] text-slate-400 font-bold">{formatDateTime(c.decidedAt, c.date)}</span>
                          <p className="font-semibold text-slate-700 mt-0.5">
                            <strong className="text-slate-900 font-bold">{c.decidedBy || 'Approver'}</strong> {c.status === 'Approved' ? 'approved' : 'rejected'} {c.currency} {c.amount.toFixed(2)} {c.category.toLowerCase()} &mdash; {c.empName}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
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
              
              <div className="nv-card p-6 shadow-xs space-y-5">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-50 pb-3.5">Payroll push status &mdash; {headerMonthLabel}</h3>
                
                <div className="space-y-4 text-xs font-semibold">
                  <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                    <span className="text-slate-500">Total approved claims</span>
                    <span className="font-extrabold text-novora">
                      {money(claims.filter(c => c.status === 'Approved').reduce((acc, curr) => acc + curr.myrEquivalent, 0))}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                    <span className="text-slate-500">Pushed to payroll</span>
                    <span className="font-extrabold text-emerald-600">
                      {money(claims.filter(c => c.status === 'Approved' && c.pushStatus === 'Pushed').reduce((acc, curr) => acc + curr.myrEquivalent, 0))}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                    <span className="text-slate-500">Awaiting push</span>
                    <span className="font-extrabold text-amber-600">
                      {money(claims.filter(c => c.status === 'Approved' && c.pushStatus === 'Queued').reduce((acc, curr) => acc + curr.myrEquivalent, 0))}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                    <span className="text-slate-500">Payroll cut-off</span>
                    <span className="text-slate-800 font-bold">{payrollCutoffLabel}</span>
                  </div>

                  <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                    <span className="text-slate-500">Next payroll date</span>
                    <span className="text-slate-800 font-bold">{nextPayrollLabel}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2.5">
                    <span className="text-slate-500">Integration status</span>
                    <span className="bg-slate-50 text-slate-500 border border-slate-150 rounded-md text-[10px] px-2.5 py-0.5 font-bold">Not connected</span>
                  </div>
                </div>
              </div>

              {/* Currency conversion log bottom left */}
              <div className="nv-card p-6 shadow-xs">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4">Currency conversion log</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-semibold text-slate-600">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold text-[10px] tracking-wider uppercase">
                        <th className="pb-2">Employee</th>
                        <th className="pb-2">Orig.</th>
                        <th className="pb-2">Orig. amt</th>
                        <th className="pb-2">Rate</th>
                        <th className="pb-2 text-right">{currency} equiv.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px] text-slate-700">
                      {fxClaims.length === 0 ? (
                        <tr><td colSpan={5} className="p-6 text-center text-xs text-slate-400">No records yet.</td></tr>
                      ) : (
                        fxClaims.map((c) => (
                          <tr key={c.id}>
                            <td className="py-2.5 font-bold text-slate-800">{c.empName}</td>
                            <td className="py-2.5">{c.currency}</td>
                            <td className="py-2.5">{c.amount.toFixed(2)}</td>
                            <td className="py-2.5">—</td>
                            <td className="py-2.5 text-right font-black text-slate-900">{equivalentText(c)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Right side: Claims batching process (cols-8) */}
            <div className="lg:col-span-8 nv-card p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Claims ready for payroll batch</h3>
                  <span className="bg-amber-100 text-amber-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full inline-flex items-center whitespace-nowrap shrink-0">
                    {claims.filter(c => c.status === 'Approved' && c.pushStatus === 'Queued').length} claims
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handlePushToPayroll}
                    className="px-3.5 py-1.5 border border-slate-100 text-xs font-bold rounded-lg text-slate-600 bg-white"
                  >
                    Preview batch
                  </button>
                  <button
                    onClick={handlePushToPayroll}
                    className="h-9 inline-flex items-center gap-1.5 px-4 text-xs font-black text-white bg-novora hover:bg-blue-700 rounded-lg shadow-xs cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span>Push to payroll</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 font-bold text-[10px] tracking-wider uppercase border-b border-slate-100 pb-2">
                      <th className="pb-3">Employee</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Amount ({currency})</th>
                      <th className="pb-3">Approved by</th>
                      <th className="pb-3 text-right">Push status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {!claims.some(c => c.status === 'Approved') && (
                      <tr><td colSpan={5} className="p-6 text-center text-xs text-slate-400">No records yet.</td></tr>
                    )}
                    {claims
                      .filter(c => c.status === 'Approved')
                      .map((claim) => (
                        <tr key={claim.id} className="hover:bg-slate-50/20">
                          <td className="py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full bg-slate-100 text-slate-700 font-black text-[9px] flex items-center justify-center shrink-0">
                                {claim.empName.split(' ').map(n=>n[0]).join('')}
                              </div>
                              <span className="font-bold text-slate-800">{claim.empName}</span>
                            </div>
                          </td>
                          <td className="py-3.5 text-slate-500">{claim.category}</td>
                          <td className="py-3.5 font-bold text-slate-900">{equivalentText(claim)}</td>
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
              <div className="bg-blue-50/50 border border-blue-55 rounded-xl p-4 flex justify-between items-center text-sm font-black text-slate-700 mt-5">
                <span className="text-slate-500 text-xs">Total queued for {headerMonthLabel} payroll</span>
                <span className="text-xl text-novora font-black">
                  {money(claims.filter(c => c.status === 'Approved' && c.pushStatus === 'Queued').reduce((acc, curr) => acc + curr.myrEquivalent, 0))}
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
                  {ytdChangePct !== null && (
                    <span className="text-emerald-500 text-xs font-bold inline-flex items-center gap-0.5">
                      <TrendingUp className="h-3 w-3" /> {ytdChangePct >= 0 ? '+' : ''}{ytdChangePct}% vs last year
                    </span>
                  )}
                </div>
                <p className="text-2xl font-black text-slate-800 mt-2">{money(ytdTotal)}</p>
              </div>

              <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Claimed &mdash; {headerMonthLabel}</span>
                  <span className="text-amber-600 text-xs font-semibold">{monthClaims.length} claims</span>
                </div>
                <p className="text-2xl font-black text-slate-800 mt-2">{money(monthTotal)}</p>
              </div>

              <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Policy flags &mdash; {headerMonthLabel}</span>
                  <span className="text-red-500 text-[10px] font-bold">{monthFlagged.filter(c => c.status === 'Pending').length} pending review</span>
                </div>
                <p className="text-2xl font-black text-red-650 mt-2">{monthFlagged.length}</p>
              </div>
            </div>

            {/* Dashboard Graphics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Spend by category */}
              <div className="nv-card p-6 shadow-xs space-y-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-50 pb-2">Spend by category &mdash; {headerMonthLabel}</h3>
                
                <div className="space-y-3.5">
                  {categorySpend.length === 0 && (
                    <p className="text-xs text-slate-400">No claims this month.</p>
                  )}
                  {categorySpend.map((cat, i) => (
                    <div key={cat.label} className="text-xs font-bold text-slate-700">
                      <div className="flex justify-between mb-1">
                        <span>{cat.label}</span>
                        <span className="font-black text-slate-900">{money(cat.amount)}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className={`${BAR_COLORS[i % BAR_COLORS.length]} h-2.5 rounded-full`} style={{ width: `${Math.round((cat.amount / maxCategorySpend) * 100)}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spend by department */}
              <div className="nv-card p-6 shadow-xs space-y-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-50 pb-2">Spend by department</h3>
                
                <div className="space-y-3.5 text-xs font-bold text-slate-700">
                  {departmentSpend.length === 0 && (
                    <p className="text-xs text-slate-400 font-medium">No claims this month.</p>
                  )}
                  {departmentSpend.map((dept, i) => (
                    <div key={dept.label}>
                      <div className="flex justify-between mb-1">
                        <span>{dept.label}</span>
                        <span className="text-slate-900 font-black">{money(dept.amount)}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className={`${BAR_COLORS[i % BAR_COLORS.length]} h-2.5 rounded-full`} style={{ width: `${Math.round((dept.amount / maxDepartmentSpend) * 100)}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Budget tracking progress bars */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="nv-card p-6 shadow-xs space-y-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-50 pb-2">Budget tracking &mdash; travel &amp; entertainment</h3>
                
                <div className="space-y-4 text-xs font-semibold text-slate-700">
                  {DEPARTMENT_BUDGETS.map((budget) => {
                    const spent = monthClaims
                      .filter(c => c.department === budget.department && (!budget.category || c.category === budget.category))
                      .reduce((acc, c) => acc + c.myrEquivalent, 0);
                    const pct = Math.min(100, Math.round((spent / budget.cap) * 100));
                    const alert = pct >= 90;
                    return (
                      <div key={budget.label}>
                        <div className="flex justify-between mb-1 flex-wrap gap-1">
                          <span className="font-bold text-slate-800">{budget.label}</span>
                          <span className={`font-extrabold ${alert ? 'text-red-650' : ''}`}>
                            {money(spent)} / {money(budget.cap, 0)}{alert ? ' \u2022 alert!' : ''}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className={`${alert ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-blue-600'} h-2 rounded-full items-center shrink-0`} style={{ width: `${pct}%` }}></div>
                        </div>
                        <span className={`block text-[10px] mt-1 ${alert ? 'text-red-500' : 'text-slate-400'}`}>
                          {pct}% used &bull; {money(Math.max(0, budget.cap - spent))} remaining
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top claimants */}
              <div className="nv-card p-6 shadow-xs space-y-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-50 pb-2">Top claimants &mdash; {headerMonthLabel}</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 font-bold text-[10px] tracking-wider uppercase border-b border-slate-100 pb-2">
                        <th className="pb-2.5">Employee</th>
                        <th className="pb-2.5">No. claims</th>
                        <th className="pb-2.5">Total ({currency})</th>
                        <th className="pb-2.5 text-right">Flags</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {topClaimants.length === 0 ? (
                        <tr><td colSpan={4} className="p-6 text-center text-xs text-slate-400">No records yet.</td></tr>
                      ) : (
                        topClaimants.map((row) => (
                          <tr key={row.label}>
                            <td className="py-2.5">
                              <div className="flex items-center gap-2">
                                <span className="bg-novora/10 text-novora h-6 w-6 rounded-full font-black text-[9px] flex items-center justify-center shrink-0">{initialsOf(row.label)}</span>
                                <span className="font-bold text-slate-800">{row.label}</span>
                              </div>
                            </td>
                            <td className="py-2.5 text-slate-500">{row.count} {row.count === 1 ? 'claim' : 'claims'}</td>
                            <td className="py-2.5 font-bold text-novora">{fmtAmount(row.amount)}</td>
                            <td className="py-2.5 text-right">
                              <span className={`text-[10px] px-2 py-0.5 rounded font-black ${row.flags > 0 ? 'bg-red-105 text-red-700' : 'bg-slate-100 text-slate-400'}`}>{row.flags}</span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* THE USER REQUESTED EXTRA PANEL: Claims Tab Reports (Same level structure as Employee Reports tab!) */}
            <div className="nv-card p-6 shadow-xs space-y-5">
              <div className="border-b border-indigo-50 pb-3 flex flex-wrap justify-between items-center gap-3">
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">CLAIMS REPORT GENERATOR</h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">Filter records and compile audit sheets similar to Employee Management directory dossiers</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 border border-slate-100 rounded-lg text-slate-600 bg-white hover:bg-slate-50 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Print PDF Ledger</span>
                  </button>
                  <button
                    onClick={(e) => {
                      const n = downloadNearestTableCsv(e.currentTarget, `claims_ledger_${dateStamp()}`);
                      addToast(n ? `Exported ${n} rows as CSV.` : 'Nothing to export yet.', n ? 'success' : 'info');
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
                  <SelectMenu
                    value={repDept}
                    onChange={(v) => { setRepDept(v); setIsReportGenerated(true); }}
                    triggerClassName="text-xs font-bold border-slate-200"
                    options={[
                      { value: 'All', label: 'All Departments' },
                      { value: 'Engineering', label: 'Engineering' },
                      { value: 'Finance', label: 'Finance' },
                      { value: 'HR', label: 'HR' },
                      { value: 'Marketing', label: 'Marketing' },
                      { value: 'Operations', label: 'Operations' },
                    ]}
                  />
                </div>

                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Expense category</span>
                  <SelectMenu
                    value={repCategory}
                    onChange={(v) => { setRepCategory(v); setIsReportGenerated(true); }}
                    triggerClassName="text-xs font-bold border-slate-200"
                    options={[
                      { value: 'All', label: 'All Categories' },
                      { value: 'Meal allowance', label: 'Meal allowance' },
                      { value: 'Transport', label: 'Transport' },
                      { value: 'Hotel / stay', label: 'Hotel / stay' },
                      { value: 'Air ticket', label: 'Air ticket' },
                      { value: 'Wellness', label: 'Wellness' },
                    ]}
                  />
                </div>

                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sanction state</span>
                  <SelectMenu
                    value={repStatus}
                    onChange={(v) => { setRepStatus(v); setIsReportGenerated(true); }}
                    triggerClassName="text-xs font-bold border-slate-200"
                    options={[
                      { value: 'All', label: 'All Statuses' },
                      { value: 'Pending', label: 'Approval Pending' },
                      { value: 'Approved', label: 'Approved and Queued' },
                      { value: 'Rejected', label: 'Rejected' },
                    ]}
                  />
                </div>

                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Search claimant</span>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by name"
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
                        <span className="text-base font-black text-novora mt-1 block">{money(totalSum, 2)}</span>
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <span className="block text-[9px] font-bold text-slate-400 uppercase">Average Ticket</span>
                        <span className="text-base font-black text-slate-800 mt-1 block">{money(averageClaim, 2)}</span>
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        <span className="block text-[9px] font-bold text-slate-400 uppercase">Policy Violations</span>
                        <span className="text-base font-black text-red-650 mt-1 block">{flaggedSum} infractions</span>
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
                            <th className="p-3">Amount ({currency})</th>
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
                                <td className="p-3 pl-4 font-mono text-[10px] text-novora">{c.id}</td>
                                <td className="p-3">
                                  <div className="font-bold text-slate-800">{c.empName}</div>
                                  <div className="text-[10px] text-slate-400 font-medium">{c.department}</div>
                                </td>
                                <td className="p-3 text-[11px]">{c.category}</td>
                                <td className="p-3 text-slate-500">{c.date}</td>
                                <td className="p-3 text-slate-500 font-sans">{c.vendor}</td>
                                <td className="p-3 font-bold text-slate-900">{equivalentText(c)}</td>
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
                <SelectMenu
                  value={historyStatusFilter}
                  onChange={setHistoryStatusFilter}
                  aria-label="History status"
                  className="w-auto shrink-0"
                  triggerClassName="nv-select-trigger--toolbar min-w-[8rem]"
                  options={[
                    { value: 'All status', label: 'All status' },
                    { value: 'Pending', label: 'Pending' },
                    { value: 'Approved', label: 'Approved' },
                    { value: 'Rejected', label: 'Rejected' },
                  ]}
                />

                <SelectMenu
                  value={historyCategoryFilter}
                  onChange={setHistoryCategoryFilter}
                  aria-label="History category"
                  className="w-auto shrink-0"
                  triggerClassName="nv-select-trigger--toolbar min-w-[9rem]"
                  options={[
                    { value: 'All categories', label: 'All categories' },
                    { value: 'Meal allowance', label: 'Meal allowance' },
                    { value: 'Transport', label: 'Transport' },
                    { value: 'Hotel / stay', label: 'Hotel / stay' },
                    { value: 'Air ticket', label: 'Air ticket' },
                    { value: 'Mileage', label: 'Mileage' },
                    { value: 'Wellness', label: 'Wellness' },
                  ]}
                />

                <SelectMenu
                  value={historyDeptFilter}
                  onChange={setHistoryDeptFilter}
                  aria-label="History department"
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
                  onClick={() => window.print()}
                  className="text-slate-700 hover:text-slate-800 text-xs font-bold px-3 py-1.5 bg-white border border-slate-100 rounded-xl"
                >
                  Generate PDF
                </button>
                <button
                  onClick={(e) => {
                    const n = downloadNearestTableCsv(e.currentTarget, `claim_history_${dateStamp()}`);
                    addToast(n ? `Exported ${n} rows as CSV.` : 'Nothing to export yet.', n ? 'success' : 'info');
                  }}
                  className="bg-novora text-white hover:bg-blue-700 text-xs font-black px-4 py-1.5 rounded-xl cursor-pointer"
                >
                  Export
                </button>
              </div>
            </div>

            {/* Complete Claims Table */}
            <div className="nv-card overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold text-[10px] tracking-wider uppercase">
                    <th className="p-4 pl-6">Employee</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Claim date</th>
                    <th className="p-4">Vendor</th>
                    <th className="p-4">Amount ({currency})</th>
                    <th className="p-4">Approved by</th>
                    <th className="p-4">Payroll month</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right pr-6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {historyRows.length === 0 && (
                    <tr><td colSpan={9} className="p-6 text-center text-xs text-slate-400">No records yet.</td></tr>
                  )}
                  {historyRows
                    .map((claim) => (
                      <tr key={claim.id} className="hover:bg-slate-50/20">
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-2.5">
                            <span className="bg-indigo-50 text-indigo-705 h-7 w-7 rounded-full font-black text-[10px] flex items-center justify-center border border-indigo-100 shrink-0">
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
                        <td className="p-4 text-slate-600 font-normal">
                          {claim.vendor}
                        </td>
                        <td className="p-4 font-bold text-slate-900">
                          {equivalentText(claim)}
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
                            claim.pushStatus === 'Pushed' ? 'bg-emerald-50 text-emerald-800 border border-emerald-150' :
                            claim.pushStatus === 'Queued' ? 'bg-amber-50 text-amber-700 border border-[#fef3c7]' :
                            claim.status === 'Rejected' ? 'bg-red-50 text-red-800 border border-red-150' : 'bg-slate-50 text-slate-400 border border-slate-100'
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
                            className="bg-slate-50 hover:bg-novora/10 hover:text-novora text-slate-600 border border-slate-200 hover:border-novora/20 font-bold px-2.5 py-1 rounded-lg text-xs cursor-pointer transition-all"
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
                <Settings className="h-5 w-5 text-novora" />
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
                Configure tier boundaries and approval workflows based on the total claim value ({currency} equivalent). Changes will affect any claim submitted from this point onward.
              </p>

              <div className="space-y-4">
                {approvalRules.map((rule, idx) => (
                  <div key={rule.id} className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-novora bg-novora/10 px-2 py-0.5 rounded text-[10.5px]">Rule Range {idx+1}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-bold">Route Type:</span>
                        <SelectMenu
                          value={rule.type}
                          onChange={(v) => { const updated = [...approvalRules]; updated[idx].type = v; setApprovalRules(updated); }}
                          className="w-auto shrink-0"
                          triggerClassName="nv-select-trigger--toolbar min-w-[8rem]"
                          options={[
                            { value: 'Sequential', label: 'Sequential' },
                            { value: 'Parallel with Dept Head', label: 'Parallel with Dept Head' },
                            { value: 'Direct Approval', label: 'Direct Approval' },
                          ]}
                        />
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
                          className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:border-novora outline-none"
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
                          className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:border-novora outline-none"
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
                  setApprovalRules([]);
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
                  className="px-4.5 py-2 bg-novora hover:bg-opacity-95 text-white font-extrabold rounded-xl transition-all text-xs"
                >
                  Save matrix
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT SPEND LIMITS */}
      {isEditSpendLimitsModalOpen && selectedSpendLimitIdx !== null && spendLimits[selectedSpendLimitIdx] && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-slate-50 px-6 py-4.5 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-novora" />
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
                      placeholder={`e.g. ${currency} 200`}
                      className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:border-novora outline-none"
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
                      placeholder={`e.g. ${currency} 2,000`}
                      className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:border-novora outline-none"
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
                    placeholder={`e.g. Always, or > ${currency} 50`}
                    className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:border-novora outline-none"
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
                className="px-4.5 py-2 bg-novora hover:bg-opacity-95 text-white font-extrabold rounded-xl transition-all text-xs cursor-pointer"
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
                <CheckCircle className="h-5 w-5 text-novora" />
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
                    className="flex-1 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-novora"
                  />
                  <button
                    onClick={() => {
                      if (!newRuleInput.trim()) return;
                      const newRule = {
                        id: validationRules.length + 1,
                        label: newRuleInput,
                        enabled: true
                      };
                      setValidationRules([...validationRules, newRule]);
                      setNewRuleInput('');
                      addToast('New compliance check script added to core stack.', 'success');
                    }}
                    className="bg-novora hover:bg-blue-700 text-white font-extrabold text-xs px-3.5 rounded-xl flex items-center justify-center cursor-pointer"
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
                    { id: 5, label: 'Auto-convert foreign currency at live exchange rate (not connected yet)', enabled: false },
                    { id: 6, label: 'Hold claims from employees on notice period', enabled: true },
                    { id: 7, label: `Notify HR on claims exceeding ${currency} 1,000`, enabled: true }
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
                className="px-5 py-2 bg-slate-800 hover:bg-opacity-90 text-white font-black rounded-xl text-xs"
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
                  <div className="h-12 w-12 bg-novora/10 text-novora rounded-2xl flex items-center justify-center">
                    <Receipt className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">TRANSACTION: {selectedClaimDetail.id}</span>
                    <h3 className="font-extrabold text-slate-800 text-base leading-snug">{selectedClaimDetail.empName}</h3>
                    <p className="text-xs text-slate-500 font-semibold">{selectedClaimDetail.department} department</p>
                  </div>
                </div>

                <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${
                  selectedClaimDetail.status === 'Approved' ? 'bg-emerald-50 text-emerald-800 border-emerald-150' : 
                  selectedClaimDetail.status === 'Rejected' ? 'bg-red-50 text-red-800 border-red-150' : 'bg-amber-50 text-amber-700 border-amber-100'
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
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{currency} rate equivalent</span>
                  <p className="font-extrabold text-slate-900 text-[13px]">{equivalentText(selectedClaimDetail)}</p>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Compliance rating</span>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black mt-1 ${
                    selectedClaimDetail.policyFlag === 'Clear' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-105'
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
                    <div className="absolute -left-1.25 top-1.5 h-2 w-2 rounded-full bg-emerald-500 items-center shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800 text-[11.5px]">Claim Entry Registered</p>
                      <p className="text-[10px] text-slate-400 font-medium">{formatDateTime(selectedClaimDetail.createdAt, selectedClaimDetail.date)} &bull; Initiated by claimant</p>
                    </div>
                  </div>

                  <div className={`flex items-start gap-3 relative pb-3 pl-3.5 ${
                    selectedClaimDetail.status === 'Approved' || selectedClaimDetail.status === 'Rejected' 
                      ? 'border-l-2 border-emerald-500' 
                      : 'border-l-2 border-slate-200'
                  }`}>
                    <div className={`absolute -left-1.25 top-1.5 h-2 w-2 rounded-full ${
                      selectedClaimDetail.status === 'Approved' || selectedClaimDetail.status === 'Rejected' ? 'bg-emerald-500' : 'bg-amber-400'
                    }`} />
                    <div>
                      <p className="font-bold text-slate-800 text-[11.5px]">Manager Level Assessment</p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {selectedClaimDetail.decidedBy
                          ? `${selectedClaimDetail.decidedBy} \u2022 ${formatDateTime(selectedClaimDetail.decidedAt, '')}`
                          : 'Awaiting approver decision'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 relative pl-3.5">
                    <div className={`absolute -left-1.25 top-1.5 h-2 w-2 rounded-full ${
                      selectedClaimDetail.status === 'Approved' ? 'bg-emerald-500' : selectedClaimDetail.status === 'Rejected' ? 'bg-red-500' : 'bg-slate-300'
                    }`} />
                    <div>
                      <p className="font-bold text-slate-800 text-[11.5px]">Final Ledger Audit & Completion</p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {selectedClaimDetail.status === 'Approved' ? 'Approved \u2014 queued for payroll' : 
                         selectedClaimDetail.status === 'Rejected' ? 'Rejected and archived' : 'Awaiting general finance verify'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Box: Receipt Voucher Replica preview */}
            <div className="w-full md:w-[22rem] bg-slate-100 border-t md:border-t-0 md:border-l border-slate-200 p-6 flex flex-col justify-between">
              
              {/* Receipt Visual Body */}
              <div className="bg-white border text-center border-slate-200 p-5 rounded-2xl shadow-md rotate-1 hover:rotate-0 transition-all font-mono text-slate-700 text-xs space-y-4">
                <div className="border-b border-dashed border-slate-300 pb-3">
                  <h4 className="font-black tracking-widest text-novora/90 text-[12px] uppercase">★★★ RECEIPT PROOF ★★★</h4>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide mt-1">{selectedClaimDetail.vendor || '—'}</p>                </div>

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
                  <div className="flex justify-between font-black text-slate-900 border-t border-slate-200 pt-1.5 text-[13px]">
                    <span>TOTAL AMT:</span>
                    <span>{selectedClaimDetail.currency} {(selectedClaimDetail.amount).toFixed(2)}</span>
                  </div>
                </div>

                {selectedClaimDetail.hasAttachment ? (
                  <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md py-1 px-2.5 text-[9px] font-black flex items-center justify-center gap-1">
                    <span>● RECEIPT ATTACHED</span>
                  </div>
                ) : (
                  <div className="bg-slate-50 text-slate-500 border border-slate-200 rounded-md py-1 px-2.5 text-[9px] font-black flex items-center justify-center gap-1">
                    <span>NO RECEIPT FILE ON RECORD</span>
                  </div>
                )}
              </div>

              {/* Utility buttons */}
              <div className="mt-6 md:mt-0 space-y-2.5">
                <button
                  onClick={() => window.print()}
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
                    <div className="h-16 w-16 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin items-center shrink-0" />
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
                  <div className="bg-orange-50 text-orange-800 border border-orange-100 p-4 rounded-xl font-semibold flex items-start gap-2.5 leading-normal">
                    <AlertCircle className="h-4 w-4 text-orange-650 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-orange-900">Payroll integration not connected</p>
                      <p className="text-[11px] text-orange-800 mt-0.5">
                        Review the queued reimbursements below. Transfers to payroll are not available yet, so these claims will stay <strong>Queued</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target ERP integration gateway</label>
                    <SelectMenu
                      value={payrollIntegrationChannel}
                      onChange={setPayrollIntegrationChannel}
                      triggerClassName="text-xs font-bold border-slate-200"
                      options={[
                        { value: 'Workday ERP Connector v2.4', label: 'Workday Core HR API Integrator' },
                        { value: 'SAP SuccessFactors Web API', label: 'SAP SuccessFactors Gateway' },
                        { value: 'HRLearn Bank Auto-File Export', label: 'Direct Bank GIRO GIRO text format' },
                        { value: 'Manual spreadsheet ledger batch', label: 'General Ledger Excel spreadsheet' },
                      ]}
                    />
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
                            <span className="font-bold text-slate-800 font-mono">{equivalentText(c)}</span>
                          </div>
                        ))}
                    </div>

                    <div className="border-t border-slate-200 pt-2 flex justify-between items-center font-black text-slate-900 text-[13px]">
                      <span>AGGREGATED WAGES VALUE</span>
                      <span className="text-novora">
                        {money(claims.filter(c => c.status === 'Approved' && c.pushStatus === 'Queued').reduce((acc, curr) => acc + curr.myrEquivalent, 0))}
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
                  className="px-5 py-2 bg-novora hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
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

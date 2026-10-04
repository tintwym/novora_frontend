import React, { useCallback, useEffect, useState } from 'react';
import { useCanUseHrAi } from '@/providers/AuthProvider';
import { useCurrency } from '@/hooks/useCurrency';
import { formatMoney } from '@/lib/currency';
import { createLocalId } from '@/lib/createLocalId'
import { 
  HeartHandshake, 
  Coins, 
  ShieldCheck, 
  Award, 
  CalendarDays, 
  AlertCircle,
  TrendingUp,
  Plus,
  ArrowRight,
  UserCheck2,
  Trash2,
  Users,
  RefreshCw,
  Building,
  DollarSign,
  FileText,
  BookmarkCheck,
  CheckCircle2,
  Download,
  Flame,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import type { Employee } from '@/types';
import ModuleHeader from '@/components/ui/ModuleHeader';
import { SelectMenu } from '@/components/ui';
import {
  ApiError,
  createBenefitEnrollment,
  createBenefitPlan,
  createMyClaim,
  fetchAdminClaims,
  fetchBenefitEnrollments,
  fetchBenefitPlans,
  fetchMyBenefitEnrollments,
  fetchMyClaims,
  fetchBenefitsAiTip,
  type BenefitEnrollmentRow,
  type BenefitPlanRow,
  type BenefitsTipResponse,
  type ClaimRow,
} from '@/services';
import { dateStamp, downloadNearestTableCsv } from '@/lib/csv';

interface BenefitsTabProps {
  employees: Employee[];
  addToast: (text: string, type: 'success' | 'info' | 'error' | 'loading') => void;
}

type BenefitsSubTab = 
  | 'Enrollment & Selection'
  | 'Wellness Wallets & FSA'
  | 'Dependents & Beneficiaries'
  | 'Payroll Integration'
  | 'Vendor Management'
  | 'Benefits Reports & Analytics';

interface BenefitPlan {
  id: string;
  name: string;
  provider: string;
  category: 'Medical' | 'Dental' | 'Wellness' | 'Lifestyle';
  monthlyCost: number;
  description: string;
  features: string[];
}

interface Dependent {
  id: string;
  employeeId: string;
  name: string;
  relationship: 'Spouse' | 'Child' | 'Parent' | 'Sibling';
  dob: string;
  nric: string;
  coverageTier: 'Standard Medical Only' | 'Full Comprehensive' | 'Accident Coverage';
}

interface BenefitsClaim {
  id: string;
  employeeId: string;
  employeeName: string;
  category: 'Medical' | 'Dental' | 'Optical' | 'Wellness';
  amount: number;
  currency: string;
  status: 'Approved' | 'Reviewing' | 'Disbursed' | 'Rejected';
  date: string;
}

interface Vendor {
  id: string;
  name: string;
  tier: string;
  planCount: number;
  activePoliciesCount: number;
  monthlyPremium: number;
}

interface PayrollSyncItem {
  id: string;
  employeeId: string;
  employeeName: string;
  perkName: string;
  value: number;
  deductionType: 'Taxable Perk' | 'Co-Pay Deductible' | 'Pre-tax HSA Contribution';
  syncStatus: 'Synced' | 'Pending';
  lastSynced: string;
}

const BENEFIT_CLAIM_CATEGORIES: BenefitsClaim['category'][] = ['Medical', 'Dental', 'Optical', 'Wellness'];
const FSA_ANNUAL_LIMIT = 2000;
const WELLNESS_ANNUAL_LIMIT = 500;

function isActiveEnrollment(row: BenefitEnrollmentRow): boolean {
  return !/cancel|inactive|terminat|ended/i.test(row.status || '');
}

function mapBenefitClaimRow(row: ClaimRow, emps: Employee[], fallbackCurrency: string): BenefitsClaim {
  const emp = emps.find((e) => e.apiId === row.employeeId || e.id === row.employeeId);
  const status: BenefitsClaim['status'] = /approv/i.test(row.status)
    ? 'Approved'
    : /reject/i.test(row.status)
      ? 'Rejected'
      : /paid|disburs/i.test(row.status)
        ? 'Disbursed'
        : 'Reviewing';
  return {
    id: row.id,
    employeeId: emp?.id || row.employeeId,
    employeeName: row.employeeName || emp?.name || '—',
    category: row.category as BenefitsClaim['category'],
    amount: Number(row.amount),
    currency: row.currency || fallbackCurrency,
    status,
    date: row.claimDate,
  };
}

function mapBenefitCategory(raw: string | null): BenefitPlan['category'] {
  const v = (raw || '').toLowerCase();
  if (v.includes('dental')) return 'Dental';
  if (v.includes('well')) return 'Wellness';
  if (v.includes('life') || v.includes('transit')) return 'Lifestyle';
  return 'Medical';
}

function mapBenefitPlanRow(row: BenefitPlanRow): BenefitPlan {
  const summary = row.coverageSummary?.trim();
  return {
    id: row.id,
    name: row.name,
    provider: row.provider || '—',
    category: mapBenefitCategory(row.category),
    monthlyCost: row.employeeCost ?? row.employerCost ?? 0,
    description: summary || `${row.name} coverage plan`,
    features: summary ? summary.split(/[;|]/).map((s) => s.trim()).filter(Boolean) : ['Standard plan coverage'],
  };
}

function buildEnrolledMap(
  rows: BenefitEnrollmentRow[],
  emps: Employee[],
): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const row of rows) {
    const emp = emps.find((e) => e.apiId === row.employeeId || e.id === row.employeeId);
    const key = emp?.id || row.employeeId;
    if (!map[key]) map[key] = [];
    if (!map[key].includes(row.planId)) map[key].push(row.planId);
  }
  return map;
}

export default function BenefitsTab({ employees, addToast }: BenefitsTabProps) {
  const { currency, money } = useCurrency();
  const [activeSubTab, setActiveSubTab] = useState<BenefitsSubTab>('Enrollment & Selection');
  const [selectedSubEmployee, setSelectedSubEmployee] = useState<string>(employees[0]?.id || '');
  const currentEmployeeObj = employees.find(e => e.id === selectedSubEmployee) || employees[0];

  // -------------------------------------------------------------
  // PLANS & SELECTIONS (live ops API)
  // -------------------------------------------------------------
  const [plans, setPlans] = useState<BenefitPlan[]>([]);
  const [enrolledPlans, setEnrolledPlans] = useState<Record<string, string[]>>({});
  const [enrollmentRows, setEnrollmentRows] = useState<BenefitEnrollmentRow[]>([]);
  const [claims, setClaims] = useState<BenefitsClaim[]>([]);
  const [aiBenefitBusy, setAiBenefitBusy] = useState(false);
  const canUseHrAi = useCanUseHrAi();
  const [benefitAi, setBenefitAi] = useState<BenefitsTipResponse | null>(null);

  const loadBenefits = useCallback(async () => {
    try {
      const planRows = await fetchBenefitPlans();
      setPlans(planRows.map(mapBenefitPlanRow));
    } catch (err) {
      setPlans([]);
      if (!(err instanceof ApiError) || (err.status !== 401 && err.status !== 403)) {
        addToast('Could not load benefit plans from the server.', 'error');
      }
    }

    try {
      let enrollmentRows: BenefitEnrollmentRow[];
      try {
        enrollmentRows = await fetchBenefitEnrollments();
      } catch (err) {
        if (err instanceof ApiError && err.status === 403) {
          enrollmentRows = await fetchMyBenefitEnrollments();
        } else {
          throw err;
        }
      }
      setEnrollmentRows(enrollmentRows);
      setEnrolledPlans(buildEnrolledMap(enrollmentRows.filter(isActiveEnrollment), employees));
    } catch (err) {
      setEnrollmentRows([]);
      setEnrolledPlans({});
      if (!(err instanceof ApiError) || (err.status !== 401 && err.status !== 403)) {
        addToast('Could not load benefit enrollments from the server.', 'error');
      }
    }

    try {
      let claimRows: ClaimRow[];
      try {
        claimRows = await fetchAdminClaims();
      } catch (err) {
        if (err instanceof ApiError && err.status === 403) {
          claimRows = await fetchMyClaims();
        } else {
          throw err;
        }
      }
      setClaims(
        claimRows
          .filter((row) => BENEFIT_CLAIM_CATEGORIES.includes(row.category as BenefitsClaim['category']))
          .map((row) => mapBenefitClaimRow(row, employees, currency)),
      );
    } catch (err) {
      setClaims([]);
      if (!(err instanceof ApiError) || (err.status !== 401 && err.status !== 403)) {
        addToast('Could not load benefit claims from the server.', 'error');
      }
    }
  }, [addToast, employees, currency]);

  useEffect(() => {
    void loadBenefits();
  }, [loadBenefits]);

  const [claimCategory, setClaimCategory] = useState<'Medical' | 'Dental' | 'Optical' | 'Wellness'>('Medical');
  const [claimAmount, setClaimAmount] = useState('');
  const [claimReason, setClaimReason] = useState('');
  const [claimBusy, setClaimBusy] = useState(false);

  const [dependents, setDependents] = useState<Dependent[]>([]);

  const [newDepName, setNewDepName] = useState('');
  const [newDepRel, setNewDepRel] = useState('');
  const [newDepDob, setNewDepDob] = useState('');
  const [newDepNric, setNewDepNric] = useState('');
  const [newDepTier, setNewDepTier] = useState<'Standard Medical Only' | 'Full Comprehensive' | 'Accident Coverage'>('Standard Medical Only');

  // -------------------------------------------------------------
  // DERIVED CALCULATED VALUES
  // -------------------------------------------------------------
  const activeEnrollments = enrollmentRows.filter(isActiveEnrollment);
  const planById = (id: string) => plans.find((p) => p.id === id);

  const payrollSyncs: PayrollSyncItem[] = activeEnrollments.map((row) => {
    const plan = planById(row.planId);
    const emp = employees.find((e) => e.apiId === row.employeeId || e.id === row.employeeId);
    return {
      id: row.id,
      employeeId: emp?.id || row.employeeId,
      employeeName: row.employeeName || emp?.name || '—',
      perkName: `${row.planName || plan?.name || 'Benefit plan'} Deduction`,
      value: plan?.monthlyCost ?? 0,
      deductionType: plan?.category === 'Lifestyle' ? 'Taxable Perk' : 'Co-Pay Deductible',
      syncStatus: 'Pending',
      lastSynced: '—',
    };
  });

  const vendors: Vendor[] = Array.from(new Set(plans.map((p) => p.provider).filter((p) => p && p !== '—'))).map((provider) => {
    const providerPlans = plans.filter((p) => p.provider === provider);
    const providerPlanIds = new Set(providerPlans.map((p) => p.id));
    const rows = activeEnrollments.filter((r) => providerPlanIds.has(r.planId));
    return {
      id: provider,
      name: provider,
      tier: Array.from(new Set(providerPlans.map((p) => p.category))).join(' / '),
      planCount: providerPlans.length,
      activePoliciesCount: new Set(rows.map((r) => r.employeeId)).size,
      monthlyPremium: rows.reduce((sum, r) => sum + (planById(r.planId)?.monthlyCost ?? 0), 0),
    };
  });

  const totalMonthlyPremium = activeEnrollments.reduce((sum, r) => sum + (planById(r.planId)?.monthlyCost ?? 0), 0);
  const coveredEmployeeCount = new Set(activeEnrollments.map((r) => r.employeeId)).size;
  const vendorPremiumTotal = vendors.reduce((sum, v) => sum + v.monthlyPremium, 0);

  const currentYear = String(new Date().getFullYear());
  const countedClaims = claims.filter((c) => c.status !== 'Rejected' && (c.date || '').startsWith(currentYear));
  const walletFor = (employeeId: string) => {
    const own = countedClaims.filter((c) => c.employeeId === employeeId);
    return {
      fsaSpent: own.filter((c) => c.category !== 'Wellness').reduce((sum, c) => sum + c.amount, 0),
      fsaTotal: FSA_ANNUAL_LIMIT,
      wellnessSpent: own.filter((c) => c.category === 'Wellness').reduce((sum, c) => sum + c.amount, 0),
      wellnessTotal: WELLNESS_ANNUAL_LIMIT,
    };
  };
  const walletBalances: Record<string, ReturnType<typeof walletFor>> = Object.fromEntries(
    employees.map((emp) => [emp.id, walletFor(emp.id)]),
  );
  const claimsTotal = claims.filter((c) => c.status !== 'Rejected').reduce((sum, c) => sum + c.amount, 0);

  const employeeEnrolledPlanIds = enrolledPlans[selectedSubEmployee] || [];
  const currentWallet = walletFor(selectedSubEmployee);
  const currentDependents = dependents.filter(dep => dep.employeeId === selectedSubEmployee);

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanProvider, setNewPlanProvider] = useState('');
  const [newPlanCategory, setNewPlanCategory] = useState<BenefitPlan['category']>('Medical');
  const [newPlanCost, setNewPlanCost] = useState('');

  const handleCreateBenefitPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanName.trim()) {
      addToast('Please enter a benefit plan name.', 'error');
      return;
    }
    try {
      const created = await createBenefitPlan({
        name: newPlanName.trim(),
        category: newPlanCategory,
        provider: newPlanProvider.trim() || undefined,
        employeeCost: newPlanCost ? parseFloat(newPlanCost) : undefined,
        status: 'Active',
      });
      setPlans((prev) => [...prev, mapBenefitPlanRow(created)]);
      setNewPlanName('');
      setNewPlanProvider('');
      setNewPlanCost('');
      addToast(`Benefit plan "${created.name}" created.`, 'success');
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Could not create benefit plan.', 'error');
    }
  };

  const handleTogglePlanEnrollment = async (planId: string, planName: string) => {
    const activeList = enrolledPlans[selectedSubEmployee] || [];
    const exists = activeList.includes(planId);

    if (exists) {
      addToast(`Cancelling ${planName} coverage is not available here yet. Please contact HR.`, 'info');
      return;
    }

    const employeeApiId = currentEmployeeObj?.apiId;
    if (!employeeApiId) {
      addToast('Selected employee is missing a server id (apiId).', 'error');
      return;
    }

    try {
      const created = await createBenefitEnrollment({ planId, employeeId: employeeApiId, status: 'Active' });
      setEnrollmentRows((prev) => [created, ...prev.filter((r) => r.id !== created.id)]);
      setEnrolledPlans((prev) => ({
        ...prev,
        [selectedSubEmployee]: [...(prev[selectedSubEmployee] || []), planId],
      }));
      addToast(`Successfully enrolled in ${planName}!`, 'success');
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Could not enroll in benefit plan.', 'error');
    }
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimAmount || isNaN(parseFloat(claimAmount)) || parseFloat(claimAmount) <= 0) {
      addToast('Please input a valid positive claim amount.', 'error');
      return;
    }
    const amt = parseFloat(claimAmount);
    
    const targetLimit = claimCategory === 'Wellness' ? currentWallet.wellnessTotal - currentWallet.wellnessSpent : currentWallet.fsaTotal - currentWallet.fsaSpent;
    if (amt > targetLimit) {
      addToast(`Overspent limit warning! Claim for ${money(amt)} exceeds remaining limit of ${money(targetLimit)}`, 'error');
      return;
    }

    setClaimBusy(true);
    try {
      const created = await createMyClaim({
        category: claimCategory,
        claimDate: new Date().toLocaleDateString('en-CA'),
        amount: amt,
        currency,
        description: claimReason.trim() || undefined,
        employeeId: currentEmployeeObj?.apiId || undefined,
      });
      setClaims(prev => [mapBenefitClaimRow(created, employees, currency), ...prev.filter((c) => c.id !== created.id)]);
      setClaimAmount('');
      setClaimReason('');
      addToast(`${claimCategory} claim of ${money(amt)} submitted for review.`, 'success');
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Could not submit benefit claim.', 'error');
    } finally {
      setClaimBusy(false);
    }
  };

  const handleAddDependent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDepName.trim() || !newDepNric.trim()) {
      addToast('Please specify the dependent’s legal name and identity NRIC number.', 'error');
      return;
    }
    if (!newDepRel) {
      addToast('Please select a relationship.', 'error');
      return;
    }

    const newDep: Dependent = {
      id: createLocalId('DEP'),
      employeeId: selectedSubEmployee,
      name: newDepName,
      relationship: newDepRel as Dependent['relationship'],
      dob: newDepDob,
      nric: newDepNric,
      coverageTier: newDepTier
    };

    setDependents(prev => [...prev, newDep]);
    setNewDepName('');
    setNewDepNric('');
    setNewDepRel('');
    setNewDepDob('');
    addToast(`${newDepName} (${newDepRel}) added for this session only. Dependents are not saved to the server yet.`, 'info');
  };

  const handleDeleteDependent = (id: string, name: string) => {
    setDependents(prev => prev.filter(dep => dep.id !== id));
    addToast(`Removed ${name} from this session's dependents list.`, 'info');
  };

  const currentPayrollMonthLabel = new Date().toLocaleDateString('en-US', { month: 'long' });

  const handleSyncAllStaleWithPayroll = () => {
    addToast('Payroll sync is not connected yet. These deductions are listed for review only.', 'info');
  };

  const handleRenewVendorContract = (vendorName: string) => {
    addToast(`Contract renewals for ${vendorName} are not tracked in the system yet.`, 'info');
  };

  return (
    <div id="benefits-module" className="space-y-6">
      <ModuleHeader
        title="Benefits"
        description="Enrollment, wallets, dependents, and vendor coverage."
      />

      {/* Dynamic Selector Row - Matches Employee Directory & Onboarding Navigation */}
      <div id="benefits-navigation-layout" className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-200/85 pb-4">
        
        {/* subtab list */}
        <div id="benefits-sub-tabs" className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto scrollbar-none py-1">
          {(
            [
              'Enrollment & Selection',
            ] as BenefitsSubTab[]
          ).map((tab) => {
            const isActive = activeSubTab === tab;
            return (
              <button
                id={`benefits-tab-${tab.toLowerCase().replace(/\s+/g, '-').replace('&', 'and')}`}
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all shrink-0 relative cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-blue-50 text-novora'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                }`}
              >
                <span>{tab}</span>
              </button>
            );
          })}
        </div>

        {/* Global Candidate profile selector */}
        <div className="flex items-center gap-2.5 shrink-0 flex-nowrap">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap shrink-0">Viewing Employee Profile:</span>
          <SelectMenu
            value={selectedSubEmployee}
            onChange={(v) => { setSelectedSubEmployee(v); setBenefitAi(null); }}
            aria-label="Viewing employee profile"
            className="w-auto shrink-0"
            triggerClassName="nv-select-trigger--toolbar"
            options={employees.map((emp) => ({
              value: emp.id,
              label: `${emp.name} (${emp.id})`,
            }))}
          />
          {canUseHrAi && (
          <button
            type="button"
            disabled={aiBenefitBusy || !selectedSubEmployee}
            onClick={() => {
              void (async () => {
                const emp = employees.find((e) => e.id === selectedSubEmployee);
                if (!emp) return;
                setAiBenefitBusy(true);
                addToast('Drafting benefits tip…', 'loading');
                try {
                  const enrolledIds = enrolledPlans[selectedSubEmployee] || [];
                  const result = await fetchBenefitsAiTip({
                    employeeName: emp.name,
                    department: emp.department,
                    availablePlans: plans.map((p) => `${p.name} (${p.category})`),
                    enrolledPlans: plans.filter((p) => enrolledIds.includes(p.id)).map((p) => p.name),
                  });
                  setBenefitAi(result);
                  addToast(result.source === 'gemini' ? 'AI benefits tip ready.' : 'Heuristic benefits tip ready.', 'success');
                } catch (err) {
                  addToast(err instanceof ApiError ? err.message : 'Could not draft benefits tip.', 'error');
                } finally {
                  setAiBenefitBusy(false);
                }
              })();
            }}
            className="h-9 inline-flex items-center gap-1.5 rounded-xl border border-novora/25 bg-novora/5 px-3 text-xs font-extrabold text-novora hover:bg-novora/10 disabled:opacity-60 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className={`h-3.5 w-3.5 ${aiBenefitBusy ? 'animate-spin' : ''}`} />
            {aiBenefitBusy ? 'Tips…' : 'AI Tip'}
          </button>
          )}
        </div>
      </div>


      {/* SUB-TAB 1: BENEFITS ENROLLMENT & SELECTION */}
      {activeSubTab === 'Enrollment & Selection' && (
        <div id="benefits-subview-enrollment" className="space-y-6">
          <form onSubmit={handleCreateBenefitPlan} className="nv-card p-4 flex flex-col md:flex-row md:items-end gap-3">
            <div className="flex-1">
              <label className="text-[10px] text-slate-400 font-bold block mb-1">New Plan Name</label>
              <input
                type="text"
                value={newPlanName}
                onChange={(e) => setNewPlanName(e.target.value)}
                placeholder="e.g. Gold Medical Plus"
                className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] text-slate-400 font-bold block mb-1">Provider</label>
              <input
                type="text"
                value={newPlanProvider}
                onChange={(e) => setNewPlanProvider(e.target.value)}
                placeholder="e.g. Alliance Insurance"
                className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">Category</label>
              <SelectMenu
                value={newPlanCategory}
                onChange={(v) => setNewPlanCategory(v as BenefitPlan['category'])}
                className="w-36"
                triggerClassName="text-xs font-bold bg-slate-50 border-slate-100 min-h-9 py-2"
                options={[
                  { value: 'Medical', label: 'Medical' },
                  { value: 'Dental', label: 'Dental' },
                  { value: 'Wellness', label: 'Wellness' },
                  { value: 'Lifestyle', label: 'Lifestyle' },
                ]}
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold block mb-1">Monthly Cost</label>
              <input
                type="text"
                value={newPlanCost}
                onChange={(e) => setNewPlanCost(e.target.value)}
                placeholder="0.00"
                className="w-28 text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-novora text-white text-xs font-extrabold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Plan</span>
            </button>
          </form>

          {plans.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-6">No benefit plans yet. Create one above to get started.</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => {
              const isEnrolled = employeeEnrolledPlanIds.includes(plan.id);
              return (
                <div 
                  key={plan.id}
                  className={`bg-white border rounded-2xl p-6 shadow-xs transition-colors flex flex-col justify-between ${
                    isEnrolled ? 'border-novora bg-blue-50/5' : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                          plan.category === 'Medical' ? 'bg-indigo-50 text-novora' :
                          plan.category === 'Dental' ? 'bg-amber-50 text-amber-700' :
                          plan.category === 'Wellness' ? 'bg-emerald-50 text-emerald-700' :
                          'bg-sky-50 text-sky-700'
                        }`}>
                          {plan.category} Plan
                        </span>
                        <h5 className="text-[13.5px] font-black text-slate-800 mt-1.5">{plan.name}</h5>
                        <p className="text-[10.5px] text-slate-400 font-bold block mt-0.5">by {plan.provider}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black text-slate-800">{money(plan.monthlyCost)}</span>
                        <span className="text-[9.5px] text-slate-400 block font-semibold">/ month</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-normal font-medium">{plan.description}</p>

                    {/* Features list */}
                    <div className="space-y-1.5 pt-3 border-t border-slate-50">
                      <span className="text-[9px] text-slate-400 font-black tracking-widest uppercase block mb-1">Clearance Inclusions:</span>
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[10.5px] text-slate-600 font-semibold">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-4 pt-4 border-t border-slate-50">
                    <span className="text-[10.5px] text-slate-400 font-bold">
                      {isEnrolled ? '✓ Currently Covered' : '✕ Not enrolled'}
                    </span>

                    <button
                      onClick={() => handleTogglePlanEnrollment(plan.id, plan.name)}
                      className={`text-xs font-extrabold px-4.5 py-2 rounded-xl transition-all select-none cursor-pointer ${
                        isEnrolled
                          ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200/50'
                          : 'bg-novora text-white hover:bg-opacity-95 shadow-xs'
                      }`}
                    >
                      {isEnrolled ? 'Cancel Coverage' : 'Request Enrollment'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}


      {/* SUB-TAB 2: WELLNESS WALLETS & FLEXIBLE SPENDING (FSA/HSA) */}
      {activeSubTab === 'Wellness Wallets & FSA' && (
        <div id="benefits-subview-wallets" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* FSA Account Details */}
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Flexible Spending Account (FSA)</span>
                  <h4 className="text-xl font-black text-novora mt-1">{money(currentWallet.fsaTotal - currentWallet.fsaSpent)}</h4>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Remaining fund balance of {money(currentWallet.fsaTotal)}</p>
                </div>
                <span className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl shrink-0">
                  <Coins className="h-5.5 w-5.5" />
                </span>
              </div>
              
              <div className="mt-6 pt-5 border-t border-slate-50">
                <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-2">
                  <span>Fund Utilization</span>
                  <span>{Math.round((currentWallet.fsaSpent / currentWallet.fsaTotal) * 100)}% ({currentWallet.fsaSpent} Spent)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-novora h-full" style={{ width: `${(currentWallet.fsaSpent / currentWallet.fsaTotal) * 100}%` }} />
                </div>
              </div>
            </div>

            {/* Wellness Wallet Details */}
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Wellness & Fitness Budget Wallet</span>
                  <h4 className="text-xl font-black text-emerald-600 mt-1">{money(currentWallet.wellnessTotal - currentWallet.wellnessSpent)}</h4>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Remaining fund balance of {money(currentWallet.wellnessTotal)}</p>
                </div>
                <span className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
                  <HeartHandshake className="h-5.5 w-5.5" />
                </span>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-50">
                <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-2">
                  <span>Fund Utilization</span>
                  <span>{Math.round((currentWallet.wellnessSpent / currentWallet.wellnessTotal) * 100)}% ({currentWallet.wellnessSpent} Spent)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: `${(currentWallet.wellnessSpent / currentWallet.wellnessTotal) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Fast claim reimbursement form */}
            <div className="lg:col-span-1">
              <div className="nv-card p-6 shadow-xs">
                <h5 className="text-[12.5px] font-black text-slate-700 uppercase tracking-wide mb-4">Fast Expense Claim Reimbursement</h5>
                <form onSubmit={handleClaimSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Benefit Allocation Category</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['Medical', 'Dental', 'Optical', 'Wellness'] as const).map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setClaimCategory(cat)}
                          className={`py-2 text-[11px] font-bold border rounded-xl transition-all cursor-pointer ${
                            claimCategory === cat
                              ? 'bg-blue-50/50 border-novora/35 text-novora'
                              : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Invoice Receipt Value ({currency})</label>
                    <input
                      type="text"
                      placeholder="e.g. 150.00"
                      value={claimAmount}
                      onChange={(e) => setClaimAmount(e.target.value)}
                      className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 outline-none focus:bg-white focus:border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Filing Reason / Diagnosis / Purchase</label>
                    <input
                      type="text"
                      placeholder="e.g. Optical prescription glasses"
                      value={claimReason}
                      onChange={(e) => setClaimReason(e.target.value)}
                      className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 outline-none focus:bg-white focus:border-slate-200"
                    />
                  </div>

                  <div className="bg-slate-50 p-4 border border-dashed border-slate-200 rounded-xl text-center">
                    <span className="text-[10.5px] text-slate-500 font-semibold block">Attached Receipt File Proof</span>
                    <button 
                      type="button"
                      onClick={() => addToast('Receipt uploads are not supported yet. Please keep the original receipt for audit.', 'info')}
                      className="text-[9.5px] text-novora font-black uppercase mt-1 cursor-pointer hover:underline"
                    >
                      Upload scanned pdf
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={claimBusy}
                    className="w-full bg-novora hover:bg-opacity-95 text-white text-xs font-extrabold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-60"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{claimBusy ? 'Submitting…' : 'Submit Claim to Welfare Audit'}</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Claims Ledger list across organization */}
            <div className="lg:col-span-2">
              <div className="nv-card p-6 shadow-xs">
                <div className="flex justify-between items-center mb-5">
                  <h5 className="text-[12.5px] font-black text-slate-800 uppercase tracking-wide">FSA Claims Database Receipts</h5>
                  <span className="text-[10px] font-bold font-mono text-slate-400">Total processed item list</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10.5px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/50">
                        <th className="p-3">Claim ID</th>
                        <th className="p-3">Candidate Employee</th>
                        <th className="p-3">Classification</th>
                        <th className="p-3">Amount Charged</th>
                        <th className="p-3">Log Status</th>
                        <th className="p-3">Date Filed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {claims.length === 0 && (
                        <tr><td colSpan={6} className="p-6 text-center text-xs text-slate-400">No records yet.</td></tr>
                      )}
                      {claims.map((claim) => (
                        <tr key={claim.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3 font-mono text-slate-500 font-bold">{claim.id}</td>
                          <td className="p-3 font-bold text-slate-800">{claim.employeeName}</td>
                          <td className="p-3">
                            <span className={`text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-md ${
                              claim.category === 'Medical' ? 'bg-indigo-50 text-novora' :
                              claim.category === 'Dental' ? 'bg-amber-50 text-amber-700' :
                              claim.category === 'Optical' ? 'bg-sky-50 text-sky-700' :
                              'bg-emerald-50 text-emerald-700'
                            }`}>
                              {claim.category}
                            </span>
                          </td>
                          <td className="p-3 font-bold text-slate-800">{formatMoney(claim.amount, claim.currency)}</td>
                          <td className="p-3">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${
                              claim.status === 'Disbursed' ? 'bg-emerald-50 text-emerald-750' :
                              claim.status === 'Approved' ? 'bg-blue-50 text-blue-755' :
                              claim.status === 'Rejected' ? 'bg-rose-50 text-rose-700' :
                              'bg-amber-50 text-amber-750'
                            }`}>
                              {claim.status}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-slate-400 whitespace-nowrap">{claim.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* SUB-TAB 3: DEPENDENTS & BENEFICIARIES TRACKING */}
      {activeSubTab === 'Dependents & Beneficiaries' && (
        <div id="benefits-subview-dependents" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Add Dependent form */}
          <div className="lg:col-span-1">
            <div className="nv-card p-6 shadow-xs">
              <h5 className="text-[12.5px] font-black text-slate-700 uppercase tracking-wide mb-4">Register Family Dependent</h5>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Add spouse, parent, or legal children to have their corporate medical coverage activated under the employee’s medical plan.
              </p>

              <form onSubmit={handleAddDependent} className="space-y-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Legal Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Arthur Lim"
                    value={newDepName}
                    onChange={(e) => setNewDepName(e.target.value)}
                    className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 outline-none focus:bg-white focus:border-slate-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Relationship</label>
                    <SelectMenu
                      value={newDepRel}
                      onChange={setNewDepRel}
                      placeholder="Select…"
                      triggerClassName="text-xs font-bold bg-slate-50 border-slate-100"
                      options={[
                        { value: '', label: 'Select…' },
                        { value: 'Spouse', label: 'Spouse' },
                        { value: 'Child', label: 'Child' },
                        { value: 'Parent', label: 'Parent' },
                        { value: 'Sibling', label: 'Sibling' },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={newDepDob}
                      onChange={(e) => setNewDepDob(e.target.value)}
                      className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 outline-none focus:bg-white focus:border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">National Registration NRIC / Passport</label>
                  <input
                    type="text"
                    placeholder="e.g. 950214-14-5581"
                    value={newDepNric}
                    onChange={(e) => setNewDepNric(e.target.value)}
                    className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 outline-none focus:bg-white focus:border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Assigned Coverage Policy</label>
                  <SelectMenu
                    value={newDepTier}
                    onChange={(v) => setNewDepTier(v as any)}
                    triggerClassName="text-xs font-bold bg-slate-50 border-slate-100"
                    options={[
                      { value: 'Standard Medical Only', label: 'Standard Medical Only' },
                      { value: 'Full Comprehensive', label: 'Full Comprehensive' },
                      { value: 'Accident Coverage', label: 'Accident Coverage' },
                    ]}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-novora hover:bg-opacity-95 text-white text-xs font-extrabold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <Plus className="h-4 w-4" />
                  <span>Register Beneficiary</span>
                </button>
              </form>
            </div>
          </div>

          {/* List of registered dependents */}
          <div className="lg:col-span-2 space-y-6">
            <div className="nv-card p-6 shadow-xs">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h5 className="text-[12.5px] font-black text-slate-800 uppercase tracking-wide">Registered Dependents Schedule</h5>
                  <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Insurance allocations verified for employee: {currentEmployeeObj?.name}</p>
                </div>
                <span className="text-[10px] font-bold bg-novora/10 text-novora px-2.5 py-1 rounded-lg">
                  {currentDependents.length} active covers
                </span>
              </div>

              {currentDependents.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 border border-slate-100 border-dashed rounded-xl">
                  <Users className="h-8 w-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500 font-semibold mt-2.5">No dependent family members registered for this candidate.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {currentDependents.map((dep) => (
                    <div 
                      key={dep.id}
                      className="p-4 rounded-xl border border-slate-100 bg-white hover:border-slate-200 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="h-10 w-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 border border-slate-100">
                          {dep.relationship.slice(0, 2)}
                        </div>
                        <div>
                          <h6 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                            <span>{dep.name}</span>
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 inline-flex items-center whitespace-nowrap shrink-0">
                              {dep.relationship}
                            </span>
                          </h6>
                          <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-400 font-medium whitespace-nowrap">
                            <span>NRIC: {dep.nric}</span>
                            <span>&bull;</span>
                            <span>Born {dep.dob}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <span className="text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-1 rounded-lg">
                          {dep.coverageTier}
                        </span>

                        <button 
                          onClick={() => handleDeleteDependent(dep.id, dep.name)}
                          className="p-2 bg-slate-50 text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-100 transition-all cursor-pointer"
                          title="Revoke Coverage"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Insurance compliance warning */}
            <div className="bg-amber-50/55 border border-amber-200/50 p-5 rounded-2xl">
              <div className="flex gap-3">
                <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0" />
                <div>
                  <h6 className="text-xs font-black text-slate-800">Dependent Coverage Policy Notice</h6>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                    Beneficiary additions take effect under the vendor contract on the 1st of the subsequent calendar month. Please double check that passport numbers correspond perfectly with national registries to avoid claim verification rejections.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* SUB-TAB 4: INTEGRATION WITH PAYROLL */}
      {activeSubTab === 'Payroll Integration' && (
        <div id="benefits-subview-payroll" className="space-y-6">
          <div className="bg-indigo-50/40 border border-indigo-100 p-5.5 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <span className="text-[9.5px] font-black uppercase text-indigo-700 tracking-wider bg-white rounded-full px-2.5 py-0.5 border border-indigo-100 inline-flex items-center whitespace-nowrap shrink-0">
                Core HR Integration ledger
              </span>
              <h4 className="text-sm font-black text-slate-800 mt-2.5">Payroll Sync & Deduction Audit</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Configure corporate taxable perks, deductible co-pays, and pre-tax HSA benefits as automated payroll line items.
              </p>
            </div>

            <button
              onClick={handleSyncAllStaleWithPayroll}
              className="bg-novora hover:bg-opacity-95 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2 self-start sm:self-auto shrink-0"
            >
              <RefreshCw className="h-4 w-4 animate-spin-reverse" />
              <span>Synchronize {currentPayrollMonthLabel} Payroll Run</span>
            </button>
          </div>

          {/* Sync tables */}
          <div className="nv-card p-6 shadow-xs">
            <h5 className="text-[12.5px] font-black text-slate-800 uppercase tracking-wide mb-4">Benefit Line Items Transferred to Payroll Module</h5>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10.5px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/50">
                    <th className="p-3.5">Reference ID</th>
                    <th className="p-3.5">Employee Officer Name</th>
                    <th className="p-3.5">Benefit Allocation Item</th>
                    <th className="p-3.5">Financial deduction Type</th>
                    <th className="p-3.5">Periodic Impact</th>
                    <th className="p-3.5">Sync Status</th>
                    <th className="p-3.5">Last Sync Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {payrollSyncs.length === 0 && (
                    <tr><td colSpan={7} className="p-6 text-center text-xs text-slate-400">No records yet.</td></tr>
                  )}
                  {payrollSyncs.map((sync) => (
                    <tr key={sync.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3.5 font-mono text-slate-400 font-bold">{sync.id}</td>
                      <td className="p-3.5 font-bold text-slate-800">{sync.employeeName}</td>
                      <td className="p-3.5 font-semibold text-slate-600">{sync.perkName}</td>
                      <td className="p-3.5">
                        <span className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-md ${
                          sync.deductionType === 'Taxable Perk' ? 'bg-sky-50 text-sky-700' :
                          sync.deductionType === 'Co-Pay Deductible' ? 'bg-amber-50 text-amber-700 font-bold' :
                          'bg-indigo-50 text-novora'
                        }`}>
                          {sync.deductionType}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-slate-800">
                        {sync.deductionType === 'Taxable Perk' ? `+ ${money(sync.value)}` : `- ${money(sync.value)}`}
                      </td>
                      <td className="p-3.5">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${
                          sync.syncStatus === 'Synced' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800 border border-amber-100'
                        }`}>
                          {sync.syncStatus}
                        </span>
                      </td>
                      <td className="p-3.5 font-semibold text-slate-400 whitespace-nowrap">{sync.lastSynced}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}


      {/* SUB-TAB 5: VENDOR MANAGEMENT */}
      {activeSubTab === 'Vendor Management' && (
        <div id="benefits-subview-vendors" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs flex items-center gap-4.5">
              <span className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Building className="h-5.5 w-5.5" />
              </span>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Active Welfare Vendors</span>
                <span className="text-xl font-black text-slate-800">{vendors.length} {vendors.length === 1 ? 'Provider' : 'Providers'}</span>
                <p className="text-[10.5px] text-slate-400 font-semibold mt-0.5">{plans.length} benefit plans on file</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs flex items-center gap-4.5">
              <span className="p-3 bg-sky-50 text-sky-600 rounded-xl">
                <Coins className="h-5.5 w-5.5" />
              </span>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Average Premium / Capita</span>
                <span className="text-xl font-black text-slate-800">{money(coveredEmployeeCount > 0 ? totalMonthlyPremium / coveredEmployeeCount : 0)}</span>
                <p className="text-[10.5px] text-emerald-500 font-bold mt-0.5">{coveredEmployeeCount} covered employees</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs flex items-center gap-4.5">
              <span className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <FileText className="h-5.5 w-5.5" />
              </span>
              <div>
                <span className="text-[10px] font-black text-novora bg-blue-50/50 px-1.5 py-0.5 rounded-full border border-blue-105 uppercase tracking-wider inline-flex items-center whitespace-nowrap shrink-0">Upcoming Renewal cycle</span>
                <span className="text-xl font-black text-slate-800">—</span>
                <p className="text-[10.5px] text-slate-400 font-bold mt-0.5">No renewal dates on file</p>
              </div>
            </div>
          </div>

          <div className="nv-card p-6 shadow-xs">
            <h5 className="text-[12.5px] font-black text-slate-800 uppercase tracking-wide mb-5">Contracted Vendor Platforms</h5>
            
            <div className="space-y-4">
              {vendors.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">No vendors yet. Providers appear here once benefit plans list one.</p>
              )}
              {vendors.map((vendor) => (
                <div 
                  key={vendor.id}
                  className="p-5.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h6 className="text-xs font-black text-slate-800">{vendor.name}</h6>
                      <span className="text-[9.5px] font-extrabold uppercase px-2 py-0.5 bg-indigo-50 text-novora rounded-md border border-indigo-100/50">
                        {vendor.tier}
                      </span>
                      <span className="text-[10.5px] font-medium text-slate-400 font-mono">{vendor.planCount} {vendor.planCount === 1 ? 'plan' : 'plans'}</span>
                    </div>

                    <div className="flex items-center gap-4.5 text-[11px] text-slate-500 font-semibold">
                      <span>Covered Employees: <strong className="text-slate-800">{vendor.activePoliciesCount}</strong></span>
                      <span>&bull;</span>
                      <span>Total monthly Premium cost: <strong className="text-novora">{money(vendor.monthlyPremium)}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => addToast(`No SLA or contact details are on file for ${vendor.name} yet.`, 'info')}
                      className="bg-white border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 text-xs font-bold px-4 py-2 rounded-xl transition-all select-none cursor-pointer"
                    >
                      Audit SLA details
                    </button>

                    <button
                      onClick={() => handleRenewVendorContract(vendor.name)}
                      className="bg-novora hover:bg-[#2049a8] text-white text-xs font-extrabold px-4 py-2 rounded-xl transition-all select-none cursor-pointer shadow-xs"
                    >
                      Renew Cover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: BENEFITS REPORTS & ANALYTICS */}
      {activeSubTab === 'Benefits Reports & Analytics' && (
        <div id="benefits-reports-analytics-root" className="space-y-6 animate-in fade-in duration-200">
          
          {/* Key Metric Indicators Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-black uppercase tracking-wider block">Total Monthly Premium</span>
                <Coins className="h-4 w-4 text-indigo-500" />
              </div>
              <div className="mt-2.5">
                <span className="text-2xl font-black text-slate-800">
                  {money(totalMonthlyPremium)}
                </span>
                <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">
                  {plans.length} plans &bull; {activeEnrollments.length} active enrollments
                </span>
              </div>
              <div className="flex items-center gap-1 mt-3">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 items-center shrink-0" />
                <span className="text-[9.5px] text-emerald-600 font-extrabold uppercase">From live enrollments</span>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-black uppercase tracking-wider block">Wallet FSA Usage</span>
                <RefreshCw className="h-4 w-4 text-blue-500" />
              </div>
              <div className="mt-2.5">
                {(() => {
                  const wallets = Object.values(walletBalances) as Array<{ fsaSpent: number, fsaTotal: number }>;
                  const totalSpent = wallets.reduce((acc, w) => acc + w.fsaSpent, 0);
                  const totalLimit = wallets.reduce((acc, w) => acc + w.fsaTotal, 0);
                  const pct = Math.round((totalSpent / (totalLimit || 1)) * 100);
                  return (
                    <>
                      <span className="text-2xl font-black text-slate-800">{pct}%</span>
                      <span className="text-[10px] text-slate-500 block font-semibold mt-0.5">
                        {money(totalSpent)} spent of {money(totalLimit)} FSA cap
                      </span>
                    </>
                  );
                })()}
              </div>
              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-3">
                <div 
                  className="bg-blue-500 h-full transition-all duration-300"
                  style={{
                    width: `${Math.round(
                      ((Object.values(walletBalances) as Array<{ fsaSpent: number, fsaTotal: number }>).reduce((acc, w) => acc + w.fsaSpent, 0) /
                        ((Object.values(walletBalances) as Array<{ fsaSpent: number, fsaTotal: number }>).reduce((acc, w) => acc + w.fsaTotal, 0) || 1)) * 100
                    )}%`
                  }}
                />
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-black uppercase tracking-wider block">Wellness Wallet Usage</span>
                <HeartHandshake className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="mt-2.5">
                {(() => {
                  const wallets = Object.values(walletBalances) as Array<{ wellnessSpent: number, wellnessTotal: number }>;
                  const totalSpent = wallets.reduce((acc, w) => acc + w.wellnessSpent, 0);
                  const totalLimit = wallets.reduce((acc, w) => acc + w.wellnessTotal, 0);
                  const pct = Math.round((totalSpent / (totalLimit || 1)) * 100);
                  return (
                    <>
                      <span className="text-2xl font-black text-slate-800">{pct}%</span>
                      <span className="text-[10px] text-slate-500 block font-semibold mt-0.5">
                        {money(totalSpent)} spent of {money(totalLimit)} cap
                      </span>
                    </>
                  );
                })()}
              </div>
              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-3">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{
                    width: `${Math.round(
                      ((Object.values(walletBalances) as Array<{ wellnessSpent: number, wellnessTotal: number }>).reduce((acc, w) => acc + w.wellnessSpent, 0) /
                        ((Object.values(walletBalances) as Array<{ wellnessSpent: number, wellnessTotal: number }>).reduce((acc, w) => acc + w.wellnessTotal, 0) || 1)) * 100
                    )}%`
                  }}
                />
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-black uppercase tracking-wider block">Covered Dependents</span>
                <Users className="h-4 w-4 text-sky-500" />
              </div>
              <div className="mt-2.5">
                <span className="text-2xl font-black text-slate-800">
                  {dependents.length} Covered
                </span>
                <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">
                  Registered in this session
                </span>
              </div>
              <div className="flex items-center gap-1 mt-3">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-[9.5px] text-slate-400 font-bold uppercase">Not yet saved to server</span>
              </div>
            </div>
          </div>

          {/* Core Insights Grids */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Col: Claims Log Distribution and Category Breakdown (7 Cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-5">
              <div className="border-b border-slate-50 pb-3 flex justify-between items-center">
                <div>
                  <h5 className="text-[12.5px] font-black text-slate-800 uppercase tracking-wide">Claims Costing Analysis</h5>
                  <p className="text-[10px] text-slate-400 font-medium italic mt-0.5">Active monitoring of medical, optical, and dental co-payments</p>
                </div>
                <button 
                  onClick={(e) => {
                    const n = downloadNearestTableCsv(e.currentTarget, `benefit_claims_${dateStamp()}`);
                    addToast(n ? `Exported ${n} rows as CSV.` : 'Nothing to export yet.', n ? 'success' : 'info');
                  }}
                  className="bg-slate-50 border border-slate-200 hover:border-novora rounded-xl px-3 py-1 text-[9.5px] font-black uppercase text-slate-500 hover:text-novora cursor-pointer transition-all"
                >
                  Export Claim Ledger
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] font-semibold text-slate-600 border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 uppercase text-[9.5px] font-black text-slate-400">
                      <th className="py-2.5 px-3">Associate</th>
                      <th className="py-2.5 px-3 font-bold">Category</th>
                      <th className="py-2.5 px-3 text-right font-bold">Invoice Amount</th>
                      <th className="py-2.5 px-3 text-center font-bold">Audit Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-[11px]">
                    {claims.length === 0 && (
                      <tr><td colSpan={4} className="p-6 text-center text-xs text-slate-400">No records yet.</td></tr>
                    )}
                    {claims.map((claim) => (
                      <tr key={claim.id} className="hover:bg-slate-50/20">
                        <td className="py-3 px-3">
                          <span className="text-slate-800 font-bold block">{claim.employeeName}</span>
                          <span className="text-[9.5px] font-mono text-slate-400 uppercase tracking-widest">{claim.employeeId}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-slate-700 font-bold">{claim.category}</span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-[11.5px] text-slate-800">
                          {formatMoney(claim.amount, claim.currency)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-block text-[9.5px] font-black uppercase px-2 py-0.5 rounded ${
                            claim.status === 'Disbursed' 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : claim.status === 'Approved'
                              ? 'bg-blue-50 text-blue-700'
                              : claim.status === 'Rejected'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-amber-50 text-amber-700 animate-pulse'
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

            {/* Right Col: Category Percentages & Target Cover Plans (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                <h5 className="text-[12.5px] font-black text-slate-800 uppercase tracking-wide">Claims Category Ratios</h5>
                
                <div className="space-y-3">
                  {[
                    { category: 'Medical Treatment', key: 'Medical', color: 'bg-novora' },
                    { category: 'Dental & Crowns', key: 'Dental', color: 'bg-emerald-500' },
                    { category: 'Optical & Contact Lenses', key: 'Optical', color: 'bg-indigo-500' },
                    { category: 'Wellness & Gym Reimbursements', key: 'Wellness', color: 'bg-sky-500' }
                  ].map((cat) => {
                    const amount = claims.filter(c => c.category === cat.key && c.status !== 'Rejected').reduce((sum, c) => sum + c.amount, 0);
                    return { ...cat, amount, percentage: claimsTotal > 0 ? Math.round((amount / claimsTotal) * 100) : 0 };
                  }).map((cat, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-[10.5px]">
                        <span className="font-semibold text-slate-600">{cat.category}</span>
                        <span className="font-bold text-slate-800">{money(cat.amount)} ({cat.percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`${cat.color} h-full rounded-full transition-all`} 
                          style={{ width: `${cat.percentage}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vendor Premium Analysis */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                <h5 className="text-[12.5px] font-black text-slate-800 uppercase tracking-wide">Vendor Allocation Split</h5>
                
                <div className="space-y-3.5">
                  {vendors.length === 0 && (
                    <p className="text-xs text-slate-400">No vendor premiums yet.</p>
                  )}
                  {vendors.map((v, idx) => ({
                    provider: v.name,
                    share: vendorPremiumTotal > 0 ? Math.round((v.monthlyPremium / vendorPremiumTotal) * 100) : 0,
                    color: ['bg-indigo-500', 'bg-emerald-500', 'bg-sky-500', 'bg-amber-500'][idx % 4],
                  })).map((pv, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-600 font-bold block truncate max-w-[200px]">{pv.provider}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden items-center shrink-0">
                          <div className={`h-full rounded-full ${pv.color}`} style={{ width: `${pv.share}%` }} />
                        </div>
                        <span className="font-bold text-slate-800 w-12 text-right">{pv.share}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

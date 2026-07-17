import { useState, type FormEvent } from 'react'
import {
  HeartHandshake,
  Coins,
  ShieldCheck,
  Plus,
  Trash2,
  Users,
  RefreshCw,
  Building,
  FileText,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react'
import { showActionToast } from '../../utils/actionToast'

export type ModuleEmployeeOption = {
  id: string
  name: string
  department?: string
}

type BenefitsTabProps = {
  employees: ModuleEmployeeOption[]
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
  status: 'Approved' | 'Reviewing' | 'Disbursed';
  date: string;
  attachment: string;
}

interface Vendor {
  id: string;
  name: string;
  domain: string;
  tier: string;
  activePoliciesCount: number;
  monthlyPremium: number;
  renewalDate: string;
  contactEmail: string;
}

interface PayrollSyncItem {
  id: string;
  employeeId: string;
  employeeName: string;
  perkName: string;
  value: number;
  deductionType: 'Taxable Perk' | 'Co-Pay Deductible' | 'Pre-tax HSA Contribution';
  syncStatus: 'Synced' | 'Stale - Out of Sync';
  lastSynced: string;
}

export function BenefitsTab({ employees }: BenefitsTabProps) {
  const addToast = (text: string, type?: 'success' | 'loading' | 'error' | 'info') => {
    showActionToast(text, type)
  }

  const [activeSubTab, setActiveSubTab] = useState<BenefitsSubTab>('Enrollment & Selection');
  const [selectedSubEmployee, setSelectedSubEmployee] = useState<string>(employees[0]?.id || '');
  const currentEmployeeObj = employees.find(e => e.id === selectedSubEmployee) || employees[0];

  // -------------------------------------------------------------
  // MOCK STATE - PLANS & SELECTIONS
  // -------------------------------------------------------------
  const plans: BenefitPlan[] = [
    { id: 'PLN-01', name: 'Gold Premium Care Plus', provider: 'Alliance Insurance Group', category: 'Medical', monthlyCost: 450, description: 'Highest available tier with direct billing access, 10% co-pay, and private suite rooms.', features: ['Direct Clinic Billing', 'Overseas Emergencies', 'Maternity Cover included'] },
    { id: 'PLN-02', name: 'Comprehensive Dental Core', provider: 'SmileCare Dental', category: 'Dental', monthlyCost: 75, description: 'General prophylaxis, scaling, prosthodontics, and surgical extractions coverage catalog.', features: ['Prophylaxis 2x/year', 'Crowns & Bridges subsidized', 'Zero wait window for emergencies'] },
    { id: 'PLN-03', name: 'Active Mental Rest & Fit Wallet', provider: 'MindBody Global', category: 'Wellness', monthlyCost: 45, description: 'Subscription cover for mindfulness apps (Calm/Headspace) plus national gym access cards.', features: ['Unlimited Calm premium log', 'Anytime Fitness discounts', '2x counseling sessions/quarter'] },
    { id: 'PLN-04', name: 'Lifestyle Transit & Carbon Credit', provider: 'Novora Green Fleet', category: 'Lifestyle', monthlyCost: 120, description: 'Green transport commuter benefits including MRT transit passes or EV rental subsidies.', features: ['RM100 monthly Touch n Go pass', 'Commute tax deductions synced', 'EV charging rebates'] },
  ];

  // Track enrolled plans by employee (e.g., EMP-001 has active PLN-01, PLN-02)
  const [enrolledPlans, setEnrolledPlans] = useState<Record<string, string[]>>({
    'EMP-0285': ['PLN-01', 'PLN-03'],
    'EMP-001': ['PLN-01', 'PLN-02'],
    'EMP-002': ['PLN-02', 'PLN-04'],
  });

  // -------------------------------------------------------------
  // MOCK STATE - WELLNESS WALLETS (FSA/HSA)
  // -------------------------------------------------------------
  const [walletBalances, setWalletBalances] = useState<Record<string, { fsaSpent: number, fsaTotal: number, wellnessSpent: number, wellnessTotal: number }>>({
    'EMP-001': { fsaSpent: 750, fsaTotal: 2000, wellnessSpent: 180, wellnessTotal: 500 },
    'EMP-002': { fsaSpent: 1100, fsaTotal: 2000, wellnessSpent: 320, wellnessTotal: 550 },
    'EMP-0285': { fsaSpent: 450, fsaTotal: 2500, wellnessSpent: 90, wellnessTotal: 600 }
  });

  const [claims, setClaims] = useState<BenefitsClaim[]>([
    { id: 'BEN-8012', employeeId: 'EMP-002', employeeName: 'Pinky Sharma', category: 'Dental', amount: 150.00, status: 'Disbursed', date: '2026-06-02', attachment: 'dental-invoice-01.pdf' },
    { id: 'BEN-8055', employeeId: 'EMP-001', employeeName: 'Sarah Lim', category: 'Optical', amount: 320.00, status: 'Approved', date: '2026-06-10', attachment: 'eyewear-receipt.pdf' },
    { id: 'BEN-8091', employeeId: 'EMP-0285', employeeName: 'Raj Kumar', category: 'Medical', amount: 45.50, status: 'Reviewing', date: '2026-06-14', attachment: 'clinic-slip.pdf' },
    { id: 'BEN-8110', employeeId: 'EMP-002', employeeName: 'Pinky Sharma', category: 'Wellness', amount: 90.00, status: 'Reviewing', date: '2026-06-15', attachment: 'gym-membership-june.pdf' },
  ]);

  const [claimCategory, setClaimCategory] = useState<'Medical' | 'Dental' | 'Optical' | 'Wellness'>('Medical');
  const [claimAmount, setClaimAmount] = useState('');
  const [claimReason, setClaimReason] = useState('');

  // -------------------------------------------------------------
  // MOCK STATE - DEPENDENTS & BENEFICIARIES
  // -------------------------------------------------------------
  const [dependents, setDependents] = useState<Dependent[]>([
    { id: 'DEP-401', employeeId: 'EMP-001', name: 'Arthur Lim', relationship: 'Spouse', dob: '1995-02-14', nric: '950214-14-5581', coverageTier: 'Full Comprehensive' },
    { id: 'DEP-402', employeeId: 'EMP-001', name: 'Aiden Lim', relationship: 'Child', dob: '2021-11-20', nric: '211120-10-0985', coverageTier: 'Full Comprehensive' },
    { id: 'DEP-403', employeeId: 'EMP-0285', name: 'Sita Kumar', relationship: 'Parent', dob: '1962-09-02', nric: '620902-08-4100', coverageTier: 'Standard Medical Only' },
  ]);

  const [newDepName, setNewDepName] = useState('');
  const [newDepRel, setNewDepRel] = useState<'Spouse' | 'Child' | 'Parent' | 'Sibling'>('Spouse');
  const [newDepDob, setNewDepDob] = useState('1996-01-01');
  const [newDepNric, setNewDepNric] = useState('');
  const [newDepTier, setNewDepTier] = useState<'Standard Medical Only' | 'Full Comprehensive' | 'Accident Coverage'>('Standard Medical Only');

  // -------------------------------------------------------------
  // MOCK STATE - PAYROLL SYNC INTEGRATION
  // -------------------------------------------------------------
  const [payrollSyncs, setPayrollSyncs] = useState<PayrollSyncItem[]>([
    { id: 'PSC-101', employeeId: 'EMP-001', employeeName: 'Sarah Lim', perkName: 'Gold Premium Care Co-Pay', value: 45.00, deductionType: 'Co-Pay Deductible', syncStatus: 'Synced', lastSynced: '2026-06-15 09:30' },
    { id: 'PSC-102', employeeId: 'EMP-001', employeeName: 'Sarah Lim', perkName: 'Dental core deductible offset', value: 15.00, deductionType: 'Co-Pay Deductible', syncStatus: 'Synced', lastSynced: '2026-06-15 09:30' },
    { id: 'PSC-103', employeeId: 'EMP-0285', employeeName: 'Raj Kumar', perkName: 'Health Wallet HSA Pre-tax', value: 200.00, deductionType: 'Pre-tax HSA Contribution', syncStatus: 'Synced', lastSynced: '2026-06-15 09:30' },
    { id: 'PSC-104', employeeId: 'EMP-002', employeeName: 'Pinky Sharma', perkName: 'Lifestyle green transit subsidy allowance', value: 120.00, deductionType: 'Taxable Perk', syncStatus: 'Stale - Out of Sync', lastSynced: '2026-06-01 10:15' },
  ]);

  // -------------------------------------------------------------
  // MOCK STATE - VENDOR MANAGEMENT
  // -------------------------------------------------------------
  const [vendors, setVendors] = useState<Vendor[]>([
    { id: 'VND-01', name: 'Alliance Insurance Group', domain: 'alliance-benefits.com', tier: 'Primary Healthcare', activePoliciesCount: 142, monthlyPremium: 58400, renewalDate: '2026-12-31', contactEmail: 'renewals@alliance-ins.com' },
    { id: 'VND-02', name: 'SmileCare Dental Services', domain: 'smilecare-corp.org', tier: 'Dental Specialist', activePoliciesCount: 110, monthlyPremium: 8250, renewalDate: '2026-09-30', contactEmail: 'groupsales@smilecare.org' },
    { id: 'VND-03', name: 'MindBody Global App Inc', domain: 'wellness.mindbody.com', tier: 'EAP / Wellness Portals', activePoliciesCount: 88, monthlyPremium: 3960, renewalDate: '2026-08-15', contactEmail: 'support@wellness.mindbody.com' },
  ]);

  // -------------------------------------------------------------
  // DERIVED CALCULATED VALUES
  // -------------------------------------------------------------
  const employeeEnrolledPlanIds = enrolledPlans[selectedSubEmployee] || [];
  const currentWallet = walletBalances[selectedSubEmployee] || { fsaSpent: 500, fsaTotal: 2000, wellnessSpent: 100, wellnessTotal: 500 };
  const currentDependents = dependents.filter(dep => dep.employeeId === selectedSubEmployee);

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------
  const handleTogglePlanEnrollment = (planId: string, planName: string) => {
    setEnrolledPlans(prev => {
      const activeList = prev[selectedSubEmployee] || [];
      const exists = activeList.includes(planId);
      let updatedList: string[];
      
      if (exists) {
        updatedList = activeList.filter(id => id !== planId);
        addToast(`Disenrolled from ${planName}`, 'info');
      } else {
        updatedList = [...activeList, planId];
        addToast(`Successfully enrolled in ${planName}!`, 'success');
      }

      // Automatically add/update a sync item for Payroll
      const matchingPlan = plans.find(p => p.id === planId);
      if (matchingPlan) {
        if (exists) {
          // Remove from payroll sync state
          setPayrollSyncs(prevSync => prevSync.filter(item => !(item.employeeId === selectedSubEmployee && item.perkName.includes(matchingPlan.name))));
        } else {
          // Add as stale sync to reflect integration
          const newSync: PayrollSyncItem = {
            id: `PSC-${Math.floor(200 + Math.random() * 799)}`,
            employeeId: selectedSubEmployee,
            employeeName: currentEmployeeObj?.name || 'Officer',
            perkName: `${matchingPlan.name} Deduction`,
            value: Number((matchingPlan.monthlyCost * 0.1).toFixed(2)), // 10% co-pay
            deductionType: matchingPlan.category === 'Lifestyle' ? 'Taxable Perk' : 'Co-Pay Deductible',
            syncStatus: 'Stale - Out of Sync',
            lastSynced: 'Pending'
          };
          setPayrollSyncs(prevSync => [newSync, ...prevSync]);
        }
      }

      return {
        ...prev,
        [selectedSubEmployee]: updatedList
      };
    });
  };

  const handleClaimSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!claimAmount || isNaN(parseFloat(claimAmount)) || parseFloat(claimAmount) <= 0) {
      addToast('Please input a valid positive claim amount.', 'error');
      return;
    }
    const amt = parseFloat(claimAmount);
    
    // Check if within budget
    const targetLimit = claimCategory === 'Wellness' ? currentWallet.wellnessTotal - currentWallet.wellnessSpent : currentWallet.fsaTotal - currentWallet.fsaSpent;
    if (amt > targetLimit) {
      addToast(`Overspent limit warning! Claim for RM ${amt.toFixed(2)} exceeds remaining limit of RM ${targetLimit.toFixed(2)}`, 'error');
      return;
    }

    const newClaimObj: BenefitsClaim = {
      id: `BEN-${Math.floor(8000 + Math.random() * 1999)}`,
      employeeId: selectedSubEmployee,
      employeeName: currentEmployeeObj?.name || 'Unknown Officer',
      category: claimCategory,
      amount: amt,
      status: 'Reviewing',
      date: new Date().toISOString().split('T')[0],
      attachment: `receipt_${claimCategory.toLowerCase()}_${Date.now().toString().slice(-4)}.pdf`
    };

    setClaims(prev => [newClaimObj, ...prev]);
    
    // Update wallet spending balances
    setWalletBalances(prev => {
      const current = prev[selectedSubEmployee] || { fsaSpent: 0, fsaTotal: 2000, wellnessSpent: 0, wellnessTotal: 500 };
      if (claimCategory === 'Wellness') {
        return {
          ...prev,
          [selectedSubEmployee]: {
            ...current,
            wellnessSpent: current.wellnessSpent + amt
          }
        };
      } else {
        return {
          ...prev,
          [selectedSubEmployee]: {
            ...current,
            fsaSpent: current.fsaSpent + amt
          }
        };
      }
    });

    setClaimAmount('');
    setClaimReason('');
    addToast(`Successfully registered ${claimCategory} reimbursement claim of RM ${amt.toFixed(2)}`, 'success');
  };

  const handleAddDependent = (e: FormEvent) => {
    e.preventDefault();
    if (!newDepName.trim() || !newDepNric.trim()) {
      addToast('Please specify the dependent’s legal name and identity NRIC number.', 'error');
      return;
    }

    const newDep: Dependent = {
      id: `DEP-${Math.floor(400 + Math.random() * 599)}`,
      employeeId: selectedSubEmployee,
      name: newDepName,
      relationship: newDepRel,
      dob: newDepDob,
      nric: newDepNric,
      coverageTier: newDepTier
    };

    setDependents(prev => [...prev, newDep]);
    setNewDepName('');
    setNewDepNric('');
    addToast(`${newDepName} (${newDepRel}) successfully registered under primary medical insurance.`, 'success');
  };

  const handleDeleteDependent = (id: string, name: string) => {
    setDependents(prev => prev.filter(dep => dep.id !== id));
    addToast(`Removed ${name} from insurance beneficiary schedule.`, 'info');
  };

  const handleSyncAllStaleWithPayroll = () => {
    addToast('Contacting Novora Core Payroll engine...', 'loading');
    setTimeout(() => {
      setPayrollSyncs(prev => prev.map(item => ({
        ...item,
        syncStatus: 'Synced',
        lastSynced: new Date().toISOString().replace('T', ' ').slice(0, 16)
      })));
      addToast('All benefits deductions and taxable perks successfully synchronized into the June 2026 payroll audit run!', 'success');
    }, 1200);
  };

  const handleRenewVendorContract = (vendorId: string, vendorName: string) => {
    addToast(`Initiated contract negotiation with ${vendorName}...`, 'loading');
    setTimeout(() => {
      setVendors(prev => prev.map(v => {
        if (v.id === vendorId) {
          const currentYear = new Date(v.renewalDate).getFullYear();
          return {
            ...v,
            renewalDate: `${currentYear + 1}-12-31`,
          };
        }
        return v;
      }));
      addToast(`Premium renewal with ${vendorName} accomplished for the 2027 fiscal cycle.`, 'success');
    }, 1000);
  };

  return (
    <div id="benefits-module" className="space-y-6">
      
      {/* Dynamic Selector Row - Matches Employee Directory & Onboarding Navigation */}
      <div id="benefits-navigation-layout" className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        
        {/* subtab list */}
        <div id="benefits-sub-tabs" className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto scrollbar-none pb-1 lg:pb-0">
          {(
            [
              'Enrollment & Selection',
              'Wellness Wallets & FSA',
              'Dependents & Beneficiaries',
              'Payroll Integration',
              'Vendor Management',
              'Benefits Reports & Analytics'
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
                    ? 'text-[#2f66e0] bg-[#2f66e0]/10 border border-[#2f66e0]/15 font-extrabold shadow-3xs'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
                }`}
              >
                <span>{tab}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-[#2f66e0] rounded-sm" />
                )}
              </button>
            );
          })}
        </div>

        {/* Global Candidate profile selector */}
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Viewing Employee Profile:</span>
          <select
            value={selectedSubEmployee}
            onChange={(e) => setSelectedSubEmployee(e.target.value)}
            className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-1.5 outline-none cursor-pointer hover:bg-slate-50"
          >
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name} ({emp.id})</option>
            ))}
          </select>
        </div>
      </div>


      {/* SUB-TAB 1: BENEFITS ENROLLMENT & SELECTION */}
      {activeSubTab === 'Enrollment & Selection' && (
        <div id="benefits-subview-enrollment" className="space-y-6">


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => {
              const isEnrolled = employeeEnrolledPlanIds.includes(plan.id);
              return (
                <div 
                  key={plan.id}
                  className={`bg-white border rounded-2xl p-6.5 shadow-xs transition-colors flex flex-col justify-between ${
                    isEnrolled ? 'border-[#2f66e0] bg-blue-50/5' : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                          plan.category === 'Medical' ? 'bg-indigo-50 text-[#2f66e0]' :
                          plan.category === 'Dental' ? 'bg-amber-50 text-amber-700' :
                          plan.category === 'Wellness' ? 'bg-emerald-50 text-emerald-700' :
                          'bg-purple-50 text-purple-700'
                        }`}>
                          {plan.category} Plan
                        </span>
                        <h5 className="text-[13.5px] font-black text-slate-800 mt-1.5">{plan.name}</h5>
                        <p className="text-[10.5px] text-slate-400 font-bold block mt-0.5">by {plan.provider}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black text-slate-800">RM {plan.monthlyCost}</span>
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
                          : 'bg-[#2f66e0] text-white hover:bg-opacity-95 shadow-3xs'
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
                  <h4 className="text-xl font-black text-[#2f66e0] mt-1">RM {(currentWallet.fsaTotal - currentWallet.fsaSpent).toFixed(2)}</h4>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Remaining fund balance of RM {currentWallet.fsaTotal.toFixed(2)}</p>
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
                  <div className="bg-[#2f66e0] h-full" style={{ width: `${(currentWallet.fsaSpent / currentWallet.fsaTotal) * 100}%` }} />
                </div>
              </div>
            </div>

            {/* Wellness Wallet Details */}
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Wellness & Fitness Budget Wallet</span>
                  <h4 className="text-xl font-black text-emerald-600 mt-1">RM {(currentWallet.wellnessTotal - currentWallet.wellnessSpent).toFixed(2)}</h4>
                  <p className="text-xs text-slate-400 font-semibold mt-1">Remaining fund balance of RM {currentWallet.wellnessTotal.toFixed(2)}</p>
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
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
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
                              ? 'bg-blue-50/50 border-[#2f66e0]/35 text-[#2f66e0]'
                              : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Invoice Receipt Value (RM)</label>
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
                      onClick={() => addToast('Simulating mock document scanning...', 'info')}
                      className="text-[9.5px] text-[#2f66e0] font-black uppercase mt-1 cursor-pointer hover:underline"
                    >
                      Upload scanned pdf
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#2f66e0] hover:bg-opacity-95 text-white text-xs font-extrabold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Submit Claim to Welfare Audit</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Claims Ledger list across organization */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-slate-100 rounded-2xl p-6.5 shadow-xs">
                <div className="flex justify-between items-center mb-5">
                  <h5 className="text-[12.5px] font-black text-slate-800 uppercase tracking-wide">FSA Claims Database Receipts</h5>
                  <span className="text-[10px] font-bold font-mono text-slate-400">Total processed item list</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10.5px] font-black text-slate-405 uppercase tracking-wider bg-slate-50/50">
                        <th className="p-3">Claim ID</th>
                        <th className="p-3">Candidate Employee</th>
                        <th className="p-3">Classification</th>
                        <th className="p-3">Amount Charged</th>
                        <th className="p-3">Log Status</th>
                        <th className="p-3">Date Filed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {claims.map((claim) => (
                        <tr key={claim.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3 font-mono text-slate-500 font-bold">{claim.id}</td>
                          <td className="p-3 font-bold text-slate-800">{claim.employeeName}</td>
                          <td className="p-3">
                            <span className={`text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-md ${
                              claim.category === 'Medical' ? 'bg-indigo-50 text-[#2f66e0]' :
                              claim.category === 'Dental' ? 'bg-amber-50 text-amber-700' :
                              claim.category === 'Optical' ? 'bg-purple-50 text-purple-700' :
                              'bg-emerald-50 text-emerald-700'
                            }`}>
                              {claim.category}
                            </span>
                          </td>
                          <td className="p-3 font-bold text-slate-800">RM {claim.amount.toFixed(2)}</td>
                          <td className="p-3">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${
                              claim.status === 'Disbursed' ? 'bg-emerald-50 text-emerald-750' :
                              claim.status === 'Approved' ? 'bg-blue-50 text-blue-755' :
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
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
              <h5 className="text-[12.5px] font-black text-slate-700 uppercase tracking-wide mb-4">Register Family Dependent</h5>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Add spouse, parent, or legal children to have their corporate medical coverage activated under the employee’s Gold Premium Plus plan.
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
                    <select
                      value={newDepRel}
                      onChange={(e) => setNewDepRel(e.target.value as any)}
                      className="w-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 outline-none focus:bg-white focus:border-slate-200 cursor-pointer"
                    >
                      <option value="Spouse">Spouse</option>
                      <option value="Child">Child</option>
                      <option value="Parent">Parent</option>
                      <option value="Sibling">Sibling</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={newDepDob}
                      onChange={(e) => setNewDepDob(e.target.value)}
                      className="w-full text-xs text-slate-750 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 outline-none focus:bg-white focus:border-slate-200"
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
                  <select
                    value={newDepTier}
                    onChange={(e) => setNewDepTier(e.target.value as any)}
                    className="w-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 outline-none focus:bg-white focus:border-slate-200 cursor-pointer"
                  >
                    <option value="Standard Medical Only">Standard Medical Only</option>
                    <option value="Full Comprehensive">Full Comprehensive</option>
                    <option value="Accident Coverage">Accident Coverage</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#2f66e0] hover:bg-opacity-95 text-white text-xs font-extrabold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <Plus className="h-4 w-4" />
                  <span>Register Beneficiary</span>
                </button>
              </form>
            </div>
          </div>

          {/* List of registered dependents */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-6.5 shadow-xs">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h5 className="text-[12.5px] font-black text-slate-800 uppercase tracking-wide">Registered Dependents Schedule</h5>
                  <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Insurance allocations verified for employee: {currentEmployeeObj?.name}</p>
                </div>
                <span className="text-[10px] font-bold bg-[#2f66e0]/10 text-[#2f66e0] px-2.5 py-1 rounded-lg">
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
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
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
                  <p className="text-[11px] text-slate-505 leading-relaxed mt-1">
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
              <span className="text-[9.5px] font-black uppercase text-indigo-700 tracking-wider bg-white rounded-full px-2.5 py-0.5 border border-indigo-100">
                Core HR Integration ledger
              </span>
              <h4 className="text-sm font-black text-slate-800 mt-2.5">Payroll Sync & Deduction Audit</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Configure corporate taxable perks, deductible co-pays, and pre-tax HSA benefits as automated payroll line items.
              </p>
            </div>

            <button
              onClick={handleSyncAllStaleWithPayroll}
              className="bg-[#2f66e0] hover:bg-opacity-95 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2 self-start sm:self-auto shrink-0"
            >
              <RefreshCw className="h-4 w-4 animate-spin-reverse" />
              <span>Synchronize June Payroll Run</span>
            </button>
          </div>

          {/* Sync tables */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6.5 shadow-xs">
            <h5 className="text-[12.5px] font-black text-slate-805 uppercase tracking-wide mb-4">Benefit Line Items Transferred to Payroll Module</h5>
            
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
                  {payrollSyncs.map((sync) => (
                    <tr key={sync.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3.5 font-mono text-slate-450 font-bold">{sync.id}</td>
                      <td className="p-3.5 font-bold text-slate-800">{sync.employeeName}</td>
                      <td className="p-3.5 font-semibold text-slate-600">{sync.perkName}</td>
                      <td className="p-3.5">
                        <span className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-md ${
                          sync.deductionType === 'Taxable Perk' ? 'bg-purple-50 text-purple-700' :
                          sync.deductionType === 'Co-Pay Deductible' ? 'bg-amber-50 text-amber-700 font-bold' :
                          'bg-indigo-50 text-[#2f66e0]'
                        }`}>
                          {sync.deductionType}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-slate-800">
                        {sync.deductionType === 'Taxable Perk' ? `+ RM ${sync.value.toFixed(2)}` : `- RM ${sync.value.toFixed(2)}`}
                      </td>
                      <td className="p-3.5">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${
                          sync.syncStatus === 'Synced' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800 border border-rose-100 animate-pulse'
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
                <span className="text-xl font-black text-slate-800">3 Providers</span>
                <p className="text-[10.5px] text-slate-400 font-semibold mt-0.5">SLA response target: 24h</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs flex items-center gap-4.5">
              <span className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <Coins className="h-5.5 w-5.5" />
              </span>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Average Premium / Capita</span>
                <span className="text-xl font-black text-slate-800">RM 450.00</span>
                <p className="text-[10.5px] text-emerald-500 font-bold mt-0.5">92% utilization rate score</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs flex items-center gap-4.5">
              <span className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <FileText className="h-5.5 w-5.5" />
              </span>
              <div>
                <span className="text-[10px] font-black text-[#2f66e0] bg-blue-50/50 px-1.5 py-0.5 rounded-full border border-blue-105 uppercase tracking-wider">Upcoming Renewal cycle</span>
                <span className="text-xl font-black text-slate-800">In 60 days</span>
                <p className="text-[10.5px] text-slate-400 font-bold mt-0.5">SmileCare Dental core next</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-6.5 shadow-xs">
            <h5 className="text-[12.5px] font-black text-slate-800 uppercase tracking-wide mb-5">Contracted Vendor Platforms</h5>
            
            <div className="space-y-4">
              {vendors.map((vendor) => (
                <div 
                  key={vendor.id}
                  className="p-5.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h6 className="text-xs font-black text-slate-800">{vendor.name}</h6>
                      <span className="text-[9.5px] font-extrabold uppercase px-2 py-0.5 bg-indigo-50 text-[#2f66e0] rounded-md border border-indigo-100/50">
                        {vendor.tier}
                      </span>
                      <span className="text-[10.5px] font-medium text-slate-400 font-mono">{vendor.domain}</span>
                    </div>

                    <div className="flex items-center gap-4.5 text-[11px] text-slate-505 font-semibold">
                      <span>Covered Employees: <strong className="text-slate-800">{vendor.activePoliciesCount}</strong></span>
                      <span>&bull;</span>
                      <span>Total monthly Premium cost: <strong className="text-[#2f66e0]">RM {vendor.monthlyPremium.toLocaleString()}</strong></span>
                      <span>&bull;</span>
                      <span>Renewal point: <span className="text-amber-700">{vendor.renewalDate}</span></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => addToast(`Contacting ${vendor.contactEmail}...`, 'info')}
                      className="bg-white border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 text-xs font-bold px-4 py-2 rounded-xl transition-all select-none cursor-pointer"
                    >
                      Audit SLA details
                    </button>

                    <button
                      onClick={() => handleRenewVendorContract(vendor.id, vendor.name)}
                      className="bg-[#2f66e0] hover:bg-[#2049a8] text-white text-xs font-extrabold px-4 py-2 rounded-xl transition-all select-none cursor-pointer shadow-xs"
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
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-3xs">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-black uppercase tracking-wider block">Total Monthly Premium</span>
                <Coins className="h-4 w-4 text-indigo-500" />
              </div>
              <div className="mt-2.5">
                <span className="text-2xl font-black text-slate-800">
                  RM 14,240
                </span>
                <span className="text-[10px] text-slate-450 block font-semibold mt-0.5">
                  Consolidated 4 primary plans + vendor slabs
                </span>
              </div>
              <div className="flex items-center gap-1 mt-3">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[9.5px] text-emerald-600 font-extrabold uppercase">SLA & Budget Compliant</span>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-3xs">
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
                      <span className="text-[10px] text-slate-455 block font-semibold mt-0.5">
                        RM {totalSpent.toLocaleString()} spent of RM {totalLimit.toLocaleString()} FSA cap
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

            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-3xs">
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
                      <span className="text-[10px] text-slate-455 block font-semibold mt-0.5">
                        RM {totalSpent.toLocaleString()} spent of RM {totalLimit.toLocaleString()} cap
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

            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-3xs">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-black uppercase tracking-wider block">Covered Dependents</span>
                <Users className="h-4 w-4 text-purple-500" />
              </div>
              <div className="mt-2.5">
                <span className="text-2xl font-black text-slate-800">
                  {dependents.length} Covered
                </span>
                <span className="text-[10px] text-slate-450 block font-semibold mt-0.5">
                  Full panel medical + dental alignment
                </span>
              </div>
              <div className="flex items-center gap-1 mt-3">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-[9.5px] text-slate-450 font-bold uppercase">All credentials valid</span>
              </div>
            </div>
          </div>

          {/* Core Insights Grids */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Col: Claims Log Distribution and Category Breakdown (7 Cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs space-y-5">
              <div className="border-b border-slate-50 pb-3 flex justify-between items-center">
                <div>
                  <h5 className="text-[12.5px] font-black text-slate-800 uppercase tracking-wide">Claims Costing Analysis</h5>
                  <p className="text-[10px] text-slate-400 font-medium italic mt-0.5">Active monitoring of medical, optical, and dental co-payments</p>
                </div>
                <button 
                  onClick={() => {
                    addToast('Benefits insurance claims exported for payroll reimbursement processing.', 'success');
                  }}
                  className="bg-slate-50 border border-slate-200 hover:border-[#2f66e0] rounded-xl px-3 py-1 text-[9.5px] font-black uppercase text-slate-500 hover:text-[#2f66e0] cursor-pointer transition-all"
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
                          RM {claim.amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-block text-[9.5px] font-black uppercase px-2 py-0.5 rounded ${
                            claim.status === 'Disbursed' 
                              ? 'bg-emerald-50 text-emerald-700' 
                              : claim.status === 'Approved'
                              ? 'bg-blue-50 text-blue-700'
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
              
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs space-y-4">
                <h5 className="text-[12.5px] font-black text-slate-805 uppercase tracking-wide">Claims Category Ratios</h5>
                
                <div className="space-y-3">
                  {[
                    { category: 'Medical Treatment', amount: claims.filter(c => c.category === 'Medical').reduce((sum, c) => sum + c.amount, 0), percentage: 40, color: 'bg-[#2f66e0]' },
                    { category: 'Dental & Crowns', amount: claims.filter(c => c.category === 'Dental').reduce((sum, c) => sum + c.amount, 0), percentage: 30, color: 'bg-emerald-500' },
                    { category: 'Optical & Contact Lenses', amount: claims.filter(c => c.category === 'Optical').reduce((sum, c) => sum + c.amount, 0), percentage: 20, color: 'bg-indigo-500' },
                    { category: 'Wellness & Gym Reimbursements', amount: claims.filter(c => c.category === 'Wellness').reduce((sum, c) => sum + c.amount, 0), percentage: 10, color: 'bg-purple-500' }
                  ].map((cat, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-[10.5px]">
                        <span className="font-semibold text-slate-600">{cat.category}</span>
                        <span className="font-bold text-slate-800">RM {cat.amount.toFixed(2)} ({cat.percentage}%)</span>
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
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs space-y-4">
                <h5 className="text-[12.5px] font-black text-slate-805 uppercase tracking-wide">Vendor Allocation Split</h5>
                
                <div className="space-y-3.5">
                  {[
                    { provider: 'Alliance Insurance Group', count: 18, share: 65, color: 'bg-indigo-500' },
                    { provider: 'SmileCare Dental Services', count: 12, share: 20, color: 'bg-emerald-500' },
                    { provider: 'MindBody Global Health', count: 8, share: 15, color: 'bg-purple-500' }
                  ].map((pv, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-600 font-bold block truncate max-w-[200px]">{pv.provider}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
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

import { useState, type FormEvent } from 'react'
import {
  Scale,
  ShieldAlert,
  FileText,
  History,
  Search,
  Plus,
  Download,
  Calendar,
  MapPin,
  Clock,
  Eye,
  AlertTriangle,
  AlertCircle,
  FileSpreadsheet,
  Paperclip,
  CheckCircle,
  X,
  PlusCircle,
  BarChart3,
  TrendingUp,
  ChevronDown,
} from 'lucide-react'
import { showActionToast } from '../../utils/actionToast'
import type { ModuleEmployee } from '../../types/moduleEmployee'

type DisciplinaryTabProps = {
  employees: ModuleEmployee[]
}

export type DisciplinarySubTab =
  | 'Disciplinary Reason'
  | 'Disciplinary Action'
  | 'Disciplinary Setup'
  | 'Disciplinary History'
  | 'Disciplinary Reports';

interface DisciplinaryReason {
  id: string;
  name: string;
  severity: 'Minor' | 'Major' | 'Gross misconduct';
  description: string;
  status: 'Active' | 'Inactive';
}

interface DisciplinaryActionType {
  level: string;
  name: string;
  type: string;
  description: string;
  payImpact: string;
}

interface DisciplinaryCase {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  reason: string;
  incidentDate: string;
  location: string;
  fromTime: string;
  toTime: string;
  description: string;
  witnesses: string[];
  warningLevel: string;
  actionIssuedBy: string;
  actionDate: string;
  repeatedAction: string;
  futureExpectation: string;
  status: 'Pending' | 'Acknowledged' | 'Closed';
}

export function DisciplinaryTab({ employees }: DisciplinaryTabProps) {
  const addToast = (text: string, type?: 'success' | 'loading' | 'error' | 'info') => {
    showActionToast(text, type)
  }

  const [activeSubTab, setActiveSubTab] = useState<DisciplinarySubTab>('Disciplinary Reason');

  // Interactive local states for custom entities
  const [reasons, setReasons] = useState<DisciplinaryReason[]>([
    {
      id: 'REC-001',
      name: 'Unauthorised absence',
      severity: 'Minor',
      description: 'Absent without prior approval or valid medical reason.',
      status: 'Active',
    },
    {
      id: 'REC-002',
      name: 'Persistent lateness',
      severity: 'Minor',
      description: 'Repeated late arrivals without valid justification.',
      status: 'Active',
    },
    {
      id: 'REC-003',
      name: 'Insubordination',
      severity: 'Major',
      description: 'Refusal to follow reasonable management instructions.',
      status: 'Active',
    },
    {
      id: 'REC-004',
      name: 'Misconduct at workplace',
      severity: 'Major',
      description: 'Inappropriate behaviour affecting workplace productivity or culture.',
      status: 'Active',
    },
    {
      id: 'REC-005',
      name: 'Fraud / dishonesty',
      severity: 'Gross misconduct',
      description: 'Deliberate falsification of company records, claims or reports.',
      status: 'Active',
    },
    {
      id: 'REC-006',
      name: 'Sexual harassment',
      severity: 'Gross misconduct',
      description: 'Unwanted conduct of a sexual nature in the workplace.',
      status: 'Active',
    },
    {
      id: 'REC-007',
      name: 'Breach of confidentiality',
      severity: 'Gross misconduct',
      description: 'Sharing of sensitive company information with external parties.',
      status: 'Active',
    },
    {
      id: 'REC-008',
      name: 'Dress code violation',
      severity: 'Minor',
      description: 'Non-compliance with company dress code standards.',
      status: 'Inactive',
    },
  ]);

  const [actions, setActions] = useState<DisciplinaryActionType[]>([
    {
      level: 'L1',
      name: 'Verbal warning',
      type: 'Verbal',
      description: 'Informal verbal caution, not recorded on employee file permanently.',
      payImpact: 'No deduction',
    },
    {
      level: 'L2',
      name: 'First written warning',
      type: 'Written',
      description: 'Formal first written warning, filed on staff record for 6 months.',
      payImpact: 'No deduction',
    },
    {
      level: 'L3',
      name: 'Second written warning',
      type: 'Written',
      description: 'Final written warning before suspension/termination, filed for 1 year.',
      payImpact: 'Partial deduction',
    },
    {
      level: 'L4',
      name: 'Suspension without pay',
      type: 'Suspension',
      description: 'Temporary suspension pending formal investigation, full salary deduction.',
      payImpact: 'Full deduction',
    },
    {
      level: 'L5',
      name: 'Demotion',
      type: 'Grade change',
      description: 'Reduction in job grade and responsibilities, permanent salary adjustment.',
      payImpact: 'Pay review',
    },
    {
      level: 'L6',
      name: 'Termination',
      type: 'Dismissal',
      description: 'Employment contract termination, reserved for gross misconduct only.',
      payImpact: 'Full deduction',
    },
  ]);

  const [cases, setCases] = useState<DisciplinaryCase[]>([
    {
      id: 'DISC-2026-001',
      employeeId: 'EMP-0285',
      employeeName: 'Ahmad Luqman',
      department: 'Operations',
      reason: 'Unauthorised absence',
      incidentDate: '2026-05-06',
      location: 'HQ, Level 3',
      fromTime: '09:30 AM',
      toTime: '10:00 AM',
      description: 'Unauthorised absence from primary station without notice or medical cert.',
      witnesses: ['Zara Nor'],
      warningLevel: 'L1',
      actionIssuedBy: 'Nina Reza (Head of HR)',
      actionDate: '2026-05-07',
      repeatedAction: 'First written warning',
      futureExpectation: 'Caution note and expected attendance improvement.',
      status: 'Pending',
    },
    {
      id: 'DISC-2026-002',
      employeeId: 'EMP-0144',
      employeeName: 'Zara Nor',
      department: 'Engineering',
      reason: 'Persistent lateness',
      incidentDate: '2026-04-25',
      location: 'HQ, Engineering Lab',
      fromTime: '10:00 AM',
      toTime: '11:00 AM',
      description: 'Arrived after core standup times repeatedly during the sprint weeks.',
      witnesses: [],
      warningLevel: 'L2',
      actionIssuedBy: 'Malik Said (Tech Lead)',
      actionDate: '2026-04-28',
      repeatedAction: 'Second written warning',
      futureExpectation: 'Strict compliance with team core timing of 09:00 AM.',
      status: 'Acknowledged',
    },
    {
      id: 'DISC-2026-003',
      employeeId: 'EMP-0925',
      employeeName: 'Raj Kumar',
      department: 'Finance',
      reason: 'Dress code violation',
      incidentDate: '2026-03-08',
      location: 'Corporate Suite A',
      fromTime: '09:00 AM',
      toTime: '06:00 PM',
      description: 'Reported to office in beach/casual shorts during board meetings.',
      witnesses: ['Nadia Chen'],
      warningLevel: 'L1',
      actionIssuedBy: 'David Ng (Finance Director)',
      actionDate: '2026-03-10',
      repeatedAction: 'First written warning',
      futureExpectation: 'Dressing must conform strictly to formal corporate standard.',
      status: 'Closed',
    },
  ]);

  // Filters state
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All departments');
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState('All severity');
  const [selectedActionLevelFilter, setSelectedActionLevelFilter] = useState('All levels');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All status');
  const [searchQuery, setSearchQuery] = useState('');

  // Disciplinary Reports States
  const [disciplinaryReportType, setDisciplinaryReportType] = useState<'detail' | 'summary'>('detail');
  const [disciplinaryReportDept, setDisciplinaryReportDept] = useState('All departments');
  const [disciplinaryReportEmp, setDisciplinaryReportEmp] = useState('');
  const [disciplinaryReportLevel, setDisciplinaryReportLevel] = useState('All levels');
  const [disciplinaryReportPeriod, setDisciplinaryReportPeriod] = useState('All times');

  // Modals state
  const [newReasonModalOpen, setNewReasonModalOpen] = useState(false);
  const [newActionModalOpen, setNewActionModalOpen] = useState(false);
  const [viewCaseDetailsModal, setViewCaseDetailsModal] = useState<DisciplinaryCase | null>(null);

  // New Reason Form Data
  const [newReasonName, setNewReasonName] = useState('');
  const [newReasonSeverity, setNewReasonSeverity] = useState<'Minor' | 'Major' | 'Gross misconduct'>('Minor');
  const [newReasonDesc, setNewReasonDesc] = useState('');

  // Edit Reason Form Data
  const [editingReason, setEditingReason] = useState<DisciplinaryReason | null>(null);
  const [editReasonName, setEditReasonName] = useState('');
  const [editReasonSeverity, setEditReasonSeverity] = useState<'Minor' | 'Major' | 'Gross misconduct'>('Minor');
  const [editReasonDesc, setEditReasonDesc] = useState('');
  const [editReasonStatus, setEditReasonStatus] = useState<'Active' | 'Inactive'>('Active');

  // New Action Form Data
  const [newActionLevel, setNewActionLevel] = useState('');
  const [newActionName, setNewActionName] = useState('');
  const [newActionType, setNewActionType] = useState('');
  const [newActionDesc, setNewActionDesc] = useState('');
  const [newActionPay, setNewActionPay] = useState('No deduction');

  // Edit Action Form Data
  const [editingAction, setEditingAction] = useState<DisciplinaryActionType | null>(null);
  const [editActionLevel, setEditActionLevel] = useState('');
  const [editActionName, setEditActionName] = useState('');
  const [editActionType, setEditActionType] = useState('');
  const [editActionDesc, setEditActionDesc] = useState('');
  const [editActionPay, setEditActionPay] = useState('No deduction');

  // Case inputs state (for interactive Disciplinary case form)
  const [formEmployeeId, setFormEmployeeId] = useState('');
  const [formReason, setFormReason] = useState('');
  const [formDate, setFormDate] = useState('2026-06-13');
  const [formLocation, setFormLocation] = useState('');
  const [formFromTime, setFormFromTime] = useState('09:00 AM');
  const [formToTime, setFormToTime] = useState('10:00 AM');
  const [formDescription, setFormDescription] = useState('');
  const [formWitnesses, setFormWitnesses] = useState<string[]>([]);
  const [formWarningLevel, setFormWarningLevel] = useState('L1');
  const [formIssuedBy, setFormIssuedBy] = useState('Nina Reza (Head of HR)');
  const [formActionDate, setFormActionDate] = useState('2026-06-14');
  const [formRepeatedAction, setFormRepeatedAction] = useState('First written warning');
  const [formExpectation, setFormExpectation] = useState('');
  const [attachedFileName, setAttachedFileName] = useState('');

  // Auto-fill department based on selected employee in the form
  const selectedFormEmployeeObj = employees.find((emp) => emp.id === formEmployeeId);
  const formDepartment = selectedFormEmployeeObj ? selectedFormEmployeeObj.department : 'Operations';

  // Sub Tab headers definitions
  const subTabs = [
    { label: 'Disciplinary Reason', icon: Scale },
    { label: 'Disciplinary Action', icon: ShieldAlert },
    { label: 'Disciplinary Setup', icon: FileText },
    { label: 'Disciplinary History', icon: History },
    { label: 'Disciplinary Reports', icon: BarChart3 },
  ];

  // Add reason submit handler
  const handleAddReason = (e: FormEvent) => {
    e.preventDefault();
    if (!newReasonName.trim() || !newReasonDesc.trim()) {
      addToast('Please complete all fields.', 'error');
      return;
    }

    const newReasonObj: DisciplinaryReason = {
      id: `REC-${String(reasons.length + 1).padStart(3, '0')}`,
      name: newReasonName,
      severity: newReasonSeverity,
      description: newReasonDesc,
      status: 'Active',
    };

    setReasons((prev) => [...prev, newReasonObj]);
    setNewReasonModalOpen(false);
    // Reset form
    setNewReasonName('');
    setNewReasonDesc('');
    addToast(`New disciplinary reason "${newReasonName}" successfully created.`, 'success');
  };

  // Add action level submit handler
  const handleAddAction = (e: FormEvent) => {
    e.preventDefault();
    if (!newActionLevel.trim() || !newActionName.trim() || !newActionDesc.trim()) {
      addToast('Please complete all fields.', 'error');
      return;
    }

    const newActionObj: DisciplinaryActionType = {
      level: newActionLevel,
      name: newActionName,
      type: newActionType || 'Standard',
      description: newActionDesc,
      payImpact: newActionPay,
    };

    setActions((prev) => [...prev, newActionObj]);
    setNewActionModalOpen(false);
    setNewActionLevel('');
    setNewActionName('');
    setNewActionType('');
    setNewActionDesc('');
    addToast(`Action level ${newActionLevel} (${newActionName}) initiated.`, 'success');
  };

  // Edit reason submit handler
  const handleSaveEditReason = (e: FormEvent) => {
    e.preventDefault();
    if (!editReasonName.trim() || !editReasonDesc.trim() || !editingReason) {
      addToast('Please complete all fields.', 'error');
      return;
    }

    setReasons((prev) =>
      prev.map((item) =>
        item.id === editingReason.id
          ? { ...item, name: editReasonName, severity: editReasonSeverity, description: editReasonDesc, status: editReasonStatus }
          : item
      )
    );
    setEditingReason(null);
    addToast(`Disciplinary reason "${editReasonName}" successfully updated.`, 'success');
  };

  // Edit action submit handler
  const handleSaveEditAction = (e: FormEvent) => {
    e.preventDefault();
    if (!editActionName.trim() || !editActionDesc.trim() || !editingAction) {
      addToast('Please complete all fields.', 'error');
      return;
    }

    setActions((prev) =>
      prev.map((item) =>
        item.level === editingAction.level
          ? { ...item, name: editActionName, type: editActionType || 'Standard', description: editActionDesc, payImpact: editActionPay }
          : item
      )
    );
    setEditingAction(null);
    addToast(`Warning parameter "${editActionName}" for level ${editActionLevel} successfully updated.`, 'success');
  };

  // Safe file mock triggers
  const triggerDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const triggerDropFile = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setAttachedFileName(e.dataTransfer.files[0].name);
      addToast(`Attached document ${e.dataTransfer.files[0].name}`, 'success');
    }
  };

  const triggerFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFileName(e.target.files[0].name);
      addToast(`Attached document ${e.target.files[0].name}`, 'success');
    }
  };

  // Save full disciplinary case
  const handleSaveCase = (e: FormEvent) => {
    e.preventDefault();
    if (!formEmployeeId) {
      addToast('Please select an employee.', 'error');
      return;
    }
    if (!formReason) {
      addToast('Please choose a disciplinary reason.', 'error');
      return;
    }
    if (!formDescription.trim()) {
      addToast('Please write an incident description.', 'error');
      return;
    }

    const empObj = employees.find((x) => x.id === formEmployeeId);
    const caseIdNum = cases.length + 1;

    const newCase: DisciplinaryCase = {
      id: `DISC-2026-${String(caseIdNum).padStart(3, '0')}`,
      employeeId: formEmployeeId,
      employeeName: empObj ? empObj.name : 'Unknown Staff',
      department: formDepartment,
      reason: formReason,
      incidentDate: formDate,
      location: formLocation || 'HQ Corporate Office',
      fromTime: formFromTime,
      toTime: formToTime,
      description: formDescription,
      witnesses: formWitnesses,
      warningLevel: formWarningLevel,
      actionIssuedBy: formIssuedBy,
      actionDate: formActionDate,
      repeatedAction: formRepeatedAction,
      futureExpectation: formExpectation || 'Continuous behavioral observation',
      status: 'Pending',
    };

    setCases((prev) => [newCase, ...prev]);
    addToast(`Case folder ${newCase.id} registered. Notification dispatched to employee.`, 'success');

    // Reset setup form
    setFormEmployeeId('');
    setFormReason('');
    setFormLocation('');
    setFormDescription('');
    setFormWitnesses([]);
    setFormExpectation('');
    setAttachedFileName('');

    // Take user to the history log to inspect immediately or stay
    setActiveSubTab('Disciplinary History' as DisciplinarySubTab);
  };

  // Update status inline
  const updateCaseStatus = (caseId: string, newStatus: 'Pending' | 'Acknowledged' | 'Closed') => {
    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, status: newStatus } : c))
    );
    addToast(`Disciplinary case ${caseId} marked as ${newStatus}`, 'success');
  };

  return (
    <div id="disciplinary-module-root" className="space-y-6">
      
      {/* 1. UPPER NAVIGATION NAV-BAR - styled exactly like Attendance and Leave modules */}
      <div id="disciplinary-module-navigator" className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-200/85 pb-4 gap-4 min-w-0">
        
        {/* Navigation tabs styled as pills with active background */}
        <div id="disciplinary-navigation-tabs" className="flex items-center gap-2 select-none overflow-x-auto flex-1 min-w-0 scrollbar-none pb-1">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.label;
            return (
              <button
                id={`tab-${tab.label.toLowerCase().replace(/\s+/g, '-')}`}
                key={tab.label}
                type="button"
                onClick={() => setActiveSubTab(tab.label as DisciplinarySubTab)}
                className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all shrink-0 relative cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'text-[#2f66e0] bg-[#2f66e0]/10 border border-[#2f66e0]/15 font-extrabold'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="whitespace-nowrap">{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#2f66e0] rounded-sm" />
                )}
              </button>
            );
          })}
        </div>

        {/* Action controllers on the right, integrated into the navigation grid */}
        <div id="disciplinary-upper-actions" className="flex items-center gap-2.5 shrink-0 font-sans text-slate-700">
          
          {/* Department global filter dropdown */}
          <div className="relative">
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
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

          {/* Export button */}
          <button
            type="button"
            onClick={() => addToast('Exporting summary disciplinary metrics...', 'loading')}
            className="h-9 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3.5 rounded-xl inline-flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
          >
            <Download className="h-4 w-4 text-slate-400 shrink-0" />
            <span>Export</span>
          </button>

          {/* Prompt action trigger */}
          {activeSubTab === 'Disciplinary Reason' && (
            <button
              type="button"
              onClick={() => setNewReasonModalOpen(true)}
              className="h-9 bg-[#2f66e0] hover:opacity-95 text-white text-xs font-extrabold px-3.5 rounded-xl transition-all shadow-sm inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">New Reason</span>
            </button>
          )}

          {activeSubTab === 'Disciplinary Action' && (
            <button
              type="button"
              onClick={() => setNewActionModalOpen(true)}
              className="h-9 bg-[#2f66e0] hover:opacity-95 text-white text-xs font-extrabold px-3.5 rounded-xl transition-all shadow-sm inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">New Action</span>
            </button>
          )}

          {activeSubTab === 'Disciplinary History' && (
            <button
              type="button"
              onClick={() => {
                setActiveSubTab('Disciplinary Setup' as DisciplinarySubTab);
                addToast('Input incident logs below.', 'info');
              }}
              className="h-9 bg-[#2f66e0] hover:opacity-95 text-white text-xs font-extrabold px-3.5 rounded-xl transition-all shadow-sm inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">New Case</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. RENDER SUB-TAB CARD CONTENT */}

      {/* ===== SUB-TAB: DISCIPLINARY REASON ===== */}
      {activeSubTab === 'Disciplinary Reason' && (
        <div id="disciplinary-reasons-view" className="space-y-4">
          
          {/* Controls section */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200/80 text-xs font-semibold pl-9.5 pr-4 py-2 rounded-xl focus:outline-none focus:bg-white w-full transition-all"
              />
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-slate-400">Severity:</span>
              <select
                value={selectedSeverityFilter}
                onChange={(e) => setSelectedSeverityFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer"
              >
                <option value="All severity">All severity</option>
                <option value="Minor">Minor</option>
                <option value="Major">Major</option>
                <option value="Gross misconduct">Gross misconduct</option>
              </select>
            </div>
          </div>

          {/* Reasons Table */}
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 min-w-[650px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <th className="p-3.5 pl-5 w-48">Reason / Offence</th>
                    <th className="p-3.5 w-36">Severity Level</th>
                    <th className="p-3.5">Description</th>
                    <th className="p-3.5 w-24">Status</th>
                    <th className="p-3.5 w-24 text-right pr-5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {reasons
                    .filter((r) => {
                      const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.description.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchesSeverity = selectedSeverityFilter === 'All severity' || r.severity === selectedSeverityFilter;
                      return matchesSearch && matchesSeverity;
                    })
                    .map((r) => {
                      let tagStyle = '';
                      if (r.severity === 'Minor') {
                        tagStyle = 'bg-amber-50 text-amber-700 border-amber-100';
                      } else if (r.severity === 'Major') {
                        tagStyle = 'bg-orange-50 text-orange-700 border-orange-100';
                      } else {
                        tagStyle = 'bg-red-50 text-red-700 border-red-100';
                      }

                      return (
                        <tr key={r.id} className="hover:bg-slate-50/40">
                          <td className="p-3.5 pl-5 font-bold text-slate-800 flex items-center gap-2">
                            <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                              r.severity === 'Minor' ? 'bg-amber-500' : r.severity === 'Major' ? 'bg-orange-500' : 'bg-red-600'
                            }`} />
                            <span>{r.name}</span>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${tagStyle}`}>
                              {r.severity}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-500">{r.description}</td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 font-bold text-[10px] rounded-md ${
                              r.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : 'bg-slate-100 text-slate-500'
                            }`}>
                              {r.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right pr-5">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => {
                                  setEditingReason(r);
                                  setEditReasonName(r.name);
                                  setEditReasonSeverity(r.severity);
                                  setEditReasonDesc(r.description);
                                  setEditReasonStatus(r.status);
                                }}
                                className="text-slate-600 hover:text-[#2f66e0] font-bold text-xs bg-slate-50 hover:bg-[#2f66e0]/10 border border-slate-100 p-1.5 rounded-lg transition-all cursor-pointer"
                                title="Edit parameter details"
                              >
                                Edit
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

      {/* ===== SUB-TAB: DISCIPLINARY ACTION ===== */}
      {activeSubTab === 'Disciplinary Action' && (
        <div id="disciplinary-actions-view" className="space-y-4">
          
          <div className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-400 font-semibold">
              Warning parameters matrix matching standard corporate audit protocols
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-slate-400">Action Type:</span>
              <select
                value={selectedActionLevelFilter}
                onChange={(e) => setSelectedActionLevelFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer"
              >
                <option value="All levels">All actions</option>
                <option value="Verbal">Verbal warning</option>
                <option value="Written">Written warning</option>
                <option value="Suspension">Suspension</option>
                <option value="Grade change">Grade change</option>
                <option value="Dismissal">Dismissal</option>
              </select>
            </div>
          </div>

          {/* Action grid table */}
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <th className="p-4 pl-5 w-20">Level</th>
                    <th className="p-4 w-44">Action Name</th>
                    <th className="p-4 w-32">Action Type</th>
                    <th className="p-4">Description</th>
                    <th className="p-4 w-36">Pay Impact</th>
                    <th className="p-4 w-24 text-right pr-5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {actions
                    .filter(a => selectedActionLevelFilter === 'All levels' || a.type === selectedActionLevelFilter)
                    .map((a) => (
                      <tr key={a.level} className="hover:bg-slate-50/40">
                        <td className="p-4 pl-5 font-bold text-[#2f66e0] font-mono">{a.level}</td>
                        <td className="p-4 font-bold text-slate-800">{a.name}</td>
                        <td className="p-4">
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-bold">
                            {a.type}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500">{a.description}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                            a.payImpact === 'No deduction'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : a.payImpact === 'Partial deduction'
                              ? 'bg-amber-50 text-amber-700 border border-amber-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-100'
                          }`}>
                            {a.payImpact}
                          </span>
                        </td>
                        <td className="p-4 text-right pr-5">
                          <button
                            onClick={() => {
                              setEditingAction(a);
                              setEditActionLevel(a.level);
                              setEditActionName(a.name);
                              setEditActionType(a.type);
                              setEditActionDesc(a.description);
                              setEditActionPay(a.payImpact);
                            }}
                            className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border border-slate-100 p-1.5 rounded-lg text-xs transition-all cursor-pointer"
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
        </div>
      )}

      {/* ===== SUB-TAB: DISCIPLINARY SETUP ===== */}
      {activeSubTab === 'Disciplinary Setup' && (
        <div id="disciplinary-setup-view" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Form Side - 7 cols */}
          <form onSubmit={handleSaveCase} className="lg:col-span-7 bg-white border border-slate-100 rounded-2.5xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800 tracking-tight">Disciplinary Case Form</h3>
              <p className="text-[10.5px] font-semibold text-slate-400 mt-0.5">Create a formal incident log and configure standard warning actions</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Employee */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Employee <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formEmployeeId}
                  onChange={(e) => setFormEmployeeId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold rounded-xl focus:outline-none focus:bg-white focus:border-[#2f66e0]"
                >
                  <option value="">-- Select employee --</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.id})
                    </option>
                  ))}
                </select>
              </div>

              {/* Department (auto updated) */}
              <div className="space-y-1.55">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Department</label>
                <input
                  type="text"
                  disabled
                  value={formDepartment}
                  className="w-full bg-slate-100/75 border border-slate-200 p-2.5 text-xs font-bold text-slate-500 rounded-xl"
                />
              </div>

              {/* Disciplinary Reason */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Disciplinary Reason <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold rounded-xl focus:outline-none focus:bg-white focus:border-[#2f66e0]"
                >
                  <option value="">-- Select reason --</option>
                  {reasons
                    .filter((r) => r.status === 'Active')
                    .map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name} [{r.severity}]
                      </option>
                    ))}
                </select>
              </div>

              {/* Date of incident */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Date of Incident <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 pl-9.5 pr-3 py-2 text-xs font-bold rounded-xl focus:outline-none focus:bg-white focus:border-[#2f66e0]"
                  />
                </div>
              </div>

              {/* Location site */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Location / Site</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. HQ, Level 3"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 pl-9.5 pr-3 py-2 text-xs font-bold rounded-xl focus:outline-none focus:bg-white focus:border-[#2f66e0]"
                  />
                </div>
              </div>

              {/* From time */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">From Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={formFromTime}
                    onChange={(e) => setFormFromTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 pl-9.5 pr-3 py-2 text-xs font-bold rounded-xl focus:outline-none focus:bg-white focus:border-[#2f66e0]"
                  />
                </div>
              </div>

              {/* To time */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">To Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={formToTime}
                    onChange={(e) => setFormToTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 pl-9.5 pr-3 py-2 text-xs font-bold rounded-xl focus:outline-none focus:bg-white focus:border-[#2f66e0]"
                  />
                </div>
              </div>

              {/* Incident description */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Incident Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the incident in detail..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold rounded-xl focus:outline-none focus:bg-white focus:border-[#2f66e0]"
                />
              </div>

              {/* Witnesses */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Witness(es) Involved (Optional)</label>
                <select
                  multiple
                  value={formWitnesses}
                  onChange={(e) => {
                    const options = Array.from(e.target.selectedOptions, (option: any) => option.value);
                    setFormWitnesses(options);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold rounded-xl focus:outline-none focus:bg-white focus:border-[#2f66e0] min-h-16"
                >
                  {employees
                    .filter((x) => x.id !== formEmployeeId)
                    .map((emp) => (
                      <option key={emp.id} value={emp.name}>
                        {emp.name} ({emp.id})
                      </option>
                    ))}
                </select>
                <p className="text-[9.5px] font-semibold text-slate-400 italic">Hold Ctrl/Cmd to select multiple witnesses.</p>
              </div>

              {/* Action and Warning levels block separator */}
              <div className="sm:col-span-2 my-1 border-t border-slate-100" />

              {/* Level of disciplinary */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Level of Disciplinary <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formWarningLevel}
                  onChange={(e) => setFormWarningLevel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold rounded-xl focus:outline-none focus:bg-white focus:border-[#2f66e0]"
                >
                  {actions.map((act) => (
                    <option key={act.level} value={act.level}>
                      {act.level} — {act.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action issued by */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Action Issued by <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formIssuedBy}
                  onChange={(e) => setFormIssuedBy(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold rounded-xl focus:outline-none focus:bg-white"
                >
                  <option value="Nina Reza (Head of HR)">Nina Reza (Head of HR)</option>
                  <option value="David Ng (Finance Director)">David Ng (Finance Director)</option>
                  <option value="Malik Said (Tech Lead)">Malik Said (Tech Lead)</option>
                  <option value="Johnathan Goh (COO)">Johnathan Goh (COO)</option>
                </select>
              </div>

              {/* Action date */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Action Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formActionDate}
                  onChange={(e) => setFormActionDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold rounded-xl focus:outline-none"
                />
              </div>

              {/* If repeated next action */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">If Repeated, Next Action</label>
                <select
                  value={formRepeatedAction}
                  onChange={(e) => setFormRepeatedAction(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold rounded-xl focus:outline-none focus:bg-white"
                >
                  {actions.map((act) => (
                    <option key={act.level} value={act.name}>
                      {act.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Future expectation */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Statement of Future Expectation</label>
                <textarea
                  rows={2}
                  placeholder="Describe mandatory improvements required by resource..."
                  value={formExpectation}
                  onChange={(e) => setFormExpectation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold rounded-xl focus:outline-none"
                />
              </div>

              {/* Supporting Document file input support */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Supporting Document</label>
                <div
                  onDragOver={triggerDragOver}
                  onDrop={triggerDropFile}
                  className="border-2 border-dashed border-slate-200 hover:border-[#2f66e0]/40 rounded-2xl p-5 text-center transition-all bg-slate-50/20 cursor-pointer relative group"
                >
                  <input
                    type="file"
                    id="doc-file-upload"
                    onChange={triggerFileSelect}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-1.5 select-none text-slate-600">
                    <Paperclip className="h-5 w-5 text-slate-400 group-hover:scale-110 transition-transform" />
                    {attachedFileName ? (
                      <div>
                        <span className="text-xs font-extrabold text-[#2f66e0] block">{attachedFileName}</span>
                        <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Drag more to overwrite</span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-xs font-extrabold block">Click to attach file or drag-and-drop</span>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Supports PDF, DOCX, PNG up to 10MB</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Buttons row */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setFormEmployeeId('');
                  setFormReason('');
                  setFormDescription('');
                  addToast('Setup session cancelled', 'info');
                }}
                className="px-5 py-2.5 text-xs font-extrabold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-extrabold text-white bg-[#2f66e0] hover:opacity-95 transition-all rounded-xl cursor-pointer shadow-sm"
              >
                Save Disciplinary Case
              </button>
            </div>
          </form>

          {/* Guidelines Sidebar - 5 cols */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Warning Guide Card */}
            <div className="bg-white border border-slate-100 rounded-2.5xl p-5 shadow-sm space-y-4">
              <div>
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="h-4.5 w-4.5 text-[#2f66e0]" />
                  <span>Warning Level Guide</span>
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Standard guidelines for issuing warning protocols</p>
              </div>

              <div className="space-y-3">
                {actions.map((act) => (
                  <div key={act.level} className="flex gap-3 text-xs leading-normal font-medium border-b border-slate-50 pb-2.5 last:border-0 last:pb-0">
                    <span className="h-6 w-10 shrink-0 rounded-md bg-slate-100 border border-slate-200 font-bold font-mono text-slate-600 flex items-center justify-center text-[10.5px]">
                      {act.level}
                    </span>
                    <div>
                      <span className="font-extrabold text-slate-800 block">{act.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{act.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Cases Card */}
            <div className="bg-white border border-slate-100 rounded-2.5xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <AlertCircle className="h-4.5 w-4.5 text-amber-500" />
                    <span>Recent cases</span>
                  </h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Recent system log events</p>
                </div>
                <span className="bg-rose-50 text-rose-600 text-[10px] font-extrabold border border-rose-100 px-2 py-0.5 rounded-md">
                  {cases.filter(c => c.status !== 'Closed').length} active
                </span>
              </div>

              <div className="space-y-3">
                {cases.slice(0, 3).map((item) => {
                  let statusStyle = '';
                  if (item.status === 'Pending') statusStyle = 'bg-amber-500/10 text-amber-700 border-amber-200';
                  else if (item.status === 'Acknowledged') statusStyle = 'bg-blue-500/10 text-blue-700 border-blue-200';
                  else statusStyle = 'bg-emerald-500/10 text-emerald-700 border-emerald-200';

                  return (
                    <div key={item.id} className="p-3 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-100/70 transition-all font-medium flex flex-col gap-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-slate-400">{item.id}</span>
                          <span className="text-xs font-bold text-slate-800 block mt-0.5">{item.employeeName}</span>
                        </div>
                        <span className={`text-[9.5px] font-extrabold px-1.5 py-0.5 rounded border ${statusStyle}`}>
                          {item.status}
                        </span>
                      </div>

                      <div className="text-[10.5px] text-slate-500 leading-snug">
                        {item.reason} &bull; <span className="font-mono text-slate-400">{item.incidentDate}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ===== SUB-TAB: DISCIPLINARY HISTORY ===== */}
      {activeSubTab === 'Disciplinary History' && (
        <div id="disciplinary-history-view" className="space-y-4">
          
          {/* Controls toolbar */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search case log by employee name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 border border-slate-200/80 text-xs font-semibold pl-9.5 pr-4 py-2 rounded-xl focus:outline-none focus:bg-white w-full transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 font-bold text-slate-700">
              {/* Status filter */}
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs p-2 rounded-xl cursor-pointer"
              >
                <option value="All status">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Acknowledged">Acknowledged</option>
                <option value="Closed">Closed</option>
              </select>

              <button
                onClick={() => addToast('Dispatched formatted system PDF logs to supervisor dashboard.', 'success')}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>Generate PDF</span>
              </button>
            </div>
          </div>

          {/* Case History Table */}
          <div className="bg-white border border-slate-100 rounded-2.5xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <th className="p-4 pl-5">Employee</th>
                    <th className="p-4">Reason / Offence</th>
                    <th className="p-4 text-center">Incident Date</th>
                    <th className="p-4 text-center">Action Date</th>
                    <th className="p-4">Warning Level</th>
                    <th className="p-4">Action Issued by</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right pr-5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {cases
                    .filter((c) => {
                      const matchesSearch = c.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || c.reason.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchesStatus = selectedStatusFilter === 'All status' || c.status === selectedStatusFilter;
                      const matchesDept = selectedDeptFilter === 'All departments' || c.department === selectedDeptFilter;
                      return matchesSearch && matchesStatus && matchesDept;
                    })
                    .map((item) => {
                      let tagStyle = '';
                      if (item.status === 'Pending') tagStyle = 'bg-amber-50 text-amber-700 border border-amber-100';
                      else if (item.status === 'Acknowledged') tagStyle = 'bg-blue-50 text-blue-700 border border-blue-100';
                      else tagStyle = 'bg-emerald-50 text-emerald-700 border border-emerald-100';

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/40">
                          {/* Profile */}
                          <td className="p-4 pl-5">
                            <div className="flex items-center gap-3">
                              <div className="h-8.5 w-8.5 rounded-full bg-slate-100 text-[#2f66e0] font-bold text-xs flex items-center justify-center border border-slate-200 shrink-0">
                                {item.employeeName.split(' ')[0][0]}{item.employeeName.split(' ')[1]?.[0] || ''}
                              </div>
                              <div>
                                <span className="font-extrabold text-slate-800 block">{item.employeeName}</span>
                                <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{item.employeeId} &bull; {item.department}</span>
                              </div>
                            </div>
                          </td>

                          {/* Reason */}
                          <td className="p-4">
                            <span className="font-semibold text-slate-800">{item.reason}</span>
                          </td>

                          {/* Incident Date */}
                          <td className="p-4 text-center font-mono text-slate-500">{item.incidentDate}</td>

                          {/* Action Date */}
                          <td className="p-4 text-center font-mono text-slate-500">{item.actionDate}</td>

                          {/* Warning level */}
                          <td className="p-4">
                            <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-[10px]">
                              {item.warningLevel} — {actions.find(a => a.level === item.warningLevel)?.name || 'Warning'}
                            </span>
                          </td>

                          {/* Action issued by */}
                          <td className="p-4 text-slate-600 font-semibold">{item.actionIssuedBy}</td>

                          {/* Status */}
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-md font-extrabold text-[10px] ${tagStyle}`}>
                              {item.status}
                            </span>
                          </td>

                          {/* View folder trigger */}
                          <td className="p-4 text-right pr-5">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setViewCaseDetailsModal(item)}
                                className="text-slate-500 hover:text-[#2f66e0] font-bold text-xs bg-slate-50 hover:bg-[#2f66e0]/10 border border-slate-100 p-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span>View</span>
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


      {/* ===== SUB-TAB: DISCIPLINARY REPORTS ===== */}
      {activeSubTab === 'Disciplinary Reports' && (() => {
        // Calculate dynamic report KPI metrics
        const totalCases = cases.length;
        const pendingCases = cases.filter(c => c.status === 'Pending').length;
        const closedCases = cases.filter(c => c.status === 'Closed').length;
        const activeWarnings = cases.filter(c => c.status !== 'Closed').length;
        const grossMisconductCount = cases.filter(c => {
          const reasonObj = reasons.find(r => r.name === c.reason);
          return reasonObj?.severity === 'Gross misconduct';
        }).length;
        const resolveRate = totalCases > 0 ? Math.round((closedCases / totalCases) * 100) : 100;

        // Department Breakdown data logic
        const depts = ['Engineering', 'Finance', 'HR', 'Marketing', 'Operations'] as const;
        const departmentalData = depts.map((dept) => {
          const fteCount = employees.filter(e => e.department === dept).length;
          const deptCases = cases.filter(c => c.department === dept);
          const deptTotal = deptCases.length;
          const deptPending = deptCases.filter(c => c.status === 'Pending').length;
          const deptClosed = deptCases.filter(c => c.status === 'Closed').length;
          
          // Most Common Infraction
          const counts: Record<string, number> = {};
          deptCases.forEach(c => {
            counts[c.reason] = (counts[c.reason] || 0) + 1;
          });
          let mostCommon = 'None recorded';
          let maxCount = 0;
          Object.entries(counts).forEach(([reason, count]) => {
            if (count > maxCount) {
              maxCount = count;
              mostCommon = reason;
            }
          });

          // Assess risk level based on warning levels L4, L5, L6 (severe action) or number of cases
          let riskRating: 'Normal' | 'Under Watch' | 'Action Needed' = 'Normal';
          const hasHeavyAction = deptCases.some(c => ['L4', 'L5', 'L6'].includes(c.warningLevel));
          if (hasHeavyAction) {
            riskRating = 'Action Needed';
          } else if (deptTotal >= 2) {
            riskRating = 'Under Watch';
          }

          return {
            deptName: dept,
            fteSize: fteCount,
            totalCount: deptTotal,
            pendingCount: deptPending,
            closedCount: deptClosed,
            commonOffence: mostCommon,
            riskAssessment: riskRating,
          };
        });

        // Compute summary status for employee scoreboard
        const summaryRecords = employees.map((emp) => {
          const empCases = cases.filter(c => c.employeeId === emp.id);
          const totalCasesEmp = empCases.length;
          const pendingEmp = empCases.filter(c => c.status === 'Pending').length;
          
          const sortedCases = [...empCases].sort((a, b) => new Date(b.incidentDate).getTime() - new Date(a.incidentDate).getTime());
          const latestCase = sortedCases[0] || null;
          
          let maxLevel = 'None';
          let maxLevelNum = 0;
          empCases.forEach(c => {
            const num = parseInt(c.warningLevel.replace('L', ''), 10) || 0;
            if (num > maxLevelNum) {
              maxLevelNum = num;
              maxLevel = c.warningLevel;
            }
          });
          
          return {
            employee: emp,
            totalCases: totalCasesEmp,
            pending: pendingEmp,
            latestInfraction: latestCase ? latestCase.reason : 'None recorded',
            latestDate: latestCase ? latestCase.incidentDate : '-',
            maxLevel,
          };
        }).filter(row => {
          const matchesDept = disciplinaryReportDept === 'All departments' || row.employee.department === disciplinaryReportDept;
          const matchesSearch = row.employee.name.toLowerCase().includes(disciplinaryReportEmp.toLowerCase()) || row.employee.id.toLowerCase().includes(disciplinaryReportEmp.toLowerCase());
          return matchesDept && matchesSearch;
        });

        return (
          <div className="space-y-6 animate-in fade-in duration-150" id="disciplinary-reports-view">
            
            {/* 1. Statistics KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resolution Rate</span>
                  <h3 className="text-xl font-extrabold text-[#2f66e0] tracking-tight">{resolveRate}%</h3>
                  <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50/60 px-2 py-0.5 rounded-md border border-emerald-100">&bull; {closedCases} of {totalCases} closed</span>
                </div>
                <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-[#2f66e0]" />
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Cases</span>
                  <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">{activeWarnings} cases</h3>
                  <span className="text-[9px] font-bold text-amber-500 bg-amber-50/60 px-2 py-0.5 rounded-md border border-amber-100">{pendingCases} pending action</span>
                </div>
                <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gross Misconduct</span>
                  <h3 className="text-xl font-extrabold text-rose-600 tracking-tight">{grossMisconductCount} critical</h3>
                  <span className="text-[9px] font-bold text-rose-500 bg-rose-50/60 px-2 py-0.5 rounded-md border border-rose-100">Immediate attention</span>
                </div>
                <div className="h-10 w-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center">
                  <ShieldAlert className="h-5 w-5 text-rose-500" />
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                <div className="space-y-1 font-sans">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Filed Cases</span>
                  <h3 className="text-xl font-extrabold text-indigo-600 tracking-tight">{totalCases} logged</h3>
                  <span className="text-[9px] font-bold text-indigo-500 bg-indigo-50/60 px-2 py-0.5 rounded-md border border-indigo-100">Overall records</span>
                </div>
                <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-indigo-500" />
                </div>
              </div>

            </div>

            {/* 2. Departmental compliance/utilization scoreboard */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-800 tracking-tight flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#2f66e0]" />
                  <span>Departmental Disciplinary &amp; Compliance Matrix</span>
                </h4>
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Aggregate warning frequencies, unresolved pending investigations, and structural risk metrics by business unit</p>
              </div>

              <div className="bg-white border border-slate-100 rounded-xl overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700 min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <th className="p-3 pl-4">Department Unit</th>
                      <th className="p-3">Staff headcount</th>
                      <th className="p-3 text-center">Total Infractions</th>
                      <th className="p-3 text-center">Under Investigation</th>
                      <th className="p-3 text-center">Resolved Cases</th>
                      <th className="p-3 font-semibold text-slate-400">Most Common Violation</th>
                      <th className="p-3 pr-4 text-right">Organizational Health</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {departmentalData.map((data) => {
                      let healthBadge = '';
                      if (data.riskAssessment === 'Normal') {
                        healthBadge = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                      } else if (data.riskAssessment === 'Under Watch') {
                        healthBadge = 'bg-amber-50 text-amber-700 border-amber-200';
                      } else {
                        healthBadge = 'bg-rose-50 text-rose-700 border-rose-200';
                      }

                      return (
                        <tr key={data.deptName} className="hover:bg-slate-50/40">
                          <td className="p-3 pl-4 font-bold text-slate-800">{data.deptName}</td>
                          <td className="p-3 text-slate-500">{data.fteSize} staff</td>
                          <td className="p-3 text-center font-mono font-bold text-slate-700">{data.totalCount}</td>
                          <td className="p-3 text-center font-mono text-amber-600 font-bold">{data.pendingCount}</td>
                          <td className="p-3 text-center font-mono text-emerald-600 font-bold">{data.closedCount}</td>
                          <td className="p-3 text-slate-500 italic font-semibold">{data.commonOffence}</td>
                          <td className="p-3 pr-4 text-right">
                            <span className={`border px-2.5 py-0.5 rounded-md font-extrabold text-[10px] ${healthBadge}`}>
                              {data.riskAssessment === 'Normal' ? 'Clear / Healthy' : data.riskAssessment === 'Under Watch' ? 'Under Watch' : 'Action Required'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. Reports Controls & Input Filters */}
            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row flex-wrap items-center justify-between gap-4">
              
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setDisciplinaryReportType('detail')}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    disciplinaryReportType === 'detail'
                      ? 'bg-slate-100 text-[#2f66e0] ring-1 ring-slate-200 shadow-sm font-extrabold'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Detailed infraction logs
                </button>
                <button
                  type="button"
                  onClick={() => setDisciplinaryReportType('summary')}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    disciplinaryReportType === 'summary'
                      ? 'bg-slate-100 text-[#2f66e0] ring-1 ring-slate-200 shadow-sm font-extrabold'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Summary warning balance
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto text-slate-700 font-sans">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search staff name..."
                    value={disciplinaryReportEmp}
                    onChange={(e) => setDisciplinaryReportEmp(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-xs font-medium pl-8.5 pr-3 py-2 rounded-xl focus:outline-none focus:bg-white w-40"
                  />
                </div>

                {/* Department filter */}
                <select
                  value={disciplinaryReportDept}
                  onChange={(e) => setDisciplinaryReportDept(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs font-bold p-2 rounded-xl focus:outline-none cursor-pointer"
                >
                  <option value="All departments">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                </select>

                {/* Period/month filter */}
                <select
                  value={disciplinaryReportPeriod}
                  onChange={(e) => setDisciplinaryReportPeriod(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs font-bold p-2 rounded-xl focus:outline-none cursor-pointer"
                >
                  <option value="All times">All Times</option>
                  <option value="June 2026">June 2026</option>
                  <option value="May 2026">May 2026</option>
                  <option value="April 2026">April 2026</option>
                  <option value="Older Periods">Older Periods</option>
                </select>

                {/* Warning Level filter */}
                <select
                  value={disciplinaryReportLevel}
                  onChange={(e) => setDisciplinaryReportLevel(e.target.value)}
                  className="bg-slate-50 border border-[#b4c3ee] text-[#2f66e0] text-xs font-extrabold p-2 rounded-xl focus:outline-none cursor-pointer"
                >
                  <option value="All levels">All Warning Levels</option>
                  <option value="L1">L1 - Verbal warning</option>
                  <option value="L2">L2 - First written warning</option>
                  <option value="L3">L3 - Second written warning</option>
                  <option value="L4">L4 - Suspension without pay</option>
                  <option value="L5">L5 - Demotion</option>
                  <option value="L6">L6 - Termination</option>
                </select>

                {/* Export button */}
                <button
                  type="button"
                  onClick={() => addToast(`Exported Disciplinary ${disciplinaryReportType === 'detail' ? 'Detailed Logs' : 'Summary Balance'} Report successfully.`, 'success')}
                  className="bg-[#2f66e0] hover:opacity-95 text-white text-xs font-extrabold px-3.5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  <span>Export</span>
                </button>
              </div>

            </div>

            {/* 4. Dynamic Data Area */}
            {disciplinaryReportType === 'detail' ? (
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest">Detailed Disciplinary Incident Logs</h4>
                    <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Chronological warning action register of verified company policy violations</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                    Showing {
                      cases.filter(c => {
                        const matchesDept = disciplinaryReportDept === 'All departments' || c.department === disciplinaryReportDept;
                        const matchesEmp = c.employeeName.toLowerCase().includes(disciplinaryReportEmp.toLowerCase()) || c.employeeId.toLowerCase().includes(disciplinaryReportEmp.toLowerCase());
                        const matchesLevel = disciplinaryReportLevel === 'All levels' || c.warningLevel === disciplinaryReportLevel;
                        
                        let matchesPeriod = true;
                        if (disciplinaryReportPeriod === 'June 2026') matchesPeriod = c.incidentDate.startsWith('2026-06');
                        else if (disciplinaryReportPeriod === 'May 2026') matchesPeriod = c.incidentDate.startsWith('2026-05');
                        else if (disciplinaryReportPeriod === 'April 2026') matchesPeriod = c.incidentDate.startsWith('2026-04');
                        else if (disciplinaryReportPeriod === 'Older Periods') matchesPeriod = !c.incidentDate.startsWith('2026-06') && !c.incidentDate.startsWith('2026-05') && !c.incidentDate.startsWith('2026-04');
                        
                        return matchesDept && matchesEmp && matchesLevel && matchesPeriod;
                      }).length
                    } matching logs
                  </span>
                </div>

                <div className="bg-white border border-slate-100 rounded-xl overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700 min-w-[800px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <th className="p-3 pl-4">Case ID</th>
                        <th className="p-3">Employee</th>
                        <th className="p-3">Violation Details</th>
                        <th className="p-3 text-center">Incident Date</th>
                        <th className="p-3">Level Actioned</th>
                        <th className="p-3">Issued By</th>
                        <th className="p-3 pr-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {cases
                        .filter(c => {
                          const matchesDept = disciplinaryReportDept === 'All departments' || c.department === disciplinaryReportDept;
                          const matchesEmp = c.employeeName.toLowerCase().includes(disciplinaryReportEmp.toLowerCase()) || c.employeeId.toLowerCase().includes(disciplinaryReportEmp.toLowerCase());
                          const matchesLevel = disciplinaryReportLevel === 'All levels' || c.warningLevel === disciplinaryReportLevel;
                          
                          let matchesPeriod = true;
                          if (disciplinaryReportPeriod === 'June 2026') matchesPeriod = c.incidentDate.startsWith('2026-06');
                          else if (disciplinaryReportPeriod === 'May 2026') matchesPeriod = c.incidentDate.startsWith('2026-05');
                          else if (disciplinaryReportPeriod === 'April 2026') matchesPeriod = c.incidentDate.startsWith('2026-04');
                          else if (disciplinaryReportPeriod === 'Older Periods') matchesPeriod = !c.incidentDate.startsWith('2026-06') && !c.incidentDate.startsWith('2026-05') && !c.incidentDate.startsWith('2026-04');
                          
                          return matchesDept && matchesEmp && matchesLevel && matchesPeriod;
                        })
                        .map(item => {
                          let tagStyle = '';
                          if (item.status === 'Pending') tagStyle = 'bg-amber-50 text-amber-700 border-amber-100';
                          else if (item.status === 'Acknowledged') tagStyle = 'bg-blue-50 text-blue-700 border-blue-100';
                          else tagStyle = 'bg-emerald-50 text-emerald-700 border-emerald-100';

                          return (
                            <tr key={item.id} className="hover:bg-slate-50/40">
                              <td className="p-3 pl-4 font-mono text-[10.5px] font-bold text-[#2f66e0]">{item.id}</td>
                              <td className="p-3">
                                <span className="font-bold text-slate-800 block">{item.employeeName}</span>
                                <span className="text-[10px] text-slate-400 font-mono block">{item.employeeId} &bull; {item.department}</span>
                              </td>
                              <td className="p-3">
                                <span className="font-bold text-slate-800 block">{item.reason}</span>
                                <span className="text-[10px] text-slate-400 line-clamp-1 block max-w-sm mt-0.5">{item.description}</span>
                              </td>
                              <td className="p-3 text-center font-mono text-slate-500 font-semibold">{item.incidentDate}</td>
                              <td className="p-3">
                                <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-[10px]">
                                  {item.warningLevel} &bull; {actions.find(a => a.level === item.warningLevel)?.name || 'Warning'}
                                </span>
                              </td>
                              <td className="p-3 text-slate-600 font-bold">{item.actionIssuedBy}</td>
                              <td className="p-3 pr-4 text-right">
                                <span className={`border px-2.5 py-0.5 rounded-md font-extrabold text-[10px] ${tagStyle}`}>
                                  {item.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest">Summary Employee Warning Balance</h4>
                    <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Aggregated warning levels and critical counts of disciplinary action per employee</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                    Showing {summaryRecords.length} staff members
                  </span>
                </div>

                <div className="bg-white border border-slate-100 rounded-xl overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700 min-w-[800px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <th className="p-3 pl-4">Staff Member</th>
                        <th className="p-3">Department Position</th>
                        <th className="p-3 text-center">Tally of Cases</th>
                        <th className="p-3 text-center">Pending Resolution</th>
                        <th className="p-3 font-semibold text-slate-400">Highest Warning Level</th>
                        <th className="p-3 font-semibold text-slate-400">Latest Infraction Type</th>
                        <th className="p-3 pr-4 text-right">Tally Evaluation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {summaryRecords.map(row => {
                        let evaluationBadge = '';
                        let evaluationText = '';
                        if (row.totalCases === 0) {
                          evaluationBadge = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                          evaluationText = 'Clear Record';
                        } else if (['L4', 'L5', 'L6'].includes(row.maxLevel)) {
                          evaluationBadge = 'bg-rose-50 text-rose-700 border-rose-200 font-extrabold';
                          evaluationText = 'Critical warning status!';
                        } else if (row.totalCases >= 2) {
                          evaluationBadge = 'bg-amber-50 text-amber-700 border-amber-200';
                          evaluationText = 'Elevated reprimands';
                        } else {
                          evaluationBadge = 'bg-slate-50 text-slate-600 border-slate-200';
                          evaluationText = 'Single standard warning';
                        }

                        return (
                          <tr key={row.employee.id} className="hover:bg-slate-50/40">
                            <td className="p-3 pl-4">
                              <span className="font-bold text-slate-800 block">{row.employee.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono block">{row.employee.id}</span>
                            </td>
                            <td className="p-3">
                              <span className="font-bold text-slate-700 block">{row.employee.department}</span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">{row.employee.position}</span>
                            </td>
                            <td className="p-3 text-center font-mono font-bold text-slate-800">{row.totalCases}</td>
                            <td className="p-3 text-center font-mono text-amber-600 font-bold">{row.pending}</td>
                            <td className="p-3">
                              {row.maxLevel !== 'None' ? (
                                <span className="bg-slate-100 text-slate-800 font-extrabold px-2 py-0.5 rounded text-[10px]">
                                  {row.maxLevel} — {actions.find(a => a.level === row.maxLevel)?.name || 'Warning'}
                                </span>
                              ) : (
                                <span className="text-slate-400 text-[10.5px] italic">None active</span>
                              )}
                            </td>
                            <td className="p-3">
                              <span className="font-semibold text-slate-700 block">{row.latestInfraction}</span>
                              {row.latestDate !== '-' && <span className="text-[9.5px] text-slate-400 font-mono block mt-0.5">Recorded: {row.latestDate}</span>}
                            </td>
                            <td className="p-3 pr-4 text-right">
                              <span className={`border px-2.5 py-0.5 rounded-md font-extrabold text-[10px] ${evaluationBadge}`}>
                                {evaluationText}
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
        );
      })()}


      {/* ===== MODAL: ADD DISCIPLINARY REASON ===== */}
      {newReasonModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <PlusCircle className="h-4.5 w-4.5 text-[#2f66e0]" />
                <span>Add New Disciplinary Reason</span>
              </h4>
              <button
                onClick={() => setNewReasonModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={handleAddReason} className="space-y-4 font-sans">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Reason Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Failure to report asset damage"
                  value={newReasonName}
                  onChange={(e) => setNewReasonName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold rounded-xl focus:outline-none focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Severity Category</label>
                <select
                  value={newReasonSeverity}
                  onChange={(e) => setNewReasonSeverity(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold rounded-xl focus:outline-none"
                >
                  <option value="Minor">Minor</option>
                  <option value="Major">Major</option>
                  <option value="Gross misconduct">Gross misconduct</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide precise details of the default code infraction..."
                  value={newReasonDesc}
                  onChange={(e) => setNewReasonDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setNewReasonModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2f66e0] hover:opacity-95 rounded-xl cursor-pointer shadow-sm whitespace-nowrap"
                >
                  Save Reason
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== MODAL: ADD DISCIPLINARY ACTION LEVEL ===== */}
      {newActionModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <PlusCircle className="h-4.5 w-4.5 text-[#2f66e0]" />
                <span>Add Warning Parameter</span>
              </h4>
              <button
                onClick={() => setNewActionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={handleAddAction} className="space-y-4 font-sans">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1 col-span-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Level Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. L7"
                    value={newActionLevel}
                    onChange={(e) => setNewActionLevel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold rounded-xl focus:outline-none text-center"
                  />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Action Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Official Reprimand"
                    value={newActionName}
                    onChange={(e) => setNewActionName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Type</label>
                <input
                  type="text"
                  placeholder="e.g. Dismissal / Grade change / Suspension"
                  value={newActionType}
                  onChange={(e) => setNewActionType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pay Impact Level</label>
                <select
                  value={newActionPay}
                  onChange={(e) => setNewActionPay(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold rounded-xl focus:outline-none"
                >
                  <option value="No deduction">No deduction</option>
                  <option value="Partial deduction">Partial deduction</option>
                  <option value="Full deduction">Full deduction</option>
                  <option value="Pay review">Pay review</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description / Details</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Details of warning action parameters..."
                  value={newActionDesc}
                  onChange={(e) => setNewActionDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setNewActionModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2f66e0] hover:opacity-95 rounded-xl cursor-pointer shadow-sm whitespace-nowrap"
                >
                  Create Parameter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ===== MODAL: EDIT DISCIPLINARY REASON ===== */}
      {editingReason && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <Scale className="h-4.5 w-4.5 text-[#2f66e0]" />
                <span>Edit Disciplinary Reason</span>
              </h4>
              <button
                type="button"
                onClick={() => setEditingReason(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50 cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditReason} className="space-y-4 font-sans">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Reason Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unexcused Absence"
                  value={editReasonName}
                  onChange={(e) => setEditReasonName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Severity Category</label>
                <select
                  value={editReasonSeverity}
                  onChange={(e) => setEditReasonSeverity(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold rounded-xl focus:outline-none"
                >
                  <option value="Minor">Minor</option>
                  <option value="Major">Major</option>
                  <option value="Gross misconduct">Gross misconduct</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status</label>
                <select
                  value={editReasonStatus}
                  onChange={(e) => setEditReasonStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold rounded-xl focus:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Details of standard company policy violations..."
                  value={editReasonDesc}
                  onChange={(e) => setEditReasonDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingReason(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2f66e0] hover:opacity-95 rounded-xl cursor-pointer shadow-sm whitespace-nowrap"
                >
                  Save Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== MODAL: EDIT DISCIPLINARY ACTION LEVEL ===== */}
      {editingAction && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <ShieldAlert className="h-4.5 w-4.5 text-[#2f66e0]" />
                <span>Edit Warning Parameter</span>
              </h4>
              <button
                type="button"
                onClick={() => setEditingAction(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50 cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditAction} className="space-y-4 font-sans">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1 col-span-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Level Code</label>
                  <input
                    type="text"
                    disabled
                    value={editActionLevel}
                    className="w-full bg-slate-100 border border-slate-200 p-2 text-xs font-bold rounded-xl text-center text-slate-400 outline-none"
                  />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Action Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Official Reprimand"
                    value={editActionName}
                    onChange={(e) => setEditActionName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Type</label>
                <input
                  type="text"
                  placeholder="e.g. Dismissal / Grade change / Suspension"
                  value={editActionType}
                  onChange={(e) => setEditActionType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pay Impact Level</label>
                <select
                  value={editActionPay}
                  onChange={(e) => setEditActionPay(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold rounded-xl focus:outline-none"
                >
                  <option value="No deduction">No deduction</option>
                  <option value="Partial deduction">Partial deduction</option>
                  <option value="Full deduction">Full deduction</option>
                  <option value="Pay review">Pay review</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description / Details</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Details of warning action parameters..."
                  value={editActionDesc}
                  onChange={(e) => setEditActionDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingAction(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2f66e0] hover:opacity-95 rounded-xl cursor-pointer shadow-sm whitespace-nowrap"
                >
                  Save Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* ===== MODAL: READ EXPLICIT CASE DOSSIER ===== */}
      {viewCaseDetailsModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#2f66e0] bg-blue-50/70 border border-blue-100 px-2.5 py-0.5 rounded-md">
                  Dossier Archive: {viewCaseDetailsModal.id}
                </span>
                <h4 className="text-sm font-extrabold text-slate-800 tracking-tight mt-1.5">
                  Corporate Disciplinary Record
                </h4>
              </div>
              <button
                onClick={() => setViewCaseDetailsModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="text-xs leading-relaxed space-y-4 font-medium text-slate-600">
              
              {/* Employee card overview */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Employee Target</span>
                  <span className="text-xs font-extrabold text-slate-800 block mt-0.5">{viewCaseDetailsModal.employeeName}</span>
                  <span className="text-[10.5px] text-slate-500 block">ID: {viewCaseDetailsModal.employeeId} &bull; Dept: {viewCaseDetailsModal.department}</span>
                </div>
                <div>
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Action Issued By</span>
                  <span className="text-xs font-extrabold text-slate-800 block mt-0.5">{viewCaseDetailsModal.actionIssuedBy}</span>
                  <span className="text-[10.5px] text-slate-500 block">Date of Action: {viewCaseDetailsModal.actionDate}</span>
                </div>
              </div>

              {/* Case particulars */}
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Offence Category</span>
                    <span className="text-[#2f66e0] font-bold block mt-0.5">{viewCaseDetailsModal.reason}</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Incident Date</span>
                    <span className="text-slate-800 font-bold font-mono block mt-0.5">{viewCaseDetailsModal.incidentDate}</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Timing Scope</span>
                    <span className="text-slate-800 font-bold font-mono block mt-0.5">{viewCaseDetailsModal.fromTime} - {viewCaseDetailsModal.toTime}</span>
                  </div>
                </div>

                <div className="border-t border-slate-50 pt-3">
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Location of Infraction</span>
                  <span className="text-slate-700 font-semibold block mt-0.5">{viewCaseDetailsModal.location}</span>
                </div>

                <div className="border-t border-slate-50 pt-3">
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase block font-sans">Behavioral Log Description</span>
                  <p className="text-slate-700 leading-relaxed font-semibold mt-1 p-3 bg-red-50/35 border border-red-100' rounded-xl">
                    {viewCaseDetailsModal.description}
                  </p>
                </div>

                {viewCaseDetailsModal.witnesses.length > 0 && (
                  <div className="border-t border-slate-50 pt-3">
                    <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Registered Witness List</span>
                    <span className="text-slate-700 block mt-0.5">{viewCaseDetailsModal.witnesses.join(', ')}</span>
                  </div>
                )}

                <div className="border-t border-slate-50 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Warning Level Applied</span>
                    <span className="bg-amber-500/10 text-amber-800 border-amber-100 font-extrabold px-2 py-0.5 rounded-md inline-block mt-1 text-[10.5px]">
                      {viewCaseDetailsModal.warningLevel} &mdash; {actions.find(a => a.level === viewCaseDetailsModal.warningLevel)?.name || 'Warning'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9.5px] font-bold text-slate-400 uppercase block">If Repeated Next Impact</span>
                    <span className="text-red-600 font-bold block mt-1">{viewCaseDetailsModal.repeatedAction}</span>
                  </div>
                </div>

                <div className="border-t border-slate-50 pt-3">
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Statement of Expectation &amp; Remediation</span>
                  <p className="text-slate-700 italic block mt-1 font-semibold">{viewCaseDetailsModal.futureExpectation}</p>
                </div>
              </div>

              {/* Status control */}
              <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">Update Dossier Resolution:</span>
                  <div className="flex gap-1">
                    {(['Pending', 'Acknowledged', 'Closed'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          updateCaseStatus(viewCaseDetailsModal.id, st);
                          setViewCaseDetailsModal(prev => prev ? { ...prev, status: st } : null);
                        }}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold transition-all border cursor-pointer ${
                          viewCaseDetailsModal.status === st
                            ? 'bg-[#2f66e0] text-white border-[#2f66e0]'
                            : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setViewCaseDetailsModal(null)}
                  className="bg-slate-900 text-white font-extrabold text-xs px-4.5 py-2.5 rounded-xl transition-all cursor-pointer self-end sm:self-auto"
                >
                  Close Dossier File
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

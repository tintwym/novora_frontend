import { useState, type FormEvent } from 'react'
import {
  Search,
  ChevronDown,
  Plus,
  FileText,
  CheckCircle,
  FileSpreadsheet,
  Download,
  Trash2,
  X,
  Clock,
  Settings,
  Users,
  Network,
} from 'lucide-react'
import { showActionToast } from '../../utils/actionToast'
import type { ModuleEmployee } from '../../types/moduleEmployee'

type LeaveTabProps = {
  employees: ModuleEmployee[]
}

type LeaveSubTab =
  | 'Leave type'
  | 'Leave policy'
  | 'Leave attachment'
  | 'Leave request'
  | 'Request for others'
  | 'Leave approval'
  | 'Leave history'
  | 'Employee leave profile'
  | 'Leave reports';

interface LeaveType {
  id: string;
  name: string;
  color: string;
  paid: boolean;
  deductionRate: string;
  hourBased: boolean;
  attachmentReq: boolean;
  status: 'Active' | 'Inactive';
}

interface LeavePolicy {
  id: string;
  type: string;
  allowDays: string;
  accrual: string;
  carryForward: string;
  applicable: string;
  autoAttach: string;
  minWorkingDays: string;
  serviceBonus: { range: string; bonus: string }[];
  holidayRules: { key: string; value: string }[];
}

interface LeaveAttachmentRecord {
  id: string;
  employeeId: string;
  name: string;
  dept: string;
  type: string;
  entitlement: string;
  attached: boolean;
  activation: 'Auto' | 'Manual';
}

interface LeaveRequestRecord {
  id: string;
  employeeId: string;
  name: string;
  dept: string;
  type: string;
  dateStr: string;
  days: number;
  reason: string;
  approvedBy: { name: string; status: 'approved' | 'rejected' | 'pending'; color: string }[];
  status: 'Pending' | 'Accepted' | 'Denied' | 'Waiting for file';
  fromDate: string;
  toDate: string;
}

export function LeaveTab({ employees }: LeaveTabProps) {
  const addToast = (text: string, type?: 'success' | 'loading' | 'error' | 'info') => {
    showActionToast(text, type)
  }

  const [activeSubTab, setActiveSubTab] = useState<LeaveSubTab>('Leave type');

  // Year & Department Header Filter States
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [selectedDept, setSelectedDept] = useState<string>('All departments');
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);

  // Leave types state
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([
    { id: 'LT01', name: 'Annual leave', color: 'bg-blue-500 text-blue-600', paid: true, deductionRate: 'No deduction', hourBased: false, attachmentReq: false, status: 'Active' },
    { id: 'LT02', name: 'Medical leave', color: 'bg-emerald-500 text-emerald-600', paid: true, deductionRate: 'No deduction', hourBased: false, attachmentReq: true, status: 'Active' },
    { id: 'LT03', name: 'Emergency leave', color: 'bg-amber-500 text-amber-600', paid: true, deductionRate: 'No deduction', hourBased: false, attachmentReq: false, status: 'Active' },
    { id: 'LT04', name: 'Unpaid leave', color: 'bg-rose-500 text-rose-600', paid: false, deductionRate: 'Normal rate', hourBased: false, attachmentReq: false, status: 'Active' },
    { id: 'LT05', name: 'Replacement leave', color: 'bg-violet-500 text-[#8b5cf6]', paid: true, deductionRate: 'No deduction', hourBased: false, attachmentReq: false, status: 'Active' },
    { id: 'LT06', name: 'Maternity leave', color: 'bg-pink-500 text-pink-600', paid: true, deductionRate: 'No deduction', hourBased: false, attachmentReq: true, status: 'Active' },
    { id: 'LT07', name: 'Hour leave', color: 'bg-teal-500 text-teal-600', paid: true, deductionRate: 'No deduction', hourBased: true, attachmentReq: false, status: 'Active' }
  ]);

  // Leave type search & filters
  const [typeSearch, setTypeSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All types');
  const [typeFilterDropdown, setTypeFilterDropdown] = useState(false);

  // New leave type Modal states
  const [newTypeModal, setNewTypeModal] = useState(false);
  const [newTypeData, setNewTypeData] = useState({
    name: '',
    color: 'bg-blue-500',
    paid: true,
    deductionRate: 'No deduction',
    hourBased: false,
    attachmentReq: false,
    status: 'Active' as 'Active' | 'Inactive'
  });

  // Edit leave type Modal states
  const [editTypeModal, setEditTypeModal] = useState(false);
  const [editingType, setEditingType] = useState<LeaveType | null>(null);

  // New leave policy Modal states
  const [newPolicyModal, setNewPolicyModal] = useState(false);
  const [newPolicyData, setNewPolicyData] = useState({
    type: 'Annual leave',
    allowDays: '12 days / year',
    accrual: 'Monthly prorate',
    carryForward: '5 days max',
    applicable: 'All confirmed employees',
    autoAttach: '12 months',
    minWorkingDays: '15 days',
    serviceBonusSelected: true,
    serviceBonusRange: '3-5 years service',
    serviceBonusValue: '+2 days',
    ruleKey: 'Count off / holidays',
    ruleVal: 'Excluded'
  });

  // Reports states for Leave Tab
  const [leaveReportType, setLeaveReportType] = useState<'detail' | 'summary'>('detail');
  const [leaveReportMonth, setLeaveReportMonth] = useState('May 2026');
  const [leaveReportsFilterDept, setLeaveReportsFilterDept] = useState('All departments');
  const [leaveReportsFilterEmp, setLeaveReportsFilterEmp] = useState('');

  const [leaveReportsRows, _setLeaveReportsRows] = useState([
    { id: 'REP01', employeeId: 'EMP-001', name: 'Sarah Lim', dept: 'Engineering', type: 'Annual leave', days: 3, fromDate: '2026-05-12', toDate: '2026-05-14', approvedBy: 'David Ng', status: 'Approved', paid: 'Yes', rate: '100% payout' },
    { id: 'REP02', employeeId: 'EMP-002', name: 'Raj Kumar', dept: 'Engineering', type: 'Medical leave', days: 1, fromDate: '2026-05-02', toDate: '2026-05-02', approvedBy: 'David Ng', status: 'Approved', paid: 'Yes', rate: 'Medical allowance' },
    { id: 'REP03', employeeId: 'EMP-003', name: 'Maya Tan', dept: 'HR', type: 'Emergency leave', days: 1, fromDate: '2026-04-28', toDate: '2026-04-28', approvedBy: 'Nina Reza', status: 'Approved', paid: 'Yes', rate: '100% payout' },
    { id: 'REP04', employeeId: 'EMP-004', name: 'Ahmad L', dept: 'Operations', type: 'Unpaid leave', days: 1, fromDate: '2026-05-09', toDate: '2026-05-09', approvedBy: 'Malik Said', status: 'Approved', paid: 'No', rate: '1.0x day deducted' },
    { id: 'REP05', employeeId: 'EMP-005', name: 'Nadia Chen', dept: 'Marketing', type: 'Annual leave', days: 6, fromDate: '2026-05-20', toDate: '2026-05-25', approvedBy: 'Kevin Lim', status: 'Approved', paid: 'Yes', rate: '100% payout' },
    { id: 'REP06', employeeId: 'EMP-006', name: 'Jonathan Goh', dept: 'Finance', type: 'Compassionate leave', days: 3, fromDate: '2026-05-15', toDate: '2026-05-17', approvedBy: 'Shirley Teh', status: 'Approved', paid: 'Yes', rate: 'Compassionate clause' },
    { id: 'REP07', employeeId: 'EMP-007', name: 'Elena Rostova', dept: 'Operations', type: 'Medical leave', days: 2, fromDate: '2026-05-26', toDate: '2026-05-27', approvedBy: 'Malik Said', status: 'Approved', paid: 'Yes', rate: 'Medical allowance' },
    { id: 'REP08', employeeId: 'EMP-008', name: 'Tariq Al-Mansoor', dept: 'Engineering', type: 'Replacement leave', days: 1, fromDate: '2026-05-05', toDate: '2026-05-05', approvedBy: 'David Ng', status: 'Approved', paid: 'Yes', rate: 'FOT comp clause' },
  ]);

  const [leaveSummaryRows, _setLeaveSummaryRows] = useState([
    { employeeId: 'EMP-001', name: 'Sarah Lim', dept: 'Engineering', annual: 5, sick: 0, unpaid: 0, total: 5, balance: '11 days' },
    { employeeId: 'EMP-002', name: 'Raj Kumar', dept: 'Engineering', annual: 2, sick: 4, unpaid: 1, total: 7, balance: '14 days' },
    { employeeId: 'EMP-003', name: 'Maya Tan', dept: 'HR', annual: 0, sick: 1, unpaid: 0, total: 1, balance: '16 days' },
    { employeeId: 'EMP-004', name: 'Ahmad L', dept: 'Operations', annual: 4, sick: 2, unpaid: 2, total: 8, balance: '12 days' },
    { employeeId: 'EMP-005', name: 'Nadia Chen', dept: 'Marketing', annual: 6, sick: 0, unpaid: 0, total: 6, balance: '10 days' },
    { employeeId: 'EMP-006', name: 'Jonathan Goh', dept: 'Finance', annual: 1, sick: 0, unpaid: 0, total: 1, balance: '15 days' },
    { employeeId: 'EMP-007', name: 'Elena Rostova', dept: 'Operations', annual: 3, sick: 2, unpaid: 0, total: 5, balance: '13 days' },
    { employeeId: 'EMP-008', name: 'Tariq Al-Mansoor', dept: 'Engineering', annual: 0, sick: 0, unpaid: 0, total: 0, balance: '16 days' },
  ]);

  const handleCreateLeavePolicy = (e: FormEvent) => {
    e.preventDefault();
    const id = `POL0${leavePolicies.length + 1}`;
    const newPolicy: LeavePolicy = {
      id,
      type: newPolicyData.type,
      allowDays: newPolicyData.allowDays,
      accrual: newPolicyData.accrual,
      carryForward: newPolicyData.carryForward,
      applicable: newPolicyData.applicable,
      autoAttach: newPolicyData.autoAttach,
      minWorkingDays: newPolicyData.minWorkingDays,
      serviceBonus: newPolicyData.serviceBonusSelected ? [{ range: newPolicyData.serviceBonusRange, bonus: newPolicyData.serviceBonusValue }] : [],
      holidayRules: [{ key: newPolicyData.ruleKey, value: newPolicyData.ruleVal }]
    };
    setLeavePolicies([...leavePolicies, newPolicy]);
    setNewPolicyModal(false);
    addToast(`New Leave Policy created successfully for "${newPolicyData.type}"`, 'success');
  };

  const handleDeletePolicy = (id: string, type: string) => {
    setLeavePolicies(prev => prev.filter(p => p.id !== id));
    addToast(`Deleted policy for "${type}"`, 'info');
  };

  // Leave policies state
  const [leavePolicies, setLeavePolicies] = useState<LeavePolicy[]>([
    {
      id: 'POL01',
      type: 'Annual leave',
      allowDays: '16 days / year',
      accrual: 'Monthly prorate',
      carryForward: '8 days max',
      applicable: 'All confirmed employees',
      autoAttach: '12 months',
      minWorkingDays: '15 days',
      serviceBonus: [
        { range: '3-5 years service', bonus: '+2 days' },
        { range: '5-10 years service', bonus: '+4 days' },
        { range: '10+ years service', bonus: '+6 days' }
      ],
      holidayRules: [
        { key: 'Count off / holidays', value: 'Excluded' },
        { key: 'Leave before public holiday', value: 'Counted' },
        { key: 'Leave after public holiday', value: 'Counted' },
        { key: 'Not allow combination with', value: 'Unpaid leave' }
      ]
    },
    {
      id: 'POL02',
      type: 'Medical leave',
      allowDays: '14 days / year',
      accrual: 'Full upfront',
      carryForward: 'Not allowed',
      applicable: 'All active employees',
      autoAttach: 'On join date',
      minWorkingDays: 'N/A',
      serviceBonus: [],
      holidayRules: [
        { key: 'Attachment required', value: 'MC / Hospital cert.' },
        { key: 'Auto attach', value: 'On join date' },
        { key: 'Compensation allowance', value: 'Based on salary' }
      ]
    },
    {
      id: 'POL03',
      type: 'Emergency & unpaid policy',
      allowDays: '3 days / year',
      accrual: 'Full upfront',
      carryForward: 'Not allowed',
      applicable: 'All employees',
      autoAttach: 'Immediate',
      minWorkingDays: 'N/A',
      serviceBonus: [],
      holidayRules: [
        { key: 'Emergency - allow days', value: '3 days / year' },
        { key: 'Emergency - accrual', value: 'Full upfront' },
        { key: 'Unpaid - deduction rate', value: 'Normal rate' },
        { key: 'Probation employees', value: 'Medical only' },
        { key: 'Contract employees', value: 'Annual + Medical' }
      ]
    }
  ]);

  // Leave attachment records state
  const [attachmentRecords, setAttachmentRecords] = useState<LeaveAttachmentRecord[]>([
    { id: 'ATT01', employeeId: 'EMP-001', name: 'Sarah Lim', dept: 'Engineering', type: 'Maternity leave', entitlement: '60 days', attached: false, activation: 'Manual' },
    { id: 'ATT02', employeeId: 'EMP-002', name: 'Raj Kumar', dept: 'Engineering', type: 'Annual leave', entitlement: '16 days', attached: true, activation: 'Auto' },
    { id: 'ATT03', employeeId: 'EMP-003', name: 'Maya Tan', dept: 'HR', type: 'Replacement leave', entitlement: '2 days', attached: false, activation: 'Manual' },
    { id: 'ATT04', employeeId: 'EMP-004', name: 'Ahmad L', dept: 'Operations', type: 'Medical leave', entitlement: '14 days', attached: true, activation: 'Auto' },
    { id: 'ATT05', employeeId: 'EMP-005', name: 'Nadia Chen', dept: 'Marketing', type: 'Maternity leave', entitlement: '60 days', attached: false, activation: 'Manual' }
  ]);

  const [selectedAttachments, setSelectedAttachments] = useState<string[]>([]);

  // Requests state
  const [requests, setRequests] = useState<LeaveRequestRecord[]>([
    { id: 'REQ01', employeeId: 'EMP-001', name: 'Sarah Lim', dept: 'Engineering', type: 'Annual leave', dateStr: '12-14 May', days: 3, reason: 'Family trip', approvedBy: [{ name: 'David Ng', status: 'pending', color: 'bg-rose-500' }, { name: 'Ahmad Wahid', status: 'pending', color: 'bg-slate-400' }], status: 'Pending', fromDate: '2026-05-12', toDate: '2026-05-14' },
    { id: 'REQ02', employeeId: 'EMP-002', name: 'Raj Kumar', dept: 'Engineering', type: 'Medical leave', dateStr: '2 May', days: 1, reason: 'Fever', approvedBy: [{ name: 'David Ng', status: 'approved', color: 'bg-emerald-500' }], status: 'Accepted', fromDate: '2026-05-02', toDate: '2026-05-02' },
    { id: 'REQ03', employeeId: 'EMP-003', name: 'Maya Tan', dept: 'HR', type: 'Emergency leave', dateStr: '28 Apr', days: 1, reason: 'Family emergency', approvedBy: [{ name: 'Nina Reza', status: 'pending', color: 'bg-rose-500' }], status: 'Pending', fromDate: '2026-04-28', toDate: '2026-04-28' },
    { id: 'REQ04', employeeId: 'EMP-005', name: 'Nadia Chen', dept: 'Marketing', type: 'Annual leave', dateStr: '5-6 May', days: 2, reason: 'Personal holiday', approvedBy: [{ name: 'Kevin Lim', status: 'rejected', color: 'bg-slate-900' }], status: 'Denied', fromDate: '2026-05-05', toDate: '2026-05-06' },
    { id: 'REQ05', employeeId: 'EMP-004', name: 'Ahmad L', dept: 'Operations', type: 'Unpaid leave', dateStr: '9 May', days: 1, reason: 'Extended rest', approvedBy: [{ name: 'Malik Said', status: 'pending', color: 'bg-rose-500' }], status: 'Pending', fromDate: '2026-05-09', toDate: '2026-05-09' },
    { id: 'REQ06', employeeId: 'EMP-002', name: 'Raj Kumar', dept: 'Engineering', type: 'Medical leave', dateStr: '15 Jun', days: 1, reason: 'Clinic appointment', approvedBy: [], status: 'Waiting for file', fromDate: '2026-06-15', toDate: '2026-06-15' }
  ]);

  // Request form state (By Day)
  const [reqFormType, setReqFormType] = useState<'day' | 'hour'>('day');
  const [reqType, setReqType] = useState('Annual leave (12 days remaining)');
  const [reqFromDate, setReqFromDate] = useState('2026-05-12');
  const [reqToDate, setReqToDate] = useState('2026-05-14');
  const [reqReason, setReqReason] = useState('Reason for leave request...');
  const [reqNotify, setReqNotify] = useState(true);
  const [firstDayHalf, setFirstDayHalf] = useState('Full day');
  const [lastDayHalf, setLastDayHalf] = useState('Full day');

  // Request for others form state
  const [rfoEmployee, setRfoEmployee] = useState('');
  const [rfoType, setRfoType] = useState('Annual leave');
  const [rfoFromDate, setRfoFromDate] = useState('2026-05-03');
  const [rfoToDate, setRfoToDate] = useState('2026-05-05');
  const [rfoSession, setRfoSession] = useState('Full day');
  const [rfoReason, setRfoReason] = useState('Reason for leave on behalf...');
  const [rfoNotify, setRfoNotify] = useState(true);

  // Employee profile view state
  const [profileSelectedEmpId, setProfileSelectedEmpId] = useState('EMP-001');

  // Filter and searches
  const [searchHistory, setSearchHistory] = useState('');
  const [_historyStatusFilter, _setHistoryStatusFilter] = useState('All status');
  const [historyTypeFilter, setHistoryTypeFilter] = useState('All types');

  // Tab count
  const pendingCount = requests.filter(r => r.status === 'Pending').length;

  // Selected employee metadata
  const selectedProfileEmp = employees.find(e => e.id === profileSelectedEmpId) || {
    id: 'EMP-0021',
    name: 'Sarah Lim Wei Ling',
    department: 'Engineering' as const,
    position: 'Senior Developer',
    employmentStatus: 'Permanent' as const,
    status: 'Active' as const,
    joinDate: '12 Jan 2021',
  };

  const handleCreateLeaveType = (e: FormEvent) => {
    e.preventDefault();
    const id = `LT0${leaveTypes.length + 1}`;
    const newType: LeaveType = {
      id,
      name: newTypeData.name,
      color: `${newTypeData.color} text-${newTypeData.color.split('-')[1]}-600`,
      paid: newTypeData.paid,
      deductionRate: newTypeData.deductionRate,
      hourBased: newTypeData.hourBased,
      attachmentReq: newTypeData.attachmentReq,
      status: newTypeData.status
    };
    setLeaveTypes([...leaveTypes, newType]);
    setNewTypeModal(false);
    addToast(`Successfully configured new Leave Type: "${newTypeData.name}"`, 'success');
    setNewTypeData({
      name: '',
      color: 'bg-blue-500',
      paid: true,
      deductionRate: 'No deduction',
      hourBased: false,
      attachmentReq: false,
      status: 'Active'
    });
  };

  const handleEditLeaveType = (e: FormEvent) => {
    e.preventDefault();
    if (!editingType) return;
    setLeaveTypes(prev => prev.map(t => t.id === editingType.id ? editingType : t));
    setEditTypeModal(false);
    addToast(`Leave Type configuration successfully revised for "${editingType.name}"`, 'success');
    setEditingType(null);
  };

  const handleDeleteLeaveType = (id: string, name: string) => {
    setLeaveTypes(prev => prev.filter(t => t.id !== id));
    addToast(`Deleted Leave Type: "${name}"`, 'info');
  };

  const calculateDays = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return 1;
    const diffTime = Math.abs(e.getTime() - s.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleSelfRequestSubmit = (e: FormEvent) => {
    e.preventDefault();
    const days = calculateDays(reqFromDate, reqToDate);
    const formattedFrom = new Date(reqFromDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const formattedTo = new Date(reqToDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const dateStr = formattedFrom === formattedTo ? formattedFrom : `${formattedFrom}-${formattedTo}`;

    const newReq: LeaveRequestRecord = {
      id: `REQ${requests.length + 1}`,
      employeeId: 'EMP-0285', // Self ID or active user profile
      name: 'Sarah Lim',
      dept: 'Engineering',
      type: reqType.split(' ')[0],
      dateStr,
      days,
      reason: reqReason,
      approvedBy: [{ name: 'David Ng', status: 'pending', color: 'bg-rose-500' }],
      status: 'Pending',
      fromDate: reqFromDate,
      toDate: reqToDate
    };

    setRequests([newReq, ...requests]);
    addToast('New leave request submitted for review', 'success');
  };

  const handleRequestForOthersSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!rfoEmployee) {
      addToast('Please select an employee record first', 'error');
      return;
    }
    const empObj = employees.find(emp => emp.id === rfoEmployee);
    const days = calculateDays(rfoFromDate, rfoToDate);
    const formattedFrom = new Date(rfoFromDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const formattedTo = new Date(rfoToDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const dateStr = formattedFrom === formattedTo ? formattedFrom : `${formattedFrom}-${formattedTo}`;

    const newReq: LeaveRequestRecord = {
      id: `REQ${requests.length + 1}`,
      employeeId: rfoEmployee,
      name: empObj ? empObj.name : 'Unknown Employee',
      dept: empObj ? empObj.department : 'Operations',
      type: rfoType,
      dateStr,
      days,
      reason: rfoReason,
      approvedBy: [{ name: 'Corporate Admin', status: 'approved', color: 'bg-emerald-500' }],
      status: 'Accepted',
      fromDate: rfoFromDate,
      toDate: rfoToDate
    };

    setRequests([newReq, ...requests]);
    addToast(`On-behalf Leave request submitted for ${newReq.name}`, 'success');
  };

  const handleApprove = (id: string, name: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Accepted', approvedBy: r.approvedBy.map(ap => ap.name === 'David Ng' ? { ...ap, status: 'approved', color: 'bg-emerald-500' } : ap) } : r));
    addToast(`Leave request from ${name} approved successfully`, 'success');
  };

  const handleDeny = (id: string, name: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Denied', approvedBy: r.approvedBy.map(ap => ap.name === 'David Ng' ? { ...ap, status: 'rejected', color: 'bg-slate-900' } : ap) } : r));
    addToast(`Leave request from ${name} set to: Denied`, 'info');
  };

  const toggleAttachmentSelection = (id: string) => {
    setSelectedAttachments(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectAllAttachments = () => {
    if (selectedAttachments.length === attachmentRecords.length) {
      setSelectedAttachments([]);
    } else {
      setSelectedAttachments(attachmentRecords.map(a => a.id));
    }
  };

  const handleManualAttach = (id: string) => {
    setAttachmentRecords(prev => prev.map(a => a.id === id ? { ...a, attached: true } : a));
    addToast('Document attachment attached successfully', 'success');
  };

  return (
    <div id="leave-module-root" className="space-y-6">

      {/* Upper Navigation sub-menus completely aligned with Actions exactly like Attendance Management */}
      <div id="leave-module-navigator" className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-200/85 pb-4 gap-4">
        <div id="leave-navigation-tabs" className="flex items-center gap-2 select-none overflow-x-auto w-full lg:w-auto scrollbar-none pb-1 lg:pb-0">
          {(
            [
              'Leave type',
              'Leave policy',
              'Leave attachment',
              'Leave request',
              'Request for others',
              'Leave approval',
              'Leave history',
              'Employee leave profile',
              'Leave reports'
            ] as LeaveSubTab[]
          ).map((tab) => {
            const isActive = activeSubTab === tab;
            const isApproval = tab === 'Leave approval';
            return (
              <button
                id={`tab-${tab.toLowerCase().replace(/\s+/g, '-')}`}
                key={tab}
                type="button"
                onClick={() => setActiveSubTab(tab)}
                className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all shrink-0 relative cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'text-[#2f66e0] bg-[#2f66e0]/10 border border-[#2f66e0]/15 font-extrabold'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
                }`}
              >
                <span>{tab}</span>
                {isApproval && pendingCount > 0 && (
                  <span className="ml-0.5 inline-flex items-center justify-center min-w-[1.15rem] h-[1.15rem] px-1 rounded-full bg-amber-500 text-white text-[9px] font-black leading-none tabular-nums">
                    {pendingCount}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#2f66e0] rounded-sm" />
                )}
              </button>
            );
          })}
        </div>

        {/* Outer Header Actions aligned elegantly with selectors & primary action triggers */}
        <div id="leave-upper-actions" className="flex items-center gap-3 shrink-0">
          {/* Year Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => { setYearDropdownOpen(!yearDropdownOpen); setDeptDropdownOpen(false); }}
              className="h-9 bg-white border border-slate-200 text-slate-700 text-xs font-bold px-3 rounded-xl inline-flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-all whitespace-nowrap shrink-0"
            >
              <span className="whitespace-nowrap">{selectedYear}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            </button>
            {yearDropdownOpen && (
              <div className="absolute right-0 mt-1.5 bg-white border border-slate-100 rounded-xl shadow-xl w-32 py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                {['2025', '2026', '2027'].map(year => (
                  <button
                    key={year}
                    onClick={() => { setSelectedYear(year); setYearDropdownOpen(false); addToast(`Fiscal view target changed to ${year}`, 'info'); }}
                    className="w-full text-left text-xs font-bold px-4 py-2 hover:bg-slate-50 text-slate-700"
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Department Filter */}
          <div className="relative">
            <button
              type="button"
              onClick={() => { setDeptDropdownOpen(!deptDropdownOpen); setYearDropdownOpen(false); }}
              className="h-9 bg-white border border-slate-200 text-slate-700 text-xs font-bold px-3 rounded-xl inline-flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-all whitespace-nowrap shrink-0"
            >
              <span className="whitespace-nowrap">{selectedDept}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            </button>
            {deptDropdownOpen && (
              <div className="absolute right-0 mt-1.5 bg-white border border-slate-100 rounded-xl shadow-xl w-48 py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                {['All departments', 'Engineering', 'HR', 'Finance', 'Marketing', 'Operations'].map(dept => (
                  <button
                    key={dept}
                    onClick={() => { setSelectedDept(dept); setDeptDropdownOpen(false); addToast(`Leave database filtered by ${dept}`, 'info'); }}
                    className="w-full text-left text-xs font-bold px-4 py-2 hover:bg-slate-50 text-slate-700"
                  >
                    {dept}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export Button */}
          <button
            type="button"
            onClick={() => addToast('Exporting corporate leave report...', 'loading')}
            className="h-9 bg-white border border-slate-200 text-slate-700 text-xs font-bold px-4 rounded-xl inline-flex items-center gap-2 hover:bg-slate-50 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <Download className="h-4 w-4 shrink-0" />
            <span>Export</span>
          </button>

          {/* New Leave Request Button */}
          <button
            onClick={() => { setActiveSubTab('Leave request'); addToast('Loading leave application drawer', 'info'); }}
            className="bg-[#2f66e0] text-white hover:opacity-95 text-xs font-extrabold px-4.5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Plus className="h-4 w-4 stroke-[3px]" />
            <span>New Leave Request</span>
          </button>
        </div>
      </div>

      {/* Content Rendering for Each Sub-tab */}

      {/* 1. LEAVE TYPE SUB-TAB */}
      {activeSubTab === 'Leave type' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3 flex-1 max-w-lg">
              <div className="relative flex-1">
                <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search leave type..."
                  value={typeSearch}
                  onChange={(e) => setTypeSearch(e.target.value)}
                  className="w-full text-xs text-slate-700 bg-white border border-slate-200 pl-10 pr-4 py-2 rounded-xl focus:border-slate-300 focus:outline-none"
                />
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setTypeFilterDropdown(!typeFilterDropdown)}
                  className="bg-white border border-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl inline-flex items-center gap-1.5 select-none cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span className="whitespace-nowrap">{typeFilter}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                </button>
                {typeFilterDropdown && (
                  <div className="absolute left-0 mt-1.5 bg-white border border-slate-100 rounded-xl shadow-xl w-36 py-1 z-20">
                    {['All types', 'Paid', 'Unpaid'].map(t => (
                      <button
                        key={t}
                        onClick={() => { setTypeFilter(t); setTypeFilterDropdown(false); }}
                        className="w-full text-left text-xs font-bold px-4 py-2 hover:bg-slate-50 text-slate-700"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => setNewTypeModal(true)}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              + New leave type
            </button>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs text-slate-600">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4 pl-6">Leave type name</th>
                  <th className="p-4">Paid?</th>
                  <th className="p-4">Deduction rate</th>
                  <th className="p-4">Hour based</th>
                  <th className="p-4">Attachment req.</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaveTypes
                  .filter(t => t.name.toLowerCase().includes(typeSearch.toLowerCase()))
                  .filter(t => {
                    if (typeFilter === 'Paid') return t.paid;
                    if (typeFilter === 'Unpaid') return !t.paid;
                    return true;
                  })
                  .map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/50">
                      <td className="p-4 pl-6 font-bold text-slate-800">
                        <div className="inline-flex items-center gap-2.5">
                          <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${t.color.split(' ')[0]}`} />
                          <span>{t.name}</span>
                        </div>
                      </td>
                      <td className="p-4 font-bold">
                        <span className={`px-2 py-0.5 rounded-md text-[10.5px] ${
                          t.paid ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/50' : 'bg-red-50 text-red-700 border border-red-100/50'
                        }`}>
                          {t.paid ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-slate-500">{t.deductionRate}</td>
                      <td className="p-4 font-bold">
                        <span className={`px-2 py-0.5 rounded-md text-[10.5px] ${
                          t.hourBased ? 'bg-blue-50 text-blue-700 border border-blue-100/50' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {t.hourBased ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="p-4 font-semibold">
                        <span className={`px-2 py-0.5 rounded-md text-[10.5px] ${
                          t.attachmentReq ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {t.attachmentReq ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100/50 px-2 py-0.5 rounded-md text-[10px] font-bold">
                          {t.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-3 text-slate-400">
                          <button
                            onClick={() => { setEditingType(t); setEditTypeModal(true); }}
                            className="hover:text-slate-700 font-extrabold cursor-pointer"
                          >
                            Edit
                          </button>
                          <span>&bull;</span>
                          <button
                            onClick={() => handleDeleteLeaveType(t.id, t.name)}
                            className="hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. LEAVE POLICY SUB-TAB */}
      {activeSubTab === 'Leave policy' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500">Filters:</span>
              <span className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">All leave types</span>
              <span className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">All departments</span>
            </div>
            <button
              onClick={() => setNewPolicyModal(true)}
              className="bg-[#2f66e0] hover:opacity-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>New Policy</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leavePolicies.map((policy) => (
              <div key={policy.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4 relative group hover:shadow-sm transition-all duration-250">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">{policy.type} policy</h3>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-md text-[10px] font-bold">Yearly</span>
                    <button
                      onClick={() => handleDeletePolicy(policy.id, policy.type)}
                      title="Delete Policy"
                      className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-all cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Allow days</span>
                    <span className="text-slate-700 font-extrabold">{policy.allowDays}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Accrual method</span>
                    <span className="text-slate-700 font-semibold">{policy.accrual}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Carry forward</span>
                    <span className="text-slate-700 font-semibold">{policy.carryForward}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Applicable to</span>
                    <span className="text-slate-700 font-semibold">{policy.applicable}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Auto attach</span>
                    <span className="text-slate-700 font-semibold">{policy.autoAttach}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pb-1">
                    <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Minimum working days</span>
                    <span className="text-slate-700 font-semibold">{policy.minWorkingDays}</span>
                  </div>

                  {policy.serviceBonus && policy.serviceBonus.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-extrabold text-blue-600 block uppercase tracking-wider">Service leave (additional)</span>
                      {policy.serviceBonus.map((b, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <span className="text-slate-600 font-medium">{b.range}</span>
                          <span className="text-slate-800 font-bold">{b.bonus}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {policy.holidayRules && policy.holidayRules.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-extrabold text-indigo-600 block uppercase tracking-wider">Rules &amp; Holiday conditions</span>
                      {policy.holidayRules.map((v, idx) => {
                        const isRedAlert = v.key === 'Attachment required';
                        return (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="text-slate-600 font-medium">{v.key}</span>
                            <span className={`font-bold ${isRedAlert ? 'text-red-500' : 'text-slate-700'}`}>{v.value}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. LEAVE ATTACHMENT SUB-TAB */}
      {activeSubTab === 'Leave attachment' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500">Batch selection:</span>
              <button
                onClick={selectAllAttachments}
                className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 whitespace-nowrap"
              >
                {selectedAttachments.length === attachmentRecords.length ? 'Deselect all' : 'Select all'}
              </button>
              <button
                onClick={() => {
                  if (selectedAttachments.length === 0) {
                    addToast('No selected files for batch processing', 'error');
                  } else {
                    addToast(`Manual attachment complete for ${selectedAttachments.length} records`, 'success');
                  }
                }}
                className="bg-[#2f66e0] text-white hover:opacity-95 text-xs font-bold px-4.5 py-1.5 rounded-xl cursor-pointer"
              >
                Manual attach
              </button>
            </div>

            <div className="flex gap-2">
              <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500">All leave types</span>
              <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500">All status</span>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs text-slate-600">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4 pl-6 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={selectedAttachments.length === attachmentRecords.length}
                      onChange={selectAllAttachments}
                      className="rounded border-slate-300 text-[#2f66e0] focus:ring-[#2f66e0]"
                    />
                  </th>
                  <th className="p-4">Employee</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Leave type</th>
                  <th className="p-4">Entitlement</th>
                  <th className="p-4">Attached?</th>
                  <th className="p-4">Activation</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attachmentRecords.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/50">
                    <td className="p-4 pl-6 text-center">
                      <input
                        type="checkbox"
                        checked={selectedAttachments.includes(a.id)}
                        onChange={() => toggleAttachmentSelection(a.id)}
                        className="rounded border-slate-300 text-[#2f66e0] focus:ring-[#2f66e0]"
                      />
                    </td>
                    <td className="p-4 font-bold text-slate-800">{a.name}</td>
                    <td className="p-4 font-semibold text-slate-500">{a.dept}</td>
                    <td className="p-4 font-medium">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-indigo-500" />
                        <span>{a.type}</span>
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-600">{a.entitlement}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        a.attached ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {a.attached ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        a.activation === 'Auto' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {a.activation}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      {a.attached ? (
                        <button
                          type="button"
                          onClick={() => addToast(`Opening attachment viewer for ${a.name}`, 'info')}
                          className="bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg font-bold text-[11px] text-slate-700"
                        >
                          View
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleManualAttach(a.id)}
                          className="bg-[#2f66e0] hover:opacity-95 text-white px-3 py-1 rounded-lg font-bold text-[11px]"
                        >
                          Attach
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. LEAVE REQUEST SUB-TAB (SPLIT VIEW) */}
      {activeSubTab === 'Leave request' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left panel - Request Form */}
          <div className="lg:col-span-6 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Leave request form</h3>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setReqFormType('day')}
                  className={`px-3 py-1 rounded-lg ${reqFormType === 'day' ? 'bg-white text-slate-800 shadow-xs' : ''}`}
                >
                  By day
                </button>
                <button
                  type="button"
                  onClick={() => setReqFormType('hour')}
                  className={`px-3 py-1 rounded-lg ${reqFormType === 'hour' ? 'bg-white text-slate-800 shadow-xs' : ''}`}
                >
                  By hour
                </button>
              </div>
            </div>

            <form onSubmit={handleSelfRequestSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 block uppercase">Leave type *</label>
                <select
                  value={reqType}
                  onChange={(e) => setReqType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 p-2.5 text-xs font-bold text-slate-700 rounded-xl focus:bg-white focus:outline-none"
                >
                  <option value="Annual leave (12 days remaining)">Annual leave (12 days remaining)</option>
                  <option value="Medical leave (10 days remaining)">Medical leave (10 days remaining)</option>
                  <option value="Emergency leave (2 days remaining)">Emergency leave (2 days remaining)</option>
                  <option value="Replacement leave (1 day remaining)">Replacement leave (1 day remaining)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block uppercase">From date *</label>
                  <input
                    type="date"
                    required
                    value={reqFromDate}
                    onChange={(e) => setReqFromDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 p-2.5 text-xs font-extrabold text-slate-700 rounded-xl focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block uppercase">To date *</label>
                  <input
                    type="date"
                    required
                    value={reqToDate}
                    onChange={(e) => setReqToDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 p-2.5 text-xs font-extrabold text-slate-700 rounded-xl focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block uppercase">Total days</label>
                  <input
                    type="text"
                    readOnly
                    value={`${calculateDays(reqFromDate, reqToDate)} days`}
                    className="w-full bg-slate-100 border border-slate-100 p-2.5 text-xs font-extrabold text-slate-500 rounded-xl cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block uppercase">First day</label>
                  <select
                    value={firstDayHalf}
                    onChange={(e) => setFirstDayHalf(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 p-2.5 text-xs font-bold text-slate-700 rounded-xl focus:bg-white"
                  >
                    <option value="Full day">Full day</option>
                    <option value="AM half day">AM half day</option>
                    <option value="PM half day">PM half day</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block uppercase">Last day</label>
                  <select
                    value={lastDayHalf}
                    onChange={(e) => setLastDayHalf(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 p-2.5 text-xs font-bold text-slate-700 rounded-xl focus:bg-white"
                  >
                    <option value="Full day">Full day</option>
                    <option value="AM half day">AM half day</option>
                    <option value="PM half day">PM half day</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 block uppercase">Reason</label>
                <textarea
                  value={reqReason}
                  onChange={(e) => setReqReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 p-3 text-xs font-bold text-slate-700 rounded-xl focus:bg-white focus:outline-none min-h-[90px]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="req-notify"
                  checked={reqNotify}
                  onChange={(e) => setReqNotify(e.target.checked)}
                  className="rounded border-slate-300 text-[#2f66e0]"
                />
                <label htmlFor="req-notify" className="text-xs text-slate-500 font-bold">
                  Send email notification to approver
                </label>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => { setReqReason(''); }}
                  className="bg-white border border-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer hover:bg-slate-50 transition-all flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#2f66e0] hover:opacity-95 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer transition-all flex-1 shadow-sm"
                >
                  Submit request
                </button>
              </div>
            </form>
          </div>

          {/* Right panel - Balance and History List */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Leave balance overview</h3>
              <div className="space-y-3.5">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                    <span>Annual leave</span>
                    <span>12 / 16 days</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '75%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                    <span>Medical leave</span>
                    <span>10 / 14 days</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '71%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                    <span>Emergency leave</span>
                    <span>2 / 3 days</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '66%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                    <span>Replacement leave</span>
                    <span>1 / 1 day</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-violet-500 h-full rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">My time offs</h3>
              <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-[#f8fafc] border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <tr>
                      <th className="p-3 pl-4">Leave type</th>
                      <th className="p-3">Date</th>
                      <th className="p-3 text-center">Days</th>
                      <th className="p-3 text-right pr-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {requests.slice(0, 4).map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/40">
                        <td className="p-3 pl-4 font-bold text-slate-800">{r.type}</td>
                        <td className="p-3 font-semibold text-slate-500">{r.dateStr}</td>
                        <td className="p-3 text-center font-mono font-bold text-slate-600">{r.days}</td>
                        <td className="p-3 text-right pr-4">
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                            r.status === 'Accepted'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : r.status === 'Pending'
                              ? 'bg-amber-50 text-amber-700 border border-amber-100'
                              : r.status === 'Denied'
                              ? 'bg-rose-50 text-rose-700 border border-rose-100'
                              : 'bg-blue-50 text-blue-700 border border-blue-100'
                          }`}>
                            {r.status}
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

      {/* 5. REQUEST FOR OTHERS SUB-TAB (SPLIT VIEW) */}
      {activeSubTab === 'Request for others' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left panel - Request Form on behalf */}
          <div className="lg:col-span-6 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-5">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Leave request for others</h3>
              <p className="text-[10px] font-semibold text-slate-400 mt-1">Submit leave on behalf of another employee</p>
            </div>

            <form onSubmit={handleRequestForOthersSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 block uppercase">Employee *</label>
                <select
                  value={rfoEmployee}
                  onChange={(e) => setRfoEmployee(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 p-2.5 text-xs font-bold text-slate-700 rounded-xl focus:bg-white"
                >
                  <option value="">-- Select employee --</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.id}) - {emp.department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 block uppercase">Leave type *</label>
                <select
                  value={rfoType}
                  onChange={(e) => setRfoType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 p-2.5 text-xs font-bold text-slate-700 rounded-xl focus:bg-white"
                >
                  <option value="Annual leave">Annual leave</option>
                  <option value="Medical leave">Medical leave</option>
                  <option value="Emergency leave">Emergency leave</option>
                  <option value="Replacement leave">Replacement leave</option>
                  <option value="Maternity leave">Maternity leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block uppercase">From date *</label>
                  <input
                    type="date"
                    required
                    value={rfoFromDate}
                    onChange={(e) => setRfoFromDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 p-2.5 text-xs font-extrabold text-slate-700 rounded-xl focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block uppercase">To date *</label>
                  <input
                    type="date"
                    required
                    value={rfoToDate}
                    onChange={(e) => setRfoToDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 p-2.5 text-xs font-extrabold text-slate-700 rounded-xl focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block uppercase">Total days</label>
                  <input
                    type="text"
                    readOnly
                    value={`${calculateDays(rfoFromDate, rfoToDate)} days (Auto-calculated)`}
                    className="w-full bg-slate-100 border border-slate-100 p-2.5 text-xs font-extrabold text-slate-500 rounded-xl cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block uppercase">Session</label>
                  <select
                    value={rfoSession}
                    onChange={(e) => setRfoSession(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 p-2.5 text-xs font-bold text-slate-700 rounded-xl focus:bg-white"
                  >
                    <option value="Full day">Full day</option>
                    <option value="AM half day">AM half day</option>
                    <option value="PM half day">PM half day</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 block uppercase">Reason</label>
                <textarea
                  value={rfoReason}
                  onChange={(e) => setRfoReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 p-3 text-xs font-bold text-slate-700 rounded-xl focus:bg-white focus:outline-none min-h-[90px]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rfo-notify"
                  checked={rfoNotify}
                  onChange={(e) => setRfoNotify(e.target.checked)}
                  className="rounded border-slate-300 text-[#2f66e0]"
                />
                <label htmlFor="rfo-notify" className="text-xs text-slate-500 font-bold">
                  Send email notification to approver
                </label>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => { setRfoReason(''); }}
                  className="bg-white border border-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer hover:bg-slate-50 transition-all flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:opacity-95 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer transition-all flex-1 shadow-sm"
                >
                  Submit request
                </button>
              </div>
            </form>
          </div>

          {/* Right panel - Behalf History */}
          <div className="lg:col-span-6 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Requested time offs (on behalf)</h3>
            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-[#f8fafc] border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <tr>
                    <th className="p-3 pl-4">Employee</th>
                    <th className="p-3">Leave type</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 text-center">Days</th>
                    <th className="p-3 text-right pr-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/40">
                    <td className="p-3 pl-4 font-bold text-slate-800">Sarah L</td>
                    <td className="p-3 font-semibold text-slate-600">Annual</td>
                    <td className="p-3 text-slate-500">3-5 May</td>
                    <td className="p-3 text-center font-mono font-bold text-slate-600">3</td>
                    <td className="p-3 text-right pr-4">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-md font-bold text-[10px]">Accepted</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/40">
                    <td className="p-3 pl-4 font-bold text-slate-800">Maya T</td>
                    <td className="p-3 font-semibold text-slate-600">Medical</td>
                    <td className="p-3 text-slate-500">1 May</td>
                    <td className="p-3 text-center font-mono font-bold text-slate-600">1</td>
                    <td className="p-3 text-right pr-4">
                      <span className="bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-md font-bold text-[10px]">Pending</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/40">
                    <td className="p-3 pl-4 font-bold text-slate-800">Ahmad L</td>
                    <td className="p-3 font-semibold text-slate-600">Emergency</td>
                    <td className="p-3 text-slate-500">28 Apr</td>
                    <td className="p-3 text-center font-mono font-bold text-slate-600">1</td>
                    <td className="p-3 text-right pr-4">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-md font-bold text-[10px]">Accepted</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/40">
                    <td className="p-3 pl-4 font-bold text-slate-800">Nadia C</td>
                    <td className="p-3 font-semibold text-slate-600">Annual</td>
                    <td className="p-3 text-slate-500">21-22 Apr</td>
                    <td className="p-3 text-center font-mono font-bold text-slate-600">2</td>
                    <td className="p-3 text-right pr-4">
                      <span className="bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-md font-bold text-[10px]">Pending</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. LEAVE APPROVAL SUB-TAB */}
      {activeSubTab === 'Leave approval' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500">Filter requests:</span>
              <span className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">All status</span>
              <span className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">All leave types</span>
              <span className="bg-white border border-slate-200 text-slate-600 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1">
                {pendingCount} pending reviews
              </span>
            </div>

            <button
              onClick={() => addToast('Approval log reset successfully', 'info')}
              className="text-slate-500 hover:text-slate-800 font-bold text-xs cursor-pointer hover:underline"
            >
              Reset Filters
            </button>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs text-slate-600">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4 pl-6">Employee</th>
                  <th className="p-4">Leave type</th>
                  <th className="p-4">From</th>
                  <th className="p-4">To</th>
                  <th className="p-4 text-center">Days</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4">Approved by</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50">
                    <td className="p-4 pl-6 font-bold text-slate-800">{r.name}</td>
                    <td className="p-4">
                      <span className="bg-blue-50 text-blue-700 border border-blue-100/50 px-2 py-0.5 rounded-md text-[10.5px] font-bold">
                        {r.type}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-500">{new Date(r.fromDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</td>
                    <td className="p-4 font-semibold text-slate-500">{new Date(r.toDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</td>
                    <td className="p-4 text-center font-mono font-bold text-slate-600">{r.days}</td>
                    <td className="p-4 font-medium text-slate-600 max-w-xs truncate">{r.reason}</td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        {r.approvedBy.map((ap, idx) => (
                          <span key={idx} className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-600">
                            <span className={`h-1.5 w-1.5 rounded-full ${ap.color}`} />
                            <span>{ap.name}</span>
                            {ap.status === 'approved' && <span className="text-emerald-600 font-extrabold">✔</span>}
                            {ap.status === 'rejected' && <span className="text-red-500 font-extrabold">✘</span>}
                          </span>
                        ))}
                        {r.approvedBy.length === 0 && <span className="text-slate-400 font-medium select-none italic">Not specified</span>}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10.5px] font-extrabold ${
                        r.status === 'Accepted'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : r.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : r.status === 'Denied'
                          ? 'bg-rose-50 text-rose-700 border border-rose-100'
                          : 'bg-blue-50 text-blue-700 border border-blue-100'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      {r.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleApprove(r.id, r.name)}
                            className="bg-emerald-600 hover:opacity-95 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg active:scale-95 transition-all"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeny(r.id, r.name)}
                            className="bg-white hover:bg-slate-50 border border-red-200 text-red-600 font-bold text-[11px] px-3 py-1.5 rounded-lg transition-all"
                          >
                            Deny
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs font-bold capitalize select-none italic">
                          {r.status.toLowerCase()}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. LEAVE HISTORY SUB-TAB */}
      {activeSubTab === 'Leave history' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex flex-1 max-w-lg gap-2.5">
              <div className="relative flex-1">
                <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search employee history..."
                  value={searchHistory}
                  onChange={(e) => setSearchHistory(e.target.value)}
                  className="w-full text-xs text-slate-700 bg-white border border-slate-200 pl-10 pr-4 py-2 rounded-xl focus:border-slate-300 focus:outline-none"
                />
              </div>

              <select
                value={historyTypeFilter}
                onChange={(e) => setHistoryTypeFilter(e.target.value)}
                className="bg-white border border-slate-200 text-slate-700 text-xs font-bold px-2 rounded-xl"
              >
                <option value="All types">All types</option>
                <option value="Annual">Annual</option>
                <option value="Medical">Medical</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => addToast('Opening statement log', 'info')}
                className="text-xs font-bold text-[#2f66e0] hover:underline"
              >
                Leave card generate
              </button>
              <button
                type="button"
                onClick={() => addToast('Exporting active table layout', 'success')}
                className="bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl hover:opacity-95"
              >
                Export PDF
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs text-slate-600">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4 pl-6">Employee</th>
                  <th className="p-4">Leave type</th>
                  <th className="p-4">From</th>
                  <th className="p-4">To</th>
                  <th className="p-4 text-center">Days</th>
                  <th className="p-4">Requested by</th>
                  <th className="p-4">Approved by</th>
                  <th className="p-4 pr-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests
                  .filter(r => r.name.toLowerCase().includes(searchHistory.toLowerCase()))
                  .filter(r => {
                    if (historyTypeFilter === 'All types') return true;
                    return r.type.includes(historyTypeFilter);
                  })
                  .map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50">
                      <td className="p-4 pl-6 font-bold text-slate-800">{r.name}</td>
                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md text-[10.5px] font-bold">
                          {r.type}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-slate-500">{new Date(r.fromDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</td>
                      <td className="p-4 font-semibold text-slate-500">{new Date(r.toDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</td>
                      <td className="p-4 text-center font-mono font-bold text-slate-600">{r.days}</td>
                      <td className="p-4 text-slate-500 font-bold">Self</td>
                      <td className="p-4 font-bold text-emerald-600">
                        {r.approvedBy.map(ap => ap.name).join(', ') || 'System Auto'}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10.5px] font-black ${
                          r.status === 'Accepted'
                            ? 'bg-emerald-50 text-emerald-700'
                            : r.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8. EMPLOYEE LEAVE PROFILE SUB-TAB */}
      {activeSubTab === 'Employee leave profile' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500">Selected employee profile:</span>
              <select
                value={profileSelectedEmpId}
                onChange={(e) => setProfileSelectedEmpId(e.target.value)}
                className="bg-white border border-slate-200 text-slate-700 text-xs font-bold p-2 rounded-xl focus:outline-none"
              >
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.name} ({e.id})</option>
                ))}
              </select>
              <span className="text-xs text-slate-400 font-bold italic">Leave &amp; time off policy breakdown</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left panel - User card + Entitlement table */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-4.5">
                  <div className="h-14 w-14 bg-[#2f66e0] text-white rounded-2xl flex items-center justify-center text-xl font-bold font-mono">
                    {selectedProfileEmp.name ? selectedProfileEmp.name.charAt(0) : 'S'}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-800 tracking-tight">
                      {selectedProfileEmp.name}
                    </h3>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
                      {selectedProfileEmp.id} &bull; {selectedProfileEmp.department} &bull; {selectedProfileEmp.position || 'FTE Staff'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold block mb-0.5">Employment type</span>
                    <span className="text-slate-800 font-extrabold">{selectedProfileEmp.employmentStatus || 'Permanent'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block mb-0.5">Join date</span>
                    <span className="text-slate-800 font-extrabold">{selectedProfileEmp.joinDate || '12-Jan-2021'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block mb-0.5">Service period</span>
                    <span className="text-slate-800 font-extrabold">4 years 3 months</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block mb-0.5">Leave year tenure</span>
                    <span className="text-slate-800 font-extrabold">Jan - Dec 2026</span>
                  </div>
                </div>
              </div>

              {/* Entitilement table */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Leave entitlement &amp; balance</h3>
                <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-[#f8fafc] border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <tr>
                        <th className="p-3 pl-4">Leave type</th>
                        <th className="p-3 text-center">Entitled</th>
                        <th className="p-3 text-center">Used</th>
                        <th className="p-3 text-center">Balance</th>
                        <th className="p-3 text-right pr-4">Carry Fwd</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-3 pl-4 font-bold text-slate-800">
                        <div className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" />
                          <span>Annual</span></div>
                      </td>
                        <td className="p-3 text-center font-bold text-slate-600">18</td>
                        <td className="p-3 text-center font-bold text-rose-500">6</td>
                        <td className="p-3 text-center font-black text-emerald-600">12</td>
                        <td className="p-3 text-right pr-4 font-bold text-slate-400">2</td>
                      </tr>
                      <tr>
                        <td className="p-3 pl-4 font-bold text-slate-800">
                        <div className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span>Medical</span></div>
                      </td>
                        <td className="p-3 text-center font-bold text-slate-600">14</td>
                        <td className="p-3 text-center font-bold text-rose-500">4</td>
                        <td className="p-3 text-center font-black text-emerald-600">10</td>
                        <td className="p-3 text-right pr-4 font-bold text-slate-400">0</td>
                      </tr>
                      <tr>
                        <td className="p-3 pl-4 font-bold text-slate-800">
                        <div className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" />
                          <span>Emergency</span></div>
                      </td>
                        <td className="p-3 text-center font-bold text-slate-600">3</td>
                        <td className="p-3 text-center font-bold text-rose-500">1</td>
                        <td className="p-3 text-center font-black text-emerald-600">2</td>
                        <td className="p-3 text-right pr-4 font-bold text-slate-400">0</td>
                      </tr>
                      <tr>
                        <td className="p-3 pl-4 font-bold text-slate-800">
                        <div className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-violet-500" />
                          <span>Replacement</span></div>
                      </td>
                        <td className="p-3 text-center font-bold text-slate-600">1</td>
                        <td className="p-3 text-center font-bold text-rose-500">0</td>
                        <td className="p-3 text-center font-black text-emerald-600">1</td>
                        <td className="p-3 text-right pr-4 font-bold text-slate-400">0</td>
                      </tr>
                      <tr>
                        <td className="p-3 pl-4 font-bold text-slate-800">
                        <div className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-teal-500" />
                          <span>Hour leave</span></div>
                      </td>
                        <td className="p-3 text-center text-slate-500 font-mono font-bold">16h</td>
                        <td className="p-3 text-center text-rose-500 font-mono font-bold">4h</td>
                        <td className="p-3 text-center text-emerald-600 font-mono font-black">12h</td>
                        <td className="p-3 text-right pr-4 font-bold text-slate-400">0</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right panel - Applied policies + Recent timeline */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Applied policies</h3>
                <div className="space-y-3.5 text-xs">
                  {[
                    { label: 'Annual leave policy', badge: 'Applied', badgeClass: 'bg-emerald-50 text-emerald-700' },
                    { label: 'Service leave bonus', badge: '+2 days (3-5 yrs)', badgeClass: 'text-[#2f66e0] font-black text-[11px]', plain: true },
                    { label: 'Medical leave policy', badge: 'Applied', badgeClass: 'bg-emerald-50 text-emerald-700' },
                    { label: 'Emergency leave policy', badge: 'Applied', badgeClass: 'bg-emerald-50 text-emerald-700' },
                    { label: 'Maternity leave', badge: 'Not attached', badgeClass: 'bg-slate-100 text-slate-500' },
                    { label: 'Replacement leave', badge: 'Manual attached', badgeClass: 'bg-amber-50 text-amber-700 border border-amber-100' },
                    { label: 'Unpaid leave', badge: 'Applied', badgeClass: 'bg-emerald-50 text-emerald-700' },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center bg-slate-50/50 p-2.5 border border-slate-100 rounded-xl">
                      <span className="font-bold text-slate-800">{row.label}</span>
                      {row.plain ? (
                        <span className={row.badgeClass}>{row.badge}</span>
                      ) : (
                        <span className={`${row.badgeClass} font-bold px-2 py-0.5 rounded-lg text-[10px]`}>{row.badge}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent activity list */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Recent leave activity</h3>
                <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-[#f8fafc] border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <tr>
                        <th className="p-3 pl-4">Leave type</th>
                        <th className="p-3">Date</th>
                        <th className="p-3 text-center">Days</th>
                        <th className="p-3 text-right pr-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-3 pl-4 font-bold text-slate-800">Annual</td>
                        <td className="p-3 font-semibold text-slate-500">12-14 May</td>
                        <td className="p-3 text-center font-mono font-bold text-slate-600">3</td>
                        <td className="p-3 text-right pr-4">
                          <span className="bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-0.5 rounded-md font-bold text-[10px]">Pending</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 pl-4 font-bold text-slate-800">Annual</td>
                        <td className="p-3 font-semibold text-slate-500">21-22 Apr</td>
                        <td className="p-3 text-center font-mono font-bold text-slate-600">2</td>
                        <td className="p-3 text-right pr-4">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-md font-bold text-[10px]">Accepted</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 pl-4 font-bold text-slate-800">Medical</td>
                        <td className="p-3 font-semibold text-slate-500">3 Mar</td>
                        <td className="p-3 text-center font-mono font-bold text-slate-600">2</td>
                        <td className="p-3 text-right pr-4">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-md font-bold text-[10px]">Accepted</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 pl-4 font-bold text-slate-800">Emergency</td>
                        <td className="p-3 font-semibold text-slate-500">10 Feb</td>
                        <td className="p-3 text-center font-mono font-bold text-slate-600">1</td>
                        <td className="p-3 text-right pr-4">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-md font-bold text-[10px]">Accepted</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. LEAVE REPORTS SUB-TAB */}
      {activeSubTab === 'Leave reports' && (
        <div className="space-y-6">
          
          {/* 1. Statistics KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Absence Outrate</span>
                <h3 className="text-xl font-extrabold text-[#2f66e0] tracking-tight">4.8%</h3>
                <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">&darr; 0.6% this month</span>
              </div>
              <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-[#2f66e0]" />
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Requests</span>
                <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">15 active</h3>
                <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">Across all units</span>
              </div>
              <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                <Users className="h-5 w-5 text-slate-600" />
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Annual Time-off</span>
                <h3 className="text-xl font-extrabold text-indigo-600 tracking-tight">56.5 days</h3>
                <span className="text-[9px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">18 FTEs involved</span>
              </div>
              <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-indigo-500" />
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medical Leave Rate</span>
                <h3 className="text-xl font-extrabold text-emerald-600 tracking-tight">14.0 days</h3>
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">All Doctor certified</span>
              </div>
              <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </div>

          {/* 2. Departmental compliance/utilization scoreboard */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <h4 className="text-xs font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <Network className="h-4 w-4 text-[#2f66e0]" />
                <span>Departmental Time Off &amp; Leave Utilization Matrix</span>
              </h4>
              <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Aggregate leave behaviors, average sick leaves, and standard compliance ratings by department</p>
            </div>

            <div className="bg-white border border-slate-100 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <th className="p-3 pl-4">Department Unit</th>
                    <th className="p-3">FTE size</th>
                    <th className="p-3 text-center">Annual used</th>
                    <th className="p-3 text-center">Medical taken</th>
                    <th className="p-3 text-center">Unpaid recorded</th>
                    <th className="p-3 text-center">Accrued balance avg</th>
                    <th className="p-3 pr-4 text-right">Utilization Assessment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr className="hover:bg-slate-50/40">
                    <td className="p-3 pl-4 font-bold text-slate-800">Engineering &amp; Dev</td>
                    <td className="p-3 text-slate-500">14 FTEs</td>
                    <td className="p-3 text-center font-mono text-slate-600">32 days</td>
                    <td className="p-3 text-center font-mono text-emerald-600">8 days</td>
                    <td className="p-3 text-center font-mono text-rose-500">2 days</td>
                    <td className="p-3 text-center font-mono text-indigo-500">14 days</td>
                    <td className="p-3 pr-4 text-right">
                      <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-md font-extrabold text-[10px]">Optimal / 94.2%</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/40">
                    <td className="p-3 pl-4 font-bold text-slate-800">Human Resources (HR)</td>
                    <td className="p-3 text-slate-500">4 FTEs</td>
                    <td className="p-3 text-center font-mono text-slate-600">6 days</td>
                    <td className="p-3 text-center font-mono text-emerald-600">2 days</td>
                    <td className="p-3 text-center font-mono text-slate-400">0 days</td>
                    <td className="p-3 text-center font-mono text-indigo-500">16 days</td>
                    <td className="p-3 pr-4 text-right">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-md font-extrabold text-[10px]">Excellent / 98.5%</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/40">
                    <td className="p-3 pl-4 font-bold text-slate-800">Marketing &amp; Sales</td>
                    <td className="p-3 text-slate-500">8 FTEs</td>
                    <td className="p-3 text-center font-mono text-slate-600">18 days</td>
                    <td className="p-3 text-center font-mono text-emerald-600">1 day</td>
                    <td className="p-3 text-center font-mono text-rose-500">4 days</td>
                    <td className="p-3 text-center font-mono text-indigo-500">12 days</td>
                    <td className="p-3 pr-4 text-right">
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-md font-extrabold text-[10px]">Moderate / 86.0%</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/40">
                    <td className="p-3 pl-4 font-bold text-slate-800">Finance &amp; Audit</td>
                    <td className="p-3 text-slate-500">3 FTEs</td>
                    <td className="p-3 text-center font-mono text-slate-600">4 days</td>
                    <td className="p-3 text-center font-mono text-emerald-600">3 days</td>
                    <td className="p-3 text-center font-mono text-slate-400">0 days</td>
                    <td className="p-3 text-center font-mono text-indigo-500">15 days</td>
                    <td className="p-3 pr-4 text-right">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-md font-extrabold text-[10px]">Excellent / 97.8%</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/40">
                    <td className="p-3 pl-4 font-bold text-slate-800">Operations &amp; Admin</td>
                    <td className="p-3 text-slate-500">12 FTEs</td>
                    <td className="p-3 text-center font-mono text-slate-600">28 days</td>
                    <td className="p-3 text-center font-mono text-emerald-600">6 days</td>
                    <td className="p-3 text-center font-mono text-rose-500">5 days</td>
                    <td className="p-3 text-center font-mono text-indigo-500">11 days</td>
                    <td className="p-3 pr-4 text-right">
                      <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-md font-extrabold text-[10px]">Optimal / 91.0%</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Reports Controls & Input Filters */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setLeaveReportType('detail')}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  leaveReportType === 'detail'
                    ? 'bg-slate-100 text-[#2f66e0] ring-1 ring-slate-200 shadow-sm font-extrabold'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                Detail time-off report
              </button>
              <button
                onClick={() => setLeaveReportType('summary')}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  leaveReportType === 'summary'
                    ? 'bg-slate-100 text-[#2f66e0] ring-1 ring-slate-200 shadow-sm font-extrabold'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                Summary balance report
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto text-slate-700 font-sans">
              {/* Employee search */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search staff name..."
                  value={leaveReportsFilterEmp}
                  onChange={(e) => setLeaveReportsFilterEmp(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs font-medium pl-8.5 pr-3 py-2 rounded-xl focus:outline-none focus:bg-white w-40"
                />
              </div>

              {/* Department filter */}
              <select
                value={leaveReportsFilterDept}
                onChange={(e) => setLeaveReportsFilterDept(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-bold p-2 rounded-xl focus:outline-none"
              >
                <option value="All departments">All departments</option>
                <option value="Engineering">Engineering</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
              </select>

              {/* Month Selector */}
              <select
                value={leaveReportMonth}
                onChange={(e) => setLeaveReportMonth(e.target.value)}
                className="bg-slate-50 border border-[#b4c3ee] text-[#2f66e0] text-xs font-extrabold p-2 rounded-xl focus:outline-none"
              >
                <option value="January 2026">January 2026</option>
                <option value="February 2026">February 2026</option>
                <option value="March 2026">March 2026</option>
                <option value="April 2026">April 2026</option>
                <option value="May 2026">May 2026</option>
                <option value="June 2026">June 2026</option>
              </select>

              {/* Export report button */}
              <button
                onClick={() => addToast(`Exported ${leaveReportType === 'detail' ? 'Detailed' : 'Summary'} Leave Report for ${leaveReportMonth}`, 'success')}
                className="bg-[#2f66e0] text-white hover:opacity-95 text-xs font-extrabold px-3.5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ml-auto sm:ml-0"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          {/* 4. Filtered Reports Table */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs">
            {leaveReportType === 'detail' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest">Detailed Time-Off Logs - {leaveReportMonth}</h4>
                  <span className="text-[10px] font-bold text-slate-400">Showing {
                    leaveReportsRows.filter(row => {
                      const matchesDept = leaveReportsFilterDept === 'All departments' || row.dept === leaveReportsFilterDept;
                      const matchesEmp = row.name.toLowerCase().includes(leaveReportsFilterEmp.toLowerCase());
                      return matchesDept && matchesEmp;
                    }).length
                  } log indices</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                        <th className="p-3 pl-4">ID</th>
                        <th className="p-3">Employee</th>
                        <th className="p-3">Department</th>
                        <th className="p-3">Leave Type</th>
                        <th className="p-3 text-center">Days</th>
                        <th className="p-3">Duration</th>
                        <th className="p-3">Paid Option</th>
                        <th className="p-3">Rate Breakdown</th>
                        <th className="p-3">Approved By</th>
                        <th className="p-3 text-right pr-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {leaveReportsRows
                        .filter(row => {
                          const matchesDept = leaveReportsFilterDept === 'All departments' || row.dept === leaveReportsFilterDept;
                          const matchesEmp = row.name.toLowerCase().includes(leaveReportsFilterEmp.toLowerCase());
                          return matchesDept && matchesEmp;
                        })
                        .map(row => (
                          <tr key={row.id} className="hover:bg-slate-50/40">
                            <td className="p-3 pl-4 text-slate-400 font-bold font-mono">{row.id}</td>
                            <td className="p-3 font-extrabold text-slate-800">{row.name}</td>
                            <td className="p-3 text-slate-500 font-semibold">{row.dept}</td>
                            <td className="p-3">
                              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-bold">{row.type}</span>
                            </td>
                            <td className="p-3 text-center font-bold font-mono text-slate-700">{row.days}</td>
                            <td className="p-3 text-slate-500 text-[11px] font-semibold">{row.fromDate} to {row.toDate}</td>
                            <td className="p-3 text-slate-600 font-semibold">{row.paid}</td>
                            <td className="p-3 text-slate-500 italic text-[11px]">{row.rate}</td>
                            <td className="p-3 text-slate-600 font-bold">{row.approvedBy}</td>
                            <td className="p-3 text-right pr-4">
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-md font-bold text-[10px]">
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest">Employee Time-Off Balances Summary</h4>
                  <span className="text-[10px] font-bold text-slate-400">Total FTE Balance roster</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                        <th className="p-3 pl-4">Staff ID</th>
                        <th className="p-3">Employee Name</th>
                        <th className="p-3">Department Branch</th>
                        <th className="p-3 text-center">Annual used</th>
                        <th className="p-3 text-center">Medical taken</th>
                        <th className="p-3 text-center">Unpaid recorded</th>
                        <th className="p-3 text-center">Aggregate used</th>
                        <th className="p-3 text-right pr-4">Remaining Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {leaveSummaryRows
                        .filter(row => {
                          const matchesDept = leaveReportsFilterDept === 'All departments' || row.dept === leaveReportsFilterDept;
                          const matchesEmp = row.name.toLowerCase().includes(leaveReportsFilterEmp.toLowerCase());
                          return matchesDept && matchesEmp;
                        })
                        .map(row => (
                          <tr key={row.employeeId} className="hover:bg-slate-50/40">
                            <td className="p-3 pl-4 text-slate-400 font-bold font-mono">{row.employeeId}</td>
                            <td className="p-3 font-extrabold text-slate-800">{row.name}</td>
                            <td className="p-3 text-slate-500 font-semibold">{row.dept}</td>
                            <td className="p-3 text-center font-bold font-mono text-slate-700">{row.annual} days</td>
                            <td className="p-3 text-center font-bold font-mono text-emerald-600">{row.sick} days</td>
                            <td className="p-3 text-center font-bold font-mono text-rose-500">{row.unpaid} days</td>
                            <td className="p-3 text-center font-bold font-mono text-[#2f66e0]">{row.total} days</td>
                            <td className="p-3 text-right pr-4 text-slate-800 font-extrabold">
                              <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded-md font-extrabold">
                                {row.balance}
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
        </div>
      )}

      {/* NEW TYPE MODAL */}
      {newTypeModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-100 rounded-2xl w-full max-w-sm p-6 shadow-xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                <Settings className="h-4.5 w-4.5 text-[#2f66e0]" />
                <span>Configure Leave Type</span>
              </h4>
              <button onClick={() => setNewTypeModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLeaveType} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 block uppercase">Leave Type Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Compassionate leave"
                  value={newTypeData.name}
                  onChange={(e) => setNewTypeData({ ...newTypeData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold text-slate-700 rounded-xl focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 block uppercase">Paid Class</label>
                  <select
                    value={newTypeData.paid ? 'paid' : 'unpaid'}
                    onChange={(e) => setNewTypeData({ ...newTypeData, paid: e.target.value === 'paid' })}
                    className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold text-slate-700 rounded-xl"
                  >
                    <option value="paid">Paid leave</option>
                    <option value="unpaid">Unpaid leave</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 block uppercase">Deduction rate</label>
                  <input
                    type="text"
                    value={newTypeData.deductionRate}
                    onChange={(e) => setNewTypeData({ ...newTypeData, deductionRate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold text-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 block uppercase">Hour based?</label>
                  <select
                    value={newTypeData.hourBased ? 'yes' : 'no'}
                    onChange={(e) => setNewTypeData({ ...newTypeData, hourBased: e.target.value === 'yes' })}
                    className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold text-slate-700 rounded-xl"
                  >
                    <option value="no">No (Fixed days)</option>
                    <option value="yes">Yes (Hourly credit)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 block uppercase">Attachment req.?</label>
                  <select
                    value={newTypeData.attachmentReq ? 'yes' : 'no'}
                    onChange={(e) => setNewTypeData({ ...newTypeData, attachmentReq: e.target.value === 'yes' })}
                    className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold text-slate-700 rounded-xl"
                  >
                    <option value="no">No (None)</option>
                    <option value="yes">Yes (Mandatory upload)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 block uppercase">Theme Badge Accent Color</label>
                <div className="flex flex-wrap gap-2.5 pt-1">
                  {[
                    { color: 'bg-blue-500', name: 'Blue' },
                    { color: 'bg-emerald-500', name: 'Emerald' },
                    { color: 'bg-amber-500', name: 'Amber' },
                    { color: 'bg-rose-500', name: 'Rose' },
                    { color: 'bg-violet-500', name: 'Violet' },
                    { color: 'bg-pink-500', name: 'Pink' },
                    { color: 'bg-teal-500', name: 'Teal' }
                  ].map(c => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => setNewTypeData({ ...newTypeData, color: c.color })}
                      className={`h-6.5 w-6.5 rounded-full ${c.color} border-2 ${
                        newTypeData.color === c.color ? 'border-indigo-600 scale-110 shadow-sm' : 'border-transparent'
                      } cursor-pointer`}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setNewTypeModal(false)}
                  className="bg-white border border-slate-200 text-slate-600 font-bold text-xs px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#2f66e0] hover:opacity-95 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs whitespace-nowrap"
                >
                  Create Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT LEAVE TYPE MODAL */}
      {editTypeModal && editingType && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-100 rounded-2xl w-full max-w-sm p-6 shadow-xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                <Settings className="h-4.5 w-4.5 text-[#2f66e0]" />
                <span>Edit Leave Configuration</span>
              </h4>
              <button onClick={() => { setEditingType(null); setEditTypeModal(false); }} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleEditLeaveType} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 block uppercase">Leave Type Name</label>
                <input
                  type="text"
                  required
                  value={editingType.name}
                  onChange={(e) => setEditingType({ ...editingType, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold text-slate-700 rounded-xl focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 block uppercase">Paid class</label>
                  <select
                    value={editingType.paid ? 'paid' : 'unpaid'}
                    onChange={(e) => setEditingType({ ...editingType, paid: e.target.value === 'paid' })}
                    className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold text-slate-700 rounded-xl"
                  >
                    <option value="paid">Paid leave</option>
                    <option value="unpaid">Unpaid leave</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 block uppercase">Deduction rate</label>
                  <input
                    type="text"
                    value={editingType.deductionRate}
                    onChange={(e) => setEditingType({ ...editingType, deductionRate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold text-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 block uppercase">Hour based?</label>
                  <select
                    value={editingType.hourBased ? 'yes' : 'no'}
                    onChange={(e) => setEditingType({ ...editingType, hourBased: e.target.value === 'yes' })}
                    className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold text-slate-700 rounded-xl"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 block uppercase">Attachment req.</label>
                  <select
                    value={editingType.attachmentReq ? 'yes' : 'no'}
                    onChange={(e) => setEditingType({ ...editingType, attachmentReq: e.target.value === 'yes' })}
                    className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold text-slate-700 rounded-xl"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => { setEditingType(null); setEditTypeModal(false); }}
                  className="bg-white border border-slate-200 text-slate-600 font-bold text-xs px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#2f66e0] hover:opacity-95 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs whitespace-nowrap"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW POLICY MODAL */}
      {newPolicyModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <h4 className="text-sm font-black text-slate-800 tracking-wider flex items-center gap-2">
                <FileText className="h-4.5 w-4.5 text-[#2f66e0]" />
                <span>CREATE NEW LEAVE POLICY</span>
              </h4>
              <button onClick={() => setNewPolicyModal(false)} className="text-slate-400 hover:text-slate-600 transition-all">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={handleCreateLeavePolicy} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Leave Type</label>
                  <select
                    value={newPolicyData.type}
                    onChange={(e) => setNewPolicyData({ ...newPolicyData, type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 font-bold text-slate-700 rounded-xl"
                  >
                    {leaveTypes.map((type) => (
                      <option key={type.id} value={type.name}>{type.name}</option>
                    ))}
                    <option value="Custom Policy Group">Custom Policy Group</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Allow Days Limit</label>
                  <input
                    type="text"
                    required
                    value={newPolicyData.allowDays}
                    onChange={(e) => setNewPolicyData({ ...newPolicyData, allowDays: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 font-bold text-slate-700 rounded-xl focus:bg-white"
                    placeholder="e.g. 14 days / year"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Accrual Method</label>
                  <select
                    value={newPolicyData.accrual}
                    onChange={(e) => setNewPolicyData({ ...newPolicyData, accrual: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 font-bold text-slate-700 rounded-xl"
                  >
                    <option value="Monthly prorate">Monthly prorate</option>
                    <option value="Full upfront">Full upfront</option>
                    <option value="Quarterly accrual">Quarterly accrual</option>
                    <option value="Bi-weekly incremental">Bi-weekly incremental</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Carry Forward</label>
                  <input
                    type="text"
                    required
                    value={newPolicyData.carryForward}
                    onChange={(e) => setNewPolicyData({ ...newPolicyData, carryForward: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 font-bold text-slate-700 rounded-xl focus:bg-white"
                    placeholder="e.g. 5 days max"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Applicable To</label>
                  <input
                    type="text"
                    required
                    value={newPolicyData.applicable}
                    onChange={(e) => setNewPolicyData({ ...newPolicyData, applicable: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 font-bold text-slate-700 rounded-xl focus:bg-white"
                    placeholder="e.g. All permanent employees"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Auto Attachment Setup</label>
                  <input
                    type="text"
                    required
                    value={newPolicyData.autoAttach}
                    onChange={(e) => setNewPolicyData({ ...newPolicyData, autoAttach: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 font-bold text-slate-700 rounded-xl focus:bg-white"
                    placeholder="e.g. On join date"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Minimum Working Days (Requirement)</label>
                <input
                  type="text"
                  required
                  value={newPolicyData.minWorkingDays}
                  onChange={(e) => setNewPolicyData({ ...newPolicyData, minWorkingDays: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 font-bold text-slate-700 rounded-xl focus:bg-white"
                  placeholder="e.g. 15 days, or N/A"
                />
              </div>

              {/* Service Bonus Accordion section */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider block">Include Service Leave Bonus</span>
                  <input
                    type="checkbox"
                    checked={newPolicyData.serviceBonusSelected}
                    onChange={(e) => setNewPolicyData({ ...newPolicyData, serviceBonusSelected: e.target.checked })}
                    className="h-3.5 w-3.5 text-[#2f66e0] border-slate-300 rounded focus:ring-[#2f66e0]"
                  />
                </div>

                {newPolicyData.serviceBonusSelected && (
                  <div className="grid grid-cols-2 gap-3 transition-opacity">
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 block pb-1">SERVICE RANGE</label>
                      <input
                        type="text"
                        value={newPolicyData.serviceBonusRange}
                        onChange={(e) => setNewPolicyData({ ...newPolicyData, serviceBonusRange: e.target.value })}
                        className="w-full bg-white border border-slate-200 p-2 text-xs font-semibold text-slate-700 rounded-lg"
                        placeholder="e.g. 3-5 years service"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 block pb-1">LEAVE BONUS</label>
                      <input
                        type="text"
                        value={newPolicyData.serviceBonusValue}
                        onChange={(e) => setNewPolicyData({ ...newPolicyData, serviceBonusValue: e.target.value })}
                        className="w-full bg-white border border-slate-200 p-2 text-xs font-semibold text-slate-700 rounded-lg"
                        placeholder="e.g. +2 days"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Holiday and General Rules */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 space-y-3">
                <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider block">Rule &amp; Holiday Conditions</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block pb-1">RULE DESCRIPTION KEY</label>
                    <input
                      type="text"
                      value={newPolicyData.ruleKey}
                      onChange={(e) => setNewPolicyData({ ...newPolicyData, ruleKey: e.target.value })}
                      className="w-full bg-white border border-slate-200 p-2 text-xs font-semibold text-slate-700 rounded-lg"
                      placeholder="e.g. Count off / holidays"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block pb-1">RULE ENFORCEMENT VALUE</label>
                    <input
                      type="text"
                      value={newPolicyData.ruleVal}
                      onChange={(e) => setNewPolicyData({ ...newPolicyData, ruleVal: e.target.value })}
                      className="w-full bg-white border border-slate-200 p-2 text-xs font-semibold text-slate-700 rounded-lg"
                      placeholder="e.g. Excluded"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setNewPolicyModal(false)}
                  className="bg-white border border-slate-300 text-slate-600 font-bold text-xs px-4.5 py-2.5 rounded-xl transition-all hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#2f66e0] hover:opacity-95 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Create &amp; Apply Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

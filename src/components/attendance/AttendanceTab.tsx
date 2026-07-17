import { useState, type FormEvent } from 'react'
import {
  Clock,
  Calendar,
  Search,
  Plus,
  FileSpreadsheet,
  FileText,
  Edit2,
  Trash2,
  AlertCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  PlusCircle,
  Settings,
  X,
  Network,
} from 'lucide-react'
import { showActionToast } from '../../utils/actionToast'

export function AttendanceTab() {
  const addToast = (text: string, type?: 'success' | 'loading' | 'error' | 'info') => {
    showActionToast(text, type)
  }

  const [activeSubTab, setActiveSubTab] = useState<string>('Duty Roster');
  const [_searchValue, _setSearchValue] = useState<string>('');
  const [deptFilter, setDeptFilter] = useState<string>('All departments');
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);

  // Check-In Subtab states
  const [checkedIn, setCheckedIn] = useState<boolean>(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [recentChecks, setRecentChecks] = useState([
    { date: '2026-06-12', in: '09:02 AM', out: '06:05 PM', hours: '9.0', status: 'PRESENT' },
    { date: '2026-06-11', in: '08:58 AM', out: '06:01 PM', hours: '9.0', status: 'PRESENT' },
    { date: '2026-06-10', in: '09:12 AM', out: '06:15 PM', hours: '9.0', status: 'PRESENT' },
    { date: '2026-06-09', in: '09:01 AM', out: '06:03 PM', hours: '9.0', status: 'PRESENT' },
    { date: '2026-06-02', in: '07:59 AM', out: '07:59 AM', hours: '0.0', status: 'PRESENT' },
  ]);

  // Roster view configuration
  const [rosterView, setRosterView] = useState<'Week' | 'Day' | 'Month'>('Week');
  
  // Dummy Roster Data for 5 - 11 May 2026
  const [rosterData, _setRosterData] = useState([
    {
      id: 'EMP-0021',
      name: 'Sarah Lim',
      initials: 'SL',
      dept: 'Engineering',
      schedule: {
        Mon: { time: '09:00-18:00', status: 'Completed' },
        Tue: { time: '09:00-18:00', status: 'Completed' },
        Wed: { time: '09:00-18:00', status: 'Clock in' },
        Thu: { time: '09:00-18:00', status: 'Planned' },
        Fri: { time: '09:00-13:00', status: 'Planned', half: true },
        Sat: { time: '—', status: 'Off' },
        Sun: { time: '—', status: 'Off' },
      }
    },
    {
      id: 'EMP-0048',
      name: 'Raj Kumar',
      initials: 'RK',
      dept: 'Engineering',
      schedule: {
        Mon: { time: '09:00-18:00', status: 'Completed' },
        Tue: { time: '09:00-18:00', status: 'Completed' },
        Wed: { time: '09:00-20:00', status: 'OT active' },
        Thu: { time: '09:00-18:00', status: 'Planned' },
        Fri: { time: '09:00-13:00', status: 'Planned' },
        Sat: { time: '—', status: 'Off' },
        Sun: { time: '—', status: 'Off' },
      }
    },
    {
      id: 'EMP-0033',
      name: 'Maya Tan',
      initials: 'MT',
      dept: 'HR',
      schedule: {
        Mon: { time: 'Annual Leave', status: 'On leave' },
        Tue: { time: 'Annual Leave', status: 'On leave' },
        Wed: { time: 'Annual Leave', status: 'On leave' },
        Thu: { time: '09:00-18:00', status: 'Planned' },
        Fri: { time: '09:00-13:00', status: 'Planned' },
        Sat: { time: '—', status: 'Off' },
        Sun: { time: '—', status: 'Off' },
      }
    },
    {
      id: 'EMP-0187',
      name: 'Ahmad L',
      initials: 'AL',
      dept: 'Operations',
      schedule: {
        Mon: { time: '09:00-18:00', status: 'Completed' },
        Tue: { time: '09:00-18:00', status: 'Completed' },
        Wed: { time: '09:00-18:00', status: 'Late in' },
        Thu: { time: '22:00-07:00', status: 'Night' },
        Fri: { time: '22:00-07:00', status: 'Night' },
        Sat: { time: '—', status: 'Off' },
        Sun: { time: '—', status: 'Off' },
      }
    },
    {
      id: 'EMP-0092',
      name: 'Nadia Chen',
      initials: 'NC',
      dept: 'Marketing',
      schedule: {
        Mon: { time: '09:00-18:00', status: 'Completed' },
        Tue: { time: '09:00-18:00', status: 'Completed' },
        Wed: { time: '09:00-18:00', status: 'Completed' },
        Thu: { time: '09:00-18:00', status: 'Planned' },
        Fri: { time: '09:00-13:00', status: 'Planned' },
        Sat: { time: '—', status: 'Off' },
        Sun: { time: '—', status: 'Off' },
      }
    },
    {
      id: 'EMP-0285',
      name: 'Zara Nor',
      initials: 'ZN',
      dept: 'Operations',
      schedule: {
        Mon: { time: '09:00-18:00', status: 'Completed' },
        Tue: { time: '—', status: 'Absent' },
        Wed: { time: '09:00-18:00', status: 'Clock in' },
        Thu: { time: '09:00-18:00', status: 'Planned' },
        Fri: { time: '09:00-13:00', status: 'Planned' },
        Sat: { time: '—', status: 'Off' },
        Sun: { time: '—', status: 'Off' },
      }
    }
  ]);

  // Timesheets Data
  const [timesheets, setTimesheets] = useState([
    { id: '1', name: 'Sarah Lim', dept: 'Engineering', shift: 'Standard', start: '1 May', end: '31 May', days: 22, dutyDays: 'Mon-Fri', status: 'Active' },
    { id: '2', name: 'Raj Kumar', dept: 'Engineering', shift: 'Std + OT', start: '1 May', end: '31 May', days: 22, dutyDays: 'Mon-Fri', status: 'Active' },
    { id: '3', name: 'Maya Tan', dept: 'HR', shift: 'Standard', start: '1 May', end: '31 May', days: 22, dutyDays: 'Mon-Fri', status: 'On leave' },
    { id: '4', name: 'Ahmad L', dept: 'Operations', shift: 'Night shift', start: '1 May', end: '31 May', days: 22, dutyDays: 'Mon-Fri', status: 'Active' },
    { id: '5', name: 'Nadia Chen', dept: 'Marketing', shift: 'Standard', start: '1 May', end: '31 May', days: 22, dutyDays: 'Mon-Fri', status: 'Active' },
    { id: '6', name: 'Zara Nor', dept: 'Operations', shift: 'Standard', start: '1 May', end: '31 May', days: 22, dutyDays: 'Mon-Fri', status: 'Active' },
  ]);

  // Shift Patterns Data
  const [shiftPatterns, setShiftPatterns] = useState([
    {
      name: 'Standard shift',
      activeOnly: true,
      data: {
        hours: '09:00 - 18:00',
        breakTime: '13:00 - 14:00 (1h)',
        nearestIn: '08:00 - 10:00',
        nearestOut: '17:00 - 19:30',
        allowInOT: '60 mins',
        allowOutOT: '60 mins',
        nightShift: 'No',
        employees: 892
      }
    },
    {
      name: 'Night shift',
      activeOnly: true,
      data: {
        hours: '22:00 - 07:00',
        breakTime: '02:00 - 03:00 (1h)',
        nearestIn: '21:00 - 23:00',
        nearestOut: '06:00 - 08:00',
        allowInOT: '30 mins',
        allowOutOT: '30 mins',
        nightShift: 'Yes',
        employees: 124
      }
    },
    {
      name: 'Split shift',
      activeOnly: true,
      data: {
        hours: '08:00-13:00 / 14:00-18:00',
        breakTime: '13:00 - 14:00 (1h)',
        nearestIn: '07:30 - 09:00',
        nearestOut: '17:30 - 19:00',
        allowInOT: '45 mins',
        allowOutOT: '45 mins',
        nightShift: 'No',
        employees: 68
      }
    },
    {
      name: 'Half day (AM)',
      activeOnly: true,
      data: {
        hours: '09:00 - 13:00',
        breakTime: '—',
        nearestIn: '08:30 - 09:30',
        nearestOut: '12:30 - 14:00',
        allowInOT: '30 mins',
        allowOutOT: '30 mins',
        nightShift: 'No',
        employees: 'Fri only'
      }
    }
  ]);

  // Roll Call states
  const [rollCallDate, setRollCallDate] = useState('2026-06-05');
  const [rollCallRows, setRollCallRows] = useState([
    { name: 'Sarah Lim', initials: 'SL', dept: 'Engineering', shift: 'Standard', in: '08:58', out: '—', hrs: '—', office: 'Yes', status: 'In office' },
    { name: 'Raj Kumar', initials: 'RK', dept: 'Engineering', shift: 'Standard', in: '09:02', out: '—', hrs: '—', office: 'Yes', status: 'In office' },
    { name: 'Maya Tan', initials: 'MT', dept: 'HR', shift: 'Standard', in: '—', out: '—', hrs: '—', office: '—', status: 'On leave' },
    { name: 'Ahmad L', initials: 'AL', dept: 'Operations', shift: 'Standard', in: '09:28', out: '—', hrs: '—', office: 'Yes', status: 'Late' },
    { name: 'Nadia Chen', initials: 'NC', dept: 'Marketing', shift: 'Standard', in: '08:54', out: '17:12', hrs: '8h 18m', office: 'No', status: 'Completed' },
    { name: 'Zara Nor', initials: 'ZN', dept: 'Operations', shift: 'Standard', in: '—', out: '—', hrs: '—', office: '—', status: 'Absent' },
  ]);

  // Manual Punch Form states
  const [punchEmployee, setPunchEmployee] = useState('');
  const [punchDate, setPunchDate] = useState('2026-06-05');
  const [punchType, setPunchType] = useState('Clock In');
  const [punchTime, setPunchTime] = useState('09:00 AM');
  const [punchReason, setPunchReason] = useState('Fingerprint device offline');
  const [punchRemark, setPunchRemark] = useState('');
  const [todayManualPunches, setTodayManualPunches] = useState([
    { id: '1', name: 'Sarah Lim', code: 'EMP-0021', type: 'Clock In', time: '08:55', reason: 'Device offline', badge: 'In' },
    { id: '2', name: 'Ahmad Luqman', code: 'EMP-0187', type: 'Clock In', time: '09:10', reason: 'Forgot to swipe', badge: 'In' },
    { id: '3', name: 'Nadia Chen', code: 'EMP-0092', type: 'Clock Out', time: '17:30', reason: 'Remote work', badge: 'Out' },
    { id: '4', name: 'Raj Kumar', code: 'EMP-0048', type: 'Clock Out', time: '18:05', reason: 'Biometric', badge: 'Auto' },
  ]);

  // Unknown Swipes Data
  const [unresolvedSwipes, setUnresolvedSwipes] = useState([
    { id: 'TA-00451', name: 'Sarah Lim', initials: 'SL', time: '07:44 AM', terminal: 'Main lobby', issue: 'Outside nearest time (in)', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { id: 'Unknown', name: '—', initials: '?', time: '08:12 AM', terminal: 'Level 3', issue: 'No TA match', color: 'bg-red-50 text-red-700 border-red-200' },
    { id: 'TA-00452', name: 'Ahmad L', initials: 'AL', time: '06:58 PM', terminal: 'Level 3', issue: 'Outside nearest time (out)', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { id: 'TA-00389', name: 'Nadia C', initials: 'NC', time: '05:42 PM', terminal: 'Main lobby', issue: 'Multi swipe', color: 'bg-[#faf0e6] text-[#b45309] border-[#fed7aa]' },
  ]);

  // Overtime states
  const [otRecords, setOtRecords] = useState([
    { name: 'Raj K', initials: 'RK', date: '6 May', start: '18:00', end: '20:00', hrs: '2h 00m' },
    { name: 'Sarah L', initials: 'SL', date: '5 May', start: '18:00', end: '19:30', hrs: '1h 30m' },
    { name: 'Nadia C', initials: 'NC', date: '4 May', start: '18:30', end: '20:00', hrs: '1h 30m' },
    { name: 'Zara N', initials: 'ZN', date: '3 May', start: '22:00', end: '23:30', hrs: '1h 30m' },
  ]);

  const [otPolicy, setOtPolicy] = useState([
    { label: 'Allow in OT (pre-shift)', value: '60 mins' },
    { label: 'Allow out OT (post-shift)', value: '60 mins' },
    { label: 'OT rounding block', value: '30 min' },
    { label: 'Min OT threshold', value: '30 mins' },
    { label: 'Weekday OT rate', value: '1.0×' },
    { label: 'Weekend OT rate', value: '1.5×' },
    { label: 'Public holiday OT', value: '2.0×' },
    { label: 'Shift allowance on OT', value: 'Yes', isGreen: true },
    { label: 'Supper allowance on OT', value: 'Yes', isGreen: true },
  ]);

  // Reports states
  const [reportType, setReportType] = useState<'detail' | 'summary'>('detail');
  const [reportMonth, setReportMonth] = useState('May 2026');
  const [reportsFilterDept, setReportsFilterDept] = useState('All departments');
  const [reportsFilterEmp, setReportsFilterEmp] = useState('');
  const [reportsRows, _setReportsRows] = useState([
    { name: 'Sarah L', initials: 'SL', date: '5 May', shift: 'Standard', in: '08:58', out: '18:05', hrs: '9h 7m', late: '—', ot: '1h 5m', status: 'Completed' },
    { name: 'Raj K', initials: 'RK', date: '5 May', shift: 'Standard', in: '09:02', out: '20:10', hrs: '11h 8m', late: '—', ot: '2h 8m', status: 'Completed' },
    { name: 'Maya T', initials: 'MT', date: '5 May', shift: 'Standard', in: '—', out: '—', hrs: '—', late: '—', ot: '—', status: 'Leave' },
    { name: 'Ahmad L', initials: 'AL', date: '5 May', shift: 'Standard', in: '09:28', out: '18:30', hrs: '9h 2m', late: '28m', ot: '—', status: 'Late' },
    { name: 'Nadia C', initials: 'NC', date: '5 May', shift: 'Standard', in: '08:54', out: '17:12', hrs: '8h 18m', late: '—', ot: '—', status: 'Completed' },
    { name: 'Zara N', initials: 'ZN', date: '5 May', shift: 'Standard', in: '—', out: '—', hrs: '—', late: '—', ot: '—', status: 'Absent' },
  ]);

  // Modal states
  const [shiftModalOpen, setShiftModalOpen] = useState(false);
  const [newShift, setNewShift] = useState({
    name: '',
    hours: '09:00 - 18:00',
    breakTime: '13:00 - 14:00 (1h)',
    nearestIn: '08:00 - 10:00',
    nearestOut: '17:00 - 19:30',
    allowInOT: '60 mins',
    allowOutOT: '60 mins',
    nightShift: 'No',
    employees: '0'
  });

  // New interactive feature states
  const [timesheetModalOpen, setTimesheetModalOpen] = useState(false);
  const [newTimesheet, setNewTimesheet] = useState({
    employeeId: '',
    shift: 'Standard shift',
    start: '1 May 2026',
    end: '31 May 2026',
    days: 22,
    dutyDays: 'Mon-Fri'
  });
  const [editTimesheetModalOpen, setEditTimesheetModalOpen] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState<{
    id: string;
    name: string;
    dept: string;
    shift: string;
    start: string;
    end: string;
    days: number;
    dutyDays: string;
    status: string;
  } | null>(null);

  const [otSetupModalOpen, setOtSetupModalOpen] = useState(false);
  const [newOtSetup, setNewOtSetup] = useState({
    employeeId: '',
    date: '2026-06-13',
    start: '18:00',
    end: '20:00',
    hrs: '2.0'
  });

  const [otPolicyModalOpen, setOtPolicyModalOpen] = useState(false);
  const [selectedPolicyIndex, setSelectedPolicyIndex] = useState<number | null>(null);
  const [policyEditValue, setPolicyEditValue] = useState('');

  const subTabs = [
    'Check-In',
    'Duty Roster',
    'Timesheet',
    'Shift Pattern',
    'Roll Call',
    'Manual Punch',
    'Unknown Swipes',
    'Overtime',
    'Reports',
  ];

  const handleSubTabChange = (tab: string) => {
    setActiveSubTab(tab);
    addToast(`Switched view directory to ${tab}`, 'info');
  };

  const handleAddManualPunchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!punchEmployee) {
      addToast('Please select a valid employee record', 'error');
      return;
    }

    addToast('Verifying fingerprint reader log alignments...', 'loading');

    setTimeout(() => {
      const selected = rosterData.find(r => r.id === punchEmployee) || { name: 'Custom Name', id: punchEmployee };
      const newRec = {
        id: Math.random().toString(),
        name: selected.name,
        code: selected.id,
        type: punchType,
        time: punchTime,
        reason: punchReason,
        badge: punchType === 'Clock In' ? 'In' : 'Out'
      };

      setTodayManualPunches(prev => [newRec, ...prev]);
      addToast(`Successfully manually processed ${punchType} for ${selected.name}`, 'success');

      // Update Roster / Roll Call representation
      if (punchType === 'Clock In') {
        // Adjust Sarah Lim, Raj Kumar etc
        setRollCallRows(prev =>
          prev.map(row => row.name === selected.name ? { ...row, in: punchTime, status: 'In office', office: 'Yes' } : row)
        );
      } else {
        setRollCallRows(prev =>
          prev.map(row => row.name === selected.name ? { ...row, out: punchTime, status: 'Completed', office: 'No' } : row)
        );
      }

      setPunchEmployee('');
      setPunchRemark('');
    }, 1200);
  };

  const handleCreateShiftPattern = (e: FormEvent) => {
    e.preventDefault();
    if (!newShift.name) {
      addToast('Please define a valid pattern name', 'error');
      return;
    }

    setShiftPatterns(prev => [
      ...prev,
      {
        name: newShift.name,
        activeOnly: true,
        data: {
          hours: newShift.hours,
          breakTime: newShift.breakTime,
          nearestIn: newShift.nearestIn,
          nearestOut: newShift.nearestOut,
          allowInOT: newShift.allowInOT,
          allowOutOT: newShift.allowOutOT,
          nightShift: newShift.nightShift,
          employees: 0
        }
      }
    ]);

    addToast(`Constructed and assigned new corporate shift layout: ${newShift.name}`, 'success');
    setShiftModalOpen(false);
    setNewShift({
      name: '',
      hours: '09:00 - 18:00',
      breakTime: '13:00 - 14:00 (1h)',
      nearestIn: '08:00 - 10:00',
      nearestOut: '17:00 - 19:30',
      allowInOT: '60 mins',
      allowOutOT: '60 mins',
      nightShift: 'No',
      employees: '0'
    });
  };

  const handleResolveSwipe = (id: string, name: string) => {
    addToast(`Resolving swipe sequence for ${name}...`, 'loading');
    setTimeout(() => {
      setUnresolvedSwipes(prev => prev.filter(s => s.id !== id));
      addToast(`TA check-in record aligned and authorized. Ticket ${id} moved from Unresolved.`, 'success');
    }, 1000);
  };

  const executeCheckInFlow = () => {
    if (!checkedIn) {
      addToast('Syncing biometric authentication...', 'loading');
      setTimeout(() => {
        setCheckedIn(true);
        const now = new Date();
        const stamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setCheckInTime(stamp);
        setCheckOutTime(null);
        addToast(`Successfully checked in today at ${stamp}! Have a productive day.`, 'success');
      }, 1100);
    } else {
      addToast('Ending active attendance session...', 'loading');
      setTimeout(() => {
        setCheckedIn(false);
        const now = new Date();
        const stamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setCheckOutTime(stamp);
        addToast(`Successfully checked out at ${stamp}. Logs compiled cleanly.`, 'success');

        // Add to recent log
        const newLog = {
          date: new Date().toISOString().split('T')[0],
          in: checkInTime || '09:00 AM',
          out: stamp,
          hours: '8.5',
          status: 'PRESENT'
        };
        setRecentChecks(prev => [newLog, ...prev]);
      }, 1100);
    }
  };

  const handleCreateTimesheetSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newTimesheet.employeeId) {
      addToast('Please select a valid employee record for the timesheet', 'error');
      return;
    }
    const emp = rosterData.find(r => r.id === newTimesheet.employeeId);
    const empName = emp ? emp.name : 'Unknown';
    const empDept = emp ? emp.dept : 'Engineering';

    const createdRec = {
      id: Math.random().toString(),
      name: empName,
      dept: empDept,
      shift: newTimesheet.shift,
      start: newTimesheet.start,
      end: newTimesheet.end,
      days: Number(newTimesheet.days) || 22,
      dutyDays: newTimesheet.dutyDays,
      status: 'Active' as const
    };

    setTimesheets(prev => [createdRec, ...prev]);
    addToast(`Corporate Timesheet created dynamically for ${empName}`, 'success');
    setTimesheetModalOpen(false);
    setNewTimesheet({
      employeeId: '',
      shift: 'Standard shift',
      start: '1 May 2026',
      end: '31 May 2026',
      days: 22,
      dutyDays: 'Mon-Fri'
    });
  };

  const handleEditTimesheetSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedTimesheet) {
      addToast('No selected timesheet to update', 'error');
      return;
    }
    setTimesheets(prev => prev.map(t => t.id === selectedTimesheet.id ? selectedTimesheet : t));
    addToast(`Corporate Timesheet configuration successfully revised for ${selectedTimesheet.name}`, 'success');
    setEditTimesheetModalOpen(false);
    setSelectedTimesheet(null);
  };

  const handleCreateOtSetupSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newOtSetup.employeeId) {
      addToast('Please select a valid employee record for Overtime alignment', 'error');
      return;
    }
    const emp = rosterData.find(r => r.id === newOtSetup.employeeId);
    const empName = emp ? emp.name : 'Unknown';
    const empInitials = emp ? emp.initials : 'UN';

    const hoursNum = Number(newOtSetup.hrs) || 2.0;
    const wholeHours = Math.floor(hoursNum);
    const decimalRemainder = hoursNum - wholeHours;
    const mins = Math.round(decimalRemainder * 60);
    const formatHrs = `${wholeHours}h ${mins > 0 ? mins + 'm' : '00m'}`;

    const createdRec = {
      name: empName,
      initials: empInitials,
      date: newOtSetup.date,
      start: newOtSetup.start,
      end: newOtSetup.end,
      hrs: formatHrs
    };

    setOtRecords(prev => [createdRec, ...prev]);
    addToast(`Overtime Alignment approved & configured for ${empName}`, 'success');
    setOtSetupModalOpen(false);
    setNewOtSetup({
      employeeId: '',
      date: '2026-06-13',
      start: '18:00',
      end: '20:00',
      hrs: '2.0'
    });
  };

  const handleSaveOtPolicySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (selectedPolicyIndex === null) return;
    setOtPolicy(prev => prev.map((item, idx) => {
      if (idx === selectedPolicyIndex) {
        return { ...item, value: policyEditValue };
      }
      return item;
    }));
    addToast('Compliance Overtime Policy ruleset revised and saved', 'success');
    setOtPolicyModalOpen(false);
    setSelectedPolicyIndex(null);
  };

  const handleExportRoster = () => {
    addToast('Structuring and generating attendance roster sheets...', 'loading');
    setTimeout(() => {
      addToast('Export_Active_Roster_May2026.xlsx successfully compiled and downloaded.', 'success');
    }, 1500);
  };

  const handleTriggerTimesheetAction = (action: string) => {
    addToast(`Triggering custom Timesheet processor: ${action}`, 'success');
  };

  return (
    <div id="attendance-portal-stage" className="space-y-6">
      
      {/* Upper Navigation sub-menus completely aligned and capitalized */}
      <div id="attendance-module-navigator" className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-200/85 pb-4 gap-4 min-w-0">
        <div id="attendance-navigation-tabs" className="flex items-center gap-2 select-none overflow-x-auto flex-1 min-w-0 scrollbar-none pb-1">
          {subTabs.map((tab) => {
            const isActive = activeSubTab === tab;
            return (
              <button
                id={`tab-${tab.toLowerCase().replace(/\s+/g, '-')}`}
                key={tab}
                type="button"
                onClick={() => handleSubTabChange(tab)}
                className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all shrink-0 relative cursor-pointer inline-flex items-center gap-1.5 ${
                  isActive
                    ? 'text-[#2f66e0] bg-[#2f66e0]/10 border border-[#2f66e0]/15 font-extrabold'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
                }`}
              >
                <span>{tab}</span>
                {tab === 'Unknown Swipes' && unresolvedSwipes.length > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[1.15rem] h-[1.15rem] px-1 rounded-full bg-red-500 text-white text-[9px] font-extrabold leading-none tabular-nums">
                    {unresolvedSwipes.length}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#2f66e0] rounded-sm" />
                )}
              </button>
            );
          })}
        </div>

        {/* Outer Header Actions aligned elegantly */}
        <div id="attendance-upper-actions" className="flex items-center gap-3 shrink-0">
          <div id="department-selector" className="relative">
            <button
              type="button"
              onClick={() => setDeptDropdownOpen(!deptDropdownOpen)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 transition-colors rounded-xl cursor-pointer whitespace-nowrap shrink-0"
            >
              <span className="whitespace-nowrap">{deptFilter}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            </button>
            {deptDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
                {['All departments', 'Engineering', 'HR', 'Marketing', 'Operations'].map((dept) => (
                  <button
                    key={dept}
                    onClick={() => {
                      setDeptFilter(dept);
                      setDeptDropdownOpen(false);
                      addToast(`Roster filtered dynamically to ${dept}`, 'info');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[#2f66e0] transition-colors"
                  >
                    {dept}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleExportRoster}
            className="bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 font-bold text-xs text-slate-700 px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>Export</span>
          </button>

          <button
            onClick={() => handleSubTabChange('Manual Punch')}
            className="bg-[#2f66e0] hover:opacity-95 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Manual Punch</span>
          </button>
        </div>
      </div>

      {/* Main Switchboard Stage Container */}
      <div id="attendance-active-tab-panel" className="min-h-[460px]">

        {/* 1. CHECK-IN SUB-TAB */}
        {activeSubTab === 'Check-In' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Clocking Station Control Panel */}
            <div className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-5">
              <div>
                <h4 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#2f66e0]" />
                  <span>Interactive Attendance Workstation</span>
                </h4>
                <p className="text-[11px] font-semibold text-slate-400 mt-1">
                  Secure local biometric terminal alignment
                </p>
              </div>

              <div id="checkin-timer-widget" className="bg-slate-50/70 p-6 rounded-2xl border border-slate-100 text-center space-y-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">
                  Today ({new Date().toISOString().split('T')[0]})
                </span>

                <div className="space-y-1">
                  <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight font-mono">
                    {checkedIn ? checkInTime : '—'}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400">
                    Checked In Server Time
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-left border-t border-slate-200/50">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Check-In</span>
                    <span className="text-xs font-extrabold text-slate-700">{checkInTime || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 block uppercase">Check-Out</span>
                    <span className="text-xs font-extrabold text-slate-700">{checkOutTime || '—'}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-[11px] font-bold text-slate-500">
                    Status: {checkedIn ? (
                      <span className="text-emerald-500 font-extrabold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 italic inline-block">● ACTIVE WORK SESSION</span>
                    ) : (
                      <span className="text-slate-400">Not Clocked-In</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={executeCheckInFlow}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs tracking-wide transition-all uppercase cursor-pointer text-center ${
                    checkedIn
                      ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100/70'
                      : 'bg-[#2f66e0] hover:opacity-95 text-white shadow-xs'
                  }`}
                >
                  {checkedIn ? 'Check Out of Session' : 'Clock Check-In Now'}
                </button>
                <p className="text-[10px] text-center text-slate-400 font-medium">
                  Matches your login email authentication: {navigator.userAgent.includes('Mobile') ? 'Mobile App Key' : 'Web Console Login'}
                </p>
              </div>
            </div>

            {/* Recent Attendance Days Ledger */}
            <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 tracking-tight">Recent Days Log</h4>
                  <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Your official biometric timesheet audit trail</p>
                </div>
                <span className="text-xs font-bold text-[#2f66e0] cursor-pointer hover:underline">View comprehensive history</span>
              </div>

              <div className="divide-y divide-slate-100">
                {recentChecks.map((log, index) => (
                  <div key={index} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="h-8.5 w-8.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700">{log.date}</p>
                        <p className="text-[10px] font-semibold text-slate-400">
                          {log.in} &rarr; {log.out}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-1 sm:mt-0">
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-600 block">{log.hours} hrs completed</span>
                        <span className="text-[8px] font-semibold text-slate-400 uppercase">Timesheet matched</span>
                      </div>
                      <span className="bg-emerald-50 text-emerald-600 text-[10px] font-extrabold px-2.5 py-1 rounded-md border border-emerald-100 uppercase tracking-widest">
                        {log.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. DUTY ROSTER SUB-TAB */}
        {activeSubTab === 'Duty Roster' && (
          <div className="space-y-6">
            
            {/* Week Scheduler Top controls */}
            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500"> Roster Period: </span>
                <span className="text-sm font-extrabold text-slate-800 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">5 – 11 May 2026</span>
                
                <div id="roster-arrow-controls" className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <button className="p-2 hover:bg-slate-50 text-slate-500" onClick={() => addToast('Displaying preceding rosters', 'info')}><ChevronLeft className="h-4 w-4" /></button>
                  <button className="p-2 hover:bg-slate-50 text-slate-500 border-l border-slate-100" onClick={() => addToast('Displaying following rosters', 'info')}><ChevronRight className="h-4 w-4" /></button>
                </div>
              </div>

              {/* Day Segment Controls */}
              <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200/50">
                {(['Week', 'Day', 'Month'] as const).map((view) => (
                  <button
                    key={view}
                    onClick={() => {
                      setRosterView(view);
                      addToast(`Switched calendar matrix view into ${view}`, 'info');
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      rosterView === view
                        ? 'bg-white text-slate-800 shadow-xs ring-1 ring-slate-100'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>

            {/* Large Schedule Table */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="p-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider min-w-[180px]">Employee Card</th>
                      <th className="p-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Mon 5</th>
                      <th className="p-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Tue 6</th>
                      <th className="p-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Wed 7</th>
                      <th className="p-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Thu 8</th>
                      <th className="p-3 text-center text-[11px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50/20">
                        Fri 9 <span className="block text-[8px] font-normal italic">half day</span>
                      </th>
                      <th className="p-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Sat 10</th>
                      <th className="p-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Sun 11</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rosterData
                      .filter(emp => deptFilter === 'All departments' || emp.dept === deptFilter)
                      .map((emp) => (
                        <tr key={emp.id} className="hover:bg-slate-50/40 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-xs">
                                <span className="text-xs font-extrabold text-indigo-600">{emp.initials}</span>
                              </div>
                              <div>
                                <h5 className="text-xs font-bold text-slate-800 leading-normal">{emp.name}</h5>
                                <p className="text-[10px] font-semibold text-slate-400 leading-none mt-0.5">{emp.dept}</p>
                              </div>
                            </div>
                          </td>

                          {/* Render cells for each weekday */}
                          {Object.keys(emp.schedule).map((dayKey) => {
                            const sched = emp.schedule[dayKey as keyof typeof emp.schedule];
                            let cellBg = 'bg-slate-50 text-slate-400 border-slate-100';
                            let indicatorColor = 'bg-slate-300';

                            if (sched.status === 'Completed') {
                              cellBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                              indicatorColor = 'bg-emerald-500';
                            } else if (sched.status === 'Clock in' || sched.status === 'OT active' || sched.status === 'Late in') {
                              cellBg = 'bg-sky-50 text-sky-700 border-sky-200';
                              indicatorColor = 'bg-sky-500';
                            } else if (sched.status === 'On leave') {
                              cellBg = 'bg-amber-50 text-amber-700 border-amber-200';
                              indicatorColor = 'bg-amber-500';
                            } else if (sched.status === 'Planned') {
                              cellBg = 'bg-violet-50 text-violet-700 border-violet-200';
                              indicatorColor = 'bg-violet-500';
                            } else if (sched.status === 'Absent') {
                              cellBg = 'bg-rose-50 text-rose-700 border-rose-200';
                              indicatorColor = 'bg-rose-500';
                            } else if (sched.status === 'Night') {
                              cellBg = 'bg-indigo-50 text-indigo-700 border-indigo-200';
                              indicatorColor = 'bg-indigo-500';
                            }

                            const hideTitle = sched.time === '—' || sched.time === sched.status;
                            return (
                              <td key={dayKey} className="p-2 text-center">
                                <div className={`p-2.5 rounded-xl border text-[10px] font-extrabold text-center mx-auto max-w-[110px] space-y-0.5 ${cellBg}`}>
                                  {!hideTitle ? <span className="block truncate">{sched.time}</span> : null}
                                  <span className="inline-flex items-center justify-center gap-1 text-[8px] font-extrabold tracking-wide opacity-85">
                                    <span className={`h-1 w-1 rounded-full shrink-0 ${indicatorColor}`} />
                                    {sched.status}
                                  </span>
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom Schedule Legend Panel */}
              <div className="bg-slate-50 border-t border-slate-100 p-4">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Duty Legend Indicator Values</div>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600"><span className="h-3 w-3 rounded-md bg-emerald-500 inline-block border border-emerald-100" /> Completed</span>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600"><span className="h-3 w-3 rounded-md bg-sky-500 inline-block border border-sky-100" /> Clock in / OT Active</span>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600"><span className="h-3 w-3 rounded-md bg-violet-400 inline-block border border-violet-100" /> Planned / Off</span>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600"><span className="h-3 w-3 rounded-md bg-amber-400 inline-block border border-amber-100" /> On leave / Sick</span>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600"><span className="h-3 w-3 rounded-md bg-indigo-500 inline-block border border-indigo-100" /> Night shift</span>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600"><span className="h-3 w-3 rounded-md bg-rose-500 inline-block border border-rose-100" /> Absent (No swiped badge)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. TIMESHEET SUB-TAB */}
        {activeSubTab === 'Timesheet' && (
          <div className="space-y-5">
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <select className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs font-bold text-slate-700">
                  <option>Single shift</option>
                  <option>Flexible rosters</option>
                </select>
                <select className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs font-bold text-slate-700">
                  <option>Standard 9-6</option>
                  <option>Night Shift 10-7</option>
                  <option>Alternative OT patterns</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTriggerTimesheetAction('Copy')}
                  className="bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 font-bold text-xs text-slate-700 px-3.5 py-2 rounded-xl transition-all shadow-xs shrink-0 flex items-center gap-2 cursor-pointer"
                >
                  <span>Copy timesheet</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTimesheetModalOpen(true)}
                  className="bg-[#2f66e0] hover:opacity-95 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs shrink-0 flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Create timesheet</span>
                </button>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="pb-3 pl-3">Employee</th>
                      <th className="pb-3">Department</th>
                      <th className="pb-3">Assigned Shift</th>
                      <th className="pb-3">Date From</th>
                      <th className="pb-3">Date To</th>
                      <th className="pb-3 text-center">Duty Days</th>
                      <th className="pb-3">Working Logic</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right pr-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {timesheets
                      .filter(t => deptFilter === 'All departments' || t.dept === deptFilter)
                      .map((t) => (
                        <tr key={t.id} className="text-xs hover:bg-slate-50/10">
                          <td className="py-3.5 pl-3">
                            <span className="font-extrabold text-slate-800">{t.name}</span>
                          </td>
                          <td className="py-3.5 font-semibold text-slate-500">{t.dept}</td>
                          <td className="py-3.5"><span className="text-slate-700 font-bold">{t.shift}</span></td>
                          <td className="py-3.5 font-semibold text-slate-500">{t.start}</td>
                          <td className="py-3.5 font-semibold text-slate-500">{t.end}</td>
                          <td className="py-3.5 font-bold text-slate-700 text-center">{t.days}</td>
                          <td className="py-3.5 font-bold text-slate-400">{t.dutyDays}</td>
                          <td className="py-3.5">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold border ${
                              t.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                : 'bg-amber-50 text-amber-600 border-amber-100'
                            }`}>
                              {t.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-right pr-3">
                            <button
                              onClick={() => {
                                setSelectedTimesheet(t);
                                setEditTimesheetModalOpen(true);
                              }}
                              className="text-slate-400 hover:text-[#2f66e0] transition-colors inline-block font-extrabold cursor-pointer hover:underline"
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

        {/* 4. SHIFT PATTERN SUB-TAB */}
        {activeSubTab === 'Shift Pattern' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full border border-slate-100 inline-block">
                  Shift patterns defined: {shiftPatterns.length} patterns
                </p>
              </div>
              <button
                onClick={() => setShiftModalOpen(true)}
                className="bg-[#2f66e0] hover:opacity-95 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="h-4 w-4" />
                <span>New Shift Pattern</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {shiftPatterns.map((pat, idx) => (
                <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow relative space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-800 tracking-tight">{pat.name}</h4>
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-extrabold px-2.5 py-0.5 rounded border border-emerald-100">
                      Active
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-t border-slate-100 pt-3 text-xs leading-relaxed">
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">Work Hours</span>
                      <span className="font-extrabold text-slate-700">{pat.data.hours}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">Break Time</span>
                      <span className="font-semibold text-slate-500">{pat.data.breakTime}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">Nearest Time (In)</span>
                      <span className="font-semibold text-slate-500">{pat.data.nearestIn}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">Nearest Time (Out)</span>
                      <span className="font-semibold text-slate-500">{pat.data.nearestOut}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">Allow in OT</span>
                      <span className="font-semibold text-slate-500">{pat.data.allowInOT}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">Allow out OT</span>
                      <span className="font-semibold text-slate-500">{pat.data.allowOutOT}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">Night Shift</span>
                      <span className={`font-extrabold ${pat.data.nightShift === 'Yes' ? 'text-indigo-600' : 'text-slate-500'}`}>{pat.data.nightShift}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase">Assigned Employees</span>
                      <span className="font-extrabold text-[#2f66e0]">{pat.data.employees}</span>
                    </div>

                    {/* Interactive card footer actions */}
                    <div className="col-span-2 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          addToast(`Modifying schedule details and boundary limits for ${pat.name}`, 'info');
                        }}
                        className="text-[10px] font-bold text-[#2f66e0] hover:underline"
                      >
                        Edit rules
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShiftPatterns(prev => prev.map((p, pIdx) => {
                              if (pIdx === idx) {
                                const currentCount = typeof p.data.employees === 'number' ? p.data.employees : 0;
                                return { ...p, data: { ...p.data, employees: currentCount + 1 } };
                              }
                              return p;
                            }));
                            addToast(`Assigned 1 new employee to ${pat.name}`, 'success');
                          }}
                          className="bg-slate-50 border border-slate-200 py-1 px-2.5 rounded-lg text-[9px] font-extrabold hover:bg-[#2f66e0]/10 hover:text-[#2f66e0] hover:border-[#2f66e0]/10 transition-colors"
                        >
                          + Assign Staff
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (shiftPatterns.length <= 1) {
                              addToast('Cannot delete the last remaining corporate shift pattern', 'error');
                              return;
                            }
                            setShiftPatterns(prev => prev.filter((_, pIdx) => pIdx !== idx));
                            addToast(`Archived and unlinked shift pattern: ${pat.name}`, 'success');
                          }}
                          className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                          title="Archive pattern"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. ROLL CALL SUB-TAB */}
        {activeSubTab === 'Roll Call' && (
          <div className="space-y-5">
            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="date"
                  value={rollCallDate}
                  onChange={(e) => setRollCallDate(e.target.value)}
                  className="bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-xl text-xs font-bold text-slate-700"
                />

                <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-100">
                  Present: 1,148
                </span>
                <span className="bg-rose-50 text-rose-600 text-xs font-bold px-3 py-1.5 rounded-xl border border-rose-100">
                  Absent: 23
                </span>
                <span className="bg-amber-50 text-amber-600 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-100">
                  On leave: 47
                </span>
              </div>

              <button
                onClick={() => addToast('Compiling custom roll call report spreadsheet...', 'success')}
                className="bg-white border border-slate-200 hover:bg-slate-50/50 font-bold text-xs text-slate-700 px-3.5 py-2.5 rounded-xl shadow-xs shrink-0 cursor-pointer"
              >
                <span>Export roll call</span>
              </button>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="pb-3 pl-3">Employee</th>
                      <th className="pb-3">Department</th>
                      <th className="pb-3">Shift</th>
                      <th className="pb-3">Clock In</th>
                      <th className="pb-3">Clock Out</th>
                      <th className="pb-3">Work Hours</th>
                      <th className="pb-3 text-center">In Office?</th>
                      <th className="pb-3 pr-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rollCallRows
                      .filter(row => deptFilter === 'All departments' || row.dept === deptFilter)
                      .map((row, idx) => {
                        let bgStatus = 'bg-slate-50 text-slate-600';

                        if (row.status === 'In office') {
                          bgStatus = 'bg-blue-50 text-blue-600 border-blue-100';
                        } else if (row.status === 'Completed') {
                          bgStatus = 'bg-emerald-50 text-emerald-600 border-emerald-100';
                        } else if (row.status === 'Late') {
                          bgStatus = 'bg-violet-50 text-violet-600 border-violet-100';
                        } else if (row.status === 'Absent') {
                          bgStatus = 'bg-rose-50 text-rose-600 border-rose-100';
                        } else if (row.status === 'On leave') {
                          bgStatus = 'bg-amber-50 text-amber-600 border-amber-100';
                        }

                        return (
                          <tr key={idx} className="text-xs hover:bg-slate-50/20">
                            <td className="py-3 pl-3">
                              <div className="flex items-center gap-3.5">
                                <div className="h-7 w-7 rounded bg-[#2f66e0]/8 text-[#2f66e0] font-bold flex items-center justify-center">
                                  {row.initials}
                                </div>
                                <span className="font-extrabold text-slate-800">{row.name}</span>
                              </div>
                            </td>
                            <td className="py-3 font-semibold text-slate-500">{row.dept}</td>
                            <td className="py-3 font-semibold text-slate-600">{row.shift}</td>
                            <td className="py-3 font-bold font-mono text-slate-700">{row.in}</td>
                            <td className="py-3 font-bold font-mono text-slate-700">{row.out}</td>
                            <td className="py-3 font-bold font-mono text-slate-500">{row.hrs}</td>
                            <td className="py-3 text-center text-xs">
                              {row.office === 'Yes' ? (
                                <span className="text-emerald-500 bg-emerald-50/50 px-2 py-0.5 rounded font-extrabold border border-emerald-100">Yes</span>
                              ) : row.office === 'No' ? (
                                <span className="text-slate-400 bg-slate-50 px-2 py-0.5 rounded font-extrabold border border-slate-100">No</span>
                              ) : (
                                <span className="text-slate-400">&mdash;</span>
                              )}
                            </td>
                            <td className="py-3 pr-3 text-right">
                              <span className={`px-2 py-0.5 border rounded-md text-[10px] font-extrabold ${bgStatus}`}>
                                {row.status}
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

        {/* 6. MANUAL PUNCH SUB-TAB */}
        {activeSubTab === 'Manual Punch' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* Left box 5cols: Entry Form */}
            <div className="xl:col-span-5 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-800 tracking-tight">Manual Punch Entry</h4>
                <p className="text-[11px] font-semibold text-slate-400 mt-1">Request paper trail or biometric bypass correction</p>
              </div>

              <form onSubmit={handleAddManualPunchSubmit} className="space-y-4.5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 block uppercase">Employee <span className="text-red-500">*</span></label>
                  <select
                    value={punchEmployee}
                    onChange={(e) => setPunchEmployee(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] p-2.5 rounded-xl text-xs font-bold text-slate-700"
                  >
                    <option value="">-- Select employee --</option>
                    {rosterData.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name} ({emp.id})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 block uppercase">Date <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      value={punchDate}
                      onChange={(e) => setPunchDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] p-2 text-xs font-bold text-slate-700"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 block uppercase">Punch Type <span className="text-red-500">*</span></label>
                    <select
                      value={punchType}
                      onChange={(e) => setPunchType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] p-2 text-xs font-bold text-slate-700"
                    >
                      <option value="Clock In">Clock In</option>
                      <option value="Clock Out">Clock Out</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 block uppercase">Time (Server Time)</label>
                  <input
                    type="text"
                    value={punchTime}
                    onChange={(e) => setPunchTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] p-2 text-xs font-bold font-mono text-slate-700"
                    placeholder="e.g. 09:00 AM"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 block uppercase">Reason</label>
                  <select
                    value={punchReason}
                    onChange={(e) => setPunchReason(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] p-2 text-xs font-bold text-slate-700"
                  >
                    <option value="Fingerprint device offline">Fingerprint device offline</option>
                    <option value="Forgot to swipe">Forgot to swipe</option>
                    <option value="Remote work">Remote work</option>
                    <option value="Biometric verification failed">Biometric failed</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 block uppercase">Remark</label>
                  <textarea
                    value={punchRemark}
                    onChange={(e) => setPunchRemark(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] p-2 text-xs font-semibold text-slate-600 h-16 rounded-xl"
                    placeholder="Optional note for HR record..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5 pt-2">
                  <button
                    type="submit"
                    onClick={() => setPunchType('Clock In')}
                    className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs py-3 rounded-xl transition-all cursor-pointer shadow-xs text-center"
                  >
                    Clock In
                  </button>
                  <button
                    type="submit"
                    onClick={() => setPunchType('Clock Out')}
                    className="bg-rose-50 hover:bg-rose-100/70 border border-rose-200 text-rose-600 font-bold text-xs py-3 rounded-xl transition-all cursor-pointer shadow-xs text-center"
                  >
                    Clock Out
                  </button>
                </div>
              </form>
            </div>

            {/* Right box 7cols: Matches "Today's manual punches (4 records) */}
            <div className="xl:col-span-7 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 tracking-tight">Today's Manual Punches</h4>
                  <p className="text-[11px] font-semibold text-slate-400 mt-0.5"> Biometric verification records logged manually today</p>
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full border border-slate-100 text-right">
                  {todayManualPunches.length} records
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {todayManualPunches.map((p) => (
                  <div key={p.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="text-base font-extrabold text-slate-800 font-mono tracking-tight leading-none bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                        {p.time}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{p.name} <span className="text-[10px] text-slate-400 font-semibold italic ml-1">{p.code}</span></p>
                        <p className="text-[10px] font-semibold text-slate-400">Type: {p.type} &bull; Reason: {p.reason}</p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 text-[10px] font-extrabold border rounded-md ${
                      p.badge === 'In'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : p.badge === 'Out'
                        ? 'bg-rose-50 text-rose-600 border-rose-100'
                        : 'bg-slate-50 text-slate-600 border-slate-100'
                    }`}>
                      {p.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 7. UNKNOWN SWIPES SUB-TAB */}
        {activeSubTab === 'Unknown Swipes' && (
          <div className="space-y-5">
            <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-slate-500">Unresolved Tickets: </span>
                <span className="bg-rose-50 text-rose-600 px-3 py-1 text-xs font-extrabold rounded-full border border-rose-100">
                  {unresolvedSwipes.length} unresolved
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    addToast('Evaluating match logic...', 'loading');
                    setTimeout(() => {
                      setUnresolvedSwipes([]);
                      addToast('Resolved and integrated all swipe tickets.', 'success');
                    }, 1000);
                  }}
                  className="bg-white border border-slate-200 hover:bg-slate-50/55 font-bold text-xs text-slate-700 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Resolve all
                </button>
                <button
                  onClick={() => addToast('Selected tickets marked to resolution workflows', 'info')}
                  className="bg-[#2f66e0] hover:opacity-95 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Resolve selected
                </button>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="pb-3 pl-3 w-12 text-center">
                        <input type="checkbox" className="rounded" defaultChecked />
                      </th>
                      <th className="pb-3">TA Number</th>
                      <th className="pb-3">Employee</th>
                      <th className="pb-3">Swipe Time</th>
                      <th className="pb-3">Terminal Location</th>
                      <th className="pb-3">Flagged Issue</th>
                      <th className="pb-3">Assign To Shift</th>
                      <th className="pb-3 pr-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {unresolvedSwipes.map((s, idx) => (
                      <tr key={idx} className="text-xs hover:bg-slate-50/20">
                        <td className="py-3.5 text-center">
                          <input type="checkbox" className="rounded border-slate-200" defaultChecked />
                        </td>
                        <td className="py-3.5 font-extrabold text-red-500 font-mono">{s.id}</td>
                        <td className="py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded bg-[#2f66e0]/8 text-[#2f66e0] font-bold flex items-center justify-center text-[10px]">
                              {s.initials}
                            </div>
                            <span className="font-bold text-slate-700">{s.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 font-bold text-slate-700 font-mono">{s.time}</td>
                        <td className="py-3.5 font-semibold text-slate-500">{s.terminal}</td>
                        <td className="py-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${s.color}`}>
                            {s.issue}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <select className="bg-slate-50 border border-slate-200 p-1 rounded font-bold text-[11px] text-slate-600 focus:border-[#2f66e0]">
                            <option>-- Assign --</option>
                            <option>Standard Shift 9-6</option>
                            <option>Night Shift 10-7</option>
                            <option>Flexible PM Shift</option>
                          </select>
                        </td>
                        <td className="py-3.5 text-right pr-3">
                          <button
                            onClick={() => handleResolveSwipe(s.id, s.name === '—' ? 'Biometric ID' : s.name)}
                            className="bg-white border border-slate-200 hover:border-emerald-300 hover:text-emerald-600 font-bold text-[10px] px-2.5 py-1 rounded transition-colors cursor-pointer shadow-xs"
                          >
                            Save
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

        {/* 8. OVERTIME SUB-TAB */}
        {activeSubTab === 'Overtime' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* Left Box Overtime Records */}
            <div className="xl:col-span-6 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 tracking-tight">Specific Overtime Records</h4>
                  <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Approved extra working hour datasets</p>
                </div>
                <button
                  onClick={() => setOtSetupModalOpen(true)}
                  className="bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 font-bold text-xs px-3.5 py-1.5 rounded-xl cursor-pointer shadow-3xs transition-all flex items-center gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5 text-slate-500" />
              <span>Add OT Setup</span>
                </button>
              </div>

              <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <th className="p-3 pl-4">Employee</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">OT Start</th>
                      <th className="p-3">OT End</th>
                      <th className="p-3 pr-4 text-right">Hours</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {otRecords.map((r, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/40">
                        <td className="p-3 pl-4 font-bold text-slate-800 flex items-center gap-2">
                          <span className="h-6 w-6 rounded bg-[#2f66e0]/10 text-[#2f66e0] font-extrabold flex items-center justify-center text-[10px]">{r.initials}</span>
                          {r.name}
                        </td>
                        <td className="p-3 font-semibold text-slate-500">{r.date}</td>
                        <td className="p-3 font-mono font-bold text-slate-600">{r.start}</td>
                        <td className="p-3 font-mono font-bold text-slate-600">{r.end}</td>
                        <td className="p-3 pr-4 font-extrabold text-[#2f66e0] font-mono text-right">{r.hrs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Card OT Policy current configurations */}
            <div className="xl:col-span-6 bg-white border border-slate-100 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 tracking-tight">OT Policy &mdash; Current Settings</h4>
                  <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Corporate compliance thresholds</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedPolicyIndex(0);
                    setPolicyEditValue(otPolicy[0].value);
                    setOtPolicyModalOpen(true);
                  }}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                >
                  Configure Rules
                </button>
              </div>

              <div className="divide-y divide-slate-100 text-xs leading-relaxed">
                {otPolicy.map((p, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedPolicyIndex(index);
                      setPolicyEditValue(p.value);
                      setOtPolicyModalOpen(true);
                    }}
                    className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0 hover:bg-slate-100/50 px-2 rounded-lg transition-colors cursor-pointer group"
                    title="Click override parameters for this specific item"
                  >
                    <span className="font-bold text-slate-600 flex items-center gap-2">
                      {p.label}
                      <span className="text-[9px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-normal flex items-center gap-0.5 border border-slate-200 px-1 rounded">
                        <Edit2 className="h-2 w-2" /> click to edit
                      </span>
                    </span>
                    <span className={`font-extrabold ${p.isGreen ? 'text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-100' : 'text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200'}`}>
                      {p.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 9. REPORTS SUB-TAB */}
        {activeSubTab === 'Reports' && (
          <div className="space-y-6">
            
            {/* 1. Statistics KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Adherence Rate</span>
                  <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">95.8%</h3>
                  <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">&uarr; 1.2% this week</span>
                </div>
                <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100/60 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-indigo-500" />
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Overtime</span>
                  <h3 className="text-xl font-extrabold text-[#2f66e0] tracking-tight">42.5 hrs</h3>
                  <span className="text-[9px] font-bold text-[#2f66e0] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">Across 18 staff</span>
                </div>
                <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100/60 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-[#2f66e0]" />
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">Avg Punctuality</span>
                  <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">92.4%</h3>
                  <span className="text-[9px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">&darr; 0.5% late margin</span>
                </div>
                <div className="h-10 w-10 rounded-xl bg-rose-50 border border-rose-100/60 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-rose-500" />
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Absences</p>
                  <h3 className="text-xl font-extrabold text-rose-600 tracking-tight">12 days</h3>
                  <span className="text-[9px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">8 with sick leave cert</span>
                </div>
                <div className="h-10 w-10 rounded-xl bg-rose-50/50 border border-rose-100 flex items-center justify-center">
                  <UserX className="h-5 w-5 text-rose-600" />
                </div>
              </div>
            </div>

            {/* 2. Departmental Compliance and Operations Log Matrix */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-800 tracking-tight flex items-center gap-2">
                  <Network className="h-4 w-4 text-[#2f66e0]" />
                  <span>Corporate Departmental Attendance & Compliance Scoreboard</span>
                </h4>
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Summary metrics and analytical variance parameters for organizational business units</p>
              </div>

              <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <th className="p-3 pl-4">Department Unit</th>
                      <th className="p-3">Staff Size</th>
                      <th className="p-3 text-center">Avg Worked Hours</th>
                      <th className="p-3 text-center">Punctuality Score</th>
                      <th className="p-3 text-center">Approved Overtime</th>
                      <th className="p-3 text-center">Absence Incidents</th>
                      <th className="p-3 pr-4 text-right">Compliance Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/40">
                      <td className="p-3 pl-4 font-bold text-slate-800">Engineering &amp; Dev</td>
                      <td className="p-3 font-semibold text-slate-500">142 FTEs</td>
                      <td className="p-3 text-center font-mono font-bold text-slate-600">8.4h / day</td>
                      <td className="p-3 text-center font-semibold text-emerald-600">96.4%</td>
                      <td className="p-3 text-center font-mono text-slate-600">54.5 hrs</td>
                      <td className="p-3 text-center font-bold text-rose-500">2 events</td>
                      <td className="p-3 pr-4 text-right">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-md font-extrabold text-[10px]">98.2 / A++</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/40">
                      <td className="p-3 pl-4 font-bold text-slate-800">Product Management</td>
                      <td className="p-3 font-semibold text-slate-500">28 FTEs</td>
                      <td className="p-3 text-center font-mono font-bold text-slate-600">8.1h / day</td>
                      <td className="p-3 text-center font-semibold text-emerald-600">95.0%</td>
                      <td className="p-3 text-center font-mono text-slate-600">12.0 hrs</td>
                      <td className="p-3 text-center font-bold text-slate-400">0 events</td>
                      <td className="p-3 pr-4 text-right">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-md font-extrabold text-[10px]">97.5 / A+</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/40">
                      <td className="p-3 pl-4 font-bold text-slate-800">Customer Success</td>
                      <td className="p-3 font-semibold text-slate-500">84 FTEs</td>
                      <td className="p-3 text-center font-mono font-bold text-slate-600">8.6h / day</td>
                      <td className="p-3 text-center font-semibold text-slate-600">91.8%</td>
                      <td className="p-3 text-center font-mono text-slate-600">38.0 hrs</td>
                      <td className="p-3 text-center font-bold text-rose-500">5 events</td>
                      <td className="p-3 pr-4 text-right">
                        <span className="bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-md font-extrabold text-[10px]">92.0 / B</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/40">
                      <td className="p-3 pl-4 font-bold text-slate-800">Human Resources (HR)</td>
                      <td className="p-3 font-semibold text-slate-500">12 FTEs</td>
                      <td className="p-3 text-center font-mono font-bold text-slate-600">7.9h / day</td>
                      <td className="p-3 text-center font-semibold text-emerald-600">97.2%</td>
                      <td className="p-3 text-center font-mono text-slate-600">6.5 hrs</td>
                      <td className="p-3 text-center font-bold text-slate-400">0 events</td>
                      <td className="p-3 pr-4 text-right">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-md font-extrabold text-[10px]">98.7 / A++</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/40">
                      <td className="p-3 pl-4 font-bold text-slate-800">Marketing &amp; Sales</td>
                      <td className="p-3 font-semibold text-slate-500">65 FTEs</td>
                      <td className="p-3 text-center font-mono font-bold text-slate-600">8.2h / day</td>
                      <td className="p-3 text-center font-semibold text-[#2f66e0]">89.5%</td>
                      <td className="p-3 text-center font-mono text-slate-600">22.0 hrs</td>
                      <td className="p-3 text-center font-bold text-rose-500">4 events</td>
                      <td className="p-3 pr-4 text-right">
                        <span className="bg-amber-50 text-[#b45309] border border-amber-200 px-2 py-0.5 rounded-md font-extrabold text-[10px]">89.1 / B-</span>
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
                  onClick={() => setReportType('detail')}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    reportType === 'detail'
                      ? 'bg-slate-100 text-[#2f66e0] ring-1 ring-slate-200 shadow-sm font-extrabold'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Detail report
                </button>
                <button
                  onClick={() => setReportType('summary')}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    reportType === 'summary'
                      ? 'bg-slate-100 text-[#2f66e0] ring-1 ring-slate-200 shadow-sm font-extrabold'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  Summary report
                </button>

                {/* Search query box */}
                <div className="relative w-full sm:w-48">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search staff name..."
                    value={reportsFilterEmp}
                    onChange={(e) => setReportsFilterEmp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] pl-8.5 pr-3 py-1.5 focus:bg-white rounded-xl text-xs font-bold text-slate-700 transition-colors"
                  />
                </div>

                {/* Department drop selections */}
                <select
                  value={reportsFilterDept}
                  onChange={(e) => setReportsFilterDept(e.target.value)}
                  className="bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:bg-white px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                >
                  <option value="All departments">All departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="HR">HR</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                </select>

                <select
                  value={reportMonth}
                  onChange={(e) => setReportMonth(e.target.value)}
                  className="bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                >
                  <option value="May 2026">May 2026</option>
                  <option value="June 2026">June 2026</option>
                  <option value="July 2026">July 2026</option>
                </select>
              </div>

              <button
                onClick={() => addToast('Structuring and compiling audit report CSV...', 'success')}
                className="w-full sm:w-auto bg-[#2f66e0] hover:opacity-95 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Export Report</span>
              </button>
            </div>

            {/* 4. Filtered Reports Table */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="pb-3 pl-3">Employee</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Shift</th>
                      <th className="pb-3">Clock In</th>
                      <th className="pb-3">Clock Out</th>
                      <th className="pb-3 text-center">Work Hours</th>
                      <th className="pb-3 text-center text-red-500">Late Arrival</th>
                      <th className="pb-3 text-center text-[#2f66e0]">OT Hours</th>
                      <th className="pb-3 pr-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {reportsRows
                      .filter(row => {
                        // Filter by department
                        if (reportsFilterDept !== 'All departments') {
                          // Let's match employee's department from rosterData or fallback
                          const matchedEmp = rosterData.find(e => e.name.toLowerCase().startsWith(row.name.toLowerCase().substring(0, 5)));
                          const empDept = matchedEmp ? matchedEmp.dept : 'Engineering';
                          if (empDept !== reportsFilterDept) return false;
                        }
                        // Filter by search query
                        if (reportsFilterEmp.trim() !== '') {
                          if (!row.name.toLowerCase().includes(reportsFilterEmp.toLowerCase())) return false;
                        }
                        return true;
                      })
                      .map((row, idx) => {
                        let textClass = 'bg-slate-50 border-slate-100 text-slate-600';
                        if (row.status === 'Completed') {
                          textClass = 'bg-emerald-50 text-emerald-600 border-emerald-100 font-bold';
                        } else if (row.status === 'Leave') {
                          textClass = 'bg-amber-50 text-amber-600 border-amber-100';
                        } else if (row.status === 'Late') {
                          textClass = 'bg-violet-50 text-violet-600 border-violet-100';
                        } else if (row.status === 'Absent') {
                          textClass = 'bg-rose-50 text-rose-600 border-rose-100';
                        }

                        return (
                          <tr key={idx} className="hover:bg-slate-50/20 transition-colors">
                            <td className="py-3.5 pl-3 font-extrabold text-slate-800 flex items-center gap-2">
                              <span className="h-6 w-6 rounded bg-[#2f66e0]/10 text-[#2f66e0] font-bold flex items-center justify-center text-[10px]">{row.initials}</span>
                              {row.name}
                            </td>
                            <td className="py-3.5 font-semibold text-slate-500">{row.date}</td>
                            <td className="py-3.5 font-semibold text-slate-600">{row.shift}</td>
                            <td className="py-3.5 font-mono font-bold text-slate-700">{row.in}</td>
                            <td className="py-3.5 font-mono font-bold text-slate-700">{row.out}</td>
                            <td className="py-3.5 text-center font-mono font-bold text-slate-500">{row.hrs}</td>
                            <td className="py-3.5 text-center font-mono font-extrabold text-red-500">{row.late}</td>
                            <td className="py-3.5 text-center font-bold font-mono text-[#2f66e0]">{row.ot}</td>
                            <td className="py-3.5 pr-3 text-right">
                              <span className={`px-2.5 py-1 border rounded-md text-[10px] font-extrabold ${textClass}`}>
                                {row.status}
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
      </div>

      {/* 2. SHIFT PATTERNS ADDITION MODAL CONTAINER */}
      {shiftModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-100 rounded-2xl w-full max-w-md p-6 shadow-xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-800 tracking-tight">Create Corporate Shift Pattern</h4>
              <button type="button" onClick={() => setShiftModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateShiftPattern} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 block uppercase">Pattern Name</label>
                <input
                  type="text"
                  required
                  value={newShift.name}
                  onChange={(e) => setNewShift(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold text-slate-700 rounded-xl"
                  placeholder="e.g. Afternoon Shift, EMEA Support"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block uppercase">Work Hours</label>
                  <input
                    type="text"
                    value={newShift.hours}
                    onChange={(e) => setNewShift(prev => ({ ...prev, hours: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold text-slate-700 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block uppercase">Break Hours</label>
                  <input
                    type="text"
                    value={newShift.breakTime}
                    onChange={(e) => setNewShift(prev => ({ ...prev, breakTime: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold text-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block uppercase">Allow In (OT)</label>
                  <input
                    type="text"
                    value={newShift.allowInOT}
                    onChange={(e) => setNewShift(prev => ({ ...prev, allowInOT: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold text-slate-700 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block uppercase">Allow Out (OT)</label>
                  <input
                    type="text"
                    value={newShift.allowOutOT}
                    onChange={(e) => setNewShift(prev => ({ ...prev, allowOutOT: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold text-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block uppercase">Night Shift</label>
                  <select
                    value={newShift.nightShift}
                    onChange={(e) => setNewShift(prev => ({ ...prev, nightShift: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold text-slate-700 rounded-xl"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShiftModalOpen(false)}
                  className="bg-white border border-slate-200 text-slate-600 font-bold text-xs px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#2f66e0] hover:opacity-95 text-white font-bold text-xs px-4 py-2 rounded-xl whitespace-nowrap"
                >
                  Create Pattern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. CREATE TIMESHEET MODAL */}
      {timesheetModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-100 rounded-2xl w-full max-w-md p-6 shadow-xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <PlusCircle className="h-4 w-4 text-[#2f66e0]" />
                <span>Create Corporate Timesheet</span>
              </h4>
              <button type="button" onClick={() => setTimesheetModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTimesheetSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 block uppercase">Employee Record</label>
                <select
                  required
                  value={newTimesheet.employeeId}
                  onChange={(e) => setNewTimesheet(prev => ({ ...prev, employeeId: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold text-slate-700 rounded-xl focus:bg-white"
                >
                  <option value="">-- Choose employee --</option>
                  {rosterData.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} &bull; {r.dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 block uppercase">Shift Layout</label>
                  <select
                    value={newTimesheet.shift}
                    onChange={(e) => setNewTimesheet(prev => ({ ...prev, shift: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold text-slate-700 rounded-xl"
                  >
                    <option value="Standard shift">Standard shift</option>
                    <option value="Flexible shift">Flexible shift</option>
                    <option value="Night shift">Night shift</option>
                    <option value="PM split shift">PM split shift</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 block uppercase">Duty Days Pattern</label>
                  <input
                    type="text"
                    required
                    value={newTimesheet.dutyDays}
                    onChange={(e) => setNewTimesheet(prev => ({ ...prev, dutyDays: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold text-slate-700 rounded-xl"
                    placeholder="e.g. Mon-Fri"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 block uppercase">Date From</label>
                  <input
                    type="text"
                    required
                    value={newTimesheet.start}
                    onChange={(e) => setNewTimesheet(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold text-slate-700 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 block uppercase">Date To</label>
                  <input
                    type="text"
                    required
                    value={newTimesheet.end}
                    onChange={(e) => setNewTimesheet(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold text-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 block uppercase">Total Target Work Days</label>
                <input
                  type="number"
                  required
                  value={newTimesheet.days}
                  onChange={(e) => setNewTimesheet(prev => ({ ...prev, days: Number(e.target.value) || 22 }))}
                  className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold text-slate-700 rounded-xl"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setTimesheetModalOpen(false)}
                  className="bg-white border border-slate-200 text-slate-600 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#2f66e0] hover:opacity-95 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm whitespace-nowrap"
                >
                  Publish Timesheet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3.1 EDIT TIMESHEET MODAL CONTAINER */}
      {editTimesheetModalOpen && selectedTimesheet && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-100 rounded-2xl w-full max-w-md p-6 shadow-xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <Settings className="h-4 w-4 text-[#2f66e0]" />
                <span>Edit Corporate Timesheet</span>
              </h4>
              <button type="button" onClick={() => { setEditTimesheetModalOpen(false); setSelectedTimesheet(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleEditTimesheetSubmit} className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">Employee Record (Read-Only)</span>
                <p className="font-extrabold text-slate-700 text-xs bg-slate-50 border border-slate-100 p-3 rounded-xl">
                  {selectedTimesheet.name} &bull; <span className="text-slate-400 font-bold">{selectedTimesheet.dept}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 block uppercase">Shift Layout</label>
                  <select
                    value={selectedTimesheet.shift}
                    onChange={(e) => setSelectedTimesheet(prev => prev ? { ...prev, shift: e.target.value } : null)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold text-slate-700 rounded-xl focus:bg-white"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Std + OT">Std + OT</option>
                    <option value="Night shift">Night shift</option>
                    <option value="Flexible shift">Flexible shift</option>
                    <option value="PM split shift">PM split shift</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 block uppercase">Duty Days Pattern</label>
                  <input
                    type="text"
                    required
                    value={selectedTimesheet.dutyDays}
                    onChange={(e) => setSelectedTimesheet(prev => prev ? { ...prev, dutyDays: e.target.value } : null)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold text-slate-700 rounded-xl focus:bg-white"
                    placeholder="e.g. Mon-Fri"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 block uppercase">Date From</label>
                  <input
                    type="text"
                    required
                    value={selectedTimesheet.start}
                    onChange={(e) => setSelectedTimesheet(prev => prev ? { ...prev, start: e.target.value } : null)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold text-slate-700 rounded-xl focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 block uppercase">Date To</label>
                  <input
                    type="text"
                    required
                    value={selectedTimesheet.end}
                    onChange={(e) => setSelectedTimesheet(prev => prev ? { ...prev, end: e.target.value } : null)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold text-slate-700 rounded-xl focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 block uppercase">Total Target Days</label>
                  <input
                    type="number"
                    required
                    value={selectedTimesheet.days}
                    onChange={(e) => setSelectedTimesheet(prev => prev ? { ...prev, days: Number(e.target.value) || 22 } : null)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold text-slate-700 rounded-xl focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 block uppercase">Status</label>
                  <select
                    value={selectedTimesheet.status}
                    onChange={(e) => setSelectedTimesheet(prev => prev ? { ...prev, status: e.target.value } : null)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold text-slate-700 rounded-xl focus:bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="On leave">On leave</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => { setEditTimesheetModalOpen(false); setSelectedTimesheet(null); }}
                  className="bg-white border border-slate-200 text-slate-600 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#2f66e0] hover:opacity-95 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm whitespace-nowrap"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. ADD OT SETUP MODAL */}
      {otSetupModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-100 rounded-2xl w-full max-w-md p-6 shadow-xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-500" />
                <span>Configure Extra Hours Alignment</span>
              </h4>
              <button type="button" onClick={() => setOtSetupModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOtSetupSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 block uppercase">Select Employee For Accordance</label>
                <select
                  required
                  value={newOtSetup.employeeId}
                  onChange={(e) => setNewOtSetup(prev => ({ ...prev, employeeId: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold text-slate-700 rounded-xl focus:bg-white"
                >
                  <option value="">-- Choose employee --</option>
                  {rosterData.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.name} &bull; {r.dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 block uppercase">OT Alignment Date</label>
                  <input
                    type="date"
                    required
                    value={newOtSetup.date}
                    onChange={(e) => setNewOtSetup(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold text-slate-700 rounded-xl focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 block uppercase">Proposed Hours (e.g. 2.5)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="12.0"
                    required
                    value={newOtSetup.hrs}
                    onChange={(e) => setNewOtSetup(prev => ({ ...prev, hrs: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold text-slate-700 rounded-xl focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 block uppercase">OT Start Time</label>
                  <input
                    type="time"
                    required
                    value={newOtSetup.start}
                    onChange={(e) => setNewOtSetup(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold text-slate-700 rounded-xl focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 block uppercase">OT End Time</label>
                  <input
                    type="time"
                    required
                    value={newOtSetup.end}
                    onChange={(e) => setNewOtSetup(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 p-2 text-xs font-bold text-slate-700 rounded-xl focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setOtSetupModalOpen(false)}
                  className="bg-white border border-slate-200 text-slate-600 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm whitespace-nowrap"
                >
                  Approve Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. EDIT OT POLICY MODAL */}
      {otPolicyModalOpen && selectedPolicyIndex !== null && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-100 rounded-2xl w-full max-w-sm p-6 shadow-xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <Settings className="h-4 w-4 text-slate-600 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Edit Compliance Policy</span>
              </h4>
              <button type="button" onClick={() => setOtPolicyModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveOtPolicySubmit} className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">Policy Rule Title</span>
                <p className="font-extrabold text-[#2f66e0] text-xs leading-none bg-slate-50 border border-slate-100 p-3 rounded-xl">
                  {otPolicy[selectedPolicyIndex]?.label}
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-slate-400 block uppercase">Policy Value / Threshold Limit</label>
                <input
                  type="text"
                  required
                  value={policyEditValue}
                  onChange={(e) => setPolicyEditValue(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 text-xs font-bold text-slate-700 rounded-xl focus:bg-white"
                  placeholder="e.g. 60 mins, Yes, 1.5x"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setOtPolicyModalOpen(false)}
                  className="bg-white border border-slate-200 text-slate-600 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#2f66e0] hover:opacity-95 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                >
                  Save Compliance Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

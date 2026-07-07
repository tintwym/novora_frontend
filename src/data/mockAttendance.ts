import type {
  DeptScoreRow,
  ManualPunchRecord,
  OtRecord,
  RecentDayLog,
  ReportDetailRow,
  RollCallRow,
  RosterEmployee,
  ShiftPattern,
  TimesheetRow,
  UnknownSwipe,
} from '../types/attendance'

export const UNKNOWN_SWIPE_BADGE = 4

export const RECENT_DAY_LOGS: RecentDayLog[] = [
  { date: '2025-06-12', range: '09:02 AM → 06:05 PM', hours: '9.0 hrs completed', present: true },
  { date: '2025-06-11', range: '08:10 AM → 06:00 PM', hours: '8.8 hrs completed', present: true },
  { date: '2025-06-10', range: '08:05 AM → 06:12 PM', hours: '9.1 hrs completed', present: true },
  { date: '2025-06-09', range: '08:00 AM → 05:58 PM', hours: '8.9 hrs completed', present: true },
  { date: '2025-06-02', range: '— → —', hours: '0.0 hrs completed', present: true },
]

export const ROSTER_DAYS = ['MON 5', 'TUE 6', 'WED 7', 'THU 8', 'FRI 9', 'SAT 10', 'SUN 11']

export const ROSTER_EMPLOYEES: RosterEmployee[] = [
  {
    initials: 'SL',
    name: 'Sarah Lim',
    department: 'Engineering',
    days: [
      { time: '09:00-18:00', status: 'Completed', tone: 'completed' },
      { time: '09:00-18:00', status: 'Completed', tone: 'completed' },
      { time: '09:00-18:00', status: 'Clock In', tone: 'clockIn' },
      { time: '09:00-18:00', status: 'Planned', tone: 'planned' },
      { time: '09:00-13:00', status: 'Planned', tone: 'planned' },
      { time: 'Off', status: 'Off', tone: 'off' },
      { time: 'Off', status: 'Off', tone: 'off' },
    ],
  },
  {
    initials: 'RK',
    name: 'Raj Kumar',
    department: 'Engineering',
    days: [
      { time: '09:00-18:00', status: 'Completed', tone: 'completed' },
      { time: '09:00-18:00', status: 'Completed', tone: 'completed' },
      { time: '09:00-20:00', status: 'OT active', tone: 'ot' },
      { time: '09:00-18:00', status: 'Completed', tone: 'completed' },
      { time: '09:00-18:00', status: 'Planned', tone: 'planned' },
      { time: 'Off', status: 'Off', tone: 'off' },
      { time: 'Off', status: 'Off', tone: 'off' },
    ],
  },
  {
    initials: 'MT',
    name: 'Maya Tan',
    department: 'HR',
    days: [
      { time: 'Annual Leave', status: 'On leave', tone: 'leave' },
      { time: 'Annual Leave', status: 'On leave', tone: 'leave' },
      { time: 'Annual Leave', status: 'On leave', tone: 'leave' },
      { time: '09:00-18:00', status: 'Completed', tone: 'completed' },
      { time: '09:00-18:00', status: 'Planned', tone: 'planned' },
      { time: 'Off', status: 'Off', tone: 'off' },
      { time: 'Off', status: 'Off', tone: 'off' },
    ],
  },
  {
    initials: 'AL',
    name: 'Ahmad L',
    department: 'Operations',
    days: [
      { time: '09:00-18:00', status: 'Completed', tone: 'completed' },
      { time: '09:00-18:00', status: 'Late In', tone: 'clockIn' },
      { time: '09:00-18:00', status: 'Completed', tone: 'completed' },
      { time: '22:00-07:00', status: 'Night', tone: 'night' },
      { time: '22:00-07:00', status: 'Night', tone: 'night' },
      { time: 'Off', status: 'Off', tone: 'off' },
      { time: 'Off', status: 'Off', tone: 'off' },
    ],
  },
  {
    initials: 'NC',
    name: 'Nadia Chen',
    department: 'Marketing',
    days: [
      { time: '09:00-18:00', status: 'Completed', tone: 'completed' },
      { time: '09:00-18:00', status: 'Completed', tone: 'completed' },
      { time: '09:00-18:00', status: 'Clock In', tone: 'clockIn' },
      { time: '09:00-18:00', status: 'Planned', tone: 'planned' },
      { time: '09:00-18:00', status: 'Planned', tone: 'planned' },
      { time: 'Off', status: 'Off', tone: 'off' },
      { time: 'Off', status: 'Off', tone: 'off' },
    ],
  },
  {
    initials: 'ZN',
    name: 'Zara Nor',
    department: 'Operations',
    days: [
      { time: '09:00-18:00', status: 'Completed', tone: 'completed' },
      { time: 'Absent', status: 'Absent', tone: 'absent' },
      { time: '09:00-18:00', status: 'Completed', tone: 'completed' },
      { time: '09:00-18:00', status: 'Completed', tone: 'completed' },
      { time: '09:00-18:00', status: 'Planned', tone: 'planned' },
      { time: 'Off', status: 'Off', tone: 'off' },
      { time: 'Off', status: 'Off', tone: 'off' },
    ],
  },
]

export const TIMESHEET_ROWS: TimesheetRow[] = [
  { initials: 'SL', name: 'Sarah Lim', department: 'Engineering', shift: 'Standard', dateFrom: '1 May', dateTo: '31 May', dutyDays: '22', workingLogic: 'Mon-Fri', status: 'Active', statusTone: 'success' },
  { initials: 'RK', name: 'Raj Kumar', department: 'Engineering', shift: 'Std + OT', dateFrom: '1 May', dateTo: '31 May', dutyDays: '22', workingLogic: 'Mon-Fri', status: 'Active', statusTone: 'success' },
  { initials: 'MT', name: 'Maya Tan', department: 'HR', shift: 'Standard', dateFrom: '1 May', dateTo: '31 May', dutyDays: '22', workingLogic: 'Mon-Fri', status: 'On-leave', statusTone: 'warning' },
  { initials: 'AL', name: 'Ahmad L', department: 'Operations', shift: 'Night shift', dateFrom: '1 May', dateTo: '31 May', dutyDays: '22', workingLogic: 'Mon-Fri', status: 'Active', statusTone: 'success' },
  { initials: 'NC', name: 'Nadia Chen', department: 'Marketing', shift: 'Standard', dateFrom: '1 May', dateTo: '31 May', dutyDays: '22', workingLogic: 'Mon-Fri', status: 'Active', statusTone: 'success' },
  { initials: 'ZN', name: 'Zara Nor', department: 'Operations', shift: 'Standard', dateFrom: '1 May', dateTo: '31 May', dutyDays: '22', workingLogic: 'Mon-Fri', status: 'Active', statusTone: 'success' },
]

export const SHIFT_PATTERNS: ShiftPattern[] = [
  {
    id: 'standard',
    title: 'Standard shift',
    active: true,
    workHours: '09:00 – 18:00',
    breakTime: '13:00 – 14:00 (1h)',
    nearestIn: '08:00 – 10:00',
    nearestOut: '17:00 – 19:30',
    allowInOt: '60 mins',
    allowOutOt: '60 mins',
    nightShift: 'No',
    assigned: '892',
  },
  {
    id: 'night',
    title: 'Night shift',
    active: true,
    workHours: '22:00 – 07:00',
    breakTime: '02:00 – 03:00 (1h)',
    nearestIn: '21:00 – 23:00',
    nearestOut: '06:00 – 08:00',
    allowInOt: '30 mins',
    allowOutOt: '30 mins',
    nightShift: 'Yes',
    nightHighlight: true,
    assigned: '124',
  },
  {
    id: 'split',
    title: 'Split shift',
    active: true,
    workHours: '08:00–13:00 / 14:00–18:00',
    breakTime: '13:00 – 14:00 (1h)',
    nearestIn: '07:30 – 09:00',
    nearestOut: '17:30 – 19:00',
    allowInOt: '45 mins',
    allowOutOt: '45 mins',
    nightShift: 'No',
    assigned: '68',
  },
  {
    id: 'half',
    title: 'Half day (AM)',
    active: true,
    workHours: '09:00 – 13:00',
    breakTime: '—',
    nearestIn: '08:30 – 09:30',
    nearestOut: '12:30 – 14:00',
    allowInOt: '30 mins',
    allowOutOt: '30 mins',
    nightShift: 'No',
    assigned: 'Fri only',
  },
]

export const ROLL_CALL_ROWS: RollCallRow[] = [
  { initials: 'SL', name: 'Sarah Lim', department: 'Engineering', shift: 'Standard', clockIn: '08:58', clockOut: '—', workHours: '—', inOffice: 'Yes', inOfficeYes: true, status: 'In office', statusTone: 'info' },
  { initials: 'RK', name: 'Raj Kumar', department: 'Engineering', shift: 'Standard', clockIn: '09:02', clockOut: '—', workHours: '—', inOffice: 'Yes', inOfficeYes: true, status: 'In office', statusTone: 'info' },
  { initials: 'MT', name: 'Maya Tan', department: 'HR', shift: 'Standard', clockIn: '—', clockOut: '—', workHours: '—', inOffice: '—', status: 'On leave', statusTone: 'warning' },
  { initials: 'AL', name: 'Ahmad L', department: 'Operations', shift: 'Standard', clockIn: '09:28', clockOut: '—', workHours: '—', inOffice: 'Yes', inOfficeYes: true, status: 'Late', statusTone: 'purple' },
  { initials: 'NC', name: 'Nadia Chen', department: 'Marketing', shift: 'Standard', clockIn: '08:54', clockOut: '17:12', workHours: '8h 18m', inOffice: 'No', inOfficeYes: false, status: 'Completed', statusTone: 'success' },
  { initials: 'ZN', name: 'Zara Nor', department: 'Operations', shift: 'Standard', clockIn: '—', clockOut: '—', workHours: '—', inOffice: '—', status: 'Absent', statusTone: 'danger' },
]

export const UNKNOWN_SWIPES: UnknownSwipe[] = [
  { id: 0, taNumber: 'TA-00451', initials: 'SL', name: 'Sarah Lim', swipeTime: '07:44 AM', terminal: 'Main lobby', issue: 'Outside nearest time (in)', issueTone: 'warning' },
  { id: 1, taNumber: 'Unknown', initials: '?', name: '—', swipeTime: '08:12 AM', terminal: 'Level 3', issue: 'No TA match', issueTone: 'danger' },
  { id: 2, taNumber: 'TA-00452', initials: 'AL', name: 'Ahmad L', swipeTime: '06:58 PM', terminal: 'Level 3', issue: 'Outside nearest time (out)', issueTone: 'warning' },
  { id: 3, taNumber: 'TA-00389', initials: 'NC', name: 'Nadia Chen', swipeTime: '05:42 PM', terminal: 'Main lobby', issue: 'Multi swipe', issueTone: 'warning' },
]

export const OT_RECORDS: OtRecord[] = [
  { initials: 'RK', name: 'Raj K', date: '6 May', start: '18:00', end: '20:00', hours: '2h 00m' },
  { initials: 'SL', name: 'Sarah L', date: '5 May', start: '18:00', end: '19:30', hours: '1h 30m' },
  { initials: 'NC', name: 'Nadia C', date: '4 May', start: '18:30', end: '20:00', hours: '1h 30m' },
  { initials: 'ZN', name: 'Zara N', date: '3 May', start: '22:00', end: '23:30', hours: '1h 30m' },
]

export const OT_POLICY = [
  { label: 'Allow in OT (pre-shift)', value: '60 mins' },
  { label: 'Allow out OT (post-shift)', value: '60 mins' },
  { label: 'OT rounding block', value: '30 min' },
  { label: 'Min OT threshold', value: '30 mins' },
  { label: 'Weekday OT rate', value: '1.0x' },
  { label: 'Weekend OT rate', value: '1.5x' },
  { label: 'Public holiday OT', value: '2.0x' },
  { label: 'Shift allowance on OT', value: 'Yes', success: true },
  { label: 'Supper allowance on OT', value: 'Yes', success: true },
]

export const MANUAL_PUNCHES: ManualPunchRecord[] = [
  { time: '08:55', employee: 'Sarah Lim', empId: 'EMP-0031', type: 'Clock In', reason: 'Device offline', badge: 'In', badgeTone: 'success' },
  { time: '09:10', employee: 'Ahmad L', empId: 'EMP-0187', type: 'Clock In', reason: 'Forgot to swipe', badge: 'In', badgeTone: 'success' },
  { time: '17:30', employee: 'Nadia Chen', empId: 'EMP-0092', type: 'Clock Out', reason: 'Remote work', badge: 'Out', badgeTone: 'pink' },
  { time: '18:05', employee: 'Raj Kumar', empId: 'EMP-0048', type: 'Clock Out', reason: 'Biometric', badge: 'Auto', badgeTone: 'neutral' },
]

export const DEPT_SCOREBOARD: DeptScoreRow[] = [
  { department: 'Engineering & Dev', staff: '142 FTEs', avgHours: '8.4h / day', punctuality: '96.4%', punctualityTone: 'success', overtime: '54.5 hrs', absences: '2 events', compliance: '98.2 / A++', complianceTone: 'success' },
  { department: 'Product Management', staff: '38 FTEs', avgHours: '8.1h / day', punctuality: '91.2%', punctualityTone: 'success', overtime: '12.0 hrs', absences: '3 events', compliance: '92.4 / A', complianceTone: 'success' },
  { department: 'Customer Success', staff: '52 FTEs', avgHours: '8.0h / day', punctuality: '94.1%', punctualityTone: 'success', overtime: '8.5 hrs', absences: '1 event', compliance: '95.8 / A+', complianceTone: 'success' },
  { department: 'Human Resources (HR)', staff: '24 FTEs', avgHours: '8.2h / day', punctuality: '97.0%', punctualityTone: 'success', overtime: '4.0 hrs', absences: '0 events', compliance: '99.1 / A++', complianceTone: 'success' },
  { department: 'Marketing & Sales', staff: '65 FTEs', avgHours: '7.9h / day', punctuality: '89.5%', punctualityTone: 'warning', overtime: '18.0 hrs', absences: '5 events', compliance: '89.1 / B-', complianceTone: 'warning' },
]

export const REPORT_DETAIL_ROWS: ReportDetailRow[] = [
  { initials: 'SL', name: 'Sarah L', date: '5 May', shift: 'Standard', clockIn: '08:58', clockOut: '18:05', workHours: '9h 7m', late: '—', otHours: '1h 5m', status: 'Completed', statusTone: 'success' },
  { initials: 'MT', name: 'Maya T', date: '5 May', shift: 'Standard', clockIn: '—', clockOut: '—', workHours: '—', late: '—', otHours: '—', status: 'Leave', statusTone: 'warning' },
  { initials: 'AL', name: 'Ahmad L', date: '5 May', shift: 'Standard', clockIn: '09:28', clockOut: '18:30', workHours: '9h 2m', late: '28m', otHours: '—', status: 'Late', statusTone: 'purple' },
  { initials: 'ZN', name: 'Zara N', date: '5 May', shift: 'Standard', clockIn: '—', clockOut: '—', workHours: '—', late: '—', otHours: '—', status: 'Absent', statusTone: 'danger' },
]

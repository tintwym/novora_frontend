import type {
  TrainingApprovalRow,
  TrainingAttendanceRow,
  TrainingBehalfRow,
  TrainingBudgetRow,
  TrainingCategoryRow,
  TrainingComplianceRow,
  TrainingCourseRow,
  TrainingHistoryRow,
  TrainingRequestTrackerRow,
  TrainingScheduleRow,
  TrainingSkillsRow,
  TrainingSubjectRow,
  TrainingTypeRow,
} from '../types/training'

export const TRAINING_APPROVAL_BADGE = 2

export const TRAINING_TYPES: TrainingTypeRow[] = [
  { no: 1, name: 'Management', description: 'Leadership, strategy & people ma...', courses: '8', status: 'Active', statusTone: 'success' },
  { no: 2, name: 'Technical', description: 'IT, engineering & systems training', courses: '12', status: 'Active', statusTone: 'success' },
  { no: 3, name: 'Compliance', description: 'Regulatory, safety & legal require...', courses: '5', status: 'Active', statusTone: 'success' },
  { no: 4, name: 'Soft skills', description: 'Communication, teamwork & pre...', courses: '6', status: 'Active', statusTone: 'success' },
  { no: 5, name: 'Onboarding', description: 'New employee orientation progra...', courses: '3', status: 'Draft', statusTone: 'warning' },
]

export const TRAINING_CATEGORIES: TrainingCategoryRow[] = [
  { no: 1, name: 'Leadership', trainingType: 'Management', typeTone: 'info', description: 'Leading teams & strategy', subjects: '4' },
  { no: 2, name: 'Computer skills', trainingType: 'Technical', typeTone: 'purple', description: 'Software & hardware', subjects: '6' },
  { no: 3, name: 'Fire safety', trainingType: 'Compliance', typeTone: 'warning', description: 'Emergency & safety drills', subjects: '2' },
  { no: 4, name: 'Public speaking', trainingType: 'Soft skills', typeTone: 'success', description: 'Presentation & communication', subjects: '3' },
  { no: 5, name: 'Project management', trainingType: 'Management', typeTone: 'info', description: 'Agile, Scrum & PMO', subjects: '5' },
]

export const TRAINING_COURSES: TrainingCourseRow[] = [
  { title: 'Leadership essentials', category: 'Management', categoryTone: 'info', delivery: 'Internal', frequency: 'One time', mandatory: true, dueWithin: '7 days', status: 'Active', statusTone: 'success' },
  { title: 'Excel advanced', category: 'Technical', categoryTone: 'purple', delivery: 'Internal', frequency: 'Renewing', mandatory: false, dueWithin: '30 days', status: 'Active', statusTone: 'success' },
  { title: 'ISO 9001 awareness', category: 'Compliance', categoryTone: 'warning', delivery: 'External', frequency: 'Annual', mandatory: true, dueWithin: '1 day', status: 'Active', statusTone: 'success' },
  { title: 'Agile & Scrum', category: 'Management', categoryTone: 'info', delivery: 'Overseas', frequency: 'One time', mandatory: false, dueWithin: '—', status: 'Active', statusTone: 'success' },
  { title: 'Public speaking', category: 'Soft skills', categoryTone: 'success', delivery: 'Internal', frequency: 'Repeat...', mandatory: false, dueWithin: '14 days', status: 'Active', statusTone: 'success' },
]

export const TRAINING_SUBJECTS: TrainingSubjectRow[] = [
  { title: 'Team leadership', course: 'Leadership essentials', internalTrainer: 'David Ng', externalTrainer: '—', skill: 'People mgmt', skillTone: 'info' },
  { title: 'Decision making', course: 'Leadership essentials', internalTrainer: 'Nina Reza', externalTrainer: '—', skill: 'Critical thinking', skillTone: 'purple' },
  { title: 'Pivot tables', course: 'Excel advanced', internalTrainer: '—', externalTrainer: 'Excel Pro Sdn', skill: 'Data analysis', skillTone: 'success' },
  { title: 'Scrum ceremonies', course: 'Agile & Scrum', internalTrainer: '—', externalTrainer: 'Agile Academy', skill: 'Agile delivery', skillTone: 'warning' },
]

export const TRAINING_SCHEDULES: TrainingScheduleRow[] = [
  { course: 'Leadership essentials', type: 'Internal', period: '12–14 May', days: '3', fee: '500/pax', companyCont: '100%', requestBefore: '7 days', status: 'Upcoming', statusTone: 'warning' },
  { course: 'Excel advanced', type: 'Internal', period: '6–7 May', days: '2', fee: '200/pax', companyCont: '50%', requestBefore: '3 days', status: 'Ongoing', statusTone: 'info' },
  { course: 'ISO 9001 awareness', type: 'External', period: '2 May', days: '1', fee: '800/pax', companyCont: '100%', requestBefore: '14 days', status: 'Completed', statusTone: 'success' },
  { course: 'Agile & Scrum', type: 'Overseas', period: '20–24 May', days: '5', fee: '3,200/pax', companyCont: '80%', requestBefore: '21 days', status: 'Upcoming', statusTone: 'warning' },
]

export const TRAINING_APPROVALS: TrainingApprovalRow[] = [
  {
    initials: 'SL',
    name: 'Sarah Lim',
    avatarColor: '#3b82f6',
    course: 'Leadership essentials',
    date: '12-14 May',
    location: 'Room A',
    approvers: [
      { name: 'David Ng', approved: true },
      { name: 'Ahmad Wahid', approved: false },
    ],
    status: 'Pending',
    statusTone: 'warning',
  },
  {
    initials: 'RK',
    name: 'Raj Kumar',
    avatarColor: '#10b981',
    course: 'Agile & Scrum',
    date: '20-24 May',
    location: 'Overseas',
    approvers: [
      { name: 'David Ng', approved: true },
      { name: 'Ahmad Wahid', approved: false },
    ],
    status: 'Pending',
    statusTone: 'warning',
  },
  {
    initials: 'MT',
    name: 'Maya Tan',
    avatarColor: '#8b5cf6',
    course: 'Excel advanced',
    date: '6-7 May',
    location: 'Room B',
    approvers: [{ name: 'Nina Reza', approved: true }],
    status: 'Approved',
    statusTone: 'success',
    processed: true,
  },
  {
    initials: 'NC',
    name: 'Nadia Chen',
    avatarColor: '#06b6d4',
    course: 'Public speaking',
    date: '20 May',
    location: 'Room A',
    approvers: [{ name: 'Kevin Lim', approved: false }],
    status: 'Denied',
    statusTone: 'danger',
    processed: true,
  },
]

export const TRAINING_ATTENDANCE: TrainingAttendanceRow[] = [
  { initials: 'SL', name: 'Sarah Lim', avatarColor: '#3b82f6', courseSubject: 'Leadership — Team leadership', scheduleDate: '12 May', actualDate: '12 May', timeIn: '09:02', timeOut: '13:05', status: 'Present', statusTone: 'success' },
  { initials: 'RK', name: 'Raj Kumar', avatarColor: '#10b981', courseSubject: 'Excel — Pivot tables', scheduleDate: '6 May', actualDate: '6 May', timeIn: '09:05', timeOut: '17:00', status: 'Present', statusTone: 'success' },
  { initials: 'MT', name: 'Maya Tan', avatarColor: '#8b5cf6', courseSubject: 'Excel — Pivot tables', scheduleDate: '6 May', actualDate: '6 May', timeIn: '—', timeOut: '—', status: 'Absent', statusTone: 'danger' },
  { initials: 'AL', name: 'Ahmad Luqman', avatarColor: '#f97316', courseSubject: 'Leadership — Decision making', scheduleDate: '13 May', actualDate: '13 May', timeIn: '09:15', timeOut: '12:00', status: 'Late', statusTone: 'warning' },
]

export const TRAINING_HISTORY: TrainingHistoryRow[] = [
  { initials: 'SL', name: 'Sarah Lim', avatarColor: '#3b82f6', course: 'Leadership essentials', days: '3', fee: '500', approvedBy: 'David Ng • pending', approvedTone: 'danger', status: 'Pending', statusTone: 'warning' },
  { initials: 'RK', name: 'Raj Kumar', avatarColor: '#10b981', course: 'Excel advanced', days: '2', fee: '200', approvedBy: 'David Ng ✓', approvedTone: 'success', status: 'Completed', statusTone: 'success' },
  { initials: 'MT', name: 'Maya Tan', avatarColor: '#8b5cf6', course: 'Excel advanced', days: '2', fee: '200', approvedBy: 'Nina Reza ✓', approvedTone: 'success', status: 'Allocated', statusTone: 'info' },
]

export const TRAINING_REQUEST_TRACKER: TrainingRequestTrackerRow[] = [
  { course: 'Excel advanced', date: '6-7 May', status: 'Allocated', statusTone: 'success' },
  { course: 'Leadership', date: '12-14 May', status: 'Pending', statusTone: 'warning' },
  { course: 'Public speaking', date: '20 May', status: 'Pending', statusTone: 'warning' },
  { course: 'ISO 9001', date: '2 May', status: 'Completed', statusTone: 'info' },
  { course: 'Agile & Scrum', date: '20 Apr', status: 'Denied', statusTone: 'danger' },
]

export const TRAINING_BEHALF_EMPLOYEES = [
  { id: 'sl', label: 'Sarah Lim (EMP-0021) — Engineering', checked: true },
  { id: 'rk', label: 'Raj Kumar (EMP-0048) — Engineering', checked: false },
  { id: 'al', label: 'Ahmad Luqman (EMP-0187) — Operations', checked: false },
]

export const TRAINING_BEHALF_SUBMITTED: TrainingBehalfRow[] = [
  { initials: 'SL', name: 'Sarah Lim', avatarColor: '#3b82f6', course: 'Leadership', date: '12 May', status: 'Allocated', statusTone: 'success' },
  { initials: 'RK', name: 'Raj Kumar', avatarColor: '#10b981', course: 'Leadership', date: '12 May', status: 'Pending', statusTone: 'warning' },
  { initials: 'AL', name: 'Ahmad Luqman', avatarColor: '#f97316', course: 'ISO 9001', date: '2 May', status: 'Completed', statusTone: 'success' },
]

export const TRAINING_COMPLIANCE_REPORT: TrainingComplianceRow[] = [
  { employee: 'Sarah Lim', course: 'Leadership essentials', category: 'Compliance', dueDate: '12 May', mandatory: true, completionStatus: 'Completed', completionTone: 'success', signOff: 'David Ng ✓' },
  { employee: 'Raj Kumar', course: 'Excel advanced', category: 'Technical', dueDate: '06 May', mandatory: false, completionStatus: 'Completed', completionTone: 'success', signOff: 'David Ng ✓' },
  { employee: 'Maya Tan', course: 'ISO 9001 awareness', category: 'Compliance', dueDate: '02 May', mandatory: true, completionStatus: 'Overdue', completionTone: 'danger', signOff: '—' },
  { employee: 'Kevin Lim', course: 'Leadership essentials', category: 'Compliance', dueDate: '12 May', mandatory: true, completionStatus: 'Pending', completionTone: 'warning', signOff: '—' },
]

export const TRAINING_SKILLS_REPORT: TrainingSkillsRow[] = [
  { employee: 'Sarah Lim', department: 'Human Resources', program: 'Leadership essentials', skills: ['People Management', 'Strategy'], proficiency: 'Mastered', proficiencyTone: 'purple' },
  { employee: 'Raj Kumar', department: 'Engineering', program: 'Excel advanced', skills: ['Data Analysis', 'Pivot Tables'], proficiency: 'Proficient', proficiencyTone: 'success' },
  { employee: 'Maya Tan', department: 'Finance', program: 'Excel advanced', skills: ['Data Analysis', 'Advanced Formulas'], proficiency: 'In Progress', proficiencyTone: 'info' },
  { employee: 'Ahmad Luqman', department: 'Operations', program: 'Agile & Scrum', skills: ['Agile Delivery', 'Scrum Master'], proficiency: 'Mastered', proficiencyTone: 'purple' },
  { employee: 'Nadia Chen', department: 'Marketing', program: 'Public speaking', skills: ['Communication', 'Presentation'], proficiency: 'In Progress', proficiencyTone: 'info' },
  { employee: 'Kevin Lim', department: 'Engineering', program: 'Leadership essentials', skills: ['Critical Thinking', 'Delegation'], proficiency: 'Scheduled', proficiencyTone: 'neutral' },
]

export const TRAINING_BUDGET_REPORT: TrainingBudgetRow[] = [
  { vendor: 'Executive Coaching Ltd', course: 'Leadership essentials', paymentType: 'One time', basePrice: 'MYR 1,500', contribution: '100% (MYR 1,500)', invoiceStatus: 'Approved', invoiceTone: 'info' },
  { vendor: 'Excel Pro Sdn Bhd', course: 'Excel advanced', paymentType: 'Repeat', basePrice: 'MYR 1,200', contribution: '50% (MYR 600)', invoiceStatus: 'Paid', invoiceTone: 'success' },
  { vendor: 'Apex Safe Corp', course: 'ISO 9001 awareness', paymentType: 'Annual', basePrice: 'MYR 800', contribution: '100% (MYR 800)', invoiceStatus: 'Paid', invoiceTone: 'success' },
  { vendor: 'Agile Academy', course: 'Agile & Scrum', paymentType: 'One time', basePrice: 'MYR 3,200', contribution: '80% (MYR 2,560)', invoiceStatus: 'Pending Approval', invoiceTone: 'warning' },
  { vendor: 'Global Speakers Bureau', course: 'Public speaking', paymentType: 'Repeat', basePrice: 'MYR 900', contribution: '100% (MYR 900)', invoiceStatus: 'Approved', invoiceTone: 'info' },
]

export const TRAINING_SCHEDULE_SLOTS = [
  'Team leadership — 12 May, 09:00–13:00',
  'Decision making — 13 May, 09:00–12:00',
  'Conflict resolution — 14 May, 14:00–17:00',
]

import type {
  CategoryVolume,
  DigitalCertificate,
  HelpdeskTicket,
  KnowledgeFaq,
  PerformanceLogRow,
  SlaTarget,
} from '../types/helpdesk'

export const HELPDESK_OPEN_BADGE = 2

export const HELPDESK_TICKETS: HelpdeskTicket[] = [
  {
    id: 'TKT-9201',
    category: 'PAYROLL DISCREPANCY',
    priority: 'HIGH',
    priorityTone: 'warning',
    subject: 'Urgent: Discrepancy in May OT-claims calculation multiplier',
    snippet: 'My May overtime payout seems lower than expected after the weekend roster sync…',
    reporter: 'Sarah Lim',
    initials: 'SL',
    filedAt: '2024-05-15 09:12',
    status: 'In Progress',
    statusTone: 'info',
    slaLabel: 'Target SLA: 48 hrs',
    escalated: true,
  },
  {
    id: 'TKT-9202',
    category: 'BENEFITS INQUIRY',
    priority: 'LOW',
    priorityTone: 'neutral',
    subject: 'Optical benefits cap clarification for dependents',
    snippet: 'Need confirmation on annual optical allowance for spouse coverage…',
    reporter: 'John Doe',
    initials: 'JD',
    filedAt: '2024-05-14 14:20',
    status: 'Open',
    statusTone: 'info',
    slaLabel: 'Expires (2h left)',
  },
  {
    id: 'TKT-9203',
    category: 'DOCUMENT REQUEST',
    priority: 'MEDIUM',
    priorityTone: 'info',
    subject: 'Salary certificate for mortgage application',
    snippet: 'Requesting certified salary letter for Citibank mortgage processing…',
    reporter: 'Pinky Sharma',
    initials: 'PS',
    filedAt: '2024-05-13 11:05',
    status: 'Resolved',
    statusTone: 'success',
  },
  {
    id: 'TKT-9204',
    category: 'TAX FORM ISSUE',
    priority: 'CRITICAL',
    priorityTone: 'danger',
    subject: 'Missing IR8A line items in Form EA export',
    snippet: 'Form EA download is missing bonus classification rows for FY2025…',
    reporter: 'Michael Chang',
    initials: 'MC',
    filedAt: '2024-05-12 08:44',
    status: 'Open',
    statusTone: 'info',
    breached: true,
    badge: 'BREACHED OVERDUE',
    secure: true,
  },
  {
    id: 'TKT-9205',
    category: 'GENERAL POLICY',
    priority: 'MEDIUM',
    priorityTone: 'info',
    subject: 'Remote work sickness leave buffer policy',
    snippet: 'Clarification on maximum consecutive sickness leave while remote…',
    reporter: 'Amina Al-Mansour',
    initials: 'AA',
    filedAt: '2024-05-11 16:30',
    status: 'Resolved',
    statusTone: 'success',
  },
]

export const DIGITAL_CERTIFICATES: DigitalCertificate[] = [
  { title: 'Standard Employment Verification Letter', subtitle: 'For Sarah Lim — Ref DOC-1001', status: 'CERTIFIED', statusTone: 'success' },
  { title: 'Salary Certificate', subtitle: 'For John Doe — Ref DOC-1002', status: 'DRAFT', statusTone: 'warning' },
]

export const CATEGORY_VOLUMES: CategoryVolume[] = [
  { label: 'Payroll Discrepancy', pct: 20, color: '#dc2626', trailing: '1 log (20%)' },
  { label: 'Document Request', pct: 20, color: '#eab308', trailing: '1 log (20%)' },
  { label: 'Tax Form Issue', pct: 20, color: '#059669', trailing: '1 log (20%)' },
  { label: 'Benefits Inquiry', pct: 20, color: '#14b8a6', trailing: '1 log (20%)' },
  { label: 'General Policy', pct: 20, color: '#2563eb', trailing: '1 log (20%)' },
]

export const SLA_TARGETS: SlaTarget[] = [
  { level: 'CRITICAL', levelTone: 'danger', target: '4 hrs', ytdAvg: '3.2 hrs', actionRequired: true },
  { level: 'HIGH', levelTone: 'warning', target: '12 hrs', ytdAvg: '10.5 hrs' },
  { level: 'MEDIUM', levelTone: 'info', target: '24 hrs', ytdAvg: '18.0 hrs' },
  { level: 'LOW', levelTone: 'neutral', target: '48 hrs', ytdAvg: '34.2 hrs' },
]

export const PERFORMANCE_LOGS: PerformanceLogRow[] = [
  { ticketRef: 'TKT-9201', filer: 'Sarah Lim (EMP-001)', category: 'Payroll Discrepancy', slaLimit: '12 hours', resolutionTime: 'diagnostic active', completed: false, statusCode: 'IN PROGRESS', statusTone: 'info' },
  { ticketRef: 'TKT-9202', filer: 'John Doe (EMP-002)', category: 'Benefits Inquiry', slaLimit: '48 hours', resolutionTime: 'diagnostic active', completed: false, statusCode: 'OPEN', statusTone: 'info' },
  { ticketRef: 'TKT-9203', filer: 'Pinky Sharma (EMP-002)', category: 'Document Request', slaLimit: '24 hours', resolutionTime: 'Completed (~4.2 hrs)', completed: true, statusCode: 'RESOLVED', statusTone: 'success' },
  { ticketRef: 'TKT-9204', filer: 'Michael Chang', category: 'Tax Form Issue', slaLimit: '4 hours', resolutionTime: 'diagnostic active', completed: false, statusCode: 'OPEN', statusTone: 'info' },
  { ticketRef: 'TKT-9205', filer: 'Amina Al-Mansour', category: 'General Policy', slaLimit: '24 hours', resolutionTime: 'Completed (~4.2 hrs)', completed: true, statusCode: 'RESOLVED', statusTone: 'success' },
]

export const KNOWLEDGE_FAQS: KnowledgeFaq[] = [
  { category: 'Payroll Discrepancy', question: 'How is the Overtime (OT) multi-multiplier calculated on Public Holidays?' },
  { category: 'Document Request', question: 'How do I download a certified Salary Certificate for banks?' },
  { category: 'Benefits Inquiry', question: 'How does the company coordinate remote internet allowances?' },
  { category: 'Tax Form Issue', question: 'Where can I find my certified IR8A or Form EA tax files?' },
  { category: 'Benefits Inquiry', question: 'What is the limit for optical checkups and prescription frames?' },
  { category: 'General Policy', question: 'What is the maximum duration buffer allowed for sickness leave blocks?' },
]

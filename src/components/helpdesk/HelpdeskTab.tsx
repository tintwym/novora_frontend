import { useState, useMemo, type FormEvent } from 'react'
import {
  LifeBuoy,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  User,
  Filter,
  Send,
  BookOpen,
  ChevronRight,
  ChevronDown,
  FileText,
  BadgeAlert,
  Lock,
  ThumbsUp,
  ShieldAlert,
  Sparkles,
  QrCode,
  Printer,
  Download,
  Activity,
} from 'lucide-react'
import { showActionToast } from '../../utils/actionToast'
import type { ModuleEmployee } from '../../types/moduleEmployee'

type HelpdeskTabProps = {
  employees: ModuleEmployee[]
}

export type HelpdeskSubTab =
  | 'Tickets Center & Live Chat'
  | 'Self-Service Document Generator'
  | 'Desk Performance Analytics'
  | 'Operational Knowledge Base';

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  category: 'Payroll Discrepancy' | 'Document Request' | 'Tax Form Issue' | 'Benefits Inquiry' | 'General Policy';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved';
  createdBy: string;
  creatorId: string;
  createdAt: string;
  assignedTo: string;
  assignedAgentId: string;
  slaLimitHours: number;
  slaMinutesRemaining: number;
  isEscalated: boolean;
  confidentialChat: boolean;
  attachments: string[];
  replies: Array<{
    sender: 'Employee' | 'Support Representative' | 'System';
    senderName: string;
    text: string;
    timestamp: string;
    attachmentUrl?: string;
  }>;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpfulCount: number;
  voted?: boolean;
}

interface GeneratedDoc {
  id: string;
  templateType: string;
  employeeName: string;
  employeeId: string;
  issuedFor: string;
  purpose: string;
  salaryListed: string;
  dateGenerated: string;
  status: 'Awaiting Signature' | 'Digitally Signed & Issued';
  signedBy: string;
  verificationCode: string;
}

export function HelpdeskTab({ employees }: HelpdeskTabProps) {
  const addToast = (text: string, type?: 'success' | 'loading' | 'error' | 'info') => {
    showActionToast(text, type)
  }

  // 1. Current Subtab Selector
  const [activeSubTab, setActiveSubTab] = useState<HelpdeskSubTab>('Tickets Center & Live Chat');

  // 2. Initial State of Tickets (With real-world details, SLA targets and auto assignments)
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'TKT-9201',
      subject: 'Urgent: Discrepancy in May OT-claims calculation multiplier',
      description: 'My overtime hours for the weekend platform migration deployment on May 16th were calculated at 1.5x. According to team rules, standard deployment during holidays should be 2.0x base wage. Please reconcile.',
      category: 'Payroll Discrepancy',
      priority: 'High',
      status: 'In Progress',
      createdBy: 'Sarah Lim',
      creatorId: 'EMP-001',
      createdAt: '2026-06-15 09:12',
      assignedTo: 'Chong Wei Min (Compensation Leads)',
      assignedAgentId: 'EMP-002',
      slaLimitHours: 12,
      slaMinutesRemaining: 180, // 3 hours left
      isEscalated: false,
      confidentialChat: false,
      attachments: ['OT_Roster_May_16.pdf'],
      replies: [
        {
          sender: 'System',
          senderName: 'ServiceDesk Router',
          text: 'Ticket registered. Category identified as "Payroll Discrepancy". Automatic 12-hour response SLA bounds assigned.',
          timestamp: '2026-06-15 09:12'
        },
        {
          sender: 'Support Representative',
          senderName: 'Chong Wei Min',
          text: 'Hi Sarah, I am running a check on the May roster database. Indeed, the system flagged standard overtime instead of public holiday holiday rates. Will update this loop soon.',
          timestamp: '2026-06-15 11:30'
        },
        {
          sender: 'Employee',
          senderName: 'Sarah Lim',
          text: 'Thank you Chong, appreciate the swift checks. Here is the calendar sheet if required.',
          timestamp: '2026-06-15 13:00'
        }
      ]
    },
    {
      id: 'TKT-9202',
      subject: 'Inquiry regarding Optical limits & progressive lenses coverage terms',
      description: 'Does our health benefits package cover progressive and polarized medical prescription lenses? I see a general $400 allowance block but the manual has no detailed coverage matrix.',
      category: 'Benefits Inquiry',
      priority: 'Low',
      status: 'Open',
      createdBy: 'John Doe',
      creatorId: 'EMP-004',
      createdAt: '2026-06-15 14:03',
      assignedTo: 'Sarah Lim Wei Ling (Benefits Coordinator)',
      assignedAgentId: 'EMP-021',
      slaLimitHours: 48,
      slaMinutesRemaining: 2160, // 36 hours left
      isEscalated: false,
      confidentialChat: false,
      attachments: [],
      replies: [
        {
          sender: 'System',
          senderName: 'ServiceDesk Router',
          text: 'Ticket registered. Assigned to Benefits Office. standard 48-hour SLA bounds set.',
          timestamp: '2026-06-15 14:03'
        }
      ]
    },
    {
      id: 'TKT-9203',
      subject: 'Digital Certificate of Employment Request for home mortgage application',
      description: 'Requesting an official salary certificate with join details to facilitate a personal home loan application at HSBC bank.',
      category: 'Document Request',
      priority: 'Medium',
      status: 'Resolved',
      createdBy: 'Pinky Sharma',
      creatorId: 'EMP-0312',
      createdAt: '2026-06-12 10:00',
      assignedTo: 'HR Operations Group',
      assignedAgentId: 'EMP-001',
      slaLimitHours: 24,
      slaMinutesRemaining: 0,
      isEscalated: false,
      confidentialChat: false,
      attachments: ['Employment_Verification_HSBC.pdf'],
      replies: [
        {
          sender: 'Support Representative',
          senderName: 'HR Systems Hub',
          text: 'Hello Pinky! Standard verification generated successfully. Please check the Self-Service Document tab under ID DOC-1092. You can download the certified digital PDF directly there.',
          timestamp: '2026-06-12 15:45'
        },
        {
          sender: 'Employee',
          senderName: 'Pinky Sharma',
          text: 'Wow, this was incredibly quick! Standard verify done. Ticket closed.',
          timestamp: '2026-06-12 16:30'
        }
      ]
    },
    {
      id: 'TKT-9204',
      subject: 'Discrepancy in Year-to-Date tax statement deduction rate',
      description: 'The taxable medical benefits sum listed on my YTD tax deduction report seems incorrect. It double-counts the specialized health screening invoice filed back in March.',
      category: 'Tax Form Issue',
      priority: 'Critical',
      status: 'Open',
      createdBy: 'Michael Chang',
      creatorId: 'EMP-003',
      createdAt: '2026-06-15 16:22',
      assignedTo: 'Chong Wei Min (Tax Specialist)',
      assignedAgentId: 'EMP-002',
      slaLimitHours: 4,
      slaMinutesRemaining: -15, // Breached / overdue!
      isEscalated: true,
      confidentialChat: true,
      attachments: [],
      replies: [
        {
          sender: 'System',
          senderName: 'ServiceDesk Router',
          text: 'Ticket marked Critical. Target SLA 4 hours. Automated routing assigned matching Tax Form specialization.',
          timestamp: '2026-06-15 16:22'
        },
        {
          sender: 'System',
          senderName: 'SLA Escalation Engine',
          text: '🚨 ALERT: Milestone response target of 4 hours missed. Ticket status auto-escalated to Chief HR Officer for direct resolution.',
          timestamp: '2026-06-15 20:23'
        }
      ]
    },
    {
      id: 'TKT-9205',
      subject: 'Inquiry: Unpaid leave extended buffer limits protocol',
      description: 'Could you clarify the maximum duration allow-limit for an extended sabbatical leave block? I was unable to verify this on the remote intranet policy page.',
      category: 'General Policy',
      priority: 'Medium',
      status: 'Resolved',
      createdBy: 'Amina Al-Mansour',
      creatorId: 'EMP-008',
      createdAt: '2026-06-10 11:15',
      assignedTo: 'HR Support Analyst',
      assignedAgentId: 'EMP-015',
      slaLimitHours: 24,
      slaMinutesRemaining: 0,
      isEscalated: false,
      confidentialChat: false,
      attachments: [],
      replies: [
        {
          sender: 'Support Representative',
          senderName: 'HR Specialist',
          text: 'Hello Amina, according to section 6.4 of the corporate policy, unpaid sabbatical leaves are capped at a maximum of 6 calendar months per cycle. Re-approvals require department head routing.',
          timestamp: '2026-06-11 09:30'
        }
      ]
    }
  ]);

  // 3. Knowledge Base FAQs State (Expanding details and topics)
  const [faqs, setFaqs] = useState<FaqItem[]>([
    {
      id: 'FAQ-301',
      question: 'How is the Overtime (OT) multi-multiplier calculated on Public Holidays?',
      answer: 'Standard holiday overtime operates on 2.0x base wage, contrasted with normal weekdays (1.5x) or scheduled rest day roster plans. File under "Payroll Discrepancy" if your digital timesheet deviates so the payroll agent can run manual adjustments.',
      category: 'Payroll Discrepancy',
      helpfulCount: 42
    },
    {
      id: 'FAQ-302',
      question: 'Where can I find my certified IR8A or Form EA tax files?',
      answer: 'Tax statements are generated annually by April 1. You can access individual copies under the Payroll Management portal inside the Tax Statements tab. If there are double-claims warnings, submit a Tax Form ticket.',
      category: 'Tax Form Issue',
      helpfulCount: 38
    },
    {
      id: 'FAQ-303',
      question: 'How do I download a certified Salary Certificate for banks?',
      answer: "No ticket required! Jump to our 'Self-Service Document Generator' tab, select your name, enter the banking institution's details, sign your draft electronically, and your certified Salary PDF letter will compile instantly with digital verification stamps.",
      category: 'Document Request',
      helpfulCount: 57
    },
    {
      id: 'FAQ-304',
      question: 'What is the limit for optical checkups and prescription frames?',
      answer: 'Novora offers a maximum annual allowance of $400 for optical care, inclusive of specialized progressives and medical lenses. File your official receipt inside the Claims management subsystem.',
      category: 'Benefits Inquiry',
      helpfulCount: 29
    },
    {
      id: 'FAQ-305',
      question: 'How does the company coordinate remote internet allowances?',
      answer: 'Permanent remote or hybrid associates can request a maximum $80 monthly remote internet and telephone reimbursement block, with standard invoice copies uploaded to claims prior to the 25th of each calendar month.',
      category: 'Benefits Inquiry',
      helpfulCount: 21
    },
    {
      id: 'FAQ-306',
      question: 'What is the maximum duration buffer allowed for sickness leave blocks?',
      answer: 'Sickness allowances provide for 14 working days of outpatient medical shelter annual blocks, and up to 60 days of inpatient hospitalization leaves. All claims must carry certified clinical sheets.',
      category: 'General Policy',
      helpfulCount: 15
    }
  ]);

  // 4. State for Generated HR Documents (Self-Service)
  const [generatedDocs, setGeneratedDocs] = useState<GeneratedDoc[]>([
    {
      id: 'DOC-1091',
      templateType: 'Standard Employment Verification Letter',
      employeeName: 'Sarah Lim',
      employeeId: 'EMP-001',
      issuedFor: 'HSBC Mortgage Department',
      purpose: 'Housing mortgage eligibility verification',
      salaryListed: '$6,800.00 / month',
      dateGenerated: '2026-06-11 14:02',
      status: 'Digitally Signed & Issued',
      signedBy: 'David Ng (HR Director)',
      verificationCode: 'VER-HSBC-8723X'
    },
    {
      id: 'DOC-1092',
      templateType: 'Salary Certificate',
      employeeName: 'John Doe',
      employeeId: 'EMP-004',
      issuedFor: 'Embassy of Japan',
      purpose: 'Schengen-Equivalent Travel Visa application',
      salaryListed: '$4,200.00 / month',
      dateGenerated: '2026-06-14 11:20',
      status: 'Awaiting Signature',
      signedBy: '',
      verificationCode: 'VER-JAP-1092A'
    }
  ]);

  // SLA Time limits by category configuration
  const SLA_RULES = {
    'Payroll Discrepancy': { hours: 12, label: 'Payroll Team Tier-2' },
    'Document Request': { hours: 24, label: 'Operations Specialist' },
    'Tax Form Issue': { hours: 4, label: 'Comp & Tax Desk' },
    'Benefits Inquiry': { hours: 48, label: 'Benefits Coordinator' },
    'General Policy': { hours: 48, label: 'HR General Helpdesk' }
  };

  // Ticket creation modal typing helper
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<Ticket['category']>('Payroll Discrepancy');
  const [newPriority, setNewPriority] = useState<Ticket['priority']>('Medium');
  const [newCreatorId, setNewCreatorId] = useState('');
  const [confidentialToggle, setConfidentialToggle] = useState(false);

  // SLA Escalate custom override toggle, workloads toggling
  const [autoAssignmentEnabled, setAutoAssignmentEnabled] = useState(true);

  // Selected Active ticket & chat state
  const [selectedTicketId, setSelectedTicketId] = useState<string>('TKT-9201');
  const [chatInputText, setChatInputText] = useState('');
  const [chatInternalNote, setChatInternalNote] = useState(false);
  const [simulatedFileToUpload, setSimulatedFileToUpload] = useState<string>('');

  // Search, Filters inside Tickets center
  const [ticketSearchQuery, setTicketSearchQuery] = useState('');
  const [ticketCategoryFilter, setTicketCategoryFilter] = useState<string>('All');
  const [ticketPriorityFilter, setTicketPriorityFilter] = useState<string>('All');
  const [ticketStatusFilter, setTicketStatusFilter] = useState<string>('All');

  // Document Generator selection values
  const [selectedEmpId, setSelectedEmpId] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('Standard Employment Verification Letter');
  const [recipientOrg, setRecipientOrg] = useState<string>('');
  const [customMemoField, setCustomMemoField] = useState<string>('');
  const [verificationOutput, setVerificationOutput] = useState<GeneratedDoc | null>(null);
  const [eSignatureText, setESignatureText] = useState<string>('');

  // Knowledge base search term
  const [kbSearchTerm, setKbSearchTerm] = useState('');
  const [expandedKbId, setExpandedKbId] = useState<string | null>(null);

  // Simulated live counter ticker trigger to easily showcase SLA state
  const handleSimulateSlaBreach = (ticketId: string) => {
    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          const systemMsg = {
            sender: 'System' as const,
            senderName: 'SLA Guard Engine',
            text: '🚨 WARNING: Response deadline has lapsed! Automated ticket transition triggered. Re-routed to the escalate-deck.',
            timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ')
          };
          addToast(`SLA Timeout simulated for ticket ${ticketId}. Automated escalation completed!`, 'error');
          return {
            ...t,
            slaMinutesRemaining: -120, // force past breach status
            isEscalated: true,
            status: 'Open' as const, // move back to unresolved/needs immediate focus
            replies: [...t.replies, systemMsg]
          };
        }
        return t;
      })
    );
  };

  // Re-assign Ticket operator manually
  const handleManualReassign = (ticketId: string, employeeId: string) => {
    const selectedAgent = employees.find(e => e.id === employeeId);
    if (!selectedAgent) return;

    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          const sysMsg = {
            sender: 'System' as const,
            senderName: 'Workflow Supervisor',
            text: `Ticket manually re-assigned on account of workload balance. Lead Agent assigned: ${selectedAgent.name} (${selectedAgent.position}).`,
            timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ')
          };
          addToast(`Ticket re-assigned to ${selectedAgent.name} successfully.`, 'info');
          return {
            ...t,
            assignedTo: `${selectedAgent.name} (${selectedAgent.position})`,
            assignedAgentId: selectedAgent.id,
            replies: [...t.replies, sysMsg]
          };
        }
        return t;
      })
    );
  };

  // Resolve Ticket override
  const handleToggleTicketStatus = (ticketId: string, nextStatus: Ticket['status']) => {
    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          const textMsg = nextStatus === 'Resolved'
            ? '✅ Incident logged as Resolved. Client verification is complete.'
            : nextStatus === 'In Progress'
            ? '🛠️ Ticket transitioned back under Diagnostic Active In-Progress state.'
            : '❓ Ticket re-designated as Open.';
          
          const sysMsg = {
            sender: 'System' as const,
            senderName: 'Engine Admin',
            text: textMsg,
            timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ')
          };
          addToast(`Ticket ${ticketId} set to "${nextStatus}" status.`, 'success');
          return { ...t, status: nextStatus, replies: [...t.replies, sysMsg] };
        }
        return t;
      })
    );
  };

  // Send a message inside chat thread
  const handleSendChatMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!chatInputText.trim()) return;

    const currentTicket = tickets.find(t => t.id === selectedTicketId);
    if (!currentTicket) return;

    const newReply = {
      sender: (chatInternalNote ? 'System' as const : 'Support Representative' as const),
      senderName: chatInternalNote ? 'INTERNAL SECURE NOTE' : 'HR Specialist ServiceDesk',
      text: chatInputText + (simulatedFileToUpload ? ` [Attachment: ${simulatedFileToUpload}]` : ''),
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };

    setTickets(prev =>
      prev.map(t => {
        if (t.id === selectedTicketId) {
          return {
            ...t,
            status: t.status === 'Open' ? 'In Progress' : t.status, // auto move to in progress on reply
            replies: [...t.replies, newReply]
          };
        }
        return t;
      })
    );

    setChatInputText('');
    setSimulatedFileToUpload('');
    addToast('Message sent over secure ticket channel.', 'success');
  };

  // Handle document drafting action
  const handleGenerateDocument = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedEmpId || !recipientOrg) {
      addToast('Please input an associated employee and target destination bank/agency.', 'error');
      return;
    }

    const selectedEmployeeObj = employees.find(emp => emp.id === selectedEmpId);
    if (!selectedEmployeeObj) return;

    // Simulate simple salary list lookup based on employee level/position or generic defaults
    const simulatedSalaryNum = selectedEmployeeObj.position.includes('Senior') ? '$7,400.00' :
                              selectedEmployeeObj.position.includes('Lead') ? '$9,500.00' :
                              selectedEmployeeObj.position.includes('Director') ? '$14,200.00' : '$4,500.00';

    const newGeneratedObject: GeneratedDoc = {
      id: `DOC-${Math.floor(1200 + Math.random() * 5000)}`,
      templateType: selectedTemplate,
      employeeName: selectedEmployeeObj.name,
      employeeId: selectedEmployeeObj.id,
      issuedFor: recipientOrg,
      purpose: customMemoField || 'Official Verification of Employment Terms',
      salaryListed: `${simulatedSalaryNum} / month`,
      dateGenerated: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'Awaiting Signature',
      signedBy: '',
      verificationCode: `VER-${recipientOrg.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}X`
    };

    setGeneratedDocs([newGeneratedObject, ...generatedDocs]);
    setVerificationOutput(newGeneratedObject);
    setESignatureText('');
    addToast(`Successfully created salary/employment letter draft ${newGeneratedObject.id}.`, 'success');
  };

  // Sign standard letter digitally
  const handleDigitallySignDoc = (docId: string) => {
    if (!eSignatureText.trim()) {
      addToast('Please type your formal verification signature name before locking.', 'error');
      return;
    }

    setGeneratedDocs(prev =>
      prev.map(d => {
        if (d.id === docId) {
          addToast(`Certified: Document ${docId} has been locked and digitally signed.`, 'success');
          return {
            ...d,
            status: 'Digitally Signed & Issued',
            signedBy: `${eSignatureText} (Verified HR Representative)`
          };
        }
        return d;
      })
    );

    if (verificationOutput && verificationOutput.id === docId) {
      setVerificationOutput(prev => prev ? {
        ...prev,
        status: 'Digitally Signed & Issued',
        signedBy: `${eSignatureText} (Verified HR Representative)`
      } : null);
    }
  };

  // Submit helpdesk ticket request
  const handleCreateTicketSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDescription.trim() || !newCreatorId) {
      addToast('Please designate the reporter and outline the subject description.', 'error');
      return;
    }

    const employeeReporter = employees.find(emp => emp.id === newCreatorId);
    if (!employeeReporter) return;

    // Resolve Auto Assignment Lead based on workload configuration
    const defaultSlaHours = SLA_RULES[newCategory]?.hours || 24;
    
    // Choose dynamic assignee representing correct specialized support representative
    let defaultAssignee = 'HR Support Pool Analyst';
    let defaultAssigneeId = 'EMP-015';

    if (autoAssignmentEnabled) {
      if (newCategory === 'Payroll Discrepancy' || newCategory === 'Tax Form Issue') {
        defaultAssignee = 'Chong Wei Min (Compensation Leads)';
        defaultAssigneeId = 'EMP-002'; // existing comp expert ID
      } else if (newCategory === 'Benefits Inquiry') {
        defaultAssignee = 'Sarah Lim Wei Ling (Benefits Coordinator)';
        defaultAssigneeId = 'EMP-021';
      } else if (newCategory === 'Document Request') {
        defaultAssignee = 'HR Systems Hub';
        defaultAssigneeId = 'EMP-001';
      }
    }

    const newTicket: Ticket = {
      id: `TKT-${Math.floor(9210 + Math.random() * 600)}`,
      subject: newSubject,
      description: newDescription,
      category: newCategory,
      priority: newPriority,
      status: 'Open',
      createdBy: employeeReporter.name,
      creatorId: employeeReporter.id,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      assignedTo: defaultAssignee,
      assignedAgentId: defaultAssigneeId,
      slaLimitHours: defaultSlaHours,
      slaMinutesRemaining: defaultSlaHours * 60,
      isEscalated: false,
      confidentialChat: confidentialToggle,
      attachments: [],
      replies: [
        {
          sender: 'System',
          senderName: 'Intelligent Router',
          text: `Ticket generated. Category "${newCategory}" matched. Target service SLA limits set to ${defaultSlaHours} hours. Routed specifically to ${defaultAssignee}.`,
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' ')
        }
      ]
    };

    setTickets([newTicket, ...tickets]);
    setSelectedTicketId(newTicket.id);
    setIsNewTicketModalOpen(false);

    // Clear variables
    setNewSubject('');
    setNewDescription('');
    setConfidentialToggle(false);

    addToast(`Ticket ${newTicket.id} launched successfully. Team notified!`, 'success');
  };

  // Real-time FAQ matching helper as user is typing a subject
  const realTimeFaqSuggestions = useMemo(() => {
    if (newSubject.length < 3) return [];
    return faqs.filter(faq =>
      faq.question.toLowerCase().includes(newSubject.toLowerCase()) ||
      faq.category.toLowerCase().includes(newSubject.toLowerCase()) ||
      newSubject.toLowerCase().includes(faq.category.toLowerCase().split(' ')[0])
    );
  }, [newSubject, faqs]);

  // Compute stats metrics dynamically
  const metrics = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'Open').length;
    const progress = tickets.filter(t => t.status === 'In Progress').length;
    const resolved = tickets.filter(t => t.status === 'Resolved').length;
    
    // SLA breach is calculated if remaining minutes is negative and ticket is not resolved, or if escalated already
    const breached = tickets.filter(t => (t.slaMinutesRemaining < 0 && t.status !== 'Resolved') || t.isEscalated).length;
    const resolutionPrc = total > 0 ? Math.round((resolved / total) * 100) : 100;
    
    // Category Breakdown counts
    const catsBreakdown = {
      'Payroll Discrepancy': tickets.filter(t => t.category === 'Payroll Discrepancy').length,
      'Document Request': tickets.filter(t => t.category === 'Document Request').length,
      'Tax Form Issue': tickets.filter(t => t.category === 'Tax Form Issue').length,
      'Benefits Inquiry': tickets.filter(t => t.category === 'Benefits Inquiry').length,
      'General Policy': tickets.filter(t => t.category === 'General Policy').length,
    };

    return { total, open, progress, resolved, breached, resolutionPrc, catsBreakdown };
  }, [tickets]);

  // Handle upvoting inside FAQ articles
  const handleVoteHelpful = (faqId: string) => {
    setFaqs(prev =>
      prev.map(f => {
        if (f.id === faqId) {
          const v = f.voted;
          addToast(v ? 'Article upvote retracted.' : 'Marked as helpful. Thank you for your feedback!', 'success');
          return {
            ...f,
            voted: !v,
            helpfulCount: v ? f.helpfulCount - 1 : f.helpfulCount + 1
          };
        }
        return f;
      })
    );
  };

  // Filtered tickets based on options
  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const matchSearch =
        t.subject.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
        t.createdBy.toLowerCase().includes(ticketSearchQuery.toLowerCase());

      const matchCategory = ticketCategoryFilter === 'All' || t.category === ticketCategoryFilter;
      const matchPriority = ticketPriorityFilter === 'All' || t.priority === ticketPriorityFilter;
      const matchStatus = ticketStatusFilter === 'All' || t.status === ticketStatusFilter;

      return matchSearch && matchCategory && matchPriority && matchStatus;
    });
  }, [tickets, ticketSearchQuery, ticketCategoryFilter, ticketPriorityFilter, ticketStatusFilter]);

  // Curated Active Ticket in the detail pane
  const activeTicketObj = useMemo(() => {
    return tickets.find(t => t.id === selectedTicketId) || tickets[0] || null;
  }, [tickets, selectedTicketId]);

  return (
    <div id="helpdesk-inquiries-overall-root" className="space-y-6">



      {/* Sub-NavigationBar: Aligned exactly like leave management/ employee management */}
      <div id="helpdesk-sub-navbar-parent" className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-200/85 pb-4 gap-4">
        <div id="helpdesk-navigation-tabs" className="flex items-center gap-2 select-none overflow-x-auto w-full lg:w-auto scrollbar-none pb-1 lg:pb-0">
          {(
            [
              'Tickets Center & Live Chat',
              'Self-Service Document Generator',
              'Desk Performance Analytics',
              'Operational Knowledge Base'
            ] as HelpdeskSubTab[]
          ).map((tab) => {
            const isActive = activeSubTab === tab;
            let iconElement = <LifeBuoy className="h-3.5 w-3.5" />;
            if (tab === 'Self-Service Document Generator') iconElement = <FileText className="h-3.5 w-3.5" />;
            if (tab === 'Desk Performance Analytics') iconElement = <Activity className="h-3.5 w-3.5" />;
            if (tab === 'Operational Knowledge Base') iconElement = <BookOpen className="h-3.5 w-3.5" />;

            return (
              <button
                id={`tab-${tab.toLowerCase().replace(/\s+/g, '-')}`}
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all shrink-0 relative cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'text-[#2f66e0] bg-[#2f66e0]/10 border border-[#2f66e0]/15 font-extrabold'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
                }`}
              >
                {iconElement}
                <span>{tab}</span>
                {tab === 'Tickets Center & Live Chat' && metrics.open > 0 && (
                  <span className="bg-amber-500 text-white text-[9.5px] font-black h-4 px-1.5 rounded-full flex items-center justify-center shrink-0">
                    {metrics.open} Open
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#2f66e0] rounded-sm" />
                )}
              </button>
            );
          })}
        </div>

        {/* Global toggles / Quick Actions */}
        <div className="flex items-center gap-3 shrink-0 self-end lg:self-auto">
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
            <span className="text-[10px] uppercase font-black text-slate-400 pl-1.5">Auto-Route Rule:</span>
            <button
              onClick={() => {
                setAutoAssignmentEnabled(!autoAssignmentEnabled);
                addToast(`Automated workload routing set to ${!autoAssignmentEnabled ? 'ENABLED' : 'DISABLED'}.`, 'info');
              }}
              className={`text-[10px] font-black px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                autoAssignmentEnabled ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-800'
              }`}
            >
              {autoAssignmentEnabled ? 'ACTIVE RECRUITER' : 'MANUAL DISPATCH'}
            </button>
          </div>

          <button
            onClick={() => setIsNewTicketModalOpen(true)}
            className="bg-[#2f66e0] hover:bg-opacity-95 text-white text-xs font-extrabold px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer shadow-sm transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>File Inquiry Ticket</span>
          </button>
        </div>
      </div>

      {/* QUICK STATUS TICKER OVERVIEW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div id="stat-total" className="bg-white border border-slate-100 p-4 rounded-2xl shadow-3xs hover:border-slate-200 transition-colors">
          <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">Active Tickets Log</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold text-slate-900">{metrics.total}</span>
            <span className="text-[10px] font-bold text-slate-400">Total reported</span>
          </div>
        </div>

        <div id="stat-routing" className="bg-white border border-slate-100 p-4 rounded-2xl shadow-3xs hover:border-slate-200 transition-colors">
          <span className="text-[10px] font-black text-amber-600 block uppercase tracking-wider">Unassigned Open</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold text-amber-600">{metrics.open}</span>
            <span className="text-[10px] text-amber-500 font-extrabold bg-amber-50 px-1.5 py-0.5 rounded-md">Queue</span>
          </div>
        </div>

        <div id="stat-reconcile" className="bg-white border border-slate-100 p-4 rounded-2xl shadow-3xs hover:border-slate-200 transition-colors">
          <span className="text-[10px] font-black text-rose-500 block uppercase tracking-wider">SLA Breached / Warning</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold text-rose-600">{metrics.breached}</span>
            <span className="text-[10.5px] font-extrabold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-md">Action Req</span>
          </div>
        </div>

        <div id="stat-mitigation" className="bg-white border border-slate-100 p-4 rounded-2xl shadow-3xs hover:border-slate-200 transition-colors">
          <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">Closed resolution rate</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold text-[#2f66e0]">{metrics.resolutionPrc}%</span>
            <span className="text-[10px] font-bold text-slate-400">Target 90%+</span>
          </div>
        </div>
      </div>

      {/* ======================= SUBTAB SWITCHER RENDERERS ======================= */}

      {/* TAB 1: TICKETS CENTER & LIVE SUPPORT CHAT */}
      {activeSubTab === 'Tickets Center & Live Chat' && (
        <div id="tickets-tab-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Tickets Queue list with detailed filters (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Extended Filter parameters block */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-3xs space-y-3.5">
              <div className="flex items-center gap-1.5 pb-2.5 border-b border-slate-50">
                <Filter className="h-4 w-4 text-[#2f66e0]" />
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider">Filter Service Logs</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                <div className="sm:col-span-1">
                  <span className="text-[10px] text-slate-400 font-extrabold block mb-1">Keywords</span>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Ref, name or title..."
                      value={ticketSearchQuery}
                      onChange={(e) => setTicketSearchQuery(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-100 rounded-xl pl-8 pr-1 px-2.5 py-2 outline-none focus:bg-white font-medium text-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold block mb-1">Incident Category</span>
                  <select
                    value={ticketCategoryFilter}
                    onChange={(e) => setTicketCategoryFilter(e.target.value)}
                    className="w-full text-[11.5px] font-semibold text-slate-600 bg-slate-50 border border-slate-100 rounded-xl p-2 outline-none cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    <option value="Payroll Discrepancy">Payroll Discrepancy</option>
                    <option value="Document Request">Document Request</option>
                    <option value="Tax Form Issue">Tax Form Issue</option>
                    <option value="Benefits Inquiry">Benefits Inquiry</option>
                    <option value="General Policy">General Policy</option>
                  </select>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold block mb-1">Priority Target</span>
                  <select
                    value={ticketPriorityFilter}
                    onChange={(e) => setTicketPriorityFilter(e.target.value)}
                    className="w-full text-[11.5px] font-semibold text-slate-600 bg-slate-50 border border-slate-100 rounded-xl p-2 outline-none cursor-pointer"
                  >
                    <option value="All">All Priorities</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold block mb-1">Lifecycle Status</span>
                  <select
                    value={ticketStatusFilter}
                    onChange={(e) => setTicketStatusFilter(e.target.value)}
                    className="w-full text-[11.5px] font-semibold text-slate-600 bg-slate-50 border border-slate-100 rounded-xl p-2 outline-none cursor-pointer"
                  >
                    <option value="All">All States</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Ticket Queue Card Stack */}
            <div id="tickets-queue-stack" className="space-y-3.5 max-h-[640px] overflow-y-auto pr-1">
              {filteredTickets.length === 0 ? (
                <div className="bg-white border border-slate-100 p-10 rounded-2xl text-center space-y-2">
                  <AlertCircle className="h-10 w-10 text-slate-300 mx-auto" />
                  <h6 className="text-xs font-black text-slate-700 uppercase">No Incident Records Found</h6>
                  <p className="text-[11px] text-slate-400">Try modifying your filter settings or submit a new ticket for standard routing.</p>
                </div>
              ) : (
                filteredTickets.map((t) => {
                  const isCurrent = t.id === selectedTicketId;
                  
                  // Color codes
                  const priorityStyles =
                    t.priority === 'Critical' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                    t.priority === 'High' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                    t.priority === 'Medium' ? 'bg-blue-50 text-[#2f66e0]' :
                    'bg-slate-100 text-slate-600';

                  const stateIndicator =
                    t.status === 'Open' ? 'bg-amber-500' :
                    t.status === 'In Progress' ? 'bg-blue-500' :
                    'bg-emerald-500';

                  // Calculate SLA Display status
                  const isSlaBreached = t.slaMinutesRemaining < 0 && t.status !== 'Resolved';
                  const isSlaCritical = t.slaMinutesRemaining <= 180 && t.slaMinutesRemaining >= 0 && t.status !== 'Resolved';

                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTicketId(t.id)}
                      className={`bg-white border rounded-2xl p-4.5 cursor-pointer hover:shadow-xs transition-all ${
                        isCurrent
                          ? 'border-[#2f66e0] ring-2 ring-[#2f66e0]/15'
                          : 'border-slate-100 shadow-3xs'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">{t.id}</span>
                            <span className="text-slate-205 text-xs">&bull;</span>
                            <span className="text-[9.5px] font-black uppercase text-[#2f66e0] bg-blue-50/70 px-2 py-0.5 rounded">
                              {t.category}
                            </span>
                          </div>
                          
                          <h6 className="text-[12.5px] font-extrabold text-slate-800 leading-snug hover:text-[#2f66e0] transition-colors">
                            {t.subject}
                          </h6>
                        </div>

                        <span className={`text-[9px] font-black uppercase border px-2 py-0.5 rounded-lg shrink-0 ${priorityStyles}`}>
                          {t.priority}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-450 line-clamp-1 mt-1.5 font-medium leading-relaxed">
                        {t.description}
                      </p>

                      {/* Display warning badge if SLA is critical or breached */}
                      <div className="flex flex-wrap items-center gap-2 mt-3 pt-2.5 border-t border-slate-55 flex-row sm:justify-between text-[10px] text-slate-400 font-semibold gap-y-1">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 bg-slate-50 text-slate-600 px-2 py-1 rounded">
                            <User className="h-3 w-3 text-slate-450" />
                            <span className="font-bold">{t.createdBy}</span>
                          </div>
                          <span className="font-mono text-[9px] text-slate-400">{t.createdAt}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* SLA Timer indicators */}
                          {t.status !== 'Resolved' ? (
                            isSlaBreached ? (
                              <span className="text-[9.5px] font-black uppercase bg-rose-50 text-rose-600 px-2 py-0.5 rounded border border-rose-100 flex items-center gap-1">
                                <BadgeAlert className="h-3 w-3" />
                                <span>Breached Overdue</span>
                              </span>
                            ) : isSlaCritical ? (
                              <span className="text-[9.5px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 flex items-center gap-1 animate-pulse">
                                <Clock className="h-3 w-3" />
                                <span>Expires ({Math.floor(t.slaMinutesRemaining/60)}h left)</span>
                              </span>
                            ) : (
                              <span className="text-[9.5px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                Target SLA: {t.slaLimitHours} hrs
                              </span>
                            )
                          ) : (
                            <span className="text-[9.5px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Closed / Resolved</span>
                            </span>
                          )}

                          {/* Escalated state indicators */}
                          {t.isEscalated && (
                            <span className="text-[9.5px] font-black uppercase bg-[#2f66e0]/10 text-[#2f66e0] px-2 py-0.5 rounded flex items-center gap-1 border border-indigo-150">
                              <ShieldAlert className="h-3 w-3 text-blue-500 animate-spin" />
                              <span>Escalated</span>
                            </span>
                          )}

                          {t.confidentialChat && (
                            <span className="bg-amber-50 text-amber-700 font-extrabold text-[9px] px-1.5 py-0.5 rounded border border-amber-100 flex items-center gap-0.5" title="Confidential thread enabled">
                              <Lock className="h-2.5 w-2.5" />
                              <span>SECURE</span>
                            </span>
                          )}

                          {/* Status pill value */}
                          <div className="flex items-center gap-1.5">
                            <span className={`h-1.5 w-1.5 rounded-full ${stateIndicator}`} />
                            <span className="font-bold text-slate-600">{t.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Dynamic Deep Dive Workspace & Real-time secure discussion thread (5 Cols) */}
          <div className="lg:col-span-5">
            {activeTicketObj ? (
              <div id="active-workdesk-card" className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs flex flex-col justify-between min-h-[600px] space-y-5">
                
                {/* Header segment information */}
                <div className="space-y-3 pb-3 border-b border-slate-100">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-black uppercase tracking-widest px-2.5 py-1 rounded bg-slate-100 text-slate-600">
                      {activeTicketObj.id}
                    </span>

                    {/* Quick Resolve dropdown controls */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase">State:</span>
                      <select
                        value={activeTicketObj.status}
                        onChange={(e) => handleToggleTicketStatus(activeTicketObj.id, e.target.value as any)}
                        className="text-[11px] font-black border border-slate-100 rounded bg-slate-50 cursor-pointer outline-none focus:ring-1 focus:ring-[#2f66e0] p-1 text-slate-700"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-[14.5px] font-extrabold text-slate-800 leading-snug">
                      {activeTicketObj.subject}
                    </h5>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-[9.5px] bg-[#2f66e0]/10 text-[#2f66e0] font-black px-2 py-0.5 rounded uppercase">
                        {activeTicketObj.category}
                      </span>
                      <span className="text-slate-400 text-[10px] font-bold">&bull; Filed: {activeTicketObj.createdAt}</span>
                    </div>
                  </div>

                  {/* Operational Assignee selection indicator */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100/60 text-[11px] leading-relaxed text-slate-600 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[#2f66e0]">Primary Operator Role</span>
                      <span className="text-[9.5px] text-slate-400 font-bold">Auto-assigned</span>
                    </div>

                    <div className="flex items-center justify-between gap-1 mt-1.5">
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-extrabold text-slate-800">{activeTicketObj.assignedTo}</span>
                      </div>

                      {/* Let admins easily switch / manual reassign tickets */}
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleManualReassign(activeTicketObj.id, e.target.value);
                            e.target.value = ''; // Reset dropdown selection after dispatching
                          }
                        }}
                        className="text-[10px] font-bold bg-white border border-slate-200 rounded px-1 text-slate-600 cursor-pointer outline-none"
                      >
                        <option value="">Transfer Agent...</option>
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Main description file description and attachments */}
                <div className="space-y-3.5 flex-1">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs text-slate-700 leading-relaxed relative">
                    <span className="absolute -top-2 left-3 bg-white border border-slate-100 text-[9px] font-mono text-slate-400 px-2 py-0.5 rounded-full font-bold uppercase">
                      Reporter Transcript
                    </span>
                    <p className="mt-1 font-medium text-slate-600">{activeTicketObj.description}</p>

                    {/* List simulated attachments */}
                    {activeTicketObj.attachments.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-slate-200 flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-[#2f66e0]" />
                        <span className="text-[10px] font-black text-slate-400 uppercase">Uploaded Attachments:</span>
                        {activeTicketObj.attachments.map((file, i) => (
                          <span key={i} className="text-[10px] bg-white border border-slate-100 rounded px-2 py-0.5 cursor-pointer font-bold text-slate-600 hover:text-[#2f66e0] transition-colors">
                            {file}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Diagnostic / Escalation / SLA overrides panel */}
                  <div className="bg-rose-50/50 rounded-xl p-3 border border-rose-100 flex items-center justify-between text-xs transition-colors">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest block">SLA Overdue Escalator</span>
                      <p className="text-[11px] font-medium text-slate-600">Simulate breaching task response boundaries.</p>
                    </div>

                    <button
                      onClick={() => handleSimulateSlaBreach(activeTicketObj.id)}
                      className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black px-3 py-1.5 rounded-xl cursor-pointer shadow-3xs hover:-translate-y-0.5 transition-all"
                    >
                      Trigger Breach Re-route
                    </button>
                  </div>

                  {/* Two-Way Private Chat Thread Dialogue Stream */}
                  <div className="space-y-2 pb-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-slate-400">
                        <MessageSquare className="h-4 w-4 text-slate-450" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Two-Way Discussion Audio Trail</span>
                      </div>
                      
                      {activeTicketObj.confidentialChat && (
                        <div className="flex items-center gap-1 text-amber-600 text-[10px] font-bold">
                          <Lock className="h-3 w-3" />
                          <span>Strict Encryption Active</span>
                        </div>
                      )}
                    </div>

                    {/* Scrollable messages container */}
                    <div className="space-y-3 p-3 bg-slate-50 rounded-2xl max-h-[190px] overflow-y-auto scrollbar-thin border border-slate-100">
                      {activeTicketObj.replies.length === 0 ? (
                        <p className="text-[11px] text-slate-400 italic text-center py-6 font-medium">
                          No replies posted yet. Send guidance instructions below to initiate chat.
                        </p>
                      ) : (
                        activeTicketObj.replies.map((rep, idx) => {
                          const isSystem = rep.sender === 'System';
                          const isRep = rep.sender === 'Support Representative';
                          
                          let bubbleTheme = 'bg-white border border-slate-100 text-slate-700';
                          if (isSystem) {
                            bubbleTheme = 'bg-slate-200/50 border border-slate-200/60 text-slate-600 font-mono text-[10px] text-center';
                          } else if (isRep) {
                            bubbleTheme = 'bg-indigo-50 border border-indigo-100 text-indigo-900 ml-4';
                          } else {
                            bubbleTheme = 'bg-blue-50 border border-blue-100 text-slate-800 mr-4';
                          }

                          return (
                            <div key={idx} className={`p-2.5 rounded-xl space-y-1 text-xs leading-relaxed ${bubbleTheme}`}>
                              <div className="flex justify-between items-center text-[9px] font-extrabold text-slate-400 uppercase">
                                <span>{rep.senderName}</span>
                                <span className="font-mono text-[8.5px] font-medium">{rep.timestamp}</span>
                              </div>
                              <p className="font-medium text-slate-700 leading-relaxed">{rep.text}</p>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/* Interactive Post Comment form */}
                <form onSubmit={handleSendChatMessage} className="pt-3 border-t border-slate-100 space-y-2 bg-white">
                  
                  {/* Select file attachment mock utility (Correcting documents requests) */}
                  <div className="flex items-center justify-between text-[10px] text-slate-450 px-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold uppercase">Insert Corrected Document:</span>
                      <select
                        value={simulatedFileToUpload}
                        onChange={(e) => setSimulatedFileToUpload(e.target.value)}
                        className="text-[10px] font-bold border rounded bg-slate-50 p-0.5 text-slate-700 outline-none"
                      >
                        <option value="">-- No File selected --</option>
                        <option value="YTD_Revised_Tax_Recalculated.pdf">YTD_Revised_Tax_Recalculated.pdf</option>
                        <option value="Signed_Salary_Certificate.pdf">Signed_Salary_Certificate.pdf</option>
                        <option value="Medical_Checkup_Receipt.pdf">Medical_Checkup_Receipt.pdf</option>
                      </select>
                    </div>

                    {/* Toggle confidential note flag */}
                    <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setChatInternalNote(!chatInternalNote)}>
                      <input
                        type="checkbox"
                        checked={chatInternalNote}
                        onChange={() => {}}
                        className="rounded cursor-pointer accent-[#2f66e0]"
                      />
                      <span className="font-bold text-slate-500 uppercase">Internal Note Only</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      value={chatInputText}
                      onChange={(e) => setChatInputText(e.target.value)}
                      placeholder={chatInternalNote ? "Write operational internal supervisor audit log..." : "Clarify calculation details with the reporter..."}
                      className="flex-1 text-xs bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 outline-none focus:bg-white focus:border-[#2f66e0]/35 text-slate-750"
                    />
                    
                    <button
                      type="submit"
                      className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl p-2.5 cursor-pointer flex items-center justify-center border border-transparent hover:scale-105 transition-all text-xs"
                      title="Post Message"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </form>

              </div>
            ) : (
              <div className="bg-white border border-slate-100 rounded-3xl p-15 text-center text-slate-400">
                <LifeBuoy className="h-10 w-10 text-slate-350 mx-auto mb-2 animate-bounce" />
                <p className="text-xs">Select any incident voucher on the queue to load ticket Workspace diagnostic tools.</p>
              </div>
            )}
          </div>

        </div>
      )}


      {/* TAB 2: AUTOMATED DOCUMENT GENERATION (SELF-SERVICE LETTERS) */}
      {activeSubTab === 'Self-Service Document Generator' && (
        <div id="self-service-doc-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Input Selection Parameters Form (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="border-b pb-3.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#2f66e0]" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800">HR Standard Letters Portal</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Choose any employee. The system automatically populates dynamic payroll ledger, design, and join info instantly.</p>
              </div>

              <form onSubmit={handleGenerateDocument} className="space-y-4">
                
                {/* 1. Choose target Employee */}
                <div>
                  <label className="text-[10px] text-slate-400 font-extrabold block mb-1 uppercase">Associate Record</label>
                  <select
                    required
                    value={selectedEmpId}
                    onChange={(e) => setSelectedEmpId(e.target.value)}
                    className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl p-2.5 cursor-pointer outline-none focus:bg-white focus:border-[#2f66e0]/30"
                  >
                    <option value="">-- Choose employee details --</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} ({emp.position} - {emp.department})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Choose template format */}
                <div>
                  <label className="text-[10px] text-slate-400 font-extrabold block mb-1 uppercase">Letter Format Template</label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl p-2.5 cursor-pointer outline-none focus:bg-white"
                  >
                    <option value="Standard Employment Verification Letter">Standard Employment Verification Letter (Bank/Embassy Spec)</option>
                    <option value="Salary Certificate">Salary Certificate (Consolidated base + allowances listing)</option>
                    <option value="Performance Reference Letter">Performance Reference Letter (Inter-office relocation)</option>
                  </select>
                </div>

                {/* 3. Recipient Agency */}
                <div>
                  <label className="text-[10px] text-slate-400 font-extrabold block mb-1 uppercase">Issued For (Recipient Organisation)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Citibank Mortgage Hub, Japanese Consulate Regional Office"
                    value={recipientOrg}
                    onChange={(e) => setRecipientOrg(e.target.value)}
                    className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl p-2.5 outline-none focus:bg-white focus:border-[#2f66e0]/30"
                  />
                </div>

                {/* 4. Purpose Custom details */}
                <div>
                  <label className="text-[10px] text-slate-400 font-extrabold block mb-1 uppercase">Specific Purpose / memo (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. To facilitate the processing of a home loan application under official package clauses."
                    value={customMemoField}
                    onChange={(e) => setCustomMemoField(e.target.value)}
                    className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl p-2.5 outline-none focus:bg-white resize-none"
                  />
                </div>

                {/* Submit trigger compile */}
                <button
                  type="submit"
                  className="w-full bg-[#2f66e0] hover:bg-opacity-95 text-white text-xs font-black py-3 rounded-xl cursor-pointer shadow-3xs transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>Compile & Auto-Populate Letter</span>
                </button>

              </form>
            </div>

            {/* Historical Generated Document list */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-3xs space-y-3">
              <span className="text-[10px] font-black uppercase text-slate-450 block">Recent Issued Digital Certificates</span>
              
              <div className="space-y-2 max-h-[220px] overflow-y-auto">
                {generatedDocs.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setVerificationOutput(doc)}
                    className={`border p-3 rounded-xl cursor-pointer transition-all ${
                      verificationOutput?.id === doc.id ? 'border-[#2f66e0] bg-blue-50/10' : 'border-slate-50 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h6 className="text-[11px] font-black text-slate-800 line-clamp-1">{doc.templateType}</h6>
                        <p className="text-[9.5px] text-slate-500 font-bold mt-0.5">For {doc.employeeName} &bull; Ref {doc.id}</p>
                      </div>
                      
                      <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                        doc.status === 'Digitally Signed & Issued' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {doc.status === 'Digitally Signed & Issued' ? 'Certified' : 'Draft'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right: Premium Letterhead Live-Preview & Verification canvas (7 Cols) */}
          <div className="lg:col-span-7">
            {verificationOutput ? (
              <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 space-y-6 relative">
                
                {/* Simulated standard PDF paper water-mark background */}
                <div className="absolute inset-0 bg-[radial-gradient(#2f66e0_1px,transparent_1px)] bg-size-[16px_16px] opacity-2 pointer-events-none rounded-3xl" />

                {/* Official Letterhead Header */}
                <div className="border-b-2 border-navy-mid pb-4 flex justify-between items-start relative z-10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <div className="h-5 w-5 rounded bg-navy-mid flex items-center justify-center">
                        <span className="text-white text-[10px] font-black">N</span>
                      </div>
                      <span className="text-[12.5px] font-black text-navy-mid tracking-wider uppercase font-mono">Novora Global Corp</span>
                    </div>
                    <p className="text-[9px] text-slate-400 font-medium font-mono leading-none">
                      HR Operational Hub &bull; 100 Marina Parkway, Floor 18 &bull; Singapore 018989
                    </p>
                  </div>

                  <div className="text-right text-[10px] font-bold text-slate-400 uppercase font-mono">
                    <span>STATUS: {verificationOutput.status}</span>
                    <div className="text-[9px] font-black text-slate-600">{verificationOutput.verificationCode}</div>
                  </div>
                </div>

                {/* Inner official letter text body */}
                <div className="space-y-4 text-xs text-slate-700 leading-relaxed relative z-10 max-w-2xl mx-auto">
                  
                  <div className="text-right font-mono text-[10px] font-bold">
                    Date of Issue: {verificationOutput.dateGenerated}
                  </div>

                  <div className="space-y-1">
                    <span className="text-navy-mid font-extrabold uppercase">TO WHOM IT MAY CONCERN,</span>
                    <p className="font-bold text-slate-500">Destination Desk: {verificationOutput.issuedFor}</p>
                  </div>

                  <div className="space-y-2.5 mt-4 font-medium text-slate-600">
                    <p>
                      This serves to officially verify and certify that <strong>{verificationOutput.employeeName}</strong> (ID: <strong>{verificationOutput.employeeId}</strong>) is currently employed under active full-time status at Novora Global Corp.
                    </p>

                    <p>
                      Based on our secure, central corporate registry system, details of employment terms include the following parameters:
                    </p>

                    <ul className="list-disc pl-5 space-y-1 bg-slate-50 border border-slate-100 p-3 rounded-2xl font-mono text-[11px] text-slate-600">
                      <li><strong>Designation Position:</strong> {employees.find(e => e.id === verificationOutput.employeeId)?.position || 'General Specialist'}</li>
                      <li><strong>Department Domain:</strong> {employees.find(e => e.id === verificationOutput.employeeId)?.department || 'HR Division'}</li>
                      <li><strong>Official Base Salary:</strong> {verificationOutput.salaryListed}</li>
                      <li><strong>Employment Date:</strong> {employees.find(e => e.id === verificationOutput.employeeId)?.joinDate || '18 Jan 2024'}</li>
                    </ul>

                    <p>
                      This letter with verification reference code <strong>{verificationOutput.verificationCode}</strong> was expressly requested for client purposes: <em>"{verificationOutput.purpose}"</em>. This certificate is compiled electronically with tamper-proof security checksums.
                    </p>

                    <p>
                      For any secondary verification regarding tax parameters or authenticating the validity of this certificate, please reach our HR desk directly at <strong>verification@novora.com</strong>.
                    </p>
                  </div>
                </div>

                {/* Electronic stamp and signature blocks */}
                <div className="border-t pt-5 flex justify-between items-end relative z-10">
                  <div className="space-y-2">
                    <span className="text-[9.5px] font-black text-slate-450 uppercase block">HR Corporate Endorsement Stamp</span>
                    <div className="h-16 w-16 border-2 border-emerald-600/30 rounded-full flex items-center justify-center font-black text-[9px] text-emerald-600/60 uppercase tracking-widest font-mono text-center select-none rotate-12 bg-emerald-50/20">
                      <span>Certified<br/>Digital<br/>Stamp</span>
                    </div>
                  </div>

                  <div className="space-y-3.5 text-right w-64">
                    <span className="text-[9.5px] font-black text-slate-455 uppercase block">Signatory Representative Approval</span>
                    
                    {verificationOutput.status === 'Digitally Signed & Issued' ? (
                      <div className="space-y-1">
                        <span className="font-serif italic text-[#2f66e0] font-black text-[13px] block border-b pb-1 border-slate-100">
                          {verificationOutput.signedBy.split(' ')[0]}
                        </span>
                        <div className="text-[9px] font-bold text-slate-450 uppercase leading-none font-mono">
                          {verificationOutput.signedBy}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 bg-slate-50 border border-slate-100 p-3 rounded-xl text-left">
                        <label className="text-[9.5px] text-slate-400 font-extrabold block">Type Manager Name to sign</label>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            placeholder="David Ng"
                            value={eSignatureText}
                            onChange={(e) => setESignatureText(e.target.value)}
                            className="bg-white text-[10.5px] rounded px-2 py-1 outline-none border border-slate-200 font-semibold focus:border-[#2f66e0]/30 w-full"
                          />
                          <button
                            onClick={() => handleDigitallySignDoc(verificationOutput.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[9.5px] font-extrabold px-3 py-1 rounded cursor-pointer transition-colors shrink-0"
                          >
                            Sign
                          </button>
                        </div>
                        <span className="text-[8.5px] text-slate-400 font-medium block">Type name & click sign to verify.</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* PDF Print/Download simulation actions */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/55 p-3 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-455 font-bold">
                    <QrCode className="h-4 w-4 text-slate-400" />
                    <span>Scan code for authentic blockchain registry check.</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        window.print();
                        addToast('Opening system print preview menu.', 'info');
                      }}
                      className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>Print Document</span>
                    </button>

                    <button
                      onClick={() => addToast('Digital PDF file download initiated successfully.', 'success')}
                      className="bg-[#2f66e0] text-white hover:bg-opacity-95 text-xs font-black px-4 py-1.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shadow-3xs"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-100 border-dashed rounded-3xl p-24 text-center text-slate-400">
                <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <h6 className="text-xs font-black text-slate-700 uppercase">No Dynamic Letter Active</h6>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto mt-1">Select an employee record on the left-wing console and click "Compile & Auto-Populate Letter" to generate a beautiful printable corporate verification document.</p>
              </div>
            )}
          </div>

        </div>
      )}


      {/* TAB 3: RESOLUTION PERFORMANCE ANALYTICS & RECURRING PAIN-POINTS DASHBOARD */}
      {activeSubTab === 'Desk Performance Analytics' && (
        <div id="analytics-tab-frame" className="space-y-6">
          
          {/* Main Visual breakdown charts row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. Category Ticket Distribution Chart Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs space-y-4">
              <div>
                <h6 className="text-[11.5px] font-black text-slate-700 uppercase tracking-wider">Ticket Volume by Category</h6>
                <p className="text-[10px] text-slate-400">Distribution over current operating calendar year.</p>
              </div>

              {/* Graphical HTML implementation representing percentage metrics */}
              <div className="space-y-3.5 pt-1">
                {(Object.keys(metrics.catsBreakdown) as Array<keyof typeof metrics.catsBreakdown>).map((catName) => {
                  const count = metrics.catsBreakdown[catName];
                  const percentageWidth = metrics.total > 0 ? Math.round((count / metrics.total) * 100) : 0;
                  
                  let barColor = 'bg-[#2f66e0]';
                  if (catName === 'Payroll Discrepancy') barColor = 'bg-rose-500';
                  if (catName === 'Tax Form Issue') barColor = 'bg-amber-500';
                  if (catName === 'Benefits Inquiry') barColor = 'bg-teal-500';

                  return (
                    <div key={catName} className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-600">
                        <span>{catName}</span>
                        <span>{count} log ({percentageWidth}%)</span>
                      </div>
                      
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                        <div className={`${barColor} h-full rounded-full transition-all duration-500`} style={{ width: `${percentageWidth || 5}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. SLA Compliance metrics Gauge card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs space-y-4">
              <div>
                <h6 className="text-[11.5px] font-black text-slate-700 uppercase tracking-wider">Estimated SLA Breached Ratio</h6>
                <p className="text-[10px] text-slate-400">Compliance target bound 95% threshold.</p>
              </div>

              {/* Render visual progress circle showing SLA compliance */}
              <div className="flex flex-col items-center justify-center py-4 space-y-3">
                <div className="relative h-28 w-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="56" cy="56" r="48" className="stroke-slate-100 fill-none" strokeWidth="8" />
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      className="stroke-emerald-500 fill-none"
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 48}`}
                      strokeDashoffset={`${2 * Math.PI * 48 * (1 - (metrics.total > 0 ? (metrics.total - metrics.breached) / metrics.total : 1))}`}
                    />
                  </svg>
                  
                  <div className="absolute text-center">
                    <span className="text-xl font-black text-slate-800 block">
                      {metrics.total > 0 ? Math.round(((metrics.total - metrics.breached) / metrics.total) * 100) : 100}%
                    </span>
                    <span className="text-[8px] text-emerald-600 uppercase font-black">SLA Safe</span>
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-[11px] font-black text-slate-700">{metrics.breached} Active breach alerts need delegation</span>
                  <div className="text-[9px] text-slate-400 font-bold mt-1">Automatic Slack integration warns operations team.</div>
                </div>
              </div>
            </div>

            {/* 3. Ticket Resolution Timescales benchmarks */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs space-y-3.5">
              <div>
                <h6 className="text-[11.5px] font-black text-slate-700 uppercase tracking-wider">Resolution Turnaround Targets</h6>
                <p className="text-[10px] text-slate-400">Audit times listed by Priority classes.</p>
              </div>

              <div className="space-y-2.5 pt-1.5">
                {[
                  { priority: 'Critical', hours: '4 hrs', avg: '3.2 hrs', active: metrics.breached > 0, score: 'bg-rose-500 text-white' },
                  { priority: 'High', hours: '12 hrs', avg: '10.5 hrs', active: false, score: 'bg-amber-500 text-white' },
                  { priority: 'Medium', hours: '24 hrs', avg: '18.0 hrs', active: false, score: 'bg-[#2f66e0] text-white' },
                  { priority: 'Low', hours: '48 hrs', avg: '34.2 hrs', active: false, score: 'bg-teal-500 text-white' }
                ].map((bench) => (
                  <div key={bench.priority} className="flex items-center justify-between border-b pb-2 text-[11px] font-semibold text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[8px] px-1 rounded uppercase font-black ${bench.score}`}>
                        {bench.priority}
                      </span>
                      <span>Target: {bench.hours}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-500 block font-bold">YTD Avg: {bench.avg}</span>
                      {bench.active && (
                        <span className="text-[8px] uppercase font-black text-rose-500 bg-rose-50 px-1 py-0.5 rounded">Action required</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Systemic Pain Point Analyzer Notification Box */}
          <div className="bg-red-50/50 border border-red-100 rounded-3xl p-5 shadow-3xs space-y-3">
            <div className="flex items-center gap-2">
              <BadgeAlert className="h-5 w-5 text-red-600 animate-pulse" />
              <h6 className="text-xs font-black text-red-800 uppercase tracking-wider">Systemic Payroll Processing Pain Points Identified</h6>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              Warning: A spike in <strong>"Payroll Discrepancy"</strong> tickets (particularly weekend timesheet multiplier calculation anomalies) has been detected over the past 48 hours. This indicates a potential systemic payroll gateway database out-of-sync situation with the automated clocking system. 
            </p>

            <div className="bg-white border rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-3xs">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Reconcile System Action Recommendation</span>
                <span className="text-xs text-slate-700 font-medium">Reset automated Roster-Claims database sync protocol logs #SNC-9281.</span>
              </div>

              <button
                onClick={() => addToast('Systemic database claims synchronization initiated successfully.', 'success')}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-black px-4 py-2 rounded-xl scale-95 cursor-pointer hover:scale-100 transition-all shadow-3xs shrink-0 self-end sm:self-auto"
              >
                Sync Overtime Multiplier DB
              </button>
            </div>
          </div>

          {/* Resolution Timeline log report */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs whitespace-normal">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h6 className="text-[11.5px] font-black text-slate-700 uppercase tracking-wider font-mono">Recent Operations Lead Performance logs</h6>
                <p className="text-[10px] text-slate-400">Detailed resolution times parsed.</p>
              </div>

              <button
                onClick={() => addToast('Service Desk Operations CSV compiled.', 'success')}
                className="bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black px-3 py-1.5 rounded-xl cursor-pointer transition-all"
              >
                Download CSV report
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[11.5px] text-left text-slate-600 mt-3 whitespace-nowrap">
                <thead>
                  <tr className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100/60">
                    <th className="p-3.5 rounded-l-xl">Ticket Reference</th>
                    <th className="p-3.5">Filer Contact</th>
                    <th className="p-3.5">Assigned Agent Category</th>
                    <th className="p-3.5">SLA limit</th>
                    <th className="p-3.5">Resolution Time</th>
                    <th className="p-3.5 rounded-r-xl">Status code</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                  {tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-all">
                      <td className="p-3.5 font-mono text-[10px] font-black text-[#2f66e0]">{t.id}</td>
                      <td className="p-3.5">{t.createdBy} (ID {t.creatorId})</td>
                      <td className="p-3.5">{t.category}</td>
                      <td className="p-3.5 font-mono">{t.slaLimitHours} hours</td>
                      <td className="p-3.5 font-mono text-[11px] text-emerald-600">
                        {t.status === 'Resolved' ? 'Completed (~4.2 hrs)' : 'diagnostic active'}
                      </td>
                      <td className="p-3.5">
                        <span className={`text-[8.5px] px-2 py-0.5 rounded font-black uppercase ${
                          t.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-[#2f66e0]'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}


      {/* TAB 4: OPERATIONAL KNOWLEDGE BASE FAQ */}
      {activeSubTab === 'Operational Knowledge Base' && (
        <div id="faq-layout-frame" className="space-y-6">
          
          <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-xs whitespace-normal">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#2f66e0]" />
                  <h5 className="text-[13px] font-black text-slate-800 uppercase tracking-wider">Company Policies & Self-Help Archives</h5>
                </div>
                <p className="text-xs text-slate-400 font-semibold">Answers to general questions regarding payroll multiplier metrics, optical benefits coverage caps, internet claims, and remote limits.</p>
              </div>

              {/* FAQ Search widget */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Query payroll, tax, handbook clauses..."
                  value={kbSearchTerm}
                  onChange={(e) => setKbSearchTerm(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-3 py-2 outline-none focus:bg-white focus:border-[#2f66e0]/30 transition-all font-semibold text-slate-700"
                />
              </div>
            </div>

            {/* List the policy entries */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              {faqs
                .filter(faq =>
                  faq.question.toLowerCase().includes(kbSearchTerm.toLowerCase()) ||
                  faq.answer.toLowerCase().includes(kbSearchTerm.toLowerCase()) ||
                  faq.category.toLowerCase().includes(kbSearchTerm.toLowerCase())
                )
                .map((faq) => {
                  const isExpanded = expandedKbId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="border border-slate-100 rounded-2xl p-4 transition-all hover:bg-slate-50/20 shadow-3xs"
                    >
                      <button
                        onClick={() => setExpandedKbId(isExpanded ? null : faq.id)}
                        className="w-full flex items-start justify-between text-left cursor-pointer outline-none"
                      >
                        <div className="space-y-1">
                          <span className="text-[8px] font-black uppercase text-[#2f66e0] bg-blue-50/70 border border-blue-100/50 px-2 py-0.5 rounded tracking-wider">
                            {faq.category}
                          </span>
                          <h6 className="text-[12px] font-extrabold text-slate-800 pr-3 leading-tight mt-1">
                            {faq.question}
                          </h6>
                        </div>
                        <span>
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-slate-400" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                          )}
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="mt-3.5 pt-3.5 border-t border-slate-100 text-xs text-slate-600 leading-relaxed space-y-3 font-medium">
                          <p className="bg-slate-50 p-3 rounded-2xl border border-slate-100/80">
                            {faq.answer}
                          </p>

                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                            <span>FAQ Reference code: {faq.id}</span>

                            <button
                              onClick={() => handleVoteHelpful(faq.id)}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                                faq.voted ? 'bg-[#2f66e0]/10 text-[#2f66e0]' : 'hover:bg-slate-100 text-slate-450'
                              }`}
                            >
                              <ThumbsUp className={`h-3.5 w-3.5 ${faq.voted ? 'fill-blue-600 text-[#2f66e0]' : ''}`} />
                              <span>Helpful? ({faq.helpfulCount})</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

        </div>
      )}


      {/* ======================= SUPPORT TICKET INQUIRY RECRUITMENT FORM MODAL ======================= */}
      {isNewTicketModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border rounded-3xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b pb-3.5">
              <div className="flex items-center gap-2">
                <LifeBuoy className="h-5 w-5 text-[#2f66e0]" />
                <h5 className="text-xs font-black uppercase text-slate-800 tracking-wider">
                  New Support Request Ticket Form
                </h5>
              </div>

              <button
                onClick={() => setIsNewTicketModalOpen(false)}
                className="text-slate-400 hover:text-slate-800 text-sm font-extrabold cursor-pointer px-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicketSubmit} className="space-y-4">
              
              {/* 1. Creator Contact employee */}
              <div>
                <label className="text-[10px] text-slate-400 font-extrabold block mb-1 uppercase">Reporting Employee Client</label>
                <select
                  required
                  value={newCreatorId}
                  onChange={(e) => setNewCreatorId(e.target.value)}
                  className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl p-2.5 cursor-pointer outline-none focus:bg-white focus:ring-1 focus:ring-blue-105"
                >
                  <option value="">-- Select employee reporter --</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.position} - {emp.department})
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Topic Category and Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 font-extrabold block mb-1 uppercase">Inquiry Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl p-2.5 cursor-pointer outline-none focus:bg-white"
                  >
                    <option value="Payroll Discrepancy">Payroll Discrepancy</option>
                    <option value="Document Request">Document Request</option>
                    <option value="Tax Form Issue">Tax Form Issue</option>
                    <option value="Benefits Inquiry">Benefits Inquiry</option>
                    <option value="General Policy">General Policy</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-extrabold block mb-1 uppercase">Filing Severity / Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl p-2.5 cursor-pointer outline-none focus:bg-white"
                  >
                    <option value="Low">Low - Informational query (48h)</option>
                    <option value="Medium">Medium - Standard (24h)</option>
                    <option value="High">High - Impeding status (12h)</option>
                    <option value="Critical">Critical - Severe discrepancy (4h)</option>
                  </select>
                </div>
              </div>

              {/* 3. Subject Line (Types matches) */}
              <div>
                <label className="text-[10px] text-slate-400 font-extrabold block mb-1 uppercase">Topic Subject Title</label>
                <input
                  type="text"
                  required
                  placeholder="Draft clear title (e.g. Lost optical verification benefits password)"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl p-2.5 outline-none focus:bg-white focus:border-[#2f66e0]/30"
                />
              </div>

              {/* REAL-TIME ENHANCED FAQ SUGGESTIONS WHILE TYPING */}
              {realTimeFaqSuggestions.length > 0 && (
                <div className="bg-blue-50/60 p-3 rounded-2xl border border-blue-100/60 space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-1.5 text-[#2f66e0]">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span className="text-[9.5px] font-black uppercase">Suggested Solution Found (Saves Ticket Time)</span>
                  </div>
                  
                  <div className="space-y-1">
                    {realTimeFaqSuggestions.slice(0, 2).map((item) => (
                      <div key={item.id} className="text-xs bg-white p-2 rounded-xl border border-slate-100">
                        <span className="text-[8.5px] font-mono font-bold text-slate-400 block">{item.category} &bull; {item.id}</span>
                        <span className="font-extrabold text-[#193cb0] block">{item.question}</span>
                        <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">{item.answer}</p>
                        
                        <button
                          type="button"
                          onClick={() => {
                            addToast(`Resolved based on standard article: ${item.id}`, 'success');
                            setIsNewTicketModalOpen(false);
                            setNewSubject('');
                          }}
                          className="bg-emerald-600 text-white text-[9px] px-2 py-0.5 rounded mt-1.5 hover:bg-emerald-700 transition-all font-semibold"
                        >
                          This solves my issue!
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Support description */}
              <div>
                <label className="text-[10px] text-slate-400 font-extrabold block mb-1 uppercase">Filing Description Details</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Delineate dates, wage metrics calculation multipliers, or precise tax statements discrepancies to permit correct resolution diagnostics."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl p-2.5 outline-none focus:bg-white focus:border-[#2f66e0]/30 resize-none font-medium"
                />
              </div>

              {/* 5. Secure encryption toggle switch */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 border rounded-xl">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-600 uppercase block">Confidential / Double-Blind Channel</span>
                  <p className="text-[9.5px] text-slate-450">Limit viewing to payroll and direct tax specialists only.</p>
                </div>

                <button
                  type="button"
                  onClick={() => setConfidentialToggle(!confidentialToggle)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-colors ${
                    confidentialToggle ? 'bg-[#2f66e0] text-white' : 'bg-slate-300 text-slate-800'
                  }`}
                >
                  {confidentialToggle ? 'HIGH PRIVACY ACTIVE' : 'STANDARD'}
                </button>
              </div>

              {/* Form triggers */}
              <div className="flex gap-2 justify-end pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsNewTicketModalOpen(false)}
                  className="px-4 py-2 border border-slate-205 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2f66e0] text-white rounded-xl text-xs font-black shadow-3xs cursor-pointer hover:scale-105 transition-all whitespace-nowrap"
                >
                  Launch Support Ticket
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

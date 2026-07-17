import { useState, type FormEvent } from 'react'
import {
  GitBranch,
  Users,
  ShieldCheck,
  FileText,
  Database,
  Plus,
  Save,
  Edit2,
  Copy,
  CheckCircle2,
  Lock,
  RefreshCw,
  Search,
  Sliders,
  Download,
  Upload,
  ArrowLeft,
  Info,
} from 'lucide-react'
import { showActionToast } from '../../utils/actionToast'
import type { ModuleEmployee } from '../../types/moduleEmployee'

type SettingsTabProps = {
  activeSubTab: string
  setActiveSubTab: (tab: string) => void
  employees: ModuleEmployee[]
}

export function SettingsTab({ activeSubTab, setActiveSubTab: _setActiveSubTab, employees: _employees }: SettingsTabProps) {
  const addToast = (text: string, type?: 'success' | 'loading' | 'error' | 'info') => {
    showActionToast(text, type)
  }

  // --- STATE FOR SETTINGS ---

  // 1. Company Profile State
  const [profile, setProfile] = useState({
    companyName: 'Novora Pte Ltd',
    registrationNo: '202609312-W',
    industry: 'Technology & Software',
    companySize: '1,001 - 5,000 employees',
    foundedYear: '2016',
    website: 'www.novora.com',
    addr1: 'Level 18, Menara Novora, Jalan Sultan Ismail',
    city: 'Kuala Lumpur',
    state: 'Wilayah Persekutuan Kuala Lumpur',
    postcode: '50250',
    country: 'Malaysia',
    phone: '+60 3-2100 0000',
    hrEmail: 'hr@novora.com',
    payrollEmail: 'payroll@novora.com',
    epfNo: 'EPF-12345678',
    socsoNo: 'SSB-12345678',
    incomeTaxNo: 'PCB-12345678',
  });

  const handleProfileSave = (e: FormEvent) => {
    e.preventDefault();
    addToast('Updating corporate registry credentials...', 'loading');
    setTimeout(() => {
      addToast('Company profile settings saved successfully under "Novora Pte Ltd".', 'success');
    }, 1200);
  };

  // 2. Modules State - Fully Synchronized with Workspace Sidebar Roster
  const [modules, setModules] = useState([
    { id: 'emp', name: 'Employee Management', desc: 'Profile registry, org charts, document dossiers', enabled: true },
    { id: 'rec', name: 'Recruitment Management', desc: 'Candidate pools, vacancy pipeline, interview evaluations', enabled: true },
    { id: 'off', name: 'On/Off-boarding', desc: 'SSO auto-provisioning, hardware checklists, exit clears', enabled: true },
    { id: 'lv', name: 'Leave Management', desc: 'Balances, requests, multi-tier approvals', enabled: true },
    { id: 'att', name: 'Attendance & Rostering', desc: 'Clock-ins, smart location geo-fences, shifts', enabled: true },
    { id: 'pay', name: 'Payroll Engine', desc: 'Pay runs, bank e-files, regulatory files', enabled: true },
    { id: 'perf', name: 'Performance Review', desc: 'KPI scorecards, 360 review, evaluations', enabled: true },
    { id: 'disc', name: 'Disciplinary Cases', desc: 'Warning letters, hearings, actions tracker', enabled: true },
    { id: 'claims', name: 'Claim Management', desc: 'Receipt parsing, OCR scanning, limits', enabled: true },
    { id: 'ben', name: 'Benefits Administration', desc: 'Medical plans, insurance coverage, wellness grants', enabled: true },
    { id: 'help', name: 'Helpdesk & Inquiries', desc: 'SLA priority tickets, inquiry categories, CSAT surveys', enabled: true },
    { id: 'eng', name: 'Workspace Engagement', desc: 'Sentiment surveys, feedback quotes, flexibility ratings', enabled: true },
    { id: 'train', name: 'Training Programs', desc: 'HQ seminars, course catalogs, enrollment sheets', enabled: true },
    { id: 'learn', name: 'Learning & LMS', desc: 'Compliance certifications, verification hashes, modules', enabled: true },
    { id: 'assets', name: 'Hardware & Assets', desc: 'Item depreciation tracker, serial serial, custodian logs', enabled: true },
  ]);

  const toggleModule = (id: string) => {
    setModules(prev =>
      prev.map(m => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  };

  // 3. Branches State
  const [branches, setBranches] = useState([
    { id: 1, name: 'Kuala Lumpur HQ office', city: 'Kuala Lumpur', count: 1024, isMain: true },
    { id: 2, name: 'Penang Innovation hub', city: 'Georgetown', count: 142, isMain: false },
    { id: 3, name: 'Johor Fulfillment center', city: 'Johor Bahru', count: 118, isMain: false },
  ]);
  const [newBranch, setNewBranch] = useState({ name: '', city: '', count: 0 });
  const [showAddBranch, setShowAddBranch] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState<number | null>(null);
  const [editBranchForm, setEditBranchForm] = useState({ name: '', city: '', count: 0 });

  const addBranch = () => {
    if (!newBranch.name || !newBranch.city) {
      addToast('Please enter both branch name and city', 'error');
      return;
    }
    setBranches([
      ...branches,
      {
        id: Date.now(),
        name: newBranch.name,
        city: newBranch.city,
        count: newBranch.count || 0,
        isMain: false,
      },
    ]);
    setNewBranch({ name: '', city: '', count: 0 });
    setShowAddBranch(false);
    addToast('Brand-new company branch location registered.', 'success');
  };

  const startEditBranch = (b: { id: number; name: string; city: string; count: number }) => {
    setEditingBranchId(b.id);
    setEditBranchForm({ name: b.name, city: b.city, count: b.count });
    addToast(`Loaded settings for branch "${b.name}"`, 'info');
  };

  const saveEditedBranch = () => {
    if (!editBranchForm.name || !editBranchForm.city) {
      addToast('Please input both branch name and city', 'error');
      return;
    }
    setBranches(prev => prev.map(b => b.id === editingBranchId ? { ...b, name: editBranchForm.name, city: editBranchForm.city, count: editBranchForm.count } : b));
    setEditingBranchId(null);
    addToast('Branch details updated successfully.', 'success');
  };

  // 4. Department & Position State
  const [departments, setDepartments] = useState([
    { name: 'Engineering', head: 'David Ng', count: 342 },
    { name: 'Finance', head: 'Rachel Tan', count: 180 },
    { name: 'HR', head: 'Nina Reza', count: 88 },
    { name: 'Marketing', head: 'Kevin Lim', count: 142 },
    { name: 'Operations', head: 'Malik Said', count: 261 },
  ]);
  const [newDept, setNewDept] = useState({ name: '', head: '', count: 0 });
  const [showAddDept, setShowAddDept] = useState(false);

  const addDept = () => {
    if (!newDept.name || !newDept.head) {
      addToast('Please input department name and head', 'error');
      return;
    }
    setDepartments([...departments, { ...newDept }]);
    setNewDept({ name: '', head: '', count: 0 });
    setShowAddDept(false);
    addToast('Department added successfully.', 'success');
  };

  const [grades, setGrades] = useState([
    { id: 'G-3', min: 'MYR 2,500', max: 'MYR 4,000' },
    { id: 'G-5', min: 'MYR 4,500', max: 'MYR 6,000' },
    { id: 'G-7', min: 'MYR 6,550', max: 'MYR 9,000' },
    { id: 'G-9', min: 'MYR 9,550', max: 'MYR 15,000' },
  ]);
  const [newGrade, setNewGrade] = useState({ id: '', min: '', max: '' });
  const [showAddGrade, setShowAddGrade] = useState(false);

  const addGrade = () => {
    if (!newGrade.id || !newGrade.min || !newGrade.max) {
      addToast('Please fill in grade code and salary bounds', 'error');
      return;
    }
    setGrades([...grades, { ...newGrade }]);
    setNewGrade({ id: '', min: '', max: '' });
    setShowAddGrade(false);
    addToast('New salary Grade bracket established.', 'success');
  };

  // 5. Users & Accounts State (with updated emails)
  const [systemUsers, setSystemUsers] = useState([
    { id: 1, name: 'HR Admin', email: 'hr@novora.com', role: 'Super admin', lastActive: 'Just now', status: 'Active' },
    { id: 2, name: 'Nina Reza', email: 'nina@novora.com', role: 'HR manager', lastActive: '6 May 09:15', status: 'Active' },
    { id: 3, name: 'David Ng', email: 'david@novora.com', role: 'Department head', lastActive: '5 May 18:42', status: 'Active' },
  ]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Department head' });

  const inviteUser = () => {
    if (!newUser.name || !newUser.email) {
      addToast('Please specify user name and invitation email', 'error');
      return;
    }
    setSystemUsers([
      ...systemUsers,
      {
        id: Date.now(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        lastActive: 'Pending invite',
        status: 'Active',
      },
    ]);
    setNewUser({ name: '', email: '', role: 'Department head' });
    setShowAddUser(false);
    addToast(`Security invite email dispatched to ${newUser.email}`, 'success');
  };

  // 6. Security Roles Configuration State
  const [roles, setRoles] = useState([
    { name: 'Super admin', type: 'System default', desc: 'Unrestricted read/write credentials across every module' },
    { name: 'HR manager', type: 'Custom role', desc: 'Can administer files, rosters, run payroll and claims approval' },
    { name: 'Department head', type: 'Custom role', desc: 'Can view department cards, request approvals, review schedules' },
  ]);
  const [showCreateRole, setShowCreateRole] = useState(false);
  const [newRoleForm, setNewRoleForm] = useState({ name: '', desc: '', type: 'Custom role' });

  // Add matrix configuration state
  const [editingMatrixRole, setEditingMatrixRole] = useState<string | null>(null);
  const [matrixSearchQuery, setMatrixSearchQuery] = useState('');

  const [matrixPermissions, setMatrixPermissions] = useState<Record<string, Record<string, { read: boolean; create: boolean; edit: boolean; delete: boolean; export: boolean }>>>({
    'Super admin': {
      'Employee Directory': { read: true, create: true, edit: true, delete: true, export: true },
      'Attendance & Timesheets': { read: true, create: true, edit: true, delete: true, export: true },
      'Leave Management': { read: true, create: true, edit: true, delete: true, export: true },
      'Payroll Engine': { read: true, create: true, edit: true, delete: true, export: true },
      'Claim Management': { read: true, create: true, edit: true, delete: true, export: true },
      'Benefits Administration': { read: true, create: true, edit: true, delete: true, export: true },
      'Performance Review': { read: true, create: true, edit: true, delete: true, export: true },
      'Learning & LMS': { read: true, create: true, edit: true, delete: true, export: true },
      'Hardware & Assets': { read: true, create: true, edit: true, delete: true, export: true },
      'Helpdesk & Tickets': { read: true, create: true, edit: true, delete: true, export: true },
    },
    'HR manager': {
      'Employee Directory': { read: true, create: true, edit: true, delete: false, export: true },
      'Attendance & Timesheets': { read: true, create: true, edit: true, delete: false, export: true },
      'Leave Management': { read: true, create: true, edit: true, delete: false, export: true },
      'Payroll Engine': { read: true, create: true, edit: true, delete: false, export: true },
      'Claim Management': { read: true, create: true, edit: true, delete: false, export: true },
      'Benefits Administration': { read: true, create: true, edit: true, delete: false, export: true },
      'Performance Review': { read: true, create: true, edit: true, delete: false, export: true },
      'Learning & LMS': { read: true, create: true, edit: true, delete: false, export: true },
      'Hardware & Assets': { read: true, create: true, edit: true, delete: false, export: true },
      'Helpdesk & Tickets': { read: true, create: true, edit: true, delete: false, export: true },
    },
    'Department head': {
      'Employee Directory': { read: true, create: false, edit: false, delete: false, export: false },
      'Attendance & Timesheets': { read: true, create: false, edit: true, delete: false, export: false },
      'Leave Management': { read: true, create: false, edit: true, delete: false, export: false },
      'Payroll Engine': { read: false, create: false, edit: false, delete: false, export: false },
      'Claim Management': { read: true, create: true, edit: false, delete: false, export: false },
      'Benefits Administration': { read: true, create: false, edit: false, delete: false, export: false },
      'Performance Review': { read: true, create: true, edit: true, delete: false, export: true },
      'Learning & LMS': { read: true, create: false, edit: false, delete: false, export: false },
      'Hardware & Assets': { read: true, create: false, edit: false, delete: false, export: false },
      'Helpdesk & Tickets': { read: true, create: true, edit: false, delete: false, export: false },
    },
  });

  const createRole = () => {
    if (!newRoleForm.name || !newRoleForm.desc) {
      addToast('Please input both role name and description', 'error');
      return;
    }
    setRoles([...roles, { ...newRoleForm }]);
    
    // Initialize default matrix for newly registered role
    setMatrixPermissions(prev => ({
      ...prev,
      [newRoleForm.name]: {
        'Employee Directory': { read: true, create: false, edit: false, delete: false, export: false },
        'Attendance & Timesheets': { read: true, create: false, edit: false, delete: false, export: false },
        'Leave Management': { read: true, create: false, edit: false, delete: false, export: false },
        'Payroll Engine': { read: false, create: false, edit: false, delete: false, export: false },
        'Claim Management': { read: true, create: false, edit: false, delete: false, export: false },
        'Benefits Administration': { read: true, create: false, edit: false, delete: false, export: false },
        'Performance Review': { read: true, create: false, edit: false, delete: false, export: false },
        'Learning & LMS': { read: true, create: false, edit: false, delete: false, export: false },
        'Hardware & Assets': { read: true, create: false, edit: false, delete: false, export: false },
        'Helpdesk & Tickets': { read: true, create: false, edit: false, delete: false, export: false },
      }
    }));

    setNewRoleForm({ name: '', desc: '', type: 'Custom role' });
    setShowCreateRole(false);
    addToast(`Security role "${newRoleForm.name}" registered successfully!`, 'success');
  };

  const handleToggleCell = (role: string, module: string, field: 'read' | 'create' | 'edit' | 'delete' | 'export') => {
    setMatrixPermissions(prev => {
      const rolePermissions = prev[role] || {};
      const modulePermissions = rolePermissions[module] || { read: false, create: false, edit: false, delete: false, export: false };
      return {
        ...prev,
        [role]: {
          ...rolePermissions,
          [module]: {
            ...modulePermissions,
            [field]: !modulePermissions[field]
          }
        }
      };
    });
  };

  const handleToggleRow = (role: string, module: string, value: boolean) => {
    setMatrixPermissions(prev => {
      const rolePermissions = prev[role] || {};
      return {
        ...prev,
        [role]: {
          ...rolePermissions,
          [module]: {
            read: value,
            create: value,
            edit: value,
            delete: value,
            export: value
          }
        }
      };
    });
  };

  const handleToggleColumn = (role: string, field: 'read' | 'create' | 'edit' | 'delete' | 'export', value: boolean) => {
    setMatrixPermissions(prev => {
      const rolePermissions = prev[role] || {};
      const updated = { ...rolePermissions };
      Object.keys(updated).forEach(module => {
        updated[module] = {
          ...updated[module],
          [field]: value
        };
      });
      return {
        ...prev,
        [role]: updated
      };
    });
  };

  const getRolePermissions = (role: string) => {
    return matrixPermissions[role] || {
      'Employee Directory': { read: false, create: false, edit: false, delete: false, export: false },
      'Attendance & Timesheets': { read: false, create: false, edit: false, delete: false, export: false },
      'Leave Management': { read: false, create: false, edit: false, delete: false, export: false },
      'Payroll Engine': { read: false, create: false, edit: false, delete: false, export: false },
      'Claim Management': { read: false, create: false, edit: false, delete: false, export: false },
      'Benefits Administration': { read: false, create: false, edit: false, delete: false, export: false },
      'Performance Review': { read: false, create: false, edit: false, delete: false, export: false },
      'Learning & LMS': { read: false, create: false, edit: false, delete: false, export: false },
      'Hardware & Assets': { read: false, create: false, edit: false, delete: false, export: false },
      'Helpdesk & Tickets': { read: false, create: false, edit: false, delete: false, export: false },
    };
  };

  // 7. Approval Workflows State
  const [workflows, setWorkflows] = useState([
    { id: 'wf-1', name: 'Leave Approval Routing', active: true, desc: 'Requires 2-level supervisor signoff for long leaves', chain: 'Direct Manager → HOD' },
    { id: 'wf-2', name: 'Claims Reimbursements', active: true, desc: 'Routed dynamically according to claims tier amount', chain: 'Manager → Finance Team' },
    { id: 'wf-3', name: 'Overtime Dispatch Trigger', active: false, desc: 'Requires direct managers verification on additional clock cycles', chain: 'Direct Manager' },
  ]);
  const [showCreateWorkflow, setShowCreateWorkflow] = useState(false);
  const [newWorkflowForm, setNewWorkflowForm] = useState({ name: '', desc: '', chain: 'Direct Manager' });

  const createWorkflow = () => {
    if (!newWorkflowForm.name || !newWorkflowForm.desc) {
      addToast('Please enter both workflow name and description', 'error');
      return;
    }
    setWorkflows([
      ...workflows,
      {
        id: 'wf-' + Date.now(),
        name: newWorkflowForm.name,
        active: true,
        desc: newWorkflowForm.desc,
        chain: newWorkflowForm.chain,
      },
    ]);
    setNewWorkflowForm({ name: '', desc: '', chain: 'Direct Manager' });
    setShowCreateWorkflow(false);
    addToast(`Workflow template "${newWorkflowForm.name}" enabled successfully.`, 'success');
  };

  const toggleWorkflow = (id: string) => {
    setWorkflows(prev =>
      prev.map(w => (w.id === id ? { ...w, active: !w.active } : w))
    );
    addToast('Module workflow updated.', 'info');
  };

  // 8. Notifications State
  const [notifs, setNotifs] = useState({
    inApp: true,
    email: true,
    mobilePush: false,
    whatsappAlerts: false,
    leaveSubmitted: true,
    leaveApproved: true,
    missingPunch: true,
    claimsProcessed: true,
    contractRenew: true,
  });

  const saveNotifs = () => {
    addToast('Saving alert matrix updates...', 'loading');
    setTimeout(() => {
      addToast('Notification channels set properly.', 'success');
    }, 1000);
  };

  // 9. Integrations State
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [apiKey, setApiKey] = useState('sk-aperio-7a8f9cde2b61ef0a3c9e4f21');

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    addToast('API key credentials copied to secure clipboard.', 'success');
  };

  const generateNewKey = () => {
    addToast('Generating cryptographic tokens...', 'loading');
    setTimeout(() => {
      const newKey = `sk-aperio-${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}8e91`;
      setApiKey(newKey);
      addToast('New Live API access key generated.', 'success');
    }, 1200);
  };

  // 10. Security State
  const [securityParams, setSecurityParams] = useState({
    twoFa: true,
    sso: false,
    forceResetOnLogin: true,
    pwMinLength: '8',
    pwExpiryDays: '90 days',
    requireCaps: true,
    requireNums: true,
    requireSpec: true,
    sessionTimeout: '30 minutes',
    maxFailedAttempts: '5',
    auditLogging: true,
  });

  const saveSecurity = () => {
    addToast('Encrypting authentication guidelines...', 'loading');
    setTimeout(() => {
      addToast('Global security directives enforced.', 'success');
    }, 1300);
  };

  // 11. Audit Log Filter
  const [logFilter, setLogFilter] = useState('');
  const auditLogs = [
    { time: '6 May 10:42', user: 'David Ng', action: 'Approved claim MYR 120.00', module: 'Claims', ip: '192.168.1.24' },
    { time: '6 May 09:15', user: 'HR Admin', action: 'Updated payroll - May 2026', module: 'Payroll', ip: '192.168.1.10' },
    { time: '5 May 18:30', user: 'Nina Reza', action: 'Added disciplinary case EMP-0187', module: 'Disciplinary', ip: '192.168.1.14' },
    { time: '5 May 16:00', user: 'HR Admin', action: 'Deleted user account (EMP-0199)', module: 'Users', ip: '192.168.1.10' },
    { time: '4 May 11:00', user: 'HR Admin', action: 'Exported payroll report Apr 2026', module: 'Payroll', ip: '192.168.1.10' },
    { time: '3 May 15:15', user: 'Nina Reza', action: 'Updated compensation benefits policies', module: 'Benefits', ip: '192.168.1.14' },
  ];

  const filteredLogs = auditLogs.filter(
    log =>
      log.user.toLowerCase().includes(logFilter.toLowerCase()) ||
      log.action.toLowerCase().includes(logFilter.toLowerCase()) ||
      log.module.toLowerCase().includes(logFilter.toLowerCase())
  );

  // 12. Appearance settings
  const [themePref, setThemePref] = useState('Slate Light');
  const [density, setDensity] = useState('Cozy');
  const [accentColor, setAccentColor] = useState('Novora Blue');

  // 13. Languages State
  const [regional, setRegional] = useState({
    language: 'English (US)',
    timezone: 'Asia/Kuala_Lumpur (UTC+8)',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12-hour (AM/PM)',
    currency: 'MYR — Malaysian Ringgit',
    weekStart: 'Monday',
  });

  const saveRegional = () => {
    addToast('Updating system localisation arrays...', 'loading');
    setTimeout(() => {
      addToast('Timezone, calendar and currency parameters aligned.', 'success');
    }, 1100);
  };

  // 14. Email Templates
  const [templates, setTemplates] = useState([
    { id: 1, name: 'Leave request submitted', trigger: 'On leave request', edited: '2 Mar 2026', subject: 'New Leave Approval Requested', body: 'Dear Team,\n\nEmployee {name} has requested {days} days of leave.\n\nPlease review and action accordingly.\n\nBest regards,\nNovora HR Automated Engine' },
    { id: 2, name: 'Payslip available', trigger: 'On payroll confirm', edited: '1 Jan 2026', subject: 'Your Payslip is Ready - Novora', body: 'Dear {name},\n\nYour monthly earnings breakdown is completed and is ready for safe retrieval.\n\nPlease view your payslip record directly on the employee console.\n\nBest regards,\nNovora Payroll Operations' },
    { id: 3, name: 'Claim approved', trigger: 'On claim approval', edited: '15 Feb 2026', subject: 'Reimbursement Claim Approved', body: 'Dear {name},\n\nWe are pleased to inform you that your claim under receipt code {id} has been fully approved for reimbursement.\n\nThe sum will be disbursed on the upcoming pay period cycle.\n\nBest regards,\nNovora Finance Office' },
    { id: 4, name: 'Welcome - new employee', trigger: 'On employee creation', edited: '10 Jan 2026', subject: 'Welcome to Novora Pte Ltd!', body: 'Dear {name},\n\nWe are so excited to welcome you to the Novora family. Your official employee ID is registered, and your workspace credentials are being prepared.\n\nPlease login with your primary email {email} to finalize setup of your directory accounts.\n\nBest regards,\nNovora Onboarding Team' },
  ]);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<number | null>(null);
  const [newTemplateForm, setNewTemplateForm] = useState({ id: 0, name: '', trigger: 'On employee creation', subject: '', body: '' });

  const saveTemplate = () => {
    if (!newTemplateForm.name || !newTemplateForm.subject || !newTemplateForm.body) {
      addToast('Please input template name, subject, and body content text', 'error');
      return;
    }
    const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    
    if (editingTemplateId) {
      setTemplates(prev => prev.map(t => t.id === editingTemplateId ? { ...t, name: newTemplateForm.name, trigger: newTemplateForm.trigger, subject: newTemplateForm.subject, body: newTemplateForm.body, edited: todayStr } : t));
      setEditingTemplateId(null);
      addToast(`Email template "${newTemplateForm.name}" updated successfully.`, 'success');
    } else {
      setTemplates([
        ...templates,
        {
          id: Date.now(),
          name: newTemplateForm.name,
          trigger: newTemplateForm.trigger,
          edited: todayStr,
          subject: newTemplateForm.subject,
          body: newTemplateForm.body
        }
      ]);
      setShowCreateTemplate(false);
      addToast(`New email template "${newTemplateForm.name}" registered successfully.`, 'success');
    }
    setNewTemplateForm({ id: 0, name: '', trigger: 'On employee creation', subject: '', body: '' });
  };

  const startEditTemplate = (t: any) => {
    setEditingTemplateId(t.id);
    setNewTemplateForm({ id: t.id, name: t.name, trigger: t.trigger, subject: t.subject || 'Statutory Operational Notification', body: t.body || 'Email content matching employee workflow triggers.' });
    addToast(`Loaded template editor for "${t.name}"`, 'info');
  };

  // 15. Backup & Data
  const triggerBackupNow = () => {
    addToast('Initiating structural database backup on cloud volume...', 'loading');
    setTimeout(() => {
      addToast('Full backup snapshot stored safely in Amazon S3 container (4.2 GB).', 'success');
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl select-none">
      {/* SECTION CONTAINER WITH BENTO BOX FEEL */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6.5 shadow-xs">
        
        {/* TAB 1: Company Profile */}
        {activeSubTab === 'Company profile' && (
          <form onSubmit={handleProfileSave} className="space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-slate-800 tracking-tight">Company Profile</h2>
              <p className="text-[11px] font-semibold text-slate-400 mt-1">Configure company registry information and details.</p>
            </div>

            {/* Logo Settings Card */}
            <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-5 flex flex-col sm:flex-row items-center gap-5">
              <div className="relative h-18 w-18 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0a9cf5] to-[#2563eb] rounded-2xl rotate-12 opacity-80" />
                <div className="absolute inset-2 bg-white rounded-xl rotate-12" />
                <div className="absolute h-9 w-9 bg-indigo-500 rounded-full flex items-center justify-center text-white font-extrabold text-[15px] shadow-sm select-none">NV</div>
              </div>
              <div className="text-center sm:text-left">
                <h4 className="text-xs font-bold text-slate-800">Novora Pte Ltd</h4>
                <p className="text-[10px] font-medium text-slate-400 mt-1">Logo - Recommended size: 200x200px (PNG, SVG, or JPEG)</p>
                <div className="mt-2.5 flex items-center justify-center sm:justify-start gap-2">
                  <button
                    type="button"
                    onClick={() => addToast('Upload dialog simulated.', 'info')}
                    className="px-3 py-1.5 bg-white border border-slate-200 text-[10.5px] font-bold text-slate-700 hover:border-slate-300 rounded-lg cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <Upload className="h-3 w-3 text-slate-500" />
                    <span>Upload Logo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => addToast('Reverted logo to text fallback.', 'info')}
                    className="px-3 py-1.5 bg-red-50 text-red-650 hover:bg-red-100 text-[10.5px] font-bold rounded-lg cursor-pointer transition-all"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            {/* Basic Info Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Company Name</label>
                <input
                  type="text"
                  value={profile.companyName}
                  onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-[#2f66e0] focus:ring-1 focus:ring-[#2f66e0]/10 outline-none text-slate-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Registration No.</label>
                <input
                  type="text"
                  value={profile.registrationNo}
                  onChange={(e) => setProfile({ ...profile, registrationNo: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-[#2f66e0] outline-none text-slate-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Primary Industry</label>
                <input
                  type="text"
                  value={profile.industry}
                  onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-[#2f66e0] outline-none text-slate-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Company Size</label>
                <select
                  value={profile.companySize}
                  onChange={(e) => setProfile({ ...profile, companySize: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-[#2f66e0] outline-none text-slate-700"
                >
                  <option>1 - 50 employees</option>
                  <option>51 - 250 employees</option>
                  <option>251 - 1,000 employees</option>
                  <option>1,001 - 5,000 employees</option>
                  <option>5,000+ employees</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Founded Year</label>
                <input
                  type="text"
                  value={profile.foundedYear}
                  onChange={(e) => setProfile({ ...profile, foundedYear: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-[#2f66e0] outline-none text-slate-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Corporate Website</label>
                <input
                  type="text"
                  value={profile.website}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-[#2f66e0] outline-none text-slate-700"
                />
              </div>
            </div>

            {/* Address fields */}
            <div className="border-t border-slate-100 pt-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-750">Registered Corporate Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Address Line 1</label>
                  <input
                    type="text"
                    value={profile.addr1}
                    onChange={(e) => setProfile({ ...profile, addr1: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-[#2f66e0] outline-none text-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">City</label>
                  <input
                    type="text"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-[#2f66e0] outline-none text-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">State / Territory</label>
                  <input
                    type="text"
                    value={profile.state}
                    onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-[#2f66e0] outline-none text-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Postcode</label>
                  <input
                    type="text"
                    value={profile.postcode}
                    onChange={(e) => setProfile({ ...profile, postcode: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-[#2f66e0] outline-none text-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* Contact & statutory Tax details */}
            <div className="border-t border-slate-100 pt-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-750">Contact &amp; Tax Identifiers</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Phone Number</label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-[#2f66e0] outline-none text-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">HR Dept. Email</label>
                  <input
                    type="email"
                    value={profile.hrEmail}
                    onChange={(e) => setProfile({ ...profile, hrEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-[#2f66e0] outline-none text-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Payroll Dept. Email</label>
                  <input
                    type="email"
                    value={profile.payrollEmail}
                    onChange={(e) => setProfile({ ...profile, payrollEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-[#2f66e0] outline-none text-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">EPF Employer ID No.</label>
                  <input
                    type="text"
                    value={profile.epfNo}
                    onChange={(e) => setProfile({ ...profile, epfNo: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-[#2f66e0] outline-none text-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">SOCSO Employer ID No.</label>
                  <input
                    type="text"
                    value={profile.socsoNo}
                    onChange={(e) => setProfile({ ...profile, socsoNo: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-[#2f66e0] outline-none text-slate-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Monthly Tax No. (PCB)</label>
                  <input
                    type="text"
                    value={profile.incomeTaxNo}
                    onChange={(e) => setProfile({ ...profile, incomeTaxNo: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-[#2f66e0] outline-none text-slate-700"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="bg-[#2f66e0] text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-opacity-95 cursor-pointer transition-all flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                <span>Save Registry Details</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: Modules */}
        {activeSubTab === 'Modules' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-800 tracking-tight">System Modules configuration</h2>
                <p className="text-[11px] font-semibold text-slate-400 mt-1">Enable or disable HRMS modules globally company-wide.</p>
              </div>
              <button
                onClick={() => addToast('System module grid configuration saved successfully.', 'success')}
                className="bg-[#2f66e0] text-white px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-opacity-95 cursor-pointer transition-all flex items-center gap-1.5 animate-pulse"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Modules Setup</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {modules.map((m) => (
                <div
                  key={m.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                    m.enabled ? 'bg-white border-slate-200/90 shadow-xs' : 'bg-slate-50 border-slate-100 opacity-60'
                  }`}
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800">{m.name}</h4>
                    <p className="text-[10.5px] font-medium text-slate-400 pr-4 leading-relaxed">{m.desc}</p>
                  </div>
                  <button
                    onClick={() => {
                      toggleModule(m.id);
                      addToast(`${m.name} module toggled ${!m.enabled ? 'ON' : 'OFF'}`, 'info');
                    }}
                    className={`h-6.5 w-11 rounded-full p-0.5 transition-all outline-none cursor-pointer flex items-center shrink-0 ${
                      m.enabled ? 'bg-[#2f66e0]' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`h-5.5 w-5.5 bg-white rounded-full shadow-xs transition-transform transform ${
                        m.enabled ? 'translate-x-[18px]' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Branch & Location */}
        {activeSubTab === 'Branch & location' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-800 tracking-tight">Branch &amp; Location Registry</h2>
                <p className="text-[11px] font-semibold text-slate-400 mt-1">Manage company headquarters, offices, warehouses, and satellite sites.</p>
              </div>
              <button
                onClick={() => {
                  setShowAddBranch(true);
                  setEditingBranchId(null);
                }}
                className="bg-[#2f66e0] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-opacity-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Branch</span>
              </button>
            </div>

            {/* Quick add branch drawer inline */}
            {showAddBranch && !editingBranchId && (
              <div className="bg-slate-50/50 rounded-2xl p-4.5 border border-slate-100 space-y-4 max-w-xl animate-in fade-in">
                <h4 className="text-xs font-bold text-slate-800">Register Location</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Branch name (e.g. Johor Branch)"
                    value={newBranch.name}
                    onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none"
                  />
                  <input
                    type="text"
                    placeholder="City / Region"
                    value={newBranch.city}
                    onChange={(e) => setNewBranch({ ...newBranch, city: e.target.value })}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Employees"
                    value={newBranch.count || ''}
                    onChange={(e) => setNewBranch({ ...newBranch, count: parseInt(e.target.value) || 0 })}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={addBranch} className="px-3 py-1.5 bg-[#2f66e0] text-white font-bold text-xs rounded-lg cursor-pointer">
                    Confirm Location
                  </button>
                  <button onClick={() => setShowAddBranch(false)} className="px-3 py-1.5 bg-slate-200 text-slate-700 font-bold text-xs rounded-lg cursor-pointer">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Quick edit branch inline */}
            {editingBranchId && (
              <div className="bg-[#2f66e0]/5 rounded-2xl p-4.5 border border-[#2f66e0]/25 space-y-4 max-w-xl animate-in fade-in">
                <h4 className="text-xs font-bold text-[#2f66e0] flex items-center gap-1.5">
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Modify Branch: {editBranchForm.name}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Branch name"
                    value={editBranchForm.name}
                    onChange={(e) => setEditBranchForm({ ...editBranchForm, name: e.target.value })}
                    className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold outline-none focus:border-[#2f66e0]"
                  />
                  <input
                    type="text"
                    placeholder="City / Region"
                    value={editBranchForm.city}
                    onChange={(e) => setEditBranchForm({ ...editBranchForm, city: e.target.value })}
                    className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold outline-none focus:border-[#2f66e0]"
                  />
                  <input
                    type="number"
                    placeholder="Employees"
                    value={editBranchForm.count || ''}
                    onChange={(e) => setEditBranchForm({ ...editBranchForm, count: parseInt(e.target.value) || 0 })}
                    className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold outline-none focus:border-[#2f66e0]"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={saveEditedBranch} className="px-3 py-1.5 bg-[#2f66e0] text-white font-bold text-xs rounded-lg cursor-pointer">
                    Save Changes
                  </button>
                  <button onClick={() => setEditingBranchId(null)} className="px-3 py-1.5 bg-slate-200 text-slate-700 font-bold text-xs rounded-lg cursor-pointer">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Branches Table */}
            <div className="border border-slate-100/80 rounded-2xl overflow-hidden bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5 font-bold">Branch Name</th>
                    <th className="px-5 py-3.5 font-bold">City</th>
                    <th className="px-5 py-3.5 font-bold">Staff count</th>
                    <th className="px-5 py-3.5 font-bold">Status Badge</th>
                    <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-600">
                  {branches.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-750">{b.name}</td>
                      <td className="px-5 py-3.5">{b.city}</td>
                      <td className="px-5 py-3.5">{b.count} staff members</td>
                      <td className="px-5 py-3.5">
                        {b.isMain ? (
                          <span className="bg-emerald-50 text-emerald-650 border border-emerald-100 px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wide uppercase">
                            Main Branch HQ
                          </span>
                        ) : (
                          <span className="bg-blue-50 text-blue-650 border border-blue-100 px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wide uppercase">
                            Active Office
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => startEditBranch(b)}
                          className="text-[#2f66e0] hover:underline hover:text-blue-800 text-xs font-bold cursor-pointer"
                        >
                          Modify
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Department & Position */}
        {activeSubTab === 'Department & position' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-base font-extrabold text-slate-800 tracking-tight">Departments &amp; Job Grades Setup</h2>
              <p className="text-[11px] font-semibold text-slate-400 mt-1">Establish company administrative charts, departmental divisions, and compensation salary brackets.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              {/* DEPARTMENTS CARD */}
              <div className="space-y-4.5 bg-white border border-slate-100/80 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b pb-1.5 flex-1">Corporate Departments</h3>
                  <button onClick={() => setShowAddDept(true)} className="text-[#2f66e0] hover:text-blue-800 text-[11px] font-bold flex items-center gap-0.5 cursor-pointer">
                    <Plus className="h-3 w-3" />
                    <span>Department</span>
                  </button>
                </div>

                {showAddDept && (
                  <div className="bg-slate-50 p-4 border rounded-xl space-y-3.5">
                    <h4 className="text-[11px] font-bold text-slate-800">Add Department</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Department name"
                        value={newDept.name}
                        onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                        className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Department Head (e.g. David Ng)"
                        value={newDept.head}
                        onChange={(e) => setNewDept({ ...newDept, head: e.target.value })}
                        className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none"
                      />
                    </div>
                    <div className="flex gap-2.5">
                      <button onClick={addDept} className="px-3 py-1 bg-[#2f66e0] text-white text-xs font-bold rounded-lg cursor-pointer">
                        Add
                      </button>
                      <button onClick={() => setShowAddDept(false)} className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="divide-y divide-slate-100 font-semibold text-slate-600 text-xs">
                  {departments.map((d, index) => (
                    <div key={index} className="py-2.5 flex justify-between items-center hover:bg-slate-50/40 px-2 rounded-lg">
                      <div>
                        <div className="font-bold text-slate-750">{d.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wide">Head: &bull; {d.head}</div>
                      </div>
                      <div className="text-[11px] font-bold text-[#2f66e0] bg-blue-50/80 px-2 py-0.5 rounded-md border border-blue-100">
                        {d.count} employees
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* JOB GRADES CARD */}
              <div className="space-y-4.5 bg-white border border-slate-100/80 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b pb-1.5 flex-1">Job Salary Grades</h3>
                  <button onClick={() => setShowAddGrade(true)} className="text-[#2f66e0] hover:text-blue-800 text-[11px] font-bold flex items-center gap-0.5 cursor-pointer">
                    <Plus className="h-3 w-3" />
                    <span>Grade Bracket</span>
                  </button>
                </div>

                {showAddGrade && (
                  <div className="bg-slate-50 p-4 border rounded-xl space-y-3.5">
                    <h4 className="text-[11px] font-bold text-slate-800">Add Grade Bracket</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Grade Code (e.g. G-6)"
                        value={newGrade.id}
                        onChange={(e) => setNewGrade({ ...newGrade, id: e.target.value })}
                        className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Min salary (MYR)"
                        value={newGrade.min}
                        onChange={(e) => setNewGrade({ ...newGrade, min: e.target.value })}
                        className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Max salary (MYR)"
                        value={newGrade.max}
                        onChange={(e) => setNewGrade({ ...newGrade, max: e.target.value })}
                        className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none"
                      />
                    </div>
                    <div className="flex gap-2.5">
                      <button onClick={addGrade} className="px-3 py-1 bg-[#2f66e0] text-white text-xs font-bold rounded-lg cursor-pointer">
                        Add
                      </button>
                      <button onClick={() => setShowAddGrade(false)} className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="divide-y divide-slate-100 font-semibold text-slate-600 text-xs">
                  {grades.map((grade) => (
                    <div key={grade.id} className="py-2.5 flex justify-between items-center hover:bg-slate-50/40 px-2 rounded-lg">
                      <div className="font-extrabold text-slate-800 text-xs bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">{grade.id}</div>
                      <div className="text-right">
                        <div className="font-bold text-slate-700">{grade.min} &mdash; {grade.max}</div>
                        <div className="text-[9.5px] font-bold text-slate-400 mt-0.5">Approved corporate bounds</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: Users & Accounts */}
        {activeSubTab === 'Users & accounts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-800 tracking-tight">System Account Operators</h2>
                <p className="text-[11px] font-semibold text-slate-400 mt-1">Administer login access credentials, authorization scopes, and active administrative users.</p>
              </div>
              <button
                onClick={() => setShowAddUser(true)}
                className="bg-[#2f66e0] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-opacity-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Invite User</span>
              </button>
            </div>

            {showAddUser && (
              <div className="bg-slate-50/50 p-4 border rounded-2xl max-w-xl space-y-4">
                <h4 className="text-xs font-bold text-slate-800">Assign New Operator Account</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Operator name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none"
                  />
                  <input
                    type="email"
                    placeholder="HR email (e.g. nina@email.com)"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none"
                  />
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none"
                  >
                    <option>Super admin</option>
                    <option>HR manager</option>
                    <option>Department head</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button onClick={inviteUser} className="px-3 py-1.5 bg-[#2f66e0] text-white font-bold text-xs rounded-lg cursor-pointer">
                    Dispatch invite
                  </button>
                  <button onClick={() => setShowAddUser(false)} className="px-3 py-1.5 bg-slate-200 text-slate-700 font-bold text-xs rounded-lg cursor-pointer">
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* Operator Users table */}
            <div className="border border-slate-100/80 rounded-2xl overflow-hidden bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5 font-bold">User / Operator Contact</th>
                    <th className="px-5 py-3.5 font-bold">Assigned Security Role</th>
                    <th className="px-5 py-3.5 font-bold">Last Active UTC</th>
                    <th className="px-5 py-3.5 font-bold">Status</th>
                    <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-600">
                  {systemUsers.map((su) => (
                    <tr key={su.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-750">{su.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold mt-0.5">{su.email}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 text-[9.5px] font-extrabold rounded-md uppercase tracking-wide border ${
                          su.role === 'Super admin'
                            ? 'bg-blue-50 text-blue-650 border-blue-100'
                            : su.role === 'HR manager'
                            ? 'bg-purple-50 text-purple-650 border-purple-100'
                            : 'bg-amber-50 text-amber-650 border-amber-100'
                        }`}>
                          {su.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 font-medium">{su.lastActive}</td>
                      <td className="px-5 py-3.5">
                        <span className="bg-emerald-50 text-emerald-650 border border-emerald-100 px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wide uppercase">
                          Active State
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => {
                            if (su.id === 1) {
                              addToast('Protection: cannot purge primary root admin.', 'error');
                              return;
                            }
                            setSystemUsers(systemUsers.filter((u) => u.id !== su.id));
                            addToast('Operator access revoked successfully.', 'success');
                          }}
                          className="text-red-500 hover:text-red-750 hover:underline cursor-pointer"
                        >
                          Revoke Access
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 6: Roles & Permissions */}
        {activeSubTab === 'Roles & permissions' && (
          editingMatrixRole ? (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* HEADER WITH BACK LINK */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
                <div className="space-y-1">
                  <button
                    onClick={() => setEditingMatrixRole(null)}
                    className="flex items-center gap-1 text-xs font-bold text-[#2f66e0] hover:underline cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to Roles Directory</span>
                  </button>
                  <div className="flex items-center gap-2.5 mt-2">
                    <h2 className="text-base font-extrabold text-slate-800 tracking-tight">
                      Permissions Matrix: <span className="text-[#2f66e0]">{editingMatrixRole}</span>
                    </h2>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 bg-blue-50 text-blue-655 border border-blue-100 rounded-md uppercase tracking-wider">
                      {roles.find(r => r.name === editingMatrixRole)?.type || 'Custom role'}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-400 mt-1">
                    {roles.find(r => r.name === editingMatrixRole)?.desc}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    onClick={() => {
                      const current = getRolePermissions(editingMatrixRole);
                      const updated = { ...current };
                      Object.keys(updated).forEach(module => {
                        updated[module] = { read: true, create: true, edit: true, delete: true, export: true };
                      });
                      setMatrixPermissions(prev => ({ ...prev, [editingMatrixRole]: updated }));
                      addToast(`Granted all platform credentials for "${editingMatrixRole}"`, 'info');
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Grant All</span>
                  </button>
                  <button
                    onClick={() => {
                      const current = getRolePermissions(editingMatrixRole);
                      const updated = { ...current };
                      Object.keys(updated).forEach(module => {
                        updated[module] = { read: false, create: false, edit: false, delete: false, export: false };
                      });
                      setMatrixPermissions(prev => ({ ...prev, [editingMatrixRole]: updated }));
                      addToast(`Revoked all platform credentials for "${editingMatrixRole}"`, 'info');
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Lock className="h-3.5 w-3.5" />
                    <span>Revoke All</span>
                  </button>
                </div>
              </div>

              {/* WARNING INFOBAR */}
              <div className="bg-amber-50/60 border border-amber-200/60 rounded-2xl p-4 flex items-start gap-3">
                <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-amber-800">Operational Notice</h4>
                  <p className="text-[11px] font-medium text-amber-700/90 leading-relaxed">
                    A Permissions Matrix determines functional user access rights across Novora HRMS modules. 
                    Setting these changes will instantly apply to all platform operators assigned to the <strong>{editingMatrixRole}</strong> role globally.
                  </p>
                </div>
              </div>

              {/* SEARCH & FILTER BAR */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search module capabilities..."
                    value={matrixSearchQuery}
                    onChange={(e) => setMatrixSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-[#2f66e0] outline-none text-slate-700 placeholder-slate-400 shadow-3xs"
                  />
                </div>
                {matrixSearchQuery && (
                  <button
                    onClick={() => setMatrixSearchQuery('')}
                    className="text-xs text-[#2f66e0] hover:underline font-bold cursor-pointer"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              {/* THE MATRIX GRID */}
              <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-3xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="px-5 py-4 font-bold text-slate-600 min-w-[200px]">Module / Capability</th>
                        
                        {/* VIEW COLUMN HEADER */}
                        <th className="px-4 py-4 text-center">
                          <div className="flex flex-col items-center gap-1.5">
                            <span>Read / View</span>
                            <button
                              type="button"
                              onClick={() => {
                                const current = getRolePermissions(editingMatrixRole);
                                const allChecked = Object.values(current).every((m: any) => m.read);
                                handleToggleColumn(editingMatrixRole, 'read', !allChecked);
                                addToast(`Toggled Read / View column state`, 'info');
                              }}
                              className="text-[9px] text-[#2f66e0] hover:underline font-bold normal-case tracking-normal cursor-pointer"
                            >
                              Toggle Col
                            </button>
                          </div>
                        </th>

                        {/* CREATE COLUMN HEADER */}
                        <th className="px-4 py-4 text-center">
                          <div className="flex flex-col items-center gap-1.5">
                            <span>Create / Add</span>
                            <button
                              type="button"
                              onClick={() => {
                                const current = getRolePermissions(editingMatrixRole);
                                const allChecked = Object.values(current).every((m: any) => m.create);
                                handleToggleColumn(editingMatrixRole, 'create', !allChecked);
                                addToast(`Toggled Create / Add column state`, 'info');
                              }}
                              className="text-[9px] text-[#2f66e0] hover:underline font-bold normal-case tracking-normal cursor-pointer"
                            >
                              Toggle Col
                            </button>
                          </div>
                        </th>

                        {/* EDIT COLUMN HEADER */}
                        <th className="px-4 py-4 text-center">
                          <div className="flex flex-col items-center gap-1.5">
                            <span>Edit / Modify</span>
                            <button
                              type="button"
                              onClick={() => {
                                const current = getRolePermissions(editingMatrixRole);
                                const allChecked = Object.values(current).every((m: any) => m.edit);
                                handleToggleColumn(editingMatrixRole, 'edit', !allChecked);
                                addToast(`Toggled Edit / Modify column state`, 'info');
                              }}
                              className="text-[9px] text-[#2f66e0] hover:underline font-bold normal-case tracking-normal cursor-pointer"
                            >
                              Toggle Col
                            </button>
                          </div>
                        </th>

                        {/* DELETE COLUMN HEADER */}
                        <th className="px-4 py-4 text-center">
                          <div className="flex flex-col items-center gap-1.5">
                            <span>Delete / Revoke</span>
                            <button
                              type="button"
                              onClick={() => {
                                const current = getRolePermissions(editingMatrixRole);
                                const allChecked = Object.values(current).every((m: any) => m.delete);
                                handleToggleColumn(editingMatrixRole, 'delete', !allChecked);
                                addToast(`Toggled Delete / Revoke column state`, 'info');
                              }}
                              className="text-[9px] text-[#2f66e0] hover:underline font-bold normal-case tracking-normal cursor-pointer"
                            >
                              Toggle Col
                            </button>
                          </div>
                        </th>

                        {/* EXPORT COLUMN HEADER */}
                        <th className="px-4 py-4 text-center">
                          <div className="flex flex-col items-center gap-1.5">
                            <span>Export Reports</span>
                            <button
                              type="button"
                              onClick={() => {
                                const current = getRolePermissions(editingMatrixRole);
                                const allChecked = Object.values(current).every((m: any) => m.export);
                                handleToggleColumn(editingMatrixRole, 'export', !allChecked);
                                addToast(`Toggled Export Reports column state`, 'info');
                              }}
                              className="text-[9px] text-[#2f66e0] hover:underline font-bold normal-case tracking-normal cursor-pointer"
                            >
                              Toggle Col
                            </button>
                          </div>
                        </th>

                        <th className="px-4 py-4 text-center font-bold text-slate-600">Access Level</th>
                        <th className="px-5 py-4 text-right font-bold text-slate-600">Row Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {Object.entries(getRolePermissions(editingMatrixRole))
                        .filter(([moduleName]) => moduleName.toLowerCase().includes(matrixSearchQuery.toLowerCase()))
                        .map(([moduleName, unknownPerms]) => {
                          const perms = unknownPerms as { read: boolean; create: boolean; edit: boolean; delete: boolean; export: boolean };
                          const isFull = perms.read && perms.create && perms.edit && perms.delete && perms.export;
                          const isNone = !perms.read && !perms.create && !perms.edit && !perms.delete && !perms.export;
                          const isReadOnly = perms.read && !perms.create && !perms.edit && !perms.delete && !perms.export;

                          return (
                            <tr key={moduleName} className="hover:bg-slate-50/50 transition-colors">
                              {/* MODULE NAME */}
                              <td className="px-5 py-3.5">
                                <div className="font-bold text-slate-800">{moduleName}</div>
                                <div className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                  Configures capabilities for {moduleName.toLowerCase()} facilities.
                                </div>
                              </td>

                              {/* VIEW CHECKBOX */}
                              <td className="px-4 py-3.5 text-center">
                                <input
                                  type="checkbox"
                                  checked={perms.read}
                                  onChange={() => handleToggleCell(editingMatrixRole, moduleName, 'read')}
                                  className="h-4 w-4 text-[#2f66e0] rounded border-slate-300 focus:ring-[#2f66e0] cursor-pointer"
                                />
                              </td>

                              {/* CREATE CHECKBOX */}
                              <td className="px-4 py-3.5 text-center">
                                <input
                                  type="checkbox"
                                  checked={perms.create}
                                  onChange={() => handleToggleCell(editingMatrixRole, moduleName, 'create')}
                                  className="h-4 w-4 text-[#2f66e0] rounded border-slate-300 focus:ring-[#2f66e0] cursor-pointer"
                                />
                              </td>

                              {/* EDIT CHECKBOX */}
                              <td className="px-4 py-3.5 text-center">
                                <input
                                  type="checkbox"
                                  checked={perms.edit}
                                  onChange={() => handleToggleCell(editingMatrixRole, moduleName, 'edit')}
                                  className="h-4 w-4 text-[#2f66e0] rounded border-slate-300 focus:ring-[#2f66e0] cursor-pointer"
                                />
                              </td>

                              {/* DELETE CHECKBOX */}
                              <td className="px-4 py-3.5 text-center">
                                <input
                                  type="checkbox"
                                  checked={perms.delete}
                                  onChange={() => handleToggleCell(editingMatrixRole, moduleName, 'delete')}
                                  className="h-4 w-4 text-[#2f66e0] rounded border-slate-300 focus:ring-[#2f66e0] cursor-pointer"
                                />
                              </td>

                              {/* EXPORT CHECKBOX */}
                              <td className="px-4 py-3.5 text-center">
                                <input
                                  type="checkbox"
                                  checked={perms.export}
                                  onChange={() => handleToggleCell(editingMatrixRole, moduleName, 'export')}
                                  className="h-4 w-4 text-[#2f66e0] rounded border-slate-300 focus:ring-[#2f66e0] cursor-pointer"
                                />
                              </td>

                              {/* ACCESS LEVEL BADGE */}
                              <td className="px-4 py-3.5 text-center">
                                {isFull ? (
                                  <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wide uppercase">
                                    Full Access
                                  </span>
                                ) : isNone ? (
                                  <span className="bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wide uppercase">
                                    No Access
                                  </span>
                                ) : isReadOnly ? (
                                  <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wide uppercase">
                                    Read Only
                                  </span>
                                ) : (
                                  <span className="bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wide uppercase">
                                    Custom
                                  </span>
                                )}
                              </td>

                              {/* ROW ACTIONS */}
                              <td className="px-5 py-3.5 text-right whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const allChecked = perms.read && perms.create && perms.edit && perms.delete && perms.export;
                                    handleToggleRow(editingMatrixRole, moduleName, !allChecked);
                                    addToast(`${!allChecked ? 'Enabled' : 'Disabled'} all permissions for ${moduleName}`, 'info');
                                  }}
                                  className="text-xs text-[#2f66e0] hover:underline font-bold cursor-pointer mr-3"
                                >
                                  {isFull ? 'Clear Row' : 'Select Row'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SAVE & SUBMIT ACTIONS */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setMatrixPermissions(prev => ({
                      ...prev,
                      [editingMatrixRole]: {
                        'Employee Directory': { read: true, create: false, edit: false, delete: false, export: false },
                        'Attendance & Timesheets': { read: true, create: false, edit: false, delete: false, export: false },
                        'Leave Management': { read: true, create: false, edit: false, delete: false, export: false },
                        'Payroll Engine': { read: false, create: false, edit: false, delete: false, export: false },
                        'Claim Management': { read: true, create: false, edit: false, delete: false, export: false },
                        'Benefits Administration': { read: true, create: false, edit: false, delete: false, export: false },
                        'Performance Review': { read: true, create: false, edit: false, delete: false, export: false },
                        'Learning & LMS': { read: true, create: false, edit: false, delete: false, export: false },
                        'Hardware & Assets': { read: true, create: false, edit: false, delete: false, export: false },
                        'Helpdesk & Tickets': { read: true, create: false, edit: false, delete: false, export: false },
                      }
                    }));
                    addToast(`Reset matrix permissions to defaults for ${editingMatrixRole}`, 'info');
                  }}
                  className="bg-white border border-slate-200 text-slate-700 hover:border-slate-300 px-4 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className="h-4 w-4 text-slate-500" />
                  <span>Restore Standard Defaults</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingMatrixRole(null)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      addToast(`Roles Authorization Matrix for "${editingMatrixRole}" updated successfully!`, 'success');
                      setEditingMatrixRole(null);
                    }}
                    className="bg-[#2f66e0] text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-opacity-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Matrix Credentials</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-slate-800 tracking-tight">Security Roles Matrix</h2>
                  <p className="text-[11px] font-semibold text-slate-400 mt-1">Establish system security matrices, feature capabilities, and read/write access permissions.</p>
                </div>
                <button
                  onClick={() => setShowCreateRole(!showCreateRole)}
                  className="bg-[#2f66e0] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-opacity-95 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Role</span>
                </button>
              </div>

              {/* Create Role Form */}
              {showCreateRole && (
                <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-200 space-y-4 max-w-xl animate-in fade-in">
                  <h4 className="text-xs font-bold text-slate-800">Create New Security Role</h4>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Role Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Benefits Specialist"
                        value={newRoleForm.name}
                        onChange={(e) => setNewRoleForm({ ...newRoleForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-[#2f66e0]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Role Description</label>
                      <textarea
                        placeholder="Specify role responsibility and data visibility bounds..."
                        value={newRoleForm.desc}
                        onChange={(e) => setNewRoleForm({ ...newRoleForm, desc: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-[#2f66e0]"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={createRole} className="px-3.5 py-1.5 bg-[#2f66e0] text-white font-bold text-xs rounded-lg cursor-pointer">
                      Register Role
                    </button>
                    <button onClick={() => setShowCreateRole(false)} className="px-3.5 py-1.5 bg-slate-200 text-slate-700 font-bold text-xs rounded-lg cursor-pointer">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {roles.map((r, idx) => (
                  <div key={idx} className="bg-slate-50/50 hover:bg-slate-50 rounded-2xl p-4.5 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
                    <div className="max-w-xl space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">{r.name}</h4>
                        <span className="text-[9.5px] font-extrabold px-1.5 py-0.5 bg-white border rounded-md text-slate-500">{r.type || 'Custom role'}</span>
                      </div>
                      <p className="text-[10.5px] font-bold text-slate-400">{r.desc}</p>
                    </div>
                    <button
                      onClick={() => setEditingMatrixRole(r.name)}
                      className="px-3.5 py-2 bg-white border border-[#2f66e0]/35 text-[#2f66e0] hover:bg-slate-50 hover:border-[#2f66e0] font-bold text-xs rounded-xl cursor-pointer shadow-3xs transition-all"
                    >
                      Configure Matrix
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {/* TAB 7: Approval Workflow */}
        {activeSubTab === 'Approval workflow' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-800 tracking-tight">Approval Workflows Config</h2>
                <p className="text-[11px] font-semibold text-slate-400 mt-1">Customise approval dispatch routing chains, notifications logic, and auto-approval limits.</p>
              </div>
              <button
                onClick={() => setShowCreateWorkflow(!showCreateWorkflow)}
                className="bg-[#2f66e0] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-opacity-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>New Workflow</span>
              </button>
            </div>

            {/* Create Workflow Form */}
            {showCreateWorkflow && (
              <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-200 space-y-4 max-w-xl animate-in fade-in">
                <h4 className="text-xs font-bold text-slate-800">Add Corporate Approval Routing</h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Workflow Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Benefits & Wellness Claims"
                      value={newWorkflowForm.name}
                      onChange={(e) => setNewWorkflowForm({ ...newWorkflowForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-[#2f66e0]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Workflow Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Routed dynamically matching wellness allowances requests"
                      value={newWorkflowForm.desc}
                      onChange={(e) => setNewWorkflowForm({ ...newWorkflowForm, desc: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-[#2f66e0]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Hierarchy Approval Chain</label>
                    <select
                      value={newWorkflowForm.chain}
                      onChange={(e) => setNewWorkflowForm({ ...newWorkflowForm, chain: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none text-slate-655 focus:border-[#2f66e0]"
                    >
                      <option>Direct Manager</option>
                      <option>Direct Manager → HOD</option>
                      <option>Direct Manager → Family HOD → Managing Director</option>
                      <option>Supervisor → HR Specialist → CFO</option>
                      <option>HOD → Executive Board</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={createWorkflow} className="px-3.5 py-1.5 bg-[#2f66e0] text-white font-bold text-xs rounded-lg cursor-pointer">
                    Enable Workflow
                  </button>
                  <button onClick={() => setShowCreateWorkflow(false)} className="px-3.5 py-1.5 bg-slate-200 text-slate-700 font-bold text-xs rounded-lg cursor-pointer">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {workflows.map((w) => (
                <div
                  key={w.id}
                  className={`p-4.5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                    w.active ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-50/50 border-slate-100 opacity-60'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <h4 className="text-xs font-bold text-slate-800">{w.name}</h4>
                      <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-md uppercase tracking-wide border ${
                        w.active ? 'bg-emerald-50 text-emerald-650 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}>
                        {w.active ? 'Active Routing' : 'Deactivated'}
                      </span>
                    </div>
                    <p className="text-[10.5px] font-bold text-slate-400 leading-normal">{w.desc}</p>
                    <div className="text-[10px] font-extrabold text-[#2f66e0] bg-blue-50/50 px-2 py-1 rounded-md border border-blue-50 inline-block mt-1">
                      Routing Queue: {w.chain}
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0 self-center">
                    <button
                      onClick={() => toggleWorkflow(w.id)}
                      className={`px-3 py-1.5 border hover:border-slate-300 font-bold text-xs rounded-xl cursor-pointer bg-white ${
                        w.active ? 'text-slate-600' : 'text-[#2f66e0]'
                      }`}
                    >
                      {w.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: Notifications */}
        {activeSubTab === 'Notifications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-800 tracking-tight">Notification Channels Setup</h2>
                <p className="text-[11px] font-semibold text-slate-400 mt-1">Configure system-wide dispatch metrics, chat integrations, emails, alerts, and mobile notifications.</p>
              </div>
              <button
                onClick={saveNotifs}
                className="bg-[#2f66e0] text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-opacity-95 cursor-pointer transition-all flex items-center gap-1.5"
              >
                <Save className="h-4 w-4" />
                <span>Save state</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Alert channels */}
              <div className="space-y-4.5 bg-white border border-slate-100/80 rounded-2xl p-5 shadow-xs">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b pb-1.5">Alert Channels</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-750">In-app notifications</div>
                      <div className="text-[10px] font-medium text-slate-400 mt-0.5">Real-time alerts in portal panel bell icon</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifs({ ...notifs, inApp: !notifs.inApp })}
                      className={`h-5 w-9 rounded-full p-0.5 transition-colors cursor-pointer flex items-center shrink-0 ${
                        notifs.inApp ? 'bg-[#2f66e0]' : 'bg-slate-200'
                      }`}
                    >
                      <div className={`h-4 w-4 bg-white rounded-full shadow-xs transition-transform transform ${
                        notifs.inApp ? 'translate-x-[16px]' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-750">Email alerts</div>
                      <div className="text-[10px] font-medium text-slate-400 mt-0.5">Dispatches emails for approvals, tickets, schedules</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifs({ ...notifs, email: !notifs.email })}
                      className={`h-5 w-9 rounded-full p-0.5 transition-colors cursor-pointer flex items-center shrink-0 ${
                        notifs.email ? 'bg-[#2f66e0]' : 'bg-slate-200'
                      }`}
                    >
                      <div className={`h-4 w-4 bg-white rounded-full shadow-xs transition-transform transform ${
                        notifs.email ? 'translate-x-[16px]' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-750">Mobile smart push</div>
                      <div className="text-[10px] font-medium text-slate-400 mt-0.5">Deliver push notifications straight to Novora HR mobile app</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifs({ ...notifs, mobilePush: !notifs.mobilePush })}
                      className={`h-5 w-9 rounded-full p-0.5 transition-colors cursor-pointer flex items-center shrink-0 ${
                        notifs.mobilePush ? 'bg-[#2f66e0]' : 'bg-slate-200'
                      }`}
                    >
                      <div className={`h-4 w-4 bg-white rounded-full shadow-xs transition-transform transform ${
                        notifs.mobilePush ? 'translate-x-[16px]' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-750">SMS / WhatsApp alerts</div>
                      <div className="text-[10px] font-medium text-slate-400 mt-0.5">Urgent SMS integration (premium gateway rates apply)</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifs({ ...notifs, whatsappAlerts: !notifs.whatsappAlerts })}
                      className={`h-5 w-9 rounded-full p-0.5 transition-colors cursor-pointer flex items-center shrink-0 ${
                        notifs.whatsappAlerts ? 'bg-[#2f66e0]' : 'bg-slate-200'
                      }`}
                    >
                      <div className={`h-4 w-4 bg-white rounded-full shadow-xs transition-transform transform ${
                        notifs.whatsappAlerts ? 'translate-x-[16px]' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Module-Level Alerts */}
              <div className="space-y-4.5 bg-white border border-slate-100/80 rounded-2xl p-5 shadow-xs">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b pb-1.5">Triggers Hierarchy</h3>
                
                <div className="space-y-4">
                  {[
                    { label: 'Leave request submitted', key: 'leaveSubmitted' },
                    { label: 'Leave approved / denied status', key: 'leaveApproved' },
                    { label: 'Attendance - missing wipe logs', key: 'missingPunch' },
                    { label: 'Claims submitted / processed', key: 'claimsProcessed' },
                    { label: 'Contract renewal upcoming (30d)', key: 'contractRenew' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div className="text-xs font-bold text-slate-700">{item.label}</div>
                      <input
                        type="checkbox"
                        checked={(notifs as any)[item.key]}
                        onChange={() => setNotifs({ ...notifs, [item.key]: !(notifs as any)[item.key] })}
                        className="h-4 w-4 text-[#2f66e0] rounded border-slate-200 outline-none cursor-pointer focus:ring-1 focus:ring-[#2f66e0]/20"
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 9: Integrations */}
        {activeSubTab === 'Integrations' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-slate-800 tracking-tight">External Connection Integrations</h2>
              <p className="text-[11px] font-semibold text-slate-400 mt-1">Synchronise corporate directory tools, bank salary exports, and biometric terminals.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Payroll &mdash; Bank file exporter', desc: 'Secure bank API exporter for salaries', connected: true },
                { name: 'Biometric Access logs terminal', desc: 'Sync swipe schedules via hardware biometric endpoints', connected: true },
                { name: 'Currency exchange API engine', desc: 'Live FX conversion metrics for corporate claims', connected: true },
                { name: 'SMTP &mdash; Custom mail server', desc: 'smtp.aperiooccasio.com on TLS port 587', connected: true },
                { name: 'KWSP EPF e-filing sync portal', desc: 'Immediate direct submission to retirement funds', connected: false },
                { name: 'OCR Document translation sync', desc: 'Tesseract AI engine receipt translation', connected: true },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-100/90 hover:border-slate-200 transition-all bg-white flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800" dangerouslySetInnerHTML={{ __html: item.name }} />
                    <p className="text-[10.5px] font-bold text-slate-400 pr-2 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    {item.connected ? (
                      <span className="bg-emerald-50 text-emerald-650 border border-emerald-100 px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wide uppercase block text-center">
                        Active Connection
                      </span>
                    ) : (
                      <span className="bg-amber-50 text-amber-650 border border-amber-100 px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wide uppercase block text-center cursor-pointer hover:bg-amber-100/55" onClick={() => addToast('Configuring authority setup...', 'loading')}>
                        Setup Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* API access section token generator */}
            <div className="border-t border-slate-100 pt-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-[#2f66e0]" />
                <span>Developer API Access Keys</span>
              </h3>
              <p className="text-[11px] font-semibold text-slate-400 leading-normal">Authenticate programmatic widgets, custom integrations, or cron loops from external apps.</p>
              
              <div className="bg-slate-50/50 p-4 border border-slate-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secret API Auth key</div>
                  <div className="font-mono text-xs font-bold text-[#2f66e0] select-all bg-white px-3.5 py-1.5 border border-slate-100 rounded-lg inline-block mt-1">
                    {apiKeyVisible ? apiKey : 'sk-aperio-••••••••••••••••4f21'}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setApiKeyVisible(!apiKeyVisible)}
                    className="px-3.5 py-2 bg-white border font-bold text-xs rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    {apiKeyVisible ? 'Obscure Token' : 'Reveal Key'}
                  </button>
                  <button
                    onClick={copyApiKey}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={generateNewKey}
                    className="px-3.5 py-2 bg-[#2f66e0] text-white font-bold text-xs rounded-xl hover:bg-opacity-95 cursor-pointer whitespace-nowrap"
                  >
                    Generate New
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: Security */}
        {activeSubTab === 'Security' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-800 tracking-tight">Global Security &amp; Access Directives</h2>
                <p className="text-[11px] font-semibold text-slate-400 mt-1">Establish password expiration indices, multi-factor logins, and directory whitelists.</p>
              </div>
              <button
                onClick={saveSecurity}
                className="bg-[#2f66e0] text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-opacity-95 cursor-pointer transition-all flex items-center gap-1.5"
              >
                <Save className="h-4 w-4" />
                <span>Enforce directives</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Authentications card */}
              <div className="space-y-4.5 bg-white border border-slate-100/80 rounded-2xl p-5 shadow-xs">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b pb-1.5">Access Control &amp; 2FA</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-750">Enforce Multi-Factor (2FA)</div>
                      <div className="text-[10px] font-medium text-slate-400 mt-0.5">Enforces verification on administrator credentials</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSecurityParams({ ...securityParams, twoFa: !securityParams.twoFa })}
                      className={`h-5 w-9 rounded-full p-0.5 transition-colors cursor-pointer flex items-center shrink-0 ${
                        securityParams.twoFa ? 'bg-[#2f66e0]' : 'bg-slate-200'
                      }`}
                    >
                      <div className={`h-4 w-4 bg-white rounded-full shadow-xs transition-transform transform ${
                        securityParams.twoFa ? 'translate-x-[16px]' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-750">Corporate SSO (Google / AD)</div>
                      <div className="text-[10px] font-medium text-slate-400 mt-0.5">Allow employees to logging in via company email suites</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSecurityParams({ ...securityParams, sso: !securityParams.sso })}
                      className={`h-5 w-9 rounded-full p-0.5 transition-colors cursor-pointer flex items-center shrink-0 ${
                        securityParams.sso ? 'bg-[#2f66e0]' : 'bg-slate-200'
                      }`}
                    >
                      <div className={`h-4 w-4 bg-white rounded-full shadow-xs transition-transform transform ${
                        securityParams.sso ? 'translate-x-[16px]' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-750">Force reset upon creation</div>
                      <div className="text-[10px] font-medium text-slate-400 mt-0.5">Newly boarded staff must set custom secrets upon entry</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSecurityParams({ ...securityParams, forceResetOnLogin: !securityParams.forceResetOnLogin })}
                      className={`h-5 w-9 rounded-full p-0.5 transition-colors cursor-pointer flex items-center shrink-0 ${
                        securityParams.forceResetOnLogin ? 'bg-[#2f66e0]' : 'bg-slate-200'
                      }`}
                    >
                      <div className={`h-4 w-4 bg-white rounded-full shadow-xs transition-transform transform ${
                        securityParams.forceResetOnLogin ? 'translate-x-[16px]' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Password credentials complexity criteria */}
              <div className="space-y-4.5 bg-white border border-slate-100/80 rounded-2xl p-5 shadow-xs">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b pb-1.5">Strength guidelines</h3>
                
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Minimum Length Character count</span>
                    <select
                      value={securityParams.pwMinLength}
                      onChange={(e) => setSecurityParams({ ...securityParams, pwMinLength: e.target.value })}
                      className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 outline-none"
                    >
                      <option>8 characters</option>
                      <option>10 characters</option>
                      <option>12 characters</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Automatic Expiration indices</span>
                    <select
                      value={securityParams.pwExpiryDays}
                      onChange={(e) => setSecurityParams({ ...securityParams, pwExpiryDays: e.target.value })}
                      className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 outline-none"
                    >
                      <option>30 days</option>
                      <option>90 days</option>
                      <option>180 days</option>
                      <option>Never expire</option>
                    </select>
                  </div>

                  <div className="border-t border-slate-100 pt-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-605">Require Uppercase &amp; Lowercase alphas</span>
                      <input type="checkbox" checked={securityParams.requireCaps} onChange={() => setSecurityParams({ ...securityParams, requireCaps: !securityParams.requireCaps })} className="h-4 w-4 text-[#2f66e0]" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-605">Require Numerical indexes</span>
                      <input type="checkbox" checked={securityParams.requireNums} onChange={() => setSecurityParams({ ...securityParams, requireNums: !securityParams.requireNums })} className="h-4 w-4 text-[#2f66e0]" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-605">Require Cryptographic special characters</span>
                      <input type="checkbox" checked={securityParams.requireSpec} onChange={() => setSecurityParams({ ...securityParams, requireSpec: !securityParams.requireSpec })} className="h-4 w-4 text-[#2f66e0]" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 11: Audit Log */}
        {activeSubTab === 'Audit log' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-800 tracking-tight">System Audit Log Trace</h2>
                <p className="text-[11px] font-semibold text-slate-400 mt-1">Immutable historic sequence of administrative interventions and personnel files edits.</p>
              </div>
              <button
                onClick={() => {
                  addToast('Assembling historic telemetry dossier for system export...', 'loading');
                  setTimeout(() => {
                    addToast('Dossier successfully downloaded as audit_log_novora.csv', 'success');
                  }, 1200);
                }}
                className="bg-[#2f66e0] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer inline-flex"
              >
                <Download className="h-4 w-4" />
                <span>Export log</span>
              </button>
            </div>

            {/* Filter Search Input */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search audit trail by User or Module..."
                value={logFilter}
                onChange={(e) => setLogFilter(e.target.value)}
                className="w-full pl-9.5 pr-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 focus:border-[#2f66e0] rounded-xl outline-none"
              />
            </div>

            {/* Audit Tables */}
            <div className="border border-slate-100/80 rounded-2xl overflow-hidden bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5 font-bold">Timestamp UTC</th>
                    <th className="px-5 py-3.5 font-bold">User</th>
                    <th className="px-5 py-3.5 font-bold">Intervention Details</th>
                    <th className="px-5 py-3.5 font-bold">Module Scope</th>
                    <th className="px-5 py-3.5 font-bold text-right">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-600">
                  {filteredLogs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5 text-slate-555 font-medium">{log.time}</td>
                      <td className="px-5 py-3.5 font-bold text-slate-800">{log.user}</td>
                      <td className="px-5 py-3.5 font-medium">{log.action}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-md uppercase tracking-wide border ${
                          log.module === 'Payroll'
                            ? 'bg-green-50 text-green-650 border-green-100'
                            : log.module === 'Claims'
                            ? 'bg-orange-50 text-orange-650 border-orange-100'
                            : log.module === 'Disciplinary'
                            ? 'bg-pink-50 text-pink-650 border-pink-100'
                            : 'bg-blue-50 text-blue-650 border-blue-100'
                        }`}>
                          {log.module}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-[10px] text-slate-400 text-right">{log.ip}</td>
                    </tr>
                  ))}
                  {filteredLogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-6 text-center text-slate-400">
                        No matches found for "{logFilter}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 12: Appearance */}
        {activeSubTab === 'Appearance' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-slate-800 tracking-tight">Appearance settings &amp; Themes</h2>
              <p className="text-[11px] font-semibold text-slate-400 mt-1">Personalise standard viewport themes, canvas scaling densities, and accent highlights.</p>
            </div>

            <div className="space-y-6 max-w-2xl">
              
              {/* Theme preference cards */}
              <div className="space-y-3">
                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Visual Theme Preset</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    { name: 'Slate Light', desc: 'Soft off-whites and charcoal gray', border: 'border-slate-200' },
                    { name: 'Minimal Off-White', desc: 'Sleek ivory canvas with deep graphite accents', border: 'border-amber-100' },
                    { name: 'Cyber Dark', desc: 'Deep galactic indigo nightscape (Premium)', border: 'border-slate-800' },
                    { name: 'Emerald Forest', desc: 'Professional jade healthcare layout', border: 'border-emerald-100' },
                  ].map((theme) => (
                    <button
                      key={theme.name}
                      type="button"
                      onClick={() => {
                        setThemePref(theme.name);
                        addToast(`Visual theme shifted to ${theme.name}`, 'success');
                      }}
                      className={`p-4 text-left border rounded-2xl cursor-pointer transition-all ${
                        themePref === theme.name
                          ? 'border-[#2f66e0] bg-[#2f66e0]/5 text-slate-800 outline-none ring-1 ring-[#2f66e0]/20 font-bold'
                          : 'border-slate-100 hover:border-slate-200 bg-white text-slate-505'
                      }`}
                    >
                      <div className="text-xs font-bold">{theme.name}</div>
                      <div className="text-[10px] font-medium text-slate-400 mt-1">{theme.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid densities */}
              <div className="space-y-3">
                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Canvas Margin Padding density</label>
                <div className="flex gap-2">
                  {['Compact', 'Cozy', 'Spacious'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setDensity(item);
                        addToast(`Spacing array toggled to ${item}`, 'info');
                      }}
                      className={`px-4.5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                        density === item
                          ? 'bg-[#2f66e0] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent highlights */}
              <div className="space-y-3">
                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Primary Accent color highlights</label>
                <div className="flex items-center gap-3">
                  {[
                    { name: 'Novora Blue', color: 'bg-[#2f66e0]' },
                    { name: 'Rose Red', color: 'bg-rose-500' },
                    { name: 'Emerald Green', color: 'bg-emerald-500' },
                    { name: 'Amber Gold', color: 'bg-amber-500' },
                  ].map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => {
                        setAccentColor(color.name);
                        addToast(`Accents highlights mapped to ${color.name}`, 'info');
                      }}
                      className={`h-9 w-9 rounded-full flex items-center justify-center transition-all cursor-pointer relative ${color.color} hover:scale-105`}
                      title={color.name}
                    >
                      {accentColor === color.name && (
                        <CheckCircle2 className="h-4 w-4 text-white font-extrabold" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 13: Language (including public holidays) */}
        {activeSubTab === 'Language' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveRegional();
            }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-base font-extrabold text-slate-800 tracking-tight">Timezone &amp; Localisation settings</h2>
              <p className="text-[11px] font-semibold text-slate-400 mt-1">Configure language indexes, corporate public holidays, calendar structures, and currencies.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">System language</label>
                <select
                  value={regional.language}
                  onChange={(e) => setRegional({ ...regional, language: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-[#2f66e0] outline-none text-slate-700"
                >
                  <option>English (US)</option>
                  <option>English (UK)</option>
                  <option>Bahasa Malaysia</option>
                  <option>Chinese Simplified</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Regional Timezone reference</label>
                <select
                  value={regional.timezone}
                  onChange={(e) => setRegional({ ...regional, timezone: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-[#2f66e0] outline-none text-slate-700"
                >
                  <option>Asia/Kuala_Lumpur (UTC+8)</option>
                  <option>Asia/Singapore (UTC+8)</option>
                  <option>Asia/London (UTC+0)</option>
                  <option>America/New_York (UTC-5)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Calendar Date representation</label>
                <select
                  value={regional.dateFormat}
                  onChange={(e) => setRegional({ ...regional, dateFormat: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-[#2f66e0] outline-none text-slate-700"
                >
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Primary Currency ledger</label>
                <select
                  value={regional.currency}
                  onChange={(e) => setRegional({ ...regional, currency: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:border-[#2f66e0] outline-none text-slate-700"
                >
                  <option>MYR — Malaysian Ringgit</option>
                  <option>SGD — Singapore Dollar</option>
                  <option>USD — United States Dollar</option>
                  <option>GBP — British Pound Sterling</option>
                </select>
              </div>
            </div>

            {/* Public holidays subpanel */}
            <div className="border-t border-slate-100 pt-5 space-y-4">
              <h3 className="text-xs font-bold text-slate-800">Public Holidays Schedule</h3>
              <p className="text-[10.5px] font-semibold text-slate-400 leading-normal">Selected country: **Malaysia**. State-specific holidays mapped to **all regions**. 4 custom holiday override guidelines added.</p>
              
              <div className="bg-slate-50/55 rounded-2xl border border-slate-100 p-4 divide-y divide-slate-150 font-semibold text-slate-600 text-xs">
                <div className="py-2.5 flex justify-between items-center">
                  <span>Hari Raya Aidilfitri</span>
                  <span className="font-bold text-slate-800">31 March</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span>Labour Day</span>
                  <span className="font-bold text-slate-800">1 May</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span>Wesak Day</span>
                  <span className="font-bold text-slate-800">12 May</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span>National Day (Hari Kebangsaan)</span>
                  <span className="font-bold text-slate-800">31 August</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-[#2f66e0] text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-opacity-95 cursor-pointer transition-all flex items-center gap-1.5"
              >
                <Save className="h-4 w-4" />
                <span>Save Localisation</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 14: Email Templates */}
        {activeSubTab === 'Email templates' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-800 tracking-tight">Email Notifications Templates</h2>
                <p className="text-[11px] font-semibold text-slate-400 mt-1">Configure automated portal emails matching statutory processes triggers.</p>
              </div>
              <button
                onClick={() => {
                  setShowCreateTemplate(!showCreateTemplate);
                  setEditingTemplateId(null);
                  setNewTemplateForm({ id: 0, name: '', trigger: 'On employee creation', subject: '', body: '' });
                }}
                className="bg-[#2f66e0] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-opacity-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>{showCreateTemplate ? 'Close Editor' : 'Create Mail Template'}</span>
              </button>
            </div>

            {/* Side-by-Side Template Editor and Live Mail Preview */}
            {(showCreateTemplate || editingTemplateId !== null) && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in transition-all">
                {/* Editor Panel */}
                <div className="bg-slate-50/50 rounded-2xl p-5 border border-slate-200 space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b pb-2">
                    {editingTemplateId ? 'Edit Email Template' : 'Create New Email Template'}
                  </h4>
                  <div className="space-y-3.5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Template Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Wellness claim processed"
                        value={newTemplateForm.name}
                        onChange={(e) => setNewTemplateForm({ ...newTemplateForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-[#2f66e0]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Process Trigger</label>
                        <select
                          value={newTemplateForm.trigger}
                          onChange={(e) => setNewTemplateForm({ ...newTemplateForm, trigger: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none text-slate-655 focus:border-[#2f66e0]"
                        >
                          <option>On leave request</option>
                          <option>On payroll confirm</option>
                          <option>On claim approval</option>
                          <option>On employee creation</option>
                          <option>On course completion</option>
                          <option>On feedback submit</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Email Subject Line</label>
                        <input
                          type="text"
                          placeholder="Subject email header"
                          value={newTemplateForm.subject}
                          onChange={(e) => setNewTemplateForm({ ...newTemplateForm, subject: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-[#2f66e0]"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Body Content Email Text</label>
                        <span className="text-[9.5px] font-extrabold text-blue-650 bg-blue-50/60 px-1.5 py-0.5 rounded">
                          Tokens: &#123;name&#125;, &#123;days&#125;, &#123;id&#125;, &#123;email&#125;
                        </span>
                      </div>
                      <textarea
                        rows={7}
                        placeholder="Write template message text..."
                        value={newTemplateForm.body}
                        onChange={(e) => setNewTemplateForm({ ...newTemplateForm, body: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold outline-none font-sans leading-relaxed focus:border-[#2f66e0]"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2.5 pt-1.5">
                    <button onClick={saveTemplate} className="px-4 py-2 bg-[#2f66e0] text-white font-bold text-xs rounded-xl cursor-pointer hover:bg-opacity-95 whitespace-nowrap">
                      Save Template
                    </button>
                    <button
                      onClick={() => {
                        setShowCreateTemplate(false);
                        setEditingTemplateId(null);
                      }}
                      className="px-4 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                {/* Branded Live Preview Panel */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Live Mailbox Output Render
                    </h4>
                    <span className="text-[9px] font-bold text-slate-400">Device width: Responsive</span>
                  </div>

                  <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden flex-1 flex flex-col">
                    {/* Simulated Mail Client Header */}
                    <div className="bg-slate-50 px-4 py-3.5 border-b border-slate-100 space-y-1 text-[11px] font-bold">
                      <div>
                        <span className="text-slate-400">From: </span>
                        <span className="text-slate-700">Novora Alerts &lt;no-reply@novora.com&gt;</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Subject: </span>
                        <span className="text-slate-800 font-extrabold">{newTemplateForm.subject || '(Enter subject above...)'}</span>
                      </div>
                    </div>

                    {/* Email Content Body */}
                    <div className="p-6 space-y-6 flex-1 text-xs">
                      {/* Brand Banner */}
                      <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                        <div className="h-6 w-6 bg-gradient-to-tr from-[#0a9cf5] to-[#2563eb] rounded-lg rotate-6 flex items-center justify-center text-white font-extrabold text-[10px]">
                          NV
                        </div>
                        <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                          Novora Pte Ltd
                        </span>
                      </div>

                      {/* Dynamic Interpolated Text */}
                      <div className="whitespace-pre-line text-slate-700 leading-relaxed font-sans font-semibold">
                        {newTemplateForm.body ? (
                          newTemplateForm.body
                            .replace(/\{name\}/g, 'Jane Doe')
                            .replace(/\{days\}/g, '3')
                            .replace(/\{id\}/g, 'CLM-9821')
                            .replace(/\{email\}/g, 'jane.doe@novora.com')
                        ) : (
                          <span className="text-slate-350 italic">Start writing the email template body on the left to review real-time markup previews...</span>
                        )}
                      </div>

                      {/* Email Footer */}
                      <div className="border-t border-slate-100 pt-5 text-[10px] font-medium text-slate-400 space-y-1">
                        <p>This is an automated system notification dispatched securely by Novora Core Platform.</p>
                        <p>&copy; 2026 Novora Pte Ltd. All corporate rights reserved.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Templates Table */}
            <div className="border border-slate-100/80 rounded-2xl overflow-hidden bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5 font-bold pb-2">Template Name</th>
                    <th className="px-5 py-3.5 font-bold pb-2">Process Trigger</th>
                    <th className="px-5 py-3.5 font-bold pb-2">Last Edited UTC Date</th>
                    <th className="px-5 py-3.5 font-bold text-right pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-655">
                  {templates.map((temp) => (
                    <tr key={temp.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-800">{temp.name}</td>
                      <td className="px-5 py-3.5">{temp.trigger}</td>
                      <td className="px-5 py-3.5 text-slate-500">{temp.edited}</td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => {
                            startEditTemplate(temp);
                            setShowCreateTemplate(false);
                          }}
                          className="text-[#2f66e0] hover:underline text-xs font-extrabold cursor-pointer"
                        >
                          Edit Content Preview
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 15: Backup & Data */}
        {activeSubTab === 'Backup & data' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-800 tracking-tight">Database Backup &amp; Retention</h2>
                <p className="text-[11px] font-semibold text-slate-400 mt-1">Configure automated daily backups, retention lifespans, and manual downloads.</p>
              </div>
              <button
                onClick={triggerBackupNow}
                className="bg-[#2f66e0] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer inline-flex shadow-xs whitespace-nowrap shrink-0"
              >
                <RefreshCw className="h-4 w-4 animate-spin" style={{ animationDuration: '4s' }} />
                <span>Run backup now</span>
              </button>
            </div>

            {/* Quick backup parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-4 bg-white border border-slate-100/80 rounded-2xl p-5 shadow-xs">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b pb-1.5">Backup Schedules</h3>
                
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Auto-backup frequency</span>
                    <select className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 outline-none">
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Off-site monthly</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Backup capture time</span>
                    <select className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 outline-none">
                      <option>02:00 AM</option>
                      <option>12:00 AM</option>
                      <option>06:00 PM</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Retention period</span>
                    <select className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 outline-none">
                      <option>90 days</option>
                      <option>180 days</option>
                      <option>1 year</option>
                      <option>Forever</option>
                    </select>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                    <div>
                      <div className="text-xs font-bold text-slate-700">Last success: 6 May 02:00 AM</div>
                      <div className="text-[10px] font-medium text-slate-400 mt-0.5">Automated cron verified &bull; S3 Bucket: novora_backups</div>
                    </div>
                    <span className="bg-emerald-50 text-emerald-650 border border-emerald-100 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold tracking-wide uppercase">
                      4.2 GB Snapshot
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Export Center */}
              <div className="space-y-4 bg-white border border-slate-100/80 rounded-2xl p-5 shadow-xs">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b pb-1.5 font-bold">Data Export Center</h3>
                <p className="text-[11px] font-bold text-slate-400 leading-normal">Instantly compile and packaging corporate database tables into pristine spreadsheet assets.</p>
                
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => addToast('Compiling employee roster schemas...', 'loading')}
                    className="p-2.5 border border-slate-200 hover:border-slate-300 bg-slate-50/20 rounded-xl font-bold text-[10.5px] cursor-pointer text-slate-700 flex flex-col items-center justify-center gap-1 hover:bg-slate-50/50"
                  >
                    <Users className="h-4 w-4 text-[#2f66e0]" />
                    <span>Export Employees</span>
                  </button>

                  <button
                    onClick={() => addToast('Assembling payroll worksheets...', 'loading')}
                    className="p-2.5 border border-slate-200 hover:border-slate-300 bg-slate-50/20 rounded-xl font-bold text-[10.5px] cursor-pointer text-slate-700 flex flex-col items-center justify-center gap-1 hover:bg-slate-50/50"
                  >
                    <Database className="h-4 w-4 text-emerald-500" />
                    <span>Export Payrolls</span>
                  </button>

                  <button
                    onClick={() => addToast('Compiling punch records timesheet...', 'loading')}
                    className="p-2.5 border border-slate-200 hover:border-slate-300 bg-slate-50/20 rounded-xl font-bold text-[10.5px] cursor-pointer text-slate-700 flex flex-col items-center justify-center gap-1 hover:bg-slate-50/50"
                  >
                    <FileText className="h-4 w-4 text-[#2f66e0]" />
                    <span>Export Attendance</span>
                  </button>

                  <button
                    onClick={() => addToast('Extracting system logs trace...', 'loading')}
                    className="p-2.5 border border-slate-200 hover:border-slate-300 bg-slate-50/20 rounded-xl font-bold text-[10.5px] cursor-pointer text-slate-700 flex flex-col items-center justify-center gap-1 hover:bg-slate-50/50"
                  >
                    <GitBranch className="h-4 w-4 text-amber-500" />
                    <span>Export Audit log</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

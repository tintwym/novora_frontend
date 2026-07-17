import { useState, type FormEvent } from 'react'
import {
  UserMinus,
  CheckSquare,
  Square,
  ChevronRight,
  Clock,
  ShieldCheck,
  Award,
  AlertCircle,
  TrendingUp,
  Plus,
  Upload,
  FileText,
  Video,
  BookOpen,
  Search,
  PenTool,
  Download,
  UserX,
  BarChart2,
  CheckCircle,
} from 'lucide-react'
import { showActionToast } from '../../utils/actionToast'
import type { ModuleEmployee } from '../../types/moduleEmployee'

type OnOffBoardingTabProps = {
  employees: ModuleEmployee[]
}

type OnOffSubTab = 
  | 'Pre-Onboarding Portal'
  | 'Tasks & Checklists'
  | 'Knowledge Base'
  | 'Offboarding & Clearance'
  | 'Exit Interviews'
  | 'Reports & Analytics';

interface PreBoardingDoc {
  id: string;
  name: string;
  category: string;
  status: 'Pending Upload' | 'Verification Required' | 'Approved';
  uploadedAt?: string;
  isRequired: boolean;
}

interface ChecklistItem {
  id: string;
  task: string;
  department: 'IT Operations' | 'HR Compliance' | 'Finance Payroll' | 'Security Assets' | 'Engineering department' | 'HR Administration';
  completed: boolean;
  dueDate: string;
  targetEmployeeId: string;
}

interface ResignationCase {
  id: string;
  employeeName: string;
  employeeId: string;
  resignationDate: string;
  lastWorkingDay: string;
  reason: string;
  managerApproval: 'Pending' | 'Approved' | 'Rejected';
  clearanceStatus: {
    IT: 'Pending' | 'Cleared';
    Finance: 'Pending' | 'Cleared';
    HR: 'Pending' | 'Cleared';
    Security: 'Pending' | 'Cleared';
  };
}

interface ExitInterviewForm {
  employeeId: string;
  leavingReason: string;
  ratingWorkLife: number;
  ratingCompensation: number;
  ratingManagement: number;
  ratingGrowth: number;
  comments: string;
}

export function OnOffBoardingTab({ employees }: OnOffBoardingTabProps) {
  const addToast = (text: string, type?: 'success' | 'loading' | 'error' | 'info') => {
    showActionToast(text, type)
  }

  const [activeSubTab, setActiveSubTab] = useState<OnOffSubTab>('Pre-Onboarding Portal');

  // Selected employee target context
  const [selectedSubEmployee, setSelectedSubEmployee] = useState<string>(employees[0]?.id || 'EMP-001');
  const currentEmployeeObj = employees.find(e => e.id === selectedSubEmployee) || employees[0];

  // -------------------------------------------------------------
  // STATE 1: PRE-ONBOARDING PORTAL STATE
  // -------------------------------------------------------------
  const [preBoardingDocs, setPreBoardingDocs] = useState<PreBoardingDoc[]>([
    { id: 'DOC01', name: 'National Registration IC / Passport Copy', category: 'Legal Proof', status: 'Approved', uploadedAt: '2026-06-10', isRequired: true },
    { id: 'DOC02', name: 'Digital Non-Disclosure Agreement (NDA)', category: 'Legal Proof', status: 'Verification Required', uploadedAt: '2026-06-14', isRequired: true },
    { id: 'DOC03', name: 'Standard General Employment Offer Contract', category: 'Contract', status: 'Pending Upload', isRequired: true },
    { id: 'DOC04', name: 'Medical Fitness Check Certificate', category: 'Health Clearance', status: 'Pending Upload', isRequired: false },
    { id: 'DOC05', name: 'Post-Secondary Education Degrees & Transcripts', category: 'Credentials', status: 'Approved', uploadedAt: '2026-06-11', isRequired: true }
  ]);
  const [newDocName, setNewDocName] = useState('');
  const [newDocCategory, setNewDocCategory] = useState('Legal Proof');
  const [esignTextInput, setEsignTextInput] = useState('');
  const [isOfferSigned, setIsOfferSigned] = useState(false);

  // -------------------------------------------------------------
  // STATE 2: TASK & CHECKLIST AUTOMATION STATE
  // -------------------------------------------------------------
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    // Onboarding checklist
    { id: 'ob-1', task: 'Issue high-spec corporate development laptop', department: 'IT Operations', completed: true, dueDate: '2026-06-20', targetEmployeeId: 'EMP-001' },
    { id: 'ob-2', task: 'Register active corporate email & OAuth accounts', department: 'IT Operations', completed: true, dueDate: '2026-06-20', targetEmployeeId: 'EMP-001' },
    { id: 'ob-3', task: 'Sign physical Employee Master Pledge contract', department: 'HR Compliance', completed: false, dueDate: '2026-06-22', targetEmployeeId: 'EMP-001' },
    { id: 'ob-4', task: 'Brief overview on Novora Core culture structures', department: 'HR Administration', completed: false, dueDate: '2026-06-24', targetEmployeeId: 'EMP-001' },
    { id: 'ob-5', task: 'Assign peer guide & local team team-bonding call', department: 'Engineering department', completed: false, dueDate: '2026-06-26', targetEmployeeId: 'EMP-001' },
    
    // Other employees checklists
    { id: 'ob-6', task: 'Enroll in gold premium benefits package', department: 'HR Administration', completed: true, dueDate: '2026-06-18', targetEmployeeId: 'EMP-002' },
    { id: 'ob-7', task: 'Configure local server cluster clearance credentials', department: 'IT Operations', completed: false, dueDate: '2026-06-28', targetEmployeeId: 'EMP-002' },
  ]);
  const [newChecklistTask, setNewChecklistTask] = useState('');
  const [newChecklistDept, setNewChecklistDept] = useState<'IT Operations' | 'HR Compliance' | 'Finance Payroll' | 'Security Assets' | 'Engineering department' | 'HR Administration'>('IT Operations');
  const [newChecklistDueDate, setNewChecklistDueDate] = useState('2026-06-25');

  // -------------------------------------------------------------
  // STATE 3: KNOWLEDGE BASE STATE
  // -------------------------------------------------------------
  const [kbSearchQuery, setKbSearchQuery] = useState('');
  const [selectedKbArticle, setSelectedKbArticle] = useState<number | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoPlayPercentage, setVideoPlayPercentage] = useState(0);

  const kbArticles = [
    { id: 1, title: 'Novora Professional Code of Conduct & Workplace Safety', category: 'Policy', text: 'Our professional Code of Conduct forms the cornerstone of Novora organizational structure. We practice transparency, mutual respect, and active accountability. In-office presence requires adhering to the 10:00 AM check-in attendance option, while respecting quiet collaboration hours between 2:00 PM and 4:00 PM.' },
    { id: 2, title: 'Remote Work & Flexible Scheduling Standards', category: 'Guide', text: 'All active officers are entitled to remote work choices based on direct department clearances. Under benefits management, ensure your remote health budget is configured before the 3rd week of each fiscal quarter. Claim reimbursement submissions are managed via the Claims Management tab.' },
    { id: 3, title: 'Novora Healthcare Insurance Tiering Explained', category: 'Policy', text: 'Our health assets comprise Gold Premium Plus medical options. This includes a co-pay share of 10/90%, dental clinic checkouts, and fully subsidized annual wellness consultations. If you must enroll partners or dependents, submit the request in the Benefits Management portal.' },
    { id: 4, title: 'Claims Submission & Office Lodging Policies', category: 'Guide', text: 'Official business expense reimbursements are structured via tiered routing rules. Single claim items of RM 500.00 or above require dual manager clearance on the Approval matrix. Ensure all receipts are uploaded as crystal clear PDFs with invoice numbers visible.' }
  ];

  // -------------------------------------------------------------
  // STATE 4: OFFBOARDING & CLEARANCE WORKFLOWS STATE
  // -------------------------------------------------------------
  const [resignationCases, setResignationCases] = useState<ResignationCase[]>([
    { 
      id: 'RES051', 
      employeeName: 'Sarah Lim', 
      employeeId: 'EMP-001', 
      resignationDate: '2026-06-01', 
      lastWorkingDay: '2026-06-30', 
      reason: 'Accepted senior architectural role with expanded scope.', 
      managerApproval: 'Approved',
      clearanceStatus: { IT: 'Cleared', Finance: 'Cleared', HR: 'Pending', Security: 'Pending' }
    },
    { 
      id: 'RES052', 
      employeeName: 'John Doe', 
      employeeId: 'EMP-002', 
      resignationDate: '2026-06-12', 
      lastWorkingDay: '2026-07-15', 
      reason: 'Relocating to Singapore for personal family reasons.', 
      managerApproval: 'Pending',
      clearanceStatus: { IT: 'Pending', Finance: 'Pending', HR: 'Pending', Security: 'Pending' }
    }
  ]);
  const [selectedResigId, setSelectedResigId] = useState<string>('RES051');
  const [newResigEmpId, setNewResigEmpId] = useState('EMP-001');
  const [newResigReason, setNewResigReason] = useState('');
  const [newResigDate, setNewResigDate] = useState('2026-06-16');
  const [newResigLastDay, setNewResigLastDay] = useState('2026-07-16');

  // -------------------------------------------------------------
  // STATE 5: EXIT INTERVIEWS SURVEY STATE
  // -------------------------------------------------------------
  const [exitSurveys, setExitSurveys] = useState<ExitInterviewForm[]>([
    { employeeId: 'EMP-001', leavingReason: 'Career opportunities & Growth', ratingWorkLife: 4, ratingCompensation: 4, ratingManagement: 5, ratingGrowth: 3, comments: 'Transition was exceedingly smooth. Novora has a fantastic engineering peer group.' },
    { employeeId: 'EMP-002', leavingReason: 'Family relocation', ratingWorkLife: 5, ratingCompensation: 3, ratingManagement: 4, ratingGrowth: 4, comments: 'Grateful for remote work allowances that helped during the relocation process.' },
  ]);
  const [newSurveyEmpId, setNewSurveyEmpId] = useState('EMP-001');
  const [newSurveyReason, setNewSurveyReason] = useState('Better career growth');
  const [wlRating, setWlRating] = useState(4);
  const [compRating, setCompRating] = useState(4);
  const [mgtRating, _setMgtRating] = useState(4);
  const [grRating, _setGrRating] = useState(4);
  const [surveyNotes, setSurveyNotes] = useState('');

  // -------------------------------------------------------------
  // LOGIC & HANDLERS
  // -------------------------------------------------------------
  
  // Doc Upload
  const handleDocUpload = (e: FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) {
      addToast('Please input a valid legal doc statement or label.', 'error');
      return;
    }
    const newDoc: PreBoardingDoc = {
      id: `DOC0${preBoardingDocs.length + 1}`,
      name: newDocName,
      category: newDocCategory,
      status: 'Verification Required',
      uploadedAt: new Date().toISOString().split('T')[0],
      isRequired: true
    };
    setPreBoardingDocs([...preBoardingDocs, newDoc]);
    setNewDocName('');
    addToast(`Doc file "${newDoc.name}" uploaded. Sent to Compliance verification.`, 'success');
  };

  const handleApproveDoc = (id: string, name: string) => {
    setPreBoardingDocs(prev => prev.map(d => d.id === id ? { ...d, status: 'Approved' } : d));
    addToast(`Document "${name}" verified & marked as Cleared.`, 'success');
  };

  // E-Signature
  const handleEsignContract = (e: FormEvent) => {
    e.preventDefault();
    if (!esignTextInput.trim() || esignTextInput.length < 3) {
      addToast('Please type your legal signature name clearly in the confirmation field.', 'error');
      return;
    }
    setPreBoardingDocs(prev => prev.map(d => {
      if (d.category === 'Contract' || d.id === 'DOC03') {
        return { ...d, status: 'Approved', uploadedAt: new Date().toISOString().split('T')[0] };
      }
      return d;
    }));
    setIsOfferSigned(true);
    addToast(`Offer contract securely digitally sealed under certificate key code [SEC-${Date.now().toString().slice(-6)}]`, 'success');
  };

  // Checklist Actions
  const handleChecklistToggle = (id: string) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.completed;
        addToast(nextState ? 'Verification milestone accomplished!' : 'Reverted milestone status', 'success');
        return { ...item, completed: nextState };
      }
      return item;
    }));
  };

  const handleAddChecklistTask = (e: FormEvent) => {
    e.preventDefault();
    if (!newChecklistTask.trim()) {
      addToast('Please enter a task statement', 'error');
      return;
    }
    const newTask: ChecklistItem = {
      id: `ob-${Date.now()}`,
      task: newChecklistTask,
      department: newChecklistDept,
      completed: false,
      dueDate: newChecklistDueDate,
      targetEmployeeId: selectedSubEmployee
    };
    setChecklist([...checklist, newTask]);
    setNewChecklistTask('');
    addToast('Task added to active department backlog.', 'success');
  };

  // Video Playing Mock Trigger
  const handlePlayCultureVideo = () => {
    setIsVideoPlaying(true);
    setVideoPlayPercentage(0);
    const interval = setInterval(() => {
      setVideoPlayPercentage(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          addToast('Novora culture briefing video accomplished! Policy checklist task cleared.', 'success');
          setIsVideoPlaying(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  // Clearance Resignations
  const handleClearanceToggle = (id: string, dept: 'IT' | 'Finance' | 'HR' | 'Security') => {
    setResignationCases(prev => prev.map(r => {
      if (r.id === id) {
        const nextVal = r.clearanceStatus[dept] === 'Cleared' ? 'Pending' : 'Cleared';
        addToast(`Clearing ${dept} clearance for employee ${r.employeeName}`, 'success');
        return {
          ...r,
          clearanceStatus: {
            ...r.clearanceStatus,
            [dept]: nextVal
          }
        };
      }
      return r;
    }));
  };

  const handleManagerApprovalState = (id: string, approved: 'Approved' | 'Rejected') => {
    setResignationCases(prev => prev.map(r => {
      if (r.id === id) {
        addToast(`Resignation status updated to ${approved}`, 'success');
        return { ...r, managerApproval: approved };
      }
      return r;
    }));
  };

  const handleResigSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newResigReason.trim()) {
      addToast('Please specify official reasons of leaving.', 'error');
      return;
    }
    const empObj = employees.find(emp => emp.id === newResigEmpId) || employees[0];
    const newCase: ResignationCase = {
      id: `RES-${Math.floor(100 + Math.random() * 899)}`,
      employeeName: empObj.name,
      employeeId: newResigEmpId,
      resignationDate: newResigDate,
      lastWorkingDay: newResigLastDay,
      reason: newResigReason,
      managerApproval: 'Pending',
      clearanceStatus: { IT: 'Pending', Finance: 'Pending', HR: 'Pending', Security: 'Pending' }
    };
    setResignationCases([newCase, ...resignationCases]);
    setSelectedResigId(newCase.id);
    setNewResigReason('');
    addToast(`Digitized resignation filed for ${empObj.name}. Manager workflow requested.`, 'success');
  };

  // Exit Survey submit
  const handleExitSurveySubmit = (e: FormEvent) => {
    e.preventDefault();
    const activeSurvey: ExitInterviewForm = {
      employeeId: newSurveyEmpId,
      leavingReason: newSurveyReason,
      ratingWorkLife: wlRating,
      ratingCompensation: compRating,
      ratingManagement: mgtRating,
      ratingGrowth: grRating,
      comments: surveyNotes || 'Standard exit clearance comments compiled.'
    };
    setExitSurveys([activeSurvey, ...exitSurveys]);
    setSurveyNotes('');
    addToast('Exit interview audit parameters saved to database trends.', 'success');
  };


  // -------------------------------------------------------------
  // CALCULATED METRICS FOR CHARTS / BUBBLES
  // -------------------------------------------------------------
  const filteredKb = kbArticles.filter(art => 
    art.title.toLowerCase().includes(kbSearchQuery.toLowerCase()) ||
    art.text.toLowerCase().includes(kbSearchQuery.toLowerCase())
  );

  const selectedResigObj = resignationCases.find(r => r.id === selectedResigId) || resignationCases[0];

  // Specific employee checklists
  const targetedChecklists = checklist.filter(item => item.targetEmployeeId === selectedSubEmployee);
  const checklistCompletionPct = targetedChecklists.length > 0 
    ? Math.round((targetedChecklists.filter(i => i.completed).length / targetedChecklists.length) * 100)
    : 0;

  return (
    <div id="on-offboarding-module-root" className="space-y-6">
      
      {/* Upper sub-tab switcher bar */}
      <div id="onboarding-navigator-row" className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-200/85 pb-4 gap-4">
        <div id="onboarding-nav-tabs" className="flex items-center gap-1.5 select-none overflow-x-auto w-full lg:w-auto scrollbar-none pb-1 lg:pb-0">
          {(
            [
              'Pre-Onboarding Portal',
              'Tasks & Checklists',
              'Knowledge Base',
              'Offboarding & Clearance',
              'Exit Interviews',
              'Reports & Analytics'
            ] as OnOffSubTab[]
          ).map((tab) => {
            const isActive = activeSubTab === tab;
            return (
              <button
                id={`tab-${tab.toLowerCase().replace(/\s+/g, '-').replace('&', 'and')}`}
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

        {/* Outer Scope Quick selection info indicator */}
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Active Talent:</span>
          <select
            value={selectedSubEmployee}
            onChange={(e) => setSelectedSubEmployee(e.target.value)}
            className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-1.5 outline-none cursor-pointer hover:bg-slate-50"
          >
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
        </div>
      </div>


      {/* TAB 1: PRE-ONBOARDING PORTAL (Legal document uploads, NDA, e-signature Contract) */}
      {activeSubTab === 'Pre-Onboarding Portal' && (
        <div id="subview-preonboarding" className="space-y-6">


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left side: Upload list and compliance status check */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-slate-100 rounded-2xl p-6.5 shadow-xs">
                <div className="flex justify-between items-center mb-5">
                  <div>
                    <h5 className="text-[12.5px] font-black text-slate-800 uppercase tracking-wide">Document Clearance List</h5>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Assigned profile requirements for {currentEmployeeObj?.name}</p>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg">
                    {preBoardingDocs.filter(d => d.status === 'Approved').length} / {preBoardingDocs.length} Verified
                  </span>
                </div>

                <div className="space-y-3">
                  {preBoardingDocs.map(doc => (
                    <div key={doc.id} className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 hover:border-slate-200 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3.5">
                        <span className={`p-2 rounded-xl shrink-0 ${
                          doc.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                          doc.status === 'Verification Required' ? 'bg-amber-50 text-amber-600' :
                          'bg-slate-100 text-slate-400'
                        }`}>
                          <FileText className="h-4 w-4" />
                        </span>
                        <div>
                          <h6 className="text-xs font-bold text-slate-800">{doc.name}</h6>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9.5px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-500">
                              {doc.category}
                            </span>
                            {doc.isRequired && (
                              <span className="text-[9px] text-rose-600 font-extrabold tracking-wider uppercase bg-rose-50 px-1.5 py-0.5 rounded-sm border border-rose-100">
                                Required
                              </span>
                            )}
                            {doc.uploadedAt && (
                              <span className="text-[10px] text-slate-400 font-medium">Uploaded {doc.uploadedAt}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg ${
                          doc.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/50' :
                          doc.status === 'Verification Required' ? 'bg-amber-100 text-amber-800 border border-amber-200/50_ animate-pulse' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {doc.status}
                        </span>

                        {doc.status === 'Verification Required' && (
                          <button
                            onClick={() => handleApproveDoc(doc.id, doc.name)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] font-black px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                          >
                            Verify
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* NDA and Offer Contract E-Signature Section */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6.5 shadow-xs relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-[#2f66e0]/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-2 mb-4">
                  <PenTool className="h-4 w-4 text-[#2f66e0]" />
                  <h5 className="text-[12px] font-black text-slate-800 uppercase tracking-wide">Secure Employment Agreement Sealed Signature</h5>
                </div>

                {isOfferSigned ? (
                  <div className="bg-emerald-50/50 border border-emerald-200/60 p-5 rounded-xl text-center">
                    <ShieldCheck className="h-10 w-10 text-emerald-600 mx-auto" />
                    <h6 className="text-xs font-black text-slate-800 mt-2.5">Employment Offer Contract Legally Sealed</h6>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-md mx-auto leading-normal">
                      The agreement with {currentEmployeeObj?.name} has been certified via digital e-signatures and locked in corporate databases. IP addresses of execution: 192.168.42.110.
                    </p>
                    <button 
                      onClick={() => addToast('Downloading certificate logs...', 'success')}
                      className="text-xs text-[#2f66e0] font-bold hover:underline mt-3 flex items-center gap-1 mx-auto"
                    >
                      <Download className="h-3 w-3" />
                      <span>Download Encrypted Legal Receipt PDF</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleEsignContract} className="space-y-4">
                    <p className="text-xs text-slate-500 leading-relaxed">
                      To complete pre-onboarding workflows, please sign the <strong>Standard General Employment Offer Contract (DOC03)</strong>. Candidates must type their exact full legal name to generate the biometric seal.
                    </p>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-widest block">Signature Manifest Field</span>
                        <input
                          type="text"
                          placeholder="Type 'Sarah Lim' or equivalent legal name"
                          value={esignTextInput}
                          onChange={(e) => setEsignTextInput(e.target.value)}
                          className="text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-slate-300 min-w-[200px]"
                        />
                      </div>

                      <div className="h-14 font-serif text-slate-700 italic border-2 border-slate-200 border-dashed bg-white rounded-lg flex items-center justify-center text-lg font-black tracking-wide shrink-0 px-6 select-none bg-radial-vignette">
                        {esignTextInput || 'Digital Stamp'}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-[#2f66e0] hover:bg-opacity-95 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl cursor-pointer shadow-xs transition-transform flex items-center gap-2"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        <span>Authorize and Seal Contract</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Right side form: Upload document manually */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
                <h5 className="text-[12px] font-black text-slate-700 uppercase tracking-wide mb-4">Upload New Document</h5>
                <form onSubmit={handleDocUpload} className="space-y-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Document Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Visa Clearance"
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                      className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 outline-none focus:bg-white focus:border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Document Category</label>
                    <select
                      value={newDocCategory}
                      onChange={(e) => setNewDocCategory(e.target.value)}
                      className="w-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 outline-none focus:bg-white focus:border-slate-200 cursor-pointer"
                    >
                      <option>Legal Proof</option>
                      <option>Contract</option>
                      <option>Health Clearance</option>
                      <option>Credentials</option>
                    </select>
                  </div>

                  <div className="border border-dashed border-slate-200 hover:border-[#2f66e0] p-6.5 rounded-xl text-center bg-slate-50 transition-all cursor-pointer" onClick={() => addToast('Simulating mock file select...', 'info')}>
                    <Upload className="h-7 w-7 text-slate-400 mx-auto mb-2" />
                    <span className="text-xs font-bold text-slate-700 block">Click or Drag & Drop</span>
                    <span className="text-[9.5px] text-slate-400 font-medium block mt-1">Accepts PDF, JPG, PNG up to 10MB</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#2f66e0] hover:bg-opacity-95 text-white text-xs font-extrabold py-2.5 rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Upload Document</span>
                  </button>
                </form>
              </div>

              {/* Sandbox verification notice card */}
              <div className="bg-[#2f66e0]/5 border border-[#2f66e0]/10 p-5 rounded-2xl">
                <div className="flex gap-2.5">
                  <AlertCircle className="h-5 w-5 text-[#2f66e0] shrink-0" />
                  <div>
                    <h6 className="text-xs font-bold text-slate-800">Compliance Audit Tip</h6>
                    <p className="text-[11px] text-slate-505 leading-relaxed mt-1">
                      Legal Proof documents (such as NRIC, working passport) are cross-checked with the Federal Biometric Database. Turnaround time for automated compliance matches is ordinarily 4 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* TAB 2: TASK & CHECKLIST AUTOMATION (IT, Admin, HR orientations) */}
      {activeSubTab === 'Tasks & Checklists' && (
        <div id="subview-checklists" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left panel: configure custom checklist item */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-6.5 shadow-xs">
              <h5 className="text-[12.5px] font-black text-slate-700 uppercase tracking-wide mb-4">Create Checklist Task</h5>
              <form onSubmit={handleAddChecklistTask} className="space-y-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Milestone Action Statement</label>
                  <input
                    type="text"
                    placeholder="e.g. Program key card entry"
                    value={newChecklistTask}
                    onChange={(e) => setNewChecklistTask(e.target.value)}
                    className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 outline-none focus:bg-white focus:border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Owning Department</label>
                  <select
                    value={newChecklistDept}
                    onChange={(e) => setNewChecklistDept(e.target.value as any)}
                    className="w-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 outline-none focus:bg-white focus:border-slate-200 cursor-pointer"
                  >
                    <option value="IT Operations">IT Operations</option>
                    <option value="HR Compliance">HR Compliance</option>
                    <option value="Finance Payroll">Finance Payroll</option>
                    <option value="Security Assets">Security/Facilities</option>
                    <option value="Engineering department">Engineering Dept</option>
                    <option value="HR Administration">HR Administration</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">Target Due Date</label>
                  <input
                    type="date"
                    value={newChecklistDueDate}
                    onChange={(e) => setNewChecklistDueDate(e.target.value)}
                    className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 outline-none focus:bg-white focus:border-slate-200 cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#2f66e0] hover:bg-opacity-95 text-white text-xs font-extrabold py-2.5 rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Assign Milestone</span>
                </button>
              </form>
            </div>

            {/* Progress of targeted candidate */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
              <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Targeted Completion Metric</span>
              <h5 className="text-sm font-black text-slate-800 mt-2">{currentEmployeeObj?.name}</h5>
              
              <div className="flex items-center gap-3 mt-4">
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-[#2f66e0] h-full transition-all duration-550" 
                    style={{ width: `${checklistCompletionPct}%` }}
                  />
                </div>
                <span className="text-xs font-black text-slate-700">{checklistCompletionPct}%</span>
              </div>
              <p className="text-[10.5px] text-slate-400 font-semibold mt-2.5">
                {targetedChecklists.filter(i => i.completed).length} of {targetedChecklists.length} task clearances fulfilled.
              </p>
            </div>
          </div>

          {/* Right panel: checklist datatable / lists */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                  <h5 className="text-[12.5px] font-black text-slate-800 uppercase tracking-wide">Milestone Clearance Lists</h5>
                  <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Clearing checklists across different administrative departments</p>
                </div>

                {/* Scope trigger buttons */}
                <button
                  onClick={() => {
                    setChecklist(prev => prev.map(item => ({ ...item, completed: true })));
                    addToast('Auto-cleared all pending corporate milestones!', 'success');
                  }}
                  className="text-xs text-[#2f66e0] hover:underline font-extrabold flex items-center gap-1 shrink-0"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Clear All Milestones</span>
                </button>
              </div>

              {targetedChecklists.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 border border-slate-100 border-dashed rounded-xl">
                  <AlertCircle className="h-8 w-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500 font-semibold mt-2.5">No specific tasks registered for {currentEmployeeObj?.name}.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {targetedChecklists.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleChecklistToggle(item.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer select-none ${
                        item.completed
                          ? 'bg-slate-50/50 border-slate-100 opacity-80'
                          : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-3xs'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <span className="mt-0.5 text-[#2f66e0] shrink-0">
                          {item.completed ? (
                            <CheckSquare className="h-4.5 w-4.5 text-emerald-600" />
                          ) : (
                            <Square className="h-4.5 w-4.5 text-slate-350" />
                          )}
                        </span>
                        <div>
                          <p className={`text-xs font-bold leading-tight ${item.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {item.task}
                          </p>
                          <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
                            <span className="text-[9.5px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">
                              {item.department}
                            </span>
                            <span className="text-[9.5px] font-semibold text-slate-400 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Due {item.dueDate}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg shrink-0 ${
                        item.completed 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {item.completed ? 'Cleared' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {/* TAB 3: COMPANY KNOWLEDGE BASE (Policies, culture video guides) */}
      {activeSubTab === 'Knowledge Base' && (
        <div id="subview-knowledgebase" className="space-y-6">
          {/* Interactive culture video and onboarding welcome checklist */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Search + Articles cards list */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-slate-100 rounded-2xl p-6.5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                  <div>
                    <h5 className="text-[12.5px] font-black text-slate-800 uppercase tracking-wide">Knowledge Directory SOP</h5>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Read-to-clear policies of conduct & training modules</p>
                  </div>

                  {/* Search filter input */}
                  <div className="relative max-w-xs w-full">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search policy archives..."
                      value={kbSearchQuery}
                      onChange={(e) => setKbSearchQuery(e.target.value)}
                      className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-4 py-2 outline-none focus:bg-white focus:border-slate-205"
                    />
                  </div>
                </div>

                {filteredKb.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-400 font-semibold">No policies match "{kbSearchQuery}". Try clearing options.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredKb.map((art) => (
                      <div
                        key={art.id}
                        onClick={() => setSelectedKbArticle(art.id === selectedKbArticle ? null : art.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer text-left select-none ${
                          selectedKbArticle === art.id
                            ? 'bg-blue-50/30 border-[#2f66e0]/35 hover:border-[#2f66e0]/45'
                            : 'bg-white border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                            art.category === 'Policy' ? 'bg-indigo-50 text-[#2f66e0]' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {art.category}
                          </span>
                          <span className="text-slate-400 hover:text-slate-600">
                            <BookOpen className="h-4.5 w-4.5" />
                          </span>
                        </div>

                        <h6 className="text-[11.5px] font-black text-slate-800 mt-2.5 leading-tight">{art.title}</h6>
                        <p className={`text-[11px] text-slate-505 leading-relaxed mt-2 ${
                          selectedKbArticle === art.id ? '' : 'line-clamp-2'
                        }`}>
                          {art.text}
                        </p>
                        
                        <div className="mt-3 pt-3 border-t border-slate-50 flex justify-between items-center text-[10px] font-bold text-[#2f66e0]">
                          <span>{selectedKbArticle === art.id ? 'Collapse details' : 'Read handbook chapters'}</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Culture video player mockup / sandbox */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
                <h5 className="text-[12.5px] font-black text-slate-700 uppercase tracking-wide mb-4">Culture Orientation Video</h5>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  Incoming candidates must play the intro briefing culture documentary. Successfully completing the visual play session marks the task as cleared.
                </p>

                {/* Video container box */}
                <div className="relative aspect-video rounded-xl bg-slate-900 overflow-hidden flex flex-col justify-center items-center text-center p-4">
                  {isVideoPlaying ? (
                    <div className="space-y-3.5 w-full">
                      <div className="animate-spin h-7 w-7 border-3 border-white border-t-transparent rounded-full mx-auto" />
                      <span className="text-[10px] text-white font-extrabold uppercase tracking-widest block">Stream loaded &bull; Play tracking {videoPlayPercentage}%</span>
                      <div className="w-full bg-slate-750 rounded-full h-1 pl-0.5 pr-0.5">
                        <div className="bg-blue-500 h-full rounded-full transition-all duration-300" style={{ width: `${videoPlayPercentage}%` }} />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Video className="h-9 w-9 text-[#2f66e0]" />
                      <p className="text-[11px] text-slate-300 font-bold">"Welcome to Novora Core Team"</p>
                      <p className="text-[9.5px] text-slate-400">Duration: 4m 32s</p>
                      <button
                        onClick={handlePlayCultureVideo}
                        className="bg-[#2f66e0] hover:bg-opacity-95 text-white font-extrabold text-[10.5px] px-3.5 py-1.5 rounded-lg cursor-pointer transition-all mt-2.5 flex items-center gap-1.5 mx-auto"
                      >
                        <Video className="h-3 w-3" />
                        <span>Play Video Session</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                  <span>Policy Check ID code:</span>
                  <span className="font-mono text-slate-700">POL-VIDEO-CULT</span>
                </div>
              </div>

              {/* Handbook instant download */}
              <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <h6 className="text-xs font-black text-slate-800">Handbook 2026 Edition</h6>
                  <p className="text-[10.5px] text-slate-400 font-semibold">Comprehensive policies handbook</p>
                </div>
                <button
                  onClick={() => addToast('Downloading handbook details PDF...', 'success')}
                  className="bg-white border border-slate-100 p-2.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer text-slate-600"
                >
                  <Download className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}


      {/* TAB 4: OFFBOARDING & CLEARANCE WORKFLOWS */}
      {activeSubTab === 'Offboarding & Clearance' && (
        <div id="subview-offboarding" className="space-y-6">
          <div className="bg-rose-50/40 border border-rose-100 p-5.5 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <span className="text-[9.5px] font-black uppercase text-rose-700 tracking-wider bg-white rounded-full px-2.5 py-0.5 border border-rose-100">
                Departures & Resignations Workflow
              </span>
              <h4 className="text-sm font-black text-slate-800 mt-2.5">Official Exit Clearance Protocols</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Approve active resignations, program cross-department de-provisioning, and confirm secure handbacks.
              </p>
            </div>
            <span className="p-3.5 rounded-2xl bg-rose-50 text-rose-600 self-start sm:self-auto">
              <UserMinus className="h-6 w-6" />
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left side: List of departure cases + department clearance */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-slate-100 rounded-2xl p-6.5 shadow-xs">
                <h5 className="text-[12.5px] font-black text-slate-800 uppercase tracking-wide mb-4">Departing Officer Cases</h5>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10.5px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/50">
                        <th className="p-3.5">Departing employee</th>
                        <th className="p-3.5">Filing Date</th>
                        <th className="p-3.5">Last Working Day</th>
                        <th className="p-3.5">Manager Approval</th>
                        <th className="p-3.5">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {resignationCases.map(c => (
                        <tr 
                          key={c.id} 
                          onClick={() => setSelectedResigId(c.id)}
                          className={`cursor-pointer transition-colors ${
                            selectedResigId === c.id ? 'bg-[#2f66e0]/5' : 'hover:bg-slate-50/50'
                          }`}
                        >
                          <td className="p-3.5 font-bold text-slate-800">
                            <div>{c.employeeName}</div>
                            <span className="text-[9.5px] font-semibold text-[#8b5cf6]">{c.employeeId}</span>
                          </td>
                          <td className="p-3.5 font-semibold text-slate-400">{c.resignationDate}</td>
                          <td className="p-3.5 font-bold text-slate-700">{c.lastWorkingDay}</td>
                          <td className="p-3.5">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                              c.managerApproval === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                              c.managerApproval === 'Rejected' ? 'bg-red-50 text-red-700' :
                              'bg-amber-50 text-amber-700'
                            }`}>
                              {c.managerApproval}
                            </span>
                          </td>
                          <td className="p-3.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleManagerApprovalState(c.id, 'Approved')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] px-2 py-1 rounded-md"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleManagerApprovalState(c.id, 'Rejected')}
                                className="border border-red-200 text-red-650 hover:bg-red-50 font-extrabold text-[10px] px-2 py-1 rounded-md"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* clearance progress matrix tracking */}
              {selectedResigObj && (
                <div className="bg-white border border-slate-100 rounded-2xl p-6.5 shadow-xs">
                  <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                    <div>
                      <h5 className="text-[12px] font-black text-slate-805 uppercase tracking-wide">
                        CLEARANCE HANDBACK TRACKING ({selectedResigObj.employeeName})
                      </h5>
                      <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                        Verify cross-department audits to authorize payroll releases
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 italic">Case Code: {selectedResigObj.id}</span>
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50/50 p-3 rounded-xl border border-slate-100 mb-5 leading-normal">
                    <strong>Official reason stated:</strong> "{selectedResigObj.reason}"
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
                    {/* IT Clearance */}
                    <div 
                      onClick={() => handleClearanceToggle(selectedResigObj.id, 'IT')}
                      className={`p-4 rounded-xl border text-center cursor-pointer transition-all select-none ${
                        selectedResigObj.clearanceStatus.IT === 'Cleared'
                          ? 'bg-emerald-50/30 border-emerald-200'
                          : 'bg-white border-slate-100 hover:border-slate-205'
                      }`}
                    >
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">IT Clearance</span>
                      <h6 className="text-[11px] text-slate-505 font-bold mt-1">SSO & credentials</h6>
                      <div className="mt-3.5 text-xs font-black">
                        <span className={`px-2.5 py-1 rounded-lg ${
                          selectedResigObj.clearanceStatus.IT === 'Cleared' ? 'bg-emerald-100 text-[#0f5132]' : 'bg-amber-100 text-amber-80 *'
                        }`}>
                          {selectedResigObj.clearanceStatus.IT}
                        </span>
                      </div>
                    </div>

                    {/* Finance Clearance */}
                    <div 
                      onClick={() => handleClearanceToggle(selectedResigObj.id, 'Finance')}
                      className={`p-4 rounded-xl border text-center cursor-pointer transition-all select-none ${
                        selectedResigObj.clearanceStatus.Finance === 'Cleared'
                          ? 'bg-emerald-50/30 border-emerald-200'
                          : 'bg-white border-slate-100 hover:border-slate-205'
                      }`}
                    >
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Payroll Clear</span>
                      <h6 className="text-[11px] text-slate-505 font-bold mt-1">Expenses & taxation</h6>
                      <div className="mt-3.5 text-xs font-black">
                        <span className={`px-2.5 py-1 rounded-lg ${
                          selectedResigObj.clearanceStatus.Finance === 'Cleared' ? 'bg-emerald-100 text-[#0f5132]' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {selectedResigObj.clearanceStatus.Finance}
                        </span>
                      </div>
                    </div>

                    {/* HR Clearance */}
                    <div 
                      onClick={() => handleClearanceToggle(selectedResigObj.id, 'HR')}
                      className={`p-4 rounded-xl border text-center cursor-pointer transition-all select-none ${
                        selectedResigObj.clearanceStatus.HR === 'Cleared'
                          ? 'bg-emerald-50/30 border-emerald-200'
                          : 'bg-white border-slate-100 hover:border-slate-205'
                      }`}
                    >
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">HR Compliance</span>
                      <h6 className="text-[11px] text-slate-505 font-bold mt-1">Official Exit Contract</h6>
                      <div className="mt-3.5 text-xs font-black">
                        <span className={`px-2.5 py-1 rounded-lg ${
                          selectedResigObj.clearanceStatus.HR === 'Cleared' ? 'bg-emerald-100 text-[#0f5132]' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {selectedResigObj.clearanceStatus.HR}
                        </span>
                      </div>
                    </div>

                    {/* Security Clearance */}
                    <div 
                      onClick={() => handleClearanceToggle(selectedResigObj.id, 'Security')}
                      className={`p-4 rounded-xl border text-center cursor-pointer transition-all select-none ${
                        selectedResigObj.clearanceStatus.Security === 'Cleared'
                          ? 'bg-emerald-50/30 border-emerald-200'
                          : 'bg-white border-slate-100 hover:border-slate-205'
                      }`}
                    >
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Access badge</span>
                      <h6 className="text-[11px] text-slate-505 font-bold mt-1">Lock system & tokens</h6>
                      <div className="mt-3.5 text-xs font-black">
                        <span className={`px-2.5 py-1 rounded-lg ${
                          selectedResigObj.clearanceStatus.Security === 'Cleared' ? 'bg-emerald-100 text-[#0f5132]' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {selectedResigObj.clearanceStatus.Security}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <span className="text-[10.5px] italic text-slate-400">Click individual boxes above to toggle audited clearance status.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right side: File Resignation form */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
                <h5 className="text-[12.5px] font-black text-slate-700 uppercase tracking-wide mb-4">Digitize Exit Case</h5>
                <form onSubmit={handleResigSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Impacted Employee</label>
                    <select
                      value={newResigEmpId}
                      onChange={(e) => setNewResigEmpId(e.target.value)}
                      className="w-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 outline-none focus:bg-white focus:border-slate-200 cursor-pointer"
                    >
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name} ({emp.id})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Effective Filing Date</label>
                    <input
                      type="date"
                      value={newResigDate}
                      onChange={(e) => setNewResigDate(e.target.value)}
                      className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 cursor-pointer outline-none focus:bg-white focus:border-slate-205"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Requested Last Working Day</label>
                    <input
                      type="date"
                      value={newResigLastDay}
                      onChange={(e) => setNewResigLastDay(e.target.value)}
                      className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 cursor-pointer outline-none focus:bg-white focus:border-slate-205"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Specific resignation reason stated</label>
                    <textarea
                      placeholder="e.g. Work environment feedback or external offers"
                      rows={2}
                      value={newResigReason}
                      onChange={(e) => setNewResigReason(e.target.value)}
                      className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 outline-none focus:bg-white focus:border-slate-200 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 text-white text-xs font-extrabold py-2.5 rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
                  >
                    <UserX className="h-4 w-4 text-rose-500" />
                    <span>Initiate Exit Case</span>
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      )}


      {/* TAB 5: EXIT INTERVIEWS SURVEY FEEDBACK */}
      {activeSubTab === 'Exit Interviews' && (
        <div id="subview-exitinterviews" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left side: Statistics and trends (Why people are leaving) */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart2 className="h-4 w-4 text-[#2f66e0]" />
                  <h5 className="text-[12.5px] font-black text-slate-700 uppercase tracking-wide">Exit Sentiment Dynamics</h5>
                </div>
                
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  A comprehensive audit score of compiled resignation metrics over the last 12 months.
                </p>

                <div className="space-y-4">
                  {/* Aspect 1: Work-life */}
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                      <span>Work-Life balance index</span>
                      <span>4.5 / 5.0</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: '90%' }} />
                    </div>
                  </div>

                  {/* Aspect 2: Comp */}
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                      <span>Compensation & Allowance satisfaction</span>
                      <span>3.5 / 5.0</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full" style={{ width: '70%' }} />
                    </div>
                  </div>

                  {/* Aspect 3: management */}
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                      <span>Management coordination trust</span>
                      <span>4.5 / 5.0</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: '90%' }} />
                    </div>
                  </div>

                  {/* Aspect 4: growth */}
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                      <span>Career Path & Skills Growth</span>
                      <span>3.5 / 5.0</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: '71%' }} />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100/50 text-[11px] leading-relaxed text-slate-600 mt-5">
                  <span className="font-extrabold text-[#2f66e0]">Top Departure Trigger:</span>
                  <p className="mt-0.5 font-medium">Better scope, seniority offer level & compensation package adjustments (72% of files).</p>
                </div>
              </div>
            </div>

            {/* Middle Col: Exit survey submission form */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs">
                <h5 className="text-[12.5px] font-black text-slate-700 uppercase tracking-wide mb-4">Log Feedback Form</h5>
                <form onSubmit={handleExitSurveySubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Departing officer</label>
                    <select
                      value={newSurveyEmpId}
                      onChange={(e) => setNewSurveyEmpId(e.target.value)}
                      className="w-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 outline-none cursor-pointer"
                    >
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Primary trigger of departure</label>
                    <select
                      value={newSurveyReason}
                      onChange={(e) => setNewSurveyReason(e.target.value)}
                      className="w-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 outline-none cursor-pointer"
                    >
                      <option>Better career growth</option>
                      <option>Workplace culture issues</option>
                      <option>Compensation package</option>
                      <option>Family relocation & Personal reasons</option>
                    </select>
                  </div>

                  {/* Ratings */}
                  <div className="grid grid-cols-2 gap-3 pb-2">
                    <div>
                      <label className="text-[9.5px] text-slate-400 font-bold block mb-1">Work-Life Rating (1-5)</label>
                      <input 
                        type="number" min={1} max={5} value={wlRating} 
                        onChange={(e) => setWlRating(parseInt(e.target.value))}
                        className="w-full text-xs box-border text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9.5px] text-slate-400 font-bold block mb-1">Comp Rating (1-5)</label>
                      <input 
                        type="number" min={1} max={5} value={compRating} 
                        onChange={(e) => setCompRating(parseInt(e.target.value))}
                        className="w-full text-xs box-border text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Interview Comments / notes</label>
                    <textarea
                      placeholder="e.g. Core team coordination feedback"
                      rows={2}
                      value={surveyNotes}
                      onChange={(e) => setSurveyNotes(e.target.value)}
                      className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 outline-none focus:bg-white focus:border-slate-205 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#2f66e0] hover:bg-opacity-95 text-white text-xs font-extrabold py-2.5 rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Log Survey Audit</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Right side: list exit surveys logged */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white border border-slate-100 rounded-2xl p-6.5 shadow-xs">
                <h5 className="text-[12.5px] font-black text-slate-800 uppercase tracking-wide mb-4">Exit Interviews Record</h5>
                
                <div className="space-y-4">
                  {exitSurveys.map((sv, idx) => {
                    const empName = employees.find(e => e.id === sv.employeeId)?.name || sv.employeeId;
                    return (
                      <div key={idx} className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 hover:border-slate-200 transition-colors">
                        <div className="flex justify-between items-center">
                          <h6 className="text-[11px] font-black text-slate-800">{empName}</h6>
                          <span className="text-[10px] text-slate-400 font-semibold">{sv.leavingReason}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 italic mt-2 leading-relaxed">
                          "{sv.comments}"
                        </p>
                        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-105 text-[9.5px] font-extrabold text-slate-400 uppercase">
                          <span>WorkLife: <span className="text-slate-800">{sv.ratingWorkLife}/5</span></span>
                          <span>Comp: <span className="text-slate-800">{sv.ratingCompensation}/5</span></span>
                          <span>Manager: <span className="text-slate-800">{sv.ratingManagement}/5</span></span>
                          <span>Growth: <span className="text-slate-800">{sv.ratingGrowth}/5</span></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 6: ON/OFF-BOARDING REPORTS & ANALYTICS */}
      {activeSubTab === 'Reports & Analytics' && (
        <div id="subview-on-off-boarding-reports" className="space-y-6 animate-in fade-in duration-200">
          
          {/* Key Metrics Cards Block */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-3xs">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-black uppercase tracking-wider block">Completed Tasks Ratio</span>
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="mt-2.5">
                <span className="text-2xl font-black text-slate-800">
                  {Math.round((checklist.filter(c => c.completed).length / (checklist.length || 1)) * 100)}%
                </span>
                <span className="text-[10px] text-slate-450 block font-semibold mt-0.5">
                  {checklist.filter(c => c.completed).length} / {checklist.length} milestones checked
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-3">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${Math.round((checklist.filter(c => c.completed).length / (checklist.length || 1)) * 100)}%` }}
                />
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-3xs">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-black uppercase tracking-wider block">Document Clear Rate</span>
                <ShieldCheck className="h-4 w-4 text-blue-500" />
              </div>
              <div className="mt-2.5">
                <span className="text-2xl font-black text-slate-800">
                  {Math.round((preBoardingDocs.filter(d => d.status === 'Approved').length / (preBoardingDocs.length || 1)) * 100)}%
                </span>
                <span className="text-[10px] text-slate-450 block font-semibold mt-0.5">
                  {preBoardingDocs.filter(d => d.status === 'Approved').length} / {preBoardingDocs.length} credentials verified
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-3">
                <div 
                  className="bg-blue-500 h-full transition-all duration-300"
                  style={{ width: `${Math.round((preBoardingDocs.filter(d => d.status === 'Approved').length / (preBoardingDocs.length || 1)) * 100)}%` }}
                />
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-3xs">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-black uppercase tracking-wider block">Active Offboarding</span>
                <UserX className="h-4 w-4 text-rose-500" />
              </div>
              <div className="mt-2.5">
                <span className="text-2xl font-black text-slate-800">
                  {resignationCases.filter(r => r.managerApproval !== 'Approved' || Object.values(r.clearanceStatus).some(status => status === 'Pending')).length}
                </span>
                <span className="text-[10px] text-slate-450 block font-semibold mt-0.5">
                  Pending department signoffs & clearances
                </span>
              </div>
              <div className="flex items-center gap-1 mt-3">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[9.5px] text-amber-600 font-extrabold uppercase">Department reviews in-progress</span>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-3xs">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-black uppercase tracking-wider block">Exit Satisfaction Score</span>
                <Award className="h-4 w-4 text-purple-500" />
              </div>
              <div className="mt-2.5">
                <span className="text-2xl font-black text-slate-800">
                  {exitSurveys.length > 0
                    ? (exitSurveys.reduce((sum, s) => sum + (s.ratingWorkLife + s.ratingCompensation + s.ratingManagement + s.ratingGrowth) / 4, 0) / exitSurveys.length).toFixed(1)
                    : 'N/A'
                  } / 5.0
                </span>
                <span className="text-[10px] text-slate-450 block font-semibold mt-0.5">
                  Average across {exitSurveys.length} surveys
                </span>
              </div>
              <div className="flex items-center gap-1 mt-3.5">
                <TrendingUp className="h-3.5 w-3.5 text-purple-500" />
                <span className="text-[9.5px] text-purple-600 font-extrabold uppercase">Healthy team morale indicators</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Aspect: Clearance Progress Monitor (7 Cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs space-y-5">
              <div className="border-b border-slate-50 pb-3 flex justify-between items-center">
                <div>
                  <h5 className="text-[12.5px] font-black text-slate-800 uppercase tracking-wide">Pending Clearance Auditing Log</h5>
                  <p className="text-[10px] text-slate-400 font-medium italic mt-0.5">Track IT checklist status, security, and asset repossessions for exiting staff</p>
                </div>
                <button 
                  onClick={() => {
                    addToast('On/Offboarding clearance audit reports prepared for payroll reconciliation.', 'success');
                  }}
                  className="bg-slate-50 border border-slate-100 rounded-xl px-2.5 py-1 text-[9.5px] font-black uppercase text-slate-500 hover:text-[#2f66e0] transition-colors cursor-pointer"
                >
                  Export Clearance Logs
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] font-semibold text-slate-600 border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 uppercase text-[9.5px] font-black text-slate-400">
                      <th className="py-2.5 px-3">Associate</th>
                      <th className="py-2.5 px-3 text-center">IT Access</th>
                      <th className="py-2.5 px-3 text-center">Finance Account</th>
                      <th className="py-2.5 px-3 text-center">HR Recourse</th>
                      <th className="py-2.5 px-3 text-center">Security Assets</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {resignationCases.map((rc) => (
                      <tr key={rc.id} className="hover:bg-slate-50/20">
                        <td className="py-3 px-3">
                          <span className="text-slate-800 font-bold block">{rc.employeeName}</span>
                          <span className="text-[9.5px] font-mono text-slate-400 uppercase tracking-widest">{rc.employeeId}</span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                            rc.clearanceStatus.IT === 'Cleared' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {rc.clearanceStatus.IT}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                            rc.clearanceStatus.Finance === 'Cleared' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {rc.clearanceStatus.Finance}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                            rc.clearanceStatus.HR === 'Cleared' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {rc.clearanceStatus.HR}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                            rc.clearanceStatus.Security === 'Cleared' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {rc.clearanceStatus.Security}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Aspect: Task Completion by Department and Exit Reason Stats (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs space-y-4">
                <h5 className="text-[12.5px] font-black text-slate-800 uppercase tracking-wide">Checklist Density by department</h5>
                
                <div className="space-y-3">
                  {['IT Operations', 'HR Compliance', 'Finance Payroll', 'Security Assets', 'Engineering department', 'HR Administration'].map((dept) => {
                    const deptTasks = checklist.filter(c => c.department === dept);
                    const completed = deptTasks.filter(c => c.completed).length;
                    const total = deptTasks.length;
                    const pct = total > 0 ? Math.round((completed / total) * 105) : 0;
                    
                    return (
                      <div key={dept} className="space-y-1">
                        <div className="flex justify-between items-center text-[10.5px]">
                          <span className="font-bold text-slate-600">{dept}</span>
                          <span className="font-bold text-slate-800">{completed}/{total} done</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#2f66e0] h-full rounded-full transition-all duration-300" 
                            style={{ width: `${Math.min(pct, 100)}%` }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Exit interview trends */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs space-y-4">
                <h5 className="text-[12.5px] font-black text-slate-800 uppercase tracking-wide">Primary Separation Drivers</h5>
                
                <div className="space-y-3">
                  {[
                    { reason: 'Career Growth / Job Hop', count: 3, percentage: 50, color: 'bg-indigo-500' },
                    { reason: 'Health / Personal Reasons', count: 2, percentage: 33, color: 'bg-emerald-500' },
                    { reason: 'Compensation Alignments', count: 1, percentage: 17, color: 'bg-rose-500' }
                  ].map((drv, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-[10.5px]">
                        <span className="font-semibold text-slate-655">{drv.reason}</span>
                        <span className="font-bold text-slate-800">{drv.count} surveys ({drv.percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`${drv.color} h-full rounded-full transition-all`} 
                          style={{ width: `${drv.percentage}%` }} 
                        />
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

import { useState, type FormEvent } from 'react'
import {
  Briefcase,
  Users,
  CalendarDays,
  Coins,
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
  Search,
  Plus,
  Eye,
  Check,
  FileCheck,
  Send,
  UserPlus,
  ArrowRight,
  TrendingUp,
  Percent,
  Clock,
  ChevronRight,
  Sparkles,
  Award,
  Upload,
  User,
  Printer,
  Calendar,
} from 'lucide-react'
import { showActionToast } from '../../utils/actionToast'
import type { ModuleEmployee } from '../../types/moduleEmployee'
import {
  initialRequisitions,
  initialPostings,
  initialCandidates,
  initialInterviews,
  initialOffers,
  initialPreOnboarding,
} from '../../data/mockRecruitment'
import type {
  JobRequisition,
  JobPosting,
  Candidate,
  Interview,
  Offer,
  PreOnboarding,
} from '../../data/mockRecruitment'

type RecruitmentTabProps = {
  onAddEmployeeAsRecord?: (newEmp: ModuleEmployee) => void
}

export function RecruitmentTab({ onAddEmployeeAsRecord }: RecruitmentTabProps) {
  const addToast = (text: string, type?: 'success' | 'loading' | 'error' | 'info') => {
    showActionToast(text, type)
  }

  const [activeSubTab, setActiveSubTab] = useState<string>('Job Requisition');
  const [searchValue, setSearchValue] = useState<string>('');
  const [deptFilter, setDeptFilter] = useState<string>('All departments');
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  // Interactive Reports Tab filters
  const [reportFilterDept, setReportFilterDept] = useState<string>('All departments');
  const [reportFilterPeriod, setReportFilterPeriod] = useState<string>('Q2 2026');
  const [reportSearchQuery, setReportSearchQuery] = useState<string>('');

  // Core Data states
  const [requisitions, setRequisitions] = useState<JobRequisition[]>(initialRequisitions);
  const [postings, setPostings] = useState<JobPosting[]>(initialPostings);
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [interviews, setInterviews] = useState<Interview[]>(initialInterviews);
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [preOnboardings, setPreOnboardings] = useState<PreOnboarding[]>(initialPreOnboarding);

  // Selection states
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>('CAND-004');
  const [selectedInterviewId, setSelectedInterviewId] = useState<string>('INT-01');
  const [selectedOfferId, setSelectedOfferId] = useState<string>('OFFER-001');
  const [selectedPreOnboardId, setSelectedPreOnboardId] = useState<string>('PRE-01');

  // Modal open states
  const [requisitionModalOpen, setRequisitionModalOpen] = useState(false);
  const [postingModalOpen, setPostingModalOpen] = useState(false);
  const [candidateModalOpen, setCandidateModalOpen] = useState(false);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [offerModalOpen, setOfferModalOpen] = useState(false);

  // New Form states
  const [requisitionStep, setRequisitionStep] = useState<1 | 2 | 3>(1);
  const [reqForm, setReqForm] = useState({
    // Step 1: Position Information & Employment Details
    positionTitle: '',
    department: 'HR',
    sectionTeam: '',
    reportsTo: 'Nina Reza (Head of HR)',
    employmentType: 'Permanent',
    workArrangement: 'On-site',
    jobGrade: 'G-5 / Sub B',
    vacancies: '1',
    targetFillDate: '13 May 2026',
    urgency: 'Normal',
    salaryMin: '5500',
    salaryMax: '7000',
    reason: 'New headcount',
    justification: '',

    // Step 2: Qualifications, Skills & JD
    minEducation: "Bachelor's degree",
    fieldOfStudy: 'e.g. Human Resource Management, Business',
    minExperience: 'Fresh graduate (0 yrs)',
    languageRequirement: 'English only',
    skills: ['HRBP', 'Labour law (MY)', 'Performance mgmt'],
    newSkillInput: '',
    responsibilities: '• Partner with department heads on workforce planning\n• Lead end-to-end recruitment for assigned departments\n• Manage employee relations and grievance handling',
    niceToHave: '',
    channels: {
      internal: true,
      jobstreet: true,
      linkedin: true,
      indeed: false,
      agency: false,
    },

    // Step 3: Approval chain & Routing
    notifySubmit: true,
    notifyAction: true,
    autoPublish: true,
    notifyHrTeam: false,
    primaryRecruiter: 'Maya Tan (HR Executive)',
    hiringManager: 'Nina Reza (Head of HR)',
  });

  const [_newReq, _setNewReq] = useState({
    positionTitle: '',
    department: 'Engineering',
    type: 'Permanent',
    requestedBy: 'pinky',
    targetFill: '30 Jun',
  });

  const [newPost, setNewPost] = useState({
    linkedReqId: '',
    position: '',
    channel: 'LinkedIn',
    employmentType: 'Full-time',
    arrangement: 'On-site',
    salaryMin: '5,500',
    salaryMax: '7,000',
    showSalary: 'Yes — show range',
    description: '',
    skills: 'HRBP, Labour law, Performance mgmt',
    start: '2026-06-15',
    end: '2026-07-15',
    channels: {
      internal: true,
      jobstreet: true,
      linkedin: true,
      indeed: false,
      agency: false,
    },
  });

  const [newCand, setNewCand] = useState({
    name: '',
    experience: '3 yrs',
    education: 'Bachelor Degree',
    source: 'LinkedIn',
    matchScore: '89%',
    stage: 'Applied' as const,
    positionApplied: 'HR Business Partner',
  });

  const [newInt, setNewInt] = useState({
    candidateId: '',
    stage: 'Phone screening',
    date: '2026-06-20',
    time: '11:00 AM',
    duration: '30 minutes',
    format: 'Video' as 'In person' | 'Phone' | 'Video',
    location: 'Zoom link',
    interviewers: 'Nina Reza + Ahmad Wahid',
    notes: '',
    sendInvite: true,
    sendReminder: true,
  });

  const [newOffer, setNewOffer] = useState({
    candidateName: '',
    position: '',
    salary: '6,000',
    allowance: '600',
    probation: '3 months',
    grade: 'G-5 / Sub B',
    expiryDays: '14',
  });

  // Handle addition callbacks
  const handleCreateRequisition = (e: FormEvent) => {
    e.preventDefault();
    const resolvedTitle = reqForm.positionTitle.trim() || 'HR Business Partner';
    const reqId = `REQ-2026-0${13 + requisitions.length}`;

    // Create the new Job Requisition record
    const req: JobRequisition = {
      id: reqId,
      positionTitle: resolvedTitle,
      department: reqForm.department,
      type: reqForm.employmentType,
      requestedBy: reqForm.hiringManager.split(' (')[0] || 'Nina Reza',
      openDate: 'Today',
      targetFill: reqForm.targetFillDate,
      applicants: 0,
      status: 'Open',
    };

    setRequisitions([req, ...requisitions]);

    // Handle Auto-Publish Action!
    // If autoPublish is checked, create live active job postings for each checked channel!
    if (reqForm.autoPublish) {
      const activeChannels: string[] = [];
      if (reqForm.channels.internal) activeChannels.push('Internal');
      if (reqForm.channels.jobstreet) activeChannels.push('JobStreet');
      if (reqForm.channels.linkedin) activeChannels.push('LinkedIn');
      if (reqForm.channels.indeed) activeChannels.push('Indeed');
      if (reqForm.channels.agency) activeChannels.push('Agency');

      if (activeChannels.length > 0) {
        const newPostings: JobPosting[] = activeChannels.map((channel, idx) => ({
          id: `POST-0${postings.length + idx + 10}`,
          position: resolvedTitle,
          channel: channel === 'internal' ? 'Internal' : channel,
          views: 0,
          applicants: 0,
          status: 'Live',
          department: reqForm.department,
        }));

        setPostings((prev) => [...newPostings, ...prev]);
        addToast(
          `Requisition approved: Job ads automatically published to ${activeChannels.join(', ')}!`,
          'success'
        );
      } else {
        addToast(`Successfully log job requisition for ${resolvedTitle}. No active channels selected.`, 'success');
      }
    } else {
      addToast(
        `Job requisition logged for ${resolvedTitle}. Awaiting manual publishing in Job Postings.`,
        'success'
      );
    }

    setRequisitionModalOpen(false);
    // Reset wizard
    setRequisitionStep(1);
    setReqForm({
      positionTitle: '',
      department: 'HR',
      sectionTeam: '',
      reportsTo: 'Nina Reza (Head of HR)',
      employmentType: 'Permanent',
      workArrangement: 'On-site',
      jobGrade: 'G-5 / Sub B',
      vacancies: '1',
      targetFillDate: '13 May 2026',
      urgency: 'Normal',
      salaryMin: '5500',
      salaryMax: '7000',
      reason: 'New headcount',
      justification: '',
      minEducation: "Bachelor's degree",
      fieldOfStudy: 'e.g. Human Resource Management, Business',
      minExperience: 'Fresh graduate (0 yrs)',
      languageRequirement: 'English only',
      skills: ['HRBP', 'Labour law (MY)', 'Performance mgmt'],
      newSkillInput: '',
      responsibilities: '• Partner with department heads on workforce planning\n• Lead end-to-end recruitment for assigned departments\n• Manage employee relations and grievance handling',
      niceToHave: '',
      channels: {
        internal: true,
        jobstreet: true,
        linkedin: true,
        indeed: false,
        agency: false,
      },
      notifySubmit: true,
      notifyAction: true,
      autoPublish: true,
      notifyHrTeam: false,
      primaryRecruiter: 'Maya Tan (HR Executive)',
      hiringManager: 'Nina Reza (Head of HR)',
    });
  };

  const handleCreatePosting = (e: FormEvent) => {
    e.preventDefault();
    const posTitle = newPost.position || 'New Position';
    const post: JobPosting = {
      id: `POST-00${postings.length + 1}`,
      position: posTitle,
      channel: newPost.channel,
      views: 120,
      applicants: 0,
      status: 'Live',
      department: 'HR',
    };

    setPostings([post, ...postings]);
    setPostingModalOpen(false);
    addToast(`Job posting active on ${newPost.channel} for ${posTitle}!`, 'success');
  };

  const handleCreateCandidate = (e: FormEvent) => {
    e.preventDefault();
    if (!newCand.name) return;

    const cand: Candidate = {
      id: `CAND-0${10 + candidates.length}`,
      name: newCand.name,
      experience: newCand.experience,
      education: newCand.education,
      source: newCand.source,
      matchScore: `${Math.floor(Math.random() * 20) + 80}%`,
      stage: 'Applied',
      appliedDate: 'Today',
      positionApplied: newCand.positionApplied,
    };

    setCandidates([cand, ...candidates]);
    setCandidateModalOpen(false);
    addToast(`${cand.name} entered as applicant for ${cand.positionApplied}`, 'success');
    setNewCand({
      name: '',
      experience: '3 yrs',
      education: 'Bachelor Degree',
      source: 'LinkedIn',
      matchScore: '89%',
      stage: 'Applied',
      positionApplied: 'HR Business Partner',
    });
  };

  const handleScheduleInterview = (e: FormEvent) => {
    e.preventDefault();
    const cand = candidates.find(c => c.id === newInt.candidateId) || candidates[0];
    const item: Interview = {
      id: `INT-0${interviews.length + 1}`,
      candidateName: cand.name,
      position: cand.positionApplied,
      stage: newInt.stage.replace(' interview', '').replace(' screening', ''),
      date: newInt.date,
      time: newInt.time,
      format: newInt.format,
      status: 'Confirmed',
    };

    setInterviews([item, ...interviews]);
    setInterviewModalOpen(false);
    addToast(`Interview booked for ${cand.name} (${item.time})`, 'success');
  };

  const handleSendOfferForm = (e: FormEvent) => {
    e.preventDefault();
    if (!newOffer.candidateName) return;

    const item: Offer = {
      id: `OFFER-00${offers.length + 1}`,
      candidateName: newOffer.candidateName,
      position: newOffer.position || 'Recruitment Officer',
      salary: Number(newOffer.salary).toLocaleString(),
      sentDate: 'Today',
      expiryDate: '14 Days From Now',
      status: 'Sent',
      allowance: newOffer.allowance,
      grade: newOffer.grade,
      probation: newOffer.probation,
    };

    setOffers([item, ...offers]);
    setOfferModalOpen(false);
    addToast(`Offer draft delivered to ${newOffer.candidateName}`, 'success');
  };

  const handleChecklistToggle = (itemId: string, field: string) => {
    setPreOnboardings(prev => prev.map(item => {
      if (item.id === itemId) {
        const nextChecklist = {
          ...item.checklist,
          [field]: !((item.checklist as any)[field])
        };
        const docsCount = Object.values(nextChecklist).filter(Boolean).length;
        return {
          ...item,
          checklist: nextChecklist,
          docsReceived: docsCount,
          status: docsCount === 8 ? 'Ready to onboard' : 'Docs pending' as any,
        } as PreOnboarding;
      }
      return item;
    }));
    addToast('Updated pre-onboarding document receipt state', 'info');
  };

  const handleConversionToStaff = (item: PreOnboarding) => {
    // Add employee
    onAddEmployeeAsRecord?.({
      id: `EMP-${Math.floor(Math.random() * 9000) + 1000}`,
      name: item.candidateName,
      department: 'HR',
      position: item.position,
      employmentStatus: 'Permanent',
      status: 'Active',
      joinDate: item.startDate === 'TBD' ? '1 Jul 2026' : item.startDate,
      nric: '980712-14-5555',
      mobile: '+60 12-329 8810',
      email: `${item.candidateName.toLowerCase().replace(/\s+/g, '')}@novora.com`,
      address: 'Central Residence, Kuala Lumpur',
      avatarColor: 'bg-emerald-500',
      dependents: '0',
      emergencyContact: 'Mother - 0123456789',
    });

    setPreOnboardings(prev => prev.filter(p => p.id !== item.id));
    addToast(`Successfully converted ${item.candidateName} to permanent active employee staff!`, 'success');
  };

  // Export report emulator
  const triggerRecruitmentExport = (format: 'Excel' | 'CSV' | 'PDF') => {
    setExportDropdownOpen(false);
    addToast(`Filtering and compiling recruitment master database for format: ${format}...`, 'loading');
    setTimeout(() => {
      addToast(`Recruitment_${activeSubTab.replace(/\s+/g, '_')}.${format === 'Excel' ? 'xlsx' : format.toLowerCase()} has been exported.`, 'success');
    }, 1500);
  };

  // State filtering logic
  const filteredRequisitions = requisitions.filter(item => {
    const matchSearch = item.positionTitle.toLowerCase().includes(searchValue.toLowerCase()) || item.requestedBy.toLowerCase().includes(searchValue.toLowerCase());
    const matchDept = deptFilter === 'All departments' || item.department === deptFilter;
    return matchSearch && matchDept;
  });

  const activePreOnboard = preOnboardings.find(p => p.id === selectedPreOnboardId) || preOnboardings[0];
  const activeOffer = offers.find(o => o.id === selectedOfferId) || offers[0];
  const activeInterview = interviews.find(i => i.id === selectedInterviewId) || interviews[0];

  const subTabs = [
    'Job Requisition',
    'Job Posting',
    'Candidate Pipeline',
    'Interviews',
    'Offer Management',
    'Pre-Onboarding',
    'Reports',
  ];

  return (
    <div id="recruitment-module-stage" className="space-y-6">
      
      {/* 2nd Navigation menu - cleanly merged with top level controls. Removed Novora banner to eliminate redundancy! */}
      <div id="recruitment-unified-navigator" className="flex flex-col xl:flex-row xl:items-center justify-between border-b border-slate-200 pb-4 gap-4 min-w-0">
        
        {/* Concise Sub-navigation Items — scroll horizontally instead of wrapping */}
        <div id="recruitment-navigation-tabs" className="flex items-center gap-1.5 select-none overflow-x-auto flex-1 min-w-0 scrollbar-none pb-1 xl:pb-0">
          {subTabs.map((tab) => {
            const isActive = activeSubTab === tab;
            const isInterviewWithBadge = tab === 'Interviews';
            return (
              <button
                id={`tab-${tab.replace(/\s+/g, '-').toLowerCase()}`}
                key={tab}
                type="button"
                onClick={() => {
                  setActiveSubTab(tab);
                  setSearchValue('');
                }}
                className={`text-xs font-semibold px-4 py-2.5 rounded-xl transition-all relative flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap ${
                  isActive
                    ? 'text-[#2f66e0] bg-[#2f66e0]/8 border border-[#2f66e0]/10 font-bold'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
                }`}
              >
                <span className="whitespace-nowrap">{tab}</span>
                {isInterviewWithBadge && (
                  <span className="bg-[#2f66e0] text-white text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0">
                    5
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#2f66e0] rounded-sm" />
                )}
              </button>
            );
          })}
        </div>

        {/* Professional filters / export actions — fixed width, never wrap label text */}
        <div id="recruitment-top-controls" className="flex items-center gap-3 self-end xl:self-auto relative select-none shrink-0 flex-nowrap">
          
          {/* Department filter selection */}
          <div id="dept-filter-dropdown" className="relative shrink-0">
            <button
              id="dept-filter-btn"
              type="button"
              onClick={() => setDeptDropdownOpen(!deptDropdownOpen)}
              className="inline-flex items-center gap-2 h-9 px-3.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 transition-colors rounded-xl cursor-pointer whitespace-nowrap shrink-0"
            >
              <span className="whitespace-nowrap">{deptFilter}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            </button>

            {deptDropdownOpen && (
              <div id="dept-dropdown-menu" className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-40">
                {['All departments', 'Engineering', 'Finance', 'HR', 'Marketing', 'Operations'].map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => {
                      setDeptFilter(dept);
                      setDeptDropdownOpen(false);
                      addToast(dept === 'All departments' ? 'Showing all department candidates' : `Screening for ${dept} team`, 'info');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-[#2f66e0] transition-colors whitespace-nowrap"
                  >
                    {dept}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Highly Professional, Slick Export Button */}
          <div id="export-actions-dropdown" className="relative shrink-0">
            <button
              id="export-options-btn"
              type="button"
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              className="h-9 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 font-bold text-xs text-slate-700 px-3.5 rounded-xl transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Download className="h-3.5 w-3.5 text-slate-500 shrink-0" />
              <span className="whitespace-nowrap">Export</span>
              <ChevronDown className="h-3 w-3 text-slate-400 shrink-0" />
            </button>

            {exportDropdownOpen && (
              <div id="export-dropdown-items" className="absolute right-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-40">
                <div className="px-3.5 py-1 text-[9.5px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Export Settings
                </div>
                <button
                  id="export-excel-item"
                  type="button"
                  onClick={() => triggerRecruitmentExport('Excel')}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                >
                  <FileSpreadsheet className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Excel Worksheet (.xlsx)</span>
                </button>
                <button
                  id="export-csv-item"
                  type="button"
                  onClick={() => triggerRecruitmentExport('CSV')}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                >
                  <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                  <span>CSV Spreadsheet Table</span>
                </button>
                <button
                  id="export-pdf-item"
                  type="button"
                  onClick={() => triggerRecruitmentExport('PDF')}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
                >
                  <FileText className="h-4 w-4 text-red-500 shrink-0" />
                  <span>PDF Document Portfolio</span>
                </button>
              </div>
            )}
          </div>

          {/* Contextual primary trigger action button */}
          {activeSubTab === 'Job Requisition' && (
            <button
              type="button"
              onClick={() => setRequisitionModalOpen(true)}
              className="h-9 bg-[#2f66e0] hover:opacity-95 text-white font-bold text-xs px-4 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap shrink-0"
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">New Requisition</span>
            </button>
          )}
          {activeSubTab === 'Candidate Pipeline' && (
            <button
              type="button"
              onClick={() => setCandidateModalOpen(true)}
              className="h-9 bg-[#2f66e0] hover:opacity-95 text-white font-bold text-xs px-4 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap shrink-0"
            >
              <UserPlus className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">Add Candidate</span>
            </button>
          )}
          {activeSubTab === 'Interviews' && (
            <button
              type="button"
              onClick={() => setInterviewModalOpen(true)}
              className="h-9 bg-[#2f66e0] hover:opacity-95 text-white font-bold text-xs px-4 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap shrink-0"
            >
              <CalendarDays className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">Schedule Interview</span>
            </button>
          )}
          {activeSubTab === 'Offer Management' && (
            <button
              type="button"
              onClick={() => setOfferModalOpen(true)}
              className="h-9 bg-[#2f66e0] hover:opacity-95 text-white font-bold text-xs px-4 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap shrink-0"
            >
              <Send className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">Create Offer</span>
            </button>
          )}
        </div>
      </div>

      {/* Main dynamic stage render panel */}
      <div id="recruitment-active-tab-board" className="min-h-[460px]">

        {/* 1. JOB REQUISITION TAB */}
        {activeSubTab === 'Job Requisition' && (
          <div className="space-y-6">
            {/* Real Stats Metrics for Requisition screen */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4.5">
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Total Requisitions</span>
                  <p className="text-2xl font-extrabold text-slate-800 mt-1">{requisitions.length}</p>
                </div>
                <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Briefcase className="h-5 w-5" />
                </div>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Active Open Status</span>
                  <p className="text-2xl font-extrabold text-slate-800 mt-1">
                    {requisitions.filter(r => r.status === 'Open' || r.status === 'In review').length}
                  </p>
                </div>
                <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Check className="h-5 w-5" />
                </div>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Filled Positions</span>
                  <p className="text-2xl font-extrabold text-slate-800 mt-1">
                    {requisitions.filter(r => r.status === 'Filled').length}
                  </p>
                </div>
                <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Total Applicants Listed</span>
                  <p className="text-2xl font-extrabold text-[#2f66e0] mt-1">104</p>
                </div>
                <div className="h-10 w-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Requisition Table Search Filter Box */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex items-center justify-between">
              <div className="relative w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search position titles, requesters..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-700 outline-none focus:border-slate-300 focus:bg-white transition-all"
                />
              </div>
              <p className="text-[11px] font-bold text-slate-400">
                Found {filteredRequisitions.length} requisition records template
              </p>
            </div>

            {/* Clean, High-Contrast Table of Job Requisitions (Records) */}
            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-5">ID</th>
                      <th className="py-3 px-5">Position title</th>
                      <th className="py-3 px-5">Department</th>
                      <th className="py-3 px-5">Type</th>
                      <th className="py-3 px-5">Requested by</th>
                      <th className="py-3 px-5">Open date</th>
                      <th className="py-3 px-5">Target fill</th>
                      <th className="py-3 px-5">Applicants</th>
                      <th className="py-3 px-5">Status</th>
                      <th className="py-3 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-700">
                    {filteredRequisitions.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-5 font-mono text-[10.5px] text-slate-400">{req.id}</td>
                        <td className="py-3.5 px-5 font-bold text-slate-900">{req.positionTitle}</td>
                        <td className="py-3.5 px-5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            req.department === 'Engineering' ? 'bg-blue-50 text-blue-600' :
                            req.department === 'HR' ? 'bg-pink-50 text-pink-600' :
                            req.department === 'Finance' ? 'bg-emerald-50 text-emerald-600' :
                            req.department === 'Marketing' ? 'bg-purple-50 text-purple-600' :
                            'bg-orange-50 text-orange-600'
                          }`}>
                            {req.department}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-slate-500">{req.type}</td>
                        <td className="py-3.5 px-5 font-medium">{req.requestedBy}</td>
                        <td className="py-3.5 px-5 text-slate-500">{req.openDate}</td>
                        <td className="py-3.5 px-5 text-rose-500 font-bold">{req.targetFill}</td>
                        <td className="py-3.5 px-5">
                          <span className="text-blue-600 underline font-bold cursor-pointer" onClick={() => { setActiveSubTab('Candidate pipeline'); }}>
                            {req.applicants}
                          </span>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            req.status === 'Open' ? 'bg-emerald-50 text-emerald-600' :
                            req.status === 'In review' ? 'bg-blue-50 text-blue-600' :
                            req.status === 'Filled' ? 'bg-slate-100 text-slate-400 line-through' :
                            req.status === 'On hold' ? 'bg-amber-50 text-amber-600' :
                            'bg-rose-50 text-rose-600'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          <button
                            onClick={() => addToast(`Reviewing full folder for ${req.positionTitle}`, 'info')}
                            className="bg-slate-50 hover:bg-[#2f66e0]/10 hover:text-[#2f66e0] transition-colors border border-slate-100 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 ml-auto text-slate-600 cursor-pointer"
                          >
                            <Eye className="h-3 w-3 shrink-0" />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredRequisitions.length === 0 && (
                      <tr>
                        <td colSpan={10} className="py-10 text-center text-slate-400 font-medium italic">
                          No requisitions match your filter criteria or search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. JOB POSTING TAB */}
        {activeSubTab === 'Job Posting' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left side 7cols: Active Job Postings (Records) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Active postings template records</h3>
                    <p className="text-[11px] text-slate-400 font-semibold mt-1">
                      Published channels linked to applicant counts
                    </p>
                  </div>
                  <span className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span>8 Live</span>
                  </span>
                </div>

                <div className="space-y-3.5">
                  {postings.map(post => (
                    <div key={post.id} className="flex items-center justify-between bg-slate-50/60 hover:bg-slate-50 border border-slate-100 rounded-2xl p-4 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-xs select-none">
                          {post.channel[0]}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">{post.position}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{post.channel} portal</span>
                            <span className="text-[10px] font-bold text-slate-300">&bull;</span>
                            <span className="text-[10px] font-semibold text-slate-500">{post.views.toLocaleString()} impressions</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-5">
                        <div className="text-right">
                          <div className="text-xs font-bold text-[#2f66e0]">{post.applicants} applicants</div>
                          <span className="text-[9.5px] font-bold text-slate-400">YTD volume</span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          post.status === 'Live' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {post.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side 5cols: Breakdown metrics */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
                <div className="border-b border-slate-50 pb-3 mb-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Applicant source breakdown %</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                      <span>JobStreet.com</span>
                      <span className="text-slate-900">62 applicants (45%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: '45%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                      <span>LinkedIn Jobs</span>
                      <span className="text-slate-900">33 applicants (28%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#2f66e0] h-full rounded-full" style={{ width: '28%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                      <span>Internal Referral Portal</span>
                      <span className="text-slate-900">26 applicants (16%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '16%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                      <span>Website careers page</span>
                      <span className="text-slate-900">14 applicants (9%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '9%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                      <span>Recruitment Agency partners</span>
                      <span className="text-slate-900">12 applicants (2%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: '2%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 3. CANDIDATE PIPELINE TAB */}
        {activeSubTab === 'Candidate Pipeline' && (
          <div className="space-y-5">
            {/* Filter controls bar */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div id="position-dropdown" className="relative">
                  <button className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer whitespace-nowrap shrink-0">
                    <span>Position: HR Business Partner</span>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  </button>
                </div>
                <div id="source-dropdown" className="relative">
                  <button className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer whitespace-nowrap shrink-0">
                    <span>All sources</span>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  </button>
                </div>
              </div>

              <div className="relative w-64">
                <Search className="absolute left-3 top-2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search candidate name..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-750 outline-none focus:border-slate-300 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Kanban layout stage structure */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
              {(['Applied', 'Screening', 'Phone interview', 'Panel interview', 'Offer', 'Hired'] as const).map(stage => {
                const stageList = candidates.filter(c => c.stage === stage && c.name.toLowerCase().includes(searchValue.toLowerCase()));
                return (
                  <div key={stage} className="min-w-[210px] bg-white hover:bg-slate-50/40 border border-slate-100 rounded-2xl p-3.5 space-y-3.5 transition-colors">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                      <span className="text-xs font-bold text-slate-600">{stage}</span>
                      <span className="bg-slate-100 text-slate-600 rounded-full h-5 w-5 flex items-center justify-center text-[10px] font-bold">
                        {stageList.length}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {stageList.map(item => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedCandidateId(item.id);
                            addToast(`Inspecting application file: ${item.name}`, 'info');
                          }}
                          className={`border rounded-xl p-3 cursor-pointer transition-all ${
                            selectedCandidateId === item.id
                              ? 'border-[#2f66e0] bg-[#2f66e0]/5 shadow-xs'
                              : 'border-slate-100 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="font-bold text-xs text-slate-800">{item.name}</div>
                          <div className="text-[10px] font-medium text-slate-400 mt-0.5">
                            {item.experience} &bull; {item.education}
                          </div>

                          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100/70">
                            <span className="bg-slate-100 text-slate-500 font-bold text-[9px] px-2 py-0.5 rounded-full">
                              {item.source}
                            </span>
                            <span className="text-[10.5px] font-extrabold text-emerald-600">
                              {item.matchScore}
                            </span>
                          </div>
                        </div>
                      ))}
                      {stageList.length === 0 && (
                        <div className="py-8 text-center text-slate-400 font-medium text-[10.5px] italic">
                          No candidates
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. INTERVIEWS TAB */}
        {activeSubTab === 'Interviews' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* Left Box 7cols - Upcoming records */}
            <div className="xl:col-span-7 space-y-5">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 font-sans">Upcoming interviews list</h3>
                    <p className="text-[11px] text-slate-400 font-semibold mt-1">Confirmed slots pending logs</p>
                  </div>
                  <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    5 upcoming today
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="pb-3.5 font-bold">Candidate</th>
                        <th className="pb-3.5 font-bold">Stage</th>
                        <th className="pb-3.5 font-bold">Date / Time</th>
                        <th className="pb-3.5 font-bold">Format</th>
                        <th className="pb-3.5 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-700">
                      {interviews.map(item => (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedInterviewId(item.id)}
                          className={`hover:bg-slate-50/70 transition-colors cursor-pointer ${
                            selectedInterviewId === item.id ? 'bg-indigo-50/20 font-bold' : ''
                          }`}
                        >
                          <td className="py-3 px-1">
                            <span className="font-bold text-slate-900 block">{item.candidateName}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{item.position}</span>
                          </td>
                          <td className="py-3 px-1">{item.stage}</td>
                          <td className="py-3 px-1">
                            <span className="block">{item.date}</span>
                            <span className="text-[10px] text-slate-400 block font-normal">{item.time}</span>
                          </td>
                          <td className="py-3 px-1">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.format === 'In person' ? 'bg-orange-50 text-orange-600' :
                              item.format === 'Phone' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                            }`}>
                              {item.format}
                            </span>
                          </td>
                          <td className="py-3 px-1">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              item.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' :
                              item.status === 'No show' ? 'bg-red-50 text-red-650' : 'bg-amber-50 text-amber-600'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Box 5cols - Core Scorecard Review */}
            <div className="xl:col-span-5 space-y-6">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Interview scorecard review</h3>
                  <span className="text-[11.5px] font-bold text-[#2f66e0]">Panel rating</span>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-extrabold text-slate-800">{activeInterview?.candidateName || 'Lena Wong'}</div>
                  <div className="text-xs font-bold text-slate-400 mt-1">{activeInterview?.position || 'HR Business Partner'}</div>
                </div>

                <div className="space-y-3.5 border-t border-slate-50 pt-4 mb-5">
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                      <span>Communication skills</span>
                      <span>90%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: '90%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                      <span>HR knowledge & expertise</span>
                      <span>95%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '95%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                      <span>Analytical problem solving</span>
                      <span>88%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: '88%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                      <span>Culture fit alignment</span>
                      <span>92%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                      <span>Leadership indicators</span>
                      <span>80%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-orange-500 h-full rounded-full" style={{ width: '80%' }} />
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Panel recommendation</span>
                    <span className="text-xs font-bold text-slate-800 block mt-0.5">Proceed to contract offer</span>
                  </div>
                  <span className="bg-emerald-500 text-white rounded-full p-1.5">
                    <Check className="h-4.5 w-4.5 font-bold" />
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 5. OFFER MANAGEMENT TAB */}
        {activeSubTab === 'Offer Management' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* Left box 7cols: Offer list tracking */}
            <div className="xl:col-span-7 space-y-5">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
                <div className="border-b border-slate-50 pb-4 mb-4">
                  <h3 className="text-sm font-bold text-slate-800 font-sans">Corporate offer tracker</h3>
                  <p className="text-[11px] text-slate-400 font-semibold mt-1">Pending approval feedback loops</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="pb-3.5">Candidate</th>
                        <th className="pb-3.5">Salary</th>
                        <th className="pb-3.5">Sent date</th>
                        <th className="pb-3.5">Expiry</th>
                        <th className="pb-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-700">
                      {offers.map(item => (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedOfferId(item.id)}
                          className={`hover:bg-slate-50/70 transition-colors cursor-pointer ${
                            selectedOfferId === item.id ? 'bg-indigo-50/20 font-bold' : ''
                          }`}
                        >
                          <td className="py-3 px-1">
                            <span className="font-bold text-slate-900 block">{item.candidateName}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{item.position}</span>
                          </td>
                          <td className="py-3 px-1 font-mono text-slate-600">MYR {item.salary}</td>
                          <td className="py-3 px-1 text-slate-500">{item.sentDate}</td>
                          <td className="py-3 px-1 text-rose-500">{item.expiryDate}</td>
                          <td className="py-3 px-1">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              item.status === 'Sent' ? 'bg-blue-50 text-blue-600' :
                              item.status === 'Accepted' ? 'bg-emerald-50 text-emerald-600' :
                              item.status === 'Declined' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right box 5cols: Stage Progress and Terms Overview */}
            <div className="xl:col-span-5 space-y-6">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Offer workflow status</h3>
                  <span className="bg-amber-50 text-amber-700 text-[10.5px] font-bold px-2 py-0.5 rounded-full">
                    Awaiting accept
                  </span>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-extrabold text-slate-800">{activeOffer?.candidateName || 'Lena Wong'}</div>
                  <div className="text-xs font-bold text-slate-400 mt-1">{activeOffer?.position || 'HR Business Partner'}</div>
                </div>

                {/* Progress flow map */}
                <div className="mb-5 py-2.5 border-t border-b border-dashed border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-3">Workflow state</span>
                  <div className="grid grid-cols-7 gap-1 text-[9.5px] font-extrabold text-center text-slate-400">
                    <span className="text-[#2f66e0]">Applied</span>
                    <span className="text-[#2f66e0]">Screened</span>
                    <span className="text-[#2f66e0]">Phone</span>
                    <span className="text-[#2f66e0]">Panel</span>
                    <span className="text-blue-500 bg-blue-50 border border-blue-100 rounded-sm py-0.5">Offer sent</span>
                    <span>Accepted</span>
                    <span>Hired</span>
                  </div>
                </div>

                {/* Terms Details */}
                <div className="space-y-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 text-xs font-semibold">
                  <div className="flex justify-between items-center border-b border-white pb-2.5">
                    <span className="text-slate-400">Salary Package</span>
                    <span className="text-slate-800 font-bold">MYR {activeOffer?.salary || '6,500'}/mth</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white pb-2.5">
                    <span className="text-slate-400">Fixed Allowance</span>
                    <span className="text-slate-800 font-bold">MYR {activeOffer?.allowance || '650'}/mth</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white pb-2.5">
                    <span className="text-slate-400">Grade Level</span>
                    <span className="text-slate-800 font-mono font-bold text-[11px]">{activeOffer?.grade || 'G-6 / Sub A'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-slate-400">Probation duration</span>
                    <span className="text-slate-800 font-bold">{activeOffer?.probation || '3 months'}</span>
                  </div>
                </div>

                {/* Simulated contract triggers */}
                <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between">
                  <button
                    onClick={() => addToast('Opening generated contract PDF document preview... Ready.', 'success')}
                    className="flex-1 mr-2 px-3.5 py-2 hover:bg-slate-50 text-xs border border-slate-200 text-slate-600 rounded-xl transition-all font-bold cursor-pointer text-center"
                  >
                    Preview PDF letter
                  </button>
                  <button
                    onClick={() => addToast('Resent employment contract via electronic signature link!', 'success')}
                    className="flex-1 bg-[#2f66e0] hover:bg-opacity-95 text-white text-xs px-3.5 py-2 rounded-xl transition-all font-bold cursor-pointer text-center"
                  >
                    Send reminder
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 6. PRE-ONBOARDING TAB */}
        {activeSubTab === 'Pre-Onboarding' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* Left box 7cols: Candidate queue and activity log records */}
            <div className="xl:col-span-7 space-y-6">
              {/* Onboarding queue */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
                <div className="border-b border-slate-50 pb-4 mb-4">
                  <h3 className="text-sm font-bold text-slate-800">Pre-onboarding queue list</h3>
                  <p className="text-[11px] text-slate-400 font-semibold mt-1">Checklist progress logs for verified candidates</p>
                </div>

                <div className="space-y-3.5">
                  {preOnboardings.map(item => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedPreOnboardId(item.id)}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                        selectedPreOnboardId === item.id
                          ? 'border-[#2f66e0] bg-[#2f66e0]/5 shadow-xs'
                          : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center text-xs font-bold text-indigo-600">
                          {item.avatar}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">{item.candidateName}</div>
                          <div className="text-[10px] font-semibold text-slate-500 mt-0.5">
                            {item.position} &bull; Start Date: <span className="text-slate-800">{item.startDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-xs font-bold text-[#2f66e0] block">{item.docsReceived}/8 checklist</span>
                          <span className="text-[10px] font-bold text-slate-400 block mt-0.5">docs received</span>
                        </div>
                        
                        <span className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold ${
                          item.status === 'Ready to onboard' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Onboarding Activity log list */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
                <div className="border-b border-slate-50 pb-3 mb-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Onboarding audit logs</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <span className="text-xs font-semibold text-slate-400 w-16 pt-0.5">6 May</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 mt-2" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Employment contract accepted</div>
                      <p className="text-[11px] text-slate-400 font-semibold mt-1">Ahmad Bakri - Operations Lead &bull; Start Date: 2 Jun 2026</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <span className="text-xs font-semibold text-slate-400 w-16 pt-0.5">5 May</span>
                    <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-2" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Document upload request delivered</div>
                      <p className="text-[11px] text-slate-400 font-semibold mt-1">Lena Wong - HR Business Partner &bull; Verification link sent</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <span className="text-xs font-semibold text-slate-400 w-16 pt-0.5">25 Apr</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 mt-2" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">IT Equipment assignment booked</div>
                      <p className="text-[11px] text-slate-400 font-semibold mt-1">Laptop & credentials staged for Operations Lead</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right box 5cols: Document verification list */}
            <div className="xl:col-span-5 space-y-6">
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verification check</h3>
                  <span className="text-[11px] font-bold text-indigo-650">{activePreOnboard?.candidateName || 'Candidate'}</span>
                </div>

                {/* Subchecklist with manual toggles */}
                <div className="mb-5 space-y-3.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Document repository</span>
                  
                  {activePreOnboard ? (
                    Object.entries(activePreOnboard.checklist).map(([key, isChecked]) => {
                      const readableName = key
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, str => str.toUpperCase());
                      return (
                        <div
                          key={key}
                          onClick={() => handleChecklistToggle(activePreOnboard.id, key)}
                          className="flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 p-3 rounded-xl border border-slate-100 cursor-pointer select-none"
                        >
                          <span className="text-xs font-semibold text-slate-700">{readableName}</span>
                          <span className={`h-5 w-5 rounded-md flex items-center justify-center border transition-all ${
                            isChecked ? 'bg-emerald-500 border-transparent text-white' : 'border-slate-300'
                          }`}>
                            {isChecked && <Check className="h-3.5 w-3.5 font-bold" />}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs italic text-slate-400">Select candidate to review checklist</p>
                  )}
                </div>

                {/* System provisioning options checkboxes */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 space-y-3.5">
                  <span className="text-[10px] font-bold text-[#2f66e0] uppercase tracking-wider block">IT & Payroll provisioning triggers</span>
                  
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>Create permanent HRMS employee account</span>
                    <span className="h-5 w-5 rounded bg-emerald-100 border border-emerald-250 text-emerald-600 flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 font-bold" />
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>Provision GSuite email accounts</span>
                    <span className="h-5 w-5 rounded bg-emerald-100 border border-emerald-250 text-emerald-600 flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 font-bold" />
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>Register biometric scans and keycards</span>
                    <span className="h-5 w-5 rounded border border-slate-300 bg-white" />
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>Assign pre-configured laptop asset</span>
                    <span className="h-5 w-5 rounded bg-emerald-100 border border-emerald-250 text-emerald-600 flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 font-bold" />
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>Enrol in monthly banking payroll roster</span>
                    <span className="h-5 w-5 rounded border border-slate-300 bg-white" />
                  </div>
                </div>

                {/* Active Convert Trigger */}
                <button
                  onClick={() => handleConversionToStaff(activePreOnboard)}
                  className="w-full bg-[#2f66e0] hover:bg-opacity-95 text-white font-bold text-xs py-3 rounded-2xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="h-4.5 w-4.5 text-white" />
                  <span>Convert to actual employee staff record</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* 7. REPORTS TAB */}
        {activeSubTab === 'Reports' && (() => {
          const getReportStats = () => {
            const periodMultiplier = reportFilterPeriod === 'Q1 2026' ? 0.85 : reportFilterPeriod === 'Full Year 2025' ? 3.4 : 1.0;
            switch (reportFilterDept) {
              case 'Engineering':
                return {
                  timeToHire: '36 days',
                  timeShift: '↓ 2d vs last year',
                  acceptRate: '74%',
                  costYtd: `MYR ${Math.round(12500 * periodMultiplier).toLocaleString()}`,
                  totalApplicants: `${Math.round(68 * periodMultiplier)} applicants`,
                  open: 5,
                  filled: 2,
                  hold: 1,
                  cancelled: 0,
                  interviews: `${Math.round(18 * periodMultiplier)} loops`,
                  offers: `${Math.round(3 * periodMultiplier)} extended`,
                  signed: `${Math.round(2 * periodMultiplier)} signed`,
                  text: 'Engineering posts require deep technical stack tests.'
                };
              case 'Finance':
                return {
                  timeToHire: '28 days',
                  timeShift: '↓ 4d vs last year',
                  acceptRate: '85%',
                  costYtd: `MYR ${Math.round(4000 * periodMultiplier).toLocaleString()}`,
                  totalApplicants: `${Math.round(22 * periodMultiplier)} applicants`,
                  open: 2,
                  filled: 1,
                  hold: 0,
                  cancelled: 0,
                  interviews: `${Math.round(6 * periodMultiplier)} loops`,
                  offers: `${Math.round(1 * periodMultiplier)} extended`,
                  signed: `${Math.round(1 * periodMultiplier)} signed`,
                  text: 'Finance posts have optimal background review speed.'
                };
              case 'Marketing':
                return {
                  timeToHire: '19 days',
                  timeShift: '↓ 5d vs last year',
                  acceptRate: '80%',
                  costYtd: `MYR ${Math.round(6800 * periodMultiplier).toLocaleString()}`,
                  totalApplicants: `${Math.round(27 * periodMultiplier)} applicants`,
                  open: 2,
                  filled: 1,
                  hold: 1,
                  cancelled: 0,
                  interviews: `${Math.round(6 * periodMultiplier)} loops`,
                  offers: `${Math.round(2 * periodMultiplier)} extended`,
                  signed: `${Math.round(1 * periodMultiplier)} signed`,
                  text: 'Marketing posts target quick interactive trial projects.'
                };
              case 'Operations':
                return {
                  timeToHire: '22 days',
                  timeShift: '↓ 3d vs last year',
                  acceptRate: '88%',
                  costYtd: `MYR ${Math.round(5400 * periodMultiplier).toLocaleString()}`,
                  totalApplicants: `${Math.round(15 * periodMultiplier)} applicants`,
                  open: 2,
                  filled: 1,
                  hold: 0,
                  cancelled: 1,
                  interviews: `${Math.round(5 * periodMultiplier)} loops`,
                  offers: `${Math.round(1 * periodMultiplier)} extended`,
                  signed: `${Math.round(1 * periodMultiplier)} signed`,
                  text: 'Operations are leveraging recruitment agency help.'
                };
              case 'HR':
                return {
                  timeToHire: '25 days',
                  timeShift: '↓ 1d vs last year',
                  acceptRate: '90%',
                  costYtd: `MYR ${Math.round(2500 * periodMultiplier).toLocaleString()}`,
                  totalApplicants: `${Math.round(15 * periodMultiplier)} applicants`,
                  open: 1,
                  filled: 0,
                  hold: 0,
                  cancelled: 0,
                  interviews: `${Math.round(3 * periodMultiplier)} loops`,
                  offers: `${Math.round(1 * periodMultiplier)} extended`,
                  signed: `${Math.round(0 * periodMultiplier)} signed`,
                  text: 'HR entries require cross-evaluation from Nina Reza.'
                };
              default:
                return {
                  timeToHire: '28 days',
                  timeShift: '↓ 4d vs last qtr',
                  acceptRate: '82%',
                  costYtd: `MYR ${Math.round(8400 * periodMultiplier).toLocaleString()}`,
                  totalApplicants: `${Math.round(147 * periodMultiplier)} applicants`,
                  open: 12,
                  filled: 5,
                  hold: 2,
                  cancelled: 1,
                  interviews: `${Math.round(38 * periodMultiplier)} loops`,
                  offers: `${Math.round(5 * periodMultiplier)} extended`,
                  signed: `${Math.round(4 * periodMultiplier)} signed`,
                  text: 'Consolidated Novora recruitment metrics report overview.'
                };
            }
          };

          const stats = getReportStats();

          const detailedRows = [
            {
              reqId: 'REQ-2026-001',
              position: 'HR Business Partner',
              dept: 'HR',
              recruiter: 'Maya Tan',
              spent: 'MYR 2,400',
              timeToClose: '25 days',
              funnel: { applied: 45, screened: 22, interview: 8, offer: 2, hired: 1 },
              status: 'Completed',
              period: 'Q2 2026'
            },
            {
              reqId: 'REQ-2026-002',
              position: 'Senior Back-End Engineer (Node.js)',
              dept: 'Engineering',
              recruiter: 'Maya Tan',
              spent: 'MYR 5,100',
              timeToClose: '38 days',
              funnel: { applied: 78, screened: 45, interview: 12, offer: 3, hired: 1 },
              status: 'Completed',
              period: 'Q2 2026'
            },
            {
              reqId: 'REQ-2026-003',
              position: 'Finance Administrative Executive',
              dept: 'Finance',
              recruiter: 'Zainal Abidin',
              spent: 'MYR 1,500',
              timeToClose: '28 days',
              funnel: { applied: 22, screened: 10, interview: 4, offer: 1, hired: 1 },
              status: 'Completed',
              period: 'Q2 2026'
            },
            {
              reqId: 'REQ-2026-004',
              position: 'Marketing & Brand Specialist',
              dept: 'Marketing',
              recruiter: 'Maya Tan',
              spent: 'MYR 3,200',
              timeToClose: '19 days',
              funnel: { applied: 35, screened: 18, interview: 6, offer: 2, hired: 1 },
              status: 'Completed',
              period: 'Q2 2026'
            },
            {
              reqId: 'REQ-2026-005',
              position: 'Full-Stack Developer (React & Go)',
              dept: 'Engineering',
              recruiter: 'Zainal Abidin',
              spent: 'MYR 4,600',
              timeToClose: '34 days',
              funnel: { applied: 54, screened: 24, interview: 10, offer: 2, hired: 1 },
              status: 'Completed',
              period: 'Q1 2026'
            },
            {
              reqId: 'REQ-2026-006',
              position: 'Operations Support Supervisor',
              dept: 'Operations',
              recruiter: 'Maya Tan',
              spent: 'MYR 2,100',
              timeToClose: '22 days',
              funnel: { applied: 19, screened: 8, interview: 3, offer: 1, hired: 1 },
              status: 'Completed',
              period: 'Q1 2026'
            },
            {
              reqId: 'REQ-2025-090',
              position: 'Director of Platform Infrastructure',
              dept: 'Engineering',
              recruiter: 'Zainal Abidin',
              spent: 'MYR 12,500',
              timeToClose: '45 days',
              funnel: { applied: 92, screened: 35, interview: 15, offer: 2, hired: 1 },
              status: 'Completed',
              period: 'Full Year 2025'
            },
            {
              reqId: 'REQ-2025-095',
              position: 'Senior Payroll Specialist',
              dept: 'Finance',
              recruiter: 'Maya Tan',
              spent: 'MYR 3,800',
              timeToClose: '30 days',
              funnel: { applied: 28, screened: 12, interview: 5, offer: 2, hired: 1 },
              status: 'Completed',
              period: 'Full Year 2025'
            },
            {
              reqId: 'REQ-2026-007',
              position: 'Compensation & Benefits Associate',
              dept: 'HR',
              recruiter: 'Zainal Abidin',
              spent: 'MYR 800',
              timeToClose: 'Pending',
              funnel: { applied: 11, screened: 4, interview: 1, offer: 0, hired: 0 },
              status: 'In Progress',
              period: 'Q2 2026'
            },
          ];

          const filteredDetailedRows = detailedRows.filter(row => {
            const matchesDept = reportFilterDept === 'All departments' || row.dept === reportFilterDept;
            const matchesPeriod = row.period === reportFilterPeriod;
            const matchesSearch = reportSearchQuery.trim() === '' || 
              row.position.toLowerCase().includes(reportSearchQuery.toLowerCase()) ||
              row.reqId.toLowerCase().includes(reportSearchQuery.toLowerCase()) ||
              row.recruiter.toLowerCase().includes(reportSearchQuery.toLowerCase()) ||
              row.dept.toLowerCase().includes(reportSearchQuery.toLowerCase());
            return matchesDept && matchesPeriod && matchesSearch;
          });

          return (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Reports interactive filtering bar */}
              <div className="bg-slate-50 border border-slate-100 p-4.5 rounded-3xl flex flex-col sm:flex-row gap-4 items-center justify-between shadow-xs">
                
                {/* Left controls */}
                <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
                  
                  {/* Select Department filter */}
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Analytical sector</span>
                    <select
                      value={reportFilterDept}
                      onChange={(e) => {
                        setReportFilterDept(e.target.value);
                        addToast(`Refocused recruitment reports for: ${e.target.value}`, 'info');
                      }}
                      className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-bold outline-none cursor-pointer"
                    >
                      <option value="All departments">All Departments &bull; Consolidated</option>
                      <option value="Engineering">Engineering Team</option>
                      <option value="Finance">Finance Department</option>
                      <option value="Marketing">Marketing &amp; Brand</option>
                      <option value="Operations">Operations Roster</option>
                      <option value="HR">Human Resources</option>
                    </select>
                  </div>

                  {/* Select Period filter */}
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reporting Period</span>
                    <select
                      value={reportFilterPeriod}
                      onChange={(e) => {
                        setReportFilterPeriod(e.target.value);
                        addToast(`Report timeframe adjusted to: ${e.target.value}`, 'info');
                      }}
                      className="bg-white border border-slate-200 hover:border-slate-355 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-bold outline-none cursor-pointer font-sans"
                    >
                      <option value="Q2 2026">Q2 2026 (1 Apr - 30 Jun)</option>
                      <option value="Q1 2026">Q1 2026 (1 Jan - 31 Mar)</option>
                      <option value="Full Year 2025">Full Year 2025 (Jan - Dec)</option>
                    </select>
                  </div>

                </div>

                {/* Right controls: Print and CSV Download */}
                <div className="flex items-center gap-2.5 w-full sm:w-auto sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200">
                  <button
                    onClick={() => addToast('Successfully compiled recruitment tabular report logs to recruitment_data_sheet.csv', 'success')}
                    className="flex-1 sm:flex-initial bg-white hover:bg-slate-50 text-[11px] font-bold text-slate-600 px-3.5 py-2 rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5 text-slate-500" />
                    <span>Download Excel</span>
                  </button>
                  <button
                    onClick={() => {
                      addToast('Prepping system print screen layouts... Sending file command to Printer spool', 'loading');
                      setTimeout(() => addToast('Executive Recruitment summary logged inside print drawer!', 'success'), 1200);
                    }}
                    className="flex-1 sm:flex-initial bg-[#2f66e0] hover:bg-opacity-95 text-[11px] font-extrabold text-white px-3.5 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Print Executive Summary</span>
                  </button>
                </div>

              </div>
              
              {/* Upper Metric Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-10 w-10 bg-blue-50/40 rounded-bl-3xl flex items-center justify-center">
                    <Clock className="h-4 w-4 text-blue-500" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">Avg. Time to Close</span>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="text-3xl font-black text-slate-800">{stats.timeToHire}</span>
                    <span className="text-[11px] font-bold text-emerald-500">{stats.timeShift}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1.5 italic">Duration from approved REQ to candidate signed contract</p>
                </div>

                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-10 w-10 bg-indigo-50/40 rounded-bl-3xl flex items-center justify-center">
                    <Percent className="h-4 w-4 text-indigo-500" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">Offer Acceptance Rate</span>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="text-3xl font-black text-slate-800">{stats.acceptRate}</span>
                    <span className="text-[11px] font-bold text-emerald-500">↑ 8% from last qtr</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1.5 italic">Percent of extended contract offer packets signed by talent</p>
                </div>

                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-10 w-10 bg-emerald-50/40 rounded-bl-3xl flex items-center justify-center">
                    <Coins className="h-4 w-4 text-emerald-500" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">Recruitment Cost YTD</span>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="text-3xl font-black text-[#2f66e0]">{stats.costYtd}</span>
                    <span className="text-xs font-semibold text-slate-400">Total channel spend</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1.5 italic">Jobboard credits + external recruitment agency payouts</p>
                </div>

              </div>

              {/* Split visuals */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                
                {/* Left Column 6cols: Conversion rate & Cost split */}
                <div className="xl:col-span-6 space-y-6">
                  
                  {/* Pipeline conversion rate */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
                    <div className="border-b border-slate-50 pb-3 mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Candidate conversion waterfall %</h3>
                        <span className="text-[10px] text-slate-405 font-bold italic mt-0.5 block">{stats.text}</span>
                      </div>
                      <span className="text-[11px] font-bold text-[#2f66e0] bg-blue-50 px-2.5 py-1 rounded-full">{stats.totalApplicants}</span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                          <span>Applied &rarr; Screen Match</span>
                          <span className="text-[#2f66e0]">68% matched</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-[#2f66e0] h-full" style={{ width: '68%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                          <span>Screened &rarr; Phone Scheduled</span>
                          <span className="text-indigo-600 font-bold">55% advanced</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full" style={{ width: '55%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                          <span>Phone scheduled &rarr; Board Panel Interview</span>
                          <span className="text-purple-600 font-bold">40% approved</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-purple-500 h-full" style={{ width: '40%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                          <span>Panel approved &rarr; Extended Contract Offer</span>
                          <span className="text-amber-600 font-bold">35% recommended</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full" style={{ width: '35%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                          <span>Contract Offer &rarr; Ultimate Hired / Starter</span>
                          <span className="text-emerald-600 font-bold">{stats.acceptRate} accepts offer terms</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full" style={{ width: stats.acceptRate }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recruitment Cost by source */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
                    <div className="border-b border-slate-50 pb-3 mb-4">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Recruitment cost distribution by channel</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                          <span>JobStreet job ads credits</span>
                          <span>MYR 4,620</span>
                        </div>
                        <div className="w-full bg-slate-100/50 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full" style={{ width: '55%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                          <span>LinkedIn advertising search campaigns</span>
                          <span>MYR 2,520</span>
                        </div>
                        <div className="w-full bg-slate-100/50 h-2 rounded-full overflow-hidden">
                          <div className="bg-[#2f66e0] h-full" style={{ width: '30%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                          <span>Partner Agency consultant commissions</span>
                          <span>MYR 1,260</span>
                        </div>
                        <div className="w-full bg-slate-100/50 h-2 rounded-full overflow-hidden">
                          <div className="bg-orange-500 h-full" style={{ width: '15%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column 6cols: Requisition status summary & Time to hire by dept */}
                <div className="xl:col-span-6 space-y-6">
                  
                  {/* Requisition status summary table list */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs font-semibold">
                    <div className="border-b border-slate-50 pb-3 mb-4 flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-sans">Requisition pipeline activity snapshot</h3>
                      <span className="text-[10px] font-bold text-slate-400">Sector: {reportFilterDept}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Open requisitions</span>
                        <span className="text-xl font-extrabold text-blue-600 mt-0.5 block">{stats.open}</span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Filled this quarter</span>
                        <span className="text-xl font-extrabold text-emerald-600 mt-0.5 block">{stats.filled}</span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">On hold status</span>
                        <span className="text-xl font-extrabold text-amber-600 mt-0.5 block">{stats.hold}</span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Cancelled requirements</span>
                        <span className="text-xl font-extrabold text-rose-600 mt-0.5 block">{stats.cancelled}</span>
                      </div>
                    </div>

                    <div className="mt-4.5 pt-4.5 border-t border-slate-100 space-y-3 font-semibold text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>Total applicants mapped</span>
                        <span className="text-slate-800 font-bold">{stats.totalApplicants}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Panel evaluations conducted</span>
                        <span className="text-slate-800 font-bold">{stats.interviews}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Contract offer envelopes extended</span>
                        <span className="text-slate-800 font-bold">{stats.offers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Employment offers signed &amp; closed</span>
                        <span className="text-emerald-600 font-extrabold">{stats.signed}</span>
                      </div>
                    </div>
                  </div>

                  {/* Avg time to hire by department */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
                    <div className="border-b border-slate-50 pb-3 mb-4">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Average position filling speed by department (days)</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                          <span>Engineering Team</span>
                          <span className="text-slate-800 font-bold">36 days</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className={`h-full ${reportFilterDept === 'Engineering' ? 'bg-[#2f66e0]' : 'bg-slate-450'}`} style={{ width: '80%', backgroundColor: reportFilterDept === 'Engineering' ? '#2f66e0' : '#94a3b8' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                          <span>Finance Department</span>
                          <span className="text-slate-800 font-bold">28 days</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className={`h-full ${reportFilterDept === 'Finance' ? 'bg-indigo-600' : 'bg-slate-450'}`} style={{ width: '62%', backgroundColor: reportFilterDept === 'Finance' ? '#4f46e5' : '#94a3b8' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                          <span>Human Resources Team</span>
                          <span className="text-slate-800 font-bold">25 days</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className={`h-full ${reportFilterDept === 'HR' ? 'bg-purple-600' : 'bg-slate-450'}`} style={{ width: '55%', backgroundColor: reportFilterDept === 'HR' ? '#9333ea' : '#94a3b8' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                          <span>Operations Roster</span>
                          <span className="text-slate-800 font-bold">22 days</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className={`h-full ${reportFilterDept === 'Operations' ? 'bg-orange-600' : 'bg-slate-450'}`} style={{ width: '48%', backgroundColor: reportFilterDept === 'Operations' ? '#ea580c' : '#94a3b8' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                          <span>Marketing Department</span>
                          <span className="text-slate-800 font-bold">19 days</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className={`h-full ${reportFilterDept === 'Marketing' ? 'bg-[#2f66e0]' : 'bg-slate-450'}`} style={{ width: '42%', backgroundColor: reportFilterDept === 'Marketing' ? '#e11d48' : '#94a3b8' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* ---------------- DEEPLY DETAILED RECRUITMENT AUDITING TABLE ---------------- */}
              <div id="recruitment-detailed-report-card" className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Analytical Record-Level Recruitment Log</h3>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                      Granular requisition funnel metrics, marketing channel budgets, and precise closure times
                    </p>
                  </div>
                  
                  {/* Local report search query term */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={reportSearchQuery}
                        onChange={(e) => setReportSearchQuery(e.target.value)}
                        placeholder="Search role, REQ, recruiter..."
                        className="bg-slate-50 border border-slate-200 focus:border-slate-300 rounded-xl pl-8.5 pr-7 py-1.5 text-xs font-semibold text-slate-700 outline-none w-56"
                      />
                      {reportSearchQuery && (
                        <button
                          onClick={() => setReportSearchQuery('')}
                          className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 font-bold text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        addToast(`Exported detailed tabular ledger for ${filteredDetailedRows.length} requisitions to Excel`, 'success');
                      }}
                      className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="h-3 w-3" />
                      <span>Export Ledger</span>
                    </button>
                  </div>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4.5">Req Code</th>
                        <th className="py-3 px-4.5">Job Position &amp; Sector</th>
                        <th className="py-3 px-4.5">Lead Recruiter</th>
                        <th className="py-3 px-4.5 text-center">Conversion Funnel Stages (A &rarr; S &rarr; I &rarr; O &rarr; H)</th>
                        <th className="py-3 px-4.5 text-right">Channel Spend</th>
                        <th className="py-3 px-4.5 text-right flex justify-end gap-1 items-center"><Clock className="w-3 h-3 text-slate-400" /> <span>Cycle Time</span></th>
                        <th className="py-3 px-4.5 text-center">Auditing Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-600">
                      {filteredDetailedRows.map((row) => (
                        <tr key={row.reqId} className="hover:bg-slate-50/30 transition-colors">
                          <td className="py-3.5 px-4.5 text-slate-450 font-mono text-[11px]">{row.reqId}</td>
                          <td className="py-3.5 px-4.5">
                            <span className="text-slate-800 font-bold block">{row.position}</span>
                            <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">{row.dept} department</span>
                          </td>
                          <td className="py-3.5 px-4.5 text-slate-700 font-bold">{row.recruiter}</td>
                          <td className="py-3.5 px-4.5">
                            <div className="flex items-center justify-center">
                              {/* Modular stages path sequence with interactive details */}
                              <div className="flex items-center gap-1 text-[10.5px]">
                                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-extrabold" title="Total applicants who applied">
                                  {row.funnel.applied} <span className="text-[9px] font-medium text-slate-400">A</span>
                                </span>
                                <span className="text-slate-200 font-normal">&rarr;</span>
                                <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-extrabold" title="Applicants selected on profile review screening matching">
                                  {row.funnel.screened} <span className="text-[9px] font-medium text-blue-300">S</span>
                                </span>
                                <span className="text-slate-200 font-normal">&rarr;</span>
                                <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded-md font-extrabold" title="Interview panels or cognitive sessions run">
                                  {row.funnel.interview} <span className="text-[9px] font-medium text-purple-300">I</span>
                                </span>
                                <span className="text-slate-200 font-normal">&rarr;</span>
                                <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md font-extrabold" title="Formal contract packets extended">
                                  {row.funnel.offer} <span className="text-[9px] font-medium text-amber-400">O</span>
                                </span>
                                <span className="text-slate-200 font-normal">&rarr;</span>
                                <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md font-extrabold" title="Ultimate candidate signed status starters">
                                  {row.funnel.hired} <span className="text-[9px] font-medium text-emerald-400">H</span>
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4.5 text-right text-slate-800 font-bold">{row.spent}</td>
                          <td className="py-3.5 px-4.5 text-right font-extrabold text-slate-700">{row.timeToClose}</td>
                          <td className="py-3.5 px-4.5 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-[9.5px] font-bold ${
                              row.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600 animate-pulse'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {filteredDetailedRows.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400 italic font-semibold">
                            No detailed recruitment accounts fit current category filters {"'"}
                            {reportFilterDept}
                            {"'"} matched inside period {"'"}
                            {reportFilterPeriod}
                            {"'"}.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Footnote details validation integrity */}
                <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 font-semibold pt-1">
                  <span>
                    Displaying {filteredDetailedRows.length} validated recruitment channels breakdown rows.
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 bg-emerald-500 rounded-full inline-block animate-pulse" />
                    <span>Real-time DB Ledger Checked and Synchronized</span>
                  </div>
                </div>
              </div>

            </div>
          );
        })()}

      </div>

      {/* ----------------- MODAL DIALOGS OVERWRITING "EMPTY INITIAL ADD" COMPLAINTS ----------------- */}

      {/* 1. NEW REQUISITION MODAL (3-STEP GRAPHICAL WORKFLOW AS DESIGNED) */}
      {requisitionModalOpen && (
        <div id="new-req-modal-backdrop" className="fixed inset-0 bg-[#070b13]/85 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div id="new-req-modal-panel" className="bg-[#111827] text-border rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-800 overflow-hidden transform animate-in fade-in duration-200 my-8">
            
            {/* Modal Title Banner & Header */}
            <div className="border-b border-slate-850 px-8 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">New job requisition</h2>
                <p className="text-xs text-slate-400 font-semibold mt-1">
                  REQ-2026-0{13 + requisitions.length} &bull; Novora HRMS PTE Ltd
                </p>
              </div>
              <button
                onClick={() => {
                  setRequisitionModalOpen(false);
                  setRequisitionStep(1);
                }}
                className="h-9 w-9 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="text-lg font-bold">✕</span>
              </button>
            </div>

            {/* Step Indicators Ribbon */}
            <div className="px-8 py-5 border-b border-slate-850/60 bg-[#0f1422] flex items-center justify-between select-none text-xs font-bold">
              <div className="flex items-center gap-2.5">
                <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  requisitionStep === 1 
                    ? 'bg-[#2f66e0] text-white' 
                    : 'bg-[#2f66e0]/20 text-[#4f83f2] border border-[#2f66e0]/30'
                }`}>
                  {requisitionStep > 1 ? '✓' : '1'}
                </span>
                <span className={requisitionStep === 1 ? 'text-[#4f83f2] font-semibold' : 'text-slate-400'}>
                  Position details
                </span>
              </div>

              <div className="h-0.5 flex-1 mx-4 bg-slate-800 rounded-full" />

              <div className="flex items-center gap-2.5">
                <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  requisitionStep === 2 
                    ? 'bg-[#2f66e0] text-white' 
                    : requisitionStep > 2 
                    ? 'bg-[#2f66e0]/20 text-[#4f83f2] border border-[#2f66e0]/30' 
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  {requisitionStep > 2 ? '✓' : '2'}
                </span>
                <span className={requisitionStep === 2 ? 'text-[#4f83f2] font-semibold' : 'text-slate-400'}>
                  Requirements &amp; JD
                </span>
              </div>

              <div className="h-0.5 flex-1 mx-4 bg-slate-800 rounded-full" />

              <div className="flex items-center gap-2.5">
                <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  requisitionStep === 3 
                    ? 'bg-[#2f66e0] text-white' 
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  3
                </span>
                <span className={requisitionStep === 3 ? 'text-[#4f83f2] font-semibold' : 'text-slate-400'}>
                  Approval &amp; routing
                </span>
              </div>
            </div>

            {/* Form Fields Dynamic Wrapper */}
            <form onSubmit={(e) => e.preventDefault()} className="p-8">

              {/* STEP 1: POSITION DETAILS SCREEN */}
              {requisitionStep === 1 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  
                  {/* Position Info Heading */}
                  <div>
                    <h3 className="text-xs font-bold text-[#4f83f2] uppercase tracking-wider mb-4">
                      Position Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                      <div>
                        <label className="block text-slate-300 font-bold mb-1.5">Position title *</label>
                        <input
                          type="text"
                          placeholder="e.g. HR Business Partner"
                          value={reqForm.positionTitle}
                          onChange={(e) => setReqForm({ ...reqForm, positionTitle: e.target.value })}
                          className="w-full bg-[#182030] border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] focus:ring-1 focus:ring-[#2f66e0]/50 font-semibold"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-bold mb-1.5">Department *</label>
                        <select
                          value={reqForm.department}
                          onChange={(e) => setReqForm({ ...reqForm, department: e.target.value })}
                          className="w-full bg-[#182030] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] font-semibold"
                        >
                          <option value="HR">Human Resources</option>
                          <option value="Engineering">Engineering</option>
                          <option value="Finance">Finance</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Operations">Operations</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-300 font-bold mb-1.5">Section / team</label>
                        <select
                          value={reqForm.sectionTeam}
                          onChange={(e) => setReqForm({ ...reqForm, sectionTeam: e.target.value })}
                          className="w-full bg-[#182030] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] font-semibold"
                        >
                          <option value="">-- Select section (optional) --</option>
                          <option value="Recruitment">Recruitment &amp; Talent</option>
                          <option value="Operations">HR Operations</option>
                          <option value="CompBen">Compensation &amp; Benefits</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-300 font-bold mb-1.5">Reports to *</label>
                        <select
                          value={reqForm.reportsTo}
                          onChange={(e) => setReqForm({ ...reqForm, reportsTo: e.target.value })}
                          className="w-full bg-[#182030] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] font-semibold"
                        >
                          <option value="Nina Reza (Head of HR)">Nina Reza (Head of HR)</option>
                          <option value="Malik Said (COO)">Malik Said (COO)</option>
                          <option value="Ahmad Wahid (CEO)">Ahmad Wahid (CEO)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Employment Details Section */}
                  <div className="border-t border-slate-850 pt-6">
                    <h3 className="text-xs font-bold text-[#4f83f2] uppercase tracking-wider mb-4">
                      Employment Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                      <div>
                        <label className="block text-slate-300 font-bold mb-1.5">Employment type *</label>
                        <select
                          value={reqForm.employmentType}
                          onChange={(e) => setReqForm({ ...reqForm, employmentType: e.target.value })}
                          className="w-full bg-[#182030] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] font-semibold"
                        >
                          <option value="Permanent">Permanent</option>
                          <option value="Contract">Contract</option>
                          <option value="Temporary">Temporary</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-300 font-bold mb-1.5">Work arrangement</label>
                        <select
                          value={reqForm.workArrangement}
                          onChange={(e) => setReqForm({ ...reqForm, workArrangement: e.target.value })}
                          className="w-full bg-[#182030] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] font-semibold"
                        >
                          <option value="On-site">On-site</option>
                          <option value="Hybrid">Hybrid</option>
                          <option value="Remote">Remote</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-300 font-bold mb-1.5">Job grade</label>
                        <select
                          value={reqForm.jobGrade}
                          onChange={(e) => setReqForm({ ...reqForm, jobGrade: e.target.value })}
                          className="w-full bg-[#182030] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] font-semibold"
                        >
                          <option value="G-5 / Sub B">G-5 / Sub B</option>
                          <option value="G-4 / Senior Executive">G-4 / Senior Executive</option>
                          <option value="G-6 / Director Level">G-6 / Director Level</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-300 font-bold mb-1.5">No. of vacancies *</label>
                        <input
                          type="number"
                          value={reqForm.vacancies}
                          onChange={(e) => setReqForm({ ...reqForm, vacancies: e.target.value })}
                          className="w-full bg-[#182030] border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] font-semibold"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-bold mb-1.5">Target fill date *</label>
                        <input
                          type="text"
                          placeholder="e.g. 13 May 2026"
                          value={reqForm.targetFillDate}
                          onChange={(e) => setReqForm({ ...reqForm, targetFillDate: e.target.value })}
                          className="w-full bg-[#182030] border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] font-semibold"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-bold mb-1.5">Urgency</label>
                        <select
                          value={reqForm.urgency}
                          onChange={(e) => setReqForm({ ...reqForm, urgency: e.target.value })}
                          className="w-full bg-[#182030] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] font-semibold"
                        >
                          <option value="Normal">Normal</option>
                          <option value="Urgent">Urgent</option>
                          <option value="Critical">Immediate / Critical</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-300 font-bold mb-1.5">Salary range &mdash; min (MYR)</label>
                        <input
                          type="text"
                          placeholder="e.g. 5500"
                          value={reqForm.salaryMin}
                          onChange={(e) => setReqForm({ ...reqForm, salaryMin: e.target.value })}
                          className="w-full bg-[#182030] border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-bold mb-1.5">Salary range &mdash; max (MYR)</label>
                        <input
                          type="text"
                          placeholder="e.g. 7000"
                          value={reqForm.salaryMax}
                          onChange={(e) => setReqForm({ ...reqForm, salaryMax: e.target.value })}
                          className="w-full bg-[#182030] border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-bold mb-1.5">Reason for requisition *</label>
                        <select
                          value={reqForm.reason}
                          onChange={(e) => setReqForm({ ...reqForm, reason: e.target.value })}
                          className="w-full bg-[#182030] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] font-semibold"
                        >
                          <option value="New headcount">New headcount</option>
                          <option value="Replacement">Replacement vacancy</option>
                          <option value="Budget expansion">Special budget expansion</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-5 text-xs">
                      <label className="block text-slate-300 font-bold mb-1.5">Justification / notes</label>
                      <textarea
                        rows={3}
                        placeholder="Briefly justify the need for this position..."
                        value={reqForm.justification}
                        onChange={(e) => setReqForm({ ...reqForm, justification: e.target.value })}
                        className="w-full bg-[#182030] border border-slate-800 rounded-xl px-4 py-3 text-slate-100 outline-none focus:border-[#2f66e0] font-semibold"
                      />
                    </div>
                  </div>

                  {/* Step Footer navigation */}
                  <div className="border-t border-slate-850 pt-6 flex items-center justify-between">
                    <span className="text-slate-500 font-bold text-xs">
                      Step 1 of 3 &mdash; Position details
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setRequisitionModalOpen(false);
                          setRequisitionStep(1);
                        }}
                        className="px-5 py-2.5 border border-slate-700 hover:bg-slate-800 rounded-xl text-slate-300 font-bold hover:text-white transition-all text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!reqForm.positionTitle.trim()) {
                            addToast('Please input a valid Position title', 'error');
                            return;
                          }
                          setRequisitionStep(2);
                        }}
                        className="px-6 py-2.5 bg-[#2f66e0] hover:bg-opacity-95 rounded-xl text-white font-bold transition-all text-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Next</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* STEP 2: REQUIREMENTS & JD */}
              {requisitionStep === 2 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  
                  {/* Qualifications Section */}
                  <div>
                    <h3 className="text-xs font-bold text-[#4f83f2] uppercase tracking-wider mb-4">
                      Qualifications
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                      <div>
                        <label className="block text-slate-300 font-bold mb-1.5">Minimum education *</label>
                        <select
                          value={reqForm.minEducation}
                          onChange={(e) => setReqForm({ ...reqForm, minEducation: e.target.value })}
                          className="w-full bg-[#182030] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] font-semibold"
                        >
                          <option value="Bachelor's degree">Bachelor's degree</option>
                          <option value="Diploma">Diploma / Associate's</option>
                          <option value="Master's degree">Master's degree</option>
                          <option value="PhD">PhD / Doctorate</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-300 font-bold mb-1.5">Field of study</label>
                        <input
                          type="text"
                          placeholder="e.g. Human Resource Management, Business"
                          value={reqForm.fieldOfStudy}
                          onChange={(e) => setReqForm({ ...reqForm, fieldOfStudy: e.target.value })}
                          className="w-full bg-[#182030] border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-bold mb-1.5">Minimum experience (years) *</label>
                        <select
                          value={reqForm.minExperience}
                          onChange={(e) => setReqForm({ ...reqForm, minExperience: e.target.value })}
                          className="w-full bg-[#182030] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] font-semibold"
                        >
                          <option value="Fresh graduate (0 yrs)">Fresh graduate (0 yrs)</option>
                          <option value="1-2 yrs">1 &mdash; 2 yrs experience</option>
                          <option value="3-5 yrs">3 &mdash; 5 yrs experience</option>
                          <option value="5+ yrs">5+ yrs senior experience</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-300 font-bold mb-1.5">Language requirement</label>
                        <select
                          value={reqForm.languageRequirement}
                          onChange={(e) => setReqForm({ ...reqForm, languageRequirement: e.target.value })}
                          className="w-full bg-[#182030] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] font-semibold"
                        >
                          <option value="English only">English only</option>
                          <option value="Bilingual English &amp; Malay">Bilingual (English &amp; Malay)</option>
                          <option value="Mandarin highly preferred">Mandarin highly preferred</option>
                          <option value="English, Malay, Mandarin">Trilingual proficient</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Skills Required (badges list + interactive entry) */}
                  <div className="border-t border-slate-850 pt-6">
                    <label className="block text-xs font-bold text-[#4f83f2] uppercase tracking-wider mb-3">
                      Skills Required
                    </label>
                    
                    {/* Active skill tags display */}
                    <div className="flex flex-wrap gap-2 mb-3.5">
                      {reqForm.skills.map((skill) => (
                        <div
                          key={skill}
                          className="bg-[#2f66e0]/15 text-[#4f83f2] border border-[#2f66e0]/25 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-2"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setReqForm({
                                ...reqForm,
                                skills: reqForm.skills.filter((sk) => sk !== skill),
                              });
                            }}
                            className="hover:bg-[#2f66e0]/20 text-blue-400 hover:text-white rounded-md px-1 select-none font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      {reqForm.skills.length === 0 && (
                        <span className="text-slate-500 font-bold italic text-xs">
                          No skill tags associated with this job specifications yet.
                        </span>
                      )}
                    </div>

                    {/* Quick input bar trigger */}
                    <div className="flex items-center gap-3 max-w-lg">
                      <input
                        type="text"
                        placeholder="Type a skill and press Add..."
                        value={reqForm.newSkillInput}
                        onChange={(e) => setReqForm({ ...reqForm, newSkillInput: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (!reqForm.newSkillInput.trim()) return;
                            if (reqForm.skills.includes(reqForm.newSkillInput.trim())) return;
                            setReqForm({
                              ...reqForm,
                              skills: [...reqForm.skills, reqForm.newSkillInput.trim()],
                              newSkillInput: '',
                            });
                          }
                        }}
                        className="flex-1 bg-[#182030] border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-100 outline-none focus:border-[#2f66e0] font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!reqForm.newSkillInput.trim()) return;
                          if (reqForm.skills.includes(reqForm.newSkillInput.trim())) return;
                          setReqForm({
                            ...reqForm,
                            skills: [...reqForm.skills, reqForm.newSkillInput.trim()],
                            newSkillInput: '',
                          });
                        }}
                        className="bg-[#2f66e0]/10 border border-[#2f66e0]/25 text-[#4f83f2] hover:bg-[#2f66e0] hover:text-white transition-all font-bold text-xs px-3.5 py-2 rounded-xl cursor-pointer"
                      >
                        + Add skill
                      </button>
                    </div>
                  </div>

                  {/* Job Description details textarea */}
                  <div className="border-t border-slate-850 pt-6">
                    <h3 className="text-xs font-bold text-[#4f83f2] uppercase tracking-wider mb-4">
                      Job Description
                    </h3>
                    <div className="space-y-4 text-xs">
                      <div>
                        <label className="block text-slate-300 font-bold mb-1.5">Key responsibilities *</label>
                        <textarea
                          rows={4}
                          value={reqForm.responsibilities}
                          onChange={(e) => setReqForm({ ...reqForm, responsibilities: e.target.value })}
                          className="w-full bg-[#182030] border border-slate-800 rounded-xl px-4 py-3 text-slate-100 outline-none focus:border-[#2f66e0] font-mono leading-relaxed font-semibold"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-bold mb-1.5">Nice-to-have / preferred</label>
                        <textarea
                          rows={2}
                          placeholder="Optional additional requirements or preferences..."
                          value={reqForm.niceToHave}
                          onChange={(e) => setReqForm({ ...reqForm, niceToHave: e.target.value })}
                          className="w-full bg-[#182030] border border-slate-800 rounded-xl px-4 py-3 text-slate-100 outline-none focus:border-[#2f66e0] font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Publishing Channels Block */}
                  <div className="border-t border-slate-850 pt-6">
                    <h3 className="text-xs font-bold text-[#4f83f2] uppercase tracking-wider mb-4">
                      Publishing Channels
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-slate-300 font-semibold select-none">
                      <label className="flex items-center gap-3 cursor-pointer bg-[#182030] p-3 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                        <input
                          type="checkbox"
                          checked={reqForm.channels.internal}
                          onChange={(e) => setReqForm({
                            ...reqForm,
                            channels: { ...reqForm.channels, internal: e.target.checked }
                          })}
                          className="h-4.5 w-4.5 text-[#2f66e0] rounded bg-slate-800 border-slate-700 focus:ring-[#2f66e0]"
                        />
                        <span>Internal careers portal</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer bg-[#182030] p-3 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                        <input
                          type="checkbox"
                          checked={reqForm.channels.jobstreet}
                          onChange={(e) => setReqForm({
                            ...reqForm,
                            channels: { ...reqForm.channels, jobstreet: e.target.checked }
                          })}
                          className="h-4.5 w-4.5 text-[#2f66e0] rounded bg-slate-800 border-slate-700 focus:ring-[#2f66e0]"
                        />
                        <span>JobStreet.com</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer bg-[#182030] p-3 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                        <input
                          type="checkbox"
                          checked={reqForm.channels.linkedin}
                          onChange={(e) => setReqForm({
                            ...reqForm,
                            channels: { ...reqForm.channels, linkedin: e.target.checked }
                          })}
                          className="h-4.5 w-4.5 text-[#2f66e0] rounded bg-slate-800 border-slate-700 focus:ring-[#2f66e0]"
                        />
                        <span>LinkedIn Jobs</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer bg-[#182030] p-3 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                        <input
                          type="checkbox"
                          checked={reqForm.channels.indeed}
                          onChange={(e) => setReqForm({
                            ...reqForm,
                            channels: { ...reqForm.channels, indeed: e.target.checked }
                          })}
                          className="h-4.5 w-4.5 text-[#2f66e0] rounded bg-slate-800 border-slate-700 focus:ring-[#2f66e0]"
                        />
                        <span>Indeed</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer bg-[#182030] p-3 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors col-span-1 sm:col-span-2">
                        <input
                          type="checkbox"
                          checked={reqForm.channels.agency}
                          onChange={(e) => setReqForm({
                            ...reqForm,
                            channels: { ...reqForm.channels, agency: e.target.checked }
                          })}
                          className="h-4.5 w-4.5 text-[#2f66e0] rounded bg-slate-800 border-slate-700 focus:ring-[#2f66e0]"
                        />
                        <span>Recruitment agency (Consultant dispatch partners)</span>
                      </label>
                    </div>
                  </div>

                  {/* Step Footer navigation */}
                  <div className="border-t border-slate-850 pt-6 flex items-center justify-between">
                    <span className="text-slate-500 font-bold text-xs flex items-center gap-1.5">
                      Step 2 of 3 &mdash; Requirements &amp; JD
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setRequisitionStep(1)}
                        className="px-5 py-2.5 border border-slate-700 hover:bg-slate-800 rounded-xl text-slate-300 font-bold hover:text-white transition-all text-xs cursor-pointer"
                      >
                        &larr; Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setRequisitionStep(3)}
                        className="px-6 py-2.5 bg-[#2f66e0] hover:bg-opacity-95 rounded-xl text-white font-bold transition-all text-xs cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Next</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* STEP 3: APPROVAL & ROUTING */}
              {requisitionStep === 3 && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  
                  {/* Approval chain flowchart visualization */}
                  <div>
                    <h3 className="text-xs font-bold text-[#4f83f2] uppercase tracking-wider mb-2">
                      Approval Chain
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 mb-4 select-none">
                      Based on the department and job grade selected, the following approval chain has been auto-configured. You may adjust if needed.
                    </p>

                    <div className="space-y-3 font-semibold text-xs text-[#cbd5e1] select-none">
                      
                      {/* Approver 1 */}
                      <div className="bg-[#182030] border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="h-7 w-7 rounded-lg bg-[#2f66e0]/20 text-[#4f83f2] flex items-center justify-center font-bold text-xs border border-[#2f66e0]/40">
                            1
                          </span>
                          <div>
                            <span className="font-extrabold text-white block">Nina Reza</span>
                            <span className="text-[10.5px] text-slate-400 font-bold mt-0.5 block">
                              Head of HR &bull; Direct manager approval
                            </span>
                          </div>
                        </div>
                        <span className="bg-amber-500/10 border border-amber-500/25 text-amber-500 text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
                          Pending
                        </span>
                      </div>

                      {/* Direction flow Arrow index indicator */}
                      <div className="flex justify-center py-0.5">
                        <ChevronRight className="h-4 w-4 text-slate-600 transform rotate-90" />
                      </div>

                      {/* Approver 2 */}
                      <div className="bg-[#182030] border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="h-7 w-7 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-xs border border-slate-700/65">
                            2
                          </span>
                          <div>
                            <span className="font-extrabold text-white block">Ahmad Wahid</span>
                            <span className="text-[10.5px] text-slate-400 font-bold mt-0.5 block">
                              CEO &bull; Final approval (New Headcount budgeting allocation)
                            </span>
                          </div>
                        </div>
                        <span className="bg-slate-800/60 border border-slate-750 text-slate-500 text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider">
                          Waiting
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div className="border-t border-slate-850 pt-6">
                    <h3 className="text-xs font-bold text-[#4f83f2] uppercase tracking-wider mb-4">
                      Notification Settings
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 font-semibold select-none">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={reqForm.notifySubmit}
                          onChange={(e) => setReqForm({ ...reqForm, notifySubmit: e.target.checked })}
                          className="h-4.5 w-4.5 text-[#2f66e0] rounded bg-slate-800 border-slate-700 focus:ring-[#2f66e0]"
                        />
                        <span>Email approvers when requisition is submitted</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={reqForm.notifyAction}
                          onChange={(e) => setReqForm({ ...reqForm, notifyAction: e.target.checked })}
                          className="h-4.5 w-4.5 text-[#2f66e0] rounded bg-slate-800 border-slate-700 focus:ring-[#2f66e0]"
                        />
                        <span>Notify me when each approver acts</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={reqForm.autoPublish}
                          onChange={(e) => setReqForm({ ...reqForm, autoPublish: e.target.checked })}
                          className="h-4.5 w-4.5 text-[#2f66e0] rounded bg-slate-800 border-slate-700 focus:ring-[#2f66e0]"
                        />
                        <span className="text-white font-extrabold">
                          Auto-publish job posting when fully approved *
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={reqForm.notifyHrTeam}
                          onChange={(e) => setReqForm({ ...reqForm, notifyHrTeam: e.target.checked })}
                          className="h-4.5 w-4.5 text-[#2f66e0] rounded bg-slate-800 border-slate-700 focus:ring-[#2f66e0]"
                        />
                        <span>Notify HR team on approval</span>
                      </label>
                    </div>
                  </div>

                  {/* Assign Recruiter */}
                  <div className="border-t border-slate-850 pt-6">
                    <h3 className="text-xs font-bold text-[#4f83f2] uppercase tracking-wider mb-4">
                      Assign Recruiter
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                      <div>
                        <label className="block text-slate-300 font-bold mb-1.5">Primary recruiter *</label>
                        <select
                          value={reqForm.primaryRecruiter}
                          onChange={(e) => setReqForm({ ...reqForm, primaryRecruiter: e.target.value })}
                          className="w-full bg-[#182030] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] font-semibold"
                        >
                          <option value="Maya Tan (HR Executive)">Maya Tan (HR Executive)</option>
                          <option value="Lena Wong (HR Specialist)">Lena Wong (HR Specialist)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-300 font-bold mb-1.5">Hiring manager</label>
                        <select
                          value={reqForm.hiringManager}
                          onChange={(e) => setReqForm({ ...reqForm, hiringManager: e.target.value })}
                          className="w-full bg-[#182030] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] font-semibold"
                        >
                          <option value="Nina Reza (Head of HR)">Nina Reza (Head of HR)</option>
                          <option value="Malik Said (COO)">Malik Said (COO)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Preview Requisition Summary Card */}
                  <div className="bg-[#1c2436] rounded-2xl p-5 border border-slate-800 text-xs">
                    <h4 className="font-extrabold text-[#4f83f2] border-b border-slate-800 pb-2 mb-3 tracking-wide">
                      Requisition summary
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 font-semibold">
                      <div className="flex justify-between md:border-r border-slate-800/50 pr-4">
                        <span className="text-slate-400">Ref. no.</span>
                        <span className="text-slate-200 font-mono">REQ-2026-0{13 + requisitions.length}</span>
                      </div>
                      <div className="flex justify-between pl-0 md:pl-4">
                        <span className="text-slate-400">Position</span>
                        <span className="text-white font-bold">
                          {reqForm.positionTitle || 'HR Business Partner'}
                        </span>
                      </div>
                      <div className="flex justify-between md:border-r border-slate-800/50 pr-4">
                        <span className="text-slate-400">Department</span>
                        <span className="text-slate-200">{reqForm.department}</span>
                      </div>
                      <div className="flex justify-between pl-0 md:pl-4">
                        <span className="text-slate-400">Employment type</span>
                        <span className="text-slate-200">
                          {reqForm.employmentType} &bull; {reqForm.workArrangement}
                        </span>
                      </div>
                      <div className="flex justify-between md:border-r border-slate-800/50 pr-4">
                        <span className="text-slate-400">Salary range</span>
                        <span className="text-white font-bold">
                          MYR {Number(reqForm.salaryMin).toLocaleString()} &mdash; {Number(reqForm.salaryMax).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between pl-0 md:pl-4">
                        <span className="text-slate-400">Target fill</span>
                        <span className="text-rose-400 font-bold">{reqForm.targetFillDate}</span>
                      </div>
                      <div className="flex justify-between col-span-1 md:col-span-2 border-t border-slate-800/40 pt-2.5 mt-1">
                        <span className="text-slate-400">Route map routing</span>
                        <span className="text-[#cbd5e1] font-semibold">
                          {reqForm.hiringManager.split(' ')[0]} (Hiring Mgr) &rarr; Ahmad Wahid (CEO Approval)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Step Footer navigation */}
                  <div className="border-t border-slate-850 pt-6 flex items-center justify-between">
                    <span className="text-slate-500 font-bold text-xs">
                      Step 3 of 3 &mdash; Approval &amp; routing
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setRequisitionStep(2)}
                        className="px-5 py-2.5 border border-slate-700 hover:bg-slate-800 rounded-xl text-slate-300 font-bold hover:text-white transition-all text-xs cursor-pointer"
                      >
                        &larr; Back
                      </button>
                      <button
                        type="button"
                        onClick={handleCreateRequisition}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-bold transition-all text-xs cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        <span>✓ Submit requisition</span>
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </form>
          </div>
        </div>
      )}

      {/* 2. CREATE JOB POSTING MODAL */}
      {postingModalOpen && (
        <div id="new-posting-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-100 overflow-hidden transform animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Publish New Job Posting</h3>
              <button onClick={() => setPostingModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-xs select-none">✕</button>
            </div>
            <form onSubmit={handleCreatePosting} className="p-6 space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Linked Requisition</label>
                  <select
                    value={newPost.linkedReqId}
                    onChange={(e) => {
                      const reqObj = requisitions.find(r => r.id === e.target.value);
                      setNewPost({ ...newPost, linkedReqId: e.target.value, position: reqObj ? reqObj.positionTitle : '' });
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs text-slate-700 outline-none"
                  >
                    <option value="">Select open requisition record</option>
                    {requisitions.map(r => (
                      <option key={r.id} value={r.id}>{r.id} &mdash; {r.positionTitle}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Publish Channel</label>
                  <select
                    value={newPost.channel}
                    onChange={(e) => setNewPost({ ...newPost, channel: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs text-slate-700 outline-none"
                  >
                    <option value="LinkedIn">LinkedIn Jobs</option>
                    <option value="JobStreet">JobStreet.com</option>
                    <option value="Indeed">Indeed</option>
                    <option value="Internal">Internal Careers page</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Job Title on Ads *</label>
                <input
                  type="text"
                  placeholder="e.g. HR Business Partner"
                  value={newPost.position}
                  onChange={(e) => setNewPost({ ...newPost, position: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Salary Range Min *</label>
                  <input
                    type="text"
                    value={newPost.salaryMin}
                    onChange={(e) => setNewPost({ ...newPost, salaryMin: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Salary Range Max *</label>
                  <input
                    type="text"
                    value={newPost.salaryMax}
                    onChange={(e) => setNewPost({ ...newPost, salaryMax: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Job Description Summary</label>
                <textarea
                  rows={2}
                  placeholder="Key responsibilities, benefits, requirements..."
                  value={newPost.description}
                  onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
                />
              </div>

              <div className="border-t border-slate-50 pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setPostingModalOpen(false)}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 text-xs text-slate-600 font-bold py-2.5 rounded-xl border border-slate-200 text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#2f66e0] hover:bg-opacity-95 text-white text-xs font-bold py-2.5 rounded-xl text-center"
                >
                  Publish ad posting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. ADD CANDIDATE MODAL (High Fidelity, Dark-Themed) */}
      {candidateModalOpen && (
        <div id="new-cand-modal-backdrop" className="fixed inset-0 bg-[#070b13]/85 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div id="new-cand-modal-panel" className="bg-[#111827] text-border rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-800 overflow-hidden transform animate-in fade-in duration-200 my-8">
            
            {/* Header */}
            <div className="border-b border-slate-850 px-8 py-5 flex items-center justify-between bg-[#0f1422]">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-[#4f83f2]" />
                  <span>Add New Candidate Profile</span>
                </h2>
                <p className="text-[10.5px] text-slate-400 font-semibold mt-1">
                  Create a manual candidate record &amp; submit to screenings pipeline
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCandidateModalOpen(false)}
                className="h-8 w-8 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="text-base font-bold">✕</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateCandidate} className="p-8 space-y-6">
              
              {/* Block 1: Basic Info */}
              <div>
                <h3 className="text-xs font-bold text-[#4f83f2] uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  <span>Candidate Core Identity</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-300 font-bold mb-1.5">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Jasmine Kaur"
                      value={newCand.name}
                      onChange={(e) => setNewCand({ ...newCand, name: e.target.value })}
                      className="w-full bg-[#182030] border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">Contact Email</label>
                    <input
                      type="email"
                      placeholder="e.g. jasmine.kaur@gmail.com"
                      className="w-full bg-[#182030] border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">Phone Number</label>
                    <input
                      type="text"
                      placeholder="e.g. +60 12-345 6789"
                      className="w-full bg-[#182030] border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Block 2: Experience & Qualifications */}
              <div className="border-t border-slate-850 pt-6">
                <h3 className="text-xs font-bold text-[#4f83f2] uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 animate-pulse" />
                  <span>Professional Credentials</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">Total Relevant Experience</label>
                    <input
                      type="text"
                      placeholder="e.g. 3 yrs"
                      value={newCand.experience}
                      onChange={(e) => setNewCand({ ...newCand, experience: e.target.value })}
                      className="w-full bg-[#182030] border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">Highest Educational Qualification</label>
                    <input
                      type="text"
                      placeholder="e.g. Bachelor Degree"
                      value={newCand.education}
                      onChange={(e) => setNewCand({ ...newCand, education: e.target.value })}
                      className="w-full bg-[#182030] border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Block 3: Applied Specification */}
              <div className="border-t border-slate-850 pt-6">
                <h3 className="text-xs font-bold text-[#4f83f2] uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>Target Specifications</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">Source Channel</label>
                    <select
                      value={newCand.source}
                      onChange={(e) => setNewCand({ ...newCand, source: e.target.value })}
                      className="w-full bg-[#182030] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] transition-all font-semibold"
                    >
                      <option value="LinkedIn">LinkedIn Job Ads</option>
                      <option value="JobStreet">JobStreet Portal</option>
                      <option value="Referral">Internal Employee Referral</option>
                      <option value="Direct">Direct Careers Portal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">Target Job Requisition *</label>
                    <select
                      value={newCand.positionApplied}
                      onChange={(e) => setNewCand({ ...newCand, positionApplied: e.target.value })}
                      className="w-full bg-[#182030] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] transition-all font-semibold"
                    >
                      {requisitions.map(r => (
                        <option key={r.id} value={r.positionTitle}>{r.positionTitle} ({r.id})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">Expected Monthly Salary (MYR)</label>
                    <input
                      type="text"
                      placeholder="e.g. 6,500"
                      className="w-full bg-[#182030] border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1.5">Notice Period</label>
                    <select className="w-full bg-[#182030] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] transition-all font-semibold">
                      <option>Immediate / Available immediately</option>
                      <option>1 month notice</option>
                      <option>2 months notice</option>
                      <option>3 months / buyout requirement</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Block 4: Resume CV Dropzone */}
              <div className="border-t border-slate-850 pt-6">
                <label className="block text-xs font-bold text-[#4f83f2] uppercase tracking-wider mb-2.5">
                  Document Attachments
                </label>
                <div className="border border-dashed border-slate-800 hover:border-[#2f66e0]/40 bg-[#0f1422] rounded-2xl p-6 text-center cursor-pointer transition-all group">
                  <Upload className="h-8 w-8 text-slate-500 group-hover:text-[#4f83f2] mx-auto mb-2 transition-colors" />
                  <p className="text-xs font-bold text-slate-300">Drag &amp; drop Candidate CV/Resume PDF</p>
                  <p className="text-[10px] text-slate-500 mt-1">or click to browse local folders (Max size: 10MB)</p>
                  
                  {/* Attached resume mockup */}
                  <div className="mt-4 bg-[#182030] border border-slate-800 rounded-xl p-2.5 max-w-sm mx-auto flex items-center justify-between text-[11px] text-emerald-400 font-bold animate-pulse">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-emerald-500" />
                      <span>{newCand.name ? `${newCand.name.toLowerCase().replace(/\s+/g, "_")}_resume.pdf` : "jasmine_kaur_cv_screen.pdf"}</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-500 font-mono">1.2 MB</span>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-slate-850 pt-6 flex items-center justify-between">
                <span className="text-slate-500 font-bold text-[11px] italic">
                  * Marked fields are mandatory for screening analysis
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCandidateModalOpen(false)}
                    className="px-5 py-2.5 border border-slate-700 hover:bg-slate-800 rounded-xl text-slate-300 font-bold hover:text-white transition-all text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#2f66e0] hover:bg-opacity-95 rounded-xl text-white font-extrabold transition-all text-xs cursor-pointer flex items-center gap-1.5 shadow-md shadow-[#2f66e0]/10"
                  >
                    <span>Import and screen</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 4. SCHEDULE INTERVIEW MODAL (High Fidelity, Dark-Themed) */}
      {interviewModalOpen && (
        <div id="new-interview-modal-backdrop" className="fixed inset-0 bg-[#070b13]/85 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div id="new-interview-modal-panel" className="bg-[#111827] text-border rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-800 overflow-hidden transform animate-in fade-in duration-200 my-8">
            
            {/* Header */}
            <div className="border-b border-slate-850 px-8 py-5 flex items-center justify-between bg-[#0f1422]">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2.5">
                  <Calendar className="h-5 w-5 text-[#4f83f2]" />
                  <span>Schedule Candidate Meeting / Interview</span>
                </h2>
                <p className="text-[10.5px] text-slate-400 font-semibold mt-1">
                  Connect email addresses, allocate calendar events &amp; assign panel evaluators
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInterviewModalOpen(false)}
                className="h-8 w-8 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="text-base font-bold">✕</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleScheduleInterview} className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Panel: Basic schedules (8 columns) */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Select candidate */}
                  <div>
                    <label className="block text-xs font-bold text-[#4f83f2] uppercase tracking-wider mb-2.5">
                      Target Candidate Profile
                    </label>
                    <select
                      value={newInt.candidateId}
                      onChange={(e) => setNewInt({ ...newInt, candidateId: e.target.value })}
                      className="w-full bg-[#182030] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] font-semibold text-xs transition-all"
                      required
                    >
                      <option value="">-- Choose active candidate record --</option>
                      {candidates.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} &mdash; Applied for {c.positionApplied} [{c.stage}]
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date, Time, Stage */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs font-semibold">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1.5 font-sans">Interview Stage</label>
                      <select
                        value={newInt.stage}
                        onChange={(e) => setNewInt({ ...newInt, stage: e.target.value })}
                        className="w-full bg-[#182030] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] font-semibold"
                      >
                        <option value="Phone screening">Phone screening</option>
                        <option value="Panel interview">Panel interview</option>
                        <option value="Technical test">Technical assessment</option>
                        <option value="Director round">Director round</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1.5">Meeting format</label>
                      <div className="grid grid-cols-3 gap-1.5 bg-[#0f1422] p-1 rounded-xl border border-slate-800">
                        {(['Video', 'Phone', 'In person'] as const).map((fmt) => (
                          <button
                            key={fmt}
                            type="button"
                            onClick={() => setNewInt({ ...newInt, format: fmt })}
                            className={`py-1.5 rounded-lg font-bold text-[10px] text-center transition-all cursor-pointer ${
                              newInt.format === fmt
                                ? 'bg-[#2f66e0] text-white shadow-xs'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                            }`}
                          >
                            {fmt === 'Video' && 'Video'}
                            {fmt === 'Phone' && 'Call'}
                            {fmt === 'In person' && 'Physical'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1.5">Expected duration</label>
                      <select
                        value={newInt.duration}
                        onChange={(e) => setNewInt({ ...newInt, duration: e.target.value })}
                        className="w-full bg-[#182030] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] font-semibold"
                      >
                        <option value="30 minutes">30 mins screening</option>
                        <option value="45 minutes">45 mins tech talk</option>
                        <option value="1 hour">1 hour system panel</option>
                        <option value="2 hours">2 hours deep-dive session</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1.5">Schedule date</label>
                      <input
                        type="date"
                        value={newInt.date}
                        onChange={(e) => setNewInt({ ...newInt, date: e.target.value })}
                        className="w-full bg-[#182030] border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1.5">Time slotted</label>
                      <input
                        type="text"
                        value={newInt.time}
                        onChange={(e) => setNewInt({ ...newInt, time: e.target.value })}
                        className="w-full bg-[#182030] border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1.5">Meeting address / URL</label>
                      <input
                        type="text"
                        value={newInt.location}
                        onChange={(e) => setNewInt({ ...newInt, location: e.target.value })}
                        className="w-full bg-[#182030] border border-[#2f66e0]/40 rounded-xl px-4 py-2.5 text-[#4f83f2] font-mono font-bold outline-none focus:border-[#2f66e0]"
                      />
                    </div>
                  </div>

                  {/* Panel assignees */}
                  <div className="border-t border-slate-850 pt-6">
                    <label className="block text-xs font-bold text-[#4f83f2] uppercase tracking-wider mb-2.5">
                      Assigned Panel Interviewers &bull; Users
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                      <div>
                        <input
                          type="text"
                          placeholder="e.g. Nina Reza, Ahmad Wahid"
                          value={newInt.interviewers}
                          onChange={(e) => setNewInt({ ...newInt, interviewers: e.target.value })}
                          className="w-full bg-[#182030] border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] font-semibold"
                        />
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 select-none">
                        <span className="h-6 w-6 rounded-full bg-[#2f66e0]/10 text-[#4f83f2] flex items-center justify-center font-bold">NR</span>
                        <span className="h-6 w-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">AW</span>
                        <span>Evaluators auto-booked in Google Workspace Calendar</span>
                      </div>
                    </div>
                  </div>

                  {/* Invitation notes */}
                  <div className="border-t border-slate-850 pt-6">
                    <label className="block text-xs font-bold text-[#4f83f2] uppercase tracking-wider mb-2">
                      Custom Instructions / Notes to Candidate
                    </label>
                    <textarea
                      rows={3}
                      value={newInt.notes}
                      onChange={(e) => setNewInt({ ...newInt, notes: e.target.value })}
                      placeholder="e.g. Please bring a copy of your project portfolio and ensure reliable internet connectivity with your camera online..."
                      className="w-full bg-[#182030] border border-slate-800 rounded-xl px-4 py-3 text-slate-100 outline-none focus:border-[#2f66e0] text-xs font-semibold"
                    />
                  </div>

                  {/* Direct calendar sync toggles */}
                  <div className="bg-[#1c2436]/40 p-4 border border-slate-800 rounded-2xl flex flex-col sm:flex-row gap-4 select-none text-[11px] font-bold text-slate-300">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newInt.sendInvite}
                        onChange={(e) => setNewInt({ ...newInt, sendInvite: e.target.checked })}
                        className="h-4 w-4 text-[#2f66e0] bg-slate-800 border-slate-750 rounded focus:ring-0"
                      />
                      <span>Email direct calendar RSVP request sheet</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newInt.sendReminder}
                        onChange={(e) => setNewInt({ ...newInt, sendReminder: e.target.checked })}
                        className="h-4 w-4 text-[#2f66e0] bg-slate-800 border-slate-750 rounded focus:ring-0"
                      />
                      <span>Send SMS / WhatsApp checklist reminders (24h before)</span>
                    </label>
                  </div>

                </div>

                {/* Right Panel: Calendar availability mockup (4 columns) */}
                <div className="lg:col-span-4 bg-[#0f1422] border border-slate-850 p-6 rounded-2xl text-xs space-y-5 select-none font-semibold">
                  <h4 className="text-[11px] font-bold text-[#cbd5e1] uppercase tracking-wider border-b border-slate-800 pb-2">
                    Evaluator Core Calendars
                  </h4>

                  {/* Visual Timeline Mockup */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Google Calendar Hub</span>
                      <span className="text-[#4f83f2] font-mono">20 Jun 2026</span>
                    </div>

                    <div className="space-y-2 font-mono text-[10.5px]">
                      <div className="p-2 border-l-2 border-slate-500 bg-slate-800/40 rounded flex justify-between items-center text-slate-400">
                        <span>09:30 AM</span>
                        <span>Daily Operations Standup</span>
                      </div>
                      <div className="p-2 border-l-2 border-[#2f66e0] bg-[#2f66e0]/15 rounded flex justify-between items-center text-[#4f83f2] font-bold">
                        <span>11:00 AM (Proposed)</span>
                        <span>Candidate Interview Slot</span>
                      </div>
                      <div className="p-2 border-l-2 border-rose-500 bg-rose-500/10 rounded flex justify-between items-center text-rose-300">
                        <span>12:30 PM PM</span>
                        <span>C-Suite Lunch Meeting</span>
                      </div>
                      <div className="p-2 border-l-2 border-slate-500 bg-slate-800/40 rounded flex justify-between items-center text-slate-400">
                        <span>03:00 PM</span>
                        <span>Quarterly Budget Reviews</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-3.5 space-y-2 text-[11px] text-slate-400">
                    <div className="flex justify-between">
                      <span>Nina Reza (Head of HR)</span>
                      <span className="text-emerald-400">● Available</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ahmad Wahid (CEO)</span>
                      <span className="text-emerald-400">● Available</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Form submit indicators */}
              <div className="border-t border-slate-850 pt-6 mt-8 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 italic">
                  Evaluators will run automated match score comparison inside the interview panel applet
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setInterviewModalOpen(false)}
                    className="px-5 py-2.5 border border-slate-700 hover:bg-slate-800 rounded-xl text-slate-300 font-bold hover:text-white transition-all text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#2f66e0] hover:bg-opacity-95 rounded-xl text-white font-extrabold transition-all text-xs cursor-pointer flex items-center gap-1.5 shadow-md shadow-[#2f66e0]/10"
                  >
                    <span>Schedule &amp; Book Calendar</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 5. CREATE OFFER MODAL (High Fidelity, Dark-Themed & LIVE INTERACTIVE PRINT PREVIEW!) */}
      {offerModalOpen && (
        <div id="new-offer-modal-backdrop" className="fixed inset-0 bg-[#070b13]/85 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div id="new-offer-modal-panel" className="bg-[#111827] text-border rounded-3xl w-full max-w-5xl shadow-2xl border border-slate-800 overflow-hidden transform animate-in fade-in duration-200 my-8">
            
            {/* Header */}
            <div className="border-b border-slate-850 px-8 py-5 flex items-center justify-between bg-[#0f1422]">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2.5">
                  <FileCheck className="h-5 w-5 text-emerald-400" />
                  <span>Draft Terms of Contract Offer &amp; Employment Package</span>
                </h2>
                <p className="text-[10.5px] text-slate-400 font-semibold mt-1">
                  Approve final package, define allowance &amp; review real-time live preview contract papers
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOfferModalOpen(false)}
                className="h-8 w-8 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="text-base font-bold">✕</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSendOfferForm} className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left side: Inputs (6 Columns) */}
                <div className="lg:col-span-6 space-y-6">
                  
                  {/* Select candidate */}
                  <div>
                    <label className="block text-xs font-bold text-[#4f83f2] uppercase tracking-wider mb-2.5">
                      Approved Candidate Selection
                    </label>
                    <select
                      value={newOffer.candidateName}
                      onChange={(e) => {
                        const cName = e.target.value;
                        const cand = candidates.find(c => c.name === cName);
                        setNewOffer({ 
                          ...newOffer, 
                          candidateName: cName, 
                          position: cand ? cand.positionApplied : 'HR Business Partner' 
                        });
                      }}
                      className="w-full bg-[#182030] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 outline-none focus:border-slate-705 font-bold text-xs"
                      required
                    >
                      <option value="">-- Select screen passed candidate records --</option>
                      {candidates.map(c => (
                        <option key={c.id} value={c.name}>
                          {c.name} &mdash; {c.positionApplied} (Score: {c.matchScore})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Salary, Allowance, Grade */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1.5">Starting Basic Salary &mdash; MYR *</label>
                      <input
                        type="text"
                        value={newOffer.salary}
                        onChange={(e) => setNewOffer({ ...newOffer, salary: e.target.value })}
                        className="w-full bg-[#182030] border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0]"
                        placeholder="e.g. 6,000"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1.5 font-sans">Special Position Allowance (MYR)</label>
                      <input
                        type="text"
                        value={newOffer.allowance}
                        onChange={(e) => setNewOffer({ ...newOffer, allowance: e.target.value })}
                        className="w-full bg-[#182030] border border-slate-800 rounded-xl px-4 py-2.5 text-slate-105 outline-none focus:border-[#2f66e0]"
                        placeholder="e.g. 600"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1.5">Employment Grade</label>
                      <select
                        value={newOffer.grade}
                        onChange={(e) => setNewOffer({ ...newOffer, grade: e.target.value })}
                        className="w-full bg-[#182030] border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] font-semibold text-xs"
                      >
                        <option value="G-1 (Associate / Entry)">G-1 (Associate / Entry)</option>
                        <option value="G-2 (Senior Associate)">G-2 (Senior Associate)</option>
                        <option value="G-3 (Specialist / Lead)">G-3 (Specialist / Lead)</option>
                        <option value="G-4 (Manager / Consultant)">G-4 (Manager / Consultant)</option>
                        <option value="G-5 / Sub B">G-5 / Sub B (Senior Manager)</option>
                        <option value="G-6 / Sub A">G-6 / Sub A (Director)</option>
                        <option value="G-7 (Vice President / Executive)">G-7 (Vice President / Executive)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-bold mb-1.5">Probation Period Duration</label>
                      <select
                        value={newOffer.probation}
                        onChange={(e) => setNewOffer({ ...newOffer, probation: e.target.value })}
                        className="w-full bg-[#182030] border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 outline-none focus:border-[#2f66e0] font-semibold text-xs"
                      >
                        <option value="No Probation">No Probation (Immediate Permanent)</option>
                        <option value="1 month">1 month</option>
                        <option value="2 months">2 months</option>
                        <option value="3 months">3 months</option>
                        <option value="6 months">6 months</option>
                        <option value="9 months">9 months</option>
                      </select>
                    </div>
                  </div>

                  {/* Offer validity range slider visual */}
                  <div className="border-t border-slate-850 pt-5 space-y-2">
                    <div className="flex justify-between text-xs text-slate-300 font-semibold font-sans">
                      <span>Offer validity period</span>
                      <span className="text-emerald-400 font-extrabold">{newOffer.expiryDays || '14'} calendar days</span>
                    </div>
                    <input
                      type="range"
                      min="3"
                      max="30"
                      value={newOffer.expiryDays || '14'}
                      onChange={(e) => setNewOffer({ ...newOffer, expiryDays: e.target.value })}
                      className="w-full accent-[#2f66e0] cursor-pointer bg-slate-800 h-1.5 rounded-lg"
                    />
                  </div>

                  {/* Perks checks */}
                  <div className="border-t border-slate-850 pt-5">
                    <label className="block text-xs font-bold text-[#4f83f2] uppercase tracking-wider mb-3">
                      Core Benefits Included
                    </label>
                    <div className="grid grid-cols-2 gap-2.5 text-[11px] font-bold text-slate-300 select-none">
                      <label className="flex items-center gap-2 cursor-pointer bg-[#0f1422] p-2 rounded-lg border border-slate-800">
                        <input type="checkbox" defaultChecked className="h-3.5 w-3.5 text-[#2f66e5]" />
                        <span>Comprehensive Medical Cover</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer bg-[#0f1422] p-2 rounded-lg border border-slate-800">
                        <input type="checkbox" defaultChecked className="h-3.5 w-3.5 text-[#2f66e5]" />
                        <span>16 Days Annual Paid Leave</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer bg-[#0f1422] p-2 rounded-lg border border-slate-800">
                        <input type="checkbox" defaultChecked className="h-3.5 w-3.5 text-[#2f66e5]" />
                        <span>EPF / SOCSO / EIS Employer Caps</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer bg-[#0f1422] p-2 rounded-lg border border-slate-800">
                        <input type="checkbox" className="h-3.5 w-3.5 text-[#2f66e5]" />
                        <span>Executive Relocation Package</span>
                      </label>
                    </div>
                  </div>

                </div>

                {/* Right side: Beautiful Document Preview Box (6 Columns) */}
                <div className="lg:col-span-6 bg-white text-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-200 text-xs flex flex-col justify-between font-serif relative">
                  
                  {/* Subtle watermark overlay */}
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-slate-100 font-extrabold text-[44px] tracking-[4px] rotate-12 uppercase opacity-45 pointer-events-none select-none font-sans">
                    Novora HRMS Private Limited
                  </span>

                  {/* Contract Header */}
                  <div className="border-b-2 border-slate-800 pb-3 mb-4 select-none">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-extrabold text-xs uppercase tracking-widest font-sans">NOVORA HRMS PTE LTD</span>
                        <p className="text-[9px] font-sans font-semibold text-slate-500 mt-0.5">Level 25, Marina Bay Financial Centre, Singapore</p>
                      </div>
                      <span className="border border-slate-800 font-mono text-[9px] px-2 py-0.5 font-bold rounded">
                        CONFIDENTIAL // RECORD
                      </span>
                    </div>
                    <div className="text-[9px] font-sans font-semibold text-slate-500 mt-2 text-right">
                      Date: {new Date().toLocaleDateString('en-MY', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                  </div>

                  {/* Content body */}
                  <div className="space-y-4 leading-relaxed relative z-10 text-slate-600">
                    <h3 className="text-center font-extrabold text-sm uppercase font-sans tracking-wide text-slate-900 border-b border-dashed border-slate-200 pb-1 max-w-xs mx-auto mb-2">
                      Letter of Employment Offer
                    </h3>

                    <p className="font-sans font-bold text-slate-900">
                      Dear <span className="bg-yellow-50 px-1 py-0.5 rounded border border-yellow-200">{newOffer.candidateName || "[Select Approved Candidate]"}</span>,
                    </p>

                    <p>
                      On behalf of Novora HRMS Pte Ltd, we are extremely pleased to offer you the position of <span className="font-bold underline text-slate-900">{newOffer.position || "[Target Role]"}</span>. This employment will start on standard company orientation schemes at Singapore standard timezones.
                    </p>

                    <p>
                      The specific legal terms of your employment offer packages are as follows:
                    </p>

                    <ul className="list-disc pl-5 font-sans text-[10px] space-y-1 text-slate-800 font-semibold bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <li><strong>Basic Salary:</strong> MYR {Number(newOffer.salary.replace(/,/g, '') || "6000").toLocaleString()}/month</li>
                      <li><strong>Allowances:</strong> MYR {Number(newOffer.allowance.replace(/,/g, '') || "600").toLocaleString()}/month</li>
                      <li><strong>Internal Grade:</strong> {newOffer.grade || "G-5 / Sub B"}</li>
                      <li><strong>Probation Range:</strong> {newOffer.probation || "3 months orientation"}</li>
                      <li><strong>Expiry Period:</strong> This package must be signed within {newOffer.expiryDays || "14"} calendar days.</li>
                    </ul>

                    <p className="text-[9.5px]">
                      To accept this offer, please sign below and return the executed documents packet. We look forward to welcome you into our community!
                    </p>
                  </div>

                  {/* Signatures */}
                  <div className="border-t border-slate-200 pt-4 mt-4 flex justify-between items-end font-sans select-none text-[9.5px] font-semibold">
                    <div>
                      <span className="italic block font-serif text-slate-700">Nina Reza</span>
                      <span className="text-slate-500 block text-[8px] tracking-wide uppercase border-t border-slate-300 pt-0.5 font-bold mt-1">Nina Reza &bull; Head of HR</span>
                    </div>
                    <div className="text-right">
                      <div className="h-6 border-b border-dashed border-slate-300 w-28 ml-auto" />
                      <span className="text-slate-500 block text-[8px] tracking-wide uppercase pt-1 font-bold">Candidate Signature &bull; Accept</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Form submit actions */}
              <div className="border-t border-slate-850 pt-6 mt-8 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 italic">
                  * Offers will be dispatched via secure DocuSign envelope to the candidate
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setOfferModalOpen(false)}
                    className="px-5 py-2.5 border border-slate-700 hover:bg-slate-800 rounded-xl text-slate-300 font-bold hover:text-white transition-all text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 hover:scale-[1.01] rounded-xl text-white font-extrabold transition-all text-xs cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-600/10"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Approve &amp; Dispatch Package</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

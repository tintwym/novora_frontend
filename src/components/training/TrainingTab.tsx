import { useState } from 'react'
import {
  Search,
  Plus,
  Check,
  X,
  FileSpreadsheet,
  Download,
  Clock,
  BarChart3,
  TrendingUp,
  DollarSign,
  GraduationCap,
  ShieldAlert,
} from 'lucide-react'
import { showActionToast } from '../../utils/actionToast'
import type { ModuleEmployee } from '../../types/moduleEmployee'

type TrainingTabProps = {
  employees: ModuleEmployee[]
}

type TrainingSubTab =
  | 'Training Type'
  | 'Category'
  | 'Course'
  | 'Subject'
  | 'Schedule'
  | 'Training Request'
  | 'Request On Behalf'
  | 'Approval'
  | 'Attendance'
  | 'Training History'
  | 'Reports';

export function TrainingTab({ employees: _employees }: TrainingTabProps) {
  const addToast = (text: string, type?: 'success' | 'loading' | 'error' | 'info') => {
    showActionToast(text, type)
  }

  const [activeTab, setActiveTab] = useState<TrainingSubTab>('Training Type');
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All departments');

  // REPORTS STATES
  const [selectedReportType, setSelectedReportType] = useState<'compliance' | 'skills' | 'budget'>('compliance');
  const [reportSearch, setReportSearch] = useState('');
  const [reportFilterDept, setReportFilterDept] = useState('All');

  // MODAL STATES
  const [showModal, setShowModal] = useState<string | null>(null); // 'training_type_new', 'category_new', etc.
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // DATA STATES FOR DEMO
  const [trainingTypes, setTrainingTypes] = useState([
    { id: 1, name: 'Management', description: 'Leadership, strategy & people management', coursesCount: 8, status: 'Active' },
    { id: 2, name: 'Technical', description: 'IT, engineering & systems training', coursesCount: 12, status: 'Active' },
    { id: 3, name: 'Compliance', description: 'Regulatory, safety & legal requirements', coursesCount: 5, status: 'Active' },
    { id: 4, name: 'Soft skills', description: 'Communication, teamwork & presentation', coursesCount: 6, status: 'Active' },
    { id: 5, name: 'Onboarding', description: 'New employee orientation programs', coursesCount: 3, status: 'Draft' },
  ]);

  const [categories, setCategories] = useState([
    { id: 1, name: 'Leadership', type: 'Management', description: 'Leading teams & strategy', subjectsCount: 4 },
    { id: 2, name: 'Computer skills', type: 'Technical', description: 'Software & hardware', subjectsCount: 6 },
    { id: 3, name: 'Fire safety', type: 'Compliance', description: 'Emergency & safety drills', subjectsCount: 2 },
    { id: 4, name: 'Public speaking', type: 'Soft skills', description: 'Presentation & communication', subjectsCount: 3 },
    { id: 5, name: 'Project management', type: 'Management', description: 'Agile, Scrum & PMO', subjectsCount: 5 },
  ]);

  const [courses, setCourses] = useState([
    { id: 1, title: 'Leadership essentials', type: 'Management', delivery: 'Internal', frequency: 'One time', mandatory: 'Yes', dueWithin: '7 days', status: 'Active' },
    { id: 2, title: 'Excel advanced', type: 'Technical', delivery: 'Internal', frequency: 'Renewing', mandatory: 'No', dueWithin: '30 days', status: 'Active' },
    { id: 3, title: 'ISO 9001 awareness', type: 'Compliance', delivery: 'External', frequency: 'Annual', mandatory: 'Yes', dueWithin: '1 day', status: 'Active' },
    { id: 4, title: 'Agile & Scrum', type: 'Management', delivery: 'Overseas', frequency: 'One time', mandatory: 'No', dueWithin: '—', status: 'Active' },
    { id: 5, title: 'Public speaking', type: 'Soft skills', delivery: 'Internal', frequency: 'Repeat', mandatory: 'No', dueWithin: '14 days', status: 'Active' },
  ]);

  const [subjects, setSubjects] = useState([
    { id: 1, title: 'Team leadership', course: 'Leadership essentials', internalTrainer: 'David Ng', externalTrainer: '—', skill: 'People mgmt' },
    { id: 2, title: 'Decision making', course: 'Leadership essentials', internalTrainer: 'Nina Reza', externalTrainer: '—', skill: 'Critical thinking' },
    { id: 3, title: 'Pivot tables', course: 'Excel advanced', internalTrainer: '—', externalTrainer: 'Excel Pro Sdn', skill: 'Data analysis' },
    { id: 4, title: 'Scrum ceremonies', course: 'Agile & Scrum', internalTrainer: '—', externalTrainer: 'Agile Academy', skill: 'Agile delivery' },
  ]);

  const [schedules, setSchedules] = useState([
    { id: 1, courseTitle: 'Leadership essentials', type: 'Internal', period: '12–14 May', days: 3, fee: '500/pax', companyCont: '100%', requestBefore: '7 days', status: 'Upcoming' },
    { id: 2, courseTitle: 'Excel advanced', type: 'Internal', period: '6–7 May', days: 2, fee: '200/pax', companyCont: '50%', requestBefore: '3 days', status: 'Ongoing' },
    { id: 3, courseTitle: 'ISO 9001 awareness', type: 'External', period: '2 May', days: 1, fee: '800/pax', companyCont: '100%', requestBefore: '14 days', status: 'Completed' },
    { id: 4, courseTitle: 'Agile & Scrum', type: 'Overseas', period: '20–24 May', days: 5, fee: '3,200/pax', companyCont: '80%', requestBefore: '21 days', status: 'Upcoming' },
  ]);

  const [myRequests, setMyRequests] = useState([
    { id: 1, course: 'Excel advanced', date: '6–7 May', status: 'Allocated' },
    { id: 2, course: 'Leadership', date: '12–14 May', status: 'Pending' },
    { id: 3, course: 'Public speaking', date: '20 May', status: 'Pending' },
    { id: 4, course: 'ISO 9001', date: '2 May', status: 'Completed' },
    { id: 5, course: 'Agile & Scrum', date: '20 Apr', status: 'Denied' },
  ]);

  const [submittedBehalf, setSubmittedBehalf] = useState([
    { id: 1, employee: 'Sarah Lim', course: 'Leadership', date: '12 May', status: 'Allocated' },
    { id: 2, employee: 'Raj Kumar', course: 'Leadership', date: '12 May', status: 'Pending' },
    { id: 3, employee: 'Ahmad Luqman', course: 'ISO 9001', date: '2 May', status: 'Completed' },
  ]);

  const [approvals, setApprovals] = useState([
    { id: 'APP-1', employee: 'Sarah Lim', course: 'Leadership essentials', date: '12-14 May', location: 'Room A', approvedBy: [{ name: 'David Ng', approved: true }, { name: 'Ahmad Wahid', approved: false }], status: 'Pending' },
    { id: 'APP-2', employee: 'Raj Kumar', course: 'Agile & Scrum', date: '20-24 May', location: 'Overseas', approvedBy: [{ name: 'David Ng', approved: true }, { name: 'Ahmad Wahid', approved: false }], status: 'Pending' },
    { id: 'APP-3', employee: 'Maya Tan', course: 'Excel advanced', date: '6-7 May', location: 'Room B', approvedBy: [{ name: 'Nina Reza', approved: true }], status: 'Approved' },
    { id: 'APP-4', employee: 'Nadia Chen', course: 'Public speaking', date: '20 May', location: 'Room A', approvedBy: [{ name: 'Kevin Lim', approved: false }], status: 'Denied' },
  ]);

  const [attendance, setAttendance] = useState([
    { id: 1, employee: 'Sarah Lim', subject: 'Leadership — Team leadership', scheduleDate: '12 May', actualDate: '12 May', timeIn: '09:02', timeOut: '13:05', status: 'Present' },
    { id: 2, employee: 'Raj Kumar', subject: 'Excel — Pivot tables', scheduleDate: '6 May', actualDate: '6 May', timeIn: '09:05', timeOut: '17:00', status: 'Present' },
    { id: 3, employee: 'Maya Tan', subject: 'Excel — Pivot tables', scheduleDate: '6 May', actualDate: '6 May', timeIn: '—', timeOut: '—', status: 'Absent' },
    { id: 4, employee: 'Ahmad Luqman', subject: 'Leadership — Decision making', scheduleDate: '13 May', actualDate: '13 May', timeIn: '09:15', timeOut: '12:00', status: 'Late' },
  ]);

  // FORM INPUTS
  const [formCourse, setFormCourse] = useState('Excel advanced');
  const [formDateFrom, setFormDateFrom] = useState('2026-05-12');
  const [formDateTo, setFormDateTo] = useState('2026-05-14');
  const [formDays, setFormDays] = useState(3);
  const [formFee, setFormFee] = useState('500.00');
  const [formLocation, setFormLocation] = useState('Training room A, Level 3');
  const [formReason, setFormReason] = useState('');
  const [formEmailNotify, setFormEmailNotify] = useState(true);

  // REQUEST ON BEHALF INPUTS
  const [behalfEmpChoice, setBehalfEmpChoice] = useState<'individual' | 'all'>('individual');
  const [behalfSelectedEmps, setBehalfSelectedEmps] = useState<string[]>(['Sarah Lim']);
  const [behalfCourse, setBehalfCourse] = useState('Leadership essentials');
  const [behalfLocation, setBehalfLocation] = useState('Training Room A');
  const [behalfContribution, setBehalfContribution] = useState('100% / Fixed MYR');

  // ADD NEW ITEM FORM INPUTS
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeDesc, setNewTypeDesc] = useState('');
  const [newTypeStatus, setNewTypeStatus] = useState('Active');

  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState('Management');
  const [newCatDesc, setNewCatDesc] = useState('');

  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseType, setNewCourseType] = useState('Management');
  const [newCourseDelivery, setNewCourseDelivery] = useState('Internal');
  const [newCourseFreq, setNewCourseFreq] = useState('One time');
  const [newCourseMandatory, setNewCourseMandatory] = useState('Yes');
  const [newCourseDue, setNewCourseDue] = useState('7 days');

  const [newSubjTitle, setNewSubjTitle] = useState('');
  const [newSubjCourse, setNewSubjCourse] = useState('Leadership essentials');
  const [newSubjInTrainer, setNewSubjInTrainer] = useState('');
  const [newSubjExTrainer, setNewSubjExTrainer] = useState('—');
  const [newSubjSkill, setNewSubjSkill] = useState('');

  const [newSchedCourse, setNewSchedCourse] = useState('Leadership essentials');
  const [newSchedType, setNewSchedType] = useState('Internal');
  const [newSchedPeriod, setNewSchedPeriod] = useState('12–14 May');
  const [newSchedDays, setNewSchedDays] = useState(3);
  const [newSchedFee, setNewSchedFee] = useState('500/pax');
  const [newSchedCont, setNewSchedCont] = useState('100%');
  const [newSchedBefore, setNewSchedBefore] = useState('7 days');

  const [newAttEmployee, setNewAttEmployee] = useState('Sarah Lim');
  const [newAttSubject, setNewAttSubject] = useState('Team leadership');
  const [newAttDate, setNewAttDate] = useState('12 May');
  const [newAttIn, setNewAttIn] = useState('09:00');
  const [newAttOut, setNewAttOut] = useState('13:00');
  const [newAttStatus, setNewAttStatus] = useState('Present');

  // SUBMIT HANDLERS
  const handleAddTrainingType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;

    if (editingItem) {
      setTrainingTypes(prev =>
        prev.map(item => (item.id === editingItem.id ? { ...item, name: newTypeName, description: newTypeDesc, status: newTypeStatus } : item))
      );
      addToast(`Updated training type: ${newTypeName}`, 'success');
    } else {
      const newItem = {
        id: Date.now(),
        name: newTypeName,
        description: newTypeDesc || 'No description provided',
        coursesCount: 0,
        status: newTypeStatus,
      };
      setTrainingTypes(prev => [...prev, newItem]);
      addToast(`Added new training type: ${newTypeName}`, 'success');
    }
    resetForm();
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    if (editingItem) {
      setCategories(prev =>
        prev.map(item => (item.id === editingItem.id ? { ...item, name: newCatName, type: newCatType, description: newCatDesc } : item))
      );
      addToast(`Updated category: ${newCatName}`, 'success');
    } else {
      const newItem = {
        id: Date.now(),
        name: newCatName,
        type: newCatType,
        description: newCatDesc || 'No description provided',
        subjectsCount: 0,
      };
      setCategories(prev => [...prev, newItem]);
      addToast(`Added new category: ${newCatName}`, 'success');
    }
    resetForm();
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;

    if (editingItem) {
      setCourses(prev =>
        prev.map(item =>
          item.id === editingItem.id
            ? {
                ...item,
                title: newCourseTitle,
                type: newCourseType,
                delivery: newCourseDelivery,
                frequency: newCourseFreq,
                mandatory: newCourseMandatory,
                dueWithin: newCourseDue,
              }
            : item
        )
      );
      addToast(`Updated course: ${newCourseTitle}`, 'success');
    } else {
      const newItem = {
        id: Date.now(),
        title: newCourseTitle,
        type: newCourseType,
        delivery: newCourseDelivery,
        frequency: newCourseFreq,
        mandatory: newCourseMandatory,
        dueWithin: newCourseDue,
        status: 'Active',
      };
      setCourses(prev => [...prev, newItem]);
      addToast(`Added new course: ${newCourseTitle}`, 'success');
    }
    resetForm();
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjTitle.trim()) return;

    if (editingItem) {
      setSubjects(prev =>
        prev.map(item =>
          item.id === editingItem.id
            ? {
                ...item,
                title: newSubjTitle,
                course: newSubjCourse,
                internalTrainer: newSubjInTrainer || '—',
                externalTrainer: newSubjExTrainer || '—',
                skill: newSubjSkill,
              }
            : item
        )
      );
      addToast(`Updated subject: ${newSubjTitle}`, 'success');
    } else {
      const newItem = {
        id: Date.now(),
        title: newSubjTitle,
        course: newSubjCourse,
        internalTrainer: newSubjInTrainer || '—',
        externalTrainer: newSubjExTrainer || '—',
        skill: newSubjSkill,
      };
      setSubjects(prev => [...prev, newItem]);
      addToast(`Added new subject: ${newSubjTitle}`, 'success');
    }
    resetForm();
  };

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setSchedules(prev =>
        prev.map(item =>
          item.id === editingItem.id
            ? {
                ...item,
                courseTitle: newSchedCourse,
                type: newSchedType,
                period: newSchedPeriod,
                days: newSchedDays,
                fee: newSchedFee,
                companyCont: newSchedCont,
                requestBefore: newSchedBefore,
              }
            : item
        )
      );
      addToast('Updated schedule parameter', 'success');
    } else {
      const newItem = {
        id: Date.now(),
        courseTitle: newSchedCourse,
        type: newSchedType,
        period: newSchedPeriod,
        days: newSchedDays,
        fee: newSchedFee,
        companyCont: newSchedCont,
        requestBefore: newSchedBefore,
        status: 'Upcoming',
      };
      setSchedules(prev => [...prev, newItem]);
      addToast('Created new schedule entry', 'success');
    }
    resetForm();
  };

  const handleAddAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setAttendance(prev =>
        prev.map(item =>
          item.id === editingItem.id
            ? {
                ...item,
                employee: newAttEmployee,
                subject: newAttSubject,
                actualDate: newAttDate,
                timeIn: newAttIn,
                timeOut: newAttOut,
                status: newAttStatus,
              }
            : item
        )
      );
      addToast(`Updated attendance for ${newAttEmployee}`, 'success');
    } else {
      const newItem = {
        id: Date.now(),
        employee: newAttEmployee,
        subject: newAttSubject,
        scheduleDate: newAttDate,
        actualDate: newAttDate,
        timeIn: newAttIn,
        timeOut: newAttOut,
        status: newAttStatus,
      };
      setAttendance(prev => [...prev, newItem]);
      addToast(`Logged attendance for ${newAttEmployee}`, 'success');
    }
    resetForm();
  };

  const handleSubmissionRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq = {
      id: Date.now(),
      course: formCourse,
      date: `${formDateFrom.split('-')[2] || '12'}–${formDateTo.split('-')[2] || '14'} May`,
      status: 'Pending',
    };
    setMyRequests(prev => [newReq, ...prev]);
    addToast(`Training request for ${formCourse} submitted successfully!`, 'success');
    setFormReason('');
  };

  const handleBehalfRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (behalfSelectedEmps.length === 0) {
      addToast('Please select at least one employee', 'error');
      return;
    }
    behalfSelectedEmps.forEach(emp => {
      const newReq = {
        id: Math.random(),
        employee: emp,
        course: behalfCourse,
        date: '12 May',
        status: 'Pending',
      };
      setSubmittedBehalf(prev => [newReq, ...prev]);
    });
    addToast(`Successfully batch submitted requests on behalf of ${behalfSelectedEmps.length} employees`, 'success');
  };

  const handleApprovalAction = (id: string, action: 'Approved' | 'Denied', comment?: string) => {
    setApprovals(prev =>
      prev.map(app => (app.id === id ? { ...app, status: action, notes: comment || '' } : app))
    );
    addToast(`Request ${id} has been ${action.toLowerCase()}`, 'success');
  };

  const resetForm = () => {
    setShowModal(null);
    setEditingItem(null);
    setNewTypeName('');
    setNewTypeDesc('');
    setNewTypeStatus('Active');
    setNewCatName('');
    setNewCatType('Management');
    setNewCatDesc('');
    setNewCourseTitle('');
    setNewCourseType('Management');
    setNewCourseDelivery('Internal');
    setNewSubjTitle('');
    setNewAttEmployee('Sarah Lim');
    setNewAttSubject('Team leadership');
    setNewAttStatus('Present');
  };

  const triggerEdit = (type: string, item: any) => {
    setEditingItem(item);
    if (type === 'training_type') {
      setNewTypeName(item.name);
      setNewTypeDesc(item.description);
      setNewTypeStatus(item.status);
      setShowModal('training_type');
    } else if (type === 'category') {
      setNewCatName(item.name);
      setNewCatType(item.type);
      setNewCatDesc(item.description);
      setShowModal('category');
    } else if (type === 'course') {
      setNewCourseTitle(item.title);
      setNewCourseType(item.type);
      setNewCourseDelivery(item.delivery);
      setNewCourseFreq(item.frequency);
      setNewCourseMandatory(item.mandatory);
      setNewCourseDue(item.dueWithin);
      setShowModal('course');
    } else if (type === 'subject') {
      setNewSubjTitle(item.title);
      setNewSubjCourse(item.course);
      setNewSubjInTrainer(item.internalTrainer);
      setNewSubjExTrainer(item.externalTrainer);
      setNewSubjSkill(item.skill);
      setShowModal('subject');
    } else if (type === 'schedule') {
      setNewSchedCourse(item.courseTitle);
      setNewSchedType(item.type);
      setNewSchedPeriod(item.period);
      setNewSchedDays(item.days);
      setNewSchedFee(item.fee);
      setNewSchedCont(item.companyCont);
      setNewSchedBefore(item.requestBefore);
      setShowModal('schedule');
    } else if (type === 'attendance') {
      setNewAttEmployee(item.employee);
      setNewAttSubject(item.subject);
      setNewAttDate(item.actualDate);
      setNewAttIn(item.timeIn);
      setNewAttOut(item.timeOut);
      setNewAttStatus(item.status);
      setShowModal('attendance');
    }
  };

  const subTabsList: { label: TrainingSubTab; badge?: number }[] = [
    { label: 'Training Type' },
    { label: 'Category' },
    { label: 'Course' },
    { label: 'Subject' },
    { label: 'Schedule' },
    { label: 'Training Request' },
    { label: 'Request On Behalf' },
    { label: 'Approval', badge: approvals.filter(a => a.status === 'Pending').length },
    { label: 'Attendance' },
    { label: 'Training History' },
    { label: 'Reports' },
  ];

  return (
    <div id="training-management-container" className="space-y-6">
      {/* Tab bar header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-1.5 rounded-2xl">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
          {subTabsList.map(tab => (
            <button
              id={`training-subtab-${tab.label.toLowerCase().replace(/\s+/g, '-')}`}
              key={tab.label}
              onClick={() => {
                setActiveTab(tab.label);
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.label
                  ? 'bg-blue-50 text-[#2f66e0]'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black leading-none">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => addToast('Exporting spreadsheet document...', 'loading')}
            className="border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE TAB VIEW */}
      {activeTab === 'Training Type' && (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-slate-400" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search type..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#2f66e0]"
              />
            </div>
            <button
              onClick={() => setShowModal('training_type')}
              className="w-full sm:w-auto bg-[#2f66e0] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Training Type</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 w-12">No.</th>
                  <th className="py-3 px-4">Training type name</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-center">Courses</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {trainingTypes
                  .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((t, idx) => (
                    <tr key={t.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-3.5 px-4 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-3.5 px-4 font-black text-slate-900">{t.name}</td>
                      <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">{t.description}</td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-900">{t.coursesCount}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${t.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button onClick={() => triggerEdit('training_type', t)} className="border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Category' && (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:max-w-md">
              <select
                value={departmentFilter}
                onChange={e => setDepartmentFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold py-2 px-3 focus:outline-none"
              >
                <option value="All training types">All training types</option>
                <option value="Management">Management</option>
                <option value="Technical">Technical</option>
                <option value="Compliance">Compliance</option>
                <option value="Soft skills">Soft skills</option>
              </select>
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-slate-400" />
                </span>
                <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search category..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
              />
              </div>
            </div>
            <button
              onClick={() => setShowModal('category')}
              className="w-full sm:w-auto bg-[#2f66e0] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Category</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 w-12">No.</th>
                  <th className="py-3 px-4">Category name</th>
                  <th className="py-3 px-4">Training type</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-center">Subjects</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {categories
                  .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .filter(c => departmentFilter === 'All training types' || departmentFilter === 'All departments' || c.type === departmentFilter)
                  .map((c, idx) => (
                    <tr key={c.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-3.5 px-4 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-3.5 px-4 font-black text-slate-900">{c.name}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold ${
                          c.type === 'Management' ? 'bg-blue-50 text-blue-700' :
                          c.type === 'Technical' ? 'bg-purple-50 text-purple-700' :
                          c.type === 'Compliance' ? 'bg-amber-50 text-amber-700' :
                          'bg-emerald-50 text-emerald-700'
                        }`}>
                          {c.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">{c.description}</td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-900">{c.subjectsCount}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button onClick={() => triggerEdit('category', c)} className="border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Course' && (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:max-w-md">
              <select
                value={departmentFilter}
                onChange={e => setDepartmentFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold py-2 px-3 focus:outline-none"
              >
                <option value="All types">All types</option>
                <option value="Management">Management</option>
                <option value="Technical">Technical</option>
                <option value="Compliance">Compliance</option>
                <option value="Soft skills">Soft skills</option>
              </select>
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-slate-400" />
                </span>
                <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search course..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
              />
              </div>
            </div>
            <button
              onClick={() => setShowModal('course')}
              className="w-full sm:w-auto bg-[#2f66e0] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Course</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Course title</th>
                  <th className="py-3 px-4">Type / Category</th>
                  <th className="py-3 px-4">Delivery</th>
                  <th className="py-3 px-4">Frequency</th>
                  <th className="py-3 px-4">Mandatory</th>
                  <th className="py-3 px-4">Due within</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {courses
                  .filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .filter(c => departmentFilter === 'All types' || departmentFilter === 'All departments' || c.type === departmentFilter)
                  .map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-3.5 px-4 font-black text-slate-900">{c.title}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold ${
                          c.type === 'Management' ? 'bg-blue-50 text-blue-700' :
                          c.type === 'Technical' ? 'bg-purple-50 text-purple-700' :
                          c.type === 'Compliance' ? 'bg-amber-50 text-amber-700' :
                          'bg-emerald-50 text-emerald-700'
                        }`}>
                          {c.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">{c.delivery}</td>
                      <td className="py-3.5 px-4">{c.frequency}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${c.mandatory === 'Yes' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'}`}>
                          {c.mandatory}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono">{c.dueWithin}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-green-50 text-green-700">
                          Active
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button onClick={() => triggerEdit('course', c)} className="border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Subject' && (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:max-w-md">
              <select
                className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold py-2 px-3 focus:outline-none whitespace-nowrap"
              >
                <option value="All courses">All courses</option>
                <option value="Leadership essentials">Leadership essentials</option>
                <option value="Excel advanced">Excel advanced</option>
                <option value="Agile & Scrum">Agile & Scrum</option>
              </select>
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-slate-400" />
                </span>
                <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search subject..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
              />
              </div>
            </div>
            <button
              onClick={() => setShowModal('subject')}
              className="w-full sm:w-auto bg-[#2f66e0] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Subject</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Subject title</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Internal trainer</th>
                  <th className="py-3 px-4">External trainer</th>
                  <th className="py-3 px-4">Achieve skills</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {subjects
                  .filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-3.5 px-4 font-black text-slate-900">{s.title}</td>
                      <td className="py-3.5 px-4 text-slate-500">{s.course}</td>
                      <td className="py-3.5 px-4">{s.internalTrainer}</td>
                      <td className="py-3.5 px-4">{s.externalTrainer}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-blue-50 text-[#2f66e0] px-2.5 py-0.5 rounded-full text-[10px] font-extrabold">
                          {s.skill}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button onClick={() => triggerEdit('subject', s)} className="border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Schedule' && (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 w-full sm:max-w-xl">
              <select className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold py-2 px-3 focus:outline-none whitespace-nowrap">
                <option value="">All courses</option>
              </select>
              <select className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold py-2 px-3 focus:outline-none whitespace-nowrap">
                <option value="">All status</option>
              </select>
              <input type="text" placeholder="dd/mm/yyyy" className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium py-1.5 px-3 focus:outline-none w-32" />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button onClick={() => addToast('Schedule copied to clipboard', 'success')} className="bg-slate-150 border border-slate-200 text-slate-700 hover:bg-slate-200 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer">
                Copy schedule
              </button>
              <button
                onClick={() => setShowModal('schedule')}
                className="bg-[#2f66e0] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create New</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Course title</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4 text-center">Days</th>
                  <th className="py-3 px-4">Fee (MYR)</th>
                  <th className="py-3 px-4">Company cont.</th>
                  <th className="py-3 px-4">Request before</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {schedules.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-black text-slate-900">{s.courseTitle}</td>
                    <td className="py-3.5 px-4">{s.type}</td>
                    <td className="py-3.5 px-4">{s.period}</td>
                    <td className="py-3.5 px-4 text-center font-mono">{s.days}</td>
                    <td className="py-3.5 px-4 font-mono">{s.fee}</td>
                    <td className="py-3.5 px-4 font-mono text-indigo-600">{s.companyCont}</td>
                    <td className="py-3.5 px-4 text-slate-500">{s.requestBefore}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        s.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        s.status === 'Ongoing' ? 'bg-indigo-100 text-indigo-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button onClick={() => triggerEdit('schedule', s)} className="border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Training Request' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b pb-2">New training request</h3>
            <form onSubmit={handleSubmissionRequest} className="space-y-4 text-xs font-semibold text-slate-700">
              <div className="space-y-1">
                <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Course title <span className="text-rose-500">*</span></label>
                <select
                  value={formCourse}
                  onChange={e => setFormCourse(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#2f66e0]"
                >
                  <option value="Excel advanced">Excel advanced</option>
                  <option value="Leadership essentials">Leadership essentials</option>
                  <option value="ISO 9001 awareness">ISO 9001 awareness</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Date from</label>
                  <input type="date" value={formDateFrom} onChange={e => setFormDateFrom(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Date to</label>
                  <input type="date" value={formDateTo} onChange={e => setFormDateTo(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">No. of days</label>
                  <input type="number" value={formDays} onChange={e => setFormDays(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Course fee (MYR)</label>
                  <input type="text" value={formFee} onChange={e => setFormFee(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none font-mono" />
                </div>
              </div>

              <div className="space-y-2.5 bg-slate-50 p-4.5 rounded-2xl border border-slate-100">
                <span className="text-[10.5px] uppercase text-slate-400 font-extrabold block">Training schedule selection <span className="text-rose-500">*</span></span>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="mt-0.5 rounded text-[#2f66e0]" />
                  <span>Team leadership — 12 May, 09:00–13:00</span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="mt-0.5 rounded text-[#2f66e0]" />
                  <span>Decision making — 13 May, 09:00–12:00</span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 rounded text-[#2f66e0]" />
                  <span>Conflict resolution — 14 May, 14:00–17:00</span>
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Location <span className="text-rose-500">*</span></label>
                <input type="text" value={formLocation} onChange={e => setFormLocation(e.target.value)} placeholder="e.g. Training room A, Level 3" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#2f66e0]" />
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Request reason</label>
                <textarea rows={3} value={formReason} onChange={e => setFormReason(e.target.value)} placeholder="Reason for this training request..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none" />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formEmailNotify} onChange={e => setFormEmailNotify(e.target.checked)} className="rounded text-[#2f66e0]" />
                <span className="text-xs text-slate-600 font-bold">Send email notification to approver</span>
              </label>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button type="button" onClick={() => resetForm()} className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-black py-2.5 rounded-xl cursor-pointer text-center">Cancel</button>
                <button type="submit" className="bg-[#2f66e0] hover:bg-blue-700 text-white font-black py-2.5 rounded-xl cursor-pointer text-center">Submit request</button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">My training (status tracker)</h3>
              <div className="flex items-center gap-1 text-[10px] font-black text-slate-400">
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">Pending: {myRequests.filter(r => r.status === 'Pending').length}</span>
                <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-md">Allocated: {myRequests.filter(r => r.status === 'Allocated').length}</span>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-left border-collapse text-xs font-semibold text-slate-700">
                <thead>
                  <tr className="bg-slate-50 text-[10.5px] font-bold text-slate-500 uppercase">
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myRequests.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/40">
                      <td className="py-3.5 px-4 font-black text-slate-900">{r.course}</td>
                      <td className="py-3.5 px-4 font-mono">{r.date}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold ${
                          r.status === 'Allocated' ? 'bg-green-100 text-green-700' :
                          r.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                          r.status === 'Denied' ? 'bg-rose-100 text-rose-700' :
                          'bg-amber-100 text-amber-700 font-extrabold'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button onClick={() => addToast(`Reviewing credentials details for ${r.course}`, 'info')} className="border border-slate-200 hover:bg-slate-50 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer">
                          View
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

      {activeTab === 'Request On Behalf' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b pb-2">Request on behalf</h3>
            <form onSubmit={handleBehalfRequest} className="space-y-4 text-xs font-semibold text-slate-700">
              <div className="space-y-2">
                <span className="text-[10.5px] uppercase text-slate-400 font-extrabold block">Select employees</span>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={behalfEmpChoice === 'individual'} onChange={() => setBehalfEmpChoice('individual')} className="text-[#2f66e0]" />
                    <span>Individual employees</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={behalfEmpChoice === 'all'} onChange={() => setBehalfEmpChoice('all')} className="text-[#2f66e0]" />
                    <span>All department</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Submit for <span className="text-rose-500">*</span></label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                    <option>Individual employees</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Department</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                    <option>-- Select --</option>
                    <option>Engineering</option>
                    <option>HR</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 bg-slate-50 p-4.5 rounded-2xl border border-slate-100">
                <span className="text-[10.5px] uppercase text-slate-400 font-extrabold block">Employees <span className="text-rose-500">*</span></span>
                {['Sarah Lim (EMP-0021) — Engineering', 'Raj Kumar (EMP-0048) — Engineering', 'Ahmad Luqman (EMP-0187) — Operations'].map((empName) => {
                  const plainName = empName.split(' (')[0];
                  const isChecked = behalfSelectedEmps.includes(plainName);
                  return (
                    <label key={empName} className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setBehalfSelectedEmps(prev => prev.filter(x => x !== plainName));
                          } else {
                            setBehalfSelectedEmps(prev => [...prev, plainName]);
                          }
                        }}
                        className="rounded text-[#2f66e0]"
                      />
                      <span>{empName}</span>
                    </label>
                  );
                })}
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="text-[10.5px] uppercase text-slate-400 font-extrabold block">Training details</span>
                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Course title <span className="text-rose-500">*</span></label>
                  <select value={behalfCourse} onChange={e => setBehalfCourse(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                    <option value="Leadership essentials">Leadership essentials (12–14 May)</option>
                    <option value="Excel advanced">Excel advanced (6–7– May)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Location</label>
                    <input type="text" value={behalfLocation} onChange={e => setBehalfLocation(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Company contribution</label>
                    <input type="text" value={behalfContribution} onChange={e => setBehalfContribution(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-[#2f66e0]" />
                  <span className="text-slate-600 font-bold">Send email to approver</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-[#2f66e0]" />
                  <span className="text-slate-600 font-bold">Approve now (bypass email approval)</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button type="button" onClick={() => setBehalfSelectedEmps([])} className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-black py-2.5 rounded-xl cursor-pointer text-center">Cancel</button>
                <button type="submit" className="bg-[#2f66e0] hover:bg-blue-700 text-white font-black py-2.5 rounded-xl cursor-pointer text-center">Submit on behalf</button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b pb-2">My submitted requests on behalf</h3>
            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-left border-collapse text-xs font-semibold text-slate-700">
                <thead>
                  <tr className="bg-slate-50 text-[10.5px] font-bold text-slate-500 uppercase">
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submittedBehalf.map((sb) => (
                    <tr key={sb.id} className="hover:bg-slate-50/40">
                      <td className="py-3.5 px-4 font-black text-slate-900 flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600">
                          {sb.employee.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <span>{sb.employee}</span>
                      </td>
                      <td className="py-3.5 px-4">{sb.course}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">{sb.date}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${sb.status === 'Allocated' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {sb.status}
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

      {activeTab === 'Approval' && (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-50 pb-2">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Approval Queue</h3>
              <p className="text-[10.5px] font-black text-slate-400 mt-0.5">Please review pending training nominations and verify resource limits</p>
            </div>
            <div className="flex items-center gap-1.5 text-[10.5px] font-extrabold bg-amber-50 text-amber-800 py-1.5 px-3 rounded-xl border border-amber-100/40">
              <Clock className="h-3.5 w-3.5" />
              <span>{approvals.filter(a => a.status === 'Pending').length} pending approvals</span>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-left border-collapse text-xs font-semibold text-slate-700">
              <thead>
                <tr className="bg-slate-50 text-[10.5px] font-bold text-slate-500 uppercase">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Approved by</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {approvals.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/40">
                    <td className="py-3.5 px-4 font-black text-slate-900 flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-[#2f66e0]/10 text-[#2f66e0] flex items-center justify-center text-[10px] font-black">
                        {app.employee.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <span>{app.employee}</span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900">{app.course}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{app.date}</td>
                    <td className="py-3.5 px-4 text-slate-500">{app.location}</td>
                    <td className="py-3.5 px-4 space-y-1">
                      {app.approvedBy.map((ap, i) => (
                        <div key={i} className="flex items-center gap-1 text-[11px] font-bold">
                          <span className={`h-2 w-2 rounded-full ${ap.approved ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <span className={ap.approved ? 'text-slate-900' : 'text-slate-400'}>
                            {ap.name} {ap.approved && '✓'}
                          </span>
                        </div>
                      ))}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                        app.status === 'Denied' ? 'bg-rose-100 text-rose-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                      {app.status === 'Pending' ? (
                        <>
                          <button
                            onClick={() => handleApprovalAction(app.id, 'Approved')}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg cursor-pointer inline-flex items-center gap-0.5"
                          >
                            <Check className="h-3 w-3" /> Approve
                          </button>
                          <button
                            onClick={() => handleApprovalAction(app.id, 'Denied')}
                            className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg cursor-pointer inline-flex items-center gap-0.5"
                          >
                            <X className="h-3 w-3" /> Deny
                          </button>
                        </>
                      ) : (
                        <span className="text-[10.5px] italic text-slate-400">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Attendance' && (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 w-full sm:max-w-xl">
              <select className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold py-2 px-3 focus:outline-none whitespace-nowrap">
                <option>All courses</option>
              </select>
              <select className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold py-2 px-3 focus:outline-none whitespace-nowrap">
                <option>All departments</option>
              </select>
              <input type="text" placeholder="06/05/2026" className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium py-1.5 px-3 focus:outline-none w-32" />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button onClick={() => addToast('Punctuality stats compiled successfully', 'success')} className="bg-slate-150 border border-slate-200 text-slate-700 hover:bg-slate-200 font-bold text-xs px-4 py-2 rounded-xl cursor-pointer">
                Reset
              </button>
              <button
                onClick={() => setShowModal('attendance')}
                className="bg-[#2f66e0] hover:bg-opacity-95 text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create New Attendance</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-left border-collapse text-xs font-semibold text-slate-700">
              <thead>
                <tr className="bg-slate-50 text-[10.5px] font-bold text-slate-500 uppercase">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Course / Subject</th>
                  <th className="py-3 px-4">Schedule date</th>
                  <th className="py-3 px-4">Actual date</th>
                  <th className="py-3 px-4">Time in</th>
                  <th className="py-3 px-4">Time out</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendance.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/40">
                    <td className="py-3.5 px-4 font-black text-slate-900 flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-mono font-black text-slate-600">
                        {att.employee.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <span>{att.employee}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{att.subject}</td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono">{att.scheduleDate}</td>
                    <td className="py-3.5 px-4 text-slate-800 font-mono">{att.actualDate}</td>
                    <td className="py-3.5 px-4 font-mono font-black">{att.timeIn}</td>
                    <td className="py-3.5 px-4 font-mono font-black">{att.timeOut}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        att.status === 'Present' ? 'bg-green-100 text-green-700' :
                        att.status === 'Late' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {att.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button onClick={() => triggerEdit('attendance', att)} className="border border-slate-200 hover:bg-slate-50 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Training History' && (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 w-full sm:max-w-xl">
              <select className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold py-2 px-3 focus:outline-none whitespace-nowrap">
                <option>All status</option>
              </select>
              <select className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold py-2 px-3 focus:outline-none whitespace-nowrap">
                <option>All departments</option>
              </select>
              <select className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold py-2 px-3 focus:outline-none whitespace-nowrap">
                <option>All courses</option>
              </select>
              <div className="relative flex-1 min-w-[200px]">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-slate-400" />
                </span>
                <input type="text" placeholder="Search employee..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none" />
              </div>
            </div>
            <button onClick={() => addToast('Downloaded complete corporate records as CSV', 'success')} className="bg-blue-50 hover:bg-blue-100 text-[#2f66e0] font-black text-xs px-4.5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-center">
              <Download className="h-4 w-4" />
              <span>Export history</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-left border-collapse text-xs font-semibold text-slate-700">
              <thead>
                <tr className="bg-slate-50 text-[10.5px] font-bold text-slate-500 uppercase">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Course title</th>
                  <th className="py-3 px-4 text-center">Days</th>
                  <th className="py-3 px-4">Fee (MYR)</th>
                  <th className="py-3 px-4">Approved by</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/40">
                  <td className="py-3.5 px-4 font-black text-slate-900">Sarah Lim</td>
                  <td className="py-3.5 px-4">Leadership essentials</td>
                  <td className="py-3.5 px-4 text-center font-mono">3</td>
                  <td className="py-3.5 px-4 font-mono">500</td>
                  <td className="py-3.5 px-4">David Ng &bull; pending</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[10px]">Pending</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="border border-slate-200 hover:bg-slate-50 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all">View</button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/40">
                  <td className="py-3.5 px-4 font-black text-slate-900">Raj Kumar</td>
                  <td className="py-3.5 px-4">Excel advanced</td>
                  <td className="py-3.5 px-4 text-center font-mono">2</td>
                  <td className="py-3.5 px-4 font-mono">200</td>
                  <td className="py-3.5 px-4">David Ng ✓</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px]">Completed</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="border border-slate-200 hover:bg-slate-50 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all">View</button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/40">
                  <td className="py-3.5 px-4 font-black text-slate-900">Maya Tan</td>
                  <td className="py-3.5 px-4">Excel advanced</td>
                  <td className="py-3.5 px-4 text-center font-mono">2</td>
                  <td className="py-3.5 px-4 font-mono">200</td>
                  <td className="py-3.5 px-4">Nina Reza ✓</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px]">Allocated</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="border border-slate-200 hover:bg-slate-50 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all">View</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Reports' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header Row */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[#2f66e0]" />
                <span>Training Management Analytics & Reports</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Monitor corporate safety compliance, workforce skill acquisitions, and strategic budget allocations.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedReportType('compliance');
                  setReportSearch('');
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedReportType === 'compliance'
                    ? 'bg-blue-500 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ShieldAlert className="h-4 w-4" />
                <span>Compliance & Safety</span>
              </button>
              
              <button
                onClick={() => {
                  setSelectedReportType('skills');
                  setReportSearch('');
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedReportType === 'skills'
                    ? 'bg-blue-500 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <GraduationCap className="h-4 w-4" />
                <span>Skills Gap Matrix</span>
              </button>
              
              <button
                onClick={() => {
                  setSelectedReportType('budget');
                  setReportSearch('');
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedReportType === 'budget'
                    ? 'bg-blue-500 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <DollarSign className="h-4 w-4" />
                <span>Budget & Vendor Invoices</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Compliance Rate</span>
                <span className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                  <ShieldAlert className="h-4 w-4" />
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">83.3%</h3>
                <p className="text-[10.5px] text-slate-500 mt-1 font-semibold">5 of 6 mandatory sign-offs completed</p>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: '83.3%' }}></div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Skills Identified</span>
                <span className="p-2 bg-blue-50 rounded-xl text-blue-600">
                  <GraduationCap className="h-4 w-4" />
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">6 Core Skills</h3>
                <p className="text-[10.5px] text-slate-500 mt-1 font-semibold">Actively tracked across 4 departments</p>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#2f66e0] h-full" style={{ width: '60%' }}></div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Total Invested Budget</span>
                <span className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                  <DollarSign className="h-4 w-4" />
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">MYR 8,400</h3>
                <p className="text-[10.5px] text-slate-500 mt-1 font-semibold">Commited corporate training funds</p>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Training Formats</span>
                <span className="p-2 bg-amber-50 rounded-xl text-amber-600">
                  <TrendingUp className="h-4 w-4" />
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">3 Formats</h3>
                <p className="text-[10.5px] text-slate-500 mt-1 font-semibold">50% Internal, 30% External, 20% Overseas</p>
              </div>
              <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="bg-[#2f66e0] h-full" style={{ width: '50%' }} />
                <div className="bg-emerald-500 h-full" style={{ width: '30%' }} />
                <div className="bg-indigo-500 h-full" style={{ width: '20%' }} />
              </div>
            </div>
          </div>

          {/* Interactive Report Content area */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-5">
            {/* Table Filter Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 w-full sm:max-w-md">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-4 w-4 text-slate-400" />
                  </span>
                  <input
                    type="text"
                    value={reportSearch}
                    onChange={(e) => setReportSearch(e.target.value)}
                    placeholder={
                      selectedReportType === 'compliance' ? 'Search employee or course...' :
                      selectedReportType === 'skills' ? 'Search employee, department or skill...' : 'Search vendor or course...'
                    }
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
                  />
                </div>
                
                {selectedReportType === 'skills' && (
                  <select
                    value={reportFilterDept}
                    onChange={(e) => setReportFilterDept(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold py-2 px-3 focus:outline-none"
                  >
                    <option value="All">All Departments</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="Human Resources">HR</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                )}
              </div>
              
              <button
                onClick={() => {
                  const rName = selectedReportType === 'compliance' ? 'Compliance Ledger' :
                                selectedReportType === 'skills' ? 'Skills Matrix Audit' : 'Budget & Invoice Records';
                  addToast(`Exported training ${rName} report as high-fidelity Spreadsheet successfully`, 'success');
                }}
                className="bg-blue-50 hover:bg-blue-100 text-[#2f66e0] font-black text-xs px-4.5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-center"
              >
                <Download className="h-4 w-4" />
                <span>Export Report Data</span>
              </button>
            </div>

            {/* Compliance Report Table */}
            {selectedReportType === 'compliance' && (
              <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs font-semibold text-slate-700">
                  <thead>
                    <tr className="bg-slate-50 text-[10.5px] font-bold text-slate-500 uppercase">
                      <th className="py-3 px-4">Employee</th>
                      <th className="py-3 px-4">Course Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Due Date</th>
                      <th className="py-3 px-4 text-center">Mandatory</th>
                      <th className="py-3 px-4">Completion Status</th>
                      <th className="py-3 px-4 text-right">Sign Off</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { employee: 'Sarah Lim', course: 'Leadership essentials', category: 'Compliance', dueDate: '12 May', mandatory: 'Yes', status: 'Completed', signOff: 'David Ng ✓' },
                      { employee: 'Raj Kumar', course: 'Excel advanced', category: 'Technical', dueDate: '06 May', mandatory: 'No', status: 'Completed', signOff: 'David Ng ✓' },
                      { employee: 'Maya Tan', course: 'ISO 9001 awareness', category: 'Compliance', dueDate: '02 May', mandatory: 'Yes', status: 'Overdue', signOff: '—' },
                      { employee: 'Ahmad Luqman', course: 'Agile & Scrum', category: 'Management', dueDate: '20 May', mandatory: 'Yes', status: 'Completed', signOff: 'Nina Reza ✓' },
                      { employee: 'Nadia Chen', course: 'Public speaking', category: 'Soft skills', dueDate: '14 May', mandatory: 'No', status: 'In Progress', signOff: '—' },
                      { employee: 'Kevin Lim', course: 'Leadership essentials', category: 'Compliance', dueDate: '12 May', mandatory: 'Yes', status: 'Pending', signOff: '—' },
                    ]
                      .filter(item => {
                        return (
                          item.employee.toLowerCase().includes(reportSearch.toLowerCase()) ||
                          item.course.toLowerCase().includes(reportSearch.toLowerCase()) ||
                          item.category.toLowerCase().includes(reportSearch.toLowerCase())
                        );
                      })
                      .map((item, index) => (
                        <tr key={index} className="hover:bg-slate-50/40">
                          <td className="py-3.5 px-4 font-black text-slate-900">{item.employee}</td>
                          <td className="py-3.5 px-4">{item.course}</td>
                          <td className="py-3.5 px-4">
                            <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                              {item.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono">{item.dueDate}</td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.mandatory === 'Yes' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {item.mandatory}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold ${
                              item.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                              item.status === 'In Progress' ? 'bg-blue-50 text-blue-700' :
                              item.status === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right font-medium text-slate-600">{item.signOff}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Skills Gap Report Table */}
            {selectedReportType === 'skills' && (
              <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs font-semibold text-slate-700">
                  <thead>
                    <tr className="bg-slate-50 text-[10.5px] font-bold text-slate-500 uppercase">
                      <th className="py-3 px-4">Employee</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Program Enrolled</th>
                      <th className="py-3 px-4">Skills Acquired / Target</th>
                      <th className="py-3 px-4 text-right">Proficiency State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { employee: 'Sarah Lim', dept: 'Human Resources', course: 'Leadership essentials', skills: 'People Management, Strategy', status: 'Mastered' },
                      { employee: 'Raj Kumar', dept: 'Engineering', course: 'Excel advanced', skills: 'Data Analysis, Pivot Tables', status: 'Proficient' },
                      { employee: 'Maya Tan', dept: 'Finance', course: 'Excel advanced', skills: 'Data Analysis, Advanced Formulas', status: 'In Progress' },
                      { employee: 'Ahmad Luqman', dept: 'Operations', course: 'Agile & Scrum', skills: 'Agile Delivery, Scrum Master', status: 'Mastered' },
                      { employee: 'Nadia Chen', dept: 'Marketing', course: 'Public speaking', skills: 'Communication, Presentation', status: 'In Progress' },
                      { employee: 'Kevin Lim', dept: 'Engineering', course: 'Leadership essentials', skills: 'Critical Thinking, Delegation', status: 'Scheduled' },
                    ]
                      .filter(item => {
                        const matchesSearch = item.employee.toLowerCase().includes(reportSearch.toLowerCase()) ||
                                              item.skills.toLowerCase().includes(reportSearch.toLowerCase()) ||
                                              item.course.toLowerCase().includes(reportSearch.toLowerCase());
                        const matchesDept = reportFilterDept === 'All' || item.dept.toLowerCase().includes(reportFilterDept.toLowerCase());
                        return matchesSearch && matchesDept;
                      })
                      .map((item, index) => (
                        <tr key={index} className="hover:bg-slate-50/40">
                          <td className="py-3.5 px-4 font-black text-slate-900">{item.employee}</td>
                          <td className="py-3.5 px-4 font-medium text-slate-600">{item.dept}</td>
                          <td className="py-3.5 px-4">{item.course}</td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1.5">
                              {item.skills.split(', ').map((skill, si) => (
                                <span key={si} className="bg-slate-50 border border-slate-200/60 text-slate-600 px-2 py-0.5 rounded-lg text-[9.5px] font-semibold">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold ${
                              item.status === 'Mastered' ? 'bg-indigo-50 text-indigo-700' :
                              item.status === 'Proficient' ? 'bg-emerald-50 text-emerald-700' :
                              item.status === 'In Progress' ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-500'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Budget & Invoices Report Table */}
            {selectedReportType === 'budget' && (
              <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs font-semibold text-slate-700">
                  <thead>
                    <tr className="bg-slate-50 text-[10.5px] font-bold text-slate-500 uppercase">
                      <th className="py-3 px-4">Vendor Partner</th>
                      <th className="py-3 px-4">Covered Course Program</th>
                      <th className="py-3 px-4">Payment Type</th>
                      <th className="py-3 px-4 text-center">Base Price</th>
                      <th className="py-3 px-4">Company Contribution</th>
                      <th className="py-3 px-4 text-right">Invoice Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { vendor: 'Executive Coaching Ltd', course: 'Leadership essentials', freq: 'One time', cost: 1500, contribution: '100% (MYR 1,500)', status: 'Approved' },
                      { vendor: 'Excel Pro Sdn Bhd', course: 'Excel advanced', freq: 'Repeat', cost: 1200, contribution: '50% (MYR 600)', status: 'Paid' },
                      { vendor: 'Apex Safe Corp', course: 'ISO 9001 awareness', freq: 'Annual', cost: 800, contribution: '100% (MYR 800)', status: 'Paid' },
                      { vendor: 'Agile Academy', course: 'Agile & Scrum', freq: 'One time', cost: 3200, contribution: '80% (MYR 2,560)', status: 'Pending Approval' },
                      { vendor: 'Global Speakers Bureau', course: 'Public speaking', freq: 'Repeat', cost: 900, contribution: '100% (MYR 900)', status: 'Approved' },
                    ]
                      .filter(item => {
                        return (
                          item.vendor.toLowerCase().includes(reportSearch.toLowerCase()) ||
                          item.course.toLowerCase().includes(reportSearch.toLowerCase())
                        );
                      })
                      .map((item, index) => (
                        <tr key={index} className="hover:bg-slate-50/40">
                          <td className="py-3.5 px-4 font-black text-slate-900">{item.vendor}</td>
                          <td className="py-3.5 px-4">{item.course}</td>
                          <td className="py-3.5 px-4 font-medium text-slate-500">{item.freq}</td>
                          <td className="py-3.5 px-4 text-center font-mono">MYR {item.cost.toLocaleString()}</td>
                          <td className="py-3.5 px-4 font-mono text-[#2f66e0]">{item.contribution}</td>
                          <td className="py-3.5 px-4 text-right">
                            <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold ${
                              item.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' :
                              item.status === 'Approved' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* POPUP MODALS */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#2f66e0]"></span>
                {editingItem ? 'Edit' : 'New'}{' '}
                {showModal === 'training_type' ? 'Training Type' :
                 showModal === 'category' ? 'Category' :
                 showModal === 'course' ? 'Course' :
                 showModal === 'subject' ? 'Subject' :
                 showModal === 'schedule' ? 'Schedule' : 'Attendance'}
              </h3>
              <button
                type="button"
                onClick={resetForm}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1 rounded-lg hover:bg-slate-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal content scroll container */}
            <div className="p-6 overflow-y-auto space-y-4">
              {showModal === 'training_type' && (
                <form onSubmit={handleAddTrainingType} className="space-y-4 text-xs font-semibold text-slate-700">
                  <div className="space-y-1">
                    <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Training Type Name</label>
                    <input
                      type="text"
                      value={newTypeName}
                      onChange={e => setNewTypeName(e.target.value)}
                      placeholder="e.g. Technical"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Description</label>
                    <textarea
                      rows={3}
                      value={newTypeDesc}
                      onChange={e => setNewTypeDesc(e.target.value)}
                      placeholder="Brief description..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Status</label>
                    <select
                      value={newTypeStatus}
                      onChange={e => setNewTypeStatus(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-50">
                    <button type="button" onClick={resetForm} className="border border-slate-200 px-4 py-2 rounded-xl">Cancel</button>
                    <button type="submit" className="bg-[#2f66e0] text-white px-4 py-2 rounded-xl whitespace-nowrap">Save parameters</button>
                  </div>
                </form>
              )}

              {showModal === 'category' && (
                <form onSubmit={handleAddCategory} className="space-y-4 text-xs font-semibold text-slate-700">
                  <div className="space-y-1">
                    <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Category Name</label>
                    <input
                      type="text"
                      value={newCatName}
                      onChange={e => setNewCatName(e.target.value)}
                      placeholder="e.g. Leadership"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Training Type</label>
                    <select
                      value={newCatType}
                      onChange={e => setNewCatType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none"
                    >
                      <option value="Management">Management</option>
                      <option value="Technical">Technical</option>
                      <option value="Compliance">Compliance</option>
                      <option value="Soft skills">Soft skills</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Description</label>
                    <textarea
                      rows={3}
                      value={newCatDesc}
                      onChange={e => setNewCatDesc(e.target.value)}
                      placeholder="Brief description..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-50">
                    <button type="button" onClick={resetForm} className="border border-slate-200 px-4 py-2 rounded-xl">Cancel</button>
                    <button type="submit" className="bg-[#2f66e0] text-white px-4 py-2 rounded-xl whitespace-nowrap">Save category</button>
                  </div>
                </form>
              )}

              {showModal === 'course' && (
                <form onSubmit={handleAddCourse} className="space-y-4 text-xs font-semibold text-slate-700">
                  <div className="space-y-1">
                    <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Course Title</label>
                    <input
                      type="text"
                      value={newCourseTitle}
                      onChange={e => setNewCourseTitle(e.target.value)}
                      placeholder="e.g. Excel advanced"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Type / Category</label>
                      <select value={newCourseType} onChange={e => setNewCourseType(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                        <option value="Management">Management</option>
                        <option value="Technical">Technical</option>
                        <option value="Compliance">Compliance</option>
                        <option value="Soft skills">Soft skills</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Delivery</label>
                      <select value={newCourseDelivery} onChange={e => setNewCourseDelivery(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                        <option value="Internal">Internal</option>
                        <option value="External">External</option>
                        <option value="Overseas">Overseas</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Frequency</label>
                      <input type="text" value={newCourseFreq} onChange={e => setNewCourseFreq(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Mandatory</label>
                      <select value={newCourseMandatory} onChange={e => setNewCourseMandatory(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-50">
                    <button type="button" onClick={resetForm} className="border border-slate-200 px-4 py-2 rounded-xl">Cancel</button>
                    <button type="submit" className="bg-[#2f66e0] text-white px-4 py-2 rounded-xl whitespace-nowrap">Save course</button>
                  </div>
                </form>
              )}

              {showModal === 'subject' && (
                <form onSubmit={handleAddSubject} className="space-y-4 text-xs font-semibold text-slate-700">
                  <div className="space-y-1">
                    <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Subject Title</label>
                    <input
                      type="text"
                      value={newSubjTitle}
                      onChange={e => setNewSubjTitle(e.target.value)}
                      placeholder="e.g. Team leadership"
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Course Category</label>
                    <select value={newSubjCourse} onChange={e => setNewSubjCourse(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
                      <option value="Leadership essentials">Leadership essentials</option>
                      <option value="Excel advanced">Excel advanced</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Internal Trainer</label>
                      <input type="text" value={newSubjInTrainer} onChange={e => setNewSubjInTrainer(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">External Trainer</label>
                      <input type="text" value={newSubjExTrainer} onChange={e => setNewSubjExTrainer(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Achieved Skills</label>
                    <input type="text" value={newSubjSkill} onChange={e => setNewSubjSkill(e.target.value)} placeholder="e.g. People mgmt" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5" />
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-50">
                    <button type="button" onClick={resetForm} className="border border-slate-200 px-4 py-2 rounded-xl">Cancel</button>
                    <button type="submit" className="bg-[#2f66e0] text-white px-4 py-2 rounded-xl whitespace-nowrap">Save subject</button>
                  </div>
                </form>
              )}

              {showModal === 'schedule' && (
                <form onSubmit={handleAddSchedule} className="space-y-4 text-xs font-semibold text-slate-700">
                  <div className="space-y-1">
                    <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Course Title</label>
                    <select value={newSchedCourse} onChange={e => setNewSchedCourse(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
                      <option value="Leadership essentials">Leadership essentials</option>
                      <option value="Excel advanced">Excel advanced</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Type</label>
                      <select value={newSchedType} onChange={e => setNewSchedType(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                        <option value="Internal">Internal</option>
                        <option value="External">External</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Period</label>
                      <input type="text" value={newSchedPeriod} onChange={e => setNewSchedPeriod(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Days</label>
                      <input type="number" value={newSchedDays} onChange={e => setNewSchedDays(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Fee (MYR)</label>
                      <input type="text" value={newSchedFee} onChange={e => setNewSchedFee(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-50">
                    <button type="button" onClick={resetForm} className="border border-slate-200 px-4 py-2 rounded-xl">Cancel</button>
                    <button type="submit" className="bg-[#2f66e0] text-white px-4 py-2 rounded-xl border border-[#2f66e0] whitespace-nowrap">Save parameters</button>
                  </div>
                </form>
              )}

              {showModal === 'attendance' && (
                <form onSubmit={handleAddAttendance} className="space-y-4 text-xs font-semibold text-slate-700">
                  <div className="space-y-1">
                    <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Employee Name</label>
                    <select value={newAttEmployee} onChange={e => setNewAttEmployee(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
                      <option value="Sarah Lim">Sarah Lim</option>
                      <option value="Raj Kumar">Raj Kumar</option>
                      <option value="Maya Tan">Maya Tan</option>
                      <option value="Ahmad Luqman">Ahmad Luqman</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Course / Subject</label>
                    <input type="text" value={newAttSubject} onChange={e => setNewAttSubject(e.target.value)} placeholder="e.g. Leadership — Team leadership" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Actual Date</label>
                      <input type="text" value={newAttDate} onChange={e => setNewAttDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Status</label>
                      <select value={newAttStatus} onChange={e => setNewAttStatus(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                        <option value="Present">Present</option>
                        <option value="Late">Late</option>
                        <option value="Absent">Absent</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Time in</label>
                      <input type="text" value={newAttIn} onChange={e => setNewAttIn(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Time out</label>
                      <input type="text" value={newAttOut} onChange={e => setNewAttOut(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-50">
                    <button type="button" onClick={resetForm} className="border border-slate-200 px-4 py-2 rounded-xl">Cancel</button>
                    <button type="submit" className="bg-[#2f66e0] text-white px-4 py-2 rounded-xl whitespace-nowrap">Save attendance</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

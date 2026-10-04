import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createLocalNumericId } from '@/lib/createLocalId';
import { useCurrency } from '@/hooks/useCurrency';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  FileSpreadsheet,
  Download,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  ChevronDown,
  Inbox,
  UserCheck,
  Award,
  ChevronRight,
  SlidersHorizontal,
  BarChart3,
  TrendingUp,
  DollarSign,
  FileText,
  CheckCircle,
  GraduationCap,
  ShieldAlert,
} from 'lucide-react';
import { ApiError, completeTrainingEnrollment, createTraining, enrollInTraining, fetchTrainingEnrollments, fetchTrainings, type TrainingEnrollmentRow, type TrainingRow } from '@/services';
import ModuleHeader from '@/components/ui/ModuleHeader';
import { SelectMenu } from '@/components/ui';
import { dateStamp, downloadNearestTableCsv } from '@/lib/csv';
import type { Employee } from '@/types';

type UiSchedule = {
  id: string | number;
  courseTitle: string;
  type: string;
  period: string;
  days: number;
  fee: string;
  companyCont: string;
  requestBefore: string;
  status: string;
};

type UiSubject = {
  id: string | number;
  title: string;
  course: string;
  internalTrainer: string;
  externalTrainer: string;
  skill: string;
};

type UiRequest = { id: string | number; course: string; date: string; status: string };

type UiBehalfRequest = { id: string | number; employee: string; course: string; date: string; status: string };

type UiApproval = {
  id: string;
  employee: string;
  course: string;
  date: string;
  location: string;
  approvedBy: { name: string; approved: boolean }[];
  status: string;
  notes?: string;
};

type UiAttendance = {
  id: string | number;
  employee: string;
  subject: string;
  scheduleDate: string;
  actualDate: string;
  timeIn: string;
  timeOut: string;
  status: string;
};

function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const d = m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDate(value: string | null | undefined): string {
  const d = parseDate(value);
  if (!d) return value || '—';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatPeriod(start: string | null | undefined, end: string | null | undefined): string {
  if (!start && !end) return '—';
  if (!start || !end || start === end) return formatDate(start || end);
  return `${formatDate(start)} – ${formatDate(end)}`;
}

function daysBetween(start: string | null | undefined, end: string | null | undefined): number {
  const s = parseDate(start);
  const e = parseDate(end);
  if (!s) return 0;
  if (!e) return 1;
  return Math.max(1, Math.round((e.getTime() - s.getTime()) / 86400000) + 1);
}

function titleCase(value: string | null | undefined): string {
  if (!value) return '—';
  return value
    .replace(/[_-]+/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function initials(name: string): string {
  return name.split(' ').filter(Boolean).map(n => n[0]).join('');
}

function scheduleStatus(row: TrainingRow): string {
  const status = (row.status || '').toLowerCase();
  if (status === 'completed' || status === 'cancelled') return titleCase(status);
  const today = parseDate(dateStamp());
  const start = parseDate(row.startDate);
  const end = parseDate(row.endDate) || start;
  if (!today || !start) return 'Upcoming';
  if (today < start) return 'Upcoming';
  if (end && today > end) return 'Completed';
  return 'Ongoing';
}

function mapScheduleRow(row: TrainingRow): UiSchedule {
  return {
    id: row.id,
    courseTitle: row.title,
    type: row.mode || 'Internal',
    period: formatPeriod(row.startDate, row.endDate),
    days: daysBetween(row.startDate, row.endDate),
    fee: row.cost != null ? `${row.cost.toLocaleString()}/pax` : '—',
    companyCont: '—',
    requestBefore: '—',
    status: scheduleStatus(row),
  };
}

const EMPTY_ROW_CLASS = 'p-6 text-center text-xs text-slate-400';

type UiCourse = {
  id: string | number;
  title: string;
  type: string;
  delivery: string;
  frequency: string;
  mandatory: string;
  dueWithin: string;
  status: string;
};

function mapTrainingRow(row: TrainingRow): UiCourse {
  return {
    id: row.id,
    title: row.title,
    type: row.category || '—',
    delivery: row.mode || 'Internal',
    frequency: '—',
    mandatory: '—',
    dueWithin: row.durationHours != null ? `${row.durationHours}h` : '—',
    status: row.status || 'Active',
  };
}

interface TrainingTabProps {
  employees: Employee[];
  addToast: (text: string, type: 'success' | 'loading' | 'error' | 'info') => void;
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

export default function TrainingTab({ employees, addToast }: TrainingTabProps) {
  const { currency, money } = useCurrency();
  const [activeTab, setActiveTab] = useState<TrainingSubTab>('Course');
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All types');

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

  const [courses, setCourses] = useState<UiCourse[]>([]);
  const [trainingRows, setTrainingRows] = useState<TrainingRow[]>([]);
  const [selectedTrainingId, setSelectedTrainingId] = useState<string>('');
  const [trainingEnrollments, setTrainingEnrollments] = useState<TrainingEnrollmentRow[]>([]);
  const [allEnrollments, setAllEnrollments] = useState<TrainingEnrollmentRow[]>([]);
  const [schedules, setSchedules] = useState<UiSchedule[]>([]);

  const loadTrainings = useCallback(async () => {
    try {
      const rows = await fetchTrainings();
      const mapped = rows.map(mapTrainingRow);
      setTrainingRows(rows);
      setCourses(mapped);
      setSchedules(rows.map(mapScheduleRow));
      const firstId = mapped[0] ? String(mapped[0].id) : '';
      setSelectedTrainingId((prev) => {
        if (prev && mapped.some((c) => String(c.id) === prev)) return prev;
        return firstId;
      });
      const results = await Promise.allSettled(rows.map((r) => fetchTrainingEnrollments(r.id)));
      const flattened = results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));
      setAllEnrollments(flattened);
      setTrainingEnrollments(firstId ? flattened.filter((e) => e.trainingId === firstId) : []);
    } catch (err) {
      setCourses([]);
      setTrainingRows([]);
      setSchedules([]);
      setTrainingEnrollments([]);
      setAllEnrollments([]);
      if (!(err instanceof ApiError) || (err.status !== 401 && err.status !== 403)) {
        addToast('Could not load trainings from the server.', 'error');
      }
    }
  }, [addToast]);

  useEffect(() => {
    void loadTrainings();
  }, [loadTrainings]);

  const loadEnrollmentsForTraining = useCallback(async (trainingId: string) => {
    if (!trainingId) {
      setTrainingEnrollments([]);
      return;
    }
    try {
      const enrollments = await fetchTrainingEnrollments(trainingId);
      setTrainingEnrollments(enrollments);
      setAllEnrollments((prev) => [...prev.filter((e) => e.trainingId !== trainingId), ...enrollments]);
    } catch (err) {
      setTrainingEnrollments([]);
      if (!(err instanceof ApiError) || (err.status !== 401 && err.status !== 403)) {
        addToast('Could not load training enrollments.', 'error');
      }
    }
  }, [addToast]);

  useEffect(() => {
    if (!selectedTrainingId) return;
    void loadEnrollmentsForTraining(selectedTrainingId);
  }, [selectedTrainingId, loadEnrollmentsForTraining]);

  const [subjects, setSubjects] = useState<UiSubject[]>([]);
  const [myRequests, setMyRequests] = useState<UiRequest[]>([]);
  const [submittedBehalf, setSubmittedBehalf] = useState<UiBehalfRequest[]>([]);
  const [approvals, setApprovals] = useState<UiApproval[]>([]);
  const [attendance, setAttendance] = useState<UiAttendance[]>([]);
  const [attendanceDateFilter, setAttendanceDateFilter] = useState('');
  const [historySearch, setHistorySearch] = useState('');

  const trainingById = useMemo(() => new Map(trainingRows.map((r) => [r.id, r])), [trainingRows]);
  const employeeByApiId = useMemo(
    () => new Map(employees.filter((e) => e.apiId).map((e) => [e.apiId as string, e])),
    [employees],
  );
  const departmentOptions = useMemo(
    () => Array.from(new Set(employees.map((e) => String(e.department || '')).filter(Boolean))).sort(),
    [employees],
  );
  const courseOptions = useMemo(() => courses.map((c) => ({ value: c.title, label: c.title })), [courses]);

  const enrollmentRecords = useMemo(() => {
    const today = parseDate(dateStamp());
    return allEnrollments.map((enr) => {
      const training = trainingById.get(enr.trainingId);
      const emp = employeeByApiId.get(enr.employeeId);
      const status = titleCase(enr.status);
      const completed = !!enr.completedAt || status === 'Completed';
      const due = parseDate(training?.endDate || training?.startDate);
      const complianceStatus = completed
        ? 'Completed'
        : due && today && due < today
          ? 'Overdue'
          : /progress|ongoing|attend/i.test(enr.status)
            ? 'In Progress'
            : 'Pending';
      const courseTitle = training?.title || enr.trainingTitle || '—';
      const courseSkills = subjects.filter((s) => s.course === courseTitle && s.skill).map((s) => s.skill);
      return {
        id: enr.id,
        employee: enr.employeeName || emp?.name || '—',
        department: emp ? String(emp.department) : '—',
        course: courseTitle,
        category: training?.category || '—',
        days: training ? daysBetween(training.startDate, training.endDate) : 0,
        cost: training?.cost ?? null,
        dueDate: formatDate(training?.endDate || training?.startDate),
        status,
        completed,
        complianceStatus,
        signOff: enr.completedAt ? `✓ ${formatDate(enr.completedAt)}` : '—',
        skills: courseSkills.length > 0 ? courseSkills : training?.category ? [training.category] : [],
        proficiency: completed ? 'Proficient' : complianceStatus === 'In Progress' ? 'In Progress' : 'Scheduled',
      };
    });
  }, [allEnrollments, trainingById, employeeByApiId, subjects]);

  const budgetRows = useMemo(
    () =>
      trainingRows
        .filter((r) => r.cost != null)
        .map((r) => {
          const pax = allEnrollments.filter((e) => e.trainingId === r.id).length;
          const cost = r.cost ?? 0;
          return {
            id: r.id,
            vendor: r.trainer || '—',
            course: r.title,
            freq: titleCase(r.mode),
            cost,
            pax,
            contribution: `${money(cost * pax)} (${pax} pax)`,
            status: titleCase(r.status),
          };
        }),
    [trainingRows, allEnrollments, money],
  );

  const reportMetrics = useMemo(() => {
    const total = enrollmentRecords.length;
    const done = enrollmentRecords.filter((r) => r.completed).length;
    const categories = new Set(trainingRows.map((r) => r.category).filter(Boolean));
    const coveredDepts = new Set(enrollmentRecords.map((r) => r.department).filter((d) => d !== '—'));
    const committed = budgetRows.reduce((sum, r) => sum + r.cost * r.pax, 0);
    const spentCompleted = enrollmentRecords.reduce((sum, r) => sum + (r.completed ? r.cost ?? 0 : 0), 0);
    const modeCounts = new Map<string, number>();
    trainingRows.forEach((r) => {
      const mode = titleCase(r.mode || 'Internal');
      modeCounts.set(mode, (modeCounts.get(mode) || 0) + 1);
    });
    const formats = Array.from(modeCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([mode, count]) => ({ mode, pct: Math.round((count / trainingRows.length) * 100) }));
    return {
      total,
      done,
      complianceRate: total > 0 ? (done / total) * 100 : 0,
      skillsCount: categories.size,
      deptCount: coveredDepts.size,
      deptPct: departmentOptions.length > 0 ? (coveredDepts.size / departmentOptions.length) * 100 : 0,
      committed,
      spentPct: committed > 0 ? Math.min(100, (spentCompleted / committed) * 100) : 0,
      formats,
    };
  }, [enrollmentRecords, trainingRows, budgetRows, departmentOptions]);

  // FORM INPUTS
  const [formCourse, setFormCourse] = useState('');
  const [formDateFrom, setFormDateFrom] = useState(() => dateStamp());
  const [formDateTo, setFormDateTo] = useState(() => dateStamp());
  const [formDays, setFormDays] = useState(1);
  const [formFee, setFormFee] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formReason, setFormReason] = useState('');
  const [formEmailNotify, setFormEmailNotify] = useState(true);

  // REQUEST ON BEHALF INPUTS
  const [behalfEmpChoice, setBehalfEmpChoice] = useState<'individual' | 'all'>('individual');
  const [behalfSelectedEmps, setBehalfSelectedEmps] = useState<string[]>([]);
  const [behalfScope, setBehalfScope] = useState('Individual employees');
  const [behalfDept, setBehalfDept] = useState('');
  const [behalfCourse, setBehalfCourse] = useState('');
  const [behalfLocation, setBehalfLocation] = useState('');
  const [behalfContribution, setBehalfContribution] = useState(() => `100% / Fixed ${currency}`);

  const behalfEmployees = useMemo(
    () => employees.filter((e) => !behalfDept || String(e.department) === behalfDept),
    [employees, behalfDept],
  );

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
  const [newSubjCourse, setNewSubjCourse] = useState('');
  const [newSubjInTrainer, setNewSubjInTrainer] = useState('');
  const [newSubjExTrainer, setNewSubjExTrainer] = useState('—');
  const [newSubjSkill, setNewSubjSkill] = useState('');

  const [newSchedCourse, setNewSchedCourse] = useState('');
  const [newSchedType, setNewSchedType] = useState('Internal');
  const [newSchedPeriod, setNewSchedPeriod] = useState('');
  const [newSchedDays, setNewSchedDays] = useState(1);
  const [newSchedFee, setNewSchedFee] = useState('');
  const [newSchedCont, setNewSchedCont] = useState('100%');
  const [newSchedBefore, setNewSchedBefore] = useState('7 days');

  const [newAttEmployee, setNewAttEmployee] = useState('');
  const [newAttSubject, setNewAttSubject] = useState('');
  const [newAttDate, setNewAttDate] = useState(() => formatDate(dateStamp()));
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
        id: createLocalNumericId(),
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
        id: createLocalNumericId(),
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

  const handleAddCourse = async (e: React.FormEvent) => {
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
      try {
        const created = await createTraining({
          title: newCourseTitle.trim(),
          category: newCourseType || undefined,
          mode: newCourseDelivery || undefined,
          status: 'Active',
        });
        setCourses(prev => [...prev, mapTrainingRow(created)]);
        addToast(`Added new course: ${newCourseTitle}`, 'success');
      } catch (err) {
        addToast(err instanceof ApiError ? err.message : 'Could not create training.', 'error');
        return;
      }
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
        id: createLocalNumericId(),
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
    if (!newSchedCourse) {
      addToast('Please select a course', 'error');
      return;
    }
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
        id: createLocalNumericId(),
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
    if (!newAttEmployee) {
      addToast('Please select an employee', 'error');
      return;
    }
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
        id: createLocalNumericId(),
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
    if (!formCourse) {
      addToast('Please select a course', 'error');
      return;
    }
    const newReq = {
      id: createLocalNumericId(),
      course: formCourse,
      date: formatPeriod(formDateFrom, formDateTo),
      status: 'Pending',
    };
    setMyRequests(prev => [newReq, ...prev]);
    addToast(`Training request for ${formCourse} added to your tracker.`, 'info');
    setFormReason('');
  };

  const handleBehalfRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (behalfSelectedEmps.length === 0) {
      addToast('Please select at least one employee', 'error');
      return;
    }

    const training =
      courses.find((c) => c.title === behalfCourse) ||
      courses.find((c) => String(c.id) === selectedTrainingId) ||
      courses[0];
    if (!training) {
      addToast('No training course available to enroll into.', 'error');
      return;
    }

    const trainingId = String(training.id);
    let successCount = 0;

    for (const empId of behalfSelectedEmps) {
      const emp = employees.find((x) => x.id === empId);
      const empName = emp?.name || empId;
      const employeeApiId = emp?.apiId;
      if (!employeeApiId) {
        addToast(`Could not enroll ${empName}: missing server id (apiId).`, 'error');
        continue;
      }
      try {
        await enrollInTraining(trainingId, employeeApiId);
        successCount += 1;
        setSubmittedBehalf((prev) => [
          {
            id: createLocalNumericId(),
            employee: empName,
            course: training.title,
            date: formatDate(dateStamp()),
            status: 'Pending',
          },
          ...prev,
        ]);
      } catch (err) {
        addToast(
          err instanceof ApiError ? err.message : `Could not enroll ${empName}.`,
          'error',
        );
      }
    }

    if (successCount > 0) {
      setSelectedTrainingId(trainingId);
      await loadEnrollmentsForTraining(trainingId);
      addToast(`Successfully enrolled ${successCount} employee(s) in ${training.title}`, 'success');
    }
  };

  const handleCompleteEnrollment = async (enr: TrainingEnrollmentRow) => {
    try {
      await completeTrainingEnrollment(enr.trainingId, enr.id);
      await loadEnrollmentsForTraining(enr.trainingId);
      addToast(`Marked ${enr.employeeName} as completed`, 'success');
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Could not complete enrollment.', 'error');
    }
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
    setNewAttEmployee('');
    setNewAttSubject('');
    setNewAttDate(formatDate(dateStamp()));
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
    { label: 'Course' },
  ];

  return (
    <div id="training-management-container" className="space-y-6">
      <ModuleHeader
        title="Training"
        description="Courses, enrolments, and learning records."
      />
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
                if (tab.label === 'Course') setDepartmentFilter('All types');
                else if (tab.label === 'Category') setDepartmentFilter('All training types');
                else setDepartmentFilter('All departments');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.label
                  ? 'bg-blue-50 text-novora'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black leading-none inline-flex items-center whitespace-nowrap shrink-0">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              const n = downloadNearestTableCsv(e.currentTarget, `training_${dateStamp()}`);
              addToast(n ? `Exported ${n} rows as CSV.` : 'Nothing to export yet.', n ? 'success' : 'info');
            }}
            className="nv-toolbar-btn"
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
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-novora"
              />
            </div>
            <button
              onClick={() => setShowModal('training_type')}
              className="w-full sm:w-auto bg-novora hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
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
                        <button
                          title="Edit"
                          onClick={() => triggerEdit('training_type', t)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-novora hover:bg-slate-50 transition-colors cursor-pointer inline-flex items-center justify-center"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
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
              <SelectMenu
                value={departmentFilter}
                onChange={setDepartmentFilter}
                aria-label="Training type filter"
                className="w-auto shrink-0"
                triggerClassName="nv-select-trigger--toolbar min-w-[9.5rem]"
                options={[
                  { value: 'All training types', label: 'All training types' },
                  { value: 'Management', label: 'Management' },
                  { value: 'Technical', label: 'Technical' },
                  { value: 'Compliance', label: 'Compliance' },
                  { value: 'Soft skills', label: 'Soft skills' },
                ]}
              />
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
              className="w-full sm:w-auto bg-novora hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
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
                          c.type === 'Technical' ? 'bg-sky-50 text-sky-700' :
                          c.type === 'Compliance' ? 'bg-amber-50 text-amber-700' :
                          'bg-emerald-50 text-emerald-700'
                        }`}>
                          {c.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">{c.description}</td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-900">{c.subjectsCount}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          title="Edit"
                          onClick={() => triggerEdit('category', c)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-novora hover:bg-slate-50 transition-colors cursor-pointer inline-flex items-center justify-center"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
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
              <SelectMenu
                value={departmentFilter}
                onChange={setDepartmentFilter}
                aria-label="Course type filter"
                className="w-auto shrink-0"
                triggerClassName="nv-select-trigger--toolbar min-w-[8rem]"
                options={[
                  { value: 'All types', label: 'All types' },
                  { value: 'Management', label: 'Management' },
                  { value: 'Technical', label: 'Technical' },
                  { value: 'Compliance', label: 'Compliance' },
                  { value: 'Soft skills', label: 'Soft skills' },
                ]}
              />
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
              className="w-full sm:w-auto bg-novora hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
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
                    <tr
                      key={c.id}
                      onClick={() => setSelectedTrainingId(String(c.id))}
                      className={`hover:bg-slate-50/40 transition-colors cursor-pointer ${
                        selectedTrainingId === String(c.id) ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-black text-slate-900">{c.title}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold ${
                          c.type === 'Management' ? 'bg-blue-50 text-blue-700' :
                          c.type === 'Technical' ? 'bg-sky-50 text-sky-700' :
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
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-green-50 text-green-700 inline-flex items-center whitespace-nowrap shrink-0">
                          Active
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          title="Edit"
                          onClick={() => triggerEdit('course', c)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-novora hover:bg-slate-50 transition-colors cursor-pointer inline-flex items-center justify-center"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {selectedTrainingId && (
            <div className="border border-slate-100 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h6 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                  Enrollments ({trainingEnrollments.length})
                </h6>
                <span className="text-[10px] text-slate-400 font-mono">{selectedTrainingId}</span>
              </div>
              {trainingEnrollments.length === 0 ? (
                <p className="text-[11px] text-slate-400 font-semibold">No enrollments yet for this course.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {trainingEnrollments.map((enr) => (
                    <div
                      key={enr.id}
                      className="flex items-center justify-between text-xs border border-slate-50 rounded-xl px-3 py-2 bg-slate-50/50"
                    >
                      <span className="font-bold text-slate-700">{enr.employeeName}</span>
                      <span className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-novora">{enr.status}</span>
                        {!enr.completedAt && enr.status.toLowerCase() !== 'completed' && (
                          <button
                            type="button"
                            onClick={() => void handleCompleteEnrollment(enr)}
                            className="border border-slate-200 hover:bg-white px-2 py-0.5 rounded-lg text-[10px] font-bold text-slate-600 transition-all cursor-pointer inline-flex items-center gap-0.5"
                          >
                            <Check className="h-3 w-3" /> Complete
                          </button>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'Subject' && (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:max-w-md">
              <SelectMenu
                value="All courses"
                onChange={() => undefined}
                aria-label="Course filter"
                className="w-auto shrink-0"
                triggerClassName="nv-select-trigger--toolbar min-w-[9rem]"
                options={[{ value: 'All courses', label: 'All courses' }, ...courseOptions]}
              />
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
              className="w-full sm:w-auto bg-novora hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
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
                        <span className="bg-blue-50 text-novora px-2.5 py-0.5 rounded-full text-[10px] font-extrabold inline-flex items-center whitespace-nowrap shrink-0">
                          {s.skill}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          title="Edit"
                          onClick={() => triggerEdit('subject', s)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-novora hover:bg-slate-50 transition-colors cursor-pointer inline-flex items-center justify-center"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                {subjects.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                  <tr><td colSpan={6} className={EMPTY_ROW_CLASS}>No subjects yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Schedule' && (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 w-full sm:max-w-xl">
              <SelectMenu
                value="All courses"
                onChange={() => undefined}
                aria-label="Schedule course filter"
                className="w-auto shrink-0"
                triggerClassName="nv-select-trigger--toolbar min-w-[8rem]"
                options={[{ value: 'All courses', label: 'All courses' }]}
              />
              <SelectMenu
                value="All status"
                onChange={() => undefined}
                aria-label="Schedule status filter"
                className="w-auto shrink-0"
                triggerClassName="nv-select-trigger--toolbar min-w-[7.5rem]"
                options={[{ value: 'All status', label: 'All status' }]}
              />
              <input type="text" placeholder="dd/mm/yyyy" className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium py-1.5 px-3 focus:outline-none w-32" />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button onClick={async () => {
                if (schedules.length === 0) {
                  addToast('No schedules to copy yet.', 'info');
                  return;
                }
                const text = [
                  ['Course title', 'Type', 'Period', 'Days', `Fee (${currency})`, 'Company cont.', 'Request before', 'Status'].join('\t'),
                  ...schedules.map(s => [s.courseTitle, s.type, s.period, s.days, s.fee, s.companyCont, s.requestBefore, s.status].join('\t')),
                ].join('\n');
                try {
                  await navigator.clipboard.writeText(text);
                  addToast('Schedule copied to clipboard', 'success');
                } catch {
                  addToast('Could not copy schedule to clipboard.', 'error');
                }
              }} className="bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer">
                Copy schedule
              </button>
              <button
                onClick={() => setShowModal('schedule')}
                className="bg-novora hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 shrink-0"
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
                  <th className="py-3 px-4">Fee ({currency})</th>
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
                      <button
                          title="Edit"
                          onClick={() => triggerEdit('schedule', s)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-novora hover:bg-slate-50 transition-colors cursor-pointer inline-flex items-center justify-center"
                        >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {schedules.length === 0 && (
                  <tr><td colSpan={9} className={EMPTY_ROW_CLASS}>No schedules yet.</td></tr>
                )}
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
                <SelectMenu
                  value={formCourse}
                  onChange={setFormCourse}
                  placeholder={courses.length === 0 ? 'No courses loaded' : '-- Select --'}
                  triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                  options={courseOptions.length === 0 ? [{ value: '', label: 'No courses loaded' }] : courseOptions}
                />
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
                  <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Course fee ({currency})</label>
                  <input type="text" value={formFee} onChange={e => setFormFee(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none font-mono" />
                </div>
              </div>

              <div className="space-y-2.5 bg-slate-50 p-4.5 rounded-2xl border border-slate-100">
                <span className="text-[10.5px] uppercase text-slate-400 font-extrabold block">Training schedule selection <span className="text-rose-500">*</span></span>
                {schedules.filter(s => s.courseTitle === formCourse).length === 0 ? (
                  <p className="text-[11px] text-slate-400 font-semibold">No schedules available for this course.</p>
                ) : (
                  schedules
                    .filter(s => s.courseTitle === formCourse)
                    .map(s => (
                      <label key={s.id} className="flex items-start gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="mt-0.5 rounded text-novora" />
                        <span>{s.courseTitle} — {s.period}</span>
                      </label>
                    ))
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Location <span className="text-rose-500">*</span></label>
                <input type="text" value={formLocation} onChange={e => setFormLocation(e.target.value)} placeholder="e.g. Training room A, Level 3" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-novora" />
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Request reason</label>
                <textarea rows={3} value={formReason} onChange={e => setFormReason(e.target.value)} placeholder="Reason for this training request..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none" />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formEmailNotify} onChange={e => setFormEmailNotify(e.target.checked)} className="rounded text-novora" />
                <span className="text-xs text-slate-600 font-bold">Send email notification to approver</span>
              </label>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button type="button" onClick={() => resetForm()} className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-black py-2.5 rounded-xl cursor-pointer text-center">Cancel</button>
                <button type="submit" className="bg-novora hover:bg-blue-700 text-white font-black py-2.5 rounded-xl cursor-pointer text-center">Submit request</button>
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
                        <button onClick={() => addToast(`${r.course} (${r.date}): ${r.status}`, 'info')} className="border border-slate-200 hover:bg-slate-50 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                  {myRequests.length === 0 && (
                    <tr><td colSpan={4} className={EMPTY_ROW_CLASS}>No training requests yet.</td></tr>
                  )}
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
                    <input type="radio" checked={behalfEmpChoice === 'individual'} onChange={() => setBehalfEmpChoice('individual')} className="text-novora" />
                    <span>Individual employees</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={behalfEmpChoice === 'all'}
                      onChange={() => {
                        setBehalfEmpChoice('all');
                        setBehalfSelectedEmps(behalfEmployees.map(emp => emp.id));
                      }}
                      className="text-novora"
                    />
                    <span>All department</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Submit for <span className="text-rose-500">*</span></label>
                  <SelectMenu
                    value={behalfScope}
                    onChange={setBehalfScope}
                    preferUp
                    triggerClassName="bg-slate-50 border-slate-200"
                    options={[
                      { value: 'Individual employees', label: 'Individual employees' },
                    ]}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Department</label>
                  <SelectMenu
                    value={behalfDept}
                    onChange={(dept) => {
                      setBehalfDept(dept);
                      if (behalfEmpChoice === 'all') {
                        setBehalfSelectedEmps(
                          employees.filter(emp => !dept || String(emp.department) === dept).map(emp => emp.id),
                        );
                      }
                    }}
                    placeholder="-- Select --"
                    preferUp
                    triggerClassName="bg-slate-50 border-slate-200"
                    options={[
                      { value: '', label: '-- Select --' },
                      ...departmentOptions.map(d => ({ value: d, label: d })),
                    ]}
                  />
                </div>
              </div>

              <div className="space-y-2 bg-slate-50 p-4.5 rounded-2xl border border-slate-100">
                <span className="text-[10.5px] uppercase text-slate-400 font-extrabold block">Employees <span className="text-rose-500">*</span></span>
                {behalfEmployees.length === 0 && (
                  <p className="text-[11px] text-slate-400 font-semibold">No employees available.</p>
                )}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {behalfEmployees.map((emp) => {
                    const isChecked = behalfSelectedEmps.includes(emp.id);
                    return (
                      <label key={emp.id} className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setBehalfSelectedEmps(prev => prev.filter(x => x !== emp.id));
                            } else {
                              setBehalfSelectedEmps(prev => [...prev, emp.id]);
                            }
                          }}
                          className="rounded text-novora"
                        />
                        <span>{emp.name} ({emp.id}){emp.department ? ` — ${emp.department}` : ''}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="text-[10.5px] uppercase text-slate-400 font-extrabold block">Training details</span>
                <div className="space-y-1">
                  <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Course title <span className="text-rose-500">*</span></label>
                  <SelectMenu
                    value={behalfCourse}
                    onChange={setBehalfCourse}
                    preferUp
                    placeholder={courses.length === 0 ? 'No courses loaded' : undefined}
                    triggerClassName="bg-slate-50 border-slate-200"
                    options={
                      courses.length === 0
                        ? [{ value: '', label: 'No courses loaded' }]
                        : courses.map((c) => ({
                            value: c.title,
                            label: c.title,
                          }))
                    }
                  />
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
                  <input type="checkbox" defaultChecked className="rounded text-novora" />
                  <span className="text-slate-600 font-bold">Send email to approver</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-novora" />
                  <span className="text-slate-600 font-bold">Approve now (bypass email approval)</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button type="button" onClick={() => setBehalfSelectedEmps([])} className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-black py-2.5 rounded-xl cursor-pointer text-center">Cancel</button>
                <button type="submit" className="bg-novora hover:bg-blue-700 text-white font-black py-2.5 rounded-xl cursor-pointer text-center">Submit on behalf</button>
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
                        <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600 shrink-0">
                          {initials(sb.employee)}
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
                  {submittedBehalf.length === 0 && (
                    <tr><td colSpan={4} className={EMPTY_ROW_CLASS}>No requests submitted on behalf yet.</td></tr>
                  )}
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
                      <div className="h-6 w-6 rounded-full bg-novora/10 text-novora flex items-center justify-center text-[10px] font-black shrink-0">
                        {initials(app.employee)}
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
                {approvals.length === 0 && (
                  <tr><td colSpan={7} className={EMPTY_ROW_CLASS}>No training requests awaiting approval.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Attendance' && (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 w-full sm:max-w-xl">
              <SelectMenu
                value="All courses"
                onChange={() => undefined}
                aria-label="Attendance course filter"
                className="w-auto shrink-0"
                triggerClassName="nv-select-trigger--toolbar min-w-[8rem]"
                options={[{ value: 'All courses', label: 'All courses' }]}
              />
              <SelectMenu
                value="All departments"
                onChange={() => undefined}
                aria-label="Attendance department filter"
                className="w-auto shrink-0"
                triggerClassName="nv-select-trigger--toolbar min-w-[9rem]"
                options={[{ value: 'All departments', label: 'All departments' }]}
              />
              <input type="text" value={attendanceDateFilter} onChange={e => setAttendanceDateFilter(e.target.value)} placeholder="Filter date..." className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium py-1.5 px-3 focus:outline-none w-32" />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button onClick={() => { setAttendanceDateFilter(''); addToast('Attendance filters reset', 'info'); }} className="bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 font-bold text-xs px-4 py-2 rounded-xl cursor-pointer">
                Reset
              </button>
              <button
                onClick={() => setShowModal('attendance')}
                className="bg-novora hover:bg-opacity-95 text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shrink-0"
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
                {attendance
                  .filter(att => !attendanceDateFilter.trim() || att.actualDate.toLowerCase().includes(attendanceDateFilter.trim().toLowerCase()) || att.scheduleDate.toLowerCase().includes(attendanceDateFilter.trim().toLowerCase()))
                  .map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/40">
                    <td className="py-3.5 px-4 font-black text-slate-900 flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-mono font-black text-slate-600 shrink-0">
                        {initials(att.employee)}
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
                      <button
                          title="Edit"
                          onClick={() => triggerEdit('attendance', att)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-novora hover:bg-slate-50 transition-colors cursor-pointer inline-flex items-center justify-center"
                        >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {attendance.length === 0 && (
                  <tr><td colSpan={8} className={EMPTY_ROW_CLASS}>No attendance records yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Training History' && (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 w-full sm:max-w-xl">
              <SelectMenu
                value="All status"
                onChange={() => undefined}
                aria-label="History status filter"
                className="w-auto shrink-0"
                triggerClassName="nv-select-trigger--toolbar min-w-[7.5rem]"
                options={[{ value: 'All status', label: 'All status' }]}
              />
              <SelectMenu
                value="All departments"
                onChange={() => undefined}
                aria-label="History department filter"
                className="w-auto shrink-0"
                triggerClassName="nv-select-trigger--toolbar min-w-[9rem]"
                options={[{ value: 'All departments', label: 'All departments' }]}
              />
              <SelectMenu
                value="All courses"
                onChange={() => undefined}
                aria-label="History course filter"
                className="w-auto shrink-0"
                triggerClassName="nv-select-trigger--toolbar min-w-[8rem]"
                options={[{ value: 'All courses', label: 'All courses' }]}
              />
              <div className="relative flex-1 min-w-[200px]">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-slate-400" />
                </span>
                <input type="text" value={historySearch} onChange={e => setHistorySearch(e.target.value)} placeholder="Search employee..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none" />
              </div>
            </div>
            <button onClick={(e) => {
              const n = downloadNearestTableCsv(e.currentTarget, `training_records_${dateStamp()}`);
              addToast(n ? `Exported ${n} rows as CSV.` : 'Nothing to export yet.', n ? 'success' : 'info');
            }} className="bg-blue-50 hover:bg-blue-100 text-novora font-black text-xs px-4.5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-center">
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
                  <th className="py-3 px-4">Fee ({currency})</th>
                  <th className="py-3 px-4">Approved by</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enrollmentRecords
                  .filter(r => r.employee.toLowerCase().includes(historySearch.toLowerCase()) || r.course.toLowerCase().includes(historySearch.toLowerCase()))
                  .map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/40">
                      <td className="py-3.5 px-4 font-black text-slate-900">{r.employee}</td>
                      <td className="py-3.5 px-4">{r.course}</td>
                      <td className="py-3.5 px-4 text-center font-mono">{r.days || '—'}</td>
                      <td className="py-3.5 px-4 font-mono">{r.cost != null ? r.cost.toLocaleString() : '—'}</td>
                      <td className="py-3.5 px-4 text-slate-400">—</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] inline-flex items-center whitespace-nowrap shrink-0 ${
                          r.completed ? 'bg-green-100 text-green-700' :
                          /cancel|denied|reject|withdrawn/i.test(r.status) ? 'bg-rose-100 text-rose-700' :
                          /pending/i.test(r.status) ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>{r.completed ? 'Completed' : r.status}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button onClick={() => addToast(`${r.employee} — ${r.course}: ${r.completed ? 'Completed' : r.status}`, 'info')} className="border border-slate-200 hover:bg-slate-50 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all">View</button>
                      </td>
                    </tr>
                  ))}
                {enrollmentRecords.length === 0 && (
                  <tr><td colSpan={7} className={EMPTY_ROW_CLASS}>No training history yet.</td></tr>
                )}
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
                <BarChart3 className="h-5 w-5 text-novora" />
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
                <h3 className="text-2xl font-black text-slate-900">{reportMetrics.complianceRate.toFixed(1)}%</h3>
                <p className="text-[10.5px] text-slate-500 mt-1 font-semibold">{reportMetrics.done} of {reportMetrics.total} enrolments completed</p>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: `${reportMetrics.complianceRate}%` }}></div>
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
                <h3 className="text-2xl font-black text-slate-900">{reportMetrics.skillsCount} Core Skills</h3>
                <p className="text-[10.5px] text-slate-500 mt-1 font-semibold">Actively tracked across {reportMetrics.deptCount} departments</p>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-novora h-full" style={{ width: `${reportMetrics.deptPct}%` }}></div>
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
                <h3 className="text-2xl font-black text-slate-900">{money(reportMetrics.committed)}</h3>
                <p className="text-[10.5px] text-slate-500 mt-1 font-semibold">Commited corporate training funds</p>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full" style={{ width: `${reportMetrics.spentPct}%` }}></div>
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
                <h3 className="text-2xl font-black text-slate-900">{reportMetrics.formats.length} Formats</h3>
                <p className="text-[10.5px] text-slate-500 mt-1 font-semibold">
                  {reportMetrics.formats.length > 0
                    ? reportMetrics.formats.map(f => `${f.pct}% ${f.mode}`).join(', ')
                    : 'No trainings yet'}
                </p>
              </div>
              <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                {reportMetrics.formats.map((f, i) => (
                  <div
                    key={f.mode}
                    className={`${['bg-novora', 'bg-emerald-500', 'bg-indigo-500', 'bg-amber-500'][i % 4]} h-full`}
                    style={{ width: `${f.pct}%` }}
                  />
                ))}
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
                <SelectMenu
                    value={reportFilterDept}
                    onChange={setReportFilterDept}
                    className="w-auto shrink-0"
                    triggerClassName="nv-select-trigger--toolbar min-w-[8rem]"
                    options={[
                      { value: 'All', label: 'All Departments' },
                      ...departmentOptions.map(d => ({ value: d, label: d })),
                    ]}
                  />
                )}
              </div>
              
              <button
                onClick={(e) => {
                  const n = downloadNearestTableCsv(e.currentTarget, `training_report_${dateStamp()}`);
                  addToast(n ? `Exported ${n} rows as CSV.` : 'Nothing to export yet.', n ? 'success' : 'info');
                }}
                className="bg-blue-50 hover:bg-blue-100 text-novora font-black text-xs px-4.5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-center"
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
                    {enrollmentRecords
                      .map(r => ({
                        id: r.id,
                        employee: r.employee,
                        course: r.course,
                        category: r.category,
                        dueDate: r.dueDate,
                        mandatory: courses.find(c => c.title === r.course)?.mandatory || '—',
                        status: r.complianceStatus,
                        signOff: r.signOff,
                      }))
                      .filter(item => {
                        return (
                          item.employee.toLowerCase().includes(reportSearch.toLowerCase()) ||
                          item.course.toLowerCase().includes(reportSearch.toLowerCase()) ||
                          item.category.toLowerCase().includes(reportSearch.toLowerCase())
                        );
                      })
                      .map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/40">
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
                    {enrollmentRecords.length === 0 && (
                      <tr><td colSpan={7} className={EMPTY_ROW_CLASS}>No records yet.</td></tr>
                    )}
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
                    {enrollmentRecords
                      .map(r => ({
                        id: r.id,
                        employee: r.employee,
                        dept: r.department,
                        course: r.course,
                        skills: r.skills,
                        status: r.proficiency,
                      }))
                      .filter(item => {
                        const q = reportSearch.toLowerCase();
                        const matchesSearch = item.employee.toLowerCase().includes(q) ||
                                              item.dept.toLowerCase().includes(q) ||
                                              item.skills.some(s => s.toLowerCase().includes(q)) ||
                                              item.course.toLowerCase().includes(q);
                        const matchesDept = reportFilterDept === 'All' || item.dept === reportFilterDept;
                        return matchesSearch && matchesDept;
                      })
                      .map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/40">
                          <td className="py-3.5 px-4 font-black text-slate-900">{item.employee}</td>
                          <td className="py-3.5 px-4 font-medium text-slate-600">{item.dept}</td>
                          <td className="py-3.5 px-4">{item.course}</td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1.5">
                              {item.skills.length === 0 && <span className="text-slate-400">—</span>}
                              {item.skills.map((skill, si) => (
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
                    {enrollmentRecords.length === 0 && (
                      <tr><td colSpan={5} className={EMPTY_ROW_CLASS}>No records yet.</td></tr>
                    )}
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
                    {budgetRows
                      .filter(item => {
                        return (
                          item.vendor.toLowerCase().includes(reportSearch.toLowerCase()) ||
                          item.course.toLowerCase().includes(reportSearch.toLowerCase())
                        );
                      })
                      .map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/40">
                          <td className="py-3.5 px-4 font-black text-slate-900">{item.vendor}</td>
                          <td className="py-3.5 px-4">{item.course}</td>
                          <td className="py-3.5 px-4 font-medium text-slate-500">{item.freq}</td>
                          <td className="py-3.5 px-4 text-center font-mono">{money(item.cost)}</td>
                          <td className="py-3.5 px-4 font-mono text-novora">{item.contribution}</td>
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
                    {budgetRows.length === 0 && (
                      <tr><td colSpan={6} className={EMPTY_ROW_CLASS}>No records yet.</td></tr>
                    )}
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
                <span className="h-2.5 w-2.5 rounded-full bg-novora items-center shrink-0"></span>
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
                    <SelectMenu
                      value={newTypeStatus}
                      onChange={setNewTypeStatus}
                      triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                      options={[
                        { value: 'Active', label: 'Active' },
                        { value: 'Draft', label: 'Draft' },
                      ]}
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-50">
                    <button type="button" onClick={resetForm} className="border border-slate-200 px-4 py-2 rounded-xl">Cancel</button>
                    <button type="submit" className="bg-novora text-white px-4 py-2 rounded-xl">Save parameters</button>
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
                    <SelectMenu
                      value={newCatType}
                      onChange={setNewCatType}
                      triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                      options={[
                        { value: 'Management', label: 'Management' },
                        { value: 'Technical', label: 'Technical' },
                        { value: 'Compliance', label: 'Compliance' },
                        { value: 'Soft skills', label: 'Soft skills' },
                      ]}
                    />
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
                    <button type="submit" className="bg-novora text-white px-4 py-2 rounded-xl">Save category</button>
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
                      <SelectMenu
                        value={newCourseType}
                        onChange={setNewCourseType}
                        triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                        options={[
                          { value: 'Management', label: 'Management' },
                          { value: 'Technical', label: 'Technical' },
                          { value: 'Compliance', label: 'Compliance' },
                          { value: 'Soft skills', label: 'Soft skills' },
                        ]}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Delivery</label>
                      <SelectMenu
                        value={newCourseDelivery}
                        onChange={setNewCourseDelivery}
                        triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                        options={[
                          { value: 'Internal', label: 'Internal' },
                          { value: 'External', label: 'External' },
                          { value: 'Overseas', label: 'Overseas' },
                        ]}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Frequency</label>
                      <input type="text" value={newCourseFreq} onChange={e => setNewCourseFreq(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Mandatory</label>
                      <SelectMenu
                        value={newCourseMandatory}
                        onChange={setNewCourseMandatory}
                        triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                        options={[
                          { value: 'Yes', label: 'Yes' },
                          { value: 'No', label: 'No' },
                        ]}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-50">
                    <button type="button" onClick={resetForm} className="border border-slate-200 px-4 py-2 rounded-xl">Cancel</button>
                    <button type="submit" className="bg-novora text-white px-4 py-2 rounded-xl">Save course</button>
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
                    <SelectMenu
                      value={newSubjCourse}
                      onChange={setNewSubjCourse}
                      placeholder={courses.length === 0 ? 'No courses loaded' : '-- Select --'}
                      triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                      options={courseOptions.length === 0 ? [{ value: '', label: 'No courses loaded' }] : courseOptions}
                    />
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
                    <button type="submit" className="bg-novora text-white px-4 py-2 rounded-xl">Save subject</button>
                  </div>
                </form>
              )}

              {showModal === 'schedule' && (
                <form onSubmit={handleAddSchedule} className="space-y-4 text-xs font-semibold text-slate-700">
                  <div className="space-y-1">
                    <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Course Title</label>
                    <SelectMenu
                      value={newSchedCourse}
                      onChange={setNewSchedCourse}
                      placeholder={courses.length === 0 ? 'No courses loaded' : '-- Select --'}
                      triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                      options={courseOptions.length === 0 ? [{ value: '', label: 'No courses loaded' }] : courseOptions}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Type</label>
                      <SelectMenu
                        value={newSchedType}
                        onChange={setNewSchedType}
                        triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                        options={[
                          { value: 'Internal', label: 'Internal' },
                          { value: 'External', label: 'External' },
                        ]}
                      />
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
                      <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Fee ({currency})</label>
                      <input type="text" value={newSchedFee} onChange={e => setNewSchedFee(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-50">
                    <button type="button" onClick={resetForm} className="border border-slate-200 px-4 py-2 rounded-xl">Cancel</button>
                    <button type="submit" className="bg-novora text-white px-4 py-2 rounded-xl border border-novora">Save parameters</button>
                  </div>
                </form>
              )}

              {showModal === 'attendance' && (
                <form onSubmit={handleAddAttendance} className="space-y-4 text-xs font-semibold text-slate-700">
                  <div className="space-y-1">
                    <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Employee Name</label>
                    <SelectMenu
                      value={newAttEmployee}
                      onChange={setNewAttEmployee}
                      placeholder={employees.length === 0 ? 'No employees available' : '-- Select --'}
                      triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                      options={
                        employees.length === 0
                          ? [{ value: '', label: 'No employees available' }]
                          : employees.map(emp => ({ value: emp.name, label: `${emp.name} (${emp.id})` }))
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Course / Subject</label>
                    <input type="text" value={newAttSubject} onChange={e => setNewAttSubject(e.target.value)} placeholder="e.g. Course — Subject" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Actual Date</label>
                      <input type="text" value={newAttDate} onChange={e => setNewAttDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10.5px] uppercase text-slate-400 font-extrabold">Status</label>
                      <SelectMenu
                        value={newAttStatus}
                        onChange={setNewAttStatus}
                        triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                        options={[
                          { value: 'Present', label: 'Present' },
                          { value: 'Late', label: 'Late' },
                          { value: 'Absent', label: 'Absent' },
                        ]}
                      />
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
                    <button type="submit" className="bg-novora text-white px-4 py-2 rounded-xl">Save attendance</button>
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

import { useState } from 'react'
import {
  Percent,
  Sliders,
  ShieldCheck,
  ClipboardCheck,
  BarChart3,
  Bookmark,
  FileBarChart,
  User,
  Plus,
  Search,
  ChevronDown,
  Target,
  Calendar,
  Layers,
  Download,
  Settings,
} from 'lucide-react'
import { showActionToast } from '../../utils/actionToast'
import type { ModuleEmployee } from '../../types/moduleEmployee'
import { nextSeq } from '../../utils/nextSeq';

type PerformanceTabProps = {
  employees: ModuleEmployee[]
}

type SubTab =
  | 'Perf. Level'
  | 'Perf. Grade'
  | 'KPI Setting'
  | 'Eval. Type'
  | 'Eval. Category'
  | 'Eval. Setup'
  | 'Grant Permissions'
  | 'Evaluation'
  | 'Perf. Result'
  | 'Competency List'
  | 'Review Report'
  | 'Employee Profile';

export function PerformanceTab({ employees }: PerformanceTabProps) {
  const addToast = (text: string, type?: 'success' | 'loading' | 'error' | 'info') => {
    showActionToast(text, type)
  }

  const [activeSubTab, setActiveSubTab] = useState<SubTab>('Perf. Level');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All departments');
  const [selectedYear, setSelectedYear] = useState('2026');

  // Multi-dropdown support
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);

  // Core Data States
  const [levels, setLevels] = useState([
    { no: 1, name: 'Basic', description: 'Entry-level performance expectation', employees: 148, status: 'Active' },
    { no: 2, name: 'Intermediate', description: 'Mid-level, meets most expectations', employees: 612, status: 'Active' },
    { no: 3, name: 'Advanced', description: 'Senior-level, consistently exceeds targets', employees: 394, status: 'Active' },
    { no: 4, name: 'Expert', description: 'Top-tier, role model for department', employees: 130, status: 'Active' },
  ]);

  const [grades, setGrades] = useState([
    { grade: 'A', name: 'Excellent', from: 80, to: 100, apply: 'Yes', employees: 186, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { grade: 'B', name: 'Good', from: 65, to: 79, apply: 'Yes', employees: 542, color: 'text-green-600 bg-green-50 border-green-200' },
    { grade: 'C', name: 'Satisfactory', from: 50, to: 64, apply: 'Yes', employees: 398, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { grade: 'D', name: 'Needs improvement', from: 30, to: 49, apply: 'Yes', employees: 158, color: 'text-red-600 bg-red-50 border-red-200' },
  ]);

  const [attendanceKPIs, setAttendanceKPIs] = useState([
    { from: 95, to: 100, target: '100%', score: 100, textColor: 'text-green-600', scoreColor: 'bg-green-100 text-green-800' },
    { from: 85, to: 94, target: '85%', score: 85, textColor: 'text-blue-600', scoreColor: 'bg-blue-100 text-blue-800' },
    { from: 70, to: 84, target: '70%', score: 70, textColor: 'text-amber-600', scoreColor: 'bg-amber-100 text-amber-800' },
    { from: 0, to: 69, target: 'Below target', score: 0, textColor: 'text-red-500', scoreColor: 'bg-red-100 text-red-800' },
  ]);

  const [achievementKPIs, setAchievementKPIs] = useState([
    { from: 90, to: 100, target: '100%', score: 100, textColor: 'text-green-600', scoreColor: 'bg-green-100 text-green-800' },
    { from: 75, to: 89, target: '80%', score: 80, textColor: 'text-blue-600', scoreColor: 'bg-blue-100 text-blue-800' },
    { from: 60, to: 74, target: '65%', score: 65, textColor: 'text-amber-600', scoreColor: 'bg-amber-100 text-amber-800' },
    { from: 0, to: 59, target: 'Below target', score: 0, textColor: 'text-red-500', scoreColor: 'bg-red-100 text-red-800' },
  ]);

  const [evalTypes, setEvalTypes] = useState([
    { name: 'Mid-year appraisal', every: '6 months', achieveKpi: 'No', notifyBefore: '14 days', traineeEval: 'No', appraiser: 'Direct manager', status: 'Active' },
    { name: 'Year-end appraisal', every: '12 months', achieveKpi: 'Yes', notifyBefore: '30 days', traineeEval: 'No', appraiser: 'HOD + HR', status: 'Active' },
    { name: 'Probation review', every: '3 months', achieveKpi: 'No', notifyBefore: '7 days', traineeEval: 'Yes', appraiser: 'Direct manager', status: 'Active' },
    { name: 'Quarterly KPI review', every: '3 months', achieveKpi: 'Yes', notifyBefore: '7 days', traineeEval: 'No', appraiser: 'Direct manager', status: 'Active' }
  ]);

  const [evalCategories, setEvalCategories] = useState([
    { name: 'Technical skills', type: 'Attribute', weightage: 25, scoring: '1–5 rating scale', measurement: 'Measurement index', levels: '4 levels', color: 'bg-blue-100 text-blue-800' },
    { name: 'Communication', type: 'Attribute', weightage: 15, scoring: '1–5 rating scale', measurement: 'Measurement index', levels: '4 levels', color: 'bg-blue-100 text-blue-800' },
    { name: 'Leadership', type: 'Competency', weightage: 20, scoring: '1–5 rating scale', measurement: 'Measurement index', levels: '4 levels', color: 'bg-purple-100 text-purple-800' },
    { name: 'Project delivery', type: 'KPI category', weightage: 30, scoring: '% achievement', measurement: 'Target %', levels: 'Auto-calc', color: 'bg-amber-100 text-amber-800' },
    { name: 'Attendance', type: 'Attendance KPI', weightage: 10, scoring: '% attendance', measurement: 'Attendance %', levels: 'Auto-calc', color: 'bg-teal-100 text-teal-800' }
  ]);

  const [grantPermissions, setGrantPermissions] = useState([
    { evaluator: 'David Ng', type: 'Year-end appraisal', from: '1 Jan 2026', to: '31 Jan 2026', pendingCount: 8, status: 'Active', color: 'bg-blue-100 text-blue-800' },
    { evaluator: 'Nina Reza', type: 'Year-end appraisal', from: '1 Jan 2026', to: '31 Jan 2026', pendingCount: 5, status: 'Active', color: 'bg-green-100 text-green-800' },
    { evaluator: 'Kevin Lim', type: 'Mid-year appraisal', from: '1 Jun 2025', to: '30 Jun 2025', pendingCount: 0, status: 'Expired', color: 'bg-pink-100 text-pink-800' }
  ]);

  // Active Evaluation Assessment Form
  const [activeEval, setActiveEval] = useState({
    employeeName: 'Sarah Lim',
    empId: 'EMP-0021',
    reviewType: 'Year-end appraisal',
    reviewDate: '15/01/2026',
    reviewPeriod: '1 Jan 2025 – 31 Dec 2025',
    status: 'Pending (Grade calculation)',
    scores: {
      codeQuality: 4,
      problemSolving: 5,
      systemDesign: 4,
      sprintsCompleted: 92,
      bugsSLA: 88,
      attendance: '97%'
    }
  });

  const [evaluationsList, setEvaluationsList] = useState([
    { name: 'Sarah Lim', reviewType: 'Year-end appraisal', date: '15 Jan 2026', period: 'Jan–Dec 2025', status: 'Pending' },
    { name: 'Raj Kumar', reviewType: 'Year-end appraisal', date: '15 Jan 2026', period: 'Jan–Dec 2025', status: 'Pending' },
    { name: 'Ahmad L', reviewType: 'Probation review', date: '10 Jan 2026', period: 'Oct–Dec 2025', status: 'Pending' },
    { name: 'Nadia Chen', reviewType: 'Mid-year appraisal', date: '30 Jun 2025', period: 'Jan–Jun 2025', status: 'Completed' }
  ]);

  const [perfResults, _setPerfResults] = useState([
    { name: 'Sarah Lim', attr: 86.7, kpi: 90.0, comp: 82.0, attend: 97.0, total: 91.7, grade: 'A', gradeColor: 'bg-blue-100 text-blue-800 border-blue-200' },
    { name: 'Raj Kumar', attr: 80.0, kpi: 88.0, comp: 79.0, attend: 95.0, total: 86.2, grade: 'A', gradeColor: 'bg-blue-100 text-blue-800 border-blue-200' },
    { name: 'Nadia Chen', attr: 72.0, kpi: 75.0, comp: 70.0, attend: 88.0, total: 73.5, grade: 'B', gradeColor: 'bg-green-100 text-green-800 border-green-200' },
    { name: 'Maya Tan', attr: 65.0, kpi: 68.0, comp: 62.0, attend: 84.0, total: 67.5, grade: 'B', gradeColor: 'bg-green-100 text-green-800 border-green-200' },
    { name: 'Ahmad L', attr: 52.0, kpi: 55.0, comp: 50.0, attend: 80.0, total: 56.5, grade: 'C', gradeColor: 'bg-amber-100 text-amber-800 border-amber-200' }
  ]);

  const [competencies, setCompetencies] = useState([
    { name: 'Leadership', type: 'Competency', parent: '—', definition: 'Ability to guide, inspire and influence a team', color: 'bg-purple-100 text-purple-800' },
    { name: '↳ Team motivation', type: 'Sub-comp.', parent: 'Leadership', definition: 'Keeping team morale and engagement high', color: 'bg-blue-100 text-blue-800' },
    { name: '↳ Conflict resolution', type: 'Sub-comp.', parent: 'Leadership', definition: 'Handling disagreements constructively', color: 'bg-blue-100 text-blue-800' },
    { name: 'Problem solving', type: 'Competency', parent: '—', definition: 'Analytical thinking and solution design', color: 'bg-purple-100 text-purple-800' },
    { name: '↳ Root cause analysis', type: 'Sub-comp.', parent: 'Problem solving', definition: 'Identifying underlying causes of issues', color: 'bg-blue-100 text-blue-800' },
    { name: 'Adaptability', type: 'Competency', parent: '—', definition: 'Ability to adjust to change effectively', color: 'bg-purple-100 text-purple-800' }
  ]);

  // Modals Core State
  const [activeModal, setActiveModal] = useState<
    | null
    | 'level_new' | 'level_edit'
    | 'grade_new' | 'grade_edit'
    | 'kpi_new' | 'kpi_edit'
    | 'type_new' | 'type_edit'
    | 'category_new' | 'category_edit'
    | 'setup_new'
    | 'grant_permission' | 'view_list'
    | 'competency_new' | 'competency_edit'
    | 'view_report'
    | 'evaluation_new'
  >(null);

  // Level Modal Fields
  const [selectedLevelIndex, setSelectedLevelIndex] = useState<number | null>(null);
  const [lvlName, setLvlName] = useState('');
  const [lvlDesc, setLvlDesc] = useState('');
  const [lvlStatus, setLvlStatus] = useState('Active');

  // Grade Modal Fields
  const [selectedGradeIndex, setSelectedGradeIndex] = useState<number | null>(null);
  const [grdLetter, setGrdLetter] = useState('');
  const [grdName, setGrdName] = useState('');
  const [grdFrom, setGrdFrom] = useState(0);
  const [grdTo, setGrdTo] = useState(100);
  const [grdApply, setGrdApply] = useState('Yes');

  // KPI Modal Fields
  const [selectedKPIIndex, setSelectedKPIIndex] = useState<number | null>(null);
  const [selectedKPIType, setSelectedKPIType] = useState<'Attendance' | 'Achievement'>('Attendance');
  const [kpiFrom, setKpiFrom] = useState(0);
  const [kpiTo, setKpiTo] = useState(100);
  const [kpiTarget, setKpiTarget] = useState('100%');
  const [kpiScore, setKpiScore] = useState(100);

  // Type Modal Fields
  const [selectedTypeIndex, setSelectedTypeIndex] = useState<number | null>(null);
  const [tpName, setTpName] = useState('');
  const [tpEvery, setTpEvery] = useState('12 months');
  const [tpAchieveKpi, setTpAchieveKpi] = useState('Yes');
  const [tpNotify, setTpNotify] = useState('30 days');
  const [tpTrainee, setTpTrainee] = useState('No');
  const [tpAppraiser, setTpAppraiser] = useState('Direct manager');
  const [tpStatus, setTpStatus] = useState('Active');

  // Category Modal Fields
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);
  const [catName, setCatName] = useState('');
  const [catType, setCatType] = useState('Attribute');
  const [catWeight, setCatWeight] = useState(20);
  const [catScoring, setCatScoring] = useState('1–5 rating scale');
  const [catMeasurement, setCatMeasurement] = useState('Measurement index');
  const [catLevels, setCatLevels] = useState('4 levels');

  // Eval Setup Modal Fields
  const [stpName, setStpName] = useState('');
  const [stpType, setStpType] = useState('Year-end appraisal');
  const [stpCategories, setStpCategories] = useState<string[]>([
    'Technical skills (Attribute · 25%)',
    'Communication (Attribute · 15%)',
    'Leadership (Competency · 20%)',
    'Project delivery (KPI · 30%)'
  ]);
  const [_stpNextPeriod, _setStpNextPeriod] = useState('Yes');
  const [_stpTrainingNeeded, _setStpTrainingNeeded] = useState('Yes');
  const [stpCareerEnabled, setStpCareerEnabled] = useState('Yes');
  const [stpAppraiserNote, setStpAppraiserNote] = useState('Yes');

  // Grant Permission Modal Fields
  const [prmEvaluator, setPrmEvaluator] = useState('David Ng');
  const [prmType, setPrmType] = useState('Year-end appraisal');
  const [prmFrom, setPrmFrom] = useState('1 Jan 2026');
  const [prmTo, setPrmTo] = useState('31 Jan 2026');
  const [prmPending, setPrmPending] = useState(3);
  const [prmStatus, setPrmStatus] = useState('Active');

  // View List Modal Fields
  const [permissionViewItem, setPermissionViewItem] = useState<{ evaluator: string; type: string; details: string[] } | null>(null);

  // Competency Modal Fields
  const [selectedCompetencyIndex, setSelectedCompetencyIndex] = useState<number | null>(null);
  const [compName, setCompName] = useState('');
  const [compType, setCompType] = useState('Competency');
  const [compParent, setCompParent] = useState('—');
  const [compDef, setCompDef] = useState('');

  // Selected Report for view detail Modal
  const [reportDetailItem, setReportDetailItem] = useState<any | null>(null);

  // New Evaluation Form Fields
  const [evalEmpId, setEvalEmpId] = useState('');
  const [evalReviewType, setEvalReviewType] = useState('Year-end appraisal');
  const [evalReviewDate, setEvalReviewDate] = useState('');
  const [evalReviewPeriod, setEvalReviewPeriod] = useState('Jan–Dec 2026');
  
  // Initial Scores for New Evaluation
  const [evalCodeQuality, setEvalCodeQuality] = useState(4);
  const [evalProblemSolving, setEvalProblemSolving] = useState(4);
  const [evalSystemDesign, setEvalSystemDesign] = useState(4);
  const [evalSprintsCompleted, setEvalSprintsCompleted] = useState(10);
  const [evalBugsSLA, setEvalBugsSLA] = useState(90);
  const [evalAttendance, setEvalAttendance] = useState('98%');

  const formatDateString = (dateStr: string) => {
    if (!dateStr) return 'Pending';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const year = parts[0];
        const monthIdx = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        if (monthIdx >= 0 && monthIdx < 12) {
          return `${day} ${months[monthIdx]} ${year}`;
        }
      }
    } catch {
      // fall through to returning the raw string
    }
    return dateStr;
  };

  const handleCreateEvaluation = () => {
    const employeeOptions = employees && employees.length > 0 ? employees : [
      { id: 'EMP-0021', name: 'Sarah Lim', department: 'Engineering' },
      { id: 'EMP-0022', name: 'Raj Kumar', department: 'Engineering' },
      { id: 'EMP-0023', name: 'Ahmad L', department: 'Operations' },
      { id: 'EMP-0024', name: 'Nadia Chen', department: 'Marketing' },
    ];

    const selectedEmp = employeeOptions.find(emp => emp.id === evalEmpId) || employeeOptions[0];
    if (!selectedEmp) {
      addToast('Please select an employee for evaluation', 'error');
      return;
    }

    const formattedDate = formatDateString(evalReviewDate);

    const newEvalItem = {
      name: selectedEmp.name,
      reviewType: evalReviewType,
      date: formattedDate,
      period: evalReviewPeriod,
      status: 'Pending' as const
    };

    setEvaluationsList([newEvalItem, ...evaluationsList]);

    setActiveEval({
      employeeName: selectedEmp.name,
      empId: selectedEmp.id,
      reviewType: evalReviewType,
      reviewDate: formattedDate,
      reviewPeriod: evalReviewPeriod,
      status: 'Pending (Grade calculation)',
      scores: {
        codeQuality: evalCodeQuality,
        problemSolving: evalProblemSolving,
        systemDesign: evalSystemDesign,
        sprintsCompleted: evalSprintsCompleted,
        bugsSLA: evalBugsSLA,
        attendance: evalAttendance
      }
    });

    addToast(`New evaluation record established for ${selectedEmp.name}`, 'success');
    setActiveModal(null);
  };

  // Save Operations
  const handleSaveLevel = () => {
    if (!lvlName.trim()) {
      addToast('Please enter a level name', 'error');
      return;
    }
    if (activeModal === 'level_new') {
      const newLvl = {
        no: nextSeq(levels.map(l => l.no)),
        name: lvlName,
        description: lvlDesc || 'Performance expectations',
        employees: Math.floor(Math.random() * 40),
        status: lvlStatus
      };
      setLevels([...levels, newLvl]);
      addToast(`Performance Level "${lvlName}" created successfully.`, 'success');
    } else if (activeModal === 'level_edit' && selectedLevelIndex !== null) {
      const updated = [...levels];
      updated[selectedLevelIndex] = {
        ...updated[selectedLevelIndex],
        name: lvlName,
        description: lvlDesc,
        status: lvlStatus
      };
      setLevels(updated);
      addToast(`Performance Level "${lvlName}" updated.`, 'success');
    }
    setActiveModal(null);
  };

  const handleSaveGrade = () => {
    if (!grdLetter.trim()) {
      addToast('Please enter a grade letter', 'error');
      return;
    }
    const colorMap: Record<string, string> = {
      'A': 'text-blue-600 bg-blue-50 border-blue-200',
      'B': 'text-green-600 bg-green-50 border-green-200',
      'C': 'text-amber-600 bg-amber-50 border-amber-200',
      'D': 'text-red-600 bg-red-50 border-red-200',
    };
    const finalColor = colorMap[grdLetter.toUpperCase()[0]] || 'text-[#2f66e0] bg-[#2f66e0]/5 border-blue-200';

    if (activeModal === 'grade_new') {
      const newG = {
        grade: grdLetter.toUpperCase(),
        name: grdName || 'Performance Score Band',
        from: Number(grdFrom),
        to: Number(grdTo),
        apply: grdApply,
        employees: Math.floor(Math.random() * 20),
        color: finalColor
      };
      setGrades([...grades, newG]);
      addToast(`New Grade "${grdLetter}" created successfully.`, 'success');
    } else if (activeModal === 'grade_edit' && selectedGradeIndex !== null) {
      const updated = [...grades];
      updated[selectedGradeIndex] = {
        ...updated[selectedGradeIndex],
        grade: grdLetter.toUpperCase(),
        name: grdName,
        from: Number(grdFrom),
        to: Number(grdTo),
        apply: grdApply,
        color: finalColor
      };
      setGrades(updated);
      addToast(`Grade "${grdLetter}" updated successfully.`, 'success');
    }
    setActiveModal(null);
  };

  const handleSaveKPI = () => {
    const freshK = {
      from: Number(kpiFrom),
      to: Number(kpiTo),
      target: kpiTarget || '100%',
      score: Number(kpiScore),
      textColor: Number(kpiScore) >= 80 ? 'text-green-600' : Number(kpiScore) >= 60 ? 'text-blue-600' : 'text-amber-600',
      scoreColor: Number(kpiScore) >= 80 ? 'bg-green-100 text-green-800' : Number(kpiScore) >= 60 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
    };

    if (selectedKPIType === 'Attendance') {
      if (activeModal === 'kpi_new') {
        setAttendanceKPIs([...attendanceKPIs, freshK]);
        addToast('New attendance rating created.', 'success');
      } else if (selectedKPIIndex !== null) {
        const u = [...attendanceKPIs];
        u[selectedKPIIndex] = freshK;
        setAttendanceKPIs(u);
        addToast('Attendance rating updated.', 'success');
      }
    } else {
      if (activeModal === 'kpi_new') {
        setAchievementKPIs([...achievementKPIs, freshK]);
        addToast('New achievement target bracket configured.', 'success');
      } else if (selectedKPIIndex !== null) {
        const u = [...achievementKPIs];
        u[selectedKPIIndex] = freshK;
        setAchievementKPIs(u);
        addToast('Achievement target updated.', 'success');
      }
    }
    setActiveModal(null);
  };

  const handleSaveType = () => {
    if (!tpName.trim()) {
      addToast('Please enter an evaluation type name', 'error');
      return;
    }
    const freshT = {
      name: tpName,
      every: tpEvery,
      achieveKpi: tpAchieveKpi,
      notifyBefore: tpNotify,
      traineeEval: tpTrainee,
      appraiser: tpAppraiser,
      status: tpStatus
    };

    if (activeModal === 'type_new') {
      setEvalTypes([...evalTypes, freshT]);
      addToast(`Evaluation Type "${tpName}" registered.`, 'success');
    } else if (selectedTypeIndex !== null) {
      const u = [...evalTypes];
      u[selectedTypeIndex] = freshT;
      setEvalTypes(u);
      addToast(`Evaluation Type "${tpName}" updated.`, 'success');
    }
    setActiveModal(null);
  };

  const handleSaveCategory = () => {
    if (!catName.trim()) {
      addToast('Please enter a category name', 'error');
      return;
    }
    const typeColorMap: Record<string, string> = {
      'Attribute': 'bg-blue-100 text-blue-800',
      'Competency': 'bg-purple-100 text-purple-800',
      'KPI category': 'bg-amber-100 text-amber-800',
      'Attendance KPI': 'bg-teal-100 text-teal-800'
    };
    const freshC = {
      name: catName,
      type: catType,
      weightage: Number(catWeight),
      scoring: catScoring,
      measurement: catMeasurement,
      levels: catLevels,
      color: typeColorMap[catType] || 'bg-slate-100 text-slate-800'
    };

    if (activeModal === 'category_new') {
      setEvalCategories([...evalCategories, freshC]);
      addToast(`Category "${catName}" added.`, 'success');
    } else if (selectedCategoryIndex !== null) {
      const u = [...evalCategories];
      u[selectedCategoryIndex] = freshC;
      setEvalCategories(u);
      addToast(`Category "${catName}" updated.`, 'success');
    }
    setActiveModal(null);
  };

  const handleSaveSetup = () => {
    if (!stpName.trim()) {
      addToast('Please enter a setup name', 'error');
      return;
    }
    addToast(`Setup structure "${stpName}" saved successfully with ${stpCategories.length} linked categories.`, 'success');
    setActiveModal(null);
  };

  const handleSavePermission = () => {
    const f = {
      evaluator: prmEvaluator,
      type: prmType,
      from: prmFrom,
      to: prmTo,
      pendingCount: Number(prmPending),
      status: prmStatus,
      color: 'bg-indigo-100 text-indigo-800'
    };
    setGrantPermissions([...grantPermissions, f]);
    addToast(`Review credentials allocated to ${prmEvaluator}.`, 'success');
    setActiveModal(null);
  };

  const handleSaveCompetency = () => {
    if (!compName.trim()) {
      addToast('Please enter a competency name', 'error');
      return;
    }
    const freshCp = {
      name: compType === 'Sub-comp.' && !compName.startsWith('↳') ? `↳ ${compName}` : compName,
      type: compType,
      parent: compType === 'Sub-comp.' ? compParent : '—',
      definition: compDef || 'Core capability specification requirement details',
      color: compType === 'Competency' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
    };

    if (activeModal === 'competency_new') {
      setCompetencies([...competencies, freshCp]);
      addToast(`Competency "${compName}" registered.`, 'success');
    } else if (selectedCompetencyIndex !== null) {
      const u = [...competencies];
      u[selectedCompetencyIndex] = freshCp;
      setCompetencies(u);
      addToast(`Competency "${compName}" updated.`, 'success');
    }
    setActiveModal(null);
  };

  const activeTabClass = 'text-[#2f66e0] bg-[#2f66e0]/10 border border-[#2f66e0]/15 font-extrabold shadow-xs';
  const inactiveTabClass = 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60';

  const subTabsList: { id: SubTab; label: string; icon: any; countBadge?: number }[] = [
    { id: 'Perf. Level', label: 'Perf. Level', icon: Layers },
    { id: 'Perf. Grade', label: 'Perf. Grade', icon: Percent },
    { id: 'KPI Setting', label: 'KPI Setting', icon: Target },
    { id: 'Eval. Type', label: 'Eval. Type', icon: Calendar },
    { id: 'Eval. Category', label: 'Eval. Category', icon: Sliders },
    { id: 'Eval. Setup', label: 'Eval. Setup', icon: Settings },
    { id: 'Grant Permissions', label: 'Grant Permissions', icon: ShieldCheck },
    { id: 'Evaluation', label: 'Evaluation', icon: ClipboardCheck, countBadge: 3 },
    { id: 'Perf. Result', label: 'Perf. Result', icon: BarChart3 },
    { id: 'Competency List', label: 'Competency List', icon: Bookmark },
    { id: 'Review Report', label: 'Review Report', icon: FileBarChart },
    { id: 'Employee Profile', label: 'Employee Profile', icon: User },
  ];

  return (
    <div id="performance-module-wrapper" className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header/Navigation ribbon styled exactly like Claims/Benefits */}
      <div id="performance-module-navigator" className="flex flex-col xl:flex-row xl:items-center justify-between border-b border-slate-200/85 pb-4 gap-4">
        {/* Navigation Tabs Pillbox Grid */}
        <div id="performance-navigation-pills" className="flex items-center gap-2 select-none overflow-x-auto w-full xl:w-auto scrollbar-none pb-1.5 xl:pb-0">
          {subTabsList.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                id={`perf-sub-tab-${tab.id.replace(/\s+/g, '-').replace(/\./g, '').toLowerCase()}`}
                key={tab.id}
                onClick={() => {
                  setActiveSubTab(tab.id);
                  addToast(`Switched workspace panel to ${tab.label}`, 'info');
                }}
                className={`text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all shrink-0 relative cursor-pointer flex items-center gap-1.5 ${
                  isActive ? activeTabClass : inactiveTabClass
                }`}
              >
                <IconComponent className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
                {tab.countBadge !== undefined && (
                  <span className="font-extrabold text-[10px] h-4.5 min-w-4.5 px-1.5 rounded-full flex items-center justify-center bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
                    {tab.countBadge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#2f66e0] rounded-sm" />
                )}
              </button>
            );
          })}
        </div>

        {/* Global filter block on the right aligned nicely */}
        <div id="performance-filters" className="flex items-center gap-2.5 ml-auto sm:ml-0 font-sans text-slate-700">
          <div className="relative">
            <button
              type="button"
              onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
              className="h-9 inline-flex items-center gap-1.5 px-3.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 whitespace-nowrap shrink-0"
            >
              <span className="whitespace-nowrap">{selectedYear}</span>
              <ChevronDown className="h-3 w-3 text-slate-400 shrink-0" />
            </button>
            {yearDropdownOpen && (
              <div className="absolute right-0 mt-1 w-24 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
                {['2026', '2025', '2024'].map((y) => (
                  <button
                    key={y}
                    onClick={() => {
                      setSelectedYear(y);
                      setYearDropdownOpen(false);
                      addToast(`Performance analysis year set to ${y}`, 'info');
                    }}
                    className="w-full text-left px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50 font-semibold"
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setDeptDropdownOpen(!deptDropdownOpen)}
              className="h-9 inline-flex items-center gap-1.5 px-3.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 whitespace-nowrap shrink-0"
            >
              <span className="whitespace-nowrap">{selectedDept}</span>
              <ChevronDown className="h-3 w-3 text-slate-400 shrink-0" />
            </button>
            {deptDropdownOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
                {['All departments', 'Engineering', 'Finance', 'HR', 'Marketing', 'Operations'].map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setSelectedDept(d);
                      setDeptDropdownOpen(false);
                      addToast(`Department filter adjusted: ${d}`, 'info');
                    }}
                    className="w-full text-left px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-50 font-semibold"
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => addToast('Compiling performance statistics report...', 'loading')}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Download className="h-4 w-4 text-slate-400" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* 2. RENDER THE DETAILED ACTIVE SUB-TAB VIEWPORT PANEL */}
      <div id="performance-tab-viewport" className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs min-h-[450px]">
        
        {/* ==================== SUB-TAB 1: PERF LEVEL ==================== */}
        {activeSubTab === 'Perf. Level' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2">
              <div className="relative w-72">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search level..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-9 pr-4 py-1.5 border border-slate-200 rounded-xl outline-none"
                />
              </div>
              <button
                onClick={() => {
                  setLvlName('');
                  setLvlDesc('');
                  setLvlStatus('Active');
                  setSelectedLevelIndex(null);
                  setActiveModal('level_new');
                }}
                className="bg-[#2f66e0] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Level</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wide">
                    <th className="pb-3 pl-2">No.</th>
                    <th className="pb-3">Level name</th>
                    <th className="pb-3">Description</th>
                    <th className="pb-3">Employees</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {levels
                    .filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((item, idx) => (
                      <tr key={item.no} className="hover:bg-slate-50/45 transition-colors">
                        <td className="py-3 pl-2 font-semibold text-slate-900">{item.no}</td>
                        <td className="py-3 font-bold text-slate-800">{item.name}</td>
                        <td className="py-3 text-slate-500">{item.description}</td>
                        <td className="py-3">
                          <button
                            onClick={() => addToast(`Opening team alignment list for ${item.name}`, 'info')}
                            className="text-[#2f66e0] font-bold hover:underline"
                          >
                            {item.employees}
                          </button>
                        </td>
                        <td className="py-3">
                          <span className="bg-green-50/70 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 text-right pr-2">
                          <button
                            onClick={() => {
                              setSelectedLevelIndex(idx);
                              setLvlName(item.name);
                              setLvlDesc(item.description);
                              setLvlStatus(item.status);
                              setActiveModal('level_edit');
                            }}
                            className="font-bold text-[#2f66e0] hover:underline cursor-pointer"
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
        )}

        {/* ==================== SUB-TAB 2: PERF GRADE ==================== */}
        {activeSubTab === 'Perf. Grade' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2">
              <div className="relative w-72">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search grade..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-9 pr-4 py-1.5 border border-slate-200 rounded-xl outline-none"
                />
              </div>
              <button
                onClick={() => {
                  setGrdLetter('');
                  setGrdName('');
                  setGrdFrom(0);
                  setGrdTo(100);
                  setGrdApply('Yes');
                  setSelectedGradeIndex(null);
                  setActiveModal('grade_new');
                }}
                className="bg-[#2f66e0] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Grade</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wide">
                    <th className="pb-3 pl-2">Grade</th>
                    <th className="pb-3">Grade name</th>
                    <th className="pb-3">Mark from</th>
                    <th className="pb-3">Mark to</th>
                    <th className="pb-3">Apply for performance</th>
                    <th className="pb-3">Employees</th>
                    <th className="pb-3 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {grades
                    .filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((item, idx) => (
                      <tr key={item.grade} className="hover:bg-slate-50/45 transition-colors">
                        <td className="py-2.5 pl-2">
                          <div className={`h-8 w-8 rounded-lg border font-black text-xs flex items-center justify-center ${item.color}`}>
                            {item.grade}
                          </div>
                        </td>
                        <td className="py-2.5 font-bold text-slate-800">{item.name}</td>
                        <td className="py-2.5 font-mono font-medium text-slate-600">{item.from}</td>
                        <td className="py-2.5 font-mono font-medium text-slate-600">{item.to}</td>
                        <td className="py-2.5">
                          <span className="bg-green-50 text-emerald-700 border border-green-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {item.apply}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <button
                            onClick={() => addToast(`Opening filtered roster for Grade ${item.grade}`, 'info')}
                            className="text-[#2f66e0] font-bold hover:underline"
                          >
                            {item.employees === 0 ? '—' : item.employees}
                          </button>
                        </td>
                        <td className="py-2.5 text-right pr-2">
                          <button
                            onClick={() => {
                              setSelectedGradeIndex(idx);
                              setGrdLetter(item.grade);
                              setGrdName(item.name);
                              setGrdFrom(item.from);
                              setGrdTo(item.to);
                              setGrdApply(item.apply);
                              setActiveModal('grade_edit');
                            }}
                            className="font-bold text-[#2f66e0] hover:underline cursor-pointer"
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
        )}

        {/* ==================== SUB-TAB 3: KPI SETTING ==================== */}
        {activeSubTab === 'KPI Setting' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-1 border-b border-slate-50">
              <select className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600 font-bold outline-none cursor-pointer whitespace-nowrap">
                <option>All KPI types</option>
                <option>Attendance KPI</option>
                <option>Achievement KPI</option>
              </select>
              <button
                onClick={() => {
                  setSelectedKPIType('Attendance');
                  setKpiFrom(0);
                  setKpiTo(100);
                  setKpiTarget('100%');
                  setKpiScore(100);
                  setSelectedKPIIndex(null);
                  setActiveModal('kpi_new');
                }}
                className="bg-[#2f66e0] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New KPI Setting</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left group: Attendance KPI */}
              <div className="border border-slate-100 rounded-2xl p-4.5 bg-slate-50/30">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-dashed border-slate-100">
                  <h4 className="text-sm font-extrabold text-slate-800">Attendance KPI</h4>
                  <span className="bg-blue-50 text-[#2f66e0] border border-blue-200 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg">
                    Attendance
                  </span>
                </div>
                <table className="w-full text-left text-xs font-medium text-slate-600">
                  <thead>
                    <tr className="text-slate-400 font-bold uppercase text-[9px] pb-2">
                      <th>From %</th>
                      <th>To %</th>
                      <th>Target %</th>
                      <th>KPI score</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceKPIs.map((kpi, idx) => (
                      <tr key={idx} className="border-b border-slate-100/40 last:border-0 hover:bg-white/40">
                        <td className="py-3 font-semibold text-slate-700">{kpi.from}</td>
                        <td className="py-3 font-semibold text-slate-700">{kpi.to}</td>
                        <td className={`py-3 font-bold ${kpi.textColor}`}>{kpi.target}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${kpi.scoreColor}`}>
                            {kpi.score}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedKPIType('Attendance');
                              setSelectedKPIIndex(idx);
                              setKpiFrom(kpi.from);
                              setKpiTo(kpi.to);
                              setKpiTarget(kpi.target);
                              setKpiScore(kpi.score);
                              setActiveModal('kpi_edit');
                            }}
                            className="font-bold text-[#2f66e0] hover:underline cursor-pointer"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Right group: Achievement KPI */}
              <div className="border border-slate-100 rounded-2xl p-4.5 bg-slate-50/30">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-dashed border-slate-100">
                  <h4 className="text-sm font-extrabold text-slate-800">Achievement KPI</h4>
                  <span className="bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg">
                    Achievement
                  </span>
                </div>
                <table className="w-full text-left text-xs font-medium text-slate-600">
                  <thead>
                    <tr className="text-slate-400 font-bold uppercase text-[9px] pb-2">
                      <th>From %</th>
                      <th>To %</th>
                      <th>Target %</th>
                      <th>KPI score</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {achievementKPIs.map((kpi, idx) => (
                      <tr key={idx} className="border-b border-slate-100/40 last:border-0 hover:bg-white/40">
                        <td className="py-3 font-semibold text-slate-700">{kpi.from}</td>
                        <td className="py-3 font-semibold text-slate-700">{kpi.to}</td>
                        <td className={`py-3 font-bold ${kpi.textColor}`}>{kpi.target}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${kpi.scoreColor}`}>
                            {kpi.score}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedKPIType('Achievement');
                              setSelectedKPIIndex(idx);
                              setKpiFrom(kpi.from);
                              setKpiTo(kpi.to);
                              setKpiTarget(kpi.target);
                              setKpiScore(kpi.score);
                              setActiveModal('kpi_edit');
                            }}
                            className="font-bold text-[#2f66e0] hover:underline cursor-pointer"
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

        {/* ==================== SUB-TAB 4: EVAL TYPE ==================== */}
        {activeSubTab === 'Eval. Type' && (
          <div className="space-y-4">
            <div className="flex justify-end pb-2">
              <button
                onClick={() => {
                  setTpName('');
                  setTpEvery('12 months');
                  setTpAchieveKpi('Yes');
                  setTpNotify('30 days');
                  setTpTrainee('No');
                  setTpAppraiser('Direct manager');
                  setTpStatus('Active');
                  setSelectedTypeIndex(null);
                  setActiveModal('type_new');
                }}
                className="bg-[#2f66e0] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Evaluation Type</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wide">
                    <th className="pb-3 pl-2">Type name</th>
                    <th className="pb-3">Every month</th>
                    <th className="pb-3">Achieve KPI</th>
                    <th className="pb-3">Notify before</th>
                    <th className="pb-3">Trainee eval.</th>
                    <th className="pb-3">Appraiser</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {evalTypes.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/45 transition-colors">
                      <td className="py-3 pl-2 font-bold text-slate-800">{item.name}</td>
                      <td className="py-3 font-semibold text-slate-600">{item.every}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${item.achieveKpi === 'Yes' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
                          {item.achieveKpi}
                        </span>
                      </td>
                      <td className="py-3 text-slate-600 font-medium">{item.notifyBefore}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${item.traineeEval === 'Yes' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
                          {item.traineeEval}
                        </span>
                      </td>
                      <td className="py-3 font-semibold text-slate-700">{item.appraiser}</td>
                      <td className="py-3">
                        <span className="bg-green-50 text-emerald-700 border border-green-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 text-right pr-2">
                        <button
                          onClick={() => {
                            setSelectedTypeIndex(idx);
                            setTpName(item.name);
                            setTpEvery(item.every);
                            setTpAchieveKpi(item.achieveKpi);
                            setTpNotify(item.notifyBefore);
                            setTpTrainee(item.traineeEval);
                            setTpAppraiser(item.appraiser);
                            setTpStatus(item.status);
                            setActiveModal('type_edit');
                          }}
                          className="font-bold text-[#2f66e0] hover:underline cursor-pointer"
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
        )}

        {/* ==================== SUB-TAB 5: EVAL CATEGORY ==================== */}
        {activeSubTab === 'Eval. Category' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2">
              <select className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600 font-bold outline-none cursor-pointer whitespace-nowrap">
                <option>All KPI types</option>
                <option>Attribute</option>
                <option>Competency</option>
                <option>KPI category</option>
                <option>Attendance KPI</option>
              </select>
              <button
                onClick={() => {
                  setCatName('');
                  setCatType('Attribute');
                  setCatWeight(20);
                  setCatScoring('1–5 rating scale');
                  setCatMeasurement('Measurement index');
                  setCatLevels('4 levels');
                  setSelectedCategoryIndex(null);
                  setActiveModal('category_new');
                }}
                className="bg-[#2f66e0] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Category</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wide">
                    <th className="pb-3 pl-2">Category name</th>
                    <th className="pb-3">KPI type</th>
                    <th className="pb-3">Weightage %</th>
                    <th className="pb-3">Scoring scheme</th>
                    <th className="pb-3">Measurement</th>
                    <th className="pb-3">Definition levels</th>
                    <th className="pb-3 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {evalCategories.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/45 transition-colors">
                      <td className="py-3 pl-2 font-bold text-slate-800">{item.name}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${item.color}`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="py-3 font-semibold text-slate-900">{item.weightage}%</td>
                      <td className="py-3 text-slate-500">{item.scoring}</td>
                      <td className="py-3 text-slate-500 font-semibold">{item.measurement}</td>
                      <td className="py-3">
                        <span className="bg-slate-50 text-slate-600 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {item.levels}
                        </span>
                      </td>
                      <td className="py-3 text-right pr-2">
                        <button
                          onClick={() => {
                            setSelectedCategoryIndex(idx);
                            setCatName(item.name);
                            setCatType(item.type);
                            setCatWeight(item.weightage);
                            setCatScoring(item.scoring);
                            setCatMeasurement(item.measurement);
                            setCatLevels(item.levels);
                            setActiveModal('category_edit');
                          }}
                          className="font-bold text-[#2f66e0] hover:underline cursor-pointer"
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
        )}

        {/* ==================== SUB-TAB 6: EVAL SETUP ==================== */}
        {activeSubTab === 'Eval. Setup' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-1 border-b border-slate-50">
              <select className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600 font-bold outline-none cursor-pointer whitespace-nowrap">
                <option>All evaluation types</option>
                <option>Year-end appraisal</option>
                <option>Probation review</option>
              </select>
              <button
                onClick={() => {
                  setStpName('');
                  setStpCategories([
                    'Technical skills (Attribute · 25%)',
                    'Communication (Attribute · 15%)',
                    'Leadership (Competency · 20%)',
                    'Project delivery (KPI · 30%)'
                  ]);
                  setActiveModal('setup_new');
                }}
                className="bg-[#2f66e0] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Setup</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Card 1: Year-end setup */}
              <div className="bg-slate-50/20 border border-slate-100 p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-extrabold text-slate-800">Year-end appraisal — setup</h3>
                  <span className="bg-green-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                    Linked evaluation categories
                  </span>
                  {[
                    'Technical skills (Attribute · 25%)',
                    'Communication (Attribute · 15%)',
                    'Leadership (Competency · 20%)',
                    'Project delivery (KPI · 30%)',
                    'Attendance (Attendance KPI · 10%)'
                  ].map((cat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input id={`ye-cat-${i}`} type="checkbox" defaultChecked className="h-3.5 w-3.5 rounded-sm border-slate-300" />
                      <label htmlFor={`ye-cat-${i}`} className="text-xs font-semibold text-slate-600 cursor-pointer">{cat}</label>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-3 flex flex-col gap-2 text-xs font-bold text-slate-700">
                  <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                    <span>Total weightage</span>
                    <span className="text-emerald-600">100%</span>
                  </div>
                  {['Enable next period objectives', 'Enable training required', 'Enable CEP / career planning', 'Enable appraiser note'].map((opt, idx) => (
                    <div key={idx} className="flex justify-between items-center py-0.5">
                      <span className="font-semibold text-slate-500">{opt}</span>
                      <span className="bg-green-50 text-emerald-700 border border-emerald-100 text-[9.5px] font-bold px-2 py-0.5 rounded-md">Yes</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2: Probation review setup */}
              <div className="bg-slate-50/20 border border-slate-100 p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-extrabold text-slate-800">Probation review — setup</h3>
                  <span className="bg-green-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                    Linked evaluation categories
                  </span>
                  {[
                    { text: 'Technical skills (Attribute · 40%)', checked: true },
                    { text: 'Communication (Attribute · 30%)', checked: true },
                    { text: 'Leadership (Competency · 0%)', checked: false },
                    { text: 'Project delivery (KPI · 0%)', checked: false },
                    { text: 'Attendance (Attendance KPI · 30%)', checked: true }
                  ].map((cat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input id={`pr-cat-${i}`} type="checkbox" defaultChecked={cat.checked} className="h-3.5 w-3.5 rounded-sm border-slate-300" />
                      <label htmlFor={`pr-cat-${i}`} className="text-xs font-semibold text-slate-600 cursor-pointer">{cat.text}</label>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-3 flex flex-col gap-2 text-xs font-bold text-slate-700">
                  <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                    <span>Total weightage</span>
                    <span className="text-emerald-600">100%</span>
                  </div>
                  {[
                    { label: 'Enable next period objectives', val: 'No', style: 'bg-slate-100 text-slate-500' },
                    { label: 'Enable training required', val: 'Yes', style: 'bg-green-100 text-green-700' },
                    { label: 'Enable CEP / career planning', val: 'No', style: 'bg-slate-100 text-slate-500' },
                    { label: 'Enable appraiser note', val: 'Yes', style: 'bg-green-100 text-green-700' }
                  ].map((opt, idx) => (
                    <div key={idx} className="flex justify-between items-center py-0.5">
                      <span className="font-semibold text-slate-500">{opt.label}</span>
                      <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-md ${opt.style}`}>{opt.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SUB-TAB 7: GRANT PERMISSIONS ==================== */}
        {activeSubTab === 'Grant Permissions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2">
              <div className="flex gap-2.5">
                <select className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600 font-bold outline-none cursor-pointer whitespace-nowrap">
                  <option>All evaluation types</option>
                  <option>Year-end appraisal</option>
                  <option>Mid-year appraisal</option>
                </select>
                <select className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600 font-bold outline-none cursor-pointer whitespace-nowrap">
                  <option>All status</option>
                  <option>Active</option>
                  <option>Expired</option>
                </select>
              </div>
              <button
                onClick={() => {
                  setPrmEvaluator('David Ng');
                  setPrmType('Year-end appraisal');
                  setPrmFrom('1 Jan 2026');
                  setPrmTo('31 Jan 2026');
                  setPrmPending(3);
                  setPrmStatus('Active');
                  setActiveModal('grant_permission');
                }}
                className="bg-[#2f66e0] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Grant Permission</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wide">
                    <th className="pb-3 pl-2">Evaluator</th>
                    <th className="pb-3">Evaluation type</th>
                    <th className="pb-3">Review period from</th>
                    <th className="pb-3">Review period to</th>
                    <th className="pb-3">Pending</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {grantPermissions.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/45 transition-colors">
                      <td className="py-3 pl-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs ${item.color}`}>
                            {item.evaluator.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="font-bold text-slate-800">{item.evaluator}</span>
                        </div>
                      </td>
                      <td className="py-3 font-semibold text-slate-700">{item.type}</td>
                      <td className="py-3 text-slate-500">{item.from}</td>
                      <td className="py-3 text-slate-500">{item.to}</td>
                      <td className="py-3">
                        <span className={`font-bold ${item.pendingCount > 0 ? 'text-[#2f66e0] underline cursor-pointer' : 'text-emerald-600 font-semibold'}`}>
                          {item.pendingCount > 0 ? `${item.pendingCount} employees` : '0 pending'}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 text-right pr-2 flex justify-end gap-2.5 align-middle">
                        <button
                          onClick={() => {
                            setPermissionViewItem({
                              evaluator: item.evaluator,
                              type: item.type,
                              details: item.evaluator === 'David Ng'
                                ? ['Sarah Lim', 'Raj Kumar', 'Maya Tan', 'Darren Low', 'Evelyn Ng', 'Thomas Chu', 'Fiona Lin', 'Alex Wong']
                                : item.evaluator === 'Nina Reza'
                                  ? ['Ahmad L', 'Nadia Chen', 'Zulhasnan H.', 'Siti Aminah', 'Guok Seng']
                                  : ['Kevin Lim', 'Raymond Tan']
                            });
                            setActiveModal('view_list');
                          }}
                          className="font-bold text-[#2f66e0] hover:underline cursor-pointer"
                        >
                          View list
                        </button>
                        {item.status === 'Active' ? (
                          <button
                            onClick={() => {
                              const updated = [...grantPermissions];
                              updated[idx].status = 'Draft';
                              setGrantPermissions(updated);
                              addToast(`Temporarily suspended evaluation permission for ${item.evaluator}`, 'info');
                            }}
                            className="text-red-500 border border-red-200 hover:bg-red-50 text-[11px] font-bold px-2.5 py-0.5 rounded-lg transition-all cursor-pointer"
                          >
                            Hold
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              const updated = [...grantPermissions];
                              updated[idx].status = 'Active';
                              setGrantPermissions(updated);
                              addToast(`Re-grant review authorization to ${item.evaluator}`, 'success');
                            }}
                            className="bg-[#2f66e0] hover:bg-blue-700 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-lg transition-all cursor-pointer"
                          >
                            Re-grant
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== SUB-TAB 8: EVALUATION (THE WORKSTATION GRID) ==================== */}
        {activeSubTab === 'Evaluation' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <select className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600 font-bold cursor-pointer outline-none whitespace-nowrap">
                  <option>All review types</option>
                  <option>Year-end appraisal</option>
                </select>
                <select className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-[#d97706] font-bold cursor-pointer outline-none bg-amber-50 whitespace-nowrap">
                  <option>All status</option>
                  <option>Pending</option>
                  <option>Completed</option>
                </select>
                <select className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600 font-bold cursor-pointer outline-none whitespace-nowrap">
                  <option>All departments</option>
                  <option>Engineering</option>
                  <option>Operations</option>
                </select>
                <input
                  type="text"
                  placeholder="Search employee..."
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold outline-none w-48"
                />
              </div>

              <button
                onClick={() => {
                  const employeeOptions = employees && employees.length > 0 ? employees : [
                    { id: 'EMP-0021', name: 'Sarah Lim', department: 'Engineering' },
                    { id: 'EMP-0022', name: 'Raj Kumar', department: 'Engineering' },
                    { id: 'EMP-0023', name: 'Ahmad L', department: 'Operations' },
                    { id: 'EMP-0024', name: 'Nadia Chen', department: 'Marketing' },
                  ];
                  setEvalEmpId(employeeOptions[0].id);
                  setEvalReviewType('Year-end appraisal');
                  const today = new Date().toISOString().split('T')[0];
                  setEvalReviewDate(today);
                  setEvalReviewPeriod('Jan–Dec 2026');
                  setEvalCodeQuality(4);
                  setEvalProblemSolving(4);
                  setEvalSystemDesign(4);
                  setEvalSprintsCompleted(10);
                  setEvalBugsSLA(90);
                  setEvalAttendance('98%');
                  setActiveModal('evaluation_new');
                }}
                className="bg-[#2f66e0] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
              <span>New Evaluation</span>
              </button>
            </div>

            {/* Split layout exactly like the screenshot */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Assessment Form parameters */}
              <div className="lg:col-span-7 bg-slate-50/20 border border-slate-100 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h4 className="text-sm font-extrabold text-slate-800">
                    Evaluation entry — {activeEval.employeeName}
                  </h4>
                  <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Pending
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider block mb-1">Employee *</label>
                    <input type="text" readOnly value={`${activeEval.employeeName} (${activeEval.empId})`} className="w-full bg-slate-50 text-slate-700 p-2 border rounded-xl outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider block mb-1">Review type *</label>
                    <input type="text" readOnly value={activeEval.reviewType} className="w-full bg-slate-50 text-slate-700 p-2 border rounded-xl outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider block mb-1">Review date *</label>
                    <input type="text" readOnly value={activeEval.reviewDate} className="w-full bg-slate-50 text-slate-700 p-2 border rounded-xl outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-slate-400 font-bold tracking-wider block mb-1">Review period</label>
                    <input type="text" readOnly value={activeEval.reviewPeriod} className="w-full bg-slate-50 text-slate-700 p-2 border rounded-xl outline-none" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => addToast('Assigned appraisal criteria loaded.', 'success')}
                  className="w-full text-center py-2.5 bg-[#2f66e0] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer hover:opacity-90"
                >
                  Load category list
                </button>

                {/* Sub scoring scales */}
                <div className="space-y-4 border-t border-slate-100 pt-4 text-xs">
                  <div>
                    <span className="bg-blue-50 text-[#2f66e0] text-[10.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                      Attribute — technical skills (25%)
                    </span>
                    <div className="space-y-2 mt-3.5">
                      {[
                        { label: 'Code quality & standards', val: activeEval.scores.codeQuality },
                        { label: 'Problem-solving ability', val: activeEval.scores.problemSolving },
                        { label: 'System design', val: activeEval.scores.systemDesign }
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white p-2 border border-slate-100 rounded-lg">
                          <span className="font-semibold text-slate-700">{item.label}</span>
                          <div className="flex gap-1.5 items-center">
                            {[1, 2, 3, 4, 5].map(n => (
                              <span
                                key={n}
                                className={`h-5 w-5 rounded-full flex items-center justify-center font-bold text-[10px] border ${
                                  item.val === n
                                    ? 'bg-[#2f66e0] text-white border-[#2f66e0]'
                                    : 'bg-slate-50 text-slate-400 border-slate-200'
                                }`}
                              >
                                {n}
                              </span>
                            ))}
                            <span className="font-bold text-slate-600 ml-2">{item.val}/5</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="bg-teal-50 text-teal-800 text-[10.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                      KPI — project delivery (30%)
                    </span>
                    <div className="space-y-2.5 mt-3">
                      <div className="flex justify-between items-center bg-white p-2 border border-slate-100 rounded-lg">
                        <span className="font-semibold text-slate-700">Sprints completed on time</span>
                        <div className="flex gap-3 items-center">
                          <input readOnly type="number" value={activeEval.scores.sprintsCompleted} className="w-14 bg-slate-50 p-1 border rounded text-center font-bold" />
                          <span className="font-bold text-emerald-600">92%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center bg-white p-2 border border-slate-100 rounded-lg">
                        <span className="font-semibold text-slate-700">Bugs resolved within SLA</span>
                        <div className="flex gap-3 items-center">
                          <input readOnly type="number" value={activeEval.scores.bugsSLA} className="w-14 bg-slate-50 p-1 border rounded text-center font-bold" />
                          <span className="font-bold text-emerald-600">88%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Objectives and appraiser notes */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-slate-50/20 border border-slate-100 rounded-2xl p-6.5 text-xs space-y-4">
                  <h4 className="text-sm font-extrabold text-slate-800 border-b pb-2">Objectives for next period</h4>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-black block mb-1">KPI type</label>
                    <select className="w-full bg-white border rounded-xl p-2 font-semibold">
                      <option>Achievement KPI</option>
                      <option>Attendance KPI</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-black block mb-1">Category / objective</label>
                    <input type="text" placeholder="e.g. Lead frontend team Q1 2026" className="w-full border rounded-xl p-2 outline-none font-medium" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-black block mb-1">Target</label>
                    <input type="text" placeholder="e.g. 95% sprint completion" className="w-full border rounded-xl p-2 outline-none font-medium" />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-black block mb-1">Comment</label>
                    <textarea rows={2} placeholder="Notes on this objective..." className="w-full border rounded-xl p-2 outline-none resize-none font-medium" />
                  </div>
                  <button type="button" onClick={() => addToast('Objective added to appraisal framework config.', 'success')} className="w-full text-center py-2 border border-dashed border-[#2f66e0] font-bold text-[#2f66e0] rounded-xl hover:bg-[#2f66e0]/5 transition-colors">
                    + Add objective
                  </button>
                </div>

                <div className="bg-slate-50/30 border p-6 rounded-2xl text-xs space-y-3">
                  <h4 className="text-sm font-extrabold text-slate-800 border-b pb-2">Appraiser note</h4>
                  <textarea rows={3} placeholder="Notes and remarks from the appraiser about this evaluation period..." className="w-full bg-white border rounded-xl p-2.5 outline-none resize-none font-medium" />
                </div>
              </div>
            </div>

            {/* List at the footer */}
            <div className="border-t border-slate-100 pt-6 space-y-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Evaluation list — all employees</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[9px] tracking-wide">
                      <th className="pb-3pl-2">Employee</th>
                      <th className="pb-3">Review type</th>
                      <th className="pb-3">Review date</th>
                      <th className="pb-3">Review period</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right pr-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {evaluationsList.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/45 transition-colors">
                        <td className="py-2.5 pl-2">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-lg bg-[#2f66e0]/10 text-[#2f66e0] font-black text-xs flex items-center justify-center">
                              {item.name[0]}
                            </div>
                            <span className="font-bold text-slate-800">{item.name}</span>
                          </div>
                        </td>
                        <td className="py-2.5 font-semibold text-slate-700">{item.reviewType}</td>
                        <td className="py-2.5 text-slate-500">{item.date}</td>
                        <td className="py-2.5 text-slate-500 font-mono font-medium">{item.period}</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.status === 'Completed' ? 'bg-green-50 text-emerald-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-2.5 text-right pr-2">
                          <button
                            onClick={() => {
                              if (item.status === 'Pending') {
                                setActiveEval({
                                  ...activeEval,
                                  employeeName: item.name,
                                  reviewType: item.reviewType,
                                  reviewDate: item.date
                                });
                                addToast(`Loaded workstation form for ${item.name}`, 'success');
                              } else {
                                addToast(`Downloading completed appraisal report for ${item.name}`, 'loading');
                              }
                            }}
                            className="font-bold text-[#2f66e0] hover:underline"
                          >
                            {item.status === 'Pending' ? 'Open' : 'Download'}
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

        {/* ==================== SUB-TAB 9: PERF RESULT ==================== */}
        {activeSubTab === 'Perf. Result' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Performance summaries</span>
              <button
                onClick={() => addToast('Batch calculating absolute performance scores...', 'loading')}
                className="bg-slate-50 border border-slate-200 hover:border-[#2f66e0] hover:bg-[#2f66e0]/10 text-slate-700 hover:text-[#2f66e0] text-xs font-bold px-4 py-2 rounded-xl transition-all"
              >
                Calculate grade
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wide">
                    <th className="pb-3 pl-2">Employee</th>
                    <th className="pb-3">Attr. score</th>
                    <th className="pb-3">KPI score</th>
                    <th className="pb-3">Comp. score</th>
                    <th className="pb-3">Attend. score</th>
                    <th className="pb-3">Total score</th>
                    <th className="pb-3 text-center">Grade</th>
                    <th className="pb-3 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {perfResults.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/45 transition-colors">
                      <td className="py-2.5 pl-2 font-bold text-slate-800">{item.name}</td>
                      <td className="py-2.5 font-mono font-medium text-slate-600">{item.attr}</td>
                      <td className="py-2.5 font-mono font-medium text-slate-600">{item.kpi}</td>
                      <td className="py-2.5 font-mono font-medium text-slate-600">{item.comp}</td>
                      <td className="py-2.5 font-mono font-medium text-slate-600">{item.attend}</td>
                      <td className="py-2.5 font-black text-blue-600 font-mono text-[13px]">{item.total}</td>
                      <td className="py-2.5 text-center">
                        <span className={`inline-block py-0.5 px-3 border rounded text-[11px] font-black tracking-widest ${item.gradeColor}`}>
                          {item.grade}
                        </span>
                      </td>
                      <td className="py-2.5 text-right pr-2">
                        <button
                          onClick={() => {
                            setActiveSubTab('Employee Profile');
                            addToast(`Pulled full file card index for ${item.name}`, 'success');
                          }}
                          className="font-bold text-[#2f66e0] hover:underline"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== SUB-TAB 10: COMPETENCY LIST ==================== */}
        {activeSubTab === 'Competency List' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2">
              <div className="relative w-72">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search competency..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-9 pr-4 py-1.5 border border-slate-200 rounded-xl outline-none"
                />
              </div>
              <button
                onClick={() => {
                  setCompName('');
                  setCompType('Competency');
                  setCompParent('—');
                  setCompDef('');
                  setSelectedCompetencyIndex(null);
                  setActiveModal('competency_new');
                }}
                className="bg-[#2f66e0] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>New Competency</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wide">
                    <th className="pb-3 pl-2">Competency name</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Parent competency</th>
                    <th className="pb-3">Definition</th>
                    <th className="pb-3 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {competencies
                    .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/45 transition-colors">
                        <td className="py-3 pl-2 font-bold text-slate-800">{item.name}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${item.color}`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="py-3 text-slate-500 font-semibold">{item.parent}</td>
                        <td className="py-3 text-slate-500 mr-4 font-medium max-w-xs truncate leading-normal">{item.definition}</td>
                        <td className="py-3 text-right pr-2">
                          <button
                            onClick={() => {
                              setSelectedCompetencyIndex(idx);
                              setCompName(item.name.replace('↳ ', ''));
                              setCompType(item.type);
                              setCompParent(item.parent);
                              setCompDef(item.definition);
                              setActiveModal('competency_edit');
                            }}
                            className="font-bold text-[#2f66e0] hover:underline cursor-pointer"
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
        )}

        {/* ==================== SUB-TAB 11: REVIEW REPORT ==================== */}
        {activeSubTab === 'Review Report' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Verified appraisal reports</span>
              <button
                onClick={() => addToast('Batch PDF report export has been triggered.', 'success')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
              >
                Export all
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wide">
                    <th className="pb-3 pl-2">Employee</th>
                    <th className="pb-3">Review type</th>
                    <th className="pb-3">Review period</th>
                    <th className="pb-3">Total score</th>
                    <th className="pb-3 text-center">Grade</th>
                    <th className="pb-3">Appraiser</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {perfResults.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/45 transition-colors">
                      <td className="py-3 pl-2 font-bold text-slate-800">{item.name}</td>
                      <td className="py-3 font-semibold text-slate-700">Year-end appraisal</td>
                      <td className="py-3 text-slate-500">Jan–Dec 2025</td>
                      <td className="py-3 text-blue-600 font-black font-mono text-[12.5px]">{item.total}</td>
                      <td className="py-3 text-center">
                        <span className={`inline-block py-0.5 px-3 border rounded text-[10px] font-black ${item.gradeColor}`}>
                          {item.grade}
                        </span>
                      </td>
                      <td className="py-3 font-semibold text-slate-700">David Ng</td>
                      <td className="py-3">
                        <span className="bg-green-50 text-emerald-700 border border-green-200 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                          Completed
                        </span>
                      </td>
                      <td className="py-3 text-right pr-2 flex justify-end gap-2 text-slate-600 align-middle">
                        <button
                          onClick={() => {
                            setReportDetailItem({
                              name: item.name,
                              type: 'Year-end appraisal',
                              period: 'Jan–Dec 2025',
                              attr: item.attr,
                              kpi: item.kpi,
                              comp: item.comp,
                              attend: item.attend,
                              total: item.total,
                              grade: item.grade,
                              gradeColor: item.gradeColor,
                              appraiser: 'David Ng'
                            });
                            setActiveModal('view_report');
                          }}
                          className="font-bold text-[#2f66e0] hover:underline cursor-pointer"
                        >
                          View
                        </button>
                        <button
                          onClick={() => addToast(`Dossier PDF download successful for ${item.name}`, 'success')}
                          className="font-bold text-slate-500 hover:text-slate-800"
                        >
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== SUB-TAB 12: EMPLOYEE PROFILE ==================== */}
        {activeSubTab === 'Employee Profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left side card block */}
            <div className="lg:col-span-5 border border-slate-100 rounded-2xl p-6.5 space-y-5 bg-slate-50/20">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-4.5">
                <div className="h-12 w-12 bg-blue-100 border border-blue-200 text-[#2f66e0] rounded-xl flex items-center justify-center text-lg font-black shadow-xs">
                  SL
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Sarah Lim Wei Ling</h3>
                  <p className="text-[10.5px] font-semibold text-slate-400 mt-1 uppercase tracking-wide">
                    EMP-0021 &bull; Engineering &bull; Senior Developer
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs font-semibold">
                <div>
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Performance level</span>
                  <span className="bg-blue-50 text-[#2f66e0] px-2 py-0.5 rounded-md font-bold text-[10.5px]">Advanced</span>
                </div>
                <div>
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Current grade (latest)</span>
                  <span className="bg-blue-50 text-[#2f66e0] px-2.5 border border-blue-200 font-black rounded text-[11px] h-6.5 inline-flex items-center">A</span>
                </div>
                <div>
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Latest score</span>
                  <p className="text-slate-800 font-bold">91.7 / 100</p>
                </div>
                <div>
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Last review</span>
                  <span className="text-slate-500 font-mono">Year-end appraisal &bull; Jan 2026</span>
                </div>
                <div>
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">CEP rating</span>
                  <span className="bg-green-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md text-[10px]">High potential</span>
                </div>
                <div>
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Possible next position</span>
                  <span className="text-slate-800 font-bold">Tech Lead</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Time frame</span>
                  <span className="text-slate-800 font-bold">12 months</span>
                </div>
              </div>

              {/* Progress percentage bars */}
              <div className="border-t border-slate-100 pt-4.5 space-y-3">
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Score breakdown</span>
                {[
                  { label: 'Technical skills (attr.)', value: 86.7, color: 'bg-blue-500' },
                  { label: 'Project delivery (KPI)', value: 90.0, color: 'bg-teal-500' },
                  { label: 'Leadership (comp.)', value: 82.0, color: 'bg-purple-500' },
                  { label: 'Communication (attr.)', value: 88.0, color: 'bg-amber-500' },
                  { label: 'Attendance KPI', value: 97.0, color: 'bg-green-600' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between font-semibold text-[11px] text-slate-600">
                      <span>{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-1.5 ${item.color} rounded-sm`} style={{ width: `${item.value}%` }}></div>
                    </div>
                  </div>
                ))}
                <div className="border-t border-slate-100/50 pt-2.5 flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>Overall score</span>
                  <span className="text-blue-600 text-sm font-black font-mono">91.7 / 100</span>
                </div>
              </div>
            </div>

            {/* Right side history details */}
            <div className="lg:col-span-12 xl:col-span-7 space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide border-b pb-2">Review history</h4>
                <div className="overflow-x-auto border rounded-xl">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead>
                      <tr className="bg-slate-50/50 text-slate-400 font-bold uppercase text-[9px] tracking-wide border-b">
                        <th className="py-2.5 pl-3">Review type</th>
                        <th className="py-2.5">Period</th>
                        <th className="py-2.5">Score</th>
                        <th className="py-2.5 pr-3 text-center">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { type: 'Year-end appraisal', period: '2025', score: 91.7, grade: 'A', scoreColor: 'text-blue-600', gradeColor: 'bg-blue-100 text-blue-800 border-blue-200' },
                        { type: 'Mid-year appraisal', period: 'H1 2025', score: 87.3, grade: 'A', scoreColor: 'text-blue-600', gradeColor: 'bg-blue-100 text-blue-800 border-blue-200' },
                        { type: 'Year-end appraisal', period: '2024', score: 83.1, grade: 'A', scoreColor: 'text-blue-600', gradeColor: 'bg-blue-100 text-blue-800 border-blue-200' },
                        { type: 'Year-end appraisal', period: '2023', score: 74.5, grade: 'B', scoreColor: 'text-amber-600', gradeColor: 'bg-green-100 text-green-800 border-green-200' },
                      ].map((hist, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/20">
                          <td className="py-2.5 pl-3 font-semibold text-slate-800">{hist.type}</td>
                          <td className="py-2.5 text-slate-500 font-medium">{hist.period}</td>
                          <td className={`py-2.5 font-bold font-mono text-[12px] ${hist.scoreColor}`}>{hist.score}</td>
                          <td className="py-2.5 text-center pr-3">
                            <span className={`inline-block py-0.5 px-2.5 border rounded font-black text-[10px] ${hist.gradeColor}`}>
                              {hist.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide border-b pb-1.5">Training recommended</h4>
                <div className="flex gap-2">
                  <div className="flex-1 bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Leadership essentials</span>
                    <span className="bg-red-100 text-red-700 text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded">Mandatory</span>
                  </div>
                  <div className="flex-1 bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Agile & Scrum</span>
                    <span className="bg-slate-100 text-slate-500 text-[9.5px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded">Optional</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50/40 p-4.5 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed space-y-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Appraiser note (latest)</span>
                <p className="font-medium text-slate-600 italic">
                  "Strong technical contributor with consistent improvement. Nominated for tech lead role in Q3 2026. Recommended for leadership training before promotion cycle."
                </p>
                <span className="block text-right font-bold text-[#2f66e0] text-[10px] uppercase">
                  — David Ng &bull; 15 Jan 2026
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* ======================= DYNAMIC CONFIG MODAL PORTALS =================== */}
        {/* ======================================================================= */}
        {activeModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#2f66e0]"></span>
                  {(() => {
                    const titles: Record<string, string> = {
                      level_new: 'New Level',
                      level_edit: 'Edit Level',
                      grade_new: 'New Grade',
                      grade_edit: 'Edit Grade',
                      kpi_new: 'New KPI Setting',
                      kpi_edit: 'Edit KPI Setting',
                      type_new: 'New Evaluation Type',
                      type_edit: 'Edit Evaluation Type',
                      category_new: 'New Category',
                      category_edit: 'Edit Category',
                      setup_new: 'New Setup',
                      grant_permission: 'Grant Permission',
                      view_list: 'View List',
                      competency_new: 'New Competency',
                      competency_edit: 'Edit Competency',
                      view_report: 'View Report',
                      evaluation_new: 'New Evaluation',
                    };
                    return titles[activeModal] || activeModal;
                  })()}
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="p-1 px-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-black text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              {/* Modal Inner Forms */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs font-semibold text-slate-700">
                {/* 1. LEVEL MODALS */}
                {(activeModal === 'level_new' || activeModal === 'level_edit') && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Level name</label>
                      <input
                        type="text"
                        placeholder="e.g. Intermediate, Executive"
                        value={lvlName}
                        onChange={(e) => setLvlName(e.target.value)}
                        className="w-full text-xs p-2.5 border rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Level description</label>
                      <textarea
                        rows={3}
                        placeholder="Key responsibilities and qualifications..."
                        value={lvlDesc}
                        onChange={(e) => setLvlDesc(e.target.value)}
                        className="w-full text-xs p-2.5 border rounded-xl outline-none resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Status</label>
                      <select
                        value={lvlStatus}
                        onChange={(e) => setLvlStatus(e.target.value)}
                        className="w-full text-xs p-2.5 border rounded-xl outline-none cursor-pointer"
                      >
                        <option>Active</option>
                        <option>Draft</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveLevel}
                      className="w-full py-2.5 bg-[#2f66e0] text-white rounded-xl font-bold cursor-pointer hover:bg-blue-700 transition"
                    >
                      Save Level Configuration
                    </button>
                  </div>
                )}

                {/* 2. GRADE MODALS */}
                {(activeModal === 'grade_new' || activeModal === 'grade_edit') && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Grade letter</label>
                        <input
                          type="text"
                          placeholder="e.g. A, B, C+, A*"
                          value={grdLetter}
                          onChange={(e) => setGrdLetter(e.target.value)}
                          className="w-full text-xs p-2.5 border rounded-xl outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Grade description</label>
                        <input
                          type="text"
                          placeholder="e.g. Excellent performance"
                          value={grdName}
                          onChange={(e) => setGrdName(e.target.value)}
                          className="w-full text-xs p-2.5 border rounded-xl outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Scoring threshold from %</label>
                        <input
                          type="number"
                          value={grdFrom}
                          onChange={(e) => setGrdFrom(Number(e.target.value))}
                          className="w-full text-xs p-2.5 border rounded-xl outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Scoring threshold to %</label>
                        <input
                          type="number"
                          value={grdTo}
                          onChange={(e) => setGrdTo(Number(e.target.value))}
                          className="w-full text-xs p-2.5 border rounded-xl outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Apply for evaluation calculations</label>
                      <select
                        value={grdApply}
                        onChange={(e) => setGrdApply(e.target.value)}
                        className="w-full text-xs p-2.5 border rounded-xl outline-none cursor-pointer"
                      >
                        <option>Yes</option>
                        <option>No (Draft scale)</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveGrade}
                      className="w-full py-2.5 bg-[#2f66e0] text-white rounded-xl font-bold cursor-pointer hover:bg-blue-700 transition"
                    >
                      Save Grade parameters
                    </button>
                  </div>
                )}

                {/* 3. KPI SETTING MODALS */}
                {(activeModal === 'kpi_new' || activeModal === 'kpi_edit') && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">KPI framework type</label>
                        <select
                          value={selectedKPIType}
                          onChange={(e) => setSelectedKPIType(e.target.value as any)}
                          className="w-full text-xs p-2.5 border rounded-xl outline-none cursor-pointer"
                        >
                          <option>Attendance</option>
                          <option>Achievement</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Scoring weightage</label>
                        <input
                          type="number"
                          value={kpiScore}
                          onChange={(e) => setKpiScore(Number(e.target.value))}
                          className="w-full text-xs p-2.5 border rounded-xl outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Percentage from %</label>
                        <input
                          type="number"
                          value={kpiFrom}
                          onChange={(e) => setKpiFrom(Number(e.target.value))}
                          className="w-full text-xs p-2.5 border rounded-xl outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Percentage to %</label>
                        <input
                          type="number"
                          value={kpiTo}
                          onChange={(e) => setKpiTo(Number(e.target.value))}
                          className="w-full text-xs p-2.5 border rounded-xl outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Goal / targets metrics</label>
                      <input
                        type="text"
                        value={kpiTarget}
                        onChange={(e) => setKpiTarget(e.target.value)}
                        className="w-full text-xs p-2.5 border rounded-xl outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveKPI}
                      className="w-full py-2.5 bg-[#2f66e0] text-white rounded-xl font-bold cursor-pointer hover:bg-blue-700 transition"
                    >
                      Save KPI parameters
                    </button>
                  </div>
                )}

                {/* 4. EVAL TYPE MODALS */}
                {(activeModal === 'type_new' || activeModal === 'type_edit') && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Appraisal framework type name</label>
                      <input
                        type="text"
                        placeholder="e.g. Year-end appraisal, 360 Feedback"
                        value={tpName}
                        onChange={(e) => setTpName(e.target.value)}
                        className="w-full text-xs p-2.5 border rounded-xl outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Frequency period</label>
                        <select
                          value={tpEvery}
                          onChange={(e) => setTpEvery(e.target.value)}
                          className="w-full text-xs p-2.5 border rounded-xl outline-none cursor-pointer"
                        >
                          <option>1 month</option>
                          <option>3 months</option>
                          <option>6 months</option>
                          <option>12 months</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Achieve KPI calculation</label>
                        <select
                          value={tpAchieveKpi}
                          onChange={(e) => setTpAchieveKpi(e.target.value)}
                          className="w-full text-xs p-2.5 border rounded-xl outline-none cursor-pointer"
                        >
                          <option>Yes</option>
                          <option>No</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Notification period</label>
                        <select
                          value={tpNotify}
                          onChange={(e) => setTpNotify(e.target.value)}
                          className="w-full text-xs p-2.5 border rounded-xl outline-none cursor-pointer"
                        >
                          <option>7 days</option>
                          <option>15 days</option>
                          <option>30 days</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Include self evaluation</label>
                        <select
                          value={tpTrainee}
                          onChange={(e) => setTpTrainee(e.target.value)}
                          className="w-full text-xs p-2.5 border rounded-xl outline-none cursor-pointer"
                        >
                          <option>Yes</option>
                          <option>No</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Primary appraiser</label>
                        <select
                          value={tpAppraiser}
                          onChange={(e) => setTpAppraiser(e.target.value)}
                          className="w-full text-xs p-2.5 border rounded-xl outline-none cursor-pointer"
                        >
                          <option>Direct manager</option>
                          <option>Department Head</option>
                          <option>Peer Group</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Status</label>
                        <select
                          value={tpStatus}
                          onChange={(e) => setTpStatus(e.target.value)}
                          className="w-full text-xs p-2.5 border rounded-xl outline-none cursor-pointer"
                        >
                          <option>Active</option>
                          <option>Draft</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveType}
                      className="w-full py-2.5 bg-[#2f66e0] text-white rounded-xl font-bold cursor-pointer hover:bg-blue-700 transition"
                    >
                      Save Evaluation Type
                    </button>
                  </div>
                )}

                {/* 5. EVAL CATEGORY MODALS */}
                {(activeModal === 'category_new' || activeModal === 'category_edit') && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Category criteria name</label>
                      <input
                        type="text"
                        placeholder="e.g. Technical abilities, Client communication"
                        value={catName}
                        onChange={(e) => setCatName(e.target.value)}
                        className="w-full text-xs p-2.5 border rounded-xl outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">KPI connection type</label>
                        <select
                          value={catType}
                          onChange={(e) => setCatType(e.target.value as any)}
                          className="w-full text-xs p-2.5 border rounded-xl outline-none cursor-pointer"
                        >
                          <option>Attribute</option>
                          <option>Competency</option>
                          <option>KPI category</option>
                          <option>Attendance KPI</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Weightage percentage %</label>
                        <input
                          type="number"
                          placeholder="e.g. 25"
                          value={catWeight === 0 ? '' : catWeight}
                          onChange={(e) => setCatWeight(Number(e.target.value))}
                          className="w-full text-xs p-2.5 border rounded-xl outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Scoring system</label>
                        <select
                          value={catScoring}
                          onChange={(e) => setCatScoring(e.target.value)}
                          className="w-full text-xs p-2.5 border rounded-xl outline-none cursor-pointer"
                        >
                          <option>1–5 rating scale</option>
                          <option>Pass / Fail gate</option>
                          <option>Percentage score</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Measurement target</label>
                        <input
                          type="text"
                          value={catMeasurement}
                          onChange={(e) => setCatMeasurement(e.target.value)}
                          className="w-full text-xs p-2.5 border rounded-xl outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Levels defined</label>
                      <input
                        type="text"
                        value={catLevels}
                        onChange={(e) => setCatLevels(e.target.value)}
                        className="w-full text-xs p-2.5 border rounded-xl outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveCategory}
                      className="w-full py-2.5 bg-[#2f66e0] text-white rounded-xl font-bold cursor-pointer hover:bg-blue-700 transition"
                    >
                      Save Category Settings
                    </button>
                  </div>
                )}

                {/* 6. EVAL SETUP MODALS */}
                {activeModal === 'setup_new' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Assessment Template Setup Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Year-end Appraisal Form 2026"
                        value={stpName}
                        onChange={(e) => setStpName(e.target.value)}
                        className="w-full text-xs p-2.5 border rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Evaluation Type</label>
                      <select
                        value={stpType}
                        onChange={(e) => setStpType(e.target.value)}
                        className="w-full text-xs p-2.5 border rounded-xl outline-none cursor-pointer"
                      >
                        <option>Year-end appraisal</option>
                        <option>Probation review</option>
                        <option>H2 performance review</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1.5">Linked categories to evaluate</label>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                        {[
                          'Technical skills (Attribute · 25%)',
                          'Communication (Attribute · 15%)',
                          'Leadership (Competency · 20%)',
                          'Project delivery (KPI · 30%)',
                          'Attendance (Attendance KPI · 10%)'
                        ].map((cat, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              id={`stp-lnk-cat-${i}`}
                              defaultChecked={stpCategories.includes(cat)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setStpCategories([...stpCategories, cat]);
                                } else {
                                  setStpCategories(stpCategories.filter(x => x !== cat));
                                }
                              }}
                              className="h-3.5 w-3.5 rounded border-slate-300"
                            />
                            <label htmlFor={`stp-lnk-cat-${i}`} className="text-slate-600 font-semibold cursor-pointer">{cat}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3.5 border-t pt-3">
                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Appraiser notes</label>
                        <select value={stpAppraiserNote} onChange={(e) => setStpAppraiserNote(e.target.value)} className="w-full text-xs p-2 border rounded-lg">
                          <option>Yes</option>
                          <option>No</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Career objectives</label>
                        <select value={stpCareerEnabled} onChange={(e) => setStpCareerEnabled(e.target.value)} className="w-full text-xs p-2 border rounded-lg">
                          <option>Yes</option>
                          <option>No</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveSetup}
                      className="w-full py-2.5 bg-[#2f66e0] text-white rounded-xl font-bold cursor-pointer hover:bg-blue-700 transition"
                    >
                      Publish Configuration Setup
                    </button>
                  </div>
                )}

                {/* 7. GRANT PERMISSIONS MODALS */}
                {activeModal === 'grant_permission' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Evaluator / primary appraiser</label>
                      <select
                        value={prmEvaluator}
                        onChange={(e) => setPrmEvaluator(e.target.value)}
                        className="w-full text-xs p-2.5 border rounded-xl outline-none cursor-pointer"
                      >
                        <option>David Ng</option>
                        <option>Nina Reza</option>
                        <option>Kevin Lim</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Evaluation framework type</label>
                      <select
                        value={prmType}
                        onChange={(e) => setPrmType(e.target.value)}
                        className="w-full text-xs p-2.5 border rounded-xl outline-none cursor-pointer"
                      >
                        <option>Year-end appraisal</option>
                        <option>Probation review</option>
                        <option>Mid-year review</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Access valid from</label>
                        <input
                          type="text"
                          value={prmFrom}
                          onChange={(e) => setPrmFrom(e.target.value)}
                          className="w-full text-xs p-2.5 border rounded-xl outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Access valid to</label>
                        <input
                          type="text"
                          value={prmTo}
                          onChange={(e) => setPrmTo(e.target.value)}
                          className="w-full text-xs p-2.5 border rounded-xl outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Status</label>
                      <select
                        value={prmStatus}
                        onChange={(e) => setPrmStatus(e.target.value)}
                        className="w-full text-xs p-2.5 border rounded-xl outline-none cursor-pointer"
                      >
                        <option>Active</option>
                        <option>Draft</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={handleSavePermission}
                      className="w-full py-2.5 bg-[#2f66e0] text-white rounded-xl font-bold cursor-pointer hover:bg-blue-700 transition"
                    >
                      Authorize Evaluator Clearance
                    </button>
                  </div>
                )}

                {/* 8. VIEW LIST OVERLAY MODAL */}
                {activeModal === 'view_list' && permissionViewItem && (
                  <div className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="block text-[10px] uppercase font-black text-slate-400">Review Authorization</span>
                        <h4 className="text-sm font-extrabold text-slate-800">{permissionViewItem.evaluator}</h4>
                      </div>
                      <span className="bg-blue-50 text-[#2f66e0] border border-blue-200 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider">
                        {permissionViewItem.type}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-black text-slate-400 tracking-wider mb-2">
                        Assigned Employee Roster ({permissionViewItem.details.length})
                      </span>
                      <div className="border rounded-xl divide-y bg-white max-h-[250px] overflow-y-auto">
                        {permissionViewItem.details.map((emp, idx) => (
                          <div key={idx} className="p-3 font-semibold flex items-center justify-between hover:bg-slate-50/35">
                            <span className="text-slate-800">{emp}</span>
                            <span className="text-emerald-600 font-bold flex items-center gap-1 text-[10.5px]">
                              ● Authorized
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition"
                    >
                      Dismiss View list
                    </button>
                  </div>
                )}

                {/* 9. COMPETENCY MODALS */}
                {(activeModal === 'competency_new' || activeModal === 'competency_edit') && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Competency / Skill name</label>
                      <input
                        type="text"
                        placeholder="e.g. Communication, Technical proficiency"
                        value={compName}
                        onChange={(e) => setCompName(e.target.value)}
                        className="w-full text-xs p-2.5 border rounded-xl outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Competency type</label>
                        <select
                          value={compType}
                          onChange={(e) => {
                            setCompType(e.target.value);
                            if (e.target.value === 'Competency') setCompParent('—');
                          }}
                          className="w-full text-xs p-2.5 border rounded-xl outline-none cursor-pointer"
                        >
                          <option>Competency</option>
                          <option>Sub-comp.</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Parent category Group</label>
                        <select
                          value={compParent}
                          onChange={(e) => setCompParent(e.target.value)}
                          disabled={compType === 'Competency'}
                          className="w-full text-xs p-2.5 border rounded-xl outline-none cursor-pointer disabled:bg-slate-50 disabled:text-slate-400"
                        >
                          <option>—</option>
                          <option>Leadership</option>
                          <option>Problem solving</option>
                          <option>Adaptability</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Definition & Criteria</label>
                      <textarea
                        rows={3}
                        placeholder="Define standard behavioral indicators and rating keys..."
                        value={compDef}
                        onChange={(e) => setCompDef(e.target.value)}
                        className="w-full text-xs p-2.5 border rounded-xl outline-none resize-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveCompetency}
                      className="w-full py-2.5 bg-[#2f66e0] text-white rounded-xl font-bold cursor-pointer hover:bg-blue-700 transition"
                    >
                      Save Competency Criteria
                    </button>
                  </div>
                )}

                {/* 9. NEW EVALUATION MODAL */}
                {activeModal === 'evaluation_new' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="bg-blue-50/40 p-3.5 border border-blue-100 rounded-2xl">
                      <p className="text-[11px] text-[#2f66e0] font-semibold">
                        Initiate a brand new performance evaluation workstation record. You can select any employee and specify initial scorecard attribute scores.
                      </p>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Select Employee *</label>
                      <select
                        value={evalEmpId}
                        onChange={(e) => setEvalEmpId(e.target.value)}
                        className="w-full text-xs p-2.5 border rounded-xl outline-none cursor-pointer bg-white"
                      >
                        {(() => {
                          const employeeOptions = employees && employees.length > 0 ? employees : [
                            { id: 'EMP-0021', name: 'Sarah Lim', department: 'Engineering' },
                            { id: 'EMP-0022', name: 'Raj Kumar', department: 'Engineering' },
                            { id: 'EMP-0023', name: 'Ahmad L', department: 'Operations' },
                            { id: 'EMP-0024', name: 'Nadia Chen', department: 'Marketing' },
                          ];
                          return employeeOptions.map((emp: any) => (
                            <option key={emp.id} value={emp.id}>
                              {emp.name} ({emp.id}) — {emp.department}
                            </option>
                          ));
                        })()}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Review Type *</label>
                        <select
                          value={evalReviewType}
                          onChange={(e) => setEvalReviewType(e.target.value)}
                          className="w-full text-xs p-2.5 border rounded-xl outline-none cursor-pointer bg-white"
                        >
                          <option>Year-end appraisal</option>
                          <option>Mid-year appraisal</option>
                          <option>Probation review</option>
                          <option>360 Performance Review</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Review Period *</label>
                        <input
                          type="text"
                          placeholder="e.g. Jan–Dec 2026"
                          value={evalReviewPeriod}
                          onChange={(e) => setEvalReviewPeriod(e.target.value)}
                          className="w-full text-xs p-2.5 border rounded-xl outline-none text-slate-700 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Review Date *</label>
                      <input
                        type="date"
                        value={evalReviewDate}
                        onChange={(e) => setEvalReviewDate(e.target.value)}
                        className="w-full text-xs p-2.5 border rounded-xl outline-none text-slate-700 bg-white"
                      />
                    </div>

                    <div className="border-t border-slate-100 pt-3 space-y-3">
                      <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Initial Attribute Scores (1-5 Scale)</span>
                      
                      <div className="grid grid-cols-3 gap-2.5 text-xs">
                        <div>
                          <label className="block text-[9.5px] text-slate-500 mb-1 font-bold">Code Quality</label>
                          <select
                            value={evalCodeQuality}
                            onChange={(e) => setEvalCodeQuality(Number(e.target.value))}
                            className="w-full p-2 border rounded-lg outline-none bg-white font-bold"
                          >
                            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[9.5px] text-slate-500 mb-1 font-bold">Problem Solving</label>
                          <select
                            value={evalProblemSolving}
                            onChange={(e) => setEvalProblemSolving(Number(e.target.value))}
                            className="w-full p-2 border rounded-lg outline-none bg-white font-bold"
                          >
                            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[9.5px] text-slate-500 mb-1 font-bold">System Design</label>
                          <select
                            value={evalSystemDesign}
                            onChange={(e) => setEvalSystemDesign(Number(e.target.value))}
                            className="w-full p-2 border rounded-lg outline-none bg-white font-bold"
                          >
                            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 text-xs border-t border-slate-100 pt-3">
                      <div>
                        <label className="block text-[9.5px] text-slate-500 mb-1 font-bold">Sprints Completed</label>
                        <input
                          type="number"
                          value={evalSprintsCompleted}
                          onChange={(e) => setEvalSprintsCompleted(Number(e.target.value))}
                          className="w-full p-2 border rounded-lg outline-none font-bold text-slate-700 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] text-slate-500 mb-1 font-bold">Bugs SLA %</label>
                        <input
                          type="number"
                          value={evalBugsSLA}
                          onChange={(e) => setEvalBugsSLA(Number(e.target.value))}
                          className="w-full p-2 border rounded-lg outline-none font-bold text-slate-700 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[9.5px] text-slate-500 mb-1 font-bold">Attendance %</label>
                        <input
                          type="text"
                          value={evalAttendance}
                          onChange={(e) => setEvalAttendance(e.target.value)}
                          className="w-full p-2 border rounded-lg outline-none font-bold text-slate-700 bg-white"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCreateEvaluation}
                      className="w-full py-2.5 bg-[#2f66e0] text-white rounded-xl font-bold cursor-pointer hover:bg-blue-700 transition mt-2"
                    >
                      Establish Evaluation Workstation
                    </button>
                  </div>
                )}

                {/* 10. REVIEW DOSSIER VIEW MODAL */}
                {activeModal === 'view_report' && reportDetailItem && (
                  <div className="space-y-4">
                    <div className="border bg-slate-50/50 rounded-2xl p-4 space-y-3.5">
                      <div className="flex items-center justify-between pb-2 border-b border-white">
                        <div>
                          <span className="text-[9.5px] uppercase font-black text-slate-400">Employee dossier review card</span>
                          <h4 className="text-sm font-black text-slate-800">{reportDetailItem.name}</h4>
                        </div>
                        <span className={`px-3 py-0.5 border font-semibold text-xs rounded-md ${reportDetailItem.gradeColor}`}>
                          Grade {reportDetailItem.grade}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-600">
                        <div>
                          <span className="block text-[9px] uppercase font-bold text-slate-400">Framework type</span>
                          <p className="text-slate-800">{reportDetailItem.type}</p>
                        </div>
                        <div>
                          <span className="block text-[9px] uppercase font-bold text-slate-400">Review period</span>
                          <p className="text-slate-800 font-mono">{reportDetailItem.period}</p>
                        </div>
                        <div>
                          <span className="block text-[9px] uppercase font-bold text-slate-400">Appraiser manager</span>
                          <p className="text-slate-800">{reportDetailItem.appraiser}</p>
                        </div>
                        <div>
                          <span className="block text-[9px] uppercase font-bold text-slate-400">Status</span>
                          <span className="text-emerald-600 font-bold text-[11px]">Completed &bull; Verified</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase text-slate-400 block pb-1 tracking-wider">Score matrix parameters</span>
                      {[
                        { label: 'Technical Skills (Attribute weight)', value: `${reportDetailItem.attr}/100` },
                        { label: 'Project Delivery (KPI metrics success)', value: `${reportDetailItem.kpi}/100` },
                        { label: 'Leadership Qualities (Competency appraisal)', value: `${reportDetailItem.comp}/100` },
                        { label: 'Attendance KPI Score', value: `${reportDetailItem.attend}/100` }
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center p-2 border border-slate-100 rounded-xl bg-white text-xs font-semibold text-slate-700">
                          <span>{item.label}</span>
                          <span className="font-mono font-bold text-slate-900">{item.value}</span>
                        </div>
                      ))}

                      <div className="flex justify-between items-center p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-xs font-bold text-blue-800 mt-2">
                        <span>Total Weighted Performance Score</span>
                        <span className="font-mono text-sm font-black">{reportDetailItem.total} / 100</span>
                      </div>
                    </div>

                    <div className="flex gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => addToast(`Printing report for ${reportDetailItem.name}...`, 'loading')}
                        className="flex-1 py-2 bg-[#2f66e0] text-white rounded-xl text-xs font-bold hover:bg-blue-700 cursor-pointer"
                      >
                        Print EA certificate
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveModal(null)}
                        className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

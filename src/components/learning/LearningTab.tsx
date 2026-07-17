import { useState, useMemo, type FormEvent } from 'react'
import {
  BookOpen,
  Award,
  CheckCircle2,
  AlertTriangle,
  Search,
  Plus,
  Download,
  Upload,
  Play,
  Clock,
  ArrowRight,
  Check,
  RotateCcw,
  Layers,
  ShieldAlert,
  Sliders,
  ExternalLink,
} from 'lucide-react'
import { showActionToast } from '../../utils/actionToast'
import type { ModuleEmployee } from '../../types/moduleEmployee'

type LearningTabProps = {
  employees: ModuleEmployee[]
}

type LearningSubTab = 
  | 'Course Catalog & LMS'
  | 'Structured Learning Paths'
  | 'Compliance & Certifications'
  | 'Assessments & Quiz Engine'
  | 'Learning Analytics';

interface Course {
  id: string;
  title: string;
  category: 'Engineering' | 'Finance' | 'HR' | 'Marketing' | 'Operations' | 'General';
  duration: string;
  source: 'Internal Academy' | 'LinkedIn Learning' | 'Coursera' | 'Udemy';
  format: 'Video Sequence' | 'Document & PDF' | 'Interactive (SCORM)';
  enrolled: boolean;
  progress: number; // 0 to 100
  rating: number;
  instructor: string;
  assessmentComplete: boolean;
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  targetDept: string;
  courses: string[]; // List of course titles
  totalHours: number;
  enrolledCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface ComplianceCert {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  certName: string;
  issuedDate: string;
  expiryDate: string;
  status: 'Active' | 'Expiring Soon' | 'Expired';
  daysRemaining: number;
}

interface QuizQuestion {
  id: number;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}

interface ActiveQuiz {
  id: string;
  title: string;
  timeLimit: string;
  questions: QuizQuestion[];
}

export function LearningTab({ employees }: LearningTabProps) {
  const addToast = (text: string, type?: 'success' | 'loading' | 'error' | 'info') => {
    showActionToast(text, type)
  }

  const [activeSubTab, setActiveSubTab] = useState<LearningSubTab>('Course Catalog & LMS');

  // -------------------------------------------------------------
  // STATE 1: COURSE CATALOG, FILTERS & LMS IMPORT
  // -------------------------------------------------------------
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 'CRS-401',
      title: 'Advanced AWS Cloud Orchestration & Serverless Architecture',
      category: 'Engineering',
      duration: '8h 45m',
      source: 'LinkedIn Learning',
      format: 'Video Sequence',
      enrolled: true,
      progress: 60,
      rating: 4.8,
      instructor: 'Dr. Evelyn Harris',
      assessmentComplete: false
    },
    {
      id: 'CRS-402',
      title: 'ISO 27001 Cybersecurity Compliance Awareness Protocol',
      category: 'General',
      duration: '2h 15m',
      source: 'Internal Academy',
      format: 'Interactive (SCORM)',
      enrolled: true,
      progress: 0,
      rating: 4.5,
      instructor: 'HR Security Officers',
      assessmentComplete: false
    },
    {
      id: 'CRS-403',
      title: 'Global GDPR Privacy Safeguards & Data Retention Standards',
      category: 'HR',
      duration: '3h 30m',
      source: 'Coursera',
      format: 'Interactive (SCORM)',
      enrolled: false,
      progress: 0,
      rating: 4.6,
      instructor: 'Legal Compliance Team',
      assessmentComplete: false
    },
    {
      id: 'CRS-404',
      title: 'High-Impact Brand Strategy & Modern Social Funnels',
      category: 'Marketing',
      duration: '6h 15m',
      source: 'Udemy',
      format: 'Video Sequence',
      enrolled: false,
      progress: 0,
      rating: 4.7,
      instructor: 'Marcus Aurel',
      assessmentComplete: false
    },
    {
      id: 'CRS-405',
      title: 'Corporate Treasury Accounting & GAAP Tax Structures',
      category: 'Finance',
      duration: '12h 40m',
      source: 'Internal Academy',
      format: 'Document & PDF',
      enrolled: true,
      progress: 100,
      rating: 4.9,
      instructor: 'Chong Wei Min',
      assessmentComplete: true
    },
    {
      id: 'CRS-406',
      title: 'Agile Operations: Kanban, Lean, and Six Sigma Frameworks',
      category: 'Operations',
      duration: '5h 10m',
      source: 'LinkedIn Learning',
      format: 'Video Sequence',
      enrolled: false,
      progress: 0,
      rating: 4.3,
      instructor: 'Sarah Jenkins',
      assessmentComplete: false
    }
  ]);

  const [courseSearch, setCourseSearch] = useState('');
  const [courseCategoryFilter, setCourseCategoryFilter] = useState<string>('All');
  const [courseSourceFilter, setCourseSourceFilter] = useState<string>('All');
  
  // SCORM/xAPI Manifest package Simulation Upload State
  const [isLmsModalOpen, setIsLmsModalOpen] = useState(false);
  const [scormTitle, setScormTitle] = useState('');
  const [scormProvider, setScormProvider] = useState<'LinkedIn Learning' | 'Coursera' | 'Udemy'>('LinkedIn Learning');
  const [scormCategory, setScormCategory] = useState<'Engineering' | 'Finance' | 'HR' | 'Marketing' | 'Operations' | 'General'>('General');
  const [scormFormat, setScormFormat] = useState<'Interactive (SCORM)' | 'Video Sequence'>('Interactive (SCORM)');
  const [scormDuration, setScormDuration] = useState('3h 30m');

  // -------------------------------------------------------------
  // STATE 2: STRUCTURED LEARNING PATHS (Bundles)
  // -------------------------------------------------------------
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([
    {
      id: 'PTH-01',
      name: 'Executive Leadership Readiness Milestone Path',
      description: 'Strategic grooming curriculum designed to prepare high-potential seniors for VP or Director roles.',
      targetDept: 'HR',
      courses: [
        'High-Impact Brand Strategy & Modern Social Funnels',
        'Global GDPR Privacy Safeguards & Data Retention Standards',
        'ISO 27001 Cybersecurity Compliance Awareness Protocol'
      ],
      totalHours: 12,
      enrolledCount: 14,
      difficulty: 'Advanced'
    },
    {
      id: 'PTH-02',
      name: 'Advanced Software Engineer Onboarding & Architecture',
      description: 'Essential systems path mapping multi-tenant deployments, performance monitoring, and container security.',
      targetDept: 'Engineering',
      courses: [
        'Advanced AWS Cloud Orchestration & Serverless Architecture',
        'ISO 27001 Cybersecurity Compliance Awareness Protocol'
      ],
      totalHours: 11,
      enrolledCount: 38,
      difficulty: 'Intermediate'
    }
  ]);

  const [isPathCreatorOpen, setIsPathCreatorOpen] = useState(false);
  const [newPathName, setNewPathName] = useState('');
  const [newPathDesc, setNewPathDesc] = useState('');
  const [newPathDept, setNewPathDept] = useState('Engineering');
  const [newPathDiff, setNewPathDiff] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [newPathHours, setNewPathHours] = useState(8);
  const [selectedPathCourses, setSelectedPathCourses] = useState<string[]>([]);

  // -------------------------------------------------------------
  // STATE 3: COMPLIANCE & CERTIFICATES (Alerts & Renewals)
  // -------------------------------------------------------------
  const [complianceRecords, setComplianceRecords] = useState<ComplianceCert[]>([
    {
      id: 'CRT-981',
      employeeId: 'EMP-001',
      employeeName: 'Sarah Lim',
      department: 'Engineering',
      certName: 'ISO 27001 InfoSec Master Certificate',
      issuedDate: '2025-06-15',
      expiryDate: '2026-06-15', // Expired recently
      status: 'Expired',
      daysRemaining: -1
    },
    {
      id: 'CRT-982',
      employeeId: 'EMP-0285',
      employeeName: 'Raj Kumar',
      department: 'Operations',
      certName: 'Global GDPR Compliance Representative Cert',
      issuedDate: '2025-10-10',
      expiryDate: '2026-07-10', // Expiring is ~24 days
      status: 'Expiring Soon',
      daysRemaining: 24
    },
    {
      id: 'CRT-983',
      employeeId: 'EMP-0312',
      employeeName: 'Pinky Sharma',
      department: 'Finance',
      certName: 'GAAP Advanced Corporate Accounting',
      issuedDate: '2025-01-12',
      expiryDate: '2027-01-12',
      status: 'Active',
      daysRemaining: 210
    },
    {
      id: 'CRT-984',
      employeeId: 'EMP-004',
      employeeName: 'John Doe',
      department: 'Marketing',
      certName: 'Advanced Social Brand Funneling Certificate',
      issuedDate: '2025-04-12',
      expiryDate: '2026-09-12',
      status: 'Active',
      daysRemaining: 88
    }
  ]);

  // -------------------------------------------------------------
  // STATE 4: ASSESSMENT & INTERACTIVE QUIZ ENGINE
  // -------------------------------------------------------------
  const quizRepository: ActiveQuiz[] = [
    {
      id: 'QZ-201',
      title: 'AWS Serverless Solutions and Optimization Quiz',
      timeLimit: '10 Mins',
      questions: [
        {
          id: 1,
          questionText: 'Which AWS service fits a event-driven, serverless execution layout with multi-language runtimes?',
          options: ['EC2 Dedicated Hosts', 'Amazon Lambda Functions', 'ECS on Ec2 Instances', 'S3 Glacier Standard'],
          correctAnswerIndex: 1
        },
        {
          id: 2,
          questionText: 'What parameter primarily controls the horizontal scale throttling limit for Lambda executions?',
          options: ['Memory allocation limit', 'Concurrency setting buffer', 'VPC endpoint routing configurations', 'IAM security policy bounds'],
          correctAnswerIndex: 1
        },
        {
          id: 3,
          questionText: 'To achieve extreme sub-millisecond response caches for repetitive database queries, what serverless overlay is recommended?',
          options: ['VPC NAT Gateway', 'Amazon DynamoDB Accelerator (DAX)', 'Redshift Analytical Cluster', 'Kinesis Firehose buffers'],
          correctAnswerIndex: 1
        }
      ]
    },
    {
      id: 'QZ-202',
      title: 'GDPR / Personal Data Protection Compliance Test',
      timeLimit: '5 Mins',
      questions: [
        {
          id: 1,
          questionText: 'What constitutes a prompt "Data Breach Notice notification response window" under official GDPR guidelines?',
          options: ['Immediately within 72 hours', 'Within 30 calendar days', 'When the quarterly financial report is delivered', 'No explicit deadline exists'],
          correctAnswerIndex: 0
        },
        {
          id: 2,
          questionText: 'Which principle governs that employee datasets or customer entries must NOT be kept indefinitely if they no longer fulfill business uses?',
          options: ['Data Minimization & Storage Limitation', 'The territorial sovereignty boundary', 'Encrypted TLS communication tunnels', 'Algorithmic efficiency targets'],
          correctAnswerIndex: 0
        }
      ]
    }
  ];

  const [activeQuizToTake, setActiveQuizToTake] = useState<ActiveQuiz | null>(null);
  const [userQuizAnswers, setUserQuizAnswers] = useState<Record<number, number>>({});
  const [quizScoreCard, setQuizScoreCard] = useState<{ score: number; passed: boolean; submitted: boolean } | null>(null);

  // -------------------------------------------------------------
  // CALCULATED METRICS FOR ANALYTICS
  // -------------------------------------------------------------
  const filteredCourses = useMemo(() => {
    return courses.filter(crs => {
      const matchSearch = crs.title.toLowerCase().includes(courseSearch.toLowerCase()) || 
                          crs.instructor.toLowerCase().includes(courseSearch.toLowerCase());
      const matchCategory = courseCategoryFilter === 'All' || crs.category === courseCategoryFilter;
      const matchSource = courseSourceFilter === 'All' || crs.source === courseSourceFilter;
      return matchSearch && matchCategory && matchSource;
    });
  }, [courses, courseSearch, courseCategoryFilter, courseSourceFilter]);

  const aggregateMetrics = useMemo(() => {
    const totalEnrolled = courses.filter(c => c.enrolled).length;
    const completedCount = courses.filter(c => c.progress === 100).length;
    const avgProgress = Math.round(
      courses.reduce((acc, curr) => acc + (curr.enrolled ? curr.progress : 0), 0) / (totalEnrolled || 1)
    );
    const expiringCertCount = complianceRecords.filter(r => r.status !== 'Active').length;

    // completion by dept mapping
    const deptStats = {
      Engineering: { completed: 35, enroute: 48 },
      Operations: { completed: 21, enroute: 30 },
      HR: { completed: 18, enroute: 24 },
      Finance: { completed: 28, enroute: 29 },
      Marketing: { completed: 15, enroute: 22 }
    };

    return {
      totalEnrolled,
      completedCount,
      avgProgress,
      expiringCertCount,
      deptStats
    };
  }, [courses, complianceRecords]);

  // -------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------
  const handleEnrollCourse = (id: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id === id) {
        const nextEnrolled = !c.enrolled;
        if (nextEnrolled) {
          addToast(`Enrolled in "${c.title}" successfully. Track progress via your catalog dashboard.`, 'success');
          return { ...c, enrolled: true, progress: 5 };
        } else {
          addToast(`Withdrew active enrollment from "${c.title}"`, 'info');
          return { ...c, enrolled: false, progress: 0 };
        }
      }
      return c;
    }));
  };

  const handleUpdateProgressQuizMode = (id: string, nextProgress: number) => {
    setCourses(prev => prev.map(c => {
      if (c.id === id) {
        addToast(`Course execution updated to ${nextProgress}% complete.`, 'info');
        return { ...c, progress: nextProgress };
      }
      return c;
    }));
  };

  const handleSimulatedLmsImport = (e: FormEvent) => {
    e.preventDefault();
    if (!scormTitle.trim()) {
      addToast('Please enter a descriptive Course title for the SCORM/xAPI catalog listing.', 'error');
      return;
    }

    const newCrs: Course = {
      id: `CRS-${Math.floor(407 + Math.random() * 200)}`,
      title: scormTitle,
      category: scormCategory,
      duration: scormDuration,
      source: scormProvider,
      format: scormFormat,
      enrolled: false,
      progress: 0,
      rating: 4.5,
      instructor: `${scormProvider} curated program`,
      assessmentComplete: false
    };

    setCourses([newCrs, ...courses]);
    setScormTitle('');
    setIsLmsModalOpen(false);
    addToast(`Successfully unpacked xAPI / SCORM metadata. "${newCrs.title}" added to directory catalog!`, 'success');
  };

  const handleCreatePathSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newPathName.trim() || !newPathDesc.trim()) {
      addToast('Please specify a title and curriculum scope for the Structured Learning Path.', 'error');
      return;
    }

    const pathItem: LearningPath = {
      id: `PTH-0${learningPaths.length + 1}`,
      name: newPathName,
      description: newPathDesc,
      targetDept: newPathDept,
      courses: selectedPathCourses.length > 0 ? selectedPathCourses : ['Cybersecurity Basics & Firewalls', 'Cloud Core Infrastructure'],
      totalHours: Number(newPathHours) || 12,
      enrolledCount: 1,
      difficulty: newPathDiff
    };

    setLearningPaths([...learningPaths, pathItem]);
    setNewPathName('');
    setNewPathDesc('');
    setSelectedPathCourses([]);
    setIsPathCreatorOpen(false);
    addToast(`New Learning Path "${pathItem.name}" bundled and assigned to ${pathItem.targetDept} cohort!`, 'success');
  };

  const toggleCourseInPathCreation = (title: string) => {
    setSelectedPathCourses(prev => {
      if (prev.includes(title)) {
        return prev.filter(t => t !== title);
      } else {
        return [...prev, title];
      }
    });
  };

  const handleSendRenewalReminder = (_id: string, empName: string, certName: string) => {
    addToast(`Transmitted immediate compliance warning alert to ${empName}. Notified: ${certName}`, 'success');
  };

  const handleCertRenewalProcess = (id: string) => {
    setComplianceRecords(prev => prev.map(rec => {
      if (rec.id === id) {
        addToast(`Admin Renewal Overrides saved for ${rec.employeeName}. Cert state is now ACTIVE.`, 'success');
        return {
          ...rec,
          status: 'Active',
          issuedDate: new Date().toISOString().split('T')[0],
          expiryDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
          daysRemaining: 365
        };
      }
      return rec;
    }));
  };

  const handleInitializeQuizSession = (quiz: ActiveQuiz) => {
    setActiveQuizToTake(quiz);
    setUserQuizAnswers({});
    setQuizScoreCard(null);
    addToast(`Secure testing bounds initialized for "${quiz.title}". Closed-room tracking active.`, 'info');
  };

  const handleSelectQuizAnswer = (questionId: number, optionIdx: number) => {
    setUserQuizAnswers(prev => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  const handleSubmitQuizAnswers = () => {
    if (!activeQuizToTake) return;
    
    // Validate all answered
    const totalQuestions = activeQuizToTake.questions.length;
    const answeredCount = Object.keys(userQuizAnswers).length;
    if (answeredCount < totalQuestions) {
      addToast(`Please answer all ${totalQuestions} randomized questions before requesting scoring diagnostics.`, 'error');
      return;
    }

    let correctCount = 0;
    activeQuizToTake.questions.forEach(q => {
      if (userQuizAnswers[q.id] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / totalQuestions) * 100);
    const passed = scorePct >= 75; // Pass rank 75%

    setQuizScoreCard({
      score: scorePct,
      passed,
      submitted: true
    });

    if (passed) {
      addToast(`Passed! Measured retention: ${scorePct}%. Certificate compiled.`, 'success');
      // Mark course as completed or quiz completed
      setCourses(prev => prev.map(c => {
        // Mock matching the AWS or GDPR course
        if (activeQuizToTake.id === 'QZ-201' && c.id === 'CRS-401') {
          return { ...c, progress: 100, assessmentComplete: true };
        }
        if (activeQuizToTake.id === 'QZ-202' && c.id === 'CRS-403') {
          return { ...c, progress: 100, assessmentComplete: true };
        }
        return c;
      }));
    } else {
      addToast(`Grade scored ${scorePct}%. Score is below 75% benchmark. Requesting a retry of this curriculum block.`, 'error');
    }
  };

  const handleRegisterLmsDemoPreset = (origin: string) => {
    addToast(`Synced connection credentials with external ${origin} portal via OAuth SSO tokens.`, 'loading');
    setTimeout(() => {
      addToast(`Loaded sandbox course modules from external ${origin} library index.`, 'success');
    }, 1200);
  };

  return (
    <div id="learning-management-module-root" className="space-y-6">
      
      {/* Top Navigation Row - styled exactly matching other modular HRM tabs */}
      <div id="learning-navigator-row" className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div id="learning-nav-tabs" className="flex items-center gap-1.5 select-none overflow-x-auto w-full lg:w-auto scrollbar-none pb-1 lg:pb-0">
          {(
            [
              'Course Catalog & LMS',
              'Structured Learning Paths',
              'Compliance & Certifications',
              'Assessments & Quiz Engine',
              'Learning Analytics'
            ] as LearningSubTab[]
          ).map((tab) => {
            const isActive = activeSubTab === tab;
            return (
              <button
                id={`learning-tab-${tab.toLowerCase().replace(/\s+/g, '-').replace('&', 'and')}`}
                key={tab}
                onClick={() => {
                  setActiveSubTab(tab);
                  // clear active quiz if switching tabs to prevent interface locks
                  setActiveQuizToTake(null);
                  setQuizScoreCard(null);
                }}
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

        {/* Global Action Banner */}
        <div className="flex items-center gap-2 font-medium">
          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">SCORM 2004 v4 / xAPI standard synced</span>
        </div>
      </div>




      {/* TAB 1: COURSE CATALOG & LMS INTEGRATION */}
      {activeSubTab === 'Course Catalog & LMS' && (
        <div id="learning-catalog-pane" className="space-y-6">
          
          {/* Quick Stats overview panel */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-3xs flex items-center gap-3">
              <span className="p-2 bg-blue-50 text-[#2f66e0] rounded-lg">
                <BookOpen className="h-4 w-4" />
              </span>
              <div>
                <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Catalog Inventory Size</span>
                <span className="text-sm font-extrabold text-slate-800">{courses.length} courses deployed</span>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-3xs flex items-center gap-3">
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <div>
                <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">My Current Classes</span>
                <span className="text-sm font-extrabold text-slate-800">{aggregateMetrics.totalEnrolled} active courses</span>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-3xs flex items-center gap-3">
              <span className="p-2 bg-violet-50 text-violet-600 rounded-lg">
                <Award className="h-4 w-4" />
              </span>
              <div>
                <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Average completion progress</span>
                <span className="text-sm font-extrabold text-slate-800">{aggregateMetrics.avgProgress}% certified</span>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-3xs flex items-center gap-3">
              <span className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                <AlertTriangle className="h-4 w-4" />
              </span>
              <div>
                <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Compliance Risks Pending</span>
                <span className="text-sm font-extrabold text-rose-700">{aggregateMetrics.expiringCertCount} require attention</span>
              </div>
            </div>
          </div>

          {/* Filtering and Search Ribbon + Action Buttons */}
          <div className="bg-white border border-slate-100 p-4.5 rounded-2xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              {/* Search */}
              <div className="relative w-full sm:w-60">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Query title or instructor..."
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-100 rounded-xl pl-9 pr-3 py-2 outline-none focus:bg-white focus:border-slate-200 transition-all font-medium text-slate-700"
                />
              </div>

              {/* Category selector */}
              <div className="w-full sm:w-auto">
                <select
                  value={courseCategoryFilter}
                  onChange={(e) => setCourseCategoryFilter(e.target.value)}
                  className="w-full text-xs font-bold text-slate-600 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 outline-none cursor-pointer hover:bg-slate-100/40"
                >
                  <option value="All">All Categories</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Finance">Finance</option>
                  <option value="HR">HR</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                  <option value="General">General / Core</option>
                </select>
              </div>

              {/* Source filter */}
              <div className="w-full sm:w-auto">
                <select
                  value={courseSourceFilter}
                  onChange={(e) => setCourseSourceFilter(e.target.value)}
                  className="w-full text-xs font-bold text-slate-600 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 outline-none cursor-pointer hover:bg-slate-100/40"
                >
                  <option value="All">All Providers</option>
                  <option value="Internal Academy">Internal Academy</option>
                  <option value="LinkedIn Learning">LinkedIn Learning</option>
                  <option value="Coursera">Coursera</option>
                  <option value="Udemy">Udemy</option>
                </select>
              </div>
            </div>

            {/* Quick action triggers */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                onClick={() => setIsLmsModalOpen(true)}
                className="bg-[#2f66e0] hover:bg-opacity-95 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-3xs"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Import SCORM/xAPI Packet</span>
              </button>
            </div>

          </div>

          {/* Quick LMS Integration Hub Presets Bar */}
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Layers className="h-4 w-4 text-slate-500" />
              <div>
                <span className="text-[10.5px] font-black text-slate-700 block uppercase tracking-wider">Enterprise LMS Integration Hub</span>
                <span className="text-[9.5px] text-slate-400 font-semibold">Instantly sync third-party curriculum content indexes</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleRegisterLmsDemoPreset('LinkedIn Learning')}
                className="bg-white border-slate-100 text-slate-600 hover:border-blue-300 text-[10px] font-black px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-3xs"
              >
                <span>Connect LinkedIn Learning</span>
                <ExternalLink className="h-2.5 w-2.5 text-slate-400" />
              </button>
              <button
                onClick={() => handleRegisterLmsDemoPreset('Coursera Enterprise')}
                className="bg-white border-slate-100 text-slate-600 hover:border-indigo-300 text-[10px] font-black px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-3xs"
              >
                <span>Connect Coursera</span>
                <ExternalLink className="h-2.5 w-2.5 text-slate-400" />
              </button>
              <button
                onClick={() => handleRegisterLmsDemoPreset('Udemy Business')}
                className="bg-white border-slate-100 text-slate-600 hover:border-red-350 text-[10px] font-black px-2.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-3xs"
              >
                <span>Connect Udemy Business</span>
                <ExternalLink className="h-2.5 w-2.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* SCORM IMPORT MODAL OVERLAY */}
          {isLmsModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white border border-slate-100 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
                <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                  <div className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-[#2f66e0]" />
                    <h5 className="text-[13px] font-black text-slate-800 uppercase tracking-wide">Import SCORM / xAPI Package</h5>
                  </div>
                  <button
                    onClick={() => setIsLmsModalOpen(false)}
                    className="text-slate-400 hover:text-slate-750 text-sm font-extrabold px-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSimulatedLmsImport} className="space-y-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Select Manifest Standard</label>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2 border border-blue-400 bg-blue-50/40 rounded-xl text-center">
                        <span className="text-[10.5px] font-black text-[#2f66e0] block">SCORM 1.2</span>
                        <span className="text-[8.5px] text-slate-400 font-bold block mt-0.5">Manifest.xml</span>
                      </div>
                      <div className="p-2 border border-slate-100 hover:border-slate-300 rounded-xl text-center cursor-pointer">
                        <span className="text-[10.5px] font-black text-slate-700 block">SCORM 2004</span>
                        <span className="text-[8.5px] text-slate-400 font-bold block mt-0.5">Unpacked zip</span>
                      </div>
                      <div className="p-2 border border-slate-105 hover:border-slate-355 rounded-xl text-center cursor-pointer">
                        <span className="text-[10.5px] font-black text-slate-750 block">Experience API</span>
                        <span className="text-[8.5px] text-slate-400 font-bold block mt-0.5">xAPI Wrapper</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Course Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Threat Mitigation and Phishing Countermeasures"
                      value={scormTitle}
                      onChange={(e) => setScormTitle(e.target.value)}
                      className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl p-2.5 outline-none focus:bg-white focus:border-slate-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block mb-1">Provider Source</label>
                      <select
                        value={scormProvider}
                        onChange={(e) => setScormProvider(e.target.value as any)}
                        className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl p-2.5 cursor-pointer outline-none"
                      >
                        <option value="LinkedIn Learning">LinkedIn Learning</option>
                        <option value="Coursera">Coursera</option>
                        <option value="Udemy">Udemy</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block mb-1">Course Category</label>
                      <select
                        value={scormCategory}
                        onChange={(e) => setScormCategory(e.target.value as any)}
                        className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl p-2.5 cursor-pointer outline-none"
                      >
                        <option value="General">General / Core</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Finance">Finance</option>
                        <option value="HR">HR</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Operations">Operations</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block mb-1">Format Type</label>
                      <select
                        value={scormFormat}
                        onChange={(e) => setScormFormat(e.target.value as any)}
                        className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl p-2.5 cursor-pointer outline-none"
                      >
                        <option value="Interactive (SCORM)">Interactive SCORM Module</option>
                        <option value="Video Sequence">Video Lecture Track</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block mb-1">Estimated duration</label>
                      <input
                        type="text"
                        placeholder="e.g., 4h 15m"
                        value={scormDuration}
                        onChange={(e) => setScormDuration(e.target.value)}
                        className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-155 rounded-xl p-2.5 outline-none focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Dummy Drag File */}
                  <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center bg-slate-50/55">
                    <Download className="h-6 w-6 text-[#2f66e0] mx-auto opacity-70" />
                    <span className="text-[10.5px] font-black text-slate-700 block mt-1">Select standard ZIP file</span>
                    <span className="text-[9px] text-slate-400 block font-medium">Accepts .zip package files with metadata.xml manifest</span>
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setIsLmsModalOpen(false)}
                      className="px-4 py-2 border border-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#2f66e0] text-white rounded-xl text-xs font-black shadow-3xs cursor-pointer whitespace-nowrap"
                    >
                      Unpack & Complete Import
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Core Course Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs hover:shadow-xs transition-all flex flex-col justify-between">
                <div>
                  
                  {/* Category + Rating metadata row */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[9.5px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-blue-50 text-[#2f66e0] border border-blue-100/50">
                      {course.category}
                    </span>
                    
                    <div className="flex items-center gap-1">
                      <span className="text-amber-400">★</span>
                      <span className="text-[10.5px] text-slate-600 font-extrabold">{course.rating}</span>
                    </div>
                  </div>

                  <h5 className="text-[13px] font-black text-slate-800 leading-tight">
                    {course.title}
                  </h5>

                  <p className="text-[11px] text-slate-400 mt-1 font-semibold">
                    Instructed by: <span className="text-slate-600">{course.instructor}</span>
                  </p>

                  <div className="grid grid-cols-3 gap-1.5 py-3.5 border-y border-slate-50 my-4 text-center">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Duration</span>
                      <span className="text-[10.5px] font-black font-mono text-slate-700">{course.duration}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Format</span>
                      <span className="text-[10.5px] font-black text-slate-700 truncate block">{course.format.split(' ')[0]}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Provider</span>
                      <span className="text-[10.5px] font-black text-[#2f66e0] truncate block">{course.source.split(' ')[0]}</span>
                    </div>
                  </div>

                  {/* Progress bar if enrolled */}
                  {course.enrolled && (
                    <div className="space-y-1 my-3">
                      <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-600">
                        <span>Course Progress</span>
                        <span className="font-mono text-[#2f66e0]">{course.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${course.progress}%` }} />
                      </div>
                    </div>
                  )}

                </div>

                {/* Enrollment actions */}
                <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-bold font-mono uppercase tracking-wide">
                    ID: {course.id}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {course.enrolled ? (
                      <>
                        <button
                          onClick={() => handleEnrollCourse(course.id)}
                          className="px-2.5 py-1.5 border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 text-[10px] font-black rounded-lg transition-colors cursor-pointer"
                          title="Withdraw Active Enrollment"
                        >
                          Withdraw
                        </button>

                        {course.progress < 100 ? (
                          <button
                            onClick={() => handleUpdateProgressQuizMode(course.id, Math.min(course.progress + 20, 100))}
                            className="px-3 py-1.5 bg-[#2f66e0] hover:bg-opacity-95 text-white text-[10px] font-black rounded-lg transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Play className="h-3 w-3 fill-white" />
                            <span>Study +20%</span>
                          </button>
                        ) : (
                          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-lg border border-emerald-100/50 flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            <span>Completed</span>
                          </span>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() => handleEnrollCourse(course.id)}
                        className="px-4 py-1.5 bg-slate-900 hover:bg-slate-840 text-white hover:bg-blue-600 hover:text-white text-[10.5px] font-extrabold rounded-lg transition-all cursor-pointer shadow-3xs"
                      >
                        Enroll as Student
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}


      {/* TAB 2: STRUCTURED LEARNING PATHS (Bundled Tracks) */}
      {activeSubTab === 'Structured Learning Paths' && (
        <div id="learning-paths-pane" className="space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h5 className="text-[13px] font-black text-slate-805 uppercase tracking-wide">Structured Curriculums & Cohorts</h5>
              <p className="text-xs text-slate-400 mt-0.5 font-semibold">Allows managers to bundle multiple courses & check milestones together to track organizational core benchmarks.</p>
            </div>

            <button
              onClick={() => setIsPathCreatorOpen(true)}
              className="bg-[#2f66e0] hover:bg-opacity-95 text-white font-extrabold text-xs px-4.5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer transition-all shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Create Custom Path</span>
            </button>
          </div>

          {/* PATH BUNDLER FLOATING CREATOR DIALOGUE */}
          {isPathCreatorOpen && (
            <div className="bg-white border border-[#2f66e0]/20 rounded-2xl p-6 shadow-sm space-y-4 max-w-2xl">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <Sliders className="h-5 w-5 text-[#2f66e0]" />
                  <span className="text-sm font-black text-slate-800 uppercase tracking-wide">HR Learning Path Builder Bundle</span>
                </div>
                <button
                  onClick={() => setIsPathCreatorOpen(false)}
                  className="text-slate-400 hover:text-slate-800 text-sm font-extrabold cursor-pointer"
                >
                  ✕ Close Creator
                </button>
              </div>

              <form onSubmit={handleCreatePathSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Path Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Senior Systems Engineering Track"
                      value={newPathName}
                      onChange={(e) => setNewPathName(e.target.value)}
                      className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl p-2.5 outline-none focus:bg-white focus:border-[#2f66e0]/30"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Scope description</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Specialized track focusing on DB isolation, high availability, and multi-region proxies."
                      value={newPathDesc}
                      onChange={(e) => setNewPathDesc(e.target.value)}
                      className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl p-2.5 outline-none focus:bg-white focus:border-[#2f66e0]/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Assigned Department</label>
                    <select
                      value={newPathDept}
                      onChange={(e) => setNewPathDept(e.target.value)}
                      className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl p-2.5 outline-none cursor-pointer"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Finance">Finance</option>
                      <option value="HR">HR</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Operations">Operations</option>
                      <option value="General">Entire Cohort</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Difficulty level</label>
                    <select
                      value={newPathDiff}
                      onChange={(e) => setNewPathDiff(e.target.value as any)}
                      className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl p-2.5 cursor-pointer"
                    >
                      <option value="Beginner">Beginner (101)</option>
                      <option value="Intermediate">Intermediate (201)</option>
                      <option value="Advanced">Advanced (301)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">Total estimated hours</label>
                    <input
                      type="number"
                      value={newPathHours}
                      onChange={(e) => setNewPathHours(Number(e.target.value))}
                      className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-xl p-2.5 outline-none"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full bg-[#2f66e0] hover:bg-opacity-95 text-white text-xs font-black py-2.5 rounded-xl cursor-pointer shadow-3xs"
                    >
                      Save Bundle
                    </button>
                  </div>
                </div>

                {/* Course checklist selector */}
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2">
                  <span className="text-[9.5px] font-black text-slate-500 uppercase tracking-wider block">Bundle Catalog Courses Into Track</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin">
                    {courses.map((course) => {
                      const isSelected = selectedPathCourses.includes(course.title);
                      return (
                        <button
                          type="button"
                          key={course.id}
                          onClick={() => toggleCourseInPathCreation(course.title)}
                          className={`w-full text-left p-2 border rounded-lg text-[10.5px] font-bold flex items-center justify-between transition-colors ${
                            isSelected 
                              ? 'bg-blue-50/55 border-[#2f66e0]/30 text-slate-800' 
                              : 'bg-white border-slate-100 hover:bg-slate-50/50 text-slate-600'
                          }`}
                        >
                          <span className="truncate">{course.title}</span>
                          <span className="shrink-0 ml-2 font-mono text-[9px] text-[#2f66e0]">
                            {isSelected ? '✓ Added' : '+ Add'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Paths display roster */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {learningPaths.map((path) => (
              <div key={path.id} className="bg-white border border-slate-100 rounded-2xl p-6.5 shadow-xs hover:border-slate-205 transition-all flex flex-col justify-between">
                <div>
                  
                  {/* Category top row */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold bg-[#2f66e0]/10 text-[#2f66e0] px-3 py-1 rounded-full uppercase tracking-wider">
                        {path.targetDept} Cohort
                      </span>
                      <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                        path.difficulty === 'Advanced' ? 'bg-rose-50 text-rose-700' :
                        path.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-700' :
                        'bg-emerald-50 text-emerald-700'
                      }`}>
                        {path.difficulty}
                      </span>
                    </div>

                    <span className="text-[10.5px] text-slate-400 font-bold font-mono">ID: {path.id}</span>
                  </div>

                  <h6 className="text-[14px] font-black text-slate-800 leading-tight">
                    {path.name}
                  </h6>
                  
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {path.description}
                  </p>

                  {/* Bundled courses lists */}
                  <div className="mt-5 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100/50">
                    <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">Bundled Syllabus ({path.courses.length} Milestones)</span>
                    {path.courses.map((courseTitle, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px] font-bold text-slate-700 border-b border-white pb-1.5 last:border-0 last:pb-0">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                          <span className="truncate">{courseTitle}</span>
                        </div>
                        <span className="text-[9.5px] text-slate-400 shrink-0 select-none">Course {idx + 1}</span>
                      </div>
                    ))}
                  </div>

                </div>

                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-bold">
                    Tracks logged: <strong className="text-slate-700 font-extrabold">{path.enrolledCount} team enrollments</strong>
                  </span>

                  <button
                    onClick={() => {
                      addToast(`Successfully batch-assigned learning track "${path.name}" to all active personnel in ${path.targetDept}.`, 'success');
                    }}
                    className="bg-[#2f66e0]/10 hover:bg-[#2f66e0]/20 text-[#2f66e0] font-extrabold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Force Batch Assign
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}


      {/* TAB 3: COMPLIANCE & CERTIFICATIONS */}
      {activeSubTab === 'Compliance & Certifications' && (
        <div id="learning-compliance-pane" className="space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h5 className="text-[13px] font-black text-slate-805 uppercase tracking-wide">Compliance Watch & Certification Audit System</h5>
              <p className="text-xs text-slate-400 mt-0.5 font-semibold">Track security standard expiration parameters and execute direct renewal overrides for employee compliance files.</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
              <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 border border-amber-205 px-3 py-1 rounded-full uppercase tracking-wider">
                Audits Auto-Check Active
              </span>
            </div>
          </div>

          {/* Expired and Warning Alerts Corner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {complianceRecords.filter(r => r.status !== 'Active').map((rec) => (
              <div key={rec.id} className={`p-5 rounded-2xl border flex flex-col justify-between ${
                rec.status === 'Expired' 
                  ? 'bg-rose-50/50 border-rose-200/50 text-rose-900' 
                  : 'bg-amber-50/55 border-amber-200/50 text-amber-900'
              }`}>
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[9.5px] font-black uppercase px-2.5 py-0.5 rounded-lg border ${
                      rec.status === 'Expired' 
                        ? 'bg-rose-100 text-rose-700 border-rose-205'
                        : 'bg-amber-100 text-amber-700 border-amber-205'
                    }`}>
                      🚨 {rec.status}
                    </span>

                    <span className="font-mono text-[9.5px] text-slate-400 font-extrabold">ID: {rec.id}</span>
                  </div>

                  <h6 className="text-[12.5px] font-black text-slate-800">
                    {rec.certName}
                  </h6>

                  <p className="text-[11.5px] text-slate-500 mt-1 font-semibold">
                    Assigned operator: <strong className="text-slate-700">{rec.employeeName}</strong> ({rec.department})
                  </p>

                  <div className="mt-4 p-3 rounded-xl bg-white border border-slate-100 text-[10.5px] font-bold text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Certification Expiry:</span>
                      <span className="font-mono text-slate-700">{rec.expiryDate}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-50 pt-1">
                      <span>Deadline Status:</span>
                      <span className={rec.status === 'Expired' ? 'text-rose-600 font-extrabold' : 'text-amber-600 font-extrabold'}>
                        {rec.status === 'Expired' ? 'Lapsed yesterday' : `Expires in ${rec.daysRemaining} days`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex gap-2 justify-end">
                  <button
                    onClick={() => handleSendRenewalReminder(rec.id, rec.employeeName, rec.certName)}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-black cursor-pointer hover:bg-slate-800"
                  >
                    Email Warning Alert
                  </button>
                  <button
                    onClick={() => handleCertRenewalProcess(rec.id)}
                    className="px-3 py-1.5 bg-[#2f66e0] hover:bg-opacity-95 text-white rounded-lg text-[10px] font-black shadow-3xs cursor-pointer"
                  >
                    Renew Overrides
                  </button>
                </div>
              </div>
            ))}

            {/* Compliance Quick Fact Board (to complete spacing grid layout) */}
            <div className="bg-slate-900 text-white px-5 py-6 rounded-2xl flex flex-col justify-between">
              <div>
                <ShieldAlert className="h-7 w-7 text-yellow-500 mb-2" />
                <h6 className="text-[12.5px] font-black uppercase tracking-wide">Official Audit Warning</h6>
                <p className="text-[11px] text-slate-300 leading-relaxed mt-1.5 font-medium">
                  ISO 27001 standard certifications require full compliance metrics by July 1st. Failure to complete phishing awareness or secure terminal logs will violate external customer security SLA agreements.
                </p>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-[10px] text-slate-300 font-semibold mt-3">
                ⚠️ GDPR fine caps apply up to €20M / 4% global turnover in severe operational failures.
              </div>
            </div>

          </div>

          {/* Comprehensive certificates tracking board list */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Organizational Certificate Security Log</span>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-black uppercase text-[9.5px] tracking-wider bg-slate-50/50">
                    <th className="py-2 px-3">Certificate Detail</th>
                    <th className="py-2 px-3">Employee Name</th>
                    <th className="py-2 px-3">Issue Date</th>
                    <th className="py-2 px-3">Expiry Date</th>
                    <th className="py-2 px-3">Tracking State</th>
                    <th className="py-2 px-3 text-right">Quick Auditing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {complianceRecords.map((cert) => (
                    <tr key={cert.id} className="hover:bg-slate-50/40">
                      <td className="py-3 px-3 font-extrabold text-slate-800">
                        {cert.certName}
                      </td>
                      <td className="py-3 px-3">
                        <div className="leading-tight">
                          <span className="font-extrabold text-slate-700 block">{cert.employeeName}</span>
                          <span className="text-[10px] text-slate-450 font-semibold">{cert.department}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500 font-bold">{cert.issuedDate}</td>
                      <td className="py-3 px-3 font-mono text-slate-500 font-bold">{cert.expiryDate}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[9.5px] font-black uppercase ${
                          cert.status === 'Active' ? 'bg-emerald-50 text-emerald-700' :
                          cert.status === 'Expired' ? 'bg-rose-50 text-rose-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>
                          {cert.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleSendRenewalReminder(cert.id, cert.employeeName, cert.certName)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] px-2 py-1 rounded transition-colors cursor-pointer"
                          >
                            Ping User
                          </button>
                          <button
                            onClick={() => handleCertRenewalProcess(cert.id)}
                            className="bg-[#2f66e0]/10 hover:bg-[#2f66e0]/20 text-[#2f66e0] font-black text-[10px] px-2 py-1 rounded transition-colors cursor-pointer"
                          >
                            Renew File
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}


      {/* TAB 4: ASSESSMENTS & INTERACTIVE QUIZ ENGINE */}
      {activeSubTab === 'Assessments & Quiz Engine' && (
        <div id="learning-quiz-pane" className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left selector sidebar */}
            <div className="lg:col-span-1 bg-white border border-slate-100 p-5 rounded-2xl shadow-xs space-y-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Available Knowledge Assessments</span>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Select from the randomized catalog list below to initiate real testing parameters before updating core completion certificates inside records.
              </p>

              <div className="space-y-3">
                {quizRepository.map((quiz) => {
                  const isCurated = activeQuizToTake?.id === quiz.id;
                  return (
                    <button
                      key={quiz.id}
                      onClick={() => handleInitializeQuizSession(quiz)}
                      className={`w-full text-left p-3.5 border rounded-2xl flex flex-col transition-all cursor-pointer ${
                        isCurated 
                          ? 'bg-blue-50/50 border-[#2f66e0]/45 shadow-3xs'
                          : 'bg-slate-50/50 border-slate-100/80 hover:bg-slate-50 hover:border-slate-205'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full mb-1">
                        <span className="text-[10px] font-mono text-[#2f66e0] font-black uppercase bg-[#2f66e0]/5 px-2 py-0.5 rounded">
                          {quiz.id}
                        </span>
                        <div className="flex items-center gap-1 text-[10.5px] text-slate-400 font-bold">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{quiz.timeLimit}</span>
                        </div>
                      </div>

                      <h6 className="text-[11.5px] font-extrabold text-slate-800 leading-tight">
                        {quiz.title}
                      </h6>

                      <span className="text-[10px] text-slate-450 mt-2 font-medium">
                        Contains {quiz.questions.length} randomized test items
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="bg-[#fffbeb] border border-amber-200/50 p-3 rounded-xl text-[10.5px] text-slate-700 space-y-1">
                <span className="font-extrabold text-amber-800 uppercase block">⚠️ Grading Rubrics</span>
                <p className="font-semibold text-slate-600 leading-relaxed">
                  Requires <strong className="text-slate-800">75%</strong> score or above to grant course certifications. Users are permitted multiple attempts.
                </p>
              </div>
            </div>

            {/* Correct quiz block rendering */}
            <div className="lg:col-span-2">
              {activeQuizToTake ? (
                <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-5">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[9px] font-black text-[#2f66e0] uppercase tracking-widest block">Active Testing Session Enforced</span>
                      <h5 className="text-[13px] font-black text-slate-800">{activeQuizToTake.title}</h5>
                    </div>

                    <button
                      onClick={() => {
                        setActiveQuizToTake(null);
                        setQuizScoreCard(null);
                      }}
                      className="text-xs font-black text-slate-405 hover:text-slate-800 uppercase tracking-wide bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                    >
                      Exit quiz
                    </button>
                  </div>

                  {/* Main scoring card overlay if submitted */}
                  {quizScoreCard ? (
                    <div className="p-6 rounded-2xl text-center space-y-4 border max-w-lg mx-auto bg-slate-50/50 border-slate-100">
                      <div className="inline-flex h-12 w-12 rounded-full items-center justify-center text-lg shadow-3xs font-black bg-white">
                        {quizScoreCard.passed ? '🎉' : '❌'}
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block">Standard Grading Metric Output</span>
                        
                        <h4 className="text-xl font-black text-slate-800">
                          Measured retention score: <strong className={quizScoreCard.passed ? 'text-emerald-600 font-black' : 'text-rose-600 font-black'}>{quizScoreCard.score}%</strong>
                        </h4>

                        <span className={`inline-block px-3 py-1.5 text-xs font-bold rounded-full ${
                          quizScoreCard.passed 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' 
                            : 'bg-rose-50 text-rose-700 border border-rose-150'
                        }`}>
                          {quizScoreCard.passed ? 'PASS - Certification Verified' : 'RETRY SUGGESTED - Below 75% benchmarks'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                        {quizScoreCard.passed 
                          ? 'This certification token has been logged to your HR profile directory and securely written into the organization competence matrices.' 
                          : 'Please re-read the core instructional materials and syllabus before launching another grading request attempt.'}
                      </p>

                      <div className="flex gap-2.5 justify-center pt-2">
                        <button
                          onClick={() => {
                            setUserQuizAnswers({});
                            setQuizScoreCard(null);
                          }}
                          className="px-4.5 py-2 border border-slate-100 rounded-xl text-xs font-extrabold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <RotateCcw className="h-4.5 w-4.5" />
                          <span>Retry Exam</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveQuizToTake(null);
                            setQuizScoreCard(null);
                          }}
                          className="px-4.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-slate-800 cursor-pointer"
                        >
                          Return to Catalog
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      
                      {activeQuizToTake.questions.map((q, index) => {
                        const selectedOptionIdx = userQuizAnswers[q.id];
                        return (
                          <div key={q.id} className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl space-y-3">
                            <span className="text-[10px] font-mono text-[#2f66e0] font-black uppercase tracking-wider block">
                              Question Item {index + 1} of {activeQuizToTake.questions.length}
                            </span>

                            <h6 className="text-[11.5px] font-extrabold text-slate-800 leading-tight">
                              {q.questionText}
                            </h6>

                            <div className="grid grid-cols-1 gap-2">
                              {q.options.map((option, idx) => {
                                const isChecked = selectedOptionIdx === idx;
                                return (
                                  <button
                                    type="button"
                                    key={idx}
                                    onClick={() => handleSelectQuizAnswer(q.id, idx)}
                                    className={`p-3 text-left border rounded-xl text-[10.5px] font-bold flex items-center justify-between transition-all cursor-pointer ${
                                      isChecked 
                                        ? 'bg-blue-50/50 border-[#2f66e0]/40 text-[#2f66e0]' 
                                        : 'bg-white border-slate-100 hover:bg-slate-50/60 text-slate-600'
                                    }`}
                                  >
                                    <span>{option}</span>
                                    <div className="h-4 w-4 rounded-full border border-slate-300 flex items-center justify-center shrink-0">
                                      {isChecked && <div className="h-2 w-2 rounded-full bg-[#2f66e0]" />}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}

                      <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-medium text-slate-400">
                        <span>All inputs are logged under active anti-tamper constraints</span>

                        <button
                          type="button"
                          onClick={handleSubmitQuizAnswers}
                          className="bg-[#2f66e0] hover:bg-opacity-95 text-white font-extrabold px-6 py-2 rounded-xl transition-all shadow-3xs cursor-pointer flex items-center gap-1.5"
                        >
                          <span>Request Test Grade</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              ) : (
                <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center space-y-4 shadow-3xs">
                  <Play className="h-10 w-10 text-[#2f66e0] mx-auto bg-blue-50 p-2.5 rounded-full" />
                  
                  <div className="space-y-1">
                    <h5 className="text-[13px] font-black text-slate-800 uppercase tracking-widest">Select Exam to Boot Engine</h5>
                    <p className="text-xs text-slate-400 leading-relaxed font-semibold max-w-sm mx-auto">
                      Please pick a curated assessment program from the Left Panel to initialize student knowledge retention tests.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      )}


      {/* TAB 5: LEARNING ANALYTICS & PROGRESS */}
      {activeSubTab === 'Learning Analytics' && (
        <div id="learning-analytics-pane" className="space-y-6">
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Completion rate bar charts list */}
            <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl p-6.5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4 border-b border-slate-50 pb-3">
                  <div>
                    <h5 className="text-[12.5px] font-black text-slate-800 uppercase tracking-wide">Cohort Curriculum Completion Rates</h5>
                    <p className="text-[10.5px] text-slate-400 font-semibold mt-0.5">Aggregated metrics detailing the ratio of staff completing active training milestones</p>
                  </div>

                  <span className="text-[10px] font-black text-[#2f66e0] bg-[#2f66e0]/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Target: 80% Min
                  </span>
                </div>

                {/* Custom styling elegant bars representing department metrics */}
                <div className="space-y-4">
                  {(Object.entries(aggregateMetrics.deptStats) as [string, { completed: number; enroute: number }][]).map(([dept, data]) => {
                    const totalTracked = data.completed + data.enroute;
                    const completionRate = Math.round((data.completed / totalTracked) * 100);
                    return (
                      <div key={dept} className="space-y-1">
                        <div className="flex justify-between items-center text-[11px] font-extrabold text-slate-700">
                          <span>{dept} Division Team</span>
                          <span>{completionRate}% Complete ({data.completed}/{totalTracked} certified)</span>
                        </div>

                        <div className="w-full bg-slate-50 border border-slate-100 rounded-full h-3 overflow-hidden flex">
                          <div className="bg-[#2f66e0] h-full rounded-l-full transition-all" style={{ width: `${completionRate}%` }} />
                          <div className="bg-[#2f66e0]/30 h-full transition-all" style={{ width: `${100 - completionRate}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Integrated from continuous HRMS performance syncs</span>
                <span className="font-extrabold text-slate-700">Sync cycle: 2026-Q2 Audit</span>
              </div>
            </div>

            {/* Micro Telemetry Metrics */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6.5 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Training Efficiency KPI Metrics</span>
                
                <div className="space-y-4">
                  
                  {/* Item 1 */}
                  <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10.5px] text-slate-400 font-extrabold uppercase tracking-wide block">Cumulative Learning Hours</span>
                      <h4 className="text-lg font-black text-slate-800 mt-1">1,482 Hours</h4>
                    </div>
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      +14% MoM
                    </span>
                  </div>

                  {/* Item 2 */}
                  <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10.5px] text-slate-400 font-extrabold uppercase tracking-wide block">Avg Test Score Standard Deviation</span>
                      <h4 className="text-lg font-black text-slate-800 mt-1">84.5% Grade</h4>
                    </div>
                    <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                      Pass Limit Rank
                    </span>
                  </div>

                  {/* Item 3 */}
                  <div className="bg-slate-50/50 p-3.5 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10.5px] text-slate-400 font-extrabold uppercase tracking-wide block">Active Certification Certificates</span>
                      <h4 className="text-lg font-black text-slate-800 mt-1">112 Issued Tokens</h4>
                    </div>
                    <span className="text-xs font-black text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">
                      94% Active
                    </span>
                  </div>

                </div>
              </div>

              <div className="bg-blue-50/25 border border-blue-100/50 p-3.5 rounded-xl text-[10.5px] text-[#2f66e0] leading-snug font-medium mt-4">
                💡 <strong className="text-slate-800 font-black">Coaching Insight:</strong> High density completion detected in HR and Accounting. Engineering exhibits completion lag due to tight sprints. Buffer allocations recommended.
              </div>
            </div>

          </div>

          {/* Roster representing individuals with highest course logs */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Personnel Continuous Learning Champions (Q2 Leaders)</span>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {employees.slice(0, 4).map((emp, index) => {
                // Mock points
                const courseCount = [5, 4, 3, 3][index];
                const hourCount = [28, 22, 18, 14][index];
                const activeBadge = ['Gold Edu-Star', 'Silver Medalist', 'Bronze Ribbon', 'Bronze Ribbon'][index];
                return (
                  <div key={emp.id} className="p-4 rounded-xl border border-slate-100 flex items-center gap-3 hover:border-slate-205 transition-colors">
                    <div className="h-10 w-10 bg-gradient-to-tr from-blue-700 to-indigo-500 text-white flex items-center justify-center font-extrabold text-sm rounded-xl">
                      #{index + 1}
                    </div>

                    <div>
                      <h6 className="text-[11.5px] font-black text-slate-800 leading-tight">{emp.name}</h6>
                      <span className="text-[9.5px] text-slate-400 font-bold block">{emp.position}</span>
                      
                      <div className="flex items-center gap-2 mt-1.5 font-mono text-[9.5px] text-slate-500">
                        <span>{courseCount} classes</span>
                        <span className="text-slate-300">&bull;</span>
                        <span>{hourCount} hrs</span>
                      </div>

                      <span className="text-[9px] font-black uppercase text-[#2f66e0] tracking-wide block mt-1">
                        🏆 {activeBadge}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

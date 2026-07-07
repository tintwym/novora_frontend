import { useState, useEffect, useRef, type FormEvent } from 'react';
import { 
  Users, CreditCard, Calendar, TrendingUp, 
  Plus, Fingerprint, Search, Check, X, Sparkles, Scan, ArrowUpRight, Hand
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Employee, LeaveRequest, AttendanceLog } from '../../types/landing';

export default function InteractiveDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'attendance' | 'payroll' | 'leaves'>('overview');
  
  // Local State representing the live CRM/HRMS database
  const [employees, setEmployees] = useState<Employee[]>([
    { id: '1', name: 'Sarah Jenkins', role: 'Lead Frontend Architect', department: 'Engineering', status: 'Active', attendanceRate: 98.4, avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80' },
    { id: '2', name: 'Marcus Chen', role: 'Senior Product Designer', department: 'Product', status: 'Active', attendanceRate: 97.2, avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80' },
    { id: '3', name: 'Elena Rostova', role: 'HR Operations Manager', department: 'People & Culture', status: 'Active', attendanceRate: 100, avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80' },
    { id: '4', name: 'David Kim', role: 'Security Engineer', department: 'Engineering', status: 'On Leave', attendanceRate: 92.1, avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80' },
    { id: '5', name: 'Sophia Martinez', role: 'Senior Talent Acquisition', department: 'HR & Recruiting', status: 'Remote', attendanceRate: 99.1, avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80' },
  ]);

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    { id: 'L1', employeeName: 'Sarah Jenkins', type: 'Maternity Leave', dates: 'Aug 10 - Nov 10', days: 90, status: 'Pending' },
    { id: 'L2', employeeName: 'David Kim', type: 'Medical Checkup', dates: 'Jul 12 - Jul 13', days: 2, status: 'Pending' },
    { id: 'L3', employeeName: 'Marcus Chen', type: 'Annual Paid Leave', dates: 'Jul 20 - Jul 25', days: 5, status: 'Pending' },
  ]);

  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([
    { id: 'A1', time: '08:58 AM', employeeName: 'Sarah Jenkins', method: 'Facial Recognition', status: 'Success' },
    { id: 'A2', time: '08:59 AM', employeeName: 'Marcus Chen', method: 'Fingerprint', status: 'Success' },
    { id: 'A3', time: '09:02 AM', employeeName: 'Sophia Martinez', method: 'Mobile GPS', status: 'Success' },
    { id: 'A4', time: '09:15 AM', employeeName: 'Elena Rostova', method: 'Web Clock-in', status: 'Late' },
  ]);

  const [payrollStatus, setPayrollStatus] = useState<'Pending' | 'Processing' | 'Completed'>('Pending');
  const [payrollProgress, setPayrollProgress] = useState(0);
  const [recentNotification, setRecentNotification] = useState<string | null>(null);
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('');
  const [newEmpDept, setNewEmpDept] = useState('Engineering');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const notificationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
      if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    };
  }, []);

  // Trigger brief alert/notifications
  const triggerNotification = (message: string) => {
    if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
    setRecentNotification(message);
    notificationTimerRef.current = setTimeout(() => {
      setRecentNotification(null);
      notificationTimerRef.current = null;
    }, 4000);
  };

  // Add new employee
  const handleAddEmployee = (e: FormEvent) => {
    e.preventDefault();
    if (!newEmpName || !newEmpRole) return;

    const newEmp: Employee = {
      id: `${Date.now()}`,
      name: newEmpName,
      role: newEmpRole,
      department: newEmpDept,
      status: 'Active',
      attendanceRate: 100,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(newEmpName)}&background=0a58a4&color=fff&size=120`,
    };

    setEmployees([newEmp, ...employees]);
    setNewEmpName('');
    setNewEmpRole('');
    setShowAddForm(false);
    triggerNotification(`Added employee "${newEmp.name}" to the Directory.`);
  };

  // Approve leave
  const handleLeaveAction = (id: string, action: 'Approved' | 'Rejected') => {
    setLeaveRequests((prev) => {
      const req = prev.find((l) => l.id === id);
      if (req) {
        triggerNotification(`${action} leave request for ${req.employeeName}.`);
      }
      return prev.map((l) => (l.id === id ? { ...l, status: action } : l));
    });
  };

  // Run payroll simulation
  const handleRunPayroll = () => {
    if (payrollStatus === 'Processing') return;
    setPayrollStatus('Processing');
    setPayrollProgress(0);
  };

  useEffect(() => {
    if (payrollStatus === 'Processing') {
      const interval = setInterval(() => {
        setPayrollProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setPayrollStatus('Completed');
            triggerNotification('Payroll run executed! $48,240 transferred to 142 employees.');
            return 100;
          }
          return prev + 10;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [payrollStatus]);

  // Simulate Biometric Check-in
  const handleSimulateScan = () => {
    if (isScanning) return;
    if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
    setIsScanning(true);
    
    // Pick a random employee
    const candidatePool = ['Sarah Jenkins', 'Elena Rostova', 'Marcus Chen', 'Sophia Martinez', 'David Kim', 'Jane Cooper', 'Robert Fox'];
    const randomName = candidatePool[Math.floor(Math.random() * candidatePool.length)];
    const methods: AttendanceLog['method'][] = ['Fingerprint', 'Facial Recognition', 'Mobile GPS', 'Web Clock-in'];
    const randomMethod = methods[Math.floor(Math.random() * methods.length)];
    
    scanTimerRef.current = setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newLog: AttendanceLog = {
        id: `A${Date.now()}`,
        time: timeStr,
        employeeName: randomName,
        method: randomMethod,
        status: Math.random() > 0.15 ? 'Success' : 'Late',
      };

      setAttendanceLogs((prev) => [newLog, ...prev]);
      setIsScanning(false);
      scanTimerRef.current = null;
      triggerNotification(`Biometric Sync: ${randomName} verified via ${randomMethod} at ${timeStr}.`);
    }, 1500);
  };

  // Filtered employees list
  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
    emp.role.toLowerCase().includes(employeeSearch.toLowerCase()) ||
    emp.department.toLowerCase().includes(employeeSearch.toLowerCase())
  );

  return (
    <div id="interactive-dashboard" className="w-full bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden font-sans text-slate-100 flex flex-col md:h-[580px]">
      
      {/* Dashboard Top Header Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 flex items-center justify-center shrink-0">
            <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="dashLogoCyanTeal" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00a7e1" />
                  <stop offset="60%" stopColor="#00b2a9" />
                  <stop offset="100%" stopColor="#7cb342" />
                </linearGradient>
                <linearGradient id="dashLogoOrangeYellow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff9800" />
                  <stop offset="100%" stopColor="#f57c00" />
                </linearGradient>
                <linearGradient id="dashLogoBlue" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0a58a4" />
                  <stop offset="100%" stopColor="#00a7e1" />
                </linearGradient>
              </defs>
              <circle cx="42" cy="23" r="8" fill="#e2e8f0" />
              <path d="M 42 35 C 33 39, 36 50, 48 53 C 48 53, 49 43, 42 35 Z" fill="#cbd5e1" />
              <circle cx="24" cy="28" r="8" fill="#00a7e1" />
              <path d="M 12 70 C 14 55, 18 40, 28 38 C 38 36, 42 50, 48 58 C 55 67, 60 70, 68 62 C 60 74, 45 74, 38 66 C 30 57, 24 45, 18 56 C 14 62, 13 67, 12 70 Z" fill="url(#dashLogoCyanTeal)" />
              <circle cx="68" cy="27" r="8" fill="url(#dashLogoOrangeYellow)" />
              <path d="M 68 35 C 58 45, 52 58, 52 68 C 52 75, 58 78, 64 70 C 70 60, 78 45, 88 25 C 80 23, 72 28, 68 35 Z" fill="url(#dashLogoOrangeYellow)" />
              <path d="M 52 68 C 52 75, 58 84, 68 84 C 78 84, 82 72, 88 50 C 85 64, 78 74, 68 74 C 62 74, 56 71, 52 68 Z" fill="url(#dashLogoBlue)" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-slate-50">Novora Suite</span>
              <span className="bg-cyan-500/10 text-cyan-400 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-cyan-500/20 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> LIVE PREVIEW
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Enterprise HR Operational Command</p>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'employees', label: 'Employees', icon: Users, badge: employees.length },
            { id: 'attendance', label: 'Attendance', icon: Fingerprint },
            { id: 'payroll', label: 'Payroll', icon: CreditCard },
            { id: 'leaves', label: 'Leaves', icon: Calendar, badge: leaveRequests.filter(r => r.status === 'Pending').length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`relative px-2.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`text-[9px] font-semibold px-1 py-0.5 rounded-full ${
                    isActive ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto p-4 md:p-5 relative bg-slate-950/40">
        
        {/* Float Toast Notification */}
        <AnimatePresence>
          {recentNotification && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-cyan-500/30 text-cyan-300 text-xs px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 max-w-[90%] backdrop-blur-sm"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>{recentNotification}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Highlight Banner */}
              <div className="bg-gradient-to-r from-blue-950/50 via-slate-900 to-slate-900 border border-blue-500/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
                    Welcome to your automated HR cockpit <Hand className="w-4 h-4 text-cyan-400 animate-wave inline-block" />
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">Configure compliance rules, manage employee payroll, and sync biometric terminals seamlessly.</p>
                </div>
                <button 
                  onClick={() => setActiveTab('leaves')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1 self-start sm:self-auto transition-colors cursor-pointer"
                >
                  Action Tasks <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Grid Widgets */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 mb-1.5">
                    <span className="text-xs">Total Headcount</span>
                    <Users className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold">142</span>
                    <span className="text-[10px] text-blue-400 font-semibold">+8 this mo.</span>
                  </div>
                </div>

                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 mb-1.5">
                    <span className="text-xs">Attendance Rate</span>
                    <Fingerprint className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold">96.8%</span>
                    <span className="text-[10px] text-blue-400 font-semibold">+1.2% benchmark</span>
                  </div>
                </div>

                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 mb-1.5">
                    <span className="text-xs">Pending Leaves</span>
                    <Calendar className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold text-amber-400">
                      {leaveRequests.filter(r => r.status === 'Pending').length}
                    </span>
                    <span className="text-[10px] text-slate-400">Needs review</span>
                  </div>
                </div>

                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 mb-1.5">
                    <span className="text-xs">Payroll Cycle</span>
                    <CreditCard className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className={`text-xl font-bold ${payrollStatus === 'Completed' ? 'text-blue-400' : 'text-amber-400'}`}>
                      {payrollStatus === 'Completed' ? 'Cleared' : 'Pending'}
                    </span>
                    <span className="text-[10px] text-slate-400">July Cycle</span>
                  </div>
                </div>
              </div>

              {/* Bottom Row splits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recent Attendance Scans */}
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        <Fingerprint className="w-3.5 h-3.5 text-blue-400" /> Real-time Biometric Terminal
                      </h5>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">Sync Active</span>
                    </div>
                    <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                      {attendanceLogs.slice(0, 3).map((log) => (
                        <div key={log.id} className="flex items-center justify-between bg-slate-900/80 p-2 rounded-lg border border-slate-800 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            <div>
                              <p className="font-semibold text-slate-200">{log.employeeName}</p>
                              <p className="text-[10px] text-slate-400">{log.method}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-slate-300 font-medium">{log.time}</p>
                            <span className={`text-[9px] px-1 rounded ${
                              log.status === 'Success' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                              {log.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <p className="text-[10px] text-slate-400">Push the scan button to test hardware simulator.</p>
                    <button
                      onClick={handleSimulateScan}
                      disabled={isScanning}
                      className="bg-blue-600 hover:bg-blue-750 disabled:bg-slate-800 text-white text-[10px] font-bold px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1"
                    >
                      {isScanning ? (
                        <>
                          <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Scanning...
                        </>
                      ) : (
                        'Simulate Clock-In'
                      )}
                    </button>
                  </div>
                </div>

                {/* Automation Actions */}
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <h5 className="text-xs font-semibold text-slate-200 mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Rapid Process Automations
                    </h5>
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2.5 text-xs">
                        <div className="bg-slate-800 p-1.5 rounded-lg border border-slate-700 text-slate-300 shrink-0">
                          <CreditCard className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-200">Disburse Bi-Weekly Salaries</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Calculates biometric logs and taxes. Instantly pays out to connected banks.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 text-xs">
                        <div className="bg-slate-800 p-1.5 rounded-lg border border-slate-700 text-slate-300 shrink-0">
                          <Users className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-200">Onboard Mock Hire</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Auto-allocates email, registers fingerprint profiles, and triggers leave pools.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3 pt-2 border-t border-slate-800/60">
                    <button 
                      onClick={() => setActiveTab('payroll')} 
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold py-1.5 px-2.5 rounded transition-colors cursor-pointer text-center"
                    >
                      Go to Payroll
                    </button>
                    <button 
                      onClick={() => { setActiveTab('employees'); setShowAddForm(true); }} 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold py-1.5 px-2.5 rounded transition-colors cursor-pointer text-center"
                    >
                      Onboard Employee
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: EMPLOYEES */}
          {activeTab === 'employees' && (
            <motion.div
              key="employees"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search name, role, or department..."
                    value={employeeSearch}
                    onChange={(e) => setEmployeeSearch(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer self-start transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Employee
                </button>
              </div>

              {/* Add Employee Form */}
              {showAddForm && (
                <motion.form
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  onSubmit={handleAddEmployee}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-semibold mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={newEmpName}
                        onChange={(e) => setNewEmpName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-semibold mb-1">Job Title</label>
                      <input
                        type="text"
                        required
                        placeholder="HR Specialist"
                        value={newEmpRole}
                        onChange={(e) => setNewEmpRole(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-semibold mb-1">Department</label>
                      <select
                        value={newEmpDept}
                        onChange={(e) => setNewEmpDept(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                      >
                        <option value="Engineering">Engineering</option>
                        <option value="Product">Product</option>
                        <option value="HR & recruiting">HR & Recruiting</option>
                        <option value="Finance">Finance</option>
                        <option value="Operations">Operations</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-3 py-1.5 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-1.5 rounded"
                    >
                      Save Profile
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Employees List */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 font-semibold text-[10px] uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3">Employee</th>
                      <th className="p-3 hidden sm:table-cell">Department</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 hidden sm:table-cell text-right">Biometric Index</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredEmployees.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-slate-500">No matching employees found.</td>
                      </tr>
                    ) : (
                      filteredEmployees.map((emp) => (
                        <tr key={emp.id} className="hover:bg-slate-900/30 transition-colors">
                          <td className="p-3 flex items-center gap-2.5">
                            <img src={emp.avatarUrl} alt={emp.name} className="w-7 h-7 rounded-full object-cover border border-slate-700" />
                            <div>
                              <p className="font-semibold text-slate-200">{emp.name}</p>
                              <p className="text-[10px] text-slate-400">{emp.role}</p>
                            </div>
                          </td>
                          <td className="p-3 hidden sm:table-cell text-slate-400">{emp.department}</td>
                          <td className="p-3">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              emp.status === 'Active' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                              emp.status === 'On Leave' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                              'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                            }`}>
                              {emp.status}
                            </span>
                          </td>
                          <td className="p-3 hidden sm:table-cell text-right text-slate-400 font-mono text-[10px]">
                            {emp.attendanceRate}% Logged
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                const actionType = emp.status === 'Active' ? 'On Leave' : 'Active';
                                setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, status: actionType } : e));
                                triggerNotification(`Status updated for ${emp.name} to "${actionType}".`);
                              }}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-2 py-1 rounded text-[10px] transition-colors cursor-pointer"
                            >
                              Toggle Status
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* TAB 3: ATTENDANCE & BIOMETRIC */}
          {activeTab === 'attendance' && (
            <motion.div
              key="attendance"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="bg-gradient-to-r from-slate-900 to-slate-900/40 p-4 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg shrink-0">
                    <Scan className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                      Integrated Terminal Server (Terminal #04)
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">Ready to receive ZKTeco, Suprema, and mobile geofencing logs instantly. End-to-end payload encryption enabled.</p>
                  </div>
                </div>

                <button
                  onClick={handleSimulateScan}
                  disabled={isScanning}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  {isScanning ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Biometric Capture...
                    </>
                  ) : (
                    <>
                      <Fingerprint className="w-4 h-4" /> Simulate Biometric Scan
                    </>
                  )}
                </button>
              </div>

              {/* Attendance Log Table */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-3 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-300">Live Hardware Authentication Stream</span>
                  <span className="text-[10px] text-blue-400 font-mono flex items-center gap-1 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> ONLINE & LISTENING
                  </span>
                </div>
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/60 text-slate-400 font-semibold text-[10px] uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3">Time</th>
                      <th className="p-3">Employee</th>
                      <th className="p-3">Authentication Method</th>
                      <th className="p-3 text-right">Verification Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {attendanceLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-900/30 transition-colors">
                        <td className="p-3 font-mono text-slate-400 text-[11px]">{log.time}</td>
                        <td className="p-3 font-semibold text-slate-200">{log.employeeName}</td>
                        <td className="p-3 text-slate-400 flex items-center gap-1.5">
                          <span className="p-1 bg-slate-800 rounded text-slate-300"><Fingerprint className="w-3 h-3" /></span>
                          {log.method}
                        </td>
                        <td className="p-3 text-right">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                            log.status === 'Success' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            ✓ {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* TAB 4: PAYROLL */}
          {activeTab === 'payroll' && (
            <motion.div
              key="payroll"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-400" /> July 2026 Payroll Run Summary
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">Processes base salaries, biometric deductions, custom bonuses, and tax withholdings.</p>
                  </div>
                  
                  {payrollStatus === 'Pending' && (
                    <button
                      type="button"
                      onClick={handleRunPayroll}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      Process & Disburse Payroll
                    </button>
                  )}
                  {payrollStatus === 'Processing' && (
                    <div className="bg-slate-800 text-slate-400 text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                      Calculating Taxes ({payrollProgress}%)
                    </div>
                  )}
                  {payrollStatus === 'Completed' && (
                    <button
                      type="button"
                      onClick={handleRunPayroll}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Run Again
                    </button>
                  )}
                </div>

                {/* Progress bar */}
                {payrollStatus === 'Processing' && (
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <motion.div
                      className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full"
                      style={{ width: `${payrollProgress}%` }}
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-lg">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Total Gross Payroll</p>
                    <p className="text-lg font-bold text-slate-200 mt-1">$48,240.00</p>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-lg">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Calculated Deductions</p>
                    <p className="text-lg font-bold text-slate-200 mt-1">$3,150.22</p>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-lg">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Net Disbursed</p>
                    <p className="text-lg font-bold text-blue-400 mt-1">$45,089.78</p>
                  </div>
                </div>
              </div>

              {/* Payroll list mock */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 font-semibold text-[10px] uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3">Employee</th>
                      <th className="p-3">Base Salary</th>
                      <th className="p-3">Biometric Adjustment</th>
                      <th className="p-3 text-right">Disbursal Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="p-3 font-semibold text-slate-200">Sarah Jenkins</td>
                      <td className="p-3 text-slate-400">$8,500.00</td>
                      <td className="p-3 text-slate-400">$0.00 (Perfect Attendance)</td>
                      <td className="p-3 text-right font-semibold text-slate-200">$8,500.00</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-200">Marcus Chen</td>
                      <td className="p-3 text-slate-400">$7,200.00</td>
                      <td className="p-3 text-slate-400">-$25.00 (1 Late Punch)</td>
                      <td className="p-3 text-right font-semibold text-slate-200">$7,175.00</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-200">Elena Rostova</td>
                      <td className="p-3 text-slate-400">$6,800.00</td>
                      <td className="p-3 text-slate-400">$0.00</td>
                      <td className="p-3 text-right font-semibold text-slate-200">$6,800.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* TAB 5: LEAVE MANAGER */}
          {activeTab === 'leaves' && (
            <motion.div
              key="leaves"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Leave Policy Automations</h4>
                  <p className="text-xs text-slate-400 mt-1">Pending approval requests triggers auto-substitutions for shifts and synchronizes with Slack status.</p>
                </div>
                <span className="text-[10px] bg-slate-950 text-blue-400 border border-slate-800 px-2.5 py-1 rounded">
                  {leaveRequests.filter(r => r.status === 'Pending').length} Pending Requests
                </span>
              </div>

              {/* Leave List */}
              <div className="space-y-2.5">
                {leaveRequests.map((req) => (
                  <motion.div
                    key={req.id}
                    layout
                    className={`bg-slate-900 border ${
                      req.status === 'Approved' ? 'border-blue-500/20 bg-blue-950/5' :
                      req.status === 'Rejected' ? 'border-red-500/20 bg-red-950/5' : 'border-slate-800'
                    } rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700 text-slate-300 shrink-0">
                        <Calendar className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-200 text-sm">{req.employeeName}</span>
                          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">{req.type}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{req.dates} ({req.days} Days requested)</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {req.status === 'Pending' ? (
                        <>
                          <button
                            onClick={() => handleLeaveAction(req.id, 'Rejected')}
                            className="bg-slate-800 hover:bg-slate-700 text-red-400 font-semibold px-3 py-1.5 rounded text-xs transition-colors cursor-pointer flex items-center gap-1 border border-slate-700"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                          <button
                            onClick={() => handleLeaveAction(req.id, 'Approved')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-1.5 rounded text-xs transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                        </>
                      ) : (
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          req.status === 'Approved' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {req.status === 'Approved' ? 'Approved' : 'Rejected'}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
      
      {/* Dashboard Status Footer bar */}
      <div className="bg-slate-900 border-t border-slate-800/80 px-4 py-2.5 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Database Live Sync</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">Secure Node ID: #849707</span>
        </div>
        <span className="font-mono text-slate-400">July 2026 Shift Schedule v1.8.2</span>
      </div>

    </div>
  );
}

import { useState, useEffect } from 'react'
import {
  Users,
  UserPlus,
  Umbrella,
  CheckCircle,
  Briefcase,
  Coins,
  ArrowRightLeft,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Lock,
  LogIn,
  LogOut,
} from 'lucide-react'
import { showActionToast } from '../../utils/actionToast'
import type { ModuleEmployee } from '../../types/moduleEmployee'

type DashboardTabProps = {
  employees: ModuleEmployee[]
  onNavigate: (path: string) => void
}

export function DashboardTab({ employees: _employees, onNavigate }: DashboardTabProps) {
  const addToast = (text: string, type?: 'success' | 'loading' | 'error' | 'info') => {
    showActionToast(text, type)
  }

  // Live dynamic clock and date state
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Time tracking Punch-In Punch-Out states
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState('--:--');
  const [punchOutTime, setPunchOutTime] = useState('--:--');
  const [sessionSeconds, setSessionSeconds] = useState(0);

  useEffect(() => {
    let timerId: any;
    if (isPunchedIn) {
      timerId = setInterval(() => {
        setSessionSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [isPunchedIn]);

  const handlePunchIn = () => {
    if (isPunchedIn) return;
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    
    setIsPunchedIn(true);
    setPunchInTime(timeStr);
    setPunchOutTime('--:--');
    setSessionSeconds(0);
    addToast('Punched In successfully! Duty tracking active.', 'success');
  };

  const handlePunchOut = () => {
    if (!isPunchedIn) return;
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    
    setIsPunchedIn(false);
    setPunchOutTime(timeStr);
    
    const h = Math.floor(sessionSeconds / 3600);
    const m = Math.floor((sessionSeconds % 3600) / 60);
    const s = sessionSeconds % 60;
    addToast(`Punched Out successfully! Session duration: ${h}h ${m}m ${s}s`, 'success');
  };

  const formatSessionTime = (seconds: number) => {
    if (seconds === 0 && !isPunchedIn) return '0h 0m';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  // Format digital clock
  const getDigitalTimeString = (d: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  const getCalendarDateString = (d: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  // Timeline variables filter
  const [timelineFilter, setTimelineFilter] = useState<'Last 12 months' | 'Last 6 months' | 'Last 3 months' | 'Last 30 days'>('Last 12 months');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; value: number; label: string } | null>(null);

  const getTimelineData = () => {
    switch (timelineFilter) {
      case 'Last 6 months':
        return {
          values: [980, 1045, 1110, 1185, 1240, 1284],
          labels: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
          minY: 800,
          maxY: 1400,
          yLabels: ['1400', '1200', '1000', '800']
        };
      case 'Last 3 months':
        return {
          values: [1190, 1245, 1284],
          labels: ['Mar', 'Apr', 'May'],
          minY: 1100,
          maxY: 1350,
          yLabels: ['1350', '1250', '1150']
        };
      case 'Last 30 days':
        return {
          values: [1260, 1268, 1275, 1284],
          labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
          minY: 1240,
          maxY: 1300,
          yLabels: ['1300', '1280', '1260', '1240']
        };
      default: // Last 12 months
        return {
          values: [611, 700, 780, 830, 890, 950, 980, 1030, 1090, 1145, 1200, 1284],
          labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
          minY: 611,
          maxY: 1316,
          yLabels: ['1316', '1200', '1000', '800', '611']
        };
    }
  };

  const trendData = getTimelineData();
  const chartWidth = 550;
  const chartHeight = 155;
  const paddingLeft = 45;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 25;

  const actualWidth = chartWidth - paddingLeft - paddingRight;
  const actualHeight = chartHeight - paddingTop - paddingBottom;

  // Map elements to SVG coordinates
  const points = trendData.values.map((v, idx) => {
    const x = paddingLeft + (actualWidth / (trendData.values.length - 1)) * idx;
    const fraction = (v - trendData.minY) / (trendData.maxY - trendData.minY);
    const y = paddingTop + actualHeight * (1 - fraction);
    return { x, y, value: v, label: trendData.labels[idx] };
  });

  // Calculate high-quality cubic Bézier smooth control path for exact matched visual
  const getCurvePath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) / 3;
      const cp1y = p0.y + (p1.y - p0.y) / 15; // gentle upward drift
      const cp2x = p0.x + 2 * (p1.x - p0.x) / 3;
      const cp2y = p1.y - (p1.y - p0.y) / 15;
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y}`;
    }
    return d;
  };

  const linePath = getCurvePath(points);
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x},${paddingTop + actualHeight} L ${points[0].x},${paddingTop + actualHeight} Z`
    : '';

  // Financial audit compilation states
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditStep, setAuditStep] = useState(0);
  const [auditProgress, setAuditProgress] = useState(0);
  const [auditComplete, setAuditComplete] = useState(false);

  const startFinancialAudit = () => {
    setShowAuditModal(true);
    setAuditStep(0);
    setAuditProgress(0);
    setAuditComplete(false);
  };

  useEffect(() => {
    if (!showAuditModal || auditComplete) return;

    const interval = setInterval(() => {
      setAuditProgress(prev => {
        if (prev >= 100) {
          if (auditStep < 2) {
            setAuditStep(s => s + 1);
            return 0;
          } else {
            setAuditComplete(true);
            addToast('Financial payroll ledger audit certified successfully!', 'success');
            clearInterval(interval);
            return 100;
          }
        }
        return prev + 6;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [showAuditModal, auditStep, auditComplete]);

  // Unified configuration structure for key indicators mapping the exact screenshot specs
  const keyIndicators = [
    {
      id: 'total-employees',
      title: 'TOTAL EMPLOYEES',
      value: '1,284',
      trend: '+8.5%',
      isPositive: true,
      icon: Users,
      colorClass: 'bg-blue-50 text-[#1d4ed8] border border-blue-100/30'
    },
    {
      id: 'new-hires',
      title: 'NEW HIRES',
      value: '42',
      trend: '+16.7%',
      isPositive: true,
      icon: UserPlus,
      colorClass: 'bg-emerald-50 text-emerald-600 border border-emerald-100/30'
    },
    {
      id: 'on-leave',
      title: 'ON LEAVE',
      value: '87',
      trend: '-3.2%',
      isPositive: false,
      icon: Umbrella,
      colorClass: 'bg-indigo-50 text-[#5473e8] border border-indigo-100/30'
    },
    {
      id: 'attendance-rate',
      title: 'ATTENDANCE RATE',
      value: '96.8%',
      trend: '+2.4%',
      isPositive: true,
      icon: CheckCircle,
      colorClass: 'bg-[#ecfdf5] text-[#059669] border border-emerald-100/20'
    },
    {
      id: 'open-positions',
      title: 'OPEN POSITIONS',
      value: '23',
      trend: '-8.0%',
      isPositive: false,
      icon: Briefcase,
      colorClass: 'bg-orange-50 text-orange-600 border border-orange-100/30'
    },
    {
      id: 'turnover-rate',
      title: 'TURNOVER RATE',
      value: '6.2%',
      trend: '+1.1%',
      isPositive: true,
      icon: ArrowRightLeft,
      colorClass: 'bg-teal-50 text-teal-605 border border-teal-100/30'
    }
  ];

  return (
    <div id="dynamic-combined-dashboard-root" className="space-y-6 select-none animate-in fade-in duration-300">
      
      {/* SECTION 1: Top Row Strategic Stat cards (Matching screenshot perfectly) */}
      <div id="strategic-indicators-grid" className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {keyIndicators.map((card) => {
          const IconComponent = card.icon;
          return (
            <div 
              key={card.id} 
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-slate-200/60"
            >
              {/* Top Row: Icon Container */}
              <div className="flex justify-between items-start">
                <span className={`p-2.5 rounded-xl ${card.colorClass} flex items-center justify-center`}>
                  <IconComponent className="h-5 w-5 shrink-0" />
                </span>
              </div>

              {/* Bottom Block content (Sequential order: Value -> Title -> Trend) */}
              <div className="mt-4">
                <span className="text-[26px] font-black tracking-tight text-slate-800 leading-none block">
                  {card.value}
                </span>
                <span className="text-[9.5px] font-black text-slate-400 mt-1.5 block tracking-wider uppercase">
                  {card.title}
                </span>
                <div className="flex items-center gap-1.5 mt-1.5 text-[10.5px] font-bold">
                  {card.isPositive ? (
                    <span className="text-emerald-600 flex items-center font-extrabold">
                      ↑ {card.trend}
                    </span>
                  ) : (
                    <span className="text-rose-600 flex items-center font-extrabold">
                      ↓ {card.trend}
                    </span>
                  )}
                  <span className="text-slate-400 font-medium">vs last month</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SECTION 2: Middle interactive grid (Trends + Radial + Time punch) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Card A: Workforce Trends Line Chart (lg:col-span-6) */}
        <div className="lg:col-span-6 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between relative overflow-hidden">
          
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Workforce Trends</h3>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Dinamic company headcount progression metrics</p>
            </div>

            {/* Time period filter selection dropdown */}
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-black text-slate-600 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl transition-all cursor-pointer"
              >
                <span className="whitespace-nowrap">{timelineFilter}</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-40 bg-white border border-slate-100 rounded-xl shadow-lg z-30 overflow-hidden divide-y divide-slate-50 animate-in fade-in slide-in-from-top-1">
                  {(['Last 12 months', 'Last 6 months', 'Last 3 months', 'Last 30 days'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setTimelineFilter(filter);
                        setDropdownOpen(false);
                        addToast(`Dataset scale synchronized to: ${filter}`, 'info');
                      }}
                      className="w-full text-left px-3.5 py-2 text-[10.5px] font-bold text-slate-600 hover:text-[#1d4ed8] hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Core SVG line chart area */}
          <div className="relative flex-1 h-[145px] mt-2 select-none">
            
            {/* Tooltip Overlay */}
            {hoveredPoint && (
              <div 
                className="absolute bg-slate-900 border border-slate-800 text-white text-[10px] font-medium px-2.5 py-1.5 rounded-lg pointer-events-none shadow-md z-20 transition-all font-sans -translate-x-1/2 -translate-y-12"
                style={{ 
                  left: `${((hoveredPoint.x - paddingLeft) / actualWidth) * actualWidth + paddingLeft}px`, 
                  top: `${hoveredPoint.y}px` 
                }}
              >
                <div className="font-black text-white">{hoveredPoint.label}</div>
                <div className="text-[10px] text-blue-400 font-bold mt-0.5">{hoveredPoint.value.toLocaleString()} Employees</div>
              </div>
            )}

            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height="100%">
              <defs>
                <linearGradient id="area-gradient-refined" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Vertical evaluation divider guidelines */}
              {points.map((p, idx) => (
                <line 
                  key={`vline-${idx}`}
                  x1={p.x}
                  y1={paddingTop}
                  x2={p.x}
                  y2={chartHeight - paddingBottom}
                  className="stroke-slate-100/50"
                  strokeWidth="1"
                />
              ))}

              {/* Horizontal grid guide tracks */}
              {trendData.yLabels.map((lbl, idx) => {
                const ratio = idx / (trendData.yLabels.length - 1);
                const y = paddingTop + actualHeight * ratio;
                return (
                  <g key={`hl-${idx}`}>
                    <text x={paddingLeft - 12} y={y + 3} textAnchor="end" className="fill-slate-400 font-mono text-[9px] font-bold">
                      {lbl}
                    </text>
                    <line 
                      x1={paddingLeft} 
                      y1={y} 
                      x2={chartWidth - paddingRight} 
                      y2={y} 
                      className="stroke-slate-100" 
                      strokeDasharray="4 4" 
                    />
                  </g>
                );
              })}

              {/* X-Axis month labels */}
              {points.map((p, idx) => (
                <text 
                  key={`xl-${idx}`} 
                  x={p.x} 
                  y={chartHeight - 4} 
                  textAnchor="middle" 
                  className="fill-slate-400 font-bold text-[8.5px] uppercase tracking-wide"
                >
                  {p.label}
                </text>
              ))}

              {/* Ambient visual gradient region */}
              {areaPath && (
                <path d={areaPath} fill="url(#area-gradient-refined)" className="transition-all duration-300" />
              )}

              {/* S-curve line stroke */}
              {linePath && (
                <path 
                  d={linePath} 
                  fill="none" 
                  stroke="#1d4ed8" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="transition-all duration-300"
                />
              )}

              {/* Active hover crosshair guide line */}
              {hoveredPoint && (
                <line
                  x1={hoveredPoint.x}
                  y1={paddingTop}
                  x2={hoveredPoint.x}
                  y2={paddingTop + actualHeight}
                  className="stroke-[#1d4ed8]/30"
                  strokeDasharray="2 2"
                />
              )}

              {/* Circular data points handles and triggers */}
              {points.map((p, idx) => (
                <g key={`pt-${idx}`}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={14}
                    className="fill-transparent cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(p)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={hoveredPoint?.value === p.value ? 5.5 : 3}
                    className={`transition-all duration-150 pointer-events-none ${
                       hoveredPoint?.value === p.value
                        ? 'fill-[#1d4ed8] stroke-white stroke-2'
                        : 'fill-white stroke-[#1d4ed8] stroke-2 shadow-xs'
                    }`}
                  />
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Card B: Live Attendance Donut Gauge (lg:col-span-3) */}
        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-slate-50 pb-2">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Attendance</h3>
            <span className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] text-emerald-600 font-black uppercase tracking-wider">Live</span>
            </span>
          </div>

          {/* SVG circle donut presentation */}
          <div className="relative flex justify-center items-center py-4">
            <div className="absolute text-center mt-0.5">
              <span className="text-2xl font-black text-slate-800 block leading-tight tracking-tight">89.4%</span>
              <span className="text-[9px] text-slate-400 font-extrabold block uppercase tracking-wide">Attendance rate</span>
            </div>

            <svg width="125" height="125" viewBox="0 0 100 100" className="transform -rotate-90">
              {/* Backing Track */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#f1f5f9"
                strokeWidth="7"
              />
              {/* Sector 1: Present (89.4% -> 224.68 long, 251.32 total circ) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#1d4ed8" /* matching mockup blue color */
                strokeWidth="7"
                strokeDasharray="224.68 251.32"
                strokeDashoffset="0"
                strokeLinecap="round"
                className="transition-all duration-300"
              />
              {/* Sector 2: On Leave (7.3% -> 18.35 long, offset cumulative) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#818cf8" /* soft periwinkle-blue */
                strokeWidth="7"
                strokeDasharray="18.35 251.32"
                strokeDashoffset="-224.68"
                strokeLinecap="round"
                className="transition-all duration-300"
              />
              {/* Sector 3: Absent (2.3% -> 5.78 long) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#cbd5e1" /* gray absence */
                strokeWidth="7"
                strokeDasharray="5.78 251.32"
                strokeDashoffset="-243.03"
                strokeLinecap="round"
                className="transition-all duration-300"
              />
              {/* Sector 4: Late (1.0% -> 2.51 long) */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#f59e0b" /* amber late */
                strokeWidth="7"
                strokeDasharray="2.51 251.32"
                strokeDashoffset="-248.81"
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
          </div>

          {/* High-accuracy aligned dataset ledger */}
          <div className="space-y-1.5 text-[11px] font-bold text-slate-600 mt-2">
            <div className="flex items-center justify-between py-1 px-1 border-b border-slate-50/50">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#1d4ed8]" />
                <span className="text-slate-500 font-bold">Present</span>
              </span>
              <span className="text-slate-800 font-black font-mono">89.4%</span>
            </div>

            <div className="flex items-center justify-between py-1 px-1 border-b border-slate-50/50">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#cbd5e1]" />
                <span className="text-slate-500 font-bold">Absent</span>
              </span>
              <span className="text-slate-800 font-black font-mono">2.3%</span>
            </div>

            <div className="flex items-center justify-between py-1 px-1 border-b border-slate-50/50">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
                <span className="text-slate-500 font-bold">Late</span>
              </span>
              <span className="text-slate-800 font-black font-mono">1.0%</span>
            </div>

            <div className="flex items-center justify-between py-1 px-1">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#818cf8]" />
                <span className="text-slate-500 font-bold">On Leave</span>
              </span>
              <span className="text-slate-800 font-black font-mono">7.3%</span>
            </div>
          </div>
        </div>

        {/* Card C: Strategic Live Time Tracking & Punching (lg:col-span-3) */}
        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-slate-50 pb-2">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Time Tracking</h3>
            <span className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] text-emerald-600 font-black uppercase tracking-wider">Live</span>
            </span>
          </div>

          {/* Time digits container using JetBrains Mono to avoid shifting layout */}
          <div className="text-center py-2 relative">
            <span className="text-[32px] font-black font-mono text-slate-800 tracking-tighter leading-none block">
              {getDigitalTimeString(time)}
            </span>
            <span className="text-[9px] text-[#64748b] font-black block mt-2 text-center uppercase tracking-wider">
              {getCalendarDateString(time)}
            </span>
          </div>

          {/* Standing status and inputs panel */}
          <div className="bg-slate-50/85 border border-slate-100 rounded-2xl p-4 space-y-3 relative">
            <span className={`absolute right-4 top-3 text-[8.5px] font-black tracking-widest uppercase px-2 py-0.5 rounded-md ${
              isPunchedIn ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
            }`}>
              {isPunchedIn ? 'Working' : 'Standby'}
            </span>

            {/* Shift logs block */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="bg-white border border-slate-100/80 rounded-xl p-3">
                <span className="text-[8.5px] text-slate-400 font-extrabold block uppercase tracking-wider">Clock In</span>
                <span className="text-xs font-black text-slate-750 block mt-1 font-mono">{punchInTime}</span>
              </div>
              <div className="bg-white border border-slate-100/80 rounded-xl p-3">
                <span className="text-[8.5px] text-slate-400 font-extrabold block uppercase tracking-wider">Clock Out</span>
                <span className="text-xs font-black text-slate-750 block mt-1 font-mono">{punchOutTime}</span>
              </div>
            </div>

            {/* Session tracking time accumulator box */}
            <div className="bg-slate-900 rounded-xl px-4 py-2 flex justify-between items-center text-white">
              <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">Total session time</span>
              <span className="text-[11px] font-black font-mono text-emerald-400">{formatSessionTime(sessionSeconds)}</span>
            </div>
          </div>

          {/* Action trigger punch-card loops */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              disabled={isPunchedIn}
              onClick={handlePunchIn}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-black rounded-xl border transition-all cursor-pointer ${
                isPunchedIn 
                  ? 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-755 hover:text-[#1d4ed8] active:scale-[0.98]'
              } whitespace-nowrap`}
            >
              <LogIn className="h-3.5 w-3.5 shrink-0" />
              <span className="uppercase tracking-wide text-[9.5px]">Punch In</span>
            </button>
            <button 
              disabled={!isPunchedIn}
              onClick={handlePunchOut}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-black rounded-xl border transition-all cursor-pointer ${
                !isPunchedIn 
                  ? 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-755 hover:text-rose-600 active:scale-[0.98]'
              } whitespace-nowrap`}
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" />
              <span className="uppercase tracking-wide text-[9.5px]">Punch Out</span>
            </button>
          </div>
        </div>

      </div>

      {/* SECTION 3: Bottom strategic logs & directory columns (New Joiners, Absence Queue, Financial Audit) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Card X: New Talent Ledger (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div className="border-b border-slate-50 pb-3 flex justify-between items-center">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">New Talent</h3>
            <button 
              onClick={() => {
                onNavigate('/employees');
                addToast('Transferred scope directory to workforce pipeline grid view.', 'info');
              }}
              className="text-[9.5px] font-black uppercase text-[#1d4ed8] hover:underline cursor-pointer flex items-center gap-0.5"
            >
              <span>Explorer</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100/60 mt-3 flex-1 flex flex-col justify-between">
            {[
              { name: 'Sarah Johnson', role: 'UI/UX Designer', date: 'May 28, 2025', initials: 'SJ', color: 'bg-indigo-100/80 text-indigo-750' },
              { name: 'Michael Chen', role: 'Backend Developer', date: 'May 27, 2025', initials: 'MC', color: 'bg-emerald-100/80 text-emerald-750' },
              { name: 'Priya Sharma', role: 'HR Executive', date: 'May 26, 2025', initials: 'PS', color: 'bg-teal-100/80 text-teal-750' },
              { name: 'David Wilson', role: 'Sales Manager', date: 'May 24, 2025', initials: 'DW', color: 'bg-orange-100/80 text-orange-750' },
              { name: 'Emma Brown', role: 'Marketing Specialist', date: 'May 23, 2025', initials: 'EB', color: 'bg-pink-100/80 text-pink-750' },
            ].map((talent, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-3">
                  <span className={`h-8.5 w-8.5 rounded-full ${talent.color} font-black text-[11px] flex items-center justify-center`}>
                    {talent.initials}
                  </span>
                  <div>
                    <span className="text-slate-800 font-bold block leading-tight">{talent.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{talent.role}</span>
                  </div>
                </div>
                <span className="text-[9.5px] text-slate-400 font-bold">{talent.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card Y: Absence Leave queue lists (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div className="border-b border-slate-50 pb-3 flex justify-between items-center">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Absence Queue</h3>
            <button 
              onClick={() => {
                onNavigate('/leave');
                addToast('Transferred directory to corporate leaves verification ledger.', 'info');
              }}
              className="text-[9.5px] font-black uppercase text-[#1d4ed8] hover:underline cursor-pointer flex items-center gap-0.5"
            >
              <span>Action List</span>
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100/60 mt-3 flex-1 flex flex-col justify-between">
            {[
              { name: 'John Doe', type: 'Annual Leave', dates: 'May 30 – Jun 03', status: 'Pending', initials: 'JD', badge: 'bg-[#fef3c7] text-[#d97706] border border-[#fef3c7]' },
              { name: 'Emily Davis', type: 'Sick Leave', dates: 'May 29 – May 30', status: 'Approved', initials: 'ED', badge: 'bg-[#dcfce7] text-[#15803d] border border-[#dcfce7]' },
              { name: 'Robert Smith', type: 'Personal Leave', dates: 'May 31 – Jun 02', status: 'Pending', initials: 'RS', badge: 'bg-[#fef3c7] text-[#d97706] border border-[#fef3c7]' },
              { name: 'Lisa Wilson', type: 'Annual Leave', dates: 'Jun 02 – Jun 06', status: 'Approved', initials: 'LW', badge: 'bg-[#dcfce7] text-[#15803d] border border-[#dcfce7]' },
              { name: 'James Taylor', type: 'Sick Leave', dates: 'May 30 – May 31', status: 'Rejected', initials: 'JT', badge: 'bg-[#fee2e2] text-[#b91c1c] border border-[#fee2e2]' },
            ].map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-3">
                  <span className="h-8.5 w-8.5 rounded-full bg-slate-100 text-slate-600 font-extrabold text-[11px] flex items-center justify-center">
                    {item.initials}
                  </span>
                  <div>
                    <span className="text-slate-800 font-bold block leading-tight">{item.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{item.type} &bull; {item.dates}</span>
                  </div>
                </div>
                <span className={`text-[8.5px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md ${item.badge}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card Z: Financial Overview & Certified Ledger Auditing (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div className="border-b border-slate-50 pb-3 flex justify-between items-center">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Financial Overview</h3>
            <span className="p-1 rounded-full bg-slate-50/10">
              <Coins className="h-4.5 w-4.5 text-emerald-600" />
            </span>
          </div>

          <div className="mt-4 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[32px] font-black text-slate-805 tracking-tight block">
                $1,248,320
              </span>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block mt-1">
                Total Operational Payroll
              </span>
            </div>

            {/* Split multi-segmented high precision progress bar */}
            <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-100">
              <div className="h-full bg-[#1d4ed8] transition-all" style={{ width: '71%' }} />
              <div className="h-full bg-[#0d9488] transition-all" style={{ width: '16%' }} />
              <div className="h-full bg-[#818cf8] transition-all" style={{ width: '13%' }} />
            </div>

            {/* Dynamic ledger detail breakdown alignments */}
            <div className="space-y-2.5 text-[11.5px] font-bold text-[#475569]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#1d4ed8]" />
                  <span className="font-bold text-slate-500">Net Pay</span>
                </span>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-slate-800 font-black">$896,450</span>
                  <span className="text-[10px] text-slate-400 font-bold">(71%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#0d9488]" />
                  <span className="font-bold text-slate-500">Deductions</span>
                </span>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-slate-800 font-black">$195,870</span>
                  <span className="text-[10px] text-slate-400 font-bold">(16%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#818cf8]" />
                  <span className="font-bold text-slate-500">Taxes</span>
                </span>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-slate-800 font-black">$156,000</span>
                  <span className="text-[10px] text-slate-400 font-bold">(12%)</span>
                </div>
              </div>
            </div>

            {/* Solid dark finalize audit corporate button */}
            <button 
              onClick={startFinancialAudit}
              className="w-full py-3 bg-[#0f172a] hover:bg-slate-800 text-white rounded-xl text-[10.5px] uppercase font-black tracking-widest transition-all cursor-pointer shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>$ FINALIZE AUDIT</span>
            </button>
          </div>
        </div>

      </div>

      {/* PORTAL GATEWAY MODAL: Interactive Automated Audit Process Simulation */}
      {showAuditModal && (
        <div id="payroll-regulatory-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-100 rounded-3xl p-6.5 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-250">
            
            {/* Header branding */}
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-[#1d4ed8] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                Ledger Audit Protocol v12.4
              </span>
              <h4 className="text-sm font-black text-slate-800 mt-3.5 uppercase tracking-wide">Financial Payroll Ledger Compiler</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Compiles RM 1,248,320 across 1,284 personnel file entities for electronic bank routing and regulatory certifications.
              </p>
            </div>

            {/* Interlaced progression states */}
            <div className="mt-5 space-y-4">
              
              {/* Dynamic incremental indicator */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10.5px] font-black">
                  <span className="text-slate-500">Processing Ledger Segments</span>
                  <span className="text-[#1d4ed8]">{auditComplete ? 100 : auditProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-150" 
                    style={{ width: `${auditComplete ? 100 : auditProgress}%` }} 
                  />
                </div>
              </div>

              {/* Verified Checklist Nodes */}
              <div className="space-y-2 text-[11px] font-bold text-slate-600">
                <div className="flex items-center gap-2.5">
                  {auditStep >= 1 ? (
                    <span className="h-4 w-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</span>
                  ) : (
                    <span className="h-4 w-4 rounded-full border-2 border-slate-200 animate-spin border-t-[#1d4ed8]" />
                  )}
                  <span className={auditStep >= 1 ? 'line-through text-slate-400' : 'text-slate-700'}>
                    Verifying Tax Reserves: RM 156,000 alignment
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  {auditStep >= 2 ? (
                    <span className="h-4 w-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</span>
                  ) : auditStep === 1 ? (
                    <span className="h-4 w-4 rounded-full border-2 border-slate-200 animate-spin border-t-emerald-500" />
                  ) : (
                    <span className="h-4 w-4 rounded-full border border-slate-200" />
                  )}
                  <span className={auditStep >= 2 ? 'line-through text-slate-400' : 'text-slate-700'}>
                    Reconciling Corporate Benefit Deductions: RM 195,870
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  {auditComplete ? (
                    <span className="h-4 w-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</span>
                  ) : auditStep === 2 ? (
                    <span className="h-4 w-4 rounded-full border-2 border-slate-200 animate-spin border-t-indigo-500" />
                  ) : (
                    <span className="h-4 w-4 rounded-full border border-slate-200" />
                  )}
                  <span className={auditComplete ? 'line-through text-slate-400 font-bold' : 'text-slate-700'}>
                    Generating Electronic Bank Routing Instruction: RM 896,450
                  </span>
                </div>
              </div>

            </div>

            {/* Complete status certification shield block */}
            {auditComplete && (
              <div className="mt-5 p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-2.5 text-[11px] font-medium leading-relaxed text-emerald-850 animate-in fade-in duration-200">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block text-emerald-950 uppercase text-[9.5px]">Audit Certified Successfully</span>
                  Ledger verification is finalized. Electronic disbursement instruction transmitted to corporate Alliance Bank routing queues.
                </div>
              </div>
            )}

            {/* Buttons footer actions */}
            <div className="mt-6 flex justify-end gap-2.5 border-t border-slate-100 pt-4">
              <button 
                onClick={() => setShowAuditModal(false)}
                className="px-4 py-2 text-[10.5px] font-black rounded-lg text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-150 tracking-wide uppercase transition-all cursor-pointer"
              >
                {auditComplete ? 'Close Portal' : 'Cancel Audit'}
              </button>
              {auditComplete && (
                <button 
                  onClick={() => {
                    setShowAuditModal(false);
                    addToast('Ledger audit protocol is certified as archived.', 'success');
                  }}
                  className="px-4 py-2 text-[10.5px] font-black rounded-lg bg-slate-900 text-white hover:bg-slate-800 tracking-wide uppercase transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Lock className="h-3 w-3 text-emerald-400" />
                  <span>Archive Certification</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

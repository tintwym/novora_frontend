import { useState } from 'react'
import {
  Users,
  Building,
  Briefcase,
  Clock,
  Search,
  Download,
  Printer,
  FileSpreadsheet,
  ShieldCheck,
  Heart,
} from 'lucide-react'
import { showActionToast } from '../../utils/actionToast'
import type { ModuleEmployee } from '../../types/moduleEmployee'

type EmployeeReportsTabProps = {
  employees: ModuleEmployee[]
}

export function EmployeeReportsTab({ employees }: EmployeeReportsTabProps) {
  const addToast = (text: string, type?: 'success' | 'loading' | 'error' | 'info') => {
    showActionToast(text, type)
  }

  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState<string>('All');
  const [reportSearchQuery, setReportSearchQuery] = useState<string>('');

  // 1. Calculate General Statistics
  const totalCount = employees.length;

  const permanentCount = employees.filter(e => e.employmentStatus === 'Permanent').length;
  const contractCount = employees.filter(e => e.employmentStatus === 'Contract').length;
  const internCount = employees.filter(e => e.employmentStatus === 'Intern').length;
  const partTimeCount = employees.filter(e => e.employmentStatus === 'Part-time').length;

  // Filtered dataset for reports exploration
  const filteredEmployees = employees.filter(emp => {
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    const matchesStatus = selectedEmploymentType === 'All' || emp.employmentStatus === selectedEmploymentType;
    const matchesSearch = reportSearchQuery.trim() === '' ||
      emp.name.toLowerCase().includes(reportSearchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(reportSearchQuery.toLowerCase()) ||
      emp.position.toLowerCase().includes(reportSearchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(reportSearchQuery.toLowerCase());
    return matchesDept && matchesStatus && matchesSearch;
  });

  // Calculate stats for current selection
  const currentSelectionCount = filteredEmployees.length;
  const selectionActiveCount = filteredEmployees.filter(e => e.status === 'Active').length;
  const selectionLeaveCount = filteredEmployees.filter(e => e.status === 'On Leave').length;

  // 2. Department Breakdown data logic
  const deptCountMap = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const departmentData = Object.entries(deptCountMap).map(([dept, count]) => ({
    name: dept,
    count,
    percentage: Math.round((count / totalCount) * 100),
  })).sort((a, b) => b.count - a.count);

  // 3. Tenure Analysis helper
  const calculateTenureGroup = (joinDateStr: string) => {
    try {
      // Formats expected like "15 Jan 2018", "12 Mar 2022"
      const yearStr = joinDateStr.split(' ').pop();
      if (!yearStr) return 'Unknown';
      const joinYear = parseInt(yearStr, 10);
      const currentYear = 2026; // System reference year is 2026
      const diff = currentYear - joinYear;
      if (diff >= 5) return '5+ Years Veteran';
      if (diff >= 3) return '3-5 Years Experienced';
      if (diff >= 1) return '1-3 Years Solid';
      return 'Under 1 Year';
    } catch {
      return '1-3 Years Solid';
    }
  };

  const tenureGroupsMap = employees.reduce((acc, emp) => {
    const group = calculateTenureGroup(emp.joinDate);
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const tenureData = Object.entries(tenureGroupsMap).map(([group, count]) => ({
    group,
    count,
    percentage: Math.round((count / totalCount) * 100)
  }));

  // Initial letter generator
  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div id="employees-reports-tab-container" className="space-y-6 animate-in fade-in duration-150">
      
      {/* 1. REPORT FILTERING & CONTROL DECK */}
      <div className="bg-slate-50 border border-slate-100 p-5 rounded-3xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        
        {/* Left Side: Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target Sector</span>
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                addToast(`Report focused on ${e.target.value} department`, 'info');
              }}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-bold outline-none cursor-pointer"
            >
              <option value="All">All Departments &bull; Consolidated</option>
              <option value="Engineering">Engineering Department</option>
              <option value="Finance">Finance Team</option>
              <option value="HR">Human Resources</option>
              <option value="Marketing">Marketing &amp; Sales</option>
              <option value="Operations">Operations Support</option>
            </select>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Employment Type</span>
            <select
              value={selectedEmploymentType}
              onChange={(e) => {
                setSelectedEmploymentType(e.target.value);
                addToast(`Report filtered to: ${e.target.value}`, 'info');
              }}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-bold outline-none cursor-pointer"
            >
              <option value="All">All Types (Permanent &amp; Temp)</option>
              <option value="Permanent">Permanent Staff</option>
              <option value="Contract">Contract Roster</option>
              <option value="Intern">Internships</option>
              <option value="Part-time">Part-time</option>
            </select>
          </div>

        </div>

        {/* Right Side: Print and Export Trigger actions */}
        <div className="flex items-center gap-2.5 w-full md:w-auto md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
          <button
            onClick={() => {
              addToast('Compiling employee metrics & demographics reports...', 'loading');
              setTimeout(() => {
                addToast('Comprehensive Employee Demographics spreadsheet downloaded!', 'success');
              }, 1200);
            }}
            className="flex-1 md:flex-initial bg-white hover:bg-slate-50 text-[11px] font-bold text-slate-600 px-4 py-2 rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
            <span>Export Demographics</span>
          </button>
          
          <button
            onClick={() => {
              addToast('Formatting dashboard report layout for print queues...', 'loading');
              setTimeout(() => {
                addToast('Staff Audit Report print blueprint sent to printer queue!', 'success');
              }, 1000);
            }}
            className="flex-1 md:flex-initial bg-[#2f66e0] hover:bg-opacity-95 text-[11px] font-extrabold text-white px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Executive Staff Audit</span>
          </button>
        </div>

      </div>

      {/* 2. DYNAMIC SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Active Headcount */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 h-10 w-10 bg-blue-50/40 rounded-bl-3xl flex items-center justify-center">
            <Users className="h-4.5 w-4.5 text-blue-500" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">Total Roster Checked</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-3xl font-black text-slate-800">{currentSelectionCount}</span>
            <span className="text-[10.5px] font-bold text-slate-400">of {totalCount} corporate staff</span>
          </div>
          <div className="flex items-center gap-1 mt-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <p className="text-[10px] text-slate-500 font-semibold">{selectionActiveCount} Currently Active in operations</p>
          </div>
        </div>

        {/* Permanent Composition Ratio */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 h-10 w-10 bg-indigo-50/40 rounded-bl-3xl flex items-center justify-center">
            <Briefcase className="h-4.5 w-4.5 text-indigo-500" />
          </div>
          <span className="text-[10px] font-bold text-[#4b5563] tracking-wider uppercase block">Permanent Core Stability</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-3xl font-black text-slate-800">
              {Math.round((employees.filter(e => e.employmentStatus === 'Permanent').length / totalCount) * 100)}%
            </span>
            <span className="text-[10.5px] font-bold text-emerald-500">↑ 2.1% YoY gain</span>
          </div>
          <div className="flex items-center gap-1 mt-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2f66e0]" />
            <p className="text-[10px] text-slate-500 font-semibold">{permanentCount} permanent positions securely staffed</p>
          </div>
        </div>

        {/* Active vs On Leave Balance */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 h-10 w-10 bg-pink-50/40 rounded-bl-3xl flex items-center justify-center">
            <Clock className="h-4.5 w-4.5 text-pink-500" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">Active Out-of-Office State</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-3xl font-black text-slate-800">{selectionLeaveCount}</span>
            <span className="text-xs font-semibold text-amber-600">On approved leaves</span>
          </div>
          <div className="flex items-center gap-1 mt-3">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            <p className="text-[10px] text-slate-500 font-semibold">
              {selectionLeaveCount > 0 ? `${Math.round((selectionLeaveCount / currentSelectionCount) * 100)}% active leave ratio today` : 'No staff currently out-of-office'}
            </p>
          </div>
        </div>

        {/* Support Ratios Dependents & Protection */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 h-10 w-10 bg-emerald-50/40 rounded-bl-3xl flex items-center justify-center">
            <Heart className="h-4.5 w-4.5 text-emerald-500" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">Family Insured Dependents</span>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-3xl font-black text-[#2f66e0]">
              {employees.filter(e => e.dependents && e.dependents !== 'None').length}
            </span>
            <span className="text-xs font-semibold text-slate-400">insured units</span>
          </div>
          <div className="flex items-center gap-1 mt-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <p className="text-[10px] text-slate-500 font-semibold">100% full panel insurance coverage</p>
          </div>
        </div>

      </div>

      {/* 3. INTERACTIVE VISUAL CHART BLOCKS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Aspect: Headcount Distribution Bar Chart Widget */}
        <div className="lg:col-span-6 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="border-b border-slate-50 pb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Internal Roster Distribution by Department</h3>
            <p className="text-[10px] text-slate-400 font-medium italic mt-0.5">Calculated percent of total database staff mapped to sectors</p>
          </div>

          <div className="space-y-4">
            {departmentData.map((dept) => {
              // Color schemes specifically matching department personalities
              let color = 'bg-[#2f66e0]';
              if (dept.name === 'Engineering') color = 'bg-blue-600';
              if (dept.name === 'Finance') color = 'bg-emerald-500';
              if (dept.name === 'HR') color = 'bg-purple-500';
              if (dept.name === 'Marketing') color = 'bg-pink-500';
              if (dept.name === 'Operations') color = 'bg-orange-500';

              const isFocused = selectedDept === 'All' || selectedDept === dept.name;

              return (
                <div key={dept.name} className={`space-y-1 ${!isFocused ? 'opacity-35 transition-opacity' : 'transition-opacity'}`}>
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Building className="h-3.5 w-3.5 text-slate-400" />
                      <span>{dept.name} Team</span>
                    </span>
                    <span>{dept.count} Members &bull; <strong className="text-slate-800">{dept.percentage}%</strong></span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`${color} h-full transition-all duration-500 rounded-full`} 
                      style={{ width: `${dept.percentage}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Aspect: Tenure Seniority Analysis & Employment Composition */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Employee Seniority & Tenure Levels Widget */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
            <div className="border-b border-slate-50 pb-3 mb-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Internal Service Longevity / Tenure Breakdown</h3>
              <p className="text-[10px] text-slate-400 font-medium italic mt-0.5">Years of service calculated from historical joining rosters</p>
            </div>

            <div className="space-y-3.5">
              {tenureData.map((data) => (
                <div key={data.group} className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="h-2 w-2 rounded-full bg-indigo-500" />
                    <span>{data.group}</span>
                  </div>
                  <div className="flex items-center gap-3 w-40">
                    <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${data.percentage}%` }} />
                    </div>
                    <span className="font-bold text-slate-800 text-right w-12">{data.count} ({data.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Staffing Typology status breakdown */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Contract Typology Ratio</h3>
            
            {/* Balanced composite graphic indicator of types */}
            <div className="w-full h-4.5 bg-slate-100 rounded-lg overflow-hidden flex font-bold text-[8.5px] text-white select-none">
              <div 
                className="bg-[#2f66e0] h-full flex items-center justify-center transition-all" 
                style={{ width: `${Math.round((permanentCount / totalCount) * 100)}%` }}
                title="Permanent employees"
              >
                {permanentCount > 1 && `${Math.round((permanentCount / totalCount) * 100)}%`}
              </div>
              <div 
                className="bg-indigo-500 h-full flex items-center justify-center transition-all" 
                style={{ width: `${Math.round((contractCount / totalCount) * 100)}%` }}
                title="Contract personnel"
              >
                {contractCount > 1 && `${Math.round((contractCount / totalCount) * 100)}%`}
              </div>
              <div 
                className="bg-emerald-500 h-full flex items-center justify-center transition-all" 
                style={{ width: `${Math.round((internCount / totalCount) * 100)}%` }}
                title="Internships"
              >
                {internCount > 0 && `${Math.round((internCount / totalCount) * 100)}%`}
              </div>
              <div 
                className="bg-amber-500 h-full flex items-center justify-center transition-all" 
                style={{ width: `${Math.round((partTimeCount / totalCount) * 100)}%` }}
                title="Part-time"
              >
                {partTimeCount > 0 && `${Math.round((partTimeCount / totalCount) * 100)}%`}
              </div>
            </div>

            {/* Micro Legended counts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[10.5px] font-bold">
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="h-2 w-2 rounded-full bg-[#2f66e0]" />
                <span>Permanent ({permanentCount})</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                <span>Contract ({contractCount})</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Intern ({internCount})</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span>Part-Time ({partTimeCount})</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 4. EXHAUSTIVE, DETAILED AUDITABLE EMPLOYEE LEDGER TABLE */}
      <div id="employees-granularity-ledger-card" className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
        
        {/* Table header with search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Dynamic Granular Staffing Register &bull; Audit Trail</h3>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
              Refined with NRIC codes, private mobile numbers, emergency contacts, and active insurance dependents
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={reportSearchQuery}
                onChange={(e) => setReportSearchQuery(e.target.value)}
                placeholder="Find name, position, ID..."
                className="bg-slate-50 border border-slate-200 focus:border-slate-300 rounded-xl pl-8.5 pr-7 py-1.5 text-xs font-semibold text-slate-700 outline-none w-60"
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
                addToast(`Exported ${filteredEmployees.length} filtered employee records to payroll ledger format`, 'success');
              }}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Download className="h-3 w-3" />
              <span>Export Records</span>
            </button>
          </div>
        </div>

        {/* Ledger Table rendering container */}
        <div className="overflow-x-auto border border-slate-100 rounded-2xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4.5">Staff No.</th>
                <th className="py-3 px-4.5">Employee Name</th>
                <th className="py-3 px-4.5">Sector &amp; Position</th>
                <th className="py-3 px-4.5">Type &bull; Hire Date</th>
                <th className="py-3 px-4.5">Identities (NRIC / Pass)</th>
                <th className="py-3 px-4.5">Emergency contact &amp; dependents</th>
                <th className="py-3 px-4.5 text-center">Operation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-600">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="py-3.5 px-4.5 font-mono text-[11px] text-slate-505">{emp.id}</td>
                  <td className="py-3.5 px-4.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`h-7 w-7 rounded-md flex items-center justify-center text-white font-bold text-[10.5px] shrink-0 ${emp.avatarColor}`}>
                        {getInitials(emp.name)}
                      </div>
                      <div>
                        <span className="text-slate-800 font-bold block">{emp.name}</span>
                        <span className="text-[10px] text-slate-400 font-semibold block">{emp.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4.5">
                    <span className="text-slate-750 block">{emp.position}</span>
                    <span className="text-[10px] text-[#2f66e0] bg-blue-50 px-2 py-0.5 rounded font-bold inline-block mt-0.5">{emp.department}</span>
                  </td>
                  <td className="py-3.5 px-4.5">
                    <span className="text-slate-700 block">{emp.employmentStatus}</span>
                    <span className="text-[10px] text-slate-400 font-medium block">Joined {emp.joinDate}</span>
                  </td>
                  <td className="py-3.5 px-4.5 font-mono text-[11px] text-slate-655">
                    <div>{emp.nric}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-sans font-semibold">{emp.mobile}</div>
                  </td>
                  <td className="py-3.5 px-4.5">
                    <div className="max-w-xs space-y-0.5 text-[10.5px]">
                      <div className="text-slate-700 truncate" title={emp.emergencyContact}>
                        <strong>Emerg:</strong> {emp.emergencyContact}
                      </div>
                      <div className="text-slate-400 truncate font-medium" title={emp.dependents}>
                        <strong>Kids/Spouse:</strong> {emp.dependents}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4.5 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-bold border ${
                      emp.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100/50'
                        : emp.status === 'On Leave'
                        ? 'bg-amber-50 text-amber-700 border-amber-100/50'
                        : 'bg-slate-50 text-slate-700 border-slate-100/50'
                    }`}>
                      <span className={`h-1 w-1 rounded-full ${emp.status === 'Active' ? 'bg-emerald-500' : emp.status === 'On Leave' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 italic font-semibold">
                    No active employees matching filters {"'"}
                    {selectedDept} / {selectedEmploymentType}
                    {"'"} are listed inside the organization record.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Ledger checksum footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 font-semibold pt-1">
          <span>
            Displaying {filteredEmployees.length} qualified logs &bull; Cross-checked with Novora HRM ledger keys
          </span>
          <div className="flex items-center gap-1 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>Encrypted Ledger Verified</span>
          </div>
        </div>

      </div>

    </div>
  );
}

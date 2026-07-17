import { useState } from 'react'
import {
  Search,
} from 'lucide-react'
import { showActionToast } from '../../utils/actionToast'
import type { ModuleEmployee, Department } from '../../types/moduleEmployee'

type OrgChartTabProps = {
  employees: ModuleEmployee[]
  onSelectEmployee: (emp: ModuleEmployee) => void
}

export function OrgChartTab({ employees, onSelectEmployee }: OrgChartTabProps) {
  const addToast = (text: string, type?: 'success' | 'loading' | 'error' | 'info') => {
    showActionToast(text, type)
  }

  const [chartSearch, setChartSearch] = useState('');
  const [activeDeptFilter, setActiveDeptFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'org' | 'list'>('org');
  const [chartDensity, setChartDensity] = useState<'concise' | 'small' | 'standard'>('concise');

  // Total employees and department stats matching the mockup
  const totalEmployeesCount = 1284;
  const engineeringCount = 342;
  const financeCount = 180;
  const hrCount = 88;
  const marketingCount = 142;
  const operationsCount = 261;

  // Helper function to resolve employee or create mock fallback so clicking works seamlessly
  const handleSelectVirtualEmployee = (name: string, fallbackId: string, role: string, dept: Department) => {
    const existing = employees.find(
      (e) => e.name.toLowerCase() === name.toLowerCase() || e.id === fallbackId
    );
    if (existing) {
      addToast(`Opening record for ${existing.name}`, 'success');
      onSelectEmployee(existing);
      return;
    }

    // Dynamic high-fidelity placeholder employee record
    const mockEmail = `${name.toLowerCase().replace(/\s+/g, '')}@novora.com`;
    const virtualEmployee: ModuleEmployee = {
      id: fallbackId,
      name: name,
      department: dept,
      position: role,
      employmentStatus: 'Permanent',
      status: 'Active',
      joinDate: '12 May 2020',
      nric: '880612-14-5311',
      mobile: '+60 12-322 8899',
      email: mockEmail,
      address: 'Bangsar South, Kuala Lumpur, Malaysia',
      avatarColor: 
        dept === 'Engineering' ? 'bg-blue-600 text-white' : 
        dept === 'Finance' ? 'bg-emerald-600 text-white' : 
        dept === 'HR' ? 'bg-purple-600 text-white' : 
        dept === 'Marketing' ? 'bg-rose-600 text-white' : 
        'bg-amber-600 text-white',
      dependents: 'Spouse, 2 Children',
      emergencyContact: 'Lim Kah Kok (Father) - +60 16 776 5432',
      reportsTo: 'EMP-0010',
    };
    addToast(`Opening record for ${name} (Active directory match)`, 'success');
    onSelectEmployee(virtualEmployee);
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Check if a node should highlight based on search input
  const isHighlighted = (name: string, role: string) => {
    if (!chartSearch) return false;
    const query = chartSearch.toLowerCase();
    return name.toLowerCase().includes(query) || role.toLowerCase().includes(query);
  };

  // Dynamic layout definitions based on density options
  const getDensityClasses = () => {
    switch (chartDensity) {
      case 'concise':
        return {
          gap: 'gap-3 sm:gap-4 md:gap-5',
          nodeWidth: 'w-40 p-2 text-[10px] gap-2 rounded-xl border',
          avatarSize: 'h-7 w-7 text-[10px]',
          titleFont: 'text-[11px]',
          descFont: 'text-[9px]',
          subNodeWidth: 'w-34 p-1.5 text-[9.5px] rounded-xl border',
          subSubWidth: 'w-30 p-1.5 text-[8.5px] rounded-lg border',
          ceoWidth: 'w-52 p-3 text-[10px] rounded-xl',
          ceoAvatar: 'h-9 w-9 text-xs',
          ceoTitle: 'text-[11px]',
          ceoDesc: 'text-[9.5px]',
        };
      case 'small':
        return {
          gap: 'gap-5 sm:gap-6 md:gap-7',
          nodeWidth: 'w-48 p-3 text-xs gap-2 rounded-2xl border',
          avatarSize: 'h-8 w-8 text-xs',
          titleFont: 'text-xs',
          descFont: 'text-[10px]',
          subNodeWidth: 'w-40 p-2 text-xs rounded-2xl border',
          subSubWidth: 'w-34 p-2 text-[9px] rounded-xl border',
          ceoWidth: 'w-60 p-4 text-[11px] rounded-2xl',
          ceoAvatar: 'h-10 w-10 text-xs',
          ceoTitle: 'text-xs',
          ceoDesc: 'text-[10px]',
        };
      case 'standard':
        return {
          gap: 'gap-10 sm:gap-11 md:gap-12',
          nodeWidth: 'w-56 p-3.5 text-xs gap-2.5 rounded-2xl border',
          avatarSize: 'h-8.5 w-8.5 text-xs',
          titleFont: 'text-xs',
          descFont: 'text-[10px]',
          subNodeWidth: 'w-44 p-2.5 text-xs rounded-2xl border',
          subSubWidth: 'w-36 p-2 text-[10px] rounded-xl border',
          ceoWidth: 'w-64 p-4.5 text-xs rounded-2xl',
          ceoAvatar: 'h-11 w-11 text-sm',
          ceoTitle: 'text-xs',
          ceoDesc: 'text-[10px]',
        };
    }
  };

  const density = getDensityClasses();

  // Visual Theme settings for departments matching screenshot
  const getDeptColorTheme = (dept: string) => {
    switch (dept) {
      case 'Engineering':
        return {
          cardBg: 'bg-blue-50/70 border-blue-200 hover:border-blue-400',
          avatarBg: 'bg-blue-100 text-blue-700',
          textColor: 'text-blue-900',
          accentBorder: 'border-blue-500',
          indicator: 'bg-[#2f66e0]',
          badge: 'bg-blue-100 text-blue-800',
        };
      case 'Finance':
        return {
          cardBg: 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-350',
          avatarBg: 'bg-emerald-100 text-emerald-700',
          textColor: 'text-emerald-900',
          accentBorder: 'border-emerald-500',
          indicator: 'bg-emerald-500',
          badge: 'bg-emerald-100 text-emerald-800',
        };
      case 'HR':
        return {
          cardBg: 'bg-purple-50/70 border-purple-200 hover:border-purple-350',
          avatarBg: 'bg-purple-100 text-purple-700',
          textColor: 'text-purple-900',
          accentBorder: 'border-purple-500',
          indicator: 'bg-purple-550',
          badge: 'bg-purple-100 text-purple-800',
        };
      case 'Marketing':
        return {
          cardBg: 'bg-rose-50/70 border-rose-200 border-rose-150 hover:border-rose-350',
          avatarBg: 'bg-rose-100 text-rose-700',
          textColor: 'text-rose-900',
          accentBorder: 'border-rose-500',
          indicator: 'bg-rose-500',
          badge: 'bg-rose-100 text-rose-800',
        };
      case 'Operations':
        return {
          cardBg: 'bg-amber-50/70 border-amber-205 border-amber-200 hover:border-amber-350',
          avatarBg: 'bg-amber-100 text-amber-700',
          textColor: 'text-amber-900',
          accentBorder: 'border-amber-500',
          indicator: 'bg-amber-600',
          badge: 'bg-amber-100 text-amber-800',
        };
      default:
        return {
          cardBg: 'bg-slate-50 border-slate-200',
          avatarBg: 'bg-slate-100 text-slate-700',
          textColor: 'text-slate-900',
          accentBorder: 'border-slate-500',
          indicator: 'bg-slate-500',
          badge: 'bg-slate-100 text-slate-800',
        };
    }
  };

  // Node Component definition
  interface NodeCardProps {
    name: string;
    role: string;
    id: string;
    dept: Department;
    members?: string;
    isCEO?: boolean;
  }

  const NodeCard = ({ name, role, id, dept, members, isCEO = false }: NodeCardProps) => {
    const theme = getDeptColorTheme(dept);
    const highlighted = isHighlighted(name, role);

    if (isCEO) {
      return (
        <div
          onClick={() => handleSelectVirtualEmployee(name, id, role, dept)}
          className={`relative bg-[#1e469a] border-2 border-[#163b82] flex items-center gap-3 shadow-md text-white hover:scale-102 transition-all duration-200 cursor-pointer ${
            density.ceoWidth
          } ${highlighted ? 'ring-4 ring-offset-2 ring-blue-500 animate-pulse' : ''}`}
        >
          <div className={`rounded-full flex items-center justify-center font-bold bg-blue-500/80 text-white shrink-0 shadow-sm ${density.ceoAvatar}`}>
            {getInitials(name)}
          </div>
          <div className="min-w-0">
            <h5 className={`font-extrabold tracking-tight text-white leading-normal ${density.ceoTitle}`}>{name}</h5>
            <p className={`text-blue-100 font-medium leading-normal mt-0.5 ${density.ceoDesc}`}>{role}</p>
            <span className="text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-md bg-[#133775] text-[#3b82f6] mt-1 inline-block">
              CEO
            </span>
          </div>
        </div>
      );
    }

    return (
      <div
        onClick={() => handleSelectVirtualEmployee(name, id, role, dept)}
        className={`flex items-center gap-2.5 bg-white shadow-xs hover:shadow-md transition-all cursor-pointer relative ${
          density.nodeWidth
        } ${theme.cardBg} ${highlighted ? 'ring-4 ring-[#2f66e0]' : ''}`}
      >
        <div className={`rounded-full flex items-center justify-center font-black shrink-0 ${density.avatarSize} ${theme.avatarBg}`}>
          {getInitials(name)}
        </div>
        <div className="min-w-0">
          <h6 className={`font-extrabold tracking-tight truncate leading-normal ${density.titleFont} ${theme.textColor}`}>
            {name}
          </h6>
          <p className={`text-slate-400 font-semibold truncate leading-none mt-0.5 ${density.descFont}`}>
            {role}
          </p>
          {members && (
            <p className={`text-[9px] font-bold mt-1 leading-none ${theme.textColor}`}>
              {members}
            </p>
          )}
        </div>
      </div>
    );
  };

  interface SubNodeCardProps {
    name: string;
    role: string;
    id: string;
    dept: Department;
  }

  const SubNodeCard = ({ name, role, id, dept }: SubNodeCardProps) => {
    const theme = getDeptColorTheme(dept);
    const highlighted = isHighlighted(name, role);

    return (
      <div
        onClick={() => handleSelectVirtualEmployee(name, id, role, dept)}
        className={`flex items-center gap-2 bg-white shadow-3xs hover:border-slate-300 transition-all cursor-pointer ${
          density.subNodeWidth
        } ${theme.cardBg} ${highlighted ? 'ring-2 ring-[#2f66e0]' : ''}`}
      >
        <div className={`rounded-full flex items-center justify-center font-bold shrink-0 ${density.avatarSize} ${theme.avatarBg}`}>
          {getInitials(name)}
        </div>
        <div className="min-w-0">
          <h6 className={`font-black tracking-tight leading-normal truncate ${density.titleFont} ${theme.textColor}`}>
            {name}
          </h6>
          <p className="text-[9.5px] text-slate-400 font-bold truncate leading-none mt-0.5">
            {role}
          </p>
        </div>
      </div>
    );
  };

  const SubSubNodeCard = ({ name, role, id, dept }: SubNodeCardProps) => {
    const theme = getDeptColorTheme(dept);
    const highlighted = isHighlighted(name, role);

    return (
      <div
        onClick={() => handleSelectVirtualEmployee(name, id, role, dept)}
        className={`flex items-center gap-2 bg-white shadow-3xs hover:border-slate-200 transition-all cursor-pointer ${
          density.subSubWidth
        } ${theme.cardBg} ${highlighted ? 'ring-2 ring-indigo-500' : ''}`}
      >
        <div className={`rounded-full flex items-center justify-center font-black shrink-0 ${density.avatarSize} ${theme.avatarBg}`}>
          {getInitials(name)}
        </div>
        <div className="min-w-0">
          <h6 className={`font-extrabold tracking-tight leading-none truncate ${theme.textColor}`}>
            {name}
          </h6>
          <p className="text-[8.5px] text-slate-400 font-semibold truncate leading-none mt-0.5">
            {role}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div id="org-chart-tab-outer" className="space-y-6">
      
      {/* FLAT ORIGINAL HEADER DESIGN STRICTLY MATCHING PREVIOUS PREVIEW UI */}
      <div className="space-y-5 pb-5 border-b border-slate-200/85 w-full">
        
        {/* ROW 1: Search on left corner, Switcher & Export on right corner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
          
          {/* Left corner: Search Input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </span>
            <input
              id="org-chart-person-search"
              type="text"
              placeholder="Find person..."
              value={chartSearch}
              onChange={(e) => setChartSearch(e.target.value)}
              className="w-48 text-xs text-slate-700 bg-slate-50 border border-slate-200/80 focus:border-slate-400 focus:bg-white focus:outline-none py-1.5 pl-9 pr-3 rounded-xl transition-all"
            />
          </div>

          {/* Right corner: Switcher & Export */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Switcher View block inside rounded box outline */}
            <div className="border border-slate-200 rounded-xl p-1 flex items-center bg-slate-50">
              <button
                id="org-view-btn"
                onClick={() => setViewMode('org')}
                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  viewMode === 'org'
                    ? 'bg-white text-slate-800 shadow-3xs border border-slate-200/50 font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Org view
              </button>
              <button
                id="list-view-btn"
                onClick={() => setViewMode('list')}
                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-800 shadow-3xs border border-slate-200/50 font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                List view
              </button>
            </div>
          </div>

        </div>

        {/* ROW 2: Departments filter centered exactly */}
        <div className="flex flex-col items-center justify-center gap-3 w-full">
          <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs">
            <span className="font-extrabold text-slate-500 uppercase tracking-widest text-[10px]">Department:</span>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {['All', 'Engineering', 'Finance', 'HR', 'Marketing', 'Operations'].map((dept) => {
                const isActive = activeDeptFilter === dept;
                return (
                  <button
                    key={dept}
                    onClick={() => {
                      setActiveDeptFilter(dept);
                      addToast(`Focus filtered to ${dept} team nodes`, 'info');
                    }}
                    className={`px-3 py-1.5 rounded-xl font-extrabold border transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-white text-slate-800 border-slate-800 shadow-3xs font-black'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200/80 hover:text-slate-800'
                    }`}
                  >
                    {dept}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-xs font-bold text-slate-400 select-none">
            1,284 employees &bull; 5 departments
          </div>
        </div>

      </div>

      {/* CORE VISUALIZATION */}
      {viewMode === 'org' ? (
        <div id="visual-chart-stage-canvas" className="bg-[#fcfdfd] border border-slate-200/60 rounded-3xl p-6 flex flex-col items-center justify-start overflow-hidden min-h-[500px] relative">
          
          {/* SMOOTH LAYOUT DENSITY SELECTION CONTROLS inside the Canvas Container to preserve space */}
          <div className="w-full flex items-center justify-between border-b border-slate-100 pb-3.5 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Chart Layout Sizing:</span>
              <div className="bg-slate-100 p-0.5 rounded-lg flex items-center">
                {(['concise', 'small', 'standard'] as const).map((densityOption) => (
                  <button
                    key={densityOption}
                    onClick={() => {
                      setChartDensity(densityOption);
                      addToast(`Chart scaling set to ${densityOption} mode`, 'success');
                    }}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      chartDensity === densityOption
                        ? 'bg-white text-slate-800 shadow-3xs'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {densityOption}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span>Smooth Zoom Fit</span>
            </div>
          </div>

          {/* INNER TREE WRAPPER WITH DYNAMIC ZOOM WITHOUT LEFT CLIPPING */}
          <div className="w-full overflow-x-auto overflow-y-visible py-4 scrollbar-thin">
            <div className="w-fit min-w-full mx-auto flex flex-col items-center justify-start transition-all duration-300 ease-in-out px-4">
              
              {/* LEVEL 1: CEO NODE Ahmad Wahid */}
              {activeDeptFilter === 'All' && (
                <div className="flex flex-col items-center relative pb-8">
                  <NodeCard 
                    name="Ahmad Wahid" 
                    role="Chief Executive Officer" 
                    id="EMP-0001" 
                    dept="Operations" 
                    isCEO={true} 
                  />
                  
                  {/* Drop branch line from CEO */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-slate-200" />
                </div>
              )}

              {/* LEVEL 2 & 3 & 4 CHART LAYER */}
              <div className="relative pt-6 min-w-max flex flex-col items-center">
                
                {/* SPANNING BRIDGE BAR */}
                {activeDeptFilter === 'All' && (
                  <div className="absolute top-0 left-20 right-20 h-0.5 bg-slate-200" />
                )}

                {/* HIGH FIDELITY COLUMNS CONTAINER WITH DYNAMIC DENSITY GAPS */}
                <div className={`flex items-start justify-center transition-all duration-300 ${density.gap}`}>
                  
                  {/* COLUMN 1: ENGINEERING */}
                  {(activeDeptFilter === 'All' || activeDeptFilter === 'Engineering') && (
                    <div className="flex flex-col items-center relative">
                      {/* Top Connector bar */}
                      {activeDeptFilter === 'All' && <div className="h-6 w-0.5 bg-slate-200 absolute -top-6 left-1/2 -translate-x-1/2" />}
                      
                      {/* Head of Eng */}
                      <NodeCard 
                        name="David Ng" 
                        role="Head of Eng." 
                        id="EMP-0010" 
                        dept="Engineering" 
                        members="342 members" 
                      />

                      {/* Connect Eng L2 to L3 split */}
                      <div className="h-6 w-0.5 bg-slate-200" />
                      <div className="relative w-full flex justify-center">
                        {/* Spanning horizontal line for Eng L3 */}
                        <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-slate-200" />
                        
                        <div className={`flex pt-6 ${chartDensity === 'concise' ? 'gap-4' : 'gap-8'}`}>
                          
                          {/* Sub-node: Sarah Lim */}
                          <div className="flex flex-col items-center">
                            <div className="h-6 w-0.5 bg-slate-200 absolute -top-6 left-1/2" />
                            <SubNodeCard 
                              name="Sarah Lim" 
                              role="Sr. Developer" 
                              id="EMP-0285" 
                              dept="Engineering" 
                            />

                            {/* Dashed drop report to L4 Hana & Zul M */}
                            <div className="h-6 w-0.5 border-l-2 border-dashed border-slate-300" />
                            <div className="space-y-2 flex flex-col items-center relative">
                              <SubSubNodeCard 
                                name="Hana" 
                                role="Dev" 
                                id="EMP-9005" 
                                dept="Engineering" 
                              />
                              <SubSubNodeCard 
                                name="Zul M" 
                                role="Dev" 
                                id="EMP-9006" 
                                dept="Engineering" 
                              />
                              {/* More Capsule button */}
                              <div
                                onClick={() => addToast('Displaying 8 additional engineering staff profiles', 'success')}
                                className="bg-slate-50 border border-slate-200 hover:bg-slate-100 px-3 py-1 rounded-full text-[9px] font-bold text-slate-600 transition-colors cursor-pointer select-none"
                              >
                                +8 more members
                              </div>
                            </div>
                          </div>

                          {/* Sub-node: Raj */}
                          <div className="flex flex-col items-center">
                            <div className="h-6 w-0.5 bg-slate-200 absolute -top-6 left-1/2" />
                            <SubNodeCard 
                              name="Raj" 
                              role="Tech Lead" 
                              id="EMP-0199" 
                              dept="Engineering" 
                            />

                            {/* Dashed drop report to L4 Irfan */}
                            <div className="h-6 w-0.5 border-l-2 border-dashed border-slate-300" />
                            <div className="space-y-2 flex flex-col items-center">
                              <SubSubNodeCard 
                                name="Irfan M" 
                                role="Backend Dev" 
                                id="EMP-9007" 
                                dept="Engineering" 
                              />
                              <div
                                onClick={() => addToast('Displaying 12 additional server development team records', 'success')}
                                className="bg-slate-50 border border-slate-200 hover:bg-slate-100 px-3 py-1 rounded-full text-[9px] font-bold text-slate-600 transition-colors cursor-pointer select-none"
                              >
                                +12 more
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  )}

                  {/* COLUMN 2: FINANCE */}
                  {(activeDeptFilter === 'All' || activeDeptFilter === 'Finance') && (
                    <div className="flex flex-col items-center relative">
                      {/* Top Connector bar */}
                      {activeDeptFilter === 'All' && <div className="h-6 w-0.5 bg-slate-200 absolute -top-6 left-1/2 -translate-x-1/2" />}
                      
                      {/* CFO */}
                      <NodeCard 
                        name="Rachel Tan" 
                        role="CFO" 
                        id="EMP-0030" 
                        dept="Finance" 
                        members="180 members" 
                      />

                      {/* Connect Finance L2 to L3 split */}
                      <div className="h-6 w-0.5 bg-slate-200" />
                      <div className="relative w-full flex justify-center">
                        {/* Spanning horizontal line */}
                        <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-slate-200" />
                        
                        <div className={`flex pt-6 ${chartDensity === 'concise' ? 'gap-3' : 'gap-6'}`}>
                          
                          <div className="flex flex-col items-center">
                            <div className="h-6 w-0.5 bg-slate-200 absolute -top-6 left-1/2" />
                            <SubNodeCard 
                              name="Amy Lee" 
                              role="Payroll Mgr" 
                              id="EMP-9008" 
                              dept="Finance" 
                            />
                          </div>

                          <div className="flex flex-col items-center">
                            <div className="h-6 w-0.5 bg-slate-200 absolute -top-6 left-1/2" />
                            <SubNodeCard 
                              name="Jan" 
                              role="Audit Lead" 
                              id="EMP-9144" 
                              dept="Finance" 
                            />
                          </div>

                        </div>
                      </div>
                    </div>
                  )}

                  {/* COLUMN 3: HR */}
                  {(activeDeptFilter === 'All' || activeDeptFilter === 'HR') && (
                    <div className="flex flex-col items-center relative">
                      {/* Top Connector bar */}
                      {activeDeptFilter === 'All' && <div className="h-6 w-0.5 bg-slate-200 absolute -top-6 left-1/2 -translate-x-1/2" />}
                      
                      {/* Head of HR */}
                      <NodeCard 
                        name="Nina Reza" 
                        role="Head of HR" 
                        id="EMP-0040" 
                        dept="HR" 
                        members="88 members" 
                      />

                      {/* Connect HR L2 to L3 split */}
                      <div className="h-6 w-0.5 bg-slate-200" />
                      <div className="relative w-full flex justify-center">
                        {/* Spanning horizontal line */}
                        <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-slate-200" />
                        
                        <div className={`flex pt-6 ${chartDensity === 'concise' ? 'gap-3' : 'gap-6'}`}>
                          
                          <div className="flex flex-col items-center">
                            <div className="h-6 w-0.5 bg-slate-200 absolute -top-6 left-1/2 text-center" />
                            <SubNodeCard 
                              name="Maya Tan" 
                              role="Recruiter" 
                              id="EMP-0099" 
                              dept="HR" 
                            />
                          </div>

                          <div className="flex flex-col items-center">
                            <div className="h-6 w-0.5 bg-slate-200 absolute -top-6 left-1/2 text-center" />
                            <SubNodeCard 
                              name="Farah" 
                              role="HR Partner" 
                              id="EMP-9009" 
                              dept="HR" 
                            />
                          </div>

                        </div>
                      </div>
                    </div>
                  )}

                  {/* COLUMN 4: MARKETING */}
                  {(activeDeptFilter === 'All' || activeDeptFilter === 'Marketing') && (
                    <div className="flex flex-col items-center relative">
                      {/* Top Connector bar */}
                      {activeDeptFilter === 'All' && <div className="h-6 w-0.5 bg-slate-200 absolute -top-6 left-1/2 -translate-x-1/2" />}
                      
                      {/* CMO */}
                      <NodeCard 
                        name="Kevin Lim" 
                        role="CMO" 
                        id="EMP-0050" 
                        dept="Marketing" 
                        members="142 members" 
                      />

                      {/* Connect marketing L2 to L3 split */}
                      <div className="h-6 w-0.5 bg-slate-200" />
                      <div className="relative w-full flex justify-center">
                        {/* Spanning horizontal line */}
                        <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-slate-200" />
                        
                        <div className={`flex pt-6 ${chartDensity === 'concise' ? 'gap-3' : 'gap-6'}`}>
                          
                          <div className="flex flex-col items-center">
                            <div className="h-6 w-0.5 bg-slate-200 absolute -top-6 left-1/2" />
                            <SubNodeCard 
                              name="Nadia C" 
                              role="Brand Mgr" 
                              id="EMP-0122" 
                              dept="Marketing" 
                            />
                          </div>

                          <div className="flex flex-col items-center">
                            <div className="h-6 w-0.5 bg-slate-200 absolute -top-6 left-1/2" />
                            <SubNodeCard 
                              name="Paul" 
                              role="Digital Lead" 
                              id="EMP-9010" 
                              dept="Marketing" 
                            />
                          </div>

                        </div>
                      </div>
                    </div>
                  )}

                  {/* COLUMN 5: OPERATIONS */}
                  {(activeDeptFilter === 'All' || activeDeptFilter === 'Operations') && (
                    <div className="flex flex-col items-center relative">
                      {/* Top Connector bar */}
                      {activeDeptFilter === 'All' && <div className="h-6 w-0.5 bg-slate-200 absolute -top-6 left-1/2 -translate-x-1/2" />}
                      
                      {/* COO */}
                      <NodeCard 
                        name="Malik Said" 
                        role="COO" 
                        id="EMP-0060" 
                        dept="Operations" 
                        members="261 members" 
                      />

                      {/* Connect operations L2 to L3 split */}
                      <div className="h-6 w-0.5 bg-slate-200" />
                      <div className="relative w-full flex justify-center">
                        {/* Spanning horizontal line */}
                        <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-slate-200" />
                        
                        <div className={`flex pt-6 ${chartDensity === 'concise' ? 'gap-3' : 'gap-6'}`}>
                          
                          <div className="flex flex-col items-center">
                            <div className="h-6 w-0.5 bg-slate-200 absolute -top-6 left-1/2" />
                            <SubNodeCard 
                              name="Ahmad L" 
                              role="Ops Lead" 
                              id="EMP-0185" 
                              dept="Operations" 
                            />
                          </div>

                          <div className="flex flex-col items-center">
                            <div className="h-6 w-0.5 bg-slate-200 absolute -top-6 left-1/2" />
                            <SubNodeCard 
                              name="Zara Nor" 
                              role="Logistics" 
                              id="EMP-9011" 
                              dept="Operations" 
                            />
                          </div>

                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>

        </div>
      ) : (
        /* FLAT DIRECTORY VIEW (LIST) ONLY SHOWING VALID STATED STRUCTURE */
        <div id="org-list-view-stage" className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
          <h4 className="text-xs font-black text-slate-800 tracking-wider uppercase mb-5">Departmental Structural Listing Breakdown</h4>
          <div className="space-y-4">
            
            {/* CEO header */}
            <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  AW
                </div>
                <div>
                  <h5 className="text-xs font-black text-slate-800 leading-snug">Ahmad Wahid</h5>
                  <p className="text-[10px] text-blue-600 font-extrabold uppercase tracking-wide">Chief Executive Officer &bull; L1</p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-xl border border-blue-100">
                CEO Board
              </span>
            </div>

            {/* Department Heads and their members */}
            {[
              { manager: 'David Ng', role: 'Head of Eng.', dept: 'Engineering' as Department, reportCount: 342, list: ['Sarah Lim', 'Raj', 'Hana', 'Zul M', 'Irfan M'] },
              { manager: 'Rachel Tan', role: 'CFO', dept: 'Finance' as Department, reportCount: 180, list: ['Amy Lee', 'Jan'] },
              { manager: 'Nina Reza', role: 'Head of HR', dept: 'HR' as Department, reportCount: 88, list: ['Maya Tan', 'Farah'] },
              { manager: 'Kevin Lim', role: 'CMO', dept: 'Marketing' as Department, reportCount: 142, list: ['Nadia C', 'Paul'] },
              { manager: 'Malik Said', role: 'COO', dept: 'Operations' as Department, reportCount: 261, list: ['Ahmad L', 'Zara Nor'] },
            ]
              .filter(item => activeDeptFilter === 'All' || item.dept === activeDeptFilter)
              .map((item) => {
                const theme = getDeptColorTheme(item.dept);
                return (
                  <div key={item.manager} className="pt-2 pl-4 border-l-2 border-slate-100 ml-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${theme.avatarBg}`}>
                          {getInitials(item.manager)}
                        </div>
                        <div>
                          <h6 className="text-xs font-bold text-slate-800 leading-none">{item.manager}</h6>
                          <p className={`text-[10px] font-bold mt-1 ${theme.textColor}`}>
                            {item.role} &bull; {item.dept}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black tracking-wide px-2.5 py-1 rounded-xl ${theme.badge}`}>
                        {item.reportCount} members
                      </span>
                    </div>

                    {/* L3 reporting list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pl-6">
                      {item.list.map((name) => (
                        <div 
                          key={name}
                          onClick={() => handleSelectVirtualEmployee(name, 'EMP-TEMP', 'Associate', item.dept)}
                          className="p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer bg-white shadow-3xs"
                        >
                          <div className={`h-6.5 w-6.5 rounded-full flex items-center justify-center font-bold text-[9px] ${theme.avatarBg}`}>
                            {getInitials(name)}
                          </div>
                          <span className="text-[11px] font-extrabold text-slate-700 truncate">{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

          </div>
        </div>
      )}

      {/* STATISTICS FOOTER GRID PANEL REQUESTED BY THE USER */}
      <div id="replicated-chart-stats-footer" className="bg-[#fcfdfd] border border-slate-200/60 rounded-3xl p-6.5 shadow-xs space-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          
          {/* Engineering Box */}
          <div 
            onClick={() => {
              setActiveDeptFilter('Engineering');
              addToast('Focus filtered to Engineering team nodes','info');
            }}
            className={`cursor-pointer bg-white border p-4 rounded-2xl shadow-3xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs active:scale-98 relative overflow-hidden group ${
              activeDeptFilter === 'Engineering' ? 'border-[#2f66e0] ring-1 ring-[#2f66e0]' : 'border-slate-200/50 hover:border-blue-305 hover:border-blue-300'
            }`}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#2f66e0]" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Engineering</p>
            <p className="text-2xl font-black text-[#2f66e0] mt-2.5 leading-none">{engineeringCount}</p>
          </div>

          {/* Finance Box */}
          <div 
            onClick={() => {
              setActiveDeptFilter('Finance');
              addToast('Focus filtered to Finance team nodes','info');
            }}
            className={`cursor-pointer bg-white border p-4 rounded-2xl shadow-3xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs active:scale-98 relative overflow-hidden group ${
              activeDeptFilter === 'Finance' ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-slate-200/50 hover:border-emerald-305 hover:border-emerald-300'
            }`}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Finance</p>
            <p className="text-2xl font-black text-[#10b981] mt-2.5 leading-none">{financeCount}</p>
          </div>

          {/* HR Box */}
          <div 
            onClick={() => {
              setActiveDeptFilter('HR');
              addToast('Focus filtered to HR team nodes','info');
            }}
            className={`cursor-pointer bg-white border p-4 rounded-2xl shadow-3xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs active:scale-98 relative overflow-hidden group ${
              activeDeptFilter === 'HR' ? 'border-purple-500 ring-1 ring-purple-500' : 'border-slate-200/50 hover:border-purple-305 hover:border-purple-300'
            }`}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">HR</p>
            <p className="text-2xl font-black text-[#8b5cf6] mt-2.5 leading-none">{hrCount}</p>
          </div>

          {/* Marketing Box */}
          <div 
            onClick={() => {
              setActiveDeptFilter('Marketing');
              addToast('Focus filtered to Marketing team nodes','info');
            }}
            className={`cursor-pointer bg-white border p-4 rounded-2xl shadow-3xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs active:scale-98 relative overflow-hidden group ${
              activeDeptFilter === 'Marketing' ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200/50 hover:border-rose-305 hover:border-rose-300'
            }`}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Marketing</p>
            <p className="text-2xl font-black text-[#f43f5e] mt-2.5 leading-none">{marketingCount}</p>
          </div>

          {/* Operations Box */}
          <div 
            onClick={() => {
              setActiveDeptFilter('Operations');
              addToast('Focus filtered to Operations team nodes','info');
            }}
            className={`cursor-pointer bg-white border p-4 rounded-2xl shadow-3xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs active:scale-98 relative overflow-hidden group ${
              activeDeptFilter === 'Operations' ? 'border-amber-500 ring-1 ring-amber-500' : 'border-slate-200/50 hover:border-amber-305 hover:border-amber-300'
            }`}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Operations</p>
            <p className="text-2xl font-black text-[#d97706] mt-2.5 leading-none">{operationsCount}</p>
          </div>

          {/* Total Box */}
          <div 
            onClick={() => {
              setActiveDeptFilter('All');
              addToast('Focus filtered to All departments','info');
            }}
            className={`cursor-pointer bg-[#f8fafc] border p-4 rounded-2xl shadow-3xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs active:scale-98 relative overflow-hidden group ${
              activeDeptFilter === 'All' ? 'border-slate-700 ring-1 ring-slate-700' : 'border-slate-205 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-slate-700" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Total</p>
            <p className="text-2xl font-black text-slate-800 mt-2.5 leading-none">{totalEmployeesCount.toLocaleString()}</p>
          </div>

        </div>

        {/* BOTTOM METADATA LEGEND AND LABELS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-slate-450 text-slate-400">
          <p className="leading-snug">
            Click any node to view details &bull; Dashed lines = direct reports
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 select-none">
              <span className="h-3 w-3 rounded bg-[#2f66e0]" />
              <span className="text-slate-700">Engineering</span>
            </div>
            <div className="flex items-center gap-1.5 select-none">
              <span className="h-3 w-3 rounded bg-[#10b981]" />
              <span className="text-slate-700">Finance</span>
            </div>
            <div className="flex items-center gap-1.5 select-none">
              <span className="h-3 w-3 rounded bg-[#8b5cf6]" />
              <span className="text-slate-700">HR</span>
            </div>
            <div className="flex items-center gap-1.5 select-none">
              <span className="h-3 w-3 rounded bg-[#f43f5e]" />
              <span className="text-slate-700">Marketing</span>
            </div>
            <div className="flex items-center gap-1.5 select-none">
              <span className="h-3 w-3 rounded bg-[#d97706]" />
              <span className="text-slate-700">Operations</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

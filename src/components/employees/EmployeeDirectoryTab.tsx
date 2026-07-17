import { useState } from 'react'
import { Search, UserPlus, ArrowUpRight, Filter, ClipboardList } from 'lucide-react';
import type { ModuleEmployee } from '../../types/moduleEmployee'

type EmployeeDirectoryTabProps = {
  employees: ModuleEmployee[]
  onSelectEmployee: (emp: ModuleEmployee) => void
  onOpenAddModal: () => void
  searchValue: string
  onSearchValueChange: (val: string) => void
}

export function EmployeeDirectoryTab({
  employees,
  onSelectEmployee,
  onOpenAddModal,
  searchValue,
  onSearchValueChange,
}: EmployeeDirectoryTabProps) {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const departments: string[] = ['All', 'Engineering', 'Finance', 'HR', 'Marketing', 'Operations'];

  // Filter based on search input and selected department
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchValue.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchValue.toLowerCase());

    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div id="employee-directory-tab-container" className="space-y-5">
      {/* Search & Bulk Action Filters Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-3.5 flex-1">
          {/* Quick Search */}
          <div className="relative flex-1 max-w-sm">
            <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </span>
            <input
              id="directory-search-input"
              type="text"
              placeholder="Search employee by name, ID or position..."
              value={searchValue}
              onChange={(e) => onSearchValueChange(e.target.value)}
              className="w-full text-xs text-slate-700 bg-slate-50/50 border border-slate-200/80 focus:border-blue-500 focus:bg-white focus:outline-none py-2 pl-10 pr-4 rounded-xl transition-all"
            />
          </div>

          {/* Department Quick Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 focus:outline-none px-2 py-2 rounded-lg"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept} {dept !== 'All' ? 'Dept' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Create/Add CTAs */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            id="directory-add-employee-btn"
            onClick={onOpenAddModal}
            className="bg-[#2f66e0] hover:bg-opacity-90 font-bold text-xs text-white px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Directory Table Grid Card */}
      <div id="directory-table-card" className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4.5 px-6">Employee No.</th>
                <th className="py-4.5 px-6">Name</th>
                <th className="py-4.5 px-6">Department</th>
                <th className="py-4.5 px-6">Position</th>
                <th className="py-4.5 px-6">Status</th>
                <th className="py-4.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50/60">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr
                    id={`row-${emp.id}`}
                    key={emp.id}
                    onClick={() => onSelectEmployee(emp)}
                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  >
                    {/* Employee No. */}
                    <td className="py-4 px-6 text-xs font-bold text-slate-500 font-mono tracking-tight">
                      {emp.id}
                    </td>

                    {/* Name */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs ${emp.avatarColor}`}>
                          {getInitials(emp.name)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors">
                            {emp.name}
                          </p>
                          <p className="text-[10.5px] text-slate-400 mt-0.5 font-medium">Joined {emp.joinDate}</p>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-4 px-6">
                      <span className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-100 rounded-lg px-2 py-1">
                        {emp.department}
                      </span>
                    </td>

                    {/* Position */}
                    <td className="py-4 px-6 text-xs font-bold text-slate-600">
                      {emp.position}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        emp.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/50'
                          : 'bg-amber-50 text-amber-700 border border-amber-100/50'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${emp.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {emp.status}
                      </span>
                    </td>

                    {/* Action button */}
                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        id={`btn-open-${emp.id}`}
                        onClick={() => onSelectEmployee(emp)}
                        className="text-xs font-bold text-[#2f66e0] bg-[#2f66e0]/5 border border-[#2f66e0]/10 hover:bg-[#2f66e0] hover:text-white px-3 py-1.5 rounded-lg transition-all inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Open</span>
                        <ArrowUpRight className="h-3 w-3 shrink-0" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <ClipboardList className="h-10 w-10 text-slate-200 mb-3" />
                      <p className="text-slate-500 text-xs font-semibold">No Employee Records Found</p>
                      <p className="text-slate-400 text-[11px] mt-1">Try modifying your search or choosing a different department filter.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

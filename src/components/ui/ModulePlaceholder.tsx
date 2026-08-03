import { LayoutDashboard, ExternalLink } from 'lucide-react'
import type { SidebarTab } from '@/types'

interface ModulePlaceholderProps {
  moduleName: SidebarTab
  onNavigateEmployees: () => void
}

/** Temporary screen for modules not yet ported from the reference app. */
export default function ModulePlaceholder({
  moduleName,
  onNavigateEmployees,
}: ModulePlaceholderProps) {
  return (
    <div id="module-coming-soon" className="space-y-6">
      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xs max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-[#2f66e0]">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 tracking-tight">{moduleName}</h3>
            <p className="text-[11px] font-semibold text-slate-400 mt-1">
              Module not ported yet — coming in a later piece
            </p>
          </div>
        </div>

        <p className="text-slate-500 text-xs font-medium leading-relaxed mb-4">
          This screen still lives in the reference app. We are porting modules into{' '}
          <code className="text-[#2f66e0]">novora_frontend</code> one piece at a time. Dashboard and
          Employees Management are ready now.
        </p>

        <button
          onClick={onNavigateEmployees}
          className="bg-[#2f66e0] hover:bg-opacity-95 text-white font-bold text-xs px-4.5 py-2 rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Go to Employees Management</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

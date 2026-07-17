import { RecruitmentTab } from '../components/recruitment/RecruitmentTab'
import { showActionToast } from '../utils/actionToast'
import type { ModuleEmployee } from '../types/moduleEmployee'

export function RecruitmentPage() {
  return (
    <RecruitmentTab
      onAddEmployeeAsRecord={(emp: ModuleEmployee) => {
        showActionToast(`${emp.name} added to employee records`)
      }}
    />
  )
}

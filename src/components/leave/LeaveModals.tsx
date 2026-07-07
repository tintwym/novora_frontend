import { useState } from 'react'
import { HrField, HrFieldRow, HrInput, HrModal, HrSelect } from '../hr/HrModal'
import { LEAVE_COLOR_SWATCHES } from '../../data/mockLeave'

type ModalProps = { open: boolean; onClose: () => void }

function LeaveModalIcon({ name }: { name: 'gear' | 'document' }) {
  if (name === 'gear') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
        <path
          d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export function ConfigureLeaveTypeModal({ open, onClose, existingName }: ModalProps & { existingName?: string }) {
  const [colorIdx, setColorIdx] = useState(0)

  return (
    <HrModal
      open={open}
      title="Configure Leave Type"
      icon={<LeaveModalIcon name="gear" />}
      confirmLabel={existingName ? 'Save Changes' : 'Create Type'}
      onClose={onClose}
      onConfirm={onClose}
    >
      <HrField label="Leave type name">
        <HrInput placeholder="e.g. Compassionate leave" defaultValue={existingName} />
      </HrField>
      <HrFieldRow>
        <HrField label="Paid class">
          <HrSelect defaultValue="Paid leave">
            <option>Paid leave</option>
            <option>Unpaid leave</option>
          </HrSelect>
        </HrField>
        <HrField label="Deduction rate">
          <HrSelect defaultValue="No deduction">
            <option>No deduction</option>
            <option>Normal rate</option>
          </HrSelect>
        </HrField>
      </HrFieldRow>
      <HrFieldRow>
        <HrField label="Hour based?">
          <HrSelect defaultValue="No (Fixed days)">
            <option>No (Fixed days)</option>
            <option>Yes (Hourly credit)</option>
          </HrSelect>
        </HrField>
        <HrField label="Attachment req.?">
          <HrSelect defaultValue="No (None)">
            <option>No (None)</option>
            <option>Yes (Mandatory upload)</option>
          </HrSelect>
        </HrField>
      </HrFieldRow>
      <div className="leave-color-field">
        <span>THEME BADGE ACCENT COLOR</span>
        <div className="leave-color-swatches">
          {LEAVE_COLOR_SWATCHES.map((c, i) => (
            <button
              key={c}
              type="button"
              className={colorIdx === i ? 'active' : ''}
              style={{ background: c, borderColor: colorIdx === i ? c : 'transparent' }}
              onClick={() => setColorIdx(i)}
              aria-label={`Color ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </HrModal>
  )
}

export function CreateLeavePolicyModal({ open, onClose }: ModalProps) {
  const [includeBonus, setIncludeBonus] = useState(true)

  return (
    <HrModal
      open={open}
      title="CREATE NEW LEAVE POLICY"
      icon={<LeaveModalIcon name="document" />}
      confirmLabel="Create & Apply Policy"
      onClose={onClose}
      onConfirm={onClose}
      wide
    >
      <HrFieldRow>
        <HrField label="Leave type">
          <HrSelect defaultValue="Annual leave">
            <option>Annual leave</option>
            <option>Medical leave</option>
            <option>Emergency leave</option>
            <option>Unpaid leave</option>
            <option>Replacement leave</option>
            <option>Maternity leave</option>
            <option>Hour leave</option>
            <option>Custom Policy Group</option>
          </HrSelect>
        </HrField>
        <HrField label="Allow days limit">
          <HrInput defaultValue="12 days / year" />
        </HrField>
      </HrFieldRow>
      <HrFieldRow>
        <HrField label="Accrual method">
          <HrSelect defaultValue="Monthly prorate">
            <option>Monthly prorate</option>
            <option>Full upfront</option>
            <option>Quarterly accrual</option>
            <option>Bi-weekly incremental</option>
          </HrSelect>
        </HrField>
        <HrField label="Carry forward">
          <HrInput defaultValue="5 days max" />
        </HrField>
      </HrFieldRow>
      <HrFieldRow>
        <HrField label="Applicable to">
          <HrInput defaultValue="All confirmed employees" />
        </HrField>
        <HrField label="Auto attachment setup">
          <HrInput defaultValue="12 months" />
        </HrField>
      </HrFieldRow>
      <HrField label="Minimum working days (requirement)">
        <HrInput defaultValue="15 days" />
      </HrField>
      <div className="leave-policy-box">
        <div className="leave-policy-box-head">
          <strong>INCLUDE SERVICE LEAVE BONUS</strong>
          <input type="checkbox" checked={includeBonus} onChange={(e) => setIncludeBonus(e.target.checked)} />
        </div>
        {includeBonus ? (
          <HrFieldRow>
            <HrField label="Service range">
              <HrInput defaultValue="3-5 years service" />
            </HrField>
            <HrField label="Leave bonus">
              <HrInput defaultValue="+2 days" />
            </HrField>
          </HrFieldRow>
        ) : null}
      </div>
      <div className="leave-policy-box purple">
        <strong>RULE & HOLIDAY CONDITIONS</strong>
        <HrFieldRow>
          <HrField label="Rule description key">
            <HrInput defaultValue="Count off / holidays" />
          </HrField>
          <HrField label="Rule enforcement value">
            <HrInput defaultValue="Excluded" />
          </HrField>
        </HrFieldRow>
      </div>
    </HrModal>
  )
}

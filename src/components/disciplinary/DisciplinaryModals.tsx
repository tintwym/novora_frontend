import { useState } from 'react'
import { HrField, HrFieldRow, HrInput, HrModal, HrSelect, HrTextarea } from '../hr/HrModal'

type ModalProps = { open: boolean; onClose: () => void }

function DiscModalIcon({ name }: { name: 'plus' | 'scales' | 'shield' }) {
  if (name === 'plus') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.12" />
        <path d="M12 8v8M8 12h8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
  if (name === 'scales') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M12 3v18M5 7h14M7 7l-3 6h6L7 7zM17 7l-3 6h6l-3-6z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8v4M12 16h.01" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export function AddDisciplinaryReasonModal({ open, onClose }: ModalProps) {
  return (
    <HrModal
      open={open}
      title="ADD NEW DISCIPLINARY REASON"
      icon={<DiscModalIcon name="plus" />}
      confirmLabel="Save Reason"
      onClose={onClose}
      onConfirm={onClose}
    >
      <HrField label="Reason name">
        <HrInput placeholder="e.g. Failure to report asset damage" />
      </HrField>
      <HrField label="Severity category">
        <HrSelect defaultValue="Minor">
          <option>Minor</option>
          <option>Major</option>
          <option>Gross misconduct</option>
        </HrSelect>
      </HrField>
      <HrField label="Description">
        <HrTextarea rows={4} placeholder="Provide precise details of the default code infraction..." />
      </HrField>
    </HrModal>
  )
}

export function EditDisciplinaryReasonModal({
  open,
  onClose,
  name = 'Unauthorised absence',
  severity = 'Minor',
  status = 'Active',
  description = 'Absent without prior approval or valid medical reason.',
}: ModalProps & { name?: string; severity?: string; status?: string; description?: string }) {
  return (
    <HrModal
      open={open}
      title="EDIT DISCIPLINARY REASON"
      icon={<DiscModalIcon name="scales" />}
      confirmLabel="Save Updates"
      onClose={onClose}
      onConfirm={onClose}
    >
      <HrField label="Reason name">
        <HrInput defaultValue={name} />
      </HrField>
      <HrField label="Severity category">
        <HrSelect defaultValue={severity}>
          <option>Minor</option>
          <option>Major</option>
          <option>Gross misconduct</option>
        </HrSelect>
      </HrField>
      <HrField label="Status">
        <HrSelect defaultValue={status}>
          <option>Active</option>
          <option>Inactive</option>
        </HrSelect>
      </HrField>
      <HrField label="Description">
        <HrTextarea rows={4} defaultValue={description} />
      </HrField>
    </HrModal>
  )
}

export function AddWarningParameterModal({ open, onClose }: ModalProps) {
  return (
    <HrModal
      open={open}
      title="ADD WARNING PARAMETER"
      icon={<DiscModalIcon name="plus" />}
      confirmLabel="Create Parameter"
      onClose={onClose}
      onConfirm={onClose}
    >
      <HrFieldRow>
        <HrField label="Level code">
          <HrInput placeholder="e.g. L7" />
        </HrField>
        <HrField label="Action name">
          <HrInput placeholder="e.g. Official Reprimand" />
        </HrField>
      </HrFieldRow>
      <HrField label="Type">
        <HrInput placeholder="e.g. Dismissal / Grade change / Suspension" />
      </HrField>
      <HrField label="Pay impact level">
        <HrSelect defaultValue="No deduction">
          <option>No deduction</option>
          <option>Partial deduction</option>
          <option>Full deduction</option>
          <option>Pay review</option>
        </HrSelect>
      </HrField>
      <HrField label="Description / details">
        <HrTextarea rows={4} placeholder="Details of warning action parameters..." />
      </HrField>
    </HrModal>
  )
}

export function EditWarningParameterModal({
  open,
  onClose,
  level = 'L1',
  name = 'Verbal warning',
  type = 'Verbal',
  payImpact = 'No deduction',
  description = 'Informal verbal caution, not recorded on employee file permanently.',
}: ModalProps & { level?: string; name?: string; type?: string; payImpact?: string; description?: string }) {
  return (
    <HrModal
      open={open}
      title="EDIT WARNING PARAMETER"
      icon={<DiscModalIcon name="shield" />}
      confirmLabel="Save Updates"
      onClose={onClose}
      onConfirm={onClose}
    >
      <HrFieldRow>
        <HrField label="Level code">
          <HrInput defaultValue={level} readOnly />
        </HrField>
        <HrField label="Action name">
          <HrInput defaultValue={name} />
        </HrField>
      </HrFieldRow>
      <HrField label="Type">
        <HrInput defaultValue={type} />
      </HrField>
      <HrField label="Pay impact level">
        <HrSelect defaultValue={payImpact}>
          <option>No deduction</option>
          <option>Partial deduction</option>
          <option>Full deduction</option>
          <option>Pay review</option>
        </HrSelect>
      </HrField>
      <HrField label="Description / details">
        <HrTextarea rows={4} defaultValue={description} />
      </HrField>
    </HrModal>
  )
}

export function ViewDisciplinaryRecordModal({ open, onClose, employee = 'Ahmad Luqman' }: ModalProps & { employee?: string }) {
  const [resolution, setResolution] = useState('pending')

  return (
    <div className={open ? 'disc-dossier-overlay' : 'disc-dossier-overlay hidden'} role="presentation" onClick={onClose}>
      <div className="disc-dossier-modal" role="dialog" aria-modal onClick={(e) => e.stopPropagation()}>
        <div className="disc-dossier-head">
          <span className="disc-dossier-badge">Dossier Archive: DISC-2026-001</span>
          <button type="button" className="disc-dossier-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <h2>Corporate Disciplinary Record</h2>
        <div className="disc-dossier-summary">
          <div>
            <span>EMPLOYEE TARGET</span>
            <strong>{employee}</strong>
            <em>ID: EMP-0285 • Dept: Operations</em>
          </div>
          <div>
            <span>ACTION ISSUED BY</span>
            <strong>Nina Reza (Head of HR)</strong>
            <em>Date of Action: 2026-05-07</em>
          </div>
        </div>
        <div className="disc-dossier-grid">
          <DossierKv label="Offence category" value="Unauthorised absence" link />
          <DossierKv label="Incident date" value="2026-05-06" />
          <DossierKv label="Timing scope" value="09:30 AM - 10:00 AM" />
          <DossierKv label="Location of infraction" value="HQ, Level 3" />
        </div>
        <div className="disc-dossier-block">
          <span>BEHAVIORAL LOG DESCRIPTION</span>
          <p>Unauthorised absence from primary station without notice or medical cert.</p>
        </div>
        <DossierKv label="Registered witness list" value="Zara Nor" />
        <DossierKv label="Warning level applied" value="L1 — Verbal warning" chip />
        <DossierKv label="If repeated next impact" value="First written warning" danger />
        <div className="disc-dossier-expect">
          <span>STATEMENT OF EXPECTATION & REMEDIATION</span>
          <em>Caution note and expected attendance improvement.</em>
        </div>
        <div className="disc-dossier-foot">
          <div>
            <strong>Update Dossier Resolution:</strong>
            <div className="disc-segmented">
              {(['pending', 'acknowledged', 'closed'] as const).map((r) => (
                <button key={r} type="button" className={resolution === r ? 'active' : ''} onClick={() => setResolution(r)}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <button type="button" className="disc-navy-btn" onClick={onClose}>
            Close Dossier File
          </button>
        </div>
      </div>
    </div>
  )
}

function DossierKv({ label, value, link, chip, danger }: { label: string; value: string; link?: boolean; chip?: boolean; danger?: boolean }) {
  return (
    <div className="disc-dossier-kv">
      <span>{label}</span>
      {chip ? (
        <span className="disc-chip-warning">{value}</span>
      ) : (
        <strong className={link ? 'tone-primary' : danger ? 'tone-danger' : ''}>{value}</strong>
      )}
    </div>
  )
}

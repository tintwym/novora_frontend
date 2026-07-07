import { HrField, HrFieldRow, HrInput, HrModal, HrSelect } from '../hr/HrModal'
import { VALIDATION_RULES } from '../../data/mockClaims'
import type { ClaimViewData } from '../../types/claims'
import { RecruitPill } from '../recruitment/RecruitmentPrimitives'
import { ClaimIcon } from './ClaimsShared'

type ModalProps = { open: boolean; onClose: () => void }

function ClaimModalIcon({ name }: { name: 'shield' | 'check' | 'gear' }) {
  if (name === 'shield') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 8v4M12 16h.01" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'check') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.12" />
        <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export function EditClaimLimitModal({
  open,
  onClose,
  category = 'Meal allowance',
  daily = 'MYR 30',
  monthly = 'MYR 600',
  receipt = '> MYR 15',
}: ModalProps & { category?: string; daily?: string; monthly?: string; receipt?: string }) {
  return (
    <HrModal
      open={open}
      title={`EDIT LIMIT: ${category.toUpperCase()}`}
      icon={<ClaimModalIcon name="shield" />}
      confirmLabel="Save limits"
      cancelLabel="Close"
      onClose={onClose}
      onConfirm={onClose}
    >
      <p className="claim-modal-desc">
        Update daily allowances and overall monthly thresholds for the selected expense division code. Submissions crossing these boundaries will trigger a flagged warning in manager feeds.
      </p>
      <HrField label="Expense category label">
        <HrInput defaultValue={category} readOnly />
      </HrField>
      <HrFieldRow>
        <HrField label="Daily spent threshold (limit)">
          <HrInput defaultValue={daily} />
        </HrField>
        <HrField label="Monthly allowance cap">
          <HrInput defaultValue={monthly} />
        </HrField>
      </HrFieldRow>
      <HrField label="Receipt requirement rule">
        <HrInput defaultValue={receipt} />
      </HrField>
    </HrModal>
  )
}

export function AutoValidationRulesModal({ open, onClose }: ModalProps) {
  return (
    <HrModal open={open} title="AUTO-VALIDATION CHECKS" icon={<ClaimModalIcon name="check" />} onClose={onClose} wide>
      <p className="claim-modal-desc">
        Management scripts run in real-time immediately when an employee records any receipt item. Toggle or define validation rules below:
      </p>
      <div className="claim-rules-list">
        {VALIDATION_RULES.map((rule) => (
          <div key={rule} className="claim-rule-row">
            <span>{rule}</span>
            <RecruitPill label="Enabled" tone="success" />
          </div>
        ))}
      </div>
      <HrField label="Append custom check criteria">
        <HrInput placeholder="e.g. Flag claims with weekend transactions..." />
      </HrField>
      <div className="claim-modal-foot">
        <button type="button" className="claim-muted-btn">
          Reset Default
        </button>
        <button type="button" className="claim-muted-btn" onClick={onClose}>
          Dismiss
        </button>
      </div>
    </HrModal>
  )
}

export function ApprovalRoutingMatrixModal({ open, onClose }: ModalProps) {
  const tiers = [
    { range: 1, route: 'Sequential', label: 'Claims ≤ MYR 200', logic: 'Direct manager only — single approval' },
    { range: 2, route: 'Sequential', label: 'Claims MYR 201 – MYR 1,000', logic: 'Manager → Department Head' },
    { range: 3, route: 'Parallel with Dept Head', label: 'Claims > MYR 1,000', logic: 'Manager → Dept Head → Finance Director' },
  ]

  return (
    <HrModal open={open} title="TIERED APPROVAL ROUTING MATRIX" icon={<ClaimModalIcon name="gear" />} confirmLabel="Save matrix" onClose={onClose} onConfirm={onClose} wide>
      <p className="claim-modal-desc">
        Configure tier boundaries and approval workflows based on the total claim value (MYR equivalent). Changes will affect any claim submitted from this point onward.
      </p>
      {tiers.map((t) => (
        <div key={t.range} className="claim-matrix-card">
          <div className="claim-matrix-head">
            <RecruitPill label={`Rule Range ${t.range}`} tone="info" />
            <label>
              Route Type:
              <HrSelect defaultValue={t.route}>
                <option>{t.route}</option>
              </HrSelect>
            </label>
          </div>
          <HrFieldRow>
            <HrField label="Claim limits range label">
              <HrInput defaultValue={t.label} />
            </HrField>
            <HrField label="Assigned approval chain logic description">
              <HrInput defaultValue={t.logic} />
            </HrField>
          </HrFieldRow>
        </div>
      ))}
      <button type="button" className="claim-muted-btn">
        Reset Default
      </button>
    </HrModal>
  )
}

export function ViewClaimModal({ open, onClose, claim }: ModalProps & { claim: ClaimViewData }) {
  if (!open) return null

  const approved = claim.status === 'Approved'
  const isoDate = claim.isoDate ?? '2026-05-05'
  const approver = claim.approver ?? 'David Ng'
  const salesTax = (parseFloat(claim.receiptTotal) * 0.06).toFixed(2)

  return (
    <div className="claim-dossier-overlay" role="presentation" onClick={onClose}>
      <div className="claim-dossier-modal" role="dialog" aria-modal onClick={(e) => e.stopPropagation()}>
        <div className="claim-dossier-body">
          <div className="claim-dossier-main">
            <div className="claim-dossier-head">
              <span className="claim-dossier-icon" aria-hidden>
                <ClaimIcon name="receipt" />
              </span>
              <div>
                <span className="claim-dossier-id">TRANSACTION: {claim.id}</span>
                <h2>{claim.name}</h2>
                <p>{claim.department}</p>
              </div>
              <RecruitPill label={claim.status} tone={claim.statusTone} />
            </div>
            <div className="claim-detail-grid">
              <ClaimKv label="Claim date" value={claim.date} />
              <ClaimKv label="Expense category" value={claim.category} />
              <ClaimKv label="Supplier / merchant" value={claim.vendor} />
              <ClaimKv label="Original expense" value={claim.amount} />
              <ClaimKv label="MYR rate equivalent" value={claim.amount} bold />
              <ClaimKv label="Compliance rating" value={claim.compliance} chip />
            </div>
            <div className="claim-intent-box">
              <span>BUSINESS REGISTRATION INTENT</span>
              <p>{claim.intent}</p>
            </div>
            <div className="claim-timeline">
              <span>AUDIT TIMELINE & APPROVAL ROUTE</span>
              <ClaimTimelineStep title="Claim Entry Registered" sub={`${isoDate} 09:00 • Initiated by claimant`} done />
              <ClaimTimelineStep title="Manager Level Assessment" sub={`Assigned Route: ${approver}`} active={!approved} done={approved} />
              <ClaimTimelineStep
                title="Final Ledger Audit & Completion"
                sub={approved ? 'Approved — Queued for month May 2026' : 'Awaiting general finance verify'}
              />
            </div>
          </div>
          <div className="claim-dossier-receipt">
            <div className="claim-receipt-card">
              <strong>*** RECEIPT PROOF ***</strong>
              <em>{claim.receiptVendor}</em>
              <small>KUALA LUMPUR, MALAYSIA</small>
              <hr />
              <ReceiptLine label="DATE" value={isoDate} />
              <ReceiptLine label="TX ID" value={`TXN-${claim.id}`} />
              <ReceiptLine label="CATEGORY" value={claim.category.toUpperCase()} />
              <ReceiptLine label="CURRENCY" value="MYR" />
              <hr />
              <ReceiptLine label="SUB-TOTAL" value={claim.receiptTotal} />
              <ReceiptLine label="SALES TAX (6%)" value={salesTax} />
              <hr />
              <strong>TOTAL AMT: MYR {claim.receiptTotal}</strong>
              <span className="claim-receipt-badge">● RECEIPT SECURELY ATTACHED</span>
            </div>
            <div className="claim-receipt-actions">
              <button type="button" className="claim-outline-btn claim-print-btn">
                <ClaimIcon name="print" />
                Print Receipt
              </button>
              <button type="button" className="claim-navy-btn full" onClick={onClose}>
                Dismiss Record
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ClaimKv({ label, value, bold, chip }: { label: string; value: string; bold?: boolean; chip?: boolean }) {
  return (
    <div className="claim-kv">
      <span>{label}</span>
      {chip ? <RecruitPill label={value} tone="success" /> : <strong className={bold ? 'bold' : ''}>{value}</strong>}
    </div>
  )
}

function ClaimTimelineStep({ title, sub, done, active }: { title: string; sub: string; done?: boolean; active?: boolean }) {
  return (
    <div className={`claim-timeline-step${done ? ' done' : ''}${active ? ' active' : ''}`}>
      <i aria-hidden />
      <div>
        <strong>{title}</strong>
        <em>{sub}</em>
      </div>
    </div>
  )
}

function ReceiptLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="claim-receipt-line">
      <span>{label}</span>
      <em>{value}</em>
    </div>
  )
}

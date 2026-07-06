import { useEffect, useState } from 'react'
import { ALLOWANCE_PAYMENTS, ALLOWANCE_TYPES, TRAVEL_CLAIMS } from '../../data/mockPayroll'
import { RecruitPill } from '../recruitment/RecruitmentPrimitives'
import { AddAllowanceTypeModal, EditAllowanceTypeModal } from './PayrollModals'
import {
  PayActive,
  PayAddButton,
  PayAttachmentZone,
  PayCard,
  PayField,
  PayFormCard,
  PaySectionTitle,
  PaySubPills,
  PayTableScroll,
  PayToolbarRow,
  PayYesNo,
} from './PayrollShared'

const SUB = ['Allowance type', 'Travel allowance', 'Allowance attachment', 'Allowance payment']

export function PayrollAllowanceTab({ addSignal = 0 }: { addSignal?: number }) {
  const [sub, setSub] = useState(0)
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editName, setEditName] = useState(ALLOWANCE_TYPES[0].name)

  useEffect(() => {
    if (addSignal > 0) setAddOpen(true)
  }, [addSignal])

  return (
    <>
      <PaySubPills labels={SUB} selected={sub} onSelect={setSub} />
      {sub === 0 ? <AllowanceTypeView onAdd={() => setAddOpen(true)} onEdit={(n) => { setEditName(n); setEditOpen(true) }} /> : null}
      {sub === 1 ? <TravelAllowanceView /> : null}
      {sub === 2 ? <AllowanceAttachmentView /> : null}
      {sub === 3 ? <AllowancePaymentView /> : null}
      <AddAllowanceTypeModal open={addOpen} onClose={() => setAddOpen(false)} />
      <EditAllowanceTypeModal open={editOpen} onClose={() => setEditOpen(false)} name={editName} />
    </>
  )
}

function AllowanceTypeView({ onAdd, onEdit }: { onAdd: () => void; onEdit: (name: string) => void }) {
  return (
    <>
      <PayToolbarRow>
        <div className="module-toolbar-main">
          <select defaultValue="All policy types">
            <option>All policy types</option>
            <option>Transport</option>
            <option>Meal</option>
          </select>
          <input type="search" placeholder="Search allowance..." className="pay-search" />
        </div>
        <div className="module-toolbar-actions">
          <PayAddButton label="+ New allowance type" onClick={onAdd} />
        </div>
      </PayToolbarRow>
      <PayCard>
        <PayTableScroll>
          <table className="pay-table">
            <thead>
              <tr>
                <th>ALLOWANCE NAME</th>
                <th>POLICY TYPE</th>
                <th>AMOUNT (MYR)</th>
                <th>DEDUCTION AMT</th>
                <th>TAXABLE</th>
                <th>ON PAYSLIP</th>
                <th>ATTACH EMP.</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {ALLOWANCE_TYPES.map((row) => (
                <tr key={row.name}>
                  <td><strong>{row.name}</strong></td>
                  <td><RecruitPill label={row.policyType} tone={row.policyTone} /></td>
                  <td>{row.amount}</td>
                  <td>{row.deduction}</td>
                  <td><PayYesNo yes={row.taxable} /></td>
                  <td><PayYesNo yes /></td>
                  <td><PayYesNo yes={row.attachEmp} /></td>
                  <td><PayActive /></td>
                  <td><button type="button" className="pay-outline-btn sm" onClick={() => onEdit(row.name)}>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </PayTableScroll>
      </PayCard>
    </>
  )
}

function TravelAllowanceView() {
  return (
    <div className="pay-split">
      <PayFormCard title="+ SUBMIT TRAVEL CLAIM">
        <PayField label="Employee name">
          <select defaultValue="">
            <option value="">Select Employee...</option>
            <option>Sarah Lim</option>
            <option>Raj Kumar</option>
          </select>
        </PayField>
        <PayField label="Claim amount (MYR)">
          <input type="text" placeholder="e.g. 150.00" />
        </PayField>
        <PayField label="Purpose / route description">
          <input type="text" placeholder="e.g. Client Site Visit (PJ to KL)" />
        </PayField>
        <button type="button" className="pay-navy-btn full">File Reimbursement</button>
      </PayFormCard>
      <PayCard>
        <PaySectionTitle title="Travel claims history" trailing={<span className="pay-muted">3 total entries</span>} />
        <PayTableScroll>
          <table className="pay-table">
            <thead>
              <tr>
                <th>CLAIMANT</th>
                <th>PURPOSE</th>
                <th>DATE</th>
                <th>AMOUNT (MYR)</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {TRAVEL_CLAIMS.map((row) => (
                <tr key={`${row.name}-${row.date}`}>
                  <td><strong>{row.name}</strong></td>
                  <td>{row.purpose}</td>
                  <td>{row.date}</td>
                  <td>{row.amount}</td>
                  <td><RecruitPill label={row.status} tone={row.tone} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </PayTableScroll>
      </PayCard>
    </div>
  )
}

function AllowanceAttachmentView() {
  return (
    <PayCard>
      <PayAttachmentZone
        icon="📎"
        iconColor="#7c3aed"
        title="Attach allowance policy documents or employee eligibility proofs"
        subtitle="Supports PDF and image files up to 10MB (Click to simulate attach)"
      />
      <PaySectionTitle title="Allowance policy archive" />
      <PayTableScroll>
        <table className="pay-table">
          <thead>
            <tr>
              <th>DOCUMENT NAME</th>
              <th>LOGGED DATE</th>
              <th>FILE SIZE</th>
              <th>UPLOADER</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>📄 Transport-policy-2026.pdf</td>
              <td>2026-03-01</td>
              <td>1.2 MB</td>
              <td>Nina Reza</td>
            </tr>
          </tbody>
        </table>
      </PayTableScroll>
    </PayCard>
  )
}

function AllowancePaymentView() {
  return (
    <PayCard>
      <div className="pay-card-head between">
        <div>
          <strong className="pay-log-title">ACTIVE MONTH ALLOWANCE DISBURSEMENT LEDGER</strong>
          <p className="pay-muted">Approve or lock active allowances for current accounting period run.</p>
        </div>
        <PayAddButton label="Commit Approved Allowances" onClick={() => {}} />
      </div>
      <PayTableScroll>
        <table className="pay-table">
          <thead>
            <tr>
              <th>STAFF MEMBER</th>
              <th>UNIT DEPARTMENT</th>
              <th>APPROVED TRANSPORT</th>
              <th>APPROVED MEALS</th>
              <th>SPECIAL BONUS ALLOWANCE</th>
              <th>TOTAL (MYR)</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {ALLOWANCE_PAYMENTS.map((row) => (
              <tr key={row.name}>
                <td><strong>{row.name}</strong></td>
                <td>{row.department}</td>
                <td>{row.transport}</td>
                <td>{row.meals}</td>
                <td className={row.bonus !== '—' ? 'tone-primary' : ''}><strong>{row.bonus}</strong></td>
                <td><strong>{row.total}</strong></td>
                <td><RecruitPill label="Approved" tone="success" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </PayTableScroll>
    </PayCard>
  )
}

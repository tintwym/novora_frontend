import { useEffect, useState } from 'react'
import { DEDUCTION_TYPES } from '../../data/mockPayroll'
import { RecruitPill } from '../recruitment/RecruitmentPrimitives'
import { AddDeductionTypeModal, EditDeductionTypeModal } from './PayrollModals'
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

const SUB = ['Deduction type', 'Deduction attachment', 'Manual deduction']

export function PayrollDeductionTab({ addSignal = 0 }: { addSignal?: number }) {
  const [sub, setSub] = useState(0)
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editName, setEditName] = useState(DEDUCTION_TYPES[0].name)

  useEffect(() => {
    if (addSignal > 0) setAddOpen(true)
  }, [addSignal])

  return (
    <>
      <PaySubPills labels={SUB} selected={sub} onSelect={setSub} />
      {sub === 0 ? (
        <>
          <PayToolbarRow>
            <select defaultValue="All policy types">
              <option>All policy types</option>
            </select>
            <PayAddButton label="+ New deduction type" onClick={() => setAddOpen(true)} />
          </PayToolbarRow>
          <PayCard>
            <PayTableScroll>
              <table className="pay-table">
                <thead>
                  <tr>
                    <th>DEDUCTION NAME</th>
                    <th>TYPE</th>
                    <th>DEDUCTION RULE</th>
                    <th>AMOUNT / RATE</th>
                    <th>ON PAYSLIP</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {DEDUCTION_TYPES.map((row) => (
                    <tr key={row.name}>
                      <td><strong>{row.name}</strong></td>
                      <td><RecruitPill label={row.type} tone="info" /></td>
                      <td><em>{row.rule}</em></td>
                      <td>{row.amount}</td>
                      <td><PayYesNo yes={row.onPayslip} /></td>
                      <td><PayActive /></td>
                      <td>
                        <button
                          type="button"
                          className="pay-outline-btn sm"
                          onClick={() => {
                            setEditName(row.name)
                            setEditOpen(true)
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </PayTableScroll>
          </PayCard>
        </>
      ) : null}
      {sub === 1 ? (
        <PayCard>
          <PayAttachmentZone
            icon="📎"
            iconColor="#ec4899"
            title="Attach personal asset clearance logs or salary sacrifice declaration agreements"
            subtitle="Supports standard PDF, PNG files up to 15MB (Click to simulate attach)"
          />
          <PaySectionTitle title="Deduction agreements archive" />
          <PayTableScroll>
            <table className="pay-table">
              <thead>
                <tr>
                  <th>WITHHOLDING DOCUMENT NAME</th>
                  <th>UPLOADED DATE</th>
                  <th>FILE SIZE</th>
                  <th>AUTHORIZED BY</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>📄</td>
                  <td>2026-05-10</td>
                  <td>—</td>
                  <td>—</td>
                </tr>
              </tbody>
            </table>
          </PayTableScroll>
        </PayCard>
      ) : null}
      {sub === 2 ? (
        <PayFormCard title="MANUAL DEDUCTION ENTRY">
          <PayField label="Employee">
            <select defaultValue="">
              <option value="">Select employee...</option>
              <option>Ahmad L</option>
            </select>
          </PayField>
          <PayField label="Deduction type">
            <select defaultValue="Late deduction">
              <option>Late deduction</option>
              <option>Missing swipe</option>
            </select>
          </PayField>
          <PayField label="Amount (MYR)">
            <input type="text" placeholder="e.g. 20.00" />
          </PayField>
          <PayField label="Reason">
            <textarea rows={3} placeholder="Describe deduction reason..." />
          </PayField>
          <button type="button" className="pay-navy-btn full">Apply Manual Deduction</button>
        </PayFormCard>
      ) : null}
      <AddDeductionTypeModal open={addOpen} onClose={() => setAddOpen(false)} />
      <EditDeductionTypeModal open={editOpen} onClose={() => setEditOpen(false)} name={editName} />
    </>
  )
}

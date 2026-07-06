import { useEffect, useState } from 'react'
import { BONUS_PAYMENTS, BONUS_TYPES } from '../../data/mockPayroll'
import { RecruitPill } from '../recruitment/RecruitmentPrimitives'
import { AddBonusTypeModal } from './PayrollModals'
import { PayActive, PayAddButton, PayAttachmentZone, PayCard, PaySectionTitle, PaySubPills, PayTableScroll, PayToolbarRow } from './PayrollShared'

const SUB = ['Bonus type', 'Bonus attachment', 'Bonus payment']

export function PayrollBonusTab({ addSignal = 0 }: { addSignal?: number }) {
  const [sub, setSub] = useState(0)
  const [addOpen, setAddOpen] = useState(false)

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
            <PayAddButton label="+ New bonus type" onClick={() => setAddOpen(true)} />
          </PayToolbarRow>
          <PayCard>
            <PayTableScroll>
              <table className="pay-table">
                <thead>
                  <tr>
                    <th>BONUS NAME</th>
                    <th>POLICY TYPE</th>
                    <th>PAY MONTH</th>
                    <th>BASED ON</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {BONUS_TYPES.map((row) => (
                    <tr key={row.name}>
                      <td><strong>{row.name}</strong></td>
                      <td><RecruitPill label={row.policyType} tone="info" /></td>
                      <td>{row.payMonth}</td>
                      <td>{row.basedOn}</td>
                      <td><PayActive /></td>
                      <td><button type="button" className="pay-outline-btn sm">Edit</button></td>
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
          <PayAttachmentZone icon="📎" iconColor="#ea580c" title="Attach bonus policy documents or performance evaluation records" subtitle="Supports PDF files up to 10MB (Click to simulate attach)" />
          <PaySectionTitle title="Bonus policy archive" />
        </PayCard>
      ) : null}
      {sub === 2 ? (
        <PayCard>
          <div className="pay-card-head between">
            <PaySectionTitle title="Active month bonus disbursement ledger" />
            <PayAddButton label="Commit Approved Bonuses" onClick={() => {}} />
          </div>
          <PayTableScroll>
            <table className="pay-table">
              <thead>
                <tr>
                  <th>STAFF MEMBER</th>
                  <th>DEPARTMENT</th>
                  <th>BONUS TYPE</th>
                  <th>AMOUNT (MYR)</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {BONUS_PAYMENTS.map((row) => (
                  <tr key={row.name}>
                    <td><strong>{row.name}</strong></td>
                    <td>{row.department}</td>
                    <td>{row.bonusType}</td>
                    <td><strong>{row.amount}</strong></td>
                    <td><RecruitPill label={row.status} tone="success" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </PayTableScroll>
        </PayCard>
      ) : null}
      <AddBonusTypeModal open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  )
}

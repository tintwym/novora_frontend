import { useEffect, useState } from 'react'
import { DEPOSIT_TYPES } from '../../data/mockPayroll'
import { AddDepositTypeModal } from './PayrollModals'
import { PayActive, PayAddButton, PayAttachmentZone, PayCard, PayEditBtn, PaySectionTitle, PaySubPills, PayTableScroll, PayToolbarRow } from './PayrollShared'

const SUB = ['Deposit type', 'Deposit attachment']

export function PayrollDepositTab({ addSignal = 0 }: { addSignal?: number }) {
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
            <select defaultValue="All deposit types">
              <option>All deposit types</option>
            </select>
            <PayAddButton label="+ New deposit type" onClick={() => setAddOpen(true)} />
          </PayToolbarRow>
          <PayCard>
            <PayTableScroll>
              <table className="pay-table">
                <thead>
                  <tr>
                    <th>DEPOSIT NAME</th>
                    <th>CODE</th>
                    <th>EMPLOYMENT</th>
                    <th>FREQUENCY</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {DEPOSIT_TYPES.map((row) => (
                    <tr key={row.code}>
                      <td><strong>{row.name}</strong></td>
                      <td>{row.code}</td>
                      <td>{row.employment}</td>
                      <td>{row.frequency}</td>
                      <td>{row.amount}</td>
                      <td><PayActive /></td>
                      <td><PayEditBtn /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </PayTableScroll>
          </PayCard>
        </>
      ) : (
        <PayCard>
          <PayAttachmentZone
            iconColor="#7c3aed"
            title="Attach asset return records or equipment bonds proof"
            subtitle="Supports PDF and image files up to 10MB (Click to simulate attach)"
          />
          <PaySectionTitle title="Deposit receipts archive" />
        </PayCard>
      )}
      <AddDepositTypeModal open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  )
}

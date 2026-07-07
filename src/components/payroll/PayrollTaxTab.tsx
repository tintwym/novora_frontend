import { useEffect, useState } from 'react'
import { EMOLUMENTS, TAX_CATEGORIES } from '../../data/mockPayroll'
import { RecruitPill } from '../recruitment/RecruitmentPrimitives'
import { AddTaxCategoryModal, EditTaxCategoryModal, RegisterEmolumentModal } from './PayrollModals'
import {
  PayActive,
  PayAddButton,
  PayAttachmentZone,
  PayCard,
  PayEditBtn,
  PayKv,
  PaySectionTitle,
  PaySubPills,
  PayTableScroll,
  PayToolbarRow,
  PayYesNo,
} from './PayrollShared'

const SUB = ['Tax category', 'Tax attachment', 'Income tax policy', 'Taxable pays']

export function PayrollTaxTab({ addSignal = 0 }: { addSignal?: number }) {
  const [sub, setSub] = useState(0)
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [emolumentOpen, setEmolumentOpen] = useState(false)
  const [editName, setEditName] = useState(TAX_CATEGORIES[0].name)

  useEffect(() => {
    if (addSignal > 0) setAddOpen(true)
  }, [addSignal])

  return (
    <>
      <PaySubPills labels={SUB} selected={sub} onSelect={setSub} />
      {sub === 0 ? (
        <>
          <PayToolbarRow>
            <span />
            <PayAddButton label="+ New tax category" onClick={() => setAddOpen(true)} />
          </PayToolbarRow>
          <PayCard>
            <PaySectionTitle title="Localized tax profiles" />
            <PayTableScroll>
              <table className="pay-table">
                <thead>
                  <tr>
                    <th>TAX NAME</th>
                    <th>CODE</th>
                    <th>CALCULATE ON</th>
                    <th>CALC. OVERALL INCOME</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {TAX_CATEGORIES.map((row) => (
                    <tr key={row.code}>
                      <td><strong>{row.name}</strong></td>
                      <td>{row.code}</td>
                      <td>{row.calculateOn}</td>
                      <td><PayYesNo yes={row.overallIncome} /></td>
                      <td><PayActive /></td>
                      <td>
                        <PayEditBtn
                          onClick={() => {
                            setEditName(row.name)
                            setEditOpen(true)
                          }}
                        />
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
            iconColor="#ec4899"
            title="Attach government withholding filings or advisory reference briefs"
            subtitle="Supports standard PDF or Image documentation (Click to simulate attach)"
          />
          <PaySectionTitle title="Tax circular archives" />
        </PayCard>
      ) : null}
      {sub === 2 ? (
        <div className="pay-split">
          <PayCard>
            <h3>Federal income tax policy framework</h3>
            <p className="pay-muted">Our platform automatically processes progressive tax schedules mapped to state legislation guides, resolving exempt allowances and maximum statutory limits dynamically.</p>
            <div className="pay-kv-panel">
              <PayKv label="Standard Employer Contribution Rate" value="13.00% (EPF Base)" />
              <PayKv label="Maximum Employee Deduction Cap" value="11.00% standard salary" />
              <PayKv label="Exempt Threshold Level" value="MYR 3,000 / month" />
            </div>
          </PayCard>
          <PayCard>
            <h3>Verify active policies</h3>
            <p className="pay-muted">Click to request full local government guideline re-validations.</p>
            <button type="button" className="pay-primary-btn">Audit Withholding Standards</button>
            <p className="pay-muted small">Latest synchronization audit completed: Today, 10:43 UTC</p>
          </PayCard>
        </div>
      ) : null}
      {sub === 3 ? (
        <>
          <PayToolbarRow>
            <span />
            <PayAddButton label="+ Register Custom Emolument" onClick={() => setEmolumentOpen(true)} />
          </PayToolbarRow>
          <PayCard>
            <PaySectionTitle title="Salary emolument components classification" />
            <PayTableScroll>
              <table className="pay-table">
                <thead>
                  <tr>
                    <th>COMPENSATION COMPONENT NAME</th>
                    <th>REFERENCE CODE</th>
                    <th>EXEMPT ALLOWANCE LIMIT</th>
                    <th>DYNAMIC TAXABLE STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {EMOLUMENTS.map((row) => (
                    <tr key={row.code}>
                      <td><strong>{row.name}</strong></td>
                      <td className="tone-primary">{row.code}</td>
                      <td><em>{row.exemptLimit}</em></td>
                      <td>
                        <RecruitPill label={row.taxable ? 'Taxable Gross' : 'Exempt Category'} tone={row.taxable ? 'danger' : 'success'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </PayTableScroll>
          </PayCard>
        </>
      ) : null}
      <AddTaxCategoryModal open={addOpen} onClose={() => setAddOpen(false)} />
      <EditTaxCategoryModal open={editOpen} onClose={() => setEditOpen(false)} name={editName} />
      <RegisterEmolumentModal open={emolumentOpen} onClose={() => setEmolumentOpen(false)} />
    </>
  )
}

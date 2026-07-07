import { useState } from 'react'
import { OT_APPROVAL_BADGE, OT_APPROVAL_QUEUE, OT_ATTACHED_EMPLOYEES, OT_HISTORY } from '../../data/mockPayroll'
import { RecruitPill } from '../recruitment/RecruitmentPrimitives'
import {
  PayApproveReject,
  PayAttachmentZone,
  PayCard,
  PayEditBtn,
  PayField,
  PayFormCard,
  PayKv,
  PaySectionTitle,
  PaySubPills,
  PayTableScroll,
  PayToolbarRow,
} from './PayrollShared'

const SUB = ['OT policy attachment', 'Manual OT setup', 'Specific OT setup', 'OT request', 'Request for others', 'OT approval', 'OT history']

export function PayrollOvertimeTab() {
  const [sub, setSub] = useState(0)

  return (
    <>
      <PaySubPills labels={SUB} selected={sub} onSelect={setSub} badgeIndex={5} badgeCount={OT_APPROVAL_BADGE} />
      {sub === 0 ? <OtPolicyView /> : null}
      {sub === 1 ? <ManualOtView /> : null}
      {sub === 2 ? <SpecificOtView /> : null}
      {sub === 3 ? <OtRequestView /> : null}
      {sub === 4 ? <OtForOthersView /> : null}
      {sub === 5 ? <OtApprovalView /> : null}
      {sub === 6 ? <OtHistoryView /> : null}
    </>
  )
}

function OtPolicyView() {
  return (
    <>
      <PayToolbarRow>
        <select defaultValue="All departments">
          <option>All departments</option>
        </select>
        <button type="button" className="pay-navy-btn">+ Attach OT policy</button>
      </PayToolbarRow>
      <div className="pay-split">
        <PayCard>
          <div className="pay-card-head between">
            <h3>OT policy settings</h3>
            <button type="button" className="pay-link-btn">Edit policy</button>
          </div>
          <PayKv label="Weekday OT rate" value="Based on salary (per hour)" />
          <PayKv label="Weekend OT rate" value="1.5x per hour" />
          <PayKv label="Public holiday OT" value="2.0x per hour" />
          <PayKv label="Calculate by" value="Per minute rate" />
          <PayKv label="Rounding block" value="30 minutes" />
          <PayKv label="Min OT threshold" value="30 minutes" />
          <PayKv label="Max OT per day" value="4 hours" />
        </PayCard>
        <PayCard>
          <div className="pay-card-head between">
            <h3>Attached employees</h3>
            <RecruitPill label="430 employees" tone="info" />
          </div>
          <ul className="pay-simple-list">
            {OT_ATTACHED_EMPLOYEES.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </PayCard>
      </div>
    </>
  )
}

function ManualOtView() {
  return (
    <PayCard>
      <PayAttachmentZone iconColor="#2563eb" title="Attach overtime policy documents" subtitle="Supports PDF files up to 10MB (Click to simulate attach)" />
    </PayCard>
  )
}

function SpecificOtView() {
  return (
    <PayCard>
      <PayTableScroll>
        <table className="pay-table">
          <thead>
            <tr>
              <th>EMPLOYEE</th>
              <th>WEEKDAY RATE</th>
              <th>WEEKEND RATE</th>
              <th>HOLIDAY RATE</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {OT_ATTACHED_EMPLOYEES.map((name) => (
              <tr key={name}>
                <td><strong>{name}</strong></td>
                <td>1.0x</td>
                <td>1.5x</td>
                <td>2.0x</td>
                <td><PayEditBtn /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </PayTableScroll>
    </PayCard>
  )
}

function OtRequestView() {
  return (
    <PayFormCard title="MY OVERTIME REQUEST">
      <PayField label="Requested overtime hours">
        <input type="text" placeholder="e.g. 2.5" />
      </PayField>
      <PayField label="Business reason">
        <textarea rows={4} placeholder="e.g. Preparing end-of-year accounts audit paperwork" />
      </PayField>
      <button type="button" className="pay-primary-btn full">Submit OT Request</button>
    </PayFormCard>
  )
}

function OtForOthersView() {
  return (
    <PayFormCard title="FILING OT REQUEST FOR TEAM MEMBER">
      <PayField label="Target employee">
        <select defaultValue="">
          <option value="">Choose Employee...</option>
          <option>Raj Kumar</option>
          <option>Ahmad L</option>
        </select>
      </PayField>
      <PayField label="Overtime duration (hours)">
        <input type="text" placeholder="e.g. 4.0" />
      </PayField>
      <PayField label="Justification reason">
        <textarea rows={4} placeholder="e.g. Emergency support during evening network outage" />
      </PayField>
      <button type="button" className="pay-primary-btn full">File Overtime on Behalf</button>
    </PayFormCard>
  )
}

function OtApprovalView() {
  return (
    <PayCard>
      <div className="pay-card-head between">
        <PaySectionTitle title="Pending sign-off queue" />
        <span className="pay-count-pill warning">4 requests pending</span>
      </div>
      <PayTableScroll>
        <table className="pay-table">
          <thead>
            <tr>
              <th>STAFF MEMBER</th>
              <th>CLAIMED DATE</th>
              <th>JUSTIFICATION REASON</th>
              <th>HOURS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {OT_APPROVAL_QUEUE.map((row) => (
              <tr key={row.name}>
                <td><strong>{row.name}</strong></td>
                <td>{row.date}</td>
                <td>{row.reason}</td>
                <td><strong>{row.hours} hrs</strong></td>
                <td><PayApproveReject /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </PayTableScroll>
    </PayCard>
  )
}

function OtHistoryView() {
  return (
    <PayCard>
      <PaySectionTitle title="OVERTIME REQUESTS LOG HISTORY" />
      <PayTableScroll>
        <table className="pay-table">
          <thead>
            <tr>
              <th>STAFF MEMBER</th>
              <th>CLAIMED DATE</th>
              <th>HOURS</th>
              <th>REASON</th>
              <th>FULFILLMENT STATUS</th>
            </tr>
          </thead>
          <tbody>
            {OT_HISTORY.map((row) => (
              <tr key={`${row.name}-${row.date}`}>
                <td><strong>{row.name}</strong></td>
                <td>{row.date}</td>
                <td>{row.hours} hrs</td>
                <td>{row.reason}</td>
                <td><RecruitPill label={row.status} tone={row.tone} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </PayTableScroll>
    </PayCard>
  )
}

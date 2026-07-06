import { useState } from 'react'
import {
  CLAIM_CATEGORY_RATIOS,
  ENROLLMENT_PLANS,
  FSA_CLAIMS,
  PAYROLL_BENEFIT_ROWS,
  REPORT_CLAIMS,
  VENDORS,
  VENDOR_ALLOCATION,
  WELLNESS_CATEGORIES,
} from '../../data/mockBenefits'
import { RecruitIconKpi, RecruitPill } from '../recruitment/RecruitmentPrimitives'
import {
  BenCard,
  BenCheckItem,
  BenField,
  BenRatioBar,
  BenSectionTitle,
  BenTableScroll,
  BenWalletKpi,
} from './BenefitsShared'

export function BenefitsEnrollmentTab() {
  return (
    <div className="ben-plan-grid">
      {ENROLLMENT_PLANS.map((plan) => (
        <BenCard key={plan.title}>
          <div className="ben-plan-head">
            <RecruitPill label={plan.badge} tone={plan.tone} />
            <strong>{plan.price}</strong>
          </div>
          <h3>{plan.title}</h3>
          <p className="ben-provider">by {plan.provider}</p>
          <p className="ben-muted">{plan.description}</p>
          <span className="ben-inclusions-label">CLEARANCE INCLUSIONS:</span>
          {plan.inclusions.map((item) => (
            <BenCheckItem key={item} label={item} />
          ))}
          <div className="ben-plan-foot">
            <span className="ben-muted">✕ Not enrolled</span>
            <button type="button" className="ben-navy-btn">
              Request Enrollment
            </button>
          </div>
        </BenCard>
      ))}
    </div>
  )
}

export function BenefitsWellnessTab() {
  const [category, setCategory] = useState<(typeof WELLNESS_CATEGORIES)[number]>('Optical')

  return (
    <>
      <div className="ben-wallet-row">
        <BenWalletKpi
          title="Flexible Spending Account (FSA)"
          value="RM 1500.00"
          subtext="Remaining fund balance of RM 2000.00"
          utilization={0.25}
          utilizationLabel="25% (500 Spent)"
          color="#2563eb"
          icon="◎"
        />
        <BenWalletKpi
          title="Wellness & Fitness Budget Wallet"
          value="RM 400.00"
          subtext="Remaining fund balance of RM 500.00"
          utilization={0.2}
          utilizationLabel="20% (100 Spent)"
          color="#059669"
          icon="♥"
        />
      </div>
      <div className="ben-split">
        <BenCard>
          <span className="ben-section-title">FAST EXPENSE CLAIM REIMBURSEMENT</span>
          <BenField label="Benefit allocation category">
            <div className="ben-category-pills">
              {WELLNESS_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={category === cat ? 'active' : ''}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </BenField>
          <BenField label="Invoice receipt value (RM)">
            <input type="text" placeholder="e.g. 150.00" />
          </BenField>
          <BenField label="Filing reason / diagnosis / purchase">
            <input type="text" placeholder="e.g. Optical prescription glasses" />
          </BenField>
          <BenField label="Attached receipt file proof">
            <button type="button" className="ben-upload-zone">
              UPLOAD SCANNED PDF
            </button>
          </BenField>
          <button type="button" className="ben-navy-btn full">
            + Submit Claim to Welfare Audit
          </button>
        </BenCard>
        <BenCard>
          <BenSectionTitle
            title="FSA claims database receipts"
            trailing={<span className="ben-muted sm">Total processed item list</span>}
          />
          <BenTableScroll>
            <table className="ben-table">
              <thead>
                <tr>
                  <th>CLAIM ID</th>
                  <th>CANDIDATE EMPLOYEE</th>
                  <th>CLASSIFICATION</th>
                  <th>AMOUNT CHARGED</th>
                  <th>LOG STATUS</th>
                  <th>DATE FILED</th>
                </tr>
              </thead>
              <tbody>
                {FSA_CLAIMS.map((row) => (
                  <tr key={row.id}>
                    <td className="tone-primary">
                      <strong>{row.id}</strong>
                    </td>
                    <td>{row.employee}</td>
                    <td>
                      <RecruitPill label={row.classification} tone={row.classTone} />
                    </td>
                    <td>{row.amount}</td>
                    <td>
                      <RecruitPill label={row.status} tone={row.statusTone} />
                    </td>
                    <td>{row.dateFiled}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </BenTableScroll>
        </BenCard>
      </div>
    </>
  )
}

export function BenefitsDependentsTab() {
  return (
    <div className="ben-split dependents">
      <BenCard>
        <span className="ben-section-title">REGISTER FAMILY DEPENDENT</span>
        <p className="ben-muted">
          Add spouse, parent, or legal children to have their corporate medical coverage activated under the employee&apos;s Gold Premium Plus plan.
        </p>
        <BenField label="Legal full name">
          <input type="text" placeholder="e.g. Arthur Lim" />
        </BenField>
        <div className="ben-field-row">
          <BenField label="Relationship">
            <select defaultValue="Spouse">
              <option>Spouse</option>
              <option>Child</option>
              <option>Parent</option>
            </select>
          </BenField>
          <BenField label="Date of birth">
            <input type="text" defaultValue="01/01/1996" />
          </BenField>
        </div>
        <BenField label="National registration NRIC / passport">
          <input type="text" placeholder="e.g. 950214-14-5581" />
        </BenField>
        <BenField label="Assigned coverage policy">
          <select defaultValue="Standard Medical Only">
            <option>Standard Medical Only</option>
            <option>Medical + Dental</option>
          </select>
        </BenField>
        <button type="button" className="ben-navy-btn full">
          + Register Beneficiary
        </button>
      </BenCard>
      <div>
        <BenCard>
          <BenSectionTitle
            title="Registered dependents schedule"
            subtitle="Insurance allocations verified for employee: Ahmad Wahid"
            trailing={<RecruitPill label="0 active covers" tone="info" />}
          />
          <div className="ben-empty-state">
            <span aria-hidden>👥</span>
            <p>No dependent family members registered for this candidate.</p>
          </div>
        </BenCard>
        <div className="ben-policy-notice">
          <span aria-hidden>🛡</span>
          <div>
            <strong>Dependent Coverage Policy Notice</strong>
            <p>
              Beneficiary additions take effect under the vendor contract on the 1st of the subsequent calendar month. Please double check that passport numbers correspond perfectly with national registries to avoid claim verification rejections.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function BenefitsPayrollTab() {
  return (
    <>
      <div className="ben-sync-banner">
        <div>
          <RecruitPill label="CORE HR INTEGRATION LEDGER" tone="purple" />
          <h3>Payroll Sync & Deduction Audit</h3>
          <p className="ben-muted">
            Configure corporate taxable perks, deductible co-pays, and pre-tax HSA benefits as automated payroll line items.
          </p>
        </div>
        <button type="button" className="ben-navy-btn">
          ⟳ Synchronize June Payroll Run
        </button>
      </div>
      <BenCard>
        <BenSectionTitle title="Benefit line items transferred to payroll module" />
        <BenTableScroll>
          <table className="ben-table">
            <thead>
              <tr>
                <th>REFERENCE ID</th>
                <th>EMPLOYEE OFFICER NAME</th>
                <th>BENEFIT ALLOCATION ITEM</th>
                <th>FINANCIAL DEDUCTION TYPE</th>
                <th>PERIODIC IMPACT</th>
                <th>SYNC STATUS</th>
                <th>LAST SYNC TIME</th>
              </tr>
            </thead>
            <tbody>
              {PAYROLL_BENEFIT_ROWS.map((row) => (
                <tr key={row.refId}>
                  <td className="tone-primary">
                    <strong>{row.refId}</strong>
                  </td>
                  <td>{row.employee}</td>
                  <td>{row.benefitItem}</td>
                  <td>
                    <RecruitPill label={row.deductionType} tone={row.typeTone} />
                  </td>
                  <td className={row.positive ? 'tone-success' : 'tone-danger'}>
                    <strong>{row.periodicImpact}</strong>
                  </td>
                  <td>
                    <RecruitPill label={row.syncStatus} tone={row.syncTone} />
                  </td>
                  <td className="ben-muted sm">{row.lastSync}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </BenTableScroll>
      </BenCard>
    </>
  )
}

export function BenefitsVendorTab() {
  return (
    <>
      <div className="recruit-kpi-row three">
        <RecruitIconKpi
          title="Active Welfare Vendors"
          value="3 Providers"
          subtext="SLA response target: 24h"
          icon="🏢"
          iconColor="#2563eb"
        />
        <RecruitIconKpi
          title="Average Premium / Capita"
          value="RM 450.00"
          subtext="Per enrolled employee monthly"
          icon="💰"
          iconColor="#7c3aed"
          trend="92% utilization rate score"
        />
        <RecruitIconKpi
          title="Upcoming Renewal Cycle"
          value="In 60 days"
          subtext="SmileCare Dental core next"
          icon="📄"
          iconColor="#d97706"
          trend="UPCOMING RENEWAL CYCLE"
        />
      </div>
      <BenSectionTitle title="Contracted vendor platforms" />
      {VENDORS.map((vendor) => (
        <BenCard key={vendor.name} className="ben-vendor-card">
          <div>
            <div className="ben-vendor-head">
              <strong>{vendor.name}</strong>
              <RecruitPill label={vendor.category} tone="info" />
              <span className="ben-muted sm">{vendor.site}</span>
            </div>
            <p className="ben-muted">
              Covered Employees: {vendor.employees} • Total monthly Premium cost: RM {vendor.premium} • Renewal point:{' '}
              <strong className="tone-warning">{vendor.renewal}</strong>
            </p>
          </div>
          <div className="ben-vendor-actions">
            <button type="button" className="ben-outline-btn">
              Audit SLA details
            </button>
            <button type="button" className="ben-navy-btn">
              Renew Cover
            </button>
          </div>
        </BenCard>
      ))}
    </>
  )
}

export function BenefitsReportsTab() {
  return (
    <>
      <div className="recruit-kpi-row">
        <RecruitIconKpi
          title="Total Monthly Premium"
          value="RM 14,240"
          subtext="Consolidated 4 primary plans + vendor slabs"
          icon="∞"
          iconColor="#7c3aed"
          trend="● SLA & BUDGET COMPLIANT"
        />
        <article className="ben-report-kpi">
          <div className="ben-report-kpi-head">
            <div>
              <span className="recruit-kpi-title">Wallet FSA Usage</span>
              <strong>35%</strong>
              <span className="muted">RM 2,300 spent of RM 6,500 FSA cap</span>
            </div>
            <span className="recruit-kpi-icon" style={{ background: '#2563eb1f', color: '#2563eb' }}>
              ⟳
            </span>
          </div>
          <div className="ben-util-track">
            <span style={{ width: '35%', background: '#2563eb' }} />
          </div>
        </article>
        <article className="ben-report-kpi">
          <div className="ben-report-kpi-head">
            <div>
              <span className="recruit-kpi-title">Wellness Wallet Usage</span>
              <strong className="tone-success">36%</strong>
              <span className="muted">RM 590 spent of RM 1,650 cap</span>
            </div>
            <span className="recruit-kpi-icon" style={{ background: '#0596691f', color: '#059669' }}>
              ♥
            </span>
          </div>
          <div className="ben-util-track">
            <span style={{ width: '36%', background: '#059669' }} />
          </div>
        </article>
        <RecruitIconKpi
          title="Covered Dependents"
          value="3 Covered"
          subtext="Full panel medical + dental alignment"
          icon="👤"
          iconColor="#7c3aed"
          trend="✔ ALL CREDENTIALS VALID"
        />
      </div>
      <div className="ben-split reports">
        <BenCard>
          <BenSectionTitle
            title="Claims costing analysis"
            subtitle="Active monitoring of medical, optical, and dental co-payments"
            trailing={
              <button type="button" className="ben-outline-btn">
                EXPORT CLAIM LEDGER
              </button>
            }
          />
          <BenTableScroll>
            <table className="ben-table">
              <thead>
                <tr>
                  <th>ASSOCIATE</th>
                  <th>CATEGORY</th>
                  <th>INVOICE AMOUNT</th>
                  <th>AUDIT STATUS</th>
                </tr>
              </thead>
              <tbody>
                {REPORT_CLAIMS.map((row) => (
                  <tr key={`${row.name}-${row.category}`}>
                    <td>
                      <strong>{row.name}</strong>
                      <em className="ben-muted sm block">{row.empId}</em>
                    </td>
                    <td>{row.category}</td>
                    <td>
                      <strong>{row.amount}</strong>
                    </td>
                    <td>
                      <RecruitPill label={row.status} tone={row.statusTone} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </BenTableScroll>
        </BenCard>
        <div>
          <BenCard>
            <span className="ben-section-title">CLAIMS CATEGORY RATIOS</span>
            {CLAIM_CATEGORY_RATIOS.map((row) => (
              <BenRatioBar key={row.label} label={row.label} pct={row.pct} color={row.color} trailing={row.trailing} />
            ))}
          </BenCard>
          <BenCard>
            <span className="ben-section-title">VENDOR ALLOCATION SPLIT</span>
            {VENDOR_ALLOCATION.map((row) => (
              <BenRatioBar key={row.label} label={row.label} pct={row.pct} color={row.color} trailing={row.trailing} />
            ))}
          </BenCard>
        </div>
      </div>
    </>
  )
}

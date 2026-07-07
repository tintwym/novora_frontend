import { useMemo, useState } from 'react'
import {
  EMAIL_TRIGGERS,
  INTEGRATIONS,
  OPERATOR_ROLES,
  PUBLIC_HOLIDAYS,
  WORKFLOW_ROUTING_OPTIONS,
  operatorRoleTone,
  renderEmailPreview,
} from '../../data/mockSettings'
import type { CompanyProfileData, ModuleConfig, SettingsPanelId } from '../../types/settings'
import { useSettingsStore } from './SettingsContext'
import { NovoraLogoMark } from '../brand/NovoraLogo'
import {
  EmailPreview,
  SettingsBtn,
  SettingsCapsLabel,
  SettingsCard,
  SettingsCheckbox,
  SettingsField,
  SettingsInlineFormBox,
  SettingsInput,
  SettingsPageHeader,
  SettingsPill,
  SettingsSaveFooter,
  SettingsSelect,
  SettingsSimpleTable,
  SettingsTextarea,
  SettingsToggle,
  SettingsTwoCol,
  SetIcon,
  showSettingsSaved,
} from './SettingsShared'

export function SettingsPanelRouter({ panelId }: { panelId: SettingsPanelId }) {
  switch (panelId) {
    case 'company_profile':
      return <CompanyProfilePanel />
    case 'modules':
      return <ModulesPanel />
    case 'branch_location':
      return <BranchLocationPanel />
    case 'department_position':
      return <DepartmentPositionPanel />
    case 'users_accounts':
      return <UsersAccountsPanel />
    case 'roles_permissions':
      return <RolesPermissionsPanel />
    case 'approval_workflow':
      return <ApprovalWorkflowPanel />
    case 'notifications':
      return <NotificationsPanel />
    case 'integrations':
      return <IntegrationsPanel />
    case 'security':
      return <SecurityPanel />
    case 'audit_log':
      return <AuditLogPanel />
    case 'appearance':
      return <AppearancePanel />
    case 'language':
      return <LanguagePanel />
    case 'email_templates':
      return <EmailTemplatesPanel />
    case 'backup_data':
      return <BackupDataPanel />
    default:
      return <CompanyProfilePanel />
  }
}

function CompanyProfilePanel() {
  const { store, updateCompanyProfile } = useSettingsStore()
  const [form, setForm] = useState<CompanyProfileData>(store.companyProfile)

  function patch<K extends keyof CompanyProfileData>(key: K, value: CompanyProfileData[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function save() {
    updateCompanyProfile(form)
    showSettingsSaved('Registry details saved')
  }

  return (
    <div className="set-panel-scroll">
      <SettingsPageHeader title="Company Profile" subtitle="Configure company registry information and details." />
      <SettingsCard title="Company branding">
        <div className="set-branding-row">
          <span className="set-logo-box">
            <NovoraLogoMark className="set-logo-mark" />
          </span>
          <div>
            <strong>{form.name}</strong>
            <p>Logo — Recommended size: 200×200px (PNG, SVG, or JPEG)</p>
          </div>
          <SettingsBtn variant="outline" onClick={() => showSettingsSaved('Logo upload queued (mock)')}>
            Upload Logo
          </SettingsBtn>
          <SettingsBtn variant="danger-text" onClick={() => showSettingsSaved('Logo removed')}>
            Remove
          </SettingsBtn>
        </div>
        <SettingsTwoCol>
          <SettingsField label="Company name">
            <SettingsInput value={form.name} onChange={(e) => patch('name', e.target.value)} />
          </SettingsField>
          <SettingsField label="Registration no.">
            <SettingsInput value={form.registrationNo} onChange={(e) => patch('registrationNo', e.target.value)} />
          </SettingsField>
          <SettingsField label="Primary industry">
            <SettingsInput value={form.industry} onChange={(e) => patch('industry', e.target.value)} />
          </SettingsField>
          <SettingsField label="Company size">
            <SettingsSelect
              value={form.companySize}
              onChange={(v) => patch('companySize', v)}
              options={['1,001 - 5,000 employees', '501 - 1,000 employees', '51 - 200 employees']}
            />
          </SettingsField>
          <SettingsField label="Founded year">
            <SettingsInput value={form.foundedYear} onChange={(e) => patch('foundedYear', e.target.value)} />
          </SettingsField>
          <SettingsField label="Corporate website">
            <SettingsInput value={form.website} onChange={(e) => patch('website', e.target.value)} />
          </SettingsField>
        </SettingsTwoCol>
      </SettingsCard>
      <SettingsCard title="Registered corporate address">
        <SettingsField label="Address line 1">
          <SettingsInput value={form.addressLine1} onChange={(e) => patch('addressLine1', e.target.value)} />
        </SettingsField>
        <SettingsTwoCol>
          <SettingsField label="City">
            <SettingsInput value={form.city} onChange={(e) => patch('city', e.target.value)} />
          </SettingsField>
          <SettingsField label="State / territory">
            <SettingsInput value={form.state} onChange={(e) => patch('state', e.target.value)} />
          </SettingsField>
          <SettingsField label="Postcode">
            <SettingsInput value={form.postcode} onChange={(e) => patch('postcode', e.target.value)} />
          </SettingsField>
        </SettingsTwoCol>
      </SettingsCard>
      <SettingsCard title="Contact & tax identifiers">
        <SettingsTwoCol>
          <SettingsField label="Phone number">
            <SettingsInput value={form.phone} onChange={(e) => patch('phone', e.target.value)} />
          </SettingsField>
          <SettingsField label="HR dept. email">
            <SettingsInput value={form.hrEmail} onChange={(e) => patch('hrEmail', e.target.value)} />
          </SettingsField>
          <SettingsField label="Payroll dept. email">
            <SettingsInput value={form.payrollEmail} onChange={(e) => patch('payrollEmail', e.target.value)} />
          </SettingsField>
          <SettingsField label="EPF employer ID no.">
            <SettingsInput value={form.epfId} onChange={(e) => patch('epfId', e.target.value)} />
          </SettingsField>
          <SettingsField label="SOCSO employer ID no.">
            <SettingsInput value={form.socsoId} onChange={(e) => patch('socsoId', e.target.value)} />
          </SettingsField>
          <SettingsField label="Monthly tax no. (PCB)">
            <SettingsInput value={form.taxId} onChange={(e) => patch('taxId', e.target.value)} />
          </SettingsField>
        </SettingsTwoCol>
      </SettingsCard>
      <SettingsSaveFooter label="Save Registry Details" onClick={save} />
    </div>
  )
}

function ModulesPanel() {
  const { store, setModuleEnabled, saveModules } = useSettingsStore()
  const entries = Object.entries(store.modules) as [string, ModuleConfig][]
  const left = entries.filter((_, i) => i % 2 === 0)
  const right = entries.filter((_, i) => i % 2 === 1)

  return (
    <div className="set-panel-scroll">
      <SettingsPageHeader
        title="System Modules configuration"
        subtitle="Enable or disable HRMS modules globally company-wide."
        trailing={
          <SettingsBtn
            icon="save"
            onClick={() => {
              saveModules()
              showSettingsSaved('Modules setup saved')
            }}
          >
            Save Modules Setup
          </SettingsBtn>
        }
      />
      <div className="set-modules-grid">
        {[left, right].map((col, ci) => (
          <div key={ci} className="set-modules-col">
            {col.map(([name, mod]) => (
              <div key={name} className="set-module-row">
                <div>
                  <strong>{name}</strong>
                  <p>{mod.description}</p>
                </div>
                <SettingsToggle switchOnly label={name} checked={mod.enabled} onChange={(v) => setModuleEnabled(name, v)} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function BranchLocationPanel() {
  const { store, addBranch, updateBranch } = useSettingsStore()
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [staff, setStaff] = useState('')

  function resetForm() {
    setName('')
    setCity('')
    setStaff('')
    setShowAdd(false)
    setEditId(null)
  }

  function startEdit(id: string) {
    const b = store.branches.find((x) => x.id === id)
    if (!b) return
    setEditId(id)
    setShowAdd(false)
    setName(b.name)
    setCity(b.city)
    setStaff(b.staffLabel.replace(/\D/g, '') || '')
  }

  function save() {
    if (!name.trim() || !city.trim()) return
    const staffLabel = staff.trim() ? `${staff.trim()} staff members` : '0 staff members'
    if (editId) {
      updateBranch(editId, { name: name.trim(), city: city.trim(), staffLabel })
      showSettingsSaved('Branch updated')
    } else {
      addBranch({
        name: name.trim(),
        city: city.trim(),
        staffLabel,
        statusBadge: 'ACTIVE OFFICE',
        statusTone: 'info',
      })
      showSettingsSaved('Branch registered')
    }
    resetForm()
  }

  return (
    <div className="set-panel-scroll">
      <SettingsPageHeader
        title="Branch & Location Registry"
        subtitle="Manage company headquarters, offices, warehouses, and satellite sites."
        trailing={
          <SettingsBtn
            onClick={() => {
              resetForm()
              setShowAdd(true)
            }}
          >
            + Add Branch
          </SettingsBtn>
        }
      />
      {showAdd ? (
        <SettingsInlineFormBox title="Register Location">
          <BranchForm name={name} city={city} staff={staff} onName={setName} onCity={setCity} onStaff={setStaff} />
          <div className="set-form-actions">
            <SettingsBtn onClick={save}>Confirm Location</SettingsBtn>
            <SettingsBtn variant="outline" onClick={resetForm}>
              Cancel
            </SettingsBtn>
          </div>
        </SettingsInlineFormBox>
      ) : null}
      {editId ? (
        <SettingsInlineFormBox title={`Modify Branch: ${name}`}>
          <BranchForm name={name} city={city} staff={staff} onName={setName} onCity={setCity} onStaff={setStaff} />
          <div className="set-form-actions">
            <SettingsBtn onClick={save}>Save Changes</SettingsBtn>
            <SettingsBtn variant="outline" onClick={resetForm}>
              Cancel
            </SettingsBtn>
          </div>
        </SettingsInlineFormBox>
      ) : null}
      <SettingsCard title="Registered branches">
        <SettingsSimpleTable
          columns={['Branch name', 'City', 'Staff count', 'Status badge', 'Actions']}
          rows={store.branches.map((b) => [
            b.name,
            b.city,
            b.staffLabel,
            <SettingsPill key={b.id} label={b.statusBadge} tone={b.statusTone} />,
            <button key={`a-${b.id}`} type="button" className="set-link" onClick={() => startEdit(b.id)}>
              Modify
            </button>,
          ])}
        />
      </SettingsCard>
    </div>
  )
}

function BranchForm({
  name,
  city,
  staff,
  onName,
  onCity,
  onStaff,
}: {
  name: string
  city: string
  staff: string
  onName: (v: string) => void
  onCity: (v: string) => void
  onStaff: (v: string) => void
}) {
  return (
    <div className="set-inline-fields">
      <SettingsInput placeholder="Branch name" value={name} onChange={(e) => onName(e.target.value)} />
      <SettingsInput placeholder="City / Region" value={city} onChange={(e) => onCity(e.target.value)} />
      <SettingsInput placeholder="Employees" value={staff} onChange={(e) => onStaff(e.target.value)} />
    </div>
  )
}

function DepartmentPositionPanel() {
  const { store, addDepartment, addGrade } = useSettingsStore()
  const [showDept, setShowDept] = useState(false)
  const [showGrade, setShowGrade] = useState(false)
  const [deptName, setDeptName] = useState('')
  const [deptHead, setDeptHead] = useState('')
  const [gradeCode, setGradeCode] = useState('')
  const [minSal, setMinSal] = useState('')
  const [maxSal, setMaxSal] = useState('')

  return (
    <div className="set-panel-scroll">
      <SettingsPageHeader
        title="Departments & Job Grades Setup"
        subtitle="Establish company administrative charts, departmental divisions, and compensation salary brackets."
      />
      <div className="set-split-panels">
        <SettingsCard
          title="CORPORATE DEPARTMENTS"
          trailing={
            <button type="button" className="set-link" onClick={() => setShowDept(true)}>
              + Department
            </button>
          }
        >
          {showDept ? (
            <SettingsInlineFormBox title="Add Department">
              <SettingsInput placeholder="Department name" value={deptName} onChange={(e) => setDeptName(e.target.value)} />
              <SettingsInput placeholder="Department Head (e.g. David L)" value={deptHead} onChange={(e) => setDeptHead(e.target.value)} />
              <div className="set-form-actions">
                <SettingsBtn
                  onClick={() => {
                    if (!deptName.trim()) return
                    addDepartment(deptName.trim(), deptHead.trim() || 'TBD')
                    setDeptName('')
                    setDeptHead('')
                    setShowDept(false)
                    showSettingsSaved('Department added')
                  }}
                >
                  Add
                </SettingsBtn>
                <SettingsBtn variant="ghost" onClick={() => setShowDept(false)}>
                  Cancel
                </SettingsBtn>
              </div>
            </SettingsInlineFormBox>
          ) : null}
          <ul className="set-list">
            {store.departments.map((d) => (
              <li key={d.name}>
                <div>
                  <strong>{d.name}</strong>
                  <span>HEAD: {d.head}</span>
                </div>
                <span className="set-link">{d.employeeLabel}</span>
              </li>
            ))}
          </ul>
        </SettingsCard>
        <SettingsCard
          title="JOB SALARY GRADES"
          trailing={
            <button type="button" className="set-link" onClick={() => setShowGrade(true)}>
              + Grade Bracket
            </button>
          }
        >
          {showGrade ? (
            <SettingsInlineFormBox title="Add Grade Bracket">
              <SettingsInput placeholder="Grade Code (e.g. G)" value={gradeCode} onChange={(e) => setGradeCode(e.target.value)} />
              <SettingsInput placeholder="Min salary (MYR)" value={minSal} onChange={(e) => setMinSal(e.target.value)} />
              <SettingsInput placeholder="Max salary (MYR)" value={maxSal} onChange={(e) => setMaxSal(e.target.value)} />
              <div className="set-form-actions">
                <SettingsBtn
                  onClick={() => {
                    if (!gradeCode.trim()) return
                    addGrade(gradeCode.trim(), minSal.trim() || '0', maxSal.trim() || '0')
                    setGradeCode('')
                    setMinSal('')
                    setMaxSal('')
                    setShowGrade(false)
                    showSettingsSaved('Grade bracket added')
                  }}
                >
                  Add
                </SettingsBtn>
                <SettingsBtn variant="ghost" onClick={() => setShowGrade(false)}>
                  Cancel
                </SettingsBtn>
              </div>
            </SettingsInlineFormBox>
          ) : null}
          <ul className="set-grade-list">
            {store.grades.map((g) => (
              <li key={g.code}>
                <SettingsPill label={g.code} tone="info" />
                <div>
                  <strong>{g.rangeLabel}</strong>
                  <span>Approved corporate bounds</span>
                </div>
              </li>
            ))}
          </ul>
        </SettingsCard>
      </div>
    </div>
  )
}

function UsersAccountsPanel() {
  const { store, addOperator, revokeOperator } = useSettingsStore()
  const [showInvite, setShowInvite] = useState(false)
  const [opName, setOpName] = useState('')
  const [opEmail, setOpEmail] = useState('')
  const [opRole, setOpRole] = useState<string>(OPERATOR_ROLES[2])

  return (
    <div className="set-panel-scroll">
      <SettingsPageHeader
        title="System Account Operators"
        subtitle="Administer login access credentials, authorization scopes, and active administrative users."
        trailing={<SettingsBtn onClick={() => setShowInvite(true)}>+ Invite User</SettingsBtn>}
      />
      {showInvite ? (
        <SettingsInlineFormBox title="Assign New Operator Account">
          <div className="set-inline-fields">
            <SettingsInput placeholder="Operator name" value={opName} onChange={(e) => setOpName(e.target.value)} />
            <SettingsInput placeholder="HR email (e.g. nina@email)" value={opEmail} onChange={(e) => setOpEmail(e.target.value)} />
            <select className="set-select" value={opRole} onChange={(e) => setOpRole(e.target.value)}>
              {OPERATOR_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="set-form-actions">
            <SettingsBtn
              onClick={() => {
                if (!opName.trim() || !opEmail.trim()) return
                addOperator(opName.trim(), opEmail.trim(), opRole)
                setOpName('')
                setOpEmail('')
                setShowInvite(false)
                showSettingsSaved('Invite dispatched')
              }}
            >
              Dispatch invite
            </SettingsBtn>
            <SettingsBtn variant="outline" onClick={() => setShowInvite(false)}>
              Dismiss
            </SettingsBtn>
          </div>
        </SettingsInlineFormBox>
      ) : null}
      <SettingsCard title="Active operators">
        <SettingsSimpleTable
          columns={['User / operator contact', 'Assigned security role', 'Last active UTC', 'Status', 'Actions']}
          rows={store.operators.map((o) => [
            <div key={o.id} className="set-user-cell">
              <strong>{o.name}</strong>
              <span>{o.email}</span>
            </div>,
            <SettingsPill key={`r-${o.id}`} label={o.role} tone={operatorRoleTone(o.role)} />,
            o.lastActive,
            <SettingsPill key={`s-${o.id}`} label="ACTIVE STATE" tone="success" />,
            <button key={`x-${o.id}`} type="button" className="set-link danger" onClick={() => revokeOperator(o.id)}>
              Revoke Access
            </button>,
          ])}
        />
      </SettingsCard>
    </div>
  )
}

function RolesPermissionsPanel() {
  const { store, addRole } = useSettingsStore()
  const [showCreate, setShowCreate] = useState(false)
  const [roleName, setRoleName] = useState('')
  const [roleDesc, setRoleDesc] = useState('')

  return (
    <div className="set-panel-scroll">
      <SettingsPageHeader
        title="Security Roles Matrix"
        subtitle="Establish system security matrices, feature capabilities, and read/write access permissions."
        trailing={<SettingsBtn onClick={() => setShowCreate(true)}>+ Create Role</SettingsBtn>}
      />
      {showCreate ? (
        <SettingsInlineFormBox title="Create New Security Role">
          <SettingsCapsLabel>Role name</SettingsCapsLabel>
          <SettingsInput placeholder="e.g. Benefits Specialist" value={roleName} onChange={(e) => setRoleName(e.target.value)} />
          <SettingsCapsLabel>Role description</SettingsCapsLabel>
          <SettingsTextarea
            placeholder="Specify role responsibility and data visibility bounds..."
            value={roleDesc}
            onChange={(e) => setRoleDesc(e.target.value)}
            rows={3}
          />
          <div className="set-form-actions">
            <SettingsBtn
              onClick={() => {
                if (!roleName.trim()) return
                addRole(roleName.trim(), roleDesc.trim() || 'Custom security role')
                setRoleName('')
                setRoleDesc('')
                setShowCreate(false)
                showSettingsSaved('Role registered')
              }}
            >
              Register Role
            </SettingsBtn>
            <SettingsBtn variant="outline" onClick={() => setShowCreate(false)}>
              Cancel
            </SettingsBtn>
          </div>
        </SettingsInlineFormBox>
      ) : null}
      <div className="set-role-list">
        {store.roles.map((role) => (
          <article key={role.name} className="set-role-row">
            <div>
              <div className="set-role-title">
                <strong>{role.name}</strong>
                <SettingsPill label={role.tag} tone="neutral" />
              </div>
              <p>{role.description}</p>
            </div>
            <SettingsBtn variant="outline" onClick={() => showSettingsSaved(`Matrix editor for ${role.name} (mock)`)}>
              Configure Matrix
            </SettingsBtn>
          </article>
        ))}
      </div>
    </div>
  )
}

function ApprovalWorkflowPanel() {
  const { store, addWorkflow, toggleWorkflow } = useSettingsStore()
  const [showAdd, setShowAdd] = useState(false)
  const [wfName, setWfName] = useState('')
  const [wfDesc, setWfDesc] = useState('')
  const [wfRouting, setWfRouting] = useState<string>(WORKFLOW_ROUTING_OPTIONS[0])

  return (
    <div className="set-panel-scroll">
      <SettingsPageHeader
        title="Approval Workflows Config"
        subtitle="Customise approval dispatch routing chains, notifications logic, and auto-approval limits."
        trailing={<SettingsBtn onClick={() => setShowAdd(true)}>+ New Workflow</SettingsBtn>}
      />
      {showAdd ? (
        <SettingsInlineFormBox title="Enable New Workflow">
          <SettingsInput placeholder="Workflow name" value={wfName} onChange={(e) => setWfName(e.target.value)} />
          <SettingsTextarea placeholder="Description" value={wfDesc} onChange={(e) => setWfDesc(e.target.value)} rows={2} />
          <SettingsField label="Routing queue">
            <SettingsSelect value={wfRouting} onChange={setWfRouting} options={[...WORKFLOW_ROUTING_OPTIONS]} />
          </SettingsField>
          <div className="set-form-actions">
            <SettingsBtn
              onClick={() => {
                if (!wfName.trim()) return
                addWorkflow(wfName.trim(), wfDesc.trim() || 'Custom approval routing', wfRouting)
                setWfName('')
                setWfDesc('')
                setShowAdd(false)
                showSettingsSaved('Workflow enabled')
              }}
            >
              Enable Workflow
            </SettingsBtn>
            <SettingsBtn variant="outline" onClick={() => setShowAdd(false)}>
              Cancel
            </SettingsBtn>
          </div>
        </SettingsInlineFormBox>
      ) : null}
      <div className="set-workflow-list">
        {store.workflows.map((w, i) => (
          <article key={w.name} className={`set-workflow-row ${w.active ? '' : 'inactive'}`}>
            <div>
              <div className="set-workflow-title">
                <strong>{w.name}</strong>
                <SettingsPill label={w.active ? 'ACTIVE ROUTING' : 'DEACTIVATED'} tone={w.active ? 'success' : 'neutral'} />
              </div>
              <p>{w.description}</p>
              <span className="set-routing">Routing Queue: {w.routing}</span>
            </div>
            <SettingsBtn variant="outline" onClick={() => toggleWorkflow(i)}>
              {w.active ? 'Deactivate' : 'Activate'}
            </SettingsBtn>
          </article>
        ))}
      </div>
    </div>
  )
}

function NotificationsPanel() {
  const { store, patchNotifications } = useSettingsStore()
  const { channels, triggers } = store.notifications

  return (
    <div className="set-panel-scroll">
      <SettingsPageHeader
        title="Notification Channels Setup"
        subtitle="Configure system-wide dispatch metrics, chat integrations, emails, alerts, and mobile notifications."
        trailing={<SettingsBtn icon="save" onClick={() => showSettingsSaved('Notification preferences saved')}>Save state</SettingsBtn>}
      />
      <div className="set-split-panels">
        <SettingsCard title="ALERT CHANNELS">
          {Object.entries(channels).map(([label, on]) => (
            <SettingsToggle
              key={label}
              label={label}
              sub={
                label === 'In-app notifications'
                  ? 'Real-time alerts in portal panel bell icon'
                  : label === 'Email alerts'
                    ? 'Dispatches emails for approvals, tickets, schedules'
                    : label === 'Mobile smart push'
                      ? 'Deliver push notifications straight to Novora HR mobile app'
                      : 'Urgent SMS integration (premium gateway rates apply)'
              }
              checked={on}
              onChange={(v) => patchNotifications({ channels: { ...channels, [label]: v } })}
            />
          ))}
        </SettingsCard>
        <SettingsCard title="TRIGGERS HIERARCHY">
          {Object.entries(triggers).map(([label, on]) => (
            <SettingsCheckbox
              key={label}
              label={label}
              checked={on}
              onChange={(v) => patchNotifications({ triggers: { ...triggers, [label]: v } })}
            />
          ))}
        </SettingsCard>
      </div>
    </div>
  )
}

function IntegrationsPanel() {
  const { store, revealApiKey, regenerateApiKey } = useSettingsStore()

  return (
    <div className="set-panel-scroll">
      <SettingsPageHeader
        title="External Connection Integrations"
        subtitle="Synchronize corporate directory tools, bank salary exports, and biometric terminals."
      />
      <SettingsCard title="Connected integrations">
        {INTEGRATIONS.map((item) => (
          <div key={item.title} className="set-integration-row">
            <div>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </div>
            <SettingsPill label={item.status} tone={item.statusTone} />
          </div>
        ))}
      </SettingsCard>
      <SettingsCard
        title={
          <span className="set-card-title-row">
            <SetIcon name="sliders" className="set-card-title-icon" />
            Developer API Access Keys
          </span>
        }
        trailing={
          <SettingsBtn
            onClick={() => {
              regenerateApiKey()
              showSettingsSaved('New API key generated')
            }}
          >
            Generate New
          </SettingsBtn>
        }
      >
        <SettingsCapsLabel>Secret API auth key</SettingsCapsLabel>
        <p className="set-api-key">{store.apiKeyRevealed ? store.apiKeyFull : store.apiKeyMasked}</p>
        <div className="set-form-actions">
          <SettingsBtn
            variant="outline"
            onClick={() => {
              revealApiKey()
              showSettingsSaved('API key revealed')
            }}
          >
            Reveal Key
          </SettingsBtn>
          <SettingsBtn
            variant="outline"
            icon="copy"
            onClick={async () => {
              const key = store.apiKeyRevealed ? store.apiKeyFull : store.apiKeyMasked
              try {
                await navigator.clipboard.writeText(key)
                showSettingsSaved('API key copied')
              } catch {
                showSettingsSaved('Could not copy API key')
              }
            }}
          >
            Copy
          </SettingsBtn>
        </div>
      </SettingsCard>
    </div>
  )
}

function SecurityPanel() {
  const { store, patchSecurity } = useSettingsStore()
  const s = store.security

  return (
    <div className="set-panel-scroll">
      <SettingsPageHeader
        title="Global Security & Access Directives"
        subtitle="Establish password expiration indices, multi-factor logins, and directory whitelists."
        trailing={<SettingsBtn icon="shield" onClick={() => showSettingsSaved('Security directives enforced')}>Enforce directives</SettingsBtn>}
      />
      <div className="set-split-panels">
        <SettingsCard title="ACCESS CONTROL & 2FA">
          <SettingsToggle label="Enforce Multi-Factor (2FA)" sub="Enforces verification on administrator credentials." checked={s.twoFa} onChange={(v) => patchSecurity({ twoFa: v })} />
          <SettingsToggle label="Corporate SSO (Google / AD)" sub="Allow employees to logging in via company email suites." checked={s.sso} onChange={(v) => patchSecurity({ sso: v })} />
          <SettingsToggle label="Force reset upon creation" sub="Newly boarded staff must set custom secrets upon entry." checked={s.forceReset} onChange={(v) => patchSecurity({ forceReset: v })} />
        </SettingsCard>
        <SettingsCard title="STRENGTH GUIDELINES">
          <SettingsField label="Minimum length character count">
            <SettingsSelect value={s.minLength} onChange={(v) => patchSecurity({ minLength: v })} options={['8 characters', '10 characters', '12 characters']} />
          </SettingsField>
          <SettingsField label="Automatic expiration indices">
            <SettingsSelect value={s.expiration} onChange={(v) => patchSecurity({ expiration: v })} options={['90 days', '180 days', '365 days']} />
          </SettingsField>
          <SettingsCheckbox label="Require Uppercase & Lowercase alphas" checked={s.requireUpperLower} onChange={(v) => patchSecurity({ requireUpperLower: v })} />
          <SettingsCheckbox label="Require Numerical indexes" checked={s.requireNumbers} onChange={(v) => patchSecurity({ requireNumbers: v })} />
          <SettingsCheckbox label="Require Cryptographic special characters" checked={s.requireSpecial} onChange={(v) => patchSecurity({ requireSpecial: v })} />
        </SettingsCard>
      </div>
    </div>
  )
}

function AuditLogPanel() {
  const { store } = useSettingsStore()
  const [search, setSearch] = useState('')

  const logs = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return store.auditLogs
    return store.auditLogs.filter(
      (e) => e.user.toLowerCase().includes(q) || e.details.toLowerCase().includes(q) || e.module.toLowerCase().includes(q),
    )
  }, [store.auditLogs, search])

  return (
    <div className="set-panel-scroll">
      <SettingsPageHeader
        title="System Audit Log Trace"
        subtitle="Immutable historic sequence of administrative interventions and personnel files edits."
        trailing={<SettingsBtn icon="download" onClick={() => showSettingsSaved('Audit log export queued')}>Export log</SettingsBtn>}
      />
      <div className="set-search-row">
        <SetIcon name="search" className="set-search-icon" />
        <input
          type="search"
          placeholder="Search audit trail by User or Module..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <SettingsCard title="Recent interventions">
        <SettingsSimpleTable
          columns={['Timestamp UTC', 'User', 'Intervention details', 'Module scope', 'IP address']}
          rows={logs.map((e) => [e.timestamp, e.user, e.details, <SettingsPill key={e.timestamp + e.module} label={e.module} tone={e.moduleTone} />, e.ip])}
        />
      </SettingsCard>
    </div>
  )
}

function AppearancePanel() {
  const { store, setAppearance } = useSettingsStore()
  const { appearance: a } = store

  const presets = [
    { id: 'slate' as const, title: 'Slate Light', sub: 'Soft off-whites and charcoal gray.' },
    { id: 'minimal' as const, title: 'Minimal Off-White', sub: 'Sleek ivory canvas with deep graphite accents.' },
    { id: 'cyber' as const, title: 'Cyber Dark', sub: 'Deep galactic indigo nightscape (Premium).' },
    { id: 'emerald' as const, title: 'Emerald Forest', sub: 'Professional jade healthcare layout.' },
  ]

  return (
    <div className="set-panel-scroll">
      <SettingsPageHeader title="Appearance settings & Themes" subtitle="Personalise standard viewport themes, canvas scaling densities, and accent highlights." />
      <SettingsCapsLabel>Theme schedule</SettingsCapsLabel>
      <div className="set-segmented">
        {(['auto', 'light', 'dark'] as const).map((opt) => (
          <button key={opt} type="button" className={a.themeSchedule === opt ? 'active' : ''} onClick={() => setAppearance({ themeSchedule: opt })}>
            {opt === 'auto' ? 'Auto' : opt === 'light' ? 'Light' : 'Dark'}
          </button>
        ))}
      </div>
      {a.themeSchedule === 'auto' ? <p className="set-muted-note">Local sunrise & sunset</p> : null}
      <SettingsCapsLabel>Visual theme preset</SettingsCapsLabel>
      <div className="set-theme-grid">
        {presets.map((p) => (
          <button key={p.id} type="button" className={`set-theme-card ${a.preset === p.id ? 'selected' : ''}`} onClick={() => setAppearance({ preset: p.id })}>
            <strong>{p.title}</strong>
            <span>{p.sub}</span>
          </button>
        ))}
      </div>
      <SettingsCapsLabel>Canvas margin padding density</SettingsCapsLabel>
      <div className="set-segmented">
        {(['compact', 'cozy', 'spacious'] as const).map((opt) => (
          <button key={opt} type="button" className={a.density === opt ? 'active' : ''} onClick={() => setAppearance({ density: opt })}>
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </button>
        ))}
      </div>
      <SettingsCapsLabel>Primary accent color highlights</SettingsCapsLabel>
      <div className="set-accent-swatches">
        {(['blue', 'pink', 'green', 'orange'] as const).map((color) => (
          <button
            key={color}
            type="button"
            className={`set-swatch ${color} ${a.accent === color ? 'selected' : ''}`}
            aria-label={color}
            onClick={() => setAppearance({ accent: color })}
          >
            {a.accent === color ? '✓' : ''}
          </button>
        ))}
      </div>
    </div>
  )
}

function LanguagePanel() {
  const { store, patchLocalization, saveLocalization } = useSettingsStore()
  const l = store.localization

  return (
    <div className="set-panel-scroll">
      <SettingsPageHeader title="Timezone & Localisation settings" subtitle="Configure language indexes, corporate public holidays, calendar structures, and currencies." />
      <SettingsCard title="Regional preferences">
        <SettingsTwoCol>
          <SettingsField label="SYSTEM LANGUAGE">
            <SettingsSelect value={l.language} onChange={(v) => patchLocalization({ language: v })} options={['English (US)', 'Bahasa Malaysia', '中文 (简体)']} />
          </SettingsField>
          <SettingsField label="REGIONAL TIMEZONE REFERENCE">
            <SettingsSelect value={l.timezone} onChange={(v) => patchLocalization({ timezone: v })} options={['Asia/Kuala_Lumpur (UTC+8)', 'Asia/Singapore (UTC+8)', 'UTC']} />
          </SettingsField>
          <SettingsField label="CALENDAR DATE REPRESENTATION">
            <SettingsSelect value={l.dateFormat} onChange={(v) => patchLocalization({ dateFormat: v })} options={['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']} />
          </SettingsField>
          <SettingsField label="PRIMARY CURRENCY LEDGER">
            <SettingsSelect value={l.currency} onChange={(v) => patchLocalization({ currency: v })} options={['MYR — Malaysian Ringgit', 'SGD — Singapore Dollar', 'USD — US Dollar']} />
          </SettingsField>
        </SettingsTwoCol>
      </SettingsCard>
      <SettingsCard title="Public holidays schedule">
        <p className="set-holiday-note">
          Selected country: <strong>Malaysia</strong>. State-specific holidays mapped to <strong>all regions</strong>. 4 custom holiday override guidelines added.
        </p>
        <ul className="set-holiday-list">
          {PUBLIC_HOLIDAYS.map((h) => (
            <li key={h.name}>
              <strong>{h.name}</strong>
              <span>{h.date}</span>
            </li>
          ))}
        </ul>
      </SettingsCard>
      <SettingsSaveFooter
        label="Save Localisation"
        icon="save"
        onClick={() => {
          saveLocalization(l)
          showSettingsSaved('Localisation saved')
        }}
      />
    </div>
  )
}

function EmailTemplatesPanel() {
  const { store, addEmailTemplate, updateEmailTemplate } = useSettingsStore()
  const [showEditor, setShowEditor] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [trigger, setTrigger] = useState<string>(EMAIL_TRIGGERS[0])
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  function openCreate() {
    setEditId(null)
    setName('')
    setTrigger(EMAIL_TRIGGERS[0])
    setSubject('')
    setBody('')
    setShowEditor(true)
  }

  function openEdit(id: string) {
    const t = store.emailTemplates.find((x) => x.id === id)
    if (!t) return
    setEditId(id)
    setName(t.name)
    setTrigger(t.trigger)
    setSubject(t.subject)
    setBody(t.body)
    setShowEditor(true)
  }

  function closeEditor() {
    setShowEditor(false)
    setEditId(null)
  }

  function save() {
    if (!name.trim()) return
    if (editId) {
      updateEmailTemplate(editId, { name: name.trim(), trigger, subject: subject.trim(), body: body.trim(), lastEdited: 'Just now' })
    } else {
      addEmailTemplate({ name: name.trim(), trigger, subject: subject.trim(), body: body.trim(), lastEdited: 'Just now' })
    }
    closeEditor()
    showSettingsSaved('Email template saved')
  }

  const editorTitle = editId ? 'EDIT EMAIL TEMPLATE' : 'CREATE NEW EMAIL TEMPLATE'
  const previewBody = renderEmailPreview(body)

  return (
    <div className="set-panel-scroll">
      <SettingsPageHeader
        title="Email Notifications Templates"
        subtitle="Configure automated portal emails matching statutory processes triggers."
        trailing={
          <SettingsBtn onClick={() => (showEditor ? closeEditor() : openCreate())}>{showEditor ? '+ Close Editor' : '+ Create Mail Template'}</SettingsBtn>
        }
      />
      {showEditor ? (
        <div className="set-email-editor-grid">
          <SettingsCard title={editorTitle}>
            <SettingsField label="Template Name">
              <SettingsInput placeholder="e.g. Wellness claim processed" value={name} onChange={(e) => setName(e.target.value)} />
            </SettingsField>
            <SettingsField label="PROCESS TRIGGER">
              <SettingsSelect value={trigger} onChange={setTrigger} options={[...EMAIL_TRIGGERS]} />
            </SettingsField>
            <SettingsField label="EMAIL SUBJECT LINE">
              <SettingsInput placeholder="Subject email header" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </SettingsField>
            <p className="set-token-hint">Tokens: {'{name}'}, {'{days}'}, {'{id}'}, {'{email}'}</p>
            <SettingsTextarea placeholder="Write template message text..." value={body} onChange={(e) => setBody(e.target.value)} rows={6} />
            <div className="set-form-actions">
              <SettingsBtn onClick={save}>Save Template</SettingsBtn>
              <SettingsBtn variant="outline" onClick={closeEditor}>
                Cancel
              </SettingsBtn>
            </div>
          </SettingsCard>
          <SettingsCard title="LIVE MAILBOX OUTPUT RENDER" trailing={<span className="set-muted-note">Device width: Responsive</span>}>
            <EmailPreview subject={subject} body={previewBody} />
          </SettingsCard>
        </div>
      ) : null}
      <SettingsCard title="Active templates">
        <SettingsSimpleTable
          columns={['Template name', 'Process trigger', 'Last edited UTC date', 'Actions']}
          rows={store.emailTemplates.map((t) => [
            t.name,
            t.trigger,
            t.lastEdited,
            <button key={t.id} type="button" className="set-link" onClick={() => openEdit(t.id)}>
              Edit Content Preview
            </button>,
          ])}
        />
      </SettingsCard>
    </div>
  )
}

function BackupDataPanel() {
  const { store, runBackup, updateBackup } = useSettingsStore()
  const backup = store.backup

  return (
    <div className="set-panel-scroll">
      <SettingsPageHeader
        title="Database Backup & Retention"
        subtitle="Configure automated daily backups, retention lifespans, and manual downloads."
        trailing={
          <SettingsBtn
            icon="refresh"
            onClick={() => {
              runBackup()
              showSettingsSaved('Backup completed')
            }}
          >
            Run backup now
          </SettingsBtn>
        }
      />
      <div className="set-split-panels">
        <SettingsCard title="BACKUP SCHEDULES">
          <SettingsField label="Auto-backup frequency">
            <SettingsSelect value={backup.frequency} onChange={(v) => updateBackup({ frequency: v })} options={['Daily', 'Weekly', 'Monthly']} />
          </SettingsField>
          <SettingsField label="Backup capture time">
            <SettingsSelect value={backup.captureTime} onChange={(v) => updateBackup({ captureTime: v })} options={['02:00 AM', '03:00 AM', '04:00 AM']} />
          </SettingsField>
          <SettingsField label="Retention period">
            <SettingsSelect value={backup.retention} onChange={(v) => updateBackup({ retention: v })} options={['30 days', '90 days', '180 days']} />
          </SettingsField>
          <div className="set-backup-status">
            <div>
              <strong>Last success: {backup.lastSuccess}</strong>
              <p>Automated cron verified • S3 Bucket: novora_backups</p>
            </div>
            <SettingsPill label={`${backup.snapshotGb} GB SNAPSHOT`} tone="success" />
          </div>
        </SettingsCard>
        <SettingsCard title="DATA EXPORT CENTER">
          <p>Instantly compile and packaging corporate database tables into pristine spreadsheet assets.</p>
          <div className="set-export-grid">
            {[
              { label: 'Export Employees', icon: 'users' },
              { label: 'Export Payrolls', icon: 'database' },
              { label: 'Export Attendance', icon: 'calendar' },
              { label: 'Export Audit log', icon: 'file' },
            ].map(({ label, icon }) => (
              <button key={label} type="button" className="set-export-btn" onClick={() => showSettingsSaved(`${label} queued`)}>
                <SetIcon name={icon} className="set-export-icon" />
                {label}
              </button>
            ))}
          </div>
        </SettingsCard>
      </div>
    </div>
  )
}

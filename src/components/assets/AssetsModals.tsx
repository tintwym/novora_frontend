import { type ReactNode, useEffect, useState } from 'react'
import {
  ASSET_CUSTODIANS,
  ASSET_EMPLOYEES,
  ASSET_HANDOVER_STATES,
  ASSET_PRIORITIES,
  ASSET_REQUEST_CATEGORIES,
  ASSET_RESOLVE_LEVELS,
  ASSET_STATUSES,
  ASSET_TRIGGER_TYPES,
  initialsFor,
  nextAssetId,
  seedCategories,
  statusToneFor,
} from '../../data/mockAssets'
import type { AssetAllocationRecord, AssetCategoryRecord, AssetIncidentRecord, AssetRegistryEntry, AssetRequestRecord } from '../../types/assets'
import { AstCheckboxCard, AstClockIcon, AstCloseIcon, AstField, AstFieldRow } from './AssetsShared'

type ModalProps = { open: boolean; onClose: () => void }

function AstModalShell({
  open,
  title,
  saveLabel,
  onClose,
  onSave,
  children,
  wide,
}: {
  open: boolean
  title: string
  saveLabel: string
  onClose: () => void
  onSave?: () => void
  children: ReactNode
  wide?: boolean
}) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="ast-modal-overlay" role="presentation" onClick={onClose}>
      <div className={`ast-modal${wide ? ' ast-modal-wide' : ''}`} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="ast-modal-head">
          <h2>{title}</h2>
          <button type="button" className="ast-modal-close-link" onClick={onClose}>
            <AstCloseIcon />
            Close
          </button>
        </div>
        <div className="ast-modal-body">{children}</div>
        <div className="ast-modal-foot">
          <button type="button" className="ast-outline-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="ast-primary-btn" onClick={onSave ?? onClose}>
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

function AstInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  readOnly,
}: {
  value: string
  onChange?: (v: string) => void
  placeholder?: string
  type?: string
  readOnly?: boolean
}) {
  return <input type={type} className="ast-input" value={value} placeholder={placeholder} readOnly={readOnly} onChange={(e) => onChange?.(e.target.value)} />
}

function AstTextarea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange?: (v: string) => void; placeholder?: string; rows?: number }) {
  return <textarea className="ast-input" rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange?.(e.target.value)} />
}

function AstSelectInput({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select className="ast-input" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  )
}

const CATEGORY_NAMES = seedCategories().map((c) => c.name)

type AssetFormProps = ModalProps & {
  entry?: AssetRegistryEntry
  existingIds: string[]
  onSave: (entry: AssetRegistryEntry) => void
}

export function AssetRegistryFormModal({ open, onClose, entry, existingIds, onSave }: AssetFormProps) {
  const isEdit = Boolean(entry)
  const [name, setName] = useState('')
  const [serial, setSerial] = useState('')
  const [category, setCategory] = useState('Laptops')
  const [custodian, setCustodian] = useState('Warehouse (Unassigned)')
  const [status, setStatus] = useState<(typeof ASSET_STATUSES)[number]>('Available')
  const [value, setValue] = useState('')
  const [purchaseDate, setPurchaseDate] = useState('19/05/2026')
  const [location, setLocation] = useState('Kuala Lumpur HQ')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (!open) return
    setName(entry?.name ?? '')
    setSerial(entry?.serial ?? '')
    setCategory(entry?.category ?? 'Laptops')
    setCustodian(entry?.assigneeLabel ?? 'Warehouse (Unassigned)')
    setStatus(entry?.status ?? 'Available')
    setValue(entry?.value ?? '')
    setPurchaseDate(entry?.purchaseDate ?? '19/05/2026')
    setLocation(entry?.location ?? 'Kuala Lumpur HQ')
    setNotes(entry?.notes === '—' ? '' : (entry?.notes ?? ''))
  }, [open, entry])

  function handleSave() {
    if (!name.trim() || !serial.trim()) return
    const id = entry?.id ?? nextAssetId(existingIds, 'AST-')
    onSave({
      id,
      name: name.trim(),
      serial: serial.trim(),
      category,
      assigneeLabel: custodian,
      assigneeInitials: initialsFor(custodian),
      purchaseDate: purchaseDate.trim(),
      value: value.trim() || '0.00',
      status,
      statusTone: statusToneFor(status),
      location: location.trim(),
      notes: notes.trim() || '—',
    })
    onClose()
  }

  return (
    <AstModalShell open={open} title={isEdit ? 'Edit Asset' : 'New Asset'} saveLabel={isEdit ? 'Save Specs' : 'Register Asset'} onClose={onClose} onSave={handleSave}>
      <AstField label="Equipment name / model" required>
        <AstInput value={name} onChange={setName} placeholder={'e.g. MacBook Pro 14" (M3 / 16GB / 512GB)'} />
      </AstField>
      <AstFieldRow>
        <AstField label="Serial / asset tag" required>
          <AstInput value={serial} onChange={setSerial} placeholder="e.g. C02DX92DKW12" />
        </AstField>
        <AstField label="Equipment category">
          <AstSelectInput value={category} onChange={setCategory} options={CATEGORY_NAMES} />
        </AstField>
      </AstFieldRow>
      <AstFieldRow>
        <AstField label="Custodian employee">
          <AstSelectInput value={custodian} onChange={setCustodian} options={ASSET_CUSTODIANS} />
        </AstField>
        <AstField label="Asset physical status">
          <AstSelectInput value={status} onChange={(v) => setStatus(v as (typeof ASSET_STATUSES)[number])} options={[...ASSET_STATUSES]} />
        </AstField>
      </AstFieldRow>
      <AstFieldRow>
        <AstField label="Purchase cost (RM)">
          <AstInput value={value} onChange={setValue} placeholder="e.g. 5499.00" />
        </AstField>
        <AstField label="Receipt date">
          <AstInput value={purchaseDate} onChange={setPurchaseDate} />
        </AstField>
      </AstFieldRow>
      <AstField label="Specific physical location">
        <AstInput value={location} onChange={setLocation} />
      </AstField>
      <AstField label="IT administration notes">
        <AstTextarea value={notes} onChange={setNotes} placeholder="Add configuration detail, screen conditions, or repair history notes" />
      </AstField>
    </AstModalShell>
  )
}

type ViewAssetProps = ModalProps & {
  entry: AssetRegistryEntry | null
  activeCheckoutDate?: string
  onEdit: () => void
}

export function ViewAssetModal({ open, onClose, entry, activeCheckoutDate, onEdit }: ViewAssetProps) {
  if (!open || !entry) return null

  return (
    <div className="ast-modal-overlay" role="presentation" onClick={onClose}>
      <div className="ast-modal ast-view-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="ast-view-head">
          <div>
            <span className="ast-id-pill">{entry.id}</span>
            <h2>{entry.name}</h2>
          </div>
          <button type="button" className="ast-icon-btn" onClick={onClose} aria-label="Close">
            <AstCloseIcon />
          </button>
        </div>
        <div className="ast-view-body">
          <div className="ast-view-cards">
            <div className="ast-view-card">
              <span>Equipment category</span>
              <strong>{entry.category}</strong>
            </div>
            <div className="ast-view-card">
              <span>Current status</span>
              <span className={`ast-view-status ast-tone-${entry.statusTone}`}>{entry.status}</span>
            </div>
          </div>
          <dl className="ast-detail-list">
            <div><dt>Unique serial tag</dt><dd>{entry.serial}</dd></div>
            <div><dt>Custodian employee</dt><dd>{entry.assigneeLabel}</dd></div>
            <div><dt>Office custody base</dt><dd>{entry.location}</dd></div>
            <div><dt>Financial book value</dt><dd>RM {entry.value}</dd></div>
            <div><dt>Purchase / audit intake</dt><dd>{entry.purchaseDate}</dd></div>
          </dl>
          <span className="ast-section-label">IT administration & warranty notes</span>
          <div className="ast-notes-box">{entry.notes}</div>
          {entry.status === 'In Use' ? (
            <>
              <span className="ast-section-label">Active allocation route</span>
              <div className="ast-allocation-card">
                <span className="ast-allocation-icon" aria-hidden>
                  <AstClockIcon />
                </span>
                <div>
                  <strong>Checked out to {entry.assigneeLabel}</strong>
                  <small>{activeCheckoutDate ?? entry.purchaseDate}</small>
                </div>
                <span className="ast-allocation-active">Active</span>
              </div>
            </>
          ) : null}
        </div>
        <div className="ast-view-foot">
          <button type="button" className="ast-outline-btn ast-view-edit" onClick={onEdit}>
            Edit Specs
          </button>
          <button type="button" className="ast-primary-btn ast-view-done" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

type CategoryFormProps = ModalProps & {
  record?: AssetCategoryRecord
  existingIds: string[]
  onSave: (record: AssetCategoryRecord) => void
}

export function CategoryFormModal({ open, onClose, record, existingIds, onSave }: CategoryFormProps) {
  const isEdit = Boolean(record)
  const [name, setName] = useState('')
  const [prefix, setPrefix] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (!open) return
    setName(record?.name ?? '')
    setPrefix(record?.prefix ?? '')
    setDescription(record?.description ?? '')
  }, [open, record])

  function handleSave() {
    if (!name.trim() || !prefix.trim()) return
    const id = record?.id ?? nextAssetId(existingIds, 'CAT-')
    onSave({
      id,
      name: name.trim(),
      prefix: prefix.trim().toUpperCase(),
      description: description.trim(),
      equipmentCount: record?.equipmentCount ?? '0 items',
    })
    onClose()
  }

  return (
    <AstModalShell open={open} title={isEdit ? 'Edit Category' : 'New Category'} saveLabel={isEdit ? 'Save Category' : 'Register Category'} onClose={onClose} onSave={handleSave}>
      <AstField label="Category title" required>
        <AstInput value={name} onChange={setName} placeholder="e.g. Workstations" />
      </AstField>
      <AstField label="Code prefix (unique 2-4 chars)" required>
        <AstInput value={prefix} onChange={setPrefix} placeholder="E.G. WKS" />
      </AstField>
      <AstField label="Description / category scope">
        <AstTextarea
          value={description}
          onChange={setDescription}
          placeholder="e.g. Hardware workstations, docks, power backup rails, or external servers hardware."
        />
      </AstField>
    </AstModalShell>
  )
}

type AllocationFormProps = ModalProps & {
  registry: AssetRegistryEntry[]
  existingIds: string[]
  onSave: (record: AssetAllocationRecord) => void
}

export function NewAllocationModal({ open, onClose, registry, existingIds, onSave }: AllocationFormProps) {
  const available = registry.filter((e) => e.status === 'Available')
  const assetOptions = available.length ? available.map((e) => `[${e.id}] ${e.name}`) : ['— No stock available —']
  const [assetLabel, setAssetLabel] = useState(assetOptions[0])
  const [employee, setEmployee] = useState('-- Choose target employee --')
  const [checkoutDate, setCheckoutDate] = useState('19/05/2026')
  const [returnDate, setReturnDate] = useState('19/05/2028')
  const [handover, setHandover] = useState('Good / Average')

  useEffect(() => {
    if (!open) return
    setAssetLabel(assetOptions[0])
    setEmployee('-- Choose target employee --')
    setCheckoutDate('19/05/2026')
    setReturnDate('19/05/2028')
    setHandover('Good / Average')
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSave() {
    if (employee.startsWith('--') || assetLabel.startsWith('—')) return
    const match = assetLabel.match(/^\[([^\]]+)\]/)
    const assetId = match?.[1] ?? ''
    const asset = registry.find((e) => e.id === assetId)
    if (!asset) return
    onSave({
      id: nextAssetId(existingIds, 'ALC-'),
      assetName: asset.name,
      assetId: asset.id,
      employee,
      checkoutDate,
      returnDate,
      handover,
      status: 'Active',
    })
    onClose()
  }

  return (
    <AstModalShell open={open} title="New Allocation" saveLabel="Establish Allocation" onClose={onClose} onSave={handleSave}>
      <AstField label="Select available hardware item" required>
        <AstSelectInput value={assetLabel} onChange={setAssetLabel} options={assetOptions} />
      </AstField>
      <AstField label="Recipient employee" required>
        <AstSelectInput value={employee} onChange={setEmployee} options={['-- Choose target employee --', ...ASSET_EMPLOYEES]} />
      </AstField>
      <AstFieldRow>
        <AstField label="Issue checkout date">
          <AstInput value={checkoutDate} onChange={setCheckoutDate} />
        </AstField>
        <AstField label="Expected return date">
          <AstInput value={returnDate} onChange={setReturnDate} />
        </AstField>
      </AstFieldRow>
      <AstField label="Check-out structural condition notes">
        <AstSelectInput value={handover} onChange={setHandover} options={ASSET_HANDOVER_STATES} />
      </AstField>
    </AstModalShell>
  )
}

type RequestFormProps = ModalProps & {
  existingIds: string[]
  onSave: (record: AssetRequestRecord) => void
}

export function NewRequestModal({ open, onClose, existingIds, onSave }: RequestFormProps) {
  const [employee, setEmployee] = useState('Ahmad Wahid (Operations)')
  const [category, setCategory] = useState('Laptops')
  const [priority, setPriority] = useState<(typeof ASSET_PRIORITIES)[number]>('Medium')
  const [item, setItem] = useState('')
  const [justification, setJustification] = useState('')

  useEffect(() => {
    if (!open) return
    setEmployee('Ahmad Wahid (Operations)')
    setCategory('Laptops')
    setPriority('Medium')
    setItem('')
    setJustification('')
  }, [open])

  function handleSave() {
    if (!item.trim() || !justification.trim()) return
    const empName = employee.split(' (')[0]
    onSave({
      id: nextAssetId(existingIds, 'REQ-'),
      employee: empName,
      item: item.trim(),
      category,
      justification: justification.trim(),
      priority,
      submitDate: new Date().toISOString().slice(0, 10),
      status: 'Pending',
    })
    onClose()
  }

  return (
    <AstModalShell open={open} title="New Request" saveLabel="Submit Request" onClose={onClose} onSave={handleSave}>
      <AstField label="Employee requesting" required>
        <AstSelectInput
          value={employee}
          onChange={setEmployee}
          options={['Ahmad Wahid (Operations)', 'Sarah Lim (Engineering)', 'Maya Tan (Finance)', 'Raj Kumar (Operations)']}
        />
      </AstField>
      <AstFieldRow>
        <AstField label="Asset category">
          <AstSelectInput value={category} onChange={setCategory} options={ASSET_REQUEST_CATEGORIES} />
        </AstField>
        <AstField label="Priority urgency">
          <AstSelectInput value={priority} onChange={(v) => setPriority(v as (typeof ASSET_PRIORITIES)[number])} options={[...ASSET_PRIORITIES]} />
        </AstField>
      </AstFieldRow>
      <AstField label="Product description / model desired" required>
        <AstInput value={item} onChange={setItem} placeholder="e.g. Dell P2723DE QHD Hub Monitor" />
      </AstField>
      <AstField label="Business justification" required>
        <AstTextarea
          value={justification}
          onChange={setJustification}
          placeholder="Explain how this asset item empowers workflow, or replace hardware malfunctions..."
        />
      </AstField>
    </AstModalShell>
  )
}

type IncidentFormProps = ModalProps & {
  registry: AssetRegistryEntry[]
  existingIds: string[]
  record?: AssetIncidentRecord
  onSave: (record: AssetIncidentRecord) => void
}

export function IncidentFormModal({ open, onClose, registry, existingIds, record, onSave }: IncidentFormProps) {
  const isEdit = Boolean(record)
  const assetOptions = registry.map((e) => `[${e.id}] ${e.name} (${e.category})`)
  const [assetLabel, setAssetLabel] = useState(assetOptions[0] ?? '')
  const [custodian, setCustodian] = useState('-- Choose employee --')
  const [trigger, setTrigger] = useState(ASSET_TRIGGER_TYPES[0])
  const [repairCost, setRepairCost] = useState('')
  const [chargePayroll, setChargePayroll] = useState(false)
  const [resolveLevel, setResolveLevel] = useState(ASSET_RESOLVE_LEVELS[0])
  const [details, setDetails] = useState('')

  useEffect(() => {
    if (!open) return
    if (record) {
      setAssetLabel(`[${record.assetId}] ${record.assetName}`)
      setCustodian(record.custodian)
      setTrigger(record.trigger)
      setRepairCost(record.repairCost)
      setChargePayroll(record.chargePayroll)
      setResolveLevel(record.resolveLevel)
      setDetails(record.details ?? '')
    } else {
      setAssetLabel(assetOptions[0] ?? '-- Choose asset --')
      setCustodian('-- Choose employee --')
      setTrigger(ASSET_TRIGGER_TYPES[0])
      setRepairCost('')
      setChargePayroll(false)
      setResolveLevel(ASSET_RESOLVE_LEVELS[0])
      setDetails('')
    }
  }, [open, record]) // eslint-disable-line react-hooks/exhaustive-deps

  function payrollLabel(charge: boolean) {
    return charge ? 'ACTIVE CHARGE' : 'CO. ABSORBED'
  }

  function handleSave() {
    if (custodian.startsWith('--') || assetLabel.startsWith('--')) return
    const match = assetLabel.match(/^\[([^\]]+)\]\s*(.+?)(?:\s*\(|$)/)
    const assetId = match?.[1] ?? record?.assetId ?? ''
    const assetName = match?.[2]?.trim() ?? record?.assetName ?? ''
    const cost = repairCost.trim() || '0.00'
    onSave({
      id: record?.id ?? nextAssetId(existingIds, 'INC-'),
      assetName,
      assetId,
      custodian,
      trigger,
      reportDate: record?.reportDate ?? new Date().toISOString().slice(0, 10),
      repairCost: cost,
      payrollLabel: payrollLabel(chargePayroll),
      resolveLevel,
      chargePayroll,
      details: details.trim(),
    })
    onClose()
  }

  return (
    <AstModalShell open={open} title={isEdit ? 'Edit Incident' : 'New Incident'} saveLabel={isEdit ? 'Save Incident' : 'Report Incident'} onClose={onClose} onSave={handleSave}>
      <AstField label="Select asset damage target" required>
        <AstSelectInput value={assetLabel} onChange={setAssetLabel} options={isEdit ? [assetLabel, ...assetOptions] : ['-- Choose asset --', ...assetOptions]} />
      </AstField>
      <AstField label="Reporter / designated custodian" required>
        <AstSelectInput value={custodian} onChange={setCustodian} options={['-- Choose employee --', ...ASSET_EMPLOYEES]} />
      </AstField>
      <AstFieldRow>
        <AstField label="Issue trigger type">
          <AstSelectInput value={trigger} onChange={setTrigger} options={ASSET_TRIGGER_TYPES} />
        </AstField>
        <AstField label="Estimated repair (RM)">
          <AstInput value={repairCost} onChange={setRepairCost} placeholder="e.g. 150.00" />
        </AstField>
      </AstFieldRow>
      <AstCheckboxCard
        checked={chargePayroll}
        onChange={setChargePayroll}
        title="Charge back to Employee payroll?"
        subtext="Will log penalty deductibles under payroll workflow tab."
      />
      <AstField label="Incident resolve level">
        <AstSelectInput value={resolveLevel} onChange={setResolveLevel} options={ASSET_RESOLVE_LEVELS} />
      </AstField>
      <AstField label="Description / repair log details">
        <AstTextarea value={details} onChange={setDetails} placeholder="Describe detail: LCD flex cables replacement required etc." />
      </AstField>
    </AstModalShell>
  )
}

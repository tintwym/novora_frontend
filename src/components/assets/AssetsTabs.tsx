import { useMemo, useState } from 'react'
import { priorityTone } from '../../data/mockAssets'
import type {
  AssetAllocationRecord,
  AssetCategoryRecord,
  AssetIncidentRecord,
  AssetRegistryEntry,
  AssetRequestRecord,
} from '../../types/assets'
import { HrToolbarPill } from '../hr/HrPrimitives'
import {
  AssetRegistryFormModal,
  CategoryFormModal,
  IncidentFormModal,
  ViewAssetModal,
} from './AssetsModals'
import {
  AstCountPill,
  AstCustodianCell,
  AstEditIcon,
  AstEyeIcon,
  AstFilterGroup,
  AstIconBtn,
  AstOutlineBtn,
  AstPrefixPill,
  AstPrimaryBtn,
  AstSearchInput,
  AstSelect,
  AstStatusPill,
  AstTableCard,
  AstTableScroll,
  AstToolbarCard,
  AstTrashIcon,
} from './AssetsShared'

function matchesSearch(query: string, fields: string[]) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return fields.some((f) => f.toLowerCase().includes(q))
}

export function exportCsv(label: string, rows: string[][]) {
  const text = rows.map((row) => row.map((v) => (v.includes(',') || v.includes('"') ? `"${v.replaceAll('"', '""')}"` : v)).join(',')).join('\n')
  void navigator.clipboard.writeText(text)
  window.alert(`${label} copied to clipboard`)
}

type RegistryTabProps = {
  registry: AssetRegistryEntry[]
  categories: AssetCategoryRecord[]
  allocations: AssetAllocationRecord[]
  onUpdateRegistry: (next: AssetRegistryEntry[]) => void
  onRemoveAsset: (id: string) => void
  onExport: () => void
}

export function AssetRegistryTab({ registry, categories, allocations, onUpdateRegistry, onRemoveAsset, onExport }: RegistryTabProps) {
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('All categories')
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [viewEntry, setViewEntry] = useState<AssetRegistryEntry | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editEntry, setEditEntry] = useState<AssetRegistryEntry | undefined>()

  const categoryOptions = ['All categories', ...categories.map((c) => c.name)]
  const statusOptions = ['All statuses', 'In Use', 'Available', 'Maintenance']

  const filtered = useMemo(
    () =>
      registry.filter((e) => {
        if (catFilter !== 'All categories' && e.category !== catFilter) return false
        if (statusFilter !== 'All statuses' && e.status !== statusFilter) return false
        return matchesSearch(search, [e.id, e.name, e.serial, e.category, e.assigneeLabel, e.location])
      }),
    [registry, catFilter, statusFilter, search],
  )

  function activeCheckoutDate(assetId: string) {
    return allocations.find((a) => a.assetId === assetId && a.status === 'Active')?.checkoutDate
  }

  function openEdit(entry: AssetRegistryEntry) {
    setEditEntry(entry)
    setFormOpen(true)
    setViewEntry(null)
  }

  function saveEntry(entry: AssetRegistryEntry) {
    const idx = registry.findIndex((e) => e.id === entry.id)
    if (idx >= 0) {
      const next = [...registry]
      next[idx] = entry
      onUpdateRegistry(next)
    } else {
      onUpdateRegistry([...registry, entry])
    }
  }

  return (
    <div className="ast-tab">
      <AstToolbarCard
        left={
          <>
            <AstSearchInput placeholder="Search registry..." value={search} onChange={setSearch} />
            <AstFilterGroup label="Category">
              <AstSelect value={catFilter} onChange={setCatFilter} options={categoryOptions} />
            </AstFilterGroup>
            <AstFilterGroup label="Status">
              <AstSelect value={statusFilter} onChange={setStatusFilter} options={statusOptions} />
            </AstFilterGroup>
          </>
        }
        right={
          <>
            <HrToolbarPill variant="export" onClick={onExport}>
              Export CSV
              <svg viewBox="0 0 24 24" aria-hidden className="ast-export-icon">
                <path d="M12 3v12M7 10l5 5 5-5M5 21h14" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </HrToolbarPill>
            <AstPrimaryBtn
              onClick={() => {
                setEditEntry(undefined)
                setFormOpen(true)
              }}
            >
              + New Asset
            </AstPrimaryBtn>
          </>
        }
      />
      <AstTableCard>
        <AstTableScroll>
          <table className="ast-table ui-data-table">
            <thead>
              <tr>
                <th>Asset ID</th>
                <th>Asset details</th>
                <th>Category</th>
                <th>Current custodian</th>
                <th>Status</th>
                <th>Purchase date</th>
                <th>Value (RM)</th>
                <th className="ast-actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id}>
                  <td className="ast-id-cell">{e.id}</td>
                  <td>
                    <strong>{e.name}</strong>
                    <small>S/N: {e.serial}</small>
                  </td>
                  <td>{e.category}</td>
                  <td>
                    <AstCustodianCell initials={e.assigneeInitials} name={e.assigneeLabel} />
                  </td>
                  <td>
                    <AstStatusPill label={e.status} tone={e.statusTone} />
                  </td>
                  <td>{e.purchaseDate}</td>
                  <td>
                    <strong>{e.value}</strong>
                  </td>
                  <td className="ast-actions">
                    <div className="ast-row-actions">
                      <AstIconBtn label="View" onClick={() => setViewEntry(e)}>
                        <AstEyeIcon />
                      </AstIconBtn>
                      <AstIconBtn label="Edit" onClick={() => openEdit(e)}>
                        <AstEditIcon />
                      </AstIconBtn>
                      <AstIconBtn label="Delete" onClick={() => onRemoveAsset(e.id)}>
                        <AstTrashIcon />
                      </AstIconBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AstTableScroll>
      </AstTableCard>

      <ViewAssetModal
        open={Boolean(viewEntry)}
        entry={viewEntry}
        activeCheckoutDate={viewEntry ? activeCheckoutDate(viewEntry.id) : undefined}
        onClose={() => setViewEntry(null)}
        onEdit={() => viewEntry && openEdit(viewEntry)}
      />
      <AssetRegistryFormModal
        open={formOpen}
        entry={editEntry}
        existingIds={registry.map((e) => e.id)}
        onClose={() => {
          setFormOpen(false)
          setEditEntry(undefined)
        }}
        onSave={saveEntry}
      />
    </div>
  )
}

type CategoriesTabProps = {
  categories: AssetCategoryRecord[]
  registry: AssetRegistryEntry[]
  onUpdateCategories: (next: AssetCategoryRecord[]) => void
  onExport: () => void
}

export function AssetCategoriesTab({ categories, registry, onUpdateCategories, onExport }: CategoriesTabProps) {
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<AssetCategoryRecord | undefined>()

  const filtered = useMemo(
    () => categories.filter((c) => matchesSearch(search, [c.id, c.name, c.prefix, c.description])),
    [categories, search],
  )

  function categoryCount(name: string) {
    const n = registry.filter((e) => e.category === name).length
    return `${n} items`
  }

  function saveCategory(record: AssetCategoryRecord) {
    const idx = categories.findIndex((c) => c.id === record.id)
    if (idx >= 0) {
      const next = [...categories]
      next[idx] = record
      onUpdateCategories(next)
    } else {
      onUpdateCategories([...categories, record])
    }
  }

  return (
    <div className="ast-tab">
      <AstToolbarCard
        left={<AstSearchInput placeholder="Search categories..." value={search} onChange={setSearch} />}
        right={
          <>
            <HrToolbarPill variant="export" onClick={onExport}>
              Export CSV
              <svg viewBox="0 0 24 24" aria-hidden className="ast-export-icon">
                <path d="M12 3v12M7 10l5 5 5-5M5 21h14" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </HrToolbarPill>
            <AstPrimaryBtn
              onClick={() => {
                setEditRecord(undefined)
                setFormOpen(true)
              }}
            >
              + New Category
            </AstPrimaryBtn>
          </>
        }
      />
      <AstTableCard>
        <AstTableScroll>
          <table className="ast-table ui-data-table">
            <thead>
              <tr>
                <th>Category ID</th>
                <th>Category name</th>
                <th>Code prefix</th>
                <th>Description</th>
                <th>Equipment count</th>
                <th className="ast-actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>
                    <strong>{c.name}</strong>
                  </td>
                  <td>
                    <AstPrefixPill label={c.prefix} />
                  </td>
                  <td>{c.description}</td>
                  <td>
                    <AstCountPill label={categoryCount(c.name)} />
                  </td>
                  <td className="ast-actions">
                    <div className="ast-row-actions">
                      <AstIconBtn
                        label="Edit"
                        onClick={() => {
                          setEditRecord(c)
                          setFormOpen(true)
                        }}
                      >
                        <AstEditIcon />
                      </AstIconBtn>
                      <AstIconBtn
                        label="Delete"
                        onClick={() => {
                          const count = registry.filter((e) => e.category === c.name).length
                          if (count > 0) {
                            window.alert(`Remove ${count} asset(s) from ${c.name} before deleting`)
                            return
                          }
                          onUpdateCategories(categories.filter((x) => x.id !== c.id))
                        }}
                      >
                        <AstTrashIcon />
                      </AstIconBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AstTableScroll>
      </AstTableCard>

      <CategoryFormModal
        open={formOpen}
        record={editRecord}
        existingIds={categories.map((c) => c.id)}
        onClose={() => {
          setFormOpen(false)
          setEditRecord(undefined)
        }}
        onSave={saveCategory}
      />
    </div>
  )
}

type DeploymentsTabProps = {
  allocations: AssetAllocationRecord[]
  onUpdateAllocations: (next: AssetAllocationRecord[]) => void
  onReturnStock: (record: AssetAllocationRecord) => void
  onExport: () => void
  onNewAllocation: () => void
}

export function AssetDeploymentsTab({ allocations, onUpdateAllocations, onReturnStock, onExport, onNewAllocation }: DeploymentsTabProps) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(
    () => allocations.filter((a) => matchesSearch(search, [a.id, a.assetName, a.assetId, a.employee, a.status, a.handover])),
    [allocations, search],
  )

  return (
    <div className="ast-tab">
      <AstToolbarCard
        left={<AstSearchInput placeholder="Search allocations..." value={search} onChange={setSearch} />}
        right={
          <>
            <HrToolbarPill variant="export" onClick={onExport}>
              Export CSV
              <svg viewBox="0 0 24 24" aria-hidden className="ast-export-icon">
                <path d="M12 3v12M7 10l5 5 5-5M5 21h14" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </HrToolbarPill>
            <AstPrimaryBtn onClick={onNewAllocation}>+ New Allocation</AstPrimaryBtn>
          </>
        }
      />
      <AstTableCard>
        <AstTableScroll>
          <table className="ast-table ui-data-table">
            <thead>
              <tr>
                <th>Allocation ID</th>
                <th>Asset ID & name</th>
                <th>Employee targeted</th>
                <th>Checkout date</th>
                <th>Expected return</th>
                <th>Standard handover state</th>
                <th>Status</th>
                <th className="ast-actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td className="ast-id-cell">{a.id}</td>
                  <td>
                    <strong>{a.assetName}</strong>
                    <small>ID: {a.assetId}</small>
                  </td>
                  <td>
                    <strong>{a.employee}</strong>
                  </td>
                  <td>{a.checkoutDate}</td>
                  <td>{a.returnDate}</td>
                  <td className="ast-italic">{a.handover}</td>
                  <td>
                    <AstStatusPill label={a.status} tone={a.status === 'Active' ? 'success' : 'neutral'} />
                  </td>
                  <td>
                    {a.status === 'Active' ? (
                      <div className="ast-row-actions">
                        <AstOutlineBtn onClick={() => onReturnStock(a)}>RETURN STOCK</AstOutlineBtn>
                        <AstIconBtn label="Delete" onClick={() => onUpdateAllocations(allocations.filter((x) => x.id !== a.id))}>
                          <AstTrashIcon />
                        </AstIconBtn>
                      </div>
                    ) : (
                      <em className="ast-muted">Closed</em>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AstTableScroll>
      </AstTableCard>
    </div>
  )
}

type RequestsTabProps = {
  requests: AssetRequestRecord[]
  onUpdateRequests: (next: AssetRequestRecord[]) => void
  onExport: () => void
  onNewRequest: () => void
}

export function AssetRequestsTab({ requests, onUpdateRequests, onExport, onNewRequest }: RequestsTabProps) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(
    () => requests.filter((r) => matchesSearch(search, [r.id, r.employee, r.item, r.category, r.justification, r.status, r.priority])),
    [requests, search],
  )

  function setStatus(id: string, status: AssetRequestRecord['status']) {
    onUpdateRequests(requests.map((r) => (r.id === id ? { ...r, status } : r)))
  }

  function requestStatusTone(status: AssetRequestRecord['status']) {
    if (status === 'Approved') return 'success' as const
    if (status === 'Rejected') return 'danger' as const
    return 'warning' as const
  }

  return (
    <div className="ast-tab">
      <AstToolbarCard
        left={<AstSearchInput placeholder="Search requests..." value={search} onChange={setSearch} />}
        right={
          <>
            <HrToolbarPill variant="export" onClick={onExport}>
              Export CSV
              <svg viewBox="0 0 24 24" aria-hidden className="ast-export-icon">
                <path d="M12 3v12M7 10l5 5 5-5M5 21h14" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </HrToolbarPill>
            <AstPrimaryBtn onClick={onNewRequest}>+ New Request</AstPrimaryBtn>
          </>
        }
      />
      <AstTableCard>
        <AstTableScroll>
          <table className="ast-table ui-data-table">
            <thead>
              <tr>
                <th>Req no</th>
                <th>Employee</th>
                <th>Desired item & type</th>
                <th>Business justification</th>
                <th>Priority</th>
                <th>Submit date</th>
                <th>Status</th>
                <th>Review action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td className="ast-id-cell">{r.id}</td>
                  <td>
                    <strong>{r.employee}</strong>
                  </td>
                  <td>
                    <strong>{r.item}</strong>
                    <small>{r.category}</small>
                  </td>
                  <td>{r.justification}</td>
                  <td>
                    <AstStatusPill label={r.priority} tone={priorityTone(r.priority)} />
                  </td>
                  <td>{r.submitDate}</td>
                  <td>
                    <AstStatusPill label={r.status} tone={requestStatusTone(r.status)} />
                  </td>
                  <td>
                    {r.status === 'Pending' ? (
                      <div className="ast-review-actions">
                        <button type="button" className="ast-approve-btn" onClick={() => setStatus(r.id, 'Approved')}>
                          Approve
                        </button>
                        <button type="button" className="ast-reject-link" onClick={() => setStatus(r.id, 'Rejected')}>
                          Reject
                        </button>
                      </div>
                    ) : (
                      <em className="ast-muted">Validated</em>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AstTableScroll>
      </AstTableCard>
    </div>
  )
}

type IncidentsTabProps = {
  incidents: AssetIncidentRecord[]
  registry: AssetRegistryEntry[]
  onUpdateIncidents: (next: AssetIncidentRecord[]) => void
  onExport: () => void
  onNewIncident: () => void
}

export function AssetIncidentsTab({ incidents, registry, onUpdateIncidents, onExport, onNewIncident }: IncidentsTabProps) {
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<AssetIncidentRecord | undefined>()

  const filtered = useMemo(
    () => incidents.filter((i) => matchesSearch(search, [i.id, i.assetName, i.assetId, i.custodian, i.trigger, i.resolveLevel, i.payrollLabel])),
    [incidents, search],
  )

  function payrollTone(label: string) {
    if (label === 'ACTIVE CHARGE') return 'warning' as const
    return 'neutral' as const
  }

  function resolveTone(level: string) {
    if (level.startsWith('Resolved')) return 'success' as const
    if (level.startsWith('Under Repair')) return 'warning' as const
    return 'info' as const
  }

  function saveIncident(record: AssetIncidentRecord) {
    const idx = incidents.findIndex((i) => i.id === record.id)
    if (idx >= 0) {
      const next = [...incidents]
      next[idx] = record
      onUpdateIncidents(next)
    } else {
      onUpdateIncidents([record, ...incidents])
    }
  }

  return (
    <div className="ast-tab">
      <AstToolbarCard
        left={<AstSearchInput placeholder="Search damages & repair..." value={search} onChange={setSearch} />}
        right={
          <>
            <HrToolbarPill variant="export" onClick={onExport}>
              Export CSV
              <svg viewBox="0 0 24 24" aria-hidden className="ast-export-icon">
                <path d="M12 3v12M7 10l5 5 5-5M5 21h14" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </HrToolbarPill>
            <AstPrimaryBtn onClick={onNewIncident}>+ New Incident</AstPrimaryBtn>
          </>
        }
      />
      <AstTableCard>
        <AstTableScroll>
          <table className="ast-table ui-data-table">
            <thead>
              <tr>
                <th>Log no</th>
                <th>Asset involved</th>
                <th>Custodian</th>
                <th>Incident trigger</th>
                <th>Report date</th>
                <th>Est repair (RM)</th>
                <th>Payroll ded.</th>
                <th>Resolve level</th>
                <th className="ast-actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id}>
                  <td className="ast-id-cell">{i.id}</td>
                  <td>
                    <strong>{i.assetName}</strong>
                    <small>ID: {i.assetId}</small>
                  </td>
                  <td>{i.custodian}</td>
                  <td>{i.trigger}</td>
                  <td>{i.reportDate}</td>
                  <td>{i.repairCost}</td>
                  <td>
                    <AstStatusPill label={i.payrollLabel} tone={payrollTone(i.payrollLabel)} />
                  </td>
                  <td>
                    <AstStatusPill label={i.resolveLevel.split(' / ')[0]} tone={resolveTone(i.resolveLevel)} />
                  </td>
                  <td className="ast-actions">
                    <div className="ast-row-actions">
                      <AstIconBtn
                        label="Edit"
                        onClick={() => {
                          setEditRecord(i)
                          setFormOpen(true)
                        }}
                      >
                        <AstEditIcon />
                      </AstIconBtn>
                      <AstIconBtn label="Delete" onClick={() => onUpdateIncidents(incidents.filter((x) => x.id !== i.id))}>
                        <AstTrashIcon />
                      </AstIconBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AstTableScroll>
      </AstTableCard>

      <IncidentFormModal
        open={formOpen}
        record={editRecord}
        registry={registry}
        existingIds={incidents.map((i) => i.id)}
        onClose={() => {
          setFormOpen(false)
          setEditRecord(undefined)
        }}
        onSave={saveIncident}
      />
    </div>
  )
}

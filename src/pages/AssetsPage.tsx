import { useMemo, useState } from 'react'
import {
  formatAssetValue,
  initialsFor,
  parseAssetValue,
  seedAllocations,
  seedCategories,
  seedIncidents,
  seedRegistry,
  seedRequests,
} from '../data/mockAssets'
import type { AssetAllocationRecord, AssetModuleTab } from '../types/assets'
import { NewAllocationModal, NewRequestModal, IncidentFormModal } from '../components/assets/AssetsModals'
import {
  AssetCategoriesTab,
  AssetDeploymentsTab,
  AssetIncidentsTab,
  AssetRegistryTab,
  AssetRequestsTab,
  exportCsv,
} from '../components/assets/AssetsTabs'
import { RecruitIconKpi } from '../components/recruitment/RecruitmentPrimitives'
import '../styles/assets.css'
import '../styles/recruitment.css'

const MODULE_TABS = [
  { id: 'registry' as const, label: 'Asset Registry' },
  { id: 'categories' as const, label: 'Asset Categories' },
  { id: 'deployments' as const, label: 'Deployments & Sign-off' },
  { id: 'requests' as const, label: 'Awaiting Requests' },
  { id: 'incidents' as const, label: 'Incident & Damages' },
]

export function AssetsPage() {
  const [moduleTab, setModuleTab] = useState<AssetModuleTab>('registry')
  const [registry, setRegistry] = useState(seedRegistry)
  const [categories, setCategories] = useState(seedCategories)
  const [allocations, setAllocations] = useState(seedAllocations)
  const [requests, setRequests] = useState(seedRequests)
  const [incidents, setIncidents] = useState(seedIncidents)

  const [allocOpen, setAllocOpen] = useState(false)
  const [requestOpen, setRequestOpen] = useState(false)
  const [incidentOpen, setIncidentOpen] = useState(false)

  const kpis = useMemo(() => {
    const inUse = registry.filter((e) => e.status === 'In Use').length
    const available = registry.filter((e) => e.status === 'Available').length
    const maintenance = registry.filter((e) => e.status === 'Maintenance').length
    const totalValue = registry.reduce((sum, e) => sum + parseAssetValue(e.value), 0)
    return { inUse, available, maintenance, totalValue, total: registry.length }
  }, [registry])

  function removeAsset(id: string) {
    setRegistry((prev) => prev.filter((e) => e.id !== id))
    setAllocations((prev) => prev.filter((a) => a.assetId !== id))
    setIncidents((prev) => prev.filter((i) => i.assetId !== id))
  }

  function returnAllocation(record: AssetAllocationRecord) {
    setAllocations((prev) => prev.map((a) => (a.id === record.id ? { ...a, status: 'Returned' } : a)))
    setRegistry((prev) =>
      prev.map((e) =>
        e.id === record.assetId
          ? { ...e, status: 'Available', statusTone: 'info', assigneeLabel: 'Stock (Unallocated)', assigneeInitials: undefined }
          : e,
      ),
    )
  }

  function addAllocation(record: AssetAllocationRecord) {
    setAllocations((prev) => [...prev, record])
    setRegistry((prev) =>
      prev.map((e) =>
        e.id === record.assetId
          ? { ...e, status: 'In Use', statusTone: 'success', assigneeLabel: record.employee, assigneeInitials: initialsFor(record.employee) }
          : e,
      ),
    )
  }

  function exportRegistry() {
    exportCsv('Registry CSV', [
      ['Asset ID', 'Name', 'Serial', 'Category', 'Custodian', 'Status', 'Purchase date', 'Value'],
      ...registry.map((e) => [e.id, e.name, e.serial, e.category, e.assigneeLabel, e.status, e.purchaseDate, e.value]),
    ])
  }

  function exportCategories() {
    exportCsv('Categories CSV', [
      ['Category ID', 'Name', 'Prefix', 'Description', 'Count'],
      ...categories.map((c) => [c.id, c.name, c.prefix, c.description, `${registry.filter((e) => e.category === c.name).length} items`]),
    ])
  }

  function exportAllocations() {
    exportCsv('Allocations CSV', [
      ['Allocation ID', 'Asset ID', 'Asset name', 'Employee', 'Checkout', 'Return', 'Status'],
      ...allocations.map((a) => [a.id, a.assetId, a.assetName, a.employee, a.checkoutDate, a.returnDate, a.status]),
    ])
  }

  function exportRequests() {
    exportCsv('Requests CSV', [
      ['Request ID', 'Employee', 'Item', 'Category', 'Priority', 'Status', 'Submit date'],
      ...requests.map((r) => [r.id, r.employee, r.item, r.category, r.priority, r.status, r.submitDate]),
    ])
  }

  function exportIncidents() {
    exportCsv('Incidents CSV', [
      ['Incident ID', 'Asset ID', 'Asset name', 'Custodian', 'Trigger', 'Repair cost', 'Resolve level'],
      ...incidents.map((i) => [i.id, i.assetId, i.assetName, i.custodian, i.trigger, i.repairCost, i.resolveLevel]),
    ])
  }

  return (
    <div className="ast-module">
      <div className="ast-kpi-row">
        <RecruitIconKpi
          title="Total Portfolio Value"
          value={`RM ${formatAssetValue(kpis.totalValue)}.00`}
          subtext={`${kpis.total} items catalogued`}
          icon="📦"
          iconColor="#2563eb"
        />
        <RecruitIconKpi
          title="Active In Use"
          value={`${kpis.inUse} / ${kpis.total}`}
          subtext="Deployed to workforce employees"
          icon="👤"
          iconColor="#059669"
          trend="✓ DEPLOYED"
        />
        <RecruitIconKpi
          title="Warehouse Stock"
          value={`${kpis.available} available`}
          subtext="Ready for instant assignment"
          icon="▤"
          iconColor="#7c3aed"
        />
        <RecruitIconKpi
          title="Damage & Refurbish"
          value={`${kpis.maintenance} flagged`}
          subtext="Diagnostics / repair workshop"
          icon="🔧"
          iconColor="#d97706"
          trend="● ATTENTION"
        />
      </div>

      <div className="ast-tab-toolbar-row">
        <nav className="ast-module-tabs" aria-label="Assets modules">
          {MODULE_TABS.map((t) => (
            <button key={t.id} type="button" className={moduleTab === t.id ? 'active' : ''} onClick={() => setModuleTab(t.id)}>
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="ast-module-body">
        {moduleTab === 'registry' ? (
          <AssetRegistryTab
            registry={registry}
            categories={categories}
            allocations={allocations}
            onUpdateRegistry={setRegistry}
            onRemoveAsset={removeAsset}
            onExport={exportRegistry}
          />
        ) : null}
        {moduleTab === 'categories' ? (
          <AssetCategoriesTab categories={categories} registry={registry} onUpdateCategories={setCategories} onExport={exportCategories} />
        ) : null}
        {moduleTab === 'deployments' ? (
          <AssetDeploymentsTab
            allocations={allocations}
            onUpdateAllocations={setAllocations}
            onReturnStock={returnAllocation}
            onExport={exportAllocations}
            onNewAllocation={() => setAllocOpen(true)}
          />
        ) : null}
        {moduleTab === 'requests' ? (
          <AssetRequestsTab requests={requests} onUpdateRequests={setRequests} onExport={exportRequests} onNewRequest={() => setRequestOpen(true)} />
        ) : null}
        {moduleTab === 'incidents' ? (
          <AssetIncidentsTab
            incidents={incidents}
            registry={registry}
            onUpdateIncidents={setIncidents}
            onExport={exportIncidents}
            onNewIncident={() => setIncidentOpen(true)}
          />
        ) : null}
      </div>

      <NewAllocationModal
        open={allocOpen}
        registry={registry}
        existingIds={allocations.map((a) => a.id)}
        onClose={() => setAllocOpen(false)}
        onSave={addAllocation}
      />
      <NewRequestModal
        open={requestOpen}
        existingIds={requests.map((r) => r.id)}
        onClose={() => setRequestOpen(false)}
        onSave={(r) => setRequests((prev) => [r, ...prev])}
      />
      <IncidentFormModal
        open={incidentOpen}
        registry={registry}
        existingIds={incidents.map((i) => i.id)}
        onClose={() => setIncidentOpen(false)}
        onSave={(r) => setIncidents((prev) => [r, ...prev])}
      />
    </div>
  )
}

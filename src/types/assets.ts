export type AssetPillTone = 'success' | 'info' | 'warning' | 'danger' | 'neutral' | 'purple'

export type AssetRegistryEntry = {
  id: string
  name: string
  serial: string
  category: string
  assigneeInitials?: string
  assigneeLabel: string
  purchaseDate: string
  value: string
  status: 'In Use' | 'Available' | 'Maintenance'
  statusTone: AssetPillTone
  location: string
  notes: string
}

export type AssetCategoryRecord = {
  id: string
  name: string
  prefix: string
  description: string
  equipmentCount: string
}

export type AssetAllocationRecord = {
  id: string
  assetName: string
  assetId: string
  employee: string
  checkoutDate: string
  returnDate: string
  handover: string
  status: string
}

export type AssetRequestRecord = {
  id: string
  employee: string
  item: string
  category: string
  justification: string
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  submitDate: string
  status: 'Pending' | 'Approved' | 'Rejected'
}

export type AssetIncidentRecord = {
  id: string
  assetName: string
  assetId: string
  custodian: string
  trigger: string
  reportDate: string
  repairCost: string
  payrollLabel: string
  resolveLevel: string
  chargePayroll: boolean
  details?: string
}

export type AssetModuleTab = 'registry' | 'categories' | 'deployments' | 'requests' | 'incidents'

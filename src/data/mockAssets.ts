import type { AssetAllocationRecord, AssetCategoryRecord, AssetIncidentRecord, AssetPillTone, AssetRegistryEntry, AssetRequestRecord } from '../types/assets'

export const ASSET_CUSTODIANS = ['Sarah Lim', 'Nadia Chen', 'Raj Kumar', 'Maya Tan', 'Ahmad Luqman', 'Stock (Unallocated)', 'Warehouse (Unassigned)']

export const ASSET_EMPLOYEES = ['Sarah Lim', 'Nadia Chen', 'Raj Kumar', 'Maya Tan', 'Ahmad Luqman', 'Ahmad Wahid']

export const ASSET_STATUSES = ['In Use', 'Available', 'Maintenance'] as const

export const ASSET_TRIGGER_TYPES = [
  'Water Damage / Spill',
  'Dead Pixels / Panel Failure',
  'Outer Enclosure Scratches',
  'Theft / Loss',
  'Software Corruption',
]

export const ASSET_RESOLVE_LEVELS = ['Under Repair / In maintenance', 'Resolved / Functional return', 'Log Only']

export const ASSET_HANDOVER_STATES = ['Brand New / Sealed', 'Good / Average', 'Good / Refurbished', 'Digital license', 'Not Applicable (SaaS)']

export const ASSET_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'] as const

export const ASSET_REQUEST_CATEGORIES = [
  'Laptops',
  'Peripherals & Accessories',
  'Monitors & Displays',
  'Mobile Devices',
  'Software Licenses',
]

export function statusToneFor(status: string): AssetPillTone {
  if (status === 'In Use' || status === 'Active' || status === 'Approved' || status === 'Resolved') return 'success'
  if (status === 'Available') return 'info'
  if (status === 'Maintenance' || status === 'Pending' || status === 'High') return 'warning'
  if (status === 'Rejected' || status === 'Critical') return 'danger'
  return 'neutral'
}

export function priorityTone(priority: string): AssetPillTone {
  if (priority === 'Critical') return 'danger'
  if (priority === 'High') return 'warning'
  if (priority === 'Low') return 'info'
  return 'info'
}

export function initialsFor(label: string): string | undefined {
  if (label.startsWith('Stock') || label.startsWith('Warehouse')) return undefined
  const parts = label.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return undefined
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return parts[0][0].toUpperCase()
}

export function parseAssetValue(raw: string): number {
  return Number.parseFloat(raw.replaceAll(',', '')) || 0
}

export function formatAssetValue(value: number): string {
  const rounded = Math.round(value)
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function nextAssetId(ids: Iterable<string>, prefix: string): string {
  let max = 0
  for (const id of ids) {
    if (!id.startsWith(prefix)) continue
    const n = Number.parseInt(id.slice(prefix.length), 10)
    if (!Number.isNaN(n) && n > max) max = n
  }
  return `${prefix}${max + 1}`
}

export function seedRegistry(): AssetRegistryEntry[] {
  return [
    {
      id: 'AST-1001',
      name: 'MacBook Pro 16" (M3 Max / 64GB / 1TB)',
      serial: 'F92DK8XLM3D6',
      category: 'Laptops',
      assigneeInitials: 'SL',
      assigneeLabel: 'Sarah Lim',
      purchaseDate: '2025-06-12',
      value: '14,899.00',
      status: 'In Use',
      statusTone: 'success',
      location: 'Kuala Lumpur HQ (Level 12)',
      notes: 'Developer primary workspace machine. High priority support warranty active.',
    },
    {
      id: 'AST-1002',
      name: 'MacBook Air 13" (M2 / 16GB / 512GB)',
      serial: 'MBA13-M2-4421',
      category: 'Laptops',
      assigneeInitials: 'RK',
      assigneeLabel: 'Raj Kumar',
      purchaseDate: '2025-02-18',
      value: '7,299.00',
      status: 'In Use',
      statusTone: 'success',
      location: 'Kuala Lumpur HQ (Level 8)',
      notes: 'Field operations laptop with extended battery pack.',
    },
    {
      id: 'AST-1003',
      name: 'Dell UltraSharp 32" 4K USB-C Hub Monitor',
      serial: 'DELL-U3223QE-901',
      category: 'Monitors & Displays',
      assigneeInitials: 'SL',
      assigneeLabel: 'Sarah Lim',
      purchaseDate: '2025-04-10',
      value: '2,899.00',
      status: 'In Use',
      statusTone: 'success',
      location: 'Kuala Lumpur HQ (Level 12)',
      notes: 'Primary design monitor — USB-C hub firmware v2.1.',
    },
    {
      id: 'AST-1004',
      name: 'iPhone 15 Pro (128GB, Space Black)',
      serial: 'IPH15P-88291',
      category: 'Mobile Devices',
      assigneeInitials: 'MT',
      assigneeLabel: 'Maya Tan',
      purchaseDate: '2024-09-30',
      value: '5,499.00',
      status: 'In Use',
      statusTone: 'success',
      location: 'Kuala Lumpur HQ',
      notes: 'Corporate line with MDM profile enrolled.',
    },
    {
      id: 'AST-1005',
      name: 'ThinkPad T14s Gen 4 (AMD Ryzen 7 pro)',
      serial: 'TP14-GEN4-8821',
      category: 'Laptops',
      assigneeLabel: 'Stock (Unallocated)',
      purchaseDate: '2025-03-08',
      value: '6,200.00',
      status: 'Available',
      statusTone: 'info',
      location: 'Warehouse — Level B1',
      notes: '—',
    },
    {
      id: 'AST-1006',
      name: 'Logitech MX Keys Mini (Graphite)',
      serial: 'LGT-MXK-2201',
      category: 'Peripherals & Accessories',
      assigneeLabel: 'Stock (Unallocated)',
      purchaseDate: '2026-01-20',
      value: '449.00',
      status: 'Available',
      statusTone: 'info',
      location: 'Warehouse — Level B1',
      notes: '—',
    },
    {
      id: 'AST-1007',
      name: 'Figma Organization Annual Seat',
      serial: 'FIG-ENT-2026',
      category: 'Software Licenses',
      assigneeInitials: 'NC',
      assigneeLabel: 'Nadia Chen',
      purchaseDate: '2026-01-15',
      value: '3,312.00',
      status: 'In Use',
      statusTone: 'success',
      location: 'Kuala Lumpur HQ',
      notes: 'Enterprise SaaS license — auto-renewal March 2027.',
    },
    {
      id: 'AST-1008',
      name: 'Mazda CX-5 2.0L (WQA 8928)',
      serial: 'WQA8928',
      category: 'Corporate Vehicles',
      assigneeLabel: 'Stock (Unallocated)',
      purchaseDate: '2024-11-20',
      value: '138,000.00',
      status: 'Maintenance',
      statusTone: 'warning',
      location: 'Service bay — AutoServ',
      notes: 'Scheduled transmission service — ETA 2026-06-25.',
    },
  ]
}

export function seedCategories(): AssetCategoryRecord[] {
  return [
    { id: 'CAT-1', name: 'Laptops', prefix: 'LAP', description: 'Development and business machines', equipmentCount: '18 items' },
    { id: 'CAT-2', name: 'Mobile Devices', prefix: 'MOB', description: 'Smartphones and communications tablets', equipmentCount: '8 items' },
    { id: 'CAT-3', name: 'Monitors & Displays', prefix: 'MON', description: '4K monitors, ultra-wide screens, docking panels', equipmentCount: '12 items' },
    { id: 'CAT-4', name: 'Peripherals & Accessories', prefix: 'PER', description: 'Keyboards, mouse, standing desk mats, webcams', equipmentCount: '15 items' },
    { id: 'CAT-5', name: 'Software Licenses', prefix: 'SF', description: 'Enterprise SaaS access and cloud resources', equipmentCount: '6 items' },
    { id: 'CAT-6', name: 'Corporate Vehicles', prefix: 'VEH', description: 'Company cars and executive transport fleets', equipmentCount: '2 items' },
  ]
}

export function seedAllocations(): AssetAllocationRecord[] {
  return [
    {
      id: 'ALC-301',
      assetName: 'MacBook Pro 16" (M3 Max / 64GB / 1TB)',
      assetId: 'AST-1001',
      employee: 'Sarah Lim',
      checkoutDate: '2025-06-12',
      returnDate: '2028-06-12',
      handover: 'Brand New / Sealed',
      status: 'Active',
    },
    {
      id: 'ALC-302',
      assetName: 'MacBook Air 13" (M2 / 16GB / 512GB)',
      assetId: 'AST-1002',
      employee: 'Raj Kumar',
      checkoutDate: '2025-02-18',
      returnDate: '2027-02-18',
      handover: 'Excellent / Like-New',
      status: 'Active',
    },
    {
      id: 'ALC-303',
      assetName: 'iPhone 15 Pro (128GB, Space Black)',
      assetId: 'AST-1004',
      employee: 'Maya Tan',
      checkoutDate: '2024-09-30',
      returnDate: '2026-09-30',
      handover: 'Sealed Box',
      status: 'Active',
    },
    {
      id: 'ALC-384',
      assetName: 'Figma Organization Annual Seat',
      assetId: 'AST-1007',
      employee: 'Nadia Chen',
      checkoutDate: '2025-03-01',
      returnDate: '2026-03-01',
      handover: 'Not Applicable (SaaS)',
      status: 'Active',
    },
  ]
}

export function seedRequests(): AssetRequestRecord[] {
  return [
    {
      id: 'REQ-401',
      employee: 'Sarah Lim',
      item: 'Logitech MX Master 3S Wireless Mouse',
      category: 'Peripherals & Accessories',
      justification: 'Standard office mouse side grip is failing...',
      priority: 'Medium',
      submitDate: '2026-05-10',
      status: 'Pending',
    },
    {
      id: 'REQ-402',
      employee: 'Maya Tan',
      item: 'Dell 27" USB-C Monitor',
      category: 'Monitors & Displays',
      justification: 'Requested dual monitor setup for easier tax accounting...',
      priority: 'Low',
      submitDate: '2026-05-08',
      status: 'Approved',
    },
    {
      id: 'REQ-403',
      employee: 'Raj Kumar',
      item: 'Laptop Travel Charger Replacement',
      category: 'Laptops',
      justification: 'Lost original charger during client site survey...',
      priority: 'High',
      submitDate: '2026-05-12',
      status: 'Pending',
    },
    {
      id: 'REQ-404',
      employee: 'Ahmad Luqman',
      item: 'Upgrade to Carbon X1 Gen 11',
      category: 'Laptops',
      justification: 'Compiling core training engines takes more than an hour...',
      priority: 'Critical',
      submitDate: '2026-04-20',
      status: 'Rejected',
    },
  ]
}

export function seedIncidents(): AssetIncidentRecord[] {
  return [
    {
      id: 'INC-501',
      assetName: 'iPhone 15 Pro (128GB, Space Black)',
      assetId: 'AST-1004',
      custodian: 'Maya Tan',
      trigger: 'Water Damage / Spill',
      reportDate: '2026-04-12',
      repairCost: '1,450.00',
      payrollLabel: 'ACTIVE CHARGE',
      resolveLevel: 'Resolved / Functional return',
      chargePayroll: true,
      details: 'Accidentally spilled office latte coffee on physical handset. Repaired main charging flex ribbon assembly.',
    },
    {
      id: 'INC-502',
      assetName: 'Dell UltraSharp 32" 4K USB-C Hub Monitor',
      assetId: 'AST-1003',
      custodian: 'Sarah Lim',
      trigger: 'Dead Pixels / Panel Failure',
      reportDate: '2026-05-02',
      repairCost: '0.00',
      payrollLabel: 'CO. ABSORBED',
      resolveLevel: 'Under Repair / In maintenance',
      chargePayroll: false,
    },
    {
      id: 'INC-503',
      assetName: 'MacBook Air 13" (M2 / 16GB / 512GB)',
      assetId: 'AST-1002',
      custodian: 'Raj Kumar',
      trigger: 'Outer Enclosure Scratches',
      reportDate: '2026-05-10',
      repairCost: '0.00',
      payrollLabel: 'CO. ABSORBED',
      resolveLevel: 'Log Only',
      chargePayroll: false,
    },
  ]
}

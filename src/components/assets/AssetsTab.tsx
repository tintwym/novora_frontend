import { useState, type FormEvent } from 'react'
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  User,
  CheckCircle2,
  AlertCircle,
  History,
  FileSpreadsheet,
  Layers,
  Wrench,
  X,
  Eye,
} from 'lucide-react'
import { showActionToast } from '../../utils/actionToast'

export type AssetsEmployeeOption = {
  id: string
  name: string
  department?: string
}

type AssetsTabProps = {
  employees: AssetsEmployeeOption[]
}

export function AssetsTab({ employees }: AssetsTabProps) {
  const addToast = (text: string, type?: 'success' | 'loading' | 'error' | 'info') => {
    showActionToast(text, type)
  }

  // Available asset tabs
  const [activeSubTab, setActiveSubTab] = useState<'Registry' | 'Categories' | 'Allocations' | 'Requests' | 'Damages & Repair'>('Registry');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All categories');
  const [statusFilter, setStatusFilter] = useState('All statuses');

  // Modal displays
  const [showModal, setShowModal] = useState<string | null>(null); // 'asset_new', 'category_new', 'alloc_new', 'incident_new', 'request_new'
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [detailDrawerItem, setDetailDrawerItem] = useState<any | null>(null);

  // DATA STATES
  const [categories, setCategories] = useState([
    { id: 'CAT-1', name: 'Laptops', code: 'LAP', description: 'Development and business machines', count: 18 },
    { id: 'CAT-2', name: 'Mobile Devices', code: 'MOB', description: 'Smartphones and communications tablets', count: 8 },
    { id: 'CAT-3', name: 'Monitors & Displays', code: 'MON', description: '4K monitors, ultra-wide screens, docking panels', count: 12 },
    { id: 'CAT-4', name: 'Peripherals & Accessories', code: 'PER', description: 'Keyboards, mouse, standing desk mats, webcams', count: 15 },
    { id: 'CAT-5', name: 'Software Licenses', code: 'SF', description: 'Enterprise SaaS access and cloud resources', count: 6 },
    { id: 'CAT-6', name: 'Corporate Vehicles', code: 'VEH', description: 'Company cars and executive transport fleets', count: 2 },
  ]);

  const [assets, setAssets] = useState([
    {
      id: 'AST-1001',
      name: 'MacBook Pro 16" (M3 Max / 64GB / 1TB)',
      serialNum: 'F92DK8XLM3D6',
      category: 'Laptops',
      custodianId: 'EMP-001',
      custodianName: 'Sarah Lim',
      status: 'In Use',
      purchaseDate: '2025-06-12',
      cost: 14899.00,
      location: 'Kuala Lumpur HQ (Level 12)',
      notes: 'Developer primary workspace machine. High priority support warranty active.'
    },
    {
      id: 'AST-1002',
      name: 'MacBook Air 13" (M2 / 16GB / 512GB)',
      serialNum: 'F40YK480K1DA',
      category: 'Laptops',
      custodianId: 'EMP-002',
      custodianName: 'Raj Kumar',
      status: 'In Use',
      purchaseDate: '2025-02-18',
      cost: 5499.00,
      location: 'Kuala Lumpur HQ (Level 10)',
      notes: 'Operations deployment machine. Clean condition.'
    },
    {
      id: 'AST-1003',
      name: 'Dell UltraSharp 32" 4K USB-C Hub Monitor',
      serialNum: 'CN0DJ18-72891-B',
      category: 'Monitors & Displays',
      custodianId: 'EMP-001',
      custodianName: 'Sarah Lim',
      status: 'In Use',
      purchaseDate: '2024-11-05',
      cost: 3200.00,
      location: 'Kuala Lumpur HQ (Level 12)',
      notes: 'Calibrated color gamut specs.'
    },
    {
      id: 'AST-1004',
      name: 'iPhone 15 Pro (128GB, Space Black)',
      serialNum: 'DX1G67H9FLW0',
      category: 'Mobile Devices',
      custodianId: 'EMP-003',
      custodianName: 'Maya Tan',
      status: 'In Use',
      purchaseDate: '2024-09-30',
      cost: 4899.00,
      location: 'Kuala Lumpur HQ (Level 11)',
      notes: 'Testing rig and emergency contact device.'
    },
    {
      id: 'AST-1005',
      name: 'ThinkPad T14s Gen 4 (AMD Ryzen 7 pro)',
      serialNum: 'PF-49DKW1',
      category: 'Laptops',
      custodianId: 'Unassigned',
      custodianName: '—',
      status: 'Available',
      purchaseDate: '2025-07-02',
      cost: 6200.00,
      location: 'Warehouse Closet B',
      notes: 'Freshly provisioned standard finance staff machine.'
    },
    {
      id: 'AST-1006',
      name: 'Keychron K8 Pro Mechanical Keyboard',
      serialNum: 'KC8-892182',
      category: 'Peripherals & Accessories',
      custodianId: 'Unassigned',
      custodianName: '—',
      status: 'Available',
      purchaseDate: '2025-01-15',
      cost: 450.00,
      location: 'Warehouse Closet A',
      notes: 'Gateron Brown switches. Hot-swappable layout.'
    },
    {
      id: 'AST-1007',
      name: 'Figma Organization Annual Seat',
      serialNum: 'LIC-FIG-082',
      category: 'Software Licenses',
      custodianId: 'EMP-005',
      custodianName: 'Nadia Chen',
      status: 'In Use',
      purchaseDate: '2025-03-01',
      cost: 3312.00,
      location: 'Cloud / Remote',
      notes: 'Marketing and visual production team seat. Renewable.'
    },
    {
      id: 'AST-1008',
      name: 'Mazda CX-5 2.0L (WQA 8928)',
      serialNum: 'MZD5-891280918-B',
      category: 'Corporate Vehicles',
      custodianId: 'Unassigned',
      custodianName: '—',
      status: 'Maintenance',
      purchaseDate: '2024-04-10',
      cost: 138000.00,
      location: 'External Panel Workshop',
      notes: 'Scheduled minor engine overhaul and suspension tuning diagnostics.'
    }
  ]);

  const [allocations, setAllocations] = useState([
    {
      id: 'ALC-301',
      assetId: 'AST-1001',
      assetName: 'MacBook Pro 16" (M3 Max / 64GB / 1TB)',
      employeeId: 'EMP-001',
      employeeName: 'Sarah Lim',
      checkoutDate: '2025-06-12',
      dueDate: '2028-06-12',
      condition: 'Brand New / Sealed',
      status: 'Active'
    },
    {
      id: 'ALC-302',
      assetId: 'AST-1002',
      assetName: 'MacBook Air 13" (M2 / 16GB / 512GB)',
      employeeId: 'EMP-002',
      employeeName: 'Raj Kumar',
      checkoutDate: '2025-02-18',
      dueDate: '2027-02-18',
      condition: 'Excellent / Like-New',
      status: 'Active'
    },
    {
      id: 'ALC-303',
      assetId: 'AST-1004',
      assetName: 'iPhone 15 Pro (128GB, Space Black)',
      employeeId: 'EMP-003',
      employeeName: 'Maya Tan',
      checkoutDate: '2024-09-30',
      dueDate: '2026-09-30',
      condition: 'Sealed Box',
      status: 'Active'
    },
    {
      id: 'ALC-304',
      assetId: 'AST-1007',
      assetName: 'Figma Organization Annual Seat',
      employeeId: 'EMP-005',
      employeeName: 'Nadia Chen',
      checkoutDate: '2025-03-01',
      dueDate: '2026-03-01',
      condition: 'Not Applicable (SaaS)',
      status: 'Active'
    }
  ]);

  const [requests, setRequests] = useState([
    {
      id: 'REQ-401',
      employeeId: 'EMP-001',
      employeeName: 'Sarah Lim',
      category: 'Peripherals & Accessories',
      assetRequested: 'Logitech MX Master 3S Wireless Mouse',
      reason: 'Standard office mouse side grip is failing and causing wrist strain.',
      priority: 'Medium',
      requestDate: '2026-05-10',
      status: 'Pending'
    },
    {
      id: 'REQ-402',
      employeeId: 'EMP-003',
      employeeName: 'Maya Tan',
      category: 'Monitors & Displays',
      assetRequested: 'Dell 27" USB-C Monitor P2723DE',
      reason: 'Requested dual monitor setup for easier tax accounting ledgers auditing.',
      priority: 'Low',
      requestDate: '2026-05-08',
      status: 'Approved'
    },
    {
      id: 'REQ-403',
      employeeId: 'EMP-002',
      employeeName: 'Raj Kumar',
      category: 'Laptops',
      assetRequested: 'Laptop Travel Charger Replacement (96W USB-C)',
      reason: 'Lost original charger during client site survey visitation in Penang.',
      priority: 'High',
      requestDate: '2026-05-12',
      status: 'Pending'
    },
    {
      id: 'REQ-404',
      employeeId: 'EMP-004',
      employeeName: 'Ahmad Luqman',
      category: 'Laptops',
      assetRequested: 'Upgrade to Carbon X1 Gen 11',
      reason: 'Compiling core training engines takes more than an hour on dual-core machine.',
      priority: 'Critical',
      requestDate: '2026-04-20',
      status: 'Rejected'
    }
  ]);

  const [incidents, setIncidents] = useState([
    {
      id: 'INC-501',
      assetId: 'AST-1004',
      assetName: 'iPhone 15 Pro (128GB, Space Black)',
      employeeId: 'EMP-003',
      employeeName: 'Maya Tan',
      incidentType: 'Water Damage',
      reportedDate: '2026-04-12',
      costToRepair: 1450.00,
      payrollDeduction: true,
      status: 'Resolved',
      description: 'Accidentally spilled office latte coffee on physical handset. Repaired main charging flex ribbon assembly.'
    },
    {
      id: 'INC-502',
      assetId: 'AST-1003',
      assetName: 'Dell UltraSharp 32" 4K USB-C Hub Monitor',
      employeeId: 'EMP-001',
      employeeName: 'Sarah Lim',
      incidentType: 'Dead Pixels / Panel Failure',
      reportedDate: '2026-05-02',
      costToRepair: 0.00,
      payrollDeduction: false,
      status: 'Under Repair',
      description: 'Vertical lines at coordinate right. Sent to Dell supplier warranty cluster. Estimated turnaround 8 days.'
    },
    {
      id: 'INC-503',
      assetId: 'AST-1002',
      assetName: 'MacBook Air 13" (M2 / 16GB / 512GB)',
      employeeId: 'EMP-002',
      employeeName: 'Raj Kumar',
      incidentType: 'Outer Enclosure Scratches',
      reportedDate: '2026-05-10',
      costToRepair: 0.00,
      payrollDeduction: false,
      status: 'Log Only',
      description: 'Minor superficial corner dents received during travel, keyboard functional.'
    }
  ]);

  // FORM CONTROLLERS
  // Assets
  const [formAssetName, setFormAssetName] = useState('');
  const [formAssetSerial, setFormAssetSerial] = useState('');
  const [formAssetCategory, setFormAssetCategory] = useState('Laptops');
  const [formAssetCustodian, setFormAssetCustodian] = useState('Unassigned');
  const [formAssetPurchaseDate, setFormAssetPurchaseDate] = useState('2026-05-19');
  const [formAssetCost, setFormAssetCost] = useState('');
  const [formAssetLocation, setFormAssetLocation] = useState('Kuala Lumpur HQ');
  const [formAssetStatus, setFormAssetStatus] = useState('Available');
  const [formAssetNotes, setFormAssetNotes] = useState('');

  // Categories
  const [formCatName, setFormCatName] = useState('');
  const [formCatCode, setFormCatCode] = useState('');
  const [formCatDesc, setFormCatDesc] = useState('');

  // Allocations
  const [formAllocAssetId, setFormAllocAssetId] = useState('');
  const [formAllocEmployeeId, setFormAllocEmployeeId] = useState('');
  const [formAllocDate, setFormAllocDate] = useState('2026-05-19');
  const [formAllocDueDate, setFormAllocDueDate] = useState('2028-05-19');
  const [formAllocCond, setFormAllocCond] = useState('Good / Average');

  // Incidents
  const [formIncAssetId, setFormIncAssetId] = useState('');
  const [formIncEmployeeId, setFormIncEmployeeId] = useState('');
  const [formIncType, setFormIncType] = useState('Water Damage');
  const [formIncCost, setFormIncCost] = useState('');
  const [formIncDeduct, setFormIncDeduct] = useState(false);
  const [formIncStatus, setFormIncStatus] = useState('Under Repair');
  const [formIncDesc, setFormIncDesc] = useState('');

  // Requests on behalf / user
  const [formReqEmployeeId, setFormReqEmployeeId] = useState('');
  const [formReqCategory, setFormReqCategory] = useState('Laptops');
  const [formReqName, setFormReqName] = useState('');
  const [formReqReason, setFormReqReason] = useState('');
  const [formReqPriority, setFormReqPriority] = useState('Medium');

  // RESETTERS
  const resetForms = () => {
    setEditingItem(null);
    setShowModal(null);

    // Asset
    setFormAssetName('');
    setFormAssetSerial('');
    setFormAssetCategory('Laptops');
    setFormAssetCustodian('Unassigned');
    setFormAssetPurchaseDate('2026-05-19');
    setFormAssetCost('');
    setFormAssetLocation('Kuala Lumpur HQ');
    setFormAssetStatus('Available');
    setFormAssetNotes('');

    // Cat
    setFormCatName('');
    setFormCatCode('');
    setFormCatDesc('');

    // Alloc
    setFormAllocAssetId('');
    setFormAllocEmployeeId('');
    setFormAllocDate('2026-05-19');
    setFormAllocDueDate('2028-05-19');
    setFormAllocCond('Good / Average');

    // Incidents
    setFormIncAssetId('');
    setFormIncEmployeeId('');
    setFormIncType('Water Damage');
    setFormIncCost('');
    setFormIncDeduct(false);
    setFormIncStatus('Under Repair');
    setFormIncDesc('');

    // Requests
    setFormReqEmployeeId(employees[0]?.id || '');
    setFormReqCategory('Laptops');
    setFormReqName('');
    setFormReqReason('');
    setFormReqPriority('Medium');
  };

  // HANDLERS
  const handleSaveAsset = (e: FormEvent) => {
    e.preventDefault();
    if (!formAssetName.trim() || !formAssetSerial.trim()) {
      addToast('Please fill out the name and serial number fields.', 'error');
      return;
    }

    const matchedEmp = employees.find(emp => emp.id === formAssetCustodian);
    const custName = matchedEmp ? matchedEmp.name : '—';
    const finalCost = parseFloat(formAssetCost) || 0.00;

    if (editingItem) {
      // Update
      setAssets(prev =>
        prev.map(item =>
          item.id === editingItem.id
            ? {
                ...item,
                name: formAssetName,
                serialNum: formAssetSerial,
                category: formAssetCategory,
                custodianId: formAssetCustodian,
                custodianName: custName,
                status: formAssetStatus as any,
                purchaseDate: formAssetPurchaseDate,
                cost: finalCost,
                location: formAssetLocation,
                notes: formAssetNotes
              }
            : item
        )
      );

      // Check if standard custodian was updated, then update the related allocations active
      if (formAssetCustodian !== editingItem.custodianId) {
        if (formAssetCustodian === 'Unassigned') {
          // Retire or stop active allocations
          setAllocations(prev => prev.filter(alc => alc.assetId !== editingItem.id));
        } else {
          // Remove from previous employee allocation
          const activeAllocExists = allocations.some(alc => alc.assetId === editingItem.id);
          if (activeAllocExists) {
            setAllocations(prev =>
              prev.map(alc =>
                alc.assetId === editingItem.id
                  ? {
                      ...alc,
                      employeeId: formAssetCustodian,
                      employeeName: custName,
                      checkoutDate: new Date().toISOString().split('T')[0]
                    }
                  : alc
              )
            );
          } else {
            // Create a brand new active allocation log
            setAllocations(prev => [
              ...prev,
              {
                id: `ALC-${Date.now().toString().slice(-3)}`,
                assetId: editingItem.id,
                assetName: formAssetName,
                employeeId: formAssetCustodian,
                employeeName: custName,
                checkoutDate: new Date().toISOString().split('T')[0],
                dueDate: new Date(Date.now() + 365 * 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                condition: 'Good / Transferred',
                status: 'Active'
              }
            ]);
          }
        }
      }

      addToast(`Asset ${editingItem.id} updated successfully`, 'success');
    } else {
      // Add Brand New Asset
      const newId = `AST-${1000 + assets.length + 1}`;
      const newAsset = {
        id: newId,
        name: formAssetName,
        serialNum: formAssetSerial,
        category: formAssetCategory,
        custodianId: formAssetCustodian,
        custodianName: custName,
        status: (formAssetCustodian !== 'Unassigned' ? 'In Use' : formAssetStatus) as any,
        purchaseDate: formAssetPurchaseDate,
        cost: finalCost,
        location: formAssetLocation,
        notes: formAssetNotes
      };

      setAssets(prev => [...prev, newAsset]);

      // If assigned directly on creation, make an allocation log
      if (formAssetCustodian !== 'Unassigned') {
        const newAlloc = {
          id: `ALC-${Date.now().toString().slice(-3)}`,
          assetId: newId,
          assetName: formAssetName,
          employeeId: formAssetCustodian,
          employeeName: custName,
          checkoutDate: formAssetPurchaseDate || new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 365 * 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          condition: 'New Draft Intake',
          status: 'Active' as const
        };
        setAllocations(prev => [...prev, newAlloc]);
      }

      // Increment category count
      setCategories(prev =>
        prev.map(cat => (cat.name === formAssetCategory ? { ...cat, count: cat.count + 1 } : cat))
      );

      addToast(`Registered new asset: ${formAssetName}`, 'success');
    }

    resetForms();
  };

  const handleSaveCategory = (e: FormEvent) => {
    e.preventDefault();
    if (!formCatName.trim() || !formCatCode.trim()) {
      addToast('Category title and identification code are required.', 'error');
      return;
    }

    if (editingItem) {
      setCategories(prev =>
        prev.map(item =>
          item.id === editingItem.id
            ? { ...item, name: formCatName, code: formCatCode.toUpperCase(), description: formCatDesc }
            : item
        )
      );
      addToast(`Category ${formCatName} updated successfully`, 'success');
    } else {
      const newCategory = {
        id: `CAT-${categories.length + 1}`,
        name: formCatName,
        code: formCatCode.toUpperCase(),
        description: formCatDesc || 'No summary configured',
        count: 0
      };
      setCategories(prev => [...prev, newCategory]);
      addToast(`Category ${formCatName} created`, 'success');
    }
    resetForms();
  };

  const handleCreateAllocation = (e: FormEvent) => {
    e.preventDefault();
    if (!formAllocAssetId || !formAllocEmployeeId) {
      addToast('Please select both a physical asset and employee target.', 'error');
      return;
    }

    const matchedAsset = assets.find(a => a.id === formAllocAssetId);
    if (!matchedAsset) return;

    const matchedEmp = employees.find(emp => emp.id === formAllocEmployeeId);
    if (!matchedEmp) return;

    // Check if asset is already assigned
    if (matchedAsset.status === 'In Use' && matchedAsset.custodianId !== 'Unassigned' && matchedAsset.custodianId !== formAllocEmployeeId) {
      addToast(`Warning: ${matchedAsset.name} currently designated to ${matchedAsset.custodianName}. Reassigning custody.`, 'info');
    }

    const newAlloc = {
      id: `ALC-${Date.now().toString().slice(-3)}`,
      assetId: formAllocAssetId,
      assetName: matchedAsset.name,
      employeeId: formAllocEmployeeId,
      employeeName: matchedEmp.name,
      checkoutDate: formAllocDate,
      dueDate: formAllocDueDate,
      condition: formAllocCond,
      status: 'Active' as const
    };

    setAllocations(prev => [newAlloc, ...prev]);

    // Update asset state
    setAssets(prev =>
      prev.map(item =>
        item.id === formAllocAssetId
          ? { ...item, custodianId: formAllocEmployeeId, custodianName: matchedEmp.name, status: 'In Use' }
          : item
      )
    );

    addToast(`Successfully hand-over setup of ${matchedAsset.name} to ${matchedEmp.name}`, 'success');
    resetForms();
  };

  const handleSaveIncident = (e: FormEvent) => {
    e.preventDefault();
    if (!formIncAssetId || !formIncEmployeeId) {
      addToast('Incident log must specify physical asset and active custodian.', 'error');
      return;
    }

    const matchedAsset = assets.find(a => a.id === formIncAssetId);
    const matchedEmp = employees.find(emp => emp.id === formIncEmployeeId);
    if (!matchedAsset || !matchedEmp) return;

    const costNum = parseFloat(formIncCost) || 0;

    if (editingItem) {
      setIncidents(prev =>
        prev.map(item =>
          item.id === editingItem.id
            ? {
                ...item,
                assetId: formIncAssetId,
                assetName: matchedAsset.name,
                employeeId: formIncEmployeeId,
                employeeName: matchedEmp.name,
                incidentType: formIncType,
                costToRepair: costNum,
                payrollDeduction: formIncDeduct,
                status: formIncStatus as any,
                description: formIncDesc
              }
            : item
        )
      );

      // If asset is resolved, set the underlying asset check to available or keep in use
      if (formIncStatus === 'Resolved') {
        setAssets(prev =>
          prev.map(item =>
            item.id === formIncAssetId && item.status === 'Maintenance'
              ? { ...item, status: 'In Use' }
              : item
          )
        );
      } else if (formIncStatus === 'Under Repair') {
        setAssets(prev =>
          prev.map(item =>
            item.id === formIncAssetId ? { ...item, status: 'Maintenance' } : item
          )
        );
      }

      addToast(`Incident report ${editingItem.id} updated`, 'success');
    } else {
      const newInc = {
        id: `INC-50${incidents.length + 1}`,
        assetId: formIncAssetId,
        assetName: matchedAsset.name,
        employeeId: formIncEmployeeId,
        employeeName: matchedEmp.name,
        incidentType: formIncType,
        reportedDate: new Date().toISOString().split('T')[0],
        costToRepair: costNum,
        payrollDeduction: formIncDeduct,
        status: formIncStatus as any,
        description: formIncDesc || 'Spontaneous structural hazard'
      };

      setIncidents(prev => [newInc, ...prev]);

      // If damage report under repair, update asset status
      if (formIncStatus === 'Under Repair') {
        setAssets(prev =>
          prev.map(item =>
            item.id === formIncAssetId ? { ...item, status: 'Maintenance' } : item
          )
        );
      }

      addToast(`Asset Incident logged for ${matchedAsset.name}`, 'success');
    }

    resetForms();
  };

  const handleCreateRequest = (e: FormEvent) => {
    e.preventDefault();
    if (!formReqName.trim()) {
      addToast('Please write what asset item is being requested.', 'error');
      return;
    }

    const matchedEmp = employees.find(emp => emp.id === formReqEmployeeId) || employees[0];
    const newReqId = `REQ-40${requests.length + 1}`;
    const newReq = {
      id: newReqId,
      employeeId: matchedEmp.id,
      employeeName: matchedEmp.name,
      category: formReqCategory,
      assetRequested: formReqName,
      reason: formReqReason || 'For remote workflows task expansion',
      priority: formReqPriority,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };

    setRequests(prev => [newReq, ...prev]);
    addToast(`Asset request submitted on behalf of ${matchedEmp.name}`, 'success');
    resetForms();
  };

  const handleApproveRequest = (req: any) => {
    // 1. Mark request as Approved
    setRequests(prev =>
      prev.map(item => (item.id === req.id ? { ...item, status: 'Approved' } : item))
    );

    // 2. Find if an available asset fits this category to auto-assign, or make a mock new asset
    const availableMatch = assets.find(a => a.category === req.category && a.status === 'Available');

    if (availableMatch) {
      // Assign the available asset
      setAssets(prev =>
        prev.map(a =>
          a.id === availableMatch.id
            ? { ...a, custodianId: req.employeeId, custodianName: req.employeeName, status: 'In Use' }
            : a
        )
      );

      // Add allocation log
      setAllocations(prev => [
        {
          id: `ALC-${Date.now().toString().slice(-3)}`,
          assetId: availableMatch.id,
          assetName: availableMatch.name,
          employeeId: req.employeeId,
          employeeName: req.employeeName,
          checkoutDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 365 * 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          condition: 'Allocated from Warehouse Stock',
          status: 'Active'
        },
        ...prev
      ]);
      addToast(`Request approved! Standard stock item ${availableMatch.id} allocated.`, 'success');
    } else {
      // Provision a fresh virtual asset
      const newId = `AST-${1000 + assets.length + 1}`;
      const newAsset = {
        id: newId,
        name: req.assetRequested,
        serialNum: `PRV-${Date.now().toString().slice(-6)}`,
        category: req.category,
        custodianId: req.employeeId,
        custodianName: req.employeeName,
        status: 'In Use' as const,
        purchaseDate: new Date().toISOString().split('T')[0],
        cost: 1500.00,
        location: 'Kuala Lumpur HQ',
        notes: `Provisioned automatically from approved Request: ${req.id}`
      };

      setAssets(prev => [...prev, newAsset]);

      setAllocations(prev => [
        {
          id: `ALC-${Date.now().toString().slice(-3)}`,
          assetId: newId,
          assetName: req.assetRequested,
          employeeId: req.employeeId,
          employeeName: req.employeeName,
          checkoutDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 365 * 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          condition: 'New Procurement Allocation',
          status: 'Active'
        },
        ...prev
      ]);

      // Update category count
      setCategories(prev =>
        prev.map(cat => (cat.name === req.category ? { ...cat, count: cat.count + 1 } : cat))
      );

      addToast(`Approved! New procurement asset ${newId} initialized.`, 'success');
    }
  };

  const handleRejectRequest = (reqId: string) => {
    setRequests(prev =>
      prev.map(item => (item.id === reqId ? { ...item, status: 'Rejected' } : item))
    );
    addToast('Request set to Rejected', 'info');
  };

  const handleReturnAsset = (allocId: string) => {
    const matchedAlloc = allocations.find(al => al.id === allocId);
    if (!matchedAlloc) return;

    // 1. Set allocation to Returned
    setAllocations(prev =>
      prev.map(al => (al.id === allocId ? { ...al, status: 'Returned' as any } : al))
    );

    // 2. Set asset custodian to Unassigned and status to Available
    setAssets(prev =>
      prev.map(item =>
        item.id === matchedAlloc.assetId
          ? { ...item, custodianId: 'Unassigned', custodianName: '—', status: 'Available' as any }
          : item
      )
    );

    addToast(`Asset ${matchedAlloc.assetId} successfully checked back into stock registry`, 'success');
  };

  const handleDeleteItem = (type: 'asset' | 'category' | 'alloc' | 'incident' | 'request', id: string) => {
    if (!window.confirm('Are you sure you want to delete this log entry? This cannot be undone.')) {
      return;
    }

    if (type === 'asset') {
      const toDelete = assets.find(a => a.id === id);
      setAssets(prev => prev.filter(item => item.id !== id));
      setAllocations(prev => prev.filter(item => item.assetId !== id));

      if (toDelete) {
        setCategories(prev =>
          prev.map(cat => (cat.name === toDelete.category ? { ...cat, count: Math.max(0, cat.count - 1) } : cat))
        );
      }
      addToast(`Asset record ${id} removed.`, 'success');
    } else if (type === 'category') {
      setCategories(prev => prev.filter(item => item.id !== id));
      addToast('Category record removed.', 'success');
    } else if (type === 'alloc') {
      setAllocations(prev => prev.filter(item => item.id !== id));
      addToast('Allocation history track deleted.', 'success');
    } else if (type === 'incident') {
      setIncidents(prev => prev.filter(item => item.id !== id));
      addToast('Incident audit log removed.', 'success');
    } else if (type === 'request') {
      setRequests(prev => prev.filter(item => item.id !== id));
      addToast('Request docket deleted.', 'success');
    }
  };

  // EXPORT EXCEL
  const handleExportCSV = () => {
    addToast('Assembling asset report CSV pipeline...', 'loading');

    let headers = '';
    let rows = [];

    if (activeSubTab === 'Registry') {
      headers = 'Asset ID,Asset Name,Serial Tag,Category,Custodian,Status,Purchase Date,Value(RM),Location\n';
      rows = assets.map(a =>
        `"${a.id}","${a.name}","${a.serialNum}","${a.category}","${a.custodianName}","${a.status}","${a.purchaseDate}",${a.cost},"${a.location}"`
      );
    } else if (activeSubTab === 'Categories') {
      headers = 'Category ID,Category Name,Code prefix,Description,Total Assets\n';
      rows = categories.map(c =>
        `"${c.id}","${c.name}","${c.code}","${c.description}",${c.count}`
      );
    } else if (activeSubTab === 'Allocations') {
      headers = 'Allocation ID,Asset ID,Asset Name,Employee,Checkout Date,Due Date,Condition,Status\n';
      rows = allocations.map(al =>
        `"${al.id}","${al.assetId}","${al.assetName}","${al.employeeName}","${al.checkoutDate}","${al.dueDate}","${al.condition}","${al.status}"`
      );
    } else if (activeSubTab === 'Requests') {
      headers = 'Request ID,Employee,Category,Asset Item Requested,Request Date,Priority,Status\n';
      rows = requests.map(r =>
        `"${r.id}","${r.employeeName}","${r.category}","${r.assetRequested}","${r.requestDate}","${r.priority}","${r.status}"`
      );
    } else {
      headers = 'Incident ID,Asset ID,Asset Name,Employee,Incident Type,Reported Date,Cost(RM),Payroll charge,Status\n';
      rows = incidents.map(inc =>
        `"${inc.id}","${inc.assetId}","${inc.assetName}","${inc.employeeName}","${inc.incidentType}","${inc.reportedDate}",${inc.costToRepair},${inc.payrollDeduction},"${inc.status}"`
      );
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + rows.join('\n'));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', csvContent);
    downloadAnchor.setAttribute('download', `Novora_Assets_${activeSubTab.replace(/\s+/g, '_')}_2026.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);

    setTimeout(() => {
      addToast('Data exported successfully!', 'success');
    }, 1000);
  };

  // EDIT SETTERS
  const triggerEditAsset = (asset: any) => {
    setEditingItem(asset);
    setFormAssetName(asset.name);
    setFormAssetSerial(asset.serialNum);
    setFormAssetCategory(asset.category);
    setFormAssetCustodian(asset.custodianId);
    setFormAssetPurchaseDate(asset.purchaseDate);
    setFormAssetCost(asset.cost.toString());
    setFormAssetLocation(asset.location);
    setFormAssetStatus(asset.status);
    setFormAssetNotes(asset.notes);
    setShowModal('asset_new');
  };

  const triggerEditCategory = (cat: any) => {
    setEditingItem(cat);
    setFormCatName(cat.name);
    setFormCatCode(cat.code);
    setFormCatDesc(cat.description);
    setShowModal('category_new');
  };

  const triggerEditIncident = (inc: any) => {
    setEditingItem(inc);
    setFormIncAssetId(inc.assetId);
    setFormIncEmployeeId(inc.employeeId);
    setFormIncType(inc.incidentType);
    setFormIncCost(inc.costToRepair.toString());
    setFormIncDeduct(inc.payrollDeduction);
    setFormIncStatus(inc.status);
    setFormIncDesc(inc.description);
    setShowModal('incident_new');
  };

  // MATHS STATISTICS
  const totalAssetsVal = assets.reduce((sum, item) => sum + item.cost, 0);
  const activeUseCount = assets.filter(item => item.status === 'In Use').length;
  const availableCount = assets.filter(item => item.status === 'Available').length;
  const maintenanceCount = assets.filter(item => item.status === 'Maintenance').length;

  // FILTERS
  const filteredAssets = assets.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serialNum.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.custodianName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'All categories' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'All statuses' || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredAllocations = allocations.filter(item =>
    item.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.assetId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRequests = requests.filter(item =>
    item.assetRequested.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredIncidents = incidents.filter(item =>
    item.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.incidentType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="assets-management-view" className="space-y-6">
      {/* Upper Metrics Grid */}
      <div id="assets-metrics-dashboard" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div id="metric-assets-total" className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">Total Portfolio Value</span>
            <h3 className="text-2xl font-extrabold text-slate-800 leading-none">RM {totalAssetsVal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
            <p className="text-[10px] font-semibold text-slate-400">{assets.length} items catalogued</p>
          </div>
          <div className="h-12 w-12 bg-blue-500/5 text-blue-500 rounded-2xl flex items-center justify-center">
            <Package className="h-6 w-6" />
          </div>
        </div>

        <div id="metric-assets-deployed" className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">Active In Use</span>
            <h3 className="text-2xl font-extrabold text-emerald-600 leading-none">{activeUseCount} <span className="text-xs text-slate-400 font-medium">/{assets.length}</span></h3>
            <p className="text-[10px] font-semibold text-emerald-500 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Deployed to workforce employees
            </p>
          </div>
          <div className="h-12 w-12 bg-emerald-500/5 text-emerald-500 rounded-2xl flex items-center justify-center">
            <User className="h-6 w-6" />
          </div>
        </div>

        <div id="metric-assets-stock" className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">Warehouse Stock</span>
            <h3 className="text-2xl font-extrabold text-indigo-600 leading-none">{availableCount} <span className="text-xs text-slate-400 font-medium">available</span></h3>
            <p className="text-[10px] font-semibold text-slate-400">Ready for instant assignment</p>
          </div>
          <div className="h-12 w-12 bg-indigo-500/5 text-indigo-500 rounded-2xl flex items-center justify-center">
            <Layers className="h-6 w-6" />
          </div>
        </div>

        <div id="metric-assets-maintenance" className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">Damage & Refurbish</span>
            <h3 className="text-2xl font-extrabold text-amber-600 leading-none">{maintenanceCount} <span className="text-xs text-slate-400 font-medium">flagged</span></h3>
            <p className="text-[10px] font-semibold text-amber-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> Diagnostics / repair workshop
            </p>
          </div>
          <div className="h-12 w-12 bg-amber-500/5 text-amber-500 rounded-2xl flex items-center justify-center">
            <Wrench className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Primary Sub-Navigation Bar */}
      <div id="assets-management-subtabs" className="border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2.5 overflow-x-auto pb-px">
          {(['Registry', 'Categories', 'Allocations', 'Requests', 'Damages & Repair'] as const).map(tab => {
            const isActive = activeSubTab === tab;
            return (
              <button
                key={tab}
                id={`btn-assets-subtab-${tab.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => {
                  setActiveSubTab(tab);
                  setSearchQuery('');
                }}
                className={`text-xs font-bold px-3 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-blue-600 text-blue-600 font-extrabold'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                {tab === 'Registry' && 'Asset Registry'}
                {tab === 'Categories' && 'Asset Categories'}
                {tab === 'Allocations' && 'Deployments & Sign-off'}
                {tab === 'Requests' && 'Awaiting Requests'}
                {tab === 'Damages & Repair' && 'Incident & Damages'}
              </button>
            );
          })}
        </div>

        {/* Global Tab Actions */}
        <div className="flex items-center gap-2 pb-2 sm:pb-0">
          <button
            id="btn-assets-export-csv"
            onClick={handleExportCSV}
            className="h-8.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl text-slate-600 text-[11px] font-bold inline-flex items-center gap-1.5 cursor-pointer transition-all active:scale-97"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
            Export CSV
          </button>

          {activeSubTab === 'Registry' && (
            <button
              id="btn-assets-new-inventory"
              onClick={() => { resetForms(); setShowModal('asset_new'); }}
              className="h-8.5 px-3 bg-[#2f66e0] hover:bg-[#2051c2] text-white rounded-xl text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer transition-all active:scale-97"
            >
              <Plus className="h-3.5 w-3.5" />
              New Asset
            </button>
          )}

          {activeSubTab === 'Categories' && (
            <button
              id="btn-assets-new-category"
              onClick={() => { resetForms(); setShowModal('category_new'); }}
              className="h-8.5 px-3 bg-[#2f66e0] hover:bg-[#2051c2] text-white rounded-xl text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer transition-all active:scale-97"
            >
              <Plus className="h-3.5 w-3.5" />
              New Category
            </button>
          )}

          {activeSubTab === 'Allocations' && (
            <button
              id="btn-assets-new-allocation"
              onClick={() => { resetForms(); setShowModal('alloc_new'); }}
              className="h-8.5 px-3 bg-[#2f66e0] hover:bg-[#2051c2] text-white rounded-xl text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer transition-all active:scale-97"
            >
              <Plus className="h-3.5 w-3.5" />
              New Allocation
            </button>
          )}

          {activeSubTab === 'Requests' && (
            <button
              id="btn-assets-new-request"
              onClick={() => { resetForms(); setShowModal('request_new'); }}
              className="h-8.5 px-3 bg-[#2f66e0] hover:bg-[#2051c2] text-white rounded-xl text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer transition-all active:scale-97"
            >
              <Plus className="h-3.5 w-3.5" />
              New Request
            </button>
          )}

          {activeSubTab === 'Damages & Repair' && (
            <button
              id="btn-assets-new-incident"
              onClick={() => { resetForms(); setShowModal('incident_new'); }}
              className="h-8.5 px-3 bg-[#2f66e0] hover:bg-[#2051c2] text-white rounded-xl text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer transition-all active:scale-97"
            >
              <Plus className="h-3.5 w-3.5" />
              New Incident
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Table & Filter Suite */}
      <div id="assets-management-table-card" className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
        {/* Filtering & Search Bar */}
        <div className="p-4 bg-slate-50/55 border-b border-slate-100 flex flex-col md:flex-row items-center gap-3">
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-3 flex items-center pr-1 text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              id="assets-search-input"
              type="text"
              placeholder={`Search ${activeSubTab.toLowerCase()}...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9.5 pr-4 py-1.5 text-xs bg-white border border-slate-200 rounded-xl placeholder:text-slate-400 text-slate-700 outline-none focus:border-blue-600 transition-all font-medium"
            />
          </div>

          {activeSubTab === 'Registry' && (
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Category Filter */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">Category:</span>
                <select
                  id="assets-filter-category"
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="bg-white border border-slate-200 hover:border-slate-400 text-slate-700 text-xs py-1 px-2 rounded-xl focus:border-blue-500 outline-none transition-all cursor-pointer font-medium"
                >
                  <option value="All categories">All categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">Status:</span>
                <select
                  id="assets-filter-status"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="bg-white border border-slate-200 hover:border-slate-400 text-slate-700 text-xs py-1 px-2 rounded-xl focus:border-blue-500 outline-none transition-all cursor-pointer font-medium"
                >
                  <option value="All statuses">All statuses</option>
                  <option value="Available">Available Only</option>
                  <option value="In Use">In Use Only</option>
                  <option value="Maintenance">Maintenance Only</option>
                  <option value="Retired">Retired Only</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* ==================== SUBTAB: REGISTRY LIST ==================== */}
        {activeSubTab === 'Registry' && (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 tracking-wider uppercase select-none">
                  <th className="py-3 px-4">Asset ID</th>
                  <th className="py-3 px-4">Asset Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Current Custodian</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Purchase Date</th>
                  <th className="py-3 px-4 text-right">Value (RM)</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600 font-medium">
                {filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Package className="h-8 w-8 text-slate-300 stroke-[1.5]" />
                        <span>No assets found matching the search filters.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAssets.map(asset => {
                    const statusColors =
                      asset.status === 'In Use'
                        ? 'bg-emerald-50 text-emerald-700'
                        : asset.status === 'Available'
                        ? 'bg-blue-50 text-blue-700'
                        : asset.status === 'Maintenance'
                        ? 'bg-amber-50 text-amber-700 border border-amber-100'
                        : 'bg-rose-50 text-rose-700';

                    return (
                      <tr key={asset.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-800 font-mono">{asset.id}</td>
                        <td className="py-3.5 px-4">
                          <div className="max-w-xs sm:max-w-md">
                            <p className="font-bold text-slate-800 break-words hover:text-[#2f66e0] cursor-pointer" onClick={() => setDetailDrawerItem(asset)}>
                              {asset.name}
                            </p>
                            <p className="text-[10px] text-slate-400 font-semibold font-mono mt-0.5">S/N: {asset.serialNum}</p>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">{asset.category}</td>
                        <td className="py-3.5 px-4">
                          {asset.custodianId !== 'Unassigned' ? (
                            <div className="flex items-center gap-1.5">
                              <div className="h-5.5 w-5.5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-[10px]">
                                <User className="h-3 w-3" />
                              </div>
                              <span className="text-slate-700 font-semibold">{asset.custodianName}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400 font-semibold">Stock (Unallocated)</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusColors}`}>
                            {asset.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">{asset.purchaseDate}</td>
                        <td className="py-3.5 px-4 text-right font-extrabold text-slate-700">
                          {asset.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              id={`btn-assets-view-detail-${asset.id}`}
                              onClick={() => setDetailDrawerItem(asset)}
                              title="Inspect details"
                              className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              id={`btn-assets-edit-${asset.id}`}
                              onClick={() => triggerEditAsset(asset)}
                              title="Edit item specs"
                              className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              id={`btn-assets-delete-${asset.id}`}
                              onClick={() => handleDeleteItem('asset', asset.id)}
                              title="Delete record"
                              className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ==================== SUBTAB: CATEGORIES ==================== */}
        {activeSubTab === 'Categories' && (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 tracking-wider uppercase select-none">
                  <th className="py-3 px-4">Category ID</th>
                  <th className="py-3 px-4">Category Name</th>
                  <th className="py-3 px-4">Code Prefix</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-center">Equipment Count</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600 font-medium">
                {categories.map(cat => (
                  <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{cat.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{cat.name}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-indigo-600 bg-indigo-50/40 px-2 py-0.5 rounded-md inline-block mt-3 mb-3 ml-4">{cat.code}</td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">{cat.description}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 font-bold rounded-lg font-mono">
                        {cat.count} items
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          id={`btn-cat-edit-${cat.id}`}
                          onClick={() => triggerEditCategory(cat)}
                          className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          id={`btn-cat-delete-${cat.id}`}
                          onClick={() => handleDeleteItem('category', cat.id)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ==================== SUBTAB: ALLOCATIONS ==================== */}
        {activeSubTab === 'Allocations' && (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 tracking-wider uppercase select-none">
                  <th className="py-3 px-4">Allocation ID</th>
                  <th className="py-3 px-4">Asset ID & Name</th>
                  <th className="py-3 px-4">Employee Targeted</th>
                  <th className="py-3 px-4">Checkout Date</th>
                  <th className="py-3 px-4">Expected Return</th>
                  <th className="py-3 px-4">Standard Handover State</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600 font-medium">
                {filteredAllocations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">No active assignment metrics match.</td>
                  </tr>
                ) : (
                  filteredAllocations.map(al => (
                    <tr key={al.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{al.id}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        <p className="font-bold">{al.assetName}</p>
                        <p className="text-[10px] text-slate-400 font-mono font-semibold">ID: {al.assetId}</p>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-700">{al.employeeName}</td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">{al.checkoutDate}</td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">{al.dueDate}</td>
                      <td className="py-3.5 px-4 text-slate-500 italic max-w-xxs truncate">{al.condition}</td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2 md:px-2.5 py-0.5 md:py-1 rounded-full text-[10px] font-bold ${
                          al.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {al.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {al.status === 'Active' && (
                            <button
                              id={`btn-alloc-return-${al.id}`}
                              onClick={() => handleReturnAsset(al.id)}
                              title="Register sign-off stock return"
                              className="px-2 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                            >
                              Return Stock
                            </button>
                          )}
                          <button
                            id={`btn-alloc-delete-${al.id}`}
                            onClick={() => handleDeleteItem('alloc', al.id)}
                            className="p-1 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ==================== SUBTAB: REQUESTS ==================== */}
        {activeSubTab === 'Requests' && (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 tracking-wider uppercase select-none">
                  <th className="py-3 px-4">Req No</th>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Desired Item & Type</th>
                  <th className="py-3 px-4">Business Justification</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Submit Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600 font-medium">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">All request lanes clear.</td>
                  </tr>
                ) : (
                  filteredRequests.map(re => (
                    <tr key={re.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{re.id}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">{re.employeeName}</td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-800">{re.assetRequested}</p>
                        <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{re.category}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 max-w-xs break-words font-normal leading-relaxed">{re.reason}</td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                          re.priority === 'Critical'
                            ? 'bg-rose-100 text-rose-700'
                            : re.priority === 'High'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {re.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">{re.requestDate}</td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          re.status === 'Pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                            : re.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-800'
                        }`}>
                          {re.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        {re.status === 'Pending' ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              id={`btn-request-approve-${re.id}`}
                              onClick={() => handleApproveRequest(re)}
                              className="px-2 py-1 bg-emerald-500 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-600 cursor-pointer transition-all active:scale-95"
                            >
                              Approve
                            </button>
                            <button
                              id={`btn-request-reject-${re.id}`}
                              onClick={() => handleRejectRequest(re.id)}
                              className="px-2 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-bold hover:bg-rose-600 hover:text-white cursor-pointer transition-all active:scale-95"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] font-semibold text-slate-400 italic">Validated</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ==================== SUBTAB: DAMAGES & INCIDENTS ==================== */}
        {activeSubTab === 'Damages & Repair' && (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 tracking-wider uppercase select-none">
                  <th className="py-3 px-4">Log No</th>
                  <th className="py-3 px-4">Asset Involved</th>
                  <th className="py-3 px-4">Custodian</th>
                  <th className="py-3 px-4">Incident Trigger</th>
                  <th className="py-3 px-4">Report Date</th>
                  <th className="py-3 px-4 text-right">Est Repair (RM)</th>
                  <th className="py-3 px-4">Payroll Ded.</th>
                  <th className="py-3 px-4">Resolve Level</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600 font-medium">
                {filteredIncidents.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">All damage files accounted or log empty.</td>
                  </tr>
                ) : (
                  filteredIncidents.map(inc => (
                    <tr key={inc.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{inc.id}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        <p className="font-bold">{inc.assetName}</p>
                        <p className="text-[10px] text-slate-400 font-mono font-semibold">ID: {inc.assetId}</p>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-700">{inc.employeeName}</td>
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">{inc.incidentType}</td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">{inc.reportedDate}</td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-slate-700">
                        {inc.costToRepair.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase leading-none ${
                          inc.payrollDeduction
                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                            : 'bg-slate-150 text-slate-500'
                        }`}>
                          {inc.payrollDeduction ? 'Active Charge' : 'Co. Absorbed'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          inc.status === 'Resolved'
                            ? 'bg-emerald-50 text-emerald-700'
                            : inc.status === 'Under Repair'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {inc.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            id={`btn-incident-edit-${inc.id}`}
                            onClick={() => triggerEditIncident(inc)}
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            id={`btn-incident-delete-${inc.id}`}
                            onClick={() => handleDeleteItem('incident', inc.id)}
                            className="p-1 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =======================================================
          DETAIL DRAWER: INSPECT TECHNICAL HARDWARE SPECS
          ======================================================= */}
      {detailDrawerItem && (
        <div id="assets-detail-drawer-overlay" className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in">
          <div id="assets-detail-drawer-body" className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto animate-slide-in">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full tracking-wider uppercase font-mono">{detailDrawerItem.id}</span>
                  <h3 className="text-base font-extrabold text-slate-800 tracking-tight mt-2.5 leading-tight">{detailDrawerItem.name}</h3>
                </div>
                <button
                  id="btn-close-assets-drawer"
                  onClick={() => setDetailDrawerItem(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Status and category badge section */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Equipment Category</span>
                  <span className="text-slate-800 text-xs font-bold mt-1 block">{detailDrawerItem.category}</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Current Status</span>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    detailDrawerItem.status === 'In Use'
                      ? 'bg-emerald-50 text-emerald-700 animate-pulse'
                      : detailDrawerItem.status === 'Available'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {detailDrawerItem.status}
                  </span>
                </div>
              </div>

              {/* Specifications */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Unique Serial Tag</span>
                  <span className="text-slate-800 font-mono font-bold select-all whitespace-pre-wrap">{detailDrawerItem.serialNum}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Custodian Employee</span>
                  <span className="text-slate-800 font-bold">{detailDrawerItem.custodianName}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Office Custody Base</span>
                  <span className="text-slate-800 font-semibold">{detailDrawerItem.location}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Financial Book Value</span>
                  <span className="text-slate-800 font-extrabold">RM {detailDrawerItem.cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Purchase / Audit intake</span>
                  <span className="text-slate-800 font-semibold">{detailDrawerItem.purchaseDate}</span>
                </div>
              </div>

              {/* Maintenance context */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">IT Administration & Warranty Notes</span>
                <p className="text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed font-normal">{detailDrawerItem.notes || 'No warranty notes recorded.'}</p>
              </div>

              {/* History trace of allocation */}
              <div className="space-y-2 pt-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Allocation Route</span>
                <div className="border border-slate-100 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-emerald-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Checked out to {detailDrawerItem.custodianName}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{detailDrawerItem.purchaseDate}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold">Active</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t flex gap-2">
              <button
                id="drawer-btn-edit"
                onClick={() => { triggerEditAsset(detailDrawerItem); setDetailDrawerItem(null); }}
                className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer text-center border transition-all"
              >
                Edit Specs
              </button>
              <button
                id="drawer-btn-close"
                onClick={() => setDetailDrawerItem(null)}
                className="flex-1 py-1 bg-[#2f66e0] hover:bg-[#2051c2] text-white text-xs font-bold rounded-xl cursor-pointer text-center transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================
          MODAL COMPONENT COLLECTION
          ======================================================= */}
      {showModal && (
        <div id="assets-management-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fade-in col">
          <div id="assets-management-modal-card" className="bg-white rounded-2xl border border-slate-100 max-w-md w-full shadow-2xl relative p-6 animate-scale-in">
            {/* Modal Heading Form */}
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">
                {showModal === 'asset_new' && (editingItem ? 'Edit Asset' : 'New Asset')}
                {showModal === 'category_new' && (editingItem ? 'Edit Category' : 'New Category')}
                {showModal === 'alloc_new' && 'New Allocation'}
                {showModal === 'incident_new' && (editingItem ? 'Edit Incident' : 'New Incident')}
                {showModal === 'request_new' && 'New Request'}
              </h3>
              <button
                id="btn-close-assets-modal"
                onClick={resetForms}
                className="p-1 px-2.5 underline text-slate-400 hover:text-slate-600 transition-colors cursor-pointer text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            {/* FORM CONTAINER: ASSET_NEW */}
            {showModal === 'asset_new' && (
              <form onSubmit={handleSaveAsset} className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Equipment Name / Model *</label>
                    <input
                      id="input-asset-name"
                      type="text"
                      required
                      placeholder='e.g. MacBook Pro 14" (M3 / 16GB / 512GB)'
                      value={formAssetName}
                      onChange={e => setFormAssetName(e.target.value)}
                      className="w-full text-xs border border-slate-200 outline-none p-2 rounded-xl focus:border-blue-500 font-medium text-slate-800 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Serial / Asset Tag *</label>
                      <input
                        id="input-asset-serial"
                        type="text"
                        required
                        placeholder="e.g. C02DX92DKW12"
                        value={formAssetSerial}
                        onChange={e => setFormAssetSerial(e.target.value)}
                        className="w-full text-xs border border-slate-200 outline-none p-2 rounded-xl focus:border-blue-500 font-mono font-medium text-slate-800 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Equipment Category</label>
                      <select
                        id="select-asset-cat"
                        value={formAssetCategory}
                        onChange={e => setFormAssetCategory(e.target.value)}
                        className="w-full text-xs border border-slate-200 outline-none p-2 rounded-xl focus:border-blue-500 font-medium text-slate-700 bg-white cursor-pointer"
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Custodian Employee</label>
                      <select
                        id="select-asset-custodian"
                        value={formAssetCustodian}
                        onChange={e => setFormAssetCustodian(e.target.value)}
                        className="w-full text-xs border border-slate-200 outline-none p-2 rounded-xl focus:border-blue-500 font-medium text-slate-700 bg-white cursor-pointer"
                      >
                        <option value="Unassigned">Warehouse (Unassigned)</option>
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Asset physical status</label>
                      <select
                        id="select-asset-status"
                        value={formAssetStatus}
                        onChange={e => setFormAssetStatus(e.target.value)}
                        disabled={formAssetCustodian !== 'Unassigned'}
                        className="w-full text-xs border border-slate-200 outline-none p-2 rounded-xl focus:border-blue-500 font-medium text-slate-700 bg-white disabled:opacity-50 cursor-pointer"
                      >
                        <option value="Available">Available</option>
                        <option value="Maintenance">Maintenance / Workshop</option>
                        <option value="Retired">Retired / Scrapped</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Purchase Cost (RM)</label>
                      <input
                        id="input-asset-cost"
                        type="number"
                        step="0.01"
                        placeholder="e.g. 5499.00"
                        value={formAssetCost}
                        onChange={e => setFormAssetCost(e.target.value)}
                        className="w-full text-xs border border-slate-200 outline-none p-2 rounded-xl focus:border-blue-500 font-medium text-slate-800 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Receipt Date</label>
                      <input
                        id="input-asset-date"
                        type="date"
                        value={formAssetPurchaseDate}
                        onChange={e => setFormAssetPurchaseDate(e.target.value)}
                        className="w-full text-xs border border-slate-200 outline-none p-1.5 rounded-xl focus:border-blue-500 font-medium text-slate-700 bg-white cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Specific Physical Location</label>
                    <input
                      id="input-asset-loc"
                      type="text"
                      placeholder="e.g. Warehouse Closet B / KL Level 10"
                      value={formAssetLocation}
                      onChange={e => setFormAssetLocation(e.target.value)}
                      className="w-full text-xs border border-slate-200 outline-none p-2 rounded-xl focus:border-blue-500 font-medium text-slate-800 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">IT Administration notes</label>
                    <textarea
                      id="input-asset-notes"
                      rows={2}
                      placeholder="Add configuration detail, screen conditions, or repair history notes"
                      value={formAssetNotes}
                      onChange={e => setFormAssetNotes(e.target.value)}
                      className="w-full text-xs border border-slate-200 outline-none p-2 rounded-xl focus:border-blue-500 font-medium text-slate-800 bg-white"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t flex justify-end gap-2 text-xs">
                  <button
                    id="btn-asset-cancel"
                    type="button"
                    onClick={resetForms}
                    className="px-4 py-2 border rounded-xl hover:bg-slate-50 font-bold text-slate-600 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    id="btn-asset-submit"
                    type="submit"
                    className="px-4 py-2 bg-[#2f66e0] hover:bg-[#2051c2] text-white font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap"
                  >
                    {editingItem ? 'Save Specs' : 'Register Asset'}
                  </button>
                </div>
              </form>
            )}

            {/* FORM CONTAINER: CATEGORY_NEW */}
            {showModal === 'category_new' && (
              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Category Title *</label>
                    <input
                      id="input-cat-name"
                      type="text"
                      required
                      placeholder="e.g. Workstations"
                      value={formCatName}
                      onChange={e => setFormCatName(e.target.value)}
                      className="w-full text-xs border border-slate-200 outline-none p-2 rounded-xl focus:border-blue-500 font-medium text-slate-800 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Code prefix (Unique 2-4 chars) *</label>
                    <input
                      id="input-cat-code"
                      type="text"
                      required
                      maxLength={4}
                      placeholder="e.g. WKS"
                      value={formCatCode}
                      onChange={e => setFormCatCode(e.target.value)}
                      className="w-full text-xs border border-slate-200 outline-none p-2 rounded-xl focus:border-blue-500 font-mono font-medium text-slate-800 uppercase bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Description / Category Scope</label>
                    <textarea
                      id="input-cat-desc"
                      rows={3}
                      placeholder="e.g. Hardware workstations, docks, power backup rails, or external servers hardware."
                      value={formCatDesc}
                      onChange={e => setFormCatDesc(e.target.value)}
                      className="w-full text-xs border border-slate-200 outline-none p-2 rounded-xl focus:border-blue-500 font-medium text-slate-800 bg-white"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t flex justify-end gap-2 text-xs">
                  <button
                    id="btn-cat-cancel"
                    type="button"
                    onClick={resetForms}
                    className="px-4 py-2 border rounded-xl hover:bg-slate-50 font-bold text-slate-600 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    id="btn-cat-submit"
                    type="submit"
                    className="px-4 py-2 bg-[#2f66e0] hover:bg-[#2051c2] text-white font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap"
                  >
                    {editingItem ? 'Save Category' : 'Register Category'}
                  </button>
                </div>
              </form>
            )}

            {/* FORM CONTAINER: ALLOC_NEW */}
            {showModal === 'alloc_new' && (
              <form onSubmit={handleCreateAllocation} className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Select Available Hardware Item *</label>
                    <select
                      id="select-alloc-asset"
                      required
                      value={formAllocAssetId}
                      onChange={e => setFormAllocAssetId(e.target.value)}
                      className="w-full text-xs border border-slate-200 outline-none p-2 rounded-xl focus:border-blue-500 font-medium text-slate-700 bg-white cursor-pointer"
                    >
                      <option value="">-- Choose asset from stock --</option>
                      {assets.map(a => (
                        <option key={a.id} value={a.id}>
                          [{a.id}] {a.name} ({a.category} - {a.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Recipient Employee *</label>
                    <select
                      id="select-alloc-employee"
                      required
                      value={formAllocEmployeeId}
                      onChange={e => setFormAllocEmployeeId(e.target.value)}
                      className="w-full text-xs border border-slate-200 outline-none p-2 rounded-xl focus:border-blue-500 font-medium text-slate-700 bg-white cursor-pointer"
                    >
                      <option value="">-- Choose target employee --</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} ({emp.department})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Issue Checkout Date</label>
                      <input
                        id="input-alloc-date"
                        type="date"
                        value={formAllocDate}
                        onChange={e => setFormAllocDate(e.target.value)}
                        className="w-full text-xs border border-slate-200 outline-none p-1.5 rounded-xl focus:border-blue-500 font-medium text-slate-700 bg-white cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Expected Return Date</label>
                      <input
                        id="input-alloc-due"
                        type="date"
                        value={formAllocDueDate}
                        onChange={e => setFormAllocDueDate(e.target.value)}
                        className="w-full text-xs border border-slate-200 outline-none p-1.5 rounded-xl focus:border-blue-500 font-medium text-slate-700 bg-white cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Check-out structural condition notes</label>
                    <input
                      id="input-alloc-condition"
                      type="text"
                      placeholder="e.g. Excellent / Like New - dual screens pristine"
                      value={formAllocCond}
                      onChange={e => setFormAllocCond(e.target.value)}
                      className="w-full text-xs border border-slate-200 outline-none p-2 rounded-xl focus:border-blue-500 font-medium text-slate-800 bg-white"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t flex justify-end gap-2 text-xs">
                  <button
                    id="btn-alloc-cancel"
                    type="button"
                    onClick={resetForms}
                    className="px-4 py-2 border rounded-xl hover:bg-slate-50 font-bold text-slate-600 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    id="btn-alloc-submit"
                    type="submit"
                    className="px-4 py-2 bg-[#2f66e0] hover:bg-[#2051c2] text-white font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap"
                  >
                    Establish Allocation
                  </button>
                </div>
              </form>
            )}

            {/* FORM CONTAINER: INCIDENT_NEW */}
            {showModal === 'incident_new' && (
              <form onSubmit={handleSaveIncident} className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Select Asset Damage target *</label>
                    <select
                      id="select-inc-asset"
                      required
                      value={formIncAssetId}
                      onChange={e => setFormIncAssetId(e.target.value)}
                      className="w-full text-xs border border-slate-200 outline-none p-2 rounded-xl focus:border-blue-500 font-medium text-slate-700 bg-white cursor-pointer"
                    >
                      <option value="">-- Choose asset --</option>
                      {assets.map(a => (
                        <option key={a.id} value={a.id}>
                          [{a.id}] {a.name} ({a.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Reporter / Designated Custodian *</label>
                    <select
                      id="select-inc-employee"
                      required
                      value={formIncEmployeeId}
                      onChange={e => setFormIncEmployeeId(e.target.value)}
                      className="w-full text-xs border border-slate-200 outline-none p-2 rounded-xl focus:border-blue-500 font-medium text-slate-700 bg-white cursor-pointer"
                    >
                      <option value="">-- Choose employee --</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} ({emp.department})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Issue Trigger Type</label>
                      <select
                        id="select-inc-type"
                        value={formIncType}
                        onChange={e => setFormIncType(e.target.value)}
                        className="w-full text-xs border border-slate-200 outline-none p-2 rounded-xl focus:border-blue-500 font-medium text-slate-700 bg-white cursor-pointer"
                      >
                        <option value="Water Damage">Water Damage / Spill</option>
                        <option value="Physical Drop / Screen Crack">Physical Drop / Crack</option>
                        <option value="Processor CPU Overheating">Overheating</option>
                        <option value="Stolen / Lost Hardware">Lost / Lost Item</option>
                        <option value="SaaS Account Locked">SaaS Acc Blocked</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Estimated repair (RM)</label>
                      <input
                        id="input-inc-cost"
                        type="number"
                        placeholder="e.g. 150.00"
                        value={formIncCost}
                        onChange={e => setFormIncCost(e.target.value)}
                        className="w-full text-xs border border-slate-200 outline-none p-2 rounded-xl focus:border-blue-500 font-medium text-slate-800 bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 py-1 bg-slate-50 p-2.5 rounded-xl border">
                    <input
                      id="checkbox-inc-deduct"
                      type="checkbox"
                      checked={formIncDeduct}
                      onChange={e => setFormIncDeduct(e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded-md border-slate-300 cursor-pointer"
                    />
                    <div>
                      <label htmlFor="checkbox-inc-deduct" className="text-xs font-bold text-slate-700 cursor-pointer">
                        Charge back to Employee payroll?
                      </label>
                      <p className="text-[10px] text-slate-400 font-semibold leading-tight">Will log penalty deductibles under payroll workflow tab.</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Incident resolve level</label>
                    <select
                      id="select-inc-status"
                      value={formIncStatus}
                      onChange={e => setFormIncStatus(e.target.value)}
                      className="w-full text-xs border border-slate-200 outline-none p-2 rounded-xl focus:border-blue-500 font-medium text-slate-700 bg-white cursor-pointer"
                    >
                      <option value="Log Only">Log Only / Minor scratches</option>
                      <option value="Under Repair">Under Repair / In maintenance</option>
                      <option value="Resolved">Resolved / Functional return</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Description / Repair Log details</label>
                    <textarea
                      id="input-inc-desc"
                      rows={2}
                      placeholder="Describe detail: LCD flex cables replacement required etc."
                      value={formIncDesc}
                      onChange={e => setFormIncDesc(e.target.value)}
                      className="w-full text-xs border border-slate-200 outline-none p-2 rounded-xl focus:border-blue-500 font-medium text-slate-800 bg-white"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t flex justify-end gap-2 text-xs">
                  <button
                    id="btn-incident-cancel"
                    type="button"
                    onClick={resetForms}
                    className="px-4 py-2 border rounded-xl hover:bg-slate-50 font-bold text-slate-600 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    id="btn-incident-submit"
                    type="submit"
                    className="px-4 py-2 bg-[#2f66e0] hover:bg-[#2051c2] text-white font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap"
                  >
                    {editingItem ? 'Save Incident' : 'Report Incident'}
                  </button>
                </div>
              </form>
            )}

            {/* FORM CONTAINER: REQUEST_NEW */}
            {showModal === 'request_new' && (
              <form onSubmit={handleCreateRequest} className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Employee requesting *</label>
                    <select
                      id="select-req-employee"
                      required
                      value={formReqEmployeeId}
                      onChange={e => setFormReqEmployeeId(e.target.value)}
                      className="w-full text-xs border border-slate-200 outline-none p-2 rounded-xl focus:border-blue-500 font-medium text-slate-700 bg-white cursor-pointer"
                    >
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} ({emp.department})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Asset category</label>
                      <select
                        id="select-req-category"
                        value={formReqCategory}
                        onChange={e => setFormReqCategory(e.target.value)}
                        className="w-full text-xs border border-slate-200 outline-none p-2 rounded-xl focus:border-blue-500 font-medium text-slate-700 bg-white cursor-pointer"
                      >
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Priority urgency</label>
                      <select
                        id="select-req-priority"
                        value={formReqPriority}
                        onChange={e => setFormReqPriority(e.target.value)}
                        className="w-full text-xs border border-slate-200 outline-none p-2 rounded-xl focus:border-blue-500 font-medium text-slate-700 bg-white cursor-pointer"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Product Description / Model desired *</label>
                    <input
                      id="input-req-name"
                      type="text"
                      required
                      placeholder="e.g. Dell P2723DE QHD Hub Monitor"
                      value={formReqName}
                      onChange={e => setFormReqName(e.target.value)}
                      className="w-full text-xs border border-slate-200 outline-none p-2 rounded-xl focus:border-blue-500 font-medium text-slate-800 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Business Justification *</label>
                    <textarea
                      id="input-req-reason"
                      rows={3}
                      required
                      placeholder="Explain how this asset item empowers workflow, or replace hardware malfunctions..."
                      value={formReqReason}
                      onChange={e => setFormReqReason(e.target.value)}
                      className="w-full text-xs border border-slate-200 outline-none p-2 rounded-xl focus:border-blue-500 font-medium text-slate-800 bg-white"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t flex justify-end gap-2 text-xs">
                  <button
                    id="btn-req-cancel"
                    type="button"
                    onClick={resetForms}
                    className="px-4 py-2 border rounded-xl hover:bg-slate-50 font-bold text-slate-600 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    id="btn-req-submit"
                    type="submit"
                    className="px-4 py-2 bg-[#2f66e0] hover:bg-[#2051c2] text-white font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

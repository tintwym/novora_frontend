import { useState, useEffect, useRef, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  Trash2,
  Key,
  Plus,
  Check,
  Edit2,
  Briefcase,
  Coins,
  FileText,
  MapPin,
  ArrowDown,
  Upload,
  Shield,
  X,
  Users,
  GraduationCap,
  Download,
  Printer,
} from 'lucide-react'
import { showActionToast } from '../../utils/actionToast'
import type { ModuleEmployee, EmploymentStatus } from '../../types/moduleEmployee'

type EmployeeProfileTabProps = {
  employee: ModuleEmployee | null
  onBackToDirectory: () => void
  onDeleteEmployee: (id: string) => void
  onUpdateEmployee: (emp: ModuleEmployee) => void
}

type ProfileSubTab = 'Summary' | 'Personal' | 'Family' | 'Biometric' | 'Pay Rate' | 'Career' | 'Education' | 'Documents';

export function EmployeeProfileTab({ employee, onBackToDirectory, onDeleteEmployee, onUpdateEmployee }: EmployeeProfileTabProps) {
  const addToast = (text: string, type?: 'success' | 'loading' | 'error' | 'info') => {
    showActionToast(text, type)
  }


  // Active Sub Tab
  const [activeTab, setActiveTab] = useState<ProfileSubTab>('Summary');

  // Generic Edit states
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingPayRate, setIsEditingPayRate] = useState(false);
  const [isEditingHRNotes, setIsEditingHRNotes] = useState(false);

  // Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [_showMoreActions, _setShowMoreActions] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDocPreviewModal, setShowDocPreviewModal] = useState(false);
  const [previewingDoc, setPreviewingDoc] = useState<any>(null);
  const [generatedPassword, setGeneratedPassword] = useState('');

  // Persisted dictionary to separate and save custom documents for each employee
  const [employeeDocsMap, setEmployeeDocsMap] = useState<Record<string, Array<{id: string, name: string, type: string, uploaded: string, expiry: string}>>>({});

  // Document Upload Form local state
  const [docType, setDocType] = useState('Contract');
  const [docCustomName, setDocCustomName] = useState('');
  const [docExpiryDate, setDocExpiryDate] = useState('');
  const [hasExpiry, setHasExpiry] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Family Subtab Add/Edit modals state
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [editingFamilyMember, setEditingFamilyMember] = useState<any>(null);
  const [familyForm, setFamilyForm] = useState({
    name: '',
    relationship: 'Spouse',
    dob: '',
    nric: '',
    taxExempt: false,
    passport: 'N/A'
  });

  const [showNokModal, setShowNokModal] = useState(false);
  const [editingNok, setEditingNok] = useState<any>(null);
  const [nokForm, setNokForm] = useState({
    name: '',
    relationship: 'Spouse',
    contactNo: '',
    address: ''
  });

  // Biometric Subtab Add/Edit modals state
  const [showBiometricModal, setShowBiometricModal] = useState(false);
  const [editingBiometricDevice, setEditingBiometricDevice] = useState<any>(null);
  const [biometricForm, setBiometricForm] = useState({
    taNumber: '',
    terminalName: '',
    deviceType: 'Face ID',
    location: '',
    status: 'Active' as 'Active' | 'Inactive'
  });

  // Allowance and Deduction Add/Edit modals state
  const [showAllowanceModal, setShowAllowanceModal] = useState(false);
  const [editingAllowance, setEditingAllowance] = useState<any>(null);
  const [allowanceForm, setAllowanceForm] = useState({
    id: '',
    type: '',
    amount: 0,
    frequency: 'Monthly',
    taxable: false,
    status: 'Active' as 'Active' | 'Inactive'
  });

  const [showDeductionModal, setShowDeductionModal] = useState(false);
  const [editingDeduction, setEditingDeduction] = useState<any>(null);
  const [deductionForm, setDeductionForm] = useState({
    id: '',
    type: '',
    amount: 0,
    frequency: 'Monthly',
    reference: 'Statutory',
    status: 'Active' as 'Active' | 'Inactive'
  });

  // Career Add/Edit modals state
  const [showCareerModal, setShowCareerModal] = useState(false);
  const [editingCareer, setEditingCareer] = useState<any>(null);
  const [careerForm, setCareerForm] = useState({
    id: '',
    company: '',
    position: '',
    from: '',
    to: '',
    reason: ''
  });

  // Education Add/Edit modals state
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [editingEducation, setEditingEducation] = useState<any>(null);
  const [educationForm, setEducationForm] = useState({
    id: '',
    institution: '',
    qualification: '',
    fieldOfStudy: '',
    year: '',
    grade: ''
  });

  // Local state for extended profile fields aligned directly to the screenshots parameters
  const [profileData, setProfileData] = useState({
    // Header Stats
    tenure: '4y 3m',
    payGrade: 'G-7',
    leaveLeft: 12,
    performanceScore: '92%',

    // Summary - Employment details card
    company: 'Novora',
    jobType: 'Permanent' as EmploymentStatus,
    positionStartDate: '1 Mar 2022',
    jobGrade: 'G-7 / Sub B',

    // Summary - Leave balance
    annualLeaveUsed: 12,
    annualLeaveMax: 16,
    medicalLeaveUsed: 10,
    medicalLeaveMax: 14,
    emergencyLeaveUsed: 2,
    emergencyLeaveMax: 3,

    // Summary - Performance bars
    prefTechnical: 92,
    prefCommunication: 85,
    prefTeamwork: 88,
    prefPunctuality: 95,
    prefLeadership: 78,
    lastAppraisal: 'Dec 2024 — Grade A',
    nextReview: 'Dec 2025',

    // Summary - HR notes
    hrNotes: 'Strong technical contributor. Nominated for tech lead role in Q3 2025. No disciplinary records. Eligible for promotion review.',
    blacklisted: 'No',
    autoClockIn: 'Disabled',

    // Personal Subtab info
    dob: '14 March 1991',
    gender: 'Female',
    nationality: 'Malaysian',
    religion: 'Buddhism',
    maritalStatus: 'Married',
    personalEmail: 'sarah.lim@gmail.com',
    mobileNo: '+60 12-345 6789',
    race: 'Chinese',
    nric: '',

    // Passport
    passportEnabled: true,
    passportNo: 'A12345678',
    passportCountry: 'Malaysia',
    passportIssueDate: '10 Jan 2020',
    passportExpiryDate: '9 Jan 2030',

    // Address
    addressLine1: '12, Jalan Setia Prima A U13/A',
    addressLine2: 'Setia Alam',
    city: 'Shah Alam',
    state: 'Selangor',
    postcode: '40170',
    country: 'Malaysia',
    sameAsPermanent: true,
    perAddress: '',

    // Family Members
    familyMembers: [
      { id: '1', name: 'Lim Kah Fatt', relationship: 'Spouse', dob: '12 Jun 1988', nric: '880612-10-1234', taxExempt: true, passport: 'N/A' },
      { id: '2', name: 'Lim Zhi Xuan', relationship: 'Child', dob: '4 Feb 2018', nric: '180204-10-5555', taxExempt: true, passport: 'N/A' },
      { id: '3', name: 'Lim Mei Hua', relationship: 'Mother', dob: '8 Sep 1962', nric: '620908-10-4321', taxExempt: false, passport: 'N/A' }
    ],

    // Next of Kin
    nokList: [
      { id: '1', name: 'Lim Kah Fatt', relationship: 'Spouse', contactNo: '+60 16-789 1234', address: 'Same as employee' }
    ],

    // Biometrics Log
    biometricDevices: [
      { taNumber: 'TA-00451', terminalName: 'Main Lobby — Terminal 1', deviceType: 'Fingerprint', location: 'HQ Ground Floor', status: 'Active' },
      { taNumber: 'TA-00452', terminalName: 'Level 3 — Terminal 2', deviceType: 'Face ID', location: 'Engineering Floor', status: 'Active' }
    ],
    biometricsEnabled: true,
    autoClockSetting: false,
    ignoreMissingSwipe: false,
    ignoreRotaDeduction: false,
    assignedShift: 'Standard — 9:00 AM to 6:00 PM',

    // Pay Rate Tab Info
    payType: 'Monthly',
    currency: 'MYR (Malaysian Ringgit)',
    basicSalary: 7500.00,
    payEffectiveDate: '1 Mar 2024',
    bankAccount: 'Maybank •••• 4521',

    allowances: [
      { id: '1', type: 'Transport allowance', amount: 300.00, frequency: 'Monthly', taxable: false, status: 'Active' },
      { id: '2', type: 'Meal allowance', amount: 200.00, frequency: 'Monthly', taxable: false, status: 'Active' },
      { id: '3', type: 'Phone allowance', amount: 150.00, frequency: 'Monthly', taxable: true, status: 'Active' }
    ],

    deductions: [
      { id: '1', type: 'EPF (Employee)', amount: 825.00, frequency: 'Monthly', reference: '11%', status: 'Active' },
      { id: '2', type: 'SOCSO', amount: 49.40, frequency: 'Monthly', reference: 'Statutory', status: 'Active' },
      { id: '3', type: 'Income Tax (PCB)', amount: 620.00, frequency: 'Monthly', reference: 'Est.', status: 'Active' }
    ],

    // Career History
    careerHistory: [
      { id: '1', company: 'Tech Solutions Sdn Bhd', position: 'Junior Developer', from: 'Jun 2013', to: 'Dec 2016', reason: 'Career growth' },
      { id: '2', company: 'Infineon Technologies', position: 'Software Engineer', from: 'Jan 2017', to: 'Dec 2020', reason: 'Better opportunity' }
    ],

    // Education
    educationList: [
      { id: '1', institution: 'Universiti Malaya', qualification: "Bachelor's Degree", fieldOfStudy: 'Computer Science', year: '2013', grade: 'First Class' }
    ],

    // Documents
    documentsList: [
      { id: '1', name: 'Offer Letter', type: 'Contract', uploaded: '12 Jan 2021', expiry: '—' },
      { id: '2', name: 'NRIC Copy', type: 'ID', uploaded: '12 Jan 2021', expiry: '—' },
      { id: '3', name: 'Passport', type: 'ID', uploaded: '10 Jan 2020', expiry: '9 Jan 2030' }
    ]
  });

  // Track state changes to allow overall saving
  const [_isStateModified, setIsStateModified] = useState(false);

  // Keep a ref of the docs map so the sync effect below can read it without
  // re-running (and wiping unsaved edits) every time a document is added/removed
  const employeeDocsMapRef = useRef(employeeDocsMap);
  employeeDocsMapRef.current = employeeDocsMap;

  // Sync profile data when selected employee changes
  useEffect(() => {
    if (!employee) return
    // Generate specialized or custom parameters depending on the selected employee's metadata
    // This allows selecting Sarah Lim, Sarah Lim Wei Ling, or any other staff and generating dynamic values
    const isSarah = employee.name.toLowerCase().includes('sarah lim');

    // Retrieve this employee's documents, or seed some default ones
    const existingDocs = employeeDocsMapRef.current[employee.id] || [
      { id: '1', name: `Offer Letter - ${employee.name}`, type: 'Contract', uploaded: '12 Jan 2021', expiry: '—' },
      { id: '2', name: 'NRIC Copy', type: 'ID', uploaded: '12 Jan 2021', expiry: '—' },
      { id: '3', name: 'Passport', type: 'ID', uploaded: '10 Jan 2020', expiry: '9 Jan 2030' }
    ];
    
    setProfileData(prev => ({
      ...prev,
      tenure: isSarah ? '4y 3m' : '2y 6m',
      payGrade: isSarah ? 'G-7' : 'G-5',
      leaveLeft: isSarah ? 12 : 14,
      performanceScore: isSarah ? '92%' : '88%',
      company: 'Novora',
      jobType: employee.employmentStatus,
      positionStartDate: isSarah ? '1 Mar 2022' : '15 Apr 2023',
      jobGrade: isSarah ? 'G-7 / Sub B' : 'G-5 / Sub A',
      
      prefTechnical: isSarah ? 92 : 85,
      prefCommunication: isSarah ? 85 : 82,
      prefTeamwork: isSarah ? 88 : 84,
      prefPunctuality: isSarah ? 95 : 90,
      prefLeadership: isSarah ? 78 : 70,

      dob: isSarah ? '14 March 1991' : '22 May 1994',
      gender: isSarah ? 'Female' : 'Male',
      nationality: 'Malaysian',
      religion: isSarah ? 'Buddhism' : 'Islam',
      maritalStatus: isSarah ? 'Married' : 'Single',
      personalEmail: isSarah ? 'sarah.lim@gmail.com' : `${employee.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      mobileNo: isSarah ? '+60 12-345 6789' : employee.mobile,
      race: isSarah ? 'Chinese' : 'Malay',
      nric: employee.nric,
      perAddress: employee.address,
      
      basicSalary: isSarah ? 7500.00 : 5400.00,
      bankAccount: isSarah ? 'Maybank •••• 4521' : 'CIMB •••• 8812',
      documentsList: existingDocs,
    }));

    if (!employeeDocsMapRef.current[employee.id]) {
      setEmployeeDocsMap(prev => ({
        ...prev,
        [employee.id]: existingDocs
      }));
    }
    
    setIsStateModified(false);
    // Reset only when the selected employee changes; docs are read via ref so
    // document uploads/deletes don't wipe in-progress form edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee?.id]);

  // Handle local state edit auto-saves directly to parent
  const triggerAutoSave = (newJobType?: EmploymentStatus, newMobile?: string) => {
    if (!employee) return
    const updatedEmployee: ModuleEmployee = {
      ...employee,
      employmentStatus: newJobType !== undefined ? newJobType : profileData.jobType,
      mobile: newMobile !== undefined ? newMobile : profileData.mobileNo,
    };
    onUpdateEmployee(updatedEmployee);
    setIsStateModified(false);
  };

  // Helper Initials
  const getInitials = (fullName: string) => {
    return fullName.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();
  };

  // Trigger Password Reset Simulation
  const handleResetPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';
    let pass = '';
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(pass);
    setShowResetModal(true);
  };

  const commitResetPassword = () => {
    setShowResetModal(false);
    addToast(`Credentials successfully regenerated & locked.`, 'success');
  };

  const triggerDelete = () => {
    setShowDeleteModal(false);
    if (employee) onDeleteEmployee(employee.id);
  };

  // Document upload drag/drop & submit handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      // Autofill name (removing the file extension)
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setDocCustomName(baseName);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Autofill name (removing the file extension)
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setDocCustomName(baseName);
    }
  };

  const handleUploadSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      addToast('Please select or drag a file to upload first.', 'error');
      return;
    }

    const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const formattedExpiry = hasExpiry && docExpiryDate 
      ? new Date(docExpiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) 
      : '—';

    const newDoc = {
      id: `doc-${Date.now()}`,
      name: docCustomName.trim() || selectedFile.name,
      type: docType,
      uploaded: todayStr,
      expiry: formattedExpiry
    };

    const updatedList = [...profileData.documentsList, newDoc];
    
    // Update local profileData
    setProfileData(prev => ({
      ...prev,
      documentsList: updatedList
    }));
    
    // Save to the long-term dictionary for this specific employee
    if (employee) {
      setEmployeeDocsMap(prev => ({
        ...prev,
        [employee.id]: updatedList
      }));
    }

    addToast(`Document "${newDoc.name}" uploaded successfully.`, 'success');
    setShowUploadModal(false);
    
    // Clear state
    setDocType('Contract');
    setDocCustomName('');
    setDocExpiryDate('');
    setHasExpiry(false);
    setSelectedFile(null);
  };

  // Open modal to add family member
  const handleAddFamilyMember = () => {
    setEditingFamilyMember(null);
    setFamilyForm({
      name: '',
      relationship: 'Spouse',
      dob: '',
      nric: '',
      taxExempt: false,
      passport: 'N/A'
    });
    setShowFamilyModal(true);
  };

  // Open modal to edit family member
  const handleEditFamilyMember = (member: any) => {
    setEditingFamilyMember(member);
    setFamilyForm({
      name: member.name,
      relationship: member.relationship,
      dob: member.dob,
      nric: member.nric,
      taxExempt: member.taxExempt,
      passport: member.passport || 'N/A'
    });
    setShowFamilyModal(true);
  };

  // Save family member changes
  const handleSaveFamilyMember = (e: FormEvent) => {
    e.preventDefault();
    if (!familyForm.name.trim()) {
      addToast('Name is required.', 'error');
      return;
    }

    let updatedList;
    if (editingFamilyMember) {
      // Edit
      updatedList = profileData.familyMembers.map(item => 
        item.id === editingFamilyMember.id ? { ...item, ...familyForm, name: familyForm.name.trim() } : item
      );
      addToast(`Family member "${familyForm.name}" updated successfully.`, 'success');
    } else {
      // Add
      const newMember = {
        id: `fam-${Date.now()}`,
        ...familyForm,
        name: familyForm.name.trim()
      };
      updatedList = [...profileData.familyMembers, newMember];
      addToast(`Family member "${familyForm.name}" added successfully.`, 'success');
    }

    setProfileData(prev => ({
      ...prev,
      familyMembers: updatedList
    }));
    setIsStateModified(true);
    setShowFamilyModal(false);
  };

  // Delete family member
  const handleDeleteFamilyMember = (id: string, name: string) => {
    const updatedList = profileData.familyMembers.filter(item => item.id !== id);
    setProfileData(prev => ({
      ...prev,
      familyMembers: updatedList
    }));
    setIsStateModified(true);
    addToast(`Family member "${name}" removed.`, 'info');
  };

  // Next of Kin operations
  const handleAddNok = () => {
    setEditingNok(null);
    setNokForm({
      name: '',
      relationship: 'Spouse',
      contactNo: '',
      address: ''
    });
    setShowNokModal(true);
  };

  const handleEditNok = (nok: any) => {
    setEditingNok(nok);
    setNokForm({
      name: nok.name,
      relationship: nok.relationship,
      contactNo: nok.contactNo,
      address: nok.address
    });
    setShowNokModal(true);
  };

  const handleSaveNok = (e: FormEvent) => {
    e.preventDefault();
    if (!nokForm.name.trim()) {
      addToast('Name is required.', 'error');
      return;
    }

    let updatedList;
    if (editingNok) {
      updatedList = profileData.nokList.map(item => 
        item.id === editingNok.id ? { ...item, ...nokForm, name: nokForm.name.trim() } : item
      );
      addToast(`Emergency contact "${nokForm.name}" updated successfully.`, 'success');
    } else {
      const newNok = {
        id: `nok-${Date.now()}`,
        ...nokForm,
        name: nokForm.name.trim()
      };
      updatedList = [...profileData.nokList, newNok];
      addToast(`Emergency contact "${nokForm.name}" added successfully.`, 'success');
    }

    setProfileData(prev => ({
      ...prev,
      nokList: updatedList
    }));
    setIsStateModified(true);
    setShowNokModal(false);
  };

  const handleDeleteNok = (id: string, name: string) => {
    const updatedList = profileData.nokList.filter(item => item.id !== id);
    setProfileData(prev => ({
      ...prev,
      nokList: updatedList
    }));
    setIsStateModified(true);
    addToast(`Emergency contact "${name}" removed.`, 'info');
  };

  // Biometric actions
  const handleAddBiometricDevice = () => {
    setEditingBiometricDevice(null);
    setBiometricForm({
      taNumber: `TA-004${Math.floor(100 + Math.random() * 900)}`,
      terminalName: '',
      deviceType: 'Face ID',
      location: '',
      status: 'Active'
    });
    setShowBiometricModal(true);
  };

  const handleEditBiometricDevice = (dev: any) => {
    setEditingBiometricDevice(dev);
    setBiometricForm({
      taNumber: dev.taNumber,
      terminalName: dev.terminalName,
      deviceType: dev.deviceType,
      location: dev.location,
      status: dev.status
    });
    setShowBiometricModal(true);
  };

  const handleSaveBiometricDevice = (e: FormEvent) => {
    e.preventDefault();
    if (!biometricForm.terminalName.trim()) {
      addToast('Terminal Name is required.', 'error');
      return;
    }
    if (!biometricForm.taNumber.trim()) {
      addToast('TA Number is required.', 'error');
      return;
    }

    let updatedList;
    if (editingBiometricDevice) {
      updatedList = profileData.biometricDevices.map(item => 
        item.taNumber === editingBiometricDevice.taNumber ? { ...item, ...biometricForm, terminalName: biometricForm.terminalName.trim(), location: biometricForm.location.trim() } : item
      );
      addToast(`Device "${biometricForm.terminalName}" updated successfully.`, 'success');
    } else {
      const exists = profileData.biometricDevices.some(item => item.taNumber.toUpperCase() === biometricForm.taNumber.trim().toUpperCase());
      if (exists) {
        addToast(`A device with TA Number "${biometricForm.taNumber.trim()}" already exists.`, 'error');
        return;
      }
      const newDev = {
        ...biometricForm,
        taNumber: biometricForm.taNumber.trim(),
        terminalName: biometricForm.terminalName.trim(),
        location: biometricForm.location.trim()
      };
      updatedList = [...profileData.biometricDevices, newDev];
      addToast(`Device "${biometricForm.terminalName}" registered successfully.`, 'success');
    }

    setProfileData(prev => ({
      ...prev,
      biometricDevices: updatedList
    }));
    setIsStateModified(true);
    setShowBiometricModal(false);
  };

  const handleDeleteBiometricDevice = (taNumber: string, terminalName: string) => {
    const updatedList = profileData.biometricDevices.filter(item => item.taNumber !== taNumber);
    setProfileData(prev => ({
      ...prev,
      biometricDevices: updatedList
    }));
    setIsStateModified(true);
    addToast(`Device "${terminalName}" removed.`, 'info');
  };

  // Allowance actions
  const handleAddAllowance = () => {
    setEditingAllowance(null);
    setAllowanceForm({
      id: `ALW-${Math.floor(100 + Math.random() * 900)}`,
      type: '',
      amount: 0,
      frequency: 'Monthly',
      taxable: false,
      status: 'Active'
    });
    setShowAllowanceModal(true);
  };

  const handleEditAllowance = (allow: any) => {
    setEditingAllowance(allow);
    setAllowanceForm({
      id: allow.id,
      type: allow.type,
      amount: allow.amount,
      frequency: allow.frequency,
      taxable: allow.taxable,
      status: allow.status
    });
    setShowAllowanceModal(true);
  };

  const handleSaveAllowance = (e: FormEvent) => {
    e.preventDefault();
    if (!allowanceForm.type.trim()) {
      addToast('Allowance Type is required.', 'error');
      return;
    }
    if (allowanceForm.amount <= 0) {
      addToast('Amount must be greater than 0.', 'error');
      return;
    }

    let updatedList;
    if (editingAllowance) {
      updatedList = profileData.allowances.map(item => 
        item.id === editingAllowance.id ? { ...item, ...allowanceForm, type: allowanceForm.type.trim() } : item
      );
      addToast(`Allowance "${allowanceForm.type}" updated successfully.`, 'success');
    } else {
      const newAllow = {
        ...allowanceForm,
        type: allowanceForm.type.trim()
      };
      updatedList = [...profileData.allowances, newAllow];
      addToast(`Allowance "${allowanceForm.type}" added successfully.`, 'success');
    }

    setProfileData(prev => ({
      ...prev,
      allowances: updatedList
    }));
    setIsStateModified(true);
    setShowAllowanceModal(false);
  };

  const handleDeleteAllowance = (id: string, type: string) => {
    const updatedList = profileData.allowances.filter(item => item.id !== id);
    setProfileData(prev => ({
      ...prev,
      allowances: updatedList
    }));
    setIsStateModified(true);
    addToast(`Allowance "${type}" removed.`, 'info');
  };

  // Deduction actions
  const handleAddDeduction = () => {
    setEditingDeduction(null);
    setDeductionForm({
      id: `DED-${Math.floor(100 + Math.random() * 900)}`,
      type: '',
      amount: 0,
      frequency: 'Monthly',
      reference: 'Statutory',
      status: 'Active'
    });
    setShowDeductionModal(true);
  };

  const handleEditDeduction = (ded: any) => {
    setEditingDeduction(ded);
    setDeductionForm({
      id: ded.id,
      type: ded.type,
      amount: ded.amount,
      frequency: ded.frequency,
      reference: ded.reference,
      status: ded.status
    });
    setShowDeductionModal(true);
  };

  const handleSaveDeduction = (e: FormEvent) => {
    e.preventDefault();
    if (!deductionForm.type.trim()) {
      addToast('Deduction Type is required.', 'error');
      return;
    }
    if (deductionForm.amount <= 0) {
      addToast('Amount must be greater than 0.', 'error');
      return;
    }

    let updatedList;
    if (editingDeduction) {
      updatedList = profileData.deductions.map(item => 
        item.id === editingDeduction.id ? { ...item, ...deductionForm, type: deductionForm.type.trim() } : item
      );
      addToast(`Deduction "${deductionForm.type}" updated successfully.`, 'success');
    } else {
      const newDed = {
        ...deductionForm,
        type: deductionForm.type.trim()
      };
      updatedList = [...profileData.deductions, newDed];
      addToast(`Deduction "${deductionForm.type}" added successfully.`, 'success');
    }

    setProfileData(prev => ({
      ...prev,
      deductions: updatedList
    }));
    setIsStateModified(true);
    setShowDeductionModal(false);
  };

  const handleDeleteDeduction = (id: string, type: string) => {
    const updatedList = profileData.deductions.filter(item => item.id !== id);
    setProfileData(prev => ({
      ...prev,
      deductions: updatedList
    }));
    setIsStateModified(true);
    addToast(`Deduction "${type}" removed.`, 'info');
  };

  // Career history actions
  const handleAddCareer = () => {
    setEditingCareer(null);
    setCareerForm({
      id: `CAR-${Math.floor(100 + Math.random() * 900)}`,
      company: '',
      position: '',
      from: '',
      to: '',
      reason: ''
    });
    setShowCareerModal(true);
  };

  const handleEditCareer = (career: any) => {
    setEditingCareer(career);
    setCareerForm({
      id: career.id,
      company: career.company,
      position: career.position,
      from: career.from,
      to: career.to,
      reason: career.reason
    });
    setShowCareerModal(true);
  };

  const handleSaveCareer = (e: FormEvent) => {
    e.preventDefault();
    if (!careerForm.company.trim()) {
      addToast('Company is required.', 'error');
      return;
    }
    if (!careerForm.position.trim()) {
      addToast('Position is required.', 'error');
      return;
    }

    let updatedList;
    if (editingCareer) {
      updatedList = profileData.careerHistory.map(item => 
        item.id === editingCareer.id ? { ...item, ...careerForm, company: careerForm.company.trim(), position: careerForm.position.trim() } : item
      );
      addToast(`Career entry at "${careerForm.company}" updated successfully.`, 'success');
    } else {
      const newCareer = {
        ...careerForm,
        company: careerForm.company.trim(),
        position: careerForm.position.trim()
      };
      updatedList = [...profileData.careerHistory, newCareer];
      addToast(`Career entry at "${careerForm.company}" added successfully.`, 'success');
    }

    setProfileData(prev => ({
      ...prev,
      careerHistory: updatedList
    }));
    setIsStateModified(true);
    setShowCareerModal(false);
  };

  const handleDeleteCareer = (id: string, company: string) => {
    const updatedList = profileData.careerHistory.filter(item => item.id !== id);
    setProfileData(prev => ({
      ...prev,
      careerHistory: updatedList
    }));
    setIsStateModified(true);
    addToast(`Career entry at "${company}" removed.`, 'info');
  };

  // Education actions
  const handleAddEducation = () => {
    setEditingEducation(null);
    setEducationForm({
      id: `EDU-${Math.floor(100 + Math.random() * 900)}`,
      institution: '',
      qualification: '',
      fieldOfStudy: '',
      year: '',
      grade: ''
    });
    setShowEducationModal(true);
  };

  const handleEditEducation = (edu: any) => {
    setEditingEducation(edu);
    setEducationForm({
      id: edu.id,
      institution: edu.institution,
      qualification: edu.qualification,
      fieldOfStudy: edu.fieldOfStudy,
      year: edu.year,
      grade: edu.grade
    });
    setShowEducationModal(true);
  };

  const handleSaveEducation = (e: FormEvent) => {
    e.preventDefault();
    if (!educationForm.institution.trim()) {
      addToast('Institution is required.', 'error');
      return;
    }
    if (!educationForm.qualification.trim()) {
      addToast('Qualification is required.', 'error');
      return;
    }

    let updatedList;
    if (editingEducation) {
      updatedList = profileData.educationList.map(item => 
        item.id === editingEducation.id ? { ...item, ...educationForm, institution: educationForm.institution.trim(), qualification: educationForm.qualification.trim() } : item
      );
      addToast(`Education at "${educationForm.institution}" updated successfully.`, 'success');
    } else {
      const newEdu = {
        ...educationForm,
        institution: educationForm.institution.trim(),
        qualification: educationForm.qualification.trim()
      };
      updatedList = [...profileData.educationList, newEdu];
      addToast(`Education at "${educationForm.institution}" added successfully.`, 'success');
    }

    setProfileData(prev => ({
      ...prev,
      educationList: updatedList
    }));
    setIsStateModified(true);
    setShowEducationModal(false);
  };

  const handleDeleteEducation = (id: string, institution: string) => {
    const updatedList = profileData.educationList.filter(item => item.id !== id);
    setProfileData(prev => ({
      ...prev,
      educationList: updatedList
    }));
    setIsStateModified(true);
    addToast(`Education at "${institution}" removed.`, 'info');
  };

  // Payrate Math
  const totalAllowances = profileData.allowances.reduce((acc, current) => acc + (current.status === 'Active' ? current.amount : 0), 0);
  const totalDeductions = profileData.deductions.reduce((acc, current) => acc + (current.status === 'Active' ? current.amount : 0), 0);
  const estimatedNetPay = profileData.basicSalary + totalAllowances - totalDeductions;

  // Render Table / Rows based on Tabs
  if (!employee) {
    return (
      <div id="no-profile-view" className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <Users className="h-10 w-10 text-slate-300 mb-3" />
        <p className="text-slate-500 text-sm font-semibold">No Employee profile Selected</p>
        <p className="text-slate-400 text-xs mt-1">Please select an employee from the directory list.</p>
      </div>
    );
  }

  return (
    <div id="extended-profile-component-stage" className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. PRIMARY PORTAL CONTROLS SUBBAR - REMOVED GIGANTIC RIBBON */}
      <div className="flex items-center justify-between pb-1 select-none">
        <button 
          id="profile-back-to-directory"
          onClick={onBackToDirectory}
          className="flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-[#2f66e0] transition-colors cursor-pointer group"
        >
          <ChevronLeft className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Employee Directory</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button 
            id="profile-delete-btn"
            onClick={() => setShowDeleteModal(true)}
            className="px-3.5 py-1.5 text-[11px] font-bold text-rose-500 hover:text-rose-600 bg-white border border-rose-200/60 hover:bg-rose-50/50 rounded-xl transition-all cursor-pointer shadow-3xs"
          >
            Delete Employee
          </button>
          
          <button 
            id="profile-pwd-reset"
            onClick={handleResetPassword}
            className="px-3.5 py-1.5 text-[11px] font-bold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all cursor-pointer shadow-3xs"
          >
            Reset Password
          </button>
        </div>
      </div>

      {/* 2. EMPLOYEE SUMMARY TOP CARD (Tenure, Pay Grade, etc.) */}
      <div id="profile-summary-header-card" className="bg-white border border-slate-100 rounded-3xl p-6.5 shadow-sm">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          
          <div className="flex items-center gap-5">
            {/* Ava */}
            <div className={`h-22 w-22 rounded-full flex items-center justify-center font-bold text-2xl tracking-tighter shadow-md border border-slate-100 ${employee.avatarColor}`}>
              {getInitials(employee.name)}
            </div>
            
            {/* Core titles details */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-bold tracking-tight text-slate-800 leading-none">{employee.name}</h2>
                <span className="bg-emerald-50 text-emerald-600 border border-emerald-100/30 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-mono text-slate-500 font-semibold">
                  <Shield className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  {employee.id}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" strokeWidth={2.2} />
                  Kuala Lumpur, HQ
                </span>
              </div>

              <div className="text-[11.5px] font-semibold text-slate-400">
                {employee.department} &middot; {employee.position}
                <span className="ml-2 pl-2 border-l border-slate-200">Reports to: <b>David Ng</b></span>
              </div>
            </div>
          </div>

          {/* Stat summary grid with thin vertical separators */}
          <div className="grid grid-cols-4 gap-4 xl:w-fit xl:gap-8 bg-slate-50/50 p-4.5 rounded-2xl border border-slate-100/50">
            <div className="text-center px-2">
              <span className="text-[15px] font-black text-slate-800 block">{profileData.tenure}</span>
              <span className="text-[9.5px] text-slate-400 font-extrabold uppercase tracking-wide block mt-0.5">Tenure</span>
            </div>
            <div className="text-center px-4 border-l border-slate-200/80">
              <span className="text-[15px] font-black text-slate-800 block">{profileData.payGrade}</span>
              <span className="text-[9.5px] text-slate-400 font-extrabold uppercase tracking-wide block mt-0.5">Pay Grade</span>
            </div>
            <div className="text-center px-4 border-l border-slate-200/80">
              <span className="text-[15px] font-black text-slate-800 block">{profileData.leaveLeft}</span>
              <span className="text-[9.5px] text-slate-400 font-extrabold uppercase tracking-wide block mt-0.5">Leave Left</span>
            </div>
            <div className="text-center px-2 border-l border-slate-200/80">
              <span className="text-[15px] font-black text-slate-800 block">{profileData.performanceScore}</span>
              <span className="text-[9.5px] text-slate-400 font-extrabold uppercase tracking-wide block mt-0.5">Performance</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. PROFILE SUB-TAB NAVIGATION STRIP */}
      <div id="profile-subtabs-strip" className="overflow-x-auto bg-white border border-slate-100 rounded-2xl px-2.5 py-1 flex items-center gap-1 shadow-sm scrollbar-none select-none">
        {([
          'Summary', 'Personal', 'Family', 'Biometric', 'Pay Rate', 'Career', 'Education', 'Documents'
        ] as ProfileSubTab[]).map(tab => {
          const isActive = activeTab === tab;
          return (
            <button
              id={`profile-subtab-${tab.toLowerCase().replace(/\s+/g, '-')}`}
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs font-semibold px-4.5 py-3.5 rounded-xl transition-all relative whitespace-nowrap cursor-pointer ${
                isActive 
                  ? 'text-[#2f66e0] font-bold' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {tab}
              {isActive && (
                <motion.span 
                  layoutId="activeProfileTabUnderline"
                  className="absolute bottom-0 left-4.5 right-4.5 h-0.5 bg-[#2f66e0] rounded-sm" 
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 4. ACTIVE SUBTAB WORKSPACE PANEL */}
      <div id="profile-workspace-board">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            
            {/* SUBTAB 1: Summary Tab */}
            {activeTab === 'Summary' && (
              <div id="subtab-summary-content" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Employment Details & Leave Balance Column */}
                <div className="lg:col-span-6 space-y-6">
                  
                  {/* Card 1: Employment details */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6.5 shadow-sm space-y-5">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Employment details</h3>
                      {!isEditingSummary ? (
                        <button 
                          onClick={() => setIsEditingSummary(true)}
                          className="text-[10px] font-black text-[#2f66e0] hover:bg-blue-50/50 hover:underline px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all"
                        >
                          <Edit2 className="h-3 w-3" />
                          <span>Edit</span>
                        </button>
                      ) : (
                        <button 
                          onClick={() => { 
                            setIsEditingSummary(false); 
                            triggerAutoSave(profileData.jobType); 
                            addToast('Employment details successfully updated and saved.', 'success');
                          }}
                          className="text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="h-3 w-3" />
                          <span>Done</span>
                        </button>
                      )}
                    </div>

                    <div className="space-y-3.5 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-50/70">
                        <span className="text-slate-400 font-medium">Employee No.</span>
                        <span className="text-slate-800 font-mono font-bold">{employee.id}</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-50/70">
                        <span className="text-slate-400 font-medium">Company</span>
                        {isEditingSummary ? (
                          <input 
                            type="text" 
                            value={profileData.company} 
                            onChange={(e) => { setProfileData({...profileData, company: e.target.value}); setIsStateModified(true); }}
                            className="bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 px-2 py-0.5 rounded text-xs w-48 text-right font-bold"
                          />
                        ) : (
                          <span className="text-slate-800 font-bold">{profileData.company}</span>
                        )}
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-50/70">
                        <span className="text-slate-400 font-medium">Department</span>
                        <span className="text-slate-800 font-bold">{employee.department}</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-50/70">
                        <span className="text-slate-400 font-medium">Position</span>
                        <span className="text-slate-800 font-bold">{employee.position}</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-50/70">
                        <span className="text-slate-400 font-medium">Job Type</span>
                        {isEditingSummary ? (
                          <select 
                            value={profileData.jobType} 
                            onChange={(e) => { setProfileData({...profileData, jobType: e.target.value as EmploymentStatus}); setIsStateModified(true); }}
                            className="bg-slate-50 border border-slate-200 focus:outline-none px-1 py-0.5 rounded text-xs select-none font-bold"
                          >
                            <option value="Permanent">Permanent</option>
                            <option value="Contract">Contract</option>
                            <option value="Intern">Intern</option>
                            <option value="Part-time">Part-time</option>
                          </select>
                        ) : (
                          <span className="text-slate-800 font-bold">{profileData.jobType}</span>
                        )}
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-50/70 items-center">
                        <span className="text-slate-400 font-medium">Employment status</span>
                        <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide border border-emerald-100">
                          Active
                        </span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-50/70">
                        <span className="text-slate-400 font-medium">Join date</span>
                        <span className="text-slate-800 font-bold">{employee.joinDate}</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-50/70">
                        <span className="text-slate-400 font-medium">Position start date</span>
                        {isEditingSummary ? (
                          <input 
                            type="text" 
                            value={profileData.positionStartDate} 
                            onChange={(e) => { setProfileData({...profileData, positionStartDate: e.target.value}); setIsStateModified(true); }}
                            className="bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 px-2 py-0.5 rounded text-xs text-right font-bold"
                          />
                        ) : (
                          <span className="text-slate-800 font-bold">{profileData.positionStartDate}</span>
                        )}
                      </div>

                      <div className="flex justify-between py-1">
                        <span className="text-slate-400 font-medium">Job grade</span>
                        {isEditingSummary ? (
                          <input 
                            type="text" 
                            value={profileData.jobGrade} 
                            onChange={(e) => { setProfileData({...profileData, jobGrade: e.target.value}); setIsStateModified(true); }}
                            className="bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 px-2 py-0.5 rounded text-xs text-right font-bold"
                          />
                        ) : (
                          <span className="text-slate-800 font-bold">{profileData.jobGrade}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Leave balance */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6.5 shadow-sm space-y-5">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-3">Leave balance</h3>
                    
                    <div className="space-y-4">
                      {/* Annual */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-500">Annual leave</span>
                          <span className="text-slate-800 font-mono font-black">{profileData.annualLeaveUsed} / {profileData.annualLeaveMax} days</span>
                        </div>
                        <div className="w-full bg-slate-105 bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100/50">
                          <div className="bg-[#2f66e0] h-full rounded-full" style={{ width: `${(profileData.annualLeaveUsed / profileData.annualLeaveMax) * 100}%` }} />
                        </div>
                      </div>

                      {/* Medical */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-500">Medical leave</span>
                          <span className="text-slate-800 font-mono font-black">{profileData.medicalLeaveUsed} / {profileData.medicalLeaveMax} days</span>
                        </div>
                        <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100/50">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(profileData.medicalLeaveUsed / profileData.medicalLeaveMax) * 100}%` }} />
                        </div>
                      </div>

                      {/* Emergency */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-500">Emergency leave</span>
                          <span className="text-slate-800 font-mono font-black">{profileData.emergencyLeaveUsed} / {profileData.emergencyLeaveMax} days</span>
                        </div>
                        <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100/50">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(profileData.emergencyLeaveUsed / profileData.emergencyLeaveMax) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Performance & HR Notes Column */}
                <div className="lg:col-span-6 space-y-6">
                  
                  {/* Card 1: Performance overview */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6.5 shadow-sm space-y-4">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-3">Performance overview</h3>
                    
                    <div className="space-y-3.5">
                      {/* Tech skills */}
                      <div className="flex items-center justify-between text-xs font-bold gap-4">
                        <span className="text-slate-500 w-28 text-[11px]">Technical skills</span>
                        <div className="flex-1 bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100/50">
                          <div className="bg-[#2f66e0] h-full rounded-full" style={{ width: `${profileData.prefTechnical}%` }} />
                        </div>
                        <span className="text-slate-800 font-black font-mono w-10 text-right">{profileData.prefTechnical}%</span>
                      </div>

                      {/* Comm */}
                      <div className="flex items-center justify-between text-xs font-bold gap-4">
                        <span className="text-slate-500 w-28 text-[11px]">Communication</span>
                        <div className="flex-1 bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100/50">
                          <div className="bg-[#2f66e0] h-full rounded-full" style={{ width: `${profileData.prefCommunication}%` }} />
                        </div>
                        <span className="text-slate-800 font-black font-mono w-10 text-right">{profileData.prefCommunication}%</span>
                      </div>

                      {/* Teams */}
                      <div className="flex items-center justify-between text-xs font-bold gap-4">
                        <span className="text-slate-500 w-28 text-[11px]">Teamwork</span>
                        <div className="flex-1 bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100/50">
                          <div className="bg-[#2f66e0] h-full rounded-full" style={{ width: `${profileData.prefTeamwork}%` }} />
                        </div>
                        <span className="text-slate-800 font-black font-mono w-10 text-right">{profileData.prefTeamwork}%</span>
                      </div>

                      {/* Punc */}
                      <div className="flex items-center justify-between text-xs font-bold gap-4">
                        <span className="text-slate-500 w-28 text-[11px]">Punctuality</span>
                        <div className="flex-1 bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100/50">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${profileData.prefPunctuality}%` }} />
                        </div>
                        <span className="text-slate-800 font-black font-mono w-10 text-right">{profileData.prefPunctuality}%</span>
                      </div>

                      {/* Lead */}
                      <div className="flex items-center justify-between text-xs font-bold gap-4">
                        <span className="text-slate-500 w-28 text-[11px]">Leadership</span>
                        <div className="flex-1 bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100/50">
                          <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${profileData.prefLeadership}%` }} />
                        </div>
                        <span className="text-slate-800 font-black font-mono w-10 text-right">{profileData.prefLeadership}%</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-50/80 pt-3 space-y-2 text-xs font-semibold">
                      <div className="flex justify-between py-1">
                        <span className="text-slate-400">Last appraisal</span>
                        <span className="text-slate-800 font-bold">{profileData.lastAppraisal}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-400">Next review</span>
                        <span className="text-slate-800 font-bold">{profileData.nextReview}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: HR Notes */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6.5 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">HR notes</h3>
                      {!isEditingHRNotes ? (
                        <button 
                          onClick={() => setIsEditingHRNotes(true)}
                          className="text-[10px] font-black text-[#2f66e0] hover:bg-blue-50/50 hover:underline px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all"
                        >
                          <Edit2 className="h-3 w-3" />
                          <span>Edit</span>
                        </button>
                      ) : (
                        <button 
                          onClick={() => { 
                            setIsEditingHRNotes(false); 
                            triggerAutoSave(); 
                            addToast('HR notes updated and auto-saved.', 'success');
                          }}
                          className="text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="h-3 w-3" />
                          <span>Done</span>
                        </button>
                      )}
                    </div>

                    <div className="space-y-4 text-xs font-semibold">
                      {isEditingHRNotes ? (
                        <textarea
                          value={profileData.hrNotes}
                          rows={3}
                          onChange={(e) => { setProfileData({...profileData, hrNotes: e.target.value}); setIsStateModified(true); }}
                          className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 p-2 rounded text-xs font-bold text-slate-800"
                        />
                      ) : (
                        <p className="text-slate-600 leading-relaxed bg-slate-50/60 p-3 rounded-2xl border border-slate-100/50">
                          {profileData.hrNotes}
                        </p>
                      )}

                      <div className="flex justify-between py-1 border-b border-slate-50/70 items-center">
                        <span className="text-slate-400">Blacklisted</span>
                        {isEditingHRNotes ? (
                          <select 
                            value={profileData.blacklisted}
                            onChange={(e) => { setProfileData({...profileData, blacklisted: e.target.value}); setIsStateModified(true); }}
                            className="bg-slate-50 border border-slate-200 px-1 py-0.5 rounded text-xs select-none font-bold"
                          >
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                          </select>
                        ) : (
                          <span className={profileData.blacklisted === 'Yes' ? 'text-rose-600 font-black' : 'text-slate-800 font-bold'}>{profileData.blacklisted}</span>
                        )}
                      </div>

                      <div className="flex justify-between py-1 items-center">
                        <span className="text-slate-400">Auto clock-in</span>
                        {isEditingHRNotes ? (
                          <select 
                            value={profileData.autoClockIn}
                            onChange={(e) => { setProfileData({...profileData, autoClockIn: e.target.value}); setIsStateModified(true); }}
                            className="bg-slate-50 border border-slate-200 px-1 py-0.5 rounded text-xs select-none font-bold"
                          >
                            <option value="Disabled">Disabled</option>
                            <option value="Enabled">Enabled</option>
                          </select>
                        ) : (
                          <span className="text-slate-800 font-bold">{profileData.autoClockIn}</span>
                        )}
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* SUBTAB 2: Personal Tab */}
            {activeTab === 'Personal' && (
              <div id="subtab-personal-content" className="space-y-6">
                
                {/* Personal Information Grid */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6.5 shadow-sm space-y-5">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Personal information</h3>
                    {!isEditingPersonal ? (
                      <button 
                        onClick={() => setIsEditingPersonal(true)}
                        className="text-[10px] font-black text-[#2f66e0] hover:bg-blue-50/50 hover:underline px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all"
                      >
                        <Edit2 className="h-3 w-3" />
                        <span>Edit</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => { 
                          setIsEditingPersonal(false); 
                          triggerAutoSave(undefined, profileData.mobileNo); 
                          addToast('Personal details updated and auto-saved.', 'success');
                        }}
                        className="text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="h-3 w-3" />
                        <span>Done</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-12 text-xs">
                    
                    {/* Input Field Helper (Compact Inline Inputs) */}
                    {[
                      { key: 'name', label: 'Full name', value: employee.name, editable: false },
                      { key: 'dob', label: 'Date of birth', value: profileData.dob },
                      { key: 'gender', label: 'Gender', value: profileData.gender },
                      { key: 'nationality', label: 'Nationality', value: profileData.nationality },
                      { key: 'nric', label: 'NRIC / ID No.', value: profileData.nric },
                      { key: 'religion', label: 'Religion', value: profileData.religion },
                      { key: 'maritalStatus', label: 'Marital status', value: profileData.maritalStatus },
                      { key: 'personalEmail', label: 'Personal email', value: profileData.personalEmail },
                      { key: 'mobileNo', label: 'Mobile no.', value: profileData.mobileNo },
                      { key: 'race', label: 'Race', value: profileData.race }
                    ].map((field) => (
                      <div key={field.key} className="flex flex-col gap-1 pb-2 border-b border-slate-50">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">{field.label}</span>
                        {isEditingPersonal && field.editable !== false ? (
                          <input 
                            type="text" 
                            value={(profileData as any)[field.key]} 
                            onChange={(e) => { setProfileData({...profileData, [field.key]: e.target.value}); setIsStateModified(true); }}
                            className="bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 px-2 py-1 rounded text-xs font-bold text-slate-800"
                          />
                        ) : (
                          <span className="text-slate-800 font-bold block pt-0.5">{field.value}</span>
                        )}
                      </div>
                    ))}

                  </div>
                </div>

                {/* Passport details */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6.5 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Passport details</h3>
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="passport-enable"
                        checked={profileData.passportEnabled}
                        onChange={(e) => { setProfileData({...profileData, passportEnabled: e.target.checked}); setIsStateModified(true); }}
                        className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <label htmlFor="passport-enable" className="text-xs font-black text-slate-600 cursor-pointer uppercase tracking-wider text-[10px]">Enable</label>
                    </div>
                  </div>

                  {profileData.passportEnabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-12 text-xs">
                      {[
                        { key: 'passportNo', label: 'Passport no.', value: profileData.passportNo },
                        { key: 'passportCountry', label: 'Country of issue', value: profileData.passportCountry },
                        { key: 'passportIssueDate', label: 'Issue date', value: profileData.passportIssueDate },
                        { key: 'passportExpiryDate', label: 'Expiry date', value: profileData.passportExpiryDate }
                      ].map((field) => (
                        <div key={field.key} className="flex flex-col gap-1 pb-2 border-b border-slate-50">
                          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">{field.label}</span>
                          {isEditingPersonal ? (
                            <input 
                              type="text" 
                              value={(profileData as any)[field.key]} 
                              onChange={(e) => { setProfileData({...profileData, [field.key]: e.target.value}); setIsStateModified(true); }}
                              className="bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 px-2 py-1 rounded text-xs font-bold text-slate-800"
                            />
                          ) : (
                            <span className="text-slate-800 font-bold block pt-0.5">{field.value}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Current Address */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6.5 shadow-sm space-y-4">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-3">Current address</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-12 text-xs">
                    {[
                      { key: 'addressLine1', label: 'Address line 1', value: profileData.addressLine1 },
                      { key: 'addressLine2', label: 'Address line 2', value: profileData.addressLine2 },
                      { key: 'city', label: 'City', value: profileData.city },
                      { key: 'state', label: 'State', value: profileData.state },
                      { key: 'postcode', label: 'Postcode', value: profileData.postcode },
                      { key: 'country', label: 'Country', value: profileData.country }
                    ].map((field) => (
                      <div key={field.key} className="flex flex-col gap-1 pb-2 border-b border-slate-50">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">{field.label}</span>
                        {isEditingPersonal ? (
                          <input 
                            type="text" 
                            value={(profileData as any)[field.key]} 
                            onChange={(e) => { setProfileData({...profileData, [field.key]: e.target.value}); setIsStateModified(true); }}
                            className="bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-500 px-2 py-1 rounded text-xs font-bold text-slate-800"
                          />
                        ) : (
                          <span className="text-slate-800 font-bold block pt-0.5">{field.value}</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input 
                      type="checkbox" 
                      id="address-same"
                      checked={profileData.sameAsPermanent}
                      onChange={(e) => { setProfileData({...profileData, sameAsPermanent: e.target.checked}); setIsStateModified(true); }}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="address-same" className="text-xs font-semibold text-slate-600 cursor-pointer select-none">Same as permanent address</label>
                  </div>
                </div>

              </div>
            )}

            {/* SUBTAB 3: Family Tab */}
            {activeTab === 'Family' && (
              <div id="subtab-family-content" className="space-y-6">
                
                {/* 1. Family Members List Card */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6.5 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <div className="space-y-0.5">
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Family members</h3>
                      <p className="text-[10px] text-slate-400">Manage dependents, spouses, children and tax status details</p>
                    </div>
                    <button 
                      onClick={handleAddFamilyMember}
                      className="bg-[#2f66e0] hover:bg-[#2051bf] text-white font-bold text-[10px] px-3.5 py-2 rounded-xl transition-all inline-flex items-center gap-1 cursor-pointer shadow-xs whitespace-nowrap shrink-0"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Member</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-slate-400 font-extrabold pb-3 border-b border-slate-50 text-[10.5px] uppercase tracking-wider">
                          <th className="pb-3.5 font-extrabold select-none">Name</th>
                          <th className="pb-3.5 font-extrabold select-none">Relationship</th>
                          <th className="pb-3.5 font-extrabold select-none">Date of birth</th>
                          <th className="pb-3.5 font-extrabold select-none">NRIC / ID</th>
                          <th className="pb-3.5 font-extrabold select-none">Tax exempt</th>
                          <th className="pb-3.5 font-extrabold select-none">Passport</th>
                          <th className="pb-3.5 font-extrabold select-none text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50/70 font-semibold text-slate-700">
                        {profileData.familyMembers.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-slate-400 font-bold text-[11px]">
                              No family members registered. Click "Add member" to insert.
                            </td>
                          </tr>
                        ) : (
                          profileData.familyMembers.map((fam) => (
                            <tr key={fam.id} className="hover:bg-slate-50/20">
                              <td className="py-3.5 font-bold text-slate-800">
                                {fam.name}
                              </td>
                              <td className="py-3.5">
                                <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
                                  fam.relationship === 'Spouse' 
                                    ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                                    : fam.relationship === 'Child'
                                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                                }`}>
                                  {fam.relationship}
                                </span>
                              </td>
                              <td className="py-3.5 font-mono text-slate-600">
                                {fam.dob || '—'}
                              </td>
                              <td className="py-3.5 font-mono text-slate-600">
                                {fam.nric || '—'}
                              </td>
                              <td className="py-3.5">
                                <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border transition-all ${
                                  fam.taxExempt 
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                    : 'bg-rose-50 text-rose-700 border-rose-100'
                                }`}>
                                  {fam.taxExempt ? 'Yes' : 'No'}
                                </span>
                              </td>
                              <td className="py-3.5 font-mono text-slate-600">
                                {fam.passport || 'N/A'}
                              </td>
                              <td className="py-3.5 text-right">
                                <div className="flex items-center justify-end gap-2 text-right">
                                  <button 
                                    onClick={() => handleEditFamilyMember(fam)}
                                    className="px-3 py-1.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg text-slate-700 font-bold tracking-wide text-[10.5px] cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteFamilyMember(fam.id, fam.name)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-lg cursor-pointer transition-colors hover:bg-rose-50/40"
                                    title="Delete Member"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Next of Kin Emergency contact */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6.5 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <div className="space-y-0.5">
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Next of kin / emergency contact</h3>
                      <p className="text-[10px] text-slate-400">Emergency contacts and primary communication hierarchy</p>
                    </div>
                    <button 
                      onClick={handleAddNok}
                      className="bg-[#2f66e0] hover:bg-[#2051bf] text-white font-bold text-[10px] px-3.5 py-2 rounded-xl transition-all inline-flex items-center gap-1 cursor-pointer shadow-xs whitespace-nowrap shrink-0"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Kin</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-slate-400 font-extrabold pb-3 border-b border-slate-100 text-[10.5px] uppercase tracking-wider">
                          <th className="pb-3 text-left">Name</th>
                          <th className="pb-3 text-left">Relationship</th>
                          <th className="pb-3 text-left">Contact no.</th>
                          <th className="pb-3 text-left">Address</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50/70 font-semibold text-slate-700">
                        {profileData.nokList.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-slate-400 font-bold text-[11px]">
                              No contacts listed. Click "Add kin" to insert.
                            </td>
                          </tr>
                        ) : (
                          profileData.nokList.map((nok) => (
                            <tr key={nok.id} className="hover:bg-slate-50/20">
                              <td className="py-3.5 font-bold text-slate-800">
                                {nok.name}
                              </td>
                              <td className="py-3.5">
                                <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full text-[9px] font-black uppercase">
                                  {nok.relationship}
                                </span>
                              </td>
                              <td className="py-3.5 font-mono text-slate-600">
                                {nok.contactNo || '—'}
                              </td>
                              <td className="py-3.5 text-slate-600">
                                {nok.address || '—'}
                              </td>
                              <td className="py-3.5 text-right">
                                <div className="flex items-center justify-end gap-2 text-right">
                                  <button 
                                    onClick={() => handleEditNok(nok)}
                                    className="px-3 py-1.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg text-slate-700 font-bold tracking-wide text-[10.5px] cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteNok(nok.id, nok.name)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-lg cursor-pointer transition-colors hover:bg-rose-50/40"
                                    title="Delete Kin"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* SUBTAB 4: Biometric Tab */}
            {activeTab === 'Biometric' && (
              <div id="subtab-biometric-content" className="space-y-6">
                
                {/* 1. Device Registration Card */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6.5 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <div className="space-y-0.5">
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Biometric device registration</h3>
                      <p className="text-[10px] text-slate-400">Manage device registration and terminal allocations</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <input 
                          type="checkbox" 
                          id="biometrics-enable-box"
                          checked={profileData.biometricsEnabled}
                          onChange={(e) => { setProfileData({...profileData, biometricsEnabled: e.target.checked}); setIsStateModified(true); }}
                          className="h-3.5 w-3.5 rounded border-slate-300 text-[#2f66e0] focus:ring-blue-500 cursor-pointer"
                        />
                        <label htmlFor="biometrics-enable-box" className="text-xs font-black text-slate-600 cursor-pointer uppercase tracking-wider text-[10.5px]">Enabled</label>
                      </div>
                      <button 
                        disabled={!profileData.biometricsEnabled}
                        onClick={handleAddBiometricDevice}
                        className={`font-bold text-[10px] px-3.5 py-2 rounded-xl transition-all inline-flex items-center gap-1 cursor-pointer border shadow-xs ${
                          profileData.biometricsEnabled 
                            ? 'bg-[#2f66e0] hover:bg-[#2051bf] text-white border-transparent' 
                            : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                        } whitespace-nowrap`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Device</span>
                      </button>
                    </div>
                  </div>

                  {profileData.biometricsEnabled && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-slate-400 font-extrabold pb-3 border-b border-slate-100 text-[10.5px] uppercase tracking-wider select-none">
                            <th className="pb-3.5">TA Number</th>
                            <th className="pb-3.5">Terminal name</th>
                            <th className="pb-3.5">Device type</th>
                            <th className="pb-3.5">Location</th>
                            <th className="pb-3.5">Status</th>
                            <th className="pb-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50/70 font-semibold text-slate-700">
                          {profileData.biometricDevices.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-slate-400 font-bold text-[11px]">
                                No registered devices. Click "Add device" to register one.
                              </td>
                            </tr>
                          ) : (
                            profileData.biometricDevices.map((dev, idx) => (
                              <tr key={dev.taNumber || idx} className="hover:bg-slate-50/20">
                                <td className="py-3.5 font-mono font-bold text-slate-500 text-[11px]">{dev.taNumber}</td>
                                <td className="py-3.5 font-bold text-slate-800">{dev.terminalName}</td>
                                <td className="py-3.5">
                                  <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase">
                                    {dev.deviceType}
                                  </span>
                                </td>
                                <td className="py-3.5 text-slate-600">{dev.location || '—'}</td>
                                <td className="py-3.5">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                    dev.status === 'Active' 
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                      : 'bg-slate-100 text-slate-600 border-slate-200'
                                  }`}>
                                    {dev.status}
                                  </span>
                                </td>
                                <td className="py-3.5 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button 
                                      onClick={() => handleEditBiometricDevice(dev)}
                                      className="px-3 py-1.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg text-slate-700 font-bold tracking-wide text-[10.5px] cursor-pointer"
                                    >
                                      Edit
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteBiometricDevice(dev.taNumber, dev.terminalName)}
                                      className="p-1.5 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-lg cursor-pointer transition-colors hover:bg-rose-50/40"
                                      title="Delete Device"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
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

                {/* 2. Attendance Settings Controls Card */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6.5 shadow-sm space-y-4">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-3">Attendance settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
                    
                    {/* Left Checkboxes */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-2.5">
                        <input 
                          type="checkbox" 
                          id="auto-clock-check"
                          checked={profileData.autoClockSetting}
                          onChange={(e) => { setProfileData({...profileData, autoClockSetting: e.target.checked}); setIsStateModified(true); }}
                          className="h-4 w-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <div className="flex flex-col">
                          <label htmlFor="auto-clock-check" className="font-bold text-slate-800 cursor-pointer text-[12px]">Auto clock-in / clock-out</label>
                          <span className="text-[10px] text-slate-400 font-medium">System auto-records attendance based on shift</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <input 
                          type="checkbox" 
                          id="ignore-missing-swipe"
                          checked={profileData.ignoreMissingSwipe}
                          onChange={(e) => { setProfileData({...profileData, ignoreMissingSwipe: e.target.checked}); setIsStateModified(true); }}
                          className="h-4 w-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <div className="flex flex-col">
                          <label htmlFor="ignore-missing-swipe" className="font-bold text-slate-800 cursor-pointer text-[12px]">Ignore missing swipe</label>
                          <span className="text-[10px] text-slate-400 font-medium">Suppress missing swipe alerts</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Checkboxes */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-2.5">
                        <input 
                          type="checkbox" 
                          id="ignore-rota"
                          checked={profileData.ignoreRotaDeduction}
                          onChange={(e) => { setProfileData({...profileData, ignoreRotaDeduction: e.target.checked}); setIsStateModified(true); }}
                          className="h-4 w-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <div className="flex flex-col">
                          <label htmlFor="ignore-rota" className="font-bold text-slate-800 cursor-pointer text-[12px]">Ignore rota deduction</label>
                          <span className="text-[10px] text-slate-400 font-medium">Skip deduction rules for this employee</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 pb-2 pl-6.5">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Assigned shift</span>
                        <span className="text-slate-800 font-black block text-[12px]">{profileData.assignedShift}</span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* SUBTAB 5: Pay Rate Tab */}
            {activeTab === 'Pay Rate' && (
              <div id="subtab-payrate-content" className="space-y-6">
                
                {/* 1. Base Pay Rate */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6.5 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Base pay rate</h3>
                    {!isEditingPayRate ? (
                      <button 
                        onClick={() => setIsEditingPayRate(true)}
                        className="text-[10px] font-black text-[#2f66e0] hover:bg-blue-50/50 hover:underline px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all"
                      >
                        <Edit2 className="h-3 w-3" />
                        <span>Edit</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => { 
                          setIsEditingPayRate(false); 
                          triggerAutoSave(); 
                          addToast('Pay rates updated and auto-saved.', 'success');
                        }}
                        className="text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="h-3 w-3" />
                        <span>Done</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5 text-xs font-semibold">
                    <div className="flex flex-col gap-1 pb-2 border-b border-slate-50">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Pay grade</span>
                      <span className="text-slate-800 font-bold block pt-0.5">{profileData.payGrade} / Sub B</span>
                    </div>

                    <div className="flex flex-col gap-1 pb-2 border-b border-slate-50">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Pay type</span>
                      <span className="text-slate-800 font-bold block pt-0.5">{profileData.payType}</span>
                    </div>

                    <div className="flex flex-col gap-1 pb-2 border-b border-slate-50">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Currency</span>
                      <span className="text-slate-800 font-bold block pt-0.5">{profileData.currency}</span>
                    </div>

                    <div className="flex flex-col gap-1 pb-2 border-b border-slate-50">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Basic salary</span>
                      {isEditingPayRate ? (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs font-bold text-slate-500">RM</span>
                          <input 
                            type="number" 
                            value={profileData.basicSalary} 
                            onChange={(e) => { setProfileData({...profileData, basicSalary: parseFloat(e.target.value) || 0}); setIsStateModified(true); }}
                            className="bg-slate-50 border border-slate-200 p-1 rounded text-xs text-slate-800 font-bold max-w-36 focus:outline-none"
                          />
                        </div>
                      ) : (
                        <span className="text-[#2F66E0] font-black block text-[13.5px] pt-0.5">MYR {profileData.basicSalary.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 pb-2 border-b border-slate-50">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Effective date</span>
                      <span className="text-slate-800 font-bold block pt-0.5">{profileData.payEffectiveDate}</span>
                    </div>

                    <div className="flex flex-col gap-1 pb-2 border-b border-slate-50">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Bank account</span>
                      {isEditingPayRate ? (
                        <input 
                          type="text" 
                          value={profileData.bankAccount} 
                          onChange={(e) => { setProfileData({...profileData, bankAccount: e.target.value}); setIsStateModified(true); }}
                          className="bg-slate-50 border border-slate-200 mt-1 p-1 rounded text-xs select-none max-w-44 focus:outline-none font-mono"
                        />
                      ) : (
                        <span className="font-mono text-slate-800 font-bold block pt-0.5">{profileData.bankAccount}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Allowances */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6.5 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <div className="space-y-0.5">
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Allowances</h3>
                      <p className="text-[10px] text-slate-400">Recurring or one-off positive wage components</p>
                    </div>
                    <button 
                      onClick={handleAddAllowance}
                      className="bg-[#2f66e0] hover:bg-[#2051bf] text-white font-bold text-[10px] px-3.5 py-2 rounded-xl transition-all inline-flex items-center gap-1 cursor-pointer border border-transparent shadow-xs whitespace-nowrap shrink-0"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Allowance</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-semibold">
                      <thead>
                        <tr className="text-slate-400 font-extrabold pb-3 border-b border-slate-100 text-[10.5px] uppercase tracking-wider select-none">
                          <th className="pb-3 text-left">Allowance type</th>
                          <th className="pb-3 text-left">Amount (MYR)</th>
                          <th className="pb-3 text-left">Frequency</th>
                          <th className="pb-3 text-left">Taxable</th>
                          <th className="pb-3 text-left">Status</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50/70 text-slate-700">
                        {profileData.allowances.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-slate-400 font-bold text-[11px]">
                              No allowances defined. Click "Add Allowance" to configure one.
                            </td>
                          </tr>
                        ) : (
                          profileData.allowances.map((allow, idx) => (
                            <tr key={allow.id || idx} className="hover:bg-slate-50/20">
                              <td className="py-3.5 font-bold text-slate-800">{allow.type}</td>
                              <td className="py-3.5 font-mono font-bold text-[#2f66e0]">
                                MYR {allow.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="py-3.5 text-slate-500 font-semibold">{allow.frequency}</td>
                              <td className="py-3.5">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${
                                  allow.taxable 
                                    ? 'bg-amber-50 text-amber-500 border-amber-100' 
                                    : 'bg-slate-100 text-slate-400 border-slate-200'
                                }`}>
                                  {allow.taxable ? 'Yes' : 'No'}
                                </span>
                              </td>
                              <td className="py-3.5">
                                <span className={`px-2 py-0.5 rounded text-[9.5px] font-black uppercase tracking-wider border ${
                                  allow.status === 'Active' 
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                    : 'bg-slate-100 text-slate-600 border-slate-200'
                                }`}>
                                  {allow.status}
                                </span>
                              </td>
                              <td className="py-3.5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button 
                                    onClick={() => handleEditAllowance(allow)}
                                    className="px-3 py-1.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg text-slate-700 font-bold tracking-wide text-[10.5px] cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteAllowance(allow.id, allow.type)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-lg cursor-pointer transition-colors hover:bg-rose-50/40"
                                    title="Delete Allowance"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3. Deductions */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6.5 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <div className="space-y-0.5">
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Deductions</h3>
                      <p className="text-[10px] text-slate-400">Regular, statutory or voluntary wage deductions</p>
                    </div>
                    <button 
                      onClick={handleAddDeduction}
                      className="bg-[#2f66e0] hover:bg-[#2051bf] text-white font-bold text-[10px] px-3.5 py-2 rounded-xl transition-all inline-flex items-center gap-1 cursor-pointer border border-transparent shadow-xs whitespace-nowrap shrink-0"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Deduction</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-semibold">
                      <thead>
                        <tr className="text-slate-400 font-extrabold pb-3 border-b border-slate-100 text-[10.5px] uppercase tracking-wider select-none">
                          <th className="pb-3 text-left">Deduction type</th>
                          <th className="pb-3 text-left">Amount (MYR)</th>
                          <th className="pb-3 text-left">Frequency</th>
                          <th className="pb-3 text-left">Reference</th>
                          <th className="pb-3 text-left">Status</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50/70 text-slate-700">
                        {profileData.deductions.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-slate-400 font-bold text-[11px]">
                              No deductions defined. Click "Add Deduction" to configure one.
                            </td>
                          </tr>
                        ) : (
                          profileData.deductions.map((ded, idx) => (
                            <tr key={ded.id || idx} className="hover:bg-slate-50/20">
                              <td className="py-3.5 font-bold text-slate-800">{ded.type}</td>
                              <td className="py-3.5 font-mono font-bold text-rose-600">
                                MYR {ded.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="py-3.5 text-slate-500 font-semibold">{ded.frequency}</td>
                              <td className="py-3.5 text-slate-600 font-bold">{ded.reference || '—'}</td>
                              <td className="py-3.5">
                                <span className={`px-2 py-0.5 rounded text-[9.5px] font-black uppercase tracking-wider border ${
                                  ded.status === 'Active' 
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                    : 'bg-slate-100 text-slate-600 border-slate-200'
                                }`}>
                                  {ded.status}
                                </span>
                              </td>
                              <td className="py-3.5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button 
                                    onClick={() => handleEditDeduction(ded)}
                                    className="px-3 py-1.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg text-slate-700 font-bold tracking-wide text-[10.5px] cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteDeduction(ded.id, ded.type)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-lg cursor-pointer transition-colors hover:bg-rose-50/40"
                                    title="Delete Deduction"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 4. Combined Sky Blue Estimated Pay Container Bar (PERFECT FINISH) */}
                <div className="bg-[#eff6ff] border border-blue-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="p-3 bg-white border border-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                      <Coins className="h-5.5 w-5.5 animate-pulse" />
                    </span>
                    <div>
                      <span className="text-blue-505 text-blue-600 text-xs font-black block tracking-wide uppercase text-[10.5px]">Estimated net pay (monthly)</span>
                      <span className="text-slate-400 text-[10.5px] font-bold block mt-0.5">Basic + Allowances &ndash; Deductions</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-auto select-none">
                    <span className="p-2.5 bg-white text-blue-700/60 rounded-full border border-blue-50/50">
                      <ArrowDown className="h-4.5 w-4.5 shrink-0" />
                    </span>
                    <span className="text-blue-700 font-black text-2xl font-mono tracking-tighter">
                      MYR {estimatedNetPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

              </div>
            )}

            {/* SUBTAB 6: Career Tab */}
            {activeTab === 'Career' && (
              <div id="subtab-career-content" className="space-y-6">
                <div className="bg-white border border-slate-100 rounded-3xl p-6.5 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <div className="space-y-0.5">
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Career history</h3>
                      <p className="text-[10px] text-slate-400">Previous professional roles and corporate experience</p>
                    </div>
                    <button 
                      onClick={handleAddCareer}
                      className="bg-[#2f66e0] hover:bg-[#2051bf] text-white font-bold text-[10px] px-3.5 py-2 rounded-xl transition-all inline-flex items-center gap-1 cursor-pointer border border-transparent shadow-xs whitespace-nowrap shrink-0"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Career Entry</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-semibold">
                      <thead>
                        <tr className="text-slate-400 font-extrabold pb-3 border-b border-slate-100 text-[10.5px] uppercase tracking-wider select-none">
                          <th className="pb-3 text-left">Company</th>
                          <th className="pb-3 text-left">Position</th>
                          <th className="pb-3 text-left">From</th>
                          <th className="pb-3 text-left">To</th>
                          <th className="pb-3 text-left">Reason for leaving</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50/70 text-slate-700">
                        {profileData.careerHistory.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-slate-400 font-bold text-[11px]">
                              No career entries registered. Click "Add Career Entry" to create one.
                            </td>
                          </tr>
                        ) : (
                          profileData.careerHistory.map((hist, idx) => (
                            <tr key={hist.id || idx} className="hover:bg-slate-50/20">
                              <td className="py-3.5 font-bold text-slate-800">{hist.company}</td>
                              <td className="py-3.5 text-slate-600 font-semibold">{hist.position}</td>
                              <td className="py-3.5 font-mono text-slate-500">{hist.from}</td>
                              <td className="py-3.5 font-mono text-slate-500">{hist.to}</td>
                              <td className="py-3.5 text-slate-500 font-medium">{hist.reason || '—'}</td>
                              <td className="py-3.5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button 
                                    onClick={() => handleEditCareer(hist)}
                                    className="px-3 py-1.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg text-slate-700 font-bold tracking-wide text-[10.5px] cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteCareer(hist.id, hist.company)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-lg cursor-pointer transition-colors hover:bg-rose-50/40"
                                    title="Delete Career"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB 7: Education Tab */}
            {activeTab === 'Education' && (
              <div id="subtab-education-content" className="space-y-6">
                <div className="bg-white border border-slate-100 rounded-3xl p-6.5 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <div className="space-y-0.5">
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Education</h3>
                      <p className="text-[10px] text-slate-400">Academic credentials and degrees</p>
                    </div>
                    <button 
                      onClick={handleAddEducation}
                      className="bg-[#2f66e0] hover:bg-[#2051bf] text-white font-bold text-[10px] px-3.5 py-2 rounded-xl transition-all inline-flex items-center gap-1 cursor-pointer border border-transparent shadow-xs whitespace-nowrap shrink-0"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Education</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-semibold">
                      <thead>
                        <tr className="text-slate-400 font-extrabold pb-3 border-b border-slate-100 text-[10.5px] uppercase tracking-wider select-none">
                          <th className="pb-3 text-left">Institution</th>
                          <th className="pb-3 text-left">Qualification</th>
                          <th className="pb-3 text-left">Field of study</th>
                          <th className="pb-3 text-left">Year</th>
                          <th className="pb-3 text-left">Grade</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50/70 text-slate-700">
                        {profileData.educationList.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-slate-400 font-bold text-[11px]">
                              No education entries defined. Click "Add Education" to register academic history.
                            </td>
                          </tr>
                        ) : (
                          profileData.educationList.map((edu, idx) => (
                            <tr key={edu.id || idx} className="hover:bg-slate-50/20">
                              <td className="py-3.5 font-bold text-slate-800">{edu.institution}</td>
                              <td className="py-3.5 text-slate-600 font-bold">{edu.qualification}</td>
                              <td className="py-3.5 text-slate-500 font-medium">{edu.fieldOfStudy}</td>
                              <td className="py-3.5 font-mono text-slate-500">{edu.year}</td>
                              <td className="py-3.5">
                                <span className="bg-[#ecfdf5] text-emerald-600 px-2.5 py-0.5 rounded font-black text-[9.5px] uppercase tracking-wider border border-[#ecfdf5]">
                                  {edu.grade || 'Pass'}
                                </span>
                              </td>
                              <td className="py-3.5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button 
                                    onClick={() => handleEditEducation(edu)}
                                    className="px-3 py-1.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg text-slate-700 font-bold tracking-wide text-[10.5px] cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteEducation(edu.id, edu.institution)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-lg cursor-pointer transition-colors hover:bg-rose-50/40"
                                    title="Delete Education"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB 8: Documents Tab */}
            {activeTab === 'Documents' && (
              <div id="subtab-documents-content" className="space-y-6">
                <div className="bg-white border border-slate-100 rounded-3xl p-6.5 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Employee documents</h3>
                    <button 
                      onClick={() => {
                        // Reset forms first before showing
                        setDocType('Contract');
                        setDocCustomName('');
                        setDocExpiryDate('');
                        setHasExpiry(false);
                        setSelectedFile(null);
                        setShowUploadModal(true);
                      }}
                      className="bg-[#2f66e0] text-white font-bold text-[10px] px-3.5 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer hover:bg-opacity-95"
                    >
                      <Upload className="h-3.5 w-3.5 animate-bounce"  />
                      <span>Upload</span>
                    </button>
                  </div>

                  {profileData.documentsList.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                      <div className="h-12 w-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-black text-slate-700">No documents found</p>
                        <p className="text-[10px] text-slate-400">Add official employee files, IDs, or forms for security audit tracking.</p>
                      </div>
                      <button
                        onClick={() => setShowUploadModal(true)}
                        className="text-[10px] font-black text-[#2f66e0] hover:underline cursor-pointer"
                      >
                        Upload your first file &rarr;
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto text-xs font-semibold">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-slate-400 font-extrabold pb-3 border-b border-slate-100 text-[10.5px] uppercase tracking-wider">
                            <th className="pb-3 text-left">Document name</th>
                            <th className="pb-3 text-left">Type</th>
                            <th className="pb-3 text-left">Uploaded</th>
                            <th className="pb-3 text-left font-mono">Expiry</th>
                            <th className="pb-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50/70 font-bold text-slate-700">
                          {profileData.documentsList.map((doc, idx) => (
                            <tr key={doc.id || idx} className="hover:bg-slate-50">
                              <td className="py-3.5 text-slate-800 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                                <span 
                                  onClick={() => {
                                    setPreviewingDoc(doc);
                                    setShowDocPreviewModal(true);
                                  }}
                                  className="hover:underline cursor-pointer"
                                >
                                  {doc.name}
                                </span>
                              </td>
                              <td className="py-3.5 text-slate-600">
                                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold text-[9.5px]">
                                  {doc.type}
                                </span>
                              </td>
                              <td className="py-3.5 font-mono text-slate-500">{doc.uploaded}</td>
                              <td className="py-3.5 font-mono text-slate-500">{doc.expiry}</td>
                              <td className="py-3.5 text-right">
                                <div className="flex items-center justify-end gap-2 text-right">
                                  <button 
                                    onClick={() => {
                                      setPreviewingDoc(doc);
                                      setShowDocPreviewModal(true);
                                    }}
                                    className="px-3.5 py-1.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-lg text-slate-700 font-bold tracking-wide text-[10.5px] cursor-pointer"
                                  >
                                    View
                                  </button>
                                  <button 
                                    onClick={() => {
                                      const updated = profileData.documentsList.filter(item => item.id !== doc.id);
                                      setProfileData(prev => ({
                                        ...prev,
                                        documentsList: updated
                                      }));
                                      setEmployeeDocsMap(prev => ({
                                        ...prev,
                                        [employee.id]: updated
                                      }));
                                      addToast(`Document "${doc.name}" deleted successfully.`, 'info');
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-lg cursor-pointer transition-colors hover:bg-rose-50/40"
                                    title="Delete Document"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* PORTAL OVERLAY TRIGGER: Delete Employee Confirmation Dialog */}
      {showDeleteModal && (
        <div id="profile-delete-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-100 rounded-3xl p-6.5 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Archive Employee Record?</h4>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Are you sure you want to completely archive and revoke security clearance for <b>{employee.name}</b> ({employee.id})? This action is legally documented across active corporate ledgers.
            </p>

            <div className="mt-5 flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-3.5 py-2 text-[10.5px] font-black rounded-xl text-slate-500 hover:text-slate-800 bg-slate-50 uppercase tracking-widest cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={triggerDelete}
                className="px-4.5 py-2 text-[10.5px] font-black rounded-xl bg-rose-600 hover:bg-rose-500 text-white uppercase tracking-widest cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0"
              >
                <Trash2 className="h-3 w-3" />
                <span>Archive File</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PORTAL OVERLAY TRIGGER: Reset Password Dialog */}
      {showResetModal && (
        <div id="profile-reset-pwd-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-100 rounded-3xl p-6.5 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Regenerate Security Access</h4>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              We generated a secure single-use temporary credentials profile for <b>{employee.name}</b>.
            </p>

            {/* Password Box */}
            <div className="mt-4 bg-slate-900 p-3.5 rounded-xl flex items-center justify-between text-white font-mono text-[13px] font-bold select-all tracking-wide border border-slate-800">
              <span className="text-teal-400">{generatedPassword}</span>
              <span className="text-[9.5px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-black uppercase tracking-wider">Temp Key</span>
            </div>

            <p className="text-[10px] text-slate-400 mt-2 italic">
              Archiving keys and pushing notification emails lock and record security telemetry metrics.
            </p>

            <div className="mt-5 flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button 
                onClick={() => setShowResetModal(false)}
                className="px-3.5 py-2 text-[10.5px] font-black rounded-xl text-slate-500 hover:text-slate-800 bg-slate-50 uppercase tracking-widest cursor-pointer"
              >
                Discard
              </button>
              <button 
                onClick={commitResetPassword}
                className="px-4.5 py-2 text-[10.5px] font-black rounded-xl bg-slate-900 hover:bg-slate-800 text-white uppercase tracking-widest cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0"
              >
                <Key className="h-3.5 w-3.5 text-teal-400" />
                <span>Issue & Notify</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PORTAL OVERLAY TRIGGER: Document Upload Dialog */}
      {showUploadModal && (
        <div id="profile-upload-doc-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-100 rounded-3xl p-6.5 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Upload className="h-4 w-4 text-blue-500 shrink-0" />
                  <span>Upload Document</span>
                </h4>
                <p className="text-[10px] text-slate-450">
                  Store secure files in the system dossier for <span className="font-extrabold text-slate-700">{employee.name}</span>.
                </p>
              </div>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="h-7 w-7 text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-4">
              {/* Drag/Drop Zone */}
              <div className="space-y-1.5">
                <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">File Attachment *</label>
                
                <input 
                  id="file-uploader-hidden"
                  type="file" 
                  onChange={handleFileSelect} 
                  className="hidden" 
                />

                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-uploader-hidden')?.click()}
                  className={`border-2 border-dashed rounded-2xl p-4.5 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2 select-none ${
                    selectedFile 
                      ? 'border-emerald-200 bg-emerald-50/20' 
                      : isDragging 
                        ? 'border-[#2f66e0] bg-blue-50/30 ring-4 ring-blue-50' 
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {selectedFile ? (
                    <>
                      <div className="h-9 w-9 bg-emerald-100 text-emerald-650 rounded-xl flex items-center justify-center">
                        <FileText className="h-4.5 w-4.5 shrink-0" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-bold text-slate-800 line-clamp-1 truncate max-w-[240px]">
                          {selectedFile.name}
                        </p>
                        <p className="text-[9px] text-slate-450 font-mono">
                          {(selectedFile.size / 1024 / 1024).toFixed(3)} MB • Ready
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                        }}
                        className="text-[9px] font-black text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg transition-colors border border-rose-100"
                      >
                        Remove file
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="h-9 w-9 bg-slate-150 text-slate-500 rounded-xl flex items-center justify-center">
                        <Upload className="h-4 w-4 text-slate-450 shrink-0" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-extrabold text-slate-700 leading-tight">
                          {isDragging ? 'Drop your file now' : 'Drag & drop your file here'}
                        </p>
                        <p className="text-[9.5px] text-slate-450">
                          or <span className="text-[#2f66e0] underline font-bold">browse your computer</span>
                        </p>
                      </div>
                      <p className="text-[8.5px] text-slate-400 font-medium">
                        Accepts documents up to 10MB (PDF, PNG, JPG)
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Document Name */}
              <div className="space-y-1">
                <label htmlFor="doc-custom-name" className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Document Name *</label>
                <input 
                  id="doc-custom-name"
                  type="text"
                  required
                  placeholder="e.g. Appointment Letter"
                  value={docCustomName}
                  onChange={(e) => setDocCustomName(e.target.value)}
                  className="w-full bg-slate-50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold transition-all text-slate-800 placeholder-slate-400"
                />
              </div>

              {/* Document Type */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="doc-type-select" className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Doc Type *</label>
                  <select 
                    id="doc-type-select"
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold transition-all text-slate-800"
                  >
                    <option value="Contract">Contract / Offer</option>
                    <option value="ID">Identity Card / Passport</option>
                    <option value="Certificate">Certificate / Degree</option>
                    <option value="Tax">Government Tax</option>
                    <option value="Payslip">Payslip</option>
                    <option value="Medical">Medical Form</option>
                    <option value="Other">Other Document</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end pb-1 pl-1">
                  <label className="flex items-center gap-2 cursor-pointer py-2 select-none">
                    <input 
                      type="checkbox"
                      checked={hasExpiry}
                      onChange={(e) => setHasExpiry(e.target.checked)}
                      className="rounded border-slate-300 text-[#2f66e0] focus:ring-blue-500 h-3.5 w-3.5 cursor-pointer"
                    />
                    <span className="text-[10px] font-extrabold text-slate-600">Has expiry date</span>
                  </label>
                </div>
              </div>

              {/* Expiry Date */}
              {hasExpiry && (
                <div className="space-y-1 animate-in slide-in-from-top-1 text-slate-700">
                  <label htmlFor="doc-expiry-date" className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Expiry date</label>
                  <input 
                    id="doc-expiry-date"
                    type="date"
                    required={hasExpiry}
                    value={docExpiryDate}
                    onChange={(e) => setDocExpiryDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold transition-all text-slate-800"
                  />
                </div>
              )}

              {/* Modal Buttons */}
              <div className="mt-5 flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3.5 py-2 text-[10.5px] font-black rounded-xl text-slate-500 hover:text-slate-800 bg-slate-50 uppercase tracking-widest cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!selectedFile}
                  className={`px-4.5 py-2 text-[10.5px] font-black rounded-xl uppercase tracking-widest flex items-center gap-1.5 shadow-sm transition-all ${
                    selectedFile 
                      ? 'bg-[#2f66e0] hover:bg-[#2051bf] text-white cursor-pointer hover:shadow-md' 
                      : 'bg-slate-50 text-slate-400 cursor-not-allowed border border-slate-200/50'
                  } whitespace-nowrap`}
                >
                  <Plus className="h-3.5 w-3.5 shrink-0" />
                  <span>Upload</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PORTAL OVERLAY TRIGGER: Add & Edit Family Member Modal */}
      {showFamilyModal && (
        <div id="profile-family-modal-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="h-4 w-4 text-blue-500 shrink-0" />
                  <span>{editingFamilyMember ? 'Edit Family Relation' : 'Add Family Relation'}</span>
                </h4>
                <p className="text-[10px] text-slate-450 border-0">
                  Update dependent credentials or tax relief eligibility info
                </p>
              </div>
              <button 
                onClick={() => setShowFamilyModal(false)}
                className="h-7 w-7 text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFamilyMember} className="mt-4 space-y-4 text-xs font-semibold text-slate-700">
              <div className="space-y-1">
                <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Full Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Sarah Connor"
                  value={familyForm.name}
                  onChange={(e) => setFamilyForm({...familyForm, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold transition-all text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Relationship *</label>
                  <select 
                    value={familyForm.relationship}
                    onChange={(e) => setFamilyForm({...familyForm, relationship: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold transition-all text-slate-800"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Date of Birth *</label>
                  <input 
                    type="date" 
                    required
                    value={familyForm.dob}
                    onChange={(e) => setFamilyForm({...familyForm, dob: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold transition-all text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">NRIC / ID No. *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. 950812-14-1234"
                    value={familyForm.nric}
                    onChange={(e) => setFamilyForm({...familyForm, nric: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold transition-all text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Passport No.</label>
                  <input 
                    type="text" 
                    placeholder="e.g. A2345678"
                    value={familyForm.passport}
                    onChange={(e) => setFamilyForm({...familyForm, passport: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold transition-all text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2.5 py-1.5 pl-0.5">
                <input 
                  type="checkbox"
                  id="family-tax-exempt-box"
                  checked={familyForm.taxExempt}
                  onChange={(e) => setFamilyForm({...familyForm, taxExempt: e.target.checked})}
                  className="rounded border-slate-300 text-[#2f66e0] focus:ring-blue-500 h-3.5 w-3.5 cursor-pointer"
                />
                <label htmlFor="family-tax-exempt-box" className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider cursor-pointer">
                  Eligible for Dependent Tax Relief
                </label>
              </div>

              <div className="mt-5 flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setShowFamilyModal(false)}
                  className="px-4 py-2 text-[10.5px] font-black rounded-xl text-slate-500 hover:text-slate-800 bg-slate-50 uppercase tracking-widest cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 text-[10.5px] font-black rounded-xl bg-[#2f66e0] hover:bg-[#2051bf] text-white uppercase tracking-widest cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>{editingFamilyMember ? 'Save Changes' : 'Add Member'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PORTAL OVERLAY TRIGGER: Add & Edit Next of Kin Modal */}
      {showNokModal && (
        <div id="profile-nok-modal-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="h-4 w-4 text-blue-500 shrink-0" />
                  <span>{editingNok ? 'Edit Next of Kin' : 'Add Next of Kin'}</span>
                </h4>
                <p className="text-[10px] text-slate-450 border-0">
                  Update primary emergency dispatch contact details
                </p>
              </div>
              <button 
                onClick={() => setShowNokModal(false)}
                className="h-7 w-7 text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNok} className="mt-4 space-y-4 text-xs font-semibold text-slate-700">
              <div className="space-y-1">
                <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Full Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. John Connor"
                  value={nokForm.name}
                  onChange={(e) => setNokForm({...nokForm, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold transition-all text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Relationship *</label>
                  <select 
                    value={nokForm.relationship}
                    onChange={(e) => setNokForm({...nokForm, relationship: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold transition-all text-slate-800"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Child">Child</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Contact No. *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. +6012345678"
                    value={nokForm.contactNo}
                    onChange={(e) => setNokForm({...nokForm, contactNo: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold transition-all text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Home Address</label>
                <textarea 
                  rows={2}
                  placeholder="e.g. No. 42, Taman Serene, 56000 Kuala Lumpur"
                  value={nokForm.address}
                  onChange={(e) => setNokForm({...nokForm, address: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold transition-all text-slate-800 leading-relaxed resize-none"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setShowNokModal(false)}
                  className="px-4 py-2 text-[10.5px] font-black rounded-xl text-slate-500 hover:text-slate-800 bg-slate-50 uppercase tracking-widest cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 text-[10.5px] font-black rounded-xl bg-[#2f66e0] hover:bg-[#2051bf] text-white uppercase tracking-widest cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>{editingNok ? 'Save Changes' : 'Add Kin'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PORTAL OVERLAY TRIGGER: Add & Edit Biometric Device Modal */}
      {showBiometricModal && (
        <div id="profile-biometric-modal-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="h-4 w-4 text-blue-550 shrink-0 text-blue-500" />
                  <span>{editingBiometricDevice ? 'Edit Device' : 'Register Device'}</span>
                </h4>
                <p className="text-[10px] text-slate-450 border-0">
                  Configure biometric access and allocation attributes
                </p>
              </div>
              <button 
                onClick={() => setShowBiometricModal(false)}
                className="h-7 w-7 text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-slate-155 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBiometricDevice} className="mt-4 space-y-4 text-xs font-semibold text-slate-700">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-750 text-slate-700 uppercase tracking-wider block">TA Number *</label>
                  <input 
                    type="text" 
                    required
                    disabled={!!editingBiometricDevice}
                    placeholder="e.g. TA-004123"
                    value={biometricForm.taNumber}
                    onChange={(e) => setBiometricForm({...biometricForm, taNumber: e.target.value})}
                    className={`w-full border rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                      editingBiometricDevice 
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed font-bold' 
                        : 'bg-slate-50 border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 text-slate-800'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Device Type *</label>
                  <select 
                    value={biometricForm.deviceType}
                    onChange={(e) => setBiometricForm({...biometricForm, deviceType: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold transition-all text-slate-800"
                  >
                    <option value="Face ID">Face ID</option>
                    <option value="Fingerprint">Fingerprint</option>
                    <option value="RFID Card">RFID Card</option>
                    <option value="Iris Scanner">Iris Scanner</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Terminal Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Lobby Terminal 4"
                  value={biometricForm.terminalName}
                  onChange={(e) => setBiometricForm({...biometricForm, terminalName: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold transition-all text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Location</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Lab Floor"
                    value={biometricForm.location}
                    onChange={(e) => setBiometricForm({...biometricForm, location: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold transition-all text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-750 text-slate-700 uppercase tracking-wider block">Status *</label>
                  <select 
                    value={biometricForm.status}
                    onChange={(e) => setBiometricForm({...biometricForm, status: e.target.value as any})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold transition-all text-slate-800"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setShowBiometricModal(false)}
                  className="px-4 py-2 text-[10.5px] font-black rounded-xl text-slate-500 hover:text-slate-800 bg-slate-50 uppercase tracking-widest cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 text-[10.5px] font-black rounded-xl bg-[#2f66e0] hover:bg-[#2051bf] text-white uppercase tracking-widest cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>{editingBiometricDevice ? 'Save Changes' : 'Register Device'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PORTAL OVERLAY TRIGGER: Add & Edit Allowance Modal */}
      {showAllowanceModal && (
        <div id="profile-allowance-modal-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-6.5 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                  <span>{editingAllowance ? 'Edit Allowance' : 'Add Allowance'}</span>
                </h4>
                <p className="text-[10px] text-slate-400">
                  Configure recurring or one-off positive wage component
                </p>
              </div>
              <button 
                onClick={() => setShowAllowanceModal(false)}
                className="h-7 w-7 text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAllowance} className="mt-4 space-y-4 text-xs font-semibold text-slate-700">
              <div className="space-y-1">
                <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Allowance Type *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Housing Allowance, Travelling Allowance"
                  value={allowanceForm.type}
                  onChange={(e) => setAllowanceForm({...allowanceForm, type: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold font-sans transition-all text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Amount (MYR) *</label>
                  <input 
                    type="number" 
                    required
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    value={allowanceForm.amount || ''}
                    onChange={(e) => setAllowanceForm({...allowanceForm, amount: parseFloat(e.target.value) || 0})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold font-mono transition-all text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Frequency *</label>
                  <select 
                    value={allowanceForm.frequency}
                    onChange={(e) => setAllowanceForm({...allowanceForm, frequency: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold font-sans transition-all text-slate-800"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Weekly">Weekly</option>
                    <option value="One-off">One-off</option>
                    <option value="Annually">Annually</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Taxable Status</label>
                  <div className="flex items-center gap-2.5 mt-2.5">
                    <input 
                      type="checkbox" 
                      id="allowance-taxable-checkbox"
                      checked={allowanceForm.taxable}
                      onChange={(e) => setAllowanceForm({...allowanceForm, taxable: e.target.checked})}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <label htmlFor="allowance-taxable-checkbox" className="text-xs text-slate-600 font-bold cursor-pointer select-none">Is Taxable</label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Status *</label>
                  <select 
                    value={allowanceForm.status}
                    onChange={(e) => setAllowanceForm({...allowanceForm, status: e.target.value as any})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold font-sans transition-all text-slate-800"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setShowAllowanceModal(false)}
                  className="px-4 py-2 text-[10.5px] font-black rounded-xl text-slate-500 hover:text-slate-800 bg-slate-50 uppercase tracking-widest cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 text-[10.5px] font-black rounded-xl bg-[#2f66e0] hover:bg-[#2051bf] text-white uppercase tracking-widest cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>{editingAllowance ? 'Save Changes' : 'Confirm Add'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PORTAL OVERLAY TRIGGER: Add & Edit Deduction Modal */}
      {showDeductionModal && (
        <div id="profile-deduction-modal-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-6.5 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                  <span>{editingDeduction ? 'Edit Deduction' : 'Add Deduction'}</span>
                </h4>
                <p className="text-[10px] text-slate-400">
                  Configure regular, statutory or voluntary wage reduction
                </p>
              </div>
              <button 
                onClick={() => setShowDeductionModal(false)}
                className="h-7 w-7 text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDeduction} className="mt-4 space-y-4 text-xs font-semibold text-slate-700">
              <div className="space-y-1">
                <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Deduction Type *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. EPF, SOCSO, EIS, Tax Deduction"
                  value={deductionForm.type}
                  onChange={(e) => setDeductionForm({...deductionForm, type: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold font-sans transition-all text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Amount (MYR) *</label>
                  <input 
                    type="number" 
                    required
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    value={deductionForm.amount || ''}
                    onChange={(e) => setDeductionForm({...deductionForm, amount: parseFloat(e.target.value) || 0})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold font-mono transition-all text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Frequency *</label>
                  <select 
                    value={deductionForm.frequency}
                    onChange={(e) => setDeductionForm({...deductionForm, frequency: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold font-sans transition-all text-slate-800"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Weekly">Weekly</option>
                    <option value="One-off">One-off</option>
                    <option value="Annually">Annually</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Reference / Type</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Statutory, Loan"
                    value={deductionForm.reference}
                    onChange={(e) => setDeductionForm({...deductionForm, reference: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold font-sans transition-all text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Status *</label>
                  <select 
                    value={deductionForm.status}
                    onChange={(e) => setDeductionForm({...deductionForm, status: e.target.value as any})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold font-sans transition-all text-slate-800"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setShowDeductionModal(false)}
                  className="px-4 py-2 text-[10.5px] font-black rounded-xl text-slate-500 hover:text-slate-800 bg-slate-50 uppercase tracking-widest cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 text-[10.5px] font-black rounded-xl bg-[#2f66e0] hover:bg-[#2051bf] text-white uppercase tracking-widest cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>{editingDeduction ? 'Save Changes' : 'Confirm Add'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PORTAL OVERLAY TRIGGER: Add & Edit Career Modal */}
      {showCareerModal && (
        <div id="profile-career-modal-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-6.5 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-[#2f66e0] shrink-0" />
                  <span>{editingCareer ? 'Edit Career Entry' : 'Add Career Entry'}</span>
                </h4>
                <p className="text-[10px] text-slate-400">
                  Record past employee experience and roles
                </p>
              </div>
              <button 
                onClick={() => setShowCareerModal(false)}
                className="h-7 w-7 text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCareer} className="mt-4 space-y-4 text-xs font-semibold text-slate-700">
              <div className="space-y-1">
                <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Company *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. ACME Systems, Google LLC"
                  value={careerForm.company}
                  onChange={(e) => setCareerForm({...careerForm, company: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold font-sans transition-all text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Position *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Senior software engineer"
                  value={careerForm.position}
                  onChange={(e) => setCareerForm({...careerForm, position: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold font-sans transition-all text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">From</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Jan 2011"
                    value={careerForm.from}
                    onChange={(e) => setCareerForm({...careerForm, from: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold font-sans transition-all text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">To</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Jun 2013 / Present"
                    value={careerForm.to}
                    onChange={(e) => setCareerForm({...careerForm, to: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold font-sans transition-all text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Reason for leaving</label>
                <input 
                  type="text" 
                  placeholder="e.g. Better growth opportunities, relocation"
                  value={careerForm.reason}
                  onChange={(e) => setCareerForm({...careerForm, reason: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold font-sans transition-all text-slate-800"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setShowCareerModal(false)}
                  className="px-4 py-2 text-[10.5px] font-black rounded-xl text-slate-500 hover:text-slate-800 bg-slate-50 uppercase tracking-widest cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 text-[10.5px] font-black rounded-xl bg-[#2f66e0] hover:bg-[#2051bf] text-white uppercase tracking-widest cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>{editingCareer ? 'Save Changes' : 'Confirm Add'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PORTAL OVERLAY TRIGGER: Add & Edit Education Modal */}
      {showEducationModal && (
        <div id="profile-education-modal-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-6.5 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4 text-[#2f66e0] shrink-0" />
                  <span>{editingEducation ? 'Edit Education' : 'Add Education'}</span>
                </h4>
                <p className="text-[10px] text-slate-400">
                  Record employee academic history
                </p>
              </div>
              <button 
                onClick={() => setShowEducationModal(false)}
                className="h-7 w-7 text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEducation} className="mt-4 space-y-4 text-xs font-semibold text-slate-700">
              <div className="space-y-1">
                <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Institution *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. University of Malaya, MIT"
                  value={educationForm.institution}
                  onChange={(e) => setEducationForm({...educationForm, institution: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold font-sans transition-all text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Qualification *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Bachelor's Degree, Diploma, Master's"
                  value={educationForm.qualification}
                  onChange={(e) => setEducationForm({...educationForm, qualification: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold font-sans transition-all text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Field Of Study</label>
                <input 
                  type="text" 
                  placeholder="e.g. Computer Science, Accounting"
                  value={educationForm.fieldOfStudy}
                  onChange={(e) => setEducationForm({...educationForm, fieldOfStudy: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold font-sans transition-all text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Year</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 2015"
                    value={educationForm.year}
                    onChange={(e) => setEducationForm({...educationForm, year: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold font-sans transition-all text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Grade</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Pass, First Class"
                    value={educationForm.grade}
                    onChange={(e) => setEducationForm({...educationForm, grade: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#2f66e0] focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold font-sans transition-all text-slate-800"
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setShowEducationModal(false)}
                  className="px-4 py-2 text-[10.5px] font-black rounded-xl text-slate-500 hover:text-slate-800 bg-slate-50 uppercase tracking-widest cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 text-[10.5px] font-black rounded-xl bg-[#2f66e0] hover:bg-[#2051bf] text-white uppercase tracking-widest cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>{editingEducation ? 'Save Changes' : 'Confirm Add'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PORTAL OVERLAY TRIGGER: Document Preview Modal */}
      {showDocPreviewModal && previewingDoc && (
        <div id="profile-doc-preview-modal-overlay" className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 md:p-6 animate-in fade-in duration-150">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl max-w-2xl w-full shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh]">
            
            {/* Modal Header Controls */}
            <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest truncate">
                    {previewingDoc.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] bg-slate-100 text-slate-600 rounded px-1.5 py-0.5 font-extrabold uppercase">
                      {previewingDoc.type} Category
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Uploaded on {previewingDoc.uploaded}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={() => addToast(`Initializing printer spool... Document "${previewingDoc.name}" ready to queue.`, 'success')}
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-100 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                  title="Print Document"
                >
                  <Printer className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => addToast(`Downloading certified attachment copy: ${previewingDoc.name}`, 'success')}
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-100 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                  title="Download Copy"
                >
                  <Download className="h-4 w-4" />
                </button>
                <div className="h-6 w-px bg-slate-200 mx-1"></div>
                <button 
                  onClick={() => {
                    setShowDocPreviewModal(false);
                    setPreviewingDoc(null);
                  }}
                  className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-200 border border-slate-100 rounded-lg flex items-center justify-center cursor-pointer transition-all"
                  title="Close preview"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: The realistic page viewer */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 flex justify-center bg-slate-100/70">
              
              {/* Paper Sheet */}
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-lg w-full max-w-xl p-8 md:p-10 relative text-slate-800 select-text font-sans leading-relaxed text-xs">
                
                {/* Security background watermarks and stampings */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.02] flex items-center justify-center select-none overflow-hidden">
                  <div className="text-[5rem] font-black tracking-widest text-[#2f66e0] rotate-12 uppercase select-none">
                    NOVORA HR SECURE
                  </div>
                </div>

                {/* Top Corner Badge */}
                <div className="absolute top-4 right-4 text-[9px] font-black text-slate-400 uppercase tracking-widest border border-slate-200 rounded px-2 py-0.5 select-none bg-slate-50 font-mono">
                  REF: {previewingDoc.id}-NVR-{new Date().getFullYear()}
                </div>

                {/* TEMPLATE Rendering based on previewingDoc.type */}
                {previewingDoc.type === 'Contract' ? (
                  <div className="space-y-6">
                    {/* Contract Header */}
                    <div className="text-center pb-6 border-b border-slate-100">
                      <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Novora Business Systems Sdn Bhd</h2>
                      <p className="text-[9.5px] text-slate-400 uppercase tracking-wider mt-1">Level 28, Menara Binjai, No. 2 Jalan Binjai, 50450 Kuala Lumpur, Malaysia</p>
                    </div>

                    {/* Letter Body */}
                    <div className="space-y-4">
                      <div className="flex justify-between text-[11px] font-bold text-slate-500">
                        <span>Date: {previewingDoc.uploaded}</span>
                        <span>Private & Confidential</span>
                      </div>

                      <div className="space-y-1">
                        <p className="font-extrabold text-slate-800 uppercase text-[11px]">To: {employee?.name}</p>
                        <p className="text-slate-500">Employee ID: {employee?.id}</p>
                        <p className="text-slate-500">Residential: {profileData.perAddress || 'As per employee record'}</p>
                      </div>

                      <div className="pt-2">
                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider underline">SUBJECT: LETTER OF EMPLOYMENT AND TERMS OF CONTRACT</h3>
                      </div>

                      <p className="text-slate-600 leading-relaxed">
                        We are pleased to offer you formal employment with <b>Novora Business Systems Sdn Bhd</b>. 
                        Your appointment has been validated under the following core parameters as approved by our 
                        Human Capital Management team:
                      </p>

                      {/* Contract Core Grid Data */}
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 grid grid-cols-2 gap-y-3.5 gap-x-4 text-[11.5px]">
                        <div>
                          <span className="block text-[9.5px] font-black text-slate-400 uppercase tracking-wider">Position</span>
                          <span className="font-bold text-slate-800">{employee?.position}</span>
                        </div>
                        <div>
                          <span className="block text-[9.5px] font-black text-slate-400 uppercase tracking-wider">Department</span>
                          <span className="font-bold text-slate-800">{employee?.department}</span>
                        </div>
                        <div>
                          <span className="block text-[9.5px] font-black text-slate-400 uppercase tracking-wider">Grade Allocation</span>
                          <span className="font-bold text-slate-800">{profileData.jobGrade}</span>
                        </div>
                        <div>
                          <span className="block text-[9.5px] font-black text-slate-400 uppercase tracking-wider">Commencement Date</span>
                          <span className="font-bold text-slate-800">{profileData.positionStartDate}</span>
                        </div>
                        <div>
                          <span className="block text-[9.5px] font-black text-slate-400 uppercase tracking-wider">Basic Monthly Salary</span>
                          <span className="font-bold text-blue-600 font-mono">MYR {profileData.basicSalary.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                        </div>
                        <div>
                          <span className="block text-[9.5px] font-black text-slate-400 uppercase tracking-wider">Employment Status</span>
                          <span className="font-bold text-slate-800">{employee?.employmentStatus}</span>
                        </div>
                      </div>

                      <p className="text-slate-600 leading-relaxed">
                        This position includes standard corporate coverage including health insurance, <b>{profileData.leaveLeft} days</b> of annual leave entitlement, 
                        and standard statutory contributions to EPF, SOCSO, and EIS. Your designated payroll will be wired to <b>{profileData.bankAccount}</b> monthly.
                      </p>

                      <div className="pt-4 space-y-2">
                        <p className="text-slate-600">We look forward to your dedication and outstanding contributions to the team.</p>
                        <p className="text-slate-500">Yours faithfully,<br/><span className="font-black text-slate-800">NOVORA HUMAN RESOURCES DEPT.</span></p>
                      </div>

                      <div className="pt-8 grid grid-cols-2 gap-4 border-t border-slate-100 text-center text-slate-400 text-[10px]">
                        <div className="space-y-4">
                          <div className="h-8 border-b border-dashed border-slate-200"></div>
                          <p className="font-black text-slate-700 uppercase">Authorized Signature</p>
                          <p>For Novora Business Systems</p>
                        </div>
                        <div className="space-y-4">
                          <div className="h-8 border-b border-dashed border-slate-200 flex items-center justify-center">
                            <span className="text-[10px] text-blue-500 font-extrabold italic font-mono uppercase tracking-widest">{employee?.name?.split(' ')[0]} / SIGNED DIGITAL</span>
                          </div>
                          <p className="font-black text-slate-700 uppercase">Employee Acceptance</p>
                          <p>Sign & Date</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : previewingDoc.type === 'ID' ? (
                  <div className="space-y-8">
                    {/* ID Badge Header */}
                    <div className="text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full border border-red-150 mb-2">
                        <Shield className="h-3.5 w-3.5 text-red-500" />
                        <span className="text-[8.5px] font-black tracking-widest uppercase">Verified Official Identity Card</span>
                      </div>
                      <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">GOVERNMENT OF MALAYSIA</h2>
                      <p className="text-[9.5px] text-slate-400 uppercase tracking-wider">KEMENTERIAN DALAM NEGERI — NATIONAL REGISTRATION PREVIEW</p>
                    </div>

                    {/* Simulated Malaysian Identity Card (MyKad clone) */}
                    <div className="bg-linear-to-tr from-sky-50 to-indigo-50 border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-6">
                      
                      {/* Holographic secure element stamp */}
                      <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-yellow-400/10 border border-yellow-500/10 rotate-45 select-none pointer-events-none"></div>

                      {/* Photo Section */}
                      <div className="flex flex-col items-center shrink-0 space-y-2">
                        <div className="h-28 w-24 bg-slate-200 border border-slate-300 rounded-md overflow-hidden flex flex-col items-center justify-center text-slate-400 relative shadow-inner">
                          <div className="absolute inset-0 bg-linear-to-b from-[#2F66E0]/5 to-[#2F66E0]/15"></div>
                          {/* Circular Badge as Face */}
                          <div className="h-14 w-14 bg-slate-400 rounded-full flex items-center justify-center text-slate-150 text-lg font-black border-2 border-white/80 mt-3 shadow z-10">
                            {employee ? employee.name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase() : 'EE'}
                          </div>
                          <span className="text-[8px] font-black tracking-widest uppercase text-slate-600 z-10 mt-2 font-mono">ID MATCHED</span>
                          <div className="absolute bottom-2 right-2 text-yellow-500 text-[10px] opacity-75">❇</div>
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 font-mono">UID: #{employee?.id}</span>
                      </div>

                      {/* Details Segment */}
                      <div className="flex-1 space-y-3 text-[11px] font-bold text-slate-700">
                        <div>
                          <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider font-sans">Full Legal Name</span>
                          <span className="block text-slate-800 font-black text-sm uppercase font-mono tracking-tight">{employee?.name}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider font-sans">Nationality</span>
                            <span className="block text-slate-800 font-extrabold uppercase font-mono">{profileData.nationality}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider font-sans">Gender</span>
                            <span className="block text-slate-800 font-extrabold uppercase font-mono">{profileData.gender}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider font-sans">Date of Birth</span>
                            <span className="block text-slate-800 font-extrabold font-mono">{profileData.dob}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider font-sans">Religion</span>
                            <span className="block text-slate-800 font-extrabold uppercase font-mono">{profileData.religion}</span>
                          </div>
                        </div>

                        <div>
                          <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider font-sans">Residential Address</span>
                          <span className="block text-slate-600 font-extrabold text-[10px] leading-relaxed uppercase font-mono">{profileData.perAddress || '12 JALAN AMPANG, KUALA LUMPUR'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2 text-[10px] text-slate-505 text-slate-500">
                      <p className="font-extrabold text-slate-700 uppercase tracking-wider">Corporate Security Clearance Details:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Verified of authentic Malaysian NRIC registry or valid immigration passport credentials.</li>
                        <li>This profile has been cataloged under fingerprint clearance code: <span className="font-mono text-slate-700 font-extrabold">TA-{employee?.id}-SEC</span>.</li>
                        <li>Security verification is maintained for the active calendar year. Last audit check executed on {previewingDoc.uploaded}.</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  // Default elegant document canvas for certificates, Tax Form EA or CV
                  <div className="space-y-6">
                    <div className="border-b border-slate-100 pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">{previewingDoc.name}</h2>
                          <p className="text-[9.5px] text-slate-400 uppercase tracking-wider mt-0.5">Corporate Employee Documents Repository</p>
                        </div>
                        <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100 font-extrabold text-[9px] uppercase tracking-wider select-none">
                          HR Checked
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-[11px]">
                        <div>
                          <span className="block text-[9.5px] font-black text-slate-400 uppercase tracking-wider">Employee Name</span>
                          <span className="font-bold text-slate-800">{employee?.name}</span>
                        </div>
                        <div>
                          <span className="block text-[9.5px] font-black text-slate-400 uppercase tracking-wider">Employee ID</span>
                          <span className="font-bold text-slate-800">{employee?.id}</span>
                        </div>
                        <div>
                          <span className="block text-[9.5px] font-black text-slate-400 uppercase tracking-wider">Document category</span>
                          <span className="font-bold text-slate-800 uppercase">{previewingDoc.type}</span>
                        </div>
                        <div>
                          <span className="block text-[9.5px] font-black text-slate-400 uppercase tracking-wider">Security Clear status</span>
                          <span className="font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block"></span>
                            <span>Active & Validated</span>
                          </span>
                        </div>
                      </div>

                      {previewingDoc.name.toLowerCase().includes('resume') || previewingDoc.name.toLowerCase().includes('cv') || previewingDoc.type.toLowerCase().includes('other') ? (
                        <div className="space-y-4 pt-2">
                          <p className="font-bold text-slate-700 text-xs uppercase tracking-wider border-b border-slate-100 pb-1">Professional Career Resume Summary:</p>
                          
                          <div className="space-y-3.5">
                            <div className="space-y-2">
                              <span className="text-[10px] font-extrabold text-[#2f66e0] uppercase block">Professional History:</span>
                              {profileData.careerHistory.length === 0 ? (
                                <p className="text-[10px] italic text-slate-400 pl-3">No professional experiences listed</p>
                              ) : (
                                profileData.careerHistory.map((hist, idx) => (
                                  <div key={idx} className="pl-3 border-l-2 border-slate-100 text-[10.5px]">
                                    <p className="font-bold text-slate-800 text-[11px]">{hist.position} &mdash; <span className="text-slate-500 font-medium">{hist.company}</span></p>
                                    <p className="text-slate-[405] font-mono text-[9px] text-slate-400">{hist.from} to {hist.to}</p>
                                  </div>
                                ))
                              )}
                            </div>

                            <div className="space-y-2">
                              <span className="text-[10px] font-extrabold text-[#2f66e0] uppercase block">Academic Credentials:</span>
                              {profileData.educationList.length === 0 ? (
                                <p className="text-[10px] italic text-slate-400 pl-3">No academic history defined</p>
                              ) : (
                                profileData.educationList.map((edu, idx) => (
                                  <div key={idx} className="pl-3 border-l-2 border-slate-100 text-[10.5px]">
                                    <p className="font-bold text-slate-800 text-[11px]">{edu.qualification} ({edu.fieldOfStudy})</p>
                                    <div className="text-slate-500 font-medium text-[10px]">
                                      <span>{edu.institution} &bull; Year {edu.year} </span>
                                      <span className="bg-[#ecfdf5] text-emerald-600 px-1 py-0.2 rounded text-[9px] font-extrabold">{edu.grade || 'Pass'}</span>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3 py-2 leading-relaxed text-slate-600">
                          <p>
                            This document serves as an official confirmation of <b>{previewingDoc.name}</b> registered under employee profile file mapping. 
                            It has been encrypted with SHA-256 local database hashing and signed electronically for corporate compliance auditing.
                          </p>
                          <p>
                            We verify that the visual layout matches the scanned paperwork hosted inside the Novora corporate distributed safe. 
                            Any further audits should cross-reference document hash: 
                            <span className="block font-mono bg-slate-50 border border-slate-100 px-2 py-1.5 rounded text-[9.5px] font-bold text-slate-600 mt-1 uppercase select-all">
                              SHA256-{Math.floor(10000000 + Math.random() * 90000000).toString(16)}-{employee?.id}
                            </span>
                          </p>
                        </div>
                      )}

                      <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-slate-400 text-[10px]">
                        <span>Secure HR Ledger Node: <b>KUL-MYS-N014</b></span>
                        <span>Authorized audit signature generated</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Bottom Footer bar for additional controls */}
            <div className="bg-white border-t border-slate-100 px-6 py-4 flex justify-end gap-3 shrink-0">
              <button 
                type="button"
                onClick={() => {
                  setShowDocPreviewModal(false);
                  setPreviewingDoc(null);
                }}
                className="px-5 py-2.5 text-[10.5px] font-black rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 uppercase tracking-widest cursor-pointer transition-all border border-slate-200"
              >
                Close Document Frame
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

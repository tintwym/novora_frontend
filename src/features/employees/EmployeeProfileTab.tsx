import React, { useState, useEffect, useRef } from 'react';
import { createLocalId, createLocalNumericId } from '@/lib/createLocalId'
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft,
  Trash2, 
  Key, 
  Save, 
  Plus, 
  Check, 
  Edit2, 
  Briefcase, 
  DollarSign, 
  Coins, 
  FileText, 
  Calendar, 
  MapPin, 
  MoreHorizontal,
  ArrowDown,
  Upload,
  Fingerprint,
  User,
  Shield,
  Layout,
  X,
  Users,
  GraduationCap,
  Download,
  Printer
} from 'lucide-react';
import type { Employee, EmploymentStatus } from '@/types';
import { formatPersonDisplayName } from '@/lib/personName'

interface EmployeeProfileTabProps {
  employee: Employee | null;
  onBackToDirectory: () => void;
  onDeleteEmployee: (id: string) => void;
  onUpdateEmployee: (emp: Employee) => void;
  addToast: (text: string, type: 'success' | 'loading' | 'error' | 'info') => void;
}

type ProfileSubTab = 'Summary' | 'Personal' | 'Family' | 'Biometric' | 'Pay Rate' | 'Career' | 'Education' | 'Documents';

export default function EmployeeProfileTab({ 
  employee, 
  onBackToDirectory, 
  onDeleteEmployee, 
  onUpdateEmployee,
  addToast
}: EmployeeProfileTabProps) {

  // Active Sub Tab
  const [activeTab, setActiveTab] = useState<ProfileSubTab>('Summary');

  // Generic Edit states
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingPayRate, setIsEditingPayRate] = useState(false);
  const [isEditingHRNotes, setIsEditingHRNotes] = useState(false);

  // Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDocPreviewModal, setShowDocPreviewModal] = useState(false);
  const [previewingDoc, setPreviewingDoc] = useState<any>(null);
  const [generatedPassword, setGeneratedPassword] = useState('');

  // Persisted dictionary to separate and save custom documents for each employee
  const [employeeDocsMap, setEmployeeDocsMap] = useState<Record<string, Array<{id: string, name: string, type: string, uploaded: string, expiry: string}>>>({});
  const employeeDocsMapRef = useRef(employeeDocsMap);
  useEffect(() => {
    employeeDocsMapRef.current = employeeDocsMap;
  }, [employeeDocsMap]);

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
    nationality: 'Singaporean',
    nric: 'S9103145A',
    religion: 'Buddhism',
    maritalStatus: 'Married',
    personalEmail: 'sarah.lim@gmail.com',
    mobileNo: '+65 9123 4567',
    race: 'Chinese',

    // Passport
    passportEnabled: true,
    passportNo: 'A12345678',
    passportCountry: 'Singapore',
    passportIssueDate: '10 Jan 2020',
    passportExpiryDate: '9 Jan 2030',

    // Address
    addressLine1: '12 Marina Boulevard, #28-01',
    addressLine2: 'Marina Bay',
    city: 'Singapore',
    state: 'Singapore',
    postcode: '018982',
    country: 'Singapore',
    sameAsPermanent: true,
    perAddress: '12 Marina Boulevard, #28-01, Marina Bay Financial Centre, Singapore 018982',

    // Family Members
    familyMembers: [
      { id: '1', name: 'Lim Kah Fatt', relationship: 'Spouse', dob: '12 Jun 1988', nric: 'S8806121B', taxExempt: true, passport: 'N/A' },
      { id: '2', name: 'Lim Zhi Xuan', relationship: 'Child', dob: '4 Feb 2018', nric: 'T1802045C', taxExempt: true, passport: 'N/A' },
      { id: '3', name: 'Lim Mei Hua', relationship: 'Mother', dob: '8 Sep 1962', nric: 'S6209087D', taxExempt: false, passport: 'N/A' }
    ],

    // Next of Kin
    nokList: [
      { id: '1', name: 'Lim Kah Fatt', relationship: 'Spouse', contactNo: '+65 8765 4321', address: 'Same as employee' }
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
    currency: 'SGD (Singapore Dollar)',
    basicSalary: 7500.00,
    payEffectiveDate: '1 Mar 2024',
    bankAccount: 'Maybank •••• 4521',

    allowances: [
      { id: '1', type: 'Transport allowance', amount: 300.00, frequency: 'Monthly', taxable: false, status: 'Active' },
      { id: '2', type: 'Meal allowance', amount: 200.00, frequency: 'Monthly', taxable: false, status: 'Active' },
      { id: '3', type: 'Phone allowance', amount: 150.00, frequency: 'Monthly', taxable: true, status: 'Active' }
    ],

    deductions: [
      { id: '1', type: 'CPF (Employee)', amount: 825.00, frequency: 'Monthly', reference: '11%', status: 'Active' },
      { id: '2', type: 'CPF MediSave', amount: 49.40, frequency: 'Monthly', reference: 'Statutory', status: 'Active' },
      { id: '3', type: 'Income Tax (IRAS)', amount: 620.00, frequency: 'Monthly', reference: 'Est.', status: 'Active' }
    ],

    // Career History
    careerHistory: [
      { id: '1', company: 'Tech Solutions Pte. Ltd.', position: 'Junior Developer', from: 'Jun 2013', to: 'Dec 2016', reason: 'Career growth' },
      { id: '2', company: 'Infineon Technologies', position: 'Software Engineer', from: 'Jan 2017', to: 'Dec 2020', reason: 'Better opportunity' }
    ],

    // Education
    educationList: [
      { id: '1', institution: 'National University of Singapore', qualification: "Bachelor's Degree", fieldOfStudy: 'Computer Science', year: '2013', grade: 'First Class' }
    ],

    // Documents
    documentsList: [
      { id: '1', name: 'Offer Letter', type: 'Contract', uploaded: '12 Jan 2021', expiry: '—' },
      { id: '2', name: 'NRIC Copy', type: 'NRIC', uploaded: '12 Jan 2021', expiry: '—' },
      { id: '3', name: 'Passport', type: 'Passport', uploaded: '10 Jan 2020', expiry: '9 Jan 2030' }
    ]
  });

  // Track state changes to allow overall saving
  const [isStateModified, setIsStateModified] = useState(false);

  // Sync profile data when selected employee changes (not when docs map updates —
  // that would wipe in-progress edits after an upload).
  useEffect(() => {
    if (!employee) return;

    const employeeId = employee.id;
    const isSarah = employee.name.toLowerCase().includes('sarah lim');

    const defaultDocs = [
      { id: '1', name: `Offer Letter - ${employee.name}`, type: 'Contract', uploaded: '12 Jan 2021', expiry: '—' },
      { id: '2', name: 'NRIC Copy', type: 'NRIC', uploaded: '12 Jan 2021', expiry: '—' },
      { id: '3', name: 'Passport', type: 'Passport', uploaded: '10 Jan 2020', expiry: '9 Jan 2030' }
    ];
    const existingDocs = employeeDocsMapRef.current[employeeId] || defaultDocs;

    const timer = window.setTimeout(() => {
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
        nationality: 'Singaporean',
        religion: isSarah ? 'Buddhism' : 'Islam',
        maritalStatus: isSarah ? 'Married' : 'Single',
        personalEmail: isSarah ? 'sarah.lim@gmail.com' : `${employee.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
        mobileNo: isSarah ? '+65 9123 4567' : employee.mobile,
        race: isSarah ? 'Chinese' : 'Malay',
        basicSalary: isSarah ? 7500.00 : 5400.00,
        bankAccount: isSarah ? 'Maybank •••• 4521' : 'CIMB •••• 8812',
        documentsList: existingDocs,
      }));

      if (!employeeDocsMapRef.current[employeeId]) {
        setEmployeeDocsMap(prev => ({
          ...prev,
          [employeeId]: existingDocs
        }));
      }

      setIsStateModified(false);
    }, 0);

    return () => window.clearTimeout(timer);
    // Intentionally omit full `employee` — syncing on the object would wipe in-progress edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee?.id, employee?.name, employee?.employmentStatus, employee?.mobile]);

  if (!employee) {
    return (
      <div id="no-profile-view" className="bg-white border border-slate-100 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-100">
        <Users className="h-10 w-10 text-slate-300 mb-3" />
        <p className="text-slate-500 text-sm font-semibold">No Employee profile Selected</p>
        <p className="text-slate-400 text-xs mt-1">Please select an employee from the directory list.</p>
      </div>
    );
  }

  // Handle local state edit auto-saves directly to parent
  const triggerAutoSave = (newJobType?: EmploymentStatus, newMobile?: string) => {
    const updatedEmployee: Employee = {
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
      pass += chars.charAt(createLocalNumericId() % chars.length);
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
    onDeleteEmployee(employee.id);
  };

  // Document upload drag/drop & submit handlers
  const MAX_DOC_BYTES = 10 * 1024 * 1024
  const ALLOWED_DOC_TYPES = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
  ]

  const isAllowedDocFile = (file: File) => {
    if (ALLOWED_DOC_TYPES.includes(file.type)) return true
    const ext = file.name.split('.').pop()?.toLowerCase()
    return ['pdf', 'png', 'jpg', 'jpeg', 'webp'].includes(ext || '')
  }

  const applySelectedDocFile = (file: File) => {
    if (!isAllowedDocFile(file)) {
      addToast('Only PDF, PNG, JPG, or WEBP files are allowed.', 'error')
      return
    }
    if (file.size > MAX_DOC_BYTES) {
      addToast('File must be 10MB or smaller.', 'error')
      return
    }
    setSelectedFile(file)
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
    setDocCustomName(baseName)
  }

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
      applySelectedDocFile(e.dataTransfer.files[0]!);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      applySelectedDocFile(e.target.files[0]!);
    }
    e.target.value = '';
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
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
      id: createLocalId('doc'),
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
    setEmployeeDocsMap(prev => ({
      ...prev,
      [employee.id]: updatedList
    }));

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
  const handleSaveFamilyMember = (e: React.FormEvent) => {
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
        id: createLocalId('fam'),
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

  const handleSaveNok = (e: React.FormEvent) => {
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
        id: createLocalId('nok'),
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
      taNumber: `TA-004${createLocalNumericId(100) % 900}`,
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

  const handleSaveBiometricDevice = (e: React.FormEvent) => {
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
      id: createLocalId('ALW'),
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

  const handleSaveAllowance = (e: React.FormEvent) => {
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
      id: createLocalId('DED'),
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

  const handleSaveDeduction = (e: React.FormEvent) => {
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
      id: createLocalId('CAR'),
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

  const handleSaveCareer = (e: React.FormEvent) => {
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
      id: createLocalId('EDU'),
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

  const handleSaveEducation = (e: React.FormEvent) => {
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
  return (
    <div id="extended-profile-component-stage" className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. PRIMARY PORTAL CONTROLS SUBBAR - REMOVED GIGANTIC RIBBON */}
      <div className="flex items-center justify-between pb-1 select-none">
        <button 
          id="profile-back-to-directory"
          onClick={onBackToDirectory}
          className="flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-novora transition-colors cursor-pointer group"
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
            <div className={`h-22 w-22 rounded-full flex items-center justify-center font-bold text-2xl tracking-tighter shadow-md border border-slate-100 overflow-hidden relative ${employee.avatarColor}`}>
              {employee.avatarUrl ? (
                <img src={employee.avatarUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                getInitials(formatPersonDisplayName(employee.name))
              )}
            </div>
            
            {/* Core titles details */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-bold tracking-tight text-slate-800 leading-none">{formatPersonDisplayName(employee.name)}</h2>
                <span className="bg-emerald-50 text-[#059669] border border-emerald-100/30 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 whitespace-nowrap shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse items-center shrink-0" />
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
                  Singapore HQ
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
      <div id="profile-subtabs-strip" className="overflow-x-auto nv-card px-2.5 py-1.5 flex items-center gap-1 shadow-sm scrollbar-none select-none">
        {([
          'Summary', 'Personal', 'Family', 'Biometric', 'Pay Rate', 'Career', 'Education', 'Documents'
        ] as ProfileSubTab[]).map(tab => {
          const isActive = activeTab === tab;
          return (
            <button
              id={`profile-subtab-${tab.toLowerCase().replace(/\s+/g, '-')}`}
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-blue-50 text-novora'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              {tab}
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
                          className="text-[10px] font-black text-novora hover:bg-blue-50/50 hover:underline px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Edit2 className="h-3 w-3" />
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
                            className="bg-slate-50 border border-slate-200 focus:outline-none focus:border-novora px-2 py-0.5 rounded text-xs w-48 text-right font-bold"
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
                        <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide border border-emerald-100 inline-flex items-center whitespace-nowrap shrink-0">
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
                            className="bg-slate-50 border border-slate-200 focus:outline-none focus:border-novora px-2 py-0.5 rounded text-xs text-right font-bold"
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
                            className="bg-slate-50 border border-slate-200 focus:outline-none focus:border-novora px-2 py-0.5 rounded text-xs text-right font-bold"
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
                        <div className="w-full bg-slate-100 bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100/50">
                          <div className="bg-novora h-full rounded-full" style={{ width: `${(profileData.annualLeaveUsed / profileData.annualLeaveMax) * 100}%` }} />
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
                        <div className="flex-1 bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100/50 items-center shrink-0">
                          <div className="bg-novora h-full rounded-full" style={{ width: `${profileData.prefTechnical}%` }} />
                        </div>
                        <span className="text-slate-800 font-black font-mono w-10 text-right">{profileData.prefTechnical}%</span>
                      </div>

                      {/* Comm */}
                      <div className="flex items-center justify-between text-xs font-bold gap-4">
                        <span className="text-slate-500 w-28 text-[11px]">Communication</span>
                        <div className="flex-1 bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100/50 items-center shrink-0">
                          <div className="bg-novora h-full rounded-full" style={{ width: `${profileData.prefCommunication}%` }} />
                        </div>
                        <span className="text-slate-800 font-black font-mono w-10 text-right">{profileData.prefCommunication}%</span>
                      </div>

                      {/* Teams */}
                      <div className="flex items-center justify-between text-xs font-bold gap-4">
                        <span className="text-slate-500 w-28 text-[11px]">Teamwork</span>
                        <div className="flex-1 bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100/50 items-center shrink-0">
                          <div className="bg-novora h-full rounded-full" style={{ width: `${profileData.prefTeamwork}%` }} />
                        </div>
                        <span className="text-slate-800 font-black font-mono w-10 text-right">{profileData.prefTeamwork}%</span>
                      </div>

                      {/* Punc */}
                      <div className="flex items-center justify-between text-xs font-bold gap-4">
                        <span className="text-slate-500 w-28 text-[11px]">Punctuality</span>
                        <div className="flex-1 bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100/50 items-center shrink-0">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${profileData.prefPunctuality}%` }} />
                        </div>
                        <span className="text-slate-800 font-black font-mono w-10 text-right">{profileData.prefPunctuality}%</span>
                      </div>

                      {/* Lead */}
                      <div className="flex items-center justify-between text-xs font-bold gap-4">
                        <span className="text-slate-500 w-28 text-[11px]">Leadership</span>
                        <div className="flex-1 bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100/50 items-center shrink-0">
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
                          className="text-[10px] font-black text-novora hover:bg-blue-50/50 hover:underline px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Edit2 className="h-3 w-3" />
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
                          className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-novora p-2 rounded text-xs font-bold text-slate-800"
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
                        className="text-[10px] font-black text-novora hover:bg-blue-50/50 hover:underline px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Edit2 className="h-3 w-3" />
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
                      { key: 'name', label: 'Full name', value: formatPersonDisplayName(employee.name), editable: false },
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
                            className="bg-slate-50 bg-slate-50 border border-slate-200 focus:outline-none focus:border-novora px-2 py-1 rounded text-xs font-bold text-slate-800"
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
                              className="bg-slate-50 border border-slate-200 focus:outline-none focus:border-novora px-2 py-1 rounded text-xs font-bold text-slate-800"
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
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Current address</h3>
                    {!isEditingAddress ? (
                      <button
                        type="button"
                        onClick={() => setIsEditingAddress(true)}
                        className="text-[10px] font-black text-novora hover:bg-blue-50/50 hover:underline px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                        title="Edit address"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingAddress(false);
                          triggerAutoSave(undefined, profileData.mobileNo);
                          addToast('Address updated and auto-saved.', 'success');
                        }}
                        className="text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="h-3 w-3" />
                        <span>Done</span>
                      </button>
                    )}
                  </div>

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
                        {isEditingAddress ? (
                          <input
                            type="text"
                            value={(profileData as any)[field.key]}
                            onChange={(e) => { setProfileData({...profileData, [field.key]: e.target.value}); setIsStateModified(true); }}
                            className="bg-slate-50 border border-slate-200 focus:outline-none focus:border-novora px-2 py-1 rounded text-xs font-bold text-slate-800"
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
                      disabled={!isEditingAddress}
                      onChange={(e) => { setProfileData({...profileData, sameAsPermanent: e.target.checked}); setIsStateModified(true); }}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
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
                      className="bg-novora hover:bg-[#2051bf] text-white font-bold text-[10px] px-3.5 py-2 rounded-xl transition-all inline-flex items-center gap-1 cursor-pointer shadow-xs whitespace-nowrap shrink-0"
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
                                    title="Edit"
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-novora hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
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
                      className="bg-novora hover:bg-[#2051bf] text-white font-bold text-[10px] px-3.5 py-2 rounded-xl transition-all inline-flex items-center gap-1 cursor-pointer shadow-xs whitespace-nowrap shrink-0"
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
                                <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full text-[9px] font-black uppercase inline-flex items-center whitespace-nowrap shrink-0">
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
                                    title="Edit"
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-novora hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
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
                          className="h-3.5 w-3.5 rounded border-slate-300 text-novora focus:ring-blue-500 cursor-pointer"
                        />
                        <label htmlFor="biometrics-enable-box" className="text-xs font-black text-slate-600 cursor-pointer uppercase tracking-wider text-[10.5px]">Enabled</label>
                      </div>
                      <button 
                        disabled={!profileData.biometricsEnabled}
                        onClick={handleAddBiometricDevice}
                        className={`font-bold text-[10px] px-3.5 py-2 rounded-xl transition-all inline-flex items-center gap-1 cursor-pointer border shadow-xs ${
                          profileData.biometricsEnabled 
                            ? 'bg-novora hover:bg-[#2051bf] text-white border-transparent' 
                            : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                        }`}
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
                                  <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase inline-flex items-center whitespace-nowrap shrink-0">
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
                                      className="px-3 py-1.5 border border-slate-200 hover:border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 font-bold tracking-wide text-[10.5px] cursor-pointer"
                                    >
                                    <Edit2 className="h-3.5 w-3.5" />
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
                        className="text-[10px] font-black text-novora hover:bg-blue-50/50 hover:underline px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Edit2 className="h-3 w-3" />
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
                        <span className="text-[#2F66E0] font-black block text-[13.5px] pt-0.5">SGD {profileData.basicSalary.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
                      className="bg-novora hover:bg-[#2051bf] text-white font-bold text-[10px] px-3.5 py-2 rounded-xl transition-all inline-flex items-center gap-1 cursor-pointer border border-transparent shadow-xs whitespace-nowrap shrink-0"
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
                          <th className="pb-3 text-left">Amount (SGD)</th>
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
                              <td className="py-3.5 font-mono font-bold text-novora">
                                SGD {allow.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                                    title="Edit"
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-novora hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
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
                      className="bg-novora hover:bg-[#2051bf] text-white font-bold text-[10px] px-3.5 py-2 rounded-xl transition-all inline-flex items-center gap-1 cursor-pointer border border-transparent shadow-xs whitespace-nowrap shrink-0"
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
                          <th className="pb-3 text-left">Amount (SGD)</th>
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
                                SGD {ded.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                                    title="Edit"
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-novora hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
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
                      <span className="text-blue-500 text-blue-600 text-xs font-black block tracking-wide uppercase text-[10.5px]">Estimated net pay (monthly)</span>
                      <span className="text-slate-400 text-[10.5px] font-bold block mt-0.5">Basic + Allowances &ndash; Deductions</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-auto select-none">
                    <span className="p-2.5 bg-white text-blue-700/60 rounded-full border border-blue-50/50 inline-flex items-center whitespace-nowrap shrink-0">
                      <ArrowDown className="h-4.5 w-4.5 shrink-0" />
                    </span>
                    <span className="text-[#1d4ed8] font-black text-2xl font-mono tracking-tighter">
                      SGD {estimatedNetPay.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                      className="bg-novora hover:bg-[#2051bf] text-white font-bold text-[10px] px-3.5 py-2 rounded-xl transition-all inline-flex items-center gap-1 cursor-pointer border border-transparent shadow-xs whitespace-nowrap shrink-0"
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
                                    title="Edit"
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-novora hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
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
                      className="bg-novora hover:bg-[#2051bf] text-white font-bold text-[10px] px-3.5 py-2 rounded-xl transition-all inline-flex items-center gap-1 cursor-pointer border border-transparent shadow-xs whitespace-nowrap shrink-0"
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
                                <span className="bg-[#ecfdf5] text-[#059669] px-2.5 py-0.5 rounded font-black text-[9.5px] uppercase tracking-wider border border-[#ecfdf5]">
                                  {edu.grade || 'Pass'}
                                </span>
                              </td>
                              <td className="py-3.5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button 
                                    onClick={() => handleEditEducation(edu)}
                                    title="Edit"
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-novora hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
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
                      className="h-9 inline-flex items-center gap-1 px-3.5 text-[10px] font-bold text-white bg-novora rounded-xl transition-all shadow-xs cursor-pointer hover:bg-opacity-95 whitespace-nowrap shrink-0"
                    >
                      <Upload className="h-3.5 w-3.5 shrink-0" />
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
                        className="text-[10px] font-black text-novora hover:underline cursor-pointer"
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
                              <td className="py-3.5 text-slate-800">
                                <div className="flex items-center gap-2 min-w-0">
                                  <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                                  <span
                                    onClick={() => {
                                      setPreviewingDoc(doc);
                                      setShowDocPreviewModal(true);
                                    }}
                                    className="hover:underline cursor-pointer truncate"
                                  >
                                    {doc.name}
                                  </span>
                                </div>
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
                                    className="px-3.5 py-1.5 border border-slate-200 hover:border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 font-bold tracking-wide text-[10.5px] cursor-pointer"
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
                className="px-4.5 py-2 text-[10.5px] font-black rounded-xl bg-rose-600 hover:bg-rose-500 text-white uppercase tracking-widest cursor-pointer flex items-center gap-1"
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
                className="px-4.5 py-2 text-[10.5px] font-black rounded-xl bg-slate-900 hover:bg-slate-800 text-white uppercase tracking-widest cursor-pointer flex items-center gap-1"
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
                <p className="text-[10px] text-slate-400">
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
                  accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/png,image/jpeg,image/webp"
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
                        ? 'border-novora bg-blue-50/30 ring-4 ring-blue-50' 
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200'
                  }`}
                >
                  {selectedFile ? (
                    <>
                      <div className="h-9 w-9 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                        <FileText className="h-4.5 w-4.5 shrink-0" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-bold text-slate-800 line-clamp-1 truncate max-w-60">
                          {selectedFile.name}
                        </p>
                        <p className="text-[9px] text-slate-400 font-mono">
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
                      <div className="h-9 w-9 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center">
                        <Upload className="h-4 w-4 text-slate-400 shrink-0" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-extrabold text-slate-700 leading-tight">
                          {isDragging ? 'Drop your file now' : 'Drag & drop your file here'}
                        </p>
                        <p className="text-[9.5px] text-slate-400">
                          or <span className="text-novora underline font-bold">browse your computer</span>
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
                  className="w-full bg-slate-50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold transition-all text-slate-800 placeholder-slate-400"
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
                    className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold transition-all text-slate-800"
                  >
                    <option value="Contract">Contract / Offer</option>
                    <option value="NRIC">NRIC / National ID</option>
                    <option value="Passport">Passport</option>
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
                      className="rounded border-slate-300 text-novora focus:ring-blue-500 h-3.5 w-3.5 cursor-pointer"
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
                    className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold transition-all text-slate-800"
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
                      ? 'bg-novora hover:bg-[#2051bf] text-white cursor-pointer hover:shadow-md' 
                      : 'bg-slate-50 text-slate-400 cursor-not-allowed border border-slate-200/50'
                  }`}
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
                <p className="text-[10px] text-slate-400 border-0">
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
                  className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold transition-all text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Relationship *</label>
                  <select 
                    value={familyForm.relationship}
                    onChange={(e) => setFamilyForm({...familyForm, relationship: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold transition-all text-slate-800"
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
                    className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold transition-all text-slate-800"
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
                    className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold transition-all text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Passport No.</label>
                  <input 
                    type="text" 
                    placeholder="e.g. A2345678"
                    value={familyForm.passport}
                    onChange={(e) => setFamilyForm({...familyForm, passport: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold transition-all text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2.5 py-1.5 pl-0.5">
                <input 
                  type="checkbox"
                  id="family-tax-exempt-box"
                  checked={familyForm.taxExempt}
                  onChange={(e) => setFamilyForm({...familyForm, taxExempt: e.target.checked})}
                  className="rounded border-slate-300 text-novora focus:ring-blue-500 h-3.5 w-3.5 cursor-pointer"
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
                  className="px-5 py-2 text-[10.5px] font-black rounded-xl bg-novora hover:bg-[#2051bf] text-white uppercase tracking-widest cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow"
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
                <h4 className="text-xs font-black text-slate-800 text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="h-4 w-4 text-blue-500 shrink-0" />
                  <span>{editingNok ? 'Edit Next of Kin' : 'Add Next of Kin'}</span>
                </h4>
                <p className="text-[10px] text-slate-400 border-0">
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
                  className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold transition-all text-slate-800 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Relationship *</label>
                  <select 
                    value={nokForm.relationship}
                    onChange={(e) => setNokForm({...nokForm, relationship: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold transition-all text-slate-800"
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
                    className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold transition-all text-slate-800 text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Home Address</label>
                <textarea 
                  rows={2}
                  placeholder="e.g. 42 Telok Ayer Street, Singapore 048434"
                  value={nokForm.address}
                  onChange={(e) => setNokForm({...nokForm, address: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold transition-all text-slate-800 leading-relaxed resize-none"
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
                  className="px-5 py-2 text-[10.5px] font-black rounded-xl bg-novora hover:bg-[#2051bf] text-white uppercase tracking-widest cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow"
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
                <h4 className="text-xs font-black text-slate-800 text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="h-4 w-4 text-blue-500 shrink-0 text-blue-500" />
                  <span>{editingBiometricDevice ? 'Edit Device' : 'Register Device'}</span>
                </h4>
                <p className="text-[10px] text-slate-400 border-0">
                  Configure biometric access and allocation attributes
                </p>
              </div>
              <button 
                onClick={() => setShowBiometricModal(false)}
                className="h-7 w-7 text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBiometricDevice} className="mt-4 space-y-4 text-xs font-semibold text-slate-700">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-700 text-slate-700 uppercase tracking-wider block">TA Number *</label>
                  <input 
                    type="text" 
                    required
                    disabled={!!editingBiometricDevice}
                    placeholder="e.g. TA-004123"
                    value={biometricForm.taNumber}
                    onChange={(e) => setBiometricForm({...biometricForm, taNumber: e.target.value})}
                    className={`w-full border rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                      editingBiometricDevice 
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' 
                        : 'bg-slate-50 border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 text-slate-800'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Device Type *</label>
                  <select 
                    value={biometricForm.deviceType}
                    onChange={(e) => setBiometricForm({...biometricForm, deviceType: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold transition-all text-slate-800"
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
                  className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold transition-all text-slate-800 text-slate-800"
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
                    className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold transition-all text-slate-800 text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-700 text-slate-700 uppercase tracking-wider block">Status *</label>
                  <select 
                    value={biometricForm.status}
                    onChange={(e) => setBiometricForm({...biometricForm, status: e.target.value as any})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold transition-all text-slate-800"
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
                  className="px-5 py-2 text-[10.5px] font-black rounded-xl bg-novora hover:bg-[#2051bf] text-white uppercase tracking-widest cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow"
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
                  className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold font-sans transition-all text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Amount (SGD) *</label>
                  <input 
                    type="number" 
                    required
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    value={allowanceForm.amount || ''}
                    onChange={(e) => setAllowanceForm({...allowanceForm, amount: parseFloat(e.target.value) || 0})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold font-mono transition-all text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Frequency *</label>
                  <select 
                    value={allowanceForm.frequency}
                    onChange={(e) => setAllowanceForm({...allowanceForm, frequency: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold font-sans transition-all text-slate-800"
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
                    className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold font-sans transition-all text-slate-800"
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
                  className="px-5 py-2 text-[10.5px] font-black rounded-xl bg-novora hover:bg-[#2051bf] text-white uppercase tracking-widest cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow"
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
                <h4 className="text-xs font-black text-slate-800 text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
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
                  placeholder="e.g. CPF, CDAC, SHG, IRAS tax"
                  value={deductionForm.type}
                  onChange={(e) => setDeductionForm({...deductionForm, type: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold font-sans transition-all text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Amount (SGD) *</label>
                  <input 
                    type="number" 
                    required
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    value={deductionForm.amount || ''}
                    onChange={(e) => setDeductionForm({...deductionForm, amount: parseFloat(e.target.value) || 0})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold font-mono transition-all text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Frequency *</label>
                  <select 
                    value={deductionForm.frequency}
                    onChange={(e) => setDeductionForm({...deductionForm, frequency: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold font-sans transition-all text-slate-800"
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
                    className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold font-sans transition-all text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Status *</label>
                  <select 
                    value={deductionForm.status}
                    onChange={(e) => setDeductionForm({...deductionForm, status: e.target.value as any})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold font-sans transition-all text-slate-800"
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
                  className="px-5 py-2 text-[10.5px] font-black rounded-xl bg-novora hover:bg-[#2051bf] text-white uppercase tracking-widest cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow"
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
                  <Briefcase className="h-3.5 w-3.5 text-novora shrink-0" />
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
                  className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold font-sans transition-all text-slate-800"
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
                  className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold font-sans transition-all text-slate-800"
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
                    className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold font-sans transition-all text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">To</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Jun 2013 / Present"
                    value={careerForm.to}
                    onChange={(e) => setCareerForm({...careerForm, to: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold font-sans transition-all text-slate-800"
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
                  className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold font-sans transition-all text-slate-800"
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
                  className="px-5 py-2 text-[10.5px] font-black rounded-xl bg-novora hover:bg-[#2051bf] text-white uppercase tracking-widest cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow"
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
                  <GraduationCap className="h-4 w-4 text-novora shrink-0" />
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
                  className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold font-sans transition-all text-slate-800"
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
                  className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold font-sans transition-all text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Field Of Study</label>
                <input 
                  type="text" 
                  placeholder="e.g. Computer Science, Accounting"
                  value={educationForm.fieldOfStudy}
                  onChange={(e) => setEducationForm({...educationForm, fieldOfStudy: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2 text-xs font-bold font-sans transition-all text-slate-800"
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
                    className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold font-sans transition-all text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Grade</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Pass, First Class"
                    value={educationForm.grade}
                    onChange={(e) => setEducationForm({...educationForm, grade: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-novora focus:ring-1 focus:ring-blue-500 rounded-xl px-3 py-2 text-xs font-bold font-sans transition-all text-slate-800"
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
                  className="px-5 py-2 text-[10.5px] font-black rounded-xl bg-novora hover:bg-[#2051bf] text-white uppercase tracking-widest cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow"
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
      {showDocPreviewModal && previewingDoc && (() => {
        const isIdDoc =
          previewingDoc.type === 'ID' ||
          previewingDoc.type === 'NRIC' ||
          previewingDoc.type === 'Passport'
        const isPassportDoc =
          previewingDoc.type === 'Passport' || /passport/i.test(String(previewingDoc.name || ''))
        const closePreview = () => {
          setShowDocPreviewModal(false)
          setPreviewingDoc(null)
        }
        const personName = formatPersonDisplayName(employee?.name)
        const address =
          [
            profileData.addressLine1,
            profileData.addressLine2,
            [profileData.postcode, profileData.city].filter(Boolean).join(' '),
            profileData.state,
            profileData.country,
          ]
            .filter(Boolean)
            .join(', ') ||
          profileData.perAddress ||
          'As per employee record'
        const nameParts = personName.includes(' ')
          ? personName.split(/\s+/).filter(Boolean)
          : personName.split(/(?=[A-Z])/).filter(Boolean)
        const initials =
          (nameParts.map((n) => n[0]).filter(Boolean).slice(0, 2).join('') || 'EE').toUpperCase()
        const sexCode = /female|^f$/i.test(String(profileData.gender || ''))
          ? 'F'
          : /male|^m$/i.test(String(profileData.gender || ''))
            ? 'M'
            : 'X'
        const nricNo = profileData.nric || 'S0000000A'
        const passportNo = profileData.passportNo || 'K0000000A'
        const issueDate = profileData.passportIssueDate || previewingDoc.uploaded
        const expiryDate =
          profileData.passportExpiryDate ||
          (previewingDoc.expiry && previewingDoc.expiry !== '—' ? previewingDoc.expiry : '—')
        const surname = (nameParts.length > 1 ? nameParts[nameParts.length - 1] : nameParts[0] || '').toUpperCase()
        const givenNames = (
          nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : nameParts[0] || ''
        ).toUpperCase()
        const toMrzDate = (value: string | undefined) => {
          if (!value || value === '—') return '000000'
          const digits = String(value).replace(/[^0-9]/g, '')
          if (digits.length >= 6) return digits.slice(-6)
          const parsed = Date.parse(value)
          if (!Number.isNaN(parsed)) {
            const d = new Date(parsed)
            const yy = String(d.getFullYear()).slice(-2)
            const mm = String(d.getMonth() + 1).padStart(2, '0')
            const dd = String(d.getDate()).padStart(2, '0')
            return `${yy}${mm}${dd}`
          }
          return '000000'
        }

        return (
          <div
            id="profile-doc-preview-modal-overlay"
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 md:p-6 animate-in fade-in duration-150"
            onClick={closePreview}
          >
            <div
              className={`bg-white border border-slate-200 rounded-3xl w-full shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] ${
                isIdDoc ? 'max-w-3xl' : 'max-w-2xl'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-white border-b border-slate-100 px-5 sm:px-6 py-4 flex items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-novora/10 border border-novora/15 flex items-center justify-center text-novora shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{previewingDoc.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-[10px] bg-slate-100 text-slate-600 rounded-md px-1.5 py-0.5 font-bold">
                        {previewingDoc.type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Uploaded {previewingDoc.uploaded}
                        {previewingDoc.expiry && previewingDoc.expiry !== '—'
                          ? ` · Expires ${previewingDoc.expiry}`
                          : ''}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      addToast(`Print queued for "${previewingDoc.name}".`, 'success')
                    }
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-slate-100 rounded-lg cursor-pointer transition-colors"
                    title="Print"
                  >
                    <Printer className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      addToast(`Downloading "${previewingDoc.name}".`, 'success')
                    }
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-slate-100 rounded-lg cursor-pointer transition-colors"
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={closePreview}
                    className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center cursor-pointer transition-all"
                    title="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable body — min-h-0 so flex child can scroll instead of clipping */}
              <div className="flex-1 min-h-0 overflow-y-auto bg-slate-50/80 p-5 sm:p-6">
                <div
                  className={
                    isIdDoc
                      ? 'w-full text-slate-800 text-xs leading-relaxed'
                      : 'nv-card shadow-sm w-full p-6 sm:p-8 text-slate-800 text-xs leading-relaxed'
                  }
                >
                  {previewingDoc.type === 'Contract' ? (
                    <div className="space-y-5">
                      <div className="text-center pb-4 border-b border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Ref {previewingDoc.id}-NVR-{new Date().getFullYear()}
                        </p>
                        <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                          Novora Business Systems Pte. Ltd.
                        </h2>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Level 28, Marina Bay Financial Centre, 12 Marina Boulevard, Singapore 018982
                        </p>
                      </div>

                      <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                        <span>Date: {previewingDoc.uploaded}</span>
                        <span>Private &amp; Confidential</span>
                      </div>

                      <div className="space-y-1 text-[11px]">
                        <p className="font-bold text-slate-900">To: {personName}</p>
                        <p className="text-slate-500">Employee ID: {employee?.id}</p>
                        <p className="text-slate-500">Residential: {address}</p>
                      </div>

                      <h3 className="text-xs font-extrabold text-slate-900 tracking-tight">
                        Letter of Employment and Terms of Contract
                      </h3>

                      <p className="text-slate-600 leading-relaxed text-[11px]">
                        We are pleased to offer you formal employment with{' '}
                        <span className="font-semibold text-slate-800">
                          Novora Business Systems Pte. Ltd.
                        </span>
                        . Your appointment has been recorded with the following details:
                      </p>

                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-[11px]">
                        {[
                          { label: 'Position', value: employee?.position },
                          { label: 'Department', value: employee?.department },
                          { label: 'Grade', value: profileData.jobGrade },
                          { label: 'Commencement', value: profileData.positionStartDate },
                          {
                            label: 'Basic monthly salary',
                            value: `SGD ${Number(profileData.basicSalary || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
                          },
                          { label: 'Employment status', value: employee?.employmentStatus },
                        ].map((row) => (
                          <div key={row.label}>
                            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                              {row.label}
                            </span>
                            <span className="font-semibold text-slate-800">{row.value || '—'}</span>
                          </div>
                        ))}
                      </div>

                      <p className="text-slate-600 leading-relaxed text-[11px]">
                        Benefits include health coverage,{' '}
                        <span className="font-semibold">{profileData.leaveLeft} days</span> annual
                        leave, and statutory CPF contributions (and SDL where applicable). Payroll is credited to{' '}
                        <span className="font-semibold">{profileData.bankAccount || 'the registered account'}</span>.
                      </p>

                      <div className="pt-2 space-y-1 text-[11px]">
                        <p className="text-slate-600">We look forward to working with you.</p>
                        <p className="text-slate-500">
                          Yours faithfully,
                          <br />
                          <span className="font-bold text-slate-800">Novora Human Resources</span>
                        </p>
                      </div>

                      <div className="pt-6 grid grid-cols-2 gap-6 border-t border-slate-100 text-center text-[10px] text-slate-400">
                        <div className="space-y-3">
                          <div className="h-8 border-b border-dashed border-slate-200" />
                          <p className="font-bold text-slate-600 uppercase tracking-wide">
                            Authorized signature
                          </p>
                        </div>
                        <div className="space-y-3">
                          <div className="h-8 border-b border-dashed border-slate-200" />
                          <p className="font-bold text-slate-600 uppercase tracking-wide">
                            Employee acceptance
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : isPassportDoc ? (
                    <div className="space-y-3">
                      <p className="text-[10px] text-slate-400 font-medium">
                        HR scan preview · {previewingDoc.name} · Uploaded {previewingDoc.uploaded}
                      </p>

                      <div
                        className="relative rounded-2xl overflow-hidden shadow-[0_10px_24px_-16px_rgba(70,80,110,0.38)]"
                        style={{ border: '1px solid #c8ccd8' }}
                      >
                        <div
                          className="relative px-3.5 pt-3 pb-2.5"
                          style={{
                            background:
                              'linear-gradient(120deg, #e8eef6 0%, #ebe9f4 50%, #ece6ef 100%)',
                          }}
                        >
                          <div
                            className="absolute inset-0 pointer-events-none opacity-[0.18]"
                            style={{
                              backgroundImage:
                                'repeating-linear-gradient(0deg, transparent 0 6px, rgba(120,130,170,0.16) 6px 7px)',
                            }}
                          />

                          <p
                            className="relative text-[12px] font-bold tracking-[0.2em] uppercase mb-2.5"
                            style={{ color: '#8b3a45', fontFamily: 'Georgia, "Times New Roman", serif' }}
                          >
                            Passport
                          </p>

                          <div className="relative flex gap-3 items-start">
                            <div
                              className="w-[84px] h-[108px] shrink-0 flex items-center justify-center"
                              style={{
                                border: '2px solid #fff',
                                boxShadow: '0 0 0 1px #c5cad6',
                                background: 'linear-gradient(180deg, #d9dee8 0%, #c8ceda 100%)',
                              }}
                            >
                              <div
                                className="h-12 w-12 rounded-full flex items-center justify-center font-extrabold text-sm"
                                style={{
                                  background: 'rgba(90,100,130,0.25)',
                                  color: '#3a4560',
                                  border: '1px solid rgba(255,255,255,0.7)',
                                }}
                              >
                                {initials}
                              </div>
                            </div>

                            <div className="flex-1 min-w-0 grid grid-cols-2 gap-x-5 gap-y-1.5">
                              {(
                                [
                                  { label: 'Type', value: 'P' },
                                  { label: 'Code', value: 'SGP' },
                                  { label: 'Surname', value: surname },
                                  { label: 'Passport No', value: passportNo },
                                  { label: 'Given names', value: givenNames },
                                  { label: 'Sex', value: sexCode },
                                  {
                                    label: 'Nationality',
                                    value: (profileData.nationality || 'SINGAPOREAN').toUpperCase(),
                                  },
                                  {
                                    label: 'Authority',
                                    value: (profileData.passportCountry || 'SINGAPORE').toUpperCase(),
                                  },
                                  {
                                    label: 'Date of birth',
                                    value: (profileData.dob || '—').toUpperCase(),
                                  },
                                  {
                                    label: 'Date of expiration',
                                    value: String(expiryDate || '—').toUpperCase(),
                                  },
                                  { label: 'Place of birth', value: 'SINGAPORE' },
                                  {
                                    label: 'Signature of Bearer',
                                    value: `${(givenNames[0] || personName[0] || 'J').toUpperCase()}. ${surname.charAt(0)}${surname.slice(1).toLowerCase()}`,
                                    signature: true,
                                  },
                                  {
                                    label: 'Date of issue',
                                    value: String(issueDate || '—').toUpperCase(),
                                  },
                                ] as Array<{ label: string; value: string; signature?: boolean }>
                              ).map((row) => (
                                <div key={row.label} className="min-w-0">
                                  <p
                                    className="text-[7.5px] italic leading-none mb-0.5"
                                    style={{ color: '#7a879c' }}
                                  >
                                    {row.label}
                                  </p>
                                  <p
                                    className="text-[10.5px] font-bold italic leading-tight truncate"
                                    style={{
                                      color: '#2a3348',
                                      fontFamily: row.signature
                                        ? 'Georgia, "Palatino Linotype", cursive'
                                        : undefined,
                                      textTransform: row.signature ? 'none' : 'uppercase',
                                      fontWeight: row.signature ? 600 : 700,
                                    }}
                                    title={row.value}
                                  >
                                    {row.value}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div
                          className="px-3 py-2 font-mono text-[8.5px] leading-[1.45] tracking-wider select-none overflow-x-auto whitespace-nowrap"
                          style={{
                            background: 'linear-gradient(90deg, #eef2f7 0%, #f0ebf2 100%)',
                            color: '#3a4255',
                            borderTop: '1px solid #d7dbe6',
                          }}
                        >
                          <p>
                            {`P<SGP${`${surname}<<${givenNames.replace(/\s+/g, '<')}`.replace(/[^A-Z<]/g, '').padEnd(39, '<').slice(0, 39)}`}
                          </p>
                          <p>
                            {`${String(passportNo).replace(/\s/g, '').toUpperCase().padEnd(9, '<').slice(0, 9)}SGP${toMrzDate(profileData.dob)}${sexCode}${toMrzDate(expiryDate)}<<<<<<<<<<<<<<<`}
                          </p>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-400">
                        Simulated passport biodata page for HR verification — not an official travel document.
                      </p>
                    </div>
                  ) : isIdDoc ? (
                    <div className="space-y-3">
                      <p className="text-[10px] text-slate-400 font-medium">
                        HR scan preview · {previewingDoc.name} · Uploaded {previewingDoc.uploaded}
                      </p>

                      <div className="mx-auto w-full max-w-[520px]">
                        <div
                          className="relative rounded-2xl overflow-hidden shadow-[0_10px_24px_-16px_rgba(140,80,100,0.32)]"
                          style={{ border: '1px solid #d2b0bc', aspectRatio: '1.586 / 1' }}
                        >
                          <div
                            className="absolute inset-0"
                            style={{
                              background:
                                'radial-gradient(ellipse 85% 75% at 100% 100%, #efc5d2 0%, transparent 50%), #f3d9e2',
                            }}
                          />
                          <div
                            className="absolute inset-0 pointer-events-none opacity-[0.3]"
                            style={{
                              backgroundImage:
                                'repeating-radial-gradient(circle at 95% 90%, transparent 0 7px, rgba(190,100,130,0.2) 7px 8px)',
                            }}
                          />

                          <div
                            className="relative flex items-center justify-between px-3.5 py-2"
                            style={{ background: '#f3f3f3', borderBottom: '1px solid #e6e0e2' }}
                          >
                            <div className="min-w-0">
                              <p
                                className="text-[10px] font-bold uppercase tracking-[0.06em] leading-none text-black"
                                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                              >
                                Republic of Singapore
                              </p>
                              <p className="mt-1.5 text-[9px] leading-none text-[#333]">
                                IDENTITY CARD NO.{' '}
                                <span className="font-black text-[12px] tracking-wider font-mono text-black">
                                  {nricNo}
                                </span>
                              </p>
                            </div>
                            <svg width="40" height="40" viewBox="0 0 64 64" className="shrink-0" aria-hidden>
                              <path d="M22 20c0-7 4-12 10-12s10 5 10 12c0 9-4 15-10 20-6-5-10-11-10-20z" fill="#c8102e" />
                              <circle cx="32" cy="18" r="5" fill="#fff" />
                              <g fill="#fff">
                                <circle cx="32" cy="12" r="1.15" />
                                <circle cx="28.4" cy="14" r="1.15" />
                                <circle cx="35.6" cy="14" r="1.15" />
                                <circle cx="29.2" cy="18.2" r="1.15" />
                                <circle cx="34.8" cy="18.2" r="1.15" />
                              </g>
                              <path d="M12 26c3-9 8-13 13-12-3 6-3 13 0 18-5-1-10-3-13-6z" fill="#d4a017" />
                              <path d="M52 26c-3-9-8-13-13-12 3 6 3 13 0 18 5-1 10-3 13-6z" fill="#8b7355" />
                              <ellipse cx="32" cy="56" rx="16" ry="3.5" fill="#c9a227" />
                              <text x="32" y="48" textAnchor="middle" fontSize="5.5" fontWeight="700" fill="#222">
                                MAJULAH
                              </text>
                            </svg>
                          </div>

                          <div className="relative px-3.5 pt-2.5 pb-2.5 h-[calc(100%-52px)]">
                            <div className="flex gap-3 h-full">
                              <div className="relative shrink-0 w-[76px]">
                                <div
                                  className="w-[76px] h-[98px] flex items-center justify-center"
                                  style={{
                                    background: 'linear-gradient(180deg, #d7dbe4 0%, #c4cad6 100%)',
                                    borderRadius: '38px 38px 3px 3px',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.14)',
                                  }}
                                >
                                  <div
                                    className="h-11 w-11 rounded-full flex items-center justify-center font-extrabold text-sm"
                                    style={{
                                      background: 'rgba(80,90,110,0.28)',
                                      color: '#2f3648',
                                      border: '1px solid rgba(255,255,255,0.7)',
                                    }}
                                  >
                                    {initials}
                                  </div>
                                </div>
                                <div
                                  className="absolute left-1 bottom-0 w-8 h-8 rounded-full flex items-center justify-center text-[7px] font-bold"
                                  style={{
                                    background: 'rgba(255,255,255,0.28)',
                                    border: '1px solid rgba(170,130,145,0.45)',
                                    color: '#5a4050',
                                    opacity: 0.5,
                                  }}
                                >
                                  {initials}
                                </div>
                              </div>

                              <div className="flex-1 min-w-0 relative pb-8">
                                <div className="mb-3">
                                  <p className="text-[7.5px] leading-none mb-0.5 text-[#777]">Name</p>
                                  <p
                                    className="text-[12px] font-black uppercase tracking-wide leading-snug text-black break-words"
                                    title={personName}
                                  >
                                    {personName}
                                  </p>
                                </div>

                                <div className="mb-2.5">
                                  <p className="text-[7.5px] leading-none mb-0.5 text-[#777]">Race</p>
                                  <p className="text-[11px] font-black uppercase text-black">
                                    {profileData.race || '—'}
                                  </p>
                                </div>

                                <div className="flex gap-8 mb-2.5">
                                  <div>
                                    <p className="text-[7.5px] leading-none mb-0.5 text-[#777]">
                                      Date of Birth
                                    </p>
                                    <p className="text-[11px] font-black text-black">
                                      {profileData.dob || '—'}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-[7.5px] leading-none mb-0.5 text-[#777]">Sex</p>
                                    <p className="text-[11px] font-black font-mono text-black">{sexCode}</p>
                                  </div>
                                </div>

                                <div>
                                  <p className="text-[7.5px] leading-none mb-0.5 text-[#777]">
                                    Country of Birth
                                  </p>
                                  <p className="text-[11px] font-black uppercase text-black">Singapore</p>
                                </div>

                                <div
                                  className="absolute right-0 bottom-0 w-[96px] h-8 rounded-[50%] flex items-center justify-center"
                                  style={{
                                    background:
                                      'linear-gradient(135deg, rgba(175,180,190,0.55), rgba(205,198,208,0.42), rgba(155,165,180,0.5))',
                                    boxShadow: 'inset 0 0 5px rgba(255,255,255,0.55)',
                                    border: '1px solid rgba(145,150,160,0.4)',
                                  }}
                                >
                                  <span className="text-[9px] font-semibold font-mono tracking-wider text-[#555] opacity-60">
                                    {nricNo}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-400">
                        Simulated Singapore NRIC layout for HR verification — not an official identity card.
                      </p>
                    </div>
                  ) : (

                    <div className="space-y-5">
                      <div className="pb-4 border-b border-slate-100 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                            {previewingDoc.name}
                          </h2>
                          <p className="text-[10px] text-slate-400 mt-1">Employee document preview</p>
                        </div>
                        <span className="shrink-0 text-[10px] font-bold text-novora bg-novora/10 border border-novora/15 px-2 py-0.5 rounded-md">
                          {previewingDoc.type}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 border border-slate-100 rounded-xl p-4 text-[11px]">
                        {[
                          { label: 'Employee', value: personName },
                          { label: 'Employee ID', value: employee?.id },
                          { label: 'Uploaded', value: previewingDoc.uploaded },
                          {
                            label: 'Expiry',
                            value:
                              previewingDoc.expiry && previewingDoc.expiry !== '—'
                                ? previewingDoc.expiry
                                : '—',
                          },
                        ].map((row) => (
                          <div key={row.label}>
                            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                              {row.label}
                            </span>
                            <span className="font-semibold text-slate-800">{row.value || '—'}</span>
                          </div>
                        ))}
                      </div>

                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        Preview of <span className="font-semibold">{previewingDoc.name}</span> on file for{' '}
                        {personName}. Use Download or Print from the header for a local copy.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white border-t border-slate-100 px-5 sm:px-6 py-3.5 flex justify-end shrink-0">
                <button
                  type="button"
                  onClick={closePreview}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-all border border-slate-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )
      })()}

    </div>
  );
}

import React, { useState, useEffect } from 'react';
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
  Mail,
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
import { SelectMenu } from '@/components/ui';
import { formatPersonDisplayName } from '@/lib/personName'
import { useAuth } from '@/providers/AuthProvider'
import { useCurrency } from '@/hooks/useCurrency'
import {
  ApiError,
  addMyDocument,
  createMyEducation,
  createMyFamily,
  deleteMyDocument,
  fetchEmployeeDocuments,
  fetchMyDocuments,
  fetchMyEducation,
  fetchMyFamily,
  type DocumentRow,
  type EducationRow,
  type FamilyMemberRow,
} from '@/services';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type ProfileDoc = { id: string; name: string; type: string; uploaded: string; expiry: string; url?: string };

function formatUiDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function mapDocumentRow(row: DocumentRow): ProfileDoc {
  let uploaded = '—';
  if (row.uploadedAt) {
    try {
      uploaded = new Date(row.uploadedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      uploaded = row.uploadedAt;
    }
  }
  return {
    id: row.id,
    name: row.name,
    type: row.docType || 'Document',
    uploaded,
    expiry: '—',
    url: row.url || undefined,
  };
}

type ProfileFamily = {
  id: string;
  name: string;
  relationship: string;
  dob: string;
  nric: string;
  taxExempt: boolean;
  passport: string;
};

type ProfileEducation = {
  id: string;
  institution: string;
  qualification: string;
  fieldOfStudy: string;
  year: string;
  grade: string;
};

function formatDobForUi(iso: string | null): string {
  if (!iso) return '';
  // Keep YYYY-MM-DD for date inputs when possible
  if (/^\d{4}-\d{2}-\d{2}/.test(iso)) return iso.slice(0, 10);
  try {
    return new Date(iso).toISOString().slice(0, 10);
  } catch {
    return iso;
  }
}

function mapFamilyRow(row: FamilyMemberRow): ProfileFamily {
  return {
    id: row.id,
    name: row.name,
    relationship: row.relationship || '',
    dob: formatDobForUi(row.dateOfBirth),
    nric: '',
    taxExempt: false,
    passport: '',
  };
}

function mapEducationRow(row: EducationRow): ProfileEducation {
  let year = '';
  if (row.endDate) {
    year = String(new Date(row.endDate).getFullYear());
  } else if (row.startDate) {
    year = String(new Date(row.startDate).getFullYear());
  }
  return {
    id: row.id,
    institution: row.institution,
    qualification: row.degree || '',
    fieldOfStudy: row.fieldOfStudy || '',
    year,
    grade: row.grade || '',
  };
}

type ProfileNok = { id: string; name: string; relationship: string; contactNo: string; address: string };

type ProfileBiometricDevice = {
  taNumber: string;
  terminalName: string;
  deviceType: string;
  location: string;
  status: 'Active' | 'Inactive';
};

type ProfileAllowance = {
  id: string;
  type: string;
  amount: number;
  frequency: string;
  taxable: boolean;
  status: 'Active' | 'Inactive';
};

type ProfileDeduction = {
  id: string;
  type: string;
  amount: number;
  frequency: string;
  reference: string;
  status: 'Active' | 'Inactive';
};

type ProfileCareer = { id: string; company: string; position: string; from: string; to: string; reason: string };

function realValue(value: string | null | undefined): string {
  const v = (value ?? '').trim();
  return v === '—' || v === '-' ? '' : v;
}

function formatTenure(joinDate: string | undefined): string {
  const raw = realValue(joinDate);
  if (!raw) return '—';
  const start = new Date(raw);
  if (Number.isNaN(start.getTime())) return '—';
  const now = new Date();
  let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  if (now.getDate() < start.getDate()) months -= 1;
  if (months < 0) return '—';
  return `${Math.floor(months / 12)}y ${months % 12}m`;
}

function createProfileData(employee: Employee | null, companyName: string) {
  const emergencyContact = realValue(employee?.emergencyContact);
  const nokList: ProfileNok[] = emergencyContact
    ? [{ id: 'emergency-contact', name: emergencyContact, relationship: '', contactNo: '', address: '' }]
    : [];
  return {
    company: companyName,
    jobType: (employee?.employmentStatus ?? 'Permanent') as EmploymentStatus,
    positionStartDate: realValue(employee?.joinDate),
    jobGrade: '',

    hrNotes: '',
    blacklisted: '',
    autoClockIn: 'Disabled',

    dob: '',
    gender: '',
    nationality: '',
    nric: realValue(employee?.nric),
    religion: '',
    maritalStatus: '',
    personalEmail: '',
    mobileNo: realValue(employee?.mobile),
    race: '',

    passportEnabled: false,
    passportNo: '',
    passportCountry: '',
    passportIssueDate: '',
    passportExpiryDate: '',

    addressLine1: realValue(employee?.address),
    addressLine2: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    sameAsPermanent: false,
    perAddress: '',

    familyMembers: [] as ProfileFamily[],
    nokList,

    biometricDevices: [] as ProfileBiometricDevice[],
    biometricsEnabled: false,
    autoClockSetting: false,
    ignoreMissingSwipe: false,
    ignoreRotaDeduction: false,
    assignedShift: '',

    payType: '',
    basicSalary: 0,
    payEffectiveDate: '',
    bankAccount: '',
    allowances: [] as ProfileAllowance[],
    deductions: [] as ProfileDeduction[],

    careerHistory: [] as ProfileCareer[],
    educationList: [] as ProfileEducation[],
    documentsList: [] as ProfileDoc[],
  };
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      const comma = result.indexOf(',');
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error || new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

interface EmployeeProfileTabProps {
  employee: Employee | null;
  onBackToDirectory: () => void;
  onDeleteEmployee: (id: string) => void;
  onUpdateEmployee: (emp: Employee) => void;
  addToast: (text: string, type: 'success' | 'loading' | 'error' | 'info') => void;
  employees?: Employee[];
}

type ProfileSubTab = 'Summary' | 'Personal' | 'Family' | 'Biometric' | 'Pay Rate' | 'Career' | 'Education' | 'Documents';

export default function EmployeeProfileTab({ 
  employee, 
  onBackToDirectory, 
  onDeleteEmployee, 
  onUpdateEmployee,
  addToast,
  employees = []
}: EmployeeProfileTabProps) {
  const managerName = employee?.reportsTo
    ? employees.find((e) => e.id === employee.reportsTo || e.apiId === employee.reportsTo)?.name ?? employee.reportsTo
    : null;
  const { session } = useAuth();
  const { currency, money } = useCurrency();
  const companyName = session?.companyName ?? '';
  const isSelf =
    !!employee?.email &&
    !!session?.email &&
    employee.email.trim().toLowerCase() === session.email.trim().toLowerCase();

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

  const empId = employee?.id
  const empApiId = employee?.apiId
  const employeeKey = empApiId ?? empId ?? null

  const [profileData, setProfileData] = useState(() => createProfileData(employee, companyName));
  const [profileKey, setProfileKey] = useState(employeeKey);
  if (profileKey !== employeeKey) {
    setProfileKey(employeeKey);
    setProfileData(createProfileData(employee, companyName));
    setIsEditingSummary(false);
    setIsEditingPersonal(false);
    setIsEditingAddress(false);
    setIsEditingPayRate(false);
    setIsEditingHRNotes(false);
  }

  // Load documents from API when employee changes
  useEffect(() => {
    if (!empId) return;
    if (!empApiId && !isSelf) return;
    let cancelled = false;
    (async () => {
      const rows = await (empApiId ? fetchEmployeeDocuments(empApiId) : fetchMyDocuments()).catch(
        () => [] as DocumentRow[],
      );
      if (cancelled || !rows.length) return;
      const mapped = rows.map(mapDocumentRow);
      setProfileData((prev) => ({
        ...prev,
        documentsList: [
          ...mapped,
          ...prev.documentsList.filter((doc) => !mapped.some((m) => m.id === doc.id)),
        ],
      }));
    })();
    return () => {
      cancelled = true;
    };
  }, [empId, empApiId, isSelf]);

  // Family & education endpoints only cover the signed-in user's own record
  useEffect(() => {
    if (!empId || !isSelf) return;
    let cancelled = false;
    (async () => {
      const [familyRows, educationRows] = await Promise.all([
        fetchMyFamily().catch(() => [] as FamilyMemberRow[]),
        fetchMyEducation().catch(() => [] as EducationRow[]),
      ]);
      if (cancelled) return;
      setProfileData((prev) => ({
        ...prev,
        familyMembers: familyRows.length ? familyRows.map(mapFamilyRow) : prev.familyMembers,
        educationList: educationRows.length
          ? educationRows.map(mapEducationRow)
          : prev.educationList,
      }));
    })();
    return () => {
      cancelled = true;
    };
  }, [empId, isSelf]);

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
    relationship: '',
    dob: '',
    nric: '',
    taxExempt: false,
    passport: ''
  });

  const [showNokModal, setShowNokModal] = useState(false);
  const [editingNok, setEditingNok] = useState<any>(null);
  const [nokForm, setNokForm] = useState({
    name: '',
    relationship: '',
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

  // Track state changes to allow overall saving
  const [, setIsStateModified] = useState(false);

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
      mobile: (newMobile !== undefined ? newMobile : profileData.mobileNo) || '—',
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
    addToast('Temporary password generated locally only — it has not been applied to the account or sent to the employee.', 'info');
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

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      addToast('Please select or drag a file to upload first.', 'error');
      return;
    }

    const formattedExpiry = hasExpiry && docExpiryDate 
      ? formatUiDate(new Date(docExpiryDate)) 
      : '—';

    const name = docCustomName.trim() || selectedFile.name;

    let contentBase64: string;
    try {
      contentBase64 = await readFileAsBase64(selectedFile);
    } catch {
      addToast('Could not read the selected file.', 'error');
      return;
    }

    let newDoc: ProfileDoc;
    if (isSelf) {
      try {
        const created = await addMyDocument({
          name,
          docType,
          contentBase64,
          url: contentBase64 ? undefined : 'novora://documents/pending',
        });
        newDoc = { ...mapDocumentRow(created), expiry: formattedExpiry };
        addToast(`Document "${name}" uploaded successfully.`, 'success');
      } catch (err) {
        addToast(err instanceof ApiError ? err.message : 'Could not save document.', 'error');
        return;
      }
    } else {
      newDoc = {
        id: createLocalId('doc'),
        name,
        type: docType,
        uploaded: formatUiDate(new Date()),
        expiry: formattedExpiry,
        url: `data:${selectedFile.type || 'application/octet-stream'};base64,${contentBase64}`,
      };
      addToast(`Document "${name}" added for this session only — it was not uploaded to the server.`, 'info');
    }

    setProfileData(prev => ({
      ...prev,
      documentsList: [...prev.documentsList, newDoc]
    }));

    setShowUploadModal(false);
    
    // Clear state
    setDocType('Contract');
    setDocCustomName('');
    setDocExpiryDate('');
    setHasExpiry(false);
    setSelectedFile(null);
  };

  const handleDownloadDoc = (doc: ProfileDoc) => {
    if (!doc.url || !/^(https?:|data:|\/)/i.test(doc.url)) {
      addToast(`No downloadable file is stored for "${doc.name}".`, 'info');
      return;
    }
    const link = document.createElement('a');
    link.href = doc.url;
    link.download = doc.name;
    link.target = '_blank';
    link.rel = 'noopener';
    link.click();
  };

  const handleDeleteDoc = async (doc: ProfileDoc) => {
    if (UUID_RE.test(doc.id)) {
      if (!isSelf) {
        addToast(`"${doc.name}" is stored on the server and can only be removed by the employee.`, 'error');
        return;
      }
      try {
        await deleteMyDocument(doc.id);
      } catch (err) {
        addToast(err instanceof ApiError ? err.message : 'Could not delete document.', 'error');
        return;
      }
      addToast(`Document "${doc.name}" deleted.`, 'info');
    } else {
      addToast(`Document "${doc.name}" removed.`, 'info');
    }
    setProfileData(prev => ({
      ...prev,
      documentsList: prev.documentsList.filter(item => item.id !== doc.id)
    }));
  };

  // Open modal to add family member
  const handleAddFamilyMember = () => {
    setEditingFamilyMember(null);
    setFamilyForm({
      name: '',
      relationship: '',
      dob: '',
      nric: '',
      taxExempt: false,
      passport: ''
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
      passport: member.passport || ''
    });
    setShowFamilyModal(true);
  };

  // Save family member changes
  const handleSaveFamilyMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyForm.name.trim()) {
      addToast('Name is required.', 'error');
      return;
    }
    if (!familyForm.relationship) {
      addToast('Please select a relationship.', 'error');
      return;
    }

    let updatedList;
    if (editingFamilyMember) {
      // Edit (local only — no update API)
      updatedList = profileData.familyMembers.map(item => 
        item.id === editingFamilyMember.id ? { ...item, ...familyForm, name: familyForm.name.trim() } : item
      );
      addToast(`Family member "${familyForm.name}" updated for this session only.`, 'info');
    } else if (isSelf) {
      try {
        const created = await createMyFamily({
          name: familyForm.name.trim(),
          relationship: familyForm.relationship,
          dateOfBirth: familyForm.dob || undefined,
        });
        const mapped = {
          ...mapFamilyRow(created),
          nric: familyForm.nric,
          taxExempt: familyForm.taxExempt,
          passport: familyForm.passport,
        };
        updatedList = [...profileData.familyMembers, mapped];
        addToast(`Family member "${familyForm.name}" added successfully.`, 'success');
      } catch (err) {
        addToast(err instanceof ApiError ? err.message : 'Could not add family member.', 'error');
        return;
      }
    } else {
      updatedList = [
        ...profileData.familyMembers,
        { id: createLocalId('fam'), ...familyForm, name: familyForm.name.trim() },
      ];
      addToast(`Family member "${familyForm.name}" added for this session only.`, 'info');
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
    addToast(`Family member "${name}" removed for this session only.`, 'info');
  };

  // Next of Kin operations
  const handleAddNok = () => {
    setEditingNok(null);
    setNokForm({
      name: '',
      relationship: '',
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
    if (!nokForm.relationship) {
      addToast('Please select a relationship.', 'error');
      return;
    }

    let updatedList;
    if (editingNok) {
      updatedList = profileData.nokList.map(item => 
        item.id === editingNok.id ? { ...item, ...nokForm, name: nokForm.name.trim() } : item
      );
      addToast(`Emergency contact "${nokForm.name}" updated for this session only.`, 'info');
    } else {
      const newNok = {
        id: createLocalId('nok'),
        ...nokForm,
        name: nokForm.name.trim()
      };
      updatedList = [...profileData.nokList, newNok];
      addToast(`Emergency contact "${nokForm.name}" added for this session only.`, 'info');
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
    addToast(`Emergency contact "${name}" removed for this session only.`, 'info');
  };

  // Biometric actions
  const handleAddBiometricDevice = () => {
    setEditingBiometricDevice(null);
    setBiometricForm({
      taNumber: '',
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
      addToast(`Device "${biometricForm.terminalName}" updated for this session only.`, 'info');
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
      addToast(`Device "${biometricForm.terminalName}" added for this session only.`, 'info');
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
    addToast(`Device "${terminalName}" removed for this session only.`, 'info');
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
      addToast(`Allowance "${allowanceForm.type}" updated for this session only.`, 'info');
    } else {
      const newAllow = {
        ...allowanceForm,
        type: allowanceForm.type.trim()
      };
      updatedList = [...profileData.allowances, newAllow];
      addToast(`Allowance "${allowanceForm.type}" added for this session only.`, 'info');
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
    addToast(`Allowance "${type}" removed for this session only.`, 'info');
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
      addToast(`Deduction "${deductionForm.type}" updated for this session only.`, 'info');
    } else {
      const newDed = {
        ...deductionForm,
        type: deductionForm.type.trim()
      };
      updatedList = [...profileData.deductions, newDed];
      addToast(`Deduction "${deductionForm.type}" added for this session only.`, 'info');
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
    addToast(`Deduction "${type}" removed for this session only.`, 'info');
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
      addToast(`Career entry at "${careerForm.company}" updated for this session only.`, 'info');
    } else {
      const newCareer = {
        ...careerForm,
        company: careerForm.company.trim(),
        position: careerForm.position.trim()
      };
      updatedList = [...profileData.careerHistory, newCareer];
      addToast(`Career entry at "${careerForm.company}" added for this session only.`, 'info');
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
    addToast(`Career entry at "${company}" removed for this session only.`, 'info');
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

  const handleSaveEducation = async (e: React.FormEvent) => {
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
      addToast(`Education at "${educationForm.institution}" updated for this session only.`, 'info');
    } else if (!isSelf) {
      updatedList = [
        ...profileData.educationList,
        {
          ...educationForm,
          institution: educationForm.institution.trim(),
          qualification: educationForm.qualification.trim(),
          fieldOfStudy: educationForm.fieldOfStudy.trim(),
          year: educationForm.year.trim(),
          grade: educationForm.grade.trim(),
        },
      ];
      addToast(`Education at "${educationForm.institution}" added for this session only.`, 'info');
    } else {
      const yearNum = educationForm.year.trim() ? parseInt(educationForm.year.trim(), 10) : undefined;
      try {
        const created = await createMyEducation({
          institution: educationForm.institution.trim(),
          degree: educationForm.qualification.trim(),
          fieldOfStudy: educationForm.fieldOfStudy.trim() || undefined,
          endYear: yearNum && !Number.isNaN(yearNum) ? yearNum : undefined,
        });
        const mapped = {
          ...mapEducationRow(created),
          qualification: educationForm.qualification.trim() || mapEducationRow(created).qualification,
          fieldOfStudy: educationForm.fieldOfStudy.trim() || mapEducationRow(created).fieldOfStudy,
          year: educationForm.year.trim() || mapEducationRow(created).year,
          grade: educationForm.grade.trim() || mapEducationRow(created).grade,
        };
        updatedList = [...profileData.educationList, mapped];
        addToast(`Education at "${educationForm.institution}" added successfully.`, 'success');
      } catch (err) {
        addToast(err instanceof ApiError ? err.message : 'Could not add education.', 'error');
        return;
      }
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
    addToast(`Education at "${institution}" removed for this session only.`, 'info');
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
            className="px-3.5 py-1.5 text-[11px] font-bold text-rose-500 hover:text-rose-600 bg-white border border-rose-200/60 hover:bg-rose-50/50 rounded-xl transition-all cursor-pointer shadow-xs"
          >
            Delete Employee
          </button>
          
          <button 
            id="profile-pwd-reset"
            onClick={handleResetPassword}
            className="px-3.5 py-1.5 text-[11px] font-bold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all cursor-pointer shadow-xs"
          >
            Reset Password
          </button>
        </div>
      </div>

      {/* 2. EMPLOYEE SUMMARY TOP CARD (Tenure, Pay Grade, etc.) */}
      <div id="profile-summary-header-card" className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
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
                <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 whitespace-nowrap shrink-0 border ${
                  employee.status === 'Active'
                    ? 'bg-emerald-50 text-[#059669] border-emerald-100/30'
                    : employee.status === 'On Leave'
                      ? 'bg-amber-50 text-amber-700 border-amber-100'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full items-center shrink-0 ${
                    employee.status === 'Active' ? 'bg-emerald-500 animate-pulse' : employee.status === 'On Leave' ? 'bg-amber-500' : 'bg-slate-400'
                  }`} />
                  {employee.status || 'Active'}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-mono text-slate-500 font-semibold">
                  <Shield className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  {employee.id}
                </span>
                {employee.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" strokeWidth={2.2} />
                    {employee.email}
                  </span>
                )}
              </div>

              <div className="text-[11.5px] font-semibold text-slate-400">
                {employee.department} &middot; {employee.position}
                {managerName && <span className="ml-2 pl-2 border-l border-slate-200">Reports to: <b>{managerName}</b></span>}
              </div>
            </div>
          </div>

          {/* Stat summary grid with thin vertical separators */}
          <div className="grid grid-cols-4 gap-4 xl:w-fit xl:gap-8 bg-slate-50/50 p-4.5 rounded-2xl border border-slate-100/50">
            <div className="text-center px-2">
              <span className="text-[15px] font-black text-slate-800 block">{formatTenure(employee.joinDate)}</span>
              <span className="text-[9.5px] text-slate-400 font-extrabold uppercase tracking-wide block mt-0.5">Tenure</span>
            </div>
            <div className="text-center px-4 border-l border-slate-200/80">
              <span className="text-[15px] font-black text-slate-800 block">{profileData.jobGrade || '—'}</span>
              <span className="text-[9.5px] text-slate-400 font-extrabold uppercase tracking-wide block mt-0.5">Pay Grade</span>
            </div>
            <div className="text-center px-4 border-l border-slate-200/80">
              <span className="text-[15px] font-black text-slate-800 block">—</span>
              <span className="text-[9.5px] text-slate-400 font-extrabold uppercase tracking-wide block mt-0.5">Leave Left</span>
            </div>
            <div className="text-center px-2 border-l border-slate-200/80">
              <span className="text-[15px] font-black text-slate-800 block">—</span>
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
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Employment details</h3>
                      {!isEditingSummary ? (
                        <button 
                          onClick={() => setIsEditingSummary(true)}
                          aria-label="Edit summary"
                          className="text-[10px] font-black text-novora hover:bg-blue-50/50 hover:underline px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => { 
                            setIsEditingSummary(false); 
                            triggerAutoSave(profileData.jobType); 
                            addToast('Employment details updated for this session only.', 'info');
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
                            value={profileData.company || companyName} 
                            onChange={(e) => { setProfileData({...profileData, company: e.target.value}); setIsStateModified(true); }}
                            className="bg-slate-50 border border-slate-200 focus:outline-none focus:border-novora px-2 py-0.5 rounded text-xs w-48 text-right font-bold"
                          />
                        ) : (
                          <span className="text-slate-800 font-bold">{profileData.company || companyName || '—'}</span>
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
                        <SelectMenu
                            value={profileData.jobType}
                            onChange={(v) => { setProfileData({...profileData, jobType: v as EmploymentStatus}); setIsStateModified(true); }}
                            triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                            options={[
                              { value: 'Permanent', label: 'Permanent' },
                              { value: 'Contract', label: 'Contract' },
                              { value: 'Intern', label: 'Intern' },
                              { value: 'Part-time', label: 'Part-time' },
                            ]}
                          />
                        ) : (
                          <span className="text-slate-800 font-bold">{profileData.jobType}</span>
                        )}
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-50/70 items-center">
                        <span className="text-slate-400 font-medium">Employment status</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide border inline-flex items-center whitespace-nowrap shrink-0 ${
                          employee.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : employee.status === 'On Leave'
                              ? 'bg-amber-50 text-amber-700 border-amber-100'
                              : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          {employee.status || '—'}
                        </span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-50/70">
                        <span className="text-slate-400 font-medium">Join date</span>
                        <span className="text-slate-800 font-bold">{realValue(employee.joinDate) || '—'}</span>
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
                          <span className="text-slate-800 font-bold">{profileData.positionStartDate || '—'}</span>
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
                          <span className="text-slate-800 font-bold">{profileData.jobGrade || '—'}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Leave balance */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-3">Leave balance</h3>
                    
                    <p className="py-6 text-center text-slate-400 font-bold text-[11px]">
                      No leave balance recorded yet.
                    </p>
                  </div>

                </div>

                {/* Performance & HR Notes Column */}
                <div className="lg:col-span-6 space-y-6">
                  
                  {/* Card 1: Performance overview */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-3">Performance overview</h3>
                    
                    <p className="py-6 text-center text-slate-400 font-bold text-[11px]">
                      No performance appraisals recorded yet.
                    </p>
                  </div>

                  {/* Card 2: HR Notes */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">HR notes</h3>
                      {!isEditingHRNotes ? (
                        <button 
                          onClick={() => setIsEditingHRNotes(true)}
                          aria-label="Edit HR notes"
                          className="text-[10px] font-black text-novora hover:bg-blue-50/50 hover:underline px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => { 
                            setIsEditingHRNotes(false); 
                            addToast('HR notes updated for this session only.', 'info');
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
                          placeholder="Add notes about this employee"
                          onChange={(e) => { setProfileData({...profileData, hrNotes: e.target.value}); setIsStateModified(true); }}
                          className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-novora p-2 rounded text-xs font-bold text-slate-800"
                        />
                      ) : (
                        <p className={`leading-relaxed bg-slate-50/60 p-3 rounded-2xl border border-slate-100/50 ${profileData.hrNotes ? 'text-slate-600' : 'text-slate-400'}`}>
                          {profileData.hrNotes || 'No HR notes recorded yet.'}
                        </p>
                      )}

                      <div className="flex justify-between py-1 border-b border-slate-50/70 items-center">
                        <span className="text-slate-400">Blacklisted</span>
                        {isEditingHRNotes ? (
                        <SelectMenu
                            value={profileData.blacklisted}
                            onChange={(v) => { setProfileData({...profileData, blacklisted: v}); setIsStateModified(true); }}
                            placeholder="Select…"
                            triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                            options={[
                              { value: 'No', label: 'No' },
                              { value: 'Yes', label: 'Yes' },
                            ]}
                          />
                        ) : (
                          <span className={profileData.blacklisted === 'Yes' ? 'text-rose-600 font-black' : 'text-slate-800 font-bold'}>{profileData.blacklisted || '—'}</span>
                        )}
                      </div>

                      <div className="flex justify-between py-1 items-center">
                        <span className="text-slate-400">Auto clock-in</span>
                        {isEditingHRNotes ? (
                        <SelectMenu
                            value={profileData.autoClockIn}
                            onChange={(v) => { setProfileData({...profileData, autoClockIn: v}); setIsStateModified(true); }}
                            triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                            options={[
                              { value: 'Disabled', label: 'Disabled' },
                              { value: 'Enabled', label: 'Enabled' },
                            ]}
                          />
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
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Personal information</h3>
                    {!isEditingPersonal ? (
                      <button 
                        onClick={() => setIsEditingPersonal(true)}
                        aria-label="Edit personal details"
                        className="text-[10px] font-black text-novora hover:bg-blue-50/50 hover:underline px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => { 
                          setIsEditingPersonal(false); 
                          triggerAutoSave(undefined, profileData.mobileNo); 
                          addToast('Personal details updated for this session only.', 'info');
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
                      { key: 'nric', label: 'NRIC / ID No.', value: profileData.nric },
                      { key: 'email', label: 'Work email', value: employee.email, editable: false },
                      { key: 'personalEmail', label: 'Personal email', value: profileData.personalEmail },
                      { key: 'mobileNo', label: 'Mobile no.', value: profileData.mobileNo },
                    ].map((field) => (
                      <div key={field.key} className="flex flex-col gap-1 pb-2 border-b border-slate-50">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">{field.label}</span>
                        {isEditingPersonal && field.editable !== false ? (
                          <input 
                            type="text" 
                            value={(profileData as any)[field.key]} 
                            onChange={(e) => { setProfileData({...profileData, [field.key]: e.target.value}); setIsStateModified(true); }}
                            className="bg-slate-50 border border-slate-200 focus:outline-none focus:border-novora px-2 py-1 rounded text-xs font-bold text-slate-800"
                          />
                        ) : (
                          <span className="text-slate-800 font-bold block pt-0.5">{field.value || '—'}</span>
                        )}
                      </div>
                    ))}

                    {([
                      {
                        key: 'gender' as const,
                        label: 'Gender',
                        options: [
                          { value: '', label: 'Select…' },
                          { value: 'Female', label: 'Female' },
                          { value: 'Male', label: 'Male' },
                          { value: 'Other', label: 'Other' },
                        ],
                      },
                      {
                        key: 'maritalStatus' as const,
                        label: 'Marital status',
                        options: [
                          { value: '', label: 'Select…' },
                          { value: 'Single', label: 'Single' },
                          { value: 'Married', label: 'Married' },
                          { value: 'Divorced', label: 'Divorced' },
                          { value: 'Widowed', label: 'Widowed' },
                        ],
                      },
                      {
                        key: 'nationality' as const,
                        label: 'Nationality',
                        options: [
                          { value: '', label: 'Select…' },
                          { value: 'Singaporean', label: 'Singaporean' },
                          { value: 'Indonesian', label: 'Indonesian' },
                          { value: 'Other', label: 'Other' },
                        ],
                      },
                      {
                        key: 'race' as const,
                        label: 'Race',
                        options: [
                          { value: '', label: 'Select…' },
                          { value: 'Chinese', label: 'Chinese' },
                          { value: 'Malay', label: 'Malay' },
                          { value: 'Indian', label: 'Indian' },
                          { value: 'Other', label: 'Other' },
                        ],
                      },
                      {
                        key: 'religion' as const,
                        label: 'Religion',
                        options: [
                          { value: '', label: 'Select…' },
                          { value: 'Buddhism', label: 'Buddhism' },
                          { value: 'Islam', label: 'Islam' },
                          { value: 'Christianity', label: 'Christianity' },
                          { value: 'Hinduism', label: 'Hinduism' },
                          { value: 'No Religion', label: 'No Religion / Other' },
                        ],
                      },
                    ]).map((field) => (
                      <div key={field.key} className="flex flex-col gap-1 pb-2 border-b border-slate-50">
                        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">{field.label}</span>
                        {isEditingPersonal ? (
                          <SelectMenu
                            value={String(profileData[field.key] ?? '')}
                            onChange={(v) => {
                              setProfileData({ ...profileData, [field.key]: v })
                              setIsStateModified(true)
                            }}
                            placeholder="Select…"
                            triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                            options={field.options}
                          />
                        ) : (
                          <span className="text-slate-800 font-bold block pt-0.5">{profileData[field.key] || '—'}</span>
                        )}
                      </div>
                    ))}

                  </div>
                </div>

                {/* Passport details */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
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
                            <span className="text-slate-800 font-bold block pt-0.5">{field.value || '—'}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Current Address */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Current address</h3>
                    {!isEditingAddress ? (
                      <button
                        type="button"
                        onClick={() => setIsEditingAddress(true)}
                        aria-label="Edit address"
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
                          addToast('Address updated for this session only.', 'info');
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
                          <span className="text-slate-800 font-bold block pt-0.5">{field.value || '—'}</span>
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
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <div className="space-y-0.5">
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Family members</h3>
                      <p className="text-[10px] text-slate-400">Manage dependents, spouses, children and tax status details</p>
                      {realValue(employee.dependents) && (
                        <p className="text-[10px] text-slate-500 font-bold">Dependents on record: {realValue(employee.dependents)}</p>
                      )}
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
                              No family members recorded yet.
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
                                {fam.passport || '—'}
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
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
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
                              No emergency contacts recorded yet.
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
                                  {nok.relationship || '—'}
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
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
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
                                No biometric devices registered yet.
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
                  {!profileData.biometricsEnabled && (
                    <p className="py-6 text-center text-slate-400 font-bold text-[11px]">
                      Biometric access is not enabled for this employee.
                    </p>
                  )}
                </div>

                {/* 2. Attendance Settings Controls Card */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
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
                        <span className="text-slate-800 font-black block text-[12px]">{profileData.assignedShift || '—'}</span>
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
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Base pay rate</h3>
                    {!isEditingPayRate ? (
                      <button 
                        onClick={() => setIsEditingPayRate(true)}
                        aria-label="Edit pay rate"
                        className="text-[10px] font-black text-novora hover:bg-blue-50/50 hover:underline px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => { 
                          setIsEditingPayRate(false); 
                          addToast('Pay rate updated for this session only.', 'info');
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
                      <span className="text-slate-800 font-bold block pt-0.5">{profileData.jobGrade || '—'}</span>
                    </div>

                    <div className="flex flex-col gap-1 pb-2 border-b border-slate-50">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Pay type</span>
                      <span className="text-slate-800 font-bold block pt-0.5">{profileData.payType || '—'}</span>
                    </div>

                    <div className="flex flex-col gap-1 pb-2 border-b border-slate-50">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Currency</span>
                      <span className="text-slate-800 font-bold block pt-0.5">{currency}</span>
                    </div>

                    <div className="flex flex-col gap-1 pb-2 border-b border-slate-50">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Basic salary</span>
                      {isEditingPayRate ? (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs font-bold text-slate-500">{currency}</span>
                          <input 
                            type="number" 
                            value={profileData.basicSalary} 
                            onChange={(e) => { setProfileData({...profileData, basicSalary: parseFloat(e.target.value) || 0}); setIsStateModified(true); }}
                            className="bg-slate-50 border border-slate-200 p-1 rounded text-xs text-slate-800 font-bold max-w-36 focus:outline-none"
                          />
                        </div>
                      ) : (
                        <span className="text-[#2F66E0] font-black block text-[13.5px] pt-0.5">{profileData.basicSalary > 0 ? money(profileData.basicSalary) : '—'}</span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 pb-2 border-b border-slate-50">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Effective date</span>
                      <span className="text-slate-800 font-bold block pt-0.5">{profileData.payEffectiveDate || '—'}</span>
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
                        <span className="font-mono text-slate-800 font-bold block pt-0.5">{profileData.bankAccount || '—'}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Allowances */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
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
                          <th className="pb-3 text-left">Amount ({currency})</th>
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
                              No allowances recorded yet.
                            </td>
                          </tr>
                        ) : (
                          profileData.allowances.map((allow, idx) => (
                            <tr key={allow.id || idx} className="hover:bg-slate-50/20">
                              <td className="py-3.5 font-bold text-slate-800">{allow.type}</td>
                              <td className="py-3.5 font-mono font-bold text-novora">
                                {money(allow.amount)}
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
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
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
                          <th className="pb-3 text-left">Amount ({currency})</th>
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
                              No deductions recorded yet.
                            </td>
                          </tr>
                        ) : (
                          profileData.deductions.map((ded, idx) => (
                            <tr key={ded.id || idx} className="hover:bg-slate-50/20">
                              <td className="py-3.5 font-bold text-slate-800">{ded.type}</td>
                              <td className="py-3.5 font-mono font-bold text-rose-600">
                                {money(ded.amount)}
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
                      {money(estimatedNetPay)}
                    </span>
                  </div>
                </div>

              </div>
            )}

            {/* SUBTAB 6: Career Tab */}
            {activeTab === 'Career' && (
              <div id="subtab-career-content" className="space-y-6">
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
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
                              No career history recorded yet.
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
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
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
                              No education records yet.
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
                                  {edu.grade || '—'}
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
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
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
                        <p className="text-xs font-black text-slate-700">No documents uploaded yet.</p>
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
                                    onClick={() => void handleDeleteDoc(doc)}
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
          <div className="bg-white border border-slate-100 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
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
          <div className="bg-white border border-slate-100 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
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
          <div className="bg-white border border-slate-100 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
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
                  <SelectMenu
                    value={docType}
                    onChange={setDocType}
                    triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                    options={[
                      { value: 'Contract', label: 'Contract / Offer' },
                      { value: 'NRIC', label: 'NRIC / National ID' },
                      { value: 'Passport', label: 'Passport' },
                      { value: 'Certificate', label: 'Certificate / Degree' },
                      { value: 'Tax', label: 'Government Tax' },
                      { value: 'Payslip', label: 'Payslip' },
                      { value: 'Medical', label: 'Medical Form' },
                      { value: 'Other', label: 'Other Document' },
                    ]}
                  />
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
                  <SelectMenu
                    value={familyForm.relationship}
                    onChange={(v) => setFamilyForm({...familyForm, relationship: v})}
                    placeholder="Select…"
                    triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                    options={[
                      { value: '', label: 'Select…' },
                      { value: 'Spouse', label: 'Spouse' },
                      { value: 'Child', label: 'Child' },
                      { value: 'Mother', label: 'Mother' },
                      { value: 'Father', label: 'Father' },
                    ]}
                  />
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
                  <SelectMenu
                    value={nokForm.relationship}
                    onChange={(v) => setNokForm({...nokForm, relationship: v})}
                    placeholder="Select…"
                    triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                    options={[
                      { value: '', label: 'Select…' },
                      { value: 'Spouse', label: 'Spouse' },
                      { value: 'Mother', label: 'Mother' },
                      { value: 'Father', label: 'Father' },
                      { value: 'Brother', label: 'Brother' },
                      { value: 'Sister', label: 'Sister' },
                      { value: 'Child', label: 'Child' },
                      { value: 'Other', label: 'Other' },
                    ]}
                  />
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
                  <SelectMenu
                    value={biometricForm.deviceType}
                    onChange={(v) => setBiometricForm({...biometricForm, deviceType: v})}
                    triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                    options={[
                      { value: 'Face ID', label: 'Face ID' },
                      { value: 'Fingerprint', label: 'Fingerprint' },
                      { value: 'RFID Card', label: 'RFID Card' },
                      { value: 'Iris Scanner', label: 'Iris Scanner' },
                    ]}
                  />
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
                  <SelectMenu
                    value={biometricForm.status}
                    onChange={(v) => setBiometricForm({...biometricForm, status: v as any})}
                    triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                    options={[
                      { value: 'Active', label: 'Active' },
                      { value: 'Inactive', label: 'Inactive' },
                    ]}
                  />
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
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-6 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
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
                  <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Amount ({currency}) *</label>
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
                  <SelectMenu
                    value={allowanceForm.frequency}
                    onChange={(v) => setAllowanceForm({...allowanceForm, frequency: v})}
                    triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                    options={[
                      { value: 'Monthly', label: 'Monthly' },
                      { value: 'Weekly', label: 'Weekly' },
                      { value: 'One-off', label: 'One-off' },
                      { value: 'Annually', label: 'Annually' },
                    ]}
                  />
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
                  <SelectMenu
                    value={allowanceForm.status}
                    onChange={(v) => setAllowanceForm({...allowanceForm, status: v as any})}
                    triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                    options={[
                      { value: 'Active', label: 'Active' },
                      { value: 'Inactive', label: 'Inactive' },
                    ]}
                  />
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
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-6 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
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
                  <label className="text-[10.5px] font-black text-slate-700 uppercase tracking-wider block">Amount ({currency}) *</label>
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
                  <SelectMenu
                    value={deductionForm.frequency}
                    onChange={(v) => setDeductionForm({...deductionForm, frequency: v})}
                    triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                    options={[
                      { value: 'Monthly', label: 'Monthly' },
                      { value: 'Weekly', label: 'Weekly' },
                      { value: 'One-off', label: 'One-off' },
                      { value: 'Annually', label: 'Annually' },
                    ]}
                  />
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
                  <SelectMenu
                    value={deductionForm.status}
                    onChange={(v) => setDeductionForm({...deductionForm, status: v as any})}
                    triggerClassName="text-xs font-bold bg-slate-50 border-slate-200"
                    options={[
                      { value: 'Active', label: 'Active' },
                      { value: 'Inactive', label: 'Inactive' },
                    ]}
                  />
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
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-6 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
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
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-6 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
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
        const nricNo = profileData.nric || '—'
        const passportNo = profileData.passportNo || '—'
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
                    onClick={() => window.print()}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-slate-100 rounded-lg cursor-pointer transition-colors"
                    title="Print"
                  >
                    <Printer className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadDoc(previewingDoc)}
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
                            value: profileData.basicSalary > 0
                              ? money(profileData.basicSalary)
                              : '',
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
                        Benefits include health coverage, annual leave per company policy,
                        and statutory CPF contributions (and SDL where applicable). Payroll is credited to{' '}
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
                                    value: (profileData.nationality || '—').toUpperCase(),
                                  },
                                  {
                                    label: 'Authority',
                                    value: (profileData.passportCountry || '—').toUpperCase(),
                                  },
                                  {
                                    label: 'Date of birth',
                                    value: (profileData.dob || '—').toUpperCase(),
                                  },
                                  {
                                    label: 'Date of expiration',
                                    value: String(expiryDate || '—').toUpperCase(),
                                  },
                                  { label: 'Place of birth', value: '—' },
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
                                  <p className="text-[11px] font-black uppercase text-black">—</p>
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

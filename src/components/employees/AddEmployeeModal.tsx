import { Fragment, useEffect, useState } from 'react'
import { motion } from 'motion/react'
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  Plus,
  ChevronLeft,
  X,
} from 'lucide-react'
import type { Department, EmploymentStatus, ModuleEmployee } from '../../types/moduleEmployee'
import { showActionToast } from '../../utils/actionToast'
import { nextSeq } from '../../utils/nextSeq';

type AddEmployeeModalProps = {
  onClose: () => void
  onAddEmployee: (emp: ModuleEmployee) => void
}

type BiometricTerminalRow = {
  id: string
  taNumber: string
  terminal: string
}

export function AddEmployeeModal({ onClose, onAddEmployee }: AddEmployeeModalProps) {
  // Current creation wizard step
  const [step, setStep] = useState<number>(1)

  // --- WIZARD FORM STATE ---

  // Step 1: Organization & Details
  const [activeEmployee, setActiveEmployee] = useState(true)
  const [autoClockIn, setAutoClockIn] = useState(false)
  const [ignoreRotaDeduction, setIgnoreRotaDeduction] = useState(false)
  const [ignoreMissingSwipe, setIgnoreMissingSwipe] = useState(false)

  const [employeeNo, setEmployeeNo] = useState('EMP-0285')
  const [employmentStatus, setEmploymentStatus] = useState('Permanent')
  const [company, setCompany] = useState('Novora')
  const [location, setLocation] = useState('Kuala Lumpur HQ')
  const [branch, setBranch] = useState('Main Branch')
  const [department, setDepartment] = useState('Engineering')
  const [section, setSection] = useState('Tech Division')
  const [position, setPosition] = useState('Senior Developer')

  const [jobType, setJobType] = useState('Full-time')
  const [typeOfAppointment, setTypeOfAppointment] = useState('Confirmed')
  const [jobGrade, setJobGrade] = useState('G-7')
  const [joinDate, setJoinDate] = useState('2026-06-17')
  const [positionStartDate, setPositionStartDate] = useState('2026-06-17')
  const [reportsTo, setReportsTo] = useState('EMP-0010') // David Ng default manager
  const [employersNote, setEmployersNote] = useState('')
  const [remarks, setRemarks] = useState('')

  // Step 2: Personal Information
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [nric, setNric] = useState('')
  const [dob, setDob] = useState('1991-03-14')
  const [gender, setGender] = useState('Female')
  const [maritalStatus, setMaritalStatus] = useState('Married')
  const [nationality, setNationality] = useState('Malaysian')
  const [race, setRace] = useState('Chinese')
  const [religion, setReligion] = useState('Buddhism')
  const [personalEmail, setPersonalEmail] = useState('')
  const [mobileNo, setMobileNo] = useState('')
  const [workEmail, setWorkEmail] = useState('')

  // Passport info
  const [passportEnabled, setPassportEnabled] = useState(false)
  const [passportNo, setPassportNo] = useState('')
  const [passportCountry, setPassportCountry] = useState('Malaysia')
  const [passportIssueDate, setPassportIssueDate] = useState('')
  const [passportExpiryDate, setPassportExpiryDate] = useState('')

  // Address info
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('Shah Alam')
  const [state, setState] = useState('Selangor')
  const [postcode, setPostcode] = useState('40170')
  const [country, setCountry] = useState('Malaysia')
  const [permanentSameAsCurrent, setPermanentSameAsCurrent] = useState(true)

  // Step 3: Off duty day configuration (Full and Half days)
  const [fullDaysOff, setFullDaysOff] = useState<string[]>(['Mon', 'Sat'])
  const [halfDaysOff, setHalfDaysOff] = useState<string[]>(['Fri'])

  // Step 4: Biometric devices registration
  const [biometricEnabled, setBiometricEnabled] = useState(true)
  const [terminalsList, setTerminalsList] = useState<BiometricTerminalRow[]>([
    { id: '1', taNumber: 'TA-00451', terminal: 'Main Lobby — Terminal 1' },
  ])

  // Generate employee number when wizard mounts
  useEffect(() => {
    setStep(1)
    const randNum = Math.floor(100 + Math.random() * 900)
    setEmployeeNo(`EMP-0${randNum}`)
  }, [])

  // Header Auto Generate handler
  const handleAutoGenerateId = () => {
    const randNum = Math.floor(100 + Math.random() * 900)
    setEmployeeNo(`EMP-0${randNum}`)
    showActionToast('New Employee number generated.')
  }

  // Day toggle utility for Column 3 (Off duty days)
  const handleDayOffToggle = (day: string, type: 'full' | 'half') => {
    if (type === 'full') {
      if (fullDaysOff.includes(day)) {
        // Clear it
        setFullDaysOff(fullDaysOff.filter(d => d !== day));
      } else {
        // Check full, remove from half
        setFullDaysOff([...fullDaysOff, day]);
        setHalfDaysOff(halfDaysOff.filter(d => d !== day));
      }
    } else {
      if (halfDaysOff.includes(day)) {
        setHalfDaysOff(halfDaysOff.filter(d => d !== day));
      } else {
        // Check half, remove from full
        setHalfDaysOff([...halfDaysOff, day]);
        setFullDaysOff(fullDaysOff.filter(d => d !== day));
      }
    }
  };

  // Terminal Row Adders
  const handleAddTerminal = () => {
    const seq = nextSeq(terminalsList.map(t => t.id));
    setTerminalsList([
      ...terminalsList,
      { id: String(seq), taNumber: `TA-00${450 + seq}`, terminal: 'Level 3 — Terminal 2' }
    ]);
  };

  const handleDeleteTerminal = (id: string) => {
    setTerminalsList(terminalsList.filter(t => t.id !== id));
  };

  // Step 5 Submit handler
  const handleFinalSubmit = () => {
    const computedName = `${firstName || 'New'} ${lastName || 'Employee'}`.trim()

    if (!firstName && !lastName) {
      showActionToast('Please enter employee name in the Personal step.')
      setStep(2)
      return
    }

    const formatDateString = (dt: string) => {
      try {
        const parsed = new Date(dt)
        if (Number.isNaN(parsed.getTime())) return '17 Jun 2026'
        return parsed.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      } catch {
        return '17 Jun 2026'
      }
    }

    const emailFallback = `${computedName.toLowerCase().replace(/\s+/g, '.')}@novora.com`
    const code = employeeNo || `EMP-0${Math.floor(100 + Math.random() * 900)}`
    const colors = [
      'bg-indigo-600 text-white',
      'bg-blue-600 text-white',
      'bg-emerald-600 text-white',
      'bg-purple-600 text-white',
      'bg-rose-600 text-white',
      'bg-amber-600 text-white',
      'bg-teal-600 text-white',
    ]
    const dept = (department || 'Engineering') as Department
    const empStatus = (employmentStatus || 'Permanent') as EmploymentStatus

    const newEmpRecord: ModuleEmployee = {
      id: code,
      name: computedName,
      department: ['Engineering', 'Finance', 'HR', 'Marketing', 'Operations'].includes(dept)
        ? dept
        : 'Engineering',
      position: position || 'Software Engineer',
      employmentStatus: ['Permanent', 'Contract', 'Intern', 'Part-time'].includes(empStatus)
        ? empStatus
        : 'Permanent',
      status: activeEmployee ? 'Active' : 'Inactive',
      joinDate: formatDateString(joinDate),
      nric: nric || '—',
      mobile: mobileNo || '—',
      email: workEmail || emailFallback,
      address: addressLine1
        ? `${addressLine1}${addressLine2 ? `, ${addressLine2}` : ''}, ${city}, ${state}`
        : `${city}, ${state}`,
      avatarColor: colors[Math.floor(Math.random() * colors.length)],
      dependents: '—',
      emergencyContact: '—',
      reportsTo: reportsTo || undefined,
    }

    onAddEmployee(newEmpRecord)
    showActionToast(`Successfully created registry record for ${computedName}!`)
    onClose()
  }

  // Initials calculation for step 5 review avatar
  const getReviewInitials = () => {
    if (firstName || lastName) {
      return `${firstName ? firstName[0] : ''}${lastName ? lastName[0] : ''}`.toUpperCase().slice(0, 2);
    }
    return 'NE';
  };

  // Step titles & explanations
  const stepLabel = (s: number) => {
    switch (s) {
      case 1: return 'Organisation & employment details';
      case 2: return 'Personal & address information';
      case 3: return 'Off duty day configuration';
      case 4: return 'Biometric device registration';
      case 5: return 'Review before saving';
      default: return '';
    }
  };

  const systemTips = [
    // Step 1
    [
      'Employee No. can be auto-generated via Settings.',
      'Employment Status, Department and Position must be set up in Settings first.',
      'Tick "Active" to mark the employee as currently working.'
    ],
    // Step 2
    [
      'Nationality and Religion dropdowns are configured in Settings.',
      'Passport section is optional — enable it with the checkbox.',
      'Tick "same address" if current and permanent addresses match.'
    ],
    // Step 3
    [
      'Select days the employee does not work.',
      'Full day off means no attendance required.',
      'Half day applies to mornings or afternoons based on shift.'
    ],
    // Step 4
    [
      'The TA Number must match the number enrolled on the physical biometric device.',
      'Multiple terminals can be added with the + button.',
      'Enable auto clock-in to skip manual swipes.'
    ],
    // Step 5
    [
      'Check all sections before saving.',
      'You can go back to any step to make changes.',
      'Once saved the employee record goes live immediately.'
    ]
  ];

  const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div id="full-page-employee-creation-portal" className="fixed inset-0 z-50 overflow-y-auto bg-[#f8f9fa] flex flex-col min-h-screen text-slate-800">
      
      {/* 1. COMPACT TOP STATUS CONTROL ROW */}
      <header id="creation-header-ribbon" className="bg-white border-b border-slate-200/70 h-16 px-8 flex items-center justify-between sticky top-0 z-10 shrink-0">
        <button 
          id="creation-back-directory-link"
          onClick={onClose}
          className="flex items-center gap-1.5 text-xs font-black text-slate-600 hover:text-slate-900 transition-colors bg-slate-50 border border-slate-100 hover:bg-slate-100 px-3 py-1.5 rounded-xl cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" />
          <span>Employee Directory</span>
        </button>

        <div className="flex items-center gap-3">
          <button 
            id="creation-draft-btn"
            onClick={() => {
              showActionToast('Progress saved to offline workspace draft.')
              onClose()
            }}
            className="px-4.5 py-2 text-xs font-black text-slate-700 bg-white border border-slate-200/80 hover:bg-slate-50 rounded-xl transition-all shadow-xs"
          >
            Save as draft
          </button>
          
          <button 
            id="creation-cancel-btn"
            onClick={onClose}
            className="px-4.5 py-2 text-xs font-black text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-800 rounded-xl transition-all shadow-xs"
          >
            Cancel
          </button>

          <button 
            id="creation-opts-dots"
            onClick={() => showActionToast('Wizard templates are currently locked.')}
            className="h-9 w-9 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
          >
            <span className="text-xl font-bold font-mono tracking-tighter leading-none -mt-1">&bull;&bull;&bull;</span>
          </button>
        </div>
      </header>

      {/* 2. FIVE STEP VISUAL HORIZONTAL TRACK */}
      <section id="wizard-steps-track" className="bg-white border-b border-slate-100 py-5.5 px-8 sticky top-16 z-10 shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {[1, 2, 3, 4, 5].map((sIndex) => {
            const isCompleted = step > sIndex;
            const isActive = step === sIndex;
            
            let labelText = '';
            if (sIndex === 1) labelText = 'Details';
            if (sIndex === 2) labelText = 'Personal';
            if (sIndex === 3) labelText = 'Off duty';
            if (sIndex === 4) labelText = 'Biometric';
            if (sIndex === 5) labelText = 'Review';

            return (
              <Fragment key={sIndex}>
                <div 
                  onClick={() => setStep(sIndex)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted 
                      ? 'bg-[#2f66e0] text-white' 
                      : isActive 
                        ? 'border-2 border-[#2f66e0] text-[#2f66e0] bg-blue-50/50' 
                        : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                  }`}>
                    {isCompleted ? <Check className="h-4.5 w-4.5" strokeWidth={3} /> : sIndex}
                  </div>
                  <span className={`text-xs font-bold transition-colors ${
                    isActive ? 'text-[#2f66e0] font-black' : isCompleted ? 'text-slate-700 font-bold' : 'text-slate-400 group-hover:text-slate-600'
                  }`}>
                    {labelText}
                  </span>
                </div>

                {sIndex < 5 && (
                  <div className={`flex-1 h-0.5 mx-4 transition-all ${step > sIndex ? 'bg-[#2f66e0]' : 'bg-slate-100'}`} />
                )}
              </Fragment>
            );
          })}
        </div>
      </section>

      {/* 3. CORE SUBSTAGE PANEL split with left/right column structure */}
      <section id="wizard-viewport-split" className="flex-1 max-w-6xl w-full mx-auto px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Input Panel forms based on active step */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* STEP 1 WORKSPACE: ORGANISATION & CHRONOLOGY */}
          {step === 1 && (
            <div id="form-step-1" className="space-y-6 animate-in fade-in duration-300">
              
              {/* Card 1: Avatar Upload & Checklist Config */}
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6.5 shadow-xs space-y-5">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Profile photo &amp; options</h3>
                
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  {/* Avatar Upload Frame */}
                  <div className="h-28 w-28 border-2 border-dashed border-slate-200 rounded-full flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 transition-colors group cursor-pointer relative shrink-0">
                    <Upload className="h-5 w-5 text-slate-400 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600">Upload</span>
                  </div>

                  {/* Right options checkboxes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-600 w-full">
                    <label className="flex items-center gap-3 p-3 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer select-none transition-colors">
                      <input 
                        type="checkbox" 
                        checked={activeEmployee} 
                        onChange={(e) => setActiveEmployee(e.target.checked)}
                        className="h-4 w-4 text-[#2f66e0] rounded border-slate-300 focus:ring-blue-500" 
                      />
                      <span>Active employee</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer select-none transition-colors">
                      <input 
                        type="checkbox" 
                        checked={autoClockIn} 
                        onChange={(e) => setAutoClockIn(e.target.checked)}
                        className="h-4 w-4 text-[#2f66e0] rounded border-slate-300 focus:ring-blue-500" 
                      />
                      <span>Auto clock-in / clock-out</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer select-none transition-colors">
                      <input 
                        type="checkbox" 
                        checked={ignoreRotaDeduction} 
                        onChange={(e) => setIgnoreRotaDeduction(e.target.checked)}
                        className="h-4 w-4 text-[#2f66e0] rounded border-slate-300 focus:ring-blue-500" 
                      />
                      <span>Ignore rota deduction</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer select-none transition-colors">
                      <input 
                        type="checkbox" 
                        checked={ignoreMissingSwipe} 
                        onChange={(e) => setIgnoreMissingSwipe(e.target.checked)}
                        className="h-4 w-4 text-[#2f66e0] rounded border-slate-300 focus:ring-blue-500" 
                      />
                      <span>Ignore missing swipe</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Card 2: Organisation details form */}
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6.5 shadow-xs space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Organisation information</h3>
                  <span className="bg-rose-50 text-rose-600 font-extrabold uppercase tracking-widest text-[9px] px-2 py-0.5 rounded border border-rose-100/50">required</span>
                </div>

                {/* Sub category: Employment */}
                <div className="space-y-4">
                  <div className="flex text-[10px] font-black text-[#2f66e0] uppercase tracking-widest bg-blue-50/70 py-0.5 px-2.5 rounded w-fit">
                    Employment
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                    {/* Employee No */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-500 uppercase tracking-wider">Employee No. <span className="text-red-500">*</span></label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={employeeNo} 
                          onChange={(e) => setEmployeeNo(e.target.value)}
                          className="flex-1 bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                        />
                        <button 
                          type="button"
                          onClick={handleAutoGenerateId}
                          className="bg-slate-50 hover:bg-slate-100 border border-slate-200 font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer shrink-0"
                        >
                          Auto generate
                        </button>
                      </div>
                    </div>

                    {/* Employment status */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-500 uppercase tracking-wider">Employment status <span className="text-red-500">*</span></label>
                      <select 
                        value={employmentStatus} 
                        onChange={(e) => setEmploymentStatus(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                      >
                        <option value="Permanent">Permanent</option>
                        <option value="Contract">Contract</option>
                        <option value="Intern">Intern</option>
                        <option value="Part-time">Part-time</option>
                      </select>
                    </div>

                    {/* Company */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-500 uppercase tracking-wider">Company <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                      />
                    </div>

                    {/* Location */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-500 uppercase tracking-wider">Location <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                      />
                    </div>

                    {/* Branch */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-500 uppercase tracking-wider">Branch</label>
                      <input 
                        type="text" 
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                      />
                    </div>

                    {/* Department */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-500 uppercase tracking-wider">Department <span className="text-red-500">*</span></label>
                      <select 
                        value={department} 
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                      >
                        <option value="Engineering">Engineering</option>
                        <option value="Finance">Finance</option>
                        <option value="HR">HR</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Operations">Operations</option>
                      </select>
                    </div>

                    {/* Section */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-500 uppercase tracking-wider">Section</label>
                      <select 
                        value={section} 
                        onChange={(e) => setSection(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                      >
                        <option value="Tech Division">Tech Division</option>
                        <option value="Accounting Desk">Accounting Desk</option>
                        <option value="Talent Acquisition">Talent Acquisition</option>
                        <option value="Media Outreach">Media Outreach</option>
                        <option value="Ground Ops">Ground Ops</option>
                      </select>
                    </div>

                    {/* Position */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-500 uppercase tracking-wider">Position <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={position} 
                        onChange={(e) => setPosition(e.target.value)}
                        placeholder="e.g. Senior Software Engineer"
                        className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Sub category: Classification */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50/70 py-0.5 px-2.5 rounded w-fit">
                    Classification
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                    {/* Job Type */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-500 uppercase tracking-wider">Job Type <span className="text-red-500">*</span></label>
                      <select 
                        value={jobType} 
                        onChange={(e) => setJobType(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Academic Intern">Academic Intern</option>
                        <option value="Contract-Hourly">Contract-Hourly</option>
                      </select>
                    </div>

                    {/* Type of Appointment */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-500 uppercase tracking-wider">Type of Appointment</label>
                      <select 
                        value={typeOfAppointment} 
                        onChange={(e) => setTypeOfAppointment(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Probation">Probation</option>
                        <option value="Contractual Stage">Contractual Stage</option>
                      </select>
                    </div>

                    {/* Job Grade */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-500 uppercase tracking-wider">Job Grade</label>
                      <select 
                        value={jobGrade} 
                        onChange={(e) => setJobGrade(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                      >
                        <option value="G-1">Grade 1 - Junior Executive</option>
                        <option value="G-3">Grade 3 - Mid Executive</option>
                        <option value="G-5">Grade 5 - Senior Lead</option>
                        <option value="G-7">Grade 7 - Managerial</option>
                        <option value="G-9">Grade 9 - Specialist / Principal</option>
                        <option value="G-10">Grade 10 - Executive Director</option>
                      </select>
                    </div>

                    {/* Join Date */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-500 uppercase tracking-wider">Join date <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input 
                          type="date" 
                          value={joinDate} 
                          onChange={(e) => setJoinDate(e.target.value)}
                          className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                        />
                      </div>
                    </div>

                    {/* Position start date */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-500 uppercase tracking-wider">Position Start Date</label>
                      <input 
                        type="date" 
                        value={positionStartDate} 
                        onChange={(e) => setPositionStartDate(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                      />
                    </div>

                    {/* Reports to */}
                    <div className="space-y-1.5">
                      <label className="block font-semibold text-slate-550 uppercase tracking-wider">Reports to</label>
                      <select 
                        value={reportsTo} 
                        onChange={(e) => setReportsTo(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                      >
                        <option value="EMP-0010">David Ng (Director of Engineering)</option>
                        <option value="EMP-0030">Rachel Tan (head of Finance)</option>
                        <option value="EMP-0040">Nina Reza (head of People Op)</option>
                        <option value="EMP-0050">Kevin Lim (VP Marketing)</option>
                        <option value="EMP-0001">Katherin Lee (Chief Executive Officer)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Sub category: Notes */}
                <div id="notes-sub-fields" className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50/70 py-0.5 px-2.5 rounded w-fit">
                    Notes
                  </div>

                  <div className="space-y-4 text-xs font-semibold">
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-500 uppercase tracking-wider">Employer's note</label>
                      <textarea 
                        value={employersNote}
                        onChange={(e) => setEmployersNote(e.target.value)}
                        placeholder="Internal notes visible only to HR admins..."
                        rows={3} 
                        className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-3 rounded-2xl text-slate-800 placeholder-slate-400 font-bold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-500 uppercase tracking-wider">Remarks</label>
                      <textarea 
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="General remarks about this employee..."
                        rows={2} 
                        className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-3 rounded-2xl text-slate-800 placeholder-slate-400 font-bold"
                      />
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}


          {/* STEP 2 WORKSPACE: PERSONAL DETAILS */}
          {step === 2 && (
            <div id="form-step-2" className="space-y-6 animate-in fade-in duration-300">
              
              {/* Card 1: Personal info form */}
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6.5 shadow-xs space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Personal information</h3>
                  <span className="bg-rose-50 text-rose-600 font-extrabold uppercase tracking-widest text-[9px] px-2 py-0.5 rounded border border-rose-100/50">required</span>
                </div>

                <div className="space-y-4">
                  <div className="flex text-[10px] font-black text-[#2f66e0] uppercase tracking-widest bg-blue-50/70 py-0.5 px-2.5 rounded w-fit">
                    Identity
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                    {/* First Name */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-500 uppercase tracking-wider">First Name <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="e.g. Sarah"
                        className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                      />
                    </div>

                    {/* Last Name */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-500 uppercase tracking-wider">Last Name <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="e.g. Lim Wei Ling"
                        className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                      />
                    </div>

                    {/* NRIC / National ID */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-500 uppercase tracking-wider">NRIC / National ID <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={nric} 
                        onChange={(e) => setNric(e.target.value)}
                        placeholder="e.g. 910314-10-5678"
                        className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800 font-mono tracking-tight"
                      />
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-500 uppercase tracking-wider">Date of Birth <span className="text-red-500">*</span></label>
                      <input 
                        type="date" 
                        value={dob} 
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                      />
                    </div>

                    {/* Gender */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-500 uppercase tracking-wider">Gender <span className="text-red-500">*</span></label>
                      <select 
                        value={gender} 
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Marital Status */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-500 uppercase tracking-wider">Marital Status</label>
                      <select 
                        value={maritalStatus} 
                        onChange={(e) => setMaritalStatus(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                      >
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>

                    {/* Nationality */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-500 uppercase tracking-wider">Nationality <span className="text-red-500">*</span></label>
                      <select 
                        value={nationality} 
                        onChange={(e) => setNationality(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                      >
                        <option value="Malaysian">Malaysian</option>
                        <option value="Singaporean">Singaporean</option>
                        <option value="Indonesian">Indonesian</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Race */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-500 uppercase tracking-wider">Race</label>
                      <select 
                        value={race} 
                        onChange={(e) => setRace(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                      >
                        <option value="Chinese">Chinese</option>
                        <option value="Malay">Malay</option>
                        <option value="Indian">Indian</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Religion */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-500 uppercase tracking-wider">Religion</label>
                      <select 
                        value={religion} 
                        onChange={(e) => setReligion(e.target.value)}
                        className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                      >
                        <option value="Buddhism">Buddhism</option>
                        <option value="Islam">Islam</option>
                        <option value="Christianity">Christianity</option>
                        <option value="Hinduism">Hinduism</option>
                        <option value="No Religion">No Religion / Other</option>
                      </select>
                    </div>

                    {/* Personal Email */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-500 uppercase tracking-wider">Personal Email</label>
                      <input 
                        type="email" 
                        value={personalEmail} 
                        onChange={(e) => setPersonalEmail(e.target.value)}
                        placeholder="name@email.com"
                        className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                      />
                    </div>

                    {/* Mobile No */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-500 uppercase tracking-wider">Mobile No.</label>
                      <input 
                        type="tel" 
                        value={mobileNo} 
                        onChange={(e) => setMobileNo(e.target.value)}
                        placeholder="+60 12-345 6789"
                        className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                      />
                    </div>

                    {/* Work Email */}
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-500 uppercase tracking-wider">Work Email</label>
                      <input 
                        type="email" 
                        value={workEmail} 
                        onChange={(e) => setWorkEmail(e.target.value)}
                        placeholder="name@novora.com"
                        className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                      />
                    </div>

                  </div>
                </div>
              </div>

              {/* Card 2: Passport Details Frame */}
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6.5 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Passport details</h3>
                  
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={passportEnabled} 
                      onChange={(e) => setPassportEnabled(e.target.checked)}
                      className="h-4 w-4 text-[#2f66e0] rounded border-slate-300 focus:ring-blue-500 cursor-pointer" 
                    />
                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest text-[10px]">Enable</span>
                  </label>
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 text-xs transition-opacity duration-250 ${passportEnabled ? 'opacity-100' : 'opacity-40 cursor-not-allowed pointer-events-none'}`}>
                  {/* Passport No */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-400 uppercase tracking-wider">Passport No.</label>
                    <input 
                      type="text" 
                      value={passportNo} 
                      onChange={(e) => setPassportNo(e.target.value)}
                      placeholder="A12345678"
                      disabled={!passportEnabled}
                      className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                    />
                  </div>

                  {/* Passport Issue Country */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-400 uppercase tracking-wider">Country of Issue</label>
                    <input 
                      type="text" 
                      value={passportCountry} 
                      onChange={(e) => setPassportCountry(e.target.value)}
                      disabled={!passportEnabled}
                      className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                    />
                  </div>

                  {/* Issue Date */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-400 uppercase tracking-wider">Issue Date</label>
                    <input 
                      type="date" 
                      value={passportIssueDate} 
                      onChange={(e) => setPassportIssueDate(e.target.value)}
                      disabled={!passportEnabled}
                      className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                    />
                  </div>

                  {/* Expiry Date */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-400 uppercase tracking-wider">Expiry Date</label>
                    <input 
                      type="date" 
                      value={passportExpiryDate} 
                      onChange={(e) => setPassportExpiryDate(e.target.value)}
                      disabled={!passportEnabled}
                      className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Address Frame */}
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6.5 shadow-xs space-y-4">
                <h3 className="text-xs font-black text-slate-805 uppercase tracking-wider border-b border-slate-100 pb-3">Current address</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                  {/* Line 1 */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block font-bold text-slate-400 uppercase tracking-wider">Address Line 1</label>
                    <input 
                      type="text" 
                      value={addressLine1} 
                      onChange={(e) => setAddressLine1(e.target.value)}
                      placeholder="Street, building, unit no."
                      className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                    />
                  </div>

                  {/* Line 2 */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block font-bold text-slate-400 uppercase tracking-wider">Address Line 2</label>
                    <input 
                      type="text" 
                      value={addressLine2} 
                      onChange={(e) => setAddressLine2(e.target.value)}
                      placeholder="Area, neighbourhood (optional)"
                      className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-805"
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-400 uppercase tracking-wider">City <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={city} 
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                    />
                  </div>

                  {/* State */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-400 uppercase tracking-wider">State</label>
                    <input 
                      type="text" 
                      value={state} 
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                    />
                  </div>

                  {/* Postcode */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-400 uppercase tracking-wider">Postcode</label>
                    <input 
                      type="text" 
                      value={postcode} 
                      onChange={(e) => setPostcode(e.target.value)}
                      placeholder="40170"
                      className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                    />
                  </div>

                  {/* Country */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-400 uppercase tracking-wider">Country <span className="text-red-500">*</span></label>
                    <select 
                      value={country} 
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800"
                    >
                      <option value="Malaysia">Malaysia</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Brunei">Brunei</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 text-xs">
                  <input 
                    type="checkbox" 
                    id="add-addr-same"
                    checked={permanentSameAsCurrent}
                    onChange={(e) => setPermanentSameAsCurrent(e.target.checked)}
                    className="h-4 w-4 text-[#2f66e0] rounded border-slate-300 focus:ring-blue-500 cursor-pointer" 
                  />
                  <label htmlFor="add-addr-same" className="font-semibold text-slate-600 cursor-pointer select-none">
                    Permanent address is the same as current address
                  </label>
                </div>
              </div>

            </div>
          )}


          {/* STEP 3 WORKSPACE: OFF DUTY DAYS */}
          {step === 3 && (
            <div id="form-step-3" className="space-y-6 animate-in fade-in duration-300">
              
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6.5 shadow-xs space-y-6">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-3">Off duty days</h3>

                <p className="text-xs font-semibold text-slate-500 leading-relaxed bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100">
                  Select the days this employee is off. Click once for full day off, twice for half day, third click to clear.
                </p>

                <div className="space-y-6">
                  {/* Full day off Row */}
                  <div className="space-y-3">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide bg-blue-50 px-2.5 py-0.5 rounded">Full day off</span>
                    
                    <div className="flex flex-wrap gap-2.5">
                      {DAYS_OF_WEEK.map((day) => {
                        const isSelected = fullDaysOff.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleDayOffToggle(day, 'full')}
                            className={`px-5 py-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer select-none min-w-[64px] ${
                              isSelected 
                                ? 'bg-[#2f66e0]/10 border-[#2f66e0] text-[#2f66e0] font-black' 
                                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Half day off Row */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-wide bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded">Half day off</span>

                    <div className="flex flex-wrap gap-2.5">
                      {DAYS_OF_WEEK.map((day) => {
                        const isSelected = halfDaysOff.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleDayOffToggle(day, 'half')}
                            className={`px-5 py-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer select-none min-w-[64px] ${
                              isSelected 
                                ? 'bg-amber-500/10 border-amber-500 text-amber-700 font-black' 
                                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Legend below */}
                  <div className="flex items-center gap-5 pt-3 text-[11px] font-bold text-slate-500">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded bg-[#2f66e0]" />
                      <span>Full day off</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded bg-amber-500" />
                      <span>Half day off</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}


          {/* STEP 4 WORKSPACE: BIOMETRIC COOLDOWN */}
          {step === 4 && (
            <div id="form-step-4" className="space-y-6 animate-in fade-in duration-300">
              
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6.5 shadow-xs space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Biometric registration</h3>
                  
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      id="enable-bio-chk"
                      checked={biometricEnabled}
                      onChange={(e) => setBiometricEnabled(e.target.checked)}
                      className="h-4 w-4 text-[#2f66e0] rounded border-slate-300 focus:ring-blue-500 cursor-pointer" 
                    />
                    <label htmlFor="enable-bio-chk" className="text-xs font-black text-slate-500 uppercase tracking-widest text-[10px] cursor-pointer">Enable biometric</label>
                  </label>
                </div>

                <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                  Register the employee on one or more biometric terminals. The TA Number must match the number enrolled on the physical device.
                </p>

                {biometricEnabled && (
                  <div className="space-y-4 pt-1">
                    
                    {terminalsList.map((row, index) => (
                      <div key={row.id} className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end bg-slate-50/40 p-4.5 rounded-2xl border border-slate-100">
                        {/* TA Number */}
                        <div className="md:col-span-5 space-y-1.5">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">TA Number <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            value={row.taNumber}
                            placeholder="e.g. TA-00451"
                            onChange={(e) => {
                              const updated = [...terminalsList];
                              updated[index].taNumber = e.target.value;
                              setTerminalsList(updated);
                            }}
                            className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-800 font-mono"
                          />
                        </div>

                        {/* Terminal Selection */}
                        <div className="md:col-span-6 space-y-1.5">
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Terminal <span className="text-red-500">*</span></label>
                          <select 
                            value={row.terminal}
                            onChange={(e) => {
                              const updated = [...terminalsList];
                              updated[index].terminal = e.target.value;
                              setTerminalsList(updated);
                            }}
                            className="w-full bg-white border border-slate-200 focus:outline-none focus:border-blue-500 p-2.5 rounded-xl font-bold text-slate-805"
                          >
                            <option value="Main Lobby — Terminal 1">Main Lobby — Terminal 1</option>
                            <option value="Level 3 — Terminal 2">Level 3 — Terminal 2</option>
                            <option value="Secondary Entrance Terminal 3">Secondary Entrance Terminal 3</option>
                          </select>
                        </div>

                        {/* Trash Delete */}
                        <div className="md:col-span-1 flex justify-center pb-1">
                          <button 
                            type="button"
                            onClick={() => handleDeleteTerminal(row.id)}
                            className="h-10 w-10 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/65 hover:border-rose-100 rounded-xl flex items-center justify-center transition-all cursor-pointer"
                          >
                            <X className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    <button 
                      type="button"
                      onClick={handleAddTerminal}
                      className="flex items-center gap-1.5 text-xs font-bold text-[#2f66e0] hover:underline bg-blue-50/50 hover:bg-blue-50 px-3.5 py-2.5 rounded-xl border border-[#2f66e0]/10 transition-colors cursor-pointer w-fit"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Another Terminal</span>
                    </button>

                  </div>
                )}

              </div>

            </div>
          )}


          {/* STEP 5 WORKSPACE: CONFIRM AND RECONCILE */}
          {step === 5 && (
            <div id="form-step-5" className="space-y-6 animate-in fade-in duration-300">
              
              <div className="bg-white border border-slate-200/60 rounded-3xl p-6.5 shadow-xs space-y-6">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-3">Review &amp; confirm</h3>

                {/* Hero profile review header card */}
                <div className="flex items-center gap-5 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                  <div className="h-16 w-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl tracking-tight shrink-0 shadow-sm">
                    {getReviewInitials()}
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-slate-800 leading-none">
                      {firstName || lastName ? `${firstName} ${lastName}`.trim() : 'New Employee'}
                    </h4>
                    <p className="text-[11px] font-mono text-slate-500 font-bold mt-1.5">
                      {employeeNo || 'EMP-0285'} &bull; {department} &bull; {position || '-- Select --'}
                    </p>
                  </div>
                </div>

                {/* Review stats grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5.5 text-xs leading-normal">
                  
                  {/* Subsection 1 Detail elements */}
                  <div className="space-y-3">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-1.5">Details</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between py-0.5">
                        <span className="text-slate-400 font-semibold">Company:</span>
                        <span className="text-slate-800 font-bold">{company}</span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-slate-400 font-semibold">Department:</span>
                        <span className="text-slate-800 font-bold">{department}</span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-slate-400 font-semibold">Job Type:</span>
                        <span className="text-slate-800 font-bold">{jobType} &bull; {employmentStatus}</span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-slate-400 font-semibold">Join Date:</span>
                        <span className="text-slate-800 font-bold">{joinDate}</span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-slate-400 font-semibold">Grade:</span>
                        <span className="text-slate-800 font-bold">{jobGrade}</span>
                      </div>
                    </div>
                  </div>

                  {/* Subsection 2 Personal elements */}
                  <div className="space-y-3">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-1.5">Personal</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between py-0.5">
                        <span className="text-slate-400 font-semibold">Nationality:</span>
                        <span className="text-slate-800 font-bold">{nationality}</span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-slate-400 font-semibold">Date of birth:</span>
                        <span className="text-slate-800 font-bold">{dob}</span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-slate-400 font-semibold">NRIC:</span>
                        <span className="text-slate-800 font-mono font-bold">{nric || '—'}</span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-slate-400 font-semibold">Mobile:</span>
                        <span className="text-slate-800 font-bold">{mobileNo || '—'}</span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="text-slate-400 font-semibold">Address:</span>
                        <span className="text-slate-800 font-bold truncate max-w-xs">{addressLine1 || '—'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Subsection 3 Off duty elements */}
                  <div className="space-y-3">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-1.5">Off duty</h5>
                    <div className="space-y-2 font-semibold">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Full day off:</span>
                        <span className="text-[#2f66e0] font-bold">{fullDaysOff.join(', ') || 'None selected'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Half day off:</span>
                        <span className="text-amber-600 font-bold">{halfDaysOff.join(', ') || 'None selected'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Subsection 4 Biometrics elements */}
                  <div className="space-y-3">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-1.5">Biometric</h5>
                    <div className="space-y-2 font-semibold">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Terminals Registered:</span>
                        <span className="text-slate-800 font-bold">
                          {biometricEnabled ? `${terminalsList.length} terminal(s) active` : 'Disabled'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Auto clock-in:</span>
                        <span className={autoClockIn ? 'text-emerald-600 font-bold' : 'text-slate-500 font-bold'}>
                          {autoClockIn ? 'Enabled' : 'Off'}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Light blue informational alert block */}
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4.5 text-xs font-semibold text-slate-600 flex gap-2.5 leading-relaxed">
                  <span className="h-2 w-2 rounded-full bg-[#2f66e0] shrink-0 mt-1.5 animate-pulse" />
                  <p className="text-slate-500 font-semibold text-[11px]">
                    Please review all information above. Once saved, the employee record will be active and accessible in the directory.
                  </p>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Right Column: Steps Progress & Tips card layout */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-48">
          
          {/* Card 1: Progress meter percentages */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6.5 shadow-xs">
            <span className="text-[10.5px] font-extrabold text-slate-400 block uppercase tracking-wider">Step {step} of 5</span>
            
            <div className="flex justify-between items-baseline mt-1">
              <span className="text-2xl font-black text-slate-800 tracking-tight">{step * 20}%</span>
              <span className="text-[11px] font-semibold text-slate-450">complete</span>
            </div>

            {/* Gray progress background slider */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3 border border-slate-50">
              <motion.div 
                className="bg-[#2f66e0] h-full rounded-full" 
                initial={{ width: '20%' }}
                animate={{ width: `${step * 20}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Card 2: Contextual Help Tips bullets */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6.5 shadow-xs space-y-4">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest leading-none">Tips</h4>
            
            <ul className="space-y-3.5">
              {systemTips[step - 1].map((tipText, tIdx) => (
                <li key={tIdx} className="flex gap-2.5 items-start text-xs font-semibold text-slate-500 leading-normal">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2f66e0] shrink-0 mt-1.5" />
                  <span>{tipText}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </section>

      {/* 4. IMMERSIVE COMPACT BOTTOM CTA ACTION HEADER BAR */}
      <footer id="creation-bottom-stripe" className="bg-white border-t border-slate-200 py-4.5 px-8 flex items-center justify-between sticky bottom-0 z-10 shrink-0">
        <span id="label-for-bottom-step" className="text-xs font-semibold text-slate-500">
          Step {step}: {stepLabel(step)}
        </span>

        <div className="flex items-center gap-3">
          {/* Back Action */}
          {step > 1 && (
            <button 
              id="wizard-bottom-back-action-btn"
              type="button"
              onClick={() => setStep(step - 1)}
              className="bg-white hover:bg-slate-50 font-bold text-xs text-slate-700 border border-slate-200 px-4.5 py-2.5 rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" />
              <span>Back</span>
            </button>
          )}

          {/* Forward or Submit actions */}
          {step < 5 ? (
            <button 
              id="wizard-bottom-forward-action-btn"
              type="button"
              onClick={() => {
                if (step === 2 && !firstName && !lastName) {
                  showActionToast('Name details are required before advancing.')
                  return;
                }
                setStep(step + 1);
              }}
              className="bg-[#2f66e0] hover:bg-opacity-90 font-black text-xs text-white px-5 py-2.5 rounded-xl transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Next step</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </button>
          ) : (
            <button 
              id="wizard-bottom-commit-action-btn"
              type="button"
              onClick={handleFinalSubmit}
              className="bg-[#2f66e0] hover:bg-opacity-90 font-black text-xs text-white px-5 py-2.5 rounded-xl transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Save employee</span>
              <Check className="h-4.5 w-4.5 shrink-0" strokeWidth={3} />
            </button>
          )}
        </div>
      </footer>

    </div>
  );
}

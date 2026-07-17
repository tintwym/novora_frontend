export interface JobRequisition {
  id: string;
  positionTitle: string;
  department: string;
  type: string;
  requestedBy: string;
  openDate: string;
  targetFill: string;
  applicants: number;
  status: 'Open' | 'In review' | 'Filled' | 'On hold' | 'Cancelled';
}

export interface JobPosting {
  id: string;
  position: string;
  channel: string;
  views: number;
  applicants: number;
  status: 'Live' | 'Closed' | 'On hold';
  department: string;
}

export interface Candidate {
  id: string;
  name: string;
  experience: string;
  education: string;
  source: string;
  matchScore: string;
  stage: 'Applied' | 'Screening' | 'Phone interview' | 'Panel interview' | 'Offer' | 'Hired';
  appliedDate: string;
  positionApplied: string;
}

export interface Interview {
  id: string;
  candidateName: string;
  position: string;
  stage: string;
  date: string;
  time: string;
  format: 'In person' | 'Phone' | 'Video';
  status: 'Confirmed' | 'Pending' | 'No show' | 'Completed';
}

export interface Offer {
  id: string;
  candidateName: string;
  position: string;
  salary: string;
  sentDate: string;
  expiryDate: string;
  status: 'Sent' | 'Accepted' | 'Declined' | 'Draft';
  allowance: string;
  grade: string;
  probation: string;
}

export interface PreOnboarding {
  id: string;
  candidateName: string;
  avatar: string;
  position: string;
  startDate: string;
  docsReceived: number;
  docsTotal: number;
  status: 'Docs pending' | 'Completed' | 'Ready to onboard';
  checklist: {
    signedOffer: boolean;
    nricPassport: boolean;
    bankDetails: boolean;
    epfMember: boolean;
    emergencyContact: boolean;
    medicalCert: boolean;
    educationCert: boolean;
    resignationLetter: boolean;
  };
}

export const initialRequisitions: JobRequisition[] = [
  {
    id: 'REQ-2025-047',
    positionTitle: 'HR Business Partner',
    department: 'HR',
    type: 'Permanent',
    requestedBy: 'Nina Reza',
    openDate: '8 Apr',
    targetFill: '13 May',
    applicants: 14,
    status: 'Open',
  },
  {
    id: 'REQ-2025-048',
    positionTitle: 'Sr. Frontend Developer',
    department: 'Engineering',
    type: 'Permanent',
    requestedBy: 'David Ng',
    openDate: '1 Apr',
    targetFill: '30 May',
    applicants: 28,
    status: 'In review',
  },
  {
    id: 'REQ-2025-049',
    positionTitle: 'Finance Analyst',
    department: 'Finance',
    type: 'Contract',
    requestedBy: 'Rachel Tan',
    openDate: '15 Apr',
    targetFill: '15 Jun',
    applicants: 9,
    status: 'Open',
  },
  {
    id: 'REQ-2025-050',
    positionTitle: 'Operations Lead',
    department: 'Operations',
    type: 'Permanent',
    requestedBy: 'Malik Said',
    openDate: '20 Mar',
    targetFill: '20 May',
    applicants: 31,
    status: 'Filled',
  },
  {
    id: 'REQ-2025-051',
    positionTitle: 'Digital Marketing Lead',
    department: 'Marketing',
    type: 'Permanent',
    requestedBy: 'Kevin Lim',
    openDate: '25 Apr',
    targetFill: '25 Jun',
    applicants: 22,
    status: 'On hold',
  },
];

export const initialPostings: JobPosting[] = [
  {
    id: 'POST-001',
    position: 'HR Business Partner',
    channel: 'JobStreet',
    views: 1240,
    applicants: 14,
    status: 'Live',
    department: 'HR',
  },
  {
    id: 'POST-002',
    position: 'HR Business Partner',
    channel: 'LinkedIn',
    views: 870,
    applicants: 8,
    status: 'Live',
    department: 'HR',
  },
  {
    id: 'POST-003',
    position: 'Sr. Frontend Dev',
    channel: 'JobStreet',
    views: 3480,
    applicants: 28,
    status: 'Live',
    department: 'Engineering',
  },
  {
    id: 'POST-004',
    position: 'Finance Analyst',
    channel: 'Internal',
    views: 220,
    applicants: 4,
    status: 'Live',
    department: 'Finance',
  },
  {
    id: 'POST-005',
    position: 'Digital Mktg Lead',
    channel: 'LinkedIn',
    views: 540,
    applicants: 0,
    status: 'On hold',
    department: 'Marketing',
  },
];

export const initialCandidates: Candidate[] = [
  {
    id: 'CAND-001',
    name: 'Aisha Rahman',
    experience: '5 yrs',
    education: 'BSc HRM',
    source: 'JobStreet',
    matchScore: '92%',
    stage: 'Applied',
    appliedDate: '9 May',
    positionApplied: 'HR Business Partner',
  },
  {
    id: 'CAND-002',
    name: 'Ben Loh',
    experience: '3 yrs',
    education: 'MBA',
    source: 'LinkedIn',
    matchScore: '85%',
    stage: 'Applied',
    appliedDate: '8 May',
    positionApplied: 'HR Business Partner',
  },
  {
    id: 'CAND-003',
    name: 'Cindy Wong',
    experience: '2 yrs',
    education: 'Diploma HRM',
    source: 'JobStreet',
    matchScore: '74%',
    stage: 'Applied',
    appliedDate: '7 May',
    positionApplied: 'HR Business Partner',
  },
  {
    id: 'CAND-004',
    name: 'Lena Wong',
    experience: '5 yrs',
    education: 'HRBP cert.',
    source: 'Referral',
    matchScore: '92%',
    stage: 'Screening',
    appliedDate: '10 May',
    positionApplied: 'HR Business Partner',
  },
  {
    id: 'CAND-005',
    name: 'Faris Azman',
    experience: '4 yrs',
    education: 'BA Psychology',
    source: 'JobStreet',
    matchScore: '85%',
    stage: 'Phone interview',
    appliedDate: '11 May',
    positionApplied: 'HR Business Partner',
  },
  {
    id: 'CAND-006',
    name: 'Priya Kumar',
    experience: '6 yrs',
    education: 'MBA',
    source: 'LinkedIn',
    matchScore: '81%',
    stage: 'Panel interview',
    appliedDate: '11 May',
    positionApplied: 'HR Business Partner',
  },
  {
    id: 'CAND-007',
    name: 'Rajan Singh',
    experience: '4 yrs',
    education: 'BSc Dev',
    source: 'LinkedIn',
    matchScore: '88%',
    stage: 'Phone interview',
    appliedDate: '12 May',
    positionApplied: 'Sr. Frontend Developer',
  }
];

export const initialInterviews: Interview[] = [
  {
    id: 'INT-01',
    candidateName: 'Lena Wong',
    position: 'HR Business Partner',
    stage: 'Panel',
    date: '2026-05-14',
    time: '10:00 AM',
    format: 'In person',
    status: 'Confirmed',
  },
  {
    id: 'INT-02',
    candidateName: 'Faris Azman',
    position: 'HR Business Partner',
    stage: 'Phone',
    date: '2026-05-11',
    time: '09:00 AM',
    format: 'Phone',
    status: 'Pending',
  },
  {
    id: 'INT-03',
    candidateName: 'Priya Kumar',
    position: 'HR Business Partner',
    stage: 'Panel',
    date: '2026-05-15',
    time: '02:00 PM',
    format: 'Video',
    status: 'Confirmed',
  },
  {
    id: 'INT-04',
    candidateName: 'Rajan Singh',
    position: 'Sr. Frontend Developer',
    stage: 'Phone',
    date: '2026-05-12',
    time: '11:00 AM',
    format: 'Phone',
    status: 'No show',
  },
];

export const initialOffers: Offer[] = [
  {
    id: 'OFFER-001',
    candidateName: 'Lena Wong',
    position: 'HR Business Partner',
    salary: '6,500',
    sentDate: '6 May',
    expiryDate: '20 May 2026',
    status: 'Sent',
    allowance: '650',
    grade: 'G-6 / Sub A',
    probation: '3 months',
  },
  {
    id: 'OFFER-002',
    candidateName: 'Ahmad B',
    position: 'Operations Lead',
    salary: '5,200',
    sentDate: '25 Apr',
    expiryDate: '15 May 2026',
    status: 'Accepted',
    allowance: '500',
    grade: 'G-5 / Sub C',
    probation: '3 months',
  },
  {
    id: 'OFFER-003',
    candidateName: 'Sara K',
    position: 'Finance Analyst',
    salary: '4,800',
    sentDate: '10 Apr',
    expiryDate: '24 Apr',
    status: 'Declined',
    allowance: '400',
    grade: 'G-4 / Sub B',
    probation: '6 months',
  },
];

export const initialPreOnboarding: PreOnboarding[] = [
  {
    id: 'PRE-01',
    candidateName: 'Ahmad Bakri',
    avatar: 'AB',
    position: 'Operations Lead',
    startDate: '2 Jun 2026',
    docsReceived: 4,
    docsTotal: 8,
    status: 'Docs pending',
    checklist: {
      signedOffer: true,
      nricPassport: true,
      bankDetails: true,
      epfMember: false,
      emergencyContact: false,
      medicalCert: false,
      educationCert: true,
      resignationLetter: false,
    },
  },
  {
    id: 'PRE-02',
    candidateName: 'Lena Wong',
    avatar: 'LW',
    position: 'HR Business Partner',
    startDate: 'TBD',
    docsReceived: 1,
    docsTotal: 8,
    status: 'Docs pending',
    checklist: {
      signedOffer: true,
      nricPassport: false,
      bankDetails: false,
      epfMember: false,
      emergencyContact: false,
      medicalCert: false,
      educationCert: false,
      resignationLetter: false,
    },
  },
];

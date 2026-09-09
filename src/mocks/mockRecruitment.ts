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

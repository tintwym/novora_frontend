export type Department = 'Engineering' | 'Finance' | 'HR' | 'Marketing' | 'Operations';

export type EmploymentStatus = 'Permanent' | 'Contract' | 'Intern' | 'Part-time';

export type EmployeeStatus = 'Active' | 'On Leave' | 'Inactive';

export interface Employee {
  id: string; // e.g. "EMP-0285"
  name: string;
  department: Department;
  position: string;
  employmentStatus: EmploymentStatus;
  status: EmployeeStatus;
  joinDate: string;
  nric: string; // NRIC or Passport
  mobile: string;
  email: string;
  address: string;
  avatarColor: string; // Tailwind bg color class
  dependents: string;
  emergencyContact: string;
  reportsTo?: string; // ID of the manager
}

export type SidebarTab =
  | 'Dashboard'
  | 'Employees Management'
  | 'Recruitment Management'
  | 'On/Off-boarding Management'
  | 'Attendance Management'
  | 'Leave Management'
  | 'Disciplinary Management'
  | 'Payroll Management'
  | 'Claims Management'
  | 'Benefits Management'
  | 'Helpdesk & Inquiries Management'
  | 'Performance Management'
  | 'Engagement Management'
  | 'Training Management'
  | 'Learning Management'
  | 'Assets Management'
  | 'Reports'
  | 'Settings';

export type SubTab = 'Employee Profile' | 'Employee Directory' | 'Organisation Chart' | 'Employee Reports'

export interface AuthSession {
  userId: string
  email: string
  fullName: string
  roles: string[]
  companyName: string
  organization: {
    id: string
    name: string
    slug: string
    plan: string
    status: string
    trialExpiresAt: string | null
  } | null
}


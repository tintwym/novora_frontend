export type Department = 'Engineering' | 'Finance' | 'HR' | 'Marketing' | 'Operations'

export type EmploymentStatus = 'Permanent' | 'Contract' | 'Intern' | 'Part-time'

export type EmployeeStatus = 'Active' | 'On Leave' | 'Inactive'

/** Shared employee record used by Downloads-style module UIs. */
export type ModuleEmployee = {
  id: string
  name: string
  department: Department
  position: string
  employmentStatus: EmploymentStatus
  status: EmployeeStatus
  joinDate: string
  nric: string
  mobile: string
  email: string
  address: string
  avatarColor: string
  dependents: string
  emergencyContact: string
  reportsTo?: string
}

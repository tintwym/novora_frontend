export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'Active' | 'On Leave' | 'Remote';
  attendanceRate: number;
  avatarUrl: string;
}

export interface LeaveRequest {
  id: string;
  employeeName: string;
  type: string;
  dates: string;
  days: number;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface AttendanceLog {
  id: string;
  time: string;
  employeeName: string;
  method: 'Fingerprint' | 'Facial Recognition' | 'Mobile GPS' | 'Web Clock-in';
  status: 'Success' | 'Late' | 'Manual Review';
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  category: 'core' | 'advanced' | 'integration';
  iconName: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
  avatarUrl: string;
}

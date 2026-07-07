import type {
  CompletionTeam,
  LearningAssessment,
  LearningCertRow,
  LearningChampion,
  LearningCourse,
  LearningPath,
} from '../types/learning'

export const LEARNING_COURSES: LearningCourse[] = [
  {
    id: 'CRS-401',
    category: 'ENGINEERING',
    title: 'Advanced AWS Cloud Orchestration & Serverless Architecture',
    instructor: 'Dr. Evelyn Harris',
    duration: '8h 45m',
    format: 'Video',
    provider: 'LinkedIn',
    progress: 60,
    enrolled: true,
    completed: false,
    rating: 4.8,
  },
  {
    id: 'CRS-402',
    category: 'GENERAL',
    title: 'ISO 27001 Cybersecurity Compliance Awareness Protocol',
    instructor: 'HR Security Officers',
    duration: '2h 15m',
    format: 'Interactive',
    provider: 'Internal',
    progress: 0,
    enrolled: true,
    completed: false,
    rating: 4.8,
  },
  {
    id: 'CRS-403',
    category: 'HR',
    title: 'Global GDPR Privacy Safeguards & Data Retention Standards',
    instructor: 'Legal Compliance Team',
    duration: '3h 30m',
    format: 'Interactive',
    provider: 'Coursera',
    progress: 0,
    enrolled: false,
    completed: false,
    rating: 4.8,
  },
  {
    id: 'CRS-404',
    category: 'MARKETING',
    title: 'High-Impact Brand Strategy & Modern Social Funnels',
    instructor: 'Marcus Aurel',
    duration: '6h 15m',
    format: 'Video',
    provider: 'Udemy',
    progress: 0,
    enrolled: false,
    completed: false,
    rating: 4.8,
  },
  {
    id: 'CRS-405',
    category: 'FINANCE',
    title: 'Corporate Treasury Accounting & Risk Mitigation',
    instructor: 'Chong Wei Min',
    duration: '12h 40m',
    format: 'Document',
    provider: 'Internal',
    progress: 100,
    enrolled: true,
    completed: true,
    rating: 4.8,
  },
  {
    id: 'CRS-406',
    category: 'OPERATIONS',
    title: 'Agile Operations: Kanban, Lean & Continuous Delivery',
    instructor: 'Sarah Jenkins',
    duration: '5h 10m',
    format: 'Video',
    provider: 'LinkedIn',
    progress: 0,
    enrolled: false,
    completed: false,
    rating: 4.8,
  },
]

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'PTH-01',
    cohort: 'HR COHORT',
    cohortTone: 'info',
    level: 'ADVANCED',
    levelTone: 'danger',
    title: 'Executive Leadership Readiness Milestone Path',
    description: 'Strategic grooming curriculum designed to prepare high-potential seniors for VP or Director roles.',
    milestones: [
      'High-Impact Brand Strategy & Modern Social Funnels',
      'Global GDPR Privacy Safeguards & Data Retention Standards',
      'ISO 27001 Cybersecurity Compliance Awareness Protocol',
    ],
    enrollments: 14,
  },
  {
    id: 'PTH-02',
    cohort: 'ENGINEERING COHORT',
    cohortTone: 'info',
    level: 'INTERMEDIATE',
    levelTone: 'warning',
    title: 'Advanced Software Engineer Onboarding & Architecture',
    description: 'Essential systems path mapping multi-tenant deployments, performance monitoring, and container security.',
    milestones: [
      'Advanced AWS Cloud Orchestration & Serverless Architecture',
      'ISO 27001 Cybersecurity Compliance Awareness Protocol',
    ],
    enrollments: 38,
  },
]

export const PATH_BUNDLE_OPTIONS = [
  'Advanced AWS Cloud Orchestration & Serv...',
  'Global GDPR Privacy Safeguards & Data Ret...',
  'ISO 27001 Cybersecurity Compliance...',
  'High-Impact Brand Strategy...',
  'Corporate Treasury Accounting & GAAP Ta...',
]

export const LEARNING_CERTS: LearningCertRow[] = [
  {
    id: 'CRT-981',
    cert: 'ISO 27001 InfoSec Master Certificate',
    name: 'Sarah Lim',
    dept: 'Engineering',
    issue: '2025-06-15',
    expiry: '2026-06-15',
    state: 'EXPIRED',
    stateTone: 'danger',
  },
  {
    id: 'CRT-982',
    cert: 'Global GDPR Compliance Representative Cert',
    name: 'Raj Kumar',
    dept: 'Operations',
    issue: '2025-10-10',
    expiry: '2026-07-10',
    state: 'EXPIRING SOON',
    stateTone: 'warning',
  },
  {
    id: 'CRT-983',
    cert: 'GAAP Advanced Treasury Accounting',
    name: 'Pinky Sharma',
    dept: 'Finance',
    issue: '2025-01-12',
    expiry: '2027-01-12',
    state: 'ACTIVE',
    stateTone: 'success',
  },
  {
    id: 'CRT-984',
    cert: 'Advanced Social Media Strategy',
    name: 'John Doe',
    dept: 'Marketing',
    issue: '2025-04-12',
    expiry: '2026-09-12',
    state: 'ACTIVE',
    stateTone: 'success',
  },
]

export const LEARNING_ASSESSMENTS: LearningAssessment[] = [
  {
    id: 'QT-201',
    title: 'AWS Serverless Solutions and Optimization Quiz',
    duration: '10 Mins',
    itemCount: 'Contains 3 randomized test items',
    questions: [
      {
        text: 'Which AWS service fits a event-driven, serverless execution layout with multi-language runtimes?',
        options: ['EC2 Dedicated Hosts', 'Amazon Lambda Functions', 'ECS on EC2 instances', 'S3 Glacier Standard'],
        correct: 'Amazon Lambda Functions',
      },
      {
        text: 'What parameter primarily controls the horizontal scale throttling limit for Lambda executions?',
        options: ['Memory allocation limit', 'Concurrency setting buffer', 'VPC endpoint routing configurations', 'IAM security policy bounds'],
        correct: 'Concurrency setting buffer',
      },
      {
        text: 'To achieve extreme sub-millisecond response caches for repetitive database queries, what serverless overlay is recommended?',
        options: ['VPC NAT Gateway', 'Amazon DynamoDB Accelerator (DAX)', 'Redshift Analytical Cluster', 'Kinesis Firehose buffers'],
        correct: 'Amazon DynamoDB Accelerator (DAX)',
      },
    ],
  },
  {
    id: 'QT-202',
    title: 'GDPR / Personal Data Protection Compliance Test',
    duration: '15 Mins',
    itemCount: 'Contains 2 randomized test items',
    questions: [
      {
        text: 'Under GDPR, what is the maximum fine for serious infringements?',
        options: ['€10 million or 2% of global turnover', '€20 million or 4% of global turnover', '€5 million flat rate', 'No statutory cap'],
        correct: '€20 million or 4% of global turnover',
      },
      {
        text: 'Which lawful basis requires explicit opt-in for marketing emails?',
        options: ['Legitimate interest', 'Consent', 'Contractual necessity', 'Vital interests'],
        correct: 'Consent',
      },
    ],
  },
]

export const COMPLETION_TEAMS: CompletionTeam[] = [
  { name: 'Engineering Division Team', pct: 42, certified: '35/83' },
  { name: 'Operations Division Team', pct: 41, certified: '21/51' },
  { name: 'HR Division Team', pct: 43, certified: '18/42' },
  { name: 'Finance Division Team', pct: 49, certified: '28/57' },
  { name: 'Marketing Division Team', pct: 41, certified: '15/37' },
]

export const LEARNING_CHAMPIONS: LearningChampion[] = [
  { rank: '#1', name: 'Ahmad Wahid', role: 'Chief Executive Officer', classes: '5 classes', hours: '28 hrs', badge: 'GOLD EDU-STAR', badgeTone: 'gold' },
  { rank: '#2', name: 'David Ng', role: 'Head of Engineering', classes: '4 classes', hours: '22 hrs', badge: 'SILVER MEDALIST', badgeTone: 'silver' },
  { rank: '#3', name: 'Sarah Lim', role: 'Principal Engineer', classes: '3 classes', hours: '18 hrs', badge: 'BRONZE RIBBON', badgeTone: 'bronze' },
  { rank: '#4', name: 'Sarah Lim Wei Ling', role: 'Senior Developer', classes: '3 classes', hours: '14 hrs', badge: 'BRONZE RIBBON', badgeTone: 'bronze' },
]

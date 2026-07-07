import type { ReportCategoryId, ReportModuleDefinition } from '../types/reports'

export const REPORT_MODULES: ReportModuleDefinition[] = [
  {
    "id": "overview",
    "label": "All Overview",
    "icon": "overview",
    "categories": [
      "all"
    ],
    "reportsSectionTitle": "MOST USED REPORTS",
    "insights": [],
    "reports": [],
    "quickSnapshot": {
      "totalRecordsLabel": "Total Records",
      "totalRecordsValue": "—",
      "lastUpdated": "—",
      "autoRunStatus": "—",
      "distributionTitle": "",
      "bars": []
    },
    "briefing": {
      "riskLabel": "LOW RISK",
      "riskIsLow": true,
      "riskIsHigh": false,
      "strategicFocus": "",
      "financialImpact": "",
      "directives": []
    },
    "overviewOnly": true
  },
  {
    "id": "employee",
    "label": "Employee",
    "icon": "employee",
    "categories": [
      "all",
      "core_hr"
    ],
    "reportsSectionTitle": "EMPLOYEE REPORTS AVAILABLE",
    "insights": [
      {
        "label": "ACTIVE HEADCOUNT",
        "value": "154 Staff",
        "sub": "+4% from last month",
        "subIsPositive": true
      },
      {
        "label": "AVG TENURE",
        "value": "3.8 Years",
        "sub": "+0.2y YoY growth",
        "subIsPositive": true
      },
      {
        "label": "MONTHLY TURNOVER",
        "value": "1.2%",
        "sub": "-0.3% improvement",
        "subIsPositive": true
      }
    ],
    "reports": [
      {
        "title": "Global Staff Census & Registry",
        "tag": "CENSUS",
        "description": "Comprehensive directory including active status, join dates, and roles."
      },
      {
        "title": "Workforce Diversity & Demographics Audit",
        "tag": "DIVERSITY",
        "description": "Breakdown of gender balance, origin statistics, and age demographics."
      },
      {
        "title": "Tenure & Contract Allocation Profile",
        "tag": "TENURE",
        "description": "Detailed view of staff contract classifications and average historical retention."
      }
    ],
    "quickSnapshot": {
      "totalRecordsLabel": "Total Records",
      "totalRecordsValue": "154 Active profiles",
      "lastUpdated": "Today 18:30",
      "autoRunStatus": "ACTIVE (DAILY)",
      "distributionTitle": "EMPLOYMENT TYPE DISTRIBUTION",
      "bars": [
        {
          "label": "Full-Time Employees",
          "detail": "131 (85%)",
          "fraction": 0.85,
          "color": "#2563eb"
        },
        {
          "label": "Part-Time & Flex-Staff",
          "detail": "15 (10%)",
          "fraction": 0.1,
          "color": "#059669"
        },
        {
          "label": "Contractors / External",
          "detail": "8 (5%)",
          "fraction": 0.05,
          "color": "#7c3aed"
        }
      ]
    },
    "briefing": {
      "riskLabel": "LOW RISK",
      "riskIsLow": true,
      "riskIsHigh": false,
      "strategicFocus": "Workforce distribution alignment & tenure stability tracking.",
      "financialImpact": "Optimized headcount allocation limiting turnover leakage.",
      "directives": [
        "Review potential department succession pipelines for technical roles nearing 5 years avg tenure.",
        "Track contract staff conversion metrics to control high-fee contractor budgets.",
        "Verify remote work ratios relative to local physical seat booking configurations."
      ]
    }
  },
  {
    "id": "onboarding",
    "label": "On/Off-boarding",
    "icon": "onboarding",
    "categories": [
      "all",
      "core_hr"
    ],
    "reportsSectionTitle": "ON/OFF-BOARDING REPORTS AVAILABLE",
    "insights": [
      {
        "label": "NEW JOINS (THIS MO.)",
        "value": "8 Personnel",
        "sub": "100% hardware pre-shipped",
        "subIsPositive": true
      },
      {
        "label": "EXITS SCHEDULED",
        "value": "3 Accounts",
        "sub": "Non-disclosure signed",
        "subIsPositive": true
      },
      {
        "label": "SLA CHECKLIST PASS RATE",
        "value": "98.5%",
        "sub": "Excellent compliance",
        "subIsPositive": true
      }
    ],
    "reports": [
      {
        "title": "New Hire Ramp-Up Status Booklet",
        "tag": "ONBOARDING",
        "description": "Activity completion log across training, culture, and security settings."
      },
      {
        "title": "Consolidated Exit Interview Summary",
        "tag": "OFFBOARDING",
        "description": "Anonymized termination reasons, manager notes, and general comments."
      },
      {
        "title": "Interactive Handover Checklist Audit",
        "tag": "COMPLIANCE",
        "description": "Device returns, authorization invalidations, and direct transitions tracker."
      }
    ],
    "quickSnapshot": {
      "totalRecordsLabel": "Total Records",
      "totalRecordsValue": "11 Scheduled transfers",
      "lastUpdated": "Yesterday 14:00",
      "autoRunStatus": "ACTIVE (DAILY)",
      "distributionTitle": "TASKS COMPLETION BY CORE ITEMS",
      "bars": [
        {
          "label": "Hardware & SSO Configured",
          "detail": "11 Completed (100%)",
          "fraction": 1,
          "color": "#2563eb"
        },
        {
          "label": "Security & Policy Sign-up",
          "detail": "10 Completed (90%)",
          "fraction": 0.9,
          "color": "#059669"
        },
        {
          "label": "First Team Intro Chat",
          "detail": "8 Completed (72%)",
          "fraction": 0.72,
          "color": "#7c3aed"
        }
      ]
    },
    "briefing": {
      "riskLabel": "MEDIUM RISK",
      "riskIsLow": false,
      "riskIsHigh": false,
      "strategicFocus": "Security credentials clearance & asset recovery rates.",
      "financialImpact": "IT infrastructure setup overhead & unrecovered laptop replacement costs.",
      "directives": [
        "Mandate all directory and SSO credentials terminate within 2 hours of departure timestamps.",
        "Configure automated notification triggers to verify company laptop recovery within 7 workdays.",
        "Standardize onboarding templates to guarantee key-cyber-awareness briefing is cleared on week 1."
      ]
    }
  },
  {
    "id": "attendance",
    "label": "Attendance",
    "icon": "attendance",
    "categories": [
      "all",
      "core_hr"
    ],
    "reportsSectionTitle": "ATTENDANCE REPORTS AVAILABLE",
    "insights": [
      {
        "label": "ATTENDANCE RATIO",
        "value": "96.2%",
        "sub": "+0.8% peak improvement",
        "subIsPositive": true
      },
      {
        "label": "AVERAGE CLOCK-IN TIME",
        "value": "08:44 AM",
        "sub": "Stable vs target 09:00",
        "subIsPositive": true
      },
      {
        "label": "ACTIVE OVERTIME HOURS",
        "value": "142.5 hrs",
        "sub": "+12.4% seasonal peak",
        "subIsPositive": false
      }
    ],
    "reports": [
      {
        "title": "Employee Attendance Detail Log",
        "tag": "LOGS",
        "description": "Exact time recordings, remote IP geolocation info, and day statuses."
      },
      {
        "title": "Overtime and Shift Premium Register",
        "tag": "OVERTIME",
        "description": "Approved overtime pay credits, night shifts, and multiplier schedules."
      },
      {
        "title": "Absence & Late Arrivals Analysis Sheet",
        "tag": "ABSENCE",
        "description": "Pinpoints late trends, excuse approvals, and absenteeism benchmarks."
      }
    ],
    "quickSnapshot": {
      "totalRecordsLabel": "Total Records",
      "totalRecordsValue": "3,109 Log records",
      "lastUpdated": "Today 18:00",
      "autoRunStatus": "ACTIVE (DAILY)",
      "distributionTitle": "CURRENT WEEK CHECK-IN TYPES",
      "bars": [
        {
          "label": "On-Time Office Work",
          "detail": "112 Staff (73%)",
          "fraction": 0.73,
          "color": "#2563eb"
        },
        {
          "label": "Remote / Home Login Checked",
          "detail": "34 Staff (22%)",
          "fraction": 0.22,
          "color": "#2563eb"
        },
        {
          "label": "Late Clock-in / Grace Period",
          "detail": "8 Staff (5%)",
          "fraction": 0.05,
          "color": "#2563eb"
        }
      ]
    },
    "briefing": {
      "riskLabel": "MEDIUM RISK",
      "riskIsLow": false,
      "riskIsHigh": false,
      "strategicFocus": "Overtime wage leakages & digital shift punctuality trends.",
      "financialImpact": "Overtime payroll premium payouts ($14.5k variance above corporate projection).",
      "directives": [
        "Enforce secondary tier supervisor approvals for overtime work exceeding 10 hours monthly.",
        "Study rotating flex hours for key divisions facing seasonal customer ticket peaks.",
        "In corporate locations, match key card logs against manual portal clock-ins to reduce check-in errors."
      ]
    }
  },
  {
    "id": "leave",
    "label": "Leave",
    "icon": "leave",
    "categories": [
      "all",
      "core_hr"
    ],
    "reportsSectionTitle": "LEAVE REPORTS AVAILABLE",
    "insights": [
      {
        "label": "ACTIVE LEAVES TODAY",
        "value": "4 Staff",
        "sub": "-2 versus last Friday",
        "subIsPositive": true
      },
      {
        "label": "PENDING APPROVALS",
        "value": "9 Requests",
        "sub": "Average turn: 2.2 hours",
        "subIsPositive": true
      },
      {
        "label": "AVG TAKEN BALANCE",
        "value": "12.4 Days",
        "sub": "6.2 days available left",
        "subIsPositive": true
      }
    ],
    "reports": [
      {
        "title": "Department Wise Absence Schedule",
        "tag": "COVERAGE",
        "description": "Comprehensive heat map tracking overlapping holidays and team coverage."
      },
      {
        "title": "Accrued Leave Financial Liability Report",
        "tag": "FINANCE",
        "description": "Calculates unpaid leave payouts, accumulated days, and carried margins."
      },
      {
        "title": "Holiday and Sickness Incident Sheet",
        "tag": "HOLIDAYS",
        "description": "Distributes parental, compassionate, annual, and medical leave data."
      }
    ],
    "quickSnapshot": {
      "totalRecordsLabel": "Total Records",
      "totalRecordsValue": "412 Bookings total",
      "lastUpdated": "Yesterday 17:30",
      "autoRunStatus": "ACTIVE (REALTIME)",
      "distributionTitle": "UTILIZED LEAVE CATEGORIES",
      "bars": [
        {
          "label": "Paid Annual Leave",
          "detail": "280 Days (68%)",
          "fraction": 0.68,
          "color": "#2563eb"
        },
        {
          "label": "Validated Medical Leaves",
          "detail": "92 Days (22%)",
          "fraction": 0.22,
          "color": "#059669"
        },
        {
          "label": "Maternity/Paternity/Other Leaves",
          "detail": "40 Days (10%)",
          "fraction": 0.1,
          "color": "#7c3aed"
        }
      ]
    },
    "briefing": {
      "riskLabel": "MEDIUM RISK",
      "riskIsLow": false,
      "riskIsHigh": false,
      "strategicFocus": "Unfunded book liabilities & year-end resource bottleneck mapping.",
      "financialImpact": "Accrued annual leave cash payout reserves ($42k aggregate exposure).",
      "directives": [
        "Guide supervisors to prompt team annual leave bookings before major product deliverables sprints.",
        "Stagger critical tech roles leaves to secure minimum 80% coverage limits in Q4.",
        "Review recurring sick-leave clusters adjacent to weekends to optimize resource coverage plans."
      ]
    }
  },
  {
    "id": "disciplinary",
    "label": "Disciplinary",
    "icon": "disciplinary",
    "categories": [
      "all",
      "core_hr"
    ],
    "reportsSectionTitle": "DISCIPLINARY REPORTS AVAILABLE",
    "insights": [
      {
        "label": "ACTIVE GRIEVANCES",
        "value": "2 Cases",
        "sub": "1 currently in arbitration",
        "subIsPositive": true
      },
      {
        "label": "WARNING NOTICES ISSUED",
        "value": "4 Letters",
        "sub": "0 escalations in last 90d",
        "subIsPositive": true
      },
      {
        "label": "RESOLVED INQUIRIES",
        "value": "12 Closed",
        "sub": "Mediation rate 94%",
        "subIsPositive": true
      }
    ],
    "reports": [
      {
        "title": "Policy Breach Incident Tracker",
        "tag": "BREACHES",
        "description": "Chronological log of policy violations, severity tiers, and resolution paths."
      },
      {
        "title": "Written Warning Notices Archive",
        "tag": "WARNINGS",
        "description": "Formal warning letters issued, acknowledgment status, and follow-up dates."
      },
      {
        "title": "Mediation & Resolution Log",
        "tag": "MEDIATION",
        "description": "Conflict mediation sessions, outcomes, and HR intervention records."
      }
    ],
    "quickSnapshot": {
      "totalRecordsLabel": "Total Records",
      "totalRecordsValue": "18 Case tickets",
      "lastUpdated": "12 Jun 10:15",
      "autoRunStatus": "ACTIVE (AD-HOC)",
      "distributionTitle": "CURRENT INFRACTION CLUSTERS",
      "bars": [
        {
          "label": "Punctuality & Shift Breaches",
          "detail": "11 Cases (61%)",
          "fraction": 0.61,
          "color": "#2563eb"
        },
        {
          "label": "Safety / Conduct Incidents",
          "detail": "5 Cases (28%)",
          "fraction": 0.28,
          "color": "#059669"
        },
        {
          "label": "Workplace Dispute Inquiries",
          "detail": "2 Cases (11%)",
          "fraction": 0.11,
          "color": "#7c3aed"
        }
      ]
    },
    "briefing": {
      "riskLabel": "HIGH RISK",
      "riskIsLow": false,
      "riskIsHigh": true,
      "strategicFocus": "Interpersonal disputes & litigation exposure mitigation.",
      "financialImpact": "Extremely high potential direct litigation & external mediation services fees.",
      "directives": [
        "Mandate formal compliance code-of-conduct e-refresher courses for all staff with active warnings.",
        "Ensure HR representation is present in PIP reviews exceeding 30-day timelines.",
        "Standardize all incident written files in structured secure servers for legal discovery readiness."
      ]
    }
  },
  {
    "id": "assets",
    "label": "Assets",
    "icon": "assets",
    "categories": [
      "all",
      "core_hr"
    ],
    "reportsSectionTitle": "ASSETS REPORTS AVAILABLE",
    "insights": [
      {
        "label": "LAPTOPS IN SERVICE",
        "value": "144 Units",
        "sub": "100% active and tracked",
        "subIsPositive": true
      },
      {
        "label": "HARDWARE STOCK REMAINING",
        "value": "20 Units",
        "sub": "Re-order point target: 10",
        "subIsPositive": true
      },
      {
        "label": "REPAIR & RMA TICKETS",
        "value": "4 Tickets",
        "sub": "Average swap period: 24h",
        "subIsPositive": true
      }
    ],
    "reports": [
      {
        "title": "Master Hardware Assigned Ledger",
        "tag": "HARDWARE",
        "description": "Exact serial numbers, staff custodian records, and purchase values."
      },
      {
        "title": "Software Licenses and Accrued Keys",
        "tag": "SOFTWARE",
        "description": "Tracks registered SaaS seats, expired logins, and pricing packages."
      },
      {
        "title": "Asset Depreciation Schedule Report",
        "tag": "FINANCE",
        "description": "Establishes remaining book values and estimated replacement dates."
      }
    ],
    "quickSnapshot": {
      "totalRecordsLabel": "Total Records",
      "totalRecordsValue": "184 Company hardware logs",
      "lastUpdated": "11 Jun 16:30",
      "autoRunStatus": "ACTIVE (DAILY)",
      "distributionTitle": "REGISTERED HARDWARE SPLIT",
      "bars": [
        {
          "label": "Developer Laptops (Core OS)",
          "detail": "110 Units (60%)",
          "fraction": 0.6,
          "color": "#2563eb"
        },
        {
          "label": "Office Desktop Terminals",
          "detail": "55 Units (30%)",
          "fraction": 0.3,
          "color": "#059669"
        },
        {
          "label": "Infrastructure Accessories",
          "detail": "19 Units (10%)",
          "fraction": 0.1,
          "color": "#7c3aed"
        }
      ]
    },
    "briefing": {
      "riskLabel": "MEDIUM RISK",
      "riskIsLow": false,
      "riskIsHigh": false,
      "strategicFocus": "Capital hardware lifecycle tracking & unused SaaS subscription retrieval.",
      "financialImpact": "Active laptop shrinkage and idle tooling licenses expenditures ($184k value).",
      "directives": [
        "Automate license key reclamation for high-tier apps with 45+ days of inactivity.",
        "Repurpose three-year-old laptops into secondary dev-test terminals to avoid immediate replacement buys.",
        "Consolidate equipment inventory entries from branch offices to check for regional surplus devices."
      ]
    }
  },
  {
    "id": "payroll",
    "label": "Payroll",
    "icon": "payroll",
    "categories": [
      "all",
      "financials"
    ],
    "reportsSectionTitle": "PAYROLL REPORTS AVAILABLE",
    "insights": [
      {
        "label": "GROSS MONTHLY VALUE",
        "value": "$642,800",
        "sub": "+1.4% change (new hires)",
        "subIsPositive": true
      },
      {
        "label": "DEDUCTIONS & BENEFITS MATCH",
        "value": "$98,400",
        "sub": "Tax withholdings optimal",
        "subIsPositive": true
      },
      {
        "label": "SLIP DISTRIBUTION ACCURACY",
        "value": "100% Sent",
        "sub": "No correction tickets raised",
        "subIsPositive": true
      }
    ],
    "reports": [
      {
        "title": "Global Base Earnings Breakdown",
        "tag": "PAYROLL",
        "description": "Wages ledger with base pay, overtime, adjustments, and shift differentials."
      },
      {
        "title": "Withholding Taxes & Social Security Roll",
        "tag": "TAXES",
        "description": "State, Federal, and municipal taxes, medical premiums, and allocations."
      },
      {
        "title": "Corporate Cost Center Ledger",
        "tag": "BUDGETS",
        "description": "Organizes direct salary expenses by department and custom budget strings."
      }
    ],
    "quickSnapshot": {
      "totalRecordsLabel": "Total Records",
      "totalRecordsValue": "154 Active slip sheets",
      "lastUpdated": "Today 15:45",
      "autoRunStatus": "ACTIVE (MONTHLY)",
      "distributionTitle": "COMPANY PAYROLL ALLOCATIONS",
      "bars": [
        {
          "label": "Core Base Salaries",
          "detail": "$482,100 (75%)",
          "fraction": 0.75,
          "color": "#2563eb"
        },
        {
          "label": "Bonus & Overtime Payouts",
          "detail": "$96,420 (15%)",
          "fraction": 0.15,
          "color": "#059669"
        },
        {
          "label": "Fringe Taxes & Benefit Matches",
          "detail": "$64,280 (10%)",
          "fraction": 0.1,
          "color": "#7c3aed"
        }
      ]
    },
    "briefing": {
      "riskLabel": "LOW RISK",
      "riskIsLow": true,
      "riskIsHigh": false,
      "strategicFocus": "Labor market matching & cost controls across regional payroll centers.",
      "financialImpact": "Represents 64% of total company monthly operating expenditure ($642.8k).",
      "directives": [
        "Run localized compensation reviews against competitor job listings in Q3.",
        "Verify withholding formulas with external general tax guidelines before year-end filings.",
        "Enforce dual-authorization triggers on manual off-cycle wage releases."
      ]
    }
  },
  {
    "id": "claims",
    "label": "Claims",
    "icon": "claims",
    "categories": [
      "all",
      "financials"
    ],
    "reportsSectionTitle": "CLAIMS REPORTS AVAILABLE",
    "insights": [
      {
        "label": "PENDING CLAIM FUNDS",
        "value": "$4,120 USD",
        "sub": "8 claims waiting manager sign",
        "subIsPositive": true
      },
      {
        "label": "TOTAL RETAINED CLAIMS",
        "value": "$14,520 USD",
        "sub": "Approved this billing cycle",
        "subIsPositive": true
      },
      {
        "label": "AVG PAYOUT CYCLE TIME",
        "value": "3.4 Days",
        "sub": "-1.1 days faster resolution",
        "subIsPositive": true
      }
    ],
    "reports": [
      {
        "title": "Travel and Operational Mileage Log",
        "tag": "TRAVEL",
        "description": "Travel ticket receipts, hotel stays, conference seats, and mileage logs."
      },
      {
        "title": "Reimbursements and Operational Bills",
        "tag": "OPERATIONS",
        "description": "Hardware items, client hosting business meals, and office supplies."
      },
      {
        "title": "Audited Claim Deviations & Flags",
        "tag": "AUDITING",
        "description": "Lists policy violation attempts, unverified items, or warning flags."
      }
    ],
    "quickSnapshot": {
      "totalRecordsLabel": "Total Records",
      "totalRecordsValue": "412 Processed expense lines",
      "lastUpdated": "Today 11:20",
      "autoRunStatus": "ACTIVE (DAILY)",
      "distributionTitle": "CURRENT CLAIM CATEGORIES",
      "bars": [
        {
          "label": "Sourced Travel & Logistics",
          "detail": "$7,260 (50%)",
          "fraction": 0.5,
          "color": "#2563eb"
        },
        {
          "label": "Business Client Entertainment",
          "detail": "$4,356 (30%)",
          "fraction": 0.3,
          "color": "#059669"
        },
        {
          "label": "Office Supplies & Miscellaneous",
          "detail": "$2,904 (20%)",
          "fraction": 0.2,
          "color": "#7c3aed"
        }
      ]
    },
    "briefing": {
      "riskLabel": "MEDIUM RISK",
      "riskIsLow": false,
      "riskIsHigh": false,
      "strategicFocus": "Operational spending compliance audits & expense policy enforcement.",
      "financialImpact": "High client entertainment spend ratio (30% of total outbound claims).",
      "directives": [
        "Set strict caps on business dining hospitality allowances based on localized regional indexes.",
        "Audit mileage claims with coordinate validation checks to prevent inaccurate expense declarations.",
        "Establish standard 30-day deadlines for receipt submissions to ensure accurate operational balance tallies."
      ]
    }
  },
  {
    "id": "benefits",
    "label": "Benefits",
    "icon": "benefits",
    "categories": [
      "all",
      "financials"
    ],
    "reportsSectionTitle": "BENEFITS REPORTS AVAILABLE",
    "insights": [
      {
        "label": "BENEFIT USERS REGISTERED",
        "value": "142 Staff",
        "sub": "92% overall selection rate",
        "subIsPositive": true
      },
      {
        "label": "WELLNESS GRANT USED",
        "value": "71% Used",
        "sub": "Budget remaining: $12k",
        "subIsPositive": true
      },
      {
        "label": "TOTAL BENEFITS COST",
        "value": "$34,100 Mo.",
        "sub": "+0.4% from last quarter",
        "subIsPositive": true
      }
    ],
    "reports": [
      {
        "title": "Insurance Premium Distribution Audit",
        "tag": "INSURANCE",
        "description": "PPO, HMO selections, premiums paid, and active dependents tracker."
      },
      {
        "title": "Wellness Grant Usage Registry",
        "tag": "WELLNESS",
        "description": "Reimbursables for athletic equipment, coaching, gyms and lifestyle."
      },
      {
        "title": "Pension Matching Fund Report",
        "tag": "PENSION",
        "description": "Employer contributions, match percentages, and aggregate retirement assets."
      }
    ],
    "quickSnapshot": {
      "totalRecordsLabel": "Total Records",
      "totalRecordsValue": "382 Allocation policies",
      "lastUpdated": "Today 10:11",
      "autoRunStatus": "ACTIVE (DAILY)",
      "distributionTitle": "BENEFIT CHOICES SELECTED",
      "bars": [
        {
          "label": "Standard Medical & Premium PPO",
          "detail": "85 Employees (60%)",
          "fraction": 0.6,
          "color": "#2563eb"
        },
        {
          "label": "Flexible Wellness Credits",
          "detail": "43 Employees (30%)",
          "fraction": 0.3,
          "color": "#059669"
        },
        {
          "label": "Dental & Vision Supplemental Only",
          "detail": "14 Employees (10%)",
          "fraction": 0.1,
          "color": "#7c3aed"
        }
      ]
    },
    "briefing": {
      "riskLabel": "LOW RISK",
      "riskIsLow": true,
      "riskIsHigh": false,
      "strategicFocus": "Benefit program selection yields & medical premium allocations.",
      "financialImpact": "Average flat cost matching totals $34.1k/mo healthcare premium expenses.",
      "directives": [
        "Renegotiate wholesale medical plans by leveraging larger group scales in Q3 vendor negotiations.",
        "Promote gym wellness credits usage to lower long-term chronic clinical claims and sick leave frequency.",
        "Benchmark company pension standard brackets with localized peers to maintain competitive hiring terms."
      ]
    }
  },
  {
    "id": "recruitment",
    "label": "Recruitment",
    "icon": "recruitment",
    "categories": [
      "all",
      "talent_growth"
    ],
    "reportsSectionTitle": "RECRUITMENT REPORTS AVAILABLE",
    "insights": [
      {
        "label": "OPEN REQUISITIONS",
        "value": "12 Positions",
        "sub": "2 filled this week",
        "subIsPositive": true
      },
      {
        "label": "ACTIVE PIPELINE",
        "value": "84 Applicants",
        "sub": "+15 new this week",
        "subIsPositive": true
      },
      {
        "label": "AVERAGE TIME-TO-HIRE",
        "value": "24 Days",
        "sub": "-3 days optimized",
        "subIsPositive": true
      }
    ],
    "reports": [
      {
        "title": "Recruitment Funnel Conversion Flow",
        "tag": "FUNNEL",
        "description": "Stage-by-stage applicant drop-off rates from sourcing to offer acceptance."
      },
      {
        "title": "Cost-Per-Hire & Agency Allocation List",
        "tag": "FINANCE",
        "description": "External recruiter fees, agency spend, and cost-per-hire benchmarks."
      },
      {
        "title": "Interviewer Score Card & Feedback Matrix",
        "tag": "INTERVIEW",
        "description": "Panel feedback scores, interviewer calibration, and hiring decision logs."
      }
    ],
    "quickSnapshot": {
      "totalRecordsLabel": "Total Records",
      "totalRecordsValue": "342 Candidate applications",
      "lastUpdated": "Just now",
      "autoRunStatus": "ACTIVE (REALTIME)",
      "distributionTitle": "ACTIVE RECRUITMENT STAGES",
      "bars": [
        {
          "label": "Sourcing & Resume Screen",
          "detail": "45 Candidates (54%)",
          "fraction": 0.54,
          "color": "#2563eb"
        },
        {
          "label": "Tech Tests & Panel Rounds",
          "detail": "31 Candidates (37%)",
          "fraction": 0.37,
          "color": "#059669"
        },
        {
          "label": "Offer Issuance & Negotiation",
          "detail": "8 Candidates (9%)",
          "fraction": 0.09,
          "color": "#7c3aed"
        }
      ]
    },
    "briefing": {
      "riskLabel": "HIGH RISK",
      "riskIsLow": false,
      "riskIsHigh": true,
      "strategicFocus": "Conversion metrics & sourcing agency expenditure.",
      "financialImpact": "High operational spend ($4,200 avg cost-per-hire) on external recruiters.",
      "directives": [
        "Establish targeted organic hiring campaigns to minimize dependent recruiter commission costs.",
        "Integrate technical screening checkpoints earlier to decrease average panel selection cycle time.",
        "Formulate active internal candidate databases for high-frequency hiring roles to decrease time-to-hire."
      ]
    }
  },
  {
    "id": "performance",
    "label": "Performance",
    "icon": "performance",
    "categories": [
      "all",
      "talent_growth"
    ],
    "reportsSectionTitle": "PERFORMANCE REPORTS AVAILABLE",
    "insights": [
      {
        "label": "AVERAGE CORPORATE RATING",
        "value": "4.2 / 5.0",
        "sub": "High performance metrics overall",
        "subIsPositive": true
      },
      {
        "label": "TARGET KPI ACHIEVEMENT",
        "value": "88.5% Done",
        "sub": "+1.5% since review period",
        "subIsPositive": true
      },
      {
        "label": "EVALUATION COMPLETE RATIO",
        "value": "100% Score",
        "sub": "Perfect manager feedback logs",
        "subIsPositive": true
      }
    ],
    "reports": [
      {
        "title": "Annual Appraisal Level Sheet",
        "tag": "APPRAISAL",
        "description": "Consolidated appraisal scores, rating bands, and manager sign-off status."
      },
      {
        "title": "KPI Achievement & OKR Tracker",
        "tag": "KPIS",
        "description": "Objective completion rates, key result progress, and quarterly roll-ups."
      },
      {
        "title": "Succession Planning Readiness Matrix",
        "tag": "SUCCESSION",
        "description": "Critical role coverage, bench strength, and leadership pipeline depth."
      }
    ],
    "quickSnapshot": {
      "totalRecordsLabel": "Total Records",
      "totalRecordsValue": "154 Active appraisals",
      "lastUpdated": "18 Jun 11:30",
      "autoRunStatus": "ACTIVE (QUARTERLY)",
      "distributionTitle": "REVIEW GRADE DISTRIBUTIONS",
      "bars": [
        {
          "label": "Exceeds Performance Target",
          "detail": "46 Staff (30%)",
          "fraction": 0.3,
          "color": "#2563eb"
        },
        {
          "label": "Solidly Achieved Base Targets",
          "detail": "92 Staff (60%)",
          "fraction": 0.6,
          "color": "#059669"
        },
        {
          "label": "Development / PIP Category",
          "detail": "16 Staff (10%)",
          "fraction": 0.1,
          "color": "#7c3aed"
        }
      ]
    },
    "briefing": {
      "riskLabel": "MEDIUM RISK",
      "riskIsLow": false,
      "riskIsHigh": false,
      "strategicFocus": "Performance alignment with board objectives & variable payout governance.",
      "financialImpact": "Variable bonus payout pool tracking against approved corporate budget caps.",
      "directives": [
        "Calibrate manager rating distributions to prevent grade inflation across divisions.",
        "Link PIP completion milestones to structured coaching resource allocations.",
        "Publish quarterly OKR attainment summaries to division heads before board reviews."
      ]
    }
  },
  {
    "id": "training",
    "label": "Training",
    "icon": "training",
    "categories": [
      "all",
      "talent_growth"
    ],
    "reportsSectionTitle": "TRAINING REPORTS AVAILABLE",
    "insights": [
      {
        "label": "COACHING SESSIONS SCHEDULED",
        "value": "4 Programs",
        "sub": "2 occurring this current week",
        "subIsPositive": true
      },
      {
        "label": "ACTIVE ENROLLED USERS",
        "value": "54 Employees",
        "sub": "+14 new joins enrolled",
        "subIsPositive": true
      },
      {
        "label": "SCHEDULE COMPLETION RATE",
        "value": "94.2%",
        "sub": "Minimal cancellation rates",
        "subIsPositive": true
      }
    ],
    "reports": [
      {
        "title": "Safety and Regulatory Attendance List",
        "tag": "COMPLIANCE",
        "description": "Shows completed courses required for company compliance guidelines."
      },
      {
        "title": "Workforce Core Skills Gap Analysis",
        "tag": "SKILLS",
        "description": "Tracks missing skills, requested themes, and available coach hours."
      },
      {
        "title": "Training Budget and Vendor Invoices",
        "tag": "BUDGETS",
        "description": "Invoices for instructors, classroom rentals, and purchased logs."
      }
    ],
    "quickSnapshot": {
      "totalRecordsLabel": "Total Records",
      "totalRecordsValue": "38 Active schedules",
      "lastUpdated": "Today 13:00",
      "autoRunStatus": "ACTIVE (DAILY)",
      "distributionTitle": "ACTIVE PROGRAM FORMATS",
      "bars": [
        {
          "label": "In-person Practical Labs",
          "detail": "19 Sessions (50%)",
          "fraction": 0.5,
          "color": "#2563eb"
        },
        {
          "label": "Self-Paced Training Videos",
          "detail": "11 Sessions (30%)",
          "fraction": 0.3,
          "color": "#059669"
        },
        {
          "label": "Expert Panel Webinars",
          "detail": "8 Sessions (20%)",
          "fraction": 0.2,
          "color": "#7c3aed"
        }
      ]
    },
    "briefing": {
      "riskLabel": "LOW RISK",
      "riskIsLow": true,
      "riskIsHigh": false,
      "strategicFocus": "Skills catalog expansions & vendor expenditure checks.",
      "financialImpact": "External specialized tutors and training facility booking fees.",
      "directives": [
        "Convert costly custom external seminars into reusable on-demand digital modules inside the LMS.",
        "Implement standard seat verification procedures to reduce pay-per-head empty-seat fees.",
        "Link certification milestones to standard division-level performance review systems."
      ]
    }
  },
  {
    "id": "learning",
    "label": "Learning",
    "icon": "learning",
    "categories": [
      "all",
      "talent_growth"
    ],
    "reportsSectionTitle": "LEARNING REPORTS AVAILABLE",
    "insights": [
      {
        "label": "CORE COURSE MATERIALS",
        "value": "12 Curriculums",
        "sub": "2 updated this month",
        "subIsPositive": true
      },
      {
        "label": "TOTAL LMS ENGAGEMENT",
        "value": "412 Hours",
        "sub": "Average 2.6 hours per employee",
        "subIsPositive": true
      },
      {
        "label": "CERTIFICATIONS ISSUED",
        "value": "22 Badges",
        "sub": "High compliance certification rate",
        "subIsPositive": true
      }
    ],
    "reports": [
      {
        "title": "Compliance Completions Progress Ledger",
        "tag": "COMPLIANCE",
        "description": "Lists employees who have cleared ethical and secure code updates."
      },
      {
        "title": "User LMS Hours & Activity Sheets",
        "tag": "ACTIVITY",
        "description": "Tracks video minutes, quiz counts, and lessons completed."
      },
      {
        "title": "Certification Expiration Warning List",
        "tag": "EXPIRY",
        "description": "Signals certificates expiring within the next sixty days."
      }
    ],
    "quickSnapshot": {
      "totalRecordsLabel": "Total Records",
      "totalRecordsValue": "211 Certification logs",
      "lastUpdated": "14 Jun 09:30",
      "autoRunStatus": "ACTIVE (DAILY)",
      "distributionTitle": "CURRENT COURSE THEME ALLOCATIONS",
      "bars": [
        {
          "label": "Engineering and Technical Tracks",
          "detail": "106 Completed (50%)",
          "fraction": 0.5,
          "color": "#2563eb"
        },
        {
          "label": "Manager Leadership Program",
          "detail": "63 Completed (30%)",
          "fraction": 0.3,
          "color": "#059669"
        },
        {
          "label": "Ethical Workplace Regulations",
          "detail": "42 Completed (20%)",
          "fraction": 0.2,
          "color": "#7c3aed"
        }
      ]
    },
    "briefing": {
      "riskLabel": "LOW RISK",
      "riskIsLow": true,
      "riskIsHigh": false,
      "strategicFocus": "Corporate regulatory compliance checks & critical skill matrices.",
      "financialImpact": "Mitigates regulatory fine exposures for non-compliant industry deployments.",
      "directives": [
        "Deliver automatic system alerts for staff whose regulatory security clearances expire soon.",
        "Examine learning engagement scores to find effective, popular internal curriculum creators.",
        "Enforce ethical workplace learning completions as a required hurdle for annual bonus eligibility."
      ]
    }
  },
  {
    "id": "helpdesk",
    "label": "Helpdesk & Inquiries",
    "icon": "helpdesk",
    "categories": [
      "all",
      "support_engagement"
    ],
    "reportsSectionTitle": "HELPDESK & INQUIRIES REPORTS AVAILABLE",
    "insights": [
      {
        "label": "OPEN INQUIRIES",
        "value": "5 Tickets",
        "sub": "1 designated urgent priority",
        "subIsPositive": true
      },
      {
        "label": "AVG RESOLUTION TIME",
        "value": "1.2 Hours",
        "sub": "-25 minutes since upgrades",
        "subIsPositive": true
      },
      {
        "label": "LOGGED SLA COMPLIANCE",
        "value": "98.4%",
        "sub": "Goal metric benchmark list: 95%",
        "subIsPositive": true
      }
    ],
    "reports": [
      {
        "title": "Support Ticket SLA Performance",
        "tag": "SLA",
        "description": "Tracks reaction logs, manager triggers, and resolution periods."
      },
      {
        "title": "Top Inquiries Theme Analysis",
        "tag": "THEMES",
        "description": "Categorized queries highlighting system outages, payroll errors, or leaves."
      },
      {
        "title": "Staff CSAT Satisfaction Record",
        "tag": "CSAT",
        "description": "Anonymized agent scores, thank-you messages, and response feedback."
      }
    ],
    "quickSnapshot": {
      "totalRecordsLabel": "Total Records",
      "totalRecordsValue": "118 Customer support tickets",
      "lastUpdated": "Just now",
      "autoRunStatus": "ACTIVE (REALTIME)",
      "distributionTitle": "CURRENT TICKETS BY TOPIC",
      "bars": [
        {
          "label": "Admin Portal & Tech Support",
          "detail": "100 Completed (85%)",
          "fraction": 0.85,
          "color": "#2563eb"
        },
        {
          "label": "Correction of Payroll Info",
          "detail": "14 Completed (12%)",
          "fraction": 0.12,
          "color": "#2563eb"
        },
        {
          "label": "Leave Policy Inquiries",
          "detail": "4 Completed (3%)",
          "fraction": 0.03,
          "color": "#2563eb"
        }
      ]
    },
    "briefing": {
      "riskLabel": "LOW RISK",
      "riskIsLow": true,
      "riskIsHigh": false,
      "strategicFocus": "Administrative bottle-necks & internal satisfaction SLA checks.",
      "financialImpact": "SLA lags reduce corporate work productivity and onboarding satisfaction scores.",
      "directives": [
        "Release self-service answers for high-frequency topics like overtime and benefits coverage.",
        "Address recurring login portal and SSO issues with IT to reduce redundant support load.",
        "Maintain the response speed under the 1.5-hour threshold to preserve excellent 98.4% CSAT ratios."
      ]
    }
  },
  {
    "id": "engagement",
    "label": "Engagement",
    "icon": "engagement",
    "categories": [
      "all",
      "support_engagement"
    ],
    "reportsSectionTitle": "ENGAGEMENT REPORTS AVAILABLE",
    "insights": [
      {
        "label": "OVERALL ENGAGEMENT INDEX",
        "value": "84%",
        "sub": "Top tier index level",
        "subIsPositive": true
      },
      {
        "label": "SURVEY RESPONSE RATE",
        "value": "92.4%",
        "sub": "+3.2% high confidence level",
        "subIsPositive": true
      },
      {
        "label": "ANONYMIZED OPEN CARDS",
        "value": "48 Messages",
        "sub": "Action items dispatched to staff",
        "subIsPositive": true
      }
    ],
    "reports": [
      {
        "title": "Overall Pulse Survey Breakdown",
        "tag": "PULSE",
        "description": "Category ratings for environment, peers, management, and training."
      },
      {
        "title": "Anonymized Sentiment Word Analysis",
        "tag": "SENTIMENT",
        "description": "Categorized suggestions focusing on benefits, physical office, or software."
      },
      {
        "title": "Retention Risk Early Warning Roll",
        "tag": "RETENTION",
        "description": "Identifies departments with high levels of workplace dissatisfaction."
      }
    ],
    "quickSnapshot": {
      "totalRecordsLabel": "Total Records",
      "totalRecordsValue": "612 Survey entries",
      "lastUpdated": "15 Jun 17:00",
      "autoRunStatus": "ACTIVE (MONTHLY)",
      "distributionTitle": "DRIVERS OF CORPORATE ENGAGEMENT",
      "bars": [
        {
          "label": "Culture & Workspace Flexibility",
          "detail": "Average 4.6 / 5 (92%)",
          "fraction": 0.92,
          "color": "#2563eb"
        },
        {
          "label": "Leadership Vision & Strategy",
          "detail": "Average 4.2 / 5 (84%)",
          "fraction": 0.84,
          "color": "#059669"
        },
        {
          "label": "Career Growth Opportunities",
          "detail": "Average 3.9 / 5 (78%)",
          "fraction": 0.78,
          "color": "#7c3aed"
        }
      ]
    },
    "briefing": {
      "riskLabel": "MEDIUM RISK",
      "riskIsLow": false,
      "riskIsHigh": false,
      "strategicFocus": "Workforce sentiment indicators & mitigation of key resignation risks.",
      "financialImpact": "Pre-emptive engagement checks prevent costly localized talent walkouts.",
      "directives": [
        "Schedule team discussions for departments with sub-80% engagement scores within 14 days.",
        "Send executive answers to top-voted open card themes within one business week.",
        "Map engagement trend lines against voluntary turnover to identify early warning clusters."
      ]
    }
  }
]

export function reportModuleById(id: string): ReportModuleDefinition | undefined {
  return REPORT_MODULES.find((m) => m.id === id)
}

export function reportModulesForCategory(category: ReportCategoryId, filter = ''): ReportModuleDefinition[] {
  const q = filter.trim().toLowerCase()
  return REPORT_MODULES.filter((m) => {
    if (m.overviewOnly && category !== 'all') return false
    if (!m.categories.includes(category) && !(category === 'all' && m.categories.length > 0)) return false
    if (category !== 'all' && m.overviewOnly) return false
    if (q && !m.label.toLowerCase().includes(q)) return false
    return true
  })
}

// User Roles
export enum UserRole {
  ORGANIZATION_ADMIN = 'ORGANIZATION_ADMIN',
  ORGANIZATION_ANALYST = 'ORGANIZATION_ANALYST',
}

// Risk Categories
export enum RiskCategory {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

// Engagement Status
export enum EngagementStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// Enrollment Status
export enum EnrollmentStatus {
  ENROLLED = 'ENROLLED',
  PENDING = 'PENDING',
  UNENROLLED = 'UNENROLLED',
}

// Organization User
export interface OrganizationUser {
  id: string;
  organizationId: string;
  email: string;
  name: string;
  role: UserRole;
}

// Organization
export interface Organization {
  id: number;
  name: string;
  code: string;
  type: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  subscription_plan: string;
  max_users: number;
  created_at: string;
  updated_at: string;
}

// Dashboard Metrics
export interface DashboardMetrics {
  totalEmployees: number;
  activeUsers: number;
  inactiveUsers: number;
  engagementRate: number;
  programParticipationRate: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  outcomeIndicators?: {
    improved: number;
    stable: number;
    declined: number;
  };
}

// Employee (Limited View for Employer Dashboard)
export interface Employee {
  employee_id: number;
  full_name: string;
  email: string;
  enrollment_status: string;
  engagement_status: string;
  program_assignments: string[];
  risk_category: string;
  last_active_at: string | null;
  is_active: boolean;
}

// Population Health Data (Aggregated)
export interface PopulationHealthData {
  total_enrolled: number;
  bmi_distribution: {
    underweight: {
      count: number;
      percentage: number;
    };
    normal: {
      count: number;
      percentage: number;
    };
    overweight: {
      count: number;
      percentage: number;
    };
    obese: {
      count: number;
      percentage: number;
    };
  };
  blood_pressure_risk: {
    normal: number;
    elevated: number;
    high: number;
  };
  diabetes_risk: {
    low: number;
    moderate: number;
    high: number;
  };
}

// Engagement Metrics
export interface EngagementMetrics {
  login_trends: {
    date: string;
    logins: number;
  }[];
  weekly_active_users: number;
  monthly_active_users: number;
  appointment_metrics: {
    total_booked: number;
    completed: number;
    no_show_rate: number;
  };
  inactivity_flags: {
    "30_days": number;
    "60_days": number;
    "90_days": number;
  };
}

// Report
export interface Report {
  id: string;
  organizationId: string;
  reportType: string;
  generatedBy: string;
  generatedAt: Date;
  format: 'PDF' | 'CSV';
  status: 'GENERATING' | 'COMPLETED' | 'FAILED';
  downloadUrl?: string;
}

// Export History
export interface ExportHistory {
  id: string;
  organizationId: string;
  exportedBy: string;
  exportedAt: Date;
  dataType: string;
  format: 'PDF' | 'CSV';
  recordCount: number;
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

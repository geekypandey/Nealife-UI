export interface AccountDashboardDetails {
  companyName?: any;
  companyId?: any;
  totalNotification: string;
  assessmentTaken: string;
  assessmentRemains: string;
  notifications: any[];
}

export interface AccountDashboard {
  companyName: string;
  companyId: string;
  companyType?: any;
  totalAssessments: string;
  totalCredits: string;
  availableCredits: string;
  usedCredits: string;
  assessments: Assessment[];
  saDashboard?: any;
}

interface Assessment {
  id: number;
  companyId: number;
  parentCompanyId?: any;
  companyName: string;
  assessmentId?: number;
  assessmentName: string;
  scheduleDate: string;
  emailTemplate?: any;
  reportTemplate?: any;
  timeLimit: number;
  totalCredits: number;
  availableCredits: number;
  usedCredits: number;
  allocatedCredits: number;
  price: number;
  validFrom: string;
  validTo: string;
  companyAssessmentGroupId?: number;
  companyAssessmentGroupBranchMappingId?: any;
  url: string;
}

export interface Profile {
  login: string;
  role: 'ROLE_SUPER_ADMIN';
  roleDisplayName: string;
  action: string;
  companyId: string;
  companyName: string;
  privilege: string[];
}

export interface Account {
  id: number;
  login: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string;
  activated: boolean;
  langKey: string;
  createdBy: string;
  createdDate: null;
  lastModifiedBy: string;
  lastModifiedDate: string;
  authorities: string[];
  action: string;
  companyId: string;
  companyName: string;
  privilege: string[];
}

export interface CompetencyAspectProjections {
  competency: string;
  childAspect: string;
  childAspectType: string;
  parentAspect: string;
  parentAspectType: string;
}

export interface CompetencyAspectItemROCount {
  aspectCount: string;
  competencyCount: string;
  itemCount: string;
  responseOptionCount: string;
}

export interface Company {
  id: number;
  serialNo: null;
  name: string;
  contactPerson: string;
  email: string;
  address: string;
  contactNumber1: string;
  contactNumber2: null;
  status: string;
  emailTemplateId: null;
  emailTemplateName: null;
  totalPayment: null;
  paymentDate: null;
  companyType: number;
  partnerType: number;
  companyTypeName: null;
  parentId: number;
  parentName: string;
  website: string;
  logoUrl: string;
  brandingId: null;
  validFrom?: string;
  validTo?: string;
}

export interface CompanyQuery {
  'id.equals': string;
  'parent.equals': string;
  [key: string]: string;
}

export interface SidebarMenu {
  label: string;
  icon: string;
  url?: string;
  privilege: string;
  children?: SidebarMenu[];
}

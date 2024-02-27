import { Moment } from 'moment';
import { USER_ROLE } from 'src/app/constants/user-role.constants';
import { ActivityStatus, ICompanyAssessment } from './assessment-group/assessment-group.model';

export interface AccountDashboardDetails {
  companyName?: any;
  companyId?: any;
  totalNotification: string;
  assessmentTaken: string;
  assessmentRemains: string;
  notifications: any[];
}

export interface Assessment {
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

export interface AccountDashboard {
  companyName?: any;
  companyId?: any;
  companyType?: any;
  totalAssessments?: any;
  totalCredits: string;
  availableCredits: string;
  usedCredits: string;
  assessments?: any;
  saDashboard: SaDashboard[];
}

export interface SaDashboard {
  companyName: string;
  companyId: number;
  companyAssessmentId?: any;
  companyAssessmentGroupId?: any;
  companyAssessmentGroupBranchId?: any;
  allottedAssessments: number;
  assessmentsLeftToAssign: number;
  assessmentName?: any;
}

export interface Profile {
  login: string;
  role: USER_ROLE;
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

export interface ICompetencyAspectProjection {
  competency: string;
  childAspect: string;
  childAspectType: string;
  parentAspect: string;
  parentAspectType: string;
}

export class CompetencyAspectProjection implements ICompetencyAspectProjection {
  constructor(
    public competency: string,
    public childAspect: string,
    public childAspectType: string,
    public parentAspect: string,
    public parentAspectType: string
  ) {}
}

export interface CompetencyAspectItemROCount {
  aspectCount: string;
  competencyCount: string;
  itemCount: string;
  responseOptionCount: string;
}

export interface MasterDataDetails {
  question: string;
  itemKey: string;
  fiHigh: string;
  fiBelowAverage: string;
  fiLow: string;
  choice: string;
  weight?: any;
}

export interface ICompany {
  id?: number;
  serialNo?: number;
  name?: string;
  contactPerson?: string;
  email?: string;
  address?: string;
  contactNumber1?: string;
  contactNumber2?: string;
  status?: ActivityStatus;
  validFrom?: Moment;
  validTo?: Moment;
  companyType?: string;
  partnerType?: string;
  parentName?: string;
  parentId?: number;
  website?: string;
  assessments?: ICompanyAssessment[];
  gstNumber?: string;
  brandingId?: string;
  [key: string]: any;
}

export class Company implements ICompany {
  [key: string]: any;
  constructor(
    public id?: number,
    public serialNo?: number,
    public name?: string,
    public contactPerson?: string,
    public email?: string,
    public address?: string,
    public contactNumber1?: string,
    public contactNumber2?: string,
    public status?: ActivityStatus,
    // public validFrom?: Moment,
    // public validTo?: Moment,
    public companyType?: string,
    public parentName?: string,
    public parentId?: number,
    public website?: string,
    public assessments?: ICompanyAssessment[],
    public gstNumber?: string,
    public brandingId?: string
  ) {}
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
  toggleMenu?: boolean;
  children?: SidebarMenu[];
}

export interface IApplicationUserAssessment {
  id: number;
  activationkey?: any;
  rawScore?: any;
  activated: boolean;
  userResponse: string;
  status: string;
  reportId: number;
  userId: number;
  companyId: number;
  userName: string;
  assessmentId?: number;
  assessmentName?: string;
  notificationSent?: string;
  linkAccessedOn: string;
  companyName: string;
  startTime?: any;
  endTime?: any;
  assessmentGroupId?: number;
  assessmentGroupName?: string;
  reportUrl: string;
  contactNumber1: string;
}

export interface ILookup {
  id?: number;
  type?: string;
  subType?: string;
  key?: string;
  value?: string;
}

export class Lookup implements ILookup {
  constructor(
    public id?: number,
    public type?: string,
    public subType?: string,
    public key?: string,
    public value?: string
  ) {}
}

export const enum AssesmentStatus {
  SCHEDULED = 'SCHEDULED',
  INPROGRESS = 'INPROGRESS',
  COMPLETED = 'COMPLETED',
  INVALID = 'INVALID',
}

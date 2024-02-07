import { Moment } from 'moment';

export const enum ActivityStatus {
  ACTIVE = 'ACTIVE',

  INACTIVE = 'INACTIVE',

  TERMINATE = 'TERMINATE',
}
export interface IAssessmentGroup {
  id?: number;
  name?: string;
  description?: string;
  status?: ActivityStatus;
  // price?: string;
  accountAssessmentGroupId?: string;
  assessmentGroupId?: string;
  displayName?: string;
  resultGenerator?: string;
  instructions?: string;
  landingPage?: string;
  price?: number;
  demographics?: any;
  reportType?: string;
}

export class AssessmentGroup implements IAssessmentGroup {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public status?: ActivityStatus,
    public price?: number,
    public accountAssessmentGroupId?: string,
    public assessmentGroupId?: string
  ) {}
}

export interface IAssessment {
  id?: number;
  name?: string;
  description?: string;
  abbreviation?: string;
  industry?: string;
  experienceRange?: string;
  status?: ActivityStatus;
  validFrom?: Moment;
  validTo?: Moment;
  questions?: any;
  typeId?: number;
  companies?: ICompanyAssessment[];
  users?: IApplicationUserAssessment[];
  competencies?: IAssessmentCompetency[];
  emails?: IEmailTemplate[];
  clonedFromId?: number;
  categoryId?: number;
  displayName?: string;
  resultGenerator?: string;
  instruction?: string;
  landingPage?: string;
  price?: number;
  demographics?: string;
  editSelectedOption?: string;
  showBackButton?: string;
  showSkipButton?: string;
  showPreviewSection?: string;
  compulsory?: string;
  reportType?: string;
}

export interface IEmailTemplate {
  id?: number;
  name?: string;
  to?: string;
  cC?: string;
  body?: any;
  assessmentId?: number;
}

export class EmailTemplate implements IEmailTemplate {
  constructor(
    public id?: number,
    public name?: string,
    public to?: string,
    public cC?: string,
    public body?: any,
    public assessmentId?: number
  ) {}
}

export interface IAssessmentCompetency {
  id?: number;
  competencyId?: number;
  assessmentId?: number;
}

export class AssessmentCompetency implements IAssessmentCompetency {
  constructor(
    public id?: number,
    public competencyId?: number,
    public assessmentId?: number
  ) {}
}

export const enum AssesmentStatus {
  SCHEDULED = 'SCHEDULED',

  INPROGRESS = 'INPROGRESS',

  COMPLETED = 'COMPLETED',

  INVALID = 'INVALID',
}

export interface IApplicationUserAssessment {
  id?: number;
  activationkey?: string;
  rawScore?: number;
  activated?: boolean;
  userResponse?: any;
  status?: AssesmentStatus;
  reportId?: number;
  userId?: number;
  assessmentId?: number;
  companyName?: string;
  companyId?: number;
}

export class ApplicationUserAssessment implements IApplicationUserAssessment {
  constructor(
    public id?: number,
    public activationkey?: string,
    public rawScore?: number,
    public activated?: boolean,
    public userResponse?: any,
    public status?: AssesmentStatus,
    public reportId?: number,
    public userId?: number,
    public assessmentId?: number,
    public companyName?: string,
    public companyId?: number
  ) {
    this.activated = this.activated || false;
  }
}

export interface ICompanyAssessment {
  id?: number;
  companyId?: number;
  assessmentName?: string;
  assessmentId?: number;
  scheduleDate?: string;
  assessmentDate?: any;
  reportTemplate?: any;
  emailTemplate?: any;
  timeLimit?: number;
  url?: string;
  totalCredits?: number;
  availableCredits?: number;
  usedCredits?: number;
  allocatedCredits?: number;
  price?: number;
  assessmentGroupId?: number;
}

export class CompanyAssessment implements ICompanyAssessment {
  constructor(
    public id?: number,
    public companyId?: number,
    public assessmentId?: number
  ) {}
}

export interface AssessmentGroupDetails {
  id: number;
  name: string;
  description: string;
  abbreviation: string;
  industry?: any;
  experienceRange?: any;
  status: string;
  validFrom: string;
  validTo: string;
  questions?: any;
  instruction: string;
  typeId?: any;
  clonedFromId?: any;
  categoryId?: any;
  price: number;
  displayName: string;
  reportType: string;
  demographics: string;
  landingPage: string;
  resultGenerator: string;
  editSelectedOption: boolean;
  showBackButton: boolean;
  showSkipButton: boolean;
  showPreviewSection: boolean;
  compulsory: boolean;
  displayInSignup: boolean;
}

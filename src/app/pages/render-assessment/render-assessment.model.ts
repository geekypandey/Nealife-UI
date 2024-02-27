import { PreAssessmentSectionDetailsRequest } from './assessment-stepper/assessment-section.model';

export interface RenderAssessmentResponse {
  companyId: number;
  companyAssessmentId: number | null;
  companyAssessmentGroupId: number;
  companyAssessmentGroupBranchMappingId?: any;
  assessmentGroupId: number;
  uuid: string;
  timeLimit: number;
  instructionPage: Language;
  landingPage: string;
  displayName: string;
  reportType: string | null;
  editSelectedOption: boolean;
  showBackButton: boolean;
  showSkipButton: boolean;
  showPreviewSection: boolean;
  compulsory: boolean;
  demographics: Demographic[];
  assessments: Assessment[];
  logoUrl?: string;
}

export interface Assessment {
  assessmentId: number;
  assessmentName: string;
  displayName: string;
  pauseTime: number;
  timeLimit: number;
  sections: Section[];
  instructionPage: Language;
}

export type TotalAssessments = Assessment & { itemAspects: ItemAspect[] };

export interface Section {
  id?: any;
  name: string;
  text?: any;
  image?: any;
  html?: any;
  assessmentId?: any;
  sequence: number;
  itemAspects: ItemAspect[];
  images: any[];
  languages: Languages;
}

interface Languages {}

export interface ItemAspect {
  question: string;
  itemKey: string;
  answerOptions: AnswerOption[];
  itemAspectId: number;
  questionImage: QuestionImage;
  answerImage?: any;
  language: Language;
  selectedAnswer: SelectedAnswer;
}

interface SelectedAnswer {
  groupId?: any;
  assessmentId?: any;
  itemAspectId: number;
  itemKey: string;
  choice?: any;
  score?: any;
  weight?: any;
  language?: any;
}

interface QuestionImage {
  English: string;
  Marathi: string;
  [key: string]: string;
}

interface AnswerOption {
  groupId?: any;
  assessmentId: number;
  itemAspectId: number;
  itemKey: string;
  choice: string;
  score: number;
  weight: number;
  language: Language;
}

interface Language {
  English: string;
  Marathi: string;
  [key: string]: string;
}

export interface Demographic {
  language: string;
  key: string;
  value: string;
  value1?: any;
  value2?: any;
}

export class PreAssessDetailsReqPayload {
  companyId: string | null;
  assessmentGroupId: number | null;
  companyAssessmentGroupId: number | null;
  companyAssessmentGroupBranchMappingId: number | null;
  groupId: null;
  isGroup: string | null;
  assessmentUUID: string | null;
  assessmentId: null;
  demographics: Demographic | null;
  answers: any[];
  emailReport: null;
  language: null;
  creditCode: string | null;
  companyAssessmentId: number | null;
  constructor() {
    this.companyId = null;
    this.assessmentGroupId = null;
    this.companyAssessmentGroupId = null;
    this.companyAssessmentGroupBranchMappingId = null;
    this.groupId = null;
    this.isGroup = null;
    this.assessmentUUID = null;
    this.assessmentId = null;
    this.demographics = null;
    this.answers = [];
    this.emailReport = null;
    this.language = null;
    this.creditCode = null;
    this.companyAssessmentId = null;
  }
}

export interface PreAssessmentDetailsResponse {
  id: number;
  creditCode: string;
  companyId: number;
  assessmentGroupId: number;
  companyAssessmentId?: any;
  companyAssessmentGroupId: number;
  companyAssessmentGroupBranchMappingId?: any;
  isGroup: string;
  reportType?: any;
  assessmentUUID: string;
  assessmentId?: any;
  emailReport?: any;
  language?: any;
  assessmentDate: string;
  demographics: PreAssessmentDetailsDemographics;
  sectionDetails?: PreAssessmentSectionDetailsRequest[];
}

export interface PreAssessmentDetailsDemographics {
  id?: any;
  code: string;
  userName?: any;
  firstName: string;
  lastName: string;
  email: string;
  address?: any;
  contactNumber1?: any;
  contactNumber2?: any;
  langKey?: any;
  status?: any;
  dateOfBirth: string;
  company?: any;
  companyName?: any;
  manager?: any;
  managerName?: any;
  gender: number;
  genderName?: any;
  education?: any;
  educationName?: any;
  occupation?: any;
  occupationName?: any;
  experience?: any;
  experienceName?: any;
  designation?: any;
  designationName?: any;
  ethnicity?: any;
  ethnicityName?: any;
  career?: any;
  careerName?: any;
  nationality?: any;
  nationalityName?: any;
  income?: any;
  incomeName?: any;
  location: number;
  locationName?: any;
  age?: any;
  ageName?: any;
  isGroup: string;
  groupSequence?: any;
  fullName?: any;
  place: string;
  standard: number;
  educationEditable?: any;
  instituteName?: any;
  sectors?: any;
  engBranch?: any;
  mbaBranch?: any;
  designationEditable?: any;
  qualification?: any;
}

export interface CheckCreditUsed {
  type?: any;
  key: string;
  message?: any;
  data: string;
}

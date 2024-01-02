export interface RenderAssessment {
  companyId: number;
  companyAssessmentGroupId: number;
  companyAssessmentGroupBranchMappingId?: any;
  assessmentGroupId: number;
  uuid: string;
  timeLimit: number;
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

interface ItemAspect {
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

export class AssessmentAnswer {
  companyId: string | null;
  assessmentGroupId: number | null;
  companyAssessmentGroupId: number | null;
  groupId: null;
  isGroup: string | null;
  assessmentUUID: string | null;
  assessmentId: null;
  demographics: Demographic | null;
  answers: any[];
  emailReport: null;
  language: null;
  constructor() {
    this.companyId = null;
    this.assessmentGroupId = null;
    this.companyAssessmentGroupId = null;
    this.groupId = null;
    this.isGroup = null;
    this.assessmentUUID = null;
    this.assessmentId = null;
    this.demographics = null;
    this.answers = [];
    this.emailReport = null;
    this.language = null;
  }
}

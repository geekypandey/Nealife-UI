export interface RenderAssessment {
  companyId: number;
  companyAssessmentGroupId: number;
  companyAssessmentGroupBranchMappingId?: any;
  assessmentGroupId: number;
  uuid: string;
  timeLimit: number;
  landingPage: string;
  displayName: string;
  reportType: string;
  editSelectedOption: boolean;
  showBackButton: boolean;
  showSkipButton: boolean;
  showPreviewSection: boolean;
  compulsory: boolean;
  demographics: Demographic[];
  assessments: Assessment[];
}

interface Assessment {
  assessmentId: number;
  assessmentName: string;
  displayName: string;
  pauseTime: number;
  timeLimit: number;
  sections: Section[];
  instructionPage: Language;
}

interface Section {
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
  English?: string;
  Marathi?: string;
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
}

export interface Demographic {
  language: string;
  key: string;
  value: string;
  value1?: any;
  value2?: any;
}

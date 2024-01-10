export interface PreAssessmentSectionDetailsRequest {
  answers: Answer[];
  assessmentId: number;
  id?: number;
  preAssessmentDetailsId: number;
  stats: Stat[];
}

export interface Stat {
  id?: any;
  userUUID?: any;
  userId?: any;
  assessmentGroupId?: any;
  assessmentId: number;
  startTime?: any;
  endTime?: any;
  assessmentStartTime: string;
  assessmentEndTime: string;
  assessmentName?: any;
  assessmentGroupName?: any;
  saveStartTime?: any;
  saveEndTime?: any;
  saveAssessmentStartTime?: any;
  saveAssessmentEndTime?: any;
  totalQuestions: number;
  questionsAttemppted?: any;
  questionsUnattempted: number;
  questionsSkipped: number;
}

export interface Answer {
  groupId: number;
  assessmentId: number;
  itemAspectId: number;
  itemKey: string;
  choice: string;
  score: number;
  weight: number;
  language?: any;
}

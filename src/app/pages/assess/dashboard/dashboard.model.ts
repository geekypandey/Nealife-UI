export interface AssessNotification {
  id: number;
  fileName?: any;
  userName?: any;
  notificationStatus: string;
  assessmentStatus: string;
  sentOn?: any;
  notificationSent?: any;
  assessmentTakenDate?: any;
  assessmentTaken?: any;
  companyId: number;
  companyAssessmentId: number;
  companyAssessmentGroupId?: any;
  companyAssessmentGroupBranchMappingId?: any;
  contactNumber?: any;
  embeddCreditCode: string;
  creditCode: string;
  sendReportTo?: any;
}

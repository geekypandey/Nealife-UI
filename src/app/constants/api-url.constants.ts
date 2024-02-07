import { environment } from 'src/environments/environment';

export const BASE_URL = environment.API_BASE_URL + '/api';
export const API_URL = {
  login: BASE_URL + '/authenticate',
  getLoggedInUser: BASE_URL + '/users/getLoggedInUser',
  account: BASE_URL + '/account',

  competencyAspectProjections:
    BASE_URL + '/competencyAspectProjections?page=0&size=5000&sort=competency,desc',
  competencyAspectItemROCount: BASE_URL + '/competencies/getCompetencyAspectItemROCount',
  accountDashboard: BASE_URL + '/account-dashboard',
  accountDashboardDetails: BASE_URL + '/notifications/dashboard',
  companies: BASE_URL + '/companies',
  lookup: BASE_URL + '/lookups',
  applicationUserAssessment: BASE_URL + '/application-user-assessments',
  applicationUsers: BASE_URL + '/application-users',
  assessmentsByGroup: BASE_URL + '/assessment-groups',
  assessmentsByGroupDetails: BASE_URL + '/get-assessments-by-assessments-group',
  downloadHtmlReportUrl: BASE_URL + '/downloadHtmlReport',
  downloadPdfReportUrl: BASE_URL + '/downloadPdfReport',

  assessment: BASE_URL + '/assessments/renderNewAssesment',
  assessmentJson: BASE_URL + '/assessments/getAssessmentJson',
  checkCreditCode: BASE_URL + '/checkCreditUsed',
  branchAssessmentCourseFitURL: BASE_URL + '/assessments/renderNewAssesmentForCourseFit',
  assessmentName: BASE_URL + '/signup-assessments-fordropdown',
  createOrder: BASE_URL + '/createOrder',
  verifyOrder: BASE_URL + '/verifyOrder',

  preAssessmentDetails: BASE_URL + '/pre-assessment-details',
  preAssessmentSectionDetails: BASE_URL + '/pre-assessment-section-details',
  submitGroupResult: BASE_URL + '/submitGroupResult',
};

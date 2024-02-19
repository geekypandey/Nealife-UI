import { environment } from 'src/environments/environment';

export const BASE_URL = environment.API_BASE_URL + '/api';
export const API_URL = {
  login: BASE_URL + '/authenticate',
  getLoggedInUser: BASE_URL + '/users/getLoggedInUser',
  account: BASE_URL + '/account',
  resetPassword: BASE_URL + '/account/reset-password/init',
  competencyAspectProjections:
    BASE_URL + '/competencyAspectProjections?page=0&size=5000&sort=competency,desc',
  competencyAspectItemROCount: BASE_URL + '/competencies/getCompetencyAspectItemROCount',
  getAspectProjectionListURL: BASE_URL + '/itemAspectProjections',
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
  competencies: BASE_URL + '/competencies',
  aspects: BASE_URL + '/aspects',
  items: BASE_URL + '/items',
  responseOptions: BASE_URL + '/response-options',
  norms: BASE_URL + '/norms',

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

  companyAssessments: BASE_URL + '/company-assessments',
  assessmentForDropDown: BASE_URL + '/company-assessments/fordropdown',

  payment: BASE_URL + '/payments',
  assignGroup: BASE_URL + '/company-assessment-groups',
  downloadCredits: BASE_URL + '/download-credits',

  assessments: BASE_URL + '/assessments',
  assessmentCompetencies: BASE_URL + '/assessment-competencies',
  competencyAspects: BASE_URL + '/competency-aspects',
  aspectItems: BASE_URL + '/aspect-items',
  assessmentGroup: BASE_URL + '/assessment-group-assessments',
  competenciesForDropdown: BASE_URL + '/competencies-forDropdown',
  assessmentsForDropdown: BASE_URL + '/assessments-fordropdown',
};

export const BASE_URL = '/nealife/api';
export const API_URL = {
  login: BASE_URL + '/authenticate',
  getLoggedInUser: BASE_URL + '/users/getLoggedInUser',
  account: BASE_URL + '/account',

  competencyAspectProjections:
    BASE_URL + '/competencyAspectProjections?page=0&size=5000&sort=competency,desc',
  competencyAspectItemROCount: BASE_URL + '/competencies/getCompetencyAspectItemROCount',
  companies: BASE_URL + '/companies',
  lookup: BASE_URL + '/lookups',

  assessment: BASE_URL + '/assessments/renderNewAssesment',
  assessmentJson: BASE_URL + '/assessments/getAssessmentJson',
  checkCreditCode: BASE_URL + '/checkCreditUsed',
  isCreditUsedBefore: BASE_URL + '/pre-assessment-details',
  branchAssessmentCourseFitURL: BASE_URL + '/assessments/renderNewAssesmentForCourseFit',
};

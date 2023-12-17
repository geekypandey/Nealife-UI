export const BASE_URL = '/nealife/api';
export const API_URL = {
  login: BASE_URL + '/authenticate',
  getLoggedInUser: BASE_URL + '/users/getLoggedInUser',
  account: BASE_URL + '/account',

  competencyAspectProjections:
    BASE_URL + '/competencyAspectProjections?page=0&size=5000&sort=competency,desc',
};

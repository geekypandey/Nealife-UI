import { Route } from '@angular/router';
import { Authority } from 'src/app/constants/authority.constants';

export const companyAssessmentRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./company-assessment.component').then(
        c => c.CompanyAssessmentComponent
      ),
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
    },
  },
  {
    path: ':id/view',
    loadComponent: () =>
      import('./company-assessment-details/company-assessment-details.component').then(
        c => c.CompanyAssessmentDetailsComponent
      ),
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
    },
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./company-assessment-update/company-assessment-update.component').then(
        c => c.CompanyAssessmentUpdateComponent
      ),
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
    },
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./company-assessment-update/company-assessment-update.component').then(
        c => c.CompanyAssessmentUpdateComponent
      ),
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
    },
  },

  // {
  //   path: 'view-assessment-test',
  //   component: ViewAssessmentTestComponent,
  //   data: {
  //     authorities: [Authority.ACCOUNT_ADMIN, Authority.NEA_ADMIN, Authority.ADMIN, Authority.SUPER_ADMIN],
  //     pageTitle: 'nealifeApp.competencyAspect.home.title',
  //   },
  //   canActivate: [UserRouteAccessService],
  // },
];

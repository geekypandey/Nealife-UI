import { Route } from '@angular/router';
import { Authority } from 'src/app/constants/authority.constants';
import { authGuard } from 'src/app/guards/is-authorized.guard';
import { ViewAssessmentTestComponent } from '../view-assessment-test/view-assessment-test.component';

export const companyAssessmentGroupRoutes: Route[] = [
//   {
//     path: ':id/view',
//     loadComponent: () =>
//       import('./company-assessment-details/company-assessment-details.component').then(c => c.CompanyAssessmentDetailsComponent),
//     data: {
//       authorities: [
//         Authority.ACCOUNT_ADMIN,
//         Authority.NEA_ADMIN,
//         Authority.ADMIN,
//         Authority.SUPER_ADMIN,
//       ],
//     },
//   },
  {
    path: '',
    loadComponent: () =>
      import('./company-assessment-group.component').then(c => c.CompanyAssessmentGroupComponent),
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
      import('./company-assessment-group-update/company-assessment-group-update.component').then(c => c.CompanyAssessmentGroupUpdateComponent),
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
      import('./company-assessment-group-update/company-assessment-group-update.component').then(c => c.CompanyAssessmentGroupUpdateComponent),
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
    path: 'view-assessment-test',
    component: ViewAssessmentTestComponent,
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'nealifeApp.competencyAspect.home.title',
    },
    canActivate: [authGuard],
  },
//   {
//     path: 'add',
//     loadComponent: () =>
//       import('./company-assessment-update/company-assessment-update.component').then(c => c.CompanyAssessmentUpdateComponent),
//     data: {
//       authorities: [
//         Authority.ACCOUNT_ADMIN,
//         Authority.NEA_ADMIN,
//         Authority.ADMIN,
//         Authority.SUPER_ADMIN,
//       ],
//     },
//   }
]
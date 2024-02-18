import { Route } from '@angular/router';
import { Authority } from 'src/app/constants/authority.constants';

export const companyAssessmentRoutes: Route[] = [
  {
    path: ':id/view',
    loadComponent: () =>
      import('./company-assessment-details/company-assessment-details.component').then(c => c.CompanyAssessmentDetailsComponent),
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
      import('./company-assessment-edit/company-assessment-edit.component').then(c => c.CompanyAssessmentEditComponent),
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
    },
  }
]
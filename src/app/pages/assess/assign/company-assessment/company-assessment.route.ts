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
]
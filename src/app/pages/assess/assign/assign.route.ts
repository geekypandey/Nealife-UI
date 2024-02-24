import { Route } from '@angular/router';
import { Authority } from 'src/app/constants/authority.constants';

export const assignRoute: Route[] = [
  {
    path: '',
    loadComponent: () => import('./assign.component').then(c => c.AssignComponent),
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
    path: 'company-assessment',
    loadChildren: () =>
      import('./company-assessment/company-assessment.route').then(c => c.companyAssessmentRoutes),
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
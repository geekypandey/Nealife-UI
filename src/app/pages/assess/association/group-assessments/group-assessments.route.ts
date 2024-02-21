import { Route } from '@angular/router';
import { Authority } from 'src/app/constants/authority.constants';
import { ASSOCIATION_TAB_INDEX } from '../association.component';

export const groupAssessmentsRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('../association.component').then(c => c.AssociationComponent),
    data: {
      tabIndex: ASSOCIATION_TAB_INDEX.GROUP_ASSESSMENTS,
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
    loadComponent: () => import('./group-assessments-update/group-assessments-update.component').then(c => c.GroupAssessmentsUpdateComponent),
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
    loadComponent: () => import('./group-assessments-update/group-assessments-update.component').then(c => c.GroupAssessmentsUpdateComponent),
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
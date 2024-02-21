import { Route } from '@angular/router';
import { Authority } from 'src/app/constants/authority.constants';
import { ASSOCIATION_TAB_INDEX } from '../association.component';

export const competencyAspectRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('../association.component').then(c => c.AssociationComponent),
    data: {
      tabIndex: ASSOCIATION_TAB_INDEX.COMPETENCY_ASPECT,
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
    loadComponent: () => import('./competency-aspect-update/competency-aspect-update.component').then(c => c.CompetencyAspectUpdateComponent),
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
    loadComponent: () => import('./competency-aspect-update/competency-aspect-update.component').then(c => c.CompetencyAspectUpdateComponent),
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
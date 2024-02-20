import { Route } from '@angular/router';
import { Authority } from 'src/app/constants/authority.constants';
import { ASSOCIATION_TAB_INDEX } from '../association.component';

export const aspectItemRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('../association.component').then(c => c.AssociationComponent),
    data: {
      tabIndex: ASSOCIATION_TAB_INDEX.ASPECT_ITEM,
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
    loadComponent: () => import('./aspect-item-update/aspect-item-update.component').then(c => c.AspectItemUpdateComponent),
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
    loadComponent: () => import('./aspect-item-update/aspect-item-update.component').then(c => c.AspectItemUpdateComponent),
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
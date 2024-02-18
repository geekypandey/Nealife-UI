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
    path: ':id/edit',
    loadComponent: () =>
      import('./assign-edit/assign-edit.component').then(c => c.AssignEditComponent),
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
      import('./assign-edit/assign-edit.component').then(c => c.AssignEditComponent),
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
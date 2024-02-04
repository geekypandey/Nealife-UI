import { Route } from '@angular/router';
import { Authority } from 'src/app/constants/authority.constants';

export const companyRoute: Route[] = [
  {
    path: '',
    loadComponent: () => import('./company.component').then(c => c.CompanyComponent),
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
      import('./company-detail/company-detail.component').then(c => c.CompanyDetailComponent),
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
      import('./company-edit/company-edit.component').then(c => c.CompanyEditComponent),
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
      import('./company-edit/company-edit.component').then(c => c.CompanyEditComponent),
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
    },
  },
];

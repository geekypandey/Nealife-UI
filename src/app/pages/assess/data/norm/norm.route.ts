import { Routes } from '@angular/router';
import { Authority } from 'src/app/constants/authority.constants';
import { NormDetailComponent } from './norm-detail/norm-detail.component';
import { NormUpdateComponent } from './norm-update/norm-update.component';
import { NormComponent } from './norm.component';

export const normRoute: Routes = [
  {
    path: '',
    component: NormComponent,
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      defaultSort: 'id,desc',
      pageTitle: 'nealifeApp.norm.home.title',
    },
  },
  {
    path: ':id/view',
    component: NormDetailComponent,
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'nealifeApp.norm.home.title',
    },
  },
  {
    path: 'new',
    component: NormUpdateComponent,
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'nealifeApp.norm.home.title',
    },
  },
  {
    path: ':id/edit',
    component: NormUpdateComponent,
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'nealifeApp.norm.home.title',
    },
  },
];
import { Routes } from '@angular/router';
import { Authority } from 'src/app/constants/authority.constants';
import { authGuard } from 'src/app/guards/is-authorized.guard';
import { MasterDataComponent } from './master-data.component';
import { MasterDetailComponent } from './master-detail/master-detail.component';

export const masterDataRoutes: Routes = [
  {
    path: '',
    data: {
      authorities: [
        Authority.ADMIN,
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'home.title',
    },
    canActivate: [authGuard],
    component: MasterDataComponent,
  },
  {
    path: 'master-data-details',
    data: {
      authorities: [
        Authority.ADMIN,
        Authority.ADMIN,
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'home.title',
    },
    canActivate: [authGuard],
    component: MasterDetailComponent,
  },
];

import { Routes } from '@angular/router';
import { Authority } from 'src/app/constants/authority.constants';
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
      defaultSort: 'competency,desc',
      pageTitle: 'home.title',
    },
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
      defaultSort: 'competency,desc',
      pageTitle: 'home.title',
    },
    component: MasterDetailComponent,
  },
];

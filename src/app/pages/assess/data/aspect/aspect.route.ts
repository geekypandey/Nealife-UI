import { Routes } from '@angular/router';
import { Authority } from 'src/app/constants/authority.constants';
import { AspectDetailComponent } from './aspect-detail/aspect-detail.component';
import { AspectUpdateComponent } from './aspect-update/aspect-update.component';
import { AspectComponent } from './aspect.component';

export const aspectRoute: Routes = [
  {
    path: '',
    component: AspectComponent,
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      defaultSort: 'id,desc',
      pageTitle: 'nealifeApp.aspect.home.title',
    },
  },
  {
    path: ':id/view',
    component: AspectDetailComponent,
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'nealifeApp.aspect.home.title',
    },
  },
  {
    path: 'new',
    component: AspectUpdateComponent,
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'nealifeApp.aspect.home.title',
    },
  },
  {
    path: ':id/edit',
    component: AspectUpdateComponent,
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'nealifeApp.aspect.home.title',
    },
  },
];

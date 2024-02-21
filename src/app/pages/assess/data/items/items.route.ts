import { Routes } from '@angular/router';
import { Authority } from 'src/app/constants/authority.constants';
import { ItemsDetailComponent } from './items-detail/items-detail.component';
import { ItemsUpdateComponent } from './items-update/items-update.component';
import { ItemsComponent } from './items.component';

export const itemsRoute: Routes = [
  {
    path: '',
    component: ItemsComponent,
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      defaultSort: 'id,desc',
      pageTitle: 'nealifeApp.item.home.title',
    },
  },
  {
    path: ':id/view',
    component: ItemsDetailComponent,
    // resolve: {
    //   item: ItemResolve,
    // },
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'nealifeApp.item.home.title',
    },
  },
  {
    path: 'new',
    component: ItemsUpdateComponent,
    // resolve: {
    //   item: ItemResolve,
    // },
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'nealifeApp.item.home.title',
    },
  },
  {
    path: ':id/edit',
    component: ItemsUpdateComponent,
    // resolve: {
    //   item: ItemResolve,
    // },
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'nealifeApp.item.home.title',
    },
  },
];

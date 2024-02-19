import { Routes } from '@angular/router';
import { Authority } from 'src/app/constants/authority.constants';
import { ResponseOptionDetailComponent } from './response-option-detail/response-option-detail.component';
import { ResponseOptionUpdateComponent } from './response-option-update/response-option-update.component';
import { ResponseOptionComponent } from './response-option.component';

export const responseOptionRoute: Routes = [
  {
    path: '',
    component: ResponseOptionComponent,
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      defaultSort: 'id,desc',
      pageTitle: 'nealifeApp.competency.home.title',
    },
  },
  {
    path: ':id/view',
    component: ResponseOptionDetailComponent,
    //   resolve: {
    //     competency: competencyResolver,
    //   },
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'nealifeApp.competency.home.title',
    },
  },
  {
    path: 'new',
    component: ResponseOptionUpdateComponent,
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'nealifeApp.competency.home.title',
    },
  },
  {
    path: ':id/edit',
    component: ResponseOptionUpdateComponent,
    //   resolve: {
    //     competency: competencyResolver,
    //   },
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'nealifeApp.competency.home.title',
    },
  },
];

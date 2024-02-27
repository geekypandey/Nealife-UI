import { Routes } from '@angular/router';
import { Authority } from 'src/app/constants/authority.constants';
import { authGuard } from 'src/app/guards/is-authorized.guard';
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
      pageTitle: 'nealifeApp.responseOption.home.title',
    },
    canActivate: [authGuard],
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
      pageTitle: 'nealifeApp.responseOption.home.title',
    },
    canActivate: [authGuard],
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
      pageTitle: 'nealifeApp.responseOption.home.title',
    },
    canActivate: [authGuard],
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
      pageTitle: 'nealifeApp.responseOption.home.title',
    },
    canActivate: [authGuard],
  },
];

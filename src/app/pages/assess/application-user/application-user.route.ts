import { Route } from '@angular/router';
import { ApplicationUserDetailComponent } from 'src/app/assess/application-user/application-user-detail/application-user-detail.component';
import { Authority } from 'src/app/constants/authority.constants';
import { ApplicationUserComponent } from './application-user.component';

export const applicationUserRoute: Route[] = [
  {
    path: '',
    component: ApplicationUserComponent,
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      defaultSort: 'id,desc',
      pageTitle: 'nealifeApp.applicationUser.home.title',
    },
  },
  {
    path: ':id/view',
    component: ApplicationUserDetailComponent,

    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'nealifeApp.applicationUser.home.title',
    },
  },
  // {
  //   path: 'new',
  //   component: ApplicationUserUpdateComponent,
  //   resolve: {
  //     applicationUser: ApplicationUserResolve,
  //   },
  //   data: {
  //     authorities: [Authority.ACCOUNT_ADMIN, Authority.NEA_ADMIN, Authority.ADMIN, Authority.SUPER_ADMIN],
  //     pageTitle: 'nealifeApp.applicationUser.home.title',
  //   },
  //   canActivate: [UserRouteAccessService],
  // },
  // {
  //   path: ':id/edit',
  //   component: ApplicationUserUpdateComponent,
  //   resolve: {
  //     applicationUser: ApplicationUserResolve,
  //   },
  //   data: {
  //     authorities: [Authority.ACCOUNT_ADMIN, Authority.NEA_ADMIN, Authority.ADMIN, Authority.SUPER_ADMIN],
  //     pageTitle: 'nealifeApp.applicationUser.home.title',
  //   },
  //   canActivate: [UserRouteAccessService],
  // },
];

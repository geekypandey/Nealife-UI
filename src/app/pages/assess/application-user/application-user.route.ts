import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Route, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { API_URL } from 'src/app/constants/api-url.constants';
import { Authority } from 'src/app/constants/authority.constants';
import { CRUDService } from '../services/crud.service';
import { ApplicationUserDetailComponent } from './application-user-detail/application-user-detail.component';
import { ApplicationUserUpdateComponent } from './application-user-update/application-user-update.component';
import { ApplicationUserComponent } from './application-user.component';
import { ApplicationUser } from './application-user.model';

export const applicationUserResolver: ResolveFn<ApplicationUser> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<ApplicationUser> => {
  const crudService: CRUDService = inject(CRUDService);
  return crudService.find<ApplicationUser>(
    API_URL.applicationUsers,
    route.paramMap.get('id') || ''
  );
};

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
    resolve: {
      applicationUser: applicationUserResolver,
    },
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
  {
    path: 'new',
    component: ApplicationUserUpdateComponent,

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
  {
    path: ':id/edit',
    component: ApplicationUserUpdateComponent,

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
];

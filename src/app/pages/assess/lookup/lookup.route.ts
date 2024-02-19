import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Route, RouterStateSnapshot } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize } from 'rxjs';
import { API_URL } from 'src/app/constants/api-url.constants';
import { Authority } from 'src/app/constants/authority.constants';
import { ILookup, Lookup } from '../assess.model';
import { CRUDService } from '../services/crud.service';
import { LookupDetailComponent } from './lookup-detail/lookup-detail.component';
import { LookupUpdateComponent } from './lookup-update/lookup-update.component';
import { LookupComponent } from './lookup.component';

export const lookupResolver: ResolveFn<ILookup> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<ILookup> => {
  const spinnerService = inject(NgxSpinnerService);
  const crudService: CRUDService = inject(CRUDService);
  spinnerService.show();
  return crudService
    .find<Lookup>(API_URL.lookup, route.paramMap.get('id') || '')
    .pipe(finalize(() => spinnerService.hide()));
};

export const lookupRoute: Route[] = [
  {
    path: '',
    component: LookupComponent,
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      defaultSort: 'id,desc',
      pageTitle: 'nealifeApp.lookup.home.title',
    },
  },
  {
    path: ':id/view',
    component: LookupDetailComponent,
    resolve: {
      lookup: lookupResolver,
    },
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'nealifeApp.lookup.home.title',
    },
  },
  {
    path: 'new',
    component: LookupUpdateComponent,
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'nealifeApp.lookup.home.title',
    },
  },
  {
    path: ':id/edit',
    component: LookupUpdateComponent,
    resolve: {
      lookup: lookupResolver,
    },
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'nealifeApp.lookup.home.title',
    },
  },
];

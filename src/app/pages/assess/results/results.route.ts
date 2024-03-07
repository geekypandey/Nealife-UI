import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Route, RouterStateSnapshot } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize } from 'rxjs';
import { API_URL } from 'src/app/constants/api-url.constants';
import { Authority } from 'src/app/constants/authority.constants';
import { authGuard } from 'src/app/guards/is-authorized.guard';
import { ILookup, Lookup } from '../assess.model';
import { CRUDService } from '../services/crud.service';
import { ResultsEditComponent } from './results-edit/results-edit.component';
import { ResultsComponent } from './results.component';

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

export const resultRoute: Route[] = [
  {
    path: '',
    component: ResultsComponent,
    data: {
      authorities: [
        Authority.ADMIN,
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'nealifeApp.applicationUserAssessment.home.title',
    },
    canActivate: [authGuard],
  },
  {
    path: ':id/edit',
    component: ResultsEditComponent,
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'nealifeApp.applicationUserAssessment.home.title',
    },
    canActivate: [authGuard],
  },
];

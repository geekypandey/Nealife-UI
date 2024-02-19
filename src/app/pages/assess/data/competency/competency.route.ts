import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot, Routes } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize } from 'rxjs';
import { API_URL } from 'src/app/constants/api-url.constants';
import { Authority } from 'src/app/constants/authority.constants';
import { CRUDService } from '../../services/crud.service';
import { CompetencyDetailComponent } from './competency-detail/competency-detail.component';
import { CompetencyUpdateComponent } from './competency-update/competency-update.component';
import { CompetencyComponent } from './competency.component';
import { ICompetency } from './competency.model';

export const competencyResolver: ResolveFn<ICompetency> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<ICompetency> => {
  const spinnerService = inject(NgxSpinnerService);
  const crudService: CRUDService = inject(CRUDService);
  spinnerService.show();
  return crudService
    .find<ICompetency>(API_URL.competencies, route.paramMap.get('id') || '')
    .pipe(finalize(() => spinnerService.hide()));
};

export const competencyRoute: Routes = [
  {
    path: '',
    component: CompetencyComponent,
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
    component: CompetencyDetailComponent,
    resolve: {
      competency: competencyResolver,
    },
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
    component: CompetencyUpdateComponent,
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
    component: CompetencyUpdateComponent,
    resolve: {
      competency: competencyResolver,
    },
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

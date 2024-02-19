import { Routes } from '@angular/router';
import { Authority } from 'src/app/constants/authority.constants';
import { AspectDetailComponent } from './aspect-detail/aspect-detail.component';
import { AspectUpdateComponent } from './aspect-update/aspect-update.component';
import { AspectComponent } from './aspect.component';

// export const aspectResolver: ResolveFn<ICompetency> = (
//   route: ActivatedRouteSnapshot,
//   state: RouterStateSnapshot
// ): Observable<ICompetency> => {
//   const spinnerService = inject(NgxSpinnerService);
//   const crudService: CRUDService = inject(CRUDService);
//   spinnerService.show();
//   return crudService
//     .find<ICompetency>(API_URL.competencies, route.paramMap.get('id') || '')
//     .pipe(finalize(() => spinnerService.hide()));
// };

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
    //   resolve: {
    //     aspect: AspectResolve,
    //   },
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
    //   resolve: {
    //     aspect: AspectResolve,
    //   },
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
    //   resolve: {
    //     aspect: AspectResolve,
    //   },
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

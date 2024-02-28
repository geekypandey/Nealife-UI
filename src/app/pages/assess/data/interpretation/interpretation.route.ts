import { Routes } from '@angular/router';
import { Authority } from 'src/app/constants/authority.constants';
import { authGuard } from 'src/app/guards/is-authorized.guard';
import { InterpretationDetailComponent } from './interpretation-detail/interpretation-detail.component';
import { InterpretationUpdateComponent } from './interpretation-update/interpretation-update.component';
import { InterpretationComponent } from './interpretation.component';

export const interpretationRoute: Routes = [
  {
    path: '',
    component: InterpretationComponent,
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'nealifeApp.interpretation.home.title',
    },
    canActivate: [authGuard],
  },
  {
    path: ':id/view',
    component: InterpretationDetailComponent,
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'nealifeApp.interpretation.home.title',
    },
    canActivate: [authGuard],
  },
  {
    path: 'new',
    component: InterpretationUpdateComponent,
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'nealifeApp.interpretation.home.title',
    },
    canActivate: [authGuard],
  },
  {
    path: ':id/edit',
    component: InterpretationUpdateComponent,
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'nealifeApp.interpretation.home.title',
    },
    canActivate: [authGuard],
  },
];

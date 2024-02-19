import { Routes } from '@angular/router';
import { Authority } from 'src/app/constants/authority.constants';
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
      defaultSort: 'id,desc',
      pageTitle: 'nealifeApp.interpretation.home.title',
    },
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
  },
];

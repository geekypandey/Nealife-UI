import { Route } from '@angular/router';
import { Authority } from 'src/app/constants/authority.constants';
import { authGuard } from 'src/app/guards/is-authorized.guard';
import { AssessmentGroupDetailsComponent } from './assessment-group-details/assessment-group-details.component';
import { AssessmentGroupUpdateComponent } from './assessment-group-update/assessment-group-update.component';
import { AssessmentGroupComponent } from './assessment-group.component';

export const assessmentGroupRoute: Route[] = [
  {
    path: '',
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'home.title',
    },
    canActivate: [authGuard],
    component: AssessmentGroupComponent,
  },
  {
    path: 'assessmnet-group-details',
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'home.title',
    },
    canActivate: [authGuard],
    component: AssessmentGroupDetailsComponent,
  },
  {
    path: 'new',
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'home.title',
    },
    canActivate: [authGuard],
    component: AssessmentGroupUpdateComponent,
  },
  {
    path: ':id/edit',
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'home.title',
    },
    canActivate: [authGuard],
    component: AssessmentGroupUpdateComponent,
  },
];

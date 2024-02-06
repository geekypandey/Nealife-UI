import { Route } from '@angular/router';
import { Authority } from 'src/app/constants/authority.constants';
import { AssessmentGroupDetailsComponent } from './assessment-group-details/assessment-group-details.component';
import { AssessmentGroupUpdateComponent } from './assessment-group-update/assessment-group-update.component';
import { AssessmentGroupComponent } from './assessment-group.component';

export const assessmentGroupRoute: Route[] = [
  {
    path: '',
    data: {
      authorities: [
        Authority.ADMIN,
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.SUPER_ADMIN,
      ],
      defaultSort: 'competency,desc',
      pageTitle: 'home.title',
    },
    component: AssessmentGroupComponent,
  },
  {
    path: 'assessmnet-group-details',
    data: {
      authorities: [
        Authority.ADMIN,
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.SUPER_ADMIN,
      ],
      defaultSort: 'competency,desc',
      pageTitle: 'home.title',
    },
    component: AssessmentGroupDetailsComponent,
  },
  {
    path: 'new',
    data: {
      authorities: [
        Authority.ADMIN,
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.SUPER_ADMIN,
      ],
      defaultSort: 'competency,desc',
      pageTitle: 'home.title',
    },
    component: AssessmentGroupUpdateComponent,
  },
  {
    path: ':id/edit',
    data: {
      authorities: [
        Authority.ADMIN,
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.SUPER_ADMIN,
      ],
      defaultSort: 'competency,desc',
      pageTitle: 'home.title',
    },
    component: AssessmentGroupUpdateComponent,
  },
];

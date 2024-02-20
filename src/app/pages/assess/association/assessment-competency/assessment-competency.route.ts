import { Route } from '@angular/router';
import { Authority } from 'src/app/constants/authority.constants';
import { ASSOCIATION_TAB_INDEX } from '../association.component';

export const assessmentCompetencyRoute: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('../association.component').then(c => c.AssociationComponent),
    data: {
      tabIndex: ASSOCIATION_TAB_INDEX.ASSESSMENT_COMPETENCY,
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
    },
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./assessment-competency-update/assessment-competency-update.component').then(c => c.AssessmentCompetencyUpdateComponent),
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
    },
  },
  {
    path: 'add',
    loadComponent: () => import('./assessment-competency-update/assessment-competency-update.component').then(c => c.AssessmentCompetencyUpdateComponent),
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
    },
  },
]
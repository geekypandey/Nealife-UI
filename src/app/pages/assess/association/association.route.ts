
import { Route } from '@angular/router';
import { Authority } from 'src/app/constants/authority.constants';
import { ASSOCIATION_TAB_INDEX } from './association.component';

export const associationRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'assessment-competency',
    pathMatch: 'full',
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
    path: 'assessment-competency',
    loadChildren: () =>
      import('./assessment-competency/assessment-competency.route').then(c => c.assessmentCompetencyRoute),
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
    path: 'competency-aspect',
    loadChildren: () =>
      import('./competency-aspect/competency-aspect.route').then(c => c.competencyAspectRoutes),
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
    path: 'aspect-item',
    loadChildren: () =>
      import('./aspect-item/aspect-item.route').then(c => c.aspectItemRoutes),
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
    path: 'group-assessments',
    loadComponent: () =>
      import('./association.component').then(c => c.AssociationComponent),
    data: {
      tabIndex: ASSOCIATION_TAB_INDEX.GROUP_ASSESSMENTS,
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
    },
  },
]
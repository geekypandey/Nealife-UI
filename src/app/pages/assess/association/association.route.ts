import { Route } from '@angular/router';
import { Authority } from 'src/app/constants/authority.constants';
import { authGuard } from 'src/app/guards/is-authorized.guard';

export const associationRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'assessment-competency',
    pathMatch: 'full',
  },
  {
    path: 'assessment-competency',
    loadChildren: () =>
      import('./assessment-competency/assessment-competency.route').then(
        c => c.assessmentCompetencyRoute
      ),
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'nealifeApp.assessmentCompetency.home.title',
    },
    canActivate: [authGuard],
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
      pageTitle: 'nealifeApp.assessmentCompetency.home.title',
    },
    canActivate: [authGuard],
  },
  {
    path: 'aspect-item',
    loadChildren: () => import('./aspect-item/aspect-item.route').then(c => c.aspectItemRoutes),
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'nealifeApp.assessmentCompetency.home.title',
    },
    canActivate: [authGuard],
  },
  {
    path: 'group-assessments',
    loadChildren: () =>
      import('./group-assessments/group-assessments.route').then(c => c.groupAssessmentsRoutes),
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'nealifeApp.assessmentCompetency.home.title',
    },
    canActivate: [authGuard],
  },
];

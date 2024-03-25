import { Route } from '@angular/router';
import { Authority } from 'src/app/constants/authority.constants';
import { authGuard } from 'src/app/guards/is-authorized.guard';
import { ViewAssessmentTestComponent } from './view-assessment-test/view-assessment-test.component';

export const assignRoute: Route[] = [
  {
    path: '',
    loadComponent: () => import('./assign.component').then(c => c.AssignComponent),
    data: {
      authorities: [
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'nealifeApp.companyAssessment.home.title',
    },
    canActivate: [authGuard],
    children: [
      {
        path: 'company-assessment',
        loadChildren: () =>
          import('./company-assessment/company-assessment.route').then(c => c.companyAssessmentRoutes),
        data: {
          authorities: [
            Authority.ACCOUNT_ADMIN,
            Authority.NEA_ADMIN,
            Authority.ADMIN,
            Authority.SUPER_ADMIN,
          ],
          pageTitle: 'nealifeApp.companyAssessment.home.title',
        },
        canActivate: [authGuard],
      },
      {
        path: 'company-assessment-group',
        loadChildren: () =>
          import('./company-assessment-group/company-assessment-group.route').then(
            c => c.companyAssessmentGroupRoutes
          ),
        data: {
          authorities: [
            Authority.ACCOUNT_ADMIN,
            Authority.NEA_ADMIN,
            Authority.ADMIN,
            Authority.SUPER_ADMIN,
          ],
          pageTitle: 'nealifeApp.companyAssessment.home.title',
        },
        canActivate: [authGuard],
      },
      {
        path: 'view-assessment-test',
        component: ViewAssessmentTestComponent,
        data: {
          authorities: [
            Authority.ACCOUNT_ADMIN,
            Authority.NEA_ADMIN,
            Authority.ADMIN,
            Authority.SUPER_ADMIN,
          ],
          pageTitle: 'nealifeApp.competencyAspect.home.title',
        },
        canActivate: [authGuard],
      },
    ]
  },
];

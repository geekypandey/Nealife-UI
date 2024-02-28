import { Route } from '@angular/router';
import { Authority } from 'src/app/constants/authority.constants';
import { authGuard } from 'src/app/guards/is-authorized.guard';

export const DASHBOARD_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./assess.component').then(c => c.AssessComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        data: {
          authorities: [
            Authority.ADMIN,
            Authority.ACCOUNT_ADMIN,
            Authority.NEA_ADMIN,
            Authority.SUPER_ADMIN,
          ],
          pageTitle: 'home.title',
        },
        canActivate: [authGuard],
        loadChildren: () => import('./dashboard/dashboard.route').then(r => r.dashboardRoutes),
      },
      {
        path: 'masterData',
        data: {
          authorities: [
            Authority.ADMIN,
            Authority.ACCOUNT_ADMIN,
            Authority.NEA_ADMIN,
            Authority.SUPER_ADMIN,
          ],
          pageTitle: 'home.title',
        },
        canActivate: [authGuard],
        loadChildren: () => import('./master-data/master.route').then(r => r.masterDataRoutes),
      },
      {
        path: 'company',
        data: {
          authorities: [
            Authority.ADMIN,
            Authority.ACCOUNT_ADMIN,
            Authority.NEA_ADMIN,
            Authority.SUPER_ADMIN,
          ],
          pageTitle: 'nealifeApp.company.home.title',
        },
        canActivate: [authGuard],
        loadChildren: () => import('./company/company.route').then(c => c.companyRoute),
      },
      {
        path: 'assessment-result',
        data: {
          authorities: [
            Authority.ADMIN,
            Authority.ACCOUNT_ADMIN,
            Authority.NEA_ADMIN,
            Authority.SUPER_ADMIN,
          ],
          pageTitle: 'nealifeApp.applicationUserAssessment.home.title',
        },
        canActivate: [authGuard],
        loadComponent: () => import('./results/results.component').then(c => c.ResultsComponent),
      },
      {
        path: 'application-user',
        loadChildren: () =>
          import('./application-user/application-user.route').then(c => c.applicationUserRoute),
        data: {
          authorities: [
            Authority.ACCOUNT_ADMIN,
            Authority.NEA_ADMIN,
            Authority.ADMIN,
            Authority.SUPER_ADMIN,
          ],
          pageTitle: 'nealifeApp.applicationUser.home.title',
        },
        canActivate: [authGuard],
      },
      {
        path: 'assessment-group',
        loadChildren: () =>
          import('./assessment-group/assessment-group.route').then(c => c.assessmentGroupRoute),
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
      },
      {
        path: 'lookup',
        data: {
          authorities: [
            Authority.ACCOUNT_ADMIN,
            Authority.NEA_ADMIN,
            Authority.ADMIN,
            Authority.SUPER_ADMIN,
          ],
          pageTitle: 'nealifeApp.lookup.home.title',
        },
        canActivate: [authGuard],
        loadChildren: () => import('./lookup/lookup.route').then(r => r.lookupRoute),
      },
      {
        path: 'assign',
        loadChildren: () => import('./assign/assign.route').then(c => c.assignRoute),
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
        path: 'payment',
        loadComponent: () => import('./payment/payment.component').then(c => c.PaymentComponent),
      },
      {
        path: 'configure',
        loadComponent: () =>
          import('./configure/configure.component').then(r => r.ConfigureComponent),
      },
      {
        path: 'data',
        loadChildren: () => import('./data/data.route').then(c => c.dataRoute),
      },
      {
        path: 'association',
        loadChildren: () =>
          import('./association/association.route').then(r => r.associationRoutes),
      },
    ],
  },
];

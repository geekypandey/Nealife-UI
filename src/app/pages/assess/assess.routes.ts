import { Route } from '@angular/router';

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
        loadChildren: () => import('./dashboard/dashboard.route').then(r => r.dashboardRoutes),
      },
      {
        path: 'masterData',
        loadChildren: () => import('./master-data/master.route').then(r => r.masterDataRoutes),
      },
      {
        path: 'company',
        loadChildren: () => import('./company/company.route').then(c => c.companyRoute),
      },
      {
        path: 'assessment-result',
        loadComponent: () => import('./results/results.component').then(c => c.ResultsComponent),
      },
      {
        path: 'application-user',
        loadChildren: () =>
          import('./application-user/application-user.route').then(c => c.applicationUserRoute),
      },
      {
        path: 'assessment-group',
        loadChildren: () =>
          import('./assessment-group/assessment-group.route').then(c => c.assessmentGroupRoute),
      },
      {
        path: 'lookup',
        loadChildren: () => import('./lookup/lookup.route').then(r => r.lookupRoute),
      },
      {
        path: 'assign',
        loadChildren: () => import('./assign/assign.route').then(c => c.assignRoute),
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
        loadChildren: () => import('./association/association.route').then(r => r.associationRoutes),
      },
    ],
  },
];

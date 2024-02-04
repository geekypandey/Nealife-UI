import { Route } from '@angular/router';
import { dashboardRoutes } from './dashboard/dashboard.route';

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
        loadChildren: () => import('./dashboard/dashboard.route').then(r => dashboardRoutes),
      },
      {
        path: 'company',
        loadChildren: () => import('./company/company.route').then(c => c.companyRoute),
      },
    ],
  },
];

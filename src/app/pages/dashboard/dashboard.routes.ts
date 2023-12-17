import { Route } from '@angular/router';

export const DASHBOARD_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./dashboard.component').then(c => c.DashboardComponent),
    children: [
      {
        path: 'admin',
        loadComponent: () => import('./admin/admin.component').then(c => c.AdminComponent),
      },
      {
        path: 'register',
        loadComponent: () => import('./register/register.component').then(c => c.RegisterComponent),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'admin',
      },
    ],
  },
];

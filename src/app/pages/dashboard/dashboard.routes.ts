import { Route } from '@angular/router';
import { USER_ROLE } from 'src/app/constants/user-role.constants';
import { isAuthorizedGuard } from 'src/app/guards/is-authorized.guard';

export const DASHBOARD_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./dashboard.component').then(c => c.DashboardComponent),
    children: [
      {
        path: 'superadmin',
        loadComponent: () =>
          import('./superadmin/superadmin.component').then(c => c.SuperadminComponent),
        data: {
          role: [USER_ROLE.SUPER_ADMIN],
        },
        canActivate: [isAuthorizedGuard],
        canActivateChild: [isAuthorizedGuard],
      },
      {
        path: 'admin',
        loadComponent: () => import('./admin/admin.component').then(c => c.AdminComponent),
        data: {
          role: [USER_ROLE.ADMIN],
        },
        canActivateChild: [isAuthorizedGuard],
      },
      {
        path: 'franchise',
        loadComponent: () =>
          import('./franchise/franchise.component').then(c => c.FranchiseComponent),
        data: {
          role: [USER_ROLE.FRANCHISE],
        },
        canActivateChild: [isAuthorizedGuard],
      },
      {
        path: 'master',
        loadComponent: () => import('./admin/admin.component').then(c => c.AdminComponent),
      },
      {
        path: 'register',
        loadComponent: () => import('./register/register.component').then(c => c.RegisterComponent),
      },
      {
        path: 'assign',
        loadComponent: () => import('./assign/assign.component').then(c => c.AssignComponent),
      },
      {
        path: 'results',
        loadComponent: () => import('./results/results.component').then(c => c.ResultsComponent),
      },
      {
        path: 'payment',
        loadComponent: () => import('./payment/payment.component').then(c => c.PaymentComponent),
      },
      {
        path: 'settings',
        loadComponent: () => import('./settings/settings.component').then(c => c.SettingsComponent),
      },
    ],
  },
];

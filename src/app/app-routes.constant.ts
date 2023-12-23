import { Routes } from '@angular/router';
import { isAuthenticatedGuard, isNotAuthenticatedGuard } from './guards/is-authenticated.guard';

export const APP_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent),
    canActivate: [isNotAuthenticatedGuard],
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.component').then(c => c.SignupComponent),
    canActivate: [isNotAuthenticatedGuard],
  },
  {
    path: 'assess',
    loadChildren: () => import('./pages/dashboard/dashboard.routes').then(r => r.DASHBOARD_ROUTES),
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'assess',
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'assess',
  },
];

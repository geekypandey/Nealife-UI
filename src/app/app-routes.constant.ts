import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((mod) => mod.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/signup/signup.component').then(
        (mod) => mod.SignupComponent,
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/admin/admin.component').then(
        (mod) => mod.AdminComponent,
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'login',
  },
];

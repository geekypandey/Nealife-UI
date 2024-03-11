import { Routes } from '@angular/router';
import { isAuthenticatedGuard, isNotAuthenticatedGuard } from './guards/is-authenticated.guard';
import { RenderAssessmentComponent } from './pages/render-assessment/render-assessment.component';

export const APP_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent),
    canActivate: [isNotAuthenticatedGuard],
  },
  // {
  //   path: 'signup',
  //   loadComponent: () => import('./pages/signup/signup.component').then(c => c.SignupComponent),
  //   canActivate: [isNotAuthenticatedGuard],
  // },
  {
    path: 'account/reset/request',
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password.component').then(
        c => c.ForgotPasswordComponent
      ),
    canActivate: [isNotAuthenticatedGuard],
  },
  {
    path: 'account/reset/finish',
    data: {
      authorities: [],
      pageTitle: 'global.menu.account.password',
    },
    loadComponent: () =>
      import('./pages/password-reset-finish/password-reset-finish.component').then(
        c => c.PasswordResetFinishComponent
      ),
  },
  {
    path: 'assess',
    loadChildren: () => import('./pages/assess/assess.routes').then(r => r.DASHBOARD_ROUTES),
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: 'render-assessment',
    loadComponent: () =>
      import('./pages/render-assessment/render-assessment.component').then(
        r => RenderAssessmentComponent
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/assess/dashboard',
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '/assess/dashboard',
  },
];

import { Route } from '@angular/router';

export const REGISTER_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./register.component').then(c => c.RegisterComponent),
  },
  {
    path: ':id/detail',
    loadComponent: () =>
      import('./detail/register-detail.component').then(c => c.RegisterDetailComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./edit/register-edit.component').then(c => c.RegisterEditComponent),
  },
  {
    path: 'add',
    loadComponent: () => import('./add/register-add.component').then(c => c.RegisterAddComponent),
  },
];

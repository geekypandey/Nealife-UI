import { Route } from '@angular/router';

export const assignRoute: Route[] = [
  {
    path: '',
    loadComponent: () => import('./assign.component').then(c => c.AssignComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./assign-edit/assign-edit.component').then(c => c.AssignEditComponent),
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./assign-edit/assign-edit.component').then(c => c.AssignEditComponent),
  },
]
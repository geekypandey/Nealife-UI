import { Route } from '@angular/router';

export const assignRoute: Route[] = [
  {
    path: '',
    loadComponent: () => import('./assign.component').then(c => c.AssignComponent),
  },
]
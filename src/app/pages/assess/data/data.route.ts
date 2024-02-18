import { Route } from '@angular/router';

export const dataRoute: Route[] = [
  {
    path: '',
    loadComponent: () => import('./data.component').then(c => c.DataComponent),
    children: [
      {
        path: 'competency',
        loadChildren: () => import('./competency/competency.route').then(c => c.competencyRoute),
      },
      {
        path: 'aspect',
        loadChildren: () => import('./aspect/aspect.route').then(c => c.aspectRoute),
      },
    ],
  },
  //   {
  //     path: '',
  //     pathMatch: 'full',
  //     redirectTo: 'competency',
  //   },
];

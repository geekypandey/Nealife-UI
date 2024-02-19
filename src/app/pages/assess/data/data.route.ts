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
      {
        path: 'items',
        loadChildren: () => import('./items/items.route').then(c => c.itemsRoute),
      },
      {
        path: 'response-option',
        loadChildren: () =>
          import('./response-option/response-option.route').then(c => c.responseOptionRoute),
      },
    ],
  },
  //   {
  //     path: '',
  //     pathMatch: 'full',
  //     redirectTo: 'competency',
  //   },
];

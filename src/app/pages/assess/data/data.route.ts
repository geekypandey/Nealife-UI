import { Route } from '@angular/router';
import { Authority } from 'src/app/constants/authority.constants';
import { authGuard } from 'src/app/guards/is-authorized.guard';

export const dataRoute: Route[] = [
  {
    path: '',
    loadComponent: () => import('./data.component').then(c => c.DataComponent),
    children: [
      {
        path: 'competency',
        data: {
          authorities: [
            Authority.ACCOUNT_ADMIN,
            Authority.NEA_ADMIN,
            Authority.ADMIN,
            Authority.SUPER_ADMIN,
          ],
          pageTitle: 'nealifeApp.competency.home.title',
        },
        canActivate: [authGuard],
        loadChildren: () => import('./competency/competency.route').then(c => c.competencyRoute),
      },
      {
        path: 'aspect',
        data: {
          authorities: [
            Authority.ACCOUNT_ADMIN,
            Authority.NEA_ADMIN,
            Authority.ADMIN,
            Authority.SUPER_ADMIN,
          ],
          pageTitle: 'nealifeApp.aspect.home.title',
        },
        canActivate: [authGuard],
        loadChildren: () => import('./aspect/aspect.route').then(c => c.aspectRoute),
      },
      {
        path: 'items',
        data: {
          authorities: [
            Authority.ACCOUNT_ADMIN,
            Authority.NEA_ADMIN,
            Authority.ADMIN,
            Authority.SUPER_ADMIN,
          ],
          pageTitle: 'nealifeApp.item.home.title',
        },
        canActivate: [authGuard],
        loadChildren: () => import('./items/items.route').then(c => c.itemsRoute),
      },
      {
        path: 'response-option',
        data: {
          authorities: [
            Authority.ACCOUNT_ADMIN,
            Authority.NEA_ADMIN,
            Authority.ADMIN,
            Authority.SUPER_ADMIN,
          ],
          pageTitle: 'nealifeApp.responseOption.home.title',
        },
        canActivate: [authGuard],
        loadChildren: () =>
          import('./response-option/response-option.route').then(c => c.responseOptionRoute),
      },
      {
        path: 'norm',
        loadChildren: () => import('./norm/norm.route').then(c => c.normRoute),
        data: {
          authorities: [
            Authority.ACCOUNT_ADMIN,
            Authority.NEA_ADMIN,
            Authority.ADMIN,
            Authority.SUPER_ADMIN,
          ],
          pageTitle: 'nealifeApp.norm.home.title',
        },
        canActivate: [authGuard],
      },
      {
        path: 'interpretation',
        loadChildren: () =>
          import('./interpretation/interpretation.route').then(c => c.interpretationRoute),
        data: {
          authorities: [
            Authority.ACCOUNT_ADMIN,
            Authority.NEA_ADMIN,
            Authority.ADMIN,
            Authority.SUPER_ADMIN,
          ],
          pageTitle: 'nealifeApp.interpretation.home.title',
        },
        canActivate: [authGuard],
      },
    ],
  },
  //   {
  //     path: '',
  //     pathMatch: 'full',
  //     redirectTo: 'competency',
  //   },
];

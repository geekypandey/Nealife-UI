import { Route } from '@angular/router';
import { Authority } from 'src/app/constants/authority.constants';
import { authGuard } from 'src/app/guards/is-authorized.guard';
import { DashboardAdminStatsComponent } from './dashboard-admin-stats/dashboard-admin-stats.component';
import { DashboardDetailsEditComponent } from './dashboard-details/dashboard-details-edit/dashboard-details-edit.component';
import { DashboardDetailsComponent } from './dashboard-details/dashboard-details.component';

export const dashboardRoutes: Route[] = [
  {
    path: '',
    data: {
      authorities: [
        Authority.ADMIN,
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'home.title',
    },
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard.component').then(r => r.DashboardComponent),
  },
  {
    path: 'dashboard-admin-stats',
    data: {
      authorities: [
        Authority.ADMIN,
        Authority.ADMIN,
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.SUPER_ADMIN,
      ],
      pageTitle: 'home.title',
    },
    canActivate: [authGuard],
    component: DashboardAdminStatsComponent,
  },
  {
    path: 'dashboard-details',
    children: [
      {
        path: '',
        data: {
          authorities: [
            Authority.ADMIN,
            Authority.ADMIN,
            Authority.ACCOUNT_ADMIN,
            Authority.NEA_ADMIN,
            Authority.SUPER_ADMIN,
          ],
          pageTitle: 'home.title',
        },
        canActivate: [authGuard],
        component: DashboardDetailsComponent,
      },
      {
        path: ':id/edit',
        component: DashboardDetailsEditComponent,
        data: {
          authorities: [
            Authority.ACCOUNT_ADMIN,
            Authority.NEA_ADMIN,
            Authority.ADMIN,
            Authority.SUPER_ADMIN,
          ],
          pageTitle: 'home.title',
        },
        canActivate: [authGuard],
      },
    ],
  },
];

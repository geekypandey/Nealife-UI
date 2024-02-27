import { Route } from '@angular/router';
import { Authority } from 'src/app/constants/authority.constants';
import { authGuard } from 'src/app/guards/is-authorized.guard';
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
    path: 'dashboard-details',
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
];

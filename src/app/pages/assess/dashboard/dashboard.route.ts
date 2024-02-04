import { Route } from '@angular/router';
import { Authority } from 'src/app/constants/authority.constants';
import { DashboardDetailsComponent } from './dashboard-details/dashboard-details.component';

export const dashboardRoutes: Route[] = [
  {
    path: '',
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
    },
    component: DashboardDetailsComponent,
  },
];

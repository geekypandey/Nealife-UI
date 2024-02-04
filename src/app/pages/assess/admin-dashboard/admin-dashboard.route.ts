import { Route } from '@angular/router';
import { Authority } from 'src/app/constants/authority.constants';
import { AdminDashboardDetailComponent } from './admin-dashboard-detail/admin-dashboard-detail.component';
import { AdminDashboardComponent } from './admin-dashboard.component';

export const DASHBOARD_ROUTES: Route[] = [
  {
    path: '',
    data: {
      authorities: [
        Authority.ADMIN,
        Authority.ACCOUNT_ADMIN,
        Authority.NEA_ADMIN,
        Authority.SUPER_ADMIN,
      ],
      defaultSort: 'competency,desc',
      pageTitle: 'home.title',
    },
    component: AdminDashboardComponent,
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
      defaultSort: 'competency,desc',
      pageTitle: 'home.title',
    },
    component: AdminDashboardDetailComponent,
  },
];

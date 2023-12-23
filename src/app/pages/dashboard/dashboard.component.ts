import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';
import { USER_ROLE } from 'src/app/constants/user-role.constants';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HeaderComponent } from './components/header/header.component';
import { HeaderMenu } from './components/header/header.model';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SidebarMenu } from './dashboard.model';
import { ProfileService } from './services/profile.service';

@Component({
  selector: 'nl-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  username: string = '';
  companyName: string = '';
  sidebarMenus: SidebarMenu[] = [];
  headerMenus: HeaderMenu[] = [];

  private profileService = inject(ProfileService);
  private cd = inject(ChangeDetectorRef);
  private authenticationService = inject(AuthenticationService);
  private router = inject(Router);
  private spinner = inject(NgxSpinnerService);
  public defaultRoute: string = '/';

  ngOnInit() {
    this.spinner.show();
    forkJoin([this.profileService.getLoggedInUser(), this.profileService.getAccount()]).subscribe({
      next: ([profile, account]) => {
        let sidebarMenus = this.getSidebarMenu(profile.role);
        this.headerMenus = this.getHeaderMenu();
        this.username = profile.roleDisplayName;
        this.companyName = profile.companyName;

        // Load first route
        const baseRoute = '/assess';
        this.defaultRoute = baseRoute + this.getDefaultRoute(profile.role);
        const dashboardMenus: SidebarMenu[] = [
          {
            label: 'Dashboard',
            icon: 'dashboard',
            url: this.defaultRoute,
          },
        ];
        sidebarMenus = sidebarMenus.map(menu => ({ ...menu, url: baseRoute + menu.url }));
        this.sidebarMenus = dashboardMenus.concat(sidebarMenus);
        this.router.navigate([this.defaultRoute]);
        this.spinner.hide();
        this.cd.markForCheck();
      },
      error: _ => this.spinner.hide(),
    });
  }

  private getDefaultRoute(role: string) {
    if (role === USER_ROLE.SUPER_ADMIN) {
      return '/superadmin';
    } else if (role === USER_ROLE.ADMIN) {
      return '/admin';
    } else if (role === USER_ROLE.FRANCHISE) {
      return '/franchise';
    }
    return '/';
  }

  private getSidebarMenu(role: string): SidebarMenu[] {
    const commonMenu: SidebarMenu[] = [
      {
        label: 'Register Company',
        icon: 'register',
        url: '/company',
      },
      {
        label: 'Assign',
        icon: 'assign',
        url: '/assign',
      },
      {
        label: 'Results',
        icon: 'results',
        url: '/results',
      },
    ];
    const paymentSettingsMenu: SidebarMenu[] = [
      {
        label: 'Payment',
        icon: 'payment',
        url: '/payment',
      },
      {
        label: 'Settings',
        icon: 'settings',
        url: '/settings',
        children: [
          {
            label: 'Configure',
            icon: 'settings',
          },
        ],
      },
    ];
    if (role === USER_ROLE.SUPER_ADMIN) {
      commonMenu.splice(1, 0, {
        label: 'Master Data',
        icon: 'dashboard',
        url: '/master',
      });
      commonMenu.splice(commonMenu.length - 1, 0, ...paymentSettingsMenu);
      return commonMenu;
    } else if (role === USER_ROLE.ADMIN) {
      return commonMenu.concat(paymentSettingsMenu);
    } else if (role === USER_ROLE.FRANCHISE) {
      return commonMenu;
    }
    return [];
  }

  private getHeaderMenu(): HeaderMenu[] {
    return [
      {
        label: 'Logout',
        onClick: () => {
          this.authenticationService.logout();
        },
      },
    ];
  }
}

// {
//   label: 'Administrator',
//   icon: 'admin',
// },

// Admin
// Dashboard, Register, Assign, Results, Payment, Settings

// Super Admin
// Dashboard, Master Data, Register, Assign, Results, Payment, Settings

// Franchise
// Dashboard, Register, Assign, Results

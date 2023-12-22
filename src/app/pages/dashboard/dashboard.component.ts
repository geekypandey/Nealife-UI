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

  ngOnInit() {
    this.spinner.show();
    forkJoin([this.profileService.getLoggedInUser(), this.profileService.getAccount()]).subscribe({
      next: ([profile, account]) => {
        this.sidebarMenus = this.getSidebarMenu(profile.role);
        this.headerMenus = this.getHeaderMenu();
        this.username = profile.roleDisplayName;
        this.companyName = profile.companyName;

        // Load first route
        this.loadFirstRoute(profile.role);
        this.spinner.hide();
        this.cd.markForCheck();
      },
      error: _ => this.spinner.hide(),
    });
  }

  private loadFirstRoute(role: string) {
    const baseRoute = '/dashboard';
    if (role === USER_ROLE.SUPER_ADMIN) {
      this.router.navigate([baseRoute + '/superadmin']);
    } else if (role === USER_ROLE.ADMIN) {
      this.router.navigate([baseRoute + '/admin']);
    } else if (role === USER_ROLE.FRANCHISE) {
      this.router.navigate([baseRoute + '/franchise']);
    }
  }

  private getSidebarMenu(role: string): SidebarMenu[] {
    const commonMenu: SidebarMenu[] = [
      {
        label: 'Dashboard',
        icon: 'dashboard',
        url: '/dashboard',
      },
      {
        label: 'Register Company',
        icon: 'register',
        url: '/dashboard/register',
      },
      {
        label: 'Assign',
        icon: 'assign',
        url: '/dashboard/assign',
      },
      {
        label: 'Results',
        icon: 'results',
        url: '/dashboard/results',
      },
    ];
    const paymentSettingsMenu: SidebarMenu[] = [
      {
        label: 'Payment',
        icon: 'payment',
        url: '/dashboard/payment',
      },
      {
        label: 'Settings',
        icon: 'settings',
        url: '/dashboard/settings',
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
        url: '/dashboard/master',
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

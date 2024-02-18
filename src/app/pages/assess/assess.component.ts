import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin } from 'rxjs';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { HeaderMenu } from 'src/app/components/header/header.model';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SidebarMenu } from './assess.model';
import { AssignService } from './assign/assessment.service';
import { CompanyService } from './company/company.service';
import { AssessService } from './services/assess.service';
import { ProfileService } from './services/profile.service';

@Component({
  selector: 'nl-assess',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    SidebarComponent,
    HeaderComponent,
  ],
  templateUrl: './assess.component.html',
  styleUrls: ['./assess.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProfileService, AssessService, CompanyService, AssignService],
})
export class AssessComponent {
  sidebarMenus: SidebarMenu[] = [];
  headerMenus: HeaderMenu[] = [];
  username: string = '';
  companyName: string = '';

  private navigationService = inject(NavigationService);
  private spinner = inject(NgxSpinnerService);
  private profileService = inject(ProfileService);
  private authService = inject(AuthenticationService);
  private cdRef = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.headerMenus = [
      {
        label: 'Logout',
        onClick: () => {
          this.authService.logout();
        },
      },
    ];

    this.spinner.show();
    forkJoin([this.profileService.getLoggedInUser(), this.profileService.getAccount()])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ([profile, account]) => {
          this.sidebarMenus = this.navigationService.getSidebarMenus(
            this.profileService.isAdminRole(),
            account.privilege,
            account.authorities
          );
          this.username = profile.roleDisplayName;
          this.companyName = profile.companyName;
          this.spinner.hide();
          this.cdRef.markForCheck();
        },
        error: _ => this.spinner.hide(),
      });
  }
}

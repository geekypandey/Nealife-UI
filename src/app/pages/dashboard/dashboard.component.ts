import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { forkJoin } from 'rxjs';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardService } from './services/dashboard.service';
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

  private profileService = inject(ProfileService);
  private dashboardService = inject(DashboardService);
  private cd = inject(ChangeDetectorRef);

  ngOnInit() {
    forkJoin([
      this.profileService.getLoggedInUser(),
      this.profileService.getAccount(),
      this.dashboardService.getCompetencyAspectProjections(),
    ]).subscribe(([profile, account, compProjections]) => {
      this.username = profile.roleDisplayName;
      this.companyName = profile.companyName;
      this.cd.markForCheck();
    });
  }
}

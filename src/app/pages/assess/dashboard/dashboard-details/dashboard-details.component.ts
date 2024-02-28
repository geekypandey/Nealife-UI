import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize, map, of, switchMap } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { ColDef } from 'src/app/components/table/table.model';
import { USER_ROLE } from 'src/app/constants/user-role.constants';
import { AccountDashboardDetails, SaDashboard } from '../../assess.model';
import { AssessService } from '../../services/assess.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'nl-dashboard-details',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, TableComponent],
  templateUrl: './dashboard-details.component.html',
  styleUrls: ['./dashboard-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardDetailsComponent {
  dashboardDetails$: Observable<any[] | SaDashboard[]>;
  spinnerName = 'dashboard-details';
  cols: ColDef[] = [];

  private activatedRoute = inject(ActivatedRoute);
  private assessService = inject(AssessService);
  private spinner = inject(NgxSpinnerService);
  profileService = inject(ProfileService);
  accountDashboardNotificationsResp!: AccountDashboardDetails;

  constructor() {
    const companyId = this.activatedRoute.snapshot.queryParamMap.get('companyId');
    this.spinner.show(this.spinnerName);
    this.dashboardDetails$ = this.profileService.getProfile().pipe(
      switchMap(profile => {
        let payload = {};
        if ([USER_ROLE.ADMIN, USER_ROLE.FRANCHISE].includes(profile.role)) {
          this.cols = [
            { field: 'fileName', header: 'File Name' },
            { field: 'userName', header: 'User Name' },
            { field: 'notificationStatus', header: 'Status' },
            { field: 'assessmentStatus', header: 'Assessment Status' },
            { field: 'assessmentTakenDate', header: 'Assessment Taken Date' },
          ];
          const assessmentId = this.activatedRoute.snapshot.queryParamMap.get('assessmentId');
          payload = {
            page: 0,
            size: 10,
            sort: 'id,desc',
            'companyId.equals': companyId,
            'companyAssessmentId.equals': assessmentId,
          };
          return this.assessService.getAccountdashboardNotificationLookup(payload).pipe(
            map(resp => {
              this.accountDashboardNotificationsResp = resp;
              return resp.notifications;
            })
          );
        }
        if (profile.role === USER_ROLE.SUPER_ADMIN) {
          this.cols = [
            { field: 'companyName', header: 'Company Name' },
            { field: 'assessmentsLeftToAssign', header: 'Assessment Left to Assign' },
            { field: 'assessmentName', header: 'Assessment Name' },
            { field: 'allottedAssessments', header: 'Allotted Assessment' },
          ];
          payload = {
            companyId: companyId,
          };
          return this.assessService.getDashboardDetails(payload);
        }
        return of([]);
      }),
      takeUntilDestroyed(),
      finalize(() => this.spinner.hide(this.spinnerName))
    );
  }

  goBack(): void {
    window.history.back();
  }

  get userRole() {
    return USER_ROLE;
  }
}

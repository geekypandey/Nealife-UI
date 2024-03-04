import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize, map, of, switchMap } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { Action, ColDef } from 'src/app/components/table/table.model';
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
  private router = inject(Router);
  private cdRef = inject(ChangeDetectorRef);
  profileService = inject(ProfileService);
  accountDashboardNotificationsResp!: AccountDashboardDetails;
  actionsList: Action[] = [];

  readonly ASSIGNED: string = 'ASSIGNED';

  constructor() {
    const companyId = this.activatedRoute.snapshot.queryParamMap.get('companyId');
    this.spinner.show(this.spinnerName);
    this.dashboardDetails$ = this.profileService.getProfile().pipe(
      switchMap(profile => {
        let payload = {};
        if ([USER_ROLE.ADMIN, USER_ROLE.FRANCHISE].includes(profile.role)) {
          this.cols = [
            // { field: 'fileName', header: 'File Name' },
            { field: 'userName', header: 'User Name' },
            { field: 'contactNumber1', header: 'Contact Number' },
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
              const notifications =
                resp && resp.notifications && resp.notifications.length ? resp.notifications : [];
              const finalNotificationArr = notifications.map(notif => ({
                ...notif,
                hasAssignStatus: notif.assessmentStatus === this.ASSIGNED,
              }));
              if (finalNotificationArr.some(n => n.hasAssignStatus)) {
                this.cols = [...this.cols, { field: 'hasAssignStatus', header: 'Action' }];
              }
              return finalNotificationArr.flat();
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

  onEditAction(id: string) {
    this.router.navigate([id + '/edit'], {
      relativeTo: this.activatedRoute,
    });
  }

  goBack(): void {
    window.history.back();
  }

  get userRole() {
    return USER_ROLE;
  }
}

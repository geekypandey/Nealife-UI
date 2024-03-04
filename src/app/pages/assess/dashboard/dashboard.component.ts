import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TableRowSelectEvent } from 'primeng/table';
import { Observable, filter, finalize, switchMap, tap } from 'rxjs';
import {
  AssessCard,
  AssessCardsComponent,
} from 'src/app/components/assess-cards/assess-cards.component';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { ColDef } from 'src/app/components/table/table.model';
import { USER_ROLE } from 'src/app/constants/user-role.constants';
import { Account, AccountDashboard } from '../assess.model';
import { AssessService } from '../services/assess.service';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'nl-dashboard',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, TableComponent, AssessCardsComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  spinnerName: string = 'dashboard-spinner';

  cols: ColDef[] = [];
  assessCards: AssessCard[] = [];

  private spinner = inject(NgxSpinnerService);
  private assessService = inject(AssessService);
  public readonly profileService = inject(ProfileService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  dashboardStats$: Observable<AccountDashboard>;
  private cd = inject(ChangeDetectorRef);
  private role!: USER_ROLE;

  constructor() {
    // Cols based on Role
    this.profileService
      .getProfile()
      .pipe(
        tap(profile => {
          if (profile.role === USER_ROLE.SUPER_ADMIN) {
            this.cols = [
              { field: 'companyName', header: 'Name of Admin' },
              { field: 'allottedAssessments', header: 'No. of Assessments Allotted' },
              { field: 'assessmentsLeftToAssign', header: 'Assessments left to Assign' },
            ];
            this.assessCards = [
              {
                label: 'Total Admin',
                icon: 'alloted-assess',
                count: 'totalCredits',
              },
              {
                label: 'Total Assessments Allotted',
                icon: 'alloted-assess',
                count: 'usedCredits',
              },
              {
                label: 'Total Client',
                icon: 'used-assess',
                count: 'availableCredits',
              },
            ];
          }
          if (profile.role === USER_ROLE.ADMIN) {
            this.cols = [
              { field: 'companyName', header: 'Client Name' },
              { field: 'assessmentName', header: 'Assessment Name' },
              { field: 'allocatedCredits', header: 'Alloted Assessments' },
              { field: 'usedCredits', header: 'Used Assessments' },
              { field: 'availableCredits', header: 'Balance Assessments' },
              { field: 'validFrom', header: 'Valid From' },
              { field: 'validTo', header: 'Valid To' },
            ];
            this.assessCards = [
              {
                label: 'Allotted Assessments',
                icon: 'alloted-assess',
                count: 'totalCredits',
              },
              {
                label: 'Used Assessments',
                icon: 'used-assess',
                count: 'usedCredits',
              },
              {
                label: 'Balance Assessments',
                icon: 'used-assess',
                count: 'availableCredits',
              },
            ];
          }
          if (profile.role === USER_ROLE.FRANCHISE) {
            this.cols = [
              { field: 'assessmentName', header: 'Assessment Name' },
              { field: 'allocatedCredits', header: 'Alloted Assessments' },
              { field: 'usedCredits', header: 'Used Assessments' },
              { field: 'availableCredits', header: 'Balance Assessments' },
              { field: 'validFrom', header: 'Valid From' },
              { field: 'validTo', header: 'Valid To' },
            ];
            this.assessCards = [
              {
                label: 'Types of Assessment Allotted',
                icon: 'alloted-assess',
                count: 'totalAssessments',
              },
              {
                label: 'No. of Allotted Assessments',
                icon: 'alloted-assess',
                count: 'totalCredits',
              },
              {
                label: 'Used Assessments',
                icon: 'used-assess',
                count: 'usedCredits',
              },
              {
                label: 'Balance Assessments',
                icon: 'used-assess',
                count: 'availableCredits',
              },
            ];
          }
          this.role = profile.role;
          this.cd.markForCheck();
        }),
        takeUntilDestroyed()
      )
      .subscribe();

    this.spinner.show(this.spinnerName);
    this.dashboardStats$ = this.profileService.getAccount().pipe(
      filter((account): account is Account => !!account),
      switchMap(account => this.assessService.getDashboard(account.companyId)),
      takeUntilDestroyed(),
      finalize(() => this.spinner.hide(this.spinnerName))
    );
  }

  onRowSelect(event: TableRowSelectEvent) {
    let routePath = 'dashboard-details';
    if (this.role === this.userRole.ADMIN) {
      routePath = 'dashboard-admin-stats';
    }
    this.router.navigate([routePath], {
      relativeTo: this.activatedRoute,
      queryParams: {
        companyId: event.data.companyId,
        assessmentId: event.data.assessmentId,
        companyAssessmentGroupId: event.data.companyAssessmentGroupId,
        companyAssessmentGroupBranchMappingId: event.data.companyAssessmentGroupBranchMappingId,
      },
    });
  }

  get userRole() {
    return USER_ROLE;
  }
}

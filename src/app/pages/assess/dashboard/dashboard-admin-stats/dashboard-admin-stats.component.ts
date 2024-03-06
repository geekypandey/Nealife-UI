import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TableRowSelectEvent } from 'primeng/table';
import { Observable } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { ColDef } from 'src/app/components/table/table.model';
import { AssessService } from '../../services/assess.service';

@Component({
  selector: 'nl-dashboard-admin-stats',
  standalone: true,
  imports: [CommonModule, TableComponent, SpinnerComponent],
  templateUrl: './dashboard-admin-stats.component.html',
  styleUrls: ['./dashboard-admin-stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardAdminStatsComponent {
  private spinner = inject(NgxSpinnerService);
  private assessService = inject(AssessService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  spinnerName = 'dashboard-admin-stats';
  adminStats$: Observable<any>;
  cols: ColDef[] = [];

  constructor() {
    this.cols = [
      { field: 'companyName', header: 'Company Name' },
      { field: 'assessmentsLeftToAssign', header: 'Assessment Left to Assign' },
      { field: 'assessmentName', header: 'Assessment Name' },
      { field: 'allottedAssessments', header: 'Allotted Assessment' },
    ];

    const queryParams = this.activatedRoute.snapshot.queryParams;
    const payload = {
      assessmentId: queryParams['assessmentId'] || null,
      companyAssessmentGroupId: queryParams['companyAssessmentGroupId'] || null,
      companyAssessmentGroupBranchMappingId:
        queryParams['companyAssessmentGroupBranchMappingId'] || null,
      companyId: queryParams['companyId'] || null,
    };
    this.adminStats$ = this.assessService.getDashboardAdminStats(payload);
  }

  goBack() {
    window.history.back();
  }

  onRowSelect(event: TableRowSelectEvent) {
    const routePath = './../dashboard-details';
    let queryParams: any = {
      companyId: event.data.companyId,
    };
    if (event.data.companyAssessmentId) {
      queryParams = {
        ...queryParams,
        companyAssessmentId: event.data.companyAssessmentId,
      };
    } else if (event.data.companyAssessmentGroupId) {
      queryParams = {
        ...queryParams,
        companyAssessmentGroupId: event.data.companyAssessmentGroupId,
      };
    } else if (event.data.companyAssessmentGroupBranchId) {
      queryParams = {
        ...queryParams,
        companyAssessmentGroupBranchId: event.data.companyAssessmentGroupBranchId,
      };
    }

    this.router.navigate([routePath], {
      relativeTo: this.activatedRoute,
      queryParams,
    });
  }
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { ColDef } from 'src/app/components/table/table.model';
import { AccountDashboardDetails } from '../../assess.model';
import { AssessService } from '../../services/assess.service';

@Component({
  selector: 'nl-dashboard-details',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, TableComponent],
  templateUrl: './dashboard-details.component.html',
  styleUrls: ['./dashboard-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardDetailsComponent {
  dashboardDetails$: Observable<AccountDashboardDetails>;
  spinnerName = 'dashboard-details';
  cols: ColDef[] = [];

  private activatedRoute = inject(ActivatedRoute);
  private assessService = inject(AssessService);
  private spinner = inject(NgxSpinnerService);

  constructor() {
    this.cols = [
      { field: 'fileName', header: 'File Name' },
      { field: 'userName', header: 'User Name' },
      { field: 'notificationStatus', header: 'Status' },
      { field: 'assessmentStatus', header: 'Assessment Status' },
      { field: 'assessmentTakenDate', header: 'Assessment Taken Date' },
    ];
    const companyId = this.activatedRoute.snapshot.queryParamMap.get('companyId');
    const assessmentId = this.activatedRoute.snapshot.queryParamMap.get('assessmentId');
    const payload = {
      page: 0,
      size: 10,
      sort: 'id,desc',
      'companyId.equals': companyId,
      'companyAssessmentId.equals': assessmentId,
    };
    this.spinner.show(this.spinnerName);
    this.dashboardDetails$ = this.assessService
      .getAccountdashboardNotificationLookup(payload)
      .pipe(finalize(() => this.spinner.hide(this.spinnerName)));
  }
}

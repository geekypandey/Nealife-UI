import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize, switchMap, tap } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { ACTION_ICON, Action, ColDef } from 'src/app/components/table/table.model';
import { API_URL } from 'src/app/constants/api-url.constants';
import { IApplicationUserAssessment } from '../assess.model';
import { saveFile } from '../assess.util';
import { CRUDService } from '../services/crud.service';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'nl-results',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, TableComponent, RouterLink],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsComponent {
  cols: ColDef[] = [
    { field: 'id', header: 'Id' },
    { field: 'activationkey', header: 'Activation key' },
    { field: 'activated', header: 'Activated' },
    { field: 'status', header: 'Status' },
    { field: 'userName', header: 'User' },
    { field: 'assessmentName', header: 'Assessment' },
    { field: 'assessmentGroupName', header: 'Assessment Group' },
    { field: 'companyName', header: 'Company' },
    { field: 'notificationSent', header: 'Notification Sent' },
  ];
  actionsList: Action[] = [];

  readonly spinnerName = 'results-spinner';
  private profileService = inject(ProfileService);
  private crudService = inject(CRUDService);
  private spinner = inject(NgxSpinnerService);
  activatedRoute = inject(ActivatedRoute);
  result$: Observable<IApplicationUserAssessment[]>;

  constructor() {
    this.spinner.show(this.spinnerName);
    this.result$ = this.profileService.account$.pipe(
      switchMap(account =>
        this.crudService.query<IApplicationUserAssessment[]>(API_URL.applicationUserAssessment, {
          [`companyId.equals`]: account.companyId,
        })
      ),
      tap({
        next: _ => {
          this.spinner.hide(this.spinnerName);
        },
      }),
      finalize(() => this.spinner.hide(this.spinnerName))
    );

    this.actionsList = [
      {
        icon: ACTION_ICON.DOWNLOAD,
        field: 'reportUrl',
        onClick: (reportUrl: string) => {
          console.info(reportUrl);
          this.downloadPdfReport(reportUrl);
        },
      },
    ];
  }

  downloadPdfReport(reportUrl: string): any {
    this.spinner.show(this.spinnerName);
    this.crudService.downloadPdfReport(reportUrl).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        saveFile(blob, 'report.pdf');
        this.spinner.hide(this.spinnerName);
      },
      error: _ => this.spinner.hide(this.spinnerName),
    });
  }
}

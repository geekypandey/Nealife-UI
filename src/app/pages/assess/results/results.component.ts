import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { Observable, filter, finalize, map, switchMap } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { Action, ColDef } from 'src/app/components/table/table.model';
import { API_URL } from 'src/app/constants/api-url.constants';
import { Account, IApplicationUserAssessment } from '../assess.model';
import { saveFile } from '../assess.util';
import { AssessService } from '../services/assess.service';
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
    { field: 'companyName', header: 'Company' },
    { field: 'assessmentName', header: 'Assessment' },
    { field: 'status', header: 'Status' },
    { field: 'notificationSent', header: 'Report Sent' },
    { field: 'reportUrl', header: 'Download Report' },
    { field: 'resendToReport', header: 'Resend Report to Phone & Email' },
    // { field: 'resendToPhone', header: 'Resend Report to Phone' },
    // { field: 'resendToEmail', header: 'Resend Report to Email' },

    // { field: 'activationkey', header: 'Activation key' },
    // { field: 'activated', header: 'Activated' },
    // { field: 'userName', header: 'User' },
    // { field: 'assessmentGroupName', header: 'Assessment Group' },
    // { field: 'companyName', header: 'Company' },
    // { field: 'notificationSent', header: 'Notification Sent' },
  ];
  actionsList: Action[] = [];

  readonly spinnerName = 'results-spinner';
  private profileService = inject(ProfileService);
  private crudService = inject(CRUDService);
  private assessService = inject(AssessService);
  private toastService = inject(MessageService);
  private spinner = inject(NgxSpinnerService);
  activatedRoute = inject(ActivatedRoute);
  result$: Observable<IApplicationUserAssessment[]>;

  constructor() {
    this.spinner.show(this.spinnerName);
    this.result$ = this.profileService.getAccount().pipe(
      filter((account): account is Account => !!account),
      switchMap(account =>
        this.crudService.query<IApplicationUserAssessment[]>(API_URL.applicationUserAssessment, {
          [`companyId.equals`]: account.companyId,
        })
      ),
      map(resp => resp.map(v => ({ ...v, notificationSent: v.notificationSent ? 'Yes' : 'No' }))),
      finalize(() => this.spinner.hide(this.spinnerName))
    );

    // this.actionsList = [
    //   {
    //     icon: ACTION_ICON.DOWNLOAD,
    //     field: 'reportUrl',
    //     onClick: (reportUrl: string) => {
    //       console.info(reportUrl);
    //       this.downloadPdfReport(reportUrl);
    //     },
    //   },
    // ];
  }

  downloadPdfReport(reportUrl: string): any {
    this.spinner.show(this.spinnerName);
    this.crudService.downloadReport(reportUrl).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        saveFile(blob, 'report.pdf');
        this.toastService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Report donwloaded successfully !!',
          sticky: false,
          id: 'app-assessment-pdf-report',
        });
        this.spinner.hide(this.spinnerName);
      },
      error: _ => {
        this.toastService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to download pdf',
          sticky: true,
          id: 'app-assessment-pdf-report',
        });
        this.spinner.hide(this.spinnerName);
      },
    });
  }

  resendReport(id: string) {
    this.spinner.show(this.spinnerName);
    this.assessService.resendReport(id).subscribe({
      next: _ => {
        this.toastService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Report sent successfully !!',
          sticky: false,
          id: 'app-assessment-notification-report',
        });
        this.spinner.hide(this.spinnerName);
      },
      error: _ => {
        this.toastService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to send report',
          sticky: true,
          id: 'app-assessment-notification-report',
        });
        this.spinner.hide(this.spinnerName);
      },
    });
  }
}

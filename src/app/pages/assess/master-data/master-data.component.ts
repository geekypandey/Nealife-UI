import { CommonModule } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { TableRowSelectEvent } from 'primeng/table';
import { Observable, catchError, map, throwError } from 'rxjs';
import {
  AssessCard,
  AssessCardsComponent,
} from 'src/app/components/assess-cards/assess-cards.component';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { ColDef } from 'src/app/components/table/table.model';
import { API_URL } from 'src/app/constants/api-url.constants';
import { CompetencyAspectItemROCount, ICompetencyAspectProjection } from '../assess.model';
import { saveFile } from '../assess.util';
import { AssessService } from '../services/assess.service';
import { CRUDService } from '../services/crud.service';

@Component({
  selector: 'nl-master-data',
  standalone: true,
  imports: [CommonModule, TableComponent, SpinnerComponent, AssessCardsComponent],
  templateUrl: './master-data.component.html',
  styleUrls: ['./master-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MasterDataComponent {
  spinnerName: string = 'master-data-spinner';
  cols: ColDef[] = [
    { field: 'competency', header: 'Competency' },
    { field: 'childAspect', header: 'Child Aspect' },
    { field: 'childAspectType', header: 'Child Aspect Type' },
    { field: 'parentAspect', header: 'Parent Aspect' },
    { field: 'parentAspectType', header: 'Parent Aspect Type' },
  ];
  compProjectionsData: ICompetencyAspectProjection[] = [];
  assessCards: AssessCard[] = [];
  refreshCount = true;
  competencyAspectROCount$: Observable<CompetencyAspectItemROCount>;

  private spinner = inject(NgxSpinnerService);
  private assessService = inject(AssessService);
  private crudService = inject(CRUDService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toastService = inject(MessageService);
  private cd = inject(ChangeDetectorRef);
  fileUploadProgress: number = 0;

  constructor() {
    this.assessCards = [
      {
        label: 'Aspects',
        icon: 'alloted-assess',
        count: 'aspectCount',
      },
      {
        label: 'Competencies',
        icon: 'alloted-assess',
        count: 'competencyCount',
      },
      {
        label: 'Response Options',
        icon: 'used-assess',
        count: 'responseOptionCount',
      },
      {
        label: 'Items',
        icon: 'balance-assess',
        count: 'itemCount',
      },
    ];
    this.competencyAspectROCount$ = this.assessService.getCompetencyAspectItemROCount();
    this.spinner.show(this.spinnerName);
    this.assessService
      .getCompetencyAspectProjections()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: resp => {
          this.compProjectionsData = resp;
          this.cd.markForCheck();
        },
        complete: () => this.spinner.hide(this.spinnerName),
      });
  }

  onRowSelect(event: TableRowSelectEvent) {
    this.router.navigate(['master-data-details'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        childAspect: event.data.childAspect,
        parentAspect: event.data.parentAspect,
      },
    });
  }

  downloadTemplate(): void {
    this.spinner.show(this.spinnerName);
    this.crudService.downloadReport(API_URL.downloadTemplate).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/octet-stream' });
        saveFile(blob, 'master-data-template.xlsx');
        this.spinner.hide(this.spinnerName);
      },
      error: _ => this.spinner.hide(this.spinnerName),
    });
  }

  downloadResultSheet(): void {
    this.spinner.show(this.spinnerName);
    this.crudService.downloadReport(API_URL.downloadResultSheet).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/octet-stream' });
        saveFile(blob, 'Export-Results.xlsx');
        this.spinner.hide(this.spinnerName);
      },
      error: _ => this.spinner.hide(this.spinnerName),
    });
  }

  downloadErrorSummary(): void {
    this.spinner.show(this.spinnerName);
    this.crudService.downloadReport(API_URL.downloadSummary).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/octet-stream' });
        saveFile(blob, 'master-data-upload-summary.xlsx');
        this.spinner.hide(this.spinnerName);
      },
      error: _ => this.spinner.hide(this.spinnerName),
    });
  }

  onMasterDataSelected(event: any): void {
    const file = event.target.files[0];
    if (
      file?.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file?.type === 'application/vnd.ms-excel'
    ) {
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
      formData.append('DocId', `${file.name}-1`);
      this.assessService
        .uploadMasterData(formData)
        .pipe(
          map((mapEvent: any) => {
            if (mapEvent.type === HttpEventType.UploadProgress) {
              this.fileUploadProgress = Math.round((100 / mapEvent.total) * mapEvent.loaded);
              if (this.fileUploadProgress === 100) {
                this.toastService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'File uploaded successfully !!',
                  sticky: false,
                  id: 'master-data-file',
                });
              }
            } else if (mapEvent.type === HttpEventType.Response) {
              if (mapEvent && mapEvent.body !== null) {
                this.compProjectionsData = JSON.parse(mapEvent.body);
                this.refreshCount = false; // To update count
                setTimeout(() => {
                  this.refreshCount = true;
                  this.cd.markForCheck();
                }, 100);
                this.cd.markForCheck();
              }
              this.fileUploadProgress = 0;
            }
          }),
          catchError((err: any) => {
            this.fileUploadProgress = 0;
            this.toastService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to upload file',
              sticky: false,
              id: 'master-data-file',
            });
            return throwError(() => new Error(err.message));
          })
        )
        .subscribe();
    } else {
      this.toastService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select Excel file',
        sticky: false,
        id: 'master-data-file',
      });
    }
  }
}

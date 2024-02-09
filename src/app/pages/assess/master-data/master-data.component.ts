import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TableRowSelectEvent } from 'primeng/table';
import { Observable, finalize, tap } from 'rxjs';
import {
  AssessCard,
  AssessCardsComponent,
} from 'src/app/components/assess-cards/assess-cards.component';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { ColDef } from 'src/app/components/table/table.model';
import { CompetencyAspectItemROCount, ICompetencyAspectProjection } from '../assess.model';
import { saveFile } from '../assess.util';
import { AssessService } from '../services/assess.service';
import { CRUDService } from '../services/crud.service';
import { ProfileService } from '../services/profile.service';

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
  masterData$: Observable<ICompetencyAspectProjection[]>;
  assessCards: AssessCard[] = [];
  competencyAspectROCount$: Observable<CompetencyAspectItemROCount>;

  private spinner = inject(NgxSpinnerService);
  private assessService = inject(AssessService);
  private crudService = inject(CRUDService);
  private profileService = inject(ProfileService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.competencyAspectROCount$ = this.assessService.getCompetencyAspectItemROCount().pipe(
      tap(resp => {
        this.assessCards = [
          {
            label: 'Aspects',
            icon: 'alloted-assess',
            count: resp.aspectCount,
          },
          {
            label: 'Competencies',
            icon: 'alloted-assess',
            count: resp.competencyCount,
          },
          {
            label: 'Response Options',
            icon: 'used-assess',
            count: resp.responseOptionCount,
          },
          {
            label: 'Items',
            icon: 'balance-assess',
            count: resp.itemCount,
          },
        ];
      })
    );
    this.spinner.show(this.spinnerName);
    this.masterData$ = this.assessService
      .getCompetencyAspectProjections()
      .pipe(finalize(() => this.spinner.hide(this.spinnerName)));
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
    this.crudService.downloadReport('api/downloadTemplate').subscribe({
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
    this.crudService.downloadReport('api/downloadResultSheet').subscribe({
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
    this.crudService.downloadReport('api/downloadSummary').subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/octet-stream' });
        saveFile(blob, 'master-data-upload-summary.xlsx');
        this.spinner.hide(this.spinnerName);
      },
      error: _ => this.spinner.hide(this.spinnerName),
    });
  }
}

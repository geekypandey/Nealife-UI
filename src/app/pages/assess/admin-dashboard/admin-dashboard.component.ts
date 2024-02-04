import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize, forkJoin, map } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { ColDef } from 'src/app/components/table/table.model';
import {
  CompetencyAspectItemROCount,
  CompetencyAspectProjections,
} from '../../dashboard/dashboard.model';
import { AssessService } from '../services/assess.service';

@Component({
  selector: 'nl-admin-dashboard',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, TableComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent {
  compentencies$: Observable<{
    compProjections: CompetencyAspectProjections[];
    compProjectionsROObject: CompetencyAspectItemROCount;
  }>;
  cols: ColDef[] = [
    {
      header: 'Compentency',
      field: 'competency',
      width: '0.5rem',
    },
    {
      header: 'Child Aspect',
      field: 'childAspect',
      width: '2rem',
    },
    {
      header: 'Child Aspect Type',
      field: 'childAspectType',
      width: '2rem',
    },
    {
      header: 'Parent Aspect',
      field: 'parentAspect',
      width: '2rem',
    },
    {
      header: 'Parent Aspect Type',
      field: 'parentAspectType',
      width: '2rem',
    },
  ];

  private spinner = inject(NgxSpinnerService);
  private assessService = inject(AssessService);

  constructor() {
    this.spinner.show('admin-spinner');
    this.compentencies$ = forkJoin([
      this.assessService.getCompetencyAspectProjections(),
      this.assessService.getCompetencyAspectItemROCount(),
    ]).pipe(
      map(([compProjections, compProjectionsROObject]) => ({
        compProjections,
        compProjectionsROObject,
      })),
      finalize(() => this.spinner.hide('admin-spinner'))
    );
  }
}

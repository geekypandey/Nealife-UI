import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize, forkJoin, map } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { ColDef2 } from 'src/app/components/table/table.model';
import { CompetencyAspectItemROCount, CompetencyAspectProjections } from '../dashboard.model';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'nl-superadmin',
  standalone: true,
  imports: [CommonModule, TableComponent, SpinnerComponent],
  templateUrl: './superadmin.component.html',
  styleUrls: ['./superadmin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuperadminComponent {
  cols: ColDef2[] = [
    {
      header: 'Compentency',
      field: 'competency',
    },
    {
      header: 'Child Aspect',
      field: 'childAspect',
    },
    {
      header: 'Child Aspect Type',
      field: 'childAspectType',
    },
    {
      header: 'Parent Aspect',
      field: 'parentAspect',
    },
    {
      header: 'Parent Aspect Type',
      field: 'parentAspectType',
    },
  ];

  private dashboardService = inject(DashboardService);
  private cd = inject(ChangeDetectorRef);
  private spinner = inject(NgxSpinnerService);
  compentencies$: Observable<{
    compProjections: CompetencyAspectProjections[];
    compProjectionsROObject: CompetencyAspectItemROCount;
  }>;

  constructor() {
    this.spinner.show('superadmin-spinner');
    this.compentencies$ = forkJoin([
      this.dashboardService.getCompetencyAspectProjections(),
      this.dashboardService.getCompetencyAspectItemROCount(),
    ]).pipe(
      map(([compProjections, compProjectionsROObject]) => ({
        compProjections,
        compProjectionsROObject,
      })),
      finalize(() => this.spinner.hide('superadmin-spinner'))
    );
  }
}

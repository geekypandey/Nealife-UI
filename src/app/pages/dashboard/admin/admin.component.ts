import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize, forkJoin, map } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { ColDef } from 'src/app/components/table/table.model';
import { CompetencyAspectItemROCount, CompetencyAspectProjections } from '../dashboard.model';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'nl-admin',
  standalone: true,
  imports: [CommonModule, TableComponent, SpinnerComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
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

  compentencies$: Observable<{
    compProjections: CompetencyAspectProjections[];
    compProjectionsROObject: CompetencyAspectItemROCount;
  }>;

  private spinner = inject(NgxSpinnerService);
  private dashboardService = inject(DashboardService);

  constructor() {
    this.spinner.show('admin-spinner');
    this.compentencies$ = forkJoin([
      this.dashboardService.getCompetencyAspectProjections(),
      this.dashboardService.getCompetencyAspectItemROCount(),
    ]).pipe(
      map(([compProjections, compProjectionsROObject]) => ({
        compProjections,
        compProjectionsROObject,
      })),
      finalize(() => this.spinner.hide('admin-spinner'))
    );
  }
}

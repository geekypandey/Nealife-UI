import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize, forkJoin, map } from 'rxjs';
import { AgTableComponent } from 'src/app/components/ag-table/ag-table.component';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { ColDef2 } from 'src/app/components/table/table.model';
import { CompetencyAspectItemROCount, CompetencyAspectProjections } from '../dashboard.model';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'nl-admin',
  standalone: true,
  imports: [CommonModule, TableComponent, AgTableComponent, SpinnerComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
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
  cols2: ColDef[] = [
    {
      headerName: 'Compentency',
      field: 'competency',
    },
    {
      headerName: 'Child Aspect',
      field: 'childAspect',
    },
    {
      headerName: 'Child Aspect Type',
      field: 'childAspectType',
    },
    {
      headerName: 'Parent Aspect',
      field: 'parentAspect',
    },
    {
      headerName: 'Parent Aspect Type',
      field: 'parentAspectType',
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

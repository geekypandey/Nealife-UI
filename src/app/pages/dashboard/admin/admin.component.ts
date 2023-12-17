import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TableComponent } from 'src/app/components/table/table.component';
import { ColDef } from 'src/app/components/table/table.model';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'nl-admin',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  dashboardService = inject(DashboardService);
  cols: ColDef[] = [
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
}

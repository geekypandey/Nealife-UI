import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ColDef2 } from './table.model';

@Component({
  selector: 'nl-table',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  @Input() cols: ColDef2[] = [];
  @Input() value: any[] = [];
  @Input() paginator: boolean = true;
  @Input() showCurrentPageReport: boolean = true;
  @Input() defaultRowCount: number = 10;
  @Input() rowsPerPageOptions: number[] = [10, 25, 50];
  @Input() currentPageReportTemplate: string =
    'Showing {first} to {last} of {totalRecords} entries';
}

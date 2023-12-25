import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { Action, ColDef2 } from './table.model';

type ExtendedColDef = ColDef2 & { visible: boolean };

@Component({
  selector: 'nl-table',
  standalone: true,
  imports: [CommonModule, TableModule, FormsModule, FilterPipe],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  extendedColDefs: ExtendedColDef[] = [];
  @Input()
  set cols(cols: ColDef2[]) {
    this.extendedColDefs = cols.map(col => ({
      ...col,
      visible: true,
    }));
  }

  @Input() value: any[] = [];
  @Input() paginator: boolean = true;
  @Input() showCurrentPageReport: boolean = true;
  @Input() defaultRowCount: number = 10;
  @Input() rowsPerPageOptions: number[] = [10, 25, 50];
  @Input() currentPageReportTemplate: string =
    'Showing {first} to {last} of {totalRecords} entries';
  @Input() actionsList: Action[] = [];

  toggleColumn: boolean = false;
  toggleFilter: boolean = false;
  columnSearchText: string = '';

  isSelectedAll(): boolean {
    return (
      !!(this.extendedColDefs && this.extendedColDefs.length) &&
      this.extendedColDefs.every(col => col.visible)
    );
  }

  selectAll() {
    this.extendedColDefs = this.extendedColDefs.map(col => ({ ...col, visible: true }));
  }

  onColumnInput(value: string) {
    this.columnSearchText = value;
  }
}

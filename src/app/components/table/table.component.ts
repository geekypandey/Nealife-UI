import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { Action, ColDef } from './table.model';

type ExtendedColDef = ColDef & { visible: boolean };

@Component({
  selector: 'nl-table',
  standalone: true,
  imports: [CommonModule, TableModule, FormsModule, FilterPipe],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  filterAccordion: ExtendedColDef[] = [];
  extendedColDefs: ExtendedColDef[] = [];
  @Input()
  set cols(cols: ColDef[]) {
    this.extendedColDefs = cols.map(col => ({
      ...col,
      visible: true,
    }));
    this.filterAccordion = cols.map(col => ({
      ...col,
      visible: false,
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

  selectAll(event: Event) {
    const isChecked = (<HTMLInputElement>event.target).checked;
    this.extendedColDefs = this.extendedColDefs.map(col => ({ ...col, visible: isChecked }));
  }

  onColumnInput(value: string) {
    this.columnSearchText = value;
  }
}

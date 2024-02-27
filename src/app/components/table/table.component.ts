import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TableModule, TableRowSelectEvent } from 'primeng/table';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { AccordionItemComponent } from '../accordion/accordion-item/accordion-item.component';
import { AccordionComponent } from '../accordion/accordion.component';
import { Action, ColDef } from './table.model';

type ExtendedColDef = ColDef & { visible: boolean };

@Component({
  selector: 'nl-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    FilterPipe,
    AccordionComponent,
    AccordionItemComponent,
    RouterLink,
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  selectedItems: any;
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

  private _value: any[] = [];
  @Input()
  set value(value: any[]) {
    this._value = value;
    this.filteredValue = this.value;
  }
  get value() {
    return this._value;
  }
  @Input() viewCheckBox: boolean = false;
  @Input() paginator: boolean = true;
  @Input() showCurrentPageReport: boolean = true;
  @Input() defaultRowCount: number = 10;
  @Input() rowsPerPageOptions: number[] = [10, 25, 50];
  @Input() currentPageReportTemplate: string =
    'Showing {first} to {last} of {totalRecords} entries';
  @Input() actionsList: Action[] = [];
  @Input() selectionMode: 'single' | 'multiple' | undefined | null;
  @Input() selectionKey: string = 'id';
  @Output() onSelectionChange = new EventEmitter<Array<string>>();
  @Output() onRowSelect = new EventEmitter<TableRowSelectEvent>();

  @ContentChild('customBodyTpl') customBodyTpl!: TemplateRef<any>;

  toggleColumn: boolean = false;
  toggleFilter: boolean = false;
  columnSearchText: string = '';
  filteredValue: any[] = [];

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

  onFilterInputText(fieldName: string, searchText: string) {
    if (searchText) {
      this.filteredValue = this.value.filter((row: any) => {
        return row[fieldName].toString().toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
      });
    } else {
      this.filteredValue = this.value;
    }
  }

  emitSelectionEvent() {
    if (this.viewCheckBox) {
      this.onSelectionChange.emit(this.selectedItems.map((item: any) => item[this.selectionKey!]));
    }
  }

  onActionClick(action: Action, rowData: any) {
    const fields = action.field.split(',').map(field => rowData[field]);
    action.onClick.apply(null, fields);
    // action.onClick(rowData[action.field]);
  }
}

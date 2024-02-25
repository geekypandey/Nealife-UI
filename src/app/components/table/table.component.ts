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
import { TableModule } from 'primeng/table';
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
    RouterLink
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

  @Input() value: any[] = [];
  @Input() viewCheckBox: boolean = false;
  @Input() paginator: boolean = true;
  @Input() showCurrentPageReport: boolean = true;
  @Input() defaultRowCount: number = 10;
  @Input() rowsPerPageOptions: number[] = [10, 25, 50];
  @Input() currentPageReportTemplate: string =
    'Showing {first} to {last} of {totalRecords} entries';
  @Input() actionsList: Action[] = [];
  @Input() selectionMode: 'single' | 'multiple' | undefined | null;
  @Input() selectionKey: string | undefined;
  @Output() onSelectionChange = new EventEmitter<Array<string>>();

  @ContentChild('customBodyTpl') customBodyTpl!: TemplateRef<any>;

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

  onFilterInputText(fieldName: string, searchText: string) {
    console.info(fieldName, searchText);
  }

  emitSelectionEvent() {
    this.onSelectionChange.emit(this.selectedItems.map((item: any) => item[this.selectionKey!]));
  }
}

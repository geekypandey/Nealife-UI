import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'nl-ag-table',
  standalone: true,
  imports: [CommonModule, AgGridModule],
  templateUrl: './ag-table.component.html',
  styleUrls: ['./ag-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgTableComponent {
  @Input() rowData: any[] = [];
  @Input() colDefs: ColDef[] = [];
}

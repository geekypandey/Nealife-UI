import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable, finalize } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { ACTION_ICON, Action, ColDef } from 'src/app/components/table/table.model';
import { API_URL } from 'src/app/constants/api-url.constants';
import { CRUDService } from '../../services/crud.service';
import { IInterpretation } from './interpretation.model';

@Component({
  selector: 'nl-interpretation',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, TableComponent, RouterLink],
  templateUrl: './interpretation.component.html',
  styleUrls: ['./interpretation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterpretationComponent {
  spinnerName = 'interpretation-spinner';
  cols: ColDef[] = [
    { field: 'id', header: 'Id' },
    { field: 'aspectName', header: 'Aspect' },
    { field: 'high', header: 'High' },
    { field: 'low', header: 'Low' },
    { field: 'medium', header: 'Medium' },
    { field: 'interpretation1', header: 'Interpretation 1', width: '9rem' },
    { field: 'interpretation2', header: 'Interpretation 2' },
    { field: 'interpretation3', header: 'Interpretation 3' },
    { field: 'interpretation4', header: 'Interpretation 4' },
    { field: 'interpretation5', header: 'Interpretation 5' },
    { field: 'interpretation6', header: 'Interpretation 6' },
  ];
  activatedRoute = inject(ActivatedRoute);

  private crudService: CRUDService = inject(CRUDService);
  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);
  selectedItems: Array<string> = [];
  private http = inject(HttpClient);
  private toastService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  interpretations$: Observable<IInterpretation[]>;
  actionsList: Action[] = [];

  constructor() {
    this.actionsList = [
      {
        icon: ACTION_ICON.EDIT,
        field: 'id',
        onClick: (value: string) => {
          this.router.navigate([value + '/edit'], {
            relativeTo: this.activatedRoute,
          });
        },
      },
      {
        icon: ACTION_ICON.DELETE,
        field: 'id',
        onClick: (value: string) => {
          this.deleteItems([value]);
        },
      },
    ];
    this.spinner.show(this.spinnerName);
    this.interpretations$ = this.crudService
      .query<IInterpretation[]>(API_URL.interpretations)
      .pipe(finalize(() => this.spinner.hide(this.spinnerName)));
  }

  updateSelection(items: any) {
    this.selectedItems = items;
  }

  deleteItems(ids: Array<string>) {
    this.confirmationService.confirm({
      message: ids.length == 1 ? `Are you sure that you want to delete Interpretation ${ids[0]}?`: `Are you sure that you want to delete selected ${ids.length} Interpretation?`,
      header: 'Confirm Delete Operation',
      icon: 'pi pi-info-circle',
      accept: () => {
        for (const id of ids) {
          this.http.delete(`${API_URL.interpretations}/${id}`).subscribe({
            next: () => { },
            error: () => {}
          })
        }
        this.toastService.add({
          severity: 'success',
          summary: ids.length == 1 ? `Interpretation ${ids[0]} successfully deleted` : `${ids.length} Interpretation successfully deleted`
        })
        // TODO: complete functionality to refresh the page
        this.interpretations$ = this.crudService
          .query<IInterpretation[]>(API_URL.interpretations)
          .pipe(finalize(() => this.spinner.hide(this.spinnerName)));
      },
      reject: () => {}
    })
  }

  deleteSelectedItems() {
    this.deleteItems(this.selectedItems);
  }
}

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
import { INorm } from './norm.model';

@Component({
  selector: 'nl-norm',
  standalone: true,
  imports: [CommonModule, TableComponent, SpinnerComponent, RouterLink],
  templateUrl: './norm.component.html',
  styleUrls: ['./norm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NormComponent {
  spinnerName = 'norms-spinner';
  cols: ColDef[] = [
    { field: 'id', header: 'Id' },
    { field: 'stanine', header: 'Stanine' },
    { field: 'percentile', header: 'percentile' },
    { field: 'grade', header: 'Grade' },
    { field: 'aspect', header: 'Aspect' },
    { field: 'trait', header: 'Traits' },
    { field: 'value', header: 'Value' },
  ];
  activatedRoute = inject(ActivatedRoute);

  private crudService: CRUDService = inject(CRUDService);
  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);
  selectedItems: Array<string> = [];
  private http = inject(HttpClient);
  private toastService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  norms$: Observable<INorm[]>;
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
    this.norms$ = this.crudService
      .query<INorm[]>(API_URL.norms)
      .pipe(finalize(() => this.spinner.hide(this.spinnerName)));
  }

  updateSelection(items: any) {
    this.selectedItems = items;
  }

  deleteItems(ids: Array<string>) {
    this.confirmationService.confirm({
      message: ids.length == 1 ? `Are you sure that you want to delete Norms ${ids[0]}?`: `Are you sure that you want to delete selected ${ids.length} Norms?`,
      header: 'Confirm Delete Operation',
      icon: 'pi pi-info-circle',
      accept: () => {
        for (const id of ids) {
          this.http.delete(`${API_URL.norms}/${id}`).subscribe({
            next: () => { },
            error: () => {}
          })
        }
        this.toastService.add({
          severity: 'success',
          summary: ids.length == 1 ? `Norms ${ids[0]} successfully deleted` : `${ids.length} Norms successfully deleted`
        })
        // TODO: complete functionality to refresh the page
        this.norms$ = this.crudService
          .query<INorm[]>(API_URL.norms)
          .pipe(finalize(() => this.spinner.hide(this.spinnerName)));
      },
      reject: () => {}
    })
  }

  deleteSelectedItems() {
    this.deleteItems(this.selectedItems);
  }
}

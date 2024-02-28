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
import { Lookup } from '../assess.model';
import { CRUDService } from '../services/crud.service';

@Component({
  selector: 'nl-lookup',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, TableComponent, RouterLink],
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LookupComponent {
  spinnerName = 'lookup-spinner';
  lookup$: Observable<Lookup[]>;
  actionsList: Action[] = [];
  private spinner = inject(NgxSpinnerService);
  private crudService: CRUDService = inject(CRUDService);
  private router = inject(Router);
  selectedItems: Array<string> = [];
  private http = inject(HttpClient);
  private toastService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  activatedRoute = inject(ActivatedRoute);

  cols: ColDef[] = [
    { field: 'id', header: 'Id' },
    { field: 'type', header: 'Type' },
    { field: 'subtype', header: 'Sub Type' },
    { field: 'key', header: 'Key' },
    { field: 'value', header: 'Value' },
  ];

  constructor() {
    this.spinner.show(this.spinnerName);
    this.lookup$ = this.crudService
      .query<Lookup[]>(API_URL.lookup)
      .pipe(finalize(() => this.spinner.hide(this.spinnerName)));
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
  }

  updateSelection(items: any) {
    this.selectedItems = items;
  }

  deleteItems(ids: Array<string>) {
    this.confirmationService.confirm({
      message: ids.length == 1 ? `Are you sure that you want to delete LookUp ${ids[0]}?`: `Are you sure that you want to delete selected ${ids.length} LookUp?`,
      header: 'Confirm Delete Operation',
      icon: 'pi pi-info-circle',
      accept: () => {
        for (const id of ids) {
          this.http.delete(`${API_URL.lookup}/${id}`).subscribe({
            next: () => { },
            error: () => {}
          })
        }
        this.toastService.add({
          severity: 'success',
          summary: ids.length == 1 ? `LookUp ${ids[0]} successfully deleted` : `${ids.length} LookUp successfully deleted`
        })
        // TODO: complete functionality to refresh the page
        this.lookup$ = this.crudService
          .query<Lookup[]>(API_URL.lookup)
          .pipe(finalize(() => this.spinner.hide(this.spinnerName)));
      },
      reject: () => {}
    })
  }

  deleteSelectedItems() {
    this.deleteItems(this.selectedItems);
  }
}

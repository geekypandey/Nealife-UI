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
import { IAspect } from './aspect.model';

@Component({
  selector: 'nl-aspect',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, TableComponent, RouterLink],
  templateUrl: './aspect.component.html',
  styleUrls: ['./aspect.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AspectComponent {
  selectedItems: Array<string> = [];
  spinnerName = 'aspects-spinner';
  cols: ColDef[] = [
    { field: 'id', header: 'Id' },
    { field: 'name', header: 'Name' },
    { field: 'description', header: 'Description' },
    { field: 'type', header: 'Type' },
    { field: 'parent', header: 'Parent' },
  ];
  activatedRoute = inject(ActivatedRoute);

  private crudService: CRUDService = inject(CRUDService);
  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);
  private http = inject(HttpClient);
  private toastService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  aspects$: Observable<IAspect[]>;
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
    this.aspects$ = this.crudService
      .query<IAspect[]>(API_URL.aspects)
      .pipe(finalize(() => this.spinner.hide(this.spinnerName)));
  }

  updateSelection(items: any) {
    this.selectedItems = items;
  }

  deleteItems(ids: Array<string>) {
    this.confirmationService.confirm({
      message: ids.length == 1 ? `Are you sure that you want to delete Aspect ${ids[0]}?`: `Are you sure that you want to delete selected ${ids.length} Aspect?`,
      header: 'Confirm Delete Operation',
      icon: 'pi pi-info-circle',
      accept: () => {
        for (const id of ids) {
          this.http.delete(`${API_URL.aspects}/${id}`).subscribe({
            next: () => { },
            error: () => {}
          })
        }
        this.toastService.add({
          severity: 'success',
          summary: ids.length == 1 ? `Aspect ${ids[0]} successfully deleted` : `${ids.length} Aspect successfully deleted`
        })
        // TODO: complete functionality to refresh the page
        this.aspects$ = this.crudService
          .query<IAspect[]>(API_URL.aspects)
          .pipe(finalize(() => this.spinner.hide(this.spinnerName)));
      },
      reject: () => {}
    })
  }

  deleteSelectedItems() {
    this.deleteItems(this.selectedItems);
  }
}

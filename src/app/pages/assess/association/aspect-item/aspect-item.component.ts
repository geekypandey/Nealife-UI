import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { TableComponent } from 'src/app/components/table/table.component';
import { ACTION_ICON, Action, ColDef } from 'src/app/components/table/table.model';
import { API_URL } from 'src/app/constants/api-url.constants';

@Component({
  selector: 'nl-aspect-item',
  standalone: true,
  imports: [CommonModule, TableComponent, RouterLink],
  templateUrl: './aspect-item.component.html',
  styleUrls: ['./aspect-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AspectItemComponent {
  selectedItems: Array<string> = [];
  aspectItems$: Observable<any>;
  activatedRoute = inject(ActivatedRoute)

  private http = inject(HttpClient);
  private router = inject(Router);
  private toastService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  cols: ColDef[] = [
    { header: 'Id', field: 'id'},
    { header: 'Item', field: 'itemKey'},
    { header: 'Aspect', field: 'aspectName'},
    { header: 'Response Option', field: 'responseOption'},
    { header: 'Response Option Choice', field: 'responseOptionChoice'},
    { header: 'Choice', field: 'choice'},
  ]

  actionsList: Action[] = [
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
  ]

  constructor() {
    this.aspectItems$ = this.http.get<any>(`${API_URL.aspectItems}?page=0&size=5000&sort=id,desc`);
  }

  updateSelection(items: any) {
    this.selectedItems = items;
  }

  deleteItems(ids: Array<string>) {
    this.confirmationService.confirm({
      message: ids.length == 1 ? `Are you sure that you want to delete Aspect Item ${ids[0]}?`: `Are you sure that you want to delete selected ${ids.length} Aspect Item?`,
      header: 'Confirm Delete Operation',
      icon: 'pi pi-info-circle',
      accept: () => {
        for (const id of ids) {
          this.http.delete(`${API_URL.aspectItems}/${id}`).subscribe({
            next: () => { },
            error: () => {}
          })
        }
        this.toastService.add({
          severity: 'success',
          summary: ids.length == 1 ? `Aspect Item ${ids[0]} successfully deleted` : `${ids.length} Aspect Items successfully deleted`
        })
        // TODO: complete functionality to refresh the page
        this.aspectItems$ = this.http.get<any>(`${API_URL.aspectItems}?page=0&size=5000&sort=id,desc`);
      },
      reject: () => {}
    })
  }

  deleteSelectedItems() {
    this.deleteItems(this.selectedItems);
  }
}

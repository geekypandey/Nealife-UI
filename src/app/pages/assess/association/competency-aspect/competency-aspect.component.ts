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
  selector: 'nl-competency-aspect',
  standalone: true,
  imports: [CommonModule, TableComponent, RouterLink],
  templateUrl: './competency-aspect.component.html',
  styleUrls: ['./competency-aspect.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompetencyAspectComponent {
  selectedItems: Array<string> = [];
  competencyAspects$: Observable<any>;
  activatedRoute = inject(ActivatedRoute)

  private http = inject(HttpClient);
  private router = inject(Router);
  private toastService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  cols: ColDef[] = [
    { header: 'Id', field: 'id'},
    { header: 'Aspect', field: 'aspectName'},
    { header: 'Competency', field: 'competencyName'},
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
    this.competencyAspects$ = this.http.get<any>(`${API_URL.competencyAspects}?page=0&size=5000&sort=id,desc`);
  }

  updateSelection(items: any) {
    this.selectedItems = items;
  }

  deleteItems(ids: Array<string>) {
    this.confirmationService.confirm({
      message: ids.length == 1 ? `Are you sure that you want to delete Competency Aspect ${ids[0]}?`: `Are you sure that you want to delete selected ${ids.length} Competency Aspect?`,
      header: 'Confirm Delete Operation',
      icon: 'pi pi-info-circle',
      accept: () => {
        for (const id of ids) {
          this.http.delete(`${API_URL.competencyAspects}/${id}`).subscribe({
            next: () => { },
            error: () => {}
          })
        }
        this.toastService.add({
          severity: 'success',
          summary: ids.length == 1 ? `Competency Aspect ${ids[0]} successfully deleted` : `${ids.length} Competency Aspect successfully deleted`
        })
        // TODO: complete functionality to refresh the page
        this.competencyAspects$ = this.http.get<any>(`${API_URL.competencyAspects}?page=0&size=5000&sort=id,desc`);
      },
      reject: () => {}
    })
  }

  deleteSelectedItems() {
    this.deleteItems(this.selectedItems);
  }
}

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
  selector: 'nl-assessment-competency',
  standalone: true,
  imports: [CommonModule, TableComponent, RouterLink],
  templateUrl: './assessment-competency.component.html',
  styleUrls: ['./assessment-competency.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentCompetencyComponent {
  selectedItems: Array<string> = [];
  assessmentCompetencies$: Observable<any>;
  activatedRoute = inject(ActivatedRoute)

  private http = inject(HttpClient);
  private router = inject(Router);
  private toastService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  cols: ColDef[] = [
    { header: 'Id', field: 'id'},
    { header: 'Assessment', field: 'assessmentName'},
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
          this.confirmationService.confirm({
            message: `Are you sure that you want to delete Assessment Competency ${value}?`,
            header: 'Confirm Delete Operation',
            icon: 'pi pi-info-circle',
            accept: () => {
              this.http.delete(`${API_URL.assessmentCompetencies}/${value}`).subscribe({
                next: () => {
                  this.toastService.add({
                    severity: 'success',
                    summary: `Assessment Competency ${value} successfully deleted`
                })
                }
              })
              // TODO: complete functionality to refresh the page
              this.assessmentCompetencies$ = this.http.get<any[]>(API_URL.assessmentCompetencies);
            },
            reject: () => {}
          })
        },
      },
  ]

  constructor() {
    this.assessmentCompetencies$ = this.http.get<any>(`${API_URL.assessmentCompetencies}?page=0&size=5000&sort=id,desc`);
  }

  updateSelection(items: any) {
    this.selectedItems = items;
  }

  deleteSelectedItems() {
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete selected ${this.selectedItems.length} Assessment Competency?`,
      header: 'Confirm Delete Operation',
      icon: 'pi pi-info-circle',
      accept: () => {
        for (const item of this.selectedItems) {
          this.http.delete(`${API_URL.assessmentCompetencies}/${item}`).subscribe({
            next: () => { },
            error: () => {}
          })
        }
        this.toastService.add({
          severity: 'success',
          summary: `${this.selectedItems.length} Assessment Competency successfully deleted`
        })
        // TODO: complete functionality to refresh the page
        this.assessmentCompetencies$ = this.http.get<any[]>(API_URL.assessmentCompetencies);
      },
      reject: () => {}
    })
  }
}

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { TableComponent } from 'src/app/components/table/table.component';
import { ACTION_ICON, Action, ColDef } from 'src/app/components/table/table.model';
import { API_URL } from 'src/app/constants/api-url.constants';

@Component({
  selector: 'nl-group-assessments',
  standalone: true,
  imports: [CommonModule, TableComponent, RouterLink],
  templateUrl: './group-assessments.component.html',
  styleUrls: ['./group-assessments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupAssessmentsComponent {
  groupAssessments$: Observable<any>;
  activatedRoute = inject(ActivatedRoute)

  private http = inject(HttpClient);
  private router = inject(Router);

  cols: ColDef[] = [
    { header: 'Id', field: 'id'},
    { header: 'Assessment Group', field: 'assessmentGroupName'},
    { header: 'Assessment', field: 'assessmentName'},
    { header: 'Sequence', field: 'sequence'},
    { header: 'Time Limit', field: 'timeLimit'},
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
          this.router.navigate([value + '/edit'], {
            relativeTo: this.activatedRoute,
          });
        },
      },
  ]

  constructor() {
    this.groupAssessments$ = this.http.get<any>(`${API_URL.assessmentGroup}?page=0&size=5000&sort=id,desc`);
  }
}


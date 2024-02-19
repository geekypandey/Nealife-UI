import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { TableComponent } from 'src/app/components/table/table.component';
import { ACTION_ICON, Action, ColDef } from 'src/app/components/table/table.model';
import { API_URL } from 'src/app/constants/api-url.constants';
import { Assessment } from '../../assess.model';

@Component({
  selector: 'nl-assessment',
  standalone: true,
  imports: [CommonModule, TableComponent, RouterLink],
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentComponent {
  assessments$: Observable<Array<Assessment>>;
  activatedRoute = inject(ActivatedRoute);

  private http = inject(HttpClient);
  private router = inject(Router)

  cols: ColDef[] = [
    { header: 'Id', field: 'id' },
    { header: 'Name', field: 'displayName'},
    { header: 'Status', field: 'status'},
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
    this.assessments$ = this.http.get<any>(`${API_URL.assessments}?page=0&size=5000&sort=id,desc`);
  }

}

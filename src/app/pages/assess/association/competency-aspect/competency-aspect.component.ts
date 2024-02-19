import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  competencyAspects$: Observable<any>;
  activatedRoute = inject(ActivatedRoute)

  private http = inject(HttpClient);
  private router = inject(Router);

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
          this.router.navigate([value + '/edit'], {
            relativeTo: this.activatedRoute,
          });
        },
      },
  ]

  constructor() {
    this.competencyAspects$ = this.http.get<any>(`${API_URL.competencyAspects}?page=0&size=5000&sort=id,desc`);
  }
}

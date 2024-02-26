import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { ACTION_ICON, Action, ColDef } from 'src/app/components/table/table.model';
import { API_URL } from 'src/app/constants/api-url.constants';

@Component({
  selector: 'nl-company-assessment-group',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, TableComponent, RouterLink],
  templateUrl: './company-assessment-group.component.html',
  styleUrls: ['./company-assessment-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyAssessmentGroupComponent {

  spinnerName = 'company-assessment';
  assessmentGroups$: Observable<any[]>;
  actionsList: Array<Action>;
  activatedRoute = inject(ActivatedRoute);

  cols: ColDef[] = [
    { header: 'Id', field: 'id' },
    { header: 'Company', field: 'companyName'},
    { header: 'Assessment Group', field: 'assessmentGroupName'},
    { header: 'Total Credits', field: 'timeLimit'},
    { header: 'Available Credits', field: 'availableCredits'},
    { header: 'Used Credits', field: 'usedCredits'},
    { header: 'Time Limit', field: 'timeLimit'},
    { header: 'Scheduled Date', field: 'scheduledDate'},
  ]

  private http = inject(HttpClient);
  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);

  constructor() {
    this.spinner.show(this.spinnerName);
    this.assessmentGroups$ = this.http.get<any[]>(API_URL.assignGroup).pipe(finalize(() => this.spinner.hide(this.spinnerName)));
    this.actionsList = [
      {
        icon: ACTION_ICON.EDIT,
        field: 'id',
        onClick: (value: string) => {
          this.router.navigate(['company-assessment-group/' + value + '/edit'], {
            relativeTo: this.activatedRoute,
          });
        },
      },
    ]
  }
}

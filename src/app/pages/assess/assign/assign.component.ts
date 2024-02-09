import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TabViewModule } from 'primeng/tabview';
import { Observable, finalize } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { ACTION_ICON, Action, ColDef } from 'src/app/components/table/table.model';
import { API_URL } from 'src/app/constants/api-url.constants';
import { Assessment } from '../assess.model';
import { AssignService } from './assign.service';


@Component({
  selector: 'nl-assign',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, TableComponent, RouterLink, TabViewModule],
  templateUrl: './assign.component.html',
  styleUrls: ['./assign.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignComponent {
  private spinner = inject(NgxSpinnerService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private assignService = inject(AssignService);

  spinnerName: string = 'assign-spinner';
  assessments$: Observable<Assessment[]>;
  assessmentGroups$: Observable<any[]>;
  activatedRoute = inject(ActivatedRoute);

  cols: ColDef[] = [
    { header: 'Id', field: 'id' },
    { header: 'Company', field: 'companyName'},
    { header: 'Assessment', field: 'assessmentName'},
    { header: 'Time limit', field: 'timeLimit'},
    { header: 'Available Credits', field: 'availableCredits'},
    { header: 'Used Credits', field: 'usedCredits'},
  ]

  assessmentGroupCols: ColDef[] = [
    { header: 'Id', field: 'id' },
    { header: 'Company', field: 'companyName'},
    { header: 'Assessment Group', field: 'assessmentGroupName'},
    { header: 'Total Credits', field: 'timeLimit'},
    { header: 'Available Credits', field: 'availableCredits'},
    { header: 'Used Credits', field: 'usedCredits'},
    { header: 'Time Limit', field: 'timeLimit'},
    { header: 'Scheduled Date', field: 'scheduledDate'},
  ]

  actionsList: Action[];
  assessmentGroupActionList: Action[];



  constructor() {
    this.spinner.show(this.spinnerName);
    this.assessments$ = this.assignService.getAssessments().pipe(
      finalize(() => this.spinner.hide(this.spinnerName))
    );
    this.assessmentGroups$ = this.http.get<any[]>(API_URL.assignGroup);
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
    ]
    this.assessmentGroupActionList = [
      {
        icon: ACTION_ICON.EDIT,
        field: 'id',
        onClick: (value: string) => {
          this.router.navigate([value + '/edit'], {
            relativeTo: this.activatedRoute,
          });
        },
      },
    ]
  }
}
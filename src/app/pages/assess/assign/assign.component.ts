import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { ACTION_ICON, Action, ColDef } from 'src/app/components/table/table.model';
import { Assessment } from '../../render-assessment/render-assessment.model';
import { AssignService } from './assign.service';


@Component({
  selector: 'nl-assign',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, TableComponent, RouterLink],
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
  activatedRoute = inject(ActivatedRoute);

  cols: ColDef[] = [
    { header: 'Id', field: 'id' },
    { header: 'Company', field: 'companyName'},
    { header: 'Assessment', field: 'assessmentName'},
    { header: 'Time limit', field: 'timeLimit'},
    { header: 'Available Credits', field: 'availableCredits'},
    { header: 'Used Credits', field: 'usedCredits'},
  ]

  actionsList: Action[];



  constructor() {
    this.spinner.show(this.spinnerName);
    this.assessments$ = this.assignService.getAssessments().pipe(
      finalize(() => this.spinner.hide(this.spinnerName))
    );
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
  }
}

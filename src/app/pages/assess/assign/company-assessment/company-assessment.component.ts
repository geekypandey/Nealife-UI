import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { ACTION_ICON, Action, ColDef } from 'src/app/components/table/table.model';
import { Assessment } from '../../assess.model';
import { AssignService } from '../assign.service';

@Component({
  selector: 'nl-company-assessment',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, TableComponent, RouterLink],
  templateUrl: './company-assessment.component.html',
  styleUrls: ['./company-assessment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyAssessmentComponent {
  spinnerName = 'company-assessment';
  assessments$: Observable<Assessment[]>;
  actionsList: Array<Action>;
  activatedRoute = inject(ActivatedRoute);

  cols: ColDef[] = [
    { header: 'Id', field: 'id' },
    { header: 'Company', field: 'companyName'},
    { header: 'Assessment', field: 'assessmentName'},
    { header: 'Time limit', field: 'timeLimit'},
    { header: 'Available Credits', field: 'availableCredits'},
    { header: 'Used Credits', field: 'usedCredits'},
  ]

  private assignService = inject(AssignService);
  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);


  constructor() {
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

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { ColDef } from 'src/app/components/table/table.model';
import { AssessService } from '../../services/assess.service';
import { AssessmentGroupDetails } from '../assessment-group.model';

@Component({
  selector: 'nl-assessment-group-details',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, TableComponent, RouterLink],
  templateUrl: './assessment-group-details.component.html',
  styleUrls: ['./assessment-group-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssessmentGroupDetailsComponent {
  assessmentByGroup$: Observable<AssessmentGroupDetails[]>;
  spinnerName = 'assessment-group-details';
  private assessService = inject(AssessService);
  private spinnerService = inject(NgxSpinnerService);
  private activatedRoute = inject(ActivatedRoute);

  cols: ColDef[] = [
    { field: 'name', header: 'Assessment' },
    { field: 'description', header: 'Description' },
  ];

  constructor() {
    this.spinnerService.show(this.spinnerName);
    this.assessmentByGroup$ = this.assessService
      .getAssessmentsByGroupDetails({
        assessmentGroupId: this.activatedRoute.snapshot.queryParams['assessmentGroupId'] || '',
      })
      .pipe(finalize(() => this.spinnerService.hide(this.spinnerName)));
  }
}

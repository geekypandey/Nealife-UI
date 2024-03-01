import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize, switchMap } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { AssessmentStepperComponent } from 'src/app/pages/render-assessment/assessment-stepper/assessment-stepper.component';
import { RenderAssessmentResponse } from 'src/app/pages/render-assessment/render-assessment.model';
import { AssessmentService } from '../assessment.service';

@Component({
  selector: 'nl-view-assessment-test',
  standalone: true,
  imports: [CommonModule, AssessmentStepperComponent, SpinnerComponent],
  templateUrl: './view-assessment-test.component.html',
  styleUrls: ['./view-assessment-test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewAssessmentTestComponent {
  spinnerName = 'view-assessment-test';
  private spinnerService = inject(NgxSpinnerService);
  private assessmentService = inject(AssessmentService);
  private route = inject(ActivatedRoute);
  viewAssessment$: Observable<RenderAssessmentResponse>;

  constructor() {
    this.spinnerService.show(this.spinnerName);

    this.viewAssessment$ = this.route.queryParams.pipe(
      switchMap(params => {
        return this.assessmentService
          .viewTestAssessment({
            id: params['assessmentId'],
            isGroupAssessment: params['companyAssessmentGroupId'],
          })
          .pipe(finalize(() => this.spinnerService.hide(this.spinnerName)));
      })
    );
  }
}

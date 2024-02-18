import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Assessment } from '../../../assess.model';
import { ProfileService } from '../../../services/profile.service';
import { AssessmentService } from '../../assessment.service';

@Component({
  selector: 'nl-company-assessment-edit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-assessment-edit.component.html',
  styleUrls: ['./company-assessment-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyAssessmentEditComponent {
  assessments$: Observable<Assessment>;
  private activatedRoute = inject(ActivatedRoute);
  private assessmentService = inject(AssessmentService);
  private profileService = inject(ProfileService);

  constructor() {
    const assessmentId = this.activatedRoute.snapshot.params['id'];
    console.log(assessmentId);
    this.assessments$ = this.assessmentService.getAssessment(assessmentId).pipe(tap((value) => console.log(value)));
    this.profileService.getLoggedInUser().subscribe((value) => console.log(value))
  }

}

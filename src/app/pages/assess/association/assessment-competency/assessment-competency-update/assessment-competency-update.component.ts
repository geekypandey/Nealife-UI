import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nl-assessment-competency-update',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assessment-competency-update.component.html',
  styleUrls: ['./assessment-competency-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentCompetencyUpdateComponent {

}

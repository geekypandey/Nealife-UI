import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nl-assessment-competency',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assessment-competency.component.html',
  styleUrls: ['./assessment-competency.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentCompetencyComponent {

}

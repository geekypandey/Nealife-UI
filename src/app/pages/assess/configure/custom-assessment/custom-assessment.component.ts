import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nl-custom-assessment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-assessment.component.html',
  styleUrls: ['./custom-assessment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomAssessmentComponent {

}

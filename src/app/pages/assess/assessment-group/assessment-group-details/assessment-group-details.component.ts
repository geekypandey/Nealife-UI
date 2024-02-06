import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nl-assessment-group-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assessment-group-details.component.html',
  styleUrls: ['./assessment-group-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentGroupDetailsComponent {

}

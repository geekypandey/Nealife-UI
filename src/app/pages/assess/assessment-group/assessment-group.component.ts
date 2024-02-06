import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nl-assessment-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assessment-group.component.html',
  styleUrls: ['./assessment-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentGroupComponent {

}

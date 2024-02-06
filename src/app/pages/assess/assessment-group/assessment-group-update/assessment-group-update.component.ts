import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nl-assessment-group-update',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assessment-group-update.component.html',
  styleUrls: ['./assessment-group-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentGroupUpdateComponent {

}

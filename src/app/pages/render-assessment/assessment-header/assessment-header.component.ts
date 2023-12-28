import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nl-assessment-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assessment-header.component.html',
  styleUrls: ['./assessment-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentHeaderComponent {

}

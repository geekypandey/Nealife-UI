import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'nl-assessment-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assessment-header.component.html',
  styleUrls: ['./assessment-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssessmentHeaderComponent {
  @Input()
  logoUrl: string = '';
}

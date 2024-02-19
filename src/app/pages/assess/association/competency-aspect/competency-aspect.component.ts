import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nl-competency-aspect',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './competency-aspect.component.html',
  styleUrls: ['./competency-aspect.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompetencyAspectComponent {

}

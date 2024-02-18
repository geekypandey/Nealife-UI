import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nl-competency-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './competency-detail.component.html',
  styleUrls: ['./competency-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompetencyDetailComponent {

}

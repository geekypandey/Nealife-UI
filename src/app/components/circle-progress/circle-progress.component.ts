import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nl-circle-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './circle-progress.component.html',
  styleUrls: ['./circle-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleProgressComponent {

}

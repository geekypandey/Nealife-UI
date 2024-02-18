import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nl-aspect-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aspect-detail.component.html',
  styleUrls: ['./aspect-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AspectDetailComponent {

}

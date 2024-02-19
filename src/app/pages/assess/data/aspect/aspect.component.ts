import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nl-aspect',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aspect.component.html',
  styleUrls: ['./aspect.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AspectComponent {

}

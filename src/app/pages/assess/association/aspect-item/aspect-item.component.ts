import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nl-aspect-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aspect-item.component.html',
  styleUrls: ['./aspect-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AspectItemComponent {

}

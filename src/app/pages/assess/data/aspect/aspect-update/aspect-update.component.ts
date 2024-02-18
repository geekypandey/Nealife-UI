import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nl-aspect-update',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aspect-update.component.html',
  styleUrls: ['./aspect-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AspectUpdateComponent {

}

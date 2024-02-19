import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nl-association',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './association.component.html',
  styleUrls: ['./association.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssociationComponent {

}

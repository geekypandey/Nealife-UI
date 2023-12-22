import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nl-franchise',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './franchise.component.html',
  styleUrls: ['./franchise.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FranchiseComponent {

}

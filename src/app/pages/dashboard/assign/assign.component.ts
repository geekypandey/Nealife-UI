import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nl-assign',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assign.component.html',
  styleUrls: ['./assign.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignComponent {

}

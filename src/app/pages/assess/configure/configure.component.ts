import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nl-configure',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigureComponent {

}

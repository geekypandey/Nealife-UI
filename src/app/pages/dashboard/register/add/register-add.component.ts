import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nl-register-add',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './register-add.component.html',
  styleUrls: ['./register-add.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterAddComponent {

}

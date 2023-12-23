import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nl-register-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './register-detail.component.html',
  styleUrls: ['./register-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterDetailComponent {

}

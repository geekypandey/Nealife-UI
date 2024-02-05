import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nl-application-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './application-user.component.html',
  styleUrls: ['./application-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicationUserComponent {

}

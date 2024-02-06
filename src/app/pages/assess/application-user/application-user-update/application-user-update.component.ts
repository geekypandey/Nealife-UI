import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nl-application-user-update',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './application-user-update.component.html',
  styleUrls: ['./application-user-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicationUserUpdateComponent {

}

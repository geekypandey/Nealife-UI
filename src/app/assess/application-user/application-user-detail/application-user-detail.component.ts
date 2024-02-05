import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nl-application-user-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './application-user-detail.component.html',
  styleUrls: ['./application-user-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApplicationUserDetailComponent {

}

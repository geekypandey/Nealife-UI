import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ApplicationUser } from '../application-user.model';

@Component({
  selector: 'nl-application-user-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './application-user-detail.component.html',
  styleUrls: ['./application-user-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationUserDetailComponent {
  @Input() applicationUser!: ApplicationUser;

  goBack() {
    window.history.back();
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nl-admin-dashboard-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard-detail.component.html',
  styleUrls: ['./admin-dashboard-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardDetailComponent {

}

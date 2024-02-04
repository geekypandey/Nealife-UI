import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nl-company-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyDetailComponent {

}

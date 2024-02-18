import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nl-company-assessment-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-assessment-details.component.html',
  styleUrls: ['./company-assessment-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyAssessmentDetailsComponent {

}

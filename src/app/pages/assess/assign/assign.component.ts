import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { CompanyAssessmentGroupComponent } from './company-assessment-group/company-assessment-group.component';
import { CompanyAssessmentComponent } from './company-assessment/company-assessment.component';



@Component({
  selector: 'nl-assign',
  standalone: true,
  imports: [CommonModule , TabViewModule, CompanyAssessmentComponent, CompanyAssessmentGroupComponent],
  templateUrl: './assign.component.html',
  styleUrls: ['./assign.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignComponent {
}

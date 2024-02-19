import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { AssessmentGroupComponent } from '../assessment-group/assessment-group.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { CustomAssessmentComponent } from './custom-assessment/custom-assessment.component';

@Component({
  selector: 'nl-configure',
  standalone: true,
  imports: [CommonModule, TabViewModule, AssessmentComponent, CustomAssessmentComponent, AssessmentGroupComponent],
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigureComponent {

}

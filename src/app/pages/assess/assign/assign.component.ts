import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { TabGroupComponent } from 'src/app/components/tab-group/tab-group.component';
import { Tab } from 'src/app/components/tab-group/tab.model';
import { CompanyAssessmentGroupComponent } from './company-assessment-group/company-assessment-group.component';
import { CompanyAssessmentComponent } from './company-assessment/company-assessment.component';



@Component({
  selector: 'nl-assign',
  standalone: true,
  imports: [CommonModule , TabViewModule, CompanyAssessmentComponent, CompanyAssessmentGroupComponent, TabGroupComponent],
  templateUrl: './assign.component.html',
  styleUrls: ['./assign.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssignComponent {
  tabs: Tab[];

  constructor() {
    this.tabs = [
      {
        header: 'Assign Assessment',
        url: 'company-assessment',
      },
      {
        header: 'Assign Assessment Group',
        url: 'company-assessment-group',
      },
    ];
  }
}

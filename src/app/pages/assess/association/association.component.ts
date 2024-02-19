import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { AspectItemComponent } from './aspect-item/aspect-item.component';
import { AssessmentCompetencyComponent } from './assessment-competency/assessment-competency.component';
import { CompetencyAspectComponent } from './competency-aspect/competency-aspect.component';
import { GroupAssessmentsComponent } from './group-assessments/group-assessments.component';

@Component({
  selector: 'nl-association',
  standalone: true,
  imports: [CommonModule, TabViewModule, AspectItemComponent, AssessmentCompetencyComponent, CompetencyAspectComponent, GroupAssessmentsComponent],
  templateUrl: './association.component.html',
  styleUrls: ['./association.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssociationComponent {

}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabViewModule } from 'primeng/tabview';
import { AspectItemComponent } from './aspect-item/aspect-item.component';
import { AssessmentCompetencyComponent } from './assessment-competency/assessment-competency.component';
import { CompetencyAspectComponent } from './competency-aspect/competency-aspect.component';
import { GroupAssessmentsComponent } from './group-assessments/group-assessments.component';

export enum ASSOCIATION_TAB_INDEX {
  ASSESSMENT_COMPETENCY,
  COMPETENCY_ASPECT,
  ASPECT_ITEM,
  GROUP_ASSESSMENTS
}

@Component({
  selector: 'nl-association',
  standalone: true,
  imports: [CommonModule, TabViewModule, AspectItemComponent, AssessmentCompetencyComponent, CompetencyAspectComponent, GroupAssessmentsComponent],
  templateUrl: './association.component.html',
  styleUrls: ['./association.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssociationComponent implements OnInit {
  selectedTabIndex: number = ASSOCIATION_TAB_INDEX.ASSESSMENT_COMPETENCY;

  private activateRoute = inject(ActivatedRoute)
  private router = inject(Router);

  ngOnInit(): void {
    const tabIndex = this.activateRoute.snapshot.data['tabIndex'];
    if (tabIndex) {
      this.selectedTabIndex = tabIndex;
    }
  }

  changeTab(event: any) {
    const val: number = event.index;
    const routeName = {
      0: 'assessment-competency',
      1: 'competency-aspect',
      2: 'aspect-item',
      3: 'group-assessments'
    }[val];
    console.log(routeName)
    this.router.navigate([`assess/association/${routeName}`]);
  }
}

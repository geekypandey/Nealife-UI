import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nl-group-assessments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './group-assessments.component.html',
  styleUrls: ['./group-assessments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupAssessmentsComponent {

}

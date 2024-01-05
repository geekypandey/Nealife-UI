import { CdkStep } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'nl-step',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CdkStep, useExisting: StepComponent }],
})
export class StepComponent extends CdkStep {
  @Input()
  title: string = '';
  @Input()
  subTitle?: string = '';
  @Input()
  showSubTitle: boolean = false;
  @Input()
  icon: string = '';
}

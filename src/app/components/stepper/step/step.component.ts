import { CdkStep } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

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
  icon: string = '';
  @Input()
  instructionPageObj?: { [key: string]: string };
  @Input()
  set stepFormGroup(value: FormGroup | undefined) {
    if (value) {
      this.stepControl = value;
    }
  }
}

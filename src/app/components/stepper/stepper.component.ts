import { CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, QueryList } from '@angular/core';
import { StepComponent } from './step/step.component';

@Component({
  selector: 'nl-stepper',
  standalone: true,
  imports: [CommonModule, CdkStepperModule],
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CdkStepper, useExisting: StepperComponent }],
})
export class StepperComponent extends CdkStepper {
  override readonly steps: QueryList<StepComponent> = new QueryList<StepComponent>();

  onClick(index: number): void {
    this.selectedIndex = index;
  }
}

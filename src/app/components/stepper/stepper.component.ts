import { CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, QueryList, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { scrollIntoView } from 'src/app/util/util';
import { StepComponent } from './step/step.component';

@Component({
  selector: 'nl-stepper',
  standalone: true,
  imports: [CommonModule, CdkStepperModule],
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CdkStepper, useExisting: StepperComponent }],
  animations: [
    // matStepperAnimations.horizontalStepTransition,
    // matStepperAnimations.verticalStepTransition,
  ],
})
export class StepperComponent extends CdkStepper {
  override readonly steps: QueryList<StepComponent> = new QueryList<StepComponent>();
  private doc = inject(DOCUMENT);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.selectionChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(v => {
      const stepId = this.getStepId(v.selectedIndex);
      const el = this.doc.getElementById(stepId);
      scrollIntoView(el);
    });
  }

  onClick(index: number): void {
    this.selectedIndex = index;
  }

  getStepId(index: number) {
    return `cdk-step-${this._groupId}-${index}`;
  }
}

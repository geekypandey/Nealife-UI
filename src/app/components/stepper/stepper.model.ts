import { FormGroup } from '@angular/forms';

export interface Step {
  title: string;
  icon?: string;
  subTitle?: string;
  completed?: boolean;
  stepFormGroup?: FormGroup;
  instructionPageObj?: { [key: string]: string };
}

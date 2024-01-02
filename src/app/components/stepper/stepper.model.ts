import { FormGroup } from '@angular/forms';

export interface Step {
  title: string;
  icon?: string;
  subTitle?: string;
  completed?: boolean;
  stepControl: FormGroup;
}

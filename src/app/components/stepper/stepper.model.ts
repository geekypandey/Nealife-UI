import { FormGroup } from '@angular/forms';

export interface Step {
  title: string;
  icon?: string;
  subTitle?: string;
  showSubTitle: boolean;
  completed?: boolean;
  stepControl: FormGroup;
}

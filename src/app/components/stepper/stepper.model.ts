import { FormGroup } from '@angular/forms';
import { SafeResourceUrl } from '@angular/platform-browser';

export interface Step {
  title: string;
  icon?: string;
  subTitle?: string;
  completed?: boolean;
  stepFormGroup?: FormGroup;
  instructionUrl?: SafeResourceUrl;
}

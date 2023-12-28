import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { DropdownOption } from 'src/app/models/common.model';
import { SharedApiService } from 'src/app/services/shared-api.service';
import { getDropdownOptions } from 'src/app/util/util';
import { AssessmentHeaderComponent } from '../assessment-header/assessment-header.component';
import { Demographic } from '../render-assessment.model';

@Component({
  selector: 'nl-personal-info',
  standalone: true,
  imports: [
    CommonModule,
    AssessmentHeaderComponent,
    CalendarModule,
    DropdownModule,
    SpinnerComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalInfoComponent {
  lookUpResp: any;

  personalInfoFields: Demographic[] = [];
  userType: DropdownOption[] = [];
  gender: DropdownOption[] = [];
  age: DropdownOption[] = [];
  education: DropdownOption[] = [];
  experience: DropdownOption[] = [];
  race: DropdownOption[] = [];
  occupation: DropdownOption[] = [];
  career: DropdownOption[] = [];
  designation: DropdownOption[] = [];
  country: DropdownOption[] = [];
  location: DropdownOption[] = [];
  income: DropdownOption[] = [];
  standard: DropdownOption[] = [];
  stream: DropdownOption[] = [];
  board: DropdownOption[] = [];
  basicInfoForm!: FormGroup;
  todaysDate: Date = new Date();

  private sharedApiService = inject(SharedApiService);
  private spinner = inject(NgxSpinnerService);
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);

  @Input()
  set fields(fields: Demographic[]) {
    this.personalInfoFields = fields && fields.length ? fields : [];
    this.initForm();
  }

  @Input()
  set queryParamcc(cc: string) {
    setTimeout(() => this.basicInfoForm.get('code')?.setValue(cc));
  }

  ngOnInit() {
    this.spinner.show('personal-info');
    forkJoin(this.lookupObsArr()).subscribe({
      next: _ => {
        this.cd.markForCheck();
        this.spinner.hide('personal-info');
      },
      error: _ => this.spinner.hide('personal-info'),
    });
  }

  isDropdownField(fieldObj: Demographic): string {
    return this.dropDownFieldsKeys.includes(fieldObj.key) ? 'dropdown' : fieldObj.key;
  }

  onSubmit() {}

  isRequired(key: string) {
    return this.basicInfoForm.get(key)?.hasValidator(Validators.required);
  }

  optionsArray(fieldName: string): any {
    if (fieldName === 'age') {
      return this.age;
    } else if (fieldName === 'education') {
      return this.education;
    } else if (fieldName === 'standard') {
      return this.standard;
    } else if (fieldName === 'stream') {
      return this.stream;
    } else if (fieldName === 'board') {
      return this.board;
    } else if (fieldName === 'experience') {
      return this.experience;
    } else if (fieldName === 'race') {
      return this.race;
    } else if (fieldName === 'occupation') {
      return this.occupation;
    } else if (fieldName === 'careers') {
      return this.career;
    } else if (fieldName === 'designation') {
      return this.designation;
    } else if (fieldName === 'country') {
      return this.country;
    } else if (fieldName === 'location') {
      return this.location;
    } else if (fieldName === 'income') {
      return this.income;
    } else if (fieldName === 'gender') {
      return this.gender;
    } else return [];
  }

  private initForm() {
    const form = {} as any;
    this.personalInfoFields.forEach(obj => {
      obj['key'] === 'email'
        ? (form[obj['key']] = [
            '',
            [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
          ])
        : (form[obj['key']] = ['', [Validators.required]]);

      if (obj['key'] === 'contactNumber') {
        form[obj['key']] = [
          '',
          [
            Validators.required,
            Validators.pattern('^[0-9]*$'),
            Validators.maxLength(10),
            Validators.minLength(10),
          ],
        ];
      }
      // if (obj['key'] === 'sectors' || this.reportType === this.engReport || this.reportType === this.mbaReport) {
      //   form['sectors'] = [[]];
      // }
    });
    this.basicInfoForm = this.fb.group(form);

    // this.cd.markForCheck();
  }

  private lookupObsArr() {
    return [
      this.sharedApiService
        .lookup('USER_TYPE')
        .pipe(tap(res => (this.userType = getDropdownOptions(res, 'key', 'id')))),
      this.sharedApiService
        .lookup('GENDER')
        .pipe(tap(res => (this.gender = getDropdownOptions(res, 'key', 'id')))),
      this.sharedApiService
        .lookup('AGE')
        .pipe(tap(res => (this.age = getDropdownOptions(res, 'key', 'id')))),
      this.sharedApiService
        .lookup('EDUCATION')
        .pipe(tap(res => (this.education = getDropdownOptions(res, 'key', 'id')))),
      this.sharedApiService
        .lookup('EXPERIENCE')
        .pipe(tap(res => (this.experience = getDropdownOptions(res, 'key', 'id')))),
      this.sharedApiService
        .lookup('RACE')
        .pipe(tap(res => (this.race = getDropdownOptions(res, 'key', 'id')))),
      this.sharedApiService
        .lookup('OCCUPATION')
        .pipe(tap(res => (this.occupation = getDropdownOptions(res, 'key', 'id')))),
      this.sharedApiService
        .lookup('CAREERS')
        .pipe(tap(res => (this.career = getDropdownOptions(res, 'key', 'id')))),
      this.sharedApiService
        .lookup('DESIGNATION')
        .pipe(tap(res => (this.designation = getDropdownOptions(res, 'key', 'id')))),
      this.sharedApiService
        .lookup('COUNTRY')
        .pipe(tap(res => (this.country = getDropdownOptions(res, 'key', 'id')))),
      this.sharedApiService
        .lookup('LOCATION')
        .pipe(tap(res => (this.location = getDropdownOptions(res, 'key', 'id')))),
      this.sharedApiService
        .lookup('FAMILY_INCOME')
        .pipe(tap(res => (this.income = getDropdownOptions(res, 'key', 'id')))),
      this.sharedApiService
        .lookup('STANDARD')
        .pipe(tap(res => (this.standard = getDropdownOptions(res, 'key', 'id')))),
      this.sharedApiService
        .lookup('STREAM')
        .pipe(tap(res => (this.stream = getDropdownOptions(res, 'key', 'id')))),
      this.sharedApiService
        .lookup('BOARD')
        .pipe(tap(res => (this.board = getDropdownOptions(res, 'key', 'id')))),
    ];
  }

  get dropDownFieldsKeys() {
    return [
      'age',
      'education',
      'experience',
      'race',
      'occupation',
      'careers',
      'designation',
      'country',
      'location',
      'income',
      'standard',
      'stream',
      'board',
    ];
  }
}

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
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
import { DateToString, StringToDate } from 'src/app/util/util';
import { AssessmentHeaderComponent } from '../assessment-header/assessment-header.component';
import { Demographic, PreAssessmentDetailsDemographics } from '../render-assessment.model';

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
  sectors: DropdownOption[] = [];
  engBranches: DropdownOption[] = [];
  mbaBranches: DropdownOption[] = [];

  basicInfoForm!: FormGroup;
  todaysDate: Date = new Date();

  private sharedApiService = inject(SharedApiService);
  private spinner = inject(NgxSpinnerService);
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);

  readonly spinnerName: string = 'personal-info';

  @Input({ required: true })
  set fields(fields: Demographic[]) {
    this.personalInfoFields = fields && fields.length ? fields : [];
    this.initForm();
  }

  @Input({ required: true })
  set queryParamcc(cc: string) {
    setTimeout(() => this.basicInfoForm.get('code')?.setValue(cc));
  }

  @Input()
  set demographics(value: PreAssessmentDetailsDemographics | undefined) {
    if (value) {
      this.initDemographics(value);
    }
  }

  @Output()
  onSubmitForm = new EventEmitter();

  ngOnInit() {
    this.spinner.show(this.spinnerName);
    forkJoin(this.lookupObsArr()).subscribe({
      next: _ => {
        this.cd.markForCheck();
        this.spinner.hide(this.spinnerName);
      },
      error: _ => this.spinner.hide(this.spinnerName),
    });
  }

  isDropdownField(fieldObj: Demographic): string {
    return this.dropDownFieldsKeys.includes(fieldObj.key) ? 'dropdown' : fieldObj.key;
  }

  submit() {
    this.onSubmitForm.emit({
      ...this.basicInfoForm.value,
      dateOfBirth: DateToString(this.basicInfoForm.value.dateOfBirth),
    });
  }

  isRequired(key: string) {
    const formCtrl = this.basicInfoForm.get(key);
    return formCtrl && formCtrl.enabled && formCtrl.hasValidator(Validators.required);
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

    this.basicInfoForm.get('standard')?.valueChanges.subscribe(val => {
      if ([4, 5, 6].includes(val)) {
        this.basicInfoForm.get('stream')?.disable();
        this.basicInfoForm.get('stream')?.setValue('');
      } else {
        this.basicInfoForm.get('stream')?.enable();
        this.basicInfoForm.get('stream')?.setValue('');
      }
    });
  }

  private initDemographics(demographicsValue: PreAssessmentDetailsDemographics) {
    if (this.basicInfoForm) {
      this.basicInfoForm.patchValue({
        ...demographicsValue,
        dateOfBirth: StringToDate(demographicsValue.dateOfBirth),
      });
    }
  }

  private lookupObsArr() {
    return [
      this.sharedApiService.lookup('USER_TYPE').pipe(tap(res => (this.userType = res))),
      this.sharedApiService.lookup('GENDER').pipe(tap(res => (this.gender = res))),
      this.sharedApiService.lookup('AGE').pipe(tap(res => (this.age = res))),
      this.sharedApiService.lookup('EDUCATION').pipe(tap(res => (this.education = res))),
      this.sharedApiService.lookup('EXPERIENCE').pipe(tap(res => (this.experience = res))),
      this.sharedApiService.lookup('RACE').pipe(tap(res => (this.race = res))),
      this.sharedApiService.lookup('OCCUPATION').pipe(tap(res => (this.occupation = res))),
      this.sharedApiService.lookup('CAREERS').pipe(tap(res => (this.career = res))),
      this.sharedApiService.lookup('DESIGNATION').pipe(tap(res => (this.designation = res))),
      this.sharedApiService.lookup('COUNTRY').pipe(tap(res => (this.country = res))),
      this.sharedApiService.lookup('LOCATION').pipe(tap(res => (this.location = res))),
      this.sharedApiService.lookup('FAMILY_INCOME').pipe(tap(res => (this.income = res))),
      this.sharedApiService.lookup('STANDARD').pipe(tap(res => (this.standard = res))),
      this.sharedApiService.lookup('STREAM').pipe(tap(res => (this.stream = res))),
      this.sharedApiService.lookup('BOARD').pipe(tap(res => (this.board = res))),
      this.sharedApiService.lookup('SECTORS').pipe(tap(res => (this.sectors = res))),
      this.sharedApiService.lookup('ENGINEERING_BRANCH').pipe(tap(res => (this.engBranches = res))),
      this.sharedApiService.lookup('MBA_BRANCH').pipe(tap(res => (this.mbaBranches = res))),
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

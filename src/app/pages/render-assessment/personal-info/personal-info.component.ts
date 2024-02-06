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
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { combineLatest, forkJoin } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { AccordionItemComponent } from 'src/app/components/accordion/accordion-item/accordion-item.component';
import { Accordion, AccordionComponent } from 'src/app/components/accordion/accordion.component';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { DropdownOption, LookupResponse } from 'src/app/models/common.model';
import { SharedApiService } from 'src/app/services/shared-api.service';
import { DateToString, StringToDate } from 'src/app/util/util';
import { AssessmentHeaderComponent } from '../assessment-header/assessment-header.component';
import { Demographic, PreAssessmentDetailsDemographics } from '../render-assessment.model';

type CheckboxAccordion = Accordion & { id: number; checked: boolean };

export function ValidateMaxBranchSelection(max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    return value.length > max ? { maxLengthError: true } : null;
  };
}

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
    AccordionComponent,
    AccordionItemComponent,
    CheckboxModule,
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
  sectors: LookupResponse[] = [];
  engBranches: LookupResponse[] = [];
  mbaBranches: LookupResponse[] = [];

  basicInfoForm!: FormGroup<any>;
  todaysDate: Date = new Date();
  accordions: CheckboxAccordion[] = [];

  isEmailOrContactEmpty: boolean = false;

  private sharedApiService = inject(SharedApiService);
  private spinner = inject(NgxSpinnerService);
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);

  readonly spinnerName: string = 'personal-info';
  showAccordion: boolean = false;

  @Input({ required: true })
  set fields(fields: Demographic[]) {
    this.personalInfoFields = fields && fields.length ? fields : [];
    this.initForm();
  }

  @Input({ required: true })
  set queryParamcc(cc: string) {
    setTimeout(() => this.basicInfoForm.get('code')?.setValue(cc));
  }

  private _preAssessmentDemographics!: PreAssessmentDetailsDemographics;
  @Input()
  set preAssessmentDemographics(value: PreAssessmentDetailsDemographics | undefined) {
    if (value) {
      this._preAssessmentDemographics = value;
      this.initDemographics(value);
    }
  }

  get preAssessmentDemographics() {
    return this._preAssessmentDemographics;
  }

  reportTypes: string[] = ['NSQFREPORT', 'ECFEREPORT', 'MCFEREPORT'];
  private _reportType: string = '';
  maxBranchSelection: number = 10;

  @Input()
  set reportType(value: string) {
    this._reportType = value;
    if (value === 'NSQFREPORT') {
      this.maxBranchSelection = 5;
      this.sectorsApiCall().subscribe(resp => {
        this.accordions = this.getAccordions(resp);
        this.cd.markForCheck();
      });
    } else if (value === 'ECFEREPORT') {
      this.engBranchApiCall().subscribe(resp => {
        this.accordions = this.getAccordions(resp);
        this.cd.markForCheck();
      });
    } else if (value === 'MCFEREPORT') {
      this.mbaBranchApiCall().subscribe(resp => {
        this.accordions = this.getAccordions(resp);
        this.cd.markForCheck();
      });
    }
  }
  get reportType() {
    return this._reportType;
  }

  @Output()
  onSubmitForm = new EventEmitter();

  ngOnInit() {
    this.spinner.show(this.spinnerName);
    forkJoin(this.lookupObsArr()).subscribe({
      next: _ => {
        this.spinner.hide(this.spinnerName);
        this.cd.markForCheck();
      },
      error: _ => this.spinner.hide(this.spinnerName),
    });
  }

  isDropdownField(fieldObj: Demographic): string {
    return this.dropDownFieldsKeys.includes(fieldObj.key) ? 'dropdown' : fieldObj.key;
  }

  next() {
    const isValid = this.checkEmailContactNumber();
    if (!isValid || this.basicInfoForm.invalid) {
      return;
    }
    this.showAccordion = true;
    let sectorsInitialValue = [];
    if (this._preAssessmentDemographics) {
      const { sectors } = this._preAssessmentDemographics;
      sectorsInitialValue = sectors;
    }
    this.basicInfoForm.addControl(
      'sectors',
      new FormControl(
        {
          value: sectorsInitialValue,
          disabled: sectorsInitialValue.length > 0,
        },
        [
          Validators.required,
          // Validators.min(1),
          ValidateMaxBranchSelection(this.maxBranchSelection),
        ]
      )
    );
  }

  submit() {
    const isValid = this.checkEmailContactNumber();
    if (!isValid || this.basicInfoForm.invalid) {
      return;
    }
    this.onSubmitForm.emit({
      ...this.basicInfoForm.value,
      dateOfBirth: DateToString(this.basicInfoForm.value && this.basicInfoForm.value.dateOfBirth),
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

  private checkEmailContactNumber() {
    const email = this.basicInfoForm.get('email')?.value;
    const contactNumber1 = this.basicInfoForm.get('contactNumber1')?.value;
    if (!(email || contactNumber1)) {
      this.basicInfoForm.markAllAsTouched();
      this.isEmailOrContactEmpty = true;
      return false;
    }
    this.isEmailOrContactEmpty = false;
    return true;
  }

  private getAccordions(resp: any[]): CheckboxAccordion[] {
    return resp && resp.length
      ? resp.map(v => ({ id: v.id, header: v.key, body: v.subType, checked: false }))
      : [];
  }

  private initForm() {
    const form = {} as any;
    this.personalInfoFields.forEach(obj => {
      if (obj['key'] === 'email') {
        form[obj['key']] = ['', [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]];
      } else if (obj['key'] === 'contactNumber1') {
        form[obj['key']] = [
          '',
          [Validators.pattern('^[0-9]*$'), Validators.maxLength(10), Validators.minLength(10)],
        ];
      } else if (obj['key'] === 'sectors') {
        //form['sectors'] = [[], [Validators.required]];
      } else {
        form[obj['key']] = ['', [Validators.required]];
      }
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

    const emailCtrl = this.basicInfoForm.get('email');
    const contactNumber1Ctrl = this.basicInfoForm.get('contactNumber1');
    if (emailCtrl && contactNumber1Ctrl) {
      combineLatest([
        emailCtrl.valueChanges.pipe(startWith('')),
        contactNumber1Ctrl.valueChanges.pipe(startWith('')),
      ])
        .pipe(
          map(([email, contactNumber1]) => {
            return !email && !contactNumber1;
          })
        )
        .subscribe(bothEmpty => {
          this.isEmailOrContactEmpty = bothEmpty;
          this.cd.markForCheck();
        });
    }
  }

  private initDemographics(demographicsValue: PreAssessmentDetailsDemographics) {
    if (this.basicInfoForm) {
      this.basicInfoForm.patchValue({
        ...demographicsValue,
        dateOfBirth: StringToDate(demographicsValue.dateOfBirth),
      });
      this.basicInfoForm.disable();
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
    ];
  }

  private sectorsApiCall() {
    return this.sharedApiService.lookup('SECTORS', false).pipe(tap(res => (this.sectors = res)));
  }
  private engBranchApiCall() {
    return this.sharedApiService
      .lookup('ENGINEERING_BRANCH', false)
      .pipe(tap(res => (this.engBranches = res)));
  }
  private mbaBranchApiCall() {
    return this.sharedApiService
      .lookup('MBA_BRANCH', false)
      .pipe(tap(res => (this.mbaBranches = res)));
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

  get sectorsCtrl() {
    return this.basicInfoForm.get('sectors') as FormControl;
  }
}

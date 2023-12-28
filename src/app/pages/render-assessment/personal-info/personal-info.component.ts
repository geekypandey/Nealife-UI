import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { DropdownOption } from 'src/app/models/common.model';
import { SharedApiService } from 'src/app/services/shared-api.service';
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
  ],
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalInfoComponent {
  standardOptions: DropdownOption[] = [];
  streamOptions: DropdownOption[] = [];
  boardOptions: DropdownOption[] = [];
  locationOptions: DropdownOption[] = [];

  personalInfoFields: Demographic[] = [];

  @Input()
  set fields(fields: Demographic[]) {
    this.personalInfoFields = fields;
  }

  private sharedApiService = inject(SharedApiService);
  private spinner = inject(NgxSpinnerService);

  isDropdownField(fieldObj: Demographic): boolean {
    return this.dropDownFieldsKeys.includes(fieldObj.key);
  }

  ngOnInit() {
    // const lookup$ = this.lookupArr.map(type => this.sharedApiService.lookup(type));
    // this.spinner.show('personal-info');
    // forkJoin(lookup$).subscribe({
    //   next: resp => {
    //     console.info(resp);
    //     this.spinner.hide('personal-info');
    //   },
    //   error: _ => this.spinner.hide('personal-info'),
    // });
  }

  // optionsArray(fieldName: string): any {
  //   if (fieldName === 'age') {
  //     return this.age;
  //   } else if (fieldName === 'education') {
  //     return this.education;
  //   } else if (fieldName === 'standard') {
  //     return this.standard;
  //   } else if (fieldName === 'stream') {
  //     return this.stream;
  //   } else if (fieldName === 'board') {
  //     return this.board;
  //   } else if (fieldName === 'experience') {
  //     return this.experience;
  //   } else if (fieldName === 'race') {
  //     return this.race;
  //   } else if (fieldName === 'occupation') {
  //     return this.occupation;
  //   } else if (fieldName === 'careers') {
  //     return this.career;
  //   } else if (fieldName === 'designation') {
  //     return this.designation;
  //   } else if (fieldName === 'country') {
  //     return this.country;
  //   } else if (fieldName === 'location') {
  //     return this.location;
  //   } else if (fieldName === 'income') {
  //     return this.income;
  //   } else if (fieldName === 'gender') {
  //     return this.gender;
  //   } else return [];
  // }

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
      'gender',
      'standard',
      'stream',
      'board',
      'dateOfBirth',
    ];
  }

  get lookupArr() {
    return [
      'USER_TYPE',
      'GENDER',
      'AGE',
      'EDUCATION',
      'EXPERIENCE',
      'RACE',
      'OCCUPATION',
      'CAREERS',
      'DESIGNATION',
      'COUNTRY',
      'LOCATION',
      'FAMILY_INCOME',
      'STANDARD',
      'STREAM',
      'BOARD',
    ];
  }
}

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { StepsModule } from 'primeng/steps';
import { Observable, Subscription, forkJoin, map } from 'rxjs';
import { ShowErrorMsgDirective } from 'src/app/directives/show-error-msg.directive';
import { DropdownOption } from 'src/app/models/common.model';
import { SharedApiService } from 'src/app/services/shared-api.service';
import { markFormGroupDirty } from 'src/app/util/util';
import { Company, ICompany } from '../../../assess.model';
import { CustomAsyncValidators } from '../../../assess.validator';
import { ProfileService } from '../../../services/profile.service';
import { CompanyService } from '../../company.service';

@Component({
  selector: 'nl-company-edit-franchise',
  standalone: true,
  imports: [
    CommonModule,
    StepsModule,
    ReactiveFormsModule,
    DropdownModule,
    FileUploadModule,
    ShowErrorMsgDirective,
  ],
  templateUrl: './company-edit-franchise.component.html',
  styleUrls: ['./company-edit-franchise.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyEditFranchiseComponent {
  @Input()
  id!: string;

  @Input()
  loggedInCompanyId!: string;

  private companyService = inject(CompanyService);
  private sharedApiService = inject(SharedApiService);
  private profileService = inject(ProfileService);
  private spinner = inject(NgxSpinnerService);
  private fb = inject(FormBuilder);
  private cdRef = inject(ChangeDetectorRef);
  private translateService = inject(TranslateService);
  private customAsyncValidator = inject(CustomAsyncValidators);

  items: MenuItem[] = [];
  activeIndex: number = 0;
  company!: Company;
  spinnerName = 'edit-franchise';
  editForm!: FormGroup;
  accountTypes: DropdownOption[] = [];
  partnerTypes: DropdownOption[] = [];
  statusList: DropdownOption[] = [];
  branding$!: Observable<DropdownOption[]>;
  imagesUrl: any;
  invalidEmail: boolean = false;
  checkNameExistSubscription!: Subscription;
  invalidName: boolean = false;

  constructor() {
    this.items = [
      {
        label: 'Step 1',
      },
      {
        label: 'Step 2',
      },
    ];
    const statusBaseStr = 'nealifeApp.ActivityStatus.';
    const statusValues = ['ACTIVE', 'INACTIVE'];
    this.statusList = statusValues.map(value => ({
      label: this.translateService.instant(statusBaseStr + value),
      value: value,
    }));
  }

  ngOnInit() {
    const initApiCalls: Observable<any>[] = [
      this.sharedApiService.lookup('COMPANY_TYPE'),
      this.sharedApiService.lookup('PARTNER_TYPE'),
    ];

    if (this.id) {
      initApiCalls.push(this.companyService.getCompany(Number(this.id)));
    } else {
      this.editForm = this.getEditForm(<Company>{});
      this.profileService.getProfile().subscribe(profile => {
        this.editForm.get('parentId')?.setValue(profile.companyId); // set default value
      });
    }

    this.spinner.show(this.spinnerName);
    forkJoin(initApiCalls)
      .pipe(
        map(([accountTypes, partnerTypes, company]) => {
          return {
            accountTypes: accountTypes,
            partnerTypes: partnerTypes,
            company,
          };
        })
      )
      .subscribe({
        next: resp => {
          this.accountTypes = resp.accountTypes;
          this.partnerTypes = resp.partnerTypes;

          if (resp && resp.company) {
            this.company = resp.company;
            this.editForm = this.getEditForm(this.company);
          }
          this.spinner.hide(this.spinnerName);
          this.cdRef.markForCheck();
        },
        complete: () => this.spinner.hide(this.spinnerName),
      });
  }

  getEditForm(company: ICompany) {
    return this.fb.group({
      id: [company.id],
      name: [company.name, [Validators.required, Validators.maxLength(75)]],
      contactPerson: [company.contactPerson, [Validators.required, Validators.maxLength(75)]],
      email: [
        company.email,
        [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
      ],
      address: [company.address, [Validators.required, Validators.maxLength(300)]],
      contactNumber1: [
        company.contactNumber1,
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      status: [company.status, Validators.required],
      companyType: [company.companyType, Validators.required],
      partnerType: [company.partnerType, Validators.required],

      // branding: [company.brandingId, Validators.required],
      parentId: [company.parentId],

      // contactNumber2: [
      //   company.contactNumber2,
      //   [Validators.maxLength(10), Validators.minLength(10), Validators.pattern('^[0-9]*$')],
      // ],

      // gstNumber: [company.gstNumber],
      // validFrom: [company.validFrom, [Validators.required]],
      // validTo: [company.validTo, [Validators.required]],
    });
  }

  save() {
    if (this.editForm.valid) {
      const form = this.createFromForm();
      const companyId = this.editForm.get('id')?.value;
      const uploadData = new FormData();

      uploadData.append('data', JSON.stringify(form));
      if (this.imagesUrl === undefined || this.imagesUrl === 'undefined') {
        uploadData.append('file', '');
      } else {
        uploadData.append('file', this.imagesUrl);
      }

      // console.info(uploadData.getAll('data'), uploadData.getAll('file'));
      this.spinner.show(this.spinnerName);
      if (!!companyId) {
        this.subscribeToSaveResponse(this.companyService.updateCompany(uploadData));
      } else {
        this.subscribeToSaveResponse(this.companyService.createCompany(uploadData));
      }
    } else {
      markFormGroupDirty(this.editForm);
      this.editForm.updateValueAndValidity();
    }
  }

  save2() {
    // utilise createFromForm()
    // call PUT api
    const form = this.createFromForm();
    const uploadData = new FormData();

    uploadData.append('data', JSON.stringify(form));
    if (this.imagesUrl === undefined || this.imagesUrl === 'undefined') {
      uploadData.append('file', '');
    } else {
      uploadData.append('file', this.imagesUrl);
    }
    this.spinner.show(this.spinnerName);
    this.companyService.updateCompany(uploadData).subscribe({
      next: resp => {
        this.goBack();
      },
      error: err => console.error('update failed step2'),
      complete: () => this.spinner.hide(this.spinnerName),
    });
  }

  private createFromForm(): ICompany {
    return {
      ...new Company(),
      id: this.editForm.get(['id'])?.value || undefined,
      name: this.editForm.get(['name'])?.value,
      contactPerson: this.editForm.get(['contactPerson'])?.value || '',
      email: this.editForm.get(['email'])?.value,
      address: this.editForm.get(['address'])?.value,
      contactNumber1: this.editForm.get(['contactNumber1'])?.value,
      status: this.editForm.get(['status'])?.value,
      companyType: this.editForm.get('companyType')?.value,
      partnerType: this.editForm.get('partnerType')?.value,

      brandingId: this.editForm.get(['brandingId'])?.value,
      parentId: this.editForm.get(['parentId'])?.value, // logged in user companyId

      // contactNumber2: this.editForm.get(['contactNumber2'])!.value,

      // gstNumber: this.editForm.get(['gstNumber'])!.value,
      // validFrom: this.editForm.get(['validFrom'])!.value,
      // validTo: this.editForm.get(['validTo'])!.value,
    };
  }

  private subscribeToSaveResponse(result: Observable<Company>): void {
    result.subscribe({
      next: resp => this.onStep1SaveSuccess(resp),
      error: () => this.onSaveError(),
    });
  }

  protected onStep1SaveSuccess(resp: Company): void {
    this.spinner.hide(this.spinnerName);
    this.editForm.get('id')?.setValue(resp.id);
    this.editForm.addControl('brandingId', new FormControl(null, Validators.required));
    this.activeIndex = 1;
    const { id, name } = this.editForm.value;
    this.branding$ = this.profileService.getProfile().pipe(
      map(profile => {
        return [
          { label: 'Nealife', value: '1' },
          { label: profile.companyName, value: profile.companyId },
          { label: name, value: id },
        ];
      })
    );
    this.cdRef.markForCheck();
  }

  protected onSaveError(): void {
    this.spinner.hide(this.spinnerName);
    console.error('error while save');
  }

  goBack() {
    window.history.back();
  }

  goBackStep1() {
    this.activeIndex = 0;
    this.editForm.removeControl('brandingId');
  }

  onUpload(event: any) {
    this.imagesUrl = event.currentFiles[0];
  }

  checkNameExist(evt: Event) {
    const ctrlValue = this.editForm.get('name')?.value;
    if (!ctrlValue) {
      this.invalidName = false;
      return;
    }
    if (this.checkNameExistSubscription) {
      this.checkNameExistSubscription.unsubscribe();
    }
    this.checkNameExistSubscription = this.customAsyncValidator
      .checkNameExists(ctrlValue)
      .subscribe({
        next: resp => {
          if (resp) {
            this.invalidName = true;
          } else {
            this.invalidName = false;
          }
          this.cdRef.markForCheck();
        },
        error: err => {
          this.invalidName = true;
          this.cdRef.markForCheck();
        },
      });
  }

  checkEmailExist(evt: Event) {
    const ctrlValue = this.editForm.get('email')?.value;
    if (!ctrlValue) {
      this.invalidEmail = false;
      return;
    }
    if (this.checkNameExistSubscription) {
      this.checkNameExistSubscription.unsubscribe();
    }
    this.checkNameExistSubscription = this.customAsyncValidator
      .checkEmailExists(ctrlValue)
      .subscribe({
        next: resp => {
          if (resp) {
            this.invalidEmail = true;
          } else {
            this.invalidEmail = false;
          }
          this.cdRef.markForCheck();
        },
        error: err => {
          this.invalidEmail = true;
          this.cdRef.markForCheck();
        },
      });
  }
}

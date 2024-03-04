import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { Observable, Subscription, forkJoin, map, switchMap } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { ShowErrorMsgDirective } from 'src/app/directives/show-error-msg.directive';
import { DropdownOption } from 'src/app/models/common.model';
import { SharedApiService } from 'src/app/services/shared-api.service';
import { markFormGroupDirty } from 'src/app/util/util';
import { Company, ICompany } from '../../../assess.model';
import { CustomAsyncValidators } from '../../../assess.validator';
import { ProfileService } from '../../../services/profile.service';
import { CompanyService } from '../../company.service';

@Component({
  selector: 'nl-company-edit-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    SpinnerComponent,
    DropdownModule,
    CalendarModule,
    FileUploadModule,
    ReactiveFormsModule,
    TranslateModule,
    ShowErrorMsgDirective,
  ],
  templateUrl: './company-edit-admin.component.html',
  styleUrls: ['./company-edit-admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyEditAdminComponent {
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
  invalidName: boolean = false;
  checkNameExistSubscription!: Subscription;
  invalidEmail: boolean = false;
  parentCompanies$: Observable<Company[]>;
  statusList: DropdownOption[] = [];
  company!: Company;
  editForm!: FormGroup;
  accountTypes: DropdownOption[] = [];
  partnerTypes: DropdownOption[] = [];
  spinnerName = 'register-edit';
  imagesUrl: any;

  constructor() {
    const statusBaseStr = 'nealifeApp.ActivityStatus.';
    const statusValues = ['ACTIVE', 'INACTIVE'];
    this.statusList = statusValues.map(value => ({
      label: this.translateService.instant(statusBaseStr + value),
      value: value,
    }));
    this.parentCompanies$ = this.profileService.getProfile().pipe(
      switchMap(profile => {
        return this.companyService.getCompanies(profile.companyId);
      }),
      map(companies => {
        return companies.map(company => ({
          label: company.name,
          value: '' + company.id,
        }));
      })
    );
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

  onUpload(event: any) {
    this.imagesUrl = event.currentFiles[0];
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

  private createFromForm(): ICompany {
    return {
      ...new Company(),
      id: this.editForm.get(['id'])?.value || undefined,
      companyType: this.editForm.get('companyType')?.value,
      name: this.editForm.get(['name'])?.value,
      email: this.editForm.get(['email'])?.value,
      address: this.editForm.get(['address'])?.value,
      website: this.editForm.get(['website'])?.value,
      contactNumber1: this.editForm.get(['contactNumber1'])?.value,
      status: this.editForm.get(['status'])?.value,
      partnerType: this.editForm.get('partnerType')!.value,
      parentId: this.editForm.get(['parentId'])?.value,

      contactPerson: this.editForm.get(['contactPerson'])?.value || '', // backend need this field
      // contactNumber2: this.editForm.get(['contactNumber2'])!.value,
      // brandingId: this.editForm.get(['brandingId'])?.value,

      gstNumber: this.editForm.get(['gstNumber'])!.value,
      // validFrom: this.editForm.get(['validFrom'])!.value,
      // validTo: this.editForm.get(['validTo'])!.value,
    };
  }

  private subscribeToSaveResponse(result: Observable<Company>): void {
    result.subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.spinner.hide(this.spinnerName);
    this.goBack();
  }

  protected onSaveError(): void {
    this.spinner.hide(this.spinnerName);
    console.error('error while save');
  }

  goBack() {
    window.history.back();
  }

  getEditForm(company: ICompany) {
    return this.fb.group({
      id: [company.id],
      companyType: [company.companyType, Validators.required],
      name: [
        company.name,
        {
          valiators: [Validators.required, Validators.maxLength(75)],
          updateOn: 'blur',
        },
      ],
      email: [
        company.email,
        {
          validators: [
            Validators.required,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          ],
          updateOn: 'blur',
        },
      ],
      address: [company.address, [Validators.required, Validators.maxLength(300)]],
      website: [company.website],
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
      partnerType: [company.partnerType, Validators.required],
      parentId: [company.parentId ? `${company.parentId}` : null],
      contactPerson: [company.contactPerson, [Validators.required, Validators.maxLength(75)]],
      // contactNumber2: [
      //   company.contactNumber2,
      //   [Validators.maxLength(10), Validators.minLength(10), Validators.pattern('^[0-9]*$')],
      // ],

      // branding: [company.brandingId, Validators.required],

      gstNumber: [company.gstNumber, Validators.required],
      // validFrom: [company.validFrom, [Validators.required]],
      // validTo: [company.validTo, [Validators.required]],
    });
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

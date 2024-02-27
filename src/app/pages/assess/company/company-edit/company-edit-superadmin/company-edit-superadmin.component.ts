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
import { Observable, Subscription, forkJoin, map } from 'rxjs';
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
  selector: 'nl-company-edit-superadmin',
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
  templateUrl: './company-edit-superadmin.component.html',
  styleUrls: ['./company-edit-superadmin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyEditSuperadminComponent {
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

  parentCompanies: any[] = [];
  statusList: DropdownOption[] = [];
  company!: Company;
  editForm!: FormGroup;
  accountTypes: DropdownOption[] = [];
  partnerTypes: DropdownOption[] = [];
  spinnerName = 'register-edit';
  imagesUrl: any;
  invalidName: boolean = false;
  checkNameExistSubscription!: Subscription;
  invalidEmail: boolean = false;

  constructor() {
    const statusBaseStr = 'nealifeApp.ActivityStatus.';
    const statusValues = ['ACTIVE', 'INACTIVE'];
    this.statusList = statusValues.map(value => ({
      label: this.translateService.instant(statusBaseStr + value),
      value: value,
    }));
    this.parentCompanies = this.companyService.companies.map(company => ({
      label: company.name,
      value: '' + company.id,
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
      // this.editForm.get('parentId')?.setValue(this.loggedInCompanyId); // set default value
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
    console.log(this.editForm.value);
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
      name: this.editForm.get(['name'])?.value,
      email: this.editForm.get(['email'])?.value,
      contactNumber1: this.editForm.get(['contactNumber1'])?.value,
      status: this.editForm.get(['status'])?.value,
      contactPerson: this.editForm.get(['contactPerson'])?.value || '',
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

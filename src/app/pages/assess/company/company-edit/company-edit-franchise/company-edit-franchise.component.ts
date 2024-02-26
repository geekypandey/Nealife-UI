import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { StepsModule } from 'primeng/steps';
import { Observable, forkJoin, map } from 'rxjs';
import { DropdownOption } from 'src/app/models/common.model';
import { SharedApiService } from 'src/app/services/shared-api.service';
import { markFormGroupDirty } from 'src/app/util/util';
import { Company, ICompany } from '../../../assess.model';
import { ProfileService } from '../../../services/profile.service';
import { CompanyService } from '../../company.service';

@Component({
  selector: 'nl-company-edit-franchise',
  standalone: true,
  imports: [CommonModule, StepsModule, ReactiveFormsModule, DropdownModule, FileUploadModule],
  templateUrl: './company-edit-franchise.component.html',
  styleUrls: ['./company-edit-franchise.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyEditFranchiseComponent {
  @Input()
  set id(id: string) {
    if (id) {
      this.companyService.getCompanies(id).subscribe({
        next: resp => {
          if (resp && resp.length) {
            this.company = resp[0];
            this.editForm = this.getEditForm(this.company);
            this.spinner.hide(this.spinnerName);
            this.cdRef.markForCheck();
          }
        },
        complete: () => this.spinner.hide(this.spinnerName),
      });
    } else {
      this.editForm = this.getEditForm(<Company>{});
    }
  }

  private companyService = inject(CompanyService);
  private sharedApiService = inject(SharedApiService);
  private profileService = inject(ProfileService);
  private spinner = inject(NgxSpinnerService);
  private fb = inject(FormBuilder);
  private cdRef = inject(ChangeDetectorRef);
  private translateService = inject(TranslateService);

  items: MenuItem[] = [];
  activeIndex: number = 1;
  company!: Company;
  spinnerName = 'edit-franchise';
  editForm!: FormGroup;
  accountTypes: DropdownOption[] = [];
  partnerTypes: DropdownOption[] = [];
  statusList: DropdownOption[] = [];
  branding: DropdownOption[] = [];
  imagesUrl: any;

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
    this.spinner.show(this.spinnerName);
    forkJoin([
      this.sharedApiService.lookup('COMPANY_TYPE'),
      this.sharedApiService.lookup('PARTNER_TYPE'),
    ])
      .pipe(
        map<[DropdownOption[], DropdownOption[]], { accountTypes: any[]; partnerTypes: any[] }>(
          ([accountTypes, partnerTypes]) => {
            return {
              accountTypes: accountTypes,
              partnerTypes: partnerTypes,
            };
          }
        )
      )
      .subscribe({
        next: resp => {
          this.accountTypes = resp.accountTypes;
          this.partnerTypes = resp.partnerTypes;
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

      branding: [company.brandingId, Validators.required],
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

  save2() {}

  private createFromForm(): ICompany {
    return {
      ...new Company(),
      id: this.editForm.get(['id'])?.value || undefined,
      name: this.editForm.get(['name'])?.value,
      contactPerson: this.editForm.get(['contactPerson'])?.value || '',
      email: this.editForm.get(['email'])?.value,
      address: this.editForm.get(['address'])?.value,
      contactNumber1: this.editForm.get(['contactNumber1'])?.value,
      status: this.editForm.get(['statsus'])?.value,
      companyType: this.editForm.get('companyType')?.value,
      partnerType: this.editForm.get('partnerType')?.value,

      brandingId: this.editForm.get(['brandingId'])?.value,
      parentId: this.editForm.get(['parentId'])?.value,

      // contactNumber2: this.editForm.get(['contactNumber2'])!.value,

      // gstNumber: this.editForm.get(['gstNumber'])!.value,
      // validFrom: this.editForm.get(['validFrom'])!.value,
      // validTo: this.editForm.get(['validTo'])!.value,
    };
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<Company>>): void {
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

  onUpload(event: any) {
    this.imagesUrl = event.currentFiles[0];
  }
}

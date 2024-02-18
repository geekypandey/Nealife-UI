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
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { Observable, forkJoin, map } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { DropdownOption } from 'src/app/models/common.model';
import { SharedApiService } from 'src/app/services/shared-api.service';
import { CompanyService } from '../company.service';
import { Company, ICompany } from './../../assess.model';

@Component({
  selector: 'nl-company-edit',
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
  ],
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyEditComponent {
  spinnerName = 'register-edit';
  imagesUrl: any;
  @Input()
  set id(id: string) {
    if (id) {
      this.spinner.show(this.spinnerName);
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

  parentCompanies: any[] = [];
  statusList: DropdownOption[] = [];
  company!: Company;
  editForm!: FormGroup;
  accountTypes: DropdownOption[] = [];
  partnerTypes: DropdownOption[] = [];

  private companyService = inject(CompanyService);
  private sharedApiService = inject(SharedApiService);
  private spinner = inject(NgxSpinnerService);
  private fb = inject(FormBuilder);
  private cdRef = inject(ChangeDetectorRef);
  private translateService = inject(TranslateService);

  constructor() {
    const statusBaseStr = 'nealifeApp.ActivityStatus.';
    const statusValues = ['ACTIVE', 'INACTIVE', 'TERMINATED', 'EXPIRED'];
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

  onUpload(event: any) {
    this.imagesUrl = event.currentFiles[0];
  }

  save() {
    console.log(this.editForm.value);
    if (this.editForm.valid) {
      const form = this.editForm.value;
      const uploadData = new FormData();
      const companyId = this.editForm.get('id')?.value;

      const company = this.createFromForm();
      uploadData.append('data', JSON.stringify(form));
      if (this.imagesUrl === undefined || this.imagesUrl === 'undefined') {
        uploadData.append('file', '');
      } else {
        uploadData.append('file', this.imagesUrl);
      }

      console.info(uploadData.getAll('data'), uploadData.getAll('file'));
      this.spinner.show(this.spinnerName);
      if (company.id !== undefined) {
        this.subscribeToSaveResponse(this.companyService.updateCompany(uploadData));
      } else {
        this.subscribeToSaveResponse(this.companyService.createCompany(uploadData));
      }
    }
  }

  private createFromForm(): ICompany {
    return {
      ...new Company(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      contactPerson: this.editForm.get(['contactPerson'])!.value,
      email: this.editForm.get(['email'])!.value,
      address: this.editForm.get(['address'])!.value,
      contactNumber1: this.editForm.get(['contactNumber1'])!.value,
      contactNumber2: this.editForm.get(['contactNumber2'])!.value,
      status: this.editForm.get(['status'])!.value,
      validFrom: this.editForm.get(['validFrom'])!.value,
      validTo: this.editForm.get(['validTo'])!.value,
      companyType: this.editForm.get('companyType')!.value,
      partnerType: this.editForm.get('partnerType')!.value,
      website: this.editForm.get(['website'])!.value,
      parentId: this.editForm.get(['parentId'])!.value,
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
      contactNumber2: [
        company.contactNumber2,
        [Validators.maxLength(10), Validators.minLength(10), Validators.pattern('^[0-9]*$')],
      ],
      status: [company.status, Validators.required],
      validFrom: [company.validFrom, [Validators.required]],
      validTo: [company.validTo, [Validators.required]],
      companyType: [company.companyType, Validators.required],
      partnerType: [company.partnerType, Validators.required],
      website: [company.website],
      parentId: [company.parentId],
    });
  }
}

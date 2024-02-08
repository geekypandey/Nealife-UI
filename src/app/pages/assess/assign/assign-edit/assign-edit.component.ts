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
import { CompanyService } from '../../company/company.service';
import { AssignService } from '../assign.service';
import { Assessment } from './../../assess.model';

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
  templateUrl: './assign-edit.component.html',
  styleUrls: ['./assign-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignEditComponent {
  imagesUrl: any;
  @Input()
  set id(id: number) {
    this.spinner.show('register-edit');
    if (id) {
      console.log(id);
      this.editForm = this.getEditForm(<Assessment>{});
      this.assignService.getAssessments().subscribe(({
        next: resp => {
          if (resp && resp.length > 0) {
            const assessment = resp.filter(assessment => assessment.id == id);
            if (assessment.length > 0) {
              this.editForm = this.getEditForm(assessment[0]);
              this.assessment = assessment[0];
              this.cdRef.markForCheck();
              this.isEdit = true;
            }
          }
        },
        complete: () => this.spinner.hide('register-edit'),
      }))
    } else {
      this.editForm = this.getEditForm(<Assessment>{});
    }
  }

  assessment: Assessment;
  parentCompanies: DropdownOption[] = [];
  assessments: DropdownOption[] = [];
  statusList: DropdownOption[] = [];
  isEdit: boolean = false;
  editForm!: FormGroup;
  accountTypes: DropdownOption[] = [];
  partnerTypes: DropdownOption[] = [];

  private companyService = inject(CompanyService);
  private sharedApiService = inject(SharedApiService);
  private spinner = inject(NgxSpinnerService);
  private fb = inject(FormBuilder);
  private cdRef = inject(ChangeDetectorRef);
  private translateService = inject(TranslateService);
  private assignService = inject(AssignService);

  constructor() {
    const statusBaseStr = 'nealifeApp.ActivityStatus.';
    const statusValues = ['ACTIVE', 'INACTIVE', 'TERMINATED', 'EXPIRED'];
    this.statusList = statusValues.map(value => ({
      label: this.translateService.instant(statusBaseStr + value),
      value: value,
    }));

    this.assignService.getAssessmentsForDropDown().subscribe((value) => {
      this.assessments = value.map(assessment => ({
        label: assessment.assessmentName,
        value: '' + assessment.assessmentId
      }))
    });

    this.companyService.getAllCompanies().subscribe((value) => {
      this.parentCompanies = value.map(company => ({
        label: company.name,
        value: '' + company.id,
      }))
    })
    this.assessment = <Assessment>{};
  }

  ngOnInit() {
    this.spinner.show('register-edit');
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
          this.cdRef.markForCheck();
        },
        complete: () => this.spinner.hide('register-edit'),
      });
  }

  onUpload(event: any) {
    this.imagesUrl = event.currentFiles[0];
  }

  save() {
    if (this.isEdit && this.editForm.valid) {
      const data = this.editForm.value;
      const updatedData = { ...this.assessment, ...data };
      // TODO: send this data for put request
      this.subscribeToSaveResponse(this.assignService.updateAssessment(updatedData));

    } else {
      // TODO: show error
    }
  }

  add() {
    console.log(this.extractDate(this.editForm.value.scheduleDate));
    if (!this.isEdit && this.editForm.valid) {
      const assessment = this.editForm.value;
      const appendedData = {
        id: null,
        reportTemplate: null,
        emailTemplate: null,
        url: null,
        parentCompanyId: "1",
        scheduleDate: this.extractDate(assessment.scheduleDate)
      }
      const newData = { ...assessment, ...appendedData };
      console.log(newData);
      // TODO: send this data for put request
      this.subscribeToSaveResponse(this.assignService.addAssessment(newData));
    } else {
      // TODO: show error
    }
  }

  extractDate(date: Date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // add 1 because months are indexed from 0
    const year = date.getFullYear();
    
    return `${year}-${month}-${day}`
  }

  private subscribeToSaveResponse(result: Observable<HttpResponse<Assessment>>): void {
    result.subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.goBack();
  }

  protected onSaveError(): void {
    console.error('error while save');
  }

  goBack() {
    window.history.back();
  }

  getEditForm(assessment: Assessment) {
    return this.fb.group({
      companyId: [assessment.companyId],
      assessmentId: [assessment.assessmentId, [Validators.required, Validators.maxLength(75)]],
      scheduleDate: [assessment.scheduleDate, [Validators.required]],
      timeLimit: [assessment.timeLimit, [Validators.required]],
      totalCredits: [assessment.totalCredits, [Validators.required]],
      availableCredits: [assessment.availableCredits, [Validators.required]],
      usedCredits: [assessment.usedCredits, [Validators.required]],
      allocatedCredits: [assessment.allocatedCredits, [Validators.required]],
    });
  }
}
  // "id": null,
  // "companyId": 1,
  // "assessmentId": 245352,
  // "scheduleDate": "2024-02-09",
  // "reportTemplate": null,
  // "emailTemplate": null,
  // "timeLimit": "150",
  // "availableCredits": "120",
  // "usedCredits": "120",
  // "allocatedCredits": "120",
  // "totalCredits": 120,
  // "url": null,
  // "parentCompanyId": "1"

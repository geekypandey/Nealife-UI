import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { API_URL } from 'src/app/constants/api-url.constants';
import { Authority } from 'src/app/constants/authority.constants';
import { DropdownOption } from 'src/app/models/common.model';
import { saveFile } from '../../../assess.util';
import { AssessmentGroup } from '../../../assessment-group/assessment-group.model';
import { CompanyService } from '../../../company/company.service';
import { ProfileService } from '../../../services/profile.service';
import { AssessmentService } from '../../assessment.service';
import { CompanyAssessmentGroupUploadComponent } from './company-assessment-group-upload/company-assessment-group-upload.component';

@Component({
  selector: 'nl-company-assessment-group-edit',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, ReactiveFormsModule, DropdownModule, CalendarModule],
  templateUrl: './company-assessment-group-update.component.html',
  styleUrls: ['./company-assessment-group-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class CompanyAssessmentGroupUpdateComponent implements OnInit {
  spinnerName: string = 'company-assessment-edit';
  // TODO: fix this
  companyAssessment: AssessmentGroup | any;
  editForm: FormGroup;
  individualEditForm: FormGroup;
  bulkEditForm: FormGroup;
  companies: DropdownOption[] = [];
  branches: DropdownOption[] = [];
  assessments: DropdownOption[] = [];
  loggedInUser: any;
  visible: boolean = false;
  ref: DynamicDialogRef | undefined;

  private activatedRoute = inject(ActivatedRoute);
  private assessmentService = inject(AssessmentService);
  private profileService = inject(ProfileService);
  private spinner = inject(NgxSpinnerService);
  private fb = inject(FormBuilder);
  private companyService = inject(CompanyService);
  private http = inject(HttpClient);
  private dialogService = inject(DialogService);

  private generateLinkPayload: any = {};
  private toastService = inject(MessageService);

  constructor() {
    this.editForm = this.fb.group({
      id: [],
      companyId: [null, Validators.required],
      assessmentGroupId: [null, Validators.required],
      scheduleDate: [],
      reportTemplate: [],
      emailTemplate: [],
      timeLimit: [],
      availableCredits: [],
      usedCredits: [],
      allocatedCredits: [],
      url: [],
      totalCredits: [0, [Validators.required, Validators.maxLength(75)]],
      validFrom: [],
      validTo: [],
      isBranch: [],
      branchId: [],
    });

    this.individualEditForm = this.fb.group({
      generateUrl: [],
      creditCode: [],
      email: [],
      emailReport: [],
      embedCreditCode: [],
      contactNumber: [],
    });

    this.bulkEditForm = this.fb.group({
      generateUrl: [],
      creditCode: [],
      email: [],
      emailReport: [],
      embedCreditCode: [],
      credits: [null, Validators.required],
    });

    const assessmentGroupId = this.activatedRoute.snapshot.params['id'];
    if (assessmentGroupId) {
      this.assessmentService.getCompanyAssessment(assessmentGroupId).subscribe(value => {
        this.companyAssessment = value;
        this.patchEditForm();
        this.disableFieldsInEditForm(['usedCredits', 'availableCredits', 'allocatedCredits']);
      });
    }
  }

  ngOnInit() {
    this.profileService.getProfile().subscribe(value => {
      this.loggedInUser = value;
      if (this.loggedInUser.role === Authority.ACCOUNT_ADMIN && this.companyAssessment.id) {
        this.editForm.disable();
      }
      this.loadData();
    });
  }

  loadData() {
    const companyId = this.loggedInUser.companyId;
    const company$ =
      companyId !== '1'
        ? this.companyService.getCompanyById(companyId)
        : this.companyService.getAllCompanies();
    company$.subscribe(data => {
      this.companies = data.map((company: any) => {
        return { label: company.name, value: company.id };
      });
    });
    this.assessmentService.getCompanyAssessmentsForDropDown(companyId || '').subscribe(data => {
      this.assessments = data.map((assessment: any) => {
        return { label: assessment.assessmentGroupName, value: assessment.assessmentGroupId };
      });
    });
    // TODO: fix this call made twice
    const assessmentGroupId = this.activatedRoute.snapshot.params['id'];
    if (assessmentGroupId) {
      this.assessmentService.getCompanyAssessment(assessmentGroupId).subscribe(value => {
        this.companyAssessment = value;
        this.patchEditForm();
      });

      this.assessmentService.getCompanyAssessmentGroupsBranchMapping(companyId, assessmentGroupId).subscribe((data) => {
        this.branches = data.map((branch: any) => {
          return { label: branch.name, value: branch.id };
        });
      })
    }
  }

  patchEditForm() {
    this.editForm.patchValue({
      id: this.companyAssessment.id,
      companyId: this.companyAssessment.companyId,
      assessmentGroupId: this.companyAssessment.assessmentGroupId,
      scheduleDate: this.companyAssessment.scheduleDate,
      url: this.companyAssessment.url,
      timeLimit: this.companyAssessment.timeLimit,
      availableCredits: this.companyAssessment.availableCredits,
      usedCredits: this.companyAssessment.usedCredits,
      allocatedCredits: this.companyAssessment.allocatedCredits,
      totalCredits: this.companyAssessment.totalCredits,
      validFrom: this.companyAssessment.validFrom,
      validTo: this.companyAssessment.validTo,
      isBranch: this.companyAssessment.isBranch,
      branchId: this.companyAssessment.branchId,
    });

    if (this.editForm.value['usedCredits'] == null) {
      this.editForm.controls['usedCredits'].setValue(0);
    }
  }

  disableFieldsInEditForm(fields: Array<string>) {
    for (const field of fields) {
      this.editForm.controls[field].disable();
    }
  }

  downloadCredits() {
    const id = this.companyAssessment.id;

    this.http
      .get(`${API_URL.downloadCredits}?companyAssessmentGroupsId.equals=${id}`, {
        responseType: 'blob',
      })
      .subscribe((value: any) => {
        const blob = new Blob([value], { type: 'application/octect-stream' });
        saveFile(blob, 'Available_Credits.xlsx');
      });
  }

  save(): void {
    if (this.editForm.valid) {
      const companyAssessment: any = {
        id: this.editForm.get(['id'])!.value,
        companyId: this.editForm.get(['companyId'])!.value,
        assessmentGroupId: this.editForm.get(['assessmentGroupId'])!.value,
        scheduleDate: this.editForm.get(['scheduleDate'])!.value,
        reportTemplate: this.editForm.get(['reportTemplate'])!.value,
        emailTemplate: this.editForm.get(['emailTemplate'])!.value,
        timeLimit: this.editForm.get(['timeLimit'])!.value,
        availableCredits: this.editForm.get(['availableCredits'])!.value,
        usedCredits: this.editForm.get(['usedCredits'])!.value,
        allocatedCredits: this.editForm.get(['allocatedCredits'])!.value,
        totalCredits: this.editForm.get(['totalCredits'])!.value,
        url: this.editForm.get(['url'])!.value,
        validFrom: this.editForm.get(['validFrom'])!.value,
        validTo: this.editForm.get(['validTo'])!.value,
      };

      companyAssessment['parentCompanyId'] = this.loggedInUser.companyId;
      if (companyAssessment.id != null) {
        this.http.put<any>(API_URL.assignGroup, companyAssessment).subscribe({
          next: () => this.goBack(),
          error: () => {},
        });
      } else {
        delete companyAssessment['id'];
        companyAssessment['scheduleDate'] = moment(companyAssessment['scheduleDate']).format(
          'YYYY-MM-DD'
        );
        companyAssessment['validFrom'] = moment(companyAssessment['validFrom']).format(
          'YYYY-MM-DD'
        );
        companyAssessment['validTo'] = moment(companyAssessment['validTo']).format(
          'YYYY-MM-DD'
        );
        this.http.post<any>(API_URL.assignGroup, companyAssessment).subscribe({
          next: () => this.goBack(),
          error: () => {},
        });
      }
      // if (compa)
      // TODO
    }
  }

  goBack() {
    window.history.back();
  }

  generateLink() {
    this.generateLinkPayload = {
      ...this.generateLinkPayload,
      companyAssessmentId: null,
      companyAssessmentGroupId: this.editForm.get('id')?.value,
      email: this.individualEditForm.get('email')?.value,

      emailReport: this.individualEditForm.get('emailReport')?.value ? 'Y' : 'N',
      embeddCreditCode: this.individualEditForm.get('embedCreditCode')?.value ? 'Y' : 'N',

      sendAssignmentEmail: 'N',
      creditCode: null,
      link: null,
      message: null,
      error: null,
    };
    this.generateLinkCall();
  }

  generateLinkCall() {
    this.http.post<any>(API_URL.assignAssessment, this.generateLinkPayload).subscribe({
      next: data => {
        this.individualEditForm.patchValue({ generateUrl: data.link, creditCode: data.creditCode });
      },
      error: () => {
        // TODO: complete this call
        // this.toastService.add({
        // })
      },
    });
  }

  generateAndEmailLink() {
    this.generateLinkPayload = {
      ...this.generateLinkPayload,
      companyAssessmentId: null,
      companyAssessmentGroupId: this.editForm.get('id')?.value,
      email: this.individualEditForm.get('email')?.value,

      emailReport: this.individualEditForm.get('emailReport')?.value ? 'Y' : 'N',
      embeddCreditCode: this.individualEditForm.get('embedCreditCode')?.value ? 'Y' : 'N',

      sendAssignmentEmail: 'Y',
      creditCode: null,
      link: null,
      message: null,
      error: null,
    };
    if (this.generateLinkPayload['email'] != null) {
      this.generateLinkCall();
    }
  }

  downloadTemplate() {
    this.http.get(API_URL.downloadNotificationTemplate, { responseType: 'blob' }).subscribe({
      next: (value: any) => {
        const blob = new Blob([value], { type: 'application/octet-stream' });
        saveFile(blob, 'download-template.xlsx');
      },
      error: () => {},
    });
  }

  uploadUserAndEmailLinks() {
    if (!this.bulkEditForm.valid) {
      // TODO: inform user of the same
      console.log('Please enter the credits');
      return;
    }
    if (
      this.bulkEditForm.controls['credits'].value < this.editForm.controls['availableCredits'].value
    ) {
      this.generateLinkPayload = {
        ...this.generateLinkPayload,
        companyAssessmentId: null,
        companyAssessmentGroupId: this.editForm.get('id')?.value,
        email: this.individualEditForm.get('email')?.value,
        emailReport: this.individualEditForm.get('emailReport')?.value ? 'Y' : 'N',
        embeddCreditCode: this.individualEditForm.get('embedCreditCode')?.value ? 'Y' : 'N',
        credits: this.bulkEditForm.get('credits')?.value,
        creditCode: null,
        sendAssignmentEmail: 'Y',
        link: null,
        message: null,
        error: null,
      };
      this.ref = this.dialogService.open(CompanyAssessmentGroupUploadComponent, {
        data: {
          payload: this.generateLinkPayload,
        },
        header: 'Excel Upload',
        width: '50%',
      });
    }
  }

  downloadBulkLinks() {
    if (!this.bulkEditForm.valid) {
      // TODO: inform user of the same
      console.log('Please enter the credits');
      return;
    }

    if (
      this.bulkEditForm.controls['credits'].value < this.editForm.controls['availableCredits'].value
    ) {
      console.log('here');
      this.generateLinkPayload = {
        ...this.generateLinkPayload,
        companyAssessmentId: null,
        companyAssessmentGroupId: this.editForm.get('id')?.value,
        email: this.individualEditForm.get('email')?.value,
        emailReport: this.individualEditForm.get('emailReport')?.value ? 'Y' : 'N',
        embeddCreditCode: this.individualEditForm.get('embedCreditCode')?.value ? 'Y' : 'N',
        credits: this.bulkEditForm.get('credits')?.value,
        creditCode: null,
        sendAssignmentEmail: 'N',
        link: null,
        message: null,
        error: null,
      };
      this.http
        .post(API_URL.downloadBulkLinks, this.generateLinkPayload, { responseType: 'blob' })
        .subscribe((data: any) => {
          const blob = new Blob([data], { type: 'application/octet-stream' });
          saveFile(blob, 'Download-Links.xlsx');
          this.loadData();
        });
    }
  }
}

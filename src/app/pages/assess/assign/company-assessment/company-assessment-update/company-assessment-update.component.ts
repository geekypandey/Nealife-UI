import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { API_URL } from 'src/app/constants/api-url.constants';
import { Authority } from 'src/app/constants/authority.constants';
import { DropdownOption } from 'src/app/models/common.model';
import { Assessment } from '../../../assess.model';
import { saveFile } from '../../../assess.util';
import { CompanyService } from '../../../company/company.service';
import { ProfileService } from '../../../services/profile.service';
import { AssessmentService } from '../../assessment.service';
import { UploadUserComponent } from './upload-user/upload-user.component';

@Component({
  selector: 'nl-company-assessment-edit',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, ReactiveFormsModule, DropdownModule, CalendarModule],
  templateUrl: './company-assessment-update.component.html',
  styleUrls: ['./company-assessment-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class CompanyAssessmentUpdateComponent implements OnInit {
  spinnerName: string = 'company-assessment-edit';
  // TODO: fix this
  assessment: Assessment | any;
  editForm: FormGroup;
  individualEditForm: FormGroup;
  bulkEditForm: FormGroup;
  companies: DropdownOption[] = [];
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

  constructor() {
    this.editForm = this.fb.group({
      id: [],
      companyId: [null, Validators.required],
      assessmentId: [null, Validators.required],
      scheduleDate: [],
      reportTemplate: [],
      emailTemplate: [],
      timeLimit: [null, [Validators.required, Validators.maxLength(75)]],
      availableCredits: [0, [Validators.required, Validators.maxLength(75)]],
      usedCredits: [0, [Validators.required, Validators.maxLength(75)]],
      allocatedCredits: [0, [Validators.required, Validators.maxLength(75)]],
      url: [],
      totalCredits: [0, [Validators.required, Validators.maxLength(75)]],
      generateUrl: [],
      creditCode: [],
      email: [],
      credits: [],
      validFrom: [],
      validTo: [],
    });

    this.individualEditForm = this.fb.group({
      generateUrl: [],
      creditCode: [],
      email: ['', [Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      emailReport: [],
      embedCreditCode: [],
      contactNumber: [],
      sendReportTo: [],
      sendSms: [],
    });

    this.bulkEditForm = this.fb.group({
      generateUrl: [],
      creditCode: [],
      email: [],
      emailReport: [],
      embedCreditCode: [],
      credits: [null, Validators.required],
    });

    this.spinner.show(this.spinnerName);
    const assessmentId = this.activatedRoute.snapshot.params['id'];
    if (assessmentId) {
      this.assessmentService.getAssessment(assessmentId).subscribe(value => {
        this.assessment = value;
        this.patchEditForm();
        this.disableFieldsInEditForm(['usedCredits', 'availableCredits', 'allocatedCredits']);
        this.spinner.hide(this.spinnerName);
      });
    }
  }

  ngOnInit() {
    this.profileService.getProfile().subscribe(value => {
      this.loggedInUser = value;
      if (this.loggedInUser.role === Authority.ACCOUNT_ADMIN && this.assessment.id) {
        this.editForm.disable();
      }
      this.loadData();
    });

    this.individualEditForm.controls['emailReport'].valueChanges.subscribe((emailReport) => {
      if (emailReport) {
        this.individualEditForm.controls['email'].addValidators([Validators.required]);
      } else {
        this.individualEditForm.controls['email'].removeValidators([Validators.required]);
      }
    })
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
    this.assessmentService.getAssessmentsForDropDown(companyId || '').subscribe(data => {
      this.assessments = data.map((assessment: any) => {
        return { label: assessment.assessmentName, value: assessment.assessmentId };
      });
    });
    // TODO: fix this call made twice
    const assessmentId = this.activatedRoute.snapshot.params['id'];
    if (assessmentId) {
      this.assessmentService.getAssessment(assessmentId).subscribe(value => {
        this.assessment = value;
        this.patchEditForm();
      });
    }
  }

  patchEditForm() {
    this.editForm.patchValue({
      id: this.assessment.id,
      companyId: this.assessment.companyId,
      assessmentId: this.assessment.assessmentId,
      scheduleDate: this.assessment.scheduleDate,
      timeLimit: this.assessment.timeLimit,
      availableCredits: this.assessment.availableCredits,
      usedCredits: this.assessment.usedCredits,
      allocatedCredits: this.assessment.allocatedCredits,
      url: this.assessment.url,
      totalCredits: this.assessment.totalCredits,
      validFrom: this.assessment.validFrom,
      validTo: this.assessment.validTo,
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
    const id = this.assessment.id;
    this.assessmentService.downloadCredits(id).subscribe((value: any) => {
      const blob = new Blob([value], { type: 'application/octect-stream' });
      saveFile(blob, 'Available_Credits.xlsx');
    });
  }

  save(): void {
    if (this.editForm.valid) {
      const companyAssessment: any = {
        id: this.editForm.get(['id'])!.value,
        companyId: this.editForm.get(['companyId'])!.value,
        assessmentId: this.editForm.get(['assessmentId'])!.value,
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
        this.http.put<any>(API_URL.companyAssessments, companyAssessment).subscribe({
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
        this.http.post<any>(API_URL.companyAssessments, companyAssessment).subscribe({
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
    const sendReportTo = this.individualEditForm.get('sendReportTo')?.value;
    const sendEmail = this.individualEditForm.get('emailReport')?.value == true;
    const sendSms = this.individualEditForm.get('sendSms')?.value == true;
    const embedCreditCode = this.individualEditForm.get('sendSms')?.value == true;
    if (sendEmail && !this.individualEditForm.get('email')?.value) {
      return;
    }
    if (sendSms && !this.individualEditForm.get('contactNumber')?.value) {
      return;
    }
    this.generateLinkPayload = {
      ...this.generateLinkPayload,
      companyAssessmentId: this.editForm.get('id')?.value,
      email: this.individualEditForm.get('email')?.value,

      emailReport: sendEmail ? 'Y' : 'N',
      embeddCreditCode: embedCreditCode ? 'Y' : 'N',

      sendAssignmentEmail: 'N',
      companyAssessmentGroupId: null,
      creditCode: null,
      link: null,
      message: null,
      error: null,
      sendReportTo: sendReportTo,
    };
    this.generateLinkCall();
  }

  generateLinkCall() {
    this.http.post<any>(API_URL.assignAssessment, this.generateLinkPayload).subscribe({
      next: data => {
        this.individualEditForm.patchValue({ generateUrl: data.link, creditCode: data.creditCode });
      },
      error: () => {},
    });
  }

  generateAndEmailLink() {
    this.generateLinkPayload = {
      ...this.generateLinkPayload,
      companyAssessmentId: this.editForm.get('id')?.value,
      email: this.individualEditForm.get('email')?.value,

      emailReport: this.individualEditForm.get('emailReport')?.value ? 'Y' : 'N',
      embeddCreditCode: this.individualEditForm.get('embedCreditCode')?.value ? 'Y' : 'N',

      sendAssignmentEmail: 'Y',
      companyAssessmentGroupId: null,
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
        companyAssessmentId: this.editForm.get('id')?.value,
        companyAssessmentGroupId: null,
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
      this.ref = this.dialogService.open(UploadUserComponent, {
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
        companyAssessmentId: this.editForm.get('id')?.value,
        companyAssessmentGroupId: null,
        email: this.individualEditForm.get('email')?.value,
        emailReport: this.bulkEditForm.get('emailReport')?.value ? 'Y' : 'N',
        embeddCreditCode: this.bulkEditForm.get('embedCreditCode')?.value ? 'Y' : 'N',
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

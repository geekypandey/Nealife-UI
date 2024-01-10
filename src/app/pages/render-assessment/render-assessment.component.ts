import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { REPORT_TYPE } from 'src/app/constants/assessment.constants';
import { DropdownOption } from 'src/app/models/common.model';
import { SharedApiService } from 'src/app/services/shared-api.service';
import { AssessmentStepperComponent } from './assessment-stepper/assessment-stepper.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import {
  AssessmentAnswer,
  Demographic,
  PreAssessmentDetailsDemographics,
  PreAssessmentDetailsResponse,
  RenderAssessmentResponse,
} from './render-assessment.model';
import { RenderAssessmentService } from './render-assessment.service';

@Component({
  selector: 'nl-render-assessment',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    SpinnerComponent,
    ReactiveFormsModule,
    PersonalInfoComponent,
    AssessmentStepperComponent,
  ],
  templateUrl: './render-assessment.component.html',
  styleUrls: ['./render-assessment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RenderAssessmentComponent implements OnInit {
  queryParamau: string = '';
  queryParamaa: string = '';
  companyId: string = '';
  isGroup: string = '';
  emailReport: string = '';
  queryParamcc: string = '';
  hideBasicInfo: string = '';
  groupSequence!: number;
  paramAssessmentId: string = '';

  renderAssessmentData: RenderAssessmentResponse | null = null;
  languagesOptions: DropdownOption[] = [];
  assessmentForm: FormGroup;
  landingPage: boolean = false;
  personalInfoPage: boolean = false;
  isValidCreditCode: boolean = false;
  personalInfofields: Demographic[] = [];
  branchesList: DropdownOption[] = [];
  assessmentPage: boolean = false;
  readonly spinnerName = 'assessment-test';
  preAssessmentDemographics?: PreAssessmentDetailsDemographics;
  preAssessmentDetailsResponse!: PreAssessmentDetailsResponse;

  private languages: string[] = [];
  private route = inject(ActivatedRoute);
  private spinner: NgxSpinnerService = inject(NgxSpinnerService);
  private assementService = inject(RenderAssessmentService);
  private sharedApiService = inject(SharedApiService);
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);
  private toastService = inject(MessageService);
  private assessmentAnswer: AssessmentAnswer;
  private companyAssessmentGroupId: number | null = null;
  private assessmentGroupId: number | null = null;
  private reportType: string | null = null;

  constructor() {
    this.assessmentAnswer = new AssessmentAnswer();
    this.landingPage = true;
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe(params => {
      this.queryParamau = params['AU'];
      this.queryParamaa = params['AA'];
      this.assessmentAnswer.companyId = params['C'];
      this.isGroup = params['G'];
      this.emailReport = params['ER'] || 'N';
      this.queryParamcc = params['CC'] || '';
      if (params['hBI']) {
        this.hideBasicInfo = params['hBI'];
      }
      this.groupSequence = Number(params['S']);
      if (params['assessmentId']) {
        this.paramAssessmentId = params['assessmentId'];
      }

      this.validateCreditCode(this.queryParamcc);
    });

    this.assessmentForm = this.fb.group({
      code: [{ value: null, disabled: true }, [Validators.required]],
      language: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.spinner.show(this.spinnerName);
    this.assementService.renderAssessment(this.queryParamaa).subscribe({
      next: resp => {
        this.spinner.hide(this.spinnerName);
        this.renderAssessmentData = resp;
        this.initialiseFields(this.renderAssessmentData);
        this.cd.markForCheck();
      },
      error: () => this.spinner.hide(this.spinnerName),
    });
  }

  onSubmit() {
    this.assessmentAnswer.language = this.languageCtrl.value;
    this.spinner.show(this.spinnerName);
    this.assementService.isCreditUsedBefore(this.queryParamcc).subscribe({
      next: resp => {
        if (resp) {
          this.preAssessmentDetailsResponse = resp;
          this.preAssessmentDemographics =
            resp && resp.demographics ? resp.demographics : undefined;
        }
        this.spinner.hide(this.spinnerName);
        this.navigateToDemographicsPage();
      },
      error: _ => {
        console.info('No demographics details');
        this.spinner.hide(this.spinnerName);
        this.navigateToDemographicsPage();
      },
    });
  }

  onSubmitPersonalInfoForm(value: any) {
    if (this.reportType === 'ECFEREPORT') {
      // this.getAssessmentCourseFit(this.assessmentAnswer);
      // TODO
    } else {
      if (!this.preAssessmentDemographics) {
        const reqPayload = {
          ...this.assessmentAnswer,
          contactNumber1: value.contactNumber,
          demographics: value,
        };
        this.spinner.show(this.spinnerName);
        this.assementService.submitPersonalInfo(reqPayload).subscribe({
          next: resp => {
            if (resp) {
              this.preAssessmentDetailsResponse = resp;
              this.preAssessmentDemographics =
                resp && resp.demographics ? resp.demographics : undefined;
            } else {
              console.error('pre-assessment-details is null');
            }
            this.spinner.hide(this.spinnerName);
            this.navigateToAssessmentPage();
            this.cd.markForCheck();
          },
          error: () => this.spinner.hide(this.spinnerName),
        });
      } else {
        this.navigateToAssessmentPage();
      }
    }
  }

  private navigateToDemographicsPage() {
    this.landingPage = false;
    this.personalInfoPage = true;
    if (this.renderAssessmentData) {
      this.personalInfofields = this.renderAssessmentData?.demographics.filter(
        (obj: Demographic) => obj['language'] === this.languageCtrl.value
      );
    }
    this.cd.markForCheck();
  }

  private navigateToAssessmentPage() {
    this.personalInfoPage = false;
    this.assessmentPage = true;
  }

  private initialiseFields(renderAssessmentData: RenderAssessmentResponse) {
    if (renderAssessmentData) {
      const { demographics, reportType, assessmentGroupId, companyAssessmentGroupId } =
        renderAssessmentData;
      this.assessmentAnswer.assessmentGroupId = assessmentGroupId;
      this.assessmentAnswer.companyAssessmentGroupId = companyAssessmentGroupId;
      this.assessmentAnswer.isGroup = this.isGroup;
      this.assessmentAnswer.assessmentUUID = this.queryParamaa;
      this.assessmentAnswer.creditCode = this.queryParamcc;
      this.reportType = reportType;
      this.getbranches(reportType);
      this.languages = this.getLanguages(demographics);
      this.languagesOptions = this.languages.map(v => ({ label: v, value: v }));
      this.assessmentForm.setValue({
        code: this.queryParamcc,
        language: this.languages.length ? this.languages[0] : null,
      });
    }
  }

  private validateCreditCode(creditCode: string) {
    this.assementService.checkCreditUsed(creditCode).subscribe({
      next: _ => {
        this.isValidCreditCode = true;
        this.toastService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Valid credit code',
          sticky: false,
          id: 'creditCode',
        });
        this.cd.markForCheck();
      },
      error: _ => {
        this.isValidCreditCode = false;
        this.toastService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Invalid credit code or credit code already in use,Please contact administrator',
          sticky: false,
          id: 'creditCode',
        });
      },
    });
  }

  private getLanguages(demographics: Demographic[]) {
    const uniqueLang = new Set<string>();
    demographics.forEach(demographic => uniqueLang.add(demographic.language));
    return [...uniqueLang];
  }

  private getAssessmentCourseFit(data: any): void {
    // this.spinner.show(this.spinnerName);
    // this.assementService.assessmentCourseFit(this.selectedBranches, this.queryParamaa).subscribe(
    //   response => {
    //     if (response.body) {
    //       this.assessments = response.body.assessments;
    //       this.basicInfoSumbmitted = true;
    //       this.isValidForm = true;
    //       this.hasErrorAfterSubmitted = false;
    //       this.onStepNext(false, true, true);
    //     }
    //     this.spinner.hide(this.spinnerName);
    //   },
    //   error => {
    //     this.spinner.hide(this.spinnerName);
    //     alert('Server Error');
    //   }
    // );
  }

  private getbranches(reportType: string | null): void {
    if (reportType === REPORT_TYPE.engReport || reportType === REPORT_TYPE.mbaReport) {
      const branchType =
        reportType === REPORT_TYPE.engReport ? 'ENGINEERING_BRANCH' : 'MBA_BRANCH ';
      this.sharedApiService.lookup(branchType).subscribe(branches => {
        this.branchesList = branches;
        this.cd.markForCheck();
      });
    }
  }

  get codeCtrl() {
    return this.assessmentForm.get('code') as FormControl;
  }
  get languageCtrl() {
    return this.assessmentForm.get('language') as FormControl;
  }
}

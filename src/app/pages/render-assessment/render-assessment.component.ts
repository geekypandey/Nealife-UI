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
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { Observable, finalize, forkJoin, switchMap, tap, throwError } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { REPORT_TYPE } from 'src/app/constants/assessment.constants';
import { DropdownOption } from 'src/app/models/common.model';
import { SharedApiService } from 'src/app/services/shared-api.service';
import { AssessmentStepperComponent } from './assessment-stepper/assessment-stepper.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import {
  Assessment,
  CheckCreditUsed,
  Demographic,
  PreAssessDetailsReqPayload,
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
    CheckboxModule,
    DialogModule,
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
  showTerms: boolean = false;

  renderAssessmentData: RenderAssessmentResponse | null = null;
  languagesOptions: DropdownOption[] = [];
  assessmentForm!: FormGroup;
  landingPage: boolean = false;
  personalInfoPage: boolean = false;
  isValidCreditCode: boolean = false;
  personalInfofields: Demographic[] = [];
  branchesList: DropdownOption[] = [];
  assessmentPage: boolean = false;
  readonly spinnerName = 'assessment-test';
  preAssessmentDemographics?: PreAssessmentDetailsDemographics;
  preAssessmentDetailsResponse!: PreAssessmentDetailsResponse;
  completedAssessments: Assessment[] = [];

  private languages: string[] = [];
  private route = inject(ActivatedRoute);
  private spinner: NgxSpinnerService = inject(NgxSpinnerService);
  private assementService = inject(RenderAssessmentService);
  private sharedApiService = inject(SharedApiService);
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);
  private toastService = inject(MessageService);
  private preAssessDetailsReqPayload: PreAssessDetailsReqPayload;
  private reportType: string | null = null;

  defaultModelImage = './../../../assets/login/illustration.svg';
  logoUrl: string = '';

  constructor() {
    this.preAssessDetailsReqPayload = new PreAssessDetailsReqPayload();
    this.landingPage = true;
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe(params => {
      this.queryParamau = params['AU'];
      this.queryParamaa = params['AA'];
      this.preAssessDetailsReqPayload.companyId = params['C'];
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

      if (this.queryParamcc) {
        this.validateCreditCode(this.queryParamcc).subscribe();
      } else {
        this.isValidCreditCode = true;
      }

      this.assessmentForm = this.fb.group({
        code: [{ value: null, disabled: this.queryParamcc }, [Validators.required]],
        language: [null, [Validators.required]],
        isChecked: [{ value: null, disabled: true }, [Validators.required]],
      });
    });
  }

  ngOnInit() {
    this.spinner.show(this.spinnerName);
    this.assementService.renderAssessment(this.queryParamaa).subscribe({
      next: resp => {
        this.spinner.hide(this.spinnerName);
        this.renderAssessmentData = resp;
        this.logoUrl = (this.renderAssessmentData && this.renderAssessmentData.logoUrl) || '';
        this.initialiseFields(this.renderAssessmentData);
        this.cd.markForCheck();
      },
      error: () => this.spinner.hide(this.spinnerName),
    });
  }

  onSubmit() {
    this.preAssessDetailsReqPayload.language = this.languageCtrl.value;
    if (!this.queryParamcc) {
      this.spinner.show(this.spinnerName);
      this.validateCreditCode(this.codeCtrl.value)
        .pipe(
          switchMap(resp => {
            if (resp && resp.data) {
              this.preAssessDetailsReqPayload.creditCode = this.codeCtrl.value;
              this.queryParamcc = this.codeCtrl.value;
              this.cd.markForCheck();
              return this.isCreditUsedBefore();
            }
            return throwError(() => new Error('Invalid credit code'));
          }),
          finalize(() => {
            this.spinner.hide(this.spinnerName);
          })
        )
        .subscribe();
    } else {
      this.isCreditUsedBefore().subscribe();
    }
  }

  private isCreditUsedBefore(): Observable<PreAssessmentDetailsResponse> {
    return this.assementService.isCreditUsedBefore(this.queryParamcc).pipe(
      tap({
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
          console.error('No demographics details');
          this.spinner.hide(this.spinnerName);
          this.navigateToDemographicsPage();
        },
      })
    );
  }

  onSubmitPersonalInfoForm(value: any) {
    if (!this.preAssessmentDemographics) {
      const reqPayload = {
        ...this.preAssessDetailsReqPayload,
        demographics: value,
      };
      const apiCalls = [this.assementService.submitPersonalInfo(reqPayload)];
      if (this.reportType === 'ECFEREPORT') {
        apiCalls.push(this.assementService.assessmentCourseFit(value.sectors, this.queryParamaa));
      }
      this.spinner.show(this.spinnerName);
      forkJoin<any[]>(apiCalls).subscribe({
        next: ([preAssessDetailsResp, assessData]) => {
          if (preAssessDetailsResp) {
            this.preAssessmentDetailsResponse = preAssessDetailsResp;
            this.preAssessmentDemographics =
              preAssessDetailsResp && preAssessDetailsResp.demographics
                ? preAssessDetailsResp.demographics
                : undefined;
          }
          if (assessData && this.reportType === 'ECFEREPORT') {
            this.renderAssessmentData = assessData;
          }
          this.spinner.hide(this.spinnerName);
          this.navigateToAssessmentPage();
          this.cd.markForCheck();
        },
        error: () => this.spinner.hide(this.spinnerName),
      });
    } else {
      if (this.reportType === 'ECFEREPORT') {
        this.spinner.show(this.spinnerName);
        this.assementService
          .assessmentCourseFit(value.sectors, this.queryParamaa)
          .subscribe(assessData => {
            this.renderAssessmentData = assessData;
            this.navigateToAssessmentPage();
            this.spinner.hide(this.spinnerName);
            this.cd.markForCheck();
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
    // Remove already submitted assessments
    if (
      this.renderAssessmentData &&
      this.preAssessmentDetailsResponse &&
      this.preAssessmentDetailsResponse.sectionDetails
    ) {
      const alreadySubmittedAssesIds = this.preAssessmentDetailsResponse.sectionDetails.map(
        section => section.assessmentId
      );
      const assessmentPending = this.renderAssessmentData.assessments.filter(
        assessment => !alreadySubmittedAssesIds.includes(assessment.assessmentId)
      );
      this.completedAssessments = this.renderAssessmentData.assessments.filter(assessment =>
        alreadySubmittedAssesIds.includes(assessment.assessmentId)
      );
      this.renderAssessmentData.assessments = assessmentPending;
    }
  }

  private initialiseFields(renderAssessmentData: RenderAssessmentResponse) {
    if (renderAssessmentData) {
      const {
        demographics,
        reportType,
        assessmentGroupId,
        companyAssessmentGroupId,
        companyAssessmentId,
        companyAssessmentGroupBranchMappingId,
      } = renderAssessmentData;
      this.preAssessDetailsReqPayload.assessmentGroupId = assessmentGroupId;
      this.preAssessDetailsReqPayload.companyAssessmentGroupId = companyAssessmentGroupId;
      this.preAssessDetailsReqPayload.isGroup = this.isGroup;
      this.preAssessDetailsReqPayload.assessmentUUID = this.queryParamaa;
      this.preAssessDetailsReqPayload.creditCode = this.queryParamcc;
      this.preAssessDetailsReqPayload.companyAssessmentId = companyAssessmentId;
      this.preAssessDetailsReqPayload.companyAssessmentGroupBranchMappingId =
        companyAssessmentGroupBranchMappingId;
      this.reportType = reportType;
      this.getbranches(reportType);
      this.languages = this.getLanguages(demographics);
      this.languagesOptions = this.languages.map(v => ({ label: v, value: v }));
      this.assessmentForm.patchValue({
        code: this.queryParamcc,
        language: this.languages.length ? this.languages[0] : null,
      });
    }
  }

  private validateCreditCode(creditCode: string): Observable<CheckCreditUsed> {
    return this.assementService.checkCreditUsed(creditCode).pipe(
      tap({
        next: resp => {
          this.isValidCreditCode = true;
          this.toastService.add({
            severity: 'success',
            summary: 'Success',
            detail: resp.data,
            sticky: false,
            id: 'creditCode',
          });
          this.cd.markForCheck();
        },
        error: _ => {
          if (this.queryParamcc) {
            // when no queryparam cc , keep it true
            this.isValidCreditCode = false;
          }
          this.toastService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              'Invalid credit code or credit code already in use,Please contact administrator',
            sticky: false,
            id: 'creditCode',
          });
          this.cd.markForCheck();
        },
      })
    );
  }

  private getLanguages(demographics: Demographic[]) {
    const uniqueLang = new Set<string>();
    demographics.forEach(demographic => uniqueLang.add(demographic.language));
    return [...uniqueLang];
  }

  // private getAssessmentCourseFit(branchIds: number[]): void {
  //   this.spinner.show(this.spinnerName);
  //   this.assementService.assessmentCourseFit(branchIds, this.queryParamaa).subscribe({
  //     next: res => {
  //       if (res) {
  //         this.renderAssessmentData = res;
  //         this.spinner.hide(this.spinnerName);
  //         this.navigateToAssessmentPage();
  //         this.cd.markForCheck();
  //       }
  //       this.spinner.hide(this.spinnerName);
  //     },
  //     error: _ => this.spinner.hide(this.spinnerName),
  //   });
  // }

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

  getModalImage() {
    return this.renderAssessmentData &&
      !this.isObjectEmpty(this.renderAssessmentData.landingPage) &&
      this.renderAssessmentData.landingPage != null
      ? this.renderAssessmentData.landingPage
      : this.defaultModelImage;
  }

  isObjectEmpty(obj: any): boolean {
    if (obj === null) {
      return true;
    }
    return Object.keys(obj).length === 0;
  }

  get codeCtrl() {
    return this.assessmentForm.get('code') as FormControl;
  }
  get languageCtrl() {
    return this.assessmentForm.get('language') as FormControl;
  }

  get isCheckedCtrl() {
    return this.assessmentForm.get('isChecked') as FormControl;
  }
}

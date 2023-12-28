import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
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
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { Demographic, RenderAssessment } from './render-assessment.model';
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

  renderAssessmentData: RenderAssessment | null = null;
  languagesOptions: DropdownOption[] = [];
  assessmentForm: FormGroup;
  landingPage: boolean = false;
  personalInfoPage: boolean = false;
  isValidCreditCode: boolean = false;
  personalInfofields: Demographic[] = [];

  private languages: string[] = [];
  private route = inject(ActivatedRoute);
  private spinner: NgxSpinnerService = inject(NgxSpinnerService);
  private assementService = inject(RenderAssessmentService);
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);
  private toastService = inject(MessageService);

  constructor() {
    this.landingPage = true;
    this.route.queryParams.subscribe(params => {
      this.queryParamau = params['AU'];
      this.queryParamaa = params['AA'];
      this.companyId = params['C'];
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
    this.spinner.show('assessment-test');
    this.assementService.renderAssessment(this.queryParamaa).subscribe({
      next: resp => {
        this.spinner.hide('assessment-test');
        this.renderAssessmentData = resp;
        this.initialiseFields(this.renderAssessmentData);
        this.cd.markForCheck();
      },
      error: () => this.spinner.hide('assessment-test'),
    });
  }

  onSubmit() {
    this.landingPage = false;
    this.personalInfoPage = true;
    if (this.renderAssessmentData) {
      this.personalInfofields = this.renderAssessmentData?.demographics.filter(
        (obj: Demographic) => obj['language'] === this.languageCtrl.value
      );
    }
  }

  private initialiseFields(renderAssessmentData: RenderAssessment) {
    if (renderAssessmentData) {
      const { demographics, reportType } = renderAssessmentData;
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
          severity: 'info',
          summary: 'Success',
          detail: 'Valid credit code',
          sticky: false,
          id: 'creditCode',
        });
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

  private getbranches(reportType: string): void {
    if (reportType === REPORT_TYPE.engReport || reportType === REPORT_TYPE.engReport) {
      const branchType =
        reportType === REPORT_TYPE.engReport ? 'ENGINEERING_BRANCH' : 'MBA_BRANCH ';
      // this.assessmentService.getBranchList(branchType).subscribe(branches => {
      //   this.branchesList = branches.body;
      // });
    }
  }

  get codeCtrl() {
    return this.assessmentForm.get('code') as FormControl;
  }
  get languageCtrl() {
    return this.assessmentForm.get('language') as FormControl;
  }
}

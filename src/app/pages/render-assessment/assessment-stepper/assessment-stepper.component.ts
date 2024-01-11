import { CommonModule, DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomCircleProgressComponent } from 'src/app/components/custom-circle-progress/custom-circle-progress.component';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { StepComponent } from 'src/app/components/stepper/step/step.component';
import { StepperComponent } from 'src/app/components/stepper/stepper.component';
import { Step } from 'src/app/components/stepper/stepper.model';
import { LayoutService } from 'src/app/services/layout.service';
import { getCurrentTime, scrollIntoView } from 'src/app/util/util';
import { AssessmentHeaderComponent } from '../assessment-header/assessment-header.component';
import {
  Assessment,
  PreAssessmentDetailsResponse,
  RenderAssessmentResponse,
  Section,
} from '../render-assessment.model';
import { RenderAssessmentService } from '../render-assessment.service';
import { PreAssessmentSectionDetailsRequest, Stat } from './assessment-section.model';

@Component({
  selector: 'nl-assessment-stepper',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AssessmentHeaderComponent,
    StepperComponent,
    StepComponent,
    CustomCircleProgressComponent,
    SpinnerComponent,
  ],
  templateUrl: './assessment-stepper.component.html',
  styleUrls: ['./assessment-stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssessmentStepperComponent implements OnChanges {
  @Input({ required: true })
  selectedLanguage: string = 'English';

  @Input({ required: true })
  assessmentsData: RenderAssessmentResponse | null = null;

  @Input({ required: true })
  preAssessmentDetailsResponse!: PreAssessmentDetailsResponse;

  showInstructions: boolean = false;
  showStepper: boolean = false;
  steps: Step[] = [];
  instructionsUrl!: SafeResourceUrl;
  activeStepIndex: number = 0;
  activeAssessmentIndex: number = 0;
  activeSectionIndex: number = 0;
  activeQuestionIndex: number = 0;

  activeAssessment!: Assessment;
  assessmentFormGroupArr: FormGroup[] = [];
  activeSectionFormGroup!: FormGroup;
  layoutService = inject(LayoutService);
  readonly SUB_TEST_LABEL: string = 'Sub-Test: ';
  readonly SUB_TEST_CARD_LABEL: string = 'sub-test-';
  readonly spinnerName = 'assessment-stepper';

  private startTime: string = '';
  private domSanitizer = inject(DomSanitizer);
  private fb = inject(FormBuilder);
  private doc = inject(DOCUMENT);
  private cd = inject(ChangeDetectorRef);
  private assementService = inject(RenderAssessmentService);
  private spinner = inject(NgxSpinnerService);
  private destroyRef = inject(DestroyRef);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['selectedLanguage'] && changes['assessmentsData']) {
      if (this.assessmentsData && this.assessmentsData.assessments.length) {
        this.activeAssessment = this.assessmentsData.assessments[0];
        this.startTime = getCurrentTime();
        this.instructionsUrl = this.getInstructionsUrl();
        this.showInstructions = true;
      }
    }
  }

  onAnswerSelection(questionIndex: number) {
    this.setSkippedCtrlVal(questionIndex, false);
    this.modifyQuestionCount(true);
  }

  onBack() {
    this.modifyQuestionCount(false);
  }

  onSkip(activeQuestionIndex: number) {
    this.setSkippedCtrlVal(activeQuestionIndex, true);
    this.modifyQuestionCount(true);
  }

  submitSectionDetails() {
    const answers = (<any[]>this.activeSectionFormGroup.value.itemAspectsFormArray).map(val => {
      const { language, ...rest } = val.selectedAnswer;
      return rest;
    });
    const stats: Stat[] = [
      {
        ...this.getStats(),
        assessmentEndTime: getCurrentTime(),
      },
    ];
    const sectionDetailsRequestPayload: PreAssessmentSectionDetailsRequest = {
      answers,
      assessmentId: this.activeAssessment.assessmentId,
      preAssessmentDetailsId: this.preAssessmentDetailsResponse.id,
      stats,
    };
    this.spinner.show(this.spinnerName);
    this.assementService
      .submitSectionDetails(sectionDetailsRequestPayload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: resp => {
          this.activeStepIndex += 1;
          this.activeSectionIndex += 1;
          this.activeQuestionIndex = 0;
          this.markSectionCompleted();
          this.activeSectionFormGroup = this.assessmentFormGroupArr[this.activeSectionIndex];
          const targetEle = this.doc.getElementById(
            this.SUB_TEST_CARD_LABEL + this.activeSectionIndex
          );
          scrollIntoView(targetEle);
          this.spinner.hide(this.spinnerName);
          this.cd.markForCheck();
        },
        error: _ => this.spinner.hide(this.spinnerName),
      });
  }

  isAnswered(questionIndex: number): boolean {
    const questionFormCtrl = <FormControl>(
      this.getActiveQuestionFormGroup(questionIndex).get('selectedAnswer')
    );
    return questionFormCtrl ? questionFormCtrl.valid : false;
  }

  isSkipped(questionIndex: number): boolean {
    const questionFormCtrl = <FormControl>(
      this.getActiveQuestionFormGroup(questionIndex).get('isSkipped')
    );
    if (questionFormCtrl) {
      return questionFormCtrl.value;
    }
    return false;
  }

  onInstructionsSubmit() {
    this.showInstructions = false;
    this.showStepper = true;
    this.activeStepIndex = 1; // mark instructions step as completed
    this.activeSectionIndex = 0;
    this.activeAssessmentIndex = 0;
    this.steps = [
      {
        title: 'Instructions',
        subTitle: this.getSectionSubtitle(),
        showSubTitle: false,
        completed: true,
        stepControl: this.fb.group({}),
      },
      ...this.getSteps(),
    ];
    this.activeSectionFormGroup = this.assessmentFormGroupArr[0];
    // console.info(this.steps);
    // console.info(this.assessmentFormGroupArr);
  }

  private getSteps(): Step[] {
    return this.sections.map((section, index) => {
      const itemAspectsFormArray = this.fb.array([]);
      this.addQuestionsInSection(section, itemAspectsFormArray);
      const sectionFormGrp = this.fb.group({
        itemAspectsFormArray: itemAspectsFormArray,
      });
      this.assessmentFormGroupArr.push(sectionFormGrp);
      return {
        title: this.SUB_TEST_LABEL + (index + 1), //section.name,
        subTitle: this.getSectionSubtitle(section),
        showSubTitle: true,
        stepControl: sectionFormGrp,
        completed: false,
      };
    });
  }

  private markSectionCompleted() {
    this.steps = this.steps.map((step, index) => {
      if (index === this.activeSectionIndex) {
        return { ...step, completed: true };
      }
      return step;
    });
  }

  private modifyQuestionCount(isForward: boolean) {
    if (this.activeSectionIndex < this.sections.length) {
      if (this.activeQuestionIndex < this.itemAspects.length - 1) {
        if (isForward) {
          this.activeQuestionIndex += 1;
        } else {
          this.activeQuestionIndex -= 1;
        }
      } else if (this.activeQuestionIndex === this.itemAspects.length - 1 && !isForward) {
        // if it's last question of itemAspects and user clicked Back button
        this.activeQuestionIndex -= 1;
      }
    }
    // else {
    //   this.activeAssessmentIndex += 1;
    //   this.activeSectionIndex = 0;
    //   this.activeQuestionIndex = 0;
    // }
  }

  private addQuestionsInSection(section: Section, formArray: FormArray) {
    section.itemAspects.forEach(_ => {
      formArray.push(
        this.fb.group({
          selectedAnswer: [null, Validators.required],
          isSkipped: [false],
        })
      );
    });
  }

  private getSectionSubtitle(section?: Section): string {
    const subTitleStr = (val: number) => `Contains ${val} questions`;
    return section ? subTitleStr(section.itemAspects.length) : subTitleStr(0);
  }

  private setSkippedCtrlVal(questionIndex: number, isSkipped: boolean) {
    const questFormGrp = this.getActiveQuestionFormGroup(questionIndex);
    const selectedAnswer = questFormGrp.get('selectedAnswer')?.value;
    if (isSkipped && !selectedAnswer) {
      questFormGrp.get('isSkipped')?.setValue(true);
    } else {
      questFormGrp.get('isSkipped')?.setValue(false);
    }
  }

  private getInstructionsUrl() {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(
      this.activeAssessment?.instructionPage[this.selectedLanguage]
    );
  }

  private getStats(): Stat {
    return {
      assessmentId: this.activeAssessment.assessmentId,
      assessmentStartTime: this.startTime,
      assessmentEndTime: getCurrentTime(),
      totalQuestions: this.itemAspects.length,
      questionsUnattempted: this.getUnattemptedQuestions(),
      questionsSkipped: this.getSkippedQuestions(),
    };
  }

  private getSkippedQuestions(): number {
    return this.activeSectionFormGroup.value.itemAspectsFormArray.reduce(
      (acc: number, curr: { isSkipped: boolean }) => {
        return curr.isSkipped ? (acc = acc += 1) : acc;
      },
      0
    );
  }

  private getUnattemptedQuestions(): number {
    return this.activeSectionFormGroup.value.itemAspectsFormArray.reduce(
      (acc: number, curr: { selectedAnswer: any }) => {
        return curr.selectedAnswer ? acc : (acc = acc += 1);
      },
      0
    );
  }

  private getActiveQuestionFormGroup(questionIndex: number): FormGroup {
    return <FormGroup>(
      (<FormArray>this.activeSectionFormGroup.get('itemAspectsFormArray')).at(questionIndex)
    );
  }

  // get activeFormGroup():FormGroup {
  //   return this.activeFormGroup[this.activeSectionIndex]
  // }

  get itemAspects() {
    return this.sections[this.activeSectionIndex].itemAspects;
  }

  get sections() {
    return this.activeAssessment.sections;
  }
}

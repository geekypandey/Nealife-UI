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
  ItemAspect,
  PreAssessmentDetailsResponse,
  RenderAssessmentResponse,
  TotalAssessments,
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

  showGeneralInstructions: boolean = false;
  showStepper: boolean = false;
  steps: Step[] = [];
  generalInstructionsUrl!: SafeResourceUrl;
  activeStepIndex: number = 0;
  activeAssessmentIndex: number = -1;
  activeSectionIndex: number = 0;
  activeQuestionIndex: number = 0;

  activeAssessment!: TotalAssessments;
  assessmentFormGroupArr: FormGroup[] = [];
  activeAssessmentFormGroup?: FormGroup;
  layoutService = inject(LayoutService);
  readonly SUB_TEST_LABEL: string = 'Sub-Test: ';
  readonly SUB_TEST_CARD_LABEL: string = 'sub-test-';
  readonly spinnerName = 'assessment-stepper';
  totalAssessments: TotalAssessments[] = [];

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
        this.totalAssessments = this.assessmentsData.assessments.map(assessment => {
          return {
            ...assessment,
            itemAspects: this.getAssessmentItemAspects(assessment),
          };
        });
        this.activeAssessment = this.totalAssessments[0];
        this.showGeneralInstructions = true;
        this.generalInstructionsUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
          'https://d2f17thloo9pg4.cloudfront.net/content/prod/images/html/VAEEnglish.html'
        );
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
    if (!this.activeAssessmentFormGroup) {
      return;
    }
    let answersList = (<any[]>this.activeAssessmentFormGroup.value.itemAspectsFormArray).map(
      val => {
        const { language, ...rest } = val.selectedAnswer || {};
        return rest;
      }
    );
    const answers = answersList.filter(v => Object.keys(v).length); // to remove empty {} objects
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
          this.markStepCompleted();
          this.activeAssessmentFormGroup = undefined;
          this.nextAssessment();
          const targetEle = this.doc.getElementById(
            this.SUB_TEST_CARD_LABEL + this.activeAssessmentIndex
          );
          scrollIntoView(targetEle);
          this.spinner.hide(this.spinnerName);
          this.cd.markForCheck();
        },
        error: _ => this.spinner.hide(this.spinnerName),
      });
  }

  private nextAssessment() {
    if (this.activeAssessmentIndex < this.totalAssessments.length - 1) {
      this.activeStepIndex += 1;
    } else {
      this.spinner.show(this.spinnerName);
      this.assementService
        .submitFinalAssessment(this.preAssessmentDetailsResponse.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: _ => {
            this.spinner.hide(this.spinnerName);
          },
          error: _ => this.spinner.hide(this.spinnerName),
        });
    }
  }

  isAnswered(questionIndex: number): boolean {
    const activeAssessmentFormGroup = this.getActiveQuestionFormGroup(questionIndex);
    if (activeAssessmentFormGroup) {
      const questionFormCtrl = <FormControl>activeAssessmentFormGroup.get('selectedAnswer');
      return questionFormCtrl ? questionFormCtrl.value : false;
    }
    return false;
  }

  isSkipped(questionIndex: number): boolean {
    const activeAssessmentFormGroup = this.getActiveQuestionFormGroup(questionIndex);
    if (activeAssessmentFormGroup) {
      const questionFormCtrl = <FormControl>activeAssessmentFormGroup.get('isSkipped');
      if (questionFormCtrl) {
        return questionFormCtrl.value;
      }
      return false;
    }
    return false;
  }

  onGenInstructionsSubmit() {
    this.showGeneralInstructions = false;
    this.showStepper = true;
    this.steps = this.getSteps();
  }

  onAssessmentInstructionsSubmit() {
    this.markStepCompleted();
    this.startTime = getCurrentTime();
    this.activeAssessmentIndex += 1;
    this.activeStepIndex += 1;
    this.activeQuestionIndex = 0;
    this.activeAssessmentFormGroup = this.getAssessmentFormGroup(this.activeStepIndex);
    this.activeAssessment = this.totalAssessments[this.activeAssessmentIndex];
  }

  private getAssessmentFormGroup(stepIndex: number) {
    return this.steps[stepIndex].stepFormGroup;
  }

  private getSteps(): Step[] {
    return this.totalAssessments
      .map((assessment, index) => {
        const itemAspects = assessment.sections.map(v => v.itemAspects).flat();
        const assessmentFormGrp = this.fb.group({
          itemAspectsFormArray: this.getItemAspectFormArr(itemAspects),
        });
        this.assessmentFormGroupArr.push(assessmentFormGrp);
        const instructionStep: Step = {
          title: 'Instructions',
          completed: false,
          instructionUrl: this.getInstructionsUrl(assessment),
        };
        const assessmentStep: Step = {
          title: assessment.displayName, //section.name,
          stepFormGroup: assessmentFormGrp,
          completed: false,
        };
        return [instructionStep, assessmentStep];
      })
      .flat();
  }

  private getAssessmentItemAspects(assessment: Assessment): ItemAspect[] {
    return assessment.sections.map(v => v.itemAspects).flat();
  }

  private getActiveAssessmentItemAspects(assessmentIndex: number): ItemAspect[] {
    if (!this.assessmentsData) {
      return [];
    }
    return this.assessmentsData.assessments[assessmentIndex].sections
      .map(v => v.itemAspects)
      .flat();
  }

  private markStepCompleted() {
    this.steps = this.steps.map((step, index) => {
      if (index === this.activeStepIndex) {
        return { ...step, completed: true };
      }
      return step;
    });
  }

  private modifyQuestionCount(isForward: boolean) {
    if (this.activeAssessmentIndex < this.totalAssessments.length) {
      const itemAspectsLength = this.activeAssessment.itemAspects.length;
      if (this.activeQuestionIndex < itemAspectsLength - 1) {
        if (isForward) {
          this.activeQuestionIndex += 1;
        } else {
          this.activeQuestionIndex -= 1;
        }
      } else if (this.activeQuestionIndex === itemAspectsLength - 1 && !isForward) {
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

  private getItemAspectFormArr(itemAspects: ItemAspect[]): FormArray {
    const formArray = this.fb.array<FormGroup>([]);
    itemAspects.forEach(_ => {
      formArray.push(
        this.fb.group({
          selectedAnswer: null,
          isSkipped: false,
        })
      );
    });
    return formArray;
  }

  private setSkippedCtrlVal(questionIndex: number, isSkipped: boolean) {
    const questFormGrp = this.getActiveQuestionFormGroup(questionIndex);
    if (questFormGrp) {
      const selectedAnswer = questFormGrp.get('selectedAnswer')?.value;
      if (isSkipped && !selectedAnswer) {
        questFormGrp.get('isSkipped')?.setValue(true);
      } else {
        questFormGrp.get('isSkipped')?.setValue(false);
      }
    }
  }

  private getInstructionsUrl(assessment: TotalAssessments) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(
      assessment?.instructionPage[this.selectedLanguage]
    );
  }

  private getStats(): Stat {
    return {
      assessmentId: this.activeAssessment.assessmentId,
      assessmentStartTime: this.startTime,
      assessmentEndTime: getCurrentTime(),
      totalQuestions: this.activeAssessment.itemAspects.length,
      questionsUnattempted: this.getUnattemptedQuestions(),
      questionsSkipped: this.getSkippedQuestions(),
    };
  }

  private getSkippedQuestions(): number {
    if (!this.activeAssessmentFormGroup) {
      return 0;
    }
    return this.activeAssessmentFormGroup.value.itemAspectsFormArray.reduce(
      (acc: number, curr: { isSkipped: boolean }) => {
        return curr.isSkipped ? (acc = acc += 1) : acc;
      },
      0
    );
  }

  private getUnattemptedQuestions(): number {
    if (!this.activeAssessmentFormGroup) {
      return 0;
    }
    return this.activeAssessmentFormGroup.value.itemAspectsFormArray.reduce(
      (acc: number, curr: { selectedAnswer: any }) => {
        return curr.selectedAnswer ? acc : (acc = acc += 1);
      },
      0
    );
  }

  private getActiveQuestionFormGroup(questionIndex: number): FormGroup | undefined {
    if (!this.activeAssessmentFormGroup) {
      return undefined;
    }
    return <FormGroup>(
      (<FormArray>this.activeAssessmentFormGroup.get('itemAspectsFormArray')).at(questionIndex)
    );
  }

  itemAspectTrackByFn(_: number, item: ItemAspect) {
    return item.itemAspectId;
  }

  // get activeFormGroup():FormGroup {
  //   return this.activeFormGroup[this.activeSectionIndex]
  // }

  // get itemAspects() {
  //   return this.sections[this.activeSectionIndex].itemAspects;
  // }

  // get sections() {
  //   return this.activeAssessment.sections;
  // }
}

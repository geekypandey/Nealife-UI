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
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { Observable, map, take, tap, timer } from 'rxjs';
import { CustomCircleProgressComponent } from 'src/app/components/custom-circle-progress/custom-circle-progress.component';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { StepComponent } from 'src/app/components/stepper/step/step.component';
import { StepperComponent } from 'src/app/components/stepper/stepper.component';
import { Step } from 'src/app/components/stepper/stepper.model';
import { SafeType, SanitizePipe } from 'src/app/pipes/sanitize.pipe';
import { MinuteSecondsPipe } from 'src/app/pipes/seconds-to-minutes.pipe';
import { LayoutService } from 'src/app/services/layout.service';
import { getCurrentTime } from 'src/app/util/util';
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
import { InstructionUrlPipe } from './instruction-url.pipe';

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
    MinuteSecondsPipe,
    FormsModule,
    InstructionUrlPipe,
    SanitizePipe,
  ],
  templateUrl: './assessment-stepper.component.html',
  styleUrls: ['./assessment-stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssessmentStepperComponent implements OnChanges {
  @Input({ required: true })
  selectedLanguage: string = 'English';

  langOptions: string[] = ['English', 'Marathi'];
  private _assessmentsData: RenderAssessmentResponse | null = null;
  @Input({ required: true })
  set assessmentsData(value: RenderAssessmentResponse | null) {
    if (value) {
      this._assessmentsData = value;
      // this.langOptions =
    }
  }
  get assessmentsData() {
    return this._assessmentsData;
  }

  @Input()
  preAssessmentDetailsResponse: PreAssessmentDetailsResponse | null = null;

  @Input({ required: true })
  completedAssessments: Assessment[] = [];

  @Input()
  logoUrl: string = '';

  @Input()
  readOnlyAssessment: boolean = false;

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
  freezeNextAssessement: boolean = false;
  showAssessmentLastPage: boolean = false;

  private startTime: string = '';
  private domSanitizer = inject(DomSanitizer);
  private fb = inject(FormBuilder);
  private doc = inject(DOCUMENT);
  private cd = inject(ChangeDetectorRef);
  private assementService = inject(RenderAssessmentService);
  private spinner = inject(NgxSpinnerService);
  private destroyRef = inject(DestroyRef);
  private toastService = inject(MessageService);
  freezeAssessment$!: Observable<number>;
  clearTimer!: any;
  thanksNote: boolean = false;

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
        // this.generalInstructionsUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
        //   this.sanitizeGenInsPage(this.assessmentsData.instructionPage[this.selectedLanguage])
        // );
      }
    }
  }

  private sanitizeGenInsPage(value: string) {
    return !value || (typeof value === 'object' && Object.keys(value).length === 0)
      ? 'about:blank'
      : value;
  }

  onAnswerSelection(questionIndex: number) {
    this.setSkippedCtrlVal(questionIndex, false);
    if (this.clearTimer) {
      clearTimeout(this.clearTimer);
    }
    this.clearTimer = setTimeout(() => {
      this.modifyQuestionCount(true);
      this.cd.markForCheck();
    }, 400);
  }

  onBack() {
    this.modifyQuestionCount(false);
  }

  onSkip(activeQuestionIndex: number) {
    this.setSkippedCtrlVal(activeQuestionIndex, true);
    this.modifyQuestionCount(true);
  }

  timeOver() {
    console.info('timeOver ');
    this.submitSectionDetails();
  }

  submitSectionDetails() {
    if (!this.activeAssessmentFormGroup) {
      return;
    }
    if (this.assessmentsData?.compulsory) {
      let answersList1 = (<any[]>this.activeAssessmentFormGroup.value.itemAspectsFormArray).map(
        val => {
          return val.selectedAnswer;
        }
      );
      const isUnAnswered = answersList1.some(v => v === null);
      if (isUnAnswered) {
        this.toastService.add({
          severity: 'warn',
          summary: 'Warning',
          detail: 'All the Questions are compulsory. Please attempt All!!!',
          sticky: false,
          id: 'assessmentCompulsory',
        });
        return;
      }
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

    if (this.preAssessmentDetailsResponse && this.preAssessmentDetailsResponse.id) {
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
          next: resp => this.submitSectionDetailsResp(),
          error: _ => this.spinner.hide(this.spinnerName),
        });
    } else {
      console.error('submitSectionDetails - No preAssessmentDetails Id');
      if (this.readOnlyAssessment) {
        this.submitSectionDetailsResp();
      }
    }
  }

  private submitSectionDetailsResp() {
    this.markStepCompleted();
    this.activeAssessmentFormGroup = undefined;
    this.nextAssessment();
    // const targetEle = this.doc.getElementById(
    //   this.SUB_TEST_CARD_LABEL + this.activeAssessmentIndex
    // );
    // scrollIntoView(targetEle);
    this.spinner.hide(this.spinnerName);
    this.cd.markForCheck();
  }

  private nextAssessment() {
    if (this.activeAssessmentIndex < this.totalAssessments.length - 1) {
      // show freeze assessment message
      const nextAssessment = this.totalAssessments[this.activeAssessmentIndex];
      if (nextAssessment.pauseTime) {
        this.showFreezeScreen(nextAssessment);
      } else {
        this.activeStepIndex += 1;
      }
    } else {
      // if it's last assessment
      if (this.preAssessmentDetailsResponse && this.preAssessmentDetailsResponse.id) {
        this.showStepper = false;
        this.spinner.show(this.spinnerName);
        this.assementService
          .submitFinalAssessment(this.preAssessmentDetailsResponse.id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: _ => {
              this.showAssessmentLastPage = true;
              setTimeout(() => {
                this.thanksNote = true;
                this.cd.markForCheck();
              }, 7000);
              this.spinner.hide(this.spinnerName);
              this.toastService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Assessment Submitted Successfully !',
                sticky: false,
                id: 'assessmentSubmit',
              });
              this.cd.markForCheck();
            },
            error: _ => {
              this.spinner.hide(this.spinnerName);
              this.toastService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Something went wrong with assessment submit',
                sticky: true,
                id: 'assessmentSubmit',
              });
              this.cd.markForCheck();
            },
          });
      } else {
        console.error('nextAssessment - No preAssessmentDetails Id');
        if (this.readOnlyAssessment) {
          this.showStepper = false;
          this.showAssessmentLastPage = true;
          setTimeout(() => {
            this.thanksNote = true;
            this.cd.markForCheck();
          }, 7000);
        }
      }
    }
  }

  private showFreezeScreen(nextAssessment: TotalAssessments) {
    this.freezeNextAssessement = true;
    const totalTimeInSeconds = nextAssessment.pauseTime * 60;
    this.freezeAssessment$ = timer(0, 1000).pipe(
      take(totalTimeInSeconds + 1),
      map(secondsElapsed => totalTimeInSeconds - secondsElapsed),
      tap({
        complete: () => {
          this.freezeNextAssessement = false;
          this.activeStepIndex += 1;
          this.cd.markForCheck();
        },
      })
    );
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
      } else {
        // if it's last question then submit section
        // this.submitSectionDetails();
        console.info('last question of assessment');
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
        ? assessment?.instructionPage[this.selectedLanguage]
        : 'about:blank'
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

  isEmptyObject(obj: Object) {
    return Object.keys(obj).length === 0;
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

  get safeType() {
    return SafeType;
  }
}

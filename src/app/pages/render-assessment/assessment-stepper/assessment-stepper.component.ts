import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CustomCircleProgressComponent } from 'src/app/components/custom-circle-progress/custom-circle-progress.component';
import { StepComponent } from 'src/app/components/stepper/step/step.component';
import { StepperComponent } from 'src/app/components/stepper/stepper.component';
import { Step } from 'src/app/components/stepper/stepper.model';
import { AssessmentHeaderComponent } from '../assessment-header/assessment-header.component';
import { Assessment, RenderAssessment, Section } from '../render-assessment.model';

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
  ],
  templateUrl: './assessment-stepper.component.html',
  styleUrls: ['./assessment-stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssessmentStepperComponent implements OnChanges {
  @Input({ required: true })
  selectedLanguage: string = 'English';

  @Input()
  assessmentsData: RenderAssessment | null = null;

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
  private domSanitizer = inject(DomSanitizer);
  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['selectedLanguage'] && changes['assessmentsData']) {
      if (this.assessmentsData && this.assessmentsData.assessments.length) {
        this.activeAssessment = this.assessmentsData.assessments[0];
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

  isAnswered(questionIndex: number): boolean {
    const questionFormCtrl = <FormControl>(
      this.getActiveQuestionFormGroup(questionIndex).get('selectedOption')
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
    console.info(this.steps);
    console.info(this.assessmentFormGroupArr);
  }

  getSteps(): Step[] {
    return this.sections.map((section, index) => {
      const itemAspectsFormArray = this.fb.array([]);
      this.addQuestionsInSection(section, itemAspectsFormArray);
      const sectionFormGrp = this.fb.group({
        itemAspectsFormArray: itemAspectsFormArray,
      });
      this.assessmentFormGroupArr.push(sectionFormGrp);
      return {
        title: 'Sub-Test: ' + (index + 1), //section.name,
        subTitle: this.getSectionSubtitle(section),
        showSubTitle: true,
        stepControl: sectionFormGrp,
        completed: sectionFormGrp.valid,
      };
    });
  }

  private modifyQuestionCount(isForward: boolean) {
    if (this.activeSectionIndex < this.sections.length) {
      if (this.activeQuestionIndex < this.itemAspects.length) {
        if (isForward) {
          this.activeQuestionIndex += 1;
        } else {
          this.activeQuestionIndex -= 1;
        }
      }
      //  else {
      //   this.activeSectionIndex += 1;
      //   this.activeQuestionIndex = 0;
      // }
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
          selectedOption: [null, Validators.required],
          isSkipped: [false],
        })
      );
    });
  }

  private getSectionSubtitle(section?: Section): string {
    const subTitleStr = (val: number) => `Contains ${val} questions`;
    return section ? subTitleStr(section.itemAspects.length) : subTitleStr(0);
  }

  private setSkippedCtrlVal(questionIndex: number, value: boolean) {
    const questFormGrp = this.getActiveQuestionFormGroup(questionIndex);
    questFormGrp.get('isSkipped')?.setValue(value);
  }

  private getInstructionsUrl() {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(
      this.activeAssessment?.instructionPage[this.selectedLanguage]
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

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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

  private activeAssessment!: Assessment;
  private domSanitizer = inject(DomSanitizer);
  private fb = inject(FormBuilder);

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

  onAnswerSelection() {
    if (this.activeSectionIndex < this.sections.length) {
      if (this.activeQuestionIndex < this.itemAspects.length) {
        this.activeQuestionIndex += 1;
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

  onInstructionsSubmit() {
    this.showInstructions = false;
    this.showStepper = true;
    this.activeStepIndex = 1; // mark instructions step as completed
    this.activeSectionIndex = 0;
    this.activeAssessmentIndex = 0;
    this.steps = [
      {
        title: 'Instructions',
        completed: true,
        stepControl: this.fb.group({}),
      },
      ...this.getSteps(),
    ];
    console.info(this.steps);
  }

  getSteps(): Step[] {
    return this.sections.map((section, index) => {
      const sectionFormGrp = this.getSectionFormGroup(section);
      return {
        title: 'Sub-Test: ' + (index + 1), //section.name,
        subTitle: this.getSectionSubtitle(section),
        stepControl: sectionFormGrp,
        completed: sectionFormGrp.valid,
      };
    });
  }

  private getSectionFormGroup(section: Section): FormGroup<any> {
    const itemAspectsFormArray = this.fb.array<FormGroup>([]);
    const formGroup = this.fb.group<any>({
      assessmentId: this.activeAssessment.assessmentId,
      itemAspectsFormArray: itemAspectsFormArray,
    });
    section.itemAspects.forEach(item => {
      itemAspectsFormArray.push(
        this.fb.group({
          itemAspectId: [item.itemAspectId],
          itemKey: [item.itemKey],
          selectedQuestion: [item.language[this.selectedLanguage]],
          selectedOption: [null, [Validators.required]],
        })
      );
    });

    // formGroup.valueChanges.subscribe(v => console.log(v));
    return formGroup;
  }

  private getSectionSubtitle(section: Section): string {
    return `Contains ${section.itemAspects.length} questions`;
  }

  private getInstructionsUrl() {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(
      this.activeAssessment?.instructionPage[this.selectedLanguage]
    );
  }

  get itemAspects() {
    return this.sections[this.activeSectionIndex].itemAspects;
  }

  get sections() {
    return this.activeAssessment.sections;
  }
}

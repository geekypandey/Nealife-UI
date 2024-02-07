import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Input,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MultiSelectModule } from 'primeng/multiselect';
import { Observable, map } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { LookupResponse } from 'src/app/models/common.model';
import { SharedApiService } from 'src/app/services/shared-api.service';
import { AssessService } from '../../services/assess.service';
import { AssessmentGroup, IAssessment, IAssessmentGroup } from '../assessment-group.model';

@Component({
  selector: 'nl-assessment-group-update',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, MultiSelectModule, ReactiveFormsModule],
  templateUrl: './assessment-group-update.component.html',
  styleUrls: ['./assessment-group-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssessmentGroupUpdateComponent {
  spinnerName = 'assessment-group-edit';
  assessmentByGroup!: AssessmentGroup;
  demographicsDropDown$: Observable<LookupResponse[]>;
  editForm!: FormGroup;

  private spinner = inject(NgxSpinnerService);
  private assessService = inject(AssessService);
  private sharedApiService = inject(SharedApiService);
  private cdRef = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  @Input()
  set id(id: string) {
    this.spinner.show(this.spinnerName);
    if (id) {
      this.assessService
        .getAssessmentsByGroup<IAssessmentGroup>(id || '')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: resp => {
            if (resp) {
              this.assessmentByGroup = resp;
              this.updateForm(this.assessmentByGroup);
              this.cdRef.markForCheck();
            }
          },
          complete: () => this.spinner.hide(this.spinnerName),
        });
    } else {
      // this.editForm = this.getEditForm(<Company>{});
    }
  }

  constructor() {
    this.editForm = this.getEditForm();
    this.demographicsDropDown$ = this.sharedApiService.lookup('DEMOGRAPHICS', false).pipe(
      map(res => {
        const result = res[0].key.split(',');
        return result; //.map((v: string) => ({ label: v.toUpperCase(), value: v })).flat();
      })
    );
  }

  updateForm(assessmentGroup: IAssessmentGroup): void {
    this.editForm.patchValue({
      id: assessmentGroup.id,
      name: assessmentGroup.name,
      description: assessmentGroup.description,
      status: assessmentGroup.status,
      // price: assessmentGroup.price,
      accountAssessmentGroupId: assessmentGroup.accountAssessmentGroupId,
      assessmentGroupId: assessmentGroup.assessmentGroupId,
      displayName: assessmentGroup.displayName,
      resultGenerator: assessmentGroup.resultGenerator,
      instructions: assessmentGroup.instructions,
      landingPage: assessmentGroup.landingPage,
      price: assessmentGroup.price,
      demographics: assessmentGroup.demographics ? assessmentGroup.demographics.split(',') : [],
      reportType: assessmentGroup.reportType,
    });

    // this.demographics = assessmentGroup.demographics?.split(',') || [];
  }

  getEditForm() {
    return this.fb.group({
      id: [],
      name: [null, [Validators.required, Validators.maxLength(75)]],
      description: [null, [Validators.required, Validators.maxLength(300)]],
      status: ['ACTIVE'],
      // price: [],
      accountAssessmentGroupId: [],
      assessmentGroupId: [],
      displayName: [null, [Validators.maxLength(75)]],
      resultGenerator: [null, Validators.required],
      instructions: [null, Validators.required],
      landingPage: [null, Validators.required],
      price: [null],
      demographics: [null],
      reportType: null,
    });
  }

  goBack() {
    window.history.back();
  }

  save() {
    if (this.editForm.valid) {
      const assessmentGroup = this.createFromForm();
      this.spinner.show(this.spinnerName);
      if (assessmentGroup.id !== undefined && assessmentGroup.id !== null) {
        this.subscribeToSaveResponse(this.assessService.updateAssessment(assessmentGroup));
      } else {
        this.subscribeToSaveResponse(this.assessService.createGroup(assessmentGroup));
      }
    }
  }

  private subscribeToSaveResponse(result: Observable<IAssessment>): void {
    result.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  private createFromForm(): IAssessmentGroup {
    return {
      ...new AssessmentGroup(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      //scheduleDate: formatDate(this.editForm.get(['scheduleDate'])!.value, 'dd/MM/yyyy', 'en'),
      status: this.editForm.get(['status'])!.value,
      accountAssessmentGroupId: this.editForm.get(['accountAssessmentGroupId'])!.value,
      assessmentGroupId: this.editForm.get(['assessmentGroupId'])!.value,
      displayName: this.editForm.get(['displayName'])?.value,
      resultGenerator: this.editForm.get(['resultGenerator'])?.value,
      instructions: this.editForm.get(['instructions'])?.value,
      landingPage: this.editForm.get(['landingPage'])?.value,
      price: this.editForm.get(['price'])?.value,
      demographics: this.editForm.get(['demographics'])?.value.join(),
      reportType: this.editForm.get(['reportType'])?.value,
    };
  }

  protected onSaveSuccess(): void {
    this.spinner.hide(this.spinnerName);
    this.goBack();
  }

  protected onSaveError(): void {
    this.spinner.hide(this.spinnerName);
    console.error('error while save');
  }
}

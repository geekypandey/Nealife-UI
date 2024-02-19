import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { API_URL } from 'src/app/constants/api-url.constants';
import { CRUDService } from '../../../services/crud.service';
import { IAspect } from '../../aspect/aspect.model';
import { IInterpretation, Interpretation } from '../interpretation.model';

@Component({
  selector: 'nl-interpretation-update',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, ReactiveFormsModule],
  templateUrl: './interpretation-update.component.html',
  styleUrls: ['./interpretation-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterpretationUpdateComponent {
  spinnerName = 'interpretation-edit';
  private spinner = inject(NgxSpinnerService);
  private crudService: CRUDService = inject(CRUDService);
  private fb = inject(FormBuilder);
  private cdRef = inject(ChangeDetectorRef);
  interpretation!: IInterpretation;
  aspects$: Observable<IAspect[]>;

  @Input()
  set id(id: string) {
    if (id) {
      this.spinner.show(this.spinnerName);
      this.crudService.find<IInterpretation>(API_URL.interpretations, id).subscribe({
        next: resp => {
          if (resp) {
            this.interpretation = resp;
            this.editForm = this.getEditForm(this.interpretation);
            this.spinner.hide(this.spinnerName);
            this.cdRef.markForCheck();
          }
        },
        complete: () => this.spinner.hide(this.spinnerName),
      });
    } else {
      this.editForm = this.getEditForm(<IInterpretation>{});
    }
  }

  editForm!: FormGroup;

  constructor() {
    this.aspects$ = this.crudService.query<IAspect[]>(API_URL.aspects);
  }

  private getEditForm(interpretation: IInterpretation) {
    return this.fb.group({
      id: [interpretation.id],
      high: [interpretation.high, [Validators.maxLength(1000)]],
      low: [interpretation.low, [Validators.maxLength(1000)]],
      medium: [interpretation.medium, [Validators.maxLength(1000)]],
      interpretation1: [interpretation.interpretation1, [Validators.maxLength(1000)]],
      interpretation2: [interpretation.interpretation2, [Validators.maxLength(1000)]],
      interpretation3: [interpretation.interpretation3, [Validators.maxLength(1000)]],
      interpretation4: [interpretation.interpretation4, [Validators.maxLength(1000)]],
      interpretation5: [interpretation.interpretation5, [Validators.maxLength(1000)]],
      interpretation6: [interpretation.interpretation6, [Validators.maxLength(1000)]],
      aspectId: [interpretation.aspectId],
    });
  }

  trackById(index: number, item: any): any {
    return item.id;
  }

  goBack() {
    window.history.back();
  }

  save() {
    if (this.editForm.valid) {
      const interpretation = this.createFromForm();
      if (interpretation.id !== undefined) {
        this.subscribeToSaveResponse(
          this.crudService.update(API_URL.interpretations, interpretation)
        );
      } else {
        this.subscribeToSaveResponse(
          this.crudService.create(API_URL.interpretations, interpretation)
        );
      }
    }
  }

  private createFromForm(): IInterpretation {
    return {
      ...new Interpretation(),
      id: this.editForm.get(['id'])!.value || undefined,
      high: this.editForm.get(['high'])!.value,
      low: this.editForm.get(['low'])!.value,
      medium: this.editForm.get(['medium'])!.value,
      interpretation1: this.editForm.get(['interpretation1'])!.value,
      interpretation2: this.editForm.get(['interpretation2'])!.value,
      interpretation3: this.editForm.get(['interpretation3'])!.value,
      interpretation4: this.editForm.get(['interpretation4'])!.value,
      interpretation5: this.editForm.get(['interpretation5'])!.value,
      interpretation6: this.editForm.get(['interpretation6'])!.value,
      aspectId: this.editForm.get(['aspectId'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<IAspect>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.goBack();
  }

  protected onSaveError(): void {}
}

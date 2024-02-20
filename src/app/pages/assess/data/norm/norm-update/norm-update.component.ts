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
import { AspectType, IAspect } from '../../aspect/aspect.model';
import { INorm, Norm } from '../norm.model';

@Component({
  selector: 'nl-norm-update',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, ReactiveFormsModule],
  templateUrl: './norm-update.component.html',
  styleUrls: ['./norm-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NormUpdateComponent {
  spinnerName = 'norm-edit';
  private spinner = inject(NgxSpinnerService);
  private crudService: CRUDService = inject(CRUDService);
  private fb = inject(FormBuilder);
  private cdRef = inject(ChangeDetectorRef);
  norm!: INorm;
  aspectTraits$: Observable<IAspect[]>;
  aspects$: Observable<IAspect[]>;

  @Input()
  set id(id: string) {
    if (id) {
      this.spinner.show(this.spinnerName);
      this.crudService.find<INorm>(API_URL.norms, id).subscribe({
        next: resp => {
          if (resp) {
            this.norm = resp;
            this.editForm = this.getEditForm(this.norm);
            this.spinner.hide(this.spinnerName);
            this.cdRef.markForCheck();
          }
        },
        complete: () => this.spinner.hide(this.spinnerName),
      });
    } else {
      this.editForm = this.getEditForm(<INorm>{});
    }
  }

  editForm!: FormGroup;

  constructor() {
    this.aspectTraits$ = this.crudService.query<IAspect[]>(API_URL.aspects);
    this.aspects$ = this.crudService.query<IAspect[]>(API_URL.aspects, {
      'type.equals': AspectType.TRAIT,
    });
  }

  private getEditForm(norm: INorm) {
    return this.fb.group({
      id: [norm.id],
      stanine: [norm.stanine, [Validators.required]],
      percentile: [norm.percentile, [Validators.required]],
      grade: [norm.grade, [Validators.maxLength(50)]],
      aspectId: [norm.aspectId, [Validators.maxLength(75)]],
      traitId: [norm.traitId, [Validators.required]],
      value: [norm.value, [Validators.required]],
      color: [],
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
      const norm = this.createFromForm();
      if (norm.id !== undefined) {
        this.subscribeToSaveResponse(this.crudService.update(API_URL.norms, norm));
      } else {
        this.subscribeToSaveResponse(this.crudService.create(API_URL.norms, norm));
      }
    }
  }

  private createFromForm(): INorm {
    return {
      ...new Norm(),
      id: this.editForm.get(['id'])!.value || undefined,
      stanine: this.editForm.get(['stanine'])!.value,
      percentile: this.editForm.get(['percentile'])!.value,
      grade: this.editForm.get(['grade'])!.value,
      aspectId: this.editForm.get(['aspectId'])!.value,
      traitId: this.editForm.get(['traitId'])!.value,
      value: this.editForm.get(['value'])!.value,
      color: this.editForm.get(['color'])!.value || '',
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

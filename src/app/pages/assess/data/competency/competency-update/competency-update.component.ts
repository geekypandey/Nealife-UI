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
import { Competency, ICompetency } from '../competency.model';

@Component({
  selector: 'nl-competency-update',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, ReactiveFormsModule],
  templateUrl: './competency-update.component.html',
  styleUrls: ['./competency-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompetencyUpdateComponent {
  spinnerName = 'competency-edit';
  private spinner = inject(NgxSpinnerService);
  private crudService: CRUDService = inject(CRUDService);
  private fb = inject(FormBuilder);
  private cdRef = inject(ChangeDetectorRef);
  competency!: ICompetency;

  @Input()
  set id(id: string) {
    if (id) {
      this.spinner.show(this.spinnerName);
      this.crudService.find<ICompetency>(API_URL.competencies, id).subscribe({
        next: resp => {
          if (resp) {
            this.competency = resp;
            this.editForm = this.getEditForm(this.competency);
            this.spinner.hide(this.spinnerName);
            this.cdRef.markForCheck();
          }
        },
        complete: () => this.spinner.hide(this.spinnerName),
      });
    } else {
      this.editForm = this.getEditForm(<ICompetency>{});
    }
  }

  editForm!: FormGroup;

  constructor() {}

  private getEditForm(competency: ICompetency) {
    return this.fb.group({
      id: [competency.id],
      name: [competency.name, [Validators.required, Validators.maxLength(75)]],
      description: [competency.description, [Validators.maxLength(1000)]],
    });
  }

  goBack() {
    window.history.back();
  }

  save() {
    if (this.editForm.valid) {
      const competency = this.createFromForm();
      if (competency.id !== undefined) {
        this.subscribeToSaveResponse(this.crudService.update(API_URL.competencies, competency));
      } else {
        this.subscribeToSaveResponse(this.crudService.create(API_URL.competencies, competency));
      }
    } else {
      // this.hasErrorAfterSubmitted = true;
    }
  }

  private createFromForm(): ICompetency {
    return {
      ...new Competency(),
      id: this.editForm.get(['id'])!.value || undefined,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<ICompetency>): void {
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

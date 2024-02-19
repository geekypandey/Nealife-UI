import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DropdownModule } from 'primeng/dropdown';
import { Observable } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { API_URL } from 'src/app/constants/api-url.constants';
import { CRUDService } from '../../../services/crud.service';
import { Aspect, IAspect } from '../aspect.model';

@Component({
  selector: 'nl-aspect-update',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, ReactiveFormsModule, DropdownModule, TranslateModule],
  templateUrl: './aspect-update.component.html',
  styleUrls: ['./aspect-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AspectUpdateComponent {
  spinnerName = 'aspect-edit';
  private spinner = inject(NgxSpinnerService);
  private crudService: CRUDService = inject(CRUDService);
  private fb = inject(FormBuilder);
  private cdRef = inject(ChangeDetectorRef);
  aspects!: IAspect;
  aspectOptions$: Observable<IAspect[]>;

  @Input()
  set id(id: string) {
    if (id) {
      this.spinner.show(this.spinnerName);
      this.crudService.find<IAspect>(API_URL.aspects, id).subscribe({
        next: resp => {
          if (resp) {
            this.aspects = resp;
            this.editForm = this.getEditForm(this.aspects);
            this.spinner.hide(this.spinnerName);
            this.cdRef.markForCheck();
          }
        },
        complete: () => this.spinner.hide(this.spinnerName),
      });
    } else {
      this.editForm = this.getEditForm(<IAspect>{});
    }
  }

  editForm!: FormGroup;

  constructor() {
    this.aspectOptions$ = this.crudService.query<IAspect[]>(API_URL.aspects);
  }

  private getEditForm(aspect: IAspect) {
    return this.fb.group({
      id: [aspect.id],
      name: [aspect.name, [Validators.required, Validators.maxLength(75)]],
      description: [aspect.description, [Validators.maxLength(1000)]],
      type: [aspect.type],
      interpretationsId: [aspect.interpretationsId],
      parentId: [aspect.parentId],
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
      const aspect = this.createFromForm();
      if (aspect.id !== undefined) {
        this.subscribeToSaveResponse(this.crudService.update(API_URL.aspects, aspect));
      } else {
        this.subscribeToSaveResponse(this.crudService.create(API_URL.aspects, aspect));
      }
    }
  }

  private createFromForm(): IAspect {
    return {
      ...new Aspect(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      description: this.editForm.get(['description'])!.value,
      type: this.editForm.get(['type'])!.value,
      interpretationsId: this.editForm.get(['interpretationsId'])!.value,
      parentId: this.editForm.get(['parentId'])!.value,
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

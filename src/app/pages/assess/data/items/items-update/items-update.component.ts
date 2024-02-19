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
import { IItem, Item } from '../items.model';

@Component({
  selector: 'nl-items-update',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, ReactiveFormsModule],
  templateUrl: './items-update.component.html',
  styleUrls: ['./items-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsUpdateComponent {
  spinnerName = 'items-edit';
  private spinner = inject(NgxSpinnerService);
  private crudService: CRUDService = inject(CRUDService);
  private fb = inject(FormBuilder);
  private cdRef = inject(ChangeDetectorRef);
  items!: IItem;

  @Input()
  set id(id: string) {
    if (id) {
      this.spinner.show(this.spinnerName);
      this.crudService.find<IItem>(API_URL.items, id).subscribe({
        next: resp => {
          if (resp) {
            this.items = resp;
            this.editForm = this.getEditForm(this.items);
            this.spinner.hide(this.spinnerName);
            this.cdRef.markForCheck();
          }
        },
        complete: () => this.spinner.hide(this.spinnerName),
      });
    } else {
      this.editForm = this.getEditForm(<IItem>{});
    }
  }

  editForm!: FormGroup;

  private getEditForm(item: IItem) {
    return this.fb.group({
      id: [item.id],
      key: [item.key, [Validators.required, Validators.maxLength(25)]],
      question: [item.question, [Validators.required, Validators.maxLength(1000)]],
      fiHigh: [item.fiHigh, [Validators.maxLength(1000)]],
      fiAboveAverage: [item.fiAboveAverage, [Validators.maxLength(1000)]],
      fiAverage: [item.fiAverage, [Validators.maxLength(1000)]],
      fiBelowAverage: [item.fiBelowAverage, [Validators.maxLength(1000)]],
      fiLow: [item.fiLow, [Validators.maxLength(1000)]],
      choices: [item.choices, [Validators.maxLength(1000)]],
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
      const item = this.createFromForm();
      if (item.id !== undefined) {
        this.subscribeToSaveResponse(this.crudService.update(API_URL.items, item));
      } else {
        this.subscribeToSaveResponse(this.crudService.create(API_URL.items, item));
      }
    }
  }

  private createFromForm(): IItem {
    return {
      ...new Item(),
      id: this.editForm.get(['id'])!.value || undefined,
      key: this.editForm.get(['key'])!.value,
      question: this.editForm.get(['question'])!.value,
      fiHigh: this.editForm.get(['fiHigh'])!.value,
      fiAboveAverage: this.editForm.get(['fiAboveAverage'])!.value,
      fiAverage: this.editForm.get(['fiAverage'])!.value,
      fiBelowAverage: this.editForm.get(['fiBelowAverage'])!.value,
      fiLow: this.editForm.get(['fiLow'])!.value,
      choices: this.editForm.get(['choices'])!.value,
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

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
import { IItem } from '../../items/items.model';
import { IResponseOption, ResponseOption } from '../response-option.model';

@Component({
  selector: 'nl-response-option-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './response-option-update.component.html',
  styleUrls: ['./response-option-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResponseOptionUpdateComponent {
  spinnerName = 'response-option-edit';
  private spinner = inject(NgxSpinnerService);
  private crudService: CRUDService = inject(CRUDService);
  private fb = inject(FormBuilder);
  private cdRef = inject(ChangeDetectorRef);
  responseOption!: IResponseOption;

  @Input()
  set id(id: string) {
    if (id) {
      this.spinner.show(this.spinnerName);
      this.crudService.find<IItem>(API_URL.responseOptions, id).subscribe({
        next: resp => {
          if (resp) {
            this.responseOption = resp;
            this.editForm = this.getEditForm(this.responseOption);
            this.spinner.hide(this.spinnerName);
            this.cdRef.markForCheck();
          }
        },
        complete: () => this.spinner.hide(this.spinnerName),
      });
    } else {
      this.editForm = this.getEditForm(<IResponseOption>{});
    }
  }

  editForm!: FormGroup;

  private getEditForm(responseOption: IResponseOption) {
    return this.fb.group({
      id: [responseOption.id],
      responseOption: [
        responseOption.responseOption,
        [Validators.required, Validators.maxLength(75)],
      ],
      choices: [responseOption.choices, [Validators.maxLength(1000)]],
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
      const responseOption = this.createFromForm();
      if (responseOption.id !== undefined) {
        this.subscribeToSaveResponse(
          this.crudService.update(API_URL.responseOptions, responseOption)
        );
      } else {
        this.subscribeToSaveResponse(
          this.crudService.create(API_URL.responseOptions, responseOption)
        );
      }
    }
  }

  private createFromForm(): IResponseOption {
    return {
      ...new ResponseOption(),
      id: this.editForm.get(['id'])!.value || undefined,
      responseOption: this.editForm.get(['responseOption'])!.value,
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

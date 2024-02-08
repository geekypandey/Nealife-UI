import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { ILookup, Lookup } from '../../assess.model';
import { AssessService } from '../../services/assess.service';

@Component({
  selector: 'nl-lookup-update',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, ReactiveFormsModule],
  templateUrl: './lookup-update.component.html',
  styleUrls: ['./lookup-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LookupUpdateComponent {
  spinnerName = 'lookup-edit';
  private spinner = inject(NgxSpinnerService);
  private fb = inject(FormBuilder);
  private cdRef = inject(ChangeDetectorRef);
  private assessService = inject(AssessService);

  editForm = this.fb.group<any>({
    id: [],
    type: [null, [Validators.required, Validators.maxLength(30)]],
    subType: [null, [Validators.maxLength(30)]],
    key: [null, [Validators.required, Validators.maxLength(30)]],
    value: [null, [Validators.required, Validators.maxLength(100)]],
  });

  private _lookup!: ILookup;
  @Input()
  set lookup(value: ILookup) {
    if (value) {
      this._lookup = value;
      this.updateForm(value);
    }
  }
  get lookup() {
    return this._lookup;
  }

  private updateForm(lookup: ILookup): void {
    this.editForm.patchValue({
      id: lookup.id,
      type: lookup.type,
      subType: lookup.subType,
      key: lookup.key,
      value: lookup.value,
    });
  }

  goBack() {
    window.history.back();
  }

  save(): void {
    if (this.editForm.valid) {
      const lookup = this.createFromForm();
      if (lookup.id !== undefined) {
        this.subscribeToSaveResponse(this.assessService.update(lookup));
      } else {
        this.subscribeToSaveResponse(this.assessService.create(lookup));
      }
    } else {
      // this.hasErrorAfterSubmitted = true;
    }
  }

  private createFromForm(): ILookup {
    return {
      ...new Lookup(),
      id: this.editForm.get(['id'])!.value,
      type: this.editForm.get(['type'])!.value,
      subType: this.editForm.get(['subType'])!.value,
      key: this.editForm.get(['key'])!.value,
      value: this.editForm.get(['value'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<ILookup>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.goBack();
  }

  protected onSaveError(): void {
    console.error('Failed to edit');
  }
}

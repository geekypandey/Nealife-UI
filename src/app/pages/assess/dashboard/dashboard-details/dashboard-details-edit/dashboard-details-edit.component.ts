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
import { Observable, finalize, tap } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { API_URL } from 'src/app/constants/api-url.constants';
import { ShowErrorMsgDirective } from 'src/app/directives/show-error-msg.directive';
import { markFormGroupDirty } from 'src/app/util/util';
import { CRUDService } from '../../../services/crud.service';
import { AssessNotification } from '../../dashboard.model';

@Component({
  selector: 'nl-dashboard-details-edit',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, ReactiveFormsModule, ShowErrorMsgDirective],
  templateUrl: './dashboard-details-edit.component.html',
  styleUrls: ['./dashboard-details-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardDetailsEditComponent {
  @Input()
  id!: string;

  private crudService = inject(CRUDService);
  private spinner = inject(NgxSpinnerService);
  private fb = inject(FormBuilder);
  private cdRef = inject(ChangeDetectorRef);
  notification$!: Observable<any>;
  spinnerName = 'dashboard-details-edit';
  editForm!: FormGroup;
  invalidEmail: boolean = false;
  notification!: AssessNotification;

  ngOnInit() {
    this.spinner.show(this.spinnerName);
    this.notification$ = this.crudService
      .find<AssessNotification>(API_URL.notifications, this.id)
      .pipe(
        tap({
          next: resp => {
            if (resp) {
              this.notification = resp;
              this.editForm = this.getEditForm(resp);
              this.cdRef.markForCheck();
            }
          },
        }),
        finalize(() => this.spinner.hide(this.spinnerName))
      );
  }

  save() {
    if (this.editForm.valid) {
      const form = this.createFromForm(this.notification);
      const resultId = this.editForm.get('id');
      this.spinner.show(this.spinnerName);
      if (!!resultId) {
        this.subscribeToSaveResponse(this.crudService.update<any>(API_URL.notifications, form));
      } else {
        // this.subscribeToSaveResponse(this.companyService.createCompany(uploadData));
      }
    } else {
      markFormGroupDirty(this.editForm);
      this.editForm.updateValueAndValidity();
    }
  }

  private createFromForm(notification: AssessNotification): any {
    return <AssessNotification>{
      ...notification,
      fileName: notification.fileName || '',
      id: this.editForm.get(['id'])?.value || undefined,
      userName: this.editForm.get(['userName'])?.value,
      contactNumber: this.editForm.get(['contactNumber'])?.value,
    };
  }

  private subscribeToSaveResponse(result: Observable<any>): void {
    result.subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.spinner.hide(this.spinnerName);
    this.goBack();
  }

  protected onSaveError(): void {
    this.spinner.hide(this.spinnerName);
    console.error('error while save');
  }

  getEditForm(result: AssessNotification) {
    return this.fb.group({
      id: [result.id],
      userName: [
        result.userName || '',
        [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')],
      ],
      contactNumber: [
        result.contactNumber,
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
    });
  }

  goBack() {
    window.history.back();
  }
}

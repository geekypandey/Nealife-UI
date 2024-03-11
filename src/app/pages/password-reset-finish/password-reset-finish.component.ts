import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
// import { MessagesModule } from 'primeng/messages';
import { PasswordModule } from 'primeng/password';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { API_URL } from 'src/app/constants/api-url.constants';

@Component({
  selector: 'nl-password-reset-finish',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PasswordModule, RouterLink, SpinnerComponent],
  templateUrl: './password-reset-finish.component.html',
  styleUrls: ['./password-reset-finish.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordResetFinishComponent {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private fb: FormBuilder = inject(FormBuilder);
  private httpClient = inject(HttpClient);
  private messageService: MessageService = inject(MessageService);
  private cd = inject(ChangeDetectorRef);
  private spinner = inject(NgxSpinnerService);

  success = false;
  key = '';

  passwordForm = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
  });

  ngOnInit() {
    this.key = this.route.snapshot.queryParams['key'];
  }

  finishReset(): void {
    const newPassword = this.passwordForm.get(['newPassword'])!.value;
    const confirmPassword = this.passwordForm.get(['confirmPassword'])!.value;
    if (newPassword !== confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'The password and its confirmation do not match!',
      });
    } else {
      this.spinner.show();
      this.httpClient.post(API_URL.resetPasswordFinish, { key: this.key, newPassword }).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Your password has been reset.',
          });
          this.success = true;
          this.spinner.hide();
          this.cd.markForCheck();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Your password couldn't be reset. Remember a password request is only valid for 24 hours.`,
          });
          this.spinner.hide();
        },
      });
    }
  }

  get newPassword() {
    return this.passwordForm.get('newPassword') as FormControl;
  }
  get confirmPassword() {
    return this.passwordForm.get('confirmPassword') as FormControl;
  }
}

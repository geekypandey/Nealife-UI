import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'nl-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent {
  success = false;

  private authenticationService = inject(AuthenticationService);
  private spinner = inject(NgxSpinnerService);
  private cdRef = inject(ChangeDetectorRef);

  forgotPasswordForm: FormGroup = new FormGroup({
    email: new FormControl(null, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(254),
      Validators.email,
    ]),
  });

  onSubmit() {
    this.spinner.show();
    this.authenticationService.resetPassword(this.email.value).subscribe({
      next: _ => {
        this.success = true;
        this.spinner.hide();
        this.cdRef.markForCheck();
      },
      error: () => this.spinner.hide(),
    });
  }

  get email() {
    return this.forgotPasswordForm.get('email') as FormControl;
  }
}

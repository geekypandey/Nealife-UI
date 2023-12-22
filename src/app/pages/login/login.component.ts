import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CheckboxModule } from 'primeng/checkbox';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'nl-login',
  standalone: true,
  imports: [CommonModule, CheckboxModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  loginForm: FormGroup;

  private fb = inject(FormBuilder);
  private authenticationService = inject(AuthenticationService);
  private router = inject(Router);
  private spinner = inject(NgxSpinnerService);

  constructor() {
    this.loginForm = this.fb.nonNullable.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
      isChecked: [null, Validators.requiredTrue],
    });
  }

  onSubmit() {
    const request = {
      username: this.username.value,
      password: this.password.value,
      rememberMe: false,
    };
    this.spinner.show();
    this.authenticationService.authenticate(request).subscribe({
      next: _ => {
        this.router.navigate(['/dashboard']).then(() => this.spinner.hide());
      },
      error: () => this.spinner.hide(),
    });
  }

  get username() {
    return this.loginForm.get('username') as FormControl;
  }

  get password() {
    return this.loginForm.get('password') as FormControl;
  }

  get isChecked() {
    return this.loginForm.get('isChecked') as FormControl;
  }
}

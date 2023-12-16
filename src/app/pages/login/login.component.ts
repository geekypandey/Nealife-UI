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
import { CheckboxModule } from 'primeng/checkbox';
import { switchMap } from 'rxjs';
import { LoginService } from './login.service';

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
  private loginService = inject(LoginService);
  private router = inject(Router);

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
    this.loginService
      .authenticate(request)
      .pipe(switchMap(() => this.loginService.getLoggedInUser()))
      .subscribe(resp => {
        this.router.navigate(['/dashboard']);
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

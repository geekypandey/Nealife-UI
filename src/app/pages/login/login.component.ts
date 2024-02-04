import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CheckboxModule } from 'primeng/checkbox';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NavigationService } from 'src/app/services/navigation.service';

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
  private activatedRoute = inject(ActivatedRoute);
  private spinner = inject(NgxSpinnerService);
  private redirectUrl: string | null;
  private navigationService = inject(NavigationService);

  constructor() {
    this.loginForm = this.fb.nonNullable.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
      isChecked: [null, Validators.requiredTrue],
    });
    this.redirectUrl = this.activatedRoute.snapshot.queryParamMap.get('redirectUrl');
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
        if (this.redirectUrl) {
          this.router.navigate([this.redirectUrl]).then(() => this.spinner.hide());
        } else {
          this.router.navigate([this.navigationService.baseRoute]).then(() => this.spinner.hide());
        }
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

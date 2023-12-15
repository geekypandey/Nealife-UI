import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { LoginService } from './login.service';

@Component({
  selector: 'nl-login',
  standalone: true,
  imports: [CommonModule,CheckboxModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private loginService = inject(LoginService);

  submit(user:string, pass:string) {

    this.loginService.authenticate().subscribe(resp=>{
      console.log(resp)
    })
  }
}

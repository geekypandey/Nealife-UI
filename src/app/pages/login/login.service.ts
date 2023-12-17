import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { API_URL } from 'src/app/constants/api-url.constants';
import { TokenService } from 'src/app/services/token.service';
import { Login, LoginResponse } from './login.model';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);

  authenticate(req: Login) {
    return this.http
      .post<LoginResponse>(API_URL.login, req)
      .pipe(tap(resp => this.tokenService.setApiKey(resp.id_token)));
  }
}

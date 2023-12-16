import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { API_URL } from 'src/app/constants/api-url.constants';
import { AuthService } from 'src/app/services/auth.service';
import { Login, LoginResponse } from './login.model';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  authenticate(req: Login) {
    return this.http
      .post<LoginResponse>(API_URL.login, req)
      .pipe(tap(resp => this.authService.setToken(resp.id_token)));
  }

  getLoggedInUser() {
    return this.http.get(API_URL.getLoggedInUser);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { API_URL } from 'src/app/constants/api-url.constants';
import { TokenService } from 'src/app/services/token.service';
import { ProfileService } from '../pages/assess/services/profile.service';
import { Login, LoginResponse } from '../pages/login/login.model';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private profileService = inject(ProfileService);
  private router = inject(Router);

  authenticate(req: Login) {
    return this.http
      .post<LoginResponse>(API_URL.login, req)
      .pipe(tap(resp => this.tokenService.setApiKey(resp.id_token)));
  }

  logout() {
    this.tokenService.setApiKey('');
    localStorage.clear();
    this.profileService.setAccount(null);
    this.profileService.setProfile(null);
    this.router.navigate(['/login']);
  }

  resetPassword(emailId: string) {
    return this.http.post(API_URL.resetPassword, emailId);
  }
}

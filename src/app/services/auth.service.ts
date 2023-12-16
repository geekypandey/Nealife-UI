import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authToken: string | null = null;

  setToken(authToken: string) {
    this.authToken = authToken;
  }

  get token() {
    return this.authToken;
  }
}

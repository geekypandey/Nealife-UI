import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private token: string | null = null;
  private readonly tokenKey: string = 'token';

  constructor() {
    const token = localStorage.getItem(this.tokenKey);
    if (!!token) {
      this.setApiKey(token);
    }
  }

  setApiKey(token: string) {
    localStorage.setItem(this.tokenKey, token);
    this.token = token;
  }

  get tokenValue() {
    return this.token;
  }
}

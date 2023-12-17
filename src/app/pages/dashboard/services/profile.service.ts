import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { API_URL } from 'src/app/constants/api-url.constants';
import { Account, Profile } from '../dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient);
  private profileData!: Profile;
  private accountData!: Account;

  constructor() {}

  setProfile(profile: Profile) {
    this.profileData = profile;
  }

  setAccount(account: Account) {
    this.accountData = account;
  }

  getLoggedInUser() {
    return this.http.get<Profile>(API_URL.getLoggedInUser).pipe(tap(resp => this.setProfile(resp)));
  }

  getAccount() {
    return this.http.get<Account>(API_URL.account).pipe(tap(resp => this.setAccount(resp)));
  }

  get profile() {
    return this.profileData;
  }
  get account() {
    return this.accountData;
  }
}

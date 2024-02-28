import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { API_URL } from 'src/app/constants/api-url.constants';
import { Authority } from 'src/app/constants/authority.constants';
import { Account, Profile } from '../assess.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient);
  private accountData!: Account | null;
  private profileData!: Profile | null;

  constructor() {}

  setAccount(account: Account | null) {
    this.accountData = account;
  }

  getAccount() {
    if (!this.accountData) {
      return this.fetchAccount();
    }
    return of(this.accountData);
  }

  private fetchAccount() {
    return this.http.get<Account>(API_URL.account).pipe(
      tap(account => {
        this.setAccount(account);
      })
    );
  }

  setProfile(profile: Profile | null) {
    this.profileData = profile;
  }

  getProfile() {
    if (!this.profileData) {
      return this.fetchProfile();
    }
    return of(this.profileData);
  }

  private fetchProfile() {
    return this.http.get<Profile>(API_URL.getLoggedInUser).pipe(
      tap(profile => {
        this.setProfile(profile);
      })
    );
  }

  isAuthorized(routeAuthorities: string[] = []): Observable<boolean> {
    return this.getAccount().pipe(
      filter((account): account is Account => !!account),
      map(account => {
        return account ? account.authorities.some(auth => routeAuthorities.includes(auth)) : false;
      })
    );
  }

  isAdminRole(account: Account): string {
    if (
      account.authorities.includes(Authority.ADMIN) ||
      account.authorities.includes(Authority.ACCOUNT_ADMIN) ||
      account.authorities.includes(Authority.NEA_ADMIN) ||
      account.authorities.includes(Authority.SUPER_ADMIN)
    ) {
      return Authority.ADMIN;
    }
    return Authority.USER;
  }
}

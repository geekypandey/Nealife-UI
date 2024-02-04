import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { shareReplay, tap } from 'rxjs/operators';
import { API_URL } from 'src/app/constants/api-url.constants';
import { Authority } from 'src/app/constants/authority.constants';
import { Account, Profile } from '../assess.model';

@Injectable()
export class ProfileService {
  private http = inject(HttpClient);
  private profileData!: Profile;
  private accountData!: Account;
  account$ = this.http.get<Account>(API_URL.account).pipe(
    tap(resp => this.setAccount(resp)),
    shareReplay()
  );
  profile$ = this.http.get<Profile>(API_URL.getLoggedInUser).pipe(
    tap(resp => this.setProfile(resp)),
    shareReplay()
  );

  constructor() {}

  setProfile(profile: Profile) {
    this.profileData = profile;
  }

  setAccount(account: Account) {
    this.accountData = account;
  }

  getLoggedInUser() {
    return this.profile$;
  }

  getAccount() {
    return this.account$;
  }

  isAdminRole(): string {
    if (
      this.accountData?.authorities.includes(Authority.ADMIN) ||
      this.accountData?.authorities.includes(Authority.ACCOUNT_ADMIN) ||
      this.accountData?.authorities.includes(Authority.NEA_ADMIN) ||
      this.accountData?.authorities.includes(Authority.SUPER_ADMIN)
    ) {
      return Authority.ADMIN;
    }
    return Authority.USER;
  }

  get profile() {
    return this.profileData;
  }
  get account() {
    return this.accountData;
  }
}

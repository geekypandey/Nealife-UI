import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { map } from 'rxjs';
import { ProfileService } from '../pages/assess/services/profile.service';

export const authGuard: CanActivateFn = (route, state) => {
  const routeAuthorities = route.data['authorities'];
  // const router = inject(Router);
  // const profile = inject(HttpClient);
  const profile = inject(ProfileService);
  // const redirectUrl = state.url;
  // return this.http.get<Account>(API_URL.account)
  return profile.isAuthorized(routeAuthorities).pipe(
    map(authorized => {
      if (authorized) {
        return true;
      }
      console.error('Access denied ', state.url);
      return false;
    })
  );
};

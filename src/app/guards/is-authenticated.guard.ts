import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';

export const isAuthenticatedGuard: CanActivateFn = (next, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const redirectUrl = state.url;
  console.info(redirectUrl);
  if (!!tokenService.tokenValue) {
    return true;
  }
  return router.navigate(['/login'], { queryParams: { redirectUrl } });
};

export const isNotAuthenticatedGuard: CanActivateFn = (next, state) => {
  const tokenService = inject(TokenService);

  const router = inject(Router);
  if (!!tokenService.tokenValue) {
    return router.navigate(['/assess']);
  }
  return true;
};

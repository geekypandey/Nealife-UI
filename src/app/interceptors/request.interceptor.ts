import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { BASE_URL } from '../constants/api-url.constants';
import { TokenService } from '../services/token.service';

export function RequestInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
  const tokenService = inject(TokenService);
  // pdf
  if (!(BASE_URL && request.url.startsWith(BASE_URL))) {
    return next(request);
  }
  if (tokenService.tokenValue) {
    const clonedRequest = request.clone({
      setHeaders: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + tokenService.tokenValue,
      },
    });
    return next(clonedRequest);
  }
  return next(request);
}

import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

export function AuthorizationInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
  const tokenService = inject(TokenService);
  if (tokenService.tokenValue) {
    const clonedRequest = request.clone({
      setHeaders: {
        Authorization: 'Bearer ' + tokenService.tokenValue,
      },
    });
    return next(clonedRequest);
  } else {
    return next(request);
  }
}

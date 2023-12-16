import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export function AuthorizationInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
  const authService = inject(AuthService);
  if (authService.token) {
    const clonedRequest = request.clone({
      setHeaders: {
        Authorization: 'Bearer ' + authService.token,
      },
    });
    return next(clonedRequest);
  } else {
    return next(request);
  }
}

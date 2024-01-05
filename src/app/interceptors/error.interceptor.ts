import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TokenService } from '../services/token.service';

export function ErrorInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
  const tokenService = inject(TokenService);
  const toastService = inject(MessageService);
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === HttpStatusCode.Unauthorized) {
        localStorage.clear();
        tokenService.setApiKey('');
        toastService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Session Expired !!',
          sticky: true,
          id: 'sessionExpired',
        });
      }
      if (error.status === HttpStatusCode.BadGateway) {
        toastService.add({
          severity: 'error',
          summary: 'Error',
          detail: '502 Bad Gateway. Please contact administrator.',
          sticky: true,
          id: 'badGateway',
        });
      }
      return throwError(() => error);
    })
  );
}

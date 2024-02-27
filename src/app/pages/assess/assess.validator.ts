import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, map, of } from 'rxjs';
import { CompanyService } from './company/company.service';

@Injectable()
export class CustomAsyncValidators {
  private toastService = inject(MessageService);
  private companyService = inject(CompanyService);

  checkNameExists(value: string) {
    return this.companyService.checkNameExists(value).pipe(
      map(resp => {
        this.toastService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Account name available !!',
          sticky: false,
          id: 'emailId-validation',
        });
        return null;
      }),
      catchError(() => {
        this.toastService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Account name already in use,try a different name',
          sticky: false,
          id: 'emailId-validation',
        });
        return of({ nonUnique: true });
      })
    );
  }

  checkEmailExists(value: string) {
    return this.companyService.checkEmailExists(value).pipe(
      map(resp => {
        this.toastService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Email address available !!',
          sticky: false,
          id: 'emailId-validation',
        });
        return null;
      }),
      catchError(() => {
        this.toastService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Invalid email or Email already in use,try with different email address',
          sticky: false,
          id: 'emailId-validation',
        });
        return of({ nonUnique: true });
      })
    );
  }
}

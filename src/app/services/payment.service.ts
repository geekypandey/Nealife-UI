import { HttpClient } from '@angular/common/http';
import { Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../constants/api-url.constants';

export const WINDOW = new InjectionToken<any>('Global window object', {
  factory: () => window,
});

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(protected http: HttpClient) {}

  createRazorPayOrder(payload: any): Observable<{}> {
    return this.http.post(API_URL.createOrder, payload);
  }

  verifyRazorPayOrder(payload: any): Observable<any> {
    return this.http.post(API_URL.verifyOrder, payload);
  }
}

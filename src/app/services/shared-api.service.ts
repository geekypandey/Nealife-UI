import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '../constants/api-url.constants';
import { LookupResponse } from '../models/common.model';

@Injectable({
  providedIn: 'root',
})
export class SharedApiService {
  private http = inject(HttpClient);

  lookup(type: string) {
    const query = {
      'type.equals': type,
    };
    return this.http.get<LookupResponse[]>(API_URL.lookup, {
      params: query,
    });
  }
}

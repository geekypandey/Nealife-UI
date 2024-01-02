import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { API_URL } from '../constants/api-url.constants';
import { LookupResponse } from '../models/common.model';
import { getDropdownOptions } from '../util/util';

@Injectable({
  providedIn: 'root',
})
export class SharedApiService {
  private http = inject(HttpClient);

  lookup(type: string) {
    const query = {
      'type.equals': type,
    };
    return this.http
      .get<LookupResponse[]>(API_URL.lookup, {
        params: query,
      })
      .pipe(map(res => getDropdownOptions(res, 'key', 'id')));
  }
}

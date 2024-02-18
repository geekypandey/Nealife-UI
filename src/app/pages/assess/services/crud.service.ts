import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from 'src/app/constants/api-url.constants';
import { createRequestOption } from '../assess.util';

@Injectable({
  providedIn: 'root',
})
export class CRUDService {
  private http = inject(HttpClient);

  create<T>(url: string, payload: T) {
    return this.http.post<T>(url, payload);
  }

  update<T>(url: string, payload: T) {
    return this.http.put<T>(url, payload);
  }

  find<T>(url: string, id: string) {
    return this.http.get<T>(`${url}/${id}`);
  }

  query<T>(url: string, req?: any) {
    const options = createRequestOption(req);
    return this.http.get<T>(url, {
      params: options,
    });
  }

  delete(id: any) {
    return this.http.delete(`${API_URL.applicationUserAssessment}/${id}`);
  }

  downloadReport(url: string) {
    return this.http.get(url, { responseType: 'blob' });
  }

  downloadHtmlReport(id: number): any {
    return this.http.post(`${API_URL.downloadHtmlReportUrl}?resultRecordId=${id}`, {
      responseType: 'blob',
    });
  }
}

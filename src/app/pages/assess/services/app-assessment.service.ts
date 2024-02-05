import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from 'src/app/constants/api-url.constants';
import { IApplicationUserAssessment } from '../assess.model';
import { createRequestOption } from '../assess.util';

@Injectable()
export class AppAssessmentService {
  private http = inject(HttpClient);

  create(applicationUserAssessment: IApplicationUserAssessment) {
    return this.http.post<IApplicationUserAssessment>(
      API_URL.applicationUserAssessment,
      applicationUserAssessment
    );
  }

  update(applicationUserAssessment: IApplicationUserAssessment) {
    return this.http.put<IApplicationUserAssessment>(
      API_URL.applicationUserAssessment,
      applicationUserAssessment
    );
  }

  find(id: number) {
    return this.http.get<IApplicationUserAssessment>(`${API_URL.applicationUserAssessment}/${id}`);
  }

  query(req?: any) {
    const options = createRequestOption(req);
    return this.http.get<IApplicationUserAssessment[]>(API_URL.applicationUserAssessment, {
      params: options,
    });
  }

  delete(id: any) {
    return this.http.delete(`${API_URL.applicationUserAssessment}/${id}`);
  }

  downloadPdfReport(url: string): any {
    return this.http.get(url, { responseType: 'blob' });
  }

  downloadHtmlReport(id: number): any {
    return this.http.post(`${API_URL.downloadHtmlReportUrl}?resultRecordId=${id}`, {
      responseType: 'blob',
    });
  }
}

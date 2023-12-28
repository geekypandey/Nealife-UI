import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from 'src/app/constants/api-url.constants';
import { RenderAssessment } from './render-assessment.model';

@Injectable({
  providedIn: 'root',
})
export class RenderAssessmentService {
  private http = inject(HttpClient);

  renderAssessment(aa: string) {
    return this.http.get<RenderAssessment>(`${API_URL.assessment}?AA=${aa}`);
  }

  checkCreditUsed(queryParamcc: string) {
    return this.http.get(`${API_URL.checkCreditCode}?creditCode=${queryParamcc}`);
  }
}

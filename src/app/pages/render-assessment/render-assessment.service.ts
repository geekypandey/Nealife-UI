import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from 'src/app/constants/api-url.constants';
import {
  AssessmentAnswer,
  PreAssessmentDetailsResponse,
  RenderAssessmentResponse,
} from './render-assessment.model';

@Injectable({
  providedIn: 'root',
})
export class RenderAssessmentService {
  private http = inject(HttpClient);

  renderAssessment(aa: string) {
    return this.http.get<RenderAssessmentResponse>(`${API_URL.assessment}?AA=${aa}`);
  }

  checkCreditUsed(queryParamcc: string) {
    return this.http.get(`${API_URL.checkCreditCode}?creditCode=${queryParamcc}`);
  }

  isCreditUsedBefore(queryParamcc: string) {
    return this.http.get<PreAssessmentDetailsResponse>(
      `${API_URL.isCreditUsedBefore}?creditCode=${queryParamcc}`
    );
  }

  assessmentCourseFit(ids: number[], params: string) {
    const payload = { branchIds: ids, AA: params };
    return this.http.post<any>(API_URL.branchAssessmentCourseFitURL, payload);
  }

  submitPersonalInfo(payload: AssessmentAnswer) {
    return this.http.post<PreAssessmentDetailsResponse>(API_URL.preAssessmentDetails, payload);
  }
}

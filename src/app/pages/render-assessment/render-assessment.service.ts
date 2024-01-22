import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from 'src/app/constants/api-url.constants';
import { PreAssessmentSectionDetailsRequest } from './assessment-stepper/assessment-section.model';
import {
  CheckCreditUsed,
  PreAssessDetailsReqPayload,
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
    return this.http.get<CheckCreditUsed>(`${API_URL.checkCreditCode}?creditCode=${queryParamcc}`);
  }

  isCreditUsedBefore(queryParamcc: string) {
    const params = new HttpParams().append('creditCode', queryParamcc);
    return this.http.get<PreAssessmentDetailsResponse>(API_URL.preAssessmentDetails, {
      params,
    });
  }

  assessmentCourseFit(ids: number[], params: string) {
    const payload = { branchIds: ids, AA: params };
    return this.http.post<any>(API_URL.branchAssessmentCourseFitURL, payload);
  }

  submitPersonalInfo(payload: PreAssessDetailsReqPayload) {
    return this.http.post<PreAssessmentDetailsResponse>(API_URL.preAssessmentDetails, payload);
  }

  submitSectionDetails(payload: PreAssessmentSectionDetailsRequest) {
    return this.http.post<PreAssessmentDetailsResponse>(
      API_URL.preAssessmentSectionDetails,
      payload
    );
  }

  submitFinalAssessment(id: number) {
    return this.http.get<PreAssessmentDetailsResponse>(`${API_URL.submitGroupResult}/${id}`);
  }
}

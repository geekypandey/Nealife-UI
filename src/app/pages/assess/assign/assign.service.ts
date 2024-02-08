import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from 'src/app/constants/api-url.constants';
import { Assessment } from '../assess.model';

@Injectable()
export class AssignService {
  private http = inject(HttpClient);

  getAssessments() {
      return this.http
          .get<Assessment[]>(API_URL.assign);
  }

  getAssessmentsForDropDown() {
    const params: any = {
      'companyId.equals': 1,
      'displayInSignup.equals': true,
    };

    return this.http
        .get<Assessment[]>(API_URL.assessmentForDropDown, {
            params: params,
        });
  }
}

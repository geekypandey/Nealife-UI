import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from 'src/app/constants/api-url.constants';

@Injectable()
export class AssignService {
  private http = inject(HttpClient);

  getAssessments() {
      return this.http
          .get<any[]>(API_URL.assign);
  }

  getAssessmentsForDropDown(formData: any) {
      return this.http
          .get<any[]>(API_URL.assessmentForDropDown);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '../../constants/api-url.constants';
import { AssessmentName } from './signup.model';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  private http = inject(HttpClient);
  constructor() {}

  getAssessmentNames() {
    return this.http.get<AssessmentName[]>(API_URL.assessmentName);
  }
}

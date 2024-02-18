import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { API_URL } from 'src/app/constants/api-url.constants';
import { Assessment } from '../assess.model';

@Injectable()
export class AssessmentService {
  private http = inject(HttpClient);

  getAssessments() {
      return this.http
          .get<Assessment[]>(API_URL.companyAssessments);
  }

  getAssessment(id: number) {
      return this.http
          .get<Assessment>(`${API_URL.companyAssessments}/${id}`);
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

    updateAssessment(assessment: Assessment) {
        return this.http.put<Assessment>(API_URL.companyAssessments, assessment)
        .pipe(map(res => this.convertDateFromServer(res)));
    }

    addAssessment(assessment: Assessment) {
        return this.http.post<Assessment>(API_URL.companyAssessments, assessment)
        .pipe(map(res => this.convertDateFromServer(res)));
    }


    private convertDateFromServer(res: any) {
        if (res.body) {
        }
        return res;
    }

    downloadCredits(companyAssessmentId: string) {
        const params = {
            'companyAssessmentId.equals': companyAssessmentId,
        }
        return this.http.get(`${API_URL.downloadCredits}?companyAssessmentId.equals=${companyAssessmentId}`, {observe: 'response', responseType: 'blob'});
    }
}

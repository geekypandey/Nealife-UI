import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { API_URL } from 'src/app/constants/api-url.constants';
import { Assessment } from '../assess.model';
import { CompanyAssessment } from '../assessment-group/assessment-group.model';

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

  getCompanyAssessment(id: number) {
      return this.http
          .get<CompanyAssessment>(`${API_URL.assignGroup}/${id}`);
  }

  getAssessmentsForDropDown(companyId: string) {
    const params: any = {
      'companyId.equals': companyId,
      'displayInSignup.equals': true,
    };

    return this.http
        .get<Assessment[]>(API_URL.assessmentForDropDown, {
            params: params,
        });
  }

  getCompanyAssessmentsForDropDown(companyId: string) {
    const params: any = {
      'companyId.equals': companyId,
      'displayInSignup.equals': true,
    };

    return this.http
        .get<Assessment[]>(API_URL.companyAssessmentForDropDown, {
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

    deleteAssessments(assessmentIds: Array<string>) {
        for (const assessmentId of assessmentIds) {
            this.deleteAssessment(assessmentId);
        }
    }

    deleteAssessment(assessmentId: string) {
        this.http.delete(`${API_URL.companyAssessments}/${assessmentId}`).subscribe({
            next: () => { },
            error: () => {}
        })
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
        return this.http.get(`${API_URL.downloadCredits}?companyAssessmentId.equals=${companyAssessmentId}`, { responseType: 'blob'});
    }

    notifyCompanyWiseUsers(companyAssessmentId: string) {
        const params = {
            'companyAssessmentId': companyAssessmentId,
            'isGroup': 'N'
        }
        return this.http.get<any>(API_URL.notifyCompanyWiseUsers, { params: params });
    }
}

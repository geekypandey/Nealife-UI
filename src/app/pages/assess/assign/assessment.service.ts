import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { API_URL } from 'src/app/constants/api-url.constants';
import { RenderAssessmentResponse } from '../../render-assessment/render-assessment.model';
import { Assessment } from '../assess.model';
import { CompanyAssessment } from '../assessment-group/assessment-group.model';

@Injectable()
export class AssessmentService {
  private http = inject(HttpClient);

  getAssessments() {
    const params = {
      page: 0,
      size: 5000,
    };
    return this.http.get<Assessment[]>(API_URL.companyAssessments, { params });
  }

  getAssessment(id: number) {
    return this.http.get<Assessment>(`${API_URL.companyAssessments}/${id}`);
  }

  getCompanyAssessmentGroup() {
    const params = {
      page: 0,
      size: 5000,
    };
    return this.http.get<CompanyAssessment[]>(`${API_URL.assignGroup}`, { params });
  }

  getCompanyAssessment(id: number) {
    return this.http.get<CompanyAssessment>(`${API_URL.assignGroup}/${id}`);
  }

  // company-assessment-groups-branch-mapping/1
  getCompanyAssessmentIfIsBranch(id: number) {
    return this.http.get<CompanyAssessment>(`${API_URL.assignGroupIfBranch}/${id}`);
  }

  getAssessmentsForDropDown(companyId: string) {
    const params: any = {
      'companyId.equals': companyId,
      'displayInSignup.equals': true,
    };

    return this.http.get<Assessment[]>(API_URL.assessmentForDropDown, {
      params: params,
    });
  }

  getCompanyAssessmentsForDropDown(companyId: string) {
    const params: any = {
      'companyId.equals': companyId,
      'displayInSignup.equals': true,
      page: 0,
      size: 5000,
    };

    return this.http.get<Assessment[]>(API_URL.companyAssessmentForDropDown, {
      params: params,
    });
  }

  updateAssessment(assessment: Assessment) {
    return this.http
      .put<Assessment>(API_URL.companyAssessments, assessment)
      .pipe(map(res => this.convertDateFromServer(res)));
  }

  addAssessment(assessment: Assessment) {
    return this.http
      .post<Assessment>(API_URL.companyAssessments, assessment)
      .pipe(map(res => this.convertDateFromServer(res)));
  }

  deleteAssessments(assessmentIds: Array<string>) {
    for (const assessmentId of assessmentIds) {
      this.deleteAssessment(assessmentId);
    }
  }

  deleteAssessment(assessmentId: string) {
    this.http.delete(`${API_URL.companyAssessments}/${assessmentId}`).subscribe({
      next: () => {},
      error: () => {},
    });
  }

  private convertDateFromServer(res: any) {
    if (res.body) {
    }
    return res;
  }

  downloadCredits(companyAssessmentId: string) {
    const params = {
      'companyAssessmentId.equals': companyAssessmentId,
    };
    return this.http.get(
      `${API_URL.downloadCredits}?companyAssessmentId.equals=${companyAssessmentId}`,
      { responseType: 'blob' }
    );
  }

  notifyCompanyWiseUsers(companyAssessmentId: string) {
    const params = {
      companyAssessmentId: companyAssessmentId,
      isGroup: 'N',
    };
    return this.http.get<any>(API_URL.notifyCompanyWiseUsers, { params: params });
  }

  public viewTestAssessment(payload: { id: string; isGroupAssessment: boolean }) {
    let url = `${API_URL.getNewAssessmentJson}?companyAssessmentId=${payload.id}`;
    if (payload.isGroupAssessment) {
      url = `${API_URL.getNewAssessmentGroupJson}?companyAssessmentGroupId=${payload.id}`;
    }
    return this.http.get<RenderAssessmentResponse>(url);
  }

  getCompanyAssessmentGroupsBranchMapping(companyId: string, assessmentGroupId: string) {
    return this.http.get<any>(
      `${API_URL.companyAssessmentGroupBranchMapping}/${companyId}/${assessmentGroupId}`
    );
  }
}

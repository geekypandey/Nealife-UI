import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Params } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_URL } from 'src/app/constants/api-url.constants';
import { DATE_FORMAT } from 'src/app/constants/assess.constants';
import {
  AccountDashboardDetails,
  CompetencyAspectItemROCount,
  ICompetencyAspectProjection,
  ILookup,
  MasterDataDetails,
  SaDashboard,
} from '../../assess/assess.model';
import { AccountDashboard } from '../assess.model';
import { AssessmentGroupDetails, IAssessment } from '../assessment-group/assessment-group.model';

@Injectable()
export class AssessService {
  private http = inject(HttpClient);

  getCompetencyAspectProjections() {
    return this.http.get<ICompetencyAspectProjection[]>(API_URL.competencyAspectProjections);
  }

  getCompetencyAspectItemROCount() {
    return this.http.get<CompetencyAspectItemROCount>(API_URL.competencyAspectItemROCount);
  }

  getAspectProjectionList(queryParams: Params) {
    return this.http.get<MasterDataDetails[]>(API_URL.getAspectProjectionListURL, {
      params: queryParams,
    });
  }

  getAccountdashboardLookup(companyId: string) {
    return this.http.get<AccountDashboard>(API_URL.accountDashboard, {
      params: {
        companyId,
      },
    });
  }

  getAccountdashboardNotificationLookup(payload: any) {
    return this.http.get<AccountDashboardDetails>(API_URL.accountDashboardDetails, {
      params: payload,
    });
  }

  getDashboard(companyId: string) {
    return this.http.get<AccountDashboard>(API_URL.dashboard, {
      params: {
        companyId,
      },
    });
  }

  getDashboardDetails(payload: any) {
    return this.http.get<SaDashboard[]>(API_URL.dashboardDetails, {
      params: payload,
    });
  }

  getDashboardAdminStats(payload: any): Observable<any> {
    return this.http.post(API_URL.dashboardAdminStats, payload);
  }

  getAssessmentsByGroup<T>(id?: any) {
    const url = id ? `${API_URL.assessmentsByGroup}/${id}` : API_URL.assessmentsByGroup;
    return this.http.get<T>(url);
  }

  getAssessmentsByGroupDetails(payload: any) {
    return this.http.get<AssessmentGroupDetails[]>(API_URL.assessmentsByGroupDetails, {
      params: payload,
    });
  }

  createGroup(assessmentGroup: IAssessment) {
    const copy = this.convertDateFromClient(assessmentGroup);
    return this.http
      .post<IAssessment>(API_URL.assessmentsByGroup, copy)
      .pipe(map(res => this.convertDateFromServer(res)));
  }

  updateAssessment(assessment: IAssessment) {
    const copy = this.convertDateFromClient(assessment);
    return this.http
      .put<IAssessment>(API_URL.assessmentsByGroup, copy)
      .pipe(map(res => this.convertDateFromServer(res)));
  }

  create(lookup: ILookup) {
    return this.http.post<ILookup>(API_URL.lookup, lookup);
  }

  update(lookup: ILookup) {
    return this.http.put<ILookup>(API_URL.lookup, lookup);
  }

  resendReport(id: string) {
    return this.http.get(API_URL.resendReport + '/' + id);
  }

  uploadMasterData(formData: FormData) {
    const headers: any = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.http.post(API_URL.uploadMasterData, formData, {
      headers,
      responseType: 'text',
      reportProgress: true,
      observe: 'events',
    });
  }

  protected convertDateFromServer(res: IAssessment) {
    if (res) {
      res.validFrom = res.validFrom ? moment(res.validFrom) : undefined;
      res.validTo = res.validTo ? moment(res.validTo) : undefined;
    }
    return res;
  }

  protected convertDateFromClient(assessment: IAssessment): IAssessment {
    const copy: IAssessment = Object.assign({}, assessment, {
      validFrom:
        assessment.validFrom && assessment.validFrom.isValid()
          ? assessment.validFrom.format(DATE_FORMAT)
          : undefined,
      validTo:
        assessment.validTo && assessment.validTo.isValid()
          ? assessment.validTo.format(DATE_FORMAT)
          : undefined,
    });
    return copy;
  }
}

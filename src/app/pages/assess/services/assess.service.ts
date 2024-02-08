import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import * as moment from 'moment';
import { map, tap } from 'rxjs/operators';
import { API_URL } from 'src/app/constants/api-url.constants';
import { DATE_FORMAT } from 'src/app/constants/assess.constants';
import {
  CompetencyAspectItemROCount,
  CompetencyAspectProjections,
  ILookup,
} from '../../assess/assess.model';
import { AccountDashboard, AccountDashboardDetails } from '../assess.model';
import { AssessmentGroupDetails, IAssessment } from '../assessment-group/assessment-group.model';

@Injectable()
export class AssessService {
  private http = inject(HttpClient);
  private compProjectionsData: CompetencyAspectProjections[] = [];

  getCompetencyAspectProjections() {
    return this.http.get<CompetencyAspectProjections[]>(API_URL.competencyAspectProjections).pipe(
      tap(resp => {
        this.compProjectionsData = resp;
      })
    );
  }

  getCompetencyAspectItemROCount() {
    return this.http.get<CompetencyAspectItemROCount>(API_URL.competencyAspectItemROCount);
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

  get compProjections() {
    return this.compProjectionsData;
  }
}

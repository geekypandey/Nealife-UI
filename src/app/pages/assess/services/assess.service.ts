import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { API_URL } from 'src/app/constants/api-url.constants';
import {
  CompetencyAspectItemROCount,
  CompetencyAspectProjections,
} from '../../assess/assess.model';
import { AccountDashboard, AccountDashboardDetails } from '../assess.model';

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

  get compProjections() {
    return this.compProjectionsData;
  }
}

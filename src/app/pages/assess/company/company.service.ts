import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { API_URL } from 'src/app/constants/api-url.constants';
import { Company, CompanyQuery } from '../../assess/assess.model';

@Injectable()
export class CompanyService {
  private http = inject(HttpClient);
  private companiesData: Company[] = [];

  getCompanies(id: string) {
    const query: CompanyQuery = {
      'id.equals': id,
      'parent.equals': id,
    };
    // const params = new HttpParams();
    // Object.keys(query).forEach(key=>{
    //   params.set(key,query[key]);
    // })
    return this.http
      .get<Company[]>(API_URL.companies, {
        params: query,
      })
      .pipe(map(resp => (this.companiesData = resp)));
  }

  getCompany(companyId: number) {
    return this.http.get<Company>(`${API_URL.companies}/${companyId}`);
  }

  createCompany(formData: any) {
    return this.http
      .post<Company>(API_URL.companies, formData)
      .pipe(map(res => this.convertDateFromServer(res)));
  }

  updateCompany(formData: any) {
    return this.http
      .put<Company>(API_URL.companies, formData)
      .pipe(map(res => this.convertDateFromServer(res)));
  }

  getAllCompanies() {
    return this.http.get<Company[]>(API_URL.companies);
  }

  private convertDateFromServer(res: any) {
    if (res.body) {
      res.body.validFrom = res.body.validFrom ? moment(res.body.validFrom) : undefined;
      res.body.validTo = res.body.validTo ? moment(res.body.validTo) : undefined;
    }
    return res;
  }

  get companies() {
    return this.companiesData;
  }
}

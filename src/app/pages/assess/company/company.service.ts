import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, shareReplay, tap } from 'rxjs/operators';
import { API_URL } from 'src/app/constants/api-url.constants';
import { Company, CompanyQuery } from '../../assess/assess.model';

@Injectable()
export class CompanyService {
  private http = inject(HttpClient);
  private companiesData: Company[] = [];
  allCompanies$ = this.http.get<Company[]>(API_URL.companies).pipe(
    tap(companies => (this.companiesData = companies)),
    shareReplay()
  );

  getCompanies(id: string) {
    const query: CompanyQuery = {
      page: '0',
      size: '5000',
      'id.equals': id,
      'parent.equals': id,
    };
    return this.http
      .get<Company[]>(API_URL.companies, {
        params: query,
      })
      .pipe(map(resp => (this.companiesData = resp)));
  }

  getCompanyById(companyId: string) {
    const params: any = {
      'parent.equals': companyId,
    };
    return this.http.get<Company[]>(API_URL.companies, {
      params: params,
    });
  }

  getCompany(companyId: number) {
    return this.http.get<Company>(`${API_URL.companies}/${companyId}`);
  }

  createCompany(formData: any) {
    return this.http.post<Company>(API_URL.companies, formData);
    // .pipe(map(res => this.convertDateFromServer(res)));
  }

  updateCompany(formData: any) {
    return this.http.put<Company>(API_URL.companies, formData);
    // .pipe(map(res => this.convertDateFromServer(res)));
  }

  deleteCompany(id: string) {
    return this.http.delete(`${API_URL.companies}/${id}`);
  }

  getAllCompanies() {
    return this.allCompanies$;
  }

  checkEmailExists(email: string) {
    return this.http.get(`${API_URL.checkEmailExists}?email=${email}`);
  }

  checkNameExists(name: string) {
    return this.http.get(`${API_URL.checkNameExists}?name=${name}`);
  }

  // private convertDateFromServer(res: any) {
  //   if (res.body) {
  //     res.body.validFrom = res.body.validFrom ? moment(res.body.validFrom) : undefined;
  //     res.body.validTo = res.body.validTo ? moment(res.body.validTo) : undefined;
  //   }
  //   return res;
  // }

  get companies() {
    return this.companiesData;
  }
}

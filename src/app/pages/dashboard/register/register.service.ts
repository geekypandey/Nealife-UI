import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { API_URL } from 'src/app/constants/api-url.constants';
import { Company, CompanyQuery } from '../dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
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

  lookup(type: string) {
    const query = {
      'type.equals': type,
    };
    return this.http.get<any[]>(API_URL.lookup, {
      params: query,
    });
  }

  get companies() {
    return this.companiesData;
  }
}

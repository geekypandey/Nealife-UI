import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize, forkJoin, map, switchMap } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { USER_ROLE } from 'src/app/constants/user-role.constants';
import { SharedApiService } from 'src/app/services/shared-api.service';
import { Company } from '../../assess.model';
import { ProfileService } from '../../services/profile.service';
import { CompanyService } from '../company.service';

@Component({
  selector: 'nl-company-detail',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyDetailComponent {
  spinnerName = 'company-detail';
  company$: Observable<Company>;

  private activatedRoute = inject(ActivatedRoute);
  private companyService = inject(CompanyService);
  private spinner = inject(NgxSpinnerService);
  private sharedApiService = inject(SharedApiService);
  profileService = inject(ProfileService);
  viewFields$: Observable<{ header: string; field: string }[]>;

  constructor() {
    this.viewFields$ = this.profileService.profile$.pipe(
      map(profile => {
        if (profile.role === USER_ROLE.SUPER_ADMIN) {
          return [
            {
              header: 'Name',
              field: 'name',
            },
            {
              header: 'Email',
              field: 'email',
            },
            {
              header: 'Phone Number',
              field: 'contactNumber1',
            },
            {
              header: 'Status',
              field: 'status',
            },
          ];
        }
        if (profile.role === USER_ROLE.ADMIN) {
          return [
            {
              header: 'Id',
              field: 'id',
            },
            {
              header: 'Name',
              field: 'name',
            },
            {
              header: 'Contact Person',
              field: 'contactPerson',
            },
            {
              header: 'Email',
              field: 'email',
            },
            {
              header: 'Contact Number',
              field: 'contactNumber1',
            },
            {
              header: 'Status',
              field: 'status',
            },
            {
              header: 'Parent',
              field: 'parentName',
            },
          ];
        }
        if (profile.role === USER_ROLE.FRANCHISE) {
          return [
            {
              header: 'Id',
              field: 'id',
            },
            {
              header: 'Name',
              field: 'name',
            },
            {
              header: 'Contact Person',
              field: 'contactPerson',
            },
            {
              header: 'Email',
              field: 'email',
            },
            {
              header: 'Contact Number',
              field: 'contactNumber1',
            },
            {
              header: 'Status',
              field: 'status',
            },
            {
              header: 'Account Type',
              field: 'companyType',
            },
            {
              header: 'Partner Type',
              field: 'partnerType',
            },
          ];
        }
        return [];
      })
    );
    const companyId = this.activatedRoute.snapshot.params['id'];
    this.spinner.show(this.spinnerName);
    this.company$ = forkJoin([
      this.sharedApiService.lookup('COMPANY_TYPE'),
      this.sharedApiService.lookup('PARTNER_TYPE'),
    ]).pipe(
      switchMap(([companyTypes, partnerTypes]) => {
        return this.companyService.getCompany(companyId).pipe(
          map(c => {
            const companyType = companyTypes.find(ct => ct.value === c.companyType)?.label;
            const partnerType = partnerTypes.find(ct => ct.value === c['partnerType'])?.label;
            return { ...c, companyType, partnerType };
          })
        );
      }),
      finalize(() => this.spinner.hide(this.spinnerName))
    );
  }

  goBack() {
    window.history.back();
  }

  get userRole() {
    return USER_ROLE;
  }
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { USER_ROLE } from 'src/app/constants/user-role.constants';
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
  profileService = inject(ProfileService);

  constructor() {
    const companyId = this.activatedRoute.snapshot.params['id'];
    this.spinner.show(this.spinnerName);
    this.company$ = this.companyService
      .getCompany(companyId)
      .pipe(finalize(() => this.spinner.hide(this.spinnerName)));
  }

  goBack() {
    window.history.back();
  }

  get userRole() {
    return USER_ROLE;
  }
}

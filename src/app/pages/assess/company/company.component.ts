import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize, switchMap } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { ACTION_ICON, Action, ColDef } from 'src/app/components/table/table.model';
import { Company } from '../../assess/assess.model';
import { ProfileService } from '../services/profile.service';
import { CompanyService } from './company.service';

@Component({
  selector: 'nl-company',
  standalone: true,
  imports: [CommonModule, RouterLink, SpinnerComponent, TableComponent],
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyComponent {
  companies$: Observable<Company[]>;
  cols: ColDef[] = [
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
  actionsList: Action[] = [];
  spinnerName = 'company-spinner';
  activatedRoute = inject(ActivatedRoute);

  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);
  private profileService = inject(ProfileService);
  private companyService = inject(CompanyService);

  constructor() {
    this.actionsList = [
      {
        icon: ACTION_ICON.EDIT,
        field: 'id',
        onClick: (value: string) => {
          this.router.navigate([value + '/edit'], {
            relativeTo: this.activatedRoute,
          });
        },
      },
    ];
    this.spinner.show(this.spinnerName);
    this.companies$ = this.profileService.profile$.pipe(
      switchMap(profile => this.companyService.getCompanies(profile.companyId)),
      finalize(() => this.spinner.hide(this.spinnerName))
    );
  }
}

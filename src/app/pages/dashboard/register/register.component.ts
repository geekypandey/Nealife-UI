import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { ACTION_ICON, Action, ColDef } from 'src/app/components/table/table.model';
import { Company } from '../dashboard.model';
import { ProfileService } from '../services/profile.service';
import { RegisterService } from './register.service';

@Component({
  selector: 'nl-register',
  standalone: true,
  imports: [CommonModule, TableComponent, SpinnerComponent, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
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

  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private profileService = inject(ProfileService);
  private registerService = inject(RegisterService);

  constructor() {
    this.actionsList = [
      {
        icon: ACTION_ICON.EDIT,
        field: 'id',
        onClick: (value: string) => {
          this.router.navigate([value + '/edit'], {
            relativeTo: this.route,
          });
        },
      },
    ];
    this.spinner.show('register-spinner');
    this.companies$ = this.registerService
      .getCompanies(this.profileService.profile.companyId)
      .pipe(finalize(() => this.spinner.hide('register-spinner')));
  }
}

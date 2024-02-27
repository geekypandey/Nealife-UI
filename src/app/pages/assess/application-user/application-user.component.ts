import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { filter, finalize, switchMap, tap } from 'rxjs/operators';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { API_URL } from 'src/app/constants/api-url.constants';
import { Account } from '../assess.model';
import { CRUDService } from '../services/crud.service';
import { ProfileService } from '../services/profile.service';
import { ApplicationUser } from './application-user.model';

@Component({
  selector: 'nl-application-user',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, TableComponent],
  templateUrl: './application-user.component.html',
  styleUrls: ['./application-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationUserComponent {
  spinnerName = 'users-spinner';
  private spinner = inject(NgxSpinnerService);
  private crudService = inject(CRUDService);
  private profileService = inject(ProfileService);

  cols = [
    { field: 'fullName', header: 'Name' },
    { field: 'email', header: 'Email' },
    { field: 'companyName', header: 'Account' },
    { field: 'status', header: 'Status' },
    { field: 'action', header: 'Action' },
  ];
  users$: Observable<ApplicationUser[]>;

  constructor() {
    this.spinner.show(this.spinnerName);
    this.users$ = this.profileService.getAccount().pipe(
      filter((account): account is Account => !!account),
      switchMap(account => this.crudService.query<ApplicationUser[]>(API_URL.applicationUsers)),
      tap({
        next: resp => {},
      }),
      finalize(() => this.spinner.hide(this.spinnerName))
    );
  }
}

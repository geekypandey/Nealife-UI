import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { USER_ROLE } from 'src/app/constants/user-role.constants';
import { ProfileService } from '../../services/profile.service';
import { CompanyEditAdminComponent } from './company-edit-admin/company-edit-admin.component';
import { CompanyEditFranchiseComponent } from './company-edit-franchise/company-edit-franchise.component';
import { CompanyEditSuperadminComponent } from './company-edit-superadmin/company-edit-superadmin.component';

@Component({
  selector: 'nl-company-edit',
  standalone: true,
  imports: [
    CommonModule,
    CompanyEditSuperadminComponent,
    CompanyEditAdminComponent,
    CompanyEditFranchiseComponent,
  ],
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyEditComponent {
  profileService = inject(ProfileService);
  @Input()
  id: string = '';

  constructor() {
    // this.profileService.getProfile().pipe(tap(profile=>{
    //   if(profile.role === USER_ROLE.SUPER_ADMIN)
    // }))
  }

  get userRole() {
    return USER_ROLE;
  }
}

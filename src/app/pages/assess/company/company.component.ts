import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable, finalize, forkJoin, map, switchMap, tap } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { ACTION_ICON, Action, ColDef } from 'src/app/components/table/table.model';
import { USER_ROLE } from 'src/app/constants/user-role.constants';
import { SharedApiService } from 'src/app/services/shared-api.service';
import { Company, Profile } from '../../assess/assess.model';
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
  cols: ColDef[] = [];
  actionsList: Action[] = [];
  spinnerName = 'company-spinner';
  activatedRoute = inject(ActivatedRoute);

  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);
  private profileService = inject(ProfileService);
  private companyService = inject(CompanyService);
  private confirmationService = inject(ConfirmationService);
  private toastService = inject(MessageService);
  private sharedApiService = inject(SharedApiService);
  profile$: Observable<Profile>;
  refreshRecords: boolean = true;
  cd = inject(ChangeDetectorRef);

  constructor() {
    this.spinner.show(this.spinnerName);

    this.companies$ = forkJoin([
      this.sharedApiService.lookup('COMPANY_TYPE'),
      this.sharedApiService.lookup('PARTNER_TYPE'),
    ]).pipe(
      switchMap(([companyTypes, partnerTypes]) => {
        return this.profileService.profile$.pipe(
          switchMap(profile => this.companyService.getCompanies(profile.companyId)),
          map(companies => {
            return companies.map(c => {
              const companyType = companyTypes.find(ct => ct.value === c.companyType)?.label;
              const partnerType = partnerTypes.find(ct => ct.value === c['partnerType'])?.label;
              return { ...c, companyType, partnerType };
            });
          })
        );
      }),
      finalize(() => this.spinner.hide(this.spinnerName))
    );

    this.profile$ = this.profileService.profile$.pipe(
      tap(profile => {
        if (profile.role === USER_ROLE.SUPER_ADMIN) {
          this.cols = [
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
            {
              icon: ACTION_ICON.DELETE,
              field: 'id,name',
              onClick: (id: string, name: string) => {
                this.confirmationService.confirm({
                  message: `Are you sure you want to delete Admin ${name}`,
                  header: 'Confirm Delete Operation',
                  icon: 'pi pi-exclamation-triangle',
                  acceptLabel: 'Delete',
                  acceptButtonStyleClass: 'mx-4',
                  rejectLabel: 'Cancel',
                  accept: () => {
                    this.companyService.deleteCompany(id).subscribe({
                      next: _ => {
                        this.toastService.add({
                          severity: 'success',
                          summary: 'Success',
                          detail: 'Record deleted successfully !!',
                          sticky: false,
                          id: 'company-delete',
                        });
                        this.refreshRecords = false;
                        this.cd.markForCheck();
                        setTimeout(() => {
                          this.refreshRecords = true;
                          this.cd.markForCheck();
                        }, 100);
                      },
                      error: _ => {
                        this.toastService.add({
                          severity: 'error',
                          summary: 'Error',
                          detail: 'Unable to perform delete operation',
                          sticky: true,
                          id: 'company-delete',
                        });
                      },
                    });
                  },
                  reject: () => {},
                });
              },
            },
          ];
        }
        if (profile.role === USER_ROLE.ADMIN) {
          this.cols = [
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
            {
              icon: ACTION_ICON.DELETE,
              field: 'id,name',
              onClick: (id: string, name: string) => {
                this.confirmationService.confirm({
                  message: `Are you sure you want to delete Customer ${id}`,
                  header: 'Confirm Delete Operation',
                  icon: 'pi pi-exclamation-triangle',
                  acceptLabel: 'Delete',
                  acceptButtonStyleClass: 'mx-4',
                  rejectLabel: 'Cancel',
                  accept: () => {
                    this.companyService.deleteCompany(id).subscribe({
                      next: _ => {
                        this.toastService.add({
                          severity: 'success',
                          summary: 'Success',
                          detail: 'Record deleted successfully !!',
                          sticky: false,
                          id: 'company-delete',
                        });
                        this.refreshRecords = false;
                        this.cd.markForCheck();
                        setTimeout(() => {
                          this.refreshRecords = true;
                          this.cd.markForCheck();
                        }, 100);
                      },
                      error: _ => {
                        this.toastService.add({
                          severity: 'error',
                          summary: 'Error',
                          detail: 'Unable to perform delete operation',
                          sticky: true,
                          id: 'company-delete',
                        });
                      },
                    });
                  },
                  reject: () => {},
                });
              },
            },
          ];
        }
        if (profile.role === USER_ROLE.FRANCHISE) {
          this.cols = [
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
            {
              icon: ACTION_ICON.DELETE,
              field: 'id,name',
              onClick: (id: string, name: string) => {
                this.confirmationService.confirm({
                  message: `Are you sure you want to delete Customer ${id}`,
                  header: 'Confirm Delete Operation',
                  icon: 'pi pi-exclamation-triangle',
                  acceptLabel: 'Delete',
                  acceptButtonStyleClass: 'mx-4',
                  rejectLabel: 'Cancel',
                  accept: () => {
                    this.companyService.deleteCompany(id).subscribe({
                      next: _ => {
                        this.toastService.add({
                          severity: 'success',
                          summary: 'Success',
                          detail: 'Record deleted successfully !!',
                          sticky: false,
                          id: 'company-delete',
                        });
                        this.refreshRecords = false;
                        this.cd.markForCheck();
                        setTimeout(() => {
                          this.refreshRecords = true;
                          this.cd.markForCheck();
                        }, 100);
                      },
                      error: _ => {
                        this.toastService.add({
                          severity: 'error',
                          summary: 'Error',
                          detail: 'Unable to perform delete operation',
                          sticky: true,
                          id: 'company-delete',
                        });
                      },
                    });
                  },
                  reject: () => {},
                });
              },
            },
          ];
        }
      })
    );
  }

  get userRole() {
    return USER_ROLE;
  }
}

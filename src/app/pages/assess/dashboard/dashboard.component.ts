import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TableRowSelectEvent } from 'primeng/table';
import { Observable, finalize, switchMap, tap } from 'rxjs';
import {
  AssessCard,
  AssessCardsComponent,
} from 'src/app/components/assess-cards/assess-cards.component';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { ColDef } from 'src/app/components/table/table.model';
import { AccountDashboard } from '../assess.model';
import { AssessService } from '../services/assess.service';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'nl-dashboard',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, TableComponent, AssessCardsComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  spinnerName: string = 'dashboard-spinner';

  cols: ColDef[] = [
    { field: 'companyName', header: 'Customer Name' },
    { field: 'assessmentName', header: 'Assessment Name' },
    { field: 'assessmentName', header: 'Description' },
    { field: 'totalCredits', header: 'Total credits' },
    { field: 'allocatedCredits', header: 'Allocated credits' },
    { field: 'usedCredits', header: 'Used credits' },
    { field: 'availableCredits', header: 'Balance credits' },
    { field: 'validFrom', header: 'Valid From' },
    { field: 'validTo', header: 'Valid To' },
  ];

  private spinner = inject(NgxSpinnerService);
  private assessService = inject(AssessService);
  private profileService = inject(ProfileService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  accounts$: Observable<AccountDashboard>;
  assessCards: AssessCard[] = [];

  constructor() {
    this.spinner.show(this.spinnerName);
    this.accounts$ = this.profileService.account$.pipe(
      switchMap(account => this.assessService.getAccountdashboardLookup(account.companyId)),
      tap({
        next: resp => {
          console.info('companyId ', resp.companyId);
          this.assessCards = [
            {
              label: 'Total assessments',
              icon: 'alloted-assess',
              count: resp.totalAssessments,
            },
            {
              label: 'Total credits',
              icon: 'alloted-assess',
              count: resp.totalCredits,
            },
            {
              label: 'Used credits',
              icon: 'used-assess',
              count: resp.usedCredits,
            },
            {
              label: 'Balance credits',
              icon: 'balance-assess',
              count: resp.availableCredits,
            },
          ];
        },
      }),
      finalize(() => this.spinner.hide(this.spinnerName))
    );
  }

  onRowSelect(event: TableRowSelectEvent) {
    this.router.navigate(['dashboard-details'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        assessmentId: event.data.id,
        companyId: event.data.companyId,
      },
    });
  }
}

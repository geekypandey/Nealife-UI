import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable, finalize } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { ACTION_ICON, Action, ColDef } from 'src/app/components/table/table.model';
import { Assessment } from '../../assess.model';
import { AssessmentService } from '../assessment.service';

@Component({
  selector: 'nl-company-assessment',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, TableComponent, RouterLink],
  templateUrl: './company-assessment.component.html',
  styleUrls: ['./company-assessment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyAssessmentComponent {
  selectedItems: Array<string> = [];
  spinnerName = 'company-assessment';
  assessments$: Observable<Assessment[]>;
  actionsList: Array<Action>;
  activatedRoute = inject(ActivatedRoute);

  cols: ColDef[] = [
    { header: 'Id', field: 'id' },
    { header: 'Company', field: 'companyName'},
    { header: 'Assessment', field: 'assessmentName'},
    { header: 'Time limit', field: 'timeLimit'},
    { header: 'Available Credits', field: 'availableCredits'},
    { header: 'Used Credits', field: 'usedCredits'},
  ]

  private assessmentService = inject(AssessmentService);
  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);
  private toastService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);


  constructor() {
    this.assessments$ = this.assessmentService.getAssessments().pipe(
      finalize(() => this.spinner.hide(this.spinnerName))
    );

    this.actionsList = [
      {
        icon: ACTION_ICON.VIEW,
        field: 'id',
        onClick: (value: string) => {
          this.router.navigate([value + '/edit'], {
            relativeTo: this.activatedRoute,
          });
        },
      },
      {
        icon: ACTION_ICON.EDIT,
        field: 'id',
        onClick: (value: string) => {
          this.router.navigate(['company-assessment/' + value + '/edit'], {
            relativeTo: this.activatedRoute,
          });
        },
      },
      {
        icon: ACTION_ICON.ALERT,
        field: 'id',
        onClick: (value: string) => {
          this.assessmentService.notifyCompanyWiseUsers(value).subscribe({
            next: () => {
              this.toastService.add({
                severity: 'success',
                summary: `Notifications sent Successfully`,
              })
            },
            error: () => {}
          });
        },
      },
      {
        icon: ACTION_ICON.DOWNLOAD,
        field: 'id',
        onClick: (value: string) => {
          this.router.navigate([value + '/edit'], {
            relativeTo: this.activatedRoute,
          });
        },
      },
      {
        icon: ACTION_ICON.DELETE,
        field: 'id',
        onClick: (value: string) => {
          this.router.navigate([value + '/edit'], {
            relativeTo: this.activatedRoute,
          });
        },
      },
    ]
  }

  updateSelection(items: any) {
    this.selectedItems = items;
    console.log(items)
  }

  deleteItems() {
    // TODO: ask for confirmation
    // inform that items have been sucessfully deleted and then refresh
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete selected Company Assessment?`,
      header: 'Confirm Delete Operation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.assessmentService.deleteAssessments(this.selectedItems);
        this.toastService.add({
          severity: 'success',
          summary: `${this.selectedItems.length} items successfully deleted`
        })
        this.assessments$ = this.assessmentService.getAssessments().pipe(
          finalize(() => this.spinner.hide(this.spinnerName))
        );
      },
      reject: () => {}
    })


  }
}

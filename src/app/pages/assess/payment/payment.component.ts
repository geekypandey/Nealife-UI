import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { ColDef } from 'src/app/components/table/table.model';
import { Assessment } from '../assess.model';
import { AssignService } from '../assign/assign.service';


@Component({
  selector: 'nl-assign',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, TableComponent, RouterLink],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentComponent {
  private spinner = inject(NgxSpinnerService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private assignService = inject(AssignService);

  spinnerName: string = 'payment-spinner';
  assessments$: Observable<Assessment[]>;
  activatedRoute = inject(ActivatedRoute);

  cols: ColDef[] = [
    { header: 'Name', field: 'id' },
    { header: 'Email', field: 'companyName'},
    { header: 'Contact Number', field: 'assessmentName'},
    { header: 'Payment Date', field: 'timeLimit'},
    { header: 'Quantity', field: 'availableCredits'},
    { header: 'Price', field: 'usedCredits'},
    { header: 'Total', field: 'usedCredits'},
    { header: 'Assessment', field: 'usedCredits'},
    { header: 'Payment Id', field: 'usedCredits'},
  ]

  constructor() {
    this.spinner.show(this.spinnerName);
    this.assessments$ = this.assignService.getAssessments().pipe(
      finalize(() => this.spinner.hide(this.spinnerName))
    );
  }
}

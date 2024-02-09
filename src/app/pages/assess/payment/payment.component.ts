import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { ColDef } from 'src/app/components/table/table.model';
import { API_URL } from 'src/app/constants/api-url.constants';
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
  payments$: Observable<any[]>;
  activatedRoute = inject(ActivatedRoute);

  cols: ColDef[] = [
    { header: 'Name', field: 'name' },
    { header: 'Email', field: 'email'},
    { header: 'Contact Number', field: 'phone'},
    { header: 'Payment Date', field: 'paymentDate'},
    // TODO: update these parameters
    { header: 'Quantity', field: 'availableCredits'},
    { header: 'Price', field: 'usedCredits'},
    { header: 'Total', field: 'usedCredits'},
    { header: 'Assessment', field: 'usedCredits'},
    { header: 'Payment Id', field: 'usedCredits'},
  ]

  constructor() {
    this.spinner.show(this.spinnerName);
    this.payments$ = this.http.get<any[]>(API_URL.payment).pipe(
          finalize(() => this.spinner.hide(this.spinnerName))
        );
  }
}

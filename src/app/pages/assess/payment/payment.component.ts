import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize, map } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { ColDef } from 'src/app/components/table/table.model';
import { API_URL } from 'src/app/constants/api-url.constants';
import { AssessmentService } from '../assign/assessment.service';

export interface Payment {
  name: string,
  email: string,
  phone: string,
  address: string,
  contactPerson: string,
  razorpayPaymentId: string | null,
  razorpayOrderId: string,
  razorpaySignature: string | null,
  total: string | null,
  paymentDate: string,
  paymentDetails: Array<any>,
  assessments: Array<any>,
  channelPartner: boolean
}

export interface PaymentDisplay {
  name: string,
  email: string,
  phone: string,
  paymentDate: string,
  quantity: number,
  price: number,
  total: number,
  displayName: string,
  paymentId: number
}


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
  private assignService = inject(AssessmentService);

  spinnerName: string = 'payment-spinner';
  payments$: Observable<PaymentDisplay[]>;
  activatedRoute = inject(ActivatedRoute);

  cols: ColDef[] = [
    { header: 'Name', field: 'name' },
    { header: 'Email', field: 'email'},
    { header: 'Contact Number', field: 'phone'},
    { header: 'Payment Date', field: 'paymentDate'},
    { header: 'Quantity', field: 'quantity'},
    { header: 'Price', field: 'price'},
    { header: 'Total', field: 'total'},
    { header: 'Assessment', field: 'displayName'},
    { header: 'Payment Id', field: 'paymentId'},
  ]

  constructor() {
    this.spinner.show(this.spinnerName);
    this.payments$ = this.http.get<Payment[]>(API_URL.payment).pipe(
          map((value) => {
            return value.map((v) => {
              return {
                name: v.name,
                email: v.email,
                phone: v.phone,
                paymentDate: v.paymentDate,
                quantity: v.paymentDetails[0].credits,
                price: v.paymentDetails[0].price,
                total: v.paymentDetails[0].credits * v.paymentDetails[0].price,
                displayName: v.paymentDetails[0].assessmentGroup ? v.paymentDetails[0].assessmentGroup.displayName : v.paymentDetails[0].assessment.displayName,
                paymentId: v.paymentDetails[0].id
              }
            })
          }),
          finalize(() => this.spinner.hide(this.spinnerName))
        );
  }
}

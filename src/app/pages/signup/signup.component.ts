import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { Observable } from 'rxjs';
import { PaymentService, WINDOW } from 'src/app/services/payment.service';
import { AssessmentName } from './signup.model';
import { SignupService } from './signup.service';

@Component({
  selector: 'nl-signup',
  standalone: true,
  imports: [CommonModule, RouterLink, DropdownModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  private signupService = inject(SignupService);
  private paymentService = inject(PaymentService);
  private winRef = inject(WINDOW);
  private razorPayOptions: any = {
    // key: 'rzp_live_hj19EfEhkQoa23',
    key: 'rzp_test_aJCC2CdosyEoyD',
    amount: 0, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise or INR 500.
    currency: 'INR',
    name: 'Nea Life',
    description: 'Bill payment',
    image: '../../../content/images/assess-final-logo.png',
    // eslint-disable-next-line @typescript-eslint/camelcase
    order_id: null,
    handler: (response: any) => {
      // console.log('this is the response', response);
      // this.verifyPayment(response);
    },
    modal: {
      escape: false,
      ondismiss: () => {
        // this.zone.run(() => {
        //   // console.log('Transaction cancelled.');
        //   this.toast.error('Transaction cancelled');
        // });
      },
    },
    notes: {
      // include notes if any
    },
    theme: {
      color: '#39b54a',
    },
  };
  private paymentId = null;

  assessmentNames$!: Observable<AssessmentName[]>;
  registrationForm: FormGroup;

  constructor() {
    this.registrationForm = new FormGroup({
      id: new FormControl(),
      name: new FormControl(null),
      contactPerson: new FormControl(null, [Validators.required, Validators.maxLength(75)]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
      ]),
      address: new FormControl(''),
      contactNumber1: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.maxLength(10),
        Validators.minLength(10),
      ]),
      contactNumber2: new FormControl(''),
      userType: new FormControl(''),
      paymentInfoGroup: new FormGroup({
        emailAddress: new FormControl('', [Validators.required]),
      }),
      assessmentGroups: new FormArray([], [Validators.required, Validators.minLength(1)]),
    });
  }

  ngOnInit() {
    this.assessmentNames$ = this.signupService.getAssessmentNames();
  }

  createRazorPay(): void {
    // call api to create order_id
    this.registrationForm.get('name')?.setValue(this.registrationForm.get('contactPerson')?.value);
    const payload = {
      name: this.registrationForm.get('name')?.value,
      email: this.registrationForm.get('email')?.value,
      phone: parseInt(this.registrationForm.get('contactNumber1')?.value, 10),
      address: this.registrationForm.get('address')?.value,
      contactPerson: this.registrationForm.get('contactPerson')?.value,
      // assessments: this.assessmentGroups.value,
    };
    this.paymentService.createRazorPayOrder(payload).subscribe({
      next: (result: any) => {
        // eslint-disable-next-line @typescript-eslint/camelcase
        this.razorPayOptions.order_id = result.data.razorpayOrderId;
        this.razorPayOptions.amount = parseInt(result.data.applicationFee, 10);
        this.paymentId = result.data.paymentId;
        const rzp = this.winRef.Razorpay(this.razorPayOptions);
        rzp.open();
      },
      error: (error: any): void => {
        // console.log('ERROR ORDER', error);
        // this.toast.error('Transaction Failed,please re-try');
      },
    });
  }
}

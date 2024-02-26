import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgZone, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { Observable, tap } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { ShowErrorMsgDirective } from 'src/app/directives/show-error-msg.directive';
import { PaymentService, WINDOW } from 'src/app/services/payment.service';
import { AssessmentName } from './signup.model';
import { SignupService } from './signup.service';

@Component({
  selector: 'nl-signup',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DropdownModule,
    ReactiveFormsModule,
    SpinnerComponent,
    ShowErrorMsgDirective,
  ],
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
      this.verifyPayment(response);
    },
    modal: {
      escape: false,
      ondismiss: () => {
        // this.zone.run(() => {
        //   // console.log('Transaction cancelled.');
        //   this.toast.error('Transaction cancelled');
        // });
        this.toastService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Transaction cancelled',
          sticky: true,
          id: 'transaction-cancelled',
        });
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
  private fb = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private spinnerService = inject(NgxSpinnerService);
  private toastService = inject(MessageService);
  private zone = inject(NgZone);

  externalParams: any = {
    cs: 'Career Saathi',
    csp: 'Career Saathi Plus',
  };
  assessmentPriceDetails: any;
  assessmentNames$!: Observable<AssessmentName[]>;
  registrationForm: FormGroup;
  assessmentGroups: FormArray<any>;
  spinnerName = 'signup-spinner';
  isPaymentSuccessfull: boolean = false;

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
      assessmentGroups: new FormArray<any>([], [Validators.required, Validators.minLength(1)]),
    });
    this.assessmentGroups = this.registrationForm.get('assessmentGroups') as FormArray;
  }

  ngOnInit() {
    const exParam = this.activatedRoute.snapshot.queryParams['ex'];
    this.assessmentNames$ = this.signupService.getAssessmentNames().pipe(
      tap(response => {
        if (exParam) {
          this.assessmentPriceDetails = response.filter(
            (element: any) => element.name === this.externalParams[exParam]
          );
          this.registrationForm.get('userType')?.setValue('74');
          this.addAssessmentGroups();
        } else {
          this.assessmentPriceDetails = response;
          this.addAssessmentGroups();
          this.patchPrice(
            {
              value: response[0].assessmentId,
            } as DropdownChangeEvent,
            0
          );
        }
      })
    );
  }

  private addAssessmentGroups(): void {
    this.assessmentGroups.push(
      this.fb.group({
        assessmentId: new FormControl('', []),
        assessmentGroupId: new FormControl('', []),
        credits: new FormControl({ value: '1', disabled: true }, [Validators.required]),
        price: new FormControl({ value: '', disabled: true }, [Validators.required]),
      })
    );
  }

  private removeAssessmentGroups(): void {
    this.assessmentGroups.removeAt(this.assessmentGroups.length - 1);
  }

  patchPrice($event: DropdownChangeEvent, index: number): void {
    const assessmentId = $event.value;
    const assessmentPriceObj = this.assessmentPriceDetails.find(
      (v: any) => v.assessmentId === assessmentId
    );
    if (assessmentPriceObj) {
      this.assessmentGroups.controls[index]
        .get('assessmentGroupId')
        ?.setValue(assessmentPriceObj.assessmentGroupId || '');
      this.assessmentGroups.controls[index]
        .get('assessmentGroupId')
        ?.setValue(assessmentPriceObj.assessmentId || '');
      this.assessmentGroups.controls[index].get('price')?.setValue(assessmentPriceObj.price);
      this.assessmentGroups.controls[index]
        .get('credits')
        ?.setValue(this.assessmentGroups.controls[index].get('credits')?.value);
    }
  }

  createRazorPay(): void {
    this.registrationForm.get('name')?.setValue(this.registrationForm.get('contactPerson')?.value);
    const payload = {
      name: this.registrationForm.get('name')?.value,
      email: this.registrationForm.get('email')?.value,
      phone: parseInt(this.registrationForm.get('contactNumber1')?.value, 10),
      address: this.registrationForm.get('address')?.value,
      contactPerson: this.registrationForm.get('contactPerson')?.value,
      assessments: this.assessmentGroups.getRawValue(),
    };
    this.paymentService.createRazorPayOrder(payload).subscribe({
      next: (result: any) => {
        this.razorPayOptions.order_id = result.data.razorpayOrderId;
        this.razorPayOptions.amount = parseInt(result.data.applicationFee, 10);
        this.paymentId = result.data.paymentId;
        const rzp = this.winRef.Razorpay(this.razorPayOptions);
        rzp.open();
      },
      error: (_: any): void => {
        this.toastService.add({
          severity: 'error',
          summary: 'Transaction Failed',
          detail: 'Transaction Failed,please re-try',
          sticky: false,
          id: 'transaction-failed',
        });
        // this.toast.error();
      },
    });
  }

  private verifyPayment(response: any): void {
    this.razorPayOptions.response = response;
    // call your backend api to verify payment signature & capture transaction
    const payload = {
      razorpayOrderId: response.razorpay_order_id,
      razorpayPaymentId: response.razorpay_payment_id,
      razorpaySignature: response.razorpay_signature,
      amount: this.razorPayOptions.amount,
      currency: 'INR',
      paymentId: this.paymentId,
    };
    this.spinnerService.show(this.spinnerName);
    this.paymentService.verifyRazorPayOrder(payload).subscribe({
      next: (result: any) => {
        this.spinnerService.hide();
        this.zone.run(() => {
          this.isPaymentSuccessfull = true;
          this.toastService.add({
            severity: 'success',
            summary: 'Transaction successful',
            detail:
              'Thank you! You have completed all the steps. Please check your inbox / spam folder for email with an assessment link, if not found contact team NeaLife.',
            sticky: false,
            id: 'transaction-success',
          });
          window.history.back();
        });
      },
      error: (error: any) => {
        console.log('ERROR VERIFY', error);
        this.spinnerService.hide();
        this.zone.run(() => {
          this.isPaymentSuccessfull = false;
          this.toastService.add({
            severity: 'error',
            summary: 'Transaction Failed',
            detail: 'Transaction Failed.',
            sticky: false,
            id: 'transaction-failed',
          });
        });
      },
    });
  }
}

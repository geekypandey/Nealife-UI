import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { API_URL } from 'src/app/constants/api-url.constants';
import { CRUDService } from '../../../services/crud.service';
import { IResponseOption } from '../response-option.model';

@Component({
  selector: 'nl-response-option-detail',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './response-option-detail.component.html',
  styleUrls: ['./response-option-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResponseOptionDetailComponent {
  spinnerName = 'response-option-detail';
  responseOption$: Observable<IResponseOption>;

  private activatedRoute = inject(ActivatedRoute);
  private crudService = inject(CRUDService);
  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);

  constructor() {
    const responseOptionId = this.activatedRoute.snapshot.params['id'];
    this.spinner.show(this.spinnerName);
    this.responseOption$ = this.crudService
      .find<IResponseOption>(API_URL.responseOptions, responseOptionId)
      .pipe(finalize(() => this.spinner.hide(this.spinnerName)));
  }

  editRecord(value: number | undefined) {
    this.router.navigate(['../../', value, 'edit'], {
      relativeTo: this.activatedRoute,
    });
  }

  goBack() {
    window.history.back();
  }
}

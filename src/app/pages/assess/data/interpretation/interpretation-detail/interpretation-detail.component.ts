import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { API_URL } from 'src/app/constants/api-url.constants';
import { CRUDService } from '../../../services/crud.service';
import { IInterpretation } from '../interpretation.model';

@Component({
  selector: 'nl-interpretation-detail',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './interpretation-detail.component.html',
  styleUrls: ['./interpretation-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterpretationDetailComponent {
  spinnerName = 'interpretations-detail';
  interpretation$: Observable<IInterpretation>;

  private activatedRoute = inject(ActivatedRoute);
  private crudService = inject(CRUDService);
  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);

  constructor() {
    const aspectId = this.activatedRoute.snapshot.params['id'];
    this.spinner.show(this.spinnerName);
    this.interpretation$ = this.crudService
      .find<IInterpretation>(API_URL.interpretations, aspectId)
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

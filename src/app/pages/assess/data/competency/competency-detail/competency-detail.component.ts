import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { API_URL } from 'src/app/constants/api-url.constants';
import { CRUDService } from '../../../services/crud.service';
import { ICompetency } from '../competency.model';

@Component({
  selector: 'nl-competency-detail',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './competency-detail.component.html',
  styleUrls: ['./competency-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompetencyDetailComponent {
  spinnerName = 'competency-detail';
  competency$: Observable<ICompetency>;

  private activatedRoute = inject(ActivatedRoute);
  private crudService = inject(CRUDService);
  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);

  constructor() {
    const competencyId = this.activatedRoute.snapshot.params['id'];
    this.spinner.show(this.spinnerName);
    this.competency$ = this.crudService
      .find<ICompetency>(API_URL.competencies, competencyId)
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

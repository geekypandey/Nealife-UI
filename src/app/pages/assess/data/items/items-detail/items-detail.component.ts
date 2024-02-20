import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { API_URL } from 'src/app/constants/api-url.constants';
import { CRUDService } from '../../../services/crud.service';
import { IItem } from '../items.model';

@Component({
  selector: 'nl-items-detail',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './items-detail.component.html',
  styleUrls: ['./items-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsDetailComponent {
  spinnerName = 'items-detail';
  item$: Observable<IItem>;

  private activatedRoute = inject(ActivatedRoute);
  private crudService = inject(CRUDService);
  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);

  constructor() {
    const itemId = this.activatedRoute.snapshot.params['id'];
    this.spinner.show(this.spinnerName);
    this.item$ = this.crudService
      .find<IItem>(API_URL.items, itemId)
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

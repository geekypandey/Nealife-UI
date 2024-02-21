import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { ACTION_ICON, Action, ColDef } from 'src/app/components/table/table.model';
import { API_URL } from 'src/app/constants/api-url.constants';
import { CRUDService } from '../../services/crud.service';
import { INorm } from './norm.model';

@Component({
  selector: 'nl-norm',
  standalone: true,
  imports: [CommonModule, TableComponent, SpinnerComponent, RouterLink],
  templateUrl: './norm.component.html',
  styleUrls: ['./norm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NormComponent {
  spinnerName = 'norms-spinner';
  cols: ColDef[] = [
    { field: 'id', header: 'Id' },
    { field: 'stanine', header: 'Stanine' },
    { field: 'percentile', header: 'percentile' },
    { field: 'grade', header: 'Grade' },
    { field: 'aspect', header: 'Aspect' },
    { field: 'trait', header: 'Traits' },
    { field: 'value', header: 'Value' },
  ];
  activatedRoute = inject(ActivatedRoute);

  private crudService: CRUDService = inject(CRUDService);
  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);
  norms$: Observable<INorm[]>;
  actionsList: Action[] = [];

  constructor() {
    this.actionsList = [
      {
        icon: ACTION_ICON.EDIT,
        field: 'id',
        onClick: (value: string) => {
          this.router.navigate([value + '/edit'], {
            relativeTo: this.activatedRoute,
          });
        },
      },
    ];
    this.spinner.show(this.spinnerName);
    this.norms$ = this.crudService
      .query<INorm[]>(API_URL.norms)
      .pipe(finalize(() => this.spinner.hide(this.spinnerName)));
  }
}

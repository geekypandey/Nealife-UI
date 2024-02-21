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
import { ICompetency } from '../competency/competency.model';
import { IResponseOption } from './response-option.model';

@Component({
  selector: 'nl-response-option',
  standalone: true,
  imports: [CommonModule, TableComponent, SpinnerComponent, RouterLink],
  templateUrl: './response-option.component.html',
  styleUrls: ['./response-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResponseOptionComponent {
  spinnerName = 'response-option-spinner';
  cols: ColDef[] = [
    { field: 'id', header: 'Id' },
    { field: 'responseOption', header: 'Response Option' },
    { field: 'choices', header: 'Choices' },
    { field: 'definition', header: 'Definition' },
  ];
  activatedRoute = inject(ActivatedRoute);

  private crudService: CRUDService = inject(CRUDService);
  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);
  responseOptions$: Observable<IResponseOption[]>;
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
    this.responseOptions$ = this.crudService
      .query<ICompetency[]>(API_URL.responseOptions)
      .pipe(finalize(() => this.spinner.hide(this.spinnerName)));
  }
}

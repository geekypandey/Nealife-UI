import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { ACTION_ICON, Action, ColDef } from 'src/app/components/table/table.model';
import { API_URL } from 'src/app/constants/api-url.constants';
import { Lookup } from '../assess.model';
import { CRUDService } from '../services/crud.service';

@Component({
  selector: 'nl-lookup',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, TableComponent, RouterLink],
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LookupComponent {
  spinnerName = 'lookup-spinner';
  lookup$: Observable<Lookup[]>;
  actionsList: Action[] = [];
  private spinner = inject(NgxSpinnerService);
  private crudService: CRUDService = inject(CRUDService);
  private router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  cols: ColDef[] = [
    { field: 'id', header: 'Id' },
    { field: 'type', header: 'Type' },
    { field: 'subtype', header: 'Sub Type' },
    { field: 'key', header: 'Key' },
    { field: 'value', header: 'Value' },
  ];

  constructor() {
    this.spinner.show(this.spinnerName);
    this.lookup$ = this.crudService
      .query<Lookup[]>(API_URL.lookup)
      .pipe(finalize(() => this.spinner.hide(this.spinnerName)));
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
  }
}

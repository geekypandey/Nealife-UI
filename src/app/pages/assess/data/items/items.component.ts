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
import { IItem } from './items.model';

@Component({
  selector: 'nl-items',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, RouterLink, TableComponent],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemsComponent {
  spinnerName = 'competency-spinner';
  cols: ColDef[] = [
    { field: 'id', header: 'Id' },
    { field: 'key', header: 'Key' },
    { field: 'question', header: 'Question' },
    { field: 'choices', header: 'Choice' },
  ];
  activatedRoute = inject(ActivatedRoute);

  private crudService: CRUDService = inject(CRUDService);
  private spinner = inject(NgxSpinnerService);
  private router = inject(Router);
  items$: Observable<IItem[]>;
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
    this.items$ = this.crudService
      .query<IItem[]>(API_URL.items)
      .pipe(finalize(() => this.spinner.hide(this.spinnerName)));
  }
}

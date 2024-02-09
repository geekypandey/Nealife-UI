import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { ColDef } from 'src/app/components/table/table.model';
import { MasterDataDetails } from '../../assess.model';
import { AssessService } from '../../services/assess.service';

@Component({
  selector: 'nl-master-detail',
  standalone: true,
  imports: [CommonModule, TableComponent, SpinnerComponent],
  templateUrl: './master-detail.component.html',
  styleUrls: ['./master-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MasterDetailComponent {
  masterDataDetails$: Observable<MasterDataDetails[]>;
  spinnerName = 'master-data-details';
  cols: ColDef[] = [];

  private activatedRoute = inject(ActivatedRoute);
  private assessService = inject(AssessService);
  private spinner = inject(NgxSpinnerService);

  constructor() {
    this.cols = [
      {
        field: 'itemKey',
        header: 'Item Key',
      },
      {
        field: '',
        header: 'Item',
      },
      {
        field: '',
        header: 'Response Options',
      },
      {
        field: 'choice',
        header: 'Choice',
      },
      {
        field: '',
        header: 'Factor Interpretation',
      },
      {
        field: '',
        header: 'Aspect Interpretation',
      },
    ];
    this.spinner.show(this.spinnerName);
    this.masterDataDetails$ = this.assessService
      .getAspectProjectionList(this.activatedRoute.snapshot.queryParams)
      .pipe(finalize(() => this.spinner.hide(this.spinnerName)));
  }

  goBack(): void {
    window.history.back();
  }
}

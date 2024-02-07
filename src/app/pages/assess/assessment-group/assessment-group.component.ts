import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, finalize } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { TableComponent } from 'src/app/components/table/table.component';
import { ACTION_ICON, Action, ColDef } from 'src/app/components/table/table.model';
import { AssessService } from '../services/assess.service';
import { AssessmentGroup } from './assessment-group.model';

@Component({
  selector: 'nl-assessment-group',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, TableComponent],
  templateUrl: './assessment-group.component.html',
  styleUrls: ['./assessment-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssessmentGroupComponent {
  assessmentByGroup$: Observable<AssessmentGroup[]>;
  spinnerName = 'assessment-group';
  private assessService = inject(AssessService);
  private spinnerService = inject(NgxSpinnerService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  cols: ColDef[] = [
    { field: 'name', header: 'Assessment' },
    { field: 'description', header: 'Description' },
  ];
  actionsList: Action[] = [];

  constructor() {
    this.spinnerService.show(this.spinnerName);
    this.assessmentByGroup$ = this.assessService.getAssessmentsByGroup<AssessmentGroup[]>().pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.spinnerService.hide(this.spinnerName))
    );

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

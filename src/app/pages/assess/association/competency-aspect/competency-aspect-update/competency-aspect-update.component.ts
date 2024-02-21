import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { API_URL } from 'src/app/constants/api-url.constants';
import { DropdownOption } from 'src/app/models/common.model';

@Component({
  selector: 'nl-competency-aspect-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DropdownModule],
  templateUrl: './competency-aspect-update.component.html',
  styleUrls: ['./competency-aspect-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompetencyAspectUpdateComponent implements OnInit {
  editForm: FormGroup;
  competencyAspect: any;
  competencies: DropdownOption[] = [];
  aspects: DropdownOption[] = [];

  private fb = inject(FormBuilder);
  private activateRoute = inject(ActivatedRoute);
  private http = inject(HttpClient);

  constructor() {
    this.editForm = this.fb.group({
      id: [],
      competencyId: [null, Validators.required],
      aspectId: [null, Validators.required]
    })
    this.http.get<any>(API_URL.competencies).subscribe((data) => {
      this.competencies = data.map((v: any) => {
        return { label: v.name, value: v.id}
      })
    });
    this.http.get<any>(API_URL.aspects).subscribe((data) => {
      this.aspects = data.map((v: any) => {
        return { label: v.name, value: v.id}
      })
    });
  }

  ngOnInit(): void {
    const id = this.activateRoute.snapshot.params['id'];
    if (id) {
      this.http.get<any>(API_URL.competencyAspects + '/' + id).subscribe((value) => {
        this.competencyAspect = value;
        this.patchEditForm();
      })
    }
  }

  patchEditForm(): void {
    this.editForm.patchValue({
      id: this.competencyAspect.id,
      competencyId: this.competencyAspect.competencyId,
      aspectId: this.competencyAspect.aspectId
    })

  }

  goBack() {
    window.history.back();
  }

  save() {
    if (this.editForm.valid) {
      const competencyAspect = {
        id: this.editForm.get(['id'])!.value,
        competencyId: this.editForm.get(['competencyId'])!.value,
        aspectId: this.editForm.get(['aspectId'])!.value,
      }
      console.log(competencyAspect.id)
      if (competencyAspect.id != undefined) {
        this.http.put<any>(API_URL.competencyAspects, competencyAspect).subscribe({
          next: () => this.goBack(),
          error: () => { },
        })
      } else {
        // TODO: fix this
        console.log('POST')
        delete competencyAspect['id'];
        this.http.post<any>(API_URL.competencyAspects, competencyAspect).subscribe({
          next: () => this.goBack(),
          error: () => { },
        })
      }
    }
  }

}

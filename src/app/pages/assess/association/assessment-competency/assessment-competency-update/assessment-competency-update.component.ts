import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { API_URL } from 'src/app/constants/api-url.constants';
import { DropdownOption } from 'src/app/models/common.model';

@Component({
  selector: 'nl-assessment-competency-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DropdownModule],
  templateUrl: './assessment-competency-update.component.html',
  styleUrls: ['./assessment-competency-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentCompetencyUpdateComponent implements OnInit {
  editForm: FormGroup;
  assessmentCompetency: any;
  competencies: DropdownOption[] = [];
  assessments: DropdownOption[] = [];

  private fb = inject(FormBuilder);
  private activateRoute = inject(ActivatedRoute);
  private http = inject(HttpClient);

  constructor() {
    this.editForm = this.fb.group({
      id: [],
      competencyId: [null, Validators.required],
      assessmentId: [null, Validators.required]
    })
    this.http.get<any>(API_URL.competenciesForDropdown).subscribe((data) => {
      this.competencies = data.map((v: any) => {
        return { label: v.name, value: v.id}
      })
    });
    this.http.get<any>(API_URL.assessmentsForDropdown).subscribe((data) => {
      this.assessments = data.map((v: any) => {
        return { label: v.name, value: v.id}
      })
    });
  }

  ngOnInit(): void {
    const id = this.activateRoute.snapshot.params['id'];
    console.log(id);
    if (id) {
      this.http.get<any>(API_URL.assessmentCompetencies + '/' + id).subscribe((value) => {
        this.assessmentCompetency = value;
        this.patchEditForm();
      })
    }
  }

  patchEditForm(): void {
    this.editForm.patchValue({
      id: this.assessmentCompetency.id,
      competencyId: this.assessmentCompetency.competencyId,
      assessmentId: this.assessmentCompetency.assessmentId
    })

  }

  goBack() {
    window.history.back();
  }

}
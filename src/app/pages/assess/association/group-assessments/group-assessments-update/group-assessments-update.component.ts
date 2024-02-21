import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { API_URL } from 'src/app/constants/api-url.constants';
import { DropdownOption } from 'src/app/models/common.model';

@Component({
  selector: 'nl-group-assessments-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DropdownModule],
  templateUrl: './group-assessments-update.component.html',
  styleUrls: ['./group-assessments-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupAssessmentsUpdateComponent implements OnInit {
  editForm: FormGroup;
  groupAssessment: any;

  assessments: DropdownOption[] = [];
  assessmentGroups: DropdownOption[] = [];

  private fb = inject(FormBuilder);
  private activateRoute = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private toastService = inject(MessageService)

  constructor() {
    this.editForm = this.fb.group({
      id: [],
      sequence: [],
      assessmentId: [null, Validators.required],
      assessmentDate: [],
      reportTemplate: [],
      emailTemplate: [],
      timeLimit: [],
      assessmentDescription: [],
      assessmentGroupId: [null, Validators.required],
      assessmentGroupName: [],
    })

    this.http.get<any>(API_URL.assessments).subscribe((data) => {
      this.assessments = data.map((v: any) => {
        return { label: v.name, value: v.id}
      })
    });

    this.http.get<any>(API_URL.assessmentGroups).subscribe((data) => {
      this.assessmentGroups = data.map((v: any) => {
        return { label: v.name, value: v.id}
      })
    });
  }

  ngOnInit(): void {
    const id = this.activateRoute.snapshot.params['id'];
    if (id) {
      this.http.get<any>(API_URL.assessmentGroup + '/' + id).subscribe((value) => {
        this.groupAssessment = value;
        this.patchEditForm();
      })
    }
  }

  patchEditForm(): void {
    this.editForm.patchValue({
      id: this.groupAssessment.id,
      sequence: this.groupAssessment.sequence,
      assessmentId: this.groupAssessment.assessmentId,
      assessmentDescription: this.groupAssessment.assessmentDescription,
      assessmentGroupName: this.groupAssessment.assessmentGroupName,
      timeLimit: this.groupAssessment.timeLimit,
      assessmentGroupId: this.groupAssessment.assessmentGroupId,
    })
  }

  goBack() {
    window.history.back();
  }

  save() {
    if (this.editForm.valid) {
      const groupAssessment = {
        id: this.editForm.get(['id'])!.value,
        assessmentId: this.editForm.get(['assessmentId'])!.value,
        sequence: this.editForm.get(['sequence'])!.value,
        timeLimit: this.editForm.get(['timeLimit'])!.value,
        assessmentGroupName: this.editForm.get(['assessmentGroupName'])!.value,
        assessmentGroupId: this.editForm.get(['assessmentGroupId'])!.value,
        assessmentDescription: this.editForm.get(['assessmentDescription'])!.value,
      }
      if (groupAssessment.id != undefined) {
        this.http.put<any>(API_URL.assessmentGroup, groupAssessment).subscribe({
          next: () => this.goBack(),
          error: (response) => { 
            if(response.error.errorKey == 'assessmentExists') {
              this.toastService.add({
                severity: 'error',
                summary: 'Assessment Already Mapped / Sequence already in use',
                detail: 'Either assessment is already mapped to group or sequence already in used',
                sticky: false,
                id: 'requestError',
              });
            }
          },
        })
      } else {
        // TODO: fix this
        delete groupAssessment['id'];
        this.http.post<any>(API_URL.assessmentGroup, groupAssessment).subscribe({
          next: () => this.goBack(),
          error: () => { },
        })
      }
    }
  }
}


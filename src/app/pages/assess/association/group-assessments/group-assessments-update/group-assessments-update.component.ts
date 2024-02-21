import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  aspectItem: any;
  items: DropdownOption[] = [];
  aspects: DropdownOption[] = [];
  responseOptions: DropdownOption[] = [];

  private fb = inject(FormBuilder);
  private activateRoute = inject(ActivatedRoute);
  private http = inject(HttpClient);

  constructor() {
    this.editForm = this.fb.group({
      id: [],
      itemId: [null, Validators.required],
      aspectId: [null, Validators.required],
      responseOptionId: [null, Validators.required],
    })
    this.http.get<any>(API_URL.itemsForDropdown).subscribe((data) => {
      this.items = data.map((v: any) => {
        return { label: v.key, value: v.id}
      })
    });
    this.http.get<any>(API_URL.aspectsForDropdown).subscribe((data) => {
      this.aspects = data.map((v: any) => {
        return { label: v.name, value: v.id}
      })
    });
    this.http.get<any>(API_URL.responseOptionsForDropdown).subscribe((data) => {
      this.responseOptions = data.map((v: any) => {
        return { label: v.responseOption, value: v.id}
      })
    });
  }

  ngOnInit(): void {
    const id = this.activateRoute.snapshot.params['id'];
    if (id) {
      this.http.get<any>(API_URL.aspectItems + '/' + id).subscribe((value) => {
        this.aspectItem = value;
        this.patchEditForm();
      })
    }
  }

  patchEditForm(): void {
    this.editForm.patchValue({
      id: this.aspectItem.id,
      itemId: this.aspectItem.itemId,
      aspectId: this.aspectItem.aspectId,
      responseOptionId: this.aspectItem.responseOptionId,
    })

  }

  goBack() {
    window.history.back();
  }

  save() {
    if (this.editForm.valid) {
      const aspectItem = {
        id: this.editForm.get(['id'])!.value,
        itemId: this.editForm.get(['itemId'])!.value,
        aspectId: this.editForm.get(['aspectId'])!.value,
        responseOptionId: this.editForm.get(['responseOptionId'])!.value,
      }
      console.log(aspectItem.id)
      if (aspectItem.id != undefined) {
        this.http.put<any>(API_URL.aspectItems, aspectItem).subscribe({
          next: () => this.goBack(),
          error: () => { },
        })
      } else {
        // TODO: fix this
        console.log('POST')
        delete aspectItem['id'];
        this.http.post<any>(API_URL.aspectItems, aspectItem).subscribe({
          next: () => this.goBack(),
          error: () => { },
        })
      }
    }
  }

}


import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { API_URL } from 'src/app/constants/api-url.constants';

@Component({
  selector: 'nl-company-assessment-group-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-assessment-group-upload.component.html',
  styleUrls: ['./company-assessment-group-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyAssessmentGroupUploadComponent implements OnInit {
  file: any;
  payload: any;

  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private http = inject(HttpClient);
  private toastService = inject(MessageService);


  ngOnInit(): void {
    this.payload = this.config.data.payload;
  }
  
  cancel() {
    this.ref.close();
  }

  onFileChange(event: any): void {
    this.file = event.target.files[0];
  }

  upload(): void {
    if (this.file?.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || this.file?.type === 'application/vnd.ms-excel') {
      const formData: FormData = new FormData();
      formData.append('file', this.file, this.file.name);
      this.payload.credits = parseInt(this.payload.credits, 10);
      const blob = new Blob([JSON.stringify(this.payload)], {
        type: 'application/json',
      });
      formData.append('assignAssessment', blob);
      const headers: HttpHeaders = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      this.http.post(API_URL.uploadUser, formData, {
        headers,
        responseType: 'text',
      }).subscribe({
        next: () => {
          console.log('here')
          this.toastService.add({
            severity: 'success',
            summary: 'File Upload Successfully!',
            detail: ''
          })
          this.ref.close();
        },
        error: (err: any) => {
          if (err?.error) {
            const errorMessage = JSON.parse(err?.error);
            console.log(errorMessage)
            this.toastService.add({
              severity: 'error',
              summary: errorMessage.data,
              detail: ''
            })
          }
        }
      })
    }
  }
}
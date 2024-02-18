import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FileSaverService } from 'ngx-filesaver';
import { NgxSpinnerService } from 'ngx-spinner';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { Assessment } from '../../../assess.model';
import { ProfileService } from '../../../services/profile.service';
import { AssessmentService } from '../../assessment.service';

@Component({
  selector: 'nl-company-assessment-edit',
  standalone: true,
  imports: [CommonModule, SpinnerComponent, ReactiveFormsModule, DropdownModule, CalendarModule],
  templateUrl: './company-assessment-edit.component.html',
  styleUrls: ['./company-assessment-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyAssessmentEditComponent implements OnInit {
  spinnerName: string = 'company-assessment-edit';
  // TODO: fix this
  assessment: Assessment | any;
  editForm: FormGroup;
  individualEditForm: FormGroup;
  bulkEditForm: FormGroup;

  private activatedRoute = inject(ActivatedRoute);
  private assessmentService = inject(AssessmentService);
  private profileService = inject(ProfileService);
  private spinner = inject(NgxSpinnerService);
  private fb = inject(FormBuilder);
  private _fileSaver = inject(FileSaverService);

  constructor() {
    const assessmentId = this.activatedRoute.snapshot.params['id'];
    this.assessmentService.getAssessment(assessmentId).subscribe((value) => this.assessment = value);

    this.editForm = this.fb.group({
      id: [],
      companyId: [null, Validators.required],
      assessmentId: [null, Validators.required],
      scheduleDate: [],
      reportTemplate: [],
      emailTemplate: [],
      timeLimit: [null, [Validators.required, Validators.maxLength(75)]],
      availableCredits: [0, [Validators.required, Validators.maxLength(75)]],
      usedCredits: [0, [Validators.required, Validators.maxLength(75)]],
      allocatedCredits: [0, [Validators.required, Validators.maxLength(75)]],
      url: [],
      totalCredits: [0, [Validators.required, Validators.maxLength(75)]],
      generateUrl: [],
      creditCode: [],
      email: [],
      credits: [],
    });

    this.individualEditForm = this.fb.group({
      generateUrl: [],
      creditCode: [],
      email: [],
      emailReport: [],
      embeddCreditCode: [],
    });

    this.bulkEditForm = this.fb.group({
      generateUrl: [],
      creditCode: [],
      email: [],
      emailReport: [],
      embeddCreditCode: [],
      credits: [],
    });
  }

  ngOnInit() {
    this.profileService.getLoggedInUser().subscribe((value) => console.log(value))
  }

  downloadCredits() {
    const id = this.assessment.id;
    this.assessmentService.downloadCredits(id).subscribe((value: any) => {
      const blob = new Blob([value], { type: 'application/octect-stream' });
      this._fileSaver.save(blob, 'Available_Credits.xlsx');
    });
  }
}
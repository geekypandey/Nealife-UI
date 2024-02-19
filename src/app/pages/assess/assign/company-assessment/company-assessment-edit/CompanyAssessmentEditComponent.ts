import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FileSaverService } from 'ngx-filesaver';
import { NgxSpinnerService } from 'ngx-spinner';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { Authority } from 'src/app/constants/authority.constants';
import { DropdownOption } from 'src/app/models/common.model';
import { Assessment } from '../../../assess.model';
import { CompanyService } from '../../../company/company.service';
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
  companies: DropdownOption[];
  assessments: any;
  loggedInUser: any;

  private activatedRoute = inject(ActivatedRoute);
  private assessmentService = inject(AssessmentService);
  private profileService = inject(ProfileService);
  private spinner = inject(NgxSpinnerService);
  private fb = inject(FormBuilder);
  private _fileSaver = inject(FileSaverService);
  private companyService = inject(CompanyService);

  constructor() {
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

    const assessmentId = this.activatedRoute.snapshot.params['id'];
    if (assessmentId) {
      this.assessmentService.getAssessment(assessmentId).subscribe((value) => {
        this.assessment = value;
        this.patchEditForm();
        this.disableFieldsInEditForm(['usedCredits', 'availableCredits', 'allocatedCredits']);
      });
    }
  }

  ngOnInit() {
    this.profileService.getLoggedInUser().subscribe((value) => {
      this.loggedInUser = value;
      if (this.loggedInUser.role === Authority.ACCOUNT_ADMIN && this.assessment.id) {
        this.editForm.disable();
      }
      this.loadData();
    });
  }

  loadData() {
    const companyId = this.loggedInUser.companyId;
    const company$ = companyId !== '1' ? this.companyService.getCompanyById(companyId) : this.companyService.getAllCompanies();
    company$.subscribe((value) => {
      this.companies = value.map((company) => {
        { label: company.name, value; company.id; }
      });
    });
    this.assessmentService.getAssessmentsForDropDown(companyId || '').subscribe((value) => {
      this.assessments = value || [];
    });
  }


  patchEditForm() {
    this.editForm.patchValue({
      id: this.assessment.id,
      companyId: this.assessment.companyId,
      assessmentId: this.assessment.assessmentId,
      scheduleDate: this.assessment.scheduleDate,
      timeLimit: this.assessment.timeLimit,
      availableCredits: this.assessment.availableCredits,
      usedCredits: this.assessment.usedCredits,
      allocatedCredits: this.assessment.allocatedCredits,
      url: this.assessment.url,
      totalCredits: this.assessment.totalCredits,
    });

    if (this.editForm.value['usedCredits'] == null) {
      this.editForm.controls['usedCredits'].setValue(0);
    }
  }

  disableFieldsInEditForm(fields: Array<string>) {
    for (const field of fields) {
      this.editForm.controls[field].disable();
    }
  }

  downloadCredits() {
    const id = this.assessment.id;
    this.assessmentService.downloadCredits(id).subscribe((value: any) => {
      const blob = new Blob([value], { type: 'application/octect-stream' });
      this._fileSaver.save(blob, 'Available_Credits.xlsx');
    });
  }

  goBack() {
    window.history.back();
  }
}

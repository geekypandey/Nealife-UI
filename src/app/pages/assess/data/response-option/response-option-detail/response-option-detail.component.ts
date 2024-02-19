import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nl-response-option-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './response-option-detail.component.html',
  styleUrls: ['./response-option-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponseOptionDetailComponent {

}

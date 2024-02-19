import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nl-response-option-update',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './response-option-update.component.html',
  styleUrls: ['./response-option-update.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponseOptionUpdateComponent {

}

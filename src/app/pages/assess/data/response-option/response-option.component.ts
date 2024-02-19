import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nl-response-option',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './response-option.component.html',
  styleUrls: ['./response-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponseOptionComponent {

}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgxSpinnerModule, Size } from 'ngx-spinner';

@Component({
  selector: 'nl-spinner',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule],
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
  @Input() bdColor: string = 'rgba(0, 0, 0, 0.8)';
  @Input() color: string = '#fff';
  @Input() type: string = 'ball-clip-rotate-multiple';
  @Input() size: Size = 'medium';
  @Input() name: string = 'primary';
  @Input() fullScreen: boolean = true;
  @Input() loadingTextStyle: { [key: string]: any } = { color: '#fff' };
}

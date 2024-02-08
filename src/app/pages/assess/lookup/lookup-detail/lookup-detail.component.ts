import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Lookup } from '../../assess.model';

@Component({
  selector: 'nl-lookup-detail',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './lookup-detail.component.html',
  styleUrls: ['./lookup-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LookupDetailComponent {
  @Input() lookup!: Lookup;

  edit() {}

  goBack() {
    window.history.back();
  }
}

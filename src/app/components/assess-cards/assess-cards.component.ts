import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface AssessCard {
  label: string;
  count: string;
  icon: string;
}

@Component({
  selector: 'nl-assess-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assess-cards.component.html',
  styleUrls: ['./assess-cards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssessCardsComponent {
  @Input() assessCards: AssessCard[] = [];
}

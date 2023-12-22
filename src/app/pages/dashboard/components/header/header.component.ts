import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { HeaderMenu } from './header.model';

@Component({
  selector: 'nl-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input() companyName!: string;
  @Input() username!: string;
  @Input() headerMenus: HeaderMenu[] = [];

  showMenu = false;
}

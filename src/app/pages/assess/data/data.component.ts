import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TabGroupComponent } from 'src/app/components/tab-group/tab-group.component';
import { Tab } from 'src/app/components/tab-group/tab.model';

@Component({
  selector: 'nl-data',
  standalone: true,
  imports: [CommonModule, TabGroupComponent],
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataComponent {
  tabs: Tab[];

  constructor() {
    this.tabs = [
      {
        header: 'Competency',
        url: 'competency',
      },
      {
        header: 'Aspect',
        url: 'aspect',
      },
      {
        header: 'Items',
        url: 'items',
      },
      {
        header: 'Response Option',
        url: 'response-option',
      },
      {
        header: 'Norm',
        url: 'norm',
      },
    ];
  }
}

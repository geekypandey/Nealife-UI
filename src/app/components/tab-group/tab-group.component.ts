import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, SimpleChanges, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { TabViewModule } from 'primeng/tabview';
import { Tab } from './tab.model';

@Component({
  selector: 'nl-tab-group',
  standalone: true,
  imports: [CommonModule, TabViewModule, RouterOutlet],
  templateUrl: './tab-group.component.html',
  styleUrls: ['./tab-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabGroupComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  activeIndex: number = 0;

  @Input()
  tabs: Tab[] = [];

  @Input()
  menuUrl!: string;

  private setActiveTab() {
    const getActiveTabIndex = () => {
      const currentUrl = this.router.url;
      const activatedRoute = currentUrl.split(`/assess/${this.menuUrl}/`)[1];
      return this.tabs.findIndex(tab => tab.url === activatedRoute);
    };
    const tabIndex = getActiveTabIndex();
    const activeTabIndex = tabIndex >= 0 ? tabIndex : 0;
    this.onTabSelection(activeTabIndex);
    this.activeIndex = activeTabIndex;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['menuUrl'] && changes['tabs']) {
      this.setActiveTab();
    }
  }

  onTabSelection(index: number) {
    const { url } = this.tabs[index];
    this.router.navigate([url], { relativeTo: this.activatedRoute });
  }
}

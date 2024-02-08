import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarMenu } from './../../pages/assess/assess.model';

@Component({
  selector: 'nl-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  private _menu: SidebarMenu[] = [];
  @Input()
  set menus(value: SidebarMenu[]) {
    if (value && value.length) {
      this._menu = value;
      const currentActivatedUrl = this.router.url;
      const foundMenu = this.getMenu(this.menus, currentActivatedUrl);
      if (foundMenu && foundMenu.children) {
        foundMenu.toggleMenu = true;
      }
    }
  }
  get menus() {
    return this._menu;
  }

  @Input() defaultRoute: string = '/';

  private router = inject(Router);

  private getMenu(menus: SidebarMenu[], url: string): SidebarMenu | undefined {
    for (let i = 0; i < menus.length; i++) {
      if (menus[i].url === url) {
        return menus[i]; // Return the found menu
      }

      if (menus[i].children && menus[i].children?.length) {
        const foundInChildren = this.getMenu(menus[i].children || [], url);
        if (foundInChildren) {
          return menus[i]; // Return the found menu from the children
        }
      }
    }

    return undefined; // Return undefined if no menu is found
  }
}

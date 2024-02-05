import { Injectable } from '@angular/core';
import { Authority } from '../constants/authority.constants';
import { SidebarMenu } from '../pages/assess/assess.model';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  public readonly baseRoute: string = '/assess';
  constructor() {}

  getSidebarMenus(authorityType: string, privileges: string[]): SidebarMenu[] {
    console.info(authorityType, privileges);
    const commonMenu: SidebarMenu[] = [
      {
        privilege: 'dashboard-main',
        label: 'Dashboard',
        icon: 'dashboard',
        url: this.baseRoute + '/dashboard',
      },
      {
        privilege: 'register-main',
        label: 'Register',
        icon: 'register',
        url: this.baseRoute + '/company',
      },
      {
        privilege: 'assign-main',
        label: 'Assign',
        icon: 'assign',
        url: this.baseRoute + '/assign',
      },
      {
        privilege: 'result-main',
        label: 'Results',
        icon: 'results',
        url: this.baseRoute + '/assessment-result',
      },
    ];
    const masterMenu: SidebarMenu[] = [
      {
        label: 'Master Data',
        privilege: 'master-main',
        icon: 'masterData',
        url: this.baseRoute + 'masterData',
      },
    ];
    const paymentMenu: SidebarMenu[] = [
      {
        privilege: 'payment',
        label: 'Payment',
        icon: 'payment',
        url: this.baseRoute + '/payment',
      },
    ];
    const settingsMenu: SidebarMenu[] = [
      {
        privilege: 'settings-main',
        label: 'Settings',
        icon: 'settings',
        url: this.baseRoute + '/settings',
        children: [
          {
            privilege: 'lookup',
            label: 'Look Ups',
            icon: 'lookups',
            url: this.baseRoute + '/lookups',
          },
          {
            privilege: 'configuration-main',
            label: 'Configure',
            icon: 'configure',
            url: this.baseRoute + '/configure',
          },
          {
            privilege: 'data-main',
            label: 'Data',
            icon: 'data',
            url: this.baseRoute + '/data',
          },
          {
            privilege: 'association-main',
            label: 'Association',
            icon: 'association',
            url: this.baseRoute + '/association',
          },
        ],
      },
    ];

    const sidebarMenu: SidebarMenu[] = [];
    switch (authorityType) {
      case Authority.ADMIN:
        const menus = commonMenu.concat(paymentMenu, settingsMenu);
        this.setMenu(menus, privileges, sidebarMenu);
        break;
      case Authority.USER:
        break;
    }
    return sidebarMenu;
  }

  private setMenu(menus: SidebarMenu[], privileges: string[], sidebarMenu: SidebarMenu[]) {
    menus.forEach(menu => {
      if (privileges.includes(menu.privilege)) {
        sidebarMenu.push(menu);
      }
    });
  }
}

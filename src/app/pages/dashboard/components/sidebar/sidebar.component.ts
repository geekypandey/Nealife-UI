import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'nl-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  menus: { label: string; icon: string; url?: string }[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      url: '/dashboard/admin',
    },
    {
      label: 'Register Company',
      icon: 'register',
      url: '/dashboard/register',
    },
    {
      label: 'Assign',
      icon: 'assign',
    },
    {
      label: 'Results',
      icon: 'results',
    },
    {
      label: 'Payment',
      icon: 'payment',
    },
    {
      label: 'Settings',
      icon: 'settings',
    },
    {
      label: 'Administrator',
      icon: 'admin',
    },
  ];
}

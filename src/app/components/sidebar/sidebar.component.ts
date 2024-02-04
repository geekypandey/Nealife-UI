import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarMenu } from './../../pages/assess/assess.model';

@Component({
  selector: 'nl-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() menus: SidebarMenu[] = [];
  @Input() defaultRoute: string = '/';
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { HeaderComponent } from '../components/header/header.component';
import { TableComponent } from 'src/app/components/table/table.component';

@Component({
  selector: 'nl-admin',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent, TableComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {}

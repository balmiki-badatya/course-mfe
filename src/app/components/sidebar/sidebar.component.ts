import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['../../../styles/sidebar.styles.css']
})
export class SidebarComponent {
  isExpanded = true;

  menuItems = [
    {
      icon: 'dashboard',
      label: 'Programs',
      route: '/programs',
      active: true
    },
    {
      icon: 'resources',
      label: 'Resources',
      route: '/resources',
      active: false
    },
    {
      icon: 'labs',
      label: 'Labs',
      route: '/labs',
      active: false
    }
  ];

  toggleSidebar(): void {
    this.isExpanded = !this.isExpanded;
  }

  setActive(index: number): void {
    this.menuItems.forEach((item, i) => {
      item.active = i === index;
    });
  }
}


import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  menuItems = [
    { label: 'Tableau de bord', route: '/app/dashboard', icon: 'dashboard' },
    { label: 'Projets', route: '/app/projects', icon: 'folder' },
    { label: 'Tâches', route: '/app/tasks', icon: 'list' },
    { label: 'Équipe', route: '/app/team', icon: 'users' },
  ];
}

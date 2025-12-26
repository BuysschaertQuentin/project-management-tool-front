import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  isCollapsed = signal(false);

  menuItems = [
    { label: 'Tableau de bord', route: '/app/dashboard', icon: 'dashboard' },
    { label: 'Projets', route: '/app/projects', icon: 'folder' },
    { label: 'Mes Tâches', route: '/app/tasks', icon: 'tasks' },
    { label: 'Équipe', route: '/app/team', icon: 'users' },
  ];

  toggleCollapse() {
    this.isCollapsed.update(v => !v);
  }
}

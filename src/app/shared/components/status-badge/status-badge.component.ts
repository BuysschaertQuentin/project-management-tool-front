import { Component, input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: `
    <span [class]="'px-3 py-1 rounded-full text-xs font-medium ' + getStatusClass()">
      {{ getLabel() }}
    </span>
  `
})
export class StatusBadgeComponent {
  status = input.required<string>();

  getStatusClass(): string {
    switch (this.status()) {
      case 'TODO': return 'bg-gray-100 text-gray-700';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-700';
      case 'DONE': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getLabel(): string {
    switch (this.status()) {
      case 'TODO': return 'À faire';
      case 'IN_PROGRESS': return 'En cours';
      case 'DONE': return 'Terminé';
      default: return this.status();
    }
  }
}

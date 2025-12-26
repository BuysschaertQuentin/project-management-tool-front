import { Component, input } from '@angular/core';

@Component({
  selector: 'app-priority-badge',
  standalone: true,
  template: `
    <span [class]="'px-2 py-0.5 rounded text-xs font-medium ' + getPriorityClass()">
      {{ getLabel() }}
    </span>
  `
})
export class PriorityBadgeComponent {
  priority = input.required<string>();
  showLabel = input(true);

  getPriorityClass(): string {
    switch (this.priority()) {
      case 'HIGH': case 'URGENT': return 'bg-red-100 text-red-700';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700';
      case 'LOW': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getLabel(): string {
    if (!this.showLabel()) return this.priority();
    switch (this.priority()) {
      case 'HIGH': return 'Haute';
      case 'MEDIUM': return 'Moyenne';
      case 'LOW': return 'Basse';
      case 'URGENT': return 'Urgente';
      default: return this.priority();
    }
  }
}

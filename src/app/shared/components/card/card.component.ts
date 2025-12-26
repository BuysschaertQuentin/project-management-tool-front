import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `
    <div [class]="getCardClasses()">
      @if (title()) {
        <div class="card-header p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 class="font-semibold text-gray-900">{{ title() }}</h3>
          <ng-content select="[card-actions]"></ng-content>
        </div>
      }
      <div class="card-body" [class]="padding() ? 'p-6' : ''">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class CardComponent {
  title = input<string>('');
  clickable = input(false);
  padding = input(true);
  customClass = input<string>('');

  getCardClasses(): string {
    const base = 'bg-white rounded-xl border border-gray-100 shadow-sm transition-all';
    const interactive = this.clickable() ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : '';
    return `${base} ${interactive} ${this.customClass()}`;
  }
}

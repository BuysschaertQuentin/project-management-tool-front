import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <ng-content select="[icon]"></ng-content>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ title() }}</h3>
      <p class="text-gray-500 mb-6">{{ message() }}</p>
      @if (showAction()) {
        <button (click)="action.emit()"
                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all">
          {{ actionLabel() }}
        </button>
      }
    </div>
  `
})
export class EmptyStateComponent {
  title = input.required<string>();
  message = input.required<string>();
  actionLabel = input('Action');
  showAction = input(true);
  action = output<void>();
}

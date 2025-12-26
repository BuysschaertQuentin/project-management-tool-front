import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      @if (message()) {
        <span class="ml-3 text-gray-600">{{ message() }}</span>
      }
    </div>
  `
})
export class LoadingSpinnerComponent {
  message = input<string>('Chargement...');
}

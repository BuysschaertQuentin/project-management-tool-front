import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  template: `
    <div [class]="getAlertClasses()" role="alert">
      <div class="flex items-start gap-3">
        @if (showIcon()) {
          <div class="flex-shrink-0 mt-0.5">
            @switch (type()) {
              @case ('error') {
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
              }
              @case ('success') {
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
              }
              @case ('warning') {
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
              }
              @case ('info') {
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              }
            }
          </div>
        }
        <div class="flex-1">
          @if (title()) {
            <p class="font-medium mb-1">{{ title() }}</p>
          }
          <p>{{ message() }}</p>
        </div>
        @if (dismissible()) {
          <button (click)="dismissed.emit()" class="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        }
      </div>
    </div>
  `
})
export class AlertComponent {
  type = input<'error' | 'success' | 'warning' | 'info'>('error');
  title = input<string>('');
  message = input.required<string>();
  dismissible = input(false);
  showIcon = input(true);
  dismissed = output<void>();

  getAlertClasses(): string {
    const baseClasses = 'px-4 py-3 rounded-xl border';
    switch (this.type()) {
      case 'error': return `${baseClasses} bg-red-50 border-red-200 text-red-700`;
      case 'success': return `${baseClasses} bg-green-50 border-green-200 text-green-700`;
      case 'warning': return `${baseClasses} bg-yellow-50 border-yellow-200 text-yellow-700`;
      case 'info': return `${baseClasses} bg-blue-50 border-blue-200 text-blue-700`;
    }
  }
}

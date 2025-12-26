import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  template: `
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" (click)="cancel.emit()">
      <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl" (click)="$event.stopPropagation()">
        <!-- Header with icon -->
        <div class="p-6 text-center">
          <div [class]="'w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ' + getIconBgClass()">
            @switch (type()) {
              @case ('danger') {
                <svg xmlns="http://www.w3.org/2000/svg" [class]="'w-8 h-8 ' + getIconClass()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <circle cx="12" cy="17" r="0.5" fill="currentColor"/>
                </svg>
              }
              @case ('warning') {
                <svg xmlns="http://www.w3.org/2000/svg" [class]="'w-8 h-8 ' + getIconClass()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <circle cx="12" cy="16" r="0.5" fill="currentColor"/>
                </svg>
              }
              @default {
                <svg xmlns="http://www.w3.org/2000/svg" [class]="'w-8 h-8 ' + getIconClass()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <circle cx="12" cy="8" r="0.5" fill="currentColor"/>
                </svg>
              }
            }
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ title() }}</h3>
          <p class="text-gray-600">{{ message() }}</p>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 p-6 pt-0">
          <button (click)="cancel.emit()"
                  class="flex-1 px-4 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all">
            {{ cancelLabel() }}
          </button>
          <button (click)="confirm.emit()"
                  [class]="'flex-1 px-4 py-3 rounded-lg font-medium transition-all ' + getConfirmButtonClass()">
            {{ confirmLabel() }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class ConfirmModalComponent {
  type = input<'danger' | 'warning' | 'info'>('danger');
  title = input.required<string>();
  message = input.required<string>();
  confirmLabel = input('Confirmer');
  cancelLabel = input('Annuler');

  confirm = output<void>();
  cancel = output<void>();

  getIconBgClass(): string {
    switch (this.type()) {
      case 'danger': return 'bg-red-100';
      case 'warning': return 'bg-yellow-100';
      default: return 'bg-blue-100';
    }
  }

  getIconClass(): string {
    switch (this.type()) {
      case 'danger': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-blue-600';
    }
  }

  getConfirmButtonClass(): string {
    switch (this.type()) {
      case 'danger': return 'bg-red-600 hover:bg-red-700 text-white';
      case 'warning': return 'bg-yellow-600 hover:bg-yellow-700 text-white';
      default: return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  }
}

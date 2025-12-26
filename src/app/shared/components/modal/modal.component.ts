import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" (click)="close.emit()">
      <div [class]="'bg-white rounded-2xl w-full shadow-2xl ' + getSizeClass()" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 class="text-xl font-semibold text-gray-900">{{ title() }}</h2>
          <button (click)="close.emit()" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div class="p-6">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `
})
export class ModalComponent {
  title = input.required<string>();
  size = input<'sm' | 'md' | 'lg'>('md');
  close = output<void>();

  getSizeClass(): string {
    const sizes: Record<string, string> = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg'
    };
    return sizes[this.size()];
  }
}

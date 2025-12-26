import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button
      [type]="type()"
      [disabled]="disabled() || loading()"
      [class]="getButtonClasses()">
      @if (loading()) {
        <div class="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
      }
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  type = input<'button' | 'submit'>('button');
  variant = input<'primary' | 'secondary' | 'danger' | 'ghost'>('primary');
  size = input<'sm' | 'md' | 'lg'>('md');
  disabled = input(false);
  loading = input(false);

  getButtonClasses(): string {
    const base = 'flex items-center gap-2 font-medium transition-all rounded-lg disabled:opacity-50 disabled:cursor-not-allowed';

    const variants: Record<string, string> = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white hover:-translate-y-0.5 shadow-sm',
      secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
      ghost: 'bg-transparent hover:bg-gray-100 text-gray-700'
    };

    const sizes: Record<string, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5',
      lg: 'px-6 py-3 text-lg'
    };

    return `${base} ${variants[this.variant()]} ${sizes[this.size()]}`;
  }
}

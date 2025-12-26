import { Component, input } from '@angular/core';

@Component({
  selector: 'app-btn-primary',
  standalone: true,
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all hover:-translate-y-0.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0">
      <ng-content></ng-content>
    </button>
  `
})
export class BtnPrimaryComponent {
  type = input<'button' | 'submit'>('button');
  disabled = input(false);
}

import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-another-page',
  standalone: true,
  imports: [],
  templateUrl: './another-page.component.html',
  styleUrl: './another-page.component.scss'
})
export class AnotherPageComponent {
  private router = inject(Router);

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-another-page',
  imports: [],
  templateUrl: './another-page.component.html',
  styleUrl: './another-page.component.scss'
})
export class AnotherPageComponent {
  constructor(
    private router: Router
  ) {}

  public navigateToHome(): void {
    this.router.navigate(['/home']);
  }
}

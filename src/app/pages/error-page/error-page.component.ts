import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-error-page',
  imports: [CommonModule],
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  errorCode: string | null = null;

  get title(): string {
    switch (this.errorCode) {
      case '404': return 'Page introuvable';
      case '500': return 'Erreur interne';
      default: return 'Oups, une erreur est survenue';
    }
  }

  get message(): string {
    switch (this.errorCode) {
      case '404': return 'La page que vous cherchez n’existe pas.';
      case '500': return 'Un problème technique est survenu.';
      default: return 'Veuillez réessayer plus tard.';
    }
  }

  constructor() {
    this.errorCode = this.route.snapshot.queryParamMap.get('code');
  }

  goHome() {
    this.router.navigate(['/']);
  }
}

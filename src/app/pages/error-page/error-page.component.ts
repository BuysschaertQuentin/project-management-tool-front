import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss'
})
export class ErrorPageComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  errorCode = signal<string | null>(this.route.snapshot.queryParamMap.get('code'));

  title = computed(() => {
    switch (this.errorCode()) {
      case '404': return 'Page introuvable';
      case '500': return 'Erreur interne';
      default: return 'Oups, une erreur est survenue';
    }
  });

  message = computed(() => {
    switch (this.errorCode()) {
      case '404': return 'La page que vous cherchez n\'existe pas.';
      case '500': return 'Un problème technique est survenu.';
      default: return 'Veuillez réessayer plus tard.';
    }
  });

  goHome() {
    this.router.navigate(['/']);
  }
}

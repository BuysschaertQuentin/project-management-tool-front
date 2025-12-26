import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorService, AppError } from '../../core/services/error.service';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss'
})
export class ErrorPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private errorService = inject(ErrorService);

  // Récupère le code d'erreur depuis l'URL ou l'historique du service
  errorCode = signal<string>('');
  errorDetails = signal<AppError | null>(null);

  // Messages par défaut si pas d'erreur spécifique
  title = computed(() => {
    const details = this.errorDetails();
    if (details) return details.title;
    return this.getDefaultTitle(this.errorCode());
  });

  message = computed(() => {
    const details = this.errorDetails();
    if (details) return details.message;
    return this.getDefaultMessage(this.errorCode());
  });

  icon = computed(() => {
    const code = this.errorCode();
    switch (code) {
      case '401': return 'lock';
      case '403': return 'shield';
      case '404': return 'search';
      case '500': return 'server';
      default: return 'alert';
    }
  });

  ngOnInit() {
    // Récupérer le code depuis les query params
    const code = this.route.snapshot.queryParamMap.get('code') || '500';
    this.errorCode.set(code);

    // Récupérer les détails de la dernière erreur si disponibles
    const history = this.errorService.errorHistory();
    if (history.length > 0) {
      const lastError = history[0];
      // Si le code correspond, utiliser les détails
      if (lastError.code.toString() === code) {
        this.errorDetails.set(lastError);
      }
    }
  }

  private getDefaultTitle(code: string): string {
    switch (code) {
      case '400': return 'Requête invalide';
      case '401': return 'Connexion requise';
      case '403': return 'Accès refusé';
      case '404': return 'Page introuvable';
      case '409': return 'Conflit détecté';
      case '500': return 'Erreur serveur';
      case '502': return 'Service indisponible';
      case '503': return 'Maintenance en cours';
      default: return 'Oups, une erreur est survenue';
    }
  }

  private getDefaultMessage(code: string): string {
    switch (code) {
      case '400': return 'Les données envoyées sont incorrectes. Veuillez vérifier votre saisie.';
      case '401': return 'Vous devez vous connecter pour accéder à cette page.';
      case '403': return 'Vous n\'avez pas les droits nécessaires pour accéder à cette ressource.';
      case '404': return 'La page que vous cherchez n\'existe pas ou a été déplacée.';
      case '409': return 'Cette opération n\'est pas possible dans l\'état actuel.';
      case '500': return 'Un problème technique est survenu. Nos équipes ont été notifiées.';
      case '502': return 'Le serveur est temporairement inaccessible. Veuillez réessayer.';
      case '503': return 'Le service est en maintenance. Veuillez revenir plus tard.';
      default: return 'Une erreur inattendue s\'est produite. Veuillez réessayer.';
    }
  }

  goHome() {
    this.router.navigate(['/app/dashboard']);
  }

  goBack() {
    window.history.back();
  }

  goLogin() {
    this.router.navigate(['/login']);
  }
}

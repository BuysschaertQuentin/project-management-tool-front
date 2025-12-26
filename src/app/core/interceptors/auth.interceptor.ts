/**
 * AUTH INTERCEPTOR - Injection automatique du token et gestion des erreurs
 *
 * Cet intercepteur :
 * 1. Ajoute le token d'authentification aux requêtes (quand JWT sera implémenté)
 * 2. Intercepte les erreurs HTTP et les gère de manière centralisée
 * 3. Gère les erreurs d'authentification (401/403)
 *
 * ⚠️ ÉTAT ACTUEL : Token non implémenté, gestion basique des erreurs
 *
 * ============================================================================
 * 🔐 CE QU'IL FAUDRAIT FAIRE POUR SÉCURISER L'APPLICATION :
 * ============================================================================
 *
 * 1. AJOUTER LE TOKEN JWT À CHAQUE REQUÊTE
 * 2. GÉRER LE REFRESH TOKEN AUTOMATIQUE
 * 3. IMPLÉMENTER LA DÉCONNEXION SUR EXPIRATION
 *
 * Voir les commentaires détaillés dans le code ci-dessous.
 * ============================================================================
 */

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ErrorService } from '../services/error.service';
import { API_URL } from '../constants';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const errorService = inject(ErrorService);
  const router = inject(Router);

  // URLs exclues de l'interception (login, register ne nécessitent pas de token)
  const excludedUrls = ['/api/auth/login', '/api/auth/register'];
  const isExcluded = excludedUrls.some(url => req.url.includes(url));

  // Vérifier si la requête est destinée à notre API
  const isApiRequest = req.url.startsWith(API_URL);

  // TODO: Implémenter l'ajout du token JWT quand le backend sera prêt
  // Si c'est une requête API et qu'on a un token, l'ajouter
  /*
  if (isApiRequest && !isExcluded) {
    const token = authService.getAccessToken();
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  }
  */

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Gérer les erreurs réseau
      if (errorService.isNetworkError(error)) {
        errorService.showError({
          code: 0,
          title: 'Connexion impossible',
          message: 'Impossible de contacter le serveur. Vérifiez votre connexion internet.',
          timestamp: new Date()
        });
        return throwError(() => error);
      }

      // Gérer les erreurs d'authentification
      if (error.status === 401 && !isExcluded) {
        console.error('Erreur 401: Session expirée ou non authentifié');

        // TODO: Implémenter le refresh token avant de déconnecter
        /*
        return authService.refreshToken().pipe(
          switchMap(() => {
            const newToken = authService.getAccessToken();
            const clonedReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` }
            });
            return next(clonedReq);
          }),
          catchError((refreshError) => {
            authService.logout();
            router.navigate(['/login'], { queryParams: { sessionExpired: true } });
            return throwError(() => refreshError);
          })
        );
        */

        // Pour l'instant, déconnecter directement
        authService.logout();
        router.navigate(['/login']);
      }
      else if (error.status === 403) {
        console.error('Erreur 403: Accès interdit');
        errorService.navigateToErrorPage(403);
      }
      else if (error.status >= 500) {
        // Erreurs serveur - notifier l'utilisateur
        const appError = errorService.handleHttpError(error, req.url);
        console.error('Erreur serveur:', appError);
      }

      // Laisser l'erreur se propager pour que les composants puissent la gérer localement
      return throwError(() => error);
    })
  );
};

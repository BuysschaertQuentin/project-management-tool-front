/**
 * AUTH GUARD - Protection des routes côté client
 *
 * ⚠️ SÉCURITÉ ACTUELLE : Basique (vérification localStorage uniquement)
 *
 * Ce guard vérifie si un utilisateur est "connecté" en regardant le signal currentUser.
 * Actuellement, ce n'est PAS sécurisé car :
 * - Le token n'est pas validé côté serveur
 * - Un utilisateur malveillant pourrait créer un faux objet utilisateur dans localStorage
 *
 * ============================================================================
 * 🔐 CE QU'IL FAUDRAIT FAIRE POUR SÉCURISER L'APPLICATION :
 * ============================================================================
 *
 * 1. IMPLÉMENTER JWT (JSON Web Token) CÔTÉ BACKEND :
 *    - À la connexion, le backend génère un JWT signé contenant l'ID utilisateur
 *    - Le JWT a une durée de vie limitée (ex: 15 min pour l'access token)
 *    - Utiliser un refresh token (durée plus longue) pour renouveler l'access token
 *
 * 2. STOCKER LE TOKEN DE MANIÈRE SÉCURISÉE :
 *    - Option 1: HttpOnly Cookie (le plus sécurisé contre XSS)
 *    - Option 2: localStorage/sessionStorage (plus simple mais vulnérable XSS)
 *    - Ne JAMAIS stocker le mot de passe, uniquement le token
 *
 * 3. VALIDER LE TOKEN DANS CE GUARD :
 *    - Vérifier que le token existe ET n'est pas expiré
 *    - Optionellement: appeler un endpoint /api/auth/verify pour valider côté serveur
 *    - Exemple de code avec validation d'expiration :
 *      ```typescript
 *      const token = authService.getToken();
 *      if (!token || authService.isTokenExpired(token)) {
 *        authService.logout();
 *        return router.createUrlTree(['/login']);
 *      }
 *      ```
 *
 * 4. GÉRER LE REFRESH TOKEN :
 *    - Si l'access token est expiré mais le refresh token est valide
 *    - Appeler /api/auth/refresh pour obtenir un nouveau access token
 *    - Si le refresh échoue, déconnecter l'utilisateur
 *
 * 5. PROTÉGER CONTRE LES ATTAQUES :
 *    - CSRF : Utiliser des tokens CSRF avec les cookies
 *    - XSS : Sanitiser toutes les entrées utilisateur
 *    - Brute force : Rate limiting côté backend
 * ============================================================================
 */

import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // ⚠️ VÉRIFICATION ACTUELLE : Simplement si un utilisateur existe en mémoire
  // Cette vérification n'est PAS sécurisée - voir commentaires en haut du fichier
  if (authService.currentUser()) {
    return true;
  }

  // Redirige vers la page de connexion avec l'URL de retour
  // Permet de revenir à la page demandée après connexion
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

/**
 * 🔒 EXEMPLE D'IMPLÉMENTATION SÉCURISÉE (à adapter selon vos besoins) :
 *
 * export const authGuard: CanActivateFn = (route, state) => {
 *   const authService = inject(AuthService);
 *   const router = inject(Router);
 *
 *   const token = authService.getAccessToken();
 *
 *   // Pas de token = pas connecté
 *   if (!token) {
 *     return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
 *   }
 *
 *   // Token expiré = tenter un refresh
 *   if (authService.isTokenExpired(token)) {
 *     return authService.refreshToken().pipe(
 *       map(() => true),
 *       catchError(() => {
 *         authService.logout();
 *         return of(router.createUrlTree(['/login']));
 *       })
 *     );
 *   }
 *
 *   // Token valide = accès autorisé
 *   return true;
 * };
 */

import { Routes } from '@angular/router';
import { AnotherPageComponent } from './pages/another-page/another-page.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'home',
    component: HomeComponent,
    title: 'Accueil'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Connexion'
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Inscription'
  },
  {
    path: 'another-page',
    component: AnotherPageComponent,
    title: 'Autre page (Protégée)',
    canActivate: [authGuard]
  },
  {
    path: 'error',
    component: ErrorPageComponent,
    title: 'Erreur'
  },
  {
    path: '**',
    redirectTo: '/error?code=404'
  }
];

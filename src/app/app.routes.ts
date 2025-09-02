import { Routes } from '@angular/router';
import { AnotherPageComponent } from './pages/another-page/another-page.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { HomeComponent } from './pages/home/home.component';

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
    path: 'another-page',
    component: AnotherPageComponent,
    title: 'Autre page'
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

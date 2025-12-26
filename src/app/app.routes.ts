import { Routes } from '@angular/router';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProjectsComponent } from './pages/projects/projects.component';

export const routes: Routes = [
  // Public Routes (Auth)
  {
    path: 'login',
    component: LoginComponent,
    title: 'Connexion - PMT'
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Inscription - PMT'
  },

  // Protected Routes (App Shell with Layout)
  {
    path: 'app',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        title: 'Tableau de bord - PMT'
      },
      {
        path: 'projects',
        component: ProjectsComponent,
        title: 'Mes Projets - PMT'
      },
      {
        path: 'projects/:id',
        loadComponent: () => import('./pages/project-detail/project-detail.component').then(m => m.ProjectDetailComponent),
        title: 'Détail Projet - PMT'
      },
      {
        path: 'tasks',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent), // Placeholder
        title: 'Mes Tâches - PMT'
      },
      {
        path: 'team',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent), // Placeholder
        title: 'Équipe - PMT'
      }
    ]
  },

  // Fallback and Root
  {
    path: '',
    redirectTo: 'app/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'home',
    redirectTo: 'app/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'error',
    component: ErrorPageComponent,
    title: 'Erreur - PMT'
  },
  {
    path: '**',
    redirectTo: '/error?code=404'
  }
];

import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ProjectService } from '../../core/services/project.service';
import { Project } from '../../core/models/project.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './projects.component.html'
})
export class ProjectsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private projectService = inject(ProjectService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;
  projects = signal<Project[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  // Modal state
  showCreateModal = signal(false);
  isCreating = signal(false);
  createError = signal<string | null>(null);

  projectForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(2000)]],
    startDate: ['', [Validators.required]]
  });

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    const userId = this.currentUser()?.id;
    if (!userId) return;

    this.isLoading.set(true);
    this.error.set(null);

    this.projectService.getUserProjects(userId).subscribe({
      next: (projects) => {
        this.projects.set(projects);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading projects:', err);
        this.error.set('Erreur lors du chargement des projets');
        this.isLoading.set(false);
      }
    });
  }

  openCreateModal() {
    this.showCreateModal.set(true);
    this.projectForm.reset();
    this.createError.set(null);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  createProject() {
    if (this.projectForm.invalid) return;

    const userId = this.currentUser()?.id;
    if (!userId) return;

    this.isCreating.set(true);
    this.createError.set(null);

    const { name, description, startDate } = this.projectForm.value;

    this.projectService.createProject({
      name: name!,
      description: description || '',
      startDate: startDate!,
      createdByUserId: userId
    }).subscribe({
      next: (project) => {
        this.projects.update(list => [project, ...list]);
        this.closeCreateModal();
        this.isCreating.set(false);
      },
      error: (err) => {
        console.error('Error creating project:', err);
        this.createError.set('Erreur lors de la création du projet');
        this.isCreating.set(false);
      }
    });
  }

  goToProject(projectId: number) {
    this.router.navigate(['/app/projects', projectId]);
  }
}

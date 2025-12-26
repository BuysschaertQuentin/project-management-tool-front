import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ProjectService } from '../../core/services/project.service';
import { TaskService } from '../../core/services/task.service';
import { Project } from '../../core/models/project.model';
import { Task } from '../../core/models/task.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;
  projects = signal<Project[]>([]);
  tasks = signal<Task[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  // Computed stats
  stats = computed(() => [
    {
      label: 'Projets actifs',
      value: this.projects().length,
      icon: 'folder',
      color: 'blue',
      route: '/app/projects'
    },
    {
      label: 'Tâches en cours',
      value: this.tasks().filter(t => t.status === 'IN_PROGRESS').length,
      icon: 'tasks',
      color: 'yellow',
      route: '/app/tasks'
    },
    {
      label: 'Tâches terminées',
      value: this.tasks().filter(t => t.status === 'DONE').length,
      icon: 'check',
      color: 'green',
      route: '/app/tasks'
    },
    {
      label: 'À faire',
      value: this.tasks().filter(t => t.status === 'TODO').length,
      icon: 'todo',
      color: 'purple',
      route: '/app/tasks'
    },
  ]);

  // Recent tasks assigned to current user (last 5)
  recentTasks = computed(() =>
    this.tasks()
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
  );

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const userId = this.currentUser()?.id;
    if (!userId) return;

    this.isLoading.set(true);
    this.error.set(null);

    // Load projects
    this.projectService.getUserProjects(userId).subscribe({
      next: (projects) => this.projects.set(projects),
      error: (err) => {
        console.error('Error loading projects:', err);
        this.error.set('Erreur lors du chargement des projets');
      }
    });

    // Load tasks assigned to user
    this.taskService.getUserTasks(userId).subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
        this.error.set('Erreur lors du chargement des tâches');
        this.isLoading.set(false);
      }
    });
  }

  goToProject(projectId: number) {
    this.router.navigate(['/app/projects', projectId]);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-700';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}

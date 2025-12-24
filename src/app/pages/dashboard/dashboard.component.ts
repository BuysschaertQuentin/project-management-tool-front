import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ProjectService } from '../../core/services/project.service';
import { TaskService } from '../../core/services/task.service';
import { Project } from '../../core/models/project.model';
import { Task, TaskStatus } from '../../core/models/task.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);

  // User info
  currentUser = this.authService.currentUser;

  // Data signals
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
      color: 'blue'
    },
    {
      label: 'Tâches en cours',
      value: this.tasks().filter(t => t.status === TaskStatus.IN_PROGRESS).length,
      icon: 'tasks',
      color: 'yellow'
    },
    {
      label: 'Tâches terminées',
      value: this.tasks().filter(t => t.status === TaskStatus.DONE).length,
      icon: 'check',
      color: 'green'
    },
    {
      label: 'À faire',
      value: this.tasks().filter(t => t.status === TaskStatus.TODO).length,
      icon: 'todo',
      color: 'purple'
    },
  ]);

  // Recent tasks (last 5)
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

    // Load tasks
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
}

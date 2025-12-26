import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { TaskService } from '../../core/services/task.service';
import { Task } from '../../core/models/task.model';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './tasks.component.html'
})
export class TasksComponent implements OnInit {
  private authService = inject(AuthService);
  private taskService = inject(TaskService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;
  tasks = signal<Task[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  // Filter
  statusFilter = signal<string | null>(null);

  // Computed filtered tasks
  filteredTasks = computed(() => {
    const filter = this.statusFilter();
    if (!filter) return this.tasks();
    return this.tasks().filter(t => t.status === filter);
  });

  // Stats
  todoCount = computed(() => this.tasks().filter(t => t.status === 'TODO').length);
  inProgressCount = computed(() => this.tasks().filter(t => t.status === 'IN_PROGRESS').length);
  doneCount = computed(() => this.tasks().filter(t => t.status === 'DONE').length);

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    const userId = this.currentUser()?.id;
    if (!userId) return;

    this.isLoading.set(true);
    this.taskService.getUserTasks(userId).subscribe({
      next: (tasks) => {
        // Sort by most recent first
        this.tasks.set(tasks.sort((a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
        this.error.set('Erreur lors du chargement des tâches');
        this.isLoading.set(false);
      }
    });
  }

  setFilter(status: string | null) {
    this.statusFilter.set(status);
  }

  goToProject(projectId: number) {
    this.router.navigate(['/app/projects', projectId]);
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-700';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'TODO': return 'bg-gray-100 text-gray-700';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-700';
      case 'DONE': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'TODO': return 'À faire';
      case 'IN_PROGRESS': return 'En cours';
      case 'DONE': return 'Terminé';
      default: return status;
    }
  }
}

import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ProjectService } from '../../core/services/project.service';
import { TaskService } from '../../core/services/task.service';
import { Project } from '../../core/models/project.model';
import { Task, TaskStatus, TaskPriority } from '../../core/models/task.model';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './project-detail.component.html'
})
export class ProjectDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private projectService = inject(ProjectService);
  private taskService = inject(TaskService);

  currentUser = this.authService.currentUser;
  project = signal<Project | null>(null);
  tasks = signal<Task[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  // Modal state
  showCreateModal = signal(false);
  isCreating = signal(false);
  createError = signal<string | null>(null);

  // Kanban columns
  columns = [
    { id: TaskStatus.TODO, label: 'À faire', color: 'gray' },
    { id: TaskStatus.IN_PROGRESS, label: 'En cours', color: 'yellow' },
    { id: TaskStatus.DONE, label: 'Terminé', color: 'green' }
  ];

  priorities = [
    { value: TaskPriority.LOW, label: 'Basse' },
    { value: TaskPriority.MEDIUM, label: 'Moyenne' },
    { value: TaskPriority.HIGH, label: 'Haute' }
  ];

  taskForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
    description: ['', [Validators.maxLength(2000)]],
    dueDate: ['', [Validators.required]],
    priority: [TaskPriority.MEDIUM, [Validators.required]]
  });

  // Computed tasks by status
  todoTasks = computed(() => this.tasks().filter(t => t.status === TaskStatus.TODO));
  inProgressTasks = computed(() => this.tasks().filter(t => t.status === TaskStatus.IN_PROGRESS));
  doneTasks = computed(() => this.tasks().filter(t => t.status === TaskStatus.DONE));

  getTasksByStatus(status: string) {
    return this.tasks().filter(t => t.status === status);
  }

  ngOnInit() {
    const projectId = Number(this.route.snapshot.paramMap.get('id'));
    if (projectId) {
      this.loadProject(projectId);
      this.loadTasks(projectId);
    }
  }

  loadProject(projectId: number) {
    this.projectService.getProject(projectId).subscribe({
      next: (project) => this.project.set(project),
      error: (err) => {
        console.error('Error loading project:', err);
        this.error.set('Projet introuvable');
        this.isLoading.set(false);
      }
    });
  }

  loadTasks(projectId: number) {
    this.taskService.getProjectTasks(projectId).subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
        this.isLoading.set(false);
      }
    });
  }

  openCreateModal() {
    this.showCreateModal.set(true);
    this.taskForm.reset({ priority: TaskPriority.MEDIUM });
    this.createError.set(null);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
  }

  createTask() {
    if (this.taskForm.invalid || !this.project()) return;

    const userId = this.currentUser()?.id;
    if (!userId) return;

    this.isCreating.set(true);
    this.createError.set(null);

    const { name, description, dueDate, priority } = this.taskForm.value;

    this.taskService.createTask(this.project()!.id, {
      name: name!,
      description: description || '',
      dueDate: dueDate!,
      priority: priority!,
      createdByUserId: userId
    }).subscribe({
      next: (task) => {
        this.tasks.update(list => [...list, task]);
        this.closeCreateModal();
        this.isCreating.set(false);
      },
      error: (err) => {
        console.error('Error creating task:', err);
        this.createError.set('Erreur lors de la création de la tâche');
        this.isCreating.set(false);
      }
    });
  }

  updateTaskStatus(task: Task, newStatus: string) {
    this.taskService.updateTask(task.id, { status: newStatus }).subscribe({
      next: (updatedTask) => {
        this.tasks.update(list =>
          list.map(t => t.id === updatedTask.id ? updatedTask : t)
        );
      },
      error: (err) => console.error('Error updating task:', err)
    });
  }

  goBack() {
    this.router.navigate(['/app/projects']);
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-700';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}

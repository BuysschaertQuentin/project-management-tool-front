import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_URL } from '../constants';
import { Task, TaskCreateRequest, TaskUpdateRequest } from '../models/task.model';
import { TaskHistory } from '../models/task-history.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);

  userTasks = signal<Task[]>([]);

  getUserTasks(userId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${API_URL}/users/${userId}/tasks`).pipe(
      tap(tasks => this.userTasks.set(tasks))
    );
  }

  createTask(projectId: number, task: TaskCreateRequest): Observable<Task> {
    return this.http.post<Task>(`${API_URL}/projects/${projectId}/tasks`, task);
  }

  getProjectTasks(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${API_URL}/projects/${projectId}/tasks`);
  }

  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${API_URL}/tasks/${id}`);
  }

  updateTask(id: number, task: TaskUpdateRequest): Observable<Task> {
    return this.http.put<Task>(`${API_URL}/tasks/${id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/tasks/${id}`);
  }

  assignTask(id: number, assigneeId: number): Observable<Task> {
    return this.http.put<Task>(`${API_URL}/tasks/${id}/assign`, { assigneeId });
  }

  getTaskHistory(taskId: number): Observable<TaskHistory[]> {
    return this.http.get<TaskHistory[]>(`${API_URL}/tasks/${taskId}/history`);
  }
}

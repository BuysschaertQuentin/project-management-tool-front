import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../constants';
import { Task, TaskCreateRequest, TaskUpdateRequest } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);

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

  assignTask(id: number, assigneeId: number): Observable<Task> {
    return this.http.put<Task>(`${API_URL}/tasks/${id}/assign`, { assigneeId });
  }
}

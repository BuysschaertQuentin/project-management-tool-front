import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_URL } from '../constants';
import { Project, ProjectCreateRequest } from '../models/project.model';
import { UserResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${API_URL}/projects`;

  // Signal to cache user's projects
  userProjects = signal<Project[]>([]);

  getUserProjects(userId: number): Observable<Project[]> {
    return this.http.get<Project[]>(`${API_URL}/users/${userId}/projects`).pipe(
      tap(projects => this.userProjects.set(projects))
    );
  }

  createProject(project: ProjectCreateRequest): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project);
  }

  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  getProjectMembers(projectId: number): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.apiUrl}/${projectId}/members`);
  }

  inviteMember(projectId: number, email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${projectId}/members`, { email });
  }
}

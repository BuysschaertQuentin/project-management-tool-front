import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_URL } from '../constants';
import { Project, ProjectCreateRequest } from '../models/project.model';
import { UserResponse } from '../models/auth.model';

export interface ProjectMember {
  id: number;
  projectId: number;
  userId: number;
  username: string;
  email: string;
  role: string;
  joinedAt?: string;
  invitedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${API_URL}/projects`;

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

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getProjectMembers(projectId: number): Observable<ProjectMember[]> {
    return this.http.get<ProjectMember[]>(`${this.apiUrl}/${projectId}/members`);
  }

  inviteMember(projectId: number, email: string, role: string = 'MEMBER'): Observable<ProjectMember> {
    return this.http.post<ProjectMember>(`${this.apiUrl}/${projectId}/members`, { email, role });
  }

  removeMember(projectId: number, memberId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${projectId}/members/${memberId}`);
  }
}

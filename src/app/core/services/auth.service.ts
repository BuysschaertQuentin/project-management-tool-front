import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_URL } from '../constants';
import { LoginRequest, RegisterRequest, UserResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${API_URL}/auth`;

  // Signal for current user state
  currentUser = signal<UserResponse | null>(this.loadUserFromStorage());

  login(credentials: LoginRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(user => this.setUser(user))
    );
  }

  register(data: RegisterRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(user => this.setUser(user))
    );
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('user');
  }

  private setUser(user: UserResponse): void {
    this.currentUser.set(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  private loadUserFromStorage(): UserResponse | null {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  }
}

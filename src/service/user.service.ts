import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://project-management-tool-back.onrender.com/api'; 

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getUser(id: number): Observable<User> {
    // URL correcte avec un seul slash
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }
}
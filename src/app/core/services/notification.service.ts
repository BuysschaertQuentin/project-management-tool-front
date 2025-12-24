import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../constants';
import { AppNotification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);

  getUserNotifications(userId: number): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(`${API_URL}/users/${userId}/notifications`);
  }

  getUnreadNotifications(userId: number): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(`${API_URL}/users/${userId}/notifications/unread`);
  }

  markAsRead(id: number): Observable<void> {
    return this.http.put<void>(`${API_URL}/notifications/${id}/read`, {});
  }

  markAllAsRead(userId: number): Observable<void> {
    return this.http.put<void>(`${API_URL}/users/${userId}/notifications/read-all`, {});
  }
}

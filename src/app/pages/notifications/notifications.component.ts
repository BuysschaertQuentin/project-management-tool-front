import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { AppNotification, NotificationType } from '../../core/models/notification.model';
import { LoadingSpinnerComponent, AlertComponent, EmptyStateComponent, PageHeaderComponent } from '../../shared/components';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [DatePipe, LoadingSpinnerComponent, AlertComponent, EmptyStateComponent, PageHeaderComponent],
  templateUrl: './notifications.component.html'
})
export class NotificationsComponent implements OnInit {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;
  notifications = signal<AppNotification[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);
  filter = signal<'all' | 'unread'>('all');

  unreadCount = computed(() => this.notifications().filter(n => !n.isRead).length);

  filteredNotifications = computed(() => {
    const all = this.notifications();
    return this.filter() === 'unread' ? all.filter(n => !n.isRead) : all;
  });

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    const userId = this.currentUser()?.id;
    if (!userId) return;

    this.isLoading.set(true);
    this.notificationService.getUserNotifications(userId).subscribe({
      next: (notifications) => {
        this.notifications.set(notifications);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading notifications:', err);
        this.error.set('Erreur lors du chargement des notifications');
        this.isLoading.set(false);
      }
    });
  }

  markAsRead(notification: AppNotification) {
    if (notification.isRead) return;

    this.notificationService.markAsRead(notification.id).subscribe({
      next: () => {
        this.notifications.update(list =>
          list.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
        );
      },
      error: (err) => console.error('Error marking as read:', err)
    });
  }

  markAsReadOnly(event: Event, notification: AppNotification) {
    event.stopPropagation();
    this.markAsRead(notification);
  }

  markAllAsRead() {
    const userId = this.currentUser()?.id;
    if (!userId) return;

    this.notificationService.markAllAsRead(userId).subscribe({
      next: () => {
        this.notifications.update(list => list.map(n => ({ ...n, isRead: true })));
      },
      error: (err) => console.error('Error marking all as read:', err)
    });
  }

  goToTask(notification: AppNotification) {
    this.markAsRead(notification);
    if (notification.projectId) {
      this.router.navigate(['/app/projects', notification.projectId]);
    }
  }

  setFilter(filter: 'all' | 'unread') {
    this.filter.set(filter);
  }

  getNotificationIcon(type: NotificationType): string {
    switch (type) {
      case NotificationType.TASK_ASSIGNED: return 'user-plus';
      case NotificationType.TASK_UPDATED: return 'edit';
      case NotificationType.PROJECT_INVITATION: return 'mail';
      default: return 'bell';
    }
  }

  getNotificationColor(type: NotificationType): string {
    switch (type) {
      case NotificationType.TASK_ASSIGNED: return 'bg-blue-100 text-blue-600';
      case NotificationType.TASK_UPDATED: return 'bg-yellow-100 text-yellow-600';
      case NotificationType.PROJECT_INVITATION: return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  }
}

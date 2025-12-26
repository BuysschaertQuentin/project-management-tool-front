import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  unreadCount = signal(0);

  ngOnInit() {
    this.loadUnreadCount();
  }

  loadUnreadCount() {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    this.notificationService.getUnreadNotifications(userId).subscribe({
      next: (notifications) => this.unreadCount.set(notifications.length),
      error: () => this.unreadCount.set(0)
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

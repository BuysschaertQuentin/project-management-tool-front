import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { NotificationService } from './notification.service';
import { API_URL } from '../constants';

describe('NotificationService', () => {
  let service: NotificationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        NotificationService
      ]
    });

    service = TestBed.inject(NotificationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUserNotifications', () => {
    it('should get user notifications', () => {
      const mockNotifications = [
        { id: 1, message: 'Notification 1', isRead: false },
        { id: 2, message: 'Notification 2', isRead: true }
      ];

      service.getUserNotifications(1).subscribe(notifications => {
        expect(notifications).toEqual(mockNotifications);
      });

      const req = httpMock.expectOne(`${API_URL}/users/1/notifications`);
      expect(req.request.method).toBe('GET');
      req.flush(mockNotifications);
    });
  });

  describe('getUnreadNotifications', () => {
    it('should get unread notifications', () => {
      const mockNotifications = [
        { id: 1, message: 'Unread notification', isRead: false }
      ];

      service.getUnreadNotifications(1).subscribe(notifications => {
        expect(notifications).toEqual(mockNotifications);
      });

      const req = httpMock.expectOne(`${API_URL}/users/1/notifications/unread`);
      expect(req.request.method).toBe('GET');
      req.flush(mockNotifications);
    });
  });

  describe('markAsRead', () => {
    it('should mark a notification as read', () => {
      service.markAsRead(1).subscribe();

      const req = httpMock.expectOne(`${API_URL}/notifications/1/read`);
      expect(req.request.method).toBe('PUT');
      req.flush(null);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', () => {
      service.markAllAsRead(1).subscribe();

      const req = httpMock.expectOne(`${API_URL}/users/1/notifications/read-all`);
      expect(req.request.method).toBe('PUT');
      req.flush(null);
    });
  });
});

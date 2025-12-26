import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NotificationsComponent } from './notifications.component';
import { AuthService } from '../../core/services/auth.service';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;
  let httpMock: HttpTestingController;

  const mockUser = { id: 1, username: 'testuser', email: 'test@test.com' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationsComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    const authService = TestBed.inject(AuthService);
    (authService as any).currentUser.set(mockUser);

    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load notifications on init', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(req => req.url.includes('/notifications'));
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should filter unread notifications', () => {
    const mockNotifications = [
      { id: 1, message: 'Read', isRead: true },
      { id: 2, message: 'Unread', isRead: false }
    ];

    component.notifications.set(mockNotifications as any);
    component.filter.set('unread');

    expect(component.filteredNotifications().length).toBe(1);
    expect(component.filteredNotifications()[0].isRead).toBe(false);
  });

  it('should calculate unread count', () => {
    const mockNotifications = [
      { id: 1, message: 'Read', isRead: true },
      { id: 2, message: 'Unread 1', isRead: false },
      { id: 3, message: 'Unread 2', isRead: false }
    ];

    component.notifications.set(mockNotifications as any);

    expect(component.unreadCount()).toBe(2);
  });

  it('should set filter', () => {
    component.setFilter('unread');
    expect(component.filter()).toBe('unread');

    component.setFilter('all');
    expect(component.filter()).toBe('all');
  });

  it('should return correct notification icon', () => {
    expect(component.getNotificationIcon('TASK_ASSIGNED' as any)).toBe('user-plus');
    expect(component.getNotificationIcon('TASK_UPDATED' as any)).toBe('edit');
    expect(component.getNotificationIcon('PROJECT_INVITATION' as any)).toBe('mail');
  });

  it('should return correct notification color', () => {
    expect(component.getNotificationColor('TASK_ASSIGNED' as any)).toContain('bg-blue-100');
    expect(component.getNotificationColor('TASK_UPDATED' as any)).toContain('bg-yellow-100');
    expect(component.getNotificationColor('PROJECT_INVITATION' as any)).toContain('bg-green-100');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let httpMock: HttpTestingController;

  const mockUser = { id: 1, username: 'testuser', email: 'test@test.com' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    const authService = TestBed.inject(AuthService);
    authService.currentUser.set(mockUser as any);

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne(req => req.url.includes('/notifications/unread'));
    req.flush([]);
    expect(component).toBeTruthy();
  });

  it('should load unread notification count on init', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne(req => req.url.includes('/notifications/unread'));
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1 }, { id: 2 }]);

    expect(component.unreadCount()).toBe(2);
  });

  it('should logout', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne(req => req.url.includes('/notifications/unread'));
    req.flush([]);

    const authService = TestBed.inject(AuthService);
    const logoutSpy = jest.spyOn(authService, 'logout');

    component.logout();

    expect(logoutSpy).toHaveBeenCalled();
  });
});

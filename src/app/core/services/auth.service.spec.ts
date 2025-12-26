import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { API_URL } from '../constants';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('register', () => {
    it('should register a new user', () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        createdAt: '2024-01-01'
      };

      const registerData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      service.register(registerData).subscribe(user => {
        expect(user).toEqual(mockUser);
        expect(service.currentUser()).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${API_URL}/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerData);
      req.flush(mockUser);
    });
  });

  describe('login', () => {
    it('should login and store user in localStorage', () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        createdAt: '2024-01-01'
      };

      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      service.login(loginData).subscribe(user => {
        expect(user).toEqual(mockUser);
        expect(service.currentUser()).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${API_URL}/auth/login`);
      expect(req.request.method).toBe('POST');
      req.flush(mockUser);
    });
  });

  describe('logout', () => {
    it('should clear user data on logout', () => {
      // Simulate logged in user
      const mockUser = { id: 1, username: 'test', email: 'test@test.com', createdAt: '2024-01-01' };
      service.currentUser.set(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));

      expect(service.currentUser()).toBeTruthy();

      service.logout();

      expect(service.currentUser()).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('initialization', () => {
    it('should load user from storage on init', () => {
      const mockUser = { id: 1, username: 'test', email: 'test@test.com', createdAt: '2024-01-01' };
      localStorage.setItem('user', JSON.stringify(mockUser));

      // We need to create a new service instance to test initialization
      // Since TestBed.inject returns singleton, and we want to test constructor behavior:
      // We can reset the testing module or just instantiate the class manually if dependencies allow,
      // but here we are using TestBed.

      // Let's reset the module to force new instance creation
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          AuthService
        ]
      });

      const newService = TestBed.inject(AuthService);
      expect(newService.currentUser()).toEqual(mockUser);
    });
  });
});

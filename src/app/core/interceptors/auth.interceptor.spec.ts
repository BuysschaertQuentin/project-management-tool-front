import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';
import { ErrorService } from '../services/error.service';

describe('authInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authServiceSpy: { logout: jest.Mock };
  let errorServiceSpy: { isNetworkError: jest.Mock, showError: jest.Mock, navigateToErrorPage: jest.Mock, handleHttpError: jest.Mock };
  let routerSpy: { navigate: jest.Mock };

  beforeEach(() => {
    authServiceSpy = { logout: jest.fn() };
    errorServiceSpy = {
      isNetworkError: jest.fn().mockReturnValue(false),
      showError: jest.fn(),
      navigateToErrorPage: jest.fn(),
      handleHttpError: jest.fn().mockReturnValue({ title: 'Server Error' })
    };
    routerSpy = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ErrorService, useValue: errorServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should pass through successful requests', () => {
    httpClient.get('/api/test').subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('/api/test');
    expect(req.request.method).toBe('GET');
    req.flush({ data: 'test' });
  });

  it('should handle network errors', () => {
    errorServiceSpy.isNetworkError.mockReturnValue(true);

    httpClient.get('/api/test').subscribe({
      next: () => fail('Should have failed'),
      error: (error) => {
        expect(error).toBeTruthy();
        expect(errorServiceSpy.showError).toHaveBeenCalled();
      }
    });

    const req = httpMock.expectOne('/api/test');
    req.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });
  });

  it('should handle 401 Unauthorized', () => {
    httpClient.get('/api/protected').subscribe({
      next: () => fail('Should have failed'),
      error: (error) => expect(error.status).toBe(401)
    });

    const req = httpMock.expectOne('/api/protected');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should ignore 401 for excluded URLs', () => {
    httpClient.post('/api/auth/login', {}).subscribe({
      next: () => fail('Should have failed'),
      error: (error) => expect(error.status).toBe(401)
    });

    const req = httpMock.expectOne('/api/auth/login');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(authServiceSpy.logout).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should handle 403 Forbidden', () => {
    httpClient.get('/api/admin').subscribe({
      next: () => fail('Should have failed'),
      error: (error) => expect(error.status).toBe(403)
    });

    const req = httpMock.expectOne('/api/admin');
    req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });

    expect(errorServiceSpy.navigateToErrorPage).toHaveBeenCalledWith(403);
  });

  it('should handle 500 Server Error', () => {
    httpClient.get('/api/error').subscribe({
      next: () => fail('Should have failed'),
      error: (error) => expect(error.status).toBe(500)
    });

    const req = httpMock.expectOne('/api/error');
    req.flush('Server Error', { status: 500, statusText: 'Server Error' });

    expect(errorServiceSpy.handleHttpError).toHaveBeenCalled();
  });
});

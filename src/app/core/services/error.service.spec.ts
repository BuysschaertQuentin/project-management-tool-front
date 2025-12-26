import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from './error.service';

describe('ErrorService', () => {
  let service: ErrorService;
  let routerMock: jest.Mocked<Router>;

  beforeEach(() => {
    routerMock = {
      navigate: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      providers: [
        ErrorService,
        { provide: Router, useValue: routerMock }
      ]
    });

    service = TestBed.inject(ErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('handleHttpError', () => {
    it('should handle 404 error', () => {
      const error = new HttpErrorResponse({ status: 404, statusText: 'Not Found' });

      const appError = service.handleHttpError(error);

      expect(appError.code).toBe(404);
      expect(appError.title).toBe('Not Found');
    });

    it('should handle 401 error', () => {
      const error = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });

      const appError = service.handleHttpError(error);

      expect(appError.code).toBe(401);
      expect(appError.title).toBe('Unauthorized');
    });

    it('should handle 500 error', () => {
      const error = new HttpErrorResponse({ status: 500, statusText: 'Server Error' });

      const appError = service.handleHttpError(error);

      expect(appError.code).toBe(500);
      expect(appError.title).toBe('Server Error');
    });

    it('should extract backend message', () => {
      const error = new HttpErrorResponse({
        status: 400,
        statusText: 'Bad Request',
        error: { message: 'Validation failed' }
      });

      const appError = service.handleHttpError(error);

      expect(appError.message).toBe('Validation failed');
    });
  });

  describe('showError', () => {
    it('should set global error from string', () => {
      service.showError('Test error message');

      expect(service.globalError()).toBeTruthy();
      expect(service.globalError()?.message).toBe('Test error message');
    });

    it('should set global error from AppError', () => {
      const appError = {
        code: 400,
        title: 'Test Error',
        message: 'Test message',
        timestamp: new Date()
      };

      service.showError(appError);

      expect(service.globalError()).toEqual(appError);
    });
  });

  describe('clearGlobalError', () => {
    it('should clear global error', () => {
      service.showError('Test error');
      expect(service.globalError()).toBeTruthy();

      service.clearGlobalError();

      expect(service.globalError()).toBeNull();
    });
  });

  describe('navigateToErrorPage', () => {
    it('should navigate to error page with code', () => {
      service.navigateToErrorPage(404);

      expect(routerMock.navigate).toHaveBeenCalledWith(['/error'], { queryParams: { code: 404 } });
    });
  });

  describe('handleAuthError', () => {
    it('should navigate to login on 401', () => {
      const error = new HttpErrorResponse({ status: 401 });

      service.handleAuthError(error);

      expect(routerMock.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { sessionExpired: true } });
    });

    it('should navigate to error page on 403', () => {
      const error = new HttpErrorResponse({ status: 403 });

      service.handleAuthError(error);

      expect(routerMock.navigate).toHaveBeenCalledWith(['/error'], { queryParams: { code: 403 } });
    });
  });

  describe('getErrorMessage', () => {
    it('should return user-friendly message', () => {
      const error = new HttpErrorResponse({ status: 404 });

      const message = service.getErrorMessage(error);

      expect(message).toBeTruthy();
      expect(typeof message).toBe('string');
    });
  });

  describe('isNetworkError', () => {
    it('should return true for status 0', () => {
      const error = new HttpErrorResponse({ status: 0 });

      expect(service.isNetworkError(error)).toBe(true);
    });

    it('should return false for other statuses', () => {
      const error = new HttpErrorResponse({ status: 500 });

      expect(service.isNetworkError(error)).toBe(false);
    });
  });
});

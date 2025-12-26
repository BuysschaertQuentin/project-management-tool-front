import { Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

export interface AppError {
  code: number | string;
  title: string;
  message: string;
  details?: string;
  timestamp: Date;
}

const HTTP_ERROR_MESSAGES: Record<number, { title: string; message: string }> = {
  400: {
    title: 'Invalid Request',
    message: 'The data sent is incorrect. Please check your input.'
  },
  401: {
    title: 'Unauthorized',
    message: 'You must be logged in to access this resource.'
  },
  403: {
    title: 'Access Denied',
    message: 'You do not have permission to perform this action.'
  },
  404: {
    title: 'Not Found',
    message: 'The requested resource does not exist or has been deleted.'
  },
  409: {
    title: 'Conflict',
    message: 'This operation conflicts with the current state. The item may already exist.'
  },
  422: {
    title: 'Validation Error',
    message: 'The provided data does not meet validation requirements.'
  },
  500: {
    title: 'Server Error',
    message: 'A technical problem occurred. Please try again later.'
  },
  502: {
    title: 'Service Unavailable',
    message: 'The server is temporarily unavailable.'
  },
  503: {
    title: 'Maintenance',
    message: 'The service is under maintenance. Please try again later.'
  }
};

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  globalError = signal<AppError | null>(null);
  errorHistory = signal<AppError[]>([]);

  constructor(private router: Router) {}

  handleHttpError(error: HttpErrorResponse, context?: string): AppError {
    const appError = this.parseHttpError(error, context);
    this.addToHistory(appError);
    return appError;
  }

  private parseHttpError(error: HttpErrorResponse, context?: string): AppError {
    const status = error.status;
    const defaultError = HTTP_ERROR_MESSAGES[status] || {
      title: 'Unexpected Error',
      message: 'An unexpected error occurred.'
    };

    let backendMessage = '';
    if (error.error) {
      if (typeof error.error === 'string') {
        backendMessage = error.error;
      } else if (error.error.message) {
        backendMessage = error.error.message;
      } else if (error.error.error) {
        backendMessage = error.error.error;
      }
    }

    return {
      code: status,
      title: defaultError.title,
      message: backendMessage || defaultError.message,
      details: context ? `Context: ${context}` : undefined,
      timestamp: new Date()
    };
  }

  showError(error: AppError | string): void {
    if (typeof error === 'string') {
      this.globalError.set({
        code: 'CUSTOM',
        title: 'Error',
        message: error,
        timestamp: new Date()
      });
    } else {
      this.globalError.set(error);
    }
    setTimeout(() => this.clearGlobalError(), 5000);
  }

  clearGlobalError(): void {
    this.globalError.set(null);
  }

  navigateToErrorPage(code: number | string): void {
    this.router.navigate(['/error'], { queryParams: { code } });
  }

  handleAuthError(error: HttpErrorResponse): void {
    if (error.status === 401) {
      this.router.navigate(['/login'], { queryParams: { sessionExpired: true } });
    } else if (error.status === 403) {
      this.navigateToErrorPage(403);
    }
  }

  private addToHistory(error: AppError): void {
    this.errorHistory.update(history => {
      const updated = [error, ...history];
      return updated.slice(0, 50);
    });
  }

  getErrorMessage(error: HttpErrorResponse): string {
    const appError = this.parseHttpError(error);
    return appError.message;
  }

  isNetworkError(error: HttpErrorResponse): boolean {
    return error.status === 0;
  }
}

import { TestBed } from '@angular/core/testing';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { signal, WritableSignal } from '@angular/core';

describe('authGuard', () => {
  // Helper to execute the guard in injection context
  const executeGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
      TestBed.runInInjectionContext(() => authGuard(route, state));

  let authServiceSpy: { currentUser: WritableSignal<any> };
  let routerSpy: { createUrlTree: jest.Mock };

  beforeEach(() => {
    authServiceSpy = {
      currentUser: signal(null)
    };

    routerSpy = {
      createUrlTree: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
  });

  it('should allow access if user is logged in', () => {
    // Simulate logged in user
    authServiceSpy.currentUser.set({ id: 1, username: 'test' });

    const result = executeGuard({} as ActivatedRouteSnapshot, { url: '/test' } as RouterStateSnapshot);

    expect(result).toBe(true);
    expect(routerSpy.createUrlTree).not.toHaveBeenCalled();
  });

  it('should redirect to login if user is not logged in', () => {
    // Simulate logged out user
    authServiceSpy.currentUser.set(null);

    const mockUrlTree = {} as UrlTree;
    routerSpy.createUrlTree.mockReturnValue(mockUrlTree);

    const state = { url: '/protected' } as RouterStateSnapshot;
    const result = executeGuard({} as ActivatedRouteSnapshot, state);

    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/protected' } });
    expect(result).toBe(mockUrlTree);
  });
});

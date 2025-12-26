import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, ActivatedRoute } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: { login: jest.Mock };
  let router: Router;

  beforeEach(async () => {
    authServiceSpy = { login: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have login form', () => {
    expect(component.loginForm).toBeTruthy();
    expect(component.loginForm.get('email')).toBeTruthy();
    expect(component.loginForm.get('password')).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.loginForm.invalid).toBe(true);
  });

  it('should validate email format', () => {
    component.loginForm.patchValue({ email: 'invalid', password: 'password123' });
    expect(component.loginForm.invalid).toBe(true);

    component.loginForm.patchValue({ email: 'valid@email.com', password: 'password123' });
    expect(component.loginForm.valid).toBe(true);
  });

  it('should not submit if form is invalid', () => {
    component.onSubmit();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should submit form and navigate on success', () => {
    authServiceSpy.login.mockReturnValue(of({ token: '123' }));

    component.loginForm.setValue({ email: 'test@test.com', password: '123' });
    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith({ email: 'test@test.com', password: '123' });
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should set error message on failure', () => {
    authServiceSpy.login.mockReturnValue(throwError(() => new Error('Error')));

    component.loginForm.setValue({ email: 'test@test.com', password: '123' });
    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(component.errorMessage()).toBe('Email ou mot de passe incorrect');
    expect(component.isLoading()).toBe(false);
  });
});

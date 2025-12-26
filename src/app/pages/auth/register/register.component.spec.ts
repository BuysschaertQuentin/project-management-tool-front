import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have register form with all fields', () => {
    expect(component.registerForm).toBeTruthy();
    expect(component.registerForm.get('username')).toBeTruthy();
    expect(component.registerForm.get('email')).toBeTruthy();
    expect(component.registerForm.get('password')).toBeTruthy();
    expect(component.registerForm.get('confirmPassword')).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.registerForm.invalid).toBe(true);
  });

  it('should validate password match', () => {
    component.registerForm.patchValue({
      username: 'testuser',
      email: 'test@email.com',
      password: 'Password123!',
      confirmPassword: 'different'
    });

    expect(component.registerForm.hasError('passwordMismatch')).toBe(true);
  });

  it('should have valid form when passwords match', () => {
    component.registerForm.patchValue({
      username: 'testuser',
      email: 'test@email.com',
      password: 'Password123!',
      confirmPassword: 'Password123!'
    });

    expect(component.registerForm.valid).toBe(true);
  });
});

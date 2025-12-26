import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../core/services/auth.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let httpMock: HttpTestingController;

  const mockUser = { id: 1, username: 'testuser', email: 'test@test.com' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    const authService = TestBed.inject(AuthService);
    (authService as any).currentUser.set(mockUser);

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display welcome message', () => {
    fixture.detectChanges();

    // Flush expected HTTP calls
    httpMock.match(() => true).forEach(req => req.flush([]));

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('testuser');
  });
});

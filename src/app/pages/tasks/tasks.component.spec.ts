import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TasksComponent } from './tasks.component';
import { AuthService } from '../../core/services/auth.service';

describe('TasksComponent', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  const mockUser = { id: 1, username: 'testuser', email: 'test@test.com' };
  const mockTasks = [
    { id: 1, name: 'Task 1', status: 'TODO', projectId: 1, createdByUserId: 1, updatedAt: '2024-01-01' },
    { id: 2, name: 'Task 2', status: 'DONE', projectId: 1, createdByUserId: 1, updatedAt: '2024-01-02' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    const authService = TestBed.inject(AuthService);
    authService.currentUser.set(mockUser as any);

    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate');

    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    const req = httpMock.expectOne(req => req.url.includes('/tasks'));
    req.flush([]);
    expect(component).toBeTruthy();
  });

  it('should load user tasks on init and sort them', () => {
    const req = httpMock.expectOne(req => req.url.includes('/users/1/tasks'));
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);

    expect(component.tasks().length).toBe(2);
    // Should be sorted by date desc (Task 2 then Task 1)
    expect(component.tasks()[0].id).toBe(2);
    expect(component.tasks()[1].id).toBe(1);

    expect(component.isLoading()).toBe(false);
  });

  it('should calculate stats correctly', () => {
    const req = httpMock.expectOne(req => req.url.includes('/tasks'));
    req.flush(mockTasks);

    expect(component.todoCount()).toBe(1);
    expect(component.doneCount()).toBe(1);
    expect(component.inProgressCount()).toBe(0);
  });

  it('should filter tasks by status', () => {
    const req = httpMock.expectOne(req => req.url.includes('/tasks'));
    req.flush(mockTasks);

    // Default: no filter
    expect(component.filteredTasks().length).toBe(2);

    // Filter TODO
    component.setFilter('TODO');
    expect(component.filteredTasks().length).toBe(1);
    expect(component.filteredTasks()[0].status).toBe('TODO');

    // Filter DONE
    component.setFilter('DONE');
    expect(component.filteredTasks().length).toBe(1);
    expect(component.filteredTasks()[0].status).toBe('DONE');

    // Clear filter
    component.setFilter(null);
    expect(component.filteredTasks().length).toBe(2);
  });

  it('should navigate to project', () => {
    const req = httpMock.expectOne(req => req.url.includes('/tasks'));
    req.flush([]);

    component.goToProject(99);
    expect(router.navigate).toHaveBeenCalledWith(['/app/projects', 99]);
  });

  it('should return correct classes and labels', () => {
    const req = httpMock.expectOne(req => req.url.includes('/tasks'));
    req.flush([]);

    expect(component.getPriorityClass('HIGH')).toContain('bg-red-100');
    expect(component.getPriorityClass('MEDIUM')).toContain('bg-yellow-100');

    expect(component.getStatusClass('TODO')).toContain('bg-gray-100');
    expect(component.getStatusClass('DONE')).toContain('bg-green-100');

    expect(component.getStatusLabel('TODO')).toBe('À faire');
    expect(component.getStatusLabel('DONE')).toBe('Terminé');
  });
});

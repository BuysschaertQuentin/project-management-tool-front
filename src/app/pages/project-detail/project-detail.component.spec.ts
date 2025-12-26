import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ProjectDetailComponent } from './project-detail.component';
import { AuthService } from '../../core/services/auth.service';
import { TaskPriority } from '../../core/models/task.model';
import { of } from 'rxjs';

describe('ProjectDetailComponent', () => {
  let component: ProjectDetailComponent;
  let fixture: ComponentFixture<ProjectDetailComponent>;
  let httpMock: HttpTestingController;

  const mockUser = { id: 1, username: 'testuser', email: 'test@test.com' };
  const mockProject = { id: 1, name: 'Test Project', description: 'Test', startDate: '2024-01-01', createdByUserId: 1, createdByUsername: 'testuser' };
  const mockTasks = [
    { id: 1, name: 'Task 1', status: 'TODO', projectId: 1, createdByUserId: 1, createdByUsername: 'testuser' },
    { id: 2, name: 'Task 2', status: 'DONE', projectId: 1, createdByUserId: 2, createdByUsername: 'other' }
  ];
  const mockMembers = [{ id: 1, userId: 1, username: 'testuser', role: 'ADMIN' }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDetailComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } },
            paramMap: of({ get: () => '1' })
          }
        }
      ]
    }).compileComponents();

    const authService = TestBed.inject(AuthService);
    authService.currentUser.set(mockUser as any);

    fixture = TestBed.createComponent(ProjectDetailComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    fixture.detectChanges();
    const reqProject = httpMock.expectOne(req => req.url.includes('/projects/1') && !req.url.includes('/tasks') && !req.url.includes('/members'));
    reqProject.flush(mockProject);
    httpMock.expectOne(req => req.url.includes('/members')).flush(mockMembers);
    httpMock.expectOne(req => req.url.includes('/tasks')).flush(mockTasks);
    expect(component).toBeTruthy();
  });

  it('should load project details, tasks and members on init', () => {
    fixture.detectChanges();
    // 1. Get Project
    const reqProject = httpMock.expectOne(req => req.url.includes('/projects/1') && !req.url.includes('/tasks') && !req.url.includes('/members'));
    expect(reqProject.request.method).toBe('GET');
    reqProject.flush(mockProject);

    // 2. Get Members
    const reqMembers = httpMock.expectOne(req => req.url.includes('/projects/1/members'));
    expect(reqMembers.request.method).toBe('GET');
    reqMembers.flush(mockMembers);

    // 3. Get Tasks
    const reqTasks = httpMock.expectOne(req => req.url.includes('/projects/1/tasks'));
    expect(reqTasks.request.method).toBe('GET');
    reqTasks.flush(mockTasks);

    expect(component.project()).toEqual(mockProject as any);
    expect(component.tasks().length).toBe(2);
    expect(component.members().length).toBe(1);
    expect(component.todoTasks().length).toBe(1);
    expect(component.doneTasks().length).toBe(1);
  });

  it('should open create task modal', () => {
    fixture.detectChanges();
    // Flush init requests
    httpMock.expectOne(req => req.url.includes('/projects/1') && !req.url.includes('/tasks') && !req.url.includes('/members')).flush(mockProject);
    httpMock.expectOne(req => req.url.includes('/members')).flush(mockMembers);
    httpMock.expectOne(req => req.url.includes('/tasks')).flush(mockTasks);

    component.openCreateModal();
    expect(component.showCreateModal()).toBe(true);
  });

  it('should create task', () => {
    fixture.detectChanges();
    httpMock.expectOne(req => req.url.includes('/projects/1') && !req.url.includes('/tasks') && !req.url.includes('/members')).flush(mockProject);
    httpMock.expectOne(req => req.url.includes('/members')).flush(mockMembers);
    httpMock.expectOne(req => req.url.includes('/tasks')).flush(mockTasks);

    component.openCreateModal();
    component.taskForm.setValue({
      name: 'New Task',
      description: 'Desc',
      dueDate: '2024-03-01',
      priority: TaskPriority.HIGH,
      assignedToUserId: 1
    });

    component.createTask();

    const req = httpMock.expectOne(req => req.url.includes('/projects/1/tasks') && req.method === 'POST');
    expect(req.request.body.name).toBe('New Task');
    expect(req.request.body.priority).toBe(TaskPriority.HIGH);
    req.flush({ id: 3, name: 'New Task', status: 'TODO', projectId: 1, createdByUserId: 1 } as any);

    expect(component.tasks().length).toBe(3);
    expect(component.showCreateModal()).toBe(false);
  });

  it('should update task status', () => {
    fixture.detectChanges();
    httpMock.expectOne(req => req.url.includes('/projects/1') && !req.url.includes('/tasks') && !req.url.includes('/members')).flush(mockProject);
    httpMock.expectOne(req => req.url.includes('/members')).flush(mockMembers);
    httpMock.expectOne(req => req.url.includes('/tasks')).flush(mockTasks);

    const taskToUpdate = mockTasks[0];
    component.updateTaskStatus(taskToUpdate as any, 'DONE');

    const req = httpMock.expectOne(req => req.url.includes(`/tasks/${taskToUpdate.id}`) && req.method === 'PUT');
    expect(req.request.body).toEqual({ status: 'DONE' });

    const updatedTask = { ...taskToUpdate, status: 'DONE' };
    req.flush(updatedTask);

    expect(component.tasks()[0].status).toBe('DONE');
  });

  it('should delete task', () => {
    fixture.detectChanges();
    httpMock.expectOne(req => req.url.includes('/projects/1') && !req.url.includes('/tasks') && !req.url.includes('/members')).flush(mockProject);
    httpMock.expectOne(req => req.url.includes('/members')).flush(mockMembers);
    httpMock.expectOne(req => req.url.includes('/tasks')).flush(mockTasks);

    const taskToDelete = mockTasks[0];
    component.openDeleteModal(new Event('click'), taskToDelete as any);
    component.confirmDeleteTask();

    const req = httpMock.expectOne(req => req.url.includes(`/tasks/${taskToDelete.id}`) && req.method === 'DELETE');
    req.flush({});

    expect(component.tasks().length).toBe(1);
    expect(component.showDeleteModal()).toBe(false);
  });
});

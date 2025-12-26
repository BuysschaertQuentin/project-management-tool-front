import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TaskService } from './task.service';
import { API_URL } from '../constants';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        TaskService
      ]
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createTask', () => {
    it('should create a task', () => {
      const newTask = {
        name: 'Test Task',
        description: 'Test Description',
        priority: 'HIGH',
        dueDate: '2024-01-15',
        createdByUserId: 1
      };
      const mockResponse = { id: 1, ...newTask, status: 'TODO' };

      service.createTask(1, newTask).subscribe(task => {
        expect(task).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${API_URL}/projects/1/tasks`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });

  describe('getProjectTasks', () => {
    it('should get tasks for a project', () => {
      const mockTasks = [
        { id: 1, name: 'Task 1', status: 'TODO' },
        { id: 2, name: 'Task 2', status: 'IN_PROGRESS' }
      ];

      service.getProjectTasks(1).subscribe(tasks => {
        expect(tasks).toEqual(mockTasks);
      });

      const req = httpMock.expectOne(`${API_URL}/projects/1/tasks`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTasks);
    });
  });

  describe('getUserTasks', () => {
    it('should get tasks for a user and update signal', () => {
      const mockTasks = [{ id: 1, name: 'Task 1' }];

      service.getUserTasks(1).subscribe(tasks => {
        expect(tasks).toEqual(mockTasks);
        expect(service.userTasks()).toEqual(mockTasks);
      });

      const req = httpMock.expectOne(`${API_URL}/users/1/tasks`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTasks);
    });
  });

  describe('getTask', () => {
    it('should get a single task', () => {
      const mockTask = { id: 1, name: 'Test Task' };

      service.getTask(1).subscribe(task => {
        expect(task).toEqual(mockTask);
      });

      const req = httpMock.expectOne(`${API_URL}/tasks/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTask);
    });
  });

  describe('updateTask', () => {
    it('should update a task', () => {
      const updateData = { status: 'DONE' };
      const mockResponse = { id: 1, name: 'Test Task', status: 'DONE' };

      service.updateTask(1, updateData).subscribe(task => {
        expect(task).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${API_URL}/tasks/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockResponse);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', () => {
      service.deleteTask(1).subscribe();

      const req = httpMock.expectOne(`${API_URL}/tasks/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('assignTask', () => {
    it('should assign a task to a user', () => {
      const mockResponse = { id: 1, name: 'Test Task', assignedToId: 2 };

      service.assignTask(1, 2).subscribe(task => {
        expect(task).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${API_URL}/tasks/1/assign`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ assigneeId: 2 });
      req.flush(mockResponse);
    });
  });

  describe('getTaskHistory', () => {
    it('should get task history', () => {
      const mockHistory = [
        { id: 1, taskId: 1, changeType: 'CREATED', description: 'Task created' }
      ];

      service.getTaskHistory(1).subscribe(history => {
        expect(history).toEqual(mockHistory);
      });

      const req = httpMock.expectOne(`${API_URL}/tasks/1/history`);
      expect(req.request.method).toBe('GET');
      req.flush(mockHistory);
    });
  });
});

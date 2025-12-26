import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProjectService } from './project.service';
import { API_URL } from '../constants';

describe('ProjectService', () => {
  let service: ProjectService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ProjectService
      ]
    });

    service = TestBed.inject(ProjectService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createProject', () => {
    it('should create a new project', () => {
      const newProject = {
        name: 'Test Project',
        description: 'Test Description',
        startDate: '2024-01-01',
        createdByUserId: 1
      };
      const mockResponse = { id: 1, ...newProject, createdByUsername: 'testuser' };

      service.createProject(newProject).subscribe(project => {
        expect(project).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${API_URL}/projects`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newProject);
      req.flush(mockResponse);
    });
  });

  describe('getUserProjects', () => {
    it('should get user projects', () => {
      const mockProjects = [
        { id: 1, name: 'Project 1' },
        { id: 2, name: 'Project 2' }
      ];

      service.getUserProjects(1).subscribe(projects => {
        expect(projects).toEqual(mockProjects);
      });

      const req = httpMock.expectOne(`${API_URL}/users/1/projects`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProjects);
    });
  });

  describe('getProject', () => {
    it('should get a single project', () => {
      const mockProject = { id: 1, name: 'Test Project' };

      service.getProject(1).subscribe(project => {
        expect(project).toEqual(mockProject);
      });

      const req = httpMock.expectOne(`${API_URL}/projects/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProject);
    });
  });

  describe('deleteProject', () => {
    it('should delete a project', () => {
      service.deleteProject(1).subscribe();

      const req = httpMock.expectOne(`${API_URL}/projects/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('getProjectMembers', () => {
    it('should get project members', () => {
      const mockMembers = [
        { id: 1, userId: 1, username: 'user1', email: 'user1@test.com', role: 'ADMIN' }
      ];

      service.getProjectMembers(1).subscribe(members => {
        expect(members).toEqual(mockMembers);
      });

      const req = httpMock.expectOne(`${API_URL}/projects/1/members`);
      expect(req.request.method).toBe('GET');
      req.flush(mockMembers);
    });
  });

  describe('inviteMember', () => {
    it('should invite a member to project', () => {
      const mockMember = { id: 1, userId: 2, username: 'user2', email: 'user2@test.com', role: 'MEMBER' };

      service.inviteMember(1, 'user2@test.com', 'MEMBER').subscribe(member => {
        expect(member).toEqual(mockMember);
      });

      const req = httpMock.expectOne(`${API_URL}/projects/1/members`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email: 'user2@test.com', role: 'MEMBER' });
      req.flush(mockMember);
    });
  });

  describe('removeMember', () => {
    it('should remove a member from project', () => {
      service.removeMember(1, 2).subscribe();

      const req = httpMock.expectOne(`${API_URL}/projects/1/members/2`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProjectsComponent } from './projects.component';
import { AuthService } from '../../core/services/auth.service';
import { ProjectService } from '../../core/services/project.service';
import { of, throwError } from 'rxjs';
import { signal } from '@angular/core';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  const mockUser = { id: 1, username: 'testuser', email: 'test@test.com' };
  const mockProjects = [
    { id: 1, name: 'Project 1', description: 'Desc 1', startDate: '2024-01-01', createdByUserId: 1 },
    { id: 2, name: 'Project 2', description: 'Desc 2', startDate: '2024-02-01', createdByUserId: 1 }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsComponent],
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

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load projects on init', () => {
    fixture.detectChanges(); // Triggers ngOnInit

    const req = httpMock.expectOne(req => req.url.includes('/projects'));
    expect(req.request.method).toBe('GET');
    req.flush(mockProjects);

    expect(component.projects().length).toBe(2);
    expect(component.isLoading()).toBe(false);
  });

  it('should handle error when loading projects', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(req => req.url.includes('/projects'));
    req.flush('Error', { status: 500, statusText: 'Server Error' });

    expect(component.isLoading()).toBe(false);
    expect(component.error()).toBeTruthy();
  });

  it('should create a project successfully', () => {
    // flush init first if we detectChanges
    fixture.detectChanges();
    httpMock.expectOne(req => req.url.includes('/projects')).flush([]);

    component.openCreateModal();
    component.projectForm.setValue({
      name: 'New Project',
      description: 'New Desc',
      startDate: '2024-03-01'
    });

    component.createProject();

    const req = httpMock.expectOne(req => req.url.includes('/projects') && req.method === 'POST');
    expect(req.request.body).toEqual({
      name: 'New Project',
      description: 'New Desc',
      startDate: '2024-03-01',
      createdByUserId: 1
    });

    const newProject = { id: 3, ...req.request.body };
    req.flush(newProject);

    expect(component.projects().length).toBe(1); // was empty, now 1
    expect(component.showCreateModal()).toBe(false);
    expect(component.isCreating()).toBe(false);
  });

  it('should navigate to project detail', () => {
    component.goToProject(123);
    expect(router.navigate).toHaveBeenCalledWith(['/app/projects', 123]);
  });

  it('should delete project successfully', () => {
    fixture.detectChanges();
    httpMock.expectOne(req => req.url.includes('/projects')).flush(mockProjects);

    const projectToDelete = mockProjects[0];
    component.openDeleteModal(new Event('click'), projectToDelete as any);
    component.confirmDeleteProject();

    const req = httpMock.expectOne(req => req.url.includes('/projects/1') && req.method === 'DELETE');
    req.flush({});

    expect(component.projects().length).toBe(1); // One removed
    expect(component.projects()[0].id).toBe(2);
    expect(component.showDeleteModal()).toBe(false);
  });
});

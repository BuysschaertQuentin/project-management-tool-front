import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TeamComponent } from './team.component';
import { AuthService } from '../../core/services/auth.service';

describe('TeamComponent', () => {
  let component: TeamComponent;
  let fixture: ComponentFixture<TeamComponent>;
  let httpMock: HttpTestingController;

  const mockUser = { id: 1, username: 'testuser', email: 'test@test.com' };
  const mockProjects = [
    { id: 1, name: 'Project 1', description: 'Desc 1', startDate: '2024-01-01', createdByUserId: 1 }
  ];
  const mockMembers = [
    { id: 10, userId: 1, username: 'testuser', email: 'test@test.com', role: 'ADMIN' },
    { id: 11, userId: 2, username: 'user2', email: 'user2@test.com', role: 'MEMBER' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    const authService = TestBed.inject(AuthService);
    authService.currentUser.set(mockUser as any);

    fixture = TestBed.createComponent(TeamComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load projects on init and select first one', () => {
    fixture.detectChanges();

    const reqProjects = httpMock.expectOne(req => req.url.includes('/projects'));
    expect(reqProjects.request.method).toBe('GET');
    reqProjects.flush(mockProjects);

    // Should automatically fetch members for first project
    const reqMembers = httpMock.expectOne(req => req.url.includes('/projects/1/members'));
    expect(reqMembers.request.method).toBe('GET');
    reqMembers.flush(mockMembers);

    expect(component.projects().length).toBe(1);
    expect(component.selectedProject()).toEqual(mockProjects[0] as any);
    expect(component.members().length).toBe(2);
  });

  it('should invite member successfully', () => {
    // Init flow
    fixture.detectChanges();
    httpMock.expectOne(req => req.url.includes('/projects')).flush(mockProjects);
    httpMock.expectOne(req => req.url.includes('/members')).flush(mockMembers);

    component.openInviteModal();
    component.inviteForm.setValue({ email: 'new@test.com', role: 'OBSERVER' });
    component.inviteMember();

    const reqInvite = httpMock.expectOne(req => req.url.includes('/projects/1/members'));
    expect(reqInvite.request.method).toBe('POST');
    expect(reqInvite.request.body).toEqual({ email: 'new@test.com', role: 'OBSERVER' });

    const newMember = { id: 12, userId: 3, username: 'new', email: 'new@test.com', role: 'OBSERVER' };
    reqInvite.flush(newMember);

    expect(component.members().length).toBe(3);
    expect(component.showInviteModal()).toBe(false);
  });

  it('should remove member successfully', () => {
    fixture.detectChanges();
    httpMock.expectOne(req => req.url.includes('/projects')).flush(mockProjects);
    httpMock.expectOne(req => req.url.includes('/members')).flush(mockMembers);

    const memberToRemove = mockMembers[1];
    component.openRemoveModal(memberToRemove as any);
    component.confirmRemoveMember();

    const reqRemove = httpMock.expectOne(req => req.url.includes(`/projects/1/members/${memberToRemove.id}`));
    expect(reqRemove.request.method).toBe('DELETE');
    reqRemove.flush({});

    expect(component.members().length).toBe(1);
    expect(component.showRemoveModal()).toBe(false);
  });

  it('should handle invite errors', () => {
    fixture.detectChanges();
    httpMock.expectOne(req => req.url.includes('/projects')).flush(mockProjects);
    httpMock.expectOne(req => req.url.includes('/members')).flush(mockMembers);

    component.openInviteModal();
    component.inviteForm.setValue({ email: 'fail@test.com', role: 'MEMBER' });
    component.inviteMember();

    const reqInvite = httpMock.expectOne(req => req.url.includes('/projects/1/members'));
    reqInvite.flush('Not found', { status: 404, statusText: 'Not Found' });

    expect(component.inviteError()).toBe('Utilisateur non trouvé avec cet email');
    expect(component.members().length).toBe(2);
  });
});

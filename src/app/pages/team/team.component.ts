import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ProjectService, ProjectMember } from '../../core/services/project.service';
import { Project } from '../../core/models/project.model';
import { ConfirmModalComponent } from '../../shared/components';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [ReactiveFormsModule, ConfirmModalComponent],
  templateUrl: './team.component.html'
})
export class TeamComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private projectService = inject(ProjectService);

  currentUser = this.authService.currentUser;
  projects = signal<Project[]>([]);
  selectedProject = signal<Project | null>(null);
  members = signal<ProjectMember[]>([]);
  isLoading = signal(true);
  isLoadingMembers = signal(false);
  error = signal<string | null>(null);

  // Invite modal
  showInviteModal = signal(false);
  isInviting = signal(false);
  inviteError = signal<string | null>(null);

  // Remove member modal
  showRemoveModal = signal(false);
  memberToRemove = signal<ProjectMember | null>(null);

  inviteForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    role: ['MEMBER', [Validators.required]]
  });

  roles = [
    { value: 'ADMIN', label: 'Administrateur' },
    { value: 'MEMBER', label: 'Membre' },
    { value: 'OBSERVER', label: 'Observateur' }
  ];

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    const userId = this.currentUser()?.id;
    if (!userId) return;

    this.isLoading.set(true);
    this.projectService.getUserProjects(userId).subscribe({
      next: (projects) => {
        this.projects.set(projects);
        this.isLoading.set(false);
        if (projects.length > 0) {
          this.selectProject(projects[0]);
        }
      },
      error: () => {
        this.error.set('Erreur lors du chargement des projets');
        this.isLoading.set(false);
      }
    });
  }

  selectProject(project: Project) {
    this.selectedProject.set(project);
    this.loadMembers(project.id);
  }

  loadMembers(projectId: number) {
    this.isLoadingMembers.set(true);
    this.projectService.getProjectMembers(projectId).subscribe({
      next: (members) => {
        this.members.set(members);
        this.isLoadingMembers.set(false);
      },
      error: () => {
        this.error.set('Erreur lors du chargement des membres');
        this.isLoadingMembers.set(false);
      }
    });
  }

  openInviteModal() {
    this.showInviteModal.set(true);
    this.inviteForm.reset({ role: 'MEMBER' });
    this.inviteError.set(null);
  }

  closeInviteModal() {
    this.showInviteModal.set(false);
  }

  inviteMember() {
    if (this.inviteForm.invalid || !this.selectedProject()) return;

    this.isInviting.set(true);
    this.inviteError.set(null);

    const { email, role } = this.inviteForm.value;

    this.projectService.inviteMember(this.selectedProject()!.id, email!, role!).subscribe({
      next: (member) => {
        this.members.update(list => [...list, member]);
        this.closeInviteModal();
        this.isInviting.set(false);
      },
      error: (err) => {
        if (err.status === 404) {
          this.inviteError.set('Utilisateur non trouvé avec cet email');
        } else if (err.status === 409) {
          this.inviteError.set('Cet utilisateur est déjà membre du projet');
        } else {
          this.inviteError.set('Erreur lors de l\'invitation');
        }
        this.isInviting.set(false);
      }
    });
  }

  // Remove member with confirmation modal
  openRemoveModal(member: ProjectMember) {
    this.memberToRemove.set(member);
    this.showRemoveModal.set(true);
  }

  closeRemoveModal() {
    this.showRemoveModal.set(false);
    this.memberToRemove.set(null);
  }

  confirmRemoveMember() {
    const member = this.memberToRemove();
    if (!member || !this.selectedProject()) return;

    this.projectService.removeMember(this.selectedProject()!.id, member.id).subscribe({
      next: () => {
        this.members.update(list => list.filter(m => m.id !== member.id));
        this.closeRemoveModal();
      },
      error: () => {
        this.error.set('Erreur lors du retrait du membre');
        this.closeRemoveModal();
      }
    });
  }

  getRoleLabel(role: string): string {
    return this.roles.find(r => r.value === role)?.label || role;
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-700';
      case 'MEMBER': return 'bg-blue-100 text-blue-700';
      case 'OBSERVER': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}

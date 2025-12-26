export enum NotificationType {
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_UPDATED = 'TASK_UPDATED',
  PROJECT_INVITATION = 'PROJECT_INVITATION'
}

export interface AppNotification {
  id: number;
  userId: number;
  username: string;
  taskId?: number;
  taskName?: string;
  projectId?: number;
  projectName?: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  sentAt: string;
  readAt?: string;
}

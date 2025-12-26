export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface Task {
  id: number;
  projectId: number;
  projectName: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  assignedToId?: number;
  assignedToUsername?: string;
  createdByUserId: number;
  createdByUsername: string;
  dueDate: string;
  completedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCreateRequest {
  name: string;
  description: string;
  priority: string;
  dueDate: string;
  createdByUserId: number;
}

export interface TaskUpdateRequest {
  name?: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
}

export interface TaskHistory {
  id: number;
  taskId: number;
  taskName: string;
  changedByUserId: number;
  changedByUsername: string;
  changeType: TaskHistoryChangeType;
  field?: string;
  oldValue?: string;
  newValue?: string;
  description: string;
  createdAt: string;
}

export enum TaskHistoryChangeType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  STATUS_CHANGED = 'STATUS_CHANGED',
  ASSIGNED = 'ASSIGNED',
  DELETED = 'DELETED'
}

export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  createdByUserId: number;
  createdByUsername: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectCreateRequest {
  name: string;
  description: string;
  startDate: string;
  createdByUserId: number;
}

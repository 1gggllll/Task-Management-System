export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    stack?: string;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserPayload {
  id: string;
  email: string;
  name: string;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: 'ADMIN' | 'MEMBER' | 'VIEWER';
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface TaskWithRelations {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  projectId: string;
  assigneeId?: string;
  creatorId: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  project: {
    id: string;
    name: string;
  };
  assignee?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  creator: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}
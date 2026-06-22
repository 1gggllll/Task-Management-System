export interface IUser {
  id: string;
  email: string;
  password: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProject {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: 'ADMIN' | 'MEMBER' | 'VIEWER';
  createdAt: Date;
}

export interface ITask {
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
}

export interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(params?: any): Promise<T[]>;
  create(data: any): Promise<T>;
  update(id: string, data: any): Promise<T>;
  delete(id: string): Promise<T>;
}

export interface IService<T> {
  getById(id: string): Promise<T>;
  getAll(params?: any): Promise<T[]>;
  create(data: any): Promise<T>;
  update(id: string, data: any): Promise<T>;
  delete(id: string): Promise<T>;
}

export interface IController {
  getAll(req: any, res: any, next: any): Promise<void>;
  getById(req: any, res: any, next: any): Promise<void>;
  create(req: any, res: any, next: any): Promise<void>;
  update(req: any, res: any, next: any): Promise<void>;
  delete(req: any, res: any, next: any): Promise<void>;
}

export interface IAuthPayload {
  id: string;
  email: string;
  name: string;
}

export interface ITokenPayload {
  id: string;
  iat: number;
  exp: number;
}

export interface IApiResponse<T = any> {
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
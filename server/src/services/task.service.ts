import { TaskRepository } from '../repositories/task.repository';
import { ProjectRepository } from '../repositories/project.repository';
import { AppError } from '../errors/AppError';

const taskRepository = new TaskRepository();
const projectRepository = new ProjectRepository();

export class TaskService {
  async getByProject(projectId: string, userId: string, filters?: {
    status?: string;
    priority?: string;
    assigneeId?: string;
  }) {
    // 检查用户是否有权限访问该项目
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new AppError('项目不存在', 404);
    }
    
    const isOwner = project.ownerId === userId;
    const isMember = await projectRepository.isMember(projectId, userId);
    
    if (!isOwner && !isMember) {
      throw new AppError('无权访问该项目', 403);
    }
    
    return taskRepository.findByProject(projectId, filters);
  }

  async getById(id: string, userId: string) {
    const task = await taskRepository.findById(id);
    
    if (!task) {
      throw new AppError('任务不存在', 404);
    }
    
    // 检查用户是否有权限访问该任务
    const isOwner = task.project.ownerId === userId;
    const isMember = await projectRepository.isMember(task.projectId, userId);
    
    if (!isOwner && !isMember) {
      throw new AppError('无权访问该任务', 403);
    }
    
    return task;
  }

  async create(projectId: string, userId: string, data: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    assigneeId?: string;
    dueDate?: string;
  }) {
    // 检查用户是否有权限在该项目中创建任务
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new AppError('项目不存在', 404);
    }
    
    const isOwner = project.ownerId === userId;
    const isMember = await projectRepository.isMember(projectId, userId);
    
    if (!isOwner && !isMember) {
      throw new AppError('无权在该项目中创建任务', 403);
    }
    
    // 如果指定了分配人，检查分配人是否是项目成员
    if (data.assigneeId) {
      const isAssigneeMember = await projectRepository.isMember(projectId, data.assigneeId);
      if (!isAssigneeMember) {
        throw new AppError('分配人必须是项目成员', 400);
      }
    }
    
    return taskRepository.create({
      title: data.title,
      description: data.description,
      status: data.status as any || 'TODO',
      priority: data.priority as any || 'MEDIUM',
      project: { connect: { id: projectId } },
      assignee: data.assigneeId ? { connect: { id: data.assigneeId } } : undefined,
      creator: { connect: { id: userId } },
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined
    });
  }

  async update(id: string, userId: string, data: {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    assigneeId?: string;
    dueDate?: string;
  }) {
    const task = await taskRepository.findById(id);
    
    if (!task) {
      throw new AppError('任务不存在', 404);
    }
    
    // 检查用户是否有权限修改该任务
    const isOwner = task.project.ownerId === userId;
    const isMember = await projectRepository.isMember(task.projectId, userId);
    
    if (!isOwner && !isMember) {
      throw new AppError('无权修改该任务', 403);
    }
    
    // 如果指定了分配人，检查分配人是否是项目成员
    if (data.assigneeId) {
      const isAssigneeMember = await projectRepository.isMember(task.projectId, data.assigneeId);
      if (!isAssigneeMember) {
        throw new AppError('分配人必须是项目成员', 400);
      }
    }
    
    return taskRepository.update(id, {
      title: data.title,
      description: data.description,
      status: data.status as any,
      priority: data.priority as any,
      assignee: data.assigneeId ? { connect: { id: data.assigneeId } } : undefined,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined
    });
  }

  async delete(id: string, userId: string) {
    const task = await taskRepository.findById(id);
    
    if (!task) {
      throw new AppError('任务不存在', 404);
    }
    
    // 检查用户是否有权限删除该任务
    const isOwner = task.project.ownerId === userId;
    const isCreator = task.creatorId === userId;
    
    if (!isOwner && !isCreator) {
      throw new AppError('无权删除该任务', 403);
    }
    
    return taskRepository.delete(id);
  }

  async updateStatus(id: string, userId: string, status: string) {
    const task = await taskRepository.findById(id);
    
    if (!task) {
      throw new AppError('任务不存在', 404);
    }
    
    // 检查用户是否有权限修改该任务
    const isOwner = task.project.ownerId === userId;
    const isMember = await projectRepository.isMember(task.projectId, userId);
    const isAssignee = task.assigneeId === userId;
    
    if (!isOwner && !isMember && !isAssignee) {
      throw new AppError('无权修改该任务状态', 403);
    }
    
    return taskRepository.updateStatus(id, status);
  }

  async updateAssignee(id: string, userId: string, assigneeId: string | null) {
    const task = await taskRepository.findById(id);
    
    if (!task) {
      throw new AppError('任务不存在', 404);
    }
    
    // 检查用户是否有权限修改该任务
    const isOwner = task.project.ownerId === userId;
    const isMember = await projectRepository.isMember(task.projectId, userId);
    
    if (!isOwner && !isMember) {
      throw new AppError('无权修改该任务分配人', 403);
    }
    
    // 如果指定了分配人，检查分配人是否是项目成员
    if (assigneeId) {
      const isAssigneeMember = await projectRepository.isMember(task.projectId, assigneeId);
      if (!isAssigneeMember) {
        throw new AppError('分配人必须是项目成员', 400);
      }
    }
    
    return taskRepository.updateAssignee(id, assigneeId);
  }
}
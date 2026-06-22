import { ProjectRepository } from '../repositories/project.repository';
import { AppError } from '../errors/AppError';

const projectRepository = new ProjectRepository();

export class ProjectService {
  async getAll(userId: string) {
    // 获取用户拥有的项目和作为成员的项目
    const ownedProjects = await projectRepository.findByOwner(userId);
    const memberProjects = await projectRepository.findByMember(userId);
    
    // 合并并去重
    const allProjects = [...ownedProjects];
    memberProjects.forEach(project => {
      if (!allProjects.find(p => p.id === project.id)) {
        allProjects.push(project);
      }
    });
    
    return allProjects;
  }

  async getById(id: string, userId: string) {
    const project = await projectRepository.findById(id);
    
    if (!project) {
      throw new AppError('项目不存在', 404);
    }
    
    // 检查用户是否有权限访问该项目
    const isOwner = project.ownerId === userId;
    const isMember = await projectRepository.isMember(id, userId);
    
    if (!isOwner && !isMember) {
      throw new AppError('无权访问该项目', 403);
    }
    
    return project;
  }

  async create(data: { name: string; description?: string; ownerId: string }) {
    return projectRepository.create(data);
  }

  async update(id: string, userId: string, data: { name?: string; description?: string }) {
    const project = await projectRepository.findById(id);
    
    if (!project) {
      throw new AppError('项目不存在', 404);
    }
    
    // 检查用户是否是项目所有者或管理员
    const isOwner = project.ownerId === userId;
    const isMember = await projectRepository.isMember(id, userId);
    
    if (!isOwner && !isMember) {
      throw new AppError('无权修改该项目', 403);
    }
    
    // 如果不是所有者，检查是否是管理员
    if (!isOwner) {
      const member = await projectRepository.findById(id);
      // 这里需要检查成员角色，简化处理
      throw new AppError('只有项目所有者可以修改项目', 403);
    }
    
    return projectRepository.update(id, data);
  }

  async delete(id: string, userId: string) {
    const project = await projectRepository.findById(id);
    
    if (!project) {
      throw new AppError('项目不存在', 404);
    }
    
    // 只有项目所有者可以删除项目
    if (project.ownerId !== userId) {
      throw new AppError('只有项目所有者可以删除项目', 403);
    }
    
    return projectRepository.delete(id);
  }

  async addMember(projectId: string, userId: string, memberId: string, role: string = 'MEMBER') {
    const project = await projectRepository.findById(projectId);
    
    if (!project) {
      throw new AppError('项目不存在', 404);
    }
    
    // 检查用户是否是项目所有者或管理员
    const isOwner = project.ownerId === userId;
    if (!isOwner) {
      throw new AppError('只有项目所有者可以添加成员', 403);
    }
    
    // 检查要添加的用户是否已经是成员
    const isAlreadyMember = await projectRepository.isMember(projectId, memberId);
    if (isAlreadyMember) {
      throw new AppError('该用户已经是项目成员', 400);
    }
    
    return projectRepository.addMember(projectId, memberId, role);
  }

  async removeMember(projectId: string, userId: string, memberId: string) {
    const project = await projectRepository.findById(projectId);
    
    if (!project) {
      throw new AppError('项目不存在', 404);
    }
    
    // 检查用户是否是项目所有者或管理员
    const isOwner = project.ownerId === userId;
    if (!isOwner) {
      throw new AppError('只有项目所有者可以移除成员', 403);
    }
    
    // 不能移除项目所有者
    if (memberId === project.ownerId) {
      throw new AppError('不能移除项目所有者', 400);
    }
    
    // 检查要移除的用户是否是成员
    const isMember = await projectRepository.isMember(projectId, memberId);
    if (!isMember) {
      throw new AppError('该用户不是项目成员', 400);
    }
    
    return projectRepository.removeMember(projectId, memberId);
  }
}
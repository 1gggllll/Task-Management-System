import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/project.service';
import { AppError } from '../errors/AppError';

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('用户未认证', 401);
      }
      const projects = await this.projectService.getAll(userId);
      res.status(200).json({
        success: true,
        data: projects
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('用户未认证', 401);
      }
      const project = await this.projectService.getById(id, userId);
      res.status(200).json({
        success: true,
        data: project
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('用户未认证', 401);
      }
      const { name, description } = req.body;
      const project = await this.projectService.create({ name, description, ownerId: userId });
      res.status(201).json({
        success: true,
        data: project
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('用户未认证', 401);
      }
      const { name, description } = req.body;
      const project = await this.projectService.update(id, userId, { name, description });
      res.status(200).json({
        success: true,
        data: project
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('用户未认证', 401);
      }
      await this.projectService.delete(id, userId);
      res.status(200).json({
        success: true,
        message: '项目删除成功'
      });
    } catch (error) {
      next(error);
    }
  };

  addMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('用户未认证', 401);
      }
      const { userId: memberId, role } = req.body;
      const member = await this.projectService.addMember(id, userId, memberId, role);
      res.status(201).json({
        success: true,
        data: member
      });
    } catch (error) {
      next(error);
    }
  };

  removeMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, userId: memberId } = req.params;
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('用户未认证', 401);
      }
      await this.projectService.removeMember(id, userId, memberId);
      res.status(200).json({
        success: true,
        message: '成员移除成功'
      });
    } catch (error) {
      next(error);
    }
  };
}
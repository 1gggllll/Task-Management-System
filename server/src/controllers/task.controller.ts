import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/task.service';
import { AppError } from '../errors/AppError';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  getByProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params;
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('用户未认证', 401);
      }
      const { status, priority, assigneeId } = req.query;
      const tasks = await this.taskService.getByProject(projectId, userId, {
        status: status as string,
        priority: priority as string,
        assigneeId: assigneeId as string
      });
      res.status(200).json({
        success: true,
        data: tasks
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
      const task = await this.taskService.getById(id, userId);
      res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params;
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('用户未认证', 401);
      }
      const { title, description, status, priority, assigneeId, dueDate } = req.body;
      const task = await this.taskService.create(projectId, userId, {
        title,
        description,
        status,
        priority,
        assigneeId,
        dueDate
      });
      res.status(201).json({
        success: true,
        data: task
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
      const { title, description, status, priority, assigneeId, dueDate } = req.body;
      const task = await this.taskService.update(id, userId, {
        title,
        description,
        status,
        priority,
        assigneeId,
        dueDate
      });
      res.status(200).json({
        success: true,
        data: task
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
      await this.taskService.delete(id, userId);
      res.status(200).json({
        success: true,
        message: '任务删除成功'
      });
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('用户未认证', 401);
      }
      const { status } = req.body;
      const task = await this.taskService.updateStatus(id, userId, status);
      res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      next(error);
    }
  };

  updateAssignee = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError('用户未认证', 401);
      }
      const { assigneeId } = req.body;
      const task = await this.taskService.updateAssignee(id, userId, assigneeId);
      res.status(200).json({
        success: true,
        data: task
      });
    } catch (error) {
      next(error);
    }
  };
}
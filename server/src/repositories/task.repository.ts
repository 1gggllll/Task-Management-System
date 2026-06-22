import { PrismaClient, Task, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class TaskRepository {
  async findById(id: string): Promise<Task | null> {
    return prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });
  }

  async create(data: Prisma.TaskCreateInput): Promise<Task> {
    return prisma.task.create({
      data,
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });
  }

  async update(id: string, data: Prisma.TaskUpdateInput): Promise<Task> {
    return prisma.task.update({
      where: { id },
      data,
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });
  }

  async delete(id: string): Promise<Task> {
    return prisma.task.delete({
      where: { id }
    });
  }

  async findByProject(projectId: string, params?: {
    status?: string;
    priority?: string;
    assigneeId?: string;
    skip?: number;
    take?: number;
  }): Promise<Task[]> {
    const { status, priority, assigneeId, skip, take } = params || {};
    
    return prisma.task.findMany({
      where: {
        projectId,
        ...(status && { status: status as any }),
        ...(priority && { priority: priority as any }),
        ...(assigneeId && { assigneeId })
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take
    });
  }

  async findByAssignee(userId: string, params?: {
    status?: string;
    projectId?: string;
    skip?: number;
    take?: number;
  }): Promise<Task[]> {
    const { status, projectId, skip, take } = params || {};
    
    return prisma.task.findMany({
      where: {
        assigneeId: userId,
        ...(status && { status: status as any }),
        ...(projectId && { projectId })
      },
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      },
      orderBy: { dueDate: 'asc' },
      skip,
      take
    });
  }

  async countByProject(projectId: string): Promise<{ status: string; count: number }[]> {
    const result = await prisma.task.groupBy({
      by: ['status'],
      where: { projectId },
      _count: true
    });
    
    return result.map(item => ({
      status: item.status,
      count: item._count
    }));
  }

  async updateStatus(id: string, status: string): Promise<Task> {
    return prisma.task.update({
      where: { id },
      data: { status: status as any },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });
  }

  async updateAssignee(id: string, assigneeId: string | null): Promise<Task> {
    return prisma.task.update({
      where: { id },
      data: { assigneeId },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });
  }
}
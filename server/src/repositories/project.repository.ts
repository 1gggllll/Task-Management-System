import { PrismaClient, Project, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class ProjectRepository {
  async findById(id: string): Promise<Project | null> {
    return prisma.project.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          }
        },
        _count: {
          select: { tasks: true }
        }
      }
    });
  }

  async create(data: Prisma.ProjectCreateInput): Promise<Project> {
    return prisma.project.create({
      data,
      include: {
        owner: {
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

  async update(id: string, data: Prisma.ProjectUpdateInput): Promise<Project> {
    return prisma.project.update({
      where: { id },
      data,
      include: {
        owner: {
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

  async delete(id: string): Promise<Project> {
    return prisma.project.delete({
      where: { id }
    });
  }

  async findByOwner(ownerId: string): Promise<Project[]> {
    return prisma.project.findMany({
      where: { ownerId },
      include: {
        _count: {
          select: { tasks: true, members: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findByMember(userId: string): Promise<Project[]> {
    return prisma.project.findMany({
      where: {
        members: {
          some: { userId }
        }
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        _count: {
          select: { tasks: true, members: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async addMember(projectId: string, userId: string, role: string = 'MEMBER') {
    return prisma.projectMember.create({
      data: {
        projectId,
        userId,
        role: role as any
      },
      include: {
        user: {
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

  async removeMember(projectId: string, userId: string) {
    return prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId,
          userId
        }
      }
    });
  }

  async isMember(projectId: string, userId: string): Promise<boolean> {
    const member = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId
        }
      }
    });
    return !!member;
  }

  async isOwner(projectId: string, userId: string): Promise<boolean> {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { ownerId: true }
    });
    return project?.ownerId === userId;
  }
}
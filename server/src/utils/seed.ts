import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 清空现有数据
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // 创建用户
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const user1 = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: '管理员'
    }
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: hashedPassword,
      name: '普通用户'
    }
  });

  // 创建项目
  const project1 = await prisma.project.create({
    data: {
      name: '示例项目1',
      description: '这是一个示例项目',
      ownerId: user1.id
    }
  });

  const project2 = await prisma.project.create({
    data: {
      name: '示例项目2',
      description: '这是另一个示例项目',
      ownerId: user2.id
    }
  });

  // 添加项目成员
  await prisma.projectMember.create({
    data: {
      projectId: project1.id,
      userId: user2.id,
      role: 'MEMBER'
    }
  });

  // 创建任务
  await prisma.task.create({
    data: {
      title: '完成项目设计',
      description: '设计项目架构和数据库模型',
      status: 'DONE',
      priority: 'HIGH',
      projectId: project1.id,
      assigneeId: user1.id,
      creatorId: user1.id
    }
  });

  await prisma.task.create({
    data: {
      title: '实现用户认证',
      description: '实现用户注册、登录功能',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      projectId: project1.id,
      assigneeId: user2.id,
      creatorId: user1.id
    }
  });

  await prisma.task.create({
    data: {
      title: '编写API文档',
      description: '使用Swagger编写API文档',
      status: 'TODO',
      priority: 'MEDIUM',
      projectId: project1.id,
      creatorId: user1.id
    }
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // 连接测试数据库
  await prisma.$connect();
});

afterAll(async () => {
  // 断开连接
  await prisma.$disconnect();
});
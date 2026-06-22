import request from 'supertest';
import { app } from '../src/app';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { config } from '../src/config';

const prisma = new PrismaClient();

describe('Project Endpoints', () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    // 清空测试数据
    await prisma.task.deleteMany();
    await prisma.projectMember.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();

    // 创建测试用户
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User'
      }
    });
    userId = user.id;

    // 生成JWT token
    token = jwt.sign({ id: userId }, config.jwtSecret, { expiresIn: '1h' });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/v1/projects', () => {
    it('should create a new project', async () => {
      const res = await request(app)
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Project',
          description: 'This is a test project'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Test Project');
      expect(res.body.data.ownerId).toBe(userId);
    });
  });

  describe('GET /api/v1/projects', () => {
    it('should get all projects for user', async () => {
      const res = await request(app)
        .get('/api/v1/projects')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /api/v1/projects/:id', () => {
    it('should get project by id', async () => {
      // 先创建项目
      const project = await prisma.project.create({
        data: {
          name: 'Test Project 2',
          description: 'Another test project',
          ownerId: userId
        }
      });

      const res = await request(app)
        .get(`/api/v1/projects/${project.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Test Project 2');
    });
  });
});
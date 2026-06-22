FROM node:18-alpine AS base

WORKDIR /app

# 安装依赖
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production

# 生成Prisma客户端
RUN npx prisma generate

# 复制源代码
COPY . .

# 构建TypeScript
RUN npm run build

# 生产阶段
FROM node:18-alpine AS production

WORKDIR /app

# 复制构建结果和依赖
COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./
COPY --from=base /app/prisma ./prisma

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "dist/index.js"]
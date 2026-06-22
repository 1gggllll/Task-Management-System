import { authAPI } from '../api/auth';
import { LoginCredentials, RegisterData, User } from '../types';

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await authAPI.login(credentials);
    if (response.success && response.data) {
      localStorage.setItem('token', response.data.token);
      return response.data;
    }
    throw new Error(response.error?.message || '登录失败');
  }

  static async register(data: RegisterData): Promise<{ user: User; token: string }> {
    const response = await authAPI.register(data);
    if (response.success && response.data) {
      localStorage.setItem('token', response.data.token);
      return response.data;
    }
    throw new Error(response.error?.message || '注册失败');
  }

  static async getProfile(): Promise<User> {
    const response = await authAPI.getProfile();
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error?.message || '获取用户信息失败');
  }

  static async updateProfile(data: { name?: string; avatar?: string }): Promise<User> {
    const response = await authAPI.updateProfile(data);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error?.message || '更新用户信息失败');
  }

  static logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  static isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  static getToken(): string | null {
    return localStorage.getItem('token');
  }
}
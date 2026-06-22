import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const tasksAPI = {
  getByProject: (projectId: string, filters?: {
    status?: string;
    priority?: string;
    assigneeId?: string;
  }) => api.get(`/projects/${projectId}/tasks`, { params: filters }),
  
  getById: (id: string) => api.get(`/tasks/${id}`),
  
  create: (projectId: string, data: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    assigneeId?: string;
    dueDate?: string;
  }) => api.post(`/projects/${projectId}/tasks`, data),
  
  update: (id: string, data: {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    assigneeId?: string;
    dueDate?: string;
  }) => api.put(`/tasks/${id}`, data),
  
  delete: (id: string) => api.delete(`/tasks/${id}`),
  
  updateStatus: (id: string, status: string) =>
    api.patch(`/tasks/${id}/status`, { status }),
  
  updateAssignee: (id: string, assigneeId: string | null) =>
    api.patch(`/tasks/${id}/assignee`, { assigneeId })
};
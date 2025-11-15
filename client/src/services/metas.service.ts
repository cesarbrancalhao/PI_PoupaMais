import { apiService } from './api';
import { Meta, CreateMetaDto, UpdateMetaDto } from '@/types';

export const metasService = {
  async getAll(page = 1, limit = 100): Promise<{ data: Meta[]; total: number; page: number; limit: number }> {
    return apiService.get(`/metas?page=${page}&limit=${limit}`);
  },

  async getById(id: number): Promise<Meta> {
    return apiService.get(`/metas/${id}`);
  },

  async create(data: CreateMetaDto): Promise<Meta> {
    return apiService.post('/metas', data);
  },

  async update(id: number, data: UpdateMetaDto): Promise<Meta> {
    return apiService.put(`/metas/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return apiService.delete(`/metas/${id}`);
  },
};

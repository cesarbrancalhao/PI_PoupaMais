import { apiService } from './api';
import { Despesa, CreateDespesaDto, UpdateDespesaDto } from '@/types';

export const despesasService = {
  async getAll(page = 1, limit = 10): Promise<{ data: Despesa[]; total: number; page: number; limit: number }> {
    return apiService.get(`/despesas?page=${page}&limit=${limit}`);
  },

  async getById(id: number): Promise<Despesa> {
    return apiService.get(`/despesas/${id}`);
  },

  async create(data: CreateDespesaDto): Promise<Despesa> {
    return apiService.post('/despesas', data);
  },

  async update(id: number, data: UpdateDespesaDto): Promise<Despesa> {
    return apiService.put(`/despesas/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return apiService.delete(`/despesas/${id}`);
  },
};

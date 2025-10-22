import { apiService } from './api';
import { Receita, CreateReceitaDto, UpdateReceitaDto } from '@/types';

export const receitasService = {
  async getAll(page = 1, limit = 10): Promise<{ data: Receita[]; total: number; page: number; limit: number }> {
    return apiService.get(`/receitas?page=${page}&limit=${limit}`);
  },

  async getById(id: number): Promise<Receita> {
    return apiService.get(`/receitas/${id}`);
  },

  async create(data: CreateReceitaDto): Promise<Receita> {
    return apiService.post('/receitas', data);
  },

  async update(id: number, data: UpdateReceitaDto): Promise<Receita> {
    return apiService.put(`/receitas/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return apiService.delete(`/receitas/${id}`);
  },
};

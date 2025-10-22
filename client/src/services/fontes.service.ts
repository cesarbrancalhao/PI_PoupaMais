import { apiService } from './api';
import { FonteReceita, CreateFonteReceitaDto, UpdateFonteReceitaDto } from '@/types';

export const fontesReceitaService = {
  async getAll(): Promise<FonteReceita[]> {
    return apiService.get('/fonte-receita');
  },

  async getById(id: number): Promise<FonteReceita> {
    return apiService.get(`/fonte-receita/${id}`);
  },

  async create(data: CreateFonteReceitaDto): Promise<FonteReceita> {
    return apiService.post('/fonte-receita', data);
  },

  async update(id: number, data: UpdateFonteReceitaDto): Promise<FonteReceita> {
    return apiService.put(`/fonte-receita/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return apiService.delete(`/fonte-receita/${id}`);
  },
};

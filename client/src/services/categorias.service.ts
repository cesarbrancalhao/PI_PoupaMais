import { apiService } from './api';
import { CategoriaDespesa, CreateCategoriaDespesaDto, UpdateCategoriaDespesaDto } from '@/types';

export const categoriasDespesaService = {
  async getAll(): Promise<CategoriaDespesa[]> {
    return apiService.get('/categoria-despesa');
  },

  async getById(id: number): Promise<CategoriaDespesa> {
    return apiService.get(`/categoria-despesa/${id}`);
  },

  async create(data: CreateCategoriaDespesaDto): Promise<CategoriaDespesa> {
    return apiService.post('/categoria-despesa', data);
  },

  async update(id: number, data: UpdateCategoriaDespesaDto): Promise<CategoriaDespesa> {
    return apiService.put(`/categoria-despesa/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return apiService.delete(`/categoria-despesa/${id}`);
  },
};

import { apiService } from './api';
import { ReceitaExclusao } from '@/types';

export const receitasExclusaoService = {
  async create(receitaId: number, dataExclusao: string): Promise<ReceitaExclusao> {
    return apiService.post(`/receitas/${receitaId}/exclusoes`, { data_exclusao: dataExclusao });
  },

  async getAll(): Promise<ReceitaExclusao[]> {
    return apiService.get('/receitas/exclusoes/all');
  },

  async delete(id: number): Promise<void> {
    return apiService.delete(`/receitas/exclusoes/${id}`);
  },
};


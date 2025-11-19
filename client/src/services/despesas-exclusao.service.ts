import { apiService } from './api';
import { DespesaExclusao } from '@/types';

export const despesasExclusaoService = {
  async create(despesaId: number, dataExclusao: string): Promise<DespesaExclusao> {
    return apiService.post(`/despesas/${despesaId}/exclusoes`, { data_exclusao: dataExclusao });
  },

  async getAll(): Promise<DespesaExclusao[]> {
    return apiService.get('/despesas/exclusoes/all');
  },

  async delete(id: number): Promise<void> {
    return apiService.delete(`/despesas/exclusoes/${id}`);
  },
};


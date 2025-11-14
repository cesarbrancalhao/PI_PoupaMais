import { apiService } from './api';
import { ContribuicaoMeta, CreateContribuicaoMetaDto, UpdateContribuicaoMetaDto } from '@/types';

export const contribuicaoMetaService = {
  async getAll(page = 1, limit = 100): Promise<{ data: ContribuicaoMeta[]; total: number; page: number; limit: number }> {
    return apiService.get(`/contribuicao-meta?page=${page}&limit=${limit}`);
  },

  async getAllByMeta(metaId: number, page = 1, limit = 100): Promise<{ data: ContribuicaoMeta[]; total: number; page: number; limit: number }> {
    return apiService.get(`/contribuicao-meta/meta/${metaId}?page=${page}&limit=${limit}`);
  },

  async getById(id: number): Promise<ContribuicaoMeta> {
    return apiService.get(`/contribuicao-meta/${id}`);
  },

  async create(data: CreateContribuicaoMetaDto): Promise<ContribuicaoMeta> {
    return apiService.post('/contribuicao-meta', data);
  },

  async update(id: number, data: UpdateContribuicaoMetaDto): Promise<ContribuicaoMeta> {
    return apiService.put(`/contribuicao-meta/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return apiService.delete(`/contribuicao-meta/${id}`);
  },
};

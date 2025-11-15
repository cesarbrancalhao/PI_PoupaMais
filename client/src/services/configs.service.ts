import { apiService } from './api';
import { UserConfigs, UpdateConfigsRequest } from '@/types/configs';

export const configsService = {
  async get(): Promise<UserConfigs> {
    return apiService.get('/configs');
  },

  async update(data: UpdateConfigsRequest): Promise<UserConfigs> {
    return apiService.put('/configs', data);
  },
};

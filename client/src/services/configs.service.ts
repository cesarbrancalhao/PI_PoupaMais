import { apiService } from './api';
import { UserConfigs, UpdateConfigsRequest } from '@/types/configs';

export const configsService = {
  async getConfig(): Promise<UserConfigs> {
    return apiService.get('/configs');
  },

  async update(data: UpdateConfigsRequest): Promise<UserConfigs> {
    return apiService.put('/configs', data);
  },
};

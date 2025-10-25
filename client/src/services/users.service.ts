import { apiService } from './api';

export interface UserProfile {
  nome: string;
}

export const usersService = {
  async getProfile(): Promise<UserProfile> {
    return apiService.get('/users/profile');
  },
};

import { apiService } from './api';

export interface UserProfile {
  nome: string;
}

export const usersService = {
  async getProfile(): Promise<UserProfile> {
    return apiService.get('/users/profile');
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return apiService.put('/users/change-password', { currentPassword, newPassword });
  },
};

import { apiService } from './api';
import { User } from '@/types/auth';

export interface UserProfile {
  nome: string;
}

export const usersService = {
  async getProfile(): Promise<UserProfile> {
    return apiService.get('/users/profile');
  },

  async updateProfile(nome: string, email: string): Promise<User> {
    return apiService.put('/users/profile', { nome, email });
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return apiService.put('/users/change-password', { currentPassword, newPassword });
  },
};

import { apiService } from './api';
import { User, Idioma, Moeda } from '@/types/auth';

export const usersService = {
  async getProfile(): Promise<User> {
    return apiService.get('/users/profile');
  },

  async updateProfile(nome: string, email: string): Promise<User> {
    return apiService.put('/users/profile', { nome, email });
  },

  async updateSettings(tema: boolean, idioma: Idioma, moeda: Moeda): Promise<User> {
    return apiService.put('/users/settings', { tema, idioma, moeda });
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return apiService.put('/users/change-password', { currentPassword, newPassword });
  },
};

import { apiService } from './api';

interface VerifyCodeRequest {
  email: string;
  code: string;
}

interface VerifyCodeResponse {
  access_token: string;
  user: {
    id: number;
    nome: string;
    email: string;
    created_at?: string;
  };
}

class VerificationService {
  async verifyCode(email: string, code: string): Promise<VerifyCodeResponse> {
    try {
      const response = await apiService.post<VerifyCodeResponse>('/auth/verify', {
        email,
        code: code.toUpperCase(),
      } as VerifyCodeRequest);

      return response;
    } catch (error) {
      throw this.handleVerificationError(error);
    }
  }

  private handleVerificationError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    return new Error('Erro ao verificar código. Tente novamente');
  }
}

export const verificationService = new VerificationService();

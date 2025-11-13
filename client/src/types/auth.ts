export interface User {
  id: number;
  nome: string;
  email: string;
  created_at?: string;
  tema?: boolean;  
  idioma?: "portugues" | "ingles" | "espanhol";
  moeda?: "real" | "dolar" | "euro";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface AuthError {
  message: string;
  statusCode?: number;
}
